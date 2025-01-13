---
id: music-recommender-system-item-based-collaborative-filtering-milvus.md
title: "\U0001F50E Sélectionner un moteur de recherche de similarité d'intégration"
author: milvus
date: 2020-09-08T00:01:59.064Z
desc: Une étude de cas avec WANYIN APP
cover: assets.zilliz.com/header_f8cea596d2.png
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/music-recommender-system-item-based-collaborative-filtering-milvus
---
<custom-h1>Filtrage collaboratif basé sur les éléments pour un système de recommandation musicale</custom-h1><p>L'application Wanyin est une communauté de partage de musique basée sur l'IA qui a pour but d'encourager le partage de musique et de faciliter la composition musicale pour les amateurs de musique.</p>
<p>La bibliothèque de Wanyin contient une quantité massive de musique téléchargée par les utilisateurs. La tâche principale consiste à trier la musique intéressante en se basant sur le comportement antérieur des utilisateurs. Nous avons évalué deux modèles classiques : le filtrage collaboratif basé sur l'utilisateur (User-based CF) et le filtrage collaboratif basé sur l'élément (Item-based CF), en tant que modèles potentiels de système de recommandation.</p>
<ul>
<li>Le filtrage collaboratif basé sur l'utilisateur utilise les statistiques de similarité pour obtenir les utilisateurs voisins ayant des préférences ou des intérêts similaires. Grâce à l'ensemble des voisins les plus proches, le système peut prédire l'intérêt de l'utilisateur cible et générer des recommandations.</li>
<li>Introduite par Amazon, la FC basée sur les articles, ou FC d'article à article (I2I), est un modèle de filtrage collaboratif bien connu pour les systèmes de recommandation. Il calcule les similitudes entre les éléments plutôt qu'entre les utilisateurs, en partant du principe que les éléments d'intérêt doivent être similaires aux éléments ayant obtenu des scores élevés.</li>
</ul>
<p>Le CF basé sur l'utilisateur peut entraîner un temps de calcul prohibitif lorsque le nombre d'utilisateurs dépasse un certain seuil. Compte tenu des caractéristiques de notre produit, nous avons décidé d'utiliser la FC I2I pour mettre en œuvre le système de recommandation musicale. Étant donné que nous ne possédons pas beaucoup de métadonnées sur les chansons, nous devons traiter les chansons en tant que telles, en extrayant des vecteurs de caractéristiques (embeddings). Notre approche consiste à convertir ces chansons en mel-frequency cepstrum (MFC), à concevoir un réseau neuronal convolutionnel (CNN) pour extraire les embeddings de caractéristiques des chansons, puis à faire des recommandations musicales par le biais d'une recherche de similarité d'embeddings.</p>
<h2 id="🔎-Select-an-embedding-similarity-search-engine" class="common-anchor-header">🔎 Sélectionner un moteur de recherche de similarité d'intégration<button data-href="#🔎-Select-an-embedding-similarity-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Maintenant que nous disposons de vecteurs de caractéristiques, la question qui se pose est de savoir comment extraire du grand volume de vecteurs ceux qui sont similaires au vecteur cible. En ce qui concerne le moteur de recherche d'embeddings, nous avons pesé entre Faiss et Milvus. J'ai remarqué Milvus en parcourant les dépôts GitHub en novembre 2019. J'ai jeté un coup d'œil au projet et il m'a séduit par ses API abstraites. (Il était alors en v0.5.x et en v0.10.2 aujourd'hui).</p>
<p>Nous préférons Milvus à Faiss. D'une part, nous avons déjà utilisé Faiss et nous aimerions donc essayer quelque chose de nouveau. D'autre part, comparé à Milvus, Faiss est plus une bibliothèque sous-jacente, et n'est donc pas très pratique à utiliser. Après en avoir appris davantage sur Milvus, nous avons finalement décidé d'adopter Milvus pour ses deux principales caractéristiques :</p>
<ul>
<li>Milvus est très facile à utiliser. Tout ce que vous avez à faire est de tirer son image Docker et de mettre à jour les paramètres en fonction de votre propre scénario.</li>
<li>Il prend en charge davantage d'index et dispose d'une documentation détaillée.</li>
</ul>
<p>En résumé, Milvus est très convivial pour les utilisateurs et la documentation est très détaillée. Si vous rencontrez un problème, vous pouvez généralement trouver des solutions dans la documentation ; sinon, vous pouvez toujours obtenir de l'aide auprès de la communauté Milvus.</p>
<h2 id="Milvus-cluster-service-☸️-⏩" class="common-anchor-header">Service de cluster Milvus ☸️ ⏩<button data-href="#Milvus-cluster-service-☸️-⏩" class="anchor-icon" translate="no">
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
    </button></h2><p>Après avoir décidé d'utiliser Milvus comme moteur de recherche vectoriel, nous avons configuré un nœud autonome dans un environnement de développement (DEV). Il fonctionnait bien depuis quelques jours, nous avons donc prévu d'exécuter des tests dans un environnement de test d'acceptation d'usine (FAT). Si un nœud autonome tombait en panne en production, l'ensemble du service deviendrait indisponible. Nous devons donc déployer un service de recherche hautement disponible.</p>
<p>Milvus fournit à la fois Mishards, un middleware de cluster sharding, et Milvus-Helm pour la configuration. Le processus de déploiement d'un service de cluster Milvus est simple. Il suffit de mettre à jour certains paramètres et de les emballer pour les déployer dans Kubernetes. Le diagramme ci-dessous, tiré de la documentation de Milvus, montre comment fonctionne Mishards :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_how_mishards_works_in_milvus_documentation_43a73076bf.png" alt="1-how-mishards-works-in-milvus-documentation.png" class="doc-image" id="1-how-mishards-works-in-milvus-documentation.png" />
   </span> <span class="img-wrapper"> <span>1-how-mishards-works-in-milvus-documentation.png</span> </span></p>
<p>Mishards fait descendre une demande en amont vers ses sous-modules qui divisent la demande en amont, puis collecte et renvoie les résultats des sous-services vers l'amont. L'architecture globale de la solution de cluster basée sur Mishards est présentée ci-dessous :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_mishards_based_cluster_solution_architecture_3ad89cf269.jpg" alt="2-mishards-based-cluster-solution-architecture.jpg" class="doc-image" id="2-mishards-based-cluster-solution-architecture.jpg" />
   </span> <span class="img-wrapper"> <span>2-mishards-based-cluster-solution-architecture.jpg</span> </span></p>
<p>La documentation officielle fournit une introduction claire de Mishards. Vous pouvez vous référer à <a href="https://milvus.io/cn/docs/v0.10.2/mishards.md">Mishards</a> si vous êtes intéressé.</p>
<p>Dans notre système de recommandation musicale, nous avons déployé un nœud inscriptible, deux nœuds en lecture seule et une instance de middleware Mishards dans Kubernetes, en utilisant Milvus-Helm. Après que le service ait fonctionné de manière stable dans un environnement FAT pendant un certain temps, nous l'avons déployé en production. Il s'est avéré stable jusqu'à présent.</p>
<h2 id="🎧-I2I-music-recommendation-🎶" class="common-anchor-header">🎧 Recommandation musicale I2I 🎶<button data-href="#🎧-I2I-music-recommendation-🎶" class="anchor-icon" translate="no">
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
    </button></h2><p>Comme mentionné ci-dessus, nous avons construit le système de recommandation musicale I2I de Wanyin en utilisant les embeddings extraits des chansons existantes. Tout d'abord, nous avons séparé la voix et le BGM (séparation des pistes) d'une nouvelle chanson téléchargée par l'utilisateur et extrait les embeddings du BGM en tant que représentation des caractéristiques de la chanson. Cela permet également de trier les reprises de chansons originales. Ensuite, nous avons stocké ces intégrations dans Milvus, recherché des chansons similaires sur la base des chansons écoutées par l'utilisateur, puis trié et réorganisé les chansons récupérées afin de générer des recommandations musicales. Le processus de mise en œuvre est illustré ci-dessous :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_music_recommender_system_implementation_c52a333eb8.png" alt="3-music-recommender-system-implementation.png" class="doc-image" id="3-music-recommender-system-implementation.png" />
   </span> <span class="img-wrapper"> <span>3-music-recommender-system-implementation.png</span> </span></p>
<h2 id="🚫-Duplicate-song-filter" class="common-anchor-header">🚫 Filtre pour les chansons en double<button data-href="#🚫-Duplicate-song-filter" class="anchor-icon" translate="no">
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
    </button></h2><p>Un autre scénario dans lequel nous utilisons Milvus est le filtrage des chansons en double. Certains utilisateurs téléchargent plusieurs fois la même chanson ou le même clip, et ces chansons en double peuvent apparaître dans leur liste de recommandations. Cela signifie que la génération de recommandations sans prétraitement nuirait à l'expérience de l'utilisateur. Nous devons donc identifier les chansons en double et nous assurer qu'elles n'apparaissent pas dans la même liste par le biais du prétraitement.</p>
<p>Un autre scénario dans lequel nous utilisons Milvus est le filtrage des chansons en double. Certains utilisateurs téléchargent plusieurs fois la même chanson ou le même clip, et ces chansons en double peuvent apparaître dans leur liste de recommandations. Cela signifie que la génération de recommandations sans prétraitement nuirait à l'expérience de l'utilisateur. Nous devons donc identifier les chansons en double et nous assurer qu'elles n'apparaissent pas dans la même liste par le biais du prétraitement.</p>
<p>Comme dans le scénario précédent, nous avons mis en œuvre le filtrage des chansons en double en recherchant des vecteurs de caractéristiques similaires. Tout d'abord, nous avons séparé la voix et le BGM et récupéré un certain nombre de chansons similaires à l'aide de Milvus. Afin de filtrer les chansons en double avec précision, nous avons extrait les empreintes audio de la chanson cible et des chansons similaires (avec des technologies telles que Echoprint, Chromaprint, etc.), calculé la similarité entre l'empreinte audio de la chanson cible et chacune des empreintes des chansons similaires. Si la similarité dépasse le seuil, nous définissons une chanson comme un duplicata de la chanson cible. Le processus de correspondance des empreintes audio rend le filtrage des chansons dupliquées plus précis, mais il prend également beaucoup de temps. Par conséquent, lorsqu'il s'agit de filtrer des chansons dans une bibliothèque musicale massive, nous utilisons Milvus pour filtrer nos chansons en double candidates comme étape préliminaire.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_using_milvus_filter_songs_music_recommender_duplicates_0ff68d3e67.png" alt="4-using-milvus-filter-songs-music-recommender-duplicates.png" class="doc-image" id="4-using-milvus-filter-songs-music-recommender-duplicates.png" />
   </span> <span class="img-wrapper"> <span>4-using-milvus-filter-songs-music-recommender-duplicates.png</span> </span></p>
<p>Pour mettre en œuvre le système de recommandation I2I pour l'énorme bibliothèque musicale de Wanyin, notre approche consiste à extraire les embeddings des chansons en tant que caractéristiques, à rappeler les embeddings similaires à l'embedding de la chanson cible, puis à trier et à réorganiser les résultats pour générer des listes de recommandation pour l'utilisateur. Pour obtenir des recommandations en temps réel, nous avons choisi Milvus plutôt que Faiss comme moteur de recherche de similarité des vecteurs de caractéristiques, car Milvus s'avère plus convivial et plus sophistiqué. De même, nous avons également appliqué Milvus à notre filtre de chansons en double, ce qui améliore l'expérience et l'efficacité de l'utilisateur.</p>
<p>Vous pouvez télécharger <a href="https://enjoymusic.ai/wanyin">Wanyin App</a> 🎶 et l'essayer. (Remarque : il se peut que l'application ne soit pas disponible sur tous les magasins d'applications).</p>
<h3 id="📝-Authors" class="common-anchor-header">📝 Auteurs :</h3><p>Jason, Ingénieur algorithme chez Stepbeats Shiyu Chen, Ingénieur données chez Zilliz.</p>
<h3 id="📚-References" class="common-anchor-header">📚 Références :</h3><p>Mishards Docs : https://milvus.io/docs/v0.10.2/mishards.md Mishards : https://github.com/milvus-io/milvus/tree/master/shards Milvus-Helm : https://github.com/milvus-io/milvus-helm/tree/master/charts/milvus</p>
<p><strong>🤗 Ne soyez pas un inconnu, suivez-nous sur <a href="https://twitter.com/milvusio/">Twitter</a> ou rejoignez-nous sur <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/">Slack</a>!👇🏻</strong></p>
