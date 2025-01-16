---
id: building-intelligent-chatbot-with-nlp-and-milvus.md
title: Architettura generale
author: milvus
date: 2020-05-12T22:33:34.726Z
desc: Il bot QA di nuova generazione è qui
cover: assets.zilliz.com/header_ce3a0e103d.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/building-intelligent-chatbot-with-nlp-and-milvus'
---
<custom-h1>Costruire un sistema di QA intelligente con NLP e Milvus</custom-h1><p>Progetto Milvus：github.com/milvus-io/milvus</p>
<p>Il sistema di risposta alle domande è comunemente utilizzato nel campo dell'elaborazione del linguaggio naturale. Viene utilizzato per rispondere a domande in forma di linguaggio naturale e ha un'ampia gamma di applicazioni. Le applicazioni tipiche includono: interazione vocale intelligente, servizio clienti online, acquisizione di conoscenze, chat emozionale personalizzata e altro ancora. La maggior parte dei sistemi di risposta alle domande può essere classificata in: sistemi di risposta alle domande generativi e di recupero, sistemi di risposta alle domande a turno singolo e a turno multiplo, sistemi di risposta alle domande aperti e sistemi di risposta alle domande specifici.</p>
<p>Questo articolo si occupa principalmente di un sistema di AQ progettato per un settore specifico, che di solito viene chiamato robot intelligente per il servizio clienti. In passato, la costruzione di un robot di assistenza clienti richiedeva solitamente la conversione della conoscenza del dominio in una serie di regole e grafi di conoscenza. Il processo di costruzione si basa molto sull'intelligenza "umana". Con l'applicazione del deep learning nell'elaborazione del linguaggio naturale (NLP), la lettura automatica può trovare automaticamente le risposte alle domande corrispondenti direttamente dai documenti. Il modello linguistico di deep learning converte le domande e i documenti in vettori semantici per trovare la risposta corrispondente.</p>
<p>Questo articolo utilizza il modello BERT open source di Google e Milvus, un motore di ricerca vettoriale open source, per costruire rapidamente un bot Q&amp;A basato sulla comprensione semantica.</p>
<h2 id="Overall-Architecture" class="common-anchor-header">Architettura generale<button data-href="#Overall-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Questo articolo implementa un sistema di risposta alle domande attraverso la corrispondenza di similarità semantica. Il processo generale di costruzione è il seguente:</p>
<ol>
<li>Ottenere un gran numero di domande con risposte in un campo specifico (un set di domande standard).</li>
<li>Utilizzare il modello BERT per convertire queste domande in vettori di caratteristiche e memorizzarle in Milvus. Milvus assegnerà contemporaneamente un ID vettore a ciascun vettore di caratteristiche.</li>
<li>Memorizzare questi ID rappresentativi delle domande e le risposte corrispondenti in PostgreSQL.</li>
</ol>
<p>Quando un utente pone una domanda:</p>
<ol>
<li>Il modello BERT la converte in un vettore di caratteristiche.</li>
<li>Milvus esegue una ricerca di similarità e recupera l'ID più simile alla domanda.</li>
<li>PostgreSQL restituisce la risposta corrispondente.</li>
</ol>
<p>Il diagramma dell'architettura del sistema è il seguente (le linee blu rappresentano il processo di importazione e quelle gialle il processo di interrogazione):</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_system_architecture_milvus_bert_postgresql_63de466754.png" alt="1-system-architecture-milvus-bert-postgresql.png" class="doc-image" id="1-system-architecture-milvus-bert-postgresql.png" />
   </span> <span class="img-wrapper"> <span>1-sistema-architettura-milvus-bert-postgresql.png</span> </span></p>
<p>Di seguito, vi mostreremo come costruire un sistema di domande e risposte online passo dopo passo.</p>
<h2 id="Steps-to-Build-the-QA-System" class="common-anchor-header">Passi per costruire il sistema Q&amp;A<button data-href="#Steps-to-Build-the-QA-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Prima di iniziare, è necessario installare Milvus e PostgreSQL. Per i passaggi specifici dell'installazione, consultare il sito ufficiale di Milvus.</p>
<h3 id="1-Data-preparation" class="common-anchor-header">1. Preparazione dei dati</h3><p>I dati sperimentali presentati in questo articolo provengono da: https://github.com/chatopera/insuranceqa-corpus-zh.</p>
<p>Il set di dati contiene coppie di domande e risposte relative al settore assicurativo. In questo articolo vengono estratte 20.000 coppie di domande e risposte. Grazie a questo set di dati di domande e risposte, è possibile costruire rapidamente un robot di assistenza clienti per il settore assicurativo.</p>
<h3 id="2-Generate-feature-vectors" class="common-anchor-header">2. Generare vettori di caratteristiche</h3><p>Questo sistema utilizza un modello preaddestrato dal BERT. Scaricatelo dal link sottostante prima di avviare un servizio: https://storage.googleapis.com/bert_models/2018_10_18/cased_L-24_H-1024_A-16.zip.</p>
<p>Il modello viene utilizzato per convertire il database delle domande in vettori di caratteristiche per la futura ricerca di somiglianze. Per ulteriori informazioni sul servizio BERT, vedere https://github.com/hanxiao/bert-as-service.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_code_block_e1b2021a91.png" alt="2-code-block.png" class="doc-image" id="2-code-block.png" />
   </span> <span class="img-wrapper"> <span>2-codice-blocco.png</span> </span></p>
<h3 id="3-Import-to-Milvus-and-PostgreSQL" class="common-anchor-header">3. Importazione in Milvus e PostgreSQL</h3><p>Normalizzare e importare i vettori di caratteristiche generati in Milvus, quindi importare gli ID restituiti da Milvus e le risposte corrispondenti in PostgreSQL. Di seguito è riportata la struttura della tabella in PostgreSQL:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_import_milvus_postgresql_bb2a258c61.png" alt="3-import-milvus-postgresql.png" class="doc-image" id="3-import-milvus-postgresql.png" />
   </span> <span class="img-wrapper"> <span>3-import-milvus-postgresql.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_import_milvus_postgresql_2abc29a4c4.png" alt="4-import-milvus-postgresql.png" class="doc-image" id="4-import-milvus-postgresql.png" />
   </span> <span class="img-wrapper"> <span>4-import-milvus-postgresql.png</span> </span></p>
<h3 id="4-Retrieve-Answers" class="common-anchor-header">4. Recupero delle risposte</h3><p>L'utente inserisce una domanda e, dopo aver generato il vettore di caratteristiche tramite BERT, può trovare la domanda più simile nella libreria Milvus. Questo articolo utilizza la distanza del coseno per rappresentare la somiglianza tra due frasi. Poiché tutti i vettori sono normalizzati, più la distanza del coseno dei due vettori di caratteristiche è vicina a 1, maggiore è la somiglianza.</p>
<p>In pratica, il sistema potrebbe non avere domande perfettamente corrispondenti nella libreria. Si può quindi impostare una soglia di 0,9. Se la distanza di somiglianza maggiore recuperata è inferiore a questa soglia, il sistema segnalerà di non includere le domande correlate.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_retrieve_answers_6424db1032.png" alt="4-retrieve-answers.png" class="doc-image" id="4-retrieve-answers.png" />
   </span> <span class="img-wrapper"> <span>4-recupero-risposte.png</span> </span></p>
<h2 id="System-Demonstration" class="common-anchor-header">Dimostrazione del sistema<button data-href="#System-Demonstration" class="anchor-icon" translate="no">
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
    </button></h2><p>Di seguito viene mostrato un esempio di interfaccia del sistema:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_milvus_QA_system_application_e5860cee42.png" alt="5-milvus-QA-system-application.png" class="doc-image" id="5-milvus-qa-system-application.png" />
   </span> <span class="img-wrapper"> <span>5-milvus-QA-system-application.png</span> </span></p>
<p>Inserite la vostra domanda nella finestra di dialogo e riceverete la risposta corrispondente:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_milvus_QA_system_application_2_8064237e2a.png" alt="5-milvus-QA-system-application-2.png" class="doc-image" id="5-milvus-qa-system-application-2.png" />
   </span> <span class="img-wrapper"> <span>5-milvus-QA-system-application-2.png</span> </span></p>
<h2 id="Summary" class="common-anchor-header">Riassunto<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Dopo aver letto questo articolo, speriamo che sia facile costruire il proprio sistema Q&amp;A.</p>
<p>Con il modello BERT, non è più necessario ordinare e organizzare preventivamente i corpora di testo. Allo stesso tempo, grazie alle elevate prestazioni e all'alta scalabilità del motore di ricerca vettoriale open source Milvus, il vostro sistema di QA può supportare un corpus di centinaia di milioni di testi.</p>
<p>Milvus si è ufficialmente unito alla Linux AI (LF AI) Foundation per l'incubazione. Siete invitati a unirvi alla comunità di Milvus e a lavorare con noi per accelerare l'applicazione delle tecnologie AI!</p>
<p>=&gt; Provate la nostra demo online qui: https://www.milvus.io/scenarios</p>
