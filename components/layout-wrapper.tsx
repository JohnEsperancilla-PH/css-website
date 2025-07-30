'use client'

import { usePathname } from 'next/navigation'
import Navbar from "@/components/navbar/navbar"
import Footer from "@/components/footer"
import { Chatbot } from "@/components/chatbot/chatbot"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  
  // Hide navbar, footer, and chatbot for admin and forms routes
  const isAdminRoute = pathname?.startsWith('/admin')
  const isFormRoute = pathname?.startsWith('/forms/')
  const hideNavAndFooter = isAdminRoute || isFormRoute

  return (
    <>
      {!hideNavAndFooter && <Navbar />}
      {children}
      {!hideNavAndFooter && <Footer />}
      {!hideNavAndFooter && <Chatbot />}
    </>
  )
}