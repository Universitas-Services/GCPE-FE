import * as React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Extendemos los props nativos para dar flexibilidad
interface SharedDatePickerProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value'
> {
  error?: boolean;
  value?: string | number | readonly string[];
}

export const SharedDatePicker = React.forwardRef<
  HTMLInputElement,
  SharedDatePickerProps
>(({ error, className = '', onChange, value, name, ...props }, ref) => {
  const [open, setOpen] = React.useState(false);

  const parsedDate = value ? new Date(value as string) : undefined;
  const date =
    parsedDate && !isNaN(parsedDate.getTime())
      ? new Date(parsedDate.getTime() + parsedDate.getTimezoneOffset() * 60000)
      : undefined;

  const handleSelect = (selectedDate: Date | undefined) => {
    if (onChange) {
      const event = {
        target: {
          name,
          value: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal bg-white h-10',
            !date && 'text-gray-500',
            error ? 'border-red-500 hover:bg-red-50' : 'border-gray-300',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, 'PPP', { locale: es })
          ) : (
            <span>Seleccione una fecha</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          // Hacemos que el calendario sea inteligente y respete el "max" si existe
          disabled={(calendarDate) => {
            const isBeforeMin = calendarDate < new Date('1900-01-01');

            // Verificamos si se envió un "max" desde el componente padre
            const isAfterMax = props.max
              ? calendarDate > new Date(`${props.max}T23:59:59`) // Agregamos la hora para evitar bugs de zona horaria
              : false;

            return isBeforeMin || isAfterMax;
          }}
          initialFocus
          locale={es}
          captionLayout="dropdown"
          fromYear={1900}
          toYear={new Date().getFullYear() + 100}
        />
      </PopoverContent>
      {/* Hidden input to keep ref compatibility if any parent form requires it */}
      <input
        type="hidden"
        ref={ref}
        name={name}
        value={value || ''}
        {...props}
      />
    </Popover>
  );
});

SharedDatePicker.displayName = 'SharedDatePicker';
