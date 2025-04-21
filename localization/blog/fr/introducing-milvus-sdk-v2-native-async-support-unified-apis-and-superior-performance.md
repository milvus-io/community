---
id: >-
  introducing-milvus-sdk-v2-native-async-support-unified-apis-and-superior-performance.md
title: >-
  Présentation de Milvus SDK v2 : Prise en charge native de l'asynchronisme, API
  unifiées et performances supérieures
author: Ken Zhang
date: 2025-04-16T00:00:00.000Z
desc: >-
  Découvrez Milvus SDK v2, réimaginé pour les développeurs ! Profitez d'une API
  unifiée, d'un support asynchrone natif et de performances accrues pour vos
  projets de recherche vectorielle.
cover: assets.zilliz.com/Introducing_Milvus_SDK_v2_05c9e5e8b2.png
tag: Engineering
tags: 'Milvus SDK v2, Async Support, Milvus vector database'
canonicalUrl: >-
  https://milvus.io/blog/introducing-milvus-sdk-v2-native-async-support-unified-apis-and-superior-performance.md
---
<h2 id="TLDR" class="common-anchor-header">TL;DR<button data-href="#TLDR" class="anchor-icon" translate="no">
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
    </button></h2><p>Vous avez parlé et nous vous avons écouté ! Milvus SDK v2 est une réimagination complète de notre expérience de développeur, construite directement à partir de vos commentaires. Avec une API unifiée pour Python, Java, Go et Node.js, la prise en charge asynchrone native que vous avez demandée, un cache de schéma améliorant les performances et une interface MilvusClient simplifiée, Milvus SDK v2 rend le développement de la <a href="https://zilliz.com/learn/vector-similarity-search">recherche vectorielle</a> plus rapide et plus intuitif que jamais. Que vous construisiez des applications <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>, des systèmes de recommandation ou des solutions de <a href="https://zilliz.com/learn/what-is-computer-vision">vision par ordinateur</a>, cette mise à jour axée sur la communauté transformera la façon dont vous travaillez avec Milvus.</p>
<h2 id="Why-We-Built-It-Addressing-Community-Pain-Points" class="common-anchor-header">Pourquoi nous l'avons créée : Répondre aux problèmes de la communauté<button data-href="#Why-We-Built-It-Addressing-Community-Pain-Points" class="anchor-icon" translate="no">
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
    </button></h2><p>Au fil des ans, Milvus est devenu la <a href="https://milvus.io/blog/what-is-a-vector-database.md">base de données vectorielle de</a> choix pour des milliers d'applications d'IA. Cependant, au fur et à mesure que notre communauté grandissait, nous avons régulièrement entendu parler de plusieurs limitations de notre SDK v1 :</p>
<p><strong>"La gestion d'une concurrence élevée est trop complexe.</strong> L'absence de support asynchrone natif dans certains SDK oblige les développeurs à s'appuyer sur des threads ou des callbacks, ce qui rend le code plus difficile à gérer et à déboguer, en particulier dans des scénarios tels que le chargement de données par lots et les requêtes parallèles.</p>
<p><strong>"Les performances se dégradent avec l'échelle.</strong> Sans cache de schéma, la v1 validait plusieurs fois les schémas pendant les opérations, ce qui créait des goulets d'étranglement pour les charges de travail à fort volume. Dans les cas d'utilisation nécessitant un traitement vectoriel massif, ce problème a entraîné une augmentation de la latence et une réduction du débit.</p>
<p><strong>"Les interfaces incohérentes entre les langages créent une courbe d'apprentissage abrupte".</strong> Les SDK des différentes langues mettaient en œuvre les interfaces à leur manière, ce qui compliquait le développement inter-langues.</p>
<p><strong>"L'API RESTful manque de fonctionnalités essentielles.</strong> Des fonctionnalités essentielles telles que la gestion des partitions et la construction d'index n'étaient pas disponibles, ce qui obligeait les développeurs à passer d'un SDK à l'autre.</p>
<p>Il ne s'agissait pas seulement de demandes de fonctionnalités, mais de véritables obstacles à votre flux de développement. SDK v2 est notre promesse d'éliminer ces obstacles et de vous permettre de vous concentrer sur l'essentiel : créer des applications d'IA étonnantes.</p>
<h2 id="The-Solution-Milvus-SDK-v2" class="common-anchor-header">La solution : Milvus SDK v2<button data-href="#The-Solution-Milvus-SDK-v2" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus SDK v2 est le résultat d'une refonte complète axée sur l'expérience du développeur, disponible dans plusieurs langues :</p>
<ul>
<li><p><a href="https://milvus.io/api-reference/pymilvus/v2.5.x/About.md">SDK Python v2 (pymilvus.MilvusClient)</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-sdk-java">Java v2</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus/tree/client/v2.5.1/client">Go v2</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-sdk-node">NodeJS</a></p></li>
<li><p><a href="https://milvus.io/api-reference/restful/v2.5.x/About.md">RESTful v2</a></p></li>
</ul>
<h3 id="1-Native-Asynchronous-Support-From-Complex-to-Concurrent" class="common-anchor-header">1. Support asynchrone natif : De la complexité à la simultanéité</h3><p>L'ancienne façon de gérer la concurrence impliquait des objets Future encombrants et des modèles de rappel. La version 2 du SDK introduit une véritable fonctionnalité asynchrone/attente, en particulier dans Python avec <code translate="no">AsyncMilvusClient</code> (depuis la version 2.5.3). Avec les mêmes paramètres que le MilvusClient synchrone, vous pouvez facilement exécuter des opérations telles que l'insertion, l'interrogation et la recherche en parallèle.</p>
<p>Cette approche simplifiée remplace les anciens modèles encombrants de Future et de callback, ce qui permet d'obtenir un code plus propre et plus efficace. La logique concurrente complexe, comme les insertions de vecteurs par lots ou les requêtes multiples parallèles, peut désormais être mise en œuvre sans effort à l'aide d'outils tels que <code translate="no">asyncio.gather</code>.</p>
<h3 id="2-Schema-Cache-Boosting-Performance-Where-It-Counts" class="common-anchor-header">2. Schema Cache : Accroître les performances là où cela compte</h3><p>Le SDK v2 introduit un cache de schéma qui stocke les schémas de collection localement après la recherche initiale, éliminant ainsi les requêtes réseau répétées et la surcharge de l'unité centrale pendant les opérations.</p>
<p>Pour les scénarios d'insertion et d'interrogation à haute fréquence, cette mise à jour se traduit par :</p>
<ul>
<li><p>une réduction du trafic réseau entre le client et le serveur</p></li>
<li><p>Une latence plus faible pour les opérations</p></li>
<li><p>Diminution de l'utilisation de l'unité centrale côté serveur</p></li>
<li><p>une meilleure mise à l'échelle en cas de forte concurrence.</p></li>
</ul>
<p>Ces avantages sont particulièrement précieux pour les applications telles que les systèmes de recommandation en temps réel ou les fonctions de recherche en direct, pour lesquelles les millisecondes comptent.</p>
<h3 id="3-A-Unified-and-Streamlined-API-Experience" class="common-anchor-header">3. Une expérience API unifiée et rationalisée</h3><p>Milvus SDK v2 introduit une expérience API unifiée et plus complète dans tous les langages de programmation pris en charge. En particulier, l'API RESTful a été considérablement améliorée pour offrir une quasi-parité de fonctionnalités avec l'interface gRPC.</p>
<p>Dans les versions précédentes, l'API RESTful était à la traîne par rapport à gRPC, ce qui limitait ce que les développeurs pouvaient faire sans changer d'interface. Ce n'est plus le cas. Désormais, les développeurs peuvent utiliser l'API RESTful pour effectuer pratiquement toutes les opérations de base, telles que la création de collections, la gestion des partitions, la création d'index et l'exécution de requêtes, sans avoir à recourir à gRPC ou à d'autres méthodes.</p>
<p>Cette approche unifiée garantit aux développeurs une expérience cohérente dans différents environnements et cas d'utilisation. Elle réduit la courbe d'apprentissage, simplifie l'intégration et améliore la convivialité générale.</p>
<p>Remarque : pour la plupart des utilisateurs, l'API RESTful offre un moyen plus rapide et plus facile de démarrer avec Milvus. Toutefois, si votre application exige des performances élevées ou des fonctionnalités avancées telles que les itérateurs, le client gRPC reste l'option de choix pour un maximum de flexibilité et de contrôle.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RES_Tful_8520a80a8e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="4-Aligned-SDK-Design-Across-All-Languages" class="common-anchor-header">4. Conception harmonisée du SDK dans toutes les langues</h3><p>Avec Milvus SDK v2, nous avons normalisé la conception de nos SDK dans tous les langages de programmation pris en charge afin d'offrir aux développeurs une expérience plus cohérente.</p>
<p>Que vous construisiez avec Python, Java, Go ou Node.js, chaque SDK suit désormais une structure unifiée centrée sur la classe MilvusClient. Cette refonte apporte une cohérence dans le nommage des méthodes, le formatage des paramètres et les schémas d'utilisation généraux pour chaque langage que nous prenons en charge. (Voir : <a href="https://github.com/milvus-io/milvus/discussions/33979">Mise à jour de l'exemple de code du SDK MilvusClient - Discussion GitHub #33979</a>)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_Client_9a4a6da9e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Désormais, une fois que vous êtes familiarisé avec Milvus dans une langue, vous pouvez facilement passer à une autre sans avoir à réapprendre le fonctionnement du SDK. Cet alignement simplifie non seulement l'intégration, mais rend également le développement multilingue beaucoup plus fluide et intuitif.</p>
<h3 id="5-A-Simpler-Smarter-PyMilvus-Python-SDK-with-MilvusClient" class="common-anchor-header">5. Un PyMilvus (SDK Python) plus simple et plus intelligent avec <code translate="no">MilvusClient</code></h3><p>Dans la version précédente, PyMilvus s'appuyait sur une conception de type ORM qui introduisait un mélange d'approches orientées objet et procédurales. Les développeurs devaient définir des objets <code translate="no">FieldSchema</code>, construire une classe <code translate="no">CollectionSchema</code>, puis instancier une classe <code translate="no">Collection</code> - tout cela pour créer une collection. Ce processus était non seulement fastidieux, mais il entraînait également une courbe d'apprentissage plus abrupte pour les nouveaux utilisateurs.</p>
<p>Avec la nouvelle interface <code translate="no">MilvusClient</code>, les choses sont beaucoup plus simples. Vous pouvez désormais créer une collection en une seule étape à l'aide de la méthode <code translate="no">create_collection()</code>. Elle vous permet de définir rapidement le schéma en passant des paramètres tels que <code translate="no">dimension</code> et <code translate="no">metric_type</code>, ou vous pouvez toujours utiliser un objet de schéma personnalisé si nécessaire.</p>
<p>Mieux encore, <code translate="no">create_collection()</code> prend en charge la création d'index dans le cadre du même appel. Si des paramètres d'index sont fournis, Milvus construit automatiquement l'index et charge les données en mémoire, sans qu'il soit nécessaire d'effectuer des appels <code translate="no">create_index()</code> ou <code translate="no">load()</code> distincts. Une seule méthode permet de tout faire : <em>créer une collection → construire un index → charger une collection.</em></p>
<p>Cette approche rationalisée réduit la complexité de la configuration et facilite grandement le démarrage de Milvus, en particulier pour les développeurs qui souhaitent un chemin rapide et efficace vers le prototypage ou la production.</p>
<p>Le nouveau module <code translate="no">MilvusClient</code> offre des avantages évidents en termes de convivialité, de cohérence et de performances. Bien que l'ancienne interface ORM reste disponible pour l'instant, nous prévoyons de la supprimer progressivement à l'avenir (voir <a href="https://docs.zilliz.com/reference/python/ORM#:~:text=About%20to%20Deprecate">référence</a>). Nous recommandons vivement la mise à jour vers le nouveau SDK pour profiter pleinement des améliorations.</p>
<h3 id="6-Clearer-and-More-Comprehensive-Documentation" class="common-anchor-header">6. Documentation plus claire et plus complète</h3><p>Nous avons restructuré la documentation du produit afin de fournir une <a href="https://milvus.io/docs">référence API</a> plus complète et plus claire. Nos guides de l'utilisateur comprennent désormais des exemples de code multilingues, ce qui vous permet de démarrer rapidement et de comprendre facilement les fonctionnalités de Milvus. En outre, l'assistant Ask AI disponible sur notre site de documentation peut présenter de nouvelles fonctionnalités, expliquer des mécanismes internes et même aider à générer ou à modifier des exemples de code, ce qui rend votre parcours dans la documentation plus fluide et plus agréable.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ask_AI_Assistant_b044d4621a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="7-Milvus-MCP-Server-Designed-for-the-Future-of-AI-Integration" class="common-anchor-header">7. Milvus MCP Server : Conçu pour l'avenir de l'intégration de l'IA</h3><p>Le <a href="https://github.com/zilliztech/mcp-server-milvus">serveur MCP</a>, construit au-dessus du SDK Milvus, est notre réponse à un besoin croissant dans l'écosystème de l'IA : l'intégration transparente entre les grands modèles de langage<a href="https://zilliz.com/glossary/large-language-models-(llms)">(LLM)</a>, les <a href="https://milvus.io/blog/what-is-a-vector-database.md">bases de données vectorielles</a> et les outils ou sources de données externes. Il met en œuvre le protocole de contexte de modèle (MCP), fournissant une interface unifiée et intelligente pour orchestrer les opérations Milvus et au-delà.</p>
<p>À mesure que <a href="https://zilliz.com/blog/top-10-ai-agents-to-watch-in-2025">les agents d'intelligence artificielle</a> gagnent en capacité - non seulement en générant du code, mais aussi en gérant de manière autonome des services dorsaux - la demande d'une infrastructure plus intelligente, axée sur les API, augmente. Le serveur MCP a été conçu en tenant compte de cet avenir. Il permet des interactions intelligentes et automatisées avec les clusters Milvus, en rationalisant des tâches telles que le déploiement, la maintenance et la gestion des données.</p>
<p>Plus important encore, il jette les bases d'un nouveau type de collaboration entre machines. Avec le serveur MCP, les agents d'intelligence artificielle peuvent appeler des API pour créer dynamiquement des collections, exécuter des requêtes, créer des index et bien plus encore, le tout sans intervention humaine.</p>
<p>En bref, le serveur MCP transforme Milvus non pas en une simple base de données, mais en un backend entièrement programmable et prêt pour l'IA, ouvrant la voie à des applications intelligentes, autonomes et évolutives.</p>
<h2 id="Getting-Started-with-Milvus-SDK-v2-Sample-Code" class="common-anchor-header">Démarrage avec Milvus SDK v2 : Exemples de code<button data-href="#Getting-Started-with-Milvus-SDK-v2-Sample-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Les exemples ci-dessous montrent comment utiliser la nouvelle interface PyMilvus (Python SDK v2) pour créer une collection et effectuer des opérations asynchrones. Comparé à l'approche de type ORM de la version précédente, ce code est plus propre, plus cohérent et plus facile à utiliser.</p>
<h3 id="1-Creating-a-Collection-Defining-Schemas-Building-Indexes-and-Loading-Data-with-MilvusClient" class="common-anchor-header">1. Création d'une collection, définition de schémas, construction d'index et chargement de données à l'aide de l'interface Python <code translate="no">MilvusClient</code></h3><p>L'extrait de code Python ci-dessous montre comment créer une collection, définir son schéma, créer des index et charger des données, le tout en un seul appel :</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

<span class="hljs-comment"># 1. Connect to Milvus (initialize the client)</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># 2. Define the collection schema</span>
schema = MilvusClient.create_schema(auto_id=<span class="hljs-literal">False</span>, description=<span class="hljs-string">&quot;schema for example collection&quot;</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)  <span class="hljs-comment"># Primary key field</span>
schema.add_field(<span class="hljs-string">&quot;embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">128</span>)  <span class="hljs-comment"># Vector field</span>

<span class="hljs-comment"># 3. Prepare index parameters (optional if indexing at creation time)</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;L2&quot;</span>
)

<span class="hljs-comment"># 4. Create the collection with indexes and load it into memory automatically</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;example_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Collection created and loaded with index!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Le paramètre <code translate="no">index_params</code> de la méthode <code translate="no">create_collection</code> élimine le besoin d'appels distincts pour <code translate="no">create_index</code> et <code translate="no">load_collection</code>- tout se fait automatiquement.</p>
<p>En outre, <code translate="no">MilvusClient</code> prend en charge un mode de création rapide de tables. Par exemple, une collection peut être créée en une seule ligne de code en spécifiant uniquement les paramètres requis :</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_collection</span>(
    collection_name=<span class="hljs-string">&quot;test_collection&quot;</span>,
    dimension=<span class="hljs-number">128</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><em>(Note de comparaison : dans l'ancienne approche ORM, vous deviez créer un <code translate="no">Collection(schema)</code>, puis appeler séparément <code translate="no">collection.create_index()</code> et <code translate="no">collection.load()</code>; maintenant, MilvusClient rationalise l'ensemble du processus).</em></p>
<h3 id="2-Performing-High-Concurrency-Asynchronous-Inserts-with-AsyncMilvusClient" class="common-anchor-header">2. Exécution d'insertions asynchrones à haute concordance avec le logiciel MilvusClient <code translate="no">AsyncMilvusClient</code></h3><p>L'exemple suivant montre comment utiliser <code translate="no">AsyncMilvusClient</code> pour effectuer des opérations d'insertion simultanées à l'aide de <code translate="no">async/await</code>:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> AsyncMilvusClient

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">insert_vectors_concurrently</span>():
    client = AsyncMilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
    
    vectors_to_insert = [[...], [...], ...]  <span class="hljs-comment"># Assume 100,000 vectors</span>
    batch_size = <span class="hljs-number">1000</span>  <span class="hljs-comment"># Recommended batch size</span>
    tasks = []

    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(vectors_to_insert), batch_size):
        batch_vectors = vectors_to_insert[i:i+batch_size]

        <span class="hljs-comment"># Construct batch data</span>
        data = [
            <span class="hljs-built_in">list</span>(<span class="hljs-built_in">range</span>(i, i + <span class="hljs-built_in">len</span>(batch_vectors))),  <span class="hljs-comment"># Batch IDs</span>
            batch_vectors  <span class="hljs-comment"># Batch vectors</span>
        ]

        <span class="hljs-comment"># Add an asynchronous task for inserting each batch</span>
        tasks.append(client.insert(<span class="hljs-string">&quot;example_collection&quot;</span>, data=data))

    <span class="hljs-comment"># Concurrently execute batch inserts</span>
    insert_results = <span class="hljs-keyword">await</span> asyncio.gather(*tasks)
    <span class="hljs-keyword">await</span> client.close()

<span class="hljs-comment"># Execute asynchronous tasks</span>
asyncio.run(insert_vectors_concurrently())
<button class="copy-code-btn"></button></code></pre>
<p>Dans cet exemple, <code translate="no">AsyncMilvusClient</code> est utilisé pour insérer simultanément des données en planifiant plusieurs tâches d'insertion avec <code translate="no">asyncio.gather</code>. Cette approche tire pleinement parti des capacités de traitement simultané du backend de Milvus. Contrairement aux insertions synchrones, ligne par ligne, de la version 1, cette prise en charge asynchrone native augmente considérablement le débit.</p>
<p>De même, vous pouvez modifier le code pour effectuer des requêtes ou des recherches simultanées, par exemple en remplaçant l'appel d'insertion par <code translate="no">client.search(&quot;example_collection&quot;, data=[query_vec], limit=5)</code>. L'interface asynchrone du SDK Milvus v2 garantit que chaque requête est exécutée de manière non bloquante, ce qui permet d'exploiter pleinement les ressources du client et du serveur.</p>
<h2 id="Migration-Made-Easy" class="common-anchor-header">Une migration facilitée<button data-href="#Migration-Made-Easy" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous savons que vous avez investi du temps dans le SDK v1, c'est pourquoi nous avons conçu le SDK v2 en tenant compte de vos applications existantes. Le SDK v2 inclut une compatibilité ascendante, de sorte que les interfaces existantes de type v1/ORM continueront à fonctionner pendant un certain temps. Mais nous recommandons vivement de passer au SDK v2 dès que possible, car la prise en charge de la v1 prendra fin avec la publication de Milvus 3.0 (fin 2025).</p>
<p>Le passage au SDK v2 permet de bénéficier d'une expérience de développement plus cohérente et plus moderne, avec une syntaxe simplifiée, une meilleure prise en charge de l'asynchronisme et des performances améliorées. C'est également sur ce SDK que se concentreront toutes les nouvelles fonctionnalités et le support de la communauté à l'avenir. En effectuant la mise à niveau dès maintenant, vous êtes prêt pour la suite et vous avez accès à ce que Milvus a de mieux à offrir.</p>
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
    </button></h2><p>Milvus SDK v2 apporte des améliorations significatives par rapport à v1 : des performances accrues, une interface unifiée et cohérente dans plusieurs langages de programmation et une prise en charge asynchrone native qui simplifie les opérations à haute teneur en devises. Avec une documentation plus claire et des exemples de code plus intuitifs, Milvus SDK v2 est conçu pour rationaliser votre processus de développement, en facilitant et en accélérant la création et le déploiement d'applications d'IA.</p>
<p>Pour des informations plus détaillées, veuillez vous référer à notre dernière <a href="https://milvus.io/docs/install-pymilvus.md#Install-Milvus-Python-SDK">référence API</a> officielle <a href="https://milvus.io/docs/install-pymilvus.md#Install-Milvus-Python-SDK">et à nos guides de l'utilisateur</a>. Si vous avez des questions ou des suggestions concernant le nouveau SDK, n'hésitez pas à nous faire part de vos commentaires sur <a href="https://github.com/milvus-io/milvus/discussions">GitHub</a> et <a href="https://discord.com/invite/8uyFbECzPX">Discord</a>. Nous attendons avec impatience vos commentaires pour continuer à améliorer Milvus.</p>
