"use client";

import {useCallback, useEffect, useState} from "react";
import dynamic from "next/dynamic";
import {FormErrors, Loading} from "@/app/_components";
import {ConfirmDialog} from "@/app/_components/ConfirmDialog";
import {KitchenBoard} from "@/app/kitchen/components/KitchenBoard";
import {useToast} from "@/app/_components/Toast/ToastProvider";
import {useAuthCapabilities} from "@/app/_hooks/useAuthCapabilities";
import {useConfirm} from "@/app/_hooks/useConfirm";
import {useKitchenCable} from "@/app/_hooks/useKitchenCable";
import {canAccessKitchen, isKitchenStaff} from "@/app/_lib/auth-roles";
import {
  isOrganizationKitchenOpen,
  nextOperationalStatus,
} from "@/app/_lib/organization-operational";
import {organizationsService} from "@/app/_services/organizations.service";
import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {RootState} from "@/app/_store";
import {updateAuthenticatedUser} from "@/app/_store/features/auth/authSlice";
import {fetchCurrentUser} from "@/app/_store/features/auth/authThunks";
import {kitchenThunks} from "@/app/_store/features/kitchen/kitchenThunks";
import {ActionCableKitchenMessage} from "@/app/_types/kitchen-dish";
import {OrderItemStatus} from "@/app/_types/order";
import {useRouter} from "next/navigation";

function KitchenPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {showToast} = useToast();
  const {confirm, confirmDialogProps} = useConfirm();
  const {user: capabilitiesUser} = useAuthCapabilities();
  const authUser = useAppSelector((state: RootState) => state.auth.user);
  const user = authUser ?? capabilitiesUser;
  const {tickets, loading, savingId, errors, cableConnected} = useAppSelector(
    (state: RootState) => state.kitchen
  );
  const canUseKitchen = canAccessKitchen(user);
  const isKitchenOpen = isOrganizationKitchenOpen(user?.organization);
  const [togglingOperational, setTogglingOperational] = useState(false);

  const loadQueue = useCallback(() => {
    dispatch(kitchenThunks.fetchTickets());
  }, [dispatch]);

  const handleCableMessage = useCallback(
    (message: ActionCableKitchenMessage) => {
      if (!isKitchenOpen) return;

      if (message.action === "create") {
        showToast("New dish order received", "info");
      } else if (message.action === "update") {
        showToast("Dish status updated", "info");
      }
    },
    [isKitchenOpen, showToast]
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
        showToast("Status updated", "success");
      }
    },
    [dispatch, isKitchenOpen, showToast]
  );

  const handleOperationalToggle = useCallback(async () => {
    const org = user?.organization;
    if (!user || !org?.id) return;

    const closing = isKitchenOpen;
    if (closing) {
      const ok = await confirm({
        title: "Close kitchen",
        message:
          "Close the kitchen for this shift? All open orders will be closed automatically and the live queue will clear.",
        confirmLabel: "Close kitchen",
        variant: "danger",
      });
      if (!ok) return;
    }

    setTogglingOperational(true);
    try {
      const operational_status = nextOperationalStatus(org.operational_status);
      const updated = await organizationsService.update(org.id, {operational_status});
      dispatch(
        updateAuthenticatedUser({
          ...user,
          organization: {...org, ...updated},
        })
      );
      loadQueue();
      showToast(
        operational_status === "open"
          ? "Kitchen is now open"
          : "Kitchen closed — open orders were closed",
        "success"
      );
    } catch {
      showToast("Could not update kitchen status", "error");
    } finally {
      setTogglingOperational(false);
    }
  }, [confirm, dispatch, isKitchenOpen, loadQueue, showToast, user]);

  if (!canUseKitchen) {
    return <Loading/>;
  }

  return (
    <div className="space-y-6">
      <ConfirmDialog {...confirmDialogProps} loading={togglingOperational}/>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kitchen</h1>
          <p className="text-sm text-gray-500 mt-1">
            The queue loads when you open this page. New and updated <strong>Dish</strong> lines arrive live
            while the kitchen is <strong>open</strong>. Closing the kitchen also closes all open orders for
            this shift.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <button
            type="button"
            disabled={togglingOperational}
            onClick={handleOperationalToggle}
            className={`rounded-full border px-3 py-1 font-medium transition-colors disabled:opacity-60 ${
              isKitchenOpen
                ? "border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
                : "border-gray-300 bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {togglingOperational ? "Updating…" : isKitchenOpen ? "Open — close kitchen" : "Closed — open kitchen"}
          </button>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-medium ${
              cableConnected
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-amber-200 bg-amber-50 text-amber-800"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${cableConnected ? "bg-emerald-500" : "bg-amber-500"}`}
            />
            {cableConnected ? "Live" : "Connecting…"}
          </span>
          <button
            type="button"
            className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-gray-700 hover:bg-gray-50"
            onClick={loadQueue}
            disabled={!isKitchenOpen || loading}
          >
            Refresh
          </button>
          <span className="text-xs text-gray-500">{tickets.length} items</span>
        </div>
      </div>

      <FormErrors errors={errors}/>

      {!isKitchenOpen ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Kitchen is <strong>closed</strong>. Use the button above to <strong>open the kitchen</strong>{" "}
          when service starts. Closing the kitchen also closes all open orders for this shift.
        </div>
      ) : null}

      {loading && tickets.length === 0 ? (
        <Loading/>
      ) : tickets.length === 0 && isKitchenOpen ? (
        <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-600">
          No dish items on <strong>open orders</strong> yet. Add a <strong>Dish</strong> line to an open order —
          it will appear here and trigger a live notification.
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
