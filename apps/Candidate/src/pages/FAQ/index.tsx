import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { faqSchema } from '../../schema/formValidations/Faq.schema';
import { useAllMisc } from "./../../../../../libs/hooks/useAllMisc";
import { Input, TextArea, Button } from '@video-cv/ui-components';
import { Box, CircularProgress, Typography } from '@mui/material';

type faqType = z.infer<typeof faqSchema>;

const FAQ = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<faqType>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      name: '',
      email: '',
      query: '',
    },
  });

  const { data: faqs, isLoading: isLoadingFaqs } = useAllMisc({
    resource: "faq",
    page: 1,
    limit: 100,
    download: false,
    structureType: "data",
  });

  const [expanded, setExpanded] = useState<string | null>(null);

  const togglePanel = (panelId: string) => {
    setExpanded((prev) => (prev === panelId ? null : panelId));
  };

  const onSubmit = (values: faqType) => {
    console.log('values', values);
  };

  return (
    <div className="min-h-screen p-6 flex flex-col gap-10">
      <Typography variant='h5' className="text-center text-gray-600 mb-12">What can we help you find?</Typography>
      {isLoadingFaqs ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {faqs?.map((faq: any) => (
            <div key={faq.id} className={`${expanded && expanded === faq.id ? ' rounded-lg shadow-sm bg-white' : ''}`}>
              <button
                className="w-full p-4 text-left flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-t-lg"
                onClick={() => togglePanel(faq.id)}
              >
                <span className="font-medium text-primary-700">{faq.question}</span>
                <svg
                  className={`w-5 h-5 transition-transform transform ${
                    expanded === faq.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expanded && expanded === faq.id && (
                <div className={`${expanded && expanded === faq.id ? 'p-4 text-gray-700 bg-[rgba(0, 0, 0, 0.03)] rounded-lg' : 'bg-none hidden opacity-0'}`}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="bg-white p-8 rounded-lg shadow-md">
        <Typography variant="h5" className="font-semibold mb-4 text-primary-800">
          Ask a Question
        </Typography>
        <Typography className="text-gray-600 mb-6">
          If your query is not clarified, post your question. Our customer support team will attend to you.
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
          <Input label="Name" placeholder="Full Name" {...register("name")} error={errors.name} />
          <Input label="Email" placeholder="Email" {...register("email")} error={errors.email} />
          <TextArea
            label="Query"
            placeholder="Type your question here..."
            {...register("query")}
            error={errors.query}
          />
          <Button className="w-full md:w-auto" variant="black" label="Send Question" type="submit" />
        </form>
      </div>
    </div>
  );
};

export default FAQ;