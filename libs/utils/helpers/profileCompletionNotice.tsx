import { useState, useEffect } from "react"

const STORAGE_KEY = "profile_completion_notice_shown"
const NOTICE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

interface UseProfileCompletionNoticeReturn {
  shouldShowNotice: boolean
  markNoticeAsShown: () => void
  resetNotice: () => void
  dismissNotice: () => void
}

export const useProfileCompletionNotice = (): UseProfileCompletionNoticeReturn => {
  const [shouldShowNotice, setShouldShowNotice] = useState(false)

  useEffect(() => {
    const checkNoticeStatus = () => {
      try {
        const stored = sessionStorage.getItem(STORAGE_KEY)
        if (!stored) {
          setShouldShowNotice(true)
          return
        }

        const { timestamp, dismissed } = JSON.parse(stored)
        const now = Date.now()

        // If dismissed, don't show
        if (dismissed) {
          setShouldShowNotice(false)
          return
        }

        // If more than 7 days have passed, show again
        if (now - timestamp > NOTICE_DURATION) {
          setShouldShowNotice(true)
          // Reset the storage
          sessionStorage.removeItem(STORAGE_KEY)
        } else {
          setShouldShowNotice(false)
        }
      } catch (error) {
        console.error("Error checking notice status:", error)
        setShouldShowNotice(true)
      }
    }

    checkNoticeStatus()
  }, [])

  const markNoticeAsShown = () => {
    try {
      const data = {
        timestamp: Date.now(),
        dismissed: false,
      }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      setShouldShowNotice(true)
    } catch (error) {
      console.error("Error marking notice as shown:", error)
    }
  }

  const dismissNotice = () => {
    try {
      const data = {
        timestamp: Date.now(),
        dismissed: true,
      }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      setShouldShowNotice(false)
    } catch (error) {
      console.error("Error dismissing notice:", error)
    }
  }

  const resetNotice = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY)
      setShouldShowNotice(true)
    } catch (error) {
      console.error("Error resetting notice:", error)
    }
  }

  return {
    shouldShowNotice,
    markNoticeAsShown,
    resetNotice,
    dismissNotice,
  }
}