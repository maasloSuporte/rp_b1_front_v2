import { useState, useEffect, useCallback, useRef } from 'react';
import type { TableColumn, ActionMenuItem } from '../types/table';

interface DynamicTableProps {
  columns: TableColumn[];
  data: any[];
  actionMenuItems?: ActionMenuItem[];
  pageSize?: number;
  pageSizeOptions?: number[];
  totalItems?: number;
  showFirstLastButtons?: boolean;
  onActionClick?: (event: { action: string; item: any }) => void;
  onQueryParamsChange?: (queryString: string) => void;
}

export default function DynamicTable({
  columns,
  data,
  actionMenuItems = [],
  pageSize = 5,
  pageSizeOptions = [5, 10, 25, 100],
  totalItems = 0,
  showFirstLastButtons = true,
  onActionClick,
  onQueryParamsChange,
}: DynamicTableProps) {
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
  const [columnFilters, setColumnFilters] = useState<{ [key: string]: any }>({});
  const [showFilters, setShowFilters] = useState<{ [key: string]: boolean }>({});
  const [currentSort, setCurrentSort] = useState<{ column: string; direction: 'asc' | 'desc' }>({
    column: 'id',
    direction: 'asc',
  });
  const [currentPage, setCurrentPage] = useState({ pageSize, pageNumber: 0 });
  const filterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const buildQueryString = useCallback((): string => {
    const queryParams: string[] = [];

    Object.entries(columnFilters)
      .filter(([_, val]) => {
        if (!val) return false;
        if (Array.isArray(val) && val.length === 0) return false;
        if (val === '') return false;
        return true;
      })
      .forEach(([key, val]) => {
        const value = Array.isArray(val) ? val.join(',') : String(val);
        queryParams.push(`${key}=${encodeURIComponent(value)}`);
      });

    const column = columns.find((col) => col.key === currentSort.column);
    const sortField = column?.sortKey || currentSort.column;
    if (sortField) {
      queryParams.push(`sortField=${sortField}`);
      queryParams.push(`sortOrder=${currentSort.direction}`);
    }

    queryParams.push(`pageSize=${currentPage.pageSize}`);
    queryParams.push(`pageNumber=${currentPage.pageNumber + 1}`);

    return queryParams.join('&');
  }, [columnFilters, currentSort, currentPage, columns]);

  const emitQueryParams = useCallback(() => {
    if (onQueryParamsChange) {
      const queryString = buildQueryString();
      onQueryParamsChange(queryString);
    }
  }, [buildQueryString, onQueryParamsChange]);

  useEffect(() => {
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }
    filterTimeoutRef.current = setTimeout(() => {
      emitQueryParams();
    }, 300);

    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, [columnFilters, currentSort, currentPage, emitQueryParams]);

  useEffect(() => {
    emitQueryParams();
  }, []);

  const toggleMenu = (index: number) => {
    setActiveMenuIndex(activeMenuIndex === index ? null : index);
  };

  const handleActionClick = (action: string, item: any) => {
    if (onActionClick) {
      onActionClick({ action, item });
    }
    setActiveMenuIndex(null);
  };

  const toggleFilter = (columnKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowFilters((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
    if (showFilters[columnKey]) {
      setColumnFilters((prev) => {
        const newFilters = { ...prev };
        delete newFilters[columnKey];
        return newFilters;
      });
    }
  };

  const applyFilter = (columnKey: string, value: any) => {
    const column = columns.find((col) => col.key === columnKey);
    if (column?.filterType === 'select' && column.selectMode === 'single' && value === '') {
      setColumnFilters((prev) => {
        const newFilters = { ...prev };
        delete newFilters[columnKey];
        return newFilters;
      });
    } else {
      setColumnFilters((prev) => ({ ...prev, [columnKey]: value }));
    }
  };

  const onSort = (column: TableColumn) => {
    if (!column.sortable) return;

    if (currentSort.column === column.key) {
      if (currentSort.direction === 'asc') {
        setCurrentSort({ column: '', direction: 'desc' });
      } else {
        setCurrentSort({ column: column.key, direction: 'desc' });
      }
    } else {
      setCurrentSort({ column: column.key, direction: 'asc' });
    }
  };

  const onPageChange = (newPage: number, newPageSize?: number) => {
    setCurrentPage({
      pageSize: newPageSize || currentPage.pageSize,
      pageNumber: newPage,
    });
  };

  const getSortIcon = (column: TableColumn): string => {
    if (!column.sortable || currentSort.column !== column.key) {
      return '⇅';
    }
    return currentSort.direction === 'asc' ? '↑' : '↓';
  };

  const hasActiveFilters = (): boolean => {
    return Object.entries(columnFilters).some(([_, val]) => {
      if (!val) return false;
      if (Array.isArray(val) && val.length === 0) return false;
      if (val === '') return false;
      return true;
    });
  };

  const clearAllFilters = () => {
    setColumnFilters({});
    setShowFilters({});
  };

  const totalPages = Math.ceil(totalItems / currentPage.pageSize);

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      {hasActiveFilters() && (
        <div className="px-4 py-2 bg-gray-50 border-b flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Filtros ativos:</span>
          {Object.entries(columnFilters)
            .filter(([_, val]) => val && val !== '' && (!Array.isArray(val) || val.length > 0))
            .map(([key, val]) => {
              const column = columns.find((col) => col.key === key);
              let displayValue = String(val);
              if (column?.filterType === 'select') {
                if (Array.isArray(val)) {
                  displayValue = val
                    .map(
                      (id) => column.filterOptions?.find((opt) => opt.id === id)?.label || String(id)
                    )
                    .join(', ');
                } else {
                  displayValue =
                    column.filterOptions?.find((opt) => opt.id === val)?.label || String(val);
                }
              }
              return (
                <span
                  key={key}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {column?.label || key}: {displayValue}
                  <button
                    onClick={() => applyFilter(key, '')}
                    className="ml-1 text-indigo-600 hover:text-indigo-800"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          <button
            onClick={clearAllFilters}
            className="text-xs text-indigo-600 hover:text-indigo-800"
          >
            Limpar todos
          </button>
        </div>
      )}

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <div className="flex items-center gap-2">
                  <span>{column.label}</span>
                  {column.sortable && (
                    <button
                      onClick={() => onSort(column)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {getSortIcon(column)}
                    </button>
                  )}
                  {column.filterable && (
                    <div className="relative">
                      <button
                        onClick={(e) => toggleFilter(column.key, e)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        🔍
                      </button>
                      {showFilters[column.key] && (
                        <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg p-2">
                          {column.filterType === 'text' && (
                            <input
                              type="text"
                              className="w-full px-2 py-1 border rounded"
                              placeholder="Filtrar..."
                              value={columnFilters[column.key] || ''}
                              onChange={(e) => applyFilter(column.key, e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          )}
                          {column.filterType === 'select' && (
                            <select
                              className="w-full px-2 py-1 border rounded"
                              value={
                                Array.isArray(columnFilters[column.key])
                                  ? ''
                                  : columnFilters[column.key] || ''
                              }
                              onChange={(e) => {
                                if (column.selectMode === 'multiple') {
                                  const value = Number(e.target.value);
                                  const current = (columnFilters[column.key] as number[]) || [];
                                  if (current.includes(value)) {
                                    applyFilter(
                                      column.key,
                                      current.filter((v) => v !== value)
                                    );
                                  } else {
                                    applyFilter(column.key, [...current, value]);
                                  }
                                } else {
                                  applyFilter(column.key, e.target.value);
                                }
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <option value="">Todos</option>
                              {column.filterOptions?.map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {column.type === 'action' ? (
                    <div className="relative">
                      <button
                        onClick={() => toggleMenu(rowIndex)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        ⋮
                      </button>
                      {activeMenuIndex === rowIndex && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                          {actionMenuItems
                            .filter((item) => !item.showCondition || item.showCondition(row))
                            .map((item) => (
                              <button
                                key={item.action}
                                onClick={() => handleActionClick(item.action, row)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                {item.label}
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    row[column.key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => onPageChange(Math.max(0, currentPage.pageNumber - 1))}
            disabled={currentPage.pageNumber === 0}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={() => onPageChange(Math.min(totalPages - 1, currentPage.pageNumber + 1))}
            disabled={currentPage.pageNumber >= totalPages - 1}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Próximo
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Mostrando{' '}
              <span className="font-medium">
                {currentPage.pageNumber * currentPage.pageSize + 1}
              </span>{' '}
              até{' '}
              <span className="font-medium">
                {Math.min((currentPage.pageNumber + 1) * currentPage.pageSize, totalItems)}
              </span>{' '}
              de <span className="font-medium">{totalItems}</span> resultados
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={currentPage.pageSize}
              onChange={(e) => onPageChange(0, Number(e.target.value))}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <div className="flex gap-1">
              {showFirstLastButtons && (
                <button
                  onClick={() => onPageChange(0)}
                  disabled={currentPage.pageNumber === 0}
                  className="px-2 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                >
                  ««
                </button>
              )}
              <button
                onClick={() => onPageChange(Math.max(0, currentPage.pageNumber - 1))}
                disabled={currentPage.pageNumber === 0}
                className="px-2 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
              >
                «
              </button>
              <span className="px-2 py-1 text-sm">
                Página {currentPage.pageNumber + 1} de {totalPages || 1}
              </span>
              <button
                onClick={() => onPageChange(Math.min(totalPages - 1, currentPage.pageNumber + 1))}
                disabled={currentPage.pageNumber >= totalPages - 1}
                className="px-2 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
              >
                »
              </button>
              {showFirstLastButtons && (
                <button
                  onClick={() => onPageChange(totalPages - 1)}
                  disabled={currentPage.pageNumber >= totalPages - 1}
                  className="px-2 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                >
                  »»
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
