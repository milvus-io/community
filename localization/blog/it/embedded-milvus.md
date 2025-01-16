---
id: embedded-milvus.md
title: >-
  Utilizzo di Milvus incorporato per installare ed eseguire immediatamente
  Milvus con Python
author: Alex Gao
date: 2022-08-15T00:00:00.000Z
desc: >-
  Una versione di Milvus facile da usare per Python che rende l'installazione
  più flessibile.
cover: assets.zilliz.com/embeddded_milvus_1_8132468cac.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/embedded-milvus.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/embeddded_milvus_1_8132468cac.png" alt="Cover" class="doc-image" id="cover" />
   </span> <span class="img-wrapper"> <span>Copertina</span> </span></p>
<blockquote>
<p>Questo articolo è stato scritto da <a href="https://github.com/soothing-rain/">Alex Gao</a> e <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Milvus è un database vettoriale open-source per applicazioni di intelligenza artificiale. Offre diversi metodi di installazione, tra cui la creazione dal codice sorgente e l'installazione di Milvus con Docker Compose/Helm/APT/YUM/Ansible. Gli utenti possono scegliere uno dei metodi di installazione a seconda del proprio sistema operativo e delle proprie preferenze. Tuttavia, nella comunità di Milvus ci sono molti scienziati dei dati e ingegneri dell'intelligenza artificiale che lavorano con Python e desiderano un metodo di installazione molto più semplice di quelli attualmente disponibili.</p>
<p>Per questo motivo, insieme a Milvus 2.1, abbiamo rilasciato Milvus embedded, una versione facile da usare per Python, per potenziare gli sviluppatori Python della nostra comunità. Questo articolo presenta cos'è Milvus incorporato e fornisce istruzioni su come installarlo e usarlo.</p>
<p><strong>Vai a:</strong></p>
<ul>
<li><a href="#An-overview-of-embedded-Milvus">Panoramica di Milvus integrato</a><ul>
<li><a href="#When-to-use-embedded-Milvus">Quando usare Milvus integrato?</a></li>
<li><a href="#A-comparison-of-different-modes-of-Milvus">Un confronto tra le diverse modalità di Milvus</a></li>
</ul></li>
<li><a href="#How-to-install-embedded-Milvus">Come installare Milvus incorporato</a></li>
<li><a href="#Start-and-stop-embedded-Milvus">Avviare e arrestare Milvus incorporato</a></li>
</ul>
<h2 id="An-overview-of-embedded-Milvus" class="common-anchor-header">Panoramica di Milvus integrato<button data-href="#An-overview-of-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/milvus-io/embd-milvus">Milvus incorporato</a> consente di installare e utilizzare rapidamente Milvus con Python. Può creare rapidamente un'istanza di Milvus e consente di avviare e arrestare il servizio Milvus ogni volta che lo si desidera. Tutti i dati e i registri vengono conservati anche se si interrompe Milvus incorporato.</p>
<p>Milvus incorporato non ha dipendenze interne e non richiede la preinstallazione e l'esecuzione di dipendenze di terze parti come etcd, MinIO, Pulsar, ecc.</p>
<p>Tutto ciò che si fa con Milvus incorporato e ogni pezzo di codice scritto per esso può essere migrato in modo sicuro ad altre modalità di Milvus: standalone, cluster, versione cloud, ecc. Questo riflette una delle caratteristiche più distintive di Milvus embedded: <strong>"Scrivi una volta, esegui ovunque".</strong></p>
<h3 id="When-to-use-embedded-Milvus" class="common-anchor-header">Quando usare Milvus integrato?</h3><p>Milvus incorporato e <a href="https://milvus.io/docs/v2.1.x/install-pymilvus.md">PyMilvus</a> sono costruiti per scopi diversi. Si può scegliere Milvus integrato nei seguenti scenari:</p>
<ul>
<li><p>Si desidera utilizzare Milvus senza installare Milvus in uno dei modi previsti <a href="https://milvus.io/docs/v2.1.x/install_standalone-docker.md">qui</a>.</p></li>
<li><p>Si desidera utilizzare Milvus senza mantenere un processo Milvus a lungo in esecuzione nel computer.</p></li>
<li><p>Si desidera utilizzare Milvus rapidamente senza avviare un processo Milvus separato e altri componenti necessari come etcd, MinIO, Pulsar, ecc.</p></li>
</ul>
<p>Si consiglia di <strong>NON</strong> usare Milvus incorporato:</p>
<ul>
<li><p>In un ambiente di produzione.<em>(Per utilizzare Milvus per la produzione, considerare il cluster Milvus o il <a href="https://zilliz.com/cloud">cloud Zilliz</a>, un servizio Milvus completamente gestito</em>).</p></li>
<li><p>Se la richiesta di prestazioni è elevata.<em>(In termini comparativi, Milvus incorporato potrebbe non fornire le migliori prestazioni</em>).</p></li>
</ul>
<h3 id="A-comparison-of-different-modes-of-Milvus" class="common-anchor-header">Un confronto tra le diverse modalità di Milvus</h3><p>La tabella seguente mette a confronto diverse modalità di Milvus: standalone, cluster, Milvus integrato e Zilliz Cloud, un servizio Milvus completamente gestito.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/comparison_ebcd7c5b07.jpeg" alt="comparison" class="doc-image" id="comparison" />
   </span> <span class="img-wrapper"> <span>confronto</span> </span></p>
<h2 id="How-to-install-embedded-Milvus" class="common-anchor-header">Come installare Milvus integrato?<button data-href="#How-to-install-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Prima di installare Milvus incorporato, è necessario assicurarsi di aver installato Python 3.6 o versione successiva. Milvus integrato supporta i seguenti sistemi operativi:</p>
<ul>
<li><p>Ubuntu 18.04</p></li>
<li><p>Mac x86_64 &gt;= 10.4</p></li>
<li><p>Mac M1 &gt;= 11.0</p></li>
</ul>
<p>Se i requisiti sono soddisfatti, è possibile eseguire <code translate="no">$ python3 -m pip install milvus</code> per installare Milvus incorporato. È anche possibile aggiungere la versione nel comando per installare una versione specifica di Milvus incorporato. Ad esempio, se si vuole installare la versione 2.1.0, eseguire <code translate="no">$ python3 -m pip install milvus==2.1.0</code>. In seguito, quando verrà rilasciata una nuova versione di Milvus incorporato, si potrà anche eseguire <code translate="no">$ python3 -m pip install --upgrade milvus</code> per aggiornare Milvus incorporato alla versione più recente.</p>
<p>Se siete un vecchio utente di Milvus che ha già installato PyMilvus e volete installare Milvus integrato, potete eseguire <code translate="no">$ python3 -m pip install --no-deps milvus</code>.</p>
<p>Dopo aver eseguito il comando di installazione, è necessario creare una cartella dati per Milvus incorporato in <code translate="no">/var/bin/e-milvus</code> eseguendo il seguente comando:</p>
<pre><code translate="no"><span class="hljs-built_in">sudo</span> <span class="hljs-built_in">mkdir</span> -p /var/bin/e-milvus
<span class="hljs-built_in">sudo</span> <span class="hljs-built_in">chmod</span> -R 777 /var/bin/e-milvus
<button class="copy-code-btn"></button></code></pre>
<h2 id="Start-and-stop-embedded-Milvus" class="common-anchor-header">Avvia e arresta Milvus incorporato<button data-href="#Start-and-stop-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando l'installazione è riuscita, è possibile avviare il servizio.</p>
<p>Se si avvia Milvus incorporato per la prima volta, è necessario importare Milvus e configurare Milvus incorporato.</p>
<pre><code translate="no">$ python3
Python 3.9.10 (main, Jan 15 2022, 11:40:53)
[Clang 13.0.0 (clang-1300.0.29.3)] on darwin
Type <span class="hljs-string">&quot;help&quot;</span>, <span class="hljs-string">&quot;copyright&quot;</span>, <span class="hljs-string">&quot;credits&quot;</span> or <span class="hljs-string">&quot;license&quot;</span> <span class="hljs-keyword">for</span> more information.
&gt;&gt;&gt; import milvus
&gt;&gt;&gt; milvus.before()
please <span class="hljs-keyword">do</span> the following <span class="hljs-keyword">if</span> you have not already <span class="hljs-keyword">done</span> so:
1. install required dependencies: bash /var/bin/e-milvus/lib/install_deps.sh
2. <span class="hljs-built_in">export</span> LD_PRELOAD=/SOME_PATH/embd-milvus.so
3. <span class="hljs-built_in">export</span> LD_LIBRARY_PATH=<span class="hljs-variable">$LD_LIBRARY_PATH</span>:/usr/lib:/usr/local/lib:/var/bin/e-milvus/lib/
&gt;&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Se si è già avviato con successo Milvus incorporato e si torna a riavviarlo, si può eseguire direttamente <code translate="no">milvus.start()</code> dopo aver importato Milvus.</p>
<pre><code translate="no">$ python3
Python <span class="hljs-number">3.9</span><span class="hljs-number">.10</span> (main, Jan <span class="hljs-number">15</span> <span class="hljs-number">2022</span>, <span class="hljs-number">11</span>:<span class="hljs-number">40</span>:<span class="hljs-number">53</span>)
[Clang <span class="hljs-number">13.0</span><span class="hljs-number">.0</span> (clang-<span class="hljs-number">1300.0</span><span class="hljs-number">.29</span><span class="hljs-number">.3</span>)] on darwinType <span class="hljs-string">&quot;help&quot;</span>, <span class="hljs-string">&quot;copyright&quot;</span>, <span class="hljs-string">&quot;credits&quot;</span> <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;license&quot;</span> <span class="hljs-keyword">for</span> more information.
<span class="hljs-meta">&gt;&gt;&gt; </span><span class="hljs-keyword">import</span> milvus
<span class="hljs-meta">&gt;&gt;&gt; </span>milvus.start()
&gt;&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Se il servizio Milvus incorporato è stato avviato con successo, si vedrà il seguente risultato.</p>
<pre><code translate="no">---<span class="hljs-title class_">Milvus</span> <span class="hljs-title class_">Proxy</span> successfully initialized and ready to serve!---
<button class="copy-code-btn"></button></code></pre>
<p>Dopo l'avvio del servizio, è possibile avviare un'altra finestra di terminale ed eseguire il codice di esempio di &quot;<a href="https://github.com/milvus-io/embd-milvus/blob/main/milvus/examples/hello_milvus.py">Hello Milvus</a>&quot; per giocare con Milvus incorporato!</p>
<pre><code translate="no"><span class="hljs-comment"># Download hello_milvus script</span>
$ wget https://raw.githubusercontent.com/milvus-io/pymilvus/v2.1.0/examples/hello_milvus.py
<span class="hljs-comment"># Run Hello Milvus </span>
$ python3 hello_milvus.py
<button class="copy-code-btn"></button></code></pre>
<p>Una volta terminato l'utilizzo di Milvus incorporato, si consiglia di interromperlo con garbo e di ripulire le variabili d'ambiente eseguendo il seguente comando o premendo Ctrl-D.</p>
<pre><code translate="no">&gt;&gt;&gt; milvus.stop()
<span class="hljs-keyword">if</span> you need to clean up the environment variables, run:
<span class="hljs-built_in">export</span> LD_PRELOAD=
<span class="hljs-built_in">export</span> LD_LIBRARY_PATH=
&gt;&gt;&gt;
&gt;&gt;&gt; <span class="hljs-built_in">exit</span>()
<button class="copy-code-btn"></button></code></pre>
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
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Capire il livello di consistenza del database vettoriale Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Capire il livello di consistenza del database vettoriale Milvus (parte II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">In che modo il database vettoriale Milvus garantisce la sicurezza dei dati?</a></li>
</ul>
