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
import type * as functions_dms from "../functions/dms.js";
import type * as functions_friends from "../functions/friends.js";
import type * as functions_helpers from "../functions/helpers.js";
import type * as functions_message from "../functions/message.js";
import type * as functions_storage from "../functions/storage.js";
import type * as functions_user from "../functions/user.js";
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
  "functions/dms": typeof functions_dms;
  "functions/friends": typeof functions_friends;
  "functions/helpers": typeof functions_helpers;
  "functions/message": typeof functions_message;
  "functions/storage": typeof functions_storage;
  "functions/user": typeof functions_user;
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