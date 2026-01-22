import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useJobOfferListener } from '../useJobOfferListener'
import { supabase } from '../../lib/supabaseClient'

// Mock Supabase
vi.mock('../../lib/supabaseClient', () => ({
  supabase: {
    rpc: vi.fn(),
    channel: vi.fn(),
  },
}))

// Mock window.location.reload
delete window.location
window.location = { reload: vi.fn() }

// Mock Audio
global.Audio = vi.fn().mockImplementation(() => ({
  play: vi.fn().mockResolvedValue(undefined),
}))

describe('useJobOfferListener Hook', () => {
  let mockSubscription
  let mockChannel
  let mockOnHandlers

  beforeEach(() => {
    mockOnHandlers = {}
    mockSubscription = {
      unsubscribe: vi.fn(),
    }

    mockChannel = {
      on: vi.fn((event, config, handler) => {
        // Store handlers so we can trigger them in tests
        const key = `${config.table}_${config.event}_${config.filter}`
        mockOnHandlers[key] = handler
        return mockChannel
      }),
      subscribe: vi.fn(() => mockSubscription),
    }

    supabase.channel.mockReturnValue(mockChannel)
    supabase.rpc.mockResolvedValue({ data: [], error: null })

    // Mock window.alert
    global.alert = vi.fn()
    
    // Mock console methods
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial State and Setup', () => {
    it('should start with null offer and not listening', () => {
      const { result } = renderHook(() => useJobOfferListener('provider-123'))

      expect(result.current.currentOffer).toBe(null)
      expect(result.current.isListening).toBe(false)
    })

    it('should not fetch or subscribe without provider ID', () => {
      renderHook(() => useJobOfferListener(null))

      expect(supabase.rpc).not.toHaveBeenCalled()
      expect(supabase.channel).not.toHaveBeenCalled()
    })

    it('should fetch current offer on mount', async () => {
      const mockOffer = {
        job_id: 'job-1',
        title: 'Fix plumbing',
        timeout_at: new Date().toISOString(),
      }

      supabase.rpc.mockResolvedValue({
        data: [mockOffer],
        error: null,
      })

      const { result } = renderHook(() => useJobOfferListener('provider-123'))

      await waitFor(() => {
        expect(result.current.currentOffer).toEqual(mockOffer)
      })

      expect(supabase.rpc).toHaveBeenCalledWith('get_current_job_offer', {
        p_provider_id: 'provider-123',
      })
    })

    it('should handle fetch errors gracefully', async () => {
      supabase.rpc.mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      })

      const { result } = renderHook(() => useJobOfferListener('provider-123'))

      await waitFor(() => {
        expect(result.current.currentOffer).toBe(null)
      })

      expect(console.error).toHaveBeenCalled()
    })

    it('should set up real-time subscription', async () => {
      const { result } = renderHook(() => useJobOfferListener('provider-123'))

      await waitFor(() => {
        expect(result.current.isListening).toBe(true)
      })

      expect(supabase.channel).toHaveBeenCalledWith('job-offers')
      expect(mockChannel.on).toHaveBeenCalledTimes(2) // INSERT and UPDATE
      expect(mockChannel.subscribe).toHaveBeenCalled()
    })
  })

  describe('Real-time Offer Reception', () => {
    it('should receive new job offer via INSERT event', async () => {
      const mockOffer = {
        job_id: 'job-2',
        title: 'Electrical work',
        timeout_at: new Date().toISOString(),
      }

      supabase.rpc
        .mockResolvedValueOnce({ data: [], error: null }) // Initial fetch
        .mockResolvedValueOnce({ data: [mockOffer], error: null }) // After INSERT

      const { result } = renderHook(() => useJobOfferListener('provider-123'))

      await waitFor(() => {
        expect(result.current.isListening).toBe(true)
      })

      // Simulate INSERT event
      const insertHandler = mockOnHandlers['job_dispatch_queue_INSERT_provider_id=eq.provider-123']
      await act(async () => {
        await insertHandler({
          new: { job_id: 'job-2', provider_id: 'provider-123' },
        })
      })

      await waitFor(() => {
        expect(result.current.currentOffer).toEqual(mockOffer)
      })
    })

    it('should play notification sound on new offer', async () => {
      const mockOffer = { job_id: 'job-3', title: 'New job' }

      supabase.rpc
        .mockResolvedValueOnce({ data: [], error: null })
        .mockResolvedValueOnce({ data: [mockOffer], error: null })

      const { result } = renderHook(() => useJobOfferListener('provider-123'))

      await waitFor(() => {
        expect(result.current.isListening).toBe(true)
      })

      const insertHandler = mockOnHandlers['job_dispatch_queue_INSERT_provider_id=eq.provider-123']
      await act(async () => {
        await insertHandler({ new: { job_id: 'job-3' } })
      })

      await waitFor(() => {
        expect(Audio).toHaveBeenCalledWith('/notification.mp3')
      })
    })

    it('should clear offer on UPDATE with response', async () => {
      const mockOffer = { job_id: 'job-4', title: 'Test job' }

      supabase.rpc.mockResolvedValue({
        data: [mockOffer],
        error: null,
      })

      const { result } = renderHook(() => useJobOfferListener('provider-123'))

      await waitFor(() => {
        expect(result.current.currentOffer).toEqual(mockOffer)
      })

      // Simulate UPDATE with response (job was answered)
      const updateHandler = mockOnHandlers['job_dispatch_queue_UPDATE_provider_id=eq.provider-123']
      act(() => {
        updateHandler({
          new: { job_id: 'job-4', response: 'accepted' },
        })
      })

      await waitFor(() => {
        expect(result.current.currentOffer).toBe(null)
      })
    })
  })

  describe('Accept Offer', () => {
    it('should accept job offer successfully', async () => {
      const mockOffer = { job_id: 'job-5', title: 'Accept test' }

      supabase.rpc
        .mockResolvedValueOnce({ data: [mockOffer], error: null }) // Initial fetch
        .mockResolvedValueOnce({ data: true, error: null }) // accept_job

      const { result } = renderHook(() => useJobOfferListener('provider-123'))

      await waitFor(() => {
        expect(result.current.currentOffer).toEqual(mockOffer)
      })

      let acceptResult
      await act(async () => {
        acceptResult = await result.current.acceptOffer()
      })

      expect(acceptResult).toBe(true)
      expect(supabase.rpc).toHaveBeenCalledWith('accept_job', {
        p_job_id: 'job-5',
        p_provider_id: 'provider-123',
      })
      expect(alert).toHaveBeenCalledWith('Job accepted! Check your schedule.')
      expect(window.location.reload).toHaveBeenCalled()
    })

    it('should handle job already accepted by another provider', async () => {
      const mockOffer = { job_id: 'job-6', title: 'Race condition test' }

      supabase.rpc
        .mockResolvedValueOnce({ data: [mockOffer], error: null })
        .mockResolvedValueOnce({ data: false, error: null }) // Job taken

      const { result } = renderHook(() => useJobOfferListener('provider-123'))

      await waitFor(() => {
        expect(result.current.currentOffer).toEqual(mockOffer)
      })

      let acceptResult
      await act(async () => {
        acceptResult = await result.current.acceptOffer()
      })

      expect(acceptResult).toBe(false)
      expect(alert).toHaveBeenCalledWith('This job has already been accepted by another provider.')
      expect(result.current.currentOffer).toBe(null)
      expect(window.location.reload).not.toHaveBeenCalled()
    })

    it('should handle accept errors', async () => {
      const mockOffer = { job_id: 'job-7', title: 'Error test' }

      supabase.rpc
        .mockResolvedValueOnce({ data: [mockOffer], error: null })
        .mockResolvedValueOnce({ data: null, error: { message: 'Network error' } })

      const { result } = renderHook(() => useJobOfferListener('provider-123'))

      await waitFor(() => {
        expect(result.current.currentOffer).toEqual(mockOffer)
      })

      let acceptResult
      await act(async () => {
        acceptResult = await result.current.acceptOffer()
      })

      expect(acceptResult).toBe(false)
      expect(alert).toHaveBeenCalledWith('Failed to accept job. Please try again.')
      expect(console.error).toHaveBeenCalled()
    })

    it('should not accept if no current offer', async () => {
      const { result } = renderHook(() => useJobOfferListener('provider-123'))

      await act(async () => {
        await result.current.acceptOffer()
      })

      expect(supabase.rpc).toHaveBeenCalledTimes(1) // Only initial fetch
    })
  })

  describe('Decline Offer', () => {
    it('should decline job offer successfully', async () => {
      const mockOffer = { job_id: 'job-8', title: 'Decline test' }

      supabase.rpc
        .mockResolvedValueOnce({ data: [mockOffer], error: null })
        .mockResolvedValueOnce({ data: 'next-provider-id', error: null })

      const { result } = renderHook(() => useJobOfferListener('provider-123'))

      await waitFor(() => {
        expect(result.current.currentOffer).toEqual(mockOffer)
      })

      let declineResult
      await act(async () => {
        declineResult = await result.current.declineOffer()
      })

      expect(declineResult).toBe(true)
      expect(supabase.rpc).toHaveBeenCalledWith('decline_job', {
        p_job_id: 'job-8',
        p_provider_id: 'provider-123',
      })
      expect(result.current.currentOffer).toBe(null)
    })

    it('should handle decline errors', async () => {
      const mockOffer = { job_id: 'job-9', title: 'Decline error test' }

      supabase.rpc
        .mockResolvedValueOnce({ data: [mockOffer], error: null })
        .mockResolvedValueOnce({ data: null, error: { message: 'Error' } })

      const { result } = renderHook(() => useJobOfferListener('provider-123'))

      await waitFor(() => {
        expect(result.current.currentOffer).toEqual(mockOffer)
      })

      let declineResult
      await act(async () => {
        declineResult = await result.current.declineOffer()
      })

      expect(declineResult).toBe(false)
      expect(alert).toHaveBeenCalledWith('Failed to decline job. Please try again.')
    })
  })

  describe('Timeout Handling', () => {
    it('should handle job timeout', async () => {
      const mockOffer = { job_id: 'job-10', title: 'Timeout test' }

      supabase.rpc
        .mockResolvedValueOnce({ data: [mockOffer], error: null })
        .mockResolvedValueOnce({ data: 'next-provider-id', error: null })

      const { result } = renderHook(() => useJobOfferListener('provider-123'))

      await waitFor(() => {
        expect(result.current.currentOffer).toEqual(mockOffer)
      })

      await act(async () => {
        await result.current.handleTimeout()
      })

      expect(supabase.rpc).toHaveBeenCalledWith('expire_job_offer', {
        p_job_id: 'job-10',
        p_provider_id: 'provider-123',
      })
      expect(alert).toHaveBeenCalledWith('You missed this job offer. It has been sent to another provider.')
      expect(result.current.currentOffer).toBe(null)
    })

    it('should handle timeout errors gracefully', async () => {
      const mockOffer = { job_id: 'job-11', title: 'Timeout error' }

      supabase.rpc
        .mockResolvedValueOnce({ data: [mockOffer], error: null })
        .mockResolvedValueOnce({ data: null, error: { message: 'Timeout error' } })

      const { result } = renderHook(() => useJobOfferListener('provider-123'))

      await waitFor(() => {
        expect(result.current.currentOffer).toEqual(mockOffer)
      })

      await act(async () => {
        await result.current.handleTimeout()
      })

      expect(console.error).toHaveBeenCalledWith('Error expiring job offer:', expect.any(Object))
    })
  })

  describe('Cleanup', () => {
    it('should unsubscribe on unmount', async () => {
      const { unmount } = renderHook(() => useJobOfferListener('provider-123'))

      await waitFor(() => {
        expect(mockChannel.subscribe).toHaveBeenCalled()
      })

      unmount()

      expect(mockSubscription.unsubscribe).toHaveBeenCalled()
    })

    it('should unsubscribe when provider ID changes', async () => {
      const { rerender } = renderHook(
        ({ providerId }) => useJobOfferListener(providerId),
        { initialProps: { providerId: 'provider-123' } }
      )

      await waitFor(() => {
        expect(mockChannel.subscribe).toHaveBeenCalled()
      })

      rerender({ providerId: 'provider-456' })

      expect(mockSubscription.unsubscribe).toHaveBeenCalled()
    })
  })
})