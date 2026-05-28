import {ActionCableKitchenMessage, KitchenTicket} from "@/app/_types/kitchen-dish";

function parseJson(value: string): unknown {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

/** Normalize Action Cable payloads (string, nested message, stringified obj). */
export function parseKitchenCableMessage(raw: unknown): ActionCableKitchenMessage {
  let data: unknown = raw;

  if (typeof data === "string") {
    data = parseJson(data);
  }

  if (data && typeof data === "object" && "message" in data) {
    const wrapped = (data as {message: unknown}).message;
    data = typeof wrapped === "string" ? parseJson(wrapped) : wrapped;
  }

  if (!data || typeof data !== "object") {
    return {};
  }

  const message = data as ActionCableKitchenMessage & {obj?: unknown};

  if (message.obj && typeof message.obj === "string") {
    const parsed = parseJson(message.obj);
    if (parsed && typeof parsed === "object") {
      message.obj = parsed as KitchenTicket;
    }
  }

  return message;
}
