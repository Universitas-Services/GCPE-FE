import { ServiceCard } from '../components/ServiceCard';

const services = [
  {
    imageSrc: '/conocenos/1.webp',
    title: 'Jornadas de Control Fiscal',
    description:
      'Transforma tu carrera y domina la vanguardia de la gestión pública con las Jornadas de Control Fiscal. Universitas Academy te brinda acceso exclusivo a los expertos más influyentes del sector.',
    buttonText: 'Inscríbete aquí',
    href: '#',
  },
  {
    imageSrc: '/conocenos/2.webp',
    title: 'El Funcionario Público',
    description:
      'Domina el marco legal que rige tu carrera. Un curso esencial sobre los derechos, deberes y responsabilidades de todo servidor público, desde el ingreso hasta el retiro.',
    buttonText: 'Inscríbete aquí',
    href: '#',
  },
  {
    imageSrc: '/conocenos/3.webp',
    title: 'Actas de entrega en la Administración Pública',
    description:
      'Este programa te equipará con las competencias esenciales para la elaboración y gestión de Actas de Entrega.',
    buttonText: 'Mas Información',
    href: '#',
  },
  {
    imageSrc: '/conocenos/4.webp',
    title: 'Cursos Virtuales',
    description:
      'Eleva tu perfil profesional con Universitas Academy, la plataforma de formación en línea que te conecta con el conocimiento de vanguardia en derecho y administración pública.',
    buttonText: 'Mas Información',
    href: '#',
  },
  {
    imageSrc: '/conocenos/5.webp',
    title: 'Jornadas Contrataciones Públicas',
    description:
      'Actualízate con los mayores expertos del país. Accede a las ponencias y debates de nuestras más recientes jornadas sobre los retos actuales de la contratación pública.',
    buttonText: 'Inscríbete aquí',
    href: '#',
  },
  {
    imageSrc: '/conocenos/6.webp',
    title: 'Ágora',
    description:
      'Ágora es un espacio diseñado para que los profesionales puedan publicar sus artículos de investigación o de opinión y noticias.',
    buttonText: 'Inscríbete aquí',
    href: '#',
  },
  {
    imageSrc: '/conocenos/7.webp',
    title: 'Régimen Disciplinario de los Funcionarios Públicos',
    description:
      'Conoce a fondo el procedimiento de amonestación y destitución. Un curso clave para comprender las faltas, sanciones y protegerte de riesgos disciplinarios.',
    buttonText: 'Inscríbete aquí',
    href: '#',
  },
  {
    imageSrc: '/conocenos/8.webp',
    title: 'El Control en la Gestión Pública',
    description:
      'Fortalece la gestión de tu entidad. Profundiza en los sistemas de control interno, la responsabilidad administrativa y las herramientas para una administración eficiente y transparente.',
    buttonText: 'Inscríbete aquí',
    href: '#',
  },
  {
    imageSrc: '/conocenos/9.webp',
    title: 'Fundamentos de la Contratación Pública',
    description:
      'Evita errores costosos en los procesos de compra del Estado. Domina las leyes, modalidades y principios esenciales de la contratación pública en Venezuela.',
    buttonText: 'Inscríbete aquí',
    href: '#',
  },
];

export function AboutUsView() {
  return (
    <div className="flex-1 w-full max-h-full overflow-hidden flex flex-col bg-gray-50/50">
      <div className="flex-1 overflow-y-auto w-full p-6 md:p-8 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-[#0b1e4c] mb-10">
            Conócenos
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
