export interface TableColumn {
  key: string;
  sortKey?: string;
  label: string;
  type?: 'text' | 'action';
  filterable?: boolean;
  filterType?: 'text' | 'select';
  filterOptions?: { id: string | number; label: string }[];
  selectMode?: 'single' | 'multiple';
  sortable?: boolean;
}

export interface ActionMenuItem {
  label: string;
  icon?: string;
  action: string;
  showCondition?: (item: any) => boolean;
}

export interface TableState {
  filters: { [key: string]: any };
  sort?: { column: string; direction: 'asc' | 'desc' };
  pagination: { pageSize: number; pageNumber: number };
}
