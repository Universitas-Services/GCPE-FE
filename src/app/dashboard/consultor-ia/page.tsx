import { ConsultorIAView } from '@/features/consultor-ia';
import { FormHeader } from '@/components/shared/FormHeader';

export default function ConsultorIAPage() {
  return (
    <div className="w-full h-[calc(100vh-4rem)] md:h-[calc(100vh-2rem)] p-2 md:p-4 flex flex-col">
      <FormHeader
        title="Consultor IA"
        className="text-center mb-8 shrink-0"
        titleClassName="text-[32px] md:text-[32px] leading-[40px] md:leading-[40px] font-bold"
      />
      <ConsultorIAView />
    </div>
  );
}
