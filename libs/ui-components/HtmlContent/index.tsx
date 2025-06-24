import React from "react"
import DOMPurify from "dompurify"

interface HtmlContentProps {
  html: string
  className?: string
}

/**
 * Component for safely rendering HTML content
 * Use this component when you need to display formatted HTML content
 */
const HtmlContent: React.FC<HtmlContentProps> = ({ html, className = "" }) => {
  if (!html) return null

  // Sanitize the HTML to prevent XSS attacks
  const sanitizedHtml = DOMPurify.sanitize(html)

  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} style={{ width: '100%', overflow: 'hidden', wordBreak: 'break-word' }} />
}

export default HtmlContent