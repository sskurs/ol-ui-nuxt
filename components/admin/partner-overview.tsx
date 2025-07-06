"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building, Users, Coins } from "lucide-react"

export function PartnerOverview() {
  const partners = [
    {
      id: 1,
      name: "Coffee Shop Co",
      category: "Food & Beverage",
      members: 1250,
      pointsIssued: 125000,
      status: "active",
      performance: "excellent",
    },
    {
      id: 2,
      name: "Fashion Boutique",
      category: "Retail",
      members: 890,
      pointsIssued: 89000,
      status: "active",
      performance: "good",
    },
    {
      id: 3,
      name: "Fitness Center",
      category: "Health & Wellness",
      members: 650,
      pointsIssued: 65000,
      status: "inactive",
      performance: "fair",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "excellent":
        return "text-green-600"
      case "good":
        return "text-blue-600"
      case "fair":
        return "text-orange-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Partner Overview</CardTitle>
          <CardDescription>Top performing partners</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          Manage Partners
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {partners.map((partner) => (
            <div key={partner.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Building className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium">{partner.name}</h4>
                  <p className="text-sm text-muted-foreground">{partner.category}</p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{partner.members.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Members</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center space-x-1">
                    <Coins className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{partner.pointsIssued.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Points Issued</p>
                </div>

                <div className="flex flex-col items-end space-y-1">
                  <Badge className={getStatusColor(partner.status)}>{partner.status}</Badge>
                  <span className={`text-xs font-medium ${getPerformanceColor(partner.performance)}`}>
                    {partner.performance}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
