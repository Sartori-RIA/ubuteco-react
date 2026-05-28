import {KitchenTicket} from "@/app/_types/kitchen-dish";
import {OrderItemStatus} from "@/app/_types/order";
import {apiFetch} from "@/app/_services/api-fetch";

async function list(): Promise<KitchenTicket[]> {
  return await apiFetch<KitchenTicket[]>("v1/kitchens");
}

async function updateStatus(id: number, status: OrderItemStatus): Promise<KitchenTicket> {
  return await apiFetch<KitchenTicket>(`v1/kitchens/${id}`, {
    method: "PUT",
    body: JSON.stringify({status}),
  });
}

export const kitchenService = {
  list,
  updateStatus,
};
