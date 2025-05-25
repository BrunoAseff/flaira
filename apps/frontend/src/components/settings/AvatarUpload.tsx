"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  User03Icon,
  PaintBrush01Icon,
  Loading01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { Input } from "../ui/input";
import { auth } from "@/auth/client";
import { useState, type ChangeEvent, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "better-auth/types";
import { Banner } from "../ui/banner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function AvatarUpload({ user }: { user: User | null }) {
  const queryClient = useQueryClient();
  const [clientSideUploadError, setClientSideUploadError] = useState<
    string | null
  >(null);
  const [optimisticAvatarUrl, setOptimisticAvatarUrl] = useState<string | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: imageUrl, isLoading: isImageUrlLoading } = useQuery({
    queryKey: ["image-url", user?.id, user?.image],
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
    enabled: !!user && !!user.image,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const deleteS3ObjectMutation = useMutation({
    mutationFn: async (key: string) => {
      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_URL}/user/delete-avatar`,
      );
      url.searchParams.append("key", key);
      const response = await fetch(url.toString(), {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to delete avatar from storage.",
        );
      }
      return response.json();
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      setClientSideUploadError(null);
      const fileName = encodeURIComponent(file.name);
      const type = file.type;

      const presignedUrlResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/upload-avatar`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ fileName, type }),
        },
      );
      if (!presignedUrlResponse.ok) {
        const errorData = await presignedUrlResponse.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to get upload URL.");
      }
      const { url: S3UploadUrl, key: newImageKey } = (
        await presignedUrlResponse.json()
      ).data;

      const uploadResponse = await fetch(S3UploadUrl, {
        method: "PUT",
        headers: { "Content-Type": type },
        body: file,
      });
      if (!uploadResponse.ok) {
        throw new Error("File upload to storage failed.");
      }

      const oldImageKey = user?.image;
      if (oldImageKey && oldImageKey !== newImageKey) {
        await deleteS3ObjectMutation.mutateAsync(oldImageKey);
      }

      const updateUserResponse = await auth.updateUser({ image: newImageKey });
      if (updateUserResponse.error) {
        try {
          await deleteS3ObjectMutation.mutateAsync(newImageKey);
        } catch (cleanupError) {
          console.error(
            "Failed to clean up newly uploaded avatar after DB update failure:",
            cleanupError,
          );
        }
        throw new Error(
          updateUserResponse.error.message || "Failed to update user profile.",
        );
      }
      return updateUserResponse.data;
    },
    onMutate: async (file: File) => {
      const localUrl = URL.createObjectURL(file);
      setOptimisticAvatarUrl(localUrl);
      await queryClient.cancelQueries({
        queryKey: ["image-url", user?.id, user?.image],
      });
      return { localUrl };
    },
    onSuccess: (_data, _variables, _context) => {
      queryClient.invalidateQueries({ queryKey: ["currentSession"] });
      queryClient.invalidateQueries({ queryKey: ["image-url"] });
      setOptimisticAvatarUrl(null);
    },
    onError: (error, _variables, context) => {
      setClientSideUploadError(error.message || "Avatar upload failed.");
      if (context?.localUrl) {
        URL.revokeObjectURL(context.localUrl);
      }
      setOptimisticAvatarUrl(null);
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.localUrl) {
        URL.revokeObjectURL(context.localUrl);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
  });

  const removeAvatarMutation = useMutation({
    mutationFn: async () => {
      if (!user?.image) {
        throw new Error("No avatar to remove.");
      }
      const imageKeyToRemove = user.image;

      await deleteS3ObjectMutation.mutateAsync(imageKeyToRemove);

      const updateUserResponse = await auth.updateUser({ image: null });
      if (updateUserResponse.error) {
        throw new Error(
          updateUserResponse.error.message ||
            "Failed to update user profile after removing avatar.",
        );
      }
      return updateUserResponse.data;
    },
    onMutate: async () => {
      setOptimisticAvatarUrl(null);
      await queryClient.cancelQueries({
        queryKey: ["image-url", user?.id, user?.image],
      });
      const previousImageUrl = queryClient.getQueryData([
        "image-url",
        user?.id,
        user?.image,
      ]);
      queryClient.setQueryData(["image-url", user?.id, user?.image], null);
      return { previousImageUrl };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentSession"] });
      queryClient.invalidateQueries({ queryKey: ["image-url"] });
      setOptimisticAvatarUrl(null);
      setClientSideUploadError(null);
    },
    onError: (error, _variables, context) => {
      setClientSideUploadError(error.message || "Failed to remove avatar.");
      if (context?.previousImageUrl) {
        queryClient.setQueryData(
          ["image-url", user?.id, user?.image],
          context.previousImageUrl,
        );
      }
    },
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
      uploadAvatarMutation.mutate(file);
    }
    if (event.target) {
      event.target.value = "";
    }
  };

  const handleUpdateAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveAvatarClick = () => {
    if (user?.image) {
      removeAvatarMutation.mutate();
    } else {
      setClientSideUploadError("No avatar to remove.");
    }
  };

  const displayImageSrc =
    optimisticAvatarUrl !== null ? optimisticAvatarUrl : imageUrl;
  const showRemoveOption = !!(user?.image || optimisticAvatarUrl);
  const isActionPending =
    uploadAvatarMutation.isPending ||
    removeAvatarMutation.isPending ||
    isImageUrlLoading;

  return (
    <div className="flex flex-col items-center gap-3 pt-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={isActionPending}>
          <div className="relative group cursor-pointer">
            {" "}
            <Avatar className="size-24 border-2 border-muted">
              <AvatarImage
                src={displayImageSrc || ""}
                alt={`${user?.name || "User"}'s profile picture`}
                key={displayImageSrc}
              />
              <AvatarFallback className="bg-background text-foreground size-full">
                {isActionPending && !optimisticAvatarUrl ? (
                  <HugeiconsIcon
                    icon={Loading01Icon}
                    className="text-primary"
                    size={32}
                  />
                ) : (
                  <HugeiconsIcon
                    icon={User03Icon}
                    color="currentColor"
                    strokeWidth={1.5}
                    size={48}
                  />
                )}
              </AvatarFallback>
            </Avatar>
            {!isActionPending && !optimisticAvatarUrl && (
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center bg-primary-foreground/80 text-primary rounded-full",
                  "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                )}
              >
                <HugeiconsIcon icon={PaintBrush01Icon} size={32} />
              </div>
            )}
            {uploadAvatarMutation.isPending && optimisticAvatarUrl && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/60 rounded-full">
                <HugeiconsIcon
                  icon={Loading01Icon}
                  className="animate-spin text-primary"
                  size={32}
                />
              </div>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuItem
            onClick={handleUpdateAvatarClick}
            disabled={isActionPending}
            className="group flex items-center justify-between"
          >
            <HugeiconsIcon
              icon={PaintBrush01Icon}
              className="text-foreground/70 group-hover:text-foreground"
              strokeWidth={2}
              size={18}
            />
            <span>Update avatar</span>
          </DropdownMenuItem>

          {showRemoveOption && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleRemoveAvatarClick}
                disabled={isActionPending || removeAvatarMutation.isPending}
                className="group flex items-center justify-between"
                variant="destructive"
              >
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} size={18} />
                <span>Remove avatar</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Input
        id="avatarUpload"
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/png, image/jpeg, image/webp, image/jpg"
        onChange={handleFileChange}
        disabled={uploadAvatarMutation.isPending}
      />

      {(uploadAvatarMutation.isError ||
        removeAvatarMutation.isError ||
        clientSideUploadError) && (
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
