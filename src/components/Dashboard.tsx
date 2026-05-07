/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/lib/auth'
import { supabase, SUPABASE_URL } from '@/lib/supabase'
import { aiFetch } from '@/lib/aiFetch'
import { db } from '@/lib/db'
import { GlassCard, PrimaryButton, SecondaryButton } from '@/components/ui'
import { RoadmapWeekBlock } from '@/components/RoadmapBlocks'
import { ProfileEditor } from '@/components/ProfileEditor'
import { Loader2, Sparkles, Rocket, Target, Upload, Scale, Coins, ArrowRight } from '@/components/icons'

export const Dashboard = function({ userData, onNavigate }: { userData: Record<string, unknown> | null; onNavigate: (page: string) => void }) {
  const { user } = useAuth();
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [customTasks, setCustomTasks] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState("");

  var SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  useEffect(function() {
    if (!user) return;
    (async function() {
      try {
        var ob = await db.getOnboarding(user.id);
        var ct = await db.getCompletedTasks(user.id);
        setOnboardingData(ob);
        setCompletedTasks(ct);

        try {
          var userCustomTasks = await db.getCustomTasks(user.id);
          setCustomTasks(userCustomTasks || []);
        } catch(e) { console.error("[Dashboard] custom_tasks error:", e); }

        if (!ob || !ob.onboarding_complete) { setLoadingData(false); return; }

        var cachedTasks = null;
        try {
          cachedTasks = await db.getAiRoadmap(user.id);
        } catch(e) { console.error("[Dashboard] ai_roadmap error:", e); }

        if (cachedTasks && cachedTasks.length > 0) {
          setAllTasks(cachedTasks);
          setLoadingData(false);
          return;
        }

        setAiGenerating(true);
        try {
          var aiTasks = await callAiRoadmap(ob);
          if (aiTasks && aiTasks.length > 0) {
            setAllTasks(aiTasks);
            try { await db.saveAiRoadmap(user.id, aiTasks); } catch(e) { console.error("[Dashboard] Save error:", e); }
          } else {
            setAiError("KI hat keine Aufgaben generiert. Klicke auf 'Neu generieren'.");
          }
        } catch (err: any) {
          setAiError("Roadmap konnte nicht generiert werden: " + err.message);
        }
        setAiGenerating(false);
        setLoadingData(false);
      } catch(e) {
        setLoadingData(false);
      }
    })();
  }, [user]);

  async function callAiRoadmap(ob: any) {
    var session = await supabase.auth.getSession();
    var token = session?.data?.session?.access_token || SUPABASE_ANON_KEY;
    var payload = {
      pitch: ob.pitch || "", problem: ob.problem || "", zielgruppe: ob.zielgruppe || "",
      phase: ob.phase || "idee", branche: ob.branche || "", bundesland: ob.bundesland || "",
      teamgroesse: ob.teamgroesse || 1, kapitalbedarf: ob.kapitalbedarf || 50000,
      investoren: ob.investoren || false, rechtsform: ob.rechtsform || false,
      foerderungen: ob.foerderungen !== false, businessplan: ob.businessplan || false,
      finanzplan: ob.finanzplan || false, konkurrenz: ob.konkurrenz || false,
      preis: ob.preis || false, ziele: ob.ziele || ""
    };
    var resp = await aiFetch(SUPABASE_URL + "/functions/v1/generate-roadmap", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token, "apikey": SUPABASE_ANON_KEY },
      body: JSON.stringify(payload)
    });
    var text = await resp.text();
    var res: any;
    try { res = JSON.parse(text); } catch(e) { throw new Error("Ungültige Antwort von Edge Function: " + text.substring(0, 100)); }
    if (!resp.ok) throw new Error(res.error || "Edge Function Fehler (Status " + resp.status + ")");
    return res.tasks || [];
  }

  var handleRegenerate = async function() {
    if (!user || !onboardingData || aiGenerating) return;
    setAiGenerating(true);
    setAiError("");
    try {
      var aiTasks = await callAiRoadmap(onboardingData);
      if (aiTasks && aiTasks.length > 0) {
        setAllTasks(aiTasks);
        setCompletedTasks({});
        try { await db.saveAiRoadmap(user.id, aiTasks); } catch(e) { console.error("Save error:", e); }
      } else {
        setAiError("KI hat keine Aufgaben generiert. Bitte versuche es erneut.");
      }
    } catch (err: any) {
      setAiError(err.message);
    }
    setAiGenerating(false);
  };

  var addCustomTask = async function(week: number, title: string, description: string) {
    if (!user || !title.trim()) return;
    var taskId = "custom_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);
    var newTask = { id: taskId, week: week, title: title.trim(), description: (description || "").trim(), priority: "mittel", effort: "", link: "/dashboard", isCustom: true };
    setCustomTasks(function(prev: any[]) { return prev.concat([newTask]); });
    await db.saveCustomTask(user.id, newTask);
  };

  var deleteCustomTask = async function(taskId: string) {
    if (!user) return;
    setCustomTasks(function(prev: any[]) { return prev.filter(function(t: any) { return t.id !== taskId; }); });
    setCompletedTasks(function(prev: any) { var next = Object.assign({}, prev); delete next[taskId]; return next; });
    await db.deleteCustomTask(user.id, taskId);
  };

  var mergedTasks = useMemo(function() {
    return allTasks.concat(customTasks);
  }, [allTasks, customTasks]);

  var toggleTask = function(taskId: string) {
    var isNowCompleted = !completedTasks[taskId];
    setCompletedTasks(function(prev: any) { var next = Object.assign({}, prev); if (next[taskId]) delete next[taskId]; else next[taskId] = true; return next; });
    if (user) db.toggleTask(user.id, taskId, isNowCompleted);
  };

  if (loadingData) return React.createElement("div", { className:"max-w-3xl mx-auto py-20 px-6 text-center" },
    React.createElement(Loader2, { size:32, className:"animate-spin text-white/60 mx-auto mb-4" }),
    React.createElement("p", { className:"text-white/40" }, "Daten werden geladen..."));

  if (!onboardingData || !onboardingData.onboarding_complete) return React.createElement("div", { className:"max-w-3xl mx-auto py-20 px-6" },
    React.createElement(GlassCard, { className:"p-8 text-center" },
      React.createElement("div", { className:"w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center", style:{background:"var(--surface-15)"} },
        React.createElement(Rocket, { size:32, className:"text-white/60" })),
      React.createElement("h2", { className:"text-2xl font-medium text-white mb-2" }, "Noch kein Profil"),
      React.createElement("p", { className:"text-white/50 mb-6" }, "Starte das Onboarding, damit wir deine personalisierte 90-Tage-Roadmap mit KI erstellen."),
      React.createElement(SecondaryButton, { onClick:function(){window.location.reload()}, className:"mx-auto" }, "Onboarding starten ", React.createElement(ArrowRight,{size:16}))));

  if (aiGenerating && allTasks.length === 0) return React.createElement("div", { className:"max-w-3xl mx-auto py-20 px-6 text-center" },
    React.createElement("div", { className:"w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center", style:{background:"var(--icon-gradient)",border:"1px solid var(--border-15)"} },
      React.createElement(Sparkles, { size:28, className:"text-white/60 animate-pulse" })),
    React.createElement("h2", { className:"text-xl text-white mb-3" }, "Deine Roadmap wird erstellt"),
    React.createElement("p", { className:"text-white/40 text-sm mb-6 max-w-md mx-auto" }, "Die KI analysiert dein Startup-Profil und erstellt eine personalisierte 90-Tage-Roadmap mit konkreten Aufgaben..."),
    React.createElement("div", { className:"flex items-center justify-center gap-2" },
      React.createElement(Loader2, { size:16, className:"animate-spin text-white/40" }),
      React.createElement("span", { className:"text-sm text-white/40" }, "Wird generiert...")));

  var isAiRoadmap = allTasks.length > 0;
  var totalTasks = mergedTasks.length;
  var doneTasks = mergedTasks.filter(function(t: any) { return completedTasks[t.id]; }).length;
  var progress = totalTasks > 0 ? Math.round((doneTasks/totalTasks)*100) : 0;
  var tasksByWeek: any[] = [];
  for (var w = 1; w <= 12; w++) { var wt = mergedTasks.filter(function(t: any){return t.week===w}); if(wt.length>0) tasksByWeek.push({week:w,tasks:wt}); }
  var milestones = [{pct:25,label:"Grundlagen"},{pct:50,label:"Gründung ready"},{pct:75,label:"Förderung & Setup"},{pct:100,label:"Startklar"}];

  return React.createElement("div", { className:"max-w-5xl mx-auto py-10 px-6" },
    React.createElement("div", { className:"flex items-start justify-between mb-8" },
      React.createElement("div", null,
        React.createElement("h1", { className:"text-3xl font-medium text-white mb-1" }, "Deine 90-Tage-Roadmap"),
        React.createElement("div", { className:"flex items-center gap-2" },
          React.createElement(isAiRoadmap ? Sparkles : Target, { size:12, className:"text-white/30" }),
          React.createElement("p", { className:"text-white/40 text-xs uppercase tracking-widest font-medium" }, isAiRoadmap ? "KI-personalisiert für dein Startup" : "Basierend auf deinem Onboarding"))),
      React.createElement("button", { onClick:handleRegenerate, disabled:aiGenerating, className:"flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all border border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.03] " + (aiGenerating ? "text-white/20" : "text-white/40 hover:text-white/60") },
        aiGenerating ? React.createElement(Loader2, { size:12, className:"animate-spin" }) : React.createElement(Sparkles, { size:12 }), aiGenerating ? "Generiert..." : isAiRoadmap ? "Neu generieren" : "Mit KI generieren")),

    aiError && React.createElement("div", { className:"mb-4 p-3 rounded-lg text-xs text-amber-300/80 border border-amber-400/20", style:{background:"var(--warning-bg)"} }, aiError),

    React.createElement(GlassCard, { className:"p-6 mb-6", style:{borderColor:"var(--border-25)",background:"var(--surface-5)"} },
      React.createElement("div", { className:"flex items-center justify-between mb-4" },
        React.createElement("div", null,
          React.createElement("p", { className:"text-xs text-white/60 uppercase tracking-wider mb-1" }, "Fortschritt"),
          React.createElement("p", { className:"text-3xl font-medium text-white" }, progress+"% ", React.createElement("span",{className:"text-base text-white/35 font-normal"},"geschafft"))),
        React.createElement("div", { className:"text-right" },
          React.createElement("p", { className:"text-white/40 text-xs mb-0.5" }, "Aufgaben"),
          React.createElement("p", { className:"text-2xl font-medium text-white" }, doneTasks+"/"+totalTasks))),
      React.createElement("div", { className:"relative" },
        React.createElement("div", { className:"w-full h-3 rounded-full", style:{background:"var(--surface-7)"} },
          React.createElement("div", { className:"h-3 rounded-full transition-all duration-700", style:{width:progress+"%",background:"var(--accent-gradient)",boxShadow:"var(--accent-glow)"} })),
        React.createElement("div", { className:"flex justify-between mt-3" }, milestones.map(function(m: any) {
          return React.createElement("div", { key:m.pct, className:"flex flex-col items-center", style:{width:"25%"} },
            React.createElement("div", { className:"w-2 h-2 rounded-full mb-1 transition-all "+(progress>=m.pct?"bg-white/30 ring-4 ring-white/10":"bg-white/20") }),
            React.createElement("p", { className:"text-xs transition-colors "+(progress>=m.pct?"text-white/50 font-medium":"text-white/30") }, m.label));
        })))),

    React.createElement("div", { className:"grid grid-cols-3 gap-3 mb-8" },
      React.createElement("button", { onClick:function(){onNavigate("dokumente")}, className:"p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left" },
        React.createElement(Upload, {size:18,className:"text-white/60 mb-2"}), React.createElement("p",{className:"text-white/90 font-medium text-sm"},"Dokument hochladen")),
      React.createElement("button", { onClick:function(){onNavigate("rechtliches")}, className:"p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left" },
        React.createElement(Scale, {size:18,className:"text-white/60 mb-2"}), React.createElement("p",{className:"text-white/90 font-medium text-sm"},"Rechtsform-Quiz")),
      React.createElement("button", { onClick:function(){onNavigate("finanzierung")}, className:"p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left" },
        React.createElement(Coins, {size:18,className:"text-white/60 mb-2"}), React.createElement("p",{className:"text-white/90 font-medium text-sm"},"Förderung prüfen"))),

    React.createElement("div", { className:"space-y-4" }, tasksByWeek.map(function(wd: any) {
      return React.createElement(RoadmapWeekBlock, { key:wd.week, week:wd.week, tasks:wd.tasks, completedTasks:completedTasks, onToggle:toggleTask, onNavigate:onNavigate, onAddTask:addCustomTask, onDeleteTask:deleteCustomTask });
    })),

    React.createElement(ProfileEditor, { onboardingData:onboardingData, onSave:async function(newData: any) {
      setOnboardingData(newData);
      if (user) {
        await db.saveOnboarding(user.id, newData);
        setAiGenerating(true); setAiError("");
        try {
          var aiTasks = await callAiRoadmap(newData);
          if (aiTasks && aiTasks.length > 0) {
            setAllTasks(aiTasks);
            setCompletedTasks({});
            try { await db.saveAiRoadmap(user.id, aiTasks); } catch(e) { console.error("Save error:", e); }
          } else { setAiError("KI hat keine Aufgaben generiert."); }
        } catch(err: any) { setAiError(err.message); }
        setAiGenerating(false);
      }
    }, aiGenerating:aiGenerating }));
};
