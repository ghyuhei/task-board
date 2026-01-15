export type ColumnId = 'todo' | 'inProgress' | 'backlog' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  columnId: ColumnId;
  createdAt: number;
  tags: string[];
}

export interface BoardColumn {
  id: ColumnId;
  title: string;
  color: string;
}
