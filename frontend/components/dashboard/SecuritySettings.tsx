'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ShieldCheckIcon,
  KeyIcon,
  DevicePhoneMobileIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function SecuritySettings() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { changePassword } = useAuth();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setShowPasswordForm(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Password change failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const securityItems = [
    {
      icon: KeyIcon,
      title: 'Password',
      description: 'Change your account password',
      status: 'Strong',
      statusColor: 'text-green-600',
      action: () => setShowPasswordForm(true),
      actionText: 'Change Password',
    },
    {
      icon: DevicePhoneMobileIcon,
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      status: 'Not Enabled',
      statusColor: 'text-orange-600',
      action: () => console.log('Setup 2FA'),
      actionText: 'Enable 2FA',
    },
    {
      icon: ClockIcon,
      title: 'Active Sessions',
      description: 'Manage your active login sessions',
      status: '3 active sessions',
      statusColor: 'text-blue-600',
      action: () => console.log('Manage sessions'),
      actionText: 'Manage Sessions',
    },
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
          <p className="text-sm text-gray-600 mt-1">
            Keep your account secure with these settings
          </p>
        </div>
        <ShieldCheckIcon className="h-6 w-6 text-green-600" />
      </div>

      <div className="space-y-4">
        {securityItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <item.icon className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                <p className="text-xs text-gray-600">{item.description}</p>
                <p className={`text-xs font-medium mt-1 ${item.statusColor}`}>
                  {item.status}
                </p>
              </div>
            </div>
            <button
              onClick={item.action}
              className="btn-outline text-sm px-3 py-1"
            >
              {item.actionText}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Password Change Form */}
      {showPasswordForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">Change Password</h3>
            <button
              onClick={() => setShowPasswordForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input-field text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-field text-sm"
                minLength={6}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field text-sm"
                minLength={6}
                required
              />
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary text-sm px-4 py-2"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
              <button
                type="button"
                onClick={() => setShowPasswordForm(false)}
                className="btn-outline text-sm px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Security Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
      >
        <div className="flex items-start space-x-2">
          <ExclamationTriangleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Security Tips</h4>
            <ul className="mt-2 text-xs text-blue-800 space-y-1">
              <li>• Use a strong, unique password for your account</li>
              <li>• Enable two-factor authentication for extra security</li>
              <li>• Regularly review your active sessions</li>
              <li>• Never share your login credentials with others</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
