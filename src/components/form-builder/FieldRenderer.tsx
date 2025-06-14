import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Star, CalendarIcon, Upload } from 'lucide-react';
import { FormField } from '@/types/form-builder';
import { useState } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface FieldRendererProps {
  field: FormField;
  isPreview?: boolean;
  value?: any;
  onChange?: (value: any) => void;
}

export const FieldRenderer = ({ field, isPreview = false, value, onChange }: FieldRendererProps) => {
  const [localValue, setLocalValue] = useState(value || field.properties?.defaultValue || '');
  const [date, setDate] = useState<Date>();

  const handleChange = (newValue: any) => {
    setLocalValue(newValue);
    onChange?.(newValue);
  };

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            placeholder={field.placeholder}
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            disabled={isPreview}
          />
        );

      case 'email':
        return (
          <Input
            type="email"
            placeholder={field.placeholder || 'Enter email address'}
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            disabled={isPreview}
          />
        );

      case 'phone':
        return (
          <Input
            type="tel"
            placeholder={field.placeholder || 'Enter phone number'}
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            disabled={isPreview}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            value={localValue}
            onChange={(e) => handleChange(Number(e.target.value))}
            min={field.validation?.min}
            max={field.validation?.max}
            disabled={isPreview}
          />
        );

      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            disabled={isPreview}
            rows={4}
          />
        );

      case 'select':
        // Filter out empty strings and null/undefined values
        const validOptions = field.options?.filter(option => option && option.trim() !== '') || [];
        
        return (
          <Select value={localValue} onValueChange={handleChange} disabled={isPreview}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {validOptions.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'radio':
        // Filter out empty strings for radio options too
        const validRadioOptions = field.options?.filter(option => option && option.trim() !== '') || [];
        
        return (
          <RadioGroup value={localValue} onValueChange={handleChange} disabled={isPreview}>
            {validRadioOptions.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        // Filter out empty strings for checkbox options too
        const validCheckboxOptions = field.options?.filter(option => option && option.trim() !== '') || [];
        
        return (
          <div className="space-y-2">
            {validCheckboxOptions.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${index}`}
                  checked={Array.isArray(localValue) ? localValue.includes(option) : false}
                  onCheckedChange={(checked) => {
                    const currentValues = Array.isArray(localValue) ? localValue : [];
                    if (checked) {
                      handleChange([...currentValues, option]);
                    } else {
                      handleChange(currentValues.filter((v: string) => v !== option));
                    }
                  }}
                  disabled={isPreview}
                />
                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        );

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
                disabled={isPreview}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>{field.placeholder || "Pick a date"}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate);
                  handleChange(newDate);
                }}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        );

      case 'file':
        return (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {field.placeholder || 'Click to upload or drag and drop'}
            </p>
            <Input
              type="file"
              className="hidden"
              onChange={(e) => handleChange(e.target.files)}
              disabled={isPreview}
            />
          </div>
        );

      case 'rating':
        const maxStars = field.properties?.maxStars || 5;
        return (
          <div className="flex gap-1">
            {Array.from({ length: maxStars }, (_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 cursor-pointer ${
                  i < (localValue || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
                onClick={() => !isPreview && handleChange(i + 1)}
              />
            ))}
          </div>
        );

      case 'slider':
        return (
          <div className="space-y-4">
            <Slider
              value={[localValue || field.properties?.minValue || 0]}
              onValueChange={(values) => handleChange(values[0])}
              min={field.properties?.minValue || 0}
              max={field.properties?.maxValue || 100}
              step={field.properties?.step || 1}
              disabled={isPreview}
            />
            <div className="text-center text-sm text-muted-foreground">
              Value: {localValue || field.properties?.minValue || 0}
            </div>
          </div>
        );

      case 'decision':
        return (
          <div className="flex gap-4">
            <Button
              variant={localValue === true ? 'default' : 'outline'}
              onClick={() => !isPreview && handleChange(true)}
              disabled={isPreview}
            >
              Yes
            </Button>
            <Button
              variant={localValue === false ? 'default' : 'outline'}
              onClick={() => !isPreview && handleChange(false)}
              disabled={isPreview}
            >
              No
            </Button>
          </div>
        );

      case 'address':
        return (
          <div className="space-y-4">
            <Input placeholder="Street Address" disabled={isPreview} />
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="City" disabled={isPreview} />
              <Input placeholder="State/Province" disabled={isPreview} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="ZIP/Postal Code" disabled={isPreview} />
              <Input placeholder="Country" disabled={isPreview} />
            </div>
          </div>
        );

      default:
        return <div>Unsupported field type</div>;
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {field.properties?.description && (
        <p className="text-xs text-muted-foreground">{field.properties.description}</p>
      )}
      {renderField()}
    </div>
  );
};
