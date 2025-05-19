import React, { useState } from 'react';
import { Link2, Calendar, Lock, Tag } from 'lucide-react';
import { cn } from '../lib/utils';

interface UrlFormProps {
  onSubmit: (urlData: {
    url: string;
    customSlug?: string;
    expiresAt?: string;
    isPrivate?: boolean;
    password?: string;
    tags?: string[];
  }) => void;
}

export function UrlForm({ onSubmit }: UrlFormProps) {
  const [url, setUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      url,
      customSlug: customSlug || undefined,
      expiresAt: expiresAt || undefined,
      isPrivate,
      password: password || undefined,
      tags: tags.length > 0 ? tags : undefined,
    });
    setUrl('');
    setCustomSlug('');
    setExpiresAt('');
    setIsPrivate(false);
    setPassword('');
    setTags([]);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Link2 className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your URL here"
            required
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Shorten
        </button>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          {showAdvanced ? 'Hide advanced options' : 'Show advanced options'}
        </button>
      </div>

      {showAdvanced && (
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom URL Slug
              </label>
              <input
                type="text"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="custom-slug"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiration Date
              </label>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="private"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="private" className="ml-2 block text-sm text-gray-700">
                Make this link private
              </label>
            </div>

            {isPrivate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password Protection
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter password"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-indigo-600 hover:text-indigo-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Add tags (press Enter)"
              />
            </div>
          </div>
        </div>
      )}
    </form>
  );
}