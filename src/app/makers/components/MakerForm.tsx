"use client"

import {Maker, Wine} from "@/app/_types";
import React, {useState} from "react";
import {Button, Card, FormErrors, Input} from "@/app/_components";
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
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Maker>>({
    name: defaultValues?.name ?? "",
    country: defaultValues?.country ?? "",
    state: defaultValues?.state ?? "",
  });

  function setField<K extends keyof Wine>(key: K, value: Wine[K]) {
    setForm((prev) => ({...prev, [key]: value}));
  }

  return (
    <motion.div
      initial={{opacity: 0, y: 10}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.25}}
      className="max-w-2xl mx-auto"
    >
      <Card title={defaultValues?.id ? "Update Wine" : "New Wine"} className="rounded-2xl shadow-lg">
        <Form action={action} formEncType="multipart/form-data" className="space-y-6 max-w-2xl">

          <FormErrors errors={errors}/>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Name">
              <input
                className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                value={form.name ?? ""}
                onChange={(e) => setField("name", e.target.value)}
                name="name"
              />
            </Input>

            <div>
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-2 h-32 rounded-xl object-cover"
                />
              )}

              <Input label="Image">
                <input
                  className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const imageUrl = URL.createObjectURL(file);
                    setPreview(imageUrl);
                  }}
                />
              </Input>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="submit" loading={loading}>
              {submitLabel}
            </Button>
          </div>
        </Form>
      </Card>
    </motion.div>
  );
}