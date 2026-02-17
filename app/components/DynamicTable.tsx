import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { TableColumn, ActionMenuItem } from '../types/table';

const actionIcons: Record<string, React.ReactNode> = {
  download: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  'arrow-up': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
    </svg>
  ),
  edit: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  ),
  trash: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  block: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
  ),
  play: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  preview: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
};

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
  /** Ordenação inicial: key da coluna (ex: 'name', 'nextExecution') */
  initialSortField?: string;
  /** Direção inicial da ordenação */
  initialSortOrder?: 'asc' | 'desc';
  /** IDs das linhas selecionadas (para coluna type: 'checkbox') */
  selectedRowIds?: number[];
  /** Callback ao marcar/desmarcar checkbox da linha */
  onSelectionChange?: (id: number, selected: boolean) => void;
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
  initialSortField = 'id',
  initialSortOrder = 'asc',
  selectedRowIds = [],
  onSelectionChange,
}: DynamicTableProps) {
  const { t } = useTranslation('translation');
  const [columnFilters, setColumnFilters] = useState<{ [key: string]: any }>({});
  const [selectedFilterColumn, setSelectedFilterColumn] = useState<string>('');
  const [currentSort, setCurrentSort] = useState<{ column: string; direction: 'asc' | 'desc' }>({
    column: initialSortField,
    direction: initialSortOrder,
  });
  const [currentPage, setCurrentPage] = useState({ pageSize, pageNumber: 0 });
  const filterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const FILTER_DEBOUNCE_MS = 3000;

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
        const column = columns.find((col) => col.key === key);
        const paramName = column?.filterKey ?? key;
        const value = Array.isArray(val) ? val.join(',') : String(val);
        queryParams.push(`${paramName}=${encodeURIComponent(value)}`);
      });

    const column = columns.find((col) => col.key === currentSort.column);
    const sortField = column?.sortKey || currentSort.column;
    if (sortField) {
      queryParams.push(`SortField=${sortField}`);
      queryParams.push(`SortOrder=${currentSort.direction}`);
    }

    queryParams.push(`PageSize=${currentPage.pageSize}`);
    queryParams.push(`PageNumber=${currentPage.pageNumber + 1}`);

    return queryParams.join('&');
  }, [columnFilters, currentSort, currentPage, columns]);

  const emitQueryParams = useCallback(() => {
    if (onQueryParamsChange) {
      const queryString = buildQueryString();
      onQueryParamsChange(queryString);
    }
  }, [buildQueryString, onQueryParamsChange]);

  // Debounce de 3s ao digitar no filtro
  useEffect(() => {
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }
    filterTimeoutRef.current = setTimeout(() => {
      emitQueryParams();
    }, FILTER_DEBOUNCE_MS);

    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, [columnFilters, emitQueryParams]);

  // Ordenação e paginação disparam a busca imediatamente (cancela debounce do filtro)
  useEffect(() => {
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
      filterTimeoutRef.current = null;
    }
    emitQueryParams();
  }, [currentSort, currentPage, emitQueryParams]);

  const handleActionClick = (action: string, item: any) => {
    if (onActionClick) {
      onActionClick({ action, item });
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
      const nextDirection = currentSort.direction === 'asc' ? 'desc' : 'asc';
      setCurrentSort({ column: column.key, direction: nextDirection });
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

  const clearAllFilters = () => {
    setColumnFilters({});
    setSelectedFilterColumn('');
  };

  const totalPages = Math.max(1, Math.ceil(totalItems / currentPage.pageSize));
  const startItem = totalItems === 0 ? 0 : currentPage.pageNumber * currentPage.pageSize + 1;
  const endItem = Math.min((currentPage.pageNumber + 1) * currentPage.pageSize, totalItems);

  const filterableColumns = columns.filter((col) => col.filterable);
  const selectedColumn = columns.find((col) => col.key === selectedFilterColumn);
  const hasFilterableColumns = filterableColumns.length > 0;

  // Números de página visíveis (0-based), com reticências quando há muitas páginas
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i);
    const cur = currentPage.pageNumber;
    if (cur <= 3) return [0, 1, 2, 3, 4, 'ellipsis', totalPages - 1];
    if (cur >= totalPages - 4) return [0, 'ellipsis', ...Array.from({ length: 5 }, (_, i) => totalPages - 5 + i)];
    return [0, 'ellipsis', cur - 1, cur, cur + 1, 'ellipsis', totalPages - 1];
  };

  return (
    <div className="bg-white rounded-2xl overflow-visible border border-border shadow-[0_4px_6px_-1px_rgba(0,0,0,0.07),0_2px_4px_-2px_rgba(0,0,0,0.05)]">
      <div className="p-6">
        {hasFilterableColumns && (
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <select
              value={selectedFilterColumn}
              onChange={(e) => setSelectedFilterColumn(e.target.value)}
              className="rounded-lg border border-border bg-white px-4 py-2.5 text-base text-text-primary focus:border-purple focus:ring-2 focus:ring-purple/20 outline-none min-w-[180px]"
            >
              <option value="">{t('common.table.filterPlaceholder')}</option>
              {filterableColumns.map((col) => (
                <option key={col.key} value={col.key}>
                  {col.label}
                </option>
              ))}
            </select>

            {selectedColumn && (
              selectedColumn.filterType === 'text' ? (
                <input
                  type="text"
                  placeholder={t('common.table.searchIn', { label: selectedColumn.label })}
                  value={(columnFilters[selectedFilterColumn] ?? '') as string}
                  onChange={(e) => applyFilter(selectedFilterColumn, e.target.value)}
                  className="rounded-lg border border-border bg-white px-4 py-2.5 text-base text-text-primary placeholder:text-text-secondary focus:border-purple focus:ring-2 focus:ring-purple/20 outline-none min-w-[200px]"
                />
              ) : (
                <select
                  value={
                    Array.isArray(columnFilters[selectedFilterColumn]) ? '' : (columnFilters[selectedFilterColumn] ?? '')
                  }
                  onChange={(e) => applyFilter(selectedFilterColumn, e.target.value)}
                  className="rounded-lg border border-border bg-white px-4 py-2.5 text-base text-text-primary focus:border-purple focus:ring-2 focus:ring-purple/20 outline-none min-w-[180px]"
                >
                  <option value="">{t('common.table.all')}</option>
                  {selectedColumn.filterOptions?.map((opt) => (
                    <option key={String(opt.id)} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )
            )}

            <button
              type="button"
              onClick={clearAllFilters}
              disabled={!Object.keys(columnFilters).some((k) => {
                const v = columnFilters[k];
                return v !== '' && v != null && (!Array.isArray(v) || v.length > 0);
              })}
              className="inline-flex items-center justify-center rounded-lg border border-border bg-white p-2.5 text-text-secondary hover:bg-error/10 hover:text-error hover:border-error/30 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              title={t('common.table.clearFilters')}
              aria-label={t('common.table.clearFilters')}
            >
              {actionIcons.trash}
            </button>
          </div>
        )}

        <div className="min-w-0 w-full overflow-x-auto">
        <table className="min-w-full w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200/60">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-5 text-left text-sm font-bold text-text-primary uppercase tracking-wider first:pl-8 last:pr-8"
                >
                  <div className="flex items-center gap-2">
                    {column.type === 'checkbox' ? (
                      <input
                        type="checkbox"
                        checked={data.length > 0 && data.every((r) => selectedRowIds.includes(r.id))}
                        onChange={(e) => {
                          if (onSelectionChange) {
                            data.forEach((r) => onSelectionChange(r.id, e.target.checked));
                          }
                        }}
                        className="rounded border-gray-300 text-purple focus:ring-purple"
                        aria-label={t('common.table.selectAll')}
                      />
                    ) : (
                      <>
                        <span>{column.label}</span>
                        {column.sortable && (
                      <button
                        onClick={() => onSort(column)}
                        className="p-1 rounded text-text-secondary hover:text-text-primary hover:bg-border transition-colors"
                        aria-label={t('common.table.sortBy', { label: column.label })}
                      >
                        {getSortIcon(column)}
                      </button>
                    )}
                      </>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center first:pl-8 last:pr-8"
                >
                  <p className="text-base text-text-secondary">
                    {t('common.table.noResults')}
                  </p>
                  <p className="mt-1 text-sm text-text-secondary/80">
                    {t('common.table.noResultsHint')}
                  </p>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`transition-colors ${
                    rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  } hover:bg-purple-100/20`}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-5 text-base text-text-primary first:pl-8 last:pr-8"
                    >
                      {column.type === 'checkbox' ? (
                        <input
                          type="checkbox"
                          checked={selectedRowIds.includes(row.id)}
                          onChange={(e) => onSelectionChange?.(row.id, e.target.checked)}
                          className="rounded border-gray-300 text-purple focus:ring-purple"
                          aria-label={`Selecionar ${row.id}`}
                        />
                      ) : column.type === 'action' ? (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {actionMenuItems
                            .filter((item) => !item.showCondition || item.showCondition(row))
                            .map((item) => {
                              const isDelete = item.action === 'delete' || item.action === 'deleted';
                              const icon = actionIcons[item.icon ?? 'edit'] ?? actionIcons.edit;
                              return (
                                <button
                                  key={item.action}
                                  onClick={() => handleActionClick(item.action, row)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    isDelete
                                      ? 'text-error hover:bg-error/10'
                                      : 'text-purple hover:bg-purple-100'
                                  }`}
                                  title={item.label}
                                  aria-label={item.label}
                                >
                                  {isDelete ? actionIcons.trash : icon}
                                </button>
                              );
                            })}
                        </div>
                      ) : (
                        <span className="block min-w-0">{row[column.key] ?? '—'}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>

      <div className="mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-transparent">
        <div className="flex items-center gap-4 w-full sm:w-auto order-2 sm:order-1">
          <p className="text-base text-text-secondary">
            {t('common.table.showing')} <span className="font-medium text-text-primary">{startItem}</span>
            {startItem !== endItem && (
              <>–<span className="font-medium text-text-primary">{endItem}</span></>
            )}{' '}
            {t('common.table.of')} <span className="font-medium text-text-primary">{totalItems}</span>
          </p>
          <div className="flex items-center gap-2">
            <span className="text-base text-text-secondary">{t('common.table.perPage')}</span>
            <select
              value={currentPage.pageSize}
              onChange={(e) => onPageChange(0, Number(e.target.value))}
              className="border border-border/80 rounded-lg px-2.5 py-1.5 text-base text-text-primary bg-white focus:ring-2 focus:ring-purple-100 focus:border-purple outline-none"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-center sm:justify-end order-1 sm:order-2">
          <button
            onClick={() => onPageChange(Math.max(0, currentPage.pageNumber - 1))}
            disabled={currentPage.pageNumber === 0}
            className="p-2 rounded-lg text-text-secondary hover:bg-white hover:text-purple disabled:opacity-40 disabled:pointer-events-none transition-colors border border-transparent hover:border-border/80"
            aria-label="Página anterior"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {getPageNumbers().map((page, i) =>
            page === 'ellipsis' ? (
              <span key={`e-${i}`} className="px-2 text-text-secondary">…</span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={`min-w-[2.5rem] h-10 rounded-lg text-base font-medium transition-colors ${
                  currentPage.pageNumber === page
                    ? 'bg-purple text-white shadow-sm'
                    : 'text-text-primary hover:bg-white border border-border/80'
                }`}
              >
                {(page as number) + 1}
              </button>
            )
          )}
          <button
            onClick={() => onPageChange(Math.min(totalPages - 1, currentPage.pageNumber + 1))}
            disabled={currentPage.pageNumber >= totalPages - 1}
            className="p-2 rounded-lg text-text-secondary hover:bg-white hover:text-purple disabled:opacity-40 disabled:pointer-events-none transition-colors border border-transparent hover:border-border/80"
            aria-label={t('common.table.nextPage')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="sm:hidden mt-4 pt-4 flex justify-between">
        <button
          onClick={() => onPageChange(Math.max(0, currentPage.pageNumber - 1))}
          disabled={currentPage.pageNumber === 0}
          className="px-4 py-2 rounded-lg border border-border/80 text-sm font-medium text-text-primary bg-white hover:bg-purple-100/50 disabled:opacity-50"
        >
          {t('common.table.previous')}
        </button>
        <span className="py-2 text-sm text-text-secondary">
          {currentPage.pageNumber + 1} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(totalPages - 1, currentPage.pageNumber + 1))}
          disabled={currentPage.pageNumber >= totalPages - 1}
          className="px-4 py-2 rounded-lg border border-border/80 text-sm font-medium text-text-primary bg-white hover:bg-purple-100/50 disabled:opacity-50"
        >
          {t('common.table.next')}
        </button>
      </div>
      </div>
    </div>
  );
}
