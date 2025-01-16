---
id: how-to-contribute-to-milvus-a-quick-start-for-developers.md
title: 'Come contribuire a Milvus: una guida rapida per gli sviluppatori'
author: Shaoting Huang
date: 2024-12-01T00:00:00.000Z
cover: assets.zilliz.com/How_to_Contribute_to_Milvus_91e1432163.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/how-to-contribute-to-milvus-a-quick-start-for-developers.md
---
<p><a href="https://github.com/milvus-io/milvus"><strong>Milvus</strong></a> è un <a href="https://zilliz.com/learn/what-is-vector-database">database vettoriale</a> open-source progettato per gestire dati vettoriali ad alta dimensionalità. Se state costruendo motori di ricerca intelligenti, sistemi di raccomandazione o soluzioni AI di nuova generazione come la retrieval augmented generation<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>), Milvus è uno strumento potente a portata di mano.</p>
<p>Ma ciò che fa progredire Milvus non è solo la sua tecnologia avanzata: è la vivace e appassionata <a href="https://zilliz.com/community">comunità di sviluppatori</a> che lo sostiene. Come progetto open-source, Milvus prospera e si evolve grazie ai contributi di sviluppatori come voi. Ogni correzione di bug, aggiunta di funzionalità e miglioramento delle prestazioni da parte della comunità rende Milvus più veloce, più scalabile e più affidabile.</p>
<p>Se siete appassionati di open-source, desiderosi di imparare o di avere un impatto duraturo sull'IA, Milvus è il luogo ideale per contribuire. Questa guida vi guiderà attraverso il processo, dalla configurazione dell'ambiente di sviluppo all'invio della vostra prima richiesta di pull. Evidenzieremo anche le sfide più comuni che potreste incontrare e forniremo le soluzioni per superarle.</p>
<p>Pronti a tuffarvi? Rendiamo Milvus ancora migliore insieme!</p>
<h2 id="Setting-Up-Your-Milvus-Development-Environment" class="common-anchor-header">Impostazione dell'ambiente di sviluppo Milvus<button data-href="#Setting-Up-Your-Milvus-Development-Environment" class="anchor-icon" translate="no">
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
    </button></h2><p>Prima di tutto, la configurazione dell'ambiente di sviluppo. Potete installare Milvus sul vostro computer locale o usare Docker: entrambi i metodi sono semplici, ma dovrete anche installare alcune dipendenze di terze parti per far funzionare tutto.</p>
<h3 id="Building-Milvus-Locally" class="common-anchor-header">Costruire Milvus in locale</h3><p>Se vi piace costruire le cose da zero, costruire Milvus sul vostro computer locale è un gioco da ragazzi. Milvus semplifica le cose raggruppando tutte le dipendenze nello script <code translate="no">install_deps.sh</code>. Ecco la configurazione rapida:</p>
<pre><code translate="no"><span class="hljs-comment"># Install third-party dependencies.</span>
$ <span class="hljs-built_in">cd</span> milvus/
$ ./scripts/install_deps.sh

<span class="hljs-comment"># Compile Milvus.</span>
$ make
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-Milvus-with-Docker" class="common-anchor-header">Costruire Milvus con Docker</h3><p>Se si preferisce Docker, ci sono due modi per farlo: si possono eseguire i comandi in un container precostituito o creare un container dev per un approccio più pratico.</p>
<pre><code translate="no"><span class="hljs-comment"># Option 1: Run commands in a pre-built Docker container  </span>
build/builder.sh make  

<span class="hljs-comment"># Option 2: Spin up a dev container  </span>
./scripts/devcontainer.sh up  
docker-compose -f docker-compose-devcontainer.yml ps  
docker <span class="hljs-built_in">exec</span> -ti milvus-builder-<span class="hljs-number">1</span> bash  
make milvus  
<button class="copy-code-btn"></button></code></pre>
<p><strong>Note sulla piattaforma:</strong> Se si utilizza Linux, i problemi di compilazione sono piuttosto rari. Tuttavia, gli utenti Mac, specialmente con i chip M1, potrebbero incontrare qualche problema lungo il percorso. Non preoccupatevi, però: abbiamo una guida che vi aiuterà a risolvere i problemi più comuni.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_OS_configuration_52092fb1b7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: Configurazione del sistema operativo</em></p>
<p>Per la guida completa alla configurazione, consultate la <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md">Guida</a> ufficiale <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md">allo sviluppo di Milvus</a>.</p>
<h3 id="Common-Issues-and-How-to-Fix-Them" class="common-anchor-header">Problemi comuni e come risolverli</h3><p>A volte la configurazione dell'ambiente di sviluppo Milvus non va come previsto. Non preoccupatevi: ecco una rapida carrellata di problemi comuni che potreste incontrare e come risolverli rapidamente.</p>
<h4 id="Homebrew-Unexpected-Disconnect-While-Reading-Sideband-Packet" class="common-anchor-header">Homebrew: Disconnessione inattesa durante la lettura del pacchetto Sideband</h4><p>Se state usando Homebrew e vedete un errore come questo:</p>
<pre><code translate="no">==&gt; Tapping homebrew/core
remote: Enumerating objects: 1107077, <span class="hljs-keyword">done</span>.
remote: Counting objects: 100% (228/228), <span class="hljs-keyword">done</span>.
remote: Compressing objects: 100% (157/157), <span class="hljs-keyword">done</span>.
error: 545 bytes of body are still expected.44 MiB | 341.00 KiB/s
fetch-pack: unexpected disconnect <span class="hljs-keyword">while</span> reading sideband packet
fatal: early EOF
fatal: index-pack failed
Failed during: git fetch --force origin refs/heads/master:refs/remotes/origin/master
myuser~ %
<button class="copy-code-btn"></button></code></pre>
<p><strong>Correggere:</strong> aumentare la dimensione di <code translate="no">http.postBuffer</code>:</p>
<pre><code translate="no">git config --<span class="hljs-variable language_">global</span> http.<span class="hljs-property">postBuffer</span> 1M
<button class="copy-code-btn"></button></code></pre>
<p>Se anche voi vi imbattete in <code translate="no">Brew: command not found</code> dopo aver installato Homebrew, potrebbe essere necessario impostare la configurazione dell'utente Git:</p>
<pre><code translate="no">git config --<span class="hljs-variable language_">global</span> user.<span class="hljs-property">email</span> xxxgit config --<span class="hljs-variable language_">global</span> user.<span class="hljs-property">name</span> xxx
<button class="copy-code-btn"></button></code></pre>
<h4 id="Docker-Error-Getting-Credentials" class="common-anchor-header">Docker: errore nell'ottenere le credenziali</h4><p>Quando si lavora con Docker, si può vedere questo errore:</p>
<pre><code translate="no"><span class="hljs-type">error</span> getting credentials - err: exit status <span class="hljs-number">1</span>, out: <span class="hljs-string">``</span>  
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Docker_Error_Getting_Credentials_797f3043fb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Correzione:</strong> Aprire<code translate="no">~/.docker/config.json</code> e rimuovere il campo <code translate="no">credsStore</code>.</p>
<h4 id="Python-No-Module-Named-imp" class="common-anchor-header">Python: Nessun modulo chiamato 'imp'</h4><p>Se Python lancia questo errore, è perché Python 3.12 ha rimosso il modulo <code translate="no">imp</code>, che alcune vecchie dipendenze utilizzano ancora.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Python_No_Module_Named_imp_65eb2c5c66.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Correggere:</strong> Passare a Python 3.11:</p>
<pre><code translate="no">brew install python@3.11  
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conan-Unrecognized-Arguments-or-Command-Not-Found" class="common-anchor-header">Conan: Argomenti non riconosciuti o Comando non trovato</h4><p><strong>Problema:</strong> Se viene visualizzato <code translate="no">Unrecognized arguments: --install-folder conan</code>, è probabile che si stia utilizzando una versione di Conan non compatibile.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conan_Unrecognized_Arguments_or_Command_Not_Found_8f2029db72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Correggere:</strong> Aggiornare a Conan 1.61:</p>
<pre><code translate="no">pip install conan==1.61  
<button class="copy-code-btn"></button></code></pre>
<p><strong>Problema:</strong> Se si vede <code translate="no">Conan command not found</code>, significa che l'ambiente Python non è configurato correttamente.</p>
<p><strong>Correggere:</strong> Aggiungere la directory bin di Python a <code translate="no">PATH</code>:</p>
<pre><code translate="no"><span class="hljs-built_in">export</span> PATH=<span class="hljs-string">&quot;/path/to/python/bin:<span class="hljs-variable">$PATH</span>&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="LLVM-Use-of-Undeclared-Identifier-kSecFormatOpenSSL" class="common-anchor-header">LLVM: Use of Undeclared Identifier 'kSecFormatOpenSSL' (Uso di un identificatore non dichiarato)</h4><p>Questo errore di solito indica che le dipendenze di LLVM sono obsolete.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/LLVM_Use_of_Undeclared_Identifier_k_Sec_Format_Open_SSL_f0ca6f0166.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Correggere:</strong> Reinstallare LLVM 15 e aggiornare le variabili d'ambiente:</p>
<pre><code translate="no">brew reinstall llvm@<span class="hljs-number">15</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">LDFLAGS</span>=<span class="hljs-string">&quot;-L/opt/homebrew/opt/llvm@15/lib&quot;</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">CPPFLAGS</span>=<span class="hljs-string">&quot;-I/opt/homebrew/opt/llvm@15/include&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Suggerimenti utili</strong></p>
<ul>
<li><p>Controllate sempre due volte le versioni degli strumenti e le dipendenze.</p></li>
<li><p>Se qualcosa ancora non funziona, la<a href="https://github.com/milvus-io/milvus/issues"> pagina Milvus GitHub Issues</a> è un ottimo posto per trovare risposte o chiedere aiuto.</p></li>
</ul>
<h3 id="Configuring-VS-Code-for-C++-and-Go-Integration" class="common-anchor-header">Configurazione di VS Code per l'integrazione di C++ e Go</h3><p>Far lavorare insieme C++ e Go in VS Code è più facile di quanto sembri. Con la giusta configurazione, è possibile semplificare il processo di sviluppo per Milvus. Basta modificare il file <code translate="no">user.settings</code> con la configurazione qui sotto:</p>
<pre><code translate="no">{
   <span class="hljs-string">&quot;go.toolsEnvVars&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.testEnvVars&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.buildFlags&quot;</span>: [
       <span class="hljs-string">&quot;-ldflags=-r /Users/zilliz/workspace/milvus/internal/core/output/lib&quot;</span>
   ],
   <span class="hljs-string">&quot;terminal.integrated.env.linux&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.useLanguageServer&quot;</span>: <span class="hljs-literal">true</span>,
   <span class="hljs-string">&quot;gopls&quot;</span>: {
       <span class="hljs-string">&quot;formatting.gofumpt&quot;</span>: <span class="hljs-literal">true</span>
   },
   <span class="hljs-string">&quot;go.formatTool&quot;</span>: <span class="hljs-string">&quot;gofumpt&quot;</span>,
   <span class="hljs-string">&quot;go.lintTool&quot;</span>: <span class="hljs-string">&quot;golangci-lint&quot;</span>,
   <span class="hljs-string">&quot;go.testTags&quot;</span>: <span class="hljs-string">&quot;dynamic&quot;</span>,
   <span class="hljs-string">&quot;go.testTimeout&quot;</span>: <span class="hljs-string">&quot;10m&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>Ecco cosa fa questa configurazione:</p>
<ul>
<li><p><strong>Variabili d'ambiente:</strong> Imposta i percorsi per <code translate="no">PKG_CONFIG_PATH</code>, <code translate="no">LD_LIBRARY_PATH</code> e <code translate="no">RPATH</code>, che sono fondamentali per individuare le librerie durante la compilazione e i test.</p></li>
<li><p><strong>Integrazione degli strumenti di Go:</strong> Abilita il server linguistico di Go (<code translate="no">gopls</code>) e configura strumenti come <code translate="no">gofumpt</code> per la formattazione e <code translate="no">golangci-lint</code> per il linting.</p></li>
<li><p><strong>Configurazione dei test:</strong> Aggiunge <code translate="no">testTags</code> e aumenta il timeout per l'esecuzione dei test a 10 minuti.</p></li>
</ul>
<p>Una volta aggiunto, questo setup assicura una perfetta integrazione tra i flussi di lavoro di C++ e Go. È perfetto per costruire e testare Milvus senza dover modificare continuamente l'ambiente.</p>
<p><strong>Suggerimento</strong></p>
<p>Dopo averla impostata, eseguire una rapida compilazione di prova per verificare che tutto funzioni. Se qualcosa non funziona, ricontrollate i percorsi e la versione dell'estensione Go di VS Code.</p>
<h2 id="Deploying-Milvus" class="common-anchor-header">Distribuzione di Milvus<button data-href="#Deploying-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus supporta <a href="https://milvus.io/docs/install-overview.md">tre modalità di distribuzione: Lite</a><strong>, Standalone</strong> e <strong>Distributed.</strong></p>
<ul>
<li><p><a href="https://milvus.io/blog/introducing-milvus-lite.md"><strong>Milvus Lite</strong></a> è una libreria Python e una versione ultra-leggera di Milvus. È perfetta per la prototipazione rapida in ambienti Python o notebook e per esperimenti locali su piccola scala.</p></li>
<li><p><strong>Milvus Standalone</strong> è l'opzione di distribuzione a singolo nodo di Milvus, che utilizza un modello client-server. È l'equivalente Milvus di MySQL, mentre Milvus Lite è come SQLite.</p></li>
<li><p><strong>Milvus Distributed</strong> è la modalità distribuita di Milvus, ideale per gli utenti aziendali che costruiscono sistemi di database vettoriali su larga scala o piattaforme di dati vettoriali.</p></li>
</ul>
<p>Tutte queste implementazioni si basano su tre componenti fondamentali:</p>
<ul>
<li><p><strong>Milvus:</strong> il motore del database vettoriale che gestisce tutte le operazioni.</p></li>
<li><p><strong>Etcd:</strong> Il motore di metadati che gestisce i metadati interni di Milvus.</p></li>
<li><p><strong>MinIO:</strong> il motore di archiviazione che garantisce la persistenza dei dati.</p></li>
</ul>
<p>Quando viene eseguito in modalità <strong>distribuita</strong>, Milvus incorpora anche <strong>Pulsar</strong> per l'elaborazione distribuita dei messaggi utilizzando un meccanismo Pub/Sub, che lo rende scalabile per ambienti ad alta produttività.</p>
<h3 id="Milvus-Standalone" class="common-anchor-header">Milvus Standalone</h3><p>La modalità Standalone è adatta a configurazioni a singola istanza, ed è quindi perfetta per i test e le applicazioni su piccola scala. Ecco come iniziare:</p>
<pre><code translate="no"><span class="hljs-comment"># Deploy Milvus Standalone  </span>
<span class="hljs-built_in">sudo</span> docker-compose -f deployments/docker/dev/docker-compose.yml up -d
<span class="hljs-comment"># Start the standalone service  </span>
bash ./scripts/start_standalone.sh
<button class="copy-code-btn"></button></code></pre>
<h3 id="Milvus-Distributed-previously-known-as-Milvus-Cluster" class="common-anchor-header">Milvus Distributed (precedentemente noto come Milvus Cluster)</h3><p>Per i set di dati più grandi e il traffico più elevato, la modalità distribuita offre una scalabilità orizzontale. Combina più istanze Milvus in un unico sistema coeso. L'implementazione è facilitata da <strong>Milvus Operator</strong>, che gira su Kubernetes e gestisce l'intero stack Milvus per voi.</p>
<p>Volete una guida passo passo? Consultate la <a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Guida all'installazione di Milvus</a>.</p>
<h2 id="Running-End-to-End-E2E-Tests" class="common-anchor-header">Esecuzione dei test end-to-end (E2E)<button data-href="#Running-End-to-End-E2E-Tests" class="anchor-icon" translate="no">
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
    </button></h2><p>Una volta che la distribuzione di Milvus è attiva e funzionante, la verifica della sua funzionalità è un gioco da ragazzi con i test E2E. Questi test coprono ogni parte della configurazione per garantire che tutto funzioni come previsto. Ecco come eseguirli:</p>
<pre><code translate="no"><span class="hljs-comment"># Navigate to the test directory  </span>
<span class="hljs-built_in">cd</span> tests/python_client  

<span class="hljs-comment"># Install dependencies  </span>
pip install -r requirements.txt  

<span class="hljs-comment"># Run E2E tests  </span>
pytest --tags=L0 -n auto  
<button class="copy-code-btn"></button></code></pre>
<p>Per istruzioni approfondite e suggerimenti per la risoluzione dei problemi, consultate la <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md#e2e-tests">Guida allo sviluppo di Milvus</a>.</p>
<p><strong>Suggerimento professionale</strong></p>
<p>Se siete alle prime armi con Milvus, iniziate con la modalità Milvus Lite o Standalone per capire le sue capacità prima di passare alla modalità Distributed per i carichi di lavoro di produzione.</p>
<h2 id="Submitting-Your-Code" class="common-anchor-header">Invio del codice<button data-href="#Submitting-Your-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Congratulazioni! Avete superato tutti i test unitari e E2E (o avete eseguito il debug e la ricompilazione, se necessario). Anche se la prima compilazione può richiedere un po' di tempo, quelle successive saranno molto più veloci, quindi non c'è da preoccuparsi. Se tutto è stato superato, siete pronti a inviare le vostre modifiche e a contribuire a Milvus!</p>
<h3 id="Link-Your-Pull-Request-PR-to-an-Issue" class="common-anchor-header">Collegate la vostra richiesta di pull (PR) a un problema</h3><p>Ogni PR a Milvus deve essere collegata a un problema pertinente. Ecco come fare:</p>
<ul>
<li><p><strong>Verificare la presenza di problemi esistenti:</strong> Cercate nel<a href="https://github.com/milvus-io/milvus/issues"> tracker dei problemi di Milvus</a> per vedere se c'è già un problema relativo alle vostre modifiche.</p></li>
<li><p><strong>Creare un nuovo problema:</strong> Se non esiste un problema pertinente, apritene uno nuovo e spiegate il problema che state risolvendo o la funzionalità che state aggiungendo.</p></li>
</ul>
<h3 id="Submitting-Your-Code" class="common-anchor-header">Inviare il codice</h3><ol>
<li><p><strong>Fare il fork del repository:</strong> Iniziate con il fork del<a href="https://github.com/milvus-io/milvus"> repository Milvus</a> sul vostro account GitHub.</p></li>
<li><p><strong>Creare un ramo:</strong> Clonate il fork localmente e create un nuovo ramo per le vostre modifiche.</p></li>
<li><p><strong>Impegnarsi con una firma firmata:</strong> Assicuratevi che i vostri commit includano una firma <code translate="no">Signed-off-by</code> per rispettare le licenze open-source:</p></li>
</ol>
<pre><code translate="no">git commit -m <span class="hljs-string">&quot;Commit of your change&quot;</span> -s
<button class="copy-code-btn"></button></code></pre>
<p>Questo passaggio certifica che il vostro contributo è in linea con il Developer Certificate of Origin (DCO).</p>
<h4 id="Helpful-Resources" class="common-anchor-header"><strong>Risorse utili</strong></h4><p>Per i passi dettagliati e le migliori pratiche, consultate la<a href="https://github.com/milvus-io/milvus/blob/master/CONTRIBUTING.md"> Guida ai contributi di Milvus</a>.</p>
<h2 id="Opportunities-to-Contribute" class="common-anchor-header">Opportunità di contribuire<button data-href="#Opportunities-to-Contribute" class="anchor-icon" translate="no">
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
    </button></h2><p>Congratulazioni, Milvus è pronto e funzionante! Avete esplorato le modalità di distribuzione, eseguito i test e forse anche scavato nel codice. Ora è il momento di salire di livello: contribuite a <a href="https://github.com/milvus-io/milvus">Milvus</a> e aiutate a plasmare il futuro dell'intelligenza artificiale e dei <a href="https://zilliz.com/learn/introduction-to-unstructured-data">dati non strutturati</a>.</p>
<p>Indipendentemente dalle tue competenze, c'è un posto per te nella comunità Milvus! Che tu sia uno sviluppatore che ama risolvere sfide complesse, un tech writer che ama scrivere documentazione pulita o blog di ingegneria, o un appassionato di Kubernetes che vuole migliorare le distribuzioni, c'è un modo per avere un impatto.</p>
<p>Date un'occhiata alle opportunità qui di seguito e trovate la vostra corrispondenza perfetta. Ogni contributo aiuta a far progredire Milvus e chi lo sa? La vostra prossima richiesta di pull potrebbe dare il via alla prossima ondata di innovazione. Quindi, cosa state aspettando? Cominciamo! 🚀</p>
<table>
<thead>
<tr><th>I progetti</th><th>Adatto per</th><th>Linee guida</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/milvus-io/milvus">milvus</a>, <a href="https://github.com/milvus-io/milvus-sdk-go">milvus-sdk-go</a></td><td>Sviluppatori Go</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus">milvus</a>, <a href="https://github.com/milvus-io/knowhere">knowhere</a></td><td>Sviluppatori CPP</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/pymilvus">pymilvus</a>, <a href="https://github.com/milvus-io/milvus-sdk-node">milvus-sdk-node</a>, <a href="https://github.com/milvus-io/milvus-sdk-java">milvus-sdk-java</a></td><td>Sviluppatori interessati ad altri linguaggi</td><td><a href="https://github.com/milvus-io/pymilvus/blob/master/CONTRIBUTING.md">Contribuire a PyMilvus</a></td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus-helm">milvus-helm</a></td><td>Appassionati di Kubernetes</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus-docs">Milvus-docs</a>, <a href="https://github.com/milvus-io/community">milvus-io/community/blog</a></td><td>Scrittori tecnici</td><td><a href="https://github.com/milvus-io/milvus-docs/blob/v2.0.0/CONTRIBUTING.md">Contribuire ai documenti di milvus</a></td></tr>
<tr><td><a href="https://github.com/zilliztech/milvus-insight">milvus-insight</a></td><td>Sviluppatori web</td><td>/</td></tr>
</tbody>
</table>
<h2 id="A-Final-Word" class="common-anchor-header">Una parola finale<button data-href="#A-Final-Word" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus offre diversi <a href="https://milvus.io/docs/install-pymilvus.md">SDK</a> - Python (PyMilvus), <a href="https://milvus.io/docs/install-java.md">Java</a>, <a href="https://milvus.io/docs/install-go.md">Go</a> e <a href="https://milvus.io/docs/install-node.md">Node.js - che</a>rendono semplice iniziare a costruire. Contribuire a Milvus non è solo una questione di codice, ma è anche unirsi a una comunità vibrante e innovativa.</p>
<p>🚀Benvenuti nella comunità di sviluppatori Milvus e buon lavoro! Non vediamo l'ora di vedere cosa creerete.</p>
<h2 id="Further-Reading" class="common-anchor-header">Ulteriori letture<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://zilliz.com/community">Unisciti alla comunità di sviluppatori di intelligenza artificiale di Milvus</a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-vector-database">Cosa sono i database vettoriali e come funzionano?</a></p></li>
<li><p><a href="https://zilliz.com/blog/choose-the-right-milvus-deployment-mode-ai-applications">Milvus Lite vs. Standalone vs. Distribuito: Quale modalità è giusta per voi? </a></p></li>
<li><p><a href="https://zilliz.com/learn/milvus-notebooks">Costruire applicazioni di intelligenza artificiale con Milvus: tutorial e appunti</a></p></li>
<li><p><a href="https://zilliz.com/ai-models">I modelli AI più performanti per le vostre applicazioni GenAI | Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Cos'è il RAG?</a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">Hub di risorse per l'IA generativa | Zilliz</a></p></li>
</ul>
