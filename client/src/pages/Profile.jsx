import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import Input from '../components/shared/Input';
import Button from '../components/shared/Button';
import api from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    await updateProfile(profileData);
    setProfileLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);
    try {
      await api.put('/api/auth/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Profile Settings</h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">
          Manage your personal information and security settings
        </p>
      </div>

      {/* Account Info */}
      <div className="glass-card p-6 md:p-8 space-y-6">
        <h2 className="text-lg font-semibold text-surface-900 dark:text-white pb-3 border-b border-surface-200 dark:border-surface-700">
          Personal Information
        </h2>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <Input
            label="Full Name"
            icon={HiOutlineUser}
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
          />
          <Input
            label="Email Address"
            type="email"
            icon={HiOutlineMail}
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
          />
          <div className="flex justify-end pt-2">
            <Button type="submit" loading={profileLoading}>
              Save Profile
            </Button>
          </div>
        </form>
      </div>

      {/* Password Reset */}
      <div className="glass-card p-6 md:p-8 space-y-6">
        <h2 className="text-lg font-semibold text-surface-900 dark:text-white pb-3 border-b border-surface-200 dark:border-surface-700">
          Change Password
        </h2>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            icon={HiOutlineLockClosed}
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
          />
          <Input
            label="New Password"
            type="password"
            icon={HiOutlineLockClosed}
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
          />
          <Input
            label="Confirm New Password"
            type="password"
            icon={HiOutlineLockClosed}
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
          />
          <div className="flex justify-end pt-2">
            <Button type="submit" loading={passwordLoading} variant="secondary">
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
