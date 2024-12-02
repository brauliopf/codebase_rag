// Defines the database tables and types

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// v is a helper object that will both define the TypeScript object type and validate it during runtime
export default defineSchema({
  // users
  users: defineTable({
    username: v.string(),
    image: v.string(),
    clerkId: v.string(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_username", ["username"]),

  // friends
  friends: defineTable({
    sender: v.id("users"),
    target: v.id("users"),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("rejected")
    ),
  })
    .index("by_sender_status", ["sender", "status"])
    .index("by_target_status", ["target", "status"]),

  // direct messages
  directMessages: defineTable({}),
  directMessageMembers: defineTable({
    directMessage: v.id("directMessages"),
    user: v.id("users"),
  })
    .index("by_direct_message", ["directMessage"])
    .index("by_direct_message_user", ["directMessage", "user"])
    .index("by_user", ["user"]),

  // messages
  messages: defineTable({
    sender: v.id("users"),
    content: v.string(),
    directMessage: v.id("directMessages"),
    attachment: v.optional(v.id("_storage")),
    deleted: v.optional(v.boolean()),
    deletedReason: v.optional(v.string()),
  }).index("by_direct_message", ["directMessage"]),

  // ----

  // repos
  repos: defineTable({
    username: v.string(),
    url: v.string(),
    name: v.string(),
  })
    .index("name", ["name"])
    .index("by_username", ["username"]),

  // chats
  chats: defineTable({}),
  chatMembers: defineTable({
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
