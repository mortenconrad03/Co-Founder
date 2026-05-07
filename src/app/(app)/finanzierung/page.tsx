'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FoerderPage } from '@/components/FoerderPage';
import { useUserData } from '@/lib/useUserData';

export default function FinanzierungPageRoute() {
  const router = useRouter();
  const { userData } = useUserData();
  return React.createElement(FoerderPage, {
    userData: userData,
    onNavigate: function(page: string) { router.push('/' + page); }
  });
}
