export const mockInvitations = [
  {
    _id: 'inv-1',
    name: 'Liam Anderson',
    email: 'liam.a@company.com',
    designation: 'Full Stack Engineer',
    status: 'pending',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 86400000).toISOString()
  },
  {
    _id: 'inv-2',
    name: 'Emma Roberts',
    email: 'emma.r@company.com',
    designation: 'Product Designer',
    status: 'accepted',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    expiresAt: new Date(Date.now() + 4 * 86400000).toISOString()
  }
];
