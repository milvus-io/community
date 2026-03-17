---
id: will-gemini-embedding-2-kill-multi-vector-search-in-vector-databases.md
title: >-
  Gemini Embedding 2 ucciderà la ricerca multivettoriale nei database
  vettoriali?
author: Jack Li
date: 2026-3-13
cover: assets.zilliz.com/blog_Gemini_Embedding2_4_62bc980b71.png
tag: Engineering
recommend: false
publishToMedium: true
tags: >-
  multi-vector search, gemini embedding 2, multimodal embeddings,  milvus,
  vector database
meta_keywords: >-
  multi-vector search, gemini embedding 2, multimodal embeddings,  milvus,
  vector database
meta_title: |
  Will Gemini Embedding 2 kill Multi-Vector Search in Vector Databases?
desc: >-
  Gemini Embedding 2 di Google mappa testo, immagini, video e audio in un unico
  vettore. Questo renderà obsoleta la ricerca multivettoriale? No, ed ecco
  perché.
origin: >-
  https://milvus.io/blog/will-gemini-embedding-2-kill-multi-vector-search-in-vector-databases.md
---
<p>Google ha rilasciato <a href="https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-embedding-2/">Gemini Embedding 2</a>, il primo modello di embedding multimodale che mappa testo, immagini, video, audio e documenti in un unico spazio vettoriale.</p>
<p>È possibile incorporare un videoclip, una foto di un prodotto e un paragrafo di testo con una sola chiamata API, e tutti finiranno nella stessa zona semantica.</p>
<p>Prima di modelli come questo, era necessario far passare ogni modalità attraverso il proprio modello specialistico e poi memorizzare ogni risultato in una colonna vettoriale separata. Le colonne multivettore nei database vettoriali come <a href="https://milvus.io/docs/multi-vector-search.md">Milvus</a> sono state create proprio per questi scenari.</p>
<p>Con Gemini Embedding 2, che mappa più modalità allo stesso tempo, sorge una domanda: in che misura Gemini Embedding 2 è in grado di sostituire le colonne multivettoriali e in che cosa non è all'altezza? Questo post illustra le caratteristiche di ciascun approccio e il loro funzionamento congiunto.</p>
<h2 id="What’s-Different-About-Gemini-Embedding-2-When-Compared-to-CLIPCLAP" class="common-anchor-header">Le differenze di Gemini Embedding 2 rispetto a CLIP/CLAP<button data-href="#What’s-Different-About-Gemini-Embedding-2-When-Compared-to-CLIPCLAP" class="anchor-icon" translate="no">
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
    </button></h2><p>I modelli di embedding convertono i dati non strutturati in vettori densi, in modo che gli elementi semanticamente simili si raggruppino nello spazio vettoriale. Ciò che rende Gemini Embedding 2 diverso è che lo fa in modo nativo tra le varie modalità, senza modelli separati e senza pipeline di stitching.</p>
<p>Fino a oggi, gli embedding multimodali implicavano modelli a doppio codificatore addestrati con l'apprendimento contrastivo: <a href="https://openai.com/index/clip/">CLIP</a> per le immagini-testo, <a href="https://arxiv.org/abs/2211.06687">CLAP</a> per l'audio-testo, ciascuno dei quali gestisce esattamente due modalità. Se servivano tutte e tre, si eseguivano più modelli e si coordinavano i loro spazi di incorporamento.</p>
<p>Per esempio, indicizzare un podcast con la copertina significava eseguire CLIP per l'immagine, CLAP per l'audio e un codificatore di testo per la trascrizione: tre modelli, tre spazi vettoriali e una logica di fusione personalizzata per rendere i loro punteggi comparabili al momento dell'interrogazione.</p>
<p>Invece, secondo l'<a href="https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-embedding-2/">annuncio ufficiale di Google</a>, ecco cosa supporta Gemini Embedding 2:</p>
<ul>
<li><strong>Testo</strong> fino a 8.192 token per richiesta</li>
<li><strong>Immagini</strong> fino a 6 per richiesta (PNG, JPEG)</li>
<li><strong>Video</strong> fino a 120 secondi (MP4, MOV)</li>
<li><strong>Audio</strong> fino a 80 secondi, incorporato nativamente senza trascrizione ASR</li>
<li><strong>Documenti</strong> in ingresso PDF, fino a 6 pagine</li>
</ul>
<p>Immagine<strong>di input mista</strong> + testo insieme in un'unica chiamata di incorporamento</p>
<h3 id="Gemini-Embedding-2-vs-CLIPCLAP-One-Model-vs-Many-for-Multimodal-Embeddings" class="common-anchor-header">Gemini Embedding 2 vs. CLIP/CLAP Un modello vs. molti per l'embedding multimodale</h3><table>
<thead>
<tr><th></th><th><strong>Doppio codificatore (CLIP, CLAP)</strong></th><th><strong>Incorporazione Gemini 2</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Modalità per modello</strong></td><td>2 (ad esempio, immagine + testo)</td><td>5 (testo, immagine, video, audio, PDF)</td></tr>
<tr><td><strong>Aggiunta di una nuova modalità</strong></td><td>Si aggiunge un altro modello e si allineano gli spazi manualmente</td><td>Già incluso - una sola chiamata API</td></tr>
<tr><td><strong>Input cross-modale</strong></td><td>Codificatori separati, chiamate separate</td><td>Input interlacciato (ad esempio, immagine + testo in un'unica richiesta)</td></tr>
<tr><td><strong>Architettura</strong></td><td>Codificatori visivi e testuali separati allineati tramite perdita contrastiva</td><td>Modello singolo che eredita la comprensione multimodale da Gemini</td></tr>
</tbody>
</table>
<h2 id="Gemini-Embedding-2’s-Advantage-Pipeline-Simplification" class="common-anchor-header">Il vantaggio di Gemini Embedding 2: Semplificazione della pipeline<button data-href="#Gemini-Embedding-2’s-Advantage-Pipeline-Simplification" class="anchor-icon" translate="no">
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
    </button></h2><p>Prendiamo uno scenario comune: costruire un motore di ricerca semantico su una breve videoteca. Ogni clip presenta fotogrammi visivi, audio parlato e testo dei sottotitoli, che descrivono lo stesso contenuto.</p>
<p><strong>Prima di Gemini Embedding 2</strong>, erano necessari tre modelli di embedding separati (immagine, audio, testo), tre colonne vettoriali e una pipeline di recupero che eseguisse il richiamo a più vie, la fusione dei risultati e la deduplicazione. Si tratta di un sacco di parti mobili da costruire e mantenere.</p>
<p><strong>Ora</strong> è possibile inserire i fotogrammi, l'audio e i sottotitoli del video in un'unica chiamata API e ottenere un vettore unificato che cattura l'intero quadro semantico.</p>
<p>Naturalmente, si è tentati di concludere che le colonne multivettore sono morte. Ma questa conclusione confonde la "rappresentazione unificata multimodale" con il "recupero vettoriale multidimensionale". Risolvono problemi diversi e capire la differenza è importante per scegliere l'approccio giusto.</p>
<h2 id="What-is-Multi-Vector-Search-in-Milvus" class="common-anchor-header">Che cos'è la ricerca multivettoriale in Milvus?<button data-href="#What-is-Multi-Vector-Search-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>In <a href="http://milvus.io">Milvus</a>, la ricerca multivettoriale consiste nel cercare lo stesso oggetto in più campi vettoriali contemporaneamente e poi combinare i risultati con un reranking.</p>
<p>L'idea di base è che un singolo oggetto spesso ha più di un tipo di significato. Un prodotto ha un titolo <em>e una</em> descrizione. Un post sui social media ha una didascalia <em>e un'</em> immagine. Ogni angolo racconta qualcosa di diverso, quindi ognuno ha un proprio campo vettoriale.</p>
<p>Milvus cerca ogni campo vettoriale in modo indipendente, poi unisce gli insiemi candidati usando un reranker. Nell'API, ogni richiesta corrisponde a un campo e a una configurazione di ricerca diversi e hybrid_search() restituisce il risultato combinato.</p>
<p>Due modelli comuni dipendono da questo:</p>
<ul>
<li><strong>Ricerca vettoriale sparsa e densa.</strong> Avete un catalogo di prodotti in cui gli utenti digitano query come "Nike Air Max rosse taglia 10". I vettori densi colgono l'intento semantico ("scarpe da corsa, rosse, Nike"), ma non la taglia esatta. I vettori sparsi, tramite <a href="https://milvus.io/docs/full-text-search.md">BM25</a> o modelli come <a href="https://milvus.io/docs/full_text_search_with_milvus.md">BGE-M3</a>, centrano la corrispondenza con la parola chiave. È necessario che entrambi vengano eseguiti in parallelo e poi riclassificati, perché nessuno dei due da solo fornisce buoni risultati per le query che combinano il linguaggio naturale con identificatori specifici come SKU, nomi di file o codici di errore.</li>
<li><strong>Ricerca vettoriale multimodale.</strong> Un utente carica la foto di un vestito e scrive "qualcosa di simile ma in blu". Si cerca simultaneamente nella colonna di incorporazione dell'immagine per la somiglianza visiva e nella colonna di incorporazione del testo per il vincolo del colore. Ogni colonna ha il proprio indice e modello - <a href="https://openai.com/index/clip/">CLIP</a> per l'immagine, un codificatore di testo per la descrizione - e i risultati vengono uniti.</li>
</ul>
<p><a href="https://milvus.io/">Milvus</a> esegue entrambi i modelli come <a href="https://milvus.io/docs/multi-vector-search.md">ricerche ANN</a> parallele con reranking nativo tramite RRFRanker. La definizione dello schema, la configurazione di più indici e il BM25 integrato sono gestiti in un unico sistema.</p>
<p>Ad esempio, si consideri un catalogo di prodotti in cui ogni articolo include una descrizione testuale e un'immagine. È possibile eseguire tre ricerche in parallelo su questi dati:</p>
<ul>
<li><strong>Ricerca semantica del testo.</strong> Interrogare la descrizione del testo con vettori densi generati da modelli come <a href="https://zilliz.com/learn/explore-colbert-token-level-embedding-and-ranking-model-for-similarity-search?_gl=1*d243m9*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#A-Quick-Recap-of-BERT">BERT</a>, <a href="https://zilliz.com/learn/NLP-essentials-understanding-transformers-in-AI?_gl=1*d243m9*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.">Transformers</a> o l'API <a href="https://zilliz.com/learn/guide-to-using-openai-text-embedding-models">OpenAI</a> embeddings.</li>
<li><strong>Ricerca full-text.</strong> Interrogazione della descrizione del testo con vettori radi utilizzando <a href="https://zilliz.com/learn/mastering-bm25-a-deep-dive-into-the-algorithm-and-application-in-milvus">BM25</a> o modelli di embedding radi come <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings?_gl=1*1cde1oq*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#BGE-M3">BGE-M3</a> o <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings?_gl=1*ov2die*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#SPLADE">SPLADE</a>.</li>
<li><strong>Ricerca cross-modale di immagini.</strong> Interrogazione di immagini di prodotti utilizzando una query di testo, con vettori densi da un modello come <a href="https://zilliz.com/learn/exploring-openai-clip-the-future-of-multimodal-ai-learning">CLIP</a>.</li>
</ul>
<h2 id="With-Gemini-Embedding-2-Will-Multi-Vector-Search-Still-Matter" class="common-anchor-header">Con Gemini Embedding 2, la ricerca multivettoriale è ancora importante?<button data-href="#With-Gemini-Embedding-2-Will-Multi-Vector-Search-Still-Matter" class="anchor-icon" translate="no">
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
    </button></h2><p>Gemini Embedding 2 gestisce più modalità in un'unica chiamata, semplificando notevolmente le pipeline. Ma un embedding multimodale unificato non è la stessa cosa di un recupero multivettoriale. In altre parole, sì, la ricerca multivettoriale sarà ancora importante.</p>
<p>Gemini Embedding 2 mappa testo, immagini, video, audio e documenti in un unico spazio vettoriale condiviso. Google <a href="https://developers.googleblog.com/en/gemini-embedding-model-now-available/">lo posiziona</a> per la ricerca semantica multimodale, il reperimento di documenti e la raccomandazione - scenari in cui tutte le modalità descrivono lo stesso contenuto e l'elevata sovrapposizione cross-modale rende praticabile un unico vettore.</p>
<p><a href="https://milvus.io/docs/multi-vector-search.md">La</a> ricerca multivettoriale<a href="https://milvus.io/docs/multi-vector-search.md">di Milvus</a> risolve un problema diverso. È un modo per cercare lo stesso oggetto attraverso <strong>più campi vettoriali -</strong>per esempio, titolo e descrizione, o testo e immagine - e poi combinare questi segnali durante il recupero. In altre parole, si tratta di preservare e interrogare <strong>più viste semantiche</strong> dello stesso oggetto, non solo di comprimere tutto in un'unica rappresentazione.</p>
<p>Ma i dati del mondo reale raramente si adattano a un unico incorporamento. I sistemi biometrici, il reperimento di strumenti agenziali e il commercio elettronico a intenzioni miste dipendono tutti da vettori che vivono in spazi semantici completamente diversi. È proprio qui che un'incorporazione unificata smette di funzionare.</p>
<h3 id="Why-One-Embedding-Isnt-Enough-Multi-Vector-Retrieval-in-Practice" class="common-anchor-header">Perché un'incorporazione non è sufficiente: Recupero multivettoriale nella pratica</h3><p>Gemini Embedding 2 gestisce il caso in cui tutte le modalità descrivono la stessa cosa. La ricerca multivettoriale gestisce tutto il resto, e "tutto il resto" comprende la maggior parte dei sistemi di recupero in produzione.</p>
<p><strong>Biometria.</strong> Un singolo utente dispone di vettori di volto, impronta vocale, impronta digitale e iride. Questi descrivono caratteristiche biologiche completamente indipendenti con zero sovrapposizioni semantiche. Non è possibile riunirli in un unico vettore: ognuno ha bisogno di una colonna, di un indice e di una metrica di somiglianza propri.</p>
<p><strong>Strumenti agenziali.</strong> Un assistente di codifica come OpenClaw memorizza vettori semantici densi per la cronologia delle conversazioni ("quel problema di implementazione della settimana scorsa") accanto a vettori BM25 più radi per la corrispondenza esatta di nomi di file, comandi CLI e parametri di configurazione. Obiettivi di recupero diversi, tipi di vettori diversi, percorsi di ricerca indipendenti, poi riordinati.</p>
<p><strong>Commercio elettronico con intenti misti.</strong> Il video promozionale di un prodotto e le immagini dei dettagli funzionano bene come embedding Gemini unificato. Ma quando un utente vuole "abiti che assomigliano a questo" <em>e</em> "stesso tessuto, taglia M", sono necessarie una colonna di similarità visiva e una colonna di attributi strutturati con indici separati e un livello di recupero ibrido.</p>
<h2 id="When-to-Use-Gemini-Embedding-2-vs-Multi-vector-Columns" class="common-anchor-header">Quando utilizzare l'incorporazione Gemini 2 rispetto alle colonne multivettore<button data-href="#When-to-Use-Gemini-Embedding-2-vs-Multi-vector-Columns" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th><strong>Scenario</strong></th><th><strong>Cosa usare</strong></th><th><strong>Perché</strong></th></tr>
</thead>
<tbody>
<tr><td>Tutte le modalità descrivono lo stesso contenuto (fotogrammi video + audio + sottotitoli)</td><td>Gemini Embedding 2 vettore unificato</td><td>L'elevata sovrapposizione semantica significa che un vettore cattura l'immagine completa - non è necessaria la fusione</td></tr>
<tr><td>È necessaria la precisione delle parole chiave insieme al richiamo semantico (BM25 + denso)</td><td>Colonne multivettore con hybrid_search()</td><td>I vettori sparsi e densi servono a obiettivi di ricerca diversi che non possono essere racchiusi in un unico embedding.</td></tr>
<tr><td>La ricerca cross-modale è il caso d'uso principale (query di testo → risultati di immagini)</td><td>Incorporamento Gemini 2 vettore unificato</td><td>Un unico spazio condiviso rende nativa la similarità cross-modale</td></tr>
<tr><td>I vettori vivono in spazi semantici fondamentalmente diversi (biometria, attributi strutturati)</td><td>Colonne multivettore con indici per campo</td><td>Metriche di similarità e tipi di indici indipendenti per campo vettoriale</td></tr>
<tr><td>Si desidera la semplicità della pipeline <em>e il</em> reperimento a grana fine</td><td>Entrambi - vettore Gemini unificato + colonne sparse o attributi aggiuntivi nella stessa collezione</td><td>Gemini gestisce la colonna multimodale; Milvus gestisce il livello di reperimento ibrido intorno ad essa</td></tr>
</tbody>
</table>
<p>Questi due approcci non si escludono a vicenda. È possibile utilizzare Gemini Embedding 2 per la colonna multimodale unificata e memorizzare altri vettori sparsi o specifici per gli attributi in colonne separate all'interno della stessa raccolta <a href="https://milvus.io/">Milvus</a>.</p>
<h2 id="Quick-Start-Set-Up-Gemini-Embedding-2-+-Milvus" class="common-anchor-header">Avvio rapido: Configurazione di Gemini Embedding 2 + Milvus<button data-href="#Quick-Start-Set-Up-Gemini-Embedding-2-+-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Ecco una demo funzionante. È necessaria un'<a href="https://milvus.io/docs/install-overview.md">istanza Milvus o Zilliz Cloud</a> funzionante e una GOOGLE_API_KEY.</p>
<h3 id="Setup" class="common-anchor-header">Impostazione</h3><pre><code translate="no">pip install google-genai pymilvus
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">GOOGLE_API_KEY</span>=<span class="hljs-string">&quot;your-api-key&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Full-Example" class="common-anchor-header">Esempio completo</h3><pre><code translate="no"><span class="hljs-string">&quot;&quot;&quot;
Prerequisites:
    pip install google-genai pymilvus

Set environment variable:
    export GOOGLE_API_KEY=&quot;your-api-key&quot;
&quot;&quot;&quot;</span>

<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> struct
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> google <span class="hljs-keyword">import</span> genai
<span class="hljs-keyword">from</span> google.genai <span class="hljs-keyword">import</span> types
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

<span class="hljs-comment"># ── Config ───────────────────────────────────────────────────────────────</span>
COLLECTION_NAME = <span class="hljs-string">&quot;gemini_multimodal_demo&quot;</span>
MILVUS_URI = <span class="hljs-string">&quot;http://localhost:19530&quot;</span>  <span class="hljs-comment"># Change to your Milvus address</span>
DIM = <span class="hljs-number">3072</span>  <span class="hljs-comment"># gemini-embedding-2-preview output dimension</span>
GEMINI_MODEL = <span class="hljs-string">&quot;gemini-embedding-2-preview&quot;</span>

<span class="hljs-comment"># ── Initialize clients ──────────────────────────────────────────────────</span>
gemini_client = genai.Client()  <span class="hljs-comment"># Uses GOOGLE_API_KEY env var</span>
milvus_client = MilvusClient(MILVUS_URI)

<span class="hljs-comment"># ── Helper: generate embedding ──────────────────────────────────────────</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_texts</span>(<span class="hljs-params">texts: <span class="hljs-built_in">list</span>[<span class="hljs-built_in">str</span>], task_type: <span class="hljs-built_in">str</span> = <span class="hljs-string">&quot;SEMANTIC_SIMILARITY&quot;</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]]:
    <span class="hljs-string">&quot;&quot;&quot;Embed a list of text strings.&quot;&quot;&quot;</span>
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=texts,
        config=types.EmbedContentConfig(task_type=task_type),
    )
    <span class="hljs-keyword">return</span> [e.values <span class="hljs-keyword">for</span> e <span class="hljs-keyword">in</span> result.embeddings]

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_image</span>(<span class="hljs-params">image_path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Embed an image file.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(image_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> f:
        image_bytes = f.read()
    mime = <span class="hljs-string">&quot;image/png&quot;</span> <span class="hljs-keyword">if</span> image_path.endswith(<span class="hljs-string">&quot;.png&quot;</span>) <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;image/jpeg&quot;</span>
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=types.Part.from_bytes(data=image_bytes, mime_type=mime),
    )
    <span class="hljs-keyword">return</span> result.embeddings[<span class="hljs-number">0</span>].values

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_audio</span>(<span class="hljs-params">audio_path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Embed an audio file.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(audio_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> f:
        audio_bytes = f.read()
    mime_map = {<span class="hljs-string">&quot;.mp3&quot;</span>: <span class="hljs-string">&quot;audio/mpeg&quot;</span>, <span class="hljs-string">&quot;.wav&quot;</span>: <span class="hljs-string">&quot;audio/wav&quot;</span>, <span class="hljs-string">&quot;.flac&quot;</span>: <span class="hljs-string">&quot;audio/flac&quot;</span>}
    ext = os.path.splitext(audio_path)[<span class="hljs-number">1</span>].lower()
    mime = mime_map.get(ext, <span class="hljs-string">&quot;audio/mpeg&quot;</span>)
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=types.Part.from_bytes(data=audio_bytes, mime_type=mime),
    )
    <span class="hljs-keyword">return</span> result.embeddings[<span class="hljs-number">0</span>].values

<span class="hljs-comment"># ── 1. Create Milvus collection ─────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=== Creating collection ===&quot;</span>)
<span class="hljs-keyword">if</span> milvus_client.has_collection(COLLECTION_NAME):
    milvus_client.drop_collection(COLLECTION_NAME)

schema = milvus_client.create_schema()
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;content&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>)   <span class="hljs-comment"># description of the content</span>
schema.add_field(<span class="hljs-string">&quot;modality&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">20</span>)    <span class="hljs-comment"># &quot;text&quot;, &quot;image&quot;, &quot;audio&quot;</span>
schema.add_field(<span class="hljs-string">&quot;vector&quot;</span>, DataType.FLOAT_VECTOR, dim=DIM)

index_params = milvus_client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
)

milvus_client.create_collection(
    COLLECTION_NAME,
    schema=schema,
    index_params=index_params,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created (dim=<span class="hljs-subst">{DIM}</span>, metric=COSINE)&quot;</span>)

<span class="hljs-comment"># ── 2. Insert text embeddings ───────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Inserting text embeddings ===&quot;</span>)
documents = [
    <span class="hljs-string">&quot;Artificial intelligence was founded as an academic discipline in 1956.&quot;</span>,
    <span class="hljs-string">&quot;The Mona Lisa is a half-length portrait painting by Leonardo da Vinci.&quot;</span>,
    <span class="hljs-string">&quot;Beethoven&#x27;s Symphony No. 9 premiered in Vienna on May 7, 1824.&quot;</span>,
    <span class="hljs-string">&quot;The Great Wall of China stretches over 13,000 miles across northern China.&quot;</span>,
    <span class="hljs-string">&quot;Jazz music originated in the African-American communities of New Orleans.&quot;</span>,
    <span class="hljs-string">&quot;The Hubble Space Telescope was launched into orbit on April 24, 1990.&quot;</span>,
    <span class="hljs-string">&quot;Vincent van Gogh painted The Starry Night while in an asylum in Saint-Rémy.&quot;</span>,
    <span class="hljs-string">&quot;Machine learning is a subset of AI focused on learning from data.&quot;</span>,
]

text_vectors = embed_texts(documents)
text_rows = [
    {<span class="hljs-string">&quot;content&quot;</span>: doc, <span class="hljs-string">&quot;modality&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>: vec}
    <span class="hljs-keyword">for</span> doc, vec <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(documents, text_vectors)
]
milvus_client.insert(COLLECTION_NAME, text_rows)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted <span class="hljs-subst">{<span class="hljs-built_in">len</span>(text_rows)}</span> text documents&quot;</span>)

<span class="hljs-comment"># ── 3. (Optional) Insert image embeddings ───────────────────────────────</span>
<span class="hljs-comment"># Uncomment and provide real image paths to test multimodal search</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># image_files = [</span>
<span class="hljs-comment">#     (&quot;photo of the Mona Lisa painting&quot;, &quot;mona_lisa.jpg&quot;),</span>
<span class="hljs-comment">#     (&quot;satellite photo of the Great Wall of China&quot;, &quot;great_wall.png&quot;),</span>
<span class="hljs-comment"># ]</span>
<span class="hljs-comment"># for desc, path in image_files:</span>
<span class="hljs-comment">#     if os.path.exists(path):</span>
<span class="hljs-comment">#         vec = embed_image(path)</span>
<span class="hljs-comment">#         milvus_client.insert(COLLECTION_NAME, [</span>
<span class="hljs-comment">#             {&quot;content&quot;: desc, &quot;modality&quot;: &quot;image&quot;, &quot;vector&quot;: vec}</span>
<span class="hljs-comment">#         ])</span>
<span class="hljs-comment">#         print(f&quot;Inserted image: {desc}&quot;)</span>

<span class="hljs-comment"># ── 4. (Optional) Insert audio embeddings ───────────────────────────────</span>
<span class="hljs-comment"># Uncomment and provide real audio paths to test multimodal search</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># audio_files = [</span>
<span class="hljs-comment">#     (&quot;Beethoven Symphony No.9 excerpt&quot;, &quot;beethoven_9.mp3&quot;),</span>
<span class="hljs-comment">#     (&quot;jazz piano improvisation&quot;, &quot;jazz_piano.mp3&quot;),</span>
<span class="hljs-comment"># ]</span>
<span class="hljs-comment"># for desc, path in audio_files:</span>
<span class="hljs-comment">#     if os.path.exists(path):</span>
<span class="hljs-comment">#         vec = embed_audio(path)</span>
<span class="hljs-comment">#         milvus_client.insert(COLLECTION_NAME, [</span>
<span class="hljs-comment">#             {&quot;content&quot;: desc, &quot;modality&quot;: &quot;audio&quot;, &quot;vector&quot;: vec}</span>
<span class="hljs-comment">#         ])</span>
<span class="hljs-comment">#         print(f&quot;Inserted audio: {desc}&quot;)</span>

<span class="hljs-comment"># ── 5. Search ────────────────────────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Searching ===&quot;</span>)

queries = [
    <span class="hljs-string">&quot;history of artificial intelligence&quot;</span>,
    <span class="hljs-string">&quot;famous Renaissance paintings&quot;</span>,
    <span class="hljs-string">&quot;classical music concerts&quot;</span>,
]

query_vectors = embed_texts(queries, task_type=<span class="hljs-string">&quot;SEMANTIC_SIMILARITY&quot;</span>)

<span class="hljs-keyword">for</span> query_text, query_vec <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(queries, query_vectors):
    results = milvus_client.search(
        COLLECTION_NAME,
        data=[query_vec],
        limit=<span class="hljs-number">3</span>,
        output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;modality&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    )
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nQuery: &#x27;<span class="hljs-subst">{query_text}</span>&#x27;&quot;</span>)
    <span class="hljs-keyword">for</span> hits <span class="hljs-keyword">in</span> results:
        <span class="hljs-keyword">for</span> rank, hit <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(hits, <span class="hljs-number">1</span>):
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  [<span class="hljs-subst">{rank}</span>] (score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, modality=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;modality&#x27;</span>]}</span>) &quot;</span>
                  <span class="hljs-string">f&quot;<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">80</span>]}</span>&quot;</span>)

<span class="hljs-comment"># ── 6. Cross-modal search example (image query -&gt; text results) ─────────</span>
<span class="hljs-comment"># Uncomment to search text collection using an image as query</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># print(&quot;\n=== Cross-modal search: image -&gt; text ===&quot;)</span>
<span class="hljs-comment"># query_image_vec = embed_image(&quot;query_image.jpg&quot;)</span>
<span class="hljs-comment"># results = milvus_client.search(</span>
<span class="hljs-comment">#     COLLECTION_NAME,</span>
<span class="hljs-comment">#     data=[query_image_vec],</span>
<span class="hljs-comment">#     limit=3,</span>
<span class="hljs-comment">#     output_fields=[&quot;content&quot;, &quot;modality&quot;],</span>
<span class="hljs-comment">#     search_params={&quot;metric_type&quot;: &quot;COSINE&quot;},</span>
<span class="hljs-comment"># )</span>
<span class="hljs-comment"># for hits in results:</span>
<span class="hljs-comment">#     for rank, hit in enumerate(hits, 1):</span>
<span class="hljs-comment">#         print(f&quot;  [{rank}] (score={hit[&#x27;distance&#x27;]:.4f}) {hit[&#x27;entity&#x27;][&#x27;content&#x27;][:80]}&quot;)</span>

<span class="hljs-comment"># ── Cleanup ──────────────────────────────────────────────────────────────</span>
<span class="hljs-comment"># milvus_client.drop_collection(COLLECTION_NAME)</span>
<span class="hljs-comment"># print(f&quot;\nCollection &#x27;{COLLECTION_NAME}&#x27; dropped&quot;)</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nDone!&quot;</span>)

<button class="copy-code-btn"></button></code></pre>
<p>Per le incorporazioni di immagini e audio, utilizzare embed_image() e embed_audio() allo stesso modo: i vettori finiscono nella stessa collezione e nello stesso spazio vettoriale, consentendo una vera ricerca cross-modale.</p>
<h2 id="Gemini-Embedding-2-Will-be-Available-in-MilvusZilliz-Cloud-Soon" class="common-anchor-header">Gemini Embedding 2 sarà presto disponibile in Milvus/Zilliz Cloud<button data-href="#Gemini-Embedding-2-Will-be-Available-in-MilvusZilliz-Cloud-Soon" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a> sta per lanciare un'integrazione profonda con Gemini Embedding 2 attraverso la funzione <a href="https://milvus.io/docs/embeddings.md">Embedding Function</a>. Una volta disponibile, non sarà più necessario chiamare manualmente le API di embedding. Milvus evocherà automaticamente il modello (che supporta OpenAI, AWS Bedrock, Google Vertex AI e altri ancora) per vettorializzare i dati grezzi in inserimento e le query in ricerca.</p>
<p>Ciò significa che si ottiene un embedding multimodale unificato da Gemini dove è opportuno, e il toolkit multivettoriale completo di Milvus - ricerca ibrida sparsa e densa, schemi multi-indice, reranking - dove è necessario un controllo a grana fine.</p>
<p>Volete provarlo? Iniziate con il <a href="https://milvus.io/docs/quickstart.md">quickstart di Milvus</a> ed eseguite la demo qui sopra, oppure consultate la <a href="https://milvus.io/docs/hybrid_search_with_milvus.md">guida alla ricerca ibrida</a> per la configurazione completa del multivettore con BGE-M3. Portate le vostre domande su <a href="https://milvus.io/discord">Discord</a> o negli <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour">orari di ufficio di Milvus</a>.</p>
<h2 id="Keep-Reading" class="common-anchor-header">Continua a leggere<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Introduzione alla funzione Embedding: Come Milvus 2.6 semplifica la vettorializzazione e la ricerca semantica - Milvus Blog</a></li>
<li><a href="https://milvus.io/docs/multi-vector-search.md">Ricerca ibrida multivettoriale</a></li>
<li><a href="https://milvus.io/docs/embeddings.md">Documenti sulla funzione di incorporamento di Milvus</a></li>
</ul>
