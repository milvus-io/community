---
id: harness-engineering-ai-agents.md
title: >-
  Ingegneria dell'imbroglio: Lo strato di esecuzione di cui gli agenti di
  intelligenza artificiale hanno effettivamente bisogno
author: Min Yin
date: 2026-4-9
cover: assets.zilliz.com/05842e3a_b21b_41c9_9d29_13b8d7afa211_428ab449a7.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  harness engineering, AI agent infrastructure, hybrid search, Milvus 2.6,
  Sparse-BM25
meta_title: |
  What Is Harness Engineering for AI Agents? | Milvus
desc: >-
  Harness Engineering costruisce l'ambiente di esecuzione attorno agli agenti AI
  autonomi. Scoprite cos'è, come lo usa OpenAI e perché richiede una ricerca
  ibrida.
origin: 'https://milvus.io/blog/harness-engineering-ai-agents.md'
---
<p>Mitchell Hashimoto ha costruito la HashiCorp e ha co-creato Terraform. Nel febbraio del 2026 ha pubblicato un <a href="https://mitchellh.com/writing/my-ai-adoption-journey">post sul blog</a> in cui descriveva un'abitudine che aveva sviluppato lavorando con gli agenti AI: ogni volta che un agente commetteva un errore, lui progettava una correzione permanente nell'ambiente dell'agente. L'ha chiamata "ingegneria dell'imbracatura". Nel giro di poche settimane, <a href="https://openai.com/index/harness-engineering/">OpenAI</a> e <a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">Anthropic</a> pubblicarono articoli di ingegneria che espandevano l'idea. Il termine <em>Harness Engineering</em> era arrivato.</p>
<p>Il termine ha risuonato perché nomina un problema che ogni ingegnere che costruisce <a href="https://zilliz.com/glossary/ai-agents">agenti di IA</a> ha già affrontato. L <a href="https://zilliz.com/glossary/prompt-as-code-(prompt-engineering)">'ingegneria tempestiva</a> consente di ottenere risultati migliori in un solo turno. L'ingegneria del contesto gestisce ciò che il modello vede. Ma nessuno dei due si occupa di ciò che accade quando un agente funziona autonomamente per ore, prendendo centinaia di decisioni senza supervisione. È questa la lacuna che Harness Engineering colma, e quasi sempre dipende dalla ricerca ibrida (ricerca ibrida full-text e semantica) per funzionare.</p>
<h2 id="What-Is-Harness-Engineering" class="common-anchor-header">Che cos'è l'Harness Engineering?<button data-href="#What-Is-Harness-Engineering" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>L'Harness Engineering è la disciplina che progetta l'ambiente di esecuzione di un agente AI autonomo. Definisce quali strumenti l'agente può chiamare, dove ottiene le informazioni, come convalida le proprie decisioni e quando deve fermarsi.</p>
<p>Per capire perché è importante, consideriamo tre livelli di sviluppo di un agente di intelligenza artificiale:</p>
<table>
<thead>
<tr><th>Livello</th><th>Cosa ottimizza</th><th>Ambito di applicazione</th><th>Esempio</th></tr>
</thead>
<tbody>
<tr><td><strong>Prompt Engineering</strong></td><td>Cosa si dice al modello</td><td>Singolo scambio</td><td>Pochi esempi, suggerimenti a catena di pensiero</td></tr>
<tr><td><strong>Ingegneria del contesto</strong></td><td>Ciò che il modello può vedere</td><td><a href="https://zilliz.com/glossary/context-window">Finestra del contesto</a></td><td>Recupero di documenti, compressione della cronologia</td></tr>
<tr><td><strong>Ingegneria del contesto</strong></td><td>Il mondo in cui l'agente opera</td><td>Esecuzione autonoma di più ore</td><td>Strumenti, logica di validazione, vincoli architettonici</td></tr>
</tbody>
</table>
<p><strong>Prompt Engineering</strong> Ottimizza la qualità di un singolo scambio - fraseggio, struttura, esempi. Una conversazione, un output.</p>
<p>L<strong>'ingegneria del contesto</strong> gestisce la quantità di informazioni che il modello può vedere contemporaneamente: quali documenti recuperare, come comprimere la cronologia, cosa inserire nella finestra del contesto e cosa eliminare.</p>
<p><strong>L'Harness Engineering</strong> costruisce il mondo in cui l'agente opera. Strumenti, fonti di conoscenza, logica di convalida, vincoli architettonici: tutto ciò che determina se un agente può funzionare in modo affidabile su centinaia di decisioni senza la supervisione umana.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_4_2f4bc35890.png" alt="Three layers of AI agent development: Prompt Engineering optimizes what you say, Context Engineering manages what the model sees, and Harness Engineering designs the execution environment" class="doc-image" id="three-layers-of-ai-agent-development:-prompt-engineering-optimizes-what-you-say,-context-engineering-manages-what-the-model-sees,-and-harness-engineering-designs-the-execution-environment" />
   <span>Tre livelli di sviluppo dell'agente AI: Prompt Engineering ottimizza ciò che si dice, Context Engineering gestisce ciò che il modello vede e Harness Engineering progetta l'ambiente di esecuzione</span> </span>.</p>
<p>I primi due livelli determinano la qualità di un singolo turno. Il terzo livello determina se un agente può operare per ore senza che voi lo guardiate.</p>
<p>Non si tratta di approcci in competizione tra loro. Sono una progressione. Man mano che la capacità dell'agente cresce, lo stesso team passa attraverso tutti e tre, spesso nell'ambito di un unico progetto.</p>
<h2 id="How-OpenAI-Used-Harness-Engineering-to-Build-a-Million-Line-Codebase-and-Lessons-They-Learnt" class="common-anchor-header">Come OpenAI ha utilizzato Harness Engineering per costruire una base di codice di un milione di righe e le lezioni apprese<button data-href="#How-OpenAI-Used-Harness-Engineering-to-Build-a-Million-Line-Codebase-and-Lessons-They-Learnt" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>OpenAI ha condotto un esperimento interno che mette in pratica l'Harness Engineering. Lo hanno descritto nel loro post sul blog dedicato all'ingegneria, <a href="https://openai.com/index/harness-engineering/">"Harness Engineering: Leveraging Codex in an Agent-First World".</a> Un team di tre persone ha iniziato con un repository vuoto alla fine di agosto del 2025. Per cinque mesi non hanno scritto alcun codice: ogni riga è stata generata da Codex, l'agente di codifica con intelligenza artificiale di OpenAI. Il risultato: un milione di linee di codice in produzione e 1.500 richieste di pull unite.</p>
<p>La parte interessante non è il risultato. Sono i quattro problemi che hanno incontrato e le soluzioni harness-layer che hanno costruito.</p>
<h3 id="Problem-1-No-Shared-Understanding-of-the-Codebase" class="common-anchor-header">Problema 1: nessuna comprensione condivisa della base di codice</h3><p>Quale livello di astrazione deve utilizzare l'agente? Quali sono le convenzioni di denominazione? Dov'è finita la discussione sull'architettura della settimana scorsa? In assenza di risposte, l'agente ha tirato a indovinare - e a sbagliare - ripetutamente.</p>
<p>Il primo istinto è stato un singolo file <code translate="no">AGENTS.md</code> contenente ogni convenzione, regola e decisione storica. Il tentativo è fallito per quattro motivi. Il contesto è scarso e un file di istruzioni troppo voluminoso ha messo in secondo piano l'attività vera e propria. Quando tutto viene definito importante, nulla lo è. La documentazione marcisce: le regole della seconda settimana diventano sbagliate all'ottava. E un documento piatto non può essere verificato meccanicamente.</p>
<p>La soluzione: ridurre <code translate="no">AGENTS.md</code> a 100 righe. Non regole, ma una mappa. Punta a una directory strutturata <code translate="no">docs/</code> contenente le decisioni di progettazione, i piani di esecuzione, le specifiche di prodotto e i documenti di riferimento. Linters e CI verificano che i collegamenti incrociati rimangano intatti. L'agente naviga esattamente verso ciò di cui ha bisogno.</p>
<p>Il principio di fondo: se qualcosa non è contestualizzato in fase di esecuzione, non esiste per l'agente.</p>
<h3 id="Problem-2-Human-QA-Couldnt-Keep-Pace-with-Agent-Output" class="common-anchor-header">Problema 2: il QA umano non riusciva a tenere il passo con l'output dell'agente</h3><p>Il team ha inserito il protocollo Chrome DevTools in Codex. L'agente poteva fare screenshot dei percorsi dell'interfaccia utente, osservare gli eventi di runtime e interrogare i log con LogQL e le metriche con PromQL. Hanno fissato una soglia concreta: un servizio doveva avviarsi in meno di 800 millisecondi prima che un'attività fosse considerata completa. I task del Codex venivano eseguiti per oltre sei ore di fila, in genere mentre gli ingegneri dormivano.</p>
<h3 id="Problem-3-Architectural-Drift-Without-Constraints" class="common-anchor-header">Problema 3: Deriva architettonica senza vincoli</h3><p>Senza barriere di protezione, l'agente riproduceva qualsiasi modello trovasse nel repo, anche quelli sbagliati.</p>
<p>La soluzione: un'architettura rigorosa a strati con un'unica direzione di dipendenza - Types → Config → Repo → Service → Runtime → UI. I linters personalizzati applicano queste regole meccanicamente, con messaggi di errore che includono l'istruzione di correzione in linea.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_3_f0fc3c9e92.png" alt="Strict layered architecture with one-way dependency validation: Types at the base, UI at the top, custom linters enforce rules with inline fix suggestions" class="doc-image" id="strict-layered-architecture-with-one-way-dependency-validation:-types-at-the-base,-ui-at-the-top,-custom-linters-enforce-rules-with-inline-fix-suggestions" />
   <span>Architettura rigorosa a strati con validazione unidirezionale delle dipendenze: I tipi alla base, l'interfaccia utente in cima, i linters personalizzati applicano le regole con suggerimenti di correzione in linea</span> </span>.</p>
<p>In un team umano, questo vincolo si presenta di solito quando l'azienda raggiunge centinaia di ingegneri. Per un agente di codifica, è un prerequisito fin dal primo giorno. Quanto più velocemente un agente si muove senza vincoli, tanto peggiore sarà la deriva architettonica.</p>
<h3 id="Problem-4-Silent-Technical-Debt" class="common-anchor-header">Problema 4: Debito tecnico silenzioso</h3><p>La soluzione: codificare i principi fondamentali del progetto nel repository, quindi eseguire attività Codex in background su una tabella di marcia per analizzare le deviazioni e inviare PR di refactoring. La maggior parte di esse è stata fusa automaticamente entro un minuto: piccoli pagamenti continui anziché conteggi periodici.</p>
<h2 id="Why-AI-Agents-Cant-Grade-Their-Own-Work" class="common-anchor-header">Perché gli agenti AI non possono valutare il proprio lavoro<button data-href="#Why-AI-Agents-Cant-Grade-Their-Own-Work" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>L'esperimento di OpenAI ha dimostrato che Harness Engineering funziona. Ma una ricerca separata ha messo in luce una modalità di fallimento al suo interno: gli agenti sono sistematicamente incapaci di valutare i propri risultati.</p>
<p>Il problema si presenta in due forme.</p>
<p><strong>Ansia da contesto.</strong> Quando la finestra del contesto si riempie, gli agenti iniziano a terminare i compiti prima del tempo, non perché il lavoro sia finito, ma perché sentono che il limite della finestra si sta avvicinando. Cognition, il team dietro l'agente di codifica AI Devin, ha <a href="https://cognition.ai/blog/devin-sonnet-4-5-lessons-and-challenges">documentato questo comportamento</a> durante la ricostruzione di Devin per Claude Sonnet 4.5: il modello si è reso conto della propria finestra di contesto e ha iniziato a prendere scorciatoie ben prima di esaurire effettivamente lo spazio.</p>
<p>La loro soluzione è stata la pura ingegneria dell'imbracatura. Hanno abilitato la beta del contesto da 1 milione di token, ma hanno limitato l'utilizzo effettivo a 200.000 token, facendo credere al modello di avere un ampio margine di manovra. L'ansia è svanita. Non è stata necessaria alcuna modifica del modello, ma solo un ambiente più intelligente.</p>
<p>La mitigazione generale più comune è la compattazione: riassumere la storia e lasciare che lo stesso agente continui con un contesto compresso. Questo preserva la continuità, ma non elimina il comportamento sottostante. Un'alternativa è il reset del contesto: cancellare la finestra, avviare una nuova istanza e trasferire lo stato attraverso un artefatto strutturato. In questo modo si elimina completamente l'innesco dell'ansia, ma si richiede un documento di passaggio completo: le lacune nell'artefatto significano lacune nella comprensione del nuovo agente.</p>
<p><strong>Pregiudizio dell'autovalutazione.</strong> Quando gli agenti valutano i propri risultati, assegnano loro un punteggio elevato. Anche su compiti con criteri oggettivi di accettazione/rifiuto, l'agente individua un problema, si convince che non è grave e approva un lavoro che dovrebbe fallire.</p>
<p>La soluzione prende spunto dalle GAN (Generative Adversarial Networks): separare completamente il generatore dal valutatore. In una GAN, due reti neurali competono - una genera, l'altra giudica - e questa tensione avversaria costringe a migliorare la qualità. La stessa dinamica si applica ai <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">sistemi multi-agente</a>.</p>
<p>Anthropic ha testato questo aspetto con un sistema a tre agenti - Planner, Generator, Evaluator - contro un agente solitario con il compito di costruire un motore di gioco retrò 2D. L'esperimento è descritto in <a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">"Harness Design for Long-Running Application Development"</a> (Anthropic, 2026). Il pianificatore espande una breve richiesta in una specifica di prodotto completa, lasciando deliberatamente i dettagli di implementazione non specificati - la sovraspecificazione precoce si ripercuote in errori a valle. Il Generatore implementa le funzionalità negli sprint, ma prima di scrivere codice firma un contratto di sprint con il Valutatore: una definizione condivisa di "fatto". Il valutatore usa Playwright (il framework open source di Microsoft per l'automazione del browser) per fare clic sull'applicazione come un utente reale, testando l'interfaccia utente, le API e il comportamento del database. Se qualcosa non funziona, lo sprint fallisce.</p>
<p>Il solo agente ha prodotto un gioco che tecnicamente si avviava, ma le connessioni tra entità e runtime erano interrotte a livello di codice, scopribili solo leggendo il sorgente. L'imbracatura a tre agenti ha prodotto un gioco giocabile con generazione di livelli assistita dall'intelligenza artificiale, animazione di sprite ed effetti sonori.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_1_38a13120a7.png" alt="Comparison of solo agent versus three-agent harness: solo agent ran 20 minutes at nine dollars with broken core functionality, while the full harness ran 6 hours at two hundred dollars producing a fully functional game with AI-assisted features" class="doc-image" id="comparison-of-solo-agent-versus-three-agent-harness:-solo-agent-ran-20-minutes-at-nine-dollars-with-broken-core-functionality,-while-the-full-harness-ran-6-hours-at-two-hundred-dollars-producing-a-fully-functional-game-with-ai-assisted-features" />
   </span> <span class="img-wrapper"> <span>Confronto tra l'agente singolo e l'imbracatura a tre agenti: l'agente singolo ha funzionato per 20 minuti a nove dollari con funzionalità di base non funzionanti, mentre l'imbracatura completa ha funzionato per 6 ore a duecento dollari producendo un gioco completamente funzionale con funzionalità assistite dall'intelligenza artificiale</span> </span>.</p>
<p>L'architettura a tre agenti è costata circa 20 volte di più. Il risultato è passato da inutilizzabile a utilizzabile. Questo è lo scambio fondamentale che fa l'Harness Engineering: spese generali strutturali in cambio di affidabilità.</p>
<h2 id="The-Retrieval-Problem-Inside-Every-Agent-Harness" class="common-anchor-header">Il problema del recupero all'interno di ogni sistema di agenti<button data-href="#The-Retrieval-Problem-Inside-Every-Agent-Harness" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>Entrambi i modelli - il sistema strutturato <code translate="no">docs/</code> e il ciclo di sprint Generatore/Valutatore - condividono una dipendenza silenziosa: l'agente deve trovare le informazioni giuste da una base di conoscenza viva e in evoluzione quando ne ha bisogno.</p>
<p>È più difficile di quanto sembri. Prendiamo un esempio concreto: il Generatore sta eseguendo lo Sprint 3, implementando l'autenticazione degli utenti. Prima di scrivere il codice, ha bisogno di due tipi di informazioni.</p>
<p>In primo luogo, una <a href="https://zilliz.com/glossary/semantic-search">ricerca semantica</a>: <em>quali sono i principi di progettazione di questo prodotto sulle sessioni utente?</em> Il documento pertinente potrebbe usare "gestione delle sessioni" o "controllo degli accessi", non "autenticazione degli utenti". Senza una comprensione semantica, il reperimento non è in grado di individuare il problema.</p>
<p>In secondo luogo, una query a corrispondenza esatta: <em>quali documenti fanno riferimento alla funzione <code translate="no">validateToken</code>?</em> Il nome di una funzione è una stringa arbitraria priva di significato semantico. <a href="https://zilliz.com/glossary/vector-embeddings">Il reperimento basato sull'incorporazione</a> non è in grado di trovarlo in modo affidabile. Funziona solo la corrispondenza delle parole chiave.</p>
<p>Queste due interrogazioni avvengono contemporaneamente. Non possono essere separate in fasi sequenziali.</p>
<p>La <a href="https://zilliz.com/learn/vector-similarity-search">ricerca vettoriale</a> pura fallisce con le corrispondenze esatte. <a href="https://milvus.io/docs/embed-with-bm25.md">Il BM25</a> tradizionale fallisce nelle interrogazioni semantiche e non è in grado di prevedere quale vocabolario utilizzerà un documento. Prima di Milvus 2.5, l'unica opzione era costituita da due sistemi di reperimento paralleli - un indice vettoriale e un <a href="https://milvus.io/docs/full-text-search.md">indice full-text</a> - in esecuzione simultanea al momento dell'interrogazione con una logica di fusione dei risultati personalizzata. Per un repository <code translate="no">docs/</code> con aggiornamenti continui, entrambi gli indici dovevano rimanere sincronizzati: ogni modifica del documento comportava una reindicizzazione in due punti, con il rischio costante di incoerenza.</p>
<h2 id="How-Milvus-26-Solves-Agent-Retrieval-with-a-Single-Hybrid-Pipeline" class="common-anchor-header">Come Milvus 2.6 risolve il recupero degli agenti con un'unica pipeline ibrida<button data-href="#How-Milvus-26-Solves-Agent-Retrieval-with-a-Single-Hybrid-Pipeline" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>Milvus è un <a href="https://zilliz.com/learn/what-is-vector-database">database vettoriale</a> open-source progettato per i carichi di lavoro dell'intelligenza artificiale. La Sparse-BM25 di Milvus 2.6 fa collassare il problema del reperimento a doppia pipeline in un unico sistema.</p>
<p>Al momento dell'ingest, Milvus genera simultaneamente due rappresentazioni: un <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">embedding denso</a> per il recupero semantico e un <a href="https://milvus.io/docs/sparse_vector.md">vettore rado codificato in TF</a> per il punteggio BM25. <a href="https://zilliz.com/learn/tf-idf-understanding-term-frequency-inverse-document-frequency-in-nlp">Le statistiche IDF</a> globali si aggiornano automaticamente man mano che i documenti vengono aggiunti o rimossi, senza dover ricorrere a reindicizzazioni manuali. Al momento dell'interrogazione, un input in linguaggio naturale genera internamente entrambi i tipi di vettore di interrogazione. La <a href="https://milvus.io/docs/rrf-ranker.md">Reciprocal Rank Fusion (RRF)</a> fonde i risultati classificati e il chiamante riceve un unico set di risultati unificato.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_2_8504a6ee08.png" alt="Before and after: two separate systems with manual sync, fragmented results, and custom fusion logic versus Milvus 2.6 single pipeline with dense embedding, Sparse BM25, RRF fusion, and automatic IDF maintenance producing unified results" class="doc-image" id="before-and-after:-two-separate-systems-with-manual-sync,-fragmented-results,-and-custom-fusion-logic-versus-milvus-2.6-single-pipeline-with-dense-embedding,-sparse-bm25,-rrf-fusion,-and-automatic-idf-maintenance-producing-unified-results" />
   </span> <span class="img-wrapper"> <span>Prima e dopo: due sistemi separati con sincronizzazione manuale, risultati frammentati e logica di fusione personalizzata rispetto alla pipeline singola di Milvus 2.6 con incorporazione densa, Sparse BM25, fusione RRF e manutenzione automatica dell'IDF che produce risultati unificati</span> </span>.</p>
<p>Un'unica interfaccia. Un solo indice da mantenere.</p>
<p>Nel <a href="https://zilliz.com/glossary/beir">benchmark BEIR</a>, una suite di valutazione standard che copre 18 set di dati eterogenei, Milvus raggiunge un throughput 3-4 volte superiore a quello di Elasticsearch a parità di richiamo, con un miglioramento del QPS fino a 7 volte su carichi di lavoro specifici. Per lo scenario sprint, una singola query trova sia il principio di progettazione della sessione (percorso semantico) sia ogni documento che menziona <code translate="no">validateToken</code> (percorso esatto). Il repository <code translate="no">docs/</code> si aggiorna continuamente; la manutenzione dell'IDF di BM25 significa che un nuovo documento scritto partecipa allo scoring della query successiva senza alcuna ricostruzione in batch.</p>
<p>Questo è il livello di reperimento costruito esattamente per questa classe di problemi. Quando un sistema di agenti ha bisogno di cercare in una base di conoscenza vivente (documentazione del codice, decisioni di progettazione, cronologia degli sprint), la ricerca ibrida a una sola linea non è una cosa semplice da fare. È ciò che fa funzionare il resto del sistema.</p>
<h2 id="The-Best-Harness-Components-Are-Designed-to-Be-Deleted" class="common-anchor-header">I migliori componenti del sistema sono progettati per essere eliminati<button data-href="#The-Best-Harness-Components-Are-Designed-to-Be-Deleted" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>Ogni componente di un harness codifica un'ipotesi sui limiti del modello. La scomposizione in sprint era necessaria quando i modelli perdevano coerenza su compiti lunghi. Il reset del contesto era necessario quando i modelli provavano ansia in prossimità del limite della finestra. Gli agenti valutatori si sono resi necessari quando la distorsione dell'autovalutazione era ingestibile.</p>
<p>Queste ipotesi scadono. Il trucco della cognizione del contesto-finestra può diventare superfluo quando i modelli sviluppano una vera e propria resistenza ai contesti lunghi. Man mano che i modelli continueranno a migliorare, altri componenti diventeranno inutili spese generali che rallentano gli agenti senza aggiungere affidabilità.</p>
<p>Harness Engineering non è un'architettura fissa. È un sistema ricalibrato con ogni nuova versione del modello. La prima domanda da porsi dopo un aggiornamento importante non è "cosa posso aggiungere?". È "cosa posso rimuovere?".</p>
<p>La stessa logica si applica al recupero. Man mano che i modelli gestiscono in modo più affidabile contesti più lunghi, le strategie di chunking e i tempi di recupero cambieranno. Le informazioni che oggi necessitano di un'attenta frammentazione, domani potranno essere ingerite come pagine intere. L'infrastruttura di recupero si adatta al modello.</p>
<p>Ogni componente di un sistema ben costruito è in attesa di essere reso superfluo da un modello più intelligente. Non è un problema. È l'obiettivo.</p>
<h2 id="Get-Started-with-Milvus" class="common-anchor-header">Iniziare con Milvus<button data-href="#Get-Started-with-Milvus" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>Se state costruendo un'infrastruttura di agenti che necessita di un reperimento ibrido - ricerca semantica e per parole chiave in un'unica pipeline - ecco da dove cominciare:</p>
<ul>
<li>Leggete le <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>note di rilascio di Milvus 2.6</strong></a> per tutti i dettagli su Sparse-BM25, la manutenzione automatica dell'IDF e i benchmark delle prestazioni.</li>
<li>Unitevi alla <a href="https://milvus.io/community"><strong>comunità Milvus</strong></a> per porre domande e condividere ciò che state costruendo.</li>
<li><a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>Prenotate una sessione gratuita di Milvus Office Hours</strong></a> per analizzare il vostro caso d'uso con un esperto di database vettoriali.</li>
<li>Se preferite evitare la configurazione dell'infrastruttura, <a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloud</strong></a> (Milvus completamente gestito) offre un livello gratuito per iniziare con 100 dollari di crediti gratuiti previa registrazione con l'e-mail di lavoro.</li>
<li>Dateci una stella su GitHub: <a href="https://github.com/milvus-io/milvus"><strong>milvus-io/milvus</strong></a> - 43k+ stelle e in crescita.</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Domande frequenti<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><h3 id="What-is-harness-engineering-and-how-is-it-different-from-prompt-engineering" class="common-anchor-header">Che cos'è l'harness engineering e in che modo è diverso dal prompt engineering?</h3><p>Il prompt engineering ottimizza ciò che si dice a un modello in un singolo scambio - frasi, struttura, esempi. L'Harness Engineering costruisce l'ambiente di esecuzione attorno a un agente AI autonomo: gli strumenti che può richiamare, le conoscenze a cui può accedere, la logica di validazione che verifica il suo lavoro e i vincoli che impediscono la deriva architetturale. L'ingegneria dei prompt dà forma a un turno di conversazione. L'Harness Engineering determina se un agente può operare in modo affidabile per ore su centinaia di decisioni senza la supervisione umana.</p>
<h3 id="Why-do-AI-agents-need-both-vector-search-and-BM25-at-the-same-time" class="common-anchor-header">Perché gli agenti AI hanno bisogno di ricerca vettoriale e BM25 allo stesso tempo?</h3><p>Gli agenti devono rispondere contemporaneamente a due richieste di ricerca fondamentalmente diverse. Le query semantiche - <em>quali sono i nostri principi di progettazione delle sessioni utente?</em> - richiedono un'incorporazione vettoriale densa per abbinare contenuti concettualmente correlati, indipendentemente dal vocabolario. Query a corrispondenza esatta - <em>quali documenti fanno riferimento alla funzione <code translate="no">validateToken</code>?</em> - richiedono il punteggio delle parole chiave BM25, perché i nomi delle funzioni sono stringhe arbitrarie prive di significato semantico. Un sistema di reperimento che gestisca solo una delle due modalità, non riuscirà sistematicamente a soddisfare le interrogazioni dell'altro tipo.</p>
<h3 id="How-does-Milvus-Sparse-BM25-work-for-agent-knowledge-retrieval" class="common-anchor-header">Come funziona Milvus Sparse-BM25 per il recupero della conoscenza degli agenti?</h3><p>Al momento dell'ingest, Milvus genera simultaneamente un embedding denso e un vettore sparse codificato in TF per ogni documento. Le statistiche IDF globali si aggiornano in tempo reale al variare della base di conoscenza, senza bisogno di reindicizzazione manuale. Al momento dell'interrogazione, entrambi i tipi di vettore vengono generati internamente, Reciprocal Rank Fusion unisce i risultati classificati e l'agente riceve un unico set di risultati unificato. L'intera pipeline viene eseguita attraverso un'unica interfaccia e un unico indice: un aspetto fondamentale per le basi di conoscenza in continuo aggiornamento, come un repository di documentazione del codice.</p>
<h3 id="When-should-I-add-an-evaluator-agent-to-my-agent-harness" class="common-anchor-header">Quando devo aggiungere un agente valutatore al mio sistema di agenti?</h3><p>Aggiungete un valutatore separato quando la qualità dell'output del vostro generatore non può essere verificata solo dai test automatici o quando l'autovalutazione ha causato difetti mancati. Il principio fondamentale è che il valutatore deve essere architettonicamente separato dal generatore: un contesto condiviso reintroduce gli stessi pregiudizi che si sta cercando di eliminare. Il valutatore deve avere accesso agli strumenti di runtime (automazione del browser, chiamate API, query al database) per testare il comportamento, non solo per rivedere il codice. La <a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">ricerca</a> di Anthropic ha rilevato che questa separazione ispirata alla GAN ha portato la qualità dell'output da "tecnicamente lanciato ma non funzionante" a "completamente funzionante con funzionalità che l'agente solitario non ha mai tentato".</p>
