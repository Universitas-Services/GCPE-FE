import { format } from 'date-fns';
import { GeneralData, ComplianceAnswers } from '../context/ComplianceContext';
import { complianceFormSchema } from '../schemas/compliance.schema';
// ✅ CAMBIO: Importamos la libreta de almacenamiento
import { authStorage } from '@/features/auth/lib/auth-storage';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper to map allowed values
const mapAnswer = (answer: string | undefined): string => {
  if (!answer) return 'NA';
  if (answer === 'NO_APLICA') return 'NA';
  return answer;
};

export const complianceService = {
  async submitComplianceForm(
    generalData: GeneralData,
    answers: ComplianceAnswers
  ) {
    if (!API_URL) {
      throw new Error('API URL is not defined');
    }

    // Map context data to payload structure
    const payload = {
      // General Data
      correo_electronico: generalData.email || 'NA',
      nombre_organo_entidad: generalData.entityName || 'NA',
      nombre_unidad_revisora: generalData.unitName || 'NA',
      nomenclatura: generalData.documentCode || 'NA',
      fecha_revision: generalData.reviewDate
        ? format(new Date(generalData.reviewDate), 'yyyy-MM-dd')
        : format(new Date(), 'yyyy-MM-dd'),
      nombre_completo_revisor: generalData.reviewerName || 'NA',
      persona_contacto: generalData.email || 'NA',

      // Page 2
      caaue1_incluye_actividades_previas: mapAnswer(answers[1]),
      caaue2_incluye_acta_inicio: mapAnswer(answers[2]),
      caaue3_incluye_pliego_condiciones: mapAnswer(answers[3]),
      caaue4_publicacion_llamado_snc: mapAnswer(answers[4]),
      caaue5_publicacion_llamado_ente: mapAnswer(answers[5]),
      caaue6_incluye_registro_adquirientes: mapAnswer(answers[6]),
      caaue7_incluye_modificaciones: mapAnswer(answers[7]),

      // Page 3
      caaue8_incluye_acta_recepcion_sobres: mapAnswer(answers[8]),
      caaue9_incluye_acta_apertura_sobres: mapAnswer(answers[9]),

      // Page 4
      caaue10_incluye_ofertas: mapAnswer(answers[10]),
      caaue11_incluye_garantias_sostenimiento: mapAnswer(answers[11]),
      caaue12_incluye_certificado_rnc: mapAnswer(answers[12]),
      caaue13_incluye_certificado_snc: mapAnswer(answers[13]),
      caaue14_incluye_solvencias: mapAnswer(answers[14]),
      caaue15_incluye_informe_recomendacion: mapAnswer(answers[15]),

      // Page 5
      caaue16_incluye_adjudicacion: mapAnswer(answers[16]),
      caaue17_incluye_notificacion: mapAnswer(answers[17]),
      caaue18_incluye_garantias_contratacion: mapAnswer(answers[18]),
      caaue19_incluye_contrato_u_orden: mapAnswer(answers[19]),
      caaue20_incluye_resp_social: mapAnswer(answers[20]),

      // Page 6
      caaue21_identificacion_nomenclatura: mapAnswer(answers[21]),
      caaue22_expediente_foliado: mapAnswer(answers[22]),
      caaue23_identificacion_tomos: mapAnswer(answers[23]),
      caaue24_archivo_custodia: mapAnswer(answers[24]),
    };

    console.log('Parsing payload with schema...');
    complianceFormSchema.parse(payload);

    console.log('Sending payload:', JSON.stringify(payload, null, 2));

    // ✅ CAMBIO: Usamos getAccessToken()
    const token = authStorage.getAccessToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/api/compliance`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Submission failed:', errorData);
      throw new Error(errorData.detail || 'Error al enviar el formulario');
    }

    return response.json();
  },

  async downloadPdf(id: number) {
    if (!API_URL) {
      throw new Error('API URL is not defined');
    }

    // ✅ CAMBIO: Usamos getAccessToken()
    const token = authStorage.getAccessToken();

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/api/compliance/${id}/pdf`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Error al descargar el PDF');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance_report_${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};
