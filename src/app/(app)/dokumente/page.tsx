'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { DokumentePage } from '@/components/DokumentePage';
import { useUserData } from '@/lib/useUserData';

export default function DokumentePageRoute() {
  const router = useRouter();
  const { userData } = useUserData();
  return React.createElement(DokumentePage, {
    userData: userData,
    onNavigate: function(page: string) { router.push('/' + page); }
  });
}
