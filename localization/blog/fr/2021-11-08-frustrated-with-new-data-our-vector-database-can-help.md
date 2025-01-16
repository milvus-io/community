---
id: 2021-11-08-frustrated-with-new-data-our-vector-database-can-help.md
title: Introduction
author: Zilliz
date: 2021-11-08T00:00:00.000Z
desc: >-
  Conception et pratique de systèmes de bases de données vectorielles
  polyvalentes orientées vers l'IA
cover: assets.zilliz.com/Frustrated_with_new_data_5051d3ad15.png
tag: Engineering
---
<custom-h1>Frustré par les nouvelles données ? Notre base de données vectorielle peut vous aider</custom-h1><p>À l'ère du Big Data, quelles technologies et applications de base de données seront sous les feux de la rampe ? Qu'est-ce qui va changer la donne ?</p>
<p>Les données non structurées représentant environ 80 à 90 % de toutes les données stockées, que sommes-nous censés faire de ces lacs de données en pleine expansion ? On pourrait penser à utiliser les méthodes d'analyse traditionnelles, mais celles-ci ne permettent pas de tirer des informations utiles, voire pas d'informations du tout. Pour répondre à cette question, les "trois mousquetaires" de l'équipe de recherche et développement de Zilliz, Rentong Guo, Xiaofan Luan et Xiaomeng Yi, ont cosigné un article sur la conception d'un système de base de données vectorielles à usage général et sur les défis à relever dans ce domaine.</p>
<p>Cet article a été publié dans Programmer, un journal produit par CSDN, la plus grande communauté de développeurs de logiciels en Chine. Ce numéro de Programmer contient également des articles de Jeffrey Ullman, lauréat du prix Turing 2020, Yann LeCun, lauréat du prix Turing 2018, Mark Porter, directeur technique de MongoDB, Zhenkun Yang, fondateur d'OceanBase, Dongxu Huang, fondateur de PingCAP, etc.</p>
<p>Nous partageons avec vous l'intégralité de l'article ci-dessous :</p>
<custom-h1>Conception et pratique des systèmes de bases de données vectorielles polyvalentes orientées vers l'IA</custom-h1><h2 id="Introduction" class="common-anchor-header">Introduction<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Les applications de données modernes peuvent facilement traiter les données structurées, qui représentent environ 20 % des données actuelles. Dans leur boîte à outils se trouvent des systèmes tels que les bases de données relationnelles, les bases de données NoSQL, etc. En revanche, les données non structurées, qui représentent environ 80 % de l'ensemble des données, ne disposent d'aucun système fiable. Pour résoudre ce problème, cet article aborde les difficultés rencontrées par l'analyse traditionnelle des données non structurées, ainsi que l'architecture et les défis auxquels nous avons été confrontés lors de la création de notre propre système de base de données vectorielles à usage général.</p>
<h2 id="Data-Revolution-in-the-AI-era" class="common-anchor-header">Révolution des données à l'ère de l'IA<button data-href="#Data-Revolution-in-the-AI-era" class="anchor-icon" translate="no">
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
    </button></h2><p>Avec le développement rapide de la 5G et des technologies IoT, les industries cherchent à multiplier leurs canaux de collecte de données et à projeter davantage le monde réel dans l'espace numérique. Bien que cela ait engendré d'énormes défis, cela a également apporté d'énormes avantages à l'industrie en pleine croissance. L'un de ces défis est de savoir comment obtenir des informations plus approfondies à partir de ces nouvelles données.</p>
<p>Selon les statistiques d'IDC, plus de 40 000 exaoctets de nouvelles données ont été générés dans le monde rien qu'en 2020. Sur ce total, seuls 20 % sont des données structurées, c'est-à-dire des données très ordonnées et faciles à organiser et à analyser par le biais de calculs numériques et d'algèbre relationnelle. En revanche, les données non structurées (qui représentent les 80 % restants) sont extrêmement riches en variations de types de données, ce qui rend difficile la découverte de la sémantique profonde au moyen des méthodes traditionnelles d'analyse des données.</p>
<p>Heureusement, nous assistons à une évolution rapide et simultanée des données non structurées et de l'IA, cette dernière nous permettant de mieux comprendre les données grâce à différents types de réseaux neuronaux, comme le montre la figure 1.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata1_d5c34497d0.jpeg" alt="newdata1.jpeg" class="doc-image" id="newdata1.jpeg" />
   </span> <span class="img-wrapper"> <span>newdata1.jpeg</span> </span></p>
<p>La technologie d'intégration a rapidement gagné en popularité après les débuts de Word2vec, l'idée de "tout intégrer" atteignant tous les secteurs de l'apprentissage automatique. Cela conduit à l'émergence de deux couches de données principales : la couche de données brutes et la couche de données vectorielles. La couche de données brutes est composée de données non structurées et de certains types de données structurées ; la couche de données vectorielles est la collection d'enchâssements facilement analysables provenant de la couche brute et passant par des modèles d'apprentissage automatique.</p>
<p>Par rapport aux données brutes, les données vectorisées présentent les avantages suivants :</p>
<ul>
<li>Les vecteurs d'intégration sont un type abstrait de données, ce qui signifie que nous pouvons construire un système d'algèbre unifié dédié à la réduction de la complexité des données non structurées.</li>
<li>Les vecteurs d'intégration sont exprimés par des vecteurs denses à virgule flottante, ce qui permet aux applications de tirer parti de la technologie SIMD. SIMD étant pris en charge par les GPU et la quasi-totalité des CPU modernes, les calculs sur les vecteurs peuvent atteindre des performances élevées à un coût relativement faible.</li>
<li>Les données vectorielles encodées via des modèles d'apprentissage automatique occupent moins d'espace de stockage que les données non structurées d'origine, ce qui permet d'augmenter le débit.</li>
<li>L'arithmétique peut également être effectuée à travers les vecteurs d'intégration. La figure 2 montre un exemple de correspondance sémantique approximative multimodale - les images montrées dans la figure sont le résultat de la correspondance entre les vecteurs d'intégration de mots et les vecteurs d'intégration d'images.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata2_14e0554305.png" alt="newdata2.png" class="doc-image" id="newdata2.png" />
   </span> <span class="img-wrapper"> <span>newdata2.png</span> </span></p>
<p>Comme le montre la figure 3, la combinaison de la sémantique des images et des mots peut être réalisée par une simple addition et soustraction de vecteurs à travers leurs encastrements correspondants.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata3_3c71fc56b9.png" alt="newdata3.png" class="doc-image" id="newdata3.png" />
   </span> <span class="img-wrapper"> <span>newdata3.png</span> </span></p>
<p>Outre les caractéristiques susmentionnées, ces opérateurs prennent en charge des requêtes plus complexes dans des scénarios pratiques. La recommandation de contenu en est un exemple bien connu. En général, le système intègre à la fois le contenu et les préférences de visualisation des utilisateurs. Ensuite, le système fait correspondre les préférences de l'utilisateur avec le contenu intégré le plus similaire par le biais d'une analyse de similarité sémantique, ce qui permet d'obtenir un nouveau contenu similaire aux préférences de l'utilisateur. Cette couche de données vectorielles ne se limite pas aux systèmes de recommandation, les cas d'utilisation comprennent le commerce électronique, l'analyse des logiciels malveillants, l'analyse des données, la vérification biométrique, l'analyse des formules chimiques, la finance, l'assurance, etc.</p>
<h2 id="Unstructured-data-requires-a-complete-basic-software-stack" class="common-anchor-header">Les données non structurées nécessitent une pile logicielle de base complète<button data-href="#Unstructured-data-requires-a-complete-basic-software-stack" class="anchor-icon" translate="no">
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
    </button></h2><p>Les logiciels système sont à la base de toutes les applications orientées données, mais les logiciels système construits au cours des dernières décennies, par exemple les bases de données, les moteurs d'analyse de données, etc. sont destinés à traiter des données structurées. Les applications de données modernes reposent presque exclusivement sur des données non structurées et ne bénéficient pas des systèmes de gestion de base de données traditionnels.</p>
<p>Pour résoudre ce problème, nous avons développé et mis en libre accès un système de base de données vectorielles polyvalent orienté vers l'IA, appelé <em>Milvus</em> (références 1~2). Par rapport aux systèmes de base de données traditionnels, Milvus travaille sur une couche de données différente. Les bases de données traditionnelles, telles que les bases de données relationnelles, les bases de données KV, les bases de données textuelles, les bases de données images/vidéo, etc... travaillent sur la couche de données brutes, tandis que Milvus travaille sur la couche de données vectorielles.</p>
<p>Dans les chapitres suivants, nous examinerons les nouvelles caractéristiques, la conception architecturale et les défis techniques auxquels nous avons été confrontés lors de la construction de Milvus.</p>
<h2 id="Major-attributes-of-vector-database" class="common-anchor-header">Principaux attributs d'une base de données vectorielle<button data-href="#Major-attributes-of-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Les bases de données vectorielles stockent, récupèrent et analysent les vecteurs et, comme toute autre base de données, fournissent également une interface standard pour les opérations CRUD. En plus de ces caractéristiques "standard", les attributs énumérés ci-dessous sont également des qualités importantes pour une base de données vectorielle :</p>
<ul>
<li><strong>Prise en charge des opérateurs vectoriels à haute efficacité</strong></li>
</ul>
<p>La prise en charge des opérateurs vectoriels dans un moteur d'analyse s'effectue à deux niveaux. Tout d'abord, la base de données vectorielles doit prendre en charge différents types d'opérateurs, par exemple la correspondance de similarité sémantique et l'arithmétique sémantique mentionnées ci-dessus. En outre, elle doit prendre en charge une variété de métriques de similarité pour les calculs de similarité sous-jacents. Cette similarité est généralement quantifiée en tant que distance spatiale entre les vecteurs, les mesures courantes étant la distance euclidienne, la distance cosinus et la distance du produit intérieur.</p>
<ul>
<li><strong>Aide à l'indexation des vecteurs</strong></li>
</ul>
<p>Comparés aux index B-tree ou LSM-tree des bases de données traditionnelles, les index vectoriels à haute dimension consomment généralement beaucoup plus de ressources informatiques. Nous recommandons d'utiliser des algorithmes de clustering et d'index graphique, et de donner la priorité aux opérations matricielles et vectorielles, ce qui permet de tirer pleinement parti des capacités d'accélération matérielle du calcul vectoriel mentionnées précédemment.</p>
<ul>
<li><strong>Une expérience utilisateur cohérente dans différents environnements de déploiement</strong></li>
</ul>
<p>Les bases de données vectorielles sont généralement développées et déployées dans différents environnements. Au stade préliminaire, les scientifiques des données et les ingénieurs en algorithmes travaillent principalement sur leurs ordinateurs portables et leurs stations de travail, car ils accordent plus d'attention à l'efficacité de la vérification et à la vitesse d'itération. Une fois la vérification terminée, ils peuvent déployer la base de données complète sur un cluster privé ou dans le nuage. Par conséquent, un système de base de données vectorielles qualifié doit offrir des performances et une expérience utilisateur cohérentes dans différents environnements de déploiement.</p>
<ul>
<li><strong>Prise en charge de la recherche hybride</strong></li>
</ul>
<p>De nouvelles applications apparaissent à mesure que les bases de données vectorielles deviennent omniprésentes. Parmi toutes ces demandes, la plus fréquemment mentionnée est la recherche hybride sur des vecteurs et d'autres types de données. Quelques exemples : la recherche approximative du plus proche voisin (ANNS) après filtrage scalaire, le rappel multicanal à partir d'une recherche plein texte et d'une recherche vectorielle, et la recherche hybride de données spatio-temporelles et de données vectorielles. Ces défis exigent une évolutivité élastique et une optimisation des requêtes pour fusionner efficacement les moteurs de recherche vectoriels avec les moteurs de recherche KV, textuels et autres.</p>
<ul>
<li><strong>Architecture native dans le nuage</strong></li>
</ul>
<p>Le volume des données vectorielles augmente avec la croissance exponentielle de la collecte de données. Les données vectorielles de haute dimension à l'échelle du trillion correspondent à des milliers de To de stockage, ce qui dépasse de loin la limite d'un seul nœud. Par conséquent, l'extensibilité horizontale est une capacité clé pour une base de données vectorielle, et devrait satisfaire les demandes des utilisateurs en matière d'élasticité et d'agilité de déploiement. En outre, elle devrait également réduire la complexité de l'exploitation et de la maintenance du système tout en améliorant l'observabilité avec l'aide de l'infrastructure en nuage. Certains de ces besoins se présentent sous la forme d'une isolation multi-locataires, d'un instantané et d'une sauvegarde des données, d'un cryptage des données et d'une visualisation des données, qui sont courants dans les bases de données traditionnelles.</p>
<h2 id="Vector-database-system-architecture" class="common-anchor-header">Architecture du système de base de données vectorielle<button data-href="#Vector-database-system-architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.0 suit les principes de conception &quot;log as data&quot;, &quot;unified batch and stream processing&quot;, &quot;stateless&quot; et &quot;micro-services&quot;. La figure 4 illustre l'architecture globale de Milvus 2.0.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata4_b7f3ab6969.png" alt="newdata4.png" class="doc-image" id="newdata4.png" />
   </span> <span class="img-wrapper"> <span>newdata4.png</span> </span></p>
<p><strong>Le journal en tant que données</strong>: Milvus 2.0 ne gère aucune table physique. Au lieu de cela, il assure la fiabilité des données grâce à la persistance des journaux et aux instantanés de journaux. Le courtier de journaux (l'épine dorsale du système) stocke les journaux et découple les composants et les services par le biais du mécanisme de publication-souscription de journaux (pub-sub). Comme le montre la figure 5, le courtier en journaux se compose d'une &quot;séquence de journaux&quot; et d'un &quot;abonné aux journaux&quot;. La séquence de journaux enregistre toutes les opérations qui modifient l'état d'une collection (équivalente à une table dans une base de données relationnelle) ; l'abonné aux journaux s'abonne à la séquence de journaux pour mettre à jour ses données locales et fournir des services sous la forme de copies en lecture seule. Le mécanisme pub-sub permet également d'étendre le système en termes de capture de données de changement (CDC) et de déploiement distribué à l'échelle mondiale.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata5_853dd38bc3.png" alt="newdata5.png" class="doc-image" id="newdata5.png" />
   </span> <span class="img-wrapper"> <span>newdata5.png</span> </span></p>
<p><strong>Traitement unifié des lots et des flux</strong>: Le traitement en continu des journaux permet à Milvus de mettre à jour les données en temps réel, garantissant ainsi une livraison en temps réel. En outre, en transformant les lots de données en instantanés de journaux et en créant un index sur les instantanés, Milvus est en mesure d'améliorer l'efficacité des requêtes. Lors d'une interrogation, Milvus fusionne les résultats de l'interrogation à partir des données incrémentielles et des données historiques afin de garantir l'intégralité des données renvoyées. Cette conception permet de mieux équilibrer les performances en temps réel et l'efficacité, ce qui allège la charge de maintenance des systèmes en ligne et hors ligne par rapport à l'architecture Lambda traditionnelle.</p>
<p><strong>Sans état</strong>: L'infrastructure cloud et les composants de stockage open-source libèrent Milvus de la persistance des données au sein de ses propres composants. Milvus 2.0 conserve les données à l'aide de trois types de stockage : le stockage des métadonnées, le stockage des journaux et le stockage des objets. Le stockage des métadonnées ne se contente pas de stocker les métadonnées, mais gère également la découverte des services et la gestion des nœuds. Le stockage des journaux assure la persistance incrémentielle des données et la publication et l'abonnement des données. Le stockage d'objets stocke les instantanés de journaux, les index et certains résultats de calculs intermédiaires.</p>
<p><strong>Microservices</strong>: Milvus suit les principes de désagrégation du plan de données et du plan de contrôle, de séparation lecture/écriture et de séparation des tâches en ligne/hors ligne. Il est composé de quatre couches de service : la couche d'accès, la couche de coordination, la couche de travail et la couche de stockage. Ces couches sont mutuellement indépendantes en ce qui concerne la mise à l'échelle et la reprise après sinistre. En tant que couche frontale et point final de l'utilisateur, la couche d'accès gère les connexions des clients, valide leurs demandes et combine les résultats des requêtes. En tant que &quot;cerveau&quot; du système, la couche de coordination se charge de la gestion de la topologie de la grappe, de l'équilibrage de la charge, de la déclaration des données et de la gestion des données. La couche des travailleurs contient les "membres" du système, exécutant les mises à jour de données, les requêtes et les opérations de construction d'index. Enfin, la couche de stockage est chargée de la persistance et de la réplication des données. Dans l'ensemble, cette conception basée sur les microservices garantit une complexité contrôlable du système, chaque composant étant responsable de sa propre fonction. Milvus clarifie les limites des services grâce à des interfaces bien définies et découple les services en fonction d'une granularité plus fine, ce qui optimise encore l'évolutivité élastique et la distribution des ressources.</p>
<h2 id="Technical-challenges-faced-by-vector-databases" class="common-anchor-header">Défis techniques rencontrés par les bases de données vectorielles<button data-href="#Technical-challenges-faced-by-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Les premières recherches sur les bases de données vectorielles étaient principalement axées sur la conception de structures d'index et de méthodes d'interrogation à haut rendement, ce qui a donné lieu à diverses bibliothèques d'algorithmes de recherche vectorielle (références n° 3~5). Au cours des dernières années, un nombre croissant d'équipes d'universitaires et d'ingénieurs ont jeté un regard neuf sur les problèmes de recherche vectorielle du point de vue de la conception du système et ont proposé des solutions systématiques. En résumant les études existantes et la demande des utilisateurs, nous classons les principaux défis techniques pour les bases de données vectorielles comme suit :</p>
<ul>
<li><strong>Optimisation du rapport coût/performance en fonction de la charge</strong></li>
</ul>
<p>Par rapport aux types de données traditionnels, l'analyse des données vectorielles nécessite beaucoup plus de ressources de stockage et de calcul en raison de leur haute dimensionnalité. De plus, les utilisateurs ont montré des préférences diverses pour les caractéristiques de charge et l'optimisation du rapport coût/performance des solutions de recherche vectorielle. Par exemple, les utilisateurs qui travaillent avec des ensembles de données extrêmement volumineux (des dizaines ou des centaines de milliards de vecteurs) préféreraient des solutions dont les coûts de stockage des données sont moins élevés et dont la latence de recherche varie, tandis que d'autres pourraient exiger des performances de recherche plus élevées et une latence moyenne qui ne varie pas. Pour répondre à des préférences aussi diverses, l'index central de la base de données vectorielles doit pouvoir prendre en charge des structures d'index et des algorithmes de recherche avec différents types de matériel de stockage et de calcul.</p>
<p>Par exemple, le stockage des données vectorielles et des données d'index correspondantes sur des supports de stockage moins coûteux (tels que NVM et SSD) devrait être pris en considération pour réduire les coûts de stockage. Cependant, la plupart des algorithmes de recherche vectorielle existants fonctionnent sur des données lues directement depuis la mémoire. Pour éviter les pertes de performances dues à l'utilisation de disques, la base de données vectorielle doit pouvoir exploiter la localité de l'accès aux données en combinaison avec les algorithmes de recherche et s'adapter aux solutions de stockage pour les données vectorielles et la structure de l'index (Référence n° 6~8). Pour améliorer les performances, la recherche contemporaine s'est concentrée sur les technologies d'accélération matérielle impliquant les GPU, NPU, FPGA, etc. (Référence n° 9). Cependant, le matériel et les puces spécifiques à l'accélération varient dans leur architecture, et le problème de l'exécution la plus efficace entre différents accélérateurs matériels n'est pas encore résolu.</p>
<ul>
<li><strong>Configuration et réglage automatisés du système</strong></li>
</ul>
<p>La plupart des études existantes sur les algorithmes de recherche vectorielle recherchent un équilibre souple entre les coûts de stockage, les performances de calcul et la précision de la recherche. En général, les paramètres de l'algorithme et les caractéristiques des données influencent les performances réelles d'un algorithme. Comme les demandes des utilisateurs diffèrent en termes de coûts et de performances, la sélection d'une méthode de recherche vectorielle adaptée à leurs besoins et aux caractéristiques des données représente un défi important.</p>
<p>Néanmoins, les méthodes manuelles d'analyse des effets de la distribution des données sur les algorithmes de recherche ne sont pas efficaces en raison de la haute dimensionnalité des données vectorielles. Pour résoudre ce problème, le monde universitaire et l'industrie recherchent des solutions de recommandation d'algorithmes basées sur l'apprentissage automatique (référence n° 10).</p>
<p>La conception d'un algorithme de recherche vectorielle intelligent basé sur l'apprentissage automatique est également un point chaud de la recherche. D'une manière générale, les algorithmes de recherche vectorielle existants sont développés de manière universelle pour des données vectorielles de dimension et de distribution variées. Par conséquent, ils ne prennent pas en charge des structures d'index spécifiques en fonction des caractéristiques des données, ce qui laisse peu de place à l'optimisation. Les études futures devraient également explorer les technologies efficaces d'apprentissage automatique qui peuvent adapter les structures d'index aux différentes caractéristiques des données (référence n° 11-12).</p>
<ul>
<li><strong>Prise en charge de la sémantique des requêtes avancées</strong></li>
</ul>
<p>Les applications modernes s'appuient souvent sur des requêtes plus avancées à travers les vecteurs - la sémantique traditionnelle de recherche du plus proche voisin n'est plus applicable à la recherche de données vectorielles. En outre, la demande de recherche combinée sur plusieurs bases de données vectorielles ou sur des données vectorielles et non vectorielles est en train d'émerger (référence n° 13).</p>
<p>Plus précisément, les variations dans les mesures de distance pour la similarité vectorielle augmentent rapidement. Les scores de similarité traditionnels, tels que la distance euclidienne, la distance du produit intérieur et la distance cosinus ne peuvent pas répondre à toutes les demandes d'application. Avec la popularisation de la technologie de l'intelligence artificielle, de nombreuses industries développent leurs propres mesures de similarité vectorielle spécifiques, telles que la distance de Tanimoto, la distance de Mahalanobis, la superstructure et la sous-structure. L'intégration de ces mesures d'évaluation dans les algorithmes de recherche existants et la conception de nouveaux algorithmes utilisant ces mesures sont deux problèmes de recherche difficiles.</p>
<p>Avec l'augmentation de la complexité des services aux utilisateurs, les applications devront effectuer des recherches dans des données vectorielles et non vectorielles. Par exemple, un système de recommandation de contenu analyse les préférences des utilisateurs, leurs relations sociales, et les associe aux sujets d'actualité afin de proposer le contenu approprié aux utilisateurs. Ces recherches impliquent normalement des requêtes sur plusieurs types de données ou sur plusieurs systèmes de traitement de données. La prise en charge de ces recherches hybrides de manière efficace et flexible constitue un autre défi pour la conception des systèmes.</p>
<h2 id="Authors" class="common-anchor-header">Auteurs<button data-href="#Authors" class="anchor-icon" translate="no">
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
    </button></h2><p>Rentong Guo (docteur en logiciels et théories informatiques, Huazhong University of Science and Technology), partenaire et directeur R&amp;D de Zilliz. Il est membre du Comité technique de la Fédération informatique de Chine sur l'informatique et le traitement distribués (CCF TCDCP). Ses recherches portent sur les bases de données, les systèmes distribués, les systèmes de mise en cache et l'informatique hétérogène. Ses travaux de recherche ont été publiés dans plusieurs conférences et revues de premier plan, notamment Usenix ATC, ICS, DATE, TPDS. En tant qu'architecte de Milvus, M. Guo recherche des solutions pour développer des systèmes d'analyse de données basés sur l'IA qui soient hautement évolutifs et rentables.</p>
<p>Xiaofan Luan, partenaire et directeur technique de Zilliz, et membre du comité consultatif technique de la LF AI &amp; Data Foundation. Il a travaillé successivement au siège américain d'Oracle et chez Hedvig, une startup spécialisée dans le stockage défini par logiciel. Il a rejoint l'équipe Alibaba Cloud Database et a été chargé du développement des bases de données NoSQL HBase et Lindorm. Luan a obtenu une maîtrise en ingénierie électronique et informatique à l'université de Cornell.</p>
<p>Xiaomeng Yi (doctorat en architecture informatique, Huazhong University of Science and Technology), chercheur principal et chef de l'équipe de recherche de Zilliz. Ses recherches se concentrent sur la gestion des données en haute dimension, la recherche d'informations à grande échelle et l'allocation des ressources dans les systèmes distribués. Les travaux de recherche de M. Yi ont été publiés dans des revues de premier plan et lors de conférences internationales, notamment IEEE Network Magazine, IEEE/ACM TON, ACM SIGMOD, IEEE ICDCS et ACM TOMPECS.</p>
<p>Filip Haltmayer, ingénieur de données chez Zilliz, est diplômé de l'université de Californie, à Santa Cruz, où il a obtenu une licence en informatique. Depuis qu'il a rejoint Zilliz, Filip passe le plus clair de son temps à travailler sur les déploiements dans le cloud, les interactions avec les clients, les conférences techniques et le développement d'applications d'IA.</p>
<h2 id="References" class="common-anchor-header">Références<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>Projet Milvus : https://github.com/milvus-io/milvus</li>
<li>Milvus : A Purpose-Built Vector Data Management System (Système de gestion de données vectorielles conçu à cet effet), SIGMOD'21</li>
<li>Projet Faiss : https://github.com/facebookresearch/faiss</li>
<li>Projet Annoy : https://github.com/spotify/annoy</li>
<li>Projet SPTAG : https://github.com/microsoft/SPTAG</li>
<li>GRIP : Multi-Store Capacity-Optimized High-Performance Nearest Neighbor Search for Vector Search Engine, CIKM'19</li>
<li>DiskANN : Fast Accurate Billion-point Nearest Neighbor Search on a Single Node, NIPS'19</li>
<li>HM-ANN : Efficient Billion-Point Nearest Neighbor Search on Heterogeneous Memory (recherche efficace de milliards de points dans le voisinage le plus proche sur une mémoire hétérogène), NIPS'20</li>
<li>SONG : Approximate Nearest Neighbor Search on GPU (Recherche approximative du plus proche voisin sur GPU), ICDE'20</li>
<li>A demonstration of the ottertune automatic database management system tuning service, VLDB'18</li>
<li>The Case for Learned Index Structures, SIGMOD'18</li>
<li>Improving Approximate Nearest Neighbor Search through Learned Adaptive Early Termination (Amélioration de la recherche approximative du plus proche voisin grâce à la terminaison anticipée adaptative apprise), SIGMOD'20</li>
<li>AnalyticDB-V : A Hybrid Analytical Engine Towards Query Fusion for Structured and Unstructured Data (Un moteur analytique hybride vers la fusion de requêtes pour des données structurées et non structurées), VLDB'20</li>
</ol>
<h2 id="Engage-with-our-open-source-community" class="common-anchor-header">Participez à notre communauté open-source :<button data-href="#Engage-with-our-open-source-community" class="anchor-icon" translate="no">
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
<li>Trouvez ou contribuez à Milvus sur <a href="https://bit.ly/3khejQB">GitHub</a>.</li>
<li>Interagissez avec la communauté via le <a href="https://bit.ly/307HVsY">forum</a>.</li>
<li>Connectez-vous avec nous sur <a href="https://bit.ly/3wn5aek">Twitter</a>.</li>
</ul>
