// Sales Killer Test — script AGGANCIATO al foglio (Estensioni > Apps Script).
//
// NIENTE invio email da qui dentro, ed e' deliberato.
// L'invio email da Apps Script richiede il permesso 'script.send_mail', che Google
// classifica come sensibile: su un'app non verificata fa scattare "This app is blocked".
// Senza quel servizio l'unico permesso richiesto e' "solo il foglio in cui gira lo script",
// che non e' sensibile e non viene bloccato.
//
// Le notifiche email si impostano sul foglio: Strumenti > Impostazioni di notifica
// > "Qualsiasi modifica" > "Email, subito". Le imposta ogni persona per se'.

// Serve il questionario: l'URL /exec E' il link da mandare ai venditori.
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Sales Killer Test')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// Scrive la riga sul foglio.
function registra(p) {
  var sh = SpreadsheetApp.getActive().getSheets()[0];

  if (sh.getLastRow() === 0) {
    sh.appendRow(["Data", "Nome", "Profilo", "Mix", "Risposte", "Report"]);
    sh.getRange(1, 1, 1, 6).setFontWeight("bold");
    sh.setFrozenRows(1);
  }

  sh.appendRow([
    new Date(),
    p.nome || "",
    p.profilo || "",
    p.mix || "",
    p.risposte || "",
    p.report || ""
  ]);

  return "ok";
}

// Chiamata dalla pagina servita da doGet (google.script.run): risponde con l'esito reale.
function salvaRisultato(p) {
  return registra(p);
}

// Compatibilita' con il file HTML aperto fuori da Apps Script (const ENDPOINT).
function doPost(e) {
  registra(e.parameter);
  return ContentService.createTextOutput("ok");
}

// Prova manuale: seleziona questa funzione nell'editor e premi Esegui.
function provaInvio() {
  registra({
    nome: "PROVA", profilo: "ROSSO (Dominante)", mix: "ROSSO 50% | BLU 30%",
    risposte: "1. domanda -> [ROSSO] risposta", report: "Riga di prova."
  });
}
