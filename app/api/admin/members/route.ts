// app/api/admin/members/route.ts
// -----------------------------------------------------------
// Admin member data endpoint with persistent storage
// -----------------------------------------------------------

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getMembers, addMember } from "@/lib/member-storage"

export async function GET(req: NextRequest) {
  console.log("🚀 Admin members API route called!")
  
  // Get query parameters for pagination
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const perPage = parseInt(searchParams.get('perPage') || '10')
  const search = searchParams.get('search') || ''
  
  try {
    const result = getMembers(page, perPage, search)
    
    console.log(`✅ Returning ${result.members.length} members (page ${page}, total: ${result.total})`)
    
    return NextResponse.json({
      members: result.members,
      total: result.total,
      page: result.page,
      perPage,
      totalPages: result.totalPages
    })
  } catch (error) {
    console.error("💥 Error fetching members:", error)
    return NextResponse.json({ 
      message: "Failed to fetch members",
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  console.log("🚀 Admin add member API route called!")
  
  try {
    const body = await req.json()
    console.log("📝 Received member data:", body)
    
    // Validate required fields
    const { firstName, lastName, email, phone, dateOfBirth, gender, address, emergencyContact, preferences } = body
    
    if (!firstName || !lastName || !email) {
      return NextResponse.json({ 
        message: "First name, last name, and email are required" 
      }, { status: 400 })
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        message: "Please enter a valid email address" 
      }, { status: 400 })
    }
    
    // Create member data for storage
    const memberData = {
      name: `${firstName} ${lastName}`,
      email: email,
      phone: phone || "",
      tier: "Bronze",
      status: "active" as const,
      firstName,
      lastName,
      dateOfBirth: dateOfBirth || null,
      gender: gender || "",
      address: address || {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States"
      },
      emergencyContact: emergencyContact || {
        name: "",
        phone: "",
        relationship: ""
      },
      preferences: preferences || {
        marketingEmails: true,
        smsNotifications: true,
        newsletter: true
      }
    }
    
    // Add member to persistent storage
    const newMember = addMember(memberData)
    
    console.log("✅ Created new member:", newMember.name)
    
    return NextResponse.json({
      message: "Member created successfully",
      member: newMember
    }, { status: 201 })
    
  } catch (error: unknown) {
    console.error("💥 Error creating member:", error)
    
    return NextResponse.json({ 
      message: "Failed to create member",
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 })
  }
} 