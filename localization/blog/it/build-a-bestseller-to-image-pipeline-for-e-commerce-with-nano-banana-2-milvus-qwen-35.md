---
id: >-
  build-a-bestseller-to-image-pipeline-for-e-commerce-with-nano-banana-2-milvus-qwen-35.md
title: >-
  Costruire una pipeline da bestseller a immagine per l'e-commerce con Nano
  Banana 2 + Milvus + Qwen 3.5
author: Lumina Wang
date: 2026-3-3
cover: assets.zilliz.com/blog-images/20260303-100432.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: >-
  Nano Banana 2, Milvus, e-commerce AI image generation, AI product photography,
  vector search
meta_keywords: >-
  Nano Banana 2, Milvus, e-commerce AI image generation, AI product photography,
  vector search
meta_title: |
  Nano Banana 2 + Milvus: E-Commerce AI Image Generation Tutorial
desc: >-
  Tutorial passo dopo passo: utilizzare Nano Banana 2, la ricerca ibrida Milvus
  e Qwen 3.5 per generare foto di prodotti per l'e-commerce a partire da
  flat-lay a un terzo del costo.
origin: >-
  https://milvus.io/blog/build-a-bestseller-to-image-pipeline-for-e-commerce-with-nano-banana-2-milvus-qwen-35.md
---
<p>Se costruite strumenti di intelligenza artificiale per i venditori di e-commerce, probabilmente avete sentito questa richiesta migliaia di volte: "Ho un nuovo prodotto. Datemi un'immagine promozionale che sembri appartenere a un bestseller. Senza fotografo, senza studio, e che sia economica".</p>
<p>Questo è il problema in una frase. I venditori dispongono di foto piatte e di un catalogo di bestseller che già convertono. Vogliono creare un ponte tra le due cose con l'intelligenza artificiale, in modo rapido e su scala.</p>
<p>Quando Google ha rilasciato Nano Banana 2 (Gemini 3.1 Flash Image) il 26 febbraio 2026, l'abbiamo testata il giorno stesso e integrata nella nostra pipeline di recupero esistente basata su Milvus. Il risultato: il costo totale di generazione delle immagini è sceso a circa un terzo di quanto speso in precedenza e il throughput è raddoppiato. La riduzione del prezzo per immagine (circa il 50% in meno rispetto a Nano Banana Pro) spiega in parte questo risultato, ma il risparmio maggiore deriva dall'eliminazione totale dei cicli di rielaborazione.</p>
<p>Questo articolo illustra i vantaggi di Nano Banana 2 per l'e-commerce, i punti deboli e un'esercitazione pratica per la pipeline completa: La ricerca ibrida di <strong>Milvus</strong> per trovare bestseller visivamente simili, <strong>Qwen</strong> 3.5 per l'analisi dello stile e <strong>Nano Banana 2</strong> per la generazione finale.</p>
<h2 id="What’s-New-with-Nano-Banana-2" class="common-anchor-header">Cosa c'è di nuovo in Nano Banana 2?<button data-href="#What’s-New-with-Nano-Banana-2" class="anchor-icon" translate="no">
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
    </button></h2><p>Nano Banana 2 (Gemini 3.1 Flash Image) è stato lanciato il 26 febbraio 2026. Porta la maggior parte delle funzionalità di Nano Banana Pro sull'architettura Flash, il che significa una generazione più veloce a un prezzo inferiore. Ecco i principali aggiornamenti:</p>
<ul>
<li><strong>Qualità di livello professionale alla velocità di Flash.</strong> Nano Banana 2 offre una conoscenza, un ragionamento e una fedeltà visiva di livello mondiale, in precedenza esclusiva di Pro, ma con la latenza e il throughput di Flash.</li>
<li><strong>Uscita da 512px a 4K.</strong> Quattro livelli di risoluzione (512px, 1K, 2K, 4K) con supporto nativo. Il livello da 512px è nuovo ed esclusivo di Nano Banana 2.</li>
<li><strong>14 rapporti di aspetto.</strong> Aggiunge 4:1, 1:4, 8:1 e 1:8 al set esistente (1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9).</li>
<li><strong>Fino a 14 immagini di riferimento.</strong> Mantiene la somiglianza dei personaggi fino a 5 e la fedeltà degli oggetti fino a 14 in un unico flusso di lavoro.</li>
<li><strong>Rendering del testo migliorato.</strong> Genera un testo leggibile e accurato in più lingue, con supporto per la traduzione e la localizzazione in un'unica generazione.</li>
<li><strong>Ricerca per immagini.</strong> Utilizza dati web in tempo reale e immagini provenienti da Google Search per generare rappresentazioni più accurate di soggetti reali.</li>
<li><strong>~50% in meno per immagine.</strong> Alla risoluzione di 1K: <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0,</mn><mi>067versusPro′s0</mi></mrow><annotation encoding="application/x-tex">,067 contro</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7519em;"></span></span></span><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">di Pro</annotation></semantics></math></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,</span><span class="mord"><span class="mord mathnormal">067versusPro</span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">′s0</span></span></span></span>,134.</li>
</ul>
<p><strong>Un caso d'uso divertente di Nano Banano 2: generare un panorama consapevole della posizione in base a una semplice schermata di Google Map</strong></p>
<p>Dato uno screenshot di Google Maps e una richiesta di stile, il modello riconosce il contesto geografico e genera un panorama che conserva le corrette relazioni spaziali. Utile per produrre creatività pubblicitarie mirate alla regione (sfondo di un caffè parigino, paesaggio stradale di Tokyo) senza dover ricorrere a fotografie di stock.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Per l'elenco completo delle funzioni, consultare <a href="https://blog.google/innovation-and-ai/technology/ai/nano-banana-2/">il blog di annuncio di Google</a> e la <a href="https://ai.google.dev/gemini-api/docs/image-generation">documentazione per gli sviluppatori</a>.</p>
<h2 id="What-Does-This-Nano-Banana-Update-Mean-For-E-Commerce" class="common-anchor-header">Cosa significa questo aggiornamento di Nano Banana per il commercio elettronico?<button data-href="#What-Does-This-Nano-Banana-Update-Mean-For-E-Commerce" class="anchor-icon" translate="no">
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
    </button></h2><p>Il commercio elettronico è uno dei settori a più alta intensità di immagini. Inserzioni di prodotti, annunci sul mercato, creazioni sociali, campagne banner, vetrine localizzate: ogni canale richiede un flusso costante di risorse visive, ognuna con le proprie specifiche.</p>
<p>I requisiti fondamentali per la generazione di immagini AI nell'e-commerce si riducono a:</p>
<ul>
<li><strong>Mantenere i costi bassi</strong> - il costo per immagine deve funzionare su scala di catalogo.</li>
<li><strong>Abbinare l'aspetto dei bestseller comprovati</strong>: le nuove immagini devono allinearsi allo stile visivo delle inserzioni che già convertono.</li>
<li><strong>Evitare le violazioni</strong>: non copiare le creazioni dei concorrenti o riutilizzare beni protetti.</li>
</ul>
<p>Inoltre, i venditori transfrontalieri hanno bisogno di:</p>
<ul>
<li><strong>Supporto di formati multipiattaforma</strong> - diversi rapporti di aspetto e specifiche per marketplace, annunci e vetrine.</li>
<li><strong>Rendering del testo multilingue</strong>: testo dell'immagine pulito e accurato in più lingue.</li>
</ul>
<p>Nano Banana 2 è in grado di soddisfare tutte le esigenze. Le sezioni che seguono illustrano il significato pratico di ciascun aggiornamento: dove risolve direttamente un problema di e-commerce, dove non lo risolve e qual è l'impatto effettivo sui costi.</p>
<h3 id="Cut-Output-Generation-Costs-by-Up-to-60" class="common-anchor-header">Riduzione dei costi di produzione fino al 60%</h3><p>Alla risoluzione di 1K, Nano Banana 2 costa <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0,</mn><mi>067perimageversusPro′s0</mi></mrow><annotation encoding="application/x-tex">,067 per immagine rispetto a</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.9463em;vertical-align:-0.1944em;"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,</span><span class="mord"><span class="mord mathnormal">067perimageversusPro</span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">′0</span></span></span></span>,134, con un taglio del 50%. Ma il prezzo per immagine è solo metà della storia. Ciò che uccideva i budget degli utenti era la rielaborazione. Ogni marketplace impone le proprie specifiche di immagine (1:1 per Amazon, 3:4 per le vetrine di Shopify, ultrawide per i banner pubblicitari) e la produzione di ogni variante comportava un passaggio di generazione separato con le proprie modalità di fallimento.</p>
<p>Nano Banana 2 riduce questi passaggi extra in uno solo.</p>
<ul>
<li><p><strong>Quattro livelli di risoluzione nativa.</strong></p></li>
<li><p>512px ($0,045)</p></li>
<li><p>1K ($0.067)</p></li>
<li><p>2K ($0.101)</p></li>
<li><p>4K ($0.151).</p></li>
</ul>
<p>Il livello di 512px è nuovo ed esclusivo di Nano Banana 2. Gli utenti possono ora generare bozze a 512px a basso costo per l'iterazione e produrre l'asset finale a 2K o 4K senza una fase di upscaling separata.</p>
<ul>
<li><p><strong>14 rapporti di aspetto supportati</strong> in totale. Ecco alcuni esempi:</p></li>
<li><p>4:1</p></li>
<li><p>1:4</p></li>
<li><p>8:1</p></li>
<li><p>1:8</p></li>
</ul>
<p>Questi nuovi rapporti ultra-wide e ultra-tall si aggiungono alla serie esistente. Una sessione di generazione può produrre vari formati come: <strong>Immagine principale di Amazon</strong> (1:1), <strong>Eroe della vetrina</strong> (3:4) e <strong>Banner pubblicitario</strong> (ultra-wide o altri rapporti).</p>
<p>Per questi 4 rapporti non è necessario alcun ritaglio, padding o ri-prompting. I restanti 10 rapporti di aspetto sono inclusi nel set completo, rendendo il processo più flessibile su diverse piattaforme.</p>
<p>Il risparmio di circa il 50% per immagine da solo dimezzerebbe il conto. L'eliminazione della rielaborazione delle risoluzioni e dei rapporti di aspetto ha fatto scendere il costo totale a circa un terzo di quanto si spendeva prima.</p>
<h3 id="Support-Up-to-14-Reference-Images-with-Bestseller-Style" class="common-anchor-header">Supporto fino a 14 immagini di riferimento con lo stile Bestseller</h3><p>Di tutti gli aggiornamenti di Nano Banana 2, il blending multi-referenza è quello che ha avuto il maggiore impatto sulla nostra pipeline Milvus. Nano Banana 2 accetta fino a 14 immagini di riferimento in una singola richiesta, mantenendo:</p>
<ul>
<li>Somiglianza dei caratteri per un massimo di <strong>5 personaggi</strong></li>
<li>Fedeltà dell'oggetto per un massimo di <strong>14 oggetti</strong></li>
</ul>
<p>In pratica, abbiamo recuperato più immagini di bestseller da Milvus, le abbiamo passate come riferimenti e l'immagine generata ha ereditato la composizione della scena, l'illuminazione, la posa e il posizionamento degli oggetti. Non è stata necessaria alcuna ingegnerizzazione per ricostruire questi modelli a mano.</p>
<p>I modelli precedenti supportavano solo uno o due riferimenti, costringendo gli utenti a scegliere un singolo bestseller da imitare. Con 14 slot di riferimento, abbiamo potuto mescolare le caratteristiche di più inserzioni con le migliori performance e lasciare che il modello sintetizzasse uno stile composito. È questa la capacità che rende possibile la pipeline basata sul reperimento, descritta nell'esercitazione che segue.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image15.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Produce-Premium-Commercial-Ready-Visuals-Without-Traditional-Production-Cost-or-Logistics" class="common-anchor-header">Produrre immagini di qualità, pronte per il commercio, senza costi di produzione o logistica tradizionali</h3><p>Per una generazione di immagini coerente e affidabile, evitate di scaricare tutti i requisiti in un unico prompt. Un approccio più affidabile è quello di lavorare per fasi: generare prima lo sfondo, poi il modello separatamente e infine comporli insieme.</p>
<p>Abbiamo testato la generazione dello sfondo su tutti e tre i modelli Nano Banana con lo stesso prompt: uno skyline ultrawide 4:1 di Shanghai in un giorno di pioggia visto attraverso una finestra, con la Oriental Pearl Tower visibile. Questa richiesta mette alla prova la composizione, i dettagli architettonici e il fotorealismo in un unico passaggio.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="Original-Nano-Banana-vs-Nano-Banana-Pro-vs-Nano-Banana-2" class="common-anchor-header">Nano Banana originale vs. Nano Banana Pro vs. Nano Banana 2</h4><ul>
<li><strong>Nano Banana originale.</strong> Texture naturale della pioggia con distribuzione credibile delle gocce, ma dettagli degli edifici eccessivamente smussati. L'Oriental Pearl Tower era a malapena riconoscibile e la risoluzione era inferiore ai requisiti di produzione.</li>
<li><strong>Nano Banana Pro.</strong> Atmosfera cinematografica: l'illuminazione calda degli interni si contrappone alla pioggia fredda in modo convincente. Tuttavia, ha omesso completamente la cornice della finestra, appiattendo il senso di profondità dell'immagine. Utilizzabile come immagine di supporto, non come protagonista.</li>
<li><strong>Nano Banana 2.</strong> Rendering dell'intera scena. La cornice della finestra in primo piano creava profondità. La Torre della Perla Orientale era chiaramente dettagliata. Le navi appaiono sul fiume Huangpu. L'illuminazione stratificata distingueva il calore degli interni dal cielo coperto degli esterni. Le texture della pioggia e delle macchie d'acqua erano quasi fotografiche e il rapporto ultrawide 4:1 manteneva la prospettiva corretta con solo una piccola distorsione sul bordo sinistro della finestra.</li>
</ul>
<p>Per la maggior parte delle attività di generazione dello sfondo nella fotografia di prodotto, abbiamo trovato l'output di Nano Banana 2 utilizzabile senza post-elaborazione.</p>
<h3 id="Render-In-Image-Text-Cleanly-Across-Languages" class="common-anchor-header">Rendering pulito del testo nell'immagine in tutte le lingue</h3><p>Cartellini dei prezzi, banner promozionali e testi multilingue sono inevitabili nelle immagini di e-commerce e storicamente sono stati un punto di rottura per la generazione di AI. Nano Banana 2 li gestisce in modo decisamente migliore, supportando il rendering del testo nell'immagine in più lingue con traduzione e localizzazione in un'unica generazione.</p>
<p><strong>Rendering del testo standard.</strong> Nei nostri test, la resa del testo è stata priva di errori in tutti i formati di e-commerce che abbiamo provato: etichette dei prezzi, brevi tagline di marketing e descrizioni bilingue dei prodotti.</p>
<p><strong>Continuazione della scrittura a mano.</strong> Poiché l'e-commerce richiede spesso elementi scritti a mano, come cartellini dei prezzi e biglietti personalizzati, abbiamo testato se i modelli fossero in grado di riprodurre uno stile di scrittura esistente e di estenderlo, in particolare riproducendo un elenco di cose da fare scritto a mano e aggiungendo 5 nuove voci nello stesso stile. Risultati dei tre modelli:</p>
<ul>
<li><strong>Nano Banana originale.</strong> Numeri di sequenza ripetuti, struttura incompresa.</li>
<li><strong>Nano Banana Pro.</strong> Layout corretto, ma scarsa riproduzione dello stile dei caratteri.</li>
<li><strong>Nano Banana 2.</strong> Zero errori. Corrisponde al peso del tratto e allo stile della forma delle lettere tanto da essere indistinguibile dalla fonte.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image12.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Tuttavia,</strong> nella documentazione di Google si legge che Nano Banana 2 "può ancora avere problemi con l'ortografia accurata e con i dettagli delle immagini". I nostri risultati sono stati puliti in tutti i formati testati, ma qualsiasi flusso di lavoro di produzione dovrebbe includere una fase di verifica del testo prima della pubblicazione.</p>
<h2 id="Step-by-Step-Tutorial-Build-a-Bestseller-to-Image-Pipeline-with-Milvus-Qwen-35-and-Nano-Banana-2" class="common-anchor-header">Esercitazione passo dopo passo: Costruire una pipeline da bestseller a immagine con Milvus, Qwen 3.5 e Nano Banana 2<button data-href="#Step-by-Step-Tutorial-Build-a-Bestseller-to-Image-Pipeline-with-Milvus-Qwen-35-and-Nano-Banana-2" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Before-we-begin-Architecture-and-Model-Setup" class="common-anchor-header">Prima di iniziare: Architettura e configurazione del modello</h3><p>Per evitare l'aleatorietà della generazione con un solo prompt, abbiamo diviso il processo in tre fasi controllabili: recuperare ciò che già funziona con la ricerca ibrida <strong>di Milvus</strong>, analizzare il motivo per cui funziona con <strong>Qwen 3.5</strong>, quindi generare l'immagine finale con questi vincoli incorporati con <strong>Nano Banana 2</strong>.</p>
<p>Una breve introduzione a ogni strumento se non avete mai lavorato con loro:</p>
<ul>
<li><strong><a href="https://milvus.io/">Milvus</a></strong><a href="https://milvus.io/">:</a> il database vettoriale open-source più diffuso. Memorizza il catalogo dei prodotti come vettori ed esegue una ricerca ibrida (filtri densi + sparsi + scalari) per trovare le immagini dei bestseller più simili a un nuovo prodotto.</li>
<li><strong>Qwen 3.5</strong>: un popolare LLM multimodale. Prende le immagini dei bestseller recuperate ed estrae i modelli visivi alla base di esse (disposizione della scena, illuminazione, posa, umore) in un prompt di stile strutturato.</li>
<li><strong>Nano Banana 2</strong>: modello di generazione di immagini da Google (Gemini 3.1 Flash Image). Riceve tre input: il flat-lay di un nuovo prodotto, un bestseller di riferimento e la richiesta di stile di Qwen 3.5. Produce la foto promozionale finale.</li>
</ul>
<p>La logica alla base di questa architettura parte da un'osservazione: la risorsa visiva più preziosa di qualsiasi catalogo di e-commerce è la libreria di immagini bestseller già convertite. Le pose, le composizioni e l'illuminazione di queste foto sono state perfezionate attraverso una spesa pubblicitaria reale. Recuperare direttamente questi schemi è un ordine di grandezza più veloce rispetto alla loro reingegnerizzazione attraverso la scrittura di prompt, e questa fase di recupero è esattamente quella che gestisce un database vettoriale.</p>
<p>Ecco il flusso completo. Richiamiamo ogni modello attraverso l'API di OpenRouter, quindi non c'è bisogno di una GPU locale e non ci sono pesi del modello da scaricare.</p>
<pre><code translate="no">New product flat-lay
│
│── Embed → Llama Nemotron Embed VL 1B v2
│
│── Search → Milvus hybrid search
│   ├── Dense <span class="hljs-title function_">vectors</span> <span class="hljs-params">(visual similarity)</span>
│   ├── Sparse <span class="hljs-title function_">vectors</span> <span class="hljs-params">(keyword matching)</span>
│   └── Scalar <span class="hljs-title function_">filters</span> <span class="hljs-params">(category + sales volume)</span>
│
│── Analyze → Qwen <span class="hljs-number">3.5</span> extracts style from retrieved bestsellers
│   └── scene, lighting, pose, mood → style prompt
│
└── Generate → Nano Banana <span class="hljs-number">2</span>
    ├── Inputs: <span class="hljs-keyword">new</span> <span class="hljs-title class_">product</span> + bestseller reference + style prompt
    └── Output: promotional photo
<button class="copy-code-btn"></button></code></pre>
<p>Per far funzionare la fase di recupero ci affidiamo a tre funzionalità di Milvus:</p>
<ol>
<li><strong>Ricerca ibrida densa e rada.</strong> Eseguiamo le incorporazioni delle immagini e i vettori TF-IDF del testo come query parallele, quindi uniamo i due gruppi di risultati con il reranking RRF (Reciprocal Rank Fusion).</li>
<li><strong>Filtraggio dei campi scalari.</strong> Prima di confrontare i vettori, filtriamo i campi dei metadati, come la categoria e il numero di vendite, in modo che i risultati includano solo i prodotti rilevanti e performanti.</li>
<li><strong>Schema a più campi.</strong> Memorizziamo i vettori densi, i vettori radi e i metadati scalari in un'unica raccolta Milvus, in modo da mantenere l'intera logica di reperimento in un'unica query anziché sparpagliarla in più sistemi.</li>
</ol>
<h3 id="Data-Preparation" class="common-anchor-header">Preparazione dei dati</h3><p><strong>Catalogo storico dei prodotti</strong></p>
<p>Partiamo da due asset: una cartella/immagini di foto di prodotti esistenti e un file products.csv contenente i loro metadati.</p>
<pre><code translate="no">images/
├── SKU001.jpg
├── SKU002.jpg
├── ...
└── SKU040.jpg

products.csv fields:
product_id, image_path, category, color, style, season, sales_count, description, price
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Dati dei nuovi prodotti</strong></p>
<p>Per i prodotti per i quali vogliamo generare immagini promozionali, prepariamo una struttura parallela: una cartella new_products/ e new_products.csv.</p>
<pre><code translate="no">new_products/
├── NEW001.jpg    <span class="hljs-comment"># Blue knit cardigan + grey tulle skirt set</span>
├── NEW002.jpg    <span class="hljs-comment"># Light green floral ruffle maxi dress</span>
├── NEW003.jpg    <span class="hljs-comment"># Camel turtleneck knit dress</span>
└── NEW004.jpg    <span class="hljs-comment"># Dark grey ethnic-style cowl neck top dress</span>

new_products.csv fields:
new_id, image_path, category, style, season, prompt_hint
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image11.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">Passo 1: Installare le dipendenze</h3><pre><code translate="no">!pip install pymilvus openai requests pillow scikit-learn tqdm
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Import-Modules-and-Configurations" class="common-anchor-header">Passo 2: Importare moduli e configurazioni</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os, io, base64, csv, time
<span class="hljs-keyword">import</span> requests <span class="hljs-keyword">as</span> req
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> <span class="hljs-variable constant_">PIL</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">Image</span>
<span class="hljs-keyword">from</span> tqdm.<span class="hljs-property">notebook</span> <span class="hljs-keyword">import</span> tqdm
<span class="hljs-keyword">from</span> sklearn.<span class="hljs-property">feature_extraction</span>.<span class="hljs-property">text</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">TfidfVectorizer</span>
<span class="hljs-keyword">from</span> <span class="hljs-title class_">IPython</span>.<span class="hljs-property">display</span> <span class="hljs-keyword">import</span> display

<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>, <span class="hljs-title class_">DataType</span>, <span class="hljs-title class_">AnnSearchRequest</span>, <span class="hljs-title class_">RRFRanker</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Configurare tutti i modelli e i percorsi:</strong></p>
<pre><code translate="no"><span class="hljs-comment"># -- Config --</span>
OPENROUTER_API_KEY = os.environ.get(
    <span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>,
    <span class="hljs-string">&quot;&lt;YOUR_OPENROUTER_API_KEY&gt;&quot;</span>,
)

<span class="hljs-comment"># Models (all via OpenRouter, no local download needed)</span>
EMBED_MODEL = <span class="hljs-string">&quot;nvidia/llama-nemotron-embed-vl-1b-v2&quot;</span>  <span class="hljs-comment"># free, image+text → 2048d</span>
EMBED_DIM = <span class="hljs-number">2048</span>
LLM_MODEL = <span class="hljs-string">&quot;qwen/qwen3.5-397b-a17b&quot;</span>                 <span class="hljs-comment"># style analysis</span>
IMAGE_GEN_MODEL = <span class="hljs-string">&quot;google/gemini-3.1-flash-image-preview&quot;</span>  <span class="hljs-comment"># Nano Banana 2</span>

<span class="hljs-comment"># Milvus</span>
MILVUS_URI = <span class="hljs-string">&quot;./milvus_fashion.db&quot;</span>
COLLECTION = <span class="hljs-string">&quot;fashion_products&quot;</span>
TOP_K = <span class="hljs-number">3</span>

<span class="hljs-comment"># Paths</span>
IMAGE_DIR = <span class="hljs-string">&quot;./images&quot;</span>
NEW_PRODUCT_DIR = <span class="hljs-string">&quot;./new_products&quot;</span>
PRODUCT_CSV = <span class="hljs-string">&quot;./products.csv&quot;</span>
NEW_PRODUCT_CSV = <span class="hljs-string">&quot;./new_products.csv&quot;</span>

<span class="hljs-comment"># OpenRouter client (shared for LLM + image gen)</span>
llm = OpenAI(api_key=OPENROUTER_API_KEY, base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Config loaded. All models via OpenRouter API.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Funzioni di utilità</strong></p>
<p>Queste funzioni di aiuto gestiscono la codifica delle immagini, le chiamate API e l'analisi delle risposte:</p>
<ul>
<li>image_to_uri(): Converte un'immagine PIL in un URI di dati base64 per il trasporto API.</li>
<li>get_image_embeddings(): Codifica le immagini in vettori a 2048 dimensioni tramite l'API OpenRouter Embedding.</li>
<li>get_text_embedding(): Codifica il testo nello stesso spazio vettoriale a 2048 dimensioni.</li>
<li>sparse_to_dict(): Converte una riga di matrice sparsa scipy nel formato {index: value} che Milvus si aspetta per i vettori sparsi.</li>
<li>extract_images(): Estrae le immagini generate dalla risposta API di Nano Banana 2.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># -- Utility functions --</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">image_to_uri</span>(<span class="hljs-params">img, max_size=<span class="hljs-number">1024</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert PIL Image to base64 data URI.&quot;&quot;&quot;</span>
    img = img.copy()
    w, h = img.size
    <span class="hljs-keyword">if</span> <span class="hljs-built_in">max</span>(w, h) &gt; max_size:
        r = max_size / <span class="hljs-built_in">max</span>(w, h)
        img = img.resize((<span class="hljs-built_in">int</span>(w * r), <span class="hljs-built_in">int</span>(h * r)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, <span class="hljs-built_in">format</span>=<span class="hljs-string">&quot;JPEG&quot;</span>, quality=<span class="hljs-number">85</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;data:image/jpeg;base64,<span class="hljs-subst">{base64.b64encode(buf.getvalue()).decode()}</span>&quot;</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_image_embeddings</span>(<span class="hljs-params">images, batch_size=<span class="hljs-number">5</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode images via OpenRouter embedding API.&quot;&quot;&quot;</span>
    all_embs = []
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> tqdm(<span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(images), batch_size), desc=<span class="hljs-string">&quot;Encoding images&quot;</span>):
        batch = images[i : i + batch_size]
        inputs = [
            {<span class="hljs-string">&quot;content&quot;</span>: [{<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(img, max_size=<span class="hljs-number">512</span>)}}]}
            <span class="hljs-keyword">for</span> img <span class="hljs-keyword">in</span> batch
        ]
        resp = req.post(
            <span class="hljs-string">&quot;https://openrouter.ai/api/v1/embeddings&quot;</span>,
            headers={<span class="hljs-string">&quot;Authorization&quot;</span>: <span class="hljs-string">f&quot;Bearer <span class="hljs-subst">{OPENROUTER_API_KEY}</span>&quot;</span>},
            json={<span class="hljs-string">&quot;model&quot;</span>: EMBED_MODEL, <span class="hljs-string">&quot;input&quot;</span>: inputs},
            timeout=<span class="hljs-number">120</span>,
        )
        data = resp.json()
        <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;data&quot;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> data:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;API error: <span class="hljs-subst">{data}</span>&quot;</span>)
            <span class="hljs-keyword">continue</span>
        <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> <span class="hljs-built_in">sorted</span>(data[<span class="hljs-string">&quot;data&quot;</span>], key=<span class="hljs-keyword">lambda</span> x: x[<span class="hljs-string">&quot;index&quot;</span>]):
            all_embs.append(item[<span class="hljs-string">&quot;embedding&quot;</span>])
        time.sleep(<span class="hljs-number">0.5</span>)  <span class="hljs-comment"># rate limit friendly</span>
    <span class="hljs-keyword">return</span> np.array(all_embs, dtype=np.float32)

<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_text_embedding</span>(<span class="hljs-params">text</span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode text via OpenRouter embedding API.&quot;&quot;&quot;</span>
    resp = req.post(
        <span class="hljs-string">&quot;https://openrouter.ai/api/v1/embeddings&quot;</span>,
        headers={<span class="hljs-string">&quot;Authorization&quot;</span>: <span class="hljs-string">f&quot;Bearer <span class="hljs-subst">{OPENROUTER_API_KEY}</span>&quot;</span>},
        json={<span class="hljs-string">&quot;model&quot;</span>: EMBED_MODEL, <span class="hljs-string">&quot;input&quot;</span>: text},
        timeout=<span class="hljs-number">60</span>,
    )
    <span class="hljs-keyword">return</span> np.array(resp.json()[<span class="hljs-string">&quot;data&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;embedding&quot;</span>], dtype=np.float32)

<span class="hljs-keyword">def</span> <span class="hljs-title function_">sparse_to_dict</span>(<span class="hljs-params">sparse_row</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert scipy sparse row to Milvus sparse vector format {index: value}.&quot;&quot;&quot;</span>
    coo = sparse_row.tocoo()
    <span class="hljs-keyword">return</span> {<span class="hljs-built_in">int</span>(i): <span class="hljs-built_in">float</span>(v) <span class="hljs-keyword">for</span> i, v <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(coo.col, coo.data)}

<span class="hljs-keyword">def</span> <span class="hljs-title function_">extract_images</span>(<span class="hljs-params">response</span>):
    <span class="hljs-string">&quot;&quot;&quot;Extract generated images from OpenRouter response.&quot;&quot;&quot;</span>
    images = []
    raw = response.model_dump()
    msg = raw[<span class="hljs-string">&quot;choices&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;message&quot;</span>]
    <span class="hljs-comment"># Method 1: images field (OpenRouter extension)</span>
    <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;images&quot;</span> <span class="hljs-keyword">in</span> msg <span class="hljs-keyword">and</span> msg[<span class="hljs-string">&quot;images&quot;</span>]:
        <span class="hljs-keyword">for</span> img_data <span class="hljs-keyword">in</span> msg[<span class="hljs-string">&quot;images&quot;</span>]:
            url = img_data[<span class="hljs-string">&quot;image_url&quot;</span>][<span class="hljs-string">&quot;url&quot;</span>]
            b64 = url.split(<span class="hljs-string">&quot;,&quot;</span>, <span class="hljs-number">1</span>)[<span class="hljs-number">1</span>]
            images.append(Image.<span class="hljs-built_in">open</span>(io.BytesIO(base64.b64decode(b64))))
    <span class="hljs-comment"># Method 2: inline base64 in content parts</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> images <span class="hljs-keyword">and</span> <span class="hljs-built_in">isinstance</span>(msg.get(<span class="hljs-string">&quot;content&quot;</span>), <span class="hljs-built_in">list</span>):
        <span class="hljs-keyword">for</span> part <span class="hljs-keyword">in</span> msg[<span class="hljs-string">&quot;content&quot;</span>]:
            <span class="hljs-keyword">if</span> <span class="hljs-built_in">isinstance</span>(part, <span class="hljs-built_in">dict</span>) <span class="hljs-keyword">and</span> part.get(<span class="hljs-string">&quot;type&quot;</span>) == <span class="hljs-string">&quot;image_url&quot;</span>:
                url = part[<span class="hljs-string">&quot;image_url&quot;</span>][<span class="hljs-string">&quot;url&quot;</span>]
                <span class="hljs-keyword">if</span> url.startswith(<span class="hljs-string">&quot;data:image&quot;</span>):
                    b64 = url.split(<span class="hljs-string">&quot;,&quot;</span>, <span class="hljs-number">1</span>)[<span class="hljs-number">1</span>]
                    images.append(Image.<span class="hljs-built_in">open</span>(io.BytesIO(base64.b64decode(b64))))
    <span class="hljs-keyword">return</span> images

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Utility functions ready.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Load-the-Product-Catalog" class="common-anchor-header">Passo 3: caricare il catalogo dei prodotti</h3><p>Leggere il file products.csv e caricare le immagini dei prodotti corrispondenti:</p>
<pre><code translate="no"><span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(PRODUCT_CSV, newline=<span class="hljs-string">&quot;&quot;</span>, encoding=<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">as</span> f:
    products = <span class="hljs-built_in">list</span>(csv.DictReader(f))

product_images = []
<span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> products:
    img = Image.<span class="hljs-built_in">open</span>(os.path.join(IMAGE_DIR, p[<span class="hljs-string">&quot;image_path&quot;</span>])).convert(<span class="hljs-string">&quot;RGB&quot;</span>)
    product_images.append(img)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Loaded <span class="hljs-subst">{<span class="hljs-built_in">len</span>(products)}</span> products.&quot;</span>)
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">3</span>):
    p = products[i]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{p[<span class="hljs-string">&#x27;product_id&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;color&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> | sales: <span class="hljs-subst">{p[<span class="hljs-string">&#x27;sales_count&#x27;</span>]}</span>&quot;</span>)
    display(product_images[i].resize((<span class="hljs-number">180</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">180</span> * product_images[i].height / product_images[i].width))))
<button class="copy-code-btn"></button></code></pre>
<p>Esempio di output:<br>

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image13.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Generate-Embeddings" class="common-anchor-header">Passo 4: Generare le incorporazioni</h3><p>La ricerca ibrida richiede due tipi di vettori per ogni prodotto.</p>
<p><strong>4.1 Vettori densi: incorporazioni di immagini</strong></p>
<p>Il modello nvidia/llama-nemotron-embed-vl-1b-v2 codifica l'immagine di ogni prodotto in un vettore denso di 2048 dimensioni. Poiché questo modello supporta input sia di immagine che di testo in uno spazio vettoriale condiviso, le stesse incorporazioni funzionano per il recupero da immagine a immagine e da testo a immagine.</p>
<pre><code translate="no"><span class="hljs-comment"># Dense embeddings: image → 2048-dim vector via OpenRouter API</span>
dense_vectors = get_image_embeddings(product_images, batch_size=<span class="hljs-number">5</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dense vectors: <span class="hljs-subst">{dense_vectors.shape}</span>  (products x <span class="hljs-subst">{EMBED_DIM}</span>d)&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Output:</p>
<pre><code translate="no">Dense vectors: (40, 2048)  (products x 2048d)
<button class="copy-code-btn"></button></code></pre>
<p><strong>4,2 vettori sparsi: Incorporazione del testo TF-IDF</strong></p>
<p>Le descrizioni testuali dei prodotti sono codificate in vettori sparsi utilizzando il vettorizzatore TF-IDF di scikit-learn. Questi catturano la corrispondenza a livello di parola chiave che i vettori densi possono perdere.</p>
<pre><code translate="no"><span class="hljs-comment"># Sparse embeddings: TF-IDF on product descriptions</span>
descriptions = [p[<span class="hljs-string">&quot;description&quot;</span>] <span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> products]
tfidf = TfidfVectorizer(stop_words=<span class="hljs-string">&quot;english&quot;</span>, max_features=<span class="hljs-number">500</span>)
tfidf_matrix = tfidf.fit_transform(descriptions)

sparse_vectors = [sparse_to_dict(tfidf_matrix[i]) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(products))]
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sparse vectors: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(sparse_vectors)}</span> products, vocab size: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(tfidf.vocabulary_)}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sample sparse vector (SKU001): <span class="hljs-subst">{<span class="hljs-built_in">len</span>(sparse_vectors[<span class="hljs-number">0</span>])}</span> non-zero terms&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Output:</p>
<pre><code translate="no">Sparse vectors: <span class="hljs-number">40</span> products, vocab size: <span class="hljs-number">179</span>
Sample sparse <span class="hljs-title function_">vector</span> <span class="hljs-params">(SKU001)</span>: <span class="hljs-number">11</span> non-zero terms
<button class="copy-code-btn"></button></code></pre>
<p><strong>Perché entrambi i tipi di vettori?</strong> I vettori densi e sparsi si completano a vicenda. I vettori densi catturano la somiglianza visiva: palette di colori, silhouette dell'abito, stile generale. I vettori sparsi catturano la semantica delle parole chiave: termini come "floreale", "midi" o "chiffon" che segnalano gli attributi del prodotto. La combinazione di entrambi produce una qualità di reperimento significativamente migliore rispetto a uno dei due approcci da solo.</p>
<h3 id="Step-5-Create-a-Milvus-Collection-with-Hybrid-Schema" class="common-anchor-header">Passo 5: Creare una collezione Milvus con uno schema ibrido</h3><p>Questo passo crea una singola raccolta Milvus che memorizza insieme vettori densi, vettori radi e campi di metadati scalari. Questo schema unificato consente la ricerca ibrida in un'unica query.</p>
<table>
<thead>
<tr><th><strong>Campo</strong></th><th><strong>Tipo</strong></th><th><strong>Scopo</strong></th></tr>
</thead>
<tbody>
<tr><td>vettore_denso</td><td>VETTORE FLOTTANTE (2048d)</td><td>Incorporamento dell'immagine, somiglianza COSINE</td></tr>
<tr><td>vettore_sparso</td><td>SPARSE_FLOAT_VECTOR</td><td>Vettore sparse TF-IDF, prodotto interno</td></tr>
<tr><td>categoria</td><td>VARCHAR</td><td>Etichetta di categoria per il filtraggio</td></tr>
<tr><td>numero_di_vendite</td><td>INT64</td><td>Volume storico delle vendite per il filtraggio</td></tr>
<tr><td>colore, stile, stagione</td><td>VARCHAR</td><td>Etichette di metadati aggiuntive</td></tr>
<tr><td>prezzo</td><td>FLOTTANTE</td><td>Prezzo del prodotto</td></tr>
</tbody>
</table>
<pre><code translate="no">milvus_client = MilvusClient(uri=MILVUS_URI)

<span class="hljs-keyword">if</span> milvus_client.has_collection(COLLECTION):
    milvus_client.drop_collection(COLLECTION)

schema = milvus_client.create_schema(auto_id=<span class="hljs-literal">True</span>, enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;product_id&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">20</span>)
schema.add_field(<span class="hljs-string">&quot;category&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;color&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;style&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;season&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;sales_count&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;description&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">500</span>)
schema.add_field(<span class="hljs-string">&quot;price&quot;</span>, DataType.FLOAT)
schema.add_field(<span class="hljs-string">&quot;dense_vector&quot;</span>, DataType.FLOAT_VECTOR, dim=EMBED_DIM)
schema.add_field(<span class="hljs-string">&quot;sparse_vector&quot;</span>, DataType.SPARSE_FLOAT_VECTOR)

index_params = milvus_client.prepare_index_params()
index_params.add_index(field_name=<span class="hljs-string">&quot;dense_vector&quot;</span>, index_type=<span class="hljs-string">&quot;FLAT&quot;</span>, metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>)
index_params.add_index(field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>, index_type=<span class="hljs-string">&quot;SPARSE_INVERTED_INDEX&quot;</span>, metric_type=<span class="hljs-string">&quot;IP&quot;</span>)

milvus_client.create_collection(COLLECTION, schema=schema, index_params=index_params)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Milvus collection &#x27;<span class="hljs-subst">{COLLECTION}</span>&#x27; created with hybrid schema.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Inserire i dati del prodotto:</p>
<pre><code translate="no"><span class="hljs-comment"># Insert all products</span>
rows = []
<span class="hljs-keyword">for</span> i, p <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(products):
    rows.append({
        <span class="hljs-string">&quot;product_id&quot;</span>: p[<span class="hljs-string">&quot;product_id&quot;</span>],
        <span class="hljs-string">&quot;category&quot;</span>: p[<span class="hljs-string">&quot;category&quot;</span>],
        <span class="hljs-string">&quot;color&quot;</span>: p[<span class="hljs-string">&quot;color&quot;</span>],
        <span class="hljs-string">&quot;style&quot;</span>: p[<span class="hljs-string">&quot;style&quot;</span>],
        <span class="hljs-string">&quot;season&quot;</span>: p[<span class="hljs-string">&quot;season&quot;</span>],
        <span class="hljs-string">&quot;sales_count&quot;</span>: <span class="hljs-built_in">int</span>(p[<span class="hljs-string">&quot;sales_count&quot;</span>]),
        <span class="hljs-string">&quot;description&quot;</span>: p[<span class="hljs-string">&quot;description&quot;</span>],
        <span class="hljs-string">&quot;price&quot;</span>: <span class="hljs-built_in">float</span>(p[<span class="hljs-string">&quot;price&quot;</span>]),
        <span class="hljs-string">&quot;dense_vector&quot;</span>: dense_vectors[i].tolist(),
        <span class="hljs-string">&quot;sparse_vector&quot;</span>: sparse_vectors[i],
    })

milvus_client.insert(COLLECTION, rows)
stats = milvus_client.get_collection_stats(COLLECTION)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted <span class="hljs-subst">{stats[<span class="hljs-string">&#x27;row_count&#x27;</span>]}</span> products into Milvus.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Output:</p>
<pre><code translate="no">Inserted <span class="hljs-number">40</span> products <span class="hljs-keyword">into</span> Milvus.
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Hybrid-Search-to-Find-Similar-Bestsellers" class="common-anchor-header">Fase 6: Ricerca ibrida per trovare prodotti più venduti simili</h3><p>Questa è la fase centrale del reperimento. Per ogni nuovo prodotto, la pipeline esegue tre operazioni simultaneamente:</p>
<ol>
<li><strong>Ricerca densa</strong>: trova i prodotti con immagini visivamente simili.</li>
<li><strong>Ricerca sparsa</strong>: trova i prodotti con parole chiave di testo corrispondenti tramite TF-IDF.</li>
<li><strong>Filtro scalare</strong>: limita i risultati alla stessa categoria e ai prodotti con numero di vendite &gt; 1500.</li>
<li><strong>RRF reranking</strong>: unisce gli elenchi di risultati densi e radi utilizzando la Reciprocal Rank Fusion.</li>
</ol>
<p>Carica il nuovo prodotto:</p>
<pre><code translate="no"><span class="hljs-comment"># Load new products</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(NEW_PRODUCT_CSV, newline=<span class="hljs-string">&quot;&quot;</span>, encoding=<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">as</span> f:
    new_products = <span class="hljs-built_in">list</span>(csv.DictReader(f))

<span class="hljs-comment"># Pick the first new product for demo</span>
new_prod = new_products[<span class="hljs-number">0</span>]
new_img = Image.<span class="hljs-built_in">open</span>(os.path.join(NEW_PRODUCT_DIR, new_prod[<span class="hljs-string">&quot;image_path&quot;</span>])).convert(<span class="hljs-string">&quot;RGB&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;New product: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Category: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | Style: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> | Season: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;season&#x27;</span>]}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Prompt hint: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>&quot;</span>)
display(new_img.resize((<span class="hljs-number">300</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">300</span> * new_img.height / new_img.width))))
<button class="copy-code-btn"></button></code></pre>
<p>Output:  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Codifica il nuovo prodotto:</p>
<pre><code translate="no"><span class="hljs-comment"># Encode new product</span>
<span class="hljs-comment"># Dense: image embedding via API</span>
query_dense = get_image_embeddings([new_img], batch_size=<span class="hljs-number">1</span>)[<span class="hljs-number">0</span>]

<span class="hljs-comment"># Sparse: TF-IDF from text query</span>
query_text = <span class="hljs-string">f&quot;<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;season&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>&quot;</span>
query_sparse = sparse_to_dict(tfidf.transform([query_text])[<span class="hljs-number">0</span>])

<span class="hljs-comment"># Scalar filter</span>
filter_expr = <span class="hljs-string">f&#x27;category == &quot;<span class="hljs-subst">{new_prod[<span class="hljs-string">&quot;category&quot;</span>]}</span>&quot; and sales_count &gt; 1500&#x27;</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dense query: <span class="hljs-subst">{query_dense.shape}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sparse query: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(query_sparse)}</span> non-zero terms&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Filter: <span class="hljs-subst">{filter_expr}</span>&quot;</span>)

<button class="copy-code-btn"></button></code></pre>
<p>Uscita:</p>
<pre><code translate="no"><span class="hljs-title class_">Dense</span> <span class="hljs-attr">query</span>: (<span class="hljs-number">2048</span>,)
<span class="hljs-title class_">Sparse</span> <span class="hljs-attr">query</span>: <span class="hljs-number">6</span> non-zero terms
<span class="hljs-title class_">Filter</span>: category == <span class="hljs-string">&quot;midi_dress&quot;</span> and sales_count &gt; <span class="hljs-number">1500</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Eseguire la ricerca ibrida</strong></p>
<p>Le chiamate API chiave sono le seguenti:</p>
<ul>
<li>AnnSearchRequest crea richieste di ricerca separate per i campi vettoriali densi e radi.</li>
<li>expr=filter_expr applica un filtro scalare a ciascuna richiesta di ricerca.</li>
<li>RRFRanker(k=60) fonde i due elenchi di risultati classificati utilizzando l'algoritmo Reciprocal Rank Fusion.</li>
<li>hybrid_search esegue entrambe le richieste e restituisce i risultati uniti e riclassificati.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Hybrid search: dense + sparse + scalar filter + RRF reranking</span>
dense_req = AnnSearchRequest(
    data=[query_dense.tolist()],
    anns_field=<span class="hljs-string">&quot;dense_vector&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    limit=<span class="hljs-number">20</span>,
    expr=filter_expr,
)
sparse_req = AnnSearchRequest(
    data=[query_sparse],
    anns_field=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>},
    limit=<span class="hljs-number">20</span>,
    expr=filter_expr,
)

results = milvus_client.hybrid_search(
    collection_name=COLLECTION,
    reqs=[dense_req, sparse_req],
    ranker=RRFRanker(k=<span class="hljs-number">60</span>),
    limit=TOP_K,
    output_fields=[<span class="hljs-string">&quot;product_id&quot;</span>, <span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;color&quot;</span>, <span class="hljs-string">&quot;style&quot;</span>, <span class="hljs-string">&quot;season&quot;</span>,
                   <span class="hljs-string">&quot;sales_count&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
)

<span class="hljs-comment"># Display retrieved bestsellers</span>
retrieved_products = []
retrieved_images = []
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Top-<span class="hljs-subst">{TOP_K}</span> similar bestsellers:\n&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    pid = entity[<span class="hljs-string">&quot;product_id&quot;</span>]
    img = Image.<span class="hljs-built_in">open</span>(os.path.join(IMAGE_DIR, <span class="hljs-string">f&quot;<span class="hljs-subst">{pid}</span>.jpg&quot;</span>)).convert(<span class="hljs-string">&quot;RGB&quot;</span>)
    retrieved_products.append(entity)
    retrieved_images.append(img)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{pid}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;color&#x27;</span>]}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> &quot;</span>
          <span class="hljs-string">f&quot;| sales: <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;sales_count&#x27;</span>]}</span> | $<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;price&#x27;</span>]:<span class="hljs-number">.1</span>f}</span> | score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;description&#x27;</span>]}</span>&quot;</span>)
    display(img.resize((<span class="hljs-number">250</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">250</span> * img.height / img.width))))
    <span class="hljs-built_in">print</span>()
<button class="copy-code-btn"></button></code></pre>
<p>Output: i 3 bestseller più simili, classificati in base al punteggio fuso.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-7-Analyze-Bestseller-Style-with-Qwen-35" class="common-anchor-header">Fase 7: Analisi dello stile dei bestseller con Qwen 3.5</h3><p>Inseriamo le immagini dei bestseller recuperate in Qwen 3.5 e gli chiediamo di estrarre il loro DNA visivo condiviso: composizione della scena, impostazione dell'illuminazione, posa della modella e stato d'animo generale. Da questa analisi, otteniamo un prompt di singola generazione pronto per essere consegnato a Nano Banana 2.</p>
<pre><code translate="no">content = [
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(img)}}
    <span class="hljs-keyword">for</span> img in retrieved_images
]
content.<span class="hljs-built_in">append</span>({
    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>,
    <span class="hljs-string">&quot;text&quot;</span>: (
        <span class="hljs-string">&quot;These are our top-selling fashion product photos.\n\n&quot;</span>
        <span class="hljs-string">&quot;Analyze their common visual style in these dimensions:\n&quot;</span>
        <span class="hljs-string">&quot;1. Scene / background setting\n&quot;</span>
        <span class="hljs-string">&quot;2. Lighting and color tone\n&quot;</span>
        <span class="hljs-string">&quot;3. Model pose and framing\n&quot;</span>
        <span class="hljs-string">&quot;4. Overall mood and aesthetic\n\n&quot;</span>
        <span class="hljs-string">&quot;Then, based on this analysis, write ONE concise image generation prompt &quot;</span>
        <span class="hljs-string">&quot;(under 100 words) that captures this style. The prompt should describe &quot;</span>
        <span class="hljs-string">&quot;a scene for a model wearing a new clothing item. &quot;</span>
        <span class="hljs-string">&quot;Output ONLY the prompt, nothing else.&quot;</span>
    ),
})

response = llm.chat.completions.create(
    model=LLM_MODEL,
    messages=[{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: content}],
    max_tokens=<span class="hljs-number">512</span>,
    temperature=<span class="hljs-number">0.7</span>,
)
style_prompt = response.choices[<span class="hljs-number">0</span>].message.content.strip()
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Style prompt from Qwen3.5:\n&quot;</span>)
<span class="hljs-built_in">print</span>(style_prompt)
<button class="copy-code-btn"></button></code></pre>
<p>Esempio di output:</p>
<pre><code translate="no">Style prompt from Qwen3.5:

Professional full-body fashion photograph of a model wearing a stylish new dress.
Bright, soft high-key lighting that illuminates the subject evenly. Clean,
uncluttered background, either stark white or a softly blurred bright outdoor
setting. The model stands in a relaxed, natural pose to showcase the garment&#x27;s
silhouette and drape. Sharp focus, vibrant colors, fresh and elegant commercial aesthetic.
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-8-Generate-the-Promotional-Image-with-Nano-Banana-2" class="common-anchor-header">Passo 8: Generare l'immagine promozionale con Nano Banana 2</h3><p>A Nano Banana 2 passiamo tre input: la foto flat-lay del nuovo prodotto, l'immagine del bestseller più venduto e la richiesta di stile estratta nel passaggio precedente. Il modello li compone in una foto promozionale che abbina il nuovo capo a uno stile visivo collaudato.</p>
<pre><code translate="no">gen_prompt = (
    <span class="hljs-string">f&quot;I have a new clothing product (Image 1: flat-lay photo) and a reference &quot;</span>
    <span class="hljs-string">f&quot;promotional photo from our bestselling catalog (Image 2).\n\n&quot;</span>
    <span class="hljs-string">f&quot;Generate a professional e-commerce promotional photograph of a female model &quot;</span>
    <span class="hljs-string">f&quot;wearing the clothing from Image 1.\n\n&quot;</span>
    <span class="hljs-string">f&quot;Style guidance: <span class="hljs-subst">{style_prompt}</span>\n\n&quot;</span>
    <span class="hljs-string">f&quot;Scene hint: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>\n\n&quot;</span>
    <span class="hljs-string">f&quot;Requirements:\n&quot;</span>
    <span class="hljs-string">f&quot;- Full body shot, photorealistic, high quality\n&quot;</span>
    <span class="hljs-string">f&quot;- The clothing should match Image 1 exactly\n&quot;</span>
    <span class="hljs-string">f&quot;- The photo style and mood should match Image 2&quot;</span>
)

gen_content = [
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(new_img)}},
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(retrieved_images[<span class="hljs-number">0</span>])}},
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: gen_prompt},
]

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Generating promotional photo with Nano Banana 2...&quot;</span>)
gen_response = llm.chat.completions.create(
    model=IMAGE_GEN_MODEL,
    messages=[{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: gen_content}],
    extra_body={
        <span class="hljs-string">&quot;modalities&quot;</span>: [<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;image&quot;</span>],
        <span class="hljs-string">&quot;image_config&quot;</span>: {<span class="hljs-string">&quot;aspect_ratio&quot;</span>: <span class="hljs-string">&quot;3:4&quot;</span>, <span class="hljs-string">&quot;image_size&quot;</span>: <span class="hljs-string">&quot;2K&quot;</span>},
    },
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Done!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Parametri chiave della chiamata API Nano Banana 2:</p>
<ul>
<li>modalità: [&quot;text&quot;, &quot;image&quot;]: dichiara che la risposta deve includere un'immagine.</li>
<li>image_config.aspect_ratio: controlla il rapporto d'aspetto dell'output (3:4 funziona bene per gli scatti di ritratto/moda).</li>
<li>image_config.image_size: imposta la risoluzione. Nano Banana 2 supporta da 512px a 4K.</li>
</ul>
<p>Estrarre l'immagine generata:</p>
<pre><code translate="no">generated_images = extract_images(gen_response)

text_content = gen_response.choices[<span class="hljs-number">0</span>].message.content
<span class="hljs-keyword">if</span> text_content:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Model response: <span class="hljs-subst">{text_content[:<span class="hljs-number">300</span>]}</span>\n&quot;</span>)

<span class="hljs-keyword">if</span> generated_images:
    <span class="hljs-keyword">for</span> i, img <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(generated_images):
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;--- Generated promo photo <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span> ---&quot;</span>)
        display(img)
        img.save(<span class="hljs-string">f&quot;promo_<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>_<span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>.png&quot;</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Saved: promo_<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>_<span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>.png&quot;</span>)
<span class="hljs-keyword">else</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;No image generated. Raw response:&quot;</span>)
    <span class="hljs-built_in">print</span>(gen_response.model_dump())
<button class="copy-code-btn"></button></code></pre>
<p>Output:  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-9-Side-by-Side-Comparison" class="common-anchor-header">Fase 9: confronto laterale</h3><p>L'output è perfetto: l'illuminazione è morbida e uniforme, la posa della modella è naturale e l'atmosfera corrisponde al bestseller di riferimento.</p>
<p>Il punto debole è la fusione dei capi. Il cardigan sembra incollato sulla modella piuttosto che indossato e l'etichetta bianca della scollatura traspare. La generazione a passaggio singolo ha difficoltà a gestire questo tipo di integrazione fine dei vestiti con il corpo, per cui nel riepilogo si parla di soluzioni.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image10.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-10-Batch-Generation-for-All-New-Products" class="common-anchor-header">Fase 10: Generazione di lotti per tutti i nuovi prodotti</h3><p>L'intera pipeline viene racchiusa in un'unica funzione ed eseguita per i restanti nuovi prodotti. Il codice del batch viene omesso qui per brevità; contattateci se avete bisogno dell'implementazione completa.</p>
<p>Due cose spiccano nei risultati del batch. I suggerimenti di stile che riceviamo da <strong>Qwen 3.5</strong> si adattano in modo significativo a ogni prodotto: un abito estivo e una maglia invernale ricevono descrizioni della scena realmente diverse, adattate alla stagione, al caso d'uso e agli accessori. Le immagini ottenute da <strong>Nano Banana 2</strong>, a loro volta, sono all'altezza di una vera fotografia in studio per quanto riguarda illuminazione, texture e composizione.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image3.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>In questo articolo abbiamo illustrato le caratteristiche di Nano Banana 2 per la generazione di immagini per l'e-commerce, l'abbiamo confrontato con Nano Banana e Pro originali in attività di produzione reali e abbiamo illustrato come costruire una pipeline di bestseller-immagine con Milvus, Qwen 3.5 e Nano Banana 2. Questa pipeline ha quattro vantaggi pratici: la possibilità di creare un'immagine di qualità e la possibilità di creare un'immagine di qualità.</p>
<p>Questa pipeline presenta quattro vantaggi pratici:</p>
<ul>
<li><strong>Costi controllati, budget prevedibili.</strong> Il modello di embedding (Llama Nemotron Embed VL 1B v2) è gratuito su OpenRouter. Nano Banana 2 funziona a circa la metà del costo per immagine di Pro, e l'output multiformato nativo elimina i cicli di rilavorazione che prima raddoppiavano o triplicavano il costo effettivo. Per i team di e-commerce che gestiscono migliaia di SKU per stagione, questa prevedibilità significa che la produzione di immagini va di pari passo con il catalogo, invece di sforare il budget.</li>
<li><strong>Automazione end-to-end, tempi più rapidi per la quotazione.</strong> Il flusso che va dalla foto del prodotto in posa piatta all'immagine promozionale finita si svolge senza interventi manuali. Un nuovo prodotto può passare dalla foto di magazzino all'immagine di inserzione pronta per il mercato in pochi minuti anziché in giorni, il che è molto importante durante le stagioni di punta, quando il turnover del catalogo è più elevato.</li>
<li><strong>Non è necessaria una GPU locale, la barriera all'ingresso è più bassa.</strong> Ogni modello viene eseguito tramite l'API di OpenRouter. Un team senza infrastruttura di ML e senza personale tecnico dedicato può eseguire questa pipeline da un laptop. Non c'è nulla da fornire, nulla da mantenere e nessun investimento iniziale in hardware.</li>
<li><strong>Maggiore precisione di reperimento, maggiore coerenza del marchio.</strong> Milvus combina filtri densi, radi e scalari in un'unica query, superando costantemente gli approcci monovettoriali per la corrispondenza dei prodotti. In pratica, questo significa che le immagini generate ereditano in modo più affidabile il linguaggio visivo consolidato del vostro marchio: l'illuminazione, la composizione e lo stile che i vostri bestseller esistenti hanno già dimostrato di saper convertire. Il risultato ha l'aspetto di un prodotto che appartiene al vostro negozio, non di una generica stock art dell'IA.</li>
</ul>
<p>Ci sono anche delle limitazioni che vale la pena di evidenziare:</p>
<ul>
<li><strong>La fusione tra indumenti e corpo.</strong> La generazione a passaggio singolo può far sembrare gli abiti composti piuttosto che indossati. I dettagli fini, come i piccoli accessori, a volte si confondono. Soluzione: generare in fasi (prima lo sfondo, poi la posa del modello, quindi il composito). Questo approccio a più passaggi dà a ogni fase un ambito più ristretto e migliora significativamente la qualità della fusione.</li>
<li><strong>Fedeltà dei dettagli nei casi limite.</strong> Gli accessori, i modelli e i layout ricchi di testo possono perdere nitidezza. Soluzione: aggiungere vincoli espliciti alla richiesta di generazione ("gli abiti si adattano naturalmente al corpo, non ci sono etichette esposte, non ci sono elementi extra, i dettagli del prodotto sono nitidi"). Se la qualità è ancora bassa su un prodotto specifico, passare a Nano Banana Pro per la versione finale.</li>
</ul>
<p><a href="https://milvus.io/">Milvus</a> è il database vettoriale open-source che alimenta la fase di ricerca ibrida; se volete curiosare o provare a inserire le vostre foto di prodotti, il<a href="https://milvus.io/docs">quickstart</a> <a href="https://milvus.io/docs"></a><a href="https://milvus.io/docs"></a> dura circa dieci minuti. Abbiamo una comunità piuttosto attiva su <a href="https://discord.gg/milvus"></a><a href="https://discord.gg/milvus">Discord</a> e Slack, e ci piacerebbe vedere cosa si costruisce con questo sistema. E se finite per utilizzare Nano Banana 2 con un'altra verticale di prodotti o con un catalogo più ampio, vi preghiamo di condividere i risultati! Ci piacerebbe sentirli.</p>
<h2 id="Keep-Reading" class="common-anchor-header">Continua a leggere<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/nano-banana-milvus-turning-hype-into-enterprise-ready-multimodal-rag.md">Nano Banana + Milvus: trasformare l'hype in un RAG multimodale pronto per l'impresa</a></li>
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">Cos'è OpenClaw? Guida completa all'agente AI open source</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Tutorial su OpenClaw: Connettersi a Slack per l'assistente AI locale</a></li>
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">Abbiamo estratto il sistema di memoria di OpenClaw e lo abbiamo reso open source (memsearch)</a></li>
<li><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">Memoria persistente per il codice Claude: memsearch ccplugin</a></li>
</ul>
