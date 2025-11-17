import { useState, useMemo } from 'react';

export const usePagination = <T,>(items: T[], itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => {
    return Math.ceil(items.length / itemsPerPage);
  }, [items, itemsPerPage]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  const onPageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  // Reset to page 1 if current page becomes invalid
  if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
  }

  return {
    currentPage,
    totalPages,
    onPageChange,
    paginatedItems,
  };
};
