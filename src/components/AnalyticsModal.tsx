// src/components/AnalyticsModal.tsx
import React, { useEffect, useState } from 'react';
import { get } from '../utils/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

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
  analytics?: Analytics | undefined | null; // Make analytics optional here
}

interface AnalyticsModalProps {
  url: TopUrl;
  onClose: () => void;
}

const COLORS = ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981'];

export function AnalyticsModal({ url, onClose }: AnalyticsModalProps) {
  const [analytics, setAnalytics] = useState<Analytics | null>(url.analytics);

  useEffect(() => {
    if (!url.analytics) {
      const fetchAnalytics = async () => {
        try {
          const res = await get(`/urls/${url.id}/analytics`);
          setAnalytics(res.data);
        } catch (err) {
          console.error('Error fetching URL analytics:', err);
        }
      };

      fetchAnalytics();
    }
  }, [url]);

  if (!analytics) return <div>Loading...</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Analytics for {new URL(url.shortCode).pathname.slice(1)}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Browsers Chart */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-medium mb-4">Browsers</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.browsers}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {analytics.browsers.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Devices Chart */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-medium mb-4">Devices</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.devices}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Locations Chart */}
          <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
            <h4 className="text-lg font-medium mb-4">Locations</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.locations}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="country" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#7C3AED" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
