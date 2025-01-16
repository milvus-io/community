---
id: introducing-milvus-lite-lightweight-version-of-milvus.md
title: 'Presentazione di Milvus Lite: la versione leggera di Milvus'
author: Fendy Feng
date: 2023-05-23T00:00:00.000Z
desc: >-
  Provate la velocità e l'efficienza di Milvus Lite, la variante leggera del
  famoso database vettoriale Milvus per una ricerca di somiglianze rapidissima.
cover: assets.zilliz.com/introducing_Milvus_Lite_7c0d0a1174.jpeg
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/introducing-milvus-lite-lightweight-version-of-milvus.md
---
<p><strong><em>Nota importante</em></strong></p>
<p><em>Nel giugno 2024 abbiamo aggiornato Milvus Lite, consentendo agli sviluppatori di IA di creare applicazioni più velocemente e garantendo al contempo un'esperienza coerente tra le varie opzioni di distribuzione, tra cui Milvus su Kurbernetes, Docker e servizi cloud gestiti. Milvus Lite si integra anche con vari framework e tecnologie di IA, semplificando lo sviluppo di applicazioni di IA con capacità di ricerca vettoriale. Per ulteriori informazioni, consultare i seguenti riferimenti:</em></p>
<ul>
<li><p><em>Blog di lancio di Milvus Lite: h<a href="https://milvus.io/blog/introducing-milvus-lite.md">ttps://</a>milvus.io/blog/introducing-milvus-lite.md</em></p></li>
<li><p><em>Documentazione di Milvus Lite: <a href="https://milvus.io/docs/quickstart.md">https://milvus.io/docs/quickstart.md</a></em></p></li>
<li><p><em>Repository GitHub di Milvus Lite: <a href="https://github.com/milvus-io/milvus-lite">https://github.com/milvus-io/milvus-lite</a></em></p></li>
</ul>
<p><br></p>
<p><a href="https://github.com/milvus-io/milvus">Milvus</a> è un database vettoriale open-source costruito appositamente per indicizzare, memorizzare e interrogare i vettori embedding generati da reti neurali profonde e altri modelli di apprendimento automatico (ML) su miliardi di scale. È diventato una scelta popolare per molte aziende, ricercatori e sviluppatori che devono eseguire ricerche di similarità su insiemi di dati su larga scala.</p>
<p>Tuttavia, alcuni utenti potrebbero trovare la versione completa di Milvus troppo pesante o complessa. Per risolvere questo problema, <a href="https://github.com/matrixji">Bin Ji</a>, uno dei collaboratori più attivi della comunità di Milvus, ha creato <a href="https://github.com/milvus-io/milvus-lite">Milvus Lite</a>, una versione leggera di Milvus.</p>
<h2 id="What-is-Milvus-Lite" class="common-anchor-header">Che cos'è Milvus Lite?<button data-href="#What-is-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Come già accennato, <a href="https://github.com/milvus-io/milvus-lite">Milvus Lite</a> è un'alternativa semplificata a Milvus che offre molti vantaggi e benefici.</p>
<ul>
<li>È possibile integrarlo nella propria applicazione Python senza appesantirla.</li>
<li>È autonomo e non richiede altre dipendenze, grazie alla capacità di Milvus standalone di lavorare con Etcd incorporati e storage locale.</li>
<li>È possibile importarlo come libreria Python e utilizzarlo come server standalone basato su interfaccia a riga di comando (CLI).</li>
<li>Funziona senza problemi con Google Colab e Jupyter Notebook.</li>
<li>È possibile migrare in modo sicuro il proprio lavoro e scrivere codice su altre istanze Milvus (versioni standalone, cluster e completamente gestite) senza alcun rischio di perdita di dati.</li>
</ul>
<h2 id="When-should-you-use-Milvus-Lite" class="common-anchor-header">Quando si dovrebbe usare Milvus Lite?<button data-href="#When-should-you-use-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>In particolare, Milvus Lite è molto utile nelle seguenti situazioni:</p>
<ul>
<li>Quando si preferisce usare Milvus senza tecniche e strumenti di container come <a href="https://milvus.io/docs/install_standalone-operator.md">Milvus Operator</a>, <a href="https://milvus.io/docs/install_standalone-helm.md">Helm</a> o <a href="https://milvus.io/docs/install_standalone-docker.md">Docker Compose</a>.</li>
<li>Quando non sono necessarie macchine virtuali o container per utilizzare Milvus.</li>
<li>Quando si desidera incorporare le funzionalità di Milvus nelle proprie applicazioni Python.</li>
<li>Quando si vuole avviare un'istanza di Milvus in Colab o Notebook per un rapido esperimento.</li>
</ul>
<p><strong>Nota</strong>: si sconsiglia l'uso di Milvus Lite in un ambiente di produzione o se si richiedono prestazioni elevate, forte disponibilità o alta scalabilità. Per la produzione, invece, si consiglia di utilizzare i <a href="https://github.com/milvus-io/milvus">cluster Milvus</a> o <a href="https://zilliz.com/cloud">Milvus completamente gestito su Zilliz Cloud</a>.</p>
<h2 id="How-to-get-started-with-Milvus-Lite" class="common-anchor-header">Come iniziare con Milvus Lite?<button data-href="#How-to-get-started-with-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Vediamo ora come installare, configurare e utilizzare Milvus Lite.</p>
<h3 id="Prerequisites" class="common-anchor-header">Prerequisiti</h3><p>Per utilizzare Milvus Lite, assicuratevi di aver soddisfatto i seguenti requisiti:</p>
<ul>
<li>Installare Python 3.7 o una versione successiva.</li>
<li>Utilizzo di uno dei sistemi operativi verificati elencati di seguito:<ul>
<li>Ubuntu &gt;= 18.04 (x86_64)</li>
<li>CentOS &gt;= 7.0 (x86_64)</li>
<li>MacOS &gt;= 11.0 (Apple Silicon)</li>
</ul></li>
</ul>
<p><strong>Note</strong>:</p>
<ol>
<li>Milvus Lite utilizza <code translate="no">manylinux2014</code> come immagine di base, rendendola compatibile con la maggior parte delle distribuzioni Linux per gli utenti Linux.</li>
<li>È possibile eseguire Milvus Lite anche su Windows, anche se questo non è ancora stato completamente verificato.</li>
</ol>
<h3 id="Install-Milvus-Lite" class="common-anchor-header">Installare Milvus Lite</h3><p>Milvus Lite è disponibile su PyPI, quindi è possibile installarlo tramite <code translate="no">pip</code>.</p>
<pre><code translate="no">$ python3 -m pip install milvus
<button class="copy-code-btn"></button></code></pre>
<p>È anche possibile installarlo con PyMilvus come segue:</p>
<pre><code translate="no">$ python3 -m pip install milvus[client]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Use-and-start-Milvus-Lite" class="common-anchor-header">Utilizzare e avviare Milvus Lite</h3><p>Scaricate il <a href="https://github.com/milvus-io/milvus-lite/tree/main/examples">notebook di esempio</a> dalla cartella example del nostro repository di progetto. Avete due opzioni per usare Milvus Lite: importarlo come libreria Python o eseguirlo come server autonomo sulla vostra macchina usando la CLI.</p>
<ul>
<li>Per avviare Milvus Lite come modulo Python, eseguire i seguenti comandi:</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, utility

<span class="hljs-comment"># Start your milvus server</span>
default_server.start()

<span class="hljs-comment"># Now you can connect with localhost and the given port</span>
<span class="hljs-comment"># Port is defined by default_server.listen_port</span>
connections.connect(host=<span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=default_server.listen_port)

<span class="hljs-comment"># Check if the server is ready.</span>
<span class="hljs-built_in">print</span>(utility.get_server_version())

<span class="hljs-comment"># Stop your milvus server</span>
default_server.stop()
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Per sospendere o arrestare Milvus Lite, utilizzare l'istruzione <code translate="no">with</code>.</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> default_server:
  <span class="hljs-comment"># Milvus Lite has already started, use default_server here.</span>
  connections.connect(host=<span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=default_server.listen_port)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Per avviare Milvus Lite come server standalone basato su CLI, eseguire il seguente comando:</li>
</ul>
<pre><code translate="no">milvus-server
<button class="copy-code-btn"></button></code></pre>
<p>Dopo aver avviato Milvus Lite, è possibile utilizzare PyMilvus o altri strumenti di connessione al server standalone.</p>
<h3 id="Start-Milvus-Lite-in-a-debug-mode" class="common-anchor-header">Avviare Milvus Lite in modalità debug</h3><ul>
<li>Per eseguire Milvus Lite in modalità debug come modulo Python, eseguite i seguenti comandi:</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> debug_server, MilvusServer

debug_server.run()

<span class="hljs-comment"># Or you can create a MilvusServer by yourself</span>
<span class="hljs-comment"># server = MilvusServer(debug=True)</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Per eseguire il server standalone in modalità debug, eseguire il seguente comando:</li>
</ul>
<pre><code translate="no">milvus-server --debug
<button class="copy-code-btn"></button></code></pre>
<h3 id="Persist-data-and-logs" class="common-anchor-header">Persistere i dati e i log</h3><ul>
<li>Per creare una directory locale per Milvus Lite che conterrà tutti i dati e i log pertinenti, eseguire i seguenti comandi:</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> <span class="hljs-attr">default_server</span>:
  default_server.<span class="hljs-title function_">set_base_dir</span>(<span class="hljs-string">&#x27;milvus_data&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Per conservare tutti i dati e i log generati dal server standalone sul disco locale, eseguire il seguente comando:</li>
</ul>
<pre><code translate="no">$ milvus-server --data milvus_data
<button class="copy-code-btn"></button></code></pre>
<h3 id="Configure-Milvus-Lite" class="common-anchor-header">Configurare Milvus Lite</h3><p>La configurazione di Milvus Lite è simile alla configurazione delle istanze Milvus tramite le API Python o la CLI.</p>
<ul>
<li>Per configurare Milvus Lite usando le API Python, usare l'API <code translate="no">config.set</code> di un'istanza <code translate="no">MilvusServer</code> per le impostazioni di base ed extra:</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> default_server:
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;system_Log_level&#x27;</span>, <span class="hljs-string">&#x27;info&#x27;</span>)
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;proxy_port&#x27;</span>, <span class="hljs-number">19531</span>)
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;dataCoord.segment.maxSize&#x27;</span>, <span class="hljs-number">1024</span>)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Per configurare Milvus Lite tramite CLI, eseguire il seguente comando per le impostazioni di base:</li>
</ul>
<pre><code translate="no">$ milvus-server --system-log-level info
$ milvus-server --proxy-port 19531
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Oppure, eseguire il seguente comando per le configurazioni extra.</li>
</ul>
<pre><code translate="no">$ milvus-server --extra-config dataCoord.segment.maxSize=1024
<button class="copy-code-btn"></button></code></pre>
<p>Tutti gli elementi configurabili sono contenuti nel modello <code translate="no">config.yaml</code> fornito con il pacchetto Milvus.</p>
<p>Per maggiori dettagli tecnici su come installare e configurare Milvus Lite, consultare la nostra <a href="https://milvus.io/docs/milvus_lite.md#Prerequisites">documentazione</a>.</p>
<h2 id="Summary" class="common-anchor-header">Sintesi<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Lite è una scelta eccellente per chi cerca le funzionalità di Milvus in un formato compatto. Se siete ricercatori, sviluppatori o data scientist, vale la pena di esplorare questa opzione.</p>
<p>Milvus Lite è anche una bella aggiunta alla comunità open-source, che mette in mostra lo straordinario lavoro dei suoi collaboratori. Grazie agli sforzi di Bin Ji, Milvus è ora disponibile per un maggior numero di utenti. Non vediamo l'ora di vedere le idee innovative che Bin Ji e altri membri della comunità Milvus porteranno avanti in futuro.</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">Teniamoci in contatto!<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Se riscontrate problemi nell'installazione o nell'utilizzo di Milvus Lite, potete <a href="https://github.com/milvus-io/milvus-lite/issues/new">segnalare un problema qui</a> o contattarci tramite <a href="https://twitter.com/milvusio">Twitter</a> o <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. Siete anche invitati a unirvi al nostro <a href="https://milvus.io/slack/">canale Slack</a> per chiacchierare con i nostri ingegneri e con l'intera comunità, o a visitare il <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">nostro orario d'ufficio del martedì</a>!</p>
