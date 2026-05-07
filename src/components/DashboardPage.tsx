'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { CockpitPage } from '@/components/CockpitPage';

export function DashboardPage({ userData, onNavigate }: { userData?: any; onNavigate?: (page: string) => void }) {
  return React.createElement(CockpitPage, { onNavigate: onNavigate || function() {} });
}
