import { z } from "zod";

export const uploadAvatarSchema = z.object({
  fileName: z.string().min(1),
  type: z.string().regex(/^image\/(jpeg|png|gif)$/),
});
