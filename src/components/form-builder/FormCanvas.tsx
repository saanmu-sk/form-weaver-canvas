
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, GripVertical, Settings } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectField, removeField, reorderFields, updateFormTitle, updateFormDescription } from '@/store/form-builder-slice';
import { FieldRenderer } from './FieldRenderer';
import { useEffect, useState } from 'react';

export const FormCanvas = () => {
  const dispatch = useAppDispatch();
  const currentForm = useAppSelector(state => state.formBuilder.currentForm);
  const selectedFieldId = useAppSelector(state => state.formBuilder.selectedFieldId);
  const [isClient, setIsClient] = useState(false);

  // Ensure component is mounted on client to avoid SSR issues with react-beautiful-dnd
  useEffect(() => {
    setIsClient(true);
  }, []);

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
    console.log('Drag ended:', result);
    
    if (!result.destination) {
      console.log('No destination, drag cancelled');
      return;
    }
    
    if (result.source.index === result.destination.index) {
      console.log('Same position, no change needed');
      return;
    }

    console.log('Reordering fields from', result.source.index, 'to', result.destination.index);
    dispatch(reorderFields({ 
      startIndex: result.source.index, 
      endIndex: result.destination.index 
    }));
  };

  // Don't render drag and drop until client-side
  if (!isClient) {
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
          <div>Loading...</div>
        </div>
      </div>
    );
  }

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
            {(provided, snapshot) => (
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef} 
                className={`space-y-4 min-h-[200px] ${
                  snapshot.isDraggingOver ? 'bg-muted/30 rounded-lg p-4 border-2 border-dashed border-primary/50' : ''
                }`}
              >
                {currentForm.fields.map((field, index) => (
                  <Draggable key={field.id} draggableId={field.id} index={index}>
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`group p-4 transition-all cursor-pointer ${
                          selectedFieldId === field.id ? 'ring-2 ring-primary' : ''
                        } ${snapshot.isDragging ? 'shadow-lg rotate-1 z-50' : 'hover:shadow-md'}`}
                        onClick={() => dispatch(selectField(field.id))}
                      >
                        <div className="flex items-start gap-3">
                          <div 
                            {...provided.dragHandleProps} 
                            className="mt-2 cursor-grab active:cursor-grabbing hover:text-primary transition-colors flex-shrink-0"
                          >
                            <GripVertical className="w-4 h-4 text-muted-foreground" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <FieldRenderer field={field} isPreview />
                          </div>
                          
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                              className="hover:text-destructive"
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
                  <Card className="p-12 text-center text-muted-foreground border-dashed border-2">
                    <p className="text-lg">Drop fields here to build your form</p>
                    <p className="text-sm mt-2">Add fields from the sidebar to get started</p>
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
