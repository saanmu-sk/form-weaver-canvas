
import { Button } from '@/components/ui/button';
import { Save, Eye, Share, Settings } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createNewForm, saveForm } from '@/store/form-builder-slice';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export const FormBuilderHeader = () => {
  const dispatch = useAppDispatch();
  const currentForm = useAppSelector(state => state.formBuilder.currentForm);
  const savedForms = useAppSelector(state => state.formBuilder.savedForms);
  const { toast } = useToast();
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleSave = () => {
    if (currentForm) {
      dispatch(saveForm());
      
      // Log the save object to console
      const saveObject = {
        form: currentForm,
        savedAt: new Date().toISOString(),
        totalSavedForms: savedForms.length + 1
      };
      
      console.log('Save Object:', JSON.stringify(saveObject, null, 2));
      
      toast({
        title: 'Form saved',
        description: 'Your form has been saved successfully. Check console for save object.',
      });
    }
  };

  const handlePreview = () => {
    if (currentForm) {
      setIsPreviewMode(!isPreviewMode);
      
      const previewObject = {
        mode: isPreviewMode ? 'edit' : 'preview',
        form: currentForm,
        timestamp: new Date().toISOString()
      };
      
      console.log('Preview Object:', JSON.stringify(previewObject, null, 2));
      
      toast({
        title: isPreviewMode ? 'Edit mode enabled' : 'Preview mode enabled',
        description: `Switched to ${isPreviewMode ? 'edit' : 'preview'} mode. Check console for preview object.`,
      });
    }
  };

  const handleShare = () => {
    if (currentForm) {
      const shareObject = {
        formId: currentForm.id,
        title: currentForm.title,
        shareUrl: `${window.location.origin}/form/${currentForm.id}`,
        sharedAt: new Date().toISOString()
      };
      
      console.log('Share Object:', JSON.stringify(shareObject, null, 2));
      
      toast({
        title: 'Share link generated',
        description: 'Share object logged to console.',
      });
    }
  };

  const handleNewForm = () => {
    dispatch(createNewForm());
    setIsPreviewMode(false);
  };

  return (
    <div className="border-b bg-background p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Form Builder</h1>
          {currentForm && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {currentForm.title}
              </span>
              {isPreviewMode && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Preview Mode
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleNewForm}>
            New Form
          </Button>
          
          {currentForm && (
            <>
              <Button 
                variant={isPreviewMode ? "default" : "outline"} 
                onClick={handlePreview}
              >
                <Eye className="w-4 h-4 mr-2" />
                {isPreviewMode ? 'Exit Preview' : 'Preview'}
              </Button>
              
              <Button variant="outline" onClick={handleShare}>
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
