import { MoreHorizontal, FileText, Mail, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useState } from 'react';
import { ProUpgradeModal } from '@/components/advertisements/ProUpgradeModal';

interface ProviderActionMenuProps {
  providerId: number;
}

export function ProviderActionMenu({ providerId }: ProviderActionMenuProps) {
  const [showProPopup, setShowProPopup] = useState(false);

  const handleProAction = () => {
    console.log('Action for provider:', providerId);
    setShowProPopup(true);
  };

  return (
    <div className="relative">
      <ProUpgradeModal
        isOpen={showProPopup}
        onClose={() => setShowProPopup(false)}
      />

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
            <Button
              variant="ghost"
              className="justify-start rounded-none h-10 px-4 font-normal text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleProAction}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar proveedor
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
