import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQQuestion {
  question: string;
  answer: React.ReactNode;
}

interface FAQCategory {
  id: string;
  title: string;
  questions: FAQQuestion[];
}

const faqItems: FAQCategory[] = [
  {
    id: 'item-1',
    title: 'Preguntas Generales',
    questions: [
      {
        question: '¿Qué es el Sistema Integrado de Selección de Contratista?',
        answer:
          'Es una herramienta tecnológica diseñada para asistir a los servidores públicos en la elaboración, control y auditoría de expedientes de contratación pública en Venezuela, asegurando el cumplimiento de la Ley de Contrataciones Públicas.',
      },
      {
        question: '¿Esta aplicación sustituye el criterio legal del ente?',
        answer:
          'No. La aplicación es un asistente de automatización que facilita el trabajo, pero la responsabilidad final y la validación de los actos motivados corresponden a las unidades usuarias y contratantes según la ley.',
      },
    ],
  },
  {
    id: 'item-2',
    title: 'Cuentas y Versiones',
    questions: [
      {
        question: '¿Qué incluye la versión gratuita?',
        answer:
          'Permite generar demostraciones de manuales para Concursos Abiertos (Bienes - Acto único, Apertura Único), realizar un registro básico de proveedores y probar el módulo de compliance para expedientes de bienes.',
      },
      {
        question: '¿Cómo adquirir la Versión PRO para mi institución?',
        answer:
          'La Versión PRO está diseñada para una implementación integral en Entes u Órganos. Puedes solicitar una demostración personalizada y un presupuesto formal a través del botón "Actualizar a Pro" o contactando a nuestro equipo de ventas.',
      },
    ],
  },
  {
    id: 'item-3',
    title: 'Funcionalidades y Uso',
    questions: [
      {
        question:
          '¿Puedo gestionar Contrataciones Directas o Consultas de Precios aquí?',
        answer:
          'En esta versión gratuita solo está habilitada la modalidad de Concurso Abierto (Bienes). Las modalidades de Consulta de Precios, Concurso Cerrado y Contratación Directa (incluyendo sus actos motivados) están disponibles exclusivamente en la versión PRO.',
      },
      {
        question: '¿Cómo recibo el Manual Express que generé?',
        answer:
          'Una vez completados los datos, el sistema procesa la información y enviará un documento de demostración al correo electrónico que registraste en el formulario.',
      },
    ],
  },
  {
    id: 'item-4',
    title: 'Datos y Seguridad',
    questions: [
      {
        question: '¿Están seguros mis datos de proveedores?',
        answer:
          'Sí. Utilizamos protocolos de seguridad para proteger la información registrada. Sin embargo, para la gestión masiva de expedientes institucionales y respaldo en la nube de alta disponibilidad, recomendamos el uso de la versión PRO.',
      },
    ],
  },
  {
    id: 'item-5',
    title: 'Soporte y contacto',
    questions: [
      {
        question: '¿Dónde reporto un error o hacer una sugerencia?',
        answer:
          'Valoramos mucho el feedback de los usuarios en esta etapa. Puedes escribirnos a universitasdev@gmail.com o a través de nuestras redes en Universitas Services.',
      },
    ],
  },
];

export const FAQView: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#E8EDF2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="app-title text-center mb-10 mt-6">
          Preguntas frecuentes
        </h1>

        <div className="space-y-4">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="bg-white border-0 rounded-md shadow-sm overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50 text-[#14476F] font-semibold text-sm transition-colors text-left data-[state=open]:border-b data-[state=open]:border-gray-100">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 bg-white border-t border-gray-50">
                  <div className="space-y-6">
                    {item.questions.map((q, idx) => (
                      <div key={idx} className="space-y-2">
                        <h4 className="faq-question-title">{q.question}</h4>
                        <div className="faq-question-text">{q.answer}</div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};
