---
id: building-personalized-recommender-systems-milvus-paddlepaddle.md
title: Introduzione di fondo
author: Shiyu Chen
date: 2021-02-24T23:12:34.209Z
desc: >-
  Come costruire un sistema di raccomandazione alimentato dall'apprendimento
  profondo
cover: assets.zilliz.com/header_e6c4a8aee6.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-personalized-recommender-systems-milvus-paddlepaddle
---
<custom-h1>Costruire sistemi di raccomandazione personalizzati con Milvus e PaddlePaddle</custom-h1><h2 id="Background-Introduction" class="common-anchor-header">Introduzione di fondo<button data-href="#Background-Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Con il continuo sviluppo della tecnologia di rete e la continua espansione del commercio elettronico, il numero e la varietà dei prodotti crescono rapidamente e gli utenti devono spendere molto tempo per trovare i prodotti che desiderano acquistare. Si tratta di un sovraccarico di informazioni. Per risolvere questo problema, sono nati i sistemi di raccomandazione.</p>
<p>Il sistema di raccomandazione è un sottoinsieme del sistema di filtraggio delle informazioni, che può essere utilizzato in una serie di settori come i film, la musica, il commercio elettronico e le raccomandazioni di flussi di feed. Il sistema di raccomandazione scopre le esigenze e gli interessi personalizzati dell'utente analizzando e analizzando i suoi comportamenti e raccomanda informazioni o prodotti che possono essere di suo interesse. A differenza dei motori di ricerca, i sistemi di raccomandazione non richiedono agli utenti di descrivere accuratamente le loro esigenze, ma modellano il loro comportamento storico per fornire in modo proattivo le informazioni che soddisfano gli interessi e le esigenze dell'utente.</p>
<p>In questo articolo utilizziamo PaddlePaddle, una piattaforma di deep learning di Baidu, per costruire un modello e combiniamo Milvus, un motore di ricerca a similarità vettoriale, per costruire un sistema di raccomandazione personalizzato in grado di fornire agli utenti informazioni interessanti in modo rapido e accurato.</p>
<h2 id="Data-Preparation" class="common-anchor-header">Preparazione dei dati<button data-href="#Data-Preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>Prendiamo come esempio MovieLens Million Dataset (ml-1m) [1]. Il dataset ml-1m contiene 1.000.000 di recensioni di 4.000 film da parte di 6.000 utenti, raccolte dal laboratorio di ricerca GroupLens. I dati originali includono le caratteristiche del film, le caratteristiche dell'utente e la valutazione del film da parte dell'utente; si può fare riferimento a ml-1m-README [2] .</p>
<p>Il dataset ml-1m include 3 articoli .dat: movies.dat、users.dat e ratings.dat.movies.dat include le caratteristiche del film, vedi esempio sotto:</p>
<pre><code translate="no">MovieID::Title::Genres
1::ToyStory(1995)::Animation|Children's|Comedy
</code></pre>
<p>Questo significa che l'id del film è 1 e il titolo è 《Toy Story》, che è diviso in tre categorie. Queste tre categorie sono animazione, bambini e commedia.</p>
<p>users.dat include le caratteristiche dell'utente, vedi esempio sotto:</p>
<pre><code translate="no">UserID::Gender::Age::Occupation::Zip-code
1::F::1::10::48067
</code></pre>
<p>Questo significa che l'ID utente è 1, di sesso femminile e di età inferiore ai 18 anni. L'ID dell'occupazione è 10.</p>
<p>ratings.dat include le caratteristiche della valutazione dei film, vedi l'esempio seguente:</p>
<p>UserID::MovieID::Rating::Timestamp 1::1193::5::978300760</p>
<p>Cioè, l'utente 1 valuta il film 1193 con 5 punti.</p>
<h2 id="Fusion-Recommendation-Model" class="common-anchor-header">Modello di raccomandazione a fusione<button data-href="#Fusion-Recommendation-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>Nel sistema di raccomandazione personalizzata dei film abbiamo utilizzato il Fusion Recommendation Model [3] che PaddlePaddle ha implementato. Questo modello è stato creato dalla sua pratica industriale.</p>
<p>In primo luogo, si considerano le caratteristiche dell'utente e le caratteristiche del film come input della rete neurale:</p>
<ul>
<li>Le caratteristiche dell'utente incorporano quattro informazioni di attributo: ID utente, sesso, occupazione ed età.</li>
<li>Le caratteristiche del film incorporano tre informazioni: ID del film, ID del tipo di film e nome del film.</li>
</ul>
<p>Per la caratteristica utente, si mappa l'ID utente in una rappresentazione vettoriale con una dimensione di 256, si inserisce lo strato completamente connesso e si esegue un'elaborazione simile per gli altri tre attributi. Quindi le rappresentazioni delle feature dei quattro attributi vengono connesse completamente e aggiunte separatamente.</p>
<p>Per le caratteristiche dei film, l'ID del film viene elaborato in modo simile all'ID dell'utente. L'ID del tipo di film viene immesso direttamente nello strato fully connected sotto forma di vettore, mentre il nome del film viene rappresentato da un vettore a lunghezza fissa utilizzando una rete neurale convoluzionale testuale. Le rappresentazioni delle caratteristiche dei tre attributi vengono poi connesse completamente e aggiunte separatamente.</p>
<p>Dopo aver ottenuto la rappresentazione vettoriale dell'utente e del film, si calcola la somiglianza del coseno tra loro come punteggio del sistema di raccomandazione personalizzata. Infine, il quadrato della differenza tra il punteggio di somiglianza e il punteggio reale dell'utente viene utilizzato come funzione di perdita del modello di regressione.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_user_film_personalized_recommender_Milvus_9ec39f501d.jpg" alt="1-user-film-personalized-recommender-Milvus.jpg" class="doc-image" id="1-user-film-personalized-recommender-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>1-utente-film-personalizzato-raccomandante-Milvus.jpg</span> </span></p>
<h2 id="System-Overview" class="common-anchor-header">Panoramica del sistema<button data-href="#System-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>In combinazione con il modello di raccomandazione a fusione di PaddlePaddle, il vettore di caratteristiche del film generato dal modello viene memorizzato nel motore di ricerca di similarità vettoriale Milvus e la caratteristica dell'utente viene utilizzata come vettore di destinazione da ricercare. La ricerca di similarità viene eseguita in Milvus per ottenere il risultato della query come film raccomandato per l'utente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_system_overview_5652afdca7.jpg" alt="2-system-overview.jpg" class="doc-image" id="2-system-overview.jpg" />
   </span> <span class="img-wrapper"> <span>2-sistema-overview.jpg</span> </span></p>
<blockquote>
<p>Il metodo del prodotto interno (IP) è fornito in Milvus per calcolare la distanza tra i vettori. Dopo aver normalizzato i dati, la somiglianza del prodotto interno è coerente con il risultato della somiglianza del coseno nel modello di raccomandazione di fusione.</p>
</blockquote>
<h2 id="Application-of-Personal-Recommender-System" class="common-anchor-header">Applicazione del sistema di raccomandazione personale<button data-href="#Application-of-Personal-Recommender-System" class="anchor-icon" translate="no">
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
    </button></h2><p>La costruzione di un sistema di raccomandazione personalizzato con Milvus si articola in tre fasi; per i dettagli sul funzionamento si rimanda al Mivus Bootcamp [4].</p>
<h3 id="Step-1Model-Training" class="common-anchor-header">Fase 1: Formazione del modello</h3><pre><code translate="no"># run train.py
    $ python train.py
</code></pre>
<p>L'esecuzione di questo comando genera un modello recommender_system.inference.model nella directory, che può convertire i dati del film e i dati dell'utente in vettori di caratteristiche e generare dati applicativi che Milvus può memorizzare e recuperare.</p>
<h3 id="Step-2Data-Preprocessing" class="common-anchor-header">Passo 2: Preelaborazione dei dati</h3><pre><code translate="no"># Data preprocessing, -f followed by the parameter raw movie data file name
    $ python get_movies_data.py -f movies_origin.txt
</code></pre>
<p>L'esecuzione di questo comando genera i dati di prova movies_data.txt nella directory per ottenere la pre-elaborazione dei dati dei filmati.</p>
<h3 id="Step-3Implementing-Personal-Recommender-System-with-Milvus" class="common-anchor-header">Passo 3: Implementazione del sistema di raccomandazione personale con Milvus</h3><pre><code translate="no"># Implementing personal recommender system based on user conditions
    $ python infer_milvus.py -a &lt;age&gt;-g &lt;gender&gt;-j &lt;job&gt;[-i]
</code></pre>
<p>L'esecuzione di questo comando implementa raccomandazioni personalizzate per gli utenti specificati.</p>
<p>Il processo principale è:</p>
<ul>
<li>Attraverso il load_inference_model, i dati dei film vengono elaborati dal modello per generare un vettore di caratteristiche dei film.</li>
<li>Caricare il vettore di caratteristiche dei film in Milvus tramite milvus.insert.</li>
<li>In base all'età / al sesso / all'occupazione dell'utente specificati dai parametri, viene convertito in un vettore di caratteristiche dell'utente, milvus.search_vectors viene utilizzato per il recupero della somiglianza e viene restituito il risultato con la maggiore somiglianza tra l'utente e il film.</li>
</ul>
<p>Previsione dei primi cinque film a cui l'utente è interessato:</p>
<pre><code translate="no">TopIdsTitleScore
03030Yojimbo2.9444923996925354
13871Shane2.8583481907844543
23467Hud2.849525213241577
31809Hana-bi2.826111316680908
43184Montana2.8119677305221558 
</code></pre>
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
    </button></h2><p>Inserendo le informazioni dell'utente e quelle del film nel modello di raccomandazione fusion è possibile ottenere punteggi di corrispondenza e quindi ordinare i punteggi di tutti i film in base all'utente per raccomandare i film che potrebbero essere di interesse per l'utente. <strong>Questo articolo combina Milvus e PaddlePaddle per costruire un sistema di raccomandazione personalizzato. Milvus, un motore di ricerca vettoriale, viene utilizzato per memorizzare tutti i dati relativi alle caratteristiche dei film, quindi il recupero della somiglianza viene eseguito sulle caratteristiche dell'utente in Milvus.</strong> Il risultato della ricerca è la classifica dei film raccomandati dal sistema all'utente.</p>
<p>Il motore di ricerca per similarità vettoriale di Milvus [5] è compatibile con diverse piattaforme di deep learning e cerca miliardi di vettori con una risposta di soli millisecondi. Con Milvus è possibile esplorare facilmente altre possibilità di applicazioni AI!</p>
<h2 id="Reference" class="common-anchor-header">Riferimento<button data-href="#Reference" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>MovieLens Million Dataset (ml-1m): http://files.grouplens.org/datasets/movielens/ml-1m.zip</li>
<li>ml-1m-README: http://files.grouplens.org/datasets/movielens/ml-1m-README.txt</li>
<li>Modello di raccomandazione a fusione di PaddlePaddle: https://www.paddlepaddle.org.cn/documentation/docs/zh/beginners_guide/basics/recommender_system/index.html#id7</li>
<li>Bootcamp: https://github.com/milvus-io/bootcamp/tree/master/solutions/recommendation_system</li>
<li>Milvus: https://milvus.io/</li>
</ol>
