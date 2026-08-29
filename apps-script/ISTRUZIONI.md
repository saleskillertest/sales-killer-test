# Sales Killer Test — come è montato

```
venditore apre il link   ->  compila 20 domande  ->  la pagina invia i dati
GitHub Pages                                          al web app Apps Script
                                                              |
                                                              v
                                              riga sul foglio + notifica email
```

| Pezzo | Dove |
|---|---|
| Questionario | https://alessandrobrozzi1-ux.github.io/sales-killer-test/ |
| Dashboard | foglio `TEST VENDITORI - ROCCO`, schede **Riepilogo** e **Risultati** |
| Codice raccolta dati | progetto Apps Script `Sales Killer Test`, agganciato al foglio |
| Repo | https://github.com/alessandrobrozzi1-ux/sales-killer-test |

## Il foglio

**Riepilogo** — quanti test, quanti venditori per profilo, quota percentuale e
media del mix sulla squadra. Si aggiorna da solo con delle formule.

**Risultati** — una riga per venditore: data, nome, profilo, le quattro
percentuali (colorate a barra, si legge il mix a colpo d'occhio), le risposte e
il report completo. Intestazione bloccata, filtri attivi, colonne dimensionate.

I testi lunghi vengono scritti **su una riga sola**: gli a capo diventano `·`.
Senza questo accorgimento ogni riga sarebbe alta quaranta righe e il foglio
illeggibile. Per leggere un report per intero: clicca la cella e guarda la barra
della formula, oppure allarga la riga.

## Le funzioni dello script

Si eseguono dall'editor (*Estensioni → Apps Script*), scegliendole dal menu
accanto a **Esegui**.

- `reimpostaFoglio` — **cancella tutti i dati** e ricostruisce foglio e
  riepilogo da zero. È la prima del file, quindi è quella preselezionata.
- `sistemaAspetto` — riapplica la formattazione **senza toccare i dati**.
- `provaInvio` — scrive una riga finta, per provare il giro.

## Modifiche

**Al questionario:** modifica `index.html` nel repo, committa e pusha. GitHub
Pages ripubblica da solo in un minuto. Apps Script non si tocca.

**Alla raccolta dati:** incolla il nuovo `apps-script/Codice.gs` nell'editor,
salva, poi **Distribuisci → Gestisci distribuzioni → matita → Versione: Nuova
versione**. Solo così l'URL resta lo stesso: con *Nuova distribuzione*
cambierebbe e andrebbe riportato nell'`ENDPOINT` di `index.html`.

## Le email

Lo script **non** manda email, ed è una scelta obbligata: il permesso
`script.send_mail` è classificato sensibile da Google e su un'app non verificata
fa scattare il blocco dell'autorizzazione ("This app is blocked"). Provato con
permessi larghi, ristretti e dichiarati nel manifest: blocca comunque.

Al suo posto ci sono le notifiche native del foglio, che non chiedono permessi:
*Strumenti → Impostazioni di notifica → "Qualsiasi modifica" → "Email, subito"*.
Sono già attive su `alessandrobrozzi1@gmail.com`. **Rocco deve impostare la
propria**, aprendo il foglio dal suo account e ripetendo quei passaggi.

In più, i pulsanti del test (WhatsApp, Gmail, app di posta, PDF, copia) mandano
il report integrale a Rocco, con un'azione del venditore.

## Sicurezza

Il foglio è condiviso *chiunque con il link → **Visualizzatore***: chi ha il link
legge ma non modifica. Lo script continua a scrivere perché gira con i permessi
del proprietario, non del link.

L'URL del web app è visibile nel codice della pagina, come in qualunque sito
statico: in teoria qualcuno potrebbe inviare righe finte al foglio. È il
compromesso di questa architettura, che non ha autenticazione.
