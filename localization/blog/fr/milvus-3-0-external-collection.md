---
id: milvus-3-0-external-collection.md
title: >-
  Milvus Collection externe : indexer et récupérer des données résidant dans le
  lac sans les déplacer
author: Leo Liu
date: 2026-8-24
cover: assets.zilliz.com/blog_cover_external_collection_3e4d7334de.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  External Collection, Milvus 3.0, vector search on data lake, Iceberg vector
  search, Vector Lakebase
meta_title: >
  Milvus External Collection: Index and Retrieve Lake-Resident Data Without
  Moving It
desc: >-
  Milvus 3.0 a introduit la collection externe, permettant à Milvus de
  construire des index et d'assurer la recherche sur des données qui restent
  dans le lac.
origin: 'https://milvus.io/blog/milvus-3-0-external-collection.md'
---
<p>Dans de nombreux pipelines d'IA, les embeddings et les métadonnées sont déjà produits et stockés dans un lac de données. Un pipeline produit peut écrire les attributs produits et les embeddings multimodaux dans des fichiers Parquet sur S3. Un corpus de récupération ou d'entraînement peut résider dans une table Iceberg ou Lance. C'est déjà dans le lac que ces ensembles de données sont générés, mis à jour, versionnés et utilisés par le reste de la pile de données.</p>
<p>Les bases de données vectorielles, cependant, ont traditionnellement été construites autour d'une copie de service détenue par la base de données. Si les équipes souhaitaient une recherche vectorielle à faible latence sur des données déjà présentes dans un lac, elles avaient généralement deux options :</p>
<ul>
<li><strong>Copier les données dans une base de données vectorielle.</strong> Cela fournit des index ANN et un chemin de service de production, mais crée une seconde copie de l'ensemble de données et un pipeline ETL qui doit rester synchronisé avec la source.</li>
<li><strong>Interroger le lac directement.</strong> Cela évite la duplication, mais sans couche d'indexation et de service ANN, la recherche vectorielle retombe sur des balayages qui ne sont pas conçus pour la latence de production.</li>
</ul>
<p><strong>Milvus 3.0</strong> <a href="https://milvus.io/docs/create-an-external-collection.md"><strong>External Collection</strong></a> <strong>introduit une troisième voie.</strong> Les données sources restent dans Parquet, Iceberg, Lance, Vortex ou un autre format externe pris en charge, tandis que Milvus construit et sert des index sur celles-ci. Vous mappez les champs externes dans un schéma Milvus, définissez les index dont vous avez besoin, actualisez la collection et utilisez les API de recherche et d'interrogation normales de Milvus—sans avoir à copier au préalable les lignes sources dans une collection gérée par Milvus.</p>
<p>Le changement architectural est simple : les données peuvent rester dans le lac, tandis que Milvus ajoute la couche d'indexation et de récupération.</p>
<p>Cela fait également d'External Collection une étape importante vers le <a href="https://zilliz.com/blog/what-is-a-vector-lakebase"><strong>Vector Lakebase</strong></a><strong>,</strong> une architecture de données unifiée et native du lac pour l'IA qui combine un service de niveau base de données vectorielle avec un stockage ouvert dans le lac, des index réutilisables au niveau du lac et une couche sémantique partagée. La récupération en ligne n'a plus à partir d'une copie de service séparée pendant que Spark, les pipelines d'entraînement, les tâches d'évaluation et les outils de gouvernance travaillent sur une autre version des données. Ils peuvent travailler sur la même fondation de données résidant dans le lac.</p>
<h2 id="What-an-External-Collection-is-and-what-it-changes" class="common-anchor-header">Ce qu'est une External Collection et ce qu'elle change<button data-href="#What-an-External-Collection-is-and-what-it-changes" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Une External Collection</strong> est un type de collection Milvus dont les données sources résident en dehors du stockage géré par Milvus.</p>
<p>Sans External Collection, placer ce catalogue derrière une recherche vectorielle de production signifie généralement créer une autre copie dans Milvus :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_2_333b278a04.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Chaque fois que le catalogue change, que le modèle d'embedding change ou qu'un champ est rétro-rempli, un autre pipeline doit déplacer les données mises à jour à travers cette frontière.</p>
<p>Avec External Collection, l'architecture devient :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_3_71172afb44.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus ne fait <strong>pas</strong> des fichiers externes sa propre copie des données sources. Au lieu de cela, l'External Collection contient les informations dont Milvus a besoin pour les interpréter et les rechercher :</p>
<ol>
<li>Un <code translate="no">external_source</code> qui identifie les fichiers ou la table externes.</li>
<li>Un <code translate="no">external_spec</code> qui décrit le format source et l'accès au stockage.</li>
<li>Des mappages <code translate="no">external_field</code> qui connectent les champs du schéma Milvus aux colonnes de l'ensemble de données externe.</li>
<li>Les index, manifestes et l'état de service que Milvus crée pour la récupération.</li>
</ol>
<p><strong>Des données sources en zéro copie ne signifient pas un état nul dans Milvus.</strong> Milvus construit toujours des index. Il utilise toujours du calcul. Il met toujours des données en cache. Le changement est que les lignes faisant autorité n'ont plus besoin d'être copiées dans Milvus simplement parce que vous avez besoin que Milvus les recherche.</p>
<h3 id="Normal-Milvus-Collection-vs-External-Collection" class="common-anchor-header">Collection Milvus normale vs External Collection<button data-href="#Normal-Milvus-Collection-vs-External-Collection" class="anchor-icon" translate="no">
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
    </button></h3><table>
<thead>
<tr><th><strong>Aspect</strong></th><th><strong>Collection gérée par Milvus</strong></th><th><strong>External Collection</strong></th></tr>
</thead>
<tbody>
<tr><td>Enregistrements sources</td><td>Stockés et gérés par Milvus</td><td>Restent dans les fichiers ou la table externes</td></tr>
<tr><td>Comment les données entrent dans Milvus</td><td>Insertion, upsert, importation ou écriture en continu</td><td>Mappage de source externe + Refresh</td></tr>
<tr><td>Mutations en ligne</td><td>Prises en charge</td><td>Lecture seule depuis Milvus</td></tr>
<tr><td>Fraîcheur</td><td>Suit le chemin d'écriture et le modèle de cohérence de Milvus</td><td>Suit le dernier Refresh publié avec succès</td></tr>
<tr><td>État géré par Milvus</td><td>Données sources, métadonnées, index, caches</td><td>Mappages, manifestes, index, caches</td></tr>
<tr><td>Chemin d'interrogation</td><td>API de recherche et d'interrogation de Milvus</td><td>API de recherche et d'interrogation de Milvus</td></tr>
<tr><td>Meilleure adaptation</td><td>Données en ligne en évolution continue</td><td>Grandes données de lac produites par lots et à forte lecture</td></tr>
</tbody>
</table>
<p>L'External Collection complète donc les collections Milvus normales plutôt que de les remplacer.</p>
<p>Un système peut conserver un état en ligne en évolution rapide dans des collections Milvus normales tout en utilisant les External Collections pour de grands corpus, catalogues, ensembles de données historiques, caractéristiques de modèles ou d'autres données déjà produites et gouvernées dans le lac.</p>
<h2 id="Why-removing-the-second-copy-matters" class="common-anchor-header">Pourquoi la suppression de la seconde copie est importante<button data-href="#Why-removing-the-second-copy-matters" class="anchor-icon" translate="no">
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
    </button></h2><p>Il est tentant de décrire les External Collections comme une optimisation du stockage : ne copiez pas plusieurs téraoctets de données dans une autre base de données et vous économisez du stockage. C'est utile, mais ce n'est pas le principal problème architectural.</p>
<p><strong>Le coût le plus élevé vient du maintien de l'alignement de deux systèmes de données.</strong></p>
<p>Reprenons le catalogue produits. La plateforme de données produit l'ensemble de données Parquet faisant autorité. La recherche l'importe dans une base de données vectorielle. Une équipe de recommandation peut lire les mêmes données du lac via Spark pour une analyse hors ligne. Un nouveau modèle d'embedding génère ensuite une colonne vectorielle de remplacement. L'inventaire et les métadonnées continuent de changer simultanément.</p>
<p>Une fois que la copie de service en ligne devient indépendante du lac, chaque changement doit franchir cette frontière :</p>
<ul>
<li>les données doivent être copiées ;</li>
<li>le transfert doit être planifié et surveillé ;</li>
<li>les tâches échouées nécessitent de nouvelles tentatives ;</li>
<li>les schémas et les autorisations peuvent devoir être représentés dans plusieurs systèmes ;</li>
<li>la fraîcheur dépend de la rapidité avec laquelle le pipeline de synchronisation rattrape son retard ;</li>
<li>les équipes doivent savoir quelle copie représente la version qu'elles veulent réellement.</li>
</ul>
<p>Le stockage n'est qu'un poste de dépense.</p>
<table>
<thead>
<tr><th><strong>Coût</strong></th><th><strong>Lac séparé + copie de service</strong></th><th><strong>External Collection</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Copies des données sources</strong></td><td>Copie dans le lac plus une copie de service séparée</td><td>Les lignes sources restent dans le lac</td></tr>
<tr><td><strong>Mouvement des données</strong></td><td>Pipeline ETL/importation persistant</td><td>Refresh sur la source externe</td></tr>
<tr><td><strong>Fraîcheur</strong></td><td>Dépend de la cadence d'exportation/importation</td><td>Contrôlée par le moment où un nouveau Refresh est publié</td></tr>
<tr><td><strong>Gouvernance</strong></td><td>Les copies source et de service doivent rester alignées</td><td>La propriété de la source, la traçabilité et le versionnement restent avec la plateforme du lac</td></tr>
<tr><td><strong>Réutilisation hors ligne</strong></td><td>D'autres consommateurs peuvent préparer leurs propres copies</td><td>Les outils de lac existants peuvent continuer à lire la même source</td></tr>
<tr><td><strong>Ressources de service</strong></td><td>Dimensionnées autour de la copie de base de données et de la charge d'interrogation</td><td>L'indexation, le calcul d'interrogation et les caches peuvent être gérés séparément de la propriété des lignes sources</td></tr>
</tbody>
</table>
<p>La différence devient particulièrement importante à mesure que les données IA changent plus souvent.</p>
<p>Les équipes dédupliquent les corpus. Elles regroupent les données pour l'analyse. Elles génèrent de nouveaux embeddings lorsqu'un modèle change. Elles ajoutent des étiquettes, des résumés, des entités extraites, des scores de qualité ou des signaux de retour. Elles exécutent des tâches d'évaluation et des pipelines de nettoyage de données sur le même corpus que celui à partir duquel les applications de production effectuent leur récupération.</p>
<p>Si chaque système possède sa propre copie, chaque amélioration devient une autre tâche de synchronisation.</p>
<p>External Collection change cette frontière : <strong>les systèmes hors ligne peuvent continuer à travailler sur l'ensemble de données du lac, tandis que Milvus sert la récupération sur la même fondation.</strong></p>
<h2 id="What-data-sources-External-Collection-supports" class="common-anchor-header">Quelles sources de données External Collection prend en charge<button data-href="#What-data-sources-External-Collection-supports" class="anchor-icon" translate="no">
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
    </button></h2><p>External Collection est conçue autour de données ouvertes et gérées en externe plutôt que d'une disposition de source spécifique à Milvus. Elle prend en charge plusieurs formats de sources externes via <a href="https://milvus.io/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md">Storage V3</a> :</p>
<table>
<thead>
<tr><th><strong>Format externe</strong></th><th><strong>valeur de format</strong></th><th><strong>Ce que Milvus lit</strong></th></tr>
</thead>
<tbody>
<tr><td>Apache Parquet</td><td>parquet</td><td>Un répertoire ou un préfixe de stockage d'objets contenant des fichiers Parquet et des groupes de lignes</td></tr>
<tr><td>Vortex</td><td>vortex</td><td>Fichiers Vortex et leurs métadonnées de disposition</td></tr>
<tr><td>Lance</td><td>lance-table</td><td>Un ensemble de données Lance et ses métadonnées de fragments</td></tr>
<tr><td>Apache Iceberg</td><td>iceberg-table</td><td>Métadonnées Iceberg plus un instantané sélectionné</td></tr>
<tr><td>Instantané Milvus</td><td>milvus-table</td><td>Un instantané Milvus pris en charge exposé comme source externe</td></tr>
</tbody>
</table>
<p>Le mappage entre la source et Milvus est explicite.</p>
<p>Une colonne source nommée <code translate="no">product_id</code> peut devenir le champ Milvus <code translate="no">id</code> ; <code translate="no">image_vec</code> peut devenir <code translate="no">embedding</code> ; et une table source large n'a pas besoin d'exposer chaque colonne à la collection. Cela signifie que la plateforme de données n'a pas à renommer ou réécrire sa source simplement pour satisfaire la base de données de service.</p>
<p>Les formats versionnés ajoutent une autre propriété utile. Avec une source telle qu'Iceberg, la collection peut pointer vers un instantané particulier plutôt que vers ce qui se trouve être courant au moment où la requête est exécutée. Une version source fixe est utile pour l'évaluation reproductible, les tests de régression, l'analyse historique et les charges de travail d'audit.</p>
<p>Les fichiers sous-jacents restent également utilisables par le reste de la pile de données. Spark, les frameworks d'entraînement, les systèmes de gouvernance et d'autres outils compatibles avec le lac peuvent continuer à lire les mêmes données ouvertes.</p>
<p>External Collection ajoute un autre consommateur de ces données ; elle ne fait pas de Milvus son unique propriétaire.</p>
<h3 id="Accessing-external-storage-securely" class="common-anchor-header">Accéder au stockage externe en toute sécurité<button data-href="#Accessing-external-storage-securely" class="anchor-icon" translate="no">
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
    </button></h3><p>Milvus a également besoin d'autorisation pour lire le stockage externe.</p>
<p>Selon le fournisseur de stockage, les déploiements peuvent utiliser des mécanismes tels que l'identité de charge de travail ou d'instance, l'assomption de rôle AWS STS, l'emprunt d'identité de compte de service, l'accès basé sur SAS ou les systèmes de rôles spécifiques au fournisseur, plutôt que d'intégrer des identifiants de longue durée dans la configuration de l'application.</p>
<p>Cette identité de stockage contrôle la manière dont Milvus accède à la source. L'autorisation à l'intérieur de Milvus reste une frontière de sécurité distincte.</p>
<h2 id="How-to-create-index-refresh-and-query-an-external-collection" class="common-anchor-header">Comment créer, indexer, actualiser et interroger une External Collection<button data-href="#How-to-create-index-refresh-and-query-an-external-collection" class="anchor-icon" translate="no">
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
    </button></h2><p>Le cycle de vie d'une External Collection comporte quatre étapes principales :</p>
<ol>
<li>Définir la source externe et mapper ses colonnes dans un schéma Milvus.</li>
<li>Définir les index dont la charge de travail a besoin.</li>
<li>Exécuter Refresh pour que Milvus découvre les données sources et prépare une version interrogeable.</li>
<li>Charger la collection et utiliser les API de recherche et d'interrogation normales de Milvus.</li>
</ol>
<p>Voici le même catalogue produits représenté comme External Collection :</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> time

<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">DataType</span>, <span class="hljs-title class_">MilvusClient</span>

client = <span class="hljs-title class_">MilvusClient</span>(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>,
)

schema = client.<span class="hljs-title function_">create_schema</span>(
    external_source=<span class="hljs-string">&quot;s3://my-lake/datasets/products/&quot;</span>,
    external_spec=json.<span class="hljs-title function_">dumps</span>(
        {
            <span class="hljs-string">&quot;format&quot;</span>: <span class="hljs-string">&quot;parquet&quot;</span>,
            <span class="hljs-string">&quot;extfs&quot;</span>: {
                <span class="hljs-string">&quot;cloud_provider&quot;</span>: <span class="hljs-string">&quot;aws&quot;</span>,
                <span class="hljs-string">&quot;region&quot;</span>: <span class="hljs-string">&quot;us-east-1&quot;</span>,
                <span class="hljs-string">&quot;use_iam&quot;</span>: <span class="hljs-string">&quot;true&quot;</span>,
                <span class="hljs-string">&quot;iam_endpoint&quot;</span>: <span class="hljs-string">&quot;https://sts.us-east-1.amazonaws.com&quot;</span>,
            },
        }
    ),
)

schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">INT64</span>,
    external_field=<span class="hljs-string">&quot;product_id&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">FLOAT_VECTOR</span>,
    dim=<span class="hljs-number">768</span>,
    external_field=<span class="hljs-string">&quot;image_vec&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;title&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">VARCHAR</span>,
    max_length=<span class="hljs-number">256</span>,
    external_field=<span class="hljs-string">&quot;product_name&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;stock&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">INT64</span>,
    external_field=<span class="hljs-string">&quot;stock&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;rating&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">FLOAT</span>,
    external_field=<span class="hljs-string">&quot;rating&quot;</span>,
)

client.<span class="hljs-title function_">create_collection</span>(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    schema=schema,
)
<button class="copy-code-btn"></button></code></pre>
<p>Les index utilisent l'interface normale de Milvus :</p>
<pre><code translate="no" class="language-python">index_params = client.<span class="hljs-title function_">prepare_index_params</span>()
index_params.<span class="hljs-title function_">add_index</span>(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
)
index_params.<span class="hljs-title function_">add_index</span>(field_name=<span class="hljs-string">&quot;stock&quot;</span>, index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>)
index_params.<span class="hljs-title function_">add_index</span>(field_name=<span class="hljs-string">&quot;rating&quot;</span>, index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>)

client.<span class="hljs-title function_">create_index</span>(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    index_params=index_params,
)
<button class="copy-code-btn"></button></code></pre>
<p>Puis actualisez la source externe :</p>
<pre><code translate="no" class="language-python">job_id = client.refresh_external_collection(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
)

<span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
    progress = client.get_refresh_external_collection_progress(job_id=job_id)
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshCompleted&quot;</span>:
        <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshFailed&quot;</span>:
        <span class="hljs-keyword">raise</span> RuntimeError(progress.reason)
    time.sleep(<span class="hljs-number">2</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Une fois la version actualisée prête, chargez-la et recherchez-la comme une collection Milvus normale :</p>
<pre><code translate="no" class="language-python">client.load_collection(<span class="hljs-string">&quot;products_ext&quot;</span>)

results = client.search(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;stock &gt; 0 and rating &gt;= 4.0&quot;</span>,
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;stock&quot;</span>, <span class="hljs-string">&quot;rating&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>La différence importante n'est pas l'appel de recherche. C'est là où commence le cycle de vie. Une collection gérée par Milvus commence avec des données écrites ou importées dans Milvus. Une External Collection commence avec une référence à des données qui existent déjà ailleurs.</p>
<h2 id="How-Refresh-picks-up-changes-in-external-data" class="common-anchor-header">Comment Refresh détecte les changements dans les données externes<button data-href="#How-Refresh-picks-up-changes-in-external-data" class="anchor-icon" translate="no">
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
    </button></h2><p>L'External Collection est en lecture seule du côté de Milvus, mais l'ensemble de données sous-jacent dans le lac n'a pas à rester gelé pour toujours.</p>
<p>Supposons que le pipeline produit ajoute un autre lot, met à jour des métadonnées ou écrit des embeddings provenant d'un nouveau modèle. Milvus ne suit pas en continu chaque objet qui apparaît dans le chemin source. Ces changements deviennent visibles via <strong>Refresh</strong>.</p>
<p>Refresh lit les métadonnées externes, résout les fragments sources, met à jour les manifestes qui les connectent à la collection Milvus et prépare l'état d'index correspondant.</p>
<p>Le point clé est que ce travail peut être incrémental.</p>
<p>Milvus identifie les fragments sources qui n'ont pas changé et peut réutiliser leurs segments et travaux d'index existants. Les fragments nouveaux ou modifiés sont les parties qui nécessitent un nouveau traitement.</p>
<p>Un petit changement dans un ensemble de données de plusieurs téraoctets n'a donc pas à déclencher une nouvelle importation complète et une reconstruction complète des index.</p>
<p>Refresh donne également au système de service une frontière de version claire. Pendant qu'une nouvelle version est préparée, les requêtes continuent d'utiliser l'état publié précédemment. Une fois Refresh terminé, le nouvel état devient disponible en tant que version complète plutôt que d'exposer un mélange de données anciennes et partiellement préparées.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_4_46aaa22589.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ce modèle s'intègre naturellement avec les constructions de catalogue horaires, les mises à jour nocturnes de base de connaissances, les actualisations périodiques d'embeddings, les pipelines de caractéristiques générés par modèle et d'autres charges de travail orientées lots.</p>
<p>Il ne remplace <strong>pas</strong> un chemin d'écriture en continu. Si chaque insertion ou suppression doit devenir interrogeable via Milvus immédiatement, une collection gérée reste le meilleur modèle.</p>
<h2 id="How-Lazy-Loading-reduces-memory-use-for-wide-datasets" class="common-anchor-header">Comment le chargement paresseux réduit l'utilisation de la mémoire pour les ensembles de données larges<button data-href="#How-Lazy-Loading-reduces-memory-use-for-wide-datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>Le fait de conserver les lignes sources dans le stockage d'objets n'aide que si la couche de service n'a pas à charger chaque octet localement avant de pouvoir répondre aux requêtes. Avec le Tiered Storage de Milvus activé, ce n'est pas le cas.</p>
<p>Au moment du chargement de la collection, les QueryNodes peuvent initialement ne conserver que des métadonnées légères telles que les informations de schéma, les définitions d'index, les cartes de chunks et les références aux objets distants. Les données de champ sont récupérées au niveau du chunk lorsqu'une requête en a besoin ; les index peuvent rester distants jusqu'à la première utilisation, puis être mis en cache localement. Les données fréquemment utilisées restent chaudes, tandis que les données moins fréquemment accédées peuvent être évincées.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_5_145b2aa0c7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>C'est particulièrement utile pour les ensembles de données IA larges.</p>
<p>Une ligne produit peut contenir plusieurs embeddings, une longue description, du JSON brut, des métadonnées d'image, des résumés générés, l'inventaire, les prix, les évaluations et de nombreux autres attributs. Une recherche de similarité typique peut ne toucher qu'un seul vecteur plus l'inventaire, le prix et l'évaluation. Il n'y a aucune raison pour que chaque autre champ occupe en permanence la mémoire de service simplement parce qu'il appartient au même enregistrement.</p>
<p>External Collection peut réduire l'empreinte de service à deux niveaux :</p>
<ul>
<li><strong>D'abord, la projection au niveau du schéma.</strong> Via <code translate="no">external_field</code>, l'External Collection ne peut exposer que les colonnes sources dont l'application a besoin. Les autres colonnes restent dans l'ensemble de données du lac et ne sont pas incluses dans ce schéma de service.</li>
<li><strong>Ensuite, la projection au moment de l'exécution.</strong> Avec le modèle de service à plusieurs niveaux, les QueryNodes récupèrent et mettent en cache les champs et index réellement nécessaires à la charge de travail plutôt que de charger l'ensemble du dataset mappé au préalable.</li>
</ul>
<p>En d'autres termes, <strong>l'ensemble de données peut rester large dans le lac sans forcer l'empreinte de service à être tout aussi large.</strong></p>
<p>Il y a un compromis évident. Une requête qui atteint un champ ou un index froid peut subir un coût de lecture distante au premier accès. Les politiques de préchauffage peuvent précharger les champs ou index critiques pour la latence, tandis que les politiques de cache et d'éviction évitent que les états moins fréquemment accédés n'occupent indéfiniment les ressources locales.</p>
<p>Le but n'est pas que le stockage d'objets se comporte comme de la RAM. C'est que la mémoire et le disque local peuvent suivre l'ensemble de travail de la charge de récupération, plutôt que la taille et la largeur totales de l'ensemble de données source.</p>
<p>Le format source compte également ici. Les formats conçus pour des balayages analytiques larges et les formats optimisés pour des lectures plus étroites ou aléatoires peuvent produire des comportements d'E/S différents sous un accès à la demande. External Collection n'efface pas ces compromis au niveau du stockage ; elle permet à Milvus de construire une couche de récupération par-dessus.</p>
<h2 id="What-search-and-indexing-capabilities-External-Collection-supports" class="common-anchor-header">Quelles capacités de recherche et d'indexation External Collection prend en charge<button data-href="#What-search-and-indexing-capabilities-External-Collection-supports" class="anchor-icon" translate="no">
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
    </button></h2><p>External Collection ne se contente pas de pointer Milvus vers un répertoire d'embeddings et de balayer les fichiers. Milvus construit des structures de récupération sur des données externes et exécute les requêtes via son moteur de récupération standard.</p>
<h3 id="Milvus-indexes-built-over-external-data" class="common-anchor-header">Index Milvus construits sur des données externes<button data-href="#Milvus-indexes-built-over-external-data" class="anchor-icon" translate="no">
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
    </button></h3><p>Selon les champs et la charge de travail, Milvus peut construire :</p>
<ul>
<li>des index vectoriels pour la recherche ANN ;</li>
<li>des index scalaires pour le filtrage des métadonnées ;</li>
<li>des index JSON pour les attributs semi-structurés ;</li>
<li>des index BM25 et de texte intégral pour la récupération lexicale ;</li>
<li>des champs générés par fonction pris en charge par le modèle de données Milvus.</li>
</ul>
<p>La recherche ANN utilise ces index pour réduire l'ensemble des candidats au lieu de lire chaque vecteur source.</p>
<p>Cette distinction est importante car stocker un embedding dans un lac n'est pas la même chose que d'exploiter une base de données vectorielle par-dessus. La persistance vous donne des octets. La récupération de production nécessite également des index, la planification de requêtes, le filtrage, le classement, la mise en cache et un chemin de service à faible latence.</p>
<h3 id="Beyond-vector-top-K" class="common-anchor-header">Au-delà du top-K vectoriel<button data-href="#Beyond-vector-top-K" class="anchor-icon" translate="no">
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
    </button></h3><p>Une autre erreur courante est de lire « External Collection » comme « recherche vectorielle sur Parquet ». Cela sous-estime ce que la récupération de production exige réellement.</p>
<p>Un résultat de recherche de production dépend rarement de la seule similarité vectorielle. Il peut également dépendre de termes exacts, de la politique d'accès, de l'inventaire, de l'horodatage, de la catégorie, du prix, de la qualité de la source ou de signaux de classement métier.</p>
<p>Considérons une requête telle que :</p>
<table>
<thead>
<tr><th>robe fleurie rouge pour l'été, en stock, meilleures évaluations d'abord</th></tr>
</thead>
<tbody>
</tbody>
</table>
<p>Un chemin de récupération de production peut nécessiter plusieurs signaux :</p>
<ul>
<li><strong>Similarité vectorielle</strong> pour le sens sémantique de « robe fleurie d'été ».</li>
<li><strong>Recherche lexicale ou en texte intégral</strong> pour un terme exact tel que « rouge ».</li>
<li><strong>Filtres scalaires</strong> pour exclure les produits en rupture de stock ou sous un seuil d'évaluation.</li>
<li><strong>Récupération hybride et classement</strong> pour combiner plusieurs signaux de récupération.</li>
</ul>
<p>Milvus 3.0 étend également le moteur de requête au-delà de la recherche initiale des plus proches voisins avec des capacités telles que le <strong>tri, l'agrégation et le facettage côté serveur.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_6_d805a24b72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Le point plus large est qu'External Collection donne aux données résidant dans le lac un chemin de récupération de base de données—pas simplement un moyen de lire des vecteurs à partir de fichiers.</p>
<h2 id="How-the-same-lake-data-supports-online-serving-and-offline-processing" class="common-anchor-header">Comment les mêmes données du lac prennent en charge le service en ligne et le traitement hors ligne<button data-href="#How-the-same-lake-data-supports-online-serving-and-offline-processing" class="anchor-icon" translate="no">
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
    </button></h2><p>La raison architecturale la plus forte de conserver la source dans un format de lac ouvert n'est pas simplement qu'une seconde copie coûte de l'argent. C'est que le même ensemble de données peut rester disponible pour les systèmes qui l'améliorent en continu.</p>
<p>Revenons au catalogue produits.</p>
<p>Pendant la journée, Milvus peut servir une External Collection pour la recherche de produits, les recommandations ou la récupération pour agents.</p>
<p>En parallèle, d'autres systèmes peuvent travailler directement sur l'ensemble de données du lac :</p>
<ul>
<li>Spark peut identifier les produits en double.</li>
<li>Un pipeline d'entraînement peut générer des embeddings à partir d'un nouveau modèle.</li>
<li>Une tâche de qualité des données peut détecter les enregistrements malformés ou anormaux.</li>
<li>Un pipeline d'évaluation peut comparer la qualité de récupération entre les versions de modèles.</li>
<li>Un processus par lots peut générer des résumés, des étiquettes ou des métadonnées supplémentaires.</li>
</ul>
<p>External Collection n'exécute <strong>pas</strong> ces tâches elle-même. Spark reste Spark ; l'entraînement reste l'entraînement. Son rôle est de supprimer la frontière supplémentaire des données de service entre eux.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_7_df2791e199.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Le travail hors ligne peut écrire des données améliorées ou de nouveaux champs dans le lac. Un Refresh ultérieur rend la source mise à jour disponible pour le chemin de récupération Milvus.</p>
<p>Il n'y a pas de boucle d'exportation-importation séparée dont le seul but est de reconstruire une autre copie faisant autorité pour le service.</p>
<p>La gouvernance reste également clairement répartie. Les versions sources, la traçabilité et la propriété de la source restent avec la plateforme du lac. Milvus maintient sa propre autorisation au niveau de la collection et les identifiants nécessaires pour lire la source. Partager une seule fondation de données ne signifie pas fusionner tous les domaines de sécurité dans un système unique.</p>
<p>C'est le lien avec le <a href="https://zilliz.com/blog/what-is-a-vector-lakebase"><strong>Vector Lakebase</strong></a> : le lac reste la fondation de données partagée, tandis que Milvus fournit une couche de récupération à faible latence par-dessus. External Collection est une partie de cette architecture, aux côtés de Storage V3, des instantanés, de l'intégration Spark, de l'évolution de schéma et du rétro-remplissage.</p>
<h2 id="Where-External-Collection-fitsand-where-it-does-not" class="common-anchor-header">Où External Collection s'intègre—et où elle ne s'intègre pas<button data-href="#Where-External-Collection-fitsand-where-it-does-not" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>External Collection est un excellent choix lorsque :</strong></p>
<ul>
<li>Vos données faisant autorité résident déjà dans Parquet, Vortex, Lance, Iceberg ou une autre source externe prise en charge.</li>
<li>L'ensemble de données est principalement produit par lots plutôt que par des écritures transactionnelles à haute fréquence.</li>
<li>Le maintien d'une seconde copie de service crée une charge importante d'ETL, de fraîcheur ou de gouvernance.</li>
<li>Plusieurs systèmes doivent travailler avec le même ensemble de données ouvert.</li>
<li>Une frontière Refresh explicite est acceptable pour la fraîcheur du service.</li>
<li>Vous voulez une récupération Milvus de production sans faire de Milvus le propriétaire des lignes sources.</li>
</ul>
<p><strong>Une collection Milvus normale reste le meilleur choix lorsque :</strong></p>
<ul>
<li>l'application insère ou met à jour (upsert) des enregistrements en continu ;</li>
<li>les suppressions doivent devenir visibles via le chemin d'écriture en ligne ;</li>
<li>la charge de travail dépend de fonctionnalités de collection indisponibles pour les schémas externes ;</li>
<li>la conception du service maintient intentionnellement toutes les données nécessaires en mémoire, évitant les manques de cache distants.</li>
</ul>
<p><strong>Plusieurs frontières méritent d'être gardées à l'esprit.</strong></p>
<ul>
<li><strong>Les External Collections sont en lecture seule.</strong> Les changements de source se produisent en dehors de Milvus.</li>
<li><strong>La zéro copie s'applique aux lignes sources.</strong> Les index, manifestes, caches et le calcul coûtent toujours des ressources.</li>
<li><strong>Refresh est explicite.</strong> Ce n'est pas un mécanisme de synchronisation en continu.</li>
<li><strong>La source doit rester accessible.</strong> La recherche, l'index et le comportement de Refresh dépendent toujours de l'accès au stockage et des identifiants.</li>
<li><strong>Storage V3 est requis.</strong> Dans Milvus 3.0 open source, il doit être activé avant d'utiliser External Collection.</li>
<li><strong>External Collection ne remplace pas le traitement en amont.</strong> La génération d'embeddings, le regroupement, la déduplication et le nettoyage des données se font toujours dans les systèmes en amont appropriés.</li>
</ul>
<p>Le choix est donc complémentaire plutôt que binaire. Un système peut utiliser des collections Milvus normales pour l'état en ligne en évolution rapide et des External Collections pour les grands ensembles de données produits par lots dont la maison naturelle est le lac.</p>
<h2 id="Try-External-Collection-in-Milvus-30" class="common-anchor-header">Essayez External Collection dans Milvus 3.0<button data-href="#Try-External-Collection-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>External Collection est disponible dans Milvus 3.0. Commencez avec un ensemble de données de lac représentatif et évaluez les aspects qui comptent pour votre charge de travail : le refresh initial et incrémental, le coût de construction des index, le comportement des requêtes à chaud et à froid, et l'intervalle de fraîcheur requis par votre application.</p>
<p>Pour les détails d'implémentation, voir :</p>
<ul>
<li><a href="https://milvus.io/docs/create-an-external-collection.md">Créer une External Collection</a></li>
<li><a href="https://milvus.io/docs/release_notes.md">Notes de version de Milvus 3.0</a></li>
<li><a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">Blog de lancement de Milvus 3.0</a></li>
</ul>
<p>Si vous préférez une voie gérée, External Collection est également disponible dans le cadre de <strong>Zilliz Vector Lakebase</strong> sur Zilliz Cloud. Voir :</p>
<ul>
<li><a href="https://docs.zilliz.com/docs/external-collection">External Collection dans Zilliz Cloud</a></li>
<li><a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">De la base de données vectorielle au Vector Lakebase</a></li>
<li><a href="https://zilliz.com/blog/why-we-built-vector-lakebase">Pourquoi nous avons construit Vector Lakebase : repenser l'architecture des données non structurées pour l'IA</a></li>
</ul>
<p>Vous pouvez également apporter des questions d'implémentation ou des retours au <a href="https://github.com/milvus-io/milvus">dépôt GitHub Milvus</a> ou à la <a href="https://discord.com/invite/8uyFbECzPX">communauté Discord Milvus</a>.</p>
