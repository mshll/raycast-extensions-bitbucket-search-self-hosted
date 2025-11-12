/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** URL - Bitbucket URL */
  "baseURL": string,
  /** Personal Access Token - Bitbucket Personal Access Token */
  "token": string,
  /** Unsafe HTTPS - Disable SSL certificate validation (use for self-signed certificates) */
  "unsafeHTTPS": boolean
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `searchRepositories` command */
  export type SearchRepositories = ExtensionPreferences & {}
  /** Preferences accessible in the `searchMyOpenPullRequests` command */
  export type SearchMyOpenPullRequests = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `searchRepositories` command */
  export type SearchRepositories = {}
  /** Arguments passed to the `searchMyOpenPullRequests` command */
  export type SearchMyOpenPullRequests = {}
}

