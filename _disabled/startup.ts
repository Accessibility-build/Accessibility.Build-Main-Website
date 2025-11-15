import { initializeJobProcessor } from './queue'

// Initialize all background services
export function initializeApp() {
  if (typeof window === 'undefined') { // Server-side only
    try {
      // Initialize job processor - temporarily disabled to prevent connection errors
      // initializeJobProcessor()
      
      console.log('✓ Application initialized successfully (queue processor disabled)')
    } catch (error) {
      console.error('✗ Failed to initialize application:', error)
    }
  }
}

// Auto-initialize on import (server-side only)
if (typeof window === 'undefined') {
  initializeApp()
} 