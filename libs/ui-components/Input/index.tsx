import { forwardRef } from 'react';

import cx from 'classnames';
import { FieldError, UseFormRegister } from 'react-hook-form';

interface InputProps<T extends object>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  containerClass?: string;
  register?: UseFormRegister<T>;
  error?: FieldError;
}

const FormInput = forwardRef<HTMLInputElement, InputProps<any>>(
  ({ className, label, id, containerClass, error, ...rest }, ref) => {
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
        <input
          ref={ref}
          className={cx(
            'py-2.5 pr-2 pl-3 rounded-lg focus:outline-none w-full h-12 border',
            className,
            { 'outline-red-500 border border-red-500': error }
          )}
          id={id}
          {...rest}
        />
        {!!error && <p className="text-red-500 text-sm">{error?.message}</p>}
      </div>
    );
  }
);

export default FormInput;
