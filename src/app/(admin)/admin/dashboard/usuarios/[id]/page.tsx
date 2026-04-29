'use client';

import { use } from 'react';
import { UserDetailView } from '@/features/admin/features-admin/panel-users/views/UserDetailView';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function UserDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const userId = Number(id);

  if (isNaN(userId)) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        ID de usuario inválido.
      </div>
    );
  }

  return <UserDetailView userId={userId} />;
}
