import React, { InputHTMLAttributes, forwardRef } from 'react';

// Extendemos los props nativos para dar flexibilidad
interface SharedDatePickerProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const SharedDatePicker = forwardRef<
  HTMLInputElement,
  SharedDatePickerProps
>(({ error, className = '', onClick, ...props }, ref) => {
  return (
    <input
      type="date"
      ref={ref}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
        error ? 'border-red-500' : 'border-gray-300'
      } ${className}`}
      onClick={(e) => {
        try {
          if ('showPicker' in HTMLInputElement.prototype) {
            e.currentTarget.showPicker();
          }
        } catch (err) {
          console.debug('Failed to show native date picker:', err);
        }
        onClick?.(e);
      }}
      {...props}
    />
  );
});

SharedDatePicker.displayName = 'SharedDatePicker';
