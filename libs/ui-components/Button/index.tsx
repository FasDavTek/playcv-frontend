import React, { ReactElement } from 'react';

// import cx from 'classnames';
import { Loader } from '../index';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string | ReactElement;
  variant?: 'primary' | 'neutral' | 'tertiary' | 'success' | 'custom' | 'red';
  icon?: any;
  iconAfter?: any;
  loading?: boolean;
}

const variants = {
  primary:
    'bg-primary-100 hover:opacity-85 border-primary-100 hover:border-primary-100 text-black !rounded-md',
  neutral:
    'bg-white hover:opacity-85 border border-primary-100 hover:border-primary-100 text-primary-100 !rounded-md',
  tertiary: 'bg-primary-200 hover:opacity-85 text-black',
  success: 'bg-green-500',
  custom: 'bg-transparent hover:opacity-85 border border-neutral-100 !rounded-md' ,
  red: 'bg-red-500 text-white',
};

const Button: React.FC<ButtonProps> = ({
  label,
  className = '',
  variant = 'primary',
  icon,
  iconAfter,
  type = 'button',
  loading,
  ...props
}) => {
  return (
    <button
      disabled={loading}
      type={type}
      className={`
      px-3 py-2 md:px-2 md:py-2 max-h-fit w-fit font-manrope 
      !rounded-md font-semibold text-sm md:text-base  shadow-buttonShadow hover:shadow-md hover:opacity-85 ${
        loading ? 'cursor-progress opacity-85' : 'cursor-pointer'
      } ${variants[variant]} ${className} ${
        icon || iconAfter || loading
          ? 'flex gap-2 justify-center items-center'
          : ''
      }`}
      {...props}
    >
      {loading ? <Loader /> : null}
      {icon ? icon : null}
      {label? label : null}
      {iconAfter ? iconAfter : null}
    </button>
  );
};

export default Button;
