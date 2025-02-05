import React from "react"
import { useState } from "react"
import { Button, Menu, MenuItem } from "@mui/material"
import MoreVertIcon from '@mui/icons-material/MoreVert';


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
};

interface MenuOption {
  label: string
  onClick: () => void
  color?: string
  value?: any
  icon?: React.ReactNode
  variant?: keyof typeof variants
}

interface ReusableMenuProps {
  options: MenuOption[]
  icon?: React.ReactNode
  buttonText?: string
  buttonVariant?: "text" | "outlined" | "contained"
  buttonColor?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning"
  onChange?: (value: any) => void
}

const SelectMenu: React.FC<ReusableMenuProps> = ({
  options,
  icon = <MoreVertIcon />,
  buttonText,
  buttonVariant = "text",
  buttonColor = "primary",
  onChange,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleOptionClick = (option: MenuOption) => {
    option.onClick()
    if (onChange) {
      onChange(option.value)
    }
    handleClose()
  }

  return (
    <div>
      <Button
        onClick={handleClick}
        className={`px-4 py-2 ${buttonVariant === "outlined" ? "border" : ""} ${buttonVariant === "contained" ? "bg-gray-200" : ""}`}
        startIcon={buttonText ? icon : undefined}
      >
        {buttonText && icon && <span className="mr-2">{icon}</span>}
        {buttonText || icon}
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} >
        {options.map((option, index) => (
          <MenuItem key={index} className={`${option.variant ? variants[option.variant] : ""} my-1 mx-2`} onClick={() => handleOptionClick(option)} sx={{ paddingTop: "0.35rem", paddingBottom: "0.35rem", paddingLeft: "1.25rem", paddingRight: "1.25rem", }} style={{ color: option.color,  }}>
            {option.icon && <span style={{ marginRight: "8px" }}>{option.icon}</span>}
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

export default SelectMenu;