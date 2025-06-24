import DOMPurify from "dompurify"

interface HtmlRendererProps {
  content: string
  className?: string
}

export function HtmlRenderer({ content, className = "" }: HtmlRendererProps) {
  // Sanitizar el HTML para prevenir XSS
  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ["p", "strong", "em", "u", "br", "ul", "ol", "li", "h1", "h2", "h3", "h4", "h5", "h6"],
    ALLOWED_ATTR: [],
  })

  return (
    <div className={`prose prose-sm max-w-none ${className}`} dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
  )
}
