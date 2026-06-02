"use client";

import {FormEvent, useEffect, useState} from "react";
import {Role, User} from "@/app/_types";
import {Buttons, Card, FormErrors, Input, Label, Select} from "@/app/_components";
import {rolesService} from "@/app/_services/roles.service";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {filterAssignableRoles} from "@/app/users/_lib/assignable-roles";
import type {TranslationKey} from "@/app/_lib/i18n";

type Props = {
  defaultValues?: Partial<User>;
  errors?: string[];
  loading?: boolean;
  submitLabel: string;
  mode: "create" | "edit";
  onSubmit: (payload: {
    name: string;
    email: string;
    password?: string;
    role_id: number;
  }) => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
  deleteLoading?: boolean;
};

function roleLabelKey(roleName: string): TranslationKey {
  return `users.roles.${roleName}` as TranslationKey;
}

export function UserForm({
  defaultValues,
  errors,
  loading = false,
  submitLabel,
  mode,
  onSubmit,
  onDelete,
  deleteLoading = false,
}: Props) {
  const t = useTranslations();
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [name, setName] = useState(defaultValues?.name ?? "");
  const [email, setEmail] = useState(defaultValues?.email ?? "");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState(String(defaultValues?.role_id ?? defaultValues?.role?.id ?? ""));

  useEffect(() => {
    void rolesService.fetchAll().then((data) => {
      setRoles(filterAssignableRoles(data));
      setRolesLoading(false);
    });
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const payload = {
      name: name.trim(),
      email: email.trim(),
      role_id: Number(roleId),
      ...(password.trim() ? {password: password.trim()} : {}),
    };
    await onSubmit(payload);
  };

  return (
    <Card
      title={mode === "create" ? t("users.form.newTitle") : t("users.form.editTitle")}
      className="mx-auto max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormErrors errors={errors}/>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Label label={t("users.form.name")}>
            <Input name="name" value={name} onChange={(e) => setName(e.target.value)} required/>
          </Label>

          <Label label={t("users.form.email")}>
            <Input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Label>
        </div>

        <Label label={t("users.form.role")}>
          <Select
            name="role_id"
            value={roleId}
            onChange={setRoleId}
            disabled={rolesLoading}
          >
            <option value="">{rolesLoading ? t("common.loading") : t("users.form.selectRole")}</option>
            {roles.map((role) => (
              <option key={role.id} value={String(role.id)}>
                {t(roleLabelKey(role.name ?? ""))}
              </option>
            ))}
          </Select>
        </Label>

        <Label
          label={
            mode === "create"
              ? t("users.form.password")
              : `${t("users.form.password")} (${t("common.optional")})`
          }
        >
          <Input
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={mode === "create"}
          />
        </Label>

        <div className="flex flex-wrap items-center justify-between gap-3">
          {mode === "edit" && onDelete ? (
            <Buttons type="button" variant="danger" onClick={onDelete} loading={deleteLoading}>
              {t("users.form.deleteUser")}
            </Buttons>
          ) : (
            <span/>
          )}
          <Buttons type="submit" loading={loading}>
            {submitLabel}
          </Buttons>
        </div>
      </form>
    </Card>
  );
}
