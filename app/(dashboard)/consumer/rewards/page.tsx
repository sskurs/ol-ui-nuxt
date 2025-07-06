"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { loyaltyAPI } from "@/lib/api"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Gift, Search, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function RewardsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [pointsFilter, setPointsFilter] = useState("all")
  const { toast } = useToast()

  const { data: rewards, isLoading } = useQuery({
    queryKey: ["rewards"],
    queryFn: loyaltyAPI.getRewards,
  })

  // Mock rewards data
  const mockRewards = [
    {
      id: 1,
      name: "10% Off Coupon",
      description: "Get 10% off your next purchase at any participating store",
      points: 500,
      category: "discount",
      image: "/placeholder.svg?height=200&width=300",
      featured: true,
      expiresIn: "30 days",
      termsAndConditions: "Valid for one-time use. Cannot be combined with other offers.",
    },
    {
      id: 2,
      name: "Free Coffee",
      description: "Enjoy a complimentary coffee of your choice",
      points: 200,
      category: "food",
      image: "/placeholder.svg?height=200&width=300",
      featured: false,
      expiresIn: "7 days",
      termsAndConditions: "Valid at participating coffee shops only.",
    },
    {
      id: 3,
      name: "VIP Event Access",
      description: "Exclusive access to VIP events and member-only experiences",
      points: 2000,
      category: "experience",
      image: "/placeholder.svg?height=200&width=300",
      featured: true,
      expiresIn: "90 days",
      termsAndConditions: "Subject to availability. Advanced booking required.",
    },
    {
      id: 4,
      name: "Free Shipping",
      description: "Free shipping on your next online order",
      points: 300,
      category: "shipping",
      image: "/placeholder.svg?height=200&width=300",
      featured: false,
      expiresIn: "14 days",
      termsAndConditions: "Valid for orders over $25. Domestic shipping only.",
    },
    {
      id: 5,
      name: "Movie Tickets",
      description: "Two complimentary movie tickets for any showing",
      points: 1500,
      category: "entertainment",
      image: "/placeholder.svg?height=200&width=300",
      featured: false,
      expiresIn: "60 days",
      termsAndConditions: "Valid at participating theaters. Excludes premium formats.",
    },
    {
      id: 6,
      name: "Spa Day Package",
      description: "Relaxing spa day with massage and facial treatment",
      points: 5000,
      category: "experience",
      image: "/placeholder.svg?height=200&width=300",
      featured: true,
      expiresIn: "120 days",
      termsAndConditions: "Appointment required. Valid Monday-Thursday only.",
    },
  ]

  const displayRewards = rewards || mockRewards
  const userPoints = 12500 // This would come from user context

  const filteredRewards = displayRewards.filter((reward) => {
    const matchesSearch =
      reward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reward.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || reward.category === categoryFilter
    const matchesPoints =
      pointsFilter === "all" ||
      (pointsFilter === "affordable" && reward.points <= userPoints) ||
      (pointsFilter === "premium" && reward.points > userPoints)

    return matchesSearch && matchesCategory && matchesPoints
  })

  const handleRedeem = async (rewardId: number, rewardName: string, requiredPoints: number) => {
    if (requiredPoints > userPoints) {
      toast({
        title: "Insufficient Points",
        description: `You need ${requiredPoints - userPoints} more points to redeem this reward.`,
        variant: "destructive",
      })
      return
    }

    try {
      await loyaltyAPI.redeemReward(rewardId.toString())
      toast({
        title: "Reward Redeemed!",
        description: `Successfully redeemed ${rewardName}. Check your email for details.`,
      })
    } catch (error) {
      toast({
        title: "Redemption Failed",
        description: "There was an error redeeming your reward. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout role="consumer">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Rewards</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="consumer">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Rewards</h1>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Available Points</p>
            <p className="text-2xl font-bold text-purple-600">{userPoints.toLocaleString()}</p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search rewards..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="discount">Discounts</SelectItem>
                  <SelectItem value="food">Food & Drink</SelectItem>
                  <SelectItem value="experience">Experiences</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="shipping">Shipping</SelectItem>
                </SelectContent>
              </Select>
              <Select value={pointsFilter} onValueChange={setPointsFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Points" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rewards</SelectItem>
                  <SelectItem value="affordable">I Can Afford</SelectItem>
                  <SelectItem value="premium">Premium Rewards</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Featured Rewards */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Featured Rewards</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRewards
              .filter((reward) => reward.featured)
              .map((reward) => (
                <Card key={reward.id} className="overflow-hidden border-2 border-purple-200">
                  <div className="relative">
                    <img
                      src={reward.image || "/placeholder.svg"}
                      alt={reward.name}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-2 left-2 bg-purple-600">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{reward.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary" className="text-lg font-bold">
                        {reward.points.toLocaleString()} pts
                      </Badge>
                      <span className="text-xs text-muted-foreground">Expires in {reward.expiresIn}</span>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleRedeem(reward.id, reward.name, reward.points)}
                      disabled={reward.points > userPoints}
                    >
                      {reward.points > userPoints ? "Insufficient Points" : "Redeem Now"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* All Rewards */}
        <div>
          <h2 className="text-xl font-semibold mb-4">All Rewards</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRewards.map((reward) => (
              <Card key={reward.id} className="overflow-hidden">
                <img src={reward.image || "/placeholder.svg"} alt={reward.name} className="w-full h-48 object-cover" />
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{reward.name}</h3>
                    <Badge variant="outline" className="ml-2">
                      {reward.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary" className="font-bold">
                      {reward.points.toLocaleString()} pts
                    </Badge>
                    <span className="text-xs text-muted-foreground">Expires in {reward.expiresIn}</span>
                  </div>
                  <Button
                    className="w-full"
                    variant={reward.points > userPoints ? "outline" : "default"}
                    onClick={() => handleRedeem(reward.id, reward.name, reward.points)}
                    disabled={reward.points > userPoints}
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    {reward.points > userPoints ? "Need More Points" : "Redeem"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {filteredRewards.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No rewards found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria to find more rewards.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
