'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { GewerbePage } from '@/components/GewerbePage';
import { useUserData } from '@/lib/useUserData';

export default function RechtlichesPageRoute() {
  const router = useRouter();
  const { userData } = useUserData();
  return React.createElement(GewerbePage, {
    userData: userData,
    onNavigate: function(page: string) { router.push('/' + page); }
  });
}
