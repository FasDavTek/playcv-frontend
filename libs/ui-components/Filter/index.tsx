import React, { useEffect, useState } from "react"
import { Input } from ".."
import { DatePicker } from ".."
import { Popover } from "@mui/material"
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { format } from "date-fns"
import Button from './../Button/index';
import { Controller, useForm } from "react-hook-form";
import Select, { components, StylesConfig } from "react-select";
import CreatableSelect from "react-select/creatable";



// Custom styles for react-select
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

// Custom ValueContainer to handle placeholder
const { ValueContainer, Placeholder } = components;

const CustomValueContainer: React.FC<any> = ({ children, ...props }) => {
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

// Props for the CustomSelect component
interface CustomSelectProps {
  options: OptionModel;
  placeholder?: string;
  defaultValue?: any;
  value?: any
  defaultValueKey?: "id" | "name";
  handleChange?: (newValue: any, newAction: any) => void;
  label?: string;
  containerClass?: string;
  className?: string;
  name: string;
  control: any;
  allowCreate?: boolean;
}

// CustomSelect component
const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  placeholder,
  defaultValue,
  value,
  defaultValueKey = "id",
  handleChange,
  label,
  containerClass,
  className,
  name,
  control,
  allowCreate = false,
}) => {
  return (
    <div className={`flex flex-col justify-start ${containerClass}`}>
      {label && <label className="text-[#4D5154] text-[14px] mb-2">{label}</label>}
      
      <Controller
        name={name}
        control={control}
        defaultValue={options?.find((option) => option.value === defaultValue)}
        render={({ field }) => {
          const { onChange, value } = field;
          const SelectComponent = allowCreate ? CreatableSelect : Select;
          return (
            <SelectComponent
              placeholder={placeholder}
              classNamePrefix="react-select"
              className={`react-select-container ${className}`}
              options={options}
              onChange={(newValue: any) => {
                onChange(newValue?.label);
                if (handleChange) {
                  handleChange(newValue, name);
                }
              }}
              value={options?.find((c) => c.value === value) || (value ? { value: value, label: value } : null)}
              isClearable
              styles={customStyles}
              components={{
                ...components,
                IndicatorSeparator: () => null,
                ValueContainer: CustomValueContainer,
              }}
            />
          );
        }}
      />
    </div>
  );
};



export interface FilterConfig {
  id: string
  label: string
  type: "text" | "select" | "date" | "dateRange"
  options?: { label: string; value: string }[]
  defaultValueKey?: "id" | "name";
}

interface FiltersProps {
  config: FilterConfig[]
  onFilterChange: (filters: Record<string, any>) => void
  filters: Record<string, any>;
}

export function Filters({ config, onFilterChange, filters = {} }: FiltersProps) {
  const [localFilters, setLocalFilters] = useState<Record<string, any>>(filters);
  const [date, setDate] = useState<Date>();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const { control } = useForm({});



  useEffect(() => {
    // Ensure filters contain only primitive values
    const sanitizedFilters = Object.keys(filters).reduce((acc, key) => {
      const value = filters[key];
      acc[key] = typeof value === 'object' ? value.value || value.label || '' : value;
      return acc;
    }, {} as Record<string, any>);
  
    setLocalFilters(sanitizedFilters);
  }, [filters]);


  const handleFilterChange = (id: any, value: any) => {
    let newValue = value;

    if (config.find((filter) => filter.id === id && filter.type === "select")) {
      newValue = value?.value || null;
    }

    const newFilters = {
      ...localFilters,
      [id]: newValue,
    }
    setLocalFilters(newFilters)
  }
  

  const handleDateSelect = (id: string, selectedDate: Date | undefined) => {
    if (selectedDate) {
      handleFilterChange(id, selectedDate.toISOString())
      setDate(selectedDate)
    }
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
  }

  const clearFilters = () => {
    setLocalFilters({});
    onFilterChange({});
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div className="space-y-4 flex flex-wrap w-auto px-2">
      <div className="flex flex-wrap w-full gap-4 items-end">
        {config.map((filter) => {
          switch (filter.type) {
            case "text":
              return (
                <div key={filter.id} className="flex flex-col space-y-1.5">
                  {/* <label htmlFor={filter.id}>{filter.label}</label> */}
                  <Input
                    id={filter.id}
                    value={localFilters[filter.id] || ""}
                    onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                    className="w-[200px]"
                    label={filter.label}
                    placeholder={`Search ${filter.label}`}
                  />
                </div>
              )
            case "select":
              return (
                <div key={filter.id} className="flex flex-col space-y-1.5">
                  {/* <label htmlFor={filter.id}>{filter.label}</label> */}
                  <CustomSelect
                    name={filter.label}
                    control={control}
                    options={filter.options || []}
                    placeholder={`Select ${filter.label}`}
                    value={filter.options?.find(option => option.value === localFilters[filter.id])}
                    defaultValue={filter.options?.find(option => option.value === localFilters[filter.id])}
                    defaultValueKey={filter.defaultValueKey}
                    handleChange={(value) => handleFilterChange(filter.id, value)}
                    className='w-[250px]'
                    label={filter.label}
                  />
                </div>
              )
            case "date":
              return (
                <div key={filter.id} className="flex flex-col space-y-1.5">
                  <label htmlFor={filter.id}>{filter.label}</label>
                  <Button
                    variant='special'
                    className={`w-[200px] justify-start text-left p-2 font-normal ${!date ? '' : ''}`}
                    onClick={handleClick}
                    label={localFilters[filter.id] ? format(new Date(localFilters[filter.id]), "PPP") : "Pick a date"}
                    // aria-describedby={id}
                    icon={<CalendarMonthIcon className="mr-2 h-5 w-4" />}
                  > 
                  </Button>
                  <Popover open={open} anchorEl={anchorEl} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} anchorPosition={{ top: 150, left: 300 }} >
                      <DatePicker
                        label=''
                        value={localFilters[filter.id] ? new Date(localFilters[filter.id]) : null}
                        onChange={(date) => {
                          setDate(date)
                          handleDateSelect(filter.id, date)
                        }}
                      />
                  </Popover>
                </div>
              )
            default:
              return null
          }
        })}

        <Button variant="black" onClick={applyFilters} className="lg:ml-10" label="Filter" icon={<FilterAltIcon />} />

        <Button variant="red" onClick={clearFilters} className="lg:ml-2" label="Clear Filters" />

        {/* <p onClick={onDownloadCSV} className="ml-auto">
          Download CSV
        </p> */}
        {/* <div className='flex items-center justify-between gap-2 cursor-pointer text-sm text-blue-500/80 ml-0 lg:ml-2 underline underline-offset-1' onClick={onDownloadCSV}>
          <CloudDownloadIcon sx={{ fontSize: "1rem" }} />
          <p>Download csv</p>
        </div> */}
      </div>
    </div>
  )
}

export default Filters