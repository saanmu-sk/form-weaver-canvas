
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, GripVertical, Settings } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectField, removeField, reorderFields, updateFormTitle, updateFormDescription } from '@/store/form-builder-slice';
import { FieldRenderer } from './FieldRenderer';

export const FormCanvas = () => {
  const dispatch = useAppDispatch();
  const currentForm = useAppSelector(state => state.formBuilder.currentForm);
  const selectedFieldId = useAppSelector(state => state.formBuilder.selectedFieldId);

  if (!currentForm) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">No form selected</h3>
          <p>Create a new form to get started</p>
        </div>
      </div>
    );
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    dispatch(reorderFields({ 
      startIndex: result.source.index, 
      endIndex: result.destination.index 
    }));
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Form Header */}
        <Card className="p-6">
          <div className="space-y-4">
            <Input
              value={currentForm.title}
              onChange={(e) => dispatch(updateFormTitle(e.target.value))}
              className="text-2xl font-bold border-none p-0 focus-visible:ring-0"
              placeholder="Form Title"
            />
            <Textarea
              value={currentForm.description || ''}
              onChange={(e) => dispatch(updateFormDescription(e.target.value))}
              placeholder="Form description (optional)"
              className="border-none p-0 focus-visible:ring-0 resize-none"
              rows={2}
            />
          </div>
        </Card>

        {/* Form Fields */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="form-fields">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {currentForm.fields.map((field, index) => (
                  <Draggable key={field.id} draggableId={field.id} index={index}>
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`p-4 ${
                          selectedFieldId === field.id ? 'ring-2 ring-primary' : ''
                        } ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                        onClick={() => dispatch(selectField(field.id))}
                      >
                        <div className="flex items-start gap-3">
                          <div {...provided.dragHandleProps} className="mt-2">
                            <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                          </div>
                          
                          <div className="flex-1">
                            <FieldRenderer field={field} isPreview />
                          </div>
                          
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch(selectField(field.id));
                              }}
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch(removeField(field.id));
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                
                {currentForm.fields.length === 0 && (
                  <Card className="p-8 text-center text-muted-foreground border-dashed">
                    <p>Add fields from the sidebar to build your form</p>
                  </Card>
                )}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Submit Button Preview */}
        {currentForm.fields.length > 0 && (
          <Card className="p-6">
            <Button className="w-full">
              {currentForm.settings.submitButtonText}
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};
