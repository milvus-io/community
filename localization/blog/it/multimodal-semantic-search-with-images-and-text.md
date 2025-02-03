---
id: multimodal-semantic-search-with-images-and-text.md
title: Ricerca semantica multimodale con immagini e testo
author: Stefan Webb
date: 2025-02-3
desc: >-
  Imparate a costruire un'applicazione di ricerca semantica utilizzando
  un'intelligenza artificiale multimodale che comprenda le relazioni
  testo-immagine, al di là della semplice corrispondenza delle parole chiave.
cover: >-
  assets.zilliz.com/Multimodal_Semantic_Search_with_Images_and_Text_180d89d5aa.png
tag: Engineering
tags: 'Milvus, Vector Database, Open Source, Semantic Search, Multimodal AI'
recommend: true
canonicalUrl: 'https://milvus.io/blog/multimodal-semantic-search-with-images-and-text.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Multimodal_Semantic_Search_with_Images_and_Text_180d89d5aa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Come esseri umani, interpretiamo il mondo attraverso i nostri sensi. Sentiamo suoni, vediamo immagini, video e testi, spesso sovrapposti. Comprendiamo il mondo attraverso queste modalità multiple e la relazione tra di esse. Affinché l'intelligenza artificiale possa davvero eguagliare o superare le capacità umane, deve sviluppare la stessa capacità di comprendere il mondo attraverso più lenti contemporaneamente.</p>
<p>In questo post e nel video che lo accompagna (in arrivo) e nel notebook, presenteremo le recenti scoperte di modelli in grado di elaborare insieme testo e immagini. Lo dimostreremo costruendo un'applicazione di ricerca semantica che va oltre la semplice corrispondenza delle parole chiave, comprendendo la relazione tra ciò che gli utenti chiedono e il contenuto visivo che stanno cercando.</p>
<p>Ciò che rende questo progetto particolarmente interessante è che è costruito interamente con strumenti open-source: il database vettoriale Milvus, le librerie di machine learning di HuggingFace e un set di dati di recensioni di clienti Amazon. È straordinario pensare che solo un decennio fa, costruire qualcosa di simile avrebbe richiesto notevoli risorse proprietarie. Oggi questi potenti componenti sono liberamente disponibili e possono essere combinati in modi innovativi da chiunque abbia la curiosità di sperimentare.</p>
<custom-h1>Panoramica</custom-h1><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/overview_97a124bc9a.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La nostra applicazione di ricerca multimodale è del tipo <em>retrieve-and-rerank.</em> Se avete familiarità con la <em>retrieval-augmented-generation</em> (RAG), è molto simile, solo che l'output finale è un elenco di immagini che sono state rerankizzate da un modello di visione linguistica di grandi dimensioni (LLVM). La query di ricerca dell'utente contiene sia testo che immagini e l'obiettivo è un insieme di immagini indicizzate in un database vettoriale. L'architettura prevede tre fasi - <em>indicizzazione</em>, <em>recupero</em> e <em>riclassificazione</em> (simile alla "generazione") - che riassumiamo di seguito.</p>
<h2 id="Indexing" class="common-anchor-header">Indicizzazione<button data-href="#Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>La nostra applicazione di ricerca deve avere qualcosa da cercare. Nel nostro caso, utilizziamo un piccolo sottoinsieme del dataset "Amazon Reviews 2023", che contiene sia testo che immagini di recensioni di clienti Amazon di tutti i tipi di prodotti. Si può immaginare che una ricerca semantica come quella che stiamo costruendo sia un'utile aggiunta a un sito web di commercio elettronico. Utilizziamo 900 immagini e scartiamo il testo, anche se osserviamo che questo notebook può raggiungere le dimensioni di produzione con il giusto database e le giuste implementazioni di inferenza.</p>
<p>Il primo elemento "magico" della nostra pipeline è la scelta del modello di incorporazione. Utilizziamo un modello multimodale di recente sviluppo, chiamato <a href="https://huggingface.co/BAAI/bge-visualized">Visualized BGE</a>, in grado di incorporare testo e immagini insieme, o separatamente, nello stesso spazio con un unico modello in cui i punti vicini sono semanticamente simili. Recentemente sono stati sviluppati altri modelli di questo tipo, come ad esempio <a href="https://github.com/google-deepmind/magiclens">MagicLens</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/indexing_1937241be5.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La figura sopra illustra: l'embedding per [un'immagine di un leone di lato] più il testo "vista frontale di questo", è vicino all'embedding per [un'immagine di un leone di fronte] senza testo. Lo stesso modello viene utilizzato sia per gli input con testo e immagine che per quelli con sola immagine (e per quelli con solo testo). <em>In questo modo, il modello è in grado di comprendere l'intento dell'utente nel modo in cui il testo della query si relaziona con l'immagine della query.</em></p>
<p>Abbiamo incorporato le nostre 900 immagini di prodotti senza il testo corrispondente e abbiamo memorizzato le incorporazioni in un database vettoriale utilizzando <a href="https://milvus.io/docs">Milvus</a>.</p>
<h2 id="Retrieval" class="common-anchor-header">Recupero<button data-href="#Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>Ora che il nostro database è stato costruito, possiamo servire una query all'utente. Immaginiamo che un utente si presenti con la domanda: "una custodia per telefono con questo" più [un'immagine di Leopard]. In altre parole, sta cercando custodie per telefoni con stampe leopardiane.</p>
<p>Si noti che il testo della query dell'utente diceva "questo" piuttosto che "una pelle di Leopardo". Il nostro modello di embedding deve essere in grado di collegare "questo" a ciò a cui si riferisce, il che è un'impresa impressionante dato che la precedente iterazione di modelli non era in grado di gestire istruzioni così aperte. Il <a href="https://arxiv.org/abs/2403.19651">documento MagicLens</a> fornisce ulteriori esempi.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Retrieval_ad64f48e49.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Incorporiamo il testo e l'immagine della query ed eseguiamo una ricerca di similarità nel nostro database vettoriale, restituendo i nove risultati migliori. I risultati sono mostrati nella figura qui sopra, insieme all'immagine del leopardo. Sembra che il primo risultato non sia il più rilevante per la query. Il settimo risultato sembra essere il più rilevante: si tratta di una cover per telefono con una stampa leopardata.</p>
<h2 id="Generation" class="common-anchor-header">Generazione<button data-href="#Generation" class="anchor-icon" translate="no">
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
    </button></h2><p>Sembra che la nostra ricerca sia fallita perché il primo risultato non è il più pertinente. Tuttavia, possiamo risolvere il problema con una fase di reranking. Forse conoscete il reranking degli elementi recuperati come una fase importante di molte pipeline RAG. Utilizziamo <a href="https://huggingface.co/microsoft/Phi-3-vision-128k-instruct">Phi-3 Vision</a> come modello di reranking.</p>
<p>Per prima cosa chiediamo a LLVM di generare una didascalia dell'immagine richiesta. L'LLVM produce:</p>
<p><em>"L'immagine mostra un primo piano del volto di un leopardo, con particolare attenzione alla sua pelliccia maculata e agli occhi verdi".</em></p>
<p>Quindi, dopo aver inserito questa didascalia, una singola immagine con i nove risultati e l'immagine di query, costruiamo un prompt testuale che chiede al modello di riordinare i risultati, fornendo la risposta sotto forma di elenco e motivando la scelta della corrispondenza migliore.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Generation_b016a6c26a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Il risultato è visualizzato nella figura qui sopra: l'elemento più pertinente è ora il top match e la motivazione fornita è:</p>
<p><em>"L'articolo più adatto è quello con il tema del leopardo, che corrisponde alla richiesta dell'utente di una custodia per telefono con un tema simile".</em></p>
<p>Il nostro re-ranker LLVM è stato in grado di eseguire la comprensione tra immagini e testo e di migliorare la rilevanza dei risultati della ricerca. <em>Un artefatto interessante è che il re-ranker ha fornito solo otto risultati e ne ha abbandonato uno, il che evidenzia la necessità di guardrail e di output strutturati.</em></p>
<h2 id="Summary" class="common-anchor-header">Sintesi<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>In questo post, nel video (in arrivo) e nel <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/multimodal_retrieval_amazon_reviews.ipynb">notebook</a> che lo accompagnano, abbiamo costruito un'applicazione per la ricerca semantica multimodale su testo e immagini. Il modello di embedding è stato in grado di incorporare testo e immagini congiuntamente o separatamente nello stesso spazio, mentre il modello di fondazione è stato in grado di inserire testo e immagini generando testo in risposta. <em>È importante notare che il modello di incorporazione è stato in grado di mettere in relazione l'intento dell'utente di un'istruzione aperta con l'immagine della query e di specificare in questo modo come l'utente voleva che i risultati si riferissero all'immagine inserita.</em></p>
<p>Questo è solo un assaggio di ciò che avverrà nel prossimo futuro. Vedremo molte applicazioni di ricerca multimodale, comprensione e ragionamento multimodale e così via attraverso diverse modalità: immagini, video, audio, molecole, social network, dati tabellari, serie temporali, il potenziale è illimitato.</p>
<p>Al centro di questi sistemi c'è un database vettoriale che costituisce la "memoria" esterna del sistema. Milvus è una scelta eccellente per questo scopo. È open-source, completo di tutte le funzionalità (si veda <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">questo articolo sulla ricerca full-text in Milvus 2.5</a>) e scala in modo efficiente fino a miliardi di vettori con un traffico su scala web e una latenza inferiore a 100ms. Per saperne di più consultate i <a href="https://milvus.io/docs">documenti di Milvus</a>, unitevi alla nostra comunità <a href="https://milvus.io/discord">Discord</a> e spero di vedervi al nostro prossimo <a href="https://lu.ma/unstructured-data-meetup">meetup sui dati non strutturati</a>. Fino ad allora!</p>
<h2 id="Resources" class="common-anchor-header">Risorse<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p>Appunti: <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/multimodal_retrieval_amazon_reviews.ipynb">"Ricerca multimodale con le recensioni di Amazon e LLVM Reranking</a>".</p></li>
<li><p>Video Youtube AWS Developers (in arrivo)</p></li>
<li><p><a href="https://milvus.io/docs">Documentazione di Milvus</a></p></li>
<li><p><a href="https://lu.ma/unstructured-data-meetup">Incontro sui dati non strutturati</a></p></li>
<li><p>Modello di incorporazione: <a href="https://huggingface.co/BAAI/bge-visualized">Scheda modello BGE visualizzata</a></p></li>
<li><p>Modello di incorporamento alternativo: <a href="https://github.com/google-deepmind/magiclens">Repo del modello MagicLens</a></p></li>
<li><p>LLVM: <a href="https://huggingface.co/microsoft/Phi-3-vision-128k-instruct">Scheda modello Phi-3 Vision</a></p></li>
<li><p>Documento: "<a href="https://arxiv.org/abs/2403.19651">MagicLens: recupero di immagini auto-supervisionato con istruzioni aperte</a>".</p></li>
<li><p>Set di dati: <a href="https://amazon-reviews-2023.github.io/">Recensioni Amazon 2023</a></p></li>
</ul>
