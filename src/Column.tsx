import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Column as ColumnType, Task } from './types';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onAddTask: (columnId: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, content: string) => void;
}

export function Column({ column, tasks, onAddTask, onDeleteTask, onEditTask }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div className="column" style={{ borderTopColor: column.color }}>
      <div className="column-header">
        <h2>{column.title}</h2>
        <span className="task-count">{tasks.length}</span>
      </div>
      <button className="add-task-btn" onClick={() => onAddTask(column.id)}>
        + Add Task
      </button>
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="task-list">
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
