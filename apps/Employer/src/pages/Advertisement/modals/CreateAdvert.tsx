// import { useState } from 'react';

// import { useForm } from 'react-hook-form';
// import UploadFile from '@mui/icons-material/UploadFileOutlined';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';

// import {
//   Button,
//   Input,
//   TextArea,
//   FileUpload,
//   DatePicker,
//   Select,
// } from '@video-cv/ui-components';

// import { advertSchema } from './../../../../../video-cv/src/schema/formValidations/Advert.schema';
// import { useNavigate } from 'react-router-dom';
// import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

// // interface IForm {
// //   name: string;
// //   description: string;
// //   category: string[];
// //   tags: string[];
// //   video: File;
// //   videoTranscript: string;
// // }

// const options = [
//   { value: 'video', label: 'Video', price: '$200' },
//   { value: 'image', label: 'Image', price: '$200' },
// ];

// type faqType = z.infer<typeof advertSchema>;

// const CreateAdvertModal = () => {
//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     control,
//     formState: { errors },
//   } = useForm<faqType>({
//     resolver: zodResolver(advertSchema),
//   });
//   console.log('errors', errors);

//   const navigate = useNavigate();

//   const onSubmit = (data: faqType) => {
//     console.log('Form Data:', data);
//   };
//   return (
//     <div className='p-10 overflow-hidden bg-white'>
//       <ChevronLeftIcon className="cursor-pointer text-base mr-1 top-2 fixed p-1 mb-4 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={() => navigate('/employer/advertisement')} />
//       <h3 className="text-center font-semibold text-xl">Add Advert</h3>
//       <form onSubmit={handleSubmit(onSubmit, (err) => console.log('err', err))} className="bg-white mt-[50px] md:mt-0 p-10 lg:p-14 centered-modal-md rounded-lg">
//         <h3 className="text-center font-bold text-xl">Add Advert</h3>
//         <div className="my-5 flex flex-col gap-5">
//           <Input label="Ad Name" {...register('adName')} error={errors.adName} />
//           <TextArea
//             label="Ad Description"
//             {...register('adDescription')}
//             error={errors.adDescription}
//           />
//           <Input label="Ad Redirect Url" {...register('adUrl')} error={errors.adUrl} />
//           <Select
//             label="Advert Type"
//             id="adType"
//             placeholder="Select type"
//             containerClass="flex-1"
//             options={options}
//             withLabelDescription={true}
//             onChange={(e: any) => console.log('Selected', e)}
//           />
//           <div className="">
//             <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
//               Advert Upload (Multiple Files)
//             </label>
//             <FileUpload
//               uploadIcon={<UploadFile sx={{ fontSize: '40px' }} />}
//               containerClass=""
//               uploadLabel="Drag and Drop or Browse"
//               {...register('files')}
//             />
//           </div>

//           <DatePicker label="Start Date" {...register('startDate')} />
//           <DatePicker label="End Date" {...register('endDate')} />

//           {/* categories, tags, file upload */}
//           <Button type="submit" variant='black' className="w-full" label="Submit" />
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateAdvertModal;
