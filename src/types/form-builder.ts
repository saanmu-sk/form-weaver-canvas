
import { z } from 'zod';

export type FieldType = 
  | 'text' 
  | 'email' 
  | 'phone' 
  | 'number' 
  | 'textarea' 
  | 'select' 
  | 'multiselect'
  | 'radio' 
  | 'checkbox' 
  | 'date' 
  | 'file' 
  | 'rating' 
  | 'slider' 
  | 'decision' 
  | 'address';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
  properties?: {
    description?: string;
    defaultValue?: string | number | boolean;
    multiple?: boolean;
    maxStars?: number;
    minValue?: number;
    maxValue?: number;
    step?: number;
  };
}

export interface FormConfiguration {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  settings: {
    submitButtonText: string;
    allowMultipleSubmissions: boolean;
    showProgressBar: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: Date;
}

// Zod schemas for validation
export const fieldValidationSchema = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  pattern: z.string().optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
});

export const formFieldSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'email', 'phone', 'number', 'textarea', 'select', 'multiselect', 'radio', 'checkbox', 'date', 'file', 'rating', 'slider', 'decision', 'address']),
  label: z.string().min(1, 'Label is required'),
  placeholder: z.string().optional(),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
  validation: fieldValidationSchema.optional(),
  properties: z.object({
    description: z.string().optional(),
    defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
    multiple: z.boolean().optional(),
    maxStars: z.number().optional(),
    minValue: z.number().optional(),
    maxValue: z.number().optional(),
    step: z.number().optional(),
  }).optional(),
});

export const formConfigurationSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Form title is required'),
  description: z.string().optional(),
  fields: z.array(formFieldSchema),
  settings: z.object({
    submitButtonText: z.string(),
    allowMultipleSubmissions: z.boolean(),
    showProgressBar: z.boolean(),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
});
