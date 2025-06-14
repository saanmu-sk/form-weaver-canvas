
import { QuickFields } from './QuickFields';
import { CustomFields } from './CustomFields';

export const FieldTypeSelector = () => {
  return (
    <div className="w-64 border-r bg-background p-4 overflow-y-auto">
      <h3 className="font-semibold mb-4">Field Types</h3>
      <div className="space-y-6">
        <QuickFields />
        <CustomFields />
      </div>
    </div>
  );
};
