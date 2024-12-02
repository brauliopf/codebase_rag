import { ConvexError, v } from "convex/values";
import { authenticatedMutation, authenticatedQuery } from "./helpers";
import { QueryCtx } from "../_generated/server";
import { Doc, Id } from "../_generated/dataModel";
import { Octokit, App } from "octokit";

// This creates a new instance of the Octokit App class.
const reviewApp = new App({
  appId: process.env.GITHUB_APP_ID,
  privateKey: process.env.GITHUB_PRIVATE_KEY,
  webhooks: {
    secret: process.env.GITHUB_WEBHOOK_SECRET,
  },
});

/**
 * get all chats for the current user
 * returns an array of chat objects
 */
export const list = authenticatedQuery({
  handler: async (ctx) => {
    const chats = await ctx.db
      .query("chatMembers")
      .withIndex("by_participant", (q) => q.eq("participant", ctx.user._id))
      .collect();
    return await Promise.all(chats.map((chat) => getChat(ctx, chat.chat)));
  },
});

/**
 * verify that the user is a member of the dm
 * get dm by id, having user as current user (ctx.user._id)
 */
export const get = authenticatedQuery({
  args: {
    id: v.id("chats"),
  },
  handler: async (ctx, { id }) => {
    const members = await ctx.db
      .query("chatMembers")
      .withIndex("by_chat_participant", (q) =>
        q.eq("chat", id).eq("participant", ctx.user._id)
      )
      .first();
    if (!members) {
      throw new ConvexError("User is not a member of this direct message");
    }
    // if all good, return the dm object
    return await getChat(ctx, id);
  },
});

/**
 * create a new chat with the current user and the repo with the given url
 * returns the id of the new chat
 */
export const create = authenticatedMutation({
  args: {
    url: v.string(),
  },
  handler: async (ctx, { url }) => {
    // *** check if repo exists in github
    const repo = {};
    // if (!repo) throw new Error("Repo not found");

    // check if chat already exists
    const chatsForCurrentUser = await ctx.db
      .query("chatMembers")
      .withIndex("by_participant", (q) => q.eq("participant", ctx.user._id))
      .collect();
    const chatsForRepo = await ctx.db
      .query("chatMembers")
      // @ts-ignore
      .withIndex("by_participant", (q) => q.eq("participant", repo._id))
      .collect();
    const chat = chatsForCurrentUser.find((dm) =>
      chatsForRepo.find((dm2) => dm2.chat === dm.chat)
    );
    if (chat) return chat.chat;
    const newChat = await ctx.db.insert("chats", {});
    await Promise.all([
      ctx.db.insert("chatMembers", {
        chat: newChat,
        participant: ctx.user._id,
      }),
      ctx.db.insert("chatMembers", {
        chat: newChat,
        participant: repo._id,
      }),
    ]);
    return newChat;
  },
});

/**
 * @param ctx: (& === intersection) QueryCtx & { user: Doc<"users"> }
 * @param id: Id<"directMessages">
 * @returns spread dm and user object
 */
const getChat = async (
  ctx: QueryCtx & { user?: Doc<"users">; repo?: Doc<"repos"> },
  id: Id<"chats">
) => {
  // get chat object
  const chat = await ctx.db.get(id);
  if (!chat) throw new Error("Chat not found");

  // get the repo of the DM
  const repo = await ctx.db
    .query("chatMembers")
    .withIndex("by_chat", (q) => q.eq("chat", id))
    .filter((q) => q.neq(q.field("participant"), ctx.user!._id))
    .first();
  if (!repo) {
    throw new ConvexError("Chat does not have another participant");
  }
  const repo_obj = await ctx.db.get(repo.participant);
  if (!repo_obj) {
    throw new ConvexError("Repo not found");
  }
  return {
    ...chat,
    repo_obj,
  };
};
