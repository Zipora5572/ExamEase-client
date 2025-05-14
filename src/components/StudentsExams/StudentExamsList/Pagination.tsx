"use client"

import { Button } from "@/components/ui/button"


const Pagination = ({ currentPage, totalPages, setCurrentPage }: { currentPage: number; totalPages: number; setCurrentPage: (page: number) => void }) => {
    const renderPagination = () => {
    const pages = []
    const maxPagesToShow = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentPage(i)}
          className={`w-9 h-9 p-0 ${currentPage === i ? "bg-red-600 hover:bg-red-700" : "border-gray-200 hover:bg-gray-50"}`}
        >
          {i}
        </Button>,
      )
    }

    return (
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className="w-9 h-9 p-0 border-gray-200"
        >
          &laquo;
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-9 h-9 p-0 border-gray-200"
        >
          &lsaquo;
        </Button>

        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              className="w-9 h-9 p-0 border-gray-200"
            >
              1
            </Button>
            {startPage > 2 && <span className="mx-1">...</span>}
          </>
        )}

        {pages}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="mx-1">...</span>}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              className="w-9 h-9 p-0 border-gray-200"
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-9 h-9 p-0 border-gray-200"
        >
          &rsaquo;
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className="w-9 h-9 p-0 border-gray-200"
        >
          &raquo;
        </Button>
      </div>
    )
  }

  return renderPagination()
}

export default Pagination
