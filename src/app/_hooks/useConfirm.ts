"use client";

import {useCallback, useRef, useState} from "react";

type ConfirmOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
};

export function useConfirm() {
  const resolveRef = useRef<((value: boolean) => void) | null>(null);
  const [dialog, setDialog] = useState<ConfirmOptions & {open: boolean}>({
    open: false,
    title: "",
    message: "",
  });

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
      setDialog({...options, open: true});
    });
  }, []);

  const finish = useCallback((value: boolean) => {
    resolveRef.current?.(value);
    resolveRef.current = null;
    setDialog({open: false, title: "", message: ""});
  }, []);

  return {
    confirm,
    confirmDialogProps: {
      open: dialog.open,
      title: dialog.title,
      message: dialog.message,
      confirmLabel: dialog.confirmLabel,
      cancelLabel: dialog.cancelLabel,
      variant: dialog.variant,
      onConfirm: () => finish(true),
      onCancel: () => finish(false),
    },
  };
}
