"use client"

import { useQuery } from "@tanstack/react-query"
import { partnerAPI } from "@/lib/api"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { PartnerStatsCards } from "@/components/partner/stats-cards"
import { QuickActions } from "@/components/partner/quick-actions"
import { RecentCustomers } from "@/components/partner/recent-customers"
import { RewardPerformance } from "@/components/partner/reward-performance"

export default function PartnerDashboard() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["partner-analytics"],
    queryFn: partnerAPI.getAnalytics,
  })

  if (isLoading) {
    return (
      <DashboardLayout role="partner">
        <div>Loading...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="partner">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Partner Dashboard</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Issue Points
          </Button>
        </div>

        {/* Stats Cards */}
        <PartnerStatsCards analytics={analytics} />

        {/* Quick Actions */}
        <QuickActions />

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Customers */}
          <RecentCustomers />

          {/* Reward Performance */}
          <RewardPerformance />
        </div>
      </div>
    </DashboardLayout>
  )
}
