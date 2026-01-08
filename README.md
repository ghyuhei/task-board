# Task Board

A modern, Trello-style task management application with sticky note aesthetics.

## Features

- **Four column layout**: To Do, In Progress, Backlog, and Completed
- **Drag and drop**: Easily move tasks between columns and reorder within columns
- **Sticky note styling**: Colorful, slightly rotated cards for a fun, tactile feel
- **Inline editing**: Click on any task to edit it directly
- **Local storage**: Tasks persist between sessions
- **Responsive design**: Works on desktop and mobile

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- React 19
- TypeScript
- Vite 7
- @dnd-kit for drag and drop functionality

## Usage

1. Click "+ Add Task" to create a new task in any column
2. Click on a task's text to edit it
3. Drag and drop tasks to move them between columns or reorder within a column
4. Hover over a task and click the × button to delete it

All tasks are automatically saved to your browser's local storage.

## Development Guide

### Project Structure

```
src/
├── types.ts         # Type definitions for Task and Column
├── TaskCard.tsx     # Individual task card component
├── Column.tsx       # Column component containing tasks
├── Board.tsx        # Main board component with drag-drop logic
├── App.tsx          # Root application component
├── App.css          # All application styles
├── index.css        # Global styles and resets
└── main.tsx         # Application entry point
```

### Adding/Modifying Columns

**File**: `src/Board.tsx`

To add, remove, or modify columns, update the `COLUMNS` array:

```typescript
const COLUMNS: ColumnType[] = [
  { id: 'todo', title: 'To Do', color: '#FFE5B4' },
  { id: 'inProgress', title: 'In Progress', color: '#B4D7FF' },
  { id: 'backlog', title: 'Backlog', color: '#E5D4FF' },
  { id: 'completed', title: 'Completed', color: '#C8F7C8' },
];
```

When adding a new column:
1. Add a new entry to the `COLUMNS` array
2. Update the `ColumnId` type in `src/types.ts` to include the new column ID

### Customizing Task Card Styles

**File**: `src/App.css`

Task card colors are defined using nth-child selectors:

```css
.task-card {
  background: linear-gradient(135deg, #fff9c4 0%, #fff59d 100%);
}

.task-card:nth-child(2n) {
  background: linear-gradient(135deg, #e1f5ff 0%, #b3e5fc 100%);
}
```

Modify these gradients to change task card colors.

### Changing Storage Mechanism

**File**: `src/Board.tsx`

The app uses localStorage by default. To change storage:

1. Modify `STORAGE_KEY` constant
2. Update `useState` initialization (line 24-27)
3. Update `useEffect` save logic (line 39-41)

### Modifying Drag Sensitivity

**File**: `src/Board.tsx`

Adjust drag activation threshold:

```typescript
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,  // Change this value (pixels)
    },
  })
);
```

Lower values = more sensitive, higher values = less accidental drags

### Column Layout Customization

**File**: `src/App.css`

Modify grid layout:

```css
.board {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}
```

- Change `minmax(280px, 1fr)` to adjust minimum column width
- Change `gap` to adjust spacing between columns
