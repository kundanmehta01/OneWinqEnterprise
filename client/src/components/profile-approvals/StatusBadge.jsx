import React from 'react';
import { Badge } from '../common/Badge';

const labels = { pending: 'Pending', approved: 'Approved', rejected: 'Rejected', changes_requested: 'Changes Requested' };
const variants = { pending: 'blue', approved: 'green', rejected: 'red', changes_requested: 'amber' };

export const StatusBadge = ({ status = 'pending' }) => (
  <Badge variant={variants[status] || 'blue'} dot>{labels[status] || status}</Badge>
);
