---
id: talk-to-your-vector-database-managing-milvus-via-natural-language.md
title: 'Parlare con il database vettoriale: Gestire Milvus con il linguaggio naturale'
author: Lawrence Luo
date: 2025-08-01T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Aug_2_2025_01_17_45_PM_9c50d607bb.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'vector database, mcp, LLM, claude, gemini'
meta_keywords: 'Cursor, Claude Code, Gemini CLI, Code search, MCP'
meta_title: |
  Talk to Your Vector Database: Managing Milvus via Natural Language
desc: >-
  Milvus MCP Server collega Milvus direttamente agli assistenti di codifica AI
  come Claude Code e Cursor attraverso MCP. È possibile gestire Milvus
  attraverso il linguaggio naturale.
origin: >-
  https://milvus.io/blog/talk-to-your-vector-database-managing-milvus-via-natural-language.md
---
<p>Avete mai desiderato di poter dire al vostro assistente AI: <em>"Mostrami tutte le collezioni del mio database vettoriale"</em> o <em>"Trova documenti simili a questo testo"</em> e farlo funzionare davvero?</p>
<p>Il <a href="http://github.com/zilliztech/mcp-server-milvus"><strong>Milvus MCP Server</strong></a> lo rende possibile collegando il vostro database vettoriale Milvus direttamente agli assistenti di codifica AI come Claude Desktop e Cursor IDE attraverso il Model Context Protocol (MCP). Invece di scrivere codice <code translate="no">pymilvus</code>, potete gestire l'intero Milvus attraverso conversazioni in linguaggio naturale.</p>
<ul>
<li><p>Senza Milvus MCP Server: Scrittura di script Python con l'SDK pymilvus per la ricerca di vettori</p></li>
<li><p>Con Milvus MCP Server: "Trova documenti simili a questo testo nella mia collezione".</p></li>
</ul>
<p>👉 <strong>Repository GitHub:</strong><a href="https://github.com/zilliztech/mcp-server-milvus"> github.com/zilliztech/mcp-server-milvus</a></p>
<p>E se utilizzate <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (Milvus gestito), abbiamo pensato anche a voi. Alla fine di questo blog, presenteremo anche <strong>Zilliz MCP Server</strong>, un'opzione gestita che funziona perfettamente con Zilliz Cloud. Entriamo nel vivo.</p>
<h2 id="What-Youll-Get-with-Milvus-MCP-Server" class="common-anchor-header">Cosa offre il Milvus MCP Server<button data-href="#What-Youll-Get-with-Milvus-MCP-Server" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus MCP Server offre al vostro assistente AI le seguenti funzionalità:</p>
<ul>
<li><p><strong>Elencare ed esplorare</strong> collezioni di vettori</p></li>
<li><p><strong>Ricerca di vettori</strong> in base alla similarità semantica</p></li>
<li><p><strong>Creare nuove collezioni</strong> con schemi personalizzati</p></li>
<li><p><strong>Inserire e gestire</strong> dati vettoriali</p></li>
<li><p><strong>Eseguire query complesse</strong> senza scrivere codice</p></li>
<li><p>E altro ancora</p></li>
</ul>
<p>Il tutto attraverso una conversazione naturale, come se si stesse parlando con un esperto di database. Consultate <a href="https://github.com/zilliztech/mcp-server-milvus?tab=readme-ov-file#available-tools">questo repo</a> per l'elenco completo delle funzionalità.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/demo_adedb25430.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Quick-Start-Guide" class="common-anchor-header">Guida rapida<button data-href="#Quick-Start-Guide" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">Prerequisiti</h3><p><strong>Richiesto:</strong></p>
<ul>
<li><p>Python 3.10 o superiore</p></li>
<li><p>Un'istanza Milvus in esecuzione (locale o remota)</p></li>
<li><p><a href="https://github.com/astral-sh/uv">gestore di pacchetti uv</a> (consigliato)</p></li>
</ul>
<p><strong>Applicazioni AI supportate:</strong></p>
<ul>
<li><p>Claude Desktop</p></li>
<li><p>IDE Cursor</p></li>
<li><p>Qualsiasi applicazione compatibile con MCP</p></li>
</ul>
<h3 id="Tech-Stack-We’ll-Use" class="common-anchor-header">Stack tecnico utilizzato</h3><p>In questo tutorial, utilizzeremo il seguente stack tecnico:</p>
<ul>
<li><p><strong>Linguaggio Runtime:</strong> <a href="https://www.python.org/">Python 3.11</a></p></li>
<li><p><strong>Gestore di pacchetti:</strong> UV</p></li>
<li><p><strong>IDE:</strong> Cursore</p></li>
<li><p><strong>Server MCP:</strong> mcp-server-milvus</p></li>
<li><p><strong>LLM:</strong> Claude 3.7</p></li>
<li><p><strong>Database vettoriale:</strong> Milvus</p></li>
</ul>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">Passo 1: Installazione delle dipendenze</h3><p>Per prima cosa, installare il gestore di pacchetti uv:</p>
<pre><code translate="no">curl -<span class="hljs-title class_">LsSf</span> <span class="hljs-attr">https</span>:<span class="hljs-comment">//astral.sh/uv/install.sh | sh</span>
<button class="copy-code-btn"></button></code></pre>
<p>Oppure:</p>
<pre><code translate="no">pip3 install uv -i <span class="hljs-attr">https</span>:<span class="hljs-comment">//mirrors.aliyun.com/pypi/simple</span>
<button class="copy-code-btn"></button></code></pre>
<p>Verificare l'installazione:</p>
<pre><code translate="no">uv --version
uvx --version
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_1_Install_Dependencies_3e452c55e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Set-Up-Milvus" class="common-anchor-header">Passo 2: Configurare Milvus</h3><p><a href="https://milvus.io/">Milvus</a> è un database vettoriale open-source nativo per i carichi di lavoro AI, creato da <a href="https://zilliz.com/">Zilliz</a>. Progettato per gestire milioni o miliardi di record vettoriali, ha ottenuto oltre 36.000 stelle su GitHub. Partendo da questa base, Zilliz offre anche <a href="https://zilliz.com/cloud">Zilliz Cloud, un</a>servizio completamente gestito di Milvus, progettato per garantire usabilità, efficienza economica e sicurezza con un'architettura cloud-native.</p>
<p>Per i requisiti di implementazione di Milvus, visitate <a href="https://milvus.io/docs/prerequisite-docker.md">questa guida sul sito del documento</a>.</p>
<p><strong>Requisiti minimi:</strong></p>
<ul>
<li><p><strong>Software:</strong> Docker, Docker Compose</p></li>
<li><p><strong>RAM:</strong> 16GB+</p></li>
<li><p><strong>Disco:</strong> 100GB+</p></li>
</ul>
<p>Scaricare il file YAML di distribuzione:</p>
<pre><code translate="no">[root@Milvus ~]# wget https://github.com/milvus-io/milvus/releases/download/v2.5.4/milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>Avviare Milvus:</p>
<pre><code translate="no">[<span class="hljs-meta">root@Milvus ~</span>]<span class="hljs-meta"># docker-compose up -d</span>
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">[<span class="hljs-meta">root@Milvus ~</span>]<span class="hljs-meta"># docker ps -a</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_2_Set_Up_Milvus_4826468767.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>L'istanza Milvus sarà disponibile all'indirizzo <code translate="no">http://localhost:19530</code>.</p>
<h3 id="Step-3-Install-the-MCP-Server" class="common-anchor-header">Passo 3: Installare il server MCP</h3><p>Clonare e testare il server MCP:</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/zilliztech/mcp-server-milvus.git
<span class="hljs-built_in">cd</span> mcp-server-milvus

<span class="hljs-comment"># Test the server locally</span>
uv run src/mcp_server_milvus/server.py --milvus-uri http://localhost:19530
<button class="copy-code-btn"></button></code></pre>
<p>Si consiglia di installare le dipendenze e di verificarle localmente prima di registrare il server in Cursor:</p>
<pre><code translate="no">uv run src/mcp_server_milvus/server.<span class="hljs-property">py</span> --milvus-uri <span class="hljs-attr">http</span>:<span class="hljs-comment">//192.168.4.48:19530</span>
<button class="copy-code-btn"></button></code></pre>
<p>Se il server si avvia correttamente, si è pronti a configurare lo strumento AI.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_3_Install_the_MCP_Server_9ce01351e6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configure-Your-AI-Assistant" class="common-anchor-header">Passo 4: Configurare l'assistente AI</h3><p><strong>Opzione A: Claude Desktop</strong></p>
<ol>
<li><h4 id="Install-Claude-Desktop-from-claudeaidownloadhttpclaudeaidownload" class="common-anchor-header">Installare Claude Desktop da <code translate="no">[claude.ai/download](http://claude.ai/download)</code>.</h4></li>
<li><p>Aprire il file di configurazione:</p></li>
</ol>
<ul>
<li>macOS: <code translate="no">~/Library/Application Support/Claude/claude_desktop_config.json</code></li>
<li>Windows: <code translate="no">%APPDATA%\Claude\claude_desktop_config.json</code></li>
</ul>
<p>Aggiungere questa configurazione:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;milvus&quot;</span>: {
      <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;/path/to/uv&quot;</span>,
      <span class="hljs-string">&quot;args&quot;</span>: [
        <span class="hljs-string">&quot;--directory&quot;</span>,
        <span class="hljs-string">&quot;/path/to/mcp-server-milvus&quot;</span>,
        <span class="hljs-string">&quot;run&quot;</span>,
        <span class="hljs-string">&quot;src/mcp_server_milvus/server.py&quot;</span>,
        <span class="hljs-string">&quot;--milvus-uri&quot;</span>,
        <span class="hljs-string">&quot;http://localhost:19530&quot;</span>
      ]
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>Riavviare Claude Desktop</li>
</ol>
<p><strong>Opzione B: IDE del cursore</strong></p>
<ol>
<li><p>Aprire Impostazioni del cursore → Caratteristiche → MCP</p></li>
<li><p>Aggiungere un nuovo server MCP globale (questo crea <code translate="no">.cursor/mcp.json</code>).</p></li>
<li><p>Aggiungere questa configurazione:</p></li>
</ol>
<p>Nota: adattare i percorsi alla struttura reale dei file.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;milvus&quot;</span>: {
      <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;/PATH/TO/uv&quot;</span>,
      <span class="hljs-string">&quot;args&quot;</span>: [
        <span class="hljs-string">&quot;--directory&quot;</span>,
        <span class="hljs-string">&quot;/path/to/mcp-server-milvus/src/mcp_server_milvus&quot;</span>,
        <span class="hljs-string">&quot;run&quot;</span>,
        <span class="hljs-string">&quot;server.py&quot;</span>,
        <span class="hljs-string">&quot;--milvus-uri&quot;</span>,
        <span class="hljs-string">&quot;http://127.0.0.1:19530&quot;</span>
      ]
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Option_B_Cursor_IDE_cd1321ea25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Parametri:</strong></p>
<ul>
<li><code translate="no">/PATH/TO/uv</code> è il percorso dell'eseguibile uv</li>
<li><code translate="no">--directory</code> è il percorso del progetto clonato</li>
<li><code translate="no">--milvus-uri</code> è l'endpoint del server Milvus</li>
</ul>
<ol start="4">
<li>Riavviare il Cursore o ricaricare la finestra</li>
</ol>
<p><strong>Suggerimento:</strong> trovare il percorso <code translate="no">uv</code> con <code translate="no">which uv</code> su macOS/Linux o <code translate="no">where uv</code> su Windows.</p>
<h3 id="Step-5-See-It-in-Action" class="common-anchor-header">Passo 5: vederlo in azione</h3><p>Una volta configurato, provate questi comandi in linguaggio naturale:</p>
<ul>
<li><p><strong>Esplorare il database:</strong> "Quali collezioni ho nel mio database Milvus?".</p></li>
<li><p><strong>Creare una nuova raccolta:</strong> "Creare una raccolta chiamata 'articoli' con campi per il titolo (stringa), il contenuto (stringa) e un campo vettoriale a 768 dimensioni per gli embeddings".</p></li>
<li><p><strong>Cercare contenuti simili:</strong> "Trova i cinque articoli più simili a 'applicazioni di apprendimento automatico' nella mia raccolta di articoli".</p></li>
<li><p><strong>Inserire i dati:</strong> "Aggiungere un nuovo articolo con titolo 'AI Trends 2024' e contenuto 'L'intelligenza artificiale continua ad evolversi...' alla raccolta di articoli".</p></li>
</ul>
<p><strong>Ciò che prima richiedeva oltre 30 minuti di codifica ora richiede pochi secondi di conversazione.</strong></p>
<p>Ottenete il controllo in tempo reale e l'accesso in linguaggio naturale a Milvus, senza scrivere boilerplate o imparare l'API.</p>
<h2 id="Troubleshooting" class="common-anchor-header">Risoluzione dei problemi<button data-href="#Troubleshooting" class="anchor-icon" translate="no">
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
    </button></h2><p>Se gli strumenti MCP non appaiono, riavviare completamente l'applicazione AI, verificare il percorso UV con <code translate="no">which uv</code>, e testare il server manualmente con <code translate="no">uv run src/mcp_server_milvus/server.py --milvus-uri http://localhost:19530</code>.</p>
<p>Per gli errori di connessione, verificare che Milvus sia in esecuzione con <code translate="no">docker ps | grep milvus</code>, provare a usare <code translate="no">127.0.0.1</code> invece di <code translate="no">localhost</code> e verificare che la porta 19530 sia accessibile.</p>
<p>Se si riscontrano problemi di autenticazione, impostare la variabile d'ambiente <code translate="no">MILVUS_TOKEN</code> se Milvus richiede l'autenticazione e verificare i permessi per le operazioni che si stanno tentando.</p>
<h2 id="Managed-Alternative-Zilliz-MCP-Server" class="common-anchor-header">Alternativa gestita: Server MCP Zilliz<button data-href="#Managed-Alternative-Zilliz-MCP-Server" class="anchor-icon" translate="no">
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
    </button></h2><p>Il <strong>Milvus MCP Server</strong> open-source è un'ottima soluzione per le implementazioni locali o self-hosted di Milvus. Ma se utilizzate <a href="https://zilliz.com/cloud">Zilliz Cloud, il</a>servizio di livello enterprise completamente gestito dai creatori di Milvus, c'è un'alternativa appositamente costruita: <a href="https://zilliz.com/blog/introducing-zilliz-mcp-server"><strong>Zilliz MCP Server</strong></a>.</p>
<p><a href="https://zilliz.com/cloud">Zilliz Cloud</a> elimina i costi di gestione della propria istanza di Milvus, offrendo un database vettoriale cloud-native scalabile, performante e sicuro. <strong>Zilliz MCP Server</strong> si integra direttamente con Zilliz Cloud ed espone le sue funzionalità come strumenti compatibili con MCP. Ciò significa che il vostro assistente AI, che sia in Claude, Cursor o un altro ambiente MCP-aware, può ora interrogare, gestire e orchestrare il vostro spazio di lavoro Zilliz Cloud utilizzando il linguaggio naturale.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zilliz_mcp_abe1ca1271.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Niente codice boilerplate. Nessun cambio di scheda. Nessuna scrittura manuale di chiamate REST o SDK. Basta formulare la richiesta e lasciare che l'assistente gestisca il resto.</p>
<h3 id="🚀-Getting-Started-with-Zilliz-MCP-Server" class="common-anchor-header">🚀 Iniziare con Zilliz MCP Server</h3><p>Se siete pronti per un'infrastruttura vettoriale pronta per la produzione con la facilità del linguaggio naturale, per iniziare bastano pochi passi:</p>
<ol>
<li><p><a href="https://cloud.zilliz.com/signup"><strong>Iscrivetevi a Zilliz Cloud</strong></a> - è disponibile il livello gratuito.</p></li>
<li><p><a href="http://github.com/zilliztech/zilliz-mcp-server"><strong>Installare il Server MCP Zilliz</strong> dal </a>repository GitHub.</p></li>
<li><p><strong>Configurare il proprio assistente compatibile con MCP</strong> (Claude, Cursor, ecc.) per connettersi all'istanza di Zilliz Cloud.</p></li>
</ol>
<p>In questo modo si ottiene il meglio di entrambi i mondi: una potente ricerca vettoriale con un'infrastruttura di livello produttivo, ora accessibile in un linguaggio semplice.</p>
<h2 id="Wrapping-Up" class="common-anchor-header">Per concludere<button data-href="#Wrapping-Up" class="anchor-icon" translate="no">
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
    </button></h2><p>Ecco fatto: avete appena imparato a trasformare Milvus in un database vettoriale in linguaggio naturale con cui potete letteralmente <em>parlare</em>. Non dovrete più scavare nei documenti dell'SDK o scrivere boilerplate solo per creare una collezione o eseguire una ricerca.</p>
<p>Sia che si esegua Milvus in locale o che si utilizzi Zilliz Cloud, il server MCP fornisce all'assistente AI una cassetta degli attrezzi per gestire i dati vettoriali come un professionista. Basta digitare ciò che si vuole fare e lasciare che Claude o Cursor si occupino del resto.</p>
<p>Quindi, accendete il vostro strumento di sviluppo AI, chiedete "quali collezioni ho?" e vedetelo in azione. Non vorrete più tornare a scrivere a mano le query vettoriali.</p>
<ul>
<li><p>Configurazione locale? Usate il<a href="https://github.com/zilliztech/mcp-server-milvus"> server</a> open-source<a href="https://github.com/zilliztech/mcp-server-milvus"> Milvus MCP.</a></p></li>
<li><p>Preferite un servizio gestito? Iscrivetevi a Zilliz Cloud e utilizzate il<a href="https://github.com/zilliztech/zilliz-mcp-server"> server MCP Zilliz</a>.</p></li>
</ul>
<p>Avete gli strumenti. Ora lasciate che sia la vostra IA a scrivere.</p>
