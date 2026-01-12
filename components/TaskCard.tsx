"use client";

import { useDrag } from 'react-dnd';
import { Task } from '@/contexts/DataContext';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertCircle, Bug, BookOpen, Layers, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const typeIcons = {
  task: Clock,
  bug: Bug,
  story: BookOpen,
  epic: Layers
};

const priorityColors = {
  low: 'bg-gray-500',
  medium: 'bg-blue-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500'
};

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  const TypeIcon = typeIcons[task.type];

  return (
    <motion.div
      ref={drag}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`bg-card border rounded-xl p-3 cursor-pointer hover:shadow-md transition-all ${
        isDragging ? 'rotate-2 scale-105' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <TypeIcon className="h-4 w-4 text-muted-foreground" />
          <Badge
            variant={task.priority === 'urgent' || task.priority === 'high' ? 'destructive' : 'secondary'}
            className="text-xs rounded-full"
          >
            {task.priority}
          </Badge>
        </div>
        {task.storyPoints > 0 && (
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {task.storyPoints}
          </span>
        )}
      </div>

      <h4 className="font-medium mb-2 line-clamp-2">{task.title}</h4>

      {task.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs rounded-full">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t">
        {task.assignee ? (
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
              <AvatarFallback className="text-xs">
                {task.assignee.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate max-w-[100px]">
              {task.assignee.name.split(' ')[0]}
            </span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Unassigned</span>
        )}

        {task.dueDate && (
          <span className="text-xs text-muted-foreground">
            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
    </motion.div>
  );
}
