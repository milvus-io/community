---
id: >-
  2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md
title: Come la piattaforma di video brevi Likee rimuove i video duplicati con Milvus
author: 'Xinyang Guo, Baoyu Han'
date: 2022-06-23T00:00:00.000Z
desc: >-
  Scoprite come Likee utilizza Milvus per identificare i video duplicati in
  pochi millisecondi.
cover: >-
  assets.zilliz.com/How_Short_video_Platform_Likee_Removes_Duplicate_Videos_with_Milvus_07bd75ec82.png
tag: Scenarios
tags: Use Cases of Milvus
canonicalUrl: >-
  https://milvus.io/blog/2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_Short_video_Platform_Likee_Removes_Duplicate_Videos_with_Milvus_07bd75ec82.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Immagine di copertina</span> </span></p>
<blockquote>
<p>Questo articolo è stato scritto da Xinyang Guo e Baoyu Han, ingegneri di BIGO, e tradotto da <a href="https://www.linkedin.cn/incareer/in/rosie-zhang-694528149">Rosie Zhang</a>.</p>
</blockquote>
<p><a href="https://www.bigo.sg/">BIGO Technology</a> (BIGO) è una delle aziende tecnologiche di Singapore in più rapida crescita. Grazie alla tecnologia dell'intelligenza artificiale, i prodotti e i servizi di BIGO basati sui video hanno guadagnato un'immensa popolarità in tutto il mondo, con oltre 400 milioni di utenti in più di 150 Paesi. Tra questi, <a href="https://www.bigo.tv/bigo_intro/en.html?hk=true">Bigo Live</a> (live streaming) e <a href="https://likee.video/">Likee</a> (video di breve durata).</p>
<p>Likee è una piattaforma globale per la creazione di video brevi in cui gli utenti possono condividere i loro momenti, esprimersi e connettersi con il mondo. Per migliorare l'esperienza degli utenti e raccomandare loro contenuti di qualità superiore, Likee deve eliminare i video duplicati dall'enorme quantità di video generati dagli utenti ogni giorno, un compito non semplice.</p>
<p>Questo blog presenta come BIGO utilizza <a href="https://milvus.io">Milvus</a>, un database vettoriale open-source, per rimuovere efficacemente i video duplicati.</p>
<p><strong>Vai a:</strong></p>
<ul>
<li><a href="#Overview">Panoramica</a></li>
<li><a href="#Video-deduplication-workflow">Flusso di lavoro della deduplicazione video</a></li>
<li><a href="#System-architecture">Architettura del sistema</a></li>
<li><a href="#Using-Milvus-vector-database-to-power-similarity-search">Utilizzo di Milvus per la ricerca di similarità</a></li>
</ul>
<custom-h1>Panoramica</custom-h1><p>Milvus è un database vettoriale open-source che offre una ricerca vettoriale ultraveloce. Grazie a Milvus, Likee è in grado di completare una ricerca in 200 ms, garantendo un elevato tasso di richiamo. Inoltre, <a href="https://milvus.io/docs/v2.0.x/scaleout.md#Scale-a-Milvus-Cluster">scalando Milvus orizzontalmente</a>, Likee riesce ad aumentare il throughput delle query vettoriali, migliorando ulteriormente la sua efficienza.</p>
<custom-h1>Flusso di lavoro della deduplicazione video</custom-h1><p>Come fa Likee a identificare i video duplicati? Ogni volta che un video viene inserito nel sistema di Likee, viene tagliato in 15-20 fotogrammi e ogni fotogramma viene convertito in un vettore di caratteristiche. Poi Likee effettua una ricerca in un database di 700 milioni di vettori per trovare i primi K vettori più simili. Ciascuno dei primi K vettori corrisponde a un video del database. Likee effettua ulteriori ricerche raffinate per ottenere i risultati finali e determinare i video da rimuovere.</p>
<custom-h1>Architettura del sistema</custom-h1><p>Vediamo più da vicino come funziona il sistema di de-duplicazione dei video di Likee utilizzando Milvus. Come mostrato nel diagramma sottostante, i nuovi video caricati su Likee vengono scritti in tempo reale su Kafka, un sistema di archiviazione dati, e consumati dai consumatori di Kafka. I vettori di caratteristiche di questi video vengono estratti attraverso modelli di deep learning, dove i dati non strutturati (video) vengono convertiti in vettori di caratteristiche. Questi vettori di caratteristiche vengono confezionati dal sistema e inviati al verificatore di similarità.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Likee_1_6f7ebcd8fc.png" alt="Architechure of Likee's video de-duplication system" class="doc-image" id="architechure-of-likee's-video-de-duplication-system" />
   </span> <span class="img-wrapper"> <span>Architettura del sistema di de-duplicazione video di Likee</span> </span></p>
<p>I vettori di caratteristiche estratti vengono indicizzati da Milvus e memorizzati in Ceph, prima di essere <a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">caricati dal nodo di interrogazione di Milvus</a> per ulteriori ricerche. Gli ID video corrispondenti a questi vettori di caratteristiche saranno memorizzati simultaneamente in TiDB o Pika, a seconda delle esigenze effettive.</p>
<h3 id="Using-Milvus-vector-database-to-power-similarity-search" class="common-anchor-header">Utilizzo del database vettoriale Milvus per la ricerca di similarità</h3><p>Nella ricerca di vettori simili, miliardi di dati esistenti e grandi quantità di nuovi dati generati ogni giorno pongono grandi sfide alla funzionalità del motore di ricerca vettoriale. Dopo un'analisi approfondita, Likee ha scelto Milvus, un motore di ricerca vettoriale distribuito con elevate prestazioni e un alto tasso di richiamo, per condurre la ricerca di similarità vettoriale.</p>
<p>Come mostrato nel diagramma seguente, la procedura di una ricerca di similarità si svolge come segue:</p>
<ol>
<li><p>In primo luogo, Milvus esegue una ricerca batch per richiamare i primi 100 vettori simili per ciascuno dei vettori di caratteristiche multiple estratti da un nuovo video. Ogni vettore simile è legato all'ID video corrispondente.</p></li>
<li><p>In secondo luogo, confrontando gli ID dei video, Milvus rimuove i video duplicati e recupera i vettori di caratteristiche dei video rimanenti da TiDB o Pika.</p></li>
<li><p>Infine, Milvus calcola e assegna un punteggio alla somiglianza tra ciascun set di vettori di caratteristiche recuperati e i vettori di caratteristiche del video di query. L'ID del video con il punteggio più alto viene restituito come risultato. La ricerca di similarità dei video è così conclusa.</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/02_a24d251c8f.png" alt="Procedure of a similarity search" class="doc-image" id="procedure-of-a-similarity-search" />
   </span> <span class="img-wrapper"> <span>Procedura di una ricerca per similarità</span> </span></p>
<p>Come motore di ricerca vettoriale ad alte prestazioni, Milvus ha svolto un lavoro straordinario nel sistema di de-duplicazione dei video di Likee, alimentando notevolmente la crescita del business dei video brevi di BIGO. In termini di attività video, Milvus può essere applicato a molti altri scenari, come il blocco dei contenuti illegali o la raccomandazione di video personalizzati. Sia BIGO che Milvus sono impazienti di collaborare in futuro in altri settori.</p>
