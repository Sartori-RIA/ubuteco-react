import {Role} from "@/app/_types";
import {apiFetch} from "@/app/_services/api-fetch";

async function fetchAll(): Promise<Role[]> {
  return await apiFetch<Role[]>("v1/roles");
}

export const rolesService = {
  fetchAll,
};
