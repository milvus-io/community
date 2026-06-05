---
id: why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md
title: >-
  Pourquoi nous avons créé Loon : un moteur de stockage pour les données d'IA
  qui ne cessent d'évoluer.
author: Ted Xu
date: 2026-6-5
cover: assets.zilliz.com/Chat_GPT_Image_Jun_5_2026_11_35_09_AM_82329865f6.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 3.0, Zilliz Vector Lakebase, vector storage, AI datasets, Vortex'
meta_title: |
  AI Datasets Are Never Done. So We Built Loon.
desc: >-
  Loon est un nouveau moteur de stockage pour Milvus 3.0 et Zilliz Vector
  Lakebase, conçu pour gérer des ensembles de données vectorielles en évolution
  avec ColumnGroups, l'alignement des ID de ligne et Manifests.
origin: >-
  https://zilliz.com/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing
---
<p><em>Ce blog a été publié à l'origine sur zilliz.com et a été republié avec l'autorisation de l'auteur.</em></p>
<h2 id="Key-takeaways" class="common-anchor-header">Points clés<button data-href="#Key-takeaways" class="anchor-icon" translate="no">
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
    </button></h2><p>Il s'agit d'une longue plongée en profondeur dans l'ingénierie. Voici donc les points clés avant d'entrer dans les détails.</p>
<ul>
<li>Les ensembles de données d'IA ne sont pas des tableaux statiques. Les mêmes lignes ne cessent de changer à mesure que les équipes remplacent les modèles d'intégration, ajoutent des vecteurs épars, révisent les légendes, remplissent les étiquettes, reconstruisent les index et effectuent des analyses hors ligne.</li>
<li>Les schémas de stockage traditionnels s'effondrent de trois manières : les longues colonnes de vecteurs rendent les remplissages coûteux, un format de fichier unique ne peut pas servir à la fois les balayages et les lectures ponctuelles, et le stockage dans une base de données privée oblige les pipelines externes à créer des copies supplémentaires de la vérité.</li>
<li>Loon est le nouveau moteur de stockage de Milvus et Zilliz Vector Lakebase. Il s'articule autour de formats de fichiers hybrides, de l'alignement des identifiants de ligne et d'un manifeste qui définit l'état versionné de l'ensemble de données.</li>
<li>L'objectif est de permettre à un seul jeu de données vectorielles de prendre en charge la recherche en ligne, l'analyse hors ligne, les remblais, le compactage et le calcul externe sans avoir à copier, réécrire ou réimporter constamment des données.</li>
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
<p><em>Les bases de données traditionnelles stockent déjà des entiers, des chaînes, du JSON, des blobs et des index. Pourquoi ne pas ajouter un</em> <em>type</em> <code translate="no">_vector_</code> <em>, construire un index ANN à côté et s'arrêter là ?</em></p>
<p>Pour les premières recherches sémantiques, cela fonctionne assez bien. Une colonne de vecteurs et un index peuvent être utilisés pour une démo, une petite application RAG ou une fonction de recherche interne. Le problème apparaît plus tard, lorsque l'ensemble de données commence à se comporter moins comme un tableau et plus comme un système de données d'intelligence artificielle.</p>
<p>Un jeu de données vectorielles de production comporte des lignes, des clés primaires, des champs scalaires et des colonnes interrogeables. En ce sens, il ressemble à une table de base de données. Mais il a aussi l'échelle et la forme de flux de travail d'un lac de données. Elle peut contenir des centaines de millions d'enregistrements. Elle est lue et réécrite à plusieurs reprises par Spark, Ray, DuckDB, les pipelines de formation, les tâches d'évaluation et les systèmes de qualité des données.</p>
<p>Il dépend également du stockage d'objets. Les objets sources sont souvent des vidéos, des images, des PDF, des fichiers audio ou des documents web qui restent dans S3, GCS, OSS ou un autre magasin d'objets. La base de données stocke les références, les métadonnées, les caractéristiques dérivées et les index. Elle ajoute ensuite des éléments que les modèles de stockage traditionnels n'ont pas été conçus pour gérer en tant qu'objets de première classe : encastrements denses, vecteurs épars, légendes, index vectoriels, index textuels, journaux de suppression, statistiques, versions de modèles, versions d'analyseurs, références de blobs externes et relations de version entre tous ces éléments.</p>
<p><strong>C'est là que l'idée d'ajouter une colonne de vecteurs commence à s'effondrer.</strong> La question n'est pas de savoir si une base de données peut stocker des octets vectoriels. De nombreux systèmes le peuvent. La question la plus difficile est de savoir <strong>si le modèle de stockage peut gérer la façon dont les données vectorielles changent, comment elles sont interrogées et comment elles sont partagées à travers la pile de données de l'IA.</strong></p>
<p><strong>C'est pourquoi nous avons créé Loon, le nouveau moteur de stockage pour Milvus et</strong> <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a> <strong>(la prochaine évolution de Zilliz Cloud).</strong></p>
<p>Loon est conçu autour de trois idées :</p>
<ol>
<li>Utiliser différents formats physiques pour différents types de colonnes.</li>
<li>Aligner ces colonnes par le biais d'un espace d'identification de ligne partagé.</li>
<li>Utiliser un manifeste pour définir l'état versionné du jeu de données.</li>
</ol>
<p>Pour comprendre l'importance de ces éléments, commençons par un flux de travail multimodal courant.</p>
<h2 id="A-vector-dataset-is-never-really-finished" class="common-anchor-header">Un jeu de données vectorielles n'est jamais vraiment terminé.<button data-href="#A-vector-dataset-is-never-really-finished" class="anchor-icon" translate="no">
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
    </button></h2><p>Imaginons qu'une équipe d'intelligence artificielle crée un ensemble de données vidéo pour la formation multimodale.</p>
<p>Une longue vidéo est téléchargée vers le stockage d'objets. Un pipeline la découpe en clips en fonction des changements de scène, des limites des plans ou des fenêtres temporelles. Les clips trop longs ou trop courts, flous, dupliqués ou de mauvaise qualité sont éliminés. Les clips restants sont évalués par un modèle esthétique, sous-titrés par un autre modèle, intégrés par un modèle de langage visuel et stockés dans une base de données vectorielle pour la recherche, la déduplication et le filtrage des données d'entraînement.</p>
<p>À première vue, le flux de travail semble simple :</p>
<pre><code translate="no">video
→ clips
→ metadata
→ aesthetic_score
→ caption
→ embedding
→ search / dedup / training data filtering
<button class="copy-code-btn"></button></code></pre>
<p>Mais l'ensemble des données n'arrive pas complètement formé.</p>
<ul>
<li>Au cours de la première semaine, la table peut ne contenir que <code translate="no">clip_id</code>, <code translate="no">video_id</code>, <code translate="no">start_offset</code> et <code translate="no">duration</code>.</li>
<li>Au cours de la deuxième semaine, l'équipe ajoute <code translate="no">aesthetic_score</code>.</li>
<li>Au cours de la troisième semaine, un modèle de sous-titrage est exécuté et chaque clip reçoit un <code translate="no">caption</code>.</li>
<li>Au cours de la quatrième semaine, le premier modèle d'intégration est mis en ligne et chaque clip reçoit une intégration CLIP à 768 dimensions.</li>
<li>Un mois plus tard, l'équipe change de modèle et remplit <code translate="no">embedding_v2</code> avec 1024 dimensions.</li>
<li>Deux mois plus tard, la recherche hybride devient une exigence, et l'équipe ajoute une colonne de vecteurs épars.</li>
<li>Trois mois plus tard, les légendes font l'objet d'un examen humain et doivent être corrigées sur place.</li>
</ul>
<p>L'ensemble de données n'a jamais été achevé. Il n'a cessé d'accumuler de nouvelles interprétations des mêmes lignes sous-jacentes.</p>
<p>C'est l'une des principales différences entre les données vectorielles et les données commerciales traditionnelles. La même ligne est retraitée encore et encore. L'échelle transforme cet inconvénient en problème de stockage : les ensembles de données multimodales ne représentent souvent pas des millions d'enregistrements, mais des centaines de millions, voire des milliards. LAION-5B est une référence utile pour la forme - des milliards de paires image-texte, chacune avec des métadonnées, des légendes et des enchâssements. Le plus difficile n'est donc pas la première insertion. La difficulté réside dans tout ce qui se passe une fois que l'ensemble de données commence à évoluer. <strong>Cette évolution pose trois problèmes.</strong></p>
<h2 id="The-first-problem-long-columns-make-write-amplification-expensive" class="common-anchor-header">Premier problème : les longues colonnes rendent l'amplification de l'écriture coûteuse<button data-href="#The-first-problem-long-columns-make-write-amplification-expensive" class="anchor-icon" translate="no">
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
    </button></h2><p>Les formats en colonnes tels que Parquet sont excellents pour de nombreuses charges de travail analytiques. Ils fonctionnent bien lorsque les schémas sont relativement stables, que les données sont lues plus souvent que réécrites, que les balayages ne concernent qu'un sous-ensemble de colonnes et que la compression est importante. C'est le monde pour lequel de nombreux formats analytiques ont été optimisés.</p>
<h3 id="Vector-rows-are-much-wider-than-analytical-rows" class="common-anchor-header">Les lignes vectorielles sont beaucoup plus larges que les lignes analytiques</h3><p>TPC-H <code translate="no">lineitem</code> est une bonne référence. Il comporte 16 colonnes : des clés entières, des valeurs décimales, des dates, des chaînes courtes et un petit champ de commentaire. Une ligne non compressée représente environ 150 octets. Après compression, elle peut être beaucoup plus petite. Avec un groupe de lignes de 64 Mo, un système de stockage peut contenir des centaines de milliers de lignes dans un seul groupe.</p>
<p><strong>Les ensembles de données vectorielles ne ressemblent pas à cela.</strong></p>
<p>Un ensemble de données image-texte de type LAION est beaucoup plus proche de ce que de nombreux pipelines d'intelligence artificielle produisent aujourd'hui. Chaque ligne contient toujours des métadonnées ordinaires : une URL, une légende, une largeur, une hauteur, des scores de qualité, des étiquettes, etc. Mais une fois l'intégration ajoutée, la forme physique de la ligne change.</p>
<p>Un vecteur CLIP de 768 dimensions prend environ 1,5 Ko en fp16 ou 3 Ko en fp32. Cette colonne peut être beaucoup plus grande qu'une ligne entière de TPC-H <code translate="no">lineitem</code>.</p>
<p>Et les 768 dimensions ne sont pas inhabituelles ou grandes selon les normes actuelles. Une intégration à 1024 ou 2048 dimensions est courante dans les pipelines multimodaux. Le site <code translate="no">text-embedding-3-large</code> d'OpenAI va jusqu'à 3072 dimensions, ce qui représente environ 12 Ko par vecteur en fp32.</p>
<p>La comparaison est frappante :</p>
<table>
<thead>
<tr><th>Forme de l'ensemble de données</th><th>Taille approximative des lignes</th><th>Ce qui domine la ligne</th></tr>
</thead>
<tbody>
<tr><td>Lineitem TPC-H</td><td>~150 octets non compressés</td><td>champs scalaires et chaînes courtes</td></tr>
<tr><td>Ligne de type LAION avec un vecteur fp16 de 768 dimensions</td><td>~1.5 KB+ (EN ANGLAIS)</td><td>intégration</td></tr>
<tr><td>ligne de style LAION avec vecteur fp32 768-dim</td><td>~3 KB+ (EN ANGLAIS)</td><td>intégration</td></tr>
<tr><td>Ligne avec vecteur fp32 3072-dim</td><td>~12 KB+ pour le vecteur seul</td><td>intégration</td></tr>
</tbody>
</table>
<p>Dans de nombreux ensembles de données d'IA, la colonne du vecteur n'est pas un champ comme les autres. Physiquement, elle représente la majeure partie de la ligne. Cela modifie le coût de l'évolution du schéma.</p>
<h3 id="Adding-one-vector-column-can-mean-hundreds-of-gigabytes" class="common-anchor-header">L'ajout d'une colonne vectorielle peut représenter des centaines de gigaoctets.</h3><p>Supposons qu'un ensemble de données contienne 100 millions de clips vidéo. L'ajout d'une nouvelle colonne d'intégration fp32 à 1024 dimensions implique l'écriture d'environ 400 Go de données vectorielles brutes. Ce chiffre n'inclut pas les statistiques, les index, les mises à jour de métadonnées, les frais généraux de stockage d'objets, la validation ou l'intégration des chemins d'accès.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_3_ca3c616b9e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Si l'équipe ajoute une ou deux colonnes vectorielles par mois, telles que <code translate="no">embedding_v2</code>, <code translate="no">sparse_vector</code>, ou les fonctions rerank, l'évolution du schéma devient un travail récurrent d'ingénierie daAta mesuré en centaines de gigaoctets ou en téraoctets.</p>
<h3 id="Small-logical-updates-can-trigger-large-physical-rewrites" class="common-anchor-header">De petites mises à jour logiques peuvent déclencher d'importantes réécritures physiques</h3><p>Les mises à jour sont tout aussi importantes.</p>
<p>Dans les systèmes en colonnes, les anciennes données ne sont généralement pas mises à jour sur place. Un journal de suppression enregistre ce qui a changé, et le compactage réécrit ensuite les lignes vivantes dans de nouveaux fichiers. Ce modèle est gérable lorsque les lignes sont petites.</p>
<p>Avec des données vectorielles, une petite mise à jour logique peut déclencher une réécriture physique importante.</p>
<p>Un travail de révision humain peut ne corriger que quelques centaines d'octets dans une légende. Mais si la légende, le vecteur dense, le vecteur clairsemé et d'autres caractéristiques dérivées partagent le même cycle de vie physique du fichier, le système peut finir par réécrire les vecteurs également. Le changement logique est minime. Les E/S physiques peuvent être énormes.</p>
<p>C'est le problème de l'amplification de l'écriture dans le stockage vectoriel. Ce qui est coûteux, ce n'est pas seulement la taille des vecteurs. En effet, les grands champs dérivés et les petits champs mutables sont souvent liés par une structure de stockage qui les traite comme une seule unité.</p>
<h3 id="For-AI-datasets-backfill-is-a-routine-workload" class="common-anchor-header">Pour les ensembles de données d'IA, le remplissage est une charge de travail de routine</h3><p>Pour les tables analytiques traditionnelles, l'évolution du schéma ne peut se produire qu'occasionnellement. Pour les ensembles de données d'IA, il s'agit d'un travail de routine. Les modèles de légende sont mis à jour. Les modèles d'intégration sont remplacés. Des vecteurs épars sont ajoutés ultérieurement. Des caractéristiques de reclassement apparaissent. Les étiquettes humaines sont corrigées. Les étiquettes de gouvernance sont complétées. Les index sont reconstruits.</p>
<p>Ces opérations ne sont pas de simples ajouts. Elles modifient ou étendent fréquemment les lignes existantes.</p>
<p>C'est pourquoi le stockage vectoriel ne peut pas se contenter d'optimiser le débit de balayage. Il doit également rendre les remplissages et les mises à jour partielles moins coûteux.</p>
<h2 id="The-second-problem-the-same-data-must-support-scans-and-point-reads" class="common-anchor-header">Deuxième problème : les mêmes données doivent supporter les balayages et les lectures ponctuelles<button data-href="#The-second-problem-the-same-data-must-support-scans-and-point-reads" class="anchor-icon" translate="no">
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
    </button></h2><p>Une fois les données écrites, le chemin de lecture se divise. Le même ensemble de données vectorielles présente généralement deux schémas d'accès distincts : le <strong>balayage analytique et les lectures ponctuelles.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_4_cef8d0e3ea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Analytical-workloads-want-wide-compressed-scans" class="common-anchor-header">Les charges de travail analytiques nécessitent des balayages larges et compressés</h3><p>Un pipeline peut exécuter des filtres tels que :</p>
<pre><code translate="no" class="language-sql">WHERE aesthetic_score &gt; 0.8 AND duration &gt; 5
<button class="copy-code-btn"></button></code></pre>
<p>Il peut également effectuer des analyses hors ligne, une évaluation complète de l'intégration, des statistiques BM25, la construction de bitmaps, des contrôles de qualité des données, des comptages et des analyses de groupe.</p>
<p>Ce modèle lit de nombreuses lignes mais seulement quelques colonnes. Il aime les E/S séquentielles, les grands groupes de lignes, la compression, l'élagage des colonnes, le décodage par lots et l'exécution vectorisée.</p>
<p>Les grands groupes de lignes sont utiles ici. Ils permettent à une seule requête d'E/S d'extraire une grande quantité de données utiles, d'améliorer l'efficacité de la compression et de fournir au moteur d'exécution suffisamment de données contiguës pour amortir les frais généraux. Lorsque plusieurs colonnes sont lues ensemble, le fait de les organiser pour le débit de balayage permet également de réduire les erreurs de cache lors de l'exécution vectorielle.</p>
<p>Parquet est très performant dans ce domaine.</p>
<h3 id="ANN-results-need-narrow-row-level-lookups" class="common-anchor-header">Les résultats ANN nécessitent des recherches étroites au niveau des lignes</h3><p>Une fois que la recherche ANN a retourné les identifiants des lignes candidates, le système a souvent besoin de récupérer des champs tels que :</p>
<pre><code translate="no">caption
embedding
rerank feature
video_uri
metadata
<button class="copy-code-btn"></button></code></pre>
<p>Ce modèle lit moins de lignes, souvent des centaines ou des milliers, mais il a besoin d'un accès précis par ID de ligne. Il souhaite localiser une ligne et une colonne spécifiques, récupérer uniquement la plage d'octets requise et éviter d'extraire un groupe de lignes entier juste pour récupérer quelques enregistrements.</p>
<p>La recherche par point a une préférence presque opposée à celle du balayage. Elle souhaite une granularité de lecture plus petite. Idéalement, la couche de stockage peut trouver le segment ou la plage d'octets pertinents par ID de ligne, ne lire que cette plage et ne décoder que les données nécessaires au résultat.</p>
<p>La compression présente également un compromis différent. Pour les balayages, une compression plus importante en vaut souvent la peine, car le système lit beaucoup de données et économise des E/S. Pour la recherche de points, la compression peut devenir un problème pour le système. Pour la consultation de points, la compression peut devenir un handicap si la récupération d'une ligne nécessite le décodage d'un bloc compressé beaucoup plus important.</p>
<h3 id="One-layout-cannot-optimize-for-both-paths" class="common-anchor-header">Une disposition ne peut pas être optimisée pour les deux chemins</h3><p>Il s'agit là du principal conflit. Le filtrage scalaire et l'analytique nécessitent des présentations larges, compressées et faciles à analyser. Les recherches vectorielles veulent des présentations étroites, précises et adressables par ligne.</p>
<p>Un format de fichier unique peut prendre en charge les deux dans une certaine mesure, mais il ne peut pas être optimal pour les deux simultanément.</p>
<p>Si toutes les colonnes vivent dans Parquet, les balayages scalaires sont confortables. Mais la recherche ANN après rappel devient plus difficile. Le système peut n'avoir besoin que de quelques centaines de vecteurs, de légendes ou d'enregistrements de métadonnées, tandis que la couche de stockage peut avoir à lire de grands groupes de lignes qui contiennent principalement des lignes non pertinentes.</p>
<p>Sur un disque SSD local, le cache et le mmap peuvent masquer une partie de ce coût. Une fois que les données sont stockées dans un système de stockage d'objets, le coût devient plus visible. Chaque absence de cache peut devenir une lecture à distance. Si les lignes candidates sont dispersées dans de nombreux groupes de lignes, une seule requête peut déclencher plusieurs lectures, chacune extrayant plus de données que la requête n'en a besoin. Dans une disposition mal conçue, la recherche de 1 000 lignes candidates peut facilement entraîner des dizaines ou des centaines de mégaoctets d'E/S inutiles, voire beaucoup plus dans les cas extrêmes.</p>
<p>La réduction de la taille des groupes de lignes facilite la recherche de points, mais nuit aux balayages. Un trop grand nombre de petits fragments réduit l'efficacité de la compression, augmente la charge de travail des métadonnées et rompt les longues lectures séquentielles dont dépendent les moteurs d'analyse.</p>
<p><strong>Le problème n'est donc pas de trouver une taille de groupe de lignes magique. Le problème est que l'on demande au même ensemble de données de se comporter comme deux systèmes de stockage différents.</strong></p>
<h3 id="Hybrid-search-forces-both-paths-into-one-query" class="common-anchor-header">La recherche hybride force les deux chemins en une seule requête</h3><p>La recherche hybride rend le conflit plus difficile à ignorer. Une requête unique peut d'abord appliquer des filtres scalaires :</p>
<pre><code translate="no" class="language-sql">aesthetic_score &gt; 0.8 AND duration &gt; 5
<button class="copy-code-btn"></button></code></pre>
<p>Elle exécute ensuite la recherche ANN.</p>
<p>Elle récupère ensuite la légende, le vecteur et les métadonnées par ID de ligne.</p>
<p>Pour l'utilisateur, il s'agit d'une seule demande de recherche. Pour la couche de stockage, il s'agit à la fois d'un balayage analytique et d'une recherche aléatoire à faible latence.</p>
<p>C'est pourquoi le stockage vectoriel a besoin de plus qu'un meilleur paramétrage de Parquet. Il a besoin d'un moyen de placer les différentes colonnes en fonction de la façon dont elles sont lues.</p>
<h2 id="The-third-problem-the-dataset-does-not-live-inside-one-engine" class="common-anchor-header">Troisième problème : l'ensemble des données ne se trouve pas dans un seul moteur.<button data-href="#The-third-problem-the-dataset-does-not-live-inside-one-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Les deux premiers problèmes se produisent à l'intérieur de la base de données. Le troisième se produit à la frontière entre les systèmes.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_5_802e6d92c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AI-data-pipelines-span-many-systems" class="common-anchor-header">Les pipelines de données d'IA couvrent de nombreux systèmes</h3><p>Dans le flux de travail vidéo, il se passe très peu de choses dans la base de données vectorielle elle-même.</p>
<p>Les vidéos brutes se trouvent dans le stockage d'objets. La génération de clips peut être exécutée dans Spark ou Ray. La notation esthétique peut être exécutée dans un service GPU. Le sous-titrage peut être exécuté dans un pipeline d'inférence LLM. Les embeddings peuvent être générés par une autre tâche GPU. Les vecteurs épars peuvent provenir d'un service SPLADE. L'évaluation hors ligne, le filtrage des données d'entraînement, l'examen humain et les tâches de gouvernance peuvent tous être exécutés ailleurs.</p>
<p>La base de données vectorielle sert à la recherche en ligne, mais l'ensemble de données est produit, corrigé, évalué et étendu par de nombreux systèmes.</p>
<h3 id="Private-storage-formats-create-multiple-copies-of-the-truth" class="common-anchor-header">Les formats de stockage privés créent plusieurs copies de la vérité</h3><p>Si la base de données utilise un format physique privé qu'elle est la seule à pouvoir lire et écrire, chaque tâche externe nécessite une exportation, une conversion, une copie et une importation. La même collection peut exister dans la base de données, dans un répertoire temporaire Spark, dans une sortie d'évaluation et dans un répertoire local de remplissage. La vraie question devient alors :</p>
<ul>
<li>Quelle copie est la source de vérité ?</li>
<li>Laquelle contient le modèle de légende du mois dernier ?</li>
<li>Quelles lignes ont déjà été corrigées par une révision humaine ?</li>
<li>Quelle colonne de vecteurs épars a été générée par quel modèle ?</li>
<li>Quel indice vectoriel est encore valide après le remplissage ?</li>
<li>À quel objet vidéo original cette ligne fait-elle référence ?</li>
</ul>
<p>À petite échelle, les équipes peuvent parfois survivre avec des conventions de dénomination et des vérifications manuelles. Avec des centaines de millions de lignes et des téraoctets de données intégrées, cela devient un problème de cohérence.</p>
<h3 id="Vector-datasets-need-a-shared-versioned-state" class="common-anchor-header">Les ensembles de données vectorielles ont besoin d'un état versionné partagé</h3><p>Les systèmes Lakehouse ont résolu une version de ce problème pour les données structurées. Iceberg, Delta Lake et Hudi ne se contentent pas de stocker des fichiers. Leur principale contribution consiste à permettre à plusieurs moteurs de se coordonner autour du même état de table.</p>
<p>Les bases de données vectorielles ont désormais besoin d'une capacité similaire, mais l'état est plus complexe. Il doit inclure non seulement les fichiers de table et les partitions, mais aussi les index vectoriels, les index textuels, les caractéristiques éparses, les journaux de suppression, les statistiques, les plages d'ID de ligne et les références à des blobs externes.</p>
<p>La question n'est pas simplement de savoir si Spark peut lire les fichiers Milvus.</p>
<p>La question est la suivante : une fois que Spark a rempli une colonne de vecteurs épars, comment Milvus sait-il à quelle version cette colonne appartient, quelles lignes elle couvre, quel modèle l'a produite et quand les requêtes en ligne peuvent-elles l'utiliser en toute sécurité ?</p>
<p>La réponse se trouve dans le modèle de stockage.</p>
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
    </button></h2><p>Il est tentant de traiter ces problèmes comme trois problèmes d'ingénierie distincts.</p>
<ul>
<li>Amplification de l'écriture ? Ajoutez la mise en lots.</li>
<li>Lecture ponctuelle ? Ajouter un cache.</li>
<li>Systèmes externes ? Ajoutez des outils d'exportation et d'importation.</li>
</ul>
<p>Ces correctifs peuvent aider, mais ils ne règlent pas le problème sous-jacent : un jeu de données vectorielles est physiquement hétérogène.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_6_0744ff4445.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dans l'exemple vidéo, <code translate="no">clip_id</code>, <code translate="no">video_id</code>, <code translate="no">duration</code> et <code translate="no">aesthetic_score</code> sont des champs scalaires courts. Ils sont utiles pour le filtrage et l'analyse.</p>
<ul>
<li><code translate="no">caption</code> est du texte. Il peut être utilisé pour BM25, l'examen, la correction et le remplissage.</li>
<li><code translate="no">embedding</code> est un vecteur long et dense. Il est utilisé pour le rappel ANN et, plus tard, pour la recherche au niveau des lignes ou le reclassement.</li>
<li><code translate="no">embedding_v2</code> est une nouvelle sortie de modèle, souvent remplie longtemps après l'insertion des données d'origine.</li>
<li><code translate="no">sparse_vector</code> La vidéo brute prend en charge la recherche hybride et possède son propre modèle d'accès.</li>
<li>La vidéo brute doit rester dans le stockage d'objets. La base de données doit stocker une référence, une somme de contrôle, un type MIME, une version de l'analyseur et une relation au niveau de la ligne.</li>
<li>Les index vectoriels, les index textuels, les statistiques et les journaux de suppression sont des objets dérivés ayant leur propre sémantique de version.</li>
</ul>
<p>Ces objets partagent une ligne logique, mais ils ne doivent pas tous partager la même disposition physique ou le même cycle de vie.</p>
<ul>
<li>S'ils sont contraints à une disposition de table ordinaire, les mises à jour deviennent coûteuses.</li>
<li>S'ils sont contraints à un format de fichier en colonnes, les lectures de points deviennent coûteuses.</li>
<li>S'ils sont traités comme des fichiers objets sans rapport entre eux, la gestion des versions devient fragile.</li>
</ul>
<p>Le modèle de stockage doit donc partir du fait que l'ensemble de données est hétérogène.</p>
<p><strong>Cela conduit à trois exigences de conception :</strong></p>
<ul>
<li>Premièrement, les différents groupes de colonnes doivent être stockés dans des formats physiques différents.</li>
<li>Deuxièmement, ces groupes de colonnes ont besoin d'un espace d'identification de ligne partagé, de sorte qu'ils puissent toujours se comporter comme une table logique unique.</li>
<li>Troisièmement, l'ensemble de données a besoin d'un manifeste versionné qui déclare quels fichiers, index, journaux, statistiques et références d'objets appartiennent à la vue actuelle.</li>
</ul>
<p><strong>C'est la conception de Loon, notre nouveau moteur de stockage derrière Milvus et Zilliz Cloud.</strong></p>
<h2 id="Loon-a-storage-engine-behind-Milvus-and-Zilliz-Cloud-for-evolving-vector-datasets" class="common-anchor-header">Loon : un moteur de stockage derrière Milvus et Zilliz Cloud pour les ensembles de données vectorielles évolutives<button data-href="#Loon-a-storage-engine-behind-Milvus-and-Zilliz-Cloud-for-evolving-vector-datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour résoudre tous ces problèmes, nous avons créé <strong>Loon</strong>, le nouveau moteur de stockage de Milvus et de <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a> (la prochaine évolution de Zilliz Cloud), conçu pour les ensembles de données vectorielles évolutives.</p>
<p>Le nom suit la tradition des noms d'oiseaux de Zilliz. Un huard est un oiseau plongeur qui vit sur les lacs, ce qui correspond bien à l'objectif du système : une base de données vectorielles ne devrait pas avoir à déplacer, scanner ou réécrire un lac entier de données chaque fois qu'elle exécute une requête, qu'elle remplit une colonne ou qu'elle construit un index. Elle doit d'abord comprendre la version actuelle du jeu de données, y compris ses colonnes, ses index, ses statistiques, ses journaux de suppression et ses références d'objets, puis ne lire que la partie dont elle a réellement besoin.</p>
<p>Les formats de fichiers hybrides, l'alignement des identifiants de ligne et le manifeste ne sont pas trois fonctionnalités distinctes. Elles découlent de la même hypothèse de conception : un ensemble de données vectorielles est intrinsèquement hétérogène.</p>
<h3 id="Three-pieces-one-storage-model" class="common-anchor-header">Trois éléments, un modèle de stockage</h3><p>Les formats de fichier hybrides reconnaissent que les différentes colonnes ont des modèles d'accès différents. Les champs scalaires conviennent aux balayages et aux filtres. Les champs vectoriels nécessitent une recherche efficace au niveau des lignes. Les objets bruts tels que les vidéos, les PDF, les images et les fichiers audio ont leur place dans le stockage d'objets, et non dans les fichiers de données des bases de données.</p>
<p>L'alignement des ID de ligne reconnaît que ces colonnes peuvent être physiquement séparées, mais qu'elles décrivent toujours les mêmes lignes logiques. Une légende, une intégration, un vecteur clairsemé et une URI vidéo peuvent résider dans des fichiers et des formats différents, mais ils doivent tout de même être rassemblés en un seul résultat.</p>
<p>Le manifeste reconnaît que l'ensemble de données n'est pas écrit une fois pour toutes. Il sera modifié par de multiples systèmes, à travers de multiples versions, pour de multiples tâches. Les index, les statistiques, les journaux de suppression, les références d'objets externes et les groupes de colonnes doivent tous apparaître dans la même vue versionnée.</p>
<p><strong>C'est pourquoi Loon n'est pas seulement un format de fichier vectoriel plus rapide.</strong> Un format plus rapide facilite la recherche de points, mais ne résout pas l'évolution du schéma ou la coordination entre plusieurs moteurs. L'alignement des identifiants de ligne permet aux colonnes divisées de se comporter comme une table unique, mais il ne précise pas quels fichiers appartiennent à la version actuelle. Un manifeste peut décrire l'état d'un ensemble de données, mais sans les groupes de colonnes et l'alignement des ID de lignes, il ne peut pas représenter proprement différentes dispositions physiques à l'intérieur d'une collection logique.</p>
<p>Le modèle de stockage a besoin de ces trois éléments : des formats différents pour des groupes de colonnes différents, un espace d'identification de ligne partagé pour reconstruire les lignes et un manifeste versionné qui indique à chaque lecteur et à chaque auteur quel est l'état actuel du jeu de données.</p>
<h3 id="Where-Loon-fits-in-Milvus-and-Zilliz-Vector-Lakebase" class="common-anchor-header">La place de Loon dans Milvus et Zilliz Vector Lakebase</h3><p>Dans Milvus, il remplace l'ancienne couche de stockage des segments binlogs par un modèle construit autour des abstractions Manifest, ColumnGroup, du format de fichier et du système de fichiers. Dans <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lake</strong></a> base (la prochaine évolution de Zilliz Cloud)<strong>,</strong> la même orientation s'applique à l'architecture de Vector Lakebase : maintenir la rapidité du chemin de service de la base de données vectorielle tout en facilitant l'évolution, l'analyse et la coordination des données sous-jacentes avec des systèmes externes.</p>
<p>Les composants Milvus de niveau supérieur conservent leurs rôles habituels. Le proxy gère le routage. QueryCoord et DataCoord gèrent l'ordonnancement. IndexNode crée des index. Les API orientées application pour les collections, les insertions, les recherches et les recherches hybrides n'ont pas besoin d'exposer les fichiers Manifest ou les ColumnGroups.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_7_d4d1a34604.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Le changement est sous-jacent.</p>
<p>DataNode, QueryNode, segcore, compaction et connecteurs externes peuvent fonctionner à travers la même abstraction de stockage. C'est important parce que l'ensemble de données n'est plus écrit et lu uniquement par la base de données. Il peut être étendu par des systèmes informatiques externes et consommé simultanément par la recherche en ligne.</p>
<p>À un niveau élevé, les couches se présentent comme suit :</p>
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
<p>Le Manifest décrit l'état versionné de l'ensemble de données. Les groupes de colonnes (ColumnGroups) transforment une collection logique en groupes physiques de colonnes. La couche de format de fichier permet à chaque ColumnGroup de choisir un format approprié. L'abstraction du système de fichiers fonctionne pour le stockage d'objets et le stockage local.</p>
<p>Le point important est que les formats de fichiers hybrides, l'alignement des ID de ligne et le Manifeste ne sont pas des fonctionnalités distinctes. Ensemble, ils définissent le modèle de stockage.</p>
<p>Une fois ce modèle en place, nous pouvons examiner les trois choix de conception un par un : comment Loon stocke les différents ColumnGroups, comment il les aligne à nouveau en lignes et comment le Manifest transforme ces fichiers en un ensemble de données versionné.</p>
<h2 id="Design-1-use-the-right-file-format-for-the-right-column-group" class="common-anchor-header">Conception 1 : utiliser le bon format de fichier pour le bon groupe de colonnes<button data-href="#Design-1-use-the-right-file-format-for-the-right-column-group" class="anchor-icon" translate="no">
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
    </button></h2><p>Des colonnes différentes ont des schémas d'accès différents. Elles ne doivent pas être forcées à utiliser le même format de fichier.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_9_c262865944.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Loon-separates-a-logical-collection-into-ColumnGroups" class="common-anchor-header">Loon sépare une collection logique en groupes de colonnes.</h3><ul>
<li>Les champs scalaires, les champs de filtrage, les clés de gestion et les champs statistiques sont souvent analysés, filtrés, agrégés ou utilisés pour la planification des requêtes. Ils bénéficient de la compression, de l'élagage des colonnes et de la compatibilité avec l'écosystème. Parquet est bien adapté à ces colonnes.</li>
<li>Les vecteurs denses, les vecteurs clairsemés et les caractéristiques de rerank sont souvent lus après le rappel ANN par ID de ligne. Ils nécessitent un accès aléatoire à faible latence, des lectures précises par plage d'octets et un décodage sélectif. Une disposition axée sur les segments est mieux adaptée. Loon utilise Vortex dans ce sens.</li>
<li>Les objets bruts tels que les vidéos, les PDF, les images et les fichiers audio ne doivent pas être intégrés dans les fichiers de données de la base de données vectorielle. Ils doivent rester dans le stockage d'objets. La base de données enregistre les références, les sommes de contrôle, les types MIME, les versions de l'analyseur et les relations au niveau des lignes.</li>
</ul>
<p>Pour l'exemple de la vidéo, la mise en page physique pourrait ressembler à ceci :</p>
<pre><code translate="no"><span class="hljs-title class_">Parquet</span> <span class="hljs-title class_">ColumnGroup</span>:
clip_id / video_id / start_offset / duration / aesthetic_score / caption

<span class="hljs-title class_">Vortex</span> <span class="hljs-title class_">ColumnGroups</span>:
embedding
embedding_v2
sparse_vector

<span class="hljs-title class_">Object</span> <span class="hljs-attr">storage</span>:
raw video objects
<button class="copy-code-btn"></button></code></pre>
<p>Pour l'application, il s'agit toujours d'une seule collection. Pour la couche de stockage, les différentes parties de cette collection utilisent des formats physiques différents. Cela permet de réduire directement les réécritures inutiles. L'ajout de <code translate="no">embedding_v2</code> peut devenir un nouveau vecteur ColumnGroup plus un commit Manifest. Il n'est pas nécessaire de réécrire la colonne de légende, les métadonnées scalaires ou la colonne d'intégration existante.</p>
<p>La même idée s'applique aux vecteurs épars, aux caractéristiques de rerank ou à d'autres champs dérivés. Si une nouvelle colonne peut être physiquement indépendante et alignée par ID de ligne, elle n'a pas besoin de faire passer des colonnes non apparentées par le même chemin de réécriture.</p>
<h3 id="Loon-also-adapts-the-use-of-file-formats" class="common-anchor-header">Loon adapte également l'utilisation des formats de fichiers.</h3><p><strong>Pour Parquet, les paramètres par défaut ne sont pas toujours idéaux pour les données vectorielles.</strong> Un groupe de lignes de 64 Mo peut être trop important pour la recherche de points, car une petite lecture aléatoire peut extraire beaucoup plus de données que nécessaire. Loon limite les groupes de lignes à 1 Mo dans les chemins pertinents et désactive les encodages, tels que l'encodage de dictionnaire sur les colonnes de vecteurs, lorsqu'ils n'aident pas les données vectorielles d'apparence aléatoire.</p>
<p><strong>Pour Vortex, le travail le plus important est la disposition.</strong> Loon utilise une disposition qui équilibre l'efficacité du balayage et la recherche de points. Au sein d'un groupe de lignes, les segments de colonnes apparentées peuvent être placés à proximité les uns des autres pour faciliter le balayage. Pour effectuer des opérations, les lectures de sous-segments permettent au système de ne récupérer que les octets pertinents plutôt que d'extraire un segment entier.</p>
<p><strong>Loon prend également en charge l'intégration de Lance en lecture seule</strong>, de sorte que les ensembles de données Lance existants peuvent être montés en tant que ColumnGroups lorsque la compatibilité est importante.</p>
<h3 id="What-the-benchmark-shows" class="common-anchor-header">Ce que montre le test de référence</h3><p>Lors d'un test local, avec un seul fichier de 40 000 lignes et le schéma <code translate="no">{id: int64, name: utf8, value: float64, vector: list&lt;float32&gt;[128]}</code>, Vortex a obtenu les résultats suivants contre Parquet avec des groupes de lignes de 1 Mo :</p>
<table>
<thead>
<tr><th>Opération</th><th>Vortex</th><th>Parquet</th><th>Différence</th></tr>
</thead>
<tbody>
<tr><td>Prise, K=1000 lignes aléatoires</td><td>5,8 ms</td><td>144 ms</td><td>25x plus rapide</td></tr>
<tr><td>Balayage vectoriel complet des colonnes</td><td>21 ms</td><td>142 ms</td><td>6,76 fois plus rapide</td></tr>
<tr><td>Taille du fichier, ~21 Mo de données brutes</td><td>6,62 MO</td><td>7,16 MO</td><td>7% plus petit</td></tr>
</tbody>
</table>
<p>Le résultat de <code translate="no">take</code> provient de la réduction de la quantité de données non pertinentes qui doivent être lues et décodées. Le résultat du balayage provient des choix de compression et de mise en œuvre.</p>
<p>Ces chiffres devraient rester attachés à leur configuration : 8 vCPU Ubuntu 22.04 KVM, système de fichiers local, un fichier, 40 000 lignes, groupes de lignes de 1 Mo, et le schéma ci-dessus. Sur le stockage objet, les E/S réseau peuvent dominer, de sorte que la réduction de l'amplification de la lecture peut avoir une importance encore plus grande. Les résultats réels dépendent de la forme de l'ensemble de données, du comportement du stockage objet, de l'état du cache et du modèle de requête.</p>
<p>L'idée générale n'est pas que chaque colonne devrait utiliser Vortex.</p>
<p>L'idée est que les ensembles de données vectorielles ont besoin d'un choix de format de fichier au niveau du groupe de colonnes (ColumnGroup).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_11_127c1953e6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Design-2-align-physical-files-through-row-IDs" class="common-anchor-header">Conception 2 : aligner les fichiers physiques par le biais des identifiants de ligne<button data-href="#Design-2-align-physical-files-through-row-IDs" class="anchor-icon" translate="no">
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
    </button></h2><p>Les formats de fichier hybrides résolvent un problème : les différentes colonnes peuvent désormais vivre dans les formats qui leur conviennent le mieux.</p>
<p>Mais cela crée un second problème. Si les champs scalaires vivent dans Parquet, les vecteurs dans Vortex et les objets bruts dans le stockage d'objets, comment le système peut-il continuer à les traiter comme une seule collection ?</p>
<p><strong>Loon résout ce problème grâce à l'alignement de l'ID de ligne.</strong></p>
<h3 id="Row-ID-is-the-storage-layer-coordinate-system" class="common-anchor-header">L'ID de ligne est le système de coordonnées de la couche de stockage</h3><p>Chaque ColumnGroupFile physique enregistre le chemin d'accès au fichier et la plage d'ID de ligne qu'il couvre :</p>
<pre><code translate="no">path
start_index
end_index
<button class="copy-code-btn"></button></code></pre>
<p>Différents ColumnGroups peuvent couvrir le même espace d'ID de ligne même s'ils se trouvent dans des fichiers et des formats différents.</p>
<p>Pour l'ID de ligne <code translate="no">12345</code>, les métadonnées scalaires peuvent se trouver dans un groupe de colonnes Parquet, l'intégration peut se trouver dans un groupe de colonnes Vortex et la vidéo brute peut être représentée par une référence de stockage d'objets. Logiquement, il s'agit toujours d'une seule ligne. La couche de stockage dispose ainsi d'un système de coordonnées stable.</p>
<p>L'ID de ligne n'est pas la clé primaire de l'entreprise. C'est le système de coordonnées de la couche de stockage qui permet à Loon de diviser physiquement une collection sans perdre la possibilité de la reconstruire logiquement.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_12_3da04acdec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="New-columns-do-not-have-to-rewrite-old-columns" class="common-anchor-header">Les nouvelles colonnes n'ont pas besoin de réécrire les anciennes colonnes</h3><p>L'ajout de <code translate="no">embedding_v2</code> ne nécessite pas la réécriture de la légende originale, des métadonnées ou de <code translate="no">embedding_v1</code> ColumnGroups. Loon peut écrire un nouveau ColumnGroup vectoriel, enregistrer la plage d'ID de ligne qu'il couvre et valider cette modification par le biais du Manifest.</p>
<p>Il en va de même pour les vecteurs épars, les caractéristiques de reclassement ou d'autres champs dérivés qui arrivent ultérieurement.</p>
<p>Tant que le nouveau ColumnGroup couvre la bonne plage d'ID de ligne, il peut rejoindre la même collection logique sans forcer le déplacement de données non liées.</p>
<h3 id="Deletes-and-compaction-can-be-more-targeted" class="common-anchor-header">Les suppressions et le compactage peuvent être plus ciblés</h3><p>L'alignement des ID de ligne est également utile pour les suppressions.</p>
<p>Une suppression peut d'abord être exprimée par un journal de suppression. La ligne devient invisible au niveau logique, tandis que le nettoyage physique est retardé jusqu'au compactage. Lorsque le compactage s'exécute, il n'est pas toujours nécessaire de réécrire chaque ColumnGroup lié aux lignes affectées. Il peut se concentrer sur les ColumnGroups qui ont besoin d'être nettoyés.</p>
<p>Ceci est important car toutes les colonnes n'ont pas le même profil de coût. La réécriture d'un groupe de colonnes scalaire court est très différente de la réécriture de centaines de gigaoctets de vecteurs denses.</p>
<h3 id="Hybrid-search-can-fetch-only-the-columns-it-needs" class="common-anchor-header">La recherche hybride ne peut récupérer que les colonnes dont elle a besoin</h3><p>L'alignement des identifiants de ligne est également ce qui rend la recherche hybride pratique en plus des formats de fichiers hybrides.</p>
<p>Une fois que la recherche ANN a renvoyé les ID de ligne candidats, le système peut récupérer uniquement les champs nécessaires au résultat final : légendes, métadonnées, vecteurs, caractéristiques de classement ou références d'objets.</p>
<p>Par exemple, une requête peut avoir besoin de.. :</p>
<pre><code translate="no">caption
embedding
video_uri
<button class="copy-code-btn"></button></code></pre>
<p>Ces champs peuvent se trouver dans différents groupes de colonnes. Loon peut localiser les fichiers pertinents par plage d'ID de ligne, lire les plages d'octets nécessaires et assembler le résultat.</p>
<p>Sans l'alignement des ID de ligne, les formats hybrides ne seraient que des fichiers distincts placés côte à côte. Avec l'alignement des ID de ligne, ils se comportent comme une collection logique unique.</p>
<h3 id="Packed-Reader-hides-the-split-from-the-upper-layer" class="common-anchor-header">Packed Reader cache la séparation à la couche supérieure</h3><p>Le composant d'exécution qui rend cela utilisable est le Packed Reader.</p>
<p>La couche supérieure voit un flux Arrow RecordBatch unifié. En dessous, les données peuvent provenir de plusieurs ColumnGroups dans différents formats de fichiers. Le Packed Reader masque ces différences, aligne les données par plages d'ID de ligne et planifie des E/S multi-fichiers avec une utilisation contrôlée de la mémoire.</p>
<p>Il prend également en charge <code translate="no">take</code> directement par ID de ligne. Étant donné un ensemble d'ID de ligne, il localise les ColumnGroupFiles pertinents, effectue des lectures de plage et renvoie les champs demandés.</p>
<p>Pour le flux de travail vidéo, une requête ANN peut nécessiter <code translate="no">caption</code>, <code translate="no">embedding</code>, et <code translate="no">video_uri</code>. Le Packed Reader peut récupérer le groupe de colonnes scalaire et le groupe de colonnes vectoriel sans toucher aux colonnes non liées.</p>
<p>C'est la différence entre "des fichiers séparés" et "une table avec plusieurs dispositions physiques".</p>
<h2 id="Design-3-make-the-Manifest-the-source-of-truth" class="common-anchor-header">Conception 3 : faire du manifeste la source de vérité<button data-href="#Design-3-make-the-Manifest-the-source-of-truth" class="anchor-icon" translate="no">
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
    </button></h2><p>Les formats de fichiers hybrides définissent la manière dont les données sont physiquement stockées. L'alignement des ID de ligne détermine comment les groupes de colonnes séparés forment toujours une table logique unique. Mais le système doit encore répondre à une question plus large : <strong>quels fichiers, journaux, statistiques, index et références d'objets appartiennent à la version actuelle de l'ensemble de données ? C'est le rôle du manifeste.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_13_cd18b2da18.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Object-storage-directories-are-not-enough" class="common-anchor-header">Les répertoires de stockage d'objets ne suffisent pas</h3><p>Le stockage d'objets n'est pas un catalogue de base de données. Un répertoire peut contenir d'anciens fichiers, de nouveaux fichiers, des résultats de travaux ayant échoué, des fichiers temporaires, des journaux de suppression, des fichiers encore référencés par d'anciens instantanés et des fichiers en attente de nettoyage. Le fait qu'un fichier existe ne signifie pas qu'il appartient à la version actuelle du jeu de données.</p>
<p>Un jeu de données Loon peut être organisé en répertoires tels que :</p>
<pre><code translate="no">_metadata/
_data/
_delta/
_stats/
_index/
<button class="copy-code-btn"></button></code></pre>
<p>Mais la structure des répertoires n'est pas la source de la vérité. Le Manifeste l'est. Les lecteurs ne doivent pas énumérer les répertoires et déduire l'état des fichiers qui s'y trouvent. Ils doivent lire le Manifeste actuel et suivre la vue versionnée qu'il déclare.</p>
<h3 id="The-Manifest-defines-one-versioned-view-of-the-dataset" class="common-anchor-header">Le Manifeste définit une vue versionnée de l'ensemble de données</h3><p>Le Manifest définit le jeu de données dans une version donnée. Il enregistre</p>
<ul>
<li>les ColumnGroups existants</li>
<li>les plages d'ID de ligne qu'ils couvrent</li>
<li>le format physique utilisé par chaque groupe de colonnes</li>
<li>l'emplacement des fichiers</li>
<li>quels journaux de suppression sont actifs</li>
<li>les statistiques disponibles</li>
<li>les index existants</li>
<li>les blobs externes référencés</li>
<li>les colonnes et les lignes couvertes par les statistiques ou les index.</li>
</ul>
<p>Chaque mise à jour écrit une nouvelle version du manifeste. Un lecteur qui ouvre la version N voit une vue stable de l'ensemble de données à la version N. Un rédacteur peut préparer la version N+1 sans perturber les lecteurs qui utilisent toujours la version N.</p>
<h3 id="The-Manifest-tracks-more-than-table-files" class="common-anchor-header">Le Manifest ne suit pas que les fichiers de table</h3><p>Dans Loon, le corps du manifeste est encodé avec Apache Avro et organisé autour de quatre sections principales.</p>
<ul>
<li>ColumnGroups décrit les colonnes, les formats, les fichiers et les plages d'ID de ligne.</li>
<li>DeltaLogs décrit les suppressions. Différents types de suppressions couvrent différentes sources de changement, telles que les suppressions de clés primaires des clients, les suppressions positionnelles de la compaction interne, ou les suppressions d'égalité des moteurs externes.</li>
<li>Les statistiques comprennent des métadonnées de planification telles que les filtres Bloom, les statistiques BM25 et les valeurs min/max.</li>
<li>Les index décrivent le type d'index, les paramètres, les colonnes couvertes et les plages d'ID de ligne. Il peut s'agir d'index vectoriels tels que HNSW ou IVF, d'index textuels, d'index inversés, d'index bitmap et de structures connexes.</li>
</ul>
<p>C'est là que Loon diffère d'un manifeste de table traditionnel.</p>
<p>Un jeu de données vectorielles ne doit pas seulement suivre les fichiers de données et les partitions. Il doit également suivre les index vectoriels, les index textuels, les caractéristiques éparses, les journaux de suppression, les statistiques, les références d'objets externes et les plages d'ID de ligne qui les relient.</p>
<h3 id="The-Manifest-must-be-writable-by-more-than-the-database" class="common-anchor-header">Le manifeste doit être accessible en écriture à d'autres personnes que la base de données.</h3><p>Le plus important n'est pas seulement le contenu du manifeste. Il s'agit de savoir qui peut l'écrire.</p>
<ul>
<li>Si seule la base de données peut écrire le manifeste, celui-ci reste une métadonnée interne. Des métadonnées plus propres, mais toujours privées à un seul moteur.</li>
<li>Si des moteurs externes peuvent générer de nouveaux ColumnGroups, stats et entrées Manifest, le Manifest devient une interface de coordination.</li>
<li>Un job Spark, par exemple, peut remplir une colonne de vecteurs épars. Il écrit un nouveau ColumnGroup, enregistre la couverture des lignes et les statistiques, et valide un nouveau Manifest. Les requêtes en ligne peuvent continuer à lire l'ancienne version pendant le travail. Une fois la validation réussie, la nouvelle version devient visible.</li>
</ul>
<p>L'esprit est similaire à celui d'Iceberg et de Delta Lake, mais le modèle d'objet est plus large. Un jeu de données vectorielles doit suivre les index vectoriels, les index textuels, les caractéristiques éparses, les journaux de suppression, les statistiques, les références aux blobs et les plages d'ID de ligne, et pas seulement les fichiers de table et les partitions.</p>
<h3 id="Optimistic-commits-keep-version-updates-simple" class="common-anchor-header">Les livraisons optimistes simplifient les mises à jour de version</h3><p>Chaque validation écrit une nouvelle version de Manifest. Un rédacteur peut créer un nouveau contenu basé sur la version N, puis tenter d'écrire <code translate="no">manifest-{N+1}.avro</code>. La sémantique d'écriture conditionnelle du stockage d'objets ou de correspondance des générations peut faire échouer la validation si cette version existe déjà. Le rédacteur peut alors réessayer avec la version la plus récente.</p>
<p>Loon bénéficie ainsi d'une concurrence optimiste sans obliger chaque mise à jour à passer par un chemin de coordination lourd et fortement cohérent. Sans manifeste, le stockage multiformat et multi-moteur se résume finalement à des conventions de dénomination et à une réconciliation manuelle. Cela peut fonctionner pour de petits ensembles de données. Cela ne fonctionne pas pour des données vectorielles à l'échelle du téraoctet.</p>
<p>Le manifeste est ce qui transforme des fichiers hétérogènes en un ensemble de données que plusieurs systèmes peuvent lire et mettre à jour en toute sécurité.</p>
<h2 id="What-changes-for-users-when-storage-becomes-versioned" class="common-anchor-header">Ce qui change pour les utilisateurs lorsque le stockage devient versionné<button data-href="#What-changes-for-users-when-storage-becomes-versioned" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour les développeurs d'applications, Loon ne devrait pas devenir une nouvelle charge d'API.</p>
<p>Les utilisateurs doivent continuer à travailler avec les concepts familiers de Milvus : collections, insertions, recherche et recherche hybride. Ils ne devraient pas avoir besoin de penser aux fichiers Manifest, aux ColumnGroups, aux plages d'ID de ligne ou à la disposition des fichiers pendant le développement normal de l'application.</p>
<p>Le changement est sous-jacent. Le stockage devient plus conscient de la façon dont les ensembles de données d'IA évoluent réellement.</p>
<h3 id="Adding-a-new-embedding-should-not-move-the-old-data" class="common-anchor-header">L'ajout d'une nouvelle intégration ne doit pas déplacer les anciennes données</h3><p>Auparavant, l'ajout de <code translate="no">embedding_v2</code> à une collection existante nécessitait souvent d'exporter les données, d'entraîner un nouveau modèle, de générer des vecteurs, puis de réimporter ou de mettre à jour la collection via le SDK. Ce processus génère beaucoup de travail opérationnel : suivi des versions, tentatives d'échec des tâches, reconstructions d'index, impact sur le service et vérifications de la cohérence.</p>
<p><strong>Avec Loon, il suffit d'une évolution du schéma et d'un nouveau commit ColumnGroup.</strong> La nouvelle colonne d'intégration peut être écrite comme son propre ColumnGroup physique, alignée par l'ID de la ligne, et rendue visible par le Manifeste. L'ancienne colonne de légende, la colonne de métadonnées scalaires et la colonne d'intégration originale n'ont pas besoin d'être déplacées.</p>
<h3 id="Backfills-should-not-require-a-client-side-update-loop" class="common-anchor-header">Les remplissages ne devraient pas nécessiter de boucle de mise à jour côté client</h3><p>De nombreuses mises à jour de données d'IA sont des remplissages. Une équipe peut ajouter des vecteurs épars lorsque la recherche hybride devient importante. Elle peut ajouter des caractéristiques de reclassement après l'apprentissage d'un nouveau modèle. Elle peut corriger les légendes après une révision humaine. Elle peut ajouter des balises de gouvernance après une mise à jour de la politique.</p>
<p>Dans un schéma traditionnel, ces changements se produisent souvent via des mises à jour du SDK client ou des chemins d'écriture réservés à la base de données, même lorsque les données sont produites par Spark, Ray ou un autre moteur externe.</p>
<p>Avec Loon, les systèmes de calcul externes peuvent produire de nouveaux ColumnGroups et les valider via le Manifest. La base de données ne doit plus être le seul point d'entrée pour chaque réécriture.</p>
<h3 id="Offline-analysis-should-not-require-another-copy-of-the-truth" class="common-anchor-header">L'analyse hors ligne ne devrait pas nécessiter une autre copie de la vérité</h3><p>Auparavant, les équipes déversaient souvent une collection en ligne dans Parquet pour une évaluation ou une analyse hors ligne. Cela créait deux versions du même ensemble de données : la collection en ligne et la copie d'analyse. Une fois que les légendes sont corrigées, que les embeddings sont régénérés, que les logs de suppression sont appliqués ou que les index sont reconstruits, l'équipe doit se demander quelle est la copie la plus récente.</p>
<p>Avec un modèle de stockage basé sur les manifestes, les moteurs d'analyse peuvent lire la même vue versionnée du jeu de données que le système de distribution. Ils peuvent projeter uniquement les colonnes dont ils ont besoin, analyser uniquement les plages de lignes pertinentes et travailler sur une version déclarée du jeu de données au lieu d'un instantané exporté manuellement.</p>
<h3 id="Deletes-and-corrections-should-touch-only-what-changed" class="common-anchor-header">Les suppressions et les corrections ne doivent concerner que ce qui a été modifié</h3><p>Les suppressions, les corrections de légendes, les corrections d'étiquettes et les mises à jour de gouvernance sont monnaie courante dans les ensembles de données d'IA. Elles ne doivent pas contraindre chaque longue colonne vectorielle à suivre le même chemin de réécriture.</p>
<p>Avec Loon, la suppression des journaux peut d'abord être traitée comme une suppression logique. Le compactage ultérieur peut nettoyer les groupes de colonnes concernés sans réécrire les données non liées. Si un champ de texte court est modifié, la couche de stockage ne devrait pas avoir à réécrire des centaines de gigaoctets de vecteurs denses simplement parce qu'ils partagent la même ligne logique.</p>
<h3 id="External-engines-become-part-of-the-workflow-not-an-escape-hatch" class="common-anchor-header">Les moteurs externes font partie du flux de travail et ne sont plus une échappatoire</h3><p>Le changement le plus important est que les moteurs externes ne sont plus traités comme des systèmes extérieurs à la base de données vectorielles.</p>
<p>Spark, Ray, les tâches d'évaluation, les systèmes d'étiquetage et les pipelines de gouvernance produisent et modifient déjà une grande partie des données. La couche de stockage devrait leur permettre de collaborer autour d'une source unique de vérité plutôt que d'exporter, de copier et de réimporter en permanence.</p>
<p>C'est ce que permet une version de Manifest. Elle donne au service en ligne, à l'analyse hors ligne, aux tâches de remplissage et au compactage une vue partagée de l'ensemble de données.</p>
<p>Cela peut sembler être des détails de stockage interne, mais ils affectent la rapidité avec laquelle les équipes peuvent itérer sur les ensembles de données d'IA. Chaque modification de modèle, remplissage de fonctionnalités, correction de légende, filtre de qualité et reconstruction d'index dépend de la même question : &quot;<strong>Le système peut-il mettre à jour l'ensemble de données sans déplacer des données qu'il n'a pas besoin de déplacer ? &quot;</strong></p>
<p>Telle est la valeur pratique du modèle de stockage.</p>
<h2 id="Loon-is-available-in-Milvus-30-beta-and-Zilliz-Vector-Lakebase" class="common-anchor-header">Loon est disponible dans Milvus 3.0 beta et Zilliz Vector Lakebase.<button data-href="#Loon-is-available-in-Milvus-30-beta-and-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>Loon est disponible dans <a href="https://milvus.io/docs/release_notes.md">Milvus 3.0 beta</a> et fait également partie de la couche de stockage de <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Zilliz Vector Lakebase</a>, la prochaine évolution de Zilliz Cloud. Cette version se concentre sur trois domaines essentiels :</p>
<ul>
<li><strong>Le manifeste.</strong> L'objectif est que les écritures, les remplissages, les suppressions, les statistiques et les mises à jour d'index produisent des vues de jeux de données versionnées que les lecteurs peuvent ouvrir de manière cohérente. Pour les lecteurs, cela signifie qu'une requête peut ouvrir une version spécifique du Manifeste et voir une vue stable du jeu de données. Pour les rédacteurs, cela signifie que les nouveaux fichiers de données, les journaux de suppression, les statistiques ou les fichiers d'index peuvent être préparés d'abord, puis rendus visibles par un commit versionné.</li>
<li><strong>La prise en charge du ColumnGroup et du format.</strong> Parquet prend en charge les colonnes scalaires et adaptées à l'écosystème. Vortex prend en charge les modèles d'accès à forte composante vectorielle. Lance peut être intégré en mode lecture seule pour assurer la compatibilité avec les ensembles de données Lance existants.</li>
<li><strong>L'index sur le lac.</strong> Les statistiques scalaires, les index filtrants et les index textuels inversés peuvent participer à la planification basée sur le manifeste par plage de lignes. Les index vectoriels natifs du lac sont plus impliqués. HNSW et IVF ont un comportement différent sur le stockage d'objets, et HNSW en particulier est sensible à l'accès aléatoire et à la localité du cache. Il ne peut pas simplement réutiliser une disposition conçue pour un disque SSD local et s'attendre au même résultat.</li>
</ul>
<h3 id="There-is-still-work-ahead" class="common-anchor-header">Il reste du travail à faire</h3><ul>
<li>Les<strong>chemins d'écriture externes</strong> sont importants car Spark et Ray devraient être capables de produire des ColumnGroups et des Manifest commits sans forcer chaque backfill à travers une boucle SDK client.</li>
<li>L'<strong>interopérabilité Lakehouse</strong> est importante car de nombreuses équipes utilisent déjà des catalogues et des moteurs de requête tels que <strong>Iceberg, Delta Lake, Trino, DuckDB et Athena.</strong> Les données vectorielles doivent pouvoir participer à cet écosystème sans perdre les performances de la recherche vectorielle.</li>
<li>La<strong>disposition de l'index</strong> est importante car les index graphiques et les structures inversées ont des schémas d'accès différents sur le stockage d'objets.</li>
<li>La<strong>sémantique des grands objets</strong> est importante car les vidéos brutes, les PDF, les images et les fichiers audio nécessitent une gestion des références, des versions et un comportement de suppression qui s'alignent sur le jeu de données vectorielles dérivé.</li>
</ul>
<p>Le comportement exact de la version, les paramètres par défaut et le chemin de migration doivent suivre les <a href="https://docs.zilliz.com/docs/release-notes-2605">notes de mise à jour</a> pertinentes <a href="https://docs.zilliz.com/docs/release-notes-2605">de</a> Milvus et <a href="https://docs.zilliz.com/docs/release-notes-2605">Zilliz Cloud</a>. L'orientation du stockage est cependant claire : les bases de données vectorielles ont besoin d'une fondation versionnée et native sous la couche de service.</p>
<h2 id="Try-Loon-under-Zilliz-Vector-Lakebase" class="common-anchor-header">Essayez Loon sous Zilliz Vector Lakebase<button data-href="#Try-Loon-under-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>Si votre stack actuel sépare le service en ligne, l'analyse hors ligne, les backfills et les workflows de lac de données externes en différents systèmes, Zilliz Vector Lakebase vaut le coup d'œil. Vous pouvez l'essayer dans <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>. Les nouvelles inscriptions par e-mail bénéficient de 100 $ de crédits gratuits. N'hésitez pas à <a href="https://zilliz.com/contact-sales">nous parler</a> de votre cas d'utilisation.</p>
<p>Vous pouvez également suivre la <a href="https://milvus.io/docs/release_notes.md">sortie de Milvus 3.0</a> pour voir comment Loon évolue dans le moteur open-source.</p>
<p><strong>Zilliz Vector Lakebase réunit :</strong></p>
<ul>
<li>Un service hiérarchisé pour différents compromis en termes de performances et de coûts en temps réel</li>
<li>Recherche à la demande pour les charges de travail à grande échelle ou exploratoires sans calcul permanent</li>
<li>Recherche externe dans le lac de données, pour indexer et rechercher directement dans les données existantes du lac.</li>
<li>Recherche à spectre complet sur des vecteurs, du texte, du JSON et des données géospatiales, avec extraction et reclassement hybrides.</li>
<li>Stockage unifié natif du lac, basé sur Vortex, un format ouvert conçu pour des lectures aléatoires plus rapides et moins coûteuses sur des données vectorielles lourdes.</li>
</ul>
