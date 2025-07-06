"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
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
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Plus, Edit, Trash2, Calculator, DollarSign, Calendar, Users, Tag, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EarningRule {
  id: string
  name: string
  description: string
  type: "purchase" | "signup" | "referral" | "birthday" | "review" | "social" | "category" | "time_based"
  status: "active" | "inactive" | "scheduled"
  pointsPerDollar?: number
  fixedPoints?: number
  multiplier?: number
  minAmount?: number
  maxPoints?: number
  category?: string
  startDate?: string
  endDate?: string
  conditions: string[]
  priority: number
  usageCount: number
  totalPointsAwarded: number
  createdAt: string
  updatedAt: string
}

const mockEarningRules: EarningRule[] = [
  {
    id: "1",
    name: "Standard Purchase Points",
    description: "Earn 1 point for every $1 spent on regular purchases",
    type: "purchase",
    status: "active",
    pointsPerDollar: 1,
    minAmount: 0,
    maxPoints: 1000,
    conditions: ["Minimum purchase $0", "Maximum 1000 points per transaction"],
    priority: 1,
    usageCount: 15420,
    totalPointsAwarded: 245680,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "New Member Bonus",
    description: "Welcome bonus for new member registration",
    type: "signup",
    status: "active",
    fixedPoints: 500,
    conditions: ["One-time bonus", "Account must be verified"],
    priority: 5,
    usageCount: 1250,
    totalPointsAwarded: 625000,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-20",
  },
  {
    id: "3",
    name: "Electronics Double Points",
    description: "Earn 2x points on electronics purchases",
    type: "category",
    status: "active",
    pointsPerDollar: 2,
    category: "Electronics",
    minAmount: 50,
    conditions: ["Electronics category only", "Minimum $50 purchase"],
    priority: 3,
    usageCount: 890,
    totalPointsAwarded: 45600,
    createdAt: "2024-01-12",
    updatedAt: "2024-01-25",
  },
  {
    id: "4",
    name: "Weekend Bonus",
    description: "1.5x points multiplier on weekend purchases",
    type: "time_based",
    status: "active",
    multiplier: 1.5,
    conditions: ["Saturday and Sunday only", "All purchase types"],
    priority: 2,
    usageCount: 3420,
    totalPointsAwarded: 89500,
    createdAt: "2024-01-08",
    updatedAt: "2024-01-22",
  },
  {
    id: "5",
    name: "Referral Reward",
    description: "Bonus points for successful referrals",
    type: "referral",
    status: "active",
    fixedPoints: 1000,
    conditions: ["Referred member must make first purchase", "Maximum 10 referrals per month"],
    priority: 4,
    usageCount: 340,
    totalPointsAwarded: 340000,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-18",
  },
  {
    id: "6",
    name: "Birthday Special",
    description: "Special birthday month bonus points",
    type: "birthday",
    status: "scheduled",
    fixedPoints: 200,
    conditions: ["During birthday month only", "One-time per year"],
    priority: 6,
    usageCount: 0,
    totalPointsAwarded: 0,
    createdAt: "2024-01-30",
    updatedAt: "2024-01-30",
  },
]

const ruleTypeConfig = {
  purchase: { label: "Purchase", icon: DollarSign, color: "bg-green-100 text-green-800" },
  signup: { label: "Sign Up", icon: Users, color: "bg-blue-100 text-blue-800" },
  referral: { label: "Referral", icon: Users, color: "bg-purple-100 text-purple-800" },
  birthday: { label: "Birthday", icon: Calendar, color: "bg-pink-100 text-pink-800" },
  review: { label: "Review", icon: Tag, color: "bg-yellow-100 text-yellow-800" },
  social: { label: "Social", icon: Tag, color: "bg-indigo-100 text-indigo-800" },
  category: { label: "Category", icon: Tag, color: "bg-orange-100 text-orange-800" },
  time_based: { label: "Time Based", icon: Clock, color: "bg-teal-100 text-teal-800" },
}

export default function EarningRulesPage() {
  const [rules, setRules] = useState<EarningRule[]>(mockEarningRules)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<EarningRule | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "purchase" as EarningRule["type"],
    status: "active" as EarningRule["status"],
    pointsPerDollar: 1,
    fixedPoints: 0,
    multiplier: 1,
    minAmount: 0,
    maxPoints: 1000,
    category: "",
    startDate: "",
    endDate: "",
    conditions: [""],
    priority: 1,
  })

  const filteredRules = rules.filter((rule) => {
    const matchesSearch =
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || rule.status === statusFilter
    const matchesType = typeFilter === "all" || rule.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const totalRules = rules.length
  const activeRules = rules.filter((r) => r.status === "active").length
  const totalPointsAwarded = rules.reduce((sum, rule) => sum + rule.totalPointsAwarded, 0)
  const totalUsage = rules.reduce((sum, rule) => sum + rule.usageCount, 0)

  const handleCreateRule = async () => {
    setIsLoading(true)
    try {
      const newRule: EarningRule = {
        id: Date.now().toString(),
        ...formData,
        conditions: formData.conditions.filter((c) => c.trim() !== ""),
        usageCount: 0,
        totalPointsAwarded: 0,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      }

      setRules([...rules, newRule])
      setIsCreateDialogOpen(false)
      resetForm()
      toast({
        title: "Success",
        description: "Earning rule created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create earning rule",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditRule = async () => {
    if (!editingRule) return

    setIsLoading(true)
    try {
      const updatedRule = {
        ...editingRule,
        ...formData,
        conditions: formData.conditions.filter((c) => c.trim() !== ""),
        updatedAt: new Date().toISOString().split("T")[0],
      }

      setRules(rules.map((rule) => (rule.id === editingRule.id ? updatedRule : rule)))
      setEditingRule(null)
      resetForm()
      toast({
        title: "Success",
        description: "Earning rule updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update earning rule",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteRule = async (ruleId: string) => {
    try {
      setRules(rules.filter((rule) => rule.id !== ruleId))
      toast({
        title: "Success",
        description: "Earning rule deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete earning rule",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (ruleId: string) => {
    try {
      setRules(
        rules.map((rule) =>
          rule.id === ruleId
            ? { ...rule, status: rule.status === "active" ? "inactive" : ("active" as EarningRule["status"]) }
            : rule,
        ),
      )
      toast({
        title: "Success",
        description: "Rule status updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update rule status",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "purchase",
      status: "active",
      pointsPerDollar: 1,
      fixedPoints: 0,
      multiplier: 1,
      minAmount: 0,
      maxPoints: 1000,
      category: "",
      startDate: "",
      endDate: "",
      conditions: [""],
      priority: 1,
    })
  }

  const openEditDialog = (rule: EarningRule) => {
    setEditingRule(rule)
    setFormData({
      name: rule.name,
      description: rule.description,
      type: rule.type,
      status: rule.status,
      pointsPerDollar: rule.pointsPerDollar || 1,
      fixedPoints: rule.fixedPoints || 0,
      multiplier: rule.multiplier || 1,
      minAmount: rule.minAmount || 0,
      maxPoints: rule.maxPoints || 1000,
      category: rule.category || "",
      startDate: rule.startDate || "",
      endDate: rule.endDate || "",
      conditions: rule.conditions.length > 0 ? rule.conditions : [""],
      priority: rule.priority,
    })
  }

  const addCondition = () => {
    setFormData({
      ...formData,
      conditions: [...formData.conditions, ""],
    })
  }

  const updateCondition = (index: number, value: string) => {
    const newConditions = [...formData.conditions]
    newConditions[index] = value
    setFormData({
      ...formData,
      conditions: newConditions,
    })
  }

  const removeCondition = (index: number) => {
    setFormData({
      ...formData,
      conditions: formData.conditions.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Earning Rules</h1>
          <p className="text-muted-foreground">Manage how members earn points in your loyalty program</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Earning Rule</DialogTitle>
              <DialogDescription>Set up a new rule for how members can earn points</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="conditions">Conditions</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Rule Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Standard Purchase Points"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Rule Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: EarningRule["type"]) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="purchase">Purchase</SelectItem>
                        <SelectItem value="signup">Sign Up</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                        <SelectItem value="birthday">Birthday</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                        <SelectItem value="category">Category</SelectItem>
                        <SelectItem value="time_based">Time Based</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe how this rule works..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: EarningRule["status"]) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Input
                      id="priority"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: Number.parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                {formData.type === "purchase" || formData.type === "category" ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pointsPerDollar">Points per Dollar</Label>
                      <Input
                        id="pointsPerDollar"
                        type="number"
                        min="0"
                        step="0.1"
                        value={formData.pointsPerDollar}
                        onChange={(e) =>
                          setFormData({ ...formData, pointsPerDollar: Number.parseFloat(e.target.value) })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minAmount">Minimum Amount ($)</Label>
                      <Input
                        id="minAmount"
                        type="number"
                        min="0"
                        value={formData.minAmount}
                        onChange={(e) => setFormData({ ...formData, minAmount: Number.parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>
                ) : null}

                {formData.type === "signup" ||
                formData.type === "referral" ||
                formData.type === "birthday" ||
                formData.type === "review" ||
                formData.type === "social" ? (
                  <div className="space-y-2">
                    <Label htmlFor="fixedPoints">Fixed Points</Label>
                    <Input
                      id="fixedPoints"
                      type="number"
                      min="0"
                      value={formData.fixedPoints}
                      onChange={(e) => setFormData({ ...formData, fixedPoints: Number.parseInt(e.target.value) })}
                    />
                  </div>
                ) : null}

                {formData.type === "time_based" ? (
                  <div className="space-y-2">
                    <Label htmlFor="multiplier">Points Multiplier</Label>
                    <Input
                      id="multiplier"
                      type="number"
                      min="1"
                      step="0.1"
                      value={formData.multiplier}
                      onChange={(e) => setFormData({ ...formData, multiplier: Number.parseFloat(e.target.value) })}
                    />
                  </div>
                ) : null}

                {formData.type === "category" ? (
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Clothing">Clothing</SelectItem>
                        <SelectItem value="Food">Food & Beverage</SelectItem>
                        <SelectItem value="Books">Books</SelectItem>
                        <SelectItem value="Sports">Sports & Outdoors</SelectItem>
                        <SelectItem value="Home">Home & Garden</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}

                <div className="space-y-2">
                  <Label htmlFor="maxPoints">Maximum Points per Transaction</Label>
                  <Input
                    id="maxPoints"
                    type="number"
                    min="0"
                    value={formData.maxPoints}
                    onChange={(e) => setFormData({ ...formData, maxPoints: Number.parseInt(e.target.value) })}
                  />
                </div>

                {formData.status === "scheduled" ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                ) : null}
              </TabsContent>

              <TabsContent value="conditions" className="space-y-4">
                <div className="space-y-2">
                  <Label>Rule Conditions</Label>
                  <p className="text-sm text-muted-foreground">
                    Define specific conditions that must be met for this rule to apply
                  </p>
                </div>

                {formData.conditions.map((condition, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={condition}
                      onChange={(e) => updateCondition(index, e.target.value)}
                      placeholder="Enter condition..."
                    />
                    {formData.conditions.length > 1 && (
                      <Button type="button" variant="outline" size="icon" onClick={() => removeCondition(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                <Button type="button" variant="outline" onClick={addCondition} className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Condition
                </Button>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateRule} disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Rule"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rules</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRules}</div>
            <p className="text-xs text-muted-foreground">{activeRules} active rules</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points Awarded</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPointsAwarded.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total points distributed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rule Usage</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsage.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total rule applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Points/Rule</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalRules > 0 ? Math.round(totalPointsAwarded / totalRules).toLocaleString() : 0}
            </div>
            <p className="text-xs text-muted-foreground">Average per rule</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input placeholder="Search rules..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="purchase">Purchase</SelectItem>
                <SelectItem value="signup">Sign Up</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="birthday">Birthday</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="time_based">Time Based</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Rules List */}
      <div className="grid gap-6">
        {filteredRules.map((rule) => {
          const typeConfig = ruleTypeConfig[rule.type]
          const TypeIcon = typeConfig.icon

          return (
            <Card key={rule.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${typeConfig.color}`}>
                      <TypeIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{rule.name}</CardTitle>
                      <CardDescription>{rule.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        rule.status === "active" ? "default" : rule.status === "inactive" ? "secondary" : "outline"
                      }
                    >
                      {rule.status}
                    </Badge>
                    <Badge variant="outline" className={typeConfig.color}>
                      {typeConfig.label}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Points Configuration</p>
                    <p className="text-sm">
                      {rule.pointsPerDollar
                        ? `${rule.pointsPerDollar} pts/$`
                        : rule.fixedPoints
                          ? `${rule.fixedPoints} pts`
                          : rule.multiplier
                            ? `${rule.multiplier}x multiplier`
                            : "Variable"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Usage Count</p>
                    <p className="text-sm">{rule.usageCount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Points Awarded</p>
                    <p className="text-sm">{rule.totalPointsAwarded.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Priority</p>
                    <p className="text-sm">Level {rule.priority}</p>
                  </div>
                </div>

                {rule.conditions.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Conditions</p>
                    <div className="flex flex-wrap gap-2">
                      {rule.conditions.map((condition, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator className="my-4" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Created: {rule.createdAt}</span>
                    <span>Updated: {rule.updatedAt}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      <Switch checked={rule.status === "active"} onCheckedChange={() => handleToggleStatus(rule.id)} />
                      <span className="text-sm">Active</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(rule)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteRule(rule.id)}
                      disabled={rule.usageCount > 0}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredRules.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No earning rules found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                ? "Try adjusting your filters to see more results."
                : "Create your first earning rule to get started."}
            </p>
            {!searchTerm && statusFilter === "all" && typeFilter === "all" && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Rule
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingRule} onOpenChange={() => setEditingRule(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Earning Rule</DialogTitle>
            <DialogDescription>Update the earning rule configuration</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="conditions">Conditions</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Rule Name *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Standard Purchase Points"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Rule Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: EarningRule["type"]) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="purchase">Purchase</SelectItem>
                      <SelectItem value="signup">Sign Up</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="birthday">Birthday</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                      <SelectItem value="time_based">Time Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe how this rule works..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: EarningRule["status"]) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Input
                    id="edit-priority"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              {formData.type === "purchase" || formData.type === "category" ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-pointsPerDollar">Points per Dollar</Label>
                    <Input
                      id="edit-pointsPerDollar"
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.pointsPerDollar}
                      onChange={(e) => setFormData({ ...formData, pointsPerDollar: Number.parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-minAmount">Minimum Amount ($)</Label>
                    <Input
                      id="edit-minAmount"
                      type="number"
                      min="0"
                      value={formData.minAmount}
                      onChange={(e) => setFormData({ ...formData, minAmount: Number.parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              ) : null}

              {formData.type === "signup" ||
              formData.type === "referral" ||
              formData.type === "birthday" ||
              formData.type === "review" ||
              formData.type === "social" ? (
                <div className="space-y-2">
                  <Label htmlFor="edit-fixedPoints">Fixed Points</Label>
                  <Input
                    id="edit-fixedPoints"
                    type="number"
                    min="0"
                    value={formData.fixedPoints}
                    onChange={(e) => setFormData({ ...formData, fixedPoints: Number.parseInt(e.target.value) })}
                  />
                </div>
              ) : null}

              {formData.type === "time_based" ? (
                <div className="space-y-2">
                  <Label htmlFor="edit-multiplier">Points Multiplier</Label>
                  <Input
                    id="edit-multiplier"
                    type="number"
                    min="1"
                    step="0.1"
                    value={formData.multiplier}
                    onChange={(e) => setFormData({ ...formData, multiplier: Number.parseFloat(e.target.value) })}
                  />
                </div>
              ) : null}

              {formData.type === "category" ? (
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Clothing">Clothing</SelectItem>
                      <SelectItem value="Food">Food & Beverage</SelectItem>
                      <SelectItem value="Books">Books</SelectItem>
                      <SelectItem value="Sports">Sports & Outdoors</SelectItem>
                      <SelectItem value="Home">Home & Garden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="edit-maxPoints">Maximum Points per Transaction</Label>
                <Input
                  id="edit-maxPoints"
                  type="number"
                  min="0"
                  value={formData.maxPoints}
                  onChange={(e) => setFormData({ ...formData, maxPoints: Number.parseInt(e.target.value) })}
                />
              </div>

              {formData.status === "scheduled" ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-startDate">Start Date</Label>
                    <Input
                      id="edit-startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-endDate">End Date</Label>
                    <Input
                      id="edit-endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
              ) : null}
            </TabsContent>

            <TabsContent value="conditions" className="space-y-4">
              <div className="space-y-2">
                <Label>Rule Conditions</Label>
                <p className="text-sm text-muted-foreground">
                  Define specific conditions that must be met for this rule to apply
                </p>
              </div>

              {formData.conditions.map((condition, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={condition}
                    onChange={(e) => updateCondition(index, e.target.value)}
                    placeholder="Enter condition..."
                  />
                  {formData.conditions.length > 1 && (
                    <Button type="button" variant="outline" size="icon" onClick={() => removeCondition(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addCondition} className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Add Condition
              </Button>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRule(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditRule} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Rule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
