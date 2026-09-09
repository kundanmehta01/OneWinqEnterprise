export const mockTeamMembers = [
  {
    _id: 'mem-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@onewinq.com',
    designation: 'VP of Engineering',
    departmentId: { _id: 'dept-1', name: 'Engineering' },
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    profileId: { approvalStatus: 'approved', completionPercentage: 95, slug: 'sarah-jenkins' }
  },
  {
    _id: 'mem-2',
    name: 'Michael Chang',
    email: 'michael.c@onewinq.com',
    designation: 'Head of Product',
    departmentId: { _id: 'dept-2', name: 'Product & Design' },
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    profileId: { approvalStatus: 'approved', completionPercentage: 90, slug: 'michael-chang' }
  }
];
