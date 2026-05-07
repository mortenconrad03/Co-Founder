/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState } from 'react'
import { BUNDESLAENDER, BRANCHEN } from '@/lib/constants'
import { GlassCard, PrimaryButton } from '@/components/ui'
import { Pencil, ChevronRight, Rocket, Building, Target, Minus, Plus, CheckCircle, Save } from '@/components/icons'

export const ProfileEditor = function(props: any) {
  var onboardingData = props.onboardingData;
  var onSave = props.onSave;
  var aiGenerating = props.aiGenerating;

  var openState = useState(false); var isOpen = openState[0]; var setIsOpen = openState[1];
  var savingState = useState(false); var isSaving = savingState[0]; var setIsSaving = savingState[1];
  var savedState = useState(false); var showSaved = savedState[0]; var setShowSaved = savedState[1];

  var editState = useState(function() {
    return {
      pitch: onboardingData?.pitch || "",
      problem: onboardingData?.problem || "",
      zielgruppe: onboardingData?.zielgruppe || "",
      phase: onboardingData?.phase || "idee",
      bundesland: onboardingData?.bundesland || "",
      branche: onboardingData?.branche || "",
      teamgroesse: onboardingData?.teamgroesse || 1,
      kapitalbedarf: onboardingData?.kapitalbedarf || 50000,
      investoren: onboardingData?.investoren || false,
      rechtsform: onboardingData?.rechtsform || false,
      foerderungen: onboardingData?.foerderungen !== false,
      ziele: onboardingData?.ziele || ""
    };
  });
  var editData = editState[0]; var setEditData = editState[1];

  var upd = function(key: string, val: any) { setEditData(function(p: any) { return Object.assign({}, p, {[key]:val}); }); };

  var handleSave = async function() {
    setIsSaving(true);
    var merged = Object.assign({}, onboardingData, editData, { onboarding_complete: true });
    await onSave(merged);
    setIsSaving(false);
    setShowSaved(true);
    setTimeout(function() { setShowSaved(false); }, 3000);
  };

  var inputStyle = { background:"var(--bg-input)", border:"1px solid var(--border-10)" };
  var focusIn = function(e: any) { e.target.style.borderColor = "var(--border-25)"; };
  var focusOut = function(e: any) { e.target.style.borderColor = "var(--border-10)"; };

  return React.createElement("div", { className:"mt-8" },
    React.createElement("button", { onClick:function(){setIsOpen(!isOpen)}, className:"w-full flex items-center justify-between p-4 rounded-xl border transition-all " + (isOpen ? "border-white/15 bg-white/[0.04]" : "border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.02]") },
      React.createElement("div", { className:"flex items-center gap-3" },
        React.createElement(Pencil, { size:16, className:"text-white/40" }),
        React.createElement("div", { className:"text-left" },
          React.createElement("p", { className:"text-sm text-white/70 font-medium" }, "Startup-Profil bearbeiten"),
          React.createElement("p", { className:"text-xs text-white/30" }, "Onboarding-Daten anpassen & Roadmap neu generieren"))),
      React.createElement(ChevronRight, { size:16, className:"text-white/30 transition-transform " + (isOpen ? "rotate-90" : "") })),

    isOpen && React.createElement("div", { className:"mt-3" },
      React.createElement(GlassCard, { className:"p-6" },
        React.createElement("div", { className:"mb-6" },
          React.createElement("h4", { className:"text-xs text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2" }, React.createElement(Rocket,{size:12}), "Startup Basics"),
          React.createElement("div", { className:"space-y-4" },
            React.createElement("div", null,
              React.createElement("label", { className:"text-xs text-white/50 mb-1.5 block" }, "Elevator Pitch"),
              React.createElement("textarea", { rows:3, value:editData.pitch, onChange:function(e: any){upd("pitch",e.target.value)}, className:"w-full rounded-lg p-3 text-sm text-white placeholder-white/25 outline-none resize-none transition-all", style:inputStyle, onFocus:focusIn, onBlur:focusOut })),
            React.createElement("div", { className:"grid grid-cols-2 gap-4" },
              React.createElement("div", null,
                React.createElement("label", { className:"text-xs text-white/50 mb-1.5 block" }, "Problem"),
                React.createElement("input", { value:editData.problem, onChange:function(e: any){upd("problem",e.target.value)}, className:"w-full rounded-lg p-3 text-sm text-white outline-none transition-all", style:inputStyle, onFocus:focusIn, onBlur:focusOut })),
              React.createElement("div", null,
                React.createElement("label", { className:"text-xs text-white/50 mb-1.5 block" }, "Zielgruppe"),
                React.createElement("input", { value:editData.zielgruppe, onChange:function(e: any){upd("zielgruppe",e.target.value)}, className:"w-full rounded-lg p-3 text-sm text-white outline-none transition-all", style:inputStyle, onFocus:focusIn, onBlur:focusOut }))),
            React.createElement("div", null,
              React.createElement("label", { className:"text-xs text-white/50 mb-1.5 block" }, "Phase"),
              React.createElement("div", { className:"flex gap-2 flex-wrap" },
                [{v:"idee",l:"Idee"},{v:"validiert",l:"Validiert"},{v:"mvp",l:"MVP"},{v:"gegruendet",l:"Gegründet"},{v:"wachstum",l:"Wachstum"}].map(function(o: any) {
                  return React.createElement("button", { key:o.v, onClick:function(){upd("phase",o.v)}, className:"px-3 py-1.5 rounded-lg text-xs font-medium transition-all " + (editData.phase===o.v ? "bg-emerald-500/15 text-white/70 border border-emerald-400/25" : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10") }, o.l);
                }))))),

        React.createElement("div", { className:"mb-6 pt-6 border-t border-white/[0.06]" },
          React.createElement("h4", { className:"text-xs text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2" }, React.createElement(Building,{size:12}), "Details"),
          React.createElement("div", { className:"space-y-4" },
            React.createElement("div", { className:"grid grid-cols-2 gap-4" },
              React.createElement("div", null,
                React.createElement("label", { className:"text-xs text-white/50 mb-1.5 block" }, "Bundesland"),
                React.createElement("select", { value:editData.bundesland, onChange:function(e: any){upd("bundesland",e.target.value)}, className:"w-full rounded-lg p-3 text-sm text-white outline-none transition-all appearance-none", style:inputStyle },
                  React.createElement("option", { value:"" }, "Wählen..."),
                  BUNDESLAENDER.map(function(b: string) { return React.createElement("option", { key:b, value:b, style:{background:"var(--bg-select-option)"} }, b); }))),
              React.createElement("div", null,
                React.createElement("label", { className:"text-xs text-white/50 mb-1.5 block" }, "Branche"),
                React.createElement("select", { value:editData.branche, onChange:function(e: any){upd("branche",e.target.value)}, className:"w-full rounded-lg p-3 text-sm text-white outline-none transition-all appearance-none", style:inputStyle },
                  React.createElement("option", { value:"" }, "Wählen..."),
                  BRANCHEN.map(function(b: string) { return React.createElement("option", { key:b, value:b, style:{background:"var(--bg-select-option)"} }, b); })))),
            React.createElement("div", { className:"grid grid-cols-3 gap-4" },
              React.createElement("div", null,
                React.createElement("label", { className:"text-xs text-white/50 mb-1.5 block" }, "Teamgröße"),
                React.createElement("div", { className:"flex items-center gap-3" },
                  React.createElement("button", { onClick:function(){upd("teamgroesse",Math.max(1,editData.teamgroesse-1))}, className:"w-8 h-8 rounded-lg border border-white/15 flex items-center justify-center text-white/60 hover:bg-white/5 transition-colors" }, React.createElement(Minus,{size:12})),
                  React.createElement("span", { className:"text-lg font-medium text-white w-6 text-center" }, editData.teamgroesse),
                  React.createElement("button", { onClick:function(){upd("teamgroesse",editData.teamgroesse+1)}, className:"w-8 h-8 rounded-lg border border-white/15 flex items-center justify-center text-white/60 hover:bg-white/5 transition-colors" }, React.createElement(Plus,{size:12})))),
              React.createElement("div", { className:"col-span-2" },
                React.createElement("label", { className:"text-xs text-white/50 mb-1.5 block" }, "Kapitalbedarf: " + editData.kapitalbedarf.toLocaleString("de-DE") + " €"),
                React.createElement("input", { type:"range", min:5000, max:500000, step:5000, value:editData.kapitalbedarf, onChange:function(e: any){upd("kapitalbedarf",Number(e.target.value))}, className:"w-full h-1 rounded-full outline-none cursor-pointer mt-3", style:{accentColor:"var(--text-secondary)"} }))),
            React.createElement("div", { className:"flex gap-6 flex-wrap" },
              React.createElement("label", { className:"flex items-center gap-2 cursor-pointer" },
                React.createElement("input", { type:"checkbox", checked:editData.investoren, onChange:function(){upd("investoren",!editData.investoren)}, className:"rounded" }),
                React.createElement("span", { className:"text-sm text-white/50" }, "Investoren geplant")),
              React.createElement("label", { className:"flex items-center gap-2 cursor-pointer" },
                React.createElement("input", { type:"checkbox", checked:editData.rechtsform, onChange:function(){upd("rechtsform",!editData.rechtsform)}, className:"rounded" }),
                React.createElement("span", { className:"text-sm text-white/50" }, "Rechtsform gewählt")),
              React.createElement("label", { className:"flex items-center gap-2 cursor-pointer" },
                React.createElement("input", { type:"checkbox", checked:editData.foerderungen, onChange:function(){upd("foerderungen",!editData.foerderungen)}, className:"rounded" }),
                React.createElement("span", { className:"text-sm text-white/50" }, "Förderungen finden"))))),

        React.createElement("div", { className:"mb-6 pt-6 border-t border-white/[0.06]" },
          React.createElement("h4", { className:"text-xs text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2" }, React.createElement(Target,{size:12}), "Ziele"),
          React.createElement("textarea", { rows:3, value:editData.ziele, onChange:function(e: any){upd("ziele",e.target.value)}, placeholder:"Was möchtest du in 90 Tagen erreichen?", className:"w-full rounded-lg p-3 text-sm text-white placeholder-white/25 outline-none resize-none transition-all", style:inputStyle, onFocus:focusIn, onBlur:focusOut })),

        React.createElement("div", { className:"flex items-center justify-between pt-4 border-t border-white/[0.06]" },
          React.createElement("p", { className:"text-xs text-white/30" }, "Nach dem Speichern wird deine Roadmap automatisch neu generiert."),
          React.createElement("div", { className:"flex items-center gap-3" },
            showSaved && React.createElement("span", { className:"text-xs text-emerald-400/70 flex items-center gap-1" }, React.createElement(CheckCircle,{size:12}), "Gespeichert & neu generiert"),
            React.createElement(PrimaryButton, { onClick:handleSave, disabled:isSaving||aiGenerating, loading:isSaving||aiGenerating, className:"text-sm" },
              isSaving || aiGenerating ? "Wird generiert..." : React.createElement(React.Fragment, null, React.createElement(Save,{size:14}), " Speichern & neu generieren")))))));
};
