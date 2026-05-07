'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { AuthPage } from '@/components/AuthPage';
import { Loader2 } from '@/components/icons';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(function() {
    if (loading) return;
    if (user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return React.createElement("div", { style:{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"} },
      React.createElement(Loader2, { size:24, className:"animate-spin text-white/40" }));
  }

  if (user) {
    return React.createElement("div", { style:{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"} },
      React.createElement(Loader2, { size:24, className:"animate-spin text-white/40" }));
  }

  return React.createElement(AuthPage, {
    onSuccess: function() { router.push('/dashboard'); },
    onBack: function() { router.push('/'); }
  });
}
