---
id: >-
  2021-12-10-image-based-trademark-similarity-search-system-a-smarter-solution-to-ip-protection.md
title: >-
  Milvus nella protezione della proprietà intellettuale：Costruire un sistema di
  ricerca della somiglianza dei marchi con Milvus
author: Zilliz
date: 2021-12-10T00:00:00.000Z
desc: >-
  Imparate ad applicare la ricerca di similarità vettoriale nel settore della
  protezione della proprietà intellettuale.
cover: assets.zilliz.com/IP_protection_0a33547579.png
tag: Scenarios
---
<p>Negli ultimi anni, il tema della protezione della proprietà intellettuale è salito alla ribalta per la crescente consapevolezza della violazione della proprietà intellettuale. In particolare, il gigante tecnologico multinazionale Apple Inc. ha <a href="https://en.wikipedia.org/wiki/Apple_Inc._litigation">intentato cause contro varie aziende per violazione della proprietà intellettuale</a>, tra cui violazioni di marchi, brevetti e design. Oltre ai casi più noti, nel 2009 Apple Inc. ha anche <a href="https://www.smh.com.au/business/apple-bites-over-woolworths-logo-20091005-ghzr.html">contestato una richiesta di marchio da parte di Woolworths Limited</a>, una catena di supermercati australiana, per violazione del marchio.  Apple. Inc. ha sostenuto che il logo del marchio australiano, una &quot;w&quot; stilizzata, assomiglia al proprio logo di una mela. Pertanto, Apple Inc. ha contestato la gamma di prodotti, compresi i dispositivi elettronici, che Woolworths ha chiesto di vendere con il logo. La storia si conclude con la modifica del logo da parte di Woolworths e il ritiro dell'opposizione da parte di Apple.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Logo_of_Woolworths_b04ece5b20.png" alt="Logo of Woolworths.png" class="doc-image" id="logo-of-woolworths.png" />
   </span> <span class="img-wrapper"> <span>Logo di Woolworths.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Logo_of_Apple_Inc_181e5bd5f8.png" alt="Logo of Apple Inc.png" class="doc-image" id="logo-of-apple-inc.png" />
   </span> <span class="img-wrapper"> <span>Logo di Apple Inc.png</span> </span></p>
<p>Con la crescente consapevolezza della cultura del marchio, le aziende sono sempre più attente a qualsiasi minaccia che possa danneggiare i loro diritti di proprietà intellettuale (PI). La violazione della proprietà intellettuale comprende:</p>
<ul>
<li>Violazione del copyright</li>
<li>Violazione di brevetti</li>
<li>Violazione del marchio</li>
<li>Violazione del design</li>
<li>Cybersquatting</li>
</ul>
<p>La suddetta controversia tra Apple e Woolworths riguarda principalmente la violazione del marchio, precisamente la somiglianza tra le immagini dei marchi delle due entità. Per evitare di diventare un altro Woolworths, una ricerca esaustiva sulla somiglianza dei marchi è un passo fondamentale per i richiedenti, sia prima del deposito che durante la revisione delle domande di marchio. Il metodo più comune è la ricerca nel <a href="https://tmsearch.uspto.gov/search/search-information">database</a> dell'<a href="https://tmsearch.uspto.gov/search/search-information">Ufficio Marchi e Brevetti degli Stati Uniti (USPTO)</a>, che contiene tutte le registrazioni e le domande di marchio attive e inattive. Nonostante l'interfaccia utente non proprio affascinante, anche questo processo di ricerca è profondamente difettoso per la sua natura testuale, in quanto si basa sulle parole e sui codici di Trademark Design (che sono etichette annotate a mano delle caratteristiche del design) per cercare le immagini.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_8_b2fff6ca11.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>Questo articolo intende quindi mostrare come costruire un efficiente sistema di ricerca della somiglianza dei marchi basato sulle immagini utilizzando <a href="https://milvus.io">Milvus</a>, un database vettoriale open-source.</p>
<h2 id="A-vector-similarity-search-system-for-trademarks" class="common-anchor-header">Un sistema di ricerca per similarità vettoriale dei marchi<button data-href="#A-vector-similarity-search-system-for-trademarks" class="anchor-icon" translate="no">
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
    </button></h2><p>Per costruire un sistema di ricerca di somiglianza vettoriale per i marchi, è necessario procedere come segue:</p>
<ol>
<li>Preparare un set di dati massiccio di loghi. Probabilmente il sistema può utilizzare un set di dati come <a href="https://developer.uspto.gov/product/trademark-24-hour-box-and-supplemental">questo</a>).</li>
<li>Addestrare un modello di estrazione delle caratteristiche dell'immagine utilizzando il set di dati e modelli basati sui dati o algoritmi di intelligenza artificiale.</li>
<li>Convertire i loghi in vettori utilizzando il modello o l'algoritmo addestrato al punto 2.</li>
<li>Memorizzare i vettori e condurre ricerche di similarità vettoriale in Milvus, il database vettoriale open-source.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/trademark_system_e9700df555.png" alt="Nike.png" class="doc-image" id="nike.png" />
   </span> <span class="img-wrapper"> <span>Nike.png</span> </span></p>
<p>Nelle sezioni seguenti, esaminiamo più da vicino le due fasi principali della costruzione di un sistema di ricerca per similarità vettoriale per i marchi: l'utilizzo di modelli AI per l'estrazione delle caratteristiche delle immagini e l'utilizzo di Milvus per la ricerca di similarità vettoriale. Nel nostro caso, abbiamo utilizzato VGG16, una rete neurale convoluzionale (CNN), per estrarre le caratteristiche delle immagini e convertirle in vettori di incorporamento.</p>
<h3 id="Using-VGG16-for-image-feature-extraction" class="common-anchor-header">Utilizzo di VGG16 per l'estrazione delle caratteristiche delle immagini</h3><p><a href="https://medium.com/@mygreatlearning/what-is-vgg16-introduction-to-vgg16-f2d63849f615">VGG16</a> è una CNN progettata per il riconoscimento di immagini su larga scala. Il modello è rapido e preciso nel riconoscimento delle immagini e può essere applicato a immagini di tutte le dimensioni. Di seguito sono riportate due illustrazioni dell'architettura di VGG16.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vgg16_layers_9e621f62cc.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vgg16_architecture_992614e882.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<p>Il modello VGG16, come suggerisce il nome, è una CNN a 16 strati. Tutti i modelli VGG, compresi il VGG16 e il VGG19, contengono 5 blocchi VGG, con uno o più strati convoluzionali in ogni blocco VGG. Alla fine di ogni blocco, viene collegato uno strato di pooling massimo per ridurre le dimensioni dell'immagine di ingresso. Il numero di kernel è equivalente in ogni strato convoluzionale, ma raddoppia in ogni blocco VGG. Pertanto, il numero di kernel nel modello cresce da 64 nel primo blocco a 512 nel quarto e quinto blocco. Tutti i kernel convoluzionali sono<em>di 33 dimensioni, mentre i kernel di pooling sono tutti di 22 dimensioni</em>. Ciò consente di preservare un maggior numero di informazioni sull'immagine di ingresso.</p>
<p>Pertanto, in questo caso, VGG16 è un modello adatto per il riconoscimento di immagini di grandi insiemi di dati. È possibile utilizzare Python, Tensorflow e Keras per addestrare un modello di estrazione delle caratteristiche delle immagini sulla base di VGG16.</p>
<h3 id="Using-Milvus-for-vector-similarity-search" class="common-anchor-header">Utilizzo di Milvus per la ricerca di similarità vettoriale</h3><p>Dopo aver utilizzato il modello VGG16 per estrarre le caratteristiche dell'immagine e convertire le immagini del logo in vettori di incorporamento, è necessario cercare vettori simili da un insieme di dati massiccio.</p>
<p>Milvus è un database cloud-native caratterizzato da elevata scalabilità ed elasticità. Inoltre, come database, è in grado di garantire la coerenza dei dati. Per un sistema di ricerca della somiglianza dei marchi come questo, i nuovi dati, come le ultime registrazioni di marchi, vengono caricati nel sistema in tempo reale. E questi dati appena caricati devono essere immediatamente disponibili per la ricerca. Pertanto, questo articolo adotta Milvus, un database vettoriale open-source, per condurre una ricerca di somiglianza vettoriale.</p>
<p>Quando si inseriscono i vettori di logo, è possibile creare in Milvus delle raccolte per diversi tipi di vettori di logo secondo la <a href="https://en.wikipedia.org/wiki/International_(Nice)_Classification_of_Goods_and_Services">Classificazione internazionale (di Nizza) dei prodotti e dei servizi</a>, un sistema di classificazione dei prodotti e dei servizi per la registrazione dei marchi. Ad esempio, è possibile inserire un gruppo di vettori di loghi di marchi di abbigliamento in una raccolta denominata &quot;abbigliamento&quot; in Milvus e inserire un altro gruppo di vettori di loghi di marchi tecnologici in un'altra raccolta denominata &quot;tecnologia&quot;. In questo modo è possibile aumentare notevolmente l'efficienza e la velocità della ricerca di similarità vettoriale.</p>
<p>Milvus non solo supporta indici multipli per la ricerca di similarità vettoriale, ma fornisce anche ricche API e strumenti per facilitare DevOps. Il diagramma seguente illustra l'<a href="https://milvus.io/docs/v2.0.x/architecture_overview.md">architettura</a> di <a href="https://milvus.io/docs/v2.0.x/architecture_overview.md">Milvus</a>. Per saperne di più su Milvus, leggete la sua <a href="https://milvus.io/docs/v2.0.x/overview.md">introduzione</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ea45a5ab53.png" alt="11.png" class="doc-image" id="11.png" />
   </span> <span class="img-wrapper"> <span>11.png</span> </span></p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">Cercate altre risorse?<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
<li><p>Costruite altri sistemi di ricerca per similarità vettoriale per altri scenari applicativi con Milvus:</p>
<ul>
<li><a href="https://milvus.io/blog/dna-sequence-classification-based-on-milvus.md">Classificazione di sequenze di DNA basata su Milvus</a></li>
<li><a href="https://milvus.io/blog/audio-retrieval-based-on-milvus.md">Recupero di audio basato su Milvus</a></li>
<li><a href="https://milvus.io/blog/building-video-search-system-with-milvus.md">4 passi per costruire un sistema di ricerca video</a></li>
<li><a href="https://milvus.io/blog/building-intelligent-chatbot-with-nlp-and-milvus.md">Costruire un sistema di QA intelligente con NLP e Milvus</a></li>
<li><a href="https://milvus.io/blog/molecular-structure-similarity-with-milvus.md">Accelerare la scoperta di nuovi farmaci</a></li>
</ul></li>
<li><p>Impegnatevi con la nostra comunità open-source:</p>
<ul>
<li>Trovate o contribuite a Milvus su <a href="https://bit.ly/307b7jC">GitHub</a>.</li>
<li>Interagite con la comunità tramite il <a href="https://bit.ly/3qiyTEk">Forum</a>.</li>
<li>Connettetevi con noi su <a href="https://bit.ly/3ob7kd8">Twitter</a>.</li>
</ul></li>
</ul>
