# Sales Killer Test

Questionario comportamentale in 20 scenari di vendita. Restituisce il profilo
dominante (Rosso / Giallo / Verde / Blu), il mix percentuale, la guida per il
sales manager e il piano d'azione.

## Come funziona

`index.html` è una pagina statica autosufficiente: nessuna dipendenza, nessun
build. A test completato chiama in POST lo script Google configurato in
`ENDPOINT` (in alto nel file), che scrive una riga sul foglio dei risultati.

- Foglio risultati: `TEST VENDITORI - ROCCO`
- Endpoint: web app Apps Script, distribuzione pubblica, esegue come il
  proprietario del foglio.
- Se `ENDPOINT` è vuoto l'invio automatico si disattiva e restano i pulsanti
  manuali (WhatsApp, Gmail, PDF, copia negli appunti).

## File

| File | A cosa serve |
|---|---|
|  | il questionario: pagina statica da pubblicare |
|  | web app che riceve i risultati e scrive sul foglio |
|  | manifest del progetto (permessi dichiarati) |
|  | setup del foglio e della distribuzione |
