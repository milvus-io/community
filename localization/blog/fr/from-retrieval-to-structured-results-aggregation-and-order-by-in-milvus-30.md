---
id: from-retrieval-to-structured-results-aggregation-and-order-by-in-milvus-30.md
title: >-
  De la recherche aux résultats structurés : agrégation et ORDER BY dans Milvus
  3.0
author: Chun Han
date: 2026-8-7
cover: assets.zilliz.com/cover_of_milvus_3_blog_37a6c88c81.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 3.0, query aggregation, Search Aggregation, ORDER BY, vector search'
meta_title: |
  Milvus 3.0 Aggregation & ORDER BY: Query and Search Guide
desc: >-
  Découvrez comment Milvus 3.0 ajoute l’agrégation de requêtes, Search
  Aggregation et ORDER BY côté serveur pour des résultats de recherche
  vectorielle structurés et efficaces.
origin: >-
  https://milvus.io/blog/from-retrieval-to-structured-results-aggregation-and-order-by-in-milvus-30.md
---
<p>Prenons un flux de recherche de produits familier. Un acheteur téléverse la photo d’une robe, et la recherche vectorielle récupère un ensemble de candidats pertinents dans un catalogue contenant des dizaines de millions de produits.</p>
<p>La page a toutefois besoin de plus qu’une liste classée. Elle a besoin de facettes de marques. Elle a besoin d’un tri par prix. L’équipe merchandising veut savoir quelles marques dominent cet ensemble de résultats, la plage de prix au sein de chaque marque, et quelques produits représentatifs de chaque groupe.</p>
<p>Avant Milvus 3.0, les applications géraient couramment cette seconde étape elles-mêmes : récupérer les lignes depuis Milvus, les regrouper et les trier dans pandas ou dans une couche de service, puis assembler la réponse. Certaines équipes maintenaient un pipeline d’analytique séparé uniquement pour calculer les nombres et les distributions sur des données déjà présentes dans la base de données vectorielle.</p>
<p>La base de données vectorielle trouvait les candidats ; l’application devait les transformer en un résultat structuré.</p>
<p>Milvus 3.0 déplace une plus grande partie de ce travail dans le moteur de récupération. Il ajoute trois capacités liées mais distinctes :</p>
<ul>
<li><strong>L’agrégation de requêtes</strong> calcule <code translate="no">count</code>, <code translate="no">sum</code>, <code translate="no">avg</code>, <code translate="no">min</code> et <code translate="no">max</code> sur les lignes filtrées et visibles, avec des champs <code translate="no">GROUP BY</code> facultatifs.</li>
<li><strong>Search Aggregation</strong> organise les candidats de plus proches voisins approximatifs (ANN) conservés en compartiments, calcule des métriques par compartiment, construit des compartiments imbriqués et renvoie des résultats représentatifs.</li>
<li><strong>Le tri côté serveur</strong> <code translate="no">**ORDER BY**</code> trie les résultats de requête ou les candidats ANN selon un ou plusieurs champs scalaires avant que l’application les reçoive.</li>
</ul>
<p>La distinction entre requête et recherche est importante :</p>
<table>
<thead>
<tr><th>Capacité</th><th>Données résumées ou ordonnées</th><th>Forme principale du résultat</th><th>Limite d’exactitude</th></tr>
</thead>
<tbody>
<tr><td>Agrégation de requêtes</td><td>Toutes les lignes visibles qui correspondent au filtre</td><td>Une ligne par groupe, avec des valeurs agrégées</td><td>Exacte sur l’ensemble de lignes visibles de la requête</td></tr>
<tr><td>Search Aggregation</td><td>Candidats conservés par la recherche ANN et l’étape de regroupement</td><td>Compartiments, métriques, résultats représentatifs et compartiments enfants facultatifs</td><td>Approximative par conception</td></tr>
<tr><td>Requête <code translate="no">ORDER BY</code></td><td>Lignes visibles qui correspondent au filtre</td><td>Lignes triées</td><td>Exacte sur le résultat de requête filtré</td></tr>
<tr><td>Recherche <code translate="no">ORDER BY</code></td><td>Candidats ANN</td><td>Résultats de recherche ou groupes triés</td><td>N’élargit pas la limite de rappel de l’ANN</td></tr>
</tbody>
</table>
<p>Cet article explique pourquoi ces opérations ont leur place dans la base de données, comment fonctionne l’agrégation distribuée, en quoi Search Aggregation diffère de Grouping Search, et où s’arrêtent les nouvelles sémantiques.</p>
<h2 id="Why-application-side-post-processing-breaks-down" class="common-anchor-header">Pourquoi le post-traitement côté application atteint ses limites<button data-href="#Why-application-side-post-processing-breaks-down" class="anchor-icon" translate="no">
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
    </button></h2><p>Déplacer l’agrégation et le tri vers l’application peut ressembler à un petit choix d’implémentation. À grande échelle, cela crée trois problèmes plus importants.</p>
<h3 id="The-application-moves-far-more-data-than-the-answer-contains" class="common-anchor-header">L’application déplace beaucoup plus de données que la réponse n’en contient</h3><p>Supposons qu’un tableau de bord opérationnel ait besoin du nombre de produits et du prix moyen pour chaque catégorie parmi deux millions de lignes en stock. Même avec une charge utile approximative de seulement 100 octets par ligne pour la catégorie, le prix, la clé primaire et les frais de sérialisation, l’application doit recevoir environ 200 Mo de données avant de pouvoir calculer le résultat.</p>
<p>Si le catalogue compte 200 catégories, la réponse ne représente que quelques centaines de clés et de nombres — de l’ordre de quelques kilooctets. L’application déplace plusieurs ordres de grandeur de données en plus que ce qu’elle renvoie, paie le même coût à chaque actualisation, et a besoin d’une mémoire cliente suffisante pour conserver ou diffuser les lignes intermédiaires.</p>
<p>Une agrégation dans le moteur change l’unité de déplacement des données. Les lignes brutes restent là où elles sont. Ce qui traverse les nœuds et finit par quitter Milvus est l’ensemble beaucoup plus réduit des états de groupe partiels et finaux.</p>
<h3 id="Page-local-sorting-is-not-global-sorting" class="common-anchor-header">Le tri local à une page n’est pas un tri global</h3><p>Trier après la pagination est un bogue de correction, pas seulement une implémentation inefficace.</p>
<p>Si une application récupère les lignes 11 à 20 et ne trie que ces lignes par prix, elle a produit l’ordre par prix à l’intérieur de cette page — et non les lignes 11 à 20 du résultat global trié par prix. Une page ultérieure peut contenir des produits moins chers que tous les produits de la première page.</p>
<p>La même limite compte dans la recherche vectorielle. Récupérer un petit ensemble Top-K et le trier dans l’application ne peut réordonner que ces candidats. Cela ne peut pas récupérer des candidats pertinents que l’étape ANN n’a pas renvoyés, et cela conduit souvent les applications à sur-récupérer simplement pour rendre le tri côté client utile.</p>
<p>Le tri côté serveur donne à Milvus le contrôle de la séquence d’ordonnancement et de pagination. Pour les charges de travail de requête, le moteur trie l’ensemble de lignes filtré avant d’appliquer la fenêtre de page. Pour les charges de travail de recherche, il trie à l’intérieur de la limite des candidats ANN et garde cette limitation explicite.</p>
<h3 id="The-client-cannot-reproduce-database-visibility" class="common-anchor-header">Le client ne peut pas reproduire la visibilité de la base de données</h3><p>L’agrégation dépend également des lignes visibles à l’horodatage de la requête. Les suppressions, les entités expirées et les écritures concurrentes sont régies par le contrôle de concurrence multiversion (MVCC) et les sémantiques de cohérence de Milvus.</p>
<p>Une fois que les lignes brutes quittent la base de données, l’application suppose généralement que le lot reçu représente l’instantané correct. Reconstruire les mêmes règles de visibilité dans un client est impraticable, surtout pendant que la collection reçoit des écritures et des suppressions.</p>
<p>La solution de contournement courante — un second moteur analytique alimenté par exportation et ETL — ajoute une autre copie des données, une autre limite de cohérence et un autre pipeline à exploiter. Les nombres, les métriques et le tri devraient s’exécuter là où les données et leurs règles de visibilité existent déjà.</p>
<p>Voyons maintenant ce que propose Milvus 3.0.</p>
<h2 id="Query-aggregation-exact-statistics-over-visible-rows" class="common-anchor-header">Agrégation de requêtes : statistiques exactes sur les lignes visibles<button data-href="#Query-aggregation-exact-statistics-over-visible-rows" class="anchor-icon" translate="no">
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
    </button></h2><p>L’agrégation de requêtes répond à des questions telles que :</p>
<ul>
<li>Combien de produits en stock y a-t-il dans chaque catégorie ?</li>
<li>Quel est le prix moyen par marque ?</li>
<li>Quels sont les horodatages d’événements minimum et maximum pour chaque hôte ?</li>
<li>Combien d’enregistrements restent après l’application d’un filtre et de la visibilité TTL ?</li>
</ul>
<p>L’API paraît familière à quiconque a utilisé SQL : passez un ou plusieurs champs dans <code translate="no">group_by_fields</code>, puis placez les expressions d’agrégation dans <code translate="no">output_fields</code>.</p>
<pre><code translate="no" class="language-python">res = client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;status == &quot;on_sale&quot;&#x27;</span>,
    group_by_fields=[<span class="hljs-string">&quot;category&quot;</span>],
    output_fields=[<span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;count(*)&quot;</span>, <span class="hljs-string">&quot;avg(price)&quot;</span>],
)

<span class="hljs-comment"># [</span>
<span class="hljs-comment">#     {&quot;category&quot;: &quot;books&quot;, &quot;count(*)&quot;: 18734, &quot;avg(price)&quot;: 45.3},</span>
<span class="hljs-comment">#     ...</span>
<span class="hljs-comment"># ]</span>
<button class="copy-code-btn"></button></code></pre>
<p>La syntaxe est la partie simple. Le modèle d’exécution est ce qui rend le résultat utile dans une base de données vectorielle distribuée.</p>
<h3 id="Segment-local-states-replace-raw-row-movement" class="common-anchor-header">Les états locaux aux segments remplacent le déplacement de lignes brutes</h3><p>Une collection Milvus peut s’étendre sur des centaines ou des milliers de segments distribués sur plusieurs nœuds de requête, avec des données récemment écrites encore sur le chemin de streaming. Aucun nœud d’exécution ne commence avec toutes les lignes visibles.</p>
<p>Milvus pousse donc l’agrégation vers les segments :</p>
<ol>
<li>Chaque segment applique localement les règles de filtre et de visibilité MVCC.</li>
<li>Le segment émet un état partiel par groupe au lieu de ses lignes correspondantes.</li>
<li>Les états partiels sont fusionnés au sein d’un nœud de requête.</li>
<li>Le proxy effectue la fusion finale entre nœuds et renvoie les groupes complétés.</li>
</ol>
<p>La quantité de données intermédiaires évolue désormais avec le nombre de groupes et d’états d’agrégation, plutôt que directement avec le nombre de lignes correspondantes.</p>
<p>L’opération de fusion dépend de l’agrégat :</p>
<table>
<thead>
<tr><th>Agrégat</th><th>État partiel</th><th>Règle de fusion</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">count</code></td><td>Nombre partiel</td><td>Additionner les nombres</td></tr>
<tr><td><code translate="no">sum</code></td><td>Somme partielle</td><td>Additionner les sommes</td></tr>
<tr><td><code translate="no">min</code></td><td>Minimum partiel</td><td>Prendre le minimum</td></tr>
<tr><td><code translate="no">max</code></td><td>Maximum partiel</td><td>Prendre le maximum</td></tr>
<tr><td><code translate="no">avg</code></td><td>Somme et nombre partiels</td><td>Additionner les deux états, puis diviser une seule fois à l’étape finale</td></tr>
</tbody>
</table>
<p><code translate="no">avg</code> est le cas instructif. Faire la moyenne de deux moyennes partielles est incorrect lorsque les partitions contiennent des nombres de lignes différents. Milvus transporte <code translate="no">sum</code> et <code translate="no">count</code> indépendamment et ne calcule la moyenne finale qu’après leur fusion globale.</p>
<p>C’est l’une des raisons pour lesquelles l’agrégation a sa place dans la base de données : l’opération ne consiste pas simplement à « exécuter la même fonction sur plusieurs lots ». Le moteur doit préserver l’algèbre de chaque agrégat à travers les limites des segments et des nœuds.</p>
<h3 id="Visibility-is-applied-before-aggregation" class="common-anchor-header">La visibilité est appliquée avant l’agrégation</h3><p>Les lignes supprimées et expirées sont retirées des états partiels au niveau du segment selon la limite de visibilité de la requête. Elles ne remontent pas pour être ensuite corrigées dans l’application.</p>
<p>Le résultat décrit donc les lignes que Milvus considère comme visibles pour cette requête, et non une collection arbitraire de lots extraits à des moments légèrement différents.</p>
<h3 id="limit-now-counts-groups" class="common-anchor-header"><code translate="no">limit</code> compte désormais les groupes</h3><p>Dans une requête normale, <code translate="no">limit</code> contrôle le nombre de lignes d’entités renvoyées. Dans une requête groupée, il contrôle le nombre de groupes renvoyés. Comme la cardinalité du résultat est déterminée par les groupes plutôt que par les lignes correspondantes, une agrégation de requêtes peut également omettre <code translate="no">limit</code> lorsqu’elle a besoin de tous les groupes.</p>
<p>Cela ressemble à un petit détail d’API, mais cela reflète un modèle de résultat différent : la sortie n’est plus une page d’entités. C’est une relation dont les lignes représentent des groupes.</p>
<h2 id="Search-Aggregation-a-bucketed-view-of-ANN-candidates" class="common-anchor-header">Search Aggregation : une vue en compartiments des candidats ANN<button data-href="#Search-Aggregation-a-bucketed-view-of-ANN-candidates" class="anchor-icon" translate="no">
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
    </button></h2><p>L’agrégation de requêtes répond à la question : « À quoi ressemblent les lignes visibles correspondant à ce filtre ? » Search Aggregation pose une question différente : « À quoi ressemble l’ensemble de candidats récupéré pour ce vecteur ? »</p>
<p>Cette opération n’a pas d’équivalent SQL exact. La recherche ANN établit d’abord une limite de candidats guidée par la similarité. Milvus organise ensuite les candidats conservés selon des clés scalaires et renvoie une arborescence de compartiments au lieu d’une liste plate ordinaire de résultats.</p>
<p>Un compartiment peut contenir :</p>
<ul>
<li>une clé telle que <code translate="no">brand</code> ou une clé composite telle que <code translate="no">(brand, color)</code> ;</li>
<li>un nombre de candidats conservés ;</li>
<li>des métriques incluant <code translate="no">count</code>, <code translate="no">sum</code>, <code translate="no">avg</code>, <code translate="no">min</code> et <code translate="no">max</code> ;</li>
<li>des entités représentatives sélectionnées avec <code translate="no">top_hits</code> ; et</li>
<li>une <code translate="no">sub_aggregation</code> imbriquée qui crée des compartiments enfants.</li>
</ul>
<p>Pour la page de recherche de produits, une seule requête peut renvoyer des compartiments de marques, le prix moyen dans chaque compartiment, et trois produits représentatifs par marque :</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> SearchAggregation, TopHits

aggregation = SearchAggregation(
    fields=[<span class="hljs-string">&quot;brand&quot;</span>],
    size=<span class="hljs-number">10</span>,                                    <span class="hljs-comment"># Return up to 10 brand buckets</span>
    metrics={<span class="hljs-string">&quot;avg_price&quot;</span>: {<span class="hljs-string">&quot;avg&quot;</span>: <span class="hljs-string">&quot;price&quot;</span>}},
    order=[{<span class="hljs-string">&quot;_count&quot;</span>: <span class="hljs-string">&quot;desc&quot;</span>}],               <span class="hljs-comment"># Order by retained-candidate count</span>
    top_hits=TopHits(
        size=<span class="hljs-number">3</span>,
        sort=[{<span class="hljs-string">&quot;_score&quot;</span>: <span class="hljs-string">&quot;desc&quot;</span>}],            <span class="hljs-comment"># Use &quot;asc&quot; for L2 distance</span>
    ),
)

res = client.search(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_aggregation=aggregation,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;brand&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
)

buckets = res.agg_buckets[<span class="hljs-number">0</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Lorsque <code translate="no">search_aggregation</code> est défini, la liste ordinaire des résultats est vide. L’application lit la réponse de compartiments depuis <code translate="no">result.agg_buckets</code>.</p>
<h3 id="The-aggregation-specification-sets-two-different-bounds" class="common-anchor-header">La spécification d’agrégation définit deux limites différentes</h3><p>Search Aggregation n’exécute pas un <code translate="no">GROUP BY</code> sur chaque entité de la collection, et ne se contente pas de prendre une réponse Top-K ordinaire pour agréger cette liste plate.</p>
<p>Son exécution comporte trois étapes :</p>
<ol>
<li>Milvus exécute une recherche ANN pour récupérer des candidats proches du vecteur de requête.</li>
<li>L’étape de regroupement conserve un nombre borné de candidats pour chaque clé complète de compartiment.</li>
<li>Milvus construit les compartiments, calcule les métriques sur les candidats conservés, ordonne les compartiments et attache des résultats représentatifs ou des compartiments enfants.</li>
</ol>
<p>Deux paramètres contrôlent différentes parties du résultat :</p>
<ul>
<li><code translate="no">SearchAggregation.size</code> limite le nombre de compartiments renvoyés à ce niveau d’agrégation.</li>
<li>Le plus grand <code translate="no">TopHits.size</code> n’importe où dans l’arborescence d’agrégation définit le budget de candidats conservés pour chaque clé composite complète. Si la requête ne contient pas de <code translate="no">top_hits</code>, le budget par clé vaut un par défaut.</li>
</ul>
<p>Le <code translate="no">limit</code> de recherche de premier niveau ne contrôle pas ce mode et est ignoré lorsque <code translate="no">search_aggregation</code> est présent.</p>
<p>Cette distinction est essentielle lors de la lecture du <code translate="no">count</code> ou des métriques d’un compartiment. Avec <code translate="no">TopHits(size=3)</code>, un compartiment de marque peut résumer au plus trois candidats conservés pour sa clé complète, même si la collection contient des milliers de produits pertinents de cette marque. Augmenter <code translate="no">TopHits.size</code> élargit la fenêtre de métriques par clé, mais cela ne transforme pas la recherche ANN en analyse exacte.</p>
<p>Si l’application a besoin de statistiques exactes sur chaque ligne visible correspondant à un filtre, elle doit utiliser l’agrégation de requêtes. Search Aggregation sert à décrire et comparer les candidats produits par la récupération par similarité.</p>
<h2 id="Search-Aggregation-and-Grouping-Search-solve-different-problems" class="common-anchor-header">Search Aggregation et Grouping Search résolvent des problèmes différents<button data-href="#Search-Aggregation-and-Grouping-Search-solve-different-problems" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus prend en charge Grouping Search (<code translate="no">group_by</code>) depuis Milvus 2.4. Il est facile de voir le mot « grouping » dans les deux fonctionnalités et de supposer qu’il s’agit de deux interfaces pour la même opération. Leurs contrats de sortie sont différents.</p>
<p><strong>Grouping Search</strong> modifie les entités qui apparaissent dans une liste de résultats classée. Un schéma RAG courant stocke les fragments comme des entités individuelles, les regroupe par <code translate="no">doc_id</code>, et renvoie un ou quelques fragments de chaque document. La sortie principale reste des résultats de recherche ordinaires, mais avec moins de valeurs répétées du champ de regroupement.</p>
<p><strong>Search Aggregation</strong> renvoie une vue statistique. La sortie principale est une arborescence de compartiments contenant des clés, des nombres, des métriques, des résultats représentatifs et des compartiments enfants facultatifs.</p>
<table>
<thead>
<tr><th>Besoin de l’application</th><th>À privilégier</th><th>À consommer</th></tr>
</thead>
<tbody>
<tr><td>Une liste d’entités classée avec une plus grande diversité sur un champ</td><td>Grouping Search</td><td>Résultats de recherche ordinaires</td></tr>
<tr><td>Nombres de facettes, métriques par groupe, résultats représentatifs ou distributions imbriquées</td><td>Search Aggregation</td><td>Objets <code translate="no">AggregationBucket</code> dans <code translate="no">result.agg_buckets</code></td></tr>
</tbody>
</table>
<p>Une règle pratique consiste à partir de la forme de réponse de l’interface utilisateur ou de l’API. Si l’application affiche une liste, Grouping Search est généralement la bonne primitive. Si elle affiche des facettes, des cartes de distribution ou une hiérarchie de groupes, utilisez Search Aggregation.</p>
<p>Les deux modes sont mutuellement exclusifs dans une même requête, car ils définissent des formes de résultat principales différentes.</p>
<h2 id="ORDER-BY-move-sorting-before-the-application-boundary" class="common-anchor-header"><code translate="no">ORDER BY</code> : déplacer le tri avant la limite de l’application<button data-href="#ORDER-BY-move-sorting-before-the-application-boundary" class="anchor-icon" translate="no">
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
    </button></h2><p>Le tri est la fonctionnalité la moins exotique de cette version et l’une des plus faciles à implémenter incorrectement en dehors du moteur.</p>
<p>Milvus 3.0 expose le tri à la fois sur les requêtes et sur la recherche, mais les deux chemins utilisent des paramètres SDK différents et opèrent sur des ensembles d’entrée différents.</p>
<h3 id="Query-sorting-orders-the-filtered-row-set" class="common-anchor-header">Le tri des requêtes ordonne l’ensemble de lignes filtré</h3><p>La requête PyMilvus utilise <code translate="no">order_by</code>, exprimé comme une liste de chaînes <code translate="no">&quot;field:direction&quot;</code>. Le moteur applique le filtre, ordonne les lignes visibles, puis applique <code translate="no">limit</code> et <code translate="no">offset</code>.</p>
<pre><code translate="no" class="language-python">res = client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;category == &quot;books&quot;&#x27;</span>,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
    order_by=[<span class="hljs-string">&quot;price:desc&quot;</span>, <span class="hljs-string">&quot;title:asc&quot;</span>],
    limit=<span class="hljs-number">10</span>,
    offset=<span class="hljs-number">10</span>,  <span class="hljs-comment"># Rows 11-20 in the filtered, price-sorted result</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Cela rend les requêtes utiles pour la navigation ordonnée métier : enregistrements ingérés les plus récents, produits les plus chers dans un filtre, inventaire le plus bas, ou valeurs extrêmes pour l’inspection des données. Sans ordonnancement côté serveur, les applications devaient d’abord récupérer les lignes et ne pouvaient pas définir un ordre métier fiable entre les pages.</p>
<p>Pour les champs de requête pouvant être nuls, l’ordre croissant place les valeurs nulles en dernier et l’ordre décroissant les place en premier. Un champ de tri n’a pas besoin d’apparaître dans <code translate="no">output_fields</code> ; incluez-le uniquement lorsque l’application a besoin de la valeur dans la réponse.</p>
<h3 id="Search-sorting-reorders-the-ANN-candidate-set" class="common-anchor-header">Le tri de recherche réordonne l’ensemble de candidats ANN</h3><p>La recherche PyMilvus utilise <code translate="no">order_by_fields</code>, où chaque entrée nomme un champ scalaire et une direction :</p>
<pre><code translate="no" class="language-python">res = client.search(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    <span class="hljs-built_in">limit</span>=50,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
    order_by_fields=[
        {<span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;price&quot;</span>, <span class="hljs-string">&quot;order&quot;</span>: <span class="hljs-string">&quot;asc&quot;</span>},
    ],
)
<button class="copy-code-btn"></button></code></pre>
<p>L’ANN détermine toujours quelles entités deviennent des candidats. <code translate="no">order_by_fields</code> change la manière dont ces candidats sont renvoyés ; cela ne fait pas parcourir globalement la collection par la recherche pour trouver les produits les moins chers.</p>
<p>Cette limite donne aux deux API des rôles distincts :</p>
<ul>
<li>Utilisez une requête avec <code translate="no">order_by</code> lorsque l’ordre scalaire définit lui-même le résultat, par exemple les dix produits en stock les moins chers.</li>
<li>Utilisez une recherche avec <code translate="no">order_by_fields</code> lorsque la pertinence sémantique ou vectorielle définit l’ensemble de candidats et qu’un champ scalaire détermine comment ces candidats doivent être présentés.</li>
</ul>
<p>Le tri multi-champs applique les clés dans l’ordre de la liste. Lorsque des candidats de recherche ont les mêmes valeurs pour chaque clé scalaire spécifiée, Milvus conserve leur ordre original selon le score de similarité.</p>
<p>Le tri se compose également avec Grouping Search. Milvus ordonne les groupes selon la valeur scalaire configurée de la meilleure entité de chaque groupe tout en conservant la forme de résultat groupée. C’est utile lorsque l’application veut à la fois de la diversité sur un champ et un ordre de groupe pertinent pour le métier.</p>
<h2 id="What-these-capabilities-make-possible" class="common-anchor-header">Ce que ces capacités rendent possible<button data-href="#What-these-capabilities-make-possible" class="anchor-icon" translate="no">
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
    </button></h2><p>Les API sont des primitives générales de base de données, mais plusieurs charges de travail de récupération en bénéficient immédiatement.</p>
<h3 id="RAG-and-agents-inspect-retrieval-concentration" class="common-anchor-header">RAG et agents : inspecter la concentration de la récupération</h3><p>Un système RAG ou agentique peut regrouper les fragments récupérés par document source, ligne de produits, locataire ou type de contenu. Un résultat concentré dans deux documents porte un signal de couverture différent d’un résultat réparti sur des dizaines de sources.</p>
<p>Cette distribution n’est pas une garantie de qualité de réponse. C’est toutefois un diagnostic de récupération utile qu’une application ou un agent peut combiner avec les scores, les citations et d’autres vérifications pour décider s’il faut élargir la requête, relancer la récupération ou demander une clarification.</p>
<p>Grouping Search reste le bon choix lorsque l’objectif est simplement de diversifier les fragments renvoyés. Search Aggregation est utile lorsque le système a besoin de la distribution elle-même.</p>
<h3 id="E-commerce-and-content-recommendation-return-facets-with-the-search" class="common-anchor-header">E-commerce et recommandation de contenu : renvoyer les facettes avec la recherche</h3><p>La page de recherche de produits initiale peut recevoir depuis Milvus des compartiments de marques, des métriques de prix, des articles représentatifs et une liste de candidats triée par scalaire. L’application contrôle toujours la présentation et la logique métier, mais elle n’a plus besoin de reconstruire les sémantiques de compartiments de base à partir de résultats exportés.</p>
<h3 id="Logs-and-security-combine-similarity-with-incident-distribution" class="common-anchor-header">Journaux et sécurité : combiner similarité et distribution des incidents</h3><p>La recherche par similarité peut trouver des événements liés à une ligne de journal suspecte. Search Aggregation peut ensuite montrer quels hôtes dominent ces candidats, l’horodatage minimum et maximum dans chaque compartiment d’hôte, ou comment les candidats se répartissent par gravité et par service.</p>
<p>Le résultat reste une vue des candidats récupérés plutôt qu’un nombre global exact d’incidents. Lorsque l’investigation nécessite des nombres exacts sur chaque événement correspondant à un filtre, l’agrégation de requêtes fournit cette seconde voie.</p>
<h3 id="Operations-and-data-exploration-calculate-instead-of-export" class="common-anchor-header">Opérations et exploration des données : calculer au lieu d’exporter</h3><p>Les tableaux de bord et outils d’administration peuvent exécuter des nombres et moyennes exacts sur des lignes filtrées, puis parcourir les entités sous-jacentes dans un ordre scalaire défini. Cela supprime de nombreux utilitaires ponctuels « exporter, calculer et trier » sans prétendre que Milvus est devenu une base de données analytique complète.</p>
<h2 id="Boundaries-what-aggregation-and-ORDER-BY-do-not-replace" class="common-anchor-header">Limites : ce que l’agrégation et <code translate="no">ORDER BY</code> ne remplacent pas<button data-href="#Boundaries-what-aggregation-and-ORDER-BY-do-not-replace" class="anchor-icon" translate="no">
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
    </button></h2><p>Ces fonctionnalités étendent le moteur de récupération ; elles ne transforment pas Milvus en système de traitement analytique en ligne (OLAP).</p>
<ul>
<li>L’agrégation de requêtes prend en charge le regroupement plus <code translate="no">count</code>, <code translate="no">sum</code>, <code translate="no">avg</code>, <code translate="no">min</code> et <code translate="no">max</code>. Elle n’ajoute pas de jointures, de fonctions de fenêtre ou de sous-requêtes complexes. Les grands travaux analytiques hors ligne restent du ressort de systèmes comme Spark, qui peuvent fonctionner avec les instantanés Milvus 3.0 et les chemins de stockage partagés.</li>
<li>Les clés de groupe de requête prennent en charge les champs entiers, <code translate="no">VARCHAR</code> et <code translate="no">TIMESTAMPTZ</code>. Les clés de compartiment de Search Aggregation prennent en outre en charge les champs booléens. Les valeurs à virgule flottante, vectorielles, JSON et de tableau ne sont pas des clés de compartiment.</li>
<li>Pour Search Aggregation, <code translate="no">count</code> accepte <code translate="no">&quot;*&quot;</code> ou une source non JSON et non dynamique ; <code translate="no">sum</code> et <code translate="no">avg</code> exigent des sources numériques ; et <code translate="no">min</code> et <code translate="no">max</code> prennent également en charge les sources chaîne et <code translate="no">TIMESTAMPTZ</code>. L’agrégation de requêtes suit les mêmes limites de types arithmétiques. Consultez le guide de l’API avant d’appliquer un agrégat à un type de champ complexe.</li>
<li>L’agrégation de requêtes peut ordonner la sortie groupée par clés de groupe, tandis que l’ordonnancement par un agrégat calculé tel que <code translate="no">count(*)</code> reste une limite actuelle. Sans ordre explicite, l’ordre des groupes n’est pas garanti.</li>
<li>Search Aggregation ne peut pas actuellement être combiné avec Hybrid Search, Grouping Search, Search Iterators, un décalage non nul ou le surlignage dans la même requête.</li>
<li>Les nombres et métriques de Search Aggregation décrivent les candidats ANN conservés, pas la collection complète ni chaque entité qui pourrait être sémantiquement pertinente.</li>
<li>La recherche <code translate="no">ORDER BY</code> modifie la présentation des candidats. Elle ne répare pas les candidats ANN manqués et ne convertit pas la récupération par similarité en une requête Top-N scalaire exacte.</li>
</ul>
<p>La manière la plus claire de choisir parmi les nouvelles primitives consiste à commencer par la question :</p>
<ul>
<li>Pour des statistiques exactes sur des lignes visibles filtrées, utilisez l’agrégation de requêtes.</li>
<li>Pour une distribution sur des candidats de récupération par similarité, utilisez Search Aggregation.</li>
<li>Pour une liste classée diversifiée, utilisez Grouping Search.</li>
<li>Pour un ordre scalaire défini, utilisez une requête ou une recherche <code translate="no">ORDER BY</code> selon le chemin qui a établi l’ensemble de résultats.</li>
</ul>
<h2 id="From-candidate-lists-to-structured-results" class="common-anchor-header">Des listes de candidats aux résultats structurés<button data-href="#From-candidate-lists-to-structured-results" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Les bases de données vectorielles ont traditionnellement optimisé une question : quelles sont les K entités les plus proches de ce vecteur ?</strong></p>
<p>Les systèmes de récupération en production posent immédiatement des questions de suivi. Quels groupes dominent le résultat ? Quels sont leurs nombres et leurs plages ? Quels exemples représentent chaque groupe ? Dans quel ordre métier l’application doit-elle présenter les lignes ou les candidats ?</p>
<p>Milvus 3.0 apporte ces opérations dans le même moteur qui possède les données, la limite de candidats ANN et les sémantiques de visibilité. L’agrégation de requêtes effectue une réduction distribuée exacte sur les lignes visibles. Search Aggregation construit une vue en compartiments sur les candidats ANN conservés. <code translate="no">ORDER BY</code> donne aux chemins de requête et de recherche un ordre scalaire côté serveur sans demander à l’application de le reconstruire page par page.</p>
<p>Le résultat n’est pas un moteur OLAP dissimulé dans une base de données vectorielle. C’est un moteur de récupération qui peut renvoyer une plus grande partie de la structure dont les applications ont réellement besoin.</p>
<h2 id="Try-aggregation-and-ORDER-BY-in-Milvus-30" class="common-anchor-header">Essayez l’agrégation et <code translate="no">ORDER BY</code> dans Milvus 3.0<button data-href="#Try-aggregation-and-ORDER-BY-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0 est disponible dès maintenant. Utilisez le <a href="https://milvus.io/docs/get-and-scalar-query.md">guide Query</a> pour l’agrégation exacte et le tri de requêtes, le <a href="https://milvus.io/docs/search-aggregation.md">guide Search Aggregation</a> pour les sémantiques et les limites des compartiments, le <a href="https://milvus.io/docs/single-vector-search.md">guide Basic Vector Search</a> pour le tri de recherche, et le <a href="https://milvus.io/docs/grouping-search.md">guide Grouping Search</a> lorsque votre objectif principal est la diversité des résultats.</p>
<p>Pour la version plus large, consultez le <a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">blog de lancement de Milvus 3.0</a>, les <a href="https://milvus.io/docs/release_notes.md">notes de version de Milvus 3.0</a> et le <a href="https://github.com/milvus-io/milvus">dépôt milvus-io/milvus</a>.</p>
<p>Si vous voulez évaluer les mêmes API sans exploiter le cluster vous-même, essayez-les sur <a href="https://cloud.zilliz.com">Zilliz Cloud</a>. La <a href="https://docs.zilliz.com/reference/python/python/Vector-query">référence de requête Zilliz Cloud</a> actuelle et la <a href="https://docs.zilliz.com/reference/python/python/Vector-search">référence de recherche</a> décrivent la disponibilité et les paramètres pour les types de clusters managés.</p>
<p>Pour discuter d’une charge de travail ou d’un cas limite avec l’équipe, rejoignez la <a href="https://discord.com/invite/8uyFbECzPX">communauté Milvus sur Discord</a> ou réservez une <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting">session Milvus Office Hours</a>.</p>
