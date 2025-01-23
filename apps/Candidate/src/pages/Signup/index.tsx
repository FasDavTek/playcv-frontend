// import React, { useEffect, useState } from 'react'
// import { Images } from '@video-cv/assets';
// import { FormControl, FormHelperText, useTheme } from '@mui/material';
// import { useNavigate } from 'react-router-dom';

// import { Input, Button, } from '@video-cv/ui-components';
// import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
// import { toast } from 'react-toastify';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { postData } from './../../../../../libs/utils/apis/apiMethods';
// import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
// import CONFIG from './../../../../../libs/utils/helpers/config';
// import { LOCAL_STORAGE_KEYS } from './../../../../../libs/utils/localStorage';

// const schema = z.object({
//     employerInfo: z.object({
//       businessName: z.string().min(1, "Business name is required"),
//       businessPhoneNumber: z.string().regex(/^(\+234|0)[789][01]\d{8}$/, "Invalid phone number"),
//       businessEmail: z.string().email("Invalid email").regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email"),
//       websiteUrl: z.string().url().optional().or(z.literal('')),
//       fbLink: z.string().url().optional().or(z.literal('')),
//       twitter: z.string().url().optional().or(z.literal('')),
//       instagramUrl: z.string().url().optional().or(z.literal('')),
//       address: z.string().min(10, "Business address is required"),
//       industry: z.string().min(3, "Business sector is required"),
//       industryId: z.number().optional(),
//       contactName: z.string().min(1, "Contact person name is required"),
//       contactPosition: z.string().min(1, "Contact person role is required"),
//     }).nullable(),
//     firstName: z.string().min(1, "First name is required"),
//     middleName: z.string().optional(),
//     surname: z.string().min(1, "Surname is required"),
//     businessName: z.string().optional(),
//     phoneNumber: z.string().regex(/^(\+234|0)[789][01]\d{8}$/, "Invalid phone number"),
//     email: z.string().email("Invalid email").regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email"),
//     isTracked: z.boolean(),
//     userTypeId: z.number(),
//     isBusinessUser: z.boolean(),
//     isProfessional: z.boolean(),
//     password: z.string()
//       .min(6, "Password must be at least 6 characters long")
//       .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
//       .regex(/[a-z]/, "Password must contain at least one lowercase letter")
//       .regex(/[0-9]/, "Password must contain at least one number")
//       .regex(/[\W_]/, "Password must contain at least one special character"),
//     confirmPassword: z.string(),
// }).refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"],
// });
  
// type FormData = z.infer<typeof schema>;

// const Index = () => {
//     const navigate = useNavigate();
//     const { register, handleSubmit, reset, watch, control, formState: { errors }, getValues, setValue, setError } = useForm<FormData>({
//         resolver: zodResolver(schema),
//         defaultValues: {
//             isTracked: true,
//             userTypeId: 3,
//             isBusinessUser: false,
//             isProfessional: true,
//             employerInfo: null,
//         },
//     });

//     const [termsAccepted, setTermsAccepted] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [isFormValid, setIsFormValid] = useState(false);

//     const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setTermsAccepted(e.target.checked);
//     };

//     const submitForm = async (data: FormData) => {
//         if (!termsAccepted) {
//             toast.info("Please accept the Terms of Service to proceed.");
//             return;
//         }

//         // if (!isFormValid) {
//         //     toast.error("Please fill in all required fields correctly.");
//         //     return;
//         // }

//         setLoading(true);

//         let resp;

//         try {
//             const defaultValues = {
//                 isTracked: true,
//                 userTypeId: 3,
//                 isBusinessUser: false,
//                 isProfessional: true,
//             };

//             const payloadData = {
//                 email: data.email,
//                 firstName: data.firstName,
//                 middleName: data.middleName,
//                 lastName: data.surname,
//                 phoneNumber: data.phoneNumber,
//                 businessName: data.businessName,
//                 password: data.password,
//                 employerInfo: null,
//             }
          
//             const combinedData = {
//                 ...payloadData,
//                 ...defaultValues,
//             };

//             resp = await postData(`${CONFIG.BASE_URL}${apiEndpoints.AUTH_REGISTER}`, combinedData);

//             if (resp.code === "201") {
//                 toast.success(`You're in! Your account has been successfully created.`);
//                 toast.info(`Please check your email to verify your account before logging in.`);

//                 localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify({ ...resp, ...defaultValues }));
//                 localStorage.setItem(LOCAL_STORAGE_KEYS.IS_USER_EXIST, "true");
//                 localStorage.setItem(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID, resp.user.id);
//                 localStorage.setItem(LOCAL_STORAGE_KEYS.SIGNUP_DATA, JSON.stringify(data));

//                 reset();
//                 setTermsAccepted(false);

//                 navigate('/auth/verify-mail');
//             }
//             else if (resp.code === '400') {
//                 toast.error(`We couldn't complete your registration. Please verify your details and give it another go.`);
//             }
//         } 
//         catch (err: any) {
//             if (err.response?.data?.error?.code === "400") {
//                 if (err.response.data.error.message.includes("User with this email")) {
//                     const email = err.response.data.error.message.match(/[\w.-]+@[\w.-]+\.\w+/)[0];
//                     toast.error(`This email ${email} is already registered. Please use a different email or try logging in.`);
//                 }
//                 else if (err.response.data.error.message.includes("User with this phone number")) {
//                     const phoneNumber = err.response.data.error.message.match(/(\+234|0)[789][01]\d{8}/)[0];
//                     toast.error(`This phone number ${phoneNumber} is already registered. Please use a different number or try logging in.`);
//                 }
//                 else {
//                     toast.error(err.response?.data?.error?.message);
//                 }
//             }
//             else {
//                 if (err.response?.data?.message) {
//                     toast.error(err.response.data.message);
//                 } else {
//                     toast.error('An error occurred. Please try again.');
//                 }
//             }
//         } 
//         finally {
//             setLoading(false);
//         }
//     };

//     const handleSignIn = () => {
//         navigate('/auth/login')
//     };

//     const handleBackClick = () => {
//         navigate(-1);
//     };

//     const watchedFields = watch();


//     useEffect(() => {
//         const requiredFields = [
//             'firstName',
//             'surname',
//             'phoneNumber',
//             'email',
//             'password',
//             'confirmPassword'
//         ];

//         const isValid = requiredFields.every(field => {
//             const value = getValues(field as keyof FormData);
//             return value !== undefined && value !== '' && !errors[field as keyof FormData];
//         }) && termsAccepted;

//         setIsFormValid(isValid);
//     }, [getValues, errors, termsAccepted]);
  
//   return (
//     <div className="overflow-hidden flex">
//         <div className="border w-0 md:flex-1 min-h-screen" style={{ backgroundImage: `url(${Images.AuthBG})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', }}></div>
//         <div className="flex-1 flex flex-col my-auto p-2 md:px-8 overflow-y-auto">
//             <ChevronLeftIcon className="cursor-pointer text-base mr-1 top-2 fixed p-1 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={handleBackClick} />
//             <p className='text-lg mb-7 text-center md:text-left text-neutral-300'>Create Your Professional Profile</p>
//             <form onSubmit={handleSubmit(submitForm)}>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                     <div>
//                         <Input label={<span>First Name <span className="text-red-500">*</span> <span className="text-xs text-gray-500">(required)</span></span>} placeholder="First Name" error={errors.firstName} {...register('firstName')} isValid={!errors.firstName && !!watchedFields.firstName} />
//                     </div>
//                     <Input label="Middle Name" placeholder="Middle Name" error={errors.middleName} {...register('middleName')} isValid={!errors.middleName && !!watchedFields.middleName} />
//                     <div>
//                         <Input label={<span>Surname <span className="text-red-500">*</span> <span className="text-xs text-gray-500">(required)</span></span>} placeholder="Surname" error={errors.surname} {...register('surname')} isValid={!errors.surname && !!watchedFields.surname} />
//                     </div>
//                     <Input type='text' label="Business Name" placeholder="Business Name" error={errors.businessName} {...register('businessName')} isValid={!errors.businessName && !!watchedFields.businessName} />
//                     <div>
//                         <Input label={<span>Phone Number <span className="text-red-500">*</span> <span className="text-xs text-gray-500">(required)</span></span>} placeholder="+234123456789" error={errors.phoneNumber} {...register('phoneNumber')} isValid={!errors.phoneNumber && !!watchedFields.phoneNumber} />
//                     </div>
//                     <div>
//                         <Input label={<span>Email Address <span className="text-red-500">*</span> <span className="text-xs text-gray-500">(required)</span></span>} placeholder="Email Address" error={errors.email} {...register('email')} isValid={!errors.email && !!watchedFields.email} />
//                     </div>
//                     <FormControl>
//                         <div>
//                             <Input type='password' label="Password *" id='password' placeholder="Enter Password" error={errors.password} {...register('password')} isValid={!errors?.password && !!watchedFields.password} />
//                         </div>
//                         <FormHelperText>Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.</FormHelperText>
//                     </FormControl>
//                     <FormControl>
//                         <div>
//                             <Input type='password' label="Confirm Password *" placeholder="Confirm Password" error={errors.confirmPassword} {...register('confirmPassword')} isValid={!errors.confirmPassword && !!watchedFields.confirmPassword} />
//                         </div>
//                         <FormHelperText>Passwords must match.</FormHelperText>
//                     </FormControl>
//                 </div>
//                 <div className="mt-5">
//                     <label className="inline-flex items-center">
//                         <input 
//                             type="checkbox" 
//                             className="form-checkbox" 
//                             checked={termsAccepted} 
//                             onChange={handleCheckboxChange} 
//                         />
//                         <span className="ml-2 text-sm text-neutral-300">I agree to the <a href="/terms-and-conditions" className="text-green-500 underline">Terms of Service</a></span>
//                     </label>
//                 </div>
//                 <div className="flex justify-start gap-5 mt-5">
//                     <Button type='submit' variant="black" label={loading ? "Signing up..." : "Sign up"} className='w-[60%]' disabled={loading} />
//                 </div>
//             </form>
//             <p className='text-lg mt-5 text-center text-neutral-300'>Already have an account? <span onClick={handleSignIn} className='text-blue-400 font-medium hover:underline cursor-pointer'>Sign In</span></p>
//         </div>
//     </div>
//   )
// }

// export default Index

















// import type React from "react"
// import { useEffect, useState } from "react"
// import { Images } from "@video-cv/assets"
// import { FormControl, FormHelperText, useTheme } from "@mui/material"
// import { useNavigate } from "react-router-dom"

// import { Input, Button, Select } from "@video-cv/ui-components"
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
// import { toast } from "react-toastify"
// import { z } from "zod"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm, Controller } from "react-hook-form"
// import { postData } from "./../../../../../libs/utils/apis/apiMethods"
// import { apiEndpoints } from "./../../../../../libs/utils/apis/apiEndpoints"
// import CONFIG from "./../../../../../libs/utils/helpers/config"
// import { LOCAL_STORAGE_KEYS } from "./../../../../../libs/utils/localStorage"

// const schema = z
//   .object({
//     firstName: z.string().min(1, "First name is required"),
//     middleName: z.string().optional(),
//     surname: z.string().min(1, "Surname is required"),
//     phoneNumber: z.string().regex(/^(\+234|0)[789][01]\d{8}$/, "Invalid phone number"),
//     email: z
//       .string()
//       .email("Invalid email")
//       .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email"),
//     password: z
//       .string()
//       .min(6, "Password must be at least 6 characters long")
//       .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
//       .regex(/[a-z]/, "Password must contain at least one lowercase letter")
//       .regex(/[0-9]/, "Password must contain at least one number")
//       .regex(/[\W_]/, "Password must contain at least one special character"),
//     confirmPassword: z.string(),
//     hasBusiness: z.boolean(),
//     businessName: z.string().optional(),
//     businessPhoneNumber: z
//       .string()
//       .regex(/^(\+234|0)[789][01]\d{8}$/, "Invalid phone number")
//       .optional(),
//     businessEmail: z
//       .string()
//       .email("Invalid email")
//       .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email")
//       .optional(),
//     websiteUrl: z.string().url().optional().or(z.literal("")),
//     fbLink: z.string().url().optional().or(z.literal("")),
//     twitter: z.string().url().optional().or(z.literal("")),
//     instagramUrl: z.string().url().optional().or(z.literal("")),
//     address: z.string().optional(),
//     industry: z.string().optional(),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"],
//   })
//   .refine(
//     (data) => {
//       if (data.hasBusiness) {
//         return !!data.businessName && !!data.businessPhoneNumber && !!data.businessEmail
//       }
//       return true
//     },
//     {
//       message: "Business details are required if you have a business",
//       path: ["businessName"],
//     },
//   )

// type FormData = z.infer<typeof schema>

// const Index = () => {
//   const navigate = useNavigate()
//   const {
//     register,
//     handleSubmit,
//     reset,
//     watch,
//     control,
//     formState: { errors },
//     getValues,
//     setValue,
//   } = useForm<FormData>({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       hasBusiness: false,
//     },
//   })

//   const [termsAccepted, setTermsAccepted] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [isFormValid, setIsFormValid] = useState(false)

//   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setTermsAccepted(e.target.checked)
//   }

//   const submitForm = async (data: FormData) => {
//     if (!termsAccepted) {
//       toast.info("Please accept the Terms of Service to proceed.")
//       return
//     }

//     setLoading(true)

//     try {
//       const defaultValues = {
//         isTracked: true,
//         userTypeId: 3,
//         isBusinessUser: data.hasBusiness,
//         isProfessional: true,
//       }

//       const payloadData = {
//         email: data.email,
//         firstName: data.firstName,
//         middleName: data.middleName,
//         lastName: data.surname,
//         phoneNumber: data.phoneNumber,
//         password: data.password,
//         employerInfo: data.hasBusiness
//           ? {
//               businessName: data.businessName,
//               businessPhoneNumber: data.businessPhoneNumber,
//               businessEmail: data.businessEmail,
//               websiteUrl: data.websiteUrl,
//               fbLink: data.fbLink,
//               twitter: data.twitter,
//               instagramUrl: data.instagramUrl,
//               address: data.address,
//               industry: data.industry,
//             }
//           : null,
//       }

//       const combinedData = {
//         ...payloadData,
//         ...defaultValues,
//       }

//       const resp = await postData(`${CONFIG.BASE_URL}${apiEndpoints.AUTH_REGISTER}`, combinedData)

//       if (resp.code === "201") {
//         toast.success(`You're in! Your account has been successfully created.`)
//         toast.info(`Please check your email to verify your account before logging in.`)

//         localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify({ ...resp, ...defaultValues }))
//         localStorage.setItem(LOCAL_STORAGE_KEYS.IS_USER_EXIST, "true")
//         localStorage.setItem(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID, resp.user.id)
//         localStorage.setItem(LOCAL_STORAGE_KEYS.SIGNUP_DATA, JSON.stringify(data))

//         reset()
//         setTermsAccepted(false)

//         navigate("/auth/verify-mail")
//       } else if (resp.code === "400") {
//         toast.error(`We couldn't complete your registration. Please verify your details and give it another go.`)
//       }
//     } catch (err: any) {
//       if (err.response?.data?.error?.code === "400") {
//         if (err.response.data.error.message.includes("User with this email")) {
//           const email = err.response.data.error.message.match(/[\w.-]+@[\w.-]+\.\w+/)[0]
//           toast.error(`This email ${email} is already registered. Please use a different email or try logging in.`)
//         } else if (err.response.data.error.message.includes("User with this phone number")) {
//           const phoneNumber = err.response.data.error.message.match(/(\+234|0)[789][01]\d{8}/)[0]
//           toast.error(
//             `This phone number ${phoneNumber} is already registered. Please use a different number or try logging in.`,
//           )
//         } else {
//           toast.error(err.response?.data?.error?.message)
//         }
//       } else {
//         if (err.response?.data?.message) {
//           toast.error(err.response.data.message)
//         } else {
//           toast.error("An error occurred. Please try again.")
//         }
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSignIn = () => {
//     navigate("/auth/login")
//   }

//   const handleBackClick = () => {
//     navigate(-1)
//   }

//   const watchedFields = watch()
//   const hasBusiness = watch("hasBusiness")

//   useEffect(() => {
//     const requiredFields = ["firstName", "surname", "phoneNumber", "email", "password", "confirmPassword"]

//     if (hasBusiness) {
//       requiredFields.push("businessName", "businessPhoneNumber", "businessEmail")
//     }

//     const isValid =
//       requiredFields.every((field) => {
//         const value = getValues(field as keyof FormData)
//         return value !== undefined && value !== "" && !errors[field as keyof FormData]
//       }) && termsAccepted

//     setIsFormValid(isValid)
//   }, [getValues, errors, termsAccepted, hasBusiness])

//   return (
//     <div className="overflow-hidden flex">
//       <div
//         className="border w-0 md:flex-1 min-h-screen"
//         style={{
//           backgroundImage: `url(${Images.AuthBG})`,
//           backgroundSize: "cover",
//           backgroundRepeat: "no-repeat",
//           backgroundPosition: "center",
//         }}
//       ></div>
//       <div className="flex-1 flex flex-col my-auto p-2 md:px-8 overflow-y-auto">
//         <ChevronLeftIcon
//           className="cursor-pointer text-base mr-1 top-2 fixed p-1 hover:text-white hover:bg-black rounded-full"
//           sx={{ fontSize: "1.75rem" }}
//           onClick={handleBackClick}
//         />
//         <p className="text-lg mb-7 text-center md:text-left text-neutral-300">Create Your Professional Profile</p>
//         <form onSubmit={handleSubmit(submitForm)}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <div>
//               <Input
//                 label={
//                   <span>
//                     First Name <span className="text-red-500">*</span>{" "}
//                     <span className="text-xs text-gray-500">(required)</span>
//                   </span>
//                 }
//                 placeholder="First Name"
//                 error={errors.firstName}
//                 {...register("firstName")}
//                 isValid={!errors.firstName && !!watchedFields.firstName}
//               />
//             </div>
//             <Input
//               label="Middle Name"
//               placeholder="Middle Name"
//               error={errors.middleName}
//               {...register("middleName")}
//               isValid={!errors.middleName && !!watchedFields.middleName}
//             />
//             <div>
//               <Input
//                 label={
//                   <span>
//                     Surname <span className="text-red-500">*</span>{" "}
//                     <span className="text-xs text-gray-500">(required)</span>
//                   </span>
//                 }
//                 placeholder="Surname"
//                 error={errors.surname}
//                 {...register("surname")}
//                 isValid={!errors.surname && !!watchedFields.surname}
//               />
//             </div>
//             <div>
//               <Input
//                 label={
//                   <span>
//                     Phone Number <span className="text-red-500">*</span>{" "}
//                     <span className="text-xs text-gray-500">(required)</span>
//                   </span>
//                 }
//                 placeholder="+234123456789"
//                 error={errors.phoneNumber}
//                 {...register("phoneNumber")}
//                 isValid={!errors.phoneNumber && !!watchedFields.phoneNumber}
//               />
//             </div>
//             <div>
//               <Input
//                 label={
//                   <span>
//                     Email Address <span className="text-red-500">*</span>{" "}
//                     <span className="text-xs text-gray-500">(required)</span>
//                   </span>
//                 }
//                 placeholder="Email Address"
//                 error={errors.email}
//                 {...register("email")}
//                 isValid={!errors.email && !!watchedFields.email}
//               />
//             </div>
//             <FormControl>
//               <div>
//                 <Input
//                   type="password"
//                   label="Password *"
//                   id="password"
//                   placeholder="Enter Password"
//                   error={errors.password}
//                   {...register("password")}
//                   isValid={!errors?.password && !!watchedFields.password}
//                 />
//               </div>
//               <FormHelperText>
//                 Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase
//                 letter, one number, and one special character.
//               </FormHelperText>
//             </FormControl>
//             <FormControl>
//               <div>
//                 <Input
//                   type="password"
//                   label="Confirm Password *"
//                   placeholder="Confirm Password"
//                   error={errors.confirmPassword}
//                   {...register("confirmPassword")}
//                   isValid={!errors.confirmPassword && !!watchedFields.confirmPassword}
//                 />
//               </div>
//               <FormHelperText>Passwords must match.</FormHelperText>
//             </FormControl>
//           </div>

//           <div className="mt-5">
//             <Controller
//               name="hasBusiness"
//               control={control}
//               render={({ field }) => (
//                 <label>
//                     <input
//                         // label="I have a business"
//                         type="checkbox" 
//                         className="form-checkbox" 
//                         checked={field.value} 
//                         onChange={(e) => field.onChange(e.target.checked)} 
//                     />
//                     <span className="ml-2 text-sm text-neutral-300">
//                         I have a business
//                     </span>
//                 </label>
//                 // <Select
//                 //   label="I have a business"
//                 //   checked={field.value}
//                 //   onChange={(e) => field.onChange(e.target.checked)}
//                 // />
//               )}
//             />
//           </div>

//           {hasBusiness && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
//               <Input
//                 label="Business Name *"
//                 placeholder="Business Name"
//                 error={errors.businessName}
//                 {...register("businessName")}
//                 isValid={!errors.businessName && !!watchedFields.businessName}
//               />
//               <Input
//                 label="Business Phone Number *"
//                 placeholder="+234123456789"
//                 error={errors.businessPhoneNumber}
//                 {...register("businessPhoneNumber")}
//                 isValid={!errors.businessPhoneNumber && !!watchedFields.businessPhoneNumber}
//               />
//               <Input
//                 label="Business Email *"
//                 placeholder="business@example.com"
//                 error={errors.businessEmail}
//                 {...register("businessEmail")}
//                 isValid={!errors.businessEmail && !!watchedFields.businessEmail}
//               />
//               <Input
//                 label="Website URL"
//                 placeholder="https://www.example.com"
//                 error={errors.websiteUrl}
//                 {...register("websiteUrl")}
//                 isValid={!errors.websiteUrl && !!watchedFields.websiteUrl}
//               />
//               <Input
//                 label="Facebook Link"
//                 placeholder="https://www.facebook.com/yourbusiness"
//                 error={errors.fbLink}
//                 {...register("fbLink")}
//                 isValid={!errors.fbLink && !!watchedFields.fbLink}
//               />
//               <Input
//                 label="Twitter Link"
//                 placeholder="https://www.twitter.com/yourbusiness"
//                 error={errors.twitter}
//                 {...register("twitter")}
//                 isValid={!errors.twitter && !!watchedFields.twitter}
//               />
//               <Input
//                 label="Instagram URL"
//                 placeholder="https://www.instagram.com/yourbusiness"
//                 error={errors.instagramUrl}
//                 {...register("instagramUrl")}
//                 isValid={!errors.instagramUrl && !!watchedFields.instagramUrl}
//               />
//               <Input
//                 label="Business Address"
//                 placeholder="123 Business St, City, Country"
//                 error={errors.address}
//                 {...register("address")}
//                 isValid={!errors.address && !!watchedFields.address}
//               />
//               <Input
//                 label="Industry"
//                 placeholder="e.g. Technology, Healthcare, Education"
//                 error={errors.industry}
//                 {...register("industry")}
//                 isValid={!errors.industry && !!watchedFields.industry}
//               />
//             </div>
//           )}

//           <div className="mt-5">
//             <label className="inline-flex items-center">
//               <input
//                 type="checkbox"
//                 className="form-checkbox"
//                 checked={termsAccepted}
//                 onChange={handleCheckboxChange}
//               />
//               <span className="ml-2 text-sm text-neutral-300">
//                 I agree to the{" "}
//                 <a href="/terms-and-conditions" className="text-green-500 underline">
//                   Terms of Service
//                 </a>
//               </span>
//             </label>
//           </div>
//           <div className="flex justify-start gap-5 mt-5">
//             <Button
//               type="submit"
//               variant="black"
//               label={loading ? "Signing up..." : "Sign up"}
//               className="w-[60%]"
//               disabled={loading || !isFormValid}
//             />
//           </div>
//         </form>
//         <p className="text-lg mt-5 text-center text-neutral-300">
//           Already have an account?{" "}
//           <span onClick={handleSignIn} className="text-blue-400 font-medium hover:underline cursor-pointer">
//             Sign In
//           </span>
//         </p>
//       </div>
//     </div>
//   )
// }

// export default Index















import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FormControl, FormHelperText, Switch, FormControlLabel } from "@mui/material"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import { toast } from "react-toastify"
import { useForm } from "react-hook-form"
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { Images } from "@video-cv/assets"
import { Input, Button } from "@video-cv/ui-components"
import { postData } from "./../../../../../libs/utils/apis/apiMethods"
import { apiEndpoints } from "./../../../../../libs/utils/apis/apiEndpoints"
import CONFIG from "./../../../../../libs/utils/helpers/config"
import { LOCAL_STORAGE_KEYS } from "./../../../../../libs/utils/localStorage"


const schema = z.object({
    employerInfo: z.object({
      businessName: z.string().min(1, "Business name is required"),
      businessPhoneNumber: z.string().regex(/^(\+234|0)[789][01]\d{8}$/, "Invalid phone number"),
      businessEmail: z.string().email("Invalid email").regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email"),
      websiteUrl: z.string().url().optional().or(z.literal('')),
      fbLink: z.string().url().optional().or(z.literal('')),
      twitter: z.string().url().optional().or(z.literal('')),
      instagramUrl: z.string().url().optional().or(z.literal('')),
      address: z.string().min(10, "Business address is required"),
      industry: z.string().min(3, "Business sector is required"),
      industryId: z.number().optional(),
      contactName: z.string().min(1, "Contact person name is required"),
      contactPosition: z.string().min(1, "Contact person role is required"),
    }).nullable(),
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional(),
    surname: z.string().min(1, "Surname is required"),
    hasBusiness: z.boolean().default(false),
    businessName: z.string().optional(),
    phoneNumber: z.string().regex(/^(\+234|0)[789][01]\d{8}$/, "Invalid phone number"),
    email: z.string().email("Invalid email").regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email"),
    isTracked: z.boolean(),
    userTypeId: z.number(),
    isBusinessUser: z.boolean(),
    isProfessional: z.boolean(),
    password: z.string()
      .min(6, "Password must be at least 6 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[\W_]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
  
type FormData = z.infer<typeof schema>;


const Index = () => {
  const navigate = useNavigate()
  const { register, handleSubmit, reset, watch, control, formState: { errors }, getValues, setValue, } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      isTracked: true,
      userTypeId: 3,
      isBusinessUser: false,
      isProfessional: true,
      employerInfo: null,
      hasBusiness: false,
    },
  })

  const [termsAccepted, setTermsAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)

  const watchHasBusiness = watch("hasBusiness")

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(e.target.checked)
  }

  const submitForm = async (data: FormData) => {
    if (!termsAccepted) {
      toast.info("Please accept the Terms of Service to proceed.")
      return
    }

    setLoading(true)

    try {
      const defaultValues = {
          isTracked: true,
          userTypeId: 3,
          isBusinessUser: false,
          isProfessional: true,
      };

      const payloadData = {
        email: data.email,
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.surname,
        phoneNumber: data.phoneNumber,
        businessName: data.businessName,
        password: data.password,
        employerInfo: null,
      }

      const combinedData = {
        ...payloadData,
        ...defaultValues,
      };

      const resp = await postData(`${CONFIG.BASE_URL}${apiEndpoints.AUTH_REGISTER}`, combinedData)

      if (resp.code === "201") {
        toast.success(`You're in! Your account has been successfully created.`)
        toast.info(`Please check your email to verify your account before logging in.`)

        localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(resp))
        localStorage.setItem(LOCAL_STORAGE_KEYS.IS_USER_EXIST, "true")
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID, resp.user.id)
        localStorage.setItem(LOCAL_STORAGE_KEYS.SIGNUP_DATA, JSON.stringify(data))

        reset()
        setTermsAccepted(false)

        navigate("/auth/verify-mail")
      } else {
        toast.error(`We couldn't complete your registration. Please verify your details and try again.`)
      }
    } catch (err: any) {
      if (err.response?.data?.error?.message?.includes("User with this email")) {
        const email = err.response.data.error.message.match(/[\w.-]+@[\w.-]+\.\w+/)[0]
        toast.error(`This email ${email} is already registered. Please use a different email or try logging in.`)
      } else if (err.response?.data?.error?.message?.includes("User with this phone number")) {
        const phoneNumber = err.response.data.error.message.match(/(\+234|0)[789][01]\d{8}/)[0]
        toast.error(
          `This phone number ${phoneNumber} is already registered. Please use a different number or try logging in.`,
        )
      } else {
        toast.error(err.message || "An error occurred during signup. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = () => {
    navigate("/auth/login")
  }

  const handleBackClick = () => {
    navigate(-1)
  }

  const watchedFields = watch()

  useEffect(() => {
    const requiredFields = ["firstName", "surname", "phoneNumber", "email", "password", "confirmPassword"]

    if (watchHasBusiness) {
      requiredFields.push("businessName", "businessPhoneNumber", "businessEmail", "businessAddress", "industry")
    }

    const isValid =
      requiredFields.every((field) => {
        const value = getValues(field as keyof FormData)
        return value !== undefined && value !== "" && !errors[field as keyof FormData]
      }) && termsAccepted

    setIsFormValid(isValid)
  }, [getValues, errors, termsAccepted, watchHasBusiness])

  return (
    <div className="overflow-hidden flex">
      <div
        className="border w-0 md:flex-1 min-h-screen"
        style={{
          backgroundImage: `url(${Images.AuthBG})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      ></div>
      <div className="flex-1 flex flex-col my-auto p-2 md:px-8 overflow-y-auto">
        <ChevronLeftIcon
          className="cursor-pointer text-base mr-1 top-2 fixed p-1 hover:text-white hover:bg-black rounded-full"
          sx={{ fontSize: "1.75rem" }}
          onClick={handleBackClick}
        />
        <p className="text-lg mb-7 text-center md:text-left text-neutral-300">Create Your Professional Profile</p>
        <form onSubmit={handleSubmit(submitForm)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Input
                label={
                  <span>
                    First Name <span className="text-red-500">*</span>
                  </span>
                }
                placeholder="First Name"
                error={errors.firstName}
                {...register("firstName")}
                isValid={!errors.firstName && !!watchedFields.firstName}
              />
            </div>
            <Input
              label="Middle Name"
              placeholder="Middle Name"
              error={errors.middleName}
              {...register("middleName")}
              isValid={!errors.middleName && !!watchedFields.middleName}
            />
            <div>
              <Input
                label={
                  <span>
                    Surname <span className="text-red-500">*</span>
                  </span>
                }
                placeholder="Surname"
                error={errors.surname}
                {...register("surname")}
                isValid={!errors.surname && !!watchedFields.surname}
              />
            </div>
            <div>
              <Input
                label={
                  <span>
                    Phone Number <span className="text-red-500">*</span>
                  </span>
                }
                placeholder="+234123456789"
                error={errors.phoneNumber}
                {...register("phoneNumber")}
                isValid={!errors.phoneNumber && !!watchedFields.phoneNumber}
              />
            </div>
            <div>
              <Input
                label={
                  <span>
                    Email Address <span className="text-red-500">*</span>
                  </span>
                }
                placeholder="Email Address"
                error={errors.email}
                {...register("email")}
                isValid={!errors.email && !!watchedFields.email}
              />
            </div>
            <FormControl>
              <div>
                <Input
                  type="password"
                  label="Password *"
                  id="password"
                  placeholder="Enter Password"
                  error={errors.password}
                  {...register("password")}
                  isValid={!errors?.password && !!watchedFields.password}
                />
              </div>
              <FormHelperText>
                Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase
                letter, one number, and one special character.
              </FormHelperText>
            </FormControl>
            <FormControl>
              <div>
                <Input
                  type="password"
                  label="Confirm Password *"
                  placeholder="Confirm Password"
                  error={errors.confirmPassword}
                  {...register("confirmPassword")}
                  isValid={!errors.confirmPassword && !!watchedFields.confirmPassword}
                />
              </div>
              <FormHelperText>Passwords must match.</FormHelperText>
            </FormControl>
          </div>

          <div className="mt-5">
            <FormControlLabel
              control={
                <Switch
                  checked={watchHasBusiness}
                  onChange={(e) => setValue("hasBusiness", e.target.checked)}
                  name="hasBusiness"
                  color="primary"
                />
              }
              label="I have a business"
            />
          </div>

          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-5 overflow-hidden transition-all duration-300 ease-in-out ${watchHasBusiness ? "max-h-[1000px] opacity-100 mt-5" : "max-h-0 opacity-0"}`}
          >
            <div>
              <Input
                label={
                  <span>
                    Business Name <span className="text-red-500">*</span>
                  </span>
                }
                placeholder="Business Name"
                error={errors.businessName}
                {...register("businessName")}
                isValid={!errors.businessName && !!watchedFields.businessName}
              />
            </div>
            {/* <div>
              <Input
                label={
                  <span>
                    Business Phone Number <span className="text-red-500">*</span>
                  </span>
                }
                placeholder="Business Phone Number"
                error={errors.businessPhoneNumber}
                {...register("businessPhoneNumber")}
                isValid={!errors.businessPhoneNumber && !!watchedFields.businessPhoneNumber}
              />
            </div>
            <div>
              <Input
                label={
                  <span>
                    Business Email <span className="text-red-500">*</span>
                  </span>
                }
                placeholder="Business Email"
                error={errors.businessEmail}
                {...register("businessEmail")}
                isValid={!errors.businessEmail && !!watchedFields.businessEmail}
              />
            </div>
            <Input
              label="Website"
              placeholder="Website"
              error={errors.websiteUrl}
              {...register("websiteUrl")}
              isValid={!errors.websiteUrl && !!watchedFields.websiteUrl}
            />
            <div>
              <Input
                label={
                  <span>
                    Business Address <span className="text-red-500">*</span>
                  </span>
                }
                placeholder="Business Address"
                error={errors.businessAddress}
                {...register("businessAddress")}
                isValid={!errors.businessAddress && !!watchedFields.businessAddress}
              />
            </div>
            <div>
              <Input
                label={
                  <span>
                    Business Sector <span className="text-red-500">*</span>
                  </span>
                }
                placeholder="Business Sector"
                error={errors.industry}
                {...register("industry")}
                isValid={!errors.industry && !!watchedFields.industry}
              />
            </div>
            <Input
              label="Facebook Link"
              placeholder="Facebook Link"
              error={errors.fbLink}
              {...register("fbLink")}
              isValid={!errors.fbLink && !!watchedFields.fbLink}
            />
            <Input
              label="Twitter Link"
              placeholder="Twitter Link"
              error={errors.twitter}
              {...register("twitter")}
              isValid={!errors.twitter && !!watchedFields.twitter}
            />
            <Input
              label="Instagram Link"
              placeholder="Instagram Link"
              error={errors.instagramUrl}
              {...register("instagramUrl")}
              isValid={!errors.instagramUrl && !!watchedFields.instagramUrl}
            /> */}
          </div>

          <div className="mt-5">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={termsAccepted}
                onChange={handleCheckboxChange}
              />
              <span className="ml-2 text-sm text-neutral-300">
                I agree to the{" "}
                <a href="/terms-and-conditions" className="text-green-500 underline">
                  Terms of Service
                </a>
              </span>
            </label>
          </div>
          <div className="flex justify-start gap-5 mt-5">
            <Button
              type="submit"
              variant="black"
              label={loading ? "Signing up..." : "Sign up"}
              className="w-[60%]"
              disabled={loading || !isFormValid}
            />
          </div>
        </form>
        <p className="text-lg mt-5 text-center text-neutral-300">
          Already have an account?{" "}
          <span onClick={handleSignIn} className="text-blue-400 font-medium hover:underline cursor-pointer">
            Sign In
          </span>
        </p>
      </div>
    </div>
  )
}

export default Index