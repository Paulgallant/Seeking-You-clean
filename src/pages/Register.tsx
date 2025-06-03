import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [accountType, setAccountType] = useState('personal');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await signUp(email, password, username, accountType);
    } catch (error) {
      setError('Failed to create an account. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join the next generation of social networking
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-rose-500 focus:border-rose-500 focus:z-10 sm:text-sm"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-rose-500 focus:border-rose-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-rose-500 focus:border-rose-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Type</label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    id="personal"
                    name="account-type"
                    type="radio"
                    value="personal"
                    checked={accountType === 'personal'}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300"
                  />
                  <label htmlFor="personal" className="ml-3 block text-sm font-medium text-gray-700">
                    Personal Account
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="business"
                    name="account-type"
                    type="radio"
                    value="business"
                    checked={accountType === 'business'}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300"
                  />
                  <label htmlFor="business" className="ml-3 block text-sm font-medium text-gray-700">
                    Business Account
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="creator"
                    name="account-type"
                    type="radio"
                    value="creator"
                    checked={accountType === 'creator'}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300"
                  />
                  <label htmlFor="creator" className="ml-3 block text-sm font-medium text-gray-700">
                    Content Creator
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <Wallet className="h-5 w-5 text-rose-500 group-hover:text-rose-400" />
              </span>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>

          <div className="text-sm text-center">
            <Link to="/login" className="font-medium text-rose-600 hover:text-rose-500">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;