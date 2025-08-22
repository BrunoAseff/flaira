'use client';

import {
  AlertCircleIcon,
  UploadIcon,
  XIcon,
  FileIcon,
  VideoIcon,
  AudioLinesIcon,
  ImageIcon,
} from 'lucide-react';

import {
  useFileUpload,
  type FileWithPreview,
  type FileMetadata,
} from '@/hooks/use-file-upload';
import { Button } from '@/components/ui/button';
import { ImageUploadIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useEffect, useRef } from 'react';

interface FileInputProps {
  files?: FileWithPreview[];
  onFilesChange?: (files: FileWithPreview[]) => void;
  maxSizeMB?: number;
  maxFiles?: number;
  acceptedTypes?: 'images' | 'media';
}

const ACCEPTED_TYPES: Record<
  NonNullable<FileInputProps['acceptedTypes']>,
  string
> = {
  images: 'image/*,.heic,.heif',
  media:
    'image/*,video/*,audio/*,.mp4,.mov,.avi,.mkv,.webm,.heic,.heif,.mp3,.wav,.aac,.ogg,.m4a',
} as const;

function getFileType(
  file: File | FileMetadata
): 'image' | 'video' | 'audio' | 'unknown' {
  const mimeType = 'type' in file ? file.type : '';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  return 'unknown';
}

function getFileName(file: File | FileMetadata): string {
  return 'name' in file ? file.name : 'Unknown file';
}

function getFileSize(file: File | FileMetadata): number {
  return 'size' in file ? file.size : 0;
}

function getFileIcon(fileType: string, className: string = 'size-8') {
  switch (fileType) {
    case 'video':
      return <VideoIcon className={className} />;
    case 'audio':
      return <AudioLinesIcon className={className} />;
    case 'image':
      return <ImageIcon className={className} />;
    default:
      return <FileIcon className={className} />;
  }
}

function FilePreview({ file }: { file: FileWithPreview }) {
  const fileType = getFileType(file.file);

  if (fileType === 'image') {
    return (
      <img
        src={file.preview}
        alt={file.file.name}
        className="size-full rounded-[inherit] object-cover"
      />
    );
  }

  return (
    <div className="size-full rounded-[inherit] bg-popover flex flex-col items-center justify-center p-2 text-center">
      <div className="text-foreground mb-1">{getFileIcon(fileType)}</div>
      <span className="text-xs font-medium text-foreground truncate w-full">
        {getFileName(file.file)}
      </span>
      <span className="text-[10px] text-foreground/60 mt-0.5">
        {(getFileSize(file.file) / 1024 / 1024).toFixed(1)}MB
      </span>
    </div>
  );
}

export default function FileInput({
  files: externalFiles = [],
  onFilesChange,
  maxSizeMB = 5,
  maxFiles = 18,
  acceptedTypes = 'images',
}: FileInputProps) {
  const maxSize = maxSizeMB * 1024 * 1024;
  const previousFilesLength = useRef(0);

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    accept: ACCEPTED_TYPES[acceptedTypes],
    maxSize,
    multiple: true,
    maxFiles,
    onFilesChange,
  });

  useEffect(() => {
    if (externalFiles.length === 0 && previousFilesLength.current > 0) {
      clearFiles();
    }
    previousFilesLength.current = externalFiles.length;
  }, [externalFiles.length, clearFiles]);

  return (
    <div className="flex flex-col gap-2 h-full">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileDialog}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className="border-accent shadow-xs data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex flex-col items-center overflow-hidden rounded-xl border-2 border-dashed p-4 hover:border-primary/60 hover:bg-primary-foreground/60 transition-all not-data-[files]:justify-center has-[input:focus]:ring-[3px] flex-1 min-h-0 cursor-pointer"
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload file"
        />
        {files.length > 0 ? (
          <div className="flex w-full flex-col gap-3 h-full">
            <div className="flex items-center justify-between gap-2 flex-shrink-0">
              <h3 className="truncate text-sm font-medium">
                Uploaded Files ({files.length})
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  openFileDialog();
                }}
                disabled={files.length >= maxFiles}
              >
                <UploadIcon
                  className="-ms-0.5 size-3.5 opacity-60"
                  aria-hidden="true"
                />
                Add more
              </Button>
            </div>
            {files.length >= maxFiles && (
              <span className="mx-auto py-1 px-2 text-sm bg-muted shadow-lg border border-accent rounded-2xl">
                You can add more memories later!
              </span>
            )}
            <div className="grid grid-cols-2 gap-4 overflow-y-auto p-4 md:grid-cols-6 flex-1 min-h-0">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="bg-accent relative aspect-square rounded-md"
                >
                  <FilePreview file={file} />
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.id);
                    }}
                    size="icon"
                    className="border-background bg-foreground focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border shadow-none"
                    aria-label="Remove file"
                  >
                    <XIcon className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
            <div
              className="mb-2 flex shrink-0 items-center justify-center"
              aria-hidden="true"
            >
              <HugeiconsIcon
                className="size-16"
                icon={ImageUploadIcon}
                color="currentColor"
                strokeWidth={1.5}
              />
            </div>
            <p className="mb-1.5 text-sm font-medium">
              {acceptedTypes === 'images'
                ? 'Drop your images here'
                : 'Drop your media files here'}
            </p>
            <p className="text-foreground/60 text-xs">
              {acceptedTypes === 'images'
                ? `SVG, PNG, JPG or GIF (max. ${maxSizeMB}MB)`
                : `Images, Videos, Audio (max. ${maxSizeMB}MB)`}
            </p>
            <Button
              variant="outline"
              className="mt-4"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                openFileDialog();
              }}
            >
              <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
              {acceptedTypes === 'images' ? 'Select images' : 'Select files'}
            </Button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs flex-shrink-0"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  );
}
