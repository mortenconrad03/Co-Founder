/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

export const BUNDESLAENDER = ["Baden-Württemberg","Bayern","Berlin","Brandenburg","Bremen","Hamburg","Hessen","Mecklenburg-Vorpommern","Niedersachsen","Nordrhein-Westfalen","Rheinland-Pfalz","Saarland","Sachsen","Sachsen-Anhalt","Schleswig-Holstein","Thüringen"];

export const BRANCHEN = ["SaaS / Software","Cleantech / GreenTech","HealthTech","EdTech","FinTech","E-Commerce","Hardware / IoT","KI / Machine Learning","Consulting / Dienstleistung","Andere"];

export const GEWERBE_CHECKLISTS: Record<string, any> = {
  einzelunternehmen: { label:"Einzelunternehmen", steps:[
    {id:"gewerbe_einzel_1",title:"Gewerbeanmeldung ausfüllen",desc:"Formular beim zuständigen Gewerbeamt ausfüllen (Kosten: 20–60 €).",zeit:"30 min",link:"https://www.gewerbeanmeldung.de"},
    {id:"gewerbe_einzel_2",title:"Personalausweis kopieren",desc:"Kopie deines gültigen Personalausweises oder Reisepasses anfertigen.",zeit:"5 min"},
    {id:"gewerbe_einzel_3",title:"Tätigkeitsbeschreibung formulieren",desc:"Präzise Beschreibung deiner gewerblichen Tätigkeit erstellen.",zeit:"15 min"},
    {id:"gewerbe_einzel_4",title:"Gewerbeamt-Termin buchen",desc:"Online-Termin beim Gewerbeamt deiner Stadt/Gemeinde vereinbaren.",zeit:"10 min"},
    {id:"gewerbe_einzel_5",title:"Finanzamt-Fragebogen (ELSTER) vorbereiten",desc:"Fragebogen zur steuerlichen Erfassung über ELSTER ausfüllen.",zeit:"45 min",link:"https://www.elster.de"},
    {id:"gewerbe_einzel_6",title:"Geschäftskonto eröffnen",desc:"Geschäftskonto bei einer Bank eröffnen – Privat und Geschäft trennen.",zeit:"30 min"},
    {id:"gewerbe_einzel_7",title:"Kleinunternehmerregelung prüfen",desc:"Prüfe ob die Kleinunternehmerregelung (§19 UStG) für dich sinnvoll ist.",zeit:"15 min"},
    {id:"gewerbe_einzel_8",title:"Betriebshaftpflicht prüfen",desc:"Informiere dich über sinnvolle Versicherungen für dein Gewerbe.",zeit:"20 min"}
  ]},
  kleingewerbe: { label:"Kleingewerbe", steps:[
    {id:"gewerbe_klein_1",title:"Gewerbeanmeldung ausfüllen",desc:"Formular beim Gewerbeamt ausfüllen (vereinfachtes Verfahren).",zeit:"30 min",link:"https://www.gewerbeanmeldung.de"},
    {id:"gewerbe_klein_2",title:"Personalausweis kopieren",desc:"Kopie deines gültigen Ausweisdokuments anfertigen.",zeit:"5 min"},
    {id:"gewerbe_klein_3",title:"Tätigkeitsbeschreibung formulieren",desc:"Gewerbliche Tätigkeit präzise beschreiben.",zeit:"15 min"},
    {id:"gewerbe_klein_4",title:"Gewerbeamt-Termin buchen",desc:"Termin beim zuständigen Gewerbeamt vereinbaren.",zeit:"10 min"},
    {id:"gewerbe_klein_5",title:"Kleinunternehmerregelung beantragen",desc:"Umsatzsteuerbefreiung nach §19 UStG beim Finanzamt beantragen.",zeit:"20 min"},
    {id:"gewerbe_klein_6",title:"Finanzamt-Fragebogen (ELSTER)",desc:"Steuerliche Erfassung über ELSTER durchführen.",zeit:"45 min",link:"https://www.elster.de"},
    {id:"gewerbe_klein_7",title:"Einfache Buchführung einrichten",desc:"EÜR-Vorlage vorbereiten (Einnahmen-Überschuss-Rechnung).",zeit:"30 min"},
    {id:"gewerbe_klein_8",title:"Geschäftskonto eröffnen",desc:"Separates Konto für geschäftliche Transaktionen einrichten.",zeit:"30 min"}
  ]},
  gbr: { label:"GbR", steps:[
    {id:"gewerbe_gbr_1",title:"GbR-Vertrag aufsetzen",desc:"Gesellschaftsvertrag mit allen Partnern schriftlich festhalten.",zeit:"1-2 h"},
    {id:"gewerbe_gbr_2",title:"Gewerbeanmeldung für alle Gesellschafter",desc:"Jeder Gesellschafter muss separat ein Gewerbe anmelden.",zeit:"30 min",link:"https://www.gewerbeanmeldung.de"},
    {id:"gewerbe_gbr_3",title:"Ausweisdokumente aller Gesellschafter",desc:"Personalausweise aller Gesellschafter kopieren.",zeit:"10 min"},
    {id:"gewerbe_gbr_4",title:"Gesellschaftsname festlegen",desc:"Einen Namen für die GbR wählen und prüfen lassen.",zeit:"30 min"},
    {id:"gewerbe_gbr_5",title:"Steuerliche Erfassung (ELSTER)",desc:"Fragebogen zur steuerlichen Erfassung für die GbR ausfüllen.",zeit:"45 min",link:"https://www.elster.de"},
    {id:"gewerbe_gbr_6",title:"Geschäftskonto eröffnen",desc:"Gemeinsames Geschäftskonto für die GbR eröffnen.",zeit:"30 min"},
    {id:"gewerbe_gbr_7",title:"Gewinnverteilung festlegen",desc:"Klare Regelung der Gewinn- und Verlustverteilung dokumentieren.",zeit:"30 min"},
    {id:"gewerbe_gbr_8",title:"Haftungsregelung klären",desc:"Gesamtschuldnerische Haftung verstehen und ggf. Versicherung prüfen.",zeit:"20 min"}
  ]},
  ug: { label:"UG (haftungsbeschränkt)", steps:[
    {id:"gewerbe_ug_1",title:"Gesellschaftsvertrag aufsetzen",desc:"Satzung der UG erstellen (Musterprotokoll oder individuell).",zeit:"1-2 h"},
    {id:"gewerbe_ug_2",title:"Notar-Termin buchen",desc:"Notarielle Beurkundung des Gesellschaftsvertrags (ca. 500–1.000 €).",zeit:"30 min"},
    {id:"gewerbe_ug_3",title:"Stammkapital einzahlen",desc:"Mindestens 1 € Stammkapital auf ein Geschäftskonto einzahlen.",zeit:"30 min"},
    {id:"gewerbe_ug_4",title:"Handelsregister-Eintragung beantragen",desc:"Anmeldung beim Handelsregister über den Notar (ca. 150 €).",zeit:"30 min",link:"https://www.handelsregister.de"},
    {id:"gewerbe_ug_5",title:"Gewerbeanmeldung durchführen",desc:"Nach HR-Eintrag: Gewerbe beim zuständigen Amt anmelden.",zeit:"30 min",link:"https://www.gewerbeanmeldung.de"},
    {id:"gewerbe_ug_6",title:"Steuerliche Erfassung (ELSTER)",desc:"Fragebogen zur steuerlichen Erfassung der UG ausfüllen.",zeit:"45 min",link:"https://www.elster.de"},
    {id:"gewerbe_ug_7",title:"Geschäftskonto eröffnen",desc:"Firmenkonto bei einer Bank eröffnen.",zeit:"30 min"},
    {id:"gewerbe_ug_8",title:"Geschäftsführervertrag erstellen",desc:"Vertrag für den/die Geschäftsführer aufsetzen.",zeit:"1 h"},
    {id:"gewerbe_ug_9",title:"Transparenzregister-Eintragung",desc:"Eintragung der wirtschaftlich Berechtigten im Transparenzregister.",zeit:"20 min",link:"https://www.transparenzregister.de"},
    {id:"gewerbe_ug_10",title:"Rücklagen-Pflicht beachten",desc:"25% des Jahresüberschusses müssen als Rücklage einbehalten werden.",zeit:"10 min"}
  ]},
  gmbh: { label:"GmbH", steps:[
    {id:"gewerbe_gmbh_1",title:"Gesellschaftsvertrag aufsetzen",desc:"Satzung der GmbH mit Anwalt/Steuerberater erstellen.",zeit:"2-4 h"},
    {id:"gewerbe_gmbh_2",title:"Notar-Termin buchen",desc:"Notarielle Beurkundung des Gesellschaftsvertrags (ca. 1.000–2.000 €).",zeit:"30 min"},
    {id:"gewerbe_gmbh_3",title:"Stammkapital einzahlen",desc:"Mindestens 12.500 € (Hälfte von 25.000 €) auf Geschäftskonto einzahlen.",zeit:"1 h"},
    {id:"gewerbe_gmbh_4",title:"Handelsregister-Eintragung beantragen",desc:"Anmeldung beim Handelsregister über den Notar.",zeit:"30 min",link:"https://www.handelsregister.de"},
    {id:"gewerbe_gmbh_5",title:"Gewerbeanmeldung durchführen",desc:"Nach HR-Eintrag: Gewerbe beim zuständigen Amt anmelden.",zeit:"30 min",link:"https://www.gewerbeanmeldung.de"},
    {id:"gewerbe_gmbh_6",title:"Steuerliche Erfassung (ELSTER)",desc:"Fragebogen zur steuerlichen Erfassung der GmbH ausfüllen.",zeit:"45 min",link:"https://www.elster.de"},
    {id:"gewerbe_gmbh_7",title:"Geschäftsführervertrag erstellen",desc:"Anstellungsvertrag für den/die Geschäftsführer aufsetzen.",zeit:"1-2 h"},
    {id:"gewerbe_gmbh_8",title:"Geschäftskonto eröffnen",desc:"Firmenkonto bei einer Bank eröffnen.",zeit:"30 min"},
    {id:"gewerbe_gmbh_9",title:"Transparenzregister-Eintragung",desc:"Wirtschaftlich Berechtigte im Transparenzregister eintragen.",zeit:"20 min",link:"https://www.transparenzregister.de"},
    {id:"gewerbe_gmbh_10",title:"Steuerberater beauftragen",desc:"Steuerberater für laufende Buchhaltung und Jahresabschluss finden.",zeit:"1 h"},
    {id:"gewerbe_gmbh_11",title:"Gesellschafterliste erstellen",desc:"Notariell beglaubigte Gesellschafterliste beim HR einreichen.",zeit:"30 min"},
    {id:"gewerbe_gmbh_12",title:"D&O-Versicherung prüfen",desc:"Geschäftsführer-Haftpflichtversicherung prüfen und ggf. abschließen.",zeit:"30 min"}
  ]}
};

export const QUIZ_QUESTIONS = [
  { id: 1, text: "Wie viele Gründer seid ihr?", type: "single", options: [{ label: "Allein", value: "solo" },{ label: "2 Personen", value: "zwei" },{ label: "3+ Personen", value: "mehr" }]},
  { id: 2, text: "Wie wichtig ist dir Haftungsbeschränkung?", type: "single", options: [{ label: "Sehr wichtig", value: "hoch" },{ label: "Ganz nett", value: "mittel" },{ label: "Nicht wichtig", value: "niedrig" }]},
  { id: 3, text: "Wie hoch ist euer geplantes Startkapital?", type: "single", options: [{ label: "< 1.000 €", value: "mini" },{ label: "1.000 – 12.500 €", value: "klein" },{ label: "> 12.500 €", value: "mittel" },{ label: "> 25.000 €", value: "gross" }]},
  { id: 4, text: "Erwarteter Jahresumsatz in 12 Monaten?", type: "single", options: [{ label: "< 22.000 € (Kleinunternehmer)", value: "klein" },{ label: "22.000 – 100.000 €", value: "mittel" },{ label: "> 100.000 €", value: "gross" }]},
  { id: 5, text: "Plant ihr externe Investoren?", type: "single", options: [{ label: "Ja, wahrscheinlich", value: "ja" },{ label: "Vielleicht später", value: "vielleicht" },{ label: "Nein", value: "nein" }]},
  { id: 6, text: "Wie hoch ist euer Haftungsrisiko?", type: "single", options: [{ label: "Niedrig (Dienstleistung)", value: "niedrig" },{ label: "Mittel", value: "mittel" },{ label: "Hoch (Produkte, Verträge)", value: "hoch" }]},
  { id: 7, text: "Seriöser Auftritt gegenüber B2B-Kunden?", type: "single", options: [{ label: "Sehr wichtig", value: "hoch" },{ label: "Mittel", value: "mittel" },{ label: "Nicht wichtig", value: "niedrig" }]},
  { id: 8, text: "Möglichst wenig Bürokratie?", type: "single", options: [{ label: "Ja, minimal", value: "minimal" },{ label: "Egal", value: "egal" },{ label: "Aufwand ist ok", value: "ok" }]}
];

export function calcRechtsformScores(answers: Record<number, string>) {
  var s = { einzelunternehmen: 0, gbr: 0, ug: 0, gmbh: 0 };
  if (answers[1]==="solo"){s.einzelunternehmen+=3;s.ug+=1}if(answers[1]==="zwei"){s.gbr+=3;s.ug+=2;s.gmbh+=1}if(answers[1]==="mehr"){s.gbr+=2;s.ug+=2;s.gmbh+=3}
  if(answers[2]==="hoch"){s.ug+=3;s.gmbh+=3}if(answers[2]==="mittel"){s.ug+=2;s.gbr+=1;s.einzelunternehmen+=1}if(answers[2]==="niedrig"){s.einzelunternehmen+=3;s.gbr+=2}
  if(answers[3]==="mini"){s.einzelunternehmen+=3;s.gbr+=2}if(answers[3]==="klein"){s.ug+=3;s.gbr+=1;s.einzelunternehmen+=1}if(answers[3]==="mittel"){s.ug+=2;s.gmbh+=2}if(answers[3]==="gross"){s.gmbh+=4;s.ug+=1}
  if(answers[4]==="klein"){s.einzelunternehmen+=3;s.gbr+=2}if(answers[4]==="mittel"){s.ug+=2;s.gbr+=1;s.einzelunternehmen+=1}if(answers[4]==="gross"){s.gmbh+=3;s.ug+=2}
  if(answers[5]==="ja"){s.gmbh+=4;s.ug+=1}if(answers[5]==="vielleicht"){s.ug+=2;s.gmbh+=2}if(answers[5]==="nein"){s.einzelunternehmen+=2;s.gbr+=2;s.ug+=1}
  if(answers[6]==="niedrig"){s.einzelunternehmen+=2;s.gbr+=2}if(answers[6]==="mittel"){s.ug+=2;s.gbr+=1}if(answers[6]==="hoch"){s.ug+=3;s.gmbh+=3}
  if(answers[7]==="hoch"){s.gmbh+=3;s.ug+=2}if(answers[7]==="mittel"){s.ug+=1;s.gbr+=1}if(answers[7]==="niedrig"){s.einzelunternehmen+=2;s.gbr+=1}
  if(answers[8]==="minimal"){s.einzelunternehmen+=3;s.gbr+=2}if(answers[8]==="egal"){s.ug+=1;s.gbr+=1;s.einzelunternehmen+=1}if(answers[8]==="ok"){s.gmbh+=2;s.ug+=2}
  return s;
}

export const RECHTSFORM_INFO: Record<string, any> = {
  einzelunternehmen: { name: "Einzelunternehmen / Freiberufler", kurz: "Maximale Einfachheit, sofort startklar.", farbe: "var(--text-high)", gruende: ["Keine Mindestkapitalanforderung","Geringster bürokratischer Aufwand","Alle Gewinne gehören dir direkt"], risiken: ["Unbeschränkte persönliche Haftung","Weniger seriöser Auftritt","Schwieriger Investoren einzubinden"], naechsteSchritte: ["Gewerbeanmeldung (ca. 20–60 €)","Steuerliche Erfassung (ELSTER)","Geschäftskonto eröffnen","Kleinunternehmerregelung prüfen"], alternativeKey: "gbr" },
  gbr: { name: "GbR (Gesellschaft bürgerlichen Rechts)", kurz: "Einfache Partnerschaft für 2+ Gründer.", farbe: "rgba(59,130,246,0.8)", gruende: ["Kein Mindestkapital","Flexibler Gesellschaftsvertrag","Geeignet für erste Projekte"], risiken: ["Gesamtschuldnerische Haftung","Bei Streit kompliziert","Weniger geeignet für Investoren"], naechsteSchritte: ["Gesellschaftsvertrag aufsetzen","Gewerbeanmeldung für alle","Geschäftskonto eröffnen","Steuerliche Erfassung"], alternativeKey: "ug" },
  ug: { name: "UG (haftungsbeschränkt)", kurz: "Die kleine GmbH – Haftungsschutz ab 1 €.", farbe: "var(--text-high)", gruende: ["Haftungsbeschränkung ab 1 €","Professioneller Auftritt","Günstige Alternative zur GmbH"], risiken: ["Notarkosten ca. 500–1.000 €","Pflicht zur Rücklagenbildung","Weniger Ansehen als GmbH"], naechsteSchritte: ["Gesellschaftsvertrag notariell beurkunden","Stammkapital einzahlen","Handelsregistereintrag","Gewerbeanmeldung + Steuer"], alternativeKey: "gmbh" },
  gmbh: { name: "GmbH", kurz: "Die Königsklasse – seriös, investorenfreundlich.", farbe: "rgba(245,158,11,0.8)", gruende: ["Maximale Haftungsbeschränkung","Beste Voraussetzungen für VCs","Professionelle Governance"], risiken: ["Mindestkapital 25.000 €","Höchster bürokratischer Aufwand","Höhere laufende Kosten"], naechsteSchritte: ["Gesellschaftsvertrag beim Notar","25.000 € Stammkapital","Handelsregistereintrag","Geschäftsführervertrag","Steuerberater beauftragen"], alternativeKey: "ug" }
};

export const DOC_CATEGORIES: Record<string, any> = {
  pitch: { id: "pitch", name: "Pitch & Investor", icon: "🚀" },
  planung: { id: "planung", name: "Planung", icon: "📊" },
  markt: { id: "markt", name: "Markt & Validierung", icon: "📈" },
  recht: { id: "recht", name: "Recht & Gründung", icon: "🛡" },
  foerderung: { id: "foerderung", name: "Förderung", icon: "🏆" }
};

export const DOCUMENT_TYPES: any[] = [
  { id:"pitch-deck",title:"Pitch Deck",category:"pitch",description:"Präsentation für Investoren",rules:["investorsPlanned"],priority:10 },
  { id:"one-pager",title:"One-Pager",category:"pitch",description:"Kompakte Übersicht",rules:["investorsPlanned"],priority:8 },
  { id:"businessplan",title:"Businessplan",category:"planung",description:"Vollständiger Geschäftsplan",rules:["phase:validiert","phase:mvp","fundingWanted"],priority:9 },
  { id:"finanzplan",title:"Finanzplan",category:"planung",description:"Umsatz- & Kostenplanung",rules:["fundingWanted","phase:mvp"],priority:9 },
  { id:"konkurrenz",title:"Konkurrenzanalyse",category:"markt",description:"Wettbewerbs-Analyse",rules:["phase:validiert","phase:mvp"],priority:7 },
  { id:"zielgruppe",title:"Zielgruppenanalyse",category:"markt",description:"Customer Personas",rules:["phase:idee","phase:validiert"],priority:6 },
  { id:"gewerbe",title:"Gewerbeanmeldung",category:"recht",description:"Nachweis der Anmeldung",rules:["phase:gegruendet","phase:wachstum"],priority:8 },
  { id:"gesellschaft",title:"Gesellschaftsvertrag",category:"recht",description:"Gründungsvertrag",rules:["teamSize:2+"],priority:8 },
  { id:"impressum",title:"Impressum",category:"recht",description:"Für Website/Shop",rules:["phase:mvp","phase:gegruendet"],priority:5 },
  { id:"datenschutz",title:"Datenschutzerklärung",category:"recht",description:"DSGVO-konform",rules:["phase:mvp","phase:gegruendet"],priority:5 },
  { id:"foerder-check",title:"Förder-Checkliste",category:"foerderung",description:"Passende Programme",rules:["fundingWanted"],priority:6 },
  { id:"antrag",title:"Antragsunterlagen",category:"foerderung",description:"Vollständige Bewerbung",rules:["fundingWanted"],priority:7 }
];

export function getSuggestedDocTypes(userData: any) {
  var phase = userData?.phase || "idee";
  var teamSize = userData?.teamgroesse || 1;
  var investorsPlanned = userData?.investoren || false;
  var fundingWanted = userData?.foerderungen !== false;
  return DOCUMENT_TYPES.map(function(dt: any) {
    var score = dt.priority;
    dt.rules.forEach(function(rule: string) {
      if (rule === "investorsPlanned" && investorsPlanned) score += 5;
      if (rule === "fundingWanted" && fundingWanted) score += 5;
      if (rule === "phase:" + phase) score += 4;
      if (rule === "teamSize:2+" && teamSize >= 2) score += 4;
    });
    return Object.assign({}, dt, { score: score, status: score >= 10 ? "empfohlen" : score >= 6 ? "wichtig" : "optional" });
  }).sort(function(a: any, b: any) { return b.score - a.score; });
}

export const BP_AUDIENCES = [
  {val:"eigene",label:"Eigene Planung",desc:"Für mich selbst zur Orientierung & internen Strategie"},
  {val:"bank",label:"Bank / Kreditantrag",desc:"Bankfertig — mit Fokus auf Risiko, Rückzahlbarkeit, Sicherheiten"},
  {val:"investor",label:"Investor / VC",desc:"Für Funding-Pitch — Skalierung, Marktgröße, Exit-Perspektive"},
  {val:"foerder",label:"Fördermittelantrag",desc:"Förderkonform (KfW, EXIST, Gründungszuschuss etc.)"},
  {val:"partner",label:"Geschäftspartner / Mitgründer",desc:"Für strategische Partner, Co-Founder oder Beirat"}
];

export const BP_QUESTIONS: any[] = [
  {id:"zielgruppe_plan",label:"Für wen ist dieser Businessplan?",type:"audience_select"},
  {id:"firma",label:"Wie heißt dein Unternehmen?",type:"text",placeholder:"z.B. TechVision GmbH"},
  {id:"idee",label:"Was ist deine Geschäftsidee? Beschreibe in 2-3 Sätzen was du anbietest.",type:"textarea",placeholder:"Wir entwickeln eine App die..."},
  {id:"problem",label:"Welches Problem löst du für deine Kunden?",type:"textarea",placeholder:"Viele Gründer haben das Problem dass..."},
  {id:"zielgruppe",label:"Wer ist deine Zielgruppe? Beschreibe deinen idealen Kunden.",type:"textarea",placeholder:"Unsere Zielgruppe sind..."},
  {id:"wettbewerb",label:"Wer sind deine Hauptwettbewerber und was machst du anders/besser?",type:"textarea",placeholder:"Die wichtigsten Wettbewerber sind..."},
  {id:"geschaeftsmodell",label:"Wie verdienst du Geld? Beschreibe dein Geschäftsmodell und deine Preise.",type:"textarea",placeholder:"Wir verdienen Geld durch..."},
  {id:"marketing",label:"Welche Marketingkanäle planst du zu nutzen?",type:"multi",options:["Social Media","Google Ads","Content Marketing","Kaltakquise","Messen/Events","Empfehlungen","PR","Andere"]},
  {id:"meilensteine",label:"Was sind deine wichtigsten Meilensteine für die nächsten 12 Monate?",type:"textarea",placeholder:"Monat 1-3: MVP fertigstellen..."},
  {id:"kosten",label:"Wie hoch sind deine geschätzten monatlichen Kosten?",type:"costs"},
  {id:"umsatz",label:"Wie hoch ist dein erwarteter monatlicher Umsatz?",type:"revenue"}
];

export const FP_QUESTIONS: any[] = [
  {id:"step1",title:"Geschäftsmodell & Einnahmen",fields:[
    {id:"preismodell",label:"Preismodell",type:"select",options:["Abo / Subscription","Einmalkauf","Provision / Vermittlung","Freemium","Stundensatz / Tagessatz","Lizenzgebühr","Werbung","Andere"],placeholder:"Wie verdienst du Geld?"},
    {id:"preis_pro_einheit",label:"Preis pro Einheit / Monat",unit:"€",type:"number_slider",min:0,max:10000,step:1,def:49},
    {id:"kunden_12_monate",label:"Erwartete Kunden nach 12 Monaten",unit:"",type:"number_slider",min:0,max:5000,step:1,def:50},
    {id:"umsatz_6",label:"Geschätzter Umsatz nach 6 Monaten",unit:"€ / Monat",type:"number_slider",min:0,max:100000,step:100,def:2000},
    {id:"umsatz_12",label:"Geschätzter Umsatz nach 12 Monaten",unit:"€ / Monat",type:"number_slider",min:0,max:200000,step:100,def:8000}
  ]},
  {id:"step2",title:"Monatliche Kosten",fields:[
    {id:"kosten_personal",label:"Personal inkl. Gründergehalt",unit:"€ / Monat",type:"number_slider",min:0,max:30000,step:100,def:2500},
    {id:"kosten_miete",label:"Miete / Büro / Coworking",unit:"€ / Monat",type:"number_slider",min:0,max:10000,step:50,def:300},
    {id:"kosten_marketing",label:"Marketing & Vertrieb",unit:"€ / Monat",type:"number_slider",min:0,max:15000,step:50,def:500},
    {id:"kosten_software",label:"Software & Tools",unit:"€ / Monat",type:"number_slider",min:0,max:5000,step:10,def:150},
    {id:"kosten_sonstiges",label:"Sonstiges",unit:"€ / Monat",type:"number_slider",min:0,max:10000,step:50,def:200}
  ]},
  {id:"step3",title:"Finanzierung & Kapital",fields:[
    {id:"eigenkapital",label:"Eigenkapital vorhanden",unit:"€",type:"number_slider",min:0,max:500000,step:500,def:10000},
    {id:"kapitalbedarf",label:"Gesamter Kapitalbedarf",unit:"€",type:"number_slider",min:0,max:1000000,step:1000,def:50000},
    {id:"rechtsform_fp",label:"Geplante Rechtsform",type:"select",options:["Einzelunternehmen","GbR","UG (haftungsbeschränkt)","GmbH","Freiberufler","Noch nicht entschieden"],placeholder:"Rechtsform wählen..."},
    {id:"besonderheiten",label:"Besonderheiten / Anmerkungen (optional)",type:"textarea",placeholder:"z.B. saisonales Geschäft, geplante Investitionsrunden, besondere Kostenstrukturen, vorhandene Verträge..."}
  ]}
];

export const CHAT_SUGGESTIONS = [
  { icon: "🚀", label: "Welche Rechtsform passt zu mir?", prompt: "Ich möchte gründen und bin unsicher, welche Rechtsform die richtige für mich ist. Kannst du mir die Unterschiede zwischen Einzelunternehmen, GbR, UG und GmbH erklären und mir helfen, die beste Wahl zu treffen?" },
  { icon: "💰", label: "Förderprogramme finden", prompt: "Welche Förderprogramme gibt es in Deutschland für Gründer? Ich suche nach Zuschüssen, günstigen Krediten oder Stipendien für mein Startup." },
  { icon: "📋", label: "Gewerbeanmeldung Schritt für Schritt", prompt: "Erkläre mir Schritt für Schritt, wie ich in Deutschland ein Gewerbe anmelde. Was brauche ich, was kostet es, und was muss ich beachten?" },
  { icon: "📊", label: "Businessplan erstellen", prompt: "Was gehört alles in einen guten Businessplan? Gib mir eine Struktur und erkläre die wichtigsten Abschnitte, die Banken und Investoren sehen wollen." },
  { icon: "🧾", label: "Steuern als Gründer", prompt: "Was muss ich als Gründer in Deutschland über Steuern wissen? Umsatzsteuer, Gewerbesteuer, Einkommensteuer – erkläre mir die Basics und ob die Kleinunternehmerregelung für mich Sinn macht." },
  { icon: "🎯", label: "Bewerte meine Geschäftsidee", prompt: "Ich möchte meine Geschäftsidee bewerten lassen. Welche Kriterien sind wichtig, um zu beurteilen, ob eine Idee tragfähig ist? Stell mir die richtigen Fragen, um meine Idee einzuschätzen." },
  { icon: "👥", label: "Erste Mitarbeiter einstellen", prompt: "Ich möchte meine ersten Mitarbeiter einstellen. Was muss ich als Gründer in Deutschland beachten? Arbeitsverträge, Sozialabgaben, Minijobs – erkläre mir die wichtigsten Schritte." },
  { icon: "📈", label: "Marketing mit kleinem Budget", prompt: "Wie kann ich als Startup mit wenig Budget effektiv Marketing machen? Gib mir konkrete, kostenlose oder günstige Marketing-Strategien für den Anfang." }
];
