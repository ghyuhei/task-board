import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { BoardColumn, Task, ColumnId } from './types';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  column: BoardColumn;
  tasks: Task[];
  onAddTask: (columnId: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, title: string, description: string) => void;
  onEditColumnTitle: (columnId: ColumnId, newTitle: string) => void;
}

export function Column({ column, tasks, onAddTask, onDeleteTask, onEditTask, onEditColumnTitle }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div className="column" style={{ borderTopColor: column.color }} role="region" aria-label={`${column.title} column`}>
      <div className="column-header">
        <h2
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => {
            const newTitle = e.currentTarget.textContent || '';
            if (newTitle !== column.title && newTitle.trim() !== '') {
              onEditColumnTitle(column.id, newTitle);
            } else if (newTitle.trim() === '') {
              e.currentTarget.textContent = column.title;
            }
          }}
          className="column-title"
          role="textbox"
          aria-label="Column title (click to edit)"
        >
          {column.title}
        </h2>
        <span className="task-count" aria-label={`${tasks.length} tasks`}>{tasks.length}</span>
      </div>
      <button
        className="add-task-btn"
        onClick={() => onAddTask(column.id)}
        aria-label={`Add task to ${column.title}`}
      >
        + Add Task
      </button>
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="task-list" role="list">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDeleteTask}
              onEdit={onEditTask}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
