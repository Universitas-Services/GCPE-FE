'use client';

import Image from 'next/image';

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="relative w-full max-w-2xl">
        <Image
          src="/logo-con-letra.png"
          alt="Universitas Logo"
          width={800}
          height={400}
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
