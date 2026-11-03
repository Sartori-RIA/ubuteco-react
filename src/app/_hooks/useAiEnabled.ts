"use client";

import {useAuthCapabilities} from "@/app/_hooks/useAuthCapabilities";
import {User} from "@/app/_types";

export function aiEnabledFor(user: User | null | undefined): boolean {
  return user?.organization?.ai_enabled === true;
}

export function useAiEnabled(): boolean {
  const {user} = useAuthCapabilities();
  return aiEnabledFor(user);
}
