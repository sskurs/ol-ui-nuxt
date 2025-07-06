// app/api/auth/login/route.ts
// -----------------------------------------------------------
// A minimal mock login endpoint that always succeeds.
// -----------------------------------------------------------

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

type Role = "consumer" | "partner" | "admin"

export async function POST(req: NextRequest) {
  // Parse incoming JSON
  const body = await req.json().catch(() => ({}))

  const {
    email = "",
    password = "",
    role = "consumer",
  } = body as {
    email?: string
    password?: string
    role?: Role
    organizationCode?: string
    accessCode?: string
  }

  // Basic validation
  if (!email || !password) {
    return NextResponse.json({ message: "Email and password are required." }, { status: 400 })
  }

  // Build a mock user object based on role
  const user = {
    id: `u_${Date.now()}`,
    name: role === "partner" ? "Coffee-Shop Manager" : role === "admin" ? "System Admin" : "John Doe",
    email,
    role,
  }

  // Always return 200 with dummy token + user
  return NextResponse.json({
    token: "mock-jwt-token",
    user,
  })
}

// Optional GET so you can open `/api/auth/login` in the browser
export function GET() {
  return NextResponse.json({ ok: true })
}
