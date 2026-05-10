/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin_helpers from "../admin/helpers.js";
import type * as admin_todos from "../admin/todos.js";
import type * as auth from "../auth.js";
import type * as authed__shared from "../authed/_shared.js";
import type * as authed_helpers from "../authed/helpers.js";
import type * as authed_todos from "../authed/todos.js";
import type * as private_helpers from "../private/helpers.js";
import type * as private_todos from "../private/todos.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "admin/helpers": typeof admin_helpers;
  "admin/todos": typeof admin_todos;
  auth: typeof auth;
  "authed/_shared": typeof authed__shared;
  "authed/helpers": typeof authed_helpers;
  "authed/todos": typeof authed_todos;
  "private/helpers": typeof private_helpers;
  "private/todos": typeof private_todos;
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
