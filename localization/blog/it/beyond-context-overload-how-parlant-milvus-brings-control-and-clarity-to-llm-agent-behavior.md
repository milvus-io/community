---
id: >-
  beyond-context-overload-how-parlant-milvus-brings-control-and-clarity-to-llm-agent-behavior.md
title: >-
  Oltre il sovraccarico del contesto: Come Parlant × Milvus porta controllo e
  chiarezza al comportamento dell'agente LLM
author: Min Yin
date: 2025-11-05T00:00:00.000Z
cover: assets.zilliz.com/parlant_cover1_466dc0fe21.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Parlant, Milvus, AI agents, vector database, LLM'
meta_title: How Parlant × Milvus Brings Control to LLM Agent Behavior
desc: >-
  Scoprite come Parlant × Milvus utilizza la modellazione dell'allineamento e
  l'intelligenza vettoriale per rendere il comportamento degli agenti LLM
  controllabile, spiegabile e pronto per la produzione.
origin: >-
  https://milvus.io/blog/beyond-context-overload-how-parlant-milvus-brings-control-and-clarity-to-llm-agent-behavior.md
---
<p>Immaginate di dover completare un'attività che coinvolge 200 regole aziendali, 50 strumenti e 30 demo, e di avere solo un'ora di tempo per farlo. È semplicemente impossibile. Eppure spesso ci aspettiamo che i modelli linguistici di grandi dimensioni facciano esattamente questo, trasformandoli in "agenti" e sovraccaricandoli di istruzioni.</p>
<p>In pratica, questo approccio si rompe rapidamente. I framework tradizionali per agenti, come LangChain o LlamaIndex, iniettano tutte le regole e gli strumenti nel contesto del modello in una volta sola, il che porta a conflitti di regole, sovraccarico del contesto e comportamento imprevedibile in produzione.</p>
<p>Per risolvere questo problema, un framework open-source per agenti chiamato<a href="https://github.com/emcie-co/parlant?utm_source=chatgpt.com"> <strong>Parlant</strong></a> ha recentemente guadagnato terreno su GitHub. Introduce un nuovo approccio chiamato Alignment Modeling, insieme a un meccanismo di supervisione e a transizioni condizionali che rendono il comportamento degli agenti molto più controllabile e spiegabile.</p>
<p>Se abbinato a <a href="https://milvus.io/"><strong>Milvus</strong></a>, un database vettoriale open-source, Parlant diventa ancora più capace. Milvus aggiunge intelligenza semantica, consentendo agli agenti di recuperare dinamicamente le regole e il contesto più rilevanti in tempo reale, mantenendoli accurati, efficienti e pronti per la produzione.</p>
<p>In questo post analizzeremo come funziona Parlant sotto la luce del sole e come l'integrazione con Milvus consente di raggiungere il livello di produzione.</p>
<h2 id="Why-Traditional-Agent-Frameworks-Fall-Apart" class="common-anchor-header">Perché i framework di agenti tradizionali cadono a pezzi<button data-href="#Why-Traditional-Agent-Frameworks-Fall-Apart" class="anchor-icon" translate="no">
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
    </button></h2><p>I framework di agenti tradizionali amano le grandi dimensioni: centinaia di regole, dozzine di strumenti e una manciata di demo, il tutto stipato in un unico prompt sovraccarico. Può sembrare ottimo in una demo o in un piccolo test sandbox, ma una volta che lo si spinge in produzione, le crepe iniziano a manifestarsi rapidamente.</p>
<ul>
<li><p><strong>Regole contrastanti portano al caos:</strong> Quando si applicano due o più regole contemporaneamente, questi framework non hanno un modo integrato per decidere quale vince. A volte ne scelgono una. A volte le fonde entrambe. A volte fa qualcosa di totalmente imprevedibile.</p></li>
<li><p><strong>I casi limite evidenziano le lacune:</strong> Non è possibile prevedere tutto ciò che un utente potrebbe dire. E quando il modello si imbatte in qualcosa che non rientra nei suoi dati di addestramento, si orienta verso risposte generiche e non impegnative.</p></li>
<li><p><strong>Il debug è doloroso e costoso:</strong> Quando un agente si comporta male, è quasi impossibile individuare la regola che ha causato il problema. Poiché tutto vive all'interno di un enorme prompt di sistema, l'unico modo per risolvere il problema è riscrivere il prompt e testare nuovamente tutto da zero.</p></li>
</ul>
<h2 id="What-is-Parlant-and-How-It-Works" class="common-anchor-header">Cos'è Parlant e come funziona<button data-href="#What-is-Parlant-and-How-It-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Parlant è un motore di allineamento open-source per agenti LLM. È possibile controllare con precisione il comportamento di un agente in diversi scenari, modellando il suo processo decisionale in modo strutturato e basato su regole.</p>
<p>Per risolvere i problemi riscontrati nei framework di agenti tradizionali, Parlant introduce un nuovo e potente approccio: <strong>Alignment Modeling</strong>. La sua idea centrale è quella di separare la definizione delle regole dall'esecuzione delle stesse, garantendo che solo le regole più rilevanti vengano iniettate nel contesto dell'LLM in qualsiasi momento.</p>
<h3 id="Granular-Guidelines-The-Core-of-Alignment-Modeling" class="common-anchor-header">Linee guida granulari: Il cuore della modellazione dell'allineamento</h3><p>Il cuore del modello di allineamento di Parlant è il concetto di <strong>linee guida granulari</strong>. Invece di scrivere un'enorme richiesta di sistema piena di regole, si definiscono piccole linee guida modulari, ognuna delle quali descrive come l'agente dovrebbe gestire un tipo specifico di situazione.</p>
<p>Ogni linea guida è composta da tre parti:</p>
<ul>
<li><p><strong>Condizione</strong> - Una descrizione in linguaggio naturale di quando la regola dovrebbe essere applicata. Parlant converte questa condizione in un vettore semantico e la confronta con l'input dell'utente per capire se è rilevante.</p></li>
<li><p><strong>Azione</strong> - Un'istruzione chiara che definisce come l'agente deve rispondere una volta soddisfatta la condizione. Questa azione viene iniettata nel contesto dell'LLM solo quando viene attivata.</p></li>
<li><p><strong>Strumenti</strong> - Qualsiasi funzione o API esterna legata a quella specifica regola. Sono esposti all'agente solo quando la linea guida è attiva, mantenendo l'uso degli strumenti controllato e consapevole del contesto.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">await</span> agent.<span class="hljs-title function_">create_guideline</span>(
    condition=<span class="hljs-string">&quot;The user asks about a refund and the order amount exceeds 500 RMB&quot;</span>,
    action=<span class="hljs-string">&quot;First call the order status check tool to confirm whether the refund conditions are met, then provide a detailed explanation of the refund process&quot;</span>,
    tools=[check_order_status, calculate_refund_amount]
)
<button class="copy-code-btn"></button></code></pre>
<p>Ogni volta che un utente interagisce con l'agente, Parlant esegue una fase di corrispondenza leggera per trovare le tre-cinque linee guida più rilevanti. Solo queste regole vengono inserite nel contesto del modello, mantenendo i suggerimenti concisi e mirati e garantendo che l'agente segua sempre le regole giuste.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/guideline_system_652fb287ce.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Supervising-Mechanism-for-Accuracy-and-Consistency" class="common-anchor-header">Meccanismo di supervisione per precisione e coerenza</h3><p>Per mantenere ulteriormente l'accuratezza e la coerenza, Parlant introduce un <strong>meccanismo di supervisione</strong> che agisce come un secondo livello di controllo della qualità. Il processo si svolge in tre fasi:</p>
<p><strong>1.</strong> L'agente crea<strong>una risposta</strong> iniziale in base alle linee guida e al contesto della conversazione in corso.</p>
<p><strong>2. Verifica della conformità</strong> - La risposta viene confrontata con le linee guida attive per verificare che ogni istruzione sia stata seguita correttamente.</p>
<p><strong>3. Revisione o conferma</strong> - Se si riscontrano problemi, il sistema corregge l'output; se tutto è a posto, la risposta viene approvata e inviata all'utente.</p>
<p>Questo meccanismo di supervisione assicura che l'agente non solo comprenda le regole, ma le rispetti effettivamente prima di rispondere, migliorando sia l'affidabilità che il controllo.</p>
<h3 id="Conditional-Transitions-for-Control-and-Safety" class="common-anchor-header">Transizioni condizionali per il controllo e la sicurezza</h3><p>Nei framework di agenti tradizionali, ogni strumento disponibile è sempre esposto all'LLM. Questo approccio "tutto sul tavolo" porta spesso a richieste sovraccariche e a chiamate di strumenti non volute. Parlant risolve questo problema con le <strong>transizioni condizionali</strong>. Analogamente al funzionamento delle macchine a stati, un'azione o uno strumento viene attivato solo quando viene soddisfatta una condizione specifica. Ogni strumento è strettamente legato alla linea guida corrispondente e diventa disponibile solo quando la condizione di quella linea guida è attivata.</p>
<pre><code translate="no"><span class="hljs-comment"># The balance inquiry tool is exposed only when the condition &quot;the user wants to make a transfer&quot; is met</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
    condition=<span class="hljs-string">&quot;The user wants to make a transfer&quot;</span>,
    action=<span class="hljs-string">&quot;First check the account balance. If the balance is below 500 RMB, remind the user that an overdraft fee may apply.&quot;</span>,
    tools=[get_user_account_balance]
)
<button class="copy-code-btn"></button></code></pre>
<p>Questo meccanismo trasforma l'invocazione di uno strumento in una transizione condizionale: gli strumenti passano da "inattivi" ad "attivi" solo quando le loro condizioni di attivazione sono soddisfatte. Strutturando l'esecuzione in questo modo, Parlant garantisce che ogni azione avvenga in modo deliberato e contestuale, prevenendo gli abusi e migliorando l'efficienza e la sicurezza del sistema.</p>
<h2 id="How-Milvus-Powers-Parlant" class="common-anchor-header">Come Milvus alimenta Parlant<button data-href="#How-Milvus-Powers-Parlant" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando guardiamo sotto il cofano del processo di abbinamento delle linee guida di Parlant, una sfida tecnica fondamentale diventa chiara: come può il sistema trovare le tre o cinque regole più rilevanti tra centinaia o addirittura migliaia di opzioni in pochi millisecondi? È proprio qui che entra in gioco un database vettoriale. Il reperimento semantico è ciò che lo rende possibile.</p>
<h3 id="How-Milvus-Supports-Parlant’s-Guideline-Matching-Process" class="common-anchor-header">Come Milvus supporta il processo di abbinamento delle linee guida di Parlant</h3><p>La corrispondenza delle linee guida funziona attraverso la similarità semantica. Il campo Condizione di ogni linea guida viene convertito in un embedding vettoriale, che ne cattura il significato piuttosto che il solo testo letterale. Quando un utente invia un messaggio, Parlant confronta la semantica del messaggio con tutte le incorporazioni di linee guida memorizzate per trovare quelle più rilevanti.</p>
<p>Ecco come funziona il processo, passo dopo passo:</p>
<p><strong>1. Codifica della richiesta</strong> - Il messaggio dell'utente e la cronologia delle conversazioni recenti vengono trasformati in un vettore di richieste.</p>
<p><strong>2. Ricerca della somiglianza</strong> - Il sistema esegue una ricerca di somiglianza all'interno del vettore di linee guida per trovare le corrispondenze più vicine.</p>
<p><strong>3. Recupero dei risultati Top-K</strong> - Vengono restituite le tre-cinque linee guida semanticamente più rilevanti.</p>
<p><strong>4. Iniezione nel contesto</strong> - Queste linee guida corrispondenti vengono inserite dinamicamente nel contesto dell'LLM, in modo che il modello possa agire secondo le regole corrette.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/guideline_matching_process_ffd874c77e.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Per rendere possibile questo flusso di lavoro, il database vettoriale deve offrire tre funzionalità fondamentali: ricerca approssimata dei vicini (ANN) ad alte prestazioni, filtraggio flessibile dei metadati e aggiornamenti in tempo reale dei vettori. <a href="https://milvus.io/"><strong>Milvus</strong></a>, il database vettoriale open-source e cloud-native, offre prestazioni di livello produttivo in tutte e tre le aree.</p>
<p>Per capire come funziona Milvus in scenari reali, prendiamo come esempio un agente di servizi finanziari.</p>
<p>Supponiamo che il sistema definisca 800 linee guida aziendali che coprono attività come la richiesta di un conto, il trasferimento di fondi e la consultazione di prodotti di gestione patrimoniale. In questa configurazione, Milvus funge da livello di archiviazione e recupero di tutti i dati delle linee guida.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType
<span class="hljs-keyword">import</span> parlant.sdk <span class="hljs-keyword">as</span> p

<span class="hljs-comment"># Connect to Milvus</span>
connections.connect(host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)

<span class="hljs-comment"># Define the schema for the guideline collection</span>
fields = [
    FieldSchema(name=<span class="hljs-string">&quot;guideline_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>, is_primary=<span class="hljs-literal">True</span>),
    FieldSchema(name=<span class="hljs-string">&quot;condition_vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>),
    FieldSchema(name=<span class="hljs-string">&quot;condition_text&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">1000</span>),
    FieldSchema(name=<span class="hljs-string">&quot;action_text&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>),
    FieldSchema(name=<span class="hljs-string">&quot;priority&quot;</span>, dtype=DataType.INT64),
    FieldSchema(name=<span class="hljs-string">&quot;business_domain&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
]
schema = CollectionSchema(fields=fields, description=<span class="hljs-string">&quot;Agent Guidelines&quot;</span>)
guideline_collection = Collection(name=<span class="hljs-string">&quot;agent_guidelines&quot;</span>, schema=schema)

<span class="hljs-comment"># Create an HNSW index for high-performance retrieval</span>
index_params = {
    <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;HNSW&quot;</span>,
    <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
    <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
}
guideline_collection.create_index(field_name=<span class="hljs-string">&quot;condition_vector&quot;</span>, index_params=index_params)
<button class="copy-code-btn"></button></code></pre>
<p>Ora, quando un utente dice "Voglio trasferire 100.000 RMB sul conto di mia madre", il flusso di runtime è:</p>
<p><strong>1. Rettifica della query</strong> - Converte l'input dell'utente in un vettore a 768 dimensioni.</p>
<p><strong>2. Recupero ibrido</strong> - Eseguire una ricerca di similarità vettoriale in Milvus con filtraggio dei metadati (ad esempio, <code translate="no">business_domain=&quot;transfer&quot;</code>).</p>
<p><strong>3. Classifica dei risultati</strong> - Classifica le linee guida candidate in base ai punteggi di somiglianza combinati con i loro valori <strong>di priorità</strong>.</p>
<p><strong>4. Iniezione del contesto</strong> - Iniettare il sito <code translate="no">action_text</code> delle prime tre linee guida nel contesto dell'agente Parlant.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/bank_transfer_use_case_481d09a407.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>In questa configurazione, Milvus offre una latenza P99 inferiore a 15 ms, anche quando la libreria di linee guida raggiunge le 100.000 voci. In confronto, l'uso di un database relazionale tradizionale con la corrispondenza delle parole chiave comporta in genere una latenza superiore a 200 ms e un'accuratezza di corrispondenza significativamente inferiore.</p>
<h3 id="How-Milvus-Enables-Long-Term-Memory-and-Personalization" class="common-anchor-header">Come Milvus permette la memoria a lungo termine e la personalizzazione</h3><p>Milvus fa molto di più della corrispondenza alle linee guida. In scenari in cui gli agenti hanno bisogno di una memoria a lungo termine e di risposte personalizzate, Milvus può fungere da strato di memoria che memorizza e recupera le interazioni passate degli utenti come embeddings vettoriali, aiutando l'agente a ricordare ciò che è stato discusso in precedenza.</p>
<pre><code translate="no"><span class="hljs-comment"># store user’s past interactions</span>
user_memory_fields = [
    FieldSchema(name=<span class="hljs-string">&quot;interaction_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>, is_primary=<span class="hljs-literal">True</span>),
    FieldSchema(name=<span class="hljs-string">&quot;user_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">50</span>),
    FieldSchema(name=<span class="hljs-string">&quot;interaction_vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>),
    FieldSchema(name=<span class="hljs-string">&quot;interaction_summary&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">500</span>),
    FieldSchema(name=<span class="hljs-string">&quot;timestamp&quot;</span>, dtype=DataType.INT64)
]
memory_collection = Collection(name=<span class="hljs-string">&quot;user_memory&quot;</span>, schema=CollectionSchema(user_memory_fields))
<button class="copy-code-btn"></button></code></pre>
<p>Quando lo stesso utente ritorna, l'agente può recuperare le interazioni storiche più rilevanti da Milvus e usarle per generare un'esperienza più connessa e simile a quella umana. Ad esempio, se un utente ha chiesto informazioni su un fondo di investimento la settimana scorsa, l'agente può ricordare quel contesto e rispondere in modo proattivo: "Bentornato! Ha ancora domande sul fondo di cui abbiamo parlato l'ultima volta?".</p>
<h3 id="How-to-Optimize-Performance-for-Milvus-Powered-Agent-Systems" class="common-anchor-header">Come ottimizzare le prestazioni dei sistemi di agenti alimentati da Milvus</h3><p>Quando si implementa un sistema di agenti alimentato da Milvus in un ambiente di produzione, la messa a punto delle prestazioni diventa fondamentale. Per ottenere una bassa latenza e un elevato throughput, è necessario prestare attenzione a diversi parametri chiave:</p>
<p><strong>1. Scelta del tipo di indice giusto</strong></p>
<p>È importante selezionare la struttura di indice appropriata. Ad esempio, HNSW (Hierarchical Navigable Small World) è ideale per gli scenari ad alto richiamo, come la finanza o la sanità, dove la precisione è fondamentale. IVF_FLAT funziona meglio per applicazioni su larga scala come le raccomandazioni del commercio elettronico, dove un richiamo leggermente inferiore è accettabile in cambio di prestazioni più veloci e di un uso ridotto della memoria.</p>
<p><strong>2. Strategia di sharding</strong></p>
<p>Quando il numero di linee guida memorizzate supera il milione di voci, si consiglia di utilizzare la <strong>partizione</strong> per dividere i dati in base al dominio aziendale o al caso d'uso. Il partizionamento riduce lo spazio di ricerca per ogni query, migliorando la velocità di recupero e mantenendo stabile la latenza anche quando il set di dati cresce.</p>
<p><strong>3. Configurazione della cache</strong></p>
<p>Per le linee guida ad accesso frequente, come le query standard dei clienti o i flussi di lavoro ad alto traffico, è possibile utilizzare la cache dei risultati delle query di Milvus. Ciò consente al sistema di riutilizzare i risultati precedenti, riducendo la latenza a meno di 5 millisecondi per le ricerche ripetute.</p>
<h2 id="Hands-on-Demo-How-to-Build-a-Smart-QA-System-with-Parlant-and-Milvus-Lite" class="common-anchor-header">Dimostrazione pratica: Come costruire un sistema intelligente di domande e risposte con Parlant e Milvus Lite<button data-href="#Hands-on-Demo-How-to-Build-a-Smart-QA-System-with-Parlant-and-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/install-overview.md">Milvus Lite</a> è una versione leggera di Milvus, una libreria Python che può essere facilmente integrata nelle applicazioni. È ideale per la prototipazione rapida in ambienti come Jupyter Notebook o per l'esecuzione su dispositivi edge e smart con risorse di calcolo limitate. Nonostante l'ingombro ridotto, Milvus Lite supporta le stesse API delle altre distribuzioni Milvus. Ciò significa che il codice lato client scritto per Milvus Lite può essere collegato senza problemi a un'istanza completa di Milvus o Zilliz Cloud in un secondo momento, senza bisogno di refactoring.</p>
<p>In questa demo, utilizzeremo Milvus Lite insieme a Parlant per dimostrare come costruire un sistema intelligente di domande e risposte che fornisca risposte rapide e consapevoli del contesto con una configurazione minima.</p>
<h3 id="Prerequisites" class="common-anchor-header">Prerequisiti: 1.Parlant GitHub</h3><p>1.Parlant GitHub: https://github.com/emcie-co/parlant</p>
<p>2.Documentazione di Parlant: https://parlant.io/docs</p>
<p>3.python3.10+</p>
<p>4.OpenAI_key</p>
<p>5.MlivusLite</p>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">Passo 1: Installare le dipendenze</h3><pre><code translate="no"><span class="hljs-comment"># Install required Python packages</span>
pip install pymilvus parlant openai
<span class="hljs-comment"># Or, if you’re using a Conda environment:</span>
conda activate your_env_name
pip install pymilvus parlant openai
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Configure-Environment-Variables" class="common-anchor-header">Passo 2: Configurare le variabili d'ambiente</h3><pre><code translate="no"><span class="hljs-comment"># Set your OpenAI API key</span>
<span class="hljs-built_in">export</span> OPENAI_API_KEY=<span class="hljs-string">&quot;your_openai_api_key_here&quot;</span>
<span class="hljs-comment"># Verify that the variable is set correctly</span>
<span class="hljs-built_in">echo</span> <span class="hljs-variable">$OPENAI_API_KEY</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Implement-the-Core-Code" class="common-anchor-header">Passo 3: implementare il codice principale</h3><ul>
<li>Creare un embedder OpenAI personalizzato</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">class</span> <span class="hljs-title class_">OpenAIEmbedder</span>(p.Embedder):
    <span class="hljs-comment"># Converts text into vector embeddings with built-in timeout and retry</span>
    <span class="hljs-comment"># Dimension: 1536 (text-embedding-3-small)</span>
    <span class="hljs-comment"># Timeout: 60 seconds; Retries: up to 2 times</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Inizializzare la base di conoscenza</li>
</ul>
<p>1. Creare una raccolta Milvus denominata kb_articles.</p>
<p>2. Inserire dati di esempio (ad es. politica di rimborso, politica di cambio, tempi di spedizione).</p>
<p>3. Creare un indice HNSW per accelerare il recupero.</p>
<ul>
<li>Costruire lo strumento di ricerca vettoriale</li>
</ul>
<pre><code translate="no"><span class="hljs-meta">@p.tool</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">vector_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span>, min_score: <span class="hljs-built_in">float</span> = <span class="hljs-number">0.35</span></span>):
    <span class="hljs-comment"># 1. Convert user query into a vector</span>
    <span class="hljs-comment"># 2. Perform similarity search in Milvus</span>
    <span class="hljs-comment"># 3. Return results with relevance above threshold</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Configurare l'agente Parlant</li>
</ul>
<p><strong>Linea guida 1:</strong> Per le domande relative ai fatti o alle politiche, l'agente deve prima eseguire una ricerca vettoriale.</p>
<p><strong>Linea guida 2:</strong> Quando viene trovata una prova, l'agente deve rispondere utilizzando un modello strutturato (riassunto + punti chiave + fonti).</p>
<pre><code translate="no"><span class="hljs-comment"># Guideline 1: Run vector search for factual or policy-related questions</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;User asks a factual question about policy, refund, exchange, or shipping&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Call vector_search with the user&#x27;s query. &quot;</span>
                <span class="hljs-string">&quot;If evidence is found, synthesize an answer by quoting key sentences and cite doc_id/title. &quot;</span>
                <span class="hljs-string">&quot;If evidence is insufficient, ask a clarifying question before answering.&quot;</span>
            ),
            tools=[vector_search],

<span class="hljs-comment"># Guideline 2: Use a standardized, structured response when evidence is available</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;Evidence is available&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Answer with the following template:\\n&quot;</span>
                <span class="hljs-string">&quot;Summary: provide a concise conclusion.\\n&quot;</span>
                <span class="hljs-string">&quot;Key points: 2-3 bullets distilled from evidence.\\n&quot;</span>
                <span class="hljs-string">&quot;Sources: list doc_id and title.\\n&quot;</span>
                <span class="hljs-string">&quot;Note: if confidence is low, state limitations and ask for clarification.&quot;</span>
            ),
            tools=[],
        )

    tools=[],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Scrivere il codice completo</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>, <span class="hljs-type">Any</span>
<span class="hljs-keyword">import</span> parlant.sdk <span class="hljs-keyword">as</span> p
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType
<span class="hljs-comment"># 1) Environment variables: using OpenAI (as both the default generation model and embedding service)</span>
<span class="hljs-comment"># Make sure the OPENAI_API_KEY is set</span>
OPENAI_API_KEY = os.environ.get(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> OPENAI_API_KEY:
    <span class="hljs-keyword">raise</span> RuntimeError(<span class="hljs-string">&quot;Please set OPENAI_API_KEY environment variable&quot;</span>)
<span class="hljs-comment"># 2) Initialize Milvus Lite (runs locally, no standalone service required)</span>
<span class="hljs-comment"># MilvusClient runs in Lite mode using a local file path (requires pymilvus &gt;= 2.x)</span>
client = MilvusClient(<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)  <span class="hljs-comment"># Lite mode uses a local file path</span>
COLLECTION = <span class="hljs-string">&quot;kb_articles&quot;</span>
<span class="hljs-comment"># 3) Example data: three policy or FAQ entries (in practice, you can load and chunk data from files)</span>
DOCS = [
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;POLICY-001&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Refund Policy&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Refunds are available within 30 days of purchase if the product is unused.&quot;</span>},
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;POLICY-002&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Exchange Policy&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Exchanges are permitted within 15 days; original packaging required.&quot;</span>},
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;FAQ-101&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Shipping Time&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Standard shipping usually takes 3–5 business days within the country.&quot;</span>},
]
<span class="hljs-comment"># 4) Generate embeddings using OpenAI (you can replace this with another embedding service)</span>
<span class="hljs-comment"># Here we use Parlant’s built-in OpenAI embedder for simplicity, but you could also call the OpenAI SDK directly.</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">OpenAIEmbedder</span>(p.Embedder):
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">self, texts: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>], hints: <span class="hljs-type">Dict</span>[<span class="hljs-built_in">str</span>, <span class="hljs-type">Any</span>] = {}</span>) -&gt; p.EmbeddingResult:
        <span class="hljs-comment"># Generate text embeddings using the OpenAI API, with timeout and retry handling</span>
        <span class="hljs-keyword">import</span> openai
        <span class="hljs-keyword">try</span>:
            client = openai.AsyncOpenAI(
                api_key=OPENAI_API_KEY,
                timeout=<span class="hljs-number">60.0</span>,  <span class="hljs-comment"># 60-second timeout</span>
                max_retries=<span class="hljs-number">2</span>  <span class="hljs-comment"># Retry up to 2 times</span>
            )
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Generating embeddings for <span class="hljs-subst">{<span class="hljs-built_in">len</span>(texts)}</span> texts...&quot;</span>)
            response = <span class="hljs-keyword">await</span> client.embeddings.create(
                model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>,
                <span class="hljs-built_in">input</span>=texts
            )
            vectors = [data.embedding <span class="hljs-keyword">for</span> data <span class="hljs-keyword">in</span> response.data]
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully generated <span class="hljs-subst">{<span class="hljs-built_in">len</span>(vectors)}</span> embeddings.&quot;</span>)
            <span class="hljs-keyword">return</span> p.EmbeddingResult(vectors=vectors)
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;OpenAI API call failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-comment"># Return mock vectors for testing Milvus connectivity</span>
            <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Using mock vectors for testing...&quot;</span>)
            <span class="hljs-keyword">import</span> random
            vectors = [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">1536</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> texts]
            <span class="hljs-keyword">return</span> p.EmbeddingResult(vectors=vectors)
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">id</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">max_tokens</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">int</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-number">8192</span>
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">tokenizer</span>(<span class="hljs-params">self</span>) -&gt; p.EstimatingTokenizer:
        <span class="hljs-keyword">from</span> parlant.core.nlp.tokenization <span class="hljs-keyword">import</span> ZeroEstimatingTokenizer
        <span class="hljs-keyword">return</span> ZeroEstimatingTokenizer()
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">dimensions</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">int</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-number">1536</span>
embedder = OpenAIEmbedder()
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">ensure_collection_and_load</span>():
    <span class="hljs-comment"># Create the collection (schema: primary key, vector field, additional fields)</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> client.has_collection(COLLECTION):
        client.create_collection(
            collection_name=COLLECTION,
            dimension=<span class="hljs-built_in">len</span>((<span class="hljs-keyword">await</span> embedder.embed([<span class="hljs-string">&quot;dimension_probe&quot;</span>])).vectors[<span class="hljs-number">0</span>]),
            <span class="hljs-comment"># Default metric: COSINE (can be changed with metric_type=&quot;COSINE&quot;)</span>
            auto_id=<span class="hljs-literal">True</span>,
        )
        <span class="hljs-comment"># Create an index to speed up retrieval (HNSW used here as an example)</span>
        client.create_index(
            collection_name=COLLECTION,
            field_name=<span class="hljs-string">&quot;vector&quot;</span>,
            index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
            metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
            params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">32</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
        )
    <span class="hljs-comment"># Insert data (skip if already exists; simple idempotent logic for the demo)</span>
    <span class="hljs-comment"># Generate embeddings</span>
    chunks = [d[<span class="hljs-string">&quot;chunk&quot;</span>] <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> DOCS]
    embedding_result = <span class="hljs-keyword">await</span> embedder.embed(chunks)
    vectors = embedding_result.vectors
    <span class="hljs-comment"># Check if the same doc_id already exists; this is for demo purposes only — real applications should use stricter deduplication</span>
    <span class="hljs-comment"># Here we insert directly. In production, use an upsert operation or an explicit primary key</span>
    client.insert(
        COLLECTION,
        data=[
            {<span class="hljs-string">&quot;vector&quot;</span>: vectors[i], <span class="hljs-string">&quot;doc_id&quot;</span>: DOCS[i][<span class="hljs-string">&quot;doc_id&quot;</span>], <span class="hljs-string">&quot;title&quot;</span>: DOCS[i][<span class="hljs-string">&quot;title&quot;</span>], <span class="hljs-string">&quot;chunk&quot;</span>: DOCS[i][<span class="hljs-string">&quot;chunk&quot;</span>]}
            <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(DOCS))
        ],
    )
    <span class="hljs-comment"># Load into memory</span>
    client.load_collection(COLLECTION)
<span class="hljs-comment"># 5) Define the vector search tool (Parlant Tool)</span>
<span class="hljs-meta">@p.tool</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">vector_search</span>(<span class="hljs-params">context: p.ToolContext, query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span>, min_score: <span class="hljs-built_in">float</span> = <span class="hljs-number">0.35</span></span>) -&gt; p.ToolResult:
    <span class="hljs-comment"># 5.1 Generate the query vector</span>
    embed_res = <span class="hljs-keyword">await</span> embedder.embed([query])
    qvec = embed_res.vectors[<span class="hljs-number">0</span>]
    <span class="hljs-comment"># 5.2 Search Milvus</span>
    results = client.search(
        collection_name=COLLECTION,
        data=[qvec],
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;doc_id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">128</span>}},
    )
    <span class="hljs-comment"># 5.3 Assemble structured evidence and filter by score threshold</span>
    hits = []
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
        score = hit[<span class="hljs-string">&quot;distance&quot;</span>] <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;distance&quot;</span> <span class="hljs-keyword">in</span> hit <span class="hljs-keyword">else</span> hit.get(<span class="hljs-string">&quot;score&quot;</span>, <span class="hljs-number">0.0</span>)
        <span class="hljs-keyword">if</span> score &gt;= min_score:
            hits.append({
                <span class="hljs-string">&quot;doc_id&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;doc_id&quot;</span>],
                <span class="hljs-string">&quot;title&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;title&quot;</span>],
                <span class="hljs-string">&quot;chunk&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;chunk&quot;</span>],
                <span class="hljs-string">&quot;score&quot;</span>: <span class="hljs-built_in">float</span>(score),
            })
    <span class="hljs-keyword">return</span> p.ToolResult({<span class="hljs-string">&quot;evidence&quot;</span>: hits})
<span class="hljs-comment"># 6) Run Parlant Server and create the Agent + Guidelines</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():
    <span class="hljs-keyword">await</span> ensure_collection_and_load()
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> p.Server() <span class="hljs-keyword">as</span> server:
        agent = <span class="hljs-keyword">await</span> server.create_agent(
            name=<span class="hljs-string">&quot;Policy Assistant&quot;</span>,
            description=<span class="hljs-string">&quot;Rule-controlled RAG assistant with Milvus Lite&quot;</span>,
        )
        <span class="hljs-comment"># Example variable: current time (can be used in templates or logs)</span>
<span class="hljs-meta">        @p.tool</span>
        <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">get_datetime</span>(<span class="hljs-params">context: p.ToolContext</span>) -&gt; p.ToolResult:
            <span class="hljs-keyword">from</span> datetime <span class="hljs-keyword">import</span> datetime
            <span class="hljs-keyword">return</span> p.ToolResult({<span class="hljs-string">&quot;now&quot;</span>: datetime.now().isoformat()})
        <span class="hljs-keyword">await</span> agent.create_variable(name=<span class="hljs-string">&quot;current-datetime&quot;</span>, tool=get_datetime)
        <span class="hljs-comment"># Core Guideline 1: Run vector search for factual or policy-related questions</span>
        <span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;User asks a factual question about policy, refund, exchange, or shipping&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Call vector_search with the user&#x27;s query. &quot;</span>
                <span class="hljs-string">&quot;If evidence is found, synthesize an answer by quoting key sentences and cite doc_id/title. &quot;</span>
                <span class="hljs-string">&quot;If evidence is insufficient, ask a clarifying question before answering.&quot;</span>
            ),
            tools=[vector_search],
        )
        <span class="hljs-comment"># Core Guideline 2: Use a standardized, structured response when evidence is available</span>
        <span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;Evidence is available&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Answer with the following template:\\n&quot;</span>
                <span class="hljs-string">&quot;Summary: provide a concise conclusion.\\n&quot;</span>
                <span class="hljs-string">&quot;Key points: 2-3 bullets distilled from evidence.\\n&quot;</span>
                <span class="hljs-string">&quot;Sources: list doc_id and title.\\n&quot;</span>
                <span class="hljs-string">&quot;Note: if confidence is low, state limitations and ask for clarification.&quot;</span>
            ),
            tools=[],
        )
        <span class="hljs-comment"># Hint: Local Playground URL</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Playground: &lt;http://localhost:8800&gt;&quot;</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    asyncio.run(main())
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Run-the-Code" class="common-anchor-header">Fase 4: Eseguire il codice</h3><pre><code translate="no"><span class="hljs-comment"># Run the main program</span>
python main.py
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/python_main_eb7d7c6d73.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ul>
<li>Visitare il parco giochi:</li>
</ul>
<pre><code translate="no">&lt;<span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:8800&gt;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Avete costruito con successo un sistema intelligente di domande e risposte utilizzando Parlant e Milvus.</p>
<h2 id="Parlant-vs-LangChainLlamaIndex-How-They-Differ-and-How-They-Work-Together" class="common-anchor-header">Parlant vs. LangChain/LlamaIndex: Come si differenziano e come lavorano insieme<button data-href="#Parlant-vs-LangChainLlamaIndex-How-They-Differ-and-How-They-Work-Together" class="anchor-icon" translate="no">
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
    </button></h2><p>Rispetto ai framework di agenti esistenti come <strong>LangChain</strong> o <strong>LlamaIndex</strong>, in cosa si differenzia Parlant?</p>
<p>LangChain e LlamaIndex sono framework di uso generale. Offrono un'ampia gamma di componenti e integrazioni, che li rendono ideali per la prototipazione rapida e gli esperimenti di ricerca. Tuttavia, quando si tratta di distribuire in produzione, gli sviluppatori devono spesso costruire da soli dei livelli aggiuntivi, come la gestione delle regole, i controlli di conformità e i meccanismi di affidabilità, per mantenere gli agenti coerenti e affidabili.</p>
<p>Parlant offre una gestione delle linee guida integrata, meccanismi di autocritica e strumenti di spiegabilità che aiutano gli sviluppatori a gestire il comportamento, le risposte e le motivazioni di un agente. Ciò rende Parlant particolarmente adatto a casi d'uso ad alto rischio e rivolti al cliente, in cui l'accuratezza e la responsabilità sono importanti, come nel settore finanziario, sanitario e legale.</p>
<p>In effetti, questi framework possono lavorare insieme:</p>
<ul>
<li><p>Utilizzate LangChain per costruire complesse pipeline di elaborazione dei dati o flussi di lavoro di recupero.</p></li>
<li><p>Usate Parlant per gestire il livello finale di interazione, assicurando che i risultati seguano le regole aziendali e rimangano interpretabili.</p></li>
<li><p>Usare Milvus come base del database vettoriale per fornire ricerca semantica in tempo reale, memoria e recupero della conoscenza in tutto il sistema.</p></li>
</ul>
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
    </button></h2><p>Nel momento in cui gli agenti LLM passano dalla sperimentazione alla produzione, la domanda chiave non è più cosa possono fare, ma quanto possono farlo in modo affidabile e sicuro. Parlant fornisce la struttura e il controllo per l'affidabilità, mentre Milvus offre un'infrastruttura vettoriale scalabile che mantiene tutto veloce e consapevole del contesto.</p>
<p>Insieme, consentono agli sviluppatori di creare agenti di intelligenza artificiale non solo capaci, ma anche affidabili, spiegabili e pronti per la produzione.</p>
<p>🚀 Scoprite<a href="https://github.com/emcie-co/parlant?utm_source=chatgpt.com"> Parlant su GitHub</a> e integratelo con<a href="https://milvus.io"> Milvus</a> per costruire il vostro sistema di agenti intelligenti e guidati da regole.</p>
<p>Avete domande o volete un approfondimento su una qualsiasi funzione? Unitevi al nostro<a href="https://discord.com/invite/8uyFbECzPX"> canale Discord</a> o inviate problemi su<a href="https://github.com/milvus-io/milvus"> GitHub</a>. È anche possibile prenotare una sessione individuale di 20 minuti per ottenere approfondimenti, indicazioni e risposte alle vostre domande attraverso<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
