import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import DashboardLayout from '../../components/ProviderDashboard/DashboardLayout'
import { supabase } from '../../lib/supabaseClient'
import useAuth from '../../hooks/useAuth'

// Mock dependencies
vi.mock('../../lib/supabaseClient')
vi.mock('../../hooks/useAuth')

// Mock Outlet from react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Outlet: () => <div>Outlet Content</div>
  }
})

// Mock window.confirm
global.confirm = vi.fn(() => true)

describe('DashboardLayout - Critical Business Logic', () => {
  const mockUser = { id: 'provider-123', email: 'pro@example.com' }
  let mockChannels

  beforeEach(() => {
    mockChannels = []
    
    useAuth.mockReturnValue({ user: mockUser })

    // Mock Supabase channel subscriptions
    supabase.channel = vi.fn((channelName) => {
      const channel = {
        name: channelName,
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn()
      }
      mockChannels.push(channel)
      return channel
    })

    supabase.removeChannel = vi.fn()

    // Mock Supabase queries
    supabase.from = vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: {
              profile_photo: null,
              business_name: 'Test Business',
              service_categories: ['plumbing', 'electrical']
            },
            error: null
          })),
          head: vi.fn(() => Promise.resolve({ count: 5, error: null }))
        })),
        in: vi.fn(() => ({
          is: vi.fn(() => ({
            in: vi.fn(() => ({
              head: vi.fn(() => Promise.resolve({ count: 5, error: null }))
            }))
          }))
        }))
      }))
    }))

    supabase.auth = {
      signOut: vi.fn(() => Promise.resolve({ error: null }))
    }
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Real-time Subscription Cleanup', () => {
    it('should setup two real-time subscriptions on mount', async () => {
      render(<DashboardLayout />, { wrapper: BrowserRouter })

      await waitFor(() => {
        expect(supabase.channel).toHaveBeenCalledWith('available-jobs-changes')
        expect(supabase.channel).toHaveBeenCalledWith('provider-profile-changes')
      })

      expect(mockChannels).toHaveLength(2)
    })

    it('should cleanup all subscriptions on unmount', async () => {
      const { unmount } = render(<DashboardLayout />, { wrapper: BrowserRouter })

      await waitFor(() => {
        expect(mockChannels.length).toBe(2)
      })

      unmount()

      expect(supabase.removeChannel).toHaveBeenCalledTimes(2)
      expect(supabase.removeChannel).toHaveBeenCalledWith(mockChannels[0])
      expect(supabase.removeChannel).toHaveBeenCalledWith(mockChannels[1])
    })

    it('should cleanup event listeners on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

      const { unmount } = render(<DashboardLayout />, { wrapper: BrowserRouter })

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('jobAccepted', expect.any(Function))
      expect(removeEventListenerSpy).toHaveBeenCalledWith('profileUpdated', expect.any(Function))
    })

    it('should re-setup subscriptions when user changes', async () => {
      const { rerender } = render(<DashboardLayout />, { wrapper: BrowserRouter })

      await waitFor(() => {
        expect(mockChannels.length).toBe(2)
      })

      // Change user
      useAuth.mockReturnValue({ user: { id: 'provider-456', email: 'newpro@example.com' } })

      rerender(<DashboardLayout />)

      // Should cleanup old subscriptions
      await waitFor(() => {
        expect(supabase.removeChannel).toHaveBeenCalledTimes(2)
      })

      // Should setup new subscriptions
      await waitFor(() => {
        expect(mockChannels.length).toBe(4) // 2 old + 2 new
      })
    })
  })

  describe('Available Jobs Badge Count', () => {
    it('should fetch available jobs count on mount', async () => {
      render(<DashboardLayout />, { wrapper: BrowserRouter })

      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith('providers')
      })

      // Should query jobs with correct filters
      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith('jobs')
      })
    })

    it('should display badge when jobs are available', async () => {
      // Mock 3 available jobs
      supabase.from = vi.fn((table) => {
        if (table === 'jobs') {
          return {
            select: vi.fn(() => ({
              in: vi.fn(() => ({
                is: vi.fn(() => ({
                  in: vi.fn(() => Promise.resolve({ count: 3, error: null }))
                }))
              }))
            }))
          }
        }
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({
                data: {
                  profile_photo: null,
                  business_name: 'Test Business',
                  service_categories: ['plumbing']
                },
                error: null
              }))
            }))
          }))
        }
      })

      render(<DashboardLayout />, { wrapper: BrowserRouter })

      await waitFor(() => {
        expect(screen.getByText('3')).toBeInTheDocument()
      })
    })

    it('should not display badge when no jobs available', async () => {
      // Mock 0 available jobs
      supabase.from = vi.fn((table) => {
        if (table === 'jobs') {
          return {
            select: vi.fn(() => ({
              in: vi.fn(() => ({
                is: vi.fn(() => ({
                  in: vi.fn(() => Promise.resolve({ count: 0, error: null }))
                }))
              }))
            }))
          }
        }
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({
                data: {
                  profile_photo: null,
                  business_name: 'Test Business',
                  service_categories: ['plumbing']
                },
                error: null
              }))
            }))
          }))
        }
      })

      render(<DashboardLayout />, { wrapper: BrowserRouter })

      await waitFor(() => {
        const badges = screen.queryAllByText('0')
        expect(badges.length).toBe(0)
      })
    })

    it('should refresh badge count on jobAccepted event', async () => {
      let jobsCount = 5
      
      supabase.from = vi.fn((table) => {
        if (table === 'jobs') {
          return {
            select: vi.fn(() => ({
              in: vi.fn(() => ({
                is: vi.fn(() => ({
                  in: vi.fn(() => Promise.resolve({ count: jobsCount, error: null }))
                }))
              }))
            }))
          }
        }
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({
                data: {
                  profile_photo: null,
                  business_name: 'Test Business',
                  service_categories: ['plumbing']
                },
                error: null
              }))
            }))
          }))
        }
      })

      render(<DashboardLayout />, { wrapper: BrowserRouter })

      await waitFor(() => {
        expect(screen.getByText('5')).toBeInTheDocument()
      })

      // Job accepted, reduce count
      jobsCount = 4

      // Trigger jobAccepted event
      window.dispatchEvent(new Event('jobAccepted'))

      await waitFor(() => {
        expect(screen.getByText('4')).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('should handle provider with no service categories', async () => {
      supabase.from = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({
              data: {
                profile_photo: null,
                business_name: 'Test Business',
                service_categories: [] // No categories
              },
              error: null
            }))
          }))
        }))
      }))

      render(<DashboardLayout />, { wrapper: BrowserRouter })

      await waitFor(() => {
        // Should not query jobs if no service categories
        const jobQueries = vi.mocked(supabase.from).mock.calls.filter(
          call => call[0] === 'jobs'
        )
        expect(jobQueries.length).toBe(0)
      })
    })
  })

  describe('Profile Data Management', () => {
    it('should fetch and display profile photo', async () => {
      const photoUrl = 'https://example.com/photo.jpg'
      
      supabase.from = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({
              data: {
                profile_photo: photoUrl,
                business_name: 'Test Business',
                service_categories: ['plumbing']
              },
              error: null
            }))
          }))
        }))
      }))

      render(<DashboardLayout />, { wrapper: BrowserRouter })

      await waitFor(() => {
        const img = screen.getByAltText('Profile')
        expect(img).toHaveAttribute('src', photoUrl)
      })
    })

    it('should display business name', async () => {
      render(<DashboardLayout />, { wrapper: BrowserRouter })

      await waitFor(() => {
        expect(screen.getByText('Test Business')).toBeInTheDocument()
      })
    })

    it('should fall back to email if no business name', async () => {
      supabase.from = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({
              data: {
                profile_photo: null,
                business_name: null, // No business name
                service_categories: ['plumbing']
              },
              error: null
            }))
          }))
        }))
      }))

      render(<DashboardLayout />, { wrapper: BrowserRouter })

      await waitFor(() => {
        expect(screen.getByText('pro@example.com')).toBeInTheDocument()
      })
    })

    it('should update profile on profileUpdated event', async () => {
      let businessName = 'Original Business'
      
      supabase.from = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({
              data: {
                profile_photo: null,
                business_name: businessName,
                service_categories: ['plumbing']
              },
              error: null
            }))
          }))
        }))
      }))

      render(<DashboardLayout />, { wrapper: BrowserRouter })

      await waitFor(() => {
        expect(screen.getByText('Original Business')).toBeInTheDocument()
      })

      // Update business name
      businessName = 'Updated Business'

      // Trigger profileUpdated event
      window.dispatchEvent(new Event('profileUpdated'))

      await waitFor(() => {
        expect(screen.getByText('Updated Business')).toBeInTheDocument()
      })
    })
  })

  describe('Logout Functionality', () => {
    it('should show confirmation dialog on logout', async () => {
      render(<DashboardLayout />, { wrapper: BrowserRouter })

      const userMenuButton = screen.getByRole('button', { name: /Test Business/i })
      fireEvent.click(userMenuButton)

      await waitFor(() => {
        expect(screen.getByText('Log Out')).toBeInTheDocument()
      })

      const logoutButton = screen.getByText('Log Out')
      fireEvent.click(logoutButton)

      expect(confirm).toHaveBeenCalledWith('Are you sure you want to log out?')
    })

    it('should sign out when confirmed', async () => {
      global.confirm = vi.fn(() => true)

      render(<DashboardLayout />, { wrapper: BrowserRouter })

      const userMenuButton = screen.getByRole('button', { name: /Test Business/i })
      fireEvent.click(userMenuButton)

      const logoutButton = await screen.findByText('Log Out')
      fireEvent.click(logoutButton)

      await waitFor(() => {
        expect(supabase.auth.signOut).toHaveBeenCalled()
      })
    })

    it('should not sign out when cancelled', async () => {
      global.confirm = vi.fn(() => false)

      render(<DashboardLayout />, { wrapper: BrowserRouter })

      const userMenuButton = screen.getByRole('button', { name: /Test Business/i })
      fireEvent.click(userMenuButton)

      const logoutButton = await screen.findByText('Log Out')
      fireEvent.click(logoutButton)

      expect(supabase.auth.signOut).not.toHaveBeenCalled()
    })
  })

  describe('User Menu Toggle', () => {
    it('should toggle user menu on button click', async () => {
      render(<DashboardLayout />, { wrapper: BrowserRouter })

      const userMenuButton = screen.getByRole('button', { name: /Test Business/i })
      
      // Menu should not be visible initially
      expect(screen.queryByText('Settings')).not.toBeInTheDocument()

      // Click to open
      fireEvent.click(userMenuButton)

      await waitFor(() => {
        expect(screen.getByText('Settings')).toBeInTheDocument()
      })

      // Click to close
      fireEvent.click(userMenuButton)

      await waitFor(() => {
        expect(screen.queryByText('Settings')).not.toBeInTheDocument()
      })
    })

    it('should close menu when clicking backdrop', async () => {
      render(<DashboardLayout />, { wrapper: BrowserRouter })

      const userMenuButton = screen.getByRole('button', { name: /Test Business/i })
      fireEvent.click(userMenuButton)

      await waitFor(() => {
        expect(screen.getByText('Settings')).toBeInTheDocument()
      })

      // Click backdrop (div with fixed inset-0)
      const backdrop = document.querySelector('.fixed.inset-0')
      fireEvent.click(backdrop)

      await waitFor(() => {
        expect(screen.queryByText('Settings')).not.toBeInTheDocument()
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle profile fetch errors gracefully', async () => {
      supabase.from = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({
              data: null,
              error: { message: 'Database error' }
            }))
          }))
        }))
      }))

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      render(<DashboardLayout />, { wrapper: BrowserRouter })

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled()
      })

      // Should still render layout
      expect(screen.getByText('LevlPro')).toBeInTheDocument()

      consoleSpy.mockRestore()
    })

    it('should handle jobs count fetch errors gracefully', async () => {
      supabase.from = vi.fn((table) => {
        if (table === 'jobs') {
          return {
            select: vi.fn(() => ({
              in: vi.fn(() => ({
                is: vi.fn(() => ({
                  in: vi.fn(() => Promise.resolve({
                    count: null,
                    error: { message: 'Query error' }
                  }))
                }))
              }))
            }))
          }
        }
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({
                data: {
                  profile_photo: null,
                  business_name: 'Test Business',
                  service_categories: ['plumbing']
                },
                error: null
              }))
            }))
          }))
        }
      })

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      render(<DashboardLayout />, { wrapper: BrowserRouter })

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled()
      })

      // Should not display badge count
      expect(screen.queryByText(/\d+/)).not.toBeInTheDocument()

      consoleSpy.mockRestore()
    })
  })
})