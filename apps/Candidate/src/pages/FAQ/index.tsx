// import React, { useState } from 'react';

// import Box from '@mui/material/Box';
// import Accordion from '@mui/material/Accordion';
// import AccordionActions from '@mui/material/AccordionActions';
// import AccordionSummary from '@mui/material/AccordionSummary';
// import AccordionDetails from '@mui/material/AccordionDetails';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm, Controller } from 'react-hook-form';
// import { z } from 'zod';

// import { faqSchema } from '../../schema/formValidations/Faq.schema';
// import { useAllMisc } from "./../../../../../libs/hooks/useAllMisc"
// import { Input, DatePicker, Select, TextArea, Button } from '@video-cv/ui-components';
// import { CircularProgress, Typography } from '@mui/material';

// type faqType = z.infer<typeof faqSchema>;

// const FAQs = [
//   {
//     title: 'How to use Video CV',
//     id: 'panel1',
//     content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
//     malesuada lacus ex, sit amet blandit leo lobortis eget.`,
//   },
//   {
//     title: 'How to use Video CV 2',
//     id: 'panel2',
//     content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
//     malesuada lacus ex, sit amet blandit leo lobortis eget.`,
//   },
//   {
//     title: 'How to use Video CV 3',
//     id: 'panel3',
//     content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
//     malesuada lacus ex, sit amet blandit leo lobortis eget.`,
//   },
// ];

// const FAQ = () => {
//   const { register, handleSubmit, control, formState: { errors } } = useForm<faqType>({
//     resolver: zodResolver(faqSchema),
//     defaultValues: {
//       name: '',
//       email: '',
//       query: '',
//     },
//   });

//   const { data: faqs, isLoading: isLoadingFaqs } = useAllMisc({
//     resource: "faq",
//     page: 1,
//     limit: 100,
//     download: false,
//     structureType: "data",
//   });

//   console.log(faqs);

//   const [expandedPanel, setExpandedPanel] = useState<string | false>(false)

//   const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
//     setExpandedPanel(isExpanded ? panel : false)
//   }

//   const onSubmit = (values: faqType) => {
//     console.log('values', values);
//   };

//   return (
//     <div className="min-h-screen p-6 flex flex-col gap-10">
//       <Typography variant='h5' className="text-center text-gray-600 mb-12">What can we help you find?</Typography>
//       {isLoadingFaqs ? (
//         <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
//           <CircularProgress />
//         </Box>
//       ) : (
//         <Box className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
//           {faqs?.map((faq: any) => (
//             <Accordion
//               key={faq.id}
//               expanded={expandedPanel === `panel${faq.id}`}
//               onChange={handleChange(`panel${faq.id}`)}
//               sx={{
//                 borderRadius: "8px",
//                 boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//                 "&:before": {
//                   display: "none",
//                 },
//               }}
//             >
//               <AccordionSummary
//                 expandIcon={<ExpandMoreIcon />}
//                 aria-controls={`panel${faq.id}-content`}
//                 id={`panel${faq.id}-header`}
//                 sx={{
//                   backgroundColor: "rgba(0, 0, 0, 0.03)",
//                   borderRadius: "8px 8px 0 0",
//                   "&.Mui-expanded": {
//                     borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
//                   },
//                 }}
//               >
//                 <Typography className="font-semibold text-primary-700">{faq.question}</Typography>
//               </AccordionSummary>
//               <AccordionDetails>
//                 <Typography className="text-gray-700">{faq.answer}</Typography>
//               </AccordionDetails>
//             </Accordion>
//           ))}
//         </Box>
//       )}


//       <Box className="bg-white p-8 rounded-lg shadow-md">
//         <Typography variant="h5" className="font-semibold mb-4 text-primary-800">
//           Ask a Question
//         </Typography>
//         <Typography className="text-gray-600 mb-6">
//           If your query is not clarified, post your question. Our customer support team will attend to you.
//         </Typography>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
//           <Input label="Name" placeholder="Full Name" {...register("name")} error={errors.name} />
//           <Input label="Email" placeholder="Email" {...register("email")} error={errors.email} />
//           <TextArea
//             label="Query"
//             placeholder="Type your question here..."
//             {...register("query")}
//             error={errors.query}
//           />
//           <Button className="w-full md:w-auto" variant="black" label="Send Question" type="submit" />
//         </form>
//       </Box>
//       {/* <section className="bg-transparent p-5 rounded-md grid grid-cols-1 md:grid-cols-2 gap-2">
//         {FAQs.map(({ title, id, content }) => {
//           return (
//             <Accordion key={id} sx={{ borderRadius: '8px', boxShadow: 'lg' }}>
//               <AccordionSummary
//                 className="bg-primary-100 rounded-xl"
//                 expandIcon={<ExpandMoreIcon />}
//                 aria-controls={`${id}-content`}
//                 id={`${id}-header`}
//               >
//                 {title}
//               </AccordionSummary>
//               <AccordionDetails>{content}</AccordionDetails>
//             </Accordion>
//           );
//         })}
//       </section> */}
//       {/* <section className="bg-white p-5 rounded-md">
//         <h5 className="font-semibold text-lg">Ask Question</h5>
//         <p className="">
//           If your query not clarified, Post your question. My customer support
//           will attend to you
//         </p>
//         <form onSubmit={handleSubmit(onSubmit)} className="">
//           <div className="flex flex-col gap-2 py-6">
//             <Input
//               label="Name"
//               placeholder="Full Name"
//               {...register('name')}
//               error={errors.name}
//             />
//             <Input
//               label="Email"
//               placeholder="email"
//               {...register('email')}
//               error={errors.email}
//             />
//             <TextArea
//               label="Query"
//               placeholder="Query"
//               {...register('query')}
//               error={errors.query}
//             />
//             <Button className="mt-6" variant='black' label="Send Question" />
//           </div>
//         </form>
//       </section> */}
//     </div>
//   );
// };

// export default FAQ;










// import React, { useState } from 'react';
// import Box from '@mui/material/Box';
// import Accordion from '@mui/material/Accordion';
// import AccordionSummary from '@mui/material/AccordionSummary';
// import AccordionDetails from '@mui/material/AccordionDetails';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { faqSchema } from '../../schema/formValidations/Faq.schema';
// import { useAllMisc } from "./../../../../../libs/hooks/useAllMisc";
// import { Input, TextArea, Button } from '@video-cv/ui-components';
// import { CircularProgress, Typography } from '@mui/material';

// type faqType = z.infer<typeof faqSchema>;

// const FAQ = () => {
//   const { register, handleSubmit, formState: { errors } } = useForm<faqType>({
//     resolver: zodResolver(faqSchema),
//     defaultValues: {
//       name: '',
//       email: '',
//       query: '',
//     },
//   });

//   const { data: faqs, isLoading: isLoadingFaqs } = useAllMisc({
//     resource: "faq",
//     page: 1,
//     limit: 100,
//     download: false,
//     structureType: "data",
//   });

//   console.log(faqs)

//   const [expandedPanel, setExpandedPanel] = useState<string | false>(false);

//   const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
//     if (isExpanded) {
//       console.log(`Opened accordion ID: ${panel}`);
//     }
//     setExpandedPanel(isExpanded ? panel : false);
//   };

//   const onSubmit = (values: faqType) => {
//     console.log('values', values);
//   };

//   return (
//     <div className="min-h-screen p-6 flex flex-col gap-10">
//       <Typography variant='h5' className="text-center text-gray-600 mb-12">What can we help you find?</Typography>
//       {isLoadingFaqs ? (
//         <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
//           <CircularProgress />
//         </Box>
//       ) : (
//         <Box className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
//           {faqs?.map((faq: any) => (
//             <Accordion
//               key={faq.id}
//               expanded={expandedPanel === `panel${faq.id}`}
//               onChange={handleChange(`panel${faq.id}`)}
//               sx={{
//                 borderRadius: "8px",
//                 boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//                 "&:before": {
//                   display: "none",
//                 },
//               }}
//             >
//               <AccordionSummary
//                 expandIcon={<ExpandMoreIcon />}
//                 aria-controls={`panel${faq.id}-content`}
//                 id={`panel${faq.id}-header`}
//                 sx={{
//                   backgroundColor: "rgba(0, 0, 0, 0.03)",
//                   borderRadius: "8px 8px 0 0",
//                   "&.Mui-expanded": {
//                     borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
//                   },
//                 }}
//               >
//                 <Typography className="font-semibold text-primary-700">{faq.question}</Typography>
//               </AccordionSummary>
//               <AccordionDetails sx={{
//                   display: expandedPanel === `panel${faq.id}` ? "block" : "none",
//                   backgroundColor: "white",
//                   padding: "16px",
//                 }}
//               >
//                 <Typography className="text-gray-700">{faq.answer}</Typography>
//               </AccordionDetails>
//             </Accordion>
//           ))}
//         </Box>
//       )}

//       <Box className="bg-white p-8 rounded-lg shadow-md">
//         <Typography variant="h5" className="font-semibold mb-4 text-primary-800">
//           Ask a Question
//         </Typography>
//         <Typography className="text-gray-600 mb-6">
//           If your query is not clarified, post your question. Our customer support team will attend to you.
//         </Typography>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
//           <Input label="Name" placeholder="Full Name" {...register("name")} error={errors.name} />
//           <Input label="Email" placeholder="Email" {...register("email")} error={errors.email} />
//           <TextArea
//             label="Query"
//             placeholder="Type your question here..."
//             {...register("query")}
//             error={errors.query}
//           />
//           <Button className="w-full md:w-auto" variant="black" label="Send Question" type="submit" />
//         </form>
//       </Box>
//     </div>
//   );
// };

// export default FAQ;


















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

  const [expandedPanel, setExpandedPanel] = useState<string | null>(null);

  const togglePanel = (panelId: string) => {
    setExpandedPanel((prev) => (prev === panelId ? null : panelId));
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
            <div key={faq.id} className="border rounded-lg shadow-sm">
              <button
                className="w-full p-4 text-left flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-t-lg"
                onClick={() => togglePanel(faq.id)}
              >
                <span className="font-semibold text-primary-700">{faq.question}</span>
                <svg
                  className={`w-5 h-5 transition-transform transform ${
                    expandedPanel === faq.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {/* {expandedPanel === faq.id && ( */}
                <div className={`${expandedPanel === faq.id ? 'p-4 text-gray-700 bg-red-800' : expandedPanel !== faq.id ? 'bg-transparent h-0' : ''}`}>
                  {faq.answer}
                </div>
              {/* )} */}
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