"use client";

import {useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {usersThunks} from "@/app/_store/features/users/usersThunks";
import {UserForm} from "@/app/users/components";
import {useTranslations} from "@/app/_hooks/useTranslations";

export default function Page() {
  const {loading, errors} = useSelector((state: RootState) => state.users);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const t = useTranslations();

  async function handleCreate(payload: {
    name: string;
    email: string;
    password?: string;
    role_id: number;
  }) {
    if (!payload.password) return;
    try {
      await dispatch(
        usersThunks.create({
          name: payload.name,
          email: payload.email,
          password: payload.password,
          role_id: payload.role_id,
        })
      ).unwrap();
      router.push("/users");
    } catch {
      // errors in slice
    }
  }

  return (
    <UserForm
      mode="create"
      onSubmit={handleCreate}
      submitLabel={t("users.form.createSubmit")}
      loading={loading}
      errors={errors}
    />
  );
}
