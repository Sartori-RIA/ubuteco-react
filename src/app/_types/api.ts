export type RejectValue = {
  rejectValue: {
    status: number
    errors: string[]
  }
}


export interface ApiMetaData {
  "page": number,
  "count": number,
  "pages": number,
  "previous": number | null,
  "last": number | null,
}

export interface PaginatedResponse<T> {
  data: T[];
  "meta": ApiMetaData
}