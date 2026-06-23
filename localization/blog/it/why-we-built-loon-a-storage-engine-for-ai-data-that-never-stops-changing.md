---
id: why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md
title: >
  Perché abbiamo creato Loon: un motore di archiviazione per i dati dell’IA in
  continua evoluzione.
author: Ted Xu
date: 2026-6-5
cover: assets.zilliz.com/Loon_New_Cover_8270435335.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 3.0, Zilliz Vector Lakebase, vector storage, AI datasets, Vortex'
meta_title: |
  AI Datasets Are Never Done. So We Built Loon.
desc: >
  Loon è un nuovo motore di archiviazione per Milvus 3.0 e Zilliz Vector
  Lakebase, progettato per gestire set di dati vettoriali in continua evoluzione
  grazie a ColumnGroups, allineamento degli ID delle righe e Manifests.
origin: >-
  https://zilliz.com/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing
---
<p><em>Questo articolo è stato originariamente pubblicato su zilliz.com ed è stato ripubblicato previa autorizzazione.</em></p>
<h2 id="Key-takeaways" class="common-anchor-header">Punti chiave<button data-href="#Key-takeaways" class="anchor-icon" translate="no">
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
    </button></h2><p>Si tratta di un'analisi tecnica approfondita e di ampio respiro, quindi ecco i punti chiave prima di addentrarci nei dettagli.</p>
<ul>
<li>I set di dati per l’IA non sono tabelle statiche. Le stesse righe continuano a cambiare man mano che i team sostituiscono i modelli di embedding, aggiungono vettori sparsi, modificano le didascalie, integrano le etichette, ricostruiscono gli indici ed eseguono analisi offline.</li>
<li>I layout di archiviazione tradizionali presentano tre limiti: le colonne di vettori lunghi rendono costosi i backfill, un unico formato di file non è in grado di gestire bene sia le scansioni che le letture puntuali, e l’archiviazione in database privati costringe le pipeline esterne a creare copie aggiuntive dei dati di riferimento.</li>
<li>Loon è il nuovo motore di archiviazione per Milvus e Zilliz Vector Lakebase. È basato su formati di file ibridi, sull’allineamento degli ID delle righe e su un Manifest che definisce lo stato versionato del set di dati.</li>
<li>L’obiettivo è consentire a un unico set di dati vettoriali di supportare la ricerca online, l’analisi offline, i backfill, la compattazione e l’elaborazione esterna senza dover costantemente copiare, riscrivere o reimportare i dati.</li>
</ul>
<h2 id="Introduction" class="common-anchor-header">Introduzione<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Per un certo periodo, c’era un argomento contro i database vettoriali che sembrava ragionevole.</p>
<p><em>I database tradizionali memorizzano già numeri interi, stringhe, JSON, blob e indici. Perché non aggiungere un</em> <em>tipo</em> " <code translate="no">_vector_</code> <em>", creare un indice ANN a supporto e considerare il problema risolto?</em></p>
<p>Per la ricerca semantica iniziale, questo funziona abbastanza bene. Una colonna vettoriale più un indice possono supportare una demo, una piccola applicazione RAG o una funzionalità di ricerca interna. Il problema emerge in seguito, quando il set di dati inizia a comportarsi meno come una tabella e più come un sistema di dati per l’intelligenza artificiale.</p>
<p>Un set di dati vettoriali di produzione presenta righe, chiavi primarie, campi scalari e colonne interrogabili. In questo senso, assomiglia a una tabella di database. Ma presenta anche la scala e la struttura del flusso di lavoro di un data lake. Può contenere centinaia di milioni di record. Viene ripetutamente letto e riscritto da Spark, Ray, DuckDB, pipeline di addestramento, processi di valutazione e sistemi di controllo della qualità dei dati.</p>
<p>Si basa inoltre sull’object storage. Gli oggetti di origine sono spesso video, immagini, PDF, file audio o documenti web che rimangono su S3, GCS, OSS o un altro object store. Il database memorizza riferimenti, metadati, caratteristiche derivate e indici. Aggiunge poi elementi che i modelli di archiviazione tradizionali non sono stati progettati per gestire come oggetti di prima classe: embedding densi, vettori sparsi, didascalie, indici vettoriali, indici di testo, log di cancellazione, statistiche, versioni dei modelli, versioni dei parser, riferimenti a blob esterni e le relazioni di versione tra tutti questi elementi.</p>
<p><strong>È qui che l’approccio “basta aggiungere una colonna vettoriale” inizia a fallire.</strong> Il problema non è se un database sia in grado di memorizzare byte vettoriali. Molti sistemi ne sono capaci. La domanda più complessa è <strong>se il modello di archiviazione sia in grado di gestire il modo in cui i dati vettoriali cambiano, come vengono interrogati e come vengono condivisi all’interno dello stack di dati dell’IA.</strong></p>
<p><strong>Ecco perché abbiamo creato Loon, il nuovo motore di archiviazione per Milvus e</strong> <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a> <strong>(la prossima evoluzione di Zilliz Cloud).</strong></p>
<p>Loon è stato progettato sulla base di tre principi:</p>
<ol>
<li>Utilizzare formati fisici diversi per diversi tipi di colonne.</li>
<li>Allineare tali colonne tramite uno spazio ID di riga condiviso.</li>
<li>Utilizzare un manifesto per definire lo stato versionato del set di dati.</li>
</ol>
<p>Per capire perché questi elementi sono importanti, partiamo da un flusso di lavoro multimodale comune.</p>
<h2 id="A-vector-dataset-is-never-really-finished" class="common-anchor-header">Un set di dati vettoriali non è mai veramente completo.<button data-href="#A-vector-dataset-is-never-really-finished" class="anchor-icon" translate="no">
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
    </button></h2><p>Immaginate un team di intelligenza artificiale che sta creando un set di dati video per l’addestramento multimodale.</p>
<p>Un video di lunga durata viene caricato su un sistema di archiviazione a oggetti. Una pipeline lo suddivide in clip in base ai cambi di scena, ai confini delle riprese o alle finestre temporali. Le clip troppo lunghe o troppo corte, sfocate, duplicate o di bassa qualità vengono filtrate. Le clip rimanenti vengono valutate da un modello estetico, sottotitolate da un altro modello, integrate da un modello di visione-linguaggio e archiviate in un database vettoriale per la ricerca, la deduplicazione e il filtraggio dei dati di addestramento.</p>
<p>A un livello generale, il flusso di lavoro sembra semplice:</p>
<pre><code translate="no">video
→ clips
→ metadata
→ aesthetic_score
→ caption
→ embedding
→ search / dedup / training data filtering
<button class="copy-code-btn"></button></code></pre>
<p>Ma il set di dati non arriva già pronto.</p>
<ul>
<li>Nella prima settimana, la tabella potrebbe contenere solo <code translate="no">clip_id</code>, <code translate="no">video_id</code>, <code translate="no">start_offset</code> e <code translate="no">duration</code>.</li>
<li>Nella seconda settimana, il team aggiunge <code translate="no">aesthetic_score</code>.</li>
<li>Nella terza settimana viene eseguito un modello di sottotitolazione e ogni clip riceve un <code translate="no">caption</code>.</li>
<li>Nella quarta settimana, il primo modello di embedding viene messo online e ogni clip riceve un embedding CLIP a 768 dimensioni.</li>
<li>Un mese dopo, il team cambia modello e aggiorna retroattivamente l'<code translate="no">embedding_v2</code>, ora a 1024 dimensioni.</li>
<li>Due mesi dopo, la ricerca ibrida diventa un requisito, quindi il team aggiunge una colonna di vettori sparsi.</li>
<li>Tre mesi dopo, le didascalie vengono sottoposte a revisione umana e devono essere corrette sul posto.</li>
</ul>
<p>Il set di dati non è mai stato completato. Ha continuato ad accumulare nuove interpretazioni delle stesse righe sottostanti.</p>
<p>Questa è una delle differenze fondamentali tra i dati vettoriali e i dati aziendali tradizionali. La stessa riga viene rielaborata più e più volte. E la scala trasforma questo inconveniente in un problema di archiviazione: i set di dati multimodali spesso non contano milioni di record, ma centinaia di milioni o miliardi. LAION-5B è un utile riferimento per la struttura: miliardi di coppie immagine-testo, ciascuna con metadati, didascalie e embedding. Quindi la parte difficile non è il primo inserimento. La parte difficile è tutto ciò che accade dopo che il set di dati inizia a evolversi. <strong>Tale evoluzione mette in luce tre problemi.</strong></p>
<h2 id="The-first-problem-long-columns-make-write-amplification-expensive" class="common-anchor-header">Il primo problema: le colonne lunghe rendono costosa l’amplificazione di scrittura<button data-href="#The-first-problem-long-columns-make-write-amplification-expensive" class="anchor-icon" translate="no">
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
    </button></h2><p>I formati colonnari come Parquet sono eccellenti per molti carichi di lavoro analitici. Funzionano bene quando gli schemi sono abbastanza stabili, i dati vengono letti più spesso di quanto vengano riscritti, le scansioni interessano solo un sottoinsieme di colonne e la compressione è importante. Questo è il contesto per cui molti formati analitici sono stati ottimizzati.</p>
<h3 id="Vector-rows-are-much-wider-than-analytical-rows" class="common-anchor-header">Le righe vettoriali sono molto più larghe delle righe analitiche</h3><p>L’ <code translate="no">lineitem</code> e TPC-H è un buon punto di riferimento. Presenta 16 colonne: chiavi intere, valori decimali, date, stringhe brevi e un piccolo campo per i commenti. Una riga non compressa occupa circa 150 byte. Dopo la compressione, può diventare molto più piccola. Con un gruppo di righe da 64 MB, un sistema di archiviazione può raggruppare centinaia di migliaia di righe in un unico gruppo.</p>
<p><strong>I set di dati vettoriali non hanno questa struttura.</strong></p>
<p>Un set di dati immagine-testo in stile LAION è molto più simile a ciò che molte pipeline di IA producono oggi. Ogni riga contiene ancora i normali metadati: un URL, una didascalia, larghezza, altezza, punteggi di qualità, etichette e così via. Ma una volta aggiunto l’embedding, la struttura fisica della riga cambia.</p>
<p>Un vettore CLIP a 768 dimensioni occupa circa 1,5 KB in fp16 o 3 KB in fp32. Quella singola colonna può essere molto più grande di un’intera riga TPC-H <code translate="no">lineitem</code>.</p>
<p>E 768 dimensioni non sono né insolite né grandi per gli standard odierni. Un embedding a 1024 o 2048 dimensioni è comune nelle pipeline multimodali. L’ <code translate="no">text-embedding-3-large</code> di OpenAI arriva fino a 3072 dimensioni, il che corrisponde a circa 12 KB per vettore in fp32.</p>
<p>Il confronto è netto:</p>
<table>
<thead>
<tr><th>Struttura del dataset</th><th>Dimensione approssimativa della riga</th><th>Cosa domina la riga</th></tr>
</thead>
<tbody>
<tr><td>TPC-H lineitem</td><td>~150 byte non compressi</td><td>campi scalari e stringhe brevi</td></tr>
<tr><td>Riga in stile LAION con vettore fp16 a 768 dimensioni</td><td>~1,5 KB+</td><td>incorporamento</td></tr>
<tr><td>riga in stile LAION con vettore fp32 a 768 dimensioni</td><td>~3 KB+</td><td>incorporamento</td></tr>
<tr><td>Riga con vettore fp32 a 3072 dimensioni</td><td>~12 KB+ solo per il vettore</td><td>incorporamento</td></tr>
</tbody>
</table>
<p>In molti set di dati di IA, la colonna del vettore non è semplicemente un altro campo. Fisicamente, costituisce la maggior parte della riga. Ciò modifica il costo dell’evoluzione dello schema.</p>
<h3 id="Adding-one-vector-column-can-mean-hundreds-of-gigabytes" class="common-anchor-header">L'aggiunta di una sola colonna vettoriale può comportare centinaia di gigabyte</h3><p>Supponiamo che un set di dati contenga 100 milioni di clip video. L’aggiunta di una nuova colonna di embedding fp32 a 1024 dimensioni comporta la scrittura di circa 400 GB di dati vettoriali grezzi. Ciò non include statistiche, indici, aggiornamenti dei metadati, overhead di archiviazione degli oggetti, convalida o integrazione del percorso di servizio.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_3_ca3c616b9e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Se il team aggiunge una o due colonne di tipo vettoriale ogni mese, come le feature di " <code translate="no">embedding_v2</code>", " <code translate="no">sparse_vector</code>" o "rerank", l’evoluzione dello schema diventa un’attività ricorrente di ingegneria dei dati che si misura in centinaia di gigabyte o terabyte.</p>
<h3 id="Small-logical-updates-can-trigger-large-physical-rewrites" class="common-anchor-header">Piccoli aggiornamenti logici possono innescare grandi riscritture fisiche</h3><p>Gli aggiornamenti sono altrettanto importanti.</p>
<p>Nei sistemi a colonne, i dati precedenti di solito non vengono aggiornati in loco. Un log di eliminazione registra ciò che è cambiato e la compattazione riscrive successivamente le righe attive in nuovi file. Questo modello è gestibile quando le righe sono piccole.</p>
<p>Con i dati vettoriali, un piccolo aggiornamento logico può innescare una riscrittura fisica di grandi dimensioni.</p>
<p>Un'operazione di revisione manuale potrebbe correggere solo poche centinaia di byte in una didascalia. Ma se la didascalia, il vettore denso, il vettore sparso e altre caratteristiche derivate condividono lo stesso ciclo di vita del file fisico, il sistema potrebbe finire per riscrivere anche i vettori. La modifica logica è piccola. L’I/O fisico può essere enorme.</p>
<p>Questo è il problema dell’amplificazione della scrittura nell’archiviazione vettoriale. La parte onerosa non è solo che i vettori sono grandi, ma che i campi derivati di grandi dimensioni e i campi mutabili di piccole dimensioni vengono spesso collegati tra loro da un layout di archiviazione che li tratta come un’unica unità.</p>
<h3 id="For-AI-datasets-backfill-is-a-routine-workload" class="common-anchor-header">Per i set di dati di IA, il backfill è un carico di lavoro di routine</h3><p>Per le tabelle analitiche tradizionali, l’evoluzione dello schema può verificarsi solo occasionalmente. Per i set di dati di IA, invece, è una pratica di routine. I modelli di caption vengono aggiornati. I modelli di embedding vengono sostituiti. I vettori sparsi vengono aggiunti in un secondo momento. Compaiono caratteristiche di reranking. Le etichette umane vengono corrette. I tag di governance vengono inseriti a posteriori. Gli indici vengono ricostruiti.</p>
<p>Queste operazioni non sono semplici aggiunte. Spesso modificano o estendono le righe esistenti.</p>
<p>Ecco perché l’archiviazione vettoriale non può limitarsi a ottimizzare la velocità di scansione. Deve anche rendere più economici i backfill e gli aggiornamenti parziali.</p>
<h2 id="The-second-problem-the-same-data-must-support-scans-and-point-reads" class="common-anchor-header">Il secondo problema: gli stessi dati devono supportare sia le scansioni che le letture puntuali<button data-href="#The-second-problem-the-same-data-must-support-scans-and-point-reads" class="anchor-icon" translate="no">
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
    </button></h2><p>Dopo la scrittura dei dati, il percorso di lettura si divide. Lo stesso set di dati vettoriali presenta in genere due modelli di accesso distinti: <strong>la scansione analitica e le letture puntuali.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_4_cef8d0e3ea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Analytical-workloads-want-wide-compressed-scans" class="common-anchor-header">I carichi di lavoro analitici richiedono scansioni ampie e compresse</h3><p>Una pipeline può eseguire filtri quali:</p>
<pre><code translate="no" class="language-sql">WHERE aesthetic_score &gt; 0.8 AND duration &gt; 5
<button class="copy-code-btn"></button></code></pre>
<p>Oppure può eseguire analisi offline, valutazione completa dell’embedding, statistiche BM25, costruzione di bitmap, controlli di qualità dei dati, conteggi e raggruppamenti.</p>
<p>Questo modello legge molte righe ma solo poche colonne. Predilige l’I/O sequenziale, gruppi di righe più grandi, la compressione, il pruning delle colonne, la decodifica in batch e l’esecuzione vettorializzata.</p>
<p>In questo caso, i grandi gruppi di righe sono di grande aiuto. Consentono a una singola richiesta di I/O di estrarre una grande quantità di dati utili, migliorano l’efficienza della compressione e forniscono al motore di esecuzione dati contigui sufficienti per ammortizzare l’overhead. Quando vengono lette più colonne contemporaneamente, mantenerle organizzate per il throughput di scansione aiuta anche a ridurre i cache miss durante l’esecuzione vettorizzata.</p>
<p>Parquet eccelle in questo ambito.</p>
<h3 id="ANN-results-need-narrow-row-level-lookups" class="common-anchor-header">I risultati dell’ANN richiedono ricerche mirate a livello di riga</h3><p>Dopo che la ricerca ANN restituisce gli ID delle righe candidate, il sistema spesso deve recuperare campi quali:</p>
<pre><code translate="no">caption
embedding
rerank feature
video_uri
metadata
<button class="copy-code-btn"></button></code></pre>
<p>Questo modello legge un numero minore di righe, spesso centinaia o migliaia, ma richiede un accesso preciso tramite l’ID della riga. L’obiettivo è individuare una riga e una colonna specifiche, recuperare solo l’intervallo di byte richiesto ed evitare di estrarre un intero gruppo di righe solo per recuperare pochi record.</p>
<p>La ricerca puntuale ha una preferenza quasi opposta per quanto riguarda la scansione. Richiede una granularità di lettura più ridotta. Idealmente, il livello di archiviazione dovrebbe essere in grado di individuare il segmento o l’intervallo di byte pertinente tramite l’ID della riga, leggere solo quell’intervallo e decodificare solo i dati necessari per il risultato.</p>
<p>Anche la compressione presenta un diverso compromesso. Per le scansioni, spesso vale la pena applicare una compressione più pesante perché il sistema legge molti dati e risparmia operazioni di I/O. Per la ricerca puntuale, la compressione può diventare un ostacolo se il recupero di una riga richiede la decodifica di un blocco compresso molto più grande.</p>
<h3 id="One-layout-cannot-optimize-for-both-paths" class="common-anchor-header">Un unico layout non può ottimizzare entrambi i percorsi</h3><p>Questo è il conflitto fondamentale. Il filtraggio scalare e l’analisi richiedono layout ampi, compressi e adatti alle scansioni. La ricerca vettoriale richiede layout stretti, precisi e indirizzabili per riga.</p>
<p>Un singolo formato di file può supportare entrambi in una certa misura, ma non può essere ottimale per entrambi contemporaneamente.</p>
<p>Se tutte le colonne risiedono in Parquet, le scansioni scalari procedono senza problemi. Ma la ricerca ANN dopo il richiamo diventa più complessa. Il sistema potrebbe aver bisogno solo di poche centinaia di vettori, didascalie o record di metadati, mentre il livello di archiviazione potrebbe dover leggere grandi gruppi di righe che contengono per lo più righe irrilevanti.</p>
<p>Su un SSD locale, la cache e mmap possono nascondere parte di questo costo. Una volta che i dati sono archiviati nell’object storage, il costo diventa più evidente. Ogni mancata corrispondenza nella cache può trasformarsi in una lettura di intervallo remoto. Se le righe candidate sono sparse su molti gruppi di righe, una singola query può innescare più letture, ciascuna delle quali estrae più dati di quelli necessari alla query. In una struttura mal progettata, il recupero di 1.000 righe candidate può facilmente comportare decine o centinaia di megabyte di I/O non necessari e, in casi estremi, molto di più.</p>
<p>Ridurre le dimensioni dei gruppi di righe aiuta la ricerca puntuale, ma penalizza le scansioni. Troppi piccoli frammenti riducono l’efficienza della compressione, aumentano il sovraccarico dei metadati e interrompono le lunghe letture sequenziali da cui dipendono i motori analitici.</p>
<p><strong>Quindi il problema non sta nel trovare una singola dimensione "magica" per i gruppi di righe. Il problema è che allo stesso set di dati viene richiesto di comportarsi come due sistemi di archiviazione diversi.</strong></p>
<h3 id="Hybrid-search-forces-both-paths-into-one-query" class="common-anchor-header">La ricerca ibrida costringe entrambi i percorsi a convivere in un’unica query</h3><p>La ricerca ibrida rende il conflitto più difficile da ignorare. Una singola query può prima applicare filtri scalari:</p>
<pre><code translate="no" class="language-sql">aesthetic_score &gt; 0.8 AND duration &gt; 5
<button class="copy-code-btn"></button></code></pre>
<p>Poi esegue la ricerca ANN.</p>
<p>Successivamente recupera didascalia, vettore e metadati in base all’ID della riga.</p>
<p>Per l’utente, si tratta di un’unica richiesta di ricerca. Per il livello di archiviazione, invece, è sia una scansione analitica che una ricerca casuale a bassa latenza.</p>
<p>Ecco perché l’archiviazione vettoriale richiede più di una semplice ottimizzazione delle impostazioni Parquet. Ha bisogno di un modo per disporre le diverse colonne in base a come vengono effettivamente lette.</p>
<h2 id="The-third-problem-the-dataset-does-not-live-inside-one-engine" class="common-anchor-header">Il terzo problema: il set di dati non risiede all’interno di un unico motore<button data-href="#The-third-problem-the-dataset-does-not-live-inside-one-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>I primi due problemi si verificano all’interno del database. Il terzo si verifica al confine tra i sistemi.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_5_802e6d92c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AI-data-pipelines-span-many-systems" class="common-anchor-header">Le pipeline di dati per l’IA abbracciano molti sistemi</h3><p>Nel flusso di lavoro video, ben poco avviene all’interno del database vettoriale stesso.</p>
<p>I video grezzi risiedono nell’object storage. La generazione delle clip può avvenire in Spark o Ray. La valutazione estetica può essere eseguita in un servizio GPU. La sottotitolazione può avvenire in una pipeline di inferenza LLM. Gli embedding possono essere generati da un altro processo GPU. I vettori sparsi possono provenire da un servizio SPLADE. La valutazione offline, il filtraggio dei dati di addestramento, la revisione umana e i processi di governance possono essere tutti eseguiti altrove.</p>
<p>Il database vettoriale supporta la ricerca online, ma il set di dati viene prodotto, corretto, valutato ed esteso da numerosi sistemi.</p>
<h3 id="Private-storage-formats-create-multiple-copies-of-the-truth" class="common-anchor-header">I formati di archiviazione privati creano più copie della "verità"</h3><p>Se il database utilizza un formato fisico privato che solo esso è in grado di leggere e scrivere, ogni processo esterno richiede un’esportazione, una conversione, una copia e un’importazione. La stessa raccolta può esistere nel database, in una directory temporanea di Spark, in un output di valutazione e in una directory locale di backfill. A quel punto la vera domanda diventa:</p>
<ul>
<li>Quale copia è la fonte di verità?</li>
<li>Quale contiene il modello di didascalia del mese scorso?</li>
<li>Quali righe sono già state corrette tramite revisione umana?</li>
<li>Quale colonna di vettori sparsi è stata generata da quale modello?</li>
<li>Quale indice vettoriale è ancora valido dopo il backfill?</li>
<li>A quale oggetto video originale si riferisce questa riga?</li>
</ul>
<p>Su piccola scala, i team possono talvolta cavarsela con convenzioni di denominazione e controlli manuali. Con centinaia di milioni di righe e terabyte di embedding, ciò diventa un problema di coerenza.</p>
<h3 id="Vector-datasets-need-a-shared-versioned-state" class="common-anchor-header">I set di dati vettoriali necessitano di uno stato condiviso e versionato</h3><p>I sistemi Lakehouse hanno affrontato una versione di questo problema per i dati strutturati. Iceberg, Delta Lake e Hudi non si limitano alla semplice archiviazione di file. Il loro contributo principale consiste nel consentire a più motori di coordinarsi attorno allo stesso stato della tabella.</p>
<p>I database vettoriali ora necessitano di una capacità simile, ma lo stato è più complesso. Deve includere non solo i file delle tabelle e le partizioni, ma anche indici vettoriali, indici di testo, caratteristiche sparse, log di eliminazione, statistiche, intervalli di ID delle righe e riferimenti a blob esterni.</p>
<p>La domanda non è semplicemente: «Spark è in grado di leggere i file Milvus?»</p>
<p>La domanda è: dopo che Spark ha riempito una colonna vettoriale sparsa, come fa Milvus a sapere a quale versione appartiene quella colonna, quali righe copre, quale modello l’ha prodotta e quando le query online possono utilizzarla in sicurezza?</p>
<p>La risposta deve risiedere nel modello di archiviazione.</p>
<h2 id="Why-patches-are-not-enough" class="common-anchor-header">Perché le patch non sono sufficienti<button data-href="#Why-patches-are-not-enough" class="anchor-icon" translate="no">
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
    </button></h2><p>Si è tentati di considerare questi aspetti come tre problemi ingegneristici distinti.</p>
<ul>
<li>Amplificazione di scrittura? Aggiungere il batching.</li>
<li>Letture puntuali? Aggiungere una cache.</li>
<li>Sistemi esterni? Aggiungere strumenti di esportazione e importazione.</li>
</ul>
<p>Queste soluzioni possono aiutare, ma non risolvono il problema di fondo: un dataset vettoriale è fisicamente eterogeneo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_6_0744ff4445.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nell’esempio del video, <code translate="no">clip_id</code>, <code translate="no">video_id</code>, <code translate="no">duration</code> e <code translate="no">aesthetic_score</code> sono brevi campi scalari. Sono utili per il filtraggio e l’analisi.</p>
<ul>
<li><code translate="no">caption</code> è testo. Può essere utilizzato per BM25, revisione, correzione e backfill.</li>
<li><code translate="no">embedding</code> è un vettore lungo e denso. Viene utilizzato per il recall delle reti neurali artificiali (ANN) e successivamente per la ricerca a livello di riga o il riclassamento.</li>
<li><code translate="no">embedding_v2</code> è un nuovo output del modello, spesso inserito a posteriori molto tempo dopo l’inserimento dei dati originali.</li>
<li><code translate="no">sparse_vector</code> supporta la ricerca ibrida e ha un proprio modello di accesso.</li>
<li>Il video grezzo dovrebbe rimanere nell’object storage. Il database dovrebbe memorizzare un riferimento, un checksum, un tipo MIME, una versione del parser e una relazione a livello di riga.</li>
<li>Gli indici vettoriali, gli indici di testo, le statistiche e i log di eliminazione sono oggetti derivati con una propria semantica di versione.</li>
</ul>
<p>Questi oggetti condividono una riga logica, ma non dovrebbero condividere tutti lo stesso layout fisico o ciclo di vita.</p>
<ul>
<li>Se vengono forzati in un unico layout di tabella ordinaria, gli aggiornamenti diventano costosi.</li>
<li>Se vengono forzati in un unico formato di file colonnare, le letture puntuali diventano costose.</li>
<li>Se vengono trattati come file oggetto non correlati, la gestione delle versioni diventa fragile.</li>
</ul>
<p>Pertanto, il modello di archiviazione deve partire dal presupposto che il set di dati sia eterogeneo.</p>
<p><strong>Ciò porta a tre requisiti di progettazione:</strong></p>
<ul>
<li>In primo luogo, i diversi gruppi di colonne dovrebbero essere memorizzati in formati fisici diversi.</li>
<li>In secondo luogo, tali gruppi di colonne necessitano di uno spazio ID di riga condiviso, in modo da poter continuare a comportarsi come un'unica tabella logica.</li>
<li>In terzo luogo, il set di dati necessita di un manifesto con controllo delle versioni che indichi quali file, indici, log, statistiche e riferimenti agli oggetti appartengono alla vista corrente.</li>
</ul>
<p><strong>Questo è il principio alla base di Loon, il nostro nuovo motore di archiviazione alla base di Milvus e Zilliz Cloud.</strong></p>
<h2 id="Loon-a-storage-engine-behind-Milvus-and-Zilliz-Cloud-for-evolving-vector-datasets" class="common-anchor-header">Loon: un motore di archiviazione alla base di Milvus e Zilliz Cloud per set di dati vettoriali in continua evoluzione<button data-href="#Loon-a-storage-engine-behind-Milvus-and-Zilliz-Cloud-for-evolving-vector-datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>Per risolvere tutti i problemi sopra citati, abbiamo sviluppato <strong>Loon</strong>, il nuovo motore di archiviazione per Milvus e <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a> (la prossima evoluzione di Zilliz Cloud), progettato per set di dati vettoriali in continua evoluzione.</p>
<p>Il nome segue la tradizione di Zilliz di dare nomi di uccelli ai propri prodotti. Un loon è un uccello tuffatore che vive sui laghi, il che si adatta bene all’obiettivo del sistema: un database vettoriale non dovrebbe dover spostare, scansionare o riscrivere un intero lago di dati ogni volta che esegue una query, aggiorna una colonna o crea un indice. Dovrebbe innanzitutto comprendere la versione corrente del set di dati, comprese le colonne, gli indici, le statistiche, i log di eliminazione e i riferimenti agli oggetti, per poi leggere solo la parte di cui ha effettivamente bisogno.</p>
<p>I formati di file ibridi, l’allineamento degli ID delle righe e Manifest non sono tre funzionalità separate. Derivano dallo stesso presupposto di progettazione: un set di dati vettoriali è intrinsecamente eterogeneo.</p>
<h3 id="Three-pieces-one-storage-model" class="common-anchor-header">Tre elementi, un unico modello di archiviazione</h3><p>I formati di file ibridi riconoscono che colonne diverse presentano modelli di accesso diversi. I campi scalari sono adatti per scansioni e filtri. I campi vettoriali richiedono una ricerca efficiente a livello di riga. Gli oggetti grezzi come video, PDF, immagini e file audio appartengono all’object storage, non ai file di dati del database.</p>
<p>L’allineamento degli ID di riga riconosce che queste colonne possono essere fisicamente separate, ma descrivono comunque le stesse righe logiche. Una didascalia, un embedding, un vettore sparsa e un URI video possono risiedere in file e formati diversi, ma devono comunque essere riuniti in un unico risultato.</p>
<p>Il Manifest riconosce che il set di dati non viene scritto una volta per tutte e poi lasciato immutato. Verrà modificato da più sistemi, attraverso più versioni, per molteplici attività. Indici, statistiche, log di cancellazione, riferimenti a oggetti esterni e gruppi di colonne devono tutti apparire nella stessa vista versionata.</p>
<p><strong>Ecco perché Loon non è solo un formato di file vettoriale più veloce.</strong> Un formato più veloce facilita la ricerca puntuale, ma non risolve l’evoluzione dello schema né il coordinamento tra più motori. L’allineamento degli ID delle righe consente alle colonne suddivise di comportarsi come un’unica tabella, ma non specifica quali file appartengano alla versione corrente. Un Manifest può descrivere lo stato di un set di dati, ma senza gruppi di colonne e allineamento degli ID delle righe, non può rappresentare in modo chiaro i diversi layout fisici all’interno di un’unica raccolta logica.</p>
<p>Il modello di archiviazione necessita di tutti e tre questi elementi: formati diversi per i diversi gruppi di colonne, uno spazio condiviso di ID di riga per ricostruire le righe e un Manifest con controllo delle versioni che indichi a ogni lettore e scrittore quale sia lo stato attuale del set di dati.</p>
<h3 id="Where-Loon-fits-in-Milvus-and-Zilliz-Vector-Lakebase" class="common-anchor-header">Il ruolo di Loon in Milvus e Zilliz Vector Lakebase</h3><p>In Milvus, sostituisce il vecchio livello di archiviazione binlog a segmenti con un modello costruito attorno a Manifest, ColumnGroup, formato di file e astrazioni del filesystem. In <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a> (la prossima evoluzione di Zilliz Cloud)<strong>,</strong> la stessa direzione si applica all’architettura di Vector Lakebase: mantenere veloce il percorso di servizio del database vettoriale rendendo al contempo i dati sottostanti più facili da evolvere, analizzare e coordinare con i sistemi esterni.</p>
<p>I componenti di livello superiore di Milvus mantengono i loro ruoli familiari. Proxy gestisce l’instradamento. QueryCoord e DataCoord gestiscono la pianificazione. IndexNode crea gli indici. Le API rivolte alle applicazioni per raccolte, inserimenti, ricerche e ricerche ibride non devono esporre file Manifest o ColumnGroup.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_7_d4d1a34604.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Il cambiamento è a livello di base.</p>
<p>DataNode, QueryNode, segcore, la compattazione e i connettori esterni possono operare attraverso la stessa astrazione di archiviazione. Ciò è importante perché il set di dati non viene più scritto e letto esclusivamente dal database. Può essere esteso da sistemi di elaborazione esterni e utilizzato contemporaneamente per la ricerca online.</p>
<p>A livello generale, i livelli si presentano così:</p>
<pre><code translate="no">Manifest
→ ColumnGroup
→ file <span class="hljs-built_in">format</span> layer
→ filesystem abstraction
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_8_70917bdfc7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Il Manifest descrive lo stato versionato del set di dati. I ColumnGroups mappano una raccolta logica in gruppi fisici di colonne. Il livello del formato di file consente a ciascun ColumnGroup di scegliere un formato appropriato. L’astrazione del file system funziona sia con l’object storage che con lo storage locale.</p>
<p>Il punto importante è che i formati di file ibridi, l’allineamento degli ID delle righe e il Manifest non sono funzionalità separate. Insieme, definiscono il modello di archiviazione.</p>
<p>Con questo modello in atto, possiamo esaminare una per una le tre scelte di progettazione: come Loon memorizza i diversi ColumnGroups, come li riallinea nelle righe e come il Manifest trasforma quei file in un set di dati con versione.</p>
<h2 id="Design-1-use-the-right-file-format-for-the-right-column-group" class="common-anchor-header">Progetto 1: utilizzare il formato di file corretto per il gruppo di colonne corretto<button data-href="#Design-1-use-the-right-file-format-for-the-right-column-group" class="anchor-icon" translate="no">
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
    </button></h2><p>Colonne diverse presentano modelli di accesso diversi. Non dovrebbero essere costrette a utilizzare lo stesso formato di file.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_9_c262865944.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Loon-separates-a-logical-collection-into-ColumnGroups" class="common-anchor-header">Loon suddivide una raccolta logica in gruppi di colonne.</h3><ul>
<li>I campi scalari, i campi filtro, le chiavi aziendali e i campi statistici vengono spesso scansionati, filtrati, aggregati o utilizzati per la pianificazione delle query. Traggono vantaggio dalla compressione, dal pruning delle colonne e dalla compatibilità con l’ecosistema. Parquet è una scelta adeguata per queste colonne.</li>
<li>I vettori densi, i vettori sparsi e le caratteristiche di reranking vengono spesso letti dopo il richiamo ANN tramite ID di riga. Richiedono un accesso casuale a bassa latenza, letture precise di intervalli di byte e decodifica selettiva. Un layout orientato ai segmenti è più adatto. Loon utilizza Vortex in questo contesto.</li>
<li>Gli oggetti grezzi come video, PDF, immagini e file audio non dovrebbero essere incorporati nei file di dati del database vettoriale. Dovrebbero rimanere nell’object storage. Il database registra riferimenti, checksum, tipi MIME, versioni del parser e relazioni a livello di riga.</li>
</ul>
<p>Per l’esempio del video, un layout fisico potrebbe presentarsi così:</p>
<pre><code translate="no"><span class="hljs-title class_">Parquet</span> <span class="hljs-title class_">ColumnGroup</span>:
clip_id / video_id / start_offset / duration / aesthetic_score / caption

<span class="hljs-title class_">Vortex</span> <span class="hljs-title class_">ColumnGroups</span>:
embedding
embedding_v2
sparse_vector

<span class="hljs-title class_">Object</span> <span class="hljs-attr">storage</span>:
raw video objects
<button class="copy-code-btn"></button></code></pre>
<p>Per l’applicazione, si tratta comunque di un’unica collezione. A livello di storage, le diverse parti di quella collezione utilizzano formati fisici diversi. Ciò riduce direttamente le riscritture non necessarie. L’aggiunta di un <code translate="no">embedding_v2</code> e può tradursi in un nuovo ColumnGroup vettoriale più un commit del Manifest. Non richiede la riscrittura della colonna delle didascalie, dei metadati scalari o della colonna di embedding esistente.</p>
<p>Lo stesso principio si applica ai vettori sparsi, alle caratteristiche di reranking o ad altri campi derivati. Se una nuova colonna può essere fisicamente indipendente e allineata in base all’ID della riga, non è necessario trascinare colonne non correlate attraverso lo stesso percorso di riscrittura.</p>
<h3 id="Loon-also-adapts-the-use-of-file-formats" class="common-anchor-header">Loon adatta anche l’uso dei formati di file.</h3><p><strong>Per Parquet, le impostazioni predefinite non sono sempre ideali per dati con un elevato numero di vettori.</strong> Un gruppo di righe da 64 MB può risultare troppo grande per la ricerca puntuale, poiché una piccola lettura casuale potrebbe recuperare molti più dati del necessario. Loon riduce i gruppi di righe a 1 MB nei percorsi rilevanti e disabilita le codifiche, come la codifica a dizionario sulle colonne vettoriali, quando non aiutano i dati vettoriali a ricerca casuale.</p>
<p><strong>Per Vortex, l’aspetto più importante è il layout.</strong> Loon utilizza un layout che bilancia l’efficienza della scansione e la ricerca puntuale. All’interno di un gruppo di righe, i segmenti provenienti da colonne correlate possono essere posizionati vicini tra loro per facilitare la scansione. Per eseguire le operazioni, le letture di sottosegmenti consentono al sistema di recuperare solo i byte rilevanti anziché estrarre un intero segmento.</p>
<p><strong>Loon supporta inoltre l’integrazione in sola lettura con Lance</strong>, in modo che i set di dati Lance esistenti possano essere montati come ColumnGroups quando la compatibilità è fondamentale.</p>
<h3 id="What-the-benchmark-shows" class="common-anchor-header">Cosa mostra il benchmark</h3><p>In un test locale, utilizzando un singolo file con 40.000 righe e lo schema <code translate="no">{id: int64, name: utf8, value: float64, vector: list&lt;float32&gt;[128]}</code>, Vortex ha mostrato questi risultati rispetto a Parquet con gruppi di righe da 1 MB:</p>
<table>
<thead>
<tr><th>Operazione</th><th>Vortex</th><th>Parquet</th><th>Differenza</th></tr>
</thead>
<tbody>
<tr><td>Prelievo, K=1.000 righe casuali</td><td>5,8 ms</td><td>144 ms</td><td>25 volte più veloce</td></tr>
<tr><td>Scansione completa delle colonne del vettore</td><td>21 ms</td><td>142 ms</td><td>6,76 volte più veloce</td></tr>
<tr><td>Dimensione del file, ~21 MB di dati grezzi</td><td>6,62 MB</td><td>7,16 MB</td><td>7% più piccolo</td></tr>
</tbody>
</table>
<p>Il risultato " <code translate="no">take</code> " deriva dalla riduzione della quantità di dati irrilevanti che devono essere letti e decodificati. Il risultato della scansione deriva dalle scelte relative alla compressione e all'implementazione.</p>
<p>Questi numeri dovrebbero essere associati alla configurazione utilizzata: 8 vCPU Ubuntu 22.04 KVM, filesystem locale, un file, 40.000 righe, gruppi di righe da 1 MB e lo schema sopra riportato. Nello storage a oggetti, l’I/O di rete può diventare predominante, quindi ridurre l’amplificazione di lettura può essere ancora più importante. I risultati effettivi dipendono dalla struttura del set di dati, dal comportamento dello storage a oggetti, dallo stato della cache e dal modello di query.</p>
<p>Il punto più generale non è che ogni colonna debba utilizzare Vortex.</p>
<p>Il punto è che i set di dati vettoriali richiedono una scelta del formato file a livello di ColumnGroup.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_11_127c1953e6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Design-2-align-physical-files-through-row-IDs" class="common-anchor-header">Progetto 2: allineare i file fisici tramite gli ID delle righe<button data-href="#Design-2-align-physical-files-through-row-IDs" class="anchor-icon" translate="no">
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
    </button></h2><p>I formati di file ibridi risolvono un problema: colonne diverse possono ora risiedere nei formati più adatti a ciascuna di esse.</p>
<p>Ma questo crea un secondo problema. Se i campi scalari risiedono in Parquet, i vettori in Vortex e gli oggetti grezzi nell’object storage, come fa il sistema a trattarli comunque come un’unica raccolta?</p>
<p><strong>Loon risolve questo problema con l’allineamento degli ID di riga.</strong></p>
<h3 id="Row-ID-is-the-storage-layer-coordinate-system" class="common-anchor-header">L’ID riga è il sistema di coordinate del livello di archiviazione</h3><p>Ogni ColumnGroupFile fisico registra il percorso del file e l’intervallo di ID di riga che copre:</p>
<pre><code translate="no">path
start_index
end_index
<button class="copy-code-btn"></button></code></pre>
<p>ColumnGroup diversi possono coprire lo stesso spazio di ID di riga anche se risiedono in file e formati diversi.</p>
<p>Per l’ID riga <code translate="no">12345</code>, i metadati scalari potrebbero trovarsi in un ColumnGroup Parquet, l’incorporamento potrebbe trovarsi in un ColumnGroup Vortex e il video grezzo potrebbe essere rappresentato da un riferimento all’object storage. Logicamente, costituiscono comunque un’unica riga. Ciò fornisce al livello di archiviazione un sistema di coordinate stabile.</p>
<p>L’ID riga non è la chiave primaria del business. È il sistema di coordinate del livello di archiviazione che consente a Loon di suddividere fisicamente una raccolta senza perdere la capacità di ricostruirla logicamente.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_12_3da04acdec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="New-columns-do-not-have-to-rewrite-old-columns" class="common-anchor-header">Le nuove colonne non richiedono la riscrittura di quelle esistenti</h3><p>L’aggiunta di un ColumnGroup « <code translate="no">embedding_v2</code> » non richiede la riscrittura della didascalia originale, dei metadati o dei ColumnGroup « <code translate="no">embedding_v1</code> ». Loon può scrivere un nuovo ColumnGroup vettoriale, registrare l’intervallo di ID delle righe che copre e confermare tale modifica tramite il Manifest.</p>
<p>Lo stesso vale per i vettori sparsi, le caratteristiche di riclassificazione o altri campi derivati che arrivano in un secondo momento.</p>
<p>Purché il nuovo ColumnGroup copra il giusto intervallo di ID delle righe, può unirsi alla stessa raccolta logica senza costringere i dati non correlati a spostarsi.</p>
<h3 id="Deletes-and-compaction-can-be-more-targeted" class="common-anchor-header">Le eliminazioni e la compattazione possono essere più mirate</h3><p>L’allineamento degli ID delle righe aiuta anche nelle operazioni di eliminazione.</p>
<p>Un'eliminazione può essere inizialmente espressa tramite un log di eliminazione. La riga diventa invisibile a livello logico, mentre la pulizia fisica viene posticipata fino alla compattazione. Quando la compattazione viene infine eseguita, non è sempre necessario riscrivere ogni ColumnGroup legato alle righe interessate. Può concentrarsi sui ColumnGroup che necessitano di pulizia.</p>
<p>Questo è importante perché non tutte le colonne hanno lo stesso profilo di costo. Riscrivere un ColumnGroup scalare di piccole dimensioni è molto diverso dal riscrivere centinaia di gigabyte di vettori densi.</p>
<h3 id="Hybrid-search-can-fetch-only-the-columns-it-needs" class="common-anchor-header">La ricerca ibrida può recuperare solo le colonne di cui ha bisogno</h3><p>L’allineamento degli ID delle righe è anche ciò che rende la ricerca ibrida praticabile su formati di file ibridi.</p>
<p>Dopo che la ricerca ANN restituisce gli ID delle righe candidate, il sistema può recuperare solo i campi necessari per il risultato finale: didascalie, metadati, vettori, caratteristiche di riclassificazione o riferimenti agli oggetti.</p>
<p>Ad esempio, una query potrebbe richiedere:</p>
<pre><code translate="no">caption
embedding
video_uri
<button class="copy-code-btn"></button></code></pre>
<p>Tali campi potrebbero trovarsi in ColumnGroup diversi. Loon è in grado di individuare i file pertinenti in base all’intervallo di ID di riga, leggere gli intervalli di byte necessari e assemblare il risultato.</p>
<p>Senza l’allineamento degli ID di riga, i formati ibridi sarebbero semplicemente file separati affiancati l’uno all’altro. Con l’allineamento degli ID di riga, si comportano come un’unica raccolta logica.</p>
<h3 id="Packed-Reader-hides-the-split-from-the-upper-layer" class="common-anchor-header">Packed Reader nasconde la suddivisione al livello superiore</h3><p>Il componente di runtime che rende tutto questo utilizzabile è il Packed Reader.</p>
<p>Il livello superiore vede un flusso unificato di Arrow RecordBatch. A livello sottostante, i dati possono provenire da più ColumnGroups in diversi formati di file. Il Packed Reader nasconde tali differenze, allinea i dati in base agli intervalli di ID di riga e pianifica l’I/O su più file con un utilizzo controllato della memoria.</p>
<p>Supporta inoltre l’ <code translate="no">take</code> e diretta tramite ID di riga. Dato un insieme di ID di riga, individua i ColumnGroupFiles pertinenti, esegue letture per intervallo e restituisce i campi richiesti.</p>
<p>Per il flusso di lavoro video, una query ANN potrebbe richiedere l’ <code translate="no">caption</code>, l’ <code translate="no">embedding</code> e l’ <code translate="no">video_uri</code>. Il Packed Reader è in grado di recuperare il ColumnGroup scalare e il ColumnGroup vettoriale senza toccare colonne non correlate.</p>
<p>Questa è la differenza tra «file separati» e «una tabella con più layout fisici».</p>
<h2 id="Design-3-make-the-Manifest-the-source-of-truth" class="common-anchor-header">Progetto 3: rendere il Manifest la fonte di verità<button data-href="#Design-3-make-the-Manifest-the-source-of-truth" class="anchor-icon" translate="no">
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
    </button></h2><p>I formati di file ibridi definiscono come i dati vengono fisicamente memorizzati. L’allineamento degli ID delle righe determina come i ColumnGroup separati formino comunque un’unica tabella logica. Ma il sistema deve ancora rispondere a una domanda più ampia: <strong>quali file, log, statistiche, indici e riferimenti agli oggetti appartengono alla versione corrente del set di dati? Questo è il compito del Manifest.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_13_cd18b2da18.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Object-storage-directories-are-not-enough" class="common-anchor-header">Le directory di archiviazione degli oggetti non sono sufficienti</h3><p>L’object storage non è un catalogo di database. Una directory può contenere file vecchi, file nuovi, output di job falliti, file temporanei, log di eliminazione, file ancora referenziati da snapshot precedenti e file in attesa di pulizia. Il fatto che un file esista non significa che appartenga alla versione corrente del set di dati.</p>
<p>Un dataset Loon può essere organizzato in directory come:</p>
<pre><code translate="no">_metadata/
_data/
_delta/
_stats/
_index/
<button class="copy-code-btn"></button></code></pre>
<p>Ma la struttura delle directory non è la fonte di verità. Lo è il Manifest. I lettori non dovrebbero elencare le directory e dedurre lo stato dai file che si trovano casualmente presenti. Dovrebbero leggere il Manifest corrente e seguire la vista versionata che esso dichiara.</p>
<h3 id="The-Manifest-defines-one-versioned-view-of-the-dataset" class="common-anchor-header">Il Manifest definisce una visione versionata del set di dati</h3><p>Il Manifest definisce il set di dati in una determinata versione. Esso registra:</p>
<ul>
<li>quali ColumnGroups esistono</li>
<li>quali intervalli di ID di riga coprono</li>
<li>quale formato fisico utilizza ciascun ColumnGroup</li>
<li>dove si trovano i file</li>
<li>quali log di eliminazione sono attivi</li>
<li>quali statistiche sono disponibili</li>
<li>quali indici esistono</li>
<li>a quali blob esterni si fa riferimento</li>
<li>quali colonne e intervalli di righe coprono tali statistiche o indici</li>
</ul>
<p>Ogni aggiornamento scrive una nuova versione del Manifest. Un lettore che apre la versione N vede una visione stabile del set di dati alla versione N. Un autore può preparare la versione N+1 senza interferire con i lettori che stanno ancora utilizzando la versione N.</p>
<h3 id="The-Manifest-tracks-more-than-table-files" class="common-anchor-header">Il Manifest tiene traccia di più dei soli file delle tabelle</h3><p>In Loon, il corpo del Manifest è codificato con Apache Avro e organizzato in quattro sezioni principali.</p>
<ul>
<li>I ColumnGroups descrivono le colonne, i formati, i file e gli intervalli di ID delle righe.</li>
<li>I DeltaLogs descrivono le eliminazioni. Diversi tipi di eliminazione coprono diverse fonti di modifica, come le eliminazioni per chiave primaria da parte dei client, le eliminazioni posizionali derivanti dalla compattazione interna o le eliminazioni per uguaglianza da motori esterni.</li>
<li>Le statistiche (Stats) includono metadati di pianificazione quali i filtri Bloom, le statistiche BM25 e i valori min/max.</li>
<li>Gli indici descrivono il tipo di indice, i parametri, le colonne coperte e gli intervalli di ID delle righe. Ciò può includere indici vettoriali come HNSW o IVF, indici di testo, indici invertiti, indici bitmap e strutture correlate.</li>
</ul>
<p>È qui che Loon si differenzia da un manifesto di tabella tradizionale.</p>
<p>Un set di dati vettoriali deve tenere traccia non solo dei file di dati e delle partizioni, ma anche degli indici vettoriali, degli indici di testo, delle caratteristiche sparse, dei log di eliminazione, delle statistiche, dei riferimenti a oggetti esterni e degli intervalli di ID delle righe che li collegano.</p>
<h3 id="The-Manifest-must-be-writable-by-more-than-the-database" class="common-anchor-header">Il manifesto deve essere scrivibile da più soggetti oltre al database</h3><p>La parte più importante non è solo ciò che il Manifest contiene, ma chi può scriverlo.</p>
<ul>
<li>Se solo il database può scrivere il Manifest, questo rimane un metadato interno. Un metadato più pulito, ma comunque privato di un singolo motore.</li>
<li>Se i motori esterni possono generare nuovi ColumnGroup, statistiche e voci del Manifest, quest’ultimo diventa un’interfaccia di coordinamento.</li>
<li>Un job Spark, ad esempio, può effettuare il backfill di una colonna vettoriale sparsa. Scrive un nuovo ColumnGroup, registra la copertura delle righe e le statistiche, e esegue il commit di un nuovo Manifest. Le query online possono continuare a leggere la versione precedente durante l’esecuzione del job. Una volta che il commit va a buon fine, la nuova versione diventa visibile.</li>
</ul>
<p>Questo approccio è simile, nello spirito, a Iceberg e Delta Lake, ma il modello a oggetti è più ampio. Un dataset vettoriale deve tenere traccia di indici vettoriali, indici di testo, caratteristiche sparse, log di cancellazione, statistiche, riferimenti a blob e intervalli di ID di riga, non solo file di tabella e partizioni.</p>
<h3 id="Optimistic-commits-keep-version-updates-simple" class="common-anchor-header">I commit ottimistici semplificano gli aggiornamenti di versione</h3><p>Ogni commit scrive una nuova versione del Manifest. Un writer può creare nuovi contenuti basati sulla versione N, quindi tentare di scrivere un <code translate="no">manifest-{N+1}.avro</code>. La scrittura condizionale nell’object storage o la semantica di corrispondenza generazionale possono far fallire il commit se quella versione esiste già. Il writer può quindi riprovare con la versione più recente.</p>
<p>Ciò conferisce a Loon una concorrenza ottimistica senza costringere ogni aggiornamento a passare attraverso un percorso di coordinamento pesante e fortemente coerente. Senza un Manifest, l’archiviazione multiformato e multimotore finisce per ridursi a convenzioni di denominazione e riconciliazione manuale. Ciò può funzionare per piccoli set di dati, ma non per dati vettoriali su scala TB.</p>
<p>Il Manifest è ciò che trasforma file eterogenei in un set di dati che più sistemi possono leggere e aggiornare in modo sicuro.</p>
<h2 id="What-changes-for-users-when-storage-becomes-versioned" class="common-anchor-header">Cosa cambia per gli utenti quando l’archiviazione diventa versionata<button data-href="#What-changes-for-users-when-storage-becomes-versioned" class="anchor-icon" translate="no">
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
    </button></h2><p>Per gli sviluppatori di applicazioni, Loon non dovrebbe rappresentare un nuovo onere in termini di API.</p>
<p>Gli utenti dovrebbero continuare a lavorare con i concetti Milvus a loro familiari: collezioni, inserimenti, ricerca e ricerca ibrida. Non dovrebbero dover pensare a file Manifest, ColumnGroups, intervalli di ID di riga o layout dei file durante il normale sviluppo delle applicazioni.</p>
<p>Il cambiamento è a livello di fondo. Lo storage diventa più consapevole di come i set di dati di IA si evolvono effettivamente.</p>
<h3 id="Adding-a-new-embedding-should-not-move-the-old-data" class="common-anchor-header">L’aggiunta di un nuovo embedding non dovrebbe comportare lo spostamento dei dati precedenti</h3><p>In precedenza, l’aggiunta di un <code translate="no">embedding_v2</code> e a una collezione esistente richiedeva spesso l’esportazione dei dati, l’addestramento di un nuovo modello, la generazione di vettori e, successivamente, la reimportazione o l’aggiornamento in blocco della collezione tramite l’SDK. Questo percorso comporta un notevole carico operativo: tracciamento delle versioni, riprovazioni dei job falliti, ricostruzione degli indici, impatto sul servizio e controlli di coerenza.</p>
<p><strong>Con Loon, questo processo può ridursi a un’evoluzione dello schema più un nuovo commit del ColumnGroup.</strong> La nuova colonna di embedding può essere definita come un ColumnGroup fisico a sé stante, allineata in base all’ID della riga e resa visibile tramite il Manifest. La vecchia colonna di didascalia, la colonna dei metadati scalari e la colonna di embedding originale non devono essere spostate.</p>
<h3 id="Backfills-should-not-require-a-client-side-update-loop" class="common-anchor-header">I backfill non dovrebbero richiedere un ciclo di aggiornamento lato client</h3><p>Molti aggiornamenti dei dati di IA sono backfill. Un team potrebbe aggiungere vettori sparsi dopo che la ricerca ibrida è diventata importante. Potrebbe aggiungere caratteristiche di riclassificazione dopo l’addestramento di un nuovo modello. Potrebbe correggere le didascalie dopo una revisione umana. Potrebbe aggiungere tag di governance dopo un aggiornamento delle politiche.</p>
<p>In un layout tradizionale, queste modifiche avvengono spesso tramite aggiornamenti dell’SDK client o percorsi di scrittura esclusivamente sul database, anche quando i dati sono prodotti da Spark, Ray o un altro motore esterno.</p>
<p>Con Loon, i sistemi di elaborazione esterni possono generare nuovi ColumnGroups e confermarli tramite il Manifest. Il database non deve più essere l’unico punto di accesso per ogni riscrittura.</p>
<h3 id="Offline-analysis-should-not-require-another-copy-of-the-truth" class="common-anchor-header">L’analisi offline non dovrebbe richiedere un’altra copia dei dati di riferimento</h3><p>In precedenza, i team spesso esportavano una raccolta online in Parquet per la valutazione o l’analisi offline. Ciò crea due versioni dello stesso set di dati: la raccolta online e la copia di analisi. Una volta che le didascalie vengono corrette, gli embedding rigenerati, i log di eliminazione applicati o gli indici ricostruiti, il team deve verificare quale copia sia quella attuale.</p>
<p>Con un modello di archiviazione basato sul Manifest, i motori di analisi possono leggere la stessa vista del set di dati con versione del sistema di servizio. Possono proiettare solo le colonne di cui hanno bisogno, scansionare solo gli intervalli di righe rilevanti e lavorare su una versione dichiarata del set di dati invece che su uno snapshot esportato manualmente.</p>
<h3 id="Deletes-and-corrections-should-touch-only-what-changed" class="common-anchor-header">Le eliminazioni e le correzioni dovrebbero riguardare solo ciò che è cambiato</h3><p>Le eliminazioni, le correzioni delle didascalie, le rettifiche delle etichette e gli aggiornamenti di governance sono operazioni di routine nei set di dati di IA. Non dovrebbero costringere ogni colonna con vettori lunghi a seguire lo stesso percorso di riscrittura.</p>
<p>Con Loon, i log di cancellazione possono essere inizialmente trattati come cancellazioni logiche. Una successiva compattazione può ripulire i ColumnGroups interessati senza riscrivere dati non correlati. Se un campo di testo breve cambia, il livello di archiviazione non dovrebbe dover riscrivere centinaia di gigabyte di vettori densi solo perché condividono la stessa riga logica.</p>
<h3 id="External-engines-become-part-of-the-workflow-not-an-escape-hatch" class="common-anchor-header">I motori esterni diventano parte del flusso di lavoro, non una via di fuga</h3><p>Il cambiamento più significativo è che i motori esterni non vengono più considerati come sistemi esterni al database vettoriale.</p>
<p>Spark, Ray, i processi di valutazione, i sistemi di etichettatura e le pipeline di governance producono e modificano già gran parte dei dati. Il livello di archiviazione dovrebbe consentire loro di collaborare attorno a un'unica fonte di verità, anziché esportare, copiare e reimportare costantemente.</p>
<p>Questo è ciò che rende possibile una versione di Manifest. Offre al servizio online, all’analisi offline, ai processi di backfill e alla compattazione una visione condivisa del set di dati.</p>
<p>Questi aspetti possono sembrare dettagli relativi allo storage interno, ma influenzano la rapidità con cui i team possono iterare sui set di dati di IA. Ogni modifica al modello, backfill delle caratteristiche, correzione delle didascalie, filtro di qualità e ricostruzione dell’indice dipende dalla stessa domanda:<strong>«Il sistema può aggiornare il set di dati senza spostare i dati che non è necessario spostare?»</strong></p>
<p>Questo è il valore pratico del modello di archiviazione.</p>
<h2 id="Loon-is-available-in-Milvus-30-beta-and-Zilliz-Vector-Lakebase" class="common-anchor-header">Loon è disponibile nella versione beta di Milvus 3.0 e in Zilliz Vector Lakebase<button data-href="#Loon-is-available-in-Milvus-30-beta-and-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>Loon è disponibile nella <a href="https://milvus.io/docs/release_notes.md">versione beta di Milvus 3.0</a> e fa anche parte del livello di archiviazione di <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Zilliz Vector Lakebase</a>, la prossima evoluzione di Zilliz Cloud. Questa versione si concentra su tre aree principali:</p>
<ul>
<li><strong>Il Manifest.</strong> L’obiettivo è che le operazioni di scrittura, backfill, eliminazione, statistiche e aggiornamenti degli indici producano viste del set di dati con versione, che i lettori possano aprire in modo coerente. Per i lettori, ciò significa che una query può aprire una versione specifica del Manifest e visualizzare una vista stabile del set di dati. Per chi effettua scritture, ciò significa che i nuovi file di dati, i log di eliminazione, le statistiche o i file di indice possono essere preparati in anticipo e poi resi visibili tramite un commit con versione.</li>
<li><strong>Il supporto per ColumnGroup e i formati.</strong> Parquet supporta colonne scalari e compatibili con l’ecosistema. Vortex supporta modelli di accesso con un elevato utilizzo di vettori. Lance può essere integrato in modalità di sola lettura per garantire la compatibilità con i set di dati Lance esistenti.</li>
<li><strong>L’indice su Lake.</strong> Le statistiche scalari, gli indici di filtraggio e gli indici invertiti di testo possono partecipare alla pianificazione basata sul Manifest per intervallo di righe. Gli indici vettoriali nativi di Lake sono più complessi. HNSW e IVF hanno comportamenti diversi sull’object storage e, in particolare, HNSW è sensibile all’accesso casuale e alla località della cache. Non è possibile riutilizzare semplicemente un layout progettato per un SSD locale e aspettarsi lo stesso risultato.</li>
</ul>
<h3 id="There-is-still-work-ahead" class="common-anchor-header">C’è ancora del lavoro da fare</h3><ul>
<li><strong>I percorsi di scrittura esterni</strong> sono importanti perché Spark e Ray dovrebbero essere in grado di produrre ColumnGroups e commit Manifest senza costringere ogni backfill a passare attraverso un ciclo dell’SDK client.</li>
<li><strong>L’interoperabilità Lakehouse</strong> è importante perché molti team utilizzano già cataloghi e motori di query come <strong>Iceberg, Delta Lake, Trino, DuckDB e Athena.</strong> I dati vettoriali dovrebbero poter partecipare a quell’ecosistema senza perdere le prestazioni di ricerca vettoriale.</li>
<li><strong>Il layout degli indici</strong> è importante perché gli indici grafici e le strutture invertite presentano modelli di accesso diversi nell’object storage.</li>
<li><strong>La semantica degli oggetti di grandi dimensioni</strong> è importante perché i video non elaborati, i PDF, le immagini e i file audio richiedono una gestione dei riferimenti, un controllo delle versioni e un comportamento di eliminazione allineati al set di dati vettoriali derivato.</li>
</ul>
<p>Il comportamento esatto del rilascio, le impostazioni predefinite e il percorso di migrazione devono seguire <a href="https://docs.zilliz.com/docs/release-notes-2605">le note di rilascio</a> pertinenti di Milvus e <a href="https://docs.zilliz.com/docs/release-notes-2605">Zilliz Cloud</a>. La direzione dello storage, tuttavia, è chiara: i database vettoriali necessitano di una base versionata e nativa per i data lake al di sotto del livello di servizio.</p>
<h2 id="Try-Loon-under-Zilliz-Vector-Lakebase" class="common-anchor-header">Prova Loon su Zilliz Vector Lakebase<button data-href="#Try-Loon-under-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>Se il vostro stack attuale separa in sistemi diversi il serving online, l’analisi offline, i backfill e i flussi di lavoro relativi al data lake esterno, vale la pena dare un’occhiata a Zilliz Vector Lakebase. Potete provarlo su <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>. Le nuove registrazioni con indirizzo email aziendale ricevono 100 $ di crediti gratuiti. Siete inoltre invitati a <a href="https://zilliz.com/contact-sales">contattarci per discutere</a> del vostro caso d’uso.</p>
<p>Puoi inoltre seguire il <a href="https://milvus.io/docs/release_notes.md">rilascio di Milvus 3.0</a> per vedere come si evolve Loon nel motore open source.</p>
<p><strong>Zilliz Vector Lakebase offre:</strong></p>
<ul>
<li>Servizio a più livelli per diversi compromessi tra prestazioni in tempo reale e costi</li>
<li>Ricerca on-demand per carichi di lavoro su larga scala o esplorativi senza risorse di calcolo sempre attive</li>
<li>Ricerca in data lake esterni, per poter indicizzare ed effettuare ricerche direttamente sui dati esistenti nei data lake</li>
<li>Ricerca a spettro completo su vettori, testo, JSON e dati geospaziali, con recupero ibrido e riclassificazione</li>
<li>Archiviazione unificata nativa per i data lake basata su Vortex, un formato aperto progettato per letture casuali più veloci e a basso costo su dati con un'elevata densità di vettori</li>
</ul>
