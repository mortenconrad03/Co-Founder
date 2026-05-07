/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { supabase, SUPABASE_URL } from '@/lib/supabase'
import { aiFetch } from '@/lib/aiFetch'
import { db } from '@/lib/db'
import { QUIZ_QUESTIONS, calcRechtsformScores, RECHTSFORM_INFO } from '@/lib/constants'
import { GlassCard, PrimaryButton, SecondaryButton } from '@/components/ui'
import { Building, ChevronLeft, ChevronRight, Sparkles, Check, AlertCircle, ArrowRight } from '@/components/icons'

export const RechtsformQuiz = ({ onClose, onResult }: { onClose: () => void; onResult: (result: any) => void }) => {
  const { user } = useAuth();
  var stState = useState("start"); var quizState = stState[0]; var setQuizState = stState[1];
  var stepState = useState(1); var step = stepState[0]; var setStep = stepState[1];
  var ansState = useState<Record<number, string>>({}); var answers = ansState[0]; var setAnswers = ansState[1];
  var resState = useState<any>(null); var result = resState[0]; var setResult = resState[1];
  var aiState = useState<any>(null); var aiAnalysis = aiState[0]; var setAiAnalysis = aiState[1];
  var aiLoadState = useState(false); var aiLoading = aiLoadState[0]; var setAiLoading = aiLoadState[1];
  var aiStepState = useState(""); var aiStep = aiStepState[0]; var setAiStep = aiStepState[1];
  var TOTAL = QUIZ_QUESTIONS.length;
  var currentQ = QUIZ_QUESTIONS[step-1];
  var hasAnswer = answers[currentQ?.id] !== undefined;
  var SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  var handleAnswer = function(qId: number, value: string) { setAnswers(function(p: any) { return Object.assign({}, p, {[qId]:value}); }); };

  var callAiAnalysis = async function(scores: any, topKey: string, confidence: string, confColor: string, profile: any) {
    setAiLoading(true);
    setAiStep("Analysiere dein Profil...");
    try {
      var session = await supabase.auth.getSession();
      var token = session?.data?.session?.access_token || SUPABASE_ANON_KEY;
      setTimeout(function(){ setAiStep("Prüfe branchenspezifische Anforderungen..."); }, 1500);
      setTimeout(function(){ setAiStep("Erstelle personalisierte Empfehlung..."); }, 3500);
      var resp = await aiFetch(SUPABASE_URL+"/functions/v1/rechtsform-ai", {
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":"Bearer "+token,"apikey":SUPABASE_ANON_KEY},
        body:JSON.stringify({ answers:answers, scores:scores, topKey:topKey, profile:profile||{} })
      });
      if (!resp.ok) throw new Error("HTTP "+resp.status);
      var data = await resp.json();
      setAiAnalysis(data.analysis);
      var fullResult = { topKey:topKey, scores:scores, confidence:confidence, confColor:confColor, aiAnalysis:data.analysis, timestamp:new Date().toISOString() };
      if (user) await db.saveRechtsformAnalysis(user.id, fullResult);
      if (onResult) onResult(fullResult);
    } catch(e) { console.error("AI Rechtsform error:", e); }
    setAiLoading(false);
  };

  var handleFinish = async function() {
    var scores = calcRechtsformScores(answers);
    var sorted = Object.entries(scores).sort(function(a: any,b: any){return b[1]-a[1]});
    var topKey = sorted[0][0]; var topScore = sorted[0][1] as number;
    var confidence = topScore>=18?"Hoch":topScore>=12?"Mittel":"Niedrig";
    var confColor = confidence==="Hoch"?"text-white/60":confidence==="Mittel"?"text-amber-400":"text-red-400";
    var altKey = RECHTSFORM_INFO[topKey].alternativeKey;
    setResult({topKey:topKey,altKey:altKey,scores:scores,confidence:confidence,confColor:confColor});
    setQuizState("result");
    if (user) {
      db.saveQuizResult(user.id, answers, topKey, scores, confidence);
      var ob = await db.getOnboarding(user.id);
      callAiAnalysis(scores, topKey, confidence, confColor, ob);
    }
  };

  if (quizState === "start") return React.createElement("div", { className:"space-y-6" },
    React.createElement("div", { className:"text-center py-6" },
      React.createElement("div", { className:"w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4", style:{background:"var(--icon-gradient)",border:"1px solid var(--border-30)"} }, React.createElement(Building,{size:28,className:"text-white/60"})),
      React.createElement("h2", { className:"text-2xl font-medium text-white mb-2" }, "Rechtsform-Quiz"),
      React.createElement("p", { className:"text-white/50 text-sm max-w-md mx-auto" }, "8 Fragen → persönliche Empfehlung")),
    React.createElement("div", { className:"flex gap-3 justify-center" },
      React.createElement(PrimaryButton, { onClick:function(){setQuizState("quiz")}, className:"px-8" }, "Quiz starten ", React.createElement(ArrowRight,{size:16})),
      React.createElement(SecondaryButton, { onClick:onClose }, "Abbrechen")));

  if (quizState === "quiz") return React.createElement("div", { className:"space-y-6" },
    React.createElement("div", null,
      React.createElement("div", { className:"flex justify-between text-xs text-white/40 mb-2" }, React.createElement("span",null,"Frage ",step," von ",TOTAL), React.createElement("span",null,Math.round((step/TOTAL)*100),"%")),
      React.createElement("div", { className:"w-full h-1 rounded-full", style:{background:"var(--surface-8)"} },
        React.createElement("div", { className:"h-1 rounded-full transition-all duration-500", style:{width:(step/TOTAL)*100+"%",background:"var(--accent-solid)"} }))),
    React.createElement(GlassCard, { className:"p-6" },
      React.createElement("p", { className:"text-white font-normal text-lg mb-5" }, currentQ.text),
      React.createElement("div", { className:"space-y-3" }, currentQ.options.map(function(opt: any) {
        var sel = answers[currentQ.id] === opt.value;
        return React.createElement("button", { key:opt.value, onClick:function(){handleAnswer(currentQ.id,opt.value)}, className:"w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 flex items-center gap-3", style:{borderColor:sel?"var(--border-70)":"var(--border-10)",background:sel?"var(--surface-12)":"var(--surface-3)"} },
          React.createElement("div", { className:"w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0", style:{borderColor:sel?"var(--border-80)":"var(--border-15)",background:sel?"var(--surface-30)":"transparent"} }, sel && React.createElement("div",{className:"w-2 h-2 rounded-full bg-white/30"})),
          React.createElement("span", { className:"text-sm font-medium "+(sel?"text-white":"text-white/60") }, opt.label));
      }))),
    React.createElement("div", { className:"flex items-center justify-between" },
      React.createElement("button", { onClick:function(){if(step>1)setStep(function(s){return s-1});else setQuizState("start")}, className:"flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors" }, React.createElement(ChevronLeft,{size:16}), " Zurück"),
      step < TOTAL ?
        React.createElement(PrimaryButton, { onClick:function(){setStep(function(s){return s+1})}, disabled:!hasAnswer }, "Weiter ", React.createElement(ChevronRight,{size:16})) :
        React.createElement(PrimaryButton, { onClick:handleFinish, disabled:!hasAnswer }, "Ergebnis ", React.createElement(Sparkles,{size:16}))));

  if (quizState === "result" && result) {
    var top = RECHTSFORM_INFO[result.topKey]; var alt = RECHTSFORM_INFO[result.altKey];
    var displayGruende = aiAnalysis ? aiAnalysis.gruende : top.gruende;
    var displayRisiken = aiAnalysis ? aiAnalysis.risiken : top.risiken;
    var displaySchritte = aiAnalysis ? aiAnalysis.naechste_schritte : top.naechsteSchritte;
    var displayKurz = aiAnalysis ? aiAnalysis.empfehlung.zusammenfassung : top.kurz;

    return React.createElement("div", { className:"space-y-5" },
      React.createElement(GlassCard, { className:"p-6", style:{borderColor:top.farbe.replace("0.8","0.4")} },
        React.createElement("div", { className:"flex items-start justify-between mb-2" },
          React.createElement("div", null,
            React.createElement("div", { className:"flex items-center gap-2 mb-1" },
              React.createElement("p", { className:"text-xs text-white/40 uppercase tracking-wider" }, "Empfohlene Rechtsform"),
              aiAnalysis && React.createElement("span", { className:"text-xs px-2 py-0.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 text-emerald-300/80 flex items-center gap-1" }, React.createElement(Sparkles,{size:10}), " KI-Analyse")),
            React.createElement("h3", { className:"text-2xl font-medium text-white" }, top.name),
            React.createElement("p", { className:"text-white/50 text-sm mt-1" }, displayKurz)),
          React.createElement("div", { className:"text-right" },
            React.createElement("p", { className:"text-xs text-white/40 mb-1" }, "Passung"),
            React.createElement("p", { className:"text-lg font-medium "+result.confColor }, result.confidence))),
        React.createElement("div", { className:"mt-4 space-y-2" }, Object.entries(result.scores).sort(function(a: any,b: any){return b[1]-a[1]}).map(function(entry: any) {
          var max = Math.max.apply(null, Object.values(result.scores) as number[]);
          return React.createElement("div", { key:entry[0], className:"flex items-center gap-3" },
            React.createElement("span", { className:"text-xs text-white/40 w-32 flex-shrink-0" }, RECHTSFORM_INFO[entry[0]].name.split("(")[0].trim()),
            React.createElement("div", { className:"flex-1 h-1.5 rounded-full", style:{background:"var(--surface-6)"} },
              React.createElement("div", { className:"h-1.5 rounded-full transition-all duration-700", style:{width:(entry[1]/max)*100+"%",background:entry[0]===result.topKey?top.farbe:"var(--surface-15)"} })),
            React.createElement("span", { className:"text-xs text-white/30 w-6 text-right" }, entry[1]));
        }))),

      aiLoading && React.createElement(GlassCard, { className:"p-5" },
        React.createElement("div", { className:"flex items-center gap-3" },
          React.createElement("div", { className:"w-5 h-5 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" }),
          React.createElement("div", null,
            React.createElement("p", { className:"text-sm text-white/70 font-medium" }, "KI analysiert dein Profil..."),
            React.createElement("p", { className:"text-xs text-white/40 mt-0.5" }, aiStep)))),

      React.createElement("div", { className:"grid md:grid-cols-2 gap-4" },
        React.createElement(GlassCard, { className:"p-5" },
          React.createElement("p", { className:"text-xs text-white/40 uppercase tracking-wider mb-3" }, aiAnalysis ? "✓ Gründe für dein Startup" : "✓ 3 Gründe dafür"),
          React.createElement("div", { className:"space-y-2" }, displayGruende.map(function(g: string,i: number) { return React.createElement("div",{key:i,className:"flex items-start gap-2 text-sm text-white/65"},React.createElement("span",{className:"text-white/60 mt-0.5 flex-shrink-0"},"✓"),g); }))),
        React.createElement(GlassCard, { className:"p-5" },
          React.createElement("p", { className:"text-xs text-white/40 uppercase tracking-wider mb-3" }, "⚠ Trade-offs"),
          React.createElement("div", { className:"space-y-2" }, displayRisiken.map(function(r: string,i: number) { return React.createElement("div",{key:i,className:"flex items-start gap-2 text-sm text-white/65"},React.createElement("span",{className:"text-amber-400 mt-0.5 flex-shrink-0"},"⚠"),r); })))),

      aiAnalysis && React.createElement("div", { className:"grid md:grid-cols-2 gap-4" },
        aiAnalysis.branchenhinweis && React.createElement(GlassCard, { className:"p-5" },
          React.createElement("div", { className:"flex items-center gap-2 mb-3" },
            React.createElement("span", { className:"text-xs text-white/40 uppercase tracking-wider" }, "🏭 Branchenhinweis")),
          React.createElement("p", { className:"text-sm text-white/60 leading-relaxed" }, aiAnalysis.branchenhinweis)),
        aiAnalysis.steuerhinweis && React.createElement(GlassCard, { className:"p-5" },
          React.createElement("div", { className:"flex items-center gap-2 mb-3" },
            React.createElement("span", { className:"text-xs text-white/40 uppercase tracking-wider" }, "💰 Steuerhinweis")),
          React.createElement("p", { className:"text-sm text-white/60 leading-relaxed" }, aiAnalysis.steuerhinweis))),

      React.createElement(GlassCard, { className:"p-5" },
        React.createElement("p", { className:"text-xs text-white/40 uppercase tracking-wider mb-3" }, "Nächste Schritte"),
        React.createElement("div", { className:"space-y-2" }, displaySchritte.map(function(s: string,i: number) { return React.createElement("div",{key:i,className:"flex items-center gap-3 text-sm text-white/65"},React.createElement("div",{className:"w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0",style:{background:"var(--surface-20)",color:"var(--text-default)"}},i+1),s); }))),

      aiAnalysis && aiAnalysis.alternative && React.createElement(GlassCard, { className:"p-4" },
        React.createElement("div", { className:"flex items-start gap-3" },
          React.createElement("div", { className:"w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", style:{background:"var(--surface-12)"} }, React.createElement(ArrowRight,{size:14,className:"text-white/40"})),
          React.createElement("div", null,
            React.createElement("p", { className:"text-xs text-white/40 uppercase tracking-wider mb-1" }, "Alternative"),
            React.createElement("p", { className:"text-sm text-white/70 font-medium" }, aiAnalysis.alternative.rechtsform),
            React.createElement("p", { className:"text-xs text-white/50 mt-0.5" }, aiAnalysis.alternative.grund)))),

      React.createElement("div", { className:"rounded-xl p-4 flex items-start gap-3", style:{background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.15)"} },
        React.createElement(AlertCircle, { size:14, className:"text-amber-400 mt-0.5 flex-shrink-0" }),
        React.createElement("p", { className:"text-xs text-amber-300/70" }, React.createElement("strong",{className:"text-amber-300"},"Kein Ersatz für Rechtsberatung."), " Bitte mit Steuerberater prüfen.")),

      aiAnalysis && React.createElement("div", { className:"flex items-center gap-2 text-xs text-white/30" },
        React.createElement(Check, { size:12 }), "Ergebnis automatisch gespeichert"),

      React.createElement("div", { className:"flex flex-wrap gap-3 pt-2" },
        React.createElement(PrimaryButton, { onClick:onClose }, "← Zurück zur Übersicht"),
        React.createElement("button", { onClick:function(){setQuizState("start");setStep(1);setAnswers({});setResult(null);setAiAnalysis(null)}, className:"text-sm text-white/35 hover:text-white/60 transition-colors underline underline-offset-2 ml-auto" }, "Quiz wiederholen")));
  }
  return null;
};
