---
id: building-video-search-system-with-milvus.md
title: Panoramica del sistema
author: milvus
date: 2020-08-29T00:18:19.703Z
desc: Ricerca di video per immagine con Milvus
cover: assets.zilliz.com/header_3a822736b3.gif
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/building-video-search-system-with-milvus'
---
<custom-h1>4 passi per costruire un sistema di ricerca video</custom-h1><p>Come suggerisce il nome, la ricerca di video in base all'immagine è il processo di recupero dei video che contengono fotogrammi simili all'immagine in ingresso. Uno dei passaggi chiave è quello di trasformare i video in embeddings, cioè di estrarre i fotogrammi chiave e convertire le loro caratteristiche in vettori. Ora, qualche lettore curioso potrebbe chiedersi che differenza c'è tra la ricerca di un video per immagine e la ricerca di un'immagine per immagine? In effetti, la ricerca dei fotogrammi chiave nei video è equivalente alla ricerca di un'immagine per immagine.</p>
<p>Se siete interessati, potete consultare il nostro precedente articolo <a href="https://medium.com/unstructured-data-service/milvus-application-1-building-a-reverse-image-search-system-based-on-milvus-and-vgg-aed4788dd1ea">Milvus x VGG: Building a Content-based Image Retrieval System</a>.</p>
<h2 id="System-overview" class="common-anchor-header">Panoramica del sistema<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Il diagramma seguente illustra il flusso di lavoro tipico di un sistema di ricerca video di questo tipo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_video_search_system_workflow_c68d658b93.png" alt="1-video-search-system-workflow.png" class="doc-image" id="1-video-search-system-workflow.png" />
   </span> <span class="img-wrapper"> <span>1-video-search-system-workflow.png</span> </span></p>
<p>Quando importiamo i video, usiamo la libreria OpenCV per tagliare ogni video in fotogrammi, estrarre i vettori dei fotogrammi chiave usando il modello di estrazione delle caratteristiche delle immagini VGG e poi inserire i vettori estratti (embeddings) in Milvus. Utilizziamo Minio per memorizzare i video originali e Redis per memorizzare le correlazioni tra video e vettori.</p>
<p>Per la ricerca dei video, utilizziamo lo stesso modello VGG per convertire l'immagine di ingresso in un vettore di caratteristiche e inserirlo in Milvus per trovare i vettori con la maggiore somiglianza. Quindi, il sistema recupera i video corrispondenti da Minio sulla sua interfaccia in base alle correlazioni in Redis.</p>
<h2 id="Data-preparation" class="common-anchor-header">Preparazione dei dati<button data-href="#Data-preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>In questo articolo, utilizziamo circa 100.000 file GIF da Tumblr come set di dati campione per costruire una soluzione end-to-end per la ricerca di video. È possibile utilizzare i propri archivi video.</p>
<h2 id="Deployment" class="common-anchor-header">Implementazione<button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>Il codice per la costruzione del sistema di recupero video in questo articolo è su GitHub.</p>
<h3 id="Step-1-Build-Docker-images" class="common-anchor-header">Passo 1: Creare immagini Docker.</h3><p>Il sistema di recupero video richiede Milvus v0.7.1 docker, Redis docker, Minio docker, il docker dell'interfaccia front-end e il docker dell'API back-end. È necessario costruire da soli il docker dell'interfaccia front-end e il docker dell'API back-end, mentre gli altri tre docker possono essere prelevati direttamente da Docker Hub.</p>
<pre><code translate="no"># Get the video search code
$ git clone -b 0.10.0 https://github.com/JackLCL/search-video-demo.git

# Build front-end interface docker and api docker images
$ cd search-video-demo &amp; make all
</code></pre>
<h2 id="Step-2-Configure-the-environment" class="common-anchor-header">Passo 2: Configurare l'ambiente.<button data-href="#Step-2-Configure-the-environment" class="anchor-icon" translate="no">
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
    </button></h2><p>Qui usiamo docker-compose.yml per gestire i cinque contenitori di cui sopra. Vedere la seguente tabella per la configurazione di docker-compose.yml:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_configure_docker_compose_yml_a33329e5e9.png" alt="2-configure-docker-compose-yml.png" class="doc-image" id="2-configure-docker-compose-yml.png" />
   </span> <span class="img-wrapper"> <span>2-configure-docker-compose-yml.png</span> </span></p>
<p>L'indirizzo IP 192.168.1.38 nella tabella precedente è l'indirizzo del server utilizzato per costruire il sistema di recupero video in questo articolo. È necessario aggiornarlo con l'indirizzo del proprio server.</p>
<p>È necessario creare manualmente le directory di archiviazione per Milvus, Redis e Minio e aggiungere i percorsi corrispondenti in docker-compose.yml. In questo esempio, abbiamo creato le seguenti directory:</p>
<pre><code translate="no">/mnt/redis/data /mnt/minio/data /mnt/milvus/db
</code></pre>
<p>È possibile configurare Milvus, Redis e Minio in docker-compose.yml come segue:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_configure_milvus_redis_minio_docker_compose_yml_4a8104d53e.png" alt="3-configure-milvus-redis-minio-docker-compose-yml.png" class="doc-image" id="3-configure-milvus-redis-minio-docker-compose-yml.png" />
   </span> <span class="img-wrapper"> <span>3-configure-milvus-redis-minio-docker-compose-yml.png</span> </span></p>
<h2 id="Step-3-Start-the-system" class="common-anchor-header">Passo 3: avviare il sistema.<button data-href="#Step-3-Start-the-system" class="anchor-icon" translate="no">
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
    </button></h2><p>Usare il file docker-compose.yml modificato per avviare i cinque contenitori docker da usare nel sistema di recupero video:</p>
<pre><code translate="no">$ docker-compose up -d
</code></pre>
<p>Quindi, si può eseguire docker-compose ps per verificare se i cinque contenitori docker sono stati avviati correttamente. La seguente schermata mostra un'interfaccia tipica dopo un avvio riuscito.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_sucessful_setup_f2b3006487.png" alt="4-sucessful-setup.png" class="doc-image" id="4-sucessful-setup.png" />
   </span> <span class="img-wrapper"> <span>4-avvio-successivo.png</span> </span></p>
<p>Ora è stato creato con successo un sistema di ricerca video, anche se il database non contiene video.</p>
<h2 id="Step-4-Import-videos" class="common-anchor-header">Passo 4: Importare i video.<button data-href="#Step-4-Import-videos" class="anchor-icon" translate="no">
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
    </button></h2><p>Nella cartella deploy del repository del sistema, si trova import_data.py, lo script per importare i video. È sufficiente aggiornare il percorso dei file video e l'intervallo di importazione per eseguire lo script.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_update_path_video_5065928961.png" alt="5-update-path-video.png" class="doc-image" id="5-update-path-video.png" />
   </span> <span class="img-wrapper"> <span>5-aggiornamento-percorso-video.png</span> </span></p>
<p>percorso_dati: Il percorso dei video da importare.</p>
<p>time.sleep(0,5): L'intervallo in cui il sistema importa i video. Il server utilizzato per costruire il sistema di ricerca video ha 96 core di CPU. Pertanto, si consiglia di impostare l'intervallo a 0,5 secondi. Se il vostro server ha meno core di CPU, impostate un valore maggiore. In caso contrario, il processo di importazione graverà sulla CPU e creerà processi zombie.</p>
<p>Eseguire import_data.py per importare i video.</p>
<pre><code translate="no">$ cd deploy
$ python3 import_data.py
</code></pre>
<p>Una volta importati i video, il sistema di ricerca dei video è pronto!</p>
<h2 id="Interface-display" class="common-anchor-header">Visualizzazione dell'interfaccia<button data-href="#Interface-display" class="anchor-icon" translate="no">
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
    </button></h2><p>Aprire il browser e digitare 192.168.1.38:8001 per visualizzare l'interfaccia del sistema di ricerca video, come mostrato di seguito.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_video_search_interface_4c26d93e02.png" alt="6-video-search-interface.png" class="doc-image" id="6-video-search-interface.png" />
   </span> <span class="img-wrapper"> <span>6-video-search-interface.png</span> </span></p>
<p>Attivare l'interruttore a forma di ingranaggio in alto a destra per visualizzare tutti i video presenti nel repository.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_view_all_videos_repository_26ff37cad5.png" alt="7-view-all-videos-repository.png" class="doc-image" id="7-view-all-videos-repository.png" />
   </span> <span class="img-wrapper"> <span>7-view-all-videos-repository.png</span> </span></p>
<p>Fare clic sulla casella di caricamento in alto a sinistra per inserire un'immagine di destinazione. Come mostrato di seguito, il sistema restituisce i video contenenti i fotogrammi più simili.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_enjoy_recommender_system_cats_bda1bf9db3.png" alt="8-enjoy-recommender-system-cats.png" class="doc-image" id="8-enjoy-recommender-system-cats.png" />
   </span> <span class="img-wrapper"> <span>8-godere del sistema-raccomandante-gatti.png</span> </span></p>
<p>Divertitevi con il nostro sistema di ricerca video!</p>
<h2 id="Build-your-own" class="common-anchor-header">Costruire il proprio<button data-href="#Build-your-own" class="anchor-icon" translate="no">
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
    </button></h2><p>In questo articolo abbiamo usato Milvus per costruire un sistema di ricerca di video per immagini. Questo esemplifica l'applicazione di Milvus nell'elaborazione di dati non strutturati.</p>
<p>Milvus è compatibile con diversi framework di deep learning e rende possibili ricerche in millisecondi per vettori su scala miliardaria. Sentitevi liberi di portare Milvus con voi in altri scenari di AI: https://github.com/milvus-io/milvus.</p>
<p>Non essere un estraneo, seguici su <a href="https://twitter.com/milvusio/">Twitter</a> o unisciti a noi su <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/">Slack</a>!👇🏻</p>
