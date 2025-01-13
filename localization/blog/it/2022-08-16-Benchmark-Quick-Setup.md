---
id: 2022-08-16-A-Quick-Guide-to-Benchmarking-Milvus-2-1.md
title: Guida rapida al benchmarking di Milvus 2.1
author: Yanliang Qiao
date: 2022-08-16T00:00:00.000Z
desc: >-
  Seguite la nostra guida passo-passo per eseguire un benchmark Milvus 2.1 da
  soli.
cover: assets.zilliz.com/Benchmark_Quick_Setup_58cc8eed5b.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/2022-08-16-A-Quick-Guide-to-Benchmarking-Milvus-2-1.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Benchmark_Quick_Setup_58cc8eed5b.png" alt="Cover" class="doc-image" id="cover" />
   </span> <span class="img-wrapper"> <span>Copertina</span> </span></p>
<p>Di recente, abbiamo aggiornato il <a href="https://milvus.io/docs/v2.1.x/benchmark.md">rapporto di benchmark di Milvus 2.1</a>. I test con un set di dati di 1 milione di vettori hanno dimostrato che il QPS può essere aumentato drasticamente unendo query di <a href="https://milvus.io/docs/v2.1.x/benchmark.md#Terminology">piccole</a> dimensioni.</p>
<p>Ecco alcuni semplici script per riprodurre facilmente i test.</p>
<h2 id="Procedures" class="common-anchor-header">Procedure<button data-href="#Procedures" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li><p>Distribuire un Milvus standalone o un cluster. In questo caso, l'indirizzo IP del server Milvus è 10.100.31.105.</p></li>
<li><p>Distribuire un client. In questo caso, utilizziamo Ubuntu 18.04 e Python 3.8.13 per la distribuzione. Eseguire il seguente codice per installare PyMilvus 2.1.1.</p></li>
</ol>
<pre><code translate="no">pip install pymilvus==2.1.1
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li><p>Scaricare e copiare i seguenti file nella stessa directory di lavoro del client. In questo caso, la directory di lavoro è <code translate="no">/go_ben</code>.</p>
<ul>
<li><p><a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/collection_prepare.py"><code translate="no">collection_prepare.py</code></a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/go_benchmark.py"><code translate="no">go_benchmark.py</code></a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/benchmark"><code translate="no">benchmark</code></a> (per Ubuntu) o <a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/benchmark-mac"><code translate="no">benchmark-mac</code></a> (per macOS)</p></li>
</ul>
<p><strong>Nota:</strong></p>
<ul>
<li><p><code translate="no">benchmark</code> e <code translate="no">benchmark-mac</code> sono file eseguibili sviluppati e compilati usando Go SDK 2.1.1. Vengono utilizzati solo per condurre una ricerca concorrente.</p></li>
<li><p>Per gli utenti di Ubuntu, scaricare <code translate="no">benchmark</code>; per gli utenti di macOS, scaricare <code translate="no">benchmark-mac</code>.</p></li>
<li><p>Per accedere a <code translate="no">benchmark</code> o <code translate="no">benchmark-mac</code> sono necessari i permessi di esecuzione.</p></li>
<li><p>Gli utenti Mac devono fidarsi del file <code translate="no">benchmark-mac</code> configurando Sicurezza e privacy nelle Preferenze di sistema.</p></li>
<li><p>Le impostazioni sulla ricerca concorrente possono essere trovate e modificate nel codice sorgente di <code translate="no">go_benchmark.py</code>.</p></li>
</ul></li>
</ol>
<ol start="4">
<li>Creare una collezione e inserire i dati vettoriali.</li>
</ol>
<pre><code translate="no">root@milvus-pytest:/go_ben<span class="hljs-comment"># python collection_prepare.py 10.100.31.105 </span>
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>Aprire <code translate="no">/tmp/collection_prepare.log</code> per verificare il risultato dell'esecuzione.</li>
</ol>
<pre><code translate="no">...
08/11/2022 17:33:34 PM - INFO - Build index costs 263.626
08/11/2022 17:33:54 PM - INFO - Collection prepared completed
<button class="copy-code-btn"></button></code></pre>
<ol start="6">
<li>Chiamare <code translate="no">benchmark</code> (o <code translate="no">benchmark-mac</code> su macOS) per eseguire una ricerca concorrente.</li>
</ol>
<pre><code translate="no">root@milvus-pytest:/go_ben<span class="hljs-meta"># python go_benchmark.py 10.100.31.105 ./benchmark</span>
[<span class="hljs-meta">write_json_file</span>] <span class="hljs-function">Remove <span class="hljs-title">file</span>(<span class="hljs-params">search_vector_file.json</span>).
[write_json_file] Write json <span class="hljs-keyword">file</span>:search_vector_file.json done.
Params of go_benchmark: [&#x27;./benchmark&#x27;, &#x27;locust&#x27;, &#x27;-u&#x27;, &#x27;10.100.31.105:19530&#x27;, &#x27;-q&#x27;, &#x27;search_vector_file.json&#x27;, &#x27;-s&#x27;, &#x27;</span>{\n  <span class="hljs-string">&quot;collection_name&quot;</span>: <span class="hljs-string">&quot;random_1m&quot;</span>,\n  <span class="hljs-string">&quot;partition_names&quot;</span>: [],\n  <span class="hljs-string">&quot;fieldName&quot;</span>: <span class="hljs-string">&quot;embedding&quot;</span>,\n  <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;HNSW&quot;</span>,\n  <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>,\n  <span class="hljs-string">&quot;params&quot;</span>: {\n    <span class="hljs-string">&quot;sp_value&quot;</span>: <span class="hljs-number">64</span>,\n    <span class="hljs-string">&quot;dim&quot;</span>: <span class="hljs-number">128</span>\n  },\n  <span class="hljs-string">&quot;limit&quot;</span>: <span class="hljs-number">1</span>,\n  <span class="hljs-string">&quot;expr&quot;</span>: <span class="hljs-literal">null</span>,\n  <span class="hljs-string">&quot;output_fields&quot;</span>: [],\n  <span class="hljs-string">&quot;timeout&quot;</span>: <span class="hljs-number">600</span>\n}<span class="hljs-string">&#x27;, &#x27;</span>-p<span class="hljs-string">&#x27;, &#x27;</span><span class="hljs-number">10&#x27;</span>, <span class="hljs-string">&#x27;-f&#x27;</span>, <span class="hljs-string">&#x27;json&#x27;</span>, <span class="hljs-string">&#x27;-t&#x27;</span>, <span class="hljs-string">&#x27;60&#x27;</span>, <span class="hljs-string">&#x27;-i&#x27;</span>, <span class="hljs-string">&#x27;20&#x27;</span>, <span class="hljs-string">&#x27;-l&#x27;</span>, <span class="hljs-string">&#x27;go_log_file.log&#x27;</span>]
[<span class="hljs-meta">2022-08-11 11:37:39.811</span>][    INFO] - Name      <span class="hljs-meta">#   reqs      # fails  |       Avg       Min       Max    Median  |     req/s  failures/s (benchmark_run.go:212:sample)</span>
[<span class="hljs-meta">2022-08-11 11:37:39.811</span>][    INFO] - go search     <span class="hljs-number">9665</span>     <span class="hljs-number">0</span>(<span class="hljs-number">0.00</span>%)  |    <span class="hljs-number">20.679</span>     <span class="hljs-number">6.499</span>    <span class="hljs-number">81.761</span>    <span class="hljs-number">12.810</span>  |    <span class="hljs-number">483.25</span>        <span class="hljs-number">0.00</span> (benchmark_run.go:<span class="hljs-number">213</span>:sample)
[<span class="hljs-meta">2022-08-11 11:37:59.811</span>][    INFO] - Name      <span class="hljs-meta">#   reqs      # fails  |       Avg       Min       Max    Median  |     req/s  failures/s (benchmark_run.go:212:sample)</span>
[<span class="hljs-meta">2022-08-11 11:37:59.811</span>][    INFO] - go search    <span class="hljs-number">19448</span>     <span class="hljs-number">0</span>(<span class="hljs-number">0.00</span>%)  |    <span class="hljs-number">20.443</span>     <span class="hljs-number">6.549</span>    <span class="hljs-number">78.121</span>    <span class="hljs-number">13.401</span>  |    <span class="hljs-number">489.22</span>        <span class="hljs-number">0.00</span> (benchmark_run.go:<span class="hljs-number">213</span>:sample)
[<span class="hljs-meta">2022-08-11 11:38:19.811</span>][    INFO] - Name      <span class="hljs-meta">#   reqs      # fails  |       Avg       Min       Max    Median  |     req/s  failures/s (benchmark_run.go:212:sample)</span>
[<span class="hljs-meta">2022-08-11 11:38:19.811</span>][    INFO] - go search    <span class="hljs-number">29170</span>     <span class="hljs-number">0</span>(<span class="hljs-number">0.00</span>%)  |    <span class="hljs-number">20.568</span>     <span class="hljs-number">6.398</span>    <span class="hljs-number">76.887</span>    <span class="hljs-number">12.828</span>  |    <span class="hljs-number">486.15</span>        <span class="hljs-number">0.00</span> (benchmark_run.go:<span class="hljs-number">213</span>:sample)
[<span class="hljs-meta">2022-08-11 11:38:19.811</span>][   DEBUG] - go search run finished, parallel: <span class="hljs-number">10</span>(benchmark_run.go:<span class="hljs-number">95</span>:benchmark)
[<span class="hljs-meta">2022-08-11 11:38:19.811</span>][    INFO] - Name      <span class="hljs-meta">#   reqs      # fails  |       Avg       Min       Max    Median  |     req/s  failures/s (benchmark_run.go:159:samplingLoop)</span>
[<span class="hljs-meta">2022-08-11 11:38:19.811</span>][    INFO] - go search    <span class="hljs-number">29180</span>     <span class="hljs-number">0</span>(<span class="hljs-number">0.00</span>%)  |    <span class="hljs-number">20.560</span>     <span class="hljs-number">6.398</span>    <span class="hljs-number">81.761</span>    <span class="hljs-number">13.014</span>  |    <span class="hljs-number">486.25</span>        <span class="hljs-number">0.00</span> (benchmark_run.go:<span class="hljs-number">160</span>:samplingLoop)
Result of go_benchmark: {<span class="hljs-string">&#x27;response&#x27;</span>: True, <span class="hljs-string">&#x27;err_code&#x27;</span>: <span class="hljs-number">0</span>, <span class="hljs-string">&#x27;err_message&#x27;</span>: <span class="hljs-string">&#x27;&#x27;</span>} 
<button class="copy-code-btn"></button></code></pre>
<ol start="7">
<li>Aprire il file <code translate="no">go_log_file.log</code> nella directory corrente per controllare il log dettagliato della ricerca. Di seguito sono riportate le informazioni sulla ricerca che si possono trovare nel registro di ricerca.<ul>
<li><p>reqs: numero di richieste di ricerca dal momento in cui si verifica la concomitanza al momento attuale (l'arco di tempo corrente)</p></li>
<li><p>fails: numero di richieste non riuscite come percentuale delle richieste nell'intervallo di tempo corrente</p></li>
<li><p>Avg: tempo medio di risposta della richiesta nell'intervallo di tempo corrente (unità: millisecondi)</p></li>
<li><p>Min: tempo minimo di risposta alla richiesta nell'intervallo di tempo corrente (unità: millisecondi)</p></li>
<li><p>Max: tempo massimo di risposta alla richiesta nell'intervallo di tempo corrente (unità: millisecondi)</p></li>
<li><p>Mediana: tempo di risposta mediano della richiesta nell'intervallo di tempo corrente (unità: millisecondi)</p></li>
<li><p>req/s: numero di richieste al secondo, ovvero QPS</p></li>
<li><p>failures/s: numero medio di richieste fallite al secondo nell'intervallo di tempo corrente.</p></li>
</ul></li>
</ol>
<h2 id="Downloading-Scripts-and-Executable-Files" class="common-anchor-header">Scaricare gli script e i file eseguibili<button data-href="#Downloading-Scripts-and-Executable-Files" class="anchor-icon" translate="no">
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
<li><p><a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/collection_prepare.py">collection_prepare.py</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/go_benchmark.py">go_benchmark.py</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/benchmark">benchmark</a> per Ubuntu</p></li>
<li><p><a href="https://github.com/milvus-io/milvus-tools/blob/main/benchmark/benchmark-mac">benchmark-mac</a> per macOS</p></li>
</ul>
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
    </button></h2><p>Con il rilascio ufficiale di Milvus 2.1, abbiamo preparato una serie di blog che introducono le nuove funzionalità. Per saperne di più, leggete questa serie di blog:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Come utilizzare i dati delle stringhe per potenziare le applicazioni di ricerca per similarità</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Utilizzo di Milvus incorporato per installare ed eseguire immediatamente Milvus con Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Aumentare la velocità di lettura del database vettoriale con le repliche in memoria</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Capire il livello di consistenza nel database vettoriale Milvus</a></li>
<li><a href="https://milvus.io/blog/data-security.md">In che modo il database vettoriale Milvus garantisce la sicurezza dei dati?</a></li>
</ul>
