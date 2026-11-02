"use client";

import {FormEvent, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {User} from "@/app/_types";
import {Buttons, Card, FormErrors, Input, Loading} from "@/app/_components";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {getAuthUser} from "@/app/_lib/auth-storage";
import {ApiError} from "@/app/_services/api-fetch";
import {beginSupportSession, startImpersonation} from "@/app/_services/impersonation.service";
import {platformOrganizationsService} from "@/app/_services/platform-organizations.service";
import {resolveApiErrorMessages} from "@/app/_lib/resolve-api-errors";
import {useAppDispatch} from "@/app/_store/hooks";
import {setAuthenticatedUser} from "@/app/_store/features/auth/authSlice";

type Props = {
  organizationId: number;
  organizationName: string;
};

export function OrganizationSupportUsers({organizationId, organizationName}: Props) {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState<User | null>(null);
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<string[] | undefined>();

  useEffect(() => {
    let cancelled = false;
    void platformOrganizationsService.fetchUsers(organizationId).then((response) => {
      if (!cancelled) setUsers(response.data);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [organizationId]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!target?.id) return;
    if (reason.trim().length < 10) {
      setErrors([t("supportSession.reasonTooShort")]);
      return;
    }
    const actor = getAuthUser();
    if (!actor) return;
    setErrors(undefined);
    try {
      const started = await startImpersonation(target.id, reason.trim());
      beginSupportSession(started, actor);
      dispatch(setAuthenticatedUser(started.user));
      router.push("/");
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors(resolveApiErrorMessages({errors: error.items}, t));
      } else {
        setErrors([t("supportSession.startFailed")]);
      }
    }
  };

  return (
    <Card title={t("supportSession.usersTitle", {organization: organizationName})} className="hover:translate-y-0">
      {loading ? <Loading/> : (
        <ul className="divide-y divide-border">
          {users.map((user) => (
            <li key={user.id} className="flex items-center justify-between gap-3 py-2">
              <span>{user.name ?? user.email}</span>
              <Buttons type="button" onClick={() => { setTarget(user); setReason(""); }}>
                {t("supportSession.enter")}
              </Buttons>
            </li>
          ))}
        </ul>
      )}

      {target && (
        <form onSubmit={submit} className="mt-4 space-y-3">
          <p className="text-sm text-gray-600">{t("supportSession.reasonLabel", {name: target.name ?? ""})}</p>
          <Input value={reason} onChange={(event) => setReason(event.target.value)}/>
          <FormErrors errors={errors}/>
          <Buttons type="submit">{t("supportSession.confirm")}</Buttons>
        </form>
      )}
    </Card>
  );
}
