---
id: milvus-rustfs-vibe-coding-build-a-lightweight-rag-chatbot-from-scratch.md
title: 'Milvus + RustFS+ Vibe Coding: Costruire un chatbot RAG leggero da zero'
author: Jinghe Ma
date: 2026-3-10
cover: assets.zilliz.com/blog_Milvus_Rust_FS_Vibe_Coding_Chatbot_7_f25795481e.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, RustFS, RAG chatbot,  vector database, S3-compatible object storage'
meta_keywords: 'Milvus, RustFS, RAG chatbot,  vector database, S3-compatible object storage'
meta_title: |
  Milvus + RustFS: Build a Lightweight RAG Chatbot
desc: >-
  Costruire un chatbot RAG leggero con Milvus, RustFS, FastAPI e Next.js
  utilizzando i documenti di RustFS come base di conoscenza.
origin: >-
  https://milvus.io/blog/milvus-rustfs-vibe-coding-build-a-lightweight-rag-chatbot-from-scratch.md
---
<p><em>Questo blog è stato scritto da Jinghe Ma, un collaboratore della comunità Milvus</em> <em>, e viene pubblicato qui con l'autorizzazione.</em></p>
<p>Volevo un chatbot in grado di rispondere alle domande della mia documentazione e volevo avere il pieno controllo sullo stack che c'è dietro, dalla memorizzazione degli oggetti all'interfaccia della chat. Questo mi ha portato a costruire un chatbot RAG leggero con <a href="https://milvus.io/">Milvus</a> e <a href="https://rustfs.com/">RustFS</a> al centro.</p>
<p><a href="https://milvus.io/">Milvus</a> è il database vettoriale open source più diffuso per la creazione di applicazioni RAG. Separa l'elaborazione dall'archiviazione, mantenendo i dati caldi in memoria o su SSD per una ricerca veloce, mentre si affida all'archiviazione a oggetti sottostante per una gestione dei dati scalabile ed efficiente dal punto di vista dei costi. Poiché funziona con lo storage compatibile con S3, è stato naturale per questo progetto.</p>
<p>Per il livello di archiviazione, ho scelto <a href="https://rustfs.com/">RustFS</a>, un sistema di archiviazione a oggetti open-source compatibile con S3 e scritto in Rust. Può essere distribuito tramite binario, Docker o diagramma Helm. Sebbene sia ancora in fase alfa e non sia raccomandato per i carichi di lavoro di produzione, era abbastanza stabile per questa build.</p>
<p>Una volta realizzata l'infrastruttura, avevo bisogno di una base di conoscenze da interrogare. La documentazione di RustFS - circa 80 file Markdown - era un comodo punto di partenza. Ho spezzettato i documenti, generato embeddings, li ho memorizzati in Milvus e ho codificato il resto: <a href="https://fastapi.tiangolo.com/">FastAPI</a> per il backend e <a href="https://nextjs.org/">Next.js</a> per l'interfaccia della chat.</p>
<p>In questo post, tratterò l'intero sistema end-to-end. Il codice è disponibile su https://github.com/majinghe/chatbot. Si tratta di un prototipo funzionante piuttosto che di un sistema pronto per la produzione, ma l'obiettivo è fornire una struttura chiara ed estensibile che si possa adattare al proprio uso. Ogni sezione qui di seguito illustra un livello, dall'infrastruttura al frontend.</p>
<h2 id="Installing-Milvus-and-RustFS-with-Docker-Compose" class="common-anchor-header">Installazione di Milvus e RustFS con Docker Compose<button data-href="#Installing-Milvus-and-RustFS-with-Docker-Compose" class="anchor-icon" translate="no">
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
    </button></h2><p>Iniziamo installando <a href="https://milvus.io/">Milvus</a> e <a href="https://rustfs.com/">RustFS</a>.</p>
<p>Milvus può funzionare con qualsiasi archivio di oggetti compatibile con S3, anche se MinIO è il backend predefinito nella configurazione standard. Poiché MinIO non accetta più contributi dalla comunità, in questo esempio lo sostituiremo con RustFS.</p>
<p>Per effettuare questa modifica, aggiornare la configurazione dello storage degli oggetti in configs/milvus.yaml all'interno del repository Milvus. La sezione pertinente si presenta come segue:</p>
<pre><code translate="no"><span class="hljs-attr">minio</span>:
  <span class="hljs-attr">address</span>: <span class="hljs-attr">localhost</span>:<span class="hljs-number">9000</span>
  <span class="hljs-attr">port</span>: <span class="hljs-number">9000</span>
  <span class="hljs-attr">accessKeyID</span>: rustfsadmin
  <span class="hljs-attr">secretAccessKey</span>: rustfsadmin
  <span class="hljs-attr">useSSL</span>: <span class="hljs-literal">false</span>
  <span class="hljs-attr">bucketName</span>: <span class="hljs-string">&quot;rustfs-bucket&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Ci sono due modi per applicare questa modifica:</p>
<ul>
<li><strong>Montare un file di configurazione locale.</strong> Copiare configs/milvus.yaml localmente, aggiornare i campi MinIO per puntare a RustFS, quindi montarlo nel contenitore tramite un volume Docker.</li>
<li><strong>Applicare la patch all'avvio con</strong> <strong>yq****.</strong> Modificare il comando del contenitore per eseguire yq contro /milvus/configs/milvus.yaml prima dell'avvio del processo Milvus.</li>
</ul>
<p>Questa build utilizza il primo approccio. Il servizio Milvus in docker-compose.yml riceve una voce di volume in più:</p>
<pre><code translate="no">- <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/milvus/milvus.yaml:/milvus/configs/milvus.yaml:ro
<button class="copy-code-btn"></button></code></pre>
<h3 id="The-Docker-Compose-Setup" class="common-anchor-header">L'impostazione di Docker Compose</h3><p>Il file docker-compose.yml completo esegue quattro servizi.</p>
<p><strong>etcd</strong> - Milvus dipende da etcd per l'archiviazione dei metadati:</p>
<pre><code translate="no">etcd:
    container_name: milvus-etcd
    image: quay.io/coreos/etcd:v3.5.18
    environment:
      - ETCD_AUTO_COMPACTION_MODE=revision
      - ETCD_AUTO_COMPACTION_RETENTION=1000
      - ETCD_QUOTA_BACKEND_BYTES=4294967296
      - ETCD_SNAPSHOT_COUNT=50000
    volumes:
      - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/etcd:/etcd
    <span class="hljs-built_in">command</span>: etcd -advertise-client-urls=http://etcd:2379 -listen-client-urls http://0.0.0.0:2379 --data-dir /etcd
    healthcheck:
      <span class="hljs-built_in">test</span>: [<span class="hljs-string">&quot;CMD&quot;</span>, <span class="hljs-string">&quot;etcdctl&quot;</span>, <span class="hljs-string">&quot;endpoint&quot;</span>, <span class="hljs-string">&quot;health&quot;</span>]
      interval: 30s
      <span class="hljs-built_in">timeout</span>: 20s
      retries: 3
<button class="copy-code-btn"></button></code></pre>
<p><strong>Attu</strong> - un'interfaccia visuale per Milvus, sviluppata e resa open source da Zilliz (nota: le versioni successive alla 2.6 sono closed-source):</p>
<pre><code translate="no">  attu:
    container_name: milvus-attu
    image: zilliz/attu:v2.6
    environment:
      - MILVUS_URL=milvus-standalone:19530
    ports:
      - <span class="hljs-string">&quot;8000:3000&quot;</span>
    restart: unless-stopped
<button class="copy-code-btn"></button></code></pre>
<p><strong>RustFS</strong> - il backend per l'archiviazione degli oggetti:</p>
<pre><code translate="no">rustfs:
    container_name: milvus-rustfs
    image: rustfs/rustfs:1.0.0-alpha.58
    environment:
      - RUSTFS_VOLUMES=/data/rustfs0,/data/rustfs1,/data/rustfs2,/data/rustfs3
      - RUSTFS_ADDRESS=0.0.0.0:9000
      - RUSTFS_CONSOLE_ADDRESS=0.0.0.0:9001
      - RUSTFS_CONSOLE_ENABLE=<span class="hljs-literal">true</span>
      - RUSTFS_EXTERNAL_ADDRESS=:9000  <span class="hljs-comment"># Same as internal since no port mapping</span>
      - RUSTFS_CORS_ALLOWED_ORIGINS=*
      - RUSTFS_CONSOLE_CORS_ALLOWED_ORIGINS=*
      - RUSTFS_ACCESS_KEY=rustfsadmin
      - RUSTFS_SECRET_KEY=rustfsadmin
    ports:
      - <span class="hljs-string">&quot;9000:9000&quot;</span># S3 API port
      - <span class="hljs-string">&quot;9001:9001&quot;</span># Console port
    volumes:
      - rustfs_data_0:/data/rustfs0
      - rustfs_data_1:/data/rustfs1
      - rustfs_data_2:/data/rustfs2
      - rustfs_data_3:/data/rustfs3
      - logs_data:/app/logs
    restart: unless-stopped
    healthcheck:
      <span class="hljs-built_in">test</span>:
        [
          <span class="hljs-string">&quot;CMD&quot;</span>,
          <span class="hljs-string">&quot;sh&quot;</span>, <span class="hljs-string">&quot;-c&quot;</span>,
          <span class="hljs-string">&quot;curl -f http://localhost:9000/health &amp;&amp; curl -f http://localhost:9001/health&quot;</span>
        ]
      interval: 30s
      <span class="hljs-built_in">timeout</span>: 10s
      retries: 3
      start_period: 40s
<button class="copy-code-btn"></button></code></pre>
<p><strong>Milvus</strong> - in esecuzione in modalità standalone:</p>
<pre><code translate="no">  standalone:
    container_name: milvus-standalone
    image: milvusdb/milvus:v2.6.0
    <span class="hljs-built_in">command</span>: [<span class="hljs-string">&quot;milvus&quot;</span>, <span class="hljs-string">&quot;run&quot;</span>, <span class="hljs-string">&quot;standalone&quot;</span>]
    security_opt:
    - seccomp:unconfined
    environment:
      ETCD_ENDPOINTS: etcd:2379
      MINIO_ADDRESS: rustfs:9000
      MQ_TYPE: woodpecker
    volumes:
      - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/milvus:/var/lib/milvus
      - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/milvus/milvus.yaml:/milvus/configs/milvus.yaml:ro
    healthcheck:
      <span class="hljs-built_in">test</span>: [<span class="hljs-string">&quot;CMD&quot;</span>, <span class="hljs-string">&quot;curl&quot;</span>, <span class="hljs-string">&quot;-f&quot;</span>, <span class="hljs-string">&quot;http://localhost:9091/healthz&quot;</span>]
      interval: 30s
      start_period: 90s
      <span class="hljs-built_in">timeout</span>: 20s
      retries: 3
    ports:
      - <span class="hljs-string">&quot;19530:19530&quot;</span>
      - <span class="hljs-string">&quot;9091:9091&quot;</span>
    depends_on:
      - <span class="hljs-string">&quot;etcd&quot;</span>
      - <span class="hljs-string">&quot;rustfs&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Starting-Everything" class="common-anchor-header">Avviare tutto</h3><p>Una volta completata la configurazione, avviare tutti e quattro i servizi:</p>
<pre><code translate="no">docker compose -f docker-compose.yml up -d
<button class="copy-code-btn"></button></code></pre>
<p>È possibile verificare che tutto sia in esecuzione con:</p>
<pre><code translate="no">docker ps
CONTAINER ID   IMAGE                                             COMMAND                  CREATED          STATUS                      PORTS                                                                                      NAMES
4404b5cc6f7e   milvusdb/milvus:v2.6.0                            <span class="hljs-string">&quot;/tini -- milvus run…&quot;</span>   53 minutes ago   Up 53 minutes (healthy)     0.0.0.0:9091-&gt;9091/tcp, :::9091-&gt;9091/tcp, 0.0.0.0:19530-&gt;19530/tcp, :::19530-&gt;19530/tcp   milvus-standalone
40ddc8ed08bb   zilliz/attu:v2.6                                  <span class="hljs-string">&quot;docker-entrypoint.s…&quot;</span>   53 minutes ago   Up 53 minutes               0.0.0.0:8000-&gt;3000/tcp, :::8000-&gt;3000/tcp                                                  milvus-attu
3d2c8d80a8ce   quay.io/coreos/etcd:v3.5.18                       <span class="hljs-string">&quot;etcd -advertise-cli…&quot;</span>   53 minutes ago   Up 53 minutes (healthy)     2379-2380/tcp                                                                              milvus-etcd
d760f6690ea7   rustfs/rustfs:1.0.0-alpha.58                      <span class="hljs-string">&quot;/entrypoint.sh rust…&quot;</span>   53 minutes ago   Up 53 minutes (unhealthy)   0.0.0.0:9000-9001-&gt;9000-9001/tcp, :::9000-9001-&gt;9000-9001/tcp                              milvus-rustfs
<button class="copy-code-btn"></button></code></pre>
<p>Con tutti e quattro i contenitori attivi, i servizi sono disponibili a:</p>
<ul>
<li><strong>Milvus:</strong> <ip>:19530</li>
<li><strong>RustFS:</strong> <ip>:9000</li>
<li><strong>Attu:</strong> <ip>:8000</li>
</ul>
<h2 id="Vectorizing-the-RustFS-Docs-and-Storing-Embeddings-in-Milvus" class="common-anchor-header">Vettorizzazione dei documenti di RustFS e memorizzazione degli embeddings in Milvus<button data-href="#Vectorizing-the-RustFS-Docs-and-Storing-Embeddings-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Con Milvus e RustFS in funzione, il passo successivo è costruire la base di conoscenza. Il materiale di partenza è la documentazione cinese di RustFS: 80 file Markdown che verranno suddivisi, incorporati e memorizzati in Milvus.</p>
<h3 id="Reading-and-Chunking-the-Docs" class="common-anchor-header">Leggere e suddividere i documenti</h3><p>Lo script legge ricorsivamente ogni file .md nella cartella docs, poi divide il contenuto di ogni file in pezzi per newline:</p>
<pre><code translate="no"><span class="hljs-comment"># 3. Read Markdown files</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_markdown_files</span>(<span class="hljs-params">folder</span>):
    files = glob.glob(os.path.join(folder, <span class="hljs-string">&quot;**&quot;</span>, <span class="hljs-string">&quot;*.md&quot;</span>), recursive=<span class="hljs-literal">True</span>)
    docs = []
    <span class="hljs-keyword">for</span> f <span class="hljs-keyword">in</span> files:
        <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(f, <span class="hljs-string">&quot;r&quot;</span>, encoding=<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">as</span> fp:
            docs.append(fp.read())
    <span class="hljs-keyword">return</span> docs

<span class="hljs-comment"># 4. Split documents (simple paragraph-based splitting)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">split_into_chunks</span>(<span class="hljs-params">text, max_len=<span class="hljs-number">500</span></span>):
    chunks, current = [], []
    <span class="hljs-keyword">for</span> line <span class="hljs-keyword">in</span> text.split(<span class="hljs-string">&quot;\n&quot;</span>):
        <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(<span class="hljs-string">&quot; &quot;</span>.join(current)) + <span class="hljs-built_in">len</span>(line) &lt; max_len:
            current.append(line)
        <span class="hljs-keyword">else</span>:
            chunks.append(<span class="hljs-string">&quot; &quot;</span>.join(current))
            current = [line]
    <span class="hljs-keyword">if</span> current:
        chunks.append(<span class="hljs-string">&quot; &quot;</span>.join(current))
    <span class="hljs-keyword">return</span> chunks
<button class="copy-code-btn"></button></code></pre>
<p>Questa strategia di suddivisione è volutamente semplice. Se si desidera un controllo più stretto - dividere in base alle intestazioni, preservare i blocchi di codice o sovrapporre i pezzi per un migliore recupero - questo è il luogo in cui iterare.</p>
<h3 id="Embedding-the-Chunks" class="common-anchor-header">Incorporare i pezzi</h3><p>Una volta pronti i pezzi, li si incorpora usando il modello text-embedding-3-large di OpenAI, che produce vettori di 3072 dimensioni:</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_texts</span>(<span class="hljs-params">texts</span>):
    response = client.embeddings.create(
        model=<span class="hljs-string">&quot;text-embedding-3-large&quot;</span>,
        <span class="hljs-built_in">input</span>=texts
    )
    <span class="hljs-keyword">return</span> [d.embedding <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> response.data]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Storing-Embeddings-in-Milvus" class="common-anchor-header">Memorizzazione delle incorporazioni in Milvus</h3><p>Milvus organizza i dati in raccolte, ciascuna definita da uno schema. Qui, ogni record memorizza il pezzo di testo grezzo insieme al suo vettore di incorporamento:</p>
<pre><code translate="no"><span class="hljs-comment"># Connect to Milvus</span>
connections.connect(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;ip&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)

<span class="hljs-comment"># Define the schema</span>
fields = [
    FieldSchema(name=<span class="hljs-string">&quot;id&quot;</span>, dtype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>),
    FieldSchema(name=<span class="hljs-string">&quot;content&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>),
    FieldSchema(name=<span class="hljs-string">&quot;embedding&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">3072</span>),
]
schema = CollectionSchema(fields, description=<span class="hljs-string">&quot;Markdown docs collection&quot;</span>)

<span class="hljs-comment"># Create the collection</span>
<span class="hljs-keyword">if</span> utility.has_collection(<span class="hljs-string">&quot;docs_collection&quot;</span>):
    utility.drop_collection(<span class="hljs-string">&quot;docs_collection&quot;</span>)

collection = Collection(name=<span class="hljs-string">&quot;docs_collection&quot;</span>, schema=schema)

<span class="hljs-comment"># Insert data</span>
collection.insert([all_chunks, embeddings])
collection.flush()
<button class="copy-code-btn"></button></code></pre>
<p>Una volta completato l'inserimento, è possibile verificare la raccolta in Attu all'indirizzo <ip>:8000 - si dovrebbe vedere docs_collection elencata sotto Collections.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Milvus_Rust_FS_Vibe_Coding_Chatbot_2_a787e96076.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Si può anche controllare RustFS all'indirizzo <ip>:9000 per confermare che i dati sottostanti sono atterrati nello storage a oggetti.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Milvus_Rust_FS_Vibe_Coding_Chatbot_6_0e6d8c9471.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Building-a-RAG-Pipeline-with-Milvus-and-OpenAI’s-GPT-5" class="common-anchor-header">Costruire una pipeline RAG con Milvus e OpenAI GPT-5<button data-href="#Building-a-RAG-Pipeline-with-Milvus-and-OpenAI’s-GPT-5" class="anchor-icon" translate="no">
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
    </button></h2><p>Con gli embeddings memorizzati in Milvus, si ha tutto ciò che serve per costruire la pipeline RAG. Il flusso è: incorporare la domanda dell'utente, recuperare i pezzi semanticamente più simili da Milvus, assemblare un prompt e chiamare il GPT-5. La costruzione qui utilizza il GPT-5 di OpenAI, ma qualsiasi modello in grado di chattare funziona qui: il livello di recupero è quello che conta e Milvus lo gestisce indipendentemente dal LLM che genera la risposta finale.</p>
<pre><code translate="no"><span class="hljs-comment"># 1. Embed the query</span>
query_embedding = embed_texts(query)

<span class="hljs-comment"># 2. Retrieve similar documents from Milvus</span>
    search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}}
    results = collection.search(
        data=[query_embedding],
        anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
        param=search_params,
        limit=<span class="hljs-number">3</span>,
        output_fields=[<span class="hljs-string">&quot;content&quot;</span>]
    )

docs = [hit.entity.get(<span class="hljs-string">&quot;text&quot;</span>) <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]

<span class="hljs-comment"># 3. Assemble the RAG prompt</span>
prompt = <span class="hljs-string">f&quot;You are a RustFS expert. Answer the question based on the following documents:\n\n<span class="hljs-subst">{docs}</span>\n\nUser question: <span class="hljs-subst">{query}</span>&quot;</span>

<span class="hljs-comment"># 4. Call the LLM</span>
    response = client.chat.completions.create(
        model=<span class="hljs-string">&quot;gpt-5&quot;</span>, <span class="hljs-comment"># swap to any OpenAI model, or replace this call with another LLM provider</span>
        messages=[{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: prompt}],
        <span class="hljs-comment"># max_tokens=16384,</span>
        <span class="hljs-comment"># temperature=1.0,</span>
        <span class="hljs-comment"># top_p=1.0,</span>
    )

    answer = response.choices[<span class="hljs-number">0</span>].message.content

    <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;answer&quot;</span>: answer, <span class="hljs-string">&quot;sources&quot;</span>: docs}
<button class="copy-code-btn"></button></code></pre>
<p>Per provarlo, eseguire una query:</p>
<pre><code translate="no"><span class="hljs-title class_">How</span> <span class="hljs-keyword">do</span> I install <span class="hljs-title class_">RustFS</span> <span class="hljs-keyword">in</span> <span class="hljs-title class_">Docker</span>?
<button class="copy-code-btn"></button></code></pre>
<p>Risultati della query:  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Milvus_Rust_FS_Vibe_Coding_Chatbot_5_2cd609c90c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Milvus_Rust_FS_Vibe_Coding_Chatbot_3_18f4476b7a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Avvolgere tutto in un chatbot FastAPI + Next.js</p>
<p>La pipeline RAG funziona, ma l'esecuzione di uno script Python ogni volta che si vuole porre una domanda vanifica lo scopo. Ho quindi chiesto all'intelligenza artificiale di suggerirmi uno stack. La risposta: <strong>FastAPI</strong> per il backend - il codice RAG è già Python, quindi è naturale avvolgerlo in un endpoint FastAPI - e <strong>Next.js</strong> per il frontend. FastAPI espone la logica RAG come endpoint HTTP; Next.js la chiama e visualizza la risposta in una finestra di chat.</p>
<h3 id="FastAPI-Backend" class="common-anchor-header">Backend FastAPI</h3><p>FastAPI racchiude la logica RAG in un singolo endpoint POST. Qualsiasi client può ora interrogare la base di conoscenza con una richiesta JSON:</p>
<pre><code translate="no">app = FastAPI()

<span class="hljs-meta">@app.post(<span class="hljs-params"><span class="hljs-string">&quot;/chat&quot;</span></span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">chat</span>(<span class="hljs-params">req: ChatRequest</span>):
    query = req.query

......
<button class="copy-code-btn"></button></code></pre>
<p>Avviare il server con:</p>
<pre><code translate="no">uvicorn main:app --reload --host <span class="hljs-number">0.0</span><span class="hljs-number">.0</span><span class="hljs-number">.0</span> --port <span class="hljs-number">9999</span>
INFO:     Will watch <span class="hljs-keyword">for</span> changes <span class="hljs-keyword">in</span> these directories: [<span class="hljs-string">&#x27;/home/xiaomage/milvus/chatbot/.venv&#x27;</span>]
INFO:     Uvicorn running <span class="hljs-keyword">on</span> http:<span class="hljs-comment">//0.0.0.0:9999 (Press CTRL+C to quit)</span>
INFO:     Started reloader process [<span class="hljs-number">2071374</span>] <span class="hljs-keyword">using</span> WatchFiles
INFO:     Started server process [<span class="hljs-number">2071376</span>]
INFO:     Waiting <span class="hljs-keyword">for</span> application startup.
INFO:     Application startup complete.
<button class="copy-code-btn"></button></code></pre>
<h3 id="Nextjs-Frontend" class="common-anchor-header">Frontend Next.js</h3><p>Il frontend invia la richiesta dell'utente all'endpoint FastAPI e visualizza la risposta. La logica di base del fetch:</p>
<p>javascript</p>
<pre><code translate="no">   <span class="hljs-keyword">try</span> {
      <span class="hljs-keyword">const</span> res = <span class="hljs-keyword">await</span> <span class="hljs-title function_">fetch</span>(<span class="hljs-string">&#x27;http://localhost:9999/chat&#x27;</span>, {
        <span class="hljs-attr">method</span>: <span class="hljs-string">&#x27;POST&#x27;</span>,
        <span class="hljs-attr">headers</span>: { <span class="hljs-string">&#x27;Content-Type&#x27;</span>: <span class="hljs-string">&#x27;application/json&#x27;</span> },
        <span class="hljs-attr">body</span>: <span class="hljs-title class_">JSON</span>.<span class="hljs-title function_">stringify</span>({ <span class="hljs-attr">query</span>: input }),
      });

      <span class="hljs-keyword">const</span> data = <span class="hljs-keyword">await</span> res.<span class="hljs-title function_">json</span>();
      <span class="hljs-keyword">const</span> <span class="hljs-attr">botMessage</span>: <span class="hljs-title class_">Message</span> = { <span class="hljs-attr">role</span>: <span class="hljs-string">&#x27;bot&#x27;</span>, <span class="hljs-attr">content</span>: data.<span class="hljs-property">answer</span> || <span class="hljs-string">&#x27;No response&#x27;</span> };
      <span class="hljs-title function_">setMessages</span>(<span class="hljs-function"><span class="hljs-params">prev</span> =&gt;</span> [...prev, userMessage, botMessage]);
    } <span class="hljs-keyword">catch</span> (error) {
      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">error</span>(error);
      <span class="hljs-keyword">const</span> <span class="hljs-attr">botMessage</span>: <span class="hljs-title class_">Message</span> = { <span class="hljs-attr">role</span>: <span class="hljs-string">&#x27;bot&#x27;</span>, <span class="hljs-attr">content</span>: <span class="hljs-string">&#x27;Error connecting to server.&#x27;</span> };
      <span class="hljs-title function_">setMessages</span>(<span class="hljs-function"><span class="hljs-params">prev</span> =&gt;</span> [...prev, botMessage]);
    } <span class="hljs-keyword">finally</span> {
      <span class="hljs-title function_">setLoading</span>(<span class="hljs-literal">false</span>);
    }
<button class="copy-code-btn"></button></code></pre>
<p>Avviare il frontend con:</p>
<pre><code translate="no">pnpm run dev -H <span class="hljs-number">0.0</span><span class="hljs-number">.0</span><span class="hljs-number">.0</span> -p <span class="hljs-number">3000</span>

&gt; rag-chatbot@<span class="hljs-number">0.1</span><span class="hljs-number">.0</span> dev /home/xiaomage/milvus/chatbot-web/rag-chatbot
&gt; next dev --turbopack -H <span class="hljs-number">0.0</span><span class="hljs-number">.0</span><span class="hljs-number">.0</span> -p <span class="hljs-number">3000</span>

   ▲ <span class="hljs-title class_">Next</span>.<span class="hljs-property">js</span> <span class="hljs-number">15.5</span><span class="hljs-number">.3</span> (<span class="hljs-title class_">Turbopack</span>)
   - <span class="hljs-title class_">Local</span>:        <span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:3000</span>
   - <span class="hljs-title class_">Network</span>:      <span class="hljs-attr">http</span>:<span class="hljs-comment">//0.0.0.0:3000</span>

 ✓ <span class="hljs-title class_">Starting</span>...
 ✓ <span class="hljs-title class_">Ready</span> <span class="hljs-keyword">in</span> 1288ms
<button class="copy-code-btn"></button></code></pre>
<p>Aprire <code translate="no">http://&lt;ip&gt;:3000/chat</code> nel browser.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Milvus_Rust_FS_Vibe_Coding_Chatbot_1_0832811fc8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
Digitare una domanda:</p>
<pre><code translate="no"><span class="hljs-title class_">How</span> <span class="hljs-keyword">do</span> I install <span class="hljs-title class_">RustFS</span> <span class="hljs-keyword">in</span> <span class="hljs-title class_">Docker</span>?
<button class="copy-code-btn"></button></code></pre>
<p>Risposta dell'interfaccia di chat::</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Milvus_Rust_FS_Vibe_Coding_Chatbot_4_91d679ae50.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>E il chatbot è pronto.</p>
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
    </button></h2><p>Quello che era iniziato come una curiosità sul backend di Milvus per lo storage si è trasformato in un chatbot RAG completamente funzionante, e il percorso da uno all'altro è stato più breve del previsto. Ecco cosa comprende la build, da un capo all'altro:</p>
<ul>
<li><strong><a href="http://milvus.io">Milvus</a></strong> <strong>+</strong> <strong><a href="https://rustfs.com/">RustFS</a></strong> <strong>con Docker Compose.</strong> Milvus viene eseguito in modalità standalone con RustFS come backend per l'archiviazione degli oggetti, in sostituzione del MinIO predefinito. Quattro servizi in totale: etcd, Milvus, RustFS e Attu.</li>
<li><strong>Vettorializzazione della base di conoscenza.</strong> La documentazione di RustFS - 80 file Markdown - viene smistata, incorporata con text-embedding-3-large e archiviata in Milvus come 466 vettori.</li>
<li><strong>La pipeline RAG.</strong> Al momento dell'interrogazione, la domanda dell'utente viene incorporata nello stesso modo, Milvus recupera i tre chunk semanticamente più simili e GPT-5 genera una risposta basata su quei documenti.</li>
<li><strong>L'interfaccia utente del chatbot.</strong> FastAPI racchiude la pipeline in un singolo endpoint POST; Next.js mette una finestra di chat davanti a tutto ciò. Non è più necessario entrare in un terminale per fare una domanda.</li>
</ul>
<p>Alcuni degli elementi che ho tratto dal processo:</p>
<ul>
<li><strong><a href="https://milvus.io/docs">La documentazione di Milvus</a></strong> <strong>è ottima.</strong> Soprattutto le sezioni sull'implementazione - chiare, complete, facili da seguire.</li>
<li><strong><a href="https://rustfs.com/">RustFS</a></strong> <strong>è un piacere lavorare con un backend per lo storage di oggetti.</strong> L'inserimento di MinIO ha richiesto meno sforzi del previsto.</li>
<li><strong>La codifica di Vibe è veloce, fino a quando l'ambito non prende il sopravvento.</strong> Una cosa tira l'altra: da Milvus a RAG, a chatbot, a "forse dovrei dockerizzare il tutto". I requisiti non convergono da soli.</li>
<li><strong>Il debug insegna più della lettura.</strong> Ogni fallimento in questa build ha fatto scattare la sezione successiva più velocemente di quanto avrebbe fatto qualsiasi documentazione.</li>
</ul>
<p>Tutto il codice di questa build si trova su <a href="https://github.com/majinghe/chatbot"></a> github<a href="https://github.com/majinghe/chatbot">.com/majinghe/chatbot</a>. Se volete provare <a href="http://milvus.io">Milvus</a> da soli, il <a href="https://milvus.io/docs/quickstart.md">quickstart</a> è un buon punto di partenza. Se volete parlare di ciò che state costruendo o se vi imbattete in qualche imprevisto, venite a trovarci su <a href="https://milvus.io/slack">Milvus Slack</a>. Se preferite avere una conversazione dedicata, potete anche <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?uuid=4cb203e5-482a-47e0-90a6-7acc511d61f4">prenotare un incontro in orario d'ufficio</a>.</p>
