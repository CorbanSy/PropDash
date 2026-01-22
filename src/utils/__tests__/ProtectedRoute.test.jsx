import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../utils/ProtectedRoute'

// Mock the useAuth hook
vi.mock('../hooks/useAuth', () => ({
  default: vi.fn(),
}))

import useAuth from '../hooks/useAuth'

describe('ProtectedRoute', () => {
  // Mock child component
  const TestComponent = () => <div>Protected Content</div>
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should show loading spinner while checking authentication', () => {
    useAuth.mockReturnValue({
      user: null,
      loading: true,
    })

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('should redirect to home when user is not authenticated', () => {
    useAuth.mockReturnValue({
      user: null,
      loading: false,
    })

    const { container } = render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route 
            path="/protected" 
            element={
              <ProtectedRoute>
                <TestComponent />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    )

    // Should redirect to home
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('should render children when user is authenticated with correct user type', () => {
    const mockUser = {
      id: 'test-id',
      email: 'test@example.com',
      user_metadata: { user_type: 'provider' }
    }

    useAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    })

    render(
      <BrowserRouter>
        <ProtectedRoute requiredUserType="provider">
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('should redirect provider to /provider when accessing customer route', () => {
    const mockUser = {
      id: 'test-id',
      email: 'provider@example.com',
      user_metadata: { user_type: 'provider' }
    }

    useAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    })

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/provider" element={<div>Provider Dashboard</div>} />
          <Route 
            path="/customer" 
            element={
              <ProtectedRoute requiredUserType="customer">
                <TestComponent />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    )

    // Should NOT show protected content
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('should redirect customer to /customer/dashboard when accessing provider route', () => {
    const mockUser = {
      id: 'test-id',
      email: 'customer@example.com',
      user_metadata: { user_type: 'customer' }
    }

    useAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    })

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/customer/dashboard" element={<div>Customer Dashboard</div>} />
          <Route 
            path="/provider" 
            element={
              <ProtectedRoute requiredUserType="provider">
                <TestComponent />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    )

    // Should NOT show protected content
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('should render children when no specific user type is required', () => {
    const mockUser = {
      id: 'test-id',
      email: 'test@example.com',
      user_metadata: { user_type: 'provider' }
    }

    useAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    })

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })
})