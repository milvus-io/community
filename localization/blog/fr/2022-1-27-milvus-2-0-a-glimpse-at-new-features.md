---
id: 2022-1-27-milvus-2-0-a-glimpse-at-new-features.md
title: Milvus 2.0 - Un aperçu des nouvelles fonctionnalités
author: Yanliang Qiao
date: 2022-01-27T00:00:00.000Z
desc: Découvrez les nouvelles fonctionnalités de Milvus 2.0.
cover: assets.zilliz.com/New_features_in_Milvus_2_0_93a87a7a8a.png
tag: Engineering
---
<custom-h1>Milvus 2.0 : Un aperçu des nouvelles fonctionnalités</custom-h1><p>Une demi-année s'est écoulée depuis la première version candidate de Milvus 2.0. Aujourd'hui, nous sommes fiers d'annoncer la disponibilité générale de Milvus 2.0. Suivez-moi pas à pas pour avoir un aperçu de certaines des nouvelles fonctionnalités prises en charge par Milvus.</p>
<h2 id="Entity-deletion" class="common-anchor-header">Suppression d'entités<button data-href="#Entity-deletion" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.0 prend en charge la suppression d'entités, ce qui permet aux utilisateurs de supprimer des vecteurs sur la base des clés primaires (ID) des vecteurs. Ils n'auront plus à s'inquiéter des données expirées ou non valides. Essayons-le.</p>
<ol>
<li>Connectez-vous à Milvus, créez une nouvelle collection et insérez 300 lignes de vecteurs à 128 dimensions générés de manière aléatoire.</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, utility, Collection, DataType, FieldSchema, CollectionSchema
<span class="hljs-comment"># connect to milvus</span>
host = <span class="hljs-string">&#x27;x.x.x.x&#x27;</span>
connections.add_connection(default={<span class="hljs-string">&quot;host&quot;</span>: host, <span class="hljs-string">&quot;port&quot;</span>: <span class="hljs-number">19530</span>})
connections.connect(alias=<span class="hljs-string">&#x27;default&#x27;</span>)
<span class="hljs-comment"># create a collection with customized primary field: id_field</span>
dim = <span class="hljs-number">128</span>
id_field = FieldSchema(name=<span class="hljs-string">&quot;cus_id&quot;</span>, dtype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
age_field = FieldSchema(name=<span class="hljs-string">&quot;age&quot;</span>, dtype=DataType.INT64, description=<span class="hljs-string">&quot;age&quot;</span>)
embedding_field = FieldSchema(name=<span class="hljs-string">&quot;embedding&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=dim)
schema = CollectionSchema(fields=[id_field, age_field, embedding_field],
                          auto_id=<span class="hljs-literal">False</span>, description=<span class="hljs-string">&quot;hello MilMil&quot;</span>)
collection_name = <span class="hljs-string">&quot;hello_milmil&quot;</span>
collection = Collection(name=collection_name, schema=schema)
<span class="hljs-keyword">import</span> random
<span class="hljs-comment"># insert data with customized ids</span>
nb = <span class="hljs-number">300</span>
ids = [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(nb)]
ages = [random.randint(<span class="hljs-number">20</span>, <span class="hljs-number">40</span>) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(nb)]
embeddings = [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(dim)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(nb)]
entities = [ids, ages, embeddings]
ins_res = collection.insert(entities)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;insert entities primary keys: <span class="hljs-subst">{ins_res.primary_keys}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">insert entities primary keys: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299]
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Avant de procéder à la suppression, vérifiez que les entités que vous souhaitez supprimer existent par recherche ou par requête, et faites-le deux fois pour vous assurer que le résultat est fiable.</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># search</span>
nq = <span class="hljs-number">10</span>
search_vec = [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(dim)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(nq)]
search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">16</span>}}
limit = <span class="hljs-number">3</span>
<span class="hljs-comment"># search 2 times to verify the vector persists</span>
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2</span>):
    results = collection.search(search_vec, embedding_field.name, search_params, limit)
    ids = results[<span class="hljs-number">0</span>].ids
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;search result ids: <span class="hljs-subst">{ids}</span>&quot;</span>)
    expr = <span class="hljs-string">f&quot;cus_id in <span class="hljs-subst">{ids}</span>&quot;</span>
    <span class="hljs-comment"># query to verify the ids exist</span>
    query_res = collection.query(expr)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;query results: <span class="hljs-subst">{query_res}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">search result <span class="hljs-attr">ids</span>: [<span class="hljs-number">76</span>, <span class="hljs-number">2</span>, <span class="hljs-number">246</span>]
query <span class="hljs-attr">results</span>: [{<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">246</span>}, {<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">2</span>}, {<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">76</span>}]
search result <span class="hljs-attr">ids</span>: [<span class="hljs-number">76</span>, <span class="hljs-number">2</span>, <span class="hljs-number">246</span>]
query <span class="hljs-attr">results</span>: [{<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">246</span>}, {<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">2</span>}, {<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">76</span>}]
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>Supprimez l'entité dont le cus_id est 76, puis recherchez et interrogez cette entité.</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;trying to delete one vector: id=<span class="hljs-subst">{ids[<span class="hljs-number">0</span>]}</span>&quot;</span>)
collection.delete(expr=<span class="hljs-string">f&quot;cus_id in <span class="hljs-subst">{[ids[<span class="hljs-number">0</span>]]}</span>&quot;</span>)
results = collection.search(search_vec, embedding_field.name, search_params, limit)
ids = results[<span class="hljs-number">0</span>].ids
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;after deleted: search result ids: <span class="hljs-subst">{ids}</span>&quot;</span>)
expr = <span class="hljs-string">f&quot;cus_id in <span class="hljs-subst">{ids}</span>&quot;</span>
<span class="hljs-comment"># query to verify the id exists</span>
query_res = collection.query(expr)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;after deleted: query res: <span class="hljs-subst">{query_res}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;completed&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">trying to <span class="hljs-keyword">delete</span> one <span class="hljs-attr">vector</span>: id=<span class="hljs-number">76</span>
after <span class="hljs-attr">deleted</span>: search result <span class="hljs-attr">ids</span>: [<span class="hljs-number">76</span>, <span class="hljs-number">2</span>, <span class="hljs-number">246</span>]
after <span class="hljs-attr">deleted</span>: query <span class="hljs-attr">res</span>: [{<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">246</span>}, {<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">2</span>}, {<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">76</span>}]
completed
<button class="copy-code-btn"></button></code></pre>
<p>Pourquoi l'entité supprimée peut-elle encore être retrouvée ? Si vous avez vérifié le code source de Milvus, vous constaterez que la suppression dans Milvus est asynchrone et logique, ce qui signifie que les entités ne sont pas physiquement supprimées. Au lieu de cela, elles seront accompagnées d'une marque "supprimée" de sorte qu'aucune demande de recherche ou d'interrogation ne les récupérera. En outre, Milvus effectue par défaut des recherches sous le niveau de cohérence Bounded Staleness. Par conséquent, les entités supprimées peuvent encore être récupérées avant que les données ne soient synchronisées dans le nœud de données et le nœud d'interrogation. Essayez de rechercher ou d'interroger l'entité supprimée après quelques secondes, vous constaterez alors qu'elle ne figure plus dans les résultats.</p>
<pre><code translate="no" class="language-python">expr = <span class="hljs-string">f&quot;cus_id in <span class="hljs-subst">{[<span class="hljs-number">76</span>, <span class="hljs-number">2</span>, <span class="hljs-number">246</span>]}</span>&quot;</span>
<span class="hljs-comment"># query to verify the id exists</span>
query_res = collection.query(expr)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;after deleted: query res: <span class="hljs-subst">{query_res}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;completed&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">after <span class="hljs-attr">deleted</span>: query <span class="hljs-attr">res</span>: [{<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">246</span>}, {<span class="hljs-string">&#x27;cus_id&#x27;</span>: <span class="hljs-number">2</span>}]
completed
<button class="copy-code-btn"></button></code></pre>
<h2 id="Consistency-level" class="common-anchor-header">Niveau de cohérence<button data-href="#Consistency-level" class="anchor-icon" translate="no">
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
    </button></h2><p>L'expérience ci-dessus montre comment le niveau de cohérence influence la visibilité immédiate des données nouvellement supprimées. Les utilisateurs peuvent ajuster le niveau de cohérence de Milvus de manière flexible pour l'adapter à différents scénarios de service. Milvus 2.0 prend en charge quatre niveaux de cohérence :</p>
<ul>
<li><code translate="no">CONSISTENCY_STRONG</code>Le niveau de cohérence de Milvus 2.0 prend en charge quatre niveaux de cohérence : <code translate="no">GuaranteeTs</code> est défini comme identique à l'horodatage système le plus récent, et les nœuds de requête attendent que le temps de service passe à l'horodatage système le plus récent, puis traitent la requête de recherche ou d'interrogation.</li>
<li><code translate="no">CONSISTENCY_EVENTUALLY</code> <code translate="no">GuaranteeTs</code> Les nœuds d'interrogation attendent que le temps de service atteigne l'horodatage le plus récent du système, puis traitent la demande de recherche ou d'interrogation. Les nœuds de requête effectuent une recherche immédiate dans la vue des données existantes.</li>
<li><code translate="no">CONSISTENCY_BOUNDED</code> <code translate="no">GuaranteeTs</code> est défini comme étant relativement plus petit que l'horodatage le plus récent du système, et les nœuds d'interrogation effectuent une recherche sur une vue de données tolérable, moins mise à jour.</li>
<li><code translate="no">CONSISTENCY_SESSION</code>: Le client utilise l'horodatage de la dernière opération d'écriture comme <code translate="no">GuaranteeTs</code>, afin que chaque client puisse au moins récupérer les données qu'il a lui-même insérées.</li>
</ul>
<p>Dans la version RC précédente, Milvus adopte Strong comme cohérence par défaut. Toutefois, compte tenu du fait que la plupart des utilisateurs sont moins exigeants en matière de cohérence que de performances, Milvus modifie la cohérence par défaut en Bounded Staleness, ce qui permet d'équilibrer leurs exigences dans une plus large mesure. À l'avenir, nous optimiserons davantage la configuration des GuaranteeT, qui ne peut être réalisée que lors de la création d'une collection dans la version actuelle. Pour plus d'informations sur <code translate="no">GuaranteeTs</code>, voir l'<a href="https://github.com/milvus-io/milvus/blob/master/docs/developer_guides/how-guarantee-ts-works.md">horodatage de la garantie dans les requêtes de recherche</a>.</p>
<p>Une cohérence moindre se traduit-elle par de meilleures performances ? Vous ne trouverez jamais la réponse tant que vous n'aurez pas essayé.</p>
<ol start="4">
<li>Modifiez le code ci-dessus pour enregistrer la latence de la recherche.</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">5</span>):
    start = time.time()
    results = collection.search(search_vec, embedding_field.name, search_params, limit)
    end = time.time()
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;search latency: <span class="hljs-subst">{<span class="hljs-built_in">round</span>(end-start, <span class="hljs-number">4</span>)}</span>&quot;</span>)
    ids = results[<span class="hljs-number">0</span>].ids
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;search result ids: <span class="hljs-subst">{ids}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>Effectuez une recherche avec une échelle de données et des paramètres identiques, sauf que <code translate="no">consistency_level</code> est défini comme <code translate="no">CONSISTENCY_STRONG</code>.</li>
</ol>
<pre><code translate="no" class="language-python">collection_name = <span class="hljs-string">&quot;hello_milmil_consist_strong&quot;</span>
collection = <span class="hljs-title class_">Collection</span>(name=collection_name, schema=schema,
                        consistency_level=<span class="hljs-variable constant_">CONSISTENCY_STRONG</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">search latency: 0.3293
search latency: 0.1949
search latency: 0.1998
search latency: 0.2016
search latency: 0.198
completed
<button class="copy-code-btn"></button></code></pre>
<ol start="6">
<li>Recherche dans une collection avec <code translate="no">consistency_level</code> défini comme <code translate="no">CONSISTENCY_BOUNDED</code>.</li>
</ol>
<pre><code translate="no" class="language-python">collection_name = <span class="hljs-string">&quot;hello_milmil_consist_bounded&quot;</span>
collection = <span class="hljs-title class_">Collection</span>(name=collection_name, schema=schema,
                        consistency_level=<span class="hljs-variable constant_">CONSISTENCY_BOUNDED</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">search latency: 0.0144
search latency: 0.0104
search latency: 0.0107
search latency: 0.0104
search latency: 0.0102
completed
<button class="copy-code-btn"></button></code></pre>
<ol start="7">
<li>Il est clair que le temps de latence moyen de la recherche dans la collection <code translate="no">CONSISTENCY_BOUNDED</code> est inférieur de 200 ms à celui de la collection <code translate="no">CONSISTENCY_STRONG</code>.</li>
</ol>
<p>Les entités supprimées sont-elles immédiatement invisibles si le niveau de cohérence est défini comme Fort ? La réponse est oui. Vous pouvez toujours essayer par vous-même.</p>
<h2 id="Handoff" class="common-anchor-header">Transfert<button data-href="#Handoff" class="anchor-icon" translate="no">
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
    </button></h2><p>Lorsqu'ils travaillent avec des ensembles de données en continu, de nombreux utilisateurs ont l'habitude de construire un index et de charger la collection avant d'y insérer des données. Dans les versions précédentes de Milvus, les utilisateurs doivent charger manuellement la collection après la construction de l'index pour remplacer les données brutes par l'index, ce qui est lent et laborieux. La fonction de transfert permet à Milvus 2.0 de charger automatiquement un segment indexé pour remplacer les données en continu qui atteignent certains seuils d'indexation, ce qui améliore considérablement les performances de recherche.</p>
<ol start="8">
<li>Construire l'index et charger la collection avant d'insérer davantage d'entités.</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># index</span>
index_params = {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_SQ8&quot;</span>, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">64</span>}}
collection.create_index(field_name=embedding_field.name, index_params=index_params)
<span class="hljs-comment"># load</span>
collection.load()
<button class="copy-code-btn"></button></code></pre>
<ol start="9">
<li>Insérer 200 fois 50 000 lignes d'entités (les mêmes lots de vecteurs sont utilisés pour des raisons de commodité, mais cela n'affectera pas le résultat).</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> random
<span class="hljs-comment"># insert data with customized ids</span>
nb = <span class="hljs-number">50000</span>
ids = [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(nb)]
ages = [random.randint(<span class="hljs-number">20</span>, <span class="hljs-number">40</span>) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(nb)]
embeddings = [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(dim)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(nb)]
entities = [ids, ages, embeddings]
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">200</span>):
    ins_res = collection.insert(entities)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;insert entities primary keys: <span class="hljs-subst">{ins_res.primary_keys}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<ol start="10">
<li>Vérifiez les informations relatives au chargement des segments dans le nœud de requête pendant et après l'insertion.</li>
</ol>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># did this in another python console</span>
utility.get_query_segment_info(<span class="hljs-string">&quot;hello_milmil_handoff&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<ol start="11">
<li>Vous constaterez que tous les segments scellés chargés dans le nœud de requête sont indexés.</li>
</ol>
<pre><code translate="no">[<span class="hljs-attr">segmentID</span>: <span class="hljs-number">430640405514551298</span>
<span class="hljs-attr">collectionID</span>: <span class="hljs-number">430640403705757697</span>
<span class="hljs-attr">partitionID</span>: <span class="hljs-number">430640403705757698</span>
<span class="hljs-attr">mem_size</span>: <span class="hljs-number">394463520</span>
<span class="hljs-attr">num_rows</span>: <span class="hljs-number">747090</span>
<span class="hljs-attr">index_name</span>: <span class="hljs-string">&quot;_default_idx&quot;</span>
<span class="hljs-attr">indexID</span>: <span class="hljs-number">430640403745079297</span>
<span class="hljs-attr">nodeID</span>: <span class="hljs-number">7</span>
<span class="hljs-attr">state</span>: <span class="hljs-title class_">Sealed</span>
, <span class="hljs-attr">segmentID</span>: <span class="hljs-number">430640405514551297</span>
<span class="hljs-attr">collectionID</span>: <span class="hljs-number">430640403705757697</span>
<span class="hljs-attr">partitionID</span>: <span class="hljs-number">430640403705757698</span>
<span class="hljs-attr">mem_size</span>: <span class="hljs-number">397536480</span>
<span class="hljs-attr">num_rows</span>: <span class="hljs-number">752910</span>
<span class="hljs-attr">index_name</span>: <span class="hljs-string">&quot;_default_idx&quot;</span>
<span class="hljs-attr">indexID</span>: <span class="hljs-number">430640403745079297</span>
<span class="hljs-attr">nodeID</span>: <span class="hljs-number">7</span>
<span class="hljs-attr">state</span>: <span class="hljs-title class_">Sealed</span>
...
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-more" class="common-anchor-header">De plus, les fonctionnalités suivantes sont disponibles<button data-href="#Whats-more" class="anchor-icon" translate="no">
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
    </button></h2><p>Outre les fonctionnalités ci-dessus, de nouvelles fonctionnalités telles que le compactage des données, l'équilibrage dynamique des charges, etc. sont introduites dans Milvus 2.0. Nous vous souhaitons un bon voyage exploratoire avec Milvus !</p>
<p>Dans un avenir proche, nous partagerons avec vous une série de blogs présentant la conception des nouvelles fonctionnalités de Milvus 2.0.</p>
<ul>
<li><a href="https://milvus.io/blog/2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md">Suppression</a></li>
<li><a href="https://milvus.io/blog/2022-2-21-compact.md">Compaction des données</a></li>
<li><a href="https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md">Équilibre dynamique des charges</a></li>
<li><a href="https://milvus.io/blog/2022-2-14-bitset.md">Bitset</a></li>
</ul>
<p>Retrouvez-nous sur :</p>
<ul>
<li><a href="https://github.com/milvus-io/milvus">GitHub</a></li>
<li><a href="https://milvus.io/">Milvus.io</a></li>
<li><a href="https://slack.milvus.io/">Canal Slack</a></li>
</ul>
