"use client";

import {useState} from "react";
import {useAiEnabled} from "@/app/_hooks/useAiEnabled";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {extractLabel, intakeFileError} from "@/app/_services/intake.service";
import {LabelDraftResponse} from "@/app/_types/intake";

type LabelPhotoButtonProps = {
  productType: "beer" | "wine";
  onDraft: (draft: LabelDraftResponse) => void;
};

export function LabelPhotoButton({productType, onDraft}: LabelPhotoButtonProps) {
  const t = useTranslations();
  const aiEnabled = useAiEnabled();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!aiEnabled) return null;

  async function onChange(file: File | undefined) {
    if (!file) return;
    const code = intakeFileError(file, "label");
    if (code) {
      setError(t(`intake.${code}`));
      return;
    }
    setError(null);
    setLoading(true);
    try {
      onDraft(await extractLabel(file, productType));
    } catch {
      setError(t("intake.fileType"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          disabled={loading}
          onChange={(event) => {
            void onChange(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        <span className="rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600">
          {loading ? t("intake.working") : t("intake.fillFromPhoto")}
        </span>
      </label>
      <p className="text-xs text-gray-500">{t("intake.photoHint")}</p>
      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}
