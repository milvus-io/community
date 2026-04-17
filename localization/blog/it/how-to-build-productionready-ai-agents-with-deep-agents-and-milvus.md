---
id: how-to-build-productionready-ai-agents-with-deep-agents-and-milvus.md
title: Come costruire agenti AI pronti per la produzione con Deep Agents e Milvus
author: Min Yin
date: 2026-03-02T00:00:00.000Z
cover: assets.zilliz.com/cover_deepagents_b45edd5f94.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Deep Agents, AI agents, Milvus vector database, LangChain agents, persistent
  agent memory
meta_title: |
  How to Build Production-Ready AI Agents with Deep Agents
desc: >-
  Imparate a costruire agenti di intelligenza artificiale scalabili utilizzando
  Deep Agents e Milvus per attività di lunga durata, costi di token inferiori e
  memoria persistente.
origin: >-
  https://milvus.io/blog/how-to-build-productionready-ai-agents-with-deep-agents-and-milvus.md
---
<p>Sempre più team costruiscono agenti di intelligenza artificiale e i compiti che assegnano loro diventano sempre più complessi. Molti flussi di lavoro del mondo reale comportano lavori di lunga durata con più fasi e molte chiamate a strumenti. Quando questi compiti aumentano, si presentano rapidamente due problemi: l'aumento dei costi dei token e i limiti della finestra di contesto del modello. Inoltre, gli agenti hanno spesso bisogno di ricordare informazioni tra le varie sessioni, come i risultati di ricerche passate, le preferenze degli utenti o le conversazioni precedenti.</p>
<p>Framework come <a href="https://docs.langchain.com/oss/python/deepagents/overview"><strong>Deep Agents</strong></a>, rilasciato da LangChain, aiutano a organizzare questi flussi di lavoro. Fornisce un modo strutturato di eseguire gli agenti, con supporto per la pianificazione delle attività, l'accesso ai file e la delega dei subagenti. In questo modo è più facile costruire agenti in grado di gestire in modo più affidabile attività lunghe e in più fasi.</p>
<p>Ma i flussi di lavoro da soli non bastano. Gli agenti hanno bisogno anche di una <strong>memoria a lungo termine</strong> per poter recuperare informazioni utili da sessioni precedenti. È qui che entra in gioco <a href="https://milvus.io/"><strong>Milvus</strong></a>, un database vettoriale open source. Memorizzando le incorporazioni di conversazioni, documenti e risultati di strumenti, Milvus consente agli agenti di cercare e richiamare le conoscenze pregresse.</p>
<p>In questo articolo spiegheremo come funziona Deep Agents e mostreremo come combinarlo con Milvus per costruire agenti AI con flussi di lavoro strutturati e memoria a lungo termine.</p>
<h2 id="What-Is-Deep-Agents" class="common-anchor-header">Che cos'è Deep Agents?<button data-href="#What-Is-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Deep Agents</strong> è un framework open-source per agenti costruito dal team LangChain. È stato progettato per aiutare gli agenti a gestire in modo più affidabile i compiti a lungo termine e in più fasi. Si concentra su tre funzionalità principali:</p>
<p><strong>1. Pianificazione dei compiti</strong></p>
<p>Deep Agents include strumenti integrati come <code translate="no">write_todos</code> e <code translate="no">read_todos</code>. L'agente suddivide un compito complesso in un elenco chiaro di cose da fare, quindi lavora passo dopo passo su ogni voce, contrassegnando le attività come completate.</p>
<p><strong>2. Accesso al file system</strong></p>
<p>Il sistema fornisce strumenti come <code translate="no">ls</code>, <code translate="no">read_file</code> e <code translate="no">write_file</code>, in modo che l'agente possa visualizzare, leggere e scrivere i file. Se uno strumento produce un output di grandi dimensioni, il risultato viene automaticamente salvato in un file invece di rimanere nella finestra contestuale del modello. In questo modo si evita che la finestra contestuale si riempia.</p>
<p><strong>3. Delegazione di subagenti</strong></p>
<p>Utilizzando uno strumento <code translate="no">task</code>, l'agente principale può delegare dei compiti secondari a subagenti specializzati. Ogni subagente ha la propria finestra contestuale e i propri strumenti, il che aiuta a mantenere il lavoro organizzato.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_59401bc198.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Tecnicamente, un agente creato con <code translate="no">create_deep_agent</code> è uno <strong>StateGraph LangGraph</strong> compilato. (LangGraph è la libreria di flusso di lavoro sviluppata dal team di LangChain e StateGraph è la sua struttura di stato principale). Per questo motivo, i Deep Agent possono utilizzare direttamente le caratteristiche di LangGraph, come lo streaming dell'output, il checkpoint e l'interazione con l'uomo nel loop.</p>
<p><strong>Cosa rende utili i Deep Agent nella pratica?</strong></p>
<p>I compiti degli agenti di lunga durata devono spesso affrontare problemi come i limiti del contesto, gli alti costi dei token e l'inaffidabilità dell'esecuzione. Deep Agents aiuta a risolvere questi problemi rendendo i flussi di lavoro degli agenti più strutturati e facili da gestire. Riducendo la crescita inutile dei contesti, riduce l'uso dei token e rende più efficienti i costi dei task di lunga durata.</p>
<p>Inoltre, rende più facile l'organizzazione di attività complesse e in più fasi. Le sottoattività possono essere eseguite in modo indipendente senza interferire l'una con l'altra, migliorando così l'affidabilità. Allo stesso tempo, il sistema è flessibile e consente agli sviluppatori di personalizzarlo ed estenderlo man mano che i loro agenti passano da semplici esperimenti ad applicazioni di produzione.</p>
<h2 id="Customization-in-Deep-Agents" class="common-anchor-header">Personalizzazione negli agenti profondi<button data-href="#Customization-in-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Un framework generale non può coprire ogni settore o esigenza aziendale. Deep Agents è stato progettato per essere flessibile, in modo che gli sviluppatori possano adattarlo ai propri casi d'uso.</p>
<p>Con la personalizzazione, è possibile</p>
<ul>
<li><p>Collegare i propri strumenti interni e le proprie API</p></li>
<li><p>Definire flussi di lavoro specifici per il dominio</p></li>
<li><p>Assicurarsi che l'agente segua le regole aziendali</p></li>
<li><p>Supportare la memoria e la condivisione delle conoscenze tra le sessioni</p></li>
</ul>
<p>Ecco i modi principali in cui è possibile personalizzare gli agenti Deep:</p>
<h3 id="System-Prompt-Customization" class="common-anchor-header">Personalizzazione del prompt di sistema</h3><p>È possibile aggiungere un prompt di sistema personalizzato alle istruzioni predefinite fornite dal middleware. Ciò è utile per definire regole di dominio e flussi di lavoro.</p>
<p>Un buon prompt personalizzato può includere</p>
<ul>
<li><strong>Regole del flusso di lavoro del dominio</strong></li>
</ul>
<p>Esempio: "Per le attività di analisi dei dati, eseguire sempre l'analisi esplorativa prima di costruire un modello".</p>
<ul>
<li><strong>Esempi specifici</strong></li>
</ul>
<p>Esempio: "Combinare richieste di ricerca bibliografica simili in un unico todo item".</p>
<ul>
<li><strong>Regole di arresto</strong></li>
</ul>
<p>Esempio: "Fermarsi se vengono utilizzate più di 100 chiamate di strumenti".</p>
<ul>
<li><strong>Guida al coordinamento degli strumenti</strong></li>
</ul>
<p>Esempio: "Usare <code translate="no">grep</code> per trovare le posizioni del codice, quindi usare <code translate="no">read_file</code> per visualizzare i dettagli".</p>
<p>Evitare di ripetere istruzioni già gestite dal middleware ed evitare di aggiungere regole in conflitto con il comportamento predefinito.</p>
<h3 id="Tools" class="common-anchor-header">Strumenti</h3><p>È possibile aggiungere i propri strumenti al set di strumenti incorporati. Gli strumenti sono definiti come normali funzioni Python e le loro documentazioni ne descrivono le funzioni.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">def</span> <span class="hljs-title function_">internet_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Run a web search&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> tavily_client.search(query)
agent = create_deep_agent(tools=[internet_search])
<button class="copy-code-btn"></button></code></pre>
<p>Deep Agents supporta anche strumenti che seguono lo standard Model Context Protocol (MCP) attraverso <code translate="no">langchain-mcp-adapters</code>.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_mcp_adapters.client <span class="hljs-keyword">import</span> MultiServerMCPClient
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():
    mcp_client = MultiServerMCPClient(...)
    mcp_tools = <span class="hljs-keyword">await</span> mcp_client.get_tools()
    agent = create_deep_agent(tools=mcp_tools)
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">for</span> chunk <span class="hljs-keyword">in</span> agent.astream({<span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;...&quot;</span>}]}):
        chunk[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>].pretty_print()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Middleware" class="common-anchor-header">Middleware</h3><p>È possibile scrivere middleware personalizzati per:</p>
<ul>
<li><p>Aggiungere o modificare strumenti</p></li>
<li><p>Regolare le richieste</p></li>
<li><p>Agganciarsi a diverse fasi dell'esecuzione dell'agente.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_core.tools <span class="hljs-keyword">import</span> tool
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> deepagents.middleware <span class="hljs-keyword">import</span> AgentMiddleware
<span class="hljs-meta">@tool</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_weather</span>(<span class="hljs-params">city: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Get the weather in a city.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;The weather in <span class="hljs-subst">{city}</span> is sunny.&quot;</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">WeatherMiddleware</span>(<span class="hljs-title class_ inherited__">AgentMiddleware</span>):
    tools = [get_weather]
agent = create_deep_agent(middleware=[WeatherMiddleware()])
<button class="copy-code-btn"></button></code></pre>
<p>Deep Agents include anche un middleware integrato per la pianificazione, la gestione dei subagenti e il controllo dell'esecuzione.</p>
<table>
<thead>
<tr><th>Middleware</th><th>Funzione</th></tr>
</thead>
<tbody>
<tr><td>TodoListMiddleware</td><td>Fornisce gli strumenti write_todos e read_todos per gestire gli elenchi di attività.</td></tr>
<tr><td>FilesystemMiddleware</td><td>Fornisce strumenti per le operazioni sui file e salva automaticamente i risultati degli strumenti di grandi dimensioni</td></tr>
<tr><td>SubAgentMiddleware</td><td>Fornisce lo strumento per delegare il lavoro ai subagenti.</td></tr>
<tr><td>RiassuntoMiddleware</td><td>Riassume automaticamente quando il contesto supera i 170k token</td></tr>
<tr><td>AntropicPromptCachingMiddleware</td><td>Abilita la cache dei prompt per i modelli antropici</td></tr>
<tr><td>PatchToolCallsMiddleware</td><td>Corregge le chiamate incomplete agli strumenti causate da interruzioni</td></tr>
<tr><td>HumanInTheLoopMiddleware</td><td>Configura gli strumenti che richiedono l'approvazione umana</td></tr>
</tbody>
</table>
<h3 id="Sub-agents" class="common-anchor-header">Sub-agenti</h3><p>L'agente principale può delegare le attività secondarie ai subagenti utilizzando lo strumento <code translate="no">task</code>. Ogni subagente viene eseguito nella propria finestra di contesto e dispone dei propri strumenti e del proprio prompt di sistema.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
research_subagent = {
    <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;research-agent&quot;</span>,
    <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Used to research in-depth questions&quot;</span>,
    <span class="hljs-string">&quot;prompt&quot;</span>: <span class="hljs-string">&quot;You are an expert researcher&quot;</span>,
    <span class="hljs-string">&quot;tools&quot;</span>: [internet_search],
    <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,  <span class="hljs-comment"># Optional, defaults to main agent model</span>
}
agent = create_deep_agent(subagents=[research_subagent])
<button class="copy-code-btn"></button></code></pre>
<p>Per casi d'uso avanzati, si può anche passare un flusso di lavoro LangGraph precostituito come subagente.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> <span class="hljs-title class_">CompiledSubAgent</span>, create_deep_agent
custom_graph = <span class="hljs-title function_">create_agent</span>(model=..., tools=..., prompt=...)
agent = <span class="hljs-title function_">create_deep_agent</span>(
    subagents=[<span class="hljs-title class_">CompiledSubAgent</span>(
        name=<span class="hljs-string">&quot;data-analyzer&quot;</span>,
        description=<span class="hljs-string">&quot;Specialized agent for data analysis&quot;</span>,
        runnable=custom_graph
    )]
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="interrupton-Human-Approval-Control" class="common-anchor-header"><code translate="no">interrupt_on</code> (Controllo dell'approvazione umana)</h3><p>È possibile specificare alcuni strumenti che richiedono l'approvazione umana utilizzando il parametro <code translate="no">interrupt_on</code>. Quando l'agente richiama uno di questi strumenti, l'esecuzione viene messa in pausa finché una persona non lo rivede e lo approva.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_core.tools <span class="hljs-keyword">import</span> tool
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> MemorySaver
<span class="hljs-meta">@tool</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">delete_file</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Delete a file from the filesystem.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;Deleted <span class="hljs-subst">{path}</span>&quot;</span>
agent = create_deep_agent(
    tools=[delete_file],
    interrupt_on={
        <span class="hljs-string">&quot;delete_file&quot;</span>: {
            <span class="hljs-string">&quot;allowed_decisions&quot;</span>: [<span class="hljs-string">&quot;approve&quot;</span>, <span class="hljs-string">&quot;edit&quot;</span>, <span class="hljs-string">&quot;reject&quot;</span>]
        }
    },
    checkpointer=MemorySaver()
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Backend-Customization-Storage" class="common-anchor-header">Personalizzazione del backend (archiviazione)</h3><p>È possibile scegliere diversi backend di archiviazione per controllare la gestione dei file. Le opzioni attuali includono:</p>
<ul>
<li><p><strong>StateBackend</strong> (archiviazione temporanea)</p></li>
<li><p><strong>FilesystemBackend</strong> (archiviazione su disco locale)</p></li>
</ul>
<pre><code translate="no"><span class="hljs-title class_">StoreBackend</span>(persistent storage)、<span class="hljs-title class_">CompositeBackend</span>(hybrid routing)。
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> deepagents.<span class="hljs-property">backends</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">FilesystemBackend</span>
agent = <span class="hljs-title function_">create_deep_agent</span>(
    backend=<span class="hljs-title class_">FilesystemBackend</span>(root_dir=<span class="hljs-string">&quot;/path/to/project&quot;</span>)
)
<button class="copy-code-btn"></button></code></pre>
<p>Cambiando il backend, è possibile regolare il comportamento dell'archiviazione dei file senza modificare il design complessivo del sistema.</p>
<h2 id="Why-Use-Deep-Agents-with-Milvus-for-AI-Agents" class="common-anchor-header">Perché usare Deep Agents con Milvus per gli agenti AI?<button data-href="#Why-Use-Deep-Agents-with-Milvus-for-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Nelle applicazioni reali, gli agenti hanno spesso bisogno di una memoria che duri per tutte le sessioni. Ad esempio, possono aver bisogno di ricordare le preferenze dell'utente, di costruire una conoscenza del dominio nel tempo, di registrare i feedback per modificare il comportamento o di tenere traccia dei compiti di ricerca a lungo termine.</p>
<p>Per impostazione predefinita, Deep Agents utilizza <code translate="no">StateBackend</code>, che memorizza i dati solo durante una singola sessione. Quando la sessione termina, tutto viene cancellato. Ciò significa che non è in grado di supportare una memoria a lungo termine, che si estende a più sessioni.</p>
<p>Per consentire una memoria persistente, utilizziamo <a href="https://milvus.io/"><strong>Milvus</strong></a> come database vettoriale insieme a <code translate="no">StoreBackend</code>. Ecco come funziona: i contenuti importanti delle conversazioni e i risultati degli strumenti vengono convertiti in embeddings (vettori numerici che rappresentano il significato) e memorizzati in Milvus. Quando inizia un nuovo compito, l'agente esegue una ricerca semantica per recuperare i ricordi passati correlati. Ciò consente all'agente di "ricordare" le informazioni rilevanti delle sessioni precedenti.</p>
<p>Milvus è adatto a questo caso d'uso grazie alla sua architettura di separazione tra calcolo e memorizzazione. Supporta:</p>
<ul>
<li><p>scalabilità orizzontale fino a decine di miliardi di vettori</p></li>
<li><p>Interrogazioni ad alta velocità</p></li>
<li><p>Aggiornamenti dei dati in tempo reale</p></li>
<li><p>Distribuzione pronta per la produzione per sistemi su larga scala</p></li>
</ul>
<p>Tecnicamente, Deep Agents utilizza <code translate="no">CompositeBackend</code> per instradare percorsi diversi verso backend di storage diversi:</p>
<table>
<thead>
<tr><th>Percorso</th><th>Backend</th><th>Scopo</th></tr>
</thead>
<tbody>
<tr><td>/workspace/, /temp/</td><td>StatoBackend</td><td>Dati temporanei, cancellati dopo la sessione</td></tr>
<tr><td>/memoria/, /conoscenza/</td><td>StoreBackend + Milvus</td><td>Dati persistenti, ricercabili in tutte le sessioni</td></tr>
</tbody>
</table>
<p>Con questa configurazione, gli sviluppatori devono solo salvare i dati a lungo termine in percorsi come <code translate="no">/memories/</code>. Il sistema gestisce automaticamente la memoria tra le sessioni. Le fasi di configurazione dettagliate sono riportate nella sezione seguente.</p>
<h2 id="Hands-on-Build-an-AI-Agent-with-Long-Term-Memory-Using-Milvus-and-Deep-Agents" class="common-anchor-header">Pratica: Costruire un agente AI con memoria a lungo termine usando Milvus e Deep Agents<button data-href="#Hands-on-Build-an-AI-Agent-with-Long-Term-Memory-Using-Milvus-and-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Questo esempio mostra come dotare un agente basato su DeepAgents di memoria persistente utilizzando Milvus.</p>
<h3 id="Step-1-Install-dependencies" class="common-anchor-header">Passo 1: installare le dipendenze</h3><pre><code translate="no">pip install deepagents tavily-python langchain-milvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Set-up-the-memory-backend" class="common-anchor-header">Passo 2: Configurare il backend di memoria</h3><pre><code translate="no"><span class="hljs-keyword">from</span> deepagents.backends <span class="hljs-keyword">import</span> CompositeBackend, StateBackend, StoreBackend
<span class="hljs-keyword">from</span> langchain_milvus.storage <span class="hljs-keyword">import</span> MilvusStore
<span class="hljs-comment"># from langgraph.store.memory import InMemoryStore # for testing only</span>
<span class="hljs-comment"># Configure Milvus storage</span>
milvus_store = MilvusStore(
    collection_name=<span class="hljs-string">&quot;agent_memories&quot;</span>,
    embedding_service=... <span class="hljs-comment"># embedding is required here, or use MilvusStore default configuration</span>
)
backend = CompositeBackend(
    default=StateBackend(),
    routes={<span class="hljs-string">&quot;/memories/&quot;</span>: StoreBackend(store=InMemoryStore())} 
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Create-the-agent" class="common-anchor-header">Passo 3: Creare l'agente</h3><pre><code translate="no"><span class="hljs-keyword">from</span> tavily <span class="hljs-keyword">import</span> TavilyClient
<span class="hljs-keyword">import</span> os
tavily_client = TavilyClient(api_key=os.environ[<span class="hljs-string">&quot;TAVILY_API_KEY&quot;</span>])
<span class="hljs-keyword">def</span> <span class="hljs-title function_">internet_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, max_results: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Perform an internet search&quot;&quot;&quot;</span>
    results = tavily_client.search(query, max_results=max_results)
    <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n&quot;</span>.join([<span class="hljs-string">f&quot;<span class="hljs-subst">{r[<span class="hljs-string">&#x27;title&#x27;</span>]}</span>: <span class="hljs-subst">{r[<span class="hljs-string">&#x27;content&#x27;</span>]}</span>&quot;</span> <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-string">&quot;results&quot;</span>]])
agent = create_deep_agent(
    tools=[internet_search],
    system_prompt=<span class="hljs-string">&quot;You are a research expert. Write important findings to the /memories/ directory for cross-session reuse.&quot;</span>,
    backend=backend
)
<span class="hljs-comment"># Run the agent</span>
result = agent.invoke({
    <span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Research the technical features of the Milvus vector database&quot;</span>}]
})
<button class="copy-code-btn"></button></code></pre>
<p><strong>Punti chiave</strong></p>
<ul>
<li><strong>Percorso persistente</strong></li>
</ul>
<p>Tutti i file salvati in <code translate="no">/memories/</code> saranno memorizzati in modo permanente e potranno essere consultati in diverse sessioni.</p>
<ul>
<li><strong>Impostazione della produzione</strong></li>
</ul>
<p>L'esempio utilizza <code translate="no">InMemoryStore()</code> per i test. In produzione, sostituirlo con un adattatore Milvus per consentire una ricerca semantica scalabile.</p>
<ul>
<li><strong>Memoria automatica</strong></li>
</ul>
<p>L'agente salva automaticamente i risultati della ricerca e gli output importanti nella cartella <code translate="no">/memories/</code>. Nelle attività successive, può cercare e recuperare le informazioni rilevanti del passato.</p>
<h2 id="Built-in-Tools-Overview" class="common-anchor-header">Panoramica degli strumenti integrati<button data-href="#Built-in-Tools-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Deep Agents include diversi strumenti integrati, forniti tramite middleware. Essi si dividono in tre gruppi principali:</p>
<h3 id="Task-Management-TodoListMiddleware" class="common-anchor-header">Gestione delle attività (<code translate="no">TodoListMiddleware</code>)</h3><ul>
<li><code translate="no">write_todos</code></li>
</ul>
<p>Crea un elenco strutturato di cose da fare. Ogni attività può includere una descrizione, una priorità e delle dipendenze.</p>
<ul>
<li><code translate="no">read_todos</code></li>
</ul>
<p>Mostra l'elenco corrente delle cose da fare, compresi i compiti completati e quelli in sospeso.</p>
<h3 id="File-System-Tools-FilesystemMiddleware" class="common-anchor-header">Strumenti del file system (<code translate="no">FilesystemMiddleware</code>)</h3><ul>
<li><code translate="no">ls</code></li>
</ul>
<p>Elenca i file in una directory. Deve utilizzare un percorso assoluto (che inizia con <code translate="no">/</code>).</p>
<ul>
<li><code translate="no">read_file</code></li>
</ul>
<p>Legge il contenuto dei file. Supporta <code translate="no">offset</code> e <code translate="no">limit</code> per i file di grandi dimensioni.</p>
<ul>
<li><code translate="no">write_file</code></li>
</ul>
<p>Crea o sovrascrive un file.</p>
<ul>
<li><code translate="no">edit_file</code></li>
</ul>
<p>Sostituisce un testo specifico all'interno di un file.</p>
<ul>
<li><code translate="no">glob</code></li>
</ul>
<p>Trova i file usando degli schemi, come <code translate="no">**/*.py</code> per cercare tutti i file Python.</p>
<ul>
<li><code translate="no">grep</code></li>
</ul>
<p>Cerca il testo all'interno dei file.</p>
<ul>
<li><code translate="no">execute</code></li>
</ul>
<p>Esegue comandi di shell in un ambiente sandbox. Richiede che il backend supporti <code translate="no">SandboxBackendProtocol</code>.</p>
<h3 id="Sub-agent-Delegation-SubAgentMiddleware" class="common-anchor-header">Delegazione di subagenti (<code translate="no">SubAgentMiddleware</code>)</h3><ul>
<li><code translate="no">task</code></li>
</ul>
<p>Invia un sottocompito a un sottoagente specifico. L'utente fornisce il nome del subagente e la descrizione del compito.</p>
<h3 id="How-Tool-Outputs-Are-Handled" class="common-anchor-header">Come vengono gestiti gli output degli strumenti</h3><p>Se uno strumento genera un risultato di grandi dimensioni, Deep Agents lo salva automaticamente in un file.</p>
<p>Ad esempio, se <code translate="no">internet_search</code> restituisce 100 KB di contenuto, il sistema lo salva in un file del tipo <code translate="no">/tool_results/internet_search_1.txt</code>. L'agente conserva solo il percorso del file nel suo contesto. In questo modo si riduce l'uso dei token e si mantiene piccola la finestra del contesto.</p>
<h2 id="DeepAgents-vs-Agent-Builder-When-Should-You-Use-Each" class="common-anchor-header">DeepAgents vs. Agent Builder: Quando utilizzare ciascuno di essi?<button data-href="#DeepAgents-vs-Agent-Builder-When-Should-You-Use-Each" class="anchor-icon" translate="no">
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
    </button></h2><p><em>Poiché questo articolo si concentra su DeepAgents, è utile capire anche come si confronta con</em> <a href="https://www.langchain.com/langsmith/agent-builder"><em>Agent Builder</em></a><em>, un'altra opzione di costruzione di agenti nell'ecosistema LangChain.</em></p>
<p>LangChain offre diversi modi per costruire agenti di intelligenza artificiale e la scelta migliore di solito dipende da quanto controllo si vuole avere sul sistema.</p>
<p><strong>DeepAgents</strong> è progettato per la creazione di agenti autonomi che gestiscono compiti di lunga durata e in più fasi. Offre agli sviluppatori il pieno controllo su come l'agente pianifica i compiti, utilizza gli strumenti e gestisce la memoria. Essendo costruito su LangGraph, è possibile personalizzare i componenti, integrare strumenti Python e modificare il backend di memorizzazione. Questo rende DeepAgents adatto a flussi di lavoro complessi e a sistemi di produzione in cui affidabilità e flessibilità sono importanti.</p>
<p><strong>Agent Builder</strong>, invece, si concentra sulla facilità d'uso. Nasconde la maggior parte dei dettagli tecnici, in modo da poter descrivere un agente, aggiungere strumenti ed eseguirlo rapidamente. La memoria, l'uso degli strumenti e le fasi di approvazione umana sono gestite automaticamente. Questo rende Agent Builder utile per prototipi rapidi, strumenti interni o primi esperimenti.</p>
<p><strong>Agent Builder e DeepAgents non sono sistemi separati: fanno parte dello stesso stack.</strong> Agent Builder si basa su DeepAgents. Molti team iniziano con Agent Builder per testare le idee, poi passano a DeepAgents quando hanno bisogno di maggiore controllo. I flussi di lavoro creati con DeepAgents possono anche essere trasformati in modelli di Agent Builder, in modo che altri possano riutilizzarli facilmente.</p>
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
    </button></h2><p>Deep Agents semplifica la gestione dei flussi di lavoro complessi degli agenti utilizzando tre idee principali: la pianificazione delle attività, l'archiviazione dei file e la delega ai subagenti. Questi meccanismi trasformano processi disordinati e multi-fase in flussi di lavoro strutturati. Se combinato con Milvus per la ricerca vettoriale, l'agente può anche mantenere la memoria a lungo termine tra le sessioni.</p>
<p>Per gli sviluppatori, questo significa costi inferiori per i token e un sistema più affidabile che può scalare da una semplice demo a un ambiente di produzione.</p>
<p>Se state costruendo agenti di intelligenza artificiale che necessitano di flussi di lavoro strutturati e di una vera memoria a lungo termine, saremo lieti di entrare in contatto con voi.</p>
<p>Avete domande su Deep Agents o sull'uso di Milvus come backend di memoria persistente? Unitevi al nostro <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canale Slack</a> o prenotate una sessione <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> di 20 minuti per discutere il vostro caso d'uso.</p>
