"use client"

import {Maker} from "@/app/_types";
import React, {useState} from "react";
import {Buttons, Card, FormErrors, Input, Label} from "@/app/_components";
import {motion} from "motion/react";
import Form from "next/form";

interface MakerFormProps {
  defaultValues?: Partial<Maker>;
  errors?: string[];
  action: (data: FormData) => Promise<void> | void;
  loading?: boolean;
  submitLabel?: string;
}

export function MakerForm({
                            defaultValues,
                            action,
                            errors,
                            loading = false,
                            submitLabel = "Save Maker",
                          }: MakerFormProps) {
  const [preview, setPreview] = useState<string | null>(defaultValues?.logo_url ?? null);
  const [form, setForm] = useState<Partial<Maker>>({
    name: defaultValues?.name ?? "",
    country: defaultValues?.country ?? "",
  });

  function setField<K extends keyof Maker>(key: K, value: Maker[K]) {
    setForm((prev) => ({...prev, [key]: value}));
  }

  return (
    <motion.div
      initial={false}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.25}}
      className="max-w-2xl mx-auto"
    >
      <Card title={defaultValues?.id ? "Update Maker" : "New Maker"} className="rounded-2xl shadow-lg">
        <Form action={action} formEncType="multipart/form-data" className="space-y-6 max-w-2xl">

          <FormErrors errors={errors}/>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Label label="Name">
              <Input
                value={form.name ?? ""}
                onChange={(e) => setField("name", e.target.value)}
                name="name"
                required
              />
            </Label>

            <Label label="Country">
              <Input
                value={form.country ?? ""}
                onChange={(e) => setField("country", e.target.value)}
                name="country"
                required
              />
            </Label>
          </div>

          <div>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mb-2 h-32 rounded-xl object-cover"
              />
            )}

            <Label label="Logo">
              <Input
                type="file"
                name="logo"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setPreview(URL.createObjectURL(file));
                }}
              />
            </Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Buttons type="submit" loading={loading}>
              {submitLabel}
            </Buttons>
          </div>
        </Form>
      </Card>
    </motion.div>
  );
}
