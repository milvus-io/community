---
id: anthropic-managed-agents-memory-milvus.md
title: >-
  Come aggiungere la memoria a lungo termine agli agenti gestiti di Anthropic
  con Milvus
author: Min Yin
date: 2026-4-21
cover: assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_1_d3e5055603.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  anthropic managed agents, long-term memory, agent memory, milvus, vector
  database
meta_title: |
  Add Long-Term Memory to Anthropic's Managed Agents with Milvus
desc: >-
  Gli agenti gestiti di Anthropic hanno reso gli agenti affidabili, ma ogni
  sessione inizia in bianco. Ecco come abbinare Milvus per il richiamo semantico
  all'interno di una sessione e la memoria condivisa tra gli agenti.
origin: 'https://milvus.io/blog/anthropic-managed-agents-memory-milvus.md'
---
<p>Gli <a href="https://www.anthropic.com/engineering/managed-agents">agenti gestiti</a> di Anthropic rendono l'infrastruttura degli agenti resiliente. Un task da 200 passi ora sopravvive a un crash dell'imbracatura, a un timeout della sandbox o a una modifica dell'infrastruttura a metà volo senza alcun intervento umano, e Anthropic riferisce che il tempo p50 per il primo token è diminuito di circa il 60% e il p95 di oltre il 90% dopo il disaccoppiamento.</p>
<p>Ciò che l'affidabilità non risolve è la memoria. Una migrazione del codice in 200 passi che si imbatte in un nuovo conflitto di dipendenze al passo 201 non può guardare indietro in modo efficiente a come ha gestito l'ultimo. Un agente che esegue scansioni di vulnerabilità per un cliente non sa che un altro agente ha già risolto lo stesso caso un'ora fa. Ogni sessione inizia su una pagina bianca e i cervelli paralleli non hanno accesso a ciò che gli altri hanno già risolto.</p>
<p>La soluzione consiste nell'accoppiare il <a href="https://milvus.io/">database vettoriale di Milvus</a> con gli agenti gestiti di Anthropic: richiamo semantico all'interno di una sessione e uno <a href="https://milvus.io/docs/milvus_for_agents.md">strato di memoria vettoriale</a> condivisa tra le sessioni. Il contratto di sessione rimane inalterato, l'imbracatura ottiene un nuovo livello e i compiti degli agenti a lungo termine ottengono capacità qualitativamente diverse.</p>
<h2 id="What-Managed-Agents-Solved-and-What-They-Didnt" class="common-anchor-header">Cosa hanno risolto gli agenti gestiti (e cosa no)<button data-href="#What-Managed-Agents-Solved-and-What-They-Didnt" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Gli agenti gestiti hanno risolto il problema dell'affidabilità disaccoppiando l'agente in tre moduli indipendenti. Ciò che non ha risolto è la memoria, sia come richiamo semantico all'interno di una singola sessione, sia come esperienza condivisa tra sessioni parallele.</strong> Ecco cosa è stato disaccoppiato e dove si colloca il gap di memoria all'interno del progetto disaccoppiato.</p>
<table>
<thead>
<tr><th>Modulo</th><th>Cosa fa</th></tr>
</thead>
<tbody>
<tr><td><strong>La sessione</strong></td><td>Un registro di eventi di sola appendice di tutto ciò che è accaduto. Memorizzato al di fuori dell'harness.</td></tr>
<tr><td><strong>Imbracatura</strong></td><td>Il ciclo che chiama Claude e instrada le chiamate agli strumenti di Claude all'infrastruttura pertinente.</td></tr>
<tr><td><strong>Sandbox</strong></td><td>L'ambiente di esecuzione isolato in cui Claude esegue il codice e modifica i file.</td></tr>
</tbody>
</table>
<p>Il reframe che fa funzionare questo progetto è dichiarato esplicitamente nel post di Anthropic:</p>
<p><em>"La sessione non è la finestra contestuale di Claude".</em></p>
<p>La finestra di contesto è effimera: delimitata in token, ricostruita per ogni chiamata al modello e scartata al ritorno della chiamata. La sessione è durevole, memorizzata al di fuori dell'imbracatura e rappresenta il sistema di registrazione dell'intero compito.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_3_edae1b022d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Quando un harness si blocca, la piattaforma ne avvia uno nuovo con <code translate="no">wake(sessionId)</code>. Il nuovo harness legge il registro degli eventi tramite <code translate="no">getSession(id)</code> e l'attività riprende dall'ultimo passo registrato, senza logica di recupero personalizzata da scrivere e senza babysitteraggio a livello di sessione da operare.</p>
<p>Ciò che il post sugli agenti gestiti non affronta, e non pretende di farlo, è cosa fa l'agente quando deve ricordare qualcosa. Due lacune si manifestano nel momento in cui si spingono carichi di lavoro reali attraverso l'architettura. Una vive all'interno di una singola sessione; l'altra vive tra le sessioni.</p>
<h2 id="Problem-1-Why-Linear-Session-Logs-Fail-Past-a-Few-Hundred-Steps" class="common-anchor-header">Problema 1: Perché i registri di sessione lineari falliscono dopo poche centinaia di passi<button data-href="#Problem-1-Why-Linear-Session-Logs-Fail-Past-a-Few-Hundred-Steps" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>I registri di sessione lineari falliscono dopo poche centinaia di passi perché la lettura sequenziale e la ricerca semantica sono carichi di lavoro fondamentalmente diversi e l'</strong> <strong>API</strong> <code translate="no">**getEvents()**</code> <strong>serve solo la prima.</strong> La suddivisione per posizione o la ricerca di un timestamp sono sufficienti per rispondere alla domanda "dove si è interrotta questa sessione". Non è sufficiente per rispondere alla domanda di cui un agente avrà prevedibilmente bisogno per qualsiasi compito lungo: abbiamo già visto questo tipo di problema e cosa abbiamo fatto per risolverlo?</p>
<p>Consideriamo una migrazione di codice al passo 200 che si scontra con un nuovo conflitto di dipendenze. La mossa naturale è quella di guardare al passato. L'agente si è imbattuto in qualcosa di simile in precedenza in questa stessa attività? Quale approccio è stato provato? Ha funzionato o ha fatto regredire qualcos'altro a valle?</p>
<p>Con <code translate="no">getEvents()</code> ci sono due modi per rispondere, ed entrambi sono sbagliati:</p>
<table>
<thead>
<tr><th>Opzione</th><th>Problema</th></tr>
</thead>
<tbody>
<tr><td>Scansione sequenziale di ogni evento</td><td>Lenta a 200 passi. Insostenibile a 2.000.</td></tr>
<tr><td>Scaricare una grande fetta del flusso nella finestra di contesto</td><td>Costoso per i token, inaffidabile su scala, e riduce la memoria di lavoro dell'agente per il passo corrente.</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_4_2ac29b32af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La sessione è buona per il recupero e la verifica, ma non è stata costruita con un indice che supporti la domanda "ho già visto questo". I compiti a lungo termine sono quelli in cui questa domanda smette di essere facoltativa.</p>
<h2 id="Solution-1-How-to-Add-Semantic-Memory-to-a-Managed-Agents-Session" class="common-anchor-header">Soluzione 1: Come aggiungere la memoria semantica alla sessione di un agente gestito<button data-href="#Solution-1-How-to-Add-Semantic-Memory-to-a-Managed-Agents-Session" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Aggiungere una collezione Milvus accanto al registro di sessione e scrivere due volte da</strong> <code translate="no">**emitEvent**</code>. Il contratto di sessione rimane inalterato e l'imbracatura ottiene una query semantica sul proprio passato.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_5_404a1048aa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Il progetto di Anthropic lascia spazio proprio a questo. Il loro post afferma che "qualsiasi evento recuperato può essere trasformato nell'harness prima di essere passato alla finestra di contesto di Claude. Queste trasformazioni possono essere qualsiasi cosa l'harness codifichi, compresa l'organizzazione del contesto... e l'ingegneria del contesto". L'ingegnerizzazione del contesto risiede nell'harness; la sessione deve solo garantire la durata e l'interrogabilità.</p>
<p>Lo schema: ogni volta che <code translate="no">emitEvent</code> si attiva, l'harness calcola anche un <a href="https://zilliz.com/learn/everything-you-need-to-know-about-vector-embeddings">embedding vettoriale</a> per gli eventi da indicizzare e li inserisce in una raccolta Milvus.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># Only index high-signal events. Tool retries and intermediate states are noise.</span>
INDEXABLE_EVENT_TYPES = {<span class="hljs-string">&quot;decision&quot;</span>, <span class="hljs-string">&quot;strategy&quot;</span>, <span class="hljs-string">&quot;resolution&quot;</span>, <span class="hljs-string">&quot;error_handling&quot;</span>}

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">emit_event</span>(<span class="hljs-params">session_id: <span class="hljs-built_in">str</span>, event: <span class="hljs-built_in">dict</span></span>):
    <span class="hljs-comment"># Original path: append to the session event stream.</span>
    <span class="hljs-keyword">await</span> session_store.append(session_id, event)

    <span class="hljs-comment"># Extended path: embed the event content and insert into Milvus.</span>
    <span class="hljs-keyword">if</span> event[<span class="hljs-string">&quot;type&quot;</span>] <span class="hljs-keyword">in</span> INDEXABLE_EVENT_TYPES:
        embedding = <span class="hljs-keyword">await</span> embed(event[<span class="hljs-string">&quot;content&quot;</span>])
        milvus_client.insert(
            collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>,
            data=[{
                <span class="hljs-string">&quot;vector&quot;</span>:     embedding,
                <span class="hljs-string">&quot;session_id&quot;</span>: session_id,
                <span class="hljs-string">&quot;step&quot;</span>:       event[<span class="hljs-string">&quot;step&quot;</span>],
                <span class="hljs-string">&quot;event_type&quot;</span>: event[<span class="hljs-string">&quot;type&quot;</span>],
                <span class="hljs-string">&quot;content&quot;</span>:    event[<span class="hljs-string">&quot;content&quot;</span>],
            }]
        )
<button class="copy-code-btn"></button></code></pre>
<p>Quando l'agente arriva al passo 200 e ha bisogno di richiamare le decisioni precedenti, l'interrogazione è una <a href="https://zilliz.com/glossary/vector-similarity-search">ricerca vettoriale</a> con lo scopo di quella sessione:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">recall_similar</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, session_id: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>):
    query_vector = <span class="hljs-keyword">await</span> embed(query)
    results = milvus_client.search(
        collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>,
        data=[query_vector],
        <span class="hljs-built_in">filter</span>=<span class="hljs-string">f&#x27;session_id == &quot;<span class="hljs-subst">{session_id}</span>&quot;&#x27;</span>,
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;step&quot;</span>, <span class="hljs-string">&quot;event_type&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>]
    )
    <span class="hljs-keyword">return</span> results[<span class="hljs-number">0</span>]  <span class="hljs-comment"># top_k most relevant past events</span>
<button class="copy-code-btn"></button></code></pre>
<p>Tre dettagli di produzione sono importanti prima che questo venga spedito:</p>
<ul>
<li><strong>Scegliere cosa indicizzare.</strong> Non tutti gli eventi meritano un embedding. Gli stati intermedi delle chiamate agli strumenti, i registri dei tentativi e gli eventi di stato ripetitivi inquinano la qualità del recupero più velocemente di quanto la migliorino. La politica di <code translate="no">INDEXABLE_EVENT_TYPES</code> dipende dalle attività, non è globale.</li>
<li><strong>Definire il limite di coerenza.</strong> Se l'harness si blocca tra l'append della sessione e l'insert di Milvus, un livello è brevemente in vantaggio sull'altro. La finestra è piccola ma reale. Scegliere un percorso di riconciliazione (riprova al riavvio, log write-ahead o riconciliazione finale) piuttosto che sperare.</li>
<li><strong>Controllo della spesa per l'incorporazione.</strong> Una sessione di 200 passi che chiama un'API di incorporamento esterna in modo sincrono a ogni passo produce una fattura non prevista. Accodate le incorporazioni e inviatele in modo asincrono in lotti.</li>
</ul>
<p>Con questi accorgimenti, il richiamo richiede millisecondi per la ricerca vettoriale e meno di 100 ms per la chiamata all'embedding. I primi cinque eventi passati più rilevanti vengono inseriti nel contesto prima che l'agente si accorga dell'attrito. La sessione mantiene il suo compito originale di registro durevole; l'imbracatura guadagna la capacità di interrogare il proprio passato in modo semantico anziché sequenziale. Si tratta di un cambiamento modesto alla superficie dell'API e di un cambiamento strutturale in ciò che l'agente può fare su compiti a lungo termine.</p>
<h2 id="Problem-2-Why-Parallel-Claude-Agents-Cant-Share-Experience" class="common-anchor-header">Problema 2: perché gli agenti Claude paralleli non possono condividere l'esperienza<button data-href="#Problem-2-Why-Parallel-Claude-Agents-Cant-Share-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Gli agenti Claude paralleli non possono condividere l'esperienza perché le sessioni degli agenti gestiti sono isolate per progettazione. Lo stesso isolamento che rende pulito lo scaling orizzontale impedisce a ogni cervello di imparare da ogni altro cervello.</strong></p>
<p>In un sistema disaccoppiato, i cervelli sono stateless e indipendenti. L'isolamento sblocca le vittorie di latenza riportate da Anthropic, ma mantiene anche ogni sessione in esecuzione all'oscuro di ogni altra sessione.</p>
<p>L'agente A passa 40 minuti a diagnosticare un complicato vettore di iniezione SQL per un cliente. Un'ora dopo, l'agente B riprende lo stesso caso per un altro cliente e trascorre i suoi 40 minuti percorrendo gli stessi vicoli ciechi, eseguendo le stesse chiamate agli strumenti e arrivando alla stessa risposta.</p>
<p>Per un singolo utente che gestisce un agente occasionale, si tratta di uno spreco di calcolo. Per una piattaforma che esegue ogni giorno decine di <a href="https://zilliz.com/glossary/ai-agents">agenti AI</a> simultanei per la revisione del codice, la scansione delle vulnerabilità e la generazione di documentazione per clienti diversi, il costo aumenta strutturalmente.</p>
<p>Se l'esperienza prodotta da ogni sessione evapora nel momento in cui la sessione termina, l'intelligenza è usa e getta. Una piattaforma costruita in questo modo scala linearmente, ma non migliora nel tempo, come fanno gli ingegneri umani.</p>
<h2 id="Solution-2-How-to-Build-a-Shared-Agent-Memory-Pool-with-Milvus" class="common-anchor-header">Soluzione 2: Come costruire un pool di memoria condivisa per gli agenti con Milvus<button data-href="#Solution-2-How-to-Build-a-Shared-Agent-Memory-Pool-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Costruite una collezione di vettori che ogni harness legge all'avvio e scrive allo spegnimento, suddivisa per tenant in modo che l'esperienza sia condivisa tra le sessioni senza perdite tra i clienti.</strong></p>
<p>Quando una sessione termina, le decisioni chiave, i problemi incontrati e gli approcci che hanno funzionato vengono inseriti nella raccolta condivisa di Milvus. Quando un nuovo cervello si inizializza, il sistema esegue una query semantica come parte della configurazione e inietta le esperienze passate più corrispondenti nella finestra del contesto. Il primo passo del nuovo agente eredita le lezioni di ogni agente precedente.</p>
<p>Due decisioni ingegneristiche portano questo processo dal prototipo alla produzione.</p>
<h3 id="Isolating-Tenants-with-the-Milvus-Partition-Key" class="common-anchor-header">Isolamento degli inquilini con la chiave di partizione Milvus</h3><p><strong>Partendo da</strong> <code translate="no">**tenant_id**</code>,<strong> le esperienze dell'agente del cliente A non vivono fisicamente nella stessa partizione di quelle del cliente B.</strong> Questo è<strong> un</strong><strong>isolamento</strong> a livello di dati<strong>. Si tratta di un isolamento a livello di dati piuttosto che di una convenzione di query.</strong></p>
<p>Il lavoro del cervello A sulla base di codice dell'azienda A non deve mai essere recuperabile dagli agenti dell'azienda B. La <a href="https://milvus.io/docs/use-partition-key.md">chiave di partizione</a> di Milvus gestisce questo aspetto su una singola collezione, senza una seconda collezione per tenant e senza logica di sharding nel codice dell'applicazione.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Declare partition key at schema creation.</span>
schema.add_field(
    field_name=<span class="hljs-string">&quot;tenant_id&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">64</span>,
    is_partition_key=<span class="hljs-literal">True</span>   <span class="hljs-comment"># Automatic per-tenant partitioning.</span>
)

<span class="hljs-comment"># Every query filters by tenant. Isolation is automatic.</span>
results = milvus_client.search(
    collection_name=<span class="hljs-string">&quot;shared_agent_memory&quot;</span>,
    data=[query_vector],
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">f&#x27;tenant_id == &quot;<span class="hljs-subst">{current_tenant}</span>&quot;&#x27;</span>,
    limit=<span class="hljs-number">5</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;step&quot;</span>, <span class="hljs-string">&quot;session_id&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>Le esperienze dell'agente del cliente A non emergono mai nelle query del cliente B, non perché il filtro delle query sia scritto correttamente (anche se deve esserlo), ma perché i dati non si trovano fisicamente nella stessa partizione del cliente B. Una collezione per operare, isolamento logico applicato al livello di query, isolamento fisico applicato al livello di partizione.</p>
<p>Consultate i <a href="https://milvus.io/docs/multi_tenancy.md">documenti sulle strategie multi-tenancy</a> per sapere quando la chiave di partizione è adatta rispetto a collezioni o database separati, e la <a href="https://milvus.io/blog/build-multi-tenancy-rag-with-milvus-best-practices-part-one.md">guida ai modelli RAG multi-tenancy</a> per le note sull'implementazione in produzione.</p>
<h3 id="Why-Agent-Memory-Quality-Needs-Ongoing-Work" class="common-anchor-header">Perché la qualità della memoria degli agenti richiede un lavoro continuo</h3><p><strong>La qualità della memoria si erode nel tempo: le soluzioni sbagliate che hanno avuto successo una volta vengono riprodotte e rafforzate, e le voci obsolete legate a dipendenze deprecate continuano a ingannare gli agenti che le ereditano. Le difese sono programmi operativi, non caratteristiche del database.</strong></p>
<p>Un agente si imbatte in un workaround difettoso che ha successo una volta. Viene scritto nel pool condiviso. L'agente successivo lo recupera, lo riproduce e rafforza il modello sbagliato con un secondo record di utilizzo "riuscito".</p>
<p>Le voci obsolete seguono una versione più lenta dello stesso percorso. Una correzione appuntata a una versione della dipendenza che è stata deprecata sei mesi fa continua a essere recuperata e a fuorviare gli agenti che la ereditano. Più il pool è vecchio e più viene utilizzato, più questo fenomeno si accumula.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_6_24f71b1c21.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Tre programmi operativi difendono da questo problema:</p>
<ul>
<li><strong>Punteggio di fiducia.</strong> Traccia la frequenza con cui una memoria è stata applicata con successo nelle sessioni a valle. Far decadere le voci che falliscono nei replay. Promuovere le voci che hanno successo ripetutamente.</li>
<li><strong>Ponderazione temporale.</strong> Preferisce le esperienze recenti. Ritirate le voci che superano una soglia di staleness nota, spesso legata a importanti aggiornamenti di versione delle dipendenze.</li>
<li><strong>Controlli umani a campione.</strong> Le voci con un'alta frequenza di recupero sono ad alta leva. Quando una di esse è sbagliata, è sbagliata molte volte, ed è qui che la revisione umana si ripaga più velocemente.</li>
</ul>
<p>Milvus da solo non risolve questo problema, e nemmeno Mem0, Zep o qualsiasi altro prodotto di memoria. L'applicazione di un pool con molti tenant e zero perdite cross-tenant è qualcosa che si progetta una volta sola. Mantenere quel pool accurato, fresco e utile è un lavoro operativo continuo che nessun database fornisce preconfigurato.</p>
<h2 id="Takeaways-What-Milvus-Adds-to-Anthropics-Managed-Agents" class="common-anchor-header">Aspetti salienti: Cosa aggiunge Milvus agli agenti gestiti di Anthropic<button data-href="#Takeaways-What-Milvus-Adds-to-Anthropics-Managed-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Milvus trasforma gli agenti gestiti da una piattaforma affidabile ma dimenticabile in una piattaforma che arricchisce l'esperienza nel tempo, aggiungendo il richiamo semantico all'interno di una sessione e la memoria condivisa tra gli agenti.</strong></p>
<p>Gli agenti gestiti rispondono alla domanda sull'affidabilità in modo chiaro: sia i cervelli che le mani sono bestiame, e ognuno di essi può morire senza portare con sé il compito. Questo è il problema dell'infrastruttura e Anthropic lo ha risolto bene.</p>
<p>Quello che è rimasto aperto è la crescita. Gli ingegneri umani crescono con il tempo; anni di lavoro si trasformano in riconoscimento di schemi e non ragionano da principi primi su ogni compito. Gli agenti gestiti di oggi non lo fanno, perché ogni sessione inizia su una pagina bianca.</p>
<p>Collegare la sessione a Milvus per il richiamo semantico all'interno di un compito e mettere in comune l'esperienza dei vari cervelli in una collezione di vettori condivisa è ciò che dà agli agenti un passato che possono effettivamente utilizzare. Il collegamento a Milvus è la parte infrastrutturale; la potatura delle memorie errate, il ritiro di quelle obsolete e l'applicazione dei confini degli inquilini sono la parte operativa. Una volta che entrambi sono a posto, la forma della memoria smette di essere una passività e inizia a essere un capitale composto.</p>
<h2 id="Get-Started" class="common-anchor-header">Iniziare<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
<li><strong>Provate a livello locale:</strong> avviate un'istanza Milvus integrata con <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>. Niente Docker, niente cluster, solo <code translate="no">pip install pymilvus</code>. I carichi di lavoro di produzione passano a <a href="https://milvus.io/docs/install_standalone-docker.md">Milvus Standalone o Distributed</a> quando ne avete bisogno.</li>
<li><strong>Leggete le motivazioni del progetto:</strong> Il <a href="https://www.anthropic.com/engineering/managed-agents">post</a> di Anthropic sugli <a href="https://www.anthropic.com/engineering/managed-agents">agenti gestiti</a> illustra in modo approfondito il disaccoppiamento di sessioni, harness e sandbox.</li>
<li><strong>Avete domande?</strong> Unitevi alla comunità <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord</a> per discutere della progettazione della memoria degli agenti o prenotate una sessione <a href="https://milvus.io/office-hours">Milvus Office Hours</a> per analizzare il vostro carico di lavoro.</li>
<li><strong>Preferite la gestione?</strong> <a href="https://cloud.zilliz.com/signup">Iscriviti a Zilliz Cloud</a> (o <a href="https://cloud.zilliz.com/login">accedi</a>) per avere Milvus in hosting con chiavi di partizione, scalabilità e multi-tenancy. I nuovi account ricevono crediti gratuiti su un'e-mail di lavoro.</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Domande frequenti<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>D: Qual è la differenza tra una sessione e una finestra di contesto negli agenti gestiti di Anthropic?</strong></p>
<p>La finestra di contesto è l'insieme effimero di token che una singola chiamata Claude vede. È limitata e si azzera per ogni invocazione del modello. La sessione è il registro degli eventi durevole, di sola appendice, di tutto ciò che è accaduto durante l'intero task, memorizzato al di fuori dell'harness. Quando un harness si blocca, <code translate="no">wake(sessionId)</code> crea un nuovo harness che legge il registro di sessione e riprende. La sessione è il sistema di registrazione; la finestra di contesto è la memoria di lavoro. La sessione non è la finestra di contesto.</p>
<p><strong>D: Come si fa a persistere la memoria dell'agente tra le sessioni di Claude?</strong></p>
<p>La sessione stessa è già persistente; è ciò che <code translate="no">getSession(id)</code> recupera. Ciò che tipicamente manca è la memoria a lungo termine interrogabile. Il modello consiste nell'incorporare gli eventi ad alto segnale (decisioni, risoluzioni, strategie) in un database vettoriale come Milvus durante <code translate="no">emitEvent</code>, per poi interrogarlo in base alla somiglianza semantica al momento del recupero. In questo modo si ottiene sia il registro di sessione durevole fornito da Anthropic sia un livello di richiamo semantico per guardare indietro attraverso centinaia di passi.</p>
<p><strong>D: Più agenti Claude possono condividere la memoria?</strong></p>
<p>Non è possibile. Ogni sessione di agenti gestiti è isolata per progettazione, il che consente di scalare orizzontalmente. Per condividere la memoria tra gli agenti, aggiungere una collezione di vettori condivisa (ad esempio in Milvus) che ogni imbracatura legge all'avvio e scrive allo spegnimento. Usate la funzione chiave di partizione di Milvus per isolare i tenant, in modo che le memorie dell'agente del cliente A non si disperdano mai nelle sessioni del cliente B.</p>
<p><strong>D: Qual è il miglior database vettoriale per la memoria degli agenti AI?</strong></p>
<p>La risposta sincera dipende dalla scala e dalla forma di distribuzione. Per i prototipi e i piccoli carichi di lavoro, un'opzione integrata locale come Milvus Lite funziona in-process senza infrastruttura. Per gli agenti di produzione con molti tenant, è necessario un database con multi-tenancy maturo (chiavi di partizione, ricerca filtrata), ricerca ibrida (vettoriale + scalare + parola chiave) e latenza di un millisecondo per milioni di vettori. Milvus è stato creato appositamente per carichi di lavoro vettoriali su tale scala, ed è per questo che compare nei sistemi di memoria degli agenti di produzione costruiti su LangChain, Google ADK, Deep Agents e OpenAgents.</p>
