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
import { Textarea } from "@/components/ui/textarea"
import { Search, Building, Users, Coins, DollarSign, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

interface Partner {
  id: string
  name: string
  businessType: string
  email: string
  phone: string
  address: string
  joinDate: string
  status: "active" | "pending" | "suspended" | "rejected"
  members: number
  pointsIssued: number
  revenue: number
  commission: number
  performance: "excellent" | "good" | "fair" | "poor"
  lastActivity: string
}

export default function PartnersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)

  // Mock data - replace with actual API call
  const mockPartners: Partner[] = [
    {
      id: "1",
      name: "Coffee Shop Co",
      businessType: "Food & Beverage",
      email: "contact@coffeeshop.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, City, State 12345",
      joinDate: "2023-01-15",
      status: "active",
      members: 1250,
      pointsIssued: 125000,
      revenue: 25000,
      commission: 2500,
      performance: "excellent",
      lastActivity: "2024-01-06",
    },
    {
      id: "2",
      name: "Fashion Boutique",
      businessType: "Retail",
      email: "info@fashionboutique.com",
      phone: "+1 (555) 234-5678",
      address: "456 Fashion Ave, City, State 12345",
      joinDate: "2023-02-20",
      status: "active",
      members: 890,
      pointsIssued: 89000,
      revenue: 18000,
      commission: 1800,
      performance: "good",
      lastActivity: "2024-01-05",
    },
    {
      id: "3",
      name: "Fitness Center",
      businessType: "Health & Wellness",
      email: "hello@fitnesscenter.com",
      phone: "+1 (555) 345-6789",
      address: "789 Gym St, City, State 12345",
      joinDate: "2023-03-10",
      status: "suspended",
      members: 650,
      pointsIssued: 65000,
      revenue: 13000,
      commission: 1300,
      performance: "fair",
      lastActivity: "2023-12-20",
    },
    {
      id: "4",
      name: "Tech Store",
      businessType: "Electronics",
      email: "support@techstore.com",
      phone: "+1 (555) 456-7890",
      address: "321 Tech Blvd, City, State 12345",
      joinDate: "2023-11-15",
      status: "pending",
      members: 0,
      pointsIssued: 0,
      revenue: 0,
      commission: 0,
      performance: "poor",
      lastActivity: "2023-11-15",
    },
  ]

  const { data: partners = mockPartners, isLoading } = useQuery({
    queryKey: ["admin-partners"],
    queryFn: () => Promise.resolve(mockPartners),
  })

  const filteredPartners = partners.filter((partner) => {
    const matchesSearch =
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.businessType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || partner.status === statusFilter
    const matchesType = typeFilter === "all" || partner.businessType === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      case "rejected":
        return "bg-gray-100 text-gray-800"
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
      case "poor":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const handleStatusChange = (partnerId: string, newStatus: string) => {
    toast.success(`Partner status updated to ${newStatus}`)
  }

  const handleApproval = (partnerId: string, approved: boolean) => {
    const status = approved ? "active" : "rejected"
    toast.success(`Partner ${approved ? "approved" : "rejected"} successfully`)
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
            <h1 className="text-3xl font-bold">Partner Management</h1>
            <p className="text-muted-foreground">Manage and monitor business partners</p>
          </div>
          <Button>
            <Building className="w-4 h-4 mr-2" />
            Add Partner
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Partners</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{partners.length}</div>
              <p className="text-xs text-muted-foreground">
                {partners.filter((p) => p.status === "active").length} active
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {partners.reduce((acc, p) => acc + p.members, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Across all partners</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Points Issued</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {partners.reduce((acc, p) => acc + p.pointsIssued, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Total points</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${partners.reduce((acc, p) => acc + p.revenue, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Generated revenue</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Partners</CardTitle>
            <CardDescription>Manage business partners and applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search partners..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Health & Wellness">Health & Wellness</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Partners Table */}
            <div className="space-y-4">
              {filteredPartners.map((partner) => (
                <div key={partner.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{partner.name}</h4>
                      <p className="text-sm text-muted-foreground">{partner.businessType}</p>
                      <p className="text-xs text-muted-foreground">{partner.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{partner.members.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Members</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center space-x-1">
                        <Coins className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{partner.pointsIssued.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Points</p>
                    </div>

                    <div className="text-center">
                      <span className="font-medium">${partner.revenue.toLocaleString()}</span>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>

                    <div className="flex flex-col space-y-1">
                      <Badge className={getStatusColor(partner.status)}>
                        {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
                      </Badge>
                      <span className={`text-xs font-medium ${getPerformanceColor(partner.performance)}`}>
                        {partner.performance}
                      </span>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedPartner(partner)}>
                          Manage
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Manage Partner: {partner.name}</DialogTitle>
                          <DialogDescription>Review and manage partner information and status</DialogDescription>
                        </DialogHeader>

                        <Tabs defaultValue="details" className="w-full">
                          <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="performance">Performance</TabsTrigger>
                            <TabsTrigger value="settings">Settings</TabsTrigger>
                            <TabsTrigger value="actions">Actions</TabsTrigger>
                          </TabsList>

                          <TabsContent value="details" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Business Name</label>
                                <Input value={partner.name} readOnly />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Business Type</label>
                                <Input value={partner.businessType} readOnly />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Email</label>
                                <Input value={partner.email} readOnly />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Phone</label>
                                <Input value={partner.phone} readOnly />
                              </div>
                              <div className="col-span-2">
                                <label className="text-sm font-medium">Address</label>
                                <Input value={partner.address} readOnly />
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="performance" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm">Members</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="text-2xl font-bold">{partner.members.toLocaleString()}</div>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm">Points Issued</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="text-2xl font-bold">{partner.pointsIssued.toLocaleString()}</div>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm">Revenue Generated</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="text-2xl font-bold">${partner.revenue.toLocaleString()}</div>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm">Commission Earned</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="text-2xl font-bold">${partner.commission.toLocaleString()}</div>
                                </CardContent>
                              </Card>
                            </div>
                          </TabsContent>

                          <TabsContent value="settings" className="space-y-4">
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium">Commission Rate (%)</label>
                                <Input type="number" defaultValue="10" />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Point Conversion Rate</label>
                                <Input defaultValue="1 point = $0.01" />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Monthly Limit</label>
                                <Input type="number" defaultValue="50000" />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Notes</label>
                                <Textarea placeholder="Internal notes about this partner..." />
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="actions" className="space-y-4">
                            {partner.status === "pending" && (
                              <div className="grid grid-cols-2 gap-4">
                                <Button
                                  className="flex items-center justify-center"
                                  onClick={() => handleApproval(partner.id, true)}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Approve Partner
                                </Button>
                                <Button
                                  variant="destructive"
                                  className="flex items-center justify-center"
                                  onClick={() => handleApproval(partner.id, false)}
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject Partner
                                </Button>
                              </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                              <Button
                                variant="outline"
                                className="flex items-center justify-center bg-transparent"
                                onClick={() => handleStatusChange(partner.id, "active")}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Activate
                              </Button>
                              <Button
                                variant="outline"
                                className="flex items-center justify-center bg-transparent"
                                onClick={() => handleStatusChange(partner.id, "suspended")}
                              >
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                Suspend
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
