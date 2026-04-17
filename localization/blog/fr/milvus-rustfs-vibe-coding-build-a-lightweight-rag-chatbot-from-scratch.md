---
id: milvus-rustfs-vibe-coding-build-a-lightweight-rag-chatbot-from-scratch.md
title: >-
  Milvus + RustFS+ Vibe Coding : Construire un chatbot RAG léger à partir de
  zéro
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
  Construire un chatbot RAG léger avec Milvus, RustFS, FastAPI, et Next.js en
  utilisant les docs RustFS comme base de connaissance.
origin: >-
  https://milvus.io/blog/milvus-rustfs-vibe-coding-build-a-lightweight-rag-chatbot-from-scratch.md
---
<p><em>Ce blog a été rédigé par Jinghe Ma, un contributeur de la communauté Milvus</em><em>,</em> <em>et est publié ici avec son autorisation.</em></p>
<p>Je voulais un chatbot qui puisse répondre aux questions de ma propre documentation, et je voulais avoir un contrôle total sur la pile derrière lui - du stockage d'objets à l'interface de chat. Cela m'a conduit à construire un chatbot RAG léger avec <a href="https://milvus.io/">Milvus</a> et <a href="https://rustfs.com/">RustFS</a> au cœur.</p>
<p><a href="https://milvus.io/">Milvus</a> est la base de données vectorielle open-source la plus largement adoptée pour la construction d'applications RAG. Elle sépare le calcul du stockage, conservant les données chaudes en mémoire ou sur SSD pour une recherche rapide, tout en s'appuyant sur le stockage objet en dessous pour une gestion des données évolutive et rentable. Parce qu'il fonctionne avec un stockage compatible S3, c'était un choix naturel pour ce projet.</p>
<p>Pour la couche de stockage, j'ai choisi <a href="https://rustfs.com/">RustFS</a>, un système de stockage objet compatible S3 open-source écrit en Rust. Il peut être déployé via binaire, Docker, ou Helm chart. Bien qu'il soit encore en alpha et qu'il ne soit pas recommandé pour les charges de travail de production, il était suffisamment stable pour cette construction.</p>
<p>Une fois l'infrastructure en place, j'avais besoin d'une base de connaissances à interroger. La documentation de RustFS - environ 80 fichiers Markdown - était un point de départ pratique. J'ai découpé la documentation en morceaux, généré des embeddings, les ai stockés dans Milvus, et j'ai codé le reste à l'aide de vibrateurs : <a href="https://fastapi.tiangolo.com/">FastAPI</a> pour le backend et <a href="https://nextjs.org/">Next.js</a> pour l'interface de chat.</p>
<p>Dans ce billet, je couvrirai l'ensemble du système de bout en bout. Le code est disponible à l'adresse https://github.com/majinghe/chatbot. Il s'agit d'un prototype fonctionnel plutôt que d'un système prêt pour la production, mais l'objectif est de fournir une construction claire et extensible que vous pouvez adapter à votre propre usage. Chaque section ci-dessous passe en revue une couche, de l'infrastructure à l'interface utilisateur.</p>
<h2 id="Installing-Milvus-and-RustFS-with-Docker-Compose" class="common-anchor-header">Installation de Milvus et RustFS avec Docker Compose<button data-href="#Installing-Milvus-and-RustFS-with-Docker-Compose" class="anchor-icon" translate="no">
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
    </button></h2><p>Commençons par installer <a href="https://milvus.io/">Milvus</a> et <a href="https://rustfs.com/">RustFS</a>.</p>
<p>Milvus peut fonctionner avec n'importe quel stockage d'objets compatible S3, bien que MinIO soit le backend par défaut dans la configuration standard. Comme MinIO n'accepte plus les contributions de la communauté, nous le remplacerons par RustFS dans cet exemple.</p>
<p>Pour effectuer ce changement, mettez à jour la configuration du stockage d'objets dans configs/milvus.yaml à l'intérieur du dépôt Milvus. La section concernée ressemble à ceci :</p>
<pre><code translate="no"><span class="hljs-attr">minio</span>:
  <span class="hljs-attr">address</span>: <span class="hljs-attr">localhost</span>:<span class="hljs-number">9000</span>
  <span class="hljs-attr">port</span>: <span class="hljs-number">9000</span>
  <span class="hljs-attr">accessKeyID</span>: rustfsadmin
  <span class="hljs-attr">secretAccessKey</span>: rustfsadmin
  <span class="hljs-attr">useSSL</span>: <span class="hljs-literal">false</span>
  <span class="hljs-attr">bucketName</span>: <span class="hljs-string">&quot;rustfs-bucket&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Il y a deux façons d'appliquer ce changement :</p>
<ul>
<li><strong>Monter un fichier de configuration local.</strong> Copier configs/milvus.yaml localement, mettre à jour les champs MinIO pour pointer vers RustFS, puis le monter dans le conteneur via un volume Docker.</li>
<li><strong>Apporter un correctif au démarrage avec</strong> <strong>yq****.</strong> Modifier la commande du conteneur pour exécuter yq contre /milvus/configs/milvus.yaml avant que le processus Milvus ne démarre.</li>
</ul>
<p>Cette version utilise la première approche. Le service Milvus dans docker-compose.yml reçoit une entrée de volume supplémentaire :</p>
<pre><code translate="no">- <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/milvus/milvus.yaml:/milvus/configs/milvus.yaml:ro
<button class="copy-code-btn"></button></code></pre>
<h3 id="The-Docker-Compose-Setup" class="common-anchor-header">The Docker Compose Setup</h3><p>Le fichier docker-compose.yml complet exécute quatre services.</p>
<p><strong>etcd</strong> - Milvus dépend d'etcd pour le stockage des métadonnées :</p>
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
<p><strong>Attu</strong> - une interface visuelle pour Milvus, développée et mise à disposition par Zilliz (note : les versions après 2.6 sont fermées) :</p>
<pre><code translate="no">  attu:
    container_name: milvus-attu
    image: zilliz/attu:v2.6
    environment:
      - MILVUS_URL=milvus-standalone:19530
    ports:
      - <span class="hljs-string">&quot;8000:3000&quot;</span>
    restart: unless-stopped
<button class="copy-code-btn"></button></code></pre>
<p><strong>RustFS</strong> - le backend de stockage d'objets :</p>
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
<p><strong>Milvus</strong> - fonctionnant en mode autonome :</p>
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
<h3 id="Starting-Everything" class="common-anchor-header">Tout démarrer</h3><p>Une fois la configuration en place, démarrez les quatre services :</p>
<pre><code translate="no">docker compose -f docker-compose.yml up -d
<button class="copy-code-btn"></button></code></pre>
<p>Vous pouvez vérifier que tout fonctionne avec :</p>
<pre><code translate="no">docker ps
CONTAINER ID   IMAGE                                             COMMAND                  CREATED          STATUS                      PORTS                                                                                      NAMES
4404b5cc6f7e   milvusdb/milvus:v2.6.0                            <span class="hljs-string">&quot;/tini -- milvus run…&quot;</span>   53 minutes ago   Up 53 minutes (healthy)     0.0.0.0:9091-&gt;9091/tcp, :::9091-&gt;9091/tcp, 0.0.0.0:19530-&gt;19530/tcp, :::19530-&gt;19530/tcp   milvus-standalone
40ddc8ed08bb   zilliz/attu:v2.6                                  <span class="hljs-string">&quot;docker-entrypoint.s…&quot;</span>   53 minutes ago   Up 53 minutes               0.0.0.0:8000-&gt;3000/tcp, :::8000-&gt;3000/tcp                                                  milvus-attu
3d2c8d80a8ce   quay.io/coreos/etcd:v3.5.18                       <span class="hljs-string">&quot;etcd -advertise-cli…&quot;</span>   53 minutes ago   Up 53 minutes (healthy)     2379-2380/tcp                                                                              milvus-etcd
d760f6690ea7   rustfs/rustfs:1.0.0-alpha.58                      <span class="hljs-string">&quot;/entrypoint.sh rust…&quot;</span>   53 minutes ago   Up 53 minutes (unhealthy)   0.0.0.0:9000-9001-&gt;9000-9001/tcp, :::9000-9001-&gt;9000-9001/tcp                              milvus-rustfs
<button class="copy-code-btn"></button></code></pre>
<p>Une fois les quatre conteneurs démarrés, vos services sont disponibles à l'adresse suivante :</p>
<ul>
<li><strong>Milvus :</strong> <ip>:19530</li>
<li><strong>RustFS :</strong> <ip>:9000</li>
<li><strong>Attu :</strong> <ip>:8000</li>
</ul>
<h2 id="Vectorizing-the-RustFS-Docs-and-Storing-Embeddings-in-Milvus" class="common-anchor-header">Vectorisation des documents RustFS et stockage des Embeddings dans Milvus<button data-href="#Vectorizing-the-RustFS-Docs-and-Storing-Embeddings-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Une fois Milvus et RustFS en marche, l'étape suivante consiste à construire la base de connaissances. Le matériel source est la documentation chinoise de RustFS : 80 fichiers Markdown que vous découperez, intégrerez et stockerez dans Milvus.</p>
<h3 id="Reading-and-Chunking-the-Docs" class="common-anchor-header">Lecture et découpage de la documentation</h3><p>Le script lit récursivement chaque fichier .md dans le dossier docs, puis divise le contenu de chaque fichier en morceaux par nouvelle ligne :</p>
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
<p>Cette stratégie de découpage est volontairement simple. Si vous souhaitez un contrôle plus serré - séparation sur les en-têtes, préservation des blocs de code, ou chevauchement des morceaux pour une meilleure récupération - c'est ici qu'il faut itérer.</p>
<h3 id="Embedding-the-Chunks" class="common-anchor-header">Intégrer les morceaux</h3><p>Une fois les morceaux prêts, vous les incorporez en utilisant le modèle text-embedding-3-large d'OpenAI, qui produit des vecteurs à 3072 dimensions :</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_texts</span>(<span class="hljs-params">texts</span>):
    response = client.embeddings.create(
        model=<span class="hljs-string">&quot;text-embedding-3-large&quot;</span>,
        <span class="hljs-built_in">input</span>=texts
    )
    <span class="hljs-keyword">return</span> [d.embedding <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> response.data]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Storing-Embeddings-in-Milvus" class="common-anchor-header">Stockage des embeddings dans Milvus</h3><p>Milvus organise les données en collections, chacune définie par un schéma. Ici, chaque enregistrement stocke le morceau de texte brut avec son vecteur d'intégration :</p>
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
<p>Une fois l'insertion terminée, vous pouvez vérifier la collection dans Attu à l'adresse <ip>:8000 - vous devriez voir docs_collection répertorié sous Collections.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Milvus_Rust_FS_Vibe_Coding_Chatbot_2_a787e96076.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Vous pouvez également vérifier RustFS à l'adresse <ip>:9000 pour confirmer que les données sous-jacentes ont atterri dans le stockage objet.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Milvus_Rust_FS_Vibe_Coding_Chatbot_6_0e6d8c9471.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Building-a-RAG-Pipeline-with-Milvus-and-OpenAI’s-GPT-5" class="common-anchor-header">Construction d'un pipeline RAG avec Milvus et OpenAI's GPT-5<button data-href="#Building-a-RAG-Pipeline-with-Milvus-and-OpenAI’s-GPT-5" class="anchor-icon" translate="no">
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
    </button></h2><p>Avec les embeddings stockés dans Milvus, vous avez tout ce qu'il faut pour construire le pipeline RAG. Le flux est le suivant : intégrer la requête de l'utilisateur, récupérer les morceaux les plus sémantiquement similaires dans Milvus, assembler une invite et appeler le GPT-5. La construction ici utilise le GPT-5 d'OpenAI, mais n'importe quel modèle capable de dialoguer fonctionne ici - la couche de récupération est ce qui importe, et Milvus la gère indépendamment du LLM qui génère la réponse finale.</p>
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
<p>Pour le tester, lancez une requête :</p>
<pre><code translate="no"><span class="hljs-title class_">How</span> <span class="hljs-keyword">do</span> I install <span class="hljs-title class_">RustFS</span> <span class="hljs-keyword">in</span> <span class="hljs-title class_">Docker</span>?
<button class="copy-code-btn"></button></code></pre>
<p>Résultats de la requête : <span class="img-wrapper">
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
<p>Envelopper le tout dans un chatbot FastAPI + Next.js</p>
<p>Le pipeline RAG fonctionne, mais exécuter un script Python à chaque fois que vous voulez poser une question va à l'encontre du but recherché. J'ai donc demandé à l'IA de me suggérer une pile. La réponse : <strong>FastAPI</strong> pour le backend - le code RAG est déjà en Python, donc l'envelopper dans un endpoint FastAPI est naturel - et <strong>Next.js</strong> pour le frontend. FastAPI expose la logique RAG en tant que point de terminaison HTTP ; Next.js l'appelle et rend la réponse dans une fenêtre de chat.</p>
<h3 id="FastAPI-Backend" class="common-anchor-header">Le backend FastAPI</h3><p>FastAPI enveloppe la logique RAG dans un seul point d'extrémité POST. N'importe quel client peut maintenant interroger votre base de connaissances avec une requête JSON :</p>
<pre><code translate="no">app = FastAPI()

<span class="hljs-meta">@app.post(<span class="hljs-params"><span class="hljs-string">&quot;/chat&quot;</span></span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">chat</span>(<span class="hljs-params">req: ChatRequest</span>):
    query = req.query

......
<button class="copy-code-btn"></button></code></pre>
<p>Démarrez le serveur avec :</p>
<pre><code translate="no">uvicorn main:app --reload --host <span class="hljs-number">0.0</span><span class="hljs-number">.0</span><span class="hljs-number">.0</span> --port <span class="hljs-number">9999</span>
INFO:     Will watch <span class="hljs-keyword">for</span> changes <span class="hljs-keyword">in</span> these directories: [<span class="hljs-string">&#x27;/home/xiaomage/milvus/chatbot/.venv&#x27;</span>]
INFO:     Uvicorn running <span class="hljs-keyword">on</span> http:<span class="hljs-comment">//0.0.0.0:9999 (Press CTRL+C to quit)</span>
INFO:     Started reloader process [<span class="hljs-number">2071374</span>] <span class="hljs-keyword">using</span> WatchFiles
INFO:     Started server process [<span class="hljs-number">2071376</span>]
INFO:     Waiting <span class="hljs-keyword">for</span> application startup.
INFO:     Application startup complete.
<button class="copy-code-btn"></button></code></pre>
<h3 id="Nextjs-Frontend" class="common-anchor-header">Next.js Frontend</h3><p>Le frontend envoie la requête de l'utilisateur au point de terminaison FastAPI et rend la réponse. La logique de base de la recherche :</p>
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
<p>Démarrez le frontend avec :</p>
<pre><code translate="no">pnpm run dev -H <span class="hljs-number">0.0</span><span class="hljs-number">.0</span><span class="hljs-number">.0</span> -p <span class="hljs-number">3000</span>

&gt; rag-chatbot@<span class="hljs-number">0.1</span><span class="hljs-number">.0</span> dev /home/xiaomage/milvus/chatbot-web/rag-chatbot
&gt; next dev --turbopack -H <span class="hljs-number">0.0</span><span class="hljs-number">.0</span><span class="hljs-number">.0</span> -p <span class="hljs-number">3000</span>

   ▲ <span class="hljs-title class_">Next</span>.<span class="hljs-property">js</span> <span class="hljs-number">15.5</span><span class="hljs-number">.3</span> (<span class="hljs-title class_">Turbopack</span>)
   - <span class="hljs-title class_">Local</span>:        <span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:3000</span>
   - <span class="hljs-title class_">Network</span>:      <span class="hljs-attr">http</span>:<span class="hljs-comment">//0.0.0.0:3000</span>

 ✓ <span class="hljs-title class_">Starting</span>...
 ✓ <span class="hljs-title class_">Ready</span> <span class="hljs-keyword">in</span> 1288ms
<button class="copy-code-btn"></button></code></pre>
<p>Ouvrez <code translate="no">http://&lt;ip&gt;:3000/chat</code> dans votre navigateur.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Milvus_Rust_FS_Vibe_Coding_Chatbot_1_0832811fc8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
Tapez une question :</p>
<pre><code translate="no"><span class="hljs-title class_">How</span> <span class="hljs-keyword">do</span> I install <span class="hljs-title class_">RustFS</span> <span class="hljs-keyword">in</span> <span class="hljs-title class_">Docker</span>?
<button class="copy-code-btn"></button></code></pre>
<p>Réponse de l'interface de chat: :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Milvus_Rust_FS_Vibe_Coding_Chatbot_4_91d679ae50.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Et voilà le chatbot terminé.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusion<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Ce qui a commencé comme une curiosité à propos du backend de stockage de Milvus s'est transformé en un chatbot RAG fonctionnel - et le chemin de l'un à l'autre a été plus court que prévu. Voici ce que couvre la construction, de bout en bout :</p>
<ul>
<li><strong><a href="http://milvus.io">Milvus</a></strong> <strong>+</strong> <strong><a href="https://rustfs.com/">RustFS</a></strong> <strong>avec Docker Compose.</strong> Milvus fonctionne en mode autonome avec RustFS comme backend de stockage d'objets, remplaçant le MinIO par défaut. Quatre services au total : etcd, Milvus, RustFS et Attu.</li>
<li><strong>Vectorisation de la base de connaissances.</strong> La documentation de RustFS - 80 fichiers Markdown - est découpée en morceaux, incorporée avec text-embedding-3-large, et stockée dans Milvus sous la forme de 466 vecteurs.</li>
<li><strong>Le pipeline RAG.</strong> Au moment de la requête, la question de l'utilisateur est incorporée de la même manière, Milvus récupère les trois morceaux les plus sémantiquement similaires, et GPT-5 génère une réponse basée sur ces documents.</li>
<li><strong>L'interface utilisateur du chatbot.</strong> FastAPI enveloppe le pipeline dans un seul point d'arrivée POST ; Next.js place une fenêtre de chat devant. Plus besoin d'aller dans un terminal pour poser une question.</li>
</ul>
<p>Quelques-unes de mes impressions sur le processus :</p>
<ul>
<li><strong><a href="https://milvus.io/docs">La documentation de Milvus</a></strong> <strong>est excellente.</strong> En particulier les sections sur le déploiement - claires, complètes, faciles à suivre.</li>
<li><strong><a href="https://rustfs.com/">RustFS</a></strong> <strong>est un plaisir de travailler avec un backend de stockage d'objets.</strong> L'intégrer à MinIO a demandé moins d'efforts que prévu.</li>
<li><strong>Le codage Vibe est rapide, jusqu'à ce que la portée prenne le dessus.</strong> Une chose en entraîne une autre - Milvus à RAG à chatbot à "peut-être que je devrais Dockeriser le tout". Les exigences ne convergent pas d'elles-mêmes.</li>
<li><strong>Le débogage enseigne plus que la lecture.</strong> Chaque échec dans cette construction a fait cliquer la section suivante plus rapidement que n'importe quelle documentation ne l'aurait fait.</li>
</ul>
<p>Tout le code de cette version est disponible sur <a href="https://github.com/majinghe/chatbot"></a> github<a href="https://github.com/majinghe/chatbot">.com/majinghe/chatbot</a>. Si vous voulez essayer <a href="http://milvus.io">Milvus</a> vous-même, le <a href="https://milvus.io/docs/quickstart.md">quickstart</a> est un bon point de départ. Si vous voulez discuter de ce que vous construisez ou rencontrer quelque chose d'inattendu, venez nous trouver sur le <a href="https://milvus.io/slack">Slack Milvus</a>. Si vous préférez avoir une conversation dédiée, vous pouvez également <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?uuid=4cb203e5-482a-47e0-90a6-7acc511d61f4">réserver un créneau pendant les heures de bureau</a>.</p>
