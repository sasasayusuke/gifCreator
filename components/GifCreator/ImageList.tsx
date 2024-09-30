import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ImageWithDelay } from '@/lib/gifUtils';

interface ImageListProps {
  images: ImageWithDelay[];
  onUpdateDelay: (id: string, delay: number) => void;
  onRemoveImage: (id: string) => void;
}

export const ImageList: React.FC<ImageListProps> = ({ images, onUpdateDelay, onRemoveImage }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
      {images.map((image, index) => (
        <Draggable key={image.id} draggableId={image.id} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <Card className="relative">
                <CardContent className="p-2">
                  <img
                    src={URL.createObjectURL(image.file)}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                  <div className="mt-2">
                    <Slider
                      value={[image.delay]}
                      onValueChange={(value) => onUpdateDelay(image.id, value[0])}
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
                    className="absolute top-1 right-1"
                    onClick={() => onRemoveImage(image.id)}
                  >
                    削除
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
};

export default ImageList;