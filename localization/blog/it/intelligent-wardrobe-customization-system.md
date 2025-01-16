---
id: intelligent-wardrobe-customization-system.md
title: >-
  Creare un sistema intelligente di personalizzazione del guardaroba grazie al
  database vettoriale di Milvus
author: Yiyun Ni
date: 2022-07-08T00:00:00.000Z
desc: >-
  Utilizzando la tecnologia di ricerca per similarità per sbloccare il
  potenziale dei dati non strutturati, anche come gli armadi e i loro
  componenti!
cover: assets.zilliz.com/Frame_1282_edc1fb7d99.png
tag: Engineering
tags: >-
  Data science, Database, Use Cases of Milvus, Artificial Intelligence, Vector
  Management
canonicalUrl: 'https://milvus.io/blog/intelligent-wardrobe-customization-system.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1282_edc1fb7d99.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>immagine di copertina</span> </span></p>
<p>Se state cercando un armadio che si adatti perfettamente alla vostra camera da letto o al vostro camerino, scommetto che la maggior parte delle persone penserà a quelli su misura. Tuttavia, non tutti hanno a disposizione un budget così ampio. E allora che dire di quelli già pronti? Il problema di questo tipo di armadi è che è molto probabile che non soddisfino le vostre aspettative, perché non sono abbastanza flessibili da soddisfare le vostre esigenze di spazio. Inoltre, quando si effettua una ricerca online, è piuttosto difficile riassumere il tipo di armadio che si sta cercando con delle parole chiave. È molto probabile che la parola chiave digitata nella casella di ricerca (ad esempio, un armadio con vassoio portagioie) sia molto diversa da come viene definita nel motore di ricerca (ad esempio, un armadio con <a href="https://www.ikea.com/us/en/p/komplement-pull-out-tray-with-insert-black-brown-s79249366/">vassoio estraibile con inserto</a>).</p>
<p>Ma grazie alle tecnologie emergenti, c'è una soluzione! IKEA, il conglomerato di vendita al dettaglio di mobili, fornisce un popolare strumento di progettazione <a href="https://www.ikea.com/us/en/rooms/bedroom/how-to/how-to-design-your-perfect-pax-wardrobe-pub8b76dda0">PAX wardrobe</a> che consente agli utenti di scegliere tra una serie di armadi già pronti e di personalizzarne il colore, le dimensioni e il design interno. Che abbiate bisogno di spazio per appendere, di più ripiani o di cassetti interni, questo sistema intelligente di personalizzazione degli armadi è sempre in grado di soddisfare le vostre esigenze.</p>
<p>Per trovare o costruire il vostro guardaroba ideale utilizzando questo sistema intelligente di progettazione di armadi, è necessario:</p>
<ol>
<li>Specificare i requisiti di base: forma (normale, a L o a U), lunghezza e profondità dell'armadio.</li>
<li>Specificare le esigenze di stoccaggio e l'organizzazione interna dell'armadio (ad esempio, è necessario uno spazio per appendere, un portapantaloni estraibile, ecc.)</li>
<li>Aggiungete o rimuovete parti dell'armadio come cassetti o ripiani.</li>
</ol>
<p>Il progetto è completato. Semplice e facile!</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Pax_system_ff4c3fa182.png" alt="pax system" class="doc-image" id="pax-system" />
   </span> <span class="img-wrapper"> <span>sistema pax</span> </span></p>
<p>Un componente molto importante che rende possibile un sistema di progettazione di armadi è il <a href="https://zilliz.com/learn/what-is-vector-database">database vettoriale</a>. Per questo motivo, questo articolo si propone di presentare il flusso di lavoro e le soluzioni di ricerca per similarità utilizzate per costruire un sistema intelligente di personalizzazione del guardaroba basato sulla ricerca per similarità vettoriale.</p>
<p>Vai a:</p>
<ul>
<li><a href="#System-overview">Panoramica del sistema</a></li>
<li><a href="#Data-flow">Flusso di dati</a></li>
<li><a href="#System-demo">Demo del sistema</a></li>
</ul>
<h2 id="System-Overview" class="common-anchor-header">Panoramica del sistema<button data-href="#System-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Per fornire uno strumento di personalizzazione del guardaroba così intelligente, dobbiamo innanzitutto definire la logica aziendale e comprendere gli attributi degli articoli e il percorso dell'utente. Gli armadi e i loro componenti, come cassetti, vassoi e scaffali, sono tutti dati non strutturati. Pertanto, il secondo passo consiste nello sfruttare gli algoritmi e le regole dell'intelligenza artificiale, le conoscenze pregresse, la descrizione degli articoli e altro ancora, per convertire questi dati non strutturati in un tipo di dati comprensibili ai computer: i vettori!</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Customization_tool_overview_86d62e1730.png" alt="Customization tool overview" class="doc-image" id="customization-tool-overview" />
   </span> <span class="img-wrapper"> <span>Panoramica dello strumento di personalizzazione</span> </span></p>
<p>Con i vettori generati, abbiamo bisogno di potenti database vettoriali e motori di ricerca per elaborarli.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/tool_architecutre_33fb646954.png" alt="tool architecture" class="doc-image" id="tool-architecture" />
   </span> <span class="img-wrapper"> <span>architettura dello strumento</span> </span></p>
<p>Lo strumento di personalizzazione sfrutta alcuni dei motori di ricerca e dei database più diffusi: Elasticsearch, <a href="https://milvus.io/">Milvus</a> e PostgreSQL.</p>
<h3 id="Why-Milvus" class="common-anchor-header">Perché Milvus?</h3><p>Un componente del guardaroba contiene informazioni molto complesse, come il colore, la forma, l'organizzazione interna, ecc. Tuttavia, il modo tradizionale di conservare i dati del guardaroba in un database relazionale non è sufficiente. Un metodo molto diffuso è quello di utilizzare tecniche di embedding per convertire i guardaroba in vettori. Pertanto, è necessario cercare un nuovo tipo di database specificamente progettato per l'archiviazione vettoriale e la ricerca di similarità. Dopo aver sondato diverse soluzioni popolari, è stato scelto il database vettoriale <a href="https://github.com/milvus-io/milvus">Milvus</a> per le sue eccellenti prestazioni, stabilità, compatibilità e facilità d'uso. Il grafico che segue è un confronto tra le diverse soluzioni di ricerca vettoriale più diffuse.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Solution_comparison_d96b8f1dd5.png" alt="solution comparison" class="doc-image" id="solution-comparison" />
   </span> <span class="img-wrapper"> <span>confronto tra le soluzioni</span> </span></p>
<h3 id="System-workflow" class="common-anchor-header">Flusso di lavoro del sistema</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/System_workflow_250c275ec1.png" alt="System workflow" class="doc-image" id="system-workflow" />
   </span> <span class="img-wrapper"> <span>Flusso di lavoro del sistema</span> </span></p>
<p>Elasticsearch viene utilizzato per un filtraggio grossolano in base alle dimensioni del guardaroba, al colore, ecc. Poi i risultati filtrati passano attraverso Milvus, il database vettoriale, per una ricerca di similarità e i risultati vengono classificati in base alla loro distanza/similarità rispetto al vettore della query. Infine, i risultati vengono consolidati e ulteriormente raffinati in base alle intuizioni aziendali.</p>
<h2 id="Data-flow" class="common-anchor-header">Flusso di dati<button data-href="#Data-flow" class="anchor-icon" translate="no">
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
    </button></h2><p>Il sistema di personalizzazione del guardaroba è molto simile ai tradizionali motori di ricerca e sistemi di raccomandazione. Si compone di tre parti:</p>
<ul>
<li>Preparazione dei dati offline, compresa la definizione e la generazione dei dati.</li>
<li>Servizi online, tra cui richiamo e classificazione.</li>
<li>Postelaborazione dei dati basata sulla logica aziendale.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_flow_d0d9fa0fca.png" alt="Data flow" class="doc-image" id="data-flow" />
   </span> <span class="img-wrapper"> <span>Flusso di dati</span> </span></p>
<h3 id="Offline-data-flow" class="common-anchor-header">Flusso di dati offline</h3><ol>
<li>Definire i dati utilizzando le intuizioni aziendali.</li>
<li>Utilizzare le conoscenze pregresse per definire il modo in cui combinare i diversi componenti e formarli in un guardaroba.</li>
<li>Riconoscere le etichette delle caratteristiche degli armadi e codificare le caratteristiche nei dati Elasticsearch in un file <code translate="no">.json</code>.</li>
<li>Preparare i dati di richiamo codificando i dati non strutturati in vettori.</li>
<li>Utilizzare il database vettoriale Milvus per classificare i risultati richiamati ottenuti nella fase precedente.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/offline_data_flow_f91ac9cf4c.png" alt="offline data flow" class="doc-image" id="offline-data-flow" />
   </span> <span class="img-wrapper"> <span>flusso di dati offline</span> </span></p>
<h3 id="Online-data-flow" class="common-anchor-header">Flusso di dati online</h3><ol>
<li>Ricevere le richieste di informazioni dagli utenti e raccogliere i profili degli utenti.</li>
<li>Comprendere le richieste degli utenti identificando i loro requisiti per il guardaroba.</li>
<li>Ricerca grossolana con Elasticsearch.</li>
<li>Attribuire un punteggio e classificare i risultati ottenuti dalla ricerca grossolana in base al calcolo della similarità vettoriale in Milvus.</li>
<li>Post-processare e organizzare i risultati sulla piattaforma back-end per generare i risultati finali.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/online_data_flow_1f2af25cc3.png" alt="online data flow" class="doc-image" id="online-data-flow" />
   </span> <span class="img-wrapper"> <span>flusso di dati online</span> </span></p>
<h3 id="Data-post-processing" class="common-anchor-header">Post-elaborazione dei dati</h3><p>La logica aziendale varia da un'azienda all'altra. È possibile aggiungere un tocco finale ai risultati applicando la logica aziendale.</p>
<h2 id="System-demo" class="common-anchor-header">Demo del sistema<button data-href="#System-demo" class="anchor-icon" translate="no">
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
    </button></h2><p>Vediamo ora come funziona il sistema che abbiamo costruito.</p>
<p>L'interfaccia utente (UI) mostra la possibilità di diverse combinazioni di componenti del guardaroba.</p>
<p>Ogni componente viene etichettato in base alle sue caratteristiche (taglia, colore, ecc.) e memorizzato in Elasticsearch (ES). Quando si memorizzano le etichette in ES, si devono compilare quattro campi di dati principali: ID, tag, percorso di archiviazione e altri campi di supporto. ES e i dati etichettati vengono utilizzati per il richiamo granulare e il filtraggio degli attributi.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/es_d5b0639610.png" alt="es" class="doc-image" id="es" />
   </span> <span class="img-wrapper"> <span>es</span> </span></p>
<p>Quindi vengono utilizzati diversi algoritmi di intelligenza artificiale per codificare un guardaroba in un insieme di vettori. Gli insiemi di vettori vengono memorizzati in Milvus per la ricerca di similarità e la classificazione. Questa fase restituisce risultati più raffinati e accurati.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_38dd93a439.jpeg" alt="Milvus" class="doc-image" id="milvus" />
   </span> <span class="img-wrapper"> <span>Milvus</span> </span></p>
<p>Elasticsearch, Milvus e altri componenti del sistema formano complessivamente la piattaforma di progettazione della personalizzazione. Durante il richiamo, il linguaggio specifico del dominio (DSL) in Elasticsearch e Milvus è il seguente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/dsl_df60097d23.png" alt="dsl" class="doc-image" id="dsl" />
   </span> <span class="img-wrapper"> <span>dsl</span> </span></p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">Cercate altre risorse?<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
    </button></h2><p>Scoprite come il database vettoriale Milvus può alimentare altre applicazioni di intelligenza artificiale:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md">Come la piattaforma di video brevi Likee rimuove i video duplicati con Milvus</a></li>
<li><a href="https://milvus.io/blog/2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md">Zhentu - Il rilevatore di frodi fotografiche basato su Milvus</a></li>
</ul>
