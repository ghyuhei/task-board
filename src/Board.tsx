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
import type { BoardColumn, Task, ColumnId } from './types';
import { extractTags, getTagColor } from './utils';

const DEFAULT_COLUMNS: BoardColumn[] = [
  { id: 'todo', title: 'To Do', color: '#FFE5B4' },
  { id: 'inProgress', title: 'In Progress', color: '#B4D7FF' },
  { id: 'backlog', title: 'Backlog', color: '#E5D4FF' },
  { id: 'completed', title: 'Completed', color: '#C8F7C8' },
];

const STORAGE_KEY = 'task-board-data';
const COLUMNS_STORAGE_KEY = 'task-board-columns';

export function Board() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const parsedTasks = JSON.parse(stored);
      return parsedTasks.map((task: Partial<Task> & { content?: string }) => ({
        ...task,
        id: task.id || `task-${Date.now()}`,
        title: task.title || task.content || 'Untitled',
        description: task.description || (task.content ? '' : ''),
        columnId: task.columnId || 'todo',
        createdAt: task.createdAt || Date.now(),
        tags: task.tags || [],
      }));
    } catch (error) {
      console.error('Failed to load tasks from localStorage:', error);
      return [];
    }
  });

  const [columns, setColumns] = useState<BoardColumn[]>(() => {
    try {
      const stored = localStorage.getItem(COLUMNS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_COLUMNS;
    } catch (error) {
      console.error('Failed to load columns from localStorage:', error);
      return DEFAULT_COLUMNS;
    }
  });

  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(COLUMNS_STORAGE_KEY, JSON.stringify(columns));
    } catch (error) {
      console.error('Failed to save columns to localStorage:', error);
    }
  }, [columns]);

  const handleAddTask = (columnId: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: 'New task',
      description: '',
      columnId: columnId as ColumnId,
      createdAt: Date.now(),
      tags: [],
    };
    setTasks([...tasks, newTask]);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleEditTask = (id: string, title: string, description: string) => {
    const tags = extractTags(description);
    setTasks(tasks.map((task) => (task.id === id ? { ...task, title, description, tags } : task)));
  };

  const handleEditColumnTitle = (columnId: ColumnId, newTitle: string) => {
    setColumns(columns.map((col) => (col.id === columnId ? { ...col, title: newTitle } : col)));
  };

  const handleExportData = () => {
    const data = {
      tasks,
      columns,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `task-board-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        if (data.tasks && Array.isArray(data.tasks)) {
          const tasksWithTags = data.tasks.map((task: Task) => ({
            ...task,
            tags: task.tags || [],
          }));
          setTasks(tasksWithTags);
        }
        if (data.columns && Array.isArray(data.columns)) {
          setColumns(data.columns);
        }

        alert('データを正常にインポートしました！');
      } catch (error) {
        console.error('Failed to import data:', error);
        alert('データのインポートに失敗しました。正しいJSONファイルを選択してください。');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    const overColumnId = over.id as ColumnId;
    const isOverColumn = columns.some((col) => col.id === overColumnId);

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

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
  };

  const getAllTags = (): string[] => {
    const allTags = new Set<string>();
    tasks.forEach((task) => task.tags.forEach((tag) => allTags.add(tag)));
    return Array.from(allTags).sort();
  };

  const getFilteredTasks = (): Task[] => {
    if (selectedTags.length === 0) return tasks;
    return tasks.filter((task) =>
      selectedTags.every((tag) => task.tags.includes(tag))
    );
  };

  const getTasksByColumn = (columnId: ColumnId) => {
    const filteredTasks = getFilteredTasks();
    return filteredTasks.filter((task) => task.columnId === columnId);
  };

  const allTags = getAllTags();

  return (
    <>
      <div className="board-controls">
        <button onClick={handleExportData} className="control-btn" aria-label="Export data">
          📥 Export Data
        </button>
        <label className="control-btn" aria-label="Import data">
          📤 Import Data
          <input
            type="file"
            accept=".json"
            onChange={handleImportData}
            className="file-input"
          />
        </label>
      </div>
      {allTags.length > 0 && (
        <div className="tag-filter-bar">
          <div className="tag-filter-header">
            <span className="filter-label">Filter by tags:</span>
            {selectedTags.length > 0 && (
              <button onClick={handleClearFilters} className="clear-filters-btn">
                Clear filters
              </button>
            )}
          </div>
          <div className="tag-filter-list">
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`filter-tag ${selectedTags.includes(tag) ? 'active' : ''}`}
                style={{ backgroundColor: getTagColor(tag) }}
                onClick={() => handleToggleTag(tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}
      <DndContext
        sensors={sensors}
        onDragStart={({ active }) => setActiveId(active.id as string)}
        onDragEnd={handleDragEnd}
      >
        <main className="board" role="main" aria-label="Task board">
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            tasks={getTasksByColumn(column.id)}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
            onEditColumnTitle={handleEditColumnTitle}
          />
        ))}
      </main>
      <DragOverlay>
        {activeId ? (
          <div className="task-card drag-overlay" role="status" aria-live="polite">
            {tasks.find((t) => t.id === activeId)?.title}
          </div>
        ) : null}
      </DragOverlay>
      </DndContext>
    </>
  );
}
