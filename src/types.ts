export type ColumnId = 'todo' | 'inProgress' | 'backlog' | 'completed';

export interface Task {
  id: string;
  content: string;
  columnId: ColumnId;
  createdAt: number;
}

export interface Column {
  id: ColumnId;
  title: string;
  color: string;
}
