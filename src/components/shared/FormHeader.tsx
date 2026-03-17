import React from 'react';
import { cn } from '@/lib/utils';

interface FormHeaderProps {
  title: string;
  description?: string | React.ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function FormHeader({
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
}: FormHeaderProps) {
  return (
    <div className={cn('mb-6', className)}>
      <h2
        className={cn(
          'text-2xl md:text-3xl font-bold tracking-tight text-[#005282]',
          titleClassName
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'text-sm text-muted-foreground mt-2 italic',
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
