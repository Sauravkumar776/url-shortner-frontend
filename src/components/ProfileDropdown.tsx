import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProfileDropdownProps {
  user: {
    email: string;
    name?: string;
  } | null;
  onLogout: () => void;
}

export function ProfileDropdown({ user, onLogout }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 hover:bg-gray-50 rounded-full py-2 px-3 transition-colors duration-200"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium">
          {user?.name ? user?.name[0].toUpperCase() : user?.email[0].toUpperCase()}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-medium text-gray-700">
            {user?.name || user?.email.split('@')[0]}
          </p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 animate-fade-in">
          <Link
            to="/profile"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            <User className="w-4 h-4 mr-3 text-gray-400" />
            Profile
          </Link>
          <Link
            to="/settings"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="w-4 h-4 mr-3 text-gray-400" />
            Settings
          </Link>
          <Link
            to="/help"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            <HelpCircle className="w-4 h-4 mr-3 text-gray-400" />
            Help & Support
          </Link>
          <hr className="my-1" />
          <button
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}