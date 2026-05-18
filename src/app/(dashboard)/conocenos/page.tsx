import { AboutUsView } from '@/features/about-us';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conócenos',
  description: 'Conoce todos los servicios y cursos ofrecidos por Universitas.',
};

export default function ConocenosPage() {
  return <AboutUsView />;
}
