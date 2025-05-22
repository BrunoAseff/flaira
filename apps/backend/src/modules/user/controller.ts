import type { Context } from "hono";
import { getBody, getHeaders, getResponse } from "@/utils/http";
import { uploadUserAvatar } from "./service";

export const uploadAvatar = async (context: Context) => {
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
