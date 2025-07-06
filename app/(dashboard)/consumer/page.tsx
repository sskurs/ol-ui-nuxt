"use client"

import { useQuery } from "@tanstack/react-query"
import { loyaltyAPI } from "@/lib/api"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Coins, Trophy, Gift, TrendingUp } from "lucide-react"
import { LoyaltyCard } from "@/components/consumer/loyalty-card"
import { RecentTransactions } from "@/components/consumer/recent-transactions"
import { AvailableRewards } from "@/components/consumer/available-rewards"

export default function ConsumerDashboard() {
  const { data: loyaltyData, isLoading } = useQuery({
    queryKey: ["loyalty-data"],
    queryFn: loyaltyAPI.getUserData,
  })

  if (isLoading) {
    return (
      <DashboardLayout role="consumer">
        <div>Loading...</div>
      </DashboardLayout>
    )
  }

  const tierProgress = {
    Bronze: { next: "Silver", required: 5000 },
    Silver: { next: "Gold", required: 15000 },
    Gold: { next: "Platinum", required: 30000 },
    Platinum: { next: null, required: 0 },
  }

  const currentTier = tierProgress[loyaltyData?.tier as keyof typeof tierProgress]
  const progressPercentage = currentTier?.next ? (loyaltyData?.points / currentTier.required) * 100 : 100

  return (
    <DashboardLayout role="consumer">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Badge variant="outline" className="text-lg px-3 py-1">
            {loyaltyData?.tier} Member
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loyaltyData?.points.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Tier</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loyaltyData?.tier}</div>
              {currentTier?.next && (
                <p className="text-xs text-muted-foreground">
                  {currentTier.required - loyaltyData?.points} points to {currentTier.next}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Rewards</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loyaltyData?.rewards.length}</div>
              <p className="text-xs text-muted-foreground">Ready to redeem</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2,350</div>
              <p className="text-xs text-muted-foreground">Points earned</p>
            </CardContent>
          </Card>
        </div>

        {/* Tier Progress */}
        {currentTier?.next && (
          <Card>
            <CardHeader>
              <CardTitle>Tier Progress</CardTitle>
              <CardDescription>
                You're {currentTier.required - loyaltyData?.points} points away from {currentTier.next}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={progressPercentage} className="w-full" />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>{loyaltyData?.points.toLocaleString()} points</span>
                <span>{currentTier.required.toLocaleString()} points</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Digital Loyalty Card */}
        <LoyaltyCard loyaltyData={loyaltyData} />

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Transactions */}
          <RecentTransactions />

          {/* Available Rewards */}
          <AvailableRewards />
        </div>
      </div>
    </DashboardLayout>
  )
}
