import React from 'react';
import { cn } from '@/lib/utils';

interface FormHeaderProps {
  title: string;
  description?: string | React.ReactNode;
  className?: string;
}

export function FormHeader({ title, description, className }: FormHeaderProps) {
  return (
    <div className={cn('mb-6', className)}>
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#005282]">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-muted-foreground mt-2 font-italy">
          {description}
        </p>
      )}
    </div>
  );
}
