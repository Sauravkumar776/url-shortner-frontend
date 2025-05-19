import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Link2, 
  History, 
  Settings, 
  BarChart2, 
  Tags,
  Users,
  HelpCircle
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'URLs', href: '/urls', icon: Link2 },
  { name: 'Analytics', href: '/analytics', icon: BarChart2 },
  { name: 'History', href: '/history', icon: History },
  { name: 'Tags', href: '/tags', icon: Tags },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help', href: '/help', icon: HelpCircle },
];

export function Sidebar() {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
        <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200">
          <Link2 className="h-8 w-8 text-indigo-600" />
          <span className="ml-2 text-xl font-semibold text-gray-900">
            URL Shortener
          </span>
        </div>
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}