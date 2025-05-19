/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Link,
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Link2, Menu } from "lucide-react";
import { AuthForm } from "./components/AuthForm";
import { UrlForm } from "./components/UrlForm";
import { UrlList } from "./components/UrlList";
import { DashboardStats } from "./components/DashboardStats";
import { ProfileDropdown } from "./components/ProfileDropdown";
import { SearchBar } from "./components/SearchBar";
import { TagsFilter } from "./components/TagsFilter";
import { Sidebar } from "./components/Sidebar";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { HistoryPage } from "./pages/HistoryPage";
import { TagsPage } from "./pages/TagsPage";
import { TeamPage } from "./pages/TeamPage";
import { SettingsPage } from "./pages/SettingsPage";
import { UrlsPage } from "./pages/UrlsPage";
import { ProfilePage } from "./pages/ProfilePage";
import PrivateRoute from "./components/PrivateRoute";

const API_URL = "http://localhost:7784/api";

interface User {
  id: string;
  email: string;
  name?: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [urls, setUrls] = useState([
    {
      _id: "mock-id-1",
      user: "64f47b2c9a0b4f1d2c1a2e3f",
      originalUrl: "https://example.com/product",
      shortCode: "exmpl123",
      title: "Example Product Page",
      description: "This is a sample product page used for demo purposes.",
      password: null,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      tags: ["demo", "product", "sale"],
      category: "ecommerce",
      metadata: {
        category: {
          category: "ecommerce",
          confidence: 0.87,
          subcategories: ["online shopping", "retail"],
        },
        suggestions: ["electronics", "trending"],
        autoTags: ["bestseller", "discount"],
      },
      team: null,
      isPublic: true,
      clickCount: 123,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "mock-id-2",
      user: "64f47b2c9a0b4f1d2c1a2e3f",
      originalUrl: "https://openai.com/research",
      shortCode: "openai42",
      title: "OpenAI Research",
      description: "AI research and discoveries from OpenAI.",
      password: null,
      expiresAt: null,
      tags: ["ai", "ml", "research"],
      category: "technology",
      metadata: {
        category: {
          category: "technology",
          confidence: 0.95,
          subcategories: ["artificial intelligence", "machine learning"],
        },
        suggestions: ["future", "innovation"],
        autoTags: ["gpt", "transformer"],
      },
      team: "65a91b2cdfe12a0bb22c3321",
      isPublic: false,
      clickCount: 456,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [topCountries, setTopCountries] = useState<
    { country: string; count: number }[]
  >([]);

  const navigate = useNavigate();

  const dashboardData = {
    totalUrls: urls.length,
    totalClicks: urls.reduce(
      (acc: number, url: any) => acc + (url.clicks || 0),
      0
    ),
    activeLinks: urls.filter(
      (url: any) => !url.expiresAt || new Date(url.expiresAt) > new Date()
    ).length,

    topCountries: [
      { country: "United States", count: 1250 },
      { country: "United Kingdom", count: 850 },
      { country: "Germany", count: 750 },
      { country: "France", count: 600 },
      { country: "Japan", count: 450 },
    ],
  };

  const allTags = Array.from(
    new Set(urls.flatMap((url: any) => url.tags || []))
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        fetchUrls(token);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchUrls = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/urls`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const urlData = await response.json();
        console.log(urlData.data);
        setUrls(urlData.data);
      }
    } catch (error) {
      console.error("Error fetching URLs:", error);
    }
  };

  const handleAuth = async (email: string, password: string, name?: string) => {
    try {
      const response = await fetch(
        `${API_URL}/${name ? "auth/register" : "auth/login"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, name }),
        }
      );

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("token", token);
        await fetchUser(token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const handleUrlSubmit = async (urlData: any) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/urls`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(urlData),
      });

      if (response.ok) {
        const newUrl = await response.json();
        setUrls((prev) => [newUrl, ...prev]);
      }
    } catch (error) {
      console.error("Error creating short URL:", error);
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

  const filteredUrls = urls.filter((url: any) => {
    const matchesSearch =
      searchQuery === "" ||
      url.originalUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      url.shortUrl.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => url.tags?.includes(tag));

    return matchesSearch && matchesTags;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {user && (
        <>
          <Sidebar />
          <div className="lg:pl-64">
            <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center lg:hidden">
                    <button
                      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                      className="text-gray-500 hover:text-gray-600"
                    >
                      <Menu className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="flex items-center flex-1 justify-end space-x-4">
                    <SearchBar onSearch={handleSearch} />

                    <ProfileDropdown user={user} onLogout={handleLogout} />
                  </div>
                </div>
              </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute user={user}>
                      <div className="space-y-8">
                        <DashboardStats {...dashboardData} />
                        <div className="bg-white rounded-lg shadow-sm p-6">
                          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                            Create Short URL
                          </h2>
                          <UrlForm onSubmit={handleUrlSubmit} />
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                            <h2 className="text-2xl font-semibold text-gray-900">
                              Your URLs
                            </h2>
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
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/analytics"
                  element={
                    <PrivateRoute user={user}>
                      <AnalyticsPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <PrivateRoute user={user}>
                      <HistoryPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/tags"
                  element={
                    <PrivateRoute user={user}>
                      <TagsPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/team"
                  element={
                    <PrivateRoute user={user}>
                      <TeamPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <PrivateRoute user={user}>
                      <SettingsPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute user={user}>
                      <ProfilePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/urls"
                  element={
                    <PrivateRoute user={user}>
                      <UrlsPage />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </>
      )}

      {!user && (
        <Routes>
          <Route
            path="/login"
            element={
              <div className="flex flex-col items-center justify-center min-h-[80vh]">
                <AuthForm
                  onSubmit={(email, password) => handleAuth(email, password)}
                  type="login"
                />
                <p className="mt-6 text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-300"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            }
          />
          <Route
            path="/register"
            element={
              <div className="flex flex-col items-center justify-center min-h-[80vh]">
                <AuthForm
                  onSubmit={(email, password, name) =>
                    handleAuth(email, password, name)
                  }
                  type="register"
                />
                <p className="mt-6 text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-300"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
