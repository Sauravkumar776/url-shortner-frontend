import React, { useState, useEffect } from 'react';
import { Link, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { Link2, LogOut } from 'lucide-react';
import { AuthForm } from './components/AuthForm';
import { UrlForm } from './components/UrlForm';
import { UrlList } from './components/UrlList';
import { DashboardStats } from './components/DashboardStats';
import { ProfileDropdown } from './components/ProfileDropdown';
import { SearchBar } from './components/SearchBar';
import { TagsFilter } from './components/TagsFilter';

const API_URL = 'http://localhost:7784';

interface User {
  id: string;
  email: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [urls, setUrls] = useState([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Mock data for demonstration
  const dashboardData = {
    totalUrls: urls.length,
    totalClicks: urls.reduce((acc: number, url: any) => acc + (url.clicks || 0), 0),
    activeLinks: urls.filter((url: any) => !url.expiresAt || new Date(url.expiresAt) > new Date()).length,
    topCountries: [
      { country: 'United States', count: 1250 },
      { country: 'United Kingdom', count: 850 },
      { country: 'Germany', count: 750 },
      { country: 'France', count: 600 },
      { country: 'Japan', count: 450 },
    ],
  };

  // Get unique tags from all URLs
  const allTags = Array.from(new Set(urls.flatMap((url: any) => url.tags || [])));

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

  const handleUrlSubmit = async (urlData: any) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/urls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(urlData)
      });

      if (response.ok) {
        const newUrl = await response.json();
        setUrls((prev) => [newUrl, ...prev]);
      }
    } catch (error) {
      console.error('Error creating short URL:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) => [...prev, tag]);
  };

  const handleTagRemove = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  // Filter URLs based on search query and selected tags
  const filteredUrls = urls.filter((url: any) => {
    const matchesSearch = searchQuery === '' || 
      url.originalUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      url.shortUrl.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 ||
      selectedTags.every(tag => url.tags?.includes(tag));

    return matchesSearch && matchesTags;
  });

  return (
    <div className="min-h-screen">
      {user && (
        <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link2 className="h-6 w-6 text-indigo-600" />
                <span className="ml-2 text-xl font-semibold gradient-text">
                  URL Shortener
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <SearchBar onSearch={handleSearch} />
                <ProfileDropdown user={user} onLogout={handleLogout} />
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
                // <Navigate to="/login" replace />
                <div className="space-y-8">
                  <DashboardStats {...dashboardData} />
                  
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Create Short URL</h2>
                    <UrlForm onSubmit={handleUrlSubmit} />
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                      <h2 className="text-2xl font-semibold text-gray-900">Your URLs</h2>
                      <div className="mt-4 sm:mt-0">
                        <TagsFilter
                          tags={allTags}
                          selectedTags={selectedTags}
                          onTagSelect={handleTagSelect}
                          onTagRemove={handleTagRemove}
                        />
                      </div>
                    </div>
                    <UrlList urls={filteredUrls} />
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <DashboardStats {...dashboardData} />
                  
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Create Short URL</h2>
                    <UrlForm onSubmit={handleUrlSubmit} />
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                      <h2 className="text-2xl font-semibold text-gray-900">Your URLs</h2>
                      <div className="mt-4 sm:mt-0">
                        <TagsFilter
                          tags={allTags}
                          selectedTags={selectedTags}
                          onTagSelect={handleTagSelect}
                          onTagRemove={handleTagRemove}
                        />
                      </div>
                    </div>
                    <UrlList urls={filteredUrls} />
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