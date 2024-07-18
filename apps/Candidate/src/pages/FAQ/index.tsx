import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';

import { faqSchema } from '../../schema/formValidations/Faq.schema';
import {
  Input,
  DatePicker,
  Select,
  TextArea,
  Button,
} from '@video-cv/ui-components';

type faqType = z.infer<typeof faqSchema>;

const FAQs = [
  {
    title: 'How to use Video CV',
    id: 'panel1',
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
    malesuada lacus ex, sit amet blandit leo lobortis eget.`,
  },
  {
    title: 'How to use Video CV 2',
    id: 'panel2',
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
    malesuada lacus ex, sit amet blandit leo lobortis eget.`,
  },
  {
    title: 'How to use Video CV 3',
    id: 'panel3',
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
    malesuada lacus ex, sit amet blandit leo lobortis eget.`,
  },
];

const FAQ = () => {
  const {
    register,
    handleSubmit,
    control,
    // watch,
    formState: { errors },
    // getValues,
  } = useForm<faqType>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      name: '',
      email: '',
      query: '',
    },
  });

  const onSubmit = (values: faqType) => {
    console.log('values', values);
  };

  const filterFAQ = () => {
    return;
  };

  return (
    <div className="min-h-screen p-6 flex flex-col gap-10">
      <section className="bg-white p-5 rounded-md flex flex-col gap-2">
        {FAQs.map(({ title, id, content }) => {
          return (
            <Accordion key={id}>
              <AccordionSummary
                className="bg-primary-100"
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${id}-content`}
                id={`${id}-header`}
              >
                {title}
              </AccordionSummary>
              <AccordionDetails>{content}</AccordionDetails>
            </Accordion>
          );
        })}
      </section>
      <section className="bg-white p-5 rounded-md">
        <h5 className="font-semibold text-lg">Ask Question</h5>
        <p className="">
          If your query not clarified, Post your question. My customer support
          will attend to you
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="">
          <div className="flex flex-col gap-2 py-6">
            <Input
              label="Name"
              placeholder="Full Name"
              {...register('name')}
              error={errors.name}
            />
            <Input
              label="Email"
              placeholder="email"
              {...register('email')}
              error={errors.email}
            />
            <TextArea
              label="Query"
              placeholder="Query"
              {...register('query')}
              error={errors.query}
            />
            <Button className="mt-6" label="Send Question" />
          </div>
        </form>
      </section>
    </div>
  );
};

export default FAQ;
