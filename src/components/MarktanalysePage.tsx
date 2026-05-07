'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { SUPABASE_URL } from '@/lib/supabase';
import { aiFetch } from '@/lib/aiFetch';
import { db } from '@/lib/db';
import {
  Search, TrendingUp, BarChart2, Target, Users2,
  Rocket, FileText, Sparkles, ChevronLeft, CheckCircle,
  AlertCircle, ExternalLink, Loader2
} from '@/components/icons';
import { GlassCard, PrimaryButton, SecondaryButton, NextActionBanner } from '@/components/ui';
import { BusinessplanInline } from '@/components/BusinessplanInline';

export function MarktanalysePage({ userData, onNavigate }: { userData: any; onNavigate: (page: string) => void }) {
  const { user } = useAuth();
  var analysisState = useState<any>(null); var analysis = analysisState[0]; var setAnalysis = analysisState[1];
  var loadingState = useState(false); var isLoading = loadingState[0]; var setIsLoading = loadingState[1];
  var errorState = useState(""); var error = errorState[0]; var setError = errorState[1];
  var cachedState = useState(false); var isCached = cachedState[0]; var setIsCached = cachedState[1];
  var sectionState = useState("overview"); var activeSection = sectionState[0]; var setActiveSection = sectionState[1];
  var loadStepState = useState(0); var loadStep = loadStepState[0]; var setLoadStep = loadStepState[1];
  var bpShowState = useState(false); var showBpGenerator = bpShowState[0]; var setShowBpGenerator = bpShowState[1];

  useEffect(function() {
    var handler = function(e: any) {
      if (!e.detail || e.detail.page !== "businessplan") return;
      if (e.detail.action === "businessplan") setShowBpGenerator(true);
      else if (e.detail.action === "marktanalyse") setShowBpGenerator(false);
    };
    window.addEventListener("subnav", handler);
    return function() { window.removeEventListener("subnav", handler); };
  }, []);

  useEffect(function() {
    if (!user) return;
    (async function() {
      try {
        var { data: cached } = await supabase.from("profiles").select("market_analysis").eq("id", user!.id).single();
        if (cached && cached.market_analysis) {
          setAnalysis(typeof cached.market_analysis === "string" ? JSON.parse(cached.market_analysis) : cached.market_analysis);
          setIsCached(true);
        }
      } catch(e) { console.log("[Marktanalyse] No cached analysis"); }
    })();
  }, [user]);

  var handleGenerate = async function() {
    if (!user) return;
    setIsLoading(true); setError(""); setAnalysis(null); setIsCached(false);
    try {
      var ob = userData || await db.getOnboarding(user!.id);
      var session = await supabase.auth.getSession();
      var token = session?.data?.session?.access_token || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      console.log("[Marktanalyse] Generating analysis...");
      var resp = await aiFetch(SUPABASE_URL + "/functions/v1/market-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token, "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! },
        body: JSON.stringify({
          pitch: ob?.pitch || "", problem: ob?.problem || "", zielgruppe: ob?.zielgruppe || "",
          branche: ob?.branche || "", phase: ob?.phase || "idee", geschaeftsmodell: ""
        })
      });
      var text = await resp.text();
      console.log("[Marktanalyse] Response status:", resp.status);
      var res: any;
      try { res = JSON.parse(text); } catch(e) { throw new Error("Ung\xfcltige Antwort: " + text.substring(0, 200)); }
      if (!resp.ok) throw new Error(res.error || "Fehler (Status " + resp.status + ")");
      if (res.analysis) {
        setAnalysis(res.analysis);
        var saveRes = await supabase.from("profiles").upsert({ id:user!.id, market_analysis: res.analysis }, { onConflict:"id" });
        if (saveRes.error) {
          console.error("[Marktanalyse] Cache-Fehler:", saveRes.error);
          var retry = await supabase.from("profiles").update({ market_analysis: JSON.stringify(res.analysis) }).eq("id", user!.id);
          if (retry.error) console.error("[Marktanalyse] Retry-Fehler:", retry.error);
          else console.log("[Marktanalyse] Retry erfolgreich");
        } else {
          console.log("[Marktanalyse] Analyse gespeichert");
        }
      } else throw new Error("Keine Analyse erhalten");
    } catch(e: any) {
      console.error("[Marktanalyse] Error:", e);
      setError(e.message);
    }
    setIsLoading(false);
  };

  var loadingSteps = ["Marktdaten werden analysiert...", "Wettbewerber werden identifiziert...", "Trends werden ausgewertet...", "Positionierung wird berechnet..."];
  useEffect(function() {
    if (!isLoading) { setLoadStep(0); return; }
    var interval = setInterval(function() { setLoadStep(function(s: number) { return s < loadingSteps.length - 1 ? s + 1 : s; }); }, 4000);
    return function() { clearInterval(interval); };
  }, [isLoading]);

  var ScoreRing = function(props: any) {
    var score = props.score; var label = props.label; var color = props.color || "emerald";
    var pct = (score / 10) * 100;
    var colors: any = { emerald: "#34d399", amber: "#fbbf24", red: "#f87171", blue: "#60a5fa" };
    var c = colors[color] || colors.emerald;
    return React.createElement("div", { className:"text-center" },
      React.createElement("div", { className:"relative w-16 h-16 mx-auto mb-2" },
        React.createElement("svg", { viewBox:"0 0 36 36", className:"w-16 h-16 -rotate-90" },
          React.createElement("path", { d:"M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831", fill:"none", stroke:"var(--surface-8)", strokeWidth:"3" }),
          React.createElement("path", { d:"M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831", fill:"none", stroke:c, strokeWidth:"3", strokeDasharray:pct + ", 100", strokeLinecap:"round" })),
        React.createElement("span", { className:"absolute inset-0 flex items-center justify-center text-lg font-medium text-white" }, score)),
      React.createElement("p", { className:"text-xs text-white/40" }, label));
  };

  if (showBpGenerator) {
    return React.createElement("div", { className:"max-w-3xl mx-auto py-10 px-6" },
      React.createElement("button", { onClick:function(){setShowBpGenerator(false)}, className:"mb-6 flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors" }, React.createElement(ChevronLeft,{size:16}), " Zur\xfcck"),
      React.createElement("div", { className:"flex items-center gap-3 mb-8" },
        React.createElement("div", { className:"w-12 h-12 rounded-xl flex items-center justify-center", style:{background:"var(--surface-15)"} }, React.createElement(Sparkles,{size:24,className:"text-white/60"})),
        React.createElement("div", null,
          React.createElement("h1", { className:"text-2xl font-medium text-white" }, "Businessplan erstellen"),
          React.createElement("p", { className:"text-sm text-white/40" }, "Beantworte 10 Fragen — je genauer, desto besser das Ergebnis"))),
      React.createElement(GlassCard, { className:"p-6" },
        React.createElement(BusinessplanInline, { onClose:function(){setShowBpGenerator(false)} })));
  }

  if (!analysis && !isLoading) {
    return React.createElement("div", { className:"max-w-4xl mx-auto py-10 px-6" },
      React.createElement(NextActionBanner, { page:"businessplan", userData:userData, onNavigate:onNavigate, context:{ has_marktanalyse: false, has_businessplan: false } }),
      React.createElement("div", { className:"text-center py-16" },
        React.createElement("div", { className:"w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6", style:{background:"var(--icon-gradient)",border:"1px solid var(--border-15)"} },
          React.createElement(TrendingUp, { size:36, className:"text-white/60" })),
        React.createElement("h1", { className:"text-3xl font-medium text-white mb-3" }, "KI-Marktanalyse"),
        React.createElement("p", { className:"text-white/45 text-sm mb-2 max-w-md mx-auto" }, "Lass die KI deinen Markt analysieren: Wettbewerber, Marktgr\xf6\xdfe, Trends und deine optimale Positionierung — basierend auf deinem Startup-Profil."),
        error && React.createElement("div", { className:"mb-4 mt-4 p-3 rounded-lg text-xs text-amber-300/80 border border-amber-400/20 max-w-md mx-auto", style:{background:"var(--warning-bg)"} }, error),
        React.createElement("div", { className:"mt-8" },
          React.createElement("div", { className:"flex flex-wrap gap-3 justify-center" },
            React.createElement(PrimaryButton, { onClick:handleGenerate, className:"text-sm px-6 py-3" },
              React.createElement(Sparkles, { size:16 }), " Marktanalyse generieren"),
            React.createElement(SecondaryButton, { onClick:function(){setShowBpGenerator(true)}, className:"text-sm px-6 py-3" },
              React.createElement(FileText, { size:16 }), " Businessplan erstellen"))),
        React.createElement("p", { className:"text-xs text-white/20 mt-4" }, "Die Analyse dauert ca. 15-30 Sekunden")));
  }

  if (isLoading) {
    return React.createElement("div", { className:"max-w-4xl mx-auto py-10 px-6" },
      React.createElement("div", { className:"text-center py-20" },
        React.createElement("div", { className:"w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6", style:{background:"var(--icon-gradient)",border:"1px solid var(--border-15)"} },
          React.createElement(Search, { size:32, className:"text-white/60 animate-pulse" })),
        React.createElement("h2", { className:"text-xl text-white mb-4" }, "Marktanalyse wird erstellt"),
        React.createElement("div", { className:"max-w-xs mx-auto mb-6" },
          React.createElement("div", { className:"w-full h-1.5 rounded-full", style:{background:"var(--surface-8)"} },
            React.createElement("div", { className:"h-1.5 rounded-full transition-all duration-1000", style:{width:((loadStep+1)/loadingSteps.length*100)+"%",background:"var(--accent-gradient)"} }))),
        React.createElement("p", { className:"text-white/40 text-sm flex items-center justify-center gap-2" },
          React.createElement(Loader2, { size:14, className:"animate-spin" }), loadingSteps[loadStep])));
  }

  var a = analysis;
  var sections = [
    {id:"overview",label:"\xdcbersicht",Icon:BarChart2},
    {id:"wettbewerb",label:"Wettbewerber",Icon:Target},
    {id:"trends",label:"Trends",Icon:TrendingUp},
    {id:"zielgruppe",label:"Zielgruppe",Icon:Users2},
    {id:"positionierung",label:"Positionierung",Icon:Rocket}
  ];

  return React.createElement("div", { className:"max-w-5xl mx-auto py-10 px-6" },
    React.createElement(NextActionBanner, { page:"businessplan", userData:userData, onNavigate:onNavigate, context:{ has_marktanalyse: true } }),
    React.createElement("div", { className:"flex items-start justify-between mb-6" },
      React.createElement("div", null,
        React.createElement("h1", { className:"text-3xl font-medium text-white mb-1" }, "Marktanalyse"),
        React.createElement("div", { className:"flex items-center gap-2" },
          React.createElement(Sparkles, { size:12, className:"text-white/30" }),
          React.createElement("p", { className:"text-white/40 text-xs uppercase tracking-widest font-medium" }, isCached ? "Gespeicherte Analyse" : "KI-generiert f\xfcr dein Startup"))),
      React.createElement("div", { className:"flex items-center gap-2" },
        React.createElement("button", { onClick:function(){setShowBpGenerator(true)}, className:"flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all border border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.03] text-white/40 hover:text-white/60" },
          React.createElement(FileText, { size:12 }), "Businessplan erstellen"),
        React.createElement("button", { onClick:handleGenerate, disabled:isLoading, className:"flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all border border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.03] text-white/40 hover:text-white/60" },
          React.createElement(Sparkles, { size:12 }), "Neu generieren"))),

    error && React.createElement("div", { className:"mb-4 p-3 rounded-lg text-xs text-amber-300/80 border border-amber-400/20", style:{background:"var(--warning-bg)"} }, error),

    React.createElement("div", { className:"flex gap-1 mb-6 overflow-x-auto pb-1" }, sections.map(function(s: any) {
      return React.createElement("button", { key:s.id, onClick:function(){setActiveSection(s.id)}, className:"flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all " + (activeSection===s.id ? "bg-emerald-500/15 text-white/70 border border-emerald-400/25" : "bg-white/5 text-white/35 border border-white/[0.06] hover:bg-white/[0.08] hover:text-white/50") },
        React.createElement(s.Icon, { size:12 }), s.label);
    })),

    activeSection === "overview" && React.createElement("div", { className:"space-y-6" },
      a.bewertung && React.createElement(GlassCard, { className:"p-6" },
        React.createElement("h3", { className:"text-sm text-white/60 font-medium mb-6 uppercase tracking-wider" }, "Marktbewertung"),
        React.createElement("div", { className:"grid grid-cols-4 gap-6 mb-6" },
          React.createElement(ScoreRing, { score:a.bewertung.markt_attraktivitaet, label:"Attraktivit\xe4t", color:"emerald" }),
          React.createElement(ScoreRing, { score:a.bewertung.wettbewerbs_intensitaet, label:"Wettbewerb", color:a.bewertung.wettbewerbs_intensitaet > 7 ? "red" : "amber" }),
          React.createElement(ScoreRing, { score:a.bewertung.eintritts_barrieren, label:"Barrieren", color:a.bewertung.eintritts_barrieren > 7 ? "red" : "amber" }),
          React.createElement("div", { className:"text-center" },
            React.createElement("div", { className:"w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center border-2", style:{borderColor:a.bewertung.timing==="Sehr gut"?"#34d399":a.bewertung.timing==="Gut"?"#34d399":"#fbbf24"} },
              React.createElement("span", { className:"text-sm font-medium text-white" }, a.bewertung.timing)),
            React.createElement("p", { className:"text-xs text-white/40" }, "Timing"))),
        React.createElement("p", { className:"text-sm text-white/50 leading-relaxed" }, a.bewertung.gesamteinschaetzung)),

      a.marktgroesse && React.createElement(GlassCard, { className:"p-6" },
        React.createElement("h3", { className:"text-sm text-white/60 font-medium mb-4 uppercase tracking-wider" }, "Marktgr\xf6\xdfe (DACH)"),
        React.createElement("div", { className:"space-y-4" },
          [{key:"tam",label:"TAM — Total Addressable Market",color:"#34d399",width:"100%"},
           {key:"sam",label:"SAM — Serviceable Addressable Market",color:"#60a5fa",width:"65%"},
           {key:"som",label:"SOM — Serviceable Obtainable Market",color:"#fbbf24",width:"30%"}].map(function(m: any) {
            return React.createElement("div", { key:m.key },
              React.createElement("div", { className:"flex items-center justify-between mb-1" },
                React.createElement("span", { className:"text-xs text-white/40" }, m.label)),
              React.createElement("div", { className:"w-full h-6 rounded-lg overflow-hidden", style:{background:"var(--surface-5)"} },
                React.createElement("div", { className:"h-6 rounded-lg flex items-center px-3 transition-all duration-700", style:{width:m.width,background:m.color+"22",borderLeft:"3px solid "+m.color} },
                  React.createElement("span", { className:"text-xs text-white/70 font-medium truncate" }, a.marktgroesse[m.key]))),
              m.key === "tam" && a.marktgroesse.wachstumsrate && React.createElement("p", { className:"text-xs text-white/30 mt-1 flex items-center gap-1" }, React.createElement(TrendingUp,{size:10}), "Wachstum: ", a.marktgroesse.wachstumsrate));
          }),
          a.marktgroesse.quellen_hinweis && React.createElement("p", { className:"text-xs text-white/20 mt-2 italic" }, a.marktgroesse.quellen_hinweis))),

      React.createElement("div", { className:"grid grid-cols-3 gap-4" },
        React.createElement(GlassCard, { className:"p-4 text-center" },
          React.createElement("p", { className:"text-2xl font-medium text-white mb-1" }, (a.wettbewerber||[]).length),
          React.createElement("p", { className:"text-xs text-white/40" }, "Wettbewerber identifiziert")),
        React.createElement(GlassCard, { className:"p-4 text-center" },
          React.createElement("p", { className:"text-2xl font-medium text-white mb-1" }, (a.trends||[]).length),
          React.createElement("p", { className:"text-xs text-white/40" }, "Markttrends erkannt")),
        React.createElement(GlassCard, { className:"p-4 text-center" },
          React.createElement("p", { className:"text-2xl font-medium text-white mb-1" }, (a.positionierung?.differenzierungen||[]).length),
          React.createElement("p", { className:"text-xs text-white/40" }, "USPs empfohlen")))),

    activeSection === "wettbewerb" && React.createElement("div", { className:"space-y-4" },
      React.createElement("p", { className:"text-sm text-white/40 mb-2" }, "Identifizierte Wettbewerber in deinem Marktsegment:"),
      (a.wettbewerber||[]).map(function(w: any, i: number) {
        return React.createElement(GlassCard, { key:i, className:"p-5" },
          React.createElement("div", { className:"flex items-start justify-between mb-3" },
            React.createElement("div", null,
              React.createElement("h4", { className:"text-white font-medium text-sm" }, w.name),
              React.createElement("p", { className:"text-xs text-white/40 mt-0.5" }, w.beschreibung)),
            w.preismodell && React.createElement("span", { className:"text-xs px-2 py-0.5 rounded-full border border-white/10 text-white/40 flex-shrink-0 ml-3" }, w.preismodell)),
          React.createElement("div", { className:"grid grid-cols-2 gap-4 mt-3" },
            React.createElement("div", null,
              React.createElement("p", { className:"text-xs text-white/40 mb-1 uppercase tracking-wider font-medium" }, "St\xe4rken"),
              React.createElement("p", { className:"text-xs text-white/50" }, w.staerken)),
            React.createElement("div", null,
              React.createElement("p", { className:"text-xs text-red-400/60 mb-1 uppercase tracking-wider font-medium" }, "Schw\xe4chen"),
              React.createElement("p", { className:"text-xs text-white/50" }, w.schwaechen))),
          w.website && React.createElement("p", { className:"text-xs text-white/25 mt-3 flex items-center gap-1" }, React.createElement(ExternalLink,{size:10}), w.website));
      })),

    activeSection === "trends" && React.createElement("div", { className:"space-y-4" },
      React.createElement("p", { className:"text-sm text-white/40 mb-2" }, "Aktuelle Trends die deinen Markt beeinflussen:"),
      (a.trends||[]).map(function(t: any, i: number) {
        var relevanzColor = t.relevanz === "hoch" ? "emerald" : t.relevanz === "mittel" ? "amber" : "white";
        var typeColor = t.chance_oder_risiko === "Chance" ? "emerald" : t.chance_oder_risiko === "Risiko" ? "red" : "amber";
        return React.createElement(GlassCard, { key:i, className:"p-5" },
          React.createElement("div", { className:"flex items-start justify-between mb-2" },
            React.createElement("h4", { className:"text-white font-medium text-sm" }, t.titel),
            React.createElement("div", { className:"flex gap-2 flex-shrink-0 ml-3" },
              React.createElement("span", { className:"text-xs px-2 py-0.5 rounded-full border border-"+relevanzColor+"-400/20 text-"+relevanzColor+"-400/60" }, t.relevanz),
              React.createElement("span", { className:"text-xs px-2 py-0.5 rounded-full border border-"+typeColor+"-400/20 text-"+typeColor+"-400/60" }, t.chance_oder_risiko))),
          React.createElement("p", { className:"text-xs text-white/50 leading-relaxed" }, t.beschreibung));
      })),

    activeSection === "zielgruppe" && a.zielgruppen_analyse && React.createElement("div", { className:"space-y-4" },
      React.createElement(GlassCard, { className:"p-6" },
        React.createElement("h3", { className:"text-sm text-white/60 font-medium mb-4 uppercase tracking-wider" }, "Zielgruppenanalyse"),
        React.createElement("div", { className:"grid grid-cols-2 gap-6" },
          React.createElement("div", null,
            React.createElement("p", { className:"text-xs text-white/30 uppercase tracking-wider mb-1" }, "Prim\xe4re Zielgruppe"),
            React.createElement("p", { className:"text-sm text-white/70" }, a.zielgruppen_analyse.primaer)),
          React.createElement("div", null,
            React.createElement("p", { className:"text-xs text-white/30 uppercase tracking-wider mb-1" }, "Sekund\xe4re Zielgruppe"),
            React.createElement("p", { className:"text-sm text-white/70" }, a.zielgruppen_analyse.sekundaer))),
        React.createElement("div", { className:"mt-5 pt-5 border-t border-white/[0.06]" },
          React.createElement("p", { className:"text-xs text-white/30 uppercase tracking-wider mb-2" }, "Kaufverhalten"),
          React.createElement("p", { className:"text-sm text-white/50 leading-relaxed" }, a.zielgruppen_analyse.kaufverhalten)),
        React.createElement("div", { className:"mt-5 pt-5 border-t border-white/[0.06]" },
          React.createElement("p", { className:"text-xs text-white/30 uppercase tracking-wider mb-2" }, "Zahlungsbereitschaft"),
          React.createElement("p", { className:"text-sm text-white/50 leading-relaxed" }, a.zielgruppen_analyse.zahlungsbereitschaft))),
      React.createElement(GlassCard, { className:"p-6" },
        React.createElement("h3", { className:"text-sm text-white/60 font-medium mb-3 uppercase tracking-wider" }, "Schmerzpunkte deiner Zielgruppe"),
        React.createElement("div", { className:"space-y-2" }, (a.zielgruppen_analyse.schmerzpunkte||[]).map(function(sp: string, i: number) {
          return React.createElement("div", { key:i, className:"flex items-start gap-3 p-3 rounded-lg", style:{background:"var(--surface-3)"} },
            React.createElement("div", { className:"w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-medium", style:{background:"var(--surface-8)",color:"var(--text-secondary)"} }, i+1),
            React.createElement("p", { className:"text-sm text-white/60" }, sp));
        })))),

    activeSection === "positionierung" && a.positionierung && React.createElement("div", { className:"space-y-4" },
      React.createElement(GlassCard, { className:"p-6" },
        React.createElement("h3", { className:"text-sm text-white/60 font-medium mb-3 uppercase tracking-wider" }, "Empfohlene Positionierung"),
        React.createElement("p", { className:"text-sm text-white/60 leading-relaxed mb-5" }, a.positionierung.empfehlung),
        React.createElement("h4", { className:"text-xs text-white/30 uppercase tracking-wider mb-3" }, "Deine USPs"),
        React.createElement("div", { className:"space-y-2 mb-5" }, (a.positionierung.differenzierungen||[]).map(function(d: string, i: number) {
          return React.createElement("div", { key:i, className:"flex items-center gap-3 p-3 rounded-lg", style:{background:"rgba(52,211,153,0.04)",border:"1px solid rgba(52,211,153,0.1)"} },
            React.createElement(CheckCircle, { size:14, className:"text-white/40 flex-shrink-0" }),
            React.createElement("p", { className:"text-sm text-white/60" }, d));
        }))),
      React.createElement(GlassCard, { className:"p-6" },
        React.createElement("h3", { className:"text-sm text-red-400/60 font-medium mb-3 uppercase tracking-wider" }, "Risiken"),
        React.createElement("div", { className:"space-y-2" }, (a.positionierung.risiken||[]).map(function(r: string, i: number) {
          return React.createElement("div", { key:i, className:"flex items-center gap-3 p-3 rounded-lg", style:{background:"rgba(248,113,113,0.04)",border:"1px solid rgba(248,113,113,0.1)"} },
            React.createElement(AlertCircle, { size:14, className:"text-red-400/60 flex-shrink-0" }),
            React.createElement("p", { className:"text-sm text-white/50" }, r));
        }))),
      React.createElement(GlassCard, { className:"p-6" },
        React.createElement("h3", { className:"text-sm text-white/60 font-medium mb-3 uppercase tracking-wider" }, "N\xe4chste Schritte"),
        React.createElement("div", { className:"space-y-2" }, (a.positionierung.naechste_schritte||[]).map(function(s: string, i: number) {
          return React.createElement("div", { key:i, className:"flex items-center gap-3 p-3 rounded-lg", style:{background:"var(--surface-3)"} },
            React.createElement("div", { className:"w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium", style:{background:"var(--accent-gradient)",color:"#fff"} }, i+1),
            React.createElement("p", { className:"text-sm text-white/60" }, s));
        })))));
}
