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
- Vite
- @dnd-kit for drag and drop functionality

## Usage

1. Click "+ Add Task" to create a new task in any column
2. Click on a task's text to edit it
3. Drag and drop tasks to move them between columns or reorder within a column
4. Hover over a task and click the × button to delete it

All tasks are automatically saved to your browser's local storage.
