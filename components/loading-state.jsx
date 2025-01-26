"use client";
import { CSpinner } from '@coreui/react';

export default function LoadingState() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <CSpinner color="primary" size="lg" />
    </div>
  );
}