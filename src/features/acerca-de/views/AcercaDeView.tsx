import React from 'react';
import Image from 'next/image';

export function AcercaDeView() {
  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <div className="bg-white rounded-[20px] shadow-sm p-8 md:p-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10">
          <div className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Universitas Legal Logo"
              width={100}
              height={100}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col justify-center mt-2 md:mt-0">
            <h1 className="font-['Inter'] font-bold text-[26px] leading-[1.2] text-[#005282]">
              Acerca de Gestor de Contrataciones
            </h1>
            <p className="font-['Inter'] italic text-gray-500 text-[16px] mt-1">
              Una solución innovadora de Universitas Services C.A.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="font-['Inter'] font-normal text-[15px] text-[#000000] leading-relaxed space-y-6">
          <p>
            Actas de entrega es una innovadora plataforma digital diseñada para
            ser el principal asistente tecnológico de los servidores públicos en
            Venezuela. Nuestra aplicación transforma un proceso tradicionalmente
            complejo en una experiencia de usuario simple, estructurada y
            segura.
          </p>

          <p>
            El núcleo de nuestra plataforma es una interfaz intuitiva que guía
            al usuario a través de formularios inteligentes, facilitando la
            recopilación de toda la información necesaria de manera ordenada.
            Hemos creado un ecosistema que se adapta a las distintas necesidades
            de nuestros usuarios a través de dos versiones: una versión express,
            ideal para generar un documento de forma rápida y directa, y una
            versión pro, pensada para una gestión integral y a largo plazo.
          </p>

          <div className="bg-[#f8fafc] border-l-4 border-[#009bda] p-6 rounded-r-lg my-8">
            <p className="m-0">
              <strong className="font-bold">
                La versión pro es el corazón de nuestra innovación.
              </strong>{' '}
              Ofrece un entorno robusto con almacenamiento seguro en la nube,
              permitiendo al usuario guardar, gestionar y editar sus documentos
              en cualquier momento y desde cualquier lugar. Además, integramos
              herramientas de inteligencia artificial que actúan como un asesor
              proactivo, generando alertas y sugerencias para asegurar la debida
              diligencia en cada paso.
            </p>
          </div>

          <p>
            En Universitas Services C.A. estamos comprometidos con el desarrollo
            de soluciones digitales profesionales. Actas de entrega es un
            reflejo de esa visión: una aplicación potente, confiable y segura,
            diseñada no solo para generar un documento, sino para aportar
            tranquilidad, control y eficiencia a la importante labor de los
            servidores públicos de nuestro país.
          </p>
        </div>
      </div>
    </div>
  );
}
