
import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, User, Shield, Palette } from 'lucide-react';
import NotificationSettings from '../components/settings/NotificationSettings';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('notifications');

  const tabs = [
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'security', label: 'Security', icon: Shield },
    { key: 'appearance', label: 'Appearance', icon: Palette }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'notifications':
        return <NotificationSettings />;
      case 'profile':
        return (
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-medium text-neutral-900 mb-4">Profile Settings</h3>
            <p className="text-neutral-600">Profile settings coming soon...</p>
          </div>
        );
      case 'security':
        return (
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-medium text-neutral-900 mb-4">Security Settings</h3>
            <p className="text-neutral-600">Security settings coming soon...</p>
          </div>
        );
      case 'appearance':
        return (
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-medium text-neutral-900 mb-4">Appearance Settings</h3>
            <p className="text-neutral-600">Appearance settings coming soon...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full bg-neutral-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-neutral-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <SettingsIcon className="w-6 h-6 text-neutral-900" />
          <h1 className="text-xl font-bold text-neutral-900">Settings</h1>
        </div>

        <nav className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === tab.key
                    ? 'bg-sage/10 text-sage border border-sage/20'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
