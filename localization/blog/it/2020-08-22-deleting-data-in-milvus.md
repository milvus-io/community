---
id: deleting-data-in-milvus.md
title: Conclusione
author: milvus
date: 2020-08-22T20:27:23.266Z
desc: >-
  Nella versione 0.7.0 di Milvus abbiamo ideato un nuovo design per rendere più
  efficiente la cancellazione e supportare un maggior numero di tipi di indici.
cover: assets.zilliz.com/header_c9b45e546c.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/deleting-data-in-milvus'
---
<custom-h1>Come Milvus realizza la funzione Elimina</custom-h1><p>Questo articolo tratta di come Milvus implementa la funzione di cancellazione. La funzione di cancellazione è stata introdotta in Milvus v0.7.0, una funzione molto attesa da molti utenti. Non abbiamo chiamato direttamente remove_ids in FAISS, ma abbiamo ideato un nuovo design per rendere la cancellazione più efficiente e supportare più tipi di indici.</p>
<p>In <a href="https://medium.com/unstructured-data-service/how-milvus-implements-dynamic-data-update-and-query-d15e04a85e7d?source=friends_link&amp;sk=cc38bee61bc194f30324ed17e86886f3">Come Milvus realizza l'aggiornamento e l'interrogazione dinamica dei dati</a>, abbiamo introdotto l'intero processo, dall'inserimento dei dati all'eliminazione dei dati. Riassumiamo alcune nozioni di base. MemManager gestisce tutti i buffer di inserimento, con ogni MemTable corrispondente a una collezione (abbiamo rinominato "tabella" in "collezione" in Milvus v0.7.0). Milvus divide automaticamente i dati inseriti nella memoria in più MemTableFiles. Quando i dati vengono scaricati sul disco, ogni MemTableFile viene serializzato in un file grezzo. Abbiamo mantenuto questa architettura quando abbiamo progettato la funzione di cancellazione.</p>
<p>La funzione del metodo delete consiste nell'eliminare tutti i dati corrispondenti agli ID entità specificati in una raccolta specifica. Nello sviluppo di questa funzione, abbiamo progettato due scenari. Il primo consiste nell'eliminare i dati ancora presenti nel buffer di inserimento e il secondo nell'eliminare i dati che sono stati scaricati sul disco. Il primo scenario è più intuitivo. Possiamo trovare il MemTableFile corrispondente all'ID specificato e cancellare direttamente i dati in memoria (Figura 1). Poiché l'eliminazione e l'inserimento dei dati non possono essere eseguiti contemporaneamente e a causa del meccanismo che cambia il MemTableFile da mutabile a immutabile quando si effettua il flush dei dati, l'eliminazione viene eseguita solo nel buffer mutabile. In questo modo, l'operazione di cancellazione non si scontra con il flussaggio dei dati, garantendo così la consistenza dei dati.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_delete_request_milvus_fa1e7941da.jpg" alt="1-delete-request-milvus.jpg" class="doc-image" id="1-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>1-delete-request-milvus.jpg</span> </span></p>
<p>Il secondo scenario è più complesso ma più comune, poiché nella maggior parte dei casi i dati rimangono brevemente nel buffer di inserimento prima di essere scaricati sul disco. Dato che è così inefficiente caricare in memoria i dati scaricati per una cancellazione dura, abbiamo deciso di optare per una cancellazione morbida, un approccio più efficiente. Invece di cancellare effettivamente i dati scaricati, la cancellazione morbida salva gli ID eliminati in un file separato. In questo modo, possiamo filtrare gli ID cancellati durante le operazioni di lettura, come la ricerca.</p>
<p>Per quanto riguarda l'implementazione, ci sono diversi problemi da considerare. In Milvus, i dati sono visibili o, in altre parole, recuperabili, solo quando vengono scaricati sul disco. Pertanto, i dati scaricati non vengono eliminati durante la chiamata al metodo delete, ma nella successiva operazione di flush. Il motivo è che i file di dati che sono stati scaricati sul disco non includono più nuovi dati, quindi l'eliminazione morbida non influisce sui dati che sono stati scaricati. Quando si chiama la funzione di cancellazione, è possibile cancellare direttamente i dati che si trovano ancora nel buffer di inserimento, mentre per i dati eliminati è necessario registrare l'ID dei dati eliminati nella memoria. Quando si scaricano i dati sul disco, Milvus scrive l'ID cancellato nel file DEL per registrare l'entità cancellata nel segmento corrispondente. Questi aggiornamenti saranno visibili solo al termine del flussaggio dei dati. Questo processo è illustrato nella Figura 2. Prima della versione 0.7.0, esisteva solo un meccanismo di auto-flush, ovvero Milvus serializzava i dati nel buffer di inserimento ogni secondo. Nel nostro nuovo progetto, abbiamo aggiunto un metodo di flush che consente agli sviluppatori di chiamare dopo il metodo di cancellazione, assicurando che i nuovi dati inseriti siano visibili e che i dati cancellati non siano più recuperabili.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_delete_request_milvus_c7fc97ef07.jpg" alt="2-delete-request-milvus.jpg" class="doc-image" id="2-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>2-delete-request-milvus.jpg</span> </span></p>
<p>Il secondo problema è che il file di dati grezzi e il file di indice sono due file separati in Milvus e due record indipendenti nei metadati. Quando si cancella un ID specifico, è necessario trovare il file grezzo e il file di indice corrispondenti all'ID e registrarli insieme. Di conseguenza, abbiamo introdotto il concetto di segmento. Un segmento contiene il file grezzo (che comprende i file vettoriali grezzi e i file ID), il file indice e il file DEL. Il segmento è l'unità di base per la lettura, la scrittura e la ricerca di vettori in Milvus. Una collezione (Figura 3) è composta da più segmenti. Pertanto, sotto una cartella di raccolta nel disco ci sono più cartelle di segmenti. Poiché i nostri metadati si basano su database relazionali (SQLite o MySQL), è molto semplice registrare le relazioni all'interno di un segmento e l'operazione di cancellazione non richiede più un'elaborazione separata del file grezzo e del file indice.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_delete_request_milvus_ee40340279.jpg" alt="3-delete-request-milvus.jpg" class="doc-image" id="3-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>3-Richiesta di cancellazione-milvus.jpg</span> </span></p>
<p>Il terzo problema è come filtrare i dati cancellati durante la ricerca. In pratica, l'ID registrato da DEL è l'offset dei dati corrispondenti memorizzati nel segmento. Dal momento che il segmento eliminato non include nuovi dati, l'offset non cambia. La struttura dei dati di DEL è una mappa di bit nella memoria, dove un bit attivo rappresenta un offset cancellato. Abbiamo aggiornato anche FAISS di conseguenza: quando si effettua una ricerca in FAISS, il vettore corrispondente al bit attivo non sarà più incluso nel calcolo della distanza (Figura 4). Le modifiche apportate a FAISS non saranno trattate in dettaglio in questa sede.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_delete_request_milvus_f5a29e25df.jpg" alt="4-delete-request-milvus.jpg" class="doc-image" id="4-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>4-delete-request-milvus.jpg</span> </span></p>
<p>L'ultima questione riguarda il miglioramento delle prestazioni. Quando si cancellano i dati scaricati, è necessario prima scoprire in quale segmento della raccolta si trova l'ID cancellato e poi registrare il suo offset. L'approccio più semplice è quello di cercare tutti gli ID in ogni segmento. L'ottimizzazione a cui stiamo pensando consiste nell'aggiungere un filtro Bloom a ogni segmento. Il filtro Bloom è una struttura dati casuale utilizzata per verificare se un elemento è membro di un insieme. Pertanto, possiamo caricare solo il filtro bloom di ogni segmento. Solo quando il filtro bloom determina che l'ID cancellato si trova nel segmento corrente, possiamo trovare l'offset corrispondente nel segmento; altrimenti, possiamo ignorare il segmento (Figura 5). Abbiamo scelto il filtro bloom perché utilizza meno spazio ed è più efficiente nella ricerca rispetto a molti suoi simili, come le tabelle hash. Sebbene il filtro bloom abbia un certo tasso di falsi positivi, possiamo ridurre i segmenti da ricercare al numero ideale per regolare la probabilità. Nel frattempo, il filtro bloom deve anche supportare la cancellazione. Altrimenti, l'ID dell'entità cancellata può ancora essere trovato nel filtro bloom, con un conseguente aumento del tasso di falsi positivi. Per questo motivo, utilizziamo il filtro bloom di conteggio, che supporta la cancellazione. In questo articolo non approfondiremo il funzionamento del filtro bloom. Se siete interessati, potete fare riferimento a Wikipedia.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_delete_request_milvus_bd26633b55.jpg" alt="5-delete-request-milvus.jpg" class="doc-image" id="5-delete-request-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>5-delete-requestion-milvus.jpg</span> </span></p>
<h2 id="Wrapping-up" class="common-anchor-header">Conclusione<button data-href="#Wrapping-up" class="anchor-icon" translate="no">
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
    </button></h2><p>Finora abbiamo fornito una breve introduzione su come Milvus elimina i vettori per ID. Come sapete, usiamo la cancellazione morbida per eliminare i dati cancellati. Quando i dati cancellati aumentano, dobbiamo compattare i segmenti della collezione per liberare lo spazio occupato dai dati cancellati. Inoltre, se un segmento è già stato indicizzato, la compattazione elimina anche il file di indice precedente e crea nuovi indici. Per ora, gli sviluppatori devono chiamare il metodo compact per compattare i dati. In futuro, speriamo di introdurre un meccanismo di ispezione. Ad esempio, quando la quantità di dati cancellati raggiunge una certa soglia o la distribuzione dei dati è cambiata dopo una cancellazione, Milvus compatta automaticamente il segmento.</p>
<p>Ora abbiamo introdotto la filosofia di progettazione della funzione di cancellazione e la sua implementazione. Ci sono sicuramente margini di miglioramento e ogni vostro commento o suggerimento è ben accetto.</p>
<p>Per conoscere Milvus: https://github.com/milvus-io/milvus. Potete anche unirvi alla nostra comunità <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/">Slack</a> per le discussioni tecniche!</p>
