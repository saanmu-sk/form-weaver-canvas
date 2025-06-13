
import { create } from 'zustand';
import { FormConfiguration, FormField, FormSubmission } from '@/types/form-builder';

interface FormBuilderState {
  // Current form being edited
  currentForm: FormConfiguration | null;
  selectedFieldId: string | null;
  draggedField: FormField | null;
  
  // All saved forms
  savedForms: FormConfiguration[];
  
  // Form submissions
  submissions: FormSubmission[];
  
  // Actions
  createNewForm: () => void;
  updateFormTitle: (title: string) => void;
  updateFormDescription: (description: string) => void;
  addField: (field: FormField) => void;
  updateField: (fieldId: string, updates: Partial<FormField>) => void;
  removeField: (fieldId: string) => void;
  reorderFields: (startIndex: number, endIndex: number) => void;
  selectField: (fieldId: string | null) => void;
  setDraggedField: (field: FormField | null) => void;
  
  // Form management
  saveForm: () => void;
  loadForm: (formId: string) => void;
  deleteForm: (formId: string) => void;
  duplicateForm: (formId: string) => void;
  
  // Submissions
  addSubmission: (formId: string, data: Record<string, any>) => void;
  getSubmissions: (formId: string) => FormSubmission[];
}

export const useFormBuilderStore = create<FormBuilderState>((set, get) => ({
  currentForm: null,
  selectedFieldId: null,
  draggedField: null,
  savedForms: [],
  submissions: [],

  createNewForm: () => {
    const newForm: FormConfiguration = {
      id: crypto.randomUUID(),
      title: 'Untitled Form',
      description: '',
      fields: [],
      settings: {
        submitButtonText: 'Submit',
        allowMultipleSubmissions: true,
        showProgressBar: false,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set({ currentForm: newForm, selectedFieldId: null });
  },

  updateFormTitle: (title) => {
    const { currentForm } = get();
    if (currentForm) {
      set({
        currentForm: {
          ...currentForm,
          title,
          updatedAt: new Date(),
        },
      });
    }
  },

  updateFormDescription: (description) => {
    const { currentForm } = get();
    if (currentForm) {
      set({
        currentForm: {
          ...currentForm,
          description,
          updatedAt: new Date(),
        },
      });
    }
  },

  addField: (field) => {
    const { currentForm } = get();
    if (currentForm) {
      set({
        currentForm: {
          ...currentForm,
          fields: [...currentForm.fields, field],
          updatedAt: new Date(),
        },
      });
    }
  },

  updateField: (fieldId, updates) => {
    const { currentForm } = get();
    if (currentForm) {
      set({
        currentForm: {
          ...currentForm,
          fields: currentForm.fields.map(field =>
            field.id === fieldId ? { ...field, ...updates } : field
          ),
          updatedAt: new Date(),
        },
      });
    }
  },

  removeField: (fieldId) => {
    const { currentForm } = get();
    if (currentForm) {
      set({
        currentForm: {
          ...currentForm,
          fields: currentForm.fields.filter(field => field.id !== fieldId),
          updatedAt: new Date(),
        },
        selectedFieldId: null,
      });
    }
  },

  reorderFields: (startIndex, endIndex) => {
    const { currentForm } = get();
    if (currentForm) {
      const fields = [...currentForm.fields];
      const [reorderedField] = fields.splice(startIndex, 1);
      fields.splice(endIndex, 0, reorderedField);
      
      set({
        currentForm: {
          ...currentForm,
          fields,
          updatedAt: new Date(),
        },
      });
    }
  },

  selectField: (fieldId) => {
    set({ selectedFieldId: fieldId });
  },

  setDraggedField: (field) => {
    set({ draggedField: field });
  },

  saveForm: () => {
    const { currentForm, savedForms } = get();
    if (currentForm) {
      const existingIndex = savedForms.findIndex(form => form.id === currentForm.id);
      if (existingIndex >= 0) {
        // Update existing form
        const updatedForms = [...savedForms];
        updatedForms[existingIndex] = { ...currentForm, updatedAt: new Date() };
        set({ savedForms: updatedForms });
      } else {
        // Add new form
        set({ savedForms: [...savedForms, { ...currentForm, updatedAt: new Date() }] });
      }
    }
  },

  loadForm: (formId) => {
    const { savedForms } = get();
    const form = savedForms.find(f => f.id === formId);
    if (form) {
      set({ currentForm: form, selectedFieldId: null });
    }
  },

  deleteForm: (formId) => {
    const { savedForms } = get();
    set({ savedForms: savedForms.filter(form => form.id !== formId) });
  },

  duplicateForm: (formId) => {
    const { savedForms } = get();
    const form = savedForms.find(f => f.id === formId);
    if (form) {
      const duplicatedForm: FormConfiguration = {
        ...form,
        id: crypto.randomUUID(),
        title: `${form.title} (Copy)`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      set({ savedForms: [...savedForms, duplicatedForm] });
    }
  },

  addSubmission: (formId, data) => {
    const { submissions } = get();
    const newSubmission: FormSubmission = {
      id: crypto.randomUUID(),
      formId,
      data,
      submittedAt: new Date(),
    };
    set({ submissions: [...submissions, newSubmission] });
  },

  getSubmissions: (formId) => {
    const { submissions } = get();
    return submissions.filter(submission => submission.formId === formId);
  },
}));
