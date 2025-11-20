---
id: >-
  is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md
title: >-
  MCP è già superato? Il vero motivo per cui Anthropic ha spedito le competenze
  e come abbinarle a Milvus
author: Min Yin
date: 2025-11-19T00:00:00.000Z
cover: assets.zilliz.com/skill_mcp_cover_0b12d0d95d.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude, Skills, MCP, Milvus, AI workflow'
meta_title: 'Exploring Skills, MCP, and Milvus for Smarter AI Workflows'
desc: >-
  Scoprite come Skills funziona per ridurre il consumo di token e come Skills e
  MCP collaborano con Milvus per migliorare i flussi di lavoro dell'IA.
origin: >-
  https://milvus.io/blog/is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md
---
<p>Nelle ultime settimane è scoppiata una discussione sorprendentemente accesa tra X e Hacker News: <em>Abbiamo davvero bisogno dei server MCP?</em> Alcuni sviluppatori sostengono che MCP sia eccessivamente ingegnerizzato, affamato di token e fondamentalmente non allineato con il modo in cui gli agenti dovrebbero usare gli strumenti. Altri difendono MCP come il modo affidabile per esporre le capacità del mondo reale ai modelli linguistici. A seconda del thread che si legge, l'MCP è il futuro dell'uso degli strumenti, oppure è morto all'arrivo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hackernews_c3236cca2c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La frustrazione è comprensibile. L'MCP offre un accesso robusto ai sistemi esterni, ma costringe il modello a caricare schemi lunghi, descrizioni prolisse ed elenchi di strumenti molto estesi. Questo aggiunge costi reali. Se si scarica la trascrizione di una riunione e successivamente la si inserisce in un altro strumento, il modello potrebbe rielaborare lo stesso testo più volte, gonfiando l'utilizzo dei token senza alcun beneficio evidente. Per i team che operano su scala, questo non è un inconveniente, ma una bolletta.</p>
<p>Ma dichiarare MCP obsoleto è prematuro. Anthropic, lo stesso team che ha inventato MCP, ha introdotto silenziosamente qualcosa di nuovo: <a href="https://claude.com/blog/skills"><strong>le competenze</strong></a>. Le competenze sono definizioni Markdown/YAML leggere che descrivono <em>come</em> e <em>quando</em> uno strumento deve essere usato. Invece di scaricare schemi completi nella finestra del contesto, il modello legge prima i metadati compatti e li usa per pianificare. In pratica, Skills riduce drasticamente l'overhead dei token e offre agli sviluppatori un maggiore controllo sull'orchestrazione degli strumenti.</p>
<p>Questo significa che Skills sostituirà MCP? Non proprio. Le Skill semplificano la pianificazione, ma MCP continua a fornire le funzionalità effettive: lettura di file, chiamata di API, interazione con sistemi di archiviazione o collegamento a infrastrutture esterne come <a href="https://milvus.io/"><strong>Milvus</strong></a>, un database vettoriale open-source alla base di un rapido recupero semantico su scala, che lo rende un backend fondamentale quando le Skill hanno bisogno di un accesso reale ai dati.</p>
<p>Questo post illustra quali sono le abilità che funzionano bene, dove MCP è ancora importante e come entrambi si inseriscono nell'architettura degli agenti in evoluzione di Anthropic. Poi spiegheremo come costruire le proprie Skill che si integrano in modo pulito con Milvus.</p>
<h2 id="What-Are-Anthropic-Agent-Skills-and-How-Do-They-Work" class="common-anchor-header">Cosa sono e come funzionano le Skill di Anthropic?<button data-href="#What-Are-Anthropic-Agent-Skills-and-How-Do-They-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Un punto dolente di lunga data degli agenti AI tradizionali è che le istruzioni si esauriscono man mano che la conversazione cresce.</p>
<p>Anche con i suggerimenti di sistema più accurati, il comportamento del modello può gradualmente andare alla deriva nel corso della conversazione. Dopo diversi turni, Claude inizia a dimenticare o a perdere di vista le istruzioni originali.</p>
<p>Il problema risiede nella struttura del prompt di sistema. Si tratta di un'iniezione statica una tantum che compete per lo spazio nella finestra contestuale del modello, insieme alla cronologia della conversazione, ai documenti e a qualsiasi altro input. Man mano che la finestra del contesto si riempie, l'attenzione del modello per il prompt del sistema si diluisce sempre di più, portando a una perdita di coerenza nel tempo.</p>
<p>Le competenze sono state progettate per risolvere questo problema. Le abilità sono cartelle contenenti istruzioni, script e risorse. Invece di affidarsi a un prompt di sistema statico, le abilità suddividono le competenze in pacchetti di istruzioni modulari, riutilizzabili e persistenti che Claude può scoprire e caricare dinamicamente quando è necessario per un compito.</p>
<p>Quando Claude inizia un'attività, esegue innanzitutto una scansione leggera di tutte le Skill disponibili, leggendo solo i loro metadati YAML (poche decine di token). Questi metadati forniscono informazioni sufficienti a Claude per determinare se un'abilità è rilevante per l'attività corrente. In caso affermativo, Claude si espande all'intero set di istruzioni (di solito meno di 5k token) e le risorse o gli script aggiuntivi vengono caricati solo se necessario.</p>
<p>Questa divulgazione progressiva permette a Claude di inizializzare un'abilità con soli 30-50 token, migliorando significativamente l'efficienza e riducendo l'inutile overhead del contesto.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_skills_works_a8563f346c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-Skills-Compares-to-Prompts-Projects-MCP-and-Subagents" class="common-anchor-header">Come le competenze si confrontano con i prompt, i progetti, gli MCP e i subagenti<button data-href="#How-Skills-Compares-to-Prompts-Projects-MCP-and-Subagents" class="anchor-icon" translate="no">
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
    </button></h2><p>Il panorama odierno degli strumenti di modellazione può sembrare affollato. Anche solo all'interno dell'ecosistema agenziale di Claude, ci sono diversi componenti distinti: Abilità, prompt, progetti, subagenti e MCP.</p>
<p>Ora che abbiamo capito cosa sono le abilità e come funzionano attraverso i pacchetti di istruzioni modulari e il caricamento dinamico, dobbiamo sapere come le abilità si relazionano con le altre parti dell'ecosistema Claude, in particolare con MCP. Ecco un riassunto:</p>
<h3 id="1-Skills" class="common-anchor-header">1. Le competenze</h3><p>Le abilità sono cartelle che contengono istruzioni, script e risorse. Claude le scopre e le carica dinamicamente utilizzando una divulgazione progressiva: prima i metadati, poi le istruzioni complete e infine i file necessari.</p>
<p><strong>Ideale per:</strong></p>
<ul>
<li><p>Flussi di lavoro organizzativi (linee guida del marchio, procedure di conformità)</p></li>
<li><p>Competenze di settore (formule Excel, analisi dei dati)</p></li>
<li><p>Preferenze personali (sistemi per prendere appunti, schemi di codifica)</p></li>
<li><p>Attività professionali che devono essere riutilizzate in tutte le conversazioni (revisioni della sicurezza del codice basate su OWASP).</p></li>
</ul>
<h3 id="2-Prompts" class="common-anchor-header">2. Prompt</h3><p>I prompt sono le istruzioni in linguaggio naturale fornite a Claude durante una conversazione. Sono temporanei ed esistono solo nella conversazione in corso.</p>
<p><strong>Ideale per:</strong></p>
<ul>
<li><p>Richieste una tantum (riassunto di un articolo, formattazione di un elenco)</p></li>
<li><p>perfezionamento della conversazione (regolazione del tono, aggiunta di dettagli)</p></li>
<li><p>Contesto immediato (analisi di dati specifici, interpretazione di contenuti)</p></li>
<li><p>Istruzioni ad hoc</p></li>
</ul>
<h3 id="3-Projects" class="common-anchor-header">3. I progetti</h3><p>I progetti sono spazi di lavoro autonomi con una propria cronologia di chat e basi di conoscenza. Ogni progetto offre una finestra di contesto di 200K. Quando la conoscenza del progetto si avvicina ai limiti del contesto, Claude passa senza problemi alla modalità RAG, consentendo un'espansione fino a 10 volte della capacità effettiva.</p>
<p><strong>Ideale per:</strong></p>
<ul>
<li><p>Contesto persistente (ad esempio, tutte le conversazioni relative al lancio di un prodotto)</p></li>
<li><p>Organizzazione dello spazio di lavoro (contesti separati per le diverse iniziative)</p></li>
<li><p>Collaborazione di gruppo (sui piani Team ed Enterprise)</p></li>
<li><p>Istruzioni personalizzate (tono o prospettiva specifici di un progetto)</p></li>
</ul>
<h3 id="4-Subagents" class="common-anchor-header">4. Subagenti</h3><p>I subagenti sono assistenti AI specializzati con le proprie finestre contestuali, richieste di sistema personalizzate e autorizzazioni specifiche per gli strumenti. Possono lavorare in modo indipendente e restituire i risultati all'agente principale.</p>
<p><strong>Ideale per:</strong></p>
<ul>
<li><p>Specializzazione dei compiti (revisione del codice, generazione di test, audit di sicurezza)</p></li>
<li><p>Gestione del contesto (mantenere la conversazione principale concentrata)</p></li>
<li><p>Elaborazione parallela (più subagenti che lavorano contemporaneamente su aspetti diversi)</p></li>
<li><p>Limitazione degli strumenti (ad esempio, accesso in sola lettura).</p></li>
</ul>
<h3 id="5-MCP-Model-Context-Protocol" class="common-anchor-header">5. MCP (Model Context Protocol)</h3><p>Il Model Context Protocol (MCP) è uno standard aperto che collega i modelli di intelligenza artificiale a strumenti e fonti di dati esterni.</p>
<p><strong>Ideale per:</strong></p>
<ul>
<li><p>Accedere a dati esterni (Google Drive, Slack, GitHub, database).</p></li>
<li><p>Utilizzo di strumenti aziendali (sistemi CRM, piattaforme di gestione dei progetti)</p></li>
<li><p>Collegamento ad ambienti di sviluppo (file locali, IDE, controllo di versione)</p></li>
<li><p>Integrazione con sistemi personalizzati (strumenti e fonti di dati proprietari)</p></li>
</ul>
<p>Sulla base di quanto sopra, possiamo vedere che le competenze e gli MCP affrontano sfide diverse e lavorano insieme per completarsi a vicenda.</p>
<table>
<thead>
<tr><th><strong>Dimensione</strong></th><th><strong>MCP</strong></th><th><strong>Competenze</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Valore fondamentale</strong></td><td>Si connette a sistemi esterni (database, API, piattaforme SaaS)</td><td>Definisce le specifiche di comportamento (come elaborare e presentare i dati)</td></tr>
<tr><td><strong>Domande a cui si risponde</strong></td><td>"A cosa può accedere Claude?"</td><td>"Cosa deve fare Claude?</td></tr>
<tr><td><strong>Implementazione</strong></td><td>Protocollo client-server + schema JSON</td><td>File Markdown + metadati YAML</td></tr>
<tr><td><strong>Consumo del contesto</strong></td><td>Decine di migliaia di token (accumulo di più server)</td><td>30-50 token per operazione</td></tr>
<tr><td><strong>Casi d'uso</strong></td><td>Interrogazione di grandi database, chiamata alle API di GitHub</td><td>Definizione di strategie di ricerca, applicazione di regole di filtraggio, formattazione dell'output</td></tr>
</tbody>
</table>
<p>Prendiamo come esempio la ricerca di codice.</p>
<ul>
<li><p><strong>MCP (ad esempio, claude-context):</strong> Fornisce la possibilità di accedere al database dei vettori di Milvus.</p></li>
<li><p><strong>Competenze:</strong> Definisce il flusso di lavoro, come la priorità del codice modificato più di recente, l'ordinamento dei risultati per rilevanza e la presentazione dei dati in una tabella Markdown.</p></li>
</ul>
<p>MCP fornisce le capacità, mentre le competenze definiscono il processo. Insieme, formano una coppia complementare.</p>
<h2 id="How-to-Build-Custom-Skills-with-Claude-Context-and-Milvus" class="common-anchor-header">Come costruire competenze personalizzate con Claude-Context e Milvus<button data-href="#How-to-Build-Custom-Skills-with-Claude-Context-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/claude-context">Claude-Context</a> è un plugin MCP che aggiunge la funzionalità di ricerca semantica del codice a Claude Code, trasformando l'intera base di codice nel contesto di Claude.</p>
<h3 id="Prerequisite" class="common-anchor-header">Prerequisito</h3><p>Requisiti di sistema:</p>
<ul>
<li><p><strong>Node.js</strong>: Versione &gt;= 20.0.0 e &lt; 24.0.0</p></li>
<li><p><strong>Chiave API OpenAI</strong> (per incorporare i modelli)</p></li>
<li><p><strong>Chiave API</strong><a href="https://zilliz.com.cn/"><strong>Zilliz Cloud</strong></a> (servizio Milvus gestito)</p></li>
</ul>
<h3 id="Step-1-Configure-the-MCP-Service-claude-context" class="common-anchor-header">Passo 1: Configurare il servizio MCP (claude-context)</h3><p>Eseguire il seguente comando nel terminale:</p>
<pre><code translate="no">claude mcp add claude-context \
  -e OPENAI_API_KEY=sk-your-openai-api-key \
  -e MILVUS_ADDRESS=https:<span class="hljs-comment">//xxxxxxxxx-cn-hangzhou.cloud.zilliz.com.cn \</span>
  -e MILVUS_TOKEN=your-zilliz-cloud-api-key \
  -e COLLECTION_NAME=medium_articles \
  -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>Controllare la configurazione:</p>
<pre><code translate="no">claude mcp list
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Check_the_Configuration_5d2abd5ee8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La configurazione MCP è completa. Claude può ora accedere al database dei vettori di Milvus.</p>
<h3 id="Step-2-Create-the-Skill" class="common-anchor-header">Passo 2: Creare l'abilità</h3><p>Creare la cartella Skills:</p>
<pre><code translate="no"><span class="hljs-built_in">mkdir</span> -p ~/.claude/skills/milvus-code-search
<span class="hljs-built_in">cd</span> ~/.claude/skills/milvus-code-search
<button class="copy-code-btn"></button></code></pre>
<p>Creare il file SKILL.md:</p>
<pre><code translate="no">---
name: milvus-code-search
description: A semantic code search <span class="hljs-keyword">and</span> architecture analysis skill designed <span class="hljs-keyword">for</span> the Milvus codebase
---

<span class="hljs-meta">## Instructions</span>
When the user asks questions related to the Milvus codebase, I will:

<span class="hljs-number">1.</span> **Code Search** : Use semantic search to locate relevant code snippets across the Milvus repository  
<span class="hljs-number">2.</span> **Architecture Analysis** : Analyze Milvus’s module structure, component relationships, <span class="hljs-keyword">and</span> design patterns  
<span class="hljs-number">3.</span> **Feature Explanation** : Explain how specific features are implemented <span class="hljs-keyword">and</span> how the corresponding logic works  
<span class="hljs-number">4.</span> **Development Guidance** : Provide suggestions, best practices, <span class="hljs-keyword">and</span> improvement ideas <span class="hljs-keyword">for</span> modifying the code  

<span class="hljs-meta">## Target Repository</span>
- **Core Modules**:  
  - `<span class="hljs-keyword">internal</span>/` — Core <span class="hljs-keyword">internal</span> components  
  - `pkg/` — Public packages <span class="hljs-keyword">and</span> utilities  
  - `client/` — Go client implementation  
  - `cmd/` — Command-line tools  

<span class="hljs-meta">## Usage Examples</span>

<span class="hljs-meta">### Architecture Query</span>
User: How does Milvus’s query coordinator work?  
Assistant: *(searching <span class="hljs-keyword">for</span> `querycoordv2`)* Let me walk you through how the query coordinator operates <span class="hljs-keyword">in</span> Milvus…

<span class="hljs-meta">### Feature Implementation</span>
User: How does Milvus implement vector indexing?  
Assistant: *(searching <span class="hljs-keyword">for</span> `index` code)* The vector indexing logic <span class="hljs-keyword">in</span> Milvus <span class="hljs-keyword">is</span> mainly implemented <span class="hljs-keyword">in</span> the following modules…

<span class="hljs-meta">### Code Understanding</span>
User: What does <span class="hljs-keyword">this</span> function <span class="hljs-keyword">do</span>? *(points to a specific <span class="hljs-keyword">file</span>)*  
Assistant: *(analyzing the surrounding code)* Based <span class="hljs-keyword">on</span> the context of the Milvus codebase, <span class="hljs-keyword">this</span> function <span class="hljs-keyword">is</span> responsible <span class="hljs-keyword">for</span>…

<span class="hljs-meta">### Development Guidance</span>
User: How can I <span class="hljs-keyword">add</span> a <span class="hljs-keyword">new</span> vector distance metric to Milvus?  
Assistant: *(searching <span class="hljs-keyword">for</span> `distance` implementations)* Following the existing pattern, you can <span class="hljs-keyword">add</span> a <span class="hljs-keyword">new</span> distance method <span class="hljs-keyword">by</span>…

<span class="hljs-meta">## Best Practices</span>
<span class="hljs-number">1.</span> **Precise Search** : Use specific technical terms <span class="hljs-keyword">and</span> module names  
<span class="hljs-number">2.</span> **Contextual Understanding** : Interpret code within Milvus’s overall system architecture  
<span class="hljs-number">3.</span> **Actionable Advice** : Provide practical, implementation-ready suggestions  
<span class="hljs-number">4.</span> **Performance Awareness** : Consider Milvus’s requirements <span class="hljs-keyword">as</span> a high-performance vector database  

---

*A custom code-search Skill tailored <span class="hljs-keyword">for</span> the open-source Milvus vector database project.*

---
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Restart-Claude-to-Apply-Skills" class="common-anchor-header">Passo 3: Riavviare Claude per applicare le competenze</h3><p>Eseguire il seguente comando per riavviare Claude:</p>
<pre><code translate="no">claude
<button class="copy-code-btn"></button></code></pre>
<p><strong>Nota:</strong> Una volta completata la configurazione, è possibile utilizzare immediatamente le competenze per interrogare il codice Milvus.</p>
<p>Di seguito un esempio di come funziona.</p>
<p>Interrogazione: Come funziona Milvus QueryCoord?</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_a95429ddb0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code2_d58a942777.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code3_6c9f835c65.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>Le competenze sono un meccanismo per incapsulare e trasferire conoscenze specializzate. Utilizzando le competenze, l'intelligenza artificiale può ereditare l'esperienza di un team e seguire le best practice del settore, che si tratti di una lista di controllo per la revisione del codice o di standard di documentazione. Quando questa conoscenza tacita viene resa esplicita attraverso i file Markdown, la qualità dei risultati generati dall'IA può migliorare in modo significativo.</p>
<p>In prospettiva, la capacità di sfruttare le competenze in modo efficace potrebbe diventare un elemento di differenziazione fondamentale per l'utilizzo dell'IA da parte di team e individui.</p>
<p>Mentre esplorate il potenziale dell'IA nella vostra organizzazione, Milvus è uno strumento fondamentale per la gestione e la ricerca di dati vettoriali su larga scala. Abbinando il potente database vettoriale di Milvus a strumenti di IA come Skills, potrete migliorare non solo i vostri flussi di lavoro, ma anche la profondità e la velocità delle vostre intuizioni basate sui dati.</p>
<p>Avete domande o volete un approfondimento su una qualsiasi funzione? Unitevi al nostro<a href="https://discord.com/invite/8uyFbECzPX"> canale Discord</a> per chiacchierare con i nostri ingegneri e con gli altri ingegneri di intelligenza artificiale della comunità. È anche possibile prenotare una sessione individuale di 20 minuti per ottenere approfondimenti, indicazioni e risposte alle vostre domande attraverso<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
