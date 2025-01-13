---
id: 2022-02-28-how-milvus-balances-query-load-across-nodes.md
title: Comment Milvus équilibre-t-il la charge des requêtes entre les nœuds ?
author: Xi Ge
date: 2022-02-28T00:00:00.000Z
desc: >-
  Milvus 2.0 prend en charge l'équilibrage automatique de la charge entre les
  nœuds d'interrogation.
cover: assets.zilliz.com/Load_balance_b2f35a5577.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Load_balance_b2f35a5577.png" alt="Binlog Cover Image" class="doc-image" id="binlog-cover-image" />
   </span> <span class="img-wrapper"> <span>Image de couverture Binlog</span> </span></p>
<p>Par <a href="https://github.com/xige-16">Xi Ge</a>.</p>
<p>Dans les articles de blog précédents, nous avons successivement présenté les fonctions de suppression, de jeu de bits et de compactage dans Milvus 2.0. Pour conclure cette série, nous aimerions partager la conception de l'équilibrage de charge, une fonction vitale dans le cluster distribué de Milvus.</p>
<h2 id="Implementation" class="common-anchor-header">Mise en œuvre<button data-href="#Implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>Si le nombre et la taille des segments mis en mémoire tampon dans les nœuds d'interrogation diffèrent, les performances de recherche entre les nœuds d'interrogation peuvent également varier. Le pire des cas pourrait se produire lorsque quelques nœuds d'interrogation sont épuisés par la recherche d'une grande quantité de données, mais que les nœuds d'interrogation nouvellement créés restent inactifs parce qu'aucun segment ne leur est distribué, ce qui entraîne un gaspillage massif des ressources de l'unité centrale et une baisse considérable des performances de recherche.</p>
<p>Pour éviter de telles circonstances, le coordinateur des requêtes (query coord) est programmé pour distribuer des segments de manière égale à chaque nœud de requête en fonction de l'utilisation de la mémoire vive des nœuds. Les ressources de l'unité centrale sont donc consommées de manière égale par tous les nœuds, ce qui améliore considérablement les performances de la recherche.</p>
<h3 id="Trigger-automatic-load-balance" class="common-anchor-header">Déclencher l'équilibrage automatique de la charge</h3><p>Selon la valeur par défaut de la configuration <code translate="no">queryCoord.balanceIntervalSeconds</code>, la coordination des requêtes vérifie l'utilisation de la mémoire vive (en pourcentage) de tous les nœuds de requête toutes les 60 secondes. Si l'une des conditions suivantes est remplie, la coordination des requêtes commence à équilibrer la charge des requêtes sur le nœud de requête :</p>
<ol>
<li>L'utilisation de la RAM de n'importe quel nœud de requête dans le cluster est supérieure à <code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code> (par défaut : 90) ;</li>
<li>ou la valeur absolue de la différence d'utilisation de la RAM entre deux nœuds de requête est supérieure à <code translate="no">queryCoord.memoryUsageMaxDifferencePercentage</code> (valeur par défaut : 30).</li>
</ol>
<p>Une fois que les segments sont transférés du nœud de requête source au nœud de requête de destination, ils doivent également satisfaire aux deux conditions suivantes :</p>
<ol>
<li>L'utilisation de la mémoire vive du nœud de destination n'est pas supérieure à <code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code> (valeur par défaut : 90) ;</li>
<li>La valeur absolue de la différence d'utilisation de la RAM des nœuds de requête source et de destination après l'équilibrage de la charge est inférieure à celle avant l'équilibrage de la charge.</li>
</ol>
<p>Lorsque les conditions ci-dessus sont remplies, la coordination des requêtes procède à l'équilibrage de la charge de la requête entre les nœuds.</p>
<h2 id="Load-balance" class="common-anchor-header">Équilibrage de la charge<button data-href="#Load-balance" class="anchor-icon" translate="no">
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
    </button></h2><p>Lorsque l'équilibrage de la charge est déclenché, la coordinatrice des requêtes charge d'abord le(s) segment(s) cible(s) dans le nœud de destination. Les deux nœuds d'interrogation renvoient les résultats de recherche du ou des segments cibles à chaque demande de recherche à ce stade, afin de garantir l'exhaustivité du résultat.</p>
<p>Une fois que le nœud d'interrogation de destination a chargé avec succès le segment cible, le coordonnateur d'interrogation publie une adresse <code translate="no">sealedSegmentChangeInfo</code> sur le canal d'interrogation. Comme indiqué ci-dessous, <code translate="no">onlineNodeID</code> et <code translate="no">onlineSegmentIDs</code> indiquent respectivement le nœud de requête qui charge le segment et le segment chargé, et <code translate="no">offlineNodeID</code> et <code translate="no">offlineSegmentIDs</code> indiquent respectivement le nœud de requête qui doit libérer le segment et le segment à libérer.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220228_145413_f253cec15b.png" alt="sealedSegmentChangeInfo" class="doc-image" id="sealedsegmentchangeinfo" />
   </span> <span class="img-wrapper"> <span>sealedSegmentChangeInfo</span> </span></p>
<p>Après avoir reçu l'information <code translate="no">sealedSegmentChangeInfo</code>, le nœud de requête source libère le segment cible.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220228_145436_2604bc57a5.png" alt="Load Balance Workflow" class="doc-image" id="load-balance-workflow" />
   </span> <span class="img-wrapper"> <span>Processus d'équilibrage de la charge</span> </span></p>
<p>L'ensemble du processus aboutit lorsque le nœud de requête source libère le segment cible. La charge de la requête est alors équilibrée entre les nœuds de requête, ce qui signifie que l'utilisation de la mémoire vive de tous les nœuds de requête n'est pas supérieure à <code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code>, et que la valeur absolue de la différence d'utilisation de la mémoire vive entre les nœuds de requête source et de destination après l'équilibrage de la charge est inférieure à celle observée avant l'équilibrage de la charge.</p>
<h2 id="Whats-next" class="common-anchor-header">Quelles sont les prochaines étapes ?<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans la série de blogs sur les nouvelles fonctionnalités de la version 2.0, nous expliquons la conception des nouvelles fonctionnalités. Plus d'informations dans cette série de blogs !</p>
<ul>
<li><a href="https://milvus.io/blog/2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md">Comment Milvus supprime les données en continu dans un cluster distribué</a></li>
<li><a href="https://milvus.io/blog/2022-2-21-compact.md">Comment compacter les données dans Milvus ?</a></li>
<li><a href="https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md">Comment Milvus équilibre la charge des requêtes entre les nœuds ?</a></li>
<li><a href="https://milvus.io/blog/2022-2-14-bitset.md">Comment Bitset permet la polyvalence de la recherche par similarité vectorielle</a></li>
</ul>
<p>Ceci est le dernier article de la série de blogs sur les nouvelles fonctionnalités de Milvus 2.0. Après cette série, nous prévoyons une nouvelle série de Milvus <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Deep Dive</a>, qui présente l'architecture de base de Milvus 2.0. Restez à l'écoute.</p>
