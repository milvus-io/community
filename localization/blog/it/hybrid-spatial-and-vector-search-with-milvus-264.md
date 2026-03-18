---
id: hybrid-spatial-and-vector-search-with-milvus-264.md
title: Come utilizzare la ricerca spaziale e vettoriale ibrida con Milvus
author: Alden
date: 2026-3-18
cover: assets.zilliz.com/cover_8b550decfe.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus 2.6.4, hybrid spatial vector search, Milvus Geometry, R-Tree index,
  vector database geospatial search
meta_title: |
  Hybrid Spatial and Vector Search with Milvus 2.6.4 (Geometry & R-Tree)
desc: >-
  Scoprite come Milvus 2.6.4 consente la ricerca ibrida spaziale e vettoriale
  utilizzando Geometry e R-Tree, con approfondimenti sulle prestazioni ed esempi
  pratici.
origin: 'https://milvus.io/blog/hybrid-spatial-and-vector-search-with-milvus-264.md'
---
<p>Una query come "trovare ristoranti romantici nel raggio di 3 km" sembra semplice. Non lo è, perché combina il filtraggio della posizione e la ricerca semantica. La maggior parte dei sistemi deve dividere questa query su due database, il che significa sincronizzare i dati, unire i risultati nel codice e aumentare la latenza.</p>
<p><a href="https://milvus.io">Milvus</a> 2.6.4 elimina questa suddivisione. Con un tipo di dati nativo <strong>GEOMETRY</strong> e un indice <strong>R-Tree</strong>, Milvus può applicare vincoli di localizzazione e semantici in un'unica query. Questo rende la ricerca spaziale e semantica ibrida molto più semplice ed efficiente.</p>
<p>Questo articolo spiega perché questa modifica era necessaria, come GEOMETRY e R-Tree funzionano all'interno di Milvus, quali vantaggi prestazionali ci si può aspettare e come configurarli con l'SDK Python.</p>
<h2 id="The-Limitations-of-Traditional-Geo-and-Semantic-Search" class="common-anchor-header">I limiti della ricerca geo-semantica tradizionale<button data-href="#The-Limitations-of-Traditional-Geo-and-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Query come "ristoranti romantici nel raggio di 3 km" sono difficili da gestire per due motivi:</p>
<ul>
<li><strong>Il termine "romantico" richiede una ricerca semantica.</strong> Il sistema deve vettorializzare le recensioni e i tag dei ristoranti, quindi trovare le corrispondenze in base alla somiglianza nello spazio di incorporazione. Questo funziona solo in un database vettoriale.</li>
<li><strong>"Entro 3 km" richiede un filtro spaziale.</strong> I risultati devono essere limitati a "entro 3 km dall'utente" o, talvolta, "all'interno di uno specifico poligono o confine amministrativo".</li>
</ul>
<p>In un'architettura tradizionale, soddisfare entrambe le esigenze significava di solito gestire due sistemi affiancati:</p>
<ul>
<li><strong>PostGIS / Elasticsearch</strong> per il geofencing, il calcolo delle distanze e il filtraggio spaziale.</li>
<li>Un <strong>database vettoriale</strong> per la ricerca approssimativa dei vicini (ANN) sugli embeddings.</li>
</ul>
<p>Questo design "a due database" crea tre problemi pratici:</p>
<ul>
<li><strong>Sincronizzazione dolorosa dei dati.</strong> Se un ristorante cambia indirizzo, è necessario aggiornare sia il sistema geo che il database vettoriale. La mancanza di un aggiornamento produce risultati incoerenti.</li>
<li><strong>Maggiore latenza.</strong> L'applicazione deve chiamare due sistemi e unire i loro risultati, aggiungendo giri di rete e tempo di elaborazione.</li>
<li><strong>Filtraggio inefficiente.</strong> Se il sistema eseguiva prima la ricerca vettoriale, spesso restituiva molti risultati lontani dall'utente, che dovevano essere scartati in seguito. Se si applicava prima il filtraggio della posizione, l'insieme rimanente era ancora grande, quindi la fase di ricerca vettoriale era ancora costosa.</li>
</ul>
<p>Milvus 2.6.4 ha risolto questo problema aggiungendo il supporto della geometria spaziale direttamente al database vettoriale. La ricerca semantica e il filtraggio della posizione sono ora eseguiti nella stessa query. Con tutto in un unico sistema, la ricerca ibrida è più veloce e più facile da gestire.</p>
<h2 id="What-GEOMETRY-Adds-to-Milvus" class="common-anchor-header">Cosa aggiunge GEOMETRY a Milvus<button data-href="#What-GEOMETRY-Adds-to-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 introduce un tipo di campo scalare chiamato DataType.GEOMETRY. Invece di memorizzare le località come numeri separati di longitudine e latitudine, Milvus ora memorizza oggetti geometrici: punti, linee e poligoni. Quesiti come "questo punto è all'interno di una regione?" o "è entro X metri?" diventano operazioni native. Non c'è più bisogno di costruire workaround sulle coordinate grezze.</p>
<p>L'implementazione segue lo<strong>standard</strong> <a href="https://www.ogc.org/standard/sfa/"></a><strong>OpenGIS Simple Features Access</strong>, quindi funziona con la maggior parte degli strumenti geospaziali esistenti. I dati geometrici sono memorizzati e interrogati utilizzando <strong>WKT (Well-Known Text)</strong>, un formato di testo standard leggibile dall'uomo e analizzabile dai programmi.</p>
<p>Tipi di geometria supportati:</p>
<ul>
<li><strong>PUNTO</strong>: una singola posizione, come l'indirizzo di un negozio o la posizione in tempo reale di un veicolo.</li>
<li><strong>LINEA</strong>: una linea, come la linea centrale di una strada o un percorso di movimento.</li>
<li><strong>POLIGONO</strong>: un'area, come un confine amministrativo o un geofence.</li>
<li><strong>Tipi di raccolta</strong>: MULTIPOINT, MULTILINESTRING, MULTIPOLYGON e GEOMETRYCOLLECTION.</li>
</ul>
<p>Supporta inoltre gli operatori spaziali standard, tra cui:</p>
<ul>
<li><strong>Relazioni spaziali</strong>: contenimento (ST_CONTAINS, ST_WITHIN), intersezione (ST_INTERSECTS, ST_CROSSES) e contatto (ST_TOUCHES).</li>
<li><strong>Operazioni di distanza</strong>: calcolo delle distanze tra le geometrie (ST_DISTANCE) e filtraggio degli oggetti entro una determinata distanza (ST_DWITHIN).</li>
</ul>
<h2 id="How-R-Tree-Indexing-Works-Inside-Milvus" class="common-anchor-header">Come funziona l'indicizzazione R-Tree in Milvus<button data-href="#How-R-Tree-Indexing-Works-Inside-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Il supporto per la GEOMETRIA è integrato nel motore di interrogazione di Milvus, non solo esposto come funzione API. I dati ISpatial vengono indicizzati ed elaborati direttamente all'interno del motore utilizzando l'indice R-Tree (Rectangle Tree).</p>
<p>Un <strong>R-Tree</strong> raggruppa gli oggetti vicini utilizzando i <strong>rettangoli minimi di delimitazione (MBR)</strong>. Durante l'interrogazione, il motore salta le grandi regioni che non si sovrappongono alla geometria dell'interrogazione ed esegue controlli dettagliati solo su un piccolo insieme di candidati. Questo è molto più veloce della scansione di ogni oggetto.</p>
<h3 id="How-Milvus-Builds-the-R-Tree" class="common-anchor-header">Come Milvus costruisce l'albero R</h3><p>La costruzione dell'albero R avviene per livelli:</p>
<table>
<thead>
<tr><th><strong>Livello</strong></th><th><strong>Cosa fa Milvus</strong></th><th><strong>Analogia intuitiva</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Livello della foglia</strong></td><td>Per ogni oggetto geometrico (punto, linea o poligono), Milvus calcola il suo rettangolo minimo di delimitazione (MBR) e lo memorizza come nodo foglia.</td><td>Avvolge ogni oggetto in un riquadro trasparente che gli si adatta esattamente.</td></tr>
<tr><td><strong>Livelli intermedi</strong></td><td>I nodi foglia vicini vengono raggruppati (in genere 50-100 alla volta) e viene creato un MBR genitore più grande per coprirli tutti.</td><td>Mettere i pacchi dello stesso quartiere in un'unica cassa di consegna.</td></tr>
<tr><td><strong>Livello radice</strong></td><td>Questo raggruppamento continua verso l'alto fino a quando tutti i dati sono coperti da un unico MBR principale.</td><td>Caricamento di tutte le casse su un unico camion a lunga percorrenza.</td></tr>
</tbody>
</table>
<p>Con questa struttura, la complessità delle interrogazioni spaziali passa da una scansione completa <strong>O(n)</strong> a <strong>O(log n)</strong>. In pratica, le interrogazioni su milioni di record possono passare da centinaia di millisecondi a pochi millisecondi, senza perdere in precisione.</p>
<h3 id="How-Queries-are-Executed-Two-Phase-Filtering" class="common-anchor-header">Come vengono eseguite le query: Filtraggio in due fasi</h3><p>Per bilanciare velocità e correttezza, Milvus utilizza una strategia di <strong>filtraggio a due fasi</strong>:</p>
<ul>
<li><strong>Filtro grezzo:</strong> l'indice R-Tree controlla innanzitutto se il rettangolo di delimitazione della query si sovrappone ad altri rettangoli di delimitazione presenti nell'indice. In questo modo si rimuove rapidamente la maggior parte dei dati non correlati e si mantiene solo un piccolo insieme di candidati. Poiché questi rettangoli sono forme semplici, il controllo è molto veloce, ma può includere alcuni risultati che non corrispondono effettivamente.</li>
<li><strong>Filtro fine</strong>: i candidati rimanenti vengono controllati con <strong>GEOS</strong>, la stessa libreria geometrica utilizzata da sistemi come PostGIS. GEOS esegue calcoli geometrici esatti, ad esempio se le forme si intersecano o se una contiene l'altra, per produrre risultati finali corretti.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Hybrid_Spatialand_Vector_Searchwith_Milvus2_6_1_978d62cb30.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus accetta dati geometrici in formato <strong>WKT (Well-Known Text)</strong> ma li memorizza internamente come <strong>WKB (Well-Known Binary).</strong> Il formato WKB è più compatto, il che riduce la memorizzazione e migliora l'I/O. I campi GEOMETRY supportano anche la memorizzazione in memory-mapped (mmap), in modo che i grandi insiemi di dati spaziali non debbano stare interamente nella RAM.</p>
<h2 id="Performance-Improvements-with-R-Tree" class="common-anchor-header">Miglioramenti delle prestazioni con R-Tree<button data-href="#Performance-Improvements-with-R-Tree" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Query-Latency-Stays-Flat-as-Data-Grows" class="common-anchor-header">La latenza delle query rimane invariata con la crescita dei dati.</h3><p>Senza un indice R-Tree, il tempo di interrogazione scala linearmente con la dimensione dei dati: un numero di dati 10 volte superiore significa query circa 10 volte più lente.</p>
<p>Con R-Tree, il tempo di interrogazione cresce in modo logaritmico. Su set di dati con milioni di record, il filtraggio spaziale può essere da decine a centinaia di volte più veloce di una scansione completa.</p>
<h3 id="Accuracy-is-Not-Sacrificed-For-Speed" class="common-anchor-header">La precisione non viene sacrificata per la velocità</h3><p>L'R-Tree restringe i candidati in base al riquadro di delimitazione, quindi GEOS controlla ciascuno di essi con la matematica della geometria esatta. Tutto ciò che sembra corrispondere, ma in realtà non rientra nell'area di ricerca, viene eliminato nel secondo passaggio.</p>
<h3 id="Hybrid-Search-Throughput-Improves" class="common-anchor-header">Il rendimento della ricerca ibrida migliora</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Hybrid_Spatialand_Vector_Searchwith_Milvus2_6_2_b458b24bf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>L'R-Tree rimuove prima i record al di fuori dell'area di destinazione. Milvus esegue quindi la similarità vettoriale (L2, IP o coseno) solo sui candidati rimanenti. Un minor numero di candidati significa un costo di ricerca inferiore e un aumento delle query al secondo (QPS).</p>
<h2 id="Getting-Started-GEOMETRY-with-the-Python-SDK" class="common-anchor-header">Per iniziare: GEOMETRIA con l'SDK Python<button data-href="#Getting-Started-GEOMETRY-with-the-Python-SDK" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Define-the-Collection-and-Create-Indexes" class="common-anchor-header">Definire la collezione e creare gli indici</h3><p>Per prima cosa, definire un campo DataType.GEOMETRY nello schema della collezione. Questo permette a Milvus di memorizzare e interrogare i dati geometrici.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType  
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np  
<span class="hljs-comment"># Connect to Milvus  </span>
milvus_client = MilvusClient(<span class="hljs-string">&quot;[http://localhost:19530](http://localhost:19530)&quot;</span>)  
collection_name = <span class="hljs-string">&quot;lb_service_demo&quot;</span>  
dim = <span class="hljs-number">128</span>  
<span class="hljs-comment"># 1. Define schema  </span>
schema = milvus_client.create_schema(enable_dynamic_field=<span class="hljs-literal">True</span>)  
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)  
schema.add_field(<span class="hljs-string">&quot;vector&quot;</span>, DataType.FLOAT_VECTOR, dim=dim)  
schema.add_field(<span class="hljs-string">&quot;location&quot;</span>, DataType.GEOMETRY)  <span class="hljs-comment"># Define geometry field  </span>
schema.add_field(<span class="hljs-string">&quot;poi_name&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">128</span>)  
<span class="hljs-comment"># 2. Create index parameters  </span>
index_params = milvus_client.prepare_index_params()  
<span class="hljs-comment"># Create an index for the vector field (e.g., IVF_FLAT)  </span>
index_params.add_index(  
   field_name=<span class="hljs-string">&quot;vector&quot;</span>,  
   index_type=<span class="hljs-string">&quot;IVF_FLAT&quot;</span>,  
   metric_type=<span class="hljs-string">&quot;L2&quot;</span>,  
   params={<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">128</span>}  
)  
<span class="hljs-comment"># Create an R-Tree index for the geometry field (key step)  </span>
index_params.add_index(  
   field_name=<span class="hljs-string">&quot;location&quot;</span>,  
   index_type=<span class="hljs-string">&quot;RTREE&quot;</span>  <span class="hljs-comment"># Specify the index type as RTREE  </span>
)  
<span class="hljs-comment"># 3. Create collection  </span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):  
   milvus_client.drop_collection(collection_name)  
milvus_client.create_collection(  
   collection_name=collection_name,  
   schema=schema,  
   index_params=index_params,  <span class="hljs-comment"># Create the collection with indexes attached  </span>
   consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>  
)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection <span class="hljs-subst">{collection_name}</span> created with R-Tree index.&quot;</span>)  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Insert-Data" class="common-anchor-header">Inserire i dati</h3><p>Quando si inseriscono i dati, i valori geometrici devono essere in formato WKT (Well-Known Text). Ogni record include la geometria, il vettore e altri campi.</p>
<pre><code translate="no"><span class="hljs-comment"># Mock data: random POIs in a region of Beijing  </span>
data = []  
<span class="hljs-comment"># Example WKT: POINT(longitude latitude)  </span>
geo_points = [  
   <span class="hljs-string">&quot;POINT(116.4074 39.9042)&quot;</span>,  <span class="hljs-comment"># Near the Forbidden City  </span>
   <span class="hljs-string">&quot;POINT(116.4600 39.9140)&quot;</span>,  <span class="hljs-comment"># Near Guomao  </span>
   <span class="hljs-string">&quot;POINT(116.3200 39.9900)&quot;</span>,  <span class="hljs-comment"># Near Tsinghua University  </span>
]  
<span class="hljs-keyword">for</span> i, wkt <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(geo_points):  
   vec = np.random.random(dim).tolist()  
   data.append({  
       <span class="hljs-string">&quot;id&quot;</span>: i,  
       <span class="hljs-string">&quot;vector&quot;</span>: vec,  
       <span class="hljs-string">&quot;location&quot;</span>: wkt,  
       <span class="hljs-string">&quot;poi_name&quot;</span>: <span class="hljs-string">f&quot;POI_<span class="hljs-subst">{i}</span>&quot;</span>  
   })  
res = milvus_client.insert(collection_name=collection_name, data=data)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted <span class="hljs-subst">{res[<span class="hljs-string">&#x27;insert_count&#x27;</span>]}</span> entities.&quot;</span>)  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Run-a-Hybrid-Spatial-Vector-Query-Example" class="common-anchor-header">Esecuzione di una query spaziale-vettoriale ibrida (esempio)</h3><p><strong>Scenario:</strong> trovare i 3 POI più simili nello spazio vettoriale e situati entro 2 chilometri da un determinato punto, ad esempio la posizione dell'utente.</p>
<p>Utilizzare l'operatore ST_DWITHIN per applicare il filtro della distanza. Il valore della distanza è specificato in <strong>metri.</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Load the collection into memory  </span>
milvus_client.load_collection(collection_name)  
<span class="hljs-comment"># User location (WKT)  </span>
user_loc_wkt = <span class="hljs-string">&quot;POINT(116.4070 39.9040)&quot;</span>  
search_vec = np.random.random(dim).tolist()  
<span class="hljs-comment"># Build the filter expression: use ST_DWITHIN for a 2000-meter radius filter  </span>
filter_expr = <span class="hljs-string">f&quot;ST_DWITHIN(location, &#x27;<span class="hljs-subst">{user_loc_wkt}</span>&#x27;, 2000)&quot;</span>  
<span class="hljs-comment"># Execute the search  </span>
search_res = milvus_client.search(  
   collection_name=collection_name,  
   data=[search_vec],  
   <span class="hljs-built_in">filter</span>=filter_expr,  <span class="hljs-comment"># Inject geometry filter  </span>
   limit=<span class="hljs-number">3</span>,  
   output_fields=[<span class="hljs-string">&quot;poi_name&quot;</span>, <span class="hljs-string">&quot;location&quot;</span>]  
)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Search Results:&quot;</span>)  
<span class="hljs-keyword">for</span> hits <span class="hljs-keyword">in</span> search_res:  
   <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> hits:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;ID: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, Score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, Name: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;poi_name&#x27;</span>]}</span>&quot;</span>)  
<button class="copy-code-btn"></button></code></pre>
<h2 id="Tips-for-Production-Use" class="common-anchor-header">Suggerimenti per l'uso in produzione<button data-href="#Tips-for-Production-Use" class="anchor-icon" translate="no">
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
<li><strong>Creare sempre un indice R-Tree sui campi GEOMETRIA.</strong> Per i set di dati che superano le 10.000 entità, i filtri spaziali senza un indice RTREE passano a una scansione completa e le prestazioni diminuiscono drasticamente.</li>
<li><strong>Utilizzare un sistema di coordinate coerente.</strong> Tutti i dati di localizzazione devono utilizzare lo stesso sistema (ad esempio, <a href="https://en.wikipedia.org/wiki/World_Geodetic_System"></a> WGS<a href="https://en.wikipedia.org/wiki/World_Geodetic_System">84</a>). La commistione dei sistemi di coordinate non consente di calcolare la distanza e il contenimento.</li>
<li><strong>Scegliere l'operatore spaziale giusto per la query.</strong> ST_DWITHIN per ricerche "entro X metri". ST_CONTAINS o ST_WITHIN per i controlli di geofencing e contenimento.</li>
<li><strong>I valori geometrici NULL vengono gestiti automaticamente.</strong> Se il campo GEOMETRY è nullo (nullable=True), Milvus ignora i valori nulli durante le interrogazioni spaziali. Non è necessaria alcuna logica di filtraggio aggiuntiva.</li>
</ul>
<h2 id="Deployment-Requirements" class="common-anchor-header">Requisiti per la distribuzione<button data-href="#Deployment-Requirements" class="anchor-icon" translate="no">
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
    </button></h2><p>Per utilizzare queste funzioni in produzione, assicurarsi che l'ambiente soddisfi i seguenti requisiti.</p>
<p><strong>1. Versione di Milvus</strong></p>
<p>È necessario eseguire <strong>Milvus 2.6.4 o versione successiva</strong>. Le versioni precedenti non supportano DataType.GEOMETRY o il tipo di indice <strong>RTREE</strong>.</p>
<p><strong>2. Versioni SDK</strong></p>
<ul>
<li><strong>PyMilvus</strong>: aggiornare alla versione più recente (si consiglia la serie <strong>2.6.x</strong> ). È necessario per la corretta serializzazione di WKT e per il passaggio dei parametri dell'indice RTREE.</li>
<li><strong>SDK Java / Go / Node</strong>: controllare le note di rilascio di ciascun SDK e verificare che siano allineate con le definizioni del proto <strong>2.6.4</strong>.</li>
</ul>
<p><strong>3. Librerie geometriche integrate</strong></p>
<p>Il server Milvus include già Boost.Geometry e GEOS, quindi non è necessario installare queste librerie.</p>
<p><strong>4. Uso della memoria e pianificazione della capacità</strong></p>
<p>Gli indici R-Tree utilizzano molta memoria. Quando si pianifica la capacità, occorre tenere conto degli indici geometrici e di quelli vettoriali come HNSW o IVF. Il campo GEOMETRY supporta la memorizzazione memory-mapped (mmap), che può ridurre l'uso della memoria mantenendo parte dei dati su disco.</p>
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
    </button></h2><p>La ricerca semantica basata sulla posizione ha bisogno di qualcosa di più che imbullonare un filtro geografico a una query vettoriale. Richiede tipi di dati spaziali integrati, indici adeguati e un motore di query in grado di gestire insieme posizione e vettori.</p>
<p><strong>Milvus 2.6.4</strong> risolve questo problema con campi <strong>GEOMETRIA</strong> nativi e indici <strong>R-Tree</strong>. Il filtraggio spaziale e la ricerca vettoriale vengono eseguiti in un'unica query, su un unico archivio di dati. L'R-Tree gestisce una rapida potatura spaziale, mentre GEOS garantisce risultati esatti.</p>
<p>Per le applicazioni che necessitano di un recupero consapevole della posizione, questo elimina la complessità di gestire e sincronizzare due sistemi separati.</p>
<p>Se state lavorando a una ricerca spaziale e vettoriale ibrida o consapevole della posizione, ci piacerebbe conoscere la vostra esperienza.</p>
<p><strong>Avete domande su Milvus?</strong> Unitevi al nostro <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canale Slack</a> o prenotate una sessione di 20 minuti di <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>.</p>
