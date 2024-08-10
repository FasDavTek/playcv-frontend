import React, { useState } from 'react'
import { Images } from '@video-cv/assets';
import { useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import {
    Input,
    Button,
  } from '@video-cv/ui-components';

const index = () => {
    const [value, setValue] = React.useState(0);
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        surname: '',
        phoneNumber: '',
        emailAddress: '',
        password: '',
        confirmPassword: '',
    });

    const navigate = useNavigate();

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Add your API request logic here
        console.log('Form submitted', formData);
        // navigate('/');
    };
  
  return (
    <div className="min-h-screen flex">
        <div className="border w-0 md:flex-1 min-h-screen" style={{ backgroundImage: `url(${Images.AuthBG})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', height: '100%', }}></div>
        <div className="flex-1 flex flex-col p-2 md:px-8">
            <h2 className='font-semibold text-center md:text-left text-xl md:text-lg mb-1'>Create Account</h2>
            <p className='text-lg mb-7 text-center md:text-left text-neutral-300'>Create Your Professional Profile</p>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-5">
                        <Input name="firstName" label="First Name" placeholder="First Name" onChange={handleInputChange} />
                        <Input name="middleName" label="Middle Name" placeholder="Middle Name" onChange={handleInputChange} />
                        <Input name="surname" label="Surname" placeholder="Surname" onChange={handleInputChange} />
                        <Input name="phoneNumber" label="Phone Number" placeholder="+234123456789" onChange={handleInputChange} />
                        <Input name="emailAddress" label="Email Address" placeholder="Email Address" onChange={handleInputChange} />
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