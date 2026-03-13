import { ProviderListResponse } from '../types/provider.types';
import { ProviderActionMenu } from './ProviderActionMenu';

// Since we don't have the Table component in ui folder based on previous list_dir,
// I will implement a standard HTML table with Tailwind classes if the import fails.
// BUT, often these projects have it. Let me try to assume it exists or I'll write standard HTML.
// actually, looking at step 52, table.tsx was NOT in the list.
// So I will use standard HTML/Tailwind implementation to be safe and avoid errors.

interface ProviderTableProps {
  providers: ProviderListResponse[];
  isLoading: boolean;
}

export function ProviderTable({ providers, isLoading }: ProviderTableProps) {
  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center text-gray-500">
        Cargando proveedores...
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center text-gray-500 border rounded-md bg-white">
        No se encontraron proveedores registrados.
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-medium">Empresa / Razón Social</th>
              <th className="px-6 py-3 font-medium">RIF</th>
              <th className="px-6 py-3 font-medium">Correo Electrónico</th>
              <th className="px-6 py-3 font-medium">Tipo</th>
              <th className="px-12 py-3 font-medium">Estado</th>
              <th className="px-6 py-3 font-medium">Representante Legal</th>
              <th className="px-6 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {providers.map((provider) => (
              <tr
                key={provider.id}
                className="bg-white hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {provider.nombre_proveedor}
                  <div
                    className="text-xs text-gray-500 font-normal mt-0.5 truncate max-w-[200px]"
                    title={String(provider.actividad_comercial_principal || '')}
                  >
                    {provider.actividad_comercial_principal}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {provider.rif_proveedor}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {provider.correo_proveedor}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {provider.area_especialidad}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Disponible pro
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {provider.nombre_rep_legal}
                </td>
                <td className="px-6 py-4 text-right">
                  <ProviderActionMenu providerId={provider.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        Mostrando {providers.length} resultados
      </div>
    </div>
  );
}
