/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

export function generateIntelligentRoadmap(onboardingData: any) {
  if (!onboardingData || Object.keys(onboardingData).length === 0) return [];
  var tasks: any[] = [];
  var taskId = 0;
  var add = function(week: number, category: string, title: string, description: string, priority: string, effort: string, link: string, autoCheck?: (d: any) => boolean) {
    var shouldAutoCheck = autoCheck ? autoCheck(onboardingData) : false;
    tasks.push({ id: "task_" + (taskId++), week: week, category: category, title: title,
      description: description, priority: priority, effort: effort, link: link, autoChecked: shouldAutoCheck });
  };
  add(1, "Unterlagen", "Businessplan anlegen", "Erstelle oder lade deinen vollständigen Businessplan hoch", "hoch", "1-2 h", "/dokumente", function(d) { return d.businessplan === true; });
  add(1, "Unterlagen", "Finanzplan erstellen", "Umsatz-, Kosten- und Liquiditätsplanung für 3 Jahre", "hoch", "1-2 h", "/dokumente", function(d) { return d.finanzplan === true; });
  add(1, "Markt & Produkt", "Konkurrenzanalyse dokumentieren", "Wer sind deine 3-5 Hauptwettbewerber?", "mittel", "30 min", "/dokumente", function(d) { return d.konkurrenz === true; });
  add(2, "Markt & Produkt", "Preisstrategie festlegen", "Dokumentiere deine Preisstrategie und Kalkulation", "mittel", "30 min", "/dokumente", function(d) { return d.preis === true; });
  add(2, "Markt & Produkt", "90-Tage-Ziele finalisieren", "Was willst du in den nächsten 3 Monaten erreichen?", "hoch", "30 min", "/dashboard", undefined);

  var isAlreadyFounded = onboardingData.phase === "gegruendet" || onboardingData.phase === "wachstum";
  var hasChosenLegalForm = onboardingData.rechtsform === true;
  if (!hasChosenLegalForm && !isAlreadyFounded) {
    add(2, "Recht & Gründung", "Rechtsform-Quiz durchführen", "Finde die passende Rechtsform: Einzelunternehmen, GbR, UG oder GmbH", "hoch", "10 min", "/gewerbeanmeldung", undefined);
  }
  if (isAlreadyFounded || hasChosenLegalForm) {
    add(3, "Recht & Gründung", "Gründungsdokumente prüfen", "Stelle sicher dass alle Gründungsunterlagen vorliegen", "mittel", "30 min", "/dokumente", undefined);
  }
  if (onboardingData.investoren === true || isAlreadyFounded) {
    add(3, "Recht & Gründung", "Notar-Vorbereitung starten", "Gesellschafterdaten, Firmennamen und Stammkapital zusammenstellen", "hoch", "1-2 h", "/gewerbeanmeldung", undefined);
  }
  add(3, "Recht & Gründung", "Gewerbeanmeldung vorbereiten", "Checkliste für Gewerbeamt durchgehen", "hoch", "30 min", "/gewerbeanmeldung", undefined);

  if (onboardingData.foerderungen !== false) {
    add(4, "Finanzierung & Förderung", "3 passende Förderprogramme shortlisten", "EXIST, KfW, Gründungszuschuss – was passt zu dir?", "hoch", "30 min", "/foerderprogramme", undefined);
    add(5, "Finanzierung & Förderung", "Unterlagen für Förderantrag sammeln", "Businessplan, Finanzplan, Nachweise komplett?", "hoch", "1-2 h", "/dokumente", undefined);
    add(6, "Finanzierung & Förderung", "Antragsschritte prüfen", "Fristen, Voraussetzungen und Kontakte klären", "mittel", "30 min", "/foerderprogramme", undefined);
  }
  if (onboardingData.investoren === true) {
    add(4, "Finanzierung & Förderung", "Pitch Deck erstellen", "10-15 Folien für Investorengespräche", "hoch", "1-2 h", "/dokumente", undefined);
    add(5, "Finanzierung & Förderung", "One-Pager erstellen", "Kompakte Übersicht auf einer Seite", "optional", "30 min", "/dokumente", undefined);
    add(7, "Finanzierung & Förderung", "Cap Table Grundstruktur", "Wie verteilen sich die Anteile?", "optional", "30 min", "/dokumente", undefined);
  }
  if (onboardingData.teamgroesse >= 2) {
    add(4, "Recht & Gründung", "Founder Agreement klären", "Rollen, Verantwortlichkeiten und Anteile schriftlich festhalten", "mittel", "1-2 h", "/dokumente", undefined);
  }
  var phase = onboardingData.phase || "idee";
  if (phase === "idee") add(5, "Markt & Produkt", "10 Problem-Interviews planen", "Validiere deine Idee durch Gespräche mit Zielkunden", "optional", "1-2 h", "/dashboard", undefined);
  if (phase === "validiert") add(6, "Markt & Produkt", "Preisannahmen testen", "Führe Zahlungsbereitschafts-Tests durch", "mittel", "1-2 h", "/dashboard", undefined);
  if (phase === "mvp") add(7, "Markt & Produkt", "MVP Launch-Checkliste", "Was muss vor dem Launch stehen?", "mittel", "30 min", "/dashboard", undefined);
  if (isAlreadyFounded) add(5, "Recht & Gründung", "Steuerliche Erfassung vorbereiten", "ELSTER-Zugang und Fragebogen zur steuerlichen Erfassung", "mittel", "30 min", "/gewerbeanmeldung", undefined);

  add(6, "Unterlagen", "Website / Impressum vorbereiten", "Rechtskonforme Website-Pflichtangaben erstellen", "mittel", "30 min", "/dokumente", undefined);
  add(7, "Unterlagen", "Datenschutzerklärung erstellen", "DSGVO-konforme Datenschutzerklärung für Website", "mittel", "30 min", "/dokumente", undefined);
  add(8, "Recht & Gründung", "Geschäftskonto eröffnen", "Trennung Privat/Geschäftlich – Bank auswählen", "hoch", "1-2 h", "/dashboard", undefined);
  add(9, "Unterlagen", "Alle Dokumente final prüfen", "Sind Businessplan, Finanzplan, Verträge aktuell?", "mittel", "30 min", "/dokumente", undefined);
  add(10, "Finanzierung & Förderung", "Förderanträge einreichen", "Alle vorbereiteten Anträge final absenden", "hoch", "1-2 h", "/foerderprogramme", undefined);
  add(11, "Markt & Produkt", "Erste Marketing-Maßnahmen planen", "Social Media, Website, Netzwerk – wie wirst du sichtbar?", "optional", "1-2 h", "/dashboard", undefined);
  add(12, "Markt & Produkt", "90-Tage-Review durchführen", "Was hast du geschafft? Was sind die nächsten Schritte?", "mittel", "30 min", "/dashboard", undefined);

  return tasks.sort(function(a, b) { return a.week - b.week; });
}
