
import { configureStore } from '@reduxjs/toolkit';
import formBuilderReducer from './form-builder-slice';

export const store = configureStore({
  reducer: {
    formBuilder: formBuilderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['formBuilder/createNewForm', 'formBuilder/updateFormTitle', 'formBuilder/updateFormDescription'],
        ignoredPaths: ['formBuilder.currentForm.createdAt', 'formBuilder.currentForm.updatedAt', 'formBuilder.savedForms'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
