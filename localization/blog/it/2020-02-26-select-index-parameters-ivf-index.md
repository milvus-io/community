---
id: select-index-parameters-ivf-index.md
title: 1. index_file_size
author: milvus
date: 2020-02-26T22:57:02.071Z
desc: Le migliori pratiche per l'indice di FIV
cover: assets.zilliz.com/header_4d3fc44879.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/select-index-parameters-ivf-index'
---
<custom-h1>Come selezionare i parametri dell'indice per l'indice IVF</custom-h1><p>In <a href="https://medium.com/@milvusio/best-practices-for-milvus-configuration-f38f1e922418">Best Practices for Milvus Configuration</a> sono state introdotte alcune best practices per la configurazione di Milvus 0.6.0. In questo articolo verranno introdotte anche alcune best practice per l'impostazione di parametri chiave nei client Milvus per operazioni quali la creazione di una tabella, la creazione di indici e la ricerca. Questi parametri possono influenzare le prestazioni della ricerca.</p>
<h2 id="1-codeindexfilesizecode" class="common-anchor-header">1. <code translate="no">index_file_size</code><button data-href="#1-codeindexfilesizecode" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando si crea una tabella, il parametro index_file_size viene utilizzato per specificare la dimensione, in MB, di un singolo file per la memorizzazione dei dati. Il valore predefinito è 1024. Quando si importano dati vettoriali, Milvus combina i dati in modo incrementale in file. Quando la dimensione del file raggiunge la dimensione del file_indice, questo file non accetta nuovi dati e Milvus salva i nuovi dati in un altro file. Questi sono tutti file di dati grezzi. Quando viene creato un indice, Milvus genera un file indice per ogni file di dati grezzi. Per il tipo di indice IVFLAT, la dimensione del file di indice è approssimativamente uguale alla dimensione del file di dati grezzi corrispondente. Per l'indice SQ8, la dimensione di un file di indice è pari a circa il 30% del file di dati grezzi corrispondente.</p>
<p>Durante la ricerca, Milvus cerca ogni file di indice uno per uno. Secondo la nostra esperienza, quando index_file_size passa da 1024 a 2048, le prestazioni della ricerca migliorano del 30-50%. Tuttavia, se il valore è troppo grande, è possibile che i file di grandi dimensioni non vengano caricati nella memoria della GPU (o anche nella memoria della CPU). Ad esempio, se la memoria della GPU è di 2 GB e index_file_size è di 3 GB, il file di indice non può essere caricato nella memoria della GPU. Di solito si imposta index_file_size a 1024 MB o 2048 MB.</p>
<p>La tabella seguente mostra un test con sift50m per index_file_size. Il tipo di indice è SQ8.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_sift50m_test_results_milvus_74f60de4aa.png" alt="1-sift50m-test-results-milvus.png" class="doc-image" id="1-sift50m-test-results-milvus.png" />
   </span> <span class="img-wrapper"> <span>1-sift50m-risultati-del-test-milvus.png</span> </span></p>
<p>Si può notare che in modalità CPU e GPU, quando index_file_size è 2048 MB invece di 1024 MB, le prestazioni di ricerca migliorano significativamente.</p>
<h2 id="2-codenlistcode-and-codenprobecode" class="common-anchor-header">2. <code translate="no">nlist</code> <strong>e</strong> <code translate="no">nprobe</code><button data-href="#2-codenlistcode-and-codenprobecode" class="anchor-icon" translate="no">
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
    </button></h2><p>Il parametro <code translate="no">nlist</code> viene utilizzato per la creazione dell'indice e il parametro <code translate="no">nprobe</code> per la ricerca. IVFLAT e SQ8 utilizzano entrambi algoritmi di raggruppamento per dividere un gran numero di vettori in cluster, o bucket. <code translate="no">nlist</code> è il numero di bucket durante il raggruppamento.</p>
<p>Quando si effettua una ricerca con indici, il primo passo consiste nel trovare un certo numero di bucket più vicini al vettore di destinazione e il secondo passo consiste nel trovare i k vettori più simili dai bucket in base alla distanza vettoriale. <code translate="no">nprobe</code> è il numero di bucket nel primo passo.</p>
<p>In generale, l'aumento di <code translate="no">nlist</code> porta a un maggior numero di bucket e a un minor numero di vettori in un bucket durante il clustering. Di conseguenza, il carico di calcolo diminuisce e le prestazioni di ricerca migliorano. Tuttavia, con un numero inferiore di vettori per il confronto di similarità, il risultato corretto potrebbe sfuggire.</p>
<p>L'aumento di <code translate="no">nprobe</code> comporta un maggior numero di bucket da ricercare. Di conseguenza, il carico di calcolo aumenta e le prestazioni di ricerca peggiorano, ma la precisione della ricerca migliora. La situazione può variare per set di dati con distribuzioni diverse. Quando si impostano <code translate="no">nlist</code> e <code translate="no">nprobe</code> si deve considerare anche la dimensione del set di dati. In generale, si raccomanda che <code translate="no">nlist</code> possa essere <code translate="no">4 * sqrt(n)</code>, dove n è il numero totale di vettori. Per quanto riguarda <code translate="no">nprobe</code>, è necessario trovare un compromesso tra precisione ed efficienza e il modo migliore è determinare il valore attraverso prove ed errori.</p>
<p>La tabella seguente mostra un test con sift50m per <code translate="no">nlist</code> e <code translate="no">nprobe</code>. Il tipo di indice è SQ8.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/sq8_index_test_sift50m_b5daa9f7b5.png" alt="sq8-index-test-sift50m.png" class="doc-image" id="sq8-index-test-sift50m.png" />
   </span> <span class="img-wrapper"> <span>sq8-index-test-sift50m.png</span> </span></p>
<p>La tabella confronta le prestazioni e la precisione della ricerca utilizzando diversi valori di <code translate="no">nlist</code>/<code translate="no">nprobe</code>. Vengono visualizzati solo i risultati della GPU perché i test della CPU e della GPU hanno risultati simili. In questo test, all'aumentare della stessa percentuale dei valori di <code translate="no">nlist</code>/<code translate="no">nprobe</code>, aumenta anche la precisione della ricerca. Quando <code translate="no">nlist</code> = 4096 e <code translate="no">nprobe</code> è 128, Milvus ha le migliori prestazioni di ricerca. In conclusione, quando si determinano i valori di <code translate="no">nlist</code> e <code translate="no">nprobe</code>, è necessario trovare un compromesso tra prestazioni e precisione, tenendo conto dei diversi set di dati e dei diversi requisiti.</p>
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
    </button></h2><p><code translate="no">index_file_size</code>: Quando la dimensione dei dati è superiore a <code translate="no">index_file_size</code>, maggiore è il valore di <code translate="no">index_file_size</code>, migliori sono le prestazioni di ricerca.<code translate="no">nlist</code> e <code translate="no">nprobe</code>： È necessario effettuare un compromesso tra prestazioni e precisione.</p>
