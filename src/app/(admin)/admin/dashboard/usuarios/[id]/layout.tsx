import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detalle De Usuario',
};

export default function UserDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
