import React from 'react';
import { Bell } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

export const NotificationEmptyState = () => {
  return (
    <EmptyState
      icon={Bell}
      title="No Notifications"
      description="You're all caught up! There are no notices at this time."
    />
  );
};
