import { useState, useRef } from "react";

import { HugeiconsIcon } from "@hugeicons/react";
import { Loading01Icon } from "@hugeicons/core-free-icons";
import ReactCrop, {
  type Crop,
  type PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { UseMutationResult } from "@tanstack/react-query";

const OUTPUT_AVATAR_SIZE = 256;

async function getCroppedBlob(
  imageElement: HTMLImageElement,
  crop: PixelCrop,
  fileName: string,
): Promise<File | null> {
  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_AVATAR_SIZE;
  canvas.height = OUTPUT_AVATAR_SIZE;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("Failed to get 2D context");
    return null;
  }

  const scaleX = imageElement.naturalWidth / imageElement.width;
  const scaleY = imageElement.naturalHeight / imageElement.height;

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;
  const cropWidth = crop.width * scaleX;
  const cropHeight = crop.height * scaleY;

  ctx.beginPath();
  ctx.arc(
    OUTPUT_AVATAR_SIZE / 2,
    OUTPUT_AVATAR_SIZE / 2,
    OUTPUT_AVATAR_SIZE / 2,
    0,
    Math.PI * 2,
    true,
  );
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(
    imageElement,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    OUTPUT_AVATAR_SIZE,
    OUTPUT_AVATAR_SIZE,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          console.error("Canvas to Blob conversion failed.");
          reject(new Error("Canvas to Blob conversion failed."));
          return;
        }

        const outputType = "image/png";
        const outputFileName = `${fileName.replace(/\.[^/.]+$/, "")}.png`;
        resolve(new File([blob], outputFileName, { type: outputType }));
      },
      "image/png",
      0.95,
    );
  });
}

interface ImageCropModalProps {
  open: boolean;
  imageToCropSrc: string | null;
  originalFile: File | null;
  onCropConfirm: (croppedFile: File) => void;
  onCropCancel: () => void;
  uploadAvatarMutation: UseMutationResult<unknown, Error, File, unknown>;
  setClientSideUploadError: (error: string | null) => void;
}

export default function ImageCropDialog({
  open,
  imageToCropSrc,
  originalFile,
  onCropConfirm,
  onCropCancel,
  uploadAvatarMutation,
  setClientSideUploadError,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState<Crop | undefined>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height, naturalWidth } = e.currentTarget;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: Math.min(
          90,
          (OUTPUT_AVATAR_SIZE / naturalWidth) * 100 * (naturalWidth / width),
        ),
      },
      1,
      width,
      height,
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
    setCompletedCrop({
      ...centeredCrop,
      unit: "px",
      x: (centeredCrop.x / 100) * width,
      y: (centeredCrop.y / 100) * height,
      width: (centeredCrop.width / 100) * width,
      height: (centeredCrop.height / 100) * height,
    });
  };

  const handleCropConfirm = async () => {
    if (!completedCrop || !imgRef.current || !originalFile) {
      setClientSideUploadError("Cropping failed. Please try again.");
      return;
    }
    try {
      const croppedImageFile = await getCroppedBlob(
        imgRef.current,
        completedCrop,
        originalFile.name,
      );
      if (croppedImageFile) {
        onCropConfirm(croppedImageFile);
      } else {
        setClientSideUploadError("Failed to process cropped image.");
      }
    } catch (_error) {
      setClientSideUploadError("Error during cropping.");
    }
  };

  if (!open || !imageToCropSrc) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onCropCancel();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Crop your new avatar</DialogTitle>
        </DialogHeader>
        <div className="my-4 flex justify-center items-center max-h-[60vh] overflow-hidden">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
            circularCrop
            minWidth={50}
            minHeight={50}
            keepSelection
          >
            <img
              ref={imgRef}
              src={imageToCropSrc}
              alt="Crop preview"
              onLoad={onImageLoad}
              style={{ maxHeight: "50vh", objectFit: "contain" }}
            />
          </ReactCrop>
        </div>
        <DialogFooter className="gap-2 sm:justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={onCropCancel}
            disabled={uploadAvatarMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleCropConfirm}
            disabled={!completedCrop || uploadAvatarMutation.isPending}
          >
            {uploadAvatarMutation.isPending && (
              <HugeiconsIcon
                icon={Loading01Icon}
                size={18}
                className="mr-1 animate-spin"
              />
            )}
            Crop & Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
