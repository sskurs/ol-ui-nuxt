// app/api/admin/members/[id]/route.ts
// -----------------------------------------------------------
// Individual member operations (GET, PUT, DELETE)
// -----------------------------------------------------------

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getMemberById, updateMember, deleteMember } from "@/lib/member-storage"

// GET - Get a specific member
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  console.log("🚀 Get member API route called for ID:", id)
  
  try {
    const member = getMemberById(id)
    
    if (!member) {
      return NextResponse.json({ message: "Member not found" }, { status: 404 })
    }
    
    console.log("✅ Returning member data for:", member.name)
    return NextResponse.json(member)
    
  } catch (error) {
    console.error("💥 Error fetching member:", error)
    return NextResponse.json({ 
      message: "Failed to fetch member",
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 })
  }
}

// PUT - Update a member
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  console.log("🚀 Update member API route called for ID:", id)
  
  try {
    const body = await req.json()
    console.log("📝 Received update data:", body)
    
    // Validate required fields
    const { firstName, lastName, email } = body
    
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
    
    // Update member in persistent storage
    const updateData = {
      name: `${firstName} ${lastName}`,
      email: email,
      phone: body.phone || "",
      tier: body.tier || "Bronze",
      status: body.status || "active",
      firstName,
      lastName,
      dateOfBirth: body.dateOfBirth || null,
      gender: body.gender || "",
      address: body.address || {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States"
      },
      emergencyContact: body.emergencyContact || {
        name: "",
        phone: "",
        relationship: ""
      },
      preferences: body.preferences || {
        marketingEmails: true,
        smsNotifications: true,
        newsletter: true
      }
    }
    
    const updatedMember = updateMember(id, updateData)
    
    if (!updatedMember) {
      return NextResponse.json({ 
        message: "Member not found" 
      }, { status: 404 })
    }
    
    console.log("✅ Updated member:", updatedMember.name)
    
    return NextResponse.json({
      message: "Member updated successfully",
      member: updatedMember
    })
    
  } catch (error: unknown) {
    console.error("💥 Error updating member:", error)
    
    return NextResponse.json({ 
      message: "Failed to update member",
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 })
  }
}

// DELETE - Delete a member
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  console.log("🚀 Delete member API route called for ID:", id)
  
  try {
    const success = deleteMember(id)
    
    if (!success) {
      return NextResponse.json({ 
        message: "Member not found" 
      }, { status: 404 })
    }
    
    console.log("✅ Member deleted successfully:", id)
    
    return NextResponse.json({
      message: "Member deleted successfully",
      deletedId: id
    })
    
  } catch (error: unknown) {
    console.error("💥 Error deleting member:", error)
    
    return NextResponse.json({ 
      message: "Failed to delete member",
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 })
  }
} 