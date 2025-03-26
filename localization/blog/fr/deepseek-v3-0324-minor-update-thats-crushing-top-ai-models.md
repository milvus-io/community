---
id: deepseek-v3-0324-minor-update-thats-crushing-top-ai-models.md
title: >-
  DeepSeek V3-0324 : La "mise à jour mineure" qui écrase les meilleurs modèles
  d'IA
author: Lumina Wang
date: 2025-03-25T00:00:00.000Z
desc: >-
  DeepSeek v3-0324 est entraîné avec des paramètres plus importants, dispose
  d'une fenêtre contextuelle plus longue et de capacités de raisonnement, de
  codage et de mathématiques améliorées.
cover: assets.zilliz.com/Deep_Seek_V3_0324_033f6ff001.png
tag: Engineering
tags: 'DeepSeek V3-0324, DeepSeek V3, Milvus, RAG'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/deepseek-v3-0324-minor-update-thats-crushing-top-ai-models.md
---
<p>DeepSeek a discrètement lâché une bombe la nuit dernière. Leur dernière version,<a href="https://huggingface.co/deepseek-ai/DeepSeek-V3-0324"> DeepSeek v3-0324</a>, a été minimisée dans l'annonce officielle comme une simple <strong>"mise à jour mineure"</strong> sans changement d'API. Mais nos tests approfondis chez <a href="https://zilliz.com/">Zilliz</a> ont révélé quelque chose de plus significatif : cette mise à jour représente un saut quantique en termes de performances, en particulier pour le raisonnement logique, la programmation et la résolution de problèmes mathématiques.</p>
<p>Il ne s'agit pas d'une simple amélioration progressive, mais d'un changement fondamental qui place DeepSeek v3-0324 parmi l'élite des modèles de langage. Et il s'agit d'un logiciel libre.</p>
<p><strong>Cette version mérite votre attention immédiate pour les développeurs et les entreprises qui créent des applications basées sur l'IA.</strong></p>
<h2 id="Whats-New-in-DeepSeek-v3-0324-and-How-Good-Is-It-Really" class="common-anchor-header">Quelles sont les nouveautés de DeepSeek v3-0324 et quelle est sa qualité réelle ?<button data-href="#Whats-New-in-DeepSeek-v3-0324-and-How-Good-Is-It-Really" class="anchor-icon" translate="no">
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
    </button></h2><p>DeepSeek v3-0324 présente trois améliorations majeures par rapport à son prédécesseur, <a href="https://zilliz.com/blog/why-deepseek-v3-is-taking-the-ai-world-by-storm">DeepSeek v3</a>:</p>
<ul>
<li><p><strong>Un modèle plus grand, plus puissant :</strong> le nombre de paramètres est passé de 671 milliards à 685 milliards, ce qui permet au modèle de gérer des raisonnements plus complexes et de générer des réponses plus nuancées.</p></li>
<li><p><strong>Une fenêtre de contexte massive :</strong> Avec une longueur de contexte de 128 000 jetons, DeepSeek v3-0324 peut retenir et traiter beaucoup plus d'informations en une seule requête, ce qui le rend idéal pour les conversations longues, l'analyse de documents et les applications d'IA basées sur la recherche.</p></li>
<li><p><strong>Raisonnement, codage et mathématiques améliorés :</strong> Cette mise à jour améliore sensiblement les capacités de logique, de programmation et de mathématiques, ce qui en fait un concurrent de taille pour le codage assisté par l'IA, la recherche scientifique et la résolution de problèmes au niveau de l'entreprise.</p></li>
</ul>
<p>Mais les chiffres bruts ne disent pas tout. Ce qui est vraiment impressionnant, c'est la façon dont DeepSeek a réussi à améliorer simultanément la capacité de raisonnement et l'efficacité de la génération, ce qui implique généralement des compromis en matière d'ingénierie.</p>
<h3 id="The-Secret-Sauce-Architectural-Innovation" class="common-anchor-header">La sauce secrète : Innovation architecturale</h3><p>Sous le capot, DeepSeek v3-0324 conserve son architecture <a href="https://arxiv.org/abs/2502.07864">Multi-head Latent Attention (MLA </a>), un mécanisme efficace qui compresse les caches Key-Value (KV) en utilisant des vecteurs latents pour réduire l'utilisation de la mémoire et la charge de calcul pendant l'inférence. En outre, elle remplace les <a href="https://zilliz.com/glossary/feedforward-neural-networks-(fnn)">réseaux Feed-Forward (FFN)</a> traditionnels par des couches de mélange d'experts<a href="https://zilliz.com/learn/what-is-mixture-of-experts">(MoE)</a>, ce qui optimise l'efficacité du calcul en activant dynamiquement les experts les plus performants pour chaque jeton.</p>
<p>Cependant, l'amélioration la plus intéressante est la <strong>prédiction multi-token (MTP</strong> ), qui permet à chaque token de prédire simultanément plusieurs tokens futurs. Cela permet de surmonter un goulot d'étranglement important dans les modèles autorégressifs traditionnels, en améliorant à la fois la précision et la vitesse d'inférence.</p>
<p>Ensemble, ces innovations créent un modèle qui ne se contente pas de s'adapter - il s'adapte intelligemment, mettant les capacités d'IA de niveau professionnel à la portée d'un plus grand nombre d'équipes de développement.</p>
<h2 id="Build-a-RAG-System-with-Milvus-and-DeepSeek-v3-0324-in-5-Minutes" class="common-anchor-header">Construire un système RAG avec Milvus et DeepSeek v3-0324 en 5 minutes<button data-href="#Build-a-RAG-System-with-Milvus-and-DeepSeek-v3-0324-in-5-Minutes" class="anchor-icon" translate="no">
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
    </button></h2><p>Les puissantes capacités de raisonnement de DeepSeek v3-0324 en font un candidat idéal pour les systèmes RAG (Retrieval-Augmented Generation). Dans ce tutoriel, nous allons vous montrer comment construire un pipeline RAG complet en utilisant DeepSeek v3-0324 et la base de données vectorielle <a href="https://zilliz.com/what-is-milvus">Milvus</a> en seulement cinq minutes. Vous apprendrez comment récupérer et synthétiser des connaissances de manière efficace avec une configuration minimale.</p>
<h3 id="Setting-Up-Your-Environment" class="common-anchor-header">Configuration de l'environnement</h3><p>Tout d'abord, installons les dépendances nécessaires :</p>
<pre><code translate="no">! pip install --upgrade pymilvus[model] openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p><strong>Note :</strong> Si vous utilisez Google Colab, vous devrez redémarrer le runtime après avoir installé ces paquets. Cliquez sur le menu "Runtime" en haut de l'écran et sélectionnez "Restart session" dans le menu déroulant.</p>
<p>Comme DeepSeek fournit une API compatible avec OpenAI, vous aurez besoin d'une clé API. Vous pouvez en obtenir une en vous inscrivant sur la<a href="https://platform.deepseek.com/api_keys"> plateforme DeepSeek</a>:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os

os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>] = <span class="hljs-string">&quot;***********&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-Your-Data" class="common-anchor-header">Préparation des données</h3><p>Pour ce tutoriel, nous utiliserons les pages FAQ de la <a href="https://github.com/milvus-io/milvus-docs/releases/download/v2.4.6-preview/milvus_docs_2.4.x_en.zip">documentation Milvus 2.4.x</a> comme source de connaissances :</p>
<pre><code translate="no">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>Chargeons et préparons le contenu de la FAQ à partir des fichiers markdown :</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

<span class="hljs-comment"># Load all markdown files from the FAQ directory</span>
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
        <span class="hljs-comment"># Split on headings to separate content sections</span>
        text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Setting-Up-the-Language-and-Embedding-Models" class="common-anchor-header">Configuration du langage et intégration des modèles</h3><p>Nous utiliserons <a href="https://openrouter.ai/">OpenRouter</a> pour accéder à DeepSeek v3-0324. OpenRouter fournit une API unifiée pour plusieurs modèles d'IA, tels que DeepSeek et Claude. En créant une clé API gratuite pour DeepSeek V3 sur OpenRouter, vous pouvez facilement essayer DeepSeek V3 0324.</p>
<p>https://assets.zilliz.com/Setting_Up_the_Language_and_Embedding_Models_8b00595a6b.png</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>

deepseek_client = <span class="hljs-title class_">OpenAI</span>(
   api_key=<span class="hljs-string">&quot;&lt;OPENROUTER_API_KEY&gt;&quot;</span>,
   base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Pour les incorporations de texte, nous utiliserons le <a href="https://milvus.io/docs/embeddings.md">modèle d'incorporation intégré de</a> Milvus, qui est léger et efficace :</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model

<span class="hljs-comment"># Initialize the embedding model</span>
embedding_model = milvus_model.DefaultEmbeddingFunction()

<span class="hljs-comment"># Test the embedding model</span>
test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Embedding dimension: <span class="hljs-subst">{embedding_dim}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;First 10 values: <span class="hljs-subst">{test_embedding[:<span class="hljs-number">10</span>]}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Creating-a-Milvus-Collection" class="common-anchor-header">Création d'une collection Milvus</h3><p>Configurons maintenant notre base de données vectorielle à l'aide de Milvus :</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Initialize Milvus client (using Milvus Lite for simplicity)</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>

<span class="hljs-comment"># Remove existing collection if it exists</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)

<span class="hljs-comment"># Create a new collection</span>
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>,  <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># See https://milvus.io/docs/consistency.md for details</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Conseil de pro</strong>: Pour différents scénarios de déploiement, vous pouvez ajuster votre configuration Milvus :</p>
<ul>
<li><p>Pour le développement local : Utiliser <code translate="no">uri=&quot;./milvus.db&quot;</code> avec <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a></p></li>
<li><p>Pour des ensembles de données plus importants : Configurez un serveur Milvus via <a href="https://milvus.io/docs/quickstart.md">Docker/Kubernetes</a> et utilisez Milvus Lite. <code translate="no">uri=&quot;http://localhost:19530&quot;</code></p></li>
<li><p>Pour la production : Utilisez<a href="https://zilliz.com/cloud"> Zilliz Cloud</a> avec votre point de terminaison cloud et votre clé API.</p></li>
</ul>
<h3 id="Loading-Data-into-Milvus" class="common-anchor-header">Chargement des données dans Milvus</h3><p>Convertissons nos données textuelles en embeddings et stockons-les dans Milvus :</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

<span class="hljs-comment"># Create embeddings for all text chunks</span>
data = []
doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-comment"># Create records with IDs, vectors, and text</span>
<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

<span class="hljs-comment"># Insert data into Milvus</span>
milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">Creating embeddings:   0%|          | 0/72 [00:00&lt;?, ?it/s]huggingface/tokenizers: The current process just got forked, after parallelism has already been used. Disabling parallelism to avoid deadlocks...
To <span class="hljs-built_in">disable</span> this warning, you can either:
    - Avoid using `tokenizers` before the fork <span class="hljs-keyword">if</span> possible
    - Explicitly <span class="hljs-built_in">set</span> the environment variable TOKENIZERS_PARALLELISM=(<span class="hljs-literal">true</span> | <span class="hljs-literal">false</span>)
Creating embeddings: 100%|██████████| 72/72 [00:00&lt;00:00, 246522.36it/s]





{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-the-RAG-Pipeline" class="common-anchor-header">Construction du pipeline RAG</h3><h4 id="Step-1-Retrieve-Relevant-Information" class="common-anchor-header">Étape 1 : Récupérer les informations pertinentes</h4><p>Testons notre système RAG avec une question courante :</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>

<span class="hljs-comment"># Search for relevant information</span>
search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries([question]),  <span class="hljs-comment"># Convert question to embedding</span>
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)

<span class="hljs-comment"># Examine search results</span>
<span class="hljs-keyword">import</span> json
retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.6572665572166443</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus&#x27; data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###&quot;</span>,
        <span class="hljs-number">0.6312146186828613</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6115777492523193</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-2-Generate-a-Response-with-DeepSeek" class="common-anchor-header">Étape 2 : Générer une réponse avec DeepSeek</h4><p>Utilisons maintenant DeepSeek pour générer une réponse basée sur les informations récupérées :</p>
<pre><code translate="no"><span class="hljs-comment"># Combine retrieved text chunks</span>
context = <span class="hljs-string">&quot;\n&quot;</span>.join(
    [line_with_distance[<span class="hljs-number">0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)

<span class="hljs-comment"># Define prompts for the language model</span>
SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
&quot;&quot;&quot;</span>

USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.

&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;

&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>

<span class="hljs-comment"># Generate response with DeepSeek</span>
response = deepseek_client.chat.completions.create(
    model=<span class="hljs-string">&quot;deepseek-chat&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)

<span class="hljs-built_in">print</span>(response.choices[<span class="hljs-number">0</span>].message.content)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">In Milvus, data <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> two main categories: inserted data <span class="hljs-keyword">and</span> metadata.

<span class="hljs-number">1.</span> **Inserted Data**: This includes vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema. The inserted data <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> incremental logs. Milvus supports various <span class="hljs-built_in">object</span> storage backends <span class="hljs-keyword">for</span> <span class="hljs-keyword">this</span> purpose, such <span class="hljs-keyword">as</span> MinIO, AWS S3, <span class="hljs-function">Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>), Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>).

2. **Metadata**: Metadata <span class="hljs-keyword">is</span> generated within Milvus <span class="hljs-keyword">and</span> <span class="hljs-keyword">is</span> specific to each Milvus module. This metadata <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> etcd, a distributed key-<span class="hljs-keyword">value</span> store.

Additionally, <span class="hljs-keyword">when</span> data <span class="hljs-keyword">is</span> inserted, it <span class="hljs-keyword">is</span> first loaded <span class="hljs-keyword">into</span> a message queue, <span class="hljs-keyword">and</span> Milvus returns success at <span class="hljs-keyword">this</span> stage. The data <span class="hljs-keyword">is</span> then written to persistent storage <span class="hljs-keyword">as</span> incremental logs <span class="hljs-keyword">by</span> the data node. If the `<span class="hljs-title">flush</span>()` function <span class="hljs-keyword">is</span> called, the data node <span class="hljs-keyword">is</span> forced to write all data <span class="hljs-keyword">in</span> the message queue to persistent storage immediately.
</span><button class="copy-code-btn"></button></code></pre>
<p>Et voilà ! Vous avez réussi à construire un pipeline RAG complet avec DeepSeek v3-0324 et Milvus. Ce système peut maintenant répondre à des questions basées sur la documentation Milvus avec une grande précision et une connaissance du contexte.</p>
<h2 id="Comparing-DeepSeek-V3-0324-Original-vs-RAG-Enhanced-Version" class="common-anchor-header">Comparaison de DeepSeek-V3-0324 : Version originale et version améliorée par RAG<button data-href="#Comparing-DeepSeek-V3-0324-Original-vs-RAG-Enhanced-Version" class="anchor-icon" translate="no">
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
    </button></h2><p>La théorie est une chose, mais c'est la performance dans le monde réel qui compte. Nous avons testé à la fois la version standard de DeepSeek v3-0324 (avec "Deep Thinking" désactivé) et notre version améliorée par RAG avec la même invite : <em>Écrire du code HTML pour créer un site web sophistiqué sur Milvus.</em></p>
<h3 id="Website-Built-with-The-Standard-Models-Output-Code" class="common-anchor-header">Site web créé avec le code de sortie du modèle standard</h3><p>Voici à quoi ressemble le site web :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Website_Built_with_The_Standard_Model_s_Output_Code_695902b18a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bien que visuellement attrayant, le contenu s'appuie fortement sur des descriptions génériques et passe à côté de nombreuses caractéristiques techniques essentielles de Milvus.</p>
<h3 id="Website-Built-with-Code-Generated-by-the-RAG-Enhanced-Version" class="common-anchor-header">Site Web construit avec le code généré par la version améliorée de RAG</h3><p>Lorsque nous avons intégré Milvus en tant que base de connaissances, les résultats ont été radicalement différents :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Website_2_01341c647c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Le dernier site Web n'est pas seulement plus beau - il démontre une véritable compréhension de l'architecture, des cas d'utilisation et des avantages techniques de Milvus.</p>
<h2 id="Can-DeepSeek-v3-0324-Replace-Dedicated-Reasoning-Models" class="common-anchor-header">DeepSeek v3-0324 peut-il remplacer les modèles de raisonnement dédiés ?<button data-href="#Can-DeepSeek-v3-0324-Replace-Dedicated-Reasoning-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>Notre découverte la plus surprenante a été faite en comparant DeepSeek v3-0324 à des modèles de raisonnement spécialisés tels que Claude 3.7 Sonnet et GPT-4 Turbo pour des tâches de raisonnement mathématique, logique et de code.</p>
<p>Si les modèles de raisonnement spécialisés excellent dans la résolution de problèmes en plusieurs étapes, ils le font souvent au détriment de l'efficacité. Nos benchmarks ont montré que les modèles à forte composante de raisonnement suranalysent fréquemment de simples invites, générant 2 à 3 fois plus de jetons que nécessaire et augmentant de manière significative la latence et les coûts de l'API.</p>
<p>DeepSeek v3-0324 adopte une approche différente. Il fait preuve d'une cohérence logique comparable, mais avec une concision remarquablement plus grande, produisant souvent des solutions correctes avec 40 à 60 % de jetons en moins. Cette efficacité ne se fait pas au détriment de la précision ; dans nos tests de génération de code, les solutions de DeepSeek ont égalé ou dépassé la fonctionnalité de celles des concurrents axés sur le raisonnement.</p>
<p>Pour les développeurs qui doivent concilier performance et contraintes budgétaires, cet avantage en termes d'efficacité se traduit directement par des coûts d'API plus faibles et des temps de réponse plus rapides - des facteurs cruciaux pour les applications de production où l'expérience de l'utilisateur dépend de la vitesse perçue.</p>
<h2 id="The-Future-of-AI-Models-Blurring-the-Reasoning-Divide" class="common-anchor-header">L'avenir des modèles d'IA : Effacer le fossé du raisonnement<button data-href="#The-Future-of-AI-Models-Blurring-the-Reasoning-Divide" class="anchor-icon" translate="no">
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
    </button></h2><p>Les performances de DeepSeek v3-0324 remettent en question une hypothèse fondamentale de l'industrie de l'IA : le raisonnement et l'efficacité représentent un compromis inévitable. Cela suggère que nous approchons peut-être d'un point d'inflexion où la distinction entre les modèles de raisonnement et de non-raisonnement commence à s'estomper.</p>
<p>Les principaux fournisseurs d'IA pourraient finir par éliminer complètement cette distinction, en développant des modèles qui ajustent dynamiquement la profondeur de leur raisonnement en fonction de la complexité de la tâche. Un tel raisonnement adaptatif optimiserait à la fois l'efficacité des calculs et la qualité des réponses, ce qui pourrait révolutionner la manière dont nous construisons et déployons les applications d'IA.</p>
<p>Pour les développeurs de systèmes RAG, cette évolution promet des solutions plus rentables qui offrent la profondeur de raisonnement des modèles haut de gamme sans leur surcharge de calcul - élargissant ainsi ce qui est possible avec l'IA open-source.</p>
