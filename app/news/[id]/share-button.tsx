'use client'

import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'

interface ShareButtonProps {
  title: string
  excerpt?: string | null
}

export function ShareButton({ title, excerpt }: ShareButtonProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: excerpt || title,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleShare}
      className="flex items-center gap-2"
    >
      <Share2 className="w-4 h-4" />
      Share Article
    </Button>
  )
} 