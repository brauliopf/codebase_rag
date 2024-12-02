import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";
import { authenticatedMutation, authenticatedQuery } from "./helpers";

/*
 * listPending: all rows with target as current user and status pending
 * Params:
 ** ctx: QueryCtx
 * Returns:
 ** An array of objects composed of a friends request and a user object
 */
export const listPending = authenticatedQuery({
  handler: async (ctx) => {
    const friends = await ctx.db
      .query("friends")
      .withIndex("by_target_status", (q) =>
        q.eq("target", ctx.user._id).eq("status", "pending")
      )
      .collect();
    // get the sender of the friends
    return await getUserDetails(ctx, friends, "sender");
  },
});

export const listPendingOutgoing = authenticatedQuery({
  handler: async (ctx) => {
    // friends: (~connections) all rows current user as sender and pending status
    const friendRequestOutgoing = await ctx.db
      .query("friends")
      .withIndex("by_sender_status", (q) =>
        q.eq("sender", ctx.user._id).eq("status", "pending")
      )
      .collect();
    // get the sender of the friends
    return await getUserDetails(ctx, friendRequestOutgoing, "target");
  },
});

/**
 * list all friends (requests) with status accepted
 */
export const listAccepted = authenticatedQuery({
  handler: async (ctx) => {
    const friends1 = await ctx.db
      .query("friends")
      .withIndex("by_sender_status", (q) =>
        q.eq("sender", ctx.user._id).eq("status", "accepted")
      )
      .collect();
    const friends2 = await ctx.db
      .query("friends")
      .withIndex("by_target_status", (q) =>
        q.eq("target", ctx.user._id).eq("status", "accepted")
      )
      .collect();
    // get the target of the friends that current user is the sender
    const friendsWithUser1 = await getUserDetails(ctx, friends1, "target");
    // get the sender of the friends that current user is the target
    const friendsWithUser2 = await getUserDetails(ctx, friends2, "sender");
    return [...friendsWithUser1, ...friendsWithUser2];
  },
});

// create a friend request from the current user to the {user id}
export const createFriendRequest = authenticatedMutation({
  args: {
    username: v.string(),
  },
  handler: async (ctx, { username }) => {
    // lookup user by username
    const target = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", username))
      .unique();
    // handle error if user not found
    if (!target) throw new Error("User not found");
    else if (target._id === ctx.user._id) throw new Error("Cannot add self");

    // create a friend request
    await ctx.db.insert("friends", {
      sender: ctx.user._id,
      target: target._id,
      status: "pending",
    });
  },
});

export const updateStatus = authenticatedMutation({
  args: {
    id: v.id("friends"),
    status: v.union(v.literal("accepted"), v.literal("rejected")),
  },
  handler: async (ctx, { id, status }) => {
    // find the friend with the id
    const friend = await ctx.db.get(id);
    if (!friend) throw new Error("Friend not found");
    if (friend.sender !== ctx.user._id && friend.target !== ctx.user._id) {
      throw new Error("Unauthorized");
    }
    // update the status
    await ctx.db.patch(id, { status });
  },
});

/**
 * use a generic function to map over the friends and get the user object
 * SYNTAX: function name = <generic parameters>(parameter list) => {handler}
 * Function call: getPartyOfInterest(ctx, friends, "sender");
 *
 * Args:
 ** ctx: QueryCtx
 ** items: array of friends requests with a user Id in a property called {role}
 ** key: "sender" | "target"
 * Returns:
 ** A spread of friends request with a user object in a property called user
 */
const getUserDetails = async <
  role extends "sender" | "target",
  T extends { [key in role]: Id<"users"> },
>(
  ctx: QueryCtx,
  requests: T[],
  role: role
) => {
  const result = await Promise.allSettled(
    requests.map(async (request) => {
      const user = await ctx.db.get(request[role]);
      if (!user) throw new Error("User not found");
      return { ...request, user };
    })
  );
  return result.filter((r) => r.status === "fulfilled").map((r) => r.value);
};
