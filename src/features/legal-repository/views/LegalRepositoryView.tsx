import { ServiceCard } from '@/components/features-components/ServiceCard';

const legalServices = [
  {
    imageSrc: '/repositorio-legal/7.webp',
    title: 'Biblioteca Legal: Control Fiscal',
    description:
      'Accede a un compendio normativo completo, doctrina administrativa y jurisprudencia esencial para fortalecer el control fiscal en todos los niveles del sector público.',
    buttonText: 'Ingrese aquí',
    href: 'https://universitas.legal/control-fiscal/',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
  {
    imageSrc: '/repositorio-legal/8.webp',
    title: 'Biblioteca Legal: Contrataciones Públicas',
    description:
      'Accede a normativa especializada, doctrina administrativa y jurisprudencia clave para garantizar contrataciones públicas sostenibles, transparentes y ajustadas al interés general.',
    buttonText: 'Ingrese aquí',
    href: 'https://universitas.legal/biblioteca-contratacion-publica/',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
  {
    imageSrc: '/repositorio-legal/9.webp',
    title: 'Biblioteca Legal: Ordenanzas Municipales',
    description:
      'Explora y descarga decretos, acuerdos y resoluciones de cientos de municipios, con acceso abierto y colaborativo para impulsar gobiernos más transparentes, eficientes y conectados con su comunidad.',
    buttonText: 'Ingrese aquí',
    href: 'https://universitas.legal/biblioteca-de-ordenanzas-municipales/',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
];

export function LegalRepositoryView() {
  return (
    <div className="flex-1 w-full max-h-full overflow-hidden flex flex-col bg-gray-50/50">
      <div className="flex-1 overflow-y-auto w-full p-6 md:p-8 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="app-title text-center mb-10">Repositorio legal</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {legalServices.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
