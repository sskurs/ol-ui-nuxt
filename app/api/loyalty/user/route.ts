// app/api/loyalty/user/route.ts
// -----------------------------------------------------------
// Consumer loyalty data endpoint that integrates with Symfony backend
// -----------------------------------------------------------

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8181"
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return NextResponse.json({ message: "Authentication required" }, { status: 401 })
  }

  try {
    console.log("🔍 Fetching consumer loyalty data...")
    
    // Get customer profile from backend
    const profileResponse = await fetch(`${backendUrl}/api/customer/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!profileResponse.ok) {
      console.error("❌ Failed to fetch customer profile:", profileResponse.status)
      return NextResponse.json({ 
        message: "Failed to fetch customer profile" 
      }, { status: profileResponse.status })
    }

    const customerProfile = await profileResponse.json()
    console.log("✅ Customer profile fetched:", { customerId: customerProfile.customerId })

    // Mock loyalty data for now (in a real implementation, this would come from backend)
    // TODO: Replace with real backend API calls for points, tier, rewards, transactions
    const loyaltyData = {
      points: 1250,
      tier: "Silver",
      rewards: [
        {
          id: "reward-1",
          name: "Free Coffee",
          description: "Get a free coffee at any participating location",
          pointsRequired: 100,
          available: true,
        },
        {
          id: "reward-2", 
          name: "10% Discount",
          description: "10% off your next purchase",
          pointsRequired: 500,
          available: true,
        },
        {
          id: "reward-3",
          name: "Free Dessert",
          description: "Free dessert with any meal",
          pointsRequired: 200,
          available: false,
        }
      ],
      transactions: [
        {
          id: "tx-1",
          date: "2024-01-15T10:30:00Z",
          description: "Coffee Shop Purchase",
          points: 50,
          type: "earned"
        },
        {
          id: "tx-2", 
          date: "2024-01-10T14:20:00Z",
          description: "Restaurant Meal",
          points: 200,
          type: "earned"
        },
        {
          id: "tx-3",
          date: "2024-01-05T09:15:00Z", 
          description: "Free Coffee Redemption",
          points: -100,
          type: "redeemed"
        }
      ]
    }

    return NextResponse.json(loyaltyData)

  } catch (error: unknown) {
    console.error("💥 Error fetching loyalty data:", error)
    
    return NextResponse.json({ 
      message: "Failed to fetch loyalty data",
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 })
  }
} 