export interface User {
  id: string
  email: string
  name: string
  role: "consumer" | "partner" | "admin"
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface ConsumerUser extends User {
  role: "consumer"
  points: number
  tier: "Bronze" | "Silver" | "Gold" | "Platinum"
  memberSince: string
  cardNumber: string
  phone?: string
  dateOfBirth?: string
}

export interface PartnerUser extends User {
  role: "partner"
  organization: string
  organizationCode: string
  businessType: string
  status: "active" | "inactive" | "pending"
}

export interface AdminUser extends User {
  role: "admin"
  permissions: string[]
  lastLogin: string
}

export interface LoginCredentials {
  email: string
  password: string
  role: User["role"]
  organizationCode?: string
  accessCode?: string
  rememberMe?: boolean
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
  dateOfBirth?: string
  agreeToTerms: boolean
}

export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}
