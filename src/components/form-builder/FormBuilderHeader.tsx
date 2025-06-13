
import { Button } from '@/components/ui/button';
import { Save, Eye, Share, Settings } from 'lucide-react';
import { useFormBuilderStore } from '@/store/form-builder-store';
import { useToast } from '@/hooks/use-toast';

export const FormBuilderHeader = () => {
  const { currentForm, saveForm, createNewForm } = useFormBuilderStore();
  const { toast } = useToast();

  const handleSave = () => {
    if (currentForm) {
      saveForm();
      toast({
        title: 'Form saved',
        description: 'Your form has been saved successfully.',
      });
    }
  };

  const handlePreview = () => {
    toast({
      title: 'Preview mode',
      description: 'Preview functionality will be implemented with database integration.',
    });
  };

  const handleShare = () => {
    toast({
      title: 'Share form',
      description: 'Sharing functionality will be implemented with database integration.',
    });
  };

  return (
    <div className="border-b bg-background p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Form Builder</h1>
          {currentForm && (
            <span className="text-sm text-muted-foreground">
              {currentForm.title}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={createNewForm}>
            New Form
          </Button>
          
          {currentForm && (
            <>
              <Button variant="outline" onClick={handlePreview}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
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
