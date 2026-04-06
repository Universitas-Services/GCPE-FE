import 'server-only'; // Garantiza que este archivo jamás llegue al navegador
import { UniversitasAPI } from 'sdk-global-universitas';

// Extendemos el objeto global de TypeScript para evitar errores de tipado
declare global {
  // eslint-disable-next-line no-var
  var universitasGlobal: UniversitasAPI | undefined;
}

// Instanciamos el SDK apuntando a tu backend en Render
export const universitas =
  globalThis.universitasGlobal ||
  new UniversitasAPI(process.env.NEXT_PUBLIC_API_URL);

// En desarrollo, guardamos la instancia en globalThis para que sobreviva a las recargas del HMR
if (process.env.NODE_ENV !== 'production') {
  globalThis.universitasGlobal = universitas;
}
