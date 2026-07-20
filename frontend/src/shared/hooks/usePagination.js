import { useState, useMemo, useEffect } from 'react';

export const usePagination = ({ initialPageSize = 5, initialPage = 1 }) => {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [totalRecords, setTotalRecords] = useState(0) 

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalRecords / pageSize))
  }, [totalRecords, pageSize])

  useEffect(() => {
    if (totalRecords > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage])

  const goToPage = (page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(pageNumber)
  }

  const nextPage = () => goToPage(currentPage + 1)
  const prevPage = () => goToPage(currentPage - 1)

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize)
    setCurrentPage(1)
  }

  return {
    currentPage,
    pageSize,
    totalPages,
    totalRecords,
    goToPage,
    nextPage,
    prevPage,
    setPageSize: handlePageSizeChange,
    setTotalRecords
  }
}
