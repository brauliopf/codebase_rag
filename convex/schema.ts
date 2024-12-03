// Defines the database tables and types

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// v is a helper object that will both define the TypeScript object type and validate it during runtime
export default defineSchema({
  // users
  users: defineTable({
    email: v.string(),
    image: v.string(),
    clerkId: v.string(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  // repos
  repos: defineTable({
    username: v.string(),
    url: v.string(),
    name: v.string(),
    db_id: v.string(),
  })
    .index("name", ["name"])
    .index("by_username", ["username"]),

  // chats
  chats: defineTable({}),
  chatParticipants: defineTable({
    chat: v.id("chats"),
    participant: v.union(v.id("users"), v.id("repos")),
  })
    .index("by_chat", ["chat"])
    .index("by_chat_participant", ["chat", "participant"])
    .index("by_participant", ["participant"]),

  // msgs
  msgs: defineTable({
    sender: v.union(v.id("users"), v.id("repos")),
    content: v.string(),
    chat: v.id("chats"),
    deleted: v.optional(v.boolean()),
  }).index("by_chat", ["chat"]),
});
