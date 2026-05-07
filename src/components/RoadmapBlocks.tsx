/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState } from 'react'
import { GlassCard } from '@/components/ui'
import { Check, ChevronDown, Plus, Trash2 } from '@/components/icons'

export const RoadmapWeekBlock = function(props: any) {
  var openState = useState(props.week <= 4); var isOpen = openState[0]; var setOpen = openState[1];
  var addingState = useState(false); var isAdding = addingState[0]; var setIsAdding = addingState[1];
  var newTitleState = useState(""); var newTitle = newTitleState[0]; var setNewTitle = newTitleState[1];
  var newDescState = useState(""); var newDesc = newDescState[0]; var setNewDesc = newDescState[1];

  var doneCount = props.tasks.filter(function(t: any){return props.completedTasks[t.id]}).length;
  var allDone = doneCount === props.tasks.length && props.tasks.length > 0;
  var cc: Record<string, string> = {"Recht & Gründung":"text-blue-400 bg-blue-500/10 border-blue-400/30","Finanzierung & Förderung":"text-white/60 bg-white/[0.04] border-white/[0.1]","Unterlagen":"text-amber-400 bg-amber-500/10 border-amber-400/30","Markt & Produkt":"text-white/60 bg-white/[0.04] border-emerald-400/25","Eigene Aufgabe":"text-white/60 bg-white/[0.04] border-white/[0.12]"};

  var handleAdd = function() {
    if (!newTitle.trim()) return;
    props.onAddTask(props.week, newTitle, newDesc);
    setNewTitle("");
    setNewDesc("");
    setIsAdding(false);
  };

  var handleKeyDown = function(e: any) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAdd(); }
    if (e.key === "Escape") { setIsAdding(false); setNewTitle(""); setNewDesc(""); }
  };

  return React.createElement(GlassCard, { className:"overflow-hidden" },
    React.createElement("button", { onClick:function(){setOpen(!isOpen)}, className:"w-full p-5 flex items-center justify-between hover:bg-white/5 transition-all" },
      React.createElement("div", { className:"flex items-center gap-4" },
        React.createElement("div", { className:"w-12 h-12 rounded-xl flex items-center justify-center font-medium text-lg "+(allDone?"bg-white/[0.06] text-white/60":"bg-white/[0.04] text-white/50") }, String(props.week)),
        React.createElement("div", { className:"text-left" }, React.createElement("p",{className:"text-white font-normal"},"Woche "+props.week), React.createElement("p",{className:"text-white/40 text-sm"},doneCount+"/"+props.tasks.length+" erledigt"))),
      React.createElement("div", { className:"flex items-center gap-3" }, allDone && React.createElement(Check,{size:20,className:"text-white/60"}),
        React.createElement(ChevronDown, { size:20, className:"text-white/40 transition-transform "+(isOpen?"rotate-180":"") }))),
    isOpen && React.createElement("div", { className:"px-5 pb-5 space-y-2" },
      props.tasks.map(function(task: any) {
        var pageMap: Record<string, string> = {cockpit:"dashboard",gewerbe:"rechtliches",foerderprogramme:"finanzierung",marktanalyse:"businessplan"};
        var rawLink = task.link ? task.link.replace("/","") : "geschaeftsidee";
        var mappedLink = pageMap[rawLink] || rawLink;
        return React.createElement(RoadmapTaskRow, { key:task.id, task:task, completed:props.completedTasks[task.id], onToggle:function(){props.onToggle(task.id)}, onOpen:function(){props.onNavigate(mappedLink)}, categoryColor:cc[task.category]||cc["Eigene Aufgabe"], onDelete:task.isCustom ? function(){props.onDeleteTask(task.id)} : null });
      }),

      isAdding ? React.createElement("div", { className:"p-3 rounded-xl border border-white/[0.1] fadeIn", style:{background:"var(--surface-3)"} },
        React.createElement("input", {
          type:"text", value:newTitle, onChange:function(e: any){setNewTitle(e.target.value)}, onKeyDown:handleKeyDown,
          placeholder:"Aufgabe...", autoFocus:true,
          className:"w-full text-sm text-white placeholder-white/25 outline-none mb-2 bg-transparent"
        }),
        React.createElement("input", {
          type:"text", value:newDesc, onChange:function(e: any){setNewDesc(e.target.value)}, onKeyDown:handleKeyDown,
          placeholder:"Beschreibung (optional)",
          className:"w-full text-xs text-white/60 placeholder-white/20 outline-none mb-3 bg-transparent"
        }),
        React.createElement("div", { className:"flex items-center gap-2" },
          React.createElement("button", { onClick:handleAdd, disabled:!newTitle.trim(), className:"px-3 py-1.5 rounded-lg text-xs font-medium transition-all " + (newTitle.trim() ? "bg-white/10 text-white/80 border border-white/15 hover:bg-white/15" : "bg-white/5 text-white/20 border border-white/[0.06]") }, "Hinzufügen"),
          React.createElement("button", { onClick:function(){setIsAdding(false);setNewTitle("");setNewDesc("")}, className:"px-3 py-1.5 rounded-lg text-xs text-white/30 hover:text-white/60 transition-colors" }, "Abbrechen")))

      : React.createElement("button", { onClick:function(){setIsAdding(true)}, className:"flex items-center gap-2 w-full p-2.5 rounded-xl text-xs text-white/25 hover:text-white/50 hover:bg-white/[0.03] transition-all border border-dashed border-white/[0.06] hover:border-white/[0.12]" },
          React.createElement(Plus, { size:14 }), "Eigene Aufgabe hinzufügen")));
};

export const RoadmapTaskRow = function(props: any) {
  var pc: Record<string, string> = {hoch:"bg-red-500/10 text-red-400 border-red-400/30",mittel:"bg-amber-500/10 text-amber-400 border-amber-400/30",optional:"bg-white/5 text-white/40 border-white/10"};
  var pl = props.task.priority==="hoch"?"Priorität: Hoch":props.task.priority==="mittel"?"Mittel":"Optional";
  var isCustom = props.task.isCustom;
  return React.createElement("div", { className:"flex items-start gap-3 p-3 rounded-xl transition-all group "+(props.completed?"bg-white/5 opacity-60":"hover:bg-white/5") },
    React.createElement("button", { onClick:props.onToggle, className:"mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all "+(props.completed?"bg-emerald-500/15 border-emerald-400":"border-white/20 hover:border-white/[0.12]") }, props.completed && React.createElement(Check,{size:12,className:"text-white/50"})),
    React.createElement("div", { className:"flex-1 min-w-0" },
      React.createElement("div", { className:"flex items-center gap-2" },
        React.createElement("p", { className:"text-sm font-medium transition-all "+(props.completed?"text-white/30 line-through":"text-white/90") }, props.task.title),
        isCustom && React.createElement("span", { className:"text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-white/25 border border-white/[0.06]" }, "Eigene")),
      props.task.description && React.createElement("p", { className:"text-xs text-white/40 mt-0.5" }, props.task.description),
      !isCustom && React.createElement("div", { className:"flex flex-wrap gap-2 mt-2" },
        React.createElement("span", { className:"text-xs px-2 py-0.5 rounded-full border "+props.categoryColor }, props.task.category),
        React.createElement("span", { className:"text-xs px-2 py-0.5 rounded-full border "+pc[props.task.priority] }, pl),
        props.task.effort && React.createElement("span", { className:"text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10" }, "⏱ "+props.task.effort))),
    isCustom && props.onDelete && React.createElement("button", { onClick:props.onDelete, className:"flex-shrink-0 p-1.5 rounded-lg text-white/15 hover:text-red-400/60 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100", title:"Aufgabe löschen" }, React.createElement(Trash2, {size:14})),
    !isCustom && !props.completed && props.task.link!=="/dashboard" && React.createElement("button", { onClick:props.onOpen, className:"flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] text-white/50 border border-emerald-400/25 hover:bg-emerald-500/15 transition-all" }, "Öffnen"));
};
