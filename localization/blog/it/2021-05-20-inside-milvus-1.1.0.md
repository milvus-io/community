---
id: inside-milvus-1.1.0.md
title: Nuove funzionalità
author: milvus
date: 2021-05-20T08:35:42.700Z
desc: >-
  Milvus v1.1.0 è arrivato! Sono disponibili nuove funzioni, miglioramenti e
  correzioni di bug.
cover: assets.zilliz.com/v1_1_cover_487e70971a.jpeg
tag: News
canonicalUrl: 'https://zilliz.com/blog/inside-milvus-1.1.0'
---
<custom-h1>Dentro Milvus 1.1.0</custom-h1><p><a href="https://github.com/milvus-io">Milvus</a> è un progetto software open-source (OSS) in corso, incentrato sulla creazione del database vettoriale più veloce e affidabile al mondo. Le novità di Milvus v1.1.0 sono le prime di molti aggiornamenti futuri, grazie al sostegno a lungo termine della comunità open-source e alla sponsorizzazione di Zilliz. Questo articolo del blog illustra le nuove funzionalità, i miglioramenti e le correzioni di bug inclusi in Milvus v1.1.0.</p>
<p><strong>Vai a:</strong></p>
<ul>
<li><a href="#new-features">Nuove funzionalità</a></li>
<li><a href="#improvements">Miglioramenti</a></li>
<li><a href="#bug-fixes">Correzioni di bug</a></li>
</ul>
<p><br/></p>
<h2 id="New-features" class="common-anchor-header">Nuove funzionalità<button data-href="#New-features" class="anchor-icon" translate="no">
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
    </button></h2><p>Come ogni progetto OSS, Milvus è un continuo lavoro in corso. Ci sforziamo di ascoltare i nostri utenti e la comunità open-source per dare priorità alle funzionalità più importanti. L'ultimo aggiornamento, Milvus v1.1.0, offre le seguenti nuove funzionalità:</p>
<h3 id="Specify-partitions-with-getentitybyid-method-calls" class="common-anchor-header">Specificare le partizioni con le chiamate al metodo <code translate="no">get_entity_by_id()</code> </h3><p>Per accelerare ulteriormente la ricerca di similarità vettoriale, Milvus 1.1.0 supporta ora il recupero di vettori da una partizione specificata. In generale, Milvus supporta l'interrogazione di vettori attraverso ID vettoriali specificati. In Milvus 1.0, chiamando il metodo <code translate="no">get_entity_by_id()</code> si cerca nell'intera collezione, il che può richiedere molto tempo per grandi insiemi di dati. Come si può vedere dal codice sottostante, <code translate="no">GetVectorsByIdHelper</code> utilizza una struttura <code translate="no">FileHolder</code> per eseguire un ciclo e trovare un vettore specifico.</p>
<pre><code translate="no">std::vector&lt;meta::CollectionSchema&gt; collection_array; 
 <span class="hljs-type">auto</span> <span class="hljs-variable">status</span> <span class="hljs-operator">=</span> meta_ptr_-&gt;ShowPartitions(collection.collection_id_, collection_array); 
  
 collection_array.push_back(collection); 
 status = meta_ptr_-&gt;FilesByTypeEx(collection_array, file_types, files_holder); 
 <span class="hljs-keyword">if</span> (!status.ok()) { 
     std::<span class="hljs-type">string</span> <span class="hljs-variable">err_msg</span> <span class="hljs-operator">=</span> <span class="hljs-string">&quot;Failed to get files for GetVectorByID: &quot;</span> + status.message(); 
     LOG_ENGINE_ERROR_ &lt;&lt; err_msg; 
     <span class="hljs-keyword">return</span> status; 
 } 
  
 <span class="hljs-keyword">if</span> (files_holder.HoldFiles().empty()) { 
     LOG_ENGINE_DEBUG_ &lt;&lt; <span class="hljs-string">&quot;No files to get vector by id from&quot;</span>; 
     <span class="hljs-keyword">return</span> Status(DB_NOT_FOUND, <span class="hljs-string">&quot;Collection is empty&quot;</span>); 
 } 
  
 cache::CpuCacheMgr::GetInstance()-&gt;PrintInfo(); 
 status = GetVectorsByIdHelper(id_array, vectors, files_holder); 
DBImpl::GetVectorsByIdHelper(const IDNumbers&amp; id_array, std::vector&lt;engine::VectorsData&gt;&amp; vectors, 
                              meta::FilesHolder&amp; files_holder) { 
     <span class="hljs-comment">// attention: this is a copy, not a reference, since the files_holder.UnMarkFile will change the array internal </span>
     milvus::engine::meta::<span class="hljs-type">SegmentsSchema</span> <span class="hljs-variable">files</span> <span class="hljs-operator">=</span> files_holder.HoldFiles(); 
     LOG_ENGINE_DEBUG_ &lt;&lt; <span class="hljs-string">&quot;Getting vector by id in &quot;</span> &lt;&lt; files.size() &lt;&lt; <span class="hljs-string">&quot; files, id count = &quot;</span> &lt;&lt; id_array.size(); 
  
     <span class="hljs-comment">// sometimes not all of id_array can be found, we need to return empty vector for id not found </span>
     <span class="hljs-comment">// for example: </span>
     <span class="hljs-comment">// id_array = [1, -1, 2, -1, 3] </span>
     <span class="hljs-comment">// vectors should return [valid_vector, empty_vector, valid_vector, empty_vector, valid_vector] </span>
     <span class="hljs-comment">// the ID2RAW is to ensure returned vector sequence is consist with id_array </span>
     <span class="hljs-type">using</span> <span class="hljs-variable">ID2VECTOR</span> <span class="hljs-operator">=</span> std::map&lt;int64_t, VectorsData&gt;; 
     ID2VECTOR map_id2vector; 
  
     vectors.clear(); 
  
     <span class="hljs-type">IDNumbers</span> <span class="hljs-variable">temp_ids</span> <span class="hljs-operator">=</span> id_array; 
     <span class="hljs-keyword">for</span> (auto&amp; file : files) { 
<button class="copy-code-btn"></button></code></pre>
<p>Tuttavia, questa struttura non è filtrata da alcuna partizione in <code translate="no">FilesByTypeEx()</code>. In Milvus v1.1.0, è possibile per il sistema passare i nomi delle partizioni al ciclo <code translate="no">GetVectorsIdHelper</code> in modo che <code translate="no">FileHolder</code> contenga solo i segmenti delle partizioni specificate. In altre parole, se si sa esattamente a quale partizione appartiene il vettore da ricercare, è possibile specificare il nome della partizione in una chiamata al metodo <code translate="no">get_entity_by_id()</code> per accelerare il processo di ricerca.</p>
<p>Non solo abbiamo apportato modifiche al codice che controlla le query di sistema a livello di server Milvus, ma abbiamo anche aggiornato tutti i nostri SDK (Python, Go, C++, Java e RESTful) aggiungendo un parametro per specificare i nomi delle partizioni. Ad esempio, in pymilvus, la definizione di <code translate="no">get_entity_by_id</code> <code translate="no">def get_entity_by_id(self, collection_name, ids, timeout=None)</code> è cambiata in <code translate="no">def get_entity_by_id(self, collection_name, partition_tags=None, ids, timeout=None)</code>.</p>
<p><br/></p>
<h3 id="Specify-partitions-with-deleteentitybyid-method-calls" class="common-anchor-header">Specificare le partizioni con le chiamate al metodo <code translate="no">delete_entity_by_id()</code> </h3><p>Per rendere più efficiente la gestione dei vettori, Milvus v1.1.0 supporta ora la specificazione dei nomi delle partizioni quando si cancella un vettore in una collezione. In Milvus 1.0, i vettori di una collezione possono essere cancellati solo per ID. Quando si chiama il metodo di cancellazione, Milvus esegue una scansione di tutti i vettori della collezione. Tuttavia, è molto più efficiente scansionare solo le partizioni rilevanti quando si lavora con enormi insiemi di milioni, miliardi o addirittura trilioni di vettori. Analogamente alla nuova funzione per specificare le partizioni con le chiamate al metodo <code translate="no">get_entity_by_id()</code>, sono state apportate modifiche al codice di Milvus utilizzando la stessa logica.</p>
<p><br/></p>
<h3 id="New-method-releasecollection" class="common-anchor-header">Nuovo metodo <code translate="no">release_collection()</code></h3><p>Per liberare la memoria utilizzata da Milvus per caricare le collezioni in fase di esecuzione, in Milvus v1.1.0 è stato aggiunto un nuovo metodo <code translate="no">release_collection()</code> per scaricare manualmente dalla cache collezioni specifiche.</p>
<p><br/></p>
<h2 id="Improvements" class="common-anchor-header">Miglioramenti<button data-href="#Improvements" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebbene le nuove funzionalità siano di solito di gran moda, è anche importante migliorare quelle che già abbiamo. Di seguito sono riportati gli aggiornamenti e altri miglioramenti generali rispetto a Milvus v1.0.</p>
<p><br/></p>
<h3 id="Improved-performance-of-getentitybyid-method-call" class="common-anchor-header">Miglioramento delle prestazioni delle chiamate al metodo <code translate="no">get_entity_by_id()</code> </h3><p>Il grafico seguente è un confronto delle prestazioni della ricerca vettoriale tra Milvus v1.0 e Milvus v1.1.0:</p>
<blockquote>
<p>CPU: CPU Intel® Core™ i7-8550U @ 1,80GHz * 8 <br/>Dimensione del file di segmento = 1024 MB <br/>Numero di righe = 1.000.000 <br/>Dim = 128</p>
</blockquote>
<table>
<thead>
<tr><th style="text-align:center">ID query Num</th><th style="text-align:center">v 1.0.0</th><th style="text-align:center">v1.1.0</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">10</td><td style="text-align:center">9 ms</td><td style="text-align:center">2 ms</td></tr>
<tr><td style="text-align:center">100</td><td style="text-align:center">149 ms</td><td style="text-align:center">19 ms</td></tr>
</tbody>
</table>
<p><br/></p>
<h3 id="Hnswlib-upgraded-to-v050" class="common-anchor-header">Hnswlib aggiornato alla v0.5.0</h3><p>Milvus adotta diverse librerie di indici ampiamente utilizzate, tra cui Faiss, NMSLIB, Hnswlib e Annoy, per semplificare il processo di scelta del tipo di indice giusto per un determinato scenario.</p>
<p>Hnswlib è stato aggiornato dalla v0.3.0 alla v0.5.0 in Milvus 1.1.0 a causa di un bug rilevato nella versione precedente. Inoltre, l'aggiornamento di Hnswlib migliora le prestazioni di <code translate="no">addPoint()</code> nella costruzione degli indici.</p>
<p>Uno sviluppatore di Zilliz ha creato una richiesta di pull (PR) per migliorare le prestazioni di Hnswlib durante la costruzione degli indici in Milvus. Si veda la <a href="https://github.com/nmslib/hnswlib/pull/298">PR #298</a> per i dettagli.</p>
<p>Il grafico seguente è un confronto delle prestazioni di <code translate="no">addPoint()</code> tra Hnswlib 0.5.0 e la PR proposta:</p>
<blockquote>
<p>CPU: CPU Intel® Core™ i7-8550U @ 1.80GHz * 8 <br/>Dataset: sift_1M (numero di righe = 1000000, dim = 128, spazio = L2)</p>
</blockquote>
<table>
<thead>
<tr><th style="text-align:center"></th><th style="text-align:center">0.5.0</th><th style="text-align:center">PR-298</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">M = 16, ef_construction = 100</td><td style="text-align:center">274406 ms</td><td style="text-align:center">265631 ms</td></tr>
<tr><td style="text-align:center">M = 16, ef_costruzione = 200</td><td style="text-align:center">522411 ms</td><td style="text-align:center">499639 ms</td></tr>
</tbody>
</table>
<p><br/></p>
<h3 id="Improved-IVF-index-training-performance" class="common-anchor-header">Migliori prestazioni di formazione dell'indice FIV</h3><p>La creazione di un indice comprende l'addestramento, l'inserimento e la scrittura dei dati su disco. Milvus 1.1.0 migliora la componente di addestramento della costruzione dell'indice. Il grafico seguente confronta le prestazioni di addestramento degli indici FIV tra Milvus 1.0 e Milvus 1.1.0:</p>
<blockquote>
<p>CPU: CPU Intel® Core™ i7-8550U @ 1.80GHz * 8 <br/>Dataset: sift_1m (row_count = 1000000, dim = 128, metric_type = L2)</p>
</blockquote>
<table>
<thead>
<tr><th style="text-align:center"></th><th style="text-align:center">v1.0.0 (ms)</th><th style="text-align:center">v1.1.0 (ms)</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">ivf_flat (nlist = 2048)</td><td style="text-align:center">90079</td><td style="text-align:center">81544</td></tr>
<tr><td style="text-align:center">ivf_pq (nlist = 2048, m=16)</td><td style="text-align:center">103535</td><td style="text-align:center">97115</td></tr>
<tr><td style="text-align:center">ivf_pq (nlist = 2048, m=32)</td><td style="text-align:center">108638</td><td style="text-align:center">104558</td></tr>
<tr><td style="text-align:center">ivf_flat (nlist = 4096)</td><td style="text-align:center">340643</td><td style="text-align:center">310685</td></tr>
<tr><td style="text-align:center">ivf_pq (nlist = 4096, m=16)</td><td style="text-align:center">351982</td><td style="text-align:center">323758</td></tr>
<tr><td style="text-align:center">ivf_pq (nlist = 4096, m=32)</td><td style="text-align:center">357359</td><td style="text-align:center">330887</td></tr>
</tbody>
</table>
<p><br/></p>
<h2 id="Bug-fixes" class="common-anchor-header">Correzioni di bug<button data-href="#Bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>Abbiamo anche risolto alcuni bug per rendere Milvus più stabile ed efficiente nella gestione di insiemi di dati vettoriali. Vedere <a href="https://milvus.io/docs/v1.1.0/release_notes.md#Fixed-issues">Problemi risolti</a> per maggiori dettagli.</p>
