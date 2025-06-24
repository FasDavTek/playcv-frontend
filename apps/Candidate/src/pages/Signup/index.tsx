import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FormControl, FormHelperText, Switch, FormControlLabel, RadioGroup, Radio, Checkbox, Alert } from "@mui/material"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import { toast } from "react-toastify"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Images } from "@video-cv/assets"
import { Input, Button, DatePicker, Select } from "@video-cv/ui-components"
import { postData } from "./../../../../../libs/utils/apis/apiMethods"
import { apiEndpoints } from "./../../../../../libs/utils/apis/apiEndpoints"
import CONFIG from "./../../../../../libs/utils/helpers/config"
import { SESSION_STORAGE_KEYS } from "./../../../../../libs/utils/sessionStorage"
import { LOCAL_STORAGE_KEYS } from "./../../../../../libs/utils/localStorage"
import dayjs from "dayjs"
import { useAllMisc } from "./../../../../../libs/hooks/useAllMisc"
import model from "./../../../../../libs/utils/helpers/model"

const schema = z
  .object({
    employerInfo: z
      .object({
        businessName: z.string().min(1, "Business name is required"),
        businessPhoneNumber: z.string().regex(/^(\+234|0)[789][01]\d{8}$/, "Invalid phone number"),
        businessEmail: z
          .string()
          .email("Invalid email")
          .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email"),
        websiteUrl: z.string().url().optional().or(z.literal("")),
        fbLink: z.string().url().optional().or(z.literal("")),
        twitter: z.string().url().optional().or(z.literal("")),
        instagramUrl: z.string().url().optional().or(z.literal("")),
        address: z.string().min(10, "Business address is required"),
        industry: z.string().min(3, "Business sector is required"),
        industryId: z.number().optional(),
        contactName: z.string().min(1, "Contact person name is required"),
        contactPosition: z.string().min(1, "Contact person role is required"),
      })
      .nullable(),
    professionalInfo: z.object({
      nyscStateCode: z.string().min(1, "NYSC State code is required").optional(),
      nyscStartYear: z.number().int().nullable().optional(),
      nyscEndYear: z.number().int().nullable().optional(),
      course: z.string().min(1, "Course of study is required").optional(),
      degree: z.string().min(1, "Degree awarded is required").optional(),
      institution: z.string().min(1, "Institution attended is required").optional(),
      classOfDegree: z.string().min(1, "Class of degree is required").optional(),
      coverLetter: z.string().min(1, "Cover letter content is required").optional(),
      degreeTypeId: z.number().nullable().optional(),
      degreeClassId: z.number().nullable().optional(),
      institutionId: z.number().nullable().optional(),
      courseId: z.number().nullable().optional(),
      businessName: z.string().optional(),
      industry: z.string().optional(),
      address: z.string().min(10, "Business address is required").optional(),
      businessPhone: z.string().optional(),
      industryId: z.number().nullable().optional(),
      businessProfile: z.string().min(10, "Business Profile content is required").optional(),
    }).optional(),
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional(),
    surname: z.string().min(1, "Surname is required"),
    hasBusiness: z.boolean(),
    businessName: z.string().optional(),
    phoneNumber: z.string().regex(/^(\+234|0)[789][01]\d{8}$/, "Invalid phone number"),
    email: z
      .string()
      .email("Invalid email")
      .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email"),
    isTracked: z.boolean(),
    userTypeId: z.number(),
    isBusinessUser: z.boolean(),
    isProfessional: z.boolean(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[\W_]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    // Only validate business fields if hasBusiness is true
    if (data.hasBusiness) {
      if (!data.professionalInfo?.businessName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Business Name is required",
          path: ["professionalInfo.businessName"],
        });
      }
      if (!data.professionalInfo?.businessPhone) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Business Phone Number is required",
          path: ["professionalInfo.businessPhone"],
        });
      }
      if (!data.professionalInfo?.industry) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Business sector is required",
          path: ["professionalInfo.industry"],
        });
      }
    }
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type FormData = z.infer<typeof schema>

const Index = () => {
  const navigate = useNavigate()
  const { register, handleSubmit, reset, watch, control, formState: { errors }, getValues, setValue,} = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      isTracked: true,
      userTypeId: 3,
      isBusinessUser: false,
      isProfessional: true,
      professionalInfo: {},
      employerInfo: null,
      hasBusiness: false,
    },
  })

  const [termsAccepted, setTermsAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isFormValid, setIsFormValid] = useState(true)
  const [hasBusiness, setHasBusiness] = useState(false)
  const [hasBusinessToggled, setHasBusinessToggled] = useState(false);

  const { data: industry, isLoading: isLoadingIndustries } = useAllMisc({
    resource: "industries",
    page: 1,
    limit: 100,
    download: false,
    structureType: "full",
  })

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
      }

      const professionalInfor = data.hasBusiness ? {
        businessName: data.professionalInfo?.businessName,
        businessPhone: data.professionalInfo?.businessPhone,
        industryId: data.professionalInfo?.industryId,
        industry: data.professionalInfo?.industry,
      } : null

      const payloadData = {
        email: data.email,
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.surname,
        phoneNumber: data.phoneNumber,
        businessName: data.professionalInfo?.businessName,
        password: data.password,
        employerInfo: null,
        professionalInfo: professionalInfor,
      }

      const combinedData = {
        ...payloadData,
        ...defaultValues,
      }


      const resp = await postData(`${CONFIG.BASE_URL}${apiEndpoints.AUTH_REGISTER}`, combinedData)

      if (resp.code === "201") {
        toast.success(`You're in! Your account has been successfully created.`)
        toast.info(`Kindly check your email inbox or spam for a verification mail`)

        // sessionStorage.setItem(SESSION_STORAGE_KEYS.USER, JSON.stringify(resp))
        sessionStorage.setItem(SESSION_STORAGE_KEYS.IS_USER_EXIST, "true")
        sessionStorage.setItem(SESSION_STORAGE_KEYS.USER_BIO_DATA_ID, resp.user.id)
        sessionStorage.setItem(SESSION_STORAGE_KEYS.USER_EMAIL, payloadData.email);
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER_EMAIL, payloadData.email);
        sessionStorage.setItem(SESSION_STORAGE_KEYS.SIGNUP_DATA, JSON.stringify(data))

        reset()
        setTermsAccepted(false)

        navigate("/auth/email-confirmation", { state: { email: data.email, userType: 'professional',  showAlert: true } });
        <Alert severity="info">Kindly check your email inbox or spam for a verification mail</Alert>
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
        toast.error(err.response?.data?.error?.message)
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
  const watchHasBusiness = watch("hasBusiness")


  const handleBusinessToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setHasBusiness(isChecked)
    setValue("hasBusiness", isChecked);
    setHasBusinessToggled(true);
    
    if (!isChecked) {
      // Reset business fields when toggling off
      setValue("professionalInfo.businessName", "");
      setValue("professionalInfo.businessPhone", "");
      setValue("professionalInfo.industry", "");
      setValue("professionalInfo.industryId", null);

      setTimeout(() => validateForm(), 0)
    }
  };


  const validateForm = () => {
    const requiredFields = ["firstName", "surname", "phoneNumber", "email", "password", "confirmPassword"]

    // Only include business fields in validation if hasBusiness is true
    const fieldsToValidate = hasBusiness
      ? [...requiredFields, "professionalInfo.businessName", "professionalInfo.businessPhone", "professionalInfo.industry"]
      : requiredFields

    const fieldsValid = fieldsToValidate.every((field) => {
      const value = getValues(field as any)
      return value !== undefined && value !== "" && !errors[field as keyof FormData]
    })

    setIsFormValid(fieldsValid && termsAccepted)
  }


  useEffect(() => {
    validateForm()
  }, [hasBusiness, watchedFields, errors, termsAccepted])

  console.log('isFormValid', isFormValid)

  return (
    <div className="overflow-hidden flex">
      <div
        className="border w-0 lg:flex-1 min-h-screen"
        style={{
          backgroundImage: `url(${Images.AuthBG})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      ></div>
      <div className="flex-1 flex flex-col my-auto p-2 md:px-8 overflow-y-auto">
        <ChevronLeftIcon className="cursor-pointer text-base mr-1 top-2 sticky p-1 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: "1.75rem" }} onClick={handleBackClick} />
        <form onSubmit={handleSubmit(submitForm)} >
          <p className="text-lg mb-7 text-center md:text-left text-neutral-300">Create Your Professional Profile</p>
          <div className="grid grid-cols-1 xmd:grid-cols-2 gap-5 px-2">
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
                placeholder="09123456789"
                error={errors.phoneNumber}
                {...register("phoneNumber")}
                type="number"
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
                type="email"
                isValid={!errors.email && !!watchedFields.email}
              />
            </div>
            {hasBusiness && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-3">Business Profile</h3>
                <div className="grid grid-cols-1 xmd:grid-cols-2 gap-5">
                  <div>
                    <Input
                      label={
                        <span>
                          Business Name
                        </span>
                      }
                      placeholder="Business Name"
                      error={errors?.professionalInfo?.businessName}
                      {...register("professionalInfo.businessName")}
                      isValid={!errors?.professionalInfo?.businessName && !!watchedFields.professionalInfo?.businessName}
                    />
                  </div>
                  <div>
                    <Input
                      label={<span>Business Phone Number</span>}
                      placeholder="Business Phone Number"
                      error={errors?.professionalInfo?.businessPhone}
                      {...register("professionalInfo.businessPhone")}
                      isValid={
                        !errors?.professionalInfo?.businessPhone && !!watchedFields.professionalInfo?.businessPhone
                      }
                    />
                  </div>
                  <div>
                    <Controller
                      name="professionalInfo.industry"
                      control={control}
                      render={({ field }) => (
                        <Select
                          name="Business Sector"
                          control={control}
                          defaultValue={
                            Array.isArray(industry) &&
                            industry?.find((i) => i.name === watch("professionalInfo.industry"))
                          }
                          options={model(industry, "name", "id")}
                          handleChange={(newValue) => {
                            if (newValue.__isNew__) {
                              field.onChange(newValue?.value || newValue?.label)
                              setValue("professionalInfo.industry", newValue?.label || "")
                              setValue("professionalInfo.industryId", null)
                            } else {
                              field.onChange(newValue?.value || newValue?.label)
                              setValue("professionalInfo.industry", newValue?.label)
                              setValue("professionalInfo.industryId", newValue?.value)
                            }
                          }}
                          isDisabled={isLoadingIndustries}
                          errors={errors}
                          allowCreate={true}
                          label={"Business Sector"}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            )}
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
                  checked={hasBusiness}
                  onChange={handleBusinessToggle}
                  name="hasBusiness"
                  color="default"
                  className="ml-4"
                  size="small"
                />
              }
              label="I have a business"
            />
          </div>

          <div className="mt-5 px-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={termsAccepted}
                onChange={handleCheckboxChange}
              />
              <span className="ml-2 text-sm text-neutral-300"> I agree to the{" "} <a href="/terms-and-conditions" className="text-green-500 underline"> Terms of Service </a>
              </span>
            </label>
          </div>
          <div className="flex justify-start gap-5 mt-5 px-2">
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