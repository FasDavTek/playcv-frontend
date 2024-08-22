import React, { useState } from 'react';
import { Images } from '@video-cv/assets';
import { useNavigate } from 'react-router-dom';

import { Input, Select, Button, } from '@video-cv/ui-components';
import { useDropzone } from 'react-dropzone';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const index = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        surname: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    
    
    const navigate = useNavigate();

    const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
      // Disable click and keydown behavior
      noClick: true,
      noKeyboard: true,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // Add your API request logic here
      try {
        console.log('Form submitted', formData);
        navigate('/employer/profile')
      }
      catch (err) {

      }
    };

    const handleBackClick = () => {
      navigate(-1);
    };

  return (
    <div className="overflow-hidden flex">
        <div className="border w-0 md:flex-1 min-h-screen" style={{ backgroundImage: `url(${Images.AuthBG})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', height: '100%', }}></div>
        <div className="flex-1 flex flex-col my-auto py-8 md:py-0 px-4 md:px-8 overflow-y-auto">
            <ChevronLeftIcon className="cursor-pointer text-base mr-1 top-2 fixed p-1 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={handleBackClick} />
            <h2 className='font-semibold text-center md:text-left text-xl md:text-lg mb-1'>Create Business</h2>
            <p className='text-lg mb-7 text-center md:text-left text-neutral-300'>Create Your Business Profile</p>
            <form onSubmit={(e) => handleSubmit(e)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input name="firstName" label="First Name" placeholder="First Name" onChange={handleInputChange} />
                    <Input name="middleName" label="Middle Name" placeholder="Middle Name" onChange={handleInputChange} />
                    <Input name="surname" label="Surname" placeholder="Surname" onChange={handleInputChange} />
                    {/* <Input name='businessName' label="Business Name" placeholder="Business Name" onChange={handleInputChange} /> */}
                    <Input name='phoneNumber' label="Phone Number" placeholder="Phone Number" onChange={handleInputChange} />
                    <Input name="email" label="Email" placeholder="Email" onChange={handleInputChange} />
                    <Input name="password" type='password' label="Password" placeholder="Enter Password" onChange={handleInputChange}  />
                    <Input name="confirmPassword" type='password' label="Confirm Password" placeholder="Confirm Password" onChange={handleInputChange}  />
                </div>
                <div className="flex justify-start gap-5 mt-5">
                    <Button type='submit' variant="black" label="Sign Up" className='w-[60%]' />
                </div>
            </form>
        </div>
    </div>
  )
}

export default index