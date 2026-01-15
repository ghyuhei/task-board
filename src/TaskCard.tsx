import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import type { Task } from './types';
import { getTagColor } from './utils';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string, description: string) => void;
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

  const [isExpanded, setIsExpanded] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const hasDescription = task.description.trim().length > 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task-card"
      role="listitem"
    >
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => {
          const newTitle = e.currentTarget.textContent || '';
          if (newTitle !== task.title) {
            onEdit(task.id, newTitle, task.description);
          }
        }}
        className="task-title"
        role="textbox"
        aria-label="Task title"
      >
        {task.title}
      </div>

      {hasDescription && (
        <button
          className="expand-btn"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          aria-label={isExpanded ? 'Collapse description' : 'Expand description'}
        >
          {isExpanded ? '▼' : '▶'} Description
        </button>
      )}

      {isExpanded && (
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => {
            const newDescription = e.currentTarget.textContent || '';
            if (newDescription !== task.description) {
              onEdit(task.id, task.title, newDescription);
            }
          }}
          className="task-description"
          role="textbox"
          aria-label="Task description"
          aria-multiline="true"
        >
          {task.description}
        </div>
      )}

      {!isExpanded && !hasDescription && (
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => {
            const newDescription = e.currentTarget.textContent || '';
            if (newDescription.trim()) {
              onEdit(task.id, task.title, newDescription);
            }
          }}
          className="task-description-placeholder"
          role="textbox"
          aria-label="Add description"
          aria-multiline="true"
        >
        </div>
      )}

      {task.tags.length > 0 && (
        <div className="task-tags">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="task-tag"
              style={{ backgroundColor: getTagColor(tag) }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <button
        className="delete-btn"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        aria-label="Delete task"
        tabIndex={0}
      >
        ×
      </button>
    </div>
  );
}
