import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { ImageWithDelay } from '@/lib/gifUtils';

interface DraggableImageListProps {
  images: ImageWithDelay[];
  onReorder: (newImages: ImageWithDelay[]) => void;
  onUpdateDelay: (id: string, delay: number) => void;
  onRemoveImage: (id: string) => void;
}

const DraggableImageList: React.FC<DraggableImageListProps> = ({
  images,
  onReorder,
  onUpdateDelay,
  onRemoveImage
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      onReorder(arrayMove(images, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={images.map((img) => img.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {images.map((image) => (
            <SortableItem
              key={image.id}
              id={image.id}
              image={image}
              onUpdateDelay={onUpdateDelay}
              onRemoveImage={onRemoveImage}
            />
          ))}
          </div>
      </SortableContext>
    </DndContext>
  );
};

export default DraggableImageList;