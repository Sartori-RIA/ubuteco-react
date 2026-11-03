import {User} from "@/app/_types";
import {getAuthToken, setSupportSession, SupportSessionState} from "@/app/_lib/auth-storage";
import {apiFetch} from "@/app/_services/api-fetch";

export type StartedSupportSession = {
  id: number;
  token: string;
  expires_at: string;
  user: User;
  organization: {id: number; name: string};
};

export async function startImpersonation(userId: number, reason: string): Promise<StartedSupportSession> {
  return await apiFetch<StartedSupportSession>("v1/platform/impersonations", {
    method: "POST",
    body: JSON.stringify({user_id: userId, reason}),
  });
}

export async function leaveImpersonation(id: number): Promise<void> {
  const actorToken = getAuthToken();
  await apiFetch<void>(`v1/platform/impersonations/${id}`, {
    method: "DELETE",
    headers: actorToken ? {Authorization: `Bearer ${actorToken}`} : {},
  });
}

export function beginSupportSession(started: StartedSupportSession, actorUser: User): SupportSessionState {
  const session: SupportSessionState = {
    id: started.id,
    token: started.token,
    expiresAt: started.expires_at,
    userName: started.user.name ?? started.user.email ?? "",
    organizationName: started.organization.name,
    actorUser,
    targetUser: {
      ...started.user,
      organization: {id: started.organization.id, name: started.organization.name} as User["organization"],
    },
  };
  setSupportSession(session);
  return session;
}
