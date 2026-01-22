//levlpro-mvp\src\utils\__tests__\Useauth.test.jsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import useAuth from '../../hooks/useAuth'
import { supabase } from '../../lib/supabaseClient'
// Mock Supabase
vi.mock('../../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
  },
}))

describe('useAuth Hook', () => {
  let mockUnsubscribe

  beforeEach(() => {
    mockUnsubscribe = vi.fn()
    
    // Default mock implementation
    supabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })
    
    supabase.auth.onAuthStateChange.mockReturnValue({
      data: {
        subscription: {
          unsubscribe: mockUnsubscribe,
        },
      },
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should start with loading state', () => {
    const { result } = renderHook(() => useAuth())
    
    expect(result.current.loading).toBe(true)
    expect(result.current.user).toBe(null)
  })

  it('should load user on mount', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
    }

    supabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.user).toEqual(mockUser)
    expect(supabase.auth.getUser).toHaveBeenCalledTimes(1)
  })

  it('should handle no user found', async () => {
    supabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.user).toBe(null)
  })

  it('should handle auth errors gracefully', async () => {
    supabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'Auth error' },
    })

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Should still set loading to false even with error
    expect(result.current.user).toBe(null)
  })

  it('should subscribe to auth state changes', () => {
    renderHook(() => useAuth())

    expect(supabase.auth.onAuthStateChange).toHaveBeenCalledTimes(1)
    expect(supabase.auth.onAuthStateChange).toHaveBeenCalledWith(
      expect.any(Function)
    )
  })

  it('should update user when auth state changes to signed in', async () => {
    let authCallback
    
    supabase.auth.onAuthStateChange.mockImplementation((callback) => {
      authCallback = callback
      return {
        data: {
          subscription: {
            unsubscribe: mockUnsubscribe,
          },
        },
      }
    })

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Simulate user sign in
    const mockUser = {
      id: '456',
      email: 'newuser@example.com',
    }

    authCallback('SIGNED_IN', {
      user: mockUser,
      access_token: 'token',
    })

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser)
    })
  })

  it('should clear user when auth state changes to signed out', async () => {
    let authCallback
    
    const mockUser = {
      id: '123',
      email: 'test@example.com',
    }

    supabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })

    supabase.auth.onAuthStateChange.mockImplementation((callback) => {
      authCallback = callback
      return {
        data: {
          subscription: {
            unsubscribe: mockUnsubscribe,
          },
        },
      }
    })

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser)
    })

    // Simulate user sign out
    authCallback('SIGNED_OUT', null)

    await waitFor(() => {
      expect(result.current.user).toBe(null)
    })
  })

  it('should unsubscribe from auth changes on unmount', () => {
    const { unmount } = renderHook(() => useAuth())

    unmount()

    expect(mockUnsubscribe).toHaveBeenCalledTimes(1)
  })

  it('should handle rapid auth state changes', async () => {
    let authCallback
    
    supabase.auth.onAuthStateChange.mockImplementation((callback) => {
      authCallback = callback
      return {
        data: {
          subscription: {
            unsubscribe: mockUnsubscribe,
          },
        },
      }
    })

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const user1 = { id: '1', email: 'user1@example.com' }
    const user2 = { id: '2', email: 'user2@example.com' }

    // Rapid changes
    authCallback('SIGNED_IN', { user: user1 })
    authCallback('SIGNED_IN', { user: user2 })

    await waitFor(() => {
      expect(result.current.user).toEqual(user2)
    })
  })
})