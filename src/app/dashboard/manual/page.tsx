import { ManualForm } from '@/features/manual/views/ManualForm';

export default function ManualPage() {
  return (
    <div className="w-full h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)] p-4 md:p-8 flex flex-col">
      <div className="text-center space-y-2 mb-4 md:mb-6 shrink-0">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-blue-900">
          Manual express
        </h1>
      </div>
      <div className="flex-1 overflow-hidden min-h-0 w-full max-w-4xl mx-auto">
        <ManualForm />
      </div>
    </div>
  );
}
