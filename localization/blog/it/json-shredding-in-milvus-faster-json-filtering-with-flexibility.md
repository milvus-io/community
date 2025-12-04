---
id: json-shredding-in-milvus-faster-json-filtering-with-flexibility.md
title: >-
  Triturazione JSON in Milvus: filtraggio JSON 88,9 volte più veloce e
  flessibile
author: Jack Zhang
date: 2025-12-04T00:00:00.000Z
cover: assets.zilliz.com/Milvus_Week_JSON_Shredding_cover_829a12b086.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, JSON Shredding, JSON performance, columnar storage'
meta_title: |
  Milvus JSON Shredding: Faster JSON Filtering With Flexibility
desc: >-
  Scoprite come Milvus JSON Shredding utilizza l'archiviazione colonnare
  ottimizzata per accelerare le query JSON fino a 89×, mantenendo la piena
  flessibilità dello schema.
origin: >-
  https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md
---
<p>I moderni sistemi di intelligenza artificiale producono più dati JSON semi-strutturati che mai. Le informazioni sui clienti e sui prodotti vengono compattate in un oggetto JSON, i microservizi emettono log JSON a ogni richiesta, i dispositivi IoT trasmettono le letture dei sensori in payload JSON leggeri e le applicazioni AI di oggi si standardizzano sempre più su JSON per l'output strutturato. Il risultato è una marea di dati di tipo JSON che confluiscono nei database vettoriali.</p>
<p>Tradizionalmente, esistono due modi per gestire i documenti JSON:</p>
<ul>
<li><p><strong>Predefinire ogni campo di JSON in uno schema fisso e costruire un indice:</strong> Questo approccio offre buone prestazioni di interrogazione, ma è rigido. Quando il formato dei dati cambia, ogni campo nuovo o modificato comporta un'altra serie di dolorosi aggiornamenti del Data Definition Language (DDL) e migrazioni dello schema.</p></li>
<li><p><strong>Memorizzare l'intero oggetto JSON come una singola colonna (sia il tipo JSON che Dynamic Schema in Milvus utilizzano questo approccio):</strong> Questa opzione offre un'eccellente flessibilità, ma a scapito delle prestazioni delle query. Ogni richiesta richiede il parsing JSON in runtime e spesso una scansione completa della tabella, con conseguente latenza che aumenta con la crescita del set di dati.</p></li>
</ul>
<p>Un tempo si trattava di un dilemma tra flessibilità e prestazioni.</p>
<p>Non più con la nuova funzione JSON Shredding di <a href="https://milvus.io/">Milvus</a>.</p>
<p>Con l'introduzione di <a href="https://milvus.io/docs/json-shredding.md">JSON Shredding</a>, Milvus raggiunge ora un'agilità senza schema con le prestazioni dell'archiviazione colonnare, rendendo finalmente i dati semi-strutturati su larga scala flessibili e facili da interrogare.</p>
<h2 id="How-JSON-Shredding-Works" class="common-anchor-header">Come funziona la triturazione JSON<button data-href="#How-JSON-Shredding-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>La triturazione JSON accelera le query JSON trasformando i documenti JSON basati su righe in archivi colonnari altamente ottimizzati. Milvus conserva la flessibilità di JSON per la modellazione dei dati e ottimizza automaticamente l'archiviazione colonnare, migliorando significativamente l'accesso ai dati e le prestazioni delle query.</p>
<p>Per gestire in modo efficiente campi JSON scarsi o rari, Milvus dispone anche di un indice invertito per le chiavi condivise. Tutto questo avviene in modo trasparente per gli utenti: è possibile inserire documenti JSON come di consueto, lasciando a Milvus il compito di gestire internamente la strategia ottimale di archiviazione e indicizzazione.</p>
<p>Quando Milvus riceve record JSON grezzi con forme e strutture diverse, analizza ogni chiave JSON per verificarne il rapporto di occorrenza e la stabilità del tipo (se il tipo di dati è coerente tra i documenti). In base a questa analisi, ogni chiave viene classificata in una delle tre categorie:</p>
<ul>
<li><p><strong>Chiavi digitate:</strong> Chiavi che appaiono nella maggior parte dei documenti e che hanno sempre lo stesso tipo di dati (ad esempio, tutti i numeri interi o tutte le stringhe).</p></li>
<li><p><strong>Chiavi dinamiche</strong>: Chiavi che appaiono frequentemente ma che hanno tipi di dati misti (ad esempio, a volte una stringa, a volte un numero intero).</p></li>
<li><p><strong>Chiavi condivise:</strong> Chiavi poco frequenti, rade o annidate, al di sotto di una soglia di frequenza configurabile.</p></li>
</ul>
<p>Milvus gestisce ogni categoria in modo diverso per massimizzare l'efficienza:</p>
<ul>
<li><p>Le<strong>chiavi digitate</strong> sono memorizzate in colonne dedicate e fortemente tipizzate.</p></li>
<li><p>Le<strong>chiavi dinamiche</strong> sono collocate in colonne dinamiche in base al tipo di valore effettivo osservato in fase di esecuzione.</p></li>
<li><p>Sia le colonne tipizzate che quelle dinamiche sono memorizzate in formati colonnari Arrow/Parquet per una scansione rapida e un'esecuzione altamente ottimizzata delle query.</p></li>
<li><p>Le<strong>chiavi condivise</strong> sono consolidate in una colonna binary-JSON compatta, accompagnata da un indice invertito a chiave condivisa. Questo indice accelera le interrogazioni sui campi a bassa frequenza, eliminando precocemente le righe irrilevanti e limitando la ricerca ai soli documenti che contengono la chiave interrogata.</p></li>
</ul>
<p>Questa combinazione di archiviazione colonnare adattiva e indicizzazione invertita costituisce il nucleo del meccanismo di triturazione JSON di Milvus, consentendo flessibilità e prestazioni elevate su scala.</p>
<p>Il flusso di lavoro complessivo è illustrato di seguito:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/json_shredding_79a62a9661.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dopo aver illustrato le basi del funzionamento di JSON Shredding, diamo un'occhiata più da vicino alle funzionalità chiave che rendono questo approccio flessibile e performante.</p>
<h3 id="Shredding-and-Columnarization" class="common-anchor-header">Sminuzzamento e Columnarizzazione</h3><p>Quando viene scritto un nuovo documento JSON, Milvus lo scompone e lo riorganizza in una memoria colonnare ottimizzata:</p>
<ul>
<li><p>Le chiavi digitate e dinamiche vengono identificate automaticamente e memorizzate in colonne dedicate.</p></li>
<li><p>Se il JSON contiene oggetti annidati, Milvus genera automaticamente nomi di colonne basati sul percorso. Ad esempio, un campo <code translate="no">name</code> all'interno di un oggetto <code translate="no">user</code> può essere memorizzato con il nome di colonna <code translate="no">/user/name</code>.</p></li>
<li><p>Le chiavi condivise vengono memorizzate insieme in un'unica colonna JSON binaria e compatta. Poiché queste chiavi appaiono di rado, Milvus crea un indice inverso per esse, consentendo un filtraggio veloce e permettendo al sistema di individuare rapidamente le righe che contengono la chiave specificata.</p></li>
</ul>
<h3 id="Intelligent-Column-Management" class="common-anchor-header">Gestione intelligente delle colonne</h3><p>Oltre alla triturazione di JSON in colonne, Milvus aggiunge un ulteriore livello di intelligenza attraverso la gestione dinamica delle colonne, assicurando che la triturazione di JSON rimanga flessibile con l'evoluzione dei dati.</p>
<ul>
<li><p><strong>Colonne create secondo le necessità:</strong> Quando nei documenti JSON in arrivo compaiono nuove chiavi, Milvus raggruppa automaticamente i valori con la stessa chiave in una colonna dedicata. In questo modo si conservano i vantaggi in termini di prestazioni dell'archiviazione colonnare senza richiedere agli utenti di progettare schemi a priori. Milvus deduce anche il tipo di dati dei nuovi campi (ad esempio, INTEGER, DOUBLE, VARCHAR) e seleziona per essi un formato colonnare efficiente.</p></li>
<li><p><strong>Ogni chiave viene gestita automaticamente:</strong> Milvus analizza ed elabora ogni chiave del documento JSON. Ciò garantisce un'ampia copertura delle query senza costringere gli utenti a predefinire i campi o a creare indici in anticipo.</p></li>
</ul>
<h3 id="Query-Optimization" class="common-anchor-header">Ottimizzazione delle query</h3><p>Una volta riorganizzati i dati nelle colonne giuste, Milvus seleziona il percorso di esecuzione più efficiente per ogni query:</p>
<ul>
<li><p><strong>Scansione diretta delle colonne per le chiavi digitate e dinamiche:</strong> Se una query si rivolge a un campo che è già stato suddiviso in una propria colonna, Milvus può eseguire una scansione diretta della colonna. Questo riduce la quantità totale di dati da elaborare e sfrutta il calcolo colonnare accelerato SIMD per un'esecuzione ancora più rapida.</p></li>
<li><p><strong>Ricerca indicizzata per le chiavi condivise:</strong> Se la query coinvolge un campo che non è stato promosso in una propria colonna (tipicamente una chiave rara), Milvus la valuta rispetto alla colonna della chiave condivisa. L'indice invertito costruito su questa colonna consente a Milvus di identificare rapidamente le righe che contengono la chiave specificata e di saltare le altre, migliorando significativamente le prestazioni per i campi a bassa frequenza.</p></li>
<li><p><strong>Gestione automatica dei metadati:</strong> Milvus mantiene costantemente i metadati e i dizionari globali in modo che le query rimangano accurate ed efficienti, anche quando la struttura dei documenti JSON in arrivo si evolve nel tempo.</p></li>
</ul>
<h2 id="Performance-benchmarks" class="common-anchor-header">Parametri di riferimento delle prestazioni<button data-href="#Performance-benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>Abbiamo progettato un benchmark per confrontare le prestazioni delle query memorizzando l'intero documento JSON come un singolo campo grezzo rispetto all'utilizzo della nuova funzione JSON Shredding.</p>
<h3 id="Test-environment-and-methodology" class="common-anchor-header">Ambiente e metodologia di test</h3><ul>
<li><p>Hardware: cluster da 1 core/8GB</p></li>
<li><p>Set di dati: 1 milione di documenti da <a href="https://github.com/ClickHouse/JSONBench.git">JSONBench</a></p></li>
<li><p>Metodologia: Misurare QPS e latenza attraverso diversi modelli di query</p></li>
</ul>
<h3 id="Results-typed-keys" class="common-anchor-header">Risultati: chiavi digitate</h3><p>Questo test ha misurato le prestazioni quando si interroga una chiave presente nella maggior parte dei documenti.</p>
<table>
<thead>
<tr><th>Espressione della query</th><th>QPS (senza triturazione)</th><th>QPS (con triturazione)</th><th>Aumento delle prestazioni</th></tr>
</thead>
<tbody>
<tr><td>json['time_us'] &gt; 0</td><td>8.69</td><td>287.5</td><td><strong>33x</strong></td></tr>
<tr><td>json['kind'] == 'commit'</td><td>8.42</td><td>126.1</td><td><strong>14.9x</strong></td></tr>
</tbody>
</table>
<h3 id="Results-shared-keys" class="common-anchor-header">Risultati: chiavi condivise</h3><p>Questo test si è concentrato sull'interrogazione di chiavi rade e annidate che rientrano nella categoria "condivise".</p>
<table>
<thead>
<tr><th>Espressione della query</th><th>QPS (senza triturazione)</th><th>QPS (con triturazione)</th><th>Incremento delle prestazioni</th></tr>
</thead>
<tbody>
<tr><td>json['identity']['seq'] &gt; 0</td><td>4.33</td><td>385</td><td><strong>88.9x</strong></td></tr>
<tr><td>json['identity']['did'] == 'xxxxx'</td><td>7.6</td><td>352</td><td><strong>46.3x</strong></td></tr>
</tbody>
</table>
<p>Le query a chiave condivisa mostrano i miglioramenti più evidenti (fino a 89 volte più veloci), mentre le query a chiave digitata offrono una velocità costante di 15-30 volte. Nel complesso, ogni tipo di query trae vantaggio da JSON Shredding, con evidenti guadagni di prestazioni su tutta la linea.</p>
<h2 id="Try-It-Now" class="common-anchor-header">Provatelo ora<button data-href="#Try-It-Now" class="anchor-icon" translate="no">
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
    </button></h2><p>Se lavorate con i log delle API, i dati dei sensori IoT o i payload delle applicazioni in rapida evoluzione, JSON Shredding vi offre la rara possibilità di avere sia flessibilità che prestazioni elevate.</p>
<p>La funzione è ora disponibile e potete provarla subito. Per ulteriori dettagli è possibile consultare <a href="https://milvus.io/docs/json-shredding.md">questo documento</a>.</p>
<p>Avete domande o volete un approfondimento su una qualsiasi funzione dell'ultima versione di Milvus? Unitevi al nostro<a href="https://discord.com/invite/8uyFbECzPX"> canale Discord</a> o inviate problemi su<a href="https://github.com/milvus-io/milvus"> GitHub</a>. È anche possibile prenotare una sessione individuale di 20 minuti per ottenere approfondimenti, indicazioni e risposte alle vostre domande tramite<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<p>E se volete saperne di più, restate sintonizzati per ulteriori approfondimenti durante la nostra serie di Milvus Week.</p>
