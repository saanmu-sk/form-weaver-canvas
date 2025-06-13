
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2 } from 'lucide-react';
import { useFormBuilderStore } from '@/store/form-builder-store';

export const FieldPropertiesPanel = () => {
  const { currentForm, selectedFieldId, updateField } = useFormBuilderStore();
  
  const selectedField = currentForm?.fields.find(field => field.id === selectedFieldId);

  if (!selectedField) {
    return (
      <div className="w-80 border-l bg-background p-4">
        <div className="text-center text-muted-foreground">
          <h3 className="font-semibold mb-2">Field Properties</h3>
          <p>Select a field to edit its properties</p>
        </div>
      </div>
    );
  }

  const handleFieldUpdate = (updates: any) => {
    updateField(selectedField.id, updates);
  };

  const addOption = () => {
    const currentOptions = selectedField.options || [];
    handleFieldUpdate({
      options: [...currentOptions, `Option ${currentOptions.length + 1}`]
    });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(selectedField.options || [])];
    newOptions[index] = value;
    handleFieldUpdate({ options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = selectedField.options?.filter((_, i) => i !== index);
    handleFieldUpdate({ options: newOptions });
  };

  const hasOptions = ['select', 'multiselect', 'radio', 'checkbox'].includes(selectedField.type);
  const hasValidation = ['text', 'email', 'number', 'textarea'].includes(selectedField.type);
  const hasRating = selectedField.type === 'rating';
  const hasSlider = selectedField.type === 'slider';

  return (
    <div className="w-80 border-l bg-background p-4 overflow-y-auto">
      <h3 className="font-semibold mb-4">Field Properties</h3>
      
      <div className="space-y-6">
        {/* Basic Properties */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="label">Field Label</Label>
            <Input
              id="label"
              value={selectedField.label}
              onChange={(e) => handleFieldUpdate({ label: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="placeholder">Placeholder</Label>
            <Input
              id="placeholder"
              value={selectedField.placeholder || ''}
              onChange={(e) => handleFieldUpdate({ placeholder: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={selectedField.properties?.description || ''}
              onChange={(e) => handleFieldUpdate({ 
                properties: { ...selectedField.properties, description: e.target.value }
              })}
              rows={2}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="required"
              checked={selectedField.required}
              onCheckedChange={(checked) => handleFieldUpdate({ required: checked })}
            />
            <Label htmlFor="required">Required field</Label>
          </div>
        </div>

        {/* Options for select/radio/checkbox fields */}
        {hasOptions && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Options</Label>
                <Button variant="outline" size="sm" onClick={addOption}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Option
                </Button>
              </div>
              
              <div className="space-y-2">
                {selectedField.options?.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeOption(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Validation */}
        {hasValidation && (
          <>
            <Separator />
            <div className="space-y-4">
              <Label>Validation</Label>
              
              {selectedField.type === 'number' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="min">Min Value</Label>
                    <Input
                      id="min"
                      type="number"
                      value={selectedField.validation?.min || ''}
                      onChange={(e) => handleFieldUpdate({
                        validation: {
                          ...selectedField.validation,
                          min: e.target.value ? Number(e.target.value) : undefined
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max">Max Value</Label>
                    <Input
                      id="max"
                      type="number"
                      value={selectedField.validation?.max || ''}
                      onChange={(e) => handleFieldUpdate({
                        validation: {
                          ...selectedField.validation,
                          max: e.target.value ? Number(e.target.value) : undefined
                        }
                      })}
                    />
                  </div>
                </div>
              )}

              {(selectedField.type === 'text' || selectedField.type === 'textarea') && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="minLength">Min Length</Label>
                    <Input
                      id="minLength"
                      type="number"
                      value={selectedField.validation?.minLength || ''}
                      onChange={(e) => handleFieldUpdate({
                        validation: {
                          ...selectedField.validation,
                          minLength: e.target.value ? Number(e.target.value) : undefined
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxLength">Max Length</Label>
                    <Input
                      id="maxLength"
                      type="number"
                      value={selectedField.validation?.maxLength || ''}
                      onChange={(e) => handleFieldUpdate({
                        validation: {
                          ...selectedField.validation,
                          maxLength: e.target.value ? Number(e.target.value) : undefined
                        }
                      })}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Rating Properties */}
        {hasRating && (
          <>
            <Separator />
            <div className="space-y-4">
              <Label>Rating Settings</Label>
              <div>
                <Label htmlFor="maxStars">Max Stars</Label>
                <Input
                  id="maxStars"
                  type="number"
                  min="1"
                  max="10"
                  value={selectedField.properties?.maxStars || 5}
                  onChange={(e) => handleFieldUpdate({
                    properties: {
                      ...selectedField.properties,
                      maxStars: Number(e.target.value)
                    }
                  })}
                />
              </div>
            </div>
          </>
        )}

        {/* Slider Properties */}
        {hasSlider && (
          <>
            <Separator />
            <div className="space-y-4">
              <Label>Slider Settings</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="minValue">Min Value</Label>
                  <Input
                    id="minValue"
                    type="number"
                    value={selectedField.properties?.minValue || 0}
                    onChange={(e) => handleFieldUpdate({
                      properties: {
                        ...selectedField.properties,
                        minValue: Number(e.target.value)
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="maxValue">Max Value</Label>
                  <Input
                    id="maxValue"
                    type="number"
                    value={selectedField.properties?.maxValue || 100}
                    onChange={(e) => handleFieldUpdate({
                      properties: {
                        ...selectedField.properties,
                        maxValue: Number(e.target.value)
                      }
                    })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="step">Step</Label>
                <Input
                  id="step"
                  type="number"
                  min="1"
                  value={selectedField.properties?.step || 1}
                  onChange={(e) => handleFieldUpdate({
                    properties: {
                      ...selectedField.properties,
                      step: Number(e.target.value)
                    }
                  })}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
