---
id: json-shredding-in-milvus-faster-json-filtering-with-flexibility.md
title: >-
  Déchiquetage JSON dans Milvus : filtrage JSON 88,9 fois plus rapide et
  flexible
author: Jack Zhang
date: 2025-12-04T00:00:00.000Z
cover: assets.zilliz.com/JSON_Shredding_new_Cover_1_f9253063f5.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, JSON Shredding, JSON performance, columnar storage'
meta_title: |
  Milvus JSON Shredding: Faster JSON Filtering With Flexibility
desc: >-
  Découvrez comment Milvus JSON Shredding utilise un stockage en colonnes
  optimisé pour accélérer les requêtes JSON jusqu'à 89 fois tout en préservant
  une flexibilité totale du schéma.
origin: >-
  https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md
---
<p>Les systèmes d'IA modernes produisent plus de données JSON semi-structurées que jamais. Les informations sur les clients et les produits sont comprimées dans un objet JSON, les microservices émettent des journaux JSON à chaque requête, les appareils IoT diffusent les relevés des capteurs dans des charges utiles JSON légères, et les applications d'IA d'aujourd'hui normalisent de plus en plus JSON pour les sorties structurées. Il en résulte un flot de données de type JSON qui se déversent dans les bases de données vectorielles.</p>
<p>Traditionnellement, il existe deux façons de traiter les documents JSON :</p>
<ul>
<li><p><strong>prédéfinir chaque champ JSON dans un schéma fixe et construire un index :</strong> Cette approche offre de bonnes performances d'interrogation, mais elle est rigide. Dès que le format des données change, chaque champ nouveau ou modifié déclenche une nouvelle série de mises à jour DDL (Data Definition Language) et de migrations de schéma pénibles.</p></li>
<li><p><strong>Stocker l'intégralité de l'objet JSON en tant que colonne unique (le type JSON et le schéma dynamique dans Milvus utilisent tous deux cette approche) :</strong> Cette option offre une excellente flexibilité, mais au détriment des performances des requêtes. Chaque requête nécessite une analyse JSON au moment de l'exécution et souvent un balayage complet de la table, ce qui entraîne une latence qui augmente au fur et à mesure que l'ensemble de données s'accroît.</p></li>
</ul>
<p>Il s'agissait auparavant d'un dilemme entre flexibilité et performance.</p>
<p>Ce n'est plus le cas avec la nouvelle fonctionnalité JSON Shredding de <a href="https://milvus.io/">Milvus</a>.</p>
<p>Avec l'introduction de <a href="https://milvus.io/docs/json-shredding.md">JSON Shredding</a>, Milvus permet désormais une agilité sans schéma avec les performances du stockage en colonnes, rendant enfin les données semi-structurées à grande échelle à la fois flexibles et conviviales pour les requêtes.</p>
<h2 id="How-JSON-Shredding-Works" class="common-anchor-header">Fonctionnement du déchiquetage JSON<button data-href="#How-JSON-Shredding-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Le déchiquetage JSON accélère les requêtes JSON en transformant les documents JSON basés sur des lignes en un stockage en colonnes hautement optimisé. Milvus préserve la flexibilité de JSON pour la modélisation des données tout en optimisant automatiquement le stockage en colonnes, ce qui améliore considérablement l'accès aux données et les performances des requêtes.</p>
<p>Pour traiter efficacement les champs JSON rares ou épars, Milvus dispose également d'un index inversé pour les clés partagées. Tout cela se passe de manière transparente pour les utilisateurs : vous pouvez insérer des documents JSON comme d'habitude et laisser Milvus gérer la stratégie de stockage et d'indexation optimale en interne.</p>
<p>Lorsque Milvus reçoit des enregistrements JSON bruts dont la forme et la structure varient, il analyse chaque clé JSON en fonction de son taux d'occurrence et de la stabilité de son type (si son type de données est cohérent d'un document à l'autre). Sur la base de cette analyse, chaque clé est classée dans l'une des trois catégories suivantes :</p>
<ul>
<li><p><strong>Les clés typées :</strong> Les clés qui apparaissent dans la plupart des documents et qui ont toujours le même type de données (par exemple, tous les entiers ou toutes les chaînes).</p></li>
<li><p><strong>Clés dynamiques</strong>: Les clés qui apparaissent fréquemment mais dont les types de données sont mixtes (par exemple, parfois une chaîne de caractères, parfois un nombre entier).</p></li>
<li><p><strong>Clés partagées :</strong> Clés peu fréquentes, éparses ou imbriquées, dont la fréquence est inférieure à un seuil configurable.</p></li>
</ul>
<p>Milvus traite chaque catégorie différemment pour maximiser l'efficacité :</p>
<ul>
<li><p>Les<strong>clés typées</strong> sont stockées dans des colonnes dédiées et fortement typées.</p></li>
<li><p>Les<strong>clés dynamiques</strong> sont placées dans des colonnes dynamiques en fonction du type de valeur réel observé lors de l'exécution.</p></li>
<li><p>Les colonnes typées et dynamiques sont stockées dans des formats de colonnes Arrow/Parquet pour un balayage rapide et une exécution des requêtes hautement optimisée.</p></li>
<li><p>Les<strong>clés partagées</strong> sont consolidées dans une colonne binaire-JSON compacte, accompagnée d'un index inversé des clés partagées. Cet index accélère les requêtes sur les champs à faible fréquence en éliminant rapidement les lignes non pertinentes et en limitant la recherche aux seuls documents qui contiennent la clé demandée.</p></li>
</ul>
<p>Cette combinaison de stockage en colonnes adaptatif et d'indexation inversée constitue le cœur du mécanisme de déchiquetage JSON de Milvus, permettant à la fois une flexibilité et des performances élevées à l'échelle.</p>
<p>Le flux de travail global est illustré ci-dessous :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/json_shredding_79a62a9661.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Maintenant que nous avons couvert les bases du fonctionnement du déchiquetage JSON, examinons de plus près les capacités clés qui rendent cette approche à la fois flexible et très performante.</p>
<h3 id="Shredding-and-Columnarization" class="common-anchor-header">Déchiquetage et mise en colonnes</h3><p>Lorsqu'un nouveau document JSON est écrit, Milvus le décompose et le réorganise en un stockage en colonnes optimisé :</p>
<ul>
<li><p>Les clés typées et dynamiques sont automatiquement identifiées et stockées dans des colonnes dédiées.</p></li>
<li><p>Si le JSON contient des objets imbriqués, Milvus génère automatiquement des noms de colonnes basés sur le chemin. Par exemple, un champ <code translate="no">name</code> à l'intérieur d'un objet <code translate="no">user</code> peut être stocké avec le nom de colonne <code translate="no">/user/name</code>.</p></li>
<li><p>Les clés partagées sont stockées ensemble dans une seule colonne JSON binaire compacte. Comme ces clés apparaissent rarement, Milvus construit un index inversé pour elles, ce qui permet un filtrage rapide et permet au système de localiser rapidement les lignes qui contiennent la clé spécifiée.</p></li>
</ul>
<h3 id="Intelligent-Column-Management" class="common-anchor-header">Gestion intelligente des colonnes</h3><p>Outre le déchiquetage JSON en colonnes, Milvus ajoute une couche d'intelligence supplémentaire par le biais de la gestion dynamique des colonnes, ce qui garantit que le déchiquetage JSON reste flexible au fur et à mesure de l'évolution des données.</p>
<ul>
<li><p><strong>Colonnes créées en fonction des besoins :</strong> Lorsque de nouvelles clés apparaissent dans les documents JSON entrants, Milvus regroupe automatiquement les valeurs ayant la même clé dans une colonne dédiée. Cela permet de préserver les avantages en termes de performances du stockage en colonnes sans exiger des utilisateurs qu'ils conçoivent des schémas en amont. Milvus déduit également le type de données des nouveaux champs (par exemple, INTEGER, DOUBLE, VARCHAR) et sélectionne un format en colonnes efficace pour eux.</p></li>
<li><p><strong>Chaque clé est traitée automatiquement :</strong> Milvus analyse et traite chaque clé du document JSON. Cela garantit une large couverture des requêtes sans obliger les utilisateurs à prédéfinir des champs ou à construire des index à l'avance.</p></li>
</ul>
<h3 id="Query-Optimization" class="common-anchor-header">Optimisation des requêtes</h3><p>Une fois les données réorganisées dans les bonnes colonnes, Milvus sélectionne le chemin d'exécution le plus efficace pour chaque requête :</p>
<ul>
<li><p><strong>Analyses directes des colonnes pour les clés typées et dynamiques :</strong> Si une requête cible un champ qui a déjà été divisé en sa propre colonne, Milvus peut analyser cette colonne directement. Cela permet de réduire la quantité totale de données à traiter et de tirer parti du calcul en colonnes accéléré par SIMD pour une exécution encore plus rapide.</p></li>
<li><p><strong>Recherche indexée pour les clés partagées :</strong> Si la requête implique un champ qui n'a pas été promu dans sa propre colonne (généralement une clé rare), Milvus l'évalue par rapport à la colonne des clés partagées. L'index inversé construit sur cette colonne permet à Milvus d'identifier rapidement les lignes qui contiennent la clé spécifiée et de sauter les autres, ce qui améliore considérablement les performances pour les champs à faible fréquence.</p></li>
<li><p><strong>Gestion automatique des métadonnées :</strong> Milvus maintient en permanence les métadonnées et les dictionnaires globaux afin que les requêtes restent précises et efficaces, même si la structure des documents JSON entrants évolue au fil du temps.</p></li>
</ul>
<h2 id="Performance-benchmarks" class="common-anchor-header">Critères de performance<button data-href="#Performance-benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous avons conçu un benchmark pour comparer les performances de requête du stockage de l'intégralité du document JSON en tant que champ brut unique par rapport à l'utilisation de la nouvelle fonctionnalité de déchiquetage JSON.</p>
<h3 id="Test-environment-and-methodology" class="common-anchor-header">Environnement de test et méthodologie</h3><ul>
<li><p>Matériel : cluster 1 core/8GB</p></li>
<li><p>Jeu de données : 1 million de documents provenant de <a href="https://github.com/ClickHouse/JSONBench.git">JSONBench</a></p></li>
<li><p>Méthodologie : Mesure du QPS et de la latence pour différents types de requêtes</p></li>
</ul>
<h3 id="Results-typed-keys" class="common-anchor-header">Résultats : clés typées</h3><p>Ce test a mesuré les performances lors de l'interrogation d'une clé présente dans la plupart des documents.</p>
<table>
<thead>
<tr><th>Expression de la requête</th><th>QPS (sans déchiquetage)</th><th>QPS (avec déchiquetage)</th><th>Amélioration des performances</th></tr>
</thead>
<tbody>
<tr><td>json['time_us'] &gt; 0</td><td>8.69</td><td>287.5</td><td><strong>33x</strong></td></tr>
<tr><td>json['kind'] == 'commit'</td><td>8.42</td><td>126.1</td><td><strong>14.9x</strong></td></tr>
</tbody>
</table>
<h3 id="Results-shared-keys" class="common-anchor-header">Résultats : clés partagées</h3><p>Ce test s'est concentré sur l'interrogation de clés peu nombreuses et imbriquées qui tombent dans la catégorie "partagée".</p>
<table>
<thead>
<tr><th>Expression de la requête</th><th>QPS (sans déchiquetage)</th><th>QPS (avec déchiquetage)</th><th>Amélioration des performances</th></tr>
</thead>
<tbody>
<tr><td>json['identity']['seq'] &gt; 0</td><td>4.33</td><td>385</td><td><strong>88.9x</strong></td></tr>
<tr><td>json['identity']['did'] == 'xxxxx'</td><td>7.6</td><td>352</td><td><strong>46.3x</strong></td></tr>
</tbody>
</table>
<p>Les requêtes à clé partagée présentent les améliorations les plus spectaculaires (jusqu'à 89× plus rapides), tandis que les requêtes à clé typée offrent des accélérations constantes de 15 à 30×. Dans l'ensemble, chaque type de requête bénéficie de JSON Shredding, avec des gains de performance évidents.</p>
<h2 id="Try-It-Now" class="common-anchor-header">Essayez-le maintenant<button data-href="#Try-It-Now" class="anchor-icon" translate="no">
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
    </button></h2><p>Que vous travailliez avec des logs d'API, des données de capteurs IoT ou des charges utiles d'application en évolution rapide, JSON Shredding vous offre la rare possibilité de bénéficier à la fois d'une flexibilité et de performances élevées.</p>
<p>La fonctionnalité est maintenant disponible et nous vous invitons à l'essayer dès maintenant. Vous pouvez également consulter <a href="https://milvus.io/docs/json-shredding.md">cette documentation</a> pour plus de détails.</p>
<p>Vous avez des questions ou souhaitez approfondir une fonctionnalité de la dernière version de Milvus ? Rejoignez notre<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou déposez des questions sur<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Vous pouvez également réserver une session individuelle de 20 minutes pour obtenir des informations, des conseils et des réponses à vos questions dans le cadre des<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
