'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react';
import { Sparkles } from '@/components/icons';

export function RateLimitModal() {
  var openState = useState(false); var isOpen = openState[0]; var setOpen = openState[1];
  var dataState = useState<any>({}); var data = dataState[0]; var setData = dataState[1];

  useEffect(function() {
    var handler = function(e: any) { setData(e.detail || {}); setOpen(true); };
    window.addEventListener("rate-limit-hit", handler);
    return function() { window.removeEventListener("rate-limit-hit", handler); };
  }, []);

  if (!isOpen) return null;

  var rl = data.rate_limit || {};
  var current = rl.current || 15; var limit = rl.limit || 15;

  return React.createElement("div", { className:"fixed inset-0 z-[100] flex items-center justify-center p-6", style:{background:"rgba(0,0,0,0.6)",backdropFilter:"blur(8px)"}, onClick:function(){setOpen(false)} },
    React.createElement("div", { onClick:function(e: any){e.stopPropagation()}, className:"max-w-md w-full rounded-2xl p-8 fadeIn", style:{background:"var(--bg-page)",border:"1px solid var(--border-15)"} },
      React.createElement("div", { className:"w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center", style:{background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.25)"} },
        React.createElement(Sparkles, { size:24, className:"text-amber-400/80" })),
      React.createElement("h2", { className:"text-xl font-medium text-white text-center mb-2" }, "Tageslimit erreicht"),
      React.createElement("p", { className:"text-sm text-white/50 text-center mb-5" }, "Du hast heute alle ", React.createElement("strong",{className:"text-white/80"}, limit + " KI-Generierungen"), " verbraucht. Das Limit setzt sich um Mitternacht zur\xfcck."),
      React.createElement("div", { className:"rounded-xl p-4 mb-6", style:{background:"var(--surface-5)",border:"1px solid var(--border-8)"} },
        React.createElement("div", { className:"flex items-center justify-between mb-2" },
          React.createElement("span", { className:"text-xs text-white/40 uppercase tracking-wider" }, "Heute genutzt"),
          React.createElement("span", { className:"text-sm font-medium text-white" }, current + " / " + limit)),
        React.createElement("div", { className:"w-full h-2 rounded-full", style:{background:"var(--surface-8)"} },
          React.createElement("div", { className:"h-2 rounded-full", style:{width:Math.min(100,(current/limit)*100)+"%",background:"linear-gradient(90deg,#f59e0b,#ef4444)"} }))),
      React.createElement("button", { onClick:function(){setOpen(false)}, className:"w-full py-3 rounded-xl text-sm font-medium text-white transition-all", style:{background:"var(--surface-15)",border:"1px solid var(--border-15)"} }, "Verstanden")));
}
