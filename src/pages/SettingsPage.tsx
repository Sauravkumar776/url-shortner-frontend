import React, { useState } from 'react';
import { Save, Bell, Globe, Lock, CreditCard, Palette, User, Monitor, Type, MousePointer, Square } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function SettingsPage() {
  const { settings, updateSettings } = useTheme();
  const [activeTab, setActiveTab] = useState('appearance');

  const colorSchemes = [
    { name: 'Indigo', value: 'indigo' },
    { name: 'Purple', value: 'purple' },
    { name: 'Blue', value: 'blue' },
    { name: 'Green', value: 'green' },
    { name: 'Rose', value: 'rose' },
  ];

  const tabs = [
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'domains', name: 'Domains', icon: Globe },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="flex space-x-8">
        <nav className="w-48 flex-shrink-0">
          <ul className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                      activeTab === tab.id
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {tab.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex-1">
          {activeTab === 'appearance' && (
            <div className="bg-white shadow rounded-lg p-6 space-y-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6">Theme Preferences</h3>
                
                <div className="space-y-6">
                  {/* Theme Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center">
                        <Monitor className="h-5 w-5 mr-2" />
                        Theme Mode
                      </div>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['light', 'dark', 'system'].map((theme) => (
                        <button
                          key={theme}
                          onClick={() => updateSettings({ theme: theme as 'light' | 'dark' | 'system' })}
                          className={`flex items-center justify-center px-4 py-2 border rounded-md ${
                            settings.theme === theme
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <span className="capitalize">{theme}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Scheme */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center">
                        <Palette className="h-5 w-5 mr-2" />
                        Color Scheme
                      </div>
                    </label>
                    <div className="grid grid-cols-5 gap-3">
                      {colorSchemes.map((scheme) => (
                        <button
                          key={scheme.value}
                          onClick={() => updateSettings({ colorScheme: scheme.value as any })}
                          className={`flex items-center justify-center px-4 py-2 border rounded-md ${
                            settings.colorScheme === scheme.value
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {scheme.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center">
                        <Type className="h-5 w-5 mr-2" />
                        Font Size
                      </div>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['sm', 'base', 'lg'].map((size) => (
                        <button
                          key={size}
                          onClick={() => updateSettings({ fontSize: size as any })}
                          className={`flex items-center justify-center px-4 py-2 border rounded-md ${
                            settings.fontSize === size
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {size === 'sm' ? 'Small' : size === 'base' ? 'Medium' : 'Large'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Motion */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center">
                        <MousePointer className="h-5 w-5 mr-2" />
                        Motion
                      </div>
                    </label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.reducedMotion}
                        onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700">
                        Reduce motion
                      </label>
                    </div>
                  </div>

                  {/* Corner Radius */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center">
                        <Square className="h-5 w-5 mr-2" />
                        Corner Style
                      </div>
                    </label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.roundedCorners}
                        onChange={(e) => updateSettings({ roundedCorners: e.target.checked })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700">
                        Use rounded corners
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive email updates about your URLs</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.notifications}
                      onChange={(e) => updateSettings({ notifications: e.target.checked })}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Digest Frequency</label>
                  <select
                    value={settings.emailDigest}
                    onChange={(e) => updateSettings({ emailDigest: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="never">Never</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.twoFactorEnabled}
                      onChange={(e) => updateSettings({ twoFactorEnabled: e.target.checked })}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Billing Settings</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    You are currently on the <span className="font-medium">Free Plan</span>
                  </p>
                  <button className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Upgrade Plan
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'domains' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Domain Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Custom Domain</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      value={settings.customDomain}
                      onChange={(e) => updateSettings({ customDomain: e.target.value })}
                      placeholder="your-domain.com"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Enter your custom domain to use instead of the default short URL domain.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}