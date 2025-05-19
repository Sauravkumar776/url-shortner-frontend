// UrlList.tsx

import React, { useState } from 'react';
import { ExternalLink, BarChart2, QrCode, Calendar, Lock, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDate } from '../lib/utils';
import QRCode from 'react-qr-code';
import { AnalyticsModal } from './AnalyticsModal.tsx';

interface Url {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  createdAt: string;
  expiresAt?: string;
  isPrivate: boolean;
  password?: string;
  tags?: string[];
  clickCount: number;
  analytics: {
    browsers: { name: string; count: number }[];
    devices: { type: string; count: number }[];
    locations: { country: string; count: number }[];
  };
}

interface UrlListProps {
  urls: Url[];
}

export function UrlList({ urls }: UrlListProps) {
  const [expandedUrl, setExpandedUrl] = useState<string | null>(null);
  const [showQR, setShowQR] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedUrl(expandedUrl === id ? null : id);
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="bg-white dark:bg-zinc-900 shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
            <thead className="bg-gray-50 dark:bg-zinc-800">
              <tr>
                {['Original URL', 'Short URL', 'Created', 'Analytics', 'Actions'].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-700">
              {urls.map((url) => (
                <React.Fragment key={url.id}>
                  <tr className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleExpand(url.id)}
                          className="mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {expandedUrl === url.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                        <a
                          href={url.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center hover:text-indigo-600 dark:hover:text-indigo-400"
                        >
                          <span className="truncate max-w-xs">{url.originalUrl}</span>
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <div className="flex items-center space-x-2">
                        <a
                          href={url.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          {url.shortCode}
                        </a>
                        {url.isPrivate && (
                          <Lock className="h-4 w-4 text-gray-400" title="Private link" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(url.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <BarChart2 className="h-4 w-4 mr-2" />
                        {url.clickCount} clicks
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowQR(url.id)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          title="Show QR Code"
                        >
                          <QrCode className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setShowAnalytics(url.id)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          title="View Analytics"
                        >
                          <BarChart2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedUrl === url.id && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 bg-gray-50 dark:bg-zinc-800">
                        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                          {url.expiresAt && (
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              Expires: {formatDate(url.expiresAt)}
                            </div>
                          )}
                          {url.tags && url.tags.length > 0 && (
                            <div className="flex items-center space-x-2">
                              <Tag className="h-4 w-4 text-gray-400" />
                              <div className="flex flex-wrap gap-2">
                                {url.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">QR Code</h3>
              <button
                onClick={() => setShowQR(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
            <div className="flex justify-center p-4 bg-white dark:bg-zinc-800">
              <QRCode
                value={urls.find(u => u.id === showQR)?.shortUrl || ''}
                size={200}
                bgColor="transparent"
                fgColor={window.matchMedia('(prefers-color-scheme: dark)').matches ? '#fff' : '#000'}
              />
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalytics && (
        <AnalyticsModal
          url={urls.find(u => u.id === showAnalytics)!}
          onClose={() => setShowAnalytics(null)}
        />
      )}
    </div>
  );
}
