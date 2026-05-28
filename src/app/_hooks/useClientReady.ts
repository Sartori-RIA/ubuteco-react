"use client";

import {useSyncExternalStore} from "react";

/** True only after mount — use before reading localStorage or other browser-only APIs. */
export function useClientReady(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
