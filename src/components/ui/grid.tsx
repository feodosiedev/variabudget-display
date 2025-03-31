import React from 'react';
import { cn } from '@/lib/utils';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Grid: React.FC<GridProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-3', className)}
      {...props}
    >
      {children}
    </div>
  );
};