"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function MemberGrowth() {
  const growthData = [
    { month: "Jan", members: 12500, growth: 8.5 },
    { month: "Feb", members: 13200, growth: 5.6 },
    { month: "Mar", members: 14100, growth: 6.8 },
    { month: "Apr", members: 15420, growth: 9.4 },
  ]

  const currentMonth = growthData[growthData.length - 1]
  const previousMonth = growthData[growthData.length - 2]
  const monthlyGrowth = ((currentMonth.members - previousMonth.members) / previousMonth.members) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Member Growth</CardTitle>
        <CardDescription>Monthly member acquisition trends</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{currentMonth.members.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Members</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-green-600">+{monthlyGrowth.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">This month</p>
            </div>
          </div>

          <div className="space-y-3">
            {growthData.map((data, index) => (
              <div key={data.month} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{data.month}</span>
                  <span>
                    {data.members.toLocaleString()} (+{data.growth}%)
                  </span>
                </div>
                <Progress value={data.growth * 10} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
