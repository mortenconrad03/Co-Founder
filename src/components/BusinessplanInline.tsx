/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { supabase, SUPABASE_URL } from '@/lib/supabase'
import { aiFetch } from '@/lib/aiFetch'
import { db } from '@/lib/db'
import { BP_QUESTIONS } from '@/lib/constants'
import { GlassCard, PrimaryButton, SecondaryButton, ProgressBar } from '@/components/ui'
import { ChevronLeft, ChevronRight, Sparkles, Loader2, CheckCircle, Download, Upload } from '@/components/icons'

export const BusinessplanInline = function({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  var stepState = useState(1); var step = stepState[0]; var setStep = stepState[1];
  var viewState = useState("questions"); var view = viewState[0]; var setView = viewState[1];
  var dataState = useState<any>({firma:"",idee:"",problem:"",zielgruppe:"",wettbewerb:"",geschaeftsmodell:"",marketing:[],meilensteine:"",kosten_miete:0,kosten_personal:0,kosten_marketing:0,kosten_software:0,kosten_sonstiges:0,umsatz_6:0,umsatz_12:0}); var data = dataState[0]; var setData = dataState[1];
  var savingState = useState(false); var saving = savingState[0]; var setSaving = savingState[1];
  var aiTextState = useState<any>(null); var aiText = aiTextState[0]; var setAiText = aiTextState[1];
  var aiLoadingState = useState(false); var aiLoading = aiLoadingState[0]; var setAiLoading = aiLoadingState[1];
  var aiErrorState = useState(""); var aiError = aiErrorState[0]; var setAiError = aiErrorState[1];
  var bpSavedState = useState(false); var bpSaved = bpSavedState[0]; var setBpSaved = bpSavedState[1];
  var savingDocState = useState(false); var savingDoc = savingDocState[0]; var setSavingDoc = savingDocState[1];

  var SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  var TOTAL = BP_QUESTIONS.length;
  var q = BP_QUESTIONS[step-1];
  var MARKETING_CHANNELS = ["Social Media","Google Ads","Content Marketing","Kaltakquise","Messen/Events","Empfehlungen","PR","Andere"];

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
    if (error) console.error("[BusinessplanInline] save error:", error);
    setSaving(false);
  };

  useEffect(function() {
    if (!user) return;
    supabase.from("profiles").select("businessplan_data,businessplan_result").eq("id",user.id).single().then(function(res: any) {
      if (!res.data) return;
      if (res.data.businessplan_data) {
        try { var saved = JSON.parse(res.data.businessplan_data); setData(function(p: any){return Object.assign({},p,saved)}); } catch(e) { console.error("[BusinessplanInline] parse error:", e); }
      }
      if (res.data.businessplan_result) {
        setAiText(res.data.businessplan_result);
        setView("result");
        setBpSaved(true);
      }
    });
  }, [user]);

  var saveBusinessplanToStorage = async function(textContent: string) {
    if (!user || !textContent) return;
    try {
      setSavingDoc(true);
      var datum = new Date().toLocaleDateString("de-DE");
      var aiContent = textContent.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/^###\s*(.+)/gm,'<h3>$1</h3>').replace(/^##\s*(.+)/gm,'<h2>$1</h2>').replace(/^#\s*(.+)/gm,'<h2>$1</h2>').replace(/\n/g,"<br>");
      var k = totalKosten;
      var htmlDoc = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Businessplan — '+data.firma+'</title>';
      htmlDoc += '<style>body{font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;background:#fff;color:#1a1a1a;max-width:800px;margin:0 auto;padding:60px;font-size:13px;line-height:1.8}';
      htmlDoc += 'h2{font-size:14px;font-weight:500;text-transform:uppercase;letter-spacing:-0.02em;color:rgba(0,0,0,0.5);margin:36px 0 12px;padding-bottom:8px;border-bottom:1px solid rgba(0,0,0,0.1)}';
      htmlDoc += 'h3{font-size:13px;font-weight:500;color:rgba(0,0,0,0.45);margin:24px 0 8px}p{margin:8px 0;color:#333}strong{color:#1a1a1a;font-weight:500}';
      htmlDoc += 'table{width:100%;border-collapse:collapse;margin:16px 0;font-size:12px}th{text-align:left;padding:10px 12px;color:rgba(0,0,0,0.4);font-weight:400;font-size:11px;border-bottom:1px solid rgba(0,0,0,0.1)}';
      htmlDoc += 'td{padding:10px 12px;border-bottom:1px solid rgba(0,0,0,0.06);color:#444}.total td{color:#1a1a1a;font-weight:500;border-top:1px solid rgba(0,0,0,0.15)}</style></head><body>';
      htmlDoc += '<h1 style="text-align:center;font-size:28px;font-weight:500">'+data.firma+'</h1><p style="text-align:center;color:rgba(0,0,0,0.4)">Businessplan · '+datum+'</p><hr style="border:none;border-top:1px solid rgba(0,0,0,0.1);margin:30px 0">';
      htmlDoc += '<div>'+aiContent+'</div>';
      htmlDoc += '<h2>Finanzplanung</h2><table><tr><th>Position</th><th style="text-align:right">Monatlich</th><th style="text-align:right">Jährlich</th></tr>';
      [["Miete","kosten_miete"],["Personal","kosten_personal"],["Marketing","kosten_marketing"],["Software / Tools","kosten_software"],["Sonstiges","kosten_sonstiges"]].forEach(function(r: any){
        htmlDoc += '<tr><td>'+r[0]+'</td><td style="text-align:right">'+Number(data[r[1]]).toLocaleString("de-DE")+' €</td><td style="text-align:right">'+(Number(data[r[1]])*12).toLocaleString("de-DE")+' €</td></tr>';
      });
      htmlDoc += '<tr class="total"><td>Gesamt</td><td style="text-align:right">'+k.toLocaleString("de-DE")+' €</td><td style="text-align:right">'+(k*12).toLocaleString("de-DE")+' €</td></tr></table>';
      htmlDoc += '<p style="margin-top:60px;text-align:center;color:rgba(0,0,0,0.3);font-size:11px">Erstellt mit CoFounder AI · '+datum+'</p></body></html>';

      var fileName = "Businessplan_" + data.firma.replace(/[^a-zA-Z0-9äöüÄÖÜß]/g, "_") + "_" + new Date().toISOString().split("T")[0] + ".html";
      var blob = new Blob([htmlDoc], { type: "text/html" });
      var path = user.id + "/" + Date.now() + "_" + fileName;

      var existingDocs = await db.getDocuments(user.id);
      var oldBpDocs = existingDocs.filter(function(d: any) { return d.doc_type_id === "businessplan"; });
      for (var i = 0; i < oldBpDocs.length; i++) {
        await db.deleteDocument(user.id, oldBpDocs[i].id, oldBpDocs[i].file_path);
      }

      var uploadResult = await supabase.storage.from("documents").upload(path, blob, { contentType: "text/html" });
      if (uploadResult.error) { console.error("[Documents] BP upload error:", uploadResult.error); setSavingDoc(false); return; }

      var insertResult = await supabase.from("documents").insert({
        user_id: user.id, doc_type_id: "businessplan",
        file_name: fileName, file_size: blob.size, file_path: path
      });
      if (insertResult.error) console.error("[Documents] BP insert error:", insertResult.error);
      else { setBpSaved(true); }
    } catch(e) {
      console.error("[Documents] Save BP error:", e);
    }
    setSavingDoc(false);
  };

  var handleGenerate = async function() {
    await saveToSupabase();
    setAiLoading(true); setAiError(""); setAiText(null); setBpSaved(false);
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
          if (r.error) console.error("[BusinessplanInline] BP-Result Cache-Fehler:", r.error);
        });
        saveBusinessplanToStorage(res.text);
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
    html += '<style>@page{size:A4;margin:2.5cm}body{font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;background:#fff;color:#1a1a1a;max-width:100%;margin:0;padding:60px;font-size:13px;line-height:1.8;-webkit-font-smoothing:antialiased}.cover{text-align:center;padding:120px 0 80px;border-bottom:1px solid rgba(0,0,0,0.1);margin-bottom:50px}.cover h1{font-size:28px;font-weight:500;text-transform:uppercase;letter-spacing:-0.04em;color:#1a1a1a;margin:0 0 12px}.cover p{color:rgba(0,0,0,0.4);font-size:12px;margin:4px 0}.cover .line{width:40px;height:1px;background:rgba(0,0,0,0.15);margin:24px auto}h2{font-size:14px;font-weight:500;text-transform:uppercase;letter-spacing:-0.02em;color:rgba(0,0,0,0.5);margin:36px 0 12px;padding-bottom:8px;border-bottom:1px solid rgba(0,0,0,0.1)}h3{font-size:13px;font-weight:500;color:rgba(0,0,0,0.45);margin:24px 0 8px}p{margin:8px 0;color:#333}strong{color:#1a1a1a;font-weight:500}table{width:100%;border-collapse:collapse;margin:16px 0;font-size:12px}th{text-align:left;padding:10px 12px;color:rgba(0,0,0,0.4);font-weight:400;text-transform:uppercase;letter-spacing:0.05em;font-size:11px;border-bottom:1px solid rgba(0,0,0,0.1)}td{padding:10px 12px;border-bottom:1px solid rgba(0,0,0,0.06);color:#444}.total td{color:#1a1a1a;font-weight:500;border-top:1px solid rgba(0,0,0,0.15)}.prognose{display:flex;gap:20px;margin-top:16px}.prognose-box{flex:1;padding:16px;border:1px solid rgba(0,0,0,0.1);border-radius:6px}.prognose-box .label{font-size:11px;color:rgba(0,0,0,0.4);text-transform:uppercase;letter-spacing:0.05em}.prognose-box .val{font-size:18px;color:#1a1a1a;font-weight:500;margin-top:4px}.footer{margin-top:60px;padding-top:20px;border-top:1px solid rgba(0,0,0,0.1);text-align:center;color:rgba(0,0,0,0.3);font-size:11px}.ai-content{color:#333;line-height:1.85}@media print{body{background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body>';
    html += '<div class="cover"><h1>'+data.firma+'</h1><div class="line"></div><p>Businessplan</p><p>'+datum+'</p></div>';
    if (aiContent) {
      html += '<div class="ai-content">'+aiContent+'</div>';
    } else {
      html += '<h2>1. Executive Summary</h2><p>'+data.firma+' löst das Problem: '+data.problem+'. Geschäftsidee: '+data.idee+'. Zielgruppe: '+data.zielgruppe+'.</p>';
      html += '<h2>2. Geschäftsidee</h2><p>'+data.idee+'</p>';
      html += '<h2>3. Zielgruppe</h2><p>'+data.zielgruppe+'</p>';
      html += '<h2>4. Wettbewerb</h2><p>'+data.wettbewerb+'</p>';
      html += '<h2>5. Geschäftsmodell</h2><p>'+data.geschaeftsmodell+'</p>';
      html += '<h2>6. Marketing</h2><p>'+data.marketing.join(", ")+'</p>';
      html += '<h2>7. Meilensteine</h2><p>'+data.meilensteine.replace(/\n/g,"<br>")+'</p>';
    }
    html += '<h2>Finanzplanung</h2><table><tr><th>Position</th><th style="text-align:right">Monatlich</th><th style="text-align:right">Jährlich</th></tr>';
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

  var inputStyle = { background:"var(--bg-input)", border:"1px solid var(--border-10)" };
  var focusIn = function(e: any) { e.target.style.borderColor = "var(--border-25)"; };
  var focusOut = function(e: any) { e.target.style.borderColor = "var(--border-10)"; };

  if (view === "result") {
    var fallbackCards = [
      {t:"1. Executive Summary",c:data.firma+" löst das Problem: "+data.problem+". Die Geschäftsidee: "+data.idee+". Zielgruppe: "+data.zielgruppe+". Geplanter Umsatz nach 12 Monaten: "+Number(data.umsatz_12).toLocaleString("de-DE")+" €/Monat bei "+totalKosten.toLocaleString("de-DE")+" € monatlichen Kosten."},
      {t:"2. Geschäftsidee & Wertversprechen",c:data.idee},
      {t:"3. Marktanalyse & Zielgruppe",c:data.zielgruppe},
      {t:"4. Wettbewerbsanalyse",c:data.wettbewerb},
      {t:"5. Geschäftsmodell & Preisstrategie",c:data.geschaeftsmodell},
      {t:"6. Marketing & Vertrieb",c:data.marketing.join(", ")},
      {t:"7. Meilensteine & Zeitplan",c:data.meilensteine}
    ];
    return React.createElement("div", { className:"space-y-4" },
      React.createElement("div", { className:"flex items-center justify-between mb-2" },
        React.createElement("h3", { className:"text-xl font-medium text-white" }, "Businessplan: " + data.firma),
        React.createElement("div", { className:"flex gap-2 items-center" },
          savingDoc && React.createElement("span", { className:"text-xs text-white/40 flex items-center gap-1" }, React.createElement(Loader2,{size:12,className:"animate-spin"}), "Wird gespeichert..."),
          bpSaved && !savingDoc && React.createElement("span", { className:"text-xs text-emerald-400/70 flex items-center gap-1" }, React.createElement(CheckCircle,{size:12}), "In Dokumenten gespeichert"),
          !aiLoading && React.createElement(PrimaryButton, { onClick:handlePrint, className:"text-xs py-2 px-4" }, React.createElement(Download,{size:14}), " Als PDF"),
          !aiLoading && !bpSaved && !savingDoc && aiText && React.createElement(SecondaryButton, { onClick:function(){saveBusinessplanToStorage(aiText)}, className:"text-xs py-2 px-4" }, React.createElement(Upload,{size:14}), " Speichern"),
          React.createElement(SecondaryButton, { onClick:function(){setView("questions")}, className:"text-xs py-2 px-4" }, "Bearbeiten"))),
      aiLoading && React.createElement(GlassCard, { className:"p-8 text-center" },
        React.createElement(Loader2, { size:20, className:"animate-spin text-white/30 mx-auto mb-3" }),
        React.createElement("p", { className:"text-white/40 text-sm" }, "AI generiert deinen Businessplan..."),
        React.createElement("p", { className:"text-white/20 text-xs mt-1" }, "Das kann 10–20 Sekunden dauern.")),
      aiError && React.createElement("div", { className:"mb-2 p-3 rounded-lg text-xs text-white/40 border border-white/[0.06]", style:{background:"var(--surface-2)"} }, aiError),
      aiText ? React.createElement(GlassCard, { className:"p-5" },
        React.createElement("div", { className:"text-sm text-white/70 leading-relaxed whitespace-pre-line" }, aiText))
      : !aiLoading && fallbackCards.map(function(s: any,i: number) {
        return React.createElement(GlassCard, { key:i, className:"p-5" },
          React.createElement("h4", { className:"text-white/60 text-xs uppercase tracking-wider mb-2" }, s.t),
          React.createElement("p", { className:"text-sm text-white/70 leading-relaxed whitespace-pre-line" }, s.c));
      }),
      React.createElement(GlassCard, { className:"p-5" },
        React.createElement("h4", { className:"text-white/60 text-xs uppercase tracking-wider mb-2" }, "8. Finanzplanung"),
        React.createElement("div", { className:"overflow-x-auto" },
          React.createElement("table", { className:"w-full text-sm" },
            React.createElement("thead", null, React.createElement("tr", { className:"border-b border-white/10" },
              React.createElement("th", { className:"text-left text-white/50 py-2 font-medium" }, "Position"),
              React.createElement("th", { className:"text-right text-white/50 py-2 font-medium" }, "Monatlich"),
              React.createElement("th", { className:"text-right text-white/50 py-2 font-medium" }, "Jährlich"))),
            React.createElement("tbody", null,
              [["Miete","kosten_miete"],["Personal","kosten_personal"],["Marketing","kosten_marketing"],["Software/Tools","kosten_software"],["Sonstiges","kosten_sonstiges"]].map(function(r: any) {
                return React.createElement("tr", { key:r[1], className:"border-b border-white/5" },
                  React.createElement("td", { className:"py-2 text-white/70" }, r[0]),
                  React.createElement("td", { className:"py-2 text-right text-white/70" }, Number(data[r[1]]).toLocaleString("de-DE")+" €"),
                  React.createElement("td", { className:"py-2 text-right text-white/70" }, (Number(data[r[1]])*12).toLocaleString("de-DE")+" €"));
              }),
              React.createElement("tr", { className:"border-t border-emerald-400/25 font-normal" },
                React.createElement("td", { className:"py-2 text-white" }, "Gesamt"),
                React.createElement("td", { className:"py-2 text-right text-white" }, totalKosten.toLocaleString("de-DE")+" €"),
                React.createElement("td", { className:"py-2 text-right text-white" }, (totalKosten*12).toLocaleString("de-DE")+" €"))))),
        React.createElement("div", { className:"mt-4 pt-4 border-t border-white/10" },
          React.createElement("p", { className:"text-xs text-white/40 mb-2" }, "Umsatzprognose"),
          React.createElement("div", { className:"grid grid-cols-2 gap-4" },
            React.createElement("div", { className:"p-3 rounded-xl bg-white/5" },
              React.createElement("p", { className:"text-xs text-white/40" }, "Nach 6 Monaten"),
              React.createElement("p", { className:"text-lg font-medium text-white" }, Number(data.umsatz_6).toLocaleString("de-DE")+" €/Monat")),
            React.createElement("div", { className:"p-3 rounded-xl bg-white/5" },
              React.createElement("p", { className:"text-xs text-white/40" }, "Nach 12 Monaten"),
              React.createElement("p", { className:"text-lg font-medium text-white" }, Number(data.umsatz_12).toLocaleString("de-DE")+" €/Monat"))))));
  }

  return React.createElement("div", { className:"space-y-5" },
    React.createElement(ProgressBar, { current:step, total:TOTAL }),
    React.createElement("p", { className:"text-white font-normal mt-4" }, q.label),

    q.type === "text" && React.createElement("input", { value:data[q.id]||"", onChange:function(e: any){update(q.id,e.target.value)}, placeholder:q.placeholder, className:"w-full rounded-xl p-3 text-sm text-white placeholder-white/25 outline-none transition-all duration-200", style:inputStyle, onFocus:focusIn, onBlur:focusOut }),

    q.type === "textarea" && React.createElement("textarea", { rows:4, value:data[q.id]||"", onChange:function(e: any){update(q.id,e.target.value)}, placeholder:q.placeholder, className:"w-full rounded-xl p-3 text-sm text-white placeholder-white/25 outline-none resize-none transition-all duration-200", style:inputStyle, onFocus:focusIn, onBlur:focusOut }),

    q.type === "multi" && React.createElement("div", { className:"flex flex-wrap gap-2" }, MARKETING_CHANNELS.map(function(ch: string) {
      var sel = data.marketing.indexOf(ch) >= 0;
      return React.createElement("button", { key:ch, onClick:function(){toggleMarketing(ch)}, className:"px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border", style:{borderColor:sel?"var(--border-80)":"var(--border-12)",background:sel?"var(--surface-15)":"var(--surface-3)",color:"var(--text-default)"} }, ch);
    })),

    q.type === "costs" && React.createElement("div", { className:"space-y-3" },
      [["kosten_miete","Miete/Büro"],["kosten_personal","Personal"],["kosten_marketing","Marketing"],["kosten_software","Software/Tools"],["kosten_sonstiges","Sonstiges"]].map(function(item: any) {
        return React.createElement("div", { key:item[0], className:"flex items-center gap-3" },
          React.createElement("span", { className:"text-sm text-white/60 w-32 flex-shrink-0" }, item[1]),
          React.createElement("input", { type:"number", value:data[item[0]]||"", onChange:function(e: any){update(item[0],e.target.value)}, placeholder:"0", className:"flex-1 rounded-xl p-2.5 text-sm text-white placeholder-white/25 outline-none transition-all duration-200 text-right", style:inputStyle, onFocus:focusIn, onBlur:focusOut }),
          React.createElement("span", { className:"text-sm text-white/40" }, "€"));
      }),
      React.createElement("div", { className:"flex items-center justify-between pt-3 border-t border-white/10" },
        React.createElement("span", { className:"text-sm font-normal text-white" }, "Gesamt"),
        React.createElement("span", { className:"text-lg font-medium text-white/60" }, totalKosten.toLocaleString("de-DE")+" €/Monat"))),

    q.type === "revenue" && React.createElement("div", { className:"space-y-4" },
      React.createElement("div", null,
        React.createElement("label", { className:"text-xs text-white/50 mb-2 block" }, "Nach 6 Monaten (€/Monat)"),
        React.createElement("input", { type:"number", value:data.umsatz_6||"", onChange:function(e: any){update("umsatz_6",e.target.value)}, placeholder:"z.B. 5000", className:"w-full rounded-xl p-3 text-sm text-white placeholder-white/25 outline-none transition-all duration-200", style:inputStyle, onFocus:focusIn, onBlur:focusOut })),
      React.createElement("div", null,
        React.createElement("label", { className:"text-xs text-white/50 mb-2 block" }, "Nach 12 Monaten (€/Monat)"),
        React.createElement("input", { type:"number", value:data.umsatz_12||"", onChange:function(e: any){update("umsatz_12",e.target.value)}, placeholder:"z.B. 15000", className:"w-full rounded-xl p-3 text-sm text-white placeholder-white/25 outline-none transition-all duration-200", style:inputStyle, onFocus:focusIn, onBlur:focusOut }))),

    React.createElement("div", { className:"flex items-center justify-between pt-4" },
      React.createElement("button", { onClick:function(){if(step>1)setStep(step-1)}, disabled:step===1, className:"flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors disabled:opacity-20" }, React.createElement(ChevronLeft,{size:16}), " Zurück"),
      step < TOTAL ?
        React.createElement(PrimaryButton, { onClick:function(){setStep(step+1)}, disabled:!canNext(), className:"text-xs py-2 px-5" }, "Weiter ", React.createElement(ChevronRight,{size:16})) :
        React.createElement(PrimaryButton, { onClick:handleGenerate, loading:saving, className:"text-xs py-2 px-5" }, React.createElement(Sparkles,{size:14}), " Mit AI generieren")));
};
