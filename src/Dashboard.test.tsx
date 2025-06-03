import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dashboard from '../../pages/Dashboard';
import * as AuthContext from '../../contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';

// Mock the auth context with a logged-in user
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: '123',
      email: 'test@test.com',
      user_metadata: {
        username: 'testuser',
        account_type: 'personal'
      }
    },
    loading: false,
    signOut: vi.fn(),
  }),
  AuthProvider: ({ children }) => <div data-testid="auth-provider">{children}</div>,
}));

describe('Dashboard', () => {
  it('renders dashboard components', () => {
    render(
      <BrowserRouter>
        <AuthContext.AuthProvider>
          <Dashboard />
        </AuthContext.AuthProvider>
      </BrowserRouter>
    );

    // Check for main sections
    expect(screen.getByText('Payment Settings')).toBeInTheDocument();
    expect(screen.getByText('Live Stream Settings')).toBeInTheDocument();

    // Check for statistics cards
    expect(screen.getByText('Followers')).toBeInTheDocument();
    expect(screen.getByText('Stream Time')).toBeInTheDocument();
    expect(screen.getByText('Earnings')).toBeInTheDocument();
    expect(screen.getByText('Gifts')).toBeInTheDocument();
  });

  it('renders payment method options', () => {
    render(
      <BrowserRouter>
        <AuthContext.AuthProvider>
          <Dashboard />
        </AuthContext.AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Bank Account')).toBeInTheDocument();
    expect(screen.getByText('Cryptocurrency Wallet')).toBeInTheDocument();
  });
});