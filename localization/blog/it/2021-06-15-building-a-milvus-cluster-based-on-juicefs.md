---
id: building-a-milvus-cluster-based-on-juicefs.md
title: Che cos'è JuiceFS?
author: Changjian Gao and Jingjing Jia
date: 2021-06-15T07:21:07.938Z
desc: >-
  Imparate a costruire un cluster Milvus basato su JuiceFS, un file system
  condiviso progettato per ambienti cloud-nativi.
cover: assets.zilliz.com/Juice_FS_blog_cover_851cc9e726.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/building-a-milvus-cluster-based-on-juicefs'
---
<custom-h1>Costruire un cluster Milvus basato su JuiceFS</custom-h1><p>Le collaborazioni tra le comunità open-source sono una cosa magica. Non solo i volontari appassionati, intelligenti e creativi mantengono innovative le soluzioni open-source, ma lavorano anche per unire strumenti diversi in modi interessanti e utili. <a href="https://milvus.io/">Milvus</a>, il database vettoriale più diffuso al mondo, e <a href="https://github.com/juicedata/juicefs">JuiceFS</a>, un file system condiviso progettato per ambienti cloud-native, sono stati uniti in questo spirito dalle rispettive comunità open-source. Questo articolo spiega cos'è JuiceFS, come costruire un cluster Milvus basato sullo storage di file condivisi JuiceFS e le prestazioni che gli utenti possono aspettarsi utilizzando questa soluzione.</p>
<h2 id="What-is-JuiceFS" class="common-anchor-header"><strong>Che cos'è JuiceFS?</strong><button data-href="#What-is-JuiceFS" class="anchor-icon" translate="no">
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
    </button></h2><p>JuiceFS è un file system POSIX distribuito open-source ad alte prestazioni, che può essere costruito sopra Redis e S3. È stato progettato per ambienti cloud-nativi e supporta la gestione, l'analisi, l'archiviazione e il backup di dati di qualsiasi tipo. JuiceFS è comunemente usato per risolvere le sfide dei big data, per costruire applicazioni di intelligenza artificiale (AI) e per la raccolta dei log. Il sistema supporta anche la condivisione dei dati tra più client e può essere utilizzato direttamente come storage condiviso in Milvus.</p>
<p>Dopo che i dati e i relativi metadati sono stati memorizzati rispettivamente su object storage e <a href="https://redis.io/">Redis</a>, JuiceFS funge da middleware stateless. La condivisione dei dati è realizzata consentendo alle diverse applicazioni di collegarsi l'una all'altra senza problemi attraverso un'interfaccia standard del file system. JuiceFS si affida a Redis, un data store in-memory open-source, per la memorizzazione dei metadati. Redis viene utilizzato perché garantisce l'atomicità e fornisce operazioni sui metadati ad alte prestazioni. Tutti i dati sono memorizzati in un archivio di oggetti attraverso il client JuiceFS. Il diagramma dell'architettura è il seguente:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/juicefs_architecture_2023b37a4e.png" alt="juicefs-architecture.png" class="doc-image" id="juicefs-architecture.png" />
   </span> <span class="img-wrapper"> <span>juicefs-architecture.png</span> </span></p>
<h2 id="Build-a-Milvus-cluster-based-on-JuiceFS" class="common-anchor-header"><strong>Costruire un cluster Milvus basato su JuiceFS</strong><button data-href="#Build-a-Milvus-cluster-based-on-JuiceFS" class="anchor-icon" translate="no">
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
    </button></h2><p>Un cluster Milvus costruito con JuiceFS (si veda il diagramma dell'architettura qui sotto) funziona dividendo le richieste a monte utilizzando Mishards, un middleware di sharding del cluster, per distribuire le richieste a cascata ai suoi sottomoduli. Quando si inseriscono dati, Mishards alloca le richieste a monte al nodo di scrittura Milvus, che memorizza i dati appena inseriti in JuiceFS. Quando legge i dati, Mishards li carica da JuiceFS attraverso un nodo di lettura Milvus nella memoria per l'elaborazione, quindi raccoglie e restituisce i risultati dai sottoservizi a monte.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_cluster_built_with_juicefs_3a43cd262c.png" alt="milvus-cluster-built-with-juicefs.png" class="doc-image" id="milvus-cluster-built-with-juicefs.png" />
   </span> <span class="img-wrapper"> <span>milvus-cluster-costruito-con-juicefs.png</span> </span></p>
<h3 id="Step-1-Launch-MySQL-service" class="common-anchor-header"><strong>Passo 1: Avviare il servizio MySQL</strong></h3><p>Avviare il servizio MySQL su <strong>qualsiasi</strong> nodo del cluster. Per maggiori dettagli, vedere <a href="https://milvus.io/docs/v1.1.0/data_manage.md">Gestire i metadati con MySQL</a>.</p>
<h3 id="Step-2-Create-a-JuiceFS-file-system" class="common-anchor-header"><strong>Passo 2: creare un file system JuiceFS</strong></h3><p>A scopo dimostrativo, viene utilizzato il programma binario precompilato JuiceFS. Scaricate il <a href="https://github.com/juicedata/juicefs/releases">pacchetto di installazione</a> corretto per il vostro sistema e seguite la <a href="https://github.com/juicedata/juicefs-quickstart">Guida rapida di</a> JuiceFS per istruzioni dettagliate sull'installazione. Per creare un file system JuiceFS, impostare prima un database Redis per l'archiviazione dei metadati. Per le distribuzioni su cloud pubblico, si consiglia di ospitare il servizio Redis sullo stesso cloud dell'applicazione. Inoltre, configurare lo storage di oggetti per JuiceFS. In questo esempio viene utilizzato Azure Blob Storage, ma JuiceFS supporta quasi tutti i servizi a oggetti. Selezionare il servizio di archiviazione a oggetti più adatto alle esigenze del proprio scenario.</p>
<p>Dopo aver configurato il servizio Redis e l'archiviazione a oggetti, formattare un nuovo file system e montare JuiceFS nella directory locale:</p>
<pre><code translate="no">1 $  <span class="hljs-built_in">export</span> AZURE_STORAGE_CONNECTION_STRING=<span class="hljs-string">&quot;DefaultEndpointsProtocol=https;AccountName=XXX;AccountKey=XXX;EndpointSuffix=core.windows.net&quot;</span>
2 $ ./juicefs format \
3     --storage wasb \
4     --bucket https://&lt;container&gt; \
5     ... \
6     localhost <span class="hljs-built_in">test</span> <span class="hljs-comment">#format</span>
7 $ ./juicefs mount -d localhost ~/jfs  <span class="hljs-comment">#mount</span>
8
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>Se il server Redis non è in esecuzione localmente, sostituire localhost con il seguente indirizzo: <code translate="no">redis://&lt;user:password&gt;@host:6379/1</code>.</p>
</blockquote>
<p>Quando l'installazione riesce, JuiceFS restituisce la pagina di storage condiviso <strong>/root/jfs</strong>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/installation_success_9d05279ecd.png" alt="installation-success.png" class="doc-image" id="installation-success.png" />
   </span> <span class="img-wrapper"> <span>installazione-successo.png</span> </span></p>
<h3 id="Step-3-Start-Milvus" class="common-anchor-header"><strong>Passo 3: Avviare Milvus</strong></h3><p>Tutti i nodi del cluster devono avere installato Milvus e ogni nodo Milvus deve essere configurato con i permessi di lettura o scrittura. Solo un nodo Milvus può essere configurato come nodo di scrittura, mentre gli altri devono essere nodi di lettura. Per prima cosa, impostare i parametri delle sezioni <code translate="no">cluster</code> e <code translate="no">general</code> nel file di configurazione del sistema Milvus <strong>server_config.yaml</strong>:</p>
<p><strong>Sezione</strong> <code translate="no">cluster</code></p>
<table>
<thead>
<tr><th style="text-align:left"><strong>Parametro</strong></th><th style="text-align:left"><strong>Descrizione</strong></th><th style="text-align:left"><strong>Configurazione</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">enable</code></td><td style="text-align:left">Se abilitare la modalità cluster</td><td style="text-align:left"><code translate="no">true</code></td></tr>
<tr><td style="text-align:left"><code translate="no">role</code></td><td style="text-align:left">Ruolo di distribuzione Milvus</td><td style="text-align:left"><code translate="no">rw</code>/<code translate="no">ro</code></td></tr>
</tbody>
</table>
<p><strong>Sezione</strong> <code translate="no">general</code></p>
<pre><code translate="no"><span class="hljs-comment"># meta_uri is the URI for metadata storage, using MySQL (for Milvus Cluster). Format: mysql://&lt;username:password&gt;@host:port/database</span>
general:
  timezone: UTC+8
  meta_uri: mysql://root:milvusroot@host:3306/milvus
<button class="copy-code-btn"></button></code></pre>
<p>Durante l'installazione, il percorso di archiviazione condivisa JuiceFS configurato è <strong>/root/jfs/milvus/db</strong>.</p>
<pre><code translate="no">1 <span class="hljs-built_in">sudo</span> docker run -d --name milvus_gpu_1.0.0 --gpus all \
2 -p 19530:19530 \
3 -p 19121:19121 \
4 -v /root/jfs/milvus/db:/var/lib/milvus/db \  <span class="hljs-comment">#/root/jfs/milvus/db is the shared storage path</span>
5 -v /home/<span class="hljs-variable">$USER</span>/milvus/conf:/var/lib/milvus/conf \
6 -v /home/<span class="hljs-variable">$USER</span>/milvus/logs:/var/lib/milvus/logs \
7 -v /home/<span class="hljs-variable">$USER</span>/milvus/wal:/var/lib/milvus/wal \
8 milvusdb/milvus:1.0.0-gpu-d030521-1ea92e
9
<button class="copy-code-btn"></button></code></pre>
<p>Al termine dell'installazione, avviare Milvus e verificare che sia stato lanciato correttamente. Infine, avviare il servizio Mishards su <strong>uno qualsiasi</strong> dei nodi del cluster. L'immagine seguente mostra un avvio riuscito di Mishards. Per ulteriori informazioni, consultare l'<a href="https://github.com/milvus-io/bootcamp/tree/new-bootcamp/deployments/juicefs">esercitazione</a> su GitHub.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/mishards_launch_success_921695d3a8.png" alt="mishards-launch-success.png" class="doc-image" id="mishards-launch-success.png" />
   </span> <span class="img-wrapper"> <span>mishards-lancio-successo.png</span> </span></p>
<h2 id="Performance-benchmarks" class="common-anchor-header"><strong>Parametri di riferimento delle prestazioni</strong><button data-href="#Performance-benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>Le soluzioni di storage condiviso sono solitamente implementate da sistemi NAS (Network Attached Storage). I tipi di sistemi NAS comunemente utilizzati includono Network File System (NFS) e Server Message Block (SMB). Le piattaforme cloud pubbliche forniscono generalmente servizi di archiviazione gestiti compatibili con questi protocolli, come Amazon Elastic File System (EFS).</p>
<p>A differenza dei sistemi NAS tradizionali, JuiceFS è implementato sulla base di Filesystem in Userspace (FUSE), dove tutte le operazioni di lettura e scrittura dei dati avvengono direttamente sul lato dell'applicazione, riducendo ulteriormente la latenza di accesso. JuiceFS presenta inoltre caratteristiche esclusive che non si trovano in altri sistemi NAS, come la compressione dei dati e la cache.</p>
<p>I test di benchmark rivelano che JuiceFS offre notevoli vantaggi rispetto a EFS. Nel benchmark dei metadati (Figura 1), JuiceFS registra operazioni di I/O al secondo (IOPS) fino a dieci volte superiori rispetto a EFS. Inoltre, il benchmark del throughput I/O (Figura 2) mostra che JuiceFS supera EFS in scenari sia a singolo che a multiplo lavoro.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/performance_benchmark_1_b7fcbb4439.png" alt="performance-benchmark-1.png" class="doc-image" id="performance-benchmark-1.png" />
   </span> <span class="img-wrapper"> <span>performance-benchmark-1.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/performance_benchmark_2_e311098123.png" alt="performance-benchmark-2.png" class="doc-image" id="performance-benchmark-2.png" />
   </span> <span class="img-wrapper"> <span>performance-benchmark-2.png</span> </span></p>
<p>Inoltre, i test di benchmark mostrano che il tempo di recupero della prima query, o il tempo per caricare i dati appena inseriti dal disco alla memoria, per il cluster Milvus basato su JuiceFS è di soli 0,032 secondi in media, indicando che i dati vengono caricati dal disco alla memoria quasi istantaneamente. Per questo test, il tempo di recupero della prima query è stato misurato utilizzando un milione di righe di dati vettoriali a 128 dimensioni inseriti in batch di 100k a intervalli di 1-8 secondi.</p>
<p>JuiceFS è un sistema di archiviazione file condiviso stabile e affidabile e il cluster Milvus costruito su JuiceFS offre prestazioni elevate e capacità di archiviazione flessibile.</p>
<h2 id="Learn-more-about-Milvus" class="common-anchor-header"><strong>Per saperne di più su Milvus</strong><button data-href="#Learn-more-about-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus è uno strumento potente in grado di alimentare una vasta gamma di applicazioni di intelligenza artificiale e di ricerca di similarità vettoriale. Per saperne di più sul progetto, consultate le seguenti risorse:</p>
<ul>
<li>Leggete il nostro <a href="https://zilliz.com/blog">blog</a>.</li>
<li>Interagire con la nostra comunità open-source su <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Utilizzate o contribuite al database vettoriale più diffuso al mondo su <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Testate e distribuite rapidamente le applicazioni AI con il nostro nuovo <a href="https://github.com/milvus-io/bootcamp">bootcamp</a>.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/writer_bio_changjian_gao_68018f7716.png" alt="writer bio-changjian gao.png" class="doc-image" id="writer-bio-changjian-gao.png" />
   </span> <span class="img-wrapper"> <span>bio scrittore-changjian gao.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/writer_bio_jingjing_jia_a85d1c2e3b.png" alt="writer bio-jingjing jia.png" class="doc-image" id="writer-bio-jingjing-jia.png" /><span>bio scrittore-jingjing jia.png</span> </span></p>
