import type { Context } from "hono";
import { getBody, getHeaders, getResponse } from "@/utils/http";
import { uploadUserAvatar, getUserAvatar, deleteUserAvatar } from "./service";
import { checkUser } from "@/utils/checkUser";

export const uploadAvatar = async (context: Context) => {
  const user = checkUser({ context });

  if (!user) {
    const headers = getHeaders();
    const body = getBody(401, null);
    return getResponse(context, 401, headers, body);
  }

  try {
    const { fileName, type } = await context.req.json();
    const result = await uploadUserAvatar({ fileName, type });

    const headers = getHeaders();
    const body = getBody(200, result);

    return getResponse(context, 200, headers, body);
  } catch (error) {
    console.error("Failed to upload profile picture", error);

    const headers = getHeaders();
    const body = getBody(500, null, error);

    return getResponse(context, 500, headers, body);
  }
};

export const getAvatar = async (context: Context) => {
  const user = checkUser({ context });

  if (!user) {
    const headers = getHeaders();
    const body = getBody(401, null);
    return getResponse(context, 401, headers, body);
  }

  try {
    const { key } = await context.req.json();
    const result = await getUserAvatar({ key });

    const headers = getHeaders();
    const body = getBody(200, result);

    return getResponse(context, 200, headers, body);
  } catch (error) {
    console.error("Failed to get profile picture", error);

    const headers = getHeaders();
    const body = getBody(500, null, error);

    return getResponse(context, 500, headers, body);
  }
};

export const deleteAvatar = async (context: Context) => {
  const user = checkUser({ context });

  if (!user) {
    const headers = getHeaders();
    const body = getBody(401, null);
    return getResponse(context, 401, headers, body);
  }

  try {
    const { key } = await context.req.json();
    const result = await deleteUserAvatar({ key });

    const headers = getHeaders();
    const body = getBody(200, result);

    return getResponse(context, 200, headers, body);
  } catch (error) {
    console.error("Failed to get profile picture", error);

    const headers = getHeaders();
    const body = getBody(500, null, error);

    return getResponse(context, 500, headers, body);
  }
};
