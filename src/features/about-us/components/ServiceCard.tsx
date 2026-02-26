import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ServiceCardProps {
  imageSrc: string;
  title: string;
  description: string;
  buttonText: string;
  href: string;
  target?: string;
  rel?: string;
}

export function ServiceCard({
  imageSrc,
  title,
  description,
  buttonText,
  href,
  target,
  rel,
}: ServiceCardProps) {
  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-4">
      <div className="relative w-full aspect-[16/9] mb-4 overflow-hidden rounded-xl border border-gray-50 bg-gray-50/50">
        <Image src={imageSrc} alt={title} fill className="object-cover" />
      </div>
      <div className="flex flex-col flex-grow items-center text-center px-1 pb-1">
        <p className="text-[13px] md:text-sm text-gray-700 mb-6 flex-grow leading-relaxed">
          {description}
        </p>
        <Button
          className="w-full bg-[#008CBA] hover:bg-[#007ba3] text-white rounded-lg h-10 font-medium transition-colors"
          asChild
        >
          <Link href={href} target={target} rel={rel}>
            {buttonText}
          </Link>
        </Button>
      </div>
    </div>
  );
}
