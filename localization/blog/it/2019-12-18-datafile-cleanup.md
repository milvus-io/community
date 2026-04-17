---
id: 2019-12-18-datafile-cleanup.md
title: Strategia di cancellazione precedente e problemi correlati
author: Yihua Mo
date: 2019-12-18T00:00:00.000Z
desc: >-
  Abbiamo migliorato la strategia di eliminazione dei file per risolvere i
  problemi legati alle operazioni di query.
cover: null
tag: Engineering
---
<custom-h1>Miglioramenti al meccanismo di pulizia dei file di dati</custom-h1><blockquote>
<p>autore: Yihua Mo</p>
<p>Data: 2019-12-18</p>
</blockquote>
<h2 id="Previous-delete-strategy-and-related-problems" class="common-anchor-header">Strategia di cancellazione precedente e problemi correlati<button data-href="#Previous-delete-strategy-and-related-problems" class="anchor-icon" translate="no">
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
    </button></h2><p>In <a href="/blog/it/2019-11-08-data-management.md">Gestione dei dati nel motore di ricerca vettoriale su larga scala</a>, abbiamo menzionato il meccanismo di cancellazione dei file di dati. L'eliminazione comprende l'eliminazione morbida e l'eliminazione dura. Dopo aver eseguito un'operazione di cancellazione su una tabella, la tabella viene contrassegnata come soft-delete. Le operazioni di ricerca o aggiornamento successive non sono più consentite. Tuttavia, l'operazione di query iniziata prima dell'eliminazione può ancora essere eseguita. La tabella viene realmente eliminata insieme ai metadati e agli altri file solo al termine dell'operazione di query.</p>
<p>Quindi, quando i file contrassegnati con soft-delete vengono realmente eliminati? Prima della versione 0.6.0, la strategia prevede che un file venga realmente eliminato dopo una cancellazione morbida di 5 minuti. La figura seguente mostra la strategia:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/datafile_clean/5mins.png" alt="5mins" class="doc-image" id="5mins" />
   </span> <span class="img-wrapper"> <span>5minuti</span> </span></p>
<p>Questa strategia si basa sulla premessa che le query normalmente non durano più di 5 minuti e non è affidabile. Se una query dura più di 5 minuti, la query fallisce. Il motivo è che quando si avvia una query, Milvus raccoglie informazioni sui file che possono essere cercati e crea attività di query. Quindi, lo scheduler delle query carica i file in memoria uno per uno e cerca i file uno per uno. Se un file non esiste più al momento del caricamento, la query fallisce.</p>
<p>L'allungamento dei tempi può contribuire a ridurre il rischio di fallimento delle query, ma causa anche un altro problema: l'utilizzo del disco è eccessivo. Il motivo è che quando si inseriscono grandi quantità di vettori, Milvus combina continuamente i file di dati e i file combinati non vengono immediatamente rimossi dal disco, anche se non viene eseguita alcuna query. Se l'inserimento dei dati è troppo veloce e/o la quantità di dati inseriti è eccessiva, l'utilizzo extra del disco può raggiungere decine di GB. Si veda la figura seguente come esempio:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/datafile_clean/5min_result.png" alt="result" class="doc-image" id="result" />
   </span> <span class="img-wrapper"> <span>risultato</span> </span></p>
<p>Come mostrato nella figura precedente, il primo lotto di dati inseriti (insert_1) viene scaricato su disco e diventa file_1, quindi insert_2 diventa file_2. Il thread responsabile della combinazione dei file unisce i file in file_3. Quindi, file_1 e file_2 vengono contrassegnati come soft-delete. Il terzo gruppo di dati di inserimento diventa file_4. Il thread combina file_3 e file_4 in file_5 e contrassegna file_3 e file_4 come soft-delete.</p>
<p>Allo stesso modo, vengono combinati i file insert_6 e insert_5. In t3, il file_5 e il file_6 sono contrassegnati come eliminazione morbida. Tra t3 e t4, anche se molti file sono contrassegnati come eliminazione morbida, sono ancora presenti nel disco. I file vengono realmente eliminati dopo t4. Pertanto, tra t3 e t4, l'utilizzo del disco è di 64 + 64 + 128 + 64 + 196 + 64 + 256 = 836 MB. I dati inseriti sono 64 + 64 + 64 + 64 = 256 MB. L'utilizzo del disco è pari a 3 volte la dimensione dei dati inseriti. Maggiore è la velocità di scrittura del disco, maggiore è l'utilizzo del disco in un determinato periodo di tempo.</p>
<h2 id="Improvements-of-the-delete-strategy-in-060" class="common-anchor-header">Miglioramenti della strategia di cancellazione in 0.6.0<button data-href="#Improvements-of-the-delete-strategy-in-060" class="anchor-icon" translate="no">
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
    </button></h2><p>Nella versione 0.6.0 abbiamo cambiato la strategia di eliminazione dei file. L'hard-delete non utilizza più il tempo come trigger. Invece, il trigger è quando il file non è utilizzato da nessun task.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/datafile_clean/new_strategy.png" alt="newstrategy" class="doc-image" id="newstrategy" />
   </span> <span class="img-wrapper"> <span>nuova strategia</span> </span></p>
<p>Si supponga che vengano inseriti due lotti di vettori. In t1 viene fornita una richiesta di interrogazione, Milvus acquisisce due file da interrogare (file_1 e file_2, perché file_3 non esiste ancora), quindi il thread del backend inizia a combinare i due file con la query in esecuzione contemporaneamente. Quando viene generato il file_3, il file_1 e il file_2 vengono contrassegnati come soft-delete. Dopo la query, nessun altro task utilizzerà file_1 e file_2, quindi saranno eliminati in t4. L'intervallo tra t2 e t4 è molto piccolo e dipende dall'intervallo della query. In questo modo, i file inutilizzati saranno rimossi in tempo.</p>
<p>Per quanto riguarda l'implementazione interna, il conteggio dei riferimenti, familiare agli ingegneri informatici, viene utilizzato per determinare se un file può essere eliminato. Per spiegarlo con un paragone, quando un giocatore ha delle vite in un gioco, può ancora giocare. Quando il numero di vite diventa 0, la partita è finita. Milvus controlla lo stato di ogni file. Quando un file viene utilizzato da un'attività, gli viene aggiunta una vita. Quando il file non viene più utilizzato, una vita viene rimossa dal file. Quando un file è contrassegnato come soft-delete e il numero di vite è 0, il file è pronto per essere eliminato.</p>
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
<li><a href="/blog/it/2019-11-08-data-management.md">Gestione dei dati in un motore di ricerca vettoriale su larga scala</a></li>
<li><a href="https://milvus.io/blog/managing-metadata-in-milvus-1.md">Gestione dei metadati Milvus (1): Come visualizzare i metadati</a></li>
<li><a href="/blog/it/2019-12-27-meta-table.md">Gestione dei metadati Milvus (2): Campi nella tabella dei metadati</a></li>
</ul>
