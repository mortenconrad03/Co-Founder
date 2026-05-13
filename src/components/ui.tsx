/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react'
import { supabase, SUPABASE_URL } from '@/lib/supabase'
import { Sparkles, ArrowRight, X, Check, Loader2 } from '@/components/icons'

export const Sparkline = function(props: any) {
  var data = props.data || [];
  if (data.length < 2) return null;
  var w = props.width || 120; var h = props.height || 32;
  var color = props.color || "var(--text-secondary)";
  var min = Math.min.apply(null, data); var max = Math.max.apply(null, data);
  var range = max - min || 1;
  var points = data.map(function(v: number, i: number) {
    return (i / (data.length - 1)) * w + "," + (h - ((v - min) / range) * (h - 4) - 2);
  }).join(" ");
  var lastY = h - ((data[data.length-1] - min) / range) * (h - 4) - 2;
  return React.createElement("svg", { width:w, height:h, viewBox:"0 0 "+w+" "+h, style:{overflow:"visible"} },
    React.createElement("polyline", { points:points, fill:"none", stroke:color, strokeWidth:"1.5", strokeLinecap:"round", strokeLinejoin:"round" }),
    React.createElement("circle", { cx:w, cy:lastY, r:"2.5", fill:color }));
};

const BASE = (process.env.NEXT_PUBLIC_BASE_PATH ?? '');
export const Logo = ({ size = "sm" }: { size?: string }) => {
  var px = size === "lg" ? 48 : size === "md" ? 36 : 28;
  return React.createElement("img", { src: BASE + '/logo.png', alt: "CoFounder AI", width: px, height: px, style: { height: px, width: "auto", objectFit: "contain", filter: "var(--logo-filter)" } });
};

export const GrainOverlay = () => React.createElement("div", { style: { position:"fixed",inset:0,zIndex:0,pointerEvents:"none", backgroundImage:'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.03\'/%3E%3C/svg%3E")', backgroundRepeat:"repeat",opacity:"var(--grain-opacity)" }});

export const GlassCard = ({ children, className="", style={}, onClick }: { children?: any, className?: string, style?: any, onClick?: () => void }) => React.createElement("div", { onClick, className: "rounded-lg border border-white/[0.06] glass-hover " + className + (onClick ? " cursor-pointer" : ""), style: { background:"var(--bg-glass)", ...style } }, children);

export const PrimaryButton = ({ children, onClick, disabled, loading, className="" }: { children?: any, onClick?: () => void, disabled?: boolean, loading?: boolean, className?: string }) => React.createElement("button", { onClick, disabled: disabled||loading, className: "relative px-5 py-2.5 rounded-lg text-sm tracking-wide transition-all duration-200 flex items-center gap-2 " + className, style: { background:"var(--surface-10)", border:"1px solid var(--border-15)", color:"var(--text-primary)", opacity:disabled?0.4:1, fontWeight:500 } }, loading && React.createElement(Loader2, { size:14, className:"animate-spin" }), children);

export const SecondaryButton = ({ children, onClick, className="" }: { children?: any, onClick?: () => void, className?: string }) => React.createElement("button", { onClick, className: "px-5 py-2.5 rounded-lg text-sm tracking-wide border border-white/[0.08] text-white/60 transition-all duration-200 flex items-center gap-2 hover:border-white/[0.15] hover:text-white/80 " + className, style: { background:"transparent", fontWeight:400 } }, children);

export const ContainerFrame = ({ children, className="" }: { children?: any, className?: string }) => React.createElement("div", { className: "rounded-lg border border-white/[0.06] overflow-hidden " + className, style: { background:"var(--bg-container)" } }, children);

export const NextActionBanner = function(props: any) {
  var page = props.page;
  var userData = props.userData;
  var context = props.context || {};
  var onNavigate = props.onNavigate;

  var sugState = useState(null); var sug: any = sugState[0]; var setSug = sugState[1];
  var loadState = useState(true); var loading = loadState[0]; var setLoading = loadState[1];
  var errState = useState(false); var err = errState[0]; var setErr = errState[1];
  var dismissedState = useState(false); var dismissed = dismissedState[0]; var setDismissed = dismissedState[1];

  var SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  var cacheKey = "next_action_" + page + "_" + (userData?.phase || "") + "_" + (userData?.branche || "");

  useEffect(function() {
    if (!userData) { setLoading(false); return; }
    if (sessionStorage.getItem("next_action_dismiss_" + page) === "1") { setDismissed(true); setLoading(false); return; }
    var cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try { setSug(JSON.parse(cached)); setLoading(false); return; } catch(e) {}
    }
    (async function() {
      try {
        var session = await supabase.auth.getSession();
        var token = session?.data?.session?.access_token || SUPABASE_ANON_KEY;
        var resp = await fetch(SUPABASE_URL + "/functions/v1/next-action", {
          method: "POST",
          headers: { "Content-Type":"application/json", "Authorization":"Bearer "+token, "apikey":SUPABASE_ANON_KEY },
          body: JSON.stringify({ page: page, profile: userData || {}, context: context })
        });
        if (resp.status === 429) { setLoading(false); setErr(true); return; }
        if (!resp.ok) throw new Error("HTTP "+resp.status);
        var data = await resp.json();
        if (data.suggestion) {
          setSug(data.suggestion);
          try { sessionStorage.setItem(cacheKey, JSON.stringify(data.suggestion)); } catch(e) {}
        }
      } catch(e) { console.log("[NextAction] error:", e); setErr(true); }
      setLoading(false);
    })();
  // eslint-disable-next-line
  }, [page, userData && userData.id]);

  var handleCta = function() {
    if (!sug || !sug.cta_action) return;
    var a = sug.cta_action;
    var pageMap: Record<string, any> = {
      marktanalyse:{p:"businessplan",sub:"marktanalyse"},
      businessplan:{p:"businessplan",sub:"businessplan"},
      finanzplan:{p:"finanzierung",sub:"finanzplan"},
      foerder:{p:"finanzierung",sub:"foerder"},
      rechtsform:{p:"rechtliches"},
      gewerbe:{p:"rechtliches"},
      roadmap:{p:"dashboard"},
      checkin:{p:"dashboard"},
      deadlines:{p:"dashboard"},
      upload:{p:"dokumente"},
      chat:{p:"chat"}
    };
    var target = pageMap[a];
    if (!target) return;
    if (onNavigate) onNavigate(target.p);
    if (target.sub) {
      setTimeout(function(){ window.dispatchEvent(new CustomEvent("subnav", { detail: { page: target.p, action: target.sub } })); }, 80);
    }
  };

  var handleDismiss = function() {
    sessionStorage.setItem("next_action_dismiss_" + page, "1");
    setDismissed(true);
  };

  if (dismissed || err) return null;

  var prioColor = sug && sug.priority === "high" ? "#34d399" : sug && sug.priority === "low" ? "#94a3b8" : "#fbbf24";

  if (loading) {
    return React.createElement("div", { className:"mb-6 rounded-xl p-4 flex items-center gap-3 skeleton-pulse", style:{background:"var(--surface-5)",border:"1px solid var(--border-10)"} },
      React.createElement("div", { className:"w-9 h-9 rounded-lg", style:{background:"var(--surface-8)"} }),
      React.createElement("div", { className:"flex-1" },
        React.createElement("div", { className:"rounded h-3 mb-2", style:{width:"45%",background:"var(--surface-8)"} }),
        React.createElement("div", { className:"rounded h-2.5", style:{width:"80%",background:"var(--surface-7)"} })));
  }

  if (!sug) return null;

  return React.createElement("div", { className:"mb-6 rounded-xl p-4 flex items-start gap-4 fadeIn", style:{background:"var(--surface-5)",border:"1px solid var(--border-10)",borderLeft:"3px solid "+prioColor} },
    React.createElement("div", { className:"w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", style:{background:"var(--surface-10)"} },
      React.createElement(Sparkles, { size:16, className:"text-white/60" })),
    React.createElement("div", { className:"flex-1 min-w-0" },
      React.createElement("div", { className:"flex items-center gap-2 mb-1" },
        React.createElement("p", { className:"text-[10px] uppercase tracking-widest text-white/35" }, "Nächster Schritt"),
        sug.priority === "high" && React.createElement("span", { className:"text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded", style:{background:"rgba(52,211,153,0.12)",color:"#34d399"} }, "empfohlen")),
      React.createElement("h4", { className:"text-white/80 font-medium text-sm mb-1" }, sug.title),
      React.createElement("p", { className:"text-white/50 text-xs leading-relaxed" }, sug.description)),
    React.createElement("div", { className:"flex items-center gap-2 flex-shrink-0" },
      sug.cta_label && sug.cta_action && React.createElement("button", { onClick:handleCta, className:"px-3 py-1.5 rounded-lg text-xs font-medium transition-all", style:{background:"var(--surface-12)",border:"1px solid var(--border-15)",color:"var(--text-default)"} }, sug.cta_label, " ", React.createElement(ArrowRight,{size:11,style:{display:"inline",marginLeft:4}})),
      React.createElement("button", { onClick:handleDismiss, title:"Ausblenden", className:"w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/5 transition-all" },
        React.createElement(X, { size:13 }))));
};

export const ProgressBar = ({ current, total }: { current: number, total: number }) => React.createElement("div", { className:"w-full" },
  React.createElement("div", { className:"flex justify-between text-xs text-white/30 mb-2 tracking-wider" },
    React.createElement("span", null, "Schritt ", current, " von ", total),
    React.createElement("span", null, Math.round((current/total)*100), "%")),
  React.createElement("div", { className:"w-full h-px", style:{background:"var(--border-6)"} },
    React.createElement("div", { className:"h-px transition-all duration-500", style:{width:(current/total)*100+"%",background:"var(--text-muted)"} })));

export const TileSelector = ({ options, selected, onSelect }: { options: any[], selected: string, onSelect: (v: string) => void }) => React.createElement("div", { className:"flex flex-wrap gap-2" }, options.map(function(opt: any) {
  return React.createElement("button", { key:opt.value, onClick:function(){onSelect(opt.value)}, className:"px-3 py-1.5 rounded-md text-xs tracking-wide transition-all duration-200 border", style:{
    borderColor:selected===opt.value?"var(--border-25)":"var(--border-6)",
    background:selected===opt.value?"var(--surface-8)":"transparent",
    color:selected===opt.value?"var(--text-high)":"var(--text-muted)",
    fontWeight:selected===opt.value?500:400
  }}, opt.label);
}));

export const Toggle = ({ value, onChange, label }: { value: boolean, onChange: (v: boolean) => void, label: string }) => React.createElement("div", { className:"flex items-center justify-between" },
  React.createElement("span", { className:"text-sm text-white/50" }, label),
  React.createElement("button", { onClick:function(){onChange(!value)}, className:"relative w-10 h-5 rounded-full transition-all duration-300 flex-shrink-0", style:{ background:value?"var(--surface-25)":"var(--surface-8)" }},
    React.createElement("span", { className:"absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-all duration-300", style:{transform:value?"translateX(20px)":"translateX(0)",background:value?"var(--text-primary)":"var(--text-muted)"} })));

export const ChecklistItem = ({ text, checked, onToggle }: { text: string, checked: boolean, onToggle: () => void }) => React.createElement("button", { onClick:onToggle, className:"flex items-center gap-3 w-full text-left py-2 group" },
  React.createElement("div", { className:"w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all duration-200 border", style:{ borderColor:checked?"var(--border-30)":"var(--border-10)", background:checked?"var(--surface-10)":"transparent" }}, checked && React.createElement(Check, {size:10,color:"var(--text-default)"})),
  React.createElement("span", { className:"text-sm transition-all duration-200 " + (checked?"line-through text-white/25":"text-white/60 group-hover:text-white/80") }, text));
