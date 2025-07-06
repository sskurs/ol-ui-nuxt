"use client"

import { useQuery } from "@tanstack/react-query"
import { loyaltyAPI } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

export function RecentTransactions() {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => loyaltyAPI.getTransactions(1, 5),
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div>Loading...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest point activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions?.transactions.map((transaction: any) => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${transaction.type === "earned" ? "bg-green-100" : "bg-red-100"}`}>
                  {transaction.type === "earned" ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">{transaction.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${transaction.type === "earned" ? "text-green-600" : "text-red-600"}`}>
                  {transaction.type === "earned" ? "+" : "-"}
                  {transaction.points}
                </p>
                <Badge variant="outline" className="text-xs">
                  {transaction.partner}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
