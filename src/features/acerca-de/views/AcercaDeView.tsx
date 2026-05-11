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
              Sistema Integrado de Selección de Contratista
            </h1>
            <p className="font-['Inter'] italic text-gray-500 text-[16px] mt-1">
              Una solución innovadora de Universitas Services C.A.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="font-['Inter'] font-normal text-[15px] text-[#000000] leading-relaxed space-y-6">
          <p>
            El Sistema Integrado de Selección de Contratista es la primera
            plataforma digital en Venezuela diseñada específicamente para
            automatizar y simplificar la gestión de contrataciones públicas.
            Nuestra misión es transformar procesos administrativos densos en una
            experiencia guiada, eficiente y 100% apegada al marco legal vigente.
          </p>

          <p>
            Entendemos la complejidad de las modalidades de selección (Concurso
            Abierto, Concurso Cerrado, Consulta de Precios y Contratación
            Directa). Por ello, hemos creado esta versión gratuita para permitir
            a los usuarios experimentar el poder de la automatización en tareas
            críticas como la generación de manuales, el registro de proveedores
            y el cumplimiento (compliance) de expedientes.
          </p>

          <div className="mt-8">
            <h3 className="font-['Inter'] font-bold text-[18px] text-[#005282] mb-4">
              ¿Por qué utilizar nuestra plataforma?
            </h3>
            <ul className="space-y-3 list-disc pl-5">
              <li>
                <strong className="font-bold">Mitigación de riesgos:</strong>{' '}
                Reduzca errores humanos en la formación de expedientes.
              </li>
              <li>
                <strong className="font-bold">Agilidad:</strong> Genere
                documentos base para Concursos Abiertos en minutos, no en días.
              </li>
              <li>
                <strong className="font-bold">Transparencia:</strong>{' '}
                Estandarice sus procesos bajo los principios de economía,
                honestidad y eficiencia que exige la Ley.
              </li>
            </ul>
          </div>

          <div className="bg-[#f8fafc] border-l-4 border-[#009bda] p-6 rounded-r-lg my-8">
            <p className="m-0">
              <strong className="font-bold">
                Lleva tu gestión al siguiente nivel con la Versión PRO
              </strong>
              <br />
              <br />
              Mientras que esta versión gratuita te permite probar nuestras
              funciones básicas para la modalidad de bienes, la Versión PRO es
              un ecosistema completo diseñado para Entes y Órganos del Estado.
              Incluye todas las modalidades de contratación, almacenamiento
              seguro en la nube, gestión de obras y servicios, nuestro Consultor
              IA especializado para resolver dudas legales al instante.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
