import { getPreferenceValues } from "@raycast/api";
import fetch, { FetchError, Response } from "node-fetch";
import { ErrorText, PresentableError } from "./exception";
import * as https from "https";

const prefs: { domain: string; token: string; unsafeHTTPS: boolean } = getPreferenceValues();
export const bitbucketUrl = `https://${prefs.domain}`;

const headers = {
  Accept: "application/json",
  Authorization: `Bearer ${prefs.token}`,
  "Content-Type": "application/json",
};
const agent = new https.Agent({ rejectUnauthorized: !prefs.unsafeHTTPS });
const init = {
  headers,
  agent,
};

type QueryParams = { [key: string]: string | number };
type StatusErrors = { [key: number]: ErrorText };

/**
 * Fetches a JSON object of type `Result` or throws an exception if the request fails or returns a non-okay status code.
 * @param path the Bitbucket path (without domain) to fetch
 * @param params an object defining the query params to request
 * @param statusErrors define custom error texts for response status codes to be thrown
 * @throws if the response's status code is not okay
 * @return the bitbucket response
 */
export async function bitbucketFetchObject<Result>(
  path: string,
  params: QueryParams = {},
  statusErrors?: StatusErrors
): Promise<Result> {
  const response = await bitbucketFetch(path, params, statusErrors);
  return (await response.json()) as unknown as Result;
}

/**
 * Fetches a response from Bitbucket or throws an exception if the request fails or returns a non-okay status code.
 * @param path the Bitbucket path (without domain) to fetch
 * @param params an object defining the query params to request
 * @param statusErrors define custom error texts for response status codes to be thrown
 * @throws if the response's status code is not okay
 * @return the bitbucket response
 */
export async function bitbucketFetch(
  path: string,
  params: QueryParams = {},
  statusErrors?: StatusErrors
): Promise<Response> {
  const paramKeys = Object.keys(params);
  const query = paramKeys.map((key) => `${key}=${encodeURIComponent(params[key])}`).join("&");
  try {
    const sanitizedPath = path.startsWith("/") ? path.substring(1) : path;
    const url = `${bitbucketUrl}/${sanitizedPath}` + (query.length > 0 ? `?${query}` : "");
    const response = await fetch(url, init);
    throwIfResponseNotOkay(response, statusErrors);
    return response;
  } catch (error) {
    if (error instanceof FetchError) throw Error("Check your network connection");
    else throw error;
  }
}

const defaultStatusErrors: StatusErrors = {
  401: ErrorText("Bitbucket Authentication failed", "Check your Bitbucket credentials in the preferences."),
};

function throwIfResponseNotOkay(response: Response, statusErrors?: StatusErrors) {
  if (!response.ok) {
    const status = response.status;
    const definedStatus = statusErrors ? { ...defaultStatusErrors, ...statusErrors } : defaultStatusErrors;
    const exactStatusError = definedStatus[status];
    if (exactStatusError) throw new PresentableError(exactStatusError.name, exactStatusError.message);
    else if (status >= 500) throw new PresentableError("Bitbucket Error", `Server error ${status}`);
    else throw new PresentableError("Bitbucket Error", `Request error ${status}`);
  }
}
