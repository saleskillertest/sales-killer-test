// Sales Killer Test — script agganciato al foglio (Estensioni > Apps Script).
//
// Riceve i risultati dal questionario ospitato su GitHub Pages e li scrive
// sul foglio, gia' formattati e leggibili.
//
// NIENTE invio email da qui: il permesso 'script.send_mail' e' classificato
// sensibile da Google e su un'app non verificata fa scattare "This app is
// blocked". Le notifiche si impostano sul foglio, da Strumenti >
// Impostazioni di notifica, e ognuno imposta le proprie.

var COLONNE   = ["Data", "Nome", "Profilo", "Rosso", "Giallo", "Verde", "Blu", "Milione", "Premio", "Risposte", "Report"];
var LARGHEZZE = [105, 135, 140, 50, 50, 50, 50, 140, 130, 110, 110];
var RIGHE_PREFORMATTATE = 500;
var NOME_DATI = "Risultati";

var TINTE = {
  ROSSO:  { sfondo: "#FBE3E1", testo: "#8E241D" },
  GIALLO: { sfondo: "#FBEFD5", testo: "#8A5D06" },
  VERDE:  { sfondo: "#DFF0E6", testo: "#1E5C38" },
  BLU:    { sfondo: "#DEE7FA", testo: "#20408E" }
};

// ---------------------------------------------------------------- manutenzione

// Prima funzione del file: e' quella preselezionata nel menu Esegui.
// Riformatta il foglio senza toccare i dati.
function sistemaAspetto() {
  var ss = SpreadsheetApp.getActive();
  var sh = foglioDati();
  intestazione(sh);
  formattaRighe(sh, 2, Math.max(RIGHE_PREFORMATTATE, sh.getLastRow()));
  regoleColore(sh);
  costruisciRiepilogo(ss, sh.getName());
}

// ATTENZIONE: cancella tutti i dati e ricostruisce foglio e riepilogo.
function reimpostaFoglio() {
  var ss = SpreadsheetApp.getActive();
  var sh = foglioDati();
  sh.clear();
  preparaFoglio(sh);
  costruisciRiepilogo(ss, sh.getName());
}

// ---------------------------------------------------------------- ricezione

// Chiamata dalla pagina del questionario.
function doPost(e) {
  registra(e.parameter);
  return ContentService.createTextOutput("ok");
}

// Chiamata da google.script.run se un giorno la pagina tornasse dentro Apps Script.
function salvaRisultato(p) {
  return registra(p);
}

function foglioDati() {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(NOME_DATI);
  if (!sh) {
    // primo foglio che non sia il riepilogo
    var tutti = ss.getSheets();
    for (var i = 0; i < tutti.length; i++) {
      if (tutti[i].getName() !== "Riepilogo") { sh = tutti[i]; break; }
    }
    sh.setName(NOME_DATI);
  }
  return sh;
}

function registra(p) {
  var sh = foglioDati();
  if (sh.getLastRow() === 0) preparaFoglio(sh);

  var q = percentuali(p.mix || "");
  var neutre = String(p.extra || "").split(" ||| ");
  neutre[0] = neutre[0] || "";
  neutre[1] = neutre[1] || "";
  sh.appendRow([
    new Date(),
    p.nome || "",
    p.profilo || "",
    q.ROSSO, q.GIALLO, q.VERDE, q.BLU,
    neutre[0], neutre[1],
    unaRiga(p.risposte),
    unaRiga(p.report)
  ]);

  var riga = sh.getLastRow();
  sh.setRowHeight(riga, 26);
  // se il foglio supera le righe preformattate, formatta la nuova
  if (riga > RIGHE_PREFORMATTATE + 1) formattaRighe(sh, riga, 1);

  return "ok";
}

// I testi lunghi arrivano con a capo dentro: una cella multiriga fa esplodere
// l'altezza della riga e rende il foglio illeggibile. Li appiattiamo.
function unaRiga(t) {
  return String(t || "").split("\n").join("  ·  ").replace("  ·    ·  ", "  ·  ").trim();
}

// "VERDE 30% | ROSSO 25% | BLU 25% | GIALLO 20%" -> frazioni per colonna
function percentuali(mix) {
  var out = { ROSSO: 0, GIALLO: 0, VERDE: 0, BLU: 0 };
  String(mix).split("|").forEach(function (pezzo) {
    var m = pezzo.match(/(ROSSO|GIALLO|VERDE|BLU)\s*(\d+)/i);
    if (m) out[m[1].toUpperCase()] = Number(m[2]) / 100;
  });
  return out;
}

// ---------------------------------------------------------------- aspetto

function preparaFoglio(sh) {
  sh.setName(NOME_DATI);
  sh.appendRow(COLONNE);
  intestazione(sh);
  formattaRighe(sh, 2, RIGHE_PREFORMATTATE);
  regoleColore(sh);
}

function intestazione(sh) {
  sh.getRange(1, 1, 1, COLONNE.length)
    .setValues([COLONNE])
    .setBackground("#12140F")
    .setFontColor("#F4F5F0")
    .setFontWeight("bold")
    .setFontSize(11)
    .setVerticalAlignment("middle");

  sh.setRowHeight(1, 38);
  sh.setFrozenRows(1);
  sh.setFrozenColumns(0);

  for (var i = 0; i < LARGHEZZE.length; i++) sh.setColumnWidth(i + 1, LARGHEZZE[i]);

  // Prima riapro tutto: se in passato il foglio aveva meno colonne, quelle
  // in mezzo erano rimaste nascoste e le risposte sparivano dalla vista.
  sh.showColumns(1, sh.getMaxColumns());
  var extra = sh.getMaxColumns() - COLONNE.length;
  if (extra > 0) sh.hideColumns(COLONNE.length + 1, extra);

  var filtro = sh.getFilter();
  if (filtro) filtro.remove();
  sh.getRange(1, 1, sh.getMaxRows(), COLONNE.length).createFilter();
}

function formattaRighe(sh, prima, quante) {
  if (quante < 1) return;
  var r = sh.getRange(prima, 1, quante, COLONNE.length);
  r.setVerticalAlignment("middle").setFontSize(10);
  // il testo lungo resta su una riga sola: e' questo che rende il foglio leggibile
  r.setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);

  sh.getRange(prima, 1, quante, 1).setNumberFormat("dd/MM/yyyy  HH:mm");
  sh.getRange(prima, 4, quante, 4).setNumberFormat("0%").setHorizontalAlignment("center");
  sh.getRange(prima, 8, quante, 2).setFontSize(9);
  sh.getRange(prima, 3, quante, 1).setFontWeight("bold");
  sh.getRange(prima, 2, quante, 1).setFontWeight("bold");

  for (var i = 0; i < quante; i++) sh.setRowHeight(prima + i, 26);
}

function regoleColore(sh) {
  var righe = Math.max(RIGHE_PREFORMATTATE, sh.getLastRow());
  var profilo = sh.getRange(2, 3, righe, 1);
  var regole = [];

  Object.keys(TINTE).forEach(function (nome) {
    regole.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextContains(nome)
        .setBackground(TINTE[nome].sfondo)
        .setFontColor(TINTE[nome].testo)
        .setRanges([profilo])
        .build()
    );
  });

  // barra sulle percentuali: si legge il mix a colpo d'occhio
  var colori = ["#E0453C", "#E9A227", "#3FA46A", "#4478E0"];
  for (var c = 0; c < 4; c++) {
    regole.push(
      SpreadsheetApp.newConditionalFormatRule()
        .setGradientMaxpointWithValue(colori[c], SpreadsheetApp.InterpolationType.NUMBER, "0.5")
        .setGradientMinpointWithValue("#FFFFFF", SpreadsheetApp.InterpolationType.NUMBER, "0")
        .setRanges([sh.getRange(2, 4 + c, righe, 1)])
        .build()
    );
  }

  sh.setConditionalFormatRules(regole);
}

// ---------------------------------------------------------------- riepilogo

function costruisciRiepilogo(ss, nomeDati) {
  var sh = ss.getSheetByName("Riepilogo");
  if (!sh) sh = ss.insertSheet("Riepilogo", 0);
  sh.clear();

  var d = "'" + nomeDati + "'";

  sh.getRange("A1").setValue("SALES KILLER TEST — RIEPILOGO SQUADRA")
    .setFontSize(14).setFontWeight("bold").setFontColor("#12140F");
  sh.getRange("A2").setFormula('="Test completati: "&COUNTA(' + d + '!B2:B)')
    .setFontColor("#6B7280");

  sh.getRange("A4:C4").setValues([["Profilo", "Venditori", "Quota"]])
    .setBackground("#12140F").setFontColor("#F4F5F0").setFontWeight("bold");

  var nomi = ["ROSSO", "GIALLO", "VERDE", "BLU"];
  var etichette = ["Rosso — Dominante", "Giallo — Espressivo", "Verde — Cooperativo", "Blu — Analitico"];
  for (var i = 0; i < nomi.length; i++) {
    var r = 5 + i;
    sh.getRange(r, 1).setValue(etichette[i])
      .setBackground(TINTE[nomi[i]].sfondo).setFontColor(TINTE[nomi[i]].testo).setFontWeight("bold");
    sh.getRange(r, 2).setFormula('=COUNTIF(' + d + '!C2:C,"*' + nomi[i] + '*")')
      .setHorizontalAlignment("center");
    sh.getRange(r, 3).setFormula('=IFERROR(B' + r + '/COUNTA(' + d + '!B2:B),0)')
      .setNumberFormat("0%").setHorizontalAlignment("center");
  }

  sh.getRange("A10").setValue("Media del mix sulla squadra")
    .setFontWeight("bold").setFontColor("#12140F");
  sh.getRange("A11:B11").setValues([["Colore", "Media"]])
    .setBackground("#12140F").setFontColor("#F4F5F0").setFontWeight("bold");
  var col = ["D", "E", "F", "G"];
  for (var j = 0; j < 4; j++) {
    var rr = 12 + j;
    sh.getRange(rr, 1).setValue(etichette[j])
      .setBackground(TINTE[nomi[j]].sfondo).setFontColor(TINTE[nomi[j]].testo).setFontWeight("bold");
    sh.getRange(rr, 2).setFormula('=IFERROR(AVERAGE(' + d + '!' + col[j] + '2:' + col[j] + '),0)')
      .setNumberFormat("0%").setHorizontalAlignment("center");
  }

  sh.setColumnWidth(1, 230);
  sh.setColumnWidth(2, 110);
  sh.setColumnWidth(3, 110);
  sh.setHiddenGridlines(true);
}

// ---------------------------------------------------------------- utilita'

// Scrive una riga finta, per provare il giro senza compilare il test.
function provaInvio() {
  registra({
    nome: "PROVA", profilo: "ROSSO (Dominante)",
    mix: "ROSSO 50% | BLU 30% | VERDE 10% | GIALLO 10%",
    risposte: "1. domanda -> [ROSSO] risposta", report: "Riga di prova."
  });
}
