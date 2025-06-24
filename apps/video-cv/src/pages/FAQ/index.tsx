import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { faqSchema } from '../../../../Candidate/src/schema/formValidations/Faq.schema';
import { useAllMisc } from "../../../../../libs/hooks/useAllMisc";
import { Input, TextArea, Button, HtmlContent } from '@video-cv/ui-components';
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
    // page: 1,
    // limit: 10,
    download: true,
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
    <div className="min-h-screen p-6 mt-12 flex flex-col gap-10">
      <Typography variant='h5' className="text-center text-gray-600 mb-12">What can we help you find?</Typography>
      {isLoadingFaqs ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {faqs?.map((faq: any) => (
            <div key={faq.id} className={`${expanded && expanded === faq.id ? ' rounded-lg shadow-md bg-white' : ''}`}>
              <button
                className="w-full p-4 text-left flex justify-between items-center bg-black/90 text-white hover:bg-black rounded-t-lg"
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
                  <HtmlContent html={faq.answer}></HtmlContent>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FAQ;