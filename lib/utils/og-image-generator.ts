import { Form } from '@/lib/types/forms'

export async function generateFormOGImage(form: Form): Promise<string> {
  // Create a clean white background OG image with logos and JetBrains font
  
  // Smart title truncation to fit within image bounds (more conservative)
  const maxTitleLength = 35
  const truncatedTitle = form.title.length > maxTitleLength 
    ? form.title.substring(0, maxTitleLength - 3) + '...' 
    : form.title

  const svg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="1200" height="630" fill="#ffffff"/>
      
      <!-- Header section -->
      <rect x="0" y="0" width="1200" height="120" fill="#f8fafc"/>
      <line x1="0" y1="120" x2="1200" y2="120" stroke="#e2e8f0" stroke-width="1"/>
      
      <!-- USLS Logo (simplified text representation) -->
      <g transform="translate(60, 30)">
        <text x="0" y="30" fill="#000000" font-family="JetBrains Mono, monospace" font-size="16" font-weight="500">University of St. La Salle</text>
      </g>
      
      <!-- CSS Logo (simplified text representation) -->
      <g transform="translate(60, 30)">
        <text x="0" y="50" fill="#000000" font-family="JetBrains Mono, monospace" font-size="14" font-weight="500">Computer Science Society</text>
      </g>
      
      <!-- Form type indicator -->
      <g transform="translate(1000, 50)">
        <rect x="0" y="0" width="100" height="40" rx="20" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="1"/>
        <text x="50" y="25" text-anchor="middle" fill="#374151" font-family="JetBrains Mono, monospace" font-size="12" font-weight="600">FORM</text>
      </g>
      
      <!-- Form Title (centered and properly contained) -->
      <text x="600" y="315" text-anchor="middle" fill="#111827" font-family="JetBrains Mono, monospace" font-size="42" font-weight="700">
        ${truncatedTitle}
      </text>
    </svg>
  `

  // Convert SVG to data URL
  const dataUrl = `data:image/svg+xml;base64,${btoa(svg)}`
  
  return dataUrl
}

// Alternative: Generate a more sophisticated OG image using a canvas
export async function generateCanvasOGImage(form: Form): Promise<string> {
  // This would require a canvas implementation
  // For now, we'll use the SVG approach above
  return generateFormOGImage(form)
}

// For production, you might want to use a service like:
// - Vercel OG Image: https://vercel.com/docs/concepts/functions/edge-functions/og-image-generation
// - Cloudinary
// - Or implement a server-side canvas solution 