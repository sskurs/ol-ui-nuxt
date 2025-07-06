"use client"

import { useQuery } from "@tanstack/react-query"
import { adminAPI } from "@/lib/api"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AdminStatsCards } from "@/components/admin/stats-cards"
import { SystemActivity } from "@/components/admin/system-activity"
import { MemberGrowth } from "@/components/admin/member-growth"
import { PartnerOverview } from "@/components/admin/partner-overview"

export default function AdminDashboard() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: adminAPI.getAnalytics,
  })

  if (isLoading) {
    return (
      <DashboardLayout role="admin">
        <div>Loading...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">System Overview</h1>
          <div className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleString()}</div>
        </div>

        {/* Stats Cards */}
        <AdminStatsCards analytics={analytics} />

        <div className="grid gap-6 md:grid-cols-2">
          {/* System Activity */}
          <SystemActivity />

          {/* Member Growth */}
          <MemberGrowth />
        </div>

        {/* Partner Overview */}
        <PartnerOverview />
      </div>
    </DashboardLayout>
  )
}
