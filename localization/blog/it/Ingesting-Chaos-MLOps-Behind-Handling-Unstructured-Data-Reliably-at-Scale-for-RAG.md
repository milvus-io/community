---
id: >-
  Ingesting-Chaos-MLOps-Behind-Handling-Unstructured-Data-Reliably-at-Scale-for-RAG.md
title: >-
  Ingerire il caos: Le MLOP dietro la gestione affidabile dei dati non
  strutturati su scala per RAG
author: David Garnitz
date: 2023-10-16T00:00:00.000Z
cover: assets.zilliz.com/Ingesting_Chaos_20231017_110103_54fe2009cb.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Retrieval Augmented Generation, RAG, Unstructured Data
recommend: true
desc: >-
  Grazie a tecnologie come VectorFlow e Milvus, il team può eseguire test
  efficienti in ambienti diversi, rispettando al contempo i requisiti di privacy
  e sicurezza.
canonicalUrl: >-
  https://milvus.io/blog/Ingesting-Chaos-MLOps-Behind-Handling-Unstructured-Data-Reliably-at-Scale-for-RAG.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ingesting_Chaos_20231017_110103_54fe2009cb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>I dati vengono generati più velocemente che mai, in ogni forma immaginabile. Questi dati sono la benzina che alimenterà una nuova ondata di applicazioni di intelligenza artificiale, ma questi motori di miglioramento della produttività devono essere aiutati a ingerire questo carburante. L'ampia gamma di scenari e casi limite che circondano i dati non strutturati ne rende difficile l'utilizzo nei sistemi di intelligenza artificiale di produzione.</p>
<p>Per cominciare, esiste un gran numero di fonti di dati. Queste esportano i dati in vari formati di file, ognuno con le sue eccentricità. Ad esempio, il modo in cui si elabora un PDF varia notevolmente a seconda della sua provenienza. L'acquisizione di un PDF per un caso di contenzioso sui titoli si concentrerà probabilmente sui dati testuali. Al contrario, le specifiche di progettazione di un sistema per un ingegnere missilistico saranno piene di diagrammi che richiedono un'elaborazione visiva. La mancanza di uno schema definito nei dati non strutturati aggiunge ulteriore complessità. Anche quando la sfida dell'elaborazione dei dati è superata, rimane il problema di ingerire i dati su scala. I file possono avere dimensioni molto diverse, il che cambia il modo in cui vengono elaborati. È possibile elaborare rapidamente un upload di 1 MB su un'API via HTTP, ma la lettura di decine di GB da un singolo file richiede lo streaming e un worker dedicato.</p>
<p>Il superamento di queste sfide tradizionali dell'ingegneria dei dati è una questione di principio per la connessione dei dati grezzi agli <a href="https://zilliz.com/glossary/large-language-models-(llms)">LLM</a> tramite <a href="https://zilliz.com/learn/what-is-vector-database">database vettoriali</a> come <a href="https://github.com/milvus-io/milvus">Milvus</a>. Tuttavia, i casi d'uso emergenti, come l'esecuzione di ricerche di similarità semantica con l'aiuto di un database vettoriale, richiedono nuove fasi di elaborazione, come la suddivisione dei dati di origine, l'orchestrazione dei metadati per le ricerche ibride, la scelta del modello di incorporazione vettoriale più adatto e la messa a punto dei parametri di ricerca per determinare quali dati fornire all'LLM. Questi flussi di lavoro sono così nuovi che non esistono best practice consolidate da seguire per gli sviluppatori. Al contrario, essi devono sperimentare per trovare la configurazione e il caso d'uso corretti per i loro dati. Per accelerare questo processo, l'uso di una pipeline di incorporazione vettoriale per gestire l'ingestione dei dati nel database vettoriale è prezioso.</p>
<p>Una pipeline di incorporazione vettoriale come <a href="https://github.com/dgarnitz/vectorflow">VectorFlow</a> collega i dati grezzi al database vettoriale, compresi chunking, orchestrazione dei metadati, incorporazione e caricamento. VectorFlow consente ai team di ingegneri di concentrarsi sulla logica dell'applicazione principale, sperimentando i diversi parametri di recupero generati dal modello di embedding, la strategia di chunking, i campi dei metadati e gli aspetti della ricerca per vedere cosa funziona meglio.</p>
<p>Nel nostro lavoro di assistenza ai team di ingegneri per il passaggio dei loro sistemi di <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">retrieval augmented generation (RAG)</a> dal prototipo alla produzione, abbiamo osservato che il seguente approccio è efficace per testare i diversi parametri di una pipeline di ricerca RAG:</p>
<ol>
<li>Utilizzare un piccolo insieme di dati con cui si ha familiarità per la velocità di iterazione, ad esempio alcuni PDF in cui sono presenti parti rilevanti per le query di ricerca.</li>
<li>Creare un insieme standard di domande e risposte su quel sottoinsieme di dati. Ad esempio, dopo aver letto i PDF, scrivete un elenco di domande e chiedete al vostro team di concordare le risposte.</li>
<li>Creare un sistema di valutazione automatizzato che attribuisca un punteggio al rendimento del reperimento per ogni domanda. Un modo per farlo è quello di prendere la risposta dal sistema RAG e farla passare di nuovo attraverso il LLM con una richiesta che chiede se questo risultato RAG risponde alla domanda data la risposta corretta. La risposta dovrebbe essere un "sì" o un "no". Ad esempio, se i documenti contengono 25 domande e il sistema ne risolve 20, è possibile utilizzare questo dato per effettuare un benchmark rispetto ad altri approcci.</li>
<li>Assicurarsi di utilizzare per la valutazione un LLM diverso da quello utilizzato per codificare le incorporazioni vettoriali memorizzate nel database. L'LLM di valutazione è tipicamente un decodificatore di un modello come il GPT-4. Una cosa da ricordare è il costo di queste valutazioni quando vengono eseguite ripetutamente. Modelli open-source come Llama2 70B o Deci AI LLM 6B, che possono essere eseguiti su una singola GPU più piccola, hanno più o meno le stesse prestazioni a una frazione del costo.</li>
<li>Eseguite ogni test più volte e fate una media dei punteggi per attenuare la stocasticità dell'LLM.</li>
</ol>
<p>Mantenendo costanti tutte le opzioni tranne una, è possibile determinare rapidamente quali parametri funzionano meglio per il proprio caso d'uso. Una pipeline di incorporazione vettoriale come VectorFlow semplifica particolarmente il processo di ingestione, dove è possibile provare rapidamente diverse strategie di chunking, lunghezze di chunk, sovrapposizioni di chunk e modelli di incorporazione open-source per vedere quale porta ai risultati migliori. Questo è particolarmente utile quando il set di dati ha diversi tipi di file e fonti di dati che richiedono una logica personalizzata.</p>
<p>Una volta che il team sa cosa funziona per il proprio caso d'uso, la pipeline di incorporazione vettoriale consente di passare rapidamente alla produzione senza dover riprogettare il sistema per tenere conto di aspetti quali l'affidabilità e il monitoraggio. Grazie a tecnologie come VectorFlow e <a href="https://zilliz.com/what-is-milvus">Milvus</a>, che sono open-source e indipendenti dalla piattaforma, il team può eseguire test efficienti in ambienti diversi, rispettando i requisiti di privacy e sicurezza.</p>
