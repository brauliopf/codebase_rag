// functions to interact with the msgs table

import { ConvexError, v } from "convex/values";
import { Doc, Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";
import { authenticatedMutation, authenticatedQuery } from "./helpers";
import { internal } from "../_generated/api";

// return all messages
// query is a function that fetches data
// 'collect()' gathers and returns it all
// ctx: is a common object in convex. It is used to provide access to utilities and services, such as the DB.
// query functions use ".collect()" to gather the output and expose in the return statement.
// handler: is a function that defines the logic for processing a query or mutation.
export const list = authenticatedQuery({
  args: {
    chat: v.id("chats"),
  },
  handler: async (ctx, { chat }) => {
    // get the user object
    const member = await userMessageAuthorization(ctx, chat);
    if (!member) throw new Error("You are not a member of this chat");

    const msgs = await ctx.db
      .query("msgs")
      .withIndex("by_chat", (q) => q.eq("chat", chat))
      .collect();
    return await Promise.all(
      msgs.map(async (msg) => {
        const sender = await ctx.db.get(msg.sender);
        return {
          ...msg,
          sender,
        };
      })
    );
  },
});

// create a new message
// mutation is a function that modifies data in a db (also creates it)
// conve requires use the "v" object to assign types and enable runtime verification
export const create = authenticatedMutation({
  args: {
    content: v.string(),
    chat: v.id("chats"),
  },
  handler: async (ctx, { content, chat }) => {
    const welcome = await userMessageAuthorization(ctx, chat);
    if (!welcome) throw new Error("You are not a member of this chat");
    const messageId = await ctx.db.insert("msgs", {
      sender: ctx.user._id,
      chat: chat,
      content,
    });
  },
});

const userMessageAuthorization = async (
  ctx: QueryCtx & { user: Doc<"users"> },
  chat: Id<"chats">
) => {
  const member = await ctx.db
    .query("chatParticipants")
    .withIndex("by_chat_participant", (q) =>
      q.eq("chat", chat).eq("participant", ctx.user._id)
    )
    .first();
  if (!member) throw new ConvexError("You are not a member of this chat");
  else return true;
};

export const remove = authenticatedMutation({
  args: {
    id: v.id("msgs"),
  },
  handler: async (ctx, { id }) => {
    const msg = await ctx.db.get(id);
    if (!msg) throw new Error("Message not found");
    if (msg.sender !== ctx.user._id)
      throw new Error("You are not the sender of this message");

    await ctx.db.delete(id);
  },
});
