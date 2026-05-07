/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { RECHTSFORM_INFO } from '@/lib/constants'
import { GlassCard, NextActionBanner } from '@/components/ui'
import { RechtsformQuiz } from '@/components/RechtsformQuiz'
import { ChevronLeft, ArrowRight, Building, Sparkles, AlertCircle, Check, Loader2 } from '@/components/icons'

export const GewerbePage = ({ userData, onNavigate }: { userData: any; onNavigate: (page: string) => void }) => {
  const { user } = useAuth();
  var qState = useState(false); var showQuiz = qState[0]; var setShowQuiz = qState[1];
  var compState = useState<Record<string, boolean>>({}); var completedSteps = compState[0]; var setCompletedSteps = compState[1];
  var loadState = useState(true); var isLoading = loadState[0]; var setIsLoading = loadState[1];
  var profileState = useState<any>(null); var profile = profileState[0]; var setProfile = profileState[1];
  var savedResultState = useState<any>(null); var savedResult = savedResultState[0]; var setSavedResult = savedResultState[1];

  useEffect(function() {
    if (!user) return;
    (async function() {
      var ct = await db.getCompletedTasks(user.id);
      setCompletedSteps(ct);
      var ob = await db.getOnboarding(user.id);
      setProfile(ob);
      var saved = await db.getRechtsformAnalysis(user.id);
      if (saved) setSavedResult(saved);
      setIsLoading(false);
    })();
  }, [user]);

  var handleQuizResult = function(fullResult: any) {
    setSavedResult(fullResult);
  };

  var toggleStep = function(stepId: string) {
    var isNow = !completedSteps[stepId];
    setCompletedSteps(function(prev: any) { var n = Object.assign({}, prev); if (n[stepId]) delete n[stepId]; else n[stepId] = true; return n; });
    if (user) db.toggleTask(user.id, stepId, isNow);
  };

  if (showQuiz) return React.createElement("div", { className:"max-w-2xl mx-auto py-10 px-6" },
    React.createElement("button", { onClick:function(){setShowQuiz(false)}, className:"mb-5 flex items-center gap-2 text-sm text-white/40 hover:text-white/70" }, React.createElement(ChevronLeft,{size:16}), " Zurück"),
    React.createElement(RechtsformQuiz, { onClose:function(){setShowQuiz(false)}, onResult:handleQuizResult }));

  var renderSavedResult = function() {
    if (!savedResult || !savedResult.topKey) return null;
    var top = RECHTSFORM_INFO[savedResult.topKey];
    var ai = savedResult.aiAnalysis;
    if (!top) return null;
    var displayGruende = ai ? ai.gruende : top.gruende;
    var displayRisiken = ai ? ai.risiken : top.risiken;
    var displaySchritte = ai ? ai.naechste_schritte : top.naechsteSchritte;
    var displayKurz = ai ? ai.empfehlung.zusammenfassung : top.kurz;

    return React.createElement("div", { className:"space-y-5" },
      React.createElement(GlassCard, { className:"p-6", style:{borderColor:top.farbe.replace("0.8","0.4")} },
        React.createElement("div", { className:"flex items-start justify-between mb-2" },
          React.createElement("div", null,
            React.createElement("div", { className:"flex items-center gap-2 mb-1" },
              React.createElement("p", { className:"text-xs text-white/40 uppercase tracking-wider" }, "Empfohlene Rechtsform"),
              ai && React.createElement("span", { className:"text-xs px-2 py-0.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 text-emerald-300/80 flex items-center gap-1" }, React.createElement(Sparkles,{size:10}), " KI-Analyse")),
            React.createElement("h3", { className:"text-2xl font-medium text-white" }, top.name),
            React.createElement("p", { className:"text-white/50 text-sm mt-1" }, displayKurz)),
          React.createElement("div", { className:"text-right" },
            React.createElement("p", { className:"text-xs text-white/40 mb-1" }, "Passung"),
            React.createElement("p", { className:"text-lg font-medium "+(savedResult.confColor||"text-white/60") }, savedResult.confidence))),
        savedResult.scores && React.createElement("div", { className:"mt-4 space-y-2" }, Object.entries(savedResult.scores).sort(function(a: any,b: any){return b[1]-a[1]}).map(function(entry: any) {
          var max = Math.max.apply(null, Object.values(savedResult.scores) as number[]);
          return React.createElement("div", { key:entry[0], className:"flex items-center gap-3" },
            React.createElement("span", { className:"text-xs text-white/40 w-32 flex-shrink-0" }, RECHTSFORM_INFO[entry[0]]?.name.split("(")[0].trim()),
            React.createElement("div", { className:"flex-1 h-1.5 rounded-full", style:{background:"var(--surface-6)"} },
              React.createElement("div", { className:"h-1.5 rounded-full transition-all duration-700", style:{width:(entry[1]/max)*100+"%",background:entry[0]===savedResult.topKey?top.farbe:"var(--surface-15)"} })),
            React.createElement("span", { className:"text-xs text-white/30 w-6 text-right" }, entry[1]));
        }))),

      React.createElement("div", { className:"grid md:grid-cols-2 gap-4" },
        React.createElement(GlassCard, { className:"p-5" },
          React.createElement("p", { className:"text-xs text-white/40 uppercase tracking-wider mb-3" }, ai ? "✓ Gründe für dein Startup" : "✓ 3 Gründe dafür"),
          React.createElement("div", { className:"space-y-2" }, displayGruende.map(function(g: string,i: number) { return React.createElement("div",{key:i,className:"flex items-start gap-2 text-sm text-white/65"},React.createElement("span",{className:"text-white/60 mt-0.5 flex-shrink-0"},"✓"),g); }))),
        React.createElement(GlassCard, { className:"p-5" },
          React.createElement("p", { className:"text-xs text-white/40 uppercase tracking-wider mb-3" }, "⚠ Trade-offs"),
          React.createElement("div", { className:"space-y-2" }, displayRisiken.map(function(r: string,i: number) { return React.createElement("div",{key:i,className:"flex items-start gap-2 text-sm text-white/65"},React.createElement("span",{className:"text-amber-400 mt-0.5 flex-shrink-0"},"⚠"),r); })))),

      ai && React.createElement("div", { className:"grid md:grid-cols-2 gap-4" },
        ai.branchenhinweis && React.createElement(GlassCard, { className:"p-5" },
          React.createElement("div", { className:"flex items-center gap-2 mb-3" },
            React.createElement("span", { className:"text-xs text-white/40 uppercase tracking-wider" }, "🏭 Branchenhinweis")),
          React.createElement("p", { className:"text-sm text-white/60 leading-relaxed" }, ai.branchenhinweis)),
        ai.steuerhinweis && React.createElement(GlassCard, { className:"p-5" },
          React.createElement("div", { className:"flex items-center gap-2 mb-3" },
            React.createElement("span", { className:"text-xs text-white/40 uppercase tracking-wider" }, "💰 Steuerhinweis")),
          React.createElement("p", { className:"text-sm text-white/60 leading-relaxed" }, ai.steuerhinweis))),

      React.createElement(GlassCard, { className:"p-5" },
        React.createElement("p", { className:"text-xs text-white/40 uppercase tracking-wider mb-3" }, "Nächste Schritte"),
        React.createElement("div", { className:"space-y-2" }, displaySchritte.map(function(s: string,i: number) { return React.createElement("div",{key:i,className:"flex items-center gap-3 text-sm text-white/65"},React.createElement("div",{className:"w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0",style:{background:"var(--surface-20)",color:"var(--text-default)"}},i+1),s); }))),

      ai && ai.alternative && React.createElement(GlassCard, { className:"p-4" },
        React.createElement("div", { className:"flex items-start gap-3" },
          React.createElement("div", { className:"w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", style:{background:"var(--surface-12)"} }, React.createElement(ArrowRight,{size:14,className:"text-white/40"})),
          React.createElement("div", null,
            React.createElement("p", { className:"text-xs text-white/40 uppercase tracking-wider mb-1" }, "Alternative"),
            React.createElement("p", { className:"text-sm text-white/70 font-medium" }, ai.alternative.rechtsform),
            React.createElement("p", { className:"text-xs text-white/50 mt-0.5" }, ai.alternative.grund)))),

      React.createElement("div", { className:"rounded-xl p-4 flex items-start gap-3", style:{background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.15)"} },
        React.createElement(AlertCircle, { size:14, className:"text-amber-400 mt-0.5 flex-shrink-0" }),
        React.createElement("p", { className:"text-xs text-amber-300/70" }, React.createElement("strong",{className:"text-amber-300"},"Kein Ersatz für Rechtsberatung."), " Bitte mit Steuerberater prüfen.")),

      React.createElement("div", { className:"flex items-center justify-between pt-2" },
        savedResult.timestamp && React.createElement("span", { className:"text-xs text-white/25" }, "Erstellt: "+new Date(savedResult.timestamp).toLocaleDateString("de-DE")),
        React.createElement("button", { onClick:function(){setShowQuiz(true)}, className:"text-sm text-white/35 hover:text-white/60 transition-colors underline underline-offset-2" }, "Quiz wiederholen")));
  };

  var renderChecklist = function() {
    if (!savedResult || !savedResult.aiAnalysis || !savedResult.aiAnalysis.checkliste) return null;
    var steps = savedResult.aiAnalysis.checkliste;
    var done = steps.filter(function(s: any){return completedSteps[s.id]}).length;
    var pct = Math.round((done/steps.length)*100);
    var top = RECHTSFORM_INFO[savedResult.topKey];

    var katColors: Record<string, string> = { gruendung:"border-blue-400/20 text-blue-300/60", behoerden:"border-amber-400/20 text-amber-300/60", finanzen:"border-emerald-400/20 text-emerald-300/60", versicherung:"border-purple-400/20 text-purple-300/60", branche:"border-pink-400/20 text-pink-300/60" };
    var katLabels: Record<string, string> = { gruendung:"Gründung", behoerden:"Behörden", finanzen:"Finanzen", versicherung:"Versicherung", branche:"Branchenspezifisch" };
    var wichtigkeitBadge: Record<string, string> = { pflicht:"bg-red-500/10 text-red-300/70 border-red-400/20", empfohlen:"bg-amber-500/10 text-amber-300/70 border-amber-400/20", optional:"bg-white/5 text-white/40 border-white/10" };

    return React.createElement("div", { className:"space-y-4" },
      React.createElement("div", { className:"flex items-center justify-between mb-2" },
        React.createElement("div", { className:"flex items-center gap-2" },
          React.createElement("h2", { className:"text-xl font-medium text-white" }, "Gewerbeanmeldung Checkliste"),
          React.createElement("span", { className:"text-xs px-2 py-0.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 text-emerald-300/80 flex items-center gap-1" }, React.createElement(Sparkles,{size:10}), " "+top.name.split("(")[0].trim()),
          React.createElement("span", { className:"text-xs px-2 py-0.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 text-emerald-300/80 flex items-center gap-1" }, React.createElement(Sparkles,{size:10}), " Personalisiert")),
        React.createElement("span", { className:"text-sm font-medium "+(pct===100?"text-white/60":"text-white/50") }, pct+"% erledigt")),
      React.createElement("div", { className:"w-full h-2 rounded-full mb-4", style:{background:"var(--surface-8)"} },
        React.createElement("div", { className:"h-2 rounded-full transition-all duration-500", style:{width:pct+"%",background:pct===100?"linear-gradient(90deg,var(--text-secondary),#059669)":"var(--accent-gradient)",boxShadow:"var(--accent-glow)"} })),
      React.createElement("div", { className:"space-y-3" }, steps.map(function(step: any, idx: number) {
        var isDone = completedSteps[step.id];
        return React.createElement(GlassCard, { key:step.id||("ai_"+idx), className:"p-4 transition-all "+(isDone?"opacity-70":"hover:border-emerald-400/20") },
          React.createElement("div", { className:"flex items-start gap-3" },
            React.createElement("button", { onClick:function(){toggleStep(step.id||("ai_"+idx))}, className:"mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all "+(isDone?"bg-emerald-500/15 border-emerald-400":"border-white/20 hover:border-white/[0.12]") },
              isDone && React.createElement(Check, {size:14,className:"text-white/50"})),
            React.createElement("div", { className:"flex-1 min-w-0" },
              React.createElement("div", { className:"flex items-center gap-2 flex-wrap" },
                React.createElement("p", { className:"font-medium text-sm "+(isDone?"line-through text-white/40":"text-white/90") }, (idx+1)+". "+step.title),
                React.createElement("span", { className:"text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10" }, "⏱ "+step.zeit),
                step.wichtigkeit && React.createElement("span", { className:"text-xs px-2 py-0.5 rounded-full border "+(wichtigkeitBadge[step.wichtigkeit]||"") }, step.wichtigkeit === "pflicht" ? "Pflicht" : step.wichtigkeit === "empfohlen" ? "Empfohlen" : "Optional"),
                step.kategorie && React.createElement("span", { className:"text-xs px-1.5 py-0.5 rounded-full border "+(katColors[step.kategorie]||"border-white/10 text-white/40") }, katLabels[step.kategorie]||step.kategorie)),
              React.createElement("p", { className:"text-xs text-white/45 mt-1 leading-relaxed" }, step.desc),
              step.link && !isDone && React.createElement("a", { href:step.link, target:"_blank", rel:"noopener noreferrer", className:"inline-flex items-center gap-1 text-xs text-white/60 hover:text-white/50 mt-2 transition-colors" }, "Extern öffnen ", React.createElement(ArrowRight,{size:10})))));
      })));
  };

  if (isLoading) return React.createElement("div", { className:"flex items-center justify-center py-20" },
    React.createElement(Loader2, { size:24, className:"animate-spin text-white/40" }));

  return React.createElement("div", { className:"max-w-5xl mx-auto py-10 px-6 space-y-10" },
    React.createElement("div", null,
      React.createElement("h1", { className:"text-3xl font-medium text-white mb-2" }, "Gewerbeanmeldung"),
      React.createElement("p", { className:"text-white/45 text-sm mb-6" }, "Rechtsform wählen und Schritt für Schritt anmelden"),
      React.createElement(NextActionBanner, { page:"rechtliches", userData:userData||profile, onNavigate:onNavigate, context:{ has_rechtsform: !!savedResult, completed_steps: Object.keys(completedSteps||{}).length } })),

    !savedResult && React.createElement(GlassCard, { className:"p-5 cursor-pointer hover:border-emerald-400/20 transition-all", onClick:function(){setShowQuiz(true)} },
      React.createElement("div", { className:"flex items-center justify-between" },
        React.createElement("div", { className:"flex items-center gap-4" },
          React.createElement("div", { className:"w-12 h-12 rounded-xl flex items-center justify-center", style:{background:"var(--surface-15)"} }, React.createElement(Building,{size:22,className:"text-white/60"})),
          React.createElement("div", null, React.createElement("p",{className:"text-white font-normal"},"Rechtsform-Quiz starten"), React.createElement("p",{className:"text-xs text-white/40 mt-0.5"},"8 Fragen → KI-gestützte Empfehlung für dein Startup"))),
        React.createElement(ArrowRight, { size:18, className:"text-white/30" }))),

    savedResult && renderSavedResult(),

    savedResult && savedResult.aiAnalysis && savedResult.aiAnalysis.checkliste && renderChecklist());
};
