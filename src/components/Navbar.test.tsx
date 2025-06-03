import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';
import * as AuthContext from '../contexts/AuthContext';

// Mock the auth context
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    signOut: vi.fn(),
  }),
  AuthProvider: ({ children }) => <div data-testid="auth-provider">{children}</div>,
}));

describe('Navbar', () => {
  it('renders the logo and brand name', () => {
    render(
      <BrowserRouter>
        <AuthContext.AuthProvider>
          <Navbar />
        </AuthContext.AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Seeking You')).toBeInTheDocument();
  });

  it('shows login and signup buttons when user is not authenticated', () => {
    render(
      <BrowserRouter>
        <AuthContext.AuthProvider>
          <Navbar />
        </AuthContext.AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });
});