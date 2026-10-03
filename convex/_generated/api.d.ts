/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ResendOTP from "../ResendOTP.js";
import type * as assistantPrompt from "../assistantPrompt.js";
import type * as auth from "../auth.js";
import type * as chat from "../chat.js";
import type * as chatRules from "../chatRules.js";
import type * as contact from "../contact.js";
import type * as contactRules from "../contactRules.js";
import type * as http from "../http.js";
import type * as macaly from "../macaly.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  ResendOTP: typeof ResendOTP;
  assistantPrompt: typeof assistantPrompt;
  auth: typeof auth;
  chat: typeof chat;
  chatRules: typeof chatRules;
  contact: typeof contact;
  contactRules: typeof contactRules;
  http: typeof http;
  macaly: typeof macaly;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
