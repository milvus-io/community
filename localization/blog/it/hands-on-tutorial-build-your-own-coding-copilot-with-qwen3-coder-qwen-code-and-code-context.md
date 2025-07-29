---
id: >-
  hands-on-tutorial-build-your-own-coding-copilot-with-qwen3-coder-qwen-code-and-code-context.md
title: >-
  Esercitazione pratica: Costruire il proprio copilota di codifica con
  Qwen3-Coder, Qwen Code e Code Context
author: Lumina Wang
date: 2025-07-29T00:00:00.000Z
desc: >-
  Imparate a creare il vostro copilota di codifica AI utilizzando Qwen3-Coder,
  Qwen Code CLI e il plugin Code Context per la comprensione semantica del
  codice.
cover: assets.zilliz.com/_9dfadf5877.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Qwen3 Code, Qwen3, Cursor, Code Context, Code Search'
meta_title: |
  Build a Coding Copilot with Qwen3-Coder & Code Context
origin: >-
  https://milvus.io/blog/hands-on-tutorial-build-your-own-coding-copilot-with-qwen3-coder-qwen-code-and-code-context.md
---
<p>Il campo di battaglia degli assistenti di codifica AI si sta scaldando rapidamente. Abbiamo visto <a href="https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md#Claude-Code-or-Gemini-CLI-Choose-Your-Co-Pilot-Wisely">Claude Code</a> di Anthropic fare faville, <a href="https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md#Claude-Code-or-Gemini-CLI-Choose-Your-Co-Pilot-Wisely">Gemini CLI</a> di Google scuotere i flussi di lavoro dei terminali, Codex di OpenAI alimentare GitHub Copilot, Cursor conquistare gli utenti di VS Code e <strong>ora Alibaba Cloud entra con Qwen Code.</strong></p>
<p>Onestamente, si tratta di un'ottima notizia per gli sviluppatori. Più attori significano strumenti migliori, funzionalità innovative e, soprattutto, <strong>alternative open-source</strong> alle costose soluzioni proprietarie. Scopriamo cosa porta sul tavolo quest'ultimo giocatore.</p>
<h2 id="Meet-Qwen3-Coder-and-Qwen-Code" class="common-anchor-header">Ecco Qwen3-Coder e Qwen Code<button data-href="#Meet-Qwen3-Coder-and-Qwen-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Alibaba Cloud ha recentemente rilasciato<a href="https://github.com/QwenLM/Qwen3-Coder"> <strong>Qwen3-Coder</strong></a>, un modello di codifica agenziale open-source che ha ottenuto risultati all'avanguardia in diversi benchmark. Ha inoltre lanciato<a href="https://github.com/QwenLM/qwen-code"> <strong>Qwen Code</strong></a>, uno strumento CLI open-source per la codifica dell'intelligenza artificiale costruito sulla base di Gemini CLI, ma migliorato con parser specializzati per Qwen3-Coder.</p>
<p>Il modello di punta, <strong>Qwen3-Coder-480B-A35B-Instruct</strong>, offre capacità impressionanti: supporto nativo per 358 linguaggi di programmazione, finestra di contesto da 256K token (espandibile fino a 1M di token tramite YaRN) e perfetta integrazione con Claude Code, Cline e altri assistenti di codifica.</p>
<h2 id="The-Universal-Blind-Spot-in-Modern-AI-Coding-Copilots" class="common-anchor-header">Il punto cieco universale dei moderni copiloti di codifica dell'intelligenza artificiale<button data-href="#The-Universal-Blind-Spot-in-Modern-AI-Coding-Copilots" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebbene Qwen3-Coder sia potente, sono più interessato al suo assistente di codifica: <strong>Qwen Code</strong>. Ecco cosa ho trovato interessante. Nonostante tutte le innovazioni, Qwen Code condivide lo stesso limite di Claude Code e Gemini CLI: <strong><em>sono ottimi per generare nuovo codice, ma faticano a comprendere le basi di codice esistenti.</em></strong></p>
<p>Prendiamo questo esempio: chiedete a Gemini CLI o a Qwen Code di "trovare dove questo progetto gestisce l'autenticazione degli utenti". Lo strumento inizia a cercare parole chiave ovvie come "login" o "password", ma manca completamente la funzione critica <code translate="no">verifyCredentials()</code>. A meno che non siate disposti a consumare token fornendo l'intera base di codice come contesto - cosa che è sia costosa che lunga - questi strumenti si scontrano rapidamente con un muro.</p>
<p><strong><em>Questa è la vera lacuna degli attuali strumenti di intelligenza artificiale: la comprensione intelligente del contesto del codice.</em></strong></p>
<h2 id="Supercharge-Any-Coding-Copilot-with-Semantic-Code-Search" class="common-anchor-header">Potenziare qualsiasi copilota di codifica con la ricerca semantica del codice<button data-href="#Supercharge-Any-Coding-Copilot-with-Semantic-Code-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Che cosa succederebbe se si potesse dare a qualsiasi copilota di codifica AI - che si tratti di Claude Code, Gemini CLI o Qwen Code - la capacità di comprendere veramente la vostra base di codice in modo semantico? E se si potesse costruire qualcosa di così potente come Cursor per i propri progetti, senza dover pagare un costo di abbonamento elevato, mantenendo il controllo completo sul codice e sui dati?</p>
<p>Ecco che entra in scena<a href="https://github.com/zilliztech/code-context"> <strong>Code Context, un</strong></a>plugin open source compatibile con MCP che trasforma qualsiasi agente di codifica AI in una centrale elettrica consapevole del contesto. È come dare al vostro assistente AI la memoria istituzionale di uno sviluppatore senior che ha lavorato per anni sulla vostra base di codice. Sia che usiate Qwen Code, Claude Code, Gemini CLI, VSCode o anche Chrome, <strong>Code Context</strong> porta la ricerca semantica del codice nel vostro flusso di lavoro.</p>
<p>Siete pronti a vedere come funziona? Costruiamo un copilota di codifica AI di livello aziendale utilizzando <strong>Qwen3-Coder + Qwen Code + Code Context</strong>.</p>
<h2 id="Hands-On-Tutorial-Building-Your-Own-AI-Coding-Copilot" class="common-anchor-header">Esercitazione pratica: Costruire il proprio copilota di codifica AI<button data-href="#Hands-On-Tutorial-Building-Your-Own-AI-Coding-Copilot" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">Prerequisiti</h3><p>Prima di iniziare, assicuratevi di avere</p>
<ul>
<li><p><strong>Node.js 20+</strong> installato</p></li>
<li><p><strong>Chiave API OpenAI</strong><a href="https://openai.com/index/openai-api/">(ottenibile qui</a>)</p></li>
<li><p><strong>Account Alibaba Cloud</strong> per l'accesso a Qwen3-Coder<a href="https://www.alibabacloud.com/en">(ottenibile qui</a>)</p></li>
<li><p><strong>Account Zilliz Cloud</strong> per il database vettoriale<a href="https://cloud.zilliz.com/login">(registratevi qui</a> gratuitamente se non ne avete ancora uno).</p></li>
</ul>
<p><strong>Note: 1)</strong> In questo tutorial utilizzeremo Qwen3-Coder-Plus, la versione commerciale di Qwen3-Coder, per le sue forti capacità di codifica e la sua facilità d'uso. Se si preferisce un'opzione open-source, si può usare invece qwen3-coder-480b-a35b-instruct. 2) Qwen3-Coder-Plus offre prestazioni e usabilità eccellenti, ma comporta un elevato consumo di token. Assicuratevi di tenere conto di questo aspetto nei vostri piani di budget aziendali.</p>
<h3 id="Step-1-Environment-Setup" class="common-anchor-header">Passo 1: Configurazione dell'ambiente</h3><p>Verificare l'installazione di Node.js:</p>
<pre><code translate="no">curl -qL <span class="hljs-attr">https</span>:<span class="hljs-comment">//www.npmjs.com/install.sh | sh</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Install-Qwen-Code" class="common-anchor-header">Passo 2: Installare il codice Qwen</h3><pre><code translate="no">npm install -g <span class="hljs-meta">@qwen</span>-code/qwen-code
qwen --version
<button class="copy-code-btn"></button></code></pre>
<p>Se vedete il numero di versione come sotto, significa che l'installazione è andata a buon fine.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_0d5ebc152e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Configure-Qwen-Code" class="common-anchor-header">Passo 3: Configurare Qwen Code</h3><p>Navigare nella directory del progetto e inizializzare Qwen Code.</p>
<pre><code translate="no">Qwen
<button class="copy-code-btn"></button></code></pre>
<p>Quindi, vedrete una pagina come quella qui sotto.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_e6598ea982.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Requisiti per la configurazione dell'API:</strong></p>
<ul>
<li><p>Chiave API: Ottenuta da<a href="https://modelstudio.console.alibabacloud.com/"> Alibaba Cloud Model Studio</a></p></li>
<li><p>URL di base: <code translate="no">https://dashscope.aliyuncs.com/compatible-mode/v1</code></p></li>
<li><p>Selezione del modello:</p>
<ul>
<li><p><code translate="no">qwen3-coder-plus</code> (versione commerciale, la più adatta)</p></li>
<li><p><code translate="no">qwen3-coder-480b-a35b-instruct</code> (versione open-source)</p></li>
</ul></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_5ed0c54084.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dopo la configurazione, premere <strong>Invio</strong> per procedere.</p>
<h3 id="Step-4-Test-Basic-Functionality" class="common-anchor-header">Fase 4: Prova della funzionalità di base</h3><p>Verifichiamo la configurazione con due test pratici:</p>
<p><strong>Test 1: Comprensione del codice</strong></p>
<p>Prompt: "Riassumi l'architettura e i componenti principali di questo progetto in una frase".</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_41e601fc82.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3-Coder-Plus ha centrato il riassunto, descrivendo il progetto come un tutorial tecnico costruito su Milvus, con un focus sui sistemi RAG, sulle strategie di recupero e altro ancora.</p>
<p><strong>Prova 2: Generazione di codice</strong></p>
<p>Prompt: "Si prega di creare un piccolo gioco di Tetris".</p>
<p>In meno di un minuto, Qwen3-coder-plus:</p>
<ul>
<li><p>Installa autonomamente le librerie necessarie</p></li>
<li><p>Struttura la logica di gioco</p></li>
<li><p>Crea un'implementazione completa e giocabile</p></li>
<li><p>Gestisce tutta la complessità che normalmente si impiegherebbe per ore a ricercare</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_c67e1725eb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_fd91d5a290.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Questo dimostra il vero sviluppo autonomo: non solo il completamento del codice, ma anche il processo decisionale architettonico e la fornitura di una soluzione completa.</p>
<h3 id="Step-5-Set-Up-Your-Vector-Database" class="common-anchor-header">Fase 5: Impostazione del database vettoriale</h3><p>In questo tutorial utilizzeremo <a href="https://zilliz.com/cloud">Zilliz Cloud</a> come database vettoriale.</p>
<p><strong>Create un cluster Zilliz:</strong></p>
<ol>
<li><p>Accedere alla<a href="https://cloud.zilliz.com/"> console di Zilliz Cloud</a></p></li>
<li><p>Creare un nuovo cluster</p></li>
<li><p>Copiare l'<strong>endpoint pubblico</strong> e il <strong>token</strong></p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_5e692e6e80.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/9_753f281055.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-6-Configure-Code-Context-Integration" class="common-anchor-header">Passo 6: Configurare l'integrazione del contesto del codice</h3><p>Creare <code translate="no">~/.qwen/settings.json</code>:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;code-context&quot;</span>: {
      <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;npx&quot;</span>,
      <span class="hljs-string">&quot;args&quot;</span>: [<span class="hljs-string">&quot;@zilliz/code-context-mcp@latest&quot;</span>],
      <span class="hljs-string">&quot;env&quot;</span>: {
        <span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>: <span class="hljs-string">&quot;sk-xxxxxxxxxx&quot;</span>,
        <span class="hljs-string">&quot;MILVUS_ADDRESS&quot;</span>: <span class="hljs-string">&quot;https://in03-xxxx.cloud.zilliz.com&quot;</span>,
        <span class="hljs-string">&quot;MILVUS_TOKEN&quot;</span>: <span class="hljs-string">&quot;4f699xxxxx&quot;</span>
      },
      <span class="hljs-string">&quot;cwd&quot;</span>: <span class="hljs-string">&quot;./server-directory&quot;</span>,
      <span class="hljs-string">&quot;timeout&quot;</span>: <span class="hljs-number">30000</span>,
      <span class="hljs-string">&quot;trust&quot;</span>: <span class="hljs-literal">false</span>
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-7-Activate-Enhanced-Capabilities" class="common-anchor-header">Passo 7: Attivare le funzionalità avanzate</h3><p>Riavviare Qwen Code:</p>
<pre><code translate="no">Qwen
<button class="copy-code-btn"></button></code></pre>
<p>Premere <strong>Ctrl + T</strong> per visualizzare tre nuovi strumenti all'interno del nostro server MCP:</p>
<ul>
<li><p><code translate="no">index-codebase</code>: Crea indici semantici per la comprensione dei repository</p></li>
<li><p><code translate="no">search-code</code>: Ricerca di codice in linguaggio naturale nella vostra base di codice</p></li>
<li><p><code translate="no">clear-index</code>: Ripristina gli indici quando necessario.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/10_bebbb44460.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-8-Test-the-Complete-Integration" class="common-anchor-header">Passo 8: Testare l'integrazione completa</h3><p>Ecco un esempio reale: In un grande progetto, abbiamo esaminato i nomi dei codici e abbiamo scoperto che "finestra più ampia" suonava poco professionale, quindi abbiamo deciso di cambiarlo.</p>
<p>Prompt: "Trova tutte le funzioni relative a 'finestra più ampia' che necessitano di una ridenominazione professionale".</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_c54398c4f2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Come mostrato nella figura seguente, qwen3-coder-plus ha prima chiamato lo strumento <code translate="no">index_codebase</code> per creare un indice per l'intero progetto.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/12_25a7f3a039.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Quindi, lo strumento <code translate="no">index_codebase</code> ha creato indici per 539 file di questo progetto, suddividendoli in 9.991 parti. Subito dopo aver creato l'indice, ha chiamato lo strumento <code translate="no">search_code</code>per eseguire la query.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/13_6766663346.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Poi ci ha informato di aver trovato i file corrispondenti che dovevano essere modificati.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/14_7b3c7e9cc0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Infine, ha scoperto 4 problemi utilizzando Code Context, tra cui funzioni, importazioni e alcuni nomi nella documentazione, aiutandoci a completare questo piccolo compito.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/15_a529905b28.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Con l'aggiunta di Code Context, <code translate="no">qwen3-coder-plus</code> offre ora una ricerca più intelligente del codice e una migliore comprensione degli ambienti di codifica.</p>
<h3 id="What-Youve-Built" class="common-anchor-header">Cosa avete costruito</h3><p>Ora avete un copilota di codifica AI completo che combina:</p>
<ul>
<li><p><strong>Qwen3-Coder</strong>: generazione intelligente di codice e sviluppo autonomo</p></li>
<li><p><strong>Code Context</strong>: Comprensione semantica delle basi di codice esistenti</p></li>
<li><p><strong>Compatibilità universale</strong>: Funziona con Claude Code, Gemini CLI, VSCode e altro ancora.</p></li>
</ul>
<p>Non si tratta solo di uno sviluppo più rapido, ma di approcci completamente nuovi alla modernizzazione del legacy, alla collaborazione tra team e all'evoluzione dell'architettura.</p>
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
    </button></h2><p>Come sviluppatore, ho provato molti strumenti di codifica AI - da Claude Code a Cursor e Gemini CLI, fino a Qwen Code - e sebbene siano ottimi per generare nuovo codice, di solito non sono all'altezza di comprendere le basi di codice esistenti. Questo è il vero punto dolente: non scrivere funzioni da zero, ma navigare in un codice complesso e disordinato e capire <em>perché</em> le cose sono state fatte in un certo modo.</p>
<p>Questo è ciò che rende la configurazione di <strong>Qwen3-Coder + Qwen Code + Code Context</strong> così interessante. Si ottiene il meglio dei due mondi: un potente modello di codifica in grado di generare implementazioni complete <em>e</em> un livello di ricerca semantica che comprende effettivamente la storia, la struttura e le convenzioni di denominazione del progetto.</p>
<p>Con la ricerca vettoriale e l'ecosistema di plugin MCP, non sarete più costretti a incollare file a caso nella finestra di prompt o a scorrere il vostro repo cercando di trovare il contesto giusto. Basta chiedere in un linguaggio semplice e il sistema trova i file, le funzioni o le decisioni pertinenti, come se avessimo uno sviluppatore senior che si ricorda tutto.</p>
<p>Per essere chiari, questo approccio non è solo più veloce: cambia davvero il modo di lavorare. È un passo avanti verso un nuovo tipo di flusso di lavoro di sviluppo in cui l'intelligenza artificiale non è solo un aiuto per la codifica, ma un assistente architettonico, un compagno di squadra che comprende l'intero contesto del progetto.</p>
<p><em>Detto questo... un avvertimento: Qwen3-Coder-Plus è straordinario, ma molto avido di gettoni. Solo la costruzione di questo prototipo ha bruciato 20 milioni di token. Quindi sì, ora sono ufficialmente a corto di crediti 😅.</em></p>
<p>__</p>
