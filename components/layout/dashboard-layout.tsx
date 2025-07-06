"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { SidebarProvider } from "@/contexts/sidebar-context"
import { DashboardSidebar } from "./dashboard-sidebar"
import { DashboardHeader } from "./dashboard-header"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
  role: "consumer" | "partner" | "admin"
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user?.role !== role) {
      router.push(`/${user?.role}`)
      return
    }
  }, [isAuthenticated, user, role, router])

  if (!isAuthenticated || user?.role !== role) {
    return <div>Loading...</div>
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="flex">
          <DashboardSidebar role={role} />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
