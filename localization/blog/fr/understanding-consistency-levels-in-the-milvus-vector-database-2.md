---
id: understanding-consistency-levels-in-the-milvus-vector-database-2.md
title: >-
  Comprendre le niveau de cohérence dans la base de données vectorielles Milvus
  - Partie II
author: Jiquan Long
date: 2022-09-13T00:00:00.000Z
desc: >-
  Anatomie du mécanisme qui sous-tend les niveaux de cohérence ajustables dans
  la base de données vectorielle Milvus.
cover: assets.zilliz.com/1280_X1280_0e0d4bc107.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_0e0d4bc107.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>Image de couverture</span> </span></p>
<blockquote>
<p>Cet article est écrit par <a href="https://github.com/longjiquan">Jiquan Long</a> et transcrit par <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni.</a></p>
</blockquote>
<p>Dans le <a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">blog précédent</a> sur la cohérence, nous avons expliqué la connotation de la cohérence dans une base de données vectorielle distribuée, couvert les quatre niveaux de cohérence - forte, staleness limitée, session et éventuelle - pris en charge dans la base de données vectorielle Milvus, et expliqué le scénario d'application le mieux adapté à chaque niveau de cohérence.</p>
<p>Dans cet article, nous continuerons à examiner le mécanisme qui permet aux utilisateurs de la base de données vectorielle Milvus de choisir le niveau de cohérence idéal pour différents scénarios d'application. Nous fournirons également un tutoriel de base sur la manière de régler le niveau de cohérence dans la base de données vectorielle Milvus.</p>
<p><strong>Aller à :</strong></p>
<ul>
<li><a href="#The-underlying-time-tick-mechanism">Le mécanisme de tic-tac temporel sous-jacent</a></li>
<li><a href="#Guarantee-timestamp">Horodatage de garantie</a></li>
<li><a href="#Consistency-levels">Niveaux de cohérence</a></li>
<li><a href="#How-to-tune-consistency-level-in-Milvus">Comment régler le niveau de cohérence dans Milvus ?</a></li>
</ul>
<h2 id="The-underlying-time-tick-mechanism" class="common-anchor-header">Le mécanisme de tic-tac temporel sous-jacent<button data-href="#The-underlying-time-tick-mechanism" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus utilise le mécanisme de time tick pour garantir différents niveaux de cohérence lors d'une recherche vectorielle ou d'une requête. Time Tick est le filigrane de Milvus qui agit comme une horloge dans Milvus et indique à quel moment le système Milvus se trouve. Chaque fois qu'une requête en langage de manipulation de données (DML) est envoyée à la base de données vectorielles Milvus, un horodatage est attribué à la requête. Comme le montre la figure ci-dessous, lorsque de nouvelles données sont insérées dans la file d'attente des messages par exemple, Milvus marque non seulement un horodatage sur ces données insérées, mais insère également des tics temporels à intervalles réguliers.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/timetick_b395df9804.png" alt="timetick" class="doc-image" id="timetick" />
   </span> <span class="img-wrapper"> <span>timetick</span> </span></p>
<p>Prenons l'exemple de <code translate="no">syncTs1</code> dans la figure ci-dessus. Lorsque les consommateurs en aval, tels que les nœuds de requête, voient <code translate="no">syncTs1</code>, les composants consommateurs comprennent que toutes les données insérées avant <code translate="no">syncTs1</code> ont été consommées. En d'autres termes, les demandes d'insertion de données dont les valeurs d'horodatage sont inférieures à <code translate="no">syncTs1</code> n'apparaîtront plus dans la file d'attente des messages.</p>
<h2 id="Guarantee-Timestamp" class="common-anchor-header">Garantie d'horodatage<button data-href="#Guarantee-Timestamp" class="anchor-icon" translate="no">
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
    </button></h2><p>Comme indiqué dans la section précédente, les composants consommateurs en aval, tels que les nœuds de requête, obtiennent en permanence des messages de demandes d'insertion de données et des informations temporelles à partir de la file d'attente des messages. Chaque fois qu'un time tick est consommé, le nœud d'interrogation marque ce time tick consommé comme le temps utilisable - <code translate="no">ServiceTime</code> et toutes les données insérées avant <code translate="no">ServiceTime</code> sont visibles pour le nœud d'interrogation.</p>
<p>Outre <code translate="no">ServiceTime</code>, Milvus adopte également un type d'horodatage - l'horodatage de garantie (<code translate="no">GuaranteeTS</code>) pour répondre aux besoins des différents utilisateurs en matière de cohérence et de disponibilité. Cela signifie que les utilisateurs de la base de données vectorielles Milvus peuvent spécifier <code translate="no">GuaranteeTs</code> afin d'informer les nœuds d'interrogation que toutes les données antérieures à <code translate="no">GuaranteeTs</code> doivent être visibles et intervenir lors d'une recherche ou d'une interrogation.</p>
<p>Il existe généralement deux scénarios lorsque le nœud de recherche exécute une demande de recherche dans la base de données vectorielles Milvus.</p>
<h3 id="Scenario-1-Execute-search-request-immediately" class="common-anchor-header">Scénario 1 : Exécution immédiate de la demande de recherche</h3><p>Comme le montre la figure ci-dessous, si <code translate="no">GuaranteeTs</code> est plus petit que <code translate="no">ServiceTime</code>, les nœuds de requête peuvent exécuter la requête de recherche immédiatement.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/execute_immediately_dd1913775d.png" alt="execute_immediately" class="doc-image" id="execute_immediately" />
   </span> <span class="img-wrapper"> <span>execute_immediately</span> </span></p>
<h3 id="Scenario-2-Wait-till-ServiceTime--GuaranteeTs" class="common-anchor-header">Scénario 2 : attendre jusqu'à ce que "ServiceTime &gt; GuaranteeTs" (temps de service &gt; temps de garantie)</h3><p>Si <code translate="no">GuaranteeTs</code> est plus grand que <code translate="no">ServiceTime</code>, les nœuds de recherche doivent continuer à consommer le time tick de la file d'attente des messages. Les demandes de recherche ne peuvent pas être exécutées tant que <code translate="no">ServiceTime</code> n'est pas supérieur à <code translate="no">GuaranteeTs</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/wait_search_f09a2f6cf9.png" alt="wait_search" class="doc-image" id="wait_search" />
   </span> <span class="img-wrapper"> <span>wait_search</span> </span></p>
<h2 id="Consistency-Levels" class="common-anchor-header">Niveaux de cohérence<button data-href="#Consistency-Levels" class="anchor-icon" translate="no">
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
    </button></h2><p>Par conséquent, <code translate="no">GuaranteeTs</code> est configurable dans la requête de recherche pour atteindre le niveau de cohérence que vous avez spécifié. Une valeur élevée de <code translate="no">GuaranteeTs</code> garantit une <a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md#Strong">cohérence élevée</a> au prix d'une latence de recherche importante. Et un <code translate="no">GuaranteeTs</code> avec une petite valeur réduit la latence de recherche mais la visibilité des données est compromise.</p>
<p><code translate="no">GuaranteeTs</code> Milvus est un format d'horodatage hybride. Et l'utilisateur n'a aucune idée de l'<a href="https://github.com/milvus-io/milvus/blob/master/docs/design_docs/20211214-milvus_hybrid_ts.md">OST</a> à l'intérieur de Milvus. Par conséquent, la spécification de la valeur de<code translate="no">GuaranteeTs</code> est une tâche beaucoup trop compliquée pour les utilisateurs. Afin d'épargner les utilisateurs et de leur offrir une expérience optimale, Milvus demande uniquement aux utilisateurs de choisir le niveau de cohérence spécifique, et la base de données vectorielle Milvus traitera automatiquement la valeur <code translate="no">GuaranteeTs</code> pour les utilisateurs. En d'autres termes, l'utilisateur de Milvus n'a qu'à choisir parmi les quatre niveaux de cohérence : <code translate="no">Strong</code>, <code translate="no">Bounded</code>, <code translate="no">Session</code>, et <code translate="no">Eventually</code>. Chaque niveau de cohérence correspond à une certaine valeur de <code translate="no">GuaranteeTs</code>.</p>
<p>La figure ci-dessous illustre le site <code translate="no">GuaranteeTs</code> pour chacun des quatre niveaux de cohérence de la base de données vectorielle Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/guarantee_ts_f4b3e119d3.png" alt="guarantee_ts" class="doc-image" id="guarantee_ts" />
   </span> <span class="img-wrapper"> <span>garantie_ts</span> </span></p>
<p>La base de données vectorielles Milvus prend en charge quatre niveaux de cohérence :</p>
<ul>
<li><p><code translate="no">CONSISTENCY_STRONG</code>La base de données vectorielle Milvus prend en charge quatre niveaux de cohérence : <code translate="no">GuaranteeTs</code> est défini sur la même valeur que le dernier horodatage du système, et les nœuds de requête attendent que le temps de service passe au dernier horodatage du système pour traiter la demande de recherche ou de requête.</p></li>
<li><p><code translate="no">CONSISTENCY_EVENTUALLY</code> <code translate="no">GuaranteeTs</code> Les nœuds d'interrogation attendent que le temps de service atteigne le dernier horodatage du système pour traiter la demande de recherche ou d'interrogation. Les nœuds de requête effectuent une recherche immédiate dans la vue des données existantes.</p></li>
<li><p><code translate="no">CONSISTENCY_BOUNDED</code> <code translate="no">GuaranteeTs</code> est fixé à une valeur relativement plus petite que le dernier horodatage du système, et les nœuds d'interrogation effectuent une recherche sur une vue de données tolérément moins mise à jour.</p></li>
<li><p><code translate="no">CONSISTENCY_SESSION</code>: Le client utilise l'horodatage de la dernière opération d'écriture comme <code translate="no">GuaranteeTs</code> afin que chaque client puisse au moins récupérer les données qu'il a lui-même insérées.</p></li>
</ul>
<h2 id="How-to-tune-consistency-level-in-Milvus" class="common-anchor-header">Comment régler le niveau de cohérence dans Milvus ?<button data-href="#How-to-tune-consistency-level-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus prend en charge le réglage du niveau de cohérence lors de la <a href="https://milvus.io/docs/v2.1.x/create_collection.md">création d'une collection</a> ou de l'exécution d'une <a href="https://milvus.io/docs/v2.1.x/search.md">recherche</a> ou d'une <a href="https://milvus.io/docs/v2.1.x/query.md">requête</a>.</p>
<h3 id="Conduct-a-vector-similarity-search" class="common-anchor-header">Effectuer une recherche de similarité vectorielle</h3><p>Pour effectuer une recherche de similarité vectorielle avec le niveau de cohérence souhaité, il suffit de définir la valeur du paramètre <code translate="no">consistency_level</code> comme étant soit <code translate="no">Strong</code>, <code translate="no">Bounded</code>, <code translate="no">Session</code>, ou <code translate="no">Eventually</code>. Si vous ne définissez pas la valeur du paramètre <code translate="no">consistency_level</code>, le niveau de cohérence sera <code translate="no">Bounded</code> par défaut. L'exemple ci-dessous effectue une recherche de similarité vectorielle avec le niveau de cohérence <code translate="no">Strong</code>.</p>
<pre><code translate="no">results = collection.search(
        data=[[0.1, 0.2]], 
        anns_field=<span class="hljs-string">&quot;book_intro&quot;</span>, 
        param=search_params, 
        <span class="hljs-built_in">limit</span>=10, 
        <span class="hljs-built_in">expr</span>=None,
        consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Conduct-a-vector-query" class="common-anchor-header">Effectuer une requête vectorielle</h3><p>Comme pour la recherche de similarités vectorielles, vous pouvez spécifier la valeur du paramètre <code translate="no">consistency_level</code> lors de l'exécution d'une requête vectorielle. L'exemple effectue une recherche vectorielle avec la cohérence <code translate="no">Strong</code>.</p>
<pre><code translate="no">res = collection.query(
  <span class="hljs-built_in">expr</span> = <span class="hljs-string">&quot;book_id in [2,4,6,8]&quot;</span>, 
  output_fields = [<span class="hljs-string">&quot;book_id&quot;</span>, <span class="hljs-string">&quot;book_intro&quot;</span>],
  consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
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
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Comment utiliser les données de chaînes de caractères pour renforcer vos applications de recherche de similarité</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Utilisation de Milvus embarqué pour installer et exécuter instantanément Milvus avec Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Augmenter le débit de lecture de votre base de données vectorielle avec des répliques en mémoire</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Comprendre le niveau de cohérence dans la base de données vectorielle Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Comprendre le niveau de cohérence dans la base de données vectorielle Milvus (partie II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Comment la base de données vectorielle Milvus assure-t-elle la sécurité des données ?</a></li>
</ul>
