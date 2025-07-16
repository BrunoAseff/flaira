import { useMutation } from '@tanstack/react-query';
import { auth } from '@/auth/client';
import type { User } from 'better-auth/types';
import type { QueryClient } from '@tanstack/react-query';

interface UseAvatarMutationsProps {
  user: User | null;
  queryClient: QueryClient;
  setClientSideUploadError: (error: string | null) => void;
  setOptimisticAvatarUrl: (url: string | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  setCropModalOpen: (open: boolean) => void;
}

export function useAvatarMutations({
  user,
  queryClient,
  setClientSideUploadError,
  setOptimisticAvatarUrl,
  fileInputRef,
  setCropModalOpen,
}: UseAvatarMutationsProps) {
  const deleteS3ObjectMutation = useMutation({
    mutationFn: async (key: string) => {
      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_URL}/user/delete-avatar`
      );
      url.searchParams.append('key', key);
      const response = await fetch(url.toString(), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 'Failed to delete avatar from storage.'
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
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ fileName, type }),
        }
      );
      if (!presignedUrlResponse.ok) {
        const errorData = await presignedUrlResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to get upload URL.');
      }
      const { url: S3UploadUrl, key: newImageKey } = (
        await presignedUrlResponse.json()
      ).data;

      const uploadResponse = await fetch(S3UploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': type },
        body: file,
      });
      if (!uploadResponse.ok) {
        throw new Error('File upload to storage failed.');
      }

      const oldImageKey = user?.image;
      if (oldImageKey && oldImageKey !== newImageKey) {
        deleteS3ObjectMutation.mutate(oldImageKey, {
          onError: (error) =>
            console.error(
              'Failed to delete old S3 object during update:',
              error
            ),
        });
      }

      const updateUserResponse = await auth.updateUser({ image: newImageKey });
      if (updateUserResponse.error) {
        try {
          await deleteS3ObjectMutation.mutateAsync(newImageKey);
        } catch (cleanupError) {
          console.error(
            'Failed to clean up newly uploaded avatar after DB update failure:',
            cleanupError
          );
        }
        throw new Error(
          updateUserResponse.error.message || 'Failed to update user profile.'
        );
      }
      return updateUserResponse.data;
    },
    onMutate: async (file: File) => {
      const localUrl = URL.createObjectURL(file);
      setOptimisticAvatarUrl(localUrl);

      await queryClient.cancelQueries({
        queryKey: ['avatar-url', user?.id, user?.image],
      });
      const previousImageUrl = queryClient.getQueryData([
        'avatar-url',
        user?.id,
        user?.image,
      ]);
      queryClient.setQueryData(['avatar-url', user?.id, user?.image], localUrl);
      return { localUrl, previousImageUrl };
    },
    onSuccess: (_data, _variables, _context) => {
      queryClient.invalidateQueries({ queryKey: ['currentSession'] });
      queryClient.invalidateQueries({ queryKey: ['avatar-url'], exact: false });
    },
    onError: (error, _variables, context) => {
      setClientSideUploadError(error.message || 'Avatar upload failed.');
      if (context?.localUrl) {
        URL.revokeObjectURL(context.localUrl);
      }
      if (context?.previousImageUrl) {
        queryClient.setQueryData(
          ['avatar-url', user?.id, user?.image],
          context.previousImageUrl
        );
      }
      setOptimisticAvatarUrl(null);
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.localUrl) {
        URL.revokeObjectURL(context.localUrl);
      }
      if (fileInputRef && fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setCropModalOpen(false);
      setOptimisticAvatarUrl(null);
    },
  });

  const removeAvatarMutation = useMutation({
    mutationFn: async () => {
      if (!user?.image) {
        throw new Error('No avatar to remove.');
      }
      const imageKeyToRemove = user.image;

      const updateUserResponse = await auth.updateUser({ image: null });
      if (updateUserResponse.error) {
        throw new Error(
          updateUserResponse.error.message ||
            'Failed to update user profile before removing avatar.'
        );
      }
      try {
        await deleteS3ObjectMutation.mutateAsync(imageKeyToRemove);
      } catch (s3Error) {
        console.error(
          'Failed to delete avatar from S3, but user record was updated.',
          s3Error
        );
      }
      return updateUserResponse.data;
    },
    onMutate: async () => {
      setOptimisticAvatarUrl(null);

      await queryClient.cancelQueries({
        queryKey: ['avatar-url', user?.id, user?.image],
      });
      const previousImageUrl = queryClient.getQueryData([
        'avatar-url',
        user?.id,
        user?.image,
      ]);
      queryClient.setQueryData(['avatar-url', user?.id, user?.image], null);
      return { previousImageUrl };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentSession'] });
      queryClient.invalidateQueries({ queryKey: ['avatar-url'] });
      setClientSideUploadError(null);
    },
    onError: (error, _variables, context) => {
      setClientSideUploadError(error.message || 'Failed to remove avatar.');
      if (context?.previousImageUrl) {
        queryClient.setQueryData(
          ['avatar-url', user?.id, user?.image],
          context.previousImageUrl
        );
      }
    },
  });

  return {
    uploadAvatarMutation,
    removeAvatarMutation,
  };
}
