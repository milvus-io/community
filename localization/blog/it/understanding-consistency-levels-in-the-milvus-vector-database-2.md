---
id: understanding-consistency-levels-in-the-milvus-vector-database-2.md
title: >-
  Comprendere il livello di consistenza nel database dei vettori Milvus - Parte
  II
author: Jiquan Long
date: 2022-09-13T00:00:00.000Z
desc: >-
  Anatomia del meccanismo alla base dei livelli di coerenza regolabili nel
  database vettoriale Milvus.
cover: assets.zilliz.com/1280_X1280_0e0d4bc107.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_0e0d4bc107.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>Immagine di copertina</span> </span></p>
<blockquote>
<p>Questo articolo è stato scritto da <a href="https://github.com/longjiquan">Jiquan Long</a> e trascritto da <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Nel <a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">precedente blog</a> sulla consistenza, abbiamo spiegato qual è la connotazione della consistenza in un database vettoriale distribuito, abbiamo trattato i quattro livelli di consistenza - forte, bounded staleness, di sessione ed eventuale - supportati nel database vettoriale Milvus e abbiamo spiegato lo scenario applicativo più adatto a ciascun livello di consistenza.</p>
<p>In questo post continueremo a esaminare il meccanismo che consente agli utenti del database vettoriale Milvus di scegliere in modo flessibile il livello di consistenza ideale per vari scenari applicativi. Inoltre, forniremo un tutorial di base su come sintonizzare il livello di consistenza nel database vettoriale Milvus.</p>
<p><strong>Vai a:</strong></p>
<ul>
<li><a href="#The-underlying-time-tick-mechanism">Il meccanismo di spunta temporale sottostante</a></li>
<li><a href="#Guarantee-timestamp">Timestamp di garanzia</a></li>
<li><a href="#Consistency-levels">Livelli di consistenza</a></li>
<li><a href="#How-to-tune-consistency-level-in-Milvus">Come regolare il livello di coerenza in Milvus?</a></li>
</ul>
<h2 id="The-underlying-time-tick-mechanism" class="common-anchor-header">Il meccanismo di time tick sottostante<button data-href="#The-underlying-time-tick-mechanism" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus utilizza il meccanismo del time tick per garantire diversi livelli di coerenza quando si effettua una ricerca vettoriale o un'interrogazione. Il Time Tick è la filigrana di Milvus che agisce come un orologio in Milvus e indica in quale punto del tempo si trova il sistema Milvus. Ogni volta che viene inviata una richiesta di linguaggio di manipolazione dei dati (DML) al database dei vettori di Milvus, questo assegna un timestamp alla richiesta. Come mostrato nella figura seguente, quando vengono inseriti nuovi dati nella coda dei messaggi, Milvus non solo segna un timestamp sui dati inseriti, ma inserisce anche dei tick temporali a intervalli regolari.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/timetick_b395df9804.png" alt="timetick" class="doc-image" id="timetick" />
   </span> <span class="img-wrapper"> <span>timetick</span> </span></p>
<p>Prendiamo come esempio <code translate="no">syncTs1</code> nella figura precedente. Quando i consumatori a valle, come i nodi di interrogazione, vedono <code translate="no">syncTs1</code>, i componenti del consumatore capiscono che tutti i dati inseriti prima di <code translate="no">syncTs1</code> sono stati consumati. In altre parole, le richieste di inserimento dati i cui valori di timestamp sono inferiori a <code translate="no">syncTs1</code> non appariranno più nella coda dei messaggi.</p>
<h2 id="Guarantee-Timestamp" class="common-anchor-header">Garanzia del timestamp<button data-href="#Guarantee-Timestamp" class="anchor-icon" translate="no">
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
    </button></h2><p>Come menzionato nella sezione precedente, i componenti di consumo a valle, come i nodi di interrogazione, ottengono continuamente messaggi di richieste di inserimento dati e tick temporali dalla coda di messaggi. Ogni volta che un time tick viene consumato, il nodo di interrogazione segna questo time tick consumato come tempo di servizio - <code translate="no">ServiceTime</code> e tutti i dati inseriti prima di <code translate="no">ServiceTime</code> sono visibili al nodo di interrogazione.</p>
<p>Oltre a <code translate="no">ServiceTime</code>, Milvus adotta anche un tipo di timestamp - timestamp di garanzia (<code translate="no">GuaranteeTS</code>) per soddisfare l'esigenza di vari livelli di coerenza e disponibilità da parte di diversi utenti. Ciò significa che gli utenti del database vettoriale di Milvus possono specificare <code translate="no">GuaranteeTs</code> per informare i nodi di interrogazione che tutti i dati precedenti a <code translate="no">GuaranteeTs</code> devono essere visibili e coinvolti quando viene effettuata una ricerca o un'interrogazione.</p>
<p>Quando il nodo di interrogazione esegue una richiesta di ricerca nella banca dati vettoriale Milvus, si presentano di solito due scenari.</p>
<h3 id="Scenario-1-Execute-search-request-immediately" class="common-anchor-header">Scenario 1: Esecuzione immediata della richiesta di ricerca</h3><p>Come mostrato nella figura seguente, se <code translate="no">GuaranteeTs</code> è più piccolo di <code translate="no">ServiceTime</code>, i nodi di interrogazione possono eseguire la richiesta di ricerca immediatamente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/execute_immediately_dd1913775d.png" alt="execute_immediately" class="doc-image" id="execute_immediately" />
   </span> <span class="img-wrapper"> <span>eseguire_immediatamente</span> </span></p>
<h3 id="Scenario-2-Wait-till-ServiceTime--GuaranteeTs" class="common-anchor-header">Scenario 2: Attendere fino a "ServiceTime &gt; GuaranteeTs".</h3><p>Se <code translate="no">GuaranteeTs</code> è maggiore di <code translate="no">ServiceTime</code>, i nodi di interrogazione devono continuare a consumare time tick dalla coda dei messaggi. Le richieste di ricerca non possono essere eseguite finché <code translate="no">ServiceTime</code> non è maggiore di <code translate="no">GuaranteeTs</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/wait_search_f09a2f6cf9.png" alt="wait_search" class="doc-image" id="wait_search" />
   </span> <span class="img-wrapper"> <span>attendere_ricerca</span> </span></p>
<h2 id="Consistency-Levels" class="common-anchor-header">Livelli di coerenza<button data-href="#Consistency-Levels" class="anchor-icon" translate="no">
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
    </button></h2><p>Pertanto, <code translate="no">GuaranteeTs</code> è configurabile nella richiesta di ricerca per ottenere il livello di consistenza specificato dall'utente. Un <code translate="no">GuaranteeTs</code> con un valore elevato garantisce una <a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md#Strong">forte consistenza</a> al costo di un'elevata latenza di ricerca. Un <code translate="no">GuaranteeTs</code> con un valore piccolo riduce la latenza di ricerca, ma compromette la visibilità dei dati.</p>
<p><code translate="no">GuaranteeTs</code> in Milvus è un formato timestamp ibrido. E l'utente non ha idea del <a href="https://github.com/milvus-io/milvus/blob/master/docs/design_docs/20211214-milvus_hybrid_ts.md">TSO</a> all'interno di Milvus. Pertanto, specificare il valore di<code translate="no">GuaranteeTs</code> è un compito troppo complicato per gli utenti. Per risparmiare agli utenti e offrire loro un'esperienza ottimale, Milvus richiede solo che gli utenti scelgano il livello di coerenza specifico e il database vettoriale di Milvus gestirà automaticamente il valore di <code translate="no">GuaranteeTs</code> per gli utenti. In altre parole, l'utente di Milvus deve solo scegliere tra i quattro livelli di coerenza: <code translate="no">Strong</code>, <code translate="no">Bounded</code>, <code translate="no">Session</code>, e <code translate="no">Eventually</code>. A ciascun livello di consistenza corrisponde un determinato valore di <code translate="no">GuaranteeTs</code>.</p>
<p>La figura seguente illustra il valore <code translate="no">GuaranteeTs</code> per ciascuno dei quattro livelli di consistenza del database vettoriale Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/guarantee_ts_f4b3e119d3.png" alt="guarantee_ts" class="doc-image" id="guarantee_ts" />
   </span> <span class="img-wrapper"> <span>garanzia_ts</span> </span></p>
<p>Il database vettoriale Milvus supporta quattro livelli di consistenza:</p>
<ul>
<li><p><code translate="no">CONSISTENCY_STRONG</code> <code translate="no">GuaranteeTs</code> è impostato sullo stesso valore dell'ultimo timestamp del sistema e i nodi di interrogazione attendono che il tempo di servizio proceda fino all'ultimo timestamp del sistema per elaborare la richiesta di ricerca o di interrogazione.</p></li>
<li><p><code translate="no">CONSISTENCY_EVENTUALLY</code> <code translate="no">GuaranteeTs</code> è impostato su un valore insignificante rispetto all'ultimo timestamp del sistema per saltare il controllo di coerenza. I nodi di interrogazione effettuano immediatamente una ricerca sulla vista dati esistente.</p></li>
<li><p><code translate="no">CONSISTENCY_BOUNDED</code> <code translate="no">GuaranteeTs</code> è impostato su un valore relativamente più piccolo dell'ultimo timestamp di sistema e i nodi di query effettuano la ricerca su una vista dati meno aggiornata.</p></li>
<li><p><code translate="no">CONSISTENCY_SESSION</code>: Il client utilizza il timestamp dell'ultima operazione di scrittura come <code translate="no">GuaranteeTs</code>, in modo che ogni client possa almeno recuperare i dati inseriti da solo.</p></li>
</ul>
<h2 id="How-to-tune-consistency-level-in-Milvus" class="common-anchor-header">Come si regola il livello di consistenza in Milvus?<button data-href="#How-to-tune-consistency-level-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus supporta la regolazione del livello di consistenza durante la <a href="https://milvus.io/docs/v2.1.x/create_collection.md">creazione di una collezione</a> o l'esecuzione di una <a href="https://milvus.io/docs/v2.1.x/search.md">ricerca</a> o di una <a href="https://milvus.io/docs/v2.1.x/query.md">query</a>.</p>
<h3 id="Conduct-a-vector-similarity-search" class="common-anchor-header">Eseguire una ricerca di similarità vettoriale</h3><p>Per effettuare una ricerca di similarità vettoriale con il livello di consistenza desiderato, è sufficiente impostare il valore del parametro <code translate="no">consistency_level</code> come <code translate="no">Strong</code>, <code translate="no">Bounded</code>, <code translate="no">Session</code>, o <code translate="no">Eventually</code>. Se non si imposta il valore del parametro <code translate="no">consistency_level</code>, il livello di consistenza sarà <code translate="no">Bounded</code> per default. L'esempio esegue una ricerca di similarità vettoriale con consistenza <code translate="no">Strong</code>.</p>
<pre><code translate="no">results = collection.search(
        data=[[0.1, 0.2]], 
        anns_field=<span class="hljs-string">&quot;book_intro&quot;</span>, 
        param=search_params, 
        <span class="hljs-built_in">limit</span>=10, 
        <span class="hljs-built_in">expr</span>=None,
        consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Conduct-a-vector-query" class="common-anchor-header">Eseguire una query vettoriale</h3><p>Analogamente all'esecuzione di una ricerca di similarità vettoriale, è possibile specificare il valore del parametro <code translate="no">consistency_level</code> quando si esegue una query vettoriale. L'esempio esegue una query vettoriale con la consistenza <code translate="no">Strong</code>.</p>
<pre><code translate="no">res = collection.query(
  <span class="hljs-built_in">expr</span> = <span class="hljs-string">&quot;book_id in [2,4,6,8]&quot;</span>, 
  output_fields = [<span class="hljs-string">&quot;book_id&quot;</span>, <span class="hljs-string">&quot;book_intro&quot;</span>],
  consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-next" class="common-anchor-header">Il prossimo passo<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Con il rilascio ufficiale di Milvus 2.1, abbiamo preparato una serie di blog che introducono le nuove funzionalità. Per saperne di più, leggete questa serie di blog:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Come utilizzare i dati delle stringhe per potenziare le applicazioni di ricerca per similarità</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Utilizzo di Milvus incorporato per installare ed eseguire immediatamente Milvus con Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Aumentare la velocità di lettura del database vettoriale con le repliche in memoria</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Capire il livello di consistenza nel database vettoriale Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Capire il livello di consistenza del database vettoriale Milvus (parte II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">In che modo il database vettoriale Milvus garantisce la sicurezza dei dati?</a></li>
</ul>
