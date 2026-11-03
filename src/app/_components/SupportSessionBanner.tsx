"use client";

import {SupportSessionState} from "@/app/_lib/auth-storage";
import {useTranslations} from "@/app/_hooks/useTranslations";

type Props = {
  session: SupportSessionState;
  onLeave: () => void;
};

export function SupportSessionBanner({session, onLeave}: Props) {
  const t = useTranslations();
  const expiry = new Date(session.expiresAt).toLocaleString();

  return (
    <div className="flex shrink-0 items-center justify-between gap-3 bg-amber-600 px-4 py-2 text-sm text-amber-950">
      <p>
        {t("supportSession.banner", {
          name: session.userName,
          organization: session.organizationName,
          time: expiry,
        })}
      </p>
      <button type="button" onClick={onLeave} className="rounded bg-amber-950 px-3 py-1 font-medium text-amber-50">
        {t("supportSession.leave")}
      </button>
    </div>
  );
}
