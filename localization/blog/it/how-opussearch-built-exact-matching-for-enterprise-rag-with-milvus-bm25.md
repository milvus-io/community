---
id: how-opussearch-built-exact-matching-for-enterprise-rag-with-milvus-bm25.md
title: >-
  Come OpusSearch ha costruito l'Exact Matching per il RAG aziendale con Milvus
  BM25
author: Chronos Kou
date: 2025-10-17T00:00:00.000Z
cover: assets.zilliz.com/opus_cover_new_1505263938.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, enterprise RAG, vector database, semantic search'
meta_title: How OpusSearch Built Exact Matching for Enterprise RAG with Milvus
desc: >-
  Scoprite come OpusSearch utilizza Milvus BM25 per alimentare la corrispondenza
  esatta nei sistemi RAG aziendali, combinando la ricerca semantica con il
  recupero preciso delle parole chiave.
origin: >-
  https://medium.com/opus-engineering/how-opussearch-built-exact-matching-for-enterprise-rag-with-milvus-bm25-aa1098a9888b
---
<p>Questo post è stato pubblicato originariamente su <a href="https://medium.com/opus-engineering/how-opussearch-built-exact-matching-for-enterprise-rag-with-milvus-bm25-aa1098a9888b">Medium</a> e viene ripubblicato qui con l'autorizzazione.</p>
<h2 id="The-Semantic-Search-Blind-Spot" class="common-anchor-header">Il punto cieco della ricerca semantica<button data-href="#The-Semantic-Search-Blind-Spot" class="anchor-icon" translate="no">
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
    </button></h2><p>Immaginate questo: Siete un editore video in scadenza. Hai bisogno di clip dall'"episodio 281" del tuo podcast. Lo digitate nella nostra ricerca. La nostra ricerca semantica basata sull'intelligenza artificiale, orgogliosa della sua intelligenza, restituisce clip da 280, 282 e suggerisce persino l'episodio 218 perché i numeri sono simili, giusto?</p>
<p><strong>Sbagliato</strong>.</p>
<p>Quando abbiamo lanciato <a href="https://www.opus.pro/opussearch">OpusSearch</a> per le aziende nel gennaio 2025, pensavamo che la ricerca semantica fosse sufficiente. Query in linguaggio naturale come "trova momenti divertenti sugli appuntamenti" funzionavano benissimo. Il nostro sistema RAG <a href="https://milvus.io/">, alimentato da Milvus,</a> stava andando alla grande.</p>
<p><strong>Ma poi la realtà ci ha colpito con il feedback degli utenti:</strong></p>
<p>"Voglio solo gli spezzoni dell'episodio 281. Perché è così difficile?".</p>
<p>"Quando cerco 'Questo è quello che ha detto', voglio ESATTAMENTE quella frase, non 'Questo è quello che voleva dire'".</p>
<p>È emerso che gli editor video e i ritagliatori non sempre vogliono che l'intelligenza artificiale sia intelligente. A volte vogliono che il software sia <strong>diretto e corretto</strong>.</p>
<h2 id="Why-do-we-care-about-Search" class="common-anchor-header">Perché ci interessa la ricerca?<button data-href="#Why-do-we-care-about-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Abbiamo creato una <a href="https://www.opus.pro/opussearch">funzione di ricerca aziendale</a> perché abbiamo capito che <strong>la monetizzazione di</strong> grandi cataloghi video è la sfida principale che le aziende devono affrontare. La nostra piattaforma alimentata da RAG è un <strong>agente di crescita</strong> che consente alle aziende di <strong>cercare, riutilizzare e monetizzare le loro intere librerie video</strong>. Leggete <a href="https://www.opus.pro/blog/growing-a-new-youtube-channel-in-90-days-without-creating-new-videos">qui</a> i casi di successo di <strong>All The Smoke</strong>, <strong>KFC Radio</strong> e <strong>TFTC</strong>.</p>
<h2 id="Why-We-Doubled-Down-on-Milvus-Instead-of-Adding-Another-Database" class="common-anchor-header">Perché abbiamo puntato su Milvus (invece di aggiungere un altro database)<button data-href="#Why-We-Doubled-Down-on-Milvus-Instead-of-Adding-Another-Database" class="anchor-icon" translate="no">
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
    </button></h2><p>La soluzione più ovvia era aggiungere Elasticsearch o MongoDB per la corrispondenza esatta. Tuttavia, in una startup, mantenere più sistemi di ricerca introduce un sovraccarico operativo e una complessità significativi.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Strong_community_adoption_with_35k_Git_Hub_stars_fbf773dcdb.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus aveva da poco lanciato la sua funzione di ricerca full-text e una valutazione con il nostro set di dati <strong>, senza alcuna messa a punto</strong>, ha mostrato vantaggi convincenti:</p>
<ul>
<li><p><strong>Accuratezza superiore delle corrispondenze parziali</strong>. Ad esempio "storia di bere" e "saltare in alto", altri DB vettoriali restituiscono a volte "storia di mangiare" e "saltare in alto", alterando il significato.</p></li>
<li><p>Milvus <strong>restituisce risultati più lunghi e completi</strong> di altri database quando le query sono generiche, il che è naturalmente più ideale per il nostro caso d'uso.</p></li>
</ul>
<h2 id="Architecture-from-5000-feet" class="common-anchor-header">Architettura da 5.000 piedi<button data-href="#Architecture-from-5000-feet" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/Milvus_is_the_foundational_vector_database_for_our_Enterprise_RAG_architecture_b3c8ebf39c.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="BM25-+-Filtering--Exact-Match-Magic" class="common-anchor-header">BM25 + Filtro = Magia della corrispondenza esatta<button data-href="#BM25-+-Filtering--Exact-Match-Magic" class="anchor-icon" translate="no">
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
    </button></h2><p>La ricerca full-text di Milvus non si basa sulla corrispondenza esatta, ma su un punteggio di pertinenza che utilizza il BM25<a href="https://en.wikipedia.org/wiki/Okapi_BM25">(Best Matching 25</a>), che calcola la pertinenza di un documento rispetto alla query. È ottimo per "trovarmi qualcosa di simile", ma pessimo per "trovarmi esattamente questo".</p>
<p>Abbiamo quindi <strong>combinato la potenza di BM25 con il filtro TEXT_MATCH di Milvus</strong>. Ecco come funziona:</p>
<ol>
<li><p><strong>Prima il filtro</strong>: TEXT_MATCH trova i documenti che contengono le vostre parole chiave esatte.</p></li>
<li><p><strong>Classifica in secondo luogo</strong>: BM25 ordina le corrispondenze esatte per rilevanza</p></li>
<li><p><strong>Vincere</strong>: si ottengono le corrispondenze esatte, classificate in modo intelligente.</p></li>
</ol>
<p>Vedetelo come un "datemi tutto ciò che contiene 'episodio 281', poi mostratemi prima i migliori".</p>
<h2 id="The-Code-That-Made-It-Work" class="common-anchor-header">Il codice che lo ha fatto funzionare<button data-href="#The-Code-That-Made-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Schema-Design" class="common-anchor-header">Schema di progettazione</h3><p><strong>Importante</strong>: abbiamo disabilitato completamente le stop words, poiché termini come "The Office" e "Office" rappresentano entità distinte nel nostro dominio di contenuti.</p>
<pre><code translate="no"><span class="hljs-built_in">export</span> <span class="hljs-keyword">function</span> getExactMatchFields(): FieldType[] {
 <span class="hljs-built_in">return</span> [
   {
     name: <span class="hljs-string">&quot;id&quot;</span>,
     data_type: DataType.VarChar,
     is_primary_key: <span class="hljs-literal">true</span>,
     max_length: 100,
   },
   {
     name: <span class="hljs-string">&quot;text&quot;</span>,
     data_type: DataType.VarChar,
     max_length: 1000,
     enable_analyzer: <span class="hljs-literal">true</span>,
     enable_match: <span class="hljs-literal">true</span>,  // This is the magic flag
     analyzer_params: {
       tokenizer: <span class="hljs-string">&#x27;standard&#x27;</span>,
       filter: [
         <span class="hljs-string">&#x27;lowercase&#x27;</span>,
         {
           <span class="hljs-built_in">type</span>: <span class="hljs-string">&#x27;stemmer&#x27;</span>,
           language: <span class="hljs-string">&#x27;english&#x27;</span>,  // <span class="hljs-string">&quot;running&quot;</span> matches <span class="hljs-string">&quot;run&quot;</span>
         },
         {
           <span class="hljs-built_in">type</span>: <span class="hljs-string">&#x27;stop&#x27;</span>,
           stop_words: [],  // Keep ALL words (even <span class="hljs-string">&quot;the&quot;</span>, <span class="hljs-string">&quot;a&quot;</span>)
         },
       ],
     },
   },
   {
     name: <span class="hljs-string">&quot;sparse_vector&quot;</span>,
     data_type: DataType.SparseFloatVector,
   },
 ]
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="BM25-Function-Setup" class="common-anchor-header">Impostazione della funzione BM25</h3><pre><code translate="no"><span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> <span class="hljs-attr">FUNCTIONS</span>: <span class="hljs-title class_">FunctionObject</span>[] = [
 {
   <span class="hljs-attr">name</span>: <span class="hljs-string">&#x27;text_bm25_embedding&#x27;</span>,
   <span class="hljs-attr">type</span>: <span class="hljs-title class_">FunctionType</span>.<span class="hljs-property">BM25</span>,
   <span class="hljs-attr">input_field_names</span>: [<span class="hljs-string">&#x27;text&#x27;</span>],
   <span class="hljs-attr">output_field_names</span>: [<span class="hljs-string">&#x27;sparse_vector&#x27;</span>],
   <span class="hljs-attr">params</span>: {},
 },
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Index-Config" class="common-anchor-header">Configurazione dell'indice</h3><p>I parametri bm25_k1 e bm25_b sono stati messi a punto sulla base del nostro set di dati di produzione per ottenere prestazioni ottimali.</p>
<p><strong>bm25_k1</strong>: valori più alti (fino a ~2,0) danno maggior peso alle occorrenze ripetute dei termini, mentre valori più bassi riducono l'impatto della frequenza dei termini dopo le prime occorrenze.</p>
<p><strong>bm25_b</strong>: I valori più vicini a 1,0 penalizzano fortemente i documenti più lunghi, mentre i valori più vicini a 0 ignorano completamente la lunghezza del documento.</p>
<pre><code translate="no">index_params: [
 {
   field_name: <span class="hljs-string">&#x27;sparse_vector&#x27;</span>,
   index_type: <span class="hljs-string">&#x27;SPARSE_INVERTED_INDEX&#x27;</span>,
   metric_type: <span class="hljs-string">&#x27;BM25&#x27;</span>,
   <span class="hljs-keyword">params</span>: {
     inverted_index_algo: <span class="hljs-string">&#x27;DAAT_MAXSCORE&#x27;</span>,
     bm25_k1: <span class="hljs-number">1.2</span>,  <span class="hljs-comment">// How much does term frequency matter?</span>
     bm25_b: <span class="hljs-number">0.75</span>,  <span class="hljs-comment">// How much does document length matter?</span>
   },
 },
],
<button class="copy-code-btn"></button></code></pre>
<h3 id="The-Search-Query-That-Started-Working" class="common-anchor-header">La query di ricerca che ha iniziato a funzionare</h3><pre><code translate="no"><span class="hljs-keyword">await</span> <span class="hljs-variable language_">this</span>.<span class="hljs-property">milvusClient</span>.<span class="hljs-title function_">search</span>({
 <span class="hljs-attr">collection_name</span>: <span class="hljs-string">&#x27;my_collection&#x27;</span>,
 <span class="hljs-attr">limit</span>: <span class="hljs-number">30</span>,
 <span class="hljs-attr">output_fields</span>: [<span class="hljs-string">&#x27;id&#x27;</span>, <span class="hljs-string">&#x27;text&#x27;</span>],
 <span class="hljs-attr">filter</span>: <span class="hljs-string">`TEXT_MATCH(text, &quot;episode 281&quot;)`</span>,  <span class="hljs-comment">// Exact match filter</span>
 <span class="hljs-attr">anns_field</span>: <span class="hljs-string">&#x27;sparse_vector&#x27;</span>,
 <span class="hljs-attr">data</span>: <span class="hljs-string">&#x27;episode 281&#x27;</span>,  <span class="hljs-comment">// BM25 ranking query</span>
})
<button class="copy-code-btn"></button></code></pre>
<p>Per le corrispondenze esatte tra più termini:</p>
<pre><code translate="no"><span class="hljs-built_in">filter</span>: `TEXT_MATCH(text, <span class="hljs-string">&quot;foo&quot;</span>) <span class="hljs-keyword">and</span> TEXT_MATCH(text, <span class="hljs-string">&quot;bar&quot;</span>)`
<button class="copy-code-btn"></button></code></pre>
<h2 id="The-Mistakes-We-Made-So-You-Don’t-Have-To" class="common-anchor-header">Gli errori che abbiamo commesso (così non dovrete farlo voi)<button data-href="#The-Mistakes-We-Made-So-You-Don’t-Have-To" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Dynamic-Fields-Critical-for-Production-Flexibility" class="common-anchor-header">Campi dinamici: Fondamentale per la flessibilità della produzione</h3><p>Inizialmente non abbiamo abilitato i campi dinamici, il che era problematico. Le modifiche allo schema richiedevano l'eliminazione e la ricreazione delle collezioni negli ambienti di produzione.</p>
<pre><code translate="no"><span class="hljs-keyword">await</span> <span class="hljs-variable language_">this</span>.<span class="hljs-property">milvusClient</span>.<span class="hljs-title function_">createCollection</span>({
 <span class="hljs-attr">collection_name</span>: collectionName,
 <span class="hljs-attr">fields</span>: fields,
 <span class="hljs-attr">enable_dynamic_field</span>: <span class="hljs-literal">true</span>,  <span class="hljs-comment">// DO THIS</span>
 <span class="hljs-comment">// ... rest of config</span>
})
<button class="copy-code-btn"></button></code></pre>
<h3 id="Collection-Design-Maintain-Clear-Separation-of-Concerns" class="common-anchor-header">Progettazione delle collezioni: Mantenere una chiara separazione delle preoccupazioni</h3><p>La nostra architettura utilizza collezioni dedicate per ogni dominio di funzionalità. Questo approccio modulare riduce al minimo l'impatto delle modifiche allo schema e migliora la manutenibilità.</p>
<h3 id="Memory-Usage-Optimize-with-MMAP" class="common-anchor-header">Utilizzo della memoria: Ottimizzare con MMAP</h3><p>Gli indici sparsi richiedono un'allocazione significativa di memoria. Per i grandi insiemi di dati testuali, si consiglia di configurare MMAP per utilizzare la memoria su disco. Questo approccio richiede un'adeguata capacità di I/O per mantenere le caratteristiche di prestazione.</p>
<pre><code translate="no"><span class="hljs-comment">// In your Milvus configuration</span>
<span class="hljs-attr">use_mmap</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Production-Impact-and-Results" class="common-anchor-header">Impatto e risultati della produzione<button data-href="#Production-Impact-and-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>Dopo l'implementazione della funzionalità di corrispondenza esatta nel giugno 2025, abbiamo osservato miglioramenti misurabili nelle metriche di soddisfazione degli utenti e una riduzione del volume di assistenza per i problemi legati alla ricerca. Il nostro approccio a doppia modalità consente la ricerca semantica per le query esplorative e fornisce al contempo una corrispondenza precisa per il recupero di contenuti specifici.</p>
<p>Il vantaggio architettonico principale è il mantenimento di un unico sistema di database che supporta entrambi i paradigmi di ricerca, riducendo la complessità operativa e ampliando al contempo le funzionalità.</p>
<h2 id="What’s-Next" class="common-anchor-header">Cosa succederà in futuro?<button data-href="#What’s-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Stiamo sperimentando <strong>query</strong> <strong>ibride</strong> <strong>che combinano la corrispondenza semantica e quella esatta in un'unica ricerca</strong>. Immaginate: "Trova clip divertenti dall'episodio 281", dove "divertente" utilizza la ricerca semantica e "episodio 281" la corrispondenza esatta.</p>
<p>Il futuro della ricerca non è scegliere tra AI semantica e corrispondenza esatta. È usare <strong>entrambe le cose</strong> in modo intelligente nello stesso sistema.</p>
