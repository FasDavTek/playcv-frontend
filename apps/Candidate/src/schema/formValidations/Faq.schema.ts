import { z } from 'zod';

import { ErrorMessages } from '@video-cv/constants';

export const faqSchema = z.object({
  name: z
    .string({
      required_error: ErrorMessages.required('Name'),
    })
    .min(1, ErrorMessages.required('Name')),
  email: z
    .string({
      required_error: ErrorMessages.required('Email'),
    })
    .min(1, ErrorMessages.required('Email'))
    .email(),
  query: z
    .string({
      required_error: ErrorMessages.required('Email'),
    })
    .min(1, ErrorMessages.required('Query')),
});
