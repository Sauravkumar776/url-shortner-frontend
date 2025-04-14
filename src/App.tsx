import React, { useState, useEffect } from 'react';
import { Link, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { Link2, LogOut } from 'lucide-react';
import { AuthForm } from './components/AuthForm';
import { UrlForm } from './components/UrlForm';
import { UrlList } from './components/UrlList';

const API_URL = 'http://localhost:7784';

interface User {
  id: string;
  email: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [urls, setUrls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        fetchUrls(token);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchUrls = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/urls`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const urlData = await response.json();
        setUrls(urlData);
      }
    } catch (error) {
      console.error('Error fetching URLs:', error);
    }
  };

  const handleAuth = async (email: string, password: string, isLogin: boolean) => {
    try {
      const response = await fetch(`${API_URL}/${isLogin ? 'login' : 'register'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('token', token);
        await fetchUser(token);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const handleUrlSubmit = async (url: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/urls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url })
      });

      if (response.ok) {
        const newUrl = await response.json();
        setUrls((prev) => [newUrl, ...prev]);
      }
    } catch (error) {
      console.error('Error creating short URL:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {user && (
        <nav className="bg-white/80 backdrop-blur-sm shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link2 className="h-6 w-6 text-indigo-600" />
                <span className="ml-2 text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  URL Shortener
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-700 mr-4">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-gray-900 transition-all duration-300"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[80vh]">
                  <AuthForm onSubmit={(email, password) => handleAuth(email, password, true)} type="login" />
                  <p className="mt-6 text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-300">
                      Sign up
                    </Link>
                  </p>
                </div>
              )
            }
          />
          <Route
            path="/register"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[80vh]">
                  <AuthForm onSubmit={(email, password) => handleAuth(email, password, false)} type="register" />
                  <p className="mt-6 text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-300">
                      Sign in
                    </Link>
                  </p>
                </div>
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              !user ? (
                <Navigate to="/login" replace />
              ) : (
                <div className="space-y-8">
                  <div className="flex flex-col items-center">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-4">Shorten a URL</h1>
                    <UrlForm onSubmit={handleUrlSubmit} />
                  </div>
                  <div className="flex flex-col items-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Your URLs</h2>
                    <UrlList urls={urls} />
                  </div>
                </div>
              )
            }
          />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;