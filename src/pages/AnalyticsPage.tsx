// src/pages/AnalyticsPage.tsx
import React, { useEffect, useState } from "react";
import { get } from "../utils/api";
import { AnalyticsModal } from "../components/AnalyticsModal";
import { LineChart, BarChart } from "recharts";
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Line, Bar } from "recharts";

interface ClickData {
  date: string;
  count: number;
}

interface SourceData {
  name: string;
  count: number;
}

interface Analytics {
  browsers: { name: string; count: number }[];
  devices: { type: string; count: number }[];
  locations: { country: string; count: number }[];
}

interface TopUrl {
  id: string;
  shortCode: string;
  originalUrl: string;
  shortUrl: string;
  title: string;
  clickCount: number;
  analytics?: Analytics; // Make analytics optional here
}

export function AnalyticsPage() {
  const [clicksByDay, setClicksByDay] = useState<ClickData[]>([]);
  const [referrers, setReferrers] = useState<SourceData[]>([]);
  const [topUrls, setTopUrls] = useState<TopUrl[]>([]);
  const [totalUrls, setTotalUrls] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedUrl, setSelectedUrl] = useState<TopUrl | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await get("/analytics/dashboard");
        console.log('this is res data', res.data)
        const { clicksByDay, referrers, topUrls, totalUrls, totalClicks } = res.data.data;

        setClicksByDay(clicksByDay || []);
        setReferrers(referrers || []);
        setTopUrls(topUrls || []);
        setTotalUrls(totalUrls || 0);
        setTotalClicks(totalClicks || 0);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const handleUrlClick = async (url: TopUrl) => {
    // Fetch the analytics for the selected URL
    try {
      const res = await get(`/urls/${url.id}/analytics`);
      const analyticsData: Analytics = res.data;

      // Update selectedUrl with analytics data
      setSelectedUrl({ ...url, analytics: analyticsData });
    } catch (err) {
      console.error("Error fetching URL analytics:", err);
    }
  };

  const handleCloseModal = () => {
    setSelectedUrl(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow p-4 rounded-lg">
          <h3 className="text-sm  text-black ">Total URLs</h3>
          <p className="text-xl text-black font-bold">{totalUrls}</p>
        </div>
        <div className="bg-white shadow p-4 rounded-lg">
          <h3 className="text-sm text-gray-500">Total Clicks</h3>
          <p className="text-xl text-black font-bold">{totalClicks}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clicks by Day Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium bg text-gray-900 mb-4">Click Performance</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={clicksByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#4F46E5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Referrer Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Traffic Sources</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={referrers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top URLs */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Top URLs</h2>
        <ul className="space-y-2">
          {topUrls.map((url) => (
            <li
              key={url.id}
              className="border p-3 rounded-lg cursor-pointer"
              onClick={() => handleUrlClick(url)}
            >
              <p className="font-semibold">
                <a href={url.originalUrl} className="text-indigo-600" target="_blank" rel="noopener noreferrer">
                  {url.originalUrl}
                </a>
              </p>
              <p className="text-sm text-gray-600">Short: {url.shortUrl}</p>
              <p className="text-sm">Clicks: {url.clickCount}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Show Modal for Analytics */}
      {selectedUrl && (
        <AnalyticsModal url={selectedUrl} onClose={handleCloseModal} />
      )}
    </div>
  );
}
