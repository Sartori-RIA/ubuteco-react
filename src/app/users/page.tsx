"use client";

import {useEffect} from "react";
import dynamic from "next/dynamic";
import {Card, FormErrors, Loading, Toolbar} from "@/app/_components";
import {Pagination} from "@/app/_components/Pagination";
import {UsersTable} from "@/app/users/components";
import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {RootState} from "@/app/_store";
import {usersThunks} from "@/app/_store/features/users/usersThunks";
import {setPage, setSearchTerm} from "@/app/_store/features/users/usersSlice";
import {useTranslations} from "@/app/_hooks/useTranslations";

function Page() {
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const {users, loading, searchTerm, page, meta, errors} = useAppSelector(
    (state: RootState) => state.users
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(usersThunks.fetchAll({search: searchTerm, page: 1, append: false}));
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchTerm, dispatch]);

  const loadMore = () => {
    const nextPage = page + 1;
    dispatch(setPage(nextPage));
    dispatch(usersThunks.fetchAll({search: searchTerm, page: nextPage, append: true}));
  };

  return (
    <div className="space-y-6">
      <Toolbar
        title={t("users.title")}
        newUrl="/users/new"
        searchValue={searchTerm}
        onSearch={(e) => dispatch(setSearchTerm(e.target.value))}
      />

      <FormErrors errors={errors}/>

      <Card title={t("users.list.title")} className="hover:translate-y-0">
        {loading && users.length === 0 ? <Loading/> : <UsersTable users={users}/>}
        <Pagination meta={meta} loading={loading} onLoadMore={loadMore}/>
      </Card>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Page), {ssr: false});
