---
id: introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md
title: >-
  Présentation de Milvus 2.5 : recherche plein texte, filtrage plus puissant des
  métadonnées et améliorations de la convivialité !
author: 'Ken Zhang, Stefan Webb, Jiang Chen'
date: 2024-12-17T00:00:00.000Z
cover: assets.zilliz.com/Introducing_Milvus_2_5_e4968e1cdb.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md
---
<h2 id="Overview" class="common-anchor-header">Vue d'ensemble<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous sommes ravis de vous présenter la dernière version de Milvus, la 2.5, qui introduit une nouvelle fonctionnalité puissante : la <a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">recherche en texte intégral</a>, également connue sous le nom de recherche lexicale ou par mot-clé. Si vous êtes novice en matière de recherche, la recherche en texte intégral vous permet de trouver des documents en recherchant des mots ou des phrases spécifiques à l'intérieur de ceux-ci, de la même manière que vous effectuez une recherche dans Google. Elle complète nos capacités de recherche sémantique existantes, qui comprennent le sens de votre recherche au lieu de se contenter de trouver des mots exacts.</p>
<p>Nous utilisons la métrique standard BM25 pour la similarité des documents, et notre implémentation est basée sur des vecteurs épars, ce qui permet un stockage et une récupération plus efficaces. Pour ceux qui ne sont pas familiers avec ce terme, les vecteurs épars sont une manière de représenter le texte où la plupart des valeurs sont nulles, ce qui les rend très efficaces à stocker et à traiter - imaginez une énorme feuille de calcul où seules quelques cellules contiennent des nombres, le reste étant vide. Cette approche s'inscrit parfaitement dans la philosophie du produit Milvus, où le vecteur est l'entité de recherche principale.</p>
<p>Un autre aspect remarquable de notre mise en œuvre est la possibilité d'insérer et d'interroger du texte <em>directement</em>, plutôt que de demander aux utilisateurs de convertir manuellement le texte en vecteurs épars. Milvus fait ainsi un pas de plus vers le traitement intégral des données non structurées.</p>
<p>Mais ce n'est que le début. Avec la sortie de la version 2.5, nous avons mis à jour la <a href="https://milvus.io/docs/roadmap.md">feuille de route des produits Milvus</a>. Dans les prochaines itérations de Milvus, nous nous concentrerons sur l'évolution des capacités de Milvus dans quatre directions clés :</p>
<ul>
<li>Traitement rationalisé des données non structurées ;</li>
<li>Amélioration de la qualité et de l'efficacité des recherches ;</li>
<li>Gestion plus facile des données ;</li>
<li>Réduction des coûts grâce à des avancées en matière d'algorithmes et de conception</li>
</ul>
<p>Notre objectif est de construire une infrastructure de données capable de stocker et de récupérer efficacement les informations à l'ère de l'IA.</p>
<h2 id="Full-text-Search-via-Sparse-BM25" class="common-anchor-header">Recherche en texte intégral via Sparse-BM25<button data-href="#Full-text-Search-via-Sparse-BM25" class="anchor-icon" translate="no">
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
    </button></h2><p>Bien que la recherche sémantique ait généralement une meilleure connaissance du contexte et une meilleure compréhension de l'intention, lorsqu'un utilisateur doit rechercher des noms propres spécifiques, des numéros de série ou une phrase qui correspond parfaitement, la recherche en texte intégral avec correspondance des mots clés produit souvent des résultats plus précis.</p>
<p>Illustrons cela par un exemple :</p>
<ul>
<li>La recherche sémantique excelle lorsque vous demandez : "Trouver des documents sur les solutions en matière d'énergie renouvelable"</li>
<li>La recherche en texte intégral est meilleure lorsque vous avez besoin de : &quot;Trouver des documents mentionnant la <em>Tesla Model 3 2024</em>&quot;</li>
</ul>
<p>Dans notre version précédente (Milvus 2.4), les utilisateurs devaient prétraiter leur texte à l'aide d'un outil distinct (le module BM25EmbeddingFunction de PyMilvus) sur leurs propres machines avant de pouvoir effectuer une recherche. Cette approche présentait plusieurs limites : elle ne permettait pas de gérer correctement les ensembles de données croissants, nécessitait des étapes de configuration supplémentaires et rendait l'ensemble du processus plus compliqué que nécessaire. Pour les techniciens, les principales limitations étaient les suivantes : elle ne pouvait fonctionner que sur une seule machine ; le vocabulaire et les autres statistiques du corpus utilisés pour la notation BM25 ne pouvaient pas être mis à jour à mesure que le corpus changeait ; et la conversion du texte en vecteurs du côté client est moins intuitive que si l'on travaillait directement avec le texte.</p>
<p>Milvus 2.5 simplifie tout. Vous pouvez désormais travailler directement avec votre texte :</p>
<ul>
<li>stocker vos documents textuels originaux tels quels</li>
<li>Effectuer des recherches à l'aide de requêtes en langage naturel</li>
<li>Obtenir les résultats sous une forme lisible</li>
</ul>
<p>En coulisses, Milvus gère automatiquement toutes les conversions vectorielles complexes, ce qui facilite le travail avec les données textuelles. C'est ce que nous appelons notre approche "Doc in, Doc out" : vous travaillez avec du texte lisible et nous nous occupons du reste.</p>
<h3 id="Techical-Implementation" class="common-anchor-header">Mise en œuvre technique</h3><p>Pour ceux qui s'intéressent aux détails techniques, Milvus 2.5 ajoute la capacité de recherche plein texte grâce à sa mise en œuvre Sparse-BM25 intégrée, y compris :</p>
<ul>
<li><strong>Un tokenizer construit sur tantivy</strong>: Milvus s'intègre désormais à l'écosystème florissant de tantivy.</li>
<li><strong>La capacité d'ingérer et de récupérer des documents bruts</strong>: Prise en charge de l'ingestion et de l'interrogation directes de données textuelles</li>
<li><strong>Notation de la pertinence BM25</strong>: Internalisation de la notation BM25, implémentée sur la base de vecteurs épars</li>
</ul>
<p>Nous avons choisi de travailler avec l'écosystème bien développé de tantivy et de construire le tokenizer de texte Milvus sur tantivy. À l'avenir, Milvus prendra en charge davantage de tokenizers et exposera le processus de tokenisation afin d'aider les utilisateurs à mieux comprendre la qualité de l'extraction. Nous explorerons également des tokenizers basés sur l'apprentissage profond et des stratégies de stemmer afin d'optimiser les performances de la recherche en texte intégral. Vous trouverez ci-dessous un exemple de code pour l'utilisation et la configuration du tokenizer :</p>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Tokenizer configuration</span>
schema.add_field(
    field_name=<span class="hljs-string">&#x27;text&#x27;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">65535</span>,
    enable_analyzer=<span class="hljs-literal">True</span>, <span class="hljs-comment"># Enable tokenizer on this column</span>
    analyzer_params={<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>},  <span class="hljs-comment"># Configure tokenizer parameters, here we choose the english template, fine-grained configuration is also supported</span>
    enable_match=<span class="hljs-literal">True</span>, <span class="hljs-comment"># Build an inverted index for Text_Match</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Après avoir configuré le tokenizer dans le schéma de la collection, les utilisateurs peuvent enregistrer le texte dans la fonction bm25 via la méthode add_function. Cette méthode sera exécutée en interne dans le serveur Milvus. Tous les flux de données ultérieurs, tels que les ajouts, les suppressions, les modifications et les requêtes, peuvent être réalisés en opérant sur la chaîne de texte brute, par opposition à la représentation vectorielle. Voir l'exemple de code ci-dessous pour savoir comment ingérer du texte et effectuer une recherche en texte intégral avec la nouvelle API :</p>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Define the mapping relationship between raw text data and vectors on the schema</span>
bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25_emb&quot;</span>,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>], <span class="hljs-comment"># Input text field</span>
    output_field_names=[<span class="hljs-string">&quot;sparse&quot;</span>], <span class="hljs-comment"># Internal mapping sparse vector field</span>
    function_type=FunctionType.BM25, <span class="hljs-comment"># Model for processing mapping relationship</span>
)

schema.add_function(bm25_function)
...
<span class="hljs-comment"># Support for raw text in/out</span>
MilvusClient.insert(<span class="hljs-string">&#x27;demo&#x27;</span>, [
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Artificial intelligence was founded as an academic discipline in 1956.&#x27;</span>},
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;</span>},
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Born in Maida Vale, London, Turing was raised in southern England.&#x27;</span>},
])

MilvusClient.search(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>,
    data=[<span class="hljs-string">&#x27;Who started AI research?&#x27;</span>],
    anns_field=<span class="hljs-string">&#x27;sparse&#x27;</span>,
    limit=<span class="hljs-number">3</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Nous avons adopté une implémentation de l'évaluation de la pertinence BM25 qui représente les requêtes et les documents sous forme de vecteurs épars, appelée <strong>Sparse-BM25</strong>. Cela permet de débloquer de nombreuses optimisations basées sur les vecteurs épars, telles que :</p>
<p>Milvus offre des capacités de recherche hybrides grâce à son <strong>implémentation de</strong> pointe <strong>Sparse-BM25</strong>, qui intègre la recherche en texte intégral dans l'architecture de la base de données vectorielle. En représentant les fréquences des termes sous forme de vecteurs épars au lieu des index inversés traditionnels, Sparse-BM25 permet des optimisations avancées, telles que l'<strong>indexation par graphe</strong>, la <strong>quantification par produit (PQ)</strong> et la <strong>quantification scalaire (SQ)</strong>. Ces optimisations minimisent l'utilisation de la mémoire et accélèrent les performances de recherche. Semblable à l'approche de l'index inversé, Milvus prend en charge le texte brut en tant qu'entrée et génère des vecteurs épars en interne. Cela lui permet de travailler avec n'importe quel tokéniseur et de saisir n'importe quel mot figurant dans le corpus en évolution dynamique.</p>
<p>En outre, l'élagage heuristique permet d'éliminer les vecteurs épars de faible valeur, ce qui améliore encore l'efficacité sans compromettre la précision. Contrairement à l'approche précédente utilisant des vecteurs épars, elle peut s'adapter à un corpus croissant, et non à la précision de la notation BM25.</p>
<ol>
<li>Construction d'index de graphe sur le vecteur clairsemé, qui donne de meilleurs résultats que l'index inversé pour les requêtes comportant un texte long, car l'index inversé a besoin de plus d'étapes pour finir de faire correspondre les tokens de la requête ;</li>
<li>L'utilisation de techniques d'approximation pour accélérer la recherche avec un impact mineur sur la qualité de la recherche, telles que la quantification des vecteurs et l'élagage basé sur des heuristiques ;</li>
<li>l'unification de l'interface et du modèle de données pour la recherche sémantique et la recherche en texte intégral, ce qui améliore l'expérience de l'utilisateur.</li>
</ol>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Creating an index on the sparse column</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,  <span class="hljs-comment"># Default WAND index</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span> <span class="hljs-comment"># Configure relevance scoring through metric_type</span>
)

<span class="hljs-comment"># Configurable parameters at search time to speed up search</span>
search_params = {
    <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;drop_ratio_search&#x27;</span>: <span class="hljs-number">0.6</span>}, <span class="hljs-comment"># WAND search parameter configuration can speed up search</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>En résumé, Milvus 2.5 a étendu ses capacités de recherche au-delà de la recherche sémantique en introduisant la recherche en texte intégral, ce qui permet aux utilisateurs de créer plus facilement des applications d'IA de haute qualité. Il ne s'agit là que de premières étapes dans l'espace de recherche Sparse-BM25 et nous pensons qu'il y aura d'autres mesures d'optimisation à essayer à l'avenir.</p>
<h2 id="Text-Matching-Search-Filters" class="common-anchor-header">Filtres de recherche de correspondance de texte<button data-href="#Text-Matching-Search-Filters" class="anchor-icon" translate="no">
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
    </button></h2><p>Une deuxième fonction de recherche de texte a été lancée avec Milvus 2.5 : la <strong>correspondance de texte</strong>, qui permet à l'utilisateur de filtrer la recherche sur les entrées contenant une chaîne de texte spécifique. Cette fonction repose également sur la tokenisation et est activée à l'adresse <code translate="no">enable_match=True</code>.</p>
<p>Il convient de noter qu'avec Text Match, le traitement du texte de la requête est basé sur la logique du OU après la tokenisation. Par exemple, dans l'exemple ci-dessous, le résultat renverra tous les documents (utilisant le champ "texte") qui contiennent soit "vecteur" soit "base de données".</p>
<pre><code translate="no" class="language-Python"><span class="hljs-built_in">filter</span> = <span class="hljs-string">&quot;TEXT_MATCH(text, &#x27;vector database&#x27;)&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Si votre scénario exige une correspondance à la fois avec "vector" et "database", vous devez écrire deux correspondances de texte distinctes et les superposer à l'aide de AND pour atteindre votre objectif.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-built_in">filter</span> = <span class="hljs-string">&quot;TEXT_MATCH(text, &#x27;vector&#x27;) and TEXT_MATCH(text, &#x27;database&#x27;)&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Significant-Enhancement-in-Scalar-Filtering-Performance" class="common-anchor-header">Amélioration significative des performances du filtrage scalaire<button data-href="#Significant-Enhancement-in-Scalar-Filtering-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>L'accent mis sur les performances du filtrage scalaire provient de notre découverte que la combinaison de la recherche vectorielle et du filtrage des métadonnées peut grandement améliorer les performances et la précision des requêtes dans divers scénarios. Ces scénarios vont des applications de recherche d'images telles que l'identification des cas de figure dans la conduite autonome aux scénarios complexes de RAG dans les bases de connaissances d'entreprise. Il est donc tout à fait approprié pour les utilisateurs en entreprise de mettre en œuvre des scénarios d'application de données à grande échelle.</p>
<p>Dans la pratique, de nombreux facteurs tels que la quantité de données filtrées, l'organisation des données et la méthode de recherche peuvent affecter les performances. Pour y remédier, Milvus 2.5 introduit trois nouveaux types d'index : l'index BitMap, l'index inversé de tableau et l'index inversé après la tokenisation du champ de texte Varchar. Ces nouveaux index peuvent améliorer de manière significative les performances dans les cas d'utilisation réels.</p>
<p>Plus précisément, l'index BitMap peut être utilisé pour améliorer les performances dans les cas d'utilisation réels :</p>
<ol>
<li>L'<strong>index BitMap</strong> peut être utilisé pour accélérer le filtrage des balises (les opérateurs courants incluent in, array_contains, etc.), et convient aux scénarios avec moins de données de catégories de champs (cardinalité des données). Le principe consiste à déterminer si une ligne de données possède une certaine valeur sur une colonne, avec 1 pour oui et 0 pour non, puis à maintenir une liste BitMap. Le graphique suivant montre la comparaison des tests de performance que nous avons effectuée sur la base d'un scénario d'entreprise d'un client. Dans ce scénario, le volume de données est de 500 millions, la catégorie de données est de 20, les différentes valeurs ont des proportions de distribution différentes (1 %, 5 %, 10 %, 50 %), et les performances sous différentes quantités de filtrage varient également. Avec un filtrage de 50 %, nous pouvons obtenir un gain de performance de 6,8 fois grâce à l'index BitMap. Il convient de noter qu'à mesure que la cardinalité augmente, l'index inversé présente des performances plus équilibrées que l'index BitMap.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/QPS_comparison_f3f580d697.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li>La<strong>correspondance de texte</strong> est basée sur l'index inversé une fois que le champ de texte a été transformé en jeton. Ses performances dépassent de loin celles de la fonction Wildcard Match (c'est-à-dire like + %) que nous avons fournie dans la version 2.4. D'après les résultats de nos tests internes, les avantages de la correspondance de texte sont très clairs, en particulier dans les scénarios de requêtes simultanées, où elle peut multiplier par 400 la vitesse de traitement des requêtes.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_size_and_concurrency_e19dc44c59.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>En ce qui concerne le traitement des données JSON, nous prévoyons d'introduire dans les versions ultérieures de la version 2.5.x la construction d'indices inversés pour les clés spécifiées par l'utilisateur et l'enregistrement d'informations de localisation par défaut pour toutes les clés afin d'accélérer l'analyse syntaxique. Nous prévoyons que ces deux domaines amélioreront considérablement les performances des requêtes JSON et Dynamic Field. Nous prévoyons de présenter plus d'informations dans les prochaines notes de version et blogs techniques, alors restez à l'écoute !</p>
<h2 id="New-Management-Interface" class="common-anchor-header">Nouvelle interface de gestion<button data-href="#New-Management-Interface" class="anchor-icon" translate="no">
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
    </button></h2><p>La gestion d'une base de données ne devrait pas nécessiter un diplôme d'informatique, mais nous savons que les administrateurs de bases de données ont besoin d'outils puissants. C'est pourquoi nous avons introduit la <strong>Cluster Management WebUI</strong>, une nouvelle interface web accessible à l'adresse de votre cluster sur le port 9091/webui. Cet outil d'observabilité fournit</p>
<ul>
<li>des tableaux de bord de surveillance en temps réel affichant des mesures à l'échelle de la grappe</li>
<li>des analyses détaillées de la mémoire et des performances par nœud</li>
<li>Informations sur les segments et suivi des requêtes lentes</li>
<li>Indicateurs de santé du système et état des nœuds</li>
<li>des outils de dépannage faciles à utiliser pour les problèmes complexes du système.</li>
</ul>
<p>Bien que cette interface soit encore en version bêta, nous la développons activement en nous appuyant sur les commentaires des administrateurs de bases de données. Les prochaines mises à jour incluront des diagnostics assistés par l'IA, des fonctions de gestion plus interactives et des capacités améliorées d'observabilité des clusters.</p>
<h2 id="Documentation-and-Developer-Experience" class="common-anchor-header">Documentation et expérience des développeurs<button data-href="#Documentation-and-Developer-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous avons entièrement remanié notre <strong>documentation</strong> et notre expérience <strong>SDK/API</strong> afin de rendre Milvus plus accessible tout en conservant une certaine profondeur pour les utilisateurs expérimentés. Les améliorations comprennent</p>
<ul>
<li>Un système de documentation restructuré avec une progression plus claire des concepts de base aux concepts avancés</li>
<li>Des tutoriels interactifs et des exemples concrets qui présentent des mises en œuvre pratiques.</li>
<li>Des références d'API complètes avec des exemples de code pratiques</li>
<li>Une conception plus conviviale du SDK qui simplifie les opérations courantes</li>
<li>des guides illustrés qui facilitent la compréhension des concepts complexes</li>
<li>un assistant de documentation alimenté par l'IA (ASK AI) pour des réponses rapides.</li>
</ul>
<p>La mise à jour du SDK/API vise à améliorer l'expérience des développeurs grâce à des interfaces plus intuitives et à une meilleure intégration de la documentation. Nous pensons que vous remarquerez ces améliorations lorsque vous travaillerez avec la série 2.5.x.</p>
<p>Cependant, nous savons que le développement de la documentation et du SDK est un processus continu. Nous continuerons à optimiser la structure du contenu et la conception du SDK en fonction des commentaires de la communauté. Rejoignez notre canal Discord pour nous faire part de vos suggestions et nous aider à nous améliorer encore.</p>
<h2 id="Summary" class="common-anchor-header"><strong>Résumé</strong><button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.5 contient 13 nouvelles fonctionnalités et plusieurs optimisations au niveau du système, apportées non seulement par Zilliz mais aussi par la communauté open-source. Nous n'avons abordé que quelques-unes d'entre elles dans ce billet et vous encourageons à consulter notre <a href="https://milvus.io/docs/release_notes.md">note de mise à jour</a> et les <a href="https://milvus.io/docs">documents officiels</a> pour plus d'informations !</p>
