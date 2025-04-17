import React from 'react';
import { Link2, TrendingUp, Users, Globe } from 'lucide-react';

interface DashboardStatsProps {
  totalUrls: number;
  totalClicks: number;
  activeLinks: number;
  topCountries: { country: string; count: number }[];
}

export function DashboardStats({ totalUrls, totalClicks, activeLinks, topCountries }: DashboardStatsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
      
      <div className="dashboard-grid">
        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total URLs</p>
              <p className="text-3xl font-bold text-gray-900">{totalUrls}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <Link2 className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-600">
              <span className="text-green-500">↑ 12%</span> from last month
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clicks</p>
              <p className="text-3xl font-bold text-gray-900">{totalClicks}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-600">
              <span className="text-green-500">↑ 8%</span> from last week
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Links</p>
              <p className="text-3xl font-bold text-gray-900">{activeLinks}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-600">
              <span className="text-green-500">↑ 15%</span> increase
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Countries</h3>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            {topCountries.map((country, index) => (
              <div key={country.country} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Globe className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">{country.country}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{
                        width: `${(country.count / topCountries[0].count) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="ml-3 text-sm text-gray-600">{country.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}