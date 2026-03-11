import { ManualForm } from '@/features/manual/views/ManualForm';

export default function ManualPage() {
  return (
    <div className="w-full h-[calc(100vh-4rem)] md:h-[calc(100vh-2rem)] p-2 md:p-4 flex flex-col">
      <div className="text-center space-y-0.5 mb-2 md:mb-2 mt-2 shrink-0">
        <h1 className="text-lg md:text-xl font-bold tracking-tight text-blue-900">
          Manual express
        </h1>
      </div>
      <div className="flex-1 overflow-hidden min-h-0 w-full max-w-[1600px] mx-auto flex flex-col bg-white rounded-xl shadow-lg border border-gray-200">
        <ManualForm />
      </div>
    </div>
  );
}
