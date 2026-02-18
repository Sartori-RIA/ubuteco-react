"use client"

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {RootState} from "@/app/_store";
import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import dynamic from "next/dynamic";
import {makersThunks} from "@/app/_store/features/makers/makersThunks";

function Page() {
  const {makers, loading} = useAppSelector((state: RootState) => state.makers);
  const router = useRouter();
  const dispatch = useAppDispatch()
  const searchTerm = useAppSelector(state => state.makers.searchTerm);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(makersThunks.fetchAll({search: searchTerm}));
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm, dispatch]);

  async function handleDelete(id: number) {
    if (!confirm("Are you sure?")) return;

    dispatch(makersThunks.delete(Number(id)))
    router.refresh();
  }

  return (
    <h1>Makers</h1>
  );
}

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});