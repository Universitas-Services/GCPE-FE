import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { QuestionAnswer } from '../context/ComplianceContext';

interface ComplianceQuestionItemProps {
  id?: number;
  question: string;
  citation?: string;
  value?: QuestionAnswer;
  onChange: (value: QuestionAnswer) => void;
  hideNoAplica?: boolean;
}

export function ComplianceQuestionItem({
  id,
  question,
  citation,
  value,
  onChange,
  hideNoAplica = false,
}: ComplianceQuestionItemProps) {
  return (
    <div className="space-y-4 py-6 border-b border-gray-100 last:border-0">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-[#0b1e4c]">
          {id ? `${id}. ` : ''}
          {question}
        </h3>
        {citation && (
          <p className="text-sm text-gray-400 italic leading-relaxed">
            {citation}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <SelectionButton
          label="SI"
          isSelected={value === 'SI'}
          onClick={() => onChange('SI')}
        />
        <SelectionButton
          label="NO"
          isSelected={value === 'NO'}
          onClick={() => onChange('NO')}
        />
        {!hideNoAplica && (
          <SelectionButton
            label="NO APLICA"
            isSelected={value === 'NO_APLICA'}
            onClick={() => onChange('NO_APLICA')}
          />
        )}
      </div>
    </div>
  );
}

function SelectionButton({
  label,
  isSelected,
  onClick,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className={cn(
        'h-10 px-6 min-w-[80px] text-xs font-semibold rounded-lg transition-all duration-200',
        isSelected ? 'btn-option-selected' : 'btn-option-unselected'
      )}
    >
      {label}
    </Button>
  );
}
