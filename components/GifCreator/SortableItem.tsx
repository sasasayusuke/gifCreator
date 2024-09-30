import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ImageWithDelay } from '@/lib/gifUtils';

interface SortableItemProps {
  id: string;
  image: ImageWithDelay;
  onUpdateDelay: (id: string, delay: number) => void;
  onRemoveImage: (id: string) => void;
}

export const SortableItem: React.FC<SortableItemProps> = ({ id, image, onUpdateDelay, onRemoveImage }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="relative">
        <CardContent className="p-2">
          <div className="flex items-center space-x-2">
          <img
            src={URL.createObjectURL(image.file)}
            alt={`Uploaded ${id}`}
              className="w-16 h-16 object-cover rounded"
          />
            <div className="flex-1">
            <Slider
              value={[image.delay]}
              onValueChange={(value) => onUpdateDelay(id, value[0])}
              min={10}
              max={1000}
              step={10}
              className="w-full"
            />
            <div className="text-center mt-1">{image.delay}ms</div>
          </div>
          <Button
            variant="destructive"
            size="sm"
              className="shrink-0"
            onClick={() => onRemoveImage(id)}
          >
            削除
          </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};