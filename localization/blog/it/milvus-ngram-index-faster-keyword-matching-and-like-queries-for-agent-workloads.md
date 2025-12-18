---
id: >-
  milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md
title: >-
  Presentazione dell'indice Ngram di Milvus: Corrispondenza di parole chiave e
  query LIKE più veloci per i carichi di lavoro degli agenti
author: Chenjie Tang
date: 2025-12-16T00:00:00.000Z
cover: assets.zilliz.com/Ngram_Index_cover_9e6063c638.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Ngram Index, n-gram search, LIKE queries, full-text search'
meta_title: >
  Milvus Ngram Index: Faster Keyword Matching and LIKE Queries for Agent
  Workloads
desc: >-
  Scoprite come l'indice Ngram di Milvus accelera le query LIKE trasformando la
  corrispondenza delle sottostringhe in efficienti ricerche di n-grammi, con
  prestazioni 100 volte superiori.
origin: >-
  https://milvus.io/blog/milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md
---
<p>Nei sistemi ad agenti, il <strong>recupero del contesto</strong> è un elemento fondamentale dell'intera pipeline, che fornisce la base per il ragionamento, la pianificazione e l'azione a valle. La ricerca vettoriale aiuta gli agenti a recuperare un contesto semanticamente rilevante, che cattura l'intento e il significato in insiemi di dati grandi e non strutturati. Tuttavia, la rilevanza semantica da sola spesso non è sufficiente. Le pipeline di agenti si affidano anche alla ricerca full-text per rispettare i vincoli di parole chiave esatte, come nomi di prodotti, chiamate di funzioni, codici di errore o termini giuridicamente significativi. Questo strato di supporto garantisce che il contesto recuperato non solo sia pertinente, ma soddisfi anche esplicitamente i requisiti testuali.</p>
<p>I carichi di lavoro reali riflettono costantemente questa esigenza:</p>
<ul>
<li><p>Gli assistenti all'assistenza clienti devono trovare conversazioni che menzionano un prodotto o un ingrediente specifico.</p></li>
<li><p>I copiloti di codifica cercano snippet contenenti il nome esatto di una funzione, una chiamata API o una stringa di errore.</p></li>
<li><p>Gli agenti legali, medici e accademici filtrano i documenti alla ricerca di clausole o citazioni che devono apparire alla lettera.</p></li>
</ul>
<p>Tradizionalmente, i sistemi si occupano di questo aspetto con l'operatore SQL <code translate="no">LIKE</code>. Una query come <code translate="no">name LIKE '%rod%'</code> è semplice e ampiamente supportata, ma in condizioni di elevata concorrenza e di grandi volumi di dati, questa semplicità comporta notevoli costi in termini di prestazioni.</p>
<ul>
<li><p><strong>Senza un indice</strong>, una query <code translate="no">LIKE</code> scansiona l'intero archivio di contesto e applica la corrispondenza dei pattern riga per riga. Con milioni di record, anche una singola query può richiedere secondi, troppo lenti per le interazioni in tempo reale con gli agenti.</p></li>
<li><p><strong>Anche con un indice invertito convenzionale</strong>, i modelli jolly come <code translate="no">%rod%</code> rimangono difficili da ottimizzare perché il motore deve comunque attraversare l'intero dizionario ed eseguire la corrispondenza dei modelli su ogni voce. L'operazione evita le scansioni di riga, ma rimane fondamentalmente lineare, con miglioramenti solo marginali.</p></li>
</ul>
<p>Questo crea una chiara lacuna nei sistemi di reperimento ibridi: la ricerca vettoriale gestisce in modo efficiente la rilevanza semantica, ma il filtraggio delle parole chiave esatte diventa spesso la fase più lenta della pipeline.</p>
<p>Milvus supporta in modo nativo la ricerca ibrida vettoriale e full-text con filtraggio dei metadati. Per risolvere i limiti della corrispondenza delle parole chiave, Milvus introduce l'<a href="https://milvus.io/docs/ngram.md"><strong>indice Ngram</strong></a>, che migliora le prestazioni di <code translate="no">LIKE</code> dividendo il testo in piccole sottostringhe e indicizzandole per una ricerca efficiente. Questo riduce drasticamente la quantità di dati esaminati durante l'esecuzione delle query, fornendo query <code translate="no">LIKE</code> <strong>da decine a centinaia di volte più veloci</strong> in carichi di lavoro agenziali reali.</p>
<p>Il resto del post illustra il funzionamento dell'indice Ngram in Milvus e ne valuta le prestazioni in scenari reali.</p>
<h2 id="What-Is-the-Ngram-Index" class="common-anchor-header">Cos'è l'indice Ngram?<button data-href="#What-Is-the-Ngram-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>Nei database, il filtraggio del testo viene comunemente espresso con <strong>SQL</strong>, il linguaggio di interrogazione standard utilizzato per recuperare e gestire i dati. Uno degli operatori di testo più utilizzati è <code translate="no">LIKE</code>, che supporta la corrispondenza di stringhe basata su modelli.</p>
<p>Le espressioni LIKE possono essere raggruppate in quattro tipi di pattern comuni, a seconda di come vengono utilizzati i caratteri jolly:</p>
<ul>
<li><p><strong>Corrispondenza prefissata</strong> (<code translate="no">name LIKE '%rod%'</code>): Corrisponde ai record in cui la sottostringa asta appare in qualsiasi punto del testo.</p></li>
<li><p><strong>Corrispondenza di prefisso</strong> (<code translate="no">name LIKE 'rod%'</code>): Corrisponde ai record il cui testo inizia con rod.</p></li>
<li><p><strong>Corrispondenza di suffisso</strong> (<code translate="no">name LIKE '%rod'</code>): Corrisponde ai record il cui testo termina con rod.</p></li>
<li><p><strong>Corrispondenza con caratteri jolly</strong> (<code translate="no">name LIKE '%rod%aab%bc_de'</code>): Combina condizioni multiple di sottostringa (<code translate="no">%</code>) con caratteri jolly singoli (<code translate="no">_</code>) in un unico schema.</p></li>
</ul>
<p>Sebbene questi modelli differiscano per aspetto ed espressività, l'<strong>indice Ngram</strong> di Milvus li accelera tutti utilizzando lo stesso approccio di base.</p>
<p>Prima di costruire l'indice, Milvus divide ogni valore testuale in brevi sottostringhe sovrapposte di lunghezza fissa, note come <em>n-grammi</em>. Ad esempio, quando n = 3, la parola <strong>"Milvus"</strong> viene scomposta nei seguenti 3-grammi: <strong>"Mil",</strong> <strong>"ilv",</strong> <strong>"lvu"</strong> e <strong>"vus".</strong> Ogni n-gramma viene quindi memorizzato in un indice invertito che mappa la sottostringa con l'insieme degli ID dei documenti in cui compare. Al momento dell'interrogazione, le condizioni di <code translate="no">LIKE</code> vengono tradotte in combinazioni di ricerche di n-grammi, consentendo a Milvus di filtrare rapidamente la maggior parte dei record non corrispondenti e di valutare il modello rispetto a un insieme di candidati molto più ridotto. In questo modo si trasformano le costose scansioni di stringhe in efficienti interrogazioni basate su indici.</p>
<p>Due parametri controllano come viene costruito l'indice Ngram: <code translate="no">min_gram</code> e <code translate="no">max_gram</code>. Insieme, definiscono la gamma di lunghezze delle sottostringhe che Milvus genera e indicizza.</p>
<ul>
<li><p><strong><code translate="no">min_gram</code></strong>: La lunghezza della sottostringa più breve da indicizzare. In pratica, questo parametro stabilisce anche la lunghezza minima della sottostringa della query che può beneficiare dell'indice Ngram.</p></li>
<li><p><strong><code translate="no">max_gram</code></strong>: La lunghezza della sottostringa più lunga da indicizzare. Al momento dell'interrogazione, determina anche la dimensione massima della finestra utilizzata quando si dividono le stringhe di query più lunghe in n-grammi.</p></li>
</ul>
<p>Indicizzando tutte le sottostringhe contigue di lunghezza compresa tra <code translate="no">min_gram</code> e <code translate="no">max_gram</code>, Milvus stabilisce una base coerente ed efficiente per accelerare tutti i tipi di pattern <code translate="no">LIKE</code> supportati.</p>
<h2 id="How-Does-the-Ngram-Index-Work" class="common-anchor-header">Come funziona l'indice Ngram?<button data-href="#How-Does-the-Ngram-Index-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus implementa l'indice Ngram in un processo a due fasi:</p>
<ul>
<li><p><strong>Costruire l'indice:</strong> Generare n-grammi per ogni documento e costruire un indice invertito durante l'ingestione dei dati.</p></li>
<li><p><strong>Accelerare le query:</strong> Utilizzare l'indice per restringere la ricerca a un piccolo insieme di candidati, quindi verificare le corrispondenze esatte di <code translate="no">LIKE</code> su tali candidati.</p></li>
</ul>
<p>Un esempio concreto facilita la comprensione di questo processo.</p>
<h3 id="Phase-1-Build-the-index" class="common-anchor-header">Fase 1: creazione dell'indice</h3><p><strong>Decomporre il testo in n-grammi:</strong></p>
<p>Supponiamo di indicizzare il testo <strong>"Apple"</strong> con le seguenti impostazioni:</p>
<ul>
<li><p><code translate="no">min_gram = 2</code></p></li>
<li><p><code translate="no">max_gram = 3</code></p></li>
</ul>
<p>In base a questa impostazione, Milvus genera tutte le sottostringhe contigue di lunghezza 2 e 3:</p>
<ul>
<li><p>2-grammi: <code translate="no">Ap</code>, <code translate="no">pp</code>, <code translate="no">pl</code>, <code translate="no">le</code></p></li>
<li><p>3-grammi: <code translate="no">App</code>, <code translate="no">ppl</code>, <code translate="no">ple</code></p></li>
</ul>
<p><strong>Costruire un indice invertito:</strong></p>
<p>Consideriamo ora un piccolo set di dati di cinque record:</p>
<ul>
<li><p><strong>Documento 0</strong>: <code translate="no">Apple</code></p></li>
<li><p><strong>Documento 1</strong>: <code translate="no">Pineapple</code></p></li>
<li><p><strong>Documento 2</strong>: <code translate="no">Maple</code></p></li>
<li><p><strong>Documento 3</strong>: <code translate="no">Apply</code></p></li>
<li><p><strong>Documento 4</strong>: <code translate="no">Snapple</code></p></li>
</ul>
<p>Durante l'ingestione, Milvus genera n-grammi per ogni record e li inserisce in un indice invertito. In questo indice:</p>
<ul>
<li><p>Le<strong>chiavi</strong> sono n-grammi (sottostringhe).</p></li>
<li><p><strong>I valori</strong> sono elenchi di ID di documenti in cui compare l'n-gramma.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-string">&quot;Ap&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">3</span>]
<span class="hljs-string">&quot;App&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">3</span>]
<span class="hljs-string">&quot;Ma&quot;</span>  -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;Map&quot;</span> -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;Pi&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;Pin&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;Sn&quot;</span>  -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;Sna&quot;</span> -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ap&quot;</span>  -&gt; [<span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;apl&quot;</span> -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;app&quot;</span> -&gt; [<span class="hljs-number">1</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ea&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;eap&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;in&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;ine&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;le&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ly&quot;</span>  -&gt; [<span class="hljs-number">3</span>]
<span class="hljs-string">&quot;na&quot;</span>  -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;nap&quot;</span> -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ne&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;nea&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;pl&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ple&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ply&quot;</span> -&gt; [<span class="hljs-number">3</span>]
<span class="hljs-string">&quot;pp&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ppl&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Ora l'indice è completamente costruito.</p>
<h3 id="Phase-2-Accelerate-queries" class="common-anchor-header">Fase 2: accelerare le query</h3><p>Quando viene eseguito un filtro <code translate="no">LIKE</code>, Milvus utilizza l'indice Ngram per accelerare la valutazione delle query attraverso i seguenti passaggi:</p>
<p><strong>1. Estrazione del termine della query:</strong> Le sottostringhe contigue senza caratteri jolly vengono estratte dall'espressione <code translate="no">LIKE</code> (ad esempio, <code translate="no">'%apple%'</code> diventa <code translate="no">apple</code>).</p>
<p><strong>2. Decomposizione del termine della query:</strong> Il termine della query viene scomposto in n-grammi in base alla sua lunghezza (<code translate="no">L</code>) e alle configurazioni <code translate="no">min_gram</code> e <code translate="no">max_gram</code>.</p>
<p><strong>3. Cerca ogni grammo e interseca:</strong> Milvus cerca gli n-grammi della query nell'indice invertito e interseca i loro elenchi di ID documento per produrre un piccolo insieme di candidati.</p>
<p><strong>4. Verifica e restituisce i risultati:</strong> La condizione originale di <code translate="no">LIKE</code> viene applicata solo a questo insieme di candidati per determinare il risultato finale.</p>
<p>In pratica, il modo in cui una query viene suddivisa in n-grammi dipende dalla forma del modello stesso. Per vedere come funziona, ci concentreremo su due casi comuni: le corrispondenze infix e le corrispondenze wildcard. Le corrispondenze a prefisso e a suffisso si comportano allo stesso modo di quelle a infisso, quindi non le tratteremo separatamente.</p>
<p><strong>Corrispondenza infix</strong></p>
<p>Per una corrispondenza infix, l'esecuzione dipende dalla lunghezza della sottostringa letterale (<code translate="no">L</code>) rispetto a <code translate="no">min_gram</code> e <code translate="no">max_gram</code>.</p>
<p><strong>1. <code translate="no">min_gram ≤ L ≤ max_gram</code></strong> (ad esempio, <code translate="no">strField LIKE '%ppl%'</code>)</p>
<p>La sottostringa letterale <code translate="no">ppl</code> rientra interamente nell'intervallo di n-grammi configurato. Milvus cerca direttamente l'n-gramma <code translate="no">&quot;ppl&quot;</code> nell'indice invertito, producendo gli ID dei documenti candidati <code translate="no">[0, 1, 3, 4]</code>.</p>
<p>Poiché il letterale stesso è un n-gramma indicizzato, tutti i candidati soddisfano già la condizione infix. La fase di verifica finale non elimina alcun record e il risultato rimane <code translate="no">[0, 1, 3, 4]</code>.</p>
<p><strong>2. <code translate="no">L &gt; max_gram</code></strong> (ad esempio, <code translate="no">strField LIKE '%pple%'</code>)</p>
<p>La sottostringa letterale <code translate="no">pple</code> è più lunga di <code translate="no">max_gram</code>, quindi viene scomposta in n-grammi sovrapposti usando una finestra di <code translate="no">max_gram</code>. Con <code translate="no">max_gram = 3</code>, si ottengono gli n-grammi <code translate="no">&quot;ppl&quot;</code> e <code translate="no">&quot;ple&quot;</code>.</p>
<p>Milvus cerca ogni n-gramma nell'indice invertito:</p>
<ul>
<li><p><code translate="no">&quot;ppl&quot;</code> → <code translate="no">[0, 1, 3, 4]</code></p></li>
<li><p><code translate="no">&quot;ple&quot;</code> → <code translate="no">[0, 1, 2, 4]</code></p></li>
</ul>
<p>Intersecando queste liste si ottiene l'insieme candidato <code translate="no">[0, 1, 4]</code>. Il filtro originale <code translate="no">LIKE '%pple%'</code> viene quindi applicato a questi candidati. Tutti e tre soddisfano la condizione, quindi il risultato finale rimane <code translate="no">[0, 1, 4]</code>.</p>
<p><strong>3. <code translate="no">L &lt; min_gram</code></strong> (ad esempio, <code translate="no">strField LIKE '%pp%'</code>)</p>
<p>La sottostringa letterale è più corta di <code translate="no">min_gram</code> e quindi non può essere scomposta in n-grammi indicizzati. In questo caso, l'indice Ngram non può essere utilizzato e Milvus torna al percorso di esecuzione predefinito, valutando la condizione <code translate="no">LIKE</code> attraverso una scansione completa con corrispondenza di pattern.</p>
<p><strong>Corrispondenza con caratteri jolly</strong> (ad esempio, <code translate="no">strField LIKE '%Ap%pple%'</code>)</p>
<p>Questo schema contiene più caratteri jolly, quindi Milvus lo divide prima in letterali contigui: <code translate="no">&quot;Ap&quot;</code> e <code translate="no">&quot;pple&quot;</code>.</p>
<p>Milvus elabora poi ogni letterale in modo indipendente:</p>
<ul>
<li><p><code translate="no">&quot;Ap&quot;</code> ha lunghezza 2 e rientra nell'intervallo di n-grammi.</p></li>
<li><p><code translate="no">&quot;pple&quot;</code> è più lungo di <code translate="no">max_gram</code> e viene scomposto in <code translate="no">&quot;ppl&quot;</code> e <code translate="no">&quot;ple&quot;</code>.</p></li>
</ul>
<p>Questo riduce la query ai seguenti n-grammi:</p>
<ul>
<li><p><code translate="no">&quot;Ap&quot;</code> → <code translate="no">[0, 3]</code></p></li>
<li><p><code translate="no">&quot;ppl&quot;</code> → <code translate="no">[0, 1, 3, 4]</code></p></li>
<li><p><code translate="no">&quot;ple&quot;</code> → <code translate="no">[0, 1, 2, 4]</code></p></li>
</ul>
<p>Intersecando queste liste si ottiene un unico candidato: <code translate="no">[0]</code>.</p>
<p>Infine, il filtro originale <code translate="no">LIKE '%Ap%pple%'</code> viene applicato al documento 0 (<code translate="no">&quot;Apple&quot;</code>). Poiché non soddisfa il modello completo, l'insieme dei risultati finali è vuoto.</p>
<h2 id="Limitations-and-Trade-offs-of-the-Ngram-Index" class="common-anchor-header">Limiti e compromessi dell'indice Ngram<button data-href="#Limitations-and-Trade-offs-of-the-Ngram-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebbene l'indice Ngram possa migliorare significativamente le prestazioni delle query di <code translate="no">LIKE</code>, introduce dei compromessi che devono essere presi in considerazione nelle implementazioni reali.</p>
<ul>
<li><strong>Aumento delle dimensioni dell'indice</strong></li>
</ul>
<p>Il costo principale dell'indice Ngram è l'aumento dell'overhead di memorizzazione. Poiché l'indice memorizza tutte le sottostringhe contigue di lunghezza compresa tra <code translate="no">min_gram</code> e <code translate="no">max_gram</code>, il numero di n-grammi generati cresce rapidamente con l'espandersi di questo intervallo. Ogni lunghezza aggiuntiva di n-grammi aggiunge di fatto un'altra serie completa di sottostringhe sovrapposte per ogni valore di testo, aumentando sia il numero di chiavi dell'indice sia i relativi elenchi di inserimento. In pratica, l'espansione dell'intervallo di un solo carattere può raddoppiare le dimensioni dell'indice rispetto a un indice invertito standard.</p>
<ul>
<li><strong>Non è efficace per tutti i carichi di lavoro</strong></li>
</ul>
<p>L'indice Ngram non accelera tutti i carichi di lavoro. Se i modelli di query sono molto irregolari, contengono letterali molto brevi o non riescono a ridurre il set di dati a un piccolo insieme di candidati nella fase di filtraggio, il vantaggio in termini di prestazioni può essere limitato. In questi casi, l'esecuzione delle query può ancora avvicinarsi al costo di una scansione completa, anche se l'indice è presente.</p>
<h2 id="Evaluating-Ngram-Index-Performance-on-LIKE-Queries" class="common-anchor-header">Valutazione delle prestazioni dell'indice Ngram su query LIKE<button data-href="#Evaluating-Ngram-Index-Performance-on-LIKE-Queries" class="anchor-icon" translate="no">
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
    </button></h2><p>L'obiettivo di questo benchmark è quello di valutare l'efficacia dell'indice Ngram nell'accelerare le query <code translate="no">LIKE</code>.</p>
<h3 id="Test-Methodology" class="common-anchor-header">Metodologia del test</h3><p>Per contestualizzare le sue prestazioni, lo confrontiamo con due modalità di esecuzione di base:</p>
<ul>
<li><p><strong>Master</strong>: Esecuzione bruta senza alcun indice.</p></li>
<li><p><strong>Master-invertito</strong>: Esecuzione con un indice invertito convenzionale.</p></li>
</ul>
<p>Abbiamo progettato due scenari di test per coprire diverse caratteristiche dei dati:</p>
<ul>
<li><p><strong>Set di dati di testo Wiki</strong>: 100.000 righe, con ogni campo di testo troncato a 1 KB.</p></li>
<li><p><strong>Dataset di parole singole</strong>: 1.000.000 di righe, dove ogni riga contiene una singola parola.</p></li>
</ul>
<p>In entrambi gli scenari, vengono applicate in modo coerente le seguenti impostazioni:</p>
<ul>
<li><p>Le query utilizzano lo <strong>schema di corrispondenza infix</strong> (<code translate="no">%xxx%</code>).</p></li>
<li><p>L'indice Ngram è configurato con <code translate="no">min_gram = 2</code> e <code translate="no">max_gram = 4</code></p></li>
<li><p>Per isolare i costi di esecuzione delle query ed evitare l'overhead della materializzazione dei risultati, tutte le query restituiscono <code translate="no">count(*)</code> invece di set di risultati completi.</p></li>
</ul>
<h3 id="Results" class="common-anchor-header">Risultati</h3><p><strong>Test per wiki, ogni riga è un testo wiki con lunghezza del contenuto troncata di 1000, 100K righe</strong></p>
<table>
<thead>
<tr><th></th><th>Letterale</th><th>Tempo (ms)</th><th>Velocizzazione</th><th>Conteggio</th></tr>
</thead>
<tbody>
<tr><td>Maestro</td><td>stadio</td><td>207.8</td><td></td><td>335</td></tr>
<tr><td>Master-invertito</td><td></td><td>2095</td><td></td><td>335</td></tr>
<tr><td>Ngramma</td><td></td><td>1.09</td><td>190 / 1922</td><td>335</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Maestro</td><td>scuola secondaria</td><td>204.8</td><td></td><td>340</td></tr>
<tr><td>Maestro invertito</td><td></td><td>2000</td><td></td><td>340</td></tr>
<tr><td>Ngramma</td><td></td><td>1.26</td><td>162.5 / 1587</td><td>340</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Il Master</td><td>è una scuola secondaria coeducativa e sponsorizzata</td><td>223.9</td><td></td><td>1</td></tr>
<tr><td>Master invertito</td><td></td><td>2100</td><td></td><td>1</td></tr>
<tr><td>Ngramma</td><td></td><td>1.69</td><td>132.5 / 1242.6</td><td>1</td></tr>
</tbody>
</table>
<p><strong>Test per parole singole, 1M di righe</strong></p>
<table>
<thead>
<tr><th></th><th>Letterale</th><th>Tempo(ms)</th><th>Accelerazione</th><th>Conteggio</th></tr>
</thead>
<tbody>
<tr><td>Master</td><td>na</td><td>128.6</td><td></td><td>40430</td></tr>
<tr><td>Maestro invertito</td><td></td><td>66.5</td><td></td><td>40430</td></tr>
<tr><td>Ngram</td><td></td><td>1.38</td><td>93.2 / 48.2</td><td>40430</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Maestro</td><td>nat</td><td>122</td><td></td><td>5200</td></tr>
<tr><td>Master invertito</td><td></td><td>65.1</td><td></td><td>5200</td></tr>
<tr><td>Ngram</td><td></td><td>1.27</td><td>96 / 51.3</td><td>5200</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Maestro</td><td>nati</td><td>118.8</td><td></td><td>1630</td></tr>
<tr><td>Master invertito</td><td></td><td>66.9</td><td></td><td>1630</td></tr>
<tr><td>Ngramma</td><td></td><td>1.21</td><td>98.2 / 55.3</td><td>1630</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Maestro</td><td>natio</td><td>118.4</td><td></td><td>1100</td></tr>
<tr><td>Maestro invertito</td><td></td><td>65.1</td><td></td><td>1100</td></tr>
<tr><td>Ngramma</td><td></td><td>1.33</td><td>89 / 48.9</td><td>1100</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Maestro</td><td>nazione</td><td>118</td><td></td><td>1100</td></tr>
<tr><td>Maestro invertito</td><td></td><td>63.3</td><td></td><td>1100</td></tr>
<tr><td>Ngramma</td><td></td><td>1.4</td><td>84.3 / 45.2</td><td>1100</td></tr>
</tbody>
</table>
<p><strong>Nota:</strong> questi risultati si basano su benchmark condotti a maggio. Da allora, il ramo Master è stato sottoposto a ulteriori ottimizzazioni delle prestazioni, quindi il divario di prestazioni osservato qui dovrebbe essere minore nelle versioni attuali.</p>
<p>I risultati dei benchmark evidenziano un chiaro schema: l'indice Ngram accelera significativamente le query LIKE in tutti i casi, e la velocità di esecuzione delle query dipende fortemente dalla struttura e dalla lunghezza dei dati testuali sottostanti.</p>
<ul>
<li><p>Per i <strong>campi di testo lunghi</strong>, come i documenti in stile Wiki troncati a 1.000 byte, i guadagni di prestazioni sono particolarmente pronunciati. Rispetto a un'esecuzione brutale senza indice, l'indice Ngram raggiunge una velocità di circa <strong>100-200×</strong>. Se confrontato con un indice invertito convenzionale, il miglioramento è ancora più netto e raggiunge i <strong>1.200-1.900×</strong>. Questo perché le interrogazioni LIKE su testi lunghi sono particolarmente costose per gli approcci di indicizzazione tradizionali, mentre le ricerche di n-grammi possono restringere rapidamente lo spazio di ricerca a un insieme molto piccolo di candidati.</p></li>
<li><p>Sui set di dati costituiti da <strong>voci di una sola parola</strong>, i guadagni sono minori ma comunque sostanziali. In questo scenario, l'indice Ngram funziona circa <strong>80-100×</strong> più velocemente rispetto all'esecuzione bruta e <strong>45-55×</strong> più velocemente rispetto a un indice invertito convenzionale. Sebbene i testi più brevi siano intrinsecamente più economici da analizzare, l'approccio basato sugli n-grammi evita comunque i confronti non necessari e riduce costantemente il costo delle query.</p></li>
</ul>
<h2 id="Conclusion" class="common-anchor-header">Conclusione<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>L'indice Ngram accelera le query di <code translate="no">LIKE</code> suddividendo il testo in n-grammi di lunghezza fissa e indicizzandoli con una struttura invertita. Questo progetto trasforma la costosa corrispondenza delle sottostringhe in efficienti ricerche di n-grammi seguite da una verifica minima. Di conseguenza, si evitano le scansioni di tutto il testo e si conserva l'esatta semantica di <code translate="no">LIKE</code>.</p>
<p>In pratica, questo approccio è efficace in un'ampia gamma di carichi di lavoro, con risultati particolarmente buoni per la corrispondenza fuzzy su campi di testo lunghi. L'indice Ngram è quindi adatto a scenari in tempo reale come la ricerca di codici, l'assistenza agli agenti, il recupero di documenti legali e medici, le basi di conoscenza aziendali e la ricerca accademica, dove la corrispondenza precisa delle parole chiave rimane essenziale.</p>
<p>Allo stesso tempo, l'indice Ngram trae vantaggio da un'attenta configurazione. La scelta dei valori appropriati di <code translate="no">min_gram</code> e <code translate="no">max_gram</code> è fondamentale per bilanciare le dimensioni dell'indice e le prestazioni delle query. Se regolato in modo da riflettere i modelli di query reali, l'indice Ngram fornisce una soluzione pratica e scalabile per le query <code translate="no">LIKE</code> ad alte prestazioni nei sistemi di produzione.</p>
<p>Per ulteriori informazioni sull'indice Ngram, consultare la documentazione qui sotto:</p>
<ul>
<li><a href="https://milvus.io/docs/ngram.md">Indice Ngram | Documentazione Milvus</a></li>
</ul>
<p>Avete domande o volete un approfondimento su una qualsiasi funzione dell'ultima versione di Milvus? Unitevi al nostro<a href="https://discord.com/invite/8uyFbECzPX"> canale Discord</a> o inviate problemi su<a href="https://github.com/milvus-io/milvus"> GitHub</a>. È anche possibile prenotare una sessione individuale di 20 minuti per ottenere approfondimenti, indicazioni e risposte alle vostre domande tramite<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Per saperne di più sulle caratteristiche di Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Presentazione di Milvus 2.6: ricerca vettoriale accessibile su scala miliardaria</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Introduzione alla funzione Embedding: Come Milvus 2.6 semplifica la vettorizzazione e la ricerca semantica</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Triturazione JSON in Milvus: filtraggio JSON 88,9 volte più veloce e flessibile</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Il vero recupero a livello di entità: Nuove capacità di Array-of-Structs e MAX_SIM in Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">Filtraggio geospaziale e ricerca vettoriale insieme a campi geometrici e RTREE in Milvus 2.6</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">Introduzione di AISAQ in Milvus: la ricerca vettoriale su scala miliardaria è appena diventata 3.200 volte più economica sulla memoria</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">Ottimizzazione di NVIDIA CAGRA in Milvus: un approccio ibrido GPU-CPU per un'indicizzazione più rapida e query meno costose</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH in Milvus: l'arma segreta per combattere i duplicati nei dati di allenamento LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Portare la compressione vettoriale all'estremo: come Milvus serve 3 volte di più le query con RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">I benchmark mentono: i DB vettoriali meritano un test reale </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Abbiamo sostituito Kafka/Pulsar con un Picchio per Milvus </a></p></li>
</ul>
