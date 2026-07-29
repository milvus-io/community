---
id: >-
  announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md
title: >-
  Annonce de Milvus 3.0 : recherche vectorielle native du lac et moteur de
  récupération plus puissant
author: Fendy Feng and Li Liu
date: 2026-7-27
cover: assets.zilliz.com/cover_of_milvus_3_0_6fab4ba929.jpg
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus 3.0, lake-native vector search, vector database, External Collections,
  AI retrieval engine
meta_title: |
  Milvus 3.0: Lake-Native Vector Search & Retrieval Engine
desc: >-
  Découvrez la recherche vectorielle native pour les lacs de données de Milvus
  3.0, les collections externes sans copie, la récupération sparse plus rapide,
  les instantanés, l’intégration Spark et les capacités de classement avancées.
origin: >-
  https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md
---
<p>Aujourd’hui, nous publions Milvus 3.0, une étape architecturale majeure pour le projet. Cette version change à la fois l’endroit où Milvus peut construire et servir des index, et la quantité de travail de récupération qui peut être effectuée directement dans le moteur.</p>
<ul>
<li>Milvus 3.0 introduit <strong>une voie lake-native</strong> pour indexer les données vectorielles qui résident dans le stockage objet et des formats de tables ouverts, notamment Parquet, Lance, Iceberg et Vortex. Les équipes peuvent rendre les données résidant dans le lac interrogeables sans maintenir une autre copie dans une base de données vectorielle.</li>
<li><strong>Cette version étend également Milvus au-delà de la récupération initiale de candidats.</strong> Le tri côté serveur, l’agrégation, la recherche à facettes, StructArray pour la structure imbriquée doc/chunk et les vecteurs ColBERT, ainsi qu’un index sparse repensé déplacent davantage de classement, de regroupement et de traitement des résultats hors du code applicatif et dans le moteur de récupération.</li>
</ul>
<p>Ensemble, ces avancées font de Milvus la fondation open source pour la récupération IA en production et pour les architectures <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Vector Lakebase</a> qui combinent stockage lake-native et récupération vectorielle haute performance.</p>
<iframe width="560" height="315" src="https://www.youtube.com/embed/SAm4YfrO1ok?si=xzgw5RjRTwaHWYxO" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="A-quick-glance-at-the-Milvus-30-feature-set" class="common-anchor-header">Un aperçu rapide de l’ensemble des fonctionnalités de Milvus 3.0<button data-href="#A-quick-glance-at-the-Milvus-30-feature-set" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th><strong>Domaine</strong></th><th><strong>Fonctionnalités</strong></th><th><strong>Pourquoi c’est important</strong></th></tr>
</thead>
<tbody>
<tr><td>Récupération lake-native</td><td>External Collections sur Parquet, Lance, Iceberg et Vortex</td><td>Rechercher des données résidant dans le lac sans maintenir une deuxième copie de service</td></tr>
<tr><td>Stockage basé sur S3</td><td>Loon (Storage v3)</td><td>Réduire l’amplification des lectures ponctuelles pour les accès de type service et prendre en charge l’évolution du schéma</td></tr>
<tr><td>Workflows hors ligne/batch et reprise</td><td>Snapshots, Spark DataSource V2 et évolution de schéma en ligne</td><td>Apporter des vues de collection stables dans les pipelines d’évaluation, de déduplication, de clustering et de features</td></tr>
<tr><td>Moteur de récupération</td><td>ORDER BY, agrégation, facettes, StructArray et récupération sparse améliorée</td><td>Déplacer davantage de traitement des résultats et de scoring multi-vecteur dans Milvus</td></tr>
<tr><td>Modèle de données &amp; opérations</td><td>Vecteurs nullables, TEXT LOB, TTL, MinHash, Woodpecker et ForceMerge</td><td>Prendre en charge des modèles de données plus riches et des modes opératoires de production</td></tr>
</tbody>
</table>
<h2 id="The-lake-native-infrastructure-index-and-serve-data-where-it-already-lives" class="common-anchor-header">L’infrastructure lake-native : indexer et servir les données là où elles résident déjà<button data-href="#The-lake-native-infrastructure-index-and-serve-data-where-it-already-lives" class="anchor-icon" translate="no">
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
    </button></h2><p>Le plus grand changement architectural de Milvus 3.0 concerne l’endroit où le système peut construire et servir des index. Les données vectorielles peuvent rester dans des formats ouverts sur le stockage objet tandis que Milvus fournit une indexation, une récupération et des API de niveau production.</p>
<h3 id="1-External-Collections-indexing-directly-on-lake-resident-data" class="common-anchor-header">1. External Collections : indexation directement sur les données résidant dans le lac</h3><p>De nombreuses équipes stockent déjà des embeddings dans un data lake — tables Lance, tables Iceberg, fichiers Parquet ou autres jeux de données en format ouvert sur S3, GCS ou Azure Blob Storage. Avant Milvus 3.0, il existait généralement deux options pour rechercher dans ces données.</p>
<ul>
<li>Copier les embeddings dans une base de données vectorielle. Cela fournit une recherche à faible latence, mais crée une deuxième copie et un pipeline ETL qui doit rester synchronisé.</li>
<li>Interroger directement le lac. Cela évite la duplication, mais sans index ANN, la recherche vectorielle devient un scan brute force qui ne peut pas répondre aux exigences de latence en production.</li>
</ul>
<p><strong>External Collections introduit une troisième voie.</strong> Vous définissez une collection Milvus sur des données qui restent dans le stockage objet, mappez les champs externes vers un schéma Milvus et utilisez les mêmes API de recherche et de requête qu’avec une collection native. Les fichiers sources ne sont pas déplacés ; Milvus construit et sert des index vectoriels, inversés BM25, JSON et scalaires sur les données externes.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_1_c1fb7ab16e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Les External Collections sont en lecture seule et zero-copy</strong>, ce qui les rend utiles lorsque la gouvernance, les frontières de propriété ou le coût d’exploitation exigent que le jeu de données source reste dans le lac.</p>
<p>Lorsque le jeu de données externe change, Milvus lit son manifeste de stockage et indexe les fragments nouvellement ajoutés au lieu de reconstruire toute la collection. Un mode de chargement au niveau de la collection permet également aux équipes de choisir la quantité de données à conserver localement :</p>
<table>
<thead>
<tr><th><strong>Mode de chargement</strong></th><th><strong>Comportement</strong></th><th><strong>Idéal pour</strong></th></tr>
</thead>
<tbody>
<tr><td>Take</td><td>Lire depuis le stockage objet à chaque requête</td><td>Coût de stockage le plus faible ; charges de travail moins sensibles à la latence</td></tr>
<tr><td>LazyLoad</td><td>Mettre les données en cache au premier accès</td><td>Charges de travail mixtes où les données chaudes émergent avec le temps</td></tr>
<tr><td>Load</td><td>Garder les données résidentes</td><td>Service à la latence la plus faible</td></tr>
</tbody>
</table>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># register a lake table as a zero-copy Collection</span>
client.create_collection(
  name=<span class="hljs-string">&quot;docs&quot;</span>,
  external_source={<span class="hljs-string">&quot;format&quot;</span>: <span class="hljs-string">&quot;iceberg&quot;</span>,  <span class="hljs-comment"># iceberg|lance|parquet|vortex</span>
                   <span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;s3://lake/docs&quot;</span>},
  schema=[
    Field(<span class="hljs-string">&quot;id&quot;</span>,  INT64, primary=<span class="hljs-literal">True</span>, external_field=<span class="hljs-string">&quot;doc_id&quot;</span>),
    Field(<span class="hljs-string">&quot;emb&quot;</span>, FLOAT_VECTOR, dim=<span class="hljs-number">1024</span>, external_field=<span class="hljs-string">&quot;embedding&quot;</span>),
    Field(<span class="hljs-string">&quot;title&quot;</span>, VARCHAR, external_field=<span class="hljs-string">&quot;title&quot;</span>)])

client.create_index(<span class="hljs-string">&quot;docs&quot;</span>, <span class="hljs-string">&quot;emb&quot;</span>, {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;HNSW&quot;</span>})  <span class="hljs-comment"># in place</span>
client.load(<span class="hljs-string">&quot;docs&quot;</span>, mode=<span class="hljs-string">&quot;lazy&quot;</span>)  <span class="hljs-comment"># Take | LazyLoad | Load</span>
<button class="copy-code-btn"></button></code></pre>
<p>Pour les environnements gouvernés, la récupération peut s’exécuter là où les données sont autorisées à résider. Pour les grands systèmes d’IA, un jeu de données résidant dans le lac peut prendre en charge plusieurs déploiements de récupération sans tâche de migration entre eux.</p>
<p>Les collections externes sont une capacité additive. Les collections Milvus natives restent la voie principale pour le service à faible latence et à forte intensité d’écriture, tandis que les External Collections sont conçues pour les jeux de données dont le système d’enregistrement reste en dehors de Milvus.</p>
<p>Pour plus de détails, consultez <a href="https://milvus.io/docs/create-an-external-collection.md">Create an External Collection</a>.</p>
<h3 id="2-Loon-Storage-v3-Efficient-Point-Reads-for-Lake-Native-Retrieval" class="common-anchor-header">2. Loon (Storage v3) : lectures ponctuelles efficaces pour la récupération lake-native</h3><p>Les External Collections soulèvent une question évidente : le stockage objet est conçu pour l’échelle et la durabilité, mais peut-il prendre en charge les lectures ponctuelles étroites qui suivent une recherche ANN ?</p>
<p><strong>Le défi est l’amplification des lectures.</strong> La recherche vectorielle s’exécute couramment en deux étapes : un index ANN renvoie des ID candidats, puis le système récupère des champs sélectionnés pour ces candidats. Les formats optimisés pour les scans analytiques peuvent transformer une recherche logique étroite en une lecture physique beaucoup plus importante.</p>
<p><strong>Milvus 3.0 résout ce problème avec Loon, également connu sous le nom de Storage v3, un moteur de stockage colonnaire basé sur des manifestes pour le stockage objet compatible S3.</strong> Loon organise les champs en <code translate="no">ColumnGroups</code> avec des ID de lignes alignés, permettant aux champs scalaires de privilégier le filtrage et les scans, tandis que les vecteurs et les champs fortement sollicités par des lectures ponctuelles utilisent des layouts conçus pour des recherches plus étroites.</p>
<p>Loon conserve les index vectoriels et inversés séparés du format de fichier plutôt que de les y intégrer. Chaque version de jeu de données est décrite par un manifeste immuable qui enregistre ses <code translate="no">ColumnGroups</code>, ce qui permet au même moteur d’indexation de fonctionner avec Lance, Parquet, Iceberg et Vortex.</p>
<p>La conception par manifeste rend également l’évolution du schéma moins perturbatrice. Ajouter ou supprimer un champ peut mettre à jour les métadonnées sans réécrire les colonnes existantes. Le remplissage d’un nouveau champ écrit un nouveau <code translate="no">ColumnGroup</code> tout en laissant les <code translate="no">ColumnGroups</code> existants inchangés.</p>
<p><a href="https://github.com/vortex-data/vortex"><strong>Vortex</strong></a> est le format par défaut pour cette voie. Il s’agit d’un format colonnaire ouvert compatible Arrow, avec des layouts flexibles et des encodages imbriqués qui correspondent mieux aux données IA fortement orientées requêtes ponctuelles. Dans un benchmark interne utilisant 3 millions de lignes, des vecteurs de 128 dimensions, S3 et 256 lecteurs concurrents, les E/S mesurées par lecture ponctuelle sont passées d’environ 9,4 Mo pour la référence Parquet à 0,07 Mo pour Vortex avec Loon, soit environ 135 fois moins.</p>
<p>Milvus 3.0 ne fait pas se comporter le stockage objet comme de la mémoire locale. Il réduit l’amplification des lectures qui rendrait autrement le stockage objet impraticable pour les recherches ponctuelles de type service. Le predicate pushdown dans le format et une variante locale de Vortex figurent ensuite sur la feuille de route.</p>
<p><em>Pour plus de détails, consultez notre blog :</em> <a href="https://milvus.io/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md"><em>Why We Built Loon</em></a> <em>et le</em> <a href="https://github.com/vortex-data/vortex"><em>projet Vortex</em></a><em>.</em></p>
<h3 id="3-Snapshots-point-in-time-view-without-data-copy" class="common-anchor-header">3. Snapshots : vue à un instant donné sans copie de données</h3><p>Les tâches hors ligne ont besoin d’une vue cohérente des données même lorsque les collections de production continuent de recevoir des écritures. Un snapshot Milvus est une vue en lecture seule à un instant donné qui enregistre des références aux fichiers de données, d’index et de métadonnées existants au lieu de copier l’intégralité du jeu de données.</p>
<p>Cela rend les snapshots suffisamment peu coûteux pour être créés avant des opérations risquées telles qu’un changement de modèle, une tâche de ré-embedding ou une migration de schéma. La restauration d’un snapshot peut réutiliser les fichiers de données et d’index existants via une copie côté serveur dans le stockage objet, plutôt que de réimporter chaque ligne et de reconstruire chaque index. Cette fonctionnalité est particulièrement utile pour les charges de travail à évolution rapide comme les agents IA, où les données changent constamment, et où l’on souhaite des points de récupération fréquents et peu coûteux plutôt que des sauvegardes lourdes occasionnelles.</p>
<p>La même vue figée peut prendre en charge l’évaluation, la déduplication, la validation de backfill et les tests isolés pendant que la collection active continue d’accepter les écritures. Le snapshot stabilise l’entrée logique, bien que les charges de travail puissent toujours partager une infrastructure telle que le stockage objet et la bande passante réseau.</p>
<p>Les snapshots ne remplacent pas les sauvegardes. Un snapshot référence des fichiers appartenant à la collection active et convient le mieux à la récupération logique, au clonage et aux vues stables de courte durée. Une sauvegarde crée une copie indépendante pour la conservation à long terme et la reprise après sinistre.</p>
<p>Pour plus d’informations, consultez <a href="https://milvus.io/docs/snapshots.md">Snapshots</a>, <a href="https://milvus.io/docs/manage-snapshots.md">Manage Snapshots</a> et <a href="https://milvus.io/docs/snapshot-use-cases.md">Snapshot Use Cases</a>.</p>
<h3 id="4-Spark-connector-connect-Milvus-to-batch-workflows" class="common-anchor-header">4. Connecteur Spark : connecter Milvus aux workflows batch</h3><p>Un snapshot stable n’est utile que si les moteurs batch peuvent le lire. Milvus 3.0 expose Milvus en tant que Spark DataSource V2, permettant aux tâches Spark, Databricks et EMR de lire depuis Milvus et d’écrire dans Milvus dans le cadre de pipelines batch standard.</p>
<p>Cette fonctionnalité est importante, car les workflows de données IA sont itératifs : la déduplication alimente le ré-embedding, le clustering alimente l’évaluation, et l’évaluation produit des ensembles organisés pour l’entraînement ou le service. Un snapshot stable fournit à ces tâches une entrée cohérente, tandis que la collection active continue de servir. Avec le connecteur Spark, le récepteur d’une tâche devient la source de la suivante, sans exporter une collection complète hors de Milvus à chaque fois.</p>
<p>Milvus 3.0 introduit également des opérateurs batch vector-native pour des tâches telles que la déduplication, la détection d’anomalies et le clustering, en gardant le travail gourmand en calcul hors du chemin de requête en ligne tout en opérant directement sur les données vectorielles.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_3_cd37cad0c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="5-Online-schema-changes-and-backfill" class="common-anchor-header">5. Changements de schéma en ligne et backfill</h3><p>Un schéma reste rarement statique en production — les équipes ajoutent au fil du temps de nouveaux modèles d’embeddings, des vecteurs sparse, des labels, des champs de métadonnées et des politiques de rétention. Milvus 3.0 leur permet d’ajouter, de remplir et de supprimer des colonnes pendant que le service continue, au lieu des reconstructions perturbatrices que cela nécessitait auparavant.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_4_51c9b4e2c1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ajouter ou supprimer une colonne ne nécessite pas de réécrire les données existantes. <code translate="no">client.add_collection_field(...)</code> ajoute une nouvelle colonne nullable sans mettre la collection hors ligne, et <code translate="no">client.drop_collection_field(...)</code> supprime à l’exécution un champ obsolète ou expérimental. Ni l’un ni l’autre ne réécrit les données existantes — chacun constitue une modification du manifeste de la collection plutôt que des fichiers de données, c’est pourquoi il n’y a pas de reconstruction.</p>
<p>Milvus 3.0 prend en charge deux voies de backfill :</p>
<ul>
<li><strong>Inner backfill</strong> (dans 3.0) concerne les valeurs dérivées de champs existants. Milvus peut générer un vecteur sparse BM25 à partir d’une colonne de texte dans le noyau, éliminant le besoin d’un encodeur côté client lors de la construction d’une récupération hybride dense-plus-sparse.</li>
<li><strong>External backfill</strong>(sur la feuille de route) concernera les valeurs calculées en dehors de Milvus : prendre un snapshot, exécuter Spark sur la vue cohérente, calculer une nouvelle colonne, réécrire les valeurs et laisser Milvus mettre à jour l’index de manière incrémentale. C’est la voie prévue pour les grands travaux de ré-embedding — par exemple, ajouter une nouvelle colonne d’embedding sur des centaines de millions de lignes pendant que les écritures continuent.</li>
</ul>
<p>Ensemble, les changements de schéma en ligne et le backfill facilitent l’évolution des pipelines de récupération sans reconstruire une collection entière à chaque fois que le modèle de données change.</p>
<h2 id="A-More-Powerful-Engine-for-End-to-End-Retrieval" class="common-anchor-header">Un moteur plus puissant pour la récupération de bout en bout<button data-href="#A-More-Powerful-Engine-for-End-to-End-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus prend depuis longtemps en charge davantage que la recherche ANN dense, notamment la récupération sparse basée sur BM25 et la recherche hybride. Milvus 3.0 étend le moteur selon un autre axe : il apporte davantage du pipeline de récupération multi-étapes dans Milvus lui-même, réduisant le sur-échantillonnage, la logique applicative dupliquée et la dépendance à des services de post-traitement séparés.</p>
<h3 id="1-Server-side-ORDER-BY-sort-inside-the-engine-per-segment" class="common-anchor-header">1. ORDER BY côté serveur : trier dans le moteur, par segment</h3><p>Auparavant, le tri obligeait les applications à sur-récupérer des candidats, à les transférer vers le client et à les y trier. Cela consommait de la bande passante et rendait le résultat final dépendant de l’endroit où la troncature côté client avait lieu.</p>
<p><strong>Milvus 3.0 ajoute ORDER BY côté serveur</strong>, ce qui permet aux charges de travail de requête de trier les lignes filtrées selon des champs scalaires tels que la note, le prix, la fraîcheur, l’inventaire ou l’horodatage.</p>
<ul>
<li>Sur le chemin de requête, chaque segment trie son jeu de résultats filtré, les nœuds de requête fusionnent ces flux, et le proxy renvoie la tranche demandée.</li>
<li>Sur le chemin de recherche, ORDER BY trie l’ensemble des candidats ANN dans Milvus, réduisant le sur-échantillonnage côté client et le post-traitement dupliqué. Il ne modifie pas la frontière de rappel établie par les candidats ANN.</li>
</ul>
<pre><code translate="no" class="language-sql">client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;category == &#x27;shoes&#x27;&quot;</span>,
    output_fields=[<span class="hljs-string">&quot;price&quot;</span>, <span class="hljs-string">&quot;rating&quot;</span>],
    limit=<span class="hljs-number">10</span>,
    order_by=[<span class="hljs-string">&quot;rating:desc&quot;</span>, <span class="hljs-string">&quot;price:asc&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>C’est particulièrement utile pour les recherches qui combinent pertinence et contraintes métier ou orientées utilisateur telles que la note, le prix, la fraîcheur, l’inventaire ou l’horodatage.</p>
<p>Pour plus d’informations, consultez <a href="https://milvus.io/docs/single-vector-search.md#Sort-Search-Results-by-Scalar-Fields--Milvus-30x">Sort Search Results by Scalar Fields</a> et <a href="https://milvus.io/docs/get-and-scalar-query.md#Sort-Query-Results--Milvus-30x">Sort Query Results</a>.</p>
<h3 id="2-Aggregation-and-faceted-search" class="common-anchor-header">2. Agrégation et recherche à facettes</h3><p>Milvus 3.0 ajoute l’agrégation côté requête avec des opérations telles que count, sum, average, minimum et maximum, regroupées par un ou plusieurs champs scalaires. Cela supprime un schéma courant où les équipes extraient des lignes filtrées dans le code client uniquement pour compter, regrouper ou calculer des statistiques simples.</p>
<pre><code translate="no" class="language-sql">client.query(
    collection_name=<span class="hljs-string">&quot;orders&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;in_stock == true&quot;</span>,
    group_by_fields=[<span class="hljs-string">&quot;category&quot;</span>],
    output_fields=[<span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;count(*)&quot;</span>, <span class="hljs-string">&quot;avg(price)&quot;</span>, <span class="hljs-string">&quot;max(rating)&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus 3.0 ajoute également <strong>l’agrégation de recherche</strong> pour la recherche à facettes. Après une recherche ANN, Milvus regroupe les résultats récupérés par champ et renvoie les comptages de buckets, les statistiques agrégées et les échantillons top-N de hits par bucket — le modèle derrière le regroupement par marque, tranche de prix, couleur, locataire ou type de document. Une réserve : l’agrégation de recherche opère sur le jeu de résultats récupéré par ANN, et non sur toute la collection ; les comptages de facettes sont donc approximatifs. Lorsque vous avez besoin de comptages exacts, utilisez l’agrégation côté requête.</p>
<p>Pour plus d’informations, consultez <a href="https://milvus.io/docs/get-and-scalar-query.md#Aggregate-Query-Results--Milvus-30x">Aggregate Query Results</a>.</p>
<h3 id="3-StructArray-for-Nested-Vectors-and-Late-Interaction-Model" class="common-anchor-header">3. StructArray pour les vecteurs imbriqués et les modèles à interaction tardive</h3><p>De nombreuses entités sont naturellement représentées par plusieurs vecteurs. Un long document est une série de chunks ; une vidéo est une séquence d’images que l’on préférerait conserver ensemble dans une seule ligne plutôt que de les disperser sur plusieurs ; un produit possède plusieurs images ou angles. Les modèles à interaction tardive vont encore plus loin — ColBERT émet un vecteur par token, ColPali un par patch visuel. Dans tous les cas, l’unité que vous voulez réellement stocker et rechercher est l’entité entière, et non chaque fragment isolément.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_5_e15816e38b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>StructArray</strong> permet à une ligne Milvus de contenir un tableau de longueur variable d’éléments structurés, y compris plusieurs vecteurs, tout en préservant un ID d’entité unique et un ensemble unique de métadonnées. Cela évite de scinder un document en plusieurs lignes et de dupliquer les labels, autorisations ou autres champs entre fragments.</p>
<p>Milvus prend en charge deux granularités de recherche.</p>
<ul>
<li><strong>La recherche au niveau des éléments</strong> compare un vecteur de requête à chaque élément de la liste et renvoie l’élément correspondant spécifique avec son offset. C’est utile lorsque vous voulez savoir quel chunk, token, patch ou image a correspondu. Une ligne peut apparaître plusieurs fois si plusieurs éléments correspondent.</li>
<li><strong>La recherche au niveau de l’entité</strong> compare la liste complète de vecteurs d’une requête à la liste de vecteurs de la ligne à l’aide de <code translate="no">MAX_SIM</code>, avec la métrique <code translate="no">MAX_SIM_COSINE</code>. Chaque token de requête prend sa meilleure correspondance dans le document, et ces meilleurs scores sont additionnés. Cela donne à Milvus une prise en charge native des schémas de récupération à interaction tardive tels que ColBERT et ColPali, tout en conservant une ligne par document.</li>
</ul>
<p>Indexer chaque vecteur de token peut être coûteux ; Milvus 3.0 ajoute donc plusieurs voies d’accélération, notamment TokenANN, Muvera et Lemur, qui offrent différents compromis entre taille d’index, coût d’entraînement et rappel.</p>
<table>
<thead>
<tr><th>Stratégie</th><th>Représentation de première étape</th><th>Profil de coût</th><th>Idéal pour</th></tr>
</thead>
<tbody>
<tr><td>TokenANN</td><td>Chaque vecteur de token est indexé.</td><td>Le plus élevé, exact</td><td>Modèles à forte discrimination et documents courts</td></tr>
<tr><td>Muvera</td><td>Un vecteur par document utilisant FDE par projection aléatoire.</td><td>Moyen, sans entraînement</td><td>Documents longs</td></tr>
<tr><td>Lemur</td><td>Un vecteur par document utilisant une compression MLP apprise</td><td>Le plus faible, nécessite un entraînement</td><td>Modèles à faible discrimination et vecteurs visuels ou de patch</td></tr>
</tbody>
</table>
<p>Dans nos benchmarks, Lemur égale ou dépasse le rappel de TokenANN sur la plupart des jeux de données tout en réduisant chaque document à un seul vecteur ; l’exception concerne les corpus présentant une forte variance de longueur, où TokenANN ou une autre stratégie est plus sûre.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_7_8ff1ab957e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pour les corpus plus grands que la mémoire, Milvus prend également en charge un index <code translate="no">DISKANN</code> qui conserve les listes d’embeddings sur disque afin de réduire la pression sur la RAM.</p>
<p>La recherche au niveau des éléments est déjà arrivée dans Milvus 2.6. Le filtrage pour Muvera, Lemur et StructList est nouveau dans 3.0.</p>
<h3 id="4-BM25-Index-Compression-and-SINDI" class="common-anchor-header">4. Compression d’index BM25 et SINDI</h3><p>Milvus prend en charge la recherche vectorielle sparse depuis des versions précédentes. Milvus 3.0 réduit l’empreinte de l’index sparse grâce à des postings compressés par blocs (algorithmes liés à VByte plus décodage SIMD) et à la quantification (fp16 pour les produits internes, u16 pour BM25).</p>
<p>Sur un ensemble de benchmarks BM25 internes, la nouvelle implémentation était environ 3 fois plus petite que l’index sparse de Milvus 2.6 à rappel comparable. Un index plus petit réduit la pression sur la mémoire et la bande passante et peut améliorer la vitesse dans les charges de travail limitées par le mouvement des données.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_8_2e62fc9573.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 3.0 introduit également <a href="https://arxiv.org/abs/2509.08395">SINDI</a>, un nouvel algorithme de récupération sparse optimisé pour les embeddings sparse appris tels que SPLADE. Comme ces embeddings produisent des listes de postings plus denses que BM25, les algorithmes de recherche fortement basés sur l’élagage peuvent consacrer beaucoup de temps CPU à décider ce qu’il faut ignorer. SINDI organise plutôt les postings en fenêtres compactes et utilise une accumulation de scores compatible SIMD pour les traiter efficacement, tout en préservant la précision de récupération grâce à un élagage sans perte.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_9_c7de29a223.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nous avons également étendu SINDI au-delà de sa conception d’origine pour inclure la prise en charge native de BM25, permettant à Milvus d’utiliser le même chemin de récupération sparse optimisé pour les embeddings sparse appris et la recherche plein texte traditionnelle.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_10_e94a903bcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dans nos benchmarks sur 4 jeux de données de vecteurs sparse SPLADE, SINDI atteint jusqu’à environ 10 fois le QPS de MaxScore sur les vecteurs learned-sparse, avec un pire cas d’environ 5 fois.</p>
<p>SINDI est le choix par défaut pour la recherche sparse par produit interne dans Milvus 3.0.</p>
<h2 id="Other-Enhancements" class="common-anchor-header">Autres améliorations<button data-href="#Other-Enhancements" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><strong>TEXT LOB :</strong> Stocke le long texte source à côté des vecteurs. Le texte de moins de 64 Ko reste inline ; les valeurs plus grandes utilisent une référence Vortex LOB.</li>
<li><strong>Prise en charge étendue des index denses :</strong> Ajoute davantage de choix d’index au sein de la famille Faiss, notamment SVS, Panorama, PQ, IVFPQ et ScaNN, pour différentes exigences d’échelle, de mémoire et de rappel.</li>
<li><strong>MinHash et recherche de quasi-doublons :</strong> Génère des signatures MinHash côté serveur et récupère des candidats quasi-dupliqués avec MINHASH_LSH.</li>
<li><strong>Vecteurs nullables et nouveaux types :</strong> Autorise les champs vectoriels à être NULL et ajoute TIMESTAMPTZ pour le filtrage et les politiques de rétention tenant compte du temps.</li>
<li><strong>Dictionnaires plein texte personnalisés :</strong> Enregistre sur le cluster des dictionnaires, des synonymes et des ressources de stop-words pour une tokenisation multilingue et propre au domaine.</li>
<li><strong>Woodpecker autonome :</strong> Exécute le journal write-ahead de Milvus comme un service observable et redimensionnable indépendamment.</li>
<li><strong>Entité</strong> <strong>TTL**** :</strong> Expire les enregistrements individuels via un champ TIMESTAMPTZ, avec filtrage MVCC suivi d’une collecte des déchets pendant la compaction.</li>
<li><strong>ForceMerge :</strong> Compacte les petits segments jusqu’à une taille cible et reconstruit les index afin de réduire l’amplification des lectures avant un service durable fortement orienté lecture.</li>
<li>Et plus encore</li>
</ul>
<h2 id="Get-started-with-Milvus-30" class="common-anchor-header">Bien démarrer avec Milvus 3.0<button data-href="#Get-started-with-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0 est disponible dès aujourd’hui sous licence Apache 2.0 et reste un projet LF AI &amp; Data. Pour démarrer :</p>
<ul>
<li>Lisez les <a href="https://milvus.io/docs/release_notes.md">notes de version</a> et le <a href="https://milvus.io/docs/quickstart.md">quickstart</a>, et récupérez le code source sur <a href="https://github.com/milvus-io/milvus">github.com/milvus-io/milvus</a>.</li>
<li>Rejoignez la <a href="https://discord.com/invite/8uyFbECzPX">communauté Discord Milvus</a> ou réservez une session <a href="https://milvus.io/office-hours">Milvus Office Hours</a> pour discuter de votre cas d’usage avec les mainteneurs.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_11_78476298b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-30-and-Zilliz-Vector-Lakebase" class="common-anchor-header">Milvus 3.0 et Zilliz Vector Lakebase<button data-href="#Milvus-30-and-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0 pose la fondation open source de la récupération IA en production et de l’architecture émergente <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Vector Lakebase</a>, qui combine le stockage lake-native avec la récupération vectorielle haute performance sur une source de vérité unique, chacun au bon coût.</p>
<p><a href="https://zilliz.com/">Zilliz Cloud</a> est un Vector Lakebase entièrement managé, construit par l’équipe derrière Milvus. Il partage la même architecture distribuée et lake-native que Milvus et est entièrement compatible avec l’API Milvus. Propulsé par son moteur d’indexation propriétaire Cardinal, Zilliz Cloud offre jusqu’à 10× un meilleur rapport prix-performance que les approches d’indexation open source standard, tout en éliminant la complexité opérationnelle de la gestion de l’infrastructure. Les capacités d’entreprise incluent le calcul scale-to-zero, la reprise après sinistre inter-régions, le déploiement BYOC, la sécurité et la conformité de niveau entreprise (SOC 2, HIPAA, ISO 27001 et GDPR), ainsi qu’un SLA allant jusqu’à 99,99 %.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_12_08d1c21d25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Les développeurs peuvent déployer Milvus comme base de données vectorielle open source ou utiliser <a href="https://zilliz.com/">Zilliz Cloud</a> comme plateforme managée couvrant plusieurs charges de travail tout au long du cycle de vie des données IA.</p>
<h2 id="What-comes-next" class="common-anchor-header">Et maintenant ?<button data-href="#What-comes-next" class="anchor-icon" translate="no">
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
    </button></h2><p>La feuille de route de Milvus s’appuie sur l’architecture 3.0 avec le predicate pushdown pour les External Collections, l’external backfill, des opérateurs Spark supplémentaires et la prise en charge de davantage de formats de tables, notamment Delta Lake et Apache Paimon.</p>
<p>La direction générale est claire : les systèmes de données IA ont besoin d’une boucle plus étroite entre la récupération en ligne et l’amélioration des données hors ligne. Les données vectorielles ne devraient pas devoir être copiées dans des systèmes séparés chaque fois que les équipes veulent les rechercher, les analyser, les améliorer ou les servir.</p>
