'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { db } from '@/lib/db';
import { Loader2, Eye, EyeOff } from '@/components/icons';
import { GlassCard, PrimaryButton } from '@/components/ui';

export function AccountPage() {
  const { user } = useAuth();
  var profileState = useState<any>(null); var profile = profileState[0]; var setProfile = profileState[1];
  var loadState = useState(true); var isLoading = loadState[0]; var setIsLoading = loadState[1];
  var pwState = useState({current:"",next:"",confirm:""}); var pw = pwState[0]; var setPw = pwState[1];
  var pwMsg = useState(""); var pwMessage = pwMsg[0]; var setPwMessage = pwMsg[1];
  var pwLoading = useState(false); var isPwLoading = pwLoading[0]; var setIsPwLoading = pwLoading[1];
  var showPw = useState(false); var showPasswords = showPw[0]; var setShowPasswords = showPw[1];

  useEffect(function() {
    if (!user) return;
    db.getOnboarding(user.id).then(function(p: any) { setProfile(p); setIsLoading(false); });
  }, [user]);

  var handlePasswordChange = async function() {
    if (pw.next.length < 6) { setPwMessage("Mindestens 6 Zeichen."); return; }
    if (pw.next !== pw.confirm) { setPwMessage("Passw\xf6rter stimmen nicht \xfcberein."); return; }
    setIsPwLoading(true); setPwMessage("");
    var { error } = await supabase.auth.updateUser({ password: pw.next });
    if (error) setPwMessage("Fehler: " + error.message);
    else { setPwMessage("Passwort ge\xe4ndert."); setPw({current:"",next:"",confirm:""}); }
    setIsPwLoading(false);
  };

  if (isLoading) return React.createElement("div", { className:"max-w-2xl mx-auto py-20 px-6 text-center" },
    React.createElement(Loader2, { size:20, className:"animate-spin text-white/30 mx-auto" }));

  var inputStyle = {background:"var(--surface-4)",border:"1px solid var(--border-8)"};

  return React.createElement("div", { className:"max-w-2xl mx-auto py-10 px-6" },
    React.createElement("h1", { className:"text-xl text-white mb-8" }, "Account"),

    React.createElement(GlassCard, { className:"p-6 mb-4" },
      React.createElement("h3", { className:"text-xs text-white/30 tracking-wider mb-4" }, "Profil"),
      React.createElement("div", { className:"space-y-3" },
        React.createElement("div", { className:"flex items-center justify-between" },
          React.createElement("span", { className:"text-sm text-white/40" }, "E-Mail"),
          React.createElement("span", { className:"text-sm text-white/70" }, user?.email || "—")),
        profile && profile.vorname && React.createElement("div", { className:"flex items-center justify-between" },
          React.createElement("span", { className:"text-sm text-white/40" }, "Name"),
          React.createElement("span", { className:"text-sm text-white/70" }, (profile.vorname||"")+" "+(profile.nachname||""))),
        profile && profile.phase && React.createElement("div", { className:"flex items-center justify-between" },
          React.createElement("span", { className:"text-sm text-white/40" }, "Phase"),
          React.createElement("span", { className:"text-sm text-white/70" }, profile.phase)),
        profile && profile.bundesland && React.createElement("div", { className:"flex items-center justify-between" },
          React.createElement("span", { className:"text-sm text-white/40" }, "Bundesland"),
          React.createElement("span", { className:"text-sm text-white/70" }, profile.bundesland)),
        profile && profile.branche && React.createElement("div", { className:"flex items-center justify-between" },
          React.createElement("span", { className:"text-sm text-white/40" }, "Branche"),
          React.createElement("span", { className:"text-sm text-white/70" }, profile.branche)))),

    React.createElement(GlassCard, { className:"p-6" },
      React.createElement("div", { className:"flex items-center justify-between mb-4" },
        React.createElement("h3", { className:"text-xs text-white/30 tracking-wider" }, "Passwort \xe4ndern"),
        React.createElement("button", { onClick:function(){setShowPasswords(!showPasswords)}, className:"text-xs text-white/20 hover:text-white/40 flex items-center gap-1 transition-colors" },
          React.createElement(showPasswords ? EyeOff : Eye, {size:12}), showPasswords ? "Verbergen" : "Anzeigen")),
      React.createElement("div", { className:"space-y-3" },
        React.createElement("input", { type:showPasswords?"text":"password", value:pw.next, onChange:function(e: any){setPw(Object.assign({},pw,{next:e.target.value}))}, placeholder:"Neues Passwort", className:"w-full rounded-lg p-3 text-sm text-white placeholder-white/20 outline-none", style:inputStyle }),
        React.createElement("input", { type:showPasswords?"text":"password", value:pw.confirm, onChange:function(e: any){setPw(Object.assign({},pw,{confirm:e.target.value}))}, placeholder:"Passwort wiederholen", className:"w-full rounded-lg p-3 text-sm text-white placeholder-white/20 outline-none", style:inputStyle }),
        pwMessage && React.createElement("p", { className:"text-xs "+(pwMessage.includes("ge\xe4ndert")?"text-white/50":"text-red-300/60") }, pwMessage),
        React.createElement(PrimaryButton, { onClick:handlePasswordChange, disabled:!pw.next||!pw.confirm, loading:isPwLoading, className:"w-full justify-center" }, "Passwort \xe4ndern"))));
}
