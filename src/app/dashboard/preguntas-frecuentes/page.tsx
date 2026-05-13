import type { Metadata } from 'next';
import { FAQView } from '@/features/faq';

export const metadata: Metadata = {
  title: 'Preguntas frecuentes',
};

export default function DashboardFAQPage() {
  return <FAQView />;
}
