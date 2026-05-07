'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react';
import {
  Lightbulb, FileText, TrendingUp, Award, Scale, Target,
  MessageCircle, BarChart2, Sparkles, Rocket, ArrowRight,
  Check, ChevronDown, X, Menu
} from '@/components/icons';
import { Logo, PrimaryButton, SecondaryButton } from '@/components/ui';

export function LandingPage({ onStart }: { onStart: () => void }) {
  var menuState = useState(false); var menuOpen = menuState[0]; var setMenuOpen = menuState[1];
  var faqState = useState<number | null>(null); var activeFaq = faqState[0]; var setActiveFaq = faqState[1];

  var features = [
    {icon:Lightbulb, title:"Idee validieren", desc:"KI-Marktanalyse mit Wettbewerbern, Marktgr\xf6\xdfe, Trends und deiner optimalen Positionierung."},
    {icon:FileText, title:"Businessplan in Minuten", desc:"Beantworte 10 Fragen — die KI schreibt einen kompletten, investorenreifen Businessplan."},
    {icon:TrendingUp, title:"Finanzplan & 3-Jahres-Prognose", desc:"Realistische Umsatz-, Kosten- und Liquidit\xe4tsplanung als Excel- und HTML-Export."},
    {icon:Award, title:"F\xf6rderprogramme finden", desc:"Die KI durchsucht Bundes- und Landesprogramme und matcht sie mit deinem Profil."},
    {icon:Scale, title:"Rechtsform & Beh\xf6rden", desc:"Welche Rechtsform passt? Welche Anmeldungen brauchst du? Mit Fristen-Tracker."},
    {icon:Target, title:"Pers\xf6nliche Roadmap", desc:"KI-generierte 90-Tage-Aufgabenliste, die mit deinem Fortschritt mitw\xe4chst."},
    {icon:MessageCircle, title:"KI-Gr\xfcndungsberater", desc:"24/7 dein pers\xf6nlicher Mentor — Fragen zu Steuern, Recht, Strategie und Finanzierung."},
    {icon:BarChart2, title:"Cockpit & Wochencheck", desc:"KPIs, Fristen, Meeting-Vorbereitung und w\xf6chentliches KI-Feedback an einem Ort."}
  ];

  var pillars = [
    {icon:Sparkles, title:"Eine KI, die dich kennt", desc:"CoFounder AI lernt dein Startup, deine Branche und deine Phase — und gibt Antworten, die wirklich zu dir passen. Keine Templates, keine Standardfloskeln."},
    {icon:BarChart2, title:"Alles unter einem Dach", desc:"Idee, Plan, Finanzen, Recht, F\xf6rderung, Dokumente, Coaching — kein Tool-Wirrwarr. Ein Login, ein Dashboard, alles im Blick."},
    {icon:Rocket, title:"Vom Gedanken zum Unternehmen", desc:"Du startest mit einer Idee und endest mit einem registrierten Unternehmen, einem Businessplan in der Hand und F\xf6rderantr\xe4gen in der Pipeline."}
  ];

  var faqs = [
    {q:"Was kann CoFounder AI eigentlich genau?", a:"Alles, was du zum Gr\xfcnden brauchst: Idee sch\xe4rfen, Marktanalyse, Businessplan & Finanzplan generieren, passende F\xf6rderprogramme finden, Rechtsform empfehlen, Beh\xf6rdeng\xe4nge planen, Dokumente verwalten und ein KI-Berater, der jederzeit Fragen beantwortet. Plus ein Cockpit f\xfcr deinen Wochenfortschritt."},
    {q:"Wie pers\xf6nlich sind die Antworten der KI?", a:"Sehr. Die KI nutzt dein komplettes Profil — Branche, Phase, Bundesland, Team, Gesch\xe4ftsmodell — und generiert daraus individuelle Empfehlungen. Keine generischen Listen."},
    {q:"Ist CoFounder AI kostenlos?", a:"Ja, der Einstieg ist komplett kostenlos. Du kannst Profil anlegen, Roadmap generieren, Marktanalyse machen und den KI-Berater nutzen. Pro-Features folgen sp\xe4ter."},
    {q:"Woher kommen die F\xf6rderdaten?", a:"Aus offiziellen Quellen wie KfW, BMWK und regionalen F\xf6rderbanken — kombiniert mit KI-Recherche, die auch neue und nischige Programme findet, die in keiner Standardliste stehen."},
    {q:"F\xfcr wen ist die Plattform?", a:"F\xfcr alle, die in Deutschland gr\xfcnden m\xf6chten — Solopreneure, Startups, Freelancer, Side-Projects. Egal ob du noch in der Ideenphase steckst oder schon fast loslegst."},
    {q:"Was passiert mit meinen Daten?", a:"Alle Daten liegen auf EU-Servern, DSGVO-konform. Keine Weitergabe an Dritte. Deine Idee bleibt deine Idee."}
  ];

  return React.createElement("div", { className:"min-h-screen text-white" },

    React.createElement("header", { className:"fixed top-0 left-0 right-0 z-50 px-6 py-4", style:{backdropFilter:"blur(12px)",background:"var(--bg-header-blur)"} },
      React.createElement("div", { className:"max-w-6xl mx-auto flex items-center justify-between" },
        React.createElement(Logo, { size:"sm" }),
        React.createElement("div", { className:"hidden md:flex items-center gap-6" },
          React.createElement("a", { href:"#features", className:"text-xs text-white/50 hover:text-white/80 transition-colors" }, "Features"),
          React.createElement("a", { href:"#how", className:"text-xs text-white/50 hover:text-white/80 transition-colors" }, "So funktioniert's"),
          React.createElement("a", { href:"#faq", className:"text-xs text-white/50 hover:text-white/80 transition-colors" }, "FAQ"),
          React.createElement(SecondaryButton, { onClick:onStart, className:"py-2 px-4 text-xs" }, "Anmelden / Registrieren")),
        React.createElement("button", { className:"md:hidden text-white/60", onClick:function(){setMenuOpen(!menuOpen)} }, menuOpen ? React.createElement(X,{size:20}) : React.createElement(Menu,{size:20})))),

    React.createElement("section", { className:"pt-36 pb-24 px-6" },
      React.createElement("div", { className:"max-w-4xl mx-auto text-center" },
        React.createElement("div", { className:"inline-flex items-center gap-2 text-xs text-white/55 mb-8 px-3 py-1.5 rounded-full", style:{background:"var(--surface-5)"} },
          React.createElement(Sparkles,{size:12,className:"text-emerald-400/70"}),
          "Dein KI-Co-Founder f\xfcr die Unternehmensgr\xfcndung"),
        React.createElement("h1", { className:"text-5xl md:text-6xl lg:text-7xl font-medium text-white mb-8", style:{letterSpacing:"-0.04em",lineHeight:"0.95"} },
          "Gr\xfcnde dein Unternehmen — ",
          React.createElement("span",{style:{background:"var(--hero-gradient)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}},"mit KI an deiner Seite.")),
        React.createElement("p", { className:"text-white/55 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto" },
          "Von der ersten Idee bis zum eingetragenen Unternehmen: Businessplan, Finanzplan, F\xf6rderprogramme, Rechtsform, Beh\xf6rdeng\xe4nge — alles in einer Plattform, alles auf dich zugeschnitten."),
        React.createElement("div", { className:"flex flex-wrap gap-3 justify-center mb-10" },
          React.createElement(PrimaryButton, { onClick:onStart, className:"text-base py-3.5 px-7" },
            "Kostenlos starten ", React.createElement(ArrowRight,{size:16}))),
        React.createElement("div", { className:"flex items-center gap-6 justify-center text-xs text-white/35 flex-wrap" },
          React.createElement("span", { className:"flex items-center gap-1.5" }, React.createElement(Check,{size:12,className:"text-emerald-400/70"}), "Komplett kostenlos"),
          React.createElement("span", { className:"flex items-center gap-1.5" }, React.createElement(Check,{size:12,className:"text-emerald-400/70"}), "DSGVO-konform"),
          React.createElement("span", { className:"flex items-center gap-1.5" }, React.createElement(Check,{size:12,className:"text-emerald-400/70"}), "Keine Kreditkarte"),
          React.createElement("span", { className:"flex items-center gap-1.5" }, React.createElement(Check,{size:12,className:"text-emerald-400/70"}), "In 5 Minuten startklar")))),

    React.createElement("section", { className:"py-20 px-6" },
      React.createElement("div", { className:"max-w-5xl mx-auto" },
        React.createElement("div", { className:"grid md:grid-cols-3 gap-12 md:gap-16" }, pillars.map(function(p: any, i: number) {
          return React.createElement("div", { key:i, className:"text-center md:text-left" },
            React.createElement("div", { className:"w-12 h-12 rounded-2xl flex items-center justify-center mb-5 mx-auto md:mx-0", style:{background:"var(--surface-8)"} },
              React.createElement(p.icon, { size:22, className:"text-white/70" })),
            React.createElement("h3", { className:"text-white text-xl font-medium mb-3", style:{letterSpacing:"-0.01em"} }, p.title),
            React.createElement("p", { className:"text-white/50 text-sm leading-relaxed" }, p.desc));
        })))),

    React.createElement("section", { id:"features", className:"py-24 px-6" },
      React.createElement("div", { className:"max-w-5xl mx-auto" },
        React.createElement("div", { className:"text-center mb-16" },
          React.createElement("p", { className:"text-xs uppercase tracking-widest text-white/40 mb-3" }, "Was du bekommst"),
          React.createElement("h2", { className:"text-4xl md:text-5xl font-medium text-white mb-4", style:{letterSpacing:"-0.03em"} }, "Acht Werkzeuge. Eine Plattform."),
          React.createElement("p", { className:"text-white/45 max-w-xl mx-auto text-base" },
            "Jedes einzelne Tool w\xe4re eine eigene App wert. Bei CoFounder AI bekommst du sie alle — perfekt aufeinander abgestimmt.")),
        React.createElement("div", { className:"grid md:grid-cols-2 gap-x-12 gap-y-10" }, features.map(function(f: any, i: number) {
          return React.createElement("div", { key:i, className:"flex gap-5" },
            React.createElement("div", { className:"flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center", style:{background:"var(--surface-6)"} },
              React.createElement(f.icon, { size:18, className:"text-white/70" })),
            React.createElement("div", null,
              React.createElement("h3", { className:"text-white font-medium mb-1.5" }, f.title),
              React.createElement("p", { className:"text-white/45 text-sm leading-relaxed" }, f.desc)));
        })))),

    React.createElement("section", { id:"how", className:"py-24 px-6" },
      React.createElement("div", { className:"max-w-4xl mx-auto" },
        React.createElement("div", { className:"text-center mb-16" },
          React.createElement("p", { className:"text-xs uppercase tracking-widest text-white/40 mb-3" }, "So funktioniert's"),
          React.createElement("h2", { className:"text-4xl md:text-5xl font-medium text-white mb-4", style:{letterSpacing:"-0.03em"} }, "In drei Schritten zum Unternehmen.")),
        React.createElement("div", { className:"space-y-12" },
          [
            {n:"01", t:"Erz\xe4hl uns von deiner Idee", d:"Ein kurzes Onboarding: Was machst du, wer sind deine Kunden, in welcher Phase bist du? Die KI baut daraus dein pers\xf6nliches Gr\xfcnderprofil."},
            {n:"02", t:"Lass die KI f\xfcr dich arbeiten", d:"Businessplan, Finanzplan, Marktanalyse, F\xf6rderprogramme, Rechtsform-Empfehlung — alles auf Knopfdruck, alles individuell f\xfcr dich generiert."},
            {n:"03", t:"Setze um — wir behalten den \xdcberblick", d:"Deine 90-Tage-Roadmap zeigt dir Woche f\xfcr Woche die n\xe4chsten Schritte. Das Cockpit erinnert dich an Fristen und feiert deine Fortschritte."}
          ].map(function(s: any, i: number) {
            return React.createElement("div", { key:i, className:"flex gap-6 md:gap-10 items-start" },
              React.createElement("div", { className:"text-4xl md:text-5xl font-medium text-white/15 flex-shrink-0", style:{minWidth:60,letterSpacing:"-0.03em"} }, s.n),
              React.createElement("div", null,
                React.createElement("h3", { className:"text-xl md:text-2xl font-medium text-white mb-2", style:{letterSpacing:"-0.01em"} }, s.t),
                React.createElement("p", { className:"text-white/50 text-base leading-relaxed max-w-xl" }, s.d)));
          })))),

    React.createElement("section", { id:"faq", className:"py-24 px-6" },
      React.createElement("div", { className:"max-w-2xl mx-auto" },
        React.createElement("div", { className:"text-center mb-12" },
          React.createElement("p", { className:"text-xs uppercase tracking-widest text-white/40 mb-3" }, "FAQ"),
          React.createElement("h2", { className:"text-4xl md:text-5xl font-medium text-white", style:{letterSpacing:"-0.03em"} }, "H\xe4ufige Fragen.")),
        React.createElement("div", { className:"divide-y divide-white/[0.06]" }, faqs.map(function(faq: any, i: number) {
          var isOpen = activeFaq === i;
          return React.createElement("div", { key:i },
            React.createElement("button", { className:"w-full flex items-center justify-between py-5 text-left group", onClick:function(){setActiveFaq(isOpen?null:i)} },
              React.createElement("span", { className:"text-white/80 font-medium text-base transition-colors" }, faq.q),
              React.createElement(ChevronDown, { size:18, className:"text-white/30 flex-shrink-0 ml-4 transition-transform duration-200", style:{transform:isOpen?"rotate(180deg)":"rotate(0deg)"} })),
            isOpen && React.createElement("div", { className:"pb-5 text-sm text-white/55 leading-relaxed max-w-xl" }, faq.a));
        })))),

    React.createElement("section", { className:"py-28 px-6" },
      React.createElement("div", { className:"max-w-2xl mx-auto text-center" },
        React.createElement("h2", { className:"text-4xl md:text-5xl font-medium text-white mb-5", style:{letterSpacing:"-0.03em"} },
          "Deine Idee verdient ", React.createElement("span", { style:{background:"var(--hero-gradient)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"} }, "den richtigen Start.")),
        React.createElement("p", { className:"text-white/50 mb-10 text-lg" }, "Lass die KI das Komplizierte machen. Du fokussierst dich auf das, was z\xe4hlt — dein Unternehmen aufzubauen."),
        React.createElement(PrimaryButton, { onClick:onStart, className:"text-base py-4 px-10 mx-auto" }, "Jetzt kostenlos starten ", React.createElement(ArrowRight,{size:16})),
        React.createElement("p", { className:"text-xs text-white/30 mt-5" }, "Kein Kreditkarteneintrag \xb7 Vollst\xe4ndig DSGVO-konform \xb7 Server in Deutschland"))),

    React.createElement("footer", { className:"py-8 px-6 text-center text-xs text-white/25" }, "\xa9 2025 CoFounder AI \xb7 Datenschutz \xb7 Impressum"));
}
