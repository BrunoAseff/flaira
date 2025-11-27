import type { SessionResponse } from './api';

/**
 * Database connection status from `/status` endpoint.
 */
export interface DatabaseStatus {
  connected: boolean;
  timestamp: string;
}

/**
 * Request body for uploading user avatar.
 */
export interface UploadAvatarRequest {
  fileName: string;
  type: string;
}

/**
 * Response from `/user/upload-avatar` endpoint.
 *
 * Contains pre-signed S3 upload URL and object key.
 */
export interface UploadAvatarResponse {
  url: string;
  key: string;
}

/**
 * Response from `/user/get-avatar` endpoint.
 *
 * Contains pre-signed S3 download URL for the user's avatar.
 */
export interface GetAvatarResponse {
  url: string;
}

/**
 * Request body for Mapbox directions API.
 */
export interface DirectionsRequest {
  coordinates: number[][];
  profile: 'driving' | 'walking' | 'cycling';
}

/**
 * Response from `/directions` endpoint using Mapbox API.
 */
export interface DirectionsResponse {
  routes: Array<{
    distance: number;
    duration: number;
    geometry: {
      coordinates: number[][];
      type: string;
    };
  }>;
  waypoints: Array<{
    name: string;
    location: number[];
  }>;
}

/**
 * Request body for creating a new trip.
 */
export interface CreateTripRequest {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  destination: string;
}

/**
 * Trip object returned from trip endpoints.
 */
export interface Trip {
  id: string;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  destination: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Request body for uploading a memory file.
 */
export interface UploadMemoryRequest {
  fileName: string;
  type: string;
}

/**
 * Response from `/memory/upload-memory` endpoint.
 *
 * Contains pre-signed S3 upload URL and object key.
 */
export interface UploadMemoryResponse {
  url: string;
  key: string;
}

/**
 * Query parameters for getting a specific memory.
 */
export interface GetMemoryRequest {
  key: string;
}

/**
 * Response from `/memory/get-memory` endpoint.
 *
 * Contains pre-signed S3 download URL.
 */
export interface GetMemoryResponse {
  url: string;
}

/**
 * Memory object with associated trip information.
 */
export interface Memory {
  id: string;
  s3Key: string;
  type: 'image' | 'video' | 'audio';
  tripId: string;
  tripDayId: string | null;
  uploadedBy: string;
  url: string;
}

/**
 * Response from `/memory/get-random-memories` endpoint.
 */
export interface GetRandomMemoriesResponse {
  memories: Memory[];
}

/**
 * Query parameters for deleting a memory.
 */
export interface DeleteMemoryRequest {
  key: string;
}

/**
 * Request body for user sign up.
 */
export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
}

/**
 * Request body for user sign in.
 */
export interface SignInRequest {
  email: string;
  password: string;
}

/**
 * Request body for changing user password.
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * Request body for updating user information.
 */
export interface UpdateUserRequest {
  name?: string;
  image?: string;
}

/**
 * Request body for requesting password reset email.
 */
export interface RequestPasswordResetRequest {
  email: string;
}

/**
 * Request body for resetting password with token.
 */
export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export type { SessionResponse };
