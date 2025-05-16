---
id: >-
  minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md
title: >-
  MinHash LSH in Milvus: l'arma segreta per combattere i duplicati nei dati di
  formazione LLM
author: 'Li Liu, Yaya Cheng'
date: 2025-05-16T00:00:00.000Z
desc: >-
  MinHash LSH in Milvus 2.6 offre una soluzione efficiente per la deduplicazione
  di enormi insiemi di dati di addestramento LLM, con un'elaborazione due volte
  più veloce e un risparmio sui costi di 3 volte rispetto ai metodi
  tradizionali.
cover: assets.zilliz.com/Chat_GPT_Image_May_16_2025_09_46_39_PM_1f3290ce5e.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'MinHash LSH, Locality Sensitive Hashing, Milvus, LLM training data'
meta_title: >
  MinHash LSH in Milvus: The Secret Weapon for Fighting Duplicates in LLM
  Training Data
origin: >-
  https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md
---
<p>I modelli linguistici di grandi dimensioni (LLM) hanno trasformato il panorama dell'intelligenza artificiale grazie alla loro capacità di scrivere codice, creare contenuti e risolvere problemi complessi. Tuttavia, questi potenti modelli richiedono enormi quantità di dati di alta qualità per alimentare il loro addestramento.</p>
<p>La sfida è che i dati di addestramento grezzi spesso contengono una notevole ridondanza. È come insegnare a un bambino ripetendo sempre le stesse lezioni e saltando altri argomenti importanti. Una grande azienda di intelligenza artificiale si è rivolta a noi proprio con questo problema: stava costruendo un nuovo modello linguistico ambizioso, ma aveva difficoltà a deduplicare decine di miliardi di documenti. I metodi di corrispondenza tradizionali non erano in grado di gestire questo volume e gli strumenti di deduplicazione specializzati richiedevano enormi risorse computazionali, rendendoli economicamente non convenienti.</p>
<p>Per risolvere questo problema, la nostra soluzione è: l'indicizzazione MinHash LSH (Locality Sensitive Hashing), che sarà disponibile in Milvus 2.6. In questo articolo analizzeremo come MinHash LSH risolve in modo efficiente il problema della deduplicazione dei dati per la formazione LLM.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Chat_GPT_Image_May_16_2025_09_46_39_PM_1f3290ce5e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Data-Deduplication-Why-It-Matters-for-LLM-Training" class="common-anchor-header">Deduplicazione dei dati: Perché è importante per la formazione LLM<button data-href="#Data-Deduplication-Why-It-Matters-for-LLM-Training" class="anchor-icon" translate="no">
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
    </button></h2><p>Dati diversificati e di alta qualità sono essenziali per l'addestramento di potenti LLM. Quando nei dati di addestramento compaiono contenuti duplicati, si creano diversi problemi significativi:</p>
<ul>
<li><p><strong>Spreco di risorse:</strong> I dati ridondanti aumentano i tempi di formazione, i costi e il consumo di energia.</p></li>
<li><p><strong>Riduzione delle prestazioni:</strong> I modelli possono adattarsi eccessivamente ai contenuti ripetuti, limitando la loro capacità di generalizzare alle nuove informazioni.</p></li>
<li><p><strong>Effetto memorizzazione:</strong> I contenuti duplicati aumentano la possibilità che i modelli memorizzino e riproducano testualmente un testo specifico. Potrebbe anche portare a fughe di notizie sulla privacy o a problemi di copyright.</p></li>
<li><p><strong>Valutazioni fuorvianti:</strong> Le duplicazioni tra i set di addestramento e di test possono accidentalmente gonfiare le metriche delle prestazioni.</p></li>
</ul>
<p>Esistono tre approcci principali per trovare e rimuovere i duplicati:</p>
<ul>
<li><p><strong>Corrispondenza esatta:</strong> identifica i duplicati identici tramite hashing.</p></li>
<li><p><strong>Corrispondenza approssimativa:</strong> trova i quasi-duplicati utilizzando algoritmi come MinHash LSH e la somiglianza di Jaccard.</p></li>
<li><p><strong>Corrispondenza semantica:</strong> identifica i contenuti con un significato simile utilizzando embeddings vettoriali.</p></li>
</ul>
<p>Con corpora di pre-addestramento che raggiungono i terabyte o addirittura i petabyte, i metodi tradizionali di corrispondenza esatta, come i confronti a coppie, sono computazionalmente inapplicabili. La deduplicazione semantica aggiunge un overhead significativo utilizzando modelli di embedding per generare vettori. Abbiamo bisogno di metodi approssimativi più intelligenti, come <strong>MinHash LSH, che</strong>bilancino il richiamo e la precisione mantenendo i costi gestibili, rendendo pratica la deduplicazione su larga scala.</p>
<h2 id="MinHash-LSH-Efficiently-Detecting-Near-Duplicates-in-Massive-Datasets" class="common-anchor-header">MinHash LSH: rilevare in modo efficiente i quasi duplicati in insiemi di dati di grandi dimensioni<button data-href="#MinHash-LSH-Efficiently-Detecting-Near-Duplicates-in-Massive-Datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>Per trovare i quasi duplicati in un oceano di dati di formazione, abbiamo bisogno di un algoritmo di corrispondenza approssimativa che sia efficiente e preciso. MinHash LSH (Locality Sensitive Hashing) è un ottimo strumento per raggiungere questo obiettivo. Analizziamo passo per passo questo termine apparentemente complesso.</p>
<h3 id="Step-1-Representing-Documents-with-MinHash" class="common-anchor-header">Passo 1: Rappresentare i documenti con MinHash</h3><p>Per prima cosa, abbiamo bisogno di un modo per misurare la somiglianza dei documenti. L'approccio standard utilizza la somiglianza di Jaccard:</p>
<p><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mi>J</mi><mo stretchy="false">(</mo><mi>A</mi><mo separator="true">,</mo><mi>B</mi><mo stretchy="false">)</mo><mo>=</mo></mrow><annotation encoding="application/x-tex">∣A∩B∣∣A∪B∣J(A,B) = \frac{|A\cap B|}{|A \cup B|}</annotation></semantics></math></span></span></span><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="katex-display"><span class="katex">J<span class="katex-html" aria-hidden="true"><span class="base"><span class="mopen">(</span><span class="mord mathnormal">A</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span></span></span> B<span class="katex-html" aria-hidden="true"><span class="base"><span class="mclose">)</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span> =</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="katex-display"><span class="katex"></span></span><span class="strut" style="height:2.363em;vertical-align:-0.936em;"></span> <span class="katex-display"><span class="katex"></span></span><span class="mopen nulldelimiter"></span> <span class="katex-display"><span class="katex"></span></span><span class="pstrut" style="height:3em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-2.314em;"><span class="mord"><span class="mord mathnormal">∣A</span></span></span></span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-2.314em;"><span class="mord"><span class="mbin">∪</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord">B∣</span></span></span></span></span></span></span></span></span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span class="katex-display"><span class="katex"></span></span><span class="pstrut" style="height:3em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-3.677em;"><span class="mord"><span class="mord mathnormal">∣A</span></span></span></span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-3.677em;"><span class="mord"><span class="mbin">∩</span><span class="mspace" style="margin-right:0.2222em;"></span></span></span></span><span class="vlist-s">B∣</span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.936em;"><span></span></span></span><span class="mclose nulldelimiter"></span></p>
<p>Questa formula misura la sovrapposizione tra il documento A e il documento B - in particolare, il rapporto tra gli elementi condivisi e il totale degli elementi unici. Un valore più alto significa che i documenti sono più simili.</p>
<p>Tuttavia, il calcolo diretto di questo valore per miliardi di coppie di documenti richiede molte risorse e anni. MinHash crea "impronte digitali" (firme) compatte che preservano le relazioni di somiglianza e rendono i confronti molto più veloci.</p>
<ol>
<li><strong>Shingling:</strong> Suddivide ogni documento in sequenze sovrapposte di parole o caratteri (k-shingles). Ad esempio, la frase "Amo la ricerca vettoriale" con k=3 (per parola) produce: {"Amo il vettore", "Amo la ricerca vettoriale"}.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/shingling_858ad58efa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li><strong>MinHashing:</strong> applica più funzioni di hash a ogni serie di tegole e registra il valore minimo di hash di ciascuna funzione. In questo modo si ottiene un vettore di firme per ogni documento.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minhash_041003210a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Quando si calcola la somiglianza, la probabilità che i valori hash si allineino nelle stesse posizioni nelle firme MinHash di due documenti (che corrisponde alla distanza di Jaccard di queste firme) fornisce una stretta approssimazione della somiglianza di Jaccard dei loro set di shingle originali. Questo ci permette di stimare efficacemente la somiglianza dei documenti senza dover confrontare direttamente i testi originali più grandi; possiamo invece analizzare le loro firme MinHash compatte.</p>
<p>Il principio MinHash prevede l'utilizzo della parola con il valore hash più piccolo per rappresentare l'intero documento, migliorando l'accuratezza grazie all'incorporazione di funzioni hash aggiuntive. È probabile che le modifiche minori alle parole vengano trascurate, poiché in genere non influiscono sul valore minimo dell'hash, mentre le modifiche più sostanziali tendono ad alterare il valore dell'hash e sono più facilmente rilevabili. Questo metodo può essere visto come un min-pooling di valori hash tra le varie parole. Oltre a MinHash, per la generazione delle firme dei documenti sono disponibili alternative come SimHash, che però non verranno discusse in questa sede.</p>
<h3 id="Step-2-Identifying-Similar-Documents-via-LSH" class="common-anchor-header">Fase 2: identificazione di documenti simili tramite LSH</h3><p>Anche con le firme MinHash compatte, il confronto di ogni coppia tra milioni o miliardi di documenti rimane computazionalmente costoso. È qui che entra in gioco il <strong>Locality Sensitive Hashing (LSH)</strong>.</p>
<p>L'idea chiave dell'LSH è quella di utilizzare funzioni di hash che <strong>causano intenzionalmente collisioni: è</strong>più probabile che elementi <strong>simili</strong>vengano inseriti nello stesso bucket, mentre quelli dissimili non lo sono. Questo è l'opposto dell'hashing tradizionale, che mira a evitare le collisioni.</p>
<p>Per MinHash, una strategia LSH popolare è la <strong>tecnica del banding</strong>:</p>
<ol>
<li><p><strong>Banding</strong>: Dividere ogni firma MinHash (un vettore di lunghezza <em>N</em>) in <em>b</em> bande, ciascuna con <em>r</em> righe<em>(N = b × r</em>).</p></li>
<li><p><strong>Hashing delle bande:</strong> Eseguire l'hash di ogni banda (un sottovettore di <em>r</em> valori) in un bucket utilizzando una funzione hash standard.</p></li>
<li><p><strong>Coppie candidate:</strong> Se due documenti condividono un bucket in <strong>una qualsiasi</strong> banda, vengono segnalati come potenziali corrispondenze.</p></li>
</ol>
<p>Regolando il numero di bande (b) e il numero di righe per banda ®, è possibile controllare il compromesso tra richiamo, precisione ed efficienza della ricerca.</p>
<p>L'idea chiave è che i documenti molto simili avranno molti valori hash corrispondenti nelle loro firme MinHash. Quando queste firme vengono suddivise in bande, anche una sola banda con tutti i valori corrispondenti è sufficiente per collocare due documenti nello stesso bucket. Quanto più simili sono i documenti, tanto più alta è la probabilità che ciò avvenga in almeno una banda, consentendo a LSH di far emergere in modo efficiente le coppie candidate senza confrontare in modo esaustivo tutte le firme.</p>
<p>In breve, <strong>MinHash + LSH</strong> consente una deduplicazione approssimativa scalabile: MinHash comprime i documenti in firme compatte e LSH restringe in modo efficiente lo spazio di ricerca raggruppando le corrispondenze probabili. È come individuare i gemelli in mezzo alla folla: prima si fa una rapida istantanea delle caratteristiche di tutti (MinHash), si raggruppano i sosia (LSH), quindi si ispezionano da vicino i gruppi più piccoli per individuare i duplicati effettivi.</p>
<h2 id="Integrating-MinHash-LSH-in-Milvus-26" class="common-anchor-header">Integrazione di MinHash LSH in Milvus 2.6<button data-href="#Integrating-MinHash-LSH-in-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>L'integrazione di MinHash LSH in Milvus 2.6 è stata dettata da un'esigenza reale. Come accennato in precedenza, un utente di Milvus - una delle aziende leader nel settore LLM - si è rivolto a noi con una sfida: deduplicare in modo efficiente enormi volumi di dati testuali per il pre-training LLM.</p>
<p>Le pipeline di deduplicazione tradizionali si affidano in genere a strumenti esterni disaccoppiati dai sistemi di archiviazione e recupero, richiedendo costosi trasferimenti di dati tra i vari componenti. Questo flusso di lavoro frammentato aumenta i costi operativi e impedisce il pieno utilizzo delle risorse informatiche distribuite.</p>
<p>Riconoscendo i punti di forza di Milvus nella gestione di dati vettoriali ad alto rendimento, è emersa un'idea naturale: <strong><em>Cosa succederebbe se MinHash LSH fosse integrato in Milvus in modo nativo, rendendo la deduplicazione approssimativa una funzione di prima classe del database?</em></strong></p>
<p>Questo approccio consente un flusso di lavoro completo, dalla deduplicazione al recupero semantico, all'interno di Milvus, semplificando le operazioni MLO e sfruttando la sua scalabilità e l'API unificata. Insieme al nostro partner, abbiamo ottimizzato MinHash LSH per l'architettura cloud-native di Milvus, ottenendo una soluzione veloce e scalabile per la deduplicazione su larga scala.</p>
<h3 id="Core-capabilities-in-Milvus-26-include" class="common-anchor-header">Le funzionalità principali di Milvus 2.6 includono:</h3><ul>
<li><p><strong>Indicizzazione MinHash LSH nativa:</strong> Implementa la tecnica di banding standard per LSH e supporta il re-ranking Jaccard opzionale per migliorare il richiamo. Fornisce implementazioni sia in-memory che basate su mmap per garantire la flessibilità dei diversi carichi di lavoro.</p></li>
<li><p><strong>Integrazione API senza problemi:</strong> Gli utenti possono definire campi vettoriali MinHash, costruire indici <code translate="no">MINHASH_LSH</code>, inserire dati di firma ed eseguire ricerche di similarità approssimativa utilizzando l'SDK standard e le API dichiarative di Milvus.</p></li>
<li><p><strong>Distribuito e scalabile:</strong> Costruita sull'architettura cloud-native di Milvus, la funzione supporta la scalabilità orizzontale per grandi insiemi di dati e l'elaborazione ad alto rendimento.</p></li>
</ul>
<p>Questa integrazione ha dato risultati impressionanti. Eseguendo MinHash LSH su Milvus (Zilliz Cloud) completamente gestito, abbiamo aiutato questo utente a deduplicare <strong>10 miliardi di documenti</strong> in modo efficiente. Rispetto al precedente approccio basato su MapReduce, la nuova soluzione ha <strong>più che raddoppiato la velocità di elaborazione</strong> e ha consentito un <strong>risparmio sui costi di 3-5 volte</strong>, grazie all'indicizzazione e all'esecuzione ottimizzata delle query di Milvus.</p>
<h2 id="Hands-On-Deduplicating-LLM-Datasets-Using-Milvus" class="common-anchor-header">Operazioni pratiche: deduplicazione di insiemi di dati LLM con Milvus<button data-href="#Hands-On-Deduplicating-LLM-Datasets-Using-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Rimbocchiamoci le maniche e usiamo MinHash LSH in Milvus 2.6 per eseguire una deduplicazione approssimativa su scala.</p>
<h3 id="Prerequisite-Generating-MinHash-Signatures" class="common-anchor-header">Prerequisiti: Generazione delle firme MinHash</h3><p>Milvus gestisce l'indicizzazione e la ricerca di firme MinHash <strong>pre-generate</strong>. È necessario generarle durante la preelaborazione utilizzando strumenti come <code translate="no">datasketch</code> in Python o un'implementazione personalizzata. I passaggi tipici sono:</p>
<ol>
<li><p>Leggere i documenti grezzi</p></li>
<li><p>Scremare (tokenizzare o dividere in pezzi) ogni documento</p></li>
<li><p>Applicare funzioni hash multiple per generare una firma MinHash (per esempio, un array uint64 di dimensione 128).</p></li>
</ol>
<pre><code translate="no"><span class="hljs-keyword">from</span> datasketch <span class="hljs-keyword">import</span> MinHash

text = <span class="hljs-string">&quot;example text for minhash signature&quot;</span>
tokens = text.lower().split()  <span class="hljs-comment"># Step 1 &amp; 2: preprocess + tokenize/shingle</span>
mh = MinHash(num_perm=<span class="hljs-number">128</span>)     <span class="hljs-comment"># Step 3: initialize MinHash</span>
<span class="hljs-keyword">for</span> token <span class="hljs-keyword">in</span> tokens:
    mh.update(token.encode(<span class="hljs-string">&#x27;utf-8&#x27;</span>))  <span class="hljs-comment"># Add shingles to MinHash</span>
signature = mh.hashvalues  <span class="hljs-comment"># This is your MinHash signature (128-dimensional)</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-1-Create-a-Schema-in-Milvus" class="common-anchor-header">Passo 1: Creare uno schema in Milvus</h3><p>È necessario creare una collezione Milvus per memorizzare le firme MinHash e gli ID dei documenti corrispondenti.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> DataType
MILVUS_URI = <span class="hljs-string">&quot;localhost:19530&quot;</span>
COLLECTION_NAME = <span class="hljs-string">&quot;llm_data_dedup_minhash&quot;</span>
MINHASH_DIM = <span class="hljs-number">128</span>
MINHASH_BIT_WIDTH = <span class="hljs-number">64</span> <span class="hljs-comment"># Assuming 64-bit hash values</span>

<span class="hljs-comment"># Load data from NPY file</span>
base = np.load(<span class="hljs-string">&#x27;minhash_vectors.npy&#x27;</span>)
ids = [<span class="hljs-built_in">str</span>(i) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(base.shape[<span class="hljs-number">0</span>])]  <span class="hljs-comment"># Generate string IDs</span>

client = MilvusClient(uri=MILVUS_URI)
<span class="hljs-comment"># Check and drop existing collection if needed</span>
<span class="hljs-keyword">if</span> collection_name <span class="hljs-keyword">in</span> client.list_collections():
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection <span class="hljs-subst">{collection_name}</span> exists, dropping it...&quot;</span>)
    client.drop_collection(collection_name)
<span class="hljs-comment"># Create collection schema</span>
schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)

schema.add_field(field_name=<span class="hljs-string">&quot;input_id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;minhash&quot;</span>, datatype=DataType.BINARY_VECTOR, dim=MINHASH_DIM * MINHASH_BIT_WIDTH)
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">200</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-the-MINHASHLSH-Index-and-Collection" class="common-anchor-header"><strong>Passo 2: Creare l'indice e la raccolta MINHASH_LSH</strong></h3><p>Questo è il passo fondamentale. Occorre specificare JACCARD come tipo di metrica e configurare i parametri relativi a LSH.</p>
<pre><code translate="no">INDEX_FIELD_NAME = <span class="hljs-string">&quot;minhash_signature&quot;</span>
<span class="hljs-comment"># Metric type, should be JACCARD for MinHash LSH</span>
METRIC_TYPE = <span class="hljs-string">&quot;MHJACCARD&quot;</span>
INDEX_TYPE = <span class="hljs-string">&quot;MINHASH_LSH&quot;</span>
MINHASH_DIM = <span class="hljs-number">128</span>
MINHASH_BIT_WIDTH = <span class="hljs-number">64</span> <span class="hljs-comment"># Assuming 64-bit hash values</span>

index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name=INDEX_FIELD_NAME,
    index_type=INDEX_TYPE,
    metric_type=METRIC_TYPE,
    params={
        <span class="hljs-comment"># LSH-specific parameters might be configured here, e.g.:</span>
        <span class="hljs-comment"># &quot;band&quot;: 32, # Hypothetical parameter: number of bands</span>
        <span class="hljs-comment"># &quot;element_bit_width&quot;: 64 # Bit width of minhash values</span>
    }
)
<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=collection_name,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>Una nota sulla regolazione dei parametri: L'efficacia di MinHash LSH dipende fortemente dalla scelta dei parametri. Ad esempio, il numero di funzioni hash utilizzate durante la generazione della firma MinHash (cioè <code translate="no">MINHASH_DIM</code>) influisce sulla precisione e sulle dimensioni della firma. Nella fase LSH, il numero di bande (<code translate="no">num_bands</code>) e le righe per banda determinano l'intervallo di sensibilità della soglia di somiglianza e l'equilibrio tra richiamo e precisione. Gli utenti devono sperimentare e regolare con precisione in base alle caratteristiche del proprio set di dati e ai requisiti di deduplicazione. Spesso si tratta di un processo iterativo.</p>
<h3 id="Step-3-Insert-MinHash-Signatures" class="common-anchor-header"><strong>Fase 3: Inserire le firme MinHash</strong></h3><p>Supponiamo di avere un lotto di documenti e le relative firme MinHash.</p>
<pre><code translate="no"><span class="hljs-comment"># Insert data in batches</span>
batch_size = <span class="hljs-number">2000</span>
total_records = base.shape[<span class="hljs-number">0</span>]
num_batches = (total_records + batch_size - <span class="hljs-number">1</span>) // batch_size

<span class="hljs-keyword">for</span> batch_idx <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(num_batches):
    start = batch_idx * batch_size
    end = <span class="hljs-built_in">min</span>((batch_idx + <span class="hljs-number">1</span>) * batch_size, total_records)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserting batch <span class="hljs-subst">{batch_idx + <span class="hljs-number">1</span>}</span>/<span class="hljs-subst">{num_batches}</span> (records <span class="hljs-subst">{start}</span>-<span class="hljs-subst">{end}</span>)&quot;</span>)
    
    <span class="hljs-comment"># Prepare batch data</span>
    batch_data = [{
        <span class="hljs-string">&quot;input_id&quot;</span>: i,
        <span class="hljs-string">&quot;minhash&quot;</span>: base[i].tobytes(),
        <span class="hljs-string">&quot;id&quot;</span>: ids[i]
    } <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(start, end)]
    
    <span class="hljs-comment"># Insert batch</span>
    client.insert(collection_name, batch_data)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Data insertion complete&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Search-for-Near-Duplicates" class="common-anchor-header">Fase 5: Ricerca di quasi duplicati</h3><p>Utilizzare la firma MinHash di un documento per cercare documenti simili nella raccolta.</p>
<pre><code translate="no"><span class="hljs-comment"># Perform search</span>
search_vectors = [vec.tobytes() <span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> base[:<span class="hljs-number">10</span>]]
results = client.search(
    collection_name, 
    data=search_vectors, 
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: METRIC_TYPE, <span class="hljs-string">&quot;params&quot;</span>: search_params_lsh},
    limit=<span class="hljs-number">1</span>, 
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>])

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results:&quot;</span>)
<span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Query <span class="hljs-subst">{i}</span>:&quot;</span>)
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> result:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  - ID: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, Distance: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Post-Processing-and-Clustering" class="common-anchor-header">Fase 6: post-elaborazione e raggruppamento</h3><p>I risultati restituiti sono <strong>candidati quasi duplicati</strong>. Per formare gruppi di deduplicazione completi, è possibile applicare tecniche di clustering come <strong>Union-Find</strong> alle coppie candidate. Ogni gruppo risultante rappresenta un insieme di duplicati; conservare un documento rappresentativo e archiviare o rimuovere gli altri.</p>
<h2 id="Conclusion" class="common-anchor-header"><strong>Conclusione</strong><button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>MinHash LSH in Milvus 2.6 è un balzo in avanti nell'elaborazione dei dati AI. Quella che era nata come soluzione per la deduplicazione dei dati LLM ora apre le porte a casi d'uso più ampi: pulizia dei contenuti web, gestione dei cataloghi, rilevamento del plagio e altro ancora.</p>
<p>Se avete un caso d'uso simile, contattateci su Milvus Discord per iscrivervi a un incontro in orario d'ufficio.</p>
