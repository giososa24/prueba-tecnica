export interface IPagination {
    totalDocs: number
    limit: number
    page: number | null | undefined
    totalPages: number
    hasNextPage: boolean
    nextPage: number | null | undefined
    hasPrevPage: boolean
    prevPage: number | null | undefined
    pagingCounter: number
}