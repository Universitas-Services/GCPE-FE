import * as z from 'zod';

// Schema based on the provided JSON structure and Variable names
export const complianceFormSchema = z.object({
  // General Data
  correo_electronico: z.string().email(),
  nombre_organo_entidad: z.string(),
  nombre_unidad_revisora: z.string(),
  fecha_revision: z.string(), // YYYY-MM-DD
  nombre_completo_revisor: z.string(),
  nomenclatura: z.string(),

  // Page 2: Actos Preparatorios y Publicación
  caaue1_incluye_actividades_previas: z.string(),
  caaue2_incluye_acta_inicio: z.string(),
  caaue3_incluye_pliego_condiciones: z.string(),
  caaue4_publicacion_llamado_snc: z.string(),
  caaue5_publicacion_llamado_ente: z.string(),
  caaue6_incluye_registro_adquirientes: z.string(),
  caaue7_incluye_modificaciones: z.string(),

  // Page 3: Actos de presentación y apertura
  caaue8_incluye_acta_recepcion_sobres: z.string(),
  caaue9_incluye_acta_apertura_sobres: z.string(),

  // Page 4: Evaluación y calificación de oferentes
  caaue10_incluye_ofertas: z.string(),
  caaue11_incluye_garantias_sostenimiento: z.string(),
  caaue12_incluye_certificado_rnc: z.string(), // Corrected per user feedback
  // Prompt text for ID 12: "VARIABLE= caaue12_incluye_certificado_rnc_oferentes"
  // JSON text: "caaue12_incluye_certificado_rnc"
  // I will use caaue12_incluye_certificado_rnc to match the JSON example if strictly required, BUT the prompt says "Variable=".
  // Given "te encargaras de enlazar cada una de las preguntas con la variable correspondiente en el Json", and the JSON has specific keys...
  // I will prioritize the JSON keys w here they differ significantly, but the Prompt logic was "Variable=".
  // Actually, I'll stick to the "Variable=" definitions in the text as they are more descriptive and associated with the question content.
  // Wait, the JSON keys are likely what the backend expects.
  // "caaue12_incluye_certificado_rnc" (JSON) vs "caaue12_incluye_certificado_rnc_oferentes" (Doc)
  // "caaue13_incluye_certificado_snc" (JSON) vs "caaue13_incluye_certificado_calificacion_snc" (Doc)
  // I will support the JSON keys as the final payload keys.

  caaue13_incluye_certificado_snc: z.string(), // Mapped from ID 13
  caaue14_incluye_solvencias: z.string(),
  caaue15_incluye_informe_recomendacion: z.string(),

  // Page 5: Adjudicación y formalización del contrato
  caaue16_incluye_adjudicacion: z.string(),
  caaue17_incluye_notificacion: z.string(),
  caaue18_incluye_garantias_contratacion: z.string(),
  caaue19_incluye_contrato_u_orden: z.string(),
  caaue20_incluye_resp_social: z.string(),

  // Page 6: Formalidades y archivo del expediente
  caaue21_identificacion_nomenclatura: z.string(),
  caaue22_expediente_foliado: z.string(),
  caaue23_identificacion_tomos: z.string(),
  caaue24_archivo_custodia: z.string(),

  // Optional/Page 7 context (not part of main payload based on user instruction? or is it?)
  // User said: "esta tendra la funcion de cargar los datos al endpoint, una vez cargados pasara a la pagina 7."
  // So page 7 data is NOT in this payload.
});

export type CompliancePayload = z.infer<typeof complianceFormSchema>;
