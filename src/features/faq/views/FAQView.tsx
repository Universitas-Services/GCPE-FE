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
    title: 'Preguntas generales',
    questions: [
      {
        question: '¿Qué es "Actas de entrega"?',
        answer:
          'Es una herramienta digital diseñada para ayudar a los servidores públicos en Venezuela a crear, gestionar y generar actas de entrega de cargos, bienes y recursos de una manera más eficiente y ordenada.',
      },
      {
        question: '¿Para quién es esta aplicación?',
        answer:
          'Está dirigida a todos los servidores públicos dentro de la República Bolivariana de Venezuela que, por sus funciones, deban participar en un proceso de entrega y recepción de un cargo, ya sea en rol de funcionario saliente, entrante o como máxima autoridad de una institución.',
      },
      {
        question:
          '¿Esta aplicación es una herramienta oficial del gobierno venezolano?',
        answer:
          'No. "Actas de entrega" es una aplicación desarrollada y proporcionada por Universitas Services C.A., una entidad privada. Actúa como una herramienta de apoyo tecnológico independiente para facilitar el cumplimiento de las normativas.',
      },
      {
        question: '¿La aplicación ofrece asesoría legal?',
        answer:
          'No, y es un punto muy importante. La aplicación es una herramienta tecnológica para procesar información. No proporciona asesoría legal, jurídica o normativa. Para consultas de ese tipo, debe recurrir a un profesional del derecho.',
      },
    ],
  },
  {
    id: 'item-2',
    title: 'Cuentas y versiones',
    questions: [
      {
        question: '¿Cómo me registro?',
        answer:
          'Puede crear una cuenta visitando nuestro sitio web, haciendo clic en "Registrarme" y completando el formulario inicial. Luego, deberá activar su cuenta a través de un enlace que enviaremos a su correo electrónico.',
      },
      {
        question:
          '¿Cuál es la diferencia entre la versión express (gratuita) y la pro (de pago)?',
        answer: (
          <div className="space-y-2">
            <p>
              La diferencia principal radica en la capacidad y las
              funcionalidades avanzadas.
            </p>
            <p>
              <strong>Express (gratuita):</strong> Le permite generar un (1)
              acta por cada rol. El documento se envía a su correo y no se
              guarda en la app. Es ideal para un uso único o para probar la
              plataforma.
            </p>
            <p>
              <strong>Pro (de pago):</strong> Le permite generar actas
              ilimitadas, las almacena en la nube para que pueda gestionarlas y
              editarlas, y le da acceso a herramientas de inteligencia
              artificial como un asistente virtual y un módulo de
              &quot;compliance&quot;.
            </p>
          </div>
        ),
      },
      {
        question: '¿Es obligatorio pasar a la versión pro?',
        answer:
          'No. Puede utilizar la versión express gratuita según sus limitaciones. La versión pro es una opción para usuarios que necesitan generar múltiples actas, requieren almacenamiento o desean utilizar las funcionalidades avanzadas.',
      },
    ],
  },
  {
    id: 'item-3',
    title: 'Pagos y actualización a pro',
    questions: [
      {
        question: '¿Cómo puedo adquirir la versión pro?',
        answer:
          'Dentro de la aplicación, encontrará un botón para contactar a un asesor vía WhatsApp. Esta persona le guiará a través de las opciones y el proceso de pago para activar su cuenta pro.',
      },
      {
        question: '¿Qué métodos de pago aceptan?',
        answer:
          'Aceptamos transferencias bancarias en bolívares y pagos electrónicos a través de plataformas seguras como PayPal y Stripe.',
      },
      {
        question: '¿El pago es una suscripción mensual o anual?',
        answer:
          'No. La versión pro se adquiere a través de un pago único que le da acceso a todas sus funcionalidades.',
      },
      {
        question: '¿Tienen una política de reembolso?',
        answer:
          'Sí, ofrecemos un reembolso parcial del 50% bajo condiciones muy específicas: debe solicitarlo por escrito dentro de las 24 horas posteriores al pago y no haber superado un límite de uso muy básico. Le recomendamos leer la cláusula completa en nuestros términos y condiciones.',
      },
    ],
  },
  {
    id: 'item-4',
    title: 'Funcionalidades y uso',
    questions: [
      {
        question: '¿Cómo recibo los documentos que genero?',
        answer:
          'Los documentos se generan y alojan en Google Drive. Al finalizar, le enviamos a su correo electrónico un enlace único para que pueda acceder, descargar, imprimir o compartir su acta en formato Google Docs.',
      },
      {
        question: '¿Puedo editar un acta después de haberla generado?',
        answer: (
          <div className="space-y-2">
            <p>
              <strong>En la versión express, no.</strong> Una vez generada,
              cualquier cambio debe hacerse en el archivo Google Docs al que
              accede desde el enlace.
            </p>
            <p>
              <strong>En la versión pro, sí.</strong> Sus actas se guardan en su
              cuenta, permitiéndole editar la información directamente en la
              plataforma y volver a generar el documento actualizado.
            </p>
          </div>
        ),
      },
      {
        question:
          '¿En qué consisten las funciones de inteligencia artificial (IA)?',
        answer:
          'En la versión pro, la IA actúa como un asistente. Puede analizar la información para darle alertas proactivas (por ejemplo, sobre plazos) y sugerirle documentos de debida diligencia. También cuenta con un asesor virtual para responder dudas sobre el proceso.',
      },
      {
        question: '¿Puedo compartir mi cuenta o mi contraseña con un colega?',
        answer:
          'No. Por razones de seguridad y para proteger la integridad de su información, las cuentas son estrictamente personales e intransferibles. Compartir sus credenciales está prohibido en los términos y condiciones.',
      },
    ],
  },
  {
    id: 'item-5',
    title: 'Datos y seguridad',
    questions: [
      {
        question:
          '¿Quién es el dueño de la información que yo introduzco en la aplicación?',
        answer:
          'Usted. El usuario es en todo momento el propietario del contenido que introduce. Nosotros solo tenemos una licencia limitada para procesar esa información y prestarle el servicio.',
      },
      {
        question:
          '¿Universitas Services C.A. revisa el contenido de mis actas?',
        answer:
          'No. Su información es privada. No verificamos, validamos ni revisamos la veracidad o legalidad del contenido que usted introduce. La responsabilidad sobre el contenido es exclusivamente suya.',
      },
      {
        question: '¿Qué pasa con mis documentos si elimino mi cuenta?',
        answer:
          'Si decide eliminar su cuenta, su perfil y acceso a la plataforma serán borrados. Sin embargo, usted conservará el acceso a los documentos que ya había generado, a través de los enlaces de Google Docs que le fueron enviados a su correo electrónico.',
      },
    ],
  },
  {
    id: 'item-6',
    title: 'Soporte y contacto',
    questions: [
      {
        question: '¿Cómo puedo obtener soporte técnico?',
        answer:
          'Para cualquier duda o problema técnico, puede contactar a nuestro equipo a través del canal de WhatsApp disponible en la aplicación o escribiéndonos a contacto@universitas.legal.',
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
