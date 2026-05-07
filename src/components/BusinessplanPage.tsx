/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { supabase, SUPABASE_URL } from '@/lib/supabase'
import { aiFetch } from '@/lib/aiFetch'
import { BP_QUESTIONS } from '@/lib/constants'
import { GlassCard, PrimaryButton, SecondaryButton, ProgressBar } from '@/components/ui'
import { ChevronLeft, ChevronRight, Sparkles, FileText, Loader2 } from '@/components/icons'

export const BusinessplanPage = function() {
  const { user } = useAuth();
  var stepState = useState(1); var step = stepState[0]; var setStep = stepState[1];
  var viewState = useState("questions"); var view = viewState[0]; var setView = viewState[1];
  var dataState = useState<any>({firma:"",idee:"",problem:"",zielgruppe:"",wettbewerb:"",geschaeftsmodell:"",marketing:[],meilensteine:"",kosten_miete:0,kosten_personal:0,kosten_marketing:0,kosten_software:0,kosten_sonstiges:0,umsatz_6:0,umsatz_12:0}); var data = dataState[0]; var setData = dataState[1];
  var savingState = useState(false); var saving = savingState[0]; var setSaving = savingState[1];
  var aiTextState = useState<any>(null); var aiText = aiTextState[0]; var setAiText = aiTextState[1];
  var aiLoadingState = useState(false); var aiLoading = aiLoadingState[0]; var setAiLoading = aiLoadingState[1];
  var aiErrorState = useState(""); var aiError = aiErrorState[0]; var setAiError = aiErrorState[1];

  var SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  var TOTAL = BP_QUESTIONS.length;
  var q = BP_QUESTIONS[step-1];

  var update = function(key: string, val: any) { setData(function(p: any) { return Object.assign({}, p, {[key]:val}); }); };

  var toggleMarketing = function(ch: string) {
    setData(function(p: any) {
      var arr = p.marketing.slice();
      var idx = arr.indexOf(ch);
      if (idx >= 0) arr.splice(idx, 1); else arr.push(ch);
      return Object.assign({}, p, {marketing:arr});
    });
  };

  var totalKosten = (Number(data.kosten_miete)||0)+(Number(data.kosten_personal)||0)+(Number(data.kosten_marketing)||0)+(Number(data.kosten_software)||0)+(Number(data.kosten_sonstiges)||0);

  var canNext = function() {
    if (q.type==="text") return data[q.id] && data[q.id].length > 1;
    if (q.type==="textarea") return data[q.id] && data[q.id].length > 5;
    if (q.type==="multi") return data.marketing.length > 0;
    return true;
  };

  var saveToSupabase = async function() {
    if (!user) return;
    setSaving(true);
    var bpData = JSON.stringify(data);
    var { error } = await supabase.from("profiles").upsert({id:user.id, businessplan_data:bpData}, { onConflict:"id" });
    if (error) console.error("[BusinessplanPage] save error:", error);
    setSaving(false);
  };

  var handleGenerate = async function() {
    await saveToSupabase();
    setAiLoading(true); setAiError(""); setAiText(null);
    setView("result");
    try {
      var session = await supabase.auth.getSession();
      var token = session?.data?.session?.access_token || SUPABASE_ANON_KEY;
      var resp = await aiFetch(SUPABASE_URL+"/functions/v1/generate-businessplan", {
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":"Bearer "+token,"apikey":SUPABASE_ANON_KEY},
        body:JSON.stringify({firma:data.firma,idee:data.idee,problem:data.problem,zielgruppe:data.zielgruppe,wettbewerb:data.wettbewerb,geschaeftsmodell:data.geschaeftsmodell,marketing:data.marketing.join(", "),meilensteine:data.meilensteine,kosten:{miete:data.kosten_miete,personal:data.kosten_personal,marketing:data.kosten_marketing,software:data.kosten_software,sonstiges:data.kosten_sonstiges,gesamt:totalKosten},umsatz_6:data.umsatz_6,umsatz_12:data.umsatz_12})
      });
      var res = await resp.json();
      if (!resp.ok) throw new Error(res.error || "Status "+resp.status);
      if (res && res.text) {
        setAiText(res.text);
        supabase.from("profiles").upsert({id:user!.id, businessplan_result: res.text}, { onConflict:"id" }).then(function(r: any){
          if (r.error) console.error("[BusinessplanPage] Cache-Fehler:", r.error);
        });
      } else throw new Error("Keine Antwort erhalten");
    } catch(e: any) {
      console.error("AI error:", e);
      setAiError("AI-Fehler: "+e.message);
    }
    setAiLoading(false);
  };

  var handlePrint = function() {
    var printWin = window.open("","_blank");
    if (!printWin) return;
    var k = totalKosten;
    var datum = new Date().toLocaleDateString("de-DE");
    var aiContent = "";
    if (aiText) {
      aiContent = aiText.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/^###\s*(.+)/gm,'<h3>$1</h3>').replace(/^##\s*(.+)/gm,'<h2>$1</h2>').replace(/^#\s*(.+)/gm,'<h2>$1</h2>').replace(/\n/g,"<br>");
    }
    var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Businessplan — '+data.firma+'</title>';
    html += '<style>';
    html += '@page{size:A4;margin:2.5cm}';
    html += 'body{font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;background:#fff;color:#1a1a1a;max-width:100%;margin:0;padding:60px;font-size:13px;line-height:1.8;-webkit-font-smoothing:antialiased}';
    html += '.cover{text-align:center;padding:120px 0 80px;border-bottom:1px solid rgba(0,0,0,0.1);margin-bottom:50px}';
    html += '.cover h1{font-size:28px;font-weight:500;text-transform:uppercase;letter-spacing:-0.04em;color:#1a1a1a;margin:0 0 12px}';
    html += '.cover p{color:rgba(0,0,0,0.4);font-size:12px;margin:4px 0}';
    html += '.cover .line{width:40px;height:1px;background:rgba(0,0,0,0.15);margin:24px auto}';
    html += 'h2{font-size:14px;font-weight:500;text-transform:uppercase;letter-spacing:-0.02em;color:rgba(0,0,0,0.5);margin:36px 0 12px;padding-bottom:8px;border-bottom:1px solid rgba(0,0,0,0.1)}';
    html += 'p{margin:8px 0;color:#333}';
    html += 'strong{color:#1a1a1a;font-weight:500}';
    html += 'table{width:100%;border-collapse:collapse;margin:16px 0;font-size:12px}';
    html += 'th{text-align:left;padding:10px 12px;color:rgba(0,0,0,0.4);font-weight:400;text-transform:uppercase;letter-spacing:0.05em;font-size:11px;border-bottom:1px solid rgba(0,0,0,0.1)}';
    html += 'td{padding:10px 12px;border-bottom:1px solid rgba(0,0,0,0.06);color:#444}';
    html += '.total td{color:#1a1a1a;font-weight:500;border-top:1px solid rgba(0,0,0,0.15)}';
    html += '.prognose{display:flex;gap:20px;margin-top:16px}';
    html += '.prognose-box{flex:1;padding:16px;border:1px solid rgba(0,0,0,0.1);border-radius:6px}';
    html += '.prognose-box .label{font-size:11px;color:rgba(0,0,0,0.4);text-transform:uppercase;letter-spacing:0.05em}';
    html += '.prognose-box .val{font-size:18px;color:#1a1a1a;font-weight:500;margin-top:4px}';
    html += '.footer{margin-top:60px;padding-top:20px;border-top:1px solid rgba(0,0,0,0.1);text-align:center;color:rgba(0,0,0,0.3);font-size:11px}';
    html += '.ai-content{color:#333;line-height:1.85}';
    html += '.ai-content h2{font-size:14px;font-weight:500;text-transform:uppercase;letter-spacing:-0.02em;color:rgba(0,0,0,0.5);margin:36px 0 12px;padding-bottom:8px;border-bottom:1px solid rgba(0,0,0,0.1)}';
    html += '@media print{body{background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}}';
    html += '</style></head><body>';
    html += '<div class="cover"><h1>'+data.firma+'</h1><div class="line"></div><p>Businessplan</p><p>'+datum+'</p></div>';
    if (aiContent) {
      html += '<div class="ai-content">'+aiContent+'</div>';
    } else {
      html += '<h2>1. Executive Summary</h2><p>'+data.firma+' löst das Problem: '+data.problem+'. Die Geschäftsidee: '+data.idee+'. Die Zielgruppe sind '+data.zielgruppe+'. Das Unternehmen plant einen monatlichen Umsatz von '+Number(data.umsatz_12).toLocaleString("de-DE")+' € nach 12 Monaten bei monatlichen Kosten von '+k.toLocaleString("de-DE")+' €.</p>';
      html += '<h2>2. Geschäftsidee & Wertversprechen</h2><p>'+data.idee+'</p>';
      html += '<h2>3. Marktanalyse & Zielgruppe</h2><p>'+data.problem+'</p><p>'+data.zielgruppe+'</p>';
      html += '<h2>4. Wettbewerbsanalyse</h2><p>'+data.wettbewerb+'</p>';
      html += '<h2>5. Geschäftsmodell & Preisstrategie</h2><p>'+data.geschaeftsmodell+'</p>';
      html += '<h2>6. Marketing & Vertrieb</h2><p>'+data.marketing.join(", ")+'</p>';
      html += '<h2>7. Meilensteine & Zeitplan</h2><p>'+data.meilensteine.replace(/\n/g,"<br>")+'</p>';
    }
    html += '<h2>Finanzplanung</h2>';
    html += '<table><tr><th>Position</th><th style="text-align:right">Monatlich</th><th style="text-align:right">Jährlich</th></tr>';
    [["Miete","kosten_miete"],["Personal","kosten_personal"],["Marketing","kosten_marketing"],["Software / Tools","kosten_software"],["Sonstiges","kosten_sonstiges"]].forEach(function(r: any){
      html += '<tr><td>'+r[0]+'</td><td style="text-align:right">'+Number(data[r[1]]).toLocaleString("de-DE")+' €</td><td style="text-align:right">'+(Number(data[r[1]])*12).toLocaleString("de-DE")+' €</td></tr>';
    });
    html += '<tr class="total"><td>Gesamt</td><td style="text-align:right">'+k.toLocaleString("de-DE")+' €</td><td style="text-align:right">'+(k*12).toLocaleString("de-DE")+' €</td></tr></table>';
    html += '<div class="prognose"><div class="prognose-box"><div class="label">Umsatz nach 6 Monaten</div><div class="val">'+Number(data.umsatz_6).toLocaleString("de-DE")+' € / Monat</div></div>';
    html += '<div class="prognose-box"><div class="label">Umsatz nach 12 Monaten</div><div class="val">'+Number(data.umsatz_12).toLocaleString("de-DE")+' € / Monat</div></div></div>';
    html += '<div class="footer">Erstellt mit CoFounder AI · '+datum+'</div></body></html>';
    printWin.document.write(html);
    printWin.document.close();
    setTimeout(function(){printWin!.print()},300);
  };

  useEffect(function() {
    if (!user) return;
    supabase.from("profiles").select("businessplan_data,businessplan_result").eq("id",user.id).single().then(function(res: any) {
      if (!res.data) return;
      if (res.data.businessplan_data) {
        try { var saved = JSON.parse(res.data.businessplan_data); setData(function(p: any){return Object.assign({},p,saved)}); } catch(e){ console.error("[BusinessplanPage] parse error:", e); }
      }
      if (res.data.businessplan_result) {
        setAiText(res.data.businessplan_result);
        setView("result");
      }
    });
  }, [user]);

  var inputStyle = { background:"var(--bg-input)", border:"1px solid var(--border-10)" };
  var focusIn = function(e: any) { e.target.style.borderColor="var(--border-25)"; };
  var focusOut = function(e: any) { e.target.style.borderColor="var(--border-10)"; };

  if (view === "result") {
    var fallbackSections = [
      {title:"1. Executive Summary",content:data.firma+" löst folgendes Problem: "+data.problem+" Die Geschäftsidee: "+data.idee+" Zielgruppe: "+data.zielgruppe+" Das Unternehmen plant einen monatlichen Umsatz von "+Number(data.umsatz_12).toLocaleString("de-DE")+" € nach 12 Monaten."},
      {title:"2. Geschäftsidee & Wertversprechen",content:data.idee},
      {title:"3. Marktanalyse & Zielgruppe",content:"Problem: "+data.problem+"\n\nZielgruppe: "+data.zielgruppe},
      {title:"4. Wettbewerbsanalyse",content:data.wettbewerb},
      {title:"5. Geschäftsmodell & Preisstrategie",content:data.geschaeftsmodell},
      {title:"6. Marketing & Vertrieb",content:"Geplante Kanäle: "+data.marketing.join(", ")},
      {title:"7. Meilensteine & Zeitplan",content:data.meilensteine}
    ];
    return React.createElement("div", { className:"max-w-4xl mx-auto py-10 px-6" },
      React.createElement("div", { className:"flex items-center justify-between mb-8 flex-wrap gap-4" },
        React.createElement("div", null,
          React.createElement("h1", { className:"text-3xl font-medium text-white" }, "Businessplan: "+data.firma),
          React.createElement("p", { className:"text-white/35 text-sm mt-1" }, "Erstellt am "+new Date().toLocaleDateString("de-DE"))),
        React.createElement("div", { className:"flex gap-3" },
          React.createElement(SecondaryButton, { onClick:function(){setView("questions")} }, React.createElement(ChevronLeft,{size:14}), " Bearbeiten"),
          !aiLoading && React.createElement(PrimaryButton, { onClick:handlePrint }, React.createElement(FileText,{size:14}), " Als PDF drucken"))),
      aiLoading && React.createElement(GlassCard, { className:"p-8 text-center" },
        React.createElement(Loader2, { size:20, className:"animate-spin text-white/30 mx-auto mb-3" }),
        React.createElement("p", { className:"text-white/40 text-sm" }, "AI generiert deinen Businessplan..."),
        React.createElement("p", { className:"text-white/20 text-xs mt-1" }, "Das kann 10–20 Sekunden dauern.")),
      aiError && React.createElement("div", { className:"mb-4 p-3 rounded-lg text-xs text-white/40 border border-white/[0.06]", style:{background:"var(--surface-2)"} }, aiError),
      React.createElement("div", { className:"space-y-5" },
        aiText ? React.createElement(GlassCard, { className:"p-6" },
          React.createElement("div", { className:"text-sm text-white/70 leading-relaxed whitespace-pre-line" }, aiText))
        : !aiLoading && fallbackSections.map(function(s: any,i: number) {
          return React.createElement(GlassCard, { key:i, className:"p-6" },
            React.createElement("h2", { className:"text-lg font-medium text-white/40 mb-3" }, s.title),
            React.createElement("p", { className:"text-sm text-white/60 leading-relaxed whitespace-pre-line" }, s.content));
        }),
        React.createElement(GlassCard, { className:"p-6" },
          React.createElement("h2", { className:"text-lg font-medium text-white/50 mb-4" }, "8. Finanzplanung"),
          React.createElement("div", { className:"overflow-x-auto" },
            React.createElement("table", { className:"w-full text-sm" },
              React.createElement("thead", null,
                React.createElement("tr", { className:"border-b border-white/10" },
                  React.createElement("th", { className:"text-left py-2 text-white/50 font-medium" }, "Kostenart"),
                  React.createElement("th", { className:"text-right py-2 text-white/50 font-medium" }, "Monatlich"),
                  React.createElement("th", { className:"text-right py-2 text-white/50 font-medium" }, "Jährlich"))),
              React.createElement("tbody", null,
                [{l:"Miete",v:data.kosten_miete},{l:"Personal",v:data.kosten_personal},{l:"Marketing",v:data.kosten_marketing},{l:"Software/Tools",v:data.kosten_software},{l:"Sonstiges",v:data.kosten_sonstiges}].map(function(r: any) {
                  return React.createElement("tr", { key:r.l, className:"border-b border-white/5" },
                    React.createElement("td", { className:"py-2 text-white/70" }, r.l),
                    React.createElement("td", { className:"py-2 text-right text-white/70" }, Number(r.v).toLocaleString("de-DE")+" €"),
                    React.createElement("td", { className:"py-2 text-right text-white/70" }, (Number(r.v)*12).toLocaleString("de-DE")+" €"));
                }),
                React.createElement("tr", { className:"border-t-2 border-emerald-400/25 font-medium" },
                  React.createElement("td", { className:"py-2 text-white" }, "Gesamt"),
                  React.createElement("td", { className:"py-2 text-right text-white" }, totalKosten.toLocaleString("de-DE")+" €"),
                  React.createElement("td", { className:"py-2 text-right text-white" }, (totalKosten*12).toLocaleString("de-DE")+" €"))))),
          React.createElement("h3", { className:"text-sm font-normal text-white/60 mt-6 mb-3" }, "Umsatzprognose"),
          React.createElement("div", { className:"grid grid-cols-2 gap-4" },
            React.createElement("div", { className:"p-4 rounded-xl", style:{background:"var(--surface-8)",border:"1px solid var(--border-15)"} },
              React.createElement("p", { className:"text-xs text-white/40 mb-1" }, "Nach 6 Monaten"),
              React.createElement("p", { className:"text-xl font-medium text-white" }, Number(data.umsatz_6).toLocaleString("de-DE")+" €/Monat")),
            React.createElement("div", { className:"p-4 rounded-xl", style:{background:"var(--surface-8)",border:"1px solid var(--border-15)"} },
              React.createElement("p", { className:"text-xs text-white/40 mb-1" }, "Nach 12 Monaten"),
              React.createElement("p", { className:"text-xl font-medium text-white" }, Number(data.umsatz_12).toLocaleString("de-DE")+" €/Monat"))))));
  }

  return React.createElement("div", { className:"max-w-2xl mx-auto py-10 px-6" },
    React.createElement("div", { className:"mb-8" },
      React.createElement("h1", { className:"text-3xl font-medium text-white mb-2" }, "Businessplan erstellen"),
      React.createElement("p", { className:"text-white/45 text-sm mb-6" }, "Beantworte 10 Fragen und erhalte deinen strukturierten Businessplan"),
      React.createElement(ProgressBar, { current:step, total:TOTAL })),

    React.createElement(GlassCard, { className:"p-6" },
      React.createElement("p", { className:"text-white font-normal text-lg mb-5" }, q.label),

      q.type === "text" && React.createElement("input", { value:data[q.id]||"", onChange:function(e: any){update(q.id,e.target.value)}, placeholder:q.placeholder, className:"w-full rounded-xl p-3 text-sm text-white placeholder-white/25 outline-none transition-all duration-200", style:inputStyle, onFocus:focusIn, onBlur:focusOut }),

      q.type === "textarea" && React.createElement("textarea", { rows:4, value:data[q.id]||"", onChange:function(e: any){update(q.id,e.target.value)}, placeholder:q.placeholder, className:"w-full rounded-xl p-3 text-sm text-white placeholder-white/25 outline-none resize-none transition-all duration-200", style:inputStyle, onFocus:focusIn, onBlur:focusOut }),

      q.type === "multi" && React.createElement("div", { className:"flex flex-wrap gap-3" }, (q as any).options.map(function(opt: string) {
        var sel = data.marketing.indexOf(opt) >= 0;
        return React.createElement("button", { key:opt, onClick:function(){toggleMarketing(opt)}, className:"px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border", style:{
          borderColor:sel?"var(--border-80)":"var(--border-12)",
          background:sel?"var(--surface-15)":"var(--surface-3)",
          color:"var(--text-default)"
        }}, opt);
      })),

      q.type === "costs" && React.createElement("div", { className:"space-y-4" },
        [{key:"kosten_miete",label:"Miete / Büro"},{key:"kosten_personal",label:"Personal"},{key:"kosten_marketing",label:"Marketing"},{key:"kosten_software",label:"Software / Tools"},{key:"kosten_sonstiges",label:"Sonstiges"}].map(function(f: any) {
          return React.createElement("div", { key:f.key, className:"flex items-center gap-3" },
            React.createElement("label", { className:"text-sm text-white/60 w-36 flex-shrink-0" }, f.label),
            React.createElement("div", { className:"relative flex-1" },
              React.createElement("input", { type:"number", min:0, step:50, value:data[f.key]||"", onChange:function(e: any){update(f.key,e.target.value)}, placeholder:"0", className:"w-full rounded-xl p-3 pr-8 text-sm text-white placeholder-white/25 outline-none transition-all duration-200", style:inputStyle, onFocus:focusIn, onBlur:focusOut }),
              React.createElement("span", { className:"absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-sm" }, "€")));
        }),
        React.createElement("div", { className:"flex items-center justify-between pt-3 border-t border-white/10" },
          React.createElement("span", { className:"text-sm font-medium text-white/70" }, "Summe monatlich:"),
          React.createElement("span", { className:"text-lg font-medium text-white/50" }, totalKosten.toLocaleString("de-DE")+" €"))),

      q.type === "revenue" && React.createElement("div", { className:"space-y-4" },
        React.createElement("div", null,
          React.createElement("label", { className:"text-sm text-white/60 mb-2 block" }, "Erwarteter Umsatz nach 6 Monaten (monatlich)"),
          React.createElement("div", { className:"relative" },
            React.createElement("input", { type:"number", min:0, step:100, value:data.umsatz_6||"", onChange:function(e: any){update("umsatz_6",e.target.value)}, placeholder:"0", className:"w-full rounded-xl p-3 pr-8 text-sm text-white placeholder-white/25 outline-none transition-all duration-200", style:inputStyle, onFocus:focusIn, onBlur:focusOut }),
            React.createElement("span", { className:"absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-sm" }, "€"))),
        React.createElement("div", null,
          React.createElement("label", { className:"text-sm text-white/60 mb-2 block" }, "Erwarteter Umsatz nach 12 Monaten (monatlich)"),
          React.createElement("div", { className:"relative" },
            React.createElement("input", { type:"number", min:0, step:100, value:data.umsatz_12||"", onChange:function(e: any){update("umsatz_12",e.target.value)}, placeholder:"0", className:"w-full rounded-xl p-3 pr-8 text-sm text-white placeholder-white/25 outline-none transition-all duration-200", style:inputStyle, onFocus:focusIn, onBlur:focusOut }),
            React.createElement("span", { className:"absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-sm" }, "€"))))),

    React.createElement("div", { className:"flex items-center justify-between mt-6" },
      React.createElement("button", { onClick:function(){if(step>1)setStep(function(s: number){return s-1})}, disabled:step===1, className:"flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors disabled:opacity-20" }, React.createElement(ChevronLeft,{size:16}), " Zurück"),
      step < TOTAL ?
        React.createElement(PrimaryButton, { onClick:function(){setStep(function(s: number){return s+1})}, disabled:!canNext() }, "Weiter ", React.createElement(ChevronRight,{size:16})) :
        React.createElement(PrimaryButton, { onClick:handleGenerate, loading:saving||aiLoading }, "Mit AI generieren ", React.createElement(Sparkles,{size:16}))));
};
