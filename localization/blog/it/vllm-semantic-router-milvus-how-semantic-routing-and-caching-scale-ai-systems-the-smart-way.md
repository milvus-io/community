---
id: >-
  vllm-semantic-router-milvus-how-semantic-routing-and-caching-scale-ai-systems-the-smart-way.md
title: >-
  vLLM Semantic Router + Milvus: come il routing semantico e la cache
  costruiscono sistemi AI scalabili in modo intelligente
author: Min Yin
date: 2025-10-17T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Oct_19_2025_04_30_18_PM_af7fda1170.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, semantic routing, cache layer, vector database, vllm semantic router'
meta_title: Scale Your AI Apps the Smart Way with vLLM Semantic Router and Milvus
desc: >-
  Scoprite come vLLM, Milvus e il routing semantico ottimizzano l'inferenza di
  modelli di grandi dimensioni, riducono i costi di calcolo e incrementano le
  prestazioni dell'intelligenza artificiale in implementazioni scalabili.
origin: >-
  https://milvus.io/blog/vllm-semantic-router-milvus-how-semantic-routing-and-caching-scale-ai-systems-the-smart-way.md
---
<p>La maggior parte delle applicazioni di intelligenza artificiale si affida a un singolo modello per ogni richiesta. Ma questo approccio incontra rapidamente dei limiti. I modelli di grandi dimensioni sono potenti ma costosi, anche quando vengono utilizzati per semplici interrogazioni. I modelli più piccoli sono più economici e veloci, ma non sono in grado di gestire ragionamenti complessi. Quando il traffico aumenta, ad esempio quando la vostra applicazione di intelligenza artificiale diventa improvvisamente virale con dieci milioni di utenti, l'inefficienza di questa configurazione con un solo modello per tutti diventa dolorosamente evidente. La latenza aumenta, i costi delle GPU esplodono e il modello che ieri funzionava bene inizia a boccheggiare.</p>
<p>E <em>tu</em>, amico mio, l'ingegnere che sta dietro a questa applicazione, devi risolvere il problema, e in fretta.</p>
<p>Immaginate di distribuire più modelli di dimensioni diverse e di avere il sistema che seleziona automaticamente il migliore per ogni richiesta. Le richieste semplici vanno ai modelli più piccoli; le richieste complesse a quelli più grandi. Questa è l'idea alla base del <a href="https://github.com/vllm-project/semantic-router"><strong>Semantic Router di vLLM: un</strong></a>meccanismo di instradamento che indirizza le richieste in base al significato, non agli endpoint. Analizza il contenuto semantico, la complessità e l'intento di ogni input per selezionare il modello linguistico più adatto, garantendo che ogni richiesta venga gestita dal modello più adatto.</p>
<p>Per rendere il tutto ancora più efficiente, il Semantic Router si abbina a <a href="https://milvus.io/"><strong>Milvus</strong></a>, un database vettoriale open-source che funge da <strong>livello di cache semantica</strong>. Prima di ricompilare una risposta, controlla se una query semanticamente simile è già stata elaborata e, se trovata, recupera istantaneamente il risultato nella cache. Il risultato: risposte più rapide, costi inferiori e un sistema di recupero che scala in modo intelligente anziché sprecare.</p>
<p>In questo post approfondiremo il funzionamento del <strong>Semantic Router di vLLM</strong>, il modo in cui <strong>Milvus</strong> alimenta il suo livello di caching e il modo in cui questa architettura può essere applicata alle applicazioni AI del mondo reale.</p>
<h2 id="What-is-a-Semantic-Router" class="common-anchor-header">Che cos'è un router semantico?<button data-href="#What-is-a-Semantic-Router" class="anchor-icon" translate="no">
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
    </button></h2><p>Un <strong>router semantico</strong> è un sistema che decide <em>quale modello</em> deve gestire una determinata richiesta in base al suo significato, alla sua complessità e al suo intento. Invece di indirizzare tutto a un solo modello, distribuisce le richieste in modo intelligente su più modelli per bilanciare precisione, latenza e costi.</p>
<p>Dal punto di vista architetturale, si basa su tre livelli chiave: <strong>Routing semantico</strong>, <strong>Mixture of Models (MoM)</strong> e <strong>livello di cache</strong>.</p>
<h3 id="Semantic-Routing-Layer" class="common-anchor-header">Livello di instradamento semantico</h3><p>Il <strong>livello di routing semantico</strong> è il cervello del sistema. Analizza ogni input - cosa chiede, quanto è complesso e che tipo di ragionamento richiede - per selezionare il modello più adatto al lavoro. Ad esempio, una semplice ricerca di fatti può essere indirizzata a un modello leggero, mentre una richiesta di ragionamento in più fasi viene indirizzata a uno più grande. Questo instradamento dinamico mantiene il sistema reattivo anche quando il traffico e la diversità delle query aumentano.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/modern_approach_714403b61c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Mixture-of-Models-MoM-Layer" class="common-anchor-header">Il livello Mixture of Models (MoM)</h3><p>Il secondo livello, il <strong>Mixture of Models (MoM)</strong>, integra più modelli di dimensioni e capacità diverse in un sistema unificato. Si ispira all'architettura <a href="https://zilliz.com/learn/what-is-mixture-of-experts"><strong>Mixture of Experts</strong></a> <strong>(MoE)</strong>, ma invece di scegliere gli "esperti" all'interno di un unico grande modello, opera su più modelli indipendenti. Questo design riduce la latenza, abbassa i costi ed evita di essere vincolati a un singolo fornitore di modelli.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/MOM_0a3eb61985.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Cache-Layer-Where-Milvus-Makes-the-Difference" class="common-anchor-header">Il livello di cache: Dove Milvus fa la differenza</h3><p>Infine, il <strong>livello di cache, alimentato</strong>da <a href="https://milvus.io/">Milvus Vector Database, agisce</a>come memoria del sistema. Prima di eseguire una nuova query, controlla se una richiesta semanticamente simile è stata elaborata in precedenza. In caso affermativo, recupera immediatamente il risultato nella cache, risparmiando tempo di calcolo e migliorando il throughput.</p>
<p>I sistemi di caching tradizionali si basano su archivi di valori-chiave in memoria, che corrispondono alle richieste in base a stringhe o modelli esatti. Questo funziona bene quando le query sono ripetitive e prevedibili. Ma gli utenti reali raramente digitano la stessa cosa due volte. Una volta che la formulazione cambia, anche di poco, la cache non riesce a riconoscere lo stesso intento. Con il tempo, il tasso di risposta della cache diminuisce e i guadagni di prestazioni svaniscono con la naturale deriva del linguaggio.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/semantic_caching_for_vllm_routing_df889058c9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Per risolvere questo problema, abbiamo bisogno di una cache che comprenda il <em>significato</em>, non solo le parole corrispondenti. È qui che entra in gioco il <strong>recupero semantico</strong>. Invece di confrontare le stringhe, confronta gli embeddings, rappresentazioni vettoriali ad alta dimensione che catturano la somiglianza semantica. La sfida, però, è la scala. L'esecuzione di una ricerca bruta su milioni o miliardi di vettori su una singola macchina (con complessità temporale O(N-d)) è computazionalmente proibitiva. I costi di memoria esplodono, la scalabilità orizzontale crolla e il sistema fatica a gestire picchi di traffico improvvisi o query a coda lunga.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_routing_system_5837b93074.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Milvus</strong>, un database vettoriale distribuito costruito appositamente per la ricerca semantica su larga scala, offre la scalabilità orizzontale e la tolleranza agli errori di cui ha bisogno questo livello di cache. Memorizza le incorporazioni in modo efficiente tra i vari nodi ed esegue ricerche <a href="https://zilliz.com/blog/ANN-machine-learning">approssimate di prossimità</a>(ANN) con una latenza minima, anche su larga scala. Con le giuste soglie di somiglianza e strategie di fallback, Milvus garantisce prestazioni stabili e prevedibili, trasformando il livello di cache in una memoria semantica resiliente per l'intero sistema di routing.</p>
<h2 id="How-Developers-Are-Using-Semantic-Router-+-Milvus-in-Production" class="common-anchor-header">Come gli sviluppatori utilizzano Semantic Router + Milvus in produzione<button data-href="#How-Developers-Are-Using-Semantic-Router-+-Milvus-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>La combinazione di <strong>vLLM Semantic Router</strong> e <strong>Milvus</strong> brilla negli ambienti di produzione reali, dove velocità, costi e riutilizzabilità sono fondamentali.</p>
<p>Si distinguono tre scenari comuni:</p>
<h3 id="1-Customer-Service-QA" class="common-anchor-header">1. Q&amp;A del servizio clienti</h3><p>I bot rivolti ai clienti gestiscono ogni giorno volumi enormi di domande ripetitive: reimpostazione della password, aggiornamento dell'account, stato delle consegne. Questo dominio è sensibile sia ai costi che alla latenza, il che lo rende ideale per il routing semantico. Il router invia le domande di routine a modelli più piccoli e veloci, mentre quelle complesse o ambigue vengono trasferite a modelli più grandi per un ragionamento più approfondito. Nel frattempo, Milvus memorizza nella cache le coppie di domande e risposte precedenti, in modo che quando appaiono domande simili, il sistema può riutilizzare istantaneamente le risposte precedenti invece di rigenerarle.</p>
<h3 id="2-Code-Assistance" class="common-anchor-header">2. Assistenza al codice</h3><p>Negli strumenti per sviluppatori o negli assistenti IDE, molte query si sovrappongono: aiuto sintattico, ricerca di API, piccoli suggerimenti per il debug. Analizzando la struttura semantica di ogni richiesta, il router seleziona dinamicamente un modello di dimensioni adeguate: leggero per compiti semplici, più capace per ragionamenti in più fasi. Milvus aumenta ulteriormente la reattività mettendo in cache problemi di codifica simili e le loro soluzioni, trasformando le precedenti interazioni dell'utente in una base di conoscenza riutilizzabile.</p>
<h3 id="3-Enterprise-Knowledge-Base" class="common-anchor-header">3. Base di conoscenza aziendale</h3><p>Le interrogazioni aziendali tendono a ripetersi nel tempo: ricerca di politiche, riferimenti alla conformità, FAQ sui prodotti. Con Milvus come livello di cache semantica, le domande più frequenti e le relative risposte possono essere memorizzate e recuperate in modo efficiente. In questo modo si riducono al minimo i calcoli ridondanti, mantenendo le risposte coerenti tra i vari reparti e regioni.</p>
<p>La pipeline <strong>Semantic Router + Milvus</strong> è implementata in <strong>Go</strong> e <strong>Rust</strong> per garantire prestazioni elevate e bassa latenza. Integrata nel livello gateway, monitora continuamente le metriche chiave, come le percentuali di risposta, la latenza del routing e le prestazioni del modello, per mettere a punto le strategie di routing in tempo reale.</p>
<h2 id="How-to-Quickly-Test-the-Semantic-Caching-in-the-Semantic-Router" class="common-anchor-header">Come testare rapidamente la cache semantica nel router semantico<button data-href="#How-to-Quickly-Test-the-Semantic-Caching-in-the-Semantic-Router" class="anchor-icon" translate="no">
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
    </button></h2><p>Prima di distribuire la cache semantica su scala, è utile convalidare il suo comportamento in una configurazione controllata. In questa sezione, faremo un rapido test locale che mostra come il Semantic Router utilizza <strong>Milvus</strong> come cache semantica. Vedrete come le query simili vengono immediatamente inserite nella cache, mentre quelle nuove o diverse attivano la generazione del modello, dimostrando la logica della cache in azione.</p>
<h3 id="Prerequisites" class="common-anchor-header">Prerequisiti</h3><ul>
<li>Ambiente container: Docker + Docker Compose</li>
<li>Database vettoriale: Servizio Milvus</li>
<li>LLM + Incorporamento: Progetto scaricato localmente</li>
</ul>
<h3 id="1Deploy-the-Milvus-Vector-Database" class="common-anchor-header">1.Distribuire il database vettoriale Milvus</h3><p>Scaricare i file di distribuzione</p>
<pre><code translate="no">wget https://github.com/Milvus-io/Milvus/releases/download/v2.5.12/Milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>Avviare il servizio Milvus.</p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Start_the_Milvus_service_211f8b11f1.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Clone-the-project" class="common-anchor-header">2. Clonate il progetto</h3><pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/vllm-project/semantic-router.git
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Download-local-models" class="common-anchor-header">3. Scaricare i modelli locali</h3><pre><code translate="no"><span class="hljs-built_in">cd</span> semantic-router
make download-models
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Download_local_models_6243011fa5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="4-Configuration-Modifications" class="common-anchor-header">4. Modifiche alla configurazione</h3><p>Nota: modificare il tipo di semantic_cache in milvus.</p>
<pre><code translate="no">vim config.yaml
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">semantic_cache:
  enabled: true
  backend_type: <span class="hljs-string">&quot;milvus&quot;</span>  <span class="hljs-comment"># Options: &quot;memory&quot; or &quot;milvus&quot;</span>
  backend_config_path: <span class="hljs-string">&quot;config/cache/milvus.yaml&quot;</span>
  similarity_threshold: <span class="hljs-number">0.8</span>
  max_entries: <span class="hljs-number">1000</span>  <span class="hljs-comment"># Only applies to memory backend</span>
  ttl_seconds: <span class="hljs-number">3600</span>
  eviction_policy: <span class="hljs-string">&quot;fifo&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Modificare la configurazione di Mmilvus Nota: Inserire il servizio Milvusmilvus appena distribuito.</p>
<pre><code translate="no">vim milvus.yaml
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Milvus connection settings</span>
connection:
  <span class="hljs-comment"># Milvus server host (change for production deployment)</span>
  host: <span class="hljs-string">&quot;192.168.7.xxx&quot;</span>  <span class="hljs-comment"># For production: use your Milvus cluster endpoint</span>
  <span class="hljs-comment"># Milvus server port</span>
  port: <span class="hljs-number">19530</span>  <span class="hljs-comment"># Standard Milvus port</span>
  <span class="hljs-comment"># Database name (optional, defaults to &quot;default&quot;)</span>
  database: <span class="hljs-string">&quot;default&quot;</span>
  <span class="hljs-comment"># Connection timeout in seconds</span>
  timeout: <span class="hljs-number">30</span>
  <span class="hljs-comment"># Authentication (enable for production)</span>
  auth:
    enabled: false  <span class="hljs-comment"># Set to true for production</span>
    username: <span class="hljs-string">&quot;&quot;</span>    <span class="hljs-comment"># Your Milvus username</span>
    password: <span class="hljs-string">&quot;&quot;</span>    <span class="hljs-comment"># Your Milvus password</span>
  <span class="hljs-comment"># TLS/SSL configuration (recommended for production)</span>
  tls:
    enabled: false      <span class="hljs-comment"># Set to true for secure connections</span>
    cert_file: <span class="hljs-string">&quot;&quot;</span>       <span class="hljs-comment"># Path to client certificate</span>
    key_file: <span class="hljs-string">&quot;&quot;</span>        <span class="hljs-comment"># Path to client private key</span>
    ca_file: <span class="hljs-string">&quot;&quot;</span>         <span class="hljs-comment"># Path to CA certificate</span>
<span class="hljs-comment"># Collection settings</span>
collection:
  <span class="hljs-comment"># Name of the collection to store cache entries</span>
  name: <span class="hljs-string">&quot;semantic_cache&quot;</span>
  <span class="hljs-comment"># Description of the collection</span>
  description: <span class="hljs-string">&quot;Semantic cache for LLM request-response pairs&quot;</span>
  <span class="hljs-comment"># Vector field configuration</span>
  vector_field:
    <span class="hljs-comment"># Name of the vector field</span>
    name: <span class="hljs-string">&quot;embedding&quot;</span>
    <span class="hljs-comment"># Dimension of the embeddings (auto-detected from model at runtime)</span>
    dimension: <span class="hljs-number">384</span>  <span class="hljs-comment"># This value is ignored - dimension is auto-detected from the embedding model</span>
    <span class="hljs-comment"># Metric type for similarity calculation</span>
    metric_type: <span class="hljs-string">&quot;IP&quot;</span>  <span class="hljs-comment"># Inner Product (cosine similarity for normalized vectors)</span>
  <span class="hljs-comment"># Index configuration for the vector field</span>
  index:
    <span class="hljs-comment"># Index type (HNSW is recommended for most use cases)</span>
    <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;HNSW&quot;</span>
    <span class="hljs-comment"># Index parameters</span>
    params:
      M: <span class="hljs-number">16</span>              <span class="hljs-comment"># Number of bi-directional links for each node</span>
      efConstruction: <span class="hljs-number">64</span>  <span class="hljs-comment"># Search scope during index construction</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Start-the-project" class="common-anchor-header">5. Avviare il progetto</h3><p>Nota: Si consiglia di modificare alcune dipendenze del file Docker in sorgenti domestiche.</p>
<pre><code translate="no">docker compose --profile testing up --build
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Start_the_project_4e7c2a8332.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="6-Test-Requests" class="common-anchor-header">6. Test delle richieste</h3><p>Nota: due richieste in totale (no cache e cache hit) Prima richiesta:</p>
<pre><code translate="no"><span class="hljs-built_in">echo</span> <span class="hljs-string">&quot;=== 第一次请求（无缓存状态） ===&quot;</span> &amp;&amp; \
<span class="hljs-keyword">time</span> curl -X POST http://localhost:8801/v1/chat/completions \
  -H <span class="hljs-string">&quot;Content-Type: application/json&quot;</span> \
  -H <span class="hljs-string">&quot;Authorization: Bearer test-token&quot;</span> \
  -d <span class="hljs-string">&#x27;{
    &quot;model&quot;: &quot;auto&quot;,
    &quot;messages&quot;: [
      {&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;You are a helpful assistant.&quot;},
      {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;What are the main renewable energy sources?&quot;}
    ],
    &quot;temperature&quot;: 0.7
  }&#x27;</span> | jq .
<button class="copy-code-btn"></button></code></pre>
<p>Output:</p>
<pre><code translate="no"><span class="hljs-built_in">real</span>    <span class="hljs-number">0</span>m16<span class="hljs-number">.546</span>s
user    <span class="hljs-number">0</span>m0<span class="hljs-number">.116</span>s
sys     <span class="hljs-number">0</span>m0<span class="hljs-number">.033</span>s
<button class="copy-code-btn"></button></code></pre>
<p>Seconda richiesta:</p>
<pre><code translate="no"><span class="hljs-built_in">echo</span> <span class="hljs-string">&quot;=== 第二次请求（缓存状态） ===&quot;</span> &amp;&amp; \
<span class="hljs-keyword">time</span> curl -X POST http://localhost:8801/v1/chat/completions \
  -H <span class="hljs-string">&quot;Content-Type: application/json&quot;</span> \
  -H <span class="hljs-string">&quot;Authorization: Bearer test-token&quot;</span> \
  -d <span class="hljs-string">&#x27;{
    &quot;model&quot;: &quot;auto&quot;,
    &quot;messages&quot;: [
      {&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;You are a helpful assistant.&quot;},
      {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;What are the main renewable energy sources?&quot;}
    ],
    &quot;temperature&quot;: 0.7
  }&#x27;</span> | jq .
<button class="copy-code-btn"></button></code></pre>
<p>Uscita:</p>
<pre><code translate="no"><span class="hljs-built_in">real</span>    <span class="hljs-number">0</span>m2<span class="hljs-number">.393</span>s
user    <span class="hljs-number">0</span>m0<span class="hljs-number">.116</span>s
sys     <span class="hljs-number">0</span>m0<span class="hljs-number">.021</span>s
<button class="copy-code-btn"></button></code></pre>
<p>Questo test dimostra la cache semantica di Semantic Router in azione. Sfruttando Milvus come database vettoriale, il sistema abbina in modo efficiente query semanticamente simili, migliorando i tempi di risposta quando gli utenti pongono domande uguali o simili.</p>
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
    </button></h2><p>Con la crescita dei carichi di lavoro dell'intelligenza artificiale e l'ottimizzazione dei costi, la combinazione di vLLM Semantic Router e <a href="https://milvus.io/">Milvus</a> offre un modo pratico per scalare in modo intelligente. Inoltrando ogni richiesta al modello giusto e memorizzando nella cache i risultati semanticamente simili con un database vettoriale distribuito, questa configurazione riduce i costi di calcolo e mantiene le risposte veloci e coerenti tra i vari casi d'uso.</p>
<p>In breve, si ottiene uno scaling più intelligente: meno forza bruta, più cervello.</p>
<p>Se volete approfondire l'argomento, partecipate alla conversazione nel nostro <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord</a> o aprite un problema su<a href="https://github.com/milvus-io/milvus"> GitHub</a>. È anche possibile prenotare una<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> sessione</a> di 20 minuti di<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> per ricevere indicazioni, approfondimenti e approfondimenti tecnici dal team che sta dietro a Milvus.</p>
