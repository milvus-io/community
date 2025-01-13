---
id: 2021-12-31-get-started-with-milvus-cli.md
title: Iniziare con Milvus_CLI
author: Zhuanghong Chen and Zhen Chen
date: 2021-12-31T00:00:00.000Z
desc: >-
  Questo articolo introduce Milvus_CLI e aiuta a completare le operazioni più
  comuni.
cover: assets.zilliz.com/CLI_9a10de4fcc.png
tag: Engineering
recommend: true
canonicalUrl: 'https://zilliz.com/blog/get-started-with-milvus-cli'
---
<p>Nell'era dell'esplosione delle informazioni, produciamo continuamente voci, immagini, video e altri dati non strutturati. Come possiamo analizzare in modo efficiente questa enorme quantità di dati? L'avvento delle reti neurali consente di incorporare i dati non strutturati sotto forma di vettori e il database Milvus è un software di servizio dati di base che aiuta a completare l'archiviazione, la ricerca e l'analisi dei dati vettoriali.</p>
<p>Ma come si può utilizzare rapidamente il database vettoriale Milvus?</p>
<p>Alcuni utenti si sono lamentati del fatto che le API sono difficili da memorizzare e sperano che ci siano semplici linee di comando per utilizzare il database Milvus.</p>
<p>Siamo entusiasti di presentare Milvus_CLI, uno strumento a riga di comando dedicato al database vettoriale Milvus.</p>
<p>Milvus_CLI è una comoda CLI per il database Milvus, che supporta la connessione al database, l'importazione e l'esportazione dei dati e il calcolo dei vettori utilizzando comandi interattivi in shell. L'ultima versione di Milvus_CLI presenta le seguenti caratteristiche.</p>
<ul>
<li><p>Tutte le piattaforme supportate, tra cui Windows, Mac e Linux.</p></li>
<li><p>Supporto dell'installazione online e offline con pip</p></li>
<li><p>Portatile, può essere utilizzato ovunque</p></li>
<li><p>Basato sull'SDK Milvus per Python</p></li>
<li><p>Documentazione di aiuto inclusa</p></li>
<li><p>Supporto del completamento automatico</p></li>
</ul>
<h2 id="Installation" class="common-anchor-header">Installazione<button data-href="#Installation" class="anchor-icon" translate="no">
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
    </button></h2><p>È possibile installare Milvus_CLI sia online che offline.</p>
<h3 id="Install-MilvusCLI-online" class="common-anchor-header">Installare Milvus_CLI online</h3><p>Eseguire il seguente comando per installare Milvus_CLI online con pip. È richiesto Python 3.8 o successivo.</p>
<pre><code translate="no">pip install milvus-cli
<button class="copy-code-btn"></button></code></pre>
<h3 id="Install-MilvusCLI-offline" class="common-anchor-header">Installare Milvus_CLI offline</h3><p>Per installare Milvus_CLI offline, <a href="https://github.com/milvus-io/milvus_cli/releases">scaricare</a> prima l'ultimo tarball dalla pagina di rilascio.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_af0e832119.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>Dopo aver scaricato il tarball, eseguire il seguente comando per installare Milvus_CLI.</p>
<pre><code translate="no">pip install milvus_cli-&lt;version&gt;.tar.gz
<button class="copy-code-btn"></button></code></pre>
<p>Dopo aver installato Milvus_CLI, eseguire <code translate="no">milvus_cli</code>. Il prompt <code translate="no">milvus_cli &gt;</code> che appare indica che la linea di comando è pronta.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_b50f5d2a5a.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>Se si utilizza un Mac con il chip M1 o un PC senza ambiente Python, si può scegliere di utilizzare un'applicazione portatile. A tale scopo, <a href="https://github.com/milvus-io/milvus_cli/releases">scaricare</a> un file dalla pagina di rilascio corrispondente al proprio sistema operativo, eseguire <code translate="no">chmod +x</code> sul file per renderlo eseguibile ed eseguire <code translate="no">./</code> sul file per eseguirlo.</p>
<h4 id="Example" class="common-anchor-header"><strong>Esempio</strong></h4><p>L'esempio seguente rende eseguibile <code translate="no">milvus_cli-v0.1.8-fix2-macOS</code> e lo esegue.</p>
<pre><code translate="no"><span class="hljs-built_in">sudo</span> <span class="hljs-built_in">chmod</span> +x milvus_cli-v0.1.8-fix2-macOS
./milvus_cli-v0.1.8-fix2-macOS
<button class="copy-code-btn"></button></code></pre>
<h2 id="Usage" class="common-anchor-header">Utilizzo<button data-href="#Usage" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Connect-to-Milvus" class="common-anchor-header">Connettersi a Milvus</h3><p>Prima di connettersi a Milvus, assicurarsi che Milvus sia installato sul server. Per ulteriori informazioni, vedere <a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">Installazione di Milvus Standalone</a> o <a href="https://milvus.io/docs/v2.0.x/install_cluster-docker.md">Installazione di Milvus Cluster</a>.</p>
<p>Se Milvus è installato su localhost con la porta predefinita, eseguire <code translate="no">connect</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_f950d3739a.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p>Altrimenti, eseguire il seguente comando con l'indirizzo IP del server Milvus. L'esempio seguente utilizza <code translate="no">172.16.20.3</code> come indirizzo IP e <code translate="no">19530</code> come numero di porta.</p>
<pre><code translate="no">connect -h 172.16.20.3
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_9ff2db9855.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<h3 id="Create-a-collection" class="common-anchor-header">Creare una raccolta</h3><p>Questa sezione spiega come creare una collezione.</p>
<p>Una collezione è composta da entità ed è simile a una tabella in RDBMS. Per ulteriori informazioni, consultare il <a href="https://milvus.io/docs/v2.0.x/glossary.md">Glossario</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_95a88c1cbf.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<h4 id="Example" class="common-anchor-header">Esempio</h4><p>L'esempio seguente crea una collezione denominata <code translate="no">car</code>. L'insieme <code translate="no">car</code> ha quattro campi: <code translate="no">id</code>, <code translate="no">vector</code>, <code translate="no">color</code> e <code translate="no">brand</code>. Il campo chiave primario è <code translate="no">id</code>. Per ulteriori informazioni, vedere <a href="https://milvus.io/docs/v2.0.x/cli_commands.md#create-collection">Creare una raccolta</a>.</p>
<pre><code translate="no">create collection -c car -f <span class="hljs-built_in">id</span>:INT64:primary_field -f vector:FLOAT_VECTOR:<span class="hljs-number">128</span> -f color:INT64:color -f brand:INT64:brand -p <span class="hljs-built_in">id</span> -a -d <span class="hljs-string">&#x27;car_collection&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="List-collections" class="common-anchor-header">Elencare le raccolte</h3><p>Eseguire il seguente comando per elencare tutte le raccolte in questa istanza di Milvus.</p>
<pre><code translate="no">list collections
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_1331f4c8bc.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>Eseguire il seguente comando per controllare i dettagli della raccolta <code translate="no">car</code>.</p>
<pre><code translate="no">describe collection -c car 
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_1d70beee54.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<h3 id="Calculate-the-distance-between-two-vectors" class="common-anchor-header">Calcolare la distanza tra due vettori</h3><p>Eseguire il seguente comando per importare i dati nella raccolta <code translate="no">car</code>.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> -c car <span class="hljs-string">&#x27;https://raw.githubusercontent.com/zilliztech/milvus_cli/main/examples/import_csv/vectors.csv&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_7609a4359a.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>Eseguire <code translate="no">query</code> e inserire <code translate="no">car</code> come nome della raccolta e <code translate="no">id&gt;0</code> come espressione della query quando richiesto. Gli ID delle entità che soddisfano i criteri vengono restituiti come mostrato nella figura seguente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_f0755589f6.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>Eseguire <code translate="no">calc</code> e inserire i valori appropriati quando richiesto per calcolare le distanze tra le matrici di vettori.</p>
<h3 id="Delete-a-collection" class="common-anchor-header">Eliminazione di una collezione</h3><p>Eseguire il seguente comando per eliminare la collezione <code translate="no">car</code>.</p>
<pre><code translate="no"><span class="hljs-keyword">delete</span> collection -c car
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/10_16b2b01935.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<h2 id="More" class="common-anchor-header">Altro<button data-href="#More" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus_CLI non si limita alle funzioni precedenti. Eseguire <code translate="no">help</code> per visualizzare tutti i comandi che Milvus_CLI include e le rispettive descrizioni. Eseguire <code translate="no">&lt;command&gt; --help</code> per visualizzare i dettagli di un comando specifico.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/11_5f31ccb1e8.png" alt="11.png" class="doc-image" id="11.png" />
   </span> <span class="img-wrapper"> <span>11.png</span> </span></p>
<p><strong>Vedere anche:</strong></p>
<p><a href="https://milvus.io/docs/v2.0.x/cli_commands.md">Riferimento ai comandi di Milvus_CLI</a> in Milvus Docs</p>
<p>Ci auguriamo che Milvus_CLI possa aiutarvi a utilizzare facilmente il database dei vettori di Milvus. Continueremo a ottimizzare Milvus_CLI e i vostri contributi sono benvenuti.</p>
<p>Se avete domande, non esitate a <a href="https://github.com/zilliztech/milvus_cli/issues">segnalare un problema</a> su GitHub.</p>
