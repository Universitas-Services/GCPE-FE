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
        <h3 className="form-label-titulos leading-4">
          {id ? `${id}. ` : ''}
          {question}
        </h3>
        {citation && (
          <p className="text-[13px] text-gray-400 italic leading-4">
            {citation}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <SelectionButton
          label="SI"
          isSelected={value === 'SI'}
          onClick={() => onChange('SI')}
          width="w-[43px]"
        />
        <SelectionButton
          label="NO"
          isSelected={value === 'NO'}
          onClick={() => onChange('NO')}
          width="w-[43px]"
        />
        {!hideNoAplica && (
          <SelectionButton
            label="NO APLICA"
            isSelected={value === 'NO_APLICA'}
            onClick={() => onChange('NO_APLICA')}
            width="w-[79px]"
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
  width,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  width?: string;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className={cn(
        'form-label-buttons h-[35px] text-[11px] font-medium rounded-lg transition-all duration-200',
        width,
        isSelected ? 'btn-option-selected' : 'btn-option-unselected'
      )}
    >
      {label}
    </Button>
  );
}
