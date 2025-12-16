---
id: milvus-exceeds-40k-github-stars.md
title: >-
  7 ans, 2 reconstructions majeures, 40K+ GitHub Stars : L'ascension de Milvus
  en tant que principale base de données vectorielles open-source
author: Fendy Feng
date: 2025-12-02T00:00:00.000Z
cover: assets.zilliz.com/star_history_3dfceda40f.png
tag: announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database'
meta_title: >
  7 Years, 2 Major Rebuilds, 40K+ GitHub Stars: The Rise of Milvus as the
  Leading Open-Source Vector Database
desc: >-
  Célébration des 7 ans de voyage de Milvus pour devenir la première base de
  données vectorielles open-source au monde
origin: 'https://milvus.io/blog/milvus-exceeds-40k-github-stars.md'
---
<p>En juin 2025, Milvus a atteint 35 000 étoiles GitHub. Quelques mois plus tard, nous avons <a href="https://github.com/milvus-io/milvus">franchi le cap des 40 000 étoiles, preuve</a>non seulement de notre dynamisme, mais aussi de l'existence d'une communauté mondiale qui ne cesse de faire avancer l'avenir de la recherche vectorielle et multimodale.</p>
<p>Nous sommes profondément reconnaissants. À tous ceux qui ont marqué d'un astérisque ou d'une fourche, déposé des problèmes, débattu d'une API, partagé un benchmark ou construit quelque chose d'incroyable avec Milvus : <strong>merci, et c'est grâce à vous que ce projet avance aussi vite</strong>. Chaque étoile représente plus qu'un bouton pressé - elle reflète quelqu'un qui choisit Milvus pour alimenter son travail, quelqu'un qui croit en ce que nous construisons, quelqu'un qui partage notre vision d'une infrastructure d'IA ouverte, accessible et performante.</p>
<p>Alors que nous célébrons, nous regardons également vers l'avenir - vers les fonctionnalités que vous demandez, vers les architectures que l'IA exige désormais, et vers un monde où la compréhension multimodale et sémantique est la valeur par défaut de toutes les applications.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/star_history_3dfceda40f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="The-Journey-From-Zero-to-40000+-Stars" class="common-anchor-header">Le voyage : De zéro à plus de 40 000 étoiles<button data-href="#The-Journey-From-Zero-to-40000+-Stars" class="anchor-icon" translate="no">
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
    </button></h2><p>Lorsque nous avons commencé à construire Milvus en 2017, le terme de <em>base de données vectorielle</em> n'existait même pas. Nous n'étions qu'une petite équipe d'ingénieurs convaincus que les applications d'IA auraient bientôt besoin d'un nouveau type d'infrastructure de données - une infrastructure construite non pas pour des lignes et des colonnes, mais pour des données hautement dimensionnelles, non structurées et multimodales. Les bases de données traditionnelles n'étaient pas conçues pour ce monde, et nous savions que quelqu'un devait réimaginer ce à quoi pourraient ressembler le stockage et la recherche de données.</p>
<p>Les débuts ont été loin d'être glorieux. La mise en place d'une infrastructure d'entreprise est un travail lent et obstiné - des semaines passées à profiler les chemins de code, à réécrire les composants et à remettre en question les choix de conception à 2 heures du matin. Mais nous nous sommes accrochés à une mission simple : <strong>rendre la recherche vectorielle accessible, évolutive et fiable pour tous les développeurs qui créent des applications d'intelligence artificielle</strong>. Cette mission nous a permis de réaliser les premières percées et d'essuyer les inévitables revers.</p>
<p>Et en cours de route, quelques tournants ont tout changé :</p>
<ul>
<li><p><strong>2019 :</strong> Nous avons mis Milvus 0.10 en open-source. Cela signifiait exposer toutes nos aspérités - les hacks, les TODO, les éléments dont nous n'étions pas encore fiers. Mais la communauté s'est manifestée. Les développeurs ont signalé des problèmes que nous n'aurions jamais trouvés, ont proposé des fonctionnalités que nous n'avions pas imaginées et ont remis en question des hypothèses qui ont finalement rendu Milvus plus fort.</p></li>
<li><p><strong>2020-2021 :</strong> Nous avons rejoint la LF AI &amp; <a href="https://lfaidata.foundation/projects/milvus/">Data Foundation</a>, livré Milvus 1.0, obtenu le diplôme de la LF AI &amp; Data et remporté le défi <a href="https://big-ann-benchmarks.com/neurips21.html">BigANN</a> de recherche vectorielle à l'échelle du milliard, preuve précoce que notre architecture pouvait supporter une échelle réelle.</p></li>
<li><p><strong>2022 :</strong> Les utilisateurs d'entreprise avaient besoin d'une mise à l'échelle native de Kubernetes, d'élasticité et d'une véritable séparation du stockage et du calcul. Nous avons été confrontés à une décision difficile : patcher l'ancien système ou tout reconstruire. Nous avons choisi la voie la plus difficile. <strong>Milvus 2.0 a été une réinvention de fond en comble</strong>, introduisant une architecture cloud-native entièrement découplée qui a transformé Milvus en une plateforme de niveau production pour les charges de travail d'IA critiques.</p></li>
<li><p><strong>2024-2025 :</strong> <a href="https://zilliz.com/">Zilliz</a> (l'équipe derrière Milvus) a été nommée <a href="https://zilliz.com/resources/analyst-report/zilliz-forrester-wave-vector-database-report">leader par Forrester</a>, a dépassé les 30 000 étoiles et est maintenant au-delà de 40 000. Elle est devenue l'épine dorsale de la recherche multimodale, des systèmes RAG, des flux de travail agentiques et de la recherche à l'échelle du milliard dans les secteurs de l'éducation, de la finance, de la production créative, de la recherche scientifique, etc.</p></li>
</ul>
<p>Cette étape a été franchie non pas grâce à un battage médiatique, mais grâce aux développeurs qui ont choisi Milvus pour des charges de travail de production réelles et qui nous ont poussés à nous améliorer à chaque étape du processus.</p>
<h2 id="2025-Two-Major-Releases-Massive-Performance-Gains" class="common-anchor-header">2025 : Deux versions majeures, des gains de performance massifs<button data-href="#2025-Two-Major-Releases-Massive-Performance-Gains" class="anchor-icon" translate="no">
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
    </button></h2><p>2025 a été l'année où Milvus est entré dans une nouvelle catégorie. Alors que la recherche vectorielle excelle dans la compréhension sémantique, la réalité en production est simple : <strong>les développeurs ont toujours besoin d'une correspondance précise des mots clés</strong> pour les identifiants de produits, les numéros de série, les phrases exactes, les termes juridiques, etc. Sans recherche plein texte native, les équipes étaient obligées de maintenir des clusters Elasticsearch/OpenSearch ou de coller leurs propres solutions personnalisées, ce qui doublait les frais généraux opérationnels et la fragmentation.</p>
<p><a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md"><strong>Milvus 2.5</strong></a> <strong>a changé la donne</strong>. Il a introduit une <strong>recherche hybride véritablement native</strong>, combinant la recherche en texte intégral et la recherche vectorielle dans un moteur unique. Pour la première fois, les développeurs pouvaient exécuter des requêtes lexicales, des requêtes sémantiques et des filtres de métadonnées ensemble sans avoir à jongler avec des systèmes supplémentaires ou à synchroniser des pipelines. Nous avons également amélioré le filtrage des métadonnées, l'analyse des expressions et l'efficacité de l'exécution afin que les requêtes hybrides soient naturelles et rapides sous des charges de production réelles.</p>
<p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Milvus 2.6</strong></a> <strong>a poursuivi sur cette lancée</strong>, en ciblant les deux défis les plus souvent évoqués par les utilisateurs fonctionnant à l'échelle : le <strong><em>coût</em> et les <em>performances</em>.</strong> Cette version a apporté de profondes améliorations architecturales : des chemins d'interrogation plus prévisibles, une indexation plus rapide, une utilisation de la mémoire considérablement réduite et un stockage nettement plus efficace. De nombreuses équipes ont constaté des gains immédiats sans modifier une seule ligne du code de l'application.</p>
<p>Voici quelques points forts de Milvus 2.6 :</p>
<ul>
<li><p><a href="https://milvus.io/docs/tiered-storage-overview.md"><strong>Stockage hiérarchisé</strong></a> qui permet aux équipes d'équilibrer les coûts et les performances de manière plus intelligente, réduisant les coûts de stockage jusqu'à 50 %.</p></li>
<li><p>D<strong>'énormes économies de mémoire</strong> grâce à la <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">quantification à 1 bit RaBitQ</a> - réduisant l'utilisation de la mémoire jusqu'à 72 % tout en offrant des requêtes plus rapides.</p></li>
<li><p><a href="https://milvus.io/docs/full-text-search.md"><strong>Un moteur plein texte repensé</strong></a> avec une implémentation BM25 significativement plus rapide - jusqu'à 4× plus rapide qu'Elasticsearch dans nos benchmarks.</p></li>
<li><p><strong>Un nouveau Path Index</strong> pour les <a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">métadonnées structurées en JSON</a>, permettant un filtrage jusqu'à 100 fois plus rapide sur les documents complexes.</p></li>
<li><p><a href="https://milvus.io/docs/aisaq.md"><strong>AiSAQ</strong>:</a> compression à l'échelle du milliard avec une réduction de stockage de 3200× et un rappel important.</p></li>
<li><p><a href="https://milvus.io/docs/geometry-operators.md"><strong>Recherche</strong></a><strong>sémantique +</strong> <a href="https://milvus.io/docs/geometry-operators.md"><strong>géospatiale</strong></a> <strong>avec R-Tree :</strong> Combinaison de l'<em>emplacement des choses</em> et de <em>leur signification</em> pour des résultats plus pertinents.</p></li>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA"><strong>CAGRA+ Vamana</strong></a><strong>:</strong> Réduction des coûts de déploiement grâce à un mode CAGRA hybride qui s'appuie sur le GPU, mais dont les requêtes sont effectuées par l'unité centrale.</p></li>
<li><p><strong>Un</strong><strong>flux de travail</strong><strong>"</strong><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md"><strong>données entrantes, données sortantes</strong></a><strong>"</strong> qui simplifie l'ingestion et la récupération des données intégrées, en particulier pour les pipelines multimodaux.</p></li>
<li><p><strong>La prise en charge d'un maximum de 100 000 collections</strong> dans un seul cluster - une étape importante vers une véritable multi-tenance à l'échelle.</p></li>
</ul>
<p>Pour en savoir plus sur Milvus 2.6, consultez les <a href="https://milvus.io/docs/release_notes.md">notes de version complètes</a>.</p>
<p><a href="https://zilliz.com/event/milvus-2-6-deep-dive-faster-search-lower-cost-smarter-scaling?utm_source=milvusio&amp;utm_medium=milvus-40k-stars&amp;utm_campaign=milvus-26-webinar">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Webinar_Milvus_2_6_Webinar_5_4_Twitter_a4e8dbf7e4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
<h2 id="Beyond-Milvus-Open-Source-Tools-for-AI-Developers" class="common-anchor-header">Au-delà de Milvus : des outils open-source pour les développeurs d'IA<button data-href="#Beyond-Milvus-Open-Source-Tools-for-AI-Developers" class="anchor-icon" translate="no">
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
    </button></h2><p>En 2025, nous ne nous sommes pas contentés d'améliorer Milvus, nous avons créé des outils qui renforcent l'ensemble de l'écosystème des développeurs d'IA. Notre objectif n'était pas de suivre les tendances, mais de fournir aux développeurs le type d'outils ouverts, puissants et transparents dont nous avons toujours souhaité l'existence.</p>
<h3 id="DeepSearcher-Research-Without-Cloud-Lock-In" class="common-anchor-header">DeepSearcher : La recherche sans enfermement dans le nuage</h3><p>Deep Researcher d'OpenAI a prouvé ce que les agents de raisonnement profond peuvent faire. Mais il est fermé, coûteux et enfermé dans des API en nuage. <a href="https://github.com/zilliztech/deep-searcher"><strong>DeepSearcher</strong></a> <strong>est notre réponse.</strong> Il s'agit d'un moteur de recherche approfondie local et open-source conçu pour tous ceux qui souhaitent des investigations structurées sans sacrifier le contrôle ou la confidentialité.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepsearcher_5cf6a4f0dc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DeepSearcher fonctionne entièrement sur votre machine, rassemblant des informations à travers les sources, synthétisant les idées et fournissant des citations, des étapes de raisonnement et une traçabilité - des caractéristiques essentielles pour une véritable recherche, et pas seulement des résumés de surface. Pas de boîte noire. Pas de verrouillage des fournisseurs. Juste des analyses transparentes et reproductibles auxquelles les développeurs et les chercheurs peuvent faire confiance.</p>
<h3 id="Claude-Context-Coding-Assistants-That-Actually-Understand-Your-Code" class="common-anchor-header">Claude Context : Des assistants de codage qui comprennent réellement votre code</h3><p>La plupart des outils de codage d'IA se comportent encore comme des pipelines grep fantaisistes - rapides, superficiels, brûleurs de jetons et inconscients de la structure réelle du projet. <a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a> change cela. Construit comme un plugin MCP, il donne enfin aux assistants de codage ce qui leur manquait : une véritable compréhension sémantique de votre base de code.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_7f608a153d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Claude Context construit un index sémantique vectoriel à travers votre projet, permettant aux agents de trouver les bons modules, de suivre les relations entre les fichiers, de comprendre l'intention au niveau de l'architecture, et de répondre aux questions avec pertinence plutôt qu'avec des suppositions. Il réduit le gaspillage de jetons, augmente la précision et, surtout, permet aux assistants de codage de se comporter comme s'ils comprenaient vraiment votre logiciel plutôt que de faire semblant.</p>
<p>Les deux outils sont entièrement open source. Parce que l'infrastructure de l'IA devrait appartenir à tout le monde et parce que l'avenir de l'IA ne devrait pas être enfermé derrière des murs propriétaires.</p>
<h2 id="Trusted-by-10000+-Teams-in-Production" class="common-anchor-header">La confiance de plus de 10 000 équipes en production<button data-href="#Trusted-by-10000+-Teams-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Aujourd'hui, plus de 10 000 équipes d'entreprise utilisent Milvus en production, qu'il s'agisse de startups à croissance rapide ou de sociétés technologiques parmi les plus établies au monde et figurant au classement Fortune 500. Les équipes de NVIDIA, Salesforce, eBay, Airbnb, IBM, AT&amp;T, LINE, Shopee, Roblox, Bosch et Microsoft s'appuient sur Milvus pour alimenter les systèmes d'IA qui fonctionnent à chaque minute de la journée. Leurs charges de travail couvrent la recherche, les recommandations, les pipelines agentiques, la recherche multimodale et d'autres applications qui poussent l'infrastructure vectorielle à ses limites.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/logos_eb0d3ad4af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Mais ce qui importe le plus, ce n'est pas seulement <em>qui</em> utilise Milvus, c'est <em>ce qu'ils construisent avec</em>. Dans tous les secteurs, Milvus se trouve derrière des systèmes qui façonnent la façon dont les entreprises fonctionnent, innovent et sont compétitives :</p>
<ul>
<li><p><strong>Des copilotes d'IA et des assistants d'entreprise</strong> qui améliorent l'assistance à la clientèle, les flux de travail de vente et la prise de décision interne grâce à un accès instantané à des milliards d'éléments intégrés.</p></li>
<li><p><strong>La recherche sémantique et visuelle dans le commerce électronique, les médias et la publicité</strong>, qui permet d'augmenter le taux de conversion, d'améliorer la découverte et d'accélérer la production créative.</p></li>
<li><p><strong>Plateformes d'intelligence juridique, financière et scientifique</strong> où la précision, l'auditabilité et la conformité se traduisent par des gains opérationnels réels.</p></li>
<li><p>Les<strong>moteurs de détection des fraudes et des risques</strong> dans les secteurs de la fintech et de la banque, qui dépendent d'une correspondance sémantique rapide pour prévenir les pertes en temps réel.</p></li>
<li><p>Des<strong>systèmes RAG et agentiques à grande échelle</strong> qui donnent aux équipes un comportement d'IA profondément contextuel et conscient du domaine.</p></li>
<li><p><strong>Les couches de connaissances d'entreprise</strong> qui unifient le texte, le code, les images et les métadonnées en un tissu sémantique cohérent.</p></li>
</ul>
<p>Et il ne s'agit pas de références de laboratoire, mais de déploiements de production parmi les plus exigeants au monde. Milvus tient régulièrement ses promesses :</p>
<ul>
<li><p>Recherche en moins de 50 ms sur des milliards de vecteurs</p></li>
<li><p>Des milliards de documents et d'événements gérés dans un seul système</p></li>
<li><p>Des flux de travail 5 à 10 fois plus rapides que les solutions alternatives</p></li>
<li><p>Des architectures multi-locataires prenant en charge des centaines de milliers de collections</p></li>
</ul>
<p>Les équipes choisissent Milvus pour une raison simple : <strong>il répond aux besoins en termes de vitesse, de fiabilité, de rentabilité et de capacité à évoluer vers des milliards sans avoir à démanteler leur architecture tous les deux ou trois mois.</strong> La confiance que ces équipes nous accordent est la raison pour laquelle nous continuons à renforcer Milvus pour la décennie d'IA à venir.</p>
<p><a href="https://zilliz.com/share-your-story">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/share_your_story_3c44c533ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
<h2 id="When-You-Need-Milvus-Without-the-Ops-Zilliz-Cloud" class="common-anchor-header">Lorsque vous avez besoin de Milvus sans les opérations : Zilliz Cloud<button data-href="#When-You-Need-Milvus-Without-the-Ops-Zilliz-Cloud" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus est gratuit, puissant et éprouvé. Mais c'est aussi un système distribué, et le bon fonctionnement des systèmes distribués est un véritable travail d'ingénierie. Le réglage de l'index, la gestion de la mémoire, la stabilité du cluster, la mise à l'échelle, l'observabilité... ces tâches nécessitent du temps et une expertise que de nombreuses équipes n'ont tout simplement pas à leur disposition. Les développeurs voulaient la puissance de Milvus, mais sans le poids opérationnel qui vient inévitablement avec la gestion à l'échelle.</p>
<p>Cette réalité nous a conduits à une conclusion simple : si Milvus devait devenir l'infrastructure de base des applications d'IA, nous devions la rendre facile à exploiter. C'est pourquoi nous avons créé <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a>, le service Milvus entièrement géré, créé et maintenu par la même équipe que celle qui est à l'origine du projet open-source.</p>
<p>Zilliz Cloud offre aux développeurs le Milvus qu'ils connaissent déjà et auquel ils font confiance, mais sans avoir à provisionner des clusters, à lutter contre les problèmes de performances, à planifier des mises à niveau ou à s'inquiéter du réglage du stockage et de l'informatique. Et comme il inclut des optimisations impossibles à exécuter dans des environnements autogérés, il est encore plus rapide et plus fiable. <a href="https://zilliz.com/blog/cardinal-most-performant-vector-search-engine">Cardinal</a>, notre moteur vectoriel auto-optimisant de qualité commerciale, offre des performances 10 fois supérieures à celles du <strong>logiciel libre Milvus</strong>.</p>
<p><strong>Ce qui distingue Zilliz Cloud</strong></p>
<ul>
<li><strong>Performances auto-optimisées :</strong> AutoIndex ajuste automatiquement HNSW, IVF et DiskANN, offrant un rappel de plus de 96 % sans aucune configuration manuelle.</li>
</ul>
<ul>
<li><p><strong>Elastique et rentable :</strong> La tarification à la carte, l'autoscaling sans serveur et la gestion intelligente des ressources réduisent souvent les coûts de 50 % ou plus par rapport aux déploiements autogérés.</p></li>
<li><p><strong>Fiabilité de niveau entreprise :</strong> SLA de 99,95 % de temps de disponibilité, redondance multi-AZ, conformité SOC 2 Type II, ISO 27001 et GDPR. Prise en charge complète du RBAC, du BYOC, des journaux d'audit et du chiffrement.</p></li>
<li><p><strong>Déploiement agnostique :</strong> Exécution sur AWS, Azure, GCP, Alibaba Cloud ou Tencent Cloud - pas de dépendance à l'égard d'un fournisseur, performances constantes partout.</p></li>
<li><p><strong>Requêtes en langage naturel :</strong> La prise en charge intégrée du serveur MCP vous permet d'interroger les données de manière conversationnelle au lieu de rédiger manuellement des appels d'API.</p></li>
<li><p><strong>Migration sans effort</strong>: Passez de Milvus, Pinecone, Qdrant, Weaviate, Elasticsearch ou PostgreSQL à l'aide d'outils de migration intégrés - aucune réécriture de schéma ni aucun temps d'arrêt n'est nécessaire.</p></li>
<li><p><strong>100% compatible avec Milvus open-source.</strong> Pas de forks propriétaires. Pas d'enfermement. Juste Milvus, plus facile.</p></li>
</ul>
<p><strong>Milvus restera toujours open source et libre d'utilisation.</strong> Mais son fonctionnement et son exploitation fiables à l'échelle de l'entreprise requièrent une expertise et des ressources importantes. <strong>Zilliz Cloud est notre réponse à cette lacune</strong>. Déployé dans 29 régions et cinq nuages majeurs, Zilliz Cloud offre des performances, une sécurité et une rentabilité de niveau professionnel tout en vous permettant de rester totalement aligné sur le Milvus que vous connaissez déjà.</p>
<p><a href="https://cloud.zilliz.com/signup"><strong>Démarrer l'essai gratuit →</strong></a></p>
<h2 id="Whats-Next-Milvus-Lake" class="common-anchor-header">Prochaines étapes : Milvus Lake<button data-href="#Whats-Next-Milvus-Lake" class="anchor-icon" translate="no">
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
    </button></h2><p>En tant qu'équipe ayant introduit la base de données vectorielle, nous sommes aux premières loges pour observer l'évolution des données d'entreprise. Ce qui tenait autrefois dans des téraoctets de tables structurées se transforme rapidement en pétaoctets - et bientôt en trillions - d'objets multimodaux. Texte, images, audio, vidéo, flux de séries temporelles, journaux multi-capteurs... tels sont les ensembles de données sur lesquels s'appuient les systèmes d'intelligence artificielle modernes.</p>
<p>Les bases de données vectorielles sont conçues pour les données non structurées et multimodales, mais elles ne constituent pas toujours le choix le plus économique ou le plus judicieux sur le plan architectural, en particulier lorsque la grande majorité des données sont froides. Les corpus de formation pour les grands modèles, les journaux de perception de la conduite autonome et les ensembles de données robotiques ne nécessitent généralement pas une latence de l'ordre de la milliseconde ou une concurrence élevée. Faire passer ce volume de données par une base de données vectorielle en temps réel devient coûteux, lourd sur le plan opérationnel et trop complexe pour les pipelines qui n'ont pas besoin de ce niveau de performance.</p>
<p>Cette réalité nous a conduits à notre prochaine initiative majeure : <strong>Milvus Lake - une</strong>base de données sémantique, indexée et multimodale, conçue pour les données à l'échelle de l'IA. Milvus Lake unifie les signaux sémantiques de toutes les modalités (vecteurs, métadonnées, étiquettes, descriptions générées par LLM et champs structurés) et les organise dans des <strong>tables étendues sémantiques</strong> ancrées autour d'entités commerciales réelles. Les données qui se présentaient auparavant sous la forme de fichiers bruts et dispersés dans le stockage d'objets, les entrepôts de données et les pipelines de modèles deviennent une couche sémantique unifiée et interrogeable. Les corpus multimodaux massifs se transforment en actifs gérables, récupérables et réutilisables avec une signification cohérente dans l'ensemble de l'entreprise.</p>
<p>Sous le capot, Milvus Lake est construit sur une architecture <strong>manifeste + données + index</strong> propre qui traite l'indexation comme un élément fondamental plutôt que comme une réflexion après coup. Cela permet de débloquer un flux de travail " récupérer d'abord, traiter ensuite " optimisé pour des données froides à l'échelle du trillion, offrant une latence prévisible, des coûts de stockage considérablement réduits et une stabilité opérationnelle bien plus grande. Une approche de stockage à plusieurs niveaux - NVMe/SSD pour les chemins d'accès rapides et le stockage d'objets pour les archives profondes - associée à une compression efficace et à des index chargés paresseusement préserve la fidélité sémantique tout en gardant le contrôle sur les frais généraux de l'infrastructure.</p>
<p>Milvus Lake s'intègre également de manière transparente dans l'écosystème des données modernes, avec Paimon, Iceberg, Hudi, Spark, Ray et d'autres moteurs et formats de big data. Les équipes peuvent exécuter le traitement par lots, les pipelines en temps quasi réel, la récupération sémantique, l'ingénierie des fonctionnalités et la préparation des données de formation en un seul endroit, sans avoir à reformater leurs flux de travail existants. Qu'il s'agisse de constituer des corpus de modèles de base, de gérer des bibliothèques de simulations de conduite autonome, de former des agents robotiques ou d'alimenter des systèmes de recherche à grande échelle, Milvus Lake constitue une base de données sémantiques extensible et rentable pour l'ère de l'IA.</p>
<p><strong>Milvus Lake est en cours de développement.</strong> Vous souhaitez bénéficier d'un accès anticipé ou en savoir plus ?<a href="https://zilliz.com/contact"> </a></p>
<p><a href="https://zilliz.com/contact-sales"><strong>Contactez-nous →</strong></a></p>
<h2 id="Built-by-the-Community-For-the-Community" class="common-anchor-header">Construit par la communauté, pour la communauté<button data-href="#Built-by-the-Community-For-the-Community" class="anchor-icon" translate="no">
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
    </button></h2><p>Ce qui rend Milvus spécial, ce n'est pas seulement la technologie, ce sont les personnes qui la soutiennent. Notre base de contributeurs couvre le monde entier et rassemble des spécialistes du calcul haute performance, des systèmes distribués et de l'infrastructure de l'IA. Des ingénieurs et des chercheurs d'ARM, NVIDIA, AMD, Intel, Meta, IBM, Salesforce, Alibaba, Microsoft et bien d'autres encore ont apporté leur expertise pour faire de Milvus ce qu'il est aujourd'hui.</p>
<p>Chaque demande d'extension, chaque rapport de bogue, chaque question traitée dans nos forums, chaque tutoriel créé - ces contributions permettent à Milvus d'être meilleur pour tout le monde.</p>
<p>Ce jalon vous appartient à tous :</p>
<ul>
<li><p><strong>À nos contributeurs</strong>: Merci pour votre code, vos idées et votre temps. Vous améliorez Milvus chaque jour.</p></li>
<li><p><strong>À nos utilisateurs</strong>: Merci de confier à Milvus vos charges de travail de production et de partager vos expériences, qu'elles soient bonnes ou difficiles. Vos commentaires orientent notre feuille de route.</p></li>
<li><p><strong>Aux membres de notre communauté</strong>: Merci de répondre aux questions, de rédiger des tutoriels, de créer du contenu et d'aider les nouveaux venus à démarrer. Vous rendez notre communauté accueillante et inclusive.</p></li>
<li><p><strong>À nos partenaires et intégrateurs</strong>: Merci de construire avec nous et de faire de Milvus un citoyen de premier ordre dans l'écosystème du développement de l'IA.</p></li>
<li><p><strong>À l'équipe Zilliz</strong>: Merci pour votre engagement inébranlable envers le projet open-source et la réussite de nos utilisateurs.</p></li>
</ul>
<p>Milvus s'est développé parce que des milliers de personnes ont décidé de construire quelque chose ensemble - ouvertement, généreusement, et avec la conviction que l'infrastructure fondamentale de l'IA devrait être accessible à tous.</p>
<h2 id="Join-Us-on-This-Journey" class="common-anchor-header">Rejoignez-nous dans cette aventure<button data-href="#Join-Us-on-This-Journey" class="anchor-icon" translate="no">
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
    </button></h2><p>Que vous construisiez votre première application de recherche vectorielle ou que vous passiez à des milliards de vecteurs, nous serions ravis de vous compter parmi les membres de la communauté Milvus.</p>
<p><strong>Commencez</strong>:</p>
<ul>
<li><p><strong>⭐ Établissez-nous sur GitHub</strong>:<a href="https://github.com/milvus-io/milvus"> github.com/milvus-io/milvus</a></p></li>
<li><p>☁️ <strong>Essayez gratuitement Zilliz Cloud</strong>:<a href="https://zilliz.com/"> zilliz.com/cloud</a></p></li>
<li><p>💬 <strong>Rejoignez notre</strong> <a href="https://discord.com/invite/8uyFbECzPX"><strong>Discord</strong></a> pour vous connecter avec des développeurs du monde entier</p></li>
<li><p>📚 <strong>Explorez notre documentation</strong>: <a href="https://milvus.io/docs">Documentation Milvus</a></p></li>
<li><p>💬 <strong>Réservez</strong> <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>une session individuelle de 20 minutes</strong></a> pour obtenir des idées, des conseils et des réponses à vos questions.</p></li>
</ul>
<p>Le chemin à parcourir est passionnant. Alors que l'IA remodèle les industries et ouvre de nouvelles possibilités, les bases de données vectorielles se situeront au cœur de cette transformation. Ensemble, nous construisons le socle sémantique sur lequel reposent les applications modernes d'IA, et nous ne faisons que commencer.</p>
<p>Voici les prochaines 40 000 étoiles, et à construire <strong>ensemble</strong> l'avenir de l'infrastructure de l'IA. 🎉</p>
