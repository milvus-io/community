---
id: optimizing-billion-scale-image-search-milvus-part-1.md
title: Panoramica
author: Rife Wang
date: 2020-08-04T20:39:09.882Z
desc: >-
  Un caso di studio con UPYUN. Scoprite come Milvus si distingue dalle soluzioni
  di database tradizionali e aiuta a costruire un sistema di ricerca per
  similarità di immagini.
cover: assets.zilliz.com/header_23bbd76c8b.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-1'
---
<custom-h1>Il viaggio verso l'ottimizzazione della ricerca di immagini su scala miliardaria (1/2)</custom-h1><p>Yupoo Picture Manager serve decine di milioni di utenti e gestisce decine di miliardi di immagini. Poiché la galleria degli utenti si sta ampliando, Yupoo ha l'urgente necessità di una soluzione in grado di individuare rapidamente le immagini. In altre parole, quando un utente inserisce un'immagine, il sistema deve trovare l'immagine originale e le immagini simili nella galleria. Lo sviluppo del servizio di ricerca per immagini fornisce un approccio efficace a questo problema.</p>
<p>Il servizio di ricerca per immagini ha subito due evoluzioni:</p>
<ol>
<li>Inizio della prima indagine tecnica all'inizio del 2019 e lancio del sistema di prima generazione nei mesi di marzo e aprile 2019;</li>
<li>ha iniziato a studiare il piano di aggiornamento all'inizio del 2020 e ha avviato l'aggiornamento generale al sistema di seconda generazione nell'aprile 2020.</li>
</ol>
<p>Questo articolo descrive la scelta della tecnologia e i principi di base delle due generazioni di sistemi di ricerca per immagini sulla base della mia esperienza personale in questo progetto.</p>
<h2 id="Overview" class="common-anchor-header">Panoramica<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="What-is-an-image" class="common-anchor-header">Che cos'è un'immagine?</h3><p>Prima di occuparci di immagini, dobbiamo sapere che cos'è un'immagine.</p>
<p>La risposta è che un'immagine è un insieme di pixel.</p>
<p>Ad esempio, la parte nel riquadro rosso di questa immagine è virtualmente una serie di pixel.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_what_is_an_image_021e0280cc.png" alt="1-what-is-an-image.png" class="doc-image" id="1-what-is-an-image.png" />
   </span> <span class="img-wrapper"> <span>1-cosa-è-un'immagine.png</span> </span></p>
<p>Supponiamo che la parte nel riquadro rosso sia un'immagine, allora ogni quadratino indipendente nell'immagine è un pixel, l'unità di informazione di base. Quindi, la dimensione dell'immagine è 11 x 11 px.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_what_is_an_image_602a91b4a0.png" alt="2-what-is-an-image.png" class="doc-image" id="2-what-is-an-image.png" />
   </span> <span class="img-wrapper"> <span>2-cosa-è-un'immagine.png</span> </span></p>
<h3 id="Mathematical-representation-of-images" class="common-anchor-header">Rappresentazione matematica delle immagini</h3><p>Ogni immagine può essere rappresentata da una matrice. Ogni pixel dell'immagine corrisponde a un elemento della matrice.</p>
<h3 id="Binary-images" class="common-anchor-header">Immagini binarie</h3><p>I pixel di un'immagine binaria sono bianchi o neri, quindi ogni pixel può essere rappresentato da 0 o 1. Ad esempio, la rappresentazione matriciale di un'immagine binaria 4 * 4 è:</p>
<pre><code translate="no">0 1 0 1
1 0 0 0
1 1 1 0
0 0 1 0
</code></pre>
<h3 id="RGB-images" class="common-anchor-header">Immagini RGB</h3><p>I tre colori primari (rosso, verde e blu) possono essere mescolati per produrre qualsiasi colore. Per le immagini RGB, ogni pixel ha le informazioni di base di tre canali RGB. Analogamente, se ogni canale utilizza un numero a 8 bit (in 256 livelli) per rappresentare la sua scala di grigi, la rappresentazione matematica di un pixel è la seguente:</p>
<pre><code translate="no">([0 .. 255], [0 .. 255], [0 .. 255])
</code></pre>
<p>Prendendo come esempio un'immagine RGB 4*4:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_4_x_4_rgb_image_136cec77ce.png" alt="3-4-x-4-rgb-image.png" class="doc-image" id="3-4-x-4-rgb-image.png" />
   </span> <span class="img-wrapper"> <span>3-4-x-4-rgb-image.png</span> </span></p>
<p>L'essenza dell'elaborazione delle immagini consiste nell'elaborare queste matrici di pixel.</p>
<h2 id="The-technical-problem-of-search-by-image" class="common-anchor-header">Il problema tecnico della ricerca per immagini<button data-href="#The-technical-problem-of-search-by-image" class="anchor-icon" translate="no">
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
    </button></h2><p>Se si cerca l'immagine originale, cioè un'immagine con esattamente gli stessi pixel, è possibile confrontare direttamente i loro valori MD5. Tuttavia, le immagini caricate su Internet sono spesso compresse o filigranate. Anche un piccolo cambiamento in un'immagine può creare un risultato MD5 diverso. Finché c'è incoerenza nei pixel, è impossibile trovare l'immagine originale.</p>
<p>Per un sistema di ricerca per immagine, vogliamo cercare immagini con contenuti simili. Dobbiamo quindi risolvere due problemi fondamentali:</p>
<ul>
<li>Rappresentare o astrarre un'immagine in un formato di dati che possa essere elaborato da un computer.</li>
<li>I dati devono essere comparabili per il calcolo.</li>
</ul>
<p>In particolare, abbiamo bisogno delle seguenti caratteristiche:</p>
<ul>
<li>Estrazione delle caratteristiche dell'immagine.</li>
<li>Calcolo delle caratteristiche (calcolo della somiglianza).</li>
</ul>
<h2 id="The-first-generation-search-by-image-system" class="common-anchor-header">Il sistema di ricerca per immagini di prima generazione<button data-href="#The-first-generation-search-by-image-system" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Feature-extraction--image-abstraction" class="common-anchor-header">Estrazione delle caratteristiche - astrazione dell'immagine</h3><p>Il sistema di ricerca per immagini di prima generazione utilizza l'algoritmo Perceptual hash o pHash per l'estrazione delle caratteristiche. Quali sono le basi di questo algoritmo?</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_first_generation_image_search_ffd7088158.png" alt="4-first-generation-image-search.png" class="doc-image" id="4-first-generation-image-search.png" />
   </span> <span class="img-wrapper"> <span>4-prima-generazione-immagine-ricerca.png</span> </span></p>
<p>Come mostrato nella figura precedente, l'algoritmo pHash esegue una serie di trasformazioni sull'immagine per ottenere il valore hash. Durante il processo di trasformazione, l'algoritmo astrae continuamente le immagini, avvicinando così i risultati di immagini simili.</p>
<h3 id="Feature-calculation--similarity-calculation" class="common-anchor-header">Calcolo delle caratteristiche - calcolo della somiglianza</h3><p>Come calcolare la somiglianza tra i valori di pHash di due immagini? La risposta è utilizzare la distanza di Hamming. Quanto più piccola è la distanza di Hamming, tanto più simile è il contenuto delle immagini.</p>
<p>Che cos'è la distanza di Hamming? È il numero di bit diversi.</p>
<p>Ad esempio,</p>
<pre><code translate="no">Value 1： 0 1 0 1 0
Value 2： 0 0 0 1 1
</code></pre>
<p>Ci sono due bit diversi nei due valori di cui sopra, quindi la distanza di Hamming tra loro è 2.</p>
<p>Ora conosciamo il principio del calcolo della somiglianza. La domanda successiva è: come calcolare le distanze di Hamming di 100 milioni di dati su 100 milioni di immagini? In breve, come cercare immagini simili?</p>
<p>Nella fase iniziale del progetto, non ho trovato uno strumento (o un motore di calcolo) soddisfacente in grado di calcolare rapidamente la distanza di Hamming. Così ho cambiato il mio piano.</p>
<p>La mia idea è che se la distanza di Hamming di due valori di pHash è piccola, allora posso tagliare i valori di pHash e le piccole parti corrispondenti saranno probabilmente uguali.</p>
<p>Per esempio:</p>
<pre><code translate="no">Value 1： 8 a 0 3 0 3 f 6
Value 2： 8 a 0 3 0 3 d 8
</code></pre>
<p>Dividiamo i due valori di cui sopra in otto segmenti e i valori di sei segmenti sono esattamente uguali. Si può dedurre che la loro distanza di Hamming è vicina e quindi queste due immagini sono simili.</p>
<p>Dopo la trasformazione, si può notare che il problema del calcolo della distanza di Hamming è diventato un problema di equivalenza. Se divido ogni valore di pHash in otto segmenti, se ci sono più di cinque segmenti che hanno esattamente gli stessi valori, allora i due valori di pHash sono simili.</p>
<p>È quindi molto semplice risolvere la corrispondenza di equivalenza. Possiamo utilizzare il classico filtraggio di un sistema di database tradizionale.</p>
<p>Naturalmente, io uso la corrispondenza a più termini e specifico il grado di corrispondenza usando minimum_should_match in ElasticSearch (questo articolo non introduce il principio di ES, potete impararlo da soli).</p>
<p>Perché scegliere ElasticSearch? In primo luogo, offre la funzione di ricerca di cui sopra. In secondo luogo, il progetto di gestione delle immagini utilizza ES per fornire una funzione di ricerca full-text ed è molto economico utilizzare le risorse esistenti.</p>
<h2 id="Summary-of-the-first-generation-system" class="common-anchor-header">Sintesi del sistema di prima generazione<button data-href="#Summary-of-the-first-generation-system" class="anchor-icon" translate="no">
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
    </button></h2><p>Il sistema di ricerca per immagini di prima generazione sceglie la soluzione pHash + ElasticSearch, che presenta le seguenti caratteristiche:</p>
<ul>
<li>L'algoritmo pHash è semplice da usare e può resistere a un certo grado di compressione, watermark e rumore.</li>
<li>ElasticSearch utilizza le risorse esistenti del progetto senza aggiungere ulteriori costi alla ricerca.</li>
<li>Ma il limite di questo sistema è evidente: l'algoritmo pHash è una rappresentazione astratta dell'intera immagine. Una volta distrutta l'integrità dell'immagine, ad esempio aggiungendo un bordo nero all'immagine originale, è quasi impossibile giudicare la somiglianza tra l'originale e le altre.</li>
</ul>
<p>Per superare queste limitazioni, è nato il sistema di ricerca di immagini di seconda generazione con una tecnologia di base completamente diversa.</p>
<p>Questo articolo è stato scritto da rifewang, utente di Milvus e ingegnere informatico di UPYUN. Se vi piace questo articolo, venite a salutarci! https://github.com/rifewang</p>
