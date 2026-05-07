'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MarktanalysePage } from '@/components/MarktanalysePage';
import { useUserData } from '@/lib/useUserData';

export default function BusinessplanPageRoute() {
  const router = useRouter();
  const { userData } = useUserData();
  return React.createElement(MarktanalysePage, {
    userData: userData,
    onNavigate: function(page: string) { router.push('/' + page); }
  });
}
