"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  Plus,
  Store,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  TrendingUp,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Merchant {
  id: string
  businessName: string
  ownerName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  category: string
  status: "active" | "pending" | "suspended" | "rejected"
  joinDate: string
  totalRevenue: number
  totalCustomers: number
  pointsIssued: number
  commissionRate: number
  description: string
  website?: string
  taxId?: string
}

const mockMerchants: Merchant[] = [
  {
    id: "MERCH001",
    businessName: "Downtown Coffee Shop",
    ownerName: "Sarah Johnson",
    email: "sarah@downtowncoffee.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    category: "Food & Beverage",
    status: "active",
    joinDate: "2024-01-15",
    totalRevenue: 45000,
    totalCustomers: 1250,
    pointsIssued: 125000,
    commissionRate: 5.0,
    description: "Premium coffee shop serving artisanal coffee and pastries",
    website: "https://downtowncoffee.com",
    taxId: "12-3456789",
  },
  {
    id: "MERCH002",
    businessName: "Fashion Forward Boutique",
    ownerName: "Michael Chen",
    email: "michael@fashionforward.com",
    phone: "+1 (555) 234-5678",
    address: "456 Fashion Ave",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90210",
    category: "Fashion & Apparel",
    status: "active",
    joinDate: "2024-02-20",
    totalRevenue: 78000,
    totalCustomers: 890,
    pointsIssued: 89000,
    commissionRate: 7.5,
    description: "Trendy fashion boutique with latest styles and accessories",
    website: "https://fashionforward.com",
    taxId: "98-7654321",
  },
  {
    id: "MERCH003",
    businessName: "Tech Gadgets Plus",
    ownerName: "Emily Rodriguez",
    email: "emily@techgadgets.com",
    phone: "+1 (555) 345-6789",
    address: "789 Tech Boulevard",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    category: "Electronics",
    status: "pending",
    joinDate: "2024-12-01",
    totalRevenue: 0,
    totalCustomers: 0,
    pointsIssued: 0,
    commissionRate: 6.0,
    description: "Latest technology gadgets and accessories",
    website: "https://techgadgets.com",
    taxId: "45-6789012",
  },
  {
    id: "MERCH004",
    businessName: "Healthy Eats Restaurant",
    ownerName: "David Kim",
    email: "david@healthyeats.com",
    phone: "+1 (555) 456-7890",
    address: "321 Wellness Way",
    city: "Austin",
    state: "TX",
    zipCode: "73301",
    category: "Food & Beverage",
    status: "suspended",
    joinDate: "2024-03-10",
    totalRevenue: 32000,
    totalCustomers: 650,
    pointsIssued: 65000,
    commissionRate: 4.5,
    description: "Organic and healthy food restaurant",
    website: "https://healthyeats.com",
    taxId: "67-8901234",
  },
]

const categories = [
  "Food & Beverage",
  "Fashion & Apparel",
  "Electronics",
  "Health & Beauty",
  "Home & Garden",
  "Sports & Recreation",
  "Automotive",
  "Services",
  "Other",
]

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState<Merchant[]>(mockMerchants)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const [newMerchant, setNewMerchant] = useState<Partial<Merchant>>({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    category: "",
    status: "pending",
    commissionRate: 5.0,
    description: "",
    website: "",
    taxId: "",
  })

  const filteredMerchants = merchants.filter((merchant) => {
    const matchesSearch =
      merchant.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || merchant.status === statusFilter
    const matchesCategory = categoryFilter === "all" || merchant.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const stats = {
    totalMerchants: merchants.length,
    activeMerchants: merchants.filter((m) => m.status === "active").length,
    pendingMerchants: merchants.filter((m) => m.status === "pending").length,
    totalRevenue: merchants.reduce((sum, m) => sum + m.totalRevenue, 0),
  }

  const handleCreateMerchant = async () => {
    setIsLoading(true)
    try {
      const merchant: Merchant = {
        ...(newMerchant as Merchant),
        id: `MERCH${String(merchants.length + 1).padStart(3, "0")}`,
        joinDate: new Date().toISOString().split("T")[0],
        totalRevenue: 0,
        totalCustomers: 0,
        pointsIssued: 0,
      }

      setMerchants([...merchants, merchant])
      setIsCreateDialogOpen(false)
      setNewMerchant({
        businessName: "",
        ownerName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        category: "",
        status: "pending",
        commissionRate: 5.0,
        description: "",
        website: "",
        taxId: "",
      })

      toast({
        title: "Merchant Created",
        description: "New merchant has been successfully added to the system.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create merchant. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateMerchant = async () => {
    if (!selectedMerchant) return

    setIsLoading(true)
    try {
      setMerchants(merchants.map((m) => (m.id === selectedMerchant.id ? selectedMerchant : m)))
      setIsEditDialogOpen(false)
      setSelectedMerchant(null)

      toast({
        title: "Merchant Updated",
        description: "Merchant information has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update merchant. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (merchantId: string, newStatus: string) => {
    setIsLoading(true)
    try {
      setMerchants(merchants.map((m) => (m.id === merchantId ? { ...m, status: newStatus as Merchant["status"] } : m)))

      toast({
        title: "Status Updated",
        description: `Merchant status has been changed to ${newStatus}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update merchant status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteMerchant = async (merchantId: string) => {
    setIsLoading(true)
    try {
      setMerchants(merchants.filter((m) => m.id !== merchantId))

      toast({
        title: "Merchant Deleted",
        description: "Merchant has been successfully removed from the system.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete merchant. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "suspended":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Suspended
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Merchants Management</h1>
          <p className="text-muted-foreground">Manage merchant partners and their business relationships</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Merchant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Merchant</DialogTitle>
              <DialogDescription>Create a new merchant account in the loyalty program</DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="business" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="business">Business Info</TabsTrigger>
                <TabsTrigger value="contact">Contact Details</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="business" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      value={newMerchant.businessName}
                      onChange={(e) => setNewMerchant({ ...newMerchant, businessName: e.target.value })}
                      placeholder="Enter business name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Owner Name *</Label>
                    <Input
                      id="ownerName"
                      value={newMerchant.ownerName}
                      onChange={(e) => setNewMerchant({ ...newMerchant, ownerName: e.target.value })}
                      placeholder="Enter owner name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={newMerchant.category}
                      onValueChange={(value) => setNewMerchant({ ...newMerchant, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxId">Tax ID</Label>
                    <Input
                      id="taxId"
                      value={newMerchant.taxId}
                      onChange={(e) => setNewMerchant({ ...newMerchant, taxId: e.target.value })}
                      placeholder="Enter tax ID"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea
                    id="description"
                    value={newMerchant.description}
                    onChange={(e) => setNewMerchant({ ...newMerchant, description: e.target.value })}
                    placeholder="Describe the business"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={newMerchant.website}
                    onChange={(e) => setNewMerchant({ ...newMerchant, website: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newMerchant.email}
                      onChange={(e) => setNewMerchant({ ...newMerchant, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={newMerchant.phone}
                      onChange={(e) => setNewMerchant({ ...newMerchant, phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    value={newMerchant.address}
                    onChange={(e) => setNewMerchant({ ...newMerchant, address: e.target.value })}
                    placeholder="Enter street address"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={newMerchant.city}
                      onChange={(e) => setNewMerchant({ ...newMerchant, city: e.target.value })}
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={newMerchant.state}
                      onChange={(e) => setNewMerchant({ ...newMerchant, state: e.target.value })}
                      placeholder="Enter state"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={newMerchant.zipCode}
                      onChange={(e) => setNewMerchant({ ...newMerchant, zipCode: e.target.value })}
                      placeholder="Enter ZIP code"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Initial Status</Label>
                    <Select
                      value={newMerchant.status}
                      onValueChange={(value) => setNewMerchant({ ...newMerchant, status: value as Merchant["status"] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                    <Input
                      id="commissionRate"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={newMerchant.commissionRate}
                      onChange={(e) =>
                        setNewMerchant({ ...newMerchant, commissionRate: Number.parseFloat(e.target.value) || 0 })
                      }
                      placeholder="5.0"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateMerchant} disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Merchant"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Merchants</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMerchants}</div>
            <p className="text-xs text-muted-foreground">All registered merchants</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Merchants</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeMerchants}</div>
            <p className="text-xs text-muted-foreground">Currently active partners</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingMerchants}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From all merchants</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Merchant Directory</CardTitle>
          <CardDescription>Search and filter merchants by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search merchants..."
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
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Merchants List */}
          <div className="space-y-4">
            {filteredMerchants.map((merchant) => (
              <Card key={merchant.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Store className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{merchant.businessName}</h3>
                      <p className="text-sm text-muted-foreground">{merchant.ownerName}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3 mr-1" />
                          {merchant.city}, {merchant.state}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Mail className="w-3 h-3 mr-1" />
                          {merchant.email}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3 mr-1" />
                          Joined {new Date(merchant.joinDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">${merchant.totalRevenue.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Revenue</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{merchant.totalCustomers}</div>
                      <div className="text-xs text-muted-foreground">Customers</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{merchant.pointsIssued.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Points Issued</div>
                    </div>
                    {getStatusBadge(merchant.status)}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedMerchant(merchant)
                          setIsViewDialogOpen(true)
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedMerchant(merchant)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteMerchant(merchant.id)}
                        disabled={merchant.status === "active"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredMerchants.length === 0 && (
            <div className="text-center py-8">
              <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No merchants found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or add a new merchant.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Merchant Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Merchant Details</DialogTitle>
            <DialogDescription>Complete information about {selectedMerchant?.businessName}</DialogDescription>
          </DialogHeader>
          {selectedMerchant && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Business Name</Label>
                    <p className="text-sm text-muted-foreground">{selectedMerchant.businessName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Owner Name</Label>
                    <p className="text-sm text-muted-foreground">{selectedMerchant.ownerName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm text-muted-foreground">{selectedMerchant.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Phone</Label>
                    <p className="text-sm text-muted-foreground">{selectedMerchant.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Category</Label>
                    <p className="text-sm text-muted-foreground">{selectedMerchant.category}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedMerchant.status)}</div>
                  </div>
                </div>
                <Separator />
                <div>
                  <Label className="text-sm font-medium">Address</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedMerchant.address}
                    <br />
                    {selectedMerchant.city}, {selectedMerchant.state} {selectedMerchant.zipCode}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground">{selectedMerchant.description}</p>
                </div>
                {selectedMerchant.website && (
                  <div>
                    <Label className="text-sm font-medium">Website</Label>
                    <p className="text-sm text-muted-foreground">{selectedMerchant.website}</p>
                  </div>
                )}
                {selectedMerchant.taxId && (
                  <div>
                    <Label className="text-sm font-medium">Tax ID</Label>
                    <p className="text-sm text-muted-foreground">{selectedMerchant.taxId}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${selectedMerchant.totalRevenue.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Total Customers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedMerchant.totalCustomers}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Points Issued</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedMerchant.pointsIssued.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Commission Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedMerchant.commissionRate}%</div>
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <Label className="text-sm font-medium">Join Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedMerchant.joinDate).toLocaleDateString()}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="actions" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Change Status</Label>
                    <Select
                      value={selectedMerchant.status}
                      onValueChange={(value) => handleStatusChange(selectedMerchant.id, value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full bg-transparent">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Merchant
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Merchant Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Merchant</DialogTitle>
            <DialogDescription>Update merchant information and settings</DialogDescription>
          </DialogHeader>
          {selectedMerchant && (
            <Tabs defaultValue="business" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="business">Business Info</TabsTrigger>
                <TabsTrigger value="contact">Contact Details</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="business" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editBusinessName">Business Name *</Label>
                    <Input
                      id="editBusinessName"
                      value={selectedMerchant.businessName}
                      onChange={(e) => setSelectedMerchant({ ...selectedMerchant, businessName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editOwnerName">Owner Name *</Label>
                    <Input
                      id="editOwnerName"
                      value={selectedMerchant.ownerName}
                      onChange={(e) => setSelectedMerchant({ ...selectedMerchant, ownerName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editCategory">Category *</Label>
                    <Select
                      value={selectedMerchant.category}
                      onValueChange={(value) => setSelectedMerchant({ ...selectedMerchant, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editTaxId">Tax ID</Label>
                    <Input
                      id="editTaxId"
                      value={selectedMerchant.taxId || ""}
                      onChange={(e) => setSelectedMerchant({ ...selectedMerchant, taxId: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editDescription">Business Description</Label>
                  <Textarea
                    id="editDescription"
                    value={selectedMerchant.description}
                    onChange={(e) => setSelectedMerchant({ ...selectedMerchant, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editWebsite">Website</Label>
                  <Input
                    id="editWebsite"
                    value={selectedMerchant.website || ""}
                    onChange={(e) => setSelectedMerchant({ ...selectedMerchant, website: e.target.value })}
                  />
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editEmail">Email Address *</Label>
                    <Input
                      id="editEmail"
                      type="email"
                      value={selectedMerchant.email}
                      onChange={(e) => setSelectedMerchant({ ...selectedMerchant, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editPhone">Phone Number *</Label>
                    <Input
                      id="editPhone"
                      value={selectedMerchant.phone}
                      onChange={(e) => setSelectedMerchant({ ...selectedMerchant, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editAddress">Street Address *</Label>
                  <Input
                    id="editAddress"
                    value={selectedMerchant.address}
                    onChange={(e) => setSelectedMerchant({ ...selectedMerchant, address: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editCity">City *</Label>
                    <Input
                      id="editCity"
                      value={selectedMerchant.city}
                      onChange={(e) => setSelectedMerchant({ ...selectedMerchant, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editState">State *</Label>
                    <Input
                      id="editState"
                      value={selectedMerchant.state}
                      onChange={(e) => setSelectedMerchant({ ...selectedMerchant, state: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editZipCode">ZIP Code *</Label>
                    <Input
                      id="editZipCode"
                      value={selectedMerchant.zipCode}
                      onChange={(e) => setSelectedMerchant({ ...selectedMerchant, zipCode: e.target.value })}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editStatus">Status</Label>
                    <Select
                      value={selectedMerchant.status}
                      onValueChange={(value) =>
                        setSelectedMerchant({ ...selectedMerchant, status: value as Merchant["status"] })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editCommissionRate">Commission Rate (%)</Label>
                    <Input
                      id="editCommissionRate"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={selectedMerchant.commissionRate}
                      onChange={(e) =>
                        setSelectedMerchant({
                          ...selectedMerchant,
                          commissionRate: Number.parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateMerchant} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Merchant"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
