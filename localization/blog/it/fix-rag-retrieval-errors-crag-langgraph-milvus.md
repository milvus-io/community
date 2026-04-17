---
id: fix-rag-retrieval-errors-crag-langgraph-milvus.md
title: 'Correzione degli errori di recupero di RAG con CRAG, LangGraph e Milvus'
author: Min Yin
date: 2026-3-23
cover: assets.zilliz.com/cover_CRAG_a05dddbaa2_aafaad6bc0.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'CRAG, RAG retrieval, LangGraph, Milvus, hybrid retrieval'
meta_title: |
  Fix RAG Retrieval Errors with CRAG, LangGraph, and Milvus
desc: >-
  Elevata somiglianza ma risposte sbagliate? Scoprite come CRAG aggiunge la
  valutazione e la correzione alle pipeline RAG. Costruite un sistema pronto per
  la produzione con LangGraph + Milvus.
origin: 'https://milvus.io/blog/fix-rag-retrieval-errors-crag-langgraph-milvus.md'
---
<p>Man mano che le applicazioni LLM entrano in produzione, i team hanno sempre più bisogno che i loro modelli rispondano a domande basate su dati privati o su informazioni in tempo reale. L'approccio standard è quello della <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG (Retrieval-Augmented Generation</a> ), in cui il modello attinge da una base di conoscenza esterna al momento dell'interrogazione. Riduce le allucinazioni e mantiene le risposte aggiornate.</p>
<p>Ma c'è un problema che emerge rapidamente nella pratica: <strong>un documento può ottenere un punteggio elevato per la somiglianza e tuttavia essere completamente sbagliato per la domanda.</strong> Le pipeline RAG tradizionali equiparano la somiglianza alla pertinenza. In produzione, questo presupposto viene meno. Un risultato di primo piano potrebbe essere obsoleto, solo tangenzialmente correlato o mancante dell'esatto dettaglio di cui l'utente ha bisogno.</p>
<p>CRAG (Corrective Retrieval-Augmented Generation) risolve questo problema aggiungendo la valutazione e la correzione tra il recupero e la generazione. Invece di fidarsi ciecamente dei punteggi di somiglianza, il sistema controlla se i contenuti recuperati rispondono effettivamente alla domanda e corregge la situazione in caso contrario.</p>
<p>Questo articolo illustra la costruzione di un sistema CRAG pronto per la produzione, utilizzando LangChain, LangGraph e <a href="https://milvus.io/intro">Milvus</a>.</p>
<h2 id="Three-Retrieval-Problems-Traditional-RAG-Doesnt-Solve" class="common-anchor-header">Tre problemi di recupero che il RAG tradizionale non risolve<button data-href="#Three-Retrieval-Problems-Traditional-RAG-Doesnt-Solve" class="anchor-icon" translate="no">
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
    </button></h2><p>La maggior parte dei fallimenti del RAG in produzione è riconducibile a uno dei tre problemi seguenti:</p>
<p><strong>Disadattamento del reperimento.</strong> Il documento è topicamente simile, ma non risponde effettivamente alla domanda. Se si chiede come configurare un certificato HTTPS in Nginx, il sistema potrebbe restituire una guida all'installazione di Apache, una guida al 2019 o una spiegazione generale sul funzionamento di TLS. Semanticamente vicino, praticamente inutile.</p>
<p><strong>Contenuti obsoleti.</strong> <a href="https://zilliz.com/learn/vector-similarity-search">La ricerca vettoriale</a> non ha il concetto di ricorrenza. Se si interroga "Python async best practices", si otterrà un mix di modelli del 2018 e del 2024, classificati esclusivamente in base alla distanza di incorporazione. Il sistema non è in grado di distinguere quello di cui l'utente ha effettivamente bisogno.</p>
<p><strong>Contaminazione della memoria.</strong> Questo problema si aggrava nel tempo ed è spesso il più difficile da risolvere. Supponiamo che il sistema recuperi un riferimento API obsoleto e generi un codice errato. Il codice errato viene memorizzato. Alla successiva richiesta simile, il sistema lo recupera di nuovo, rafforzando l'errore. Le informazioni vecchie e quelle nuove si mescolano gradualmente e l'affidabilità del sistema si riduce a ogni ciclo.</p>
<p>Non si tratta di casi isolati. Si presentano regolarmente quando un sistema RAG gestisce un traffico reale. È questo che rende i controlli di qualità del reperimento un requisito, non un semplice "nice-to-have".</p>
<h2 id="What-Is-CRAG-Evaluate-First-Then-Generate" class="common-anchor-header">Che cos'è il CRAG? Prima valutare, poi generare<button data-href="#What-Is-CRAG-Evaluate-First-Then-Generate" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>La Corrective Retrieval-Augmented Generation (CRAG)</strong> è un metodo che aggiunge una fase di valutazione e correzione tra il recupero e la generazione in una pipeline RAG. È stato introdotto nell'articolo <a href="https://openreview.net/forum?id=JnWJbrnaUE"><em>Corrective Retrieval Augmented Generation</em></a> (Yan et al., 2024). A differenza del RAG tradizionale, che prende una decisione binaria - utilizzare il documento o scartarlo - il RAG assegna un punteggio a ogni risultato recuperato per la rilevanza e lo fa passare attraverso uno dei tre percorsi di correzione prima che raggiunga il modello linguistico.</p>
<p>Il RAG tradizionale ha difficoltà quando i risultati del recupero si trovano in una zona grigia: parzialmente rilevanti, un po' datati o mancanti di un elemento chiave. Un semplice gate sì/no scarta le informazioni parziali utili o lascia passare i contenuti rumorosi. CRAG modifica la pipeline da <strong>recuperare → generare</strong> a <strong>recuperare → valutare → correggere → generare</strong>, dando al sistema la possibilità di correggere la qualità del recupero prima che inizi la generazione.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/fix_rag_retrieval_errors_crag_langgraph_milvus_1_11a820f454.png" alt="CRAG four-step workflow: Retrieval → Evaluation → Correction → Generation, showing how documents are scored and routed" class="doc-image" id="crag-four-step-workflow:-retrieval-→-evaluation-→-correction-→-generation,-showing-how-documents-are-scored-and-routed" />
   <span>Flusso di lavoro CRAG in quattro fasi: Recupero → Valutazione → Correzione → Generazione, che mostra come i documenti vengono valutati e instradati.</span> </span></p>
<p>I risultati recuperati sono classificati in una delle tre categorie:</p>
<ul>
<li><strong>Corretto:</strong> risponde direttamente alla query; utilizzabile dopo un leggero affinamento.</li>
<li><strong>Ambiguo:</strong> parzialmente rilevante; necessita di informazioni aggiuntive</li>
<li><strong>Scorretto:</strong> irrilevante; da scartare e da rimandare a fonti alternative.</li>
</ul>
<table>
<thead>
<tr><th>Decisione</th><th>Fiducia</th><th>Azione</th></tr>
</thead>
<tbody>
<tr><td>Corretto</td><td>&gt; 0.9</td><td>Affinare il contenuto del documento</td></tr>
<tr><td>Ambiguo</td><td>0.5-0.9</td><td>Affinare il documento + integrare con la ricerca sul web</td></tr>
<tr><td>Non corretto</td><td>&lt; 0.5</td><td>Scartare i risultati del reperimento; ricorrere completamente alla ricerca sul web.</td></tr>
</tbody>
</table>
<h3 id="Content-Refinement" class="common-anchor-header">Affinamento del contenuto</h3><p>CRAG risolve anche un problema più sottile della RAG standard: la maggior parte dei sistemi fornisce al modello l'intero documento recuperato. In questo modo si sprecano token e si diluisce il segnale: il modello deve passare in rassegna paragrafi irrilevanti per trovare la frase che conta davvero. CRAG raffina prima il contenuto recuperato, estraendo le parti rilevanti e togliendo il resto.</p>
<p>Il documento originale utilizza strisce di conoscenza e regole euristiche. In pratica, la corrispondenza delle parole chiave funziona per molti casi d'uso e i sistemi di produzione possono aggiungere una sintesi basata su LLM o un'estrazione strutturata per ottenere una qualità superiore.</p>
<p>Il processo di raffinamento si articola in tre parti:</p>
<ul>
<li><strong>Decomposizione del documento:</strong> estrarre i passaggi chiave da un documento più lungo.</li>
<li><strong>Riscrittura delle query:</strong> trasformare le query vaghe o ambigue in query più mirate.</li>
<li><strong>Selezione della conoscenza:</strong> deduplica, classifica e conserva solo i contenuti più utili.</li>
</ul>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/fix_rag_retrieval_errors_crag_langgraph_milvus_2_9ec4b6aa81.png" alt="The three-step document refinement process: Document Decomposition (2000 → 500 tokens), Query Rewriting (improved search precision), and Knowledge Selection (filter, rank, and trim)" class="doc-image" id="the-three-step-document-refinement-process:-document-decomposition-(2000-→-500-tokens),-query-rewriting-(improved-search-precision),-and-knowledge-selection-(filter,-rank,-and-trim)" />
   <span>Il processo di perfezionamento dei documenti in tre fasi: Decomposizione del documento (2000 → 500 token), riscrittura della query (miglioramento della precisione della ricerca) e selezione della conoscenza (filtrare, classificare e tagliare).</span> </span></p>
<h3 id="The-Evaluator" class="common-anchor-header">Il valutatore</h3><p>Il valutatore è il cuore di CRAG. Non è pensato per un ragionamento approfondito, ma è un veloce gate di triage. Data una query e un insieme di documenti recuperati, decide se il contenuto è abbastanza buono da essere utilizzato.</p>
<p>Il documento originale opta per un modello T5-Large ottimizzato piuttosto che per un LLM generico. Il ragionamento è che la velocità e la precisione sono più importanti della flessibilità per questo compito particolare.</p>
<table>
<thead>
<tr><th>Attributo</th><th>T5-Large ottimizzato</th><th>GPT-4</th></tr>
</thead>
<tbody>
<tr><td>Latenza</td><td>10-20 ms</td><td>200 ms+</td></tr>
<tr><td>Precisione</td><td>92% (esperimenti su carta)</td><td>TBD</td></tr>
<tr><td>Adattamento al compito</td><td>Elevato - regolazione fine per un singolo compito, maggiore precisione</td><td>Medio - uso generale, più flessibile ma meno specializzato</td></tr>
</tbody>
</table>
<h3 id="Web-Search-Fallback" class="common-anchor-header">Fallback della ricerca sul Web</h3><p>Quando il reperimento interno viene segnalato come errato o ambiguo, CRAG può attivare una ricerca sul web per ottenere informazioni più fresche o supplementari. Questo funge da rete di sicurezza per le interrogazioni sensibili al tempo e per gli argomenti in cui la base di conoscenze interna presenta delle lacune.</p>
<h2 id="Why-Milvus-Is-a-Good-Fit-for-CRAG-in-Production" class="common-anchor-header">Perché Milvus è adatto a CRAG in produzione<button data-href="#Why-Milvus-Is-a-Good-Fit-for-CRAG-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>L'efficacia di CRAG dipende da ciò che sta sotto di esso. Il <a href="https://zilliz.com/learn/what-is-vector-database">database vettoriale</a> deve fare di più della ricerca di similarità di base: deve supportare l'isolamento multi-tenant, il reperimento ibrido e la flessibilità dello schema che un sistema CRAG di produzione richiede.</p>
<p>Dopo aver valutato diverse opzioni, abbiamo scelto <a href="https://zilliz.com/what-is-milvus">Milvus</a> per tre motivi.</p>
<h3 id="Multi-Tenant-Isolation" class="common-anchor-header">Isolamento multi-tenant</h3><p>Nei sistemi basati su agenti, ogni utente o sessione ha bisogno del proprio spazio di memoria. L'approccio ingenuo di una raccolta per tenant diventa rapidamente un problema operativo, soprattutto in scala.</p>
<p>Milvus gestisce questo problema con la <a href="https://milvus.io/docs/use-partition-key.md">chiave di partizione</a>. Impostate <code translate="no">is_partition_key=True</code> sul campo <code translate="no">agent_id</code> e Milvus indirizzerà automaticamente le query alla partizione giusta. Non c'è bisogno di un'espansione della collezione, né di un codice di instradamento manuale.</p>
<p>Nei nostri benchmark con 10 milioni di vettori su 100 tenant, Milvus con Clustering Compaction ha fornito <strong>QPS 3-5 volte superiori</strong> rispetto alla linea di base non ottimizzata.</p>
<h3 id="Hybrid-Retrieval" class="common-anchor-header">Recupero ibrido</h3><p>La ricerca vettoriale pura non è all'altezza di una corrispondenza esatta tra contenuti e prodotti, come <code translate="no">SKU-2024-X5</code>, stringhe di versioni o terminologia specifica.</p>
<p>Milvus 2.5 supporta in modo nativo la <a href="https://milvus.io/docs/multi-vector-search.md">ricerca ibrida</a>: vettori densi per la somiglianza semantica, vettori radi per la corrispondenza delle parole chiave in stile BM25 e il filtraggio dei metadati scalari, tutto in un'unica query. I risultati vengono fusi utilizzando la Reciprocal Rank Fusion (RRF), in modo da non dover creare e unire pipeline di reperimento separate.</p>
<p>Su un set di dati da 1 milione di vettori, la latenza di recupero di Milvus Sparse-BM25 è stata di <strong>6 ms</strong>, con un impatto trascurabile sulle prestazioni end-to-end di CRAG.</p>
<h3 id="Flexible-Schema-for-Evolving-Memory" class="common-anchor-header">Schema flessibile per una memoria in evoluzione</h3><p>Man mano che le pipeline CRAG maturano, il modello dei dati si evolve con esse. Dovevamo aggiungere campi come <code translate="no">confidence</code>, <code translate="no">verified</code> e <code translate="no">source</code> mentre iteravamo sulla logica di valutazione. Nella maggior parte dei database, ciò significa script di migrazione e tempi di inattività.</p>
<p>Milvus supporta campi JSON dinamici, per cui i metadati possono essere estesi al volo senza interruzioni del servizio.</p>
<p>Ecco uno schema tipico:</p>
<pre><code translate="no" class="language-python">fields = [
    FieldSchema(name=<span class="hljs-string">&quot;agent_id&quot;</span>, dtype=DataType.VARCHAR, is_partition_key=<span class="hljs-literal">True</span>),  <span class="hljs-comment"># multi-tenancy</span>
    FieldSchema(name=<span class="hljs-string">&quot;dense_embedding&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>),   <span class="hljs-comment"># semantic retrieval</span>
    FieldSchema(name=<span class="hljs-string">&quot;sparse_embedding&quot;</span>, dtype=DataType.SPARSE_FLOAT_VECTOR),<span class="hljs-comment"># BM25</span>
    FieldSchema(name=<span class="hljs-string">&quot;metadata&quot;</span>, dtype=DataType.JSON),<span class="hljs-comment"># dynamic schema</span>
]

<span class="hljs-comment"># hybrid retrieval + metadata filtering</span>
results = collection.hybrid_search(
    reqs=[
        AnnSearchRequest(data=[dense_vec], anns_field=<span class="hljs-string">&quot;dense_embedding&quot;</span>, limit=<span class="hljs-number">20</span>),
        AnnSearchRequest(data=[sparse_vec], anns_field=<span class="hljs-string">&quot;sparse_embedding&quot;</span>, limit=<span class="hljs-number">20</span>)
    ],
    rerank=RRFRanker(),
    output_fields=[<span class="hljs-string">&quot;metadata&quot;</span>],
    expr=<span class="hljs-string">&#x27;metadata[&quot;confidence&quot;] &gt; 0.9&#x27;</span>,<span class="hljs-comment"># CRAG confidence filtering</span>
    limit=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus semplifica anche la scalabilità del deployment. Offre le <a href="https://milvus.io/docs/install-overview.md">modalità Lite, Standalone e Distributed</a>, compatibili con il codice: per passare dallo sviluppo locale a un cluster di produzione è sufficiente cambiare la stringa di connessione.</p>
<h2 id="Hands-On-Build-a-CRAG-System-with-LangGraph-Middleware-and-Milvus" class="common-anchor-header">Realizzazione pratica di un sistema CRAG con LangGraph Middleware e Milvus<button data-href="#Hands-On-Build-a-CRAG-System-with-LangGraph-Middleware-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Why-the-Middleware-Approach" class="common-anchor-header">Perché un approccio middleware?</h3><p>Un modo comune di costruire CRAG con LangGraph è quello di creare un grafo di stato con nodi e bordi che controllano ogni fase. Funziona, ma il grafo si aggroviglia con l'aumentare della complessità e il debug diventa un grattacapo.</p>
<p>In LangGraph 1.0 abbiamo scelto il <strong>modello Middleware</strong>. Intercetta le richieste prima della chiamata al modello, in modo che il recupero, la valutazione e la correzione siano gestiti in un unico luogo coeso. Rispetto all'approccio a grafo di stato:</p>
<ul>
<li><strong>Meno codice: la</strong> logica è centralizzata, non sparsa tra i nodi del grafo.</li>
<li><strong>Più facile da seguire:</strong> il flusso di controllo si legge in modo lineare</li>
<li><strong>Più facile da debuggare:</strong> i guasti puntano a un singolo punto, non a una traversata del grafo.</li>
</ul>
<h3 id="Core-Workflow" class="common-anchor-header">Flusso di lavoro principale</h3><p>La pipeline viene eseguita in quattro fasi:</p>
<ol>
<li><strong>Recupero:</strong> recupera i 3 documenti più rilevanti da Milvus, in base al tenant corrente.</li>
<li><strong>Valutazione:</strong> valutazione della qualità dei documenti con un modello leggero</li>
<li><strong>Correzione:</strong> perfezionamento, integrazione con la ricerca sul web o rinuncia totale, in base al verdetto.</li>
<li><strong>Iniezione:</strong> passare il contesto finale al modello attraverso un prompt dinamico del sistema<strong>.</strong> </li>
</ol>
<h3 id="Environment-Setup-and-Data-Preparation" class="common-anchor-header">Impostazione dell'ambiente e preparazione dei dati</h3><p><strong>Variabili d'ambiente</strong></p>
<pre><code translate="no" class="language-bash"><span class="hljs-keyword">export</span> <span class="hljs-variable constant_">OPENAI_API_KEY</span>=<span class="hljs-string">&quot;your-api-key&quot;</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">TAVILY_API_KEY</span>=<span class="hljs-string">&quot;your-tavily-key&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Creare la collezione Milvus</strong></p>
<p>Prima di eseguire il codice, creare una collezione in Milvus con uno schema che corrisponda alla logica di recupero.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># filename: crag_agent.py</span>

<span class="hljs-comment"># ============ Import dependencies ============</span>
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">Literal</span>, <span class="hljs-type">List</span>
<span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> AgentMiddleware, before_model, dynamic_prompt
<span class="hljs-keyword">from</span> langchain.chat_models <span class="hljs-keyword">import</span> init_chat_model
<span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain_openai <span class="hljs-keyword">import</span> OpenAIEmbeddings
<span class="hljs-keyword">from</span> langchain_core.documents <span class="hljs-keyword">import</span> Document
<span class="hljs-keyword">from</span> langchain_core.messages <span class="hljs-keyword">import</span> SystemMessage, HumanMessage
<span class="hljs-keyword">from</span> langchain_community.tools.tavily_search <span class="hljs-keyword">import</span> TavilySearchResults


<span class="hljs-comment"># ============ CRAG Middleware (minimal-change version) ============</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">CRAGMiddleware</span>(<span class="hljs-title class_ inherited__">AgentMiddleware</span>):
    <span class="hljs-string">&quot;&quot;&quot;CRAG evaluation and correction middleware (uses official decorator-based hooks to avoid permanently polluting the message stack)&quot;&quot;&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, vector_store: Milvus, agent_id: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-built_in">super</span>().__init__()
        <span class="hljs-variable language_">self</span>.vector_store = vector_store
        <span class="hljs-variable language_">self</span>.agent_id = agent_id  <span class="hljs-comment"># multi-tenant isolation</span>
        <span class="hljs-comment"># Lightweight evaluator: used for relevance judgment (can be replaced with the structured version introduced later)</span>
        <span class="hljs-variable language_">self</span>.evaluator = init_chat_model(<span class="hljs-string">&quot;openai:gpt-4o-mini&quot;</span>, temperature=<span class="hljs-number">0</span>)
        <span class="hljs-comment"># Web search fallback</span>
        <span class="hljs-variable language_">self</span>.web_search = TavilySearchResults(max_results=<span class="hljs-number">3</span>)

<span class="hljs-meta">    @before_model</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">run_crag</span>(<span class="hljs-params">self, state</span>):
        <span class="hljs-string">&quot;&quot;&quot;Run retrieval -&gt; evaluation -&gt; correction before model invocation and prepare the final context&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Get the last user message</span>
        last_msg = state[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>]
        query = <span class="hljs-built_in">getattr</span>(last_msg, <span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>) <span class="hljs-keyword">if</span> <span class="hljs-built_in">hasattr</span>(last_msg, <span class="hljs-string">&quot;content&quot;</span>) <span class="hljs-keyword">else</span> last_msg.get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)

        <span class="hljs-comment"># 1. Retrieval: get documents from Milvus (PartitionKey + confidence filtering)</span>
        docs = <span class="hljs-variable language_">self</span>._retrieve_from_milvus(query)

        <span class="hljs-comment"># 2. Evaluation: three-way decision</span>
        verdict = <span class="hljs-variable language_">self</span>._evaluate_relevance(query, docs)

        <span class="hljs-comment"># 3. Correction: choose the handling strategy based on the verdict</span>
        <span class="hljs-keyword">if</span> verdict == <span class="hljs-string">&quot;incorrect&quot;</span>:
            <span class="hljs-comment"># Retrieval failed, rely entirely on Web search</span>
            web_results = <span class="hljs-variable language_">self</span>._web_search_fallback(query)
            final_context = <span class="hljs-variable language_">self</span>._format_web_results(web_results)
        <span class="hljs-keyword">elif</span> verdict == <span class="hljs-string">&quot;ambiguous&quot;</span>:
            <span class="hljs-comment"># Retrieval is ambiguous, refine documents + supplement with Web search</span>
            refined_docs = <span class="hljs-variable language_">self</span>._refine_documents(docs, query)
            web_results = <span class="hljs-variable language_">self</span>._web_search_fallback(query)
            final_context = <span class="hljs-variable language_">self</span>._merge_context(refined_docs, web_results)
        <span class="hljs-keyword">else</span>:
            <span class="hljs-comment"># Retrieval quality is good, only refine the documents</span>
            refined_docs = <span class="hljs-variable language_">self</span>._refine_documents(docs, query)
            final_context = <span class="hljs-variable language_">self</span>._format_internal_docs(refined_docs)

        <span class="hljs-comment"># 4. Put the context into a temporary key, used only for dynamic prompt assembly in the current model call</span>
        state[<span class="hljs-string">&quot;_crag_context&quot;</span>] = final_context
        <span class="hljs-keyword">return</span> state

<span class="hljs-meta">    @dynamic_prompt</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">attach_context</span>(<span class="hljs-params">self, state, prompt_messages: <span class="hljs-type">List</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Inject the CRAG-generated context as a SystemMessage before the prompt for the current model call&quot;&quot;&quot;</span>
        final_context = state.get(<span class="hljs-string">&quot;_crag_context&quot;</span>)
        <span class="hljs-keyword">if</span> final_context:
            sys_msg = SystemMessage(
                content=<span class="hljs-string">f&quot;Here is some relevant background information. Please answer the user&#x27;s question based on this information:\n\n<span class="hljs-subst">{final_context}</span>&quot;</span>
            )
            <span class="hljs-comment"># Applies only to the current call and is not permanently written into state[&quot;messages&quot;]</span>
            prompt_messages = [sys_msg] + prompt_messages
        <span class="hljs-keyword">return</span> prompt_messages

    <span class="hljs-comment"># ======== Internal methods: retrieval / evaluation / refinement / formatting ========</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_retrieve_from_milvus</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Retrieve documents from Milvus (Partition Key + confidence filtering)&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            <span class="hljs-comment"># Note: different adapter versions may place filter parameters differently; here expr is passed through search_kwargs</span>
            docs = <span class="hljs-variable language_">self</span>.vector_store.similarity_search(
                query,
                k=<span class="hljs-number">3</span>,
                search_kwargs={<span class="hljs-string">&quot;expr&quot;</span>: <span class="hljs-string">f&#x27;agent_id == &quot;<span class="hljs-subst">{self.agent_id}</span>&quot;&#x27;</span>}
            )
            <span class="hljs-comment"># Confidence filtering (to avoid low-quality memory contamination)</span>
            filtered_docs = [
                doc <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs
                <span class="hljs-keyword">if</span> (doc.metadata <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;confidence&quot;</span>, <span class="hljs-number">0.0</span>) &gt; <span class="hljs-number">0.7</span>
            ]
            <span class="hljs-keyword">return</span> filtered_docs <span class="hljs-keyword">or</span> docs  <span class="hljs-comment"># If there are no high-confidence results, fall back to the original results for evaluator judgment</span>
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Retrieval failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> []

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_evaluate_relevance</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]:
        <span class="hljs-string">&quot;&quot;&quot;Evaluate document relevance (three-way decision), simplified version: the LLM returns the verdict directly&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;incorrect&quot;</span>

        <span class="hljs-comment"># Evaluate only the Top-3 documents, taking the first 500 characters of each</span>
        doc_content = <span class="hljs-string">&quot;\n\n&quot;</span>.join([
            <span class="hljs-string">f&quot;[Document <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>] <span class="hljs-subst">{(doc.page_content <span class="hljs-keyword">or</span> <span class="hljs-string">&#x27;&#x27;</span>)[:<span class="hljs-number">500</span>]}</span>...&quot;</span>
            <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs[:<span class="hljs-number">3</span>])
        ])

        prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an expert in document relevance evaluation. Assess whether the following documents can answer the query.

Query: <span class="hljs-subst">{query}</span>

Document content:
<span class="hljs-subst">{doc_content}</span>

Evaluation criteria:
- relevant: the document directly contains the answer and is highly relevant
- ambiguous: the document is partially relevant and needs external knowledge
- incorrect: the document is irrelevant and cannot answer the query

Return only one word: relevant or ambiguous or incorrect
&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            result = <span class="hljs-variable language_">self</span>.evaluator.invoke(prompt)
            verdict = (<span class="hljs-built_in">getattr</span>(result, <span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>) <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;&quot;</span>).strip().lower()
            <span class="hljs-keyword">if</span> verdict <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> {<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>}:
                verdict = <span class="hljs-string">&quot;ambiguous&quot;</span>
            <span class="hljs-keyword">return</span> verdict
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Evaluation failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;ambiguous&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_refine_documents</span>(<span class="hljs-params">self, docs: <span class="hljs-built_in">list</span>, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Refine documents (simplified strips: sentence filtering based on keywords)&quot;&quot;&quot;</span>
        refined = []
        <span class="hljs-comment"># Simple Chinese-period replacement + rough English sentence splitting</span>
        keywords = [kw.strip() <span class="hljs-keyword">for</span> kw <span class="hljs-keyword">in</span> query.split() <span class="hljs-keyword">if</span> kw.strip()]

        <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs:
            text = doc.page_content <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;&quot;</span>
            sentences = (
                text.replace(<span class="hljs-string">&quot;。&quot;</span>, <span class="hljs-string">&quot;。\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;. &quot;</span>, <span class="hljs-string">&quot;.\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;! &quot;</span>, <span class="hljs-string">&quot;!\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;? &quot;</span>, <span class="hljs-string">&quot;?\n&quot;</span>)
                    .split(<span class="hljs-string">&quot;\n&quot;</span>)
            )
            sentences = [s.strip() <span class="hljs-keyword">for</span> s <span class="hljs-keyword">in</span> sentences <span class="hljs-keyword">if</span> s.strip()]

            <span class="hljs-comment"># Match any keyword</span>
            relevant_sentences = [
                s <span class="hljs-keyword">for</span> s <span class="hljs-keyword">in</span> sentences
                <span class="hljs-keyword">if</span> <span class="hljs-built_in">any</span>(keyword <span class="hljs-keyword">in</span> s <span class="hljs-keyword">for</span> keyword <span class="hljs-keyword">in</span> keywords)
            ]

            <span class="hljs-keyword">if</span> relevant_sentences:
                refined_text = <span class="hljs-string">&quot;。&quot;</span>.join(relevant_sentences[:<span class="hljs-number">3</span>])
                refined.append(Document(page_content=refined_text, metadata=doc.metadata <span class="hljs-keyword">or</span> {}))

        <span class="hljs-keyword">return</span> refined <span class="hljs-keyword">if</span> refined <span class="hljs-keyword">else</span> docs  <span class="hljs-comment"># If nothing is extracted, fall back to the original documents</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_web_search_fallback</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Web search fallback&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.web_search.invoke(query) <span class="hljs-keyword">or</span> []
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Web search failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> []

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_merge_context</span>(<span class="hljs-params">self, internal_docs: <span class="hljs-built_in">list</span>, web_results: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Merge internal memory and external knowledge into the final context&quot;&quot;&quot;</span>
        parts = []
        <span class="hljs-keyword">if</span> internal_docs:
            parts.append(<span class="hljs-string">&quot;[Internal Memory]&quot;</span>)
            <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(internal_docs, <span class="hljs-number">1</span>):
                parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{doc.page_content}</span>&quot;</span>)
        <span class="hljs-keyword">if</span> web_results:
            parts.append(<span class="hljs-string">&quot;[External Knowledge]&quot;</span>)
            <span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(web_results, <span class="hljs-number">1</span>):
                content = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
                url = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;url&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
                parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{content}</span>\n   Source: <span class="hljs-subst">{url}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts) <span class="hljs-keyword">if</span> parts <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_format_internal_docs</span>(<span class="hljs-params">self, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Format internal documents&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>
        parts = [<span class="hljs-string">&quot;[Internal Memory]&quot;</span>]
        <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs, <span class="hljs-number">1</span>):
            parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{doc.page_content}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts)

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_format_web_results</span>(<span class="hljs-params">self, results: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Format Web search results&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> results:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>
        parts = [<span class="hljs-string">&quot;[External Knowledge]&quot;</span>]
        <span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results, <span class="hljs-number">1</span>):
            content = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
            url = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;url&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
            parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{content}</span>\n   Source: <span class="hljs-subst">{url}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts)


<span class="hljs-comment"># ============ Initialize the Milvus vector database ============</span>
vector_store = Milvus(
    embedding_function=OpenAIEmbeddings(),
    connection_args={<span class="hljs-string">&quot;host&quot;</span>: <span class="hljs-string">&quot;localhost&quot;</span>, <span class="hljs-string">&quot;port&quot;</span>: <span class="hljs-string">&quot;19530&quot;</span>},
    collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>
)

<span class="hljs-comment"># ============ Create Agent ============</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[TavilySearchResults(max_results=<span class="hljs-number">3</span>)],  <span class="hljs-comment"># Web search tool</span>
    middleware=[
        CRAGMiddleware(
            vector_store=vector_store,
            agent_id=<span class="hljs-string">&quot;user_123_session_456&quot;</span>  <span class="hljs-comment"># multi-tenant isolation: each Agent instance uses its own ID</span>
        )
    ]
)

<span class="hljs-comment"># ============ Example run ============</span>
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-comment"># Example query: use HumanMessage to ensure compatibility</span>
    response = agent.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [
            HumanMessage(content=<span class="hljs-string">&quot;What were the operating expenses in Nike&#x27;s latest quarterly earnings report?&quot;</span>)
        ]
    })
    <span class="hljs-built_in">print</span>(response[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>].content)
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p><strong>Nota sulla versione:</strong> questo codice utilizza le ultime funzionalità del middleware di LangGraph e LangChain. Queste API possono cambiare con l'evoluzione dei framework; verificare la <a href="https://langchain-ai.github.io/langgraph/">documentazione</a> di <a href="https://langchain-ai.github.io/langgraph/">LangGraph</a> per l'uso più aggiornato.</p>
</blockquote>
<h3 id="Key-Modules" class="common-anchor-header">Moduli chiave</h3><p><strong>1. Progettazione del valutatore di livello produttivo</strong></p>
<p>Il metodo <code translate="no">_evaluate_relevance()</code> nel codice qui sopra è intenzionalmente semplificato per un test rapido. Per la produzione, si vorrà un risultato strutturato con punteggio di fiducia e spiegabilità:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pydantic <span class="hljs-keyword">import</span> BaseModel
<span class="hljs-keyword">from</span> langchain.prompts <span class="hljs-keyword">import</span> PromptTemplate

<span class="hljs-keyword">class</span> <span class="hljs-title class_">RelevanceVerdict</span>(<span class="hljs-title class_ inherited__">BaseModel</span>):
    <span class="hljs-string">&quot;&quot;&quot;Structured output for the evaluation result&quot;&quot;&quot;</span>
    verdict: <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]
    confidence: <span class="hljs-built_in">float</span>  <span class="hljs-comment"># confidence score (used for memory quality monitoring)</span>
    reasoning: <span class="hljs-built_in">str</span>     <span class="hljs-comment"># reason for the judgment (used for debugging and review)</span>

<span class="hljs-comment"># Note: the CRAG paper uses a fine-tuned T5-Large evaluator (10-20 ms latency)</span>
<span class="hljs-comment"># Here, gpt-4o-mini is used as the engineering implementation option (easier to deploy, but with slightly higher latency)</span>
grader_llm = ChatOpenAI(model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>, temperature=<span class="hljs-number">0</span>)

grader_prompt = PromptTemplate(
    template=<span class="hljs-string">&quot;&quot;&quot;You are an expert in document relevance evaluation. Assess whether the following documents can answer the query.

Query: {query}

Document content:
{document}

Evaluation criteria:
- relevant: the document directly contains the answer, confidence &gt; 0.9
- ambiguous: the document is partially relevant, confidence 0.5-0.9
- incorrect: the document is irrelevant, confidence &lt; 0.5

Return in JSON format: {{&quot;verdict&quot;: &quot;...&quot;, &quot;confidence&quot;: 0.xx, &quot;reasoning&quot;: &quot;...&quot;}}
&quot;&quot;&quot;</span>,
    input_variables=[<span class="hljs-string">&quot;query&quot;</span>, <span class="hljs-string">&quot;document&quot;</span>]
)

grader_chain = grader_prompt | grader_llm.with_structured_output(RelevanceVerdict)

<span class="hljs-comment"># Replace the _evaluate_relevance() method in CRAGMiddleware</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">_evaluate_relevance</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Evaluate document relevance (returns structured result)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;incorrect&quot;</span>

    <span class="hljs-comment"># Evaluate only the Top-3 documents, taking the first 500 characters of each</span>
    doc_content = <span class="hljs-string">&quot;\n\n&quot;</span>.join([
        <span class="hljs-string">f&quot;[Document <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>] <span class="hljs-subst">{doc.page_content[:<span class="hljs-number">500</span>]}</span>...&quot;</span>
        <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs[:<span class="hljs-number">3</span>])
    ])

    result = grader_chain.invoke({
        <span class="hljs-string">&quot;query&quot;</span>: query,
        <span class="hljs-string">&quot;document&quot;</span>: doc_content
    })

    <span class="hljs-comment"># Store the confidence score in logs or a monitoring system</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG Evaluation] verdict=<span class="hljs-subst">{result.verdict}</span>, confidence=<span class="hljs-subst">{result.confidence:<span class="hljs-number">.2</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG Reasoning] <span class="hljs-subst">{result.reasoning}</span>&quot;</span>)

    <span class="hljs-comment"># Optional: store the evaluation result in Milvus for memory quality analysis</span>
    <span class="hljs-variable language_">self</span>._store_evaluation_metrics(query, result)

    <span class="hljs-keyword">return</span> result.verdict

<span class="hljs-keyword">def</span> <span class="hljs-title function_">_store_evaluation_metrics</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, verdict_result: RelevanceVerdict</span>):
    <span class="hljs-string">&quot;&quot;&quot;Store evaluation metrics in Milvus (for memory quality monitoring)&quot;&quot;&quot;</span>
    <span class="hljs-comment"># Example: store the evaluation result in a separate Collection for analysis</span>
    <span class="hljs-comment"># In actual use, you need to create the evaluation_metrics Collection</span>
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>2. Raffinamento della conoscenza e fallback</strong></p>
<p>Tre meccanismi lavorano insieme per mantenere il contesto del modello di alta qualità:</p>
<ul>
<li>L<strong>'affinamento della conoscenza</strong> estrae le frasi più rilevanti per la domanda ed elimina il rumore.</li>
<li>La<strong>ricerca di ripiego</strong> si attiva quando il reperimento locale è insufficiente, attingendo alle conoscenze esterne tramite Tavily.</li>
<li>L'<strong>unione del contesto</strong> combina la memoria interna con i risultati esterni in un unico blocco di contesto deduplicato prima che raggiunga il modello.</li>
</ul>
<h2 id="Tips-for-Running-CRAG-in-Production" class="common-anchor-header">Suggerimenti per l'esecuzione di CRAG in produzione<button data-href="#Tips-for-Running-CRAG-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Tre sono le aree più importanti una volta superata la fase di prototipazione.</p>
<h3 id="1-Cost-Pick-the-Right-Evaluator" class="common-anchor-header">1. Costo: Scegliere il valutatore giusto</h3><p>Il valutatore viene eseguito su ogni singola query, il che lo rende la leva più importante sia per la latenza che per i costi.</p>
<ul>
<li><strong>Carichi di lavoro ad alta cadenza:</strong> Un modello leggero e ottimizzato come T5-Large mantiene la latenza a 10-20 ms e i costi sono prevedibili.</li>
<li><strong>Basso traffico o prototipazione:</strong> Un modello in hosting come <code translate="no">gpt-4o-mini</code> è più veloce da configurare e richiede meno lavoro operativo, ma la latenza e i costi per chiamata sono più elevati.</li>
</ul>
<h3 id="2-Observability-Instrument-from-Day-One" class="common-anchor-header">2. Osservabilità: Strumento fin dal primo giorno</h3><p>I problemi di produzione più difficili sono quelli che non si vedono finché la qualità delle risposte non è già degradata.</p>
<ul>
<li><strong>Monitoraggio dell'infrastruttura:</strong> Milvus si integra con <a href="https://milvus.io/docs/monitor_overview.md">Prometheus</a>. Iniziate con tre metriche: <code translate="no">milvus_query_latency_seconds</code>, <code translate="no">milvus_search_qps</code>, e <code translate="no">milvus_insert_throughput</code>.</li>
<li><strong>Monitoraggio delle applicazioni:</strong> Tenere traccia della distribuzione dei verdetti CRAG, del tasso di attivazione della ricerca web e della distribuzione del punteggio di confidenza. Senza questi segnali, non si può dire se un calo di qualità sia dovuto a un cattivo recupero o a un errore di valutazione.</li>
</ul>
<h3 id="3-Long-Term-Maintenance-Prevent-Memory-Contamination" class="common-anchor-header">3. Manutenzione a lungo termine: Prevenire la contaminazione della memoria</h3><p>Più un agente viene eseguito a lungo, più i dati stantii e di bassa qualità si accumulano nella memoria. Predisporre tempestivamente dei guardrail:</p>
<ul>
<li><strong>Pre-filtraggio:</strong> Far emergere solo le memorie con <code translate="no">confidence &gt; 0.7</code>, in modo che i contenuti di bassa qualità vengano bloccati prima di raggiungere il valutatore.</li>
<li><strong>Decadimento del tempo:</strong> Ridurre gradualmente il peso delle memorie più vecchie. Trenta giorni è un valore di partenza ragionevole, regolabile in base ai casi d'uso.</li>
<li><strong>Pulizia programmata:</strong> Eseguire un lavoro settimanale per eliminare le memorie vecchie, poco affidabili e non verificate. In questo modo si evita il ciclo di feedback in cui i dati obsoleti vengono recuperati, utilizzati e memorizzati nuovamente.</li>
</ul>
<h2 id="Wrapping-Up--and-a-Few-Common-Questions" class="common-anchor-header">Conclusione e alcune domande comuni<button data-href="#Wrapping-Up--and-a-Few-Common-Questions" class="anchor-icon" translate="no">
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
    </button></h2><p>Il CRAG risolve uno dei problemi più persistenti nelle RAG di produzione: i risultati del recupero che sembrano rilevanti ma non lo sono. Inserendo una fase di valutazione e correzione tra il recupero e la generazione, filtra i risultati errati, colma le lacune con la ricerca esterna e fornisce al modello un contesto più pulito con cui lavorare.</p>
<p>Affinché CRAG funzioni in modo affidabile in produzione, però, non basta una buona logica di recupero. È necessario un database vettoriale che gestisca l'isolamento multi-tenant, la ricerca ibrida e l'evoluzione degli schemi, ed è qui che entra in gioco <a href="https://milvus.io/intro">Milvus</a>. Per quanto riguarda le applicazioni, la scelta del valutatore giusto, la strumentazione dell'osservabilità in fase iniziale e la gestione attiva della qualità della memoria sono gli elementi che separano una demo da un sistema di cui ci si può fidare.</p>
<p>Se state costruendo sistemi RAG o ad agenti e avete problemi di qualità di recupero, saremo lieti di aiutarvi:</p>
<ul>
<li>Unitevi alla <a href="https://slack.milvus.io/">community Milvus su Slack</a> per fare domande, condividere la vostra architettura e imparare da altri sviluppatori che lavorano su problemi simili.</li>
<li><a href="https://milvus.io/office-hours">Prenotate una sessione gratuita di 20 minuti di Milvus Office Hours</a> per analizzare il vostro caso d'uso con il team, che si tratti di progettazione CRAG, reperimento ibrido o scalabilità multi-tenant.</li>
<li>Se preferite saltare la configurazione dell'infrastruttura e passare direttamente alla costruzione, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (gestito da Milvus) offre un livello gratuito per iniziare.</li>
</ul>
<hr>
<p>Alcune domande che emergono spesso quando i team iniziano a implementare CRAG:</p>
<p><strong>In che modo CRAG è diverso dalla semplice aggiunta di un reranker a RAG?</strong></p>
<p>Un reranker riordina i risultati in base alla rilevanza, ma presuppone comunque che i documenti recuperati siano utilizzabili. CRAG va oltre: valuta se i contenuti recuperati rispondono effettivamente alla query e, in caso contrario, intraprende un'azione correttiva: raffinando le corrispondenze parziali, integrando la ricerca sul web o scartando completamente i risultati. Si tratta di un ciclo di controllo della qualità, non solo di un ordinamento migliore.</p>
<p><strong>Perché un punteggio di somiglianza elevato a volte restituisce il documento sbagliato?</strong></p>
<p>La similarità di incorporazione misura la vicinanza semantica nello spazio vettoriale, ma non è la stessa cosa che rispondere alla domanda. Un documento sulla configurazione di HTTPS su Apache è semanticamente vicino a una domanda su HTTPS su Nginx, ma non è utile. CRAG lo rileva valutando la pertinenza rispetto alla domanda reale, non solo la distanza vettoriale.</p>
<p><strong>Cosa si deve cercare in un database vettoriale per CRAG?</strong></p>
<p>Le cose più importanti sono tre: il recupero ibrido (in modo da poter combinare la ricerca semantica con la corrispondenza delle parole chiave per i termini esatti), l'isolamento multi-tenant (in modo che ogni sessione di utente o agente abbia il proprio spazio di memoria) e uno schema flessibile (in modo da poter aggiungere campi come <code translate="no">confidence</code> o <code translate="no">verified</code> senza tempi morti man mano che la pipeline si evolve).</p>
<p><strong>Cosa succede quando nessuno dei documenti recuperati è rilevante?</strong></p>
<p>CRAG non si arrende. Quando la fiducia scende al di sotto di 0,5, torna alla ricerca sul web. Quando i risultati sono ambigui (0,5-0,9), fonde i documenti interni raffinati con i risultati della ricerca esterna. Il modello ottiene sempre un contesto su cui lavorare, anche quando la base di conoscenza presenta delle lacune.</p>
