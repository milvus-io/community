---
id: how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md
title: Come costruire sistemi multi-agente pronti per la produzione con Agno e Milvus
author: Min Yin
date: 2026-02-10T00:00:00.000Z
cover: assets.zilliz.com/cover_b5fc8a3c48.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  production-ready multi-agent systems, Agno framework, Milvus vector database,
  AgentOS deployment, LLM agent architecture
meta_title: |
  How to Build Production-Ready Multi-Agent Systems with Agno and Milvus
desc: >-
  Imparate a costruire, distribuire e scalare sistemi multi-agente pronti per la
  produzione utilizzando Agno, AgentOS e Milvus per carichi di lavoro reali.
origin: >-
  https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md
---
<p>Se state costruendo agenti di intelligenza artificiale, probabilmente vi siete scontrati con questo muro: la vostra demo funziona benissimo, ma portarla in produzione è tutta un'altra storia.</p>
<p>Abbiamo trattato la gestione della memoria degli agenti e il reranking nei post precedenti. Ora affrontiamo la sfida più grande: costruire agenti che reggano davvero in produzione.</p>
<p>La realtà è che gli ambienti di produzione sono disordinati. Un singolo agente raramente è sufficiente, ed è per questo che i sistemi multiagente sono ovunque. Ma i framework disponibili oggi tendono a dividersi in due campi: quelli leggeri che funzionano bene ma si rompono sotto carico reale, o quelli potenti che richiedono un'eternità per essere appresi e costruiti.</p>
<p>Di recente ho sperimentato <a href="https://github.com/agno-agi/agno">Agno</a>, che sembra trovare una ragionevole via di mezzo, concentrandosi sulla prontezza di produzione senza eccessiva complessità. Il progetto ha guadagnato oltre 37.000 stelle su GitHub in pochi mesi, il che suggerisce che anche altri sviluppatori lo trovano utile.</p>
<p>In questo post, condividerò ciò che ho imparato costruendo un sistema multi-agente utilizzando Agno con <a href="https://milvus.io/">Milvus</a> come livello di memoria. Vedremo come Agno si confronta con alternative come LangGraph e vedremo un'implementazione completa che potrete provare voi stessi.</p>
<h2 id="What-Is-Agno" class="common-anchor-header">Che cos'è Agno?<button data-href="#What-Is-Agno" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/agno-agi/agno">Agno</a> è un framework multi-agente costruito appositamente per l'uso in produzione. Ha due livelli distinti:</p>
<ul>
<li><p><strong>Livello del framework Agno</strong>: Dove si definisce la logica dell'agente</p></li>
<li><p><strong>Livello di runtime AgentOS</strong>: Trasforma questa logica in servizi HTTP che si possono effettivamente distribuire.</p></li>
</ul>
<p>Il livello framework definisce <em>ciò che</em> gli agenti devono fare, mentre AgentOS gestisce <em>il modo in cui</em> il lavoro viene eseguito e servito.</p>
<h3 id="The-Framework-Layer" class="common-anchor-header">Il livello di struttura</h3><p>È quello con cui si lavora direttamente. Introduce tre concetti fondamentali:</p>
<ul>
<li><p><strong>Agente</strong>: gestisce un tipo specifico di attività</p></li>
<li><p><strong>Team</strong>: Coordina più agenti per risolvere problemi complessi</p></li>
<li><p><strong>Flusso di lavoro</strong>: Definisce l'ordine di esecuzione e la struttura</p></li>
</ul>
<p>Una cosa che ho apprezzato: non è necessario imparare un nuovo DSL o disegnare diagrammi di flusso. Il comportamento dell'agente è definito utilizzando chiamate di funzione Python standard. Il framework gestisce l'invocazione di LLM, l'esecuzione degli strumenti e la gestione della memoria.</p>
<h3 id="The-AgentOS-Runtime-Layer" class="common-anchor-header">Il livello di runtime di AgentOS</h3><p>AgentOS è progettato per volumi elevati di richieste attraverso l'esecuzione asincrona e la sua architettura stateless rende semplice la scalabilità.</p>
<p>Le caratteristiche principali includono:</p>
<ul>
<li><p>Integrazione FastAPI integrata per esporre gli agenti come endpoint HTTP.</p></li>
<li><p>Gestione delle sessioni e risposte in streaming</p></li>
<li><p>Endpoint di monitoraggio</p></li>
<li><p>Supporto per lo scaling orizzontale</p></li>
</ul>
<p>In pratica, AgentOS gestisce la maggior parte dell'infrastruttura, consentendo di concentrarsi sulla logica dell'agente.</p>
<p>Di seguito è riportata una vista di alto livello dell'architettura di Agno.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_dfbf444ee6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Agno-vs-LangGraph" class="common-anchor-header">Agno vs LangGraph<button data-href="#Agno-vs-LangGraph" class="anchor-icon" translate="no">
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
    </button></h2><p>Per capire dove si colloca Agno, facciamo un confronto con LangGraph, uno dei framework multi-agente più diffusi.</p>
<p><a href="https://www.langchain.com/langgraph"><strong>LangGraph</strong></a> utilizza una macchina a stati basata su grafi. L'intero flusso di lavoro dell'agente viene modellato come un grafo: i passi sono nodi, i percorsi di esecuzione sono bordi. Questo funziona bene quando il processo è fisso e strettamente ordinato. Ma per gli scenari aperti o di conversazione, può risultare restrittivo. Quando le interazioni diventano più dinamiche, mantenere un grafo pulito diventa più difficile.</p>
<p><strong>Agno</strong> adotta un approccio diverso. Invece di essere un puro livello di orchestrazione, è un sistema end-to-end. Definite il comportamento dell'agente e AgentOS lo espone automaticamente come servizio HTTP pronto per la produzione, con monitoraggio, scalabilità e supporto per le conversazioni a più turni. Nessun gateway API separato, nessuna gestione personalizzata delle sessioni, nessuno strumento operativo aggiuntivo.</p>
<p>Ecco un rapido confronto:</p>
<table>
<thead>
<tr><th>Dimensione</th><th>LangGraph</th><th>Agno</th></tr>
</thead>
<tbody>
<tr><td>Modello di orchestrazione</td><td>Definizione esplicita del grafo tramite nodi e bordi</td><td>Flussi di lavoro dichiarativi definiti in Python</td></tr>
<tr><td>Gestione degli stati</td><td>Classi di stato personalizzate definite e gestite dagli sviluppatori</td><td>Sistema di memoria incorporato</td></tr>
<tr><td>Debug e osservabilità</td><td>LangSmith (a pagamento)</td><td>AgentOS UI (open source)</td></tr>
<tr><td>Modello di runtime</td><td>Integrato in un runtime esistente</td><td>Servizio autonomo basato su FastAPI</td></tr>
<tr><td>Complessità di distribuzione</td><td>Richiede una configurazione aggiuntiva tramite LangServe</td><td>Funziona già dalla scatola</td></tr>
</tbody>
</table>
<p>LangGraph offre maggiore flessibilità e controllo a grana fine. Agno ottimizza il time-to-production. La scelta giusta dipende dalla fase del progetto, dall'infrastruttura esistente e dal livello di personalizzazione necessario. Se non si è sicuri, eseguire un piccolo proof of concept con entrambi è probabilmente il modo più affidabile per decidere.</p>
<h2 id="Choosing-Milvus-for-the-Agent-Memory-Layer" class="common-anchor-header">Scegliere Milvus per il livello di memoria dell'agente<button data-href="#Choosing-Milvus-for-the-Agent-Memory-Layer" class="anchor-icon" translate="no">
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
    </button></h2><p>Una volta scelto il framework, la decisione successiva è come memorizzare la memoria e la conoscenza. Per questo usiamo Milvus. <a href="https://milvus.io/">Milvus</a> è il più popolare database vettoriale open-source costruito per i carichi di lavoro dell'intelligenza artificiale, con oltre <a href="https://github.com/milvus-io/milvus">42.000</a> stelle <a href="https://github.com/milvus-io/milvus">su GitHub</a>.</p>
<p><strong>Agno ha un supporto nativo per Milvus.</strong> Il modulo <code translate="no">agno.vectordb.milvus</code> racchiude funzionalità di produzione come la gestione delle connessioni, i tentativi automatici, le scritture in batch e la generazione di embedding. Non è necessario creare pool di connessioni o gestire da soli i guasti della rete: poche righe di Python forniscono un livello di memoria vettoriale funzionante.</p>
<p><strong>Milvus si adatta alle vostre esigenze.</strong> Supporta tre <a href="https://milvus.io/docs/install-overview.md">modalità di distribuzione:</a></p>
<ul>
<li><p><strong>Milvus Lite</strong>: Leggero, basato su file, ottimo per lo sviluppo e i test locali.</p></li>
<li><p><strong>Standalone</strong>: Distribuzione a server singolo per carichi di lavoro di produzione</p></li>
<li><p><strong>Distribuito</strong>: Cluster completo per scenari su larga scala</p></li>
</ul>
<p>È possibile iniziare con Milvus Lite per convalidare la memoria dell'agente a livello locale, quindi passare allo standalone o al distribuito man mano che il traffico cresce, senza modificare il codice dell'applicazione. Questa flessibilità è particolarmente utile quando si sta iterando rapidamente nelle fasi iniziali, ma si ha bisogno di un percorso chiaro per scalare in seguito.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_1_1en_e0294d0ffa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Step-by-Step-Building-a-Production-Ready-Agno-Agent-with-Milvus" class="common-anchor-header">Passo dopo passo: Creare un agente Agno pronto per la produzione con Milvus<button data-href="#Step-by-Step-Building-a-Production-Ready-Agno-Agent-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Costruiamo da zero un agente pronto per la produzione.</p>
<p>Inizieremo con un semplice esempio di agente singolo per mostrare il flusso di lavoro completo. Poi lo espanderemo in un sistema multi-agente. AgentOS confezionerà automaticamente tutto come servizio HTTP richiamabile.</p>
<h3 id="1-Deploying-Milvus-Standalone-with-Docker" class="common-anchor-header">1. Distribuzione di Milvus Standalone con Docker</h3><p><strong>(1) Scaricare i file di distribuzione</strong></p>
<pre><code translate="no">**wget** **
&lt;https://github.com/Milvus-io/Milvus/releases/download/v2.****5****.****12****/Milvus-standalone-docker-compose.yml&gt; -O docker-compose.yml**
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Avviare il servizio Milvus</strong></p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_80575354d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Core-Implementation" class="common-anchor-header">2. Implementazione del nucleo</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">from</span> pathlib <span class="hljs-keyword">import</span> Path
<span class="hljs-keyword">from</span> agno.os <span class="hljs-keyword">import</span> AgentOS
<span class="hljs-keyword">from</span> agno.agent <span class="hljs-keyword">import</span> Agent
<span class="hljs-keyword">from</span> agno.models.openai <span class="hljs-keyword">import</span> OpenAIChat
<span class="hljs-keyword">from</span> agno.knowledge.knowledge <span class="hljs-keyword">import</span> Knowledge
<span class="hljs-keyword">from</span> agno.vectordb.milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> agno.knowledge.embedder.openai <span class="hljs-keyword">import</span> OpenAIEmbedder
<span class="hljs-keyword">from</span> agno.db.sqlite <span class="hljs-keyword">import</span> SqliteDb
os.environ\[<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>\] = <span class="hljs-string">&quot;you-key-here&quot;</span>
data_dir = Path(<span class="hljs-string">&quot;./data&quot;</span>)
data_dir.mkdir(exist_ok=<span class="hljs-literal">True</span>)
knowledge_base = Knowledge(
    contents_db=SqliteDb(
        db_file=<span class="hljs-built_in">str</span>(data_dir / <span class="hljs-string">&quot;knowledge_contents.db&quot;</span>),
        knowledge_table=<span class="hljs-string">&quot;knowledge_contents&quot;</span>,
    ),
    vector_db=Milvus(
        collection=<span class="hljs-string">&quot;agno_knowledge&quot;</span>,
        uri=<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>,
        embedder=OpenAIEmbedder(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>),
    ),
)
*<span class="hljs-comment"># Create Agent*</span>
agent = Agent(
    name=<span class="hljs-string">&quot;Knowledge Assistant&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    instructions=\[
        <span class="hljs-string">&quot;You are a knowledge base assistant that helps users query and manage knowledge base content.&quot;</span>,
        <span class="hljs-string">&quot;Answer questions in English.&quot;</span>,
        <span class="hljs-string">&quot;Always search the knowledge base before answering questions.&quot;</span>,
        <span class="hljs-string">&quot;If the knowledge base is empty, kindly prompt the user to upload documents.&quot;</span>
    \],
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    db=SqliteDb(
        db_file=<span class="hljs-built_in">str</span>(data_dir / <span class="hljs-string">&quot;agent.db&quot;</span>),
        session_table=<span class="hljs-string">&quot;agent_sessions&quot;</span>,
    ),
    add_history_to_context=<span class="hljs-literal">True</span>,
    markdown=<span class="hljs-literal">True</span>,
)
agent_os = AgentOS(agents=\[agent\])
app = agent_os.get_app()
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n🚀 Starting service...&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📍 http://localhost:7777&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;💡 Please upload documents to the knowledge base in the UI\n&quot;</span>)
    agent_os.serve(app=<span class="hljs-string">&quot;knowledge_agent:app&quot;</span>, port=<span class="hljs-number">7777</span>, reload=<span class="hljs-literal">False</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>(1) Esecuzione dell'agente</strong></p>
<pre><code translate="no">**python** **knowledge_agent.py**
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_df885706cf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Connecting-to-the-AgentOS-Console" class="common-anchor-header">3. Connessione alla console AgentOS</h3><p>https://os.agno.com/</p>
<p><strong>(1) Creare un account e accedere</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_db0af51e58.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(2) Collegare l'agente ad AgentOS</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_0a8c6f9436.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(3) Configurare la porta esposta e il nome dell'agente</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_3844011799.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(4) Aggiungere documenti e indicizzarli in Milvus</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_776ea7ca11.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_90b97c4660.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_a98262d8c5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_58b7d77eea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(5) Testare l'agente end-to-end</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_6e61038ba5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>In questa configurazione, Milvus gestisce il recupero semantico ad alte prestazioni. Quando l'assistente della base di conoscenza riceve una domanda tecnica, richiama lo strumento <code translate="no">search_knowledge</code> per incorporare la domanda, recupera i pezzi di documento più rilevanti da Milvus e utilizza questi risultati come base per la sua risposta.</p>
<p>Milvus offre tre opzioni di implementazione, che consentono di scegliere l'architettura più adatta alle proprie esigenze operative, mantenendo le API a livello di applicazione coerenti in tutte le modalità di implementazione.</p>
<p>La demo qui sopra mostra il flusso principale di recupero e generazione. Per trasferire questo progetto in un ambiente di produzione, tuttavia, è necessario approfondire alcuni aspetti architettonici.</p>
<h2 id="How-Retrieval-Results-Are-Shared-Across-Agents" class="common-anchor-header">Come i risultati del reperimento vengono condivisi tra gli agenti<button data-href="#How-Retrieval-Results-Are-Shared-Across-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>La modalità Team di Agno ha un'opzione <code translate="no">share_member_interactions=True</code> che consente agli agenti successivi di ereditare l'intera cronologia delle interazioni degli agenti precedenti. In pratica, ciò significa che quando il primo agente recupera informazioni da Milvus, gli agenti successivi possono riutilizzare quei risultati invece di eseguire nuovamente la stessa ricerca.</p>
<ul>
<li><p><strong>Il vantaggio:</strong> I costi di ricerca vengono ammortizzati tra i membri del team. Una ricerca vettoriale supporta più agenti, riducendo le query ridondanti.</p></li>
<li><p><strong>Il lato negativo:</strong> La qualità del recupero viene amplificata. Se la ricerca iniziale restituisce risultati incompleti o imprecisi, l'errore si propaga a tutti gli agenti che dipendono da essa.</p></li>
</ul>
<p>Ecco perché l'accuratezza del reperimento è ancora più importante nei sistemi multiagente. Un cattivo reperimento non degrada solo la risposta di un agente, ma si ripercuote sull'intero team.</p>
<p>Ecco un esempio di configurazione del team:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> agno.team <span class="hljs-keyword">import</span> Team
analyst = Agent(
    name=<span class="hljs-string">&quot;Data Analyst&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    instructions=\[<span class="hljs-string">&quot;Analyze data and extract key metrics&quot;</span>\]
)
writer = Agent(
    name=<span class="hljs-string">&quot;Report Writer&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    instructions=\[<span class="hljs-string">&quot;Write reports based on the analysis results&quot;</span>\]
)
team = Team(
    agents=\[analyst, writer\],
    share_member_interactions=<span class="hljs-literal">True</span>,  *<span class="hljs-comment"># Share knowledge retrieval results*</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Why-Agno-and-Milvus-Are-Layered-Separately" class="common-anchor-header">Perché Agno e Milvus sono stratificati separatamente<button data-href="#Why-Agno-and-Milvus-Are-Layered-Separately" class="anchor-icon" translate="no">
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
    </button></h2><p>In questa architettura, <strong>Agno</strong> si trova al livello di conversazione e orchestrazione. È responsabile della gestione del flusso di dialogo, del coordinamento degli agenti e del mantenimento dello stato delle conversazioni, con la cronologia delle sessioni memorizzata in un database relazionale. La conoscenza effettiva del dominio del sistema, come la documentazione del prodotto e i rapporti tecnici, viene gestita separatamente e memorizzata come embeddings vettoriali in <strong>Milvus</strong>. Questa chiara divisione mantiene la logica di conversazione e l'archiviazione della conoscenza completamente disaccoppiate.</p>
<p>Perché questo è importante dal punto di vista operativo:</p>
<ul>
<li><p><strong>Scalabilità indipendente</strong>: Quando la domanda di Agno cresce, si aggiungono altre istanze Agno. Quando il volume delle interrogazioni cresce, si espande Milvus aggiungendo nodi di interrogazione. Ogni livello scala in modo isolato.</p></li>
<li><p><strong>Esigenze hardware diverse</strong>: Agno è legato alla CPU e alla memoria (inferenza LLM, esecuzione del flusso di lavoro). Milvus è ottimizzato per il recupero vettoriale ad alta velocità (I/O su disco, talvolta accelerazione GPU). La loro separazione evita la contesa delle risorse.</p></li>
<li><p><strong>Ottimizzazione dei costi</strong>: È possibile sintonizzare e allocare le risorse per ogni livello in modo indipendente.</p></li>
</ul>
<p>Questo approccio a strati consente di ottenere un'architettura più efficiente, resiliente e pronta per la produzione.</p>
<h2 id="What-to-Monitor-When-Using-Agno-with-Milvus" class="common-anchor-header">Cosa monitorare quando si utilizza Agno con Milvus<button data-href="#What-to-Monitor-When-Using-Agno-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Agno dispone di funzionalità di valutazione integrate, ma l'aggiunta di Milvus amplia gli aspetti da tenere sotto controllo. In base alla nostra esperienza, è bene concentrarsi su tre aree:</p>
<ul>
<li><p><strong>Qualità del recupero</strong>: I documenti restituiti da Milvus sono effettivamente rilevanti per la query o solo superficialmente simili a livello vettoriale?</p></li>
<li><p><strong>Fedeltà della risposta</strong>: La risposta finale è basata sul contenuto recuperato o l'LLM genera affermazioni non supportate?</p></li>
<li><p><strong>Analisi della latenza end-to-end</strong>: Non limitatevi a tenere traccia del tempo di risposta totale. Suddividetelo per fasi - generazione dell'embedding, ricerca del vettore, assemblaggio del contesto, inferenza dell'LLM - in modo da poter identificare i punti in cui si verificano i rallentamenti.</p></li>
</ul>
<p><strong>Un esempio pratico:</strong> Quando la vostra collezione Milvus passa da 1 milione a 10 milioni di vettori, potreste notare un aumento della latenza di recupero. Questo di solito è un segnale per mettere a punto i parametri dell'indice (come <code translate="no">nlist</code> e <code translate="no">nprobe</code>) o per considerare la possibilità di passare da un'implementazione standalone a una distribuita.</p>
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
    </button></h2><p>Per costruire sistemi di agenti pronti per la produzione non basta mettere insieme chiamate LLM e demo di recupero. Servono confini architettonici chiari, infrastrutture che scalino in modo indipendente e osservabilità per individuare tempestivamente i problemi.</p>
<p>In questo post ho illustrato come Agno e Milvus possono lavorare insieme: Agno per l'orchestrazione multi-agente, Milvus per la memoria scalabile e il recupero semantico. Mantenendo questi livelli separati, è possibile passare dal prototipo alla produzione senza riscrivere la logica di base e scalare ogni componente secondo le necessità.</p>
<p>Se state sperimentando configurazioni simili, sarei curioso di sapere cosa funziona per voi.</p>
<p><strong>Domande su Milvus?</strong> Iscrivetevi al nostro <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canale Slack</a> o prenotate una sessione di 20 minuti di <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>.</p>
