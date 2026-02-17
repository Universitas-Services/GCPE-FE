'use client';

import Image from 'next/image';
import { RegisterProvider, useRegister } from '../context/RegisterContext';
import { RegisterStepper } from './register/RegisterStepper';
import { CredentialsStep } from './register/CredentialsStep';
import { PersonalDataStep } from './register/PersonalDataStep';

function RegisterContent() {
  const { currentStep } = useRegister();

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* Left Side - Gray Background with Logo */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-[#A8ADB5] p-10 lg:w-1/2 lg:px-20 transition-all duration-500 ease-in-out">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="relative w-full max-w-lg animate-in fade-in zoom-in duration-700">
            <Image
              src="/logo-con-letra.png"
              alt="Sistema Integrado de Selección de Contratista"
              width={500}
              height={500}
              className="object-contain drop-shadow-xl"
              priority
            />
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-[#eaeef4] p-8 lg:p-20">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
          {/* Header */}
          <div className="flex flex-col items-center space-y-2 text-center">
            {/* Only show "Crea tu cuenta" on step 1, or both? 
                 Design for Step 1: "Crea tu cuenta"
                 Design for Step 2: "Completa tus datos" with back arrow
                 The headers are slightly different. I'll handle them conditionally or inside the steps?
                 The design shows the stepper is shared.
                 Let's make the header dynamic here.
             */}

            {currentStep === 1 ? (
              <>
                <h1 className="text-3xl font-bold tracking-tight text-[#005f7f]">
                  Crea tu cuenta
                </h1>
                <p className="text-sm text-gray-500">
                  Por favor introduce tus datos para continuar
                </p>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold tracking-tight text-[#005f7f]">
                  Completa tus datos
                </h1>
                <p className="text-sm text-gray-500">
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
