---
id: what-milvus-taught-us-in-2024.md
title: Cosa ci hanno insegnato gli utenti di Milvus nel 2024
author: Stefan Webb
date: 2025-02-18T00:00:00.000Z
desc: Scopri le domande più frequenti su Milvus nel nostro Discord.
cover: assets.zilliz.com/What_Milvus_Users_Taught_Us_in_2024_db63863725.png
tag: Engineering
tags: null
recommend: true
canonicalUrl: 'https://milvus.io/blog/what-milvus-taught-us-in-2024.md'
---
<h2 id="Overview" class="common-anchor-header">Panoramica<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Mentre Milvus fioriva nel 2024 con importanti rilasci e un fiorente ecosistema open-source, un tesoro nascosto di intuizioni degli utenti si stava formando silenziosamente nella nostra comunità su <a href="https://discord.gg/xwqmFDURcz">Discord</a>. Questa raccolta di discussioni della comunità rappresentava un'opportunità unica per comprendere le sfide dei nostri utenti in prima persona. Incuriosito da questa risorsa non sfruttata, ho intrapreso un'analisi completa di tutte le discussioni dell'anno, alla ricerca di modelli che potessero aiutarci a compilare una risorsa di domande frequenti per gli utenti di Milvus.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/top_image_6bbdbe8caa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La mia analisi ha rivelato tre aree principali in cui gli utenti hanno cercato costantemente una guida: <strong>Ottimizzazione delle prestazioni</strong>, <strong>strategie di distribuzione</strong> e <strong>gestione dei dati</strong>. Gli utenti hanno discusso spesso su come mettere a punto Milvus per gli ambienti di produzione e monitorare efficacemente le metriche delle prestazioni. Per quanto riguarda l'implementazione, la comunità si è confrontata con la selezione di implementazioni appropriate, la scelta di indici di ricerca ottimali e la risoluzione di problemi in configurazioni distribuite. Le conversazioni sulla gestione dei dati si sono concentrate sulle strategie di migrazione dei dati da servizio a servizio e sulla selezione dei modelli di incorporazione.</p>
<p>Esaminiamo ciascuna di queste aree in modo più dettagliato.</p>
<h2 id="Deployment" class="common-anchor-header">Distribuzione<button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deployment_c951c46339.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus offre modalità di distribuzione flessibili per adattarsi a vari casi d'uso. Tuttavia, alcuni utenti trovano difficile trovare la scelta giusta e vogliono essere sicuri di farlo "correttamente".</p>
<h3 id="Which-deployment-type-should-I-choose" class="common-anchor-header">Quale tipo di distribuzione scegliere?</h3><p>Una domanda molto frequente è quale tipo di distribuzione scegliere tra Milvus <a href="https://milvus.io/docs/milvus_lite.md">Lite</a>, <a href="https://milvus.io/docs/prerequisite-docker.md">Standalone</a> e <a href="https://milvus.io/docs/prerequisite-helm.md">Distributed</a>. La risposta dipende principalmente dalle dimensioni del database vettoriale e dalla quantità di traffico che dovrà servire:</p>
<h4 id="Milvus-Lite" class="common-anchor-header">Milvus Lite</h4><p>Se si tratta di prototipi sul sistema locale con un massimo di qualche milione di vettori, o se si cerca un database di vettori incorporato per i test unitari e il CI/CD, si può usare Milvus Lite. Si noti che alcune funzioni più avanzate, come la ricerca full-text, non sono ancora disponibili in Milvus Lite, ma sono in arrivo.</p>
<h4 id="Milvus-Standalone" class="common-anchor-header">Milvus Standalone</h4><p>Se il vostro sistema deve servire il traffico di produzione e/o avete bisogno di memorizzare da pochi milioni a cento milioni di vettori, dovreste usare Milvus Standalone, che racchiude tutti i componenti di Milvus in un'unica immagine Docker. Esiste una variante che si limita a estrarre le dipendenze dello storage persistente (minio) e del metadata store (etcd) come immagini separate.</p>
<h4 id="Milvus-Distributed" class="common-anchor-header">Milvus distribuito</h4><p>Per le implementazioni su larga scala che servono il traffico di produzione, ad esempio per servire miliardi di vettori a migliaia di QPS, si dovrebbe usare Milvus Distributed. Alcuni utenti potrebbero voler eseguire un'elaborazione batch offline su scala, ad esempio per la deduplicazione dei dati o il collegamento dei record, e la futura versione di Milvus 3.0 fornirà un modo più efficiente di farlo attraverso quello che definiamo un vector lake.</p>
<h4 id="Fully-Managed-Service" class="common-anchor-header">Servizio completamente gestito</h4><p>Per gli sviluppatori che vogliono concentrarsi sullo sviluppo dell'applicazione senza preoccuparsi di DevOps, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> è il servizio Milvus completamente gestito che offre un livello gratuito.</p>
<p>Per ulteriori informazioni, vedere <a href="https://milvus.io/docs/install-overview.md#Choose-the-Right-Deployment-for-Your-Use-Case">"Panoramica delle implementazioni Milvus"</a>.</p>
<h3 id="How-much-memory-storage-and-compute-will-I-require" class="common-anchor-header">Di quanta memoria, storage e calcolo avrò bisogno?</h3><p>Questa domanda si pone spesso, non solo per gli utenti Milvus esistenti, ma anche per coloro che stanno valutando se Milvus è adatto alla loro applicazione. L'esatta combinazione di memoria, memoria e calcolo necessaria per un'applicazione dipende da una complessa interazione di fattori.</p>
<p>Le incorporazioni vettoriali hanno dimensioni diverse a seconda del modello utilizzato. Inoltre, alcuni indici di ricerca vettoriale sono memorizzati interamente in memoria, mentre altri memorizzano i dati su disco. Inoltre, molti indici di ricerca sono in grado di memorizzare una copia compressa (quantizzata) delle incorporazioni e richiedono memoria aggiuntiva per le strutture di dati del grafo. Questi sono solo alcuni dei fattori che influenzano la memoria e l'archiviazione.</p>
<h4 id="Milvus-Resource-Sizing-Tool" class="common-anchor-header">Strumento di dimensionamento delle risorse di Milvus</h4><p>Fortunatamente, Zilliz (il team che gestisce Milvus) ha costruito <a href="https://milvus.io/tools/sizing">uno strumento di dimensionamento delle risorse</a> che fa un lavoro fantastico per rispondere a questa domanda. Inserendo la dimensione del vettore, il tipo di indice, le opzioni di distribuzione e così via, lo strumento stima la CPU, la memoria e lo storage necessari per i vari tipi di nodi Milvus e le relative dipendenze. Il vostro chilometraggio può variare, quindi un test di carico reale con i vostri dati e il vostro traffico campione è sempre una buona idea.</p>
<h3 id="Which-vector-index-or-distance-metric-should-I-choose" class="common-anchor-header">Quale indice vettoriale o metrica di distanza devo scegliere?</h3><p>Molti utenti non sanno quale indice scegliere e come impostare gli iperparametri. Innanzitutto, è sempre possibile rimandare la scelta del tipo di indice a Milvus, selezionando AUTOINDEX. Tuttavia, se si desidera selezionare un tipo di indice specifico, alcune regole empiriche forniscono un punto di partenza.</p>
<h4 id="In-Memory-Indexes" class="common-anchor-header">Indici in memoria</h4><p>Volete pagare il costo per inserire il vostro indice interamente in memoria? Un indice in-memory è in genere il più veloce, ma anche il più costoso. Vedere <a href="https://milvus.io/docs/index.md?tab=floating">"Indici in-memory"</a> per un elenco di quelli supportati da Milvus e i compromessi in termini di latenza, memoria e richiamo.</p>
<p>Tenete presente che la dimensione dell'indice non è semplicemente il numero di vettori moltiplicato per la loro dimensionalità e la loro dimensione in virgola mobile. La maggior parte degli indici quantizza i vettori per ridurre l'uso della memoria, ma richiede memoria per le strutture dati aggiuntive. Anche altri dati non vettoriali (scalari) e il loro indice occupano spazio in memoria.</p>
<h4 id="On-Disk-Indexes" class="common-anchor-header">Indici su disco</h4><p>Quando l'indice non può stare in memoria, si può usare uno degli <a href="https://milvus.io/docs/disk_index.md">"indici su disco"</a> forniti da Milvus. Due scelte con compromessi molto diversi tra latenza e risorse sono <a href="https://milvus.io/docs/disk_index.md">DiskANN</a> e <a href="https://milvus.io/docs/mmap.md#MMap-enabled-Data-Storage">MMap</a>.</p>
<p>DiskANN memorizza una copia altamente compressa dei vettori in memoria e i vettori non compressi e le strutture di ricerca del grafo su disco. Utilizza alcune idee intelligenti per cercare lo spazio vettoriale riducendo al minimo le letture su disco e sfrutta la velocità di accesso casuale delle unità SSD. Per ridurre al minimo la latenza, l'unità SSD deve essere connessa tramite NVMe anziché SATA per ottenere le migliori prestazioni di I/O.</p>
<p>Tecnicamente parlando, MMap non è un tipo di indice, ma si riferisce all'uso della memoria virtuale con un indice in-memory. Con la memoria virtuale, le pagine possono essere scambiate tra il disco e la RAM secondo le necessità, il che consente di utilizzare in modo efficiente un indice molto più grande se i modelli di accesso sono tali da utilizzare solo una piccola parte dei dati alla volta.</p>
<p>DiskANN ha una latenza eccellente e costante. MMap ha una latenza ancora migliore quando accede a una pagina in memoria, ma il frequente cambio di pagina provoca picchi di latenza. Pertanto, MMap può presentare una maggiore variabilità della latenza, a seconda dei modelli di accesso alla memoria.</p>
<h4 id="GPU-Indexes" class="common-anchor-header">Indici GPU</h4><p>Una terza opzione è quella di costruire <a href="https://milvus.io/docs/gpu_index.md">un indice utilizzando la memoria e l'elaborazione della GPU</a>. Il supporto GPU di Milvus è fornito dal team Nvidia <a href="https://rapids.ai/">RAPIDS</a>. La ricerca vettoriale su GPU può avere una latenza inferiore rispetto alla corrispondente ricerca su CPU, anche se di solito sono necessari centinaia o migliaia di QPS di ricerca per sfruttare appieno il parallelismo delle GPU. Inoltre, le GPU hanno in genere meno memoria della RAM della CPU e sono più costose da eseguire.</p>
<h4 id="Distance-Metrics" class="common-anchor-header">Metriche di distanza</h4><p>Una domanda più semplice a cui rispondere è quale metrica di distanza scegliere per misurare la somiglianza tra vettori. Si consiglia di scegliere la stessa metrica di distanza con cui è stato addestrato il modello di incorporazione, che di solito è COSINE (o IP quando gli input sono normalizzati). La fonte del modello (ad esempio la pagina del modello su HuggingFace) fornirà chiarimenti sulla metrica di distanza utilizzata. Zilliz ha anche messo insieme una comoda <a href="https://zilliz.com/ai-models">tabella</a> per verificare questo aspetto.</p>
<p>Per riassumere, credo che gran parte dell'incertezza sulla scelta dell'indice dipenda dall'incertezza sul modo in cui queste scelte influenzano il compromesso latenza/utilizzo delle risorse/richiamo della vostra distribuzione. Raccomando di usare le regole empiriche di cui sopra per decidere tra indici in-memory, su disco o su GPU, e poi di usare le linee guida sui compromessi fornite nella documentazione di Milvus per sceglierne uno in particolare.</p>
<h3 id="Can-you-fix-my-broken-Milvus-Distributed-deployment" class="common-anchor-header">Potete riparare la mia distribuzione distribuita di Milvus?</h3><p>Molte domande ruotano intorno ai problemi di funzionamento di una distribuzione Milvus Distributed, con domande relative alla configurazione, agli strumenti e ai log di debug. È difficile dare una soluzione univoca perché ogni domanda sembra diversa dall'altra, ma fortunatamente Milvus ha <a href="https://milvus.io/discord">un vivace Discord</a> dove è possibile chiedere aiuto, e offriamo anche <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">orari di ufficio 1 a 1 con un esperto</a>.</p>
<h3 id="How-do-I-deploy-Milvus-on-Windows" class="common-anchor-header">Come faccio a distribuire Milvus su Windows?</h3><p>Una domanda che è stata posta più volte è come distribuire Milvus su macchine Windows. Sulla base dei vostri commenti, abbiamo riscritto la documentazione per questo: vedere <a href="https://milvus.io/docs/install_standalone-windows.md">Eseguire Milvus in Docker (Windows)</a> per sapere come farlo, utilizzando <a href="https://learn.microsoft.com/en-us/windows/wsl/about#what-is-wsl-2">Windows Subsystem for Linux 2 (WSL2)</a>.</p>
<h2 id="Performance-and-Profiling" class="common-anchor-header">Prestazioni e profilazione<button data-href="#Performance-and-Profiling" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Performance_and_Profiling_481975ea1d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dopo aver scelto un tipo di distribuzione e averla fatta funzionare, gli utenti vogliono essere sicuri di aver preso le decisioni ottimali e vorrebbero profilare le prestazioni e lo stato della loro distribuzione. Molte domande riguardano come profilare le prestazioni, osservare lo stato e capire cosa e perché.</p>
<h3 id="How-do-I-measure-performance" class="common-anchor-header">Come si misurano le prestazioni?</h3><p>Gli utenti desiderano verificare le metriche relative alle prestazioni della loro implementazione, in modo da poter capire e risolvere i colli di bottiglia. Le metriche citate includono la latenza media delle query, la distribuzione delle latenze, il volume delle query, l'utilizzo della memoria, lo storage su disco e così via. Mentre ottenere queste metriche con <a href="https://milvus.io/docs/monitor_overview.md">il sistema di monitoraggio preesistente</a> è stato difficile, Milvus 2.5 introduce un nuovo sistema chiamato <a href="https://milvus.io/docs/milvus-webui.md#Milvus-WebUI">WebUI</a> (i feedback sono benvenuti!), che consente di accedere a tutte queste informazioni da un'interfaccia web di facile utilizzo.</p>
<h3 id="What’s-happening-inside-Milvus-right-now-ie-observe-state" class="common-anchor-header">Cosa sta succedendo in Milvus in questo momento (cioè osservare lo stato)?</h3><p>Gli utenti vogliono osservare lo stato interno della loro installazione. Le questioni sollevate includono la comprensione del motivo per cui un indice di ricerca sta impiegando così tanto tempo a costruirsi, come determinare se il cluster è sano e capire come una query viene eseguita tra i nodi. Molte di queste domande possono trovare risposta grazie alla nuova <a href="https://milvus.io/docs/milvus-webui.md#Milvus-WebUI">WebUI</a>, che offre trasparenza su ciò che il sistema sta facendo internamente.</p>
<h3 id="How-does-some-complex-aspect-of-the-internals-work" class="common-anchor-header">Come funziona un aspetto (complesso) degli interni?</h3><p>Gli utenti avanzati spesso desiderano comprendere gli aspetti interni di Milvus, ad esempio capire la tenuta dei segmenti o la gestione della memoria. L'obiettivo di fondo è in genere quello di migliorare le prestazioni e talvolta di eseguire il debug dei problemi. La documentazione, in particolare nelle sezioni &quot;Concetti&quot; e &quot;Guida all'amministrazione&quot;, è utile in questo caso, ad esempio si vedano le pagine <a href="https://milvus.io/docs/architecture_overview.md">&quot;Panoramica dell'architettura Milvus&quot;</a> e <a href="https://milvus.io/docs/clustering-compaction.md">&quot;Compattazione dei cluster&quot;.</a> Continueremo a migliorare la documentazione sugli aspetti interni di Milvus, rendendola più facile da capire, e accogliamo con piacere qualsiasi feedback o richiesta via <a href="https://milvus.io/discord">Discord</a>.</p>
<h3 id="Which-embedding-model-should-I-choose" class="common-anchor-header">Quale modello di incorporazione devo scegliere?</h3><p>Una domanda relativa alle prestazioni che è emersa più volte nei meetup, nelle ore di ufficio e su Discord è come scegliere un modello di incorporamento. È difficile dare una risposta definitiva a questa domanda, anche se consigliamo di iniziare con modelli predefiniti come <a href="https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2">all-MiniLM-L6-v2</a>.</p>
<p>Come per la scelta dell'indice di ricerca, esistono dei compromessi tra calcolo, memorizzazione e richiamo. Un modello di embedding con una dimensione di output più grande richiederà una maggiore quantità di memoria, a parità di altre condizioni, anche se probabilmente produrrà un richiamo più elevato di elementi rilevanti. I modelli di embedding più grandi, per una dimensione fissa, di solito superano quelli più piccoli in termini di richiamo, anche se al costo di un aumento del calcolo e del tempo. Le classifiche che classificano le prestazioni dei modelli di incorporazione, come <a href="https://huggingface.co/spaces/mteb/leaderboard">MTEB</a>, si basano su parametri di riferimento che potrebbero non essere in linea con i dati e le attività specifiche.</p>
<p>Pertanto, non ha senso pensare a un modello di incorporamento "migliore". Iniziate con uno che abbia un richiamo accettabile e che soddisfi il vostro budget di calcolo e di tempo per il calcolo delle incorporazioni. Ulteriori ottimizzazioni, come la messa a punto sui dati o l'esplorazione empirica del compromesso calcolo/richiamo, possono essere rimandate a quando si avrà un sistema funzionante in produzione.</p>
<h2 id="Data-Management" class="common-anchor-header">Gestione dei dati<button data-href="#Data-Management" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Data_Management_aa2d1159bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Come spostare i dati all'interno e all'esterno di un'applicazione Milvus è un altro tema principale delle discussioni su Discord, il che non sorprende visto quanto questo compito sia centrale per la messa in produzione di un'applicazione.</p>
<h3 id="How-do-I-migrate-data-from-X-to-Milvus-How-do-I-migrate-data-from-Standalone-to-Distributed-How-do-I-migrate-from-24x-to-25x" class="common-anchor-header">Come si migrano i dati da X a Milvus? Come si migrano i dati da Standalone a Distributed? Come si migra da 2.4.x a 2.5.x?</h3><p>Un nuovo utente vuole comunemente portare i dati esistenti in Milvus da un'altra piattaforma, compresi i motori di ricerca tradizionali come <a href="https://docs.zilliz.com/docs/migrate-from-elasticsearch">Elasticsearch</a> e altri database vettoriali come <a href="https://docs.zilliz.com/docs/migrate-from-pinecone">Pinecone</a> o <a href="https://docs.zilliz.com/docs/migrate-from-qdrant">Qdrant</a>. Gli utenti esistenti possono anche voler migrare i loro dati da una distribuzione Milvus a un'altra, o <a href="https://docs.zilliz.com/docs/migrate-from-milvus">da Milvus self-hosted a Zilliz Cloud completamente gestito</a>.</p>
<p>Il <a href="https://github.com/zilliztech/vts">Vector Transport Service (VTS)</a> e il servizio di <a href="https://docs.zilliz.com/docs/migrations">migrazione</a> gestito su Zilliz Cloud sono stati concepiti per questo scopo.</p>
<h3 id="How-do-I-save-and-load-data-backups-How-do-I-export-data-from-Milvus" class="common-anchor-header">Come si salvano e si caricano i backup dei dati? Come si esportano i dati da Milvus?</h3><p>Milvus dispone di uno strumento dedicato, <a href="https://github.com/zilliztech/milvus-backup">milvus-backup</a>, per creare istantanee su un archivio permanente e ripristinarle.</p>
<h2 id="Next-Steps" class="common-anchor-header">Prossimi passi<button data-href="#Next-Steps" class="anchor-icon" translate="no">
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
    </button></h2><p>Spero di avervi dato qualche indicazione su come affrontare le sfide più comuni quando si costruisce con un database vettoriale. Questo ci ha sicuramente aiutato a dare un'altra occhiata alla nostra documentazione e alla nostra roadmap di funzionalità per continuare a lavorare su cose che possono aiutare la nostra comunità ad avere successo con Milvus. Un aspetto fondamentale che vorrei sottolineare è che le vostre scelte vi collocano in diversi punti di uno spazio di compromesso tra calcolo, archiviazione, latenza e richiamo. <em>Non è possibile massimizzare tutti questi criteri di prestazione contemporaneamente: non esiste un'implementazione "ottimale". Tuttavia, comprendendo meglio il funzionamento della ricerca vettoriale e dei sistemi di database distribuiti, è possibile prendere una decisione consapevole.</em></p>
<p>Dopo aver sfogliato il gran numero di post di 2024, mi è venuto da pensare: perché un umano dovrebbe fare questo? L'IA generativa non ha forse promesso di risolvere questo compito di analisi di grandi quantità di testo e di estrazione di informazioni? Seguitemi nella seconda parte di questo post (in arrivo), in cui analizzo la progettazione e l'implementazione di <em>un sistema multi-agente per l'estrazione di informazioni dai forum di discussione.</em></p>
<p>Grazie ancora e spero di vedervi nel <a href="https://milvus.io/discord">Discord</a> della comunità e nei nostri prossimi meetup sui <a href="https://lu.ma/unstructured-data-meetup">dati non strutturati</a>. Per un'assistenza più pratica, vi invitiamo a prenotare un'<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">ora d'ufficio individuale</a>. <em>Il vostro feedback è essenziale per migliorare Milvus!</em></p>
