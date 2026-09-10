import React from 'react';
import { ApprovalRequestCard } from './ApprovalRequestCard';

export const ApprovalRequestList = ({ approvals, ...props }) => <div>{approvals.map((approval) => <ApprovalRequestCard key={approval._id} approval={approval} {...props} />)}</div>;
