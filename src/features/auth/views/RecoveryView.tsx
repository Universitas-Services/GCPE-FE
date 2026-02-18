'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
  RecoveryProvider,
  useRecovery,
} from '@/features/auth/context/RecoveryContext';
import { EmailStep } from './recovery/EmailStep';
import { CodeStep } from './recovery/CodeStep';
import { NewPasswordStep } from './recovery/NewPasswordStep';

function RecoveryContent() {
  const { currentStep, prevStep, formData } = useRecovery();

  const handleBack = () => {
    if (currentStep === 1) {
      // If step 1, link back to login is handled by the Link component,
      // but here we might want to go back to login programmatically if needed.
      // For now, the Arrow is a link or button?
      // Design shows an arrow. Usually goes back to previous step.
      // If step 1, maybe redirect to login?
      // But there is also a "Inicia sesión" link usually?
      // Let's make it go to login if step 1.
    } else {
      prevStep();
    }
  };

  const stepsInfo = [
    {
      title: 'Recupera tu contraseña',
      subtitle: 'Ingresa tu correo electrónico asociado a tu cuenta',
    },
    {
      title: 'Verificar código',
      subtitle: `Te hemos enviado un código a ${formData.email || 'tu correo'}`,
    },
    {
      title: 'Nueva contraseña',
      subtitle: 'Tu nueva contraseña debe ser segura',
    },
  ];

  const currentInfo = stepsInfo[currentStep - 1] || stepsInfo[0];

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* Left Side - Gray Background */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-[#A8ADB5] p-10 lg:w-1/2 lg:px-20">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="relative w-full max-w-lg animate-in fade-in zoom-in duration-700">
            <Image
              src="/logo-con-letra.png"
              alt="Logo Principal"
              width={500}
              height={500}
              className="object-contain drop-shadow-xl"
              priority
            />
          </div>
        </div>
      </div>

      {/* Right Side - Form Content */}
      <div className="flex flex-1 flex-col items-center justify-center bg-[#eaeef4] p-4 lg:p-20">
        <div className="w-full max-w-[500px] bg-white rounded-lg shadow-lg p-8 sm:p-12 relative">
          {/* Back Button */}
          <div className="absolute top-8 left-8">
            {currentStep === 1 ? (
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-6 w-6" />
              </Link>
            ) : (
              <button
                onClick={handleBack}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
            )}
          </div>

          <div className="mt-8 flex flex-col items-center space-y-2 text-center mb-8">
            <h1 className="text-2xl font-bold text-[#005a7a]">
              {currentInfo.title}
            </h1>
            <p className="text-sm text-gray-500">{currentInfo.subtitle}</p>
          </div>

          {/* Steps Indicator */}
          <div className="flex justify-center items-center space-x-8 mb-10">
            {[1, 2, 3].map((step) => {
              const isActiveOrCompleted = currentStep >= step;
              const labels = ['Correo', 'Código', 'Nueva contraseña']; // Short labels

              return (
                <div
                  key={step}
                  className="flex flex-col items-center space-y-2"
                >
                  <div
                    className={`
                      flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm
                      ${isActiveOrCompleted ? 'bg-[#008CBA] text-white' : 'bg-gray-200 text-gray-500'}
                    `}
                  >
                    {step}
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-gray-600">
                    {labels[step - 1]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Step Content */}
          <div className="w-full">
            {currentStep === 1 && <EmailStep />}
            {currentStep === 2 && <CodeStep />}
            {currentStep === 3 && <NewPasswordStep />}
          </div>
        </div>
      </div>
    </div>
  );
}

export function RecoveryView() {
  return (
    <RecoveryProvider>
      <RecoveryContent />
    </RecoveryProvider>
  );
}
