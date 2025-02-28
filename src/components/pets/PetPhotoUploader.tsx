import React, { useState, useCallback } from "react";
import { X, Upload, Image as ImageIcon, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PetPhoto {
  id: string;
  url: string;
  name: string;
  size: number;
  progress: number;
}

interface PetPhotoUploaderProps {
  photos?: PetPhoto[];
  onPhotosChange?: (photos: PetPhoto[]) => void;
  maxPhotos?: number;
}

const PetPhotoUploader = ({
  photos: initialPhotos = [
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1",
      name: "dog.jpg",
      size: 1200000,
      progress: 100,
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
      name: "cat.jpg",
      size: 980000,
      progress: 100,
    },
  ],
  onPhotosChange = () => {},
  maxPhotos = 5,
}: PetPhotoUploaderProps) => {
  const [photos, setPhotos] = useState<PetPhoto[]>(initialPhotos);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isDragging) {
        setIsDragging(true);
      }
    },
    [isDragging],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (photos.length >= maxPhotos) {
        // Show error or notification that max photos reached
        return;
      }

      const files = Array.from(e.dataTransfer.files);
      if (files.length === 0) return;

      // Filter for image files only
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));
      if (imageFiles.length === 0) return;

      // Simulate upload process
      setUploading(true);

      const newPhotos = imageFiles
        .slice(0, maxPhotos - photos.length)
        .map((file) => {
          const id = Math.random().toString(36).substring(2, 11);
          return {
            id,
            url: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
            progress: 0,
          };
        });

      const updatedPhotos = [...photos, ...newPhotos];
      setPhotos(updatedPhotos);
      onPhotosChange(updatedPhotos);

      // Simulate progress
      newPhotos.forEach((photo) => {
        const interval = setInterval(() => {
          setPhotos((prevPhotos) => {
            const updatedPhotos = prevPhotos.map((p) => {
              if (p.id === photo.id) {
                const newProgress = Math.min(p.progress + 20, 100);
                if (newProgress === 100) {
                  clearInterval(interval);
                  if (!prevPhotos.some((photo) => photo.progress < 100)) {
                    setUploading(false);
                  }
                }
                return { ...p, progress: newProgress };
              }
              return p;
            });
            onPhotosChange(updatedPhotos);
            return updatedPhotos;
          });
        }, 500);
      });
    },
    [photos, maxPhotos, onPhotosChange],
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) return;
      if (photos.length >= maxPhotos) {
        // Show error or notification that max photos reached
        return;
      }

      const files = Array.from(e.target.files);
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));
      if (imageFiles.length === 0) return;

      // Simulate upload process
      setUploading(true);

      const newPhotos = imageFiles
        .slice(0, maxPhotos - photos.length)
        .map((file) => {
          const id = Math.random().toString(36).substring(2, 11);
          return {
            id,
            url: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
            progress: 0,
          };
        });

      const updatedPhotos = [...photos, ...newPhotos];
      setPhotos(updatedPhotos);
      onPhotosChange(updatedPhotos);

      // Simulate progress
      newPhotos.forEach((photo) => {
        const interval = setInterval(() => {
          setPhotos((prevPhotos) => {
            const updatedPhotos = prevPhotos.map((p) => {
              if (p.id === photo.id) {
                const newProgress = Math.min(p.progress + 20, 100);
                if (newProgress === 100) {
                  clearInterval(interval);
                  if (!prevPhotos.some((photo) => photo.progress < 100)) {
                    setUploading(false);
                  }
                }
                return { ...p, progress: newProgress };
              }
              return p;
            });
            onPhotosChange(updatedPhotos);
            return updatedPhotos;
          });
        }, 500);
      });

      // Reset file input
      e.target.value = "";
    },
    [photos, maxPhotos, onPhotosChange],
  );

  const removePhoto = useCallback(
    (id: string) => {
      const updatedPhotos = photos.filter((photo) => photo.id !== id);
      setPhotos(updatedPhotos);
      onPhotosChange(updatedPhotos);
    },
    [photos, onPhotosChange],
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Pet Photos</h3>
        <p className="text-sm text-gray-500">
          Upload clear photos of your pet. You can add up to {maxPhotos} photos.
        </p>
      </div>

      {/* Drag and drop area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 mb-4 text-center transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-gray-300"}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-10 w-10 text-gray-400" />
          <p className="text-sm font-medium">
            Drag and drop your pet photos here
          </p>
          <p className="text-xs text-gray-500">or</p>
          <Button
            variant="outline"
            onClick={() => document.getElementById("file-upload")?.click()}
            disabled={photos.length >= maxPhotos || uploading}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Select Photos
          </Button>
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileInputChange}
            disabled={photos.length >= maxPhotos}
          />
          <p className="text-xs text-gray-500 mt-2">
            Supported formats: JPEG, PNG, GIF (max{" "}
            {formatFileSize(10 * 1024 * 1024)} per image)
          </p>
        </div>
      </div>

      {/* Photo preview grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {photos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden group relative">
              <div className="relative aspect-square">
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="w-full h-full object-cover"
                />
                {photo.progress < 100 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-3/4">
                      <Progress value={photo.progress} className="h-2" />
                      <p className="text-white text-xs mt-2 text-center">
                        Uploading... {photo.progress}%
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <div className="truncate text-sm">
                    {photo.name}
                    <p className="text-xs text-gray-500">
                      {formatFileSize(photo.size)}
                    </p>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removePhoto(photo.id)}
                          disabled={photo.progress < 100}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remove photo</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Status message */}
      <div className="mt-4 text-sm text-gray-500">
        {photos.length} of {maxPhotos} photos added
      </div>
    </div>
  );
};

export default PetPhotoUploader;
