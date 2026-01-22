import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Hero from '../../pages/Landing/components/Hero'

// Wrapper for components that use React Router
const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('Hero Component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should render main heading', () => {
    render(<Hero />, { wrapper: RouterWrapper })
    expect(screen.getByText(/Find the right professional/i)).toBeInTheDocument()
  })

  it('should render subheading', () => {
    render(<Hero />, { wrapper: RouterWrapper })
    expect(screen.getByText(/Connect with top-rated local professionals/i)).toBeInTheDocument()
  })

  it('should render professional link', () => {
    render(<Hero />, { wrapper: RouterWrapper })
    const professionalLink = screen.getByText(/Are you a professional?/i)
    expect(professionalLink).toBeInTheDocument()
    expect(professionalLink.closest('a')).toHaveAttribute('href', '/register/professional')
  })

  it('should rotate through services', async () => {
    render(<Hero />, { wrapper: RouterWrapper })
    
    // Initial service should be visible
    expect(screen.getByText('home project')).toBeInTheDocument()
    
    // Fast-forward time to trigger rotation
    vi.advanceTimersByTime(3000)
    
    await waitFor(() => {
      expect(screen.getByText('plumbing repair')).toBeInTheDocument()
    })
  })

  it('should render service input field', () => {
    render(<Hero />, { wrapper: RouterWrapper })
    const serviceInput = screen.getByPlaceholderText(/What do you need done?/i)
    expect(serviceInput).toBeInTheDocument()
  })

  it('should render zip code input field', () => {
    render(<Hero />, { wrapper: RouterWrapper })
    const zipInput = screen.getByPlaceholderText(/Zip code/i)
    expect(zipInput).toBeInTheDocument()
  })

  it('should update service query on input change', () => {
    render(<Hero />, { wrapper: RouterWrapper })
    const serviceInput = screen.getByPlaceholderText(/What do you need done?/i)
    
    fireEvent.change(serviceInput, { target: { value: 'plumbing' } })
    expect(serviceInput).toHaveValue('plumbing')
  })

  it('should update zip code on input change', () => {
    render(<Hero />, { wrapper: RouterWrapper })
    const zipInput = screen.getByPlaceholderText(/Zip code/i)
    
    fireEvent.change(zipInput, { target: { value: '12345' } })
    expect(zipInput).toHaveValue('12345')
  })

  it('should limit zip code to 5 characters', () => {
    render(<Hero />, { wrapper: RouterWrapper })
    const zipInput = screen.getByPlaceholderText(/Zip code/i)
    
    expect(zipInput).toHaveAttribute('maxLength', '5')
  })

  it('should render search button', () => {
    render(<Hero />, { wrapper: RouterWrapper })
    const searchButton = screen.getByRole('button', { name: /Get Started/i })
    expect(searchButton).toBeInTheDocument()
  })

  it('should handle form submission', () => {
    const consoleSpy = vi.spyOn(console, 'log')
    render(<Hero />, { wrapper: RouterWrapper })
    
    const serviceInput = screen.getByPlaceholderText(/What do you need done?/i)
    const zipInput = screen.getByPlaceholderText(/Zip code/i)
    const searchButton = screen.getByRole('button', { name: /Get Started/i })
    
    fireEvent.change(serviceInput, { target: { value: 'plumbing' } })
    fireEvent.change(zipInput, { target: { value: '12345' } })
    fireEvent.click(searchButton)
    
    expect(consoleSpy).toHaveBeenCalledWith('Searching for:', 'plumbing', 'in', '12345')
  })

  it('should render all 12 category buttons', () => {
    render(<Hero />, { wrapper: RouterWrapper })
    
    const categories = [
      'Handyperson', 'Landscaping', 'Plumbing', 'Electrical',
      'Remodeling', 'Roofing', 'Painting', 'Cleaning',
      'HVAC', 'Windows', 'Concrete', 'Carpentry'
    ]
    
    categories.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument()
    })
  })

  it('should set service query when category is clicked', () => {
    render(<Hero />, { wrapper: RouterWrapper })
    
    const plumbingButton = screen.getByText('Plumbing')
    fireEvent.click(plumbingButton)
    
    const serviceInput = screen.getByPlaceholderText(/What do you need done?/i)
    expect(serviceInput).toHaveValue('Plumbing')
  })

  it('should render MapPin icon in zip code input', () => {
    const { container } = render(<Hero />, { wrapper: RouterWrapper })
    
    // Check if MapPin SVG is rendered (lucide-react renders as SVG)
    const mapPinIcon = container.querySelector('svg')
    expect(mapPinIcon).toBeInTheDocument()
  })

  it('should render Search icon in button', () => {
    render(<Hero />, { wrapper: RouterWrapper })
    const searchButton = screen.getByRole('button', { name: /Get Started/i })
    
    // Button should contain SVG (Search icon)
    expect(searchButton.querySelector('svg')).toBeInTheDocument()
  })

  it('should have correct background image styling', () => {
    const { container } = render(<Hero />, { wrapper: RouterWrapper })
    
    const backgroundDiv = container.querySelector('.bg-cover')
    expect(backgroundDiv).toHaveStyle({
      backgroundImage: "url('/src/assets/landing_page2.jpg')"
    })
  })

  it('should apply hover effects to category buttons', () => {
    const { container } = render(<Hero />, { wrapper: RouterWrapper })
    
    const categoryButton = screen.getByText('Plumbing').closest('button')
    expect(categoryButton).toHaveClass('hover:opacity-80')
  })

  it('should prevent default form submission', () => {
    render(<Hero />, { wrapper: RouterWrapper })
    
    const form = screen.getByPlaceholderText(/What do you need done?/i).closest('form')
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
    
    const preventDefaultSpy = vi.spyOn(submitEvent, 'preventDefault')
    form?.dispatchEvent(submitEvent)
    
    expect(preventDefaultSpy).toHaveBeenCalled()
  })
})