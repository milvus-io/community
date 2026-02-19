---
id: debugging-rag-in-3d-with-projectgolem-and-milvus.md
title: >-
  E se si potesse vedere perché RAG fallisce? Debug di RAG in 3D con
  Project_Golem e Milvus
author: Min Yin
date: 2026-02-18T00:00:00.000Z
cover: assets.zilliz.com/Debugging_RAG_in_3_D_f1b45f9a99_5f98979c06.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, RAG'
meta_keywords: 'Project_Golem, milvus, RAG'
meta_title: |
  Debugging RAG in 3D with Project_Golem and Milvus
desc: >-
  Scoprite come Project_Golem e Milvus rendono osservabili i sistemi RAG
  visualizzando lo spazio vettoriale, eseguendo il debug degli errori di
  recupero e scalando la ricerca vettoriale in tempo reale.
origin: 'https://milvus.io/blog/debugging-rag-in-3d-with-projectgolem-and-milvus.md'
---
<p>Quando il recupero RAG va male, di solito si sa che è rotto: i documenti rilevanti non compaiono o compaiono quelli irrilevanti. Ma capire perché è un'altra storia. Tutto ciò che si ha a disposizione sono i punteggi di similarità e un elenco piatto di risultati. Non c'è modo di vedere come i documenti siano effettivamente posizionati nello spazio vettoriale, come i pezzi si relazionino l'uno con l'altro, o dove la vostra query sia arrivata rispetto al contenuto che avrebbe dovuto corrispondere. In pratica, questo significa che il debugging di RAG è per lo più basato su tentativi ed errori: modificare la strategia di chunking, cambiare il modello di incorporazione, regolare il top-k e sperare che i risultati migliorino.</p>
<p><a href="https://github.com/CyberMagician/Project_Golem">Project_Golem</a> è uno strumento open-source che rende visibile lo spazio vettoriale. Utilizza UMAP per proiettare le incorporazioni ad alta dimensione in 3D e Three.js per renderle interattive nel browser. Invece di indovinare perché il reperimento non è andato a buon fine, si può vedere come si raggruppano i pezzi a livello semantico, dove arriva la query e quali documenti sono stati recuperati, il tutto in un'unica interfaccia visiva.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_1_01de566e04.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Tutto ciò è sorprendente. Tuttavia, il Project_Golem originale è stato progettato per piccole dimostrazioni, non per sistemi reali. Si affida a file piatti, ricerche brute-force e ricostruzioni di interi set di dati, il che significa che si rompe rapidamente quando i dati crescono oltre le poche migliaia di documenti.</p>
<p>Per colmare questo divario, abbiamo integrato Project_Golem con <a href="https://milvus.io/docs/release_notes.md#v268">Milvus</a> (in particolare la versione 2.6.8) come spina dorsale vettoriale. Milvus è un database vettoriale open-source ad alte prestazioni che gestisce l'ingestione in tempo reale, l'indicizzazione scalabile e il recupero a livello di millisecondi, mentre Project_Golem si concentra su ciò che sa fare meglio: rendere visibile il comportamento di recupero dei vettori. Insieme, trasformano la visualizzazione 3D da una demo giocattolo a uno strumento pratico di debug per i sistemi RAG di produzione.</p>
<p>In questo post illustreremo Project_Golem e mostreremo come lo abbiamo integrato con Milvus per rendere il comportamento della ricerca vettoriale osservabile, scalabile e pronto per la produzione.</p>
<h2 id="What-Is-ProjectGolem" class="common-anchor-header">Che cos'è Project_Golem?<button data-href="#What-Is-ProjectGolem" class="anchor-icon" translate="no">
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
    </button></h2><p>Il debug di RAG è difficile per un semplice motivo: gli spazi vettoriali sono altamente dimensionali e gli esseri umani non possono vederli.</p>
<p><a href="https://github.com/CyberMagician/Project_Golem">Project_Golem</a> è uno strumento basato su browser che consente di vedere lo spazio vettoriale in cui opera il sistema RAG. Prende gli embeddings ad alta dimensione che guidano il reperimento (in genere 768 o 1536 dimensioni) e li proietta in una scena 3D interattiva che si può esplorare direttamente.</p>
<p>Ecco come funziona sotto il cofano:</p>
<ul>
<li>Riduzione della dimensionalità con UMAP. Project_Golem utilizza UMAP per comprimere i vettori ad alta dimensione in tre dimensioni, preservando le distanze relative. I pezzi semanticamente simili nello spazio originale rimangono vicini nella proiezione 3D, mentre i pezzi non correlati finiscono lontani.</li>
<li>Rendering 3D con Three.js. Ogni frammento di documento appare come un nodo in una scena 3D renderizzata nel browser. È possibile ruotare, ingrandire ed esplorare lo spazio per vedere come si raggruppano i documenti: quali argomenti si raggruppano strettamente, quali si sovrappongono e dove sono i confini.</li>
<li>Evidenziazione in tempo di query. Quando si esegue una query, il reperimento avviene ancora nello spazio originale ad alta dimensionalità utilizzando la similarità del coseno. Ma una volta ottenuti i risultati, i pezzi recuperati si illuminano nella vista 3D. È possibile vedere immediatamente dove la query è arrivata rispetto ai risultati e, cosa altrettanto importante, rispetto ai documenti non recuperati.</li>
</ul>
<p>Questo è ciò che rende Project_Golem utile per il debug. Invece di guardare un elenco di risultati classificati e indovinare il motivo per cui un documento rilevante non è stato recuperato, è possibile vedere se si trova in un cluster distante (un problema di incorporamento), se si sovrappone a contenuti irrilevanti (un problema di chunking) o se è appena fuori dalla soglia di recupero (un problema di configurazione). La vista 3D trasforma i punteggi di somiglianza astratti in relazioni spaziali su cui si può ragionare.</p>
<h2 id="Why-ProjectGolem-Isnt-Production-Ready" class="common-anchor-header">Perché Project_Golem non è pronto per la produzione<button data-href="#Why-ProjectGolem-Isnt-Production-Ready" class="anchor-icon" translate="no">
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
    </button></h2><p>Project_Golem è stato concepito come prototipo di visualizzazione e per questo funziona bene. Ma la sua architettura prevede presupposti che si rompono rapidamente in scala, in modi importanti se si vuole usarlo per il debug di RAG nel mondo reale.</p>
<h3 id="Every-Update-Requires-a-Full-Rebuild" class="common-anchor-header">Ogni aggiornamento richiede una ricostruzione completa</h3><p>Questa è la limitazione più fondamentale. Nel progetto originale, l'aggiunta di nuovi documenti comporta la ricostruzione completa della pipeline: gli embeddings vengono rigenerati e scritti in file .npy, UMAP viene rieseguito sull'intero set di dati e le coordinate 3D vengono riesportate come JSON.</p>
<p>Anche con 100.000 documenti, un'esecuzione UMAP single-core richiede 5-10 minuti. Al raggiungimento del milione di documenti, diventa del tutto impraticabile. Non è possibile utilizzare questo sistema per i set di dati che cambiano continuamente (news feed, documentazione, conversazioni degli utenti), perché ogni aggiornamento comporta l'attesa di un ciclo completo di rielaborazione.</p>
<h3 id="Brute-Force-Search-Doesnt-Scale" class="common-anchor-header">La ricerca con la forza bruta non è scalabile</h3><p>Il lato del reperimento ha un suo limite. L'implementazione originale utilizza NumPy per la ricerca bruta della somiglianza del coseno: complessità temporale lineare, nessuna indicizzazione. Su un set di dati da un milione di documenti, una singola query può richiedere più di un secondo. È un tempo inutilizzabile per qualsiasi sistema interattivo o online.</p>
<p>La pressione della memoria aggrava il problema. Ogni vettore float32 a 768 dimensioni occupa circa 3 KB, quindi un set di dati da un milione di vettori richiede oltre 3 GB di memoria, il tutto caricato in un array NumPy piatto senza alcuna struttura di indicizzazione per rendere efficiente la ricerca.</p>
<h3 id="No-Metadata-Filtering-No-Multi-Tenancy" class="common-anchor-header">Nessun filtro sui metadati, nessuna multi-tenenza</h3><p>In un sistema RAG reale, la similarità vettoriale è raramente l'unico criterio di recupero. È quasi sempre necessario filtrare in base ai metadati, come il tipo di documento, i timestamp, i permessi degli utenti o i limiti a livello di applicazione. Un sistema RAG per l'assistenza clienti, ad esempio, deve limitare il recupero ai documenti di uno specifico inquilino, non cercare tra i dati di tutti.</p>
<p>Project_Golem non supporta nulla di tutto ciò. Non ci sono indici ANN (come HNSW o IVF), né filtri scalari, né isolamento dei tenant, né ricerca ibrida. Si tratta di un livello di visualizzazione senza un motore di recupero della produzione sottostante.</p>
<h2 id="How-Milvus-Powers-ProjectGolem’s-Retrieval-Layer" class="common-anchor-header">Come Milvus alimenta il livello di recupero di Project_Golem<button data-href="#How-Milvus-Powers-ProjectGolem’s-Retrieval-Layer" class="anchor-icon" translate="no">
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
    </button></h2><p>Nella sezione precedente sono state identificate tre lacune: ricostruzioni complete a ogni aggiornamento, ricerca brutale e assenza di recupero consapevole dei metadati. Tutte e tre derivano dalla stessa causa: Project_Golem non ha un livello di database. Il reperimento, la memorizzazione e la visualizzazione sono aggrovigliati in un'unica pipeline, per cui la modifica di qualsiasi parte costringe a ricostruire tutto.</p>
<p>La soluzione non è ottimizzare la pipeline. Si tratta di dividerla.</p>
<p>Integrando Milvus 2.6.8 come spina dorsale vettoriale, il recupero diventa un livello dedicato e di livello produttivo che opera indipendentemente dalla visualizzazione. Milvus gestisce l'archiviazione, l'indicizzazione e la ricerca dei vettori. Project_Golem si concentra esclusivamente sul rendering, consumando gli ID dei documenti da Milvus ed evidenziandoli nella vista 3D.</p>
<p>Questa separazione produce due flussi puliti e indipendenti:</p>
<p>Flusso di recupero (online, a livello di millisecondi)</p>
<ul>
<li>L'interrogazione viene convertita in un vettore utilizzando gli embeddings di OpenAI.</li>
<li>Il vettore della query viene inviato a una raccolta Milvus.</li>
<li>Milvus AUTOINDEX seleziona e ottimizza l'indice appropriato.</li>
<li>Una ricerca in tempo reale della similarità del coseno restituisce gli ID dei documenti pertinenti.</li>
</ul>
<p>Flusso di visualizzazione (offline, in scala demo)</p>
<ul>
<li>UMAP genera coordinate 3D durante l'ingestione dei dati (n_neighbors=30, min_dist=0,1).</li>
<li>Le coordinate sono memorizzate in golem_cortex.json.</li>
<li>Il frontend evidenzia i nodi 3D corrispondenti utilizzando gli ID dei documenti restituiti da Milvus.</li>
</ul>
<p>Il punto critico: il recupero non attende più la visualizzazione. È possibile inserire nuovi documenti e cercarli immediatamente: la visualizzazione 3D li recupera secondo i propri tempi.</p>
<h3 id="What-Streaming-Nodes-Change" class="common-anchor-header">Cosa cambiano i nodi di streaming</h3><p>L'ingestione in tempo reale è resa possibile da una nuova funzionalità di Milvus 2.6.8: i <a href="https://milvus.io/docs/configure_streamingnode.md#streamingNode-related-Configurations">nodi di streaming</a>. Nelle versioni precedenti, l'ingestione in tempo reale richiedeva una coda di messaggi esterna come Kafka o Pulsar. Gli Streaming Nodes spostano il coordinamento all'interno di Milvus stesso: i nuovi vettori vengono ingeriti continuamente, gli indici vengono aggiornati in modo incrementale e i documenti appena aggiunti diventano immediatamente ricercabili senza ricostruzioni complete e senza dipendenze esterne.</p>
<p>Per Project_Golem, questo è ciò che rende l'architettura pratica. È possibile continuare ad aggiungere documenti al sistema RAG - nuovi articoli, documenti aggiornati, contenuti generati dagli utenti - e il recupero rimane aggiornato senza innescare il costoso ciclo UMAP → JSON → reload.</p>
<h3 id="Extending-Visualization-to-Million-Scale-Future-Path" class="common-anchor-header">Estensione della visualizzazione a scala milionaria (percorso futuro)</h3><p>Con questa configurazione supportata da Milvus, Project_Golem supporta attualmente dimostrazioni interattive a circa 10.000 documenti. Il reperimento è ben più ampio - Milvus gestisce milioni di documenti - ma la pipeline di visualizzazione si basa ancora sull'esecuzione di UMAP in batch. Per colmare questo divario, l'architettura può essere estesa con una pipeline di visualizzazione incrementale:</p>
<ul>
<li><p>trigger di aggiornamento: Il sistema ascolta gli eventi di inserimento nella collezione Milvus. Quando i nuovi documenti aggiunti raggiungono una soglia definita (ad esempio, 1.000 elementi), viene attivato un aggiornamento incrementale.</p></li>
<li><p>Proiezione incrementale: Invece di eseguire nuovamente UMAP sull'intero set di dati, i nuovi vettori vengono proiettati nello spazio 3D esistente utilizzando il metodo transform() di UMAP. In questo modo si preserva la struttura globale e si riducono drasticamente i costi di calcolo.</p></li>
<li><p>Sincronizzazione del frontend: I frammenti di coordinate aggiornate vengono trasmessi al frontend tramite WebSocket, consentendo la comparsa dinamica di nuovi nodi senza ricaricare l'intera scena.</p></li>
</ul>
<p>Oltre alla scalabilità, Milvus 2.6.8 consente la ricerca ibrida, combinando la similarità vettoriale con la ricerca full-text e il filtraggio scalare. Questo apre le porte a interazioni 3D più ricche, come l'evidenziazione delle parole chiave, il filtraggio delle categorie e l'affettatura basata sul tempo, offrendo agli sviluppatori modi più potenti per esplorare, eseguire il debug e ragionare sul comportamento delle RAG.</p>
<h2 id="How-to-Deploy-and-Explore-ProjectGolem-with-Milvus" class="common-anchor-header">Come distribuire ed esplorare Project_Golem con Milvus<button data-href="#How-to-Deploy-and-Explore-ProjectGolem-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Il Project_Golem aggiornato è ora open source su <a href="https://github.com/yinmin2020/Project_Golem_Milvus">GitHub</a>. Utilizzando la documentazione ufficiale di Milvus come set di dati, illustriamo l'intero processo di visualizzazione del reperimento di RAG in 3D. La configurazione utilizza Docker e Python ed è facile da seguire, anche se si parte da zero.</p>
<h3 id="Prerequisites" class="common-anchor-header">Prerequisiti</h3><ul>
<li>Docker ≥ 20.10</li>
<li>Docker Compose ≥ 2.0</li>
<li>Python ≥ 3.11</li>
<li>Una chiave API OpenAI</li>
<li>Un set di dati (documentazione Milvus in formato Markdown)</li>
</ul>
<h3 id="1-Deploy-Milvus" class="common-anchor-header">1. Distribuire Milvus</h3><pre><code translate="no">Download docker-compose.yml
wget https://github.com/milvus-io/milvus/releases/download/v2.6.8/milvus-standalone-docker-compose.yml -O docker-compose.yml
Start Milvus（verify port mapping：19530:19530）
docker-compose up -d
Verify that the services are running
docker ps | grep milvus
You should see three containers：milvus-standalone, milvus-etcd, milvus-minio
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Core-Implementation" class="common-anchor-header">2. Implementazione del nucleo</h3><p>Integrazione di Milvus (ingest.py)</p>
<p>Nota: L'implementazione supporta fino a otto categorie di documenti. Se il numero di categorie supera questo limite, i colori vengono riutilizzati in modo round-robin.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> pymilvus.milvus_client.index <span class="hljs-keyword">import</span> IndexParams
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> langchain_text_splitters <span class="hljs-keyword">import</span> RecursiveCharacterTextSplitter
<span class="hljs-keyword">import</span> umap
<span class="hljs-keyword">from</span> sklearn.neighbors <span class="hljs-keyword">import</span> NearestNeighbors
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> glob
--- CONFIG ---
MILVUS_URI = <span class="hljs-string">&quot;http://localhost:19530&quot;</span>
COLLECTION_NAME = <span class="hljs-string">&quot;golem_memories&quot;</span>
JSON_OUTPUT_PATH = <span class="hljs-string">&quot;./golem_cortex.json&quot;</span>
Data directory (users place .md files <span class="hljs-keyword">in</span> this folder)
DATA_DIR = <span class="hljs-string">&quot;./data&quot;</span>
OpenAI Embedding Config
OPENAI_API_KEY = os.getenv(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)
OPENAI_BASE_URL = <span class="hljs-string">&quot;https://api.openai.com/v1&quot;</span>  <span class="hljs-comment">#</span>
OPENAI_EMBEDDING_MODEL = <span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
<span class="hljs-number">1536</span> dimensions
EMBEDDING_DIM = <span class="hljs-number">1536</span>
Color mapping: colors are assigned automatically <span class="hljs-keyword">and</span> reused <span class="hljs-keyword">in</span> a <span class="hljs-built_in">round</span>-robin manner
COLORS = [
[<span class="hljs-number">0.29</span>, <span class="hljs-number">0.87</span>, <span class="hljs-number">0.50</span>],
Green
[<span class="hljs-number">0.22</span>, <span class="hljs-number">0.74</span>, <span class="hljs-number">0.97</span>],
Blue
[<span class="hljs-number">0.60</span>, <span class="hljs-number">0.20</span>, <span class="hljs-number">0.80</span>],
Purple
[<span class="hljs-number">0.94</span>, <span class="hljs-number">0.94</span>, <span class="hljs-number">0.20</span>],
Gold
[<span class="hljs-number">0.98</span>, <span class="hljs-number">0.55</span>, <span class="hljs-number">0.00</span>],
Orange
[<span class="hljs-number">0.90</span>, <span class="hljs-number">0.30</span>, <span class="hljs-number">0.40</span>],
Red
[<span class="hljs-number">0.40</span>, <span class="hljs-number">0.90</span>, <span class="hljs-number">0.90</span>],
Cyan
[<span class="hljs-number">0.95</span>, <span class="hljs-number">0.50</span>, <span class="hljs-number">0.90</span>],
Magenta
]
<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_embeddings</span>(<span class="hljs-params">texts</span>):
<span class="hljs-string">&quot;&quot;&quot;Batch embedding using OpenAI API&quot;&quot;&quot;</span>
client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL)
embeddings = []
batch_size = <span class="hljs-number">100</span>
OpenAI allows multiple texts per request
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(texts), batch_size):
batch = texts[i:i + batch_size]
response = client.embeddings.create(
model=OPENAI_EMBEDDING_MODEL,
<span class="hljs-built_in">input</span>=batch
)
embeddings.extend([item.embedding <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> response.data])
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Embedded <span class="hljs-subst">{<span class="hljs-built_in">min</span>(i + batch_size, <span class="hljs-built_in">len</span>(texts))}</span>/<span class="hljs-subst">{<span class="hljs-built_in">len</span>(texts)}</span>...&quot;</span>)
<span class="hljs-keyword">return</span> np.array(embeddings)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_markdown_files</span>(<span class="hljs-params">data_dir</span>):
<span class="hljs-string">&quot;&quot;&quot;Load all markdown files from the data directory&quot;&quot;&quot;</span>
md_files = glob.glob(os.path.join(data_dir, <span class="hljs-string">&quot;**/*.md&quot;</span>), recursive=<span class="hljs-literal">True</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> md_files:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ ERROR: No .md files found in &#x27;<span class="hljs-subst">{data_dir}</span>&#x27;&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   👉 Create a &#x27;<span class="hljs-subst">{data_dir}</span>&#x27; folder and put your markdown files there.&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   👉 Example: <span class="hljs-subst">{data_dir}</span>/doc1.md, <span class="hljs-subst">{data_dir}</span>/docs/doc2.md&quot;</span>)
<span class="hljs-keyword">return</span> <span class="hljs-literal">None</span>
docs = []
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n📚 FOUND <span class="hljs-subst">{<span class="hljs-built_in">len</span>(md_files)}</span> MARKDOWN FILES:&quot;</span>)
<span class="hljs-keyword">for</span> i, file_path <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(md_files):
filename = os.path.basename(file_path)
Categories are derived <span class="hljs-keyword">from</span> the file’s path relative to data_dir
rel_path = os.path.relpath(file_path, data_dir)
category = os.path.dirname(rel_path) <span class="hljs-keyword">if</span> os.path.dirname(rel_path) <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;default&quot;</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&#x27;r&#x27;</span>, encoding=<span class="hljs-string">&#x27;utf-8&#x27;</span>) <span class="hljs-keyword">as</span> f:
content = f.read()
docs.append({
<span class="hljs-string">&quot;title&quot;</span>: filename,
<span class="hljs-string">&quot;text&quot;</span>: content,
<span class="hljs-string">&quot;cat&quot;</span>: category,
<span class="hljs-string">&quot;path&quot;</span>: file_path
})
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>. [<span class="hljs-subst">{category}</span>] <span class="hljs-subst">{filename}</span>&quot;</span>)
<span class="hljs-keyword">return</span> docs
<span class="hljs-keyword">def</span> <span class="hljs-title function_">ingest_dense</span>():
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;🧠 PROJECT GOLEM - NEURAL MEMORY BUILDER&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;=&quot;</span> * <span class="hljs-number">50</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> OPENAI_API_KEY:
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ❌ ERROR: OPENAI_API_KEY environment variable not set!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Run: export OPENAI_API_KEY=&#x27;your-key-here&#x27;&quot;</span>)
<span class="hljs-keyword">return</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Using OpenAI Embedding: <span class="hljs-subst">{OPENAI_EMBEDDING_MODEL}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Embedding Dimension: <span class="hljs-subst">{EMBEDDING_DIM}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Data Directory: <span class="hljs-subst">{DATA_DIR}</span>&quot;</span>)
<span class="hljs-number">1.</span> Load local markdown files
docs = load_markdown_files(DATA_DIR)
<span class="hljs-keyword">if</span> docs <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
<span class="hljs-keyword">return</span>
<span class="hljs-number">2.</span> Split documents into chunks
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n📦 PROCESSING DOCUMENTS...&quot;</span>)
splitter = RecursiveCharacterTextSplitter(chunk_size=<span class="hljs-number">800</span>, chunk_overlap=<span class="hljs-number">50</span>)
chunks = []
raw_texts = []
colors = []
chunk_titles = []
categories = []
<span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs:
doc_chunks = splitter.create_documents([doc[<span class="hljs-string">&#x27;text&#x27;</span>]])
cat_index = <span class="hljs-built_in">hash</span>(doc[<span class="hljs-string">&#x27;cat&#x27;</span>]) % <span class="hljs-built_in">len</span>(COLORS)
<span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(doc_chunks):
chunks.append({
<span class="hljs-string">&quot;text&quot;</span>: chunk.page_content,
<span class="hljs-string">&quot;title&quot;</span>: doc[<span class="hljs-string">&#x27;title&#x27;</span>],
<span class="hljs-string">&quot;cat&quot;</span>: doc[<span class="hljs-string">&#x27;cat&#x27;</span>]
})
raw_texts.append(chunk.page_content)
colors.append(COLORS[cat_index])
chunk_titles.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{doc[<span class="hljs-string">&#x27;title&#x27;</span>]}</span> (chunk <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>)&quot;</span>)
categories.append(doc[<span class="hljs-string">&#x27;cat&#x27;</span>])
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Created <span class="hljs-subst">{<span class="hljs-built_in">len</span>(chunks)}</span> text chunks from <span class="hljs-subst">{<span class="hljs-built_in">len</span>(docs)}</span> documents&quot;</span>)
<span class="hljs-number">3.</span> Generate embeddings
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n🔮 GENERATING EMBEDDINGS...&quot;</span>)
vectors = get_embeddings(raw_texts)
<span class="hljs-number">4.</span> 3D Projection (UMAP)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n🎨 CALCULATING 3D MANIFOLD...&quot;</span>)
reducer = umap.UMAP(n_components=<span class="hljs-number">3</span>, n_neighbors=<span class="hljs-number">30</span>, min_dist=<span class="hljs-number">0.1</span>, metric=<span class="hljs-string">&#x27;cosine&#x27;</span>)
embeddings_3d = reducer.fit_transform(vectors)
<span class="hljs-number">5.</span> Wiring (KNN)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ↳ Wiring Synapses (finding connections)...&quot;</span>)
nbrs = NearestNeighbors(n_neighbors=<span class="hljs-number">8</span>, metric=<span class="hljs-string">&#x27;cosine&#x27;</span>).fit(vectors)
distances, indices = nbrs.kneighbors(vectors)
<span class="hljs-number">6.</span> Prepare output data
cortex_data = []
milvus_data = []
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(chunks)):
cortex_data.append({
<span class="hljs-string">&quot;id&quot;</span>: i,
<span class="hljs-string">&quot;title&quot;</span>: chunk_titles[i],
<span class="hljs-string">&quot;cat&quot;</span>: categories[i],
<span class="hljs-string">&quot;pos&quot;</span>: embeddings_3d[i].tolist(),
<span class="hljs-string">&quot;col&quot;</span>: colors[i],
<span class="hljs-string">&quot;nbs&quot;</span>: indices[i][<span class="hljs-number">1</span>:].tolist()
})
milvus_data.append({
<span class="hljs-string">&quot;id&quot;</span>: i,
<span class="hljs-string">&quot;text&quot;</span>: chunks[i][<span class="hljs-string">&#x27;text&#x27;</span>],
<span class="hljs-string">&quot;title&quot;</span>: chunk_titles[i],
<span class="hljs-string">&quot;category&quot;</span>: categories[i],
<span class="hljs-string">&quot;vector&quot;</span>: vectors[i].tolist()
})
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(JSON_OUTPUT_PATH, <span class="hljs-string">&#x27;w&#x27;</span>) <span class="hljs-keyword">as</span> f:
json.dump(cortex_data, f)
<span class="hljs-number">7.</span> Store vectors <span class="hljs-keyword">in</span> Milvus
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n💾 STORING IN MILVUS...&quot;</span>)
client = MilvusClient(uri=MILVUS_URI)
Drop existing collection <span class="hljs-keyword">if</span> it exists
<span class="hljs-keyword">if</span> client.has_collection(COLLECTION_NAME):
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Dropping existing collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;...&quot;</span>)
client.drop_collection(COLLECTION_NAME)
Create new collection
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Creating collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; (dim=<span class="hljs-subst">{EMBEDDING_DIM}</span>)...&quot;</span>)
client.create_collection(
collection_name=COLLECTION_NAME,
dimension=EMBEDDING_DIM
)
Insert data
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Inserting <span class="hljs-subst">{<span class="hljs-built_in">len</span>(milvus_data)}</span> vectors...&quot;</span>)
client.insert(
collection_name=COLLECTION_NAME,
data=milvus_data
)
Create index <span class="hljs-keyword">for</span> faster search
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ↳ Creating index...&quot;</span>)
index_params = IndexParams()
index_params.add_index(
field_name=<span class="hljs-string">&quot;vector&quot;</span>,
index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)
client.create_index(
collection_name=COLLECTION_NAME,
index_params=index_params
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n✅ CORTEX GENERATED SUCCESSFULLY!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   📊 <span class="hljs-subst">{<span class="hljs-built_in">len</span>(chunks)}</span> memory nodes stored in Milvus&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   📁 Cortex data saved to: <span class="hljs-subst">{JSON_OUTPUT_PATH}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   🚀 Run &#x27;python GolemServer.py&#x27; to start the server&quot;</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
ingest_dense()
<button class="copy-code-btn"></button></code></pre>
<p>Visualizzazione del frontend (GolemServer.py)</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> flask <span class="hljs-keyword">import</span> Flask, request, jsonify, send_from_directory
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> sys
--- CONFIG ---
Explicitly <span class="hljs-built_in">set</span> the folder to where this script <span class="hljs-keyword">is</span> located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OpenAI Embedding Config
OPENAI_API_KEY = os.getenv(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)
OPENAI_BASE_URL = <span class="hljs-string">&quot;https://api.openai.com/v1&quot;</span>
OPENAI_EMBEDDING_MODEL = <span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
Milvus Config
MILVUS_URI = <span class="hljs-string">&quot;http://localhost:19530&quot;</span>
COLLECTION_NAME = <span class="hljs-string">&quot;golem_memories&quot;</span>
These <span class="hljs-keyword">match</span> the files generated by ingest.py
JSON_FILE = <span class="hljs-string">&quot;golem_cortex.json&quot;</span>
UPDATED: Matches your new repo filename
HTML_FILE = <span class="hljs-string">&quot;index.html&quot;</span>
app = Flask(__name__, static_folder=BASE_DIR)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n🧠 PROJECT GOLEM SERVER&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   📂 Serving from: <span class="hljs-subst">{BASE_DIR}</span>&quot;</span>)
--- DIAGNOSTICS ---
Check <span class="hljs-keyword">if</span> files exist before starting
missing_files = []
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> os.path.exists(os.path.join(BASE_DIR, JSON_FILE)):
missing_files.append(JSON_FILE)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> os.path.exists(os.path.join(BASE_DIR, HTML_FILE)):
missing_files.append(HTML_FILE)
<span class="hljs-keyword">if</span> missing_files:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ CRITICAL ERROR: Missing files in this folder:&quot;</span>)
<span class="hljs-keyword">for</span> f <span class="hljs-keyword">in</span> missing_files:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;      - <span class="hljs-subst">{f}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Did you run &#x27;python ingest.py&#x27; successfully?&quot;</span>)
sys.exit(<span class="hljs-number">1</span>)
<span class="hljs-keyword">else</span>:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ✅ Files Verified: Cortex Map found.&quot;</span>)
Check API Key
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> OPENAI_API_KEY:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ CRITICAL ERROR: OPENAI_API_KEY environment variable not set!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Run: export OPENAI_API_KEY=&#x27;your-key-here&#x27;&quot;</span>)
sys.exit(<span class="hljs-number">1</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Using OpenAI Embedding: <span class="hljs-subst">{OPENAI_EMBEDDING_MODEL}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ↳ Connecting to Milvus...&quot;</span>)
milvus_client = MilvusClient(uri=MILVUS_URI)
Verify collection exists
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> milvus_client.has_collection(COLLECTION_NAME):
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ CRITICAL ERROR: Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; not found in Milvus.&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Did you run &#x27;python ingest.py&#x27; successfully?&quot;</span>)
sys.exit(<span class="hljs-number">1</span>)
Initialize OpenAI client
openai_client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL)
--- ROUTES ---
<span class="hljs-meta">@app.route(<span class="hljs-params"><span class="hljs-string">&#x27;/&#x27;</span></span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">root</span>():
Force serve the specific HTML file
<span class="hljs-keyword">return</span> send_from_directory(BASE_DIR, HTML_FILE)
<span class="hljs-meta">@app.route(<span class="hljs-params"><span class="hljs-string">&#x27;/&#x27;</span></span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">serve_static</span>(<span class="hljs-params">filename</span>):
<span class="hljs-keyword">return</span> send_from_directory(BASE_DIR, filename)
<span class="hljs-meta">@app.route(<span class="hljs-params"><span class="hljs-string">&#x27;/query&#x27;</span>, methods=[<span class="hljs-string">&#x27;POST&#x27;</span>]</span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">query_brain</span>():
data = request.json
text = data.get(<span class="hljs-string">&#x27;query&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> text: <span class="hljs-keyword">return</span> jsonify({<span class="hljs-string">&quot;indices&quot;</span>: []})
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;🔎 Query: <span class="hljs-subst">{text}</span>&quot;</span>)
Get query embedding <span class="hljs-keyword">from</span> OpenAI
response = openai_client.embeddings.create(
model=OPENAI_EMBEDDING_MODEL,
<span class="hljs-built_in">input</span>=text
)
query_vec = response.data[<span class="hljs-number">0</span>].embedding
Search <span class="hljs-keyword">in</span> Milvus
results = milvus_client.search(
collection_name=COLLECTION_NAME,
data=[query_vec],
limit=<span class="hljs-number">50</span>,
output_fields=[<span class="hljs-string">&quot;id&quot;</span>]
)
Extract indices <span class="hljs-keyword">and</span> scores
indices = [r[<span class="hljs-string">&#x27;id&#x27;</span>] <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]
scores = [r[<span class="hljs-string">&#x27;distance&#x27;</span>] <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]
<span class="hljs-keyword">return</span> jsonify({
<span class="hljs-string">&quot;indices&quot;</span>: indices,
<span class="hljs-string">&quot;scores&quot;</span>: scores
})
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&#x27;__main__&#x27;</span>:
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ✅ SYSTEM ONLINE: http://localhost:8000&quot;</span>)
app.run(port=<span class="hljs-number">8000</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Scaricare il set di dati e collocarlo nella directory specificata.</p>
<pre><code translate="no">https://github.com/milvus-io/milvus-docs/tree/v2.6.x/site/en
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_4_3d17b01fec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Start-the-project" class="common-anchor-header">3. Avviare il progetto</h3><p>Conversione delle incorporazioni di testo nello spazio 3D</p>
<pre><code translate="no">python ingest.py
<button class="copy-code-btn"></button></code></pre>
<p>[immagine]</p>
<p>Avviare il servizio Frontend</p>
<pre><code translate="no">python GolemServer.py
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Visualization-and-Interaction" class="common-anchor-header">4. Visualizzazione e interazione</h3><p>Dopo che il frontend ha ricevuto i risultati del reperimento, la luminosità dei nodi viene scalata in base ai punteggi di somiglianza del coseno, mentre i colori originali dei nodi vengono conservati per mantenere chiari i cluster di categoria. Vengono tracciate linee semitrasparenti dal punto di interrogazione a ogni nodo abbinato e la telecamera esegue una panoramica e uno zoom fluidi per mettere a fuoco il cluster attivato.</p>
<h4 id="Example-1-In-Domain-Match" class="common-anchor-header">Esempio 1: Corrispondenza all'interno del dominio</h4><p>Interrogazione: "Quali tipi di indice supporta Milvus?".</p>
<p>Comportamento di visualizzazione:</p>
<ul>
<li><p>Nello spazio 3D, circa 15 nodi all'interno del cluster rosso etichettato INDEXES mostrano un notevole aumento di luminosità (circa 2-3×).</p></li>
<li><p>I nodi corrispondenti includono pezzi di documenti come index_types.md, hnsw_index.md e ivf_index.md.</p></li>
<li><p>Le linee semitrasparenti sono rese dal vettore di interrogazione a ogni nodo corrispondente e la telecamera si concentra in modo uniforme sul cluster rosso.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_2_c2522b6a67.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="Example-2-Out-of-Domain-Query-Rejection" class="common-anchor-header">Esempio 2: Rifiuto di una query fuori dal dominio</h4><p>Query: "Quanto costa il pasto KFC?".</p>
<p>Comportamento di visualizzazione:</p>
<ul>
<li><p>Tutti i nodi mantengono i loro colori originali, con solo lievi cambiamenti di dimensione (meno di 1,1×).</p></li>
<li><p>I nodi corrispondenti sono sparsi in più cluster con colori diversi, senza una chiara concentrazione semantica.</p></li>
<li><p>La telecamera non attiva un'azione di messa a fuoco, poiché la soglia di somiglianza (0,5) non è soddisfatta.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_3_39b9383771.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>Project_Golem abbinato a Milvus non sostituirà la vostra pipeline di valutazione RAG esistente, ma aggiunge qualcosa che manca alla maggior parte delle pipeline: la possibilità di vedere cosa succede all'interno dello spazio vettoriale.</p>
<p>Con questa configurazione, è possibile distinguere tra un errore di recupero causato da un cattivo embedding, uno causato da un chunking inadeguato e uno causato da una soglia leggermente troppo stretta. Una volta questo tipo di diagnosi richiedeva di tirare a indovinare e di iterare. Ora è possibile vederla.</p>
<p>L'integrazione attuale supporta il debugging interattivo su scala demo (~10.000 documenti), con il database vettoriale Milvus che gestisce il recupero di livello produttivo dietro le quinte. La strada verso la visualizzazione su scala milionaria è tracciata ma non ancora costruita, il che rende questo un buon momento per partecipare.</p>
<p>Date un'occhiata a <a href="https://github.com/CyberMagician/Project_Golem">Project_Golem</a> su GitHub, provatelo con il vostro set di dati e vedete come appare il vostro spazio vettoriale.</p>
<p>Se avete domande o volete condividere le vostre scoperte, unitevi al nostro <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canale Slack</a> o prenotate una sessione di <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> per una guida pratica sulla vostra configurazione.</p>
