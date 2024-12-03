import { ConvexError, v } from "convex/values";
import { authenticatedMutation } from "./helpers";
import { action, ActionCtx } from "../_generated/server";
import { api } from "../_generated/api";

async function getEmbeddings(ctx: ActionCtx, url: string) {
  // list files

  return true;
}

export const embedRepo = action({
  args: {
    url: v.string(),
  },
  handler: async (ctx, { url }) => {
    // *** check if repo exists in github

    const owner = url.split("/")[url.split("/").length - 2];
    const repo = url.split("/")[url.split("/").length - 1];

    console.log("getEmbeddings", owner, repo, url);
    const files = await ctx.runAction(api.github.listRepositoryFiles, {
      owner,
      repo,
    });

    for (const file of files) {
      console.log(file.name, file.path, file.type, file.size, file.downloadUrl);
    }

    if (!repo) throw new Error("Repo not found");
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
    // repo = ''
    // if (!repo) throw new Error("Repo not found");
  },
});
