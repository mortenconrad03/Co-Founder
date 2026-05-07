'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import {
  BarChart2, Lightbulb, TrendingUp, Coins, Scale,
  FileText, MessageCircle, Target, Award, Users2,
  ChevronRight, LogOut, X, Menu
} from '@/components/icons';

export function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  var openState = useState(false); var open = openState[0]; var setOpen = openState[1];
  var hoverState = useState<string | null>(null); var hovered = hoverState[0]; var setHovered = hoverState[1];
  var closeTimerRef = useRef<any>(null);

  var openSub = function(id: string) {
    if(closeTimerRef.current){clearTimeout(closeTimerRef.current);closeTimerRef.current=null;}
    setHovered(id);
  };
  var scheduleClose = function() {
    if(closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(function(){ setHovered(null); }, 280);
  };

  var tabs = [
    {id:"dashboard",label:"Dashboard",Icon:BarChart2,href:"/dashboard"},
    {id:"geschaeftsidee",label:"Gesch\xe4ftsidee",Icon:Lightbulb,href:"/geschaeftsidee"},
    {id:"businessplan",label:"Businessplan & Strategie",Icon:TrendingUp,href:"/businessplan"},
    {id:"finanzierung",label:"Finanzierung",Icon:Coins,href:"/finanzierung"},
    {id:"rechtliches",label:"Rechtliches & Formalit\xe4ten",Icon:Scale,href:"/rechtliches"},
    {id:"dokumente",label:"Dokumente",Icon:FileText,href:"/dokumente"},
    {id:"chat",label:"KI-Berater",Icon:MessageCircle,href:"/chat"}
  ];

  var submenus: any = {
    businessplan: [
      {label:"Marktanalyse", action:"marktanalyse", Icon:Target},
      {label:"Businessplan erstellen", action:"businessplan", Icon:FileText}
    ],
    finanzierung: [
      {label:"F\xf6rderprogramme", action:"foerder", Icon:Award},
      {label:"Finanzplan erstellen", action:"finanzplan", Icon:TrendingUp},
      {label:"Investoren", action:"investoren", Icon:Users2, placeholder:true}
    ]
  };

  var getActiveId = function() {
    if (!pathname) return "dashboard";
    var seg = pathname.replace(/^\//, "").split("/")[0];
    return seg || "dashboard";
  };
  var activePage = getActiveId();

  var navigate = function(href: string) {
    router.push(href);
    setOpen(false);
    if(closeTimerRef.current){clearTimeout(closeTimerRef.current);closeTimerRef.current=null;}
    setHovered(null);
  };

  var navigateToSub = function(parentId: string, action: string, href: string) {
    router.push(href);
    setOpen(false);
    if(closeTimerRef.current){clearTimeout(closeTimerRef.current);closeTimerRef.current=null;}
    setHovered(null);
    setTimeout(function() {
      window.dispatchEvent(new CustomEvent("subnav", { detail: { page: parentId, action: action } }));
    }, 80);
  };

  var handleLogout = async function() { await supabase.auth.signOut(); };
  var userEmail = user?.email || "";
  var userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : "?";

  return React.createElement(React.Fragment, null,
    React.createElement("button", { onClick:function(){setOpen(!open)}, className:"mobile-toggle fixed top-4 left-4 z-[60] p-2 rounded-lg border border-white/[0.08] md:hidden", style:{display:"none",background:"var(--bg-page)"} }, open ? React.createElement(X,{size:18,className:"text-white/60"}) : React.createElement(Menu,{size:18,className:"text-white/60"})),
    React.createElement("nav", { className:"sidebar-nav"+(open?" open":"") },
      React.createElement("div", { className:"px-5 mb-8 flex-shrink-0" },
        React.createElement("img", { src:"/logo.png", alt:"CoFounder AI", style:{height:21,objectFit:"contain",filter:"var(--logo-filter)"} })),
      React.createElement("div", { className:"flex-1 px-3 space-y-0.5" },
        tabs.map(function(t: any) {
          var isActive = activePage === t.id;
          var sub = submenus[t.id];
          var isHovered = hovered === t.id;
          return React.createElement("div", { key:t.id, style:{position:"static"}, onMouseEnter:function(){ if(sub) openSub(t.id); else scheduleClose(); }, onMouseLeave:function(){ if(sub) scheduleClose(); } },
            React.createElement("button", { onClick:function(){ navigate(t.href); }, className:"w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 " + (isActive ? "text-white/80" : "text-white/35 hover:text-white/60 hover:bg-white/[0.03]"), style: isActive || isHovered ? {background:"var(--surface-5)"} : {} },
              React.createElement(t.Icon, { size:16 }),
              React.createElement("span", { className:"tracking-wide text-xs flex-1 text-left" }, t.label),
              sub && React.createElement(ChevronRight, { size:12, className:"text-white/25" })));
        })),
      React.createElement("div", { className:"mt-auto px-3 pt-3 border-t border-white/[0.04] space-y-0.5" },
        React.createElement("button", { onClick:function(){navigate("/account")}, className:"w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all duration-150 " + (activePage==="account"?"text-white/80 bg-white/[0.05]":"text-white/30 hover:text-white/60 hover:bg-white/[0.03]") },
          React.createElement("div", { className:"w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium", style:{background:"var(--surface-8)",color:"var(--text-secondary)"} }, userInitial),
          React.createElement("div", { className:"flex-1 text-left min-w-0" },
            React.createElement("span", { className:"tracking-wide block" }, "Account"),
            React.createElement("span", { className:"text-[10px] text-white/20 block truncate" }, userEmail))),
        React.createElement("button", { onClick:handleLogout, className:"w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-white/20 hover:text-white/50 hover:bg-white/[0.03] transition-all" },
          React.createElement(LogOut, { size:14 }), "Logout"))),

    hovered && submenus[hovered] && React.createElement("div", {
      onMouseEnter:function(){ openSub(hovered!); },
      onMouseLeave:function(){ scheduleClose(); },
      style:{ position:"fixed", left:250, top:0, bottom:0, width:260, zIndex:55, background:"var(--bg-sidebar)", borderRight:"1px solid var(--border-15)", borderLeft:"1px solid var(--border-5)", padding:"20px 0", display:"flex", flexDirection:"column", boxShadow:"8px 0 32px rgba(0,0,0,0.4)" }
    },
      React.createElement("div", { className:"px-5 mb-6 flex-shrink-0" },
        React.createElement("p", { className:"text-[10px] uppercase tracking-widest text-white/30" }, (tabs.find(function(x: any){return x.id===hovered})||{} as any).label)),
      React.createElement("div", { className:"flex-1 px-3 space-y-0.5" },
        submenus[hovered].map(function(item: any) {
          var parentTab = tabs.find(function(x: any){return x.id===hovered});
          var href = parentTab ? parentTab.href : "/dashboard";
          return React.createElement("button", { key:item.action, onClick:function(){ navigateToSub(hovered!, item.action, href); }, className:"w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/55 hover:text-white/90 hover:bg-white/[0.05] transition-all" },
            React.createElement(item.Icon, { size:16 }),
            React.createElement("span", { className:"flex-1 text-left tracking-wide text-xs" }, item.label),
            item.placeholder && React.createElement("span", { className:"text-[9px] uppercase tracking-wider text-white/25 px-2 py-0.5 rounded-full border border-white/10" }, "bald"));
        }))));
}
