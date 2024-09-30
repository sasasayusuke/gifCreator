"use client";

import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, Download } from 'lucide-react';
import { ImageWithDelay } from '@/lib/gifUtils';

interface GifPreviewProps {
  previewUrl: string | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onDownload: () => void;
  frames: ImageWithDelay[];
}

export const GifPreview: React.FC<GifPreviewProps> = ({
  previewUrl,
  isPlaying,
  onPlayPause,
  onDownload,
  frames
}) => {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let currentFrame = 0;

    const playAnimation = () => {
      if (isPlaying && imgRef.current && frames.length > 0) {
        imgRef.current.src = URL.createObjectURL(frames[currentFrame].file);
        timeout = setTimeout(() => {
          currentFrame = (currentFrame + 1) % frames.length;
          playAnimation();
        }, frames[currentFrame].delay);
      }
    };

    if (isPlaying) {
      playAnimation();
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isPlaying, frames]);

  if (!previewUrl && frames.length === 0) return null;

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">プレビュー</h3>
      <div className="relative max-w-md mx-auto">
        <div className="aspect-square relative overflow-hidden">
        <img 
          ref={imgRef} 
          src={previewUrl || (frames.length > 0 ? URL.createObjectURL(frames[0].file) : '')} 
          alt="GIF Preview" 
            className="absolute inset-0 w-full h-full object-contain"
        />
        </div>
        <div className="absolute top-2 right-2 space-x-2">
          <Button onClick={onPlayPause} size="sm" variant="secondary">
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </Button>
          {previewUrl && (
            <Button onClick={onDownload} size="sm" variant="secondary">
              <Download size={20} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};