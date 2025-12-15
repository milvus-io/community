---
id: unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md
title: >-
  L'espace rencontre la sémantique : Débloquer la recherche géo-vectorielle avec
  les champs géométriques et l'index RTREE dans Milvus
author: Cai Zhang
date: 2025-12-08T00:00:00.000Z
cover: assets.zilliz.com/rtree_cover_53c424f967.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 2.6, Geometry field, RTREE index, Geo-Vector Search'
meta_title: |
  Milvus Geometry Field and RTREE Index for Geo-Vector Search
desc: >-
  Découvrez comment Milvus 2.6 unifie la recherche vectorielle avec l'indexation
  géospatiale à l'aide des champs Geometry et de l'index RTREE, permettant une
  recherche d'IA précise et sensible à l'emplacement.
origin: >-
  https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md
---
<p>À mesure que les systèmes modernes deviennent plus intelligents, les données de géolocalisation sont devenues essentielles pour des applications telles que les recommandations pilotées par l'IA, la répartition intelligente et la conduite autonome.</p>
<p>Par exemple, lorsque vous commandez de la nourriture sur des plateformes comme DoorDash ou Uber Eats, le système prend en compte bien plus que la distance qui vous sépare du restaurant. Il tient également compte de la notation des restaurants, de l'emplacement des coursiers, des conditions de circulation et même de vos préférences personnelles. Dans le cadre de la conduite autonome, les véhicules doivent planifier leur trajectoire, détecter les obstacles et comprendre la sémantique de la scène, souvent en quelques millisecondes seulement.</p>
<p>Tout cela dépend de la capacité à indexer et à récupérer efficacement les données géospatiales.</p>
<p>Traditionnellement, les données géographiques et les données vectorielles sont stockées dans deux systèmes distincts :</p>
<ul>
<li><p>Les systèmes géospatiaux stockent les coordonnées et les relations spatiales (latitude, longitude, régions polygonales, etc.).</p></li>
<li><p>Les bases de données vectorielles gèrent les enchâssements sémantiques et la recherche de similitudes générés par les modèles d'intelligence artificielle.</p></li>
</ul>
<p>Cette séparation complique l'architecture, ralentit les requêtes et rend difficile l'exécution simultanée de raisonnements spatiaux et sémantiques par les applications.</p>
<p><a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6</a> résout ce problème en introduisant le <a href="https://milvus.io/docs/geometry-field.md">champ géométrique</a>, qui permet de combiner directement la recherche de similarité vectorielle avec des contraintes spatiales. Cela permet des cas d'utilisation tels que :</p>
<ul>
<li><p>Service de localisation (LBS) : "trouver des points d'intérêt similaires dans ce pâté de maisons".</p></li>
<li><p>Recherche multimodale : recherche multimodale : "trouver des photos similaires dans un rayon de 1 km autour de ce point".</p></li>
<li><p>Cartes et logistique : "actifs à l'intérieur d'une région" ou "itinéraires croisant un chemin".</p></li>
</ul>
<p>Associé au nouvel <a href="https://milvus.io/docs/rtree.md">index RTREE - une</a>structure arborescente optimisée pour le filtrage spatial - Milvus prend désormais en charge des opérateurs géospatiaux efficaces tels que <code translate="no">st_contains</code>, <code translate="no">st_within</code>, et <code translate="no">st_dwithin</code>, ainsi que la recherche vectorielle à haute dimension. Ensemble, ils rendent la recherche intelligente spatialement consciente non seulement possible, mais pratique.</p>
<p>Dans ce billet, nous verrons comment fonctionnent le champ géométrique et l'index RTREE, et comment ils se combinent avec la recherche de similarité vectorielle pour permettre des applications sémantiques spatiales dans le monde réel.</p>
<h2 id="What-Is-a-Geometry-Field" class="common-anchor-header">Qu'est-ce qu'un champ géométrique ?<button data-href="#What-Is-a-Geometry-Field" class="anchor-icon" translate="no">
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
    </button></h2><p>Un <strong>champ géométrique</strong> est un type de données défini par le schéma (<code translate="no">DataType.GEOMETRY</code>) dans Milvus utilisé pour stocker des données géométriques. Contrairement aux systèmes qui ne traitent que les coordonnées brutes, Milvus prend en charge une gamme de structures spatiales, notamment <strong>Point</strong>, <strong>LineString</strong> et <strong>Polygon</strong>.</p>
<p>Il est ainsi possible de représenter des concepts du monde réel tels que des emplacements de restaurants (Point), des zones de livraison (Polygone) ou des trajectoires de véhicules autonomes (LineString), le tout dans la même base de données que celle qui stocke les vecteurs sémantiques. En d'autres termes, Milvus devient un système unifié permettant de savoir à la fois <em>où</em> se trouve quelque chose et <em>ce que cela signifie</em>.</p>
<p>Les valeurs géométriques sont stockées à l'aide du format <a href="https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry">Well-Known Text (WKT)</a>, une norme lisible par l'homme pour l'insertion et l'interrogation de données géométriques. Cela simplifie l'ingestion et l'interrogation des données car les chaînes WKT peuvent être insérées directement dans un enregistrement Milvus. Par exemple :</p>
<pre><code translate="no">data = [
    { 
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;geo&quot;</span>: <span class="hljs-string">&quot;POINT(116.4074 39.9042)&quot;</span>,
        <span class="hljs-string">&quot;vector&quot;</span>: vector,
    }
]
<button class="copy-code-btn"></button></code></pre>
<h2 id="What-Is-the-RTREE-Index-and-How-Does-It-Work" class="common-anchor-header">Qu'est-ce que l'index RTREE et comment fonctionne-t-il ?<button data-href="#What-Is-the-RTREE-Index-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Une fois que Milvus a introduit le type de données Géométrie, il a également besoin d'un moyen efficace de filtrer les objets spatiaux. Milvus gère cela à l'aide d'un pipeline de filtrage spatial en deux étapes :</p>
<ul>
<li><p><strong>Filtrage grossier :</strong> Réduit rapidement le nombre de candidats à l'aide d'index spatiaux tels que RTREE.</p></li>
<li><p><strong>Filtrage fin :</strong> Applique des contrôles géométriques exacts aux candidats restants, en garantissant l'exactitude des limites.</p></li>
</ul>
<p>Au cœur de ce processus se trouve <strong>RTREE (Rectangle Tree)</strong>, une structure d'indexation spatiale conçue pour les données géométriques multidimensionnelles. RTREE accélère les requêtes spatiales en organisant les objets géométriques de manière hiérarchique.</p>
<p><strong>Phase 1 : Construction de l'index</strong></p>
<p><strong>1. Créer des nœuds feuilles :</strong> Pour chaque objet géométrique, calculez son <strong>rectangle minimal de délimitation (MBR</strong>) - le plus petit rectangle qui contient entièrement l'objet - et stockez-le en tant que nœud feuille.</p>
<p><strong>2. Regrouper en boîtes plus grandes :</strong> Regroupez les nœuds feuilles proches et enveloppez chaque groupe à l'intérieur d'un nouveau MBR, en produisant des nœuds internes.</p>
<p><strong>3. Ajouter le nœud racine :</strong> Créer un nœud racine dont le MBR couvre tous les groupes internes, formant ainsi une structure arborescente équilibrée en hauteur.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RTREE_Index_11b5d09e07.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Phase 2 : Accélérer les requêtes</strong></p>
<p><strong>1. Formez le MBR de la requête :</strong> calculez le MBR de la géométrie utilisée dans votre requête.</p>
<p><strong>2. Élaguez les branches :</strong> En commençant par la racine, comparez le MBR de la requête avec chaque nœud interne. Sautez toute branche dont le MBR ne croise pas le MBR de la requête.</p>
<p><strong>3. Rassembler les candidats :</strong> Descendre dans les branches qui se croisent et rassembler les nœuds feuilles candidats.</p>
<p><strong>4. Effectuer une correspondance exacte :</strong> pour chaque candidat, exécuter le prédicat spatial pour obtenir des résultats précis.</p>
<h3 id="Why-RTREE-Is-Fast" class="common-anchor-header">Pourquoi RTREE est rapide</h3><p>RTREE offre d'excellentes performances en matière de filtrage spatial grâce à plusieurs caractéristiques de conception clés :</p>
<ul>
<li><p><strong>Chaque nœud stocke un MBR :</strong> chaque nœud évalue la surface de toutes les géométries de son sous-arbre. Il est ainsi facile de décider si une branche doit être explorée au cours d'une requête.</p></li>
<li><p><strong>Élagage rapide :</strong> Seuls les sous-arbres dont le MBR croise la région interrogée sont explorés. Les zones non pertinentes sont entièrement ignorées.</p></li>
<li><p><strong>S'adapte à la taille des données :</strong> RTREE prend en charge les recherches spatiales en temps <strong>O(log N)</strong>, ce qui permet d'effectuer des requêtes rapides même lorsque le jeu de données s'accroît.</p></li>
<li><p><strong>Implémentation Boost.Geometry :</strong> Milvus construit son index RTREE à l'aide de <a href="https://www.boost.org/library/latest/geometry/">Boost.Geometry</a>, une bibliothèque C++ largement utilisée qui fournit des algorithmes géométriques optimisés et une implémentation RTREE thread-safe adaptée aux charges de travail simultanées.</p></li>
</ul>
<h3 id="Supported-geometry-operators" class="common-anchor-header">Opérateurs géométriques pris en charge</h3><p>Milvus fournit un ensemble d'opérateurs spatiaux qui vous permettent de filtrer et d'extraire des entités sur la base de relations géométriques. Ces opérateurs sont essentiels pour les charges de travail qui doivent comprendre comment les objets sont liés les uns aux autres dans l'espace.</p>
<p>Le tableau suivant répertorie les <a href="https://milvus.io/docs/geometry-operators.md">opérateurs géométriques</a> actuellement disponibles dans Milvus.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Opérateur</strong></th><th style="text-align:center"><strong>Description de l'opérateur</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>st_intersects(A, B)</strong></td><td style="text-align:center">Renvoie VRAI si les géométries A et B partagent au moins un point commun.</td></tr>
<tr><td style="text-align:center"><strong>st_contains(A, B)</strong></td><td style="text-align:center">Retourne VRAI si la géométrie A contient complètement la géométrie B (à l'exception de la frontière).</td></tr>
<tr><td style="text-align:center"><strong>st_within(A, B)</strong></td><td style="text-align:center">Retourne VRAI si la géométrie A est complètement contenue dans la géométrie B. C'est l'inverse de st_contains(A, B).</td></tr>
<tr><td style="text-align:center"><strong>st_covers(A, B)</strong></td><td style="text-align:center">Retourne VRAI si la géométrie A recouvre la géométrie B (y compris la frontière).</td></tr>
<tr><td style="text-align:center"><strong>st_touches(A, B)</strong></td><td style="text-align:center">Retourne VRAI si les géométries A et B se touchent au niveau de leurs limites mais ne se coupent pas à l'intérieur.</td></tr>
<tr><td style="text-align:center"><strong>st_equals(A, B)</strong></td><td style="text-align:center">Retourne VRAI si les géométries A et B sont spatialement identiques.</td></tr>
<tr><td style="text-align:center"><strong>st_overlaps(A, B)</strong></td><td style="text-align:center">Retourne VRAI si les géométries A et B se chevauchent partiellement et qu'aucune ne contient entièrement l'autre.</td></tr>
<tr><td style="text-align:center"><strong>st_dwithin(A, B, d)</strong></td><td style="text-align:center">Retourne VRAI si la distance entre A et B est inférieure à <em>d.</em></td></tr>
</tbody>
</table>
<h3 id="How-to-Combine-Geolocation-Index-and-Vector-Index" class="common-anchor-header">Comment combiner l'index de géolocalisation et l'index vectoriel ?</h3><p>Grâce à la prise en charge de la géométrie et à l'index RTREE, Milvus peut combiner le filtrage géospatial et la recherche de similarité vectorielle dans un seul flux de travail. Le processus se déroule en deux étapes :</p>
<p><strong>1. Filtrer par emplacement à l'aide de RTREE :</strong> Milvus utilise d'abord l'index RTREE pour limiter la recherche aux entités situées dans la plage géographique spécifiée (par exemple, " dans un rayon de 2 km ").</p>
<p><strong>2. Classement par sémantique à l'aide de la recherche vectorielle :</strong> Parmi les candidats restants, l'index vectoriel sélectionne les N premiers résultats les plus similaires sur la base de la similarité d'intégration.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Geometry_R_Tree_f1d88fc252.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Real-World-Applications-of-Geo-Vector-Retrieval" class="common-anchor-header">Applications concrètes de la recherche géovectorielle<button data-href="#Real-World-Applications-of-Geo-Vector-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Delivery-Services-Smarter-Location-Aware-Recommendations" class="common-anchor-header">1. Services de livraison : Recommandations plus intelligentes et tenant compte de la localisation</h3><p>Des plateformes telles que DoorDash ou Uber Eats traitent des centaines de millions de demandes chaque jour. Dès qu'un utilisateur ouvre l'application, le système doit déterminer, en fonction de l'emplacement de l'utilisateur, de l'heure de la journée, de ses préférences gustatives, des délais de livraison estimés, du trafic en temps réel et de la disponibilité des coursiers, quels sont les restaurants ou les coursiers qui correspondent le mieux à <em>l'instant présent</em>.</p>
<p>Traditionnellement, cela nécessite l'interrogation d'une base de données géospatiale et d'un moteur de recommandation distinct, suivie de plusieurs cycles de filtrage et de reclassement. Avec l'index de géolocalisation, Milvus simplifie considérablement ce flux de travail :</p>
<ul>
<li><p><strong>Stockage unifié</strong> - Les coordonnées des restaurants, les emplacements des coursiers et les préférences des utilisateurs sont regroupés dans un seul système.</p></li>
<li><p><strong>Recherche conjointe</strong> - Appliquer d'abord un filtre spatial (par exemple, <em>restaurants dans un rayon de 3 km</em>), puis utiliser la recherche vectorielle pour classer par similarité, préférence gustative ou qualité.</p></li>
<li><p><strong>Prise de décision dynamique</strong> - Combinez la distribution des coursiers en temps réel et les signaux de circulation pour affecter rapidement le coursier le plus proche et le plus approprié.</p></li>
</ul>
<p>Cette approche unifiée permet à la plateforme d'effectuer un raisonnement spatial et sémantique en une seule requête. Par exemple, lorsqu'un utilisateur recherche "riz au curry", Milvus récupère les restaurants qui sont sémantiquement pertinents <em>et</em> donne la priorité à ceux qui sont proches, qui livrent rapidement et qui correspondent au profil gustatif historique de l'utilisateur.</p>
<h3 id="2-Autonomous-Driving-More-Intelligent-Decisions" class="common-anchor-header">2. Conduite autonome : Des décisions plus intelligentes</h3><p>Dans la conduite autonome, l'indexation géospatiale est fondamentale pour la perception, la localisation et la prise de décision. Les véhicules doivent en permanence s'aligner sur des cartes haute définition, détecter les obstacles et planifier des trajectoires sûres, le tout en quelques millisecondes.</p>
<p>Avec Milvus, le type Geometry et l'index RTREE peuvent stocker et interroger des structures spatiales riches telles que :</p>
<ul>
<li><p><strong>les limites des routes</strong> (LineString)</p></li>
<li><p><strong>Les zones de régulation du trafic</strong> (Polygone)</p></li>
<li><p><strong>Obstacles détectés</strong> (Point)</p></li>
</ul>
<p>Ces structures peuvent être indexées efficacement, ce qui permet aux données géospatiales de participer directement à la boucle de décision de l'IA. Par exemple, un véhicule autonome peut rapidement déterminer si ses coordonnées actuelles se situent à l'intérieur d'une voie spécifique ou s'il croise une zone réglementée, simplement grâce à un prédicat spatial RTREE.</p>
<p>Lorsqu'il est associé à des intégrations vectorielles générées par le système de perception, telles que des intégrations de scènes qui capturent l'environnement de conduite actuel, Milvus peut prendre en charge des requêtes plus avancées, telles que la récupération de scénarios de conduite historiques similaires à la conduite actuelle dans un rayon de 50 mètres. Cela permet aux modèles d'interpréter l'environnement plus rapidement et de prendre de meilleures décisions.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusion<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>La géolocalisation ne se résume pas à la latitude et à la longitude : c'est une source précieuse d'informations sémantiques qui nous indique où les choses se produisent, comment elles sont liées à leur environnement et à quel contexte elles appartiennent.</p>
<p>Dans la base de données de nouvelle génération de Zilliz, les données vectorielles et les informations géospatiales sont progressivement réunies en une base unifiée. Cela permet</p>
<ul>
<li><p>la recherche conjointe de vecteurs, de données géospatiales et de données temporelles</p></li>
<li><p>des systèmes de recommandation tenant compte de l'espace</p></li>
<li><p>la recherche multimodale basée sur la localisation (LBS).</p></li>
</ul>
<p>À l'avenir, l'IA ne comprendra pas seulement <em>la</em> signification du contenu, mais aussi où il s'applique et quand il est le plus important.</p>
<p>Pour plus d'informations sur le champ géométrique et l'index RTREE, consultez la documentation ci-dessous :</p>
<ul>
<li><p><a href="https://milvus.io/docs/geometry-field.md">Geometry Field | Milvus Documentation</a></p></li>
<li><p><a href="https://milvus.io/docs/rtree.md">RTREE | Documentation Milvus</a></p></li>
</ul>
<p>Vous avez des questions ou souhaitez approfondir une fonctionnalité de la dernière version de Milvus ? Rejoignez notre<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou déposez des questions sur<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Vous pouvez également réserver une session individuelle de 20 minutes pour obtenir des informations, des conseils et des réponses à vos questions dans le cadre des<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Heures de bureau Milvus</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">En savoir plus sur les fonctionnalités de Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Présentation de Milvus 2.6 : recherche vectorielle abordable à l'échelle du milliard</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Présentation de la fonction d'intégration : Comment Milvus 2.6 rationalise la vectorisation et la recherche sémantique</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Déchiquetage JSON dans Milvus : filtrage JSON 88,9 fois plus rapide et flexible</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Déverrouiller la véritable recherche au niveau de l'entité : Nouvelles fonctionnalités Array-of-Structs et MAX_SIM dans Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH dans Milvus : l'arme secrète pour lutter contre les doublons dans les données de formation LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">La compression vectorielle à l'extrême : comment Milvus répond à 3× plus de requêtes avec RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Les benchmarks mentent - les bases de données vectorielles méritent un vrai test </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Nous avons remplacé Kafka/Pulsar par un Woodpecker pour Milvus </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">La recherche vectorielle dans le monde réel : comment filtrer efficacement sans tuer le rappel ?</a></p></li>
</ul>
