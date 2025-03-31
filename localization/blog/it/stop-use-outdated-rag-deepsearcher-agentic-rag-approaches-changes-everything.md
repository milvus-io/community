---
id: >-
  stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md
title: >-
  Smettere di usare RAG obsoleti: l'approccio RAG agenziale di DeepSearcher
  cambia le cose
author: Cheney Zhang
date: 2025-03-23T00:00:00.000Z
cover: >-
  assets.zilliz.com/Stop_Using_Outdated_RAG_Deep_Searcher_s_Agentic_RAG_Approach_Changes_Everything_b2eaa644cf.png
tag: Engineering
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md
---
<h2 id="The-Shift-to-AI-Powered-Search-with-LLMs-and-Deep-Research" class="common-anchor-header">Il passaggio alla ricerca alimentata dall'intelligenza artificiale con LLM e ricerca approfondita<button data-href="#The-Shift-to-AI-Powered-Search-with-LLMs-and-Deep-Research" class="anchor-icon" translate="no">
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
    </button></h2><p>L'evoluzione della tecnologia di ricerca è progredita notevolmente nel corso dei decenni: dal recupero basato sulle parole chiave negli anni precedenti al 2000 alle esperienze di ricerca personalizzate nel 2010. Stiamo assistendo all'emergere di soluzioni basate sull'intelligenza artificiale in grado di gestire query complesse che richiedono un'analisi approfondita e professionale.</p>
<p>Deep Research di OpenAI è un esempio di questo cambiamento, in quanto utilizza capacità di ragionamento per sintetizzare grandi quantità di informazioni e generare rapporti di ricerca in più fasi. Ad esempio, alla domanda "Qual è la ragionevole capitalizzazione di mercato di Tesla?". Deep Research è in grado di analizzare in modo completo le finanze aziendali, le traiettorie di crescita del business e le stime del valore di mercato.</p>
<p>Deep Research implementa una forma avanzata del framework RAG (Retrieval-Augmented Generation). Il RAG tradizionale migliora i risultati dei modelli linguistici recuperando e incorporando informazioni esterne rilevanti. L'approccio di OpenAI va oltre, implementando cicli iterativi di recupero e ragionamento. Invece di una singola fase di recupero, Deep Research genera dinamicamente più interrogazioni, valuta i risultati intermedi e affina la strategia di ricerca, dimostrando come le tecniche di RAG avanzate o agenziali possano fornire contenuti di alta qualità e di livello aziendale che assomigliano più a ricerche professionali che a semplici risposte a domande.</p>
<h2 id="DeepSearcher-A-Local-Deep-Research-Bringing-Agentic-RAG-to-Everyone" class="common-anchor-header">DeepSearcher: Una ricerca profonda locale che porta la RAG agenziale a tutti<button data-href="#DeepSearcher-A-Local-Deep-Research-Bringing-Agentic-RAG-to-Everyone" class="anchor-icon" translate="no">
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
    </button></h2><p>Ispirati da questi progressi, gli sviluppatori di tutto il mondo hanno creato le proprie implementazioni. Gli ingegneri di Zilliz hanno costruito e reso open-source il progetto <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>, che può essere considerato una Deep Research locale e open-source. Questo progetto ha ottenuto oltre 4.900 stelle su GitHub in meno di un mese.</p>
<p>DeepSearcher ridefinisce la ricerca aziendale basata sull'intelligenza artificiale, combinando la potenza di modelli di ragionamento avanzati, sofisticate funzioni di ricerca e un assistente di ricerca integrato. Integrando i dati locali tramite <a href="https://milvus.io/docs/overview.md">Milvus</a> (un database vettoriale open source ad alte prestazioni), DeepSearcher offre risultati più rapidi e pertinenti, consentendo agli utenti di scambiare facilmente i modelli principali per un'esperienza personalizzata.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_1_Deep_Searcher_s_star_history_9c1a064ed8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 1:</em> <em>La storia delle stelle di DeepSearcher</em><a href="https://www.star-history.com/#zilliztech/deep-searcher&amp;Date"><em>(Fonte</em></a><em>)</em></p>
<p>In questo articolo esploreremo l'evoluzione dalla RAG tradizionale alla RAG agenziale, analizzando ciò che rende questi approcci diversi a livello tecnico. Parleremo poi dell'implementazione di DeepSearcher, mostrando come sfrutta le capacità degli agenti intelligenti per consentire ragionamenti dinamici e multigiro, e perché questo è importante per gli sviluppatori che costruiscono soluzioni di ricerca di livello aziendale.</p>
<h2 id="From-Traditional-RAG-to-Agentic-RAG-The-Power-of-Iterative-Reasoning" class="common-anchor-header">Dalla RAG tradizionale alla RAG agenziale: il potere del ragionamento iterativo<button data-href="#From-Traditional-RAG-to-Agentic-RAG-The-Power-of-Iterative-Reasoning" class="anchor-icon" translate="no">
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
    </button></h2><p>Agentic RAG migliora il framework RAG tradizionale incorporando capacità di agenti intelligenti. DeepSearcher è un ottimo esempio di struttura RAG agenziale. Attraverso la pianificazione dinamica, il ragionamento in più fasi e il processo decisionale autonomo, stabilisce un processo a ciclo chiuso che recupera, elabora, convalida e ottimizza i dati per risolvere problemi complessi.</p>
<p>La crescente popolarità di Agentic RAG è dovuta ai significativi progressi nelle capacità di ragionamento dei modelli linguistici di grandi dimensioni (LLM), in particolare alla loro migliore capacità di scomporre problemi complessi e di mantenere catene di pensiero coerenti in più fasi.</p>
<table>
<thead>
<tr><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Dimensione di confronto</strong></td><td><strong>RAG tradizionale</strong></td><td><strong>RAG Agentico</strong></td></tr>
<tr><td>Approccio centrale</td><td>Passivo e reattivo</td><td>Proattivo, guidato da agenti</td></tr>
<tr><td>Flusso di processo</td><td>Reperimento e generazione in un solo passaggio (processo unico)</td><td>Recupero e generazione dinamici, in più fasi (perfezionamento iterativo)</td></tr>
<tr><td>Strategia di reperimento</td><td>Ricerca per parola chiave fissa, dipendente dall'interrogazione iniziale</td><td>Recupero adattivo (ad esempio, affinamento delle parole chiave, cambio di fonte di dati)</td></tr>
<tr><td>Gestione di query complesse</td><td>Generazione diretta; soggetta a errori in caso di dati contrastanti.</td><td>Decomposizione del compito → reperimento mirato → sintesi della risposta</td></tr>
<tr><td>Capacità di interazione</td><td>Si basa interamente sull'input dell'utente; nessuna autonomia</td><td>Impegno proattivo (ad esempio, chiarimento di ambiguità, richiesta di dettagli)</td></tr>
<tr><td>Correzione degli errori e feedback</td><td>Nessuna autocorrezione; limitata dai risultati iniziali</td><td>Convalida iterativa → recupero autogestito per la precisione</td></tr>
<tr><td>Casi d'uso ideali</td><td>Semplici domande e risposte, ricerca di fatti</td><td>Ragionamento complesso, risoluzione di problemi in più fasi, compiti aperti</td></tr>
<tr><td>Esempio</td><td>L'utente chiede: "Cos'è l'informatica quantistica?" → Il sistema restituisce una definizione da manuale</td><td>L'utente chiede: "Come può l'informatica quantistica ottimizzare la logistica?". → Il sistema recupera i principi quantistici e gli algoritmi logistici, quindi sintetizza le intuizioni attuabili</td></tr>
</tbody>
</table>
<p>A differenza della RAG tradizionale, che si basa su un'unica interrogazione, la RAG agenziale scompone la domanda in più sotto-domande e affina iterativamente la ricerca fino a raggiungere una risposta soddisfacente. Questa evoluzione offre tre vantaggi principali:</p>
<ul>
<li><p><strong>Risoluzione proattiva dei problemi:</strong> Il sistema passa dalla reazione passiva alla soluzione attiva dei problemi.</p></li>
<li><p><strong>Recupero dinamico e multigiro:</strong> Invece di eseguire una ricerca una tantum, il sistema regola continuamente le sue richieste e si autocorregge in base al feedback continuo.</p></li>
<li><p><strong>Applicabilità più ampia:</strong> Si estende oltre il fact-checking di base per gestire attività di ragionamento complesse e generare report completi.</p></li>
</ul>
<p>Sfruttando queste capacità, le applicazioni Agentic RAG come DeepSearcher funzionano come un esperto umano, fornendo non solo la risposta finale, ma anche un resoconto completo e trasparente del processo di ragionamento e dei dettagli di esecuzione.</p>
<p>A lungo termine, l'Agentic RAG è destinato a superare i sistemi RAG di base. Gli approcci convenzionali spesso faticano ad affrontare la logica sottostante le interrogazioni degli utenti, che richiedono ragionamenti iterativi, riflessione e ottimizzazione continua.</p>
<h2 id="What-Does-an-Agentic-RAG-Architecture-Look-Like-DeepSearcher-as-an-Example" class="common-anchor-header">Come si presenta un'architettura RAG agenziale? DeepSearcher come esempio<button data-href="#What-Does-an-Agentic-RAG-Architecture-Look-Like-DeepSearcher-as-an-Example" class="anchor-icon" translate="no">
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
    </button></h2><p>Ora che abbiamo compreso la potenza dei sistemi agenziali RAG, come si presenta la loro architettura? Prendiamo come esempio DeepSearcher.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_2_Two_Modules_Within_Deep_Searcher_baf5ca5952.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 2: Due moduli di DeepSearcher</em></p>
<p>L'architettura di DeepSearcher è composta da due moduli principali:</p>
<h3 id="1-Data-Ingestion-Module" class="common-anchor-header">1. Modulo di ingestione dei dati</h3><p>Questo modulo collega varie fonti di dati proprietarie di terze parti tramite un database vettoriale Milvus. È particolarmente utile per gli ambienti aziendali che si basano su set di dati proprietari. Il modulo gestisce:</p>
<ul>
<li><p>Analisi dei documenti e chunking</p></li>
<li><p>Generazione di incorporazioni</p></li>
<li><p>Memorizzazione e indicizzazione dei vettori</p></li>
<li><p>Gestione dei metadati per un recupero efficiente</p></li>
</ul>
<h3 id="2-Online-Reasoning-and-Query-Module" class="common-anchor-header">2. Modulo di ragionamento e interrogazione online</h3><p>Questo componente implementa diverse strategie di agenti all'interno del framework RAG per fornire risposte precise e perspicaci. Opera su un ciclo dinamico e iterativo: dopo ogni recupero di dati, il sistema riflette se le informazioni accumulate rispondono sufficientemente alla domanda originale. In caso negativo, viene attivata un'altra iterazione; in caso affermativo, viene generato il report finale.</p>
<p>Questo ciclo continuo di "follow-up" e "riflessione" rappresenta un miglioramento fondamentale rispetto ad altri approcci RAG di base. Mentre il RAG tradizionale esegue un processo di recupero e generazione in un'unica soluzione, l'approccio iterativo di DeepSearcher rispecchia il modo in cui i ricercatori umani lavorano: ponendo le domande iniziali, valutando le informazioni ricevute, identificando le lacune e perseguendo nuove linee di indagine.</p>
<h2 id="How-Effective-is-DeepSearcher-and-What-Use-Cases-is-It-Best-Suited-For" class="common-anchor-header">Quanto è efficace DeepSearcher e per quali casi d'uso è più adatto?<button data-href="#How-Effective-is-DeepSearcher-and-What-Use-Cases-is-It-Best-Suited-For" class="anchor-icon" translate="no">
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
    </button></h2><p>Una volta installato e configurato, DeepSearcher indicizza i file locali attraverso il database vettoriale Milvus. Quando si invia una query, viene eseguita una ricerca completa e approfondita dei contenuti indicizzati. Un vantaggio fondamentale per gli sviluppatori è che il sistema registra ogni fase del suo processo di ricerca e ragionamento, fornendo trasparenza su come è arrivato alle sue conclusioni, una caratteristica fondamentale per il debug e l'ottimizzazione dei sistemi RAG.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_3_Accelerated_Playback_of_Deep_Searcher_Iteration_0c36baea2f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 3: Riproduzione accelerata dell'iterazione di DeepSearcher</em></p>
<p>Questo approccio consuma più risorse computazionali rispetto alla RAG tradizionale, ma fornisce risultati migliori per le query complesse. Analizziamo due casi d'uso specifici per i quali DeepSearcher è più adatto.</p>
<h3 id="1-Overview-Type-Queries" class="common-anchor-header">1. Query di tipo panoramico</h3><p>Le query di tipo panoramico, come la generazione di report, la stesura di documenti o la sintesi delle tendenze, forniscono un argomento breve ma richiedono un risultato esaustivo e dettagliato.</p>
<p>Per esempio, quando si interroga &quot;Come sono cambiati i Simpson nel tempo?&quot;, DeepSearcher genera prima una serie iniziale di sotto-query:</p>
<pre><code translate="no">_Break down the original query <span class="hljs-keyword">into</span> <span class="hljs-keyword">new</span> sub queries: [_

_<span class="hljs-string">&#x27;How has the cultural impact and societal relevance of The Simpsons evolved from its debut to the present?&#x27;</span>,_

_<span class="hljs-string">&#x27;What changes in character development, humor, and storytelling styles have occurred across different seasons of The Simpsons?&#x27;</span>,_

_<span class="hljs-string">&#x27;How has the animation style and production technology of The Simpsons changed over time?&#x27;</span>,_

_<span class="hljs-string">&#x27;How have audience demographics, reception, and ratings of The Simpsons shifted throughout its run?&#x27;</span>]_
<button class="copy-code-btn"></button></code></pre>
<p>Recupera le informazioni rilevanti e poi itera con un feedback per affinare la ricerca, generando le sotto-query successive:</p>
<pre><code translate="no">_New search queries <span class="hljs-keyword">for</span> <span class="hljs-built_in">next</span> iteration: [_

_<span class="hljs-string">&quot;How have changes in The Simpsons&#x27; voice cast and production team influenced the show&#x27;s evolution over different seasons?&quot;</span>,_

_<span class="hljs-string">&quot;What role has The Simpsons&#x27; satire and social commentary played in its adaptation to contemporary issues across decades?&quot;</span>,_

_<span class="hljs-string">&#x27;How has The Simpsons addressed and incorporated shifts in media consumption, such as streaming services, into its distribution and content strategies?&#x27;</span>]_
<button class="copy-code-btn"></button></code></pre>
<p>Ogni iterazione si basa sulla precedente e culmina in un rapporto completo che copre diverse sfaccettature dell'argomento, strutturato con sezioni del tipo:</p>
<pre><code translate="no">**<span class="hljs-title class_">Report</span>: <span class="hljs-title class_">The</span> <span class="hljs-title class_">Evolution</span> <span class="hljs-keyword">of</span> _The <span class="hljs-title class_">Simpsons</span>_ (<span class="hljs-number">1989</span>–<span class="hljs-title class_">Present</span>)**
**<span class="hljs-number">1.</span> <span class="hljs-title class_">Cultural</span> <span class="hljs-title class_">Impact</span> and <span class="hljs-title class_">Societal</span> <span class="hljs-title class_">Relevance</span>** 
_The <span class="hljs-title class_">Simpsons</span>_ debuted <span class="hljs-keyword">as</span> a subversive critique <span class="hljs-keyword">of</span> <span class="hljs-title class_">American</span> middle-<span class="hljs-keyword">class</span> <span class="hljs-title class_">life</span>, gaining notoriety <span class="hljs-keyword">for</span> its bold satire <span class="hljs-keyword">in</span> the 1990s. <span class="hljs-title class_">Initially</span> a countercultural phenomenon, it challenged norms <span class="hljs-keyword">with</span> episodes tackling religion, politics, and consumerism. <span class="hljs-title class_">Over</span> time, its cultural dominance waned <span class="hljs-keyword">as</span> competitors like _South <span class="hljs-title class_">Park</span>_ and _Family <span class="hljs-title class_">Guy</span>_ pushed boundaries further. <span class="hljs-title class_">By</span> the 2010s, the show transitioned <span class="hljs-keyword">from</span> trendsetter to nostalgic institution, balancing legacy appeal <span class="hljs-keyword">with</span> attempts to address modern issues like climate change and <span class="hljs-variable constant_">LGBTQ</span>+ rights, albeit <span class="hljs-keyword">with</span> less societal resonance.
**<span class="hljs-number">2.</span> <span class="hljs-title class_">Character</span> <span class="hljs-title class_">Development</span> and <span class="hljs-title class_">Storytelling</span> <span class="hljs-title class_">Shifts</span>** 
<span class="hljs-title class_">Early</span> seasons featured nuanced character <span class="hljs-title function_">arcs</span> (e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Lisa</span>’s activism, <span class="hljs-title class_">Marge</span>’s resilience), but later seasons saw <span class="hljs-string">&quot;Flanderization&quot;</span> (exaggerating traits, e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Homer</span>’s stupidity, <span class="hljs-title class_">Ned</span> <span class="hljs-title class_">Flanders</span>’ piety). <span class="hljs-title class_">Humor</span> evolved <span class="hljs-keyword">from</span> witty, character-driven satire to reliance on pop culture references and meta-humor. <span class="hljs-title class_">Serialized</span> storytelling <span class="hljs-keyword">in</span> early episodes gave way to episodic, gag-focused plots, often sacrificing emotional depth <span class="hljs-keyword">for</span> absurdity.
[...]
**<span class="hljs-number">12.</span> <span class="hljs-title class_">Merchandising</span> and <span class="hljs-title class_">Global</span> <span class="hljs-title class_">Reach</span>** 
<span class="hljs-title class_">The</span> 1990s merchandise <span class="hljs-title function_">boom</span> (action figures, _Simpsons_-themed cereals) faded, but the franchise persists via <span class="hljs-title function_">collaborations</span> (e.<span class="hljs-property">g</span>., _Fortnite_ skins, <span class="hljs-title class_">Lego</span> sets). <span class="hljs-title class_">International</span> adaptations include localized dubbing and culturally tailored <span class="hljs-title function_">episodes</span> (e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Japanese</span> _Itchy &amp; <span class="hljs-title class_">Scratchy</span>_ variants).
**<span class="hljs-title class_">Conclusion</span>** 
_The <span class="hljs-title class_">Simpsons</span>_ evolved <span class="hljs-keyword">from</span> a radical satire to a television institution, navigating shifts <span class="hljs-keyword">in</span> technology, politics, and audience expectations. <span class="hljs-title class_">While</span> its golden-age brilliance remains unmatched, its adaptability—through streaming, updated humor, and <span class="hljs-variable language_">global</span> outreach—secures its place <span class="hljs-keyword">as</span> a cultural touchstone. <span class="hljs-title class_">The</span> show’s longevity reflects both nostalgia and a pragmatic embrace <span class="hljs-keyword">of</span> change, even <span class="hljs-keyword">as</span> it grapples <span class="hljs-keyword">with</span> the challenges <span class="hljs-keyword">of</span> relevance <span class="hljs-keyword">in</span> a fragmented media landscape.
<button class="copy-code-btn"></button></code></pre>
<p><em>(Per brevità, vengono mostrati solo estratti del processo e del report finale)</em></p>
<p>La relazione finale fornisce un'analisi approfondita con citazioni adeguate e un'organizzazione strutturata.</p>
<h3 id="2-Complex-Reasoning-Queries" class="common-anchor-header">2. Query di ragionamento complesse</h3><p>Le interrogazioni complesse coinvolgono più livelli di logica ed entità interconnesse.</p>
<p>Si consideri l'interrogazione: "Quale film ha il regista più anziano, Il dono di Dio alle donne o Aldri annet enn bråk?".</p>
<p>Sebbene questa domanda possa sembrare semplice per un essere umano, i semplici sistemi RAG hanno difficoltà a risolverla perché la risposta non è memorizzata direttamente nella base di conoscenza. DeepSearcher affronta questa sfida scomponendo la domanda in sotto-domande più piccole:</p>
<pre><code translate="no">[<span class="hljs-string">&quot;Who is the director of God&#x27;S Gift To Women?&quot;</span>, <span class="hljs-string">&#x27;Who is the director of Aldri annet enn bråk?&#x27;</span>, <span class="hljs-string">&#x27;What are the ages of the respective directors?&#x27;</span>, <span class="hljs-string">&#x27;Which director is older?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Prima recupera le informazioni sui registi di entrambi i film,</p>
<pre><code translate="no">The director of <span class="hljs-string">&quot;God&#x27;s Gift To Women&quot;</span> <span class="hljs-keyword">is</span> Michael Curtiz, the director of <span class="hljs-string">&quot;Aldri annet enn bråk&quot;</span> <span class="hljs-keyword">is</span> Edith Carlmar
<button class="copy-code-btn"></button></code></pre>
<p>poi genera delle sotto-interrogazioni:</p>
<pre><code translate="no">[<span class="hljs-string">&quot;Find the birthdate of Michael Curtiz, the director of God&#x27;s Gift To Women&quot;</span>, <span class="hljs-string">&#x27;Find the birthdate of Edith Carlmar, the director of Aldri annet enn bråk&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>e poi estrae le loro date di nascita e infine le confronta per determinare la risposta corretta:</p>
<pre><code translate="no">The director of <span class="hljs-string">&quot;God&#x27;s Gift To Women&quot;</span> <span class="hljs-keyword">is</span> Michael Curtiz, who was born <span class="hljs-keyword">on</span> December <span class="hljs-number">24</span>, <span class="hljs-number">1886</span> <span class="hljs-keyword">and</span> passed away <span class="hljs-keyword">on</span> April <span class="hljs-number">11</span>, <span class="hljs-number">1962.</span> He was a Hungarian-born American film director known <span class="hljs-keyword">for</span> his prolific career <span class="hljs-keyword">in</span> Hollywood.
On the other hand, the director of <span class="hljs-string">&quot;Aldri annet enn bråk&quot;</span> <span class="hljs-keyword">is</span> Edith Carlmar, who was born <span class="hljs-keyword">on</span> November <span class="hljs-number">15</span>, <span class="hljs-number">1911</span> <span class="hljs-keyword">and</span> passed away <span class="hljs-keyword">on</span> May <span class="hljs-number">17</span>, <span class="hljs-number">2003.</span>
Therefore, Michael Curtiz <span class="hljs-keyword">is</span> older than Edith Carlmar.
<button class="copy-code-btn"></button></code></pre>
<p>Al contrario, un sistema RAG convenzionale potrebbe perdere dettagli chiave a causa di un recupero limitato in un unico passaggio, con il rischio di ottenere risposte <a href="https://zilliz.com/blog/decoding-llm-hallucinations-deep-dive-into-llm-errors">allucinate</a> o imprecise:</p>
<pre><code translate="no"><span class="hljs-number">1.</span> **Aldri annet enn bråk** (<span class="hljs-number">1954</span>) <span class="hljs-keyword">is</span> directed <span class="hljs-keyword">by</span> **Edith Carlmar**, who was born <span class="hljs-keyword">on</span> November <span class="hljs-number">15</span>, <span class="hljs-number">1911.</span>
<span class="hljs-number">2.</span> The related chunks did <span class="hljs-keyword">not</span> provide specific details about the director of <span class="hljs-string">&quot;God&#x27;s Gift to Women.&quot;</span> However, <span class="hljs-keyword">if</span> we look at external sources <span class="hljs-keyword">for</span> <span class="hljs-string">&quot;God&#x27;s Gift to Women,&quot;</span> the film was directed <span class="hljs-keyword">by</span> **L. M. (Lyman) Steinberg**, who was born <span class="hljs-keyword">on</span> December <span class="hljs-number">19</span>, <span class="hljs-number">1905.</span>
By comparing their birth dates:
- Edith Carlmar: November <span class="hljs-number">15</span>, <span class="hljs-number">1911</span>
- L. M. Steinberg: December <span class="hljs-number">19</span>, <span class="hljs-number">1905</span>
**Conclusion**: L. M. Steinberg, the director of <span class="hljs-string">&quot;God&#x27;s Gift to Women,&quot;</span> <span class="hljs-keyword">is</span> older than Edith Carlmar, the director of <span class="hljs-string">&quot;Aldri annet enn bråk.&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>DeepSearcher si distingue per l'esecuzione di ricerche profonde e iterative su dati locali importati. Registra ogni fase del processo di ragionamento e alla fine fornisce un rapporto completo e unificato. Questo lo rende particolarmente efficace per le interrogazioni di tipo panoramico, come la generazione di rapporti dettagliati o la sintesi delle tendenze, e per le interrogazioni di ragionamento complesse che richiedono la scomposizione di una domanda in sotto-domande più piccole e l'aggregazione dei dati attraverso più cicli di feedback.</p>
<p>Nella prossima sezione, confronteremo DeepSearcher con altri sistemi RAG, esplorando come il suo approccio iterativo e l'integrazione flessibile dei modelli si collochino rispetto ai metodi tradizionali.</p>
<h2 id="Quantitative-Comparison-DeepSearcher-vs-Traditional-RAG" class="common-anchor-header">Confronto quantitativo: DeepSearcher vs. RAG tradizionale<button data-href="#Quantitative-Comparison-DeepSearcher-vs-Traditional-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Nel repository GitHub di DeepSearcher abbiamo reso disponibile il codice per i test quantitativi. Per questa analisi abbiamo utilizzato il popolare dataset 2WikiMultiHopQA. (Nota: abbiamo valutato solo le prime 50 voci per gestire il consumo di token API, ma le tendenze generali rimangono chiare).</p>
<h3 id="Recall-Rate-Comparison" class="common-anchor-header">Confronto del tasso di richiamo</h3><p>Come mostrato nella Figura 4, il tasso di richiamo migliora significativamente con l'aumento del numero di iterazioni massime:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_4_Max_Iterations_vs_Recall_18a8d6e9bf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 4: Iterazioni massime vs. richiamo</em></p>
<p>Dopo un certo punto, i miglioramenti marginali si riducono: per questo motivo, di solito impostiamo il valore predefinito a 3 iterazioni, anche se questo valore può essere modificato in base alle esigenze specifiche.</p>
<h3 id="Token-Consumption-Analysis" class="common-anchor-header">Analisi del consumo di token</h3><p>Abbiamo anche misurato l'utilizzo totale dei token per 50 query con un diverso numero di iterazioni:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_5_Max_Iterations_vs_Token_Usage_6d1d44b114.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 5: Iterazioni massime e consumo di token</em></p>
<p>I risultati mostrano che il consumo di token aumenta linearmente con l'aumentare delle iterazioni. Ad esempio, con 4 iterazioni, DeepSearcher consuma circa 0,3 milioni di token. Utilizzando una stima approssimativa basata sul prezzo di gpt-4o-mini di OpenAI di <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0,</mn><mi>60/1Moutputtokens</mi><mo separator="true">, che</mo><mi>equivale a un</mi><mi>costo</mi><mi>medio di circa 0</mi></mrow><annotation encoding="application/x-tex">,60/1M token di output, questo equivale a un costo medio di circa</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,</span><span class="mord mathnormal">60/1Moutputtokens</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">che equivale a un costo medio di</span><span class="mord mathnormal">circa</span><span class="mord mathnormal">0</span></span></span></span>,0036 per query (o circa 0,18 dollari per 50 query).</p>
<p>Per i modelli di inferenza ad alta intensità di risorse, i costi sarebbero più volte superiori a causa del prezzo più alto per token e dei token in uscita più grandi.</p>
<h3 id="Model-Performance-Comparison" class="common-anchor-header">Confronto delle prestazioni del modello</h3><p>Un vantaggio significativo di DeepSearcher è la sua flessibilità nel passare da un modello all'altro. Abbiamo testato diversi modelli di inferenza e non (come gpt-4o-mini). Complessivamente, i modelli di inferenza, in particolare Claude 3.7 Sonnet, hanno avuto le prestazioni migliori, anche se le differenze non sono state eclatanti.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_6_Average_Recall_by_Model_153c93f616.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 6: Richiamo medio per modello</em></p>
<p>In particolare, alcuni piccoli modelli non di inferenza a volte non riuscivano a completare l'intero processo di interrogazione dell'agente a causa della loro limitata capacità di seguire le istruzioni, una sfida comune a molti sviluppatori che lavorano con sistemi simili.</p>
<h2 id="DeepSearcher-Agentic-RAG-vs-Graph-RAG" class="common-anchor-header">DeepSearcher (Agentic RAG) vs. Graph RAG<button data-href="#DeepSearcher-Agentic-RAG-vs-Graph-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/blog/graphrag-explained-enhance-rag-with-knowledge-graphs">Graph RAG</a> è anche in grado di gestire query complesse, in particolare query multi-hop. Qual è allora la differenza tra DeepSearcher (Agentic RAG) e Graph RAG?</p>
<p>Graph RAG è progettato per interrogare documenti basati su collegamenti relazionali espliciti, il che lo rende particolarmente forte nelle interrogazioni multi-hop. Ad esempio, quando si elabora un lungo romanzo, Graph RAG può estrarre con precisione le intricate relazioni tra i personaggi. Tuttavia, questo metodo richiede un uso sostanziale di token durante l'importazione dei dati per mappare queste relazioni e la sua modalità di interrogazione tende a essere rigida, tipicamente efficace solo per le interrogazioni a relazione singola.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_7_Graph_RAG_vs_Deep_Searcher_a5c7130374.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 7: Graph RAG vs DeepSearcher</em></p>
<p>Al contrario, Agentic RAG, come esemplificato da DeepSearcher, adotta un approccio fondamentalmente diverso. Riduce al minimo il consumo di token durante l'importazione dei dati e investe invece risorse computazionali durante l'elaborazione delle query. Questa scelta progettuale crea importanti compromessi tecnici:</p>
<ol>
<li><p>Costi iniziali più bassi: DeepSearcher richiede una minore pre-elaborazione dei documenti, rendendo la configurazione iniziale più veloce e meno costosa.</p></li>
<li><p>Gestione dinamica delle query: Il sistema può modificare al volo la propria strategia di reperimento in base ai risultati intermedi.</p></li>
<li><p>Costi più elevati per ogni interrogazione: Ogni interrogazione richiede più calcoli rispetto a Graph RAG, ma fornisce risultati più flessibili.</p></li>
</ol>
<p>Per gli sviluppatori, questa distinzione è fondamentale quando si progettano sistemi con diversi modelli di utilizzo. Graph RAG può essere più efficiente per applicazioni con schemi di query prevedibili e un elevato volume di query, mentre l'approccio di DeepSearcher eccelle in scenari che richiedono flessibilità e gestione di query imprevedibili e complesse.</p>
<p>In prospettiva, con la riduzione del costo dei LLM e il continuo miglioramento delle prestazioni di inferenza, è probabile che i sistemi agenziali di RAG come DeepSearcher diventino sempre più diffusi. Lo svantaggio del costo computazionale diminuirà, mentre il vantaggio della flessibilità rimarrà.</p>
<h2 id="DeepSearcher-vs-Deep-Research" class="common-anchor-header">DeepSearcher vs. Deep Research<button data-href="#DeepSearcher-vs-Deep-Research" class="anchor-icon" translate="no">
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
    </button></h2><p>A differenza di Deep Research di OpenAI, DeepSearcher è specificamente concepito per il reperimento e l'analisi di dati privati. Sfruttando un database vettoriale, DeepSearcher è in grado di ingerire diverse fonti di dati, integrare vari tipi di dati e memorizzarli in modo uniforme in un archivio di conoscenze vettoriale. Le sue solide capacità di ricerca semantica gli consentono di cercare in modo efficiente tra grandi quantità di dati offline.</p>
<p>Inoltre, DeepSearcher è completamente open source. Deep Research, pur rimanendo un leader nella qualità della generazione di contenuti, prevede un canone mensile e opera come prodotto closed-source, il che significa che i suoi processi interni sono nascosti agli utenti. Al contrario, DeepSearcher offre una trasparenza totale: gli utenti possono esaminare il codice, personalizzarlo in base alle proprie esigenze o addirittura implementarlo nei propri ambienti di produzione.</p>
<h2 id="Technical-Insights" class="common-anchor-header">Approfondimenti tecnici<button data-href="#Technical-Insights" class="anchor-icon" translate="no">
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
    </button></h2><p>Nel corso dello sviluppo e delle successive iterazioni di DeepSearcher, abbiamo raccolto diverse importanti intuizioni tecniche:</p>
<h3 id="Inference-Models-Effective-but-Not-Infallible" class="common-anchor-header">Modelli di inferenza: Efficaci ma non infallibili</h3><p>I nostri esperimenti hanno rivelato che, sebbene i modelli di inferenza funzionino bene come agenti, a volte analizzano in modo eccessivo le istruzioni più semplici, causando un consumo eccessivo di token e tempi di risposta più lenti. Questa osservazione è in linea con l'approccio dei principali fornitori di IA come OpenAI, che non distinguono più tra modelli di inferenza e non. Al contrario, i servizi di modello dovrebbero determinare automaticamente la necessità dell'inferenza in base a requisiti specifici per conservare i token.</p>
<h3 id="The-Imminent-Rise-of-Agentic-RAG" class="common-anchor-header">L'imminente ascesa della RAG agenziale</h3><p>Dal punto di vista della domanda, la generazione di contenuti profondi è essenziale; tecnicamente, anche il miglioramento dell'efficacia della RAG è fondamentale. Nel lungo periodo, il costo è la principale barriera all'adozione diffusa della RAG agenziale. Tuttavia, con l'emergere di LLM di alta qualità ed efficaci dal punto di vista dei costi, come DeepSeek-R1, e con la riduzione dei costi determinata dalla Legge di Moore, le spese associate ai servizi di inferenza sono destinate a diminuire.</p>
<h3 id="The-Hidden-Scaling-Limit-of-Agentic-RAG" class="common-anchor-header">Il limite nascosto di scalabilità della RAG agenziale</h3><p>Un risultato fondamentale della nostra ricerca riguarda la relazione tra prestazioni e risorse computazionali. Inizialmente, abbiamo ipotizzato che il semplice aumento del numero di iterazioni e dell'allocazione dei token avrebbe migliorato proporzionalmente i risultati per le query complesse.</p>
<p>I nostri esperimenti hanno rivelato una realtà più sfumata: sebbene le prestazioni migliorino con l'aumento delle iterazioni, abbiamo osservato dei chiari rendimenti decrescenti. In particolare:</p>
<ul>
<li><p>Le prestazioni aumentano nettamente da 1 a 3 iterazioni.</p></li>
<li><p>i miglioramenti da 3 a 5 iterazioni sono stati modesti</p></li>
<li><p>Oltre le 5 iterazioni, i guadagni erano trascurabili, nonostante un aumento significativo del consumo di token.</p></li>
</ul>
<p>Questa constatazione ha importanti implicazioni per gli sviluppatori: il semplice aumento delle risorse computazionali nei sistemi RAG non è l'approccio più efficiente. La qualità della strategia di reperimento, della logica di decomposizione e del processo di sintesi è spesso più importante del numero di iterazioni. Ciò suggerisce che gli sviluppatori dovrebbero concentrarsi sull'ottimizzazione di questi componenti piuttosto che aumentare il budget di token.</p>
<h3 id="The-Evolution-Beyond-Traditional-RAG" class="common-anchor-header">L'evoluzione oltre la RAG tradizionale</h3><p>Il RAG tradizionale offre una preziosa efficienza grazie al suo approccio a basso costo e a un singolo recupero, che lo rende adatto a scenari di risposta a domande semplici. I suoi limiti diventano però evidenti quando si gestiscono interrogazioni con una logica implicita complessa.</p>
<p>Consideriamo una domanda dell'utente del tipo "Come guadagnare 100 milioni in un anno". Un sistema RAG tradizionale potrebbe recuperare contenuti sulle carriere ad alto reddito o sulle strategie di investimento, ma faticherebbe a..:</p>
<ol>
<li><p>Identificare le aspettative non realistiche nella query</p></li>
<li><p>scomporre il problema in sotto-obiettivi fattibili</p></li>
<li><p>sintetizzare le informazioni provenienti da più domini (business, finanza, imprenditorialità)</p></li>
<li><p>Presentare un approccio strutturato e multi-path con tempistiche realistiche.</p></li>
</ol>
<p>È qui che i sistemi Agentic RAG come DeepSearcher mostrano la loro forza. Scomponendo query complesse e applicando ragionamenti in più fasi, possono fornire risposte complete e sfumate che rispondono meglio alle esigenze informative dell'utente. Man mano che questi sistemi diventano più efficienti, ci aspettiamo di vederne accelerare l'adozione nelle applicazioni aziendali.</p>
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
    </button></h2><p>DeepSearcher rappresenta un'evoluzione significativa nella progettazione di sistemi RAG, offrendo agli sviluppatori un quadro potente per la creazione di capacità di ricerca e di ricerca più sofisticate. I suoi principali vantaggi tecnici sono</p>
<ol>
<li><p>Ragionamento iterativo: La capacità di scomporre interrogazioni complesse in sottofasi logiche e di costruire progressivamente verso risposte complete.</p></li>
<li><p>Architettura flessibile: Supporto per la sostituzione dei modelli sottostanti e per la personalizzazione del processo di ragionamento in base alle esigenze specifiche dell'applicazione.</p></li>
<li><p>Integrazione con i database vettoriali: Connessione perfetta a Milvus per l'archiviazione e il recupero efficiente delle incorporazioni vettoriali da fonti di dati private.</p></li>
<li><p>Esecuzione trasparente: Registrazione dettagliata di ogni fase del ragionamento, che consente agli sviluppatori di eseguire il debug e ottimizzare il comportamento del sistema.</p></li>
</ol>
<p>I nostri test sulle prestazioni confermano che DeepSearcher fornisce risultati superiori per le query complesse rispetto agli approcci RAG tradizionali, anche se con evidenti compromessi in termini di efficienza computazionale. La configurazione ottimale (in genere circa 3 iterazioni) bilancia l'accuratezza con il consumo di risorse.</p>
<p>Con la continua diminuzione dei costi dell'LLM e il miglioramento delle capacità di ragionamento, l'approccio Agentic RAG implementato in DeepSearcher diventerà sempre più pratico per le applicazioni di produzione. Per gli sviluppatori che lavorano alla ricerca aziendale, agli assistenti di ricerca o ai sistemi di gestione della conoscenza, DeepSearcher offre una potente base open-source che può essere personalizzata in base ai requisiti specifici del dominio.</p>
<p>Accogliamo con favore i contributi della comunità degli sviluppatori e vi invitiamo a esplorare questo nuovo paradigma di implementazione delle RAG consultando il nostro <a href="https://github.com/zilliztech/deep-searcher">repository GitHub</a>.</p>
