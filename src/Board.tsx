import { useState, useEffect } from 'react';
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Column } from './Column';
import type { Column as ColumnType, Task, ColumnId } from './types';

const COLUMNS: ColumnType[] = [
  { id: 'todo', title: 'To Do', color: '#FFE5B4' },
  { id: 'inProgress', title: 'In Progress', color: '#B4D7FF' },
  { id: 'backlog', title: 'Backlog', color: '#E5D4FF' },
  { id: 'completed', title: 'Completed', color: '#C8F7C8' },
];

const STORAGE_KEY = 'task-board-data';

export function Board() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (columnId: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      content: 'New task',
      columnId: columnId as ColumnId,
      createdAt: Date.now(),
    };
    setTasks([...tasks, newTask]);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleEditTask = (id: string, content: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, content } : task)));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    const overColumnId = over.id as ColumnId;
    const isOverColumn = COLUMNS.some((col) => col.id === overColumnId);

    if (isOverColumn) {
      setTasks(
        tasks.map((task) =>
          task.id === active.id ? { ...task, columnId: overColumnId } : task
        )
      );
    } else {
      const overTask = tasks.find((t) => t.id === over.id);
      if (!overTask || overTask.columnId !== activeTask.columnId) {
        if (overTask) {
          setTasks(
            tasks.map((task) =>
              task.id === active.id ? { ...task, columnId: overTask.columnId } : task
            )
          );
        }
        return;
      }

      const columnTasks = tasks.filter((t) => t.columnId === activeTask.columnId);
      const oldIndex = columnTasks.findIndex((t) => t.id === active.id);
      const newIndex = columnTasks.findIndex((t) => t.id === over.id);

      const reordered = arrayMove(columnTasks, oldIndex, newIndex);
      const otherTasks = tasks.filter((t) => t.columnId !== activeTask.columnId);

      setTasks([...otherTasks, ...reordered]);
    }
  };

  const getTasksByColumn = (columnId: ColumnId) =>
    tasks.filter((task) => task.columnId === columnId);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => setActiveId(active.id as string)}
      onDragEnd={handleDragEnd}
    >
      <div className="board">
        {COLUMNS.map((column) => (
          <Column
            key={column.id}
            column={column}
            tasks={getTasksByColumn(column.id)}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
          />
        ))}
      </div>
      <DragOverlay>
        {activeId ? (
          <div className="task-card drag-overlay">
            {tasks.find((t) => t.id === activeId)?.content}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
