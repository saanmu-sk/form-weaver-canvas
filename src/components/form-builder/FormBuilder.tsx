
import { FormBuilderHeader } from './FormBuilderHeader';
import { FieldTypeSelector } from './FieldTypeSelector';
import { FormCanvas } from './FormCanvas';
import { FieldPropertiesPanel } from './FieldPropertiesPanel';

export const FormBuilder = () => {
  return (
    <div className="h-screen flex flex-col">
      <FormBuilderHeader />
      <div className="flex-1 flex overflow-hidden">
        <FieldTypeSelector />
        <FormCanvas />
        <FieldPropertiesPanel />
      </div>
    </div>
  );
};
