import { useState, useEffect, useCallback } from 'react';
import { employeeProfileService } from '../services/employeeProfileService';

export const useEmployeeProfile = () => {
  const [profile, setProfile] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileData, statusData] = await Promise.all([
        employeeProfileService.getMyProfile(),
        employeeProfileService.getMyApprovalStatus().catch(() => null)
      ]);
      setProfile(profileData);
      setApprovalStatus(statusData);
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    approvalStatus,
    loading,
    error,
    refetch: fetchProfile
  };
};
