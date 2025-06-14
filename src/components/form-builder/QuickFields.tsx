
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Type, 
  Mail, 
  Phone, 
  Hash, 
  FileText, 
  ChevronDown, 
  CheckSquare, 
  Radio 
} from 'lucide-react';
import { FieldType, FormField } from '@/types/form-builder';
import { useAppDispatch } from '@/store/hooks';
import { addField } from '@/store/form-builder-slice';

const quickFieldTypes: Array<{
  type: FieldType;
  label: string;
  icon: React.ComponentType<any>;
}> = [
  { type: 'text', label: 'Text', icon: Type },
  { type: 'email', label: 'Email', icon: Mail },
  { type: 'phone', label: 'Phone', icon: Phone },
  { type: 'number', label: 'Number', icon: Hash },
  { type: 'textarea', label: 'Text Area', icon: FileText },
  { type: 'select', label: 'Select', icon: ChevronDown },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare },
  { type: 'radio', label: 'Radio', icon: Radio },
];

export const QuickFields = () => {
  const dispatch = useAppDispatch();

  const handleAddField = (type: FieldType) => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      type,
      label: `New ${quickFieldTypes.find(ft => ft.type === type)?.label || 'Field'}`,
      placeholder: '',
      required: false,
      options: ['select', 'multiselect', 'radio', 'checkbox'].includes(type) ? ['Option 1', 'Option 2'] : undefined,
      validation: {},
      properties: {},
    };
    dispatch(addField(newField));
  };

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm mb-3">Quick Fields</h4>
      <div className="grid grid-cols-2 gap-2">
        {quickFieldTypes.map((fieldType) => {
          const Icon = fieldType.icon;
          return (
            <Button
              key={fieldType.type}
              variant="outline"
              className="h-auto p-3 flex flex-col items-center gap-2"
              onClick={() => handleAddField(fieldType.type)}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs">{fieldType.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
