export interface ProviderData {
  id?: number;
  correo_proveedor: string;
  nombre_proveedor: string;
  rif_proveedor: string;
  tipo_persona: 'Natural' | 'Juridica';
  tipo_entidad_juridica?: string;
  estado: string;
  estadoId?: string;
  municipio: string;
  municipioId?: string;
  parroquia: string;
  parroquiaId?: string;
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
  desea_version_pro_proveedores?: boolean;
}

export type ProviderFormData = Omit<ProviderData, 'id'>;

export interface ProviderListResponse {
  id: number;
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
}
