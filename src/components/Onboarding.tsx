/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { BUNDESLAENDER, BRANCHEN } from '@/lib/constants'
import { ContainerFrame, PrimaryButton, ProgressBar, TileSelector, Toggle, ChecklistItem } from '@/components/ui'
import { Logo } from '@/components/ui'
import { Sparkles, ChevronLeft, ChevronRight, Check, Minus, Plus, ArrowRight } from '@/components/icons'

export const Onboarding = ({ onComplete, onSkip, onBack }: { onComplete: (data: any) => void; onSkip: () => void; onBack: () => void }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState({ pitch:"",problem:"",zielgruppe:"",phase:"",businessplan:false,finanzplan:false,konkurrenz:false,preis:false,land:"Deutschland",bundesland:"",teamgroesse:1,investoren:false,rechtsform:false,kapitalbedarf:50000,branche:"",foerderungen:true,ziele:"" });
  const update = function(key: string, val: any) { setData(function(prev: any) { return Object.assign({}, prev, { [key]: val }); }); };
  const TOTAL = 5;

  const handleSubmit = async function() {
    setLoading(true);
    if (user) await db.saveOnboarding(user.id, data);
    setLoading(false);
    setSuccess(true);
    setTimeout(function() { onComplete(data); }, 1200);
  };

  const canNext = function() {
    if (step===1) return data.pitch.length>10 && data.problem && data.zielgruppe && data.phase;
    if (step===2) return true;
    if (step===3) return data.bundesland;
    if (step===4) return data.branche;
    if (step===5) return data.ziele.length>5;
    return true;
  };

  const titles = ["Startup Basics","Status-Check","Gründungs-Details","Förder-Fokus","Deine Ziele"];

  const inputStyle = { background:"var(--bg-input)", border:"1px solid var(--border-10)" };
  const focusIn = function(e: any) { e.target.style.borderColor = "var(--border-25)"; };
  const focusOut = function(e: any) { e.target.style.borderColor = "var(--border-10)"; };

  return React.createElement("div", { className:"min-h-screen flex items-center justify-center p-6" },
    React.createElement("div", { className:"w-full max-w-xl" },
      React.createElement(ContainerFrame, null,
        React.createElement("div", { className:"p-8" },
          React.createElement("div", { className:"mb-8" },
            React.createElement("div", { className:"flex items-center mb-6" }, React.createElement(Logo, { size:"sm" })),
            React.createElement(ProgressBar, { current:step, total:TOTAL }),
            React.createElement("h2", { className:"text-2xl font-medium text-white mt-5", style:{letterSpacing:"-0.02em"} }, titles[step-1]),
            step === 1 && React.createElement("p", { className:"text-xs text-white/30 mt-2 flex items-center gap-1.5" }, React.createElement(Sparkles,{size:10,className:"text-emerald-400/40"}), "Je genauer deine Angaben, desto besser werden Roadmap, Businessplan und Finanzplan.")),

          step === 1 && React.createElement("div", { className:"space-y-5" },
            React.createElement("div", null, React.createElement("label", { className:"text-xs text-white/50 uppercase tracking-wider mb-2 block" }, "Elevator Pitch"),
              React.createElement("textarea", { rows:3, value:data.pitch, onChange:function(e: any){update("pitch",e.target.value)}, placeholder:"Beschreibe dein Startup in 2–3 Sätzen...", className:"w-full rounded-xl p-3 text-sm text-white placeholder-white/25 outline-none resize-none transition-all duration-200", style:inputStyle, onFocus:focusIn, onBlur:focusOut })),
            React.createElement("div", null, React.createElement("label", { className:"text-xs text-white/50 uppercase tracking-wider mb-2 block" }, "Problem, das du löst"),
              React.createElement("input", { value:data.problem, onChange:function(e: any){update("problem",e.target.value)}, placeholder:"z.B. Gründer verlieren Zeit mit Behördenkram", className:"w-full rounded-xl p-3 text-sm text-white placeholder-white/25 outline-none transition-all duration-200", style:inputStyle, onFocus:focusIn, onBlur:focusOut })),
            React.createElement("div", null, React.createElement("label", { className:"text-xs text-white/50 uppercase tracking-wider mb-2 block" }, "Zielgruppe"),
              React.createElement("input", { value:data.zielgruppe, onChange:function(e: any){update("zielgruppe",e.target.value)}, placeholder:"z.B. Existenzgründer in Deutschland", className:"w-full rounded-xl p-3 text-sm text-white placeholder-white/25 outline-none transition-all duration-200", style:inputStyle, onFocus:focusIn, onBlur:focusOut })),
            React.createElement("div", null, React.createElement("label", { className:"text-xs text-white/50 uppercase tracking-wider mb-2 block" }, "Aktuelle Phase"),
              React.createElement(TileSelector, { options:[{value:"idee",label:"Idee"},{value:"validiert",label:"Validiert"},{value:"mvp",label:"MVP"},{value:"gegruendet",label:"Gegründet"},{value:"wachstum",label:"Wachstum"}], selected:data.phase, onSelect:function(v: string){update("phase",v)} }))),

          step === 2 && React.createElement("div", { className:"space-y-4" },
            React.createElement("p", { className:"text-white/50 text-sm mb-2" }, "Was hast du bereits vorbereitet?"),
            [{key:"businessplan",label:"Businessplan vorhanden"},{key:"finanzplan",label:"Finanzplan vorhanden"},{key:"konkurrenz",label:"Konkurrenzanalyse vorhanden"},{key:"preis",label:"Preisstrategie vorhanden"}].map(function(item: any) {
              return React.createElement(ChecklistItem, { key:item.key, text:item.label, checked:(data as any)[item.key], onToggle:function(){update(item.key,!(data as any)[item.key])} });
            })),

          step === 3 && React.createElement("div", { className:"space-y-5" },
            React.createElement("div", null, React.createElement("label", { className:"text-xs text-white/50 uppercase tracking-wider mb-2 block" }, "Bundesland *"),
              React.createElement("select", { value:data.bundesland, onChange:function(e: any){update("bundesland",e.target.value)}, className:"w-full rounded-xl p-3 text-sm text-white outline-none transition-all duration-200 appearance-none", style:Object.assign({}, inputStyle, {color:data.bundesland?"var(--text-primary)":"var(--text-faint)"}) },
                React.createElement("option", { value:"" }, "Bundesland wählen..."),
                BUNDESLAENDER.map(function(b: string) { return React.createElement("option", { key:b, value:b, style:{background:"var(--bg-select-option)"} }, b); }))),
            React.createElement("div", null, React.createElement("label", { className:"text-xs text-white/50 uppercase tracking-wider mb-2 block" }, "Teamgröße"),
              React.createElement("div", { className:"flex items-center gap-4" },
                React.createElement("button", { onClick:function(){update("teamgroesse",Math.max(1,data.teamgroesse-1))}, className:"w-9 h-9 rounded-xl border border-white/15 flex items-center justify-center text-white/60 hover:border-white/[0.12] transition-colors" }, React.createElement(Minus, {size:14})),
                React.createElement("span", { className:"text-2xl font-medium text-white w-10 text-center" }, data.teamgroesse),
                React.createElement("button", { onClick:function(){update("teamgroesse",data.teamgroesse+1)}, className:"w-9 h-9 rounded-xl border border-white/15 flex items-center justify-center text-white/60 hover:border-white/[0.12] transition-colors" }, React.createElement(Plus, {size:14})),
                React.createElement("span", { className:"text-sm text-white/40" }, data.teamgroesse===1?"Person":"Personen"))),
            React.createElement(Toggle, { value:data.investoren, onChange:function(v: boolean){update("investoren",v)}, label:"Investoren geplant?" }),
            React.createElement(Toggle, { value:data.rechtsform, onChange:function(v: boolean){update("rechtsform",v)}, label:"Rechtsform bereits gewählt?" })),

          step === 4 && React.createElement("div", { className:"space-y-6" },
            React.createElement("div", null, React.createElement("label", { className:"text-xs text-white/50 uppercase tracking-wider mb-2 block" }, "Kapitalbedarf: ", React.createElement("span", { className:"text-white/60" }, data.kapitalbedarf.toLocaleString("de-DE"), " €")),
              React.createElement("input", { type:"range", min:5000, max:500000, step:5000, value:data.kapitalbedarf, onChange:function(e: any){update("kapitalbedarf",Number(e.target.value))}, className:"w-full h-1 rounded-full outline-none cursor-pointer", style:{accentColor:"var(--text-secondary)"} }),
              React.createElement("div", { className:"flex justify-between text-xs text-white/25 mt-1" }, React.createElement("span",null,"5.000 €"), React.createElement("span",null,"500.000 €"))),
            React.createElement("div", null, React.createElement("label", { className:"text-xs text-white/50 uppercase tracking-wider mb-2 block" }, "Branche *"),
              React.createElement("select", { value:data.branche, onChange:function(e: any){update("branche",e.target.value)}, className:"w-full rounded-xl p-3 text-sm outline-none transition-all duration-200 appearance-none", style:Object.assign({}, inputStyle, {color:data.branche?"var(--text-primary)":"var(--text-faint)"}) },
                React.createElement("option", { value:"" }, "Branche wählen..."),
                BRANCHEN.map(function(b: string) { return React.createElement("option", { key:b, value:b, style:{background:"var(--bg-select-option)"} }, b); }))),
            React.createElement(Toggle, { value:data.foerderungen, onChange:function(v: boolean){update("foerderungen",v)}, label:"Passende Förderungen finden" })),

          step === 5 && React.createElement("div", { className:"space-y-4" },
            React.createElement("p", { className:"text-white/50 text-sm" }, "Was möchtest du in 90 Tagen erreichen?"),
            React.createElement("textarea", { rows:5, value:data.ziele, onChange:function(e: any){update("ziele",e.target.value)}, placeholder:"z.B. Firma gründen, ersten Kunden gewinnen...", className:"w-full rounded-xl p-3 text-sm text-white placeholder-white/25 outline-none resize-none transition-all duration-200", style:inputStyle, onFocus:focusIn, onBlur:focusOut })),

          React.createElement("div", { className:"flex items-center justify-between mt-8 pt-6 border-t border-white/8" },
            React.createElement("div", { className:"flex items-center gap-4" },
              React.createElement("button", { onClick:function(){if(step>1)setStep(function(s){return s-1});else if(onBack)onBack()}, className:"flex items-center gap-2 text-sm text-white/30 hover:text-white/60 transition-colors" }, React.createElement(ChevronLeft,{size:14}), step===1?"Startseite":"Zurück"),
              React.createElement("button", { onClick:onSkip, className:"text-sm text-white/20 hover:text-white/40 transition-colors underline underline-offset-2" }, "Überspringen")),
            step < TOTAL ?
              React.createElement(PrimaryButton, { onClick:function(){setStep(function(s){return s+1})}, disabled:!canNext() }, "Weiter ", React.createElement(ChevronRight,{size:16})) :
              React.createElement(PrimaryButton, { onClick:handleSubmit, disabled:!canNext()||success, loading:loading }, success ? React.createElement(React.Fragment, null, React.createElement(Check,{size:16}), " Fertig!") : React.createElement(React.Fragment, null, "Förderungen finden ", React.createElement(ArrowRight,{size:16}))))))));
};
