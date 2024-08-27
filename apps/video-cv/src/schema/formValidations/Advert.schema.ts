import { z } from 'zod';

import { ErrorMessages } from '@video-cv/constants';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'video/mp4',
  'video/mpeg',
];

export const advertSchema = z.object({
  adName: z
    .string({
      required_error: ErrorMessages.required('Ad Name'),
    })
    .min(1, ErrorMessages.required('Ad Name')),
  adDescription: z
    .string({
      required_error: ErrorMessages.required('Ad Description'),
    })
    .min(1, ErrorMessages.required('description')),
  adUrl: z
    .string({
      required_error: ErrorMessages.required('Ad Url'),
    })
    .min(1, ErrorMessages.required('Ad Url')),
  files: z
    .array(z.any())
    .min(1, ErrorMessages.required('At least one file is required.'))
    .refine(
      (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
      `Max file size is 5MB per file.`
    )
    .refine(
      (files) => files.every((file) => ACCEPTED_FILE_TYPES.includes(file.type)),
      'Only .jpg, .jpeg, .png, .webp, .mp4, and .mpeg formats are supported.'
    ),
  startDate: z.date(),
  endDate: z.date(),
});
