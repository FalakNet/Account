'use client';

import { useState, useEffect } from 'react';
import { 
  CubeIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

// Mock data for connected apps - in real app, this would come from your backend
const mockApps = [
  {
    id: '1',
    name: 'Falak Analytics',
    description: 'Web analytics and insights platform',
    icon: CubeIcon,
    status: 'active',
    lastAccessed: '2 hours ago',
    permissions: ['Read profile', 'Access analytics'],
  },
  {
    id: '2',
    name: 'Falak Mobile',
    description: 'Mobile companion app',
    icon: DevicePhoneMobileIcon,
    status: 'active',
    lastAccessed: '1 day ago',
    permissions: ['Read profile', 'Push notifications'],
  },
  {
    id: '3',
    name: 'Falak Dashboard',
    description: 'Business intelligence dashboard',
    icon: ComputerDesktopIcon,
    status: 'inactive',
    lastAccessed: '1 week ago',
    permissions: ['Read profile', 'Access data'],
  },
];

export default function ConnectedApps() {
  const [apps, setApps] = useState(mockApps);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  const handleDisconnectApp = (appId: string) => {
    setApps(apps.filter(app => app.id !== appId));
    setSelectedApp(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'inactive':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Connected Apps</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage applications that have access to your account
          </p>
        </div>
        <button className="btn-outline text-sm">
          <GlobeAltIcon className="h-4 w-4 mr-2" />
          Browse Apps
        </button>
      </div>

      <div className="space-y-4">
        {apps.map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <app.icon className="h-6 w-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-medium text-gray-900">{app.name}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{app.description}</p>
                  <p className="text-xs text-gray-500 mt-2">Last accessed: {app.lastAccessed}</p>
                </div>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setSelectedApp(selectedApp === app.id ? null : app.id)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <EllipsisVerticalIcon className="h-5 w-5" />
                </button>

                {selectedApp === app.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-0 top-8 z-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-48"
                  >
                    <button 
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setSelectedApp(null)}
                    >
                      View Permissions
                    </button>
                    <button 
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setSelectedApp(null)}
                    >
                      Edit Access
                    </button>
                    <button 
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      onClick={() => handleDisconnectApp(app.id)}
                    >
                      Disconnect
                    </button>
                  </motion.div>
                )}
              </div>
            </div>

            {selectedApp === app.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-100"
              >
                <h4 className="text-xs font-medium text-gray-900 mb-2">Permissions:</h4>
                <ul className="space-y-1">
                  {app.permissions.map((permission, idx) => (
                    <li key={idx} className="text-xs text-gray-600 flex items-center">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                      {permission}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {apps.length === 0 && (
        <div className="text-center py-8">
          <GlobeAltIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No connected apps</h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't connected any apps to your account yet.
          </p>
          <div className="mt-6">
            <button className="btn-primary">
              Browse Available Apps
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
