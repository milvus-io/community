---
id: intelligent-wardrobe-customization-system.md
title: >-
  Création d'un système intelligent de personnalisation de garde-robe à partir
  de la base de données vectorielle Milvus
author: Yiyun Ni
date: 2022-07-08T00:00:00.000Z
desc: >-
  L'utilisation de la technologie de recherche par similarité permet de libérer
  le potentiel des données non structurées, y compris les armoires et leurs
  composants !
cover: assets.zilliz.com/Frame_1282_edc1fb7d99.png
tag: Engineering
tags: >-
  Data science, Database, Use Cases of Milvus, Artificial Intelligence, Vector
  Management
canonicalUrl: 'https://milvus.io/blog/intelligent-wardrobe-customization-system.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1282_edc1fb7d99.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>image de couverture</span> </span></p>
<p>Si vous cherchez une armoire qui s'adapte parfaitement à votre chambre ou à votre cabine d'essayage, je parie que la plupart des gens penseront à celles qui sont faites sur mesure. Cependant, tout le monde n'a pas un budget aussi élevé. Qu'en est-il alors des armoires prêtes à l'emploi ? Le problème avec ce type d'armoire est qu'elles risquent fort de ne pas répondre à vos attentes, car elles ne sont pas assez flexibles pour répondre à vos besoins uniques en matière de rangement. De plus, lors d'une recherche en ligne, il est assez difficile de résumer le type particulier d'armoire que vous recherchez à l'aide de mots-clés. Il est très probable que le mot clé que vous tapez dans la boîte de recherche (par exemple, une armoire avec un plateau à bijoux) soit très différent de la façon dont il est défini dans le moteur de recherche (par exemple, une armoire avec un <a href="https://www.ikea.com/us/en/p/komplement-pull-out-tray-with-insert-black-brown-s79249366/">plateau extractible et un insert</a>).</p>
<p>Mais grâce aux technologies émergentes, il existe une solution ! IKEA, le conglomérat de vente de meubles, propose un outil de conception populaire <a href="https://www.ikea.com/us/en/rooms/bedroom/how-to/how-to-design-your-perfect-pax-wardrobe-pub8b76dda0">, PAX wardrobe</a>, qui permet aux utilisateurs de choisir parmi un certain nombre d'armoires prêtes à l'emploi et d'en personnaliser la couleur, la taille et l'aménagement intérieur. Que vous ayez besoin d'un espace de suspension, de plusieurs étagères ou de tiroirs internes, ce système intelligent de personnalisation des penderies peut toujours répondre à vos besoins.</p>
<p>Pour trouver ou construire votre armoire idéale à l'aide de ce système intelligent de conception d'armoires, vous devez :</p>
<ol>
<li>Spécifier les exigences de base - la forme (normale, en L ou en U), la longueur et la profondeur de l'armoire.</li>
<li>Spécifier vos besoins de rangement et l'organisation intérieure de l'armoire (par exemple, un espace de suspension, un porte-pantalon coulissant, etc. est nécessaire).</li>
<li>Ajoutez ou retirez des éléments de l'armoire tels que des tiroirs ou des étagères.</li>
</ol>
<p>Votre projet est alors terminé. Simple et facile !</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Pax_system_ff4c3fa182.png" alt="pax system" class="doc-image" id="pax-system" />
   </span> <span class="img-wrapper"> <span>système pax</span> </span></p>
<p>La <a href="https://zilliz.com/learn/what-is-vector-database">base de données vectorielle</a> est un élément essentiel qui rend possible un tel système de conception de garde-robe. Cet article vise donc à présenter le flux de travail et les solutions de recherche de similarités utilisés pour construire un système intelligent de personnalisation de garde-robe basé sur la recherche de similarités vectorielles.</p>
<p>Aller à :</p>
<ul>
<li><a href="#System-overview">Vue d'ensemble du système</a></li>
<li><a href="#Data-flow">Flux de données</a></li>
<li><a href="#System-demo">Démonstration du système</a></li>
</ul>
<h2 id="System-Overview" class="common-anchor-header">Vue d'ensemble du système<button data-href="#System-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Afin de fournir un outil de personnalisation de garde-robe aussi intelligent, nous devons d'abord définir la logique d'entreprise et comprendre les attributs des articles et le parcours de l'utilisateur. Les penderies et leurs composants tels que les tiroirs, les plateaux et les étagères sont des données non structurées. Par conséquent, la deuxième étape consiste à exploiter les algorithmes et les règles d'IA, les connaissances préalables, la description des articles, etc., pour convertir ces données non structurées en un type de données compréhensibles par les ordinateurs : les vecteurs !</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Customization_tool_overview_86d62e1730.png" alt="Customization tool overview" class="doc-image" id="customization-tool-overview" />
   </span> <span class="img-wrapper"> <span>Présentation de l'outil de personnalisation</span> </span></p>
<p>Avec les vecteurs générés, nous avons besoin de bases de données vectorielles et de moteurs de recherche puissants pour les traiter.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/tool_architecutre_33fb646954.png" alt="tool architecture" class="doc-image" id="tool-architecture" />
   </span> <span class="img-wrapper"> <span>Architecture de l'outil</span> </span></p>
<p>L'outil de personnalisation exploite certains des moteurs de recherche et des bases de données les plus populaires : Elasticsearch, <a href="https://milvus.io/">Milvus</a> et PostgreSQL.</p>
<h3 id="Why-Milvus" class="common-anchor-header">Pourquoi Milvus ?</h3><p>Une garde-robe contient des informations très complexes, telles que la couleur, la forme, l'organisation intérieure, etc. Cependant, la méthode traditionnelle consistant à conserver les données relatives à la garde-robe dans une base de données relationnelle est loin d'être suffisante. Une méthode courante consiste à utiliser des techniques d'intégration pour convertir les garde-robes en vecteurs. Nous devons donc rechercher un nouveau type de base de données spécialement conçu pour le stockage de vecteurs et la recherche de similitudes. Après avoir étudié plusieurs solutions populaires, la base de données vectorielles <a href="https://github.com/milvus-io/milvus">Milvus</a> a été sélectionnée pour ses excellentes performances, sa stabilité, sa compatibilité et sa facilité d'utilisation. Le tableau ci-dessous est une comparaison de plusieurs solutions populaires de recherche vectorielle.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Solution_comparison_d96b8f1dd5.png" alt="solution comparison" class="doc-image" id="solution-comparison" />
   </span> <span class="img-wrapper"> <span>comparaison des solutions</span> </span></p>
<h3 id="System-workflow" class="common-anchor-header">Flux de travail du système</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/System_workflow_250c275ec1.png" alt="System workflow" class="doc-image" id="system-workflow" />
   </span> <span class="img-wrapper"> <span>Flux de travail du système</span> </span></p>
<p>Elasticsearch est utilisé pour un filtrage grossier par taille de garde-robe, couleur, etc. Les résultats filtrés passent ensuite par Milvus, la base de données vectorielle, pour une recherche de similarité et les résultats sont classés en fonction de leur distance/similarité avec le vecteur de la requête. Enfin, les résultats sont consolidés et affinés sur la base d'informations commerciales.</p>
<h2 id="Data-flow" class="common-anchor-header">Flux de données<button data-href="#Data-flow" class="anchor-icon" translate="no">
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
    </button></h2><p>Le système de personnalisation de la garde-robe est très similaire aux moteurs de recherche traditionnels et aux systèmes de recommandation. Il comprend trois parties :</p>
<ul>
<li>La préparation des données hors ligne, y compris la définition et la génération des données.</li>
<li>Les services en ligne, y compris le rappel et le classement.</li>
<li>Le post-traitement des données basé sur la logique d'entreprise.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_flow_d0d9fa0fca.png" alt="Data flow" class="doc-image" id="data-flow" />
   </span> <span class="img-wrapper"> <span>Flux de données</span> </span></p>
<h3 id="Offline-data-flow" class="common-anchor-header">Flux de données hors ligne</h3><ol>
<li>Définir les données à l'aide de la vision de l'entreprise.</li>
<li>Utiliser les connaissances antérieures pour définir comment combiner différents composants et les former en une garde-robe.</li>
<li>Reconnaître les étiquettes de caractéristiques des garde-robes et encoder les caractéristiques dans les données Elasticsearch dans le fichier <code translate="no">.json</code>.</li>
<li>Préparer les données de rappel en encodant les données non structurées en vecteurs.</li>
<li>Utilisez Milvus, la base de données vectorielle, pour classer les résultats rappelés obtenus à l'étape précédente.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/offline_data_flow_f91ac9cf4c.png" alt="offline data flow" class="doc-image" id="offline-data-flow" />
   </span> <span class="img-wrapper"> <span>flux de données hors ligne</span> </span></p>
<h3 id="Online-data-flow" class="common-anchor-header">Flux de données en ligne</h3><ol>
<li>Recevoir les demandes de renseignements des utilisateurs et collecter les profils des utilisateurs.</li>
<li>Comprendre la requête de l'utilisateur en identifiant ses besoins pour la garde-robe.</li>
<li>Recherche grossière à l'aide d'Elasticsearch.</li>
<li>Noter et classer les résultats obtenus à partir de la recherche grossière sur la base du calcul de la similarité vectorielle dans Milvus.</li>
<li>Post-traitement et organisation des résultats sur la plateforme back-end pour générer les résultats finaux.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/online_data_flow_1f2af25cc3.png" alt="online data flow" class="doc-image" id="online-data-flow" />
   </span> <span class="img-wrapper"> <span>flux de données en ligne</span> </span></p>
<h3 id="Data-post-processing" class="common-anchor-header">Post-traitement des données</h3><p>La logique commerciale varie d'une entreprise à l'autre. Vous pouvez ajouter une touche finale aux résultats en appliquant la logique commerciale de votre entreprise.</p>
<h2 id="System-demo" class="common-anchor-header">Démonstration du système<button data-href="#System-demo" class="anchor-icon" translate="no">
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
    </button></h2><p>Voyons maintenant comment fonctionne le système que nous avons construit.</p>
<p>L'interface utilisateur (IU) affiche la possibilité de différentes combinaisons de composants de la garde-robe.</p>
<p>Chaque composant est étiqueté en fonction de ses caractéristiques (taille, couleur, etc.) et stocké dans Elasticsearch (ES). Lors du stockage des étiquettes dans ES, quatre champs de données principaux doivent être remplis : ID, étiquettes, chemin de stockage et autres champs de soutien. ES et les données étiquetées sont utilisées pour le rappel granulaire et le filtrage des attributs.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/es_d5b0639610.png" alt="es" class="doc-image" id="es" />
   </span> <span class="img-wrapper"> <span>es</span> </span></p>
<p>Ensuite, différents algorithmes d'IA sont utilisés pour coder une garde-robe en un ensemble de vecteurs. Les ensembles de vecteurs sont stockés dans Milvus pour la recherche de similitudes et le classement. Cette étape permet d'obtenir des résultats plus précis et plus affinés.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_38dd93a439.jpeg" alt="Milvus" class="doc-image" id="milvus" />
   </span> <span class="img-wrapper"> <span>Milvus</span> </span></p>
<p>Elasticsearch, Milvus et d'autres composants du système forment ensemble la plateforme de conception de la personnalisation. Pour rappel, le langage spécifique au domaine (DSL) dans Elasticsearch et Milvus est le suivant.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/dsl_df60097d23.png" alt="dsl" class="doc-image" id="dsl" />
   </span> <span class="img-wrapper"> <span>dsl</span> </span></p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">Vous cherchez d'autres ressources ?<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
    </button></h2><p>Découvrez comment la base de données vectorielles Milvus peut alimenter davantage d'applications d'IA :</p>
<ul>
<li><a href="https://milvus.io/blog/2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md">Comment la plateforme de vidéos courtes Likee supprime les vidéos en double avec Milvus</a></li>
<li><a href="https://milvus.io/blog/2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md">Zhentu - Le détecteur de photos frauduleuses basé sur Milvus</a></li>
</ul>
