import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from './types';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (id: string, content: string) => void;
}

export function TaskCard({ task, onDelete, onEdit }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task-card"
    >
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => {
          const newContent = e.currentTarget.textContent || '';
          if (newContent !== task.content) {
            onEdit(task.id, newContent);
          }
        }}
        className="task-content"
      >
        {task.content}
      </div>
      <button
        className="delete-btn"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
      >
        ×
      </button>
    </div>
  );
}
