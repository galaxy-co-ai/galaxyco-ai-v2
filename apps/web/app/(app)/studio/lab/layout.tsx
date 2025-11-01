'use client';

import { ReactFlowProvider } from '@xyflow/react';

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return <ReactFlowProvider>{children}</ReactFlowProvider>;
}
