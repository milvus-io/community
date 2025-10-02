---
id: how-to-debug-slow-requests-in-milvus.md
title: Come risolvere il problema delle richieste di ricerca lente in Milvus
author: Jael Gu
date: 2025-10-02T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Oct_2_2025_10_52_33_AM_min_fdb227d8c6.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database, slow requests, debug Milvus'
meta_title: |
  How to Debug Slow Search Requests in Milvus
desc: >-
  In questo post, vi illustreremo come gestire le richieste lente in Milvus e
  condivideremo le misure pratiche che potete adottare per mantenere la latenza
  prevedibile, stabile e costantemente bassa.
origin: 'https://milvus.io/blog/how-to-debug-slow-requests-in-milvus.md'
---
<p>Le prestazioni sono il cuore di Milvus. In condizioni normali, una richiesta di ricerca in Milvus viene completata in pochi millisecondi. Ma cosa succede quando il cluster rallenta, quando la latenza di ricerca si estende a interi secondi?</p>
<p>Le ricerche lente non si verificano spesso, ma possono emergere su scala o con carichi di lavoro complessi. E quando si verificano, sono importanti: disturbano l'esperienza dell'utente, alterano le prestazioni dell'applicazione e spesso rivelano inefficienze nascoste nella configurazione.</p>
<p>In questo post spiegheremo come gestire le richieste lente in Milvus e condivideremo le misure pratiche che potete adottare per mantenere la latenza prevedibile, stabile e costantemente bassa.</p>
<h2 id="Identifying-Slow-Searches" class="common-anchor-header">Identificare le ricerche lente<button data-href="#Identifying-Slow-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>La diagnosi di una richiesta lenta inizia con due domande: <strong>quanto spesso accade e dove va il tempo?</strong> Milvus fornisce entrambe le risposte attraverso le metriche e i log.</p>
<h3 id="Milvus-Metrics" class="common-anchor-header">Metriche Milvus</h3><p>Milvus esporta metriche dettagliate che possono essere monitorate in dashboard Grafana.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_2_64a5881bf2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_3_b7b8b369ec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>I pannelli principali includono:</p>
<ul>
<li><p><strong>Qualità del servizio → Query lenta</strong>: Contrassegna qualsiasi richiesta che superi il valore proxy.slowQuerySpanInSeconds (default: 5s). Queste sono contrassegnate anche in Prometheus.</p></li>
<li><p><strong>Qualità del servizio → Latenza di ricerca</strong>: Mostra la distribuzione complessiva della latenza. Se sembra normale, ma gli utenti finali notano comunque dei ritardi, il problema è probabilmente esterno a Milvus, a livello di rete o di applicazione.</p></li>
<li><p><strong>Nodo di interrogazione → Latenza di ricerca per fase</strong>: Suddivide la latenza in fasi di coda, interrogazione e riduzione. Per un'attribuzione più approfondita, pannelli come <em>Scalar</em> <em>Filter Latency</em>, <em>Vector Search Latency</em> e <em>Wait Safe Latency</em> rivelano quale fase domina.</p></li>
</ul>
<h3 id="Milvus-Logs" class="common-anchor-header">Registri Milvus</h3><p>Milvus registra anche tutte le richieste che durano più di un secondo, etichettate con marcatori come [Search slow]. Questi registri mostrano <em>quali sono le</em> query lente, integrando <em>le</em> informazioni ricavate dalle metriche. Come regola generale:</p>
<ul>
<li><p><strong>&lt; 30 ms</strong> → latenza di ricerca sana nella maggior parte degli scenari</p></li>
<li><p><strong>&gt; 100 ms</strong> → vale la pena indagare</p></li>
<li><p><strong>&gt; 1 s</strong> → decisamente lento e richiede attenzione</p></li>
</ul>
<p>Esempio di log:</p>
<pre><code translate="no">[<span class="hljs-number">2025</span>/<span class="hljs-number">08</span>/<span class="hljs-number">23</span> <span class="hljs-number">19</span>:<span class="hljs-number">22</span>:<span class="hljs-number">19.900</span> +<span class="hljs-number">00</span>:<span class="hljs-number">00</span>] [INFO] [proxy/impl.<span class="hljs-keyword">go</span>:<span class="hljs-number">3141</span>] [<span class="hljs-string">&quot;Search slow&quot;</span>] [traceID=<span class="hljs-number">9100</span>b3092108604716f1472e4c7d54e4] [role=proxy] [db=<span class="hljs-keyword">default</span>] [collection=my_repos] [partitions=<span class="hljs-string">&quot;[]&quot;</span>] [dsl=<span class="hljs-string">&quot;user == \&quot;milvus-io\&quot; &amp;&amp; repo == \&quot;proxy.slowQuerySpanInSeconds\&quot;&quot;</span>] [<span class="hljs-built_in">len</span>(PlaceholderGroup)=<span class="hljs-number">8204</span>] [OutputFields=<span class="hljs-string">&quot;[user,repo,path,descripion]&quot;</span>] [search_params=<span class="hljs-string">&quot;[{\&quot;key\&quot;:\&quot;topk\&quot;,\&quot;value\&quot;:\&quot;10\&quot;},{\&quot;key\&quot;:\&quot;metric_type\&quot;,\&quot;value\&quot;:\&quot;COSINE\&quot;},{\&quot;key\&quot;:\&quot;anns_field\&quot;,\&quot;value\&quot;:\&quot;vector\&quot;},{\&quot;key\&quot;:\&quot;params\&quot;,\&quot;value\&quot;:\&quot;{\\\&quot;nprobe\\\&quot;:256,\\\&quot;metric_type\\\&quot;:\\\&quot;COSINE\\\&quot;}\&quot;}]&quot;</span>] [ConsistencyLevel=Strong] [useDefaultConsistency=<span class="hljs-literal">true</span>] [guarantee_timestamp=<span class="hljs-number">460318735832711168</span>] [nq=<span class="hljs-number">1</span>] [duration=<span class="hljs-number">5</span>m12<span class="hljs-number">.002784545</span>s] [durationPerNq=<span class="hljs-number">5</span>m12<span class="hljs-number">.002784545</span>s]
<button class="copy-code-btn"></button></code></pre>
<p>In breve, le <strong>metriche dicono dove va il tempo; i log dicono quali sono le query che vengono colpite.</strong></p>
<h2 id="Analyzing-Root-Cause" class="common-anchor-header">Analizzare la causa principale<button data-href="#Analyzing-Root-Cause" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Heavy-Workload" class="common-anchor-header">Carico di lavoro pesante</h3><p>Una causa comune di richieste lente è un carico di lavoro eccessivo. Quando una richiesta ha un <strong>NQ</strong> (numero di query per richiesta) molto elevato, può essere eseguita per un periodo prolungato e monopolizzare le risorse del nodo di query. Le altre richieste si accumulano dietro di essa, con conseguente aumento della latenza della coda. Anche se ogni richiesta ha un NQ ridotto, un throughput complessivo (QPS) molto elevato può comunque causare lo stesso effetto, poiché Milvus può unire internamente le richieste di ricerca concorrenti.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/high_workload_cf9c75e24c.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>Segnali da tenere d'occhio:</strong></p>
<ul>
<li><p>Tutte le query mostrano una latenza inaspettatamente elevata.</p></li>
<li><p>Le metriche dei nodi di query segnalano un aumento della <strong>latenza in coda</strong>.</p></li>
<li><p>I registri mostrano una richiesta con un grande NQ e una lunga durata totale, ma una durata relativamente piccola per NQ, il che indica che una richiesta sovradimensionata sta dominando le risorse.</p></li>
</ul>
<p><strong>Come risolvere il problema:</strong></p>
<ul>
<li><p>Eseguire<strong>query in batch</strong>: Mantenere NQ modesto per evitare di sovraccaricare una singola richiesta.</p></li>
<li><p><strong>Ridimensionare i nodi di query</strong>: Se il carico di lavoro è caratterizzato da un'alta frequenza, aggiungere nodi di query per distribuire il carico e mantenere una bassa latenza.</p></li>
</ul>
<h3 id="Inefficient-Filtering" class="common-anchor-header">Filtro inefficiente</h3><p>Un altro collo di bottiglia comune deriva da filtri inefficienti. Se le espressioni dei filtri sono mal strutturate o i campi non hanno indici scalari, Milvus può ricadere in una <strong>scansione completa</strong> invece di scansionare un piccolo sottoinsieme mirato. I filtri JSON e le impostazioni di coerenza rigide possono aumentare ulteriormente il sovraccarico.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/inefficient_filtering_e524615d63.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>Segnali da tenere d'occhio:</strong></p>
<ul>
<li><p><strong>Latenza</strong> elevata <strong>del filtro scalare</strong> nelle metriche del nodo di query.</p></li>
<li><p>Picchi di latenza evidenti solo quando vengono applicati i filtri.</p></li>
<li><p><strong>Latenza di attesa tSafe</strong> elevata se è abilitata la coerenza rigorosa.</p></li>
</ul>
<p><strong>Come risolvere il problema:</strong></p>
<ul>
<li><strong>Semplificare le espressioni dei filtri</strong>: Ridurre la complessità del piano di query ottimizzando i filtri. Ad esempio, sostituire le lunghe catene OR con un'espressione IN:</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Replace chains of OR conditions with IN</span>
tag = {<span class="hljs-string">&quot;tag&quot;</span>: [<span class="hljs-string">&quot;A&quot;</span>, <span class="hljs-string">&quot;B&quot;</span>, <span class="hljs-string">&quot;C&quot;</span>, <span class="hljs-string">&quot;D&quot;</span>]}
filter_expr = <span class="hljs-string">&quot;tag IN {tag}&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Milvus introduce anche un meccanismo di template delle espressioni di filtro, progettato per migliorare l'efficienza riducendo il tempo di analisi di espressioni complesse. Per maggiori dettagli, consultare <a href="https://milvus.io/docs/filtering-templating.md">questo documento</a>.</p>
<ul>
<li><p><strong>Aggiungere indici adeguati</strong>: Evitare scansioni complete creando indici scalari sui campi utilizzati nei filtri.</p></li>
<li><p><strong>Gestire JSON in modo efficiente</strong>: Milvus 2.6 ha introdotto indici di percorso e indici piatti per i campi JSON, consentendo una gestione efficiente dei dati JSON. Per migliorare ulteriormente le prestazioni, è in <a href="https://milvus.io/docs/roadmap.md">programma</a> anche la triturazione di JSON. Per ulteriori informazioni, consultare <a href="https://milvus.io/docs/use-json-fields.md#JSON-Field">il documento sui campi JSON</a>.</p></li>
<li><p><strong>Regolare il livello di coerenza</strong>: Utilizzare le letture coerenti <code translate="no">_Bounded</code>_ o <code translate="no">_Eventually</code>_ quando non sono richieste garanzie rigorose, riducendo i tempi di attesa di <code translate="no">tSafe</code>.</p></li>
</ul>
<h3 id="Improper-Choice-of-Vector-Index" class="common-anchor-header">Scelta errata dell'indice vettoriale</h3><p><a href="https://milvus.io/docs/index-explained.md">Gli indici vettoriali</a> non sono adatti a tutti. La scelta dell'indice sbagliato può avere un impatto significativo sulla latenza. Gli indici in memoria offrono le prestazioni più veloci ma consumano più memoria, mentre gli indici su disco risparmiano memoria a scapito della velocità. Anche i vettori binari richiedono strategie di indicizzazione specifiche.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_4_25fa1b9c13.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>Segnali da tenere d'occhio:</strong></p>
<ul>
<li><p>Latenza di ricerca vettoriale elevata nelle metriche dei nodi di query.</p></li>
<li><p>Saturazione dell'I/O su disco quando si usano DiskANN o MMAP.</p></li>
<li><p>Query più lente subito dopo il riavvio a causa dell'avvio a freddo della cache.</p></li>
</ul>
<p><strong>Come risolvere il problema:</strong></p>
<ul>
<li><p><strong>Adattare l'indice al carico di lavoro (vettori float):</strong></p>
<ul>
<li><p><strong>HNSW</strong> - migliore per casi d'uso in-memory con richiamo elevato e bassa latenza.</p></li>
<li><p><strong>Famiglia IVF</strong> - compromessi flessibili tra richiamo e velocità.</p></li>
<li><p><strong>DiskANN</strong> - supporta dataset su scala miliardaria, ma richiede una grande larghezza di banda su disco.</p></li>
</ul></li>
<li><p><strong>Per i vettori binari:</strong> Utilizzare l'<a href="https://milvus.io/docs/minhash-lsh.md">indice MINHASH_LSH</a> (introdotto in Milvus 2.6) con la metrica MHJACCARD per approssimare in modo efficiente la similarità di Jaccard.</p></li>
<li><p><strong>Abilitare</strong> <a href="https://milvus.io/docs/mmap.md"><strong>MMAP</strong></a>: Mappare i file di indice in memoria invece di mantenerli completamente residenti per trovare un equilibrio tra latenza e utilizzo della memoria.</p></li>
<li><p><strong>Ottimizzare i parametri di indice/ricerca</strong>: Regolate le impostazioni per bilanciare il richiamo e la latenza per il vostro carico di lavoro.</p></li>
<li><p><strong>Attenuare gli avvii a freddo</strong>: Riscaldare i segmenti ad accesso frequente dopo un riavvio per evitare la lentezza iniziale delle query.</p></li>
</ul>
<h3 id="Runtime--Environment-Conditions" class="common-anchor-header">Condizioni ambientali e di runtime</h3><p>Non tutte le query lente sono causate dalla query stessa. I nodi di query spesso condividono le risorse con lavori in background, come la compattazione, la migrazione dei dati o la creazione di indici. Gli upsert frequenti possono generare molti piccoli segmenti non indicizzati, costringendo le ricerche a scandagliare i dati grezzi. In alcuni casi, anche le inefficienze specifiche della versione possono introdurre latenza fino a quando non vengono corrette.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/img_v3_02q5_4dd2e545_93dc_4c58_b609_d76d50c2013g_aad0a89208.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>Segnali da tenere d'occhio:</strong></p>
<ul>
<li><p>Picchi di utilizzo della CPU durante i lavori in background (compattazione, migrazione, creazione di indici).</p></li>
<li><p>Saturazione dell'I/O del disco che influisce sulle prestazioni delle query.</p></li>
<li><p>Riscaldamento della cache molto lento dopo un riavvio.</p></li>
<li><p>Un gran numero di piccoli segmenti non indicizzati (a causa di frequenti upsert).</p></li>
<li><p>Regressioni della latenza legate a versioni specifiche di Milvus.</p></li>
</ul>
<p><strong>Come risolvere il problema:</strong></p>
<ul>
<li><p><strong>Riprogrammare le attività in background</strong> (ad esempio, la compattazione) in orari non di punta.</p></li>
<li><p><strong>Rilasciare le collezioni inutilizzate</strong> per liberare memoria.</p></li>
<li><p><strong>Tenere conto del tempo di riscaldamento</strong> dopo i riavvii; se necessario, preriscaldare le cache.</p></li>
<li><p><strong>Eseguire gli upserts in batch</strong> per ridurre la creazione di piccoli segmenti e permettere alla compattazione di tenere il passo.</p></li>
<li><p><strong>Rimanere aggiornati</strong>: aggiornare alle nuove versioni di Milvus per ottenere correzioni di bug e ottimizzazioni.</p></li>
<li><p><strong>Predisporre le risorse</strong>: dedicare CPU/memoria extra ai carichi di lavoro sensibili alla latenza.</p></li>
</ul>
<p>Facendo corrispondere a ogni segnale l'azione giusta, la maggior parte delle query lente può essere risolta in modo rapido e prevedibile.</p>
<h2 id="Best-Practices-to-Prevent-Slow-Searches" class="common-anchor-header">Migliori pratiche per prevenire le ricerche lente<button data-href="#Best-Practices-to-Prevent-Slow-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>La migliore sessione di debug è quella che non si deve mai eseguire. Secondo la nostra esperienza, alcune semplici abitudini consentono di prevenire le query lente in Milvus:</p>
<ul>
<li><p><strong>Pianificare l'allocazione delle risorse</strong> per evitare la contesa tra CPU e disco.</p></li>
<li><p><strong>Impostare avvisi proattivi</strong> sia per i guasti che per i picchi di latenza.</p></li>
<li><p><strong>Mantenere le espressioni dei filtri</strong> brevi, semplici ed efficienti.</p></li>
<li><p>Eseguire<strong>gli upsert in batch</strong> e mantenere NQ/QPS a livelli sostenibili.</p></li>
<li><p><strong>Indicizzare tutti i campi</strong> utilizzati nei filtri.</p></li>
</ul>
<p>Le query lente in Milvus sono rare e, quando appaiono, di solito hanno cause chiare e diagnosticabili. Con metriche, registri e un approccio strutturato, è possibile identificare e risolvere rapidamente i problemi. Questo è lo stesso manuale che il nostro team di assistenza usa ogni giorno, e ora è anche il vostro.</p>
<p>Ci auguriamo che questa guida fornisca non solo un quadro di riferimento per la risoluzione dei problemi, ma anche la fiducia necessaria per far funzionare i carichi di lavoro Milvus in modo fluido ed efficiente.</p>
<h2 id="💡-Want-to-dive-deeper" class="common-anchor-header">💡 Volete approfondire?<button data-href="#💡-Want-to-dive-deeper" class="anchor-icon" translate="no">
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
<li><p>Unitevi al <a href="https://discord.com/invite/8uyFbECzPX"><strong>Milvus Discord</strong></a> per porre domande, condividere esperienze e imparare dalla comunità.</p></li>
<li><p>Iscrivetevi ai nostri <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>Milvus Office Hours</strong></a> per parlare direttamente con il team e ricevere assistenza pratica sui vostri carichi di lavoro.</p></li>
</ul>
