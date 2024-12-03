import { QueryCtx } from "../_generated/server";
import { authenticatedMutation } from "./helpers";
import { v } from "convex/values";

export const create = authenticatedMutation({
  args: { url: v.string() },
  handler: async (ctx, { url }: { url: string }) => {
    console.log(url);
  },
});
