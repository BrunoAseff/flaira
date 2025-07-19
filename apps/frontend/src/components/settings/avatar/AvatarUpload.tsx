'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { User } from 'better-auth/types';
import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import AvatarDisplay from './AvatarDisplay';
import { Input } from '@/components/ui/input';
import ImageCropDialog from './ImageCropDialog';
import { useAvatarMutations } from '@/hooks/use-avatar';
import { Banner } from '@/components/ui/banner';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
];
const AVATAR_URL_CACHE_TIME = Number.POSITIVE_INFINITY;
const OPTIMISTIC_CLEAR_DELAY = 100;

interface AvatarUploadProps {
  user: User | null;
}

export default function AvatarUpload({ user }: AvatarUploadProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [clientSideError, setClientSideError] = useState<string | null>(null);
  const [optimisticAvatarUrl, setOptimisticAvatarUrl] = useState<string | null>(
    null
  );

  const [imageToCropSrc, setImageToCropSrc] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  const { data: avatarUrl, isLoading: isAvatarUrlLoading } = useQuery({
    queryKey: ['avatar-url', user?.id, user?.image],
    queryFn: fetchAvatarUrl,
    enabled: shouldFetchAvatarUrl(),
    staleTime: AVATAR_URL_CACHE_TIME,
    retry: 2,
    refetchOnMount: !optimisticAvatarUrl,
    refetchOnWindowFocus: !optimisticAvatarUrl,
    refetchOnReconnect: !optimisticAvatarUrl,
    placeholderData: (previousData) => previousData,
  });

  const { uploadAvatarMutation, removeAvatarMutation } = useAvatarMutations({
    user,
    queryClient,
    setClientSideUploadError: setClientSideError,
    setOptimisticAvatarUrl: handleOptimisticAvatarUpdate,
    fileInputRef,
    setCropModalOpen: setIsCropModalOpen,
  });

  async function fetchAvatarUrl() {
    if (!user?.image) return null;

    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/user/get-avatar`);
    url.searchParams.append('key', user.image);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      console.error('Failed to fetch avatar URL:', response.status);
      return null;
    }

    const data = await response.json();
    return data.data || null;
  }

  function shouldFetchAvatarUrl(): boolean {
    return !!user && !!user.image && !optimisticAvatarUrl;
  }

  function handleOptimisticAvatarUpdate(url: string | null) {
    setOptimisticAvatarUrl(url);
    if (url) {
      queryClient.cancelQueries({ queryKey: ['avatar-url', user?.id] });
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setClientSideError(validationError);
      uploadAvatarMutation.reset();
      return;
    }
    setClientSideError(null);
    setOriginalFile(file);
    setImageToCropSrc(URL.createObjectURL(file));
    setIsCropModalOpen(true);
  }

  function handleUpdateAvatarClick() {
    fileInputRef.current?.click();
  }

  function handleRemoveAvatarClick() {
    if (user?.image || optimisticAvatarUrl) {
      removeAvatarMutation.mutate();
    }
  }

  function handleCropConfirm(croppedImageFile: File) {
    setIsCropModalOpen(false);
    uploadAvatarMutation.mutate(croppedImageFile);
  }

  function handleCropCancel() {
    setIsCropModalOpen(false);
    cleanupImageResources();
    resetFileInput();
    setOriginalFile(null);
  }

  function validateFile(file: File): string | null {
    if (file.size > MAX_FILE_SIZE) {
      return 'File is too large (max 5MB).';
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'Invalid file type. Please use JPG, PNG, or WEBP.';
    }

    return null;
  }

  function cleanupImageResources() {
    if (imageToCropSrc) {
      URL.revokeObjectURL(imageToCropSrc);
      setImageToCropSrc(null);
    }
  }

  function resetFileInput() {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  const displayImageSrc = optimisticAvatarUrl || avatarUrl;
  const showRemoveOption = !!(user?.image || optimisticAvatarUrl);
  const isActionPending =
    uploadAvatarMutation.isPending ||
    removeAvatarMutation.isPending ||
    (isAvatarUrlLoading && !optimisticAvatarUrl);

  const hasError =
    uploadAvatarMutation.isError ||
    removeAvatarMutation.isError ||
    !!clientSideError;

  const errorMessage =
    clientSideError ||
    uploadAvatarMutation.error?.message ||
    removeAvatarMutation.error?.message ||
    'An error occurred.';

  useEffect(() => {
    return () => {
      if (optimisticAvatarUrl && optimisticAvatarUrl.startsWith('blob:')) {
        URL.revokeObjectURL(optimisticAvatarUrl);
      }
      if (imageToCropSrc) {
        URL.revokeObjectURL(imageToCropSrc);
      }
    };
  }, [optimisticAvatarUrl, imageToCropSrc]);

  useEffect(() => {
    if (
      optimisticAvatarUrl &&
      !uploadAvatarMutation.isPending &&
      !uploadAvatarMutation.isError
    ) {
      const timer = setTimeout(() => {
        setOptimisticAvatarUrl(null);
      }, OPTIMISTIC_CLEAR_DELAY);

      return () => clearTimeout(timer);
    }
  }, [
    optimisticAvatarUrl,
    uploadAvatarMutation.isPending,
    uploadAvatarMutation.isError,
  ]);

  return (
    <div className="flex flex-col items-center gap-3 pt-6">
      <AvatarDisplay
        displayImageSrc={displayImageSrc}
        user={user}
        isActionPending={isActionPending}
        isImageUrlLoading={isAvatarUrlLoading && !optimisticAvatarUrl}
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
        showClear={false}
        disabled={uploadAvatarMutation.isPending || isCropModalOpen}
      />

      <ImageCropDialog
        open={isCropModalOpen}
        imageToCropSrc={imageToCropSrc}
        originalFile={originalFile}
        onCropConfirm={handleCropConfirm}
        onCropCancel={handleCropCancel}
        uploadAvatarMutation={uploadAvatarMutation}
        setClientSideUploadError={setClientSideError}
      />

      {hasError && (
        <Banner
          variant="error"
          className="w-full max-w-xs text-sm text-center mt-2"
        >
          {errorMessage}
        </Banner>
      )}
    </div>
  );
}
