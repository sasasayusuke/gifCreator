"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface GifControlsProps {
  onCreateGif: () => void;
  onCancelGifCreation: () => void;
  isLoading: boolean;
  progress: number;
  imagesCount: number;
}

export const GifControls: React.FC<GifControlsProps> = ({
  onCreateGif,
  onCancelGifCreation,
  isLoading,
  progress,
  imagesCount
}) => {
  return (
    <div className="mt-4 space-y-2">
      <Button
        onClick={onCreateGif}
        disabled={isLoading || imagesCount === 0}
        className="w-full"
      >
        {isLoading ? 'GIF作成中...' : 'GIFを作成'}
      </Button>
      {isLoading && (
        <>
          <Progress value={progress} className="w-full" />
          <Button onClick={onCancelGifCreation} variant="destructive" className="w-full">
            キャンセル
          </Button>
        </>
      )}
    </div>
  );
};