import React, { ReactNode, useMemo, useState } from "react";

interface Column<T> {
  key: string;
  title: string;
  render?: (row: T, rowIndex: number) => ReactNode;
  sortable?: boolean;
  width?: string | number;
  align?: "left" | "center" | "right";
}

interface CommonTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSizeOptions?: number[];
  initialPageSize?: number;
  emptyText?: string;
  className?: string;
}

function CommonTable<T extends { id?: string | number }>({
  columns,
  data,
  pageSizeOptions = [5, 10, 20, 50],
  initialPageSize = 10,
  emptyText = "No data found",
  className = "",
}: CommonTableProps<T>) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = useMemo(
    () => data.slice((page - 1) * pageSize, page * pageSize),
    [data, page, pageSize]
  );

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  // Pagination numbers logic (with ellipsis)
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };

  const startEntry = data.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, data.length);

  return (
    <div className={`w-full ${className}`}>
      <div className="overflow-x-auto">
        <table
          className="min-w-full border border-gray-200 rounded-xl bg-white"
          style={{ borderCollapse: "separate", borderSpacing: 0 }}
        >
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-[15px] font-semibold text-gray-700 bg-[#eaf7f2] border-b border-gray-200 ${
                    idx === 0
                      ? "rounded-tl-xl border-l border-gray-200"
                      : "border-l-0"
                  } ${
                    idx === columns.length - 1
                      ? "rounded-tr-xl border-r border-gray-200"
                      : "border-r-0"
                  }`}
                  style={{ width: col.width }}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-8 text-gray-400 border-b border-gray-200"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  className={`border-b border-gray-200 last:rounded-b-xl last:border-b-0 hover:bg-gray-50 transition`}
                >
                  {columns.map((col, idx) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 align-middle border-l border-b border-gray-200 ${
                        idx === 0 ? "border-l-0" : ""
                      } ${idx === columns.length - 1 ? "border-r-0" : ""}`}
                    >
                      {col.render
                        ? col.render(row, rowIndex)
                        : (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4 px-1">
        {/* Left: Showing X to Y of Z entries */}
        <div className="text-sm text-gray-600 flex items-center gap-2">
          <span>
          {`Showing ${startEntry} to ${endEntry} of ${data.length} entries`}
          </span>
          {/* Center: Page size dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                className="flex items-center border border-gray-200 rounded-lg px-4 py-1.5 bg-white text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#10b39c]"
                type="button"
                tabIndex={0}
              >
                Show {pageSize}
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className="absolute left-0 mt-1 w-full z-10 bg-white border border-gray-200 rounded-lg shadow-lg hidden group-hover:block">
                {/* Dropdown would go here if you want a custom dropdown */}
              </div>
              <select
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* Right: Pagination numbers */}
        <div className="flex items-center gap-1">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 disabled:opacity-50"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            aria-label="Previous"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          {getPageNumbers().map((p, idx) =>
            p === "..." ? (
              <span key={idx} className="px-2 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={p as number}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all
                  ${
                    p === page
                      ? "bg-[#10b39c] text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                onClick={() => handlePageChange(Number(p))}
                disabled={p === page}
              >
                {p}
              </button>
            )
          )}
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 disabled:opacity-50"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages || totalPages === 0}
            aria-label="Next"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommonTable;
