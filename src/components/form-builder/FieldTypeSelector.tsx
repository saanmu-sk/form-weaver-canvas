
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
  Radio, 
  Calendar, 
  Upload, 
  Star, 
  Sliders, 
  GitBranch, 
  MapPin 
} from 'lucide-react';
import { FieldType, FormField } from '@/types/form-builder';
import { useFormBuilderStore } from '@/store/form-builder-store';

const fieldTypes: Array<{
  type: FieldType;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
}> = [
  { type: 'text', label: 'Text Input', icon: Type, description: 'Single line text field' },
  { type: 'email', label: 'Email', icon: Mail, description: 'Email input with validation' },
  { type: 'phone', label: 'Phone', icon: Phone, description: 'Phone number input' },
  { type: 'number', label: 'Number', icon: Hash, description: 'Numeric input field' },
  { type: 'textarea', label: 'Text Area', icon: FileText, description: 'Multi-line text input' },
  { type: 'select', label: 'Dropdown', icon: ChevronDown, description: 'Single selection dropdown' },
  { type: 'multiselect', label: 'Multi Select', icon: CheckSquare, description: 'Multiple selection dropdown' },
  { type: 'radio', label: 'Radio Buttons', icon: Radio, description: 'Single choice from options' },
  { type: 'checkbox', label: 'Checkboxes', icon: CheckSquare, description: 'Multiple choice selection' },
  { type: 'date', label: 'Date Picker', icon: Calendar, description: 'Date selection input' },
  { type: 'file', label: 'File Upload', icon: Upload, description: 'File upload component' },
  { type: 'rating', label: 'Rating', icon: Star, description: 'Star rating input' },
  { type: 'slider', label: 'Slider', icon: Sliders, description: 'Range slider input' },
  { type: 'decision', label: 'Decision Box', icon: GitBranch, description: 'Yes/No decision input' },
  { type: 'address', label: 'Address', icon: MapPin, description: 'Complete address input' },
];

export const FieldTypeSelector = () => {
  const addField = useFormBuilderStore(state => state.addField);

  const handleAddField = (type: FieldType) => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      type,
      label: `New ${fieldTypes.find(ft => ft.type === type)?.label || 'Field'}`,
      placeholder: '',
      required: false,
      options: ['select', 'multiselect', 'radio', 'checkbox'].includes(type) ? ['Option 1', 'Option 2'] : undefined,
      validation: {},
      properties: {},
    };
    addField(newField);
  };

  return (
    <div className="w-64 border-r bg-background p-4 overflow-y-auto">
      <h3 className="font-semibold mb-4">Field Types</h3>
      <div className="space-y-2">
        {fieldTypes.map((fieldType) => {
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
                  <span className="font-medium">{fieldType.label}</span>
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
