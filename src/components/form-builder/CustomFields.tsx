
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Calendar, 
  Upload, 
  Star, 
  Sliders, 
  GitBranch, 
  MapPin,
  CheckSquare
} from 'lucide-react';
import { FieldType, FormField } from '@/types/form-builder';
import { useAppDispatch } from '@/store/hooks';
import { addField } from '@/store/form-builder-slice';

const customFieldTypes: Array<{
  type: FieldType;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
}> = [
  { type: 'multiselect', label: 'Multi Select', icon: CheckSquare, description: 'Multiple selection dropdown' },
  { type: 'date', label: 'Date Picker', icon: Calendar, description: 'Date selection input' },
  { type: 'file', label: 'File Upload', icon: Upload, description: 'File upload component' },
  { type: 'rating', label: 'Rating', icon: Star, description: 'Star rating input' },
  { type: 'slider', label: 'Slider', icon: Sliders, description: 'Range slider input' },
  { type: 'decision', label: 'Decision Box', icon: GitBranch, description: 'Yes/No decision input' },
  { type: 'address', label: 'Address', icon: MapPin, description: 'Complete address input' },
];

export const CustomFields = () => {
  const dispatch = useAppDispatch();

  const handleAddField = (type: FieldType) => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      type,
      label: `New ${customFieldTypes.find(ft => ft.type === type)?.label || 'Field'}`,
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
      <h4 className="font-medium text-sm mb-3">Custom Fields</h4>
      <div className="space-y-2">
        {customFieldTypes.map((fieldType) => {
          const Icon = fieldType.icon;
          return (
            <Card key={fieldType.type} className="p-0">
              <Button
                variant="ghost"
                className="w-full justify-start p-3 h-auto text-left"
                onClick={() => handleAddField(fieldType.type)}
              >
                <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
                <div className="flex flex-col items-start">
                  <span className="font-medium text-sm">{fieldType.label}</span>
                  <span className="text-xs text-muted-foreground">{fieldType.description}</span>
                </div>
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
