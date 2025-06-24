import React, { ReactElement } from 'react';

// import cx from 'classnames';
import { Loader } from '../index';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string | ReactElement;
  variant?: 'primary' | 'neutral' | 'tertiary' | 'success' | 'custom' | 'blue' | 'red' | 'none' | 'black' | 'special';
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
  success: 'bg-green-600 text-white',
  custom: 'bg-transparent hover:opacity-85 border border-neutral-100 hover:text-violet-700 !rounded-md' ,
  blue: 'bg-violet-700 border border-neuytral-100 text-white hover:bg-transparent hover:text-violet-600 !rounded-md',
  red: 'bg-red-500 text-white',
  none: 'bg-transparent border-none',
  black: 'bg-black text-white',
  special:
    'bg-white hover:opacity-85 border border-neutral-200 text-neutral-500 !rounded-md',
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
      px-3 py-1 md:px-2 md:py-1 text-center max-h-fit w-fit font-manrope 
      !rounded-md font-light text-sm md:text-base cursor-pointer shadow-buttonShadow hover:shadow-lg hover:opacity-85 ${
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
