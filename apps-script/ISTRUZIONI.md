# Sales Killer Test — come è fatto e cosa manca

Il questionario **è servito da Google Apps Script**. Non serve comprare un sito:
il link `/exec` dello script è il link da mandare ai venditori.

```
venditore apre il link  ->  compila il test  ->  la pagina chiama salvaRisultato()
                                              ->  riga sul foglio + email
```

Vantaggi rispetto a ospitare il file altrove: nessun hosting, nessun problema di CORS,
e la pagina riceve una **conferma reale** dal server invece di sperare che sia andata.

---

## Pezzi in gioco

| Cosa | Dove |
|---|---|
| Foglio (dashboard) | `TEST VENDITORI - ROCCO` — id `1N3utAzc2qdW4EzzGp-YxPB2crxPmitaLvBCCB8Z7eaE` |
| Progetto script | `Sales Killer Test - raccolta risultati`, account `alessandrobrozzi1@gmail.com` |
| `Code.gs` | copia locale in `Codice-AppsScript.gs` |
| `Index.html` | copia locale in `SalesKillerTest-v3.html` (sul Desktop) |

Le copie locali sono la fonte di verità: se modifichi il test, **ricopia il file nel
progetto Apps Script** (file `Index.html`) e rifai una nuova versione della distribuzione.

---

## PASSO MANCANTE — autorizzare e pubblicare

1. Nell'editor Apps Script: **Distribuisci → Nuova distribuzione → App web**
   - Esegui come: **Io**
   - Chi ha accesso: **Chiunque** ← senza questo i venditori non aprono il link
2. Compare **"Autorizza accesso"**: scegli l'account, poi *Avanzate* →
   *Vai a Sales Killer Test - raccolta risultati (non sicuro)* → **Consenti**.
   Google mostra l'avviso "app non verificata" perché lo script è tuo e non passa
   dalla review pubblica: è normale.
3. Copia l'**URL dell'app web** (finisce con `/exec`). Quello è il link del questionario.

Verifica in 30 secondi: apri l'URL, compila il test, controlla che compaia una riga
nel foglio. In alternativa, dall'editor seleziona la funzione `provaInvio` e premi
**Esegui**: scrive una riga "PROVA" senza compilare nulla.

---

## Chi riceve cosa

- **Foglio:** ogni riga è un venditore — data, nome, profilo dominante, mix percentuali,
  tutte e 20 le risposte, report completo, più una colonna Note.
- **Email automatica:** a `roccorestapro@gmail.com`, con `alessandrobrozzi1@gmail.com`
  in **Ccn** (non compare fra i destinatari).
- **Pulsanti manuali** (WhatsApp, Gmail, app di posta, PDF, copia): scrivono **solo a
  Rocco**. Lì la mail parte dalla casella del venditore, quindi qualunque altro
  destinatario — anche in Ccn — sarebbe visibile a lui.

**Il foglio vede tutto anche se l'email non arriva.** La riga viene scritta prima
dell'invio e l'email è dentro un `try`: se la posta fallisce (limite ~100 al giorno,
errore Google) il risultato resta sul foglio e la colonna Note dice cosa è andato storto.

---

## Due cose da sistemare

1. **Il foglio è condiviso "chiunque con il link → editor".** Chiunque riceva il link
   può cancellare i risultati. Mettilo su *Visualizzatore* o togli il link pubblico:
   lo script continua a scrivere, perché scrive dall'account proprietario.
2. **Il mittente delle email sarà `alessandrobrozzi1@gmail.com`**, perché è l'account
   che pubblica lo script. Il Ccn nasconde il destinatario, non il mittente: Rocco ti
   vedrà comunque nel campo "da". Per sparire davvero, il progetto va ricreato e
   pubblicato dall'account di Rocco (o da un account neutro).

---

## Se qualcosa non va

- **Il link chiede il login o dà "non autorizzato":** *Chi ha accesso* non è su "Chiunque".
  Rifai la distribuzione.
- **Hai modificato il codice ma il link si comporta come prima:** serve
  *Distribuisci → Gestisci distribuzioni → Modifica (matita) → Versione: Nuova versione*.
  Senza questo resta attiva la versione vecchia.
- **La pagina dice "Invio automatico non riuscito":** lo script ha risposto con un errore.
  Guarda *Esecuzioni* nell'editor per il motivo esatto. Il report resta comunque a schermo
  e i pulsanti manuali funzionano.
- **PDF:** il pulsante usa la stampa del browser. Dentro Apps Script la pagina vive in un
  iframe, quindi se la stampa esce storta usa *Copia il report*.
- **Report via "app di posta":** i link `mailto:` con un testo lungo (~4.000 caratteri)
  vengono troncati da alcuni client. Per quello ci sono WhatsApp, Gmail e *Copia il report*.
