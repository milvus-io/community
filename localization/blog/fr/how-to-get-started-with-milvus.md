---
id: how-to-get-started-with-milvus.md
title: Comment démarrer avec Milvus
author: Ruben Winastwan
date: 2025-01-17T00:00:00.000Z
cover: >-
  assets.zilliz.com/How_To_Get_Started_With_Milvus_20230517_084248_28560b1efc.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: false
canonicalUrl: 'https://milvus.io/blog/how-to-get-started-with-milvus.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_To_Get_Started_With_Milvus_20230517_084248_28560b1efc.png" alt="How to get started with Milvus" class="doc-image" id="how-to-get-started-with-milvus" />
   </span> <span class="img-wrapper"> <span>Comment démarrer avec Milvus</span> </span></p>
<p><strong><em>Dernière mise à jour : janvier 2025</em></strong></p>
<p>Les progrès des grands modèles linguistiques<a href="https://zilliz.com/glossary/large-language-models-(llms)">(LLM)</a> et le volume croissant de données nécessitent une infrastructure flexible et évolutive pour stocker des quantités massives d'informations, telle qu'une base de données. Cependant, les <a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">bases de données traditionnelles</a> sont conçues pour stocker des données tabulaires et structurées, alors que les informations généralement utiles pour tirer parti de la puissance des grands modèles linguistiques et des algorithmes de recherche d'informations <a href="https://zilliz.com/learn/introduction-to-unstructured-data">ne</a> sont <a href="https://zilliz.com/learn/introduction-to-unstructured-data">pas structurées</a>, comme le texte, les images, les vidéos ou le son.</p>
<p>Les<a href="https://zilliz.com/learn/what-is-vector-database">bases de données vectorielles</a> sont des systèmes de base de données spécialement conçus pour les données non structurées. Les bases de données vectorielles permettent non seulement de stocker des quantités massives de données non structurées, mais aussi d'effectuer des <a href="https://zilliz.com/learn/vector-similarity-search">recherches vectorielles</a>. Les bases de données vectorielles disposent de méthodes d'indexation avancées telles que l'index de fichier inversé (IVFFlat) ou le petit monde hiérarchique navigable<a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">(HNSW)</a> pour effectuer des recherches vectorielles et des processus de récupération d'informations rapides et efficaces.</p>
<p><strong>Milvus</strong> est une base de données vectorielles open-source que nous pouvons utiliser pour tirer parti de toutes les fonctionnalités avantageuses qu'une base de données vectorielles peut offrir. Voici ce que nous allons aborder dans ce billet :</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#What-is-Milvus">Vue d'ensemble de Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Milvus-Deployment-Options">Options de déploiement de Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Getting-Started-with-Milvus-Lite">Démarrer avec Milvus Lite</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Getting-Started-with-Milvus-Standalone">Démarrer avec Milvus Standalone</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Fully-Managed-Milvus">Milvus entièrement géré </a></p></li>
</ul>
<h2 id="What-is-Milvus" class="common-anchor-header">Qu'est-ce que Milvus ?<button data-href="#What-is-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/overview.md"><strong>Milvus</strong> </a><a href="https://milvus.io/docs/overview.md">est </a>une base de données vectorielle open-source qui nous permet de stocker des quantités massives de données non structurées et d'effectuer des recherches vectorielles rapides et efficaces. Milvus est très utile pour de nombreuses applications GenAI populaires, telles que les systèmes de recommandation, les chatbots personnalisés, la détection d'anomalies, la recherche d'images, le traitement du langage naturel et la génération augmentée de recherche<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG)</a>.</p>
<p>L'utilisation de Milvus comme base de données vectorielles présente plusieurs avantages :</p>
<ul>
<li><p>Milvus offre plusieurs options de déploiement que vous pouvez choisir en fonction de votre cas d'utilisation et de la taille des applications que vous souhaitez créer.</p></li>
<li><p>Milvus prend en charge un large éventail de méthodes d'indexation pour répondre à divers besoins en matière de données et de performances, notamment des options en mémoire telles que FLAT, IVFFlat, HNSW et <a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">SCANN</a>, des variantes quantifiées pour l'efficacité de la mémoire, <a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN</a> sur disque pour les grands ensembles de données et des index optimisés pour les GPU tels que GPU_CAGRA, GPU_IVF_FLAT et GPU_IVF_PQ pour des recherches accélérées et efficaces au niveau de la mémoire.</p></li>
<li><p>Milvus propose également la recherche hybride, qui permet d'utiliser une combinaison d'encastrements denses, d'encastrements épars et de filtrage des métadonnées pendant les opérations de recherche vectorielle, ce qui permet d'obtenir des résultats de recherche plus précis. En outre, <a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus 2.5</a> prend désormais en charge une <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">recherche</a> hybride en <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">texte intégral</a> et une recherche vectorielle, ce qui rend la recherche encore plus précise.</p></li>
<li><p>Milvus peut être entièrement utilisé sur le cloud via <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, où vous pouvez optimiser ses coûts opérationnels et sa vitesse de recherche vectorielle grâce à quatre fonctionnalités avancées : clusters logiques, désagrégation des données historiques et en continu, stockage hiérarchisé, mise à l'échelle automatique et séparation chaud-froid multi-tenant.</p></li>
</ul>
<p>Lorsque vous utilisez Milvus comme base de données vectorielle, vous pouvez choisir trois options de déploiement différentes, chacune ayant ses points forts et ses avantages. Nous aborderons chacune d'entre elles dans la section suivante.</p>
<h2 id="Milvus-Deployment-Options" class="common-anchor-header">Options de déploiement de Milvus<button data-href="#Milvus-Deployment-Options" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour commencer à utiliser Milvus, vous avez le choix entre quatre options de déploiement : <strong>Milvus Lite, Milvus Standalone, Milvus Distributed et Zilliz Cloud (Milvus géré).</strong> Chaque option de déploiement est conçue pour s'adapter à différents scénarios dans notre cas d'utilisation, tels que la taille de nos données, l'objectif de notre application et l'échelle de notre application.</p>
<h3 id="Milvus-Lite" class="common-anchor-header">Milvus Lite</h3><p>Milvus<a href="https://milvus.io/docs/quickstart.md"><strong>Lite</strong></a> est une version légère de Milvus et la manière la plus simple de commencer. Dans la section suivante, nous verrons comment exécuter Milvus Lite en action, et tout ce que nous devons faire pour commencer est d'installer la bibliothèque Pymilvus avec pip. Après cela, nous pouvons exécuter la plupart des fonctionnalités de base de Milvus en tant que base de données vectorielle.</p>
<p>Milvus Lite est parfait pour le prototypage rapide ou l'apprentissage et peut être exécuté dans un notebook Jupyter sans aucune configuration compliquée. En termes de stockage vectoriel, Milvus Lite permet de stocker jusqu'à un million d'embeddings vectoriels. En raison de sa légèreté et de sa capacité de stockage, Milvus Lite est une option de déploiement parfaite pour travailler avec des appareils périphériques, tels que le moteur de recherche de documents privés, la détection d'objets sur l'appareil, etc.</p>
<h3 id="Milvus-Standalone" class="common-anchor-header">Milvus Standalone</h3><p>Milvus Standalone est un déploiement de serveur à machine unique emballé dans une image Docker. Par conséquent, tout ce que nous devons faire pour commencer est d'installer Milvus dans Docker, puis de démarrer le conteneur Docker. Nous verrons également la mise en œuvre détaillée de Milvus Standalone dans la section suivante.</p>
<p>Milvus Standalone est idéal pour la construction et la production d'applications à petite et moyenne échelle, car il est capable de stocker jusqu'à 10 millions d'embeddings vectoriels. En outre, Milvus Standalone offre une haute disponibilité grâce à un mode de sauvegarde primaire, ce qui le rend très fiable pour une utilisation dans des applications prêtes pour la production.</p>
<p>Nous pouvons également utiliser Milvus Standalone, par exemple, après avoir effectué un prototypage rapide et appris les fonctionnalités de Milvus avec Milvus Lite, car Milvus Standalone et Milvus Lite partagent la même API côté client.</p>
<h3 id="Milvus-Distributed" class="common-anchor-header">Milvus Distribué</h3><p>Milvus Distributed est une option de déploiement qui tire parti d'une architecture basée sur le cloud, où l'ingestion et la récupération des données sont traitées séparément, ce qui permet d'obtenir une application hautement évolutive et efficace.</p>
<p>Pour exécuter Milvus Distributed, nous devons généralement utiliser un cluster Kubernetes pour permettre au conteneur de s'exécuter sur plusieurs machines et environnements. L'application d'un cluster Kubernetes garantit l'évolutivité et la flexibilité de Milvus Distributed en personnalisant les ressources allouées en fonction de la demande et de la charge de travail. Cela signifie également que si une partie tombe en panne, d'autres peuvent prendre le relais, garantissant ainsi que l'ensemble du système reste ininterrompu.</p>
<p>Milvus Distributed est capable de traiter jusqu'à des dizaines de milliards de vecteurs intégrés et est spécialement conçu pour les cas d'utilisation où les données sont trop volumineuses pour être stockées dans une seule machine serveur. Par conséquent, cette option de déploiement est parfaite pour les clients d'entreprise qui desservent une large base d'utilisateurs.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Vector_embedding_storage_capability_of_different_Milvus_deployment_options_e3959ccfcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure : Capacité de stockage de l'intégration vectorielle des différentes options de déploiement de Milvus.</em></p>
<p>Dans cet article, nous allons vous montrer comment démarrer avec Milvus Lite et Milvus Standalone, car vous pouvez démarrer rapidement avec ces deux méthodes sans configuration compliquée. Milvus Distribué est toutefois plus compliqué à configurer. Une fois Milvus Distribué configuré, le code et le processus logique pour créer des collections, ingérer des données, effectuer une recherche vectorielle, etc. sont similaires à ceux de Milvus Lite et Milvus Standalone, car ils partagent la même API côté client.</p>
<p>En plus des trois options de déploiement mentionnées ci-dessus, vous pouvez également essayer le Milvus géré sur <a href="https://zilliz.com/cloud">Zilliz Cloud</a> pour une expérience sans tracas. Nous parlerons également de Zilliz Cloud plus loin dans cet article.</p>
<h2 id="Getting-Started-with-Milvus-Lite" class="common-anchor-header">Démarrer avec Milvus Lite<button data-href="#Getting-Started-with-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Lite peut être mis en œuvre directement avec Python en important une bibliothèque appelée Pymilvus à l'aide de pip. Avant d'installer Pymilvus, assurez-vous que votre environnement répond aux exigences suivantes :</p>
<ul>
<li><p>Ubuntu &gt;= 20.04 (x86_64 et arm64)</p></li>
<li><p>MacOS &gt;= 11.0 (Apple Silicon M1/M2 et x86_64)</p></li>
<li><p>Python 3.7 ou supérieur</p></li>
</ul>
<p>Une fois ces conditions remplies, vous pouvez installer Milvus Lite et les dépendances nécessaires à la démonstration à l'aide de la commande suivante :</p>
<pre><code translate="no">!pip install -U pymilvus
!pip install <span class="hljs-string">&quot;pymilvus[model]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><p><code translate="no">!pip install -U pymilvus</code>: Cette commande installe ou met à jour la bibliothèque <code translate="no">pymilvus</code>, le SDK Python de Milvus. Milvus Lite est fourni avec PyMilvus, de sorte que cette simple ligne de code est tout ce dont vous avez besoin pour installer Milvus Lite.</p></li>
<li><p><code translate="no">!pip install &quot;pymilvus[model]&quot;</code>: Cette commande ajoute des fonctionnalités avancées et des outils supplémentaires pré-intégrés dans Milvus, notamment des modèles d'apprentissage automatique tels que Hugging Face Transformers, les modèles d'intégration Jina AI et les modèles de reranking.</p></li>
</ul>
<p>Voici les étapes que nous allons suivre avec Milvus Lite :</p>
<ol>
<li><p>Transformer les données textuelles en leur représentation d'intégration à l'aide d'un modèle d'intégration.</p></li>
<li><p>Créer un schéma dans notre base de données Milvus pour stocker nos données textuelles et leurs représentations d'intégration.</p></li>
<li><p>Stocker et indexer nos données dans notre schéma.</p></li>
<li><p>Effectuer une recherche vectorielle simple sur les données stockées.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Workflow_of_vector_search_operation_3e38ccc1f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure : Déroulement de l'opération de recherche vectorielle.</em></p>
<p>Pour transformer les données textuelles en embeddings vectoriels, nous utiliserons un <a href="https://zilliz.com/ai-models">modèle d'embedding</a> de SentenceTransformers appelé 'all-MiniLM-L6-v2'. Ce modèle d'intégration transforme notre texte en une intégration vectorielle à 384 dimensions. Chargeons le modèle, transformons nos données textuelles et rassemblons le tout.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model

docs = [
    <span class="hljs-string">&quot;Artificial intelligence was founded as an academic discipline in 1956.&quot;</span>,
    <span class="hljs-string">&quot;Alan Turing was the first person to conduct substantial research in AI.&quot;</span>,
    <span class="hljs-string">&quot;Born in Maida Vale, London, Turing was raised in southern England.&quot;</span>,
]

sentence_transformer_ef = model.dense.SentenceTransformerEmbeddingFunction(
    model_name=<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>, 
    device=<span class="hljs-string">&#x27;cpu&#x27;</span> 
)

vectors  = sentence_transformer_ef.encode_documents(docs)
data = [ {<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: vectors[i], <span class="hljs-string">&quot;text&quot;</span>: docs[i]} <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(vectors)) ]
<button class="copy-code-btn"></button></code></pre>
<p>Ensuite, créons un schéma pour stocker toutes les données ci-dessus dans Milvus. Comme vous pouvez le voir ci-dessus, nos données se composent de trois champs : ID, vecteur et texte. Nous allons donc créer un schéma avec ces trois champs.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">True</span>,
)

<span class="hljs-comment"># Add fields to schema</span>
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;vector&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">384</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Avec Milvus Lite, nous pouvons facilement créer une collection sur une base de données particulière basée sur le schéma défini ci-dessus, ainsi qu'insérer et indexer les données dans la collection en quelques lignes de code seulement.</p>
<pre><code translate="no" class="language-python">client = MilvusClient(<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)

index_params = client.prepare_index_params()

<span class="hljs-comment">#  Add indexes</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>, 
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-comment"># Insert data into collection</span>
res = client.insert(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=data
)
<button class="copy-code-btn"></button></code></pre>
<p>Dans le code ci-dessus, nous créons une collection appelée &quot;demo_collection&quot; dans une base de données Milvus appelée &quot;milvus_demo&quot;. Ensuite, nous indexons toutes nos données dans la "demo_collection" que nous venons de créer.</p>
<p>Maintenant que nos données se trouvent dans la base de données, nous pouvons effectuer une recherche vectorielle sur celles-ci pour n'importe quelle requête donnée. Supposons que nous ayons une requête :<em>&quot;Qui est Alan Turing ?</em>&quot;. Nous pouvons obtenir la réponse la plus appropriée à la requête en suivant les étapes suivantes :</p>
<ol>
<li><p>Transformer notre requête en un vecteur intégré en utilisant le même modèle d'intégration que celui que nous avons utilisé pour transformer nos données dans la base de données en vecteurs intégrés.</p></li>
<li><p>Calculer la similarité entre l'intégration de notre requête et l'intégration de chaque entrée de la base de données à l'aide de mesures telles que la similarité cosinusoïdale ou la distance euclidienne.</p></li>
<li><p>Récupérer l'entrée la plus similaire comme réponse appropriée à notre requête.</p></li>
</ol>
<p>Vous trouverez ci-dessous la mise en œuvre des étapes ci-dessus avec Milvus :</p>
<pre><code translate="no" class="language-python">query = [<span class="hljs-string">&quot;Who is Alan Turing&quot;</span>]
query_embedding = sentence_transformer_ef.encode_queries(query)

<span class="hljs-comment"># Load collection</span>
client.load_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>
)

<span class="hljs-comment"># Vector search</span>
res = client.search(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=query_embedding,
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<span class="hljs-built_in">print</span>(res)
<span class="hljs-string">&quot;&quot;&quot;
Output:
data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.7199002504348755, &#x27;entity&#x27;: {&#x27;text&#x27;: &#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;}}]&quot;] 
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Et c'est tout ! Vous pouvez également en savoir plus sur les autres fonctionnalités offertes par Milvus, telles que la gestion des bases de données, l'insertion et la suppression de collections, le choix de la bonne méthode d'indexation et l'exécution de recherches vectorielles plus avancées avec le filtrage des métadonnées et la recherche hybride dans la <a href="https://milvus.io/docs/">documentation de Milvus</a>.</p>
<h2 id="Getting-Started-with-Milvus-Standalone" class="common-anchor-header">Démarrage avec Milvus Standalone<button data-href="#Getting-Started-with-Milvus-Standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Standalone est une option de déploiement dans laquelle tout est emballé dans un conteneur Docker. Par conséquent, nous devons installer Milvus dans Docker, puis démarrer le conteneur Docker pour commencer à utiliser Milvus Standalone.</p>
<p>Avant d'installer Milvus Standalone, assurez-vous que votre matériel et vos logiciels répondent aux exigences décrites sur <a href="https://milvus.io/docs/prerequisite-docker.md">cette page</a>. Assurez-vous également que vous avez installé Docker. Pour installer Docker, reportez-vous à <a href="https://docs.docker.com/get-started/get-docker/">cette page</a>.</p>
<p>Une fois que notre système remplit les conditions requises et que nous avons installé Docker, nous pouvons procéder à l'installation de Milvus dans Docker à l'aide de la commande suivante :</p>
<pre><code translate="no" class="language-shell"><span class="hljs-comment"># Download the installation script</span>
$ curl -sfL &lt;https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh&gt; -o standalone_embed.sh

<span class="hljs-comment"># Start the Docker container</span>
$ bash standalone_embed.sh start
<button class="copy-code-btn"></button></code></pre>
<p>Dans le code ci-dessus, nous démarrons également le conteneur Docker et une fois qu'il est démarré, vous obtiendrez un résultat similaire à celui ci-dessous :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Message_after_successful_starting_of_the_Docker_container_5c60fa15dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure : Message après le démarrage réussi du conteneur Docker.</em></p>
<p>Après avoir exécuté le script d'installation "standalone_embed.sh" ci-dessus, un conteneur Docker nommé "milvus" est démarré au port 19530. Par conséquent, nous pouvons créer une nouvelle base de données et accéder à tout ce qui est lié à la base de données Milvus en pointant vers ce port lors de l'initialisation du client.</p>
<p>Supposons que nous voulions créer une base de données appelée "milvus_demo", comme nous l'avons fait dans Milvus Lite ci-dessus. Nous pouvons le faire comme suit :</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>

client = <span class="hljs-title class_">MilvusClient</span>(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>,
)
client.<span class="hljs-title function_">create_database</span>(<span class="hljs-string">&quot;milvus_demo&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Ensuite, vous pouvez vérifier si la base de données nouvellement créée appelée "milvus_demo" existe réellement dans votre instance Milvus en accédant à l'<a href="https://milvus.io/docs/milvus-webui.md">interface Web Milvus</a>. Comme son nom l'indique, l'interface Web Milvus est une interface utilisateur graphique fournie par Milvus pour observer les statistiques et les mesures des composants, vérifier la liste et les détails des bases de données, des collections et des configurations. Vous pouvez accéder à Milvus Web UI une fois que vous avez démarré le conteneur Docker ci-dessus à l'adresse http://127.0.0.1:9091/webui/.</p>
<p>Si vous accédez au lien ci-dessus, vous verrez une page d'accueil comme celle-ci :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Landing_page_UI_187a40e935.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sous l'onglet "Collections", vous verrez que notre base de données "milvus_demo" a été créée avec succès. Comme vous pouvez le voir, vous pouvez également vérifier d'autres choses telles que la liste des collections, les configurations, les requêtes que vous avez effectuées, etc. avec cette interface Web.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Web_Ui_2_666eae57b1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Maintenant, nous pouvons tout faire exactement comme nous l'avons vu dans la section Milvus Lite ci-dessus. Créons une collection appelée "demo_collection" dans la base de données "milvus_demo" qui se compose de trois champs, les mêmes que ceux que nous avions dans la section Milvus Lite ci-dessus. Ensuite, nous allons insérer nos données dans la collection.</p>
<pre><code translate="no" class="language-python">index_params = client.prepare_index_params()

<span class="hljs-comment">#  Add indexes</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>, 
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-comment"># Insert data into collection</span>
res = client.insert(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=data
)
<button class="copy-code-btn"></button></code></pre>
<p>Le code permettant d'effectuer une opération de recherche vectorielle est également identique à celui de Milvus Lite, comme vous pouvez le voir dans le code ci-dessous :</p>
<pre><code translate="no" class="language-python">query = [<span class="hljs-string">&quot;Who is Alan Turing&quot;</span>]
query_embedding = sentence_transformer_ef.encode_queries(query)

<span class="hljs-comment"># Load collection</span>
client.load_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>
)

<span class="hljs-comment"># Vector search</span>
res = client.search(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=query_embedding,
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<span class="hljs-built_in">print</span>(res)
<span class="hljs-string">&quot;&quot;&quot;
Output:
data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.7199004292488098, &#x27;entity&#x27;: {&#x27;text&#x27;: &#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;}}]&quot;] 
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Outre l'utilisation de Docker, vous pouvez également utiliser Milvus Standalone avec <a href="https://milvus.io/docs/install_standalone-docker-compose.md">Docker Compose</a> (pour Linux) et <a href="https://milvus.io/docs/install_standalone-windows.md">Docker Desktop</a> (pour Windows).</p>
<p>Lorsque nous n'utilisons plus notre instance Milvus, nous pouvons arrêter Milvus Standalone à l'aide de la commande suivante :</p>
<pre><code translate="no" class="language-shell">$ bash standalone_embed.sh stop
<button class="copy-code-btn"></button></code></pre>
<h2 id="Fully-Managed-Milvus" class="common-anchor-header">Milvus entièrement géré<button data-href="#Fully-Managed-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Une autre façon de démarrer avec Milvus est de passer par une infrastructure native basée sur le cloud dans <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, où vous pouvez bénéficier d'une expérience sans tracas et 10 fois plus rapide.</p>
<p>Zilliz Cloud offre des clusters dédiés avec des environnements et des ressources dédiés pour prendre en charge votre application d'IA. Comme il s'agit d'une base de données basée sur le cloud et construite sur Milvus, nous n'avons pas besoin de mettre en place et de gérer une infrastructure locale. Zilliz Cloud offre également des fonctionnalités plus avancées, telles que la séparation entre le stockage vectoriel et le calcul, la sauvegarde des données vers des systèmes de stockage d'objets populaires tels que S3, et la mise en cache des données pour accélérer les opérations de recherche et d'extraction vectorielles.</p>
<p>Cependant, une chose à prendre en compte lorsque l'on envisage des services basés sur le cloud est le coût d'exploitation. Dans la plupart des cas, nous devons payer même lorsque le cluster est inactif et qu'il n'y a pas d'ingestion de données ou d'activité de recherche vectorielle. Si vous souhaitez optimiser davantage les coûts opérationnels et les performances de votre application, Zilliz Cloud Serverless serait une excellente option.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Key_benefits_of_using_Zilliz_Cloud_Serverless_20f68e0fff.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure : Principaux avantages de l'utilisation de Zilliz Cloud Serverless.</em></p>
<p>Zilliz Cloud Serverless est disponible sur les principaux fournisseurs de cloud tels que AWS, Azure et GCP. Il offre des fonctionnalités telles que la tarification "pay-as-you-go", ce qui signifie que vous ne payez que lorsque vous utilisez le cluster.</p>
<p>Zilliz Cloud Serverless met également en œuvre des technologies avancées telles que les clusters logiques, la mise à l'échelle automatique, le stockage hiérarchisé, la désagrégation des données historiques et en continu, et la séparation des données chaudes et froides. Ces fonctionnalités permettent à Zilliz Cloud Serverless de réaliser jusqu'à 50 fois plus d'économies et d'accélérer d'environ 10 fois les opérations de recherche vectorielle par rapport à Milvus en mémoire.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Illustration_of_tiered_storage_and_hot_cold_data_separation_c634dfd211.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure : Illustration du stockage hiérarchisé et de la séparation des données chaudes et froides.</em></p>
<p>Si vous souhaitez commencer à utiliser Zilliz Cloud Serverless, consultez <a href="https://zilliz.com/serverless">cette page</a> pour plus d'informations.</p>
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
    </button></h2><p>Milvus se distingue comme une base de données vectorielle polyvalente et puissante conçue pour relever les défis de la gestion des données non structurées et de l'exécution d'opérations de recherche vectorielle rapides et efficaces dans les applications d'IA modernes. Avec des options de déploiement telles que Milvus Lite pour un prototypage rapide, Milvus Standalone pour des applications de petite à moyenne envergure et Milvus Distributed pour une évolutivité au niveau de l'entreprise, elle offre une flexibilité adaptée à la taille et à la complexité de n'importe quel projet.</p>
<p>En outre, Zilliz Cloud Serverless étend les capacités de Milvus au cloud et offre un modèle rentable de paiement à l'utilisation qui élimine le besoin d'une infrastructure locale. Grâce à des fonctionnalités avancées telles que le stockage hiérarchisé et la mise à l'échelle automatique, Zilliz Cloud Serverless garantit des opérations de recherche vectorielle plus rapides tout en optimisant les coûts.</p>
