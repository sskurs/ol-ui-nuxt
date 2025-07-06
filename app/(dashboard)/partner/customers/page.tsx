"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { partnerAPI } from "@/lib/api"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Users, Gift, TrendingUp, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [tierFilter, setTierFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [showIssuePoints, setShowIssuePoints] = useState(false)
  const [pointsForm, setPointsForm] = useState({ points: "", description: "" })
  const { toast } = useToast()

  const { data: customersData, isLoading } = useQuery({
    queryKey: ["partner-customers", currentPage, searchTerm],
    queryFn: () => partnerAPI.getCustomers(currentPage, 10, searchTerm),
  })

  // Mock customers data
  const mockCustomers = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      phone: "+1 (555) 123-4567",
      points: 2500,
      tier: "Gold",
      status: "active",
      lastVisit: "2024-01-15",
      totalSpent: 1250.0,
      visitsCount: 15,
      joinDate: "2023-06-15",
      avatar: "/placeholder.svg?height=40&width=40",
      recentTransactions: [
        { date: "2024-01-15", points: 250, description: "Purchase - Coffee & Pastry" },
        { date: "2024-01-10", points: 150, description: "Purchase - Lunch Special" },
        { date: "2024-01-05", points: 200, description: "Purchase - Catering Order" },
      ],
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      phone: "+1 (555) 234-5678",
      points: 1500,
      tier: "Silver",
      status: "active",
      lastVisit: "2024-01-14",
      totalSpent: 750.0,
      visitsCount: 8,
      joinDate: "2023-09-20",
      avatar: "/placeholder.svg?height=40&width=40",
      recentTransactions: [
        { date: "2024-01-14", points: 100, description: "Purchase - Morning Coffee" },
        { date: "2024-01-12", points: 200, description: "Purchase - Business Meeting" },
      ],
    },
    {
      id: 3,
      name: "Carol Davis",
      email: "carol@example.com",
      phone: "+1 (555) 345-6789",
      points: 800,
      tier: "Bronze",
      status: "inactive",
      lastVisit: "2023-12-20",
      totalSpent: 400.0,
      visitsCount: 4,
      joinDate: "2023-11-10",
      avatar: "/placeholder.svg?height=40&width=40",
      recentTransactions: [{ date: "2023-12-20", points: 50, description: "Purchase - Quick Snack" }],
    },
    {
      id: 4,
      name: "David Wilson",
      email: "david@example.com",
      phone: "+1 (555) 456-7890",
      points: 5000,
      tier: "Platinum",
      status: "active",
      lastVisit: "2024-01-16",
      totalSpent: 2500.0,
      visitsCount: 25,
      joinDate: "2023-03-01",
      avatar: "/placeholder.svg?height=40&width=40",
      recentTransactions: [
        { date: "2024-01-16", points: 500, description: "Purchase - Corporate Event" },
        { date: "2024-01-14", points: 300, description: "Purchase - Team Lunch" },
        { date: "2024-01-12", points: 200, description: "Purchase - Client Meeting" },
      ],
    },
  ]

  const customers = customersData?.customers || mockCustomers

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTier = tierFilter === "all" || customer.tier.toLowerCase() === tierFilter
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter

    return matchesSearch && matchesTier && matchesStatus
  })

  const handleIssuePoints = async () => {
    if (!selectedCustomer || !pointsForm.points || !pointsForm.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      await partnerAPI.issuePoints(
        selectedCustomer.id.toString(),
        Number.parseInt(pointsForm.points),
        pointsForm.description,
      )
      toast({
        title: "Points Issued",
        description: `Successfully issued ${pointsForm.points} points to ${selectedCustomer.name}.`,
      })
      setShowIssuePoints(false)
      setPointsForm({ points: "", description: "" })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to issue points. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "platinum":
        return "bg-purple-100 text-purple-800"
      case "gold":
        return "bg-yellow-100 text-yellow-800"
      case "silver":
        return "bg-gray-100 text-gray-800"
      case "bronze":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  if (isLoading) {
    return (
      <DashboardLayout role="partner">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="partner">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers.filter((c) => c.status === "active").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points Issued</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {customers.reduce((sum, c) => sum + c.points, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Points per Customer</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(customers.reduce((sum, c) => sum + c.points, 0) / customers.length).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="bronze">Bronze</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Customers</CardTitle>
            <CardDescription>Manage your customer base and loyalty program participation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCustomers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={customer.avatar || "/placeholder.svg"} alt={customer.name} />
                      <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{customer.name}</h4>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getTierColor(customer.tier)}>{customer.tier}</Badge>
                        <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium">{customer.points.toLocaleString()}</p>
                        <p className="text-muted-foreground">Points</p>
                      </div>
                      <div>
                        <p className="font-medium">{customer.visitsCount}</p>
                        <p className="text-muted-foreground">Visits</p>
                      </div>
                      <div>
                        <p className="font-medium">${customer.totalSpent.toFixed(2)}</p>
                        <p className="text-muted-foreground">Spent</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Last visit: {customer.lastVisit}</p>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedCustomer(customer)}>
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedCustomer(customer)
                        setShowIssuePoints(true)
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Issue Points
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Details Dialog */}
        <Dialog open={!!selectedCustomer && !showIssuePoints} onOpenChange={() => setSelectedCustomer(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
              <DialogDescription>View detailed information about {selectedCustomer?.name}</DialogDescription>
            </DialogHeader>
            {selectedCustomer && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedCustomer.avatar || "/placeholder.svg"} alt={selectedCustomer.name} />
                    <AvatarFallback className="text-lg">{selectedCustomer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedCustomer.name}</h3>
                    <p className="text-muted-foreground">{selectedCustomer.email}</p>
                    <p className="text-muted-foreground">{selectedCustomer.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">{selectedCustomer.points.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Points</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">{selectedCustomer.tier}</p>
                    <p className="text-sm text-muted-foreground">Tier</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">{selectedCustomer.visitsCount}</p>
                    <p className="text-sm text-muted-foreground">Visits</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">${selectedCustomer.totalSpent.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Recent Transactions</h4>
                  <div className="space-y-2">
                    {selectedCustomer.recentTransactions.map((transaction: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">{transaction.date}</p>
                        </div>
                        <Badge variant="secondary">+{transaction.points} pts</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Issue Points Dialog */}
        <Dialog open={showIssuePoints} onOpenChange={setShowIssuePoints}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Issue Points</DialogTitle>
              <DialogDescription>Issue loyalty points to {selectedCustomer?.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="points">Points to Issue</Label>
                <Input
                  id="points"
                  type="number"
                  placeholder="Enter points amount"
                  value={pointsForm.points}
                  onChange={(e) => setPointsForm((prev) => ({ ...prev, points: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter reason for issuing points"
                  value={pointsForm.description}
                  onChange={(e) => setPointsForm((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowIssuePoints(false)}>
                  Cancel
                </Button>
                <Button onClick={handleIssuePoints}>Issue Points</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
