import type { LoginCredentials, RegisterData, User } from "@/types/auth"

/* ------------------------------------------------------------------ */
/*  Generic fetch wrapper                                             */
/* ------------------------------------------------------------------ */

// In the browser we always call the same-origin `/api` routes.
// On the server we can still honour NEXT_PUBLIC_API_BASE_URL if you need it.
const API_BASE_URL =
  typeof window === "undefined" ? process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "/api" : "/api"

class APIClient {
  constructor(private baseURL: string) {}

  private async request<T>(endpoint: string, opts: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    console.log("🌐 API request to:", url)
    console.log("🔐 Token from localStorage:", token ? "Present" : "Missing")
    
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...opts.headers,
    }
    
    console.log("📋 Request headers:", headers)

    const res = await fetch(url, {
      // Default headers
      headers,
      ...opts,
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || `Request failed: ${res.status}`)
    }

    return res.json()
  }

  get<T>(e: string, o: RequestInit = {}): Promise<T> {
    return this.request<T>(e, { method: "GET", ...o })
  }

  post<T>(e: string, d?: any, o: RequestInit = {}): Promise<T> {
    return this.request<T>(e, { method: "POST", body: d ? JSON.stringify(d) : undefined, ...o })
  }
}

const api = new APIClient(API_BASE_URL)

/* ------------------------------------------------------------------ */
/*  AUTH API                                                          */
/* ------------------------------------------------------------------ */

export const authAPI = {
  login: (c: LoginCredentials) => api.post<{ user: User; token: string }>("/auth/login", c),
  register: (d: RegisterData) => api.post<{ message: string }>("/auth/register", d),
  getProfile: () => api.get<User>("/auth/profile"),
  updateProfile: (d: Partial<User>) => api.post<User>("/auth/profile", d),
  logout: () => api.post<{ message: string }>("/auth/logout"),
}

/* ------------------------------------------------------------------ */
/*  LOYALTY (consumer) API                                            */
/* ------------------------------------------------------------------ */

export const loyaltyAPI = {
  getUserData: () =>
    api.get<{
      points: number
      tier: string
      rewards: any[]
      transactions: any[]
    }>("/loyalty/user"),

  getRewards: () => api.get<any[]>("/loyalty/rewards"),

  redeemReward: (id: string) => api.post<{ message: string }>(`/loyalty/rewards/${id}/redeem`),

  getTransactions: (page = 1, limit = 10) =>
    api.get<{
      transactions: any[]
      total: number
      page: number
      totalPages: number
    }>(`/loyalty/transactions?page=${page}&limit=${limit}`),
}

/* ------------------------------------------------------------------ */
/*  PARTNER API                                                       */
/* ------------------------------------------------------------------ */

export const partnerAPI = {
  getCustomers: (page = 1, limit = 10, search = "") =>
    api.get<{
      customers: any[]
      total: number
      page: number
      totalPages: number
    }>(`/partner/customers?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`),

  getCustomer: (id: string) => api.get<any>(`/partner/customers/${id}`),

  issuePoints: (customerId: string, points: number, description: string) =>
    api.post<{ message: string }>(`/partner/customers/${customerId}/points`, { points, description }),

  getRewards: () => api.get<any[]>("/partner/rewards"),

  createReward: (data: any) => api.post<any>("/partner/rewards", data),

  updateReward: (id: string, data: any) => api.post<any>(`/partner/rewards/${id}`, data),

  deleteReward: (id: string) => api.post<{ message: string }>(`/partner/rewards/${id}`),

  getAnalytics: () =>
    api.get<{
      totalCustomers: number
      pointsIssued: number
      rewardsRedeemed: number
      revenue: number
      monthlyData: any[]
    }>("/partner/analytics"),
}

/* ------------------------------------------------------------------ */
/*  ADMIN API                                                         */
/* ------------------------------------------------------------------ */

export const adminAPI = {
  getMembers: (page = 1, limit = 10, search = "") =>
    api.get<{
      members: any[]
      total: number
      page: number
      totalPages: number
    }>(`/admin/members?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`),

  getMember: (id: string) => api.get<any>(`/admin/members/${id}`),

  updateMember: (id: string, data: any) => api.post<any>(`/admin/members/${id}`, data),

  suspendMember: (id: string, reason: string) =>
    api.post<{ message: string }>(`/admin/members/${id}/suspend`, {
      reason,
    }),

  getPartners: (page = 1, limit = 10, search = "") =>
    api.get<{
      partners: any[]
      total: number
      page: number
      totalPages: number
    }>(`/admin/partners?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`),

  createPartner: (data: any) => api.post<any>("/admin/partners", data),

  updatePartner: (id: string, data: any) => api.post<any>(`/admin/partners/${id}`, data),

  getSystemSettings: () => api.get<any>("/admin/settings"),

  updateSystemSettings: (settings: any) => api.post<any>("/admin/settings", settings),

  getAnalytics: () =>
    api.get<{
      totalMembers: number
      activePartners: number
      pointsCirculating: number
      systemRevenue: number
      monthlyGrowth: any[]
    }>("/admin/analytics"),
}
