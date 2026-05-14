import type { Metadata } from 'next';
import { ProfileView } from '@/features/profile/views/ProfileView';

export const metadata: Metadata = {
  title: 'Perfil',
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <ProfileView />
    </div>
  );
}
