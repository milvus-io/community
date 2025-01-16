---
id: 2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md
title: Utilisation
author: Lichen Wang
date: 2022-02-07T00:00:00.000Z
desc: >-
  La conception cardinale de la fonction de suppression dans Milvus 2.0, la base
  de données vectorielles la plus avancée au monde.
cover: assets.zilliz.com/Delete_9f40bbfa94.png
tag: Engineering
---
<custom-h1>Comment Milvus supprime les données en continu dans un cluster distribué</custom-h1><p>Doté d'un traitement unifié par lots et en continu et d'une architecture cloud-native, Milvus 2.0 représente un défi plus important que son prédécesseur lors du développement de la fonction DELETE. Grâce à sa conception avancée de désagrégation du stockage et du calcul et au mécanisme flexible de publication/abonnement, nous sommes fiers d'annoncer que nous y sommes parvenus. Dans Milvus 2.0, vous pouvez supprimer une entité dans une collection donnée avec sa clé primaire afin que l'entité supprimée ne soit plus répertoriée dans le résultat d'une recherche ou d'une requête.</p>
<p>Veuillez noter que l'opération DELETE dans Milvus se réfère à la suppression logique, alors que le nettoyage physique des données a lieu pendant le compactage des données. La suppression logique permet non seulement d'améliorer considérablement les performances de recherche limitées par la vitesse d'E/S, mais aussi de faciliter la récupération des données. Les données supprimées logiquement peuvent toujours être récupérées à l'aide de la fonction Time Travel.</p>
<h2 id="Usage" class="common-anchor-header">Utilisation<button data-href="#Usage" class="anchor-icon" translate="no">
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
    </button></h2><p>Essayons d'abord la fonction DELETE dans Milvus 2.0. (L'exemple suivant utilise PyMilvus 2.0.0 sur Milvus 2.0.0).</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, utility, Collection, DataType, FieldSchema, CollectionSchema
<span class="hljs-comment"># Connect to Milvus</span>
connections.connect(
    alias=<span class="hljs-string">&quot;default&quot;</span>, 
    host=<span class="hljs-string">&#x27;x.x.x.x&#x27;</span>, 
    port=<span class="hljs-string">&#x27;19530&#x27;</span>
)
<span class="hljs-comment"># Create a collection with Strong Consistency level</span>
pk_field = FieldSchema(
    name=<span class="hljs-string">&quot;id&quot;</span>, 
    dtype=DataType.INT64, 
    is_primary=<span class="hljs-literal">True</span>, 
)
vector_field = FieldSchema(
    name=<span class="hljs-string">&quot;vector&quot;</span>, 
    dtype=DataType.FLOAT_VECTOR, 
    dim=<span class="hljs-number">2</span>
)
schema = CollectionSchema(
    fields=[pk_field, vector_field], 
    description=<span class="hljs-string">&quot;Test delete&quot;</span>
)
collection_name = <span class="hljs-string">&quot;test_delete&quot;</span>
collection = Collection(
    name=collection_name, 
    schema=schema, 
    using=<span class="hljs-string">&#x27;default&#x27;</span>, 
    shards_num=<span class="hljs-number">2</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
<span class="hljs-comment"># Insert randomly generated vectors</span>
<span class="hljs-keyword">import</span> random
data = [
    [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">100</span>)],
    [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">100</span>)],
]
collection.insert(data)
<span class="hljs-comment"># Query to make sure the entities to delete exist</span>
collection.load()
expr = <span class="hljs-string">&quot;id in [2,4,6,8,10]&quot;</span>
pre_del_res = collection.query(
    expr,
    output_fields = [<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>]
)
<span class="hljs-built_in">print</span>(pre_del_res)
<span class="hljs-comment"># Delete the entities with the previous expression</span>
collection.delete(expr)
<span class="hljs-comment"># Query again to check if the deleted entities exist</span>
post_del_res = collection.query(
    expr,
    output_fields = [<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>]
)
<span class="hljs-built_in">print</span>(post_del_res)
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>Dans une instance Milvus, un nœud de données est principalement responsable de l'empaquetage des données en continu (journaux dans le courtier de journaux) en tant que données historiques (instantanés de journaux) et de leur vidage automatique vers le stockage d'objets. Un nœud d'interrogation exécute les demandes de recherche sur des données complètes, c'est-à-dire à la fois des données en continu et des données historiques.</p>
<p>Pour tirer le meilleur parti de la capacité d'écriture de données des nœuds parallèles d'une grappe, Milvus adopte une stratégie de partage basée sur le hachage de clés primaires afin de répartir uniformément les opérations d'écriture entre les différents nœuds de travail. En d'autres termes, le proxy achemine les messages DML (Data Manipulation Language) (c'est-à-dire les demandes) d'une entité vers le même nœud de données et le même nœud d'interrogation. Ces messages sont publiés via le canal DML et consommés par le nœud de données et le nœud d'interrogation séparément afin de fournir des services de recherche et d'interrogation ensemble.</p>
<h3 id="Data-node" class="common-anchor-header">Nœud de données</h3><p>Après avoir reçu les messages INSERT de données, le nœud de données insère les données dans un segment croissant, qui est un nouveau segment créé pour recevoir des données en continu dans la mémoire. Si le nombre de lignes de données ou la durée du segment croissant atteint le seuil, le nœud de données le scelle pour empêcher toute entrée de données. Le nœud de données évacue ensuite le segment scellé, qui contient les données historiques, vers le stockage d'objets. Pendant ce temps, le nœud de données génère un filtre bloom basé sur les clés primaires des nouvelles données, et l'envoie dans le stockage d'objets avec le segment scellé, en sauvegardant le filtre bloom dans le journal binaire des statistiques (binlog), qui contient les informations statistiques du segment.</p>
<blockquote>
<p>Un filtre de Bloom est une structure de données probabiliste composée d'un long vecteur binaire et d'une série de fonctions de mappage aléatoires. Il peut être utilisé pour tester si un élément est membre d'un ensemble, mais peut renvoyer des résultats faussement positifs.           -- Wikipedia</p>
</blockquote>
<p>Lorsque des messages de suppression de données arrivent, le nœud de données met en mémoire tampon tous les filtres Bloom dans le shard correspondant, et les fait correspondre aux clés primaires fournies dans les messages pour récupérer tous les segments (à la fois les segments en croissance et les segments scellés) qui pourraient inclure les entités à supprimer. Après avoir repéré les segments correspondants, le nœud de données les met en mémoire tampon pour générer les binlogs Delta afin d'enregistrer les opérations de suppression, puis renvoie ces binlogs ainsi que les segments vers le stockage d'objets.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_node_2397ad70c3.png" alt="Data Node" class="doc-image" id="data-node" />
   </span> <span class="img-wrapper"> <span>Nœud de données</span> </span></p>
<p>Étant donné qu'un canal DML n'est attribué qu'à un seul shard, les nœuds de requête supplémentaires ajoutés au cluster ne pourront pas s'abonner au canal DML. Pour s'assurer que tous les nœuds de requête peuvent recevoir les messages DELETE, les nœuds de données filtrent les messages DELETE du canal DML et les transmettent au canal Delta pour notifier les opérations de suppression à tous les nœuds de requête.</p>
<h3 id="Query-node" class="common-anchor-header">Nœud de requête</h3><p>Lors du chargement d'une collection à partir du stockage d'objets, le nœud d'interrogation obtient d'abord le point de contrôle de chaque tesson, qui marque les opérations DML depuis la dernière opération de vidage. Sur la base du point de contrôle, le nœud d'interrogation charge tous les segments scellés avec leur binlog Delta et leurs filtres Bloom. Une fois toutes les données chargées, le nœud de requête s'abonne à DML-Channel, Delta-Channel et Query-Channel.</p>
<p>Si d'autres messages INSERT de données arrivent après le chargement de la collection en mémoire, le nœud d'interrogation identifie d'abord les segments croissants en fonction des messages et met à jour les filtres de floraison correspondants en mémoire à des fins d'interrogation uniquement. Ces filtres de floraison dédiés à la requête ne seront pas évacués vers le stockage d'objets une fois la requête terminée.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_node_a78b1d664f.png" alt="Query Node" class="doc-image" id="query-node" />
   </span> <span class="img-wrapper"> <span>Nœud de requête</span> </span></p>
<p>Comme indiqué ci-dessus, seul un certain nombre de nœuds de requête peuvent recevoir des messages DELETE du canal DML, ce qui signifie qu'ils sont les seuls à pouvoir exécuter les requêtes DELETE dans des segments croissants. Les nœuds de requête qui se sont abonnés au canal DML filtrent d'abord les messages DELETE dans les segments croissants, localisent les entités en faisant correspondre les clés primaires fournies avec les filtres de Bloom des segments croissants dédiés aux requêtes, puis enregistrent les opérations de suppression dans les segments correspondants.</p>
<p>Les nœuds de requête qui ne peuvent pas s'abonner au canal DML sont uniquement autorisés à traiter des demandes de recherche ou de requête sur des segments scellés, car ils ne peuvent s'abonner qu'au canal Delta et recevoir les messages DELETE transmis par les nœuds de données. Après avoir collecté tous les messages DELETE dans les segments scellés du canal Delta, les nœuds de requête localisent les entités en faisant correspondre les clés primaires fournies avec les filtres Bloom des segments scellés, puis enregistrent les opérations de suppression dans les segments correspondants.</p>
<p>Enfin, lors d'une recherche ou d'une interrogation, les nœuds d'interrogation génèrent un jeu de bits basé sur les enregistrements de suppression afin d'omettre les entités supprimées et de rechercher parmi les entités restantes de tous les segments, quel que soit l'état du segment. Enfin, le niveau de cohérence influe sur la visibilité des données supprimées. Avec un niveau de cohérence fort (comme le montre l'exemple de code précédent), les entités supprimées sont immédiatement invisibles après la suppression. Si le niveau de cohérence limité est adopté, il y aura plusieurs secondes de latence avant que les entités supprimées ne deviennent invisibles.</p>
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
    </button></h2><p>Dans la série de blogs sur les nouvelles fonctionnalités de la version 2.0, nous nous efforcerons d'expliquer la conception des nouvelles fonctionnalités. En savoir plus sur cette série de blogs !</p>
<ul>
<li><a href="https://milvus.io/blog/2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md">Comment Milvus supprime les données en continu dans un cluster distribué</a></li>
<li><a href="https://milvus.io/blog/2022-2-21-compact.md">Comment compacter les données dans Milvus ?</a></li>
<li><a href="https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md">Comment Milvus équilibre la charge des requêtes entre les nœuds ?</a></li>
<li><a href="https://milvus.io/blog/2022-2-14-bitset.md">Comment Bitset permet la polyvalence de la recherche par similarité vectorielle</a></li>
</ul>
