'use client';

import { useState } from 'react';
import { User } from 'firebase/auth';
import { useAuth } from '@/contexts/AuthContext';
import { UserAvatar } from '@/components/Avatar';
import { PencilIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface UserProfileProps {
  user: User;
}

export default function UserProfile({ user }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [loading, setLoading] = useState(false);
  const { updateUserProfile } = useAuth();

  const handleSave = async () => {
    if (!displayName.trim()) return;

    setLoading(true);
    try {
      await updateUserProfile(displayName);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(user.displayName || '');
    setIsEditing(false);
  };

  return (
    <div className="card">
      <div className="text-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="mx-auto mb-4"
        >
          <UserAvatar
            email={user.email || ''}
            displayName={user.displayName}
            size={80}
          />
        </motion.div>

        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="input-field text-center"
              placeholder="Enter your name"
            />
            <div className="flex space-x-2 justify-center">
              <button
                onClick={handleSave}
                disabled={loading || !displayName.trim()}
                className="btn-primary text-sm px-3 py-1"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                className="btn-outline text-sm px-3 py-1"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <h2 className="text-xl font-semibold text-gray-900">
                {user.displayName || 'Anonymous User'}
              </h2>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
            </div>
            <p className="text-gray-600 text-sm">{user.email}</p>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Account Status</span>
          <span className="flex items-center text-green-600">
            <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
            Active
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Email Verified</span>
          <span className={`flex items-center ${user.emailVerified ? 'text-green-600' : 'text-orange-600'}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${user.emailVerified ? 'bg-green-600' : 'bg-orange-600'}`}></div>
            {user.emailVerified ? 'Verified' : 'Pending'}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Member Since</span>
          <span className="text-gray-900">
            {user.metadata.creationTime 
              ? new Date(user.metadata.creationTime).toLocaleDateString()
              : 'Unknown'
            }
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Last Sign In</span>
          <span className="text-gray-900">
            {user.metadata.lastSignInTime 
              ? new Date(user.metadata.lastSignInTime).toLocaleDateString()
              : 'Unknown'
            }
          </span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Account Actions</h3>
        <div className="space-y-2">
          <button className="w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1">
            Download Account Data
          </button>
          <button className="w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1">
            Privacy Settings
          </button>
          <button className="w-full text-left text-sm text-red-600 hover:text-red-700 py-1">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
