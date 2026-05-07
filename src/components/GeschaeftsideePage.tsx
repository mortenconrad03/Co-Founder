'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { BRANCHEN, BUNDESLAENDER } from '@/lib/constants';
import {
  Lightbulb, Rocket, Target, Building,
  Minus, Plus, CheckCircle, Save, Sparkles, Loader2
} from '@/components/icons';
import { GlassCard, PrimaryButton, NextActionBanner } from '@/components/ui';

export function GeschaeftsideePage(props: any) {
  var onNavigate = props && props.onNavigate;
  const { user } = useAuth();
  var loadState = useState(true); var isLoading = loadState[0]; var setIsLoading = loadState[1];
  var obState = useState<any>(null); var ob = obState[0]; var setOb = obState[1];
  var savState = useState(false); var isSaving = savState[0]; var setIsSaving = savState[1];
  var savedState = useState(false); var showSaved = savedState[0]; var setShowSaved = savedState[1];
  var editState = useState({pitch:"",problem:"",zielgruppe:"",phase:"idee",bundesland:"",branche:"",teamgroesse:1,kapitalbedarf:50000,investoren:false,rechtsform:false,foerderungen:true,ziele:""});
  var form = editState[0]; var setForm = editState[1];

  useEffect(function() {
    if (!user) return;
    db.getOnboarding(user.id).then(function(data: any) {
      if (data) {
        setOb(data);
        setForm({pitch:data.pitch||"",problem:data.problem||"",zielgruppe:data.zielgruppe||"",phase:data.phase||"idee",bundesland:data.bundesland||"",branche:data.branche||"",teamgroesse:data.teamgroesse||1,kapitalbedarf:data.kapitalbedarf||50000,investoren:data.investoren||false,rechtsform:data.rechtsform||false,foerderungen:data.foerderungen!==false,ziele:data.ziele||""});
      }
      setIsLoading(false);
    });
  }, [user]);

  var upd = function(key: string, val: any) { setForm(function(p: any) { return Object.assign({}, p, {[key]:val}); }); };

  var handleSave = async function() {
    if (!user) return;
    setIsSaving(true);
    var merged = Object.assign({}, ob, form, { onboarding_complete: true });
    await db.saveOnboarding(user.id, merged);
    setOb(merged);
    setIsSaving(false);
    setShowSaved(true);
    setTimeout(function() { setShowSaved(false); }, 3000);
  };

  var inputStyle = { background:"var(--bg-input)", border:"1px solid var(--border-10)" };
  var focusIn = function(e: any) { e.target.style.borderColor = "var(--border-25)"; };
  var focusOut = function(e: any) { e.target.style.borderColor = "var(--border-10)"; };

  if (isLoading) return React.createElement("div", { className:"max-w-3xl mx-auto py-20 px-6 text-center" },
    React.createElement(Loader2, { size:24, className:"animate-spin text-white/40 mx-auto" }));

  var isNew = !ob || !ob.onboarding_complete;

  return React.createElement("div", { className:"max-w-4xl mx-auto py-10 px-6" },
    React.createElement("div", { className:"flex items-center gap-3 mb-8" },
      React.createElement("div", { className:"w-10 h-10 rounded-xl flex items-center justify-center", style:{background:"var(--icon-gradient)",border:"1px solid var(--border-30)"} },
        React.createElement(Lightbulb, { size:20, className:"text-white/60" })),
      React.createElement("div", null,
        React.createElement("h1", { className:"text-3xl font-medium text-white" }, "Geschäftsidee"),
        React.createElement("p", { className:"text-white/40 text-sm" }, isNew ? "Lege jetzt dein Startup-Profil an" : "Schärfe deine Idee und dein Startup-Profil"))),

    !isNew && React.createElement(NextActionBanner, { page:"geschaeftsidee", userData:ob, onNavigate:onNavigate, context:{ has_pitch: !!form.pitch, has_problem: !!form.problem, has_zielgruppe: !!form.zielgruppe, has_branche: !!form.branche } }),

    isNew && React.createElement("div", { className:"mb-6 p-4 rounded-xl flex items-start gap-3", style:{background:"var(--surface-5)",border:"1px solid var(--border-15)"} },
      React.createElement(Sparkles, { size:16, className:"text-white/50 flex-shrink-0 mt-0.5" }),
      React.createElement("div", null,
        React.createElement("p", { className:"text-sm text-white/70 font-medium mb-1" }, "Noch kein Profil — f\xfclle die Felder unten aus"),
        React.createElement("p", { className:"text-xs text-white/40" }, "Sobald du auf Speichern klickst, wird dein Profil angelegt und alle KI-Features (Roadmap, Marktanalyse, F\xf6rderung etc.) freigeschaltet."))),

    React.createElement(GlassCard, { className:"p-6 mb-6" },
      React.createElement("h3", { className:"text-xs text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2" }, React.createElement(Rocket,{size:12}), "Elevator Pitch"),
      React.createElement("textarea", { rows:4, value:form.pitch, onChange:function(e: any){upd("pitch",e.target.value)}, placeholder:"Beschreibe deine Gesch\xe4ftsidee in 2-3 S\xe4tzen...", className:"w-full rounded-lg p-3 text-sm text-white placeholder-white/25 outline-none resize-none transition-all", style:inputStyle, onFocus:focusIn, onBlur:focusOut })),

    React.createElement(GlassCard, { className:"p-6 mb-6" },
      React.createElement("h3", { className:"text-xs text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2" }, React.createElement(Target,{size:12}), "Problem & Zielgruppe"),
      React.createElement("div", { className:"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" },
        React.createElement("div", null,
          React.createElement("label", { className:"text-xs text-white/50 mb-1.5 block" }, "Welches Problem l\xf6st du?"),
          React.createElement("textarea", { rows:3, value:form.problem, onChange:function(e: any){upd("problem",e.target.value)}, placeholder:"Das konkrete Problem deiner Kunden...", className:"w-full rounded-lg p-3 text-sm text-white placeholder-white/25 outline-none resize-none transition-all", style:inputStyle, onFocus:focusIn, onBlur:focusOut })),
        React.createElement("div", null,
          React.createElement("label", { className:"text-xs text-white/50 mb-1.5 block" }, "Wer ist deine Zielgruppe?"),
          React.createElement("textarea", { rows:3, value:form.zielgruppe, onChange:function(e: any){upd("zielgruppe",e.target.value)}, placeholder:"Alter, Beruf, Bed\xfcrfnisse...", className:"w-full rounded-lg p-3 text-sm text-white placeholder-white/25 outline-none resize-none transition-all", style:inputStyle, onFocus:focusIn, onBlur:focusOut }))),
      React.createElement("div", null,
        React.createElement("label", { className:"text-xs text-white/50 mb-1.5 block" }, "Deine Ziele f\xfcr die n\xe4chsten 90 Tage"),
        React.createElement("textarea", { rows:2, value:form.ziele, onChange:function(e: any){upd("ziele",e.target.value)}, placeholder:"Was m\xf6chtest du erreichen?", className:"w-full rounded-lg p-3 text-sm text-white placeholder-white/25 outline-none resize-none transition-all", style:inputStyle, onFocus:focusIn, onBlur:focusOut }))),

    React.createElement(GlassCard, { className:"p-6 mb-6" },
      React.createElement("h3", { className:"text-xs text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2" }, React.createElement(Building,{size:12}), "Startup-Details"),
      React.createElement("div", { className:"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" },
        React.createElement("div", null,
          React.createElement("label", { className:"text-xs text-white/50 mb-1.5 block" }, "Phase"),
          React.createElement("div", { className:"flex gap-2 flex-wrap" },
            [{v:"idee",l:"Idee"},{v:"validiert",l:"Validiert"},{v:"mvp",l:"MVP"},{v:"gegruendet",l:"Gegr\xfcndet"},{v:"wachstum",l:"Wachstum"}].map(function(o: any) {
              return React.createElement("button", { key:o.v, onClick:function(){upd("phase",o.v)}, className:"px-3 py-1.5 rounded-lg text-xs font-medium transition-all " + (form.phase===o.v ? "bg-emerald-500/15 text-white/70 border border-emerald-400/25" : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10") }, o.l);
            }))),
        React.createElement("div", null,
          React.createElement("label", { className:"text-xs text-white/50 mb-1.5 block" }, "Branche"),
          React.createElement("select", { value:form.branche, onChange:function(e: any){upd("branche",e.target.value)}, className:"w-full rounded-lg p-3 text-sm text-white outline-none transition-all appearance-none", style:inputStyle },
            React.createElement("option", { value:"" }, "W\xe4hlen..."),
            BRANCHEN.map(function(b: string) { return React.createElement("option", { key:b, value:b, style:{background:"var(--bg-select-option)"} }, b); })))),
      React.createElement("div", { className:"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" },
        React.createElement("div", null,
          React.createElement("label", { className:"text-xs text-white/50 mb-1.5 block" }, "Bundesland"),
          React.createElement("select", { value:form.bundesland, onChange:function(e: any){upd("bundesland",e.target.value)}, className:"w-full rounded-lg p-3 text-sm text-white outline-none transition-all appearance-none", style:inputStyle },
            React.createElement("option", { value:"" }, "W\xe4hlen..."),
            BUNDESLAENDER.map(function(b: string) { return React.createElement("option", { key:b, value:b, style:{background:"var(--bg-select-option)"} }, b); }))),
        React.createElement("div", null,
          React.createElement("label", { className:"text-xs text-white/50 mb-1.5 block" }, "Teamgr\xf6\xdfe"),
          React.createElement("div", { className:"flex items-center gap-3 mt-1" },
            React.createElement("button", { onClick:function(){upd("teamgroesse",Math.max(1,form.teamgroesse-1))}, className:"w-8 h-8 rounded-lg border border-white/15 flex items-center justify-center text-white/60 hover:bg-white/5 transition-colors" }, React.createElement(Minus,{size:12})),
            React.createElement("span", { className:"text-lg font-medium text-white w-6 text-center" }, form.teamgroesse),
            React.createElement("button", { onClick:function(){upd("teamgroesse",form.teamgroesse+1)}, className:"w-8 h-8 rounded-lg border border-white/15 flex items-center justify-center text-white/60 hover:bg-white/5 transition-colors" }, React.createElement(Plus,{size:12}))))),
      React.createElement("div", { className:"mb-4" },
        React.createElement("label", { className:"text-xs text-white/50 mb-1.5 block" }, "Kapitalbedarf: " + form.kapitalbedarf.toLocaleString("de-DE") + " €"),
        React.createElement("input", { type:"range", min:5000, max:500000, step:5000, value:form.kapitalbedarf, onChange:function(e: any){upd("kapitalbedarf",Number(e.target.value))}, className:"w-full h-1 rounded-full outline-none cursor-pointer mt-2", style:{accentColor:"var(--text-secondary)"} })),
      React.createElement("div", { className:"flex gap-6 flex-wrap" },
        React.createElement("label", { className:"flex items-center gap-2 cursor-pointer" },
          React.createElement("input", { type:"checkbox", checked:form.investoren, onChange:function(){upd("investoren",!form.investoren)}, className:"rounded" }),
          React.createElement("span", { className:"text-sm text-white/50" }, "Investoren geplant")),
        React.createElement("label", { className:"flex items-center gap-2 cursor-pointer" },
          React.createElement("input", { type:"checkbox", checked:form.rechtsform, onChange:function(){upd("rechtsform",!form.rechtsform)}, className:"rounded" }),
          React.createElement("span", { className:"text-sm text-white/50" }, "Rechtsform gew\xe4hlt")),
        React.createElement("label", { className:"flex items-center gap-2 cursor-pointer" },
          React.createElement("input", { type:"checkbox", checked:form.foerderungen, onChange:function(){upd("foerderungen",!form.foerderungen)}, className:"rounded" }),
          React.createElement("span", { className:"text-sm text-white/50" }, "F\xf6rderungen finden")))),

    React.createElement("div", { className:"flex items-center justify-between" },
      React.createElement("p", { className:"text-xs text-white/30" }, "\xc4nderungen werden in deinem Profil gespeichert und verbessern alle KI-Analysen."),
      React.createElement("div", { className:"flex items-center gap-3" },
        showSaved && React.createElement("span", { className:"text-xs text-emerald-400/70 flex items-center gap-1" }, React.createElement(CheckCircle,{size:12}), "Gespeichert"),
        React.createElement(PrimaryButton, { onClick:handleSave, disabled:isSaving, loading:isSaving, className:"text-sm" },
          isSaving ? "Speichert..." : React.createElement(React.Fragment, null, React.createElement(Save,{size:14}), " Speichern")))));
}
