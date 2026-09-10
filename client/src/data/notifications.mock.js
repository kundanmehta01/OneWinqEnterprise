export const mockNotifications = [
  {
    _id: 'notif-1',
    title: 'New Profile Submitted',
    body: 'Sarah Jenkins submitted their profile draft for review.',
    type: 'info',
    isRead: false,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'notif-2',
    title: 'Profile Approved',
    body: 'Michael Chang profile was approved by Admin.',
    type: 'success',
    isRead: true,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];
