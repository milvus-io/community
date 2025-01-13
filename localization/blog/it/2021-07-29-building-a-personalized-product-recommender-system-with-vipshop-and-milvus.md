---
id: building-a-personalized-product-recommender-system-with-vipshop-and-milvus.md
title: Architettura complessiva
author: milvus
date: 2021-07-29T08:46:39.920Z
desc: >-
  Milvus semplifica la fornitura di servizi di raccomandazione personalizzati
  agli utenti.
cover: assets.zilliz.com/blog_shopping_27fba2c990.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-a-personalized-product-recommender-system-with-vipshop-and-milvus
---
<custom-h1>Creare un sistema di raccomandazione dei prodotti personalizzato con Vipshop e Milvus</custom-h1><p>Con la crescita esplosiva della scala dei dati di Internet, da un lato aumentano la quantità e la categoria dei prodotti nell'attuale piattaforma di e-commerce mainstream, dall'altro aumenta la difficoltà per gli utenti di trovare i prodotti di cui hanno bisogno.</p>
<p><a href="https://www.vip.com/">Vipshop</a> è uno dei principali rivenditori online di marchi scontati in Cina. L'azienda offre ai consumatori di tutta la Cina prodotti di marca di alta qualità e popolari a prezzi notevolmente scontati rispetto ai prezzi al dettaglio. Per ottimizzare l'esperienza di acquisto dei propri clienti, l'azienda ha deciso di costruire un sistema di raccomandazione di ricerca personalizzato basato sulle parole chiave della query dell'utente e sui suoi ritratti.</p>
<p>La funzione principale del sistema di raccomandazione della ricerca nell'e-commerce è quella di recuperare i prodotti adatti da un gran numero di prodotti e di mostrarli agli utenti in base alle loro intenzioni e preferenze di ricerca. In questo processo, il sistema deve calcolare la somiglianza tra i prodotti e le intenzioni e le preferenze di ricerca degli utenti e consigliare agli utenti i prodotti TopK con la maggiore somiglianza.</p>
<p>Dati come le informazioni sui prodotti, le intenzioni di ricerca degli utenti e le loro preferenze sono tutti dati non strutturati. Abbiamo provato a calcolare la somiglianza di tali dati utilizzando CosineSimilarity(7.x) del motore di ricerca Elasticsearch (ES), ma questo approccio presenta i seguenti svantaggi.</p>
<ul>
<li><p>Tempi di risposta lunghi: la latenza media per recuperare i risultati TopK da milioni di elementi è di circa 300 ms.</p></li>
<li><p>Elevati costi di manutenzione degli indici di ES: lo stesso set di indici viene utilizzato sia per i vettori di caratteristiche delle materie prime sia per altri dati correlati, il che non facilita affatto la costruzione degli indici, ma produce un'enorme quantità di dati.</p></li>
</ul>
<p>Abbiamo provato a sviluppare un nostro plug-in di hash localmente sensibile per accelerare il calcolo della somiglianza del coseno di ES. Sebbene le prestazioni e il throughput siano migliorati in modo significativo dopo l'accelerazione, la latenza di oltre 100 ms era ancora difficile da soddisfare per il reperimento dei prodotti online.</p>
<p>Dopo un'accurata ricerca, abbiamo deciso di utilizzare Milvus, un database vettoriale open source che, rispetto al comune Faiss standalone, ha il vantaggio di supportare la distribuzione distribuita, gli SDK multilingue, la separazione lettura/scrittura, ecc.</p>
<p>Utilizzando diversi modelli di deep learning, convertiamo dati massicci non strutturati in vettori di caratteristiche e importiamo i vettori in Milvus. Grazie alle eccellenti prestazioni di Milvus, il nostro sistema di raccomandazione per la ricerca di e-commerce può interrogare in modo efficiente i vettori TopK che sono simili ai vettori di destinazione.</p>
<h2 id="Overall-Architecture" class="common-anchor-header">Architettura complessiva<button data-href="#Overall-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Come mostrato nel diagramma, l'architettura generale del sistema è composta da due parti principali.</p>
<ul>
<li><p>Processo di scrittura: i vettori delle caratteristiche degli articoli (di seguito denominati vettori degli articoli) generati dal modello di apprendimento profondo vengono normalizzati e scritti in MySQL. MySQL legge quindi i vettori delle caratteristiche degli articoli elaborati utilizzando lo strumento di sincronizzazione dei dati (ETL) e li importa nel database vettoriale Milvus.</p></li>
<li><p>Processo di lettura: Il servizio di ricerca ottiene i vettori delle caratteristiche delle preferenze dell'utente (di seguito denominati vettori utente) in base alle parole chiave e ai ritratti dell'utente, interroga i vettori simili in Milvus e richiama i vettori degli articoli TopK.</p></li>
</ul>
<p>Milvus supporta sia l'aggiornamento incrementale dei dati che l'aggiornamento dell'intero database. Ogni aggiornamento incrementale deve cancellare il vettore di elementi esistente e inserire un nuovo vettore di elementi, il che significa che ogni collezione appena aggiornata sarà reindicizzata. Questa soluzione si adatta meglio allo scenario con più letture e meno scritture. Pertanto, scegliamo il metodo di aggiornamento dei dati completi. Inoltre, la scrittura di tutti i dati in batch di più partizioni richiede solo pochi minuti, il che equivale a un aggiornamento quasi in tempo reale.</p>
<p>I nodi di scrittura Milvus eseguono tutte le operazioni di scrittura, compresa la creazione di raccolte di dati, la costruzione di indici, l'inserimento di vettori, ecc. I nodi di lettura Milvus eseguono tutte le operazioni di lettura e forniscono servizi al pubblico con nomi di dominio di sola lettura.</p>
<p>Mentre la versione attuale di Milvus non supporta il cambio di alias di raccolta, noi introduciamo Redis per cambiare alias senza problemi tra più raccolte di dati intere.</p>
<p>Il nodo di lettura deve solo leggere le informazioni esistenti sui metadati e i dati vettoriali o gli indici da MySQL, Milvus e il file system distribuito GlusterFS, quindi la capacità di lettura può essere estesa orizzontalmente distribuendo più istanze.</p>
<h2 id="Implementation-Details" class="common-anchor-header">Dettagli di implementazione<button data-href="#Implementation-Details" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Data-Update" class="common-anchor-header">Aggiornamento dei dati</h3><p>Il servizio di aggiornamento dei dati comprende non solo la scrittura dei dati vettoriali, ma anche il rilevamento del volume dei dati dei vettori, la costruzione degli indici, il precaricamento degli indici, il controllo degli alias, ecc. Il processo complessivo è il seguente. <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_6052b01334.jpg" alt="Process" class="doc-image" id="process" /><span>Processo</span> </span></p>
<ol>
<li><p>Si supponga che prima di costruire i dati completi, CollectionA fornisca il servizio dati al pubblico e che i dati completi utilizzati siano diretti a CollectionA (<code translate="no">redis key1 = CollectionA</code>). Lo scopo della costruzione dei dati completi è quello di creare una nuova raccolta CollectionB.</p></li>
<li><p>Controllo dei dati delle materie prime - verifica il numero di articolo dei dati delle materie prime nella tabella MySQL, confronta i dati delle materie prime con i dati esistenti in CollectionA. L'avviso può essere impostato in base alla quantità o alla percentuale. Se la quantità (percentuale) impostata non viene raggiunta, l'intero dato non verrà costruito e verrà considerato come un fallimento di questa operazione di costruzione, facendo scattare l'avviso; una volta raggiunta la quantità (percentuale) impostata, il processo di costruzione dell'intero dato viene avviato.</p></li>
<li><p>Avviare la costruzione dell'intero dato - inizializzare l'alias dell'intero dato in costruzione e aggiornare Redis. Dopo l'aggiornamento, l'alias dell'intero dato in costruzione viene indirizzato a CollectionB (<code translate="no">redis key2 = CollectionB</code>).</p></li>
<li><p>Creare una nuova collezione intera - determinare se CollectionB esiste. Se esiste, eliminarla prima di crearne una nuova.</p></li>
<li><p>Scrittura in batch dei dati - calcolare l'ID della partizione di ciascun dato della commodity con il proprio ID utilizzando l'operazione modulo e scrivere i dati in più partizioni nella raccolta appena creata in batch.</p></li>
<li><p>Creare e precaricare l'indice - Creare l'indice (<code translate="no">createIndex()</code>) per la nuova raccolta. Il file dell'indice viene memorizzato nel server di archiviazione distribuito GlusterFS. Il sistema simula automaticamente una query sulla nuova raccolta e precarica l'indice per il riscaldamento della query.</p></li>
<li><p>Controllo dei dati della raccolta: controlla il numero di elementi dei dati nella nuova raccolta, confronta i dati con la raccolta esistente e imposta gli allarmi in base alla quantità e alla percentuale. Se il numero (percentuale) impostato non viene raggiunto, la raccolta non verrà commutata e il processo di costruzione verrà considerato un fallimento, attivando l'allarme.</p></li>
<li><p>Commutazione della raccolta - Controllo dell'alias. Dopo l'aggiornamento di Redis, l'intero alias dei dati utilizzati viene indirizzato a CollectionB (<code translate="no">redis key1 = CollectionB</code>), la chiave Redis originale2 viene cancellata e il processo di costruzione è completato.</p></li>
</ol>
<h3 id="Data-Recall" class="common-anchor-header">Richiamo dei dati</h3><p>I dati della partizione Milvus vengono richiamati più volte per calcolare la somiglianza tra i vettori utente, ottenuti in base alle parole chiave della query dell'utente e al ritratto dell'utente, e i vettori articolo TopK, che vengono restituiti dopo la fusione. Il flusso di lavoro complessivo è il seguente: <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_93518602b1.jpg" alt="workflow" class="doc-image" id="workflow" /><span>flusso di lavoro</span>La </span>tabella seguente elenca i principali servizi coinvolti in questo processo. Si può notare che la latenza media per il richiamo dei vettori TopK è di circa 30 ms.</p>
<table>
<thead>
<tr><th><strong>Servizio</strong></th><th><strong>Ruolo</strong></th><th><strong>Parametri di ingresso</strong></th><th><strong>Parametri di uscita</strong></th><th><strong>Latenza di risposta</strong></th></tr>
</thead>
<tbody>
<tr><td>Acquisizione vettori utente</td><td>Ottenere il vettore utente</td><td>info utente + interrogazione</td><td>vettore utente</td><td>10 ms</td></tr>
<tr><td>Ricerca Milvus</td><td>Calcola la somiglianza del vettore e restituisce i risultati TopK</td><td>vettore utente</td><td>vettore elemento</td><td>10 ms</td></tr>
<tr><td>Logica di programmazione</td><td>Richiamo e fusione simultanea dei risultati</td><td>Vettori di elementi richiamati da più canali e punteggio di somiglianza</td><td>Elementi TopK</td><td>10 ms</td></tr>
</tbody>
</table>
<p><strong>Processo di implementazione:</strong></p>
<ol>
<li>In base alle parole chiave della query dell'utente e al ritratto dell'utente, il vettore utente viene calcolato dal modello di deep learning.</li>
<li>Ottenere l'alias della raccolta di tutti i dati utilizzati da Redis currentInUseKeyRef e ottenere Milvus CollectionName. Questo processo è un servizio di sincronizzazione dei dati, ossia il passaggio dell'alias a Redis dopo l'aggiornamento di tutti i dati.</li>
<li>Milvus viene chiamato in modo simultaneo e asincrono con il vettore utente per ottenere i dati da diverse partizioni della stessa collezione; Milvus calcola la somiglianza tra il vettore utente e il vettore elemento e restituisce i TopK vettori elemento simili in ogni partizione.</li>
<li>Unisce i TopK item vectors restituiti da ogni partizione e classifica i risultati in ordine inverso rispetto alla distanza di somiglianza, che viene calcolata utilizzando il prodotto interno IP (maggiore è la distanza tra i vettori, più sono simili). Vengono restituiti i vettori di elementi TopK finali.</li>
</ol>
<h2 id="Looking-Ahead" class="common-anchor-header">Guardare avanti<button data-href="#Looking-Ahead" class="anchor-icon" translate="no">
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
    </button></h2><p>Attualmente, la ricerca vettoriale basata su Milvus può essere utilizzata stabilmente nella ricerca di scenari di raccomandazione, e le sue elevate prestazioni ci danno più spazio per giocare sulla dimensionalità del modello e sulla selezione dell'algoritmo.</p>
<p>Milvus svolgerà un ruolo cruciale come middleware per un numero maggiore di scenari, tra cui il richiamo della ricerca del sito principale e le raccomandazioni per tutti gli scenari.</p>
<p>Le tre caratteristiche più attese di Milvus in futuro sono le seguenti.</p>
<ul>
<li>Logica per la commutazione degli alias delle collezioni: coordinare la commutazione tra le collezioni senza componenti esterni.</li>
<li>Meccanismo di filtraggio - Milvus v0.11.0 supporta solo il meccanismo di filtraggio ES DSL nella versione standalone. La nuova versione di Milvus 2.0 supporta il filtraggio scalare e la separazione lettura/scrittura.</li>
<li>Supporto dello storage per Hadoop Distributed File System (HDFS) - Milvus v0.10.6 supporta solo l'interfaccia file POSIX e abbiamo implementato GlusterFS con supporto FUSE come backend di storage. Tuttavia, HDFS è una scelta migliore in termini di prestazioni e facilità di scalabilità.</li>
</ul>
<h2 id="Lessons-Learned-and-Best-Practices" class="common-anchor-header">Lezioni apprese e buone pratiche<button data-href="#Lessons-Learned-and-Best-Practices" class="anchor-icon" translate="no">
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
<li>Per le applicazioni in cui le operazioni di lettura sono l'obiettivo principale, un'implementazione di separazione lettura-scrittura può aumentare significativamente la potenza di elaborazione e migliorare le prestazioni.</li>
<li>Il client Milvus Java non dispone di un meccanismo di riconnessione perché il client Milvus utilizzato dal servizio di richiamo è residente in memoria. Dobbiamo costruire il nostro pool di connessioni per garantire la disponibilità della connessione tra il client Java e il server attraverso il test heartbeat.</li>
<li>Occasionalmente si verificano query lente su Milvus. Ciò è dovuto a un riscaldamento insufficiente della nuova collezione. Simulando la query sulla nuova collezione, il file dell'indice viene caricato in memoria per ottenere il riscaldamento dell'indice.</li>
<li>nlist è il parametro di costruzione dell'indice e nprobe è il parametro della query. È necessario ottenere un valore di soglia ragionevole in base allo scenario aziendale attraverso esperimenti di pressure test per bilanciare le prestazioni di recupero e l'accuratezza.</li>
<li>Per uno scenario di dati statici, è più efficiente importare prima tutti i dati nella raccolta e costruire gli indici in un secondo momento.</li>
</ol>
