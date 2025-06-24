"use client"

import React from "react"
import { useState } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel, DialogProps, } from "@mui/material"
import Button from '../Button'

interface DurationModalProps {
  open: boolean;
  onClose: () => void;
  onContinue: (duration: number) => void;
  adPrice: number;
  isAdmin?: boolean;
}

const DurationModal: React.FC<DurationModalProps> = ({ open, onClose, onContinue, adPrice, isAdmin = false }) => {
  const [duration, setDuration] = useState(1);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('sm');

  const handleContinue = () => {
    onContinue(duration)
  }

  const totalPrice = adPrice * duration

  return (
    <Dialog open={open} onClose={onClose} fullWidth={fullWidth} maxWidth={maxWidth}>
      <DialogTitle>Select Ad Duration</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel id="duration-select-label">Duration</InputLabel>
          <Select
            labelId="duration-select-label"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            label="Duration"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((weeks) => (
              <MenuItem key={weeks} value={weeks}>
                {weeks} {weeks === 1 ? "week" : "weeks"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <p>Total Price: {totalPrice.toFixed(2)} NGN</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} label="Cancel" variant="custom" />
        <Button onClick={handleContinue} label={isAdmin ? "Continue" : "Continue to Payment"} variant="black" />
      </DialogActions>
    </Dialog>
  )
}

export default DurationModal

