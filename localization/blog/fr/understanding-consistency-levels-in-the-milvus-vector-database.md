---
id: understanding-consistency-levels-in-the-milvus-vector-database.md
title: Comprendre le niveau de cohérence dans la base de données vectorielles Milvus
author: Chenglong Li
date: 2022-08-29T00:00:00.000Z
desc: >-
  Découvrez les quatre niveaux de cohérence - forte, staleness limitée, session
  et éventuelle - pris en charge dans la base de données vectorielle Milvus.
cover: assets.zilliz.com/1280_X1280_0e0d4bc107.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_0e0d4bc107.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>Image de couverture</span> </span></p>
<blockquote>
<p>Cet article a été rédigé par <a href="https://github.com/JackLCL">Chenglong Li</a> et transcrit par <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Vous êtes-vous déjà demandé pourquoi les données que vous avez supprimées de la base de données vectorielles de Mlivus apparaissent encore dans les résultats de recherche ?</p>
<p>La raison la plus probable est que vous n'avez pas défini le niveau de cohérence approprié pour votre application. Le niveau de cohérence dans une base de données vectorielle distribuée est critique car il détermine à quel moment une écriture de données particulière peut être lue par le système.</p>
<p>Cet article vise donc à démystifier le concept de cohérence et à examiner les niveaux de cohérence pris en charge par la base de données vectorielle Milvus.</p>
<p><strong>Aller à :</strong></p>
<ul>
<li><a href="#What-is-consistency">Qu'est-ce que la cohérence ?</a></li>
<li><a href="#Four-levels-of-consistency-in-the-Milvus-vector-database">Quatre niveaux de cohérence dans la base de données vectorielle Milvus</a><ul>
<li><a href="#Strong">Forte</a></li>
<li><a href="#Bounded-staleness">Stabilité limitée</a></li>
<li><a href="#Session">Session</a></li>
<li><a href="#Eventual">Eventuel</a></li>
</ul></li>
</ul>
<h2 id="What-is-consistency" class="common-anchor-header">Qu'est-ce que la cohérence ?<button data-href="#What-is-consistency" class="anchor-icon" translate="no">
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
    </button></h2><p>Avant de commencer, nous devons d'abord clarifier la connotation de la cohérence dans cet article, car le mot "cohérence" est un terme surchargé dans l'industrie informatique. Dans une base de données distribuée, la cohérence fait spécifiquement référence à la propriété qui garantit que chaque nœud ou réplique a la même vue des données lors de l'écriture ou de la lecture des données à un moment donné. Par conséquent, nous parlons ici de cohérence comme dans le <a href="https://en.wikipedia.org/wiki/CAP_theorem">théorème CAP</a>.</p>
<p>Dans le monde moderne, les répliques multiples sont couramment adoptées pour servir les entreprises en ligne de grande envergure. Par exemple, le géant du commerce en ligne Amazon réplique ses commandes ou ses données SKU dans plusieurs centres de données, zones ou même pays afin de garantir une disponibilité élevée du système en cas de panne ou de défaillance. Cela pose un défi au système : la cohérence des données entre les différentes répliques. Sans cohérence, il est très probable que l'article supprimé de votre panier Amazon réapparaisse, ce qui nuirait à l'expérience de l'utilisateur.</p>
<p>C'est pourquoi nous avons besoin de différents niveaux de cohérence des données pour différentes applications. Heureusement, Milvus, une base de données pour l'IA, offre une certaine flexibilité en matière de niveau de cohérence et vous pouvez définir le niveau de cohérence qui convient le mieux à votre application.</p>
<h3 id="Consistency-in-the-Milvus-vector-database" class="common-anchor-header">Cohérence dans la base de données vectorielle Milvus</h3><p>Le concept de niveau de cohérence a été introduit pour la première fois avec la publication de Milvus 2.0. La version 1.0 de Milvus n'était pas une base de données vectorielle distribuée et nous n'avions donc pas prévu de niveaux de cohérence réglables à l'époque. Milvus 1.0 actualise les données toutes les secondes, ce qui signifie que les nouvelles données sont presque immédiatement visibles dès leur insertion et que Milvus lit la vue des données les plus récentes au moment précis où une recherche de similarité vectorielle ou une demande de renseignements est formulée.</p>
<p>Cependant, Milvus a été remanié dans sa version 2.0 et <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvus 2.0 est une base de données vectorielle distribuée</a> basée sur un mécanisme pub-sub. Le théorème <a href="https://en.wikipedia.org/wiki/PACELC_theorem">PACELC</a> souligne qu'un système distribué doit faire un compromis entre la cohérence, la disponibilité et la latence. En outre, différents niveaux de cohérence correspondent à différents scénarios. C'est pourquoi le concept de cohérence a été introduit dans <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">Milvus 2.0</a> et prend en charge l'ajustement des niveaux de cohérence.</p>
<h2 id="Four-levels-of-consistency-in-the-Milvus-vector-database" class="common-anchor-header">Quatre niveaux de cohérence dans la base de données vectorielle Milvus<button data-href="#Four-levels-of-consistency-in-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus prend en charge quatre niveaux de cohérence : forte, staleness limité, session et éventuelle. L'utilisateur de Milvus peut spécifier le niveau de cohérence lorsqu'il <a href="https://milvus.io/docs/v2.1.x/create_collection.md">crée une collection</a> ou effectue une <a href="https://milvus.io/docs/v2.1.x/search.md">recherche</a> ou une <a href="https://milvus.io/docs/v2.1.x/query.md">requête de</a> <a href="https://milvus.io/docs/v2.1.x/search.md">similarité vectorielle</a>. Cette section explique en quoi ces quatre niveaux de cohérence sont différents et quel est le scénario qui leur convient le mieux.</p>
<h3 id="Strong" class="common-anchor-header">Fort</h3><p>Strong est le niveau de cohérence le plus élevé et le plus strict. Il garantit que les utilisateurs peuvent lire la dernière version des données.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Strong_5d791eb8b2.png" alt="Strong" class="doc-image" id="strong" />
   </span> <span class="img-wrapper"> <span>Fort</span> </span></p>
<p>Selon le théorème de PACELC, si le niveau de cohérence est défini comme fort, la latence augmentera. Par conséquent, nous recommandons de choisir une cohérence forte lors des tests fonctionnels afin de garantir l'exactitude des résultats des tests. La cohérence forte est également la mieux adaptée aux applications qui exigent une cohérence stricte des données au détriment de la vitesse de recherche. Un exemple peut être un système financier en ligne traitant les paiements de commandes et la facturation.</p>
<h3 id="Bounded-staleness" class="common-anchor-header">L'obsolescence limitée</h3><p>L'obsolescence limitée, comme son nom l'indique, autorise l'incohérence des données pendant une certaine période. Toutefois, en règle générale, les données sont toujours globalement cohérentes en dehors de cette période.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Bounded_c034bc6e51.png" alt="Bounded_staleness" class="doc-image" id="bounded_staleness" />
   </span> <span class="img-wrapper"> <span>Stabilité limitée</span> </span></p>
<p>L'obsolescence limitée convient aux scénarios qui doivent contrôler la latence de la recherche et qui peuvent accepter une invisibilité sporadique des données. Par exemple, dans les systèmes de recommandation tels que les moteurs de recommandation vidéo, l'invisibilité des données a de temps en temps un impact très faible sur le taux de rappel global, mais peut augmenter de manière significative les performances du système de recommandation. Une application permettant de suivre l'état de vos commandes en ligne en est un exemple.</p>
<h3 id="Session" class="common-anchor-header">Session</h3><p>La session garantit que toutes les données écrites peuvent être immédiatement perçues en lecture au cours de la même session. En d'autres termes, lorsque vous écrivez des données via un client, les données nouvellement insérées deviennent instantanément consultables.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Session_6dc4782212.png" alt="Session" class="doc-image" id="session" />
   </span> <span class="img-wrapper"> <span>Session</span> </span></p>
<p>Nous recommandons de choisir session comme niveau de cohérence pour les scénarios dans lesquels la demande de cohérence des données au cours d'une même session est élevée. Un exemple peut être la suppression des données d'une entrée de livre dans le système de la bibliothèque, et après confirmation de la suppression et rafraîchissement de la page (une session différente), le livre ne devrait plus être visible dans les résultats de la recherche.</p>
<h3 id="Eventual" class="common-anchor-header">Éventuel</h3><p>Il n'y a pas d'ordre garanti pour les lectures et les écritures, et les répliques finissent par converger vers le même état si aucune autre opération d'écriture n'est effectuée. Dans le cadre de la cohérence éventuelle, les répliques commencent à travailler sur les demandes de lecture avec les dernières valeurs mises à jour. La cohérence éventuelle est le niveau le plus faible des quatre.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Eventual_7c66dd5b6f.png" alt="Eventual" class="doc-image" id="eventual" />
   </span> <span class="img-wrapper"> <span>Éventuelle</span> </span></p>
<p>Cependant, selon le théorème PACELC, la latence de recherche peut être considérablement réduite en sacrifiant la cohérence. Par conséquent, la cohérence éventuelle convient mieux aux scénarios qui n'exigent pas une grande cohérence des données, mais qui requièrent des performances de recherche ultra-rapides. Un exemple peut être la recherche de critiques et d'évaluations de produits Amazon avec une cohérence éventuelle.</p>
<h2 id="Endnote" class="common-anchor-header">Note de fin<button data-href="#Endnote" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour en revenir à la question posée au début de cet article, les données supprimées sont toujours renvoyées dans les résultats de recherche parce que l'utilisateur n'a pas choisi le niveau de cohérence approprié. La valeur par défaut du niveau de cohérence est bounded staleness (<code translate="no">Bounded</code>) dans la base de données vectorielle Milvus. Par conséquent, la lecture des données peut prendre du retard et Milvus peut lire la vue des données avant que vous n'ayez effectué des opérations de suppression au cours d'une recherche de similarité ou d'une requête. Toutefois, ce problème est simple à résoudre. Il vous suffit de <a href="https://milvus.io/docs/v2.1.x/tune_consistency.md">régler le niveau de cohérence</a> lors de la création d'une collection ou de la réalisation d'une recherche ou d'une requête de similarité vectorielle. C'est simple !</p>
<p>Dans le prochain article, nous dévoilerons le mécanisme et expliquerons comment la base de données vectorielles Milvus atteint différents niveaux de cohérence. Restez à l'écoute !</p>
<h2 id="Whats-next" class="common-anchor-header">Prochaines étapes<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Avec la sortie officielle de Milvus 2.1, nous avons préparé une série de blogs présentant les nouvelles fonctionnalités. En savoir plus sur cette série de blogs :</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Comment utiliser les données de chaîne pour renforcer vos applications de recherche de similarité</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Utilisation de Milvus embarqué pour installer et exécuter instantanément Milvus avec Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Augmenter le débit de lecture de votre base de données vectorielle avec des répliques en mémoire</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Comprendre le niveau de cohérence dans la base de données vectorielle Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Comprendre le niveau de cohérence dans la base de données vectorielle Milvus (partie II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Comment la base de données vectorielle Milvus assure-t-elle la sécurité des données ?</a></li>
</ul>
