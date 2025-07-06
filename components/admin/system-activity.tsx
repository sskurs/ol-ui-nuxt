"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Building, Settings } from "lucide-react"

export function SystemActivity() {
  const activities = [
    {
      id: 1,
      type: "member",
      description: "New member registration: Alice Johnson",
      timestamp: "2 minutes ago",
      icon: User,
      color: "bg-blue-100 text-blue-600",
      badge: "member",
    },
    {
      id: 2,
      type: "partner",
      description: "Partner 'Coffee Shop Co' issued 500 points",
      timestamp: "15 minutes ago",
      icon: Building,
      color: "bg-green-100 text-green-600",
      badge: "partner",
    },
    {
      id: 3,
      type: "system",
      description: "System backup completed successfully",
      timestamp: "1 hour ago",
      icon: Settings,
      color: "bg-purple-100 text-purple-600",
      badge: "system",
    },
    {
      id: 4,
      type: "member",
      description: "Member 'Bob Smith' redeemed reward",
      timestamp: "2 hours ago",
      icon: User,
      color: "bg-blue-100 text-blue-600",
      badge: "member",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent System Activity</CardTitle>
        <CardDescription>Latest events across the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <div key={activity.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {activity.badge}
                </Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
