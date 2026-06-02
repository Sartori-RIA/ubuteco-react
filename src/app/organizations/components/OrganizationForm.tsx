"use client";

import {FormEvent, useEffect, useState} from "react";
import {Buttons, Card, FormErrors, Input, Label} from "@/app/_components";
import {Organization} from "@/app/_types";
import {useTranslations} from "@/app/_hooks/useTranslations";

type Props = {
  defaultValues: Organization;
  errors?: string[];
  loading?: boolean;
  submitLabel: string;
  onSubmit: (payload: FormData) => void | Promise<void>;
  readOnly?: boolean;
};

export function OrganizationForm({
  defaultValues,
  errors,
  loading = false,
  submitLabel,
  onSubmit,
  readOnly = false,
}: Props) {
  const t = useTranslations();
  const [name, setName] = useState(defaultValues.name ?? "");
  const [phone, setPhone] = useState(defaultValues.phone ?? "");
  const [preview, setPreview] = useState<string | null>(defaultValues.logo_url ?? null);

  useEffect(() => {
    setName(defaultValues.name ?? "");
    setPhone(defaultValues.phone ?? "");
    setPreview(defaultValues.logo_url ?? null);
  }, [defaultValues.id, defaultValues.name, defaultValues.phone, defaultValues.logo_url]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (readOnly) return;

    const formData = new FormData();
    formData.set("name", name.trim());
    formData.set("phone", phone.trim());

    const fileInput = (event.target as HTMLFormElement).elements.namedItem("logo") as HTMLInputElement | null;
    const file = fileInput?.files?.[0];
    if (file) {
      formData.set("logo", file);
    }

    await onSubmit(formData);
  };

  return (
    <Card title={t("organizations.form.profileTitle")} className="hover:translate-y-0">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormErrors errors={errors}/>

        <Label label={t("organizations.form.name")}>
          <Input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={readOnly}
            className="!pl-4"
          />
        </Label>

        <Label label={t("organizations.form.phone")}>
          <Input
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            disabled={readOnly}
            className="!pl-4"
          />
        </Label>

        <div>
          {preview ? (
            <img
              src={preview}
              alt={t("organizations.form.logoAlt")}
              className="mb-2 h-24 w-24 rounded-xl object-cover"
            />
          ) : null}
          <Label label={t("organizations.form.logo")}>
            <Input
              type="file"
              name="logo"
              accept="image/*"
              disabled={readOnly}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setPreview(URL.createObjectURL(file));
              }}
            />
          </Label>
        </div>

        {!readOnly ? (
          <div className="flex justify-end">
            <Buttons type="submit" loading={loading}>
              {submitLabel}
            </Buttons>
          </div>
        ) : null}
      </form>
    </Card>
  );
}
