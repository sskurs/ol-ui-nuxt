"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/contexts/sidebar-context"
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
  const { isCollapsed, toggleSidebar } = useSidebar()
  const navigation = navigationConfig[role]

  return (
    <TooltipProvider>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      <aside 
        className={cn(
          "bg-card border-r min-h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out z-50",
          "fixed md:relative",
          isCollapsed ? "w-16" : "w-64",
          // Mobile: start off-screen when collapsed, on-screen when expanded
          "md:translate-x-0",
          isCollapsed ? "-translate-x-full md:translate-x-0" : "translate-x-0"
        )}
      >
        <nav className="p-4">
          {/* Toggle Button */}
          <div className="flex justify-end mb-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronLeft className="h-4 w-4" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              const linkContent = (
                <div
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </div>
              )

              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <Link href={item.href} onClick={() => {
                      // Auto-close sidebar on mobile when clicking a link
                      if (window.innerWidth < 768) {
                        toggleSidebar()
                      }
                    }}>
                      {linkContent}
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">
                      {item.name}
                    </TooltipContent>
                  )}
                </Tooltip>
              )
            })}
          </div>
        </nav>
      </aside>
    </TooltipProvider>
  )
}
