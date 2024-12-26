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








// import React from 'react';
// import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

// interface SelectDropdownProps {
//   label: string;
//   options: { value: string; label: string }[];
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
// }

// const SelectDropdown: React.FC<SelectDropdownProps> = ({
//   label,
//   options,
//   value = '',
//   onChange,
//   placeholder,
// }) => {
//   return (
//     <FormControl fullWidth>
//       <InputLabel>{label}</InputLabel>
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
//         value={value || ''}
//         onChange={(e) => onChange(e.target.value)}
//         displayEmpty
//         label={label}
//       >
//         {placeholder && (
//           <MenuItem value="">
//             <em>{placeholder}</em>
//           </MenuItem>
//         )}
//         {options?.map((option) => (
//           <MenuItem key={option.value} value={option.value}>
//             {option.label}
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>
//   );
// };

// export default SelectDropdown;








// import React, { useState, useEffect } from 'react';
// import { FormControl, InputLabel, MenuItem, Select, TextField, SelectChangeEvent } from '@mui/material';

// interface SelectDropdownProps {
//   label: string;
//   options: { value: string; label: string }[];
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
//   allowCustomValue?: boolean;
// }

// const SelectDropdown: React.FC<SelectDropdownProps> = ({
//   label,
//   options,
//   value = '',
//   onChange,
//   placeholder,
//   allowCustomValue = true,
// }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredOptions, setFilteredOptions] = useState(options);
//   const [isOpen, setIsOpen] = useState(false);

//   useEffect(() => {
//     const filtered = options?.filter(option =>
//       option.label.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredOptions(filtered);
//   }, [searchTerm, options]);



//   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = event.target.value;
//     setSearchTerm(newValue);
//     if (allowCustomValue) {
//       onChange(newValue);
//     }
//   };

//   const handleSelectChange = (event: SelectChangeEvent<string>) => {
//     const selectedValue = event.target.value as string;
//     const selectedOption = options?.find(option => option.value === selectedValue);
//     if (selectedOption) {
//       setSearchTerm(selectedOption.label);
//       onChange(selectedValue);
//     } else if (allowCustomValue) {
//       setSearchTerm(selectedValue);
//       onChange(selectedValue);
//     }
//     setIsOpen(false);
//   };

//   return (
//     <FormControl fullWidth>
//       <InputLabel>{label}</InputLabel>
//       <Select
//         sx={{
//           boxShadow: 'none',
//           borderRadius: '0.5rem',
//           '.MuiOutlinedInput-notchedOutline': { border: '1px solid grey' },
//           '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
//             border: '1px solid grey',
//           },
//           '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
//             border: '1px solid grey',
//           },
//         }}
//         value={value || ''}
//         onChange={handleSelectChange}
//         onOpen={() => setIsOpen(true)}
//         onClose={() => setIsOpen(false)}
//         displayEmpty
//         label={label}
//         renderValue={() => searchTerm || placeholder || ''}
//       >
//         <MenuItem>
//           <TextField
//             fullWidth
//             variant="outlined"
//             placeholder="Search..."
//             value={searchTerm}
//             onChange={handleInputChange}
//             onClick={(e) => e.stopPropagation()}
//           />
//         </MenuItem>
//         {isOpen && filteredOptions?.map((option) => (
//           <MenuItem key={option.value} value={option.value}>
//             {option.label}
//           </MenuItem>
//         ))}
//         {allowCustomValue && searchTerm && !filteredOptions.find(option => option.label.toLowerCase() === searchTerm.toLowerCase()) && (
//           <MenuItem value={searchTerm}>
//             {searchTerm}
//           </MenuItem>
//         )}
//       </Select>
//     </FormControl>
//   );
// };

// export default SelectDropdown;









// import React, { useState, useEffect, forwardRef } from 'react';
// import { FormControl, InputLabel, MenuItem, Select as MuiSelect, TextField, SelectProps as MuiSelectProps } from '@mui/material';

// interface SelectOption {
//   value: string;
//   label: string;
// }

// interface SelectProps extends Omit<MuiSelectProps, 'onChange'> {
//   label: string;
//   options: SelectOption[];
//   onChange: (value: string) => void;
//   allowCustomValue?: boolean;
// }

// const SelectDropdown = forwardRef<HTMLDivElement, SelectProps>(({ 
//   label, 
//   options, 
//   value, 
//   onChange, 
//   allowCustomValue = false,
//   ...props 
// }, ref) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredOptions, setFilteredOptions] = useState(options);
//   const [customValue, setCustomValue] = useState('');

//   useEffect(() => {
//     const filtered = options?.filter(option =>
//       option.label.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredOptions(filtered);
//   }, [searchTerm, options]);

//   const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
//     const selectedValue = event.target.value as string;
//     onChange(selectedValue);
//     setSearchTerm('');
//   };

//   const handleCustomValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = event.target.value;
//     setCustomValue(newValue);
//     onChange(newValue);
//   };

//   return (
//     <FormControl fullWidth ref={ref}>
//       <InputLabel>{label}</InputLabel>
//       <MuiSelect
//         value={value}
//         onChange={handleChange}
//         label={label}
//         {...props}
//       >
//         {allowCustomValue && (
//           <MenuItem value={customValue}>
//             <TextField
//               fullWidth
//               value={customValue}
//               onChange={handleCustomValueChange}
//               placeholder="Enter custom value"
//               onClick={(e) => e.stopPropagation()}
//             />
//           </MenuItem>
//         )}
//         {filteredOptions?.map((option) => (
//           <MenuItem key={option.value} value={option.value}>
//             {option.label}
//           </MenuItem>
//         ))}
//       </MuiSelect>
//     </FormControl>
//   );
// });

// export default SelectDropdown;







import React, { FC } from "react";
import { Controller } from "react-hook-form";
import Select, { components, StylesConfig } from "react-select";

const customStyles: StylesConfig = {
  control: (base: Record<string, unknown>, state: any) => ({
    ...base,
    "*": {
      boxShadow: "none !important",
    },
    fontSize: "12px",
    height: "44px",
    borderRadius: "10px",
    width: "auto",
    boxShadow: "none",
    appearance: "none",
    paddingRight: "12px",
    paddingLeft: "12px",
  }),
  input: (base: any) => ({
    ...base,
    fontSize: "14px",
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "#212529",
  }),
  valueContainer: (provided) => ({
    ...provided,
    overflow: "visible",
  }),
  placeholder: (provided, state) => ({
    ...provided,
    position: "absolute",
    left: (state.hasValue || state.selectProps.inputValue) && 0,
    top: state.hasValue || state.selectProps.inputValue ? -15 : "20%",
    background: (state.hasValue || state.selectProps.inputValue) && "white",
    transition: "top 0.1s, font-size 0.1s",
    fontSize: state.hasValue || state.selectProps.inputValue ? "10px" : "14px",
    padding: state.hasValue || state.selectProps.inputValue ? "0px 4px" : "0px",
    lineHeight: (state.hasValue || state.selectProps.inputValue) && "16px",
    color: state.hasValue || state.selectProps.inputValue ? "#006C33" : "#4D5154",
  }),
  option: (styles, { isDisabled, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected ? "#006C33" : styles.backgroundColor,
    color: isSelected ? "#fff" : "default",
    cursor: isDisabled ? "not-allowed" : "default",
  }),
};

type SingleValue = {
  value: string | number;
  label: string;
};

type OptionModel = SingleValue[];

const { ValueContainer, Placeholder } = components;

const CustomValueContainer: FC<any> = ({ children, ...props }) => {
  return (
    <ValueContainer {...props}>
      <Placeholder {...props} isFocused={props.isFocused}>
        {props.selectProps.placeholder}
      </Placeholder>
      {React.Children.map(children, (child) =>
        child && child.type !== Placeholder ? child : null
      )}
    </ValueContainer>
  );
};

interface CustomSelectProps {
  options: OptionModel;
  handleChange?: (newValue: any, newAction: any) => void;
  defaultValue?: any;
  isDisabled?: boolean;
  placeholder?: string;
  containerClass?: string;
  className?: string;
  name: string;
  control: any;
  errors?: any;
  isMulti?: boolean;
  extraLabel?: string;
}

const SelectDropdown: FC<CustomSelectProps> = ({
  options,
  isDisabled,
  placeholder,
  containerClass,
  className,
  name,
  control,
  errors,
  defaultValue,
  handleChange,
  isMulti = false,
  extraLabel,
}) => {
  return (
    <div className={`flex flex-col justify-start ${containerClass}`}>
      {extraLabel && (
        <h1 className="text-[#4D5154] text-[14px] lg:leading-[16px] tracking-[0.03px] font-[600] mb-2">
          {extraLabel}
        </h1>
      )}

      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => {
          const { onChange, value } = field;
          return (
            <Select
              placeholder={placeholder}
              classNamePrefix="react-select"
              className={`react-select-container ${className}`}
              options={options}
              onChange={(newValue: any) => {
                onChange(!isMulti ? newValue?.value : newValue);
                if (handleChange) {
                  handleChange(newValue, name);
                }
              }}
              isDisabled={isDisabled}
              value={options?.find((c) => c.value === value)}
              isClearable
              styles={customStyles}
              components={{
                ...components,
                IndicatorSeparator: () => null,
                ValueContainer: CustomValueContainer,
              }}
              isMulti={isMulti}
            />
          );
        }}
      />
      {errors && (
        <div className="text-left ml-3">
        </div>
      )}
    </div>
  );
};

export default SelectDropdown;

