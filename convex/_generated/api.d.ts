/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as functions_chats from "../functions/chats.js";
import type * as functions_helpers from "../functions/helpers.js";
import type * as functions_msgs from "../functions/msgs.js";
import type * as functions_repos from "../functions/repos.js";
import type * as functions_users from "../functions/users.js";
import type * as github from "../github.js";
import type * as http from "../http.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "functions/chats": typeof functions_chats;
  "functions/helpers": typeof functions_helpers;
  "functions/msgs": typeof functions_msgs;
  "functions/repos": typeof functions_repos;
  "functions/users": typeof functions_users;
  github: typeof github;
  http: typeof http;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
