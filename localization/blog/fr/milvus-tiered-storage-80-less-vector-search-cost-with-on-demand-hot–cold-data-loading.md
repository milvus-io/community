---
id: >-
  milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md
title: >-
  Ne payez plus pour des données froides : Réduction des coûts de 80 % grâce au
  chargement de données chaudes et froides à la demande dans le système de
  stockage hiérarchisé de Milvus
author: Buqian Zheng
date: 2025-12-15T00:00:00.000Z
cover: assets.zilliz.com/tiered_storage_cover_38237a3bda.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Tiered Storage, vector search, hot data, cold data'
meta_title: >
  Milvus Tiered Storage: 80% Less Vector Search Cost with On-Demand Hot–Cold
  Data Loading
desc: >-
  Découvrez comment le stockage hiérarchisé dans Milvus permet le chargement à
  la demande des données chaudes et froides, ce qui permet de réduire les coûts
  de 80 % et d'accélérer les temps de chargement à l'échelle.
origin: >-
  https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md
---
<p><strong>Combien d'entre vous paient encore des factures d'infrastructure élevées pour des données que votre système touche à peine ? Honnêtement, c'est le cas de la plupart des équipes.</strong></p>
<p>Si vous exécutez une recherche vectorielle en production, vous l'avez probablement constaté de première main. Vous prévoyez de grandes quantités de mémoire et de disques SSD pour que tout soit prêt pour les requêtes, même si seule une petite partie de votre ensemble de données est réellement active. Et vous n'êtes pas le seul. Nous avons vu beaucoup de cas similaires :</p>
<ul>
<li><p><strong>Plateformes SaaS multi-locataires :</strong> Des centaines de locataires inscrits, mais seulement 10 à 15 % d'entre eux sont actifs chaque jour. Les autres restent inactifs mais continuent d'occuper des ressources.</p></li>
<li><p><strong>Systèmes de recommandation pour le commerce électronique :</strong> Un million d'UGS, mais les 8 % de produits les plus vendus génèrent la plupart des recommandations et du trafic de recherche.</p></li>
<li><p><strong>Recherche en IA :</strong> De vastes archives d'encastrements, même si 90 % des requêtes des utilisateurs portent sur des articles datant de la semaine dernière.</p></li>
</ul>
<p>C'est la même chose dans tous les secteurs : <strong>moins de 10 % de vos données sont interrogées fréquemment, mais elles consomment souvent 80 % de votre espace de stockage et de votre mémoire.</strong> Tout le monde sait que ce déséquilibre existe, mais jusqu'à récemment, il n'existait pas de solution architecturale propre pour y remédier.</p>
<p><strong>Cela change avec</strong> <a href="https://milvus.io/docs/release_notes.md">Milvus 2.6</a><strong>.</strong></p>
<p>Avant cette version, Milvus (comme la plupart des bases de données vectorielles) dépendait d'<strong>un modèle de chargement complet</strong>: si les données devaient être consultables, elles devaient être chargées sur les nœuds locaux. Peu importe que ces données soient consultées un millier de fois par minute ou une fois par trimestre, <strong>elles devaient rester chaudes</strong>. Ce choix de conception garantissait des performances prévisibles, mais il impliquait également de surdimensionner les clusters et de payer pour des ressources que les données froides ne méritaient tout simplement pas.</p>
<p><strong>Le</strong><a href="https://milvus.io/docs/tiered-storage-overview.md">stockage hiérarchisé</a> <strong>est notre réponse.</strong></p>
<p>Milvus 2.6 introduit une nouvelle architecture de stockage hiérarchisé avec un <strong>véritable chargement à la demande</strong>, permettant au système de différencier automatiquement les données chaudes des données froides :</p>
<ul>
<li><p>les segments chauds restent mis en cache à proximité de l'ordinateur</p></li>
<li><p>Les segments froids sont stockés à moindre coût dans le stockage d'objets distants.</p></li>
<li><p>Les données <strong>ne</strong> sont transférées vers les nœuds locaux <strong>que lorsqu'une requête en a réellement besoin.</strong></p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://milvus.io/docs/v2.6.x/assets/full-load-mode-vs-tiered-storage-mode.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La structure des coûts passe ainsi de "la quantité de données dont vous disposez" à <strong>"la quantité de données que vous utilisez réellement".</strong> Dans les premiers déploiements en production, ce simple changement permet de <strong>réduire de 80 % les coûts de stockage et de mémoire</strong>.</p>
<p>Dans la suite de ce billet, nous allons voir comment fonctionne le stockage hiérarchisé, partager des résultats de performance réels et montrer où ce changement a le plus d'impact.</p>
<h2 id="Why-Full-Loading-Breaks-Down-at-Scale" class="common-anchor-header">Pourquoi le chargement complet s'effondre à grande échelle<button data-href="#Why-Full-Loading-Breaks-Down-at-Scale" class="anchor-icon" translate="no">
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
    </button></h2><p>Avant de plonger dans la solution, il convient d'examiner de plus près pourquoi le <strong>mode de chargement complet</strong> utilisé dans Milvus 2.5 et les versions antérieures est devenu un facteur limitant à mesure que les charges de travail évoluaient.</p>
<p>Dans Milvus 2.5 et les versions antérieures, lorsqu'un utilisateur émettait une requête <code translate="no">Collection.load()</code>, chaque QueryNode mettait en cache l'ensemble de la collection localement, y compris les métadonnées, les données de champ et les index. Ces composants sont téléchargés à partir du stockage d'objets et stockés soit entièrement en mémoire, soit en mémoire mappée (mmap) sur le disque local. Ce n'est que lorsque <em>toutes ces</em> données sont disponibles localement que la collection est considérée comme chargée et prête à répondre aux requêtes.</p>
<p>En d'autres termes, la collection n'est pas interrogeable tant que l'ensemble des données - chaudes ou froides - n'est pas présent sur le nœud.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_5_en_3adca38b7e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Remarque :</strong> Pour les types d'index qui intègrent des données vectorielles brutes, Milvus ne charge que les fichiers d'index, et non le champ vectoriel séparément. Malgré cela, l'index doit être entièrement chargé pour répondre aux requêtes, quelle que soit la quantité de données réellement accédée.</p>
<p>Pour comprendre pourquoi cela devient problématique, prenons un exemple concret :</p>
<p>Supposons que vous disposiez d'un ensemble de données vectorielles de taille moyenne comprenant</p>
<ul>
<li><p><strong>100 millions de vecteurs</strong></p></li>
<li><p><strong>768 dimensions</strong> (BERT embeddings)</p></li>
<li><p>précision<strong>float32</strong> (4 octets par dimension)</p></li>
<li><p>Un <strong>index HNSW</strong></p></li>
</ul>
<p>Dans cette configuration, l'index HNSW seul - y compris les vecteurs bruts intégrés - occupe environ 430 Go de mémoire. Après l'ajout de champs scalaires communs tels que les identifiants des utilisateurs, les horodatages ou les étiquettes de catégorie, l'utilisation totale des ressources locales dépasse facilement les 500 Go.</p>
<p>Cela signifie que même si 80 % des données sont rarement ou jamais interrogées, le système doit toujours provisionner et conserver plus de 500 Go de mémoire locale ou de disque simplement pour maintenir la collection en ligne.</p>
<p>Pour certaines charges de travail, ce comportement est acceptable :</p>
<ul>
<li><p>Si presque toutes les données sont fréquemment consultées, le chargement complet de toutes les données permet d'obtenir la latence de requête la plus faible possible, au coût le plus élevé.</p></li>
<li><p>Si les données peuvent être divisées en sous-ensembles chauds et tièdes, le mappage en mémoire des données tièdes sur le disque peut réduire partiellement la pression de la mémoire.</p></li>
</ul>
<p>Toutefois, dans les charges de travail où 80 % ou plus des données se trouvent dans la longue traîne, les inconvénients du chargement complet apparaissent rapidement, tant au niveau des <strong>performances</strong> que des <strong>coûts</strong>.</p>
<h3 id="Performance-bottlenecks" class="common-anchor-header">Goulets d'étranglement des performances</h3><p>Dans la pratique, le chargement complet n'affecte pas seulement les performances des requêtes et ralentit souvent les processus opérationnels de routine :</p>
<ul>
<li><p><strong>Des mises à niveau plus longues :</strong> Dans les grands clusters, les mises à niveau en continu peuvent prendre des heures, voire une journée entière, car chaque nœud doit recharger l'ensemble des données avant de redevenir disponible.</p></li>
<li><p><strong>Récupération plus lente après les pannes :</strong> Lorsqu'un QueryNode redémarre, il ne peut pas servir le trafic tant que toutes les données n'ont pas été rechargées, ce qui prolonge considérablement le temps de reprise et amplifie l'impact des pannes de nœuds.</p></li>
<li><p><strong>Ralentissement de l'itération et de l'expérimentation :</strong> Le chargement complet ralentit les flux de développement, obligeant les équipes d'intelligence artificielle à attendre des heures pour que les données se chargent lorsqu'elles testent de nouveaux ensembles de données ou de nouvelles configurations d'index.</p></li>
</ul>
<h3 id="Cost-inefficiencies" class="common-anchor-header">Inefficacité des coûts</h3><p>Le chargement complet fait également grimper les coûts d'infrastructure. Par exemple, sur les instances optimisées pour la mémoire du cloud grand public, le stockage de 1 To de données en local coûte environ<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>**70</mn></mrow></semantics></math></span></span><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>000 par</mn><mo>an∗</mo><mo separator="true">,</mo><mi>sur</mi><mi>la base d'une tarification</mi></mrow><annotation encoding="application/x-tex">conservatrice</annotation><mrow><mo stretchy="false">(</mo></mrow></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">AWSr6i</span></span></span><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo>:</mo></mrow></semantics></math></span></span><mtext> </mtext><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">70 000 par an**, sur la base d'une tarification conservatrice (AWS r6i : ~</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8389em;vertical-align:-0.1944em;"></span><span class="mord">70</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord">000par</span><span class="mord mathnormal" style="margin-right:0.02778em;">an</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∗</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span> ∗</span></span></span><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">sur la</span><span class="mord mathnormal" style="margin-right:0.03588em;">base</span><span class="mord mathnormal">d'une tarification conservatrice</span><span class="mopen">(</span><span class="mord mathnormal">AWSr6i</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span></span>:<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace nobreak"> </span> 5.74 / Go / mois ; GCP n4-highmem : ~5</span></span></span><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>.</mn><mi>68/GB/mois</mi><mo separator="true">;</mo><mi>AzureE-series</mi><mo>:</mo></mrow></semantics></math></span></span><mtext> </mtext> 5<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">.68 / GB / mois ; Azure E-series :</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">~</span><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord"></span></span></span></span>5<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,</span><span class="mord mathnormal">68/GB/mois</span><span class="mpunct">;</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.05764em;">AzureE</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6595em;"></span> <span class="mord mathnormal">series</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span></span>:<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace nobreak"> </span> 5,67 / GB / mois).</span></span></span></p>
<p>Considérons maintenant un modèle d'accès plus réaliste, où 80 % de ces données sont froides et pourraient être stockées dans le stockage objet à la place (à environ 0,023 $ / Go / mois) :</p>
<ul>
<li><p>200 Go de données chaudes × 5,68</p></li>
<li><p>800 Go de données froides × 0,023</p></li>
</ul>
<p>Coût annuel : (200×5,68+800×0,023)×12≈$14<strong> 000</strong></p>
<p>Il s'agit d'une <strong>réduction de 80 %</strong> du coût total du stockage, sans sacrifier les performances là où elles sont réellement importantes.</p>
<h2 id="What-Is-the-Tiered-Storage-and-How-Does-It-Work" class="common-anchor-header">Qu'est-ce que le stockage hiérarchisé et comment fonctionne-t-il ?<button data-href="#What-Is-the-Tiered-Storage-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour supprimer ce compromis, Milvus 2.6 a introduit le <strong>stockage hiérarchisé</strong>, qui équilibre les performances et les coûts en traitant le stockage local comme un cache plutôt que comme un conteneur pour l'ensemble des données.</p>
<p>Dans ce modèle, les QueryNodes ne chargent que des métadonnées légères au démarrage. Les données de champ et les index sont récupérés à la demande à partir du stockage d'objets distant lorsqu'une requête les requiert, et mis en cache localement si l'on y accède fréquemment. Les données inactives peuvent être expulsées pour libérer de l'espace.</p>
<p>Ainsi, les données chaudes restent à proximité de la couche de calcul pour les requêtes à faible latence, tandis que les données froides restent dans le stockage d'objets jusqu'à ce qu'elles soient nécessaires. Cela réduit le temps de chargement, améliore l'efficacité des ressources et permet aux QueryNodes d'interroger des ensembles de données bien plus importants que la capacité de leur mémoire locale ou de leur disque.</p>
<p>En pratique, le stockage hiérarchisé fonctionne comme suit :</p>
<ul>
<li><p><strong>Garder les données chaudes au niveau local :</strong> Environ 20 % des données fréquemment consultées restent résidentes sur les nœuds locaux, ce qui garantit une faible latence pour les 80 % de requêtes les plus importantes.</p></li>
<li><p><strong>Chargement des données froides à la demande :</strong> Les 80 % restants de données rarement consultées ne sont récupérées qu'en cas de besoin, ce qui libère la majeure partie de la mémoire locale et des ressources du disque.</p></li>
<li><p><strong>S'adapter dynamiquement grâce à l'éviction basée sur la méthode LRU :</strong> Milvus utilise une stratégie d'éviction LRU (Least Recently Used) pour ajuster en permanence les données considérées comme chaudes ou froides. Les données inactives sont automatiquement éliminées pour faire de la place aux données nouvellement accédées.</p></li>
</ul>
<p>Grâce à cette conception, Milvus n'est plus contraint par la capacité fixe de la mémoire locale et du disque. Au lieu de cela, les ressources locales fonctionnent comme un cache géré dynamiquement, où l'espace est continuellement récupéré des données inactives et réattribué aux charges de travail actives.</p>
<p>Sous le capot, ce comportement est rendu possible par trois mécanismes techniques fondamentaux :</p>
<h3 id="1-Lazy-Load" class="common-anchor-header">1. Chargement paresseux</h3><p>Lors de l'initialisation, Milvus ne charge que les métadonnées minimales au niveau du segment, ce qui permet aux collections d'être interrogeables presque immédiatement après le démarrage. Les données de champ et les fichiers d'index restent dans le stockage distant et sont récupérés à la demande pendant l'exécution de la requête, ce qui permet de limiter l'utilisation de la mémoire locale et du disque.</p>
<p><strong>Fonctionnement du chargement des collections dans Milvus 2.5</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_5_en_aa89de3570.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Fonctionnement du chargement paresseux dans Milvus 2.6 et versions ultérieures</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_6_en_049fa45540.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Les métadonnées chargées lors de l'initialisation se répartissent en quatre catégories principales :</p>
<ul>
<li><p><strong>Statistiques de segment</strong> (informations de base telles que le nombre de lignes, la taille du segment et les métadonnées de schéma)</p></li>
<li><p><strong>Horodatage</strong> (utilisé pour prendre en charge les requêtes temporelles)</p></li>
<li><p><strong>Insertion et suppression d'enregistrements</strong> (nécessaires pour maintenir la cohérence des données pendant l'exécution de la requête)</p></li>
<li><p><strong>Filtres de Bloom</strong> (utilisés pour un pré-filtrage rapide afin d'éliminer rapidement les segments non pertinents)</p></li>
</ul>
<h3 id="2-Partial-Load" class="common-anchor-header">2. Chargement partiel</h3><p>Alors que le chargement paresseux contrôle le <em>moment où</em> les données sont chargées, le chargement partiel contrôle la <em>quantité de</em> données chargées. Lorsque les requêtes ou les recherches commencent, le QueryNode effectue un chargement partiel, en récupérant uniquement les morceaux de données ou les fichiers d'index nécessaires dans le stockage d'objets.</p>
<p><strong>Index vectoriels : Chargement en fonction du locataire</strong></p>
<p>L'une des fonctionnalités les plus importantes introduites dans Milvus 2.6+ est le chargement des index vectoriels en fonction du locataire, conçu spécifiquement pour les charges de travail multi-locataires.</p>
<p>Lorsqu'une requête accède aux données d'un seul locataire, Milvus charge uniquement la partie de l'index vectoriel appartenant à ce locataire, en ignorant les données d'index pour tous les autres locataires. Les ressources locales restent ainsi concentrées sur les locataires actifs.</p>
<p>Cette conception présente plusieurs avantages :</p>
<ul>
<li><p>Les index vectoriels des locataires inactifs ne consomment pas de mémoire locale ni de disque.</p></li>
<li><p>Les données d'index pour les locataires actifs restent en cache pour un accès à faible latence.</p></li>
<li><p>Une politique d'éviction LRU au niveau du locataire garantit une utilisation équitable du cache entre les locataires.</p></li>
</ul>
<p><strong>Champs scalaires : Chargement partiel au niveau des colonnes</strong></p>
<p>Le chargement partiel s'applique également aux <strong>champs scalaires</strong>, ce qui permet à Milvus de charger uniquement les colonnes explicitement référencées par une requête.</p>
<p>Considérons une collection comportant <strong>50 champs de schéma</strong>, tels que <code translate="no">id</code>, <code translate="no">vector</code>, <code translate="no">title</code>, <code translate="no">description</code>, <code translate="no">category</code>, <code translate="no">price</code>, <code translate="no">stock</code>, et <code translate="no">tags</code>, et vous n'avez besoin de renvoyer que trois champs :<code translate="no">id</code>, <code translate="no">title</code>, et <code translate="no">price</code>.</p>
<ul>
<li><p>Dans <strong>Milvus 2.5</strong>, les 50 champs scalaires sont chargés indépendamment des exigences de la requête.</p></li>
<li><p>Dans <strong>Milvus 2.6+</strong>, seuls les trois champs demandés sont chargés. Les 47 champs restants ne sont pas chargés et ne sont récupérés paresseusement que s'ils sont consultés ultérieurement.</p></li>
</ul>
<p>Les économies de ressources peuvent être substantielles. Si chaque champ scalaire occupe 20 Go, le chargement de tous les champs nécessite 1 000 Go :</p>
<ul>
<li><p>le chargement de tous les champs nécessite <strong>1 000 Go</strong> (50 × 20 Go)</p></li>
<li><p>Le chargement des trois champs requis seulement utilise <strong>60 Go</strong></p></li>
</ul>
<p>Cela représente une <strong>réduction de 94 %</strong> du chargement des données scalaires, sans affecter l'exactitude de la requête ou les résultats.</p>
<p><strong>Remarque : le</strong> chargement partiel des champs scalaires et des index vectoriels en fonction du locataire sera officiellement introduit dans une prochaine version. Une fois disponible, il permettra de réduire davantage la latence de chargement et d'améliorer les performances des requêtes à froid dans les grands déploiements multi-locataires.</p>
<h3 id="3-LRU-Based-Cache-Eviction" class="common-anchor-header">3. Eviction du cache basée sur LRU</h3><p>Le chargement paresseux et le chargement partiel réduisent considérablement la quantité de données introduites dans la mémoire locale et sur le disque. Toutefois, dans les systèmes fonctionnant depuis longtemps, le cache continue de s'agrandir au fur et à mesure que de nouvelles données sont consultées. Lorsque la capacité locale est atteinte, l'éviction du cache basée sur la méthode LRU prend effet.</p>
<p>L'éviction LRU (Least Recently Used) suit une règle simple : les données auxquelles on n'a pas accédé récemment sont évincées en premier. Cela permet de libérer de l'espace local pour les données nouvellement accédées tout en conservant les données fréquemment utilisées dans la mémoire cache.</p>
<h2 id="Performance-Evaluation-Tiered-Storage-vs-Full-Loading" class="common-anchor-header">Évaluation des performances : Stockage hiérarchisé vs. chargement complet<button data-href="#Performance-Evaluation-Tiered-Storage-vs-Full-Loading" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour évaluer l'impact réel du <strong>stockage hiérarchisé</strong>, nous avons mis en place un environnement de test qui reproduit fidèlement les charges de travail de production. Nous avons comparé Milvus avec et sans stockage hiérarchisé sur cinq dimensions : le temps de chargement, l'utilisation des ressources, les performances des requêtes, la capacité effective et la rentabilité.</p>
<h3 id="Experimental-setup" class="common-anchor-header">Configuration expérimentale</h3><p><strong>Jeu de données</strong></p>
<ul>
<li><p>100 millions de vecteurs avec 768 dimensions (BERT embeddings)</p></li>
<li><p>Taille de l'index vectoriel : environ 430 Go</p></li>
<li><p>10 champs scalaires, dont l'ID, l'horodatage et la catégorie</p></li>
</ul>
<p><strong>Configuration matérielle</strong></p>
<ul>
<li><p>1 QueryNode avec 4 vCPU, 32 Go de mémoire et 1 TB NVMe SSD</p></li>
<li><p>Réseau 10 Gbps</p></li>
<li><p>Cluster de stockage d'objets MinIO en tant que backend de stockage distant</p></li>
</ul>
<p><strong>Modèle d'accès</strong></p>
<p>Les requêtes suivent une distribution réaliste d'accès chaud-froid :</p>
<ul>
<li><p>80 % des requêtes ciblent les données des 30 derniers jours (≈20 % des données totales)</p></li>
<li><p>15 % des requêtes portent sur des données datant de 30 à 90 jours (≈30 % du total des données)</p></li>
<li><p>5 % ciblent des données datant de plus de 90 jours (≈50 % du total des données).</p></li>
</ul>
<h3 id="Key-results" class="common-anchor-header">Principaux résultats</h3><p><strong>1. Temps de chargement 33 fois plus rapide</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Phase</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+ (Tiered Storage)</strong></th><th style="text-align:center"><strong>Accélération</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Téléchargement des données</td><td style="text-align:center">22 minutes</td><td style="text-align:center">28 secondes</td><td style="text-align:center">47×</td></tr>
<tr><td style="text-align:center">Chargement de l'index</td><td style="text-align:center">3 minutes</td><td style="text-align:center">17 secondes</td><td style="text-align:center">10.5×</td></tr>
<tr><td style="text-align:center"><strong>Total</strong></td><td style="text-align:center"><strong>25 minutes</strong></td><td style="text-align:center"><strong>45 secondes</strong></td><td style="text-align:center"><strong>33×</strong></td></tr>
</tbody>
</table>
<p>Dans Milvus 2.5, le chargement de la collection prenait <strong>25 minutes</strong>. Avec le stockage hiérarchisé dans Milvus 2.6+, la même charge de travail s'exécute en <strong>45 secondes</strong> seulement, ce qui représente une amélioration considérable de l'efficacité de la charge.</p>
<p><strong>2. Réduction de 80 % de l'utilisation des ressources locales</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Phase</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+ (stockage hiérarchisé)</strong></th><th style="text-align:center"><strong>Réduction</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Après chargement</td><td style="text-align:center">430 GO</td><td style="text-align:center">12 GO</td><td style="text-align:center">-97%</td></tr>
<tr><td style="text-align:center">Après 1 heure</td><td style="text-align:center">430 GO</td><td style="text-align:center">68 GO</td><td style="text-align:center">-84%</td></tr>
<tr><td style="text-align:center">Après 24 heures</td><td style="text-align:center">430 GO</td><td style="text-align:center">85 GO</td><td style="text-align:center">-80%</td></tr>
<tr><td style="text-align:center">État stable</td><td style="text-align:center">430 GO</td><td style="text-align:center">85-95 GB</td><td style="text-align:center">~80%</td></tr>
</tbody>
</table>
<p>Dans Milvus 2.5, l'utilisation des ressources locales reste constante à <strong>430 Go</strong>, quelle que soit la charge de travail ou la durée d'exécution. En revanche, Milvus 2.6+ démarre avec seulement <strong>12 Go</strong> immédiatement après le chargement.</p>
<p>Au fur et à mesure de l'exécution des requêtes, les données fréquemment consultées sont mises en cache localement et l'utilisation des ressources augmente progressivement. Après environ 24 heures, le système se stabilise à <strong>85-95 Go</strong>, reflétant l'ensemble des données chaudes. Sur le long terme, cela se traduit par une <strong> réduction d'environ 80 %</strong> de la mémoire locale et de l'utilisation du disque, sans sacrifier la disponibilité des requêtes.</p>
<p><strong>3. Impact quasi nul sur les performances des données chaudes</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Type de requête</strong></th><th style="text-align:center"><strong>Milvus 2.5 P99 latence</strong></th><th style="text-align:center"><strong>Milvus 2.6+ P99 latency</strong></th><th style="text-align:center"><strong>Changement</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Requêtes de données chaudes</td><td style="text-align:center">15 ms</td><td style="text-align:center">16 ms</td><td style="text-align:center">+6.7%</td></tr>
<tr><td style="text-align:center">Requêtes de données chaudes</td><td style="text-align:center">15 ms</td><td style="text-align:center">28 ms</td><td style="text-align:center">+86%</td></tr>
<tr><td style="text-align:center">Requêtes de données froides (premier accès)</td><td style="text-align:center">15 ms</td><td style="text-align:center">120 ms</td><td style="text-align:center">+700%</td></tr>
<tr><td style="text-align:center">Requêtes de données froides (en cache)</td><td style="text-align:center">15 ms</td><td style="text-align:center">18 ms</td><td style="text-align:center">+20%</td></tr>
</tbody>
</table>
<p>Pour les données chaudes, qui représentent environ 80 % de toutes les requêtes, la latence P99 n'augmente que de 6,7 %, ce qui n'a pratiquement aucun impact perceptible en production.</p>
<p>Les requêtes de données froides présentent une latence plus élevée lors du premier accès en raison du chargement à la demande à partir du stockage d'objets. Cependant, une fois mises en cache, leur latence n'augmente que de 20 %. Étant donné la faible fréquence d'accès aux données froides, ce compromis est généralement acceptable pour la plupart des charges de travail réelles.</p>
<p><strong>4. Une capacité effective 4,3 fois supérieure</strong></p>
<p>Avec le même budget matériel - huit serveurs dotés de 64 Go de mémoire chacun (512 Go au total) - Milvus 2.5 peut charger au maximum 512 Go de données, ce qui équivaut à environ 136 millions de vecteurs.</p>
<p>Avec le stockage hiérarchisé activé dans Milvus 2.6+, le même matériel peut prendre en charge 2,2 To de données, soit environ 590 millions de vecteurs. Cela représente une augmentation de 4,3 fois de la capacité effective, ce qui permet de servir des ensembles de données beaucoup plus importants sans augmenter la mémoire locale.</p>
<p><strong>5. Réduction des coûts de 80,1</strong></p>
<p>En prenant pour exemple un ensemble de données vectorielles de 2 To dans un environnement AWS, et en supposant que 20 % des données sont chaudes (400 Go), la comparaison des coûts est la suivante :</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Article</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+ (Stockage hiérarchisé)</strong></th><th style="text-align:center"><strong>Économies</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Coût mensuel</td><td style="text-align:center">$11,802</td><td style="text-align:center">$2,343</td><td style="text-align:center">$9,459</td></tr>
<tr><td style="text-align:center">Coût annuel</td><td style="text-align:center">$141,624</td><td style="text-align:center">$28,116</td><td style="text-align:center">$113,508</td></tr>
<tr><td style="text-align:center">Taux d'économie</td><td style="text-align:center">-</td><td style="text-align:center">-</td><td style="text-align:center"><strong>80.1%</strong></td></tr>
</tbody>
</table>
<h3 id="Benchmark-Summary" class="common-anchor-header">Résumé de l'analyse comparative</h3><p>Dans tous les tests, le stockage hiérarchisé apporte des améliorations constantes et mesurables :</p>
<ul>
<li><p><strong>Temps de chargement 33 fois plus rapides :</strong> Le temps de chargement des collections est passé de <strong>25 minutes à 45 secondes</strong>.</p></li>
<li><p><strong>Réduction de 80 % de l'utilisation des ressources locales :</strong> En fonctionnement continu, l'utilisation de la mémoire et du disque local diminue d'environ <strong>80 %</strong>.</p></li>
<li><p><strong>Impact quasi nul sur les performances des données chaudes :</strong> La latence P99 pour les données chaudes augmente de <strong>moins de 10 %</strong>, ce qui préserve les performances des requêtes à faible latence.</p></li>
<li><p><strong>Latence contrôlée pour les données froides :</strong> Les données froides subissent une latence plus élevée lors du premier accès, mais cela est acceptable compte tenu de leur faible fréquence d'accès.</p></li>
<li><p><strong>Capacité effective 4,3 fois plus élevée :</strong> Le même matériel peut servir <strong>4 à 5 fois plus de données</strong> sans mémoire supplémentaire.</p></li>
<li><p><strong>Réduction des coûts de plus de 80 % :</strong> Les coûts annuels d'infrastructure sont réduits de <strong>plus de 80 %</strong>.</p></li>
</ul>
<h2 id="When-to-Use-Tiered-Storage-in-Milvus" class="common-anchor-header">Quand utiliser le stockage hiérarchisé dans Milvus ?<button data-href="#When-to-Use-Tiered-Storage-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Sur la base des résultats de l'analyse comparative et des cas de production réels, nous regroupons les cas d'utilisation du stockage hiérarchisé en trois catégories pour vous aider à décider s'il convient à votre charge de travail.</p>
<h3 id="Best-Fit-Use-Cases" class="common-anchor-header">Cas d'utilisation les mieux adaptés</h3><p><strong>1. Plates-formes de recherche vectorielle multi-locataires</strong></p>
<ul>
<li><p><strong>Caractéristiques :</strong> Grand nombre de locataires avec une activité très inégale ; la recherche vectorielle est la charge de travail principale.</p></li>
<li><p><strong>Modèle d'accès :</strong> Moins de 20 % des locataires génèrent plus de 80 % des requêtes vectorielles.</p></li>
<li><p><strong>Avantages escomptés :</strong> Réduction des coûts de 70 à 80 % ; augmentation de la capacité de 3 à 5 fois.</p></li>
</ul>
<p><strong>2. Systèmes de recommandation pour le commerce électronique (charges de travail de recherche vectorielle)</strong></p>
<ul>
<li><p><strong>Caractéristiques :</strong> Forte asymétrie de popularité entre les produits phares et la longue traîne.</p></li>
<li><p><strong>Modèle d'accès :</strong> Les 10 % de produits les plus populaires représentent ~80 % du trafic de recherche vectorielle.</p></li>
<li><p><strong>Avantages attendus :</strong> Pas de besoin de capacité supplémentaire pendant les périodes de pointe ; réduction des coûts de 60 à 70 %.</p></li>
</ul>
<p><strong>3. Ensembles de données à grande échelle avec une séparation claire entre le chaud et le froid (dominance vectorielle)</strong></p>
<ul>
<li><p><strong>Caractéristiques :</strong> Ensembles de données à l'échelle du TB ou plus, avec un accès fortement biaisé vers les données récentes.</p></li>
<li><p><strong>Schéma d'accès :</strong> Une distribution classique 80/20 : 20 % des données répondent à 80 % des requêtes.</p></li>
<li><p><strong>Avantages escomptés :</strong> Réduction des coûts de 75 à 85</p></li>
</ul>
<h3 id="Good-Fit-Use-Cases" class="common-anchor-header">Cas d'utilisation appropriés</h3><p><strong>1. Charges de travail sensibles aux coûts</strong></p>
<ul>
<li><p><strong>Caractéristiques :</strong> Budgets serrés avec une certaine tolérance pour des compromis mineurs en matière de performances.</p></li>
<li><p><strong>Modèle d'accès :</strong> Les requêtes vectorielles sont relativement concentrées.</p></li>
<li><p><strong>Avantages attendus :</strong> Réduction des coûts de 50 à 70 % ; les données froides peuvent entraîner une latence d'environ 500 ms lors du premier accès, ce qui doit être évalué en fonction des exigences de l'accord de niveau de service (SLA).</p></li>
</ul>
<p><strong>2. Conservation des données historiques et recherche dans les archives</strong></p>
<ul>
<li><p><strong>Caractéristiques :</strong> Gros volumes de vecteurs historiques avec une très faible fréquence d'interrogation.</p></li>
<li><p><strong>Modèle d'accès :</strong> Environ 90 % des requêtes portent sur des données récentes.</p></li>
<li><p><strong>Avantages escomptés :</strong> Conservation de l'ensemble des données historiques ; coûts d'infrastructure prévisibles et contrôlés.</p></li>
</ul>
<h3 id="Poor-Fit-Use-Cases" class="common-anchor-header">Cas d'utilisation mal adaptés</h3><p><strong>1. Charges de travail avec des données uniformément chaudes</strong></p>
<ul>
<li><p><strong>Caractéristiques :</strong> Toutes les données sont consultées à une fréquence similaire, sans distinction claire entre chaud et froid.</p></li>
<li><p><strong>Raisons de l'inadéquation :</strong> Avantages limités pour le cache ; complexité accrue du système sans gains significatifs.</p></li>
</ul>
<p><strong>2. Charges de travail à très faible latence</strong></p>
<ul>
<li><p><strong>Caractéristiques :</strong> Systèmes extrêmement sensibles à la latence, tels que les transactions financières ou les enchères en temps réel.</p></li>
<li><p><strong>Raisons de l'inadaptation :</strong> Les variations de latence, même minimes, sont inacceptables ; le chargement complet offre des performances plus prévisibles.</p></li>
</ul>
<h2 id="Quick-Start-Try-Tiered-Storage-in-Milvus-26+" class="common-anchor-header">Démarrage rapide : Essayez le stockage hiérarchisé dans Milvus 2.6+.<button data-href="#Quick-Start-Try-Tiered-Storage-in-Milvus-26+" class="anchor-icon" translate="no">
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
    </button></h2><pre><code translate="no"><span class="hljs-comment"># Download Milvus 2.6.1+</span>
$ wget https://github.com/milvus-io/milvus/releases/latest
<span class="hljs-comment"># Configure Tiered Storage</span>
$ vi milvus.yaml
queryNode.segcore.tieredStorage:
  warmup:
    scalarField: <span class="hljs-built_in">disable</span>
    scalarIndex: <span class="hljs-built_in">disable</span>
    vectorField: <span class="hljs-built_in">disable</span>
    vectorIndex: <span class="hljs-built_in">disable</span>
  evictionEnabled: <span class="hljs-literal">true</span>
<span class="hljs-comment"># Launch Milvus</span>
$ docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>Le stockage hiérarchisé dans Milvus 2.6 répond à une inadéquation courante entre la manière dont les données vectorielles sont stockées et la manière dont on y accède réellement. Dans la plupart des systèmes de production, seule une petite fraction des données est interrogée fréquemment, alors que les modèles de chargement traditionnels traitent toutes les données comme étant aussi chaudes les unes que les autres. En passant au chargement à la demande et en gérant la mémoire locale et le disque comme un cache, Milvus aligne la consommation des ressources sur le comportement réel des requêtes plutôt que sur les hypothèses les plus pessimistes.</p>
<p>Cette approche permet aux systèmes d'évoluer vers des ensembles de données plus importants sans augmentation proportionnelle des ressources locales, tout en maintenant les performances des requêtes à chaud largement inchangées. Les données froides restent accessibles en cas de besoin, avec une latence prévisible et limitée, ce qui rend le compromis explicite et contrôlable. À mesure que la recherche vectorielle s'implante dans les environnements de production sensibles aux coûts, multi-locataires et à long terme, le stockage hiérarchisé constitue une base pratique pour un fonctionnement efficace à grande échelle.</p>
<p>Pour plus d'informations sur le stockage hiérarchisé, consultez la documentation ci-dessous :</p>
<ul>
<li><a href="https://milvus.io/docs/tiered-storage-overview.md">Tiered Storage | Milvus Documentation</a></li>
</ul>
<p>Vous avez des questions ou souhaitez approfondir une fonctionnalité de la dernière version de Milvus ? Rejoignez notre<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou déposez des questions sur<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Vous pouvez également réserver une session individuelle de 20 minutes pour obtenir des informations, des conseils et des réponses à vos questions dans le cadre des<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
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
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">Rapprocher le filtrage géospatial et la recherche vectorielle avec les champs géométriques et RTREE dans Milvus 2.6</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">Présentation d'AISAQ dans Milvus : la recherche vectorielle à l'échelle du milliard vient d'être 3 200 fois moins coûteuse en mémoire</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">Optimisation de NVIDIA CAGRA dans Milvus : une approche hybride GPU-CPU pour une indexation plus rapide et des requêtes moins coûteuses</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH dans Milvus : l'arme secrète pour lutter contre les doublons dans les données d'entraînement LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">La compression vectorielle à l'extrême : comment Milvus répond à 3× plus de requêtes avec RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Les benchmarks mentent - les bases de données vectorielles méritent un vrai test </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Nous avons remplacé Kafka/Pulsar par un Woodpecker pour Milvus</a></p></li>
</ul>
