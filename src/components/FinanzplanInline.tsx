/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { supabase, SUPABASE_URL } from '@/lib/supabase'
import { aiFetch } from '@/lib/aiFetch'
import { db } from '@/lib/db'
import { FP_QUESTIONS } from '@/lib/constants'
import { GlassCard, PrimaryButton, SecondaryButton } from '@/components/ui'
import { ChevronLeft, ChevronRight, Sparkles, Loader2, CheckCircle, Download, FileText, AlertCircle } from '@/components/icons'

export const FinanzplanInline = function({ onClose, userData }: { onClose: () => void; userData?: any }) {
  const { user } = useAuth();
  var stepState = useState(0); var step = stepState[0]; var setStep = stepState[1];
  var viewState = useState("questions"); var view = viewState[0]; var setView = viewState[1];
  var dataState = useState<any>({
    preismodell:"",preis_pro_einheit:49,kunden_12_monate:50,umsatz_6:2000,umsatz_12:8000,
    kosten_personal:2500,kosten_miete:300,kosten_marketing:500,kosten_software:150,kosten_sonstiges:200,
    eigenkapital:10000,kapitalbedarf:50000,rechtsform_fp:"Noch nicht entschieden",besonderheiten:""
  }); var data = dataState[0]; var setData = dataState[1];
  var aiState = useState<any>(null); var aiResult = aiState[0]; var setAiResult = aiState[1];
  var loadingState = useState(false); var isLoading = loadingState[0]; var setIsLoading = loadingState[1];
  var errorState = useState(""); var error = errorState[0]; var setError = errorState[1];
  var savedState = useState(false); var fpSaved = savedState[0]; var setFpSaved = savedState[1];
  var savingState = useState(false); var savingDoc = savingState[0]; var setSavingDoc = savingState[1];

  var SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  var TOTAL = FP_QUESTIONS.length;
  var currentStep = FP_QUESTIONS[step];

  var upd = function(key: string, val: any) { setData(function(p: any) { return Object.assign({}, p, {[key]:val}); }); };

  var inputStyle = { background:"var(--bg-input)", border:"1px solid var(--border-10)" };
  var focusIn = function(e: any) { e.target.style.borderColor = "var(--border-25)"; };
  var focusOut = function(e: any) { e.target.style.borderColor = "var(--border-10)"; };

  var totalMonatlich = (Number(data.kosten_personal)||0)+(Number(data.kosten_miete)||0)+(Number(data.kosten_marketing)||0)+(Number(data.kosten_software)||0)+(Number(data.kosten_sonstiges)||0);

  var saveFinanzplanToStorage = async function(fp: any) {
    if (!user || !fp) return;
    try {
      setSavingDoc(true);
      var datum = new Date().toLocaleDateString("de-DE");
      var htmlDoc = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Finanzplan</title>';
      htmlDoc += '<style>body{font-family:"Helvetica Neue",Arial,sans-serif;background:#fff;color:#1a1a1a;max-width:800px;margin:0 auto;padding:60px;font-size:13px;line-height:1.7}';
      htmlDoc += 'h1{font-size:24px;font-weight:500;text-align:center}h2{font-size:14px;font-weight:500;text-transform:uppercase;color:rgba(0,0,0,0.5);margin:32px 0 12px;padding-bottom:6px;border-bottom:1px solid rgba(0,0,0,0.1)}';
      htmlDoc += 'table{width:100%;border-collapse:collapse;margin:12px 0;font-size:12px}th{text-align:left;padding:8px;color:rgba(0,0,0,0.4);font-size:11px;border-bottom:1px solid rgba(0,0,0,0.1)}';
      htmlDoc += 'td{padding:8px;border-bottom:1px solid rgba(0,0,0,0.06)}.total td{font-weight:500;border-top:1px solid rgba(0,0,0,0.15)}.right{text-align:right}';
      htmlDoc += '.kpi{display:inline-block;padding:12px 20px;border:1px solid rgba(0,0,0,0.1);border-radius:6px;margin:4px;text-align:center}.kpi .val{font-size:18px;font-weight:500}.kpi .label{font-size:10px;color:rgba(0,0,0,0.4);text-transform:uppercase}</style></head><body>';
      htmlDoc += '<h1>Finanzplan</h1><p style="text-align:center;color:rgba(0,0,0,0.4)">3-Jahres-Prognose · '+datum+'</p><hr style="border:none;border-top:1px solid rgba(0,0,0,0.1);margin:24px 0">';
      htmlDoc += '<p>'+fp.zusammenfassung+'</p>';
      if(fp.gruendungskosten){htmlDoc+='<h2>Gründungskosten</h2><table><tr><th>Position</th><th class="right">Betrag</th><th>Hinweis</th></tr>';
      fp.gruendungskosten.positionen.forEach(function(p: any){htmlDoc+='<tr><td>'+p.name+'</td><td class="right">'+p.betrag.toLocaleString("de-DE")+' €</td><td style="color:rgba(0,0,0,0.4)">'+p.hinweis+'</td></tr>';});
      htmlDoc+='<tr class="total"><td>Gesamt</td><td class="right">'+fp.gruendungskosten.gesamt.toLocaleString("de-DE")+' €</td><td></td></tr></table>';}
      if(fp.monatliche_kosten){htmlDoc+='<h2>Monatliche Fixkosten</h2><table><tr><th>Position</th><th class="right">Betrag</th></tr>';
      fp.monatliche_kosten.fix.forEach(function(p: any){htmlDoc+='<tr><td>'+p.name+'</td><td class="right">'+p.betrag.toLocaleString("de-DE")+' €</td></tr>';});
      htmlDoc+='<tr class="total"><td>Gesamt Fix</td><td class="right">'+fp.monatliche_kosten.gesamt_fix.toLocaleString("de-DE")+' €</td></tr></table>';}
      if(fp.umsatzprognose){htmlDoc+='<h2>Umsatzprognose</h2><p>'+fp.umsatzprognose.modell+'</p><table><tr><th>Monat</th><th class="right">Best Case</th><th class="right">Normal</th><th class="right">Worst Case</th></tr>';
      fp.umsatzprognose.monate.forEach(function(m: any){htmlDoc+='<tr><td>Monat '+m.monat+'</td><td class="right">'+m.best.toLocaleString("de-DE")+' €</td><td class="right">'+m.normal.toLocaleString("de-DE")+' €</td><td class="right">'+m.worst.toLocaleString("de-DE")+' €</td></tr>';});
      htmlDoc+='</table>';}
      if(fp.kennzahlen){htmlDoc+='<h2>Kennzahlen</h2><div>';
      htmlDoc+='<div class="kpi"><div class="val">'+fp.kennzahlen.break_even_monatlich.toLocaleString("de-DE")+' €</div><div class="label">Break-Even</div></div>';
      htmlDoc+='<div class="kpi"><div class="val">'+fp.kennzahlen.marge_prozent+'%</div><div class="label">Marge</div></div>';
      htmlDoc+='<div class="kpi"><div class="val">'+fp.kennzahlen.burn_rate_monatlich.toLocaleString("de-DE")+' €</div><div class="label">Burn Rate</div></div></div>';}
      if(fp.empfehlungen){htmlDoc+='<h2>Empfehlungen</h2><ul>';fp.empfehlungen.forEach(function(e: any){htmlDoc+='<li>'+e+'</li>';});htmlDoc+='</ul>';}
      htmlDoc+='<p style="margin-top:40px;text-align:center;color:rgba(0,0,0,0.3);font-size:11px">Erstellt mit CoFounder AI · '+datum+'</p></body></html>';

      var fileName = "Finanzplan_" + new Date().toISOString().split("T")[0] + ".html";
      var blob = new Blob([htmlDoc], { type: "text/html" });
      var path = user.id + "/" + Date.now() + "_" + fileName;
      var existingDocs = await db.getDocuments(user.id);
      var oldFpDocs = existingDocs.filter(function(d: any) { return d.doc_type_id === "finanzplan"; });
      for (var i = 0; i < oldFpDocs.length; i++) { await db.deleteDocument(user.id, oldFpDocs[i].id, oldFpDocs[i].file_path); }
      var uploadRes = await supabase.storage.from("documents").upload(path, blob, { contentType: "text/html" });
      if (uploadRes.error) { console.error("[Documents] FP upload error:", uploadRes.error); setSavingDoc(false); return; }
      var insertRes = await supabase.from("documents").insert({ user_id: user.id, doc_type_id: "finanzplan", file_name: fileName, file_size: blob.size, file_path: path });
      if (insertRes.error) console.error("[Documents] FP insert error:", insertRes.error);
      else { setFpSaved(true); }
    } catch(e) { console.error("[Documents] Save FP error:", e); }
    setSavingDoc(false);
  };

  useEffect(function() {
    if (!user) return;
    supabase.from("profiles").select("finanzplan_data,finanzplan_result").eq("id",user.id).single().then(function(res: any) {
      if (!res.data) return;
      if (res.data.finanzplan_data) {
        try {
          var saved = typeof res.data.finanzplan_data === "string" ? JSON.parse(res.data.finanzplan_data) : res.data.finanzplan_data;
          setData(function(p: any){return Object.assign({},p,saved)});
        } catch(e) { console.error("[FinanzplanInline] parse error:", e); }
      }
      if (res.data.finanzplan_result) {
        var fp = typeof res.data.finanzplan_result === "string" ? JSON.parse(res.data.finanzplan_result) : res.data.finanzplan_result;
        setAiResult(fp);
        setView("result");
        setFpSaved(true);
      }
    });
  }, [user]);

  var handleGenerate = async function() {
    setIsLoading(true); setError(""); setAiResult(null); setFpSaved(false);
    setView("result");
    try {
      if (user) {
        supabase.from("profiles").upsert({id:user.id, finanzplan_data: data}, { onConflict:"id" }).then(function(r: any){
          if (r.error) console.error("[FinanzplanInline] Inputs-Cache-Fehler:", r.error);
        });
      }
      var session = await supabase.auth.getSession();
      var token = session?.data?.session?.access_token || SUPABASE_ANON_KEY;
      var payload = Object.assign({}, data, {
        idee: userData?.pitch || "", branche: userData?.branche || "",
        phase: userData?.phase || "idee", bundesland: userData?.bundesland || "",
        teamgroesse: userData?.teamgroesse || 1, investoren: userData?.investoren || false,
        foerderungen: userData?.foerderungen !== false, rechtsform: data.rechtsform_fp
      });
      var resp = await aiFetch(SUPABASE_URL + "/functions/v1/generate-finanzplan", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token, "apikey": SUPABASE_ANON_KEY },
        body: JSON.stringify(payload)
      });
      var text = await resp.text();
      var res: any;
      try { res = JSON.parse(text); } catch(e) { throw new Error("Ungültige Antwort: " + text.substring(0, 200)); }
      if (!resp.ok) throw new Error(res.error || "Fehler (Status " + resp.status + ")");
      if (res.finanzplan) {
        setAiResult(res.finanzplan);
        if (user) {
          supabase.from("profiles").upsert({id:user.id, finanzplan_result: res.finanzplan}, { onConflict:"id" }).then(function(r: any){
            if (r.error) console.error("[FinanzplanInline] Result-Cache-Fehler:", r.error);
          });
        }
        saveFinanzplanToStorage(res.finanzplan);
      } else throw new Error("Kein Finanzplan erhalten");
    } catch(e: any) { console.error("FP AI error:", e); setError("Fehler: " + e.message); }
    setIsLoading(false);
  };

  var handlePrintFP = function() {
    if (!aiResult) return;
    var fp = aiResult; var datum = new Date().toLocaleDateString("de-DE");
    var printWin = window.open("","_blank");
    if (!printWin) return;
    var h = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Finanzplan</title>';
    h += '<style>@page{size:A4;margin:2cm}body{font-family:"Helvetica Neue",Arial,sans-serif;background:#fff;color:#1a1a1a;max-width:100%;margin:0;padding:50px;font-size:12px;line-height:1.7}';
    h += '.cover{text-align:center;padding:80px 0 50px;border-bottom:1px solid rgba(0,0,0,0.1);margin-bottom:40px}.cover h1{font-size:26px;font-weight:500;margin:0 0 8px}.cover p{color:rgba(0,0,0,0.4);font-size:11px;margin:2px 0}';
    h += 'h2{font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:rgba(0,0,0,0.5);margin:30px 0 10px;padding-bottom:6px;border-bottom:1px solid rgba(0,0,0,0.1)}';
    h += 'table{width:100%;border-collapse:collapse;margin:10px 0;font-size:11px}th{text-align:left;padding:8px 10px;color:rgba(0,0,0,0.4);font-weight:500;font-size:10px;text-transform:uppercase;border-bottom:1px solid rgba(0,0,0,0.12)}';
    h += 'td{padding:7px 10px;border-bottom:1px solid rgba(0,0,0,0.05)}.r{text-align:right}.total td{font-weight:600;border-top:2px solid rgba(0,0,0,0.15);color:#1a1a1a}';
    h += '.kpi-grid{display:flex;gap:12px;margin:12px 0;flex-wrap:wrap}.kpi{flex:1;min-width:120px;padding:14px;border:1px solid rgba(0,0,0,0.08);border-radius:6px;text-align:center}.kpi .v{font-size:20px;font-weight:600;color:#1a1a1a}.kpi .l{font-size:9px;color:rgba(0,0,0,0.4);text-transform:uppercase;letter-spacing:0.05em;margin-top:4px}';
    h += '.risk{padding:8px 12px;margin:4px 0;border-left:3px solid rgba(0,0,0,0.15);background:rgba(0,0,0,0.02);border-radius:0 4px 4px 0}';
    h += '.green{color:#059669}.red{color:#dc2626}.footer{margin-top:40px;padding-top:15px;border-top:1px solid rgba(0,0,0,0.08);text-align:center;color:rgba(0,0,0,0.25);font-size:10px}';
    h += '@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body>';
    h += '<div class="cover"><h1>Finanzplan</h1><div style="width:30px;height:1px;background:rgba(0,0,0,0.15);margin:16px auto"></div><p>3-Jahres-Prognose</p><p>'+datum+'</p></div>';
    h += '<p style="color:#444;margin-bottom:24px">'+fp.zusammenfassung+'</p>';
    if(fp.kennzahlen){h+='<h2>Kennzahlen</h2><div class="kpi-grid">';
    h+='<div class="kpi"><div class="v">'+fp.kennzahlen.break_even_monatlich.toLocaleString("de-DE")+' €</div><div class="l">Break-Even / Monat</div></div>';
    h+='<div class="kpi"><div class="v">'+fp.kennzahlen.marge_prozent+'%</div><div class="l">Marge</div></div>';
    h+='<div class="kpi"><div class="v">'+fp.kennzahlen.burn_rate_monatlich.toLocaleString("de-DE")+' €</div><div class="l">Burn Rate</div></div>';
    if(fp.liquiditaet)h+='<div class="kpi"><div class="v">'+fp.liquiditaet.runway_monate+' Mon.</div><div class="l">Runway</div></div>';
    h+='</div>';}
    if(fp.gruendungskosten){h+='<h2>Gründungskosten</h2><table><tr><th>Position</th><th class="r">Betrag</th><th>Hinweis</th></tr>';
    fp.gruendungskosten.positionen.forEach(function(p: any){h+='<tr><td>'+p.name+'</td><td class="r">'+p.betrag.toLocaleString("de-DE")+' €</td><td style="color:rgba(0,0,0,0.4);font-size:10px">'+p.hinweis+'</td></tr>';});
    h+='<tr class="total"><td>Gesamt</td><td class="r">'+fp.gruendungskosten.gesamt.toLocaleString("de-DE")+' €</td><td></td></tr></table>';}
    if(fp.monatliche_kosten){h+='<h2>Laufende Kosten (monatlich)</h2><table><tr><th>Fixkosten</th><th class="r">Betrag</th></tr>';
    fp.monatliche_kosten.fix.forEach(function(p: any){h+='<tr><td>'+p.name+'</td><td class="r">'+p.betrag.toLocaleString("de-DE")+' €</td></tr>';});
    h+='<tr class="total"><td>Summe Fixkosten</td><td class="r">'+fp.monatliche_kosten.gesamt_fix.toLocaleString("de-DE")+' €</td></tr></table>';}
    if(fp.umsatzprognose){h+='<h2>Umsatzprognose</h2><p style="color:#666;margin-bottom:8px">'+fp.umsatzprognose.modell+'</p>';
    h+='<table><tr><th>Monat</th><th class="r">Best Case</th><th class="r">Normal</th><th class="r">Worst Case</th></tr>';
    fp.umsatzprognose.monate.forEach(function(m: any){h+='<tr><td>Monat '+m.monat+'</td><td class="r green">'+m.best.toLocaleString("de-DE")+' €</td><td class="r">'+m.normal.toLocaleString("de-DE")+' €</td><td class="r red">'+m.worst.toLocaleString("de-DE")+' €</td></tr>';});
    h+='</table>';}
    if(fp.liquiditaet){h+='<h2>Liquidität & Break-Even</h2><div class="kpi-grid">';
    h+='<div class="kpi"><div class="v green">'+fp.liquiditaet.monate_bis_breakeven.best+' Mon.</div><div class="l">Break-Even Best</div></div>';
    h+='<div class="kpi"><div class="v">'+fp.liquiditaet.monate_bis_breakeven.normal+' Mon.</div><div class="l">Break-Even Normal</div></div>';
    h+='<div class="kpi"><div class="v red">'+fp.liquiditaet.monate_bis_breakeven.worst+' Mon.</div><div class="l">Break-Even Worst</div></div>';
    h+='<div class="kpi"><div class="v">'+fp.liquiditaet.maximaler_kapitalbedarf.toLocaleString("de-DE")+' €</div><div class="l">Max. Kapitalbedarf</div></div></div>';
    if(fp.liquiditaet.warnung)h+='<div class="risk" style="border-color:#dc2626;background:rgba(220,38,38,0.03)"><strong>Achtung:</strong> '+fp.liquiditaet.warnung+'</div>';}
    if(fp.finanzierungsbedarf){h+='<h2>Finanzierung</h2><div class="kpi-grid">';
    h+='<div class="kpi"><div class="v">'+fp.finanzierungsbedarf.eigenkapital.toLocaleString("de-DE")+' €</div><div class="l">Eigenkapital</div></div>';
    h+='<div class="kpi"><div class="v">'+fp.finanzierungsbedarf.fremdkapital.toLocaleString("de-DE")+' €</div><div class="l">Fremdkapital</div></div></div>';
    h+='<p style="color:#444">'+fp.finanzierungsbedarf.empfehlung+'</p>';}
    if(fp.risiken){h+='<h2>Risiken & Maßnahmen</h2>';fp.risiken.forEach(function(r: any){h+='<div class="risk"><strong>'+r.risiko+'</strong> <span style="color:rgba(0,0,0,0.35)">('+r.wahrscheinlichkeit+')</span><br><span style="color:#444">→ '+r.massnahme+'</span></div>';});}
    if(fp.empfehlungen){h+='<h2>Handlungsempfehlungen</h2><ol style="color:#444;padding-left:18px">';fp.empfehlungen.forEach(function(e: any){h+='<li style="margin:6px 0">'+e+'</li>';});h+='</ol>';}
    h+='<div class="footer">Erstellt mit CoFounder AI · '+datum+' · Dieser Finanzplan dient als Planungshilfe und ersetzt keine professionelle Steuerberatung.</div></body></html>';
    printWin.document.write(h); printWin.document.close(); setTimeout(function(){printWin!.print()},300);
  };

  var handleExportCSV = function() {
    if (!aiResult) return;
    var fp = aiResult; var lines: string[] = [];
    lines.push("Finanzplan - Erstellt mit CoFounder AI");
    lines.push("");
    if(fp.umsatzprognose){
      lines.push("UMSATZPROGNOSE");
      lines.push("Monat;Best Case (€);Normal (€);Worst Case (€)");
      fp.umsatzprognose.monate.forEach(function(m: any){lines.push(m.monat+";"+m.best+";"+m.normal+";"+m.worst);});
      lines.push("");
    }
    if(fp.gruendungskosten){
      lines.push("GRÜNDUNGSKOSTEN");
      lines.push("Position;Betrag (€);Hinweis");
      fp.gruendungskosten.positionen.forEach(function(p: any){lines.push(p.name+";"+p.betrag+";"+p.hinweis);});
      lines.push("Gesamt;"+fp.gruendungskosten.gesamt+";");
      lines.push("");
    }
    if(fp.monatliche_kosten){
      lines.push("MONATLICHE FIXKOSTEN");
      lines.push("Position;Betrag (€)");
      fp.monatliche_kosten.fix.forEach(function(p: any){lines.push(p.name+";"+p.betrag);});
      lines.push("Gesamt;"+fp.monatliche_kosten.gesamt_fix);
      lines.push("");
    }
    if(fp.kennzahlen){
      lines.push("KENNZAHLEN");
      lines.push("Break-Even (€/Monat);"+fp.kennzahlen.break_even_monatlich);
      lines.push("Marge (%);"+fp.kennzahlen.marge_prozent);
      lines.push("Burn Rate (€/Monat);"+fp.kennzahlen.burn_rate_monatlich);
    }
    var csv = "﻿" + lines.join("\n");
    var blob = new Blob([csv], {type:"text/csv;charset=utf-8;"});
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a"); a.href = url; a.download = "Finanzplan_"+new Date().toISOString().split("T")[0]+".csv"; a.click();
    URL.revokeObjectURL(url);
  };

  if (view === "result") {
    var fp = aiResult;
    return React.createElement("div", { className:"space-y-4" },
      React.createElement("div", { className:"flex items-center justify-between mb-2" },
        React.createElement("h3", { className:"text-xl font-medium text-white" }, "Dein Finanzplan"),
        React.createElement("div", { className:"flex gap-2 items-center flex-wrap" },
          savingDoc && React.createElement("span", { className:"text-xs text-white/40 flex items-center gap-1" }, React.createElement(Loader2,{size:12,className:"animate-spin"}), "Wird gespeichert..."),
          fpSaved && !savingDoc && React.createElement("span", { className:"text-xs text-emerald-400/70 flex items-center gap-1" }, React.createElement(CheckCircle,{size:12}), "Gespeichert"),
          !isLoading && fp && React.createElement(PrimaryButton, { onClick:handlePrintFP, className:"text-xs py-2 px-4" }, React.createElement(Download,{size:14}), " Als PDF"),
          !isLoading && fp && React.createElement(SecondaryButton, { onClick:handleExportCSV, className:"text-xs py-2 px-4" }, React.createElement(FileText,{size:14}), " CSV Export"),
          React.createElement(SecondaryButton, { onClick:function(){setView("questions");setStep(0)}, className:"text-xs py-2 px-4" }, "Bearbeiten"))),

      isLoading && React.createElement(GlassCard, { className:"p-8 text-center" },
        React.createElement(Loader2, { size:20, className:"animate-spin text-white/30 mx-auto mb-3" }),
        React.createElement("p", { className:"text-white/40 text-sm" }, "KI erstellt deinen Finanzplan..."),
        React.createElement("p", { className:"text-xs text-white/20 mt-2" }, "Das dauert ca. 20-30 Sekunden")),

      error && React.createElement(GlassCard, { className:"p-4" },
        React.createElement("p", { className:"text-sm text-amber-300/80" }, error),
        React.createElement(PrimaryButton, { onClick:handleGenerate, className:"mt-3 text-xs" }, "Erneut versuchen")),

      fp && React.createElement(React.Fragment, null,
        React.createElement(GlassCard, { className:"p-5" },
          React.createElement("p", { className:"text-sm text-white/60 leading-relaxed" }, fp.zusammenfassung)),

        fp.kennzahlen && React.createElement("div", { className:"grid grid-cols-2 md:grid-cols-4 gap-3" },
          [{v:fp.kennzahlen.break_even_monatlich,l:"Break-Even",fmt:function(v: any){return v.toLocaleString("de-DE")+" €"}},
           {v:fp.kennzahlen.marge_prozent,l:"Marge",fmt:function(v: any){return v+"%"}},
           {v:fp.kennzahlen.burn_rate_monatlich,l:"Burn Rate / Monat",fmt:function(v: any){return v.toLocaleString("de-DE")+" €"}},
           {v:fp.liquiditaet?.runway_monate,l:"Runway",fmt:function(v: any){return v+" Monate"}}
          ].map(function(k: any,i: number){
            return React.createElement(GlassCard, { key:i, className:"p-4 text-center" },
              React.createElement("p", { className:"text-lg font-medium text-white" }, k.fmt(k.v||0)),
              React.createElement("p", { className:"text-xs text-white/40 mt-1" }, k.l));
          })),

        fp.umsatzprognose && React.createElement(GlassCard, { className:"p-5" },
          React.createElement("h4", { className:"text-xs text-white/40 uppercase tracking-wider mb-1" }, "Umsatzprognose"),
          React.createElement("p", { className:"text-xs text-white/30 mb-3" }, fp.umsatzprognose.modell),
          React.createElement("div", { className:"overflow-x-auto" },
            React.createElement("table", { className:"w-full text-xs" },
              React.createElement("thead", null, React.createElement("tr", { className:"border-b border-white/[0.06]" },
                React.createElement("th", { className:"text-left py-2 text-white/30 font-normal" }, "Monat"),
                React.createElement("th", { className:"text-right py-2 text-emerald-400/50 font-normal" }, "Best"),
                React.createElement("th", { className:"text-right py-2 text-white/40 font-normal" }, "Normal"),
                React.createElement("th", { className:"text-right py-2 text-red-400/50 font-normal" }, "Worst"))),
              React.createElement("tbody", null, fp.umsatzprognose.monate.map(function(m: any) {
                return React.createElement("tr", { key:m.monat, className:"border-b border-white/[0.03]" },
                  React.createElement("td", { className:"py-2 text-white/50" }, "M"+m.monat),
                  React.createElement("td", { className:"py-2 text-right text-emerald-400/70" }, m.best.toLocaleString("de-DE")+" €"),
                  React.createElement("td", { className:"py-2 text-right text-white/60" }, m.normal.toLocaleString("de-DE")+" €"),
                  React.createElement("td", { className:"py-2 text-right text-red-400/60" }, m.worst.toLocaleString("de-DE")+" €"));
              }))))),

        fp.liquiditaet && React.createElement(GlassCard, { className:"p-5" },
          React.createElement("h4", { className:"text-xs text-white/40 uppercase tracking-wider mb-3" }, "Liquidität & Break-Even"),
          React.createElement("div", { className:"grid grid-cols-3 gap-4 mb-3" },
            React.createElement("div", null, React.createElement("p",{className:"text-xs text-white/30"},"Best Case"), React.createElement("p",{className:"text-sm text-emerald-400/70 font-medium"},fp.liquiditaet.monate_bis_breakeven.best+" Monate")),
            React.createElement("div", null, React.createElement("p",{className:"text-xs text-white/30"},"Normal"), React.createElement("p",{className:"text-sm text-white/60 font-medium"},fp.liquiditaet.monate_bis_breakeven.normal+" Monate")),
            React.createElement("div", null, React.createElement("p",{className:"text-xs text-white/30"},"Worst Case"), React.createElement("p",{className:"text-sm text-red-400/60 font-medium"},fp.liquiditaet.monate_bis_breakeven.worst+" Monate"))),
          React.createElement("p", { className:"text-xs text-white/40" }, "Max. Kapitalbedarf: ", React.createElement("strong",{className:"text-white/60"},fp.liquiditaet.maximaler_kapitalbedarf.toLocaleString("de-DE")+" €")),
          fp.liquiditaet.warnung && React.createElement("p", { className:"text-xs text-amber-300/70 mt-2 p-2 rounded-lg border border-amber-400/20", style:{background:"var(--warning-bg)"} }, "⚠ "+fp.liquiditaet.warnung)),

        fp.gruendungskosten && React.createElement(GlassCard, { className:"p-5" },
          React.createElement("h4", { className:"text-xs text-white/40 uppercase tracking-wider mb-3" }, "Gründungskosten"),
          React.createElement("div", { className:"space-y-2" }, fp.gruendungskosten.positionen.map(function(p: any,i: number) {
            return React.createElement("div", { key:i, className:"flex items-center justify-between py-1.5 border-b border-white/[0.03]" },
              React.createElement("div", null, React.createElement("span",{className:"text-sm text-white/60"},p.name), React.createElement("span",{className:"text-xs text-white/25 ml-2"},p.hinweis)),
              React.createElement("span", { className:"text-sm text-white/70 font-medium" }, p.betrag.toLocaleString("de-DE")+" €"));
          })),
          React.createElement("div", { className:"flex justify-between pt-2 mt-1 border-t border-white/[0.08]" },
            React.createElement("span",{className:"text-sm text-white/60 font-medium"},"Gesamt"),
            React.createElement("span",{className:"text-sm text-white font-medium"},fp.gruendungskosten.gesamt.toLocaleString("de-DE")+" €"))),

        fp.risiken && React.createElement(GlassCard, { className:"p-5" },
          React.createElement("h4", { className:"text-xs text-white/40 uppercase tracking-wider mb-3" }, "Risiken & Maßnahmen"),
          React.createElement("div", { className:"space-y-3" }, fp.risiken.map(function(r: any,i: number) {
            var wColor = r.wahrscheinlichkeit==="hoch"?"text-red-400/60":r.wahrscheinlichkeit==="mittel"?"text-amber-400/60":"text-white/40";
            return React.createElement("div", { key:i, className:"p-3 rounded-lg", style:{background:"var(--surface-3)"} },
              React.createElement("div", { className:"flex items-center gap-2 mb-1" },
                React.createElement(AlertCircle, { size:12, className:wColor }),
                React.createElement("span", { className:"text-sm text-white/60" }, r.risiko),
                React.createElement("span", { className:"text-xs "+wColor+" ml-auto" }, r.wahrscheinlichkeit)),
              React.createElement("p", { className:"text-xs text-white/40 ml-5" }, "→ "+r.massnahme));
          }))),

        fp.empfehlungen && React.createElement(GlassCard, { className:"p-5" },
          React.createElement("h4", { className:"text-xs text-white/40 uppercase tracking-wider mb-3" }, "Empfehlungen"),
          React.createElement("div", { className:"space-y-2" }, fp.empfehlungen.map(function(e: any,i: number) {
            return React.createElement("div", { key:i, className:"flex items-start gap-3 p-2" },
              React.createElement("div", { className:"w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium", style:{background:"var(--accent-gradient)",color:"#fff"} }, i+1),
              React.createElement("p", { className:"text-sm text-white/60" }, e));
          })))));
  }

  return React.createElement("div", { className:"space-y-5" },
    React.createElement("div", { className:"p-3 rounded-lg border border-emerald-400/15 text-xs text-white/50 flex items-start gap-2", style:{background:"rgba(52,211,153,0.04)"} },
      React.createElement(AlertCircle, { size:14, className:"text-emerald-400/50 flex-shrink-0 mt-0.5" }),
      React.createElement("div", null,
        React.createElement("strong", { className:"text-white/60" }, "Je genauer deine Angaben, desto besser der Finanzplan."),
        " Schätze so realistisch wie möglich — die KI erstellt daraus eine professionelle 3-Jahres-Prognose.")),

    React.createElement("div", null,
      React.createElement("div", { className:"flex justify-between text-xs text-white/40 mb-2" },
        React.createElement("span", null, "Schritt "+(step+1)+" von "+TOTAL+": "+currentStep.title),
        React.createElement("span", null, Math.round(((step+1)/TOTAL)*100)+"%")),
      React.createElement("div", { className:"w-full h-1 rounded-full", style:{background:"var(--surface-8)"} },
        React.createElement("div", { className:"h-1 rounded-full transition-all duration-500", style:{width:((step+1)/TOTAL)*100+"%",background:"var(--accent-solid)"} }))),

    React.createElement("div", { className:"space-y-6" }, currentStep.fields.map(function(f: any) {
      if (f.type === "number_slider") {
        var val = data[f.id] !== undefined ? data[f.id] : f.def;
        var sliderMax = Math.max(f.max, val);
        return React.createElement("div", { key:f.id },
          React.createElement("div", { className:"flex items-end justify-between mb-2 gap-4" },
            React.createElement("label", { className:"text-xs text-white/50 flex-1" }, f.label),
            React.createElement("div", { className:"flex items-center gap-1.5" },
              React.createElement("input", { type:"text", inputMode:"numeric", value:val === 0 ? "0" : val.toLocaleString("de-DE"), onChange:function(e: any){ var raw = e.target.value.replace(/\./g,"").replace(/,/g,""); var num = raw === "" ? 0 : parseInt(raw,10); if(!isNaN(num)) upd(f.id, num); }, className:"w-24 text-right rounded-lg px-3 py-1.5 text-sm font-medium text-white outline-none transition-all", style:inputStyle, onFocus:focusIn, onBlur:focusOut }),
              f.unit && React.createElement("span", { className:"text-xs text-white/30 min-w-[40px]" }, f.unit))),
          React.createElement("input", { type:"range", min:f.min, max:sliderMax, step:f.step, value:Math.min(val, sliderMax), onChange:function(e: any){ upd(f.id, Number(e.target.value)); }, className:"w-full h-1.5 rounded-full outline-none cursor-pointer", style:{accentColor:"var(--text-secondary)"} }),
          React.createElement("div", { className:"flex justify-between text-xs text-white/15 mt-1" },
            React.createElement("span", null, f.min.toLocaleString("de-DE")),
            React.createElement("span", null, f.max.toLocaleString("de-DE"))));
      }
      if (f.type === "select") {
        return React.createElement("div", { key:f.id },
          React.createElement("label", { className:"text-xs text-white/50 mb-1.5 block" }, f.label),
          React.createElement("select", { value:data[f.id]||"", onChange:function(e: any){upd(f.id,e.target.value)}, className:"w-full rounded-lg p-3 text-sm text-white outline-none transition-all appearance-none", style:inputStyle },
            React.createElement("option", { value:"" }, f.placeholder||"Wählen..."),
            f.options.map(function(o: string) { return React.createElement("option", { key:o, value:o, style:{background:"var(--bg-select-option)"} }, o); })));
      }
      if (f.type === "textarea") {
        return React.createElement("div", { key:f.id },
          React.createElement("label", { className:"text-xs text-white/50 mb-1.5 block" }, f.label),
          React.createElement("textarea", { rows:3, value:data[f.id]||"", onChange:function(e: any){upd(f.id,e.target.value)}, placeholder:f.placeholder||"", className:"w-full rounded-lg p-3 text-sm text-white placeholder-white/20 outline-none resize-none transition-all", style:inputStyle, onFocus:focusIn, onBlur:focusOut }));
      }
      return null;
    })),

    step === 1 && React.createElement("div", { className:"p-3 rounded-lg border border-white/[0.06]", style:{background:"var(--surface-3)"} },
      React.createElement("div", { className:"flex justify-between text-sm" },
        React.createElement("span", { className:"text-white/40" }, "Gesamte monatliche Kosten"),
        React.createElement("span", { className:"text-white font-medium" }, totalMonatlich.toLocaleString("de-DE")+" € / Monat")),
      React.createElement("p", { className:"text-xs text-white/25 mt-1" }, "= "+((totalMonatlich*12)).toLocaleString("de-DE")+" € / Jahr")),

    React.createElement("div", { className:"flex items-center justify-between pt-4 border-t border-white/[0.06]" },
      React.createElement("button", { onClick:function(){if(step>0)setStep(step-1);else if(onClose)onClose()}, className:"flex items-center gap-2 text-sm text-white/30 hover:text-white/60 transition-colors" }, React.createElement(ChevronLeft,{size:14}), step===0?"Zurück":"Vorheriger Schritt"),
      step < TOTAL-1 ?
        React.createElement(PrimaryButton, { onClick:function(){setStep(step+1)} }, "Weiter ", React.createElement(ChevronRight,{size:16})) :
        React.createElement(PrimaryButton, { onClick:handleGenerate, loading:isLoading }, React.createElement(Sparkles,{size:14}), " Finanzplan generieren")));
};
