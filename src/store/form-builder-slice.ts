
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormConfiguration, FormField, FormSubmission } from '@/types/form-builder';

interface FormBuilderState {
  currentForm: FormConfiguration | null;
  selectedFieldId: string | null;
  draggedField: FormField | null;
  savedForms: FormConfiguration[];
  submissions: FormSubmission[];
}

const initialState: FormBuilderState = {
  currentForm: null,
  selectedFieldId: null,
  draggedField: null,
  savedForms: [],
  submissions: [],
};

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    createNewForm: (state) => {
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
      state.currentForm = newForm;
      state.selectedFieldId = null;
    },

    updateFormTitle: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        state.currentForm.title = action.payload;
        state.currentForm.updatedAt = new Date();
      }
    },

    updateFormDescription: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        state.currentForm.description = action.payload;
        state.currentForm.updatedAt = new Date();
      }
    },

    addField: (state, action: PayloadAction<FormField>) => {
      if (state.currentForm) {
        state.currentForm.fields.push(action.payload);
        state.currentForm.updatedAt = new Date();
      }
    },

    updateField: (state, action: PayloadAction<{ fieldId: string; updates: Partial<FormField> }>) => {
      if (state.currentForm) {
        const fieldIndex = state.currentForm.fields.findIndex(field => field.id === action.payload.fieldId);
        if (fieldIndex !== -1) {
          state.currentForm.fields[fieldIndex] = { ...state.currentForm.fields[fieldIndex], ...action.payload.updates };
          state.currentForm.updatedAt = new Date();
        }
      }
    },

    removeField: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        state.currentForm.fields = state.currentForm.fields.filter(field => field.id !== action.payload);
        state.currentForm.updatedAt = new Date();
        state.selectedFieldId = null;
      }
    },

    reorderFields: (state, action: PayloadAction<{ startIndex: number; endIndex: number }>) => {
      if (state.currentForm) {
        const fields = [...state.currentForm.fields];
        const [reorderedField] = fields.splice(action.payload.startIndex, 1);
        fields.splice(action.payload.endIndex, 0, reorderedField);
        state.currentForm.fields = fields;
        state.currentForm.updatedAt = new Date();
      }
    },

    selectField: (state, action: PayloadAction<string | null>) => {
      state.selectedFieldId = action.payload;
    },

    setDraggedField: (state, action: PayloadAction<FormField | null>) => {
      state.draggedField = action.payload;
    },

    saveForm: (state) => {
      if (state.currentForm) {
        const existingIndex = state.savedForms.findIndex(form => form.id === state.currentForm!.id);
        if (existingIndex >= 0) {
          state.savedForms[existingIndex] = { ...state.currentForm, updatedAt: new Date() };
        } else {
          state.savedForms.push({ ...state.currentForm, updatedAt: new Date() });
        }
      }
    },

    loadForm: (state, action: PayloadAction<string>) => {
      const form = state.savedForms.find(f => f.id === action.payload);
      if (form) {
        state.currentForm = form;
        state.selectedFieldId = null;
      }
    },

    deleteForm: (state, action: PayloadAction<string>) => {
      state.savedForms = state.savedForms.filter(form => form.id !== action.payload);
    },

    duplicateForm: (state, action: PayloadAction<string>) => {
      const form = state.savedForms.find(f => f.id === action.payload);
      if (form) {
        const duplicatedForm: FormConfiguration = {
          ...form,
          id: crypto.randomUUID(),
          title: `${form.title} (Copy)`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        state.savedForms.push(duplicatedForm);
      }
    },

    addSubmission: (state, action: PayloadAction<{ formId: string; data: Record<string, any> }>) => {
      const newSubmission: FormSubmission = {
        id: crypto.randomUUID(),
        formId: action.payload.formId,
        data: action.payload.data,
        submittedAt: new Date(),
      };
      state.submissions.push(newSubmission);
    },
  },
});

export const {
  createNewForm,
  updateFormTitle,
  updateFormDescription,
  addField,
  updateField,
  removeField,
  reorderFields,
  selectField,
  setDraggedField,
  saveForm,
  loadForm,
  deleteForm,
  duplicateForm,
  addSubmission,
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;
