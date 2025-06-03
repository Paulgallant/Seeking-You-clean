import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Menu, LogOut, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, signOut, loading } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Heart className="h-8 w-8 text-rose-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">Seeking You</span>
            </Link>
          </div>
          
          {!loading && (
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                to="/roles" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
              >
                <span className="flex items-center">
                  <Users className="h-5 w-5 mr-1" />
                  Team Roles
                </span>
              </Link>
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
                  >
                    <LogOut className="h-5 w-5 mr-1" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-rose-600 text-white px-4 py-2 rounded-md hover:bg-rose-700"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}

          <div className="md:hidden flex items-center">
            <button className="text-gray-600 hover:text-gray-900">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;