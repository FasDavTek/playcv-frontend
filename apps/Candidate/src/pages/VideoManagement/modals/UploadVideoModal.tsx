// import { useState } from 'react';

// import { useForm } from 'react-hook-form';
// import UploadFile from '@mui/icons-material/UploadFileOutlined';

// import { Button, Input, TextArea, FileUpload, SelectChip, Select, } from '@video-cv/ui-components';
// import { usePaystack } from '@video-cv/payment';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// interface IForm {
//   name: string;
//   description: string;
//   category: string[];
//   tags: string[];
//   video: File[] | File | null;
//   videoTranscript: string;
//   videoType: 'pinVideo' | 'regularVideo';
// }

// const UploadVideoModal = ({
//   onClose,
//   onSubmit = (data: IForm) => '',
// }: {
//   onClose: (e?: any) => void;
//   onSubmit?: (data: IForm) => void;
// }) => {
//   const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<IForm>();
//   const navigate = useNavigate();
//   // const onSubmit = (data: IForm) => {
//   //   console.log('Form Data:', data);
//   //   // TODO: Redirect to paystack to make payment
//   //   payButtonFn();
//   //   onClose();
//   // };

//   const videoType = watch('videoType');
//   const amount = videoType === 'pinVideo' ? 10000 * 100 : 5000 * 100;

//   const { payButtonFn } = usePaystack(
//     amount,
//     () => {
//       console.log('Payment successful');
//       navigate('/candidate/video-management');
//     },
//     () => {
//       console.log('Payment failed');
//     }
//   );

//   const ProceedToPayment = () => {
//     // TODO: Redirect to paystack to make payment
//     payButtonFn();
//     onClose();
//   };



//   const handleFileUpload = async (file: File) => {
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('upload_preset', 'your_upload_preset'); // Replace with your Cloudinary upload preset

//     try {
//       const response = await axios.post('https://api.cloudinary.com/v1_1/your_cloud_name/video/upload', formData); // Replace with your Cloudinary URL
//       return response.data.secure_url;
//     } catch (error) {
//       console.error('Error uploading to Cloudinary:', error);
//       throw error;
//     }
//   };

//   const onSubmitHandler = async (data: IForm) => {
//     try {
//       if (Array.isArray(data.video)) {
//         const uploadPromises = data.video.map(handleFileUpload);
//         const videoUrls = await Promise.all(uploadPromises);
//         data.video = videoUrls as any;
//       } else if (data.video) {
//         const videoUrl = await handleFileUpload(data.video);
//         data.video = videoUrl as any;
//       }
//       onSubmit(data);
//       ProceedToPayment();
//     } catch (error) {
//       console.error('Failed to upload video:', error);
//     }
//   };



//   return (
//     <form
//       onSubmit={handleSubmit(onSubmitHandler)}
//       className="bg-white p-10 lg:py-9 lg:px-14 centered-modal md:centered-modal-md xl:centered-modal-large rounded-lg"
//     >
//       <h3 className="text-center font-bold text-xl">Video CV Upload Modal</h3>
//       <div className="my-2 flex flex-col gap-2">
//         <Input
//           label="Video Name"
//           {...register('name', { required: true })}
//           // error={errors.name ? 'This field is required' : undefined}
//           // error={}
//         />
//         <TextArea
//           label="Video Description"
//           placeholder='Add description forr your video'
//           {...register('description', { required: true })}
//           // error={errors.description ? 'This field is required' : undefined}
//           // error={}
//         />
//         <TextArea
//           label="Video Transcript"
//           {...register('videoTranscript', { required: true })}
//           // error={}
//         />
//         <SelectChip label="Category" id="category" {...register('category', { required: true })} />
//         <Select
//           label="Do you want to pin your video, to increase chances of visibility? However, pinned videos attract more payment"
//           options={[
//             { value: 'pinVideo', label: 'Pin Video' },
//             { value: 'regularVideo', label: 'Regular Video' },
//           ]}  
//           value={watch('tags')}
//           {...register('tags', { required: true })}
//           // error={errors.tags ? 'This field is required' : undefined}
//         />
//         <div className="">
//           <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
//             Video CV
//           </label>
//           <FileUpload
//             uploadIcon={<UploadFile sx={{ fontSize: '40px' }} />}
//             containerClass=""
//             uploadLabel="Drag and Drop or Browse"
//             {...register('video', { required: true })}
//             setFile={(files) => setValue('video', files)}
//           />
//         </div>

//         {/* categories, tags, file upload */}
//         <Button type='submit' className="w-full" label="Submit" />
//       </div>
//     </form>
//   );
// };

// export default UploadVideoModal;









// import React, { forwardRef } from 'react';
// import { useForm, Controller } from 'react-hook-form';
// import UploadFile from '@mui/icons-material/UploadFileOutlined';
// import { Button, Input, TextArea, FileUpload, SelectChip, Select } from '@video-cv/ui-components';
// import { usePaystack } from '@video-cv/payment';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// interface IForm {
//   name: string;
//   description: string;
//   category: string[];
//   tags: string[];
//   video: File[] | File | null;
//   videoTranscript: string;
//   videoType: 'pinVideo' | 'regularVideo';
// }

// interface UploadVideoModalProps {
//   onClose: (e?: any) => void;
//   onSubmit?: (data: IForm) => void;
// }

// const UploadVideoModal: React.FC<UploadVideoModalProps> = ({
//   onClose,
//   onSubmit = (data: IForm) => {},
// }, ref) => {
//   const { control, handleSubmit, watch, setValue } = useForm<IForm>({
//     defaultValues: {
//       name: '',
//       description: '',
//       category: [],
//       tags: [],
//       video: null,
//       videoTranscript: '',
//       videoType: 'regularVideo',
//     }
//   });
//   const navigate = useNavigate();

//   const videoType = watch('videoType');
//   const amount = videoType === 'pinVideo' ? 10000 * 100 : 5000 * 100;

//   const { payButtonFn } = usePaystack(
//     amount,
//     () => {
//       console.log('Payment successful');
//       navigate('/candidate/video-management');
//     },
//     () => {
//       console.log('Payment failed');
//     }
//   );

//   const ProceedToPayment = () => {
//     payButtonFn();
//     onClose();
//   };

//   const handleFileUpload = async (file: File) => {
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('upload_preset', 'your_upload_preset'); // Replace with your Cloudinary upload preset

//     try {
//       const response = await axios.post('https://api.cloudinary.com/v1_1/your_cloud_name/video/upload', formData); // Replace with your Cloudinary URL
//       return response.data.secure_url;
//     } catch (error) {
//       console.error('Error uploading to Cloudinary:', error);
//       throw error;
//     }
//   };

//   const onSubmitHandler = async (data: IForm) => {
//     try {
//       if (Array.isArray(data.video)) {
//         const uploadPromises = data.video.map(handleFileUpload);
//         const videoUrls = await Promise.all(uploadPromises);
//         data.video = videoUrls as any;
//       } else if (data.video) {
//         const videoUrl = await handleFileUpload(data.video);
//         data.video = videoUrl as any;
//       }
//       onSubmit(data);
//       ProceedToPayment();
//     } catch (error) {
//       console.error('Failed to upload video:', error);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmitHandler)}
//       ref={ref}
//       className="bg-white p-10 lg:py-9 lg:px-14 centered-modal md:centered-modal-md xl:centered-modal-large rounded-lg"
//     >
//       <h3 className="text-center font-bold text-xl">Video CV Upload Modal</h3>
//       <div className="my-2 flex flex-col gap-2">
//         <Controller
//           name="name"
//           control={control}
//           rules={{ required: 'This field is required' }}
//           render={({ field, fieldState: { error } }) => (
//             <Input
//               label="Video Name"
//               {...field}
//               // error={error?.message}
//             />
//           )}
//         />
//         <Controller
//           name="description"
//           control={control}
//           rules={{ required: 'This field is required' }}
//           render={({ field, fieldState: { error } }) => (
//             <TextArea
//               label="Video Description"
//               placeholder='Add description for your video'
//               {...field}
//               // error={error?.message}
//             />
//           )}
//         />
//         <Controller
//           name="videoTranscript"
//           control={control}
//           rules={{ required: 'This field is required' }}
//           render={({ field, fieldState: { error } }) => (
//             <TextArea
//               label="Video Transcript"
//               {...field}
//               // error={error?.message}
//             />
//           )}
//         />
//         <Controller
//           name="category"
//           control={control}
//           rules={{ required: 'This field is required' }}
//           render={({ field, fieldState: { error } }) => (
//             <SelectChip
//               label="Category"
//               id="category"
//               {...field}
//               options={[]}
//               // error={error?.message}
//             />
//           )}
//         />
//         <Controller
//           name="videoType"
//           control={control}
//           rules={{ required: 'This field is required' }}
//           render={({ field, fieldState: { error } }) => (
//             <Select
//               label="Do you want to pin your video, to increase chances of visibility? However, pinned videos attract more payment"
//               options={[
//                 { value: 'pinVideo', label: 'Pin Video' },
//                 { value: 'regularVideo', label: 'Regular Video' },
//               ]}
//               {...field}
//               // error={error?.message}
//             />
//           )}
//         />
//         <div className="">
//           <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
//             Video CV
//           </label>
//           <Controller
//             name="video"
//             control={control}
//             rules={{ required: 'This field is required' }}
//             render={({ field: { onChange }, fieldState: { error } }) => (
//               <FileUpload
//                 uploadIcon={<UploadFile sx={{ fontSize: '40px' }} />}
//                 containerClass=""
//                 uploadLabel="Drag and Drop or Browse"
//                 setFile={(files) => {
//                   onChange(files);
//                   setValue('video', files);
//                 }}
//                 // error={error?.message}
//               />
//             )}
//           />
//         </div>

//         <Button type='submit' className="w-full" label="Submit" />
//       </div>
//     </form>
//   );
// };

// export default UploadVideoModal;
