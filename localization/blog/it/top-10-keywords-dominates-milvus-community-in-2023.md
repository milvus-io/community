---
id: top-10-keywords-dominates-milvus-community-in-2023.md
title: Svelate le 10 parole chiave che domineranno la comunità Milvus nel 2023
author: 'Jack Li, Fendy Feng'
date: 2024-1-21
desc: >-
  Questo post esplora il cuore della comunità analizzando le cronologie delle
  chat e rivelando le 10 principali parole chiave delle discussioni.
metaTitle: Top 10 Keywords Dominating the Milvus Community in 2023
cover: >-
  assets.zilliz.com/Top_10_Keywords_in_the_Milvus_Community_20240116_111204_1_f65b17a8ea.png
tag: Engineering
tags: >-
  Data science, Database, Tech, Artificial Intelligence, Vector Management,
  Milvus
recommend: true
canonicalUrl: 'https://milvus.io/blog/top-10-keywords-dominates-milvus-community-in-2023.md'
---
<p>Mentre concludiamo il 2023, rivediamo il notevole percorso della comunità Milvus: <a href="https://github.com/milvus-io/milvus">25.000 stelle GitHub</a>, il lancio di <a href="https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md">Milvus 2.3.0</a> e il superamento di 10 milioni di download <a href="https://hub.docker.com/r/milvusdb/milvus">di immagini Docker</a>. Questo post esplora il cuore della comunità analizzando la cronologia delle chat e rivelando le 10 principali parole chiave delle discussioni.</p>
<iframe class="video-player" src="https://www.youtube.com/embed/o5uMdNLioQ0?list=PLPg7_faNDlT5Fb8WN8r1PzzQTNzdechnS" title="Mastering Milvus: Turbocharge Your Vector Database with Optimization Secrets!" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
<h2 id="1-Version--The-rise-of-AIGC-drives-rapid-Milvus-iteration" class="common-anchor-header">#1 Version - L'ascesa dell'AIGC guida la rapida iterazione di Milvus<button data-href="#1-Version--The-rise-of-AIGC-drives-rapid-Milvus-iteration" class="anchor-icon" translate="no">
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
    </button></h2><p>Sorprendentemente, "Versione" è emersa come la parola chiave più discussa nel 2023. Questa rivelazione è radicata nell'ondata di AI dell'anno, con i database vettoriali come infrastruttura critica per affrontare i problemi di allucinazione delle applicazioni AIGC.</p>
<p>L'entusiasmo per i database vettoriali spinge Milvus a una fase di rapida iterazione. La comunità ha assistito al rilascio di venti versioni solo nel 2023, soddisfacendo le richieste degli sviluppatori AIGC che inondano la comunità di domande sulla scelta della versione ottimale di Milvus per le varie applicazioni. Agli utenti che si trovano ad affrontare questi aggiornamenti, consigliamo di adottare l'ultima versione per ottenere funzionalità e prestazioni migliori.</p>
<p>Se siete interessati alla pianificazione dei rilasci di Milvus, consultate la pagina della <a href="https://wiki.lfaidata.foundation/display/MIL/Milvus+Long+Term+Roadmap+and+Time+schedule">roadmap di Milvus</a> sul sito ufficiale.</p>
<h2 id="2-Search--beyond-Vector-Search" class="common-anchor-header">#2 Ricerca - oltre la ricerca vettoriale<button data-href="#2-Search--beyond-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>La "ricerca" occupa il secondo posto, riflettendo il suo ruolo fondamentale nelle operazioni di database. Milvus supporta diverse funzionalità di ricerca, dalla ricerca Top-K ANN alla ricerca filtrata scalare e alla ricerca per intervallo. L'imminente rilascio di Milvus 3.0 (Beta) promette la ricerca per parole chiave (sparse embeddings), che molti sviluppatori di app RAG attendono con ansia.</p>
<p>Le discussioni della comunità sulla ricerca si concentrano sulle prestazioni, sulle capacità e sui principi. Gli utenti pongono spesso domande sul filtraggio degli attributi, sull'impostazione dei valori di soglia degli indici e sulla risoluzione dei problemi di latenza. Risorse come la <a href="https://milvus.io/docs/v2.0.x/search.md">documentazione sulle query e le ricerche</a>, le <a href="https://wiki.lfaidata.foundation/pages/viewpage.action?pageId=43287103">proposte di miglioramento di Milvus (MEP)</a> e le discussioni su Discord sono diventate i riferimenti di riferimento per districarsi tra le complessità della ricerca in Milvus.</p>
<h2 id="3-Memory--trade-offs-between-performance-and-accuracy-for-minimized-memory-overhead" class="common-anchor-header">#3 Memoria - compromessi tra prestazioni e accuratezza per ridurre al minimo l'overhead di memoria<button data-href="#3-Memory--trade-offs-between-performance-and-accuracy-for-minimized-memory-overhead" class="anchor-icon" translate="no">
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
    </button></h2><p>Anche la "memoria" è stata al centro delle discussioni della comunità nell'ultimo anno. Come tipo di dati caratteristici, i vettori hanno intrinsecamente dimensioni elevate. Memorizzare i vettori in memoria è una pratica comune per ottenere prestazioni ottimali, ma il volume crescente di dati limita la memoria disponibile. Milvus ottimizza l'uso della memoria adottando tecniche come <a href="https://zilliz.com/blog/milvus-introduced-mmap-for-redefined-data-management-increased-storage-capability">MMap</a> e DiskANN.</p>
<p>Tuttavia, ottenere contemporaneamente un basso utilizzo di memoria, prestazioni eccellenti e un'elevata accuratezza in un sistema di database rimane complesso e richiede compromessi tra prestazioni e accuratezza per ridurre al minimo l'overhead di memoria.</p>
<p>Nel caso dei contenuti generati dall'intelligenza artificiale (Artificial Intelligence Generated Content, AIGC), gli sviluppatori di solito danno la priorità a risposte rapide e all'accuratezza dei risultati rispetto a requisiti di prestazioni rigorosi. L'aggiunta di Milvus a MMap e DiskANN riduce al minimo l'uso della memoria, massimizzando l'elaborazione dei dati e l'accuratezza dei risultati, raggiungendo un equilibrio che si allinea alle esigenze pratiche delle applicazioni AIGC.</p>
<h2 id="4-Insert--smooth-sailing-through-data-insertion" class="common-anchor-header">#4 Insert - inserimento dei dati senza problemi<button data-href="#4-Insert--smooth-sailing-through-data-insertion" class="anchor-icon" translate="no">
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
    </button></h2><p>L'efficienza dell'inserimento dei dati è una preoccupazione cruciale per gli sviluppatori, tanto che la comunità Milvus discute spesso sull'ottimizzazione della velocità di inserimento. Milvus eccelle nell'inserimento efficiente di dati in streaming e nella creazione di indici, grazie alla sua abile separazione di dati in streaming e batch. Questa capacità lo distingue come soluzione altamente performante rispetto ad altri fornitori di database vettoriali, come Pinecone.</p>
<p>Ecco alcune preziose informazioni e raccomandazioni sull'inserimento dei dati:</p>
<ul>
<li><p><strong>Inserimento in batch:</strong> Optate per l'inserimento in batch rispetto a quello su singola riga per una maggiore efficienza. In particolare, l'inserimento da file supera in velocità l'inserimento in batch. Quando si gestiscono grandi insiemi di dati che superano i dieci milioni di record, si consiglia di utilizzare l'interfaccia <code translate="no">bulk_insert</code> per semplificare e accelerare il processo di importazione.</p></li>
<li><p><strong>Uso strategico di <code translate="no">flush()</code>:</strong> Piuttosto che invocare l'interfaccia <code translate="no">flush()</code> dopo ogni batch, effettuare una singola chiamata dopo aver completato l'inserimento di tutti i dati. Un uso eccessivo dell'interfaccia <code translate="no">flush()</code> tra un batch e l'altro può portare alla generazione di file di segmento frammentati, con un notevole onere di compattazione per il sistema.</p></li>
<li><p><strong>Deduplicazione delle chiavi primarie:</strong> Milvus non esegue la deduplicazione delle chiavi primarie quando si utilizza l'interfaccia <code translate="no">insert</code> per l'inserimento dei dati. Se avete bisogno di deduplicare le chiavi primarie, vi consigliamo di usare l'interfaccia <code translate="no">upsert</code>. Tuttavia, le prestazioni di inserimento di <code translate="no">upsert</code>sono inferiori a quelle di <code translate="no">insert</code>, a causa di un'operazione di interrogazione interna aggiuntiva.</p></li>
</ul>
<h2 id="5-Configuration--decoding-the-parameter-maze" class="common-anchor-header">#5 Configurazione - decodificare il labirinto dei parametri<button data-href="#5-Configuration--decoding-the-parameter-maze" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus è un database vettoriale distribuito che integra molti componenti di terze parti, come l'archiviazione di oggetti, le code di messaggi e l'Etcd. Gli utenti sono alle prese con la regolazione dei parametri e la comprensione del loro impatto sulle prestazioni di Milvus, rendendo la "configurazione" un argomento frequentemente discusso.</p>
<p>Tra tutte le domande sulle configurazioni, "quali parametri regolare" è probabilmente l'aspetto più impegnativo, poiché i parametri variano in situazioni diverse. Ad esempio, l'ottimizzazione dei parametri delle prestazioni di ricerca è diversa dall'ottimizzazione dei parametri delle prestazioni di inserimento e si basa molto sull'esperienza pratica.</p>
<p>Una volta individuati "quali parametri regolare", le successive domande su "come regolare" diventano più gestibili. Per le procedure specifiche, consultare la nostra documentazione <a href="https://milvus.io/docs/configure-helm.md">Configurare Milvus</a>. La grande novità è che Milvus supporta le regolazioni dinamiche dei parametri dalla versione 2.3.0, eliminando la necessità di riavviare il sistema per rendere effettive le modifiche. Per le procedure specifiche, consultare <a href="https://milvus.io/docs/dynamic_config.md">Configurare Milvus al volo</a>.</p>
<h2 id="6-Logs--navigating-the-troubleshooting-compass" class="common-anchor-header">#6 Registri - navigare nella bussola della risoluzione dei problemi<button data-href="#6-Logs--navigating-the-troubleshooting-compass" class="anchor-icon" translate="no">
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
    </button></h2><p>I "registri" servono come bussola per la risoluzione dei problemi. Gli utenti hanno cercato nella comunità indicazioni sull'esportazione dei log di Milvus, sulla regolazione dei livelli di log e sull'integrazione con sistemi come Loki di Grafana. Ecco alcuni suggerimenti sui log di Milvus.</p>
<ul>
<li><p><strong>Come visualizzare ed esportare i log di Milvus:</strong> È possibile esportare facilmente i log di Milvus con lo script <a href="https://github.com/milvus-io/milvus/tree/master/deployments/export-log">export-milvus-log.sh</a>, disponibile sul repository GitHub.</p></li>
<li><p><strong>Livello di log:</strong> Milvus ha diversi livelli di log per adattarsi a diversi casi d'uso. Il livello info è sufficiente per la maggior parte dei casi, mentre il livello debug è per il debug. Un eccesso di log di Milvus può segnalare livelli di log non configurati correttamente.</p></li>
<li><p><strong>Si consiglia di integrare i registri di Milvus con un sistema di raccolta dei registri</strong> come Loki per semplificare il recupero dei registri nella risoluzione dei problemi futuri.</p></li>
</ul>
<h2 id="7-Cluster--scaling-for-production-environments" class="common-anchor-header">Cluster #7 - scalare per gli ambienti di produzione<button data-href="#7-Cluster--scaling-for-production-environments" class="anchor-icon" translate="no">
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
    </button></h2><p>Data l'identità di Milvus come database vettoriale distribuito, il termine "cluster" è un argomento di discussione frequente nella comunità. Le conversazioni vertono sulla scalabilità dei dati in un cluster, sulla migrazione dei dati e sul backup e la sincronizzazione dei dati.</p>
<p>Negli ambienti di produzione, una robusta scalabilità e un'elevata disponibilità sono requisiti standard per i sistemi di database distribuiti. L'architettura di separazione storage-computazione di Milvus consente una scalabilità dei dati senza soluzione di continuità, espandendo le risorse per i nodi di calcolo e di storage, in modo da poter gestire una scala di dati illimitata. Milvus offre inoltre un'elevata disponibilità grazie a un'architettura multi-replica e a solide funzionalità di backup e sincronizzazione.  Per ulteriori informazioni, consultare <a href="https://milvus.io/docs/coordinator_ha.md#Coordinator-HA">Coordinator HA</a>.</p>
<h2 id="8-Documentation--the-gateway-to-understanding-Milvus" class="common-anchor-header">#8 Documentazione - la porta d'accesso alla comprensione di Milvus<button data-href="#8-Documentation--the-gateway-to-understanding-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>"Documentazione" è un'altra parola chiave frequentemente sollevata nelle discussioni della comunità, spesso legata a domande sull'esistenza di una pagina di documentazione per una specifica funzionalità e su dove trovarla.</p>
<p>Come porta d'accesso alla comprensione di Milvus, circa l'80% delle richieste della comunità trova risposta nella <a href="https://milvus.io/docs">documentazione ufficiale</a>. Vi consigliamo di leggere la documentazione prima di utilizzare Milvus o di incontrare problemi. Inoltre, è possibile esplorare gli esempi di codice nei vari repository dell'SDK per capire come utilizzare Milvus.</p>
<h2 id="9-Deployment--simplifying-the-Milvus-journey" class="common-anchor-header">#9 Deployment - semplificare il viaggio in Milvus<button data-href="#9-Deployment--simplifying-the-Milvus-journey" class="anchor-icon" translate="no">
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
    </button></h2><p>La semplicità di distribuzione rimane l'obiettivo costante del team Milvus. Per rispettare questo impegno, abbiamo introdotto <a href="https://milvus.io/docs/milvus_lite.md#Get-Started-with-Milvus-Lite">Milvus Lite</a>, un'alternativa leggera a Milvus che è completamente funzionale ma non ha dipendenze da K8s o Docker.</p>
<p>Abbiamo ulteriormente semplificato la distribuzione introducendo la soluzione di messaggistica <a href="https://zilliz.com/blog/optimizing-data-communication-milvus-embraces-nats-messaging">NATS</a>, più leggera, e consolidando i componenti dei nodi. In risposta al feedback degli utenti, ci stiamo preparando a rilasciare una versione standalone senza dipendenze, con continui sforzi per migliorare le funzionalità e semplificare le operazioni di distribuzione. La rapida iterazione di Milvus dimostra il continuo impegno della comunità nel perfezionamento del processo di distribuzione.</p>
<h2 id="10-Deletion--unraveling-the-impact" class="common-anchor-header">#10 Cancellazione - svelare l'impatto<button data-href="#10-Deletion--unraveling-the-impact" class="anchor-icon" translate="no">
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
    </button></h2><p>Le discussioni prevalenti sulla "cancellazione" ruotano intorno al conteggio dei dati invariati dopo la cancellazione, alla continua recuperabilità dei dati cancellati e al fallimento del recupero dello spazio su disco dopo la cancellazione.</p>
<p>Milvus 2.3 introduce l'espressione <code translate="no">count(*)</code> per affrontare gli aggiornamenti ritardati del conteggio delle entità. La persistenza dei dati cancellati nelle query è probabilmente dovuta all'uso inappropriato dei <a href="https://zilliz.com/blog/understand-consistency-models-for-vector-databases">modelli di consistenza dei dati</a>. I problemi legati al recupero dello spazio su disco hanno portato a ridisegnare il meccanismo di garbage collection di Milvus, che stabilisce un periodo di attesa prima della completa cancellazione dei dati. Questo approccio consente una finestra temporale per un potenziale recupero.</p>
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
    </button></h2><p>Le prime 10 parole chiave offrono uno sguardo alle vivaci discussioni all'interno della comunità Milvus. Mentre Milvus continua a evolversi, la comunità rimane una risorsa inestimabile per gli sviluppatori che cercano soluzioni, condividono esperienze e contribuiscono a far progredire i database vettoriali nell'era dell'intelligenza artificiale.</p>
<p>Unitevi a questo entusiasmante viaggio unendovi al nostro <a href="https://discord.com/invite/8uyFbECzPX">canale Discord</a> nel 2024. Lì potrete confrontarvi con i nostri brillanti ingegneri e connettervi con gli appassionati di Milvus che la pensano allo stesso modo. Inoltre, partecipate al <a href="https://discord.com/invite/RjNbk8RR4f">Milvus Community Lunch and Learn</a> ogni martedì dalle 12:00 alle 12:30 PST. Condividete i vostri pensieri, le vostre domande e i vostri feedback, perché ogni contributo contribuisce allo spirito collaborativo che spinge Milvus in avanti. La vostra partecipazione attiva non è solo gradita, è apprezzata. Innoviamo insieme!</p>
