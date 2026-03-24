---
id: fix-rag-retrieval-errors-crag-langgraph-milvus.md
title: 'Corriger les erreurs de récupération de RAG avec CRAG, LangGraph et Milvus'
author: Min Yin
date: 2026-3-23
cover: assets.zilliz.com/cover_CRAG_a05dddbaa2_aafaad6bc0.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'CRAG, RAG retrieval, LangGraph, Milvus, hybrid retrieval'
meta_title: |
  Fix RAG Retrieval Errors with CRAG, LangGraph, and Milvus
desc: >-
  Grande similarité mais mauvaises réponses ? Découvrez comment CRAG ajoute
  l'évaluation et la correction aux pipelines RAG. Construisez un système prêt
  pour la production avec LangGraph + Milvus.
origin: 'https://milvus.io/blog/fix-rag-retrieval-errors-crag-langgraph-milvus.md'
---
<p>Au fur et à mesure que les applications LLM sont mises en production, les équipes ont de plus en plus besoin que leurs modèles répondent à des questions fondées sur des données privées ou des informations en temps réel. La <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">génération augmentée par récupération</a> (RAG) - où le modèle puise dans une base de connaissances externe au moment de la requête - est l'approche standard. Elle permet de réduire les hallucinations et de maintenir les réponses à jour.</p>
<p>Mais voici un problème qui apparaît rapidement dans la pratique : <strong>un document peut obtenir un score élevé en termes de similarité tout en étant complètement erroné par rapport à la question.</strong> Les pipelines RAG traditionnels assimilent la similarité à la pertinence. En production, cette hypothèse ne tient pas. Un résultat classé en tête de liste peut être obsolète, n'avoir qu'un rapport indirect avec la question ou ne pas contenir le détail exact dont l'utilisateur a besoin.</p>
<p>CRAG (Corrective Retrieval-Augmented Generation) résout ce problème en ajoutant une évaluation et une correction entre la recherche et la génération. Au lieu de se fier aveuglément aux scores de similarité, le système vérifie si le contenu récupéré répond réellement à la question et corrige la situation si ce n'est pas le cas.</p>
<p>Cet article présente la construction d'un système CRAG prêt pour la production, utilisant LangChain, LangGraph et <a href="https://milvus.io/intro">Milvus</a>.</p>
<h2 id="Three-Retrieval-Problems-Traditional-RAG-Doesnt-Solve" class="common-anchor-header">Trois problèmes d'extraction que les systèmes traditionnels de RAG ne résolvent pas<button data-href="#Three-Retrieval-Problems-Traditional-RAG-Doesnt-Solve" class="anchor-icon" translate="no">
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
    </button></h2><p>La plupart des échecs des systèmes RAG en production sont dus à l'un des trois problèmes suivants :</p>
<p><strong>Inadéquation de la recherche.</strong> Le document est similaire sur le plan thématique mais ne répond pas à la question. Si vous demandez comment configurer un certificat HTTPS dans Nginx, le système vous renverra peut-être un guide d'installation d'Apache, une présentation de 2019 ou une explication générale sur le fonctionnement de TLS. Sémantiquement proche, pratiquement inutile.</p>
<p><strong>Contenu périmé.</strong> La <a href="https://zilliz.com/learn/vector-similarity-search">recherche vectorielle</a> n'a pas de notion de récence. Si vous demandez "Python async best practices", vous obtiendrez un mélange de modèles de 2018 et de modèles de 2024, classés uniquement en fonction de la distance d'intégration. Le système ne peut pas distinguer ce dont l'utilisateur a réellement besoin.</p>
<p><strong>Contamination de la mémoire.</strong> Ce problème s'aggrave avec le temps et est souvent le plus difficile à résoudre. Supposons que le système récupère une référence API obsolète et génère un code incorrect. Ce mauvais résultat est stocké dans la mémoire. Lors de la prochaine requête similaire, le système la récupère à nouveau, renforçant ainsi l'erreur. Les informations fraîches et périmées se mélangent progressivement et la fiabilité du système s'érode à chaque cycle.</p>
<p>Il ne s'agit pas de cas isolés. Ils apparaissent régulièrement dès qu'un système RAG gère un trafic réel. C'est ce qui fait des contrôles de qualité de la recherche une exigence, et non un luxe.</p>
<h2 id="What-Is-CRAG-Evaluate-First-Then-Generate" class="common-anchor-header">Qu'est-ce que CRAG ? Évaluer d'abord, générer ensuite<button data-href="#What-Is-CRAG-Evaluate-First-Then-Generate" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Corrective Retrieval-Augmented Generation (CRAG)</strong> est une méthode qui ajoute une étape d'évaluation et de correction entre la recherche et la génération dans un pipeline RAG. Elle a été introduite dans l'article <a href="https://openreview.net/forum?id=JnWJbrnaUE"><em>Corrective Retrieval Augmented Generation</em></a> (Yan et al., 2024). Contrairement au RAG traditionnel, qui prend une décision binaire - utiliser le document ou le rejeter - le RAG évalue la pertinence de chaque résultat extrait et le fait passer par l'un des trois chemins de correction avant qu'il n'atteigne le modèle de langage.</p>
<p>Le système RAG traditionnel se heurte à des difficultés lorsque les résultats de la recherche se situent dans une zone grise : ils sont partiellement pertinents, quelque peu dépassés ou il leur manque un élément clé. Une simple porte oui/non écarte des informations partielles utiles ou laisse passer un contenu bruyant. CRAG recadre le pipeline de <strong>récupération → génération</strong> à <strong>récupération → évaluation → correction → génération</strong>, donnant au système une chance de corriger la qualité de la récupération avant le début de la génération.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/fix_rag_retrieval_errors_crag_langgraph_milvus_1_11a820f454.png" alt="CRAG four-step workflow: Retrieval → Evaluation → Correction → Generation, showing how documents are scored and routed" class="doc-image" id="crag-four-step-workflow:-retrieval-→-evaluation-→-correction-→-generation,-showing-how-documents-are-scored-and-routed" />
   <span>Flux de travail en quatre étapes de CRAG : Récupération → Évaluation → Correction → Génération, montrant comment les documents sont notés et acheminés.</span> </span></p>
<p>Les résultats obtenus sont classés dans l'une des trois catégories suivantes :</p>
<ul>
<li><strong>Correct :</strong> répond directement à la requête ; utilisable après un léger raffinement.</li>
<li><strong>Ambigu :</strong> partiellement pertinent ; nécessite des informations complémentaires</li>
<li><strong>Incorrect :</strong> non pertinent ; à écarter et à renvoyer à d'autres sources.</li>
</ul>
<table>
<thead>
<tr><th>Décision</th><th>Confiance</th><th>Action</th></tr>
</thead>
<tbody>
<tr><td>Correct</td><td>&gt; 0.9</td><td>Affiner le contenu du document</td></tr>
<tr><td>Ambiguë</td><td>0.5-0.9</td><td>Affiner le document + compléter par une recherche sur le web</td></tr>
<tr><td>Incorrect</td><td>&lt; 0.5</td><td>Rejeter les résultats de la recherche ; se rabattre entièrement sur la recherche en ligne</td></tr>
</tbody>
</table>
<h3 id="Content-Refinement" class="common-anchor-header">Raffinement du contenu</h3><p>Le CRAG aborde également un problème plus subtil lié au RAG standard : la plupart des systèmes transmettent au modèle l'intégralité du document extrait. Cela gaspille des tokens et dilue le signal - le modèle doit parcourir des paragraphes non pertinents pour trouver la seule phrase qui compte vraiment. CRAG affine d'abord le contenu récupéré, en extrayant les parties pertinentes et en supprimant le reste.</p>
<p>L'article original utilise pour cela des bandes de connaissances et des règles heuristiques. Dans la pratique, la correspondance par mot-clé fonctionne pour de nombreux cas d'utilisation, et les systèmes de production peuvent ajouter une couche de résumé basée sur LLM ou d'extraction structurée pour une meilleure qualité.</p>
<p>Le processus d'affinage comporte trois parties :</p>
<ul>
<li><strong>Décomposition du document :</strong> extraction des passages clés d'un document plus long</li>
<li><strong>Réécriture des requêtes :</strong> transformer les requêtes vagues ou ambiguës en requêtes plus ciblées.</li>
<li><strong>Sélection des connaissances :</strong> dédupliquer, classer et conserver uniquement le contenu le plus utile.</li>
</ul>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/fix_rag_retrieval_errors_crag_langgraph_milvus_2_9ec4b6aa81.png" alt="The three-step document refinement process: Document Decomposition (2000 → 500 tokens), Query Rewriting (improved search precision), and Knowledge Selection (filter, rank, and trim)" class="doc-image" id="the-three-step-document-refinement-process:-document-decomposition-(2000-→-500-tokens),-query-rewriting-(improved-search-precision),-and-knowledge-selection-(filter,-rank,-and-trim)" />
   <span>Le processus d'affinage des documents en trois étapes : Décomposition du document (2000 → 500 tokens), réécriture de la requête (amélioration de la précision de la recherche) et sélection des connaissances (filtrage, classement et élagage).</span> </span></p>
<h3 id="The-Evaluator" class="common-anchor-header">L'évaluateur</h3><p>L'évaluateur est le cœur de CRAG. Il n'est pas destiné à un raisonnement approfondi, c'est une porte de triage rapide. Étant donné une requête et un ensemble de documents récupérés, il décide si le contenu est suffisamment bon pour être utilisé.</p>
<p>L'article original opte pour un modèle T5-Large affiné plutôt que pour un LLM à usage général. Le raisonnement est le suivant : la vitesse et la précision sont plus importantes que la flexibilité pour cette tâche particulière.</p>
<table>
<thead>
<tr><th>Attribut</th><th>T5-Large affiné</th><th>GPT-4</th></tr>
</thead>
<tbody>
<tr><td>Temps de latence</td><td>10-20 ms</td><td>200 ms et plus</td></tr>
<tr><td>Précision</td><td>92% (expériences sur papier)</td><td>A DÉTERMINER</td></tr>
<tr><td>Adaptation à la tâche</td><td>Élevée - tâche unique finement réglée, plus grande précision</td><td>Moyenne - polyvalente, plus flexible mais moins spécialisée</td></tr>
</tbody>
</table>
<h3 id="Web-Search-Fallback" class="common-anchor-header">Repli de la recherche sur le web</h3><p>Lorsque la recherche interne est signalée comme incorrecte ou ambiguë, CRAG peut déclencher une recherche sur le web pour obtenir des informations plus fraîches ou complémentaires. Il s'agit d'un filet de sécurité pour les requêtes urgentes et les sujets pour lesquels la base de connaissances interne présente des lacunes.</p>
<h2 id="Why-Milvus-Is-a-Good-Fit-for-CRAG-in-Production" class="common-anchor-header">Pourquoi Milvus est un bon choix pour CRAG en production<button data-href="#Why-Milvus-Is-a-Good-Fit-for-CRAG-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>L'efficacité de CRAG dépend de ce qui se trouve en dessous. La <a href="https://zilliz.com/learn/what-is-vector-database">base de données vectorielle</a> doit faire plus qu'une simple recherche de similarité, elle doit prendre en charge l'isolation multi-tenant, la recherche hybride et la flexibilité des schémas qu'exige un système CRAG de production.</p>
<p>Après avoir évalué plusieurs options, nous avons choisi <a href="https://zilliz.com/what-is-milvus">Milvus</a> pour trois raisons.</p>
<h3 id="Multi-Tenant-Isolation" class="common-anchor-header">Isolation multi-locataires</h3><p>Dans les systèmes basés sur des agents, chaque utilisateur ou session a besoin de son propre espace mémoire. L'approche naïve - une collection par locataire - devient rapidement un casse-tête opérationnel, en particulier à grande échelle.</p>
<p>Milvus gère cela avec <a href="https://milvus.io/docs/use-partition-key.md">Partition Key</a>. Définissez <code translate="no">is_partition_key=True</code> sur le champ <code translate="no">agent_id</code> et Milvus achemine automatiquement les requêtes vers la bonne partition. Pas d'étalement de la collection, pas de code de routage manuel.</p>
<p>Dans nos benchmarks avec 10 millions de vecteurs sur 100 locataires, Milvus avec Clustering Compaction a fourni un <strong>QPS 3 à 5 fois plus élevé</strong> par rapport à la ligne de base non optimisée.</p>
<h3 id="Hybrid-Retrieval" class="common-anchor-header">Recherche hybride</h3><p>La recherche vectorielle pure est insuffisante pour les UGS de contenu-produit à correspondance exacte comme <code translate="no">SKU-2024-X5</code>, les chaînes de version ou la terminologie spécifique.</p>
<p>Milvus 2.5 prend en charge la <a href="https://milvus.io/docs/multi-vector-search.md">recherche hybride de</a> manière native : vecteurs denses pour la similarité sémantique, vecteurs épars pour la correspondance par mot-clé de type BM25 et filtrage scalaire des métadonnées, le tout en une seule requête. Les résultats sont fusionnés à l'aide de la méthode Reciprocal Rank Fusion (RRF), ce qui vous évite de construire et de fusionner des pipelines d'extraction distincts.</p>
<p>Sur un ensemble de données d'un million de vecteurs, la latence d'extraction de Milvus Sparse-BM25 était de <strong>6 ms</strong>, avec un impact négligeable sur les performances CRAG de bout en bout.</p>
<h3 id="Flexible-Schema-for-Evolving-Memory" class="common-anchor-header">Un schéma flexible pour une mémoire évolutive</h3><p>Au fur et à mesure que les pipelines CRAG mûrissent, le modèle de données évolue avec eux. Nous devions ajouter des champs tels que <code translate="no">confidence</code>, <code translate="no">verified</code>, et <code translate="no">source</code> tout en itérant sur la logique d'évaluation. Dans la plupart des bases de données, cela implique des scripts de migration et des temps d'arrêt.</p>
<p>Milvus prend en charge les champs JSON dynamiques, de sorte que les métadonnées peuvent être étendues à la volée sans interruption de service.</p>
<p>Voici un schéma type :</p>
<pre><code translate="no" class="language-python">fields = [
    FieldSchema(name=<span class="hljs-string">&quot;agent_id&quot;</span>, dtype=DataType.VARCHAR, is_partition_key=<span class="hljs-literal">True</span>),  <span class="hljs-comment"># multi-tenancy</span>
    FieldSchema(name=<span class="hljs-string">&quot;dense_embedding&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>),   <span class="hljs-comment"># semantic retrieval</span>
    FieldSchema(name=<span class="hljs-string">&quot;sparse_embedding&quot;</span>, dtype=DataType.SPARSE_FLOAT_VECTOR),<span class="hljs-comment"># BM25</span>
    FieldSchema(name=<span class="hljs-string">&quot;metadata&quot;</span>, dtype=DataType.JSON),<span class="hljs-comment"># dynamic schema</span>
]

<span class="hljs-comment"># hybrid retrieval + metadata filtering</span>
results = collection.hybrid_search(
    reqs=[
        AnnSearchRequest(data=[dense_vec], anns_field=<span class="hljs-string">&quot;dense_embedding&quot;</span>, limit=<span class="hljs-number">20</span>),
        AnnSearchRequest(data=[sparse_vec], anns_field=<span class="hljs-string">&quot;sparse_embedding&quot;</span>, limit=<span class="hljs-number">20</span>)
    ],
    rerank=RRFRanker(),
    output_fields=[<span class="hljs-string">&quot;metadata&quot;</span>],
    expr=<span class="hljs-string">&#x27;metadata[&quot;confidence&quot;] &gt; 0.9&#x27;</span>,<span class="hljs-comment"># CRAG confidence filtering</span>
    limit=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus simplifie également la mise à l'échelle du déploiement. Il propose les <a href="https://milvus.io/docs/install-overview.md">modes Lite, Standalone et Distributed</a> qui sont compatibles avec le code - passer du développement local à un cluster de production nécessite uniquement de modifier la chaîne de connexion.</p>
<h2 id="Hands-On-Build-a-CRAG-System-with-LangGraph-Middleware-and-Milvus" class="common-anchor-header">Travaux pratiques : construction d'un système CRAG avec LangGraph Middleware et Milvus<button data-href="#Hands-On-Build-a-CRAG-System-with-LangGraph-Middleware-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Why-the-Middleware-Approach" class="common-anchor-header">Pourquoi l'approche middleware ?</h3><p>Une façon courante de construire un CRAG avec LangGraph est de créer un graphe d'état avec des nœuds et des arêtes contrôlant chaque étape. Cela fonctionne, mais le graphe s'emmêle au fur et à mesure que la complexité augmente, et le débogage devient un casse-tête.</p>
<p>Nous avons opté pour le <strong>modèle Middleware</strong> dans LangGraph 1.0. Il intercepte les requêtes avant l'appel au modèle, de sorte que la récupération, l'évaluation et la correction sont gérées en un seul endroit cohérent. Par rapport à l'approche du graphe d'état :</p>
<ul>
<li><strong>Moins de code :</strong> la logique est centralisée et non dispersée dans les nœuds du graphe.</li>
<li><strong>Plus facile à suivre :</strong> le flux de contrôle se lit de manière linéaire.</li>
<li><strong>Plus facile à déboguer : les</strong> défaillances pointent vers un seul endroit, et non vers un parcours du graphe.</li>
</ul>
<h3 id="Core-Workflow" class="common-anchor-header">Flux de travail principal</h3><p>Le pipeline s'exécute en quatre étapes :</p>
<ol>
<li><strong>Récupération :</strong> récupérer les 3 documents les plus pertinents dans Milvus, en fonction du locataire actuel.</li>
<li><strong>Évaluation :</strong> évaluer la qualité des documents à l'aide d'un modèle léger.</li>
<li><strong>Correction :</strong> affiner, compléter avec une recherche sur le web, ou se retirer complètement en fonction du verdict.</li>
<li><strong>Injection :</strong> transmettre le contexte finalisé au modèle par le biais d'une invite dynamique du système.</li>
</ol>
<h3 id="Environment-Setup-and-Data-Preparation" class="common-anchor-header">Configuration de l'environnement et préparation des données</h3><p><strong>Variables d'environnement</strong></p>
<pre><code translate="no" class="language-bash"><span class="hljs-keyword">export</span> <span class="hljs-variable constant_">OPENAI_API_KEY</span>=<span class="hljs-string">&quot;your-api-key&quot;</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">TAVILY_API_KEY</span>=<span class="hljs-string">&quot;your-tavily-key&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Créer la collection Milvus</strong></p>
<p>Avant d'exécuter le code, créez une collection dans Milvus avec un schéma qui correspond à la logique d'extraction.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># filename: crag_agent.py</span>

<span class="hljs-comment"># ============ Import dependencies ============</span>
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">Literal</span>, <span class="hljs-type">List</span>
<span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> AgentMiddleware, before_model, dynamic_prompt
<span class="hljs-keyword">from</span> langchain.chat_models <span class="hljs-keyword">import</span> init_chat_model
<span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain_openai <span class="hljs-keyword">import</span> OpenAIEmbeddings
<span class="hljs-keyword">from</span> langchain_core.documents <span class="hljs-keyword">import</span> Document
<span class="hljs-keyword">from</span> langchain_core.messages <span class="hljs-keyword">import</span> SystemMessage, HumanMessage
<span class="hljs-keyword">from</span> langchain_community.tools.tavily_search <span class="hljs-keyword">import</span> TavilySearchResults


<span class="hljs-comment"># ============ CRAG Middleware (minimal-change version) ============</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">CRAGMiddleware</span>(<span class="hljs-title class_ inherited__">AgentMiddleware</span>):
    <span class="hljs-string">&quot;&quot;&quot;CRAG evaluation and correction middleware (uses official decorator-based hooks to avoid permanently polluting the message stack)&quot;&quot;&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, vector_store: Milvus, agent_id: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-built_in">super</span>().__init__()
        <span class="hljs-variable language_">self</span>.vector_store = vector_store
        <span class="hljs-variable language_">self</span>.agent_id = agent_id  <span class="hljs-comment"># multi-tenant isolation</span>
        <span class="hljs-comment"># Lightweight evaluator: used for relevance judgment (can be replaced with the structured version introduced later)</span>
        <span class="hljs-variable language_">self</span>.evaluator = init_chat_model(<span class="hljs-string">&quot;openai:gpt-4o-mini&quot;</span>, temperature=<span class="hljs-number">0</span>)
        <span class="hljs-comment"># Web search fallback</span>
        <span class="hljs-variable language_">self</span>.web_search = TavilySearchResults(max_results=<span class="hljs-number">3</span>)

<span class="hljs-meta">    @before_model</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">run_crag</span>(<span class="hljs-params">self, state</span>):
        <span class="hljs-string">&quot;&quot;&quot;Run retrieval -&gt; evaluation -&gt; correction before model invocation and prepare the final context&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Get the last user message</span>
        last_msg = state[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>]
        query = <span class="hljs-built_in">getattr</span>(last_msg, <span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>) <span class="hljs-keyword">if</span> <span class="hljs-built_in">hasattr</span>(last_msg, <span class="hljs-string">&quot;content&quot;</span>) <span class="hljs-keyword">else</span> last_msg.get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)

        <span class="hljs-comment"># 1. Retrieval: get documents from Milvus (PartitionKey + confidence filtering)</span>
        docs = <span class="hljs-variable language_">self</span>._retrieve_from_milvus(query)

        <span class="hljs-comment"># 2. Evaluation: three-way decision</span>
        verdict = <span class="hljs-variable language_">self</span>._evaluate_relevance(query, docs)

        <span class="hljs-comment"># 3. Correction: choose the handling strategy based on the verdict</span>
        <span class="hljs-keyword">if</span> verdict == <span class="hljs-string">&quot;incorrect&quot;</span>:
            <span class="hljs-comment"># Retrieval failed, rely entirely on Web search</span>
            web_results = <span class="hljs-variable language_">self</span>._web_search_fallback(query)
            final_context = <span class="hljs-variable language_">self</span>._format_web_results(web_results)
        <span class="hljs-keyword">elif</span> verdict == <span class="hljs-string">&quot;ambiguous&quot;</span>:
            <span class="hljs-comment"># Retrieval is ambiguous, refine documents + supplement with Web search</span>
            refined_docs = <span class="hljs-variable language_">self</span>._refine_documents(docs, query)
            web_results = <span class="hljs-variable language_">self</span>._web_search_fallback(query)
            final_context = <span class="hljs-variable language_">self</span>._merge_context(refined_docs, web_results)
        <span class="hljs-keyword">else</span>:
            <span class="hljs-comment"># Retrieval quality is good, only refine the documents</span>
            refined_docs = <span class="hljs-variable language_">self</span>._refine_documents(docs, query)
            final_context = <span class="hljs-variable language_">self</span>._format_internal_docs(refined_docs)

        <span class="hljs-comment"># 4. Put the context into a temporary key, used only for dynamic prompt assembly in the current model call</span>
        state[<span class="hljs-string">&quot;_crag_context&quot;</span>] = final_context
        <span class="hljs-keyword">return</span> state

<span class="hljs-meta">    @dynamic_prompt</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">attach_context</span>(<span class="hljs-params">self, state, prompt_messages: <span class="hljs-type">List</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Inject the CRAG-generated context as a SystemMessage before the prompt for the current model call&quot;&quot;&quot;</span>
        final_context = state.get(<span class="hljs-string">&quot;_crag_context&quot;</span>)
        <span class="hljs-keyword">if</span> final_context:
            sys_msg = SystemMessage(
                content=<span class="hljs-string">f&quot;Here is some relevant background information. Please answer the user&#x27;s question based on this information:\n\n<span class="hljs-subst">{final_context}</span>&quot;</span>
            )
            <span class="hljs-comment"># Applies only to the current call and is not permanently written into state[&quot;messages&quot;]</span>
            prompt_messages = [sys_msg] + prompt_messages
        <span class="hljs-keyword">return</span> prompt_messages

    <span class="hljs-comment"># ======== Internal methods: retrieval / evaluation / refinement / formatting ========</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_retrieve_from_milvus</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Retrieve documents from Milvus (Partition Key + confidence filtering)&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            <span class="hljs-comment"># Note: different adapter versions may place filter parameters differently; here expr is passed through search_kwargs</span>
            docs = <span class="hljs-variable language_">self</span>.vector_store.similarity_search(
                query,
                k=<span class="hljs-number">3</span>,
                search_kwargs={<span class="hljs-string">&quot;expr&quot;</span>: <span class="hljs-string">f&#x27;agent_id == &quot;<span class="hljs-subst">{self.agent_id}</span>&quot;&#x27;</span>}
            )
            <span class="hljs-comment"># Confidence filtering (to avoid low-quality memory contamination)</span>
            filtered_docs = [
                doc <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs
                <span class="hljs-keyword">if</span> (doc.metadata <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;confidence&quot;</span>, <span class="hljs-number">0.0</span>) &gt; <span class="hljs-number">0.7</span>
            ]
            <span class="hljs-keyword">return</span> filtered_docs <span class="hljs-keyword">or</span> docs  <span class="hljs-comment"># If there are no high-confidence results, fall back to the original results for evaluator judgment</span>
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Retrieval failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> []

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_evaluate_relevance</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]:
        <span class="hljs-string">&quot;&quot;&quot;Evaluate document relevance (three-way decision), simplified version: the LLM returns the verdict directly&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;incorrect&quot;</span>

        <span class="hljs-comment"># Evaluate only the Top-3 documents, taking the first 500 characters of each</span>
        doc_content = <span class="hljs-string">&quot;\n\n&quot;</span>.join([
            <span class="hljs-string">f&quot;[Document <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>] <span class="hljs-subst">{(doc.page_content <span class="hljs-keyword">or</span> <span class="hljs-string">&#x27;&#x27;</span>)[:<span class="hljs-number">500</span>]}</span>...&quot;</span>
            <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs[:<span class="hljs-number">3</span>])
        ])

        prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an expert in document relevance evaluation. Assess whether the following documents can answer the query.

Query: <span class="hljs-subst">{query}</span>

Document content:
<span class="hljs-subst">{doc_content}</span>

Evaluation criteria:
- relevant: the document directly contains the answer and is highly relevant
- ambiguous: the document is partially relevant and needs external knowledge
- incorrect: the document is irrelevant and cannot answer the query

Return only one word: relevant or ambiguous or incorrect
&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            result = <span class="hljs-variable language_">self</span>.evaluator.invoke(prompt)
            verdict = (<span class="hljs-built_in">getattr</span>(result, <span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>) <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;&quot;</span>).strip().lower()
            <span class="hljs-keyword">if</span> verdict <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> {<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>}:
                verdict = <span class="hljs-string">&quot;ambiguous&quot;</span>
            <span class="hljs-keyword">return</span> verdict
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Evaluation failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;ambiguous&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_refine_documents</span>(<span class="hljs-params">self, docs: <span class="hljs-built_in">list</span>, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Refine documents (simplified strips: sentence filtering based on keywords)&quot;&quot;&quot;</span>
        refined = []
        <span class="hljs-comment"># Simple Chinese-period replacement + rough English sentence splitting</span>
        keywords = [kw.strip() <span class="hljs-keyword">for</span> kw <span class="hljs-keyword">in</span> query.split() <span class="hljs-keyword">if</span> kw.strip()]

        <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs:
            text = doc.page_content <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;&quot;</span>
            sentences = (
                text.replace(<span class="hljs-string">&quot;。&quot;</span>, <span class="hljs-string">&quot;。\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;. &quot;</span>, <span class="hljs-string">&quot;.\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;! &quot;</span>, <span class="hljs-string">&quot;!\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;? &quot;</span>, <span class="hljs-string">&quot;?\n&quot;</span>)
                    .split(<span class="hljs-string">&quot;\n&quot;</span>)
            )
            sentences = [s.strip() <span class="hljs-keyword">for</span> s <span class="hljs-keyword">in</span> sentences <span class="hljs-keyword">if</span> s.strip()]

            <span class="hljs-comment"># Match any keyword</span>
            relevant_sentences = [
                s <span class="hljs-keyword">for</span> s <span class="hljs-keyword">in</span> sentences
                <span class="hljs-keyword">if</span> <span class="hljs-built_in">any</span>(keyword <span class="hljs-keyword">in</span> s <span class="hljs-keyword">for</span> keyword <span class="hljs-keyword">in</span> keywords)
            ]

            <span class="hljs-keyword">if</span> relevant_sentences:
                refined_text = <span class="hljs-string">&quot;。&quot;</span>.join(relevant_sentences[:<span class="hljs-number">3</span>])
                refined.append(Document(page_content=refined_text, metadata=doc.metadata <span class="hljs-keyword">or</span> {}))

        <span class="hljs-keyword">return</span> refined <span class="hljs-keyword">if</span> refined <span class="hljs-keyword">else</span> docs  <span class="hljs-comment"># If nothing is extracted, fall back to the original documents</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_web_search_fallback</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Web search fallback&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.web_search.invoke(query) <span class="hljs-keyword">or</span> []
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Web search failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> []

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_merge_context</span>(<span class="hljs-params">self, internal_docs: <span class="hljs-built_in">list</span>, web_results: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Merge internal memory and external knowledge into the final context&quot;&quot;&quot;</span>
        parts = []
        <span class="hljs-keyword">if</span> internal_docs:
            parts.append(<span class="hljs-string">&quot;[Internal Memory]&quot;</span>)
            <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(internal_docs, <span class="hljs-number">1</span>):
                parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{doc.page_content}</span>&quot;</span>)
        <span class="hljs-keyword">if</span> web_results:
            parts.append(<span class="hljs-string">&quot;[External Knowledge]&quot;</span>)
            <span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(web_results, <span class="hljs-number">1</span>):
                content = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
                url = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;url&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
                parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{content}</span>\n   Source: <span class="hljs-subst">{url}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts) <span class="hljs-keyword">if</span> parts <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_format_internal_docs</span>(<span class="hljs-params">self, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Format internal documents&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>
        parts = [<span class="hljs-string">&quot;[Internal Memory]&quot;</span>]
        <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs, <span class="hljs-number">1</span>):
            parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{doc.page_content}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts)

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_format_web_results</span>(<span class="hljs-params">self, results: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Format Web search results&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> results:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>
        parts = [<span class="hljs-string">&quot;[External Knowledge]&quot;</span>]
        <span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results, <span class="hljs-number">1</span>):
            content = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
            url = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;url&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
            parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{content}</span>\n   Source: <span class="hljs-subst">{url}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts)


<span class="hljs-comment"># ============ Initialize the Milvus vector database ============</span>
vector_store = Milvus(
    embedding_function=OpenAIEmbeddings(),
    connection_args={<span class="hljs-string">&quot;host&quot;</span>: <span class="hljs-string">&quot;localhost&quot;</span>, <span class="hljs-string">&quot;port&quot;</span>: <span class="hljs-string">&quot;19530&quot;</span>},
    collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>
)

<span class="hljs-comment"># ============ Create Agent ============</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[TavilySearchResults(max_results=<span class="hljs-number">3</span>)],  <span class="hljs-comment"># Web search tool</span>
    middleware=[
        CRAGMiddleware(
            vector_store=vector_store,
            agent_id=<span class="hljs-string">&quot;user_123_session_456&quot;</span>  <span class="hljs-comment"># multi-tenant isolation: each Agent instance uses its own ID</span>
        )
    ]
)

<span class="hljs-comment"># ============ Example run ============</span>
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-comment"># Example query: use HumanMessage to ensure compatibility</span>
    response = agent.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [
            HumanMessage(content=<span class="hljs-string">&quot;What were the operating expenses in Nike&#x27;s latest quarterly earnings report?&quot;</span>)
        ]
    })
    <span class="hljs-built_in">print</span>(response[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>].content)
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p><strong>Note sur la version :</strong> Ce code utilise les dernières fonctionnalités Middleware de LangGraph et LangChain. Ces API peuvent changer au fur et à mesure de l'évolution des frameworks. Consultez la <a href="https://langchain-ai.github.io/langgraph/">documentation de LangGraph</a> pour connaître l'utilisation la plus récente.</p>
</blockquote>
<h3 id="Key-Modules" class="common-anchor-header">Modules clés</h3><p><strong>1. Conception d'un évaluateur de niveau production</strong></p>
<p>La méthode <code translate="no">_evaluate_relevance()</code> dans le code ci-dessus est intentionnellement simplifiée pour des tests rapides. Pour la production, vous aurez besoin d'un résultat structuré avec un score de confiance et des explications :</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pydantic <span class="hljs-keyword">import</span> BaseModel
<span class="hljs-keyword">from</span> langchain.prompts <span class="hljs-keyword">import</span> PromptTemplate

<span class="hljs-keyword">class</span> <span class="hljs-title class_">RelevanceVerdict</span>(<span class="hljs-title class_ inherited__">BaseModel</span>):
    <span class="hljs-string">&quot;&quot;&quot;Structured output for the evaluation result&quot;&quot;&quot;</span>
    verdict: <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]
    confidence: <span class="hljs-built_in">float</span>  <span class="hljs-comment"># confidence score (used for memory quality monitoring)</span>
    reasoning: <span class="hljs-built_in">str</span>     <span class="hljs-comment"># reason for the judgment (used for debugging and review)</span>

<span class="hljs-comment"># Note: the CRAG paper uses a fine-tuned T5-Large evaluator (10-20 ms latency)</span>
<span class="hljs-comment"># Here, gpt-4o-mini is used as the engineering implementation option (easier to deploy, but with slightly higher latency)</span>
grader_llm = ChatOpenAI(model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>, temperature=<span class="hljs-number">0</span>)

grader_prompt = PromptTemplate(
    template=<span class="hljs-string">&quot;&quot;&quot;You are an expert in document relevance evaluation. Assess whether the following documents can answer the query.

Query: {query}

Document content:
{document}

Evaluation criteria:
- relevant: the document directly contains the answer, confidence &gt; 0.9
- ambiguous: the document is partially relevant, confidence 0.5-0.9
- incorrect: the document is irrelevant, confidence &lt; 0.5

Return in JSON format: {{&quot;verdict&quot;: &quot;...&quot;, &quot;confidence&quot;: 0.xx, &quot;reasoning&quot;: &quot;...&quot;}}
&quot;&quot;&quot;</span>,
    input_variables=[<span class="hljs-string">&quot;query&quot;</span>, <span class="hljs-string">&quot;document&quot;</span>]
)

grader_chain = grader_prompt | grader_llm.with_structured_output(RelevanceVerdict)

<span class="hljs-comment"># Replace the _evaluate_relevance() method in CRAGMiddleware</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">_evaluate_relevance</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Evaluate document relevance (returns structured result)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;incorrect&quot;</span>

    <span class="hljs-comment"># Evaluate only the Top-3 documents, taking the first 500 characters of each</span>
    doc_content = <span class="hljs-string">&quot;\n\n&quot;</span>.join([
        <span class="hljs-string">f&quot;[Document <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>] <span class="hljs-subst">{doc.page_content[:<span class="hljs-number">500</span>]}</span>...&quot;</span>
        <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs[:<span class="hljs-number">3</span>])
    ])

    result = grader_chain.invoke({
        <span class="hljs-string">&quot;query&quot;</span>: query,
        <span class="hljs-string">&quot;document&quot;</span>: doc_content
    })

    <span class="hljs-comment"># Store the confidence score in logs or a monitoring system</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG Evaluation] verdict=<span class="hljs-subst">{result.verdict}</span>, confidence=<span class="hljs-subst">{result.confidence:<span class="hljs-number">.2</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG Reasoning] <span class="hljs-subst">{result.reasoning}</span>&quot;</span>)

    <span class="hljs-comment"># Optional: store the evaluation result in Milvus for memory quality analysis</span>
    <span class="hljs-variable language_">self</span>._store_evaluation_metrics(query, result)

    <span class="hljs-keyword">return</span> result.verdict

<span class="hljs-keyword">def</span> <span class="hljs-title function_">_store_evaluation_metrics</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, verdict_result: RelevanceVerdict</span>):
    <span class="hljs-string">&quot;&quot;&quot;Store evaluation metrics in Milvus (for memory quality monitoring)&quot;&quot;&quot;</span>
    <span class="hljs-comment"># Example: store the evaluation result in a separate Collection for analysis</span>
    <span class="hljs-comment"># In actual use, you need to create the evaluation_metrics Collection</span>
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>2. Raffinement des connaissances et repli</strong></p>
<p>Trois mécanismes fonctionnent ensemble pour maintenir un contexte de modèle de haute qualité :</p>
<ul>
<li>L'<strong>affinage des connaissances</strong> permet d'extraire les phrases les plus pertinentes et d'éliminer le bruit.</li>
<li>La<strong>recherche de repli</strong> se déclenche lorsque la récupération locale est insuffisante, en faisant appel à des connaissances externes via Tavily.</li>
<li><strong>La fusion de contexte</strong> combine la mémoire interne et les résultats externes en un seul bloc de contexte dédupliqué avant qu'il n'atteigne le modèle.</li>
</ul>
<h2 id="Tips-for-Running-CRAG-in-Production" class="common-anchor-header">Conseils pour l'exécution de CRAG en production<button data-href="#Tips-for-Running-CRAG-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Trois domaines sont les plus importants une fois que l'on a dépassé le stade du prototypage.</p>
<h3 id="1-Cost-Pick-the-Right-Evaluator" class="common-anchor-header">1. Le coût : Choisir le bon évaluateur</h3><p>L'évaluateur s'exécute sur chaque requête, ce qui en fait le principal levier de latence et de coût.</p>
<ul>
<li><strong>Charges de travail à forte concomitance :</strong> Un modèle léger finement ajusté comme T5-Large maintient la latence à 10-20 ms et les coûts sont prévisibles.</li>
<li><strong>Faible trafic ou prototypage :</strong> Un modèle hébergé comme <code translate="no">gpt-4o-mini</code> est plus rapide à mettre en place et nécessite moins de travail opérationnel, mais la latence et les coûts par appel sont plus élevés.</li>
</ul>
<h3 id="2-Observability-Instrument-from-Day-One" class="common-anchor-header">2. Observabilité : Instrument dès le premier jour</h3><p>Les problèmes de production les plus difficiles à résoudre sont ceux que l'on ne peut voir que lorsque la qualité de la réponse s'est déjà dégradée.</p>
<ul>
<li><strong>Surveillance de l'infrastructure :</strong> Milvus s'intègre à <a href="https://milvus.io/docs/monitor_overview.md">Prometheus</a>. Commencez par trois mesures : <code translate="no">milvus_query_latency_seconds</code>, <code translate="no">milvus_search_qps</code>, et <code translate="no">milvus_insert_throughput</code>.</li>
<li><strong>Surveillance des applications :</strong> Suivez la distribution des verdicts CRAG, le taux de déclenchement des recherches sur le web et la distribution des scores de confiance. Sans ces signaux, vous ne pouvez pas savoir si une baisse de qualité est due à une mauvaise extraction ou à une erreur d'appréciation de l'évaluateur.</li>
</ul>
<h3 id="3-Long-Term-Maintenance-Prevent-Memory-Contamination" class="common-anchor-header">3. Maintenance à long terme : Prévenir la contamination de la mémoire</h3><p>Plus un agent fonctionne longtemps, plus les données périmées et de mauvaise qualité s'accumulent dans la mémoire. Il convient de mettre en place des garde-fous dès le départ :</p>
<ul>
<li><strong>Préfiltrage :</strong> Ne remonter à la surface des mémoires qu'à l'aide du site <code translate="no">confidence &gt; 0.7</code>, afin de bloquer les contenus de mauvaise qualité avant qu'ils n'atteignent l'évaluateur.</li>
<li><strong>Décroissance temporelle :</strong> Réduisez progressivement le poids des mémoires plus anciennes. Trente jours est un délai raisonnable par défaut, qui peut être ajusté en fonction du cas d'utilisation.</li>
<li><strong>Nettoyage programmé :</strong> Exécutez une tâche hebdomadaire pour purger les souvenirs anciens, peu fiables et non vérifiés. Cela permet d'éviter la boucle de rétroaction dans laquelle les données périmées sont récupérées, utilisées et stockées à nouveau.</li>
</ul>
<h2 id="Wrapping-Up--and-a-Few-Common-Questions" class="common-anchor-header">Conclusion - et quelques questions courantes<button data-href="#Wrapping-Up--and-a-Few-Common-Questions" class="anchor-icon" translate="no">
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
    </button></h2><p>CRAG s'attaque à l'un des problèmes les plus persistants dans les RAG de production : les résultats de recherche qui semblent pertinents mais qui ne le sont pas. En insérant une étape d'évaluation et de correction entre la recherche et la génération, il filtre les mauvais résultats, comble les lacunes grâce à la recherche externe et donne au modèle un contexte plus propre pour travailler.</p>
<p>Pour que CRAG fonctionne de manière fiable en production, il faut plus qu'une bonne logique de recherche. Il faut une base de données vectorielle qui gère l'isolation multi-tenant, la recherche hybride et les schémas évolutifs, et c'est là que <a href="https://milvus.io/intro">Milvus</a> entre en jeu. Du côté des applications, le choix du bon évaluateur, l'instrumentation précoce de l'observabilité et la gestion active de la qualité de la mémoire sont les éléments qui distinguent une démo d'un système auquel vous pouvez faire confiance.</p>
<p>Si vous construisez des systèmes RAG ou d'agents et que vous rencontrez des problèmes de qualité de récupération, nous serions ravis de vous aider :</p>
<ul>
<li>Rejoignez la <a href="https://slack.milvus.io/">communauté Milvus Slack</a> pour poser des questions, partager votre architecture et apprendre des autres développeurs qui travaillent sur des problèmes similaires.</li>
<li><a href="https://milvus.io/office-hours">Réservez une session gratuite de 20 minutes de Milvus Office Hours</a> pour étudier votre cas d'utilisation avec l'équipe, qu'il s'agisse de la conception CRAG, de la recherche hybride ou de la mise à l'échelle multi-tenant.</li>
<li>Si vous préférez ignorer la configuration de l'infrastructure et passer directement à la construction, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (géré par Milvus) propose un niveau gratuit pour commencer.</li>
</ul>
<hr>
<p>Quelques questions reviennent souvent lorsque les équipes commencent à mettre en œuvre CRAG :</p>
<p><strong>En quoi CRAG est-il différent de l'ajout d'un reranker à RAG ?</strong></p>
<p>Un reranker réorganise les résultats en fonction de leur pertinence, mais suppose toujours que les documents retrouvés sont utilisables. Le CRAG va plus loin : il évalue si le contenu récupéré répond réellement à la requête et prend des mesures correctives si ce n'est pas le cas : il affine les correspondances partielles, complète la recherche sur le web ou rejette complètement les résultats. Il s'agit d'une boucle de contrôle de la qualité, et pas seulement d'un meilleur tri.</p>
<p><strong>Pourquoi un score de similarité élevé renvoie-t-il parfois le mauvais document ?</strong></p>
<p>La similarité d'intégration mesure la proximité sémantique dans l'espace vectoriel, mais ce n'est pas la même chose que de répondre à la question. Un document sur la configuration de HTTPS sur Apache est sémantiquement proche d'une question sur HTTPS sur Nginx, mais il ne sera d'aucune aide. CRAG détecte ce problème en évaluant la pertinence par rapport à la requête réelle, et pas seulement la distance vectorielle.</p>
<p><strong>Que dois-je rechercher dans une base de données vectorielle pour CRAG ?</strong></p>
<p>Trois éléments sont les plus importants : la recherche hybride (pour que vous puissiez combiner la recherche sémantique avec la correspondance de mots clés pour les termes exacts), l'isolation multi-tenant (pour que chaque session d'utilisateur ou d'agent ait son propre espace mémoire) et un schéma flexible (pour que vous puissiez ajouter des champs tels que <code translate="no">confidence</code> ou <code translate="no">verified</code> sans interruption au fur et à mesure que votre pipeline évolue).</p>
<p><strong>Que se passe-t-il lorsqu'aucun des documents retrouvés n'est pertinent ?</strong></p>
<p>CRAG ne se contente pas d'abandonner. Lorsque le niveau de confiance est inférieur à 0,5, il revient à la recherche sur le web. Lorsque les résultats sont ambigus (0,5-0,9), il fusionne les documents internes affinés avec les résultats de la recherche externe. Le modèle dispose toujours d'un certain contexte pour travailler, même lorsque la base de connaissances présente des lacunes.</p>
