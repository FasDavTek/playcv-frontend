import { z } from 'zod';
import { ErrorMessages } from '@video-cv/constants';

// Define max file size and accepted file types
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];

// Define the schema for video uploads
export const videoUploadSchema = z.object({
  name: z
    .string({ required_error: ErrorMessages.required('Video Name') })
    .min(1, 'Video Name is required'),
  description: z
    .string({ required_error: ErrorMessages.required('Video Description') })
    .min(1, 'Video Description is required'),
  videoTranscript: z
    .string({ required_error: ErrorMessages.required('Video Transcript') })
    .min(1, 'Video Transcript is required'),
  Category: z
    .string({ required_error: ErrorMessages.required('Category') })
    .min(1, 'Category is required'),
  videoType: z.string({
    required_error: ErrorMessages.required('Video Type'),
  }).optional(),
  price: z.number({
    required_error: ErrorMessages.required('Video Price'),
  }).optional(),
  media: z.union([
    z.instanceof(File).refine(
      (file) => file instanceof File,
      'Please add a video file'
    ).refine(
      (file) =>{ return !file || file.size <= MAX_FILE_SIZE; },
      `Max video file size is ${MAX_FILE_SIZE}MB.`
    ).refine(
      (file) => ACCEPTED_VIDEO_TYPES.includes(file.type),
      "Only .mp4, .webm, and .ogg video files are accepted."
    ),
    z.array(z.instanceof(File)).refine(
      (files) => files.every((file) => file instanceof File),
      'Please add a video file'
    ),
    z.string().url("Invalid URL for media")
  ]).refine((value) => value !== undefined && value !== null, {
    message: ErrorMessages.required('Media'),
  }),
});
