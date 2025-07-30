'use client'

import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { Button } from '@/components/ui/button'
import { QrCode, Download, Copy, Check, X } from 'lucide-react'

interface QRCodeGeneratorProps {
  formId: string
  formTitle: string
  className?: string
}

export function QRCodeGenerator({ formId, formTitle, className = '' }: QRCodeGeneratorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [showModal, setShowModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const formUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/forms/${formId}`
    : `https://computer-science-society-usls.vercel.app/forms/${formId}`

  const generateQRCode = async () => {
    if (qrCodeUrl) {
      setShowModal(true)
      return
    }

    setIsGenerating(true)
    try {
      const qrDataUrl = await QRCode.toDataURL(formUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#1f2937', // gray-800
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      })
      setQrCodeUrl(qrDataUrl)
      setShowModal(true)
    } catch (error) {
      console.error('Error generating QR code:', error)
      alert('Failed to generate QR code')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadQRCode = () => {
    if (!qrCodeUrl) return

    const link = document.createElement('a')
    link.download = `${formTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_qr.png`
    link.href = qrCodeUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(formUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy URL:', error)
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = formUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={generateQRCode}
        disabled={isGenerating}
        className={`flex items-center gap-2 ${className}`}
      >
        {isGenerating ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
        ) : (
          <QrCode className="w-4 h-4" />
        )}
        QR Code
      </Button>

      {/* QR Code Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Form QR Code</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowModal(false)}
                className="p-1"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="text-center space-y-6">
              {/* QR Code */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 inline-block">
                {qrCodeUrl && (
                  <img 
                    src={qrCodeUrl} 
                    alt={`QR Code for ${formTitle}`}
                    className="w-64 h-64 mx-auto"
                  />
                )}
              </div>

              {/* Form Title */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">{formTitle}</h4>
                <p className="text-sm text-gray-600 break-all">
                  {formUrl}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={downloadQRCode}
                  className="flex items-center gap-2 flex-1"
                >
                  <Download className="w-4 h-4" />
                  Download QR Code
                </Button>
                
                <Button
                  variant="outline"
                  onClick={copyUrl}
                  className="flex items-center gap-2 flex-1"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy URL
                    </>
                  )}
                </Button>
              </div>

              <div className="text-xs text-gray-500 pt-4 border-t border-gray-100 space-y-1">
                <p>📱 <strong>Scan with phone camera</strong> to open the form instantly</p>
                <p>📋 <strong>Share the QR code</strong> in presentations, flyers, or social media</p>
                <p>📊 <strong>Track responses</strong> in your admin dashboard</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}