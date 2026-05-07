'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Sidebar } from '@/components/Sidebar';
import { RateLimitModal } from '@/components/RateLimitModal';
import { GrainOverlay } from '@/components/ui';
import { Loader2 } from '@/components/icons';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(function() {
    if (loading) return;
    if (!user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return React.createElement("div", { style:{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"} },
      React.createElement(Loader2, { size:24, className:"animate-spin text-white/40" }));
  }

  if (!user) {
    return React.createElement("div", { style:{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"} },
      React.createElement(Loader2, { size:24, className:"animate-spin text-white/40" }));
  }

  return React.createElement("div", { style:{minHeight:"100vh",background:"var(--bg-page)",position:"relative",overflow:"hidden"} },
    React.createElement(GrainOverlay),
    React.createElement("div", { style:{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",background:"radial-gradient(ellipse at 60% 40%,var(--ambient-color),transparent 65%)"} }),
    React.createElement("div", { style:{position:"relative",zIndex:1} },
      React.createElement(Sidebar),
      React.createElement("div", { className:"main-content fadeIn" }, children)),
    React.createElement(RateLimitModal));
}
