---
id: build-smarter-rag-routing-hybrid-retrieval.md
title: >-
  Oltre il RAG ingenuo: costruire sistemi più intelligenti con l'instradamento
  delle query e il recupero ibrido
author: Min Yin
date: 2026-3-25
cover: assets.zilliz.com/cover_beyond_naive_rag_7db83a08f9.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  RAG architecture, hybrid retrieval, query routing, vector search BM25, RAG
  evaluation
meta_title: |
  Build Smarter RAG with Routing and Hybrid Retrieval
desc: >-
  Scoprite come i moderni sistemi RAG utilizzano l'instradamento delle query, il
  recupero ibrido e la valutazione stage-by-stage per fornire risposte migliori
  a costi inferiori.
origin: 'https://milvus.io/blog/build-smarter-rag-routing-hybrid-retrieval.md'
---
<p>La pipeline <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> recupera i documenti per ogni query, indipendentemente dalla necessità di recupero. Esegue la stessa ricerca per similarità su codice, linguaggio naturale e rapporti finanziari. E quando i risultati non sono soddisfacenti, non avete modo di capire quale fase si è rotta.</p>
<p>Questi sono i sintomi di una RAG ingenua: una pipeline fissa che tratta ogni query allo stesso modo. I moderni sistemi RAG funzionano in modo diverso. Indirizzano le query al gestore giusto, combinano più metodi di reperimento e valutano ogni fase in modo indipendente.</p>
<p>Questo articolo illustra un'architettura a quattro nodi per costruire sistemi RAG più intelligenti, spiega come implementare il <a href="https://zilliz.com/learn/hybrid-search-a-practical-guide">reperimento ibrido</a> senza mantenere indici separati e mostra come valutare ogni fase della pipeline, in modo da poter eseguire più rapidamente il debug dei problemi.</p>
<h2 id="Why-Long-Context-Doesnt-Replace-RAG" class="common-anchor-header">Perché il contesto lungo non sostituisce la RAG<button data-href="#Why-Long-Context-Doesnt-Replace-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>"Metti tutto nel prompt" è un suggerimento comune ora che i modelli supportano finestre di token da 128K in su. Non regge in produzione per due motivi.</p>
<p><strong>Il costo varia in base alla base di conoscenza, non alla query.</strong> Ogni richiesta invia l'intera base di conoscenza al modello. Per un corpus di 100K token, si tratta di 100K token di input per ogni richiesta, indipendentemente dal fatto che la risposta richieda un paragrafo o dieci. I costi mensili di inferenza crescono linearmente con le dimensioni del corpus.</p>
<p><strong>L'attenzione diminuisce con la lunghezza del contesto.</strong> I modelli faticano a concentrarsi sulle informazioni rilevanti sepolte in contesti lunghi. Le ricerche sull'effetto "lost in the middle" (Liu et al., 2023) mostrano che i modelli hanno maggiori probabilità di perdere le informazioni poste nel mezzo di input lunghi. Finestre di contesto più ampie non hanno risolto questo problema: la qualità dell'attenzione non ha tenuto il passo con la dimensione della finestra.</p>
<p>RAG evita entrambi i problemi recuperando solo i passaggi rilevanti prima della generazione. La questione non è se la RAG sia necessaria, ma come costruire una RAG che funzioni davvero.</p>
<h2 id="Whats-Wrong-with-Traditional-RAG" class="common-anchor-header">Cosa c'è di sbagliato nel RAG tradizionale?<button data-href="#Whats-Wrong-with-Traditional-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Il RAG tradizionale segue una pipeline fissa: incorporare la query, eseguire una <a href="https://zilliz.com/learn/what-is-vector-search">ricerca di similarità vettoriale</a>, prendere i primi K risultati, generare una risposta. Ogni query segue lo stesso percorso.</p>
<p>Questo crea due problemi:</p>
<ol>
<li><p><strong>Spreco di calcolo per query banali.</strong> "Che cos'è 2 + 2?" non ha bisogno di essere recuperata, ma il sistema la esegue comunque, aggiungendo latenza e costi senza alcun beneficio.</p></li>
<li><p><strong>Recupero fragile su query complesse.</strong> Le formulazioni ambigue, i sinonimi o le query in lingua mista spesso vanificano la pura similarità vettoriale. Quando il reperimento manca documenti rilevanti, la qualità della generazione diminuisce senza alcun ripiego.</p></li>
</ol>
<p>La soluzione: aggiungere un processo decisionale prima del recupero. Un moderno sistema RAG decide <em>se</em> recuperare, <em>cosa</em> cercare e <em>come</em> cercare, invece di eseguire sempre la stessa pipeline alla cieca.</p>
<h2 id="How-Modern-RAG-Systems-Work-A-Four-Node-Architecture" class="common-anchor-header">Come funzionano i moderni sistemi RAG: Un'architettura a quattro nodi<button data-href="#How-Modern-RAG-Systems-Work-A-Four-Node-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_smarter_rag_routing_hybrid_retrieval_1_058ab7eb6b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Invece di una pipeline fissa, un moderno sistema RAG instrada ogni query attraverso quattro nodi decisionali. Ogni nodo risponde a una domanda su come gestire la query corrente.</p>
<h3 id="Node-1-Query-Routing--Does-This-Query-Need-Retrieval" class="common-anchor-header">Nodo 1: instradamento della query - Questa query deve essere recuperata?</h3><p>L'instradamento della query è la prima decisione nella pipeline. Classifica la query in arrivo e la invia lungo il percorso appropriato:</p>
<table>
<thead>
<tr><th>Tipo di query</th><th>Esempio</th><th>Azione</th></tr>
</thead>
<tbody>
<tr><td>Senso comune/conoscenza generale</td><td>"Che cos'è 2 + 2?"</td><td>Rispondere direttamente con il recupero di LLM-skip</td></tr>
<tr><td>Domanda di base di conoscenza</td><td>"Quali sono le specifiche del Modello X?".</td><td>Invio alla pipeline di recupero</td></tr>
<tr><td>Informazioni in tempo reale</td><td>"Il tempo a Parigi questo fine settimana"</td><td>Chiamare un'API esterna</td></tr>
</tbody>
</table>
<p>L'instradamento a monte evita il recupero non necessario per le query che non ne hanno bisogno. Nei sistemi in cui gran parte delle interrogazioni sono semplici o di conoscenza generale, questo può da solo ridurre significativamente i costi di calcolo.</p>
<h3 id="Node-2-Query-Rewriting--What-Should-the-System-Search-For" class="common-anchor-header">Nodo 2: Riscrittura delle query - Cosa deve cercare il sistema?</h3><p>Le query degli utenti sono spesso vaghe. Una domanda come "i numeri principali del rapporto Q3 di LightOn" non si traduce bene in una query di ricerca.</p>
<p>La riscrittura delle query trasforma la domanda originale in condizioni di ricerca strutturate:</p>
<ul>
<li><strong>Intervallo di tempo:</strong> 1 luglio - 30 settembre 2025 (Q3)</li>
<li><strong>Tipo di documento:</strong> Rapporto finanziario</li>
<li><strong>Entità:</strong> LightOn, dipartimento finanziario</li>
</ul>
<p>Questa fase colma il divario tra il modo in cui gli utenti pongono le domande e il modo in cui i sistemi di reperimento indicizzano i documenti. Query migliori significano meno risultati irrilevanti.</p>
<h3 id="Node-3-Retrieval-Strategy-Selection--How-Should-the-System-Search" class="common-anchor-header">Nodo 3: Selezione della strategia di recupero - Come deve cercare il sistema?</h3><p>Tipi di contenuto diversi richiedono strategie di reperimento diverse. Un unico metodo non può coprire tutto:</p>
<table>
<thead>
<tr><th>Tipo di contenuto</th><th>Metodo di ricerca migliore</th><th>Perché</th></tr>
</thead>
<tbody>
<tr><td>Codice (nomi di variabili, firme di funzioni)</td><td>Ricerca lessicale<a href="https://zilliz.com/learn/mastering-bm25-a-deep-dive-into-the-algorithm-and-application-in-milvus">(BM25</a>)</td><td>La corrispondenza esatta delle parole chiave funziona bene su token strutturati</td></tr>
<tr><td>Linguaggio naturale (documenti, articoli)</td><td>Ricerca semantica (vettori densi)</td><td>Gestisce sinonimi, parafrasi e intenzionalità</td></tr>
<tr><td>Multimodale (grafici, diagrammi, disegni)</td><td>Recupero multimodale</td><td>Cattura la struttura visiva che l'estrazione del testo non coglie.</td></tr>
</tbody>
</table>
<p>I documenti vengono etichettati con metadati al momento dell'indicizzazione. Al momento dell'interrogazione, questi tag guidano sia i documenti da cercare sia il metodo di recupero da utilizzare.</p>
<h3 id="Node-4-Minimal-Context-Generation--How-Much-Context-Does-the-Model-Need" class="common-anchor-header">Nodo 4: Generazione di un contesto minimo - Di quanto contesto ha bisogno il modello?</h3><p>Dopo il recupero e la <a href="https://zilliz.com/learn/optimize-rag-with-rerankers-the-role-and-tradeoffs">riclassificazione</a>, il sistema invia al modello solo i passaggi più rilevanti, non gli interi documenti.</p>
<p>Questo aspetto è più importante di quanto sembri. Rispetto al caricamento dell'intero documento, il passaggio dei soli passaggi rilevanti può ridurre l'utilizzo di token di oltre il 90%. Un numero inferiore di token significa risposte più rapide e costi inferiori, anche in presenza di cache.</p>
<h2 id="Why-Hybrid-Retrieval-Matters-for-Enterprise-RAG" class="common-anchor-header">Perché il recupero ibrido è importante per la RAG aziendale<button data-href="#Why-Hybrid-Retrieval-Matters-for-Enterprise-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>In pratica, la selezione della strategia di recupero (nodo 3) è il punto in cui la maggior parte dei team si blocca. Nessun metodo di recupero copre tutti i tipi di documenti aziendali.</p>
<p>Alcuni sostengono che la ricerca per parole chiave sia sufficiente, dopotutto la ricerca del codice basata su grep di Claude Code funziona bene. Ma il codice è altamente strutturato, con convenzioni di denominazione coerenti. I documenti aziendali sono una storia diversa.</p>
<h3 id="Enterprise-Documents-Are-Messy" class="common-anchor-header">I documenti aziendali sono disordinati</h3><p><strong>Sinonimi e frasi varie.</strong> "Ottimizzare l'uso della memoria" e "ridurre l'impronta di memoria" hanno lo stesso significato, ma utilizzano parole diverse. La ricerca per parole chiave corrisponde a una e non all'altra. In ambienti multilingue - il cinese con la segmentazione delle parole, il giapponese con le scritture miste, il tedesco con le parole composte - il problema si moltiplica.</p>
<p><strong>La struttura visiva è importante.</strong> I disegni tecnici dipendono dal layout. I rapporti finanziari dipendono dalle tabelle. Le immagini mediche dipendono dalle relazioni spaziali. L'OCR estrae il testo ma perde la struttura. Il recupero del solo testo non è in grado di gestire questi documenti in modo affidabile.</p>
<h3 id="How-to-Implement-Hybrid-Retrieval" class="common-anchor-header">Come implementare il recupero ibrido</h3><p>Il recupero ibrido combina più metodi di ricerca - tipicamente <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">BM25 per la corrispondenza delle parole chiave e vettori densi per la ricerca semantica - per</a>coprire ciò che nessuno dei due metodi gestisce da solo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_smarter_rag_routing_hybrid_retrieval_2_7f305f024e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>L'approccio tradizionale prevede due sistemi separati: uno per il BM25 e uno per la ricerca vettoriale. Ogni query viene eseguita su entrambi e i risultati vengono poi uniti. Funziona, ma comporta un notevole sovraccarico di lavoro:</p>
<table>
<thead>
<tr><th></th><th>Tradizionale (sistemi separati)</th><th>Unificato (raccolta unica)</th></tr>
</thead>
<tbody>
<tr><td>Memorizzazione</td><td>Due indici separati</td><td>Una raccolta, entrambi i tipi di vettore</td></tr>
<tr><td>Sincronizzazione dei dati</td><td>Deve mantenere due sistemi sincronizzati</td><td>Singolo percorso di scrittura</td></tr>
<tr><td>Percorso di interrogazione</td><td>Due query + fusione dei risultati</td><td>Una chiamata API, fusione automatica</td></tr>
<tr><td>Sintonizzazione</td><td>Regolazione dei pesi di fusione tra i sistemi</td><td>Modifica del peso denso/sparso in una sola query</td></tr>
<tr><td>Complessità operativa</td><td>Alta</td><td>Bassa</td></tr>
</tbody>
</table>
<p><a href="https://milvus.io/">Milvus</a> 2.6 supporta sia vettori densi (per la ricerca semantica) che vettori radi (per la ricerca di parole chiave in stile BM25) nella stessa collezione. Una singola chiamata API restituisce risultati fusi, con un comportamento di recupero regolabile modificando il peso tra i tipi di vettore. Nessun indice separato, nessun problema di sincronizzazione, nessuna latenza di fusione.</p>
<h2 id="How-to-Evaluate-a-RAG-Pipeline-Stage-by-Stage" class="common-anchor-header">Come valutare una pipeline RAG fase per fase<button data-href="#How-to-Evaluate-a-RAG-Pipeline-Stage-by-Stage" class="anchor-icon" translate="no">
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
    </button></h2><p>Controllare solo la risposta finale non è sufficiente. RAG è una pipeline a più stadi e un fallimento in qualsiasi stadio si propaga a valle. Se si misura solo la qualità delle risposte, non si può dire se il problema è nell'instradamento, nella riscrittura, nel recupero, nel reranking o nella generazione.</p>
<p>Quando gli utenti segnalano "risultati imprecisi", la causa principale potrebbe essere ovunque: l'instradamento potrebbe saltare il recupero quando non dovrebbe; la riscrittura della query potrebbe tralasciare le entità chiave; il recupero potrebbe mancare i documenti rilevanti; il reranking potrebbe seppellire i buoni risultati; oppure il modello potrebbe ignorare completamente il contesto recuperato.</p>
<p>Valutare ogni fase con le proprie metriche:</p>
<table>
<thead>
<tr><th>Fase</th><th>Metrica</th><th>Cosa cattura</th></tr>
</thead>
<tbody>
<tr><td>Instradamento</td><td>Punteggio F1</td><td>Alto tasso di falsi negativi = le query che necessitano di recupero vengono saltate</td></tr>
<tr><td>Riscrittura delle query</td><td>Accuratezza dell'estrazione delle entità, copertura dei sinonimi</td><td>La query riscritta elimina termini importanti o cambia l'intento</td></tr>
<tr><td>Recupero</td><td>Richiamo@K, NDCG@10</td><td>I documenti rilevanti non vengono recuperati o sono classificati troppo in basso</td></tr>
<tr><td>Riclassificazione</td><td>Precisione@3</td><td>I risultati migliori non sono effettivamente rilevanti</td></tr>
<tr><td>Generazione</td><td>Fedeltà, completezza delle risposte</td><td>Il modello ignora il contesto recuperato o fornisce risposte parziali.</td></tr>
</tbody>
</table>
<p><strong>Impostare un monitoraggio a strati.</strong> Usare set di test offline per definire gli intervalli di metriche di base per ogni fase. In produzione, attivate gli avvisi quando una fase scende al di sotto della sua linea di base. In questo modo è possibile individuare tempestivamente le regressioni e risalire a una fase specifica, invece di tirare a indovinare.</p>
<h2 id="What-to-Build-First" class="common-anchor-header">Cosa costruire per primo<button data-href="#What-to-Build-First" class="anchor-icon" translate="no">
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
    </button></h2><p>Tre priorità emergono dalle implementazioni RAG del mondo reale:</p>
<ol>
<li><p><strong>Aggiungere il routing in anticipo.</strong> Molte query non hanno bisogno di essere recuperate. Filtrarle in anticipo riduce il carico e migliora i tempi di risposta con uno sforzo ingegneristico minimo.</p></li>
<li><p><strong>Utilizzare un recupero ibrido unificato.</strong> Mantenere sistemi di ricerca BM25 e vettoriali separati raddoppia i costi di archiviazione, crea complessità di sincronizzazione e aggiunge latenza di fusione. Un sistema unificato come Milvus 2.6, in cui i vettori densi e radi vivono nella stessa collezione, elimina questi problemi.</p></li>
<li><p><strong>Valutare ogni fase in modo indipendente.</strong> La qualità della risposta end-to-end da sola non è un segnale utile. Le metriche per fase (F1 per l'instradamento, Recall@K e NDCG per il recupero) consentono di eseguire il debug più rapidamente e di evitare di interrompere una fase mentre se ne mette a punto un'altra.</p></li>
</ol>
<p>Il vero valore di un sistema RAG moderno non è solo il reperimento, ma anche il sapere <em>quando</em> e <em>come</em> recuperarlo. Iniziate con il routing e la ricerca ibrida unificata e avrete una base scalabile.</p>
<hr>
<p>Se state costruendo o aggiornando un sistema RAG e avete problemi di qualità di recupero, saremo lieti di aiutarvi:</p>
<ul>
<li>Unitevi alla <a href="https://slack.milvus.io/">community Milvus su Slack</a> per porre domande, condividere la vostra architettura e imparare da altri sviluppatori che lavorano su problemi simili.</li>
<li><a href="https://milvus.io/office-hours">Prenotate una sessione gratuita di 20 minuti di Milvus Office Hours</a> per analizzare il vostro caso d'uso, sia che si tratti di progettazione di routing, di configurazione di recupero ibrido o di valutazione in più fasi.</li>
<li>Se preferite evitare la configurazione dell'infrastruttura, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (gestito da Milvus) offre un livello gratuito per iniziare.</li>
</ul>
<hr>
<p>Alcune domande che emergono spesso quando i team iniziano a costruire sistemi RAG più intelligenti:</p>
<p><strong>D: RAG è ancora necessario ora che i modelli supportano finestre di contesto da 128K in su?</strong></p>
<p>Sì. Le finestre di contesto lunghe sono utili quando è necessario elaborare un singolo documento di grandi dimensioni, ma non sostituiscono il recupero per le interrogazioni della knowledge-base. L'invio dell'intero corpus a ogni richiesta aumenta i costi in modo lineare e i modelli perdono di vista le informazioni rilevanti in contesti lunghi, un problema ben documentato noto come effetto "lost in the middle" (Liu et al., 2023). RAG recupera solo ciò che è rilevante, mantenendo i costi e la latenza prevedibili.</p>
<p><strong>D: Come posso combinare BM25 e ricerca vettoriale senza utilizzare due sistemi separati?</strong></p>
<p>Utilizzate un database vettoriale che supporti vettori densi e radi nella stessa collezione. Milvus 2.6 memorizza entrambi i tipi di vettori per documento e restituisce risultati fusi da un'unica query. È possibile regolare il bilanciamento tra parola chiave e corrispondenza semantica modificando un parametro di peso: nessun indice separato, nessuna fusione dei risultati, nessun problema di sincronizzazione.</p>
<p><strong>D: Qual è la prima cosa da aggiungere per migliorare la pipeline RAG esistente?</strong></p>
<p>L'instradamento delle query. È il miglioramento di maggiore impatto e minore sforzo. La maggior parte dei sistemi di produzione vede una quota significativa di query che non hanno alcun bisogno di essere recuperate: domande di buon senso, semplici calcoli, conoscenze generali. L'instradamento di queste domande direttamente all'LLM riduce le chiamate di recupero non necessarie e migliora immediatamente i tempi di risposta.</p>
<p><strong>D: Come faccio a capire quale fase della mia pipeline RAG sta causando cattivi risultati?</strong></p>
<p>Valutate ogni fase in modo indipendente. Utilizzate il punteggio F1 per l'accuratezza del routing, Recall@K e NDCG@10 per la qualità del recupero, Precision@3 per il reranking e le metriche di fedeltà per la generazione. Stabilite delle linee di base a partire da dati di test offline e monitorate ogni fase in produzione. Quando la qualità delle risposte diminuisce, è possibile risalire alla fase specifica che ha subito il regresso, invece di tirare a indovinare.</p>
