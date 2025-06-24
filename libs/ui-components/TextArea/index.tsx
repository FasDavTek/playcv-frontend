import React, { forwardRef } from 'react';

import cx from 'classnames';
import { FieldError, UseFormRegister } from 'react-hook-form';

interface FormTextAreaProps<T extends object>
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string | React.ReactElement;
  containerClass?: string;
  register?: UseFormRegister<T>;
  error?: FieldError;
}

const TextArea = forwardRef<HTMLTextAreaElement, FormTextAreaProps<any>>(
  ({ className, label, id, containerClass, error, rows, ...rest }, ref) => {
    return (
      <div
        className={cx(
          { 'flex flex-col gap-1': !!label },
          { [`${containerClass}`]: !!containerClass },
          'mt-3'
        )}
      >
        {label ? (
          <label
            htmlFor={id}
            className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500"
          >
            {label}
          </label>
        ) : null}
        <textarea
          ref={ref}
          rows={5}
          className={cx(
            'py-2.5 pr-2 pl-3 rounded-lg focus:outline-none w-full h-12 border',
            className,
            { 'outline-red-500 border border-red-500': error }
          )}
          style={{ resize: 'none' }}
          id={id}
          {...rest}
        />
        {!!error && <p className="text-red-500 text-sm">{error?.message}</p>}
      </div>
    );
  }
);
export default TextArea;
