import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Login Admin',
};

export default function LoginPage() {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-[#005282]">
          Iniciar Sesión
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Panel Administrativo - Universitas
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">
          Formulario de login — Próximamente
        </p>
      </CardContent>
    </Card>
  );
}
