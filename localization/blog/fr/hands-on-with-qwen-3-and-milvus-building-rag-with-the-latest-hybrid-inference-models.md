---
id: >-
  hands-on-with-qwen-3-and-milvus-building-rag-with-the-latest-hybrid-inference-models.md
title: >-
  Pratique avec Qwen 3 et Milvus : Construire RAG avec les derniers modèles
  d'inférence hybrides
author: Lumina Wang
date: 2025-04-30T00:00:00.000Z
desc: >-
  Partager les capacités clés des modèles Qwen 3 et vous guider dans le
  processus d'association de Qwen 3 avec Milvus pour construire un système local
  de génération augmentée par récupération (RAG) tenant compte des coûts.
cover: assets.zilliz.com/build_RAG_with_qwen_3_and_milvus_64b9f2ad4d.jpeg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, Qwen 3, MOE, dense models'
meta_title: >
  Hands-on with Qwen 3 and Milvus: Building RAG with the Latest Hybrid Inference
  Models
origin: >-
  https://milvus.io/blog/hands-on-with-qwen-3-and-milvus-building-rag-with-the-latest-hybrid-inference-models.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_RAG_with_qwen_3_and_milvus_64b9f2ad4d.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>En tant que développeur constamment à la recherche d'outils d'IA pratiques, je n'ai pas pu ignorer le buzz entourant la dernière version d'Alibaba Cloud : la famille de modèles<a href="https://qwenlm.github.io/blog/qwen3/"> Qwen 3</a>, une gamme robuste de huit modèles d'inférence hybrides conçus pour redéfinir l'équilibre entre l'intelligence et l'efficacité. En seulement 12 heures, le projet a obtenu <strong>plus de 17 000 étoiles GitHub</strong> et a atteint un pic de <strong>23 000 téléchargements</strong> par heure sur Hugging Face.</p>
<p>Qu'est-ce qui change cette fois-ci ? En bref, les modèles Qwen 3 combinent à la fois le raisonnement (réponses lentes et réfléchies) et le non-raisonnement (réponses rapides et efficaces) dans une architecture unique, incluent diverses options de modèles, une formation et des performances améliorées, et offrent davantage de fonctionnalités prêtes pour l'entreprise.</p>
<p>Dans cet article, je résume les principales fonctionnalités des modèles Qwen 3 auxquelles vous devez prêter attention et je vous guide tout au long du processus d'association de Qwen 3 avec Milvus pour construire un système RAG (retrieval-augmented generation) local et conscient des coûts, avec un code pratique et des conseils pour optimiser les performances par rapport à la latence.</p>
<p>Plongeons dans le vif du sujet.</p>
<h2 id="Whats-Exciting-About-Qwen-3" class="common-anchor-header">Qu'y a-t-il de passionnant dans Qwen 3 ?<button data-href="#Whats-Exciting-About-Qwen-3" class="anchor-icon" translate="no">
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
    </button></h2><p>Après avoir testé et approfondi Qwen 3, il est clair qu'il ne s'agit pas seulement de chiffres plus importants sur une feuille de spécifications. Il s'agit de la façon dont les choix de conception du modèle aident réellement les développeurs à créer de meilleures applications GenAI - plus rapidement, plus intelligemment et avec plus de contrôle. Voici ce qui ressort.</p>
<h3 id="1-Hybrid-Thinking-Modes-Smart-When-You-Need-Them-Speed-When-You-Don’t" class="common-anchor-header">1. Modes de pensée hybrides : Intelligents quand vous en avez besoin, rapides quand vous n'en avez pas besoin</h3><p>L'une des fonctionnalités les plus innovantes de Qwen 3 est son <strong>architecture d'inférence hybride</strong>. Elle vous permet de contrôler finement le niveau de " réflexion " du modèle, tâche par tâche. En effet, toutes les tâches ne nécessitent pas un raisonnement complexe.</p>
<ul>
<li><p>Pour les problèmes complexes nécessitant une analyse approfondie, vous pouvez utiliser toute la puissance de raisonnement, même si elle est plus lente.</p></li>
<li><p>Pour les requêtes simples de la vie quotidienne, vous pouvez passer à un mode plus rapide et plus léger.</p></li>
<li><p>Vous pouvez même définir un <strong>"budget de réflexion</strong> ", c'est-à-dire plafonner la quantité de calcul ou de jetons consommée par une session.</p></li>
</ul>
<p>Il ne s'agit pas non plus d'une simple fonctionnalité de laboratoire. Elle répond directement au compromis quotidien auquel sont confrontés les développeurs : fournir des réponses de haute qualité sans faire exploser les coûts d'infrastructure ou le temps de latence des utilisateurs.</p>
<h3 id="2-A-Versatile-Lineup-MoE-and-Dense-Models-for-Different-Needs" class="common-anchor-header">2. Une gamme polyvalente : Modèles MoE et denses pour différents besoins</h3><p>Qwen 3 propose une large gamme de modèles conçus pour répondre à différents besoins opérationnels :</p>
<ul>
<li><p><strong>Deux modèles MoE (Mixture of Experts)</strong>:</p>
<ul>
<li><p><strong>Qwen3-235B-A22B</strong>: 235 milliards de paramètres totaux, 22 milliards actifs par requête</p></li>
<li><p><strong>Qwen3-30B-A3B</strong>: 30 milliards de paramètres totaux, 3 milliards de paramètres actifs.</p></li>
</ul></li>
<li><p><strong>Six modèles denses</strong>: de 0,6 milliard à 32 milliards de paramètres.</p></li>
</ul>
<p><em>Bref rappel technique : Les modèles denses (comme le GPT-3 ou le BERT) activent toujours tous les paramètres, ce qui les rend plus lourds mais parfois plus prévisibles.</em> <a href="https://zilliz.com/learn/what-is-mixture-of-experts"><em>Les modèles MoE</em></a> <em>n'activent qu'une fraction du réseau à la fois, ce qui les rend beaucoup plus efficaces à grande échelle.</em></p>
<p>En pratique, cette gamme polyvalente de modèles signifie que vous pouvez</p>
<ul>
<li><p>utiliser des modèles denses pour les charges de travail restreintes et prévisibles (comme les dispositifs intégrés)</p></li>
<li><p>Utiliser des modèles MoE lorsque vous avez besoin de capacités lourdes sans faire exploser votre facture de cloud.</p></li>
</ul>
<p>Grâce à cette gamme, vous pouvez adapter votre déploiement, qu'il s'agisse d'installations légères et prêtes à l'emploi ou de déploiements puissants à l'échelle du cloud, sans être enfermé dans un seul type de modèle.</p>
<h3 id="3-Focused-on-Efficiency-and-Real-World-Deployment" class="common-anchor-header">3. L'efficacité et le déploiement en conditions réelles au cœur de nos préoccupations</h3><p>Au lieu de se concentrer uniquement sur l'augmentation de la taille des modèles, Qwen 3 se concentre sur l'efficacité de la formation et l'aspect pratique du déploiement :</p>
<ul>
<li><p><strong>Entraînement sur 36 billions de jetons</strong> - le double de ce qu'utilisait Qwen 2.5</p></li>
<li><p><strong>Extension à 235 milliards de paramètres</strong> - mais intelligemment gérée par des techniques de MoE, équilibrant la capacité avec les demandes de ressources.</p></li>
<li><p><strong>Optimisé pour le déploiement</strong> - la quantification dynamique (de FP4 à INT8) vous permet d'exécuter même le plus grand modèle Qwen 3 sur une infrastructure modeste - par exemple, un déploiement sur quatre GPU H20.</p></li>
</ul>
<p>L'objectif est clair : offrir des performances plus élevées sans nécessiter d'investissements disproportionnés dans l'infrastructure.</p>
<h3 id="4-Built-for-Real-Integration-MCP-Support-and-Multilingual-Capabilities" class="common-anchor-header">4. Construit pour une véritable intégration : Support MCP et capacités multilingues</h3><p>Qwen 3 est conçu dans une optique d'intégration, et pas seulement de performance isolée des modèles :</p>
<ul>
<li><p>La<strong>compatibilité MCP (Model Context Protocol)</strong> permet une intégration transparente avec des bases de données, des API et des outils externes, réduisant ainsi les coûts d'ingénierie pour les applications complexes.</p></li>
<li><p><strong>Qwen-Agent</strong> améliore l'appel d'outils et l'orchestration de flux de travail, ce qui permet de construire des systèmes d'IA plus dynamiques et exploitables.</p></li>
<li><p>La<strong>prise en charge multilingue de 119 langues et dialectes</strong> fait de Qwen 3 un choix judicieux pour les applications destinées aux marchés mondiaux et multilingues.</p></li>
</ul>
<p>L'ensemble de ces fonctionnalités permet aux développeurs de construire plus facilement des systèmes de production sans avoir besoin d'une ingénierie personnalisée importante autour du modèle.</p>
<h2 id="Qwen-3-Now-Supported-in-DeepSearcher" class="common-anchor-header">Qwen 3 désormais pris en charge par DeepSearcher<button data-href="#Qwen-3-Now-Supported-in-DeepSearcher" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a> est un projet open-source pour la recherche approfondie et la génération de rapports, conçu comme une alternative locale à Deep Research d'OpenAI. Il aide les développeurs à construire des systèmes qui remontent à la surface des informations contextuelles de haute qualité à partir de sources de données privées ou spécifiques à un domaine.</p>
<p>DeepSearcher prend désormais en charge l'architecture d'inférence hybride de Qwen 3, ce qui permet aux développeurs d'alterner le raisonnement de manière dynamique - en appliquant une inférence plus profonde uniquement lorsqu'elle apporte une valeur ajoutée, et en l'ignorant lorsque la rapidité est plus importante.</p>
<p>Sous le capot, DeepSearcher s'intègre à<a href="https://milvus.io"> Milvus</a>, une base de données vectorielle haute performance développée par les ingénieurs de Zilliz, pour fournir une recherche sémantique rapide et précise sur les données locales. Combiné à la flexibilité du modèle, il permet aux développeurs de mieux contrôler le comportement du système, le coût et l'expérience de l'utilisateur.</p>
<h2 id="Hands-on-Tutorial-Building-a-RAG-System-with-Qwen-3-and-Milvus" class="common-anchor-header">Didacticiel pratique : Construire un système RAG avec Qwen 3 et Milvus<button data-href="#Hands-on-Tutorial-Building-a-RAG-System-with-Qwen-3-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Mettons ces modèles Qwen 3 en pratique en construisant un système RAG à l'aide de la base de données vectorielles Milvus.</p>
<h3 id="Set-up-the-environment" class="common-anchor-header">Configurez l'environnement.</h3><pre><code translate="no"><span class="hljs-comment"># Install required packages</span>
pip install --upgrade pymilvus openai requests tqdm
<span class="hljs-comment"># Set up API key</span>
<span class="hljs-keyword">import</span> os
os.environ[<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>] = <span class="hljs-string">&quot;YOUR_DASHSCOPE_API_KEY&quot;</span> <span class="hljs-comment"># Get this from Alibaba Cloud DashScope</span>
<button class="copy-code-btn"></button></code></pre>
<p>Remarque : vous devez obtenir la clé API auprès d'Alibaba Cloud.</p>
<h3 id="Data-Preparation" class="common-anchor-header">Préparation des données</h3><p>Nous utiliserons les pages de documentation de Milvus comme base de connaissances principale.</p>
<pre><code translate="no"><span class="hljs-comment"># Download and extract Milvus documentation</span>
!wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
!unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs

<span class="hljs-comment"># Load and parse the markdown files</span>
<span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
        text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Setting-Up-Models" class="common-anchor-header">Configuration des modèles</h3><p>Nous utiliserons l'API compatible OpenAI de DashScope pour accéder à Qwen 3 :</p>
<pre><code translate="no"><span class="hljs-comment"># Set up OpenAI client to access Qwen 3</span>
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

openai_client = OpenAI(
    base_url=<span class="hljs-string">&quot;https://dashscope.aliyuncs.com/compatible-mode/v1&quot;</span>,
    api_key=os.getenv(<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>)
)

<span class="hljs-comment"># Set up embedding model</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model
embedding_model = milvus_model.DefaultEmbeddingFunction()
<button class="copy-code-btn"></button></code></pre>
<p>Générons un embedding de test et imprimons ses dimensions et ses premiers éléments :</p>
<pre><code translate="no">test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embedding[:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>Sortie :</p>
<pre><code translate="no">768
[-0.04836066 0.07163023 -0.01130064 -0.03789345 -0.03320649 -0.01318448
 -0.03041712 -0.02269499 -0.02317863 -0.00426028]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Creating-a-Milvus-Collection" class="common-anchor-header">Création d'une collection Milvus</h3><p>Configurons notre base de données vectorielle Milvus :</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Initialize Milvus client (using local storage for simplicity)</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>

<span class="hljs-comment"># Create a fresh collection</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)

<span class="hljs-comment"># Create a new collection</span>
test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>, <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>A propos des paramètres de MilvusClient :</p>
<ul>
<li><p>Définir l'URI d'un fichier local (par exemple, <code translate="no">./milvus.db</code>) est la méthode la plus pratique car elle utilise automatiquement Milvus Lite pour stocker toutes les données dans ce fichier.</p></li>
<li><p>Pour les données à grande échelle, vous pouvez configurer un serveur Milvus plus puissant sur Docker ou Kubernetes. Dans ce cas, utilisez l'URI du serveur (par exemple, <code translate="no">http://localhost:19530</code>) comme URI.</p></li>
<li><p>Si vous souhaitez utiliser <a href="https://zilliz.com/cloud">Zilliz Cloud </a>(le service géré de Milvus), ajustez l'URI et le jeton, qui correspondent au point de terminaison public et à la clé API dans Zilliz Cloud.</p></li>
</ul>
<h3 id="Adding-Documents-to-the-Collection" class="common-anchor-header">Ajout de documents à la collection</h3><p>Nous allons maintenant créer des embeddings pour nos morceaux de texte et les ajouter à Milvus :</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

data = []
doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>Output :</p>
<pre><code translate="no">Creating embeddings: 100%|██████████████████████████████████████████████████| 72/72 [00:00&lt;00:00, 381300.36it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-the-RAG-Query-System" class="common-anchor-header">Construction du système de requête RAG</h3><p>Passons maintenant à la partie la plus excitante : configurons notre système RAG pour qu'il réponde aux questions.</p>
<p>Spécifions une question courante sur Milvus :</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Recherchez cette question dans la collection et récupérez les 3 premiers résultats sémantiquement correspondants :</p>
<pre><code translate="no">search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries([question]), <span class="hljs-comment"># Convert the question to an embedding vector</span>
    limit=<span class="hljs-number">3</span>, <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}}, <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>], <span class="hljs-comment"># Return the text field</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Examinons les résultats de la recherche pour cette question :</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json
retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<p>Sortie :</p>
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
<h3 id="Using-the-LLM-to-Build-a-RAG-Response" class="common-anchor-header">Utilisation du LLM pour construire une réponse RAG</h3><p>Convertir les documents récupérés au format chaîne de caractères :</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Fournir une invite système et une invite utilisateur pour le grand modèle linguistique :</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
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
<button class="copy-code-btn"></button></code></pre>
<p>Utiliser le dernier modèle Qwen pour générer une réponse basée sur l'invite :</p>
<pre><code translate="no">completion = openai_client.chat.completions.create(
    <span class="hljs-comment"># Model list: https://help.aliyun.com/zh/model-studio/getting-started/models</span>
    model=<span class="hljs-string">&quot;qwen-plus-2025-04-28&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
    <span class="hljs-comment"># Control thinking process with enable_thinking parameter (default True for open-source, False for commercial)</span>
    extra_body={<span class="hljs-string">&quot;enable_thinking&quot;</span>: <span class="hljs-literal">False</span>},
)

<span class="hljs-built_in">print</span>(completion.choices[<span class="hljs-number">0</span>].message.content)

<button class="copy-code-btn"></button></code></pre>
<p>Sortie :</p>
<pre><code translate="no">In Milvus, data <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> two main categories: **inserted data** <span class="hljs-keyword">and</span> **metadata**.

- **Inserted Data**: <span class="hljs-function">This includes vector <span class="hljs-title">data</span> (<span class="hljs-params">like Binary, Float32, Float16, <span class="hljs-keyword">and</span> BFloat16 types</span>), scalar data, <span class="hljs-keyword">and</span> collection-specific schema. These are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> **incremental logs**. Milvus supports various <span class="hljs-built_in">object</span> storage backends <span class="hljs-keyword">for</span> <span class="hljs-keyword">this</span> purpose, including:

  - [MinIO](<span class="hljs-params">https://min.io/</span>)
  - [AWS S3](<span class="hljs-params">https://aws.amazon.com/s3/?nc1=h_ls</span>)
  - [Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>)](<span class="hljs-params">https://cloud.google.com/storage?hl=en#<span class="hljs-built_in">object</span>-storage-<span class="hljs-keyword">for</span>-companies-of-all-sizes</span>)
  - [Azure Blob Storage](<span class="hljs-params">https://azure.microsoft.com/en-us/products/storage/blobs</span>)
  - [Alibaba Cloud OSS](<span class="hljs-params">https://www.alibabacloud.com/product/<span class="hljs-built_in">object</span>-storage-service</span>)
  - [Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>)](<span class="hljs-params">https://www.tencentcloud.com/products/cos</span>)

- **Metadata**: Metadata generated within Milvus <span class="hljs-keyword">is</span> stored separately. Each Milvus module maintains its own metadata, which <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> [etcd](<span class="hljs-params">https://etcd.io/</span>), a distributed key-<span class="hljs-keyword">value</span> store.
When data <span class="hljs-keyword">is</span> inserted <span class="hljs-keyword">into</span> Milvus, it <span class="hljs-keyword">is</span> first loaded <span class="hljs-keyword">into</span> a message queue. It <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> immediately written to disk. A `<span class="hljs-title">flush</span>()` operation ensures that all data <span class="hljs-keyword">in</span> the queue <span class="hljs-keyword">is</span> written to persistent storage immediately.
</span><button class="copy-code-btn"></button></code></pre>
<h2 id="Comparing-Reasoning-vs-Non-Reasoning-Modes-A-Practical-Test" class="common-anchor-header">Comparaison des modes de raisonnement et de non-raisonnement : Un test pratique<button data-href="#Comparing-Reasoning-vs-Non-Reasoning-Modes-A-Practical-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>J'ai effectué un test comparant les deux modes d'inférence sur un problème mathématique :</p>
<p><strong>Problème :</strong> une personne A et une personne B partent en courant du même endroit. A part en premier et court pendant 2 heures à 5km/h. B le suit à 15km/h. B le suit à 15 km/h. Combien de temps faudra-t-il à B pour le rattraper ?</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/math_problem_0123815455.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> time
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

os.environ[<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>] = <span class="hljs-string">&quot;sk-****************&quot;</span>
client = OpenAI(
   api_key=os.getenv(<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>),
   base_url=<span class="hljs-string">&quot;https://dashscope.aliyuncs.com/compatible-mode/v1&quot;</span>,
)
<span class="hljs-comment">############################################</span>
<span class="hljs-comment"># Think</span>
<span class="hljs-comment"># Record the start time</span>
start_time = time.time()
stream = client.chat.completions.create(
   <span class="hljs-comment"># model lists：https://help.aliyun.com/zh/model-studio/getting-started/models</span>
   model=<span class="hljs-string">&quot;qwen3-235b-a22b&quot;</span>,
   <span class="hljs-comment"># model=&quot;qwen-plus-2025-04-28&quot;,</span>
   messages=[
       {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;You are a helpful assistant.&quot;</span>},
       {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;A and B depart from the same location. A leaves 2 hours earlier at 5 km/h. B follows at 15 km/h. When will B catch up?&quot;</span>},
   ],
   <span class="hljs-comment"># You can control the thinking mode through the enable_thinking parameter</span>
   extra_body={<span class="hljs-string">&quot;enable_thinking&quot;</span>: <span class="hljs-literal">True</span>},
   stream=<span class="hljs-literal">True</span>,
)
answer_content = <span class="hljs-string">&quot;&quot;</span>
<span class="hljs-keyword">for</span> chunk <span class="hljs-keyword">in</span> stream:
   delta = chunk.choices[<span class="hljs-number">0</span>].delta
   <span class="hljs-keyword">if</span> delta.content <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
       answer_content += delta.content
      
<span class="hljs-built_in">print</span>(answer_content)

<span class="hljs-comment"># Record the end time and calculate the total runtime</span>
end_time = time.time()
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n\nTotal runtime：<span class="hljs-subst">{end_time - start_time:<span class="hljs-number">.2</span>f}</span>seconds&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Avec le mode raisonnement activé :</strong></p>
<ul>
<li><p>Temps de traitement : ~74,83 secondes</p></li>
<li><p>Analyse approfondie, analyse du problème, solutions multiples</p></li>
<li><p>Sortie markdown de haute qualité avec formules</p></li>
</ul>
<p>(L'image ci-dessous est une capture d'écran de la visualisation de la réponse du modèle en markdown, pour la commodité du lecteur)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/screenshot_with_reasoning_1_d231b6ad54.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/screenshot_with_reasoning_2_394d3bff9f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Mode sans raisonnement :</strong></p>
<p>Dans le code, il suffit de définir <code translate="no">&quot;enable_thinking&quot;: False</code></p>
<p>Résultats du mode non-raisonnement sur ce problème :</p>
<ul>
<li>Temps de traitement : ~74,83 secondes</li>
<li>Analyse approfondie, analyse du problème, solutions multiples</li>
<li>Sortie markdown de haute qualité avec des formules</li>
</ul>
<p>(L'image ci-dessous est une capture d'écran de la visualisation de la réponse du modèle en markdown, pour la commodité du lecteur)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/screenshot_without_reasoning_e1f6b82e56.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>Qwen 3 introduit une architecture de modèle flexible qui s'aligne bien sur les besoins réels du développement de GenAI. Avec une gamme de tailles de modèles (y compris les variantes denses et MoE), des modes d'inférence hybrides, l'intégration MCP et le support multilingue, il donne aux développeurs plus d'options pour ajuster la performance, la latence et le coût, en fonction du cas d'utilisation.</p>
<p>Plutôt que de mettre l'accent uniquement sur l'échelle, Qwen 3 se concentre sur l'adaptabilité. Cela en fait un choix pratique pour la construction de pipelines RAG, d'<a href="https://zilliz.com/blog/what-exactly-are-ai-agents-why-openai-and-langchain-are-fighting-over-their-definition">agents d'IA</a> et d'applications de production qui nécessitent à la fois des capacités de raisonnement et un fonctionnement rentable.</p>
<p>Associées à une infrastructure comme<a href="https://milvus.io"> Milvus</a> - une base de données vectorielle open-source très performante - les capacités de Qwen 3 deviennent encore plus utiles, permettant une recherche sémantique rapide et une intégration en douceur avec les systèmes de données locaux. Ensemble, elles constituent une base solide pour des applications GenAI intelligentes et réactives à grande échelle.</p>
