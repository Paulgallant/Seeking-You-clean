import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';

// Mock supabase client
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
      signInWithPassword: vi.fn(() => Promise.resolve({ data: {}, error: null })),
      signUp: vi.fn(() => Promise.resolve({ data: {}, error: null })),
      signOut: vi.fn(() => Promise.resolve({ error: null })),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
      insert: vi.fn(() => Promise.resolve({ error: null })),
    })),
  },
}));

// Test component
const TestComponent = () => {
  const { user, signIn, signUp, signOut } = useAuth();
  return (
    <div>
      {user ? (
        <button onClick={() => signOut()}>Sign Out</button>
      ) : (
        <>
          <button onClick={() => signIn('test@test.com', 'password')}>Sign In</button>
          <button onClick={() => signUp('test@test.com', 'password', 'testuser', 'personal')}>
            Sign Up
          </button>
        </>
      )}
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('provides authentication context to children', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('handles sign in', async () => {
    const { supabase } = await import('../lib/supabase');
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    const signInButton = screen.getByText('Sign In');
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password',
      });
    });
  });

  it('handles sign up', async () => {
    const { supabase } = await import('../lib/supabase');
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    const signUpButton = screen.getByText('Sign Up');
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalled();
    });
  });
});