import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

// Custom render function with Router
export function renderWithRouter(ui, options = {}) {
  const { route = '/', ...renderOptions } = options
  
  window.history.pushState({}, 'Test page', route)
  
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>,
    renderOptions
  )
}

// Helper to wait for async operations
export const waitFor = async (callback, { timeout = 3000, interval = 50 } = {}) => {
  const startTime = Date.now()
  
  while (Date.now() - startTime < timeout) {
    try {
      const result = callback()
      if (result) return result
    } catch (error) {
      // Continue waiting
    }
    await new Promise(resolve => setTimeout(resolve, interval))
  }
  
  throw new Error('Timeout waiting for condition')
}

// Mock localStorage
export const mockLocalStorage = () => {
  let store = {}
  
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString() },
    removeItem: (key) => { delete store[key] },
    clear: () => { store = {} },
  }
}