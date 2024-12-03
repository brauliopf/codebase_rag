import { v } from "convex/values";
import { action } from "./_generated/server";

export const listRepositoryFiles = action({
  args: {
    owner: v.string(),
    repo: v.string(),
    path: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // GitHub API base URL
    const baseUrl = "https://api.github.com";

    // Construct the API endpoint for listing repository contents
    const endpoint = `${baseUrl}/repos/${args.owner}/${args.repo}/contents/${args.path || ""}`;

    try {
      // Fetch files from GitHub API
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Accept: "application/vnd.github.v3+json",
          // Optional: Add GitHub access token for higher rate limits
          // 'Authorization': `token ${process.env.GITHUB_TOKEN}`
        },
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`GitHub API responded with status: ${response.status}`);
      }

      // Parse the JSON response
      const files = await response.json();

      // Transform the response to a more usable format
      return files.map((file: any) => ({
        name: file.name,
        path: file.path,
        type: file.type, // 'file' or 'dir'
        size: file.size,
        downloadUrl: file.download_url,
      }));
    } catch (error) {
      // Log the error and rethrow
      console.error("Error fetching repository files:", error);
      throw error;
    }
  },
});
