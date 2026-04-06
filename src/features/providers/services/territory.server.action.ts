'use server';

import { universitas } from '@/lib/universitas';

export async function getEstadosAction() {
  try {
    const response = await universitas.territorio.getEstados();
    return response.data || [];
  } catch (error) {
    console.error('Error fetching estados:', error);
    return [];
  }
}

export async function getMunicipiosAction(estadoId: string) {
  try {
    if (!estadoId) return [];
    const response = await universitas.territorio.getMunicipios(
      Number(estadoId)
    );
    return response.data || [];
  } catch (error) {
    console.error('Error fetching municipios:', error);
    return [];
  }
}

export async function getParroquiasAction(municipioId: string) {
  try {
    if (!municipioId) return [];
    const response = await universitas.territorio.getParroquias(
      Number(municipioId)
    );
    return response.data || [];
  } catch (error) {
    console.error('Error fetching parroquias:', error);
    return [];
  }
}
