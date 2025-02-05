import React from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, DialogProps } from "@mui/material"
import Button from "../Button"

interface RejectionReasonDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (reason: string) => void
}

const RejectionReasonDialog: React.FC<RejectionReasonDialogProps> = ({ open, onClose, onSubmit }) => {
  const [reason, setReason] = React.useState("")
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('sm');

  const handleSubmit = () => {
    onSubmit(reason)
    setReason("")
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth={fullWidth} maxWidth={maxWidth} className="w-full">
      <DialogTitle>Rejection Reason</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="reason"
          label="Reason for rejection"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button label='Cancel' onClick={onClose} variant='red'>
        </Button>
        <Button label='Submit' onClick={handleSubmit} variant='success'>
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RejectionReasonDialog

