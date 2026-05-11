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
          'font-["Inter"] font-bold text-[26px] leading-[1.2] text-[#005282]',
          titleClassName
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn('form-description mt-1', descriptionClassName)}>
          {description}
        </p>
      )}
    </div>
  );
}
