'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { GeschaeftsideePage } from '@/components/GeschaeftsideePage';

export default function GeschaeftsideePageRoute() {
  const router = useRouter();
  return React.createElement(GeschaeftsideePage, {
    onNavigate: function(page: string) { router.push('/' + page); }
  });
}
