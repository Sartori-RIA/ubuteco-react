"use client";

import {useEffect, useState} from "react";
import {ApiMetaData, Organization} from "@/app/_types";
import {Card, FormErrors, Loading, Toolbar} from "@/app/_components";
import {Pagination} from "@/app/_components/Pagination";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {platformOrganizationsService} from "@/app/_services/platform-organizations.service";
import {ApiError} from "@/app/_services/api-fetch";
import {OrganizationsTable} from "@/app/organizations/components/OrganizationsTable";

export function SuperAdminOrganizationsList() {
  const t = useTranslations();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<ApiMetaData>({
    count: 0,
    last: 0,
    page: 1,
    pages: 1,
    previous: null,
  });
  const [errors, setErrors] = useState<string[] | undefined>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      setErrors(undefined);
      void platformOrganizationsService
        .fetchAll({search: searchTerm, page: 1})
        .then((response) => {
          setOrganizations(response.data);
          setMeta(response.meta);
          setPage(response.meta.page);
        })
        .catch((error) => {
          if (error instanceof ApiError) {
            setErrors(error.data);
          } else {
            setErrors([t("organizations.list.loadFailed")]);
          }
        })
        .finally(() => setLoading(false));
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm, t]);

  const loadMore = () => {
    const nextPage = page + 1;
    setLoading(true);
    void platformOrganizationsService
      .fetchAll({search: searchTerm, page: nextPage})
      .then((response) => {
        setOrganizations((current) => [...current, ...response.data]);
        setMeta(response.meta);
        setPage(response.meta.page);
      })
      .catch((error) => {
        if (error instanceof ApiError) {
          setErrors(error.data);
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="space-y-6">
      <Toolbar
        title={t("organizations.list.title")}
        searchValue={searchTerm}
        onSearch={(e) => setSearchTerm(e.target.value)}
        showAdd={false}
      />

      <FormErrors errors={errors}/>

      <Card title={t("organizations.list.cardTitle")} className="hover:translate-y-0">
        {loading && organizations.length === 0 ? (
          <Loading/>
        ) : (
          <OrganizationsTable organizations={organizations}/>
        )}
        <Pagination meta={meta} loading={loading} onLoadMore={loadMore}/>
      </Card>
    </div>
  );
}
