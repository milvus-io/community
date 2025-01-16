---
id: milvus-embraces-nats-messaging.md
title: 'Ottimizzare la comunicazione dei dati: Milvus abbraccia la messaggistica NATS'
author: Zhen Ye
date: 2023-11-24T00:00:00.000Z
desc: >-
  Presentazione dell'integrazione di NATS e Milvus, esplorando le sue
  caratteristiche, il processo di configurazione e migrazione e i risultati dei
  test sulle prestazioni.
cover: assets.zilliz.com/Exploring_NATS_878f48c848.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, NATS, Message Queues, RocksMQ
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/optimizing-data-communication-milvus-embraces-nats-messaging
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Exploring_NATS_878f48c848.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nell'intricato arazzo dell'elaborazione dei dati, la comunicazione continua è il filo conduttore delle operazioni. <a href="https://zilliz.com/what-is-milvus">Milvus</a>, l'innovativo <a href="https://zilliz.com/cloud">database vettoriale open-source</a>, ha intrapreso un viaggio di trasformazione con la sua ultima funzione: l'integrazione della messaggistica NATS. In questo esauriente post del blog, sveleremo le complessità di questa integrazione, esplorando le sue caratteristiche principali, il processo di configurazione, i vantaggi della migrazione e come si colloca rispetto al suo predecessore, RocksMQ.</p>
<h2 id="Understanding-the-role-of-message-queues-in-Milvus" class="common-anchor-header">Capire il ruolo delle code di messaggi in Milvus<button data-href="#Understanding-the-role-of-message-queues-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Nell'architettura cloud-native di Milvus, la coda di messaggi, o Log Broker, ha un'importanza fondamentale. È la spina dorsale che garantisce flussi di dati persistenti, sincronizzazione, notifiche di eventi e integrità dei dati durante i ripristini del sistema. Tradizionalmente, RocksMQ era la scelta più semplice in Milvus Standalone, soprattutto se confrontato con Pulsar e Kafka, ma i suoi limiti diventavano evidenti con dati estesi e scenari complessi.</p>
<p>Milvus 2.3 introduce NATS, un'implementazione MQ a singolo nodo che ridefinisce il modo di gestire i flussi di dati. A differenza dei suoi predecessori, NATS libera gli utenti di Milvus dai vincoli delle prestazioni, offrendo un'esperienza senza soluzione di continuità nella gestione di grandi volumi di dati.</p>
<h2 id="What-is-NATS" class="common-anchor-header">Che cos'è NATS?<button data-href="#What-is-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>NATS è una tecnologia di connettività di sistema distribuita implementata in Go. Supporta varie modalità di comunicazione come Request-Reply e Publish-Subscribe tra i sistemi, fornisce la persistenza dei dati attraverso JetStream e offre funzionalità distribuite attraverso RAFT integrato. Per una comprensione più dettagliata di <a href="https://nats.io/">NATS</a>, si può fare riferimento al <a href="https://nats.io/">sito ufficiale di NATS</a>.</p>
<p>In Milvus 2.3 Standalone, NATS, JetStream e PubSub forniscono a Milvus solide funzionalità MQ.</p>
<h2 id="Enabling-NATS" class="common-anchor-header">Abilitazione di NATS<button data-href="#Enabling-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 offre una nuova opzione di controllo, <code translate="no">mq.type</code>, che consente agli utenti di specificare il tipo di MQ che si desidera utilizzare. Per abilitare NATS, impostate <code translate="no">mq.type=natsmq</code>. Se dopo l'avvio delle istanze di Milvus vengono visualizzati log simili a quelli riportati di seguito, significa che è stato abilitato NATS come coda di messaggi.</p>
<pre><code translate="no">[INFO] [dependency/factory.go:83] [<span class="hljs-string">&quot;try to init mq&quot;</span>] [standalone=<span class="hljs-literal">true</span>] [mqType=natsmq]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Configuring-NATS-for-Milvus" class="common-anchor-header">Configurazione di NATS per Milvus<button data-href="#Configuring-NATS-for-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Le opzioni di personalizzazione di NATS includono la specificazione della porta di ascolto, della directory di archiviazione di JetStream, della dimensione massima del payload e del timeout di inizializzazione. La messa a punto di queste impostazioni garantisce prestazioni e affidabilità ottimali.</p>
<pre><code translate="no">natsmq:
server: <span class="hljs-comment"># server side configuration for natsmq.</span>
port: <span class="hljs-number">4222</span> <span class="hljs-comment"># 4222 by default, Port for nats server listening.</span>
storeDir: /var/lib/milvus/nats <span class="hljs-comment"># /var/lib/milvus/nats by default, directory to use for JetStream storage of nats.</span>
maxFileStore: <span class="hljs-number">17179869184</span> <span class="hljs-comment"># (B) 16GB by default, Maximum size of the &#x27;file&#x27; storage.</span>
maxPayload: <span class="hljs-number">8388608</span> <span class="hljs-comment"># (B) 8MB by default, Maximum number of bytes in a message payload.</span>
maxPending: <span class="hljs-number">67108864</span> <span class="hljs-comment"># (B) 64MB by default, Maximum number of bytes buffered for a connection Applies to client connections.</span>
initializeTimeout: <span class="hljs-number">4000</span> <span class="hljs-comment"># (ms) 4s by default, waiting for initialization of natsmq finished.</span>
monitor:
trace: false <span class="hljs-comment"># false by default, If true enable protocol trace log messages.</span>
debug: false <span class="hljs-comment"># false by default, If true enable debug log messages.</span>
logTime: true <span class="hljs-comment"># true by default, If set to false, log without timestamps.</span>
logFile: /tmp/milvus/logs/nats.log <span class="hljs-comment"># /tmp/milvus/logs/nats.log by default, Log file path relative to .. of milvus binary if use relative path.</span>
logSizeLimit: <span class="hljs-number">536870912</span> <span class="hljs-comment"># (B) 512MB by default, Size in bytes after the log file rolls over to a new one.</span>
retention:
maxAge: <span class="hljs-number">4320</span> <span class="hljs-comment"># (min) 3 days by default, Maximum age of any message in the P-channel.</span>
maxBytes: <span class="hljs-comment"># (B) None by default, How many bytes the single P-channel may contain. Removing oldest messages if the P-channel exceeds this size.</span>
maxMsgs: <span class="hljs-comment"># None by default, How many message the single P-channel may contain. Removing oldest messages if the P-channel exceeds this limit.</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Nota:</strong></p>
<ul>
<li><p>È necessario specificare <code translate="no">server.port</code> per l'ascolto del server NATS. Se c'è un conflitto di porte, Milvus non può avviarsi. Impostate <code translate="no">server.port=-1</code> per selezionare casualmente una porta.</p></li>
<li><p><code translate="no">storeDir</code> specifica la directory per l'archiviazione di JetStream. Si consiglia di memorizzare la directory in un'unità a stato solido (SSD) ad alte prestazioni per migliorare la velocità di lettura/scrittura di Milvus.</p></li>
<li><p><code translate="no">maxFileStore</code> imposta il limite superiore della dimensione di archiviazione di JetStream. Il superamento di questo limite impedisce la scrittura di ulteriori dati.</p></li>
<li><p><code translate="no">maxPayload</code> limita la dimensione dei singoli messaggi. Si consiglia di mantenerla al di sopra dei 5 MB per evitare che la scrittura venga rifiutata.</p></li>
<li><p><code translate="no">initializeTimeout</code>controlla il timeout di avvio del server NATS.</p></li>
<li><p><code translate="no">monitor</code> configura i registri indipendenti di NATS.</p></li>
<li><p><code translate="no">retention</code> controlla il meccanismo di conservazione dei messaggi NATS.</p></li>
</ul>
<p>Per ulteriori informazioni, consultare la <a href="https://docs.nats.io/running-a-nats-service/configuration">documentazione ufficiale di NATS</a>.</p>
<h2 id="Migrating-from-RocksMQ-to-NATS" class="common-anchor-header">Migrazione da RocksMQ a NATS<button data-href="#Migrating-from-RocksMQ-to-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>La migrazione da RocksMQ a NATS è un processo senza soluzione di continuità che prevede passaggi come l'interruzione delle operazioni di scrittura, il flussaggio dei dati, la modifica delle configurazioni e la verifica della migrazione attraverso i log di Milvus.</p>
<ol>
<li><p>Prima di iniziare la migrazione, interrompere tutte le operazioni di scrittura in Milvus.</p></li>
<li><p>Eseguire l'operazione <code translate="no">FlushALL</code> in Milvus e attendere il suo completamento. Questo passaggio assicura che tutti i dati in sospeso vengano scaricati e che il sistema sia pronto per lo spegnimento.</p></li>
<li><p>Modificare il file di configurazione di Milvus impostando <code translate="no">mq.type=natsmq</code> e regolando le opzioni pertinenti nella sezione <code translate="no">natsmq</code>.</p></li>
<li><p>Avviare Milvus 2.3.</p></li>
<li><p>Eseguire il backup e la pulizia dei dati originali memorizzati nella directory <code translate="no">rocksmq.path</code>. (Opzionale)</p></li>
</ol>
<h2 id="NATS-vs-RocksMQ-A-Performance-Showdown" class="common-anchor-header">NATS vs. RocksMQ: un confronto sulle prestazioni<button data-href="#NATS-vs-RocksMQ-A-Performance-Showdown" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="PubSub-Performance-Testing" class="common-anchor-header">Test delle prestazioni Pub/Sub</h3><ul>
<li><p><strong>Piattaforma di test:</strong> Chip M1 Pro / Memoria: 16 GB</p></li>
<li><p><strong>Scenario di test:</strong> Sottoscrizione e pubblicazione di pacchetti di dati casuali a un argomento ripetutamente fino alla ricezione dell'ultimo risultato pubblicato.</p></li>
<li><p><strong>Risultati:</strong></p>
<ul>
<li><p>Per i pacchetti di dati più piccoli (&lt; 64kb), RocksMQ supera NATS in termini di memoria, CPU e velocità di risposta.</p></li>
<li><p>Per i pacchetti di dati più grandi (&gt; 64kb), NATS supera RocksMQ, offrendo tempi di risposta molto più rapidi.</p></li>
</ul></li>
</ul>
<table>
<thead>
<tr><th>Tipo di test</th><th>MQ</th><th>numero di operazioni</th><th>costo per operazione</th><th>Costo della memoria</th><th>Tempo totale della CPU</th><th>Costo di archiviazione</th></tr>
</thead>
<tbody>
<tr><td>5MB*100 Pub/Sub</td><td>NATS</td><td>50</td><td>1,650328186 s/op</td><td>4,29 GB</td><td>85.58</td><td>25G</td></tr>
<tr><td>5MB*100 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>2,475595131 s/op</td><td>1,18 GB</td><td>81.42</td><td>19G</td></tr>
<tr><td>1MB*500 Pub/Sub</td><td>NATS</td><td>50</td><td>2,248722593 s/op</td><td>2,60 GB</td><td>96.50</td><td>25G</td></tr>
<tr><td>1MB*500 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>2.554614279 s/op</td><td>614,9 MB</td><td>80.19</td><td>19G</td></tr>
<tr><td>64KB*10000 Pub/Sub</td><td>NATS</td><td>50</td><td>2.133345262 s/op</td><td>3,29 GB</td><td>97.59</td><td>31G</td></tr>
<tr><td>64KB*10000 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>3.253778195 s/op</td><td>331,2 MB</td><td>134.6</td><td>24G</td></tr>
<tr><td>1KB*50000 Pub/Sub</td><td>NATS</td><td>50</td><td>2.629391004 s/op</td><td>635,1 MB</td><td>179.67</td><td>2.6G</td></tr>
<tr><td>1KB*50000 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>0,897638581 s/op</td><td>232,3 MB</td><td>60.42</td><td>521M</td></tr>
</tbody>
</table>
<p>Tabella 1: Risultati dei test sulle prestazioni Pub/Sub</p>
<h3 id="Milvus-Integration-Testing" class="common-anchor-header">Test di integrazione Milvus</h3><p><strong>Dimensione dei dati:</strong> 100M</p>
<p><strong>Risultato:</strong> Nei test approfonditi con un set di dati da 100 milioni di vettori, NATS ha dimostrato una minore latenza di ricerca e di interrogazione dei vettori.</p>
<table>
<thead>
<tr><th>Metriche</th><th>RocksMQ (ms)</th><th>NATS (ms)</th></tr>
</thead>
<tbody>
<tr><td>Latenza media di ricerca vettoriale</td><td>23.55</td><td>20.17</td></tr>
<tr><td>Richieste di ricerca vettoriale al secondo (RPS)</td><td>2.95</td><td>3.07</td></tr>
<tr><td>Latenza media delle query</td><td>7.2</td><td>6.74</td></tr>
<tr><td>Richieste di query al secondo (RPS)</td><td>1.47</td><td>1.54</td></tr>
</tbody>
</table>
<p>Tabella 2: Risultati del test di integrazione di Milvus con il dataset 100m</p>
<p><strong>Set di dati: &lt;100M</strong></p>
<p><strong>Risultato:</strong> Per i dataset inferiori a 100M, NATS e RocksMQ mostrano prestazioni simili.</p>
<h2 id="Conclusion-Empowering-Milvus-with-NATS-messaging" class="common-anchor-header">Conclusioni: Potenziare Milvus con la messaggistica NATS<button data-href="#Conclusion-Empowering-Milvus-with-NATS-messaging" class="anchor-icon" translate="no">
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
    </button></h2><p>L'integrazione di NATS in Milvus segna un passo significativo nell'elaborazione dei dati. Sia che si tratti di analisi in tempo reale, di applicazioni di apprendimento automatico o di qualsiasi altra impresa ad alta intensità di dati, NATS consente ai progetti di ottenere efficienza, affidabilità e velocità. Con l'evoluzione del panorama dei dati, la presenza di un sistema di messaggistica solido come NATS all'interno di Milvus garantisce una comunicazione dei dati affidabile e ad alte prestazioni.</p>
