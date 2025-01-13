---
id: How-we-used-semantic-search-to-make-our-search-10-x-smarter.md
title: Ricerca basata su parole chiave
author: Rahul Yadav
date: 2021-02-05T06:27:15.076Z
desc: >-
  Tokopedia ha utilizzato Milvus per costruire un sistema di ricerca 10 volte
  più intelligente che ha migliorato notevolmente l'esperienza dell'utente.
cover: >-
  assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_1_a7bac91379.jpeg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/How-we-used-semantic-search-to-make-our-search-10-x-smarter
---
<custom-h1>Come abbiamo utilizzato la ricerca semantica per rendere la nostra ricerca 10 volte più intelligente</custom-h1><p>In Tokopedia siamo consapevoli che il valore del nostro corpus di prodotti si libera solo quando i nostri acquirenti possono trovare prodotti rilevanti per loro, quindi ci impegniamo a migliorare la rilevanza dei risultati di ricerca.</p>
<p>Per favorire questo sforzo, stiamo introducendo la <strong>ricerca per similarità</strong> su Tokopedia. Se andate nella pagina dei risultati della ricerca sui dispositivi mobili, troverete un pulsante "..." che espone un menu che vi dà la possibilità di cercare prodotti simili al prodotto.</p>
<h2 id="Keyword-based-search" class="common-anchor-header">Ricerca basata su parole chiave<button data-href="#Keyword-based-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Tokopedia Search utilizza <strong>Elasticsearch</strong> per la ricerca e la classificazione dei prodotti. Per ogni richiesta di ricerca, interroghiamo prima Elasticsearch, che classifica i prodotti in base alla query di ricerca. ElasticSearch memorizza ogni parola come una sequenza di numeri che rappresentano i codici <a href="https://en.wikipedia.org/wiki/ASCII">ASCII</a> (o UTF) per ogni lettera. Costruisce un <a href="https://en.wikipedia.org/wiki/Inverted_index">indice invertito</a> per scoprire rapidamente quali documenti contengono le parole della query dell'utente e poi trova la migliore corrispondenza tra questi utilizzando vari algoritmi di punteggio. Questi algoritmi di punteggio prestano poca attenzione al significato delle parole, ma piuttosto alla loro frequenza nel documento, alla loro vicinanza, ecc. La rappresentazione ASCII contiene ovviamente informazioni sufficienti a trasmettere la semantica (dopotutto noi esseri umani siamo in grado di capirla). Purtroppo, non esiste un buon algoritmo che consenta al computer di confrontare le parole codificate in ASCII in base al loro significato.</p>
<h2 id="Vector-representation" class="common-anchor-header">Rappresentazione vettoriale<button data-href="#Vector-representation" class="anchor-icon" translate="no">
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
    </button></h2><p>Una soluzione a questo problema sarebbe quella di trovare una rappresentazione alternativa, che ci dica non solo le lettere contenute nella parola, ma anche qualcosa sul suo significato. Ad esempio, potremmo codificare <em>quali sono le altre parole con cui la nostra parola viene usata di frequente</em> (rappresentate dal probabile contesto). Potremmo quindi ipotizzare che contesti simili rappresentino cose simili e cercare di confrontarli con metodi matematici. Potremmo anche trovare un modo per codificare intere frasi in base al loro significato.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_2_776af567a8.png" alt="Blog_How we used semantic search to make our search 10x smarter_2.png" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_2.png" />
   </span> <span class="img-wrapper"> <span>Blog_Come abbiamo usato la ricerca semantica per rendere la nostra ricerca 10 volte più intelligente_2.png</span> </span></p>
<h2 id="Select-an-embedding-similarity-search-engine" class="common-anchor-header">Selezionare un motore di ricerca per la similarità di incorporazione<button data-href="#Select-an-embedding-similarity-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Ora che abbiamo i vettori di caratteristiche, il problema rimanente è come recuperare dal grande volume di vettori quelli che sono simili al vettore di destinazione. Per quanto riguarda il motore di ricerca degli embeddings, abbiamo provato il POC su diversi motori disponibili su Github, tra cui FAISS, Vearch e Milvus.</p>
<p>In base ai risultati dei test di carico, preferiamo Milvus agli altri motori. Da un lato, abbiamo già usato FAISS in altri team e quindi vorremmo provare qualcosa di nuovo. Rispetto a Milvus, FAISS è più che altro una libreria sottostante, quindi non è del tutto comodo da usare. Dopo aver imparato di più su Milvus, abbiamo deciso di adottarlo per le sue due caratteristiche principali:</p>
<ul>
<li><p>Milvus è molto facile da usare. È sufficiente prelevare l'immagine Docker e aggiornare i parametri in base al proprio scenario.</p></li>
<li><p>Supporta più indici e dispone di una documentazione di supporto dettagliata.</p></li>
</ul>
<p>In poche parole, Milvus è molto amichevole per gli utenti e la documentazione è abbastanza dettagliata. Se ci si imbatte in qualche problema, di solito è possibile trovare le soluzioni nella documentazione; altrimenti, è sempre possibile ottenere supporto dalla comunità di Milvus.</p>
<h2 id="Milvus-cluster-service" class="common-anchor-header">Servizio cluster Milvus<button data-href="#Milvus-cluster-service" class="anchor-icon" translate="no">
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
    </button></h2><p>Dopo aver deciso di utilizzare Milvus come motore di ricerca vettoriale, abbiamo deciso di usarlo per uno dei nostri casi d'uso del servizio Ads, in cui volevamo abbinare parole chiave <a href="https://www.tradegecko.com/blog/wholesale-management/what-is-fill-rate-and-why-does-it-matter-for-wholesalers">a basso tasso di riempimento</a> con parole chiave ad alto tasso di riempimento. Abbiamo configurato un nodo autonomo in un ambiente di sviluppo (DEV) e abbiamo iniziato il servizio, che ha funzionato bene per alcuni giorni e ci ha fornito metriche CTR/CVR migliori. Se un nodo standalone si bloccasse in produzione, l'intero servizio diventerebbe indisponibile. Pertanto, è necessario implementare un servizio di ricerca ad alta disponibilità.</p>
<p>Milvus fornisce sia Mishards, un middleware di sharding per cluster, sia Milvus-Helm per la configurazione. In Tokopedia utilizziamo i playbook Ansible per la configurazione dell'infrastruttura, quindi abbiamo creato un playbook per l'orchestrazione dell'infrastruttura. Il diagramma sottostante, tratto dalla documentazione di Milvus, mostra il funzionamento di Mishards:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_3_4fa0c8a1a1.png" alt="Blog_How we used semantic search to make our search 10x smarter_3.png" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_3.png" />
   </span> <span class="img-wrapper"> <span>Blog_Come abbiamo usato la ricerca semantica per rendere la nostra ricerca 10 volte più intelligente_3.png</span> </span></p>
<p>Mishards esegue una richiesta a cascata da upstream verso i suoi sottomoduli, suddividendo la richiesta a monte, e poi raccoglie e restituisce i risultati dei sottoservizi a upstream. L'architettura complessiva della soluzione cluster basata su Mishards è mostrata di seguito: <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_4_724618be4e.jpeg" alt="Blog_How we used semantic search to make our search 10x smarter_4.jpeg" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_4.jpeg" /><span>Blog_Come abbiamo usato la ricerca semantica per rendere la nostra ricerca 10 volte più intelligente_4.jpeg</span> </span></p>
<p>La documentazione ufficiale fornisce una chiara introduzione a Mishards. Se siete interessati, potete fare riferimento a <a href="https://milvus.io/cn/docs/v0.10.2/mishards.md">Mishards</a>.</p>
<p>Nel nostro servizio keyword-to-keyword, abbiamo distribuito un nodo scrivibile, due nodi di sola lettura e un'istanza del middleware Mishards in GCP, utilizzando Milvus ansible. Finora è stato stabile. Una componente importante di ciò che rende possibile interrogare in modo efficiente gli insiemi di dati vettoriali da un milione, un miliardo o addirittura un trilione su cui si basano i motori di ricerca per similarità è l'<a href="https://milvus.io/docs/v0.10.5/index.md">indicizzazione</a>, un processo di organizzazione dei dati che accelera drasticamente la ricerca sui big data.</p>
<h2 id="How-does-vector-indexing-accelerate-similarity-search" class="common-anchor-header">In che modo l'indicizzazione vettoriale accelera la ricerca per similarità?<button data-href="#How-does-vector-indexing-accelerate-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>I motori di ricerca per similarità funzionano confrontando l'input con un database per trovare gli oggetti più simili all'input. L'indicizzazione è il processo di organizzazione efficiente dei dati e svolge un ruolo fondamentale nel rendere utile la ricerca per similarità, accelerando drasticamente le interrogazioni che richiedono molto tempo su grandi insiemi di dati. Una volta indicizzato un enorme insieme di dati vettoriali, le query possono essere indirizzate verso i cluster, o sottoinsiemi di dati, che hanno maggiori probabilità di contenere vettori simili alla query di input. In pratica, questo significa sacrificare un certo grado di accuratezza per velocizzare le interrogazioni su dati vettoriali molto grandi.</p>
<p>Si può fare un'analogia con un dizionario, dove le parole sono ordinate alfabeticamente. Quando si cerca una parola, è possibile navigare rapidamente verso una sezione che contiene solo parole con la stessa iniziale, accelerando drasticamente la ricerca della definizione della parola inserita.</p>
<h2 id="What-next-you-ask" class="common-anchor-header">E poi?<button data-href="#What-next-you-ask" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_5_035480c8af.jpeg" alt="Blog_How we used semantic search to make our search 10x smarter_5.jpeg" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_5.jpeg" />
   </span> <span class="img-wrapper"> <span>Blog_Come abbiamo usato la ricerca semantica per rendere la nostra ricerca 10 volte più intelligente_5.jpeg</span> </span></p>
<p>Come si è visto, non esiste una soluzione che vada bene per tutti: vogliamo sempre migliorare le prestazioni del modello utilizzato per ottenere le incorporazioni.</p>
<p>Inoltre, da un punto di vista tecnico, vogliamo eseguire più modelli di apprendimento contemporaneamente e confrontare i risultati dei vari esperimenti. Seguite questo spazio per ulteriori informazioni sui nostri esperimenti, come la ricerca di immagini e video.</p>
<p><br/></p>
<h2 id="References" class="common-anchor-header">Riferimenti:<button data-href="#References" class="anchor-icon" translate="no">
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
<li>Documenti Mishards: https://milvus.io/docs/v0.10.2/mishards.md</li>
<li>Mishards: https://github.com/milvus-io/milvus/tree/master/shards</li>
<li>Milvus-Helm: https://github.com/milvus-io/milvus-helm/tree/master/charts/milvus</li>
</ul>
<p><br/></p>
<p><em>Questo articolo del blog è stato ripostato da: https://medium.com/tokopedia-engineering/how-we-used-semantic-search-to-make-our-search-10x-smarter-bd9c7f601821</em></p>
<p>Leggete le altre <a href="https://zilliz.com/user-stories">storie degli utenti per</a> saperne di più sulla realizzazione di oggetti con Milvus.</p>
