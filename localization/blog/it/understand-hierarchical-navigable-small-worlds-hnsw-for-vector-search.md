---
id: understand-hierarchical-navigable-small-worlds-hnsw-for-vector-search.md
title: >-
  Comprendere i piccoli mondi navigabili gerarchici (HNSW) per la ricerca
  vettoriale
author: Stefan Webb
date: 2025-05-21T00:00:00.000Z
desc: >-
  HNSW (Hierarchical Navigable Small World) è un algoritmo efficiente per la
  ricerca approssimativa dei vicini utilizzando una struttura a grafo
  stratificata.
cover: assets.zilliz.com/Chat_GPT_Image_May_26_2025_11_56_17_AM_1a84d31090.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, HNSW, Hierarchical Navigable Small Worlds, RAG, vector search'
meta_title: |
  Understand HNSW for Vector Search
origin: >-
  https://milvus.io/blog/understand-hierarchical-navigable-small-worlds-hnsw-for-vector-search.md
---
<p>L'operazione chiave dei <a href="https://milvus.io/blog/what-is-a-vector-database.md">database vettoriali</a> è la <em>ricerca di similarità</em>, che consiste nel trovare i vicini più vicini nel database a un vettore di interrogazione, ad esempio, in base alla distanza euclidea. Un metodo ingenuo calcolerebbe la distanza tra il vettore di interrogazione e ogni vettore memorizzato nel database e prenderebbe il top-K più vicino. Tuttavia, questo metodo non è chiaramente scalabile al crescere delle dimensioni del database. In pratica, una ricerca di similarità ingenua è pratica solo per database con meno di 1 milione di vettori. Come possiamo scalare la nostra ricerca a 10 e 100 milioni o addirittura a miliardi di vettori?</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Descending_a_hierarchy_of_vector_search_indices_cf9fb8060a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: Discesa di una gerarchia di indici di ricerca vettoriale</em></p>
<p>Sono stati sviluppati molti algoritmi e strutture dati per scalare la ricerca di similarità in spazi vettoriali ad alta dimensione a una complessità temporale sub-lineare. In questo articolo spiegheremo e implementeremo un metodo popolare ed efficace chiamato Hierarchical Navigable Small Worlds (HNSW), che è spesso la scelta predefinita per i dataset vettoriali di medie dimensioni. Appartiene alla famiglia dei metodi di ricerca che costruiscono un grafo sui vettori, dove i vertici indicano i vettori e gli spigoli la somiglianza tra di essi. La ricerca viene eseguita navigando nel grafo, nel caso più semplice, attraversando avidamente il vicino del nodo corrente più vicino all'interrogazione e ripetendo fino a raggiungere un minimo locale.</p>
<p>Spiegheremo in modo più dettagliato come viene costruito il grafo di ricerca, come il grafo consente la ricerca e, alla fine, linkeremo un'implementazione di HNSW, realizzata dal sottoscritto, in semplice Python.</p>
<h2 id="Navigable-Small-Worlds" class="common-anchor-header">Piccoli mondi navigabili<button data-href="#Navigable-Small-Worlds" class="anchor-icon" translate="no">
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
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_NSW_graph_created_from_100_randomly_located_2_D_points_3ffccbd6a7.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: Grafo NSW creato da 100 punti 2D posizionati in modo casuale.</em></p>
<p>Come accennato, HNSW costruisce un grafo di ricerca offline prima di poter eseguire una query. L'algoritmo si basa su un lavoro precedente, un metodo chiamato Navigable Small Worlds (NSW). Spiegheremo prima il NSW e da lì sarà banale passare al NSW <em>gerarchico</em>. L'illustrazione qui sopra mostra un grafo di ricerca costruito per NSW su vettori a 2 dimensioni. In tutti gli esempi che seguono, ci limitiamo a vettori bidimensionali per poterli visualizzare.</p>
<h2 id="Constructing-the-Graph" class="common-anchor-header">Costruzione del grafo<button data-href="#Constructing-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>Una NSW è un grafo in cui i vertici rappresentano i vettori e gli spigoli sono costruiti euristicamente a partire dalla somiglianza tra i vettori, in modo che la maggior parte dei vettori sia raggiungibile da qualsiasi punto attraverso un numero ridotto di salti. Questa è la cosiddetta proprietà del "mondo piccolo" che consente una navigazione rapida. Si veda la figura precedente.</p>
<p>Il grafo è inizializzato come vuoto. Si iterano i vettori, aggiungendoli di volta in volta al grafo. Per ogni vettore, partendo da un nodo di ingresso casuale, troviamo avidamente i nodi R più vicini raggiungibili dal punto di ingresso <em>nel grafo finora costruito</em>. Questi nodi R vengono quindi collegati a un nuovo nodo che rappresenta il vettore inserito, potando facoltativamente tutti i nodi vicini che ora hanno più di R vicini. Ripetendo questo processo per tutti i vettori si ottiene il grafo NSW. Si veda l'illustrazione precedente che visualizza l'algoritmo e si faccia riferimento alle risorse alla fine dell'articolo per un'analisi teorica delle proprietà di un grafo costruito in questo modo.</p>
<h2 id="Searching-the-Graph" class="common-anchor-header">Ricerca nel grafo<button data-href="#Searching-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>Abbiamo già visto l'algoritmo di ricerca dal suo utilizzo nella costruzione del grafo. In questo caso, però, il nodo di interrogazione viene fornito dall'utente, anziché essere inserito nel grafo. Partendo da una nota di ingresso casuale, navighiamo avidamente verso il suo vicino più vicino alla query, mantenendo un insieme dinamico dei vettori più vicini incontrati finora. Si veda l'illustrazione precedente. È possibile migliorare l'accuratezza della ricerca iniziando le ricerche da più punti di ingresso casuali e aggregando i risultati, oltre a considerare più vicini a ogni passo. Tuttavia, questi miglioramenti comportano un aumento della latenza.</p>
<custom-h1>Aggiunta della gerarchia</custom-h1><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/adding_hierarchy_0101234812.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Finora abbiamo descritto l'algoritmo NSW e la struttura dei dati che possono aiutarci a scalare la ricerca nello spazio ad alta dimensione. Tuttavia, il metodo soffre di gravi carenze, tra cui il fallimento nelle basse dimensioni, la lentezza della convergenza della ricerca e la tendenza a rimanere intrappolati nei minimi locali.</p>
<p>Gli autori di HNSW hanno risolto questi problemi con tre modifiche a NSW:</p>
<ul>
<li><p>Selezione esplicita dei nodi di ingresso durante la costruzione e la ricerca;</p></li>
<li><p>Separazione degli spigoli in base a scale diverse; e,</p></li>
<li><p>Uso di un'euristica avanzata per selezionare i vicini.</p></li>
</ul>
<p>I primi due sono realizzati con un'idea semplice: costruire <em>una gerarchia di grafi di ricerca</em>. Invece di un singolo grafo, come in NSW, HNSW costruisce una gerarchia di grafi. Ogni grafo, o strato, viene ricercato individualmente nello stesso modo di NSW. Lo strato superiore, che viene cercato per primo, contiene pochissimi nodi, mentre gli strati più profondi includono progressivamente un numero sempre maggiore di nodi, fino ad arrivare allo strato inferiore che include tutti i nodi. Ciò significa che gli strati superiori contengono salti più lunghi attraverso lo spazio vettoriale, consentendo una sorta di ricerca da corso a fine. Vedi sopra per un'illustrazione.</p>
<h2 id="Constructing-the-Graph" class="common-anchor-header">Costruzione del grafico<button data-href="#Constructing-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>L'algoritmo di costruzione funziona come segue: fissiamo in anticipo un numero di strati, <em>L</em>, che corrisponde al valore <em>l=1</em>. Il valore l=1 corrisponderà al livello più grossolano, dove inizia la ricerca, e l=L corrisponderà al livello più denso, dove termina la ricerca. Si itera ogni vettore da inserire e si campiona un livello di inserimento seguendo una <a href="https://en.wikipedia.org/wiki/Geometric_distribution">distribuzione geometrica</a> troncata (rifiutando <em>l &gt; L</em> o impostando <em>l' =</em> min_(l, L)_). Supponiamo di campionare <em>1 &lt; l &lt; L</em> per il vettore corrente. Eseguiamo una ricerca avida sul livello superiore, L, fino a raggiungere il suo minimo locale. Quindi, seguiamo un bordo dal minimo locale nel _L_esimo strato al vettore corrispondente nel _(L-1)_esimo strato e lo usiamo come punto di ingresso per cercare avidamente nel _(L-1)_esimo strato.</p>
<p>Questo processo viene ripetuto fino a raggiungere l'_l_esimo strato. Si inizia quindi a creare i nodi per il vettore da inserire, collegandolo ai suoi vicini più prossimi trovati dalla ricerca avida nel _l_esimo strato finora costruito, navigando verso il _(l-1)_esimo strato e ripetendo fino a quando non si è inserito il vettore nel _1_esimo strato. Un'animazione qui sopra chiarisce questo aspetto</p>
<p>Possiamo notare che questo metodo di costruzione del grafo gerarchico utilizza un'intelligente selezione esplicita del nodo di inserimento per ogni vettore. Cerchiamo nei livelli superiori a quello di inserimento costruito finora, effettuando una ricerca efficiente a partire dalle distanze di rotta. Inoltre, il metodo separa i collegamenti in base a scale diverse in ogni strato: lo strato superiore consente di effettuare salti di lunga durata nello spazio di ricerca, mentre la scala diminuisce fino allo strato inferiore. Entrambe le modifiche aiutano a evitare di rimanere intrappolati in minimi subottimali e ad accelerare la convergenza della ricerca al costo di una memoria aggiuntiva.</p>
<h2 id="Searching-the-Graph" class="common-anchor-header">Ricerca nel grafico<button data-href="#Searching-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>La procedura di ricerca funziona come la fase di costruzione del grafo interno. Partendo dal livello superiore, si naviga avidamente verso il nodo o i nodi più vicini all'interrogazione. Poi seguiamo quel nodo o quei nodi fino al livello successivo e ripetiamo il processo. La nostra risposta è ottenuta dall'elenco dei <em>R</em> più vicini nel livello inferiore, come illustrato dall'animazione qui sopra.</p>
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
    </button></h2><p>I database vettoriali come Milvus forniscono implementazioni altamente ottimizzate e sintonizzate di HNSW, e spesso è il miglior indice di ricerca predefinito per gli insiemi di dati che rientrano nella memoria.</p>
<p>Abbiamo abbozzato una panoramica di alto livello su come e perché HNSW funziona, preferendo le visualizzazioni e l'intuizione alla teoria e alla matematica. Di conseguenza, abbiamo omesso una descrizione esatta degli algoritmi di costruzione e ricerca<a href="https://arxiv.org/abs/1603.09320">[Malkov e Yashushin, 2016</a>; Alg 1-3], l'analisi della complessità della ricerca e della costruzione<a href="https://arxiv.org/abs/1603.09320">[Malkov e Yashushin, 2016</a>; §4.2], e dettagli meno essenziali come un'euristica per scegliere più efficacemente i nodi vicini durante la costruzione<a href="https://arxiv.org/abs/1603.09320">[Malkov e Yashushin, 2016</a>; Alg 5]. Inoltre, abbiamo omesso la discussione degli iperparametri dell'algoritmo, il loro significato e il modo in cui influenzano il trade-off latenza/velocità/memoria<a href="https://arxiv.org/abs/1603.09320">[Malkov e Yashushin, 2016</a>; §4.1]. La comprensione di questi aspetti è importante per l'utilizzo pratico di HNSW.</p>
<p>Le risorse che seguono contengono ulteriori letture su questi argomenti e un'implementazione pedagogica completa in Python (scritta da me) per NSW e HNSW, compreso il codice per produrre le animazioni di questo articolo.</p>
<custom-h1>Risorse</custom-h1><ul>
<li><p>GitHub: "<a href="https://github.com/stefanwebb/hnsw-illustrated">HNSW-Illustrated: Una piccola implementazione di Hierarchical Navigable Small Worlds (HNSW), un algoritmo di ricerca vettoriale, per scopi didattici</a>".</p></li>
<li><p><a href="https://milvus.io/docs/hnsw.md#HNSW">Documentazione HNSW | Milvus</a></p></li>
<li><p><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">Capire i piccoli mondi navigabili gerarchici (HNSW) - Zilliz Learn</a></p></li>
<li><p>Documento su HNSW: "<a href="https://arxiv.org/abs/1603.09320">Efficiente e robusta ricerca approssimata del vicino utilizzando grafi gerarchici navigabili di piccole dimensioni</a>".</p></li>
<li><p>Documento NSW: "<a href="https://publications.hse.ru/pubs/share/folder/x5p6h7thif/128296059.pdf">Algoritmo di nearest neighbor approssimativo basato su grafi navigabili di piccoli mondi</a>".</p></li>
</ul>
