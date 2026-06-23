---
id: why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md
title: >
  Pourquoi nous avons créé Loon : un moteur de stockage pour les données d'IA en
  constante évolution.
author: Ted Xu
date: 2026-6-5
cover: assets.zilliz.com/Loon_New_Cover_8270435335.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 3.0, Zilliz Vector Lakebase, vector storage, AI datasets, Vortex'
meta_title: |
  AI Datasets Are Never Done. So We Built Loon.
desc: >
  Loon est un nouveau moteur de stockage pour Milvus 3.0 et Zilliz Vector
  Lakebase, conçu pour gérer des ensembles de données vectorielles en constante
  évolution grâce aux ColumnGroups, à l'alignement des identifiants de lignes et
  aux manifestes.
origin: >-
  https://zilliz.com/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing
---
<p><em>Cet article a été initialement publié sur zilliz.com et est republié ici avec l'autorisation de l'auteur.</em></p>
<h2 id="Key-takeaways" class="common-anchor-header">Points clés à retenir<button data-href="#Key-takeaways" class="anchor-icon" translate="no">
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
    </button></h2><p>Il s’agit d’une analyse technique approfondie et détaillée ; voici donc les points clés avant d’entrer dans les détails.</p>
<ul>
<li>Les ensembles de données d’IA ne sont pas des tables statiques. Les mêmes lignes ne cessent d’évoluer à mesure que les équipes remplacent les modèles d’embedding, ajoutent des vecteurs clairsemés, révisent les légendes, complètent les étiquettes, reconstruisent les index et exécutent des analyses hors ligne.</li>
<li>Les architectures de stockage traditionnelles présentent trois limites : les longues colonnes de vecteurs rendent les compléments de données coûteux, un format de fichier unique ne peut pas répondre efficacement à la fois aux analyses par balayage et aux lectures ponctuelles, et le stockage en base de données privée oblige les pipelines externes à créer des copies supplémentaires des données de référence.</li>
<li>Loon est le nouveau moteur de stockage pour Milvus et Zilliz Vector Lakebase. Il s’articule autour de formats de fichiers hybrides, de l’alignement des identifiants de lignes et d’un manifeste qui définit l’état versionné du jeu de données.</li>
<li>L’objectif est de permettre à un seul ensemble de données vectorielles de prendre en charge la recherche en ligne, l’analyse hors ligne, les mises à jour rétrospectives, la compaction et le calcul externe sans avoir à copier, réécrire ou réimporter constamment les données.</li>
</ul>
<h2 id="Introduction" class="common-anchor-header">Introduction<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Pendant un certain temps, un argument contre les bases de données vectorielles semblait raisonnable.</p>
<p><em>Les bases de données traditionnelles stockent déjà des entiers, des chaînes de caractères, du JSON, des blobs et des index. Pourquoi ne pas ajouter un</em> <em>type</em> « <code translate="no">_vector_</code> <em>», créer un index ANN à côté et en rester là ?</em></p>
<p>Pour les débuts de la recherche sémantique, cela fonctionne assez bien. Une colonne vectorielle associée à un index peut suffire pour une démo, une petite application RAG ou une fonctionnalité de recherche interne. Le problème apparaît plus tard, lorsque le jeu de données commence à se comporter moins comme une table et davantage comme un système de données d’IA.</p>
<p>Un ensemble de données vectorielles en production comporte des lignes, des clés primaires, des champs scalaires et des colonnes interrogeables. En ce sens, il ressemble à une table de base de données. Mais il présente également l’échelle et la structure de workflow d’un lac de données. Il peut contenir des centaines de millions d’enregistrements. Il est lu et réécrit de manière répétée par Spark, Ray, DuckDB, des pipelines d’entraînement, des tâches d’évaluation et des systèmes de qualité des données.</p>
<p>Il s’appuie également sur un stockage d’objets. Les objets sources sont souvent des vidéos, des images, des PDF, des fichiers audio ou des documents web qui restent stockés dans S3, GCS, OSS ou un autre système de stockage d’objets. La base de données stocke des références, des métadonnées, des caractéristiques dérivées et des index. Elle intègre ensuite, en tant qu’objets à part entière, des éléments que les modèles de stockage traditionnels n’ont pas été conçus pour gérer : des représentations denses, des vecteurs clairsemés, des légendes, des index vectoriels, des index textuels, des journaux de suppression, des statistiques, des versions de modèles, des versions d’analyseurs syntaxiques, des références à des blobs externes, ainsi que les relations de version entre tous ces éléments.</p>
<p><strong>C’est là que l’approche consistant à « simplement ajouter une colonne vectorielle » commence à montrer ses limites.</strong> La question n’est pas de savoir si une base de données peut stocker des octets vectoriels. De nombreux systèmes en sont capables. La question plus complexe est <strong>de savoir si le modèle de stockage peut gérer la manière dont les données vectorielles évoluent, comment elles sont interrogées et comment elles sont partagées au sein de la pile de données d’IA.</strong></p>
<p><strong>C’est pourquoi nous avons développé Loon, le nouveau moteur de stockage pour Milvus et</strong> <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a> <strong>(la prochaine évolution de Zilliz Cloud).</strong></p>
<p>Loon repose sur trois principes :</p>
<ol>
<li>Utiliser des formats physiques différents pour différents types de colonnes.</li>
<li>Aligner ces colonnes via un espace d’identifiants de lignes partagé.</li>
<li>Utiliser un manifeste pour définir l’état versionné du jeu de données.</li>
</ol>
<p>Pour comprendre l’importance de ces éléments, commençons par un workflow multimodal courant.</p>
<h2 id="A-vector-dataset-is-never-really-finished" class="common-anchor-header">Un ensemble de données vectorielles n’est jamais vraiment achevé.<button data-href="#A-vector-dataset-is-never-really-finished" class="anchor-icon" translate="no">
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
    </button></h2><p>Imaginez une équipe d’IA créant un ensemble de données vidéo pour un entraînement multimodal.</p>
<p>Une longue vidéo est téléchargée vers un stockage d’objets. Un pipeline la découpe en clips en fonction des changements de scène, des limites de plan ou de fenêtres temporelles. Les clips trop longs ou trop courts, flous, en double ou de mauvaise qualité sont filtrés. Les extraits restants sont notés par un modèle esthétique, sous-titrés par un autre modèle, intégrés par un modèle de vision-langage, puis stockés dans une base de données vectorielle à des fins de recherche, de déduplication et de filtrage des données d’entraînement.</p>
<p>À première vue, le flux de travail semble simple :</p>
<pre><code translate="no">video
→ clips
→ metadata
→ aesthetic_score
→ caption
→ embedding
→ search / dedup / training data filtering
<button class="copy-code-btn"></button></code></pre>
<p>Mais le jeu de données n’arrive pas sous sa forme définitive.</p>
<ul>
<li>Au cours de la première semaine, le tableau peut ne contenir que <code translate="no">clip_id</code>, <code translate="no">video_id</code>, <code translate="no">start_offset</code> et <code translate="no">duration</code>.</li>
<li>Au cours de la deuxième semaine, l’équipe ajoute <code translate="no">aesthetic_score</code>.</li>
<li>Au cours de la troisième semaine, un modèle de sous-titrage est lancé, et chaque clip reçoit un <code translate="no">caption</code>.</li>
<li>Au cours de la quatrième semaine, le premier modèle d’embedding est mis en ligne, et chaque clip se voit attribuer un embedding CLIP à 768 dimensions.</li>
<li>Un mois plus tard, l’équipe change de modèle et remplace les données « <code translate="no">embedding_v2</code> » par une version à 1 024 dimensions.</li>
<li>Deux mois plus tard, la recherche hybride devenant une nécessité, l’équipe ajoute une colonne de vecteurs clairsemés.</li>
<li>Trois mois plus tard, les légendes font l’objet d’une révision humaine et doivent être corrigées sur place.</li>
</ul>
<p>Le jeu de données n’a jamais été achevé. Il n’a cessé d’accumuler de nouvelles interprétations des mêmes lignes sous-jacentes.</p>
<p>C’est l’une des différences fondamentales entre les données vectorielles et les données d’entreprise traditionnelles. Une même ligne est retraité à l’infini. Et l’échelle transforme ce simple inconvénient en un véritable problème de stockage : les ensembles de données multimodales ne comptent souvent pas des millions d’enregistrements, mais des centaines de millions, voire des milliards. LAION-5B constitue une référence utile pour illustrer cette structure : des milliards de paires image-texte, chacune accompagnée de métadonnées, de légendes et de représentations vectorielles. Le plus difficile n’est donc pas la première insertion. Le plus difficile, c’est tout ce qui se passe une fois que le jeu de données commence à évoluer. <strong>Cette évolution met en évidence trois problèmes.</strong></p>
<h2 id="The-first-problem-long-columns-make-write-amplification-expensive" class="common-anchor-header">Premier problème : les longues colonnes rendent l’amplification d’écriture coûteuse<button data-href="#The-first-problem-long-columns-make-write-amplification-expensive" class="anchor-icon" translate="no">
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
    </button></h2><p>Les formats en colonnes tels que Parquet sont excellents pour de nombreuses charges de travail analytiques. Ils fonctionnent bien lorsque les schémas sont relativement stables, que les données sont lues plus souvent qu’elles ne sont réécrites, que les analyses ne portent que sur un sous-ensemble de colonnes et que la compression est importante. C’est le contexte pour lequel de nombreux formats analytiques ont été optimisés.</p>
<h3 id="Vector-rows-are-much-wider-than-analytical-rows" class="common-anchor-header">Les lignes vectorielles sont beaucoup plus larges que les lignes analytiques</h3><p>L’ <code translate="no">lineitem</code> TPC-H constitue une bonne référence. Elle comporte 16 colonnes : des clés entières, des valeurs décimales, des dates, des chaînes courtes et un petit champ de commentaire. Une ligne non compressée pèse environ 150 octets. Après compression, elle peut être bien plus petite. Avec un groupe de lignes de 64 Mo, un système de stockage peut regrouper des centaines de milliers de lignes en un seul groupe.</p>
<p><strong>Les ensembles de données vectorielles ne se présentent pas ainsi.</strong></p>
<p>Un ensemble de données image-texte de type LAION est bien plus proche de ce que produisent aujourd’hui de nombreux pipelines d’IA. Chaque ligne comporte toujours des métadonnées classiques : une URL, une légende, la largeur, la hauteur, des scores de qualité, des étiquettes, etc. Mais une fois l’embedding ajouté, la structure physique de la ligne change.</p>
<p>Un vecteur CLIP à 768 dimensions occupe environ 1,5 Ko en fp16 ou 3 Ko en fp32. Cette seule colonne peut être bien plus volumineuse qu’une ligne entière de l’ <code translate="no">lineitem</code> e TPC-H.</p>
<p>Et 768 dimensions ne sont ni inhabituelles ni excessives selon les normes actuelles. Un encodage de 1 024 ou 2 048 dimensions est courant dans les pipelines multimodaux. L’ <code translate="no">text-embedding-3-large</code> d’OpenAI va jusqu’à 3 072 dimensions, ce qui représente environ 12 Ko par vecteur en fp32.</p>
<p>La comparaison est frappante :</p>
<table>
<thead>
<tr><th>Forme du jeu de données</th><th>Taille approximative d’une ligne</th><th>Ce qui domine la ligne</th></tr>
</thead>
<tbody>
<tr><td>Ligne d’article TPC-H</td><td>~150 octets non compressés</td><td>champs scalaires et chaînes de caractères courtes</td></tr>
<tr><td>Ligne de type LAION avec un vecteur fp16 à 768 dimensions</td><td>~1,5 Ko+</td><td>intégration</td></tr>
<tr><td>Ligne de type LAION avec un vecteur fp32 de 768 dimensions</td><td>~3 Ko+</td><td>représentation</td></tr>
<tr><td>Ligne avec un vecteur de 3 072 dimensions en fp32</td><td>~12 Ko+ pour le vecteur seul</td><td>représentation</td></tr>
</tbody>
</table>
<p>Dans de nombreux ensembles de données d’IA, la colonne vectorielle n’est pas simplement un champ parmi d’autres. Physiquement, elle occupe la majeure partie de la ligne. Cela modifie le coût de l’évolution du schéma.</p>
<h3 id="Adding-one-vector-column-can-mean-hundreds-of-gigabytes" class="common-anchor-header">L'ajout d'une seule colonne vectorielle peut représenter des centaines de gigaoctets</h3><p>Supposons qu’un ensemble de données contienne 100 millions de clips vidéo. L’ajout d’une nouvelle colonne d’encodage fp32 à 1 024 dimensions implique l’écriture d’environ 400 Go de données vectorielles brutes. Ce chiffre n’inclut pas les statistiques, les index, les mises à jour des métadonnées, la surcharge liée au stockage d’objets, la validation ni l’intégration du chemin de service.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_3_ca3c616b9e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Si l’équipe ajoute une ou deux colonnes de type vectoriel chaque mois, telles que des caractéristiques de « <code translate="no">embedding_v2</code> », « <code translate="no">sparse_vector</code> » ou de «rerank», l’évolution du schéma devient une tâche récurrente d’ingénierie des données se chiffrant en centaines de gigaoctets, voire en téraoctets.</p>
<h3 id="Small-logical-updates-can-trigger-large-physical-rewrites" class="common-anchor-header">De petites mises à jour logiques peuvent entraîner d’importantes réécritures physiques</h3><p>Les mises à jour sont tout aussi importantes.</p>
<p>Dans les systèmes en colonnes, les anciennes données ne sont généralement pas mises à jour sur place. Un journal de suppression enregistre les modifications, puis la compaction réécrit ultérieurement les lignes actives dans de nouveaux fichiers. Ce modèle est gérable lorsque les lignes sont de petite taille.</p>
<p>Avec les données vectorielles, une petite mise à jour logique peut déclencher une réécriture physique importante.</p>
<p>Une tâche de révision humaine peut ne corriger que quelques centaines d’octets dans une légende. Mais si la légende, le vecteur dense, le vecteur clairsemé et d’autres caractéristiques dérivées partagent le même cycle de vie de fichier physique, le système peut finir par réécrire les vecteurs également. La modification logique est minime. L’E/S physique peut être colossale.</p>
<p>C’est là le problème de l’amplification d’écriture dans le stockage vectoriel. Le coût élevé ne tient pas seulement à la taille des vecteurs. Il tient au fait que les grands champs dérivés et les petits champs modifiables sont souvent liés par une structure de stockage qui les traite comme une seule unité.</p>
<h3 id="For-AI-datasets-backfill-is-a-routine-workload" class="common-anchor-header">Pour les ensembles de données d’IA, le « backfill » est une charge de travail courante</h3><p>Pour les tables analytiques traditionnelles, l’évolution du schéma ne se produit qu’occasionnellement. Pour les ensembles de données d’IA, c’est une pratique courante. Les modèles de légendes sont mis à niveau. Les modèles d’encodage sont remplacés. Des vecteurs creux sont ajoutés ultérieurement. Des caractéristiques de reclassement apparaissent. Les étiquettes humaines sont corrigées. Les balises de gouvernance sont ajoutées a posteriori. Les index sont reconstruits.</p>
<p>Ces opérations ne se résument pas à de simples ajouts. Elles modifient ou étendent fréquemment les lignes existantes.</p>
<p>C’est pourquoi le stockage vectoriel ne peut pas se contenter d’optimiser le débit de balayage. Il doit également réduire le coût des opérations de backfill et des mises à jour partielles.</p>
<h2 id="The-second-problem-the-same-data-must-support-scans-and-point-reads" class="common-anchor-header">Deuxième problème : les mêmes données doivent prendre en charge à la fois les balayages et les lectures ponctuelles<button data-href="#The-second-problem-the-same-data-must-support-scans-and-point-reads" class="anchor-icon" translate="no">
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
    </button></h2><p>Une fois les données écrites, le chemin de lecture se divise. Un même ensemble de données vectorielles présente généralement deux schémas d’accès distincts : <strong>le balayage analytique et les lectures ponctuelles.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_4_cef8d0e3ea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Analytical-workloads-want-wide-compressed-scans" class="common-anchor-header">Les charges de travail analytiques nécessitent des balayages étendus et compressés</h3><p>Un pipeline peut exécuter des filtres tels que :</p>
<pre><code translate="no" class="language-sql">WHERE aesthetic_score &gt; 0.8 AND duration &gt; 5
<button class="copy-code-btn"></button></code></pre>
<p>Ou bien il peut effectuer des analyses hors ligne, une évaluation complète des représentations, des statistiques BM25, la construction de bitmaps, des contrôles de qualité des données, des comptages et des regroupements.</p>
<p>Ce modèle lit de nombreuses lignes mais seulement quelques colonnes. Il privilégie les E/S séquentielles, les grands groupes de lignes, la compression, l’élagage des colonnes, le décodage par lots et l’exécution vectorisée.</p>
<p>Les grands groupes de lignes sont ici un atout. Ils permettent à une seule requête d’E/S d’extraire une grande quantité de données utiles, d’améliorer l’efficacité de la compression et de fournir au moteur d’exécution suffisamment de données contiguës pour amortir la surcharge. Lorsque plusieurs colonnes sont lues ensemble, le fait de les organiser de manière à optimiser le débit de balayage contribue également à réduire les échecs de cache lors de l’exécution vectorisée.</p>
<p>Parquet excelle dans ce domaine.</p>
<h3 id="ANN-results-need-narrow-row-level-lookups" class="common-anchor-header">Les résultats de l’ANN nécessitent des recherches ciblées au niveau des lignes</h3><p>Une fois que la recherche ANN a renvoyé les identifiants de lignes candidates, le système doit souvent récupérer des champs tels que :</p>
<pre><code translate="no">caption
embedding
rerank feature
video_uri
metadata
<button class="copy-code-btn"></button></code></pre>
<p>Ce schéma lit moins de lignes, souvent des centaines ou des milliers, mais nécessite un accès précis par ID de ligne. Il vise à localiser une ligne et une colonne spécifiques, à récupérer uniquement la plage d’octets requise et à éviter d’extraire un groupe de lignes entier juste pour récupérer quelques enregistrements.</p>
<p>La recherche ponctuelle présente une préférence presque opposée en matière de balayage. Elle nécessite une granularité de lecture plus fine. Idéalement, la couche de stockage peut localiser le segment ou la plage d’octets pertinente à partir de l’identifiant de ligne, ne lire que cette plage et décoder uniquement les données nécessaires au résultat.</p>
<p>La compression présente également un compromis différent. Pour les balayages, une compression plus forte est souvent avantageuse car le système lit beaucoup de données et économise des E/S. Pour la recherche ponctuelle, la compression peut devenir un inconvénient si la récupération d’une ligne nécessite le décodage d’un bloc compressé beaucoup plus volumineux.</p>
<h3 id="One-layout-cannot-optimize-for-both-paths" class="common-anchor-header">Une seule structure ne peut pas optimiser ces deux cas de figure</h3><p>C’est là le conflit fondamental. Le filtrage scalaire et l’analyse nécessitent des structures larges, compressées et adaptées aux balayages. La recherche vectorielle nécessite des structures étroites, précises et adressables par ligne.</p>
<p>Un format de fichier unique peut prendre en charge les deux dans une certaine mesure, mais il ne peut pas être optimal pour les deux simultanément.</p>
<p>Si toutes les colonnes sont stockées dans Parquet, les balayages scalaires s’effectuent sans difficulté. Mais la recherche ANN après rappel devient plus complexe. Le système peut n’avoir besoin que de quelques centaines de vecteurs, de légendes ou d’enregistrements de métadonnées, tandis que la couche de stockage peut être amenée à lire de grands groupes de lignes contenant principalement des lignes non pertinentes.</p>
<p>Sur un SSD local, le cache et le mmap peuvent masquer une partie de ce coût. Une fois les données stockées dans un système de stockage objet, ce coût devient plus visible. Chaque échec de cache peut se traduire par une lecture à distance d’une plage de données. Si les lignes candidates sont dispersées dans de nombreux groupes de lignes, une seule requête peut déclencher plusieurs lectures, chacune extrayant plus de données que la requête n’en a besoin. Dans une structure mal conçue, la récupération de 1 000 lignes candidates peut facilement entraîner des dizaines, voire des centaines de mégaoctets d’E/S inutiles, et dans les cas extrêmes, bien plus encore.</p>
<p>Réduire la taille des groupes de lignes facilite les recherches ponctuelles, mais nuit aux balayages. Un trop grand nombre de petits fragments réduit l’efficacité de la compression, augmente la surcharge liée aux métadonnées et perturbe les longues lectures séquentielles dont dépendent les moteurs analytiques.</p>
<p><strong>Le problème ne réside donc pas dans la recherche d’une taille « magique » unique pour les groupes de lignes. Le problème est qu’on demande au même ensemble de données de se comporter comme deux systèmes de stockage différents.</strong></p>
<h3 id="Hybrid-search-forces-both-paths-into-one-query" class="common-anchor-header">La recherche hybride force la combinaison des deux approches en une seule requête</h3><p>La recherche hybride rend ce conflit plus difficile à ignorer. Une même requête peut d’abord appliquer des filtres scalaires :</p>
<pre><code translate="no" class="language-sql">aesthetic_score &gt; 0.8 AND duration &gt; 5
<button class="copy-code-btn"></button></code></pre>
<p>Puis elle exécute une recherche ANN.</p>
<p>Elle récupère ensuite la légende, le vecteur et les métadonnées par ID de ligne.</p>
<p>Pour l’utilisateur, il s’agit d’une seule requête de recherche. Pour la couche de stockage, il s’agit à la fois d’un balayage analytique et d’une recherche aléatoire à faible latence.</p>
<p>C’est pourquoi le stockage vectoriel nécessite plus qu’un simple réglage Parquet optimisé. Il faut un moyen de positionner les différentes colonnes en fonction de la manière dont elles sont réellement lues.</p>
<h2 id="The-third-problem-the-dataset-does-not-live-inside-one-engine" class="common-anchor-header">Troisième problème : le jeu de données ne réside pas au sein d’un seul moteur<button data-href="#The-third-problem-the-dataset-does-not-live-inside-one-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Les deux premiers problèmes se produisent au sein de la base de données. Le troisième se produit à la frontière entre les systèmes.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_5_802e6d92c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AI-data-pipelines-span-many-systems" class="common-anchor-header">Les pipelines de données d’IA s’étendent sur de nombreux systèmes</h3><p>Dans le workflow vidéo, très peu d’opérations se déroulent au sein même de la base de données vectorielle.</p>
<p>Les vidéos brutes sont stockées dans un système de stockage d’objets. La génération de clips peut s’effectuer dans Spark ou Ray. L’évaluation esthétique peut s’effectuer dans un service GPU. Le sous-titrage peut s’effectuer dans un pipeline d’inférence LLM. Les représentations vectorielles peuvent être générées par une autre tâche GPU. Les vecteurs clairsemés peuvent provenir d’un service SPLADE. L’évaluation hors ligne, le filtrage des données d’entraînement, la révision humaine et les tâches de gouvernance peuvent toutes s’exécuter ailleurs.</p>
<p>La base de données vectorielle sert à la recherche en ligne, mais l’ensemble de données est produit, corrigé, évalué et enrichi par de nombreux systèmes.</p>
<h3 id="Private-storage-formats-create-multiple-copies-of-the-truth" class="common-anchor-header">Les formats de stockage propriétaires créent de multiples copies de la « vérité »</h3><p>Si la base de données utilise un format physique propriétaire qu’elle seule peut lire et écrire, chaque tâche externe nécessite une exportation, une conversion, une copie et une importation. Une même collection peut exister dans la base de données, dans un répertoire temporaire Spark, dans un résultat d’évaluation et dans un répertoire de backfill local. La véritable question devient alors :</p>
<ul>
<li>Quelle copie est la source de vérité ?</li>
<li>Laquelle contient le modèle de légende du mois dernier ?</li>
<li>Quelles lignes ont déjà été corrigées par une révision humaine ?</li>
<li>Quelle colonne de vecteurs clairsemés a été générée par quel modèle ?</li>
<li>Quel index vectoriel est toujours valide après le backfill ?</li>
<li>À quel objet vidéo d'origine cette ligne fait-elle référence ?</li>
</ul>
<p>À petite échelle, les équipes peuvent parfois s’en sortir avec des conventions de nommage et des vérifications manuelles. Mais avec des centaines de millions de lignes et des téraoctets d’embeddings, cela devient un problème de cohérence.</p>
<h3 id="Vector-datasets-need-a-shared-versioned-state" class="common-anchor-header">Les ensembles de données vectorielles nécessitent un état partagé et versionné</h3><p>Les systèmes « lakehouse » ont apporté une réponse à une variante de ce problème pour les données structurées. Iceberg, Delta Lake et Hudi ne se contentent pas de stocker des fichiers. Leur principale contribution réside dans le fait de permettre à plusieurs moteurs de se coordonner autour d’un même état de table.</p>
<p>Les bases de données vectorielles ont désormais besoin d’une capacité similaire, mais l’état est plus complexe. Il doit inclure non seulement les fichiers de table et les partitions, mais aussi les index vectoriels, les index textuels, les caractéristiques clairsemées, les journaux de suppression, les statistiques, les plages d’identifiants de lignes et les références à des blobs externes.</p>
<p>La question n’est pas simplement : « Spark peut-il lire les fichiers Milvus ? »</p>
<p>La question est la suivante : une fois que Spark a rempli une colonne vectorielle clairsemée, comment Milvus sait-il à quelle version cette colonne appartient, quelles lignes elle couvre, quel modèle l’a produite, et à partir de quand les requêtes en ligne peuvent-elles l’utiliser en toute sécurité ?</p>
<p>La réponse doit résider dans le modèle de stockage.</p>
<h2 id="Why-patches-are-not-enough" class="common-anchor-header">Pourquoi les correctifs ne suffisent pas<button data-href="#Why-patches-are-not-enough" class="anchor-icon" translate="no">
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
    </button></h2><p>Il est tentant de considérer ces trois aspects comme trois problèmes techniques distincts.</p>
<ul>
<li>Amplification des écritures ? Ajoutez le traitement par lots.</li>
<li>Lectures ponctuelles ? Ajoutez un cache.</li>
<li>Des systèmes externes ? Ajoutez des outils d’exportation et d’importation.</li>
</ul>
<p>Ces solutions peuvent aider, mais elles ne règlent pas le problème sous-jacent : un ensemble de données vectorielles est physiquement hétérogène.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_6_0744ff4445.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dans l’exemple vidéo, <code translate="no">clip_id</code>, <code translate="no">video_id</code>, <code translate="no">duration</code> et <code translate="no">aesthetic_score</code> sont de courts champs scalaires. Ils sont utiles pour le filtrage et l’analyse.</p>
<ul>
<li><code translate="no">caption</code> est du texte. Il peut être utilisé pour le BM25, la révision, la correction et le remplissage.</li>
<li><code translate="no">embedding</code> est un vecteur long et dense. Il est utilisé pour le rappel ANN, puis pour la recherche au niveau des lignes ou le reclassement.</li>
<li><code translate="no">embedding_v2</code> est une nouvelle sortie du modèle, souvent complétée longtemps après l’insertion des données d’origine.</li>
<li><code translate="no">sparse_vector</code> prend en charge la recherche hybride et dispose de son propre modèle d’accès.</li>
<li>La vidéo brute doit rester dans le stockage objet. La base de données doit stocker une référence, une somme de contrôle, un type MIME, une version d’analyseur syntaxique et une relation au niveau des lignes.</li>
<li>Les index vectoriels, les index textuels, les statistiques et les journaux de suppression sont des objets dérivés dotés de leur propre sémantique de version.</li>
</ul>
<p>Ces objets partagent une ligne logique, mais ils ne doivent pas tous partager la même structure physique ni le même cycle de vie.</p>
<ul>
<li>S’ils sont contraints de partager une structure de table ordinaire, les mises à jour deviennent coûteuses.</li>
<li>S’ils sont contraints de respecter un format de fichier en colonnes, les lectures ponctuelles deviennent coûteuses.</li>
<li>S’ils sont traités comme des fichiers objets sans rapport les uns avec les autres, la gestion des versions devient fragile.</li>
</ul>
<p>Le modèle de stockage doit donc partir du principe que le jeu de données est hétérogène.</p>
<p><strong>Cela conduit à trois exigences de conception :</strong></p>
<ul>
<li>Premièrement, les différents groupes de colonnes doivent être stockés dans des formats physiques distincts.</li>
<li>Deuxièmement, ces groupes de colonnes doivent disposer d’un espace d’identifiants de lignes partagé, afin de pouvoir continuer à se comporter comme une seule table logique.</li>
<li>Troisièmement, le jeu de données doit disposer d’un manifeste versionné qui précise quels fichiers, index, journaux, statistiques et références d’objets appartiennent à la vue actuelle.</li>
</ul>
<p><strong>C’est la conception qui sous-tend Loon, notre nouveau moteur de stockage utilisé par Milvus et Zilliz Cloud.</strong></p>
<h2 id="Loon-a-storage-engine-behind-Milvus-and-Zilliz-Cloud-for-evolving-vector-datasets" class="common-anchor-header">Loon : un moteur de stockage pour Milvus et Zilliz Cloud, destiné aux ensembles de données vectorielles évolutifs<button data-href="#Loon-a-storage-engine-behind-Milvus-and-Zilliz-Cloud-for-evolving-vector-datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour résoudre tous les problèmes mentionnés ci-dessus, nous avons développé <strong>Loon</strong>, le nouveau moteur de stockage de Milvus et de <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a> (la prochaine évolution de Zilliz Cloud), conçu pour les ensembles de données vectorielles évolutifs.</p>
<p>Ce nom s’inscrit dans la tradition de Zilliz consistant à donner des noms d’oiseaux à ses produits. Un « loon » (plongeon) est un oiseau plongeur vivant sur les lacs, ce qui correspond bien à l’objectif du système : une base de données vectorielle ne devrait pas avoir à déplacer, analyser ou réécrire tout un « lac » de données chaque fois qu’elle exécute une requête, remplit une colonne ou crée un index. Elle doit d’abord comprendre la version actuelle de l’ensemble de données, y compris ses colonnes, ses index, ses statistiques, ses journaux de suppression et ses références d’objets, puis ne lire que la partie dont elle a réellement besoin.</p>
<p>Les formats de fichiers hybrides, l’alignement des identifiants de lignes et Manifest ne sont pas trois fonctionnalités distinctes. Elles découlent d’un même postulat de conception : un ensemble de données vectorielles est intrinsèquement hétérogène.</p>
<h3 id="Three-pieces-one-storage-model" class="common-anchor-header">Trois éléments, un seul modèle de stockage</h3><p>Les formats de fichiers hybrides tiennent compte du fait que différentes colonnes présentent des schémas d’accès différents. Les champs scalaires se prêtent bien aux balayages et aux filtrages. Les champs vectoriels nécessitent une recherche efficace au niveau des lignes. Les objets bruts tels que les vidéos, les PDF, les images et les fichiers audio ont leur place dans un stockage d’objets, et non dans les fichiers de données d’une base de données.</p>
<p>L’alignement des identifiants de ligne reconnaît que ces colonnes peuvent être physiquement séparées, mais qu’elles décrivent néanmoins les mêmes lignes logiques. Une légende, un encodage, un vecteur creux et un URI vidéo peuvent résider dans des fichiers et des formats différents, mais ils doivent tout de même être regroupés en un seul résultat.</p>
<p>Le manifeste tient compte du fait que le jeu de données n’est pas écrit une fois pour toutes. Il sera modifié par plusieurs systèmes, au fil de plusieurs versions, pour plusieurs tâches. Les index, les statistiques, les journaux de suppression, les références à des objets externes et les groupes de colonnes doivent tous apparaître dans la même vue versionnée.</p>
<p><strong>C’est pourquoi Loon n’est pas simplement un format de fichier vectoriel plus rapide.</strong> Un format plus rapide facilite la recherche par index, mais il ne résout pas les problèmes d’évolution du schéma ni de coordination entre plusieurs moteurs. L’alignement des identifiants de lignes permet aux colonnes fractionnées de se comporter comme une seule table, mais il ne précise pas quels fichiers appartiennent à la version actuelle. Un manifeste peut décrire l’état d’un ensemble de données, mais sans groupes de colonnes ni alignement des identifiants de lignes, il ne peut pas représenter clairement les différentes structures physiques au sein d’une même collection logique.</p>
<p>Le modèle de stockage a besoin de ces trois éléments : des formats différents pour les différents groupes de colonnes, un espace d’identifiants de lignes partagé pour reconstruire les lignes, et un manifeste versionné qui indique à chaque lecteur et écrivain quel est l’état actuel du jeu de données.</p>
<h3 id="Where-Loon-fits-in-Milvus-and-Zilliz-Vector-Lakebase" class="common-anchor-header">La place de Loon dans Milvus et Zilliz Vector Lakebase</h3><p>Dans Milvus, il remplace l’ancienne couche de stockage de journaux binaires segmentés par un modèle articulé autour du manifeste, des groupes de colonnes, du format de fichier et des abstractions du système de fichiers. Dans <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a> (la prochaine évolution de Zilliz Cloud)<strong>,</strong> la même orientation s’applique à l’architecture de Vector Lakebase : maintenir la rapidité du chemin de service de la base de données vectorielle tout en facilitant l’évolution, l’analyse et la coordination des données sous-jacentes avec les systèmes externes.</p>
<p>Les composants de niveau supérieur de Milvus conservent leurs rôles habituels. Proxy gère le routage. QueryCoord et DataCoord gèrent la planification. IndexNode construit les index. Les API orientées application pour les collectes, les insertions, les recherches et les recherches hybrides n’ont pas besoin d’exposer les fichiers Manifest ni les ColumnGroups.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_7_d4d1a34604.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Le changement se situe en arrière-plan.</p>
<p>DataNode, QueryNode, segcore, la compaction et les connecteurs externes peuvent fonctionner via la même abstraction de stockage. C’est important car le jeu de données n’est plus uniquement écrit et lu par la base de données. Il peut être étendu par des systèmes de calcul externes et exploité simultanément par la recherche en ligne.</p>
<p>À un niveau général, les couches se présentent comme suit :</p>
<pre><code translate="no">Manifest
→ ColumnGroup
→ file <span class="hljs-built_in">format</span> layer
→ filesystem abstraction
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_8_70917bdfc7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Le Manifest décrit l’état versionné du jeu de données. Les ColumnGroups mappent une collection logique en groupes physiques de colonnes. La couche de format de fichier permet à chaque ColumnGroup de choisir un format approprié. L’abstraction du système de fichiers fonctionne à la fois sur le stockage objet et le stockage local.</p>
<p>Le point important est que les formats de fichiers hybrides, l’alignement des identifiants de lignes et le Manifest ne sont pas des fonctionnalités distinctes. Ensemble, ils définissent le modèle de stockage.</p>
<p>Une fois ce modèle en place, nous pouvons examiner un par un les trois choix de conception : comment Loon stocke les différents groupes de colonnes, comment il les réaligne en lignes, et comment le Manifest transforme ces fichiers en un ensemble de données versionné.</p>
<h2 id="Design-1-use-the-right-file-format-for-the-right-column-group" class="common-anchor-header">Conception 1 : utiliser le format de fichier adapté à chaque ColumnGroup<button data-href="#Design-1-use-the-right-file-format-for-the-right-column-group" class="anchor-icon" translate="no">
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
    </button></h2><p>Les différentes colonnes présentent des modèles d’accès différents. Elles ne doivent pas être contraintes d’utiliser le même format de fichier.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_9_c262865944.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Loon-separates-a-logical-collection-into-ColumnGroups" class="common-anchor-header">Loon divise une collection logique en groupes de colonnes.</h3><ul>
<li>Les champs scalaires, les champs de filtrage, les clés métier et les champs statistiques sont souvent analysés, filtrés, agrégés ou utilisés pour la planification des requêtes. Ils tirent parti de la compression, de l’élagage des colonnes et de la compatibilité avec l’écosystème. Le format Parquet convient bien à ces colonnes.</li>
<li>Les vecteurs denses, les vecteurs clairsemés et les caractéristiques de reclassement sont souvent lus après le rappel ANN par ID de ligne. Ils nécessitent un accès aléatoire à faible latence, des lectures précises par plage d’octets et un décodage sélectif. Une structure orientée segments est plus adaptée. Loon utilise Vortex dans cette optique.</li>
<li>Les objets bruts tels que les vidéos, les PDF, les images et les fichiers audio ne doivent pas être intégrés dans les fichiers de données de la base de données vectorielle. Ils doivent rester dans le stockage d’objets. La base de données enregistre les références, les sommes de contrôle, les types MIME, les versions des analyseurs syntaxiques et les relations au niveau des lignes.</li>
</ul>
<p>Pour l’exemple de la vidéo, une architecture physique pourrait ressembler à ceci :</p>
<pre><code translate="no"><span class="hljs-title class_">Parquet</span> <span class="hljs-title class_">ColumnGroup</span>:
clip_id / video_id / start_offset / duration / aesthetic_score / caption

<span class="hljs-title class_">Vortex</span> <span class="hljs-title class_">ColumnGroups</span>:
embedding
embedding_v2
sparse_vector

<span class="hljs-title class_">Object</span> <span class="hljs-attr">storage</span>:
raw video objects
<button class="copy-code-btn"></button></code></pre>
<p>Pour l’application, il s’agit toujours d’une seule collection. Du point de vue de la couche de stockage, différentes parties de cette collection utilisent des formats physiques distincts. Cela réduit directement les réécritures inutiles. L’ajout d’ <code translate="no">embedding_v2</code> s peut se traduire par un nouveau ColumnGroup vectoriel ainsi qu’un commit de manifeste. Cela ne nécessite pas de réécrire la colonne de légende, les métadonnées scalaires ou la colonne d’intégration existante.</p>
<p>Le même principe s’applique aux vecteurs clairsemés, aux caractéristiques de reclassement ou à d’autres champs dérivés. Si une nouvelle colonne peut être physiquement indépendante et alignée par ID de ligne, elle n’a pas besoin d’entraîner des colonnes non liées dans le même processus de réécriture.</p>
<h3 id="Loon-also-adapts-the-use-of-file-formats" class="common-anchor-header">Loon adapte également l’utilisation des formats de fichiers.</h3><p><strong>Pour Parquet, les paramètres par défaut ne sont pas toujours idéaux pour les données riches en vecteurs.</strong> Un groupe de lignes de 64 Mo peut s’avérer trop volumineux pour une recherche ponctuelle, car une petite lecture aléatoire peut extraire bien plus de données que nécessaire. Loon réduit la taille des groupes de lignes à 1 Mo dans les chemins concernés et désactive certains encodages, tels que l’encodage par dictionnaire sur les colonnes vectorielles, lorsqu’ils ne facilitent pas la recherche aléatoire dans les données vectorielles.</p>
<p><strong>Pour Vortex, le travail le plus important concerne la disposition.</strong> Loon utilise une disposition qui équilibre l’efficacité du balayage et la recherche ponctuelle. Au sein d’un groupe de lignes, les segments provenant de colonnes associées peuvent être placés à proximité les uns des autres pour faciliter le balayage. Pour effectuer des opérations, les lectures de sous-segments permettent au système de récupérer uniquement les octets pertinents plutôt que d’extraire un segment entier.</p>
<p><strong>Loon prend également en charge l’intégration en lecture seule de Lance</strong>, ce qui permet de monter des jeux de données Lance existants en tant que ColumnGroups lorsque la compatibilité est un critère important.</p>
<h3 id="What-the-benchmark-shows" class="common-anchor-header">Ce que montre le benchmark</h3><p>Lors d’un test local, à partir d’un fichier unique contenant 40 000 lignes et le schéma <code translate="no">{id: int64, name: utf8, value: float64, vector: list&lt;float32&gt;[128]}</code>, Vortex a affiché les résultats suivants par rapport à Parquet avec des groupes de lignes de 1 Mo :</p>
<table>
<thead>
<tr><th>Opération</th><th>Vortex</th><th>Parquet</th><th>Différence</th></tr>
</thead>
<tbody>
<tr><td>Extraction de K = 1 000 lignes aléatoires</td><td>5,8 ms</td><td>144 ms</td><td>25 fois plus rapide</td></tr>
<tr><td>Balayage complet des colonnes vectorielles</td><td>21 ms</td><td>142 ms</td><td>6,76 fois plus rapide</td></tr>
<tr><td>Taille du fichier : environ 21 Mo de données brutes</td><td>6,62 Mo</td><td>7,16 Mo</td><td>7 % plus petit</td></tr>
</tbody>
</table>
<p>Le résultat de l’ <code translate="no">take</code> ion provient de la réduction de la quantité de données non pertinentes qui doivent être lues et décodées. Le résultat de l’analyse provient de la compression et des choix d’implémentation.</p>
<p>Ces chiffres doivent être replacés dans le contexte de leur configuration : 8 vCPU Ubuntu 22.04 KVM, système de fichiers local, un fichier, 40 000 lignes, groupes de lignes de 1 Mo et le schéma ci-dessus. Sur un stockage objet, les E/S réseau peuvent être prédominantes ; la réduction de l’amplification de lecture peut donc s’avérer encore plus importante. Les résultats réels dépendent de la structure du jeu de données, du comportement du stockage objet, de l’état du cache et du modèle de requête.</p>
<p>Le message général n’est pas que chaque colonne doive utiliser Vortex.</p>
<p>Le point essentiel est que les ensembles de données vectorielles nécessitent un choix de format de fichier au niveau du ColumnGroup.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_11_127c1953e6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Design-2-align-physical-files-through-row-IDs" class="common-anchor-header">Conception 2 : aligner les fichiers physiques via les identifiants de ligne<button data-href="#Design-2-align-physical-files-through-row-IDs" class="anchor-icon" translate="no">
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
    </button></h2><p>Les formats de fichiers hybrides résolvent un problème : différentes colonnes peuvent désormais résider dans les formats qui leur conviennent le mieux.</p>
<p>Mais cela crée un deuxième problème. Si les champs scalaires sont stockés en Parquet, les vecteurs en Vortex et les objets bruts dans le stockage objet, comment le système peut-il continuer à les traiter comme une seule et même collection ?</p>
<p><strong>Loon résout ce problème grâce à l’alignement des identifiants de ligne.</strong></p>
<h3 id="Row-ID-is-the-storage-layer-coordinate-system" class="common-anchor-header">L’identifiant de ligne est le système de coordonnées de la couche de stockage</h3><p>Chaque fichier physique ColumnGroupFile enregistre le chemin d’accès au fichier et la plage d’identifiants de ligne qu’il couvre :</p>
<pre><code translate="no">path
start_index
end_index
<button class="copy-code-btn"></button></code></pre>
<p>Différents ColumnGroups peuvent couvrir le même espace d’identifiants de ligne, même s’ils se trouvent dans des fichiers et des formats différents.</p>
<p>Pour l’ <code translate="no">12345</code> d’un ID de ligne, les métadonnées scalaires peuvent se trouver dans un ColumnGroup Parquet, l’encodage peut se trouver dans un ColumnGroup Vortex, et la vidéo brute peut être représentée par une référence de stockage d’objets. Logiquement, ils constituent toujours une seule ligne. Cela confère à la couche de stockage un système de coordonnées stable.</p>
<p>L’ID de ligne n’est pas la clé primaire métier. Il s’agit du système de coordonnées de la couche de stockage qui permet à Loon de fractionner physiquement une collection sans perdre la capacité de la reconstruire logiquement.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_12_3da04acdec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="New-columns-do-not-have-to-rewrite-old-columns" class="common-anchor-header">Les nouvelles colonnes ne nécessitent pas de réécriture des anciennes</h3><p>L’ajout d’un ColumnGroup « <code translate="no">embedding_v2</code> » ne nécessite pas de réécrire la légende d’origine, les métadonnées ou les ColumnGroups « <code translate="no">embedding_v1</code> ». Loon peut créer un nou , enregistrer la plage d’identifiants de lignes qu’il couvre et valider cette modification via le manifeste.</p>
<p>Il en va de même pour les vecteurs clairsemés, les caractéristiques de reclassement ou d’autres champs dérivés qui arrivent ultérieurement.</p>
<p>Tant que le nouveau ColumnGroup couvre la bonne plage d’identifiants de lignes, il peut rejoindre la même collection logique sans forcer le déplacement de données non liées.</p>
<h3 id="Deletes-and-compaction-can-be-more-targeted" class="common-anchor-header">Les suppressions et la compaction peuvent être plus ciblées</h3><p>L’alignement des ID de ligne facilite également les suppressions.</p>
<p>Une suppression peut d’abord être exprimée via un journal de suppression. La ligne devient invisible au niveau logique, tandis que le nettoyage physique est reporté jusqu’à la compaction. Lorsque la compaction s’exécute finalement, elle n’a pas toujours besoin de réécrire chaque ColumnGroup lié aux lignes concernées. Elle peut se concentrer sur les ColumnGroups qui nécessitent un nettoyage.</p>
<p>C’est important car toutes les colonnes n’ont pas le même profil de coût. La réécriture d’un ColumnGroup scalaire court est très différente de la réécriture de centaines de gigaoctets de vecteurs denses.</p>
<h3 id="Hybrid-search-can-fetch-only-the-columns-it-needs" class="common-anchor-header">La recherche hybride peut récupérer uniquement les colonnes dont elle a besoin</h3><p>L’alignement des identifiants de ligne est également ce qui rend la recherche hybride pratique en complément des formats de fichiers hybrides.</p>
<p>Une fois que la recherche ANN a renvoyé des identifiants de lignes candidates, le système peut récupérer uniquement les champs nécessaires au résultat final : légendes, métadonnées, vecteurs, caractéristiques de reclassement ou références d’objets.</p>
<p>Par exemple, une requête peut nécessiter :</p>
<pre><code translate="no">caption
embedding
video_uri
<button class="copy-code-btn"></button></code></pre>
<p>Ces champs peuvent se trouver dans différents ColumnGroups. Loon peut localiser les fichiers pertinents par plage d’identifiants de ligne, lire les plages d’octets nécessaires et assembler le résultat.</p>
<p>Sans alignement des identifiants de ligne, les formats hybrides ne seraient que des fichiers distincts placés côte à côte. Grâce à l’alignement des identifiants de ligne, ils se comportent comme une seule collection logique.</p>
<h3 id="Packed-Reader-hides-the-split-from-the-upper-layer" class="common-anchor-header">Le « Packed Reader » masque la division à la couche supérieure</h3><p>Le composant d’exécution qui rend cela possible est le Packed Reader.</p>
<p>La couche supérieure voit un flux Arrow RecordBatch unifié. En arrière-plan, les données peuvent provenir de plusieurs groupes de colonnes (ColumnGroups) dans différents formats de fichiers. Le Packed Reader masque ces différences, aligne les données par plages d’identifiants de ligne et gère les E/S multi-fichiers avec une utilisation contrôlée de la mémoire.</p>
<p>Il prend également en charge l’ <code translate="no">take</code> e directe par ID de ligne. À partir d’un ensemble d’ID de ligne, il localise les ColumnGroupFiles pertinents, effectue des lectures par plage et renvoie les champs demandés.</p>
<p>Pour le flux de travail vidéo, une requête ANN peut nécessiter l’ <code translate="no">caption</code>, l’ <code translate="no">embedding</code> et l’ <code translate="no">video_uri</code>. Le Packed Reader peut récupérer le ColumnGroup scalaire et le ColumnGroup vectoriel sans toucher aux colonnes non concernées.</p>
<p>C’est là toute la différence entre des « fichiers séparés » et « une table comportant plusieurs structures physiques ».</p>
<h2 id="Design-3-make-the-Manifest-the-source-of-truth" class="common-anchor-header">Conception n° 3 : faire du manifeste la source de vérité<button data-href="#Design-3-make-the-Manifest-the-source-of-truth" class="anchor-icon" translate="no">
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
    </button></h2><p>Les formats de fichiers hybrides définissent la manière dont les données sont physiquement stockées. L’alignement des identifiants de ligne détermine comment des ColumnGroups séparés forment néanmoins une seule table logique. Mais le système doit encore répondre à une question plus large : <strong>quels fichiers, journaux, statistiques, index et références d’objets appartiennent à la version actuelle du jeu de données ? C’est le rôle du Manifest.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_13_cd18b2da18.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Object-storage-directories-are-not-enough" class="common-anchor-header">Les répertoires de stockage d’objets ne suffisent pas</h3><p>Le stockage d’objets n’est pas un catalogue de base de données. Un répertoire peut contenir d’anciens fichiers, de nouveaux fichiers, les résultats de tâches ayant échoué, des fichiers temporaires, des journaux de suppression, des fichiers encore référencés par d’anciens instantanés et des fichiers en attente de nettoyage. Le fait qu’un fichier existe ne signifie pas qu’il appartient à la version actuelle du jeu de données.</p>
<p>Un ensemble de données Loon peut être organisé en répertoires tels que :</p>
<pre><code translate="no">_metadata/
_data/
_delta/
_stats/
_index/
<button class="copy-code-btn"></button></code></pre>
<p>Mais la structure des répertoires n’est pas la source de vérité. C’est le manifeste qui l’est. Les lecteurs ne doivent pas énumérer les répertoires et déduire l’état à partir des fichiers qui s’y trouvent par hasard. Ils doivent lire le manifeste actuel et suivre la vue versionnée qu’il déclare.</p>
<h3 id="The-Manifest-defines-one-versioned-view-of-the-dataset" class="common-anchor-header">Le manifeste définit une vue versionnée du jeu de données</h3><p>Le manifeste définit le jeu de données dans une version donnée. Il répertorie :</p>
<ul>
<li>les groupes de colonnes (ColumnGroups) existants</li>
<li>quelles plages d’identifiants de lignes ils couvrent</li>
<li>le format physique utilisé par chaque ColumnGroup</li>
<li>l'emplacement des fichiers</li>
<li>quels journaux de suppression sont actifs</li>
<li>quelles statistiques sont disponibles</li>
<li>quels index existent</li>
<li>quels blobs externes sont référencés</li>
<li>quelles colonnes et quelles plages de lignes ces statistiques ou ces index couvrent</li>
</ul>
<p>Chaque mise à jour génère une nouvelle version du manifeste. Un lecteur qui ouvre la version N voit une vue stable de l’ensemble de données à la version N. Un rédacteur peut préparer la version N+1 sans perturber les lecteurs qui utilisent encore la version N.</p>
<h3 id="The-Manifest-tracks-more-than-table-files" class="common-anchor-header">Le Manifest ne se limite pas aux fichiers de table</h3><p>Dans Loon, le corps du manifeste est encodé avec Apache Avro et organisé en quatre sections principales.</p>
<ul>
<li>Les ColumnGroups décrivent les colonnes, les formats, les fichiers et les plages d’identifiants de lignes.</li>
<li>Les DeltaLogs décrivent les suppressions. Différents types de suppression couvrent différentes sources de modification, telles que les suppressions par clé primaire provenant des clients, les suppressions positionnelles issues de la compaction interne ou les suppressions par égalité provenant de moteurs externes.</li>
<li>Les « Stats » comprennent des métadonnées de planification telles que les filtres Bloom, les statistiques BM25 et les valeurs minimales/maximales.</li>
<li>Les Indexes décrivent le type d’index, les paramètres, les colonnes couvertes et les plages d’identifiants de lignes. Cela peut inclure des index vectoriels tels que HNSW ou IVF, des index de texte, des index inversés, des index bitmap et des structures associées.</li>
</ul>
<p>C’est en cela que Loon se distingue d’un manifeste de table traditionnel.</p>
<p>Un ensemble de données vectorielles doit suivre non seulement les fichiers de données et les partitions, mais également les index vectoriels, les index de texte, les entités clairsemées, les journaux de suppression, les statistiques, les références à des objets externes et les plages d’identifiants de lignes qui les relient.</p>
<h3 id="The-Manifest-must-be-writable-by-more-than-the-database" class="common-anchor-header">Le manifeste doit pouvoir être modifié par d’autres entités que la base de données</h3><p>L’essentiel ne réside pas seulement dans le contenu du manifeste, mais aussi dans les entités autorisées à le modifier.</p>
<ul>
<li>Si seule la base de données peut écrire le manifeste, celui-ci reste une métadonnée interne. Des métadonnées plus propres, mais qui restent privées à un seul moteur.</li>
<li>Si des moteurs externes peuvent générer de nouveaux ColumnGroups, de nouvelles statistiques et de nouvelles entrées dans le manifeste, celui-ci devient une interface de coordination.</li>
<li>Un job Spark, par exemple, peut remplir a posteriori une colonne de vecteurs clairsemés. Il écrit un nouveau ColumnGroup, enregistre la couverture des lignes et les statistiques, puis valide un nouveau manifeste. Les requêtes en ligne peuvent continuer à lire l’ancienne version pendant l’exécution du job. Une fois la validation réussie, la nouvelle version devient visible.</li>
</ul>
<p>Le principe est similaire à celui d’Iceberg et de Delta Lake, mais le modèle d’objet est plus large. Un ensemble de données vectorielles doit suivre les index vectoriels, les index textuels, les caractéristiques clairsemées, les journaux de suppression, les statistiques, les références aux blobs et les plages d’identifiants de lignes, et pas seulement les fichiers de table et les partitions.</p>
<h3 id="Optimistic-commits-keep-version-updates-simple" class="common-anchor-header">Les validations optimistes simplifient les mises à jour de version</h3><p>Chaque validation écrit une nouvelle version du manifeste. Un rédacteur peut créer du nouveau contenu basé sur la version N, puis tenter de l’écrire <code translate="no">manifest-{N+1}.avro</code>. La sémantique d’écriture conditionnelle ou de correspondance de génération propre au stockage d’objets peut entraîner l’échec de la validation si cette version existe déjà. Le rédacteur peut alors réessayer avec la version la plus récente.</p>
<p>Cela confère à Loon une concurrence optimiste sans obliger chaque mise à jour à passer par un chemin de coordination lourd et fortement cohérent. Sans Manifest, le stockage multiformat et multi-moteur finit par se résumer à des conventions de nommage et à un rapprochement manuel. Cela peut fonctionner pour de petits ensembles de données. Cela ne fonctionne pas pour des données vectorielles à l’échelle du téraoctet.</p>
<p>C’est le manifeste qui transforme des fichiers hétérogènes en un ensemble de données que plusieurs systèmes peuvent lire et mettre à jour en toute sécurité.</p>
<h2 id="What-changes-for-users-when-storage-becomes-versioned" class="common-anchor-header">Quels changements pour les utilisateurs lorsque le stockage passe à un système de gestion des versions ?<button data-href="#What-changes-for-users-when-storage-becomes-versioned" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour les développeurs d’applications, Loon ne doit pas devenir un nouveau fardeau en termes d’API.</p>
<p>Les utilisateurs devraient continuer à travailler avec les concepts Milvus qui leur sont familiers : collections, insertions, recherche et recherche hybride. Ils ne devraient pas avoir à se soucier des fichiers Manifest, des ColumnGroups, des plages d’identifiants de lignes ou de la structure des fichiers lors du développement normal d’une application.</p>
<p>Le changement est sous-jacent. Le stockage prend davantage en compte la manière dont les ensembles de données d’IA évoluent réellement.</p>
<h3 id="Adding-a-new-embedding-should-not-move-the-old-data" class="common-anchor-header">L’ajout d’un nouvel embedding ne devrait pas déplacer les anciennes données</h3><p>Auparavant, l’ajout d’ <code translate="no">embedding_v2</code> à une collection existante nécessitait souvent d’exporter les données, d’entraîner un nouveau modèle, de générer des vecteurs, puis de réimporter ou de mettre à jour en masse la collection via le SDK. Ce processus engendre une charge opérationnelle importante : suivi des versions, réessais en cas d’échec des tâches, reconstruction des index, impact sur la mise à disposition et vérifications de cohérence.</p>
<p><strong>Avec Loon, cela peut se résumer à une évolution du schéma et à un nouveau commit de ColumnGroup.</strong> La nouvelle colonne d’embedding peut être définie comme son propre ColumnGroup physique, alignée sur l’ID de ligne, et rendue visible via le Manifest. L’ancienne colonne de légende, la colonne de métadonnées scalaires et la colonne d’embedding d’origine n’ont pas besoin d’être déplacées.</p>
<h3 id="Backfills-should-not-require-a-client-side-update-loop" class="common-anchor-header">Les mises à jour rétrospectives ne devraient pas nécessiter de boucle de mise à jour côté client</h3><p>De nombreuses mises à jour de données d’IA sont des remplissages rétrospectifs. Une équipe peut ajouter des vecteurs clairsemés lorsque la recherche hybride prend de l’importance. Elle peut ajouter des caractéristiques de reclassement après l’entraînement d’un nouveau modèle. Elle peut corriger des légendes après une révision humaine. Elle peut ajouter des balises de gouvernance après une mise à jour de la politique.</p>
<p>Dans une architecture traditionnelle, ces modifications s’effectuent souvent via des mises à jour du SDK client ou des chemins d’écriture réservés à la base de données, même lorsque les données sont produites par Spark, Ray ou un autre moteur externe.</p>
<p>Avec Loon, les systèmes de calcul externes peuvent produire de nouveaux ColumnGroups et les valider via le Manifest. La base de données n’est plus le seul point d’entrée pour chaque réécriture.</p>
<h3 id="Offline-analysis-should-not-require-another-copy-of-the-truth" class="common-anchor-header">L’analyse hors ligne ne devrait pas nécessiter une autre copie de la source de référence</h3><p>Auparavant, les équipes exportaient souvent une collection en ligne au format Parquet pour une évaluation ou une analyse hors ligne. Cela créait deux versions d’un même ensemble de données : la collection en ligne et la copie d’analyse. Une fois les légendes corrigées, les représentations vectorielles régénérées, les journaux de suppression appliqués ou les index reconstruits, l’équipe devait déterminer quelle copie était à jour.</p>
<p>Avec un modèle de stockage basé sur le Manifest, les moteurs d’analyse peuvent lire la même vue versionnée de l’ensemble de données que le système de service. Ils peuvent projeter uniquement les colonnes dont ils ont besoin, analyser uniquement les plages de lignes pertinentes et travailler sur une version déclarée de l’ensemble de données plutôt que sur un instantané exporté manuellement.</p>
<h3 id="Deletes-and-corrections-should-touch-only-what-changed" class="common-anchor-header">Les suppressions et les corrections ne doivent concerner que ce qui a changé</h3><p>Les suppressions, les corrections de légendes, les rectifications d’étiquettes et les mises à jour de gouvernance font partie du quotidien des ensembles de données d’IA. Elles ne devraient pas obliger chaque colonne de vecteurs longs à suivre le même chemin de réécriture.</p>
<p>Avec Loon, la suppression de journaux peut d’abord être traitée comme une suppression logique. Une compaction ultérieure peut nettoyer les ColumnGroups concernés sans réécrire les données non liées. Si un champ de texte court change, la couche de stockage ne devrait pas avoir à réécrire des centaines de gigaoctets de vecteurs denses simplement parce qu’ils partagent la même ligne logique.</p>
<h3 id="External-engines-become-part-of-the-workflow-not-an-escape-hatch" class="common-anchor-header">Les moteurs externes s’intègrent au flux de travail, ils ne constituent pas une échappatoire</h3><p>Le changement majeur réside dans le fait que les moteurs externes ne sont plus considérés comme des systèmes extérieurs à la base de données vectorielle.</p>
<p>Spark, Ray, les tâches d’évaluation, les systèmes d’étiquetage et les pipelines de gouvernance produisent et modifient déjà une grande partie des données. La couche de stockage doit leur permettre de collaborer autour d’une source unique de vérité plutôt que de procéder constamment à des exportations, des copies et des réimportations.</p>
<p>C’est ce que permet une version de Manifest. Elle offre aux services en ligne, à l’analyse hors ligne, aux tâches de complétion et à la compaction une vue partagée de l’ensemble de données.</p>
<p>Ces éléments peuvent sembler n’être que des détails de stockage interne, mais ils influent sur la rapidité avec laquelle les équipes peuvent itérer sur les ensembles de données d’IA. Chaque modification de modèle, chaque mise à jour de caractéristiques, chaque correction de légende, chaque filtre de qualité et chaque reconstruction d’index repose sur la même question : «<strong>Le système peut-il mettre à jour l’ensemble de données sans déplacer les données qu’il n’a pas besoin de déplacer ? »</strong></p>
<p>C’est là que réside la valeur pratique de ce modèle de stockage.</p>
<h2 id="Loon-is-available-in-Milvus-30-beta-and-Zilliz-Vector-Lakebase" class="common-anchor-header">Loon est disponible dans la version bêta de Milvus 3.0 et dans Zilliz Vector Lakebase<button data-href="#Loon-is-available-in-Milvus-30-beta-and-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>Loon est disponible dans <a href="https://milvus.io/docs/release_notes.md">la version bêta de Milvus 3.0</a> et fait également partie de la couche de stockage de <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Zilliz Vector Lakebase</a>, la prochaine évolution de Zilliz Cloud. Cette version se concentre sur trois domaines clés :</p>
<ul>
<li><strong>Le Manifest.</strong> L’objectif est que les écritures, les remplissages rétrospectifs, les suppressions, les statistiques et les mises à jour d’index produisent des vues versionnées du jeu de données que les lecteurs peuvent ouvrir de manière cohérente. Pour les lecteurs, cela signifie qu’une requête peut ouvrir une version spécifique du Manifest et obtenir une vue stable de l’ensemble de données. Pour les auteurs, cela signifie que les nouveaux fichiers de données, les journaux de suppression, les statistiques ou les fichiers d’index peuvent être préparés au préalable, puis rendus visibles via une validation versionnée.</li>
<li><strong>Prise en charge des ColumnGroup et des formats.</strong> Parquet prend en charge les colonnes scalaires et compatibles avec l’écosystème. Vortex prend en charge les modèles d’accès à forte intensité vectorielle. Lance peut être intégré en mode lecture seule pour assurer la compatibilité avec les ensembles de données Lance existants.</li>
<li><strong>L’index sur Lake.</strong> Les statistiques scalaires, les index de filtrage et les index inversés de texte peuvent participer à la planification basée sur le Manifest par plage de lignes. Les index vectoriels natifs de Lake sont davantage impliqués. HNSW et IVF ont des comportements différents sur le stockage d’objets, et HNSW en particulier est sensible à l’accès aléatoire et à la localité du cache. Il n’est pas possible de simplement réutiliser une structure conçue pour un SSD local et de s’attendre au même résultat.</li>
</ul>
<h3 id="There-is-still-work-ahead" class="common-anchor-header">Il reste encore du travail à accomplir</h3><ul>
<li><strong>Les chemins d’écriture externes</strong> sont importants, car Spark et Ray doivent pouvoir produire des ColumnGroups et des commits de Manifest sans forcer chaque mise à jour à passer par une boucle du SDK client.</li>
<li><strong>L’interopérabilité Lakehouse</strong> est importante car de nombreuses équipes utilisent déjà des catalogues et des moteurs de requêtes tels <strong>qu’Iceberg, Delta Lake, Trino, DuckDB et Athena.</strong> Les données vectorielles devraient pouvoir s’intégrer à cet écosystème sans perte de performances de recherche vectorielle.</li>
<li><strong>La structure des index</strong> est importante car les index de graphes et les structures inversées présentent des modèles d’accès différents sur le stockage d’objets.</li>
<li><strong>La sémantique des objets volumineux</strong> est importante, car les vidéos brutes, les PDF, les images et les fichiers audio nécessitent une gestion des références, un contrôle des versions et un comportement de suppression alignés sur le jeu de données vectoriel dérivé.</li>
</ul>
<p>Le comportement exact de la version, les paramètres par défaut et le chemin de migration doivent suivre <a href="https://docs.zilliz.com/docs/release-notes-2605">les notes de mise à jour</a> correspondantes de Milvus et <a href="https://docs.zilliz.com/docs/release-notes-2605">Zilliz Cloud</a>. L’orientation en matière de stockage est toutefois claire : les bases de données vectorielles ont besoin d’une base versionnée et native du lac de données sous la couche de service.</p>
<h2 id="Try-Loon-under-Zilliz-Vector-Lakebase" class="common-anchor-header">Essayez Loon avec Zilliz Vector Lakebase<button data-href="#Try-Loon-under-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>Si votre infrastructure actuelle sépare la mise à disposition en ligne, l’analyse hors ligne, les réintégrations et les workflows de lac de données externes en différents systèmes, Zilliz Vector Lakebase mérite votre attention. Vous pouvez l’essayer sur <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>. Les nouvelles inscriptions avec une adresse e-mail professionnelle bénéficient de 100 $ de crédits gratuits. N’hésitez pas non plus à <a href="https://zilliz.com/contact-sales">nous contacter pour discuter de</a> votre cas d’utilisation.</p>
<p>Vous pouvez également suivre la <a href="https://milvus.io/docs/release_notes.md">sortie de Milvus 3.0</a> pour voir comment Loon évolue dans le moteur open source.</p>
<p><strong>Zilliz Vector Lakebase rassemble :</strong></p>
<ul>
<li>Une diffusion à plusieurs niveaux pour différents compromis entre performances en temps réel et coûts</li>
<li>Une recherche à la demande pour les charges de travail à grande échelle ou exploratoires, sans calcul en continu</li>
<li>Une recherche dans des lacs de données externes, pour indexer et effectuer des recherches directement sur les données existantes</li>
<li>Une recherche à spectre complet sur les données vectorielles, textuelles, JSON et géospatiales, avec récupération et reclassement hybrides</li>
<li>Un stockage unifié natif du lac de données, basé sur Vortex, un format ouvert conçu pour des lectures aléatoires plus rapides et moins coûteuses sur des données riches en vecteurs</li>
</ul>
