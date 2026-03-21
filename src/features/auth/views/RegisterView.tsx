'use client';

import Image from 'next/image';
import { RegisterProvider, useRegister } from '../context/RegisterContext';
import { RegisterStepper } from './register/RegisterStepper';
import { CredentialsStep } from './register/CredentialsStep';
import { PersonalDataStep } from './register/PersonalDataStep';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

function RegisterContent() {
  const { currentStep, prevStep } = useRegister();

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* Left Side - Gray Background with Logo */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-[#A6A9B0] p-6 lg:w-1/2 transition-all duration-500 ease-in-out">
        <div className="flex flex-col items-center text-center">
          <div className="relative w-full max-w-md animate-in fade-in zoom-in duration-700">
            <Image
              src="/logo-con-letra-blanco.png"
              alt="Sistema Integrado de Selección de Contratista"
              width={350}
              height={350}
              className="object-contain drop-shadow-xl"
              priority
            />
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-[#E8EDF2] p-4 lg:p-6 overflow-auto">
        <div className="relative w-full max-w-md space-y-5 bg-white p-6 rounded-xl shadow-lg">
          {currentStep === 2 && (
            <Button
              type="button"
              variant="ghost"
              onClick={prevStep}
              className="absolute top-6 left-6 p-0 hover:bg-transparent text-black hover:text-gray-700 cursor-pointer h-auto w-auto z-10 animate-in fade-in duration-300"
            >
              <ArrowLeft className="h-6 w-6" strokeWidth={2.5} />
            </Button>
          )}
          {/* Header */}
          <div className="flex flex-col items-center space-y-1 text-center">
            {currentStep === 1 ? (
              <>
                <h1 className="app-title">Crea tu cuenta</h1>
                <p className="text-[14.81px] font-medium text-gray-500 mt-[22.5px]">
                  Por favor introduce tus datos para continuar
                </p>
              </>
            ) : (
              <>
                <h1 className="app-title">Completa tus datos</h1>
                <p className="text-[14.81px] font-medium text-gray-500 mt-[22.5px]">
                  Por favor introduce tus datos para continuar
                </p>
              </>
            )}
          </div>

          <RegisterStepper />

          {currentStep === 1 && <CredentialsStep />}
          {currentStep === 2 && <PersonalDataStep />}
        </div>
      </div>
    </div>
  );
}

export function RegisterView() {
  return (
    <RegisterProvider>
      <RegisterContent />
    </RegisterProvider>
  );
}
