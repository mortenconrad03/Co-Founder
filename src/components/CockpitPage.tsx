/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/lib/auth'
import { supabase, SUPABASE_URL } from '@/lib/supabase'
import { aiFetch } from '@/lib/aiFetch'
import { db } from '@/lib/db'
import { GlassCard, PrimaryButton, Sparkline, NextActionBanner } from '@/components/ui'
import { RoadmapWeekBlock } from '@/components/RoadmapBlocks'
import { Target, CheckSquare, BarChart2, CalendarCheck, Briefcase, Sparkles, Loader2, Check, Save, ChevronLeft } from '@/components/icons'

export const CockpitPage = function({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { user } = useAuth();
  var secState = useState("meilensteine"); var section = secState[0]; var setSection = secState[1];
  var profileState = useState<any>(null); var profile = profileState[0]; var setProfile = profileState[1];
  var loadState = useState(true); var isLoading = loadState[0]; var setIsLoading = loadState[1];
  var ciTextState = useState(""); var ciText = ciTextState[0]; var setCiText = ciTextState[1];
  var ciLoadState = useState(false); var ciLoading = ciLoadState[0]; var setCiLoading = ciLoadState[1];
  var ciHistState = useState<any[]>([]); var ciHistory = ciHistState[0]; var setCiHistory = ciHistState[1];
  var ciFeedState = useState<any>(null); var ciFeedback = ciFeedState[0]; var setCiFeedback = ciFeedState[1];
  var kpiState = useState<any[]>([]); var kpis = kpiState[0]; var setKpis = kpiState[1];
  var kpiFormState = useState<any>({umsatz:0,kunden:0,ausgaben:0,leads:0}); var kpiForm = kpiFormState[0]; var setKpiForm = kpiFormState[1];
  var kpiSavState = useState(false); var kpiSaved = kpiSavState[0]; var setKpiSaved = kpiSavState[1];
  var dlState = useState<any[]>([]); var deadlines = dlState[0]; var setDeadlines = dlState[1];
  var dlGenState = useState(false); var dlGenerating = dlGenState[0]; var setDlGenerating = dlGenState[1];
  var dlDoneState = useState(false); var dlGenerated = dlDoneState[0]; var setDlGenerated = dlDoneState[1];
  var mtTypeState = useState(""); var mtType = mtTypeState[0]; var setMtType = mtTypeState[1];
  var mtNotesState = useState(""); var mtNotes = mtNotesState[0]; var setMtNotes = mtNotesState[1];
  var mtLoadState = useState(false); var mtLoading = mtLoadState[0]; var setMtLoading = mtLoadState[1];
  var mtResultState = useState<any>(null); var mtResult = mtResultState[0]; var setMtResult = mtResultState[1];
  var msTasksState = useState<any[]>([]); var msTasks = msTasksState[0]; var setMsTasks = msTasksState[1];
  var msCompState = useState<any>({}); var msCompleted = msCompState[0]; var setMsCompleted = msCompState[1];
  var msCustomState = useState<any[]>([]); var msCustom = msCustomState[0]; var setMsCustom = msCustomState[1];
  var msGenState = useState(false); var msGenerating = msGenState[0]; var setMsGenerating = msGenState[1];
  var msErrState = useState(""); var msError = msErrState[0]; var setMsError = msErrState[1];

  var SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  useEffect(function() {
    if (!user) return;
    (async function() {
      var ob = await db.getOnboarding(user.id);
      setProfile(ob);
      var ch = await db.getCheckins(user.id, 10);
      setCiHistory(ch);
      var k = await db.getKPIs(user.id, 52);
      setKpis(k);
      var dl = await db.getDeadlines(user.id);
      setDeadlines(dl);
      if (dl.length > 0) setDlGenerated(true);
      try {
        var cached = await db.getAiRoadmap(user.id);
        if (cached && cached.length > 0) { setMsTasks(cached); }
        else if (ob && ob.onboarding_complete) {
          setMsGenerating(true);
          try {
            var aiTasks = await callCockpitRoadmap(ob);
            if (aiTasks && aiTasks.length > 0) { setMsTasks(aiTasks); await db.saveAiRoadmap(user.id, aiTasks); }
            else setMsError("KI hat keine Aufgaben generiert.");
          } catch(e: any) { setMsError(e.message); }
          setMsGenerating(false);
        }
        var ct = await db.getCompletedTasks(user.id);
        setMsCompleted(ct);
        var cust = await db.getCustomTasks(user.id);
        setMsCustom(cust || []);
      } catch(e) { console.error("Roadmap load error:", e); }
      setIsLoading(false);
    })();
  }, [user]);

  async function callCockpitRoadmap(ob: any) {
    var session = await supabase.auth.getSession();
    var token = session?.data?.session?.access_token || SUPABASE_ANON_KEY;
    var payload = { pitch:ob.pitch||"",problem:ob.problem||"",zielgruppe:ob.zielgruppe||"",phase:ob.phase||"idee",branche:ob.branche||"",bundesland:ob.bundesland||"",teamgroesse:ob.teamgroesse||1,kapitalbedarf:ob.kapitalbedarf||50000,investoren:ob.investoren||false,rechtsform:ob.rechtsform||false,foerderungen:ob.foerderungen!==false,businessplan:ob.businessplan||false,finanzplan:ob.finanzplan||false,konkurrenz:ob.konkurrenz||false,preis:ob.preis||false,ziele:ob.ziele||"" };
    var resp = await aiFetch(SUPABASE_URL+"/functions/v1/generate-roadmap", { method:"POST", headers:{"Content-Type":"application/json","Authorization":"Bearer "+token,"apikey":SUPABASE_ANON_KEY}, body:JSON.stringify(payload) });
    var text = await resp.text();
    var res: any; try { res = JSON.parse(text); } catch(e) { throw new Error("Ungültige Antwort"); }
    if (!resp.ok) throw new Error(res.error || "Fehler " + resp.status);
    return res.tasks || [];
  }

  var handleRegenerate = async function() {
    if (!user || !profile || msGenerating) return;
    setMsGenerating(true); setMsError("");
    try {
      var aiTasks = await callCockpitRoadmap(profile);
      if (aiTasks && aiTasks.length > 0) { setMsTasks(aiTasks); setMsCompleted({}); await db.saveAiRoadmap(user.id, aiTasks); }
      else setMsError("KI hat keine Aufgaben generiert.");
    } catch(e: any) { setMsError(e.message); }
    setMsGenerating(false);
  };

  var msToggleTask = function(taskId: string) {
    var isNow = !msCompleted[taskId];
    setMsCompleted(function(p: any) { var n = Object.assign({},p); if(n[taskId]) delete n[taskId]; else n[taskId]=true; return n; });
    if (user) db.toggleTask(user.id, taskId, isNow);
  };

  var msAddTask = async function(week: number, title: string, description: string) {
    if (!user || !title.trim()) return;
    var taskId = "custom_" + Date.now() + "_" + Math.random().toString(36).substr(2,5);
    var newTask = { id:taskId, week:week, title:title.trim(), description:(description||"").trim(), priority:"mittel", effort:"", link:"/dashboard", isCustom:true };
    setMsCustom(function(p: any[]) { return p.concat([newTask]); });
    await db.saveCustomTask(user.id, newTask);
  };

  var msDeleteTask = async function(taskId: string) {
    if (!user) return;
    setMsCustom(function(p: any[]) { return p.filter(function(t: any) { return t.id !== taskId; }); });
    setMsCompleted(function(p: any) { var n = Object.assign({},p); delete n[taskId]; return n; });
    await db.deleteCustomTask(user.id, taskId);
  };

  var msMerged = useMemo(function() { return msTasks.concat(msCustom); }, [msTasks, msCustom]);

  var getWeekStart = function() {
    var d = new Date(); var day = d.getDay(); var diff = d.getDate() - day + (day===0?-6:1);
    return new Date(d.setDate(diff)).toISOString().split("T")[0];
  };

  var handleCheckin = async function() {
    if (!ciText.trim()) return;
    setCiLoading(true);
    try {
      var session = await supabase.auth.getSession();
      var token = session?.data?.session?.access_token || SUPABASE_ANON_KEY;
      var latestKpi = kpis.length > 0 ? kpis[kpis.length-1] : null;
      var resp = await aiFetch(SUPABASE_URL+"/functions/v1/cockpit-checkin", {
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":"Bearer "+token,"apikey":SUPABASE_ANON_KEY},
        body:JSON.stringify({ user_text:ciText, profile:profile||{}, kpis:latestKpi, previous_checkins:ciHistory.slice(0,5) })
      });
      if (!resp.ok) throw new Error("HTTP "+resp.status);
      var data = await resp.json();
      setCiFeedback(data.feedback);
      var ws = getWeekStart();
      await db.saveCheckin(user!.id, ws, ciText, data.feedback);
      setCiHistory(function(p: any[]) { return [{ week_start:ws, user_text:ciText, ai_feedback:data.feedback }].concat(p); });
    } catch(e) { console.error("Checkin error:", e); }
    setCiLoading(false);
  };

  var handleSaveKPI = async function() {
    var ws = getWeekStart();
    await db.saveKPI(user!.id, ws, kpiForm);
    setKpis(function(p: any[]) { return p.concat([Object.assign({period:ws}, kpiForm)]); });
    setKpiSaved(true);
    setTimeout(function(){ setKpiSaved(false); }, 2000);
  };

  var handleGenerateDeadlines = async function() {
    setDlGenerating(true);
    try {
      var session = await supabase.auth.getSession();
      var token = session?.data?.session?.access_token || SUPABASE_ANON_KEY;
      var rfAnalysis = await db.getRechtsformAnalysis(user!.id);
      var rfName = rfAnalysis?.aiAnalysis?.empfehlung?.rechtsform || rfAnalysis?.topKey || "einzelunternehmen";
      var resp = await aiFetch(SUPABASE_URL+"/functions/v1/cockpit-deadlines", {
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":"Bearer "+token,"apikey":SUPABASE_ANON_KEY},
        body:JSON.stringify({ rechtsform:rfName, bundesland:profile?.bundesland, branche:profile?.branche, phase:profile?.phase, teamgroesse:profile?.teamgroesse||1 })
      });
      if (!resp.ok) throw new Error("HTTP "+resp.status);
      var data = await resp.json();
      if (data.deadlines && data.deadlines.length > 0) {
        await db.saveDeadlines(user!.id, data.deadlines);
        setDeadlines(data.deadlines.map(function(d: any,i: number){ return Object.assign({id:"dl_"+i}, d); }));
        setDlGenerated(true);
        await supabase.from("profiles").update({cockpit_deadlines_generated:true}).eq("id", user!.id);
      }
    } catch(e) { console.error("Deadlines error:", e); }
    setDlGenerating(false);
  };

  var handleToggleDeadline = function(dl: any) {
    var newVal = !dl.completed;
    setDeadlines(function(p: any[]) { return p.map(function(d: any) { return d.id===dl.id ? Object.assign({},d,{completed:newVal}) : d; }); });
    if (dl.id && !dl.id.startsWith("dl_")) db.toggleDeadline(user!.id, dl.id, newVal);
  };

  var handleMeetingPrep = async function() {
    if (!mtType) return;
    setMtLoading(true); setMtResult(null);
    try {
      var session = await supabase.auth.getSession();
      var token = session?.data?.session?.access_token || SUPABASE_ANON_KEY;
      var latestKpi = kpis.length > 0 ? kpis[kpis.length-1] : null;
      var resp = await aiFetch(SUPABASE_URL+"/functions/v1/cockpit-meeting", {
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":"Bearer "+token,"apikey":SUPABASE_ANON_KEY},
        body:JSON.stringify({ meeting_type:mtType, notizen:mtNotes, profile:profile||{}, kpis:latestKpi })
      });
      if (!resp.ok) throw new Error("HTTP "+resp.status);
      var data = await resp.json();
      setMtResult(data.prep);
    } catch(e) { console.error("Meeting prep error:", e); }
    setMtLoading(false);
  };

  var sections = [
    {id:"meilensteine",label:"Meilensteine",Icon:Target},
    {id:"checkin",label:"Wochencheck",Icon:CheckSquare},
    {id:"kpis",label:"KPIs",Icon:BarChart2},
    {id:"deadlines",label:"Fristen",Icon:CalendarCheck},
    {id:"meeting",label:"Meeting-Prep",Icon:Briefcase}
  ];

  if (isLoading) {
    var skelBar = function(w: string, h?: number, mb?: number) { return React.createElement("div", { className:"rounded-lg", style:{width:w,height:h||12,marginBottom:mb||0,background:"var(--surface-7)"} }); };
    return React.createElement("div", { className:"max-w-5xl mx-auto py-10 px-6" },
      React.createElement("div", { className:"mb-7" }, skelBar("180px", 28, 10), skelBar("320px", 12)),
      React.createElement("div", { className:"flex gap-2 mb-8" }, [80,110,70,90,120].map(function(w: number,i: number){ return React.createElement("div", { key:i, className:"rounded-xl", style:{width:w,height:38,background:"var(--surface-5)"} }); })),
      React.createElement(GlassCard, { className:"p-6 mb-4" }, skelBar("60%", 20, 14), skelBar("100%", 12, 8), skelBar("85%", 12, 8), skelBar("70%", 12)),
      React.createElement(GlassCard, { className:"p-6" }, skelBar("40%", 16, 14), skelBar("100%", 10, 6), skelBar("90%", 10, 6), skelBar("95%", 10, 6), skelBar("60%", 10)));
  }

  var renderCheckin = function() {
    var trendIcon: any = {"up":"📈","stable":"➡️","down":"📉"};
    return React.createElement("div", { className:"space-y-6" },
      React.createElement(GlassCard, { className:"p-5" },
        React.createElement("h3", { className:"text-white font-medium mb-3" }, "Was hast du diese Woche geschafft?"),
        React.createElement("textarea", { value:ciText, onChange:function(e: any){setCiText(e.target.value)}, placeholder:"z.B. Landing Page fertig gebaut, 3 Kundengespräche geführt, Pitch Deck überarbeitet...", rows:4, className:"w-full rounded-xl p-3 text-sm text-white placeholder-white/25 outline-none resize-none", style:{background:"var(--bg-input)",border:"1px solid var(--border-10)"} }),
        React.createElement("div", { className:"flex justify-end mt-3" },
          React.createElement(PrimaryButton, { onClick:handleCheckin, disabled:ciLoading||!ciText.trim() },
            ciLoading ? React.createElement(React.Fragment,null,React.createElement(Loader2,{size:14,className:"animate-spin"})," Analysiere...") :
            React.createElement(React.Fragment,null,React.createElement(Sparkles,{size:14})," Check-in absenden")))),

      ciFeedback && React.createElement("div", { className:"space-y-4" },
        React.createElement(GlassCard, { className:"p-5" },
          React.createElement("div", { className:"flex items-center justify-between mb-3" },
            React.createElement("div", { className:"flex items-center gap-2" },
              React.createElement(Sparkles, { size:14, className:"text-white/60" }),
              React.createElement("p", { className:"text-xs text-white/40 uppercase tracking-wider" }, "KI-Feedback")),
            React.createElement("div", { className:"flex items-center gap-2" },
              React.createElement("span", { className:"text-sm" }, trendIcon[ciFeedback.trend]||""),
              React.createElement("span", { className:"text-xs px-2 py-1 rounded-full font-medium", style:{background:"var(--surface-15)",color:"var(--text-high)"} }, ciFeedback.motivation_score+"/10"))),
          React.createElement("p", { className:"text-sm text-white/70 leading-relaxed mb-4" }, ciFeedback.zusammenfassung),
          React.createElement("p", { className:"text-sm text-white/50 italic" }, '"'+ciFeedback.coach_nachricht+'"')),

        React.createElement("div", { className:"grid md:grid-cols-2 gap-4" },
          React.createElement(GlassCard, { className:"p-4" },
            React.createElement("p", { className:"text-xs text-white/40 uppercase tracking-wider mb-2" }, "✓ Was gut lief"),
            React.createElement("div", { className:"space-y-1" }, (ciFeedback.achievements||[]).map(function(a: string,i: number) { return React.createElement("div",{key:i,className:"flex items-start gap-2 text-sm text-white/60"},React.createElement("span",{className:"text-emerald-400"},"✓"),a); }))),
          React.createElement(GlassCard, { className:"p-4" },
            React.createElement("p", { className:"text-xs text-white/40 uppercase tracking-wider mb-2" }, "💡 Verbesserungen"),
            React.createElement("div", { className:"space-y-1" }, (ciFeedback.verbesserungen||[]).map(function(v: string,i: number) { return React.createElement("div",{key:i,className:"flex items-start gap-2 text-sm text-white/60"},React.createElement("span",{className:"text-amber-400"},"→"),v); })))),

        React.createElement(GlassCard, { className:"p-5" },
          React.createElement("p", { className:"text-xs text-white/40 uppercase tracking-wider mb-3" }, "Prioritäten nächste Woche"),
          React.createElement("div", { className:"space-y-3" }, (ciFeedback.prioritaeten_naechste_woche||[]).map(function(p: any,i: number) {
            return React.createElement("div", { key:i, className:"flex items-start gap-3" },
              React.createElement("div", { className:"w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0", style:{background:"var(--surface-20)",color:"var(--text-default)"} }, i+1),
              React.createElement("div", null,
                React.createElement("p", { className:"text-sm text-white/70 font-medium" }, p.aufgabe),
                React.createElement("p", { className:"text-xs text-white/40 mt-0.5" }, p.warum+" · "+p.zeitaufwand)));
          })))),

      ciHistory.length > 0 && React.createElement("div", null,
        React.createElement("p", { className:"text-xs text-white/30 uppercase tracking-wider mb-3" }, "Vergangene Check-ins"),
        React.createElement("div", { className:"space-y-2" }, ciHistory.slice(0,5).map(function(c: any,i: number) {
          var fb = c.ai_feedback;
          return React.createElement(GlassCard, { key:i, className:"p-3 cursor-pointer hover:border-white/15 transition-all", onClick:function(){setCiFeedback(fb)} },
            React.createElement("div", { className:"flex items-center justify-between" },
              React.createElement("div", { className:"flex items-center gap-2" },
                React.createElement("span", { className:"text-xs text-white/30" }, "KW "+c.week_start),
                fb && React.createElement("span", { className:"text-xs" }, trendIcon[fb.trend]||"")),
              fb && React.createElement("span", { className:"text-xs text-white/30" }, fb.motivation_score+"/10")));
        }))));
  };

  var renderKPIs = function() {
    var umsatzData = kpis.map(function(k: any){return k.umsatz||0});
    var kundenData = kpis.map(function(k: any){return k.kunden||0});
    var ausgabenData = kpis.map(function(k: any){return k.ausgaben||0});
    var leadsData = kpis.map(function(k: any){return k.leads||0});
    var latest = kpis.length > 0 ? kpis[kpis.length-1] : null;
    var prev = kpis.length > 1 ? kpis[kpis.length-2] : null;
    var delta = function(curr: any, old: any) { if (!old || old===0) return ""; var d=Math.round(((curr-old)/old)*100); return d>0?"+"+d+"%":d+"%"; };
    var deltaColor = function(curr: any, old: any, inverse?: boolean) { if (!old) return "text-white/30"; var up=curr>=old; if(inverse) up=!up; return up?"text-emerald-400":"text-red-400"; };

    var kpiCards = [
      { label:"Umsatz", value:(latest?.umsatz||0).toLocaleString("de-DE")+" €", data:umsatzData, d:delta(latest?.umsatz,prev?.umsatz), dc:deltaColor(latest?.umsatz,prev?.umsatz), color:"rgba(16,185,129,0.7)" },
      { label:"Kunden", value:latest?.kunden||0, data:kundenData, d:delta(latest?.kunden,prev?.kunden), dc:deltaColor(latest?.kunden,prev?.kunden), color:"rgba(59,130,246,0.7)" },
      { label:"Ausgaben", value:(latest?.ausgaben||0).toLocaleString("de-DE")+" €", data:ausgabenData, d:delta(latest?.ausgaben,prev?.ausgaben), dc:deltaColor(latest?.ausgaben,prev?.ausgaben,true), color:"rgba(245,158,11,0.7)" },
      { label:"Leads", value:latest?.leads||0, data:leadsData, d:delta(latest?.leads,prev?.leads), dc:deltaColor(latest?.leads,prev?.leads), color:"rgba(168,85,247,0.7)" }
    ];

    return React.createElement("div", { className:"space-y-6" },
      React.createElement("div", { className:"grid grid-cols-2 md:grid-cols-4 gap-4" }, kpiCards.map(function(kpi: any) {
        return React.createElement(GlassCard, { key:kpi.label, className:"p-4" },
          React.createElement("p", { className:"text-xs text-white/40 mb-1" }, kpi.label),
          React.createElement("div", { className:"flex items-end justify-between gap-2" },
            React.createElement("div", null,
              React.createElement("p", { className:"text-lg font-medium text-white" }, kpi.value),
              kpi.d && React.createElement("span", { className:"text-xs "+kpi.dc }, kpi.d)),
            React.createElement(Sparkline, { data:kpi.data, width:60, height:24, color:kpi.color })));
      })),

      React.createElement(GlassCard, { className:"p-5" },
        React.createElement("h3", { className:"text-white font-medium mb-4" }, "KPIs eintragen"),
        React.createElement("p", { className:"text-xs text-white/40 mb-3" }, "Woche vom "+getWeekStart()),
        React.createElement("div", { className:"grid grid-cols-2 md:grid-cols-4 gap-4" },
          ["umsatz","kunden","ausgaben","leads"].map(function(key: string) {
            var labels: any = {umsatz:"Umsatz (€)",kunden:"Kunden",ausgaben:"Ausgaben (€)",leads:"Leads"};
            return React.createElement("div", { key:key },
              React.createElement("label", { className:"text-xs text-white/40 mb-1 block" }, labels[key]),
              React.createElement("input", { type:"number", value:kpiForm[key], onChange:function(e: any){setKpiForm(function(p: any){var n=Object.assign({},p); n[key]=parseInt(e.target.value)||0; return n;})}, className:"w-full rounded-xl p-2.5 text-sm text-white outline-none", style:{background:"var(--bg-input)",border:"1px solid var(--border-10)"} }));
          })),
        React.createElement("div", { className:"flex justify-end mt-4 gap-3" },
          kpiSaved && React.createElement("span", { className:"text-xs text-emerald-400 flex items-center gap-1" }, React.createElement(Check,{size:12}), "Gespeichert!"),
          React.createElement(PrimaryButton, { onClick:handleSaveKPI },
            React.createElement(Save, { size:14 }), " Speichern"))));
  };

  var renderDeadlines = function() {
    if (!dlGenerated && !dlGenerating) return React.createElement("div", { className:"text-center py-12" },
      React.createElement("div", { className:"w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4", style:{background:"var(--icon-gradient)",border:"1px solid var(--border-30)"} },
        React.createElement(CalendarCheck, { size:28, className:"text-white/60" })),
      React.createElement("h3", { className:"text-lg text-white mb-2" }, "Fristen & Pflichttermine"),
      React.createElement("p", { className:"text-white/50 text-sm mb-6 max-w-md mx-auto" }, "Die KI erstellt alle relevanten Fristen basierend auf deiner Rechtsform, Branche und Bundesland."),
      React.createElement(PrimaryButton, { onClick:handleGenerateDeadlines, className:"px-8" },
        React.createElement(Sparkles, { size:14 }), " Fristen generieren"));

    if (dlGenerating) return React.createElement("div", { className:"text-center py-16" },
      React.createElement("div", { className:"w-12 h-12 border-2 border-emerald-400/20 border-t-emerald-400 rounded-full animate-spin mx-auto mb-4" }),
      React.createElement("p", { className:"text-white/70" }, "Erstelle Pflichttermine..."));

    var today = new Date().toISOString().split("T")[0];
    var catColors: any = { steuer:"border-blue-400/30 bg-blue-500/10 text-blue-300/70", recht:"border-amber-400/30 bg-amber-500/10 text-amber-300/70", versicherung:"border-purple-400/30 bg-purple-500/10 text-purple-300/70", meldung:"border-emerald-400/30 bg-emerald-500/10 text-emerald-300/70", branche:"border-pink-400/30 bg-pink-500/10 text-pink-300/70" };
    var catLabels: any = { steuer:"Steuer", recht:"Recht", versicherung:"Versicherung", meldung:"Meldung", branche:"Branche" };
    var upcoming = deadlines.filter(function(d: any){return !d.completed}).sort(function(a: any,b: any){return a.due_date>b.due_date?1:-1});
    var done = deadlines.filter(function(d: any){return d.completed});
    var overdue = upcoming.filter(function(d: any){return d.due_date<today}).length;

    return React.createElement("div", { className:"space-y-4" },
      React.createElement("div", { className:"flex items-center justify-between" },
        React.createElement("div", { className:"flex items-center gap-3" },
          React.createElement("span", { className:"text-sm text-white/50" }, upcoming.length+" offen"),
          overdue > 0 && React.createElement("span", { className:"text-xs px-2 py-1 rounded-full bg-red-500/15 text-red-300 border border-red-400/20" }, overdue+" überfällig"),
          React.createElement("span", { className:"text-sm text-white/30" }, done.length+" erledigt")),
        React.createElement("button", { onClick:function(){setDlGenerated(false);setDeadlines([])}, className:"text-xs text-white/30 hover:text-white/50 underline" }, "Neu generieren")),
      React.createElement("div", { className:"space-y-2" }, upcoming.map(function(dl: any, idx: number) {
        var isOverdue = dl.due_date < today;
        var isSoon = !isOverdue && dl.due_date <= new Date(Date.now()+7*86400000).toISOString().split("T")[0];
        return React.createElement(GlassCard, { key:dl.id||idx, className:"p-4 "+(isOverdue?"border-red-400/20":"") },
          React.createElement("div", { className:"flex items-start gap-3" },
            React.createElement("button", { onClick:function(){handleToggleDeadline(dl)}, className:"mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all border-white/20 hover:border-emerald-400" }),
            React.createElement("div", { className:"flex-1 min-w-0" },
              React.createElement("div", { className:"flex items-center gap-2 flex-wrap" },
                React.createElement("p", { className:"text-sm font-medium text-white/90" }, dl.title),
                dl.category && React.createElement("span", { className:"text-xs px-2 py-0.5 rounded-full border "+(catColors[dl.category]||"") }, catLabels[dl.category]||dl.category),
                dl.recurrence && dl.recurrence !== "once" && React.createElement("span", { className:"text-xs text-white/25" }, "🔄 "+dl.recurrence)),
              dl.description && React.createElement("p", { className:"text-xs text-white/40 mt-1" }, dl.description)),
            React.createElement("span", { className:"text-xs flex-shrink-0 font-medium "+(isOverdue?"text-red-400":isSoon?"text-amber-400":"text-white/30") }, new Date(dl.due_date+"T00:00:00").toLocaleDateString("de-DE",{day:"numeric",month:"short"}))));
      })),
      done.length > 0 && React.createElement("details", { className:"mt-4" },
        React.createElement("summary", { className:"text-xs text-white/25 cursor-pointer hover:text-white/40" }, done.length+" erledigte Fristen"),
        React.createElement("div", { className:"space-y-2 mt-2" }, done.map(function(dl: any,i: number) {
          return React.createElement(GlassCard, { key:i, className:"p-3 opacity-50" },
            React.createElement("div", { className:"flex items-center gap-2" },
              React.createElement(Check, { size:14, className:"text-emerald-400" }),
              React.createElement("span", { className:"text-xs text-white/40 line-through" }, dl.title)));
        }))));
  };

  var renderMeilensteine = function() {
    if (msGenerating && msMerged.length === 0) return React.createElement("div", { className:"text-center py-12" },
      React.createElement("div", { className:"w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center", style:{background:"var(--icon-gradient)",border:"1px solid var(--border-15)"} },
        React.createElement(Sparkles, { size:28, className:"text-white/60 animate-pulse" })),
      React.createElement("h2", { className:"text-xl text-white mb-3" }, "Deine Roadmap wird erstellt"),
      React.createElement("p", { className:"text-white/40 text-sm mb-6 max-w-md mx-auto" }, "Die KI analysiert dein Startup-Profil und erstellt eine personalisierte 90-Tage-Roadmap..."),
      React.createElement("div", { className:"flex items-center justify-center gap-2" },
        React.createElement(Loader2, { size:16, className:"animate-spin text-white/40" }),
        React.createElement("span", { className:"text-sm text-white/40" }, "Wird generiert...")));

    if (!profile || !profile.onboarding_complete) return React.createElement("div", { className:"text-center py-12" },
      React.createElement(Target, { size:40, className:"mx-auto mb-4 text-white/20" }),
      React.createElement("p", { className:"text-white/40 text-sm" }, "Starte das Onboarding, um deine Roadmap zu erstellen."));

    if (msMerged.length === 0 && !msGenerating) return React.createElement("div", { className:"text-center py-12" },
      React.createElement(Target, { size:40, className:"mx-auto mb-4 text-white/20" }),
      React.createElement("p", { className:"text-white/40 text-sm mb-4" }, "Noch keine Roadmap vorhanden."),
      React.createElement(PrimaryButton, { onClick:handleRegenerate }, React.createElement(Sparkles,{size:14}), " Roadmap generieren"));

    var totalTasks = msMerged.length;
    var doneTasks = msMerged.filter(function(t: any) { return msCompleted[t.id]; }).length;
    var progress = totalTasks > 0 ? Math.round((doneTasks/totalTasks)*100) : 0;
    var tasksByWeek: any[] = [];
    for (var w = 1; w <= 12; w++) { var wt = msMerged.filter(function(t: any){return t.week===w}); if(wt.length>0) tasksByWeek.push({week:w,tasks:wt}); }
    var milestones = [{pct:25,label:"Grundlagen"},{pct:50,label:"Gründung ready"},{pct:75,label:"Förderung & Setup"},{pct:100,label:"Startklar"}];

    return React.createElement("div", { className:"space-y-6" },
      React.createElement("div", { className:"flex items-start justify-between" },
        React.createElement("div", null,
          React.createElement("h2", { className:"text-xl font-medium text-white mb-1" }, "90-Tage-Roadmap"),
          React.createElement("div", { className:"flex items-center gap-2" },
            React.createElement(Sparkles, { size:12, className:"text-white/30" }),
            React.createElement("p", { className:"text-white/40 text-xs uppercase tracking-widest font-medium" }, "KI-personalisiert für dein Startup"))),
        React.createElement("button", { onClick:handleRegenerate, disabled:msGenerating, className:"flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all border border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.03] " + (msGenerating ? "text-white/20" : "text-white/40 hover:text-white/60") },
          msGenerating ? React.createElement(Loader2, { size:12, className:"animate-spin" }) : React.createElement(Sparkles, { size:12 }), msGenerating ? "Generiert..." : "Neu generieren")),

      msError && React.createElement("div", { className:"p-3 rounded-lg text-xs text-amber-300/80 border border-amber-400/20", style:{background:"var(--warning-bg)"} }, msError),

      React.createElement(GlassCard, { className:"p-6", style:{borderColor:"var(--border-25)",background:"var(--surface-5)"} },
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

      React.createElement("div", { className:"space-y-4" }, tasksByWeek.map(function(wd: any) {
        return React.createElement(RoadmapWeekBlock, { key:wd.week, week:wd.week, tasks:wd.tasks, completedTasks:msCompleted, onToggle:msToggleTask, onNavigate:function(id: string){ if(onNavigate) onNavigate(id); }, onAddTask:msAddTask, onDeleteTask:msDeleteTask });
      })));
  };

  var renderMeeting = function() {
    var meetingTypes = ["Bankgespräch","Investoren-Pitch","Steuerberater","Arbeitsagentur (Gründungszuschuss)","Notar (Gesellschaftsgründung)","IHK/HWK-Beratung","Fördermittelgespräch","Kundenpräsentation"];

    if (mtResult) return React.createElement("div", { className:"space-y-4" },
      React.createElement("button", { onClick:function(){setMtResult(null)}, className:"text-sm text-white/40 hover:text-white/60 flex items-center gap-1" }, React.createElement(ChevronLeft,{size:14}), " Zurück"),
      React.createElement(GlassCard, { className:"p-5" },
        React.createElement("div", { className:"flex items-center gap-2 mb-1" },
          React.createElement(Sparkles, { size:14, className:"text-white/60" }),
          React.createElement("p", { className:"text-xs text-white/40 uppercase tracking-wider" }, "KI-Vorbereitung")),
        React.createElement("h3", { className:"text-xl text-white font-medium mb-2" }, mtResult.meeting_titel),
        React.createElement("p", { className:"text-sm text-white/60" }, mtResult.zusammenfassung)),

      React.createElement(GlassCard, { className:"p-5" },
        React.createElement("p", { className:"text-xs text-white/40 uppercase tracking-wider mb-3" }, "Gesprächspunkte"),
        React.createElement("div", { className:"space-y-3" }, (mtResult.talking_points||[]).map(function(tp: any,i: number) {
          return React.createElement("div", { key:i, className:"flex items-start gap-3" },
            React.createElement("div", { className:"w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0", style:{background:"var(--surface-20)",color:"var(--text-default)"} }, i+1),
            React.createElement("div", null,
              React.createElement("p", { className:"text-sm text-white/70 font-medium" }, tp.punkt),
              React.createElement("p", { className:"text-xs text-white/45 mt-0.5" }, tp.detail)));
        }))),

      mtResult.key_numbers && React.createElement(GlassCard, { className:"p-5" },
        React.createElement("p", { className:"text-xs text-white/40 uppercase tracking-wider mb-3" }, "Wichtige Kennzahlen"),
        React.createElement("div", { className:"grid grid-cols-2 md:grid-cols-3 gap-3" }, mtResult.key_numbers.map(function(kn: any,i: number) {
          return React.createElement("div", { key:i, className:"p-3 rounded-xl", style:{background:"var(--surface-6)"} },
            React.createElement("p", { className:"text-xs text-white/40" }, kn.label),
            React.createElement("p", { className:"text-lg font-medium text-white" }, kn.value),
            React.createElement("p", { className:"text-xs text-white/30 mt-0.5" }, kn.kontext));
        }))),

      mtResult.erwartete_fragen && React.createElement(GlassCard, { className:"p-5" },
        React.createElement("p", { className:"text-xs text-white/40 uppercase tracking-wider mb-3" }, "Erwartete Fragen & Antworten"),
        React.createElement("div", { className:"space-y-3" }, mtResult.erwartete_fragen.map(function(fq: any,i: number) {
          return React.createElement("div", { key:i, className:"p-3 rounded-xl", style:{background:"var(--surface-5)"} },
            React.createElement("p", { className:"text-sm text-white/70 font-medium" }, "❓ "+fq.frage),
            React.createElement("p", { className:"text-xs text-white/50 mt-1" }, "→ "+fq.antwort_vorschlag));
        }))),

      mtResult.dos_and_donts && React.createElement("div", { className:"grid md:grid-cols-2 gap-4" },
        React.createElement(GlassCard, { className:"p-4" },
          React.createElement("p", { className:"text-xs text-emerald-300/60 uppercase tracking-wider mb-2" }, "✓ Do's"),
          React.createElement("div", { className:"space-y-1" }, (mtResult.dos_and_donts.dos||[]).map(function(d: string,i: number) { return React.createElement("p",{key:i,className:"text-xs text-white/55"},"✓ "+d); }))),
        React.createElement(GlassCard, { className:"p-4" },
          React.createElement("p", { className:"text-xs text-red-300/60 uppercase tracking-wider mb-2" }, "✗ Don'ts"),
          React.createElement("div", { className:"space-y-1" }, (mtResult.dos_and_donts.donts||[]).map(function(d: string,i: number) { return React.createElement("p",{key:i,className:"text-xs text-white/55"},"✗ "+d); })))),

      mtResult.checkliste && React.createElement(GlassCard, { className:"p-5" },
        React.createElement("p", { className:"text-xs text-white/40 uppercase tracking-wider mb-3" }, "Checkliste vor dem Meeting"),
        React.createElement("div", { className:"space-y-2" }, mtResult.checkliste.map(function(c: string,i: number) {
          return React.createElement("div", { key:i, className:"flex items-center gap-2 text-sm text-white/60" },
            React.createElement("div", { className:"w-4 h-4 rounded border border-white/20 flex-shrink-0" }), c);
        }))));

    return React.createElement("div", { className:"space-y-6" },
      React.createElement(GlassCard, { className:"p-5" },
        React.createElement("h3", { className:"text-white font-medium mb-4" }, "Meeting-Vorbereitung"),
        React.createElement("p", { className:"text-sm text-white/50 mb-4" }, "Wähle den Meeting-Typ und die KI bereitet dich optimal vor — mit Talking Points, Kennzahlen und erwarteten Fragen."),
        React.createElement("div", { className:"grid grid-cols-2 md:grid-cols-4 gap-2 mb-4" }, meetingTypes.map(function(type: string) {
          var sel = mtType === type;
          return React.createElement("button", { key:type, onClick:function(){setMtType(type)}, className:"px-3 py-2.5 rounded-xl text-xs font-medium transition-all border text-left", style:{borderColor:sel?"var(--border-70)":"var(--border-10)",background:sel?"var(--surface-15)":"var(--surface-3)"} }, type);
        })),
        React.createElement("textarea", { value:mtNotes, onChange:function(e: any){setMtNotes(e.target.value)}, placeholder:"Optionale Notizen (z.B. Gesprächspartner, spezielle Themen...)", rows:2, className:"w-full rounded-xl p-3 text-sm text-white placeholder-white/25 outline-none resize-none mb-3", style:{background:"var(--bg-input)",border:"1px solid var(--border-10)"} }),
        React.createElement("div", { className:"flex justify-end" },
          React.createElement(PrimaryButton, { onClick:handleMeetingPrep, disabled:!mtType||mtLoading },
            mtLoading ? React.createElement(React.Fragment,null,React.createElement(Loader2,{size:14,className:"animate-spin"})," Bereite vor...") :
            React.createElement(React.Fragment,null,React.createElement(Sparkles,{size:14})," Vorbereitung starten")))));
  };

  return React.createElement("div", { className:"max-w-5xl mx-auto py-10 px-6" },
    React.createElement("div", { className:"mb-7" },
      React.createElement("h1", { className:"text-3xl font-medium text-white mb-1" }, "Dashboard"),
      React.createElement("p", { className:"text-white/45 text-sm" }, "Roadmap, Wochencheck, KPIs, Fristen & Meeting-Vorbereitung an einem Ort")),

    React.createElement(NextActionBanner, { page:"dashboard", userData:profile, onNavigate:onNavigate, context:{ has_checkins: ciHistory.length > 0, has_kpis: kpis.length > 0, has_deadlines: deadlines.length > 0, has_meilensteine: (msTasks||[]).length > 0 } }),

    React.createElement("div", { className:"flex gap-1 mb-8 overflow-x-auto pb-1" }, sections.map(function(s: any) {
      var sel = section === s.id;
      return React.createElement("button", { key:s.id, onClick:function(){setSection(s.id)}, className:"flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border whitespace-nowrap", style:{borderColor:sel?"var(--border-70)":"var(--border-8)",background:sel?"var(--surface-15)":"transparent",color:sel?"var(--text-default)":"var(--text-muted)"} },
        React.createElement(s.Icon, { size:14 }), s.label);
    })),

    section === "checkin" && renderCheckin(),
    section === "kpis" && renderKPIs(),
    section === "deadlines" && renderDeadlines(),
    section === "meilensteine" && renderMeilensteine(),
    section === "meeting" && renderMeeting());
};
