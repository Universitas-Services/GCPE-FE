// ── Interfaces de respuesta de API para el módulo Admin → Usuarios ──

/** GET /api/usuarios — Parámetros de búsqueda / filtrado */
export interface GetUsersParams {
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

/** Representación de un usuario en la tabla principal */
export interface AdminUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  telefono: string;
  nombre_institucion_ente: string;
  cargo: string;
  is_active: boolean;
  date_joined: string;
}

/** Respuesta paginada del endpoint /api/usuarios */
export interface PaginatedUsersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminUser[];
}

/** Proveedor asociado a un usuario — GET /api/usuarios/{user_id}/proveedores */
export interface UserProvider {
  id: number;
  nombre_proveedor: string;
  rif_proveedor: string;
  tipo_persona: string;
  estado: string;
  municipio: string;
  telefono_proveedor: string;
  correo_proveedor: string;
  created_at?: string;
}

/** Compliance asociado a un usuario — GET /api/usuarios/{user_id}/compliance */
export interface UserCompliance {
  id: number;
  usuario_revisor: number;
  fecha_creacion: string;
  nombre_organo_entidad: string;
  nombre_unidad_revisora: string;
  nomenclatura: string;
  fecha_revision: string;
}

/** Manual asociado a un usuario — GET /api/usuarios/{user_id}/manuales */
export interface UserManual {
  id: number;
  titulo: string;
  tipo_concurso: string;
  fecha_generacion: string;
  estado_envio: string;
  correo_destino: string;
}

/** Respuesta genérica para acciones POST de reenvío */
export interface ResendResponse {
  message: string;
}

/** KPIs del panel (derivados de la tabla de usuarios o de /api/dashboard) */
export interface AdminPanelKpis {
  total_usuarios: number;
  gestion_proveedores: number;
  informes_compliance: number;
  manuales_generados: number;
}
