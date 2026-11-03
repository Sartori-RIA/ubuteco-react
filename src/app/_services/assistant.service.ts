import {apiFetch} from "@/app/_services/api-fetch";
import {AiConversation, AiConversationDetail, AiMessageResponse} from "@/app/_types/assistant";

export async function listConversations(): Promise<AiConversation[]> {
  const body = await apiFetch<{data: AiConversation[]}>("v1/assistant/conversations");
  return body.data;
}

export async function createConversation(): Promise<AiConversation> {
  return await apiFetch<AiConversation>("v1/assistant/conversations", {method: "POST"});
}

export async function getConversation(id: number): Promise<AiConversationDetail> {
  return await apiFetch<AiConversationDetail>(`v1/assistant/conversations/${id}`);
}

export async function sendMessage(id: number, content: string): Promise<AiMessageResponse> {
  return await apiFetch<AiMessageResponse>(`v1/assistant/conversations/${id}/messages`, {
    method: "POST",
    body: JSON.stringify({content}),
  });
}

export async function deleteConversation(id: number): Promise<void> {
  await apiFetch<void>(`v1/assistant/conversations/${id}`, {method: "DELETE"});
}

export const assistantService = {
  listConversations,
  createConversation,
  getConversation,
  sendMessage,
  deleteConversation,
};
