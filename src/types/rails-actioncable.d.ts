declare module "@rails/actioncable" {
  export type Subscription = {
    unsubscribe: () => void;
  };

  export type Subscriptions = {
    create: (
      channel: string | {channel: string; [key: string]: unknown},
      callbacks: {
        connected?: () => void;
        disconnected?: () => void;
        rejected?: () => void;
        received?: (data: unknown) => void;
      }
    ) => Subscription;
    notify: (identifier: string, callbackName: string, ...args: unknown[]) => void;
  };

  export type Consumer = {
    subscriptions: Subscriptions;
    disconnect: () => void;
  };

  export function createConsumer(url?: string): Consumer;
}
