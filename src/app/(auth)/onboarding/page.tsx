'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Onboarding } from '@/components/Onboarding';
import { Loader2 } from '@/components/icons';

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(function() {
    if (loading) return;
    if (!user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return React.createElement("div", { style:{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"} },
      React.createElement(Loader2, { size:24, className:"animate-spin text-white/40" }));
  }

  return React.createElement(Onboarding, {
    onComplete: function() { router.push('/dashboard'); },
    onSkip: function() { router.push('/dashboard'); },
    onBack: function() { router.push('/'); }
  });
}
