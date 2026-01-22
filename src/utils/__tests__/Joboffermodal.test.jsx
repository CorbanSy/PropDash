import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import JobOfferModal from '../../components/ProviderDashboard/JobOfferModal'

describe('JobOfferModal - Critical Timer Logic', () => {
  let mockOnAccept
  let mockOnDecline
  let mockOnTimeout

  const mockJobOffer = {
    job_id: 'job-123',
    service_name: 'Fix Plumbing',
    category: 'plumbing',
    customer_name: 'John Doe',
    scheduled_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    client_address: '123 Main St',
    distance_km: 5.2,
    notes: 'Leaky faucet in kitchen',
    offered_at: new Date().toISOString() // Just now
  }

  beforeEach(() => {
    vi.useFakeTimers()
    mockOnAccept = vi.fn()
    mockOnDecline = vi.fn()
    mockOnTimeout = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('Timer Countdown', () => {
    it('should start timer at 5 minutes for fresh offer', () => {
      render(
        <JobOfferModal
          jobOffer={mockJobOffer}
          onAccept={mockOnAccept}
          onDecline={mockOnDecline}
          onTimeout={mockOnTimeout}
        />
      )

      expect(screen.getByText('5:00')).toBeInTheDocument()
    })

    it('should countdown timer every second', async () => {
      render(
        <JobOfferModal
          jobOffer={mockJobOffer}
          onAccept={mockOnAccept}
          onDecline={mockOnDecline}
          onTimeout={mockOnTimeout}
        />
      )

      expect(screen.getByText('5:00')).toBeInTheDocument()

      act(() => {
        vi.advanceTimersByTime(1000) // 1 second
      })

      await waitFor(() => {
        expect(screen.getByText('4:59')).toBeInTheDocument()
      })

      act(() => {
        vi.advanceTimersByTime(2000) // 2 more seconds
      })

      await waitFor(() => {
        expect(screen.getByText('4:57')).toBeInTheDocument()
      })
    })

    it('should trigger timeout when timer reaches zero', async () => {
      render(
        <JobOfferModal
          jobOffer={mockJobOffer}
          onAccept={mockOnAccept}
          onDecline={mockOnDecline}
          onTimeout={mockOnTimeout}
        />
      )

      // Fast-forward 5 minutes (300 seconds)
      act(() => {
        vi.advanceTimersByTime(300000)
      })

      await waitFor(() => {
        expect(mockOnTimeout).toHaveBeenCalledTimes(1)
      })
    })

    it('should calculate remaining time from offered_at correctly', () => {
      // Offer was made 2 minutes ago
      const twoMinutesAgo = new Date(Date.now() - 120000)
      
      const oldOffer = {
        ...mockJobOffer,
        offered_at: twoMinutesAgo.toISOString()
      }

      render(
        <JobOfferModal
          jobOffer={oldOffer}
          onAccept={mockOnAccept}
          onDecline={mockOnDecline}
          onTimeout={mockOnTimeout}
        />
      )

      // Should start at 3:00 (5 minutes - 2 minutes elapsed)
      expect(screen.getByText('3:00')).toBeInTheDocument()
    })

    it('should trigger timeout immediately if offer already expired', async () => {
      // Offer was made 6 minutes ago (expired)
      const sixMinutesAgo = new Date(Date.now() - 360000)
      
      const expiredOffer = {
        ...mockJobOffer,
        offered_at: sixMinutesAgo.toISOString()
      }

      render(
        <JobOfferModal
          jobOffer={expiredOffer}
          onAccept={mockOnAccept}
          onDecline={mockOnDecline}
          onTimeout={mockOnTimeout}
        />
      )

      // Should immediately trigger timeout
      await waitFor(() => {
        expect(mockOnTimeout).toHaveBeenCalledTimes(1)
      })
    })

    it('should show urgent warning when time < 60 seconds', async () => {
      // Offer was made 4 minutes and 30 seconds ago
      const almostExpired = new Date(Date.now() - 270000)
      
      const urgentOffer = {
        ...mockJobOffer,
        offered_at: almostExpired.toISOString()
      }

      render(
        <JobOfferModal
          jobOffer={urgentOffer}
          onAccept={mockOnAccept}
          onDecline={mockOnDecline}
          onTimeout={mockOnTimeout}
        />
      )

      // Should show urgent warning
      await waitFor(() => {
        expect(screen.getByText(/Time running out!/i)).toBeInTheDocument()
      })
    })

    it('should cleanup timer interval on unmount', () => {
      const { unmount } = render(
        <JobOfferModal
          jobOffer={mockJobOffer}
          onAccept={mockOnAccept}
          onDecline={mockOnDecline}
          onTimeout={mockOnTimeout}
        />
      )

      unmount()

      // Advance time after unmount - timeout should NOT be called
      act(() => {
        vi.advanceTimersByTime(300000)
      })

      expect(mockOnTimeout).not.toHaveBeenCalled()
    })
  })

  describe('Accept Job', () => {
    it('should call onAccept when accept button clicked', async () => {
      mockOnAccept.mockResolvedValue(undefined)

      render(
        <JobOfferModal
          jobOffer={mockJobOffer}
          onAccept={mockOnAccept}
          onDecline={mockOnDecline}
          onTimeout={mockOnTimeout}
        />
      )

      const acceptButton = screen.getByRole('button', { name: /Accept Job/i })
      
      await act(async () => {
        fireEvent.click(acceptButton)
      })

      expect(mockOnAccept).toHaveBeenCalledTimes(1)
    })

    it('should show loading state while accepting', async () => {
      // Make onAccept take some time
      mockOnAccept.mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 1000))
      )

      render(
        <JobOfferModal
          jobOffer={mockJobOffer}
          onAccept={mockOnAccept}
          onDecline={mockOnDecline}
          onTimeout={mockOnTimeout}
        />
      )

      const acceptButton = screen.getByRole('button', { name: /Accept Job/i })
      
      act(() => {
        fireEvent.click(acceptButton)
      })

      await waitFor(() => {
        expect(screen.getByText(/Accepting.../i)).toBeInTheDocument()
      })

      expect(acceptButton).toBeDisabled()
    })

    it('should disable both buttons while accepting', async () => {
      mockOnAccept.mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 1000))
      )

      render(
        <JobOfferModal
          jobOffer={mockJobOffer}
          onAccept={mockOnAccept}
          onDecline={mockOnDecline}
          onTimeout={mockOnTimeout}
        />
      )

      const acceptButton = screen.getByRole('button', { name: /Accept Job/i })
      const declineButton = screen.getByRole('button', { name: /^Decline$/i })
      
      act(() => {
        fireEvent.click(acceptButton)
      })

      await waitFor(() => {
        expect(acceptButton).toBeDisabled()
        expect(declineButton).toBeDisabled()
      })
    })
  })

  describe('Decline Job', () => {
    it('should call onDecline when decline button clicked', async () => {
      mockOnDecline.mockResolvedValue(undefined)

      render(
        <JobOfferModal
          jobOffer={mockJobOffer}
          onAccept={mockOnAccept}
          onDecline={mockOnDecline}
          onTimeout={mockOnTimeout}
        />
      )

      const declineButton = screen.getByRole('button', { name: /^Decline$/i })
      
      await act(async () => {
        fireEvent.click(declineButton)
      })

      expect(mockOnDecline).toHaveBeenCalledTimes(1)
    })

    it('should show loading state while declining', async () => {
      mockOnDecline.mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 1000))
      )

      render(
        <JobOfferModal
          jobOffer={mockJobOffer}
          onAccept={mockOnAccept}
          onDecline={mockOnDecline}
          onTimeout={mockOnTimeout}
        />
      )

      const declineButton = screen.getByRole('button', { name: /^Decline$/i })
      
      act(() => {
        fireEvent.click(declineButton)
      })

      await waitFor(() => {
        expect(screen.getByText(/Declining.../i)).toBeInTheDocument()
      })

      expect(declineButton).toBeDisabled()
    })
  })

  describe('Job Details Display', () => {
    it('should display job service name', () => {
      render(
        <JobOfferModal
          jobOffer={mockJobOffer}
          onAccept={mockOnAccept}
          onDecline={mockOnDecline}
          onTimeout={mockOnTimeout}
        />
      )

      expect(screen.getByText('Fix Plumbing')).toBeInTheDocument()
    })

    it('should display customer name', () => {
      render(
        <JobOfferModal
          jobOffer={mockJobOffer}
          onAccept={mockOnAccept}
          onDecline={mockOnDecline}
          onTimeout={mockOnTimeout}
        />
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    it('should display distance', () => {
      render(
        <JobOfferModal
          jobOffer={mockJobOffer}
          onAccept={mockOnAccept}
          onDecline={mockOnDecline}
          onTimeout={mockOnTimeout}
        />
      )

      expect(screen.getByText(/5.2 km/i)).toBeInTheDocument()
    })

    it('should handle missing optional fields', () => {
      const minimalOffer = {
        job_id: 'job-123',
        service_name: 'Fix Plumbing',
        category: 'plumbing',
        offered_at: new Date().toISOString()
      }

      render(
        <JobOfferModal
          jobOffer={minimalOffer}
          onAccept={mockOnAccept}
          onDecline={mockOnDecline}
          onTimeout={mockOnTimeout}
        />
      )

      expect(screen.getByText('Fix Plumbing')).toBeInTheDocument()
      expect(screen.getByText('New Client')).toBeInTheDocument()
      expect(screen.getByText('Flexible')).toBeInTheDocument()
    })
  })

  describe('Timer Edge Cases', () => {
    it('should handle negative elapsed time gracefully', () => {
      // Offer made in the future (shouldn't happen, but test edge case)
      const futureOffer = {
        ...mockJobOffer,
        offered_at: new Date(Date.now() + 60000).toISOString()
      }

      render(
        <JobOfferModal
          jobOffer={futureOffer}
          onAccept={mockOnAccept}
          onDecline={mockOnDecline}
          onTimeout={mockOnTimeout}
        />
      )

      // Should default to 5:00
      expect(screen.getByText('5:00')).toBeInTheDocument()
    })

    it('should not call timeout multiple times', async () => {
      render(
        <JobOfferModal
          jobOffer={mockJobOffer}
          onAccept={mockOnAccept}
          onDecline={mockOnDecline}
          onTimeout={mockOnTimeout}
        />
      )

      // Fast-forward way past expiration
      act(() => {
        vi.advanceTimersByTime(600000) // 10 minutes
      })

      await waitFor(() => {
        expect(mockOnTimeout).toHaveBeenCalledTimes(1)
      })

      // Advance more time
      act(() => {
        vi.advanceTimersByTime(60000) // 1 more minute
      })

      // Should still only be called once
      expect(mockOnTimeout).toHaveBeenCalledTimes(1)
    })

    it('should restart timer if jobOffer changes', async () => {
      const { rerender } = render(
        <JobOfferModal
          jobOffer={mockJobOffer}
          onAccept={mockOnAccept}
          onDecline={mockOnDecline}
          onTimeout={mockOnTimeout}
        />
      )

      // Countdown for a bit
      act(() => {
        vi.advanceTimersByTime(60000) // 1 minute
      })

      await waitFor(() => {
        expect(screen.getByText('4:00')).toBeInTheDocument()
      })

      // New job offer arrives
      const newOffer = {
        ...mockJobOffer,
        job_id: 'job-456',
        service_name: 'New Job',
        offered_at: new Date().toISOString()
      }

      rerender(
        <JobOfferModal
          jobOffer={newOffer}
          onAccept={mockOnAccept}
          onDecline={mockOnDecline}
          onTimeout={mockOnTimeout}
        />
      )

      // Timer should reset to 5:00
      await waitFor(() => {
        expect(screen.getByText('5:00')).toBeInTheDocument()
      })
    })
  })

  describe('Modal Visibility', () => {
    it('should not render when jobOffer is null', () => {
      const { container } = render(
        <JobOfferModal
          jobOffer={null}
          onAccept={mockOnAccept}
          onDecline={mockOnDecline}
          onTimeout={mockOnTimeout}
        />
      )

      expect(container.firstChild).toBeNull()
    })

    it('should render when jobOffer is provided', () => {
      render(
        <JobOfferModal
          jobOffer={mockJobOffer}
          onAccept={mockOnAccept}
          onDecline={mockOnDecline}
          onTimeout={mockOnTimeout}
        />
      )

      expect(screen.getByText('New Job Offer! 🎉')).toBeInTheDocument()
    })
  })
})