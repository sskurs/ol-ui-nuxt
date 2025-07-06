// app/api/health/route.ts
// -----------------------------------------------------------
// Health check endpoint to test backend connectivity
// -----------------------------------------------------------

import { NextResponse } from "next/server"

export async function GET() {
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
  
  try {
    // Test backend connectivity
    const response = await fetch(`${backendUrl}/api/admin/login_check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'test@example.com',
        password: 'wrongpassword'
      })
    })

    return NextResponse.json({
      status: 'healthy',
      frontend: 'Next.js API is running',
      backend: {
        url: backendUrl,
        reachable: true,
        status: response.status,
        message: response.status === 401 ? 'Backend is reachable (401 expected for wrong credentials)' : 'Backend responded with unexpected status'
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        backendUrl: process.env.NEXT_PUBLIC_API_BASE_URL
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      frontend: 'Next.js API is running',
      backend: {
        url: backendUrl,
        reachable: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        backendUrl: process.env.NEXT_PUBLIC_API_BASE_URL
      },
      troubleshooting: [
        'Ensure Symfony backend is running on the configured URL',
        'Check if the backend is accessible from the frontend',
        'Verify CORS configuration in the backend',
        'Check network connectivity between frontend and backend'
      ]
    }, { status: 503 })
  }
} 