---
id: build-multi-tenancy-rag-with-milvus-best-practices-part-one.md
title: >-
  Conception de RAG multi-tenant avec Milvus : Meilleures pratiques pour des
  bases de connaissances d'entreprise évolutives
author: Robert Guo
date: 2024-12-04T00:00:00.000Z
cover: assets.zilliz.com/Designing_Multi_Tenancy_RAG_with_Milvus_40b3737145.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/build-multi-tenancy-rag-with-milvus-best-practices-part-one
---
<h2 id="Introduction" class="common-anchor-header">Introduction<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Au cours des deux dernières années, la <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">génération améliorée par récupération (RAG)</a> est apparue comme une solution fiable pour les grandes organisations afin d'améliorer leurs applications <a href="https://zilliz.com/glossary/large-language-models-(llms)">alimentées par LLM</a>, en particulier celles qui ont des utilisateurs divers. Au fur et à mesure que ces applications se développent, la mise en œuvre d'un cadre multi-tenant devient essentielle. La <strong>multi-location</strong> offre un accès sécurisé et isolé aux données pour différents groupes d'utilisateurs, garantissant ainsi la confiance des utilisateurs, le respect des normes réglementaires et l'amélioration de l'efficacité opérationnelle.</p>
<p><a href="https://zilliz.com/what-is-milvus">Milvus</a> est une <a href="https://zilliz.com/learn/what-is-vector-database">base de données vectorielles</a> open-source conçue pour traiter des <a href="https://zilliz.com/glossary/vector-embeddings">données vectorielles</a> de haute dimension. Il s'agit d'un élément d'infrastructure indispensable de RAG, qui stocke et récupère des informations contextuelles pour les MLD à partir de sources externes. Milvus offre des <a href="https://milvus.io/docs/multi_tenancy.md">stratégies flexibles de multi-tenance</a> pour divers besoins, y compris la <strong>multi-tenance au niveau de la base de données, au niveau de la collection et au niveau de la partition</strong>.</p>
<p>Dans ce billet, nous aborderons les points suivants :</p>
<ul>
<li><p>Qu'est-ce que la multi-location et pourquoi est-elle importante ?</p></li>
<li><p>Stratégies de multi-tenance dans Milvus</p></li>
<li><p>Exemple : Stratégie de multi-tenance pour une base de connaissances d'entreprise alimentée par RAG</p></li>
</ul>
<h2 id="What-is-Multi-Tenancy-and-Why-It-Matters" class="common-anchor-header">Qu'est-ce que le multi-tenant et pourquoi est-il important ?<button data-href="#What-is-Multi-Tenancy-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p>La<a href="https://milvus.io/docs/multi_tenancy.md"><strong>multi-location</strong></a> est une architecture dans laquelle plusieurs clients ou équipes, appelés &quot;<strong>locataires</strong>&quot;, partagent une instance unique d'une application ou d'un système. Les données et les configurations de chaque locataire sont logiquement isolées, ce qui garantit la confidentialité et la sécurité, tandis que tous les locataires partagent la même infrastructure sous-jacente.</p>
<p>Imaginez une plateforme SaaS qui fournit des solutions basées sur la connaissance à plusieurs entreprises. Chaque entreprise est un locataire.</p>
<ul>
<li><p>Le locataire A est une organisation de soins de santé qui stocke des FAQ et des documents de conformité destinés aux patients.</p></li>
<li><p>Le locataire B est une entreprise technologique qui gère les flux de travail internes de dépannage informatique.</p></li>
<li><p>Le locataire C est une entreprise de vente au détail qui gère les FAQ du service clientèle pour les retours de produits.</p></li>
</ul>
<p>Chaque locataire opère dans un environnement complètement isolé, ce qui garantit qu'aucune donnée du locataire A ne s'infiltre dans le système du locataire B ou vice versa. En outre, l'allocation des ressources, les performances des requêtes et les décisions de mise à l'échelle sont spécifiques à chaque locataire, ce qui garantit des performances élevées indépendamment des pics de charge de travail d'un locataire.</p>
<p>La multilocation fonctionne également pour les systèmes qui desservent différentes équipes au sein d'une même organisation. Imaginez une grande entreprise qui utilise une base de connaissances alimentée par RAG pour servir ses services internes, tels que les ressources humaines, le service juridique et le service marketing. Dans cette configuration, chaque <strong>département est un locataire</strong> avec des données et des ressources isolées.</p>
<p>La multi-location offre des avantages significatifs, notamment en <strong>termes de rentabilité, d'évolutivité et de sécurité des données</strong>. En partageant une infrastructure unique, les fournisseurs de services peuvent réduire les frais généraux et garantir une utilisation plus efficace des ressources. Cette approche est également évolutive : l'intégration de nouveaux locataires nécessite beaucoup moins de ressources que la création d'instances distinctes pour chacun d'entre eux, comme c'est le cas avec les modèles à locataire unique. Il est important de noter que la multi-location maintient une sécurité des données solide en garantissant une isolation stricte des données pour chaque locataire, avec des contrôles d'accès et un cryptage qui protègent les informations sensibles d'un accès non autorisé. En outre, les mises à jour, les correctifs et les nouvelles fonctionnalités peuvent être déployés simultanément dans tous les locataires, ce qui simplifie la maintenance du système et réduit la charge des administrateurs tout en garantissant le respect constant des normes de sécurité et de conformité.</p>
<h2 id="Multi-Tenancy-Strategies-in-Milvus" class="common-anchor-header">Stratégies multi-locataires dans Milvus<button data-href="#Multi-Tenancy-Strategies-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour comprendre comment Milvus prend en charge la multi-location, il est important d'examiner tout d'abord la manière dont il organise les données utilisateur.</p>
<h3 id="How-Milvus-Organizes-User-Data" class="common-anchor-header">Comment Milvus organise les données utilisateur</h3><p>Milvus structure les données sur trois couches, de la plus large à la plus granulaire : <a href="https://milvus.io/docs/manage_databases.md"><strong>Base de données</strong></a>, <a href="https://milvus.io/docs/manage-collections.md"><strong>Collection</strong></a> et <a href="https://milvus.io/docs/manage-partitions.md"><strong>Partition/Clé de partition.</strong></a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_How_Milvus_organizes_user_data_4521c4b8f9.png" alt="Figure- How Milvus organizes user data .png" class="doc-image" id="figure--how-milvus-organizes-user-data-.png" />
   </span> <span class="img-wrapper"> <span>Figure - Comment Milvus organise les données utilisateur .png</span> </span></p>
<p><em>Figure : Comment Milvus organise les données utilisateur</em></p>
<ul>
<li><p><strong>Base de données</strong>: Il s'agit d'un conteneur logique, similaire à une base de données dans les systèmes relationnels traditionnels.</p></li>
<li><p><strong>Collection</strong>: Comparable à une table dans une base de données, une collection organise les données en groupes faciles à gérer.</p></li>
<li><p><strong>Partition/clé de partition</strong>: Au sein d'une collection, les données peuvent être segmentées par des <strong>partitions</strong>. En utilisant une <strong>clé de partition</strong>, les données ayant la même clé sont regroupées. Par exemple, si vous utilisez un <strong>identifiant d'utilisateur</strong> comme <strong>clé de partition</strong>, toutes les données relatives à un utilisateur spécifique seront stockées dans le même segment logique. Il est ainsi plus facile d'extraire les données liées à des utilisateurs individuels.</p></li>
</ul>
<p>En passant de la <strong>base de données</strong> à la <strong>collection</strong> et à la <strong>clé de partition</strong>, la granularité de l'organisation des données devient de plus en plus fine.</p>
<p>Pour garantir une plus grande sécurité des données et un contrôle d'accès approprié, Milvus fournit également un <a href="https://zilliz.com/blog/enabling-fine-grained-access-control-with-milvus-row-level-rbac"><strong>contrôle d'accès basé sur les rôles (RBAC)</strong></a> robuste, qui permet aux administrateurs de définir des autorisations spécifiques pour chaque utilisateur. Seuls les utilisateurs autorisés peuvent accéder à certaines données.</p>
<p>Milvus prend en charge <a href="https://milvus.io/docs/multi_tenancy.md">plusieurs stratégies de</a> mise en œuvre de la multi-tenance, offrant une flexibilité basée sur les besoins de votre application : <strong>multi-tenance au niveau de la base de données, au niveau de la collection et au niveau de la partition</strong>.</p>
<h3 id="Database-Level-Multi-Tenancy" class="common-anchor-header">Multi-tenance au niveau de la base de données</h3><p>Avec l'approche de multi-location au niveau de la base de données, chaque locataire se voit attribuer sa propre base de données au sein du même cluster Milvus. Cette stratégie permet une forte isolation des données et garantit des performances de recherche optimales. Toutefois, elle peut conduire à une utilisation inefficace des ressources si certains locataires restent inactifs.</p>
<h3 id="Collection-Level-Multi-Tenancy" class="common-anchor-header">Multi-tenance au niveau de la collection</h3><p>Ici, dans la multi-location au niveau de la collection, nous pouvons organiser les données pour les locataires de deux manières.</p>
<ul>
<li><p><strong>Une collection pour tous les locataires</strong>: Tous les locataires partagent une seule collection, avec des champs spécifiques au locataire utilisés pour le filtrage. Bien que simple à mettre en œuvre, cette approche peut entraîner des goulets d'étranglement au niveau des performances lorsque le nombre de locataires augmente.</p></li>
<li><p><strong>Une collection par locataire</strong>: Chaque locataire peut disposer d'une collection dédiée, ce qui améliore l'isolement et les performances, mais nécessite davantage de ressources. Cette configuration peut se heurter à des limites d'évolutivité si le nombre de locataires dépasse la capacité de collecte de Milvus.</p></li>
</ul>
<h3 id="Partition-Level-Multi-Tenancy" class="common-anchor-header">Multi-tenance au niveau des partitions</h3><p>La multilocation au niveau des partitions se concentre sur l'organisation des locataires au sein d'une collection unique. Ici, nous avons également deux façons d'organiser les données des locataires.</p>
<ul>
<li><p><strong>Une partition par locataire</strong>: Les locataires partagent une collection, mais leurs données sont stockées dans des partitions distinctes. Nous pouvons isoler les données en attribuant à chaque locataire une partition dédiée, ce qui permet d'équilibrer l'isolation et les performances de recherche. Toutefois, cette approche est limitée par la limite maximale de partition de Milvus.</p></li>
<li><p><strong>Multi-locations basées sur les clés de partition</strong>: Il s'agit d'une option plus évolutive dans laquelle une collection unique utilise des clés de partition pour distinguer les locataires. Cette méthode simplifie la gestion des ressources et permet une plus grande évolutivité, mais ne prend pas en charge les insertions de données en masse.</p></li>
</ul>
<p>Le tableau ci-dessous résume les principales différences entre les approches clés de multi-location.</p>
<table>
<thead>
<tr><th><strong>Granularité</strong></th><th><strong>Niveau base de données</strong></th><th><strong>Niveau de la collection</strong></th><th><strong>Niveau des clés de partition</strong></th></tr>
</thead>
<tbody>
<tr><td>Nombre maximal de locataires pris en charge</td><td>~1,000</td><td>~10,000</td><td>~10,000,000</td></tr>
<tr><td>Flexibilité de l'organisation des données</td><td>Élevée : les utilisateurs peuvent définir plusieurs collections avec des schémas personnalisés.</td><td>Moyenne : Les utilisateurs sont limités à une seule collection avec un schéma personnalisé.</td><td>Faible : Tous les utilisateurs partagent une collection, ce qui nécessite un schéma cohérent.</td></tr>
<tr><td>Coût par utilisateur</td><td>Élevé</td><td>Moyen</td><td>Faible</td></tr>
<tr><td>Isolation des ressources physiques</td><td>Oui</td><td>Oui</td><td>Non</td></tr>
<tr><td>RBAC</td><td>Oui</td><td>Oui</td><td>Non</td></tr>
<tr><td>Performance de recherche</td><td>Fortes</td><td>Moyenne</td><td>Fortes</td></tr>
</tbody>
</table>
<h2 id="Example-Multi-Tenancy-Strategy-for-a-RAG-Powered-Enterprise-Knowledge-Base" class="common-anchor-header">Exemple : Stratégie multi-locataires pour une base de connaissances d'entreprise alimentée par RAG<button data-href="#Example-Multi-Tenancy-Strategy-for-a-RAG-Powered-Enterprise-Knowledge-Base" class="anchor-icon" translate="no">
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
    </button></h2><p>Lors de la conception de la stratégie multi-locataires pour un système RAG, il est essentiel d'aligner votre approche sur les besoins spécifiques de votre entreprise et de vos locataires. Milvus propose différentes stratégies multi-locataires et le choix de la bonne stratégie dépend du nombre de locataires, de leurs exigences et du niveau d'isolation des données nécessaire. Voici un guide pratique pour prendre ces décisions, en prenant pour exemple une base de connaissances d'entreprise alimentée par RAG.</p>
<h3 id="Understanding-Tenant-Structure-Before-Choosing-a-Multi-Tenancy-Strategy" class="common-anchor-header">Comprendre la structure des locataires avant de choisir une stratégie de multi-occupation</h3><p>Une base de connaissances d'entreprise alimentée par RAG sert souvent un petit nombre de locataires. Ces locataires sont généralement des unités commerciales indépendantes telles que l'informatique, les ventes, le service juridique et le marketing, qui ont chacune besoin de services de base de connaissances distincts. Par exemple, le département des ressources humaines gère des informations sensibles sur les employés, telles que les guides d'intégration et les politiques d'avantages sociaux, qui devraient être confidentielles et accessibles uniquement au personnel des ressources humaines.</p>
<p>Dans ce cas, chaque unité commerciale doit être traitée comme un locataire distinct et une <strong>stratégie de multi-location au niveau de la base de données</strong> est souvent la plus appropriée. En attribuant des bases de données dédiées à chaque locataire, les organisations peuvent obtenir une forte isolation logique, simplifier la gestion et renforcer la sécurité. Cette configuration offre aux locataires une grande flexibilité : ils peuvent définir des modèles de données personnalisés au sein des collections, créer autant de collections que nécessaire et gérer indépendamment le contrôle d'accès à leurs collections.</p>
<h3 id="Enhancing-Security-with-Physical-Resource-Isolation" class="common-anchor-header">Renforcer la sécurité grâce à l'isolation physique des ressources</h3><p>Dans les situations où la sécurité des données est une priorité absolue, l'isolation logique au niveau de la base de données peut s'avérer insuffisante. Par exemple, certaines unités commerciales peuvent traiter des données critiques ou très sensibles, ce qui nécessite des garanties plus solides contre les interférences d'autres locataires. Dans ce cas, nous pouvons mettre en œuvre une <a href="https://milvus.io/docs/resource_group.md">approche d'isolation physique</a> au-dessus d'une structure de multi-location au niveau de la base de données.</p>
<p>Milvus nous permet de mapper des composants logiques, tels que des bases de données et des collections, à des ressources physiques. Cette méthode garantit que les activités des autres locataires n'ont pas d'impact sur les opérations critiques. Voyons comment cette approche fonctionne dans la pratique.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_How_Milvus_manages_physical_resources_6269b908d7.png" alt="Figure- How Milvus manages physical resources.png" class="doc-image" id="figure--how-milvus-manages-physical-resources.png" />
   </span> <span class="img-wrapper"> <span>Figure- Comment Milvus gère les ressources physiques.png</span> </span></p>
<p>Figure- Comment Milvus gère les ressources physiques.png Comment Milvus gère les ressources physiques</p>
<p>Comme le montre le diagramme ci-dessus, il existe trois niveaux de gestion des ressources dans Milvus : Le <strong>nœud de requête</strong>, le <strong>groupe de ressources</strong> et la <strong>base de données</strong>.</p>
<ul>
<li><p><strong>Nœud de requête</strong>: Le composant qui traite les tâches de requête. Il s'exécute sur une machine physique ou un conteneur (par exemple, un pod dans Kubernetes).</p></li>
<li><p><strong>Groupe de ressources</strong>: Une collection de nœuds de requête qui agit comme un pont entre les composants logiques (bases de données et collections) et les ressources physiques. Vous pouvez allouer une ou plusieurs bases de données ou collections à un seul groupe de ressources.</p></li>
</ul>
<p>Dans l'exemple illustré dans le diagramme ci-dessus, il existe trois <strong>bases de données</strong> logiques : X, Y et Z.</p>
<ul>
<li><p><strong>Base de données X</strong>: contient la <strong>collection A.</strong></p></li>
<li><p><strong>Base de données Y</strong>: contient les <strong>collections B</strong> et <strong>C.</strong></p></li>
<li><p><strong>Base de données Z</strong>: contient les <strong>collections D</strong> et <strong>E.</strong></p></li>
</ul>
<p>Supposons que la <strong>base de données X</strong> contienne une base de connaissances critique que nous ne voulons pas voir affectée par la charge de la <strong>base de données Y</strong> ou de la <strong>base de données Z</strong>. Pour garantir l'isolation des données, la <strong>base de</strong> données <strong>X</strong> se voit attribuer son propre groupe de ressources :</p>
<ul>
<li><p>La<strong>base</strong> de<strong>données X</strong> se voit attribuer son propre <strong>groupe de ressources</strong> afin de garantir que sa base de connaissances critique n'est pas affectée par les charges de travail des autres bases de données.</p></li>
<li><p>La<strong>collection E</strong> est également affectée à un <strong>groupe de ressources</strong> distinct au sein de sa base de données mère<strong>(Z)</strong>. Cela permet d'isoler au niveau de la collection des données critiques spécifiques au sein d'une base de données partagée.</p></li>
</ul>
<p>Pendant ce temps, les autres collections des <strong>bases de données Y</strong> et <strong>Z</strong> partagent les ressources physiques du <strong>groupe de ressources 2</strong>.</p>
<p>En mappant soigneusement les composants logiques aux ressources physiques, les entreprises peuvent mettre en place une architecture multi-tenant flexible, évolutive et sécurisée, adaptée à leurs besoins spécifiques.</p>
<h3 id="Designing-End-User-Level-Access" class="common-anchor-header">Conception de l'accès au niveau de l'utilisateur final</h3><p>Maintenant que nous avons appris les meilleures pratiques pour choisir une stratégie multi-tenant pour un RAG d'entreprise, voyons comment concevoir l'accès au niveau de l'utilisateur dans de tels systèmes.</p>
<p>Dans ces systèmes, les utilisateurs finaux interagissent généralement avec la base de connaissances en mode lecture seule par le biais de LLM. Cependant, les organisations ont toujours besoin de suivre ces données de questions-réponses générées par les utilisateurs et de les relier à des utilisateurs spécifiques à diverses fins, telles que l'amélioration de la précision de la base de connaissances ou l'offre de services personnalisés.</p>
<p>Prenons l'exemple du service de consultation intelligent d'un hôpital. Les patients peuvent poser des questions telles que : "Y a-t-il des rendez-vous disponibles avec le spécialiste aujourd'hui ?" ou "Y a-t-il une préparation spécifique nécessaire pour mon opération à venir ?". Bien que ces questions n'aient pas d'impact direct sur la base de connaissances, il est important pour l'hôpital de suivre ces interactions afin d'améliorer les services. Ces paires de questions-réponses sont généralement stockées dans une base de données distincte (il ne s'agit pas nécessairement d'une base de données vectorielle) dédiée à l'enregistrement des interactions.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_The_multi_tenancy_architecture_for_an_enterprise_RAG_knowledge_base_7c9ad8d4d1.png" alt="Figure- The multi-tenancy architecture for an enterprise RAG knowledge base .png" class="doc-image" id="figure--the-multi-tenancy-architecture-for-an-enterprise-rag-knowledge-base-.png" />
   </span> <span class="img-wrapper"> <span>Figure- L'architecture multi-tenant pour une base de connaissances RAG d'entreprise .png</span> </span></p>
<p><em>Figure : L'architecture multi-tenant pour une base de connaissances RAG d'entreprise</em></p>
<p>Le diagramme ci-dessus illustre l'architecture multi-tenant d'un système RAG d'entreprise.</p>
<ul>
<li><p><strong>Les administrateurs système</strong> supervisent le système RAG, gèrent l'allocation des ressources, affectent les bases de données, les mettent en correspondance avec les groupes de ressources et garantissent l'évolutivité. Ils s'occupent de l'infrastructure physique, comme le montre le diagramme, où chaque groupe de ressources (par exemple, les groupes de ressources 1, 2 et 3) est associé à des serveurs physiques (nœuds d'interrogation).</p></li>
<li><p><strong>Les locataires (propriétaires et développeurs de bases de données)</strong> gèrent la base de connaissances, en la modifiant sur la base des questions-réponses générées par les utilisateurs, comme le montre le diagramme. Différentes bases de données (bases de données X, Y, Z) contiennent des collections dont le contenu de la base de connaissances est différent (collection A, B, etc.).</p></li>
<li><p><strong>Les utilisateurs finaux</strong> interagissent avec le système en lecture seule par l'intermédiaire du LLM. Lorsqu'ils interrogent le système, leurs questions sont enregistrées dans la table d'enregistrement des questions et réponses (une base de données distincte), ce qui permet d'alimenter en permanence le système en données précieuses.</p></li>
</ul>
<p>Cette conception garantit que chaque couche de processus - de l'interaction avec l'utilisateur à l'administration du système - fonctionne de manière transparente, aidant ainsi l'organisation à construire une base de connaissances solide et en constante amélioration.</p>
<h2 id="Summary" class="common-anchor-header">Résumé<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans ce blog, nous avons exploré comment les cadres <a href="https://milvus.io/docs/multi_tenancy.md"><strong>multi-tenants</strong></a> jouent un rôle essentiel dans l'évolutivité, la sécurité et la performance des bases de connaissances alimentées par RAG. En isolant les données et les ressources pour différents locataires, les entreprises peuvent garantir la confidentialité, la conformité réglementaire et l'optimisation de l'allocation des ressources sur une infrastructure partagée. <a href="https://milvus.io/docs/overview.md">Milvus</a>, avec ses stratégies flexibles de multi-location, permet aux entreprises de choisir le bon niveau d'isolation des données, du niveau de la base de données au niveau de la partition, en fonction de leurs besoins spécifiques. Le choix d'une approche multi-tenant appropriée garantit que les entreprises peuvent fournir des services sur mesure aux locataires, même lorsqu'elles traitent des données et des charges de travail diverses.</p>
<p>En suivant les meilleures pratiques décrites ici, les entreprises peuvent concevoir et gérer efficacement des systèmes RAG multi-tenant qui non seulement offrent des expériences utilisateur supérieures, mais aussi s'adaptent sans effort à la croissance des besoins de l'entreprise. L'architecture de Milvus garantit que les entreprises peuvent maintenir des niveaux élevés d'isolation, de sécurité et de performance, ce qui en fait un composant essentiel dans la création de bases de connaissances RAG de qualité professionnelle.</p>
<h2 id="Stay-Tuned-for-More-Insights-into-Multi-Tenancy-RAG" class="common-anchor-header">Restez à l'écoute pour en savoir plus sur RAG Multi-Tenancy<button data-href="#Stay-Tuned-for-More-Insights-into-Multi-Tenancy-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans ce blog, nous avons discuté de la manière dont les stratégies multi-tenant de Milvus sont conçues pour gérer les locataires, mais pas les utilisateurs finaux au sein de ces locataires. Les interactions des utilisateurs finaux se produisent généralement au niveau de la couche d'application, tandis que la base de données vectorielle elle-même ignore l'existence de ces utilisateurs.</p>
<p>Vous vous posez peut-être des questions : <em>Si je souhaite fournir des réponses plus précises en fonction de l'historique des requêtes de chaque utilisateur final, Milvus ne doit-il pas maintenir un contexte de questions-réponses personnalisé pour chaque utilisateur ?</em></p>
<p>C'est une excellente question, et la réponse dépend vraiment du cas d'utilisation. Par exemple, dans un service de consultation à la demande, les requêtes sont aléatoires et l'accent est mis sur la qualité de la base de connaissances plutôt que sur le suivi du contexte historique de l'utilisateur.</p>
<p>Toutefois, dans d'autres cas, les systèmes RAG doivent tenir compte du contexte. Dans ce cas, Milvus doit collaborer avec la couche d'application pour conserver une mémoire personnalisée du contexte de chaque utilisateur. Cette conception est particulièrement importante pour les applications avec un grand nombre d'utilisateurs finaux, que nous explorerons plus en détail dans mon prochain article. Restez à l'écoute pour en savoir plus !</p>
