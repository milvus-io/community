---
id: how-to-filter-efficiently-without-killing-recall.md
title: >-
  Ricerca vettoriale nel mondo reale: come filtrare in modo efficiente senza
  uccidere il richiamo
author: Chris Gao and Patrick Xu
date: 2025-05-12T00:00:00.000Z
desc: >-
  Questo blog esplora le tecniche di filtraggio più diffuse nella ricerca
  vettoriale, insieme alle ottimizzazioni innovative che abbiamo inserito in
  Milvus e Zilliz Cloud.
cover: assets.zilliz.com/Filter_Efficiently_Without_Killing_Recall_1c355c229c.png
tag: Engineering
tags: 'Vector search, filtering vector search, vector search with filtering'
recommend: true
canonicalUrl: 'https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md'
---
<p>Molti pensano che la ricerca vettoriale consista semplicemente nell'implementare un algoritmo ANN (Approximate Nearest Neighbor) e chiudere la questione. Ma se si esegue la ricerca vettoriale in produzione, si conosce la verità: le cose si complicano rapidamente.</p>
<p>Immaginate di costruire un motore di ricerca per prodotti. Un utente potrebbe chiedere: "<em>Mostrami scarpe simili a questa foto, ma solo rosse e sotto i 100 dollari</em>". Per soddisfare questa richiesta è necessario applicare un filtro di metadati ai risultati della ricerca per similarità semantica. Sembra semplice come applicare un filtro ai risultati della ricerca vettoriale? Beh, non proprio.</p>
<p>Cosa succede quando la condizione di filtraggio è altamente selettiva? Potreste non ottenere abbastanza risultati. Inoltre, il semplice aumento del parametro <strong>topK</strong> della ricerca vettoriale può degradare rapidamente le prestazioni e consumare molte più risorse per gestire lo stesso volume di ricerca.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Show_me_shoes_similar_to_this_photo_but_only_in_red_and_under_100_0862a41a60.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sotto il cofano, un filtraggio efficiente dei metadati è piuttosto impegnativo. Il database vettoriale deve eseguire la scansione dell'indice del grafo, applicare i filtri dei metadati e rispondere entro un budget di latenza ristretto, ad esempio 20 millisecondi. Servire migliaia di query al secondo senza andare in bancarotta richiede un'attenta progettazione e un'accurata ottimizzazione.</p>
<p>Questo blog esplora le tecniche di filtraggio più diffuse nella ricerca vettoriale, insieme alle ottimizzazioni innovative che abbiamo inserito nel database vettoriale <a href="https://milvus.io/docs/overview.md">Milvus</a> e nel suo servizio cloud completamente gestito<a href="https://zilliz.com/cloud">(Zilliz Cloud</a>). Condivideremo anche un test di benchmark che dimostra quanto siano maggiori le prestazioni che Milvus, completamente gestito, può ottenere con un budget cloud di 1000 dollari rispetto agli altri database vettoriali.</p>
<h2 id="Graph-Index-Optimization" class="common-anchor-header">Ottimizzazione dell'indice grafico<button data-href="#Graph-Index-Optimization" class="anchor-icon" translate="no">
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
    </button></h2><p>I database vettoriali hanno bisogno di metodi di indicizzazione efficienti per gestire grandi insiemi di dati. Senza indici, un database deve confrontare la query con ogni vettore del set di dati (scansione a forza bruta), il che diventa estremamente lento con la crescita dei dati.</p>
<p><strong>Milvus</strong> supporta diversi tipi di indici per risolvere questo problema di prestazioni. I più diffusi sono i tipi di indice a grafo: HNSW (viene eseguito interamente in memoria) e DiskANN (utilizza in modo efficiente sia la memoria che l'SSD). Questi indici organizzano i vettori in una struttura di rete in cui i quartieri di vettori sono collegati su una mappa, consentendo alle ricerche di navigare rapidamente verso i risultati pertinenti, controllando solo una piccola frazione di tutti i vettori. <strong>Zilliz Cloud</strong>, il servizio Milvus completamente gestito, fa un ulteriore passo avanti introducendo Cardinal, un avanzato motore di ricerca vettoriale proprietario, che migliora ulteriormente questi indici per ottenere prestazioni ancora migliori.</p>
<p>Tuttavia, quando si aggiungono requisiti di filtraggio (come "mostra solo prodotti inferiori a 100 dollari"), emerge un nuovo problema. L'approccio standard prevede la creazione di un <em>bitset</em>, ovvero un elenco che segna i vettori che soddisfano i criteri del filtro. Durante la ricerca, il sistema considera solo i vettori contrassegnati come validi in questo bitset. Questo approccio sembra logico, ma crea un problema serio: la <strong>connettività interrotta</strong>. Quando molti vettori vengono filtrati, i percorsi accuratamente costruiti nel nostro indice grafico vengono interrotti.</p>
<p>Ecco un semplice esempio del problema: nel diagramma sottostante, il punto A si collega a B, C e D, ma B, C e D non si collegano direttamente tra loro. Se il nostro filtro rimuove il punto A (forse è troppo costoso), anche se B, C e D sono rilevanti per la nostra ricerca, il percorso tra loro è interrotto. In questo modo si creano "isole" di vettori scollegati che diventano irraggiungibili durante la ricerca, danneggiando la qualità dei risultati (recall).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/simple_example_of_the_problem_0f09b36639.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Esistono due approcci comuni al filtraggio durante l'attraversamento del grafo: escludere tutti i punti filtrati in anticipo, oppure includere tutto e applicare il filtro in seguito. Come illustrato nel diagramma seguente, nessuno dei due approcci è ideale. Saltare completamente i punti filtrati può far crollare il richiamo quando il rapporto di filtraggio si avvicina a 1 (linea blu), mentre visitare ogni punto, indipendentemente dai suoi metadati, gonfia lo spazio di ricerca e rallenta notevolmente le prestazioni (linea rossa).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Filtering_ratio_911e32783b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>I ricercatori hanno proposto diversi approcci per trovare un equilibrio tra richiamo e prestazioni:</p>
<ol>
<li><strong>Strategia Alpha:</strong> Introduce un approccio probabilistico: anche se un vettore non corrisponde al filtro, potremmo comunque visitarlo durante la ricerca con una certa probabilità. Questa probabilità (alfa) dipende dal rapporto di filtraggio, cioè da quanto è rigido il filtro. Questo aiuta a mantenere le connessioni essenziali nel grafo senza visitare troppi vettori irrilevanti.</li>
</ol>
<ol start="2">
<li><strong>Metodo ACORN [1]:</strong> Nel metodo HNSW standard, la potatura dei bordi viene utilizzata durante la costruzione dell'indice per creare un grafo rado e accelerare la ricerca. Il metodo ACORN salta deliberatamente questa fase di potatura per conservare un maggior numero di spigoli e rafforzare la connettività, fattore cruciale quando i filtri potrebbero escludere molti nodi. In alcuni casi, ACORN espande anche l'elenco dei vicini di ciascun nodo, raccogliendo altri vicini approssimativi, rafforzando ulteriormente il grafo. Inoltre, il suo algoritmo di attraversamento guarda due passi avanti (cioè esamina i vicini dei vicini), migliorando le possibilità di trovare percorsi validi anche in presenza di elevati rapporti di filtraggio.</li>
</ol>
<ol start="3">
<li><strong>Vicini selezionati dinamicamente:</strong> Un metodo che migliora la strategia Alpha. Invece di affidarsi al salto probabilistico, questo approccio seleziona in modo adattivo i nodi successivi durante la ricerca. Offre un maggiore controllo rispetto alla strategia Alpha.</li>
</ol>
<p>In Milvus, abbiamo implementato la strategia Alpha insieme ad altre tecniche di ottimizzazione. Ad esempio, cambia dinamicamente strategia quando rileva filtri estremamente selettivi: quando, ad esempio, circa il 99% dei dati non corrisponde all'espressione di filtraggio, la strategia "include tutto" farebbe allungare notevolmente i percorsi di attraversamento del grafo, con conseguente degrado delle prestazioni e "isole" di dati isolate. In questi casi, Milvus ripiega automaticamente su una scansione a forza bruta, aggirando completamente l'indice del grafo per una maggiore efficienza. In Cardinal, il motore di ricerca vettoriale che alimenta Milvus completamente gestito (Zilliz Cloud), abbiamo portato avanti questo concetto implementando una combinazione dinamica di metodi di attraversamento "include-all" ed "esclude-all" che si adatta in modo intelligente in base alle statistiche dei dati per ottimizzare le prestazioni delle query.</p>
<p>I nostri esperimenti sul dataset Cohere 1M (dimensione = 768) utilizzando un'istanza AWS r7gd.4xlarge dimostrano l'efficacia di questo approccio. Nel grafico sottostante, la linea blu rappresenta la nostra strategia di combinazione dinamica, mentre la linea rossa illustra l'approccio di base che attraversa tutti i punti filtrati del grafico.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Graph_2_067a13500b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Metadata-Aware-Indexing" class="common-anchor-header">Indicizzazione consapevole dei metadati<button data-href="#Metadata-Aware-Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>Un'altra sfida deriva dal rapporto tra metadati e incorporazioni vettoriali. Nella maggior parte delle applicazioni, le proprietà dei metadati di un elemento (ad esempio, il prezzo di un prodotto) hanno un legame minimo con ciò che il vettore rappresenta effettivamente (il significato semantico o le caratteristiche visive). Ad esempio, un <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">abito</annotation><mrow><mi>90dressanda90</mi></mrow><annotation encoding="application/x-tex">e una</annotation></semantics></math></span></span>cintura <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord mathnormal">90dressanda90</span></span></span></span>hanno lo stesso prezzo ma presentano caratteristiche visive completamente diverse. Questo scollamento rende la combinazione di filtraggio e ricerca vettoriale intrinsecamente inefficiente.</p>
<p>Per risolvere questo problema, abbiamo sviluppato <strong>indici vettoriali consapevoli dei metadati</strong>. Invece di avere un unico grafico per tutti i vettori, costruisce "sottografi" specializzati per i diversi valori dei metadati. Ad esempio, se i dati hanno campi per "colore" e "forma", vengono create strutture grafiche separate per questi campi.</p>
<p>Quando si effettua una ricerca con un filtro del tipo "colore = blu", si utilizza il sottografo specifico per il colore anziché il grafo principale. Questo è molto più veloce, perché il sottografo è già organizzato in base ai metadati che si stanno filtrando.</p>
<p>Nella figura seguente, l'indice del grafo principale è chiamato <strong>grafo di base</strong>, mentre i grafi specializzati costruiti per campi di metadati specifici sono chiamati <strong>grafi di colonna</strong>. Per gestire efficacemente l'uso della memoria, limita il numero di connessioni che ogni punto può avere (out-degree). Quando una ricerca non include alcun filtro sui metadati, viene utilizzato il grafo di base. Quando vengono applicati dei filtri, passa al grafo a colonne appropriato, offrendo un vantaggio significativo in termini di velocità.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Metadata_Aware_Indexing_7c3e0707d9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Iterative-Filtering" class="common-anchor-header">Filtraggio iterativo<button data-href="#Iterative-Filtering" class="anchor-icon" translate="no">
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
    </button></h2><p>A volte il filtro stesso diventa il collo di bottiglia, non la ricerca vettoriale. Ciò accade soprattutto con filtri complessi come le condizioni JSON o i confronti dettagliati tra stringhe. L'approccio tradizionale (prima il filtro, poi la ricerca) può essere estremamente lento perché il sistema deve valutare questi filtri costosi su milioni di record prima ancora di avviare la ricerca vettoriale.</p>
<p>Si potrebbe pensare: "Perché non fare prima la ricerca vettoriale e poi filtrare i risultati migliori?". Questo approccio a volte funziona, ma ha un grosso difetto: se il vostro filtro è rigido e filtra la maggior parte dei risultati, potreste ritrovarvi con un numero troppo basso (o nullo) di risultati dopo il filtraggio.</p>
<p>Per risolvere questo dilemma, abbiamo creato <strong>Iterative Filtering</strong> in Milvus e Zilliz Cloud, ispirandoci a<a href="https://www.usenix.org/system/files/osdi23-zhang-qianxi_1.pdf"> VBase</a>. Invece di un approccio "tutto o niente", il filtraggio iterativo funziona per lotti:</p>
<ol>
<li><p>Ottenere un gruppo delle corrispondenze vettoriali più vicine</p></li>
<li><p>Applicare i filtri a questo gruppo</p></li>
<li><p>Se non ci sono abbastanza risultati filtrati, si ottiene un altro lotto.</p></li>
<li><p>Ripetere l'operazione finché non si ottiene il numero di risultati richiesto.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Iterative_Filtering_b65a057559.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Questo approccio riduce drasticamente il numero di operazioni di filtraggio costose da eseguire, garantendo comunque un numero sufficiente di risultati di alta qualità. Per ulteriori informazioni sull'abilitazione del filtraggio iterativo, consultare questa <a href="https://docs.zilliz.com/docs/filtered-search#iterative-filtering">pagina del documento sul filtraggio iterativo</a>.</p>
<h2 id="External-Filtering" class="common-anchor-header">Filtraggio esterno<button data-href="#External-Filtering" class="anchor-icon" translate="no">
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
    </button></h2><p>Molte applicazioni del mondo reale suddividono i dati in sistemi diversi: vettori in un database vettoriale e metadati in database tradizionali. Ad esempio, molte organizzazioni memorizzano le descrizioni dei prodotti e le recensioni degli utenti come vettori in Milvus per la ricerca semantica, mentre mantengono lo stato delle scorte, i prezzi e altri dati strutturati in database tradizionali come PostgreSQL o MongoDB.</p>
<p>Questa separazione ha senso dal punto di vista architettonico, ma crea una sfida per le ricerche filtrate. Il flusso di lavoro tipico diventa:</p>
<ul>
<li><p>Interrogare il database relazionale per trovare i record che corrispondono ai criteri del filtro (ad esempio, "articoli in stock sotto i 50 dollari").</p></li>
<li><p>Ottenere gli ID corrispondenti e inviarli a Milvus per filtrare la ricerca vettoriale.</p></li>
<li><p>Eseguire la ricerca semantica solo sui vettori che corrispondono a questi ID.</p></li>
</ul>
<p>Sembra semplice, ma quando il numero di righe cresce oltre i milioni, diventa un collo di bottiglia. Il trasferimento di grandi elenchi di ID consuma la larghezza di banda della rete e l'esecuzione di massicce espressioni di filtro in Milvus aggiunge overhead.</p>
<p>Per risolvere questo problema, abbiamo introdotto il <strong>filtraggio esterno</strong> in Milvus, una soluzione leggera a livello di SDK che utilizza l'API dell'iteratore di ricerca e inverte il flusso di lavoro tradizionale.</p>
<ul>
<li><p>Esegue prima la ricerca vettoriale, recuperando gruppi di candidati semanticamente più rilevanti.</p></li>
<li><p>Applica la funzione di filtro personalizzata a ciascun batch sul lato client.</p></li>
<li><p>Recupera automaticamente altri lotti fino a quando non si dispone di un numero sufficiente di risultati filtrati.</p></li>
</ul>
<p>Questo approccio iterativo a lotti riduce in modo significativo il traffico di rete e l'overhead di elaborazione, poiché si lavora solo con i candidati più promettenti della ricerca vettoriale.</p>
<p>Ecco un esempio di utilizzo del filtraggio esterno in pymilvus:</p>
<pre><code translate="no">vector_to_search = rng.random((<span class="hljs-number">1</span>, DIM), np.float32)
expr = <span class="hljs-string">f&quot;10 &lt;= <span class="hljs-subst">{AGE}</span> &lt;= 25&quot;</span>
valid_ids = [<span class="hljs-number">1</span>, <span class="hljs-number">12</span>, <span class="hljs-number">123</span>, <span class="hljs-number">1234</span>]

<span class="hljs-keyword">def</span> <span class="hljs-title function_">external_filter_func</span>(<span class="hljs-params">hits: Hits</span>):
    <span class="hljs-keyword">return</span> <span class="hljs-built_in">list</span>(<span class="hljs-built_in">filter</span>(<span class="hljs-keyword">lambda</span> hit: hit.<span class="hljs-built_in">id</span> <span class="hljs-keyword">in</span> valid_ids, hits))

search_iterator = milvus_client.search_iterator(
    collection_name=collection_name,
    data=vector_to_search,
    batch_size=<span class="hljs-number">100</span>,
    anns_field=PICTURE,
    <span class="hljs-built_in">filter</span>=expr,
    external_filter_func=external_filter_func,
    output_fields=[USER_ID, AGE]
)

<span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
    res = search_iterator.<span class="hljs-built_in">next</span>()
    <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(res) == <span class="hljs-number">0</span>:
        search_iterator.close()
        <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(res)):
        <span class="hljs-built_in">print</span>(res[i])
<button class="copy-code-btn"></button></code></pre>
<p>A differenza del filtraggio iterativo, che opera su iteratori a livello di segmento, il filtraggio esterno opera a livello di query globale. Questo design riduce al minimo la valutazione dei metadati ed evita l'esecuzione di filtri di grandi dimensioni all'interno di Milvus, ottenendo prestazioni end-to-end più snelle e veloci.</p>
<h2 id="AutoIndex" class="common-anchor-header">Indice automatico<button data-href="#AutoIndex" class="anchor-icon" translate="no">
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
    </button></h2><p>La ricerca vettoriale comporta sempre un compromesso tra precisione e velocità: più vettori si controllano, migliori sono i risultati, ma più lenta è la query. Quando si aggiungono i filtri, questo equilibrio diventa ancora più difficile da raggiungere.</p>
<p>In Zilliz Cloud abbiamo creato <strong>AutoIndex</strong>, un ottimizzatore basato su ML che regola automaticamente questo equilibrio per voi. Invece di configurare manualmente parametri complessi, AutoIndex utilizza l'apprendimento automatico per determinare le impostazioni ottimali per i vostri dati specifici e i modelli di query.</p>
<p>Per capire come funziona, è utile conoscere un po' l'architettura di Milvus, dato che Zilliz è costruito sopra Milvus: Le query sono distribuite su più istanze di QueryNode. Ogni nodo gestisce una porzione di dati (un segmento), esegue la ricerca e poi i risultati vengono uniti.</p>
<p>AutoIndex analizza le statistiche di questi segmenti ed effettua regolazioni intelligenti. In caso di basso rapporto di filtraggio, l'intervallo di query dell'indice viene ampliato per aumentare il richiamo. Se il rapporto di filtraggio è alto, l'intervallo di query viene ristretto per evitare di sprecare energie su candidati improbabili. Queste decisioni sono guidate da modelli statistici che prevedono la strategia di ricerca più efficace per ogni specifico scenario di filtraggio.</p>
<p>AutoIndex va oltre i parametri di indicizzazione. Aiuta anche a selezionare la migliore strategia di valutazione dei filtri. Analizzando le espressioni dei filtri e campionando i dati dei segmenti, può stimare i costi di valutazione. Se rileva costi di valutazione elevati, passa automaticamente a tecniche più efficienti, come il filtraggio iterativo. Questa regolazione dinamica consente di utilizzare sempre la strategia più adatta per ogni query.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Autoindex_3f37988d5c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Performance-on-a-1000-Budget" class="common-anchor-header">Prestazioni con un budget di 1.000 dollari<button data-href="#Performance-on-a-1000-Budget" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebbene i miglioramenti teorici siano importanti, le prestazioni reali sono quelle che contano per la maggior parte degli sviluppatori. Abbiamo voluto verificare come queste ottimizzazioni si traducono in prestazioni effettive dell'applicazione con vincoli di budget realistici.</p>
<p>Abbiamo effettuato un benchmark di diverse soluzioni di database vettoriali con un budget mensile di 1.000 dollari, una cifra ragionevole che molte aziende destinano all'infrastruttura di ricerca vettoriale. Per ogni soluzione, abbiamo selezionato la configurazione di istanza con le prestazioni più elevate possibili nel rispetto di questo vincolo di budget.</p>
<p>I nostri test hanno utilizzato:</p>
<ul>
<li><p>Il dataset Cohere 1M con 1 milione di vettori a 768 dimensioni.</p></li>
<li><p>Un mix di carichi di lavoro di ricerca filtrati e non filtrati del mondo reale</p></li>
<li><p>Lo strumento di benchmark open-source vdb-bench per confronti coerenti.</p></li>
</ul>
<p>Le soluzioni concorrenti (anonimizzate come "VDB A", "VDB B" e "VDB C") sono state tutte configurate in modo ottimale, nel rispetto del budget. I risultati hanno mostrato che Milvus (Zilliz Cloud), completamente gestito, ha ottenuto il throughput più elevato sia per le query filtrate che per quelle non filtrate. Con lo stesso budget di 1.000 dollari, le nostre tecniche di ottimizzazione offrono le migliori prestazioni con un richiamo competitivo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Performance_on_a_1_000_Budget_5ebefaec48.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>La ricerca vettoriale con filtro può sembrare semplice in apparenza: basta aggiungere una clausola di filtro alla query e il gioco è fatto. Tuttavia, come abbiamo dimostrato in questo blog, il raggiungimento di prestazioni elevate e di risultati accurati su scala richiede soluzioni ingegneristiche sofisticate. Milvus e Zilliz Cloud affrontano queste sfide con diversi approcci innovativi:</p>
<ul>
<li><p><strong>Ottimizzazione dell'indice grafico</strong>: Preserva i percorsi tra elementi simili anche quando i filtri rimuovono i nodi di collegamento, evitando il problema delle "isole" che riduce la qualità dei risultati.</p></li>
<li><p><strong>Indicizzazione consapevole dei metadati</strong>: Crea percorsi specializzati per le condizioni di filtro più comuni, rendendo le ricerche filtrate significativamente più veloci senza sacrificare l'accuratezza.</p></li>
<li><p><strong>Filtraggio iterativo</strong>: Elabora i risultati in lotti, applicando filtri complessi solo ai candidati più promettenti invece che all'intero set di dati.</p></li>
<li><p><strong>AutoIndex</strong>: Utilizza l'apprendimento automatico per regolare automaticamente i parametri di ricerca in base ai dati e alle query, bilanciando velocità e precisione senza configurazione manuale.</p></li>
<li><p><strong>Filtro esterno</strong>: Collega la ricerca vettoriale con database esterni in modo efficiente, eliminando i colli di bottiglia della rete e mantenendo la qualità dei risultati.</p></li>
</ul>
<p>Milvus e Zilliz Cloud continuano a evolversi con nuove funzionalità che migliorano ulteriormente le prestazioni della ricerca filtrata. Funzioni come<a href="https://docs.zilliz.com/docs/use-partition-key"> Partition Key</a> consentono di organizzare i dati in modo ancora più efficiente in base ai modelli di filtraggio, mentre le tecniche avanzate di instradamento dei sottografi spingono ancora più in là i limiti delle prestazioni.</p>
<p>Il volume e la complessità dei dati non strutturati continuano a crescere in modo esponenziale, creando nuove sfide per i sistemi di ricerca di tutto il mondo. Il nostro team si spinge costantemente oltre i limiti di ciò che è possibile fare con i database vettoriali per offrire una ricerca AI più veloce e scalabile.</p>
<p>Se le vostre applicazioni hanno dei colli di bottiglia nelle prestazioni con la ricerca vettoriale filtrata, vi invitiamo a unirvi alla nostra attiva comunità di sviluppatori su <a href="https://milvus.io/community">milvus.io/community</a>, dove potrete condividere le sfide, accedere alle indicazioni degli esperti e scoprire le best practice emergenti.</p>
<h2 id="References" class="common-anchor-header">Riferimenti<button data-href="#References" class="anchor-icon" translate="no">
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
<li><p><a href="https://arxiv.org/pdf/2403.04871">https://arxiv.org/pdf/2403.04871</a></p></li>
<li><p><a href="https://www.usenix.org/system/files/osdi23-zhang-qianxi_1.pdf">https://www.usenix.org/system/files/osdi23-zhang-qianxi_1.pdf</a></p></li>
</ol>
<hr>
