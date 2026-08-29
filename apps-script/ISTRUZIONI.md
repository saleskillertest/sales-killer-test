# Come è montato il Sales Killer Test

```
venditore apre il link  ->  compila 20 domande  ->  la pagina POSTa al web app
GitHub Pages                                        Apps Script
                                                        |
                                                        v
                                              riga sul foglio Google
```

- **Questionario:** https://alessandrobrozzi1-ux.github.io/sales-killer-test/
- **Dashboard:** foglio `TEST VENDITORI - ROCCO`
- **Endpoint:** progetto Apps Script `Sales Killer Test`, agganciato al foglio,
  distribuito come app web pubblica.

## Modificare il questionario

Il file è `index.html` alla radice del repo. È una pagina statica: si modifica,
si committa, si pusha, e GitHub Pages ripubblica da solo in un minuto.
Non serve toccare Apps Script.

## Modificare la raccolta dati

`apps-script/Codice.gs` è la copia del codice che gira su Google. Se lo cambi:

1. incolla il nuovo codice nell'editor Apps Script del foglio
   (*Estensioni → Apps Script*);
2. **Distribuisci → Gestisci distribuzioni → matita → Versione: Nuova versione**.
   Così l'URL resta lo stesso. Con *Nuova distribuzione* cambierebbe, e andrebbe
   riportato in `index.html` alla riga dell'`ENDPOINT`.

## Le email

Lo script **non** manda email, ed è una scelta obbligata: il permesso
`script.send_mail` è classificato sensibile da Google e su un'app non verificata
fa scattare il blocco dell'autorizzazione ("This app is blocked"). Provato, non
aggirabile su questo account.

Le notifiche si impostano sul foglio, e ognuno imposta le proprie:
**Strumenti → Impostazioni di notifica → "Qualsiasi modifica" → "Email, subito"**.
Rocco deve farlo dal suo account, aprendo il foglio.

Il report completo resta comunque nella riga del foglio, e i pulsanti manuali del
test (WhatsApp, Gmail, PDF, copia) mandano il testo integrale a Rocco.

## Cose da sapere

- Il foglio è condiviso **"chiunque con il link → editor"**: chiunque abbia il
  link può cancellare i risultati. Conviene metterlo su *Visualizzatore*; lo
  script continua a scrivere perché scrive dall'account proprietario.
- L'URL dell'endpoint è visibile nel codice della pagina, come in qualunque sito
  statico. In teoria qualcuno potrebbe inviare righe finte al foglio: è il
  compromesso di questa architettura, senza autenticazione.
- Il perché di questo giro: HtmlService, cioè far servire la pagina ad Apps
  Script, non funzionava (contenuto consegnato ma script mai eseguito
  nell'iframe). Ospitare la pagina fuori risolve e costa zero.
