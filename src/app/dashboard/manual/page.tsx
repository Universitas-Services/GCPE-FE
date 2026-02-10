import { ManualForm } from '@/features/manual/views/ManualForm';

export default function ManualPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col items-center justify-center space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-blue-900">
            Manual express
          </h1>
        </div>
        <ManualForm />
      </div>
    </div>
  );
}
