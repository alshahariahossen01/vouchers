import React from 'react';
import { useAuth } from '../App';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  User, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  Menu,
  X,
  HeadphonesIcon
} from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Voucher Platform</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-primary-600 transition-colors duration-200 flex items-center space-x-1"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === 'admin' ? (
                  <>
                    <Link 
                      to="/admin/dashboard" 
                      className="text-gray-600 hover:text-primary-600 transition-colors duration-200 flex items-center space-x-1"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    <Link 
                      to="/admin/orders" 
                      className="text-gray-600 hover:text-primary-600 transition-colors duration-200 flex items-center space-x-1"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Orders</span>
                    </Link>
                  </>
                ) : (
                  <Link 
                    to="/my-orders" 
                    className="text-gray-600 hover:text-primary-600 transition-colors duration-200 flex items-center space-x-1"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>My Orders</span>
                  </Link>
                )}
                
                <Link 
                  to="/support" 
                  className="text-gray-600 hover:text-primary-600 transition-colors duration-200 flex items-center space-x-1"
                >
                  <HeadphonesIcon className="w-4 h-4" />
                  <span>Support</span>
                </Link>

                {/* User Menu */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">{user?.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-red-600 transition-colors duration-200 flex items-center space-x-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-primary-600 transition-colors duration-200 flex items-center space-x-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>

              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' ? (
                    <>
                      <Link 
                        to="/admin/dashboard" 
                        className="text-gray-600 hover:text-primary-600 transition-colors duration-200 flex items-center space-x-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link 
                        to="/admin/orders" 
                        className="text-gray-600 hover:text-primary-600 transition-colors duration-200 flex items-center space-x-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Orders</span>
                      </Link>
                    </>
                  ) : (
                    <Link 
                      to="/my-orders" 
                      className="text-gray-600 hover:text-primary-600 transition-colors duration-200 flex items-center space-x-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>My Orders</span>
                    </Link>
                  )}
                  
                  <Link 
                    to="/support" 
                    className="text-gray-600 hover:text-primary-600 transition-colors duration-200 flex items-center space-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <HeadphonesIcon className="w-4 h-4" />
                    <span>Support</span>
                  </Link>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600">{user?.username}</span>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-gray-600 hover:text-red-600 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn-primary inline-block text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
