"use client";

import {ApiMetaData} from "@/app/_types";
import {Buttons} from "@/app/_components/Buttons";
import {useTranslations} from "@/app/_hooks/useTranslations";

type Props = {
  meta: ApiMetaData;
  loading?: boolean;
  onLoadMore: () => void;
};

export function Pagination({meta, loading = false, onLoadMore}: Props) {
  const t = useTranslations();
  const hasMore = meta.page < meta.pages;

  if (meta.count === 0) return null;

  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <p className="text-xs text-muted">
        {t("common.pagination", {count: meta.count, page: meta.page, pages: meta.pages})}
      </p>
      {hasMore && (
        <Buttons type="button" variant="outline" onClick={onLoadMore} loading={loading}>
          {t("common.loadMore")}
        </Buttons>
      )}
    </div>
  );
}
