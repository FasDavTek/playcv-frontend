import { z } from 'zod';

import { ErrorMessages } from '@video-cv/constants';
import dayjs from 'dayjs';

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"]

const isDayjs = (value: any): value is dayjs.Dayjs => {
  return dayjs.isDayjs(value);
};

export const advertSchema = z.object({
  action: z.string(),
  adId: z.number().optional(),
  statusId: z.number(),
  userId: z.string(),
  adName: z.string({required_error: ErrorMessages.required('Ad Name'),}).min(1, "Ad Name is required"),
  adDescription: z.string({required_error: ErrorMessages.required('Ad Description'),}).min(1, "Ad Description is required"),
  adUrl: z.string({required_error: ErrorMessages.required('Ad Url'),}).url("Must be a valid URL"),
  redirectUrl: z.string({required_error: ErrorMessages.required('Ad Url'),}).url("Must be a valid URL").optional(),
  adType: z.string({
    required_error: ErrorMessages.required("Ad Type"),
  }).optional(),
  adTypeId: z.number().optional(),
  files: z.union([
    z.instanceof(File)
      // .refine((file) => {
      //   return !file || file.size <= MAX_FILE_SIZE; }, `Max file size is 5MB.`)
      // .refine(
      //   (file) => {
      //     const fileType = file.type
      //     return (
      //       ACCEPTED_IMAGE_TYPES.includes(fileType) ||
      //       ACCEPTED_VIDEO_TYPES.includes(fileType)
      //     )
      //   },
      //   "Only .jpg, .jpeg, .png, .webp, .mp4, .mkv, .webm, and .ogg files are accepted."
      // ),
    .refine(
      (file) => {
        if (!file) return true;
        const maxSize = ACCEPTED_VIDEO_TYPES.includes(file.type) 
          ? 15 * 1024 * 1024 
          : 2 * 1024 * 1024;
        return file.size <= maxSize;
      },
      {
        message: "File size exceeds limit",
        params: (file: { type: any; }) => ({
          maxSize: ACCEPTED_VIDEO_TYPES.includes(file?.type || '') 
            ? "15MB" 
            : "2MB",
          fileType: file?.type || 'unknown'
        })
      }
    )
    .refine(
      (file) => {
        const fileType = file.type;
        return (
          ACCEPTED_IMAGE_TYPES.includes(fileType) ||
          ACCEPTED_VIDEO_TYPES.includes(fileType)
        );
      },
      "Only .jpg, .jpeg, .png, .webp, .mp4, .webm, and .ogg files are accepted."
    ),
    z.array(z.instanceof(File))
      .nonempty("At least one file is required")
      .min(1, ErrorMessages.required('At least one file is required.'))
      // .refine((files) => {
      //   return files.every((file) => {
      //     return !file || file.size <= MAX_FILE_SIZE;
      //   });
      // }, `Max file size is 5MB.`)
      // Validate video sizes
      .refine(
        (files) => files
          .filter(file => ACCEPTED_VIDEO_TYPES.includes(file.type))
          .every(file => file.size <= 15 * 1024 * 1024),
        'Max video file size is 15MB.'
      )
      // Validate image sizes
      .refine(
        (files) => files
          .filter(file => ACCEPTED_IMAGE_TYPES.includes(file.type))
          .every(file => file.size <= 2 * 1024 * 1024),
        'Max image file size is 2MB.'
      )
      .refine((files) => {
        return files.every((file) => {
          const fileType = file.type
          return (
            ACCEPTED_IMAGE_TYPES.includes(fileType) ||
            ACCEPTED_VIDEO_TYPES.includes(fileType)
          )
        });
      }, "Only .jpg, .jpeg, .png, .webp, .mp4, .mkv, .webm, and .ogg files are accepted.")
  ]),
  startDate: z.custom(isDayjs, {
    message: "Invalid date",
  }),
});
