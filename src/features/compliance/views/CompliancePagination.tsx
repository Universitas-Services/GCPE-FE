import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

interface CompliancePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function CompliancePagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: CompliancePaginationProps) {
  return (
    <div className={cn('mt-8', className)}>
      <Pagination>
        <PaginationContent>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page);
                }}
                isActive={currentPage === page}
                className={cn(
                  'h-8 w-8 text-xs bg-gray-100/50 text-gray-400 hover:text-gray-600 hover:bg-gray-200',
                  currentPage === page &&
                    'bg-gray-200 text-gray-600 font-bold border-none shadow-none'
                )}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
