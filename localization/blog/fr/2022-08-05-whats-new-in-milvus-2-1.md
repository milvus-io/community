---
id: 2022-08-05-whats-new-in-milvus-2-1.md
title: Nouveautés de Milvus 2.1 - Vers la simplicité et la rapidité
author: Xiaofan Luan
date: 2022-08-05T00:00:00.000Z
desc: >-
  Milvus, la base de données vectorielles open-source, présente désormais des
  améliorations de performance et de convivialité attendues depuis longtemps par
  les utilisateurs.
cover: assets.zilliz.com/What_s_New_in_2_1_2_a0660df2a5.png
tag: News
canonicalUrl: 'https://milvus.io/blog/2022-08-05-whats-new-in-milvus-2-1.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_1_2_a0660df2a5.png" alt="What's new in Milvus 2.1 - Towards simplicity and speed" class="doc-image" id="what's-new-in-milvus-2.1---towards-simplicity-and-speed" />
   </span> <span class="img-wrapper"> <span>Quoi de neuf dans Milvus 2.1 - Vers la simplicité et la rapidité</span> </span></p>
<p>Nous sommes très heureux d'annoncer la<a href="https://milvus.io/docs/v2.1.x/release_notes.md">sortie de</a> Milvus 2.1 après six mois de travail acharné de la part de tous les contributeurs de la communauté Milvus. Cette itération majeure de la populaire base de données vectorielle met l'accent sur la <strong>performance</strong> et la <strong>facilité d'utilisation</strong>, deux mots-clés importants pour nous. Nous avons ajouté la prise en charge des chaînes de caractères, de la file d'attente de messages Kafka et de Milvus embarqué, ainsi qu'un certain nombre d'améliorations en matière de performances, d'évolutivité, de sécurité et d'observabilité. Milvus 2.1 est une mise à jour passionnante qui permettra de franchir le "dernier kilomètre" entre l'ordinateur portable de l'ingénieur en algorithmes et les services de recherche de similarités vectorielles au niveau de la production.</p>
<custom-h1>Performances - Plus de 3,2 fois plus</custom-h1><h2 id="5ms-level-latency" class="common-anchor-header">Temps de latence de 5 ms<button data-href="#5ms-level-latency" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus prend déjà en charge la recherche par approximation du plus proche voisin (ANN), ce qui représente un progrès considérable par rapport à la méthode KNN traditionnelle. Toutefois, les problèmes de débit et de latence continuent de poser des difficultés aux utilisateurs qui doivent traiter des scénarios de recherche de données vectorielles à l'échelle du milliard.</p>
<p>Milvus 2.1 comporte un nouveau protocole de routage qui ne repose plus sur les files d'attente de messages dans la liaison de recherche, ce qui réduit considérablement la latence de recherche pour les petits ensembles de données. Les résultats de nos tests montrent que Milvus ramène désormais son niveau de latence à 5 ms, ce qui répond aux exigences des liens en ligne critiques tels que la recherche de similitudes et la recommandation.</p>
<h2 id="Concurrency-control" class="common-anchor-header">Contrôle de la simultanéité<button data-href="#Concurrency-control" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 affine son modèle de concurrence en introduisant un nouveau modèle d'évaluation des coûts et un planificateur de concurrence. Il fournit désormais un contrôle de la concurrence qui garantit qu'il n'y aura pas un grand nombre de demandes concurrentes en concurrence pour les ressources de l'unité centrale et du cache, et que l'unité centrale ne sera pas sous-utilisée parce qu'il n'y a pas assez de demandes. La nouvelle couche de planification intelligente de Milvus 2.1 fusionne également les requêtes de petite taille qui ont des paramètres de requête cohérents, ce qui permet de multiplier par 3 les performances dans les scénarios de petite taille et de forte concurrence des requêtes.</p>
<h2 id="In-memory-replicas" class="common-anchor-header">Répliques en mémoire<button data-href="#In-memory-replicas" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 apporte des répliques en mémoire qui améliorent l'évolutivité et la disponibilité pour les petits ensembles de données. À l'instar des répliques en lecture seule des bases de données traditionnelles, les répliques en mémoire peuvent évoluer horizontalement en ajoutant des machines lorsque le QPS en lecture est élevé. Dans la recherche vectorielle pour les petits ensembles de données, un système de recommandation doit souvent fournir un QPS qui dépasse la limite de performance d'une seule machine. Or, dans ces scénarios, le débit du système peut être considérablement amélioré en chargeant plusieurs répliques dans la mémoire. À l'avenir, nous introduirons également un mécanisme de lecture couverte basé sur des répliques en mémoire, qui demandera rapidement d'autres copies fonctionnelles au cas où le système aurait besoin de se remettre d'une panne, et qui utilisera pleinement la redondance de la mémoire pour améliorer la disponibilité globale du système.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_1_Figure_1_excalidraw_1f7fe3c998.png" alt="In-memory replicas allow query services to be based on separate
copies of the same data." class="doc-image" id="in-memory-replicas-allow-query-services-to-be-based-on-separate-copies-of-the-same-data." />
   </span> <span class="img-wrapper"> <span>Les répliques en mémoire permettent aux services d'interrogation d'être basés sur des copies séparées des mêmes données</span>. </span></p>
<h2 id="Faster-data-loading" class="common-anchor-header">Chargement plus rapide des données<button data-href="#Faster-data-loading" class="anchor-icon" translate="no">
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
    </button></h2><p>La dernière amélioration des performances concerne le chargement des données. Milvus 2.1 compresse désormais les <a href="https://milvus.io/docs/v2.1.x/glossary.md#Log-snapshot">journaux binaires</a> avec Zstandard (zstd), ce qui réduit considérablement la taille des données dans les magasins d'objets et de messages ainsi que la surcharge du réseau pendant le chargement des données. En outre, des pools de goroutines sont désormais introduits afin que Milvus puisse charger des segments simultanément avec des empreintes mémoire contrôlées et minimiser le temps nécessaire à la récupération des pannes et au chargement des données.</p>
<p>Les résultats complets de Milvus 2.1 seront bientôt publiés sur notre site web. Restez à l'écoute.</p>
<h2 id="String-and-scalar-index-support" class="common-anchor-header">Prise en charge des chaînes et des index scalaires<button data-href="#String-and-scalar-index-support" class="anchor-icon" translate="no">
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
    </button></h2><p>Avec la version 2.1, Milvus prend désormais en charge les chaînes de caractères de longueur variable (VARCHAR) en tant que type de données scalaires. VARCHAR peut être utilisé comme clé primaire pouvant être renvoyée en sortie et peut également servir de filtre d'attribut. Le <a href="https://milvus.io/docs/v2.1.x/hybridsearch.md">filtrage d'attributs</a> est l'une des fonctions les plus demandées par les utilisateurs de Milvus. Si vous souhaitez souvent &quot;trouver les produits les plus similaires à un utilisateur dans une fourchette de prix de <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo>200-200</mo></mrow><annotation encoding="application/x-tex">-</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">200-300</span></span></span></span>&quot;, ou &quot;trouver des articles contenant le mot-clé &quot;base de données vectorielle&quot; et liés à des sujets &quot;cloud-native&quot;&quot;, vous allez adorer Milvus 2.1.</p>
<p>Milvus 2.1 prend également en charge l'index inversé scalaire pour améliorer la vitesse de filtrage sur la base de la structure de données<a href="https://www.cs.le.ac.uk/people/ond1/XMLcomp/confersWEA06_LOUDS.pdf">succincte</a><a href="https://github.com/s-yata/marisa-trie">MARISA-Tries</a>. Toutes les données peuvent désormais être chargées en mémoire avec une empreinte très faible, ce qui permet une comparaison, un filtrage et une correspondance des préfixes beaucoup plus rapides sur les chaînes de caractères. Les résultats de nos tests montrent que le besoin en mémoire de MARISA-trie n'est que de 10 % de celui des dictionnaires Python pour charger toutes les données en mémoire et fournir des capacités d'interrogation.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_new_in_Milvus_Figure_2_excalidraw_a1149aca96.png" alt="Milvus 2.1 combines MARISA-Trie with inverted index to significantly improve filtering speed." class="doc-image" id="milvus-2.1-combines-marisa-trie-with-inverted-index-to-significantly-improve-filtering-speed." />
   </span> <span class="img-wrapper"> <span>Milvus 2.1 combine MARISA-Trie avec un index inversé pour améliorer considérablement la vitesse de filtrage.</span> </span></p>
<p>À l'avenir, Milvus continuera à se concentrer sur les développements liés aux requêtes scalaires, à prendre en charge davantage de types d'index scalaires et d'opérateurs de requête, et à fournir des capacités de requête scalaire sur disque, le tout dans le cadre d'un effort continu visant à réduire les coûts de stockage et d'utilisation des données scalaires.</p>
<custom-h1>Améliorations de la convivialité</custom-h1><h2 id="Kafka-support" class="common-anchor-header">Support de Kafka<button data-href="#Kafka-support" class="anchor-icon" translate="no">
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
    </button></h2><p>Notre communauté demande depuis longtemps la prise en charge d'<a href="https://kafka.apache.org">Apache Kafka</a> en tant que <a href="https://milvus.io/docs/v2.1.x/deploy_pulsar.md">stockage de messages</a> dans Milvus. Milvus 2.1 vous offre désormais la possibilité d'utiliser<a href="https://pulsar.apache.org">Pulsar</a> ou Kafka en tant que stockage de messages en fonction des configurations de l'utilisateur, grâce à la conception d'abstraction et d'encapsulation de Milvus et au SDK Go Kafka fourni par Confluent.</p>
<h2 id="Production-ready-Java-SDK" class="common-anchor-header">SDK Java prêt pour la production<button data-href="#Production-ready-Java-SDK" class="anchor-icon" translate="no">
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
    </button></h2><p>Avec Milvus 2.1, notre <a href="https://github.com/milvus-io/milvus-sdk-java">SDK Java</a> est maintenant officiellement publié. Le SDK Java possède exactement les mêmes capacités que le SDK Python, avec des performances concurrentielles encore meilleures. Au cours de la prochaine étape, les contributeurs de notre communauté amélioreront progressivement la documentation et les cas d'utilisation du SDK Java, et contribueront à faire passer les SDK Go et RESTful au stade de la production prête.</p>
<h2 id="Observability-and-maintainability" class="common-anchor-header">Observabilité et maintenabilité<button data-href="#Observability-and-maintainability" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 ajoute d'importantes<a href="https://milvus.io/docs/v2.1.x/metrics_dashboard.md">mesures de</a> surveillance telles que le nombre d'insertions de vecteurs, la latence/le débit de recherche, la surcharge de la mémoire du nœud et la surcharge de l'unité centrale. En outre, la nouvelle version optimise considérablement la tenue des journaux en ajustant les niveaux de journaux et en réduisant l'impression de journaux inutiles.</p>
<h2 id="Embedded-Milvus" class="common-anchor-header">Milvus embarqué<button data-href="#Embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus a considérablement simplifié le déploiement de services de recherche de données vectorielles massives à grande échelle, mais pour les scientifiques qui souhaitent valider des algorithmes à plus petite échelle, Docker ou K8s sont encore trop compliqués. Avec l'introduction de <a href="https://github.com/milvus-io/embd-milvus">Milvus embarqué</a>, vous pouvez désormais installer Milvus à l'aide de pip, tout comme avec Pyrocksb et Pysqlite. Milvus embarqué prend en charge toutes les fonctionnalités des versions cluster et autonome, ce qui vous permet de passer facilement de votre ordinateur portable à un environnement de production distribué sans changer une seule ligne de code. Les ingénieurs en algorithmique auront une bien meilleure expérience lorsqu'ils construiront un prototype avec Milvus.</p>
<custom-h1>Essayez la recherche vectorielle prête à l'emploi dès maintenant</custom-h1><p>En outre, Milvus 2.1 présente également d'importantes améliorations en termes de stabilité et d'évolutivité, et nous attendons avec impatience votre utilisation et vos commentaires.</p>
<h2 id="Whats-next" class="common-anchor-header">Les prochaines étapes<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
<li>Voir les <a href="https://milvus.io/docs/v2.1.x/release_notes.md">notes de mise à jour</a> détaillées pour tous les changements dans Milvus 2.1.</li>
<li><a href="https://milvus.io/docs/v2.1.x/install_standalone-docker.md">Installer</a>Milvus 2.1 et essayer les nouvelles fonctionnalités</li>
<li>Rejoignez notre <a href="https://slack.milvus.io/">communauté Slack</a> et discutez des nouvelles fonctionnalités avec des milliers d'utilisateurs de Milvus dans le monde entier.</li>
<li>Suivez-nous sur <a href="https://twitter.com/milvusio">Twitter</a> et<a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> pour recevoir des mises à jour dès que nos blogs sur les nouvelles fonctionnalités spécifiques sont publiés.</li>
</ul>
<blockquote>
<p>Édité par <a href="https://github.com/songxianj">Songxian Jiang</a></p>
</blockquote>
