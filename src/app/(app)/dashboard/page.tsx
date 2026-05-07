'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CockpitPage } from '@/components/CockpitPage';

export default function DashboardPage() {
  const router = useRouter();
  return React.createElement(CockpitPage, {
    onNavigate: function(page: string) { router.push('/' + page); }
  });
}
