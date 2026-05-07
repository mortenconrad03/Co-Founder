/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ContainerFrame, PrimaryButton } from '@/components/ui'
import { Logo } from '@/components/ui'
import { Mail, Lock, Eye, EyeOff, ChevronLeft } from '@/components/icons'

export const AuthPage = ({ onSuccess, onBack }: { onSuccess: () => void; onBack: () => void }) => {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async function() {
    if (mode === "signup" && password !== passwordConfirm) {
      setError("Passwörter stimmen nicht überein.");
      return;
    }
    setLoading(true); setError(""); setMessage("");
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onSuccess();
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("Bestätigungsmail gesendet! Bitte prüfe dein Postfach.");
      }
    } catch (e: any) {
      var msg = e.message;
      if (msg === "Invalid login credentials") msg = "Falsche E-Mail oder Passwort.";
      else if (msg.includes("already registered")) msg = "Diese E-Mail ist bereits registriert.";
      setError(msg);
    }
    setLoading(false);
  };

  var inputStyle = {background:"var(--bg-input)",border:"1px solid var(--border-10)"};
  var focusIn = function(e: any){e.target.style.borderColor="var(--border-25)"};
  var focusOut = function(e: any){e.target.style.borderColor="var(--border-10)"};
  var canSubmit = email && password.length >= 6 && (mode === "login" || passwordConfirm.length >= 6);

  return React.createElement("div", { className:"min-h-screen flex items-center justify-center p-6" },
    React.createElement(ContainerFrame, { className:"max-w-md w-full" },
      React.createElement("div", { className:"p-8" },
        onBack && React.createElement("button", { onClick:onBack, className:"flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors mb-6" }, React.createElement(ChevronLeft,{size:14}), "Zurück"),
        React.createElement("div", { className:"text-center mb-8" },
          React.createElement(Logo, { size:"sm" }),
          React.createElement("h2", { className:"text-2xl font-medium text-white mt-4 mb-2" }, mode === "login" ? "Willkommen zurück" : "Account erstellen"),
          React.createElement("p", { className:"text-white/40 text-sm" }, mode === "login" ? "Melde dich an, um fortzufahren" : "Erstelle deinen kostenlosen Account")),
        error && React.createElement("div", { className:"mb-4 p-3 rounded-lg text-sm text-red-300/80 border border-red-400/20", style:{background:"rgba(239,68,68,0.06)"} }, error),
        message && React.createElement("div", { className:"mb-4 p-3 rounded-lg text-sm text-white/50 border border-white/[0.08]", style:{background:"var(--surface-3)"} }, message),
        React.createElement("div", { className:"space-y-4" },
          React.createElement("div", null,
            React.createElement("label", { className:"text-xs text-white/40 tracking-wider mb-2 block" }, "E-Mail"),
            React.createElement("div", { className:"relative" },
              React.createElement(Mail, { size:14, className:"absolute left-3 top-1/2 -translate-y-1/2 text-white/20" }),
              React.createElement("input", { type:"email", value:email, onChange:function(e: any){setEmail(e.target.value)}, placeholder:"dein@email.de", className:"w-full rounded-lg p-3 pl-10 text-sm text-white placeholder-white/20 outline-none transition-all duration-200", style:inputStyle, onFocus:focusIn, onBlur:focusOut }))),
          React.createElement("div", null,
            React.createElement("label", { className:"text-xs text-white/40 tracking-wider mb-2 block" }, "Passwort"),
            React.createElement("div", { className:"relative" },
              React.createElement(Lock, { size:14, className:"absolute left-3 top-1/2 -translate-y-1/2 text-white/20" }),
              React.createElement("input", { type:showPassword?"text":"password", value:password, onChange:function(e: any){setPassword(e.target.value)}, placeholder:"Mindestens 6 Zeichen", className:"w-full rounded-lg p-3 pl-10 pr-10 text-sm text-white placeholder-white/20 outline-none transition-all duration-200", style:inputStyle, onFocus:focusIn, onBlur:focusOut, onKeyDown:function(e: any){if(e.key==="Enter"&&mode==="login")handleSubmit()} }),
              React.createElement("button", { type:"button", onClick:function(){setShowPassword(!showPassword)}, className:"absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors" }, React.createElement(showPassword?EyeOff:Eye, {size:14})))),
          mode === "signup" && React.createElement("div", null,
            React.createElement("label", { className:"text-xs text-white/40 tracking-wider mb-2 block" }, "Passwort wiederholen"),
            React.createElement("div", { className:"relative" },
              React.createElement(Lock, { size:14, className:"absolute left-3 top-1/2 -translate-y-1/2 text-white/20" }),
              React.createElement("input", { type:showPassword?"text":"password", value:passwordConfirm, onChange:function(e: any){setPasswordConfirm(e.target.value)}, placeholder:"Passwort bestätigen", className:"w-full rounded-lg p-3 pl-10 text-sm text-white placeholder-white/20 outline-none transition-all duration-200", style:inputStyle, onFocus:focusIn, onBlur:focusOut, onKeyDown:function(e: any){if(e.key==="Enter")handleSubmit()} }))),
          React.createElement(PrimaryButton, { onClick:handleSubmit, disabled:!canSubmit, loading:loading, className:"w-full justify-center" }, mode === "login" ? "Anmelden" : "Registrieren"),
          React.createElement("div", { className:"text-center" },
            React.createElement("button", { onClick:function(){setMode(mode==="login"?"signup":"login");setError("");setMessage("");setPasswordConfirm("")}, className:"text-sm text-white/30 hover:text-white/50 transition-colors" }, mode === "login" ? "Noch kein Account? Registrieren" : "Bereits registriert? Anmelden"))))));
};
