import React from "react"
import { useState } from "react"
import { Button, Menu, MenuItem } from "@mui/material"
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface MenuOption {
  label: string
  onClick: () => void
  color?: string
  value?: any
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
  buttonColor = "inherit",
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
        variant={buttonVariant}
        color={buttonColor}
        startIcon={buttonText ? icon : undefined}
      >
        {buttonText || icon}
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {options.map((option, index) => (
          <MenuItem key={index} onClick={() => handleOptionClick(option)} style={{ color: option.color }}>
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

export default SelectMenu;