"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { createGif, ImageWithDelay } from '@/lib/gifUtils';
import { ImageUploader } from './ImageUploader';
import { GifPreview } from './GifPreview';
import { GifControls } from './GifControls';
import { useToast } from "@/components/ui/use-toast";
import dynamic from 'next/dynamic';
import ErrorBoundary from '../ErrorBoundary';

const DraggableImageList = dynamic(() => import('./DraggableImageList'), { ssr: false });

export const GifCreator: React.FC = () => {
  const { toast } = useToast();
  const [images, setImages] = useState<ImageWithDelay[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleImageUpload = useCallback((files: File[]) => {
    const newImages: ImageWithDelay[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      delay: 100
    }));
    setImages(prevImages => [...prevImages, ...newImages]);
  }, []);

  const handleReorder = useCallback((newImages: ImageWithDelay[]) => {
    setImages(newImages);
  }, []);

  const handleUpdateDelay = useCallback((id: string, delay: number) => {
    setImages(prevImages => prevImages.map(img =>
      img.id === id ? { ...img, delay } : img
    ));
  }, []);

  const handleRemoveImage = useCallback((id: string) => {
    setImages(prevImages => prevImages.filter(img => img.id !== id));
  }, []);

  const handleDownload = useCallback((blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const handleCreateGif = useCallback(async () => {
    if (images.length === 0) {
      toast({ title: "エラー", description: "画像が選択されていません。", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setProgress(0);
    abortControllerRef.current = new AbortController();

    try {
    let gif;
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
      // 本番環境ではAPIルートを使用
      const response = await fetch('/api/createGif', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ images }),
      });
      const data = await response.json();
      gif = data.gif;
    } else {
      // 開発環境ではクライアントサイドで作成
      gif = await createGif(
        images,
        (percent) => setProgress(percent),
        { width: 500, height: 500, quality: 10 },
        abortControllerRef.current.signal
      );
    }

      const url = URL.createObjectURL(gif);
      setPreviewUrl(url);

      // GIFの自動ダウンロード
      handleDownload(gif, 'animation.gif');

      toast({
        title: "成功",
        description: "GIFの作成が完了し、ダウンロードが開始されました。",
        variant: "default"
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error('GIF作成エラー:', error);
        toast({
          title: "エラー",
          description: `GIF作成中にエラーが発生しました: ${error.message}`,
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [images, toast, handleDownload]);

  const handleCancelGifCreation = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      toast({ title: "キャンセル", description: "GIF作成をキャンセルしました。" });
    }
  }, [toast]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* サイドバー */}
      <div className="w-1/4 min-w-[250px] border-r overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">画像リスト</h2>
          <ErrorBoundary>
            <DraggableImageList
              images={images}
              onReorder={handleReorder}
              onUpdateDelay={handleUpdateDelay}
              onRemoveImage={handleRemoveImage}
            />
          </ErrorBoundary>
        </div>
      </div>

      {/* メインコンテンツエリア */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <ImageUploader onUpload={handleImageUpload} />
          <GifPreview
            previewUrl={previewUrl}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onDownload={() => previewUrl && handleDownload(new Blob([previewUrl]), 'animation.gif')}
            frames={images}
          />
          <GifControls
            onCreateGif={handleCreateGif}
            onCancelGifCreation={handleCancelGifCreation}
            isLoading={isLoading}
            progress={progress}
            imagesCount={images.length}
          />
        </div>
      </div>
    </div>
  );
};

export default GifCreator;