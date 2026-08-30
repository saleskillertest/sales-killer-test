# Sales Killer Test

**In linea:** https://saleskillertest.github.io/sales-killer-test/

Questionario comportamentale in 22 scenari di vendita, di cui 20 a punteggio. Restituisce il profilo
dominante (Rosso / Giallo / Verde / Blu), il mix percentuale, la guida per il
sales manager e il piano d'azione.

## Come funziona

`index.html` è una pagina statica autosufficiente: nessuna dipendenza, nessun
build, nessun framework. A test completato invia i risultati in POST al web app
Apps Script configurato in `ENDPOINT` (riga 159), che scrive una riga sul foglio.

- Foglio risultati: **TEST VENDITORI - ROCCO**
- Endpoint: web app Apps Script, distribuzione pubblica, esegue come il
  proprietario del foglio. Già autorizzata e attiva.
- Se `ENDPOINT` è vuoto l'invio automatico si disattiva e restano i pulsanti
  manuali (WhatsApp, Gmail, PDF, copia negli appunti).

## Struttura

| File | A cosa serve |
|---|---|
| `index.html` | il questionario: pagina statica da pubblicare |
| `apps-script/Codice.gs` | web app che riceve i risultati e scrive sul foglio |
| `apps-script/appsscript.json` | manifest del progetto, permessi dichiarati |
| `apps-script/ISTRUZIONI.md` | setup del foglio e della distribuzione |

## Le due domande neutre

La 11 (il milione) e la 22 (il premio) servono al sales manager per tarare la
mentalita' del venditore, non il suo stile comunicativo. Sono marcate `n:true`
e le loro opzioni hanno codice `"-"`: il conteggio dei colori le salta e le
percentuali restano calcolate su 20 domande. Le risposte finiscono in due
colonne dedicate del foglio, **Milione** e **Premio**.

## Note

Le email automatiche non partono dallo script: il permesso `script.send_mail`
è classificato come sensibile da Google e su un'app non verificata fa scattare
il blocco dell'autorizzazione. Le notifiche si impostano sul foglio, da
*Strumenti → Impostazioni di notifica*, e ognuno imposta le proprie.
