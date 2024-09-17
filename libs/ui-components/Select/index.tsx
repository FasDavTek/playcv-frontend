// import React from 'react';

// import cx from 'classnames';
// import { MenuItem, Select } from '@mui/material';
// import { ControllerRenderProps, FieldError, FieldValues, } from 'react-hook-form';

// interface SelectProps<T extends string>
//   extends React.InputHTMLAttributes<HTMLInputElement> {
//   label: string;
//   containerClass?: string;
//   options?: { [key: string]: string }[];
//   field?: ControllerRenderProps<FieldValues, T>;
//   error?: FieldError;
//   withLabelDescription: boolean;
// }

// const SelectDropdown: React.FC<any> = <T extends string>({
//   className,
//   label,
//   id,
//   containerClass,
//   options = [],
//   placeholder = 'Select an option',
//   disabled,
//   field,
//   withLabelDescription = false,
// }: SelectProps<T>) => {
//   return (
//     <div
//       className={cx(
//         { 'flex flex-col gap-1 justify-between': !!label },
//         { [`${containerClass}`]: !!containerClass }
//         // 'mt-3'
//       )}
//     >
//       {label ? (
//         <label
//           htmlFor={id}
//           className="block font-manrope text-sm capitalize font-medium leading-[1.25rem] text-secondary-500"
//         >
//           {label}
//         </label>
//       ) : null}

//       <Select
//         sx={{
//           boxShadow: 'none',
//           borderRadius: '0.5rem',
//           '.MuiOutlinedInput-notchedOutline': { border: '1px solid grey' },
//           '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
//             border: '1px solid grey',
//           },
//           '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
//             {
//               border: '1px solid grey',
//             },
//         }}
//         className={cx(
//           'py-2.5 pr-2 pl-3 rounded-xl bg-white active:outline-none focus:outline-none hover:outline-none w-full h-12 border',
//           className
//         )}
//         inputProps={{ 'aria-label': 'Without label' }}
//         disabled={disabled}
//         size="small"
//         {...field}
//         displayEmpty
//       >
//         <MenuItem disabled value="">
//           <em>{placeholder}</em>
//         </MenuItem>
//         {options.map((x, i) =>
//           withLabelDescription ? (
//             <MenuItem key={i} value={x.value}>
//               <span className="flex px-0">
//                 <p className="mr-7">{x.label}</p>
//                 <p className="">{x.price}</p>
//               </span>
//             </MenuItem>
//           ) : (
//             <MenuItem key={i} value={x.value}>
//               {x.label}
//             </MenuItem>
//           )
//         )}
//       </Select>
//     </div>
//   );
// };

// export default SelectDropdown;








import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

interface SelectDropdownProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({
  label,
  options,
  value = '',
  onChange,
  placeholder,
}) => {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        sx={{
          boxShadow: 'none',
          borderRadius: '0.5rem',
          '.MuiOutlinedInput-notchedOutline': { border: '1px solid grey' },
          '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            border: '1px solid grey',
          },
          '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
            {
              border: '1px solid grey',
            },
        }}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        displayEmpty
        label={label}
      >
        {placeholder && (
          <MenuItem value="">
            <em>{placeholder}</em>
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectDropdown;

