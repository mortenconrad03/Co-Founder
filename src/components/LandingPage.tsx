'use client';
import React, { useState, useEffect, useId } from 'react';
import {
  Lightbulb, FileText, TrendingUp, Award, Scale, Target,
  MessageCircle, BarChart2, Sparkles, Rocket, ArrowRight,
  Check, ChevronDown, X, Menu
} from '@/components/icons';
import { Logo, PrimaryButton } from '@/components/ui';

export function LandingPage({ onStart }: { onStart: () => void }) {
  var menuState = useState(false); var menuOpen = menuState[0]; var setMenuOpen = menuState[1];
  var faqState = useState<number | null>(null); var activeFaq = faqState[0]; var setActiveFaq = faqState[1];
  var noiseId = useId().replace(/:/g, '');

  useEffect(function() {
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) { e.target.classList.add('sr-vis'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.sr').forEach(function(el) { obs.observe(el); });
    return function() { obs.disconnect(); };
  }, []);

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

  var steps = [
    {n:"01", t:"Erz\xe4hl uns von deiner Idee", d:"Ein kurzes Onboarding: Was machst du, wer sind deine Kunden, in welcher Phase bist du? Die KI baut daraus dein pers\xf6nliches Gr\xfcnderprofil."},
    {n:"02", t:"Lass die KI f\xfcr dich arbeiten", d:"Businessplan, Finanzplan, Marktanalyse, F\xf6rderprogramme, Rechtsform-Empfehlung — alles auf Knopfdruck, alles individuell f\xfcr dich generiert."},
    {n:"03", t:"Setze um — wir behalten den \xdcberblick", d:"Deine 90-Tage-Roadmap zeigt dir Woche f\xfcr Woche die n\xe4chsten Schritte. Das Cockpit erinnert dich an Fristen und feiert deine Fortschritte."}
  ];

  var glass: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.07)"
  };

  var c = {
    hi:  "#ffffff",
    mid: "rgba(255,255,255,0.65)",
    low: "rgba(255,255,255,0.42)",
    dim: "rgba(255,255,255,0.28)",
    ghost: "rgba(255,255,255,0.18)",
    icon: "rgba(255,255,255,0.55)"
  };

  return React.createElement("div", { style:{minHeight:"100vh",color:"#fff",background:"#0b0b0f",position:"relative",overflowX:"hidden"} },

    // ── Fixed background layers ──
    React.createElement("div", { "aria-hidden":"true", style:{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"} },
      // Ambient glow — top left
      React.createElement("div", { style:{position:"absolute",top:"-20%",left:"-8%",width:"60%",height:"70%",background:"radial-gradient(ellipse at 40% 45%,rgba(255,255,255,0.055) 0%,transparent 62%)",filter:"blur(80px)"} }),
      // Ambient glow — bottom right
      React.createElement("div", { style:{position:"absolute",bottom:"-15%",right:"-5%",width:"55%",height:"65%",background:"radial-gradient(ellipse at 60% 55%,rgba(255,255,255,0.035) 0%,transparent 62%)",filter:"blur(100px)"} }),
      // Structural grid
      React.createElement("div", { style:{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px)",backgroundSize:"72px 72px"} }),
      // Grain / grunge texture
      React.createElement("div", { dangerouslySetInnerHTML:{__html:'<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0.11"><filter id="'+noiseId+'"><feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#'+noiseId+')"/></svg>'}, style:{position:"absolute",inset:0} })
    ),

    // ── All content ──
    React.createElement("div", { style:{position:"relative",zIndex:1} },

      // ── Header ──
      React.createElement("header", { style:{position:"fixed",top:0,left:0,right:0,zIndex:50,padding:"14px 24px",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",background:"rgba(11,11,15,0.55)",borderBottom:"1px solid rgba(255,255,255,0.05)"} },
        React.createElement("div", { className:"max-w-6xl mx-auto flex items-center justify-between" },
          React.createElement(Logo, { size:"sm" }),
          React.createElement("div", { className:"hidden md:flex items-center gap-8" },
            React.createElement("a", { href:"#features", style:{fontSize:"0.75rem",color:c.dim,textDecoration:"none"} }, "Features"),
            React.createElement("a", { href:"#how", style:{fontSize:"0.75rem",color:c.dim,textDecoration:"none"} }, "So funktioniert's"),
            React.createElement("a", { href:"#faq", style:{fontSize:"0.75rem",color:c.dim,textDecoration:"none"} }, "FAQ"),
            React.createElement("span", { onClick:onStart, style:{fontSize:"0.75rem",color:c.mid,cursor:"pointer"} }, "Anmelden →")),
          React.createElement("button", { className:"md:hidden", style:{color:c.low,background:"none",border:"none",cursor:"pointer",padding:0}, onClick:function(){setMenuOpen(!menuOpen)} },
            menuOpen ? React.createElement(X,{size:20}) : React.createElement(Menu,{size:20}))
        )
      ),

      // ── Mobile menu ──
      menuOpen && React.createElement("div", { style:{position:"fixed",inset:0,zIndex:40,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:32,background:"rgba(11,11,15,0.97)",backdropFilter:"blur(24px)"} },
        React.createElement("button", { onClick:function(){setMenuOpen(false)}, style:{position:"absolute",top:20,right:24,color:c.low,background:"none",border:"none",cursor:"pointer"} }, React.createElement(X,{size:20})),
        ["Features","So funktioniert's","FAQ"].map(function(label, i) {
          return React.createElement("a", { key:i, href:"#"+["features","how","faq"][i], style:{fontSize:"1.5rem",fontWeight:500,color:c.mid,textDecoration:"none"}, onClick:function(){setMenuOpen(false)} }, label);
        }),
        React.createElement("span", { onClick:function(){setMenuOpen(false);onStart();}, style:{fontSize:"1.1rem",color:c.hi,cursor:"pointer"} }, "Anmelden / Registrieren")
      ),

      // ── Hero ──
      React.createElement("section", { style:{paddingTop:144,paddingBottom:112,paddingLeft:24,paddingRight:24} },
        React.createElement("div", { className:"max-w-4xl mx-auto text-center" },
          React.createElement("div", { className:"sr inline-flex items-center gap-2 text-xs mb-10 px-3 py-1.5 rounded-full", style:{color:c.dim,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)"} },
            React.createElement(Sparkles,{size:12,style:{color:c.ghost}}),
            "Dein KI-Co-Founder f\xfcr die Unternehmensgr\xfcndung"),
          React.createElement("h1", { className:"sr sr-delay-1", style:{fontSize:"clamp(2.8rem,7vw,4.5rem)",fontWeight:500,letterSpacing:"-0.04em",lineHeight:0.94,color:c.hi,marginBottom:28} },
            "Gr\xfcnde dein Unternehmen\xa0— ",
            React.createElement("span", { style:{background:"linear-gradient(140deg,rgba(255,255,255,0.95) 0%,rgba(255,255,255,0.38) 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"} },
              "mit KI an deiner Seite.")),
          React.createElement("p", { className:"sr sr-delay-2", style:{fontSize:"1.1rem",lineHeight:1.65,color:c.low,marginBottom:44,maxWidth:580,marginLeft:"auto",marginRight:"auto"} },
            "Von der ersten Idee bis zum eingetragenen Unternehmen: Businessplan, Finanzplan, F\xf6rderprogramme, Rechtsform, Beh\xf6rdeng\xe4nge — alles in einer Plattform."),
          React.createElement("div", { className:"sr sr-delay-3", style:{marginBottom:48} },
            React.createElement(PrimaryButton, { onClick:onStart, className:"text-base py-4 px-8" },
              "Kostenlos starten\xa0", React.createElement(ArrowRight,{size:16}))),
          React.createElement("div", { className:"sr sr-delay-4 flex items-center gap-7 justify-center flex-wrap", style:{fontSize:"0.72rem",color:c.ghost} },
            ...[["Komplett kostenlos"],["DSGVO-konform"],["Keine Kreditkarte"],["In 5 Minuten startklar"]].map(function(item, i) {
              return React.createElement("span", { key:i, className:"flex items-center gap-1.5" },
                React.createElement(Check,{size:11,style:{color:c.ghost}}), item[0]);
            })
          )
        )
      ),

      // ── Pillars ──
      React.createElement("section", { style:{padding:"16px 24px 80px"} },
        React.createElement("div", { className:"max-w-5xl mx-auto grid md:grid-cols-3 gap-5" },
          pillars.map(function(p: any, i: number) {
            return React.createElement("div", { key:i, className:"sr p-7 rounded-2xl", style:{...glass, transitionDelay:(i*0.1)+"s"} },
              React.createElement("div", { style:{width:40,height:40,borderRadius:12,background:"rgba(255,255,255,0.07)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20} },
                React.createElement(p.icon, { size:19, style:{color:c.icon} })),
              React.createElement("h3", { style:{fontWeight:500,fontSize:"1.05rem",letterSpacing:"-0.01em",color:c.hi,marginBottom:10} }, p.title),
              React.createElement("p", { style:{fontSize:"0.85rem",lineHeight:1.65,color:c.low} }, p.desc));
          })
        )
      ),

      // ── Features ──
      React.createElement("section", { id:"features", style:{padding:"80px 24px"} },
        React.createElement("div", { className:"max-w-5xl mx-auto" },
          React.createElement("div", { className:"text-center mb-16 sr" },
            React.createElement("p", { style:{fontSize:"0.7rem",textTransform:"uppercase",letterSpacing:"0.14em",color:c.ghost,marginBottom:12} }, "Was du bekommst"),
            React.createElement("h2", { style:{fontSize:"clamp(2rem,5vw,3rem)",fontWeight:500,letterSpacing:"-0.03em",color:c.hi,marginBottom:14} }, "Acht Werkzeuge. Eine Plattform."),
            React.createElement("p", { style:{maxWidth:460,margin:"0 auto",fontSize:"0.9rem",color:c.low,lineHeight:1.65} },
              "Jedes einzelne Tool w\xe4re eine eigene App wert. Bei CoFounder AI bekommst du sie alle — perfekt aufeinander abgestimmt.")),
          React.createElement("div", { className:"grid md:grid-cols-2 gap-3" },
            features.map(function(f: any, i: number) {
              return React.createElement("div", { key:i, className:"sr flex gap-5 p-5 rounded-2xl", style:{...glass,transitionDelay:(i*0.06)+"s"} },
                React.createElement("div", { style:{flexShrink:0,width:38,height:38,borderRadius:10,background:"rgba(255,255,255,0.07)",display:"flex",alignItems:"center",justifyContent:"center"} },
                  React.createElement(f.icon, { size:16, style:{color:c.icon} })),
                React.createElement("div", null,
                  React.createElement("h3", { style:{fontWeight:500,fontSize:"0.9rem",color:c.mid,marginBottom:5} }, f.title),
                  React.createElement("p", { style:{fontSize:"0.82rem",lineHeight:1.6,color:c.low} }, f.desc)));
            })
          )
        )
      ),

      // ── Steps ──
      React.createElement("section", { id:"how", style:{padding:"80px 24px"} },
        React.createElement("div", { className:"max-w-4xl mx-auto" },
          React.createElement("div", { className:"text-center mb-16 sr" },
            React.createElement("p", { style:{fontSize:"0.7rem",textTransform:"uppercase",letterSpacing:"0.14em",color:c.ghost,marginBottom:12} }, "So funktioniert's"),
            React.createElement("h2", { style:{fontSize:"clamp(2rem,5vw,3rem)",fontWeight:500,letterSpacing:"-0.03em",color:c.hi} }, "In drei Schritten zum Unternehmen.")),
          React.createElement("div", { style:{display:"flex",flexDirection:"column",gap:12} },
            steps.map(function(s: any, i: number) {
              return React.createElement("div", { key:i, className:"sr flex gap-8 md:gap-12 items-start p-7 rounded-2xl", style:{...glass,transitionDelay:(i*0.12)+"s"} },
                React.createElement("div", { style:{fontSize:"2.8rem",fontWeight:500,letterSpacing:"-0.03em",color:"rgba(255,255,255,0.1)",flexShrink:0,minWidth:52,lineHeight:1} }, s.n),
                React.createElement("div", null,
                  React.createElement("h3", { style:{fontSize:"1.15rem",fontWeight:500,letterSpacing:"-0.01em",color:c.mid,marginBottom:8} }, s.t),
                  React.createElement("p", { style:{fontSize:"0.88rem",lineHeight:1.65,color:c.low,maxWidth:520} }, s.d)));
            })
          )
        )
      ),

      // ── FAQ ──
      React.createElement("section", { id:"faq", style:{padding:"80px 24px"} },
        React.createElement("div", { className:"max-w-2xl mx-auto" },
          React.createElement("div", { className:"text-center mb-12 sr" },
            React.createElement("p", { style:{fontSize:"0.7rem",textTransform:"uppercase",letterSpacing:"0.14em",color:c.ghost,marginBottom:12} }, "FAQ"),
            React.createElement("h2", { style:{fontSize:"clamp(2rem,5vw,3rem)",fontWeight:500,letterSpacing:"-0.03em",color:c.hi} }, "H\xe4ufige Fragen.")),
          React.createElement("div", { style:{display:"flex",flexDirection:"column",gap:8} },
            faqs.map(function(faq: any, i: number) {
              var isOpen = activeFaq === i;
              return React.createElement("div", { key:i, className:"sr rounded-2xl overflow-hidden", style:{...glass,transitionDelay:(i*0.05)+"s"} },
                React.createElement("button", { className:"w-full flex items-center justify-between px-6 py-5 text-left", style:{background:"none",border:"none",cursor:"pointer"}, onClick:function(){setActiveFaq(isOpen?null:i)} },
                  React.createElement("span", { style:{fontWeight:500,fontSize:"0.95rem",color:c.mid} }, faq.q),
                  React.createElement(ChevronDown, { size:15, style:{color:c.ghost,flexShrink:0,marginLeft:16,transform:isOpen?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.2s ease"} })),
                isOpen && React.createElement("div", { style:{padding:"0 24px 20px",fontSize:"0.83rem",lineHeight:1.7,color:c.low} }, faq.a));
            })
          )
        )
      ),

      // ── Final CTA ──
      React.createElement("section", { style:{padding:"100px 24px 120px"} },
        React.createElement("div", { className:"max-w-2xl mx-auto text-center sr" },
          React.createElement("h2", { style:{fontSize:"clamp(2rem,5vw,3rem)",fontWeight:500,letterSpacing:"-0.03em",color:c.hi,marginBottom:18} },
            "Deine Idee verdient\xa0",
            React.createElement("span", { style:{background:"linear-gradient(140deg,rgba(255,255,255,0.9),rgba(255,255,255,0.35))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"} },
              "den richtigen Start.")),
          React.createElement("p", { style:{color:c.low,marginBottom:40,fontSize:"1rem",lineHeight:1.65} },
            "Lass die KI das Komplizierte machen. Du fokussierst dich auf das, was z\xe4hlt — dein Unternehmen aufzubauen."),
          React.createElement(PrimaryButton, { onClick:onStart, className:"text-base py-4 px-10 mx-auto" },
            "Jetzt kostenlos starten\xa0", React.createElement(ArrowRight,{size:16})),
          React.createElement("p", { style:{fontSize:"0.72rem",color:c.ghost,marginTop:18} },
            "Kein Kreditkarteneintrag\xa0\xb7\xa0Vollst\xe4ndig DSGVO-konform\xa0\xb7\xa0Server in Deutschland"))
      ),

      // ── Footer ──
      React.createElement("footer", { style:{padding:"24px",textAlign:"center",fontSize:"0.72rem",color:c.ghost} },
        "\xa9 2025 CoFounder AI\xa0\xb7\xa0Datenschutz\xa0\xb7\xa0Impressum")
    )
  );
}
