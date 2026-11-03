"use client";

import {FormEvent, useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {Buttons} from "@/app/_components/Buttons";
import {ConfirmDialog} from "@/app/_components/ConfirmDialog";
import {MessageList} from "@/app/_components/assistant/MessageList";
import {setAssistantOpen, startNewConversation} from "@/app/_store/features/assistant/assistantSlice";
import {
  deleteAssistantConversation,
  loadAssistantConversation,
  loadAssistantConversations,
  sendAssistantMessage,
} from "@/app/_store/features/assistant/assistantThunks";

const STARTERS = ["yesterday", "lowStock", "topSeller"] as const;

export function AssistantDrawer() {
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const open = useAppSelector((state) => state.assistant.open);
  const conversations = useAppSelector((state) => state.assistant.conversations);
  const activeId = useAppSelector((state) => state.assistant.activeId);
  const messages = useAppSelector((state) => state.assistant.messages);
  const sending = useAppSelector((state) => state.assistant.sending);
  const errorCode = useAppSelector((state) => state.assistant.errorCode);
  const [draft, setDraft] = useState("");
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;
    dispatch(loadAssistantConversations());
  }, [open, dispatch]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") dispatch(setAssistantOpen(false));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dispatch]);

  if (!open) return null;

  const limited = errorCode === "ai_rate_limited";

  async function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending || limited) return;
    const result = await dispatch(sendAssistantMessage(trimmed));
    if (sendAssistantMessage.fulfilled.match(result)) setDraft("");
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void submit(draft);
  }

  function errorMessage() {
    if (errorCode === "ai_disabled") return t("assistant.errors.disabled");
    if (errorCode === "ai_rate_limited") return t("assistant.errors.rateLimited");
    if (errorCode === "ai_unavailable") return t("assistant.errors.unavailable");
    if (errorCode) return t("assistant.errors.generic");
    return null;
  }

  return (
    <aside
      role="dialog"
      aria-label={t("assistant.title")}
      className="fixed inset-0 z-40 flex flex-col bg-surface md:inset-y-0 md:left-auto md:w-[420px] md:border-l md:border-border"
    >
      <header className="flex items-center justify-between gap-2 border-b border-border p-4">
        <h2 className="text-lg font-semibold text-foreground">{t("assistant.title")}</h2>
        <div className="flex gap-2">
          <Buttons
            type="button"
            variant="outline"
            onClick={() => dispatch(startNewConversation())}
          >
            {t("assistant.new")}
          </Buttons>
          <Buttons type="button" variant="outline" onClick={() => dispatch(setAssistantOpen(false))}>
            {t("assistant.close")}
          </Buttons>
        </div>
      </header>

      {conversations.length > 0 && (
        <ul className="flex gap-2 overflow-x-auto border-b border-border p-3">
          {conversations.map((conversation) => (
            <li key={conversation.id} className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                className={`rounded-full px-3 py-1 text-sm ${
                  conversation.id === activeId ? "bg-blue-600 text-white" : "bg-surface-muted text-foreground"
                }`}
                onClick={() => dispatch(loadAssistantConversation(conversation.id))}
              >
                {conversation.title || t("assistant.untitled")}
              </button>
              <button
                type="button"
                className="text-xs text-muted"
                aria-label={t("assistant.delete")}
                onClick={() => setPendingDelete(conversation.id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="min-h-0 flex-1 overflow-auto p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted">{t("assistant.empty")}</p>
            {STARTERS.map((key) => (
              <Buttons key={key} type="button" variant="outline" onClick={() => void submit(t(`assistant.starters.${key}`))}>
                {t(`assistant.starters.${key}`)}
              </Buttons>
            ))}
          </div>
        ) : (
          <MessageList messages={messages}/>
        )}
        {sending && <p className="mt-3 text-sm text-muted">{t("assistant.thinking")}</p>}
        {errorMessage() && <p className="mt-3 text-sm text-red-700 dark:text-red-300">{errorMessage()}</p>}
      </div>

      <form onSubmit={onSubmit} className="border-t border-border p-4">
        <label className="sr-only" htmlFor="assistant-input">{t("assistant.placeholder")}</label>
        <textarea
          id="assistant-input"
          value={draft}
          disabled={sending || limited}
          placeholder={t("assistant.placeholder")}
          className="w-full rounded-lg border border-border bg-surface p-3 text-sm text-foreground"
          rows={3}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void submit(draft);
            }
          }}
        />
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="text-xs text-muted">{t("assistant.disclaimer")}</p>
          <Buttons type="submit" disabled={sending || limited || draft.trim() === ""}>
            {t("assistant.send")}
          </Buttons>
        </div>
      </form>

      <ConfirmDialog
        open={pendingDelete != null}
        title={t("assistant.deleteTitle")}
        message={t("assistant.deleteMessage")}
        confirmLabel={t("assistant.delete")}
        cancelLabel={t("common.cancel")}
        variant="danger"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete != null) dispatch(deleteAssistantConversation(pendingDelete));
          setPendingDelete(null);
        }}
      />
    </aside>
  );
}
