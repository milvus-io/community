---
id: How-we-used-semantic-search-to-make-our-search-10-x-smarter.md
title: Recherche par mot-clé
author: Rahul Yadav
date: 2021-02-05T06:27:15.076Z
desc: >-
  Tokopedia a utilisé Milvus pour construire un système de recherche 10 fois
  plus intelligent qui a considérablement amélioré l'expérience de
  l'utilisateur.
cover: >-
  assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_1_a7bac91379.jpeg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/How-we-used-semantic-search-to-make-our-search-10-x-smarter
---
<custom-h1>Comment nous avons utilisé la recherche sémantique pour rendre notre recherche 10 fois plus intelligente</custom-h1><p>Chez Tokopedia, nous comprenons que la valeur de notre corpus de produits n'est exploitée que lorsque nos acheteurs peuvent trouver des produits qui leur correspondent, c'est pourquoi nous nous efforçons d'améliorer la pertinence des résultats de recherche.</p>
<p>C'est pourquoi nous nous efforçons d'améliorer la pertinence des résultats de recherche. Pour poursuivre cet effort, nous introduisons la <strong>recherche par similarité</strong> sur Tokopedia. Si vous allez sur la page des résultats de recherche sur les appareils mobiles, vous trouverez un bouton "..." qui expose un menu qui vous donne l'option de rechercher des produits similaires au produit.</p>
<h2 id="Keyword-based-search" class="common-anchor-header">Recherche par mot-clé<button data-href="#Keyword-based-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Tokopedia Search utilise <strong>Elasticsearch</strong> pour la recherche et le classement des produits. Pour chaque demande de recherche, nous interrogeons d'abord ElasticSearch, qui classe les produits en fonction de la demande de recherche. ElasticSearch stocke chaque mot sous la forme d'une séquence de nombres représentant les codes <a href="https://en.wikipedia.org/wiki/ASCII">ASCII</a> (ou UTF) pour chaque lettre. Il construit un <a href="https://en.wikipedia.org/wiki/Inverted_index">index inversé</a> pour trouver rapidement les documents qui contiennent les mots de la requête de l'utilisateur, puis trouve la meilleure correspondance entre eux à l'aide de divers algorithmes de notation. Ces algorithmes ne prêtent guère attention à la signification des mots, mais plutôt à leur fréquence d'apparition dans le document, à leur proximité, etc. La représentation ASCII contient évidemment suffisamment d'informations pour transmettre la sémantique (après tout, nous, les humains, pouvons la comprendre). Malheureusement, il n'existe pas de bon algorithme permettant à l'ordinateur de comparer les mots codés en ASCII en fonction de leur signification.</p>
<h2 id="Vector-representation" class="common-anchor-header">Représentation vectorielle<button data-href="#Vector-representation" class="anchor-icon" translate="no">
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
    </button></h2><p>Une solution à ce problème consisterait à proposer une autre représentation, qui nous renseignerait non seulement sur les lettres contenues dans le mot, mais aussi sur sa signification. Par exemple, nous pourrions coder <em>les autres mots avec lesquels notre mot est fréquemment utilisé</em> (représentés par le contexte probable). Nous pourrions alors supposer que des contextes similaires représentent des choses similaires et essayer de les comparer à l'aide de méthodes mathématiques. Nous pourrions même trouver un moyen d'encoder des phrases entières en fonction de leur signification.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_2_776af567a8.png" alt="Blog_How we used semantic search to make our search 10x smarter_2.png" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_2.png" />
   </span> <span class="img-wrapper"> <span>Blog_Comment nous avons utilisé la recherche sémantique pour rendre notre recherche 10x plus intelligente_2.png</span> </span></p>
<h2 id="Select-an-embedding-similarity-search-engine" class="common-anchor-header">Sélectionner un moteur de recherche de similarité d'intégration<button data-href="#Select-an-embedding-similarity-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Maintenant que nous disposons de vecteurs de caractéristiques, la question qui se pose est de savoir comment extraire du grand volume de vecteurs ceux qui sont similaires au vecteur cible. En ce qui concerne le moteur de recherche d'embeddings, nous avons essayé plusieurs moteurs disponibles sur Github, dont FAISS, Vearch et Milvus.</p>
<p>Nous préférons Milvus aux autres moteurs sur la base des résultats des tests de charge. D'un côté, nous avons déjà utilisé FAISS pour d'autres équipes et nous aimerions donc essayer quelque chose de nouveau. Par rapport à Milvus, FAISS est davantage une bibliothèque sous-jacente et n'est donc pas très pratique à utiliser. Après en avoir appris davantage sur Milvus, nous avons finalement décidé d'adopter Milvus pour ses deux principales caractéristiques :</p>
<ul>
<li><p>Milvus est très facile à utiliser. Tout ce que vous avez à faire est de tirer son image Docker et de mettre à jour les paramètres en fonction de votre propre scénario.</p></li>
<li><p>Il prend en charge davantage d'index et dispose d'une documentation détaillée.</p></li>
</ul>
<p>En résumé, Milvus est très convivial pour les utilisateurs et la documentation est très détaillée. Si vous rencontrez un problème, vous pouvez généralement trouver des solutions dans la documentation ; sinon, vous pouvez toujours obtenir de l'aide auprès de la communauté Milvus.</p>
<h2 id="Milvus-cluster-service" class="common-anchor-header">Service de cluster Milvus<button data-href="#Milvus-cluster-service" class="anchor-icon" translate="no">
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
    </button></h2><p>Après avoir décidé d'utiliser Milvus comme moteur de recherche à vecteur de fonctionnalités, nous avons décidé d'utiliser Milvus pour l'un de nos cas d'utilisation du service Ads dans lequel nous voulions faire correspondre des mots-clés <a href="https://www.tradegecko.com/blog/wholesale-management/what-is-fill-rate-and-why-does-it-matter-for-wholesalers">à faible taux de remplissage</a> avec des mots-clés à taux de remplissage élevé. Nous avons configuré un nœud autonome dans un environnement de développement (DEV) et commencé à servir, il fonctionnait bien depuis quelques jours et nous donnait des mesures CTR/CVR améliorées. Si un nœud autonome tombait en panne en production, l'ensemble du service deviendrait indisponible. Nous devons donc déployer un service de recherche hautement disponible.</p>
<p>Milvus fournit à la fois Mishards, un middleware de cluster sharding, et Milvus-Helm pour la configuration. Dans Tokopedia, nous utilisons les playbooks Ansible pour la configuration de l'infrastructure, nous avons donc créé un playbook pour l'orchestration de l'infrastructure. Le diagramme ci-dessous, tiré de la documentation de Milvus, montre comment fonctionne Mishards :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_3_4fa0c8a1a1.png" alt="Blog_How we used semantic search to make our search 10x smarter_3.png" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_3.png" />
   </span> <span class="img-wrapper"> <span>Blog_Comment nous avons utilisé la recherche sémantique pour rendre notre recherche 10x plus intelligente_3.png</span> </span></p>
<p>Mishards fait descendre une requête en amont vers ses sous-modules en divisant la requête en amont, puis collecte et renvoie les résultats des sous-services vers l'amont. L'architecture globale de la solution de cluster basée sur Mishards est illustrée ci-dessous : <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_4_724618be4e.jpeg" alt="Blog_How we used semantic search to make our search 10x smarter_4.jpeg" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_4.jpeg" /><span>Blog_How we used semantic search to make our search 10x smarter_4.jpeg</span> </span></p>
<p>La documentation officielle fournit une introduction claire de Mishards. Vous pouvez vous référer à <a href="https://milvus.io/cn/docs/v0.10.2/mishards.md">Mishards</a> si vous êtes intéressé.</p>
<p>Dans notre service de mot-clé à mot-clé, nous avons déployé un nœud en écriture, deux nœuds en lecture seule et une instance de middleware Mishards dans GCP, en utilisant Milvus ansible. Jusqu'à présent, le système s'est avéré stable. L'<a href="https://milvus.io/docs/v0.10.5/index.md">indexation</a>, un processus d'organisation des données qui accélère considérablement la recherche dans les big data, est un élément essentiel qui permet d'interroger efficacement les millions, les milliards, voire les trillions de données vectorielles sur lesquelles s'appuient les moteurs de recherche de similitudes.</p>
<h2 id="How-does-vector-indexing-accelerate-similarity-search" class="common-anchor-header">Comment l'indexation vectorielle accélère-t-elle la recherche de similarités ?<button data-href="#How-does-vector-indexing-accelerate-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Les moteurs de recherche de similarité fonctionnent en comparant les données d'entrée à une base de données afin de trouver les objets les plus similaires aux données d'entrée. L'indexation est le processus d'organisation efficace des données et joue un rôle majeur dans l'utilité de la recherche de similarité en accélérant considérablement les requêtes fastidieuses sur les grands ensembles de données. Après l'indexation d'un vaste ensemble de données vectorielles, les requêtes peuvent être acheminées vers les grappes, ou sous-ensembles de données, qui sont les plus susceptibles de contenir des vecteurs similaires à une requête d'entrée. Dans la pratique, cela signifie qu'un certain degré de précision est sacrifié pour accélérer les requêtes sur des données vectorielles très volumineuses.</p>
<p>On peut faire une analogie avec un dictionnaire, où les mots sont classés par ordre alphabétique. Lors de la recherche d'un mot, il est possible de naviguer rapidement vers une section qui ne contient que des mots ayant la même initiale, ce qui accélère considérablement la recherche de la définition du mot saisi.</p>
<h2 id="What-next-you-ask" class="common-anchor-header">Et maintenant, demandez-vous ?<button data-href="#What-next-you-ask" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_5_035480c8af.jpeg" alt="Blog_How we used semantic search to make our search 10x smarter_5.jpeg" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_5.jpeg" />
   </span> <span class="img-wrapper"> <span>Blog_Comment nous avons utilisé la recherche sémantique pour rendre notre recherche 10x plus intelligente_5.jpeg</span> </span></p>
<p>Comme nous l'avons vu plus haut, il n'y a pas de solution universelle, nous voulons toujours améliorer les performances du modèle utilisé pour obtenir les enchâssements.</p>
<p>D'un point de vue technique, nous voulons également exécuter plusieurs modèles d'apprentissage en même temps et comparer les résultats des différentes expériences. Surveillez cet espace pour plus d'informations sur nos expériences telles que la recherche d'images et la recherche de vidéos.</p>
<p><br/></p>
<h2 id="References" class="common-anchor-header">Références :<button data-href="#References" class="anchor-icon" translate="no">
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
<li>Mishards Docs：https://milvus.io/docs/v0.10.2/mishards.md</li>
<li>Mishards : https://github.com/milvus-io/milvus/tree/master/shards</li>
<li>Milvus-Helm : https://github.com/milvus-io/milvus-helm/tree/master/charts/milvus</li>
</ul>
<p><br/></p>
<p><em>Cet article de blog est repris de : https://medium.com/tokopedia-engineering/how-we-used-semantic-search-to-make-our-search-10x-smarter-bd9c7f601821</em></p>
<p>Lisez d'autres <a href="https://zilliz.com/user-stories">histoires d'utilisateurs</a> pour en savoir plus sur la fabrication de choses avec Milvus.</p>
