---
id: faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md
title: >-
  Optimisation de NVIDIA CAGRA dans Milvus : une approche hybride GPU-CPU pour
  une indexation plus rapide et des requêtes moins coûteuses
author: Marcelo Chen
date: 2025-12-10T00:00:00.000Z
cover: assets.zilliz.com/CAGRA_cover_7b9675965f.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus2.6, CAGRA, GPU, CPU, graph-based index'
meta_title: |
  Optimizing CAGRA in Milvus: A Hybrid GPU–CPU Approach
desc: >-
  Découvrez comment GPU_CAGRA dans Milvus 2.6 utilise les GPU pour la
  construction rapide de graphes et les CPU pour le service de requêtes
  évolutif.
origin: >-
  https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md
---
<p>À mesure que les systèmes d'IA passent de l'expérimentation à l'infrastructure de production, les bases de données vectorielles ne traitent plus des millions d'enchâssements. <strong>Des milliards sont désormais habituels, et des dizaines de milliards sont de plus en plus courants.</strong> À cette échelle, les choix algorithmiques affectent non seulement les performances et la mémorisation, mais se traduisent aussi directement par le coût de l'infrastructure.</p>
<p>Cela conduit à une question centrale pour les déploiements à grande échelle : <strong>comment choisir le bon index pour obtenir un rappel et une latence acceptables sans que l'utilisation des ressources de calcul ne devienne incontrôlable ?</strong></p>
<p>Les index basés sur des graphes tels que <strong>NSW, HNSW, CAGRA et Vamana</strong> sont devenus la réponse la plus largement adoptée. En naviguant dans des graphes de voisinage préconstruits, ces index permettent une recherche rapide du plus proche voisin à l'échelle du milliard, évitant ainsi le balayage brutal et la comparaison de chaque vecteur par rapport à la requête.</p>
<p>Cependant, le profil de coût de cette approche est inégal. <strong>L'interrogation d'un graphe est relativement bon marché, ce qui n'est pas le cas de sa construction.</strong> La construction d'un graphe de haute qualité nécessite des calculs de distance à grande échelle et un raffinement itératif sur l'ensemble du jeu de données - des charges que les ressources CPU traditionnelles ont du mal à gérer efficacement au fur et à mesure que les données augmentent.</p>
<p>CAGRA de NVIDIA s'attaque à ce goulot d'étranglement en utilisant les GPU pour accélérer la construction des graphes grâce à un parallélisme massif. Bien que cela réduise considérablement le temps de construction, le fait de s'appuyer sur les GPU pour la construction d'index et l'exécution de requêtes introduit des contraintes de coût et d'évolutivité plus élevées dans les environnements de production.</p>
<p>Pour équilibrer ces compromis, <a href="https://milvus.io/docs/release_notes.md#v261">Milvus 2.6.1</a> <strong>adopte une conception hybride pour les</strong> <strong>index</strong> <a href="https://milvus.io/docs/gpu-cagra.md">GPU_CAGRA</a>: <strong>Les GPU sont utilisés uniquement pour la construction des graphes, tandis que l'exécution des requêtes se fait sur les CPU.</strong> Cela permet de préserver les avantages qualitatifs des graphes construits par les GPU tout en maintenant l'évolutivité et la rentabilité de l'exécution des requêtes, ce qui est particulièrement bien adapté aux charges de travail avec des mises à jour de données peu fréquentes, des volumes de requêtes importants et une sensibilité stricte aux coûts.</p>
<h2 id="What-Is-CAGRA-and-How-Does-It-Work" class="common-anchor-header">Qu'est-ce que CAGRA et comment fonctionne-t-il ?<button data-href="#What-Is-CAGRA-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Les index vectoriels basés sur des graphes se répartissent généralement en deux grandes catégories :</p>
<ul>
<li><p>La<strong>construction itérative de graphes</strong>, représentée par <strong>CAGRA</strong> (déjà pris en charge dans Milvus).</p></li>
<li><p>La<strong>construction de graphe basée sur l'insertion</strong>, représentée par <strong>Vamana</strong> (actuellement en cours de développement dans Milvus).</p></li>
</ul>
<p>Ces deux approches diffèrent considérablement dans leurs objectifs de conception et leurs fondements techniques, ce qui les rend adaptées à des échelles de données et à des modèles de charge de travail différents.</p>
<p><strong>NVIDIA CAGRA (CUDA ANN Graph-based)</strong> est un algorithme natif du GPU pour la recherche approximative du plus proche voisin (ANN), conçu pour construire et interroger efficacement des graphes de proximité à grande échelle. En tirant parti du parallélisme des GPU, CAGRA accélère considérablement la construction des graphes et offre des performances d'interrogation à haut débit par rapport aux approches basées sur le CPU telles que HNSW.</p>
<p>CAGRA repose sur l'algorithme <strong>NN-Descent (Nearest Neighbor Descent)</strong>, qui construit un graphe k-nearest-neighbor (kNN) par raffinement itératif. À chaque itération, les voisins candidats sont évalués et mis à jour, ce qui permet de converger progressivement vers des relations de voisinage de meilleure qualité dans l'ensemble des données.</p>
<p>Après chaque tour d'affinage, CAGRA applique des techniques supplémentaires d'élagage des graphes, telles que l'<strong>élagage des détours à deux sauts, afin d'</strong>éliminer les arêtes redondantes tout en préservant la qualité de la recherche. Cette combinaison d'affinage et d'élagage itératifs permet d'obtenir un <strong>graphe compact, mais bien connecté</strong>, qui peut être parcouru efficacement au moment de la requête.</p>
<p>Grâce à l'affinage et à l'élagage répétés, CAGRA produit une structure de graphe qui permet un <strong>rappel élevé et une recherche du plus proche voisin à faible latence à grande échelle</strong>, ce qui la rend particulièrement bien adaptée aux ensembles de données statiques ou rarement mis à jour.</p>
<h3 id="Step-1-Building-the-Initial-Graph-with-NN-Descent" class="common-anchor-header">Étape 1 : Construction du graphe initial avec NN-Descent</h3><p>L'algorithme NN-Descent repose sur une observation simple mais puissante : si le nœud <em>u</em> est un voisin de <em>v</em> et que le nœud <em>w</em> est un voisin de <em>u</em>, alors <em>w</em> est très probablement un voisin de <em>v</em> également. Cette propriété transitive permet à l'algorithme de découvrir efficacement les vrais voisins les plus proches, sans comparer exhaustivement chaque paire de vecteurs.</p>
<p>CAGRA utilise NN-Descent comme algorithme principal de construction de graphe. Le processus se déroule comme suit</p>
<p><strong>1. Initialisation aléatoire :</strong> Chaque nœud commence avec un petit ensemble de voisins sélectionnés au hasard, formant ainsi un graphe initial approximatif.</p>
<p><strong>2. Expansion des voisins :</strong> À chaque itération, un nœud rassemble ses voisins actuels et leurs voisins pour former une liste de candidats. L'algorithme calcule les similitudes entre le nœud et tous les candidats. La liste des candidats de chaque nœud étant indépendante, ces calculs peuvent être assignés à des blocs de threads GPU distincts et exécutés en parallèle à grande échelle.</p>
<p><strong>3. Mise à jour de la liste des candidats :</strong> si l'algorithme trouve des candidats plus proches que les voisins actuels du nœud, il remplace les voisins les plus éloignés et met à jour la liste kNN du nœud. Sur plusieurs itérations, ce processus produit un graphe kNN approximatif de bien meilleure qualité.</p>
<p><strong>4. Vérification de la convergence :</strong> Au fur et à mesure des itérations, le nombre de mises à jour des voisins diminue. Une fois que le nombre de connexions mises à jour est inférieur à un seuil défini, l'algorithme s'arrête, indiquant que le graphe s'est effectivement stabilisé.</p>
<p>Étant donné que l'expansion des voisins et le calcul de la similarité pour les différents nœuds sont totalement indépendants, CAGRA fait correspondre la charge de travail NN-Descent de chaque nœud à un bloc de threads GPU dédié. Cette conception permet un parallélisme massif et rend la construction de graphes plusieurs fois plus rapide que les méthodes traditionnelles basées sur le CPU.</p>
<h3 id="Step-2-Pruning-the-Graph-with-2-Hop-Detours" class="common-anchor-header">Étape 2 : Élagage du graphe à l'aide de détours à 2 sauts</h3><p>Une fois la méthode NN-Descent terminée, le graphe obtenu est précis mais trop dense. NN-Descent conserve intentionnellement des voisins candidats supplémentaires, et la phase d'initialisation aléatoire introduit de nombreuses arêtes faibles ou non pertinentes. Par conséquent, chaque nœud se retrouve souvent avec un degré deux fois, voire plusieurs fois, plus élevé que le degré cible.</p>
<p>Pour produire un graphe compact et efficace, CAGRA applique un élagage des détours de 2 sauts.</p>
<p>L'idée est simple : si le nœud <em>A</em> peut atteindre le nœud <em>B</em> indirectement par l'intermédiaire d'un voisin commun <em>C</em> (formant un chemin A → C → B), et que la distance de ce chemin indirect est comparable à la distance directe entre <em>A</em> et <em>B</em>, alors l'arête directe A → B est considérée comme redondante et peut être supprimée.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_hop_detours_d15eae8702.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>L'un des principaux avantages de cette stratégie d'élagage est que la vérification de la redondance de chaque arête ne dépend que d'informations locales, à savoir les distances entre les deux points d'extrémité et leurs voisins communs. Comme chaque arête peut être évaluée indépendamment, l'étape d'élagage est hautement parallélisable et s'adapte naturellement à l'exécution par lots sur GPU.</p>
<p>Par conséquent, CAGRA peut élaguer le graphe efficacement sur les GPU, en réduisant les frais de stockage de <strong>40 à 50 %</strong> tout en préservant la précision de la recherche et en améliorant la vitesse de traversée pendant l'exécution de la requête.</p>
<h2 id="GPUCAGRA-in-Milvus-What’s-Different" class="common-anchor-header">GPU_CAGRA dans Milvus : qu'est-ce qui est différent ?<button data-href="#GPUCAGRA-in-Milvus-What’s-Different" class="anchor-icon" translate="no">
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
    </button></h2><p>Alors que les GPU offrent des avantages majeurs en termes de performances pour la construction de graphes, les environnements de production sont confrontés à un défi pratique : Les ressources GPU sont beaucoup plus chères et limitées que les CPU. Si la construction d'index et l'exécution de requêtes dépendent uniquement des GPU, plusieurs problèmes opérationnels apparaissent rapidement :</p>
<ul>
<li><p><strong>Faible utilisation des ressources :</strong> Le trafic des requêtes est souvent irrégulier et en rafale, ce qui laisse les GPU inactifs pendant de longues périodes et gaspille une capacité de calcul coûteuse.</p></li>
<li><p><strong>Coût de déploiement élevé :</strong> L'affectation d'un GPU à chaque instance de service de requête augmente les coûts matériels, même si la plupart des requêtes n'utilisent pas pleinement les performances du GPU.</p></li>
<li><p><strong>Évolutivité limitée :</strong> Le nombre de GPU disponibles conditionne directement le nombre de répliques de service que vous pouvez exécuter, ce qui limite votre capacité à évoluer en fonction de la demande.</p></li>
<li><p><strong>Flexibilité réduite :</strong> Lorsque la construction d'index et les requêtes dépendent des GPU, le système est lié à la disponibilité des GPU et ne peut pas facilement déplacer les charges de travail vers les CPU.</p></li>
</ul>
<p>Pour répondre à ces contraintes, Milvus 2.6.1 introduit un mode de déploiement flexible pour l'index GPU_CAGRA via le paramètre <code translate="no">adapt_for_cpu</code>. Ce mode permet un flux de travail hybride : CAGRA utilise le GPU pour construire un index graphique de haute qualité, tandis que l'exécution des requêtes s'effectue sur le CPU, en utilisant généralement HNSW comme algorithme de recherche.</p>
<p>Dans cette configuration, les GPU sont utilisés là où ils apportent le plus de valeur - construction rapide et très précise de l'index - tandis que les CPU gèrent les charges de travail des requêtes à grande échelle d'une manière beaucoup plus rentable et évolutive.</p>
<p>Par conséquent, cette approche hybride est particulièrement bien adaptée aux charges de travail dans les cas suivants</p>
<ul>
<li><p><strong>les mises à jour de données sont peu fréquentes</strong>, de sorte que les reconstructions d'index sont rares</p></li>
<li><p><strong>Le volume des requêtes est élevé</strong>, ce qui nécessite de nombreuses répliques peu coûteuses.</p></li>
<li><p><strong>La sensibilité aux coûts est élevée</strong> et l'utilisation des GPU doit être étroitement contrôlée.</p></li>
</ul>
<h3 id="Understanding-adaptforcpu" class="common-anchor-header">Comprendre <code translate="no">adapt_for_cpu</code></h3><p>Dans Milvus, le paramètre <code translate="no">adapt_for_cpu</code> contrôle la manière dont un index CAGRA est sérialisé sur le disque pendant la construction de l'index et la manière dont il est désérialisé en mémoire au moment du chargement. En modifiant ce paramètre au moment de la construction et du chargement, Milvus peut basculer de manière flexible entre la construction d'index basée sur le GPU et l'exécution de requêtes basée sur le CPU.</p>
<p>Différentes combinaisons de <code translate="no">adapt_for_cpu</code> au moment de la construction et du chargement donnent lieu à quatre modes d'exécution, chacun conçu pour un scénario opérationnel spécifique.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Temps de construction (<code translate="no">adapt_for_cpu</code>)</strong></th><th style="text-align:center"><strong>Temps de chargement (<code translate="no">adapt_for_cpu</code>)</strong></th><th style="text-align:center"><strong>Logique d'exécution</strong></th><th style="text-align:center"><strong>Scénario recommandé</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>vrai</strong></td><td style="text-align:center"><strong>vrai</strong></td><td style="text-align:center">Construction avec GPU_CAGRA → sérialisation en HNSW → désérialisation en HNSW → <strong>interrogation CPU</strong></td><td style="text-align:center">Charges de travail sensibles aux coûts ; service de requêtes à grande échelle</td></tr>
<tr><td style="text-align:center"><strong>vrai</strong></td><td style="text-align:center"><strong>faux</strong></td><td style="text-align:center">Construire avec GPU_CAGRA → sérialiser en HNSW → désérialiser en HNSW → <strong>interrogation CPU</strong></td><td style="text-align:center">Les requêtes suivantes sont renvoyées à l'unité centrale en cas de non-concordance des paramètres.</td></tr>
<tr><td style="text-align:center"><strong>faux</strong></td><td style="text-align:center"><strong>vrai</strong></td><td style="text-align:center">Construire avec GPU_CAGRA → sérialiser en CAGRA → désérialiser en HNSW → <strong>interrogation CPU</strong></td><td style="text-align:center">Conserver l'index CAGRA original pour le stockage tout en permettant une recherche temporaire par l'unité centrale.</td></tr>
<tr><td style="text-align:center"><strong>faux</strong></td><td style="text-align:center"><strong>faux</strong></td><td style="text-align:center">Construire avec GPU_CAGRA → sérialiser en CAGRA → désérialiser en CAGRA → <strong>interrogation GPU</strong></td><td style="text-align:center">Charges de travail critiques en termes de performances où le coût est secondaire</td></tr>
</tbody>
</table>
<p><strong>Remarque :</strong> le mécanisme <code translate="no">adapt_for_cpu</code> ne prend en charge que les conversions à sens unique. Un index CAGRA peut être converti en HNSW car la structure du graphe CAGRA préserve toutes les relations de voisinage dont HNSW a besoin. Toutefois, un index HNSW ne peut pas être reconverti en CAGRA, car il ne dispose pas des informations structurelles supplémentaires nécessaires pour les requêtes basées sur le GPU. Par conséquent, les paramètres du temps de construction doivent être sélectionnés avec soin, en tenant compte des exigences de déploiement et d'interrogation à long terme.</p>
<h2 id="Putting-GPUCAGRA-to-the-Test" class="common-anchor-header">Mise à l'épreuve de GPU_CAGRA<button data-href="#Putting-GPUCAGRA-to-the-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour évaluer l'efficacité du modèle d'exécution hybride - utilisant les GPU pour la construction de l'index et les CPU pour l'exécution des requêtes - nous avons mené une série d'expériences contrôlées dans un environnement standardisé. L'évaluation se concentre sur trois dimensions : la <strong>performance de la construction de l'index</strong>, la <strong>performance des requêtes</strong> et la <strong>précision du rappel</strong>.</p>
<p><strong>Configuration expérimentale</strong></p>
<p>Les expériences ont été réalisées sur du matériel standard largement adopté par l'industrie afin de s'assurer que les résultats restent fiables et largement applicables.</p>
<ul>
<li><p>CPU : Processeur MD EPYC 7R13 (16 cpus)</p></li>
<li><p>GPU : NVIDIA L4</p></li>
</ul>
<h3 id="1-Index-Build-Performance" class="common-anchor-header">1. Performance de la construction de l'index</h3><p>Nous comparons CAGRA construit sur le GPU avec HNSW construit sur le CPU, avec le même degré de graphe cible de 64.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cp1_a177200ab2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Principales conclusions</strong></p>
<ul>
<li><p><strong>GPU CAGRA construit des index 12-15× plus rapidement que CPU HNSW.</strong> Sur Cohere1M et Gist1M, CAGRA basé sur le GPU surpasse de manière significative HNSW basé sur le CPU, soulignant l'efficacité du parallélisme du GPU pendant la construction du graphe.</p></li>
<li><p><strong>Le temps de construction augmente linéairement avec les itérations NN-Descent.</strong> Au fur et à mesure que le nombre d'itérations augmente, le temps de construction croît de manière quasi-linéaire, reflétant la nature itérative du raffinement de la NN-Descent et fournissant un compromis prévisible entre le coût de construction et la qualité du graphe.</p></li>
</ul>
<h3 id="2-Query-performance" class="common-anchor-header">2. Performance des requêtes</h3><p>Dans cette expérience, le graphe CAGRA est construit une fois sur le GPU et ensuite interrogé en utilisant deux chemins d'exécution différents :</p>
<ul>
<li><p><strong>Requête CPU</strong>: l'index est désérialisé au format HNSW et recherché sur le CPU.</p></li>
<li><p><strong>Interrogation par le GPU</strong>: la recherche s'exécute directement sur le graphe CAGRA à l'aide d'un parcours basé sur le GPU.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cp2_bd00e60553.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Principales conclusions</strong></p>
<ul>
<li><p><strong>Le débit de recherche du GPU est 5 à 6 fois plus élevé que celui du CPU.</strong> Dans Cohere1M et Gist1M, la traversée basée sur le GPU fournit un QPS substantiellement plus élevé, soulignant l'efficacité de la navigation parallèle dans les graphes sur les GPU.</p></li>
<li><p><strong>Le rappel augmente avec les itérations de NN-Descent, puis plafonne.</strong> Au fur et à mesure que le nombre d'itérations de construction augmente, le rappel s'améliore à la fois pour les requêtes CPU et GPU. Cependant, au-delà d'un certain point, les itérations supplémentaires produisent des gains décroissants, ce qui indique que la qualité du graphe a largement convergé.</p></li>
</ul>
<h3 id="3-Recall-accuracy" class="common-anchor-header">3. Précision du rappel</h3><p>Dans cette expérience, CAGRA et HNSW sont interrogés sur le CPU afin de comparer le rappel dans des conditions d'interrogation identiques.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cp3_1a46a7bdda.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Principales conclusions</strong></p>
<p>CAGRA<strong>obtient un rappel plus élevé que HNSW sur les deux ensembles de données</strong>, ce qui montre que même lorsqu'un index CAGRA est construit sur le GPU et désérialisé pour la recherche sur le CPU, la qualité du graphe est bien préservée.</p>
<h2 id="What’s-Next-Scaling-Index-Construction-with-Vamana" class="common-anchor-header">Prochaines étapes : Mise à l'échelle de la construction d'index avec Vamana<button data-href="#What’s-Next-Scaling-Index-Construction-with-Vamana" class="anchor-icon" translate="no">
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
    </button></h2><p>L'approche hybride GPU-CPU de Milvus offre une solution pratique et rentable pour les charges de travail actuelles de recherche vectorielle à grande échelle. En construisant des graphes CAGRA de haute qualité sur les GPU et en servant les requêtes sur les CPU, elle combine une construction d'index rapide avec une exécution de requêtes évolutive et abordable, particulièrement<strong>bien adaptée aux charges de travail avec des mises à jour peu fréquentes, des volumes de requêtes élevés et des contraintes de coûts strictes</strong>.</p>
<p>À des échelles encore plus grandes - des dizaines<strong>ou des centaines de milliards de vecteurs -</strong>la construction d'<strong>index</strong>devient elle-même un goulot d'étranglement. Lorsque l'ensemble des données ne tient plus dans la mémoire du GPU, l'industrie se tourne généralement vers des méthodes de <strong>construction de graphe basées sur l'insertion,</strong> telles que <strong>Vamana</strong>. Au lieu de construire le graphe en une seule fois, Vamana traite les données par lots, en insérant progressivement de nouveaux vecteurs tout en maintenant la connectivité globale.</p>
<p>Son pipeline de construction suit trois étapes clés :</p>
<p><strong>1. Croissance géométrique des lots</strong> - en commençant par de petits lots pour former un squelette de graphe, puis en augmentant la taille des lots pour maximiser le parallélisme, et enfin en utilisant de grands lots pour affiner les détails.</p>
<p><strong>2. Insertion gourmande</strong> - chaque nouveau nœud est inséré en naviguant à partir d'un point d'entrée central, en affinant itérativement son ensemble de voisins.</p>
<p><strong>3. Mise à jour des arêtes rétrogrades</strong> - ajout de connexions inverses pour préserver la symétrie et assurer une navigation efficace dans le graphe.</p>
<p>L'élagage est intégré directement dans le processus de construction en utilisant le critère α-RNG : si un voisin candidat <em>v</em> est déjà couvert par un voisin existant <em>p′</em> (c'est-à-dire, <em>d(p′, v) &lt; α × d(p, v)</em>), alors <em>v</em> est élagué. Le paramètre α permet un contrôle précis de l'éparpillement et de la précision. L'accélération GPU est obtenue grâce au parallélisme in-batch et à la mise à l'échelle géométrique des lots, ce qui permet de trouver un équilibre entre la qualité de l'index et le débit.</p>
<p>Ensemble, ces techniques permettent aux équipes de gérer la croissance rapide des données et les mises à jour d'index à grande échelle sans se heurter aux limites de la mémoire du GPU.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/One_more_thing_b458360e25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>L'équipe Milvus développe activement la prise en charge de Vamana, avec une sortie prévue au premier semestre 2026. Restez à l'écoute.</p>
<p>Vous avez des questions ou souhaitez approfondir l'une des fonctionnalités de la dernière version de Milvus ? Rejoignez notre<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou déposez des questions sur<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Vous pouvez également réserver une session individuelle de 20 minutes pour obtenir des informations, des conseils et des réponses à vos questions dans le cadre des<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
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
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Nous avons remplacé Kafka/Pulsar par un Woodpecker pour Milvus</a></p></li>
</ul>
