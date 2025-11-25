---
id: >-
  openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md
title: >-
  OpenAgents x Milvus: come costruire sistemi multi-agente più intelligenti che
  condividono la memoria
author: Min Yin
date: 2025-11-24T00:00:00.000Z
cover: assets.zilliz.com/openagents_cover_b60b987944.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'multi-agent, Milvus, vector database, distributed AI architecture, OpenAgents'
meta_title: Build Smarter Multi-Agent Systems with OpenAgents and Milvus
desc: >-
  Scoprite come OpenAgents consente la collaborazione distribuita tra più
  agenti, perché Milvus è essenziale per aggiungere memoria scalabile e come
  costruire un sistema completo.
origin: >-
  https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md
---
<p>La maggior parte degli sviluppatori inizia i propri sistemi agenziali con un singolo agente e solo in seguito si rende conto di aver costruito un chatbot molto costoso. Per compiti semplici, un agente in stile ReAct funziona bene, ma incontra rapidamente dei limiti: non può eseguire passi in parallelo, perde la traccia di lunghe catene di ragionamento e tende a crollare quando si aggiungono troppi strumenti al mix. Le configurazioni multi-agente promettono di risolvere questo problema, ma portano con sé i loro problemi: overhead di coordinamento, passaggi di consegne fragili e un contesto condiviso in crescita che erode silenziosamente la qualità del modello.</p>
<p><a href="https://github.com/OpenAgentsInc">OpenAgents</a> è un framework open-source per la costruzione di sistemi multi-agente in cui gli agenti di intelligenza artificiale lavorano insieme, condividono le risorse e affrontano progetti a lungo termine all'interno di comunità persistenti. Invece di un singolo orchestratore centrale, OpenAgents consente agli agenti di collaborare in modo più distribuito: possono scoprirsi a vicenda, comunicare e coordinarsi intorno a obiettivi condivisi.</p>
<p>In combinazione con il database vettoriale <a href="https://milvus.io/">Milvus</a>, questa pipeline ottiene un livello di memoria a lungo termine scalabile e ad alte prestazioni. Milvus alimenta la memoria degli agenti con una ricerca semantica veloce, scelte di indicizzazione flessibili come HNSW e IVF, e un isolamento pulito attraverso il partizionamento, in modo che gli agenti possano memorizzare, recuperare e riutilizzare la conoscenza senza annegare nel contesto o calpestare i dati degli altri.</p>
<p>In questo post spiegheremo come OpenAgents consente la collaborazione distribuita tra più agenti, perché Milvus è una base fondamentale per la memoria scalabile degli agenti e come assemblare un sistema del genere passo dopo passo.</p>
<h2 id="Challenges-in-Building-Real-World-Agent-Systems" class="common-anchor-header">Sfide nella costruzione di sistemi ad agenti del mondo reale<button data-href="#Challenges-in-Building-Real-World-Agent-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>Molti framework di agenti mainstream oggi - LangChain, AutoGen, CrewAI e altri - sono costruiti attorno a un modello <strong>incentrato sui compiti</strong>. Si crea una serie di agenti, si assegna loro un lavoro, magari definendo un flusso di lavoro, e li si lascia funzionare. Questo modello funziona bene per casi d'uso limitati o di breve durata, ma negli ambienti di produzione reali espone tre limiti strutturali:</p>
<ul>
<li><p><strong>La conoscenza rimane isolata.</strong> L'esperienza di un agente è confinata al proprio impiego. Un agente di revisione del codice in ingegneria non condivide ciò che impara con un agente del team di prodotto che valuta la fattibilità. Ogni team finisce per ricostruire la conoscenza da zero, il che è inefficiente e fragile.</p></li>
<li><p><strong>La collaborazione è rigida.</strong> Anche nei framework multi-agente, la cooperazione dipende solitamente da flussi di lavoro definiti in anticipo. Quando la collaborazione deve cambiare, queste regole statiche non possono adattarsi, rendendo l'intero sistema meno flessibile.</p></li>
<li><p><strong>Mancanza di uno stato persistente.</strong> La maggior parte degli agenti segue un ciclo di vita semplice: <em>avvio → esecuzione → chiusura.</em> Tra un'esecuzione e l'altra dimenticano tutto: contesto, relazioni, decisioni prese e storia delle interazioni. Senza uno stato persistente, gli agenti non possono costruire una memoria a lungo termine o evolvere il loro comportamento.</p></li>
</ul>
<p>Questi problemi strutturali derivano dal fatto che gli agenti vengono trattati come esecutori di compiti isolati piuttosto che come partecipanti a una rete collaborativa più ampia.</p>
<p>Il team di OpenAgents ritiene che i futuri sistemi di agenti abbiano bisogno di qualcosa di più di un ragionamento più forte: hanno bisogno di un meccanismo che permetta agli agenti di scoprirsi l'un l'altro, di costruire relazioni, di condividere conoscenze e di lavorare insieme in modo dinamico. E, cosa fondamentale, questo non dovrebbe dipendere da un singolo controllore centrale. Internet funziona perché è distribuito: nessun singolo nodo comanda tutto, e il sistema diventa più robusto e scalabile man mano che cresce. I sistemi multi-agente beneficiano dello stesso principio di progettazione. Ecco perché OpenAgents elimina l'idea di un orchestratore onnipotente e consente invece una cooperazione decentralizzata e guidata dalla rete.</p>
<h2 id="What’s-OpenAgents" class="common-anchor-header">Cos'è OpenAgents?<button data-href="#What’s-OpenAgents" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAgents è un framework open-source per la creazione di reti di agenti di intelligenza artificiale che consente una collaborazione aperta, in cui gli agenti di intelligenza artificiale lavorano insieme, condividono le risorse e affrontano progetti a lungo termine. Fornisce l'infrastruttura per un'internet degli agenti, dove gli agenti collaborano apertamente con milioni di altri agenti in comunità persistenti e in crescita. A livello tecnico, il sistema è strutturato attorno a tre componenti fondamentali: <strong>Rete di agenti, Mods di rete e Trasporti.</strong></p>
<h3 id="1-Agent-Network-A-Shared-Environment-for-Collaboration" class="common-anchor-header">1. Rete di agenti: Un ambiente condiviso per la collaborazione</h3><p>Una rete di agenti è un ambiente condiviso in cui più agenti possono connettersi, comunicare e lavorare insieme per risolvere compiti complessi. Le sue caratteristiche principali sono:</p>
<ul>
<li><p><strong>Funzionamento persistente:</strong> Una volta creata, la rete rimane online indipendentemente da ogni singola attività o flusso di lavoro.</p></li>
<li><p><strong>Agente dinamico:</strong> Gli agenti possono unirsi in qualsiasi momento utilizzando un ID di rete; non è necessaria una pre-registrazione.</p></li>
<li><p><strong>Supporto multiprotocollo:</strong> Un livello di astrazione unificato supporta la comunicazione tramite WebSocket, gRPC, HTTP e libp2p.</p></li>
<li><p><strong>Configurazione autonoma:</strong> Ogni rete mantiene i propri permessi, la propria governance e le proprie risorse.</p></li>
</ul>
<p>Con una sola riga di codice, è possibile creare una rete e qualsiasi agente può unirsi immediatamente attraverso interfacce standard.</p>
<h3 id="2-Network-Mods-Pluggable-Extensions-for-Collaboration" class="common-anchor-header">2. Mods di rete: Estensioni collegabili per la collaborazione</h3><p>I Mods forniscono un livello modulare di funzioni di collaborazione che rimangono disaccoppiate dal sistema principale. È possibile combinare i moduli in base alle proprie esigenze specifiche, consentendo modelli di collaborazione personalizzati per ogni caso d'uso.</p>
<table>
<thead>
<tr><th><strong>Mod</strong></th><th><strong>Scopo</strong></th><th><strong>Casi d'uso</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Messaggistica dello spazio di lavoro</strong></td><td>Comunicazione di messaggi in tempo reale</td><td>Risposte in streaming, feedback istantaneo</td></tr>
<tr><td><strong>Forum</strong></td><td>Discussione asincrona</td><td>Revisioni di proposte, delibere a più riprese</td></tr>
<tr><td><strong>Wiki</strong></td><td>Base di conoscenza condivisa</td><td>Consolidamento della conoscenza, collaborazione documentale</td></tr>
<tr><td><strong>Sociale</strong></td><td>Grafo delle relazioni</td><td>Routing di esperti, reti di fiducia</td></tr>
</tbody>
</table>
<p>Tutti i moduli operano su un sistema di eventi unificato, che consente di estendere facilmente il framework o di introdurre comportamenti personalizzati quando necessario.</p>
<h3 id="3-Transports-A-Protocol-Agnostic-Channel-for-Communication" class="common-anchor-header">3. Trasporti: Un canale di comunicazione indipendente dal protocollo</h3><p>I trasporti sono i protocolli di comunicazione che consentono agli agenti eterogenei di connettersi e scambiare messaggi all'interno di una rete OpenAgents. OpenAgents supporta diversi protocolli di trasporto che possono essere eseguiti contemporaneamente all'interno della stessa rete, tra cui:</p>
<ul>
<li><p><strong>HTTP/REST</strong> per un'integrazione ampia e multilingue</p></li>
<li><p><strong>WebSocket</strong> per una comunicazione bidirezionale a bassa latenza</p></li>
<li><p><strong>gRPC</strong> per RPC ad alte prestazioni adatto a cluster su larga scala</p></li>
<li><p><strong>libp2p</strong> per una rete decentralizzata e peer-to-peer</p></li>
<li><p><strong>A2A</strong>, un protocollo emergente progettato specificamente per la comunicazione tra agenti.</p></li>
</ul>
<p>Tutti i trasporti funzionano attraverso un formato di messaggio unificato basato sugli eventi, che consente la traduzione senza soluzione di continuità tra i protocolli. Non è necessario preoccuparsi del protocollo utilizzato da un agente peer: il framework lo gestisce automaticamente. Gli agenti costruiti in qualsiasi linguaggio o framework possono unirsi a una rete OpenAgents senza dover riscrivere il codice esistente.</p>
<h2 id="Integrating-OpenAgents-with-Milvus-for-Long-Term-Agentic-Memory" class="common-anchor-header">Integrazione di OpenAgents con Milvus per una memoria agenziale a lungo termine<button data-href="#Integrating-OpenAgents-with-Milvus-for-Long-Term-Agentic-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAgents risolve la sfida di come gli agenti <strong>comunicano, si scoprono a vicenda e collaborano, ma la</strong>collaborazione da sola non basta. Gli agenti generano intuizioni, decisioni, cronologia delle conversazioni, risultati degli strumenti e conoscenze specifiche del dominio. Senza un livello di memoria persistente, tutto questo evapora nel momento in cui un agente si spegne.</p>
<p>È qui che <strong>Milvus</strong> diventa essenziale. Milvus fornisce la memorizzazione vettoriale ad alte prestazioni e il recupero semantico necessari per trasformare le interazioni degli agenti in una memoria durevole e riutilizzabile. Integrato nella rete OpenAgents, offre tre vantaggi principali:</p>
<h4 id="1-Semantic-Search" class="common-anchor-header"><strong>1. Ricerca semantica</strong></h4><p>Milvus offre una ricerca semantica veloce utilizzando algoritmi di indicizzazione come HNSW e IVF_FLAT. Gli agenti possono recuperare i record storici più rilevanti in base al significato piuttosto che alle parole chiave, consentendo loro di:</p>
<ul>
<li><p>ricordare decisioni o piani precedenti</p></li>
<li><p>evitare di ripetere il lavoro,</p></li>
<li><p>mantenere un contesto a lungo termine tra le sessioni.</p></li>
</ul>
<p>Questa è la spina dorsale della <em>memoria agenziale</em>: recupero veloce, pertinente e contestuale.</p>
<h4 id="2-Billion-Scale-Horizontal-Scalability" class="common-anchor-header"><strong>2. Scalabilità orizzontale su scala miliardaria</strong></h4><p>Le reti di agenti reali generano enormi quantità di dati. Milvus è costruito per operare comodamente su questa scala, offrendo:</p>
<ul>
<li><p>memorizzazione e ricerca su miliardi di vettori,</p></li>
<li><p>latenza &lt; 30 ms anche in caso di recupero Top-K ad alta velocità,</p></li>
<li><p>un'architettura completamente distribuita che scala linearmente al crescere della domanda.</p></li>
</ul>
<p>Che si tratti di una dozzina di agenti o di migliaia che lavorano in parallelo, Milvus mantiene il reperimento veloce e coerente.</p>
<h4 id="3-Multi-Tenant-Isolation" class="common-anchor-header"><strong>3. Isolamento multi-tenant</strong></h4><p>Milvus offre un isolamento granulare multi-tenant attraverso <strong>Partition Key</strong>, un meccanismo di partizionamento leggero che segmenta la memoria all'interno di una singola raccolta. Questo permette a:</p>
<ul>
<li><p>a diversi team, progetti o comunità di agenti di mantenere spazi di memoria indipendenti,</p></li>
<li><p>ridurre drasticamente i costi di gestione rispetto al mantenimento di più collezioni,</p></li>
<li><p>il recupero facoltativo delle partizioni quando è necessaria la conoscenza condivisa.</p></li>
</ul>
<p>Questo isolamento è fondamentale per le grandi distribuzioni multi-agente, dove i confini dei dati devono essere rispettati senza compromettere la velocità di recupero.</p>
<p>OpenAgents si connette a Milvus attraverso <strong>moduli personalizzati</strong> che chiamano direttamente le API di Milvus. I messaggi degli agenti, i risultati degli strumenti e i registri delle interazioni vengono automaticamente incorporati nei vettori e memorizzati in Milvus. Gli sviluppatori possono personalizzare</p>
<ul>
<li><p>il modello di incorporazione,</p></li>
<li><p>lo schema di archiviazione e i metadati,</p></li>
<li><p>e le strategie di recupero (ad esempio, ricerca ibrida, ricerca partizionata).</p></li>
</ul>
<p>In questo modo, ogni comunità di agenti dispone di un livello di memoria scalabile, persistente e ottimizzato per il ragionamento semantico.</p>
<h2 id="How-to-Build-a-Multi-Agent-Chatbot-with-OpenAgent-and-Milvus" class="common-anchor-header">Come costruire un chatbot multi-agente con OpenAgent e Milvus<button data-href="#How-to-Build-a-Multi-Agent-Chatbot-with-OpenAgent-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Per rendere le cose concrete, vediamo una dimostrazione: costruire una <strong>comunità di supporto agli sviluppatori</strong> in cui più agenti specializzati - esperti di Python, esperti di database, ingegneri DevOps e altri - collaborano per rispondere a domande tecniche. Invece di affidarsi a un singolo agente generalista sovraccarico di lavoro, ogni esperto contribuisce con un ragionamento specifico sul dominio e il sistema indirizza automaticamente le richieste all'agente più adatto.</p>
<p>Questo esempio dimostra come integrare <strong>Milvus</strong> in una distribuzione OpenAgents per fornire una memoria a lungo termine per le domande e risposte tecniche. Le conversazioni degli agenti, le soluzioni passate, i registri di risoluzione dei problemi e le domande degli utenti vengono tutti convertiti in embeddings vettoriali e memorizzati in Milvus, dando alla rete la capacità di:</p>
<ul>
<li><p>ricordare le risposte precedenti</p></li>
<li><p>riutilizzare le spiegazioni tecniche precedenti</p></li>
<li><p>mantenere la coerenza tra le sessioni e</p></li>
<li><p>migliorare nel tempo con l'accumularsi delle interazioni.</p></li>
</ul>
<h3 id="Prerequisite" class="common-anchor-header">Prerequisiti</h3><ul>
<li><p>python3.11+</p></li>
<li><p>conda</p></li>
<li><p>Chiave Openai</p></li>
</ul>
<h3 id="1-Define-Dependencies" class="common-anchor-header">1. Definire le dipendenze</h3><p>Definire i pacchetti Python necessari per il progetto:</p>
<pre><code translate="no"><span class="hljs-comment"># Core framework</span>
openagents&gt;=<span class="hljs-number">0.6</span><span class="hljs-number">.11</span>
<span class="hljs-comment"># Vector database</span>
pymilvus&gt;=<span class="hljs-number">2.5</span><span class="hljs-number">.1</span>
<span class="hljs-comment"># Embedding model</span>
sentence-transformers&gt;=<span class="hljs-number">2.2</span><span class="hljs-number">.0</span>
<span class="hljs-comment"># LLM integration</span>
openai&gt;=<span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
<span class="hljs-comment"># Environment config</span>
python-dotenv&gt;=<span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Environment-Variables" class="common-anchor-header">2. Variabili d'ambiente</h3><p>Ecco il modello per la configurazione dell'ambiente:</p>
<pre><code translate="no"><span class="hljs-comment"># LLM configuration (required)</span>
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o
<span class="hljs-comment"># Milvus configuration</span>
MILVUS_URI=./multi_agent_memory.db
<span class="hljs-comment"># Embedding model configuration</span>
EMBEDDING_MODEL=text-embedding-3-large
EMBEDDING_DIMENSION=3072
<span class="hljs-comment"># Network configuration</span>
NETWORK_HOST=localhost
NETWORK_PORT=8700
STUDIO_PORT=8050
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Configure-Your-OpenAgents-Network" class="common-anchor-header">3. Configurazione della rete OpenAgents</h3><p>Definire la struttura della rete di agenti e le impostazioni di comunicazione:</p>
<pre><code translate="no"><span class="hljs-comment"># Network transport protocol (HTTP on port 8700)</span>
<span class="hljs-comment"># Multi-channel messaging system (general, coordination, expert channels)</span>
<span class="hljs-comment"># Agent role definitions (coordinator, python_expert, etc.)</span>
<span class="hljs-comment"># Milvus integration settings</span>
network:
  name: <span class="hljs-string">&quot;Multi-Agent Collaboration Demo&quot;</span>
  transports:
    - <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;http&quot;</span>
      config:
        port: <span class="hljs-number">8700</span>
        host: <span class="hljs-string">&quot;localhost&quot;</span>
  mods:
    - name: <span class="hljs-string">&quot;openagents.mods.workspace.messaging&quot;</span>
      config:
        channels:
          - name: <span class="hljs-string">&quot;general&quot;</span>          <span class="hljs-comment"># User question channel</span>
          - name: <span class="hljs-string">&quot;coordination&quot;</span>     <span class="hljs-comment"># Coordinator channel</span>
          - name: <span class="hljs-string">&quot;python_channel&quot;</span>   <span class="hljs-comment"># Python expert channel</span>
          - name: <span class="hljs-string">&quot;milvus_channel&quot;</span>   <span class="hljs-comment"># Milvus expert channel</span>
          - name: <span class="hljs-string">&quot;devops_channel&quot;</span>   <span class="hljs-comment"># DevOps expert channel</span>
  agents:
    coordinator:
      <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;coordinator&quot;</span>
      description: <span class="hljs-string">&quot;Coordinator Agent, responsible for analyzing queries and dispatching tasks to expert agents&quot;</span>
      channels: [<span class="hljs-string">&quot;general&quot;</span>, <span class="hljs-string">&quot;coordination&quot;</span>]
    python_expert:
      <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;expert&quot;</span>
      domain: <span class="hljs-string">&quot;python&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Implement-Multi-Agent-Collaboration" class="common-anchor-header">4. Implementare la collaborazione tra più agenti</h3><p>Di seguito sono riportati alcuni frammenti di codice (non l'implementazione completa).</p>
<pre><code translate="no"><span class="hljs-comment"># SharedMemory: Milvus’s SharedMemory system</span>
<span class="hljs-comment"># CoordinatorAgent: Coordinator Agent, responsible for analyzing queries and dispatching tasks to expert agents</span>
<span class="hljs-comment"># PythonExpertAgent: Python Expert</span>
<span class="hljs-comment"># MilvusExpertAgent: Milvus Expert</span>
<span class="hljs-comment"># DevOpsExpertAgent: DevOps Expert</span>
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>
<span class="hljs-keyword">from</span> dotenv <span class="hljs-keyword">import</span> load_dotenv
<span class="hljs-keyword">from</span> openagents.agents.worker_agent <span class="hljs-keyword">import</span> WorkerAgent
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType
<span class="hljs-keyword">import</span> openai
load_dotenv()
<span class="hljs-keyword">class</span> <span class="hljs-title class_">SharedMemory</span>:
    <span class="hljs-string">&quot;&quot;&quot;SharedMemory in Milvus for all Agents&quot;&quot;&quot;</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        connections.connect(uri=<span class="hljs-string">&quot;./multi_agent_memory.db&quot;</span>)
        <span class="hljs-variable language_">self</span>.setup_collections()
        <span class="hljs-variable language_">self</span>.openai_client = openai.OpenAI(
            api_key=os.getenv(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>),
            base_url=os.getenv(<span class="hljs-string">&quot;OPENAI_BASE_URL&quot;</span>)
        )
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">setup_collections</span>(<span class="hljs-params">self</span>):
        <span class="hljs-string">&quot;&quot;&quot;Create memory collections: expert knowledge, collaboration history, problem solutions&quot;&quot;&quot;</span>
        collections = {
            <span class="hljs-string">&quot;expert_knowledge&quot;</span>: <span class="hljs-string">&quot;expert knowledge&quot;</span>,
            <span class="hljs-string">&quot;collaboration_history&quot;</span>: <span class="hljs-string">&quot;collaboration history&quot;</span>, 
            <span class="hljs-string">&quot;problem_solutions&quot;</span>: <span class="hljs-string">&quot;problem solutions&quot;</span>
        }
        <span class="hljs-comment"># Code to create vector collections...</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">search_knowledge</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, collection_name: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Search for relevant knowledge&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Vector search implementation...</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">store_knowledge</span>(<span class="hljs-params">self, agent_id: <span class="hljs-built_in">str</span>, content: <span class="hljs-built_in">str</span>, metadata: <span class="hljs-built_in">dict</span>, collection_name: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Store knowledge&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Store into the vector database...</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">CoordinatorAgent</span>(<span class="hljs-title class_ inherited__">WorkerAgent</span>):
    <span class="hljs-string">&quot;&quot;&quot;Coordinator Agent - analyzes questions and coordinates other Agent&quot;&quot;&quot;</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        <span class="hljs-built_in">super</span>().__init__(agent_id=<span class="hljs-string">&quot;coordinator&quot;</span>)
        <span class="hljs-variable language_">self</span>.expert_agents = {
            <span class="hljs-string">&quot;python&quot;</span>: <span class="hljs-string">&quot;python_expert&quot;</span>,
            <span class="hljs-string">&quot;milvus&quot;</span>: <span class="hljs-string">&quot;milvus_expert&quot;</span>, 
            <span class="hljs-string">&quot;devops&quot;</span>: <span class="hljs-string">&quot;devops_expert&quot;</span>
        }
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">analyze_question</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]:
        <span class="hljs-string">&quot;&quot;&quot;Determine which experts are needed for the question&quot;&quot;&quot;</span>
        keywords = {
            <span class="hljs-string">&quot;python&quot;</span>: [<span class="hljs-string">&quot;python&quot;</span>, <span class="hljs-string">&quot;django&quot;</span>, <span class="hljs-string">&quot;flask&quot;</span>, <span class="hljs-string">&quot;async&quot;</span>],
            <span class="hljs-string">&quot;milvus&quot;</span>: [<span class="hljs-string">&quot;milvus&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>, <span class="hljs-string">&quot;index&quot;</span>, <span class="hljs-string">&quot;performance&quot;</span>],
            <span class="hljs-string">&quot;devops&quot;</span>: [<span class="hljs-string">&quot;deployment&quot;</span>, <span class="hljs-string">&quot;docker&quot;</span>, <span class="hljs-string">&quot;kubernetes&quot;</span>, <span class="hljs-string">&quot;operations&quot;</span>]
        }
        <span class="hljs-comment"># Keyword matching logic...</span>
        <span class="hljs-keyword">return</span> needed_experts
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">coordinate_experts</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span>, needed_experts: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]</span>):
        <span class="hljs-string">&quot;&quot;&quot;Coordinate collaboration among expert Agent&quot;&quot;&quot;</span>
        <span class="hljs-comment"># 1. Notify experts to begin collaborating</span>
        <span class="hljs-comment"># 2. Dispatch tasks to each expert</span>
        <span class="hljs-comment"># 3. Collect expert responses</span>
        <span class="hljs-comment"># 4. Return expert opinions</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">on_channel_post</span>(<span class="hljs-params">self, context</span>):
        <span class="hljs-string">&quot;&quot;&quot;Main logic for handling user questions&quot;&quot;&quot;</span>
        content = context.incoming_event.payload.get(<span class="hljs-string">&#x27;content&#x27;</span>, {}).get(<span class="hljs-string">&#x27;text&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
        <span class="hljs-keyword">if</span> content <span class="hljs-keyword">and</span> <span class="hljs-keyword">not</span> content.startswith(<span class="hljs-string">&#x27;🎯&#x27;</span>):
            <span class="hljs-comment"># 1. Analyze question → 2. Coordinate experts → 3. Merge answers → 4. Reply to user</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">PythonExpertAgent</span>(<span class="hljs-title class_ inherited__">WorkerAgent</span>):
    <span class="hljs-string">&quot;&quot;&quot;Python Expert Agent&quot;&quot;&quot;</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">analyze_python_question</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Analyze Python-related questions and provide expert advice&quot;&quot;&quot;</span>
        <span class="hljs-comment"># 1. Search for relevant experience</span>
        <span class="hljs-comment"># 2. Use LLM to generate expert response</span>
        <span class="hljs-comment"># 3. Store result in collaboration history</span>
        <span class="hljs-keyword">return</span> answer
<span class="hljs-comment"># Start all Agens</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">run_multi_agent_demo</span>():
    coordinator = CoordinatorAgent()
    python_expert = PythonExpertAgent()
    milvus_expert = MilvusExpertAgent()
    devops_expert = DevOpsExpertAgent()
    <span class="hljs-comment"># Connect to the OpenAgents network</span>
    <span class="hljs-keyword">await</span> coordinator.async_start(network_host=<span class="hljs-string">&quot;localhost&quot;</span>, network_port=<span class="hljs-number">8700</span>)
    <span class="hljs-comment"># ... Start other Agent</span>
    <span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
        <span class="hljs-keyword">await</span> asyncio.sleep(<span class="hljs-number">1</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    asyncio.run(run_multi_agent_demo())
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Create-and-Activate-a-Virtual-Environment" class="common-anchor-header">5. Creare e attivare un ambiente virtuale</h3><pre><code translate="no">conda create -n openagents
conda activate openagents
<button class="copy-code-btn"></button></code></pre>
<p><strong>Installare le dipendenze</strong></p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<p><strong>Configurare le chiavi API</strong></p>
<pre><code translate="no"><span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Avviare la rete OpenAgents</strong></p>
<pre><code translate="no">openagents network start .
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/network_169812ab94.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Avviare il servizio multi-agente</strong></p>
<pre><code translate="no">python multi_agent_demo.py
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/multiagent_service_1661d4b91b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Avviare OpenAgents Studio</strong></p>
<pre><code translate="no">openagents studio -s
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/start_studio_4cd126fea2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Accedere a Studio</strong></p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:8050</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio1_a33709914b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio3_293604c79e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio_3_8d98a4cfe8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Controllare lo stato degli agenti e della rete:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_state_bba1a4fe16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusioni<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAgents fornisce il livello di coordinamento che consente agli agenti di scoprirsi, comunicare e collaborare, mentre Milvus risolve il problema altrettanto critico di come la conoscenza viene memorizzata, condivisa e riutilizzata. Fornendo un livello di memoria vettoriale ad alte prestazioni, Milvus consente agli agenti di costruire un contesto persistente, di ricordare le interazioni passate e di accumulare competenze nel tempo. Insieme, spingono i sistemi di intelligenza artificiale oltre i limiti dei modelli isolati e verso il potenziale collaborativo più profondo di una vera rete multiagente.</p>
<p>Naturalmente, nessuna architettura multiagente è priva di compromessi. L'esecuzione degli agenti in parallelo può aumentare il consumo di token, gli errori possono essere trasmessi a cascata tra gli agenti e il processo decisionale simultaneo può portare a conflitti occasionali. Si tratta di aree di ricerca attive e di miglioramento continuo, ma non sminuiscono il valore della costruzione di sistemi in grado di coordinarsi, ricordare ed evolvere.</p>
<p>🚀 Siete pronti a dare ai vostri agenti una memoria a lungo termine?</p>
<p>Esplorate <a href="https://milvus.io/">Milvus</a> e provate a integrarlo nel vostro flusso di lavoro.</p>
<p>Avete domande o volete un approfondimento su una qualsiasi funzione? Unitevi al nostro<a href="https://discord.com/invite/8uyFbECzPX"> canale Discord</a> o inviate problemi su<a href="https://github.com/milvus-io/milvus"> GitHub</a>. È anche possibile prenotare una sessione individuale di 20 minuti per ottenere approfondimenti, indicazioni e risposte alle vostre domande tramite<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
