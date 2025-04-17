import React from 'react';
import { Tag, X } from 'lucide-react';

interface TagsFilterProps {
  tags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onTagRemove: (tag: string) => void;
}

export function TagsFilter({ tags, selectedTags, onTagSelect, onTagRemove }: TagsFilterProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Tag className="h-4 w-4 text-gray-500" />
        <h3 className="text-sm font-medium text-gray-700">Filter by Tags</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagSelect(tag)}
            className={`
              inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
              ${
                selectedTags.includes(tag)
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
              transition-colors duration-200
            `}
          >
            {tag}
            {selectedTags.includes(tag) && (
              <X
                className="ml-1.5 h-3.5 w-3.5 text-indigo-600 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onTagRemove(tag);
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}