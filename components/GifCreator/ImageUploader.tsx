import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface ImageUploaderProps {
  onUpload: (files: File[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string[];
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUpload,
  maxFiles = 10,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/gif']
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      processFiles(Array.from(files));
    }
  };

  const processFiles = (fileList: File[]) => {
    if (fileList.length > maxFiles) {
      toast({ title: "エラー", description: `最大${maxFiles}枚までアップロードできます。`, variant: "destructive" });
        return;
      }
    const validFiles = fileList.filter(file => acceptedFileTypes.includes(file.type));
    if (validFiles.length !== fileList.length) {
      toast({ 
        title: "警告", 
        description: 'サポートされていないファイル形式が含まれています。', 
        variant: "default"  // "warning" から "default" に変更
      });
      }
      onUpload(validFiles);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    processFiles(Array.from(files));
  };

  return (
    <div
      className={`flex justify-center items-center border-2 border-dashed p-4 ${isDragging ? 'border-primary' : 'border-gray-300'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Button onClick={handleUploadClick} className="flex items-center space-x-2">
        <Upload size={20} />
        <span>画像をアップロード</span>
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedFileTypes.join(',')}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};