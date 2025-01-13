---
id: deep-dive-5-real-time-query.md
title: >-
  Utilisation de la base de données vectorielles Milvus pour des requêtes en
  temps réel
author: Xi Ge
date: 2022-04-11T00:00:00.000Z
desc: >-
  Découvrez le mécanisme sous-jacent de l'interrogation en temps réel dans
  Milvus.
cover: assets.zilliz.com/deep_dive_5_5e9175c7f7.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-5-real-time-query.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deep_dive_5_5e9175c7f7.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Image de couverture</span> </span></p>
<blockquote>
<p>Cet article a été rédigé par <a href="https://github.com/xige-16">Xi Ge</a> et transcrit par <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni.</a></p>
</blockquote>
<p>Dans l'article précédent, nous avons parlé de l'<a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">insertion et de la persistance des données</a> dans Milvus. Dans cet article, nous allons continuer à expliquer comment les <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">différents composants</a> de Milvus interagissent les uns avec les autres pour réaliser des requêtes de données en temps réel.</p>
<p><em>Vous trouverez ci-dessous quelques ressources utiles avant de commencer. Nous recommandons de les lire d'abord pour mieux comprendre le sujet de cet article.</em></p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Plongée dans l'architecture de Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">Modèle de données Milvus</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/four_layers.md">Le rôle et la fonction de chaque composant Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Traitement des données dans Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Insertion et persistance des données dans Milvus</a></li>
</ul>
<h2 id="Load-data-to-query-node" class="common-anchor-header">Chargement des données dans le nœud d'interrogation<button data-href="#Load-data-to-query-node" class="anchor-icon" translate="no">
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
    </button></h2><p>Avant l'exécution d'une requête, les données doivent d'abord être chargées dans les nœuds de requête.</p>
<p>Deux types de données sont chargés dans le nœud d'interrogation : les données en continu provenant du <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Log-broker">courtier de journaux</a> et les données historiques provenant du <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Object-storage">stockage d'objets</a> (également appelé stockage persistant ci-dessous).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/flowchart_b1c51dfdaa.png" alt="Flowchart" class="doc-image" id="flowchart" />
   </span> <span class="img-wrapper"> <span>Organigramme</span> </span></p>
<p>La coordination des données est chargée de traiter les données en continu qui sont insérées en permanence dans Milvus. Lorsqu'un utilisateur de Milvus appelle <code translate="no">collection.load()</code> pour charger une collection, la coordination des requêtes interroge la coordination des données pour savoir quels segments ont été conservés dans le stockage et quels sont les points de contrôle correspondants. Un point de contrôle est une marque indiquant que les segments conservés avant les points de contrôle sont consommés alors que ceux après le point de contrôle ne le sont pas.</p>
<p>Ensuite, la coordonnatrice des requêtes produit une stratégie d'allocation basée sur les informations fournies par la coordonnatrice des données : soit par segment, soit par canal. L'allocateur de segments est chargé d'allouer des segments dans le stockage permanent (données de lot) à différents nœuds de requête. Par exemple, dans l'image ci-dessus, l'allocateur de segments attribue les segments 1 et 3 (S1, S3) au nœud d'interrogation 1, et les segments 2 et 4 (S2, S4) au nœud d'interrogation 2. L'allocateur de canaux attribue différents nœuds d'interrogation pour surveiller plusieurs <a href="https://milvus.io/docs/v2.0.x/data_processing.md#Data-insertion">canaux de</a> manipulation de données (DMChannels) dans le courtier d'enregistrement. Par exemple, dans l'image ci-dessus, l'allocateur de canaux affecte le nœud de requête 1 à la surveillance du canal 1 (Ch1) et le nœud de requête 2 à la surveillance du canal 2 (Ch2).</p>
<p>Grâce à la stratégie d'attribution, chaque nœud d'interrogation charge des données de segment et surveille les canaux en conséquence. Dans le nœud d'interrogation 1 de l'image, les données historiques (données de lot) sont chargées via S1 et S3 à partir du stockage permanent. Dans le même temps, le nœud de requête 1 charge des données incrémentielles (données en continu) en s'abonnant au canal 1 du log broker.</p>
<h2 id="Data-management-in-query-node" class="common-anchor-header">Gestion des données dans le nœud d'interrogation<button data-href="#Data-management-in-query-node" class="anchor-icon" translate="no">
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
    </button></h2><p>Un nœud d'interrogation doit gérer à la fois les données historiques et les données incrémentielles. Les données historiques sont stockées dans des <a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md#Sealed-segment">segments scellés</a>, tandis que les données incrémentielles sont stockées dans des <a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md#Growing-segment">segments croissants</a>.</p>
<h3 id="Historical-data-management" class="common-anchor-header">Gestion des données historiques</h3><p>Il y a principalement deux considérations à prendre en compte pour la gestion des données historiques : l'équilibre de la charge et le basculement du nœud d'interrogation.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/load_balance_c77e22bb5c.png" alt="Load balance" class="doc-image" id="load-balance" />
   </span> <span class="img-wrapper"> <span>Équilibre de la charge</span> </span></p>
<p>Par exemple, comme le montre l'illustration, le nœud de requête 4 s'est vu attribuer plus de segments scellés que le reste des nœuds de requête. Il est très probable que cela fasse du nœud d'interrogation 4 le goulot d'étranglement qui ralentit l'ensemble du processus d'interrogation. Pour résoudre ce problème, le système doit attribuer plusieurs segments du nœud d'interrogation 4 à d'autres nœuds d'interrogation. C'est ce qu'on appelle l'équilibrage de la charge.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Query_node_failover_3278c0e307.png" alt="Query node failover" class="doc-image" id="query-node-failover" />
   </span> <span class="img-wrapper"> <span>Basculement d'un nœud de requête</span> </span></p>
<p>Une autre situation possible est illustrée dans l'image ci-dessus. L'un des nœuds, le nœud d'interrogation 4, est soudainement hors service. Dans ce cas, la charge (segments alloués au nœud d'interrogation 4) doit être transférée à d'autres nœuds d'interrogation fonctionnels afin de garantir l'exactitude des résultats de l'interrogation.</p>
<h3 id="Incremental-data-management" class="common-anchor-header">Gestion incrémentale des données</h3><p>Le nœud d'interrogation surveille les DMChannels pour recevoir des données incrémentielles. Un diagramme de flux est introduit dans ce processus. Il filtre d'abord tous les messages d'insertion de données. Cela permet de s'assurer que seules les données d'une partition donnée sont chargées. Chaque collection dans Milvus a un canal correspondant, qui est partagé par toutes les partitions de cette collection. Par conséquent, un organigramme est nécessaire pour filtrer les données insérées si un utilisateur de Milvus ne doit charger que les données d'une certaine partition. Dans le cas contraire, les données de toutes les partitions de la collection seront chargées dans le nœud d'interrogation.</p>
<p>Après avoir été filtrées, les données incrémentielles sont insérées dans des segments croissants, puis transmises aux nœuds de temps du serveur.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/flow_graph_dc58651367.png" alt="Flowgraph" class="doc-image" id="flowgraph" />
   </span> <span class="img-wrapper"> <span>Diagramme de flux</span> </span></p>
<p>Lors de l'insertion des données, un horodatage est attribué à chaque message d'insertion. Dans le canal DMC illustré dans l'image ci-dessus, les données sont insérées dans l'ordre, de gauche à droite. L'horodatage du premier message d'insertion est 1, celui du deuxième, 2, et celui du troisième, 6. Le quatrième message marqué en rouge n'est pas un message d'insertion, mais un message d'horodatage. Il indique que les données insérées dont l'horodatage est inférieur à ce timetick se trouvent déjà dans le log broker. En d'autres termes, les données insérées après ce message de timetick devraient toutes avoir des horodatages dont les valeurs sont supérieures à ce timetick. Par exemple, dans l'image ci-dessus, lorsque le nœud de requête perçoit que l'heure actuelle est 5, cela signifie que tous les messages d'insertion dont la valeur de l'horodatage est inférieure à 5 sont tous chargés dans le nœud de requête.</p>
<p>Le nœud de temps du serveur fournit une valeur <code translate="no">tsafe</code> mise à jour chaque fois qu'il reçoit un timetick du nœud d'insertion. <code translate="no">tsafe</code> signifie le temps de sécurité, et toutes les données insérées avant ce point dans le temps peuvent être interrogées. Par exemple, si <code translate="no">tsafe</code> = 9, les données insérées dont l'horodatage est inférieur à 9 peuvent toutes être interrogées.</p>
<h2 id="Real-time-query-in-Milvus" class="common-anchor-header">Requête en temps réel dans Milvus<button data-href="#Real-time-query-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>L'interrogation en temps réel dans Milvus est activée par des messages d'interrogation. Les messages de requête sont insérés dans le log broker par proxy. Les nœuds d'interrogation obtiennent ensuite les messages d'interrogation en surveillant le canal d'interrogation dans le courtier d'enregistrement.</p>
<h3 id="Query-message" class="common-anchor-header">Message de requête</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_message_4d57814f47.png" alt="Query message" class="doc-image" id="query-message" />
   </span> <span class="img-wrapper"> <span>Message de requête</span> </span></p>
<p>Un message de requête comprend les informations cruciales suivantes concernant une requête :</p>
<ul>
<li><code translate="no">msgID</code>: L'ID du message, l'ID du message d'interrogation attribué par le système.</li>
<li><code translate="no">collectionID</code>: L'ID de la collection à interroger (si spécifié par l'utilisateur).</li>
<li><code translate="no">execPlan</code>: Le plan d'exécution est principalement utilisé pour le filtrage des attributs dans une requête.</li>
<li><code translate="no">service_ts</code>: L'horodatage du service sera mis à jour en même temps que <code translate="no">tsafe</code> mentionné ci-dessus. L'horodatage du service indique à quel moment le service a été mis en place. Toutes les données insérées avant <code translate="no">service_ts</code> sont disponibles pour la requête.</li>
<li><code translate="no">travel_ts</code>: L'horodatage du voyage spécifie une plage de temps dans le passé. L'interrogation portera sur les données existant dans la période spécifiée par <code translate="no">travel_ts</code>.</li>
<li><code translate="no">guarantee_ts</code>: L'horodatage de garantie spécifie une période de temps après laquelle la requête doit être effectuée. La requête ne sera effectuée que si <code translate="no">service_ts</code> &gt; <code translate="no">guarantee_ts</code>.</li>
</ul>
<h3 id="Real-time-query" class="common-anchor-header">Requête en temps réel</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_process_7f676972d8.png" alt="Query process" class="doc-image" id="query-process" />
   </span> <span class="img-wrapper"> <span>Processus d'interrogation</span> </span></p>
<p>Lorsqu'un message d'interrogation est reçu, Milvus juge d'abord si l'heure de service actuelle, <code translate="no">service_ts</code>, est supérieure à l'horodatage de garantie, <code translate="no">guarantee_ts</code>, dans le message d'interrogation. Dans l'affirmative, la requête est exécutée. La requête sera effectuée en parallèle sur les données historiques et les données incrémentielles. Étant donné qu'il peut y avoir un chevauchement de données entre les données en continu et les données par lots, une action appelée "réduction locale" est nécessaire pour filtrer les résultats redondants de la requête.</p>
<p>Toutefois, si le temps de service actuel est inférieur à l'horodatage de garantie dans un message de requête nouvellement inséré, le message de requête deviendra un message non résolu et attendra d'être traité jusqu'à ce que le temps de service devienne supérieur à l'horodatage de garantie.</p>
<p>Les résultats de la requête sont finalement transmis au canal de résultats. Le mandataire obtient les résultats de la requête à partir de ce canal. De même, le mandataire effectuera une "réduction globale" car il reçoit des résultats de plusieurs nœuds de requête et les résultats de la requête peuvent être répétitifs.</p>
<p>Pour s'assurer que le mandataire a reçu tous les résultats de la requête avant de les renvoyer au SDK, le message de résultat conservera également un enregistrement des informations, notamment les segments scellés recherchés, les DMChannels recherchés et les segments scellés globaux (tous les segments sur tous les nœuds de requête). Le système peut conclure que le mandataire a reçu tous les résultats de la requête uniquement si les deux conditions suivantes sont remplies :</p>
<ul>
<li>L'union de tous les segments scellés recherchés enregistrés dans tous les messages de résultats est supérieure aux segments scellés globaux,</li>
<li>Tous les canaux DMC de la collection sont interrogés.</li>
</ul>
<p>Enfin, le proxy renvoie les résultats finaux après "réduction globale" au SDK Milvus.</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">À propos de la série Deep Dive<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Avec l'<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">annonce officielle de la disponibilité générale de</a> Milvus 2.0, nous avons orchestré cette série de blogs Milvus Deep Dive afin de fournir une interprétation approfondie de l'architecture et du code source de Milvus. Les sujets abordés dans cette série de blogs sont les suivants</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Vue d'ensemble de l'architecture Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API et SDK Python</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Traitement des données</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Gestion des données</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Requête en temps réel</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Moteur d'exécution scalaire</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">Système d'assurance qualité</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Moteur d'exécution vectoriel</a></li>
</ul>
