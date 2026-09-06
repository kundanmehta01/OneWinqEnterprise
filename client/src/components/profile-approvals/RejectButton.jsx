import React from 'react';
import { Button } from '../common/Button';
import { X } from 'lucide-react';

export const RejectButton = ({ onClick, loading = false }) => {
  return (
    <Button variant="danger" size="sm" icon={X} onClick={onClick} isLoading={loading}>
      Reject Changes
    </Button>
  );
};
