---
id: hermes-agent-learning-loop-milvus-hybrid-search.md
title: >-
  Comment réparer la boucle d'apprentissage de l'agent Hermes avec la recherche
  hybride Milvus 2.6
author: Min Yin
date: 2026-4-24
cover: >-
  assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_2_e0b44ee562.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Hermes Agent, Milvus 2.6, hybrid search, agent memory, skill learning loop'
meta_title: |
  How to Fix Hermes Agent's Learning Loop with Milvus 2.6 Hybrid Search
desc: >-
  La boucle d'apprentissage de l'agent Hermes écrit les compétences à partir de
  l'utilisation, mais son récupérateur FTS5 manque les requêtes reformulées. La
  recherche hybride Milvus 2.6 corrige le rappel intersession.
origin: 'https://milvus.io/blog/hermes-agent-learning-loop-milvus-hybrid-search.md'
---
<p><a href="https://github.com/NousResearch/hermes-agent"><strong>L'agent Hermes</strong></a> <strong>est omniprésent ces derniers temps.</strong> Construit par Nous Research, Hermes est un agent d'IA personnel auto-hébergé qui fonctionne sur votre propre matériel (un VPS à 5 $ fonctionne) et vous parle par le biais de canaux de discussion existants comme Telegram.</p>
<p><strong>Son principal atout est une boucle d'apprentissage intégrée :</strong> la boucle crée des compétences à partir de l'expérience, les améliore en cours d'utilisation et recherche des conversations passées pour trouver des modèles réutilisables. D'autres frameworks d'agents codent manuellement les compétences avant de les déployer. Les compétences d'Hermes se développent à l'usage, et les flux de travail répétés deviennent réutilisables sans aucune modification du code.</p>
<p><strong>L'inconvénient est que la recherche d'Hermes se fait uniquement par mot-clé.</strong> Elle correspond aux mots exacts, mais pas au sens recherché par les utilisateurs. Lorsque les utilisateurs utilisent des termes différents au cours de différentes sessions, la boucle ne peut pas les relier et aucune nouvelle compétence n'est écrite. Lorsqu'il n'y a que quelques centaines de documents, l'écart est tolérable. <strong>Au-delà, la boucle cesse d'apprendre parce qu'elle ne peut pas retrouver son propre historique.</strong></p>
<p><strong>La solution est Milvus 2.6.</strong> Sa <a href="https://milvus.io/docs/multi-vector-search.md">recherche hybride</a> couvre à la fois le sens et les mots-clés exacts en une seule requête, de sorte que la boucle peut enfin relier les informations reformulées d'une session à l'autre. Il est suffisamment léger pour tenir sur un petit serveur cloud (un VPS à 5 $/mois le fait fonctionner). Le remplacer ne nécessite pas de changer Hermes - Milvus se glisse derrière la couche de recherche, de sorte que la boucle d'apprentissage reste intacte. Hermes choisit toujours les compétences à exécuter, et Milvus s'occupe de ce qu'il faut récupérer.</p>
<p>Mais les avantages vont au-delà d'une meilleure mémorisation : une fois que la récupération fonctionne, la boucle d'apprentissage peut stocker la stratégie de récupération elle-même en tant que compétence, et pas seulement le contenu qu'elle récupère. C'est ainsi que les connaissances de l'agent se combinent d'une session à l'autre.</p>
<h2 id="Hermes-Agent-Architecture-How-Four-Layer-Memory-Powers-the-Skill-Learning-Loop" class="common-anchor-header">Architecture de l'agent Hermes : Comment la mémoire à quatre couches alimente la boucle d'apprentissage des compétences<button data-href="#Hermes-Agent-Architecture-How-Four-Layer-Memory-Powers-the-Skill-Learning-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/NousResearch/hermes-agent"><strong>Hermes</strong></a> <strong>possède quatre couches de mémoire, et L4 Skills est celle qui le distingue des autres.</strong></p>
<ul>
<li><strong>L1</strong> - contexte de la session, effacé à la fin de la session</li>
<li><strong>L2</strong> - faits persistants : pile de projets, conventions d'équipe, décisions prises</li>
<li><strong>L3</strong> - Recherche par mots-clés SQLite FTS5 sur les fichiers locaux</li>
<li><strong>L4</strong> - stockage des flux de travail sous forme de fichiers Markdown. Contrairement aux outils LangChain ou aux plugins AutoGPT, que les développeurs créent dans le code avant le déploiement, les compétences L4 sont auto-écrites : elles se développent à partir de ce que l'agent exécute réellement, sans aucun travail de création de la part du développeur.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_3_3653368e99.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-Hermess-FTS5-Keyword-Retrieval-Breaks-the-Learning-Loop" class="common-anchor-header">Pourquoi la recherche de mots-clés de FTS5 de Hermes rompt la boucle d'apprentissage<button data-href="#Why-Hermess-FTS5-Keyword-Retrieval-Breaks-the-Learning-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hermes a besoin de la récupération pour déclencher des workflows intersession en premier lieu.</strong> Mais sa couche L3 intégrée utilise SQLite FTS5, qui ne correspond qu'à des jetons littéraux, pas au sens.</p>
<p><strong>Lorsque les utilisateurs formulent la même intention différemment d'une session à l'autre, FTS5 ne trouve pas de correspondance.</strong> La boucle d'apprentissage ne se déclenche pas. Aucune nouvelle compétence n'est écrite, et la prochaine fois que l'intention se présente, l'utilisateur doit à nouveau effectuer le routage à la main.</p>
<p>Exemple : la base de connaissances stocke "asyncio event loop, async task scheduling, non-blocking I/O". Un utilisateur recherche "Python concurrency". FTS5 renvoie zéro résultat - il n'y a pas de chevauchement de mots, et FTS5 n'a aucun moyen de voir qu'il s'agit de la même question.</p>
<p>En dessous de quelques centaines de documents, l'écart est tolérable. Au-delà, la documentation utilise un vocabulaire, les utilisateurs posent des questions dans un autre vocabulaire, et FTS5 n'a pas de passerelle entre les deux. <strong>Le contenu non récupérable pourrait tout aussi bien ne pas figurer dans la base de connaissances, et la boucle d'apprentissage n'a rien à apprendre.</strong></p>
<h2 id="How-Milvus-26-Fixes-the-Retrieval-Gap-with-Hybrid-Search-and-Tiered-Storage" class="common-anchor-header">Comment Milvus 2.6 comble les lacunes en matière de recherche grâce à la recherche hybride et au stockage hiérarchisé<button data-href="#How-Milvus-26-Fixes-the-Retrieval-Gap-with-Hybrid-Search-and-Tiered-Storage" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Milvus 2.6 apporte deux mises à niveau qui répondent aux points d'échec d'Hermes.</strong> La <strong>recherche hybride</strong> débloque la boucle d'apprentissage en couvrant à la fois la recherche sémantique et la recherche par mot-clé en un seul appel. Le <strong>stockage hiérarchisé</strong> maintient l'ensemble du backend de recherche suffisamment petit pour fonctionner sur le même VPS à 5$/mois que celui pour lequel Hermes a été conçu.</p>
<h3 id="What-Hybrid-Search-Solves-Finding-Relevant-Information" class="common-anchor-header">Ce que la recherche hybride résout : Trouver des informations pertinentes</h3><p>Milvus 2.6 permet d'exécuter à la fois la recherche vectorielle (sémantique) et la <a href="https://milvus.io/docs/full-text-search.md">recherche plein texte BM25</a> (mot-clé) dans une seule requête, puis de fusionner les deux listes classées à l'aide de la <a href="https://milvus.io/docs/multi-vector-search.md">fusion réciproque des rangs (RRF)</a>.</p>
<p>Par exemple : demandez &quot;quel est le principe d'asyncio&quot;, et la recherche vectorielle trouvera des contenus sémantiquement liés. Demandez &quot;où est définie la fonction <code translate="no">find_similar_task</code> &quot;, et BM25 correspond précisément au nom de la fonction dans le code. Pour les questions qui impliquent une fonction à l'intérieur d'un type particulier de tâche, la recherche hybride renvoie le bon résultat en un seul appel, sans aucune logique de routage écrite à la main.</p>
<p>Pour Hermes, c'est ce qui débloque la boucle d'apprentissage. Lorsqu'une deuxième session reformule l'intention, la recherche vectorielle capture la correspondance sémantique manquée par FTS5. La boucle s'active et une nouvelle compétence est écrite.</p>
<h3 id="What-Tiered-Storage-Solves-Cost" class="common-anchor-header">Ce que le stockage hiérarchisé résout : Le coût</h3><p>Une base de données vectorielle naïve souhaiterait disposer de l'index d'intégration complet dans la RAM, ce qui pousse les déploiements personnels vers des infrastructures plus grandes et plus coûteuses. Milvus 2.6 évite cela grâce à un stockage à trois niveaux, déplaçant les entrées entre les niveaux en fonction de la fréquence d'accès :</p>
<ul>
<li><strong>Chaud</strong> - en mémoire</li>
<li><strong>Chaud</strong> - sur SSD</li>
<li><strong>Froid</strong> - sur le stockage objet</li>
</ul>
<p>Seules les données chaudes restent résidentes. Une base de connaissances de 500 documents tient dans 2 Go de RAM. L'ensemble de la pile de récupération fonctionne sur le même VPS à 5 $/mois que Hermes cible, sans qu'aucune mise à niveau de l'infrastructure ne soit nécessaire.</p>
<h2 id="Hermes-+-Milvus-System-Architecture" class="common-anchor-header">Hermes + Milvus : Architecture du système<button data-href="#Hermes-+-Milvus-System-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hermes choisit la compétence à exécuter. Milvus s'occupe de ce qu'il faut récupérer.</strong> Les deux systèmes restent séparés et l'interface d'Hermes ne change pas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_4_1794304940.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Le flux :</strong></p>
<ol>
<li>Hermes identifie l'intention de l'utilisateur et l'oriente vers une compétence.</li>
<li>La compétence appelle un script d'extraction par l'intermédiaire de l'outil terminal.</li>
<li>Le script accède à Milvus, effectue une recherche hybride et renvoie des morceaux classés avec les métadonnées de la source.</li>
<li>Hermes compose la réponse. La mémoire enregistre le flux de travail.</li>
<li>Lorsque le même schéma se répète d'une session à l'autre, la boucle d'apprentissage écrit une nouvelle compétence.</li>
</ol>
<h2 id="How-to-Install-Hermes-and-Milvus-26" class="common-anchor-header">Comment installer Hermes et Milvus 2.6<button data-href="#How-to-Install-Hermes-and-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Installez Hermes et</strong> <a href="https://milvus.io/docs/install_standalone-docker.md"><strong>Milvus 2.6 Standalone</strong></a><strong>, puis créez une collection avec des champs denses et BM25.</strong> C'est la configuration complète avant que la boucle d'apprentissage ne puisse se déclencher.</p>
<h3 id="Install-Hermes" class="common-anchor-header">Installer Hermes</h3><pre><code translate="no" class="language-bash">curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
<button class="copy-code-btn"></button></code></pre>
<p>Exécutez <code translate="no">hermes</code> pour accéder à l'assistant d'installation interactif :</p>
<ul>
<li><strong>Fournisseur LLM</strong> - OpenAI, Anthropic, OpenRouter (OpenRouter a des modèles gratuits)</li>
<li><strong>Canal</strong> - ce guide utilise un bot FLark</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_5_dceeae1519.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Run-Milvus-26-Standalone" class="common-anchor-header">Exécuter Milvus 2.6 en mode autonome</h3><p>Un seul nœud autonome est suffisant pour un agent personnel :</p>
<pre><code translate="no" class="language-bash">curl -sfL https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh \
-o standalone_embed.sh
bash standalone_embed.sh start
<span class="hljs-comment"># Verify service status</span>
docker ps | grep milvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Create-the-Collection" class="common-anchor-header">Créer la collection</h3><p>La conception du schéma plafonne ce que la récupération peut faire. Ce schéma exécute côte à côte des vecteurs denses et des vecteurs épars BM25 :</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType
client = MilvusClient(
    uri=<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>,
)
schema = client.create_schema(auto_id=<span class="hljs-literal">True</span>, enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-comment"># Raw text (for BM25 full-text search)</span>
schema.add_field(
    <span class="hljs-string">&quot;text&quot;</span>,
    DataType.VARCHAR,
    max_length=<span class="hljs-number">8192</span>,
    enable_analyzer=<span class="hljs-literal">True</span>,
    enable_match=<span class="hljs-literal">True</span>
)
<span class="hljs-comment"># Dense vector (semantic search)</span>
schema.add_field(<span class="hljs-string">&quot;dense_vector&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>)
<span class="hljs-comment"># Sparse vector (BM25 auto-generated, Milvus 2.6 feature)</span>
schema.add_field(<span class="hljs-string">&quot;sparse_vector&quot;</span>, DataType.SPARSE_FLOAT_VECTOR)
schema.add_field(<span class="hljs-string">&quot;source&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;chunk_index&quot;</span>, DataType.INT32)
<span class="hljs-comment"># Tell Milvus to auto-convert text to sparse_vector via BM25</span>
bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;sparse_vector&quot;</span>],
)
schema.add_function(bm25_function)
index_params = client.prepare_index_params()
<span class="hljs-comment"># HNSW graph index (dense vector)</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;dense_vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">256</span>}
)
<span class="hljs-comment"># BM25 inverted index (sparse vector)</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;SPARSE_INVERTED_INDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>
)
client.create_collection(
    collection_name=<span class="hljs-string">&quot;hermes_milvus&quot;</span>,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_6_0646f46d36.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Hybrid-Search-Script" class="common-anchor-header">Script de recherche hybride</h3><pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> sys, json
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, AnnSearchRequest, RRFRanker

client = MilvusClient(<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>)
oai    = OpenAI()
COLLECTION = <span class="hljs-string">&quot;hermes_milvus&quot;</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">hybrid_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">dict</span>]:
    <span class="hljs-comment"># 1. Vectorize query</span>
    dense_vec = oai.embeddings.create(
        model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>,
        <span class="hljs-built_in">input</span>=query
    ).data[<span class="hljs-number">0</span>].embedding

    <span class="hljs-comment"># 2. Dense vector retrieval (semantic relevance)</span>
    dense_req = AnnSearchRequest(
        data=[dense_vec],
        anns_field=<span class="hljs-string">&quot;dense_vector&quot;</span>,
        param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">128</span>}},
        limit=top_k * <span class="hljs-number">2</span>       <span class="hljs-comment"># Widen candidate set, let RRF do final ranking</span>
    )

    <span class="hljs-comment"># 3. BM25 sparse vector retrieval (exact term matching)</span>
    bm25_req = AnnSearchRequest(
        data=[query],
        anns_field=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
        param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>},
        limit=top_k * <span class="hljs-number">2</span>
    )

    <span class="hljs-comment"># 4. RRF fusion ranking</span>
    results = client.hybrid_search(
        collection_name=COLLECTION,
        reqs=[dense_req, bm25_req],
        ranker=RRFRanker(k=<span class="hljs-number">60</span>),
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;doc_type&quot;</span>]
    )

    <span class="hljs-keyword">return</span> [
        {
            <span class="hljs-string">&quot;text&quot;</span>:     r.entity.get(<span class="hljs-string">&quot;text&quot;</span>),
            <span class="hljs-string">&quot;source&quot;</span>:   r.entity.get(<span class="hljs-string">&quot;source&quot;</span>),
            <span class="hljs-string">&quot;doc_type&quot;</span>: r.entity.get(<span class="hljs-string">&quot;doc_type&quot;</span>),
            <span class="hljs-string">&quot;score&quot;</span>:    <span class="hljs-built_in">round</span>(r.distance, <span class="hljs-number">4</span>)
        }
        <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]
    ]

<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    query= sys.argv[<span class="hljs-number">1</span>] <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(sys.argv) &gt; <span class="hljs-number">1</span> <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>
    top_k  = <span class="hljs-built_in">int</span>(sys.argv[<span class="hljs-number">2</span>]) <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(sys.argv) &gt; <span class="hljs-number">2</span> <span class="hljs-keyword">else</span> <span class="hljs-number">5</span>
    output = hybrid_search(query, top_k)
    <span class="hljs-built_in">print</span>(json.dumps(output, ensure_ascii=<span class="hljs-literal">False</span>, indent=<span class="hljs-number">2</span>))
<button class="copy-code-btn"></button></code></pre>
<p><strong>La requête dense élargit le pool de candidats de 2× afin que RRF ait suffisamment d'éléments à classer.</strong> <code translate="no">text-embedding-3-small</code> est l'intégration OpenAI la moins chère qui conserve sa qualité de recherche ; remplacez-la par <code translate="no">text-embedding-3-large</code> si le budget le permet.</p>
<p>L'environnement et la base de connaissances étant prêts, la section suivante met la boucle d'apprentissage à l'épreuve.</p>
<h2 id="Hermes-Skill-Auto-Generation-in-Practice" class="common-anchor-header">L'autogénération des compétences Hermes en pratique<button data-href="#Hermes-Skill-Auto-Generation-in-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Deux sessions montrent la boucle d'apprentissage en action.</strong> Dans la première, l'utilisateur nomme le script à la main. Dans la seconde, une nouvelle session pose la même question sans nommer le script. Hermès reprend le modèle et écrit trois Skills.</p>
<h3 id="Session-1-Call-the-Script-by-Hand" class="common-anchor-header">Session 1 : Appeler le script à la main</h3><p>Ouvrez Hermes dans Lark. Donnez-lui le chemin d'accès au script et la cible de recherche. Hermès invoque l'outil terminal, exécute le script et renvoie la réponse avec l'attribution de la source. <strong>Aucune compétence n'existe encore. Il s'agit d'un simple appel d'outil.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_7_1c2d9261f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Session-2-Ask-Without-Naming-the-Script" class="common-anchor-header">Session 2 : Demander sans nommer le script</h3><p>Effacer la conversation. Recommencez à zéro. Posez la même catégorie de questions sans mentionner le scénario ou le chemin.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_8_27253eda82.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Memory-Writes-First-Skill-Follows" class="common-anchor-header">La mémoire écrit d'abord, la compétence suit</h3><p><strong>La boucle d'apprentissage enregistre le flux de travail (script, arguments, forme de retour) et renvoie la réponse.</strong> La mémoire conserve la trace ; aucune compétence n'existe encore.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_9_a0768f84bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>La correspondance de la deuxième session indique à la boucle que le modèle vaut la peine d'être conservé.</strong> Lorsqu'elle se déclenche, trois compétences sont écrites :</p>
<table>
<thead>
<tr><th>Compétence</th><th>Rôle</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">hybrid-search-doc-qa</code></td><td>Exécuter une recherche hybride sémantique + mot-clé sur la mémoire et composer la réponse</td></tr>
<tr><td><code translate="no">milvus-docs-ingest-verification</code></td><td>Vérifier que les documents ont été intégrés dans la base de connaissances</td></tr>
<tr><td><code translate="no">terminal</code></td><td>Exécuter des commandes shell : scripts, configuration de l'environnement, inspection</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_10_b68e35bc46.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>À partir de ce moment, les <strong>utilisateurs cessent de nommer les compétences.</strong> Hermes déduit l'intention, se dirige vers la compétence, extrait les éléments pertinents de la mémoire et rédige la réponse. Il n'y a pas de sélecteur de compétence dans l'invite.</p>
<p>La plupart des systèmes RAG (retrieval-augmented generation) résolvent le problème du stockage et de la recherche, mais la logique de recherche elle-même est codée en dur dans le code de l'application. Si vous posez la question d'une autre manière ou dans un nouveau scénario, la récupération s'interrompt. Hermes stocke la stratégie de recherche en tant que compétence, ce qui signifie que <strong>le chemin de recherche devient un document que vous pouvez lire, éditer et modifier.</strong> La ligne <code translate="no">💾 Memory updated · Skill 'hybrid-search-doc-qa' created</code> n'est pas un marqueur de fin d'installation. C'est <strong>l'agent qui enregistre un modèle de comportement dans sa mémoire à long terme.</strong></p>
<h2 id="Hermes-vs-OpenClaw-Accumulation-vs-Orchestration" class="common-anchor-header">Hermes vs. OpenClaw : Accumulation ou orchestration<button data-href="#Hermes-vs-OpenClaw-Accumulation-vs-Orchestration" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hermes et OpenClaw répondent à des problèmes différents.</strong> Hermes est conçu pour un agent unique qui accumule de la mémoire et des compétences au fil des sessions. OpenClaw est conçu pour décomposer une tâche complexe en plusieurs parties et confier chacune d'entre elles à un agent spécialisé.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_11_afcb575d50.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La force d'OpenClaw réside dans l'orchestration. Il optimise la part d'une tâche qui est effectuée automatiquement. La force d'Hermes est l'accumulation : un agent unique qui se souvient à travers les sessions, avec des compétences qui se développent à l'usage. Hermes optimise le contexte à long terme et l'expérience du domaine.</p>
<p><strong>Les deux frameworks s'empilent.</strong> Hermes propose un chemin de migration en une étape qui permet d'intégrer la mémoire et les compétences de <code translate="no">~/.openclaw</code> dans les couches de mémoire d'Hermes. Une pile d'orchestration peut être placée au-dessus, avec un agent d'accumulation en dessous.</p>
<p>Pour le côté OpenClaw de la séparation, voir <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">Qu'est-ce qu'OpenClaw ? Complete Guide to the Open-Source AI Agent</a> sur le blog de Milvus.</p>
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
    </button></h2><p>La boucle d'apprentissage d'Hermes transforme les flux de travail répétés en compétences réutilisables, mais seulement si la récupération peut les relier entre les sessions. La recherche par mot-clé de FTS5 ne le peut pas. La <a href="https://milvus.io/docs/multi-vector-search.md"><strong>recherche hybride Milvus 2.6</strong></a> le peut : les vecteurs denses gèrent le sens, BM25 gère les mots-clés exacts, RRF fusionne les deux, et le <a href="https://milvus.io/docs/tiered-storage-overview.md">stockage par paliers</a> permet de conserver l'ensemble sur un VPS à 5 $/mois.</p>
<p>Le point le plus important : une fois que la recherche fonctionne, l'agent ne se contente pas de stocker de meilleures réponses : il stocke de meilleures stratégies de recherche en tant que compétences. Le chemin de recherche devient un document versionnable qui s'améliore à l'usage. C'est ce qui différencie un agent qui accumule de l'expertise dans un domaine d'un agent qui repart à zéro à chaque session. Pour une comparaison de la façon dont les autres agents gèrent (ou non) ce problème, voir <a href="https://milvus.io/blog/claude-code-memory-memsearch.md">Le système de mémoire de Claude Code expliqué.</a></p>
<h2 id="Get-Started" class="common-anchor-header">Pour commencer<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Essayez les outils présentés dans cet article :</strong></p>
<ul>
<li><a href="https://github.com/NousResearch/hermes-agent">Hermes Agent sur GitHub</a> - script d'installation, configuration du fournisseur et configuration des canaux utilisés ci-dessus.</li>
<li><a href="https://milvus.io/docs/install_standalone-docker.md">Milvus 2.6 Standalone Quickstart</a> - déploiement Docker à nœud unique pour le backend de la base de connaissances.</li>
<li>Milvus<a href="https://milvus.io/docs/multi-vector-search.md">Hybrid Search Tutorial</a> - densité complète + BM25 + exemple RRF correspondant au script de ce billet.</li>
</ul>
<p><strong>Vous avez des questions sur la recherche hybride Hermes + Milvus ?</strong></p>
<ul>
<li>Rejoignez le <a href="https://discord.gg/milvus">Discord Milvus</a> pour poser des questions sur la recherche hybride, le stockage hiérarchisé ou les modèles de routage des compétences - d'autres développeurs construisent des piles similaires.</li>
<li><a href="https://milvus.io/community#office-hours">Réservez une session Milvus Office Hours</a> pour découvrir votre propre agent + la configuration de la base de connaissances avec l'équipe Milvus.</li>
</ul>
<p><strong>Vous voulez sauter l'étape de l'auto-hébergement ?</strong></p>
<ul>
<li><a href="https://cloud.zilliz.com/signup">Inscrivez-vous</a> ou <a href="https://cloud.zilliz.com/login">connectez-vous à</a> Zilliz Cloud - Milvus géré avec la recherche hybride et le stockage hiérarchisé. Les nouveaux comptes de messagerie professionnelle bénéficient de <strong> 100 $ de crédits gratuits</strong>.</li>
</ul>
<h2 id="Further-Reading" class="common-anchor-header">Pour en savoir plus<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/docs/release_notes.md">Milvus 2.6 release notes</a> - stockage hiérarchisé, recherche hybride, changements de schéma</li>
<li><a href="https://zilliz.com/blog">Zilliz Cloud &amp; Milvus CLI + Official Skills</a> - outils opérationnels pour les agents natifs de Milvus</li>
<li><a href="https://zilliz.com/blog">Pourquoi la gestion des connaissances de type RAG ne fonctionne pas pour les agents</a> - le cas de la conception d'une mémoire spécifique à l'agent</li>
<li><a href="https://zilliz.com/blog">Le système de mémoire de Claude Code est plus primitif que vous ne le pensez</a> - comparaison de la pile de mémoire d'un autre agent</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Questions fréquemment posées<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="How-does-Hermes-Agents-Skill-Learning-Loop-actually-work" class="common-anchor-header">Comment fonctionne la boucle d'apprentissage des compétences de l'agent Hermes ?</h3><p>Hermes enregistre chaque flux de travail qu'il exécute - le script appelé, les arguments passés, et la forme du retour - comme une trace mémoire. Lorsque le même modèle apparaît dans deux sessions ou plus, la boucle d'apprentissage se déclenche et écrit une compétence réutilisable : un fichier Markdown qui capture le flux de travail comme une procédure répétable. À partir de ce moment, Hermes se dirige vers la compétence par la seule intention, sans que l'utilisateur ne la nomme. La dépendance critique est la récupération - la boucle ne se déclenche que si elle peut trouver la trace de la session précédente, ce qui explique pourquoi la recherche par mot-clé uniquement devient un goulot d'étranglement à grande échelle.</p>
<h3 id="Whats-the-difference-between-hybrid-search-and-vector-only-search-for-agent-memory" class="common-anchor-header">Quelle est la différence entre la recherche hybride et la recherche vectorielle pour la mémoire des agents ?</h3><p>La recherche vectorielle seule gère bien les significations, mais ne parvient pas à trouver les correspondances exactes. Si un développeur colle une chaîne d'erreur comme ConnectionResetError ou un nom de fonction comme find_similar_task, une recherche purement vectorielle peut renvoyer des résultats sémantiquement liés mais erronés. La recherche hybride combine des vecteurs denses (sémantique) avec BM25 (mot-clé) et fusionne les deux ensembles de résultats avec Reciprocal Rank Fusion. Pour la mémoire d'agent - où les requêtes vont d'une intention vague ("Python concurrency") à des symboles exacts - la recherche hybride couvre les deux extrémités en un seul appel sans logique de routage dans votre couche d'application.</p>
<h3 id="Can-I-use-Milvus-hybrid-search-with-AI-agents-other-than-Hermes" class="common-anchor-header">Puis-je utiliser la recherche hybride Milvus avec des agents d'IA autres qu'Hermes ?</h3><p>Oui. Le modèle d'intégration est générique : l'agent appelle un script de recherche, le script interroge Milvus et les résultats sont renvoyés sous forme de morceaux classés avec des métadonnées source. Tout cadre d'agent prenant en charge les appels d'outils ou l'exécution d'un shell peut utiliser la même approche. Hermes s'avère être une solution idéale car sa boucle d'apprentissage dépend spécifiquement de l'extraction intersession pour se déclencher, mais le côté Milvus est agnostique - il ne sait pas ou ne se soucie pas de l'agent qui l'appelle.</p>
<h3 id="How-much-does-a-self-hosted-Milvus-+-Hermes-setup-cost-per-month" class="common-anchor-header">Quel est le coût mensuel d'une configuration auto-hébergée Milvus + Hermes ?</h3><p>Un nœud unique Milvus 2.6 Standalone sur un VPS à 2 cœurs / 4 Go avec un stockage hiérarchisé coûte environ 5 $/mois. L'intégration de texte OpenAI-3-small coûte 0,02 $ pour 1M de jetons - quelques centimes par mois pour une base de connaissances personnelle. L'inférence LLM domine le coût total et s'adapte à l'utilisation, et non à la pile de recherche.</p>
