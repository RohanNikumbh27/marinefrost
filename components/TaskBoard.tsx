"use client";

import { useDrop } from 'react-dnd';
import { Task } from '@/contexts/DataContext';
import TaskCard from './TaskCard';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TaskBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: Task['status']) => void;
  onTaskClick: (task: Task) => void;
}

const columns: { id: Task['status']; title: string; color: string }[] = [
  { id: 'todo', title: 'To Do', color: '#6B7280' },
  { id: 'in-progress', title: 'In Progress', color: '#3B82F6' },
  { id: 'review', title: 'In Review', color: '#F59E0B' },
  { id: 'done', title: 'Done', color: '#10B981' }
];

interface ColumnProps {
  status: Task['status'];
  title: string;
  color: string;
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: Task['status']) => void;
  onTaskClick: (task: Task) => void;
}

function Column({ status, title, color, tasks, onTaskMove, onTaskClick }: ColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item: { id: string }) => onTaskMove(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

  return (
    <div className="flex-1 min-w-[280px]">
      <div className="bg-muted/50 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <h3 className="font-semibold">{title}</h3>
            <span className="text-sm text-muted-foreground">
              {tasks.length}
            </span>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-400px)]">
          <div
            ref={drop}
            className={`space-y-3 min-h-[200px] p-2 rounded-xl transition-colors ${
              isOver ? 'bg-blue-50 dark:bg-blue-950/20' : ''
            }`}
          >
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => onTaskClick(task)}
              />
            ))}
            {tasks.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-8">
                No tasks
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export default function TaskBoard({ tasks, onTaskMove, onTaskClick }: TaskBoardProps) {
  return (
    <div className="flex space-x-4 overflow-x-auto pb-4">
      {columns.map((column) => (
        <Column
          key={column.id}
          status={column.id}
          title={column.title}
          color={column.color}
          tasks={tasks.filter((task) => task.status === column.id)}
          onTaskMove={onTaskMove}
          onTaskClick={onTaskClick}
        />
      ))}
    </div>
  );
}
