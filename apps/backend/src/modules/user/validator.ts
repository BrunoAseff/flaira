import { z } from "zod";

export const uploadAvatarSchema = z.object({
  fileName: z
    .string()
    .min(1)
    .refine(
      (val) => !val.includes("..") && !val.includes("/") && !val.includes("\\"),
      {
        message: "Invalid filename",
      },
    ),
  type: z.string().regex(/^image\/(jpeg|png|gif)$/),
});
