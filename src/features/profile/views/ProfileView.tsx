'use client';

import { useState } from 'react';
import { EditProfileForm } from './EditProfileForm';
import { ChangePasswordForm } from './ChangePasswordForm';
import { DeleteAccountView } from './DeleteAccountView';
import { Button } from '@/components/ui/button';
import { Settings, KeyRound, Trash2, List } from 'lucide-react';
import { Card } from '@/components/ui/card';

type TabType = 'edit_profile' | 'change_password' | 'delete_account';

export const ProfileView = () => {
  const [activeTab, setActiveTab] = useState<TabType>('edit_profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'edit_profile':
        return <EditProfileForm />;
      case 'change_password':
        return <ChangePasswordForm />;
      case 'delete_account':
        return <DeleteAccountView />;
      default:
        return <EditProfileForm />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-center text-[#003366] mb-8">
        Gestión de perfil
      </h1>

      <Card className="bg-white rounded-xl shadow-md overflow-hidden min-h-[600px]">
        {/* Header Section */}
        <div className="p-6 md:p-8 border-b border-gray-100 flex items-center gap-4">
          <List className="w-8 h-8 text-[#003366]" />
          <div>
            <h2 className="text-2xl font-semibold text-[#003366]">
              Configuración de tu perfil
            </h2>
            <p className="text-gray-500 text-sm italic">
              Gestiona la información de tu cuenta y tu configuración de
              seguridad.
            </p>
          </div>
        </div>

        {/* Layout Section */}
        <div className="flex flex-col md:flex-row h-full">
          {/* Sidebar Menu */}
          <div className="w-full md:w-64 p-6 border-r border-gray-100 flex flex-col gap-2">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 h-12 text-sm font-medium ${
                activeTab === 'edit_profile'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
              onClick={() => setActiveTab('edit_profile')}
            >
              <Settings className="w-4 h-4 text-[#0080B0]" />
              Editar perfil
            </Button>

            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 h-12 text-sm font-medium ${
                activeTab === 'change_password'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
              onClick={() => setActiveTab('change_password')}
            >
              <KeyRound className="w-4 h-4 text-[#0080B0]" />
              Cambiar contraseña
            </Button>

            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 h-12 text-sm font-medium ${
                activeTab === 'delete_account'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
              onClick={() => setActiveTab('delete_account')}
            >
              <Trash2 className="w-4 h-4 text-red-500/70" />
              Eliminar cuenta
            </Button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6">
            <div className="max-w-3xl border border-gray-200 rounded-xl overflow-hidden">
              {renderContent()}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
