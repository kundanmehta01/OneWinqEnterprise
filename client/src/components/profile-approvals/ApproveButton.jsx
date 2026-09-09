import React from 'react';
import { Button } from '../common/Button';
import { Check } from 'lucide-react';

export const ApproveButton = ({ onClick, loading = false }) => {
  return (
    <Button variant="primary" size="sm" icon={Check} onClick={onClick} isLoading={loading}>
      Approve &amp; Publish
    </Button>
  );
};
