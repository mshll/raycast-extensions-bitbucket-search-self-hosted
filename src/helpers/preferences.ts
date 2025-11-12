import { getPreferenceValues } from "@raycast/api";

export const preferences: Preferences = getPreferenceValues();

export interface Preferences {
  token: string;
  domain: string;
  unsafeHTTPS: boolean;
}
