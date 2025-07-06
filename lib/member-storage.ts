// lib/member-storage.ts
// -----------------------------------------------------------
// Member data persistence utility using JSON file storage
// -----------------------------------------------------------

import fs from 'fs'
import path from 'path'

interface Member {
  id: string
  name: string
  email: string
  phone: string
  points: number
  tier: string
  status: "active" | "inactive" | "suspended"
  memberSince: string
  lastActivity: string
  totalSpent: number
  transactions: number
  firstName: string
  lastName: string
  dateOfBirth: string | null
  gender: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  preferences: {
    marketingEmails: boolean
    smsNotifications: boolean
    newsletter: boolean
  }
}

const STORAGE_FILE = path.join(process.cwd(), 'data', 'members.json')

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.dirname(STORAGE_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Read members from storage
export function readMembers(): Member[] {
  try {
    ensureDataDirectory()
    
    if (!fs.existsSync(STORAGE_FILE)) {
      // Initialize with default members if file doesn't exist
      const defaultMembers: Member[] = [
        {
          id: "demo-customer-002",
          name: "Jane Smith",
          email: "jane.smith@example.com",
          phone: "+1-555-0101",
          points: 1250,
          tier: "Gold",
          status: "active",
          memberSince: "2024-01-15T10:30:00Z",
          lastActivity: "2024-12-20T14:22:00Z",
          totalSpent: 2500.00,
          transactions: 15,
          firstName: "Jane",
          lastName: "Smith",
          dateOfBirth: "1990-05-15T00:00:00Z",
          gender: "female",
          address: {
            street: "123 Main St",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            country: "United States"
          },
          emergencyContact: {
            name: "John Smith",
            phone: "+1-555-0102",
            relationship: "Spouse"
          },
          preferences: {
            marketingEmails: true,
            smsNotifications: true,
            newsletter: true
          }
        },
        {
          id: "demo-customer-003", 
          name: "Mike Johnson",
          email: "mike.johnson@example.com",
          phone: "+1-555-0102",
          points: 890,
          tier: "Silver",
          status: "active",
          memberSince: "2024-02-20T09:15:00Z",
          lastActivity: "2024-12-18T16:45:00Z",
          totalSpent: 1800.50,
          transactions: 12,
          firstName: "Mike",
          lastName: "Johnson",
          dateOfBirth: "1985-08-22T00:00:00Z",
          gender: "male",
          address: {
            street: "456 Oak Ave",
            city: "Los Angeles",
            state: "CA",
            zipCode: "90210",
            country: "United States"
          },
          emergencyContact: {
            name: "Sarah Johnson",
            phone: "+1-555-0103",
            relationship: "Sister"
          },
          preferences: {
            marketingEmails: false,
            smsNotifications: true,
            newsletter: false
          }
        }
      ]
      
      writeMembers(defaultMembers)
      return defaultMembers
    }
    
    const data = fs.readFileSync(STORAGE_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading members:', error)
    return []
  }
}

// Write members to storage
export function writeMembers(members: Member[]): void {
  try {
    ensureDataDirectory()
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(members, null, 2))
  } catch (error) {
    console.error('Error writing members:', error)
  }
}

// Get a specific member by ID
export function getMemberById(id: string): Member | null {
  const members = readMembers()
  return members.find(member => member.id === id) || null
}

// Add a new member
export function addMember(memberData: Omit<Member, 'id' | 'memberSince' | 'lastActivity' | 'points' | 'totalSpent' | 'transactions'>): Member {
  const members = readMembers()
  
  const newMember: Member = {
    ...memberData,
    id: `demo-customer-${Date.now()}`,
    memberSince: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    points: 0,
    totalSpent: 0,
    transactions: 0
  }
  
  members.push(newMember)
  writeMembers(members)
  
  return newMember
}

// Update an existing member
export function updateMember(id: string, memberData: Partial<Member>): Member | null {
  const members = readMembers()
  const memberIndex = members.findIndex(member => member.id === id)
  
  if (memberIndex === -1) {
    return null
  }
  
  const updatedMember: Member = {
    ...members[memberIndex],
    ...memberData,
    id, // Ensure ID doesn't change
    lastActivity: new Date().toISOString()
  }
  
  members[memberIndex] = updatedMember
  writeMembers(members)
  
  return updatedMember
}

// Delete a member
export function deleteMember(id: string): boolean {
  const members = readMembers()
  const memberIndex = members.findIndex(member => member.id === id)
  
  if (memberIndex === -1) {
    return false
  }
  
  members.splice(memberIndex, 1)
  writeMembers(members)
  
  return true
}

// Get members with pagination and search
export function getMembers(page: number = 1, perPage: number = 10, search: string = ''): {
  members: Member[]
  total: number
  page: number
  totalPages: number
} {
  let members = readMembers()
  
  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase()
    members = members.filter(member => 
      member.name.toLowerCase().includes(searchLower) ||
      member.email.toLowerCase().includes(searchLower) ||
      member.firstName.toLowerCase().includes(searchLower) ||
      member.lastName.toLowerCase().includes(searchLower)
    )
  }
  
  const total = members.length
  const totalPages = Math.ceil(total / perPage)
  const startIndex = (page - 1) * perPage
  const endIndex = startIndex + perPage
  
  const paginatedMembers = members.slice(startIndex, endIndex)
  
  return {
    members: paginatedMembers,
    total,
    page,
    totalPages
  }
} 