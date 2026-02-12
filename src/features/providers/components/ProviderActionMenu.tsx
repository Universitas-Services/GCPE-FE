import { MoreHorizontal, FileText, Mail, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useState } from 'react';

interface ProviderActionMenuProps {
  providerId: number;
}

export function ProviderActionMenu({ providerId }: ProviderActionMenuProps) {
  const [showProPopup, setShowProPopup] = useState(false);

  const handleProAction = () => {
    console.log('Action for provider:', providerId);
    setShowProPopup(true);
    // Auto hide after 3 seconds
    setTimeout(() => setShowProPopup(false), 3000);
  };

  return (
    <div className="relative">
      <Popover open={showProPopup} onOpenChange={setShowProPopup}>
        <PopoverTrigger asChild>
          <div className="hidden"></div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2 bg-black text-white text-xs rounded shadow-lg border-none animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95">
          Solo disponible en version Pro
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[200px] p-0">
          <div className="flex flex-col">
            <Button
              variant="ghost"
              className="justify-start rounded-none h-10 px-4 font-normal"
              onClick={handleProAction}
            >
              <FileText className="mr-2 h-4 w-4" />
              Ver detalles
            </Button>
            <Button
              variant="ghost"
              className="justify-start rounded-none h-10 px-4 font-normal"
              onClick={handleProAction}
            >
              <Mail className="mr-2 h-4 w-4" />
              Enviar certificado
            </Button>
            <Button
              variant="ghost"
              className="justify-start rounded-none h-10 px-4 font-normal"
              onClick={handleProAction}
            >
              <Upload className="mr-2 h-4 w-4" />
              Cargar documento
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
