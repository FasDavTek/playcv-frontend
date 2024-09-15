import { z } from 'zod';

import { ErrorMessages } from '@video-cv/constants';

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"]

export const advertSchema = z.object({
  adName: z.string({required_error: ErrorMessages.required('Ad Name'),}).min(1, "Ad Name is required"),
  adDescription: z.string({required_error: ErrorMessages.required('Ad Description'),}).min(1, "Ad Description is required"),
  adUrl: z.string({required_error: ErrorMessages.required('Ad Url'),}).url("Must be a valid URL"),
  adType: z.enum(["video", "image"]),
  files: z.array(
    z.object({
      file: z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine(
          (file) => {
            const fileType = file.type
            return (
              ACCEPTED_IMAGE_TYPES.includes(fileType) ||
              ACCEPTED_VIDEO_TYPES.includes(fileType)
            )
          },
          "Only .jpg, .jpeg, .png, .webp, .mp4, .webm, and .ogg files are accepted."
        ),
    })
  ).nonempty("At least one file is required")
  .min(1, ErrorMessages.required('At least one file is required.')),
  startDate: z.date(),
  endDate: z.date(),
});
