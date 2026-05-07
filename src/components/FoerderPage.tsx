/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/lib/auth'
import { supabase, SUPABASE_URL } from '@/lib/supabase'
import { aiFetch } from '@/lib/aiFetch'
import { db } from '@/lib/db'
import { GlassCard, PrimaryButton, SecondaryButton, NextActionBanner } from '@/components/ui'
import { Search, Sparkles, TrendingUp, ChevronRight, ChevronDown, ArrowRight, AlertCircle, Loader2, Users2, Award } from '@/components/icons'
import { FinanzplanInline } from '@/components/FinanzplanInline'

export const FoerderPage = function({ userData, onNavigate }: { userData: any; onNavigate: (page: string) => void }) {
  const { user } = useAuth();
  var analysisState = useState<any>(null); var analysis = analysisState[0]; var setAnalysis = analysisState[1];
  var loadState = useState(true); var isLoading = loadState[0]; var setIsLoading = loadState[1];
  var genState = useState(false); var isGenerating = genState[0]; var setIsGenerating = genState[1];
  var filterState = useState("alle"); var tagFilter = filterState[0]; var setTagFilter = filterState[1];
  var searchState = useState(""); var searchTerm = searchState[0]; var setSearchTerm = searchState[1];
  var savedState = useState<any>({}); var savedIds = savedState[0]; var setSavedIds = savedState[1];
  var profileState = useState<any>(null); var profile = profileState[0]; var setProfile = profileState[1];
  var expandState = useState<any>({}); var expanded = expandState[0]; var setExpanded = expandState[1];
  var loadStepState = useState(0); var loadStep = loadStepState[0]; var setLoadStep = loadStepState[1];
  var errorState = useState(""); var error = errorState[0]; var setError = errorState[1];
  var fpShowState = useState(false); var showFpGenerator = fpShowState[0]; var setShowFpGenerator = fpShowState[1];
  var invShowState = useState(false); var showInvestoren = invShowState[0]; var setShowInvestoren = invShowState[1];

  var SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  var loadingSteps = ["Analysiere dein Gründerprofil...", "Suche bundesweite Förderprogramme...", "Prüfe Landesförderungen...", "Bewerte Passung für dein Startup...", "Erstelle personalisierte Tipps..."];

  useEffect(function() {
    var handler = function(e: any) {
      if (!e.detail || e.detail.page !== "finanzierung") return;
      if (e.detail.action === "finanzplan") { setShowFpGenerator(true); setShowInvestoren(false); }
      else if (e.detail.action === "investoren") { setShowInvestoren(true); setShowFpGenerator(false); }
      else if (e.detail.action === "foerder") { setShowFpGenerator(false); setShowInvestoren(false); }
    };
    window.addEventListener("subnav", handler);
    return function() { window.removeEventListener("subnav", handler); };
  }, []);

  useEffect(function() {
    if (!user) return;
    (async function() {
      var ob = await db.getOnboarding(user.id);
      setProfile(ob);
      var cached = await supabase.from("profiles").select("foerder_ai_results").eq("id", user.id).single();
      if (cached.data && cached.data.foerder_ai_results) {
        var c = cached.data.foerder_ai_results;
        setAnalysis(typeof c === "string" ? JSON.parse(c) : c);
      }
      var ct = await db.getCompletedTasks(user.id);
      var sv: any = {};
      Object.keys(ct).forEach(function(k: string) { if (k.startsWith("foerder_saved_")) sv[k.replace("foerder_saved_","")] = true; });
      setSavedIds(sv);
      setIsLoading(false);
    })();
  }, [user]);

  useEffect(function() {
    if (!isGenerating) return;
    setLoadStep(0);
    var iv = setInterval(function() { setLoadStep(function(s: number) { return s < loadingSteps.length - 1 ? s + 1 : s; }); }, 3500);
    return function() { clearInterval(iv); };
  }, [isGenerating]);

  var toggleSaved = function(idx: number) {
    var key = "foerder_ai_"+idx;
    var isSaved = savedIds[key];
    setSavedIds(function(p: any) { var n = Object.assign({}, p); if (n[key]) delete n[key]; else n[key] = true; return n; });
    if (user) db.toggleTask(user.id, "foerder_saved_"+key, !isSaved);
  };

  var toggleExpand = function(idx: number) {
    setExpanded(function(p: any) { var n = Object.assign({}, p); n[idx] = !n[idx]; return n; });
  };

  var handleGenerate = async function() {
    setIsGenerating(true);
    setError("");
    try {
      var session = await supabase.auth.getSession();
      var token = session?.data?.session?.access_token || SUPABASE_ANON_KEY;
      var knownProgs: any[] = [];
      try {
        var dbProgs = await db.getFoerderprogramme(profile);
        knownProgs = (dbProgs || []).map(function(p: any) { return { name:p.name, region:p.region, tag:p.tag, summe:p.summe, link:p.link, phasen:p.phasen, beschreibung:p.beschreibung }; });
      } catch(e) { console.log("No DB programs:", e); }

      var resp = await aiFetch(SUPABASE_URL + "/functions/v1/foerder-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token, "apikey": SUPABASE_ANON_KEY },
        body: JSON.stringify({ profile: profile || {}, known_programs: knownProgs })
      });
      if (!resp.ok) throw new Error("HTTP " + resp.status);
      var data = await resp.json();
      if (data.error) throw new Error(data.error);
      setAnalysis(data.analysis);
      var saveRes = await supabase.from("profiles").upsert({ id:user!.id, foerder_ai_results: data.analysis }, { onConflict:"id" });
      if (saveRes.error) {
        console.error("[Foerder] Cache-Fehler:", saveRes.error);
        var retry = await supabase.from("profiles").update({ foerder_ai_results: JSON.stringify(data.analysis) }).eq("id", user!.id);
        if (retry.error) console.error("[Foerder] Retry-Fehler:", retry.error);
      }
    } catch (e: any) {
      console.error("Foerder AI error:", e);
      setError("Fehler: " + e.message);
    }
    setIsGenerating(false);
  };

  var tagColors: any = {"Stipendium":"var(--surface-30)","Kredit":"rgba(59,130,246,0.3)","Zuschuss":"var(--surface-30)","Beteiligung":"rgba(245,158,11,0.3)","Beratung":"rgba(168,85,247,0.3)"};
  var tags = ["alle","Stipendium","Kredit","Zuschuss","Beteiligung","Beratung"];

  var filtered = useMemo(function() {
    if (!analysis || !analysis.programme) return [];
    var list = analysis.programme.slice();
    if (tagFilter !== "alle") list = list.filter(function(p: any) { return p.typ === tagFilter; });
    if (searchTerm.length > 1) {
      var s = searchTerm.toLowerCase();
      list = list.filter(function(p: any) { return (p.name||"").toLowerCase().includes(s) || (p.beschreibung||"").toLowerCase().includes(s); });
    }
    return list;
  }, [analysis, tagFilter, searchTerm]);

  if (isLoading) return React.createElement("div", { className:"max-w-4xl mx-auto py-20 px-6 text-center" },
    React.createElement(Loader2, { size:32, className:"animate-spin text-white/60 mx-auto mb-4" }),
    React.createElement("p", { className:"text-white/40" }, "Lade Förderdaten..."));

  if (showInvestoren) {
    return React.createElement("div", { className:"max-w-3xl mx-auto py-10 px-6" },
      React.createElement("button", { onClick:function(){setShowInvestoren(false)}, className:"mb-6 flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors" }, React.createElement(ChevronRight,{size:16,className:"rotate-180"}), " Zurück"),
      React.createElement("div", { className:"text-center py-20" },
        React.createElement("div", { className:"w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6", style:{background:"var(--icon-gradient)",border:"1px solid var(--border-15)"} },
          React.createElement(Users2, { size:36, className:"text-white/60" })),
        React.createElement("h1", { className:"text-3xl font-medium text-white mb-3" }, "Investoren"),
        React.createElement("p", { className:"text-white/45 text-sm max-w-md mx-auto" }, "Eine kuratierte Investoren-Datenbank mit passenden VCs, Business Angels und Family Offices kommt bald — inklusive KI-Matching anhand deines Profils."),
        React.createElement("span", { className:"inline-block mt-6 text-[10px] uppercase tracking-widest text-white/30 px-3 py-1 rounded-full border border-white/10" }, "Coming soon")));
  }

  if (showFpGenerator) {
    return React.createElement("div", { className:"max-w-3xl mx-auto py-10 px-6" },
      React.createElement("button", { onClick:function(){setShowFpGenerator(false)}, className:"mb-6 flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors" }, React.createElement(ChevronRight,{size:16,className:"rotate-180"}), " Zurück"),
      React.createElement("div", { className:"flex items-center gap-3 mb-8" },
        React.createElement("div", { className:"w-12 h-12 rounded-xl flex items-center justify-center", style:{background:"var(--surface-15)"} }, React.createElement(TrendingUp,{size:24,className:"text-white/60"})),
        React.createElement("div", null,
          React.createElement("h1", { className:"text-2xl font-medium text-white" }, "Finanzplan erstellen"),
          React.createElement("p", { className:"text-sm text-white/40" }, "3 Schritte — je genauer deine Zahlen, desto realistischer die Prognose"))),
      React.createElement(GlassCard, { className:"p-6" },
        React.createElement(FinanzplanInline, { onClose:function(){setShowFpGenerator(false)}, userData:profile })));
  }

  if (!analysis && !isGenerating) return React.createElement("div", { className:"max-w-4xl mx-auto py-10 px-6" },
    React.createElement(NextActionBanner, { page:"finanzierung", userData:userData||profile, onNavigate:onNavigate, context:{ has_foerder: false, has_finanzplan: false } }),
    React.createElement("h1", { className:"text-3xl font-medium text-white mb-2" }, "Förderprogramme"),
    React.createElement("p", { className:"text-white/45 text-sm mb-8" }, "Lass die KI passende Förderprogramme für dein Startup finden"),
    React.createElement("div", { className:"max-w-lg mx-auto text-center py-12" },
      React.createElement("div", { className:"w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6", style:{background:"var(--icon-gradient)",border:"1px solid var(--border-30)"} },
        React.createElement(Award, { size:36, className:"text-white/60" })),
      React.createElement("h2", { className:"text-xl font-medium text-white mb-3" }, "KI-gestützte Fördersuche"),
      React.createElement("p", { className:"text-white/50 text-sm mb-2" }, "Basierend auf deinem Profil sucht die KI nach:"),
      React.createElement("div", { className:"flex flex-wrap justify-center gap-2 mb-6" },
        React.createElement("span", { className:"text-xs px-3 py-1.5 rounded-full bg-white/5 text-white/50 border border-white/10" }, "Bundesprogramme"),
        React.createElement("span", { className:"text-xs px-3 py-1.5 rounded-full bg-white/5 text-white/50 border border-white/10" }, "Landesförderungen"+(profile?.bundesland?" "+profile.bundesland:"")),
        React.createElement("span", { className:"text-xs px-3 py-1.5 rounded-full bg-white/5 text-white/50 border border-white/10" }, "Stipendien & Zuschüsse"),
        React.createElement("span", { className:"text-xs px-3 py-1.5 rounded-full bg-white/5 text-white/50 border border-white/10" }, "KfW & Kredite")),
      error && React.createElement("p", { className:"text-red-400 text-sm mb-4" }, error),
      React.createElement("div", { className:"flex flex-wrap gap-3 justify-center" },
        React.createElement(PrimaryButton, { onClick:handleGenerate, className:"px-8 py-3" },
          React.createElement(Sparkles, { size:16 }), " Förderprogramme finden"),
        React.createElement(SecondaryButton, { onClick:function(){setShowFpGenerator(true)}, className:"px-8 py-3" },
          React.createElement(TrendingUp, { size:16 }), " Finanzplan erstellen"))));

  if (isGenerating) return React.createElement("div", { className:"max-w-4xl mx-auto py-10 px-6" },
    React.createElement("h1", { className:"text-3xl font-medium text-white mb-2" }, "Förderprogramme"),
    React.createElement("p", { className:"text-white/45 text-sm mb-8" }, "KI sucht passende Programme..."),
    React.createElement("div", { className:"max-w-md mx-auto text-center py-16" },
      React.createElement("div", { className:"w-16 h-16 border-2 border-emerald-400/20 border-t-emerald-400 rounded-full animate-spin mx-auto mb-6" }),
      React.createElement("p", { className:"text-white/70 font-medium mb-2" }, loadingSteps[loadStep]),
      React.createElement("div", { className:"w-48 h-1 rounded-full mx-auto", style:{background:"var(--surface-8)"} },
        React.createElement("div", { className:"h-1 rounded-full transition-all duration-1000", style:{width:((loadStep+1)/loadingSteps.length)*100+"%",background:"var(--accent-gradient)"} }))));

  var savedCount = Object.keys(savedIds).length;
  var topCount = (analysis.programme||[]).filter(function(p: any){return p.passung_prozent>=70}).length;

  return React.createElement("div", { className:"max-w-4xl mx-auto py-10 px-6 space-y-6" },
    React.createElement(NextActionBanner, { page:"finanzierung", userData:userData||profile, onNavigate:onNavigate, context:{ has_foerder: true, programme_count: (analysis.programme||[]).length } }),
    React.createElement("div", { className:"flex items-start justify-between flex-wrap gap-4" },
      React.createElement("div", null,
        React.createElement("h1", { className:"text-3xl font-medium text-white mb-1" }, "Deine Förderprogramme"),
        React.createElement("p", { className:"text-white/45 text-sm" }, (analysis.programme||[]).length+" Programme gefunden · "+topCount+" Top-Matches · "+savedCount+" gemerkt")),
      React.createElement("div", { className:"flex items-center gap-3" },
        React.createElement("button", { onClick:function(){setShowFpGenerator(true)}, className:"flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all hover:bg-white/5", style:{borderColor:"var(--border-15)",color:"var(--text-default)"} },
          React.createElement(TrendingUp, { size:14 }), "Finanzplan erstellen"),
        React.createElement("button", { onClick:handleGenerate, disabled:isGenerating, className:"flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all hover:bg-white/5", style:{borderColor:"var(--border-15)",color:"var(--text-default)"} },
          React.createElement(Sparkles, { size:14 }), "Neu suchen"))),

    analysis.profil_zusammenfassung && React.createElement(GlassCard, { className:"p-4" },
      React.createElement("div", { className:"flex items-start gap-3" },
        React.createElement("div", { className:"w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", style:{background:"var(--surface-12)"} },
          React.createElement("span", { className:"text-white/40 text-xs" }, "👤")),
        React.createElement("p", { className:"text-sm text-white/60 leading-relaxed" }, analysis.profil_zusammenfassung))),

    analysis.strategie && React.createElement(GlassCard, { className:"p-5" },
      React.createElement("div", { className:"flex items-center gap-2 mb-3" },
        React.createElement(Sparkles, { size:14, className:"text-white/60" }),
        React.createElement("p", { className:"text-xs text-white/40 uppercase tracking-wider" }, "Förderstrategie")),
      React.createElement("p", { className:"text-sm text-white/65 leading-relaxed" }, analysis.strategie)),

    React.createElement("div", { className:"flex flex-wrap items-center gap-3" },
      React.createElement("div", { className:"relative flex-1 min-w-[250px]" },
        React.createElement(Search, { size:16, className:"absolute left-3 top-1/2 -translate-y-1/2 text-white/30" }),
        React.createElement("input", { value:searchTerm, onChange:function(e: any){setSearchTerm(e.target.value)}, placeholder:"Programm suchen...", className:"w-full rounded-xl p-3 pl-10 text-sm text-white placeholder-white/25 outline-none transition-all", style:{background:"var(--bg-input)",border:"1px solid var(--border-10)"} }))),

    React.createElement("div", { className:"flex flex-wrap gap-2" }, tags.map(function(t: string) {
      var isSel = tagFilter === t;
      return React.createElement("button", { key:t, onClick:function(){setTagFilter(t)}, className:"px-4 py-2 rounded-xl text-sm font-medium transition-all border", style:{
        borderColor:isSel?"var(--border-80)":"var(--border-12)",
        background:isSel?"var(--surface-15)":"var(--surface-3)",
        color:"var(--text-default)"
      }}, t === "alle" ? "Alle" : t);
    })),

    filtered.length === 0 ?
      React.createElement("div", { className:"text-center py-12" },
        React.createElement(Search, { size:40, className:"mx-auto mb-4 text-white/20" }),
        React.createElement("p", { className:"text-white/40" }, "Keine Programme gefunden.")) :
    React.createElement("div", { className:"space-y-4" }, filtered.map(function(p: any, idx: number) {
      var isSaved = savedIds["foerder_ai_"+idx];
      var isExp = expanded[idx];
      var passColor = p.passung_prozent >= 70 ? "text-emerald-400" : p.passung_prozent >= 40 ? "text-amber-400" : "text-white/40";

      return React.createElement(GlassCard, { key:idx, className:"p-6" },
        React.createElement("div", { className:"flex items-start justify-between mb-3 flex-wrap gap-2" },
          React.createElement("div", { className:"flex items-center gap-2 flex-wrap flex-1" },
            React.createElement("h3", { className:"text-white font-normal" }, p.name),
            React.createElement("span", { className:"text-xs px-2 py-0.5 rounded-full", style:{background:tagColors[p.typ]||"var(--surface-10)",color:"var(--text-high)"} }, p.typ),
            React.createElement("span", { className:"text-xs text-white/30" }, p.region),
            p.from_database && React.createElement("span", { className:"text-xs px-2 py-0.5 rounded-full border border-blue-400/20 bg-blue-500/10 text-blue-300/70" }, "Verifiziert"),
            !p.from_database && React.createElement("span", { className:"text-xs px-2 py-0.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 text-emerald-300/70 flex items-center gap-1" }, React.createElement(Sparkles,{size:9}), " KI-Fund")),
          React.createElement("div", { className:"flex items-center gap-3" },
            React.createElement("div", { className:"text-right" },
              React.createElement("p", { className:"text-xs text-white/40" }, "Passung"),
              React.createElement("p", { className:"text-sm font-medium "+passColor }, p.passung_prozent+"%")),
            React.createElement("button", { onClick:function(){toggleSaved(idx)}, className:"p-2 rounded-lg transition-all "+(isSaved?"bg-emerald-500/15 text-white/60":"text-white/30 hover:text-white/60 hover:bg-white/5") },
              React.createElement("svg", { xmlns:"http://www.w3.org/2000/svg", width:18, height:18, viewBox:"0 0 24 24", fill:isSaved?"currentColor":"none", stroke:"currentColor", strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round" },
                React.createElement("path", { d:"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" }))))),

        React.createElement("p", { className:"text-sm text-white/60 mb-3" }, p.beschreibung),

        p.passung_grund && React.createElement("div", { className:"p-3 rounded-xl mb-3", style:{background:"var(--surface-7)",border:"1px solid var(--border-15)"} },
          React.createElement("p", { className:"text-xs text-white/40 mb-1" }, "Warum passend für dich?"),
          React.createElement("p", { className:"text-xs text-white/65 leading-relaxed" }, p.passung_grund)),

        React.createElement("button", { onClick:function(){toggleExpand(idx)}, className:"flex items-center gap-2 text-xs text-white/40 hover:text-white/60 transition-colors mb-3" },
          isExp ? React.createElement(ChevronDown, { size:14 }) : React.createElement(ChevronRight, { size:14 }),
          isExp ? "Details ausblenden" : "Voraussetzungen & Antragstipps"),

        isExp && React.createElement("div", { className:"space-y-3 mb-4" },
          p.voraussetzungen && p.voraussetzungen.length > 0 && React.createElement("div", { className:"p-3 rounded-xl", style:{background:"var(--surface-5)"} },
            React.createElement("p", { className:"text-xs text-white/40 uppercase tracking-wider mb-2" }, "Voraussetzungen"),
            React.createElement("div", { className:"space-y-1" }, p.voraussetzungen.map(function(v: string, vi: number) {
              return React.createElement("div", { key:vi, className:"flex items-start gap-2 text-xs text-white/55" },
                React.createElement("span", { className:"text-white/30 mt-0.5" }, "•"), v);
            }))),
          p.antrag_tipps && p.antrag_tipps.length > 0 && React.createElement("div", { className:"p-3 rounded-xl", style:{background:"rgba(16,185,129,0.05)",border:"1px solid rgba(16,185,129,0.15)"} },
            React.createElement("p", { className:"text-xs text-emerald-300/60 uppercase tracking-wider mb-2" }, "Antragstipps für dein Startup"),
            React.createElement("div", { className:"space-y-1" }, p.antrag_tipps.map(function(t: string, ti: number) {
              return React.createElement("div", { key:ti, className:"flex items-start gap-2 text-xs text-white/60" },
                React.createElement("span", { className:"text-emerald-400 mt-0.5" }, "→"), t);
            }))),
          p.zeitrahmen && React.createElement("p", { className:"text-xs text-white/40" }, "⏱ "+p.zeitrahmen)),

        React.createElement("div", { className:"flex items-center justify-between pt-2", style:{borderTop:"1px solid var(--border-8)"} },
          React.createElement("span", { className:"text-xl font-medium text-white" }, p.summe),
          p.link && React.createElement("a", { href:p.link, target:"_blank", rel:"noopener noreferrer", className:"text-xs text-white/60 hover:text-white/50 flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all hover:bg-white/5", style:{borderColor:"var(--border-15)"} }, "Details & Antrag ", React.createElement(ArrowRight,{size:12}))));
    })),

    analysis.allgemeine_tipps && React.createElement(GlassCard, { className:"p-5" },
      React.createElement("p", { className:"text-xs text-white/40 uppercase tracking-wider mb-3" }, "Allgemeine Fördertipps"),
      React.createElement("div", { className:"space-y-2" }, analysis.allgemeine_tipps.map(function(t: string, i: number) {
        return React.createElement("div", { key:i, className:"flex items-start gap-2 text-sm text-white/60" },
          React.createElement("span", { className:"text-white/40 mt-0.5" }, "💡"), t);
      }))),

    analysis.naechste_schritte && React.createElement(GlassCard, { className:"p-5" },
      React.createElement("p", { className:"text-xs text-white/40 uppercase tracking-wider mb-3" }, "Nächste Schritte"),
      React.createElement("div", { className:"space-y-2" }, analysis.naechste_schritte.map(function(s: string, i: number) {
        return React.createElement("div", { key:i, className:"flex items-center gap-3 text-sm text-white/60" },
          React.createElement("div", { className:"w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0", style:{background:"var(--surface-20)",color:"var(--text-default)"} }, i+1), s);
      }))),

    React.createElement("div", { className:"rounded-xl p-4 flex items-start gap-3", style:{background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.15)"} },
      React.createElement(AlertCircle, { size:14, className:"text-amber-400 mt-0.5 flex-shrink-0" }),
      React.createElement("p", { className:"text-xs text-amber-300/70" }, React.createElement("strong",{className:"text-amber-300"},"Hinweis: "), "Förderprogramme ändern sich laufend. Prüfe Fristen und Voraussetzungen immer auf der offiziellen Website. KI-Ergebnisse können unvollständig sein.")),

    React.createElement("p", { className:"text-xs text-white/20 text-center" }, "Letzte Suche: "+new Date().toLocaleDateString("de-DE")));
};
