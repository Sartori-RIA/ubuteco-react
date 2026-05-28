"use client";

import {ApiMetaData} from "@/app/_types";
import {Buttons} from "@/app/_components/Buttons";

type Props = {
  meta: ApiMetaData;
  loading?: boolean;
  onLoadMore: () => void;
};

export function Pagination({meta, loading = false, onLoadMore}: Props) {
  const hasMore = meta.page < meta.pages;

  if (meta.count === 0) return null;

  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <p className="text-xs text-gray-500">
        Showing {meta.count} result{meta.count === 1 ? "" : "s"} · page {meta.page} of {meta.pages}
      </p>
      {hasMore && (
        <Buttons type="button" variant="outline" onClick={onLoadMore} loading={loading}>
          Load more
        </Buttons>
      )}
    </div>
  );
}
