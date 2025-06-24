import type React from "react"
import { useState } from "react"
import WarningIcon from '@mui/icons-material/Warning';
import Button from './../Button/index';
import { Alert } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CloseIcon from '@mui/icons-material/Close';

interface ProfileCompletionNoticeProps {
  onNavigateToProfile: () => void
  onDismiss?: () => void
  variant?: "persistent" | "dismissible"
}

const ProfileCompletionNotice: React.FC<ProfileCompletionNoticeProps> = ({
  onNavigateToProfile,
  onDismiss,
  variant = "persistent",
}) => {
  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    if (onDismiss) {
      onDismiss()
    }
  }

  const handleGoToProfile = () => {
    onNavigateToProfile()
    if (variant === "dismissible") {
      handleDismiss()
    }
  }

  if (!isVisible) return null

  return (
    <Alert severity="info" className="border-orange-200 bg-orange-50 text-orange-800 mb-4 relative">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2 flex-1">
          <span className="font-medium">
            First of all, go to your PROFILE PAGE on your dashboard. Fill out your profile information to prevent
            account deactivation.
          </span>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button variant="neutral" onClick={handleGoToProfile} label='Go to Profile'>
          </Button>
          {variant === "dismissible" && (
            <Button
              onClick={handleDismiss}
              variant="special"
              className="h-8 w-8 p-0"
              label={<CloseIcon className="h-4 w-4" />}
            >
            </Button>
          )}
        </div>
      </div>
    </Alert>
  )
}

export default ProfileCompletionNotice