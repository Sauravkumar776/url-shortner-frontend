import React from 'react';
import { Calendar, Clock } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'created',
    url: 'https://example.com/blog-post',
    shortUrl: 'url.sh/b1p9k2',
    timestamp: '2024-03-15T10:30:00Z',
  },
  {
    id: 2,
    type: 'clicked',
    url: 'https://example.com/products',
    shortUrl: 'url.sh/p4m7n9',
    timestamp: '2024-03-15T09:45:00Z',
  },
  // Add more activities as needed
];

export function HistoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Activity History</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="flow-root">
          <ul role="list" className="divide-y divide-gray-200">
            {activities.map((activity) => (
              <li key={activity.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {activity.type === 'created' ? (
                      <Calendar className="h-6 w-6 text-green-500" />
                    ) : (
                      <Clock className="h-6 w-6 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.type === 'created' ? 'Created new short URL' : 'URL clicked'}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {activity.url}
                    </p>
                    <p className="text-sm text-indigo-600">
                      {activity.shortUrl}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-sm text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}