"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, UserPlus, Mail, Phone, Calendar, Coins, Gift, Ban, CheckCircle } from "lucide-react"
import { toast } from "sonner"

interface Member {
  id: string
  name: string
  email: string
  phone: string
  joinDate: string
  tier: "bronze" | "silver" | "gold" | "platinum"
  points: number
  totalSpent: number
  status: "active" | "inactive" | "suspended"
  lastActivity: string
  transactionCount: number
}

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [tierFilter, setTierFilter] = useState("all")
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  // Mock data - replace with actual API call
  const mockMembers: Member[] = [
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice@example.com",
      phone: "+1 (555) 123-4567",
      joinDate: "2023-01-15",
      tier: "gold",
      points: 2500,
      totalSpent: 1250.0,
      status: "active",
      lastActivity: "2024-01-05",
      transactionCount: 45,
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob@example.com",
      phone: "+1 (555) 234-5678",
      joinDate: "2023-03-22",
      tier: "silver",
      points: 1200,
      totalSpent: 600.0,
      status: "active",
      lastActivity: "2024-01-03",
      transactionCount: 28,
    },
    {
      id: "3",
      name: "Carol Davis",
      email: "carol@example.com",
      phone: "+1 (555) 345-6789",
      joinDate: "2023-06-10",
      tier: "platinum",
      points: 5000,
      totalSpent: 2500.0,
      status: "active",
      lastActivity: "2024-01-06",
      transactionCount: 78,
    },
    {
      id: "4",
      name: "David Wilson",
      email: "david@example.com",
      phone: "+1 (555) 456-7890",
      joinDate: "2023-08-05",
      tier: "bronze",
      points: 450,
      totalSpent: 225.0,
      status: "inactive",
      lastActivity: "2023-12-15",
      transactionCount: 12,
    },
  ]

  const { data: members = mockMembers, isLoading } = useQuery({
    queryKey: ["admin-members"],
    queryFn: () => Promise.resolve(mockMembers),
  })

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || member.status === statusFilter
    const matchesTier = tierFilter === "all" || member.tier === tierFilter
    return matchesSearch && matchesStatus && matchesTier
  })

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "bronze":
        return "bg-amber-100 text-amber-800"
      case "silver":
        return "bg-gray-100 text-gray-800"
      case "gold":
        return "bg-yellow-100 text-yellow-800"
      case "platinum":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleStatusChange = (memberId: string, newStatus: string) => {
    toast.success(`Member status updated to ${newStatus}`)
  }

  const handlePointsAdjustment = (memberId: string, points: number) => {
    toast.success(`Points ${points > 0 ? "added" : "deducted"} successfully`)
  }

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
          <div>
            <h1 className="text-3xl font-bold">Member Management</h1>
            <p className="text-muted-foreground">Manage and monitor loyalty program members</p>
          </div>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{members.length.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{members.filter((m) => m.status === "active").length}</div>
              <p className="text-xs text-muted-foreground">85% of total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(members.reduce((acc, m) => acc + m.points, 0) / members.length).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Per member</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${members.reduce((acc, m) => acc + m.totalSpent, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Lifetime value</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <CardDescription>Search and filter loyalty program members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="bronze">Bronze</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Members Table */}
            <div className="space-y-4">
              {filteredMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">{member.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {member.email}
                        </span>
                        <span className="flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {member.phone}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Joined {new Date(member.joinDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="flex items-center space-x-1">
                        <Coins className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{member.points.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Points</p>
                    </div>

                    <div className="text-center">
                      <span className="font-medium">${member.totalSpent.toFixed(2)}</span>
                      <p className="text-xs text-muted-foreground">Total Spent</p>
                    </div>

                    <div className="flex flex-col space-y-1">
                      <Badge className={getTierColor(member.tier)}>
                        {member.tier.charAt(0).toUpperCase() + member.tier.slice(1)}
                      </Badge>
                      <Badge className={getStatusColor(member.status)}>
                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                      </Badge>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedMember(member)}>
                          Manage
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Manage Member: {member.name}</DialogTitle>
                          <DialogDescription>Update member information and manage their account</DialogDescription>
                        </DialogHeader>

                        <Tabs defaultValue="details" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="points">Points</TabsTrigger>
                            <TabsTrigger value="actions">Actions</TabsTrigger>
                          </TabsList>

                          <TabsContent value="details" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Name</label>
                                <Input value={member.name} readOnly />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Email</label>
                                <Input value={member.email} readOnly />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Phone</label>
                                <Input value={member.phone} readOnly />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Tier</label>
                                <Select defaultValue={member.tier}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="bronze">Bronze</SelectItem>
                                    <SelectItem value="silver">Silver</SelectItem>
                                    <SelectItem value="gold">Gold</SelectItem>
                                    <SelectItem value="platinum">Platinum</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="points" className="space-y-4">
                            <div className="text-center p-4 bg-muted rounded-lg">
                              <div className="text-2xl font-bold">{member.points.toLocaleString()}</div>
                              <p className="text-sm text-muted-foreground">Current Points Balance</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Add Points</label>
                                <div className="flex space-x-2">
                                  <Input type="number" placeholder="Amount" />
                                  <Button onClick={() => handlePointsAdjustment(member.id, 100)}>Add</Button>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Deduct Points</label>
                                <div className="flex space-x-2">
                                  <Input type="number" placeholder="Amount" />
                                  <Button variant="outline" onClick={() => handlePointsAdjustment(member.id, -100)}>
                                    Deduct
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="actions" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <Button
                                variant="outline"
                                className="flex items-center justify-center bg-transparent"
                                onClick={() => handleStatusChange(member.id, "active")}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Activate Account
                              </Button>
                              <Button
                                variant="outline"
                                className="flex items-center justify-center bg-transparent"
                                onClick={() => handleStatusChange(member.id, "suspended")}
                              >
                                <Ban className="w-4 h-4 mr-2" />
                                Suspend Account
                              </Button>
                              <Button variant="outline" className="flex items-center justify-center bg-transparent">
                                <Mail className="w-4 h-4 mr-2" />
                                Send Email
                              </Button>
                              <Button variant="outline" className="flex items-center justify-center bg-transparent">
                                <Gift className="w-4 h-4 mr-2" />
                                Send Reward
                              </Button>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
