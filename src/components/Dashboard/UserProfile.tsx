import React from 'react';
import { User, LogOut, Settings, Activity } from 'lucide-react';
import { User as UserType } from '../../types';

interface UserProfileProps {
  user: UserType;
  onLogout: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'doctor': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'radiologist': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'patient': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'doctor': return '👨‍⚕️';
      case 'radiologist': return '🔬';
      case 'patient': return '👤';
      default: return '👤';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
        <button
          onClick={onLogout}
          className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="p-3 bg-gray-100 rounded-full">
          <User className="w-8 h-8 text-gray-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getRoleIcon(user.role)}</span>
            <span className="text-sm font-medium text-gray-700">Account Type</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Member Since</span>
          </div>
          <span className="text-sm text-gray-600">
            {new Date(user.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <button className="flex items-center space-x-2 w-full px-4 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
          <Settings className="w-4 h-4" />
          <span>Account Settings</span>
        </button>
      </div>
    </div>
  );
};