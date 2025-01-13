---
id: >-
  2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md
title: >-
  Come utilizzare i dati sulle stringhe per potenziare le applicazioni di
  ricerca per similarità
author: Xi Ge
date: 2022-08-08T00:00:00.000Z
desc: >-
  Utilizzate i dati delle stringhe per semplificare il processo di creazione
  delle vostre applicazioni di ricerca per similarità.
cover: assets.zilliz.com/string_6129ce83e6.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/string_6129ce83e6.png" alt="Cover" class="doc-image" id="cover" />
   </span> <span class="img-wrapper"> <span>Copertina</span> </span></p>
<p>Milvus 2.1 è dotato di <a href="https://milvus.io/blog/2022-08-05-whats-new-in-milvus-2-1.md">alcuni aggiornamenti significativi</a> che rendono il lavoro con Milvus molto più semplice. Uno di questi è il supporto del tipo di dati stringa. Attualmente Milvus <a href="https://milvus.io/docs/v2.1.x/schema.md#Supported-data-type">supporta tipi di dati</a> quali stringhe, vettori, booleani, numeri interi, numeri in virgola mobile e altri ancora.</p>
<p>Questo articolo presenta un'introduzione al supporto del tipo di dati stringa. Leggete e imparate cosa potete fare con esso e come usarlo.</p>
<p><strong>Vai a:</strong></p>
<ul>
<li><a href="#What-can-you-do-with-string-data">Cosa si può fare con i dati stringa?</a></li>
<li><a href="#How-to-manage-string-data-in-Milvus-21">Come gestire i dati stringa in Milvus 2.1?</a><ul>
<li><a href="#Create-a-collection">Creare una raccolta</a></li>
<li><a href="#Insert-data">Inserire e cancellare dati</a></li>
<li><a href="#Build-an-index">Creare un indice</a></li>
<li><a href="#Hybrid-search">Ricerca ibrida</a></li>
<li><a href="#String-expressions">Espressioni di stringa</a></li>
</ul></li>
</ul>
<custom-h1>Cosa si può fare con i dati stringa?</custom-h1><p>Il supporto del tipo di dati stringa è una delle funzioni più attese dagli utenti. Esso semplifica il processo di creazione di un'applicazione con il database vettoriale Milvus e accelera la velocità di ricerca per similarità e di interrogazione vettoriale, aumentando in larga misura l'efficienza e riducendo i costi di manutenzione dell'applicazione su cui si sta lavorando.</p>
<p>In particolare, Milvus 2.1 supporta il tipo di dati VARCHAR, che memorizza stringhe di caratteri di lunghezza variabile. Grazie al supporto del tipo di dati VARCHAR, è possibile:</p>
<ol>
<li>Gestire direttamente i dati stringa senza l'ausilio di un database relazionale esterno.</li>
</ol>
<p>Il supporto del tipo di dati VARCHAR consente di saltare la fase di conversione delle stringhe in altri tipi di dati quando si inseriscono i dati in Milvus. Supponiamo che stiate lavorando a un sistema di ricerca di libri per la vostra libreria online. State creando un set di dati di libri e volete identificare i libri con i loro nomi. Mentre nelle versioni precedenti Milvus non supportava il tipo di dati stringa, prima di inserire i dati in Milvus, potrebbe essere necessario trasformare le stringhe (i nomi dei libri) in ID libro con l'aiuto di un database relazionale come MySQL. Ora come ora, dato che il tipo di dati stringa è supportato, si può semplicemente creare un campo stringa e inserire direttamente i nomi dei libri invece dei loro numeri ID.</p>
<p>La comodità si estende anche al processo di ricerca e di interrogazione. Immaginiamo che ci sia un cliente il cui libro preferito è <em>Hello Milvus</em>. Si vuole cercare nel sistema libri simili e consigliarli al cliente. Nelle versioni precedenti di Milvus, il sistema restituiva solo gli ID dei libri e bisognava fare un passo in più per controllare le informazioni sul libro corrispondente in un database relazionale. In Milvus 2.1, invece, è possibile ottenere direttamente i nomi dei libri, poiché è già stato creato un campo stringa con i nomi dei libri.</p>
<p>In poche parole, il supporto del tipo di dati stringa evita di dover ricorrere ad altri strumenti per gestire i dati stringa, semplificando notevolmente il processo di sviluppo.</p>
<ol start="2">
<li>Accelerazione della velocità della <a href="https://milvus.io/docs/v2.1.x/hybridsearch.md">ricerca ibrida</a> e della <a href="https://milvus.io/docs/v2.1.x/query.md">query vettoriale</a> grazie al filtraggio degli attributi.</li>
</ol>
<p>Come altri tipi di dati scalari, VARCHAR può essere usato per filtrare gli attributi nella ricerca ibrida e nella query vettoriale attraverso un'espressione booleana. In particolare, Milvus 2.1 ha aggiunto l'operatore <code translate="no">like</code>, che consente di eseguire la corrispondenza dei prefissi. Inoltre, è possibile eseguire una corrispondenza esatta utilizzando l'operatore <code translate="no">==</code>.</p>
<p>Inoltre, è supportato un indice invertito basato su MARISA-trie per accelerare la ricerca e l'interrogazione ibrida. Continuate a leggere e scoprite tutte le espressioni di stringa che desiderate conoscere per eseguire il filtraggio degli attributi con i dati di stringa.</p>
<custom-h1>Come gestire i dati stringa in Milvus 2.1?</custom-h1><p>Ora sappiamo che il tipo di dati stringa è estremamente utile, ma quando abbiamo bisogno di usarlo per costruire le nostre applicazioni? Di seguito verranno illustrati alcuni esempi di codice relativi a scenari che possono coinvolgere dati di tipo stringa, che consentiranno di capire meglio come gestire i dati VARCHAR in Milvus 2.1.</p>
<h2 id="Create-a-collection" class="common-anchor-header">Creare una collezione<button data-href="#Create-a-collection" class="anchor-icon" translate="no">
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
    </button></h2><p>Seguiamo l'esempio precedente. Si sta ancora lavorando al sistema di raccomandazione dei libri e si vuole creare una raccolta di libri con un campo chiave primaria chiamato <code translate="no">book_name</code>, in cui si inseriranno dati stringa. In questo caso, si può impostare il tipo di dati come <code translate="no">DataType.VARCHAR</code>quando si imposta lo schema del campo, come mostrato nell'esempio seguente.</p>
<p>Si noti che quando si crea un campo VARCHAR, è necessario specificare la lunghezza massima dei caratteri attraverso il parametro <code translate="no">max_length</code>, il cui valore può variare da 1 a 65.535.  In questo esempio, abbiamo impostato la lunghezza massima a 200.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> CollectionSchema, FieldSchema, DataType
book_id = FieldSchema(
  name=<span class="hljs-string">&quot;book_id&quot;</span>, 
  dtype=DataType.INT64, 
)
book_name = FieldSchema( 
  name=<span class="hljs-string">&quot;book_name&quot;</span>, 
  dtype=DataType.VARCHAR, 
  max_length=<span class="hljs-number">200</span>, 
  is_primary=<span class="hljs-literal">True</span>, 
)
word_count = FieldSchema(
  name=<span class="hljs-string">&quot;word_count&quot;</span>, 
  dtype=DataType.INT64,  
)
book_intro = FieldSchema(
  name=<span class="hljs-string">&quot;book_intro&quot;</span>, 
  dtype=DataType.FLOAT_VECTOR, 
  dim=<span class="hljs-number">2</span>
)
schema = CollectionSchema(
  fields=[book_id, word_count, book_intro], 
  description=<span class="hljs-string">&quot;Test book search&quot;</span>
)
collection_name = <span class="hljs-string">&quot;book&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Insert-data" class="common-anchor-header">Inserire i dati<button data-href="#Insert-data" class="anchor-icon" translate="no">
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
    </button></h2><p>Ora che la collezione è stata creata, possiamo inserirvi dei dati. Nell'esempio seguente, inseriamo 2.000 righe di dati stringa generati casualmente.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">import</span> random
data = [
  [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
  [<span class="hljs-string">&quot;book_&quot;</span> + <span class="hljs-built_in">str</span>(i) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
  [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">10000</span>, <span class="hljs-number">12000</span>)],
  [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Delete-data" class="common-anchor-header">Cancellare i dati<button data-href="#Delete-data" class="anchor-icon" translate="no">
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
    </button></h2><p>Supponiamo che due libri, denominati <code translate="no">book_0</code> e <code translate="no">book_1</code>, non siano più disponibili nel negozio e che si vogliano eliminare le relative informazioni dal database. In questo caso, si può usare l'espressione di termine <code translate="no">in</code> per filtrare le entità da eliminare, come mostrato nell'esempio seguente.</p>
<p>Ricordate che Milvus supporta solo l'eliminazione di entità con chiavi primarie chiaramente specificate, quindi prima di eseguire il codice seguente, assicuratevi di aver impostato il campo <code translate="no">book_name</code> come campo chiave primario.</p>
<pre><code translate="no" class="language-Python">expr = <span class="hljs-string">&quot;book_name in [\&quot;book_0\&quot;, \&quot;book_1\&quot;]&quot;</span> 
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collection</span>
collection = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&quot;book&quot;</span>)     
collection.<span class="hljs-title function_">delete</span>(expr)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Build-an-Index" class="common-anchor-header">Creare un indice<button data-href="#Build-an-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 supporta la costruzione di indici scalari, che accelerano notevolmente il filtraggio dei campi stringa. A differenza della costruzione di un indice vettoriale, non è necessario preparare i parametri prima di costruire un indice scalare. Milvus supporta temporaneamente solo l'indice ad albero del dizionario (MARISA-trie), quindi il tipo di indice del campo di tipo VARCHAR è MARISA-trie per impostazione predefinita.</p>
<p>È possibile specificare il nome dell'indice durante la sua creazione. Se non viene specificato, il valore predefinito di <code translate="no">index_name</code> è <code translate="no">&quot;_default_idx_&quot;</code>. Nell'esempio seguente, abbiamo chiamato l'indice <code translate="no">scalar_index</code>.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collection</span>
collection = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&quot;book&quot;</span>)   
collection.<span class="hljs-title function_">create_index</span>(
  field_name=<span class="hljs-string">&quot;book_name&quot;</span>, 
  index_name=<span class="hljs-string">&quot;scalar_index&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Hybrid-search" class="common-anchor-header">Ricerca ibrida<button data-href="#Hybrid-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Specificando espressioni booleane, è possibile filtrare i campi stringa durante una ricerca di similarità vettoriale.</p>
<p>Ad esempio, se si cercano i libri la cui introduzione è più simile a Hello Milvus ma si vogliono ottenere solo i libri il cui nome inizia con "book_2", si può usare l'operatore <code translate="no">like</code>per eseguire una corrispondenza di prefisso e ottenere i libri mirati, come mostrato nell'esempio seguente.</p>
<pre><code translate="no" class="language-Python">search_param = {
  <span class="hljs-string">&quot;data&quot;</span>: [[<span class="hljs-number">0.1</span>, <span class="hljs-number">0.2</span>]],
  <span class="hljs-string">&quot;anns_field&quot;</span>: <span class="hljs-string">&quot;book_intro&quot;</span>,
  <span class="hljs-string">&quot;param&quot;</span>: {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
  <span class="hljs-string">&quot;limit&quot;</span>: <span class="hljs-number">2</span>,
  <span class="hljs-string">&quot;expr&quot;</span>: <span class="hljs-string">&quot;book_name like \&quot;Hello%\&quot;&quot;</span>,
}
res = collection.<span class="hljs-title function_">search</span>(**search_param)
<button class="copy-code-btn"></button></code></pre>
<h2 id="String-expressions" class="common-anchor-header">Espressioni di stringa<button data-href="#String-expressions" class="anchor-icon" translate="no">
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
    </button></h2><p>Oltre al nuovo operatore <code translate="no">like</code>, per filtrare i campi stringa si possono usare anche altri operatori già supportati nelle versioni precedenti di Milvus. Di seguito sono riportati alcuni esempi di <a href="https://milvus.io/docs/v2.1.x/boolean.md">espressioni di stringa</a> comunemente utilizzate, dove <code translate="no">A</code> rappresenta un campo di tipo VARCHAR. Si ricorda che tutte le espressioni di stringa riportate di seguito possono essere combinate logicamente utilizzando gli operatori logici, come AND, OR e NOT.</p>
<h3 id="Set-operations" class="common-anchor-header">Operazioni di set</h3><p>È possibile utilizzare <code translate="no">in</code> e <code translate="no">not in</code> per realizzare operazioni di set, come ad esempio <code translate="no">A in [&quot;str1&quot;, &quot;str2&quot;]</code>.</p>
<h3 id="Compare-two-string-fields" class="common-anchor-header">Confronto tra due campi di stringhe</h3><p>È possibile utilizzare gli operatori relazionali per confrontare i valori di due campi stringa. Tali operatori relazionali includono <code translate="no">==</code>, <code translate="no">!=</code>, <code translate="no">&gt;</code>, <code translate="no">&gt;=</code>, <code translate="no">&lt;</code>, <code translate="no">&lt;=</code>. Per ulteriori informazioni, vedere <a href="https://milvus.io/docs/v2.1.x/boolean.md#Relational-operators">Operatori relazionali</a>.</p>
<p>Si noti che i campi stringa possono essere confrontati solo con altri campi stringa e non con campi di altri tipi di dati. Ad esempio, un campo di tipo VARCHAR non può essere confrontato con un campo di tipo booleano o di tipo intero.</p>
<h3 id="Compare-a-field-with-a-constant-value" class="common-anchor-header">Confronto di un campo con un valore costante</h3><p>È possibile utilizzare <code translate="no">==</code> o <code translate="no">!=</code> per verificare se il valore di un campo è uguale a un valore costante.</p>
<h3 id="Filter-fields-with-a-single-range" class="common-anchor-header">Filtrare i campi con un singolo intervallo</h3><p>Si possono usare <code translate="no">&gt;</code>, <code translate="no">&gt;=</code>, <code translate="no">&lt;</code>, <code translate="no">&lt;=</code> per filtrare campi stringa con un singolo intervallo, come <code translate="no">A &gt; &quot;str1&quot;</code>.</p>
<h3 id="Prefix-matching" class="common-anchor-header">Corrispondenza dei prefissi</h3><p>Come già detto, Milvus 2.1 aggiunge l'operatore <code translate="no">like</code> per la corrispondenza dei prefissi, come ad esempio <code translate="no">A like &quot;prefix%&quot;</code>.</p>
<h2 id="Whats-next" class="common-anchor-header">Il prossimo passo<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Con il rilascio ufficiale di Milvus 2.1, abbiamo preparato una serie di blog che presentano le nuove funzionalità. Per saperne di più, leggete questa serie di blog:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Come utilizzare i dati delle stringhe per potenziare le applicazioni di ricerca per similarità</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Utilizzo di Milvus incorporato per installare ed eseguire immediatamente Milvus con Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Aumentare la velocità di lettura del database vettoriale con le repliche in memoria</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Capire il livello di consistenza nel database vettoriale Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Capire il livello di consistenza del database vettoriale Milvus (parte II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">In che modo il database vettoriale Milvus garantisce la sicurezza dei dati?</a></li>
</ul>
