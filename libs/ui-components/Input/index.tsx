import { forwardRef, useState } from 'react';

import cx from 'classnames';
import { FieldError, UseFormRegister } from 'react-hook-form';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface InputProps<T extends object>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  containerClass?: string;
  register?: UseFormRegister<T>;
  error?: FieldError;
}

const FormInput = forwardRef<HTMLInputElement, InputProps<any>>(
  ({ className, label, id, containerClass, error, type, ...rest }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };
    
    return (
      <div
        className={cx(
          { 'flex flex-col gap-1': !!label },
          { [`${containerClass}`]: !!containerClass }
        )}
      >
        {label ? (
          <label
            htmlFor={id}
            className={cx(
              'block font-manrope text-sm capitalize font-medium leading-[1.25rem] text-secondary-500'
            )}
          >
            {label}
          </label>
        ) : null}
        <div className='relative'>
          <input
            ref={ref}
            type={type === 'password' && showPassword ? 'text' : type}
            className={cx(
              'py-2.5 pr-2 pl-3 rounded-xl focus:outline-none w-full h-12 border',
              className,
              { 'outline-red-500 border border-red-500': error }
            )}
            id={id}
            {...rest}
          />
          {type === 'password' && (
            <InputAdornment position="end" className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )}
        </div>
        
        {!!error && <p className="text-red-500 text-sm">{error?.message}</p>}
      </div>
    );
  }
);

export default FormInput;
