"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "better-auth/types";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import AvatarDisplay from "./AvatarDisplay";
import { Input } from "@/components/ui/input";
import ImageCropDialog from "./ImageCropDialog";
import { useAvatarMutations } from "@/hooks/use-avatar";
import { Banner } from "@/components/ui/banner";

export default function AvatarUpload({ user }: { user: User | null }) {
  const queryClient = useQueryClient();
  const [clientSideUploadError, setClientSideUploadError] = useState<
    string | null
  >(null);
  const [optimisticAvatarUrl, setOptimisticAvatarUrl] = useState<string | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageToCropSrc, setImageToCropSrc] = useState<string | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  const { data: imageUrl, isLoading: isImageUrlLoading } = useQuery({
    queryKey: ["avatar-url", user?.id, user?.image],
    queryFn: async () => {
      if (!user?.image) {
        return null;
      }
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/user/get-avatar`);
      url.searchParams.append("key", user.image);

      const presignedUrlResponse = await fetch(url.toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!presignedUrlResponse.ok) {
        console.error(
          "Failed to fetch avatar URL:",
          presignedUrlResponse.status,
        );
        return null;
      }
      const presignedUrlData = await presignedUrlResponse.json();
      return presignedUrlData.data || null;
    },
    enabled: !!user && !!user.image && !optimisticAvatarUrl,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const { uploadAvatarMutation, removeAvatarMutation } = useAvatarMutations({
    user,
    queryClient,
    setClientSideUploadError,
    setOptimisticAvatarUrl,
    fileInputRef,
    setCropModalOpen,
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setClientSideUploadError("File is too large (max 5MB).");
        uploadAvatarMutation.reset();
        return;
      }
      if (
        !["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(
          file.type,
        )
      ) {
        setClientSideUploadError(
          "Invalid file type. Please use JPG, PNG, or WEBP.",
        );
        uploadAvatarMutation.reset();
        return;
      }
      setClientSideUploadError(null);
      setOriginalFile(file);
      setImageToCropSrc(URL.createObjectURL(file));
      setCropModalOpen(true);
    }
  };

  const handleUpdateAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveAvatarClick = () => {
    if (user?.image || optimisticAvatarUrl) {
      removeAvatarMutation.mutate();
    } else {
      setClientSideUploadError("No avatar to remove.");
    }
  };

  const handleCropConfirm = (croppedImageFile: File) => {
    setCropModalOpen(false);
    uploadAvatarMutation.mutate(croppedImageFile);
  };

  const handleCropCancel = () => {
    setCropModalOpen(false);
    if (imageToCropSrc) {
      URL.revokeObjectURL(imageToCropSrc);
      setImageToCropSrc(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setOriginalFile(null);
  };

  useEffect(() => {
    return () => {
      // biome-ignore lint:
      if (optimisticAvatarUrl && optimisticAvatarUrl.startsWith("blob:")) {
        URL.revokeObjectURL(optimisticAvatarUrl);
      }
      if (imageToCropSrc) {
        URL.revokeObjectURL(imageToCropSrc);
      }
    };
  }, [optimisticAvatarUrl, imageToCropSrc]);

  const displayImageSrc = optimisticAvatarUrl || imageUrl;
  const showRemoveOption = !!(user?.image || optimisticAvatarUrl);
  const isActionPending =
    uploadAvatarMutation.isPending ||
    removeAvatarMutation.isPending ||
    isImageUrlLoading;

  return (
    <div className="flex flex-col items-center gap-3 pt-6">
      <AvatarDisplay
        displayImageSrc={displayImageSrc}
        user={user}
        isActionPending={isActionPending}
        isImageUrlLoading={isImageUrlLoading}
        optimisticAvatarUrl={optimisticAvatarUrl}
        uploadAvatarMutation={uploadAvatarMutation}
        showRemoveOption={showRemoveOption}
        onUpdateAvatarClick={handleUpdateAvatarClick}
        onRemoveAvatarClick={handleRemoveAvatarClick}
      />

      <Input
        id="avatarUpload"
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/png, image/jpeg, image/webp, image/jpg"
        onChange={handleFileChange}
        disabled={uploadAvatarMutation.isPending || cropModalOpen}
      />

      <ImageCropDialog
        open={cropModalOpen}
        imageToCropSrc={imageToCropSrc}
        originalFile={originalFile}
        onCropConfirm={handleCropConfirm}
        onCropCancel={handleCropCancel}
        uploadAvatarMutation={uploadAvatarMutation}
        setClientSideUploadError={setClientSideUploadError}
      />

      {(uploadAvatarMutation.isError ||
        removeAvatarMutation.isError ||
        !!clientSideUploadError) && (
        <Banner
          variant="error"
          className="w-full max-w-xs text-sm text-center mt-2"
        >
          {clientSideUploadError ||
            uploadAvatarMutation.error?.message ||
            removeAvatarMutation.error?.message ||
            "An error occurred."}
        </Banner>
      )}
    </div>
  );
}
