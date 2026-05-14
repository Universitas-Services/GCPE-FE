import { LegalRepositoryView } from '@/features/legal-repository';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Repositorio legal',
  description: 'Repositorio documentario e informativo legal de Universitas.',
};

export default function LegalRepositoryPage() {
  return <LegalRepositoryView />;
}
