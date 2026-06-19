"use client";

import {useEffect, useRef} from "react";
import {createConsumer, Consumer, Subscription} from "@rails/actioncable";
import {getAuthToken} from "@/app/_lib/auth-storage";
import {getCableUrl} from "@/app/_lib/cable-url";
import {ActionCableKitchenMessage} from "@/app/_types/kitchen-dish";
import {useAppDispatch} from "@/app/_store/hooks";
import {setCableConnected, ticketReceived} from "@/app/_store/features/kitchen/kitchenSlice";
import {applyKitchenCableMessage} from "@/app/kitchen/_lib/apply-kitchen-cable-message";

/** Server scopes stream by JWT organization — client must not pass tenant id. */
export const KITCHEN_CABLE_CHANNEL = "KitchenChannel";

export type KitchenCableSubscriptionParams = {
  channel: typeof KITCHEN_CABLE_CHANNEL;
};

export function kitchenCableSubscriptionParams(): KitchenCableSubscriptionParams {
  return {channel: KITCHEN_CABLE_CHANNEL};
}

function patchSubscriptionNotify(consumer: Consumer) {
  const subscriptions = consumer.subscriptions as {
    notify: (identifier: string, callbackName: string, ...args: unknown[]) => void;
  };
  const originalNotify = subscriptions.notify.bind(subscriptions);

  subscriptions.notify = (identifier, callbackName, ...args) => {
    if (callbackName === "received") {
      console.info("[KitchenCable] ActionCable notify", {identifier, payload: args[0]});
    }
    return originalNotify(identifier, callbackName, ...args);
  };
}

type Options = {
  onMessage?: (message: ActionCableKitchenMessage) => void;
  /** Reload queue from API once when the cable connects (not polling). */
  onConnected?: () => void;
};

export function useKitchenCable(enabled: boolean, options: Options = {}) {
  const dispatch = useAppDispatch();
  const {onMessage, onConnected} = options;
  const onMessageRef = useRef(onMessage);
  const onConnectedRef = useRef(onConnected);

  useEffect(() => {
    onMessageRef.current = onMessage;
    onConnectedRef.current = onConnected;
  }, [onMessage, onConnected]);

  useEffect(() => {
    if (!enabled) return;

    const token = getAuthToken();
    const cableUrl = getCableUrl();
    if (!token || !cableUrl) {
      console.warn("[KitchenCable] Missing token or cable URL", {cableUrl: cableUrl || "(empty)"});
      return;
    }

    const url = `${cableUrl}?token=${encodeURIComponent(token)}`;
    if (process.env.NODE_ENV === "development") {
      console.info("[KitchenCable] connecting", {cableUrl, hasToken: Boolean(token)});
    }
    let consumer: Consumer | undefined;
    let subscription: Subscription | undefined;

    try {
      consumer = createConsumer(url);
      patchSubscriptionNotify(consumer);

      subscription = consumer.subscriptions.create(kitchenCableSubscriptionParams(), {
        connected() {
          console.info("[KitchenCable] subscription connected");
          dispatch(setCableConnected(true));
          onConnectedRef.current?.();
        },
        disconnected() {
          console.warn("[KitchenCable] subscription disconnected — check Redis (CABLE_ADAPTER=redis) and ws://…/api/cable");
          dispatch(setCableConnected(false));
        },
        rejected() {
          console.warn(
            "[KitchenCable] subscription rejected — token, role, or organization_id may be invalid"
          );
          dispatch(setCableConnected(false));
        },
        received(raw: unknown) {
          try {
            const message = applyKitchenCableMessage(raw);
            if (!message?.obj) {
              console.warn("[KitchenCable] message without obj", raw);
              return;
            }

            if (process.env.NODE_ENV === "development") {
              console.info("[KitchenCable] received", {
                action: message.action,
                orderItemId: message.obj.id,
                status: message.obj.status,
              });
            }
            dispatch(ticketReceived(message.obj));
            onMessageRef.current?.(message);
          } catch (error) {
            console.error("[KitchenCable] Failed to handle message", error, raw);
          }
        },
      });
    } catch (error) {
      console.error("[KitchenCable] Could not connect", error);
      dispatch(setCableConnected(false));
    }

    return () => {
      subscription?.unsubscribe();
      consumer?.disconnect();
      dispatch(setCableConnected(false));
    };
  }, [enabled, dispatch]);
}
