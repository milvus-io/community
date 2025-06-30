---
id: journey-to-35k-github-stars-story-of-building-milvus-from-scratch.md
title: >-
  Notre voyage vers 35K+ GitHub Stars : La véritable histoire de la construction
  de Milvus à partir de zéro
author: Zilliz
date: 2025-06-27T00:00:00.000Z
cover: assets.zilliz.com/Github_star_30_K_2_f329467096.png
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, vector database, vector search, AI search, Zilliz Cloud'
meta_title: |
  Our Journey to 35K+ GitHub Stars: Building Milvus from Scratch
desc: >-
  Rejoignez-nous pour célébrer Milvus, la base de données vectorielle qui a
  atteint 35,5K étoiles sur GitHub. Découvrez notre histoire et comment nous
  rendons les solutions d'IA plus faciles pour les développeurs.
origin: >-
  https://milvus.io/blog/journey-to-35k-github-stars-story-of-building-milvus-from-scratch.md
---
<p>Au cours des dernières années, nous nous sommes concentrés sur une seule chose : construire une base de données vectorielle prête à l'emploi pour l'ère de l'IA. Le plus difficile n'est pas de construire <em>une</em> base de données, mais d'en créer une qui soit évolutive, facile à utiliser et qui permette de résoudre des problèmes concrets en production.</p>
<p>En juin dernier, nous avons franchi une nouvelle étape : Milvus a atteint <a href="https://github.com/milvus-io/milvus">35 000 étoiles sur GitHub</a> (à l'heure où j'écris ces lignes, il en a plus de 35,5K). Nous n'allons pas prétendre qu'il s'agit d'un simple chiffre - cela signifie beaucoup pour nous.</p>
<p>Chaque étoile représente un développeur qui a pris le temps de regarder ce que nous avons construit, l'a trouvé suffisamment utile pour l'ajouter à ses favoris et, dans de nombreux cas, a décidé de l'utiliser. Certains d'entre vous sont allés plus loin : ils ont signalé des problèmes, contribué au code, répondu à des questions dans nos forums et aidé d'autres développeurs lorsqu'ils se trouvaient dans l'impasse.</p>
<p>Nous voulions prendre un moment pour partager notre histoire - la vraie, avec toutes les parties désordonnées incluses.</p>
<h2 id="We-Started-Building-Milvus-Because-Nothing-Else-Worked" class="common-anchor-header">Nous avons commencé à construire Milvus parce que rien d'autre ne fonctionnait<button data-href="#We-Started-Building-Milvus-Because-Nothing-Else-Worked" class="anchor-icon" translate="no">
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
    </button></h2><p>En 2017, nous sommes partis d'une simple question : Alors que les applications d'IA commençaient à émerger et que les données non structurées explosaient, comment stocker et rechercher efficacement les encastrements vectoriels qui alimentent la compréhension sémantique ?</p>
<p>Les bases de données traditionnelles n'ont pas été conçues pour cela. Elles sont optimisées pour les lignes et les colonnes, pas pour les vecteurs à haute dimension. Les technologies et les outils existants étaient soit impossibles, soit terriblement lents pour répondre à nos besoins.</p>
<p>Nous avons essayé tout ce qui était disponible. Nous avons bricolé des solutions avec Elasticsearch. Nous avons construit des index personnalisés au-dessus de MySQL. Nous avons même expérimenté FAISS, mais il s'agissait d'une bibliothèque de recherche et non d'une infrastructure de base de données de production. Rien n'offrait la solution complète que nous envisagions pour les charges de travail d'IA d'entreprise.</p>
<p><strong>Nous avons donc commencé à construire la nôtre.</strong> Non pas parce que nous pensions que ce serait facile - les bases de données sont notoirement difficiles à mettre en place - mais parce que nous pouvions voir où l'IA se dirigeait et savions qu'elle avait besoin d'une infrastructure spécifique pour y parvenir.</p>
<p>En 2018, nous étions en plein développement de ce qui allait devenir <a href="https://milvus.io/">Milvus</a>. Le terme &quot;<strong>base de données vectorielle</strong>&quot; n'existait pas encore. Nous étions essentiellement en train de créer une nouvelle catégorie de logiciels d'infrastructure, ce qui était à la fois excitant et terrifiant.</p>
<h2 id="Open-Sourcing-Milvus-Building-in-Public" class="common-anchor-header">Open-Sourcing Milvus : construire en public<button data-href="#Open-Sourcing-Milvus-Building-in-Public" class="anchor-icon" translate="no">
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
    </button></h2><p>En novembre 2019, nous avons décidé d'ouvrir la version 0.10 de Milvus.</p>
<p>L'open-sourcing signifie exposer tous vos défauts au monde entier. Chaque hack, chaque commentaire TODO, chaque décision de conception dont vous n'êtes pas entièrement sûr. Mais nous étions convaincus que si les bases de données vectorielles devaient devenir des infrastructures essentielles pour l'IA, elles devaient être ouvertes et accessibles à tous.</p>
<p>La réponse a été massive. Les développeurs ne se sont pas contentés d'utiliser Milvus, ils l'ont amélioré. Ils ont trouvé des bogues que nous n'avions pas vus, suggéré des fonctionnalités que nous n'avions pas envisagées et posé des questions qui nous ont fait réfléchir davantage à nos choix de conception.</p>
<p>En 2020, nous avons rejoint la <a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation</a>. Ce n'était pas seulement pour la crédibilité - cela nous a appris comment maintenir un projet open-source durable. Comment gérer la gouvernance, la compatibilité ascendante et la construction de logiciels qui durent des années et non des mois.</p>
<p>En 2021, nous avons publié Milvus 1.0 et <a href="https://lfaidata.foundation/projects/milvus/">obtenu le diplôme de la LF AI &amp; Data Foundation</a>. La même année, nous avons remporté le <a href="https://big-ann-benchmarks.com/neurips21.html">défi mondial BigANN</a> pour la recherche vectorielle à l'échelle du milliard. Cette victoire nous a fait du bien, mais plus important encore, elle a validé le fait que nous résolvions des problèmes réels de la bonne manière.</p>
<h2 id="The-Hardest-Decision-Starting-Over" class="common-anchor-header">La décision la plus difficile à prendre : Repartir à zéro<button data-href="#The-Hardest-Decision-Starting-Over" class="anchor-icon" translate="no">
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
    </button></h2><p>C'est là que les choses se compliquent. En 2021, Milvus 1.0 fonctionnait bien pour de nombreux cas d'utilisation, mais les entreprises clientes continuaient à demander les mêmes choses : une meilleure architecture cloud-native, une mise à l'échelle horizontale plus facile, une plus grande simplicité opérationnelle.</p>
<p>Nous avions le choix : patcher pour aller de l'avant ou reconstruire à partir de zéro. Nous avons choisi de reconstruire.</p>
<p>Milvus 2.0 était essentiellement une réécriture complète. Nous avons introduit une architecture de stockage et d'informatique entièrement découplée avec une évolutivité dynamique. Cela nous a pris deux ans et a été l'une des périodes les plus stressantes de l'histoire de notre entreprise. Nous étions en train de jeter un système fonctionnel que des milliers de personnes utilisaient pour construire quelque chose qui n'avait pas encore fait ses preuves.</p>
<p><strong>Mais lorsque nous avons publié Milvus 2.0 en 2022, Milvus est passé d'une puissante base de données vectorielle à une infrastructure prête à la production, capable de s'adapter aux charges de travail des entreprises.</strong> Cette même année, nous avons également réalisé un <a href="https://zilliz.com/news/vector-database-company-zilliz-series-b-extension">tour de table de série B+, non pas</a>pour brûler de l'argent, mais pour doubler la qualité du produit et le support pour les clients internationaux. Nous savions que cette voie prendrait du temps, mais chaque étape devait reposer sur des bases solides.</p>
<h2 id="When-Everything-Accelerated-with-AI" class="common-anchor-header">Quand tout s'accélère avec l'IA<button data-href="#When-Everything-Accelerated-with-AI" class="anchor-icon" translate="no">
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
    </button></h2><p>2023 a été l'année de la <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> (retrieval-augmented generation). Soudain, la recherche sémantique est passée d'une technique d'IA intéressante à une infrastructure essentielle pour les chatbots, les systèmes de questions-réponses et les agents d'IA.</p>
<p>Les étoiles GitHub de Milvus ont grimpé en flèche. Les demandes d'assistance se sont multipliées. Les développeurs qui n'avaient jamais entendu parler de bases de données vectorielles posaient soudain des questions sophistiquées sur les stratégies d'indexation et l'optimisation des requêtes.</p>
<p>Cette croissance était passionnante, mais aussi écrasante. Nous avons réalisé que nous devions faire évoluer non seulement notre technologie, mais aussi l'ensemble de notre approche du soutien à la communauté. Nous avons embauché plus de développeurs, réécrit complètement notre documentation et commencé à créer du contenu éducatif pour les développeurs qui découvrent les bases de données vectorielles.</p>
<p>Nous avons également lancé <a href="https://zilliz.com/cloud">Zilliz Cloud, notre</a>version entièrement gérée de Milvus. Certains nous ont demandé pourquoi nous "commercialisions" notre projet open-source. La réponse honnête est que la maintenance d'une infrastructure de niveau entreprise est coûteuse et complexe. Zilliz Cloud nous permet de soutenir et d'accélérer le développement de Milvus tout en conservant le cœur du projet en open source.</p>
<p>Puis vint 2024. <a href="https://zilliz.com/blog/zilliz-named-a-leader-in-the-forrester-wave-vector-database-report"><strong>Forrester nous a nommé leader</strong></a> <strong>dans la catégorie des bases de données vectorielles.</strong> Milvus a dépassé les 30 000 étoiles sur GitHub. <strong>Nous avons alors réalisé que la route que nous avions tracée pendant sept ans était enfin devenue une autoroute.</strong> Alors que de plus en plus d'entreprises adoptaient les bases de données vectorielles en tant qu'infrastructure critique, notre croissance s'est rapidement accélérée, confirmant que les fondations que nous avions construites pouvaient évoluer à la fois sur le plan technique et commercial.</p>
<h2 id="The-Team-Behind-Milvus-Zilliz" class="common-anchor-header">L'équipe derrière Milvus : Zilliz<button data-href="#The-Team-Behind-Milvus-Zilliz" class="anchor-icon" translate="no">
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
    </button></h2><p>Voici quelque chose d'intéressant : de nombreuses personnes connaissent Milvus, mais pas Zilliz. En fait, cela ne nous dérange pas. <a href="https://zilliz.com/"><strong>Zilliz</strong></a> <strong>est l'équipe qui se cache derrière Milvus - nous le construisons, nous le maintenons et nous le soutenons.</strong></p>
<p>Ce qui nous importe le plus, ce sont les choses peu glorieuses qui font la différence entre une démo cool et une infrastructure prête pour la production : optimisations des performances, correctifs de sécurité, documentation qui aide réellement les débutants, et réponse réfléchie aux problèmes GitHub.</p>
<p>Nous avons mis en place une équipe d'assistance mondiale 24 heures sur 24 et 7 jours sur 7 aux États-Unis, en Europe et en Asie, car les développeurs ont besoin d'aide dans leur fuseau horaire, pas dans le nôtre. Nous avons des contributeurs communautaires que nous appelons &quot;<a href="https://docs.google.com/forms/d/e/1FAIpQLSfkVTYObayOaND8M1ci9eF_YWvoKDb-xQjLJYZ-LhbCdLAt2Q/viewform">Ambassadeurs Milvus</a>&quot; qui organisent des événements, répondent aux questions des forums et expliquent souvent les concepts mieux que nous.</p>
<p>Nous avons également accueilli favorablement les intégrations avec AWS, GCP et d'autres fournisseurs de cloud, même lorsqu'ils proposent leurs propres versions gérées de Milvus. Plus d'options de déploiement, c'est bon pour les utilisateurs. Cependant, nous avons remarqué que lorsque les équipes sont confrontées à des défis techniques complexes, elles finissent souvent par s'adresser directement à nous, car nous comprenons le système au plus profond.</p>
<p>Beaucoup de gens pensent que l'open source n'est qu'une &quot;boîte à outils&quot;, mais il s'agit en fait d'un &quot;processus évolutif&quot; - un effort collectif réalisé par d'innombrables personnes qui l'aiment et y croient. Seuls ceux qui comprennent vraiment l'architecture peuvent expliquer le "pourquoi" des corrections de bogues, de l'analyse des goulets d'étranglement des performances, de l'intégration des systèmes de données et des ajustements architecturaux.</p>
<p><strong>Par conséquent, si vous utilisez Milvus en code source ouvert ou si vous envisagez d'intégrer des bases de données vectorielles dans votre système d'IA, nous vous encourageons à nous contacter directement pour bénéficier d'une assistance professionnelle et opportune.</strong></p>
<h2 id="Real-Impact-in-Production-The-Trust-from-Users" class="common-anchor-header">Impact réel en production : La confiance des utilisateurs<button data-href="#Real-Impact-in-Production-The-Trust-from-Users" class="anchor-icon" translate="no">
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
    </button></h2><p>Les cas d'utilisation de Milvus ont dépassé ce que nous avions imaginé au départ. Nous alimentons l'infrastructure d'IA de certaines des entreprises les plus exigeantes au monde, dans tous les secteurs d'activité.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/zilliz_customers_e7340d5dd4.png" alt="zilliz customers.png" class="doc-image" id="zilliz-customers.png" />
   </span> <span class="img-wrapper"> <span>zilliz customers.png</span> </span></p>
<p><a href="https://zilliz.com/customers/bosch"><strong>Bosch</strong></a>, leader mondial de la technologie automobile et pionnier de la conduite autonome, a révolutionné son analyse de données avec Milvus, réalisant une réduction de 80 % des coûts de collecte de données et des économies annuelles de 1,4 million de dollars tout en recherchant des milliards de scénarios de conduite en quelques millisecondes pour les cas limites critiques.</p>
<p><a href="https://zilliz.com/customers/read-ai"><strong>Read AI</strong></a>, l'une des sociétés d'IA de productivité à la croissance la plus rapide, qui compte des millions d'utilisateurs actifs mensuels, utilise Milvus pour obtenir une latence d'extraction inférieure à 20-50 ms sur des milliards d'enregistrements et une accélération de 5× dans la recherche agentique. Leur directeur technique déclare : "Milvus sert de référentiel central et alimente notre recherche d'informations parmi des milliards d'enregistrements."</p>
<p><a href="https://zilliz.com/customers/global-fintech-leader"><strong>Un leader mondial de la fintech</strong></a>, l'une des plus grandes plateformes de paiement numérique au monde, qui traite des dizaines de milliards de transactions dans plus de 200 pays et plus de 25 devises, a choisi Milvus pour l'ingestion de lots 5 à 10 fois plus rapide que ses concurrents, réalisant en moins d'une heure des tâches qui prenaient plus de 8 heures chez d'autres.</p>
<p><a href="https://zilliz.com/customers/filevine"><strong>Filevine</strong></a>, la principale plate-forme de travail juridique à laquelle font confiance des milliers de cabinets d'avocats aux États-Unis, gère 3 milliards de vecteurs dans des millions de documents juridiques, ce qui permet aux avocats de gagner 60 à 80 % de temps dans l'analyse des documents et de parvenir à une "véritable conscience des données" pour la gestion des affaires juridiques.</p>
<p>Nous soutenons également <strong>NVIDIA, OpenAI, Microsoft, Salesforce, Walmart et</strong> bien d'autres dans presque tous les secteurs. Plus de 10 000 organisations ont fait de Milvus ou de Zilliz Cloud leur base de données vectorielle de choix.</p>
<p>Il ne s'agit pas seulement de réussites techniques, mais d'exemples montrant que les bases de données vectorielles sont en train de devenir discrètement une infrastructure essentielle qui alimente les applications d'IA que les gens utilisent tous les jours.</p>
<h2 id="Why-We-Built-Zilliz-Cloud-Enterprise-Grade-Vector-Database-as-a-Service" class="common-anchor-header">Pourquoi nous avons créé Zilliz Cloud : Base de données vectorielles d'entreprise en tant que service<button data-href="#Why-We-Built-Zilliz-Cloud-Enterprise-Grade-Vector-Database-as-a-Service" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus est un logiciel libre et son utilisation est gratuite. Mais le bon fonctionnement de Milvus à l'échelle de l'entreprise nécessite une expertise approfondie et des ressources importantes. La sélection des index, la gestion de la mémoire, les stratégies de mise à l'échelle, les configurations de sécurité ne sont pas des décisions anodines. De nombreuses équipes souhaitent bénéficier de la puissance de Milvus sans la complexité opérationnelle et avec un support d'entreprise, des garanties SLA, etc.</p>
<p>C'est pourquoi nous avons créé <a href="https://zilliz.com/cloud">Zilliz Cloud, une</a>version entièrement gérée de Milvus déployée dans 25 régions du monde et dans 5 clouds majeurs, notamment AWS, GCP et Azure, conçue spécifiquement pour les charges de travail d'IA à l'échelle de l'entreprise qui exigent des performances, de la sécurité et de la fiabilité.</p>
<p>Voici ce qui différencie Zilliz Cloud :</p>
<ul>
<li><p><strong>Échelle massive avec de hautes performances :</strong> Notre moteur AutoIndex, alimenté par l'IA, offre des vitesses de requête de 3 à 5× plus rapides que Milvus, un moteur open-source, sans aucun réglage de l'index. L'architecture cloud-native prend en charge des milliards de vecteurs et des dizaines de milliers de requêtes simultanées tout en maintenant des temps de réponse inférieurs à la seconde.</p></li>
<li><p><a href="https://zilliz.com/trust-center"><strong>Sécurité et conformité intégrées</strong></a><strong>:</strong> Chiffrement au repos et en transit, RBAC finement paramétré, enregistrement complet des audits, intégration SAML/OAuth2.0 et déploiements <a href="https://zilliz.com/bring-your-own-cloud">BYOC</a> (bring your own cloud). Nous sommes conformes aux normes GDPR, HIPAA et autres normes internationales dont les entreprises ont réellement besoin.</p></li>
<li><p><strong>Optimisé pour la rentabilité :</strong> Le stockage de données chaudes/froides à plusieurs niveaux, la mise à l'échelle élastique qui répond aux charges de travail réelles et la tarification à l'utilisation peuvent réduire le coût total de possession de 50 % ou plus par rapport aux déploiements gérés par l'entreprise elle-même.</p></li>
<li><p><strong>Véritablement agnostique en matière de cloud, sans dépendance à l'égard d'un fournisseur :</strong> Déployez sur AWS, Azure, GCP, Alibaba Cloud ou Tencent Cloud sans dépendance à l'égard d'un fournisseur. Nous garantissons une cohérence et une évolutivité globales, quel que soit l'endroit où vous opérez.</p></li>
</ul>
<p>Ces capacités peuvent ne pas sembler tape-à-l'œil, mais elles résolvent des problèmes réels et quotidiens auxquels les équipes d'entreprise sont confrontées lorsqu'elles développent des applications d'IA à grande échelle. Et le plus important : il s'agit toujours de Milvus sous le capot, il n'y a donc pas de verrouillage propriétaire ou de problèmes de compatibilité.</p>
<h2 id="Whats-Next-Vector-Data-Lake" class="common-anchor-header">Prochaines étapes : Le lac de données vectoriel<button data-href="#Whats-Next-Vector-Data-Lake" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous avons inventé le terme &quot;<a href="https://zilliz.com/learn/what-is-vector-database">base de données vectorielle</a>&quot; et avons été les premiers à en construire une, mais nous ne nous arrêtons pas là. Nous sommes en train de construire la prochaine évolution : <strong>Vector Data Lake.</strong></p>
<p><strong>Voici le problème que nous résolvons : toutes les recherches vectorielles n'ont pas besoin d'une latence de l'ordre de la milliseconde.</strong> De nombreuses entreprises disposent d'ensembles de données massifs qui sont interrogés occasionnellement, notamment pour l'analyse de documents historiques, les calculs de similarité par lots et l'analyse de tendances à long terme. Pour ces cas d'utilisation, une base de données vectorielle traditionnelle en temps réel est à la fois surdimensionnée et coûteuse.</p>
<p>Vector Data Lake utilise une architecture séparée de stockage et de calcul spécifiquement optimisée pour les vecteurs massifs et peu fréquemment consultés, tout en maintenant des coûts nettement inférieurs à ceux des systèmes en temps réel.</p>
<p><strong>Les capacités principales sont les suivantes</strong></p>
<ul>
<li><p><strong>Pile de données unifiée :</strong> Elle relie de manière transparente les couches de données en ligne et hors ligne avec des formats cohérents et un stockage efficace, afin que vous puissiez déplacer les données entre les niveaux chauds et froids sans reformatage ni migrations complexes.</p></li>
<li><p><strong>Écosystème de calcul compatible :</strong> Fonctionne en mode natif avec des frameworks tels que Spark et Ray, prenant en charge tous les aspects, de la recherche vectorielle à l'ETL traditionnel et à l'analyse. Cela signifie que vos équipes de données existantes peuvent travailler avec des données vectorielles en utilisant des outils qu'elles connaissent déjà.</p></li>
<li><p><strong>Architecture à coût optimisé :</strong> Les données chaudes restent sur SSD ou NVMe pour un accès rapide ; les données froides sont automatiquement déplacées vers le stockage objet comme S3. Des stratégies intelligentes d'indexation et de stockage permettent de conserver des E/S rapides lorsque vous en avez besoin, tout en rendant les coûts de stockage prévisibles et abordables.</p></li>
</ul>
<p>Il ne s'agit pas de remplacer les bases de données vectorielles, mais de donner aux entreprises le bon outil pour chaque charge de travail. Recherche en temps réel pour les applications orientées utilisateur, lacs de données vectorielles rentables pour l'analyse et le traitement historique.</p>
<p>Nous croyons toujours en la logique de la loi de Moore et du paradoxe de Jevons : à mesure que le coût unitaire de l'informatique diminue, l'adoption augmente. Il en va de même pour l'infrastructure vectorielle.</p>
<p>En améliorant les index, les structures de stockage, la mise en cache et les modèles de déploiement jour après jour, nous espérons rendre l'infrastructure de l'IA plus accessible et plus abordable pour tous, et contribuer à faire entrer les données non structurées dans l'avenir natif de l'IA.</p>
<h2 id="A-Big-Thanks-to-You-All" class="common-anchor-header">Un grand merci à tous !<button data-href="#A-Big-Thanks-to-You-All" class="anchor-icon" translate="no">
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
    </button></h2><p>Ces plus de 35 000 étoiles représentent quelque chose dont nous sommes vraiment fiers : une communauté de développeurs qui trouvent Milvus suffisamment utile pour le recommander et y contribuer.</p>
<p>Mais nous n'avons pas fini. Milvus a des bogues à corriger, des améliorations de performance à apporter et des fonctionnalités que notre communauté a demandées. Notre feuille de route est publique, et nous souhaitons sincèrement avoir votre avis sur les priorités.</p>
<p>Ce n'est pas le nombre en lui-même qui compte, c'est la confiance que ces étoiles représentent. La confiance dans le fait que nous continuerons à construire ouvertement, à écouter les commentaires et à améliorer Milvus.</p>
<ul>
<li><p><strong>À nos contributeurs :</strong> vos PR, rapports de bogues et améliorations de la documentation permettent à Milvus de s'améliorer chaque jour. Merci beaucoup.</p></li>
<li><p><strong>À nos utilisateurs :</strong> merci de nous confier vos charges de travail de production et de nous faire part de vos commentaires qui nous permettent de rester honnêtes.</p></li>
<li><p><strong>À notre communauté :</strong> merci de répondre aux questions, d'organiser des événements et d'aider les nouveaux venus à démarrer.</p></li>
</ul>
<p>Si vous êtes novice en matière de bases de données vectorielles, nous serions ravis de vous aider à démarrer. Si vous utilisez déjà Milvus ou Zilliz Cloud, nous aimerions <a href="https://zilliz.com/share-your-story">connaître votre expérience</a>. Et si vous êtes simplement curieux de savoir ce que nous construisons, nos canaux communautaires sont toujours ouverts.</p>
<p>Continuons à construire ensemble l'infrastructure qui rend les applications d'IA possibles.</p>
<hr>
<p>Retrouvez-nous ici : <a href="https://github.com/milvus-io/milvus">Milvus sur GitHub</a> |<a href="https://zilliz.com/"> Zilliz Cloud</a> |<a href="https://discuss.milvus.io/"> Discord</a> | <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a> | <a href="https://x.com/zilliz_universe">X</a> | <a href="https://www.youtube.com/@MilvusVectorDatabase/featured">YouTube</a></p>
<p><a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1751017913702.1751029841530.667&amp;__hssc=175614333.3.1751029841530&amp;__hsfp=3554976067">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/office_hour_4fb9130a9b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
