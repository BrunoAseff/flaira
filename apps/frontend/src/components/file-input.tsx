'use client';

import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from 'lucide-react';

import { useFileUpload } from '@/hooks/use-file-upload';
import { Button } from '@/components/ui/button';
import { ImageUploadIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export default function FileInput() {
  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024;
  const maxFiles = 18;

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: 'image/svg+xml,image/png,image/jpeg,image/jpg,image/gif',
    maxSize,
    multiple: true,
    maxFiles,
  });

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
          aria-label="Upload image file"
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
                onClick={openFileDialog}
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
              <span className="mx-auto py-1 px-2  text-sm bg-muted shadow-lg border border-accent rounded-2xl">
                You can add more memories later!
              </span>
            )}
            <div className="grid grid-cols-2 gap-4 overflow-y-auto p-4 md:grid-cols-6 flex-1 min-h-0">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="bg-accent relative aspect-square rounded-md"
                >
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="size-full rounded-[inherit] object-cover"
                  />
                  <Button
                    onClick={() => removeFile(file.id)}
                    size="icon"
                    className="border-background bg-foreground focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-1 shadow-none"
                    aria-label="Remove image"
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
              />{' '}
            </div>
            <p className="mb-1.5 text-sm font-medium">Drop your images here</p>
            <p className="text-foreground/60 text-xs">
              SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
            </p>
            <Button
              variant="outline"
              className="mt-4"
              size="sm"
              onClick={openFileDialog}
            >
              <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
              Select images
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
