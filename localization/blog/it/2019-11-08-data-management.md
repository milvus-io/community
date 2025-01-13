---
id: 2019-11-08-data-management.md
title: Come avviene la gestione dei dati in Milvus
author: Yihua Mo
date: 2019-11-08T00:00:00.000Z
desc: Questo post introduce la strategia di gestione dei dati in Milvus.
cover: null
tag: Engineering
origin: null
---
<custom-h1>Gestione dei dati in un motore di ricerca vettoriale su larga scala</custom-h1><blockquote>
<p>Autore: Yihua Mo</p>
<p>Data: 2019-11-08</p>
</blockquote>
<h2 id="How-data-management-is-done-in-Milvus" class="common-anchor-header">Come avviene la gestione dei dati in Milvus<button data-href="#How-data-management-is-done-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Prima di tutto, alcuni concetti di base di Milvus:</p>
<ul>
<li>Tabella: La tabella è un insieme di dati di vettori, con ogni vettore dotato di un ID univoco. Ogni vettore e il suo ID rappresentano una riga della tabella. Tutti i vettori di una tabella devono avere le stesse dimensioni. Di seguito è riportato un esempio di tabella con vettori a 10 dimensioni:</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/table.png" alt="table" class="doc-image" id="table" />
   </span> <span class="img-wrapper"> <span>tabella</span> </span></p>
<ul>
<li>Indice: La creazione di un indice è il processo di raggruppamento dei vettori mediante un determinato algoritmo, che richiede spazio aggiuntivo su disco. Alcuni tipi di indice richiedono meno spazio perché semplificano e comprimono i vettori, mentre altri tipi richiedono più spazio dei vettori grezzi.</li>
</ul>
<p>In Milvus gli utenti possono eseguire operazioni come la creazione di una tabella, l'inserimento di vettori, la costruzione di indici, la ricerca di vettori, il recupero di informazioni sulla tabella, l'eliminazione di tabelle, la rimozione di dati parziali in una tabella e la rimozione di indici, ecc.</p>
<p>Supponiamo di avere 100 milioni di vettori a 512 dimensioni e di doverli inserire e gestire in Milvus per una ricerca vettoriale efficiente.</p>
<p><strong>(1) Inserimento di vettori</strong></p>
<p>Vediamo come vengono inseriti i vettori in Milvus.</p>
<p>Poiché ogni vettore occupa 2 KB di spazio, lo spazio minimo di archiviazione per 100 milioni di vettori è di circa 200 GB, il che rende irrealistico l'inserimento di tutti i vettori in una sola volta. È necessario disporre di più file di dati invece di uno. Le prestazioni di inserimento sono uno degli indicatori chiave delle prestazioni. Milvus supporta l'inserimento una tantum di centinaia o addirittura decine di migliaia di vettori. Ad esempio, l'inserimento una tantum di 30 mila vettori a 512 dimensioni richiede generalmente solo 1 secondo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/insert.png" alt="insert" class="doc-image" id="insert" />
   </span> <span class="img-wrapper"> <span>inserire</span> </span></p>
<p>Non tutti gli inserimenti di vettori vengono caricati su disco. Milvus riserva un buffer mutabile nella memoria della CPU per ogni tabella creata, dove i dati inseriti possono essere scritti rapidamente. Quando i dati nel buffer mutabile raggiungono una certa dimensione, questo spazio viene etichettato come immutabile. Nel frattempo, viene riservato un nuovo buffer mutabile. I dati nel buffer immutabile vengono scritti regolarmente sul disco e la corrispondente memoria della CPU viene liberata. Il meccanismo di scrittura regolare su disco è simile a quello utilizzato in Elasticsearch, che scrive i dati del buffer su disco ogni 1 secondo. Inoltre, gli utenti che hanno familiarità con LevelDB/RocksDB possono notare una certa somiglianza con MemTable.</p>
<p>Gli obiettivi del meccanismo di inserimento dei dati sono</p>
<ul>
<li>L'inserimento dei dati deve essere efficiente.</li>
<li>I dati inseriti possono essere utilizzati immediatamente.</li>
<li>I file di dati non devono essere troppo frammentati.</li>
</ul>
<p><strong>(2) File di dati grezzi</strong></p>
<p>Quando i vettori vengono scritti su disco, vengono salvati in un file di dati grezzi contenente i vettori grezzi. Come già detto, i vettori su larga scala devono essere salvati e gestiti in più file di dati. Le dimensioni dei dati inseriti variano: gli utenti possono inserire 10 vettori o 1 milione di vettori alla volta. Tuttavia, l'operazione di scrittura su disco viene eseguita una volta ogni 1 secondo. Pertanto, vengono generati file di dati di dimensioni diverse.</p>
<p>I file di dati frammentati non sono né comodi da gestire né facilmente accessibili per la ricerca vettoriale. Milvus unisce costantemente questi piccoli file di dati finché la dimensione del file unito non raggiunge una determinata dimensione, ad esempio 1 GB. Questa dimensione particolare può essere configurata nel parametro API <code translate="no">index_file_size</code> durante la creazione della tabella. Pertanto, 100 milioni di vettori a 512 dimensioni saranno distribuiti e salvati in circa 200 file di dati.</p>
<p>In considerazione degli scenari di calcolo incrementale, in cui i vettori vengono inseriti e cercati simultaneamente, dobbiamo assicurarci che i vettori, una volta scritti su disco, siano disponibili per la ricerca. Pertanto, prima che i piccoli file di dati vengano uniti, è possibile accedervi e cercarli. Una volta completata la fusione, i file di dati di piccole dimensioni verranno rimossi e i file appena uniti verranno utilizzati per la ricerca.</p>
<p>Ecco come appaiono i file interrogati prima della fusione:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/rawdata1.png" alt="rawdata1" class="doc-image" id="rawdata1" />
   </span> <span class="img-wrapper"> <span>rawdata1</span> </span></p>
<p>File interrogati dopo la fusione:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/rawdata2.png" alt="rawdata2" class="doc-image" id="rawdata2" />
   </span> <span class="img-wrapper"> <span>rawdata2</span> </span></p>
<p><strong>(3) File indice</strong></p>
<p>La ricerca basata sul file di dati grezzi è una ricerca brutale che confronta le distanze tra i vettori di interrogazione e i vettori di origine e calcola i k vettori più vicini. La ricerca a forza bruta è inefficiente. L'efficienza della ricerca può essere notevolmente aumentata se la ricerca si basa su un file indice in cui i vettori sono indicizzati. La creazione dell'indice richiede spazio aggiuntivo su disco e di solito richiede molto tempo.</p>
<p>Quali sono le differenze tra i file di dati grezzi e i file indice? In parole povere, il file di dati grezzi registra ogni singolo vettore insieme al suo ID univoco, mentre il file di indice registra i risultati del raggruppamento dei vettori, come il tipo di indice, i centroidi dei cluster e i vettori in ciascun cluster.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/indexfile.png" alt="indexfile" class="doc-image" id="indexfile" />
   </span> <span class="img-wrapper"> <span>file indice</span> </span></p>
<p>In generale, il File indice contiene più informazioni del File dati grezzi, ma le dimensioni del file sono molto più ridotte perché i vettori vengono semplificati e quantizzati durante il processo di costruzione dell'indice (per alcuni tipi di indice).</p>
<p>Per impostazione predefinita, le tabelle appena create vengono ricercate mediante calcolo bruto. Una volta creato l'indice nel sistema, Milvus costruisce automaticamente l'indice per i file uniti che raggiungono la dimensione di 1 GB in un thread autonomo. Al termine della creazione dell'indice, viene generato un nuovo file di indice. I file di dati grezzi saranno archiviati per la creazione di indici basati su altri tipi di indici.</p>
<p>Milvus costruisce automaticamente l'indice per i file che raggiungono 1 GB:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/buildindex.png" alt="buildindex" class="doc-image" id="buildindex" />
   </span> <span class="img-wrapper"> <span>buildindex</span> </span></p>
<p>Costruzione dell'indice completata:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/indexcomplete.png" alt="indexcomplete" class="doc-image" id="indexcomplete" />
   </span> <span class="img-wrapper"> <span>indexcomplete</span> </span></p>
<p>L'indice non viene costruito automaticamente per i file di dati grezzi che non raggiungono 1 GB, il che può rallentare la velocità di ricerca. Per evitare questa situazione, è necessario forzare manualmente la costruzione dell'indice per questa tabella.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/forcebuild.png" alt="forcebuild" class="doc-image" id="forcebuild" />
   </span> <span class="img-wrapper"> <span>forcebuild</span> </span></p>
<p>Dopo aver forzato la creazione dell'indice per il file, le prestazioni della ricerca sono notevolmente migliorate.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/indexfinal.png" alt="indexfinal" class="doc-image" id="indexfinal" />
   </span> <span class="img-wrapper"> <span>indicefinale</span> </span></p>
<p><strong>(4) Meta dati</strong></p>
<p>Come già detto, 100 milioni di vettori a 512 dimensioni sono salvati in 200 file su disco. Quando si costruisce l'indice per questi vettori, ci sono altri 200 file di indice, il che porta il numero totale di file a 400 (compresi i file del disco e i file di indice). È necessario un meccanismo efficiente per gestire i meta-dati (stati dei file e altre informazioni) di questi file, al fine di verificarne lo stato, rimuovere o creare file.</p>
<p>L'uso di database OLTP per gestire queste informazioni è una buona scelta. Milvus standalone utilizza SQLite per gestire i metadati, mentre nella distribuzione distribuita utilizza MySQL. All'avvio del server Milvus, vengono create 2 tabelle (ovvero 'Tables' e 'TableFiles') rispettivamente in SQLite/MySQL. 'Tables' registra le informazioni sulle tabelle e 'TableFiles' registra le informazioni sui file di dati e sui file di indice.</p>
<p>Come illustrato nel diagramma di flusso seguente, 'Tables' contiene informazioni sui metadati come il nome della tabella (table_id), la dimensione del vettore (dimension), la data di creazione della tabella (created_on), lo stato della tabella (state), il tipo di indice (engine_type), il numero di cluster del vettore (nlist) e il metodo di calcolo della distanza (metric_type).</p>
<p>TableFiles" contiene il nome della tabella a cui appartiene il file (table_id), il tipo di indice del file (engine_type), il nome del file (file_id), il tipo di file (file_type), la dimensione del file (file_size), il numero di righe (row_count) e la data di creazione del file (created_on).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/Metadata.png" alt="metadata" class="doc-image" id="metadata" />
   </span> <span class="img-wrapper"> <span>metadati</span> </span></p>
<p>Con questi metadati è possibile eseguire diverse operazioni. Di seguito sono riportati alcuni esempi:</p>
<ul>
<li>Per creare una tabella, Meta Manager deve solo eseguire un'istruzione SQL: <code translate="no">INSERT INTO TABLES VALUES(1, 'table_2, 512, xxx, xxx, ...)</code>.</li>
<li>Per eseguire una ricerca vettoriale sulla tabella_2, Meta Manager esegue una query in SQLite/MySQL, che è di fatto un'istruzione SQL: <code translate="no">SELECT * FROM TableFiles WHERE table_id='table_2'</code> per recuperare le informazioni sui file della tabella_2. Questi file verranno poi caricati in memoria da Query Scheduler per il calcolo della ricerca.</li>
<li>Non è possibile eliminare istantaneamente una tabella perché potrebbero essere eseguite delle query su di essa. Per questo motivo, per una tabella esistono le modalità di cancellazione morbida e di cancellazione rigida. Quando si elimina una tabella, questa viene etichettata come "soft-delete" e non è possibile eseguire ulteriori query o modifiche. Tuttavia, le query in esecuzione prima dell'eliminazione continuano ad essere eseguite. Solo quando tutte le query precedenti all'eliminazione sono state completate, la tabella, insieme ai suoi metadati e ai file correlati, sarà definitivamente eliminata.</li>
</ul>
<p><strong>(5) Pianificazione delle query</strong></p>
<p>Il grafico seguente mostra il processo di ricerca vettoriale sia nella CPU che nella GPU, interrogando i file (file di dati grezzi e file di indice) che vengono copiati e salvati su disco, nella memoria della CPU e nella memoria della GPU per i vettori topk più simili.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/topkresult.png" alt="topkresult" class="doc-image" id="topkresult" />
   </span> <span class="img-wrapper"> <span>risultato topk</span> </span></p>
<p>L'algoritmo di pianificazione delle query migliora significativamente le prestazioni del sistema. La filosofia di base del progetto è quella di ottenere le migliori prestazioni di ricerca attraverso il massimo utilizzo delle risorse hardware. Di seguito è riportata solo una breve descrizione del query scheduler; in futuro sarà dedicato un articolo a questo argomento.</p>
<p>La prima query su una determinata tabella è chiamata query "fredda", mentre le query successive sono chiamate query "calde". Quando si esegue la prima query su una determinata tabella, Milvus esegue un notevole lavoro per caricare i dati nella memoria della CPU e alcuni dati nella memoria della GPU, il che richiede molto tempo. Nelle interrogazioni successive, la ricerca è molto più veloce perché una parte o tutti i dati sono già nella memoria della CPU, risparmiando il tempo di lettura dal disco.</p>
<p>Per ridurre il tempo di ricerca della prima query, Milvus offre la configurazione Preload Table (<code translate="no">preload_table</code>) che consente il precaricamento automatico delle tabelle nella memoria della CPU all'avvio del server. Per una tabella contenente 100 milioni di vettori a 512 dimensioni, pari a 200 GB, la velocità di ricerca è massima se la memoria della CPU è sufficiente per memorizzare tutti questi dati. Tuttavia, se la tabella contiene vettori di miliardi di dimensioni, a volte è inevitabile liberare la memoria della CPU/GPU per aggiungere nuovi dati che non vengono interrogati. Attualmente, utilizziamo la strategia di sostituzione dei dati LRU (Latest Recently Used).</p>
<p>Come mostrato nel grafico seguente, si supponga che una tabella abbia 6 file di indice memorizzati sul disco. La memoria della CPU può memorizzare solo 3 file di indice e la memoria della GPU solo 1 file di indice.</p>
<p>All'avvio della ricerca, 3 file di indice vengono caricati nella memoria della CPU per l'interrogazione. Il primo file viene rilasciato dalla memoria della CPU subito dopo l'interrogazione. Nel frattempo, il quarto file viene caricato nella memoria della CPU. Allo stesso modo, quando un file viene interrogato nella memoria della GPU, viene immediatamente rilasciato e sostituito con un nuovo file.</p>
<p>Lo schedulatore di query gestisce principalmente due serie di code di attività: una coda riguarda il caricamento dei dati e l'altra l'esecuzione della ricerca.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/queryschedule.png" alt="queryschedule" class="doc-image" id="queryschedule" />
   </span> <span class="img-wrapper"> <span>queryschedule</span> </span></p>
<p><strong>(6) Riduttore di risultati</strong></p>
<p>Ci sono due parametri chiave relativi alla ricerca vettoriale: uno è 'n', che indica il numero n di vettori di destinazione; un altro è 'k', che indica i primi k vettori più simili. I risultati della ricerca sono in realtà n insiemi di KVP (coppie chiave-valore), ognuno dei quali ha k coppie chiave-valore. Poiché le query devono essere eseguite su ogni singolo file, indipendentemente dal fatto che si tratti di un file di dati grezzi o di un file di indice, per ogni file vengono recuperati n insiemi di risultati top-k. Tutti questi insiemi di risultati vengono uniti per ottenere gli insiemi di risultati top-k della tabella.</p>
<p>L'esempio seguente mostra come vengono uniti e ridotti i set di risultati per la ricerca vettoriale su una tabella con 4 file di indice (n=2, k=3). Si noti che ogni set di risultati ha 2 colonne. La colonna di sinistra rappresenta l'id del vettore e quella di destra la distanza euclidea.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/resultreduce.png" alt="result" class="doc-image" id="result" />
   </span> <span class="img-wrapper"> <span>risultato</span> </span></p>
<p><strong>(7) Ottimizzazione futura</strong></p>
<p>Di seguito sono riportate alcune riflessioni su possibili ottimizzazioni della gestione dei dati.</p>
<ul>
<li>Cosa succederebbe se i dati contenuti nel buffer immutabile o anche nel buffer mutabile potessero essere interrogati istantaneamente? Attualmente, i dati nel buffer immutabile non possono essere interrogati, finché non vengono scritti su disco. Alcuni utenti sono più interessati all'accesso istantaneo ai dati dopo l'inserimento.</li>
<li>Fornire una funzionalità di partizionamento delle tabelle che consenta all'utente di dividere tabelle molto grandi in partizioni più piccole e di eseguire ricerche vettoriali su una determinata partizione.</li>
<li>Aggiungere ai vettori alcuni attributi che possono essere filtrati. Ad esempio, alcuni utenti vogliono cercare solo tra i vettori con determinati attributi. È necessario recuperare gli attributi dei vettori e anche i vettori grezzi. Un possibile approccio è quello di utilizzare un database KV come RocksDB.</li>
<li>Fornire una funzionalità di migrazione dei dati che consenta la migrazione automatica dei dati obsoleti su un altro spazio di archiviazione. In alcuni scenari in cui i dati affluiscono in continuazione, i dati potrebbero invecchiare. Poiché alcuni utenti si preoccupano ed eseguono ricerche solo sui dati del mese più recente, i dati più vecchi diventano meno utili e consumano molto spazio su disco. Un meccanismo di migrazione dei dati aiuta a liberare spazio su disco per i nuovi dati.</li>
</ul>
<h2 id="Summary" class="common-anchor-header">Sintesi<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Questo articolo introduce principalmente la strategia di gestione dei dati in Milvus. Prossimamente verranno pubblicati altri articoli sulla distribuzione distribuita di Milvus, sulla scelta dei metodi di indicizzazione vettoriale e sullo scheduler delle query. Restate sintonizzati!</p>
<h2 id="Related-blogs" class="common-anchor-header">Blog correlati<button data-href="#Related-blogs" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-1-6b9e05c06fb0">Gestione dei metadati in Milvus (1): Come visualizzare i metadati</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-2-fields-in-the-metadata-table-3bf0d296ca6d">Gestione dei metadati Milvus (2): Campi nella tabella dei metadati</a></li>
</ul>
