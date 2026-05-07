'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { SUPABASE_URL } from '@/lib/supabase';
import { aiFetch } from '@/lib/aiFetch';
import { CHAT_SUGGESTIONS } from '@/lib/constants';
import { MessageCircle, Loader2, Send } from '@/components/icons';

export function ChatPage() {
  var messagesState = useState<any[]>([]); var messages = messagesState[0]; var setMessages = messagesState[1];
  var inputState = useState(""); var input = inputState[0]; var setInput = inputState[1];
  var loadingState = useState(false); var isLoading = loadingState[0]; var setIsLoading = loadingState[1];
  var errorState = useState(""); var error = errorState[0]; var setError = errorState[1];
  var messagesEndRef = useRef<any>(null);
  var inputRef = useRef<any>(null);

  var scrollToBottom = function() {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(function() { scrollToBottom(); }, [messages]);

  var sendMessage = async function(text: string) {
    if (!text || !text.trim() || isLoading) return;
    var userMsg = { role: "user", content: text.trim() };
    var newMessages = messages.concat([userMsg]);
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setError("");

    try {
      var session = await supabase.auth.getSession();
      var token = session?.data?.session?.access_token || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

      var contextMessages = newMessages.slice(-20).map(function(m: any) {
        return { role: m.role, content: m.content };
      });

      var resp = await aiFetch(SUPABASE_URL + "/functions/v1/chat-gruendung", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
          "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        },
        body: JSON.stringify({ messages: contextMessages })
      });

      var res = await resp.json();

      if (!resp.ok) {
        throw new Error(res.error || "Fehler bei der Anfrage");
      }

      if (res.text) {
        setMessages(newMessages.concat([{ role: "assistant", content: res.text }]));
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      setError("Verbindungsfehler. Bitte versuche es erneut.");
    }
    setIsLoading(false);
  };

  var handleSubmit = function(e?: any) {
    if (e) e.preventDefault();
    sendMessage(input);
  };

  var handleKeyDown = function(e: any) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  var handleSuggestion = function(prompt: string) {
    sendMessage(prompt);
  };

  var clearChat = function() {
    setMessages([]);
    setError("");
  };

  var formatMessage = function(text: string) {
    var html = text
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/^### (.+)/gm, '<h4 style="font-size:13px;font-weight:500;margin:12px 0 4px;color:var(--text-high)">$1</h4>')
      .replace(/^## (.+)/gm, '<h3 style="font-size:14px;font-weight:500;margin:14px 0 6px;color:var(--text-high);text-transform:uppercase;letter-spacing:-0.02em">$1</h3>')
      .replace(/^# (.+)/gm, '<h3 style="font-size:14px;font-weight:500;margin:14px 0 6px;color:var(--text-high);text-transform:uppercase;letter-spacing:-0.02em">$1</h3>')
      .replace(/^[-•] (.+)/gm, '<div style="display:flex;gap:8px;margin:3px 0"><span style="color:var(--text-faint);flex-shrink:0">•</span><span>$1</span></div>')
      .replace(/^\d+\.\s(.+)/gm, function(match: string, p1: string) {
        var num = match.match(/^(\d+)/)![1];
        return '<div style="display:flex;gap:8px;margin:3px 0"><span style="color:var(--text-faint);flex-shrink:0;min-width:16px">' + num + '.</span><span>' + p1 + '</span></div>';
      })
      .replace(/\n\n/g, '<div style="height:10px"></div>')
      .replace(/\n/g, "<br>");
    return html;
  };

  if (messages.length === 0) {
    return React.createElement("div", { className: "max-w-3xl mx-auto py-10 px-6 flex flex-col", style: { minHeight: "calc(100vh - 40px)" } },
      React.createElement("div", { className: "text-center mb-10" },
        React.createElement("div", { className: "w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4", style: { background: "var(--icon-gradient)", border: "1px solid var(--border-15)" } },
          React.createElement(MessageCircle, { size: 24, className: "text-white/60" })),
        React.createElement("h1", { className: "text-xl text-white mb-2" }, "Gr\xfcndungsberater"),
        React.createElement("p", { className: "text-white/40 text-sm max-w-md mx-auto" }, "Dein KI-Assistent f\xfcr alle Fragen rund um Gr\xfcndung, Startups und Selbstst\xe4ndigkeit in Deutschland.")),

      React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8" },
        (CHAT_SUGGESTIONS as any[]).map(function(s: any, i: number) {
          return React.createElement("button", {
            key: i,
            onClick: function() { handleSuggestion(s.prompt); },
            className: "text-left p-3.5 rounded-xl border border-white/[0.06] transition-all duration-200 hover:border-white/[0.15] hover:bg-white/[0.03] group"
          },
            React.createElement("div", { className: "flex items-start gap-3" },
              React.createElement("span", { className: "text-base flex-shrink-0 mt-0.5" }, s.icon),
              React.createElement("div", null,
                React.createElement("span", { className: "text-sm text-white/70 group-hover:text-white/90 transition-colors" }, s.label))));
        })),

      React.createElement("div", { className: "mt-auto" },
        error && React.createElement("div", { className: "mb-3 p-3 rounded-lg text-xs text-red-300/80 border border-red-400/20", style: { background: "var(--error-bg)" } }, error),
        React.createElement("form", { onSubmit: handleSubmit, className: "relative" },
          React.createElement("input", {
            ref: inputRef,
            type: "text",
            value: input,
            onChange: function(e: any) { setInput(e.target.value); },
            onKeyDown: handleKeyDown,
            placeholder: "Stelle eine Frage zur Gr\xfcndung...",
            className: "w-full rounded-xl p-4 pr-12 text-sm text-white placeholder-white/25 outline-none transition-all duration-200",
            style: { background: "var(--bg-input)", border: "1px solid var(--border-10)" },
            onFocus: function(e: any) { e.target.style.borderColor = "var(--border-25)"; },
            onBlur: function(e: any) { e.target.style.borderColor = "var(--border-10)"; }
          }),
          React.createElement("button", {
            type: "submit",
            disabled: !input.trim(),
            className: "absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all duration-200",
            style: { opacity: input.trim() ? 1 : 0.3 }
          }, React.createElement(Send, { size: 16, className: "text-white/60" }))),
        React.createElement("p", { className: "text-[10px] text-white/20 text-center mt-3" }, "CoFounder AI Chatbot — nur f\xfcr Gr\xfcndungsfragen")));
  }

  return React.createElement("div", { className: "flex flex-col", style: { height: "calc(100vh - 0px)" } },
    React.createElement("div", { className: "flex items-center justify-between px-6 py-4 border-b border-white/[0.06] flex-shrink-0" },
      React.createElement("div", { className: "flex items-center gap-3" },
        React.createElement("div", { className: "w-8 h-8 rounded-xl flex items-center justify-center", style: { background: "var(--icon-gradient)" } },
          React.createElement(MessageCircle, { size: 16, className: "text-white/60" })),
        React.createElement("div", null,
          React.createElement("h3", { className: "text-sm text-white/80", style: { textTransform: "none", letterSpacing: "0" } }, "Gr\xfcndungsberater"),
          React.createElement("span", { className: "text-[10px] text-white/30" }, messages.length + " Nachrichten"))),
      React.createElement("button", { onClick: clearChat, className: "text-xs text-white/25 hover:text-white/50 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.03]" }, "Chat leeren")),

    React.createElement("div", { className: "flex-1 overflow-y-auto px-6 py-4", style: { scrollBehavior: "smooth" } },
      React.createElement("div", { className: "max-w-3xl mx-auto space-y-4" },
        messages.map(function(msg: any, i: number) {
          var isUser = msg.role === "user";
          return React.createElement("div", { key: i, className: "flex " + (isUser ? "justify-end" : "justify-start") + " fadeIn" },
            React.createElement("div", {
              className: "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
              style: isUser
                ? { background: "var(--surface-10)", color: "var(--text-high)", borderBottomRightRadius: "4px" }
                : { background: "var(--surface-4)", color: "var(--text-default)", borderBottomLeftRadius: "4px" }
            },
              isUser
                ? msg.content
                : React.createElement("div", { dangerouslySetInnerHTML: { __html: formatMessage(msg.content) } })
            ));
        }),

        isLoading && React.createElement("div", { className: "flex justify-start fadeIn" },
          React.createElement("div", { className: "rounded-2xl px-4 py-3 flex items-center gap-2", style: { background: "var(--surface-4)", borderBottomLeftRadius: "4px" } },
            React.createElement(Loader2, { size: 14, className: "animate-spin text-white/40" }),
            React.createElement("span", { className: "text-sm text-white/40" }, "Denkt nach..."))),

        error && React.createElement("div", { className: "p-3 rounded-lg text-xs text-red-300/80 border border-red-400/20", style: { background: "var(--error-bg)" } }, error),

        React.createElement("div", { ref: messagesEndRef }))),

    React.createElement("div", { className: "px-6 py-4 border-t border-white/[0.06] flex-shrink-0" },
      React.createElement("div", { className: "max-w-3xl mx-auto" },
        React.createElement("form", { onSubmit: handleSubmit, className: "relative" },
          React.createElement("input", {
            ref: inputRef,
            type: "text",
            value: input,
            onChange: function(e: any) { setInput(e.target.value); },
            onKeyDown: handleKeyDown,
            placeholder: "Stelle eine Frage zur Gr\xfcndung...",
            className: "w-full rounded-xl p-4 pr-12 text-sm text-white placeholder-white/25 outline-none transition-all duration-200",
            style: { background: "var(--bg-input)", border: "1px solid var(--border-10)" },
            onFocus: function(e: any) { e.target.style.borderColor = "var(--border-25)"; },
            onBlur: function(e: any) { e.target.style.borderColor = "var(--border-10)"; },
            disabled: isLoading
          }),
          React.createElement("button", {
            type: "submit",
            disabled: !input.trim() || isLoading,
            className: "absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all duration-200",
            style: { opacity: input.trim() && !isLoading ? 1 : 0.3 }
          }, React.createElement(Send, { size: 16, className: "text-white/60" }))))));
}
