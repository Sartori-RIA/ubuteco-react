"use client";

import {AnimatePresence} from "motion/react";
import ModalWrapper from "@/app/_components/ModalWrapper";
import {Buttons} from "@/app/_components/Buttons";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  loading = false,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <ModalWrapper onClose={onCancel}>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="mt-2 text-sm text-gray-600">{message}</p>
          <div className="mt-6 flex justify-end gap-2">
            <Buttons type="button" variant="outline" onClick={onCancel} disabled={loading}>
              {cancelLabel}
            </Buttons>
            <Buttons
              type="button"
              variant={variant === "danger" ? "danger" : "default"}
              onClick={onConfirm}
              loading={loading}
            >
              {confirmLabel}
            </Buttons>
          </div>
        </ModalWrapper>
      )}
    </AnimatePresence>
  );
}
