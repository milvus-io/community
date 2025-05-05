---
id: >-
  hands-on-tutorial-build-rag-power-document-assistant-in-10-minutes-with-dify-and-milvus.md
title: >-
  Esercitazione pratica: Costruire un assistente documentale alimentato da RAG
  in 10 minuti con Dify e Milvus
author: Ruben Winastwan
date: 2025-04-28T00:00:00.000Z
desc: >-
  Imparate a creare un assistente documentale dotato di intelligenza artificiale
  utilizzando la RAG (Retrieval Augmented Generation) con Dify e Milvus in
  questo rapido tutorial pratico per sviluppatori.
cover: assets.zilliz.com/build_rag_with_dify_and_milvus_2ab76c6afd.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'RAG, retrieval augmented generation, Dify, Milvus, no-code AI'
meta_title: |
  Build a RAG Document Assistant in 10 Minutes | Dify & Milvus Tutorial
origin: >-
  https://milvus.io/blog/hands-on-tutorial-build-rag-power-document-assistant-in-10-minutes-with-dify-and-milvus.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_rag_with_dify_and_milvus_2ab76c6afd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>E se poteste trasformare la vostra intera libreria di documentazione - migliaia di pagine di specifiche tecniche, wiki interni e documentazione di codice - in un assistente AI intelligente che risponde istantaneamente a domande specifiche?</p>
<p>E ancora meglio, se poteste costruirlo in meno tempo di quanto ne occorra per risolvere un conflitto di fusione?</p>
<p>Questa è la promessa della <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval Augmented Generation (RAG</a> ), se implementata nel modo giusto.</p>
<p>Sebbene ChatGPT e altri LLM siano impressionanti, raggiungono rapidamente i loro limiti quando si chiede loro di esaminare la documentazione, la base di codice o la base di conoscenza specifiche della vostra azienda. RAG colma questa lacuna integrando i vostri dati proprietari nella conversazione, fornendovi capacità di intelligenza artificiale direttamente pertinenti al vostro lavoro.</p>
<p>Il problema? L'implementazione tradizionale di RAG si presenta come segue:</p>
<ul>
<li><p>Scrivere pipeline di generazione di incorporazioni personalizzate</p></li>
<li><p>Configurare e distribuire un database vettoriale</p></li>
<li><p>Creare modelli di prompt complessi</p></li>
<li><p>Creare una logica di recupero e soglie di somiglianza</p></li>
<li><p>Creare un'interfaccia utilizzabile</p></li>
</ul>
<p>Ma cosa succederebbe se si potesse passare direttamente ai risultati?</p>
<p>In questa esercitazione, costruiremo una semplice applicazione RAG utilizzando due strumenti dedicati agli sviluppatori:</p>
<ul>
<li><p><a href="https://github.com/langgenius/dify">Dify</a>: Una piattaforma open-source che gestisce l'orchestrazione RAG con una configurazione minima.</p></li>
<li><p><a href="https://milvus.io/docs/overview.md">Milvus</a>: un database vettoriale open-source velocissimo, creato appositamente per la ricerca di similarità e l'intelligenza artificiale.</p></li>
</ul>
<p>Alla fine di questa guida di 10 minuti, avrete un assistente AI funzionante in grado di rispondere a domande dettagliate su qualsiasi raccolta di documenti, senza bisogno di una laurea in apprendimento automatico.</p>
<h2 id="What-Youll-Build" class="common-anchor-header">Cosa costruirete<button data-href="#What-Youll-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>In pochi minuti di lavoro attivo, creerete:</p>
<ul>
<li><p>Una pipeline per l'elaborazione dei documenti che converte qualsiasi PDF in conoscenza interrogabile.</p></li>
<li><p>Un sistema di ricerca vettoriale che trova esattamente le informazioni giuste</p></li>
<li><p>Un'interfaccia di chatbot che risponde a domande tecniche con precisione millimetrica.</p></li>
<li><p>Una soluzione implementabile che può essere integrata con gli strumenti esistenti.</p></li>
</ul>
<p>La parte migliore? La maggior parte di tutto ciò viene configurata attraverso una semplice interfaccia utente (UI) invece che con codice personalizzato.</p>
<h2 id="What-Youll-Need" class="common-anchor-header">Cosa vi serve<button data-href="#What-Youll-Need" class="anchor-icon" translate="no">
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
<li><p>Conoscenza di base di Docker (solo il livello <code translate="no">docker-compose up -d</code> )</p></li>
<li><p>Una chiave API OpenAI</p></li>
<li><p>Un documento PDF con cui sperimentare (useremo un documento di ricerca)</p></li>
</ul>
<p>Siete pronti a costruire qualcosa di veramente utile in tempi record? Iniziamo!</p>
<h2 id="Building-Your-RAG-Application-with-Milvus-and-Dify" class="common-anchor-header">Costruire l'applicazione RAG con Milvus e Dify<button data-href="#Building-Your-RAG-Application-with-Milvus-and-Dify" class="anchor-icon" translate="no">
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
    </button></h2><p>In questa sezione, costruiremo una semplice applicazione RAG con Dify, in cui potremo porre domande sulle informazioni contenute in un documento di ricerca. Per il documento di ricerca, potete usare qualsiasi documento che volete; tuttavia, in questo caso, useremo il famoso documento che ci ha fatto conoscere l'architettura Transformer, &quot;<a href="https://arxiv.org/abs/1706.03762">Attention is All You Need</a>&quot;.</p>
<p>Utilizzeremo Milvus come memoria vettoriale, dove memorizzeremo tutti i contesti necessari. Per il modello di embedding e l'LLM, utilizzeremo i modelli di OpenAI. Pertanto, dobbiamo prima configurare una chiave API OpenAI. Per saperne di più su come configurarla<a href="https://platform.openai.com/docs/quickstart">, cliccate qui</a>.</p>
<h3 id="Step-1-Starting-Dify-and-Milvus-Containers" class="common-anchor-header">Passo 1: Avvio dei contenitori Dify e Milvus</h3><p>In questo esempio, ospiteremo Dify con Docker Compose. Pertanto, prima di iniziare, assicuratevi che Docker sia installato sul vostro computer locale. In caso contrario, installate Docker facendo riferimento alla<a href="https://docs.docker.com/desktop/"> sua pagina di installazione</a>.</p>
<p>Una volta installato Docker, dobbiamo clonare il codice sorgente di Dify nella nostra macchina locale con il seguente comando:</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> &lt;&lt;<span class="hljs-string">https://github.com/langgenius/dify.git&gt;&gt;
</span><button class="copy-code-btn"></button></code></pre>
<p>Quindi, andare alla cartella <code translate="no">docker</code> all'interno del codice sorgente appena clonato. Lì, è necessario copiare il file <code translate="no">.env</code> con il seguente comando:</p>
<pre><code translate="no"><span class="hljs-built_in">cd</span> dify/docker
<span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p>In poche parole, il file <code translate="no">.env</code> contiene le configurazioni necessarie per impostare l'applicazione Dify, come la selezione dei database vettoriali, le credenziali necessarie per accedere al database vettoriale, l'indirizzo dell'applicazione Dify, ecc.</p>
<p>Poiché utilizzeremo Milvus come database vettoriale, dobbiamo cambiare il valore della variabile <code translate="no">VECTOR_STORE</code> nel file <code translate="no">.env</code> in <code translate="no">milvus</code>. Inoltre, dobbiamo cambiare la variabile <code translate="no">MILVUS_URI</code> in <code translate="no">http://host.docker.internal:19530</code> per assicurarci che non ci siano problemi di comunicazione tra i contenitori Docker dopo la distribuzione.</p>
<pre><code translate="no"><span class="hljs-variable constant_">VECTOR_STORE</span>=milvus
<span class="hljs-variable constant_">MILVUS_URI</span>=<span class="hljs-attr">http</span>:<span class="hljs-comment">//host.docker.internal:19530</span>
<button class="copy-code-btn"></button></code></pre>
<p>Ora siamo pronti ad avviare i contenitori Docker. Per farlo, tutto ciò che dobbiamo fare è eseguire il comando <code translate="no">docker compose up -d</code>. Al termine, nel terminale verrà visualizzato un output simile a quello riportato di seguito:</p>
<pre><code translate="no">docker compose up -d
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/docker_compose_179216f113.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Possiamo controllare lo stato di tutti i contenitori e vedere se sono attivi e funzionanti in modo sano con il comando <code translate="no">docker compose ps</code>. Se sono tutti sani, si vedrà l'output seguente:</p>
<pre><code translate="no">docker compose ps
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/docker_compose_2_1a084ba137.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Infine, se andiamo su<a href="http://localhost/install"> </a>http://localhost/install, vedremo una pagina di destinazione di Dify dove potremo iscriverci e iniziare a costruire la nostra applicazione RAG in poco tempo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_login_d2bf4d4468.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Una volta effettuata la registrazione, è sufficiente accedere a Dify con le proprie credenziali.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/difi_login_2_5a8ea9c2d6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Setting-Up-OpenAI-API-Key" class="common-anchor-header">Passo 2: Impostazione della chiave API OpenAI</h3><p>La prima cosa da fare dopo l'iscrizione a Dify è impostare le chiavi API che useremo per chiamare il modello di embedding e l'LLM. Poiché utilizzeremo i modelli di OpenAI, dobbiamo inserire la nostra chiave API OpenAI nel nostro profilo. Per farlo, andare su "Impostazioni" passando il cursore sul proprio profilo in alto a destra dell'interfaccia utente, come si può vedere nella schermata qui sotto:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_settings_8ff08fab97.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Quindi, andate su "Model Provider", passate il cursore su OpenAI e fate clic su "Setup". Verrà visualizzata una schermata pop-up in cui viene richiesto di inserire la chiave API di OpenAI. Una volta terminato, siamo pronti a usare i modelli di OpenAI come modello di incorporamento e LLM.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_model_providers_491b313b12.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Inserting-Documents-into-Knowledge-Base" class="common-anchor-header">Passo 3: Inserire i documenti nella Knowledge Base</h3><p>Ora memorizziamo la base di conoscenza per la nostra applicazione RAG. La base di conoscenza consiste in una raccolta di documenti o testi interni che possono essere utilizzati come contesti rilevanti per aiutare il LLM a generare risposte più accurate.</p>
<p>Nel nostro caso d'uso, la nostra base di conoscenza è essenzialmente il documento "Attention is All You Need". Tuttavia, non possiamo memorizzare il documento così com'è per diversi motivi. In primo luogo, il documento è troppo lungo e dare un contesto troppo lungo all'LLM non sarebbe d'aiuto, perché il contesto è troppo ampio. In secondo luogo, non possiamo eseguire ricerche di similarità per trovare il contesto più pertinente se il nostro input è un testo grezzo.</p>
<p>Pertanto, ci sono almeno due passi da fare prima di memorizzare il nostro articolo nella base di conoscenza. Innanzitutto, dobbiamo dividere l'articolo in pezzi di testo e poi trasformare ogni pezzo in un embedding tramite un modello di embedding. Infine, possiamo memorizzare questi embedding in Milvus come database vettoriale.</p>
<p>Dify ci permette di dividere facilmente i testi dell'articolo in pezzi e di trasformarli in embedding. Tutto ciò che dobbiamo fare è caricare il file PDF dell'articolo, impostare la lunghezza dei pezzi e scegliere il modello di embedding tramite un cursore. Per eseguire tutti questi passaggi, andare su &quot;Conoscenze&quot; e poi fare clic su &quot;Crea conoscenze&quot;. Successivamente, verrà richiesto di caricare il file PDF dal computer locale. Pertanto, è meglio scaricare il documento da ArXiv e salvarlo prima sul computer.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_knowledge_cc21a5c430.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Una volta caricato il file, è possibile impostare la lunghezza dei pezzi, il metodo di indicizzazione, il modello di incorporamento che si desidera utilizzare e le impostazioni di recupero.</p>
<p>Nell'area "Chunk Setting" è possibile scegliere un numero qualsiasi come lunghezza massima del chunk (nel nostro caso, lo imposteremo a 100). Poi, per "Index Method", dobbiamo scegliere l'opzione "High Quality", che ci consentirà di eseguire ricerche di similarità per trovare contesti rilevanti. Per "Modello di incorporamento", è possibile scegliere qualsiasi modello di incorporamento di OpenAI, ma in questo esempio utilizzeremo il modello text-embedding-3-small. Infine, per "Impostazione di recupero", dobbiamo scegliere "Ricerca vettoriale", poiché vogliamo eseguire ricerche di similarità per trovare i contesti più rilevanti.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Dify_save_837dbc0cf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Se si fa clic su "Save &amp; Process" e tutto va bene, si vedrà apparire un segno di spunta verde, come mostrato nella seguente schermata:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_knowledge_created_d46b96385f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Creating-the-RAG-App" class="common-anchor-header">Fase 4: Creazione dell'app RAG</h3><p>Fino a questo punto, abbiamo creato con successo una base di conoscenze e l'abbiamo memorizzata nel nostro database Milvus. Ora siamo pronti a creare l'app RAG.</p>
<p>La creazione dell'app RAG con Dify è molto semplice. Dobbiamo andare in "Studio" invece che in "Knowledge" come prima, e poi cliccare su "Create from Blank". Quindi, scegliere "Chatbot" come tipo di app e assegnare un nome all'app nel campo previsto. Al termine, fare clic su "Crea". Ora verrà visualizzata la seguente pagina:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_create_f5691f193d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nel campo "Instruction" (Istruzione), possiamo scrivere una richiesta di sistema come "Answer the query from the user concisely" (Rispondi alla domanda dell'utente in modo conciso). Quindi, come "Contesto", dobbiamo fare clic sul simbolo "Aggiungi" e aggiungere la base di conoscenze appena creata. In questo modo, la nostra applicazione RAG recupererà i possibili contesti da questa base di conoscenze per rispondere alla domanda dell'utente.</p>
<p>Ora che abbiamo aggiunto la base di conoscenza alla nostra applicazione RAG, l'ultima cosa da fare è scegliere il LLM da OpenAI. Per farlo, si può fare clic sull'elenco dei modelli disponibile nell'angolo in alto a destra, come si può vedere nella schermata sottostante:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_llm_c3b79ded37.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ora siamo pronti a pubblicare la nostra applicazione RAG! Nell'angolo in alto a destra, fate clic su "Publish" e troverete molti modi per pubblicare la nostra applicazione RAG: possiamo semplicemente eseguirla in un browser, incorporarla nel nostro sito web o accedere all'applicazione tramite API. In questo esempio, ci limiteremo a eseguire la nostra app in un browser, quindi possiamo fare clic su &quot;Run App&quot;.</p>
<p>E il gioco è fatto! Ora è possibile chiedere al LLM qualsiasi cosa relativa al documento "Attention is All You Need" o a qualsiasi documento incluso nella nostra knowledge base.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag_attention_is_all_you_need_8582d3a69a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>Ora avete costruito un'applicazione RAG funzionante utilizzando Dify e Milvus, con un codice e una configurazione minimi. Questo approccio rende la complessa architettura RAG accessibile agli sviluppatori senza richiedere una profonda esperienza nei database vettoriali o nell'integrazione con LLM. Aspetti fondamentali:</p>
<ol>
<li><strong>Basso costo di configurazione</strong>: L'uso di Docker Compose semplifica la distribuzione.</li>
<li><strong>Orchestrazione no-code/low-code</strong>: Dify gestisce la maggior parte della pipeline RAG</li>
<li><strong>Database vettoriale pronto per la produzione</strong>: Milvus fornisce una memorizzazione e un recupero efficienti delle incorporazioni</li>
<li><strong>Architettura estensibile</strong>: Facile aggiunta di documenti o regolazione dei parametri Per l'implementazione in produzione, considerare:</li>
</ol>
<ul>
<li>Impostare l'autenticazione per l'applicazione</li>
<li>Configurare il corretto ridimensionamento di Milvus (soprattutto per le raccolte di documenti più grandi).</li>
<li>Implementare il monitoraggio delle istanze di Dify e Milvus.</li>
<li>La combinazione di Dify e Milvus consente di sviluppare rapidamente applicazioni RAG in grado di sfruttare efficacemente le conoscenze interne dell'organizzazione con moderni modelli linguistici di grandi dimensioni (LLM). Buona costruzione!</li>
</ul>
<h2 id="Additional-Resources" class="common-anchor-header">Risorse aggiuntive<button data-href="#Additional-Resources" class="anchor-icon" translate="no">
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
<li><a href="https://docs.dify.ai/">Documentazione Dify</a></li>
<li><a href="https://milvus.io/docs">Documentazione Milvus</a></li>
<li><a href="https://zilliz.com/learn/vector-database">Fondamenti del database vettoriale</a></li>
<li><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Modelli di implementazione RAG</a></li>
</ul>
