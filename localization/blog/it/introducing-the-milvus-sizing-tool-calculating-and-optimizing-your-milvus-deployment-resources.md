---
id: >-
  introducing-the-milvus-sizing-tool-calculating-and-optimizing-your-milvus-deployment-resources.md
title: >-
  Introduzione allo strumento di dimensionamento Milvus: Calcolo e
  ottimizzazione delle risorse di distribuzione di Milvus
author: 'Ken Zhang, Fendy Feng'
date: 2025-04-11T00:00:00.000Z
desc: >-
  Massimizzate le prestazioni di Milvus con il nostro strumento di
  dimensionamento di facile utilizzo! Scoprite come configurare la vostra
  installazione per ottimizzare l'uso delle risorse e risparmiare sui costi.
cover: assets.zilliz.com/Introducing_Milvus_Sizing_Tool_c0c98343a2.png
tag: Tutorials
recommend: false
canonicalUrl: 'https://zilliz.com/blog/demystify-milvus-sizing-tool'
---
<h2 id="Introduction" class="common-anchor-header">Introduzione<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>La scelta della configurazione ottimale per la vostra installazione di Milvus è fondamentale per ottimizzare le prestazioni, utilizzare in modo efficiente le risorse e gestire i costi. Sia che stiate costruendo un prototipo o pianificando una distribuzione di produzione, il corretto dimensionamento dell'istanza di Milvus può fare la differenza tra un database vettoriale che funziona senza problemi e uno che fatica con le prestazioni o incorre in costi inutili.</p>
<p>Per semplificare questo processo, abbiamo rinnovato il nostro <a href="https://milvus.io/tools/sizing">strumento di dimensionamento di Milvus</a>, un calcolatore facile da usare che genera stime di risorse consigliate in base alle vostre esigenze specifiche. In questa guida vi guideremo nell'uso dello strumento e vi forniremo informazioni più approfondite sui fattori che influenzano le prestazioni di Milvus.</p>
<h2 id="How-to-Use-the-Milvus-Sizing-Tool" class="common-anchor-header">Come usare lo strumento di dimensionamento Milvus<button data-href="#How-to-Use-the-Milvus-Sizing-Tool" class="anchor-icon" translate="no">
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
    </button></h2><p>Utilizzare questo strumento di dimensionamento è semplicissimo. Basta seguire i seguenti passaggi.</p>
<ol>
<li><p>Visitate la pagina dello<a href="https://milvus.io/tools/sizing/"> strumento di dimensionamento Milvus</a>.</p></li>
<li><p>Inserite i parametri chiave:</p>
<ul>
<li><p>Numero di vettori e dimensioni per vettore</p></li>
<li><p>Tipo di indice</p></li>
<li><p>Dimensione dei dati del campo scalare</p></li>
<li><p>Dimensione del segmento</p></li>
<li><p>Modalità di distribuzione preferita</p></li>
</ul></li>
<li><p>Esaminare le raccomandazioni sulle risorse generate</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_sizing_tool_3ca881b3d5.jpeg" alt="milvus sizing tool" class="doc-image" id="milvus-sizing-tool" />
   </span> <span class="img-wrapper"> <span>strumento di dimensionamento milvus</span> </span></p>
<p>Vediamo come ognuno di questi parametri influisce sulla distribuzione di Milvus.</p>
<h2 id="Index-Selection-Balancing-Storage-Cost-Accuracy-and-Speed" class="common-anchor-header">Selezione degli indici: Bilanciare archiviazione, costi, precisione e velocità<button data-href="#Index-Selection-Balancing-Storage-Cost-Accuracy-and-Speed" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus offre diversi algoritmi di indici, tra cui <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a>, FLAT, IVF_FLAT, IVF_SQ8, <a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">ScaNN</a>, <a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN</a> e altri ancora, ciascuno con compromessi distinti in termini di utilizzo della memoria, requisiti di spazio su disco, velocità di interrogazione e precisione di ricerca.</p>
<p>Ecco cosa c'è da sapere sulle opzioni più comuni:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/index_dde661d579.jpeg" alt="index" class="doc-image" id="index" />
   </span> <span class="img-wrapper"> <span>indice</span> </span></p>
<p>HNSW (Hierarchical Navigable Small World)</p>
<ul>
<li><p><strong>Architettura</strong>: Combina elenchi di salto con grafici Navigable Small Worlds (NSW) in una struttura gerarchica.</p></li>
<li><p><strong>Prestazioni</strong>: Interrogazione molto veloce con eccellenti tassi di richiamo</p></li>
<li><p><strong>Utilizzo delle risorse</strong>: Richiede la maggior quantità di memoria per vettore (costo più elevato)</p></li>
<li><p><strong>Ideale per</strong>: Applicazioni in cui la velocità e l'accuratezza sono fondamentali e i vincoli di memoria sono meno importanti.</p></li>
<li><p><strong>Nota tecnica</strong>: la ricerca inizia dal livello più alto con il minor numero di nodi e procede verso il basso attraverso livelli sempre più densi.</p></li>
</ul>
<p>PIATTO</p>
<ul>
<li><p><strong>Architettura</strong>: Semplice ricerca esaustiva senza approssimazioni</p></li>
<li><p><strong>Prestazioni</strong>: 100% di richiamo ma tempi di interrogazione estremamente lenti (<code translate="no">O(n)</code> per la dimensione dei dati <code translate="no">n</code>)</p></li>
<li><p><strong>Utilizzo delle risorse</strong>: La dimensione dell'indice è uguale alla dimensione dei dati vettoriali grezzi</p></li>
<li><p><strong>Ideale per</strong>: Piccoli insiemi di dati o applicazioni che richiedono un richiamo perfetto</p></li>
<li><p><strong>Nota tecnica</strong>: Esegue il calcolo completo della distanza tra il vettore interrogato e ogni vettore del database.</p></li>
</ul>
<p>IVF_FLAT</p>
<ul>
<li><p><strong>Architettura</strong>: Divide lo spazio vettoriale in cluster per una ricerca più efficiente.</p></li>
<li><p><strong>Prestazioni</strong>: Richiamo medio-alto con velocità di interrogazione moderata (più lenta di HNSW ma più veloce di FLAT)</p></li>
<li><p><strong>Utilizzo delle risorse</strong>: Richiede meno memoria di FLAT ma più di HNSW</p></li>
<li><p><strong>Ideale per</strong>: Applicazioni bilanciate in cui un po' di richiamo può essere scambiato con prestazioni migliori.</p></li>
<li><p><strong>Nota tecnica</strong>: durante la ricerca, vengono esaminati solo i cluster di <code translate="no">nlist</code>, riducendo significativamente il calcolo.</p></li>
</ul>
<p>IVF_SQ8</p>
<ul>
<li><p><strong>Architettura</strong>: Applica la quantizzazione scalare a IVF_FLAT, comprimendo i dati vettoriali.</p></li>
<li><p><strong>Prestazioni</strong>: Richiamo medio con velocità di interrogazione medio-alta</p></li>
<li><p><strong>Utilizzo delle risorse</strong>: Riduce il consumo di disco, calcolo e memoria del 70-75% rispetto a IVF_FLAT.</p></li>
<li><p><strong>Ideale per</strong>: Ambienti con risorse limitate in cui l'accuratezza può essere leggermente compromessa</p></li>
<li><p><strong>Nota tecnica</strong>: comprime i valori in virgola mobile a 32 bit in valori interi a 8 bit.</p></li>
</ul>
<h3 id="Advanced-Index-Options-ScaNN-DiskANN-CAGRA-and-more" class="common-anchor-header">Opzioni di indice avanzate: ScaNN, DiskANN, CAGRA e altro ancora</h3><p>Per gli sviluppatori con esigenze specifiche, Milvus offre anche:</p>
<ul>
<li><p><a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google"><strong>ScaNN</strong></a>: 20% più veloce sulla CPU rispetto a HNSW con tassi di richiamo simili.</p></li>
<li><p><a href="https://milvus.io/docs/disk_index.md"><strong>DiskANN</strong></a>: un indice ibrido disco/memoria, ideale quando è necessario supportare un gran numero di vettori con un'elevata capacità di richiamo e si può accettare una latenza leggermente più lunga (~100 ms). Bilancia l'uso della memoria con le prestazioni mantenendo solo una parte dell'indice in memoria mentre il resto rimane su disco.</p></li>
<li><p><strong>Indici basati su GPU</strong>:</p>
<ul>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">GPU_CAGRA</a>: È il più veloce degli indici su GPU, ma richiede una scheda di inferenza con memoria GDDR piuttosto che una con memoria HBM.</p></li>
<li><p>GPU_BRUTE_FORCE: Ricerca esaustiva implementata su GPU</p></li>
<li><p>GPU_IVF_FLAT: Versione accelerata da GPU di IVF_FLAT</p></li>
<li><p>GPU_IVF_PQ: versione accelerata da GPU di IVF con <a href="https://zilliz.com/learn/harnessing-product-quantization-for-memory-efficiency-in-vector-databases">quantizzazione del prodotto</a></p></li>
</ul></li>
<li><p><strong>HNSW-PQ/SQ/PRQ</strong>:</p>
<ul>
<li><p><strong>HNSW_SQ</strong>: query ad altissima velocità, risorse di memoria limitate; accetta un piccolo compromesso nel tasso di richiamo.</p></li>
<li><p><strong>HNSW_PQ</strong>: Interrogazione a media velocità; risorse di memoria molto limitate; accetta un compromesso minore nel tasso di richiamo.</p></li>
<li><p><strong>HNSW_PRQ</strong>: interrogazione a media velocità; risorse di memoria molto limitate; accetta un compromesso minore nella velocità di richiamo.</p></li>
<li><p><strong>AUTOINDEX</strong>: si imposta su HNSW in Milvus open-source (o utilizza indici proprietari più performanti in <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, il Milvus gestito).</p></li>
</ul></li>
<li><p><strong>Binary, Sparse e altri indici specializzati</strong>: Per tipi di dati e casi d'uso specifici. Per maggiori dettagli, consultare la <a href="https://milvus.io/docs/index.md">pagina del documento sugli indici</a>.</p></li>
</ul>
<h2 id="Segment-Size-and-Deployment-Configuration" class="common-anchor-header">Dimensione dei segmenti e configurazione dell'implementazione<button data-href="#Segment-Size-and-Deployment-Configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>I segmenti sono gli elementi fondamentali dell'organizzazione interna dei dati di Milvus. Funzionano come pezzi di dati che consentono la ricerca distribuita e il bilanciamento del carico nella distribuzione. Questo strumento di dimensionamento Milvus offre tre opzioni di dimensione dei segmenti (512 MB, 1024 MB, 2048 MB), con 1024 MB come impostazione predefinita.</p>
<p>La comprensione dei segmenti è fondamentale per l'ottimizzazione delle prestazioni. Come linea guida generale:</p>
<ul>
<li><p>Segmenti da 512 MB: Ideale per nodi di query con 4-8 GB di memoria.</p></li>
<li><p>Segmenti da 1 GB: Ottimale per i nodi di query con 8-16 GB di memoria</p></li>
<li><p>Segmenti da 2 GB: Consigliato per i nodi di query con &gt;16 GB di memoria</p></li>
</ul>
<p>Approfondimento per gli sviluppatori: Un numero minore di segmenti di dimensioni maggiori offre in genere prestazioni di ricerca più rapide. Per le implementazioni su larga scala, i segmenti da 2 GB offrono spesso il miglior equilibrio tra efficienza della memoria e velocità di interrogazione.</p>
<h2 id="Message-Queue-System-Selection" class="common-anchor-header">Selezione del sistema di code di messaggi<button data-href="#Message-Queue-System-Selection" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando si sceglie tra Pulsar e Kafka come sistema di messaggistica:</p>
<ul>
<li><p><strong>Pulsar</strong>: Consigliato per i nuovi progetti grazie al minor overhead per argomento e alla migliore scalabilità.</p></li>
<li><p><strong>Kafka</strong>: Può essere preferibile se si dispone già dell'esperienza o dell'infrastruttura Kafka nella propria organizzazione.</p></li>
</ul>
<h2 id="Enterprise-Optimizations-in-Zilliz-Cloud" class="common-anchor-header">Ottimizzazioni aziendali in Zilliz Cloud<button data-href="#Enterprise-Optimizations-in-Zilliz-Cloud" class="anchor-icon" translate="no">
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
    </button></h2><p>Per le implementazioni di produzione con requisiti di prestazioni rigorosi, Zilliz Cloud (la versione aziendale e completamente gestita di Milvus sul cloud) offre ulteriori ottimizzazioni nell'indicizzazione e nella quantizzazione:</p>
<ul>
<li><p><strong>Prevenzione del fuori memoria (OOM):</strong> Gestione sofisticata della memoria per evitare crash fuori memoria</p></li>
<li><p><strong>Ottimizzazione della compattazione</strong>: Migliora le prestazioni di ricerca e l'utilizzo delle risorse</p></li>
<li><p><strong>Archiviazione a livelli</strong>: Gestione efficiente dei dati caldi e freddi con unità di calcolo appropriate</p>
<ul>
<li><p>Unità di calcolo (CU) standard per i dati a cui si accede di frequente</p></li>
<li><p>CU di archiviazione a livelli per l'archiviazione economica dei dati ad accesso raro.</p></li>
</ul></li>
</ul>
<p>Per le opzioni di dimensionamento aziendale dettagliate, visitate la<a href="https://docs.zilliz.com/docs/select-zilliz-cloud-service-plans"> documentazione</a> sui<a href="https://docs.zilliz.com/docs/select-zilliz-cloud-service-plans"> piani di servizio Zilliz Cloud</a>.</p>
<h2 id="Advanced-Configuration-Tips-for-Developers" class="common-anchor-header">Suggerimenti per la configurazione avanzata per gli sviluppatori<button data-href="#Advanced-Configuration-Tips-for-Developers" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li><p><strong>Tipi di indice multipli</strong>: Lo strumento di dimensionamento si concentra su un singolo indice. Per applicazioni complesse che richiedono algoritmi di indice diversi per varie collezioni, creare collezioni separate con configurazioni personalizzate.</p></li>
<li><p><strong>Allocazione della memoria</strong>: Quando si pianifica l'implementazione, tenere conto dei requisiti di memoria dei dati vettoriali e degli indici. HNSW richiede in genere 2-3 volte la memoria dei dati vettoriali grezzi.</p></li>
<li><p><strong>Test delle prestazioni</strong>: Prima di finalizzare la configurazione, eseguire un benchmark dei modelli di query specifici su un set di dati rappresentativo.</p></li>
<li><p><strong>Considerazioni sulla scala</strong>: Considerare la crescita futura. È più facile iniziare con risorse leggermente superiori che riconfigurare in seguito.</p></li>
</ol>
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
    </button></h2><p>Lo<a href="https://milvus.io/tools/sizing/"> strumento di dimensionamento di Milvus</a> è un ottimo punto di partenza per la pianificazione delle risorse, ma ricordate che ogni applicazione ha requisiti unici. Per ottenere prestazioni ottimali, è necessario mettere a punto la configurazione in base alle caratteristiche specifiche del carico di lavoro, ai modelli di query e alle esigenze di scalabilità.</p>
<p>Miglioriamo continuamente i nostri strumenti e la nostra documentazione in base al feedback degli utenti. Se avete domande o avete bisogno di ulteriore assistenza per il dimensionamento della vostra installazione di Milvus, contattate la nostra comunità su<a href="https://github.com/milvus-io/milvus/discussions"> GitHub</a> o<a href="https://discord.com/invite/8uyFbECzPX"> Discord</a>.</p>
<h2 id="References" class="common-anchor-header">Riferimenti<button data-href="#References" class="anchor-icon" translate="no">
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
<li><p><a href="https://thesequence.substack.com/p/guest-post-choosing-the-right-vector">📝 Scegliere il giusto indice vettoriale per il vostro progetto</a></p></li>
<li><p><a href="https://milvus.io/docs/index.md?tab=floating">Indice in-memory | Documentazione Milvus</a></p></li>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">Presenta Milvus CAGRA: elevare la ricerca vettoriale con l'indicizzazione su GPU</a></p></li>
<li><p><a href="https://zilliz.com/pricing#estimate_your_cost">Calcolo dei prezzi del cloud Zilliz</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md">Come iniziare con Milvus </a></p></li>
<li><p><a href="https://docs.zilliz.com/docs/resource-planning">Pianificazione delle risorse nel cloud di Zilliz | Cloud | Hub per gli sviluppatori di Zilliz Cloud</a></p></li>
</ul>
