"use client";

import {useCallback, useEffect} from "react";
import dynamic from "next/dynamic";
import {FormErrors, Loading} from "@/app/_components";
import {KitchenBoard} from "@/app/kitchen/components/KitchenBoard";
import {OrganizationOperationalToggle} from "@/app/organizations/components";
import {useToast} from "@/app/_components/Toast/ToastProvider";
import {useAuthCapabilities} from "@/app/_hooks/useAuthCapabilities";
import {useKitchenCable} from "@/app/_hooks/useKitchenCable";
import {canAccessKitchen, isKitchenStaff} from "@/app/_lib/auth-roles";
import {isOrganizationKitchenOpen} from "@/app/_lib/organization-operational";
import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {RootState} from "@/app/_store";
import {fetchCurrentUser} from "@/app/_store/features/auth/authThunks";
import {kitchenThunks} from "@/app/_store/features/kitchen/kitchenThunks";
import {ActionCableKitchenMessage} from "@/app/_types/kitchen-dish";
import {OrderItemStatus} from "@/app/_types/order";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {useRouter} from "next/navigation";

function KitchenPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {showToast} = useToast();
  const t = useTranslations();
  const {user: capabilitiesUser} = useAuthCapabilities();
  const authUser = useAppSelector((state: RootState) => state.auth.user);
  const user = authUser ?? capabilitiesUser;
  const {tickets, loading, savingId, errors, cableConnected} = useAppSelector(
    (state: RootState) => state.kitchen
  );
  const canUseKitchen = canAccessKitchen(user);
  const isKitchenOpen = isOrganizationKitchenOpen(user?.organization);

  const loadQueue = useCallback(() => {
    dispatch(kitchenThunks.fetchTickets());
  }, [dispatch]);

  const handleCableMessage = useCallback(
    (message: ActionCableKitchenMessage) => {
      if (!isKitchenOpen) return;

      if (message.action === "create") {
        showToast(t("kitchen.toastNewDish"), "info");
      } else if (message.action === "update") {
        showToast(t("kitchen.toastStatusUpdated"), "info");
      }
    },
    [isKitchenOpen, showToast, t]
  );

  useKitchenCable(canUseKitchen && isKitchenOpen, {
    onMessage: handleCableMessage,
  });

  useEffect(() => {
    if (!user?.id) return;
    if (!canUseKitchen) {
      router.replace("/forbidden");
      return;
    }

    let cancelled = false;
    void dispatch(fetchCurrentUser())
      .unwrap()
      .then((freshUser) => {
        if (cancelled) return;
        if (isOrganizationKitchenOpen(freshUser.organization)) {
          loadQueue();
        }
      })
      .catch(() => {
        /* auth hydrator may have cached user */
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id, canUseKitchen, dispatch, loadQueue, router]);

  const handleStatusChange = useCallback(
    async (id: number, status: OrderItemStatus) => {
      if (!isKitchenOpen) return;

      const result = await dispatch(kitchenThunks.updateTicketStatus({id, status}));
      if (kitchenThunks.updateTicketStatus.fulfilled.match(result)) {
        showToast(t("kitchen.toastStatusSaved"), "success");
      }
    },
    [dispatch, isKitchenOpen, showToast, t]
  );

  if (!canUseKitchen) {
    return <Loading/>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t("kitchen.title")}</h1>
          <p className="mt-1 text-sm text-muted">{t("kitchen.description")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <OrganizationOperationalToggle compact onChanged={loadQueue}/>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-medium ${
              cableConnected
                ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${cableConnected ? "bg-emerald-500" : "bg-amber-500"}`}
            />
            {cableConnected ? t("kitchen.live") : t("kitchen.connecting")}
          </span>
          <button
            type="button"
            className="rounded-lg border border-border bg-surface px-3 py-1 text-foreground hover:bg-surface-muted"
            onClick={loadQueue}
            disabled={!isKitchenOpen || loading}
          >
            {t("kitchen.refresh")}
          </button>
          <span className="text-xs text-muted">{t("kitchen.itemsCount", {count: tickets.length})}</span>
        </div>
      </div>

      <FormErrors errors={errors}/>

      {!isKitchenOpen ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          {t("kitchen.closedBanner")}
        </div>
      ) : null}

      {loading && tickets.length === 0 ? (
        <Loading/>
      ) : tickets.length === 0 && isKitchenOpen ? (
        <p className="rounded-lg border border-dashed border-border bg-surface-muted px-4 py-8 text-center text-sm text-muted">
          {t("kitchen.emptyQueue")}
        </p>
      ) : (
        <KitchenBoard
          tickets={tickets}
          savingId={savingId}
          showOrderLink={!isKitchenStaff(user)}
          onStatusChange={handleStatusChange}
          readOnly={!isKitchenOpen}
        />
      )}
    </div>
  );
}

export default dynamic(() => Promise.resolve(KitchenPage), {ssr: false});
