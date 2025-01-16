---
id: 2021-10-22-apply-configuration-changes-on-milvus-2.md
title: >-
  Condivisione tecnica:Applicare le modifiche di configurazione su Milvus 2.0
  usando Docker Compose
author: Jingjing
date: 2021-10-22T00:00:00.000Z
desc: Imparare ad applicare le modifiche alla configurazione su Milvus 2.0
cover: assets.zilliz.com/Modify_configurations_f9162c5670.png
tag: Engineering
---
<custom-h1>Condivisione tecnica: Applicare le modifiche di configurazione su Milvus 2.0 usando Docker Compose</custom-h1><p><em>Jingjing Jia, Data Engineer di Zilliz, si è laureata in Informatica presso la Xi'an Jiaotong University. Dopo essere entrata a far parte di Zilliz, si occupa principalmente della pre-elaborazione dei dati, dell'implementazione di modelli di intelligenza artificiale, della ricerca tecnologica relativa a Milvus e dell'assistenza agli utenti della comunità nell'implementazione di scenari applicativi. È molto paziente, le piace comunicare con i partner della comunità e le piace ascoltare musica e guardare anime.</em></p>
<p>Come utente abituale di Milvus, ero molto entusiasta del nuovo rilascio di Milvus 2.0 RC. Secondo l'introduzione sul sito ufficiale, Milvus 2.0 sembra superare di gran lunga i suoi predecessori. Ero così ansioso di provarlo personalmente.</p>
<p>E l'ho fatto.  Tuttavia, quando ho messo veramente le mani su Milvus 2.0, mi sono reso conto che non ero in grado di modificare il file di configurazione di Milvus 2.0 con la stessa facilità con cui lo facevo con Milvus 1.1.1. Non potevo modificare il file di configurazione all'interno del contenitore docker di Milvus 2.0 avviato con Docker Compose, e anche la modifica forzata non aveva effetto. In seguito ho scoperto che Milvus 2.0 RC non era in grado di rilevare le modifiche al file di configurazione dopo l'installazione. La futura versione stabile risolverà questo problema.</p>
<p>Dopo aver provato diversi approcci, ho trovato un modo affidabile per applicare le modifiche ai file di configurazione per Milvus 2.0 standalone e cluster.</p>
<p>Si noti che tutte le modifiche alla configurazione devono essere apportate prima di riavviare Milvus utilizzando Docker Compose.</p>
<h2 id="Modify-configuration-file-in-Milvus-standalone" class="common-anchor-header">Modifica del file di configurazione in Milvus standalone<button data-href="#Modify-configuration-file-in-Milvus-standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>Per prima cosa, è necessario <a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">scaricare</a> una copia del file <strong>milvus.yaml</strong> sul dispositivo locale.</p>
<p>Quindi è possibile modificare le configurazioni del file. Ad esempio, è possibile modificare il formato del registro come <code translate="no">.json</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_1_ee4a16a3ee.png" alt="1.1.png" class="doc-image" id="1.1.png" />
   </span> <span class="img-wrapper"> <span>1.1.png</span> </span></p>
<p>Una volta modificato il file <strong>milvus.yaml</strong>, è necessario <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/standalone/docker-compose.yml">scaricare</a> e modificare anche il file <strong>docker-compose.yaml</strong> per lo standalone, mappando il percorso locale di milvus.yaml sul corrispondente percorso del contenitore docker al file di configurazione <code translate="no">/milvus/configs/milvus.yaml</code> nella sezione <code translate="no">volumes</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_2_5e7c73708c.png" alt="1.2.png" class="doc-image" id="1.2.png" />
   </span> <span class="img-wrapper"> <span>1.2.png</span> </span></p>
<p>Infine, avviate Milvus standalone usando <code translate="no">docker-compose up -d</code> e verificate se le modifiche hanno avuto successo. Ad esempio, eseguire <code translate="no">docker logs</code> per verificare il formato del registro.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_3_a0406df3ab.png" alt="1.3.png" class="doc-image" id="1.3.png" />
   </span> <span class="img-wrapper"> <span>1.3.png</span> </span></p>
<h2 id="Modify-configuration-file-in-Milvus-cluster" class="common-anchor-header">Modifica del file di configurazione nel cluster Milvus<button data-href="#Modify-configuration-file-in-Milvus-cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>Per prima cosa, <a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">scaricare</a> e modificare il file <strong>milvus.yaml</strong> in base alle proprie esigenze.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_4_758b182846.png" alt="1.4.png" class="doc-image" id="1.4.png" />
   </span> <span class="img-wrapper"> <span>1.4.png</span> </span></p>
<p>Quindi è necessario <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/cluster/docker-compose.yml">scaricare</a> e modificare il file <strong>docker-compose.yml</strong> del cluster, mappando il percorso locale di <strong>milvus.yaml</strong> sul percorso corrispondente ai file di configurazione di tutti i componenti, ossia root coord, data coord, data node, query coord, query node, index coord, index node e proxy.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_5_80e15811b8.png" alt="1.5.png" class="doc-image" id="1.5.png" />
   </span> <span class="img-wrapper"> <span>1.5.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_6_b2f3e4e47f.png" alt="1.6.png" class="doc-image" id="1.6.png" />
   </span> <span class="img-wrapper"> <span>1.6.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_7_4d1eb5e1e5.png" alt="1.7.png" class="doc-image" id="1.7.png" /></span> <span class="img-wrapper">1 </span>. <span class="img-wrapper">7 <span>.png</span> </span></p>
<p>Infine, è possibile avviare il cluster Milvus utilizzando <code translate="no">docker-compose up -d</code> e verificare se le modifiche sono state eseguite correttamente.</p>
<h2 id="Change-log-file-path-in-configuration-file" class="common-anchor-header">Modifica del percorso del file di log nel file di configurazione<button data-href="#Change-log-file-path-in-configuration-file" class="anchor-icon" translate="no">
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
    </button></h2><p>Per prima cosa, <a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">scaricare</a> il file <strong>milvus.yaml</strong> e modificare la sezione <code translate="no">rootPath</code> come la directory in cui si prevede di memorizzare i file di log nel contenitore Docker.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_8_e3bdc4843f.png" alt="1.8.png" class="doc-image" id="1.8.png" />
   </span> <span class="img-wrapper"> <span>1.8.png</span> </span></p>
<p>Successivamente, scaricare il file <strong>docker-compose.yml</strong> corrispondente per Milvus <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/standalone/docker-compose.yml">standalone</a> o <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/cluster/docker-compose.yml">cluster</a>.</p>
<p>Per lo standalone, è necessario mappare il percorso locale di <strong>milvus.yaml</strong> sul percorso del contenitore docker corrispondente al file di configurazione <code translate="no">/milvus/configs/milvus.yaml</code> e mappare la directory locale dei file di log sulla directory del contenitore Docker creata in precedenza.</p>
<p>Per i cluster, è necessario mappare entrambi i percorsi in ogni componente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_9_22d8929d92.png" alt="1.9.png" class="doc-image" id="1.9.png" />
   </span> <span class="img-wrapper"> <span>1.9.png</span> </span></p>
<p>Infine, avviare Milvus standalone o il cluster usando <code translate="no">docker-compose up -d</code> e controllare i file di log per vedere se la modifica è riuscita.</p>
