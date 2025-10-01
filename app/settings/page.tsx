/**
 * Settings Page
 * 
 * Essential application settings including:
 * - Personal profile settings
 * - Password management
 * - Notification preferences
 * - Sync settings
 * - Security options
 * - About information
 * 
 * @module app/settings/page
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Lock,
  Bell,
  RefreshCw,
  Shield,
  Info,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/lib/stores';
import { useSyncStore } from '@/lib/stores';
import { useNotifications } from '@/lib/stores/notificationStore';
import { formatDate, cn } from '@/lib/utils';

type SettingsTab = 'profile' | 'password' | 'notifications' | 'sync' | 'security' | 'about';

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const { isOnline, lastSyncTime, pendingItems } = useSyncStore();
  const notifications = useNotifications();

  // State
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isSaving, setIsSaving] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    avatar: user?.avatar || '',
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Notification preferences state
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailNotifications: true,
    pushNotifications: true,
    orderNotifications: true,
    lowStockAlerts: true,
    customerUpdates: false,
    weeklyReports: true,
  });

  // Sync settings state
  const [syncSettings, setSyncSettings] = useState({
    autoSync: true,
    syncInterval: 5, // minutes
    offlineMode: true,
    downloadProducts: true,
    downloadCustomers: true,
  });

  // Update profile form when user changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name,
        email: user.email,
        phone: '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  // Handle profile update
  const handleProfileUpdate = async () => {
    setIsSaving(true);
    try {
      await updateUser({
        name: profileForm.name,
        email: profileForm.email,
        avatar: profileForm.avatar,
      });
      notifications.success('Success', 'Profile updated successfully');
    } catch (error) {
      notifications.error('Error', 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle password change
  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      notifications.error('Error', 'New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      notifications.error('Error', 'Password must be at least 8 characters');
      return;
    }

    // TODO: Implement actual password change
    notifications.success('Success', 'Password changed successfully');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  // Handle notification preferences update
  const handleNotificationUpdate = () => {
    // TODO: Save to backend
    notifications.success('Success', 'Notification preferences updated');
  };

  // Handle sync settings update
  const handleSyncUpdate = () => {
    // TODO: Save to backend
    notifications.success('Success', 'Sync settings updated');
  };

  // Tab navigation items
  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'sync', label: 'Sync & Offline', icon: RefreshCw },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <Card.Body className="p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as SettingsTab)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </Card.Body>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Update your personal information
                </p>
              </Card.Header>
              <Card.Body className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {profileForm.avatar || profileForm.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <Button variant="secondary" size="sm">
                      Change Avatar
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      JPG, PNG or GIF. Max size 2MB
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    fullWidth
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    fullWidth
                  />
                </div>

                <Input
                  label="Phone Number"
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  placeholder="+230 5123 4567"
                  fullWidth
                />

                {/* Role Badge */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <Badge variant={user?.role === 'admin' ? 'primary' : 'secondary'} size="md">
                    {user?.role === 'admin' ? 'Administrator' : 'Salesperson'}
                  </Badge>
                </div>
              </Card.Body>
              <Card.Footer>
                <div className="flex justify-end gap-3">
                  <Button variant="secondary">
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleProfileUpdate}
                    isLoading={isSaving}
                    leftIcon={<Save className="w-4 h-4" />}
                  >
                    Save Changes
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          )}

          {/* Password Settings */}
          {activeTab === 'password' && (
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Update your password to keep your account secure
                </p>
              </Card.Header>
              <Card.Body className="space-y-4">
                {/* Current Password */}
                <div className="relative">
                  <Input
                    label="Current Password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    }
                    fullWidth
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* New Password */}
                <div className="relative">
                  <Input
                    label="New Password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    helperText="Must be at least 8 characters"
                    fullWidth
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <Input
                    label="Confirm New Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    fullWidth
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Password Requirements */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Password Requirements:
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success-500" />
                      At least 8 characters
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success-500" />
                      Mix of uppercase and lowercase letters
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success-500" />
                      At least one number
                    </li>
                  </ul>
                </div>
              </Card.Body>
              <Card.Footer>
                <div className="flex justify-end gap-3">
                  <Button variant="secondary">
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handlePasswordChange}
                    leftIcon={<Lock className="w-4 h-4" />}
                  >
                    Change Password
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Choose what notifications you want to receive
                </p>
              </Card.Header>
              <Card.Body className="space-y-6">
                {/* General Notifications */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">General</h4>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                        <p className="text-xs text-gray-500">
                          Receive notifications via email
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationPrefs.emailNotifications}
                        onChange={(e) =>
                          setNotificationPrefs({
                            ...notificationPrefs,
                            emailNotifications: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                        <p className="text-xs text-gray-500">
                          Receive push notifications in browser
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationPrefs.pushNotifications}
                        onChange={(e) =>
                          setNotificationPrefs({
                            ...notificationPrefs,
                            pushNotifications: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </label>
                  </div>
                </div>

                {/* Activity Notifications */}
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Activity</h4>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">New Orders</p>
                        <p className="text-xs text-gray-500">
                          Get notified when new orders are placed
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationPrefs.orderNotifications}
                        onChange={(e) =>
                          setNotificationPrefs({
                            ...notificationPrefs,
                            orderNotifications: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Low Stock Alerts</p>
                        <p className="text-xs text-gray-500">
                          Get notified when products are running low
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationPrefs.lowStockAlerts}
                        onChange={(e) =>
                          setNotificationPrefs({
                            ...notificationPrefs,
                            lowStockAlerts: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Customer Updates</p>
                        <p className="text-xs text-gray-500">
                          Get notified about customer activity
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationPrefs.customerUpdates}
                        onChange={(e) =>
                          setNotificationPrefs({
                            ...notificationPrefs,
                            customerUpdates: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </label>
                  </div>
                </div>

                {/* Reports */}
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Reports</h4>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Weekly Reports</p>
                        <p className="text-xs text-gray-500">
                          Receive weekly performance summary via email
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationPrefs.weeklyReports}
                        onChange={(e) =>
                          setNotificationPrefs({
                            ...notificationPrefs,
                            weeklyReports: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </label>
                  </div>
                </div>
              </Card.Body>
              <Card.Footer>
                <div className="flex justify-end gap-3">
                  <Button variant="secondary">
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleNotificationUpdate}
                    leftIcon={<Save className="w-4 h-4" />}
                  >
                    Save Preferences
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          )}

          {/* Sync & Offline Settings */}
          {activeTab === 'sync' && (
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold text-gray-900">Sync & Offline Settings</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Manage data synchronization and offline capabilities
                </p>
              </Card.Header>
              <Card.Body className="space-y-6">
                {/* Sync Status */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-gray-900">Sync Status</h4>
                    <Badge variant={isOnline ? 'success' : 'danger'}>
                      {isOnline ? (
                        <>
                          <Wifi className="w-3 h-3" />
                          Online
                        </>
                      ) : (
                        <>
                          <WifiOff className="w-3 h-3" />
                          Offline
                        </>
                      )}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Sync:</span>
                      <span className="font-medium text-gray-900">
                        {lastSyncTime ? formatDate(lastSyncTime.toString(), 'relative') : 'Never'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pending Items:</span>
                      <Badge variant={pendingItems > 0 ? 'warning' : 'success'}>
                        {pendingItems}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Auto Sync */}
                <div>
                  <label className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Auto Sync</p>
                      <p className="text-xs text-gray-500">
                        Automatically sync data when connection is available
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={syncSettings.autoSync}
                      onChange={(e) =>
                        setSyncSettings({ ...syncSettings, autoSync: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </label>

                  {syncSettings.autoSync && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sync Interval
                      </label>
                      <select
                        value={syncSettings.syncInterval}
                        onChange={(e) =>
                          setSyncSettings({
                            ...syncSettings,
                            syncInterval: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value={1}>Every 1 minute</option>
                        <option value={5}>Every 5 minutes</option>
                        <option value={15}>Every 15 minutes</option>
                        <option value={30}>Every 30 minutes</option>
                        <option value={60}>Every hour</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Offline Mode */}
                <div className="pt-6 border-t border-gray-200">
                  <label className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Offline Mode</p>
                      <p className="text-xs text-gray-500">
                        Enable offline access to cached data
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={syncSettings.offlineMode}
                      onChange={(e) =>
                        setSyncSettings({ ...syncSettings, offlineMode: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </label>
                </div>

                {/* Data Download Preferences */}
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">
                    Data Download for Offline
                  </h4>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Download Products</p>
                        <p className="text-xs text-gray-500">
                          Cache product catalog for offline access
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={syncSettings.downloadProducts}
                        onChange={(e) =>
                          setSyncSettings({
                            ...syncSettings,
                            downloadProducts: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Download Customers</p>
                        <p className="text-xs text-gray-500">
                          Cache customer data for offline access
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={syncSettings.downloadCustomers}
                        onChange={(e) =>
                          setSyncSettings({
                            ...syncSettings,
                            downloadCustomers: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </label>
                  </div>
                </div>

                {/* Clear Cache */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Clear Offline Cache</p>
                      <p className="text-xs text-gray-500">
                        Remove all cached data to free up storage
                      </p>
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() =>
                        notifications.info('Cache Cleared', 'Offline cache has been cleared')
                      }
                    >
                      Clear Cache
                    </Button>
                  </div>
                </div>
              </Card.Body>
              <Card.Footer>
                <div className="flex justify-end gap-3">
                  <Button variant="secondary">
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSyncUpdate}
                    leftIcon={<Save className="w-4 h-4" />}
                  >
                    Save Settings
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Manage your account security and access
                </p>
              </Card.Header>
              <Card.Body className="space-y-6">
                {/* Login Activity */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</h4>
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Current Session</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Last login: {user?.lastLogin ? formatDate(user.lastLogin.toString()) : 'N/A'}
                          </p>
                        </div>
                        <Badge variant="success">Active</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Two-Factor Authentication
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="secondary" size="sm">
                      Enable 2FA
                    </Button>
                  </div>
                </div>

                {/* Session Management */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Active Sessions</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Manage devices where you're currently logged in
                      </p>
                    </div>
                    <Button variant="secondary" size="sm">
                      View Sessions
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* About */}
          {activeTab === 'about' && (
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold text-gray-900">About</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Application information and resources
                </p>
              </Card.Header>
              <Card.Body className="space-y-6">
                {/* App Info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center">
                    <span className="text-3xl">🥩</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Mauritius Meat Market
                    </h3>
                    <p className="text-sm text-gray-600">Salesman Portal</p>
                  </div>
                </div>

                {/* Version Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Version</p>
                    <p className="text-sm font-medium text-gray-900">1.0.0</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Build</p>
                    <p className="text-sm font-medium text-gray-900">2025.01.01</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Odoo Version</p>
                    <p className="text-sm font-medium text-gray-900">18.0</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Environment</p>
                    <Badge variant="success">Production</Badge>
                  </div>
                </div>

                {/* Links */}
                <div className="pt-6 border-t border-gray-200 space-y-3">
                  <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <span className="text-sm font-medium text-gray-900">
                      Terms of Service
                    </span>
                    <span className="text-gray-400">→</span>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <span className="text-sm font-medium text-gray-900">Privacy Policy</span>
                    <span className="text-gray-400">→</span>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <span className="text-sm font-medium text-gray-900">
                      Help & Documentation
                    </span>
                    <span className="text-gray-400">→</span>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <span className="text-sm font-medium text-gray-900">Contact Support</span>
                    <span className="text-gray-400">→</span>
                  </button>
                </div>

                {/* Credits */}
                <div className="pt-6 border-t border-gray-200 text-center">
                  <p className="text-xs text-gray-500">
                    © 2025 Mauritius Meat Market. All rights reserved.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Built with ❤️ for Odoo 18 Integration
                  </p>
                </div>
              </Card.Body>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
