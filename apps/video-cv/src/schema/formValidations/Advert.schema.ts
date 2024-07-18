import { z } from 'zod';

import { ErrorMessages } from '@video-cv/constants';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const advertSchema = z.object({
  adName: z
    .string({
      required_error: ErrorMessages.required('Ad Name'),
    })
    .min(1, ErrorMessages.required('AD Name')),
  adDescription: z
    .string({
      required_error: ErrorMessages.required('Ad Description'),
    })
    .min(1, ErrorMessages.required('description')),
  Image: z
    .any()
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max image size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    ),
  startDate: z.date(),
  endDate: z.date(),
});
