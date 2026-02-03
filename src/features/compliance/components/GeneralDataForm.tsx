import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function GeneralDataForm() {
  return (
    <Card className="w-full max-w-5xl mx-auto shadow-sm border-gray-100">
      <CardHeader className="pb-8">
        <CardTitle className="text-2xl font-bold text-[#0b1e4c]">
          Datos generales
        </CardTitle>
        <CardDescription className="text-gray-400 text-base italic">
          Ingresa tus datos para continuar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-[#0b1e4c] font-medium text-base">
            Dirección de correo electrónico
          </Label>
          <Input
            placeholder="Ejemplo: prueba@gmail.com"
            className="border-gray-200 bg-white h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[#0b1e4c] font-medium text-base">
            Nombre del órgano, entidad, oficina o dependencia de la
            Administración Pública
          </Label>
          <Input
            placeholder="Ejemplo: Instituto Nacional de Tránsito Terrestre (INTT)"
            className="border-gray-200 bg-white h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[#0b1e4c] font-medium text-base">
            Nombre de la unidad u oficina que revisa
          </Label>
          <Input
            placeholder="Ejemplo: Unidad Administradora"
            className="border-gray-200 bg-white h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[#0b1e4c] font-medium text-base">
            Nombre completo de la persona que revisa y/o evalúa.
          </Label>
          <Input
            placeholder="Ejemplo: Pedro José Hernández Pérez"
            className="border-gray-200 bg-white h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[#0b1e4c] font-medium text-base">
            Indique la nomenclatura o código asignado al documento revisado
          </Label>
          <Input
            placeholder="Ejemplo: U.L-001"
            className="border-gray-200 bg-white h-12"
          />
        </div>

        {/* Action Button - Placed inside flow but styled as requested */}
        <div className="flex justify-end pt-8">
          <Button className="bg-[#0097b2] hover:bg-[#008299] text-white px-8 py-6 text-lg rounded-xl">
            Siguiente
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
