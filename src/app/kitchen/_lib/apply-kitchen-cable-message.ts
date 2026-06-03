import {ActionCableKitchenMessage, KitchenTicket} from "@/app/_types/kitchen-dish";
import {normalizeKitchenTicket} from "@/app/kitchen/_lib/normalize-ticket";
import {parseKitchenCableMessage} from "@/app/kitchen/_lib/parse-kitchen-cable-message";

/** Parse and normalize a raw ActionCable payload; returns null when invalid. */
export function applyKitchenCableMessage(raw: unknown): ActionCableKitchenMessage | null {
  const message = parseKitchenCableMessage(raw);
  if (!message.obj) return null;
  return {
    action: message.action as ActionCableKitchenMessage["action"],
    obj: normalizeKitchenTicket(message.obj),
  };
}

export function kitchenTicketFromCable(raw: unknown): KitchenTicket | null {
  return applyKitchenCableMessage(raw)?.obj ?? null;
}
