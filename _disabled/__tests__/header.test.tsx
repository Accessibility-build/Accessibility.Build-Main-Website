import { render } from '@testing-library/react'
import { Header } from '../header'

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
  }),
  usePathname: () => '/',
}))

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({ user: null }),
  SignInButton: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  UserButton: () => <div>User Button</div>,
}))

describe('Header', () => {
  it('renders the header with correct role', () => {
    const { container } = render(<Header />)
    const header = container.querySelector('header')
    expect(header).toBeTruthy()
    expect(header?.getAttribute('role')).toBe('banner')
  })

  it('renders the logo and navigation', () => {
    const { getByText } = render(<Header />)
    expect(getByText('Accessibility.build')).toBeTruthy()
  })
}) 