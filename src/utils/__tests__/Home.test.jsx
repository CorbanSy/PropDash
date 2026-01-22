import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Home from '../../components/ProviderDashboard/Home'
import { supabase } from '../../lib/supabaseClient'
import useAuth from '../../hooks/useAuth'

// Mock dependencies
vi.mock('../../lib/supabaseClient')
vi.mock('../../hooks/useAuth')
vi.mock('../../hooks/useJobOfferListener', () => ({
  useJobOfferListener: vi.fn(() => ({
    currentOffer: null,
    isListening: false,
    acceptOffer: vi.fn(),
    declineOffer: vi.fn(),
    handleTimeout: vi.fn(),
  }))
}))

// Mock window.alert
global.alert = vi.fn()

describe('Home Component - Critical Business Logic', () => {
  const mockUser = { id: 'provider-123', email: 'pro@example.com' }

  beforeEach(() => {
    useAuth.mockReturnValue({ user: mockUser })
    
    // Default Supabase mocks
    supabase.from = vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ 
            data: { is_online: false, profile_photo: null, business_name: 'Test Pro' },
            error: null 
          })),
          order: vi.fn(() => Promise.resolve({ data: [], error: null }))
        })),
        order: vi.fn(() => Promise.resolve({ data: [], error: null })),
        in: vi.fn(() => ({
          is: vi.fn(() => ({
            in: vi.fn(() => Promise.resolve({ count: 0, error: null }))
          }))
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null }))
      }))
    }))

    supabase.rpc = vi.fn()
    supabase.channel = vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn()
    }))
    supabase.removeChannel = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Online/Offline Toggle', () => {
    it('should toggle online status', async () => {
      const updateMock = vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null }))
      }))

      supabase.from.mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ 
              data: { is_online: false, profile_photo: null, business_name: 'Test Pro' },
              error: null 
            }))
          })),
          order: vi.fn(() => Promise.resolve({ data: [], error: null }))
        })),
        update: updateMock
      })

      render(<Home />, { wrapper: BrowserRouter })

      await waitFor(() => {
        expect(screen.getByText(/You're Offline/i)).toBeInTheDocument()
      })

      const toggleButton = screen.getByRole('button', { name: /Go Online/i })
      
      await act(async () => {
        fireEvent.click(toggleButton)
      })

      expect(updateMock).toHaveBeenCalledWith({
        is_online: true,
        is_available: true
      })
    })

    it('should dispatch pending jobs when going online', async () => {
      const mockPendingJobs = [
        { id: 'job-1', service_name: 'Plumbing', status: 'pending_dispatch' },
        { id: 'job-2', service_name: 'Electrical', status: 'unassigned' }
      ]

      supabase.from.mockImplementation((table) => {
        if (table === 'jobs') {
          return {
            select: vi.fn(() => ({
              in: vi.fn(() => ({
                order: vi.fn(() => Promise.resolve({ 
                  data: mockPendingJobs, 
                  error: null 
                }))
              })),
              eq: vi.fn(() => ({
                single: vi.fn(() => Promise.resolve({ 
                  data: { is_online: false },
                  error: null 
                })),
                order: vi.fn(() => Promise.resolve({ data: [], error: null }))
              }))
            })),
            update: vi.fn(() => ({
              eq: vi.fn(() => Promise.resolve({ error: null }))
            }))
          }
        }
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({ 
                data: { is_online: false, profile_photo: null, business_name: 'Test Pro' },
                error: null 
              }))
            })),
            order: vi.fn(() => Promise.resolve({ data: [], error: null }))
          })),
          update: vi.fn(() => ({
            eq: vi.fn(() => Promise.resolve({ error: null }))
          }))
        }
      })

      supabase.rpc.mockResolvedValue({
        data: [{ total_providers_found: 3 }],
        error: null
      })

      render(<Home />, { wrapper: BrowserRouter })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Go Online/i })).toBeInTheDocument()
      })

      const toggleButton = screen.getByRole('button', { name: /Go Online/i })
      
      await act(async () => {
        fireEvent.click(toggleButton)
      })

      await waitFor(() => {
        expect(supabase.rpc).toHaveBeenCalledWith('dispatch_job_to_providers', {
          p_job_id: 'job-1'
        })
        expect(supabase.rpc).toHaveBeenCalledWith('dispatch_job_to_providers', {
          p_job_id: 'job-2'
        })
      })
    })

    it('should not dispatch jobs that failed to find providers', async () => {
      const mockPendingJobs = [
        { id: 'job-1', service_name: 'Plumbing', status: 'pending_dispatch' }
      ]

      supabase.from.mockImplementation((table) => {
        if (table === 'jobs') {
          return {
            select: vi.fn(() => ({
              in: vi.fn(() => ({
                order: vi.fn(() => Promise.resolve({ 
                  data: mockPendingJobs, 
                  error: null 
                }))
              }))
            })),
            update: vi.fn(() => ({
              eq: vi.fn(() => Promise.resolve({ error: null }))
            }))
          }
        }
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({ 
                data: { is_online: false, profile_photo: null, business_name: 'Test Pro' },
                error: null 
              }))
            }))
          })),
          update: vi.fn(() => ({
            eq: vi.fn(() => Promise.resolve({ error: null }))
          }))
        }
      })

      // Mock dispatch returning 0 providers found
      supabase.rpc.mockResolvedValue({
        data: [{ total_providers_found: 0 }],
        error: null
      })

      render(<Home />, { wrapper: BrowserRouter })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Go Online/i })).toBeInTheDocument()
      })

      const toggleButton = screen.getByRole('button', { name: /Go Online/i })
      
      await act(async () => {
        fireEvent.click(toggleButton)
      })

      // Should still call RPC but not count as dispatched
      await waitFor(() => {
        expect(supabase.rpc).toHaveBeenCalledWith('dispatch_job_to_providers', {
          p_job_id: 'job-1'
        })
      })

      // Alert should not mention dispatched jobs
      expect(alert).toHaveBeenCalledWith(
        expect.stringContaining("ready to receive job offers")
      )
    })

    it('should handle errors when toggling online status', async () => {
      supabase.from.mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ 
              data: { is_online: false, profile_photo: null, business_name: 'Test Pro' },
              error: null 
            }))
          })),
          order: vi.fn(() => Promise.resolve({ data: [], error: null }))
        })),
        update: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ 
            error: { message: 'Database error' } 
          }))
        }))
      })

      render(<Home />, { wrapper: BrowserRouter })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Go Online/i })).toBeInTheDocument()
      })

      const toggleButton = screen.getByRole('button', { name: /Go Online/i })
      
      await act(async () => {
        fireEvent.click(toggleButton)
      })

      expect(alert).toHaveBeenCalledWith('Failed to update status. Please try again.')
    })
  })

  describe('Statistics Calculations', () => {
    it('should calculate todays earnings correctly', async () => {
      const todayDate = new Date().toISOString().split('T')[0]
      
      const mockJobs = [
        { 
          id: '1',
          scheduled_date: `${todayDate}T10:00:00`,
          status: 'completed',
          price: 15000 // $150.00 in cents
        },
        {
          id: '2',
          scheduled_date: `${todayDate}T14:00:00`,
          status: 'completed',
          price: 25000 // $250.00 in cents
        },
        {
          id: '3',
          scheduled_date: `${todayDate}T16:00:00`,
          status: 'pending', // Not completed, shouldn't count
          price: 10000
        }
      ]

      supabase.from.mockImplementation((table) => {
        if (table === 'jobs') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                order: vi.fn(() => Promise.resolve({ 
                  data: mockJobs, 
                  error: null 
                }))
              }))
            }))
          }
        }
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({ 
                data: { is_online: false, profile_photo: null, business_name: 'Test Pro' },
                error: null 
              })),
              order: vi.fn(() => Promise.resolve({ data: [], error: null }))
            }))
          }))
        }
      })

      render(<Home />, { wrapper: BrowserRouter })

      // Today's earnings should be $400 (15000 + 25000 cents)
      await waitFor(() => {
        expect(screen.getByText('$400')).toBeInTheDocument()
      })
    })

    it('should count todays jobs correctly', async () => {
      const todayDate = new Date().toISOString().split('T')[0]
      const yesterdayDate = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      
      const mockJobs = [
        { 
          id: '1',
          scheduled_date: `${todayDate}T10:00:00`,
          status: 'completed'
        },
        {
          id: '2',
          scheduled_date: `${todayDate}T14:00:00`,
          status: 'pending'
        },
        {
          id: '3',
          scheduled_date: `${yesterdayDate}T16:00:00`, // Yesterday, shouldn't count
          status: 'completed'
        },
        {
          id: '4',
          scheduled_date: `${todayDate}T18:00:00`,
          status: 'cancelled' // Cancelled, shouldn't count
        }
      ]

      supabase.from.mockImplementation((table) => {
        if (table === 'jobs') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                order: vi.fn(() => Promise.resolve({ 
                  data: mockJobs, 
                  error: null 
                }))
              }))
            }))
          }
        }
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({ 
                data: { is_online: false, profile_photo: null, business_name: 'Test Pro' },
                error: null 
              })),
              order: vi.fn(() => Promise.resolve({ data: [], error: null }))
            }))
          }))
        }
      })

      render(<Home />, { wrapper: BrowserRouter })

      // Should show 2 jobs today (not cancelled)
      await waitFor(() => {
        const jobsToday = screen.getAllByText('2').filter(el => 
          el.closest('.bg-white\\/10') !== null
        )
        expect(jobsToday.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Real-time Subscriptions Cleanup', () => {
    it('should cleanup profile subscription on unmount', () => {
      const mockUnsubscribe = vi.fn()
      
      supabase.channel.mockReturnValue({
        on: vi.fn().mockReturnThis(),
        subscribe: mockUnsubscribe
      })

      const { unmount } = render(<Home />, { wrapper: BrowserRouter })

      unmount()

      expect(supabase.removeChannel).toHaveBeenCalled()
    })
  })
})