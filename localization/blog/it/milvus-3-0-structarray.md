---
id: milvus-3-0-structarray.md
title: >-
  You haven't provided the HTML content to translate, only the title. Please
  paste the full HTML article about "One Entity, Many Vectors: Entity- and
  Element-Level Search with Milvus 3.0 StructArray" so I can translate it into
  Italian while preserving the HTML structure.
author: Chenjie Tang
date: 2026-8-19
cover: assets.zilliz.com/milvus_3_0_entity_and_element_level_search_28bba6d843.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus 3.0, StructArray, multi-vector search, EmbeddingList search,
  element-level search
meta_title: |
  Milvus 3.0 StructArray: Multi-Vector Search Within One Entity
desc: >-
  Un'entità può contenere più vettori allineati e campi di metadati, e Milvus
  può cercare sia l'intera entità sia un singolo elemento senza appiattire i
  dati in righe separate.
origin: 'https://milvus.io/blog/milvus-3-0-structarray.md'
---
```html
<p>La maggior parte degli schemi di database vettoriali parte da un'ipotesi semplice: un'entità, un embedding. Un prodotto riceve un vettore, così come un documento. Una query utente viene convertita in embedding e confrontata con quei vettori tramite la ricerca del vicino più prossimo approssimato (ANN). Questo modello funziona per la prima generazione di casi d'uso della ricerca vettoriale, inclusi RAG, ricerca semantica e sistemi di raccomandazione.</p>
<p><strong>I dati AI del mondo reale, tuttavia, raramente soddisfano questa ipotesi.</strong> Un video contiene clip, inquadrature o keyframe, ciascuno con il proprio embedding, intervallo temporale, didascalia, etichetta della scena e punteggio di confidenza. Un prodotto può avere diverse immagini e angolazioni. Un documento lungo contiene passaggi o sezioni il cui significato locale conta più di un singolo embedding dell'intero documento. I popolari modelli a interazione tardiva evidenziano la stessa limitazione con una granularità ancora più fine: ColBERT produce un vettore per token, mentre ColPali produce un vettore per patch visiva.</p>
<p>In ogni caso, l'entità padre rimane l'unità che l'applicazione memorizza, visualizza, protegge e restituisce. Eppure la rilevanza, il filtraggio e la spiegazione dei risultati dipendono spesso dagli elementi all'interno di quell'entità.</p>
<p><strong>La nuova funzionalità StructArray offre a Milvus un modello dati nativo per questa forma: un'entità contiene un array ordinato di elementi Struct definiti dallo schema, e ogni elemento può trasportare metadati scalari, embedding vettoriali, o entrambi.</strong> Milvus può filtrare i campi che appartengono allo stesso elemento, confrontare due liste di embedding a livello di entità, oppure cercare singoli elementi e restituire l'offset corrispondente.</p>
<p>Questo articolo utilizza un esempio di ricerca video per spiegare il modello dati, poi lo analizza attraverso la progettazione dello schema, il filtraggio, le granularità della ricerca vettoriale, le strategie di indicizzazione di EmbeddingList, il collasso dei risultati ibridi e il layout fisico che rende eseguibile la funzionalità.</p>
<h2 id="Why-one-vector-and-one-flat-row-model-are-no-longer-enough" class="common-anchor-header">Perché un singolo vettore e un modello a righe piatte non bastano più<button data-href="#Why-one-vector-and-one-flat-row-model-are-no-longer-enough" class="anchor-icon" translate="no">
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
    </button></h2><p>Considera un utente che cerca in un catalogo video "una persona che taglia verdure in cucina." Il segnale rilevante può trovarsi in una clip di otto secondi, non in un embedding dell'intero video. <strong>Comprimere ogni clip, oggetto e azione in un singolo vettore può preservare il tema generale, ma può attenuare i dettagli locali.</strong></p>
<p>La stessa discrepanza appare in altri carichi di lavoro:</p>
<ul>
<li>La rilevanza di un prodotto può derivare da una delle diverse immagini o angolazioni.</li>
<li>Un documento può corrispondere grazie a un passaggio piuttosto che al suo argomento generale.</li>
<li>La memoria di un agente può contenere diverse osservazioni, di cui solo una è rilevante per il compito corrente.</li>
<li>Un record ColBERT o ColPali contiene una lista di lunghezza variabile di vettori di token o patch, piuttosto che un singolo vettore denso.</li>
</ul>
<p>Un'alternativa è suddividere ogni clip, immagine o passaggio in una riga di database separata. Questo abilita la ricerca locale, ma separa anche ogni frammento dalla sua entità padre. I metadati dell'entità padre possono essere ripetuti tra le righe, e il recupero a livello di entità richiede quindi raggruppamento, deduplicazione e ri-ranking dopo la ricerca dei frammenti.</p>
<p>La memorizzazione annidata da sola non risolve il problema delle query. JSON può memorizzare oggetti, ma non offre a Milvus uno schema di sottocampi predefinito per l'indicizzazione vettoriale e scalare. Gli array paralleli possono memorizzare didascalie, etichette delle scene e valori di confidenza, ma l'applicazione deve mantenere l'allineamento degli offset. Il database non può dedurre in sicurezza che <code translate="no">scene_type[3]</code> e <code translate="no">label_confidence[3]</code> descrivano la stessa clip, a meno che quella relazione non faccia parte del modello dati.</p>
<p>StructArray codifica direttamente questa relazione. Mantiene gli elementi locali all'interno dell'entità padre, esponendo i loro sottocampi allineati alla validazione dello schema, all'indicizzazione, al filtraggio e alla ricerca vettoriale.</p>
<h2 id="What-is-StructArray-and-its-data-model" class="common-anchor-header">Cos'è StructArray e qual è il suo modello dati?<button data-href="#What-is-StructArray-and-its-data-model" class="anchor-icon" translate="no">
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
    </button></h2><p>Una StructArray, nota anche come array di struct, memorizza un insieme ordinato di elementi Struct in ogni entità. Un campo StructArray è un <code translate="no">Array</code> i cui elementi seguono tutti un unico schema <code translate="no">Struct</code> predefinito. Per una collezione video, la forma logica potrebbe essere questa:</p>
<pre><code translate="no">Plaintext
clips: ARRAY&lt;STRUCT&lt;
    clip_embedding_list: FLOAT_VECTOR,
    clip_embedding: FLOAT_VECTOR,
    start_sec: DOUBLE,
    end_sec: DOUBLE,
    caption: VARCHAR,
    scene_type: VARCHAR,
    label_confidence: FLOAT
&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Ecco:</p>
<ul>
<li><code translate="no">clips</code> è il campo StructArray padre.</li>
<li><code translate="no">clip_embedding_list</code>, <code translate="no">clip_embedding</code>, <code translate="no">start_sec</code> e gli altri attributi sono sottocampi.</li>
<li><code translate="no">clips[0]</code> è la prima clip.</li>
<li>Ogni sottocampo all'offset <code translate="no">0</code> appartiene alla stessa clip.</li>
<li>Ogni sottocampo all'offset <code translate="no">3</code> appartiene a un'altra clip.</li>
</ul>
<p>I due sottocampi vettoriali servono modalità di ricerca diverse. <code translate="no">clips[clip_embedding_list]</code> viene indicizzato con una metrica <code translate="no">MAX_SIM*</code> per la ricerca EmbeddingList a livello di entità, mentre <code translate="no">clips[clip_embedding]</code> viene indicizzato con una metrica vettoriale regolare per la ricerca a livello di elemento. Poiché un campo vettoriale o un sottocampo vettoriale accetta un solo indice, una collezione che necessita di entrambe le modalità deve definire e indicizzare i due sottocampi separatamente.</p>
<p>Questo modello supporta tre semantiche di query distinte.</p>
<h3 id="1-EmbeddingList-search-returns-parent-entities" class="common-anchor-header">1. La ricerca EmbeddingList restituisce le entità padre</h3><p>I vettori in <code translate="no">clips[clip_embedding_list]</code> formano una lista di embedding per il video. Anche la query è una <code translate="no">EmbeddingList</code>. Milvus confronta la lista della query con ogni lista memorizzata usando una metrica <code translate="no">MAX_SIM*</code> e restituisce un risultato a livello di entità.</p>
<pre><code translate="no">Plaintext
clips[clip_embedding_list] = [
    embedding_0,
    embedding_1,
    embedding_2,
    ...
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-The-MATCH-family-filters-parent-entities" class="common-anchor-header">2. La famiglia <code translate="no">MATCH_*</code> filtra le entità padre</h3><p><code translate="no">MATCH_ANY</code>, <code translate="no">MATCH_ALL</code>, <code translate="no">MATCH_LEAST</code>, <code translate="no">MATCH_MOST</code> e <code translate="no">MATCH_EXACT</code> valutano un predicato sugli elementi Struct, contano quanti elementi lo soddisfano e decidono se l'entità padre supera il filtro.</p>
<p>Per esempio:</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">MATCH_ANY</span><span class="hljs-params">(clips, $[scene_type] == <span class="hljs-string">&quot;kitchen&quot;</span> &amp;&amp; $[label_confidence] &gt; <span class="hljs-number">0.8</span>)</span>
<button class="copy-code-btn"></button></code></pre>
<p>Entrambe le condizioni scalari devono essere vere allo stesso offset di clip. Milvus non combina un'etichetta "kitchen" da una clip con un valore di alta confidenza da un'altra.</p>
<h3 id="3-Element-level-search-returns-the-matching-element-offset" class="common-anchor-header">3. La ricerca a livello di elemento restituisce l'offset dell'elemento corrispondente</h3><p>Un vettore di query regolare può cercare ogni vettore in <code translate="no">clips[clip_embedding]</code> in modo indipendente. Ogni risultato identifica l'entità padre e l'offset a base zero dell'elemento Struct corrispondente. Un <code translate="no">element_filter</code> può limitare quali elementi partecipano a quella ricerca vettoriale.</p>
<p>Queste operazioni condividono una premessa: Milvus sa quali valori vettoriali e scalari appartengono allo stesso elemento, e quali elementi appartengono alla stessa entità.</p>
<p>StructArray non è un sistema di annidamento arbitrario generico. Il suo modello attuale è un <code translate="no">Array</code> di elementi <code translate="no">Struct</code> con sottocampi scalari e vettoriali supportati. Questo confine rende trattabile l'indicizzazione dei sottocampi e l'esecuzione consapevole degli elementi.</p>
<h2 id="Build-the-schema-indexes-and-insert-path" class="common-anchor-header">Costruisci schema, indici e percorso di inserimento<button data-href="#Build-the-schema-indexes-and-insert-path" class="anchor-icon" translate="no">
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
    </button></h2><p>Il seguente esempio PyMilvus semplificato crea una collezione video con un vettore di primo livello e una StructArray per le clip. Utilizza sottocampi vettoriali separati per le clip, così la stessa collezione può dimostrare entrambe le modalità di ricerca.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> DataType, MilvusClient

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

schema = client.create_schema(auto_id=<span class="hljs-literal">False</span>, enable_dynamic_field=<span class="hljs-literal">False</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;title&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;video_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)

<span class="hljs-comment"># Define the Struct schema explicitly.</span>
clip_schema = client.create_struct_field_schema()
clip_schema.add_field(<span class="hljs-string">&quot;clip_embedding_list&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)
clip_schema.add_field(<span class="hljs-string">&quot;clip_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)
clip_schema.add_field(<span class="hljs-string">&quot;start_sec&quot;</span>, DataType.DOUBLE)
clip_schema.add_field(<span class="hljs-string">&quot;end_sec&quot;</span>, DataType.DOUBLE)
clip_schema.add_field(<span class="hljs-string">&quot;caption&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">2048</span>)
clip_schema.add_field(<span class="hljs-string">&quot;scene_type&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">128</span>)
clip_schema.add_field(<span class="hljs-string">&quot;label_confidence&quot;</span>, DataType.FLOAT)

schema.add_field(
    <span class="hljs-string">&quot;clips&quot;</span>,
    datatype=DataType.ARRAY,
    element_type=DataType.STRUCT,
    struct_schema=clip_schema,
    max_capacity=<span class="hljs-number">1024</span>,
)

client.create_collection(<span class="hljs-string">&quot;videos&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p>I sottocampi vettoriali devono essere indicizzati prima della ricerca. Poiché la famiglia di metriche determina la modalità di ricerca, ogni sottocampo vettoriale riceve il proprio indice:</p>
<pre><code translate="no" class="language-python">index_params = client.prepare_index_params()

<span class="hljs-meta"># EmbeddingList search.</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;clips[clip_embedding_list]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
    index_name=<span class="hljs-string">&quot;clips_clip_embedding_list_maxsim_idx&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>},
)

<span class="hljs-meta"># Element-level search.</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    index_name=<span class="hljs-string">&quot;clips_clip_embedding_cosine_idx&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>},
)

client.create_index(<span class="hljs-string">&quot;videos&quot;</span>, index_params=index_params)
<button class="copy-code-btn"></button></code></pre>
<p>Gli indici scalari sono facoltativi, ma i sottocampi che compaiono frequentemente in filtri su larga scala dovrebbero utilizzare un indice scalare compatibile. Per esempio, <code translate="no">clips[scene_type]</code> può utilizzare un indice invertito, mentre un sottocampo numerico come <code translate="no">clips[label_confidence]</code> può utilizzare un indice adatto al filtraggio numerico.</p>
<p>Inserisci i dati nella loro forma naturale di entità: una riga video con un array di oggetti clip. Per mantenere l'esempio compatto, scrive lo stesso vettore di clip in entrambi i sottocampi vettoriali.</p>
<pre><code translate="no" class="language-python">rows = [
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;cooking tutorial&quot;</span>,
        <span class="hljs-string">&quot;video_embedding&quot;</span>: video_vec,
        <span class="hljs-string">&quot;clips&quot;</span>: [
            {
                <span class="hljs-string">&quot;clip_embedding_list&quot;</span>: clip_vec_1,
                <span class="hljs-string">&quot;clip_embedding&quot;</span>: clip_vec_1,
                <span class="hljs-string">&quot;start_sec&quot;</span>: <span class="hljs-number">0.0</span>,
                <span class="hljs-string">&quot;end_sec&quot;</span>: <span class="hljs-number">8.0</span>,
                <span class="hljs-string">&quot;caption&quot;</span>: <span class="hljs-string">&quot;A person washes vegetables.&quot;</span>,
                <span class="hljs-string">&quot;scene_type&quot;</span>: <span class="hljs-string">&quot;kitchen&quot;</span>,
                <span class="hljs-string">&quot;label_confidence&quot;</span>: <span class="hljs-number">0.92</span>,
            },
            {
                <span class="hljs-string">&quot;clip_embedding_list&quot;</span>: clip_vec_2,
                <span class="hljs-string">&quot;clip_embedding&quot;</span>: clip_vec_2,
                <span class="hljs-string">&quot;start_sec&quot;</span>: <span class="hljs-number">8.0</span>,
                <span class="hljs-string">&quot;end_sec&quot;</span>: <span class="hljs-number">16.0</span>,
                <span class="hljs-string">&quot;caption&quot;</span>: <span class="hljs-string">&quot;A person cuts carrots on a board.&quot;</span>,
                <span class="hljs-string">&quot;scene_type&quot;</span>: <span class="hljs-string">&quot;kitchen&quot;</span>,
                <span class="hljs-string">&quot;label_confidence&quot;</span>: <span class="hljs-number">0.96</span>,
            },
        ],
    }
]

client.<span class="hljs-title function_">insert</span>(<span class="hljs-string">&quot;videos&quot;</span>, rows)
client.<span class="hljs-title function_">flush</span>(<span class="hljs-string">&quot;videos&quot;</span>)
client.<span class="hljs-title function_">load_collection</span>(<span class="hljs-string">&quot;videos&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Al confine dell'API, <code translate="no">clips</code> rimane un array di oggetti strutturati. All'interno di Milvus, ogni sottocampo segue il percorso tipizzato richiesto per il proprio indice, filtro e comportamento di output. Questa distinzione è trasparente al momento dell'inserimento, ma fondamentale per tutto ciò che segue.</p>
<h2 id="Same-element-filtering-is-the-difference-between-structure-and-parallel-arrays" class="common-anchor-header">Il filtraggio sullo stesso elemento è la differenza tra struttura e array paralleli<button data-href="#Same-element-filtering-is-the-difference-between-structure-and-parallel-arrays" class="anchor-icon" translate="no">
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
    </button></h2><p>Il vantaggio principale del filtraggio non è una sintassi più breve per i campi annidati. È la correlazione corretta tra i sottocampi scalari.</p>
<p>Supponiamo che l'applicazione abbia bisogno di video contenenti una clip in cucina con confidenza dell'etichetta superiore a <code translate="no">0.8</code>. Non basta che un video contenga una clip in cucina e una clip ad alta confidenza; la stessa clip deve soddisfare entrambe le condizioni.</p>
<p>La famiglia <code translate="no">MATCH_*</code> di StructArray esprime questo direttamente:</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">MATCH_ANY</span><span class="hljs-params">(clips, $[scene_type] == <span class="hljs-string">&quot;kitchen&quot;</span> &amp;&amp; $[label_confidence] &gt; <span class="hljs-number">0.8</span>)</span>
MATCH_ALL(clips, $[label_confidence] &gt; <span class="hljs-number">0.5</span>)
MATCH_LEAST(clips, $[scene_type] == <span class="hljs-string">&quot;sports&quot;</span>, threshold=<span class="hljs-number">3</span>)
MATCH_MOST(clips, $[label_confidence] &lt; <span class="hljs-number">0.2</span>, threshold=<span class="hljs-number">1</span>)
MATCH_EXACT(clips, $[scene_type] == <span class="hljs-string">&quot;intro&quot;</span>, threshold=<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus valuta il predicato a ogni offset di elemento, quindi applica il quantificatore dell'operatore per decidere se l'entità padre supera il filtro:</p>
<ul>
<li><code translate="no">MATCH_ANY</code>: almeno un elemento corrisponde.</li>
<li><code translate="no">MATCH_ALL</code>: tutti gli elementi corrispondono.</li>
<li><code translate="no">MATCH_LEAST</code>: almeno <code translate="no">threshold</code> elementi corrispondono.</li>
<li><code translate="no">MATCH_MOST</code>: al massimo <code translate="no">threshold</code> elementi corrispondono.</li>
<li><code translate="no">MATCH_EXACT</code>: esattamente <code translate="no">threshold</code> elementi corrispondono.</li>
</ul>
<p>Se gli stessi dati fossero memorizzati come due array indipendenti, la seguente espressione non preserverebbe quella correlazione:</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">array_contains</span><span class="hljs-params">(clips[scene_type], <span class="hljs-string">&quot;kitchen&quot;</span>)</span>
AND
<span class="hljs-title function_">array_contains</span><span class="hljs-params">(clips[label_confidence], <span class="hljs-number">0.9</span>)</span>
<button class="copy-code-btn"></button></code></pre>
<p>I due valori potrebbero trovarsi a offset diversi. Questo può essere valido per attributi non correlati, ma è errato quando entrambe le condizioni descrivono la stessa clip, immagine di prodotto o passaggio di documento.</p>
<p>StructArray rende l'identità dell'elemento parte del predicato del database, piuttosto che una convenzione che l'applicazione deve applicare.</p>
<h2 id="Two-vector-search-granularities-two-result-identities" class="common-anchor-header">Due granularità di ricerca vettoriale, due identità dei risultati<button data-href="#Two-vector-search-granularities-two-result-identities" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando un'entità memorizza più vettori, il recupero deve risolvere una questione di modellazione prima che inizi la ricerca ANN:</p>
<p><strong>I vettori devono essere valutati insieme come un'unica rappresentazione dell'entità padre, oppure ogni vettore di elemento deve competere in modo indipendente?</strong></p>
<p>StructArray supporta entrambi i modelli, ma utilizzano forme di query, famiglie di metriche, sottocampi vettoriali e identità dei risultati diverse.</p>
<h3 id="EmbeddingList-search-a-list-of-query-vectors-finds-an-entity" class="common-anchor-header">Ricerca EmbeddingList: una lista di vettori di query trova un'entità</h3><p>Una query <code translate="no">EmbeddingList</code> contiene più vettori. Un video di query potrebbe essere suddiviso in più clip; una query di prodotto potrebbe contenere più immagini di riferimento; una query ColBERT contiene un vettore per token della query.</p>
<p>Per ogni entità, Milvus confronta la lista della query con la lista di embedding memorizzata dell'entità. Con il punteggio in stile MaxSim, ogni vettore di query seleziona la sua migliore corrispondenza nella lista dell'entità, e Milvus aggrega questi punteggi di migliore corrispondenza in un punteggio di entità. Il risultato finale rappresenta l'entità padre, non un particolare elemento Struct.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus.client.embedding_list import EmbeddingList

query = EmbeddingList()
query.<span class="hljs-keyword">add</span>(query_clip_vec_1)
query.<span class="hljs-keyword">add</span>(query_clip_vec_2)

client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding_list]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>},
    limit=<span class="hljs-number">10</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Questa ricerca risponde: <strong>Quali video sono la migliore corrispondenza complessiva per questo insieme di clip di query?</strong></p>
<p>Si adatta al recupero video-video, alla ricerca di prodotti con più immagini, al recupero in stile ColBERT e ColPali, e ad altri casi in cui sia la query che l'entità memorizzata sono rappresentate da più vettori.</p>
<h3 id="Element-level-search-one-query-vector-finds-a-clip-inside-an-entity" class="common-anchor-header">Ricerca a livello di elemento: un vettore di query trova una clip all'interno di un'entità</h3><p>La ricerca a livello di elemento utilizza un vettore di query regolare. Ogni vettore in <code translate="no">clips[clip_embedding]</code> partecipa alla ricerca ANN come candidato indipendente. Ogni risultato identifica l'entità padre e l'offset dell'elemento corrispondente.</p>
<pre><code translate="no" class="language-python">client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    <span class="hljs-built_in">limit</span>=10,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;clips&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Per cercare solo clip selezionate, allega un <code translate="no">element_filter</code> le cui condizioni scalari si applicano alla stessa clip:</p>
<pre><code translate="no" class="language-python">client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;element_filter(clips, $[scene_type] == &quot;kitchen&quot; &amp;&amp; $[label_confidence] &gt; 0.8)&#x27;</span>,
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;clips&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Il filtro non seleziona prima una clip in cucina e poi cerca una clip diversa ad alta confidenza. Sia i predicati che il candidato vettoriale si riferiscono allo stesso elemento Struct.</p>
<p>Una risposta non raggruppata potrebbe apparire così:</p>
<pre><code translate="no">Plaintext
<span class="hljs-built_in">id</span> = <span class="hljs-number">1</span>, offset = <span class="hljs-number">1</span>, distance = <span class="hljs-number">0.91</span>
<span class="hljs-built_in">id</span> = <span class="hljs-number">8</span>, offset = <span class="hljs-number">4</span>, distance = <span class="hljs-number">0.88</span>
<span class="hljs-built_in">id</span> = <span class="hljs-number">1</span>, offset = <span class="hljs-number">3</span>, distance = <span class="hljs-number">0.84</span>
<button class="copy-code-btn"></button></code></pre>
<p>La stessa entità può apparire più di una volta perché più clip possono corrispondere. Questo è utile quando l'applicazione deve mostrare non solo quale video o documento è rilevante, ma anche quale clip o passaggio ha prodotto la corrispondenza.</p>
<table>
<thead>
<tr><th>Aspetto</th><th>Ricerca EmbeddingList</th><th>Ricerca a livello di elemento</th></tr>
</thead>
<tbody>
<tr><td>Input della query</td><td>Uno o più vettori di query in una <code translate="no">EmbeddingList</code></td><td>Un vettore di query regolare</td></tr>
<tr><td>Esempio di destinazione</td><td><code translate="no">clips[clip_embedding_list]</code></td><td><code translate="no">clips[clip_embedding]</code></td></tr>
<tr><td>Famiglia di metriche</td><td><code translate="no">MAX_SIM*</code></td><td>Metriche regolari come <code translate="no">COSINE</code>, <code translate="no">IP</code> o <code translate="no">L2</code></td></tr>
<tr><td>Unità candidata ANN</td><td>La lista di embedding dell'entità padre</td><td>Ogni vettore di elemento Struct</td></tr>
<tr><td>Identità del risultato</td><td>Entità padre</td><td>Entità padre più offset dell'elemento</td></tr>
<tr><td>Caso d'uso tipico</td><td>Confrontare una query multi-vettore con un'entità multi-vettore</td><td>Trovare la clip, l'immagine, il passaggio, la patch o il fatto più rilevante</td></tr>
</tbody>
</table>
<p>Per supportare entrambe le modalità in un'unica collezione, definisci e indicizza sottocampi vettoriali separati. La forma della query, la famiglia di metriche e l'indice di destinazione devono concordare.</p>
<h2 id="EmbeddingList-indexing-is-a-quality-cost-decision" class="common-anchor-header">L'indicizzazione di EmbeddingList è una scelta tra qualità e costo<button data-href="#EmbeddingList-indexing-is-a-quality-cost-decision" class="anchor-icon" translate="no">
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
    </button></h2><p>Con un embedding per entità, un indice ANN trova le entità vicine a un vettore di query. La ricerca EmbeddingList è più costosa perché la rilevanza dipende dalle interazioni a coppie tra due liste di vettori.</p>
<p>Calcolare il MaxSim esatto contro ogni vettore in ogni entità produce la classificazione di riferimento più pulita, ma una scansione completa è di solito troppo costosa per il recupero online. Milvus utilizza quindi un modello a due fasi:</p>
<ol>
<li>Una strategia approssimata recupera le entità padre candidate.</li>
<li>Quando <code translate="no">emb_list_rerank</code> è abilitato, Milvus ricalcola il MaxSim su quei candidati per produrre la classificazione finale.</li>
</ol>
<p>Recuperare più candidati in prima fase migliora generalmente la probabilità che i veri risultati migliori raggiungano il ri-rank, ma aumenta anche latenza e calcolo. Le tre strategie differiscono principalmente nel modo in cui producono quell'insieme di candidati.</p>
<table>
<thead>
<tr><th>Strategia</th><th>Rappresentazione dei candidati in prima fase</th><th>Buon punto di partenza quando</th><th>Compromesso principale</th></tr>
</thead>
<tbody>
<tr><td>TokenANN</td><td>Indicizza ogni vettore in ogni lista di embedding. I vettori di query eseguono ANN in modo indipendente; le corrispondenze vengono aggregate nuovamente alle entità padre prima del ri-rank MaxSim.</td><td>La qualità è la priorità, le liste sono corte o medie e i singoli vettori sono discriminativi.</td><td>La dimensione dell'indice e il lavoro di ricerca in prima fase crescono con la lunghezza della lista e il numero di vettori di query.</td></tr>
<tr><td>MUVERA</td><td>Codifica ogni lista di embedding in un vettore a dimensionalità fissa tramite proiezioni casuali, poi esegue ANN ordinario.</td><td>TokenANN è troppo pesante e si preferisce una compressione senza pipeline di addestramento.</td><td>La codifica perde informazioni; impostazioni di proiezione più forti aumentano la dimensionalità codificata e il costo ANN.</td></tr>
<tr><td>LEMUR</td><td>Addestra un modello che mappa una lista di embedding a un vettore di entità padre a dimensionalità fissa.</td><td>Gli embedding sono meno discriminativi, le liste sono grandi o il carico di lavoro è visivo o multimodale.</td><td>Richiede addestramento e può essere sensibile alla distribuzione del corpus e al bias sulla lunghezza dei documenti.</td></tr>
</tbody>
</table>
<p>Nessuna singola strategia è la migliore per ogni carico di lavoro. Inizia dai dati di destinazione e dalla distribuzione delle query:</p>
<ul>
<li>Usa TokenANN come baseline quality-first quando la dimensione del dataset lo consente.</li>
<li>Prova MUVERA quando l'indice di TokenANN o il recupero dei candidati diventa troppo costoso con la crescita della lunghezza delle liste e vuoi evitare una pipeline di addestramento.</li>
<li>Valuta LEMUR quando lo spazio degli embedding è rumoroso o debolmente discriminativo, o quando il carico di lavoro è visivo o multimodale.</li>
<li>Misura recall o nDCG insieme a latenza e dimensione dell'indice. Una strategia che funziona per testi brevi può comportarsi diversamente con lunghezze di documenti a coda lunga o migliaia di patch visive.</li>
</ul>
<p>StructArray affronta un problema: come rappresentare elementi allineati, filtrabili e dotati di vettori all'interno di un'unica entità. La strategia EmbeddingList ne affronta un altro: come approssimare MaxSim a un costo accettabile per un particolare modello e corpus.</p>
<h2 id="Hybrid-search-makes-result-identity-explicit" class="common-anchor-header">La ricerca ibrida rende esplicita l'identità dei risultati<button data-href="#Hybrid-search-makes-result-identity-explicit" class="anchor-icon" translate="no">
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
    </button></h2><p>Il recupero in produzione raramente segue un unico percorso vettoriale. Una richiesta video può combinare un embedding video di primo livello, uno o più embedding a livello di clip, un segnale di didascalia o trascrizione e un ri-rank.</p>
<p>Una volta che i candidati a livello di elemento entrano in quella pipeline, il motore deve decidere cosa identifica un candidato finale.</p>
<table>
<thead>
<tr><th>Composizione della richiesta ibrida</th><th>Ambito del candidato finale</th><th>Identità del risultato</th></tr>
</thead>
<tbody>
<tr><td>Tutte le sotto-ricerche sono a livello di elemento e targetizzano sottocampi vettoriali sotto la stessa StructArray</td><td>Livello di elemento</td><td>Chiave primaria più campo StructArray più offset dell'elemento</td></tr>
<tr><td>È incluso un campo vettoriale di primo livello</td><td>Livello di entità</td><td>Chiave primaria</td></tr>
<tr><td>È inclusa una richiesta EmbeddingList</td><td>Livello di entità</td><td>Chiave primaria</td></tr>
<tr><td>Le richieste a livello di elemento targetizzano campi StructArray diversi</td><td>Livello di entità</td><td>Chiave primaria</td></tr>
</tbody>
</table>
<p>La prima configurazione preserva l'identità dell'elemento perché l'offset <code translate="no">3</code> si riferisce allo stesso elemento Struct per ogni sotto-ricerca sotto una data StructArray padre. Questo si adatta a un'applicazione che vuole restituire la clip o il passaggio più rilevante dopo aver fuso diversi segnali a livello di elemento.</p>
<p>Le altre configurazioni mescolano granularità dei candidati o namespace di elementi. Un risultato a livello di elemento deve quindi essere collassato in un punteggio a livello di entità prima del ri-rank finale. Milvus supporta diverse strategie di collasso:</p>
<table>
<thead>
<tr><th>Strategia di collasso</th><th>Punteggio dell'entità dai risultati di elemento restituiti</th><th>Condizione importante</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">max</code></td><td>Punteggio migliore dell'elemento</td><td>Funziona con metriche vettoriali regolari supportate</td></tr>
<tr><td><code translate="no">sum</code></td><td>Somma di tutti i punteggi degli elementi restituiti</td><td>Da usare con metriche a correlazione positiva come <code translate="no">IP</code> o <code translate="no">COSINE</code></td></tr>
<tr><td><code translate="no">avg</code></td><td>Media dei punteggi degli elementi restituiti</td><td>Funziona con metriche vettoriali regolari supportate</td></tr>
<tr><td><code translate="no">topk_sum</code></td><td>Somma dei migliori <code translate="no">K</code> punteggi di elemento restituiti</td><td>Richiede un <code translate="no">topk</code> positivo; da usare con <code translate="no">IP</code> o <code translate="no">COSINE</code></td></tr>
<tr><td><code translate="no">topk_avg</code></td><td>Media dei migliori <code translate="no">K</code> punteggi di elemento restituiti</td><td>Richiede un <code translate="no">topk</code> positivo</td></tr>
</tbody>
</table>
<p>Il collasso opera solo sui risultati di elemento restituiti da quella sotto-ricerca ANN; non esegue una scansione di ogni elemento nell'entità dopo il recupero. Il <code translate="no">limit</code> della richiesta controlla quindi quali risultati di elemento sono disponibili per la funzione di collasso.</p>
<p>Questa scelta modella la semantica del recupero, non solo la formattazione dell'output. Se l'applicazione presenta una clip o un passaggio, preservare l'offset attraverso la fusione è naturale. Se presenta un video, un prodotto o un documento, il collasso a livello di entità è naturale. Quando i segnali operano a granularità diverse, il sistema necessita di una regola esplicita di punteggio da elemento a entità.</p>
<p>StructArray sposta quel problema di identità e collasso dall'elaborazione post-hoc ad hoc al modello di esecuzione della ricerca.</p>
<h2 id="How-Milvus-executes-StructArray-without-treating-it-as-a-blob" class="common-anchor-header">Come Milvus esegue StructArray senza trattarlo come un blob<button data-href="#How-Milvus-executes-StructArray-without-treating-it-as-a-blob" class="anchor-icon" translate="no">
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
    </button></h2><p>Il modello visibile all'utente è <code translate="no">ARRAY&lt;STRUCT&gt;</code>. Memorizzare l'intero valore come un unico blob opaco, tuttavia, renderebbe inefficienti gli indici dei sottocampi, i filtri e l'output selettivo.</p>
<p>Milvus utilizza un design a genitore logico e colonne fisiche figlie.</p>
<p>A livello di schema, <code translate="no">clips</code> è il campo genitore logico. Definisce proprietà come lo schema Struct, la capacità massima e la nullabilità. I suoi sottocampi vengono normalizzati in percorsi come <code translate="no">clips[clip_embedding_list]</code>, <code translate="no">clips[clip_embedding]</code>, <code translate="no">clips[scene_type]</code> e <code translate="no">clips[label_confidence]</code>.</p>
<p>I sottocampi scalari seguono percorsi di memorizzazione a array scalare per entità, mentre i sottocampi vettoriali seguono percorsi a array vettoriale. Ogni sottocampo può quindi utilizzare il percorso dati appropriato al suo tipo: filtraggio scalare e indici scalari per i metadati, e indici vettoriali e ricerca ANN per gli embedding.</p>
<p>Durante l'inserimento, il Proxy espande la lista Struct annidata in colonne figlie tipizzate. Durante l'esecuzione, Milvus mantiene la relazione tra ogni elemento fisico e la sua entità padre. Concettualmente, quella relazione appare così:</p>
<pre><code translate="no">Plaintext
entity 0 -&gt; elements [0, 1, 2]
entity 1 -&gt; elements [3]
entity 2 -&gt; elements []
entity 3 -&gt; elements [4, 5, 6, 7]
<button class="copy-code-btn"></button></code></pre>
<p>Quando la ricerca a livello di elemento restituisce un ID di elemento fisico, Milvus lo mappa nuovamente all'entità padre e all'offset dell'elemento. Quando <code translate="no">element_filter</code> produce una bitmap a livello di elemento, il motore la allinea con la visibilità dell'entità padre, le eliminazioni e altri filtri.</p>
<p>Quando restituisce i risultati, Milvus utilizza lo schema logico e gli offset condivisi per ricostruire la forma StructArray che l'applicazione ha inserito. Il sistema può eseguire su colonne figlie tipizzate mentre l'utente continua a leggere e scrivere oggetti annidati naturali. Questo layout fisico rende StructArray più di un JSON tipizzato: la relazione annidata partecipa al modello di indicizzazione ed esecuzione.</p>
<h2 id="Where-StructArray-fits-and-where-it-does-not" class="common-anchor-header">Dove StructArray è adatto e dove non lo è<button data-href="#Where-StructArray-fits-and-where-it-does-not" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArray è particolarmente adatto quando tutte le seguenti condizioni sono vere:</p>
<ul>
<li>L'applicazione ha un'entità padre significativa, come un video, un prodotto, un documento, una pagina visiva o un record di memoria.</li>
<li>Ogni entità padre contiene un insieme ordinato di lunghezza variabile di elementi locali.</li>
<li>Quegli elementi necessitano dei propri metadati scalari, vettori, o entrambi.</li>
<li>La ricerca o il filtraggio devono preservare la relazione tra i sottocampi allo stesso offset di elemento.</li>
<li>L'applicazione necessita di recupero multi-vettore a livello di entità, risultati a livello di elemento, o entrambi.</li>
</ul>
<p>StructArray non è automaticamente migliore per ogni collezione. Un documento breve o una query semplice possono essere ben serviti da un singolo embedding denso. L'indicizzazione multi-vettore aggiunge costi di archiviazione e ricerca, quindi la rappresentazione aggiuntiva dovrebbe guadagnarsi il suo posto attraverso una migliore qualità del recupero o una granularità dei risultati più utile.</p>
<p>Anche i confini attuali dello schema e dell'esecuzione contano:</p>
<ul>
<li><code translate="no">Struct</code> è supportato come tipo di elemento di un <code translate="no">Array</code>, non come campo di collezione di primo livello.</li>
<li>Tutti gli elementi in una StructArray condividono un unico schema predefinito.</li>
<li><code translate="no">max_capacity</code> è obbligatorio e limita il numero di elementi per entità.</li>
<li>I sottocampi annidati <code translate="no">Struct</code>, <code translate="no">Array</code>, <code translate="no">ArrayOfStruct</code> e <code translate="no">JSON</code> non sono supportati all'interno di una StructArray.</li>
<li>Un sottocampo vettoriale accetta un solo indice. Usa sottocampi vettoriali separati per la ricerca EmbeddingList e quella a livello di elemento quando entrambe sono necessarie.</li>
<li>I sottocampi vettoriali devono essere indicizzati prima della ricerca. I sottocampi scalari usati frequentemente nei filtri dovrebbero essere indicizzati in modo appropriato.</li>
<li>Lo schema dei sottocampi è fisso dopo la creazione del campo StructArray, quindi pianifica gli attributi degli elementi prima del rilascio in produzione.</li>
</ul>
<p>Questi vincoli rendono il modello più ristretto dell'annidamento arbitrario di un database documentale, ma danno anche a Milvus abbastanza struttura per ragionare sull'identità degli elementi, indicizzare ogni sottocampo ed eseguire a due granularità di ricerca.</p>
<h2 id="StructArray-keeps-local-evidence-first-class-without-losing-the-entity" class="common-anchor-header">StructArray mantiene le prove locali di prima classe senza perdere l'entità<button data-href="#StructArray-keeps-local-evidence-first-class-without-losing-the-entity" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArray offre a Milvus un oggetto di recupero che gli schemi piatti faticano a rappresentare: un'entità padre con un insieme ordinato di elementi strutturati. Le relazioni tra quegli elementi partecipano al filtraggio, all'indicizzazione e alla ricerca, piuttosto che esistere solo nella memorizzazione.</p>
<p>Ogni elemento conserva i propri metadati ed embedding. Gli elementi possono soddisfare predicati scalari sullo stesso elemento, partecipare insieme alla ricerca EmbeddingList a livello di entità, o competere indipendentemente nella ricerca a livello di elemento. Allo stesso tempo, rimangono collegati all'entità padre i cui metadati, permessi e identità applicativa danno loro contesto.</p>
<p>Per clip video, immagini di prodotto, passaggi di documento, patch visive e frammenti di memoria, le prove locali possono essere cercate e filtrate senza perdere l'entità a cui appartengono. Le scelte progettuali rimanenti sono esplicite: seleziona la granularità della ricerca, assegna a ogni sottocampo vettoriale la metrica e l'indice corrispondenti, e decidi se i risultati ibridi devono preservare gli offset degli elementi o collassare nuovamente alle entità.</p>
<h2 id="Try-StructArray-in-Milvus-30" class="common-anchor-header">Prova StructArray in Milvus 3.0<button data-href="#Try-StructArray-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArray è disponibile in Milvus 3.0. Inizia con la <a href="https://milvus.io/docs/array-of-structs.md">panoramica su StructArray</a>. Se stai valutando il recupero multi-vettore a livello di entità, leggi la <a href="https://milvus.io/docs/choose-an-embeddinglist-search-strategy.md">guida alle strategie EmbeddingList</a>. Per la granularità dei risultati e il comportamento di collasso, consulta <a href="https://milvus.io/docs/hybrid-search-with-structarray.md">Hybrid Search con StructArray</a>.</p>
<p>Per il contesto più ampio del rilascio, consulta il <a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">blog di lancio di Milvus 3.0</a>, le <a href="https://milvus.io/docs/release_notes.md">note di rilascio</a> e il <a href="https://github.com/milvus-io/milvus">repository milvus-io/milvus</a>.</p>
<p>Anche <a href="https://zilliz.com/">Zilliz Cloud</a> supporta StructArray e la ricerca EmbeddingList per le distribuzioni gestite. Consulta la <a href="https://docs.zilliz.com/docs/use-array-of-structs">guida StructArray di Zilliz Cloud</a> per i limiti specifici del servizio. In Zilliz Cloud, gli operatori scalari su StructArray sono attualmente documentati per i cluster On-Demand.</p>
<p>Per discutere uno schema o un design di recupero con il team, unisciti alla <a href="https://discord.com/invite/8uyFbECzPX">community Discord di Milvus</a> o prenota una sessione di <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting">Milvus Office Hours</a>.</p>
