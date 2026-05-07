/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { db } from '@/lib/db'
import { DOC_CATEGORIES, getSuggestedDocTypes } from '@/lib/constants'
import { GlassCard, NextActionBanner } from '@/components/ui'
import { Upload, Folder, Download, Trash2, Loader2, Sparkles, TrendingUp, ExternalLink, X } from '@/components/icons'
import { BusinessplanInline } from '@/components/BusinessplanInline'
import { FinanzplanInline } from '@/components/FinanzplanInline'

export const DokumentePage = function({ userData, onNavigate }: { userData: any; onNavigate: (page: string) => void }) {
  const { user } = useAuth();
  var upState = useState<any[]>([]); var uploads = upState[0]; var setUploads = upState[1];
  var dragState = useState(false); var dragActive = dragState[0]; var setDragActive = dragState[1];
  var filterState = useState("all"); var filter = filterState[0]; var setFilter = filterState[1];
  var loadingState = useState(true); var isLoading = loadingState[0]; var setIsLoading = loadingState[1];
  var uploadingState = useState<any>(null); var uploading = uploadingState[0]; var setUploading = uploadingState[1];
  var previewState = useState<any>(null); var previewUrl = previewState[0]; var setPreviewUrl = previewState[1];
  var bpShowState = useState(false); var showBpGenerator = bpShowState[0]; var setShowBpGenerator = bpShowState[1];
  var fpShowState = useState(false); var showFpGenerator = fpShowState[0]; var setShowFpGenerator = fpShowState[1];
  var shareState = useState<any>(null); var shareInfo = shareState[0]; var setShareInfo = shareState[1];
  var fileInputRef = useRef<any>(null);
  var activeDocTypeRef = useRef("custom");

  useEffect(function() {
    if (!user) return;
    db.getDocuments(user.id).then(function(docs: any) { setUploads(docs); setIsLoading(false); });
  }, [user]);

  var formatSize = function(bytes: number) {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes/1024).toFixed(1) + " KB";
    return (bytes/1048576).toFixed(1) + " MB";
  };

  var isImage = function(name: string) {
    if (!name) return false;
    var ext = name.toLowerCase().split(".").pop();
    return ["png","jpg","jpeg","gif","webp"].indexOf(ext || "") >= 0;
  };

  var handleFiles = async function(files: any[], docTypeId?: string) {
    if (!user) return;
    var typeId = docTypeId || activeDocTypeRef.current || "custom";
    setUploading(typeId);
    for (var i = 0; i < files.length; i++) {
      await db.uploadDocument(user.id, files[i], typeId);
    }
    var docs = await db.getDocuments(user.id);
    setUploads(docs);
    setUploading(null);
    activeDocTypeRef.current = "custom";
  };

  var handleUploadForType = function(docTypeId: string) {
    activeDocTypeRef.current = docTypeId;
    fileInputRef.current?.click();
  };

  var handleDownload = async function(storagePath: string, fileName: string) {
    var url = await db.getDocumentUrl(storagePath);
    if (url) { var a = document.createElement("a"); a.href = url; a.download = fileName; a.click(); }
  };

  var handleShare = async function(doc: any) {
    setShareInfo({ doc: doc, url: "", loading: true, copied: false });
    try {
      var res = await supabase.storage.from("documents").createSignedUrl(doc.file_path, 60*60*24*365);
      var link = res?.data?.signedUrl || "";
      if (!link) throw new Error("Kein Link erhalten");
      setShareInfo({ doc: doc, url: link, loading: false, copied: false });
      try { await navigator.clipboard.writeText(link); setShareInfo(function(p: any){ return Object.assign({}, p, { copied: true }); }); } catch(e) {}
    } catch(e: any) {
      console.error("[Share] error:", e);
      setShareInfo({ doc: doc, url: "", loading: false, error: e.message });
    }
  };

  var handleDownloadAll = async function() {
    for (var i = 0; i < uploads.length; i++) {
      await handleDownload(uploads[i].file_path, uploads[i].file_name);
    }
  };

  var handleDelete = async function(docId: string, storagePath: string) {
    if (!user) return;
    await db.deleteDocument(user.id, docId, storagePath);
    setUploads(function(prev: any[]) { return prev.filter(function(u: any) { return u.id !== docId; }); });
  };

  var handlePreview = async function(doc: any) {
    if (!isImage(doc.file_name)) return;
    var url = await db.getDocumentUrl(doc.file_path);
    if (url) setPreviewUrl(url);
  };

  var suggestedDocs = getSuggestedDocTypes(userData);
  var uploadedDocTypeIds = uploads.map(function(u: any){return u.doc_type_id});
  var categories = filter === "all" ? Object.values(DOC_CATEGORIES) : [(DOC_CATEGORIES as any)[filter]];
  var completionPct = Math.round((uploadedDocTypeIds.filter(function(id: string){return id!=="custom"}).length / Math.max(suggestedDocs.filter(function(d: any){return d.status!=="optional"}).length, 1)) * 100) || 0;

  if (showBpGenerator) {
    return React.createElement("div", { className:"max-w-3xl mx-auto py-10 px-6" },
      React.createElement("button", { onClick:function(){setShowBpGenerator(false)}, className:"mb-6 flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors" }, React.createElement("span",{className:"text-white/40"},"←"), " Zurück zu Dokumente"),
      React.createElement("div", { className:"flex items-center gap-3 mb-8" },
        React.createElement("div", { className:"w-12 h-12 rounded-xl flex items-center justify-center", style:{background:"var(--surface-15)"} }, React.createElement(Sparkles,{size:24,className:"text-white/60"})),
        React.createElement("div", null,
          React.createElement("h1", { className:"text-2xl font-medium text-white" }, "Businessplan erstellen"),
          React.createElement("p", { className:"text-sm text-white/40" }, "Beantworte 10 Fragen — je genauer, desto besser das Ergebnis"))),
      React.createElement(GlassCard, { className:"p-6" },
        React.createElement(BusinessplanInline, { onClose:function(){setShowBpGenerator(false)} })));
  }

  if (showFpGenerator) {
    return React.createElement("div", { className:"max-w-3xl mx-auto py-10 px-6" },
      React.createElement("button", { onClick:function(){setShowFpGenerator(false)}, className:"mb-6 flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors" }, React.createElement("span",{className:"text-white/40"},"←"), " Zurück zu Dokumente"),
      React.createElement("div", { className:"flex items-center gap-3 mb-8" },
        React.createElement("div", { className:"w-12 h-12 rounded-xl flex items-center justify-center", style:{background:"var(--surface-15)"} }, React.createElement(TrendingUp,{size:24,className:"text-white/60"})),
        React.createElement("div", null,
          React.createElement("h1", { className:"text-2xl font-medium text-white" }, "Finanzplan erstellen"),
          React.createElement("p", { className:"text-sm text-white/40" }, "3 Schritte — je genauer deine Zahlen, desto realistischer die Prognose"))),
      React.createElement(GlassCard, { className:"p-6" },
        React.createElement(FinanzplanInline, { onClose:function(){setShowFpGenerator(false)}, userData:userData })));
  }

  return React.createElement("div", { className:"max-w-6xl mx-auto py-10 px-6" },
    shareInfo && React.createElement("div", { onClick:function(){setShareInfo(null)}, className:"fixed inset-0 z-[80] flex items-center justify-center p-6", style:{background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)"} },
      React.createElement("div", { onClick:function(e: any){e.stopPropagation()}, className:"max-w-lg w-full rounded-2xl p-6", style:{background:"var(--bg-page)",border:"1px solid var(--border-15)"} },
        React.createElement("div", { className:"flex items-center justify-between mb-4" },
          React.createElement("div", { className:"flex items-center gap-3" },
            React.createElement("div", { className:"w-10 h-10 rounded-xl flex items-center justify-center", style:{background:"var(--surface-12)"} }, React.createElement(ExternalLink,{size:18,className:"text-white/60"})),
            React.createElement("div", null,
              React.createElement("h3", { className:"text-white font-medium text-sm" }, "Dokument teilen"),
              React.createElement("p", { className:"text-xs text-white/40 truncate max-w-[300px]" }, shareInfo.doc.file_name))),
          React.createElement("button", { onClick:function(){setShareInfo(null)}, className:"text-white/40 hover:text-white/70" }, React.createElement(X,{size:18}))),
        shareInfo.loading && React.createElement("div", { className:"py-6 text-center text-white/40 text-sm flex items-center justify-center gap-2" }, React.createElement(Loader2,{size:14,className:"animate-spin"}), "Link wird erstellt..."),
        shareInfo.error && React.createElement("p", { className:"text-sm text-red-400" }, "Fehler: "+shareInfo.error),
        shareInfo.url && React.createElement("div", null,
          React.createElement("p", { className:"text-xs text-white/40 mb-2" }, "Dieser Link ist 1 Jahr gültig — perfekt für Bank- oder Investorengespräche:"),
          React.createElement("div", { className:"flex items-center gap-2 p-3 rounded-xl mb-3", style:{background:"var(--surface-5)",border:"1px solid var(--border-10)"} },
            React.createElement("input", { readOnly:true, value:shareInfo.url, onClick:function(e: any){e.target.select()}, className:"flex-1 bg-transparent text-xs text-white/70 outline-none" })),
          React.createElement("div", { className:"flex gap-2" },
            React.createElement("button", { onClick:async function(){ try{ await navigator.clipboard.writeText(shareInfo.url); setShareInfo(function(p: any){return Object.assign({},p,{copied:true})}); }catch(e){} }, className:"flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all", style:{background:"var(--accent-gradient)",color:"#fff"} }, shareInfo.copied ? "✓ Link kopiert" : "Link kopieren"),
            React.createElement("a", { href:shareInfo.url, target:"_blank", rel:"noopener noreferrer", className:"px-4 py-2.5 rounded-xl text-sm font-medium border border-white/10 text-white/70 hover:bg-white/5 transition-all" }, "Öffnen"))))),

    previewUrl && React.createElement("div", { onClick:function(){setPreviewUrl(null)}, className:"fixed inset-0 z-50 flex items-center justify-center p-8", style:{background:"rgba(0,0,0,0.8)",backdropFilter:"blur(8px)"} },
      React.createElement("div", { className:"relative max-w-2xl max-h-full" },
        React.createElement("button", { onClick:function(){setPreviewUrl(null)}, className:"absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10" }, React.createElement(X,{size:16})),
        React.createElement("img", { src:previewUrl, className:"max-w-full max-h-[80vh] rounded-xl object-contain" }))),

    React.createElement("h1", { className:"text-3xl font-medium text-white mb-1" }, "Deine Unternehmensdokumente"),
    React.createElement("p", { className:"text-white/45 text-sm mb-7" }, "Alle wichtigen Dokumente an einem Ort"),

    React.createElement(NextActionBanner, { page:"dokumente", userData:userData, onNavigate:onNavigate, context:{ uploads_count: uploads.length, completion_pct: completionPct } }),

    React.createElement("div", { className:"flex items-center gap-4 mb-6 flex-wrap" },
      React.createElement("div", { className:"flex-1 min-w-[250px]" },
        React.createElement("div", { className:"flex justify-between text-xs text-white/40 mb-2" }, React.createElement("span",null,"Vollständigkeit"), React.createElement("span",null,completionPct+"%")),
        React.createElement("div", { className:"w-full h-1.5 rounded-full", style:{background:"var(--surface-8)"} },
          React.createElement("div", { className:"h-1.5 rounded-full transition-all duration-700", style:{width:completionPct+"%",background:"var(--accent-solid)"} }))),
      React.createElement("div", { className:"flex gap-2 flex-wrap" }, ["all","pitch","planung","markt","recht","foerderung"].map(function(cat: string) {
        return React.createElement("button", { key:cat, onClick:function(){setFilter(cat)}, className:"px-3 py-1.5 rounded-lg text-xs font-medium transition-all "+(filter===cat?"bg-emerald-500/15 text-white/50 border border-emerald-400/25":"bg-white/5 text-white/40 border border-white/10 hover:bg-white/10") }, cat==="all"?"Alle":(DOC_CATEGORIES as any)[cat]?.name.split(" ")[0]);
      }))),

    React.createElement("div", { className:"grid md:grid-cols-3 gap-6" },
      React.createElement("div", { className:"md:col-span-1 space-y-4" },
        React.createElement(GlassCard, { className:"p-6" },
          React.createElement("div", { className:"flex items-center gap-2 mb-4" }, React.createElement(Upload,{size:16,className:"text-white/60"}), React.createElement("h3",{className:"text-white font-normal text-sm"},"Upload")),
          uploading ? React.createElement("div", { className:"text-center py-8" },
            React.createElement(Loader2, { size:28, className:"animate-spin text-white/60 mx-auto mb-3" }),
            React.createElement("p", { className:"text-sm text-white/60" }, "Wird hochgeladen..."),
            React.createElement("div", { className:"w-full h-1.5 rounded-full mt-3", style:{background:"var(--surface-8)"} },
              React.createElement("div", { className:"h-1.5 rounded-full animate-pulse", style:{width:"70%",background:"var(--accent-gradient)"} }))) :
          React.createElement("div", { onDrop:function(e: any){e.preventDefault();setDragActive(false);handleFiles(Array.from(e.dataTransfer.files))}, onDragOver:function(e: any){e.preventDefault();setDragActive(true)}, onDragLeave:function(){setDragActive(false)}, className:"border-2 border-dashed rounded-xl p-8 text-center transition-all "+(dragActive?"border-emerald-400 bg-white/[0.04]":"border-white/20 hover:border-white/[0.12]") },
            React.createElement(Folder, { size:32, className:"mx-auto mb-3 text-white/30" }),
            React.createElement("p", { className:"text-sm text-white/60 mb-2" }, "Dateien hierher ziehen"),
            React.createElement("button", { onClick:function(){activeDocTypeRef.current="custom";fileInputRef.current?.click()}, className:"px-4 py-2 rounded-lg text-xs font-medium bg-white/10 text-white hover:bg-white/15 transition-colors" }, "Datei auswählen"),
            React.createElement("input", { ref:fileInputRef, type:"file", multiple:true, accept:".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg", className:"hidden", onChange:function(e: any){handleFiles(Array.from(e.target.files))} }))),
        uploads.length > 0 && React.createElement(GlassCard, { className:"p-5" },
          React.createElement("div", { className:"flex items-center justify-between mb-3" },
            React.createElement("h3", { className:"text-white font-normal text-sm" }, "Hochgeladen ("+uploads.length+")"),
            React.createElement("button", { onClick:handleDownloadAll, className:"text-xs text-white/60 hover:text-white/50 flex items-center gap-1 transition-colors" }, React.createElement(Download,{size:12}), " Alle")),
          React.createElement("div", { className:"space-y-2 max-h-96 overflow-y-auto" }, uploads.map(function(doc: any) {
            var imgFile = isImage(doc.file_name);
            return React.createElement("div", { key:doc.id, className:"flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors" },
              imgFile && React.createElement("button", { onClick:function(){handlePreview(doc)}, className:"w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 overflow-hidden border border-white/10 hover:border-emerald-400/25 transition-colors", title:"Vorschau" },
                React.createElement("span", { className:"text-xs text-white/40" }, "IMG")),
              React.createElement("div", { className:"flex-1 min-w-0" },
                React.createElement("p", { className:"text-sm text-white/80 truncate" }, doc.file_name),
                React.createElement("p", { className:"text-xs text-white/30" }, new Date(doc.uploaded_at).toLocaleDateString("de-DE"), doc.file_size ? " · "+formatSize(doc.file_size) : "")),
              React.createElement("div", { className:"flex items-center gap-2 flex-shrink-0" },
                React.createElement("button", { onClick:function(){handleShare(doc)}, title:"Per Link teilen", className:"text-white/40 hover:text-emerald-400 transition-colors" }, React.createElement(ExternalLink,{size:14})),
                React.createElement("button", { onClick:function(){handleDownload(doc.file_path, doc.file_name)}, title:"Download", className:"text-white/40 hover:text-white/60 transition-colors" }, React.createElement(Download,{size:14})),
                React.createElement("button", { onClick:function(){handleDelete(doc.id, doc.file_path)}, title:"Löschen", className:"text-white/40 hover:text-red-400 transition-colors" }, React.createElement(Trash2,{size:14}))));
          })))),

      React.createElement("div", { className:"md:col-span-2 space-y-6" }, categories.map(function(cat: any) {
        var docsInCat = suggestedDocs.filter(function(d: any){return d.category===cat.id});
        if (!docsInCat.length) return null;
        return React.createElement("div", { key:cat.id },
          React.createElement("div", { className:"flex items-center gap-2 mb-3" },
            React.createElement("span", null, cat.icon),
            React.createElement("h3", { className:"text-white/80 font-normal text-sm" }, cat.name),
            React.createElement("span", { className:"text-xs text-white/25" }, "("+docsInCat.length+")")),
          React.createElement("div", { className:"grid gap-3" }, docsInCat.map(function(doc: any) {
            var uploaded = uploads.find(function(u: any){return u.doc_type_id===doc.id});
            var isUploadingThis = uploading === doc.id;
            return React.createElement(GlassCard, { key:doc.id, className:"p-4 hover:border-emerald-400/20 transition-all" },
              React.createElement("div", { className:"flex items-start justify-between gap-4" },
                React.createElement("div", { className:"flex-1" },
                  React.createElement("div", { className:"flex items-center gap-2 mb-1 flex-wrap" },
                    React.createElement("p", { className:"text-white/90 font-medium text-sm" }, doc.title),
                    React.createElement("span", { className:"text-xs px-2 py-0.5 rounded-full "+(uploaded?"bg-white/[0.04] text-white/50 border border-white/[0.1]":doc.status==="empfohlen"?"bg-white/[0.04] text-white/50 border border-emerald-400/25":"bg-white/5 text-white/40 border border-white/10") }, uploaded?"✓ Hochgeladen":doc.status==="empfohlen"?"Empfohlen":doc.status==="wichtig"?"Wichtig":"Optional")),
                  React.createElement("p", { className:"text-xs text-white/40" }, doc.description),
                  uploaded && React.createElement("p", { className:"text-xs text-white/30 mt-1" }, "Hochgeladen am "+new Date(uploaded.uploaded_at).toLocaleDateString("de-DE")+(uploaded.file_size?" · "+formatSize(uploaded.file_size):""))),
                isUploadingThis ? React.createElement(Loader2, { size:18, className:"animate-spin text-white/60 flex-shrink-0" }) :
                !uploaded && React.createElement("div", { className:"flex flex-col gap-2 flex-shrink-0" },
                  React.createElement("button", { onClick:function(){handleUploadForType(doc.id)}, className:"px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] text-white/50 hover:bg-emerald-500/15 transition-colors border border-emerald-400/20 flex items-center gap-1" }, React.createElement(Upload,{size:12}), " Hochladen"),
                  doc.id === "businessplan" && React.createElement("button", { onClick:function(){setShowBpGenerator(true)}, className:"px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] text-white/50 hover:bg-white/[0.06] transition-colors border border-emerald-400/20 flex items-center gap-1" }, React.createElement(Sparkles,{size:12}), " Erstellen"),
                  doc.id === "finanzplan" && React.createElement("button", { onClick:function(){setShowFpGenerator(true)}, className:"px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] text-white/50 hover:bg-white/[0.06] transition-colors border border-emerald-400/20 flex items-center gap-1" }, React.createElement(Sparkles,{size:12}), " Erstellen"))));
          })));
      })),

      showBpGenerator && React.createElement("div", { className:"md:col-span-3 mt-6" },
        React.createElement(GlassCard, { className:"p-6" },
          React.createElement("div", { className:"flex items-center justify-between mb-6" },
            React.createElement("div", { className:"flex items-center gap-3" },
              React.createElement("div", { className:"w-10 h-10 rounded-xl flex items-center justify-center", style:{background:"var(--surface-15)"} }, React.createElement(Sparkles,{size:20,className:"text-white/60"})),
              React.createElement("div", null,
                React.createElement("h3", { className:"text-white font-normal" }, "Businessplan erstellen"),
                React.createElement("p", { className:"text-xs text-white/40" }, "Beantworte die Fragen und wir generieren deinen Businessplan"))),
            React.createElement("button", { onClick:function(){setShowBpGenerator(false)}, className:"text-white/40 hover:text-white/70 transition-colors" }, React.createElement(X,{size:20}))),
          React.createElement(BusinessplanInline, { onClose:function(){setShowBpGenerator(false)} }))),

      showFpGenerator && React.createElement("div", { className:"md:col-span-3 mt-6" },
        React.createElement(GlassCard, { className:"p-6" },
          React.createElement("div", { className:"flex items-center justify-between mb-6" },
            React.createElement("div", { className:"flex items-center gap-3" },
              React.createElement("div", { className:"w-10 h-10 rounded-xl flex items-center justify-center", style:{background:"var(--surface-15)"} }, React.createElement(TrendingUp,{size:20,className:"text-white/60"})),
              React.createElement("div", null,
                React.createElement("h3", { className:"text-white font-normal" }, "Finanzplan erstellen"),
                React.createElement("p", { className:"text-xs text-white/40" }, "3 Schritte — je genauer deine Zahlen, desto besser die Prognose"))),
            React.createElement("button", { onClick:function(){setShowFpGenerator(false)}, className:"text-white/40 hover:text-white/70 transition-colors" }, React.createElement(X,{size:20}))),
          React.createElement(FinanzplanInline, { onClose:function(){setShowFpGenerator(false)}, userData:userData })))));
};
