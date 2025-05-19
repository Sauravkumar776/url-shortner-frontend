import React, { useState, useEffect } from 'react';
import { UrlForm } from '../components/UrlForm';
import { UrlList } from '../components/UrlList';
import { SearchBar } from '../components/SearchBar';
import { TagsFilter } from '../components/TagsFilter';
import { Filter, SortAsc, SortDesc, Calendar, Tag, Download } from 'lucide-react';
import { format } from 'date-fns';

interface UrlData {
  id: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
  expiresAt?: string;
  isPrivate: boolean;
  password?: string;
  tags?: string[];
  clicks: number;
}

export function UrlsPage() {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [filteredUrls, setFilteredUrls] = useState<UrlData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [filterConfig, setFilterConfig] = useState({
    showExpired: true,
    showPrivate: true,
    dateRange: { start: '', end: '' }
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchUrls();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [urls, searchQuery, selectedTags, sortConfig, filterConfig]);

  const fetchUrls = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:7784/api/urls', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const urlData = await response.json();
      setUrls(urlData.data);
    } catch (error) {
      console.error('Error fetching URLs:', error);
    }
  };

  const handleUrlSubmit = async (urlData: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:7784/api/urls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(urlData)
      });
      const newUrl = await response.json();
      setUrls(prev => [newUrl, ...prev]);
    } catch (error) {
      console.error('Error creating URL:', error);
    }
  };

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const applyFiltersAndSort = () => {
    let filtered = [...urls];

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(url =>
        url.originalUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
        url.shortUrl.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply tag filters
    if (selectedTags.length > 0) {
      filtered = filtered.filter(url =>
        selectedTags.every(tag => url.tags?.includes(tag))
      );
    }

    // Apply other filters
    if (!filterConfig.showExpired) {
      filtered = filtered.filter(url =>
        !url.expiresAt || new Date(url.expiresAt) > new Date()
      );
    }
    if (!filterConfig.showPrivate) {
      filtered = filtered.filter(url => !url.isPrivate);
    }
    if (filterConfig.dateRange.start) {
      filtered = filtered.filter(url =>
        new Date(url.createdAt) >= new Date(filterConfig.dateRange.start)
      );
    }
    if (filterConfig.dateRange.end) {
      filtered = filtered.filter(url =>
        new Date(url.createdAt) <= new Date(filterConfig.dateRange.end)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof UrlData];
      const bValue = b[sortConfig.key as keyof UrlData];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortConfig.direction === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    setFilteredUrls(filtered);
  };

  const exportUrls = () => {
    const csvContent = [
      ['Original URL', 'Short URL', 'Created At', 'Expires At', 'Clicks', 'Tags'],
      ...filteredUrls.map(url => [
        url.originalUrl,
        url.shortUrl,
        format(new Date(url.createdAt), 'yyyy-MM-dd HH:mm:ss'),
        url.expiresAt ? format(new Date(url.expiresAt), 'yyyy-MM-dd HH:mm:ss') : '',
        url.clicks.toString(),
        url.tags?.join(', ') || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `urls-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const allTags = Array.from(new Set(urls.flatMap(url => url.tags || [])));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Create Short URL</h2>
        <UrlForm onSubmit={handleUrlSubmit} />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Your URLs</h2>
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
            <button
              onClick={exportUrls}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
            <div className="flex-1">
              <SearchBar onSearch={setSearchQuery} />
            </div>
            <TagsFilter
              tags={allTags}
              selectedTags={selectedTags}
              onTagSelect={tag => setSelectedTags(prev => [...prev, tag])}
              onTagRemove={tag => setSelectedTags(prev => prev.filter(t => t !== tag))}
            />
          </div>

          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date Range</label>
                  <input
                    type="date"
                    value={filterConfig.dateRange.start}
                    onChange={e => setFilterConfig(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, start: e.target.value }
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">To</label>
                  <input
                    type="date"
                    value={filterConfig.dateRange.end}
                    onChange={e => setFilterConfig(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, end: e.target.value }
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showExpired"
                    checked={filterConfig.showExpired}
                    onChange={e => setFilterConfig(prev => ({
                      ...prev,
                      showExpired: e.target.checked
                    }))}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showExpired" className="text-sm text-gray-700">
                    Show Expired
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showPrivate"
                    checked={filterConfig.showPrivate}
                    onChange={e => setFilterConfig(prev => ({
                      ...prev,
                      showPrivate: e.target.checked
                    }))}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showPrivate" className="text-sm text-gray-700">
                    Show Private
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('originalUrl')}
                  >
                    <div className="flex items-center">
                      Original URL
                      {sortConfig.key === 'originalUrl' && (
                        sortConfig.direction === 'asc' ? <SortAsc className="h-4 w-4 ml-1" /> : <SortDesc className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center">
                      Created
                      {sortConfig.key === 'createdAt' && (
                        sortConfig.direction === 'asc' ? <SortAsc className="h-4 w-4 ml-1" /> : <SortDesc className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('clicks')}
                  >
                    <div className="flex items-center">
                      Clicks
                      {sortConfig.key === 'clicks' && (
                        sortConfig.direction === 'asc' ? <SortAsc className="h-4 w-4 ml-1" /> : <SortDesc className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <UrlList urls={filteredUrls} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}