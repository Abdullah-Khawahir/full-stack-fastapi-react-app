import Empty from "@/components/empty"
import ErrorMessage from "@/components/error-message"
import Loading from "@/components/loading"
import type { UseQueryResult } from "@tanstack/react-query"


/**
 * Renders the state of a query.
 * @template T
 * @param {UseQueryResult<T>} query - The query result to render.
 * @returns {JSX.Element} - The component representing the query state.
 */
export function renderQueryState<T>(query: UseQueryResult<T>) {
  const { data, isLoading, isError, error } = query
  if(query.isSuccess) return null

  if (isLoading) return <Loading />
  if (isError) return <ErrorMessage message={error instanceof Error ? error.message : "Something went wrong"} />
  if (Array.isArray(data) && data.length === 0) return <Empty />

  return null
}
