'use client';

import React from 'react';
import {
  ProviderRegistrationWizard,
  ProviderFormProvider,
} from '@/features/providers';

export default function RegisterProviderPage() {
  return (
    <ProviderFormProvider>
      <ProviderRegistrationWizard />
    </ProviderFormProvider>
  );
}
