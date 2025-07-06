"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  Users,
  Gift,
  BarChart3,
  Settings,
  Building,
  History,
  UserCheck,
  Award,
  ArrowLeftRight,
  Receipt,
  Calculator,
  CreditCard,
  Store,
  Target,
} from "lucide-react"

interface SidebarProps {
  role: "consumer" | "partner" | "admin"
}

const navigationConfig = {
  consumer: [
    { name: "Dashboard", href: "/consumer", icon: Home },
    { name: "Rewards", href: "/consumer/rewards", icon: Gift },
    { name: "Transactions", href: "/consumer/transactions", icon: History },
    { name: "Profile", href: "/consumer/profile", icon: UserCheck },
  ],
  partner: [
    { name: "Dashboard", href: "/partner", icon: Home },
    { name: "Customers", href: "/partner/customers", icon: Users },
    { name: "Rewards", href: "/partner/rewards", icon: Gift },
    { name: "Analytics", href: "/partner/analytics", icon: BarChart3 },
    { name: "Settings", href: "/partner/settings", icon: Settings },
  ],
  admin: [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Members", href: "/admin/members", icon: Users },
    { name: "Partners", href: "/admin/partners", icon: Building },
    { name: "Merchants", href: "/admin/merchants", icon: Store },
    { name: "Segments", href: "/admin/segments", icon: Target },
    { name: "Levels", href: "/admin/levels", icon: Award },
    { name: "Points Transfer", href: "/admin/points-transfer", icon: ArrowLeftRight },
    { name: "Transactions", href: "/admin/transactions", icon: Receipt },
    { name: "Earning Rules", href: "/admin/earning-rules", icon: Calculator },
    { name: "POS Systems", href: "/admin/pos", icon: CreditCard },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ],
}

export function DashboardSidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const navigation = navigationConfig[role]

  return (
    <aside className="w-64 bg-card border-r min-h-[calc(100vh-4rem)]">
      <nav className="p-4">
        <div className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}
