"use client";

import {useEffect} from "react";
import {useParams, useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import {Loading} from "@/app/_components";
import {RootState} from "@/app/_store";
import {useAppDispatch} from "@/app/_store/hooks";
import {usersThunks} from "@/app/_store/features/users/usersThunks";
import {UserForm} from "@/app/users/components";
import {useConfirm} from "@/app/_hooks/useConfirm";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {ConfirmDialog} from "@/app/_components/ConfirmDialog";

export default function Page() {
  const {id} = useParams<{id: string}>();
  const userId = Number(id);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const t = useTranslations();
  const {confirm, confirmDialogProps} = useConfirm();
  const user = useSelector((state: RootState) =>
    state.users.users.find((entry) => entry.id === userId)
  );
  const {loading, errors} = useSelector((state: RootState) => state.users);

  useEffect(() => {
    if (userId) {
      dispatch(usersThunks.fetchById(userId));
    }
  }, [dispatch, userId]);

  async function handleUpdate(payload: {
    name: string;
    email: string;
    password?: string;
    role_id: number;
  }) {
    try {
      await dispatch(usersThunks.update({id: userId, data: payload})).unwrap();
      router.push("/users");
    } catch {
      // errors in slice
    }
  }

  async function handleDelete() {
    const ok = await confirm({
      title: t("users.confirm.delete.title"),
      message: t("users.confirm.delete.message", {name: user?.name ?? user?.email ?? ""}),
      confirmLabel: t("users.confirm.delete.confirm"),
      variant: "danger",
    });
    if (!ok) return;

    try {
      await dispatch(usersThunks.delete(userId)).unwrap();
      router.push("/users");
    } catch {
      // errors in slice
    }
  }

  if (loading && !user) return <Loading/>;
  if (!user) return <h1 className="text-foreground">{t("common.notFound")}</h1>;

  return (
    <>
      <UserForm
        mode="edit"
        defaultValues={user}
        onSubmit={handleUpdate}
        onDelete={handleDelete}
        deleteLoading={loading}
        submitLabel={t("users.form.updateSubmit")}
        loading={loading}
        errors={errors}
      />
      <ConfirmDialog {...confirmDialogProps}/>
    </>
  );
}
