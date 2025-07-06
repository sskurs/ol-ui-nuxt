"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { loyaltyAPI } from "@/lib/api"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpRight, ArrowDownRight, Search, Download, Calendar } from "lucide-react"

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const { data: transactionData, isLoading } = useQuery({
    queryKey: ["transactions", currentPage],
    queryFn: () => loyaltyAPI.getTransactions(currentPage, itemsPerPage),
  })

  // Mock transaction data
  const mockTransactions = [
    {
      id: 1,
      type: "earned",
      description: "Purchase at Coffee Shop Co",
      points: 250,
      date: "2024-01-15",
      time: "10:30 AM",
      partner: "Coffee Shop Co",
      reference: "TXN-001234",
      status: "completed",
    },
    {
      id: 2,
      type: "redeemed",
      description: "10% Off Coupon Redeemed",
      points: 500,
      date: "2024-01-14",
      time: "2:15 PM",
      partner: "Fashion Boutique",
      reference: "RDM-005678",
      status: "completed",
    },
    {
      id: 3,
      type: "earned",
      description: "Bonus Points - Birthday",
      points: 1000,
      date: "2024-01-12",
      time: "12:00 PM",
      partner: "LoyaltyPro",
      reference: "BON-009876",
      status: "completed",
    },
    {
      id: 4,
      type: "earned",
      description: "Purchase at Fitness Center",
      points: 150,
      date: "2024-01-10",
      time: "6:45 PM",
      partner: "Fitness Center",
      reference: "TXN-001235",
      status: "completed",
    },
    {
      id: 5,
      type: "redeemed",
      description: "Free Coffee Redeemed",
      points: 200,
      date: "2024-01-08",
      time: "8:20 AM",
      partner: "Coffee Shop Co",
      reference: "RDM-005679",
      status: "completed",
    },
    {
      id: 6,
      type: "earned",
      description: "Purchase at Fashion Boutique",
      points: 300,
      date: "2024-01-05",
      time: "3:30 PM",
      partner: "Fashion Boutique",
      reference: "TXN-001236",
      status: "completed",
    },
    {
      id: 7,
      type: "earned",
      description: "Referral Bonus",
      points: 500,
      date: "2024-01-03",
      time: "11:15 AM",
      partner: "LoyaltyPro",
      reference: "REF-012345",
      status: "completed",
    },
    {
      id: 8,
      type: "redeemed",
      description: "Movie Tickets Redeemed",
      points: 1500,
      date: "2024-01-01",
      time: "7:00 PM",
      partner: "Cinema Plus",
      reference: "RDM-005680",
      status: "completed",
    },
  ]

  const transactions = transactionData?.transactions || mockTransactions

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.partner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || transaction.type === typeFilter

    return matchesSearch && matchesType
  })

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalEarned = transactions.filter((t) => t.type === "earned").reduce((sum, t) => sum + t.points, 0)

  const totalRedeemed = transactions.filter((t) => t.type === "redeemed").reduce((sum, t) => sum + t.points, 0)

  const handleExport = () => {
    // Mock export functionality
    const csvContent = [
      "Date,Type,Description,Points,Partner,Reference",
      ...filteredTransactions.map(
        (t) => `${t.date},${t.type},${t.description},${t.points},${t.partner},${t.reference}`,
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "transactions.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <DashboardLayout role="consumer">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Transaction History</h1>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                      </div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
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
    <DashboardLayout role="consumer">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Transaction History</h1>
          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+{totalEarned.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Points earned all time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Redeemed</CardTitle>
              <ArrowDownRight className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">-{totalRedeemed.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Points redeemed all time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{(totalEarned - totalRedeemed).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Current point balance</p>
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
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Transaction Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="earned">Points Earned</SelectItem>
                  <SelectItem value="redeemed">Points Redeemed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your complete transaction history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paginatedTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-2 rounded-full ${transaction.type === "earned" ? "bg-green-100" : "bg-red-100"}`}
                    >
                      {transaction.type === "earned" ? (
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{transaction.date}</span>
                        <span>•</span>
                        <span>{transaction.time}</span>
                        <span>•</span>
                        <span>{transaction.reference}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${transaction.type === "earned" ? "text-green-600" : "text-red-600"}`}>
                      {transaction.type === "earned" ? "+" : "-"}
                      {transaction.points.toLocaleString()}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {transaction.partner}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length}{" "}
                  transactions
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {filteredTransactions.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria to find more transactions.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
