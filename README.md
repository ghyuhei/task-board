# Task Board

A modern, Trello-style task management application with sticky note aesthetics.

## Features

- **Four column layout**: To Do, In Progress, Backlog, and Completed
- **Task titles and descriptions**: Separate fields for better organization
- **Tag system**: Add tags with `#tagname` (supports hyphens: `#urgent-bug`)
- **Tag filtering**: Click on tags to filter tasks, select multiple for AND filtering
- **Drag and drop**: Easily move tasks between columns and reorder within columns
- **Sticky note styling**: Colorful, slightly rotated cards for a fun, tactile feel
- **Inline editing**: Click on any task to edit it directly
- **Collapsible descriptions**: Expand/collapse task descriptions as needed
- **Local storage**: Tasks persist between sessions
- **Data export/import**: Backup and restore your tasks as JSON files
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

### Basic Operations

1. **Create a task**: Click "+ Add Task" in any column
2. **Edit task title**: Click on the bold task title to edit it
3. **Add description**: Click on "Click to add description..." to add details
4. **Add tags**: Type `#tagname` in the description (e.g., "Fix login #urgent #backend")
   - Tags support hyphens: `#urgent-task`, `#back-end`
   - Tags are automatically extracted and displayed as colored badges
5. **Expand/collapse**: Click "▶ Description" to show/hide task details
6. **Move tasks**: Drag and drop tasks between columns or reorder within a column
7. **Delete tasks**: Hover over a task and click the × button

### Tag Filtering

1. **View all tags**: Active tags appear in the filter bar at the top
2. **Filter by tag**: Click on any tag to show only tasks with that tag
3. **Multiple filters**: Click multiple tags for AND filtering (shows tasks with ALL selected tags)
4. **Clear filters**: Click "Clear filters" to show all tasks again

### Data Management

1. **Auto-save**: All changes are automatically saved to browser localStorage
2. **Export**: Click "📥 Export Data" to download a JSON backup file
3. **Import**: Click "📤 Import Data" to restore from a backup file
4. **Column names**: Click on column titles to rename them

All tasks, tags, and column settings persist between sessions.
