---
id: how-milvus-26-upgrades-multilingual-full-text-search-at-scale.md
title: Come Milvus 2.6 aggiorna la ricerca multilingue a tutto testo su scala
author: Zayne Yue
date: 2025-07-30T00:00:00.000Z
desc: >-
  Milvus 2.6 introduce una pipeline di analisi del testo completamente rinnovata
  con un supporto multilingue completo per la ricerca full text.
cover: assets.zilliz.com/Frame_385dc22973.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, multilingual search, hybrid search, vector search, full text search'
meta_title: |
  How Milvus How Milvus 2.6 Upgrades Multilingual Full-Text Search at Scale
origin: >-
  https://milvus.io/blog/how-milvus-26-upgrades-multilingual-full-text-search-at-scale.md
---
<h2 id="Introduction" class="common-anchor-header">Introduzione<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Le moderne applicazioni di intelligenza artificiale stanno diventando sempre più complesse. Non si può semplicemente lanciare un metodo di ricerca su un problema e considerarlo risolto.</p>
<p>I sistemi di raccomandazione, ad esempio, richiedono la <strong>ricerca vettoriale</strong> per comprendere il significato di testo e immagini, il <strong>filtraggio dei metadati</strong> per restringere i risultati in base al prezzo, alla categoria o alla località e la <strong>ricerca per parole chiave</strong> per le query dirette come "Nike Air Max". Ogni metodo risolve una parte diversa del problema e i sistemi del mondo reale hanno bisogno di tutti questi metodi per lavorare insieme.</p>
<p>Il futuro della ricerca non è la scelta tra vettore e parola chiave. Si tratta di combinare vettoriali, parole chiave e filtri, oltre ad altri tipi di ricerca, il tutto in un unico posto. Ecco perché un anno fa, con il rilascio di Milvus 2.5, abbiamo iniziato a integrare la <a href="https://milvus.io/docs/hybrid_search_with_milvus.md">ricerca ibrida</a> in Milvus.</p>
<h2 id="But-Full-Text-Search-Works-Differently" class="common-anchor-header">Ma la ricerca full text funziona in modo diverso<button data-href="#But-Full-Text-Search-Works-Differently" class="anchor-icon" translate="no">
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
    </button></h2><p>Portare la ricerca full-text in un sistema vettoriale-nativo non è facile. La ricerca full-text presenta una serie di sfide proprie.</p>
<p>Mentre la ricerca vettoriale cattura il significato <em>semantico</em> del testo - trasformandolo in vettori ad alta dimensionalità - la ricerca full-text dipende dalla comprensione della <strong>struttura del linguaggio</strong>: come si formano le parole, dove iniziano e finiscono e come si relazionano tra loro. Ad esempio, quando un utente cerca "scarpe da corsa" in inglese, il testo passa attraverso diverse fasi di elaborazione:</p>
<p><em>dividere gli spazi bianchi → abbassare le minuscole → rimuovere le stopword → trasformare &quot;running&quot; in &quot;run&quot;.</em></p>
<p>Per gestire correttamente questo aspetto, abbiamo bisogno di un <strong>analizzatore linguistico</strong>robusto <strong>,</strong>in grado di gestire la suddivisione, lo stemming, il filtraggio e altro ancora.</p>
<p>Quando abbiamo introdotto la <a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">ricerca full-text BM25</a> in Milvus 2.5, abbiamo incluso un analizzatore personalizzabile, che ha funzionato bene per gli scopi per cui era stato progettato. È possibile definire una pipeline che utilizza tokenizer, filtri per token e filtri per caratteri per preparare il testo all'indicizzazione e alla ricerca.</p>
<p>Per l'inglese, questa configurazione era relativamente semplice. Ma le cose diventano più complesse quando si ha a che fare con più lingue.</p>
<h2 id="The-Challenge-of-Multilingual-Full-Text-Search" class="common-anchor-header">La sfida della ricerca full text multilingue<button data-href="#The-Challenge-of-Multilingual-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>La ricerca full-text multilingue introduce una serie di sfide:</p>
<ul>
<li><p><strong>Le lingue complesse richiedono un trattamento speciale</strong>: Lingue come il cinese, il giapponese e il coreano non usano spazi tra le parole. Hanno bisogno di tokenizer avanzati per segmentare i caratteri in parole significative. Questi strumenti possono funzionare bene per una singola lingua, ma raramente supportano più lingue complesse contemporaneamente.</p></li>
<li><p><strong>Anche lingue simili possono entrare in conflitto</strong>: L'inglese e il francese possono entrambi utilizzare gli spazi bianchi per separare le parole, ma una volta applicate le elaborazioni specifiche della lingua, come la stemmatizzazione o la lemmatizzazione, le regole di una lingua possono interferire con quelle dell'altra. Ciò che migliora l'accuratezza per l'inglese potrebbe distorcere le query in francese e viceversa.</p></li>
</ul>
<p>In breve, <strong>lingue diverse richiedono analizzatori diversi</strong>. Cercare di elaborare il testo cinese con un analizzatore inglese porta al fallimento: non ci sono spazi da dividere e le regole di stemming inglesi possono corrompere i caratteri cinesi.</p>
<p>In definitiva? Affidarsi a un unico tokenizer e analizzatore per i set di dati multilingue rende quasi impossibile garantire una tokenizzazione coerente e di alta qualità in tutte le lingue. E questo porta direttamente a un peggioramento delle prestazioni di ricerca.</p>
<p>Quando i team hanno iniziato ad adottare la ricerca full-text in Milvus 2.5, abbiamo iniziato a sentire lo stesso feedback:</p>
<p><em>"È perfetto per le nostre ricerche in inglese, ma che dire dei nostri biglietti di assistenza clienti multilingue?". "Ci piace avere sia la ricerca vettoriale che quella BM25, ma il nostro set di dati comprende contenuti in cinese, giapponese e inglese". "Possiamo ottenere la stessa precisione di ricerca in tutte le nostre lingue?".</em></p>
<p>Queste domande hanno confermato ciò che avevamo già visto nella pratica: la ricerca full-text è fondamentalmente diversa dalla ricerca vettoriale. La somiglianza semantica funziona bene in tutte le lingue, ma una ricerca testuale accurata richiede una profonda comprensione della struttura di ciascuna lingua.</p>
<p>Ecco perché <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a> introduce una pipeline di analisi del testo completamente rinnovata con un supporto multilingue completo. Questo nuovo sistema applica automaticamente l'analizzatore corretto per ogni lingua, consentendo una ricerca full-text accurata e scalabile su set di dati multilingue, senza configurazione manuale o compromessi sulla qualità.</p>
<h2 id="How-Milvus-26-Enables-Robust-Multilingual-Full-Text-Search" class="common-anchor-header">Come Milvus 2.6 consente una robusta ricerca multilingue a tutto testo<button data-href="#How-Milvus-26-Enables-Robust-Multilingual-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Dopo un'intensa attività di ricerca e sviluppo, abbiamo creato una serie di funzioni che affrontano diversi scenari multilingue. Ogni approccio risolve il problema della dipendenza dalla lingua a modo suo.</p>
<h3 id="1-Multi-Language-Analyzer-Precision-Through-Control" class="common-anchor-header">1. Analizzatore multilingue: Precisione attraverso il controllo</h3><p>L'<a href="https://milvus.io/docs/multi-language-analyzers.md#Multi-language-Analyzers"><strong>analizzatore multilingue</strong></a> consente di definire regole di elaborazione del testo diverse per le varie lingue all'interno della stessa raccolta, invece di forzare tutte le lingue attraverso la stessa pipeline di analisi.</p>
<p><strong>Ecco come funziona:</strong> si configurano analizzatori specifici per ogni lingua e si etichetta ogni documento con la sua lingua durante l'inserimento. Quando si esegue una ricerca BM25, si specifica quale analizzatore linguistico utilizzare per l'elaborazione della query. In questo modo, sia i contenuti indicizzati che le query di ricerca vengono elaborati con le regole ottimali per le rispettive lingue.</p>
<p><strong>Perfetto per:</strong> Applicazioni in cui si conosce la lingua dei contenuti e si desidera la massima precisione di ricerca. Pensate alle basi di conoscenza multinazionali, ai cataloghi di prodotti localizzati o ai sistemi di gestione dei contenuti specifici per ogni regione.</p>
<p><strong>Il requisito:</strong> È necessario fornire metadati sulla lingua per ogni documento. Attualmente è disponibile solo per le operazioni di ricerca BM25.</p>
<h3 id="2-Language-Identifier-Tokenizer-Automatic-Language-Detection" class="common-anchor-header">2. Identificatore di lingua Tokenizer: Rilevamento automatico della lingua</h3><p>Sappiamo che etichettare manualmente ogni contenuto non è sempre pratico. Il <a href="https://milvus.io/docs/multi-language-analyzers.md#Overview"><strong>Language Identifier Tokenizer</strong></a> introduce il rilevamento automatico della lingua direttamente nella pipeline di analisi del testo.</p>
<p><strong>Ecco come funziona:</strong> Questo tokenizer intelligente analizza il testo in entrata, ne rileva la lingua grazie a sofisticati algoritmi di rilevamento e applica automaticamente le regole di elaborazione specifiche per la lingua. Si configura con più definizioni di analizzatori, uno per ogni lingua che si desidera supportare, oltre a un analizzatore predefinito di riserva.</p>
<p>Sono supportati due motori di rilevamento: <code translate="no">whatlang</code> per un'elaborazione più rapida e <code translate="no">lingua</code> per una maggiore precisione. Il sistema supporta 71-75 lingue, a seconda del rilevatore scelto. Durante l'indicizzazione e la ricerca, il tokenizer seleziona automaticamente l'analizzatore giusto in base alla lingua rilevata, tornando alla configurazione predefinita quando il rilevamento è incerto.</p>
<p><strong>Perfetto per:</strong> Ambienti dinamici con miscele linguistiche imprevedibili, piattaforme di contenuti generati dagli utenti o applicazioni in cui non è possibile effettuare il tagging linguistico manuale.</p>
<p><strong>Il compromesso: il</strong> rilevamento automatico aggiunge latenza di elaborazione e può avere difficoltà con testi molto brevi o contenuti in lingue miste. Tuttavia, per la maggior parte delle applicazioni reali, la convenienza supera notevolmente queste limitazioni.</p>
<h3 id="3-ICU-Tokenizer-Universal-Foundation" class="common-anchor-header">3. ICU Tokenizer: Fondazione universale</h3><p>Se le prime due opzioni vi sembrano eccessive, abbiamo qualcosa di più semplice per voi. Abbiamo integrato di recente il<a href="https://milvus.io/docs/icu-tokenizer.md#ICU"> tokenizzatore ICU (International Components for Unicode)</a> in Milvus 2.6. ICU esiste da sempre: è un insieme di librerie mature e ampiamente utilizzate che gestisce l'elaborazione del testo per tonnellate di lingue e scritture. La cosa bella è che può gestire diversi linguaggi complessi e semplici allo stesso tempo.</p>
<p>Il tokenizer ICU è onestamente un'ottima scelta predefinita. Utilizza regole standard Unicode per la suddivisione delle parole, il che lo rende affidabile per decine di lingue che non hanno un proprio tokenizzatore specializzato. Se avete bisogno di qualcosa di potente e generico che funzioni bene in più lingue, ICU fa al caso vostro.</p>
<p><strong>Limitazioni:</strong> ICU funziona ancora all'interno di un singolo analizzatore, quindi tutte le lingue finiscono per condividere gli stessi filtri. Volete fare cose specifiche per una lingua, come lo stemming o la lemmatizzazione? Si incorre negli stessi conflitti di cui abbiamo parlato prima.</p>
<p><strong>Dove brilla davvero:</strong> Abbiamo costruito ICU per funzionare come analizzatore predefinito nelle configurazioni multilingue o con identificatore di lingua. In pratica, è una rete di sicurezza intelligente per gestire le lingue che non sono state configurate esplicitamente.</p>
<h2 id="See-It-in-Action-Hands-On-Demo" class="common-anchor-header">Vedetelo in azione: Dimostrazione pratica<button data-href="#See-It-in-Action-Hands-On-Demo" class="anchor-icon" translate="no">
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
    </button></h2><p>Basta con la teoria: tuffiamoci nel codice! Ecco come utilizzare le nuove funzionalità multilingue di <strong>pymilvus</strong> per costruire una raccolta di ricerca multilingue.</p>
<p>Inizieremo con la definizione di alcune configurazioni riutilizzabili dell'analizzatore, per poi passare a <strong>due esempi completi</strong>:</p>
<ul>
<li><p>Uso dell'<strong>analizzatore multilingue</strong></p></li>
<li><p>Uso del <strong>Tokenizzatore di identificatori di lingua</strong></p></li>
</ul>
<h3 id="Step-1-Set-up-the-Milvus-Client" class="common-anchor-header">Passo 1: Configurare il client Milvus</h3><p><em>Per prima cosa, ci connettiamo a Milvus, impostiamo il nome di una raccolta e puliamo le raccolte esistenti per iniziare da capo.</em></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType

<span class="hljs-comment"># 1. Setup Milvus Client</span>
client = MilvusClient(<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
COLLECTION_NAME = <span class="hljs-string">&quot;multilingual_test&quot;</span>
<span class="hljs-keyword">if</span> client.has_collection(collection_name=COLLECTION_NAME):
    client.drop_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Define-Analyzers-for-Multiple-Languages" class="common-anchor-header">Passo 2: Definire gli analizzatori per più lingue</h3><p>Successivamente, definiamo un dizionario <code translate="no">analyzers</code> con configurazioni specifiche per ogni lingua. Queste saranno utilizzate in entrambi i metodi di ricerca multilingue illustrati più avanti.</p>
<pre><code translate="no"><span class="hljs-comment"># 2. Define analyzers for multiple languages</span>
<span class="hljs-comment"># These individual analyzer definitions will be reused by both methods.</span>
analyzers = {
    <span class="hljs-string">&quot;Japanese&quot;</span>: { 
        <span class="hljs-comment"># Use lindera with japanese dict &#x27;ipadic&#x27; </span>
        <span class="hljs-comment"># and remove punctuation beacuse lindera tokenizer will remain punctuation</span>
        <span class="hljs-string">&quot;tokenizer&quot;</span>:{
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;lindera&quot;</span>,
            <span class="hljs-string">&quot;dict_kind&quot;</span>: <span class="hljs-string">&quot;ipadic&quot;</span>
        },
        <span class="hljs-string">&quot;filter&quot;</span>: [<span class="hljs-string">&quot;removepunct&quot;</span>]
    },
    <span class="hljs-string">&quot;English&quot;</span>: {
        <span class="hljs-comment"># Use build-in english analyzer</span>
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>,
    },
    <span class="hljs-string">&quot;default&quot;</span>: {
        <span class="hljs-comment"># use icu tokenizer as a fallback.</span>
        <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;icu&quot;</span>,
    }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Option-A-Using-The-Multi-Language-Analyzer" class="common-anchor-header">Opzione A: Utilizzo dell'analizzatore multilingue</h3><p>Questo approccio è ottimale quando si <strong>conosce in anticipo la lingua di ogni documento</strong>. Queste informazioni verranno passate attraverso un campo dedicato <code translate="no">language</code> durante l'inserimento dei dati.</p>
<h4 id="Create-a-Collection-with-Multi-Language-Analyzer" class="common-anchor-header">Creare una raccolta con l'analizzatore multilingue</h4><p>Creeremo una raccolta in cui il campo <code translate="no">&quot;text&quot;</code> utilizza analizzatori diversi a seconda del valore del campo <code translate="no">language</code>.</p>
<pre><code translate="no"><span class="hljs-comment"># --- Option A: Using Multi-Language Analyzer ---</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Demonstrating Multi-Language Analyzer ---&quot;</span>)

<span class="hljs-comment"># 3A. reate a collection with the Multi Analyzer</span>

mutil_analyzer_params = {
    <span class="hljs-string">&quot;by_field&quot;</span>: <span class="hljs-string">&quot;language&quot;</span>,
    <span class="hljs-string">&quot;analyzers&quot;</span>: analyzers,
}

schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">True</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)<span class="hljs-comment"># Apply our multi-language analyzer to the &#x27;title&#x27; field</span>
schema.add_field(field_name=<span class="hljs-string">&quot;language&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">255</span>, nullable = <span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">25565</span>, enable_analyzer=<span class="hljs-literal">True</span>, multi_analyzer_params = mutil_analyzer_params)
schema.add_field(field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR) <span class="hljs-comment"># Bm25 Sparse Vector</span>

<span class="hljs-comment"># add bm25 function</span>
text_bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;text_sparse&quot;</span>],
)
schema.add_function(text_bm25_function)

index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>, <span class="hljs-comment"># Use auto index for BM25</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>,
)

client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema,
    index_params=index_params
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created successfully.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-Multilingual-Data-and-Load-Collection" class="common-anchor-header">Inserire dati multilingue e caricare la raccolta</h4><p>Inseriamo ora i documenti in inglese e in giapponese. Il campo <code translate="no">language</code> indica a Milvus quale analizzatore utilizzare.</p>
<pre><code translate="no"><span class="hljs-comment"># 4A. Insert data for Multi-Language Analyzer and load collection# Insert English and Japanese movie titles, explicitly setting the &#x27;language&#x27; field</span>
client.insert(
    collection_name=COLLECTION_NAME,
    data=[
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;The Lord of the Rings&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Spirited Away&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;千と千尋の神隠し&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># This is &quot;Spirited Away&quot; in Japanese</span>
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;君の名は。&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># This is &quot;Your Name.&quot; in Japanese</span>
    ]
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted multilingual data into &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;.&quot;</span>)

<span class="hljs-comment"># Load the collection into memory before searching</span>
client.load_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Run-Full-Text-Search" class="common-anchor-header">Eseguire la ricerca full-text</h4><p>Per effettuare la ricerca, specificare quale analizzatore utilizzare per la query in base alla lingua.</p>
<pre><code translate="no"><span class="hljs-comment"># 5A. Perform a full-text search with Multi-Language Analyzer# When searching, explicitly specify the analyzer to use for the query string.</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Search results for Multi-Language Analyzer ---&quot;</span>)
results_multi_jp = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;神隠し&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>, <span class="hljs-string">&quot;analyzer_name&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># Specify Japanese analyzer for query</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;神隠し&#x27; (Multi-Language Analyzer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_multi_jp[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

results_multi_en = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;Rings&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>, <span class="hljs-string">&quot;analyzer_name&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>}, <span class="hljs-comment"># Specify English analyzer for query</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;Rings&#x27; (Multi-Language Analyzer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_multi_en[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

client.drop_collection(collection_name=COLLECTION_NAME)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; dropped.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Results" class="common-anchor-header">Risultati:</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_results_561f628de3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Option-B-Using-the-Language-Identifier-Tokenizer" class="common-anchor-header">Opzione B: Uso del Tokenizer dell'identificatore di lingua</h3><p>Questo approccio elimina la gestione manuale della lingua. Il <strong>Tokenizer dell'identificatore di lingua</strong> rileva automaticamente la lingua di ogni documento e applica l'analizzatore corretto, senza bisogno di specificare un campo <code translate="no">language</code>.</p>
<h4 id="Create-a-Collection-with-Language-Identifier-Tokenizer" class="common-anchor-header">Creare una raccolta con il Tokenizer dell'identificatore di lingua</h4><p>In questo caso, creiamo una raccolta in cui il campo <code translate="no">&quot;text&quot;</code> utilizza il rilevamento automatico della lingua per scegliere l'analizzatore corretto.</p>
<pre><code translate="no"><span class="hljs-comment"># --- Option B: Using Language Identifier Tokenizer ---</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Demonstrating Language Identifier Tokenizer ---&quot;</span>)

<span class="hljs-comment"># 3A. create a collection with language identifier</span>
analyzer_params_langid = {
    <span class="hljs-string">&quot;tokenizer&quot;</span>: {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;language_identifier&quot;</span>,
        <span class="hljs-string">&quot;analyzers&quot;</span>: analyzers <span class="hljs-comment"># Referencing the analyzers defined in Step 2</span>
    },
}

schema_langid = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">True</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)
schema_langid.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-comment"># The &#x27;language&#x27; field is not strictly needed by the analyzer itself here, as detection is automatic.# However, you might keep it for metadata purposes.</span>
schema_langid.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">25565</span>, enable_analyzer=<span class="hljs-literal">True</span>, analyzer_params = analyzer_params_langid)
schema_langid.add_field(field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR) <span class="hljs-comment"># BM25 Sparse Vector# add bm25 function</span>
text_bm25_function_langid = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;text_sparse&quot;</span>],
)
schema_langid.add_function(text_bm25_function_langid)

index_params_langid = client.prepare_index_params()
index_params_langid.add_index(
    field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>, <span class="hljs-comment"># Use auto index for BM25</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>,
)

client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema_langid,
    index_params=index_params_langid
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created successfully with Language Identifier Tokenizer.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-Data-and-Load-Collection" class="common-anchor-header">Inserire i dati e caricare la raccolta</h4><p>Inserite testi in lingue diverse, senza bisogno di etichettarli. Milvus rileva e applica automaticamente l'analizzatore corretto.</p>
<pre><code translate="no"><span class="hljs-comment"># 4B. Insert Data for Language Identifier Tokenizer and Load Collection</span>
<span class="hljs-comment"># Insert English and Japanese movie titles. The language_identifier will detect the language.</span>
client.insert(
    collection_name=COLLECTION_NAME,
    data=[
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;The Lord of the Rings&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Spirited Away&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;千と千尋の神隠し&quot;</span>}, 
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;君の名は。&quot;</span>},
    ]
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted multilingual data into &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;.&quot;</span>)

<span class="hljs-comment"># Load the collection into memory before searching</span>
client.load_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Run-Full-Text-Search" class="common-anchor-header">Eseguire la ricerca a tutto testo</h4><p>Ecco la parte migliore: <strong>non è necessario specificare un analizzatore</strong> durante la ricerca. Il tokenizer rileva automaticamente la lingua della query e applica la logica corretta.</p>
<pre><code translate="no"><span class="hljs-comment"># 5B. Perform a full-text search with Language Identifier Tokenizer# No need to specify analyzer_name in search_params; it&#x27;s detected automatically for the query.</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Search results for Language Identifier Tokenizer ---&quot;</span>)
results_langid_jp = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;神隠し&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>}, <span class="hljs-comment"># Analyzer automatically determined by language_identifier</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;神隠し&#x27; (Language Identifier Tokenizer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_langid_jp[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

results_langid_en = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;the Rings&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>}, <span class="hljs-comment"># Analyzer automatically determined by language_identifier</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;the Rings&#x27; (Language Identifier Tokenizer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_langid_en[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

client.drop_collection(collection_name=COLLECTION_NAME)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; dropped.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Results" class="common-anchor-header">Risultati</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_results_486712c3f6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusione<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 fa un grande passo avanti nel rendere la <strong>ricerca ibrida</strong> più potente e accessibile, combinando la ricerca vettoriale con la ricerca per parole chiave, ora in più lingue. Grazie al supporto multilingue migliorato, è possibile creare applicazioni che capiscono <em>ciò che gli utenti intendono</em> e <em>ciò che dicono</em>, indipendentemente dalla lingua che utilizzano.</p>
<p>Ma questa è solo una parte dell'aggiornamento. Milvus 2.6 introduce anche diverse altre funzioni che rendono la ricerca più veloce, più intelligente e più facile da usare:</p>
<ul>
<li><p><strong>Migliore corrispondenza delle query</strong> - Utilizzo di <code translate="no">phrase_match</code> e <code translate="no">multi_match</code> per ricerche più accurate.</p></li>
<li><p><strong>Filtro JSON più veloce</strong> - Grazie a un nuovo indice dedicato ai campi JSON.</p></li>
<li><p><strong>Ordinamento basato su scalari</strong> - Ordina i risultati in base a qualsiasi campo numerico</p></li>
<li><p><strong>Reranking avanzato</strong> - Riordina i risultati utilizzando modelli o una logica di punteggio personalizzata</p></li>
</ul>
<p>Volete la descrizione completa di Milvus 2.6? Consultate il nostro ultimo post: <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Presentazione di Milvus 2.6: Ricerca vettoriale accessibile su scala miliardaria</strong></a><strong>.</strong></p>
<p>Avete domande o volete un approfondimento su una qualsiasi funzionalità? Unitevi al nostro<a href="https://discord.com/invite/8uyFbECzPX"> canale Discord</a> o inviate problemi su<a href="https://github.com/milvus-io/milvus"> GitHub</a>.</p>
