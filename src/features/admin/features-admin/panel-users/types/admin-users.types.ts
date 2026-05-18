// ── Interfaces de respuesta de API para el módulo Admin → Usuarios ──

/** GET /api/usuarios — Parámetros de búsqueda / filtrado */
export interface GetUsersParams {
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
  is_active?: string;
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
  id: string;
  creado_por: number;
  fecha_registro: string;
  correo_proveedor: string;
  nombre_proveedor: string;
  rif_proveedor: string;
  tipo_persona: string;
  tipo_entidad_juridica: string;
  estado: string;
  municipio: string;
  parroquia: string;
  direccion_fiscal: string;
  telefono_proveedor: string;
  nombre_rep_legal: string;
  cedula_rep_legal: string;
  tiene_rnc: boolean;
  tiene_solvencia_laboral: boolean;
  tiene_licencia_municipal: boolean;
  actividad_comercial_principal: string;
  area_especialidad: string;
  anos_experiencia: number;
  fecha_estado_financiero: string;
  patrimonio_reportado: string;
  nivel_contratacion: string;
  activo: boolean;
}

/** Compliance asociado a un usuario — GET /api/usuarios/{user_id}/compliance */
export interface UserCompliance {
  id: string;
  usuario_revisor: number;
  fecha_creacion: string;
  nombre_organo_entidad: string;
  nombre_unidad_revisora: string;
  nomenclatura: string;
  fecha_revision: string;
  persona_contacto: string;
}

/** Manual asociado a un usuario — GET /api/usuarios/{user_id}/manuales */
export interface UserManual {
  id: string;
  usuario: number;
  nombre_institucion_ente: string;
  siglas_institucion_ente: string;
  nombre_unidad_admin_financiera: string;
  nombre_unidad_sistemas_tecnologia: string;
  correo_electronico_manual: string;
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

/** Nota interna (CRM) asociada a un usuario — GET /api/usuarios/{user_id}/notas */
export interface UserNote {
  id: string;
  usuario_objetivo: number;
  autor: number;
  autor_nombre: string;
  contenido: string;
  etiqueta: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

/** Payload para crear o actualizar una nota */
export interface NotePayload {
  contenido: string;
  etiqueta: string;
}

/** Respuesta paginada genérica del backend */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}
