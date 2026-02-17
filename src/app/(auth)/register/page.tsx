import { RegisterView } from '@/features/auth/views/RegisterView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Registro - Sistema Integrado de Selección de Contratista',
  description:
    'Crea tu cuenta en el Sistema Integrado de Selección de Contratista',
};

export default function RegisterPage() {
  return <RegisterView />;
}
