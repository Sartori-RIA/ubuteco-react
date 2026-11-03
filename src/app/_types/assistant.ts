export type AiConversation = {
  id: number;
  title: string | null;
  updated_at: string;
};

export type AiMessage = {
  id: number;
  role: "user" | "assistant";
  text: string;
  created_at: string;
};

export type AiConversationDetail = AiConversation & {
  messages: AiMessage[];
};

export type AiMessageResponse = {
  message: AiMessage;
};
