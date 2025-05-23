"use client";

import { useState, type ChangeEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import type { User } from "better-auth/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  User03Icon,
  Loading02Icon,
  PaintBrush01Icon,
} from "@hugeicons/core-free-icons";
import { Banner } from "../ui/banner";
import { Input } from "../ui/input";
import { auth } from "@/auth/client";

interface ProfileTabProps {
  user: User | null;
  error: Error | null;
}

export default function ProfileTab({ user, error }: ProfileTabProps) {
  const queryClient = useQueryClient();
  const [clientSideUploadError, setClientSideUploadError] = useState<
    string | null
  >(null);
  const [optimisticAvatarUrl, setOptimisticAvatarUrl] = useState<string | null>(
    null,
  );

  const { data: imageUrl } = useQuery({
    queryKey: ["image-url", user?.image],
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
        throw new Error(
          `Failed to fetch avatar URL: ${presignedUrlResponse.status}`,
        );
      }

      const presignedUrlData = await presignedUrlResponse.json();
      return presignedUrlData.data || null;
    },
    enabled: !!user && !!user.image,
    staleTime: 5 * 60 * 1000,
    retry: 2,
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
        throw new Error(errorData.message || "Upload failed.");
      }

      const { url, key } = (await presignedUrlResponse.json()).data;

      const uploadResponse = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": type },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("File upload to storage failed.");
      }

      if (user?.image) {
        await deleteAvatarMutation.mutateAsync(user.image);
      }

      const updateUserResponse = await auth.updateUser({ image: key });
      if (updateUserResponse.error) {
        throw new Error(
          updateUserResponse.error.message || "Failed to update user profile.",
        );
      }

      return updateUserResponse.data;
    },

    onMutate: async (file: File) => {
      const localUrl = URL.createObjectURL(file);
      setOptimisticAvatarUrl(localUrl);
      return { localUrl };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentSession"] });
    },

    onError: (_error, _variables, _context?: { localUrl?: string }) => {},

    onSettled: (_data, _error, _variables, context?: { localUrl?: string }) => {
      if (context?.localUrl) {
        URL.revokeObjectURL(context.localUrl);
      }
      if (_error) {
        setOptimisticAvatarUrl(null);
      }
    },
  });

  const deleteAvatarMutation = useMutation({
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
        throw new Error(errorData.message || "Failed to delete avatar.");
      }

      return response.json();
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
          "Invalid file type. Please use JPG, PNG or WEBP.",
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

  if (error) {
    return (
      <div className="w-full mt-12 flex flex-col h-full items-center justify-center">
        <Banner variant="error">
          We could not load your profile information.
        </Banner>
      </div>
    );
  }

  const imageSrc = optimisticAvatarUrl || imageUrl || "";

  return (
    <div className="w-full flex flex-col h-full">
      <ScrollArea className="flex-1 pb-16 max-h-[85vh] scrollbar-gutter-stable overflow-y-auto">
        <div className="w-full py-0 px-4 pb-10">
          <div className="w-full flex flex-col gap-6">
            <div className="flex flex-col items-center gap-3 pt-6">
              <div className="relative group">
                <Avatar className="size-24 border-2 border-muted">
                  <AvatarImage
                    src={imageSrc}
                    alt={`${user?.name || "User"}'s profile picture`}
                  />
                  <AvatarFallback className="bg-background text-foreground size-full">
                    <HugeiconsIcon
                      icon={User03Icon}
                      color="currentColor"
                      strokeWidth={1.5}
                      size={48}
                    />
                  </AvatarFallback>
                </Avatar>
                {!uploadAvatarMutation.isPending && (
                  <label
                    htmlFor="avatarUpload"
                    className="absolute inset-0 flex items-center justify-center bg-muted text-primary text-xs font-medium rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <HugeiconsIcon
                      icon={PaintBrush01Icon}
                      className="text-primary"
                      size={32}
                    />
                  </label>
                )}
                {uploadAvatarMutation.isPending && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-full">
                    <HugeiconsIcon
                      icon={Loading02Icon}
                      className="animate-spin text-foreground"
                      size={32}
                    />
                  </div>
                )}
              </div>
              <Input
                id="avatarUpload"
                type="file"
                className="hidden"
                accept="image/png, image/jpeg, image/webp, image/jpg"
                onChange={handleFileChange}
                disabled={uploadAvatarMutation.isPending}
              />
              {(uploadAvatarMutation.isError || clientSideUploadError) && (
                <Banner
                  variant="error"
                  className="w-full max-w-sm text-sm text-center"
                >
                  {clientSideUploadError ||
                    uploadAvatarMutation.error?.message ||
                    "Avatar upload failed."}
                </Banner>
              )}
            </div>

            <Separator />

            <div className="flex w-full justify-between items-center">
              <h1 className="text-base font-bold text-foreground/90">Name</h1>
              <span className="text-sm text-foreground/80">
                {user?.name || "N/A"}
              </span>
            </div>

            <Separator />

            <div className="flex w-full justify-between items-center">
              <h1 className="text-base font-bold text-foreground/90">Email</h1>
              <span className="text-sm text-foreground/80">
                {user?.email || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
