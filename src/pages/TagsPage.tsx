import React, { useState } from 'react';
import { Tag, Plus, X } from 'lucide-react';

export function TagsPage() {
  const [tags, setTags] = useState([
    { id: 1, name: 'Marketing', urlCount: 15, color: 'blue' },
    { id: 2, name: 'Social Media', urlCount: 23, color: 'green' },
    { id: 3, name: 'Blog Posts', urlCount: 8, color: 'purple' },
  ]);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim()) {
      setTags([
        ...tags,
        {
          id: tags.length + 1,
          name: newTag.trim(),
          urlCount: 0,
          color: 'gray',
        },
      ]);
      setNewTag('');
    }
  };

  const handleDeleteTag = (id: number) => {
    setTags(tags.filter(tag => tag.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manage Tags</h1>
        <form onSubmit={handleAddTag} className="flex space-x-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add new tag"
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Tag
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="relative bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Tag className={`h-5 w-5 text-${tag.color}-500 mr-2`} />
                <h3 className="text-lg font-medium text-gray-900">{tag.name}</h3>
              </div>
              <button
                onClick={() => handleDeleteTag(tag.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {tag.urlCount} URLs tagged
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}