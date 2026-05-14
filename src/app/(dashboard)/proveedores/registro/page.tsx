import type { Metadata } from 'next';
import React from 'react';
import {
  ProviderRegistrationWizard,
  ProviderFormProvider,
} from '@/features/providers';

export const metadata: Metadata = {
  title: 'Registro de proveedores',
};

export default function RegisterProviderPage() {
  return (
    <ProviderFormProvider>
      <ProviderRegistrationWizard />
    </ProviderFormProvider>
  );
}
