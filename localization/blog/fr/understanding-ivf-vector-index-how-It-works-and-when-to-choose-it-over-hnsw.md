---
id: understanding-ivf-vector-index-how-It-works-and-when-to-choose-it-over-hnsw.md
title: >-
  Comprendre l'indice vectoriel de la FIV : Comment il fonctionne et quand le
  choisir plutôt que le HNSW
author: Jack Li
date: 2025-10-27T00:00:00.000Z
cover: assets.zilliz.com/ivf_1bbe0e9f85.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'IVF, ANN, HNSW, vector index, vector database'
meta_title: How to Choose Between IVF and HNSW for ANN Vector Search
desc: >-
  Découvrez comment fonctionne l'index vectoriel IVF, comment il accélère la
  recherche ANN et quand il surpasse le HNSW en termes de vitesse, de mémoire et
  d'efficacité de filtrage.
origin: >-
  https://milvus.io/blog/understanding-ivf-vector-index-how-It-works-and-when-to-choose-it-over-hnsw.md
---
<p>Dans une base de données vectorielles, il est souvent nécessaire de trouver rapidement les résultats les plus similaires parmi de vastes collections de vecteurs à haute dimension, tels que des caractéristiques d'images, des intégrations de texte ou des représentations audio. Sans index, la seule option consiste à comparer le vecteur de la requête à chaque vecteur de l'ensemble de données. Cette <strong>recherche brute</strong> peut fonctionner lorsque vous avez quelques milliers de vecteurs, mais dès que vous avez affaire à des dizaines ou des centaines de millions, elle devient insupportablement lente et coûteuse en termes de calcul.</p>
<p>C'est là qu'intervient la recherche par <strong>approximation des plus proches voisins (ANN)</strong>. Imaginez que vous cherchiez un livre spécifique dans une immense bibliothèque. Au lieu de consulter chaque livre un par un, vous commencez par parcourir les sections les plus susceptibles de contenir ce livre. Vous n'obtiendrez peut-être pas <em>exactement</em> les mêmes résultats qu'avec une recherche complète, mais vous vous en rapprocherez beaucoup, et ce en une fraction du temps. En bref, l'ANN échange une légère perte de précision contre une augmentation significative de la vitesse et de l'évolutivité.</p>
<p>Parmi les nombreuses façons de mettre en œuvre la recherche ANN, <strong>IVF (Inverted File)</strong> et <strong>HNSW (Hierarchical Navigable Small World)</strong> sont deux des plus utilisées. Mais l'IVF se distingue par son efficacité et son adaptabilité à la recherche vectorielle à grande échelle. Dans cet article, nous vous expliquons comment fonctionne la FVI et comment elle se compare à la HNSW, afin que vous puissiez comprendre leurs avantages et choisir celle qui convient le mieux à votre charge de travail.</p>
<h2 id="What-is-an-IVF-Vector-Index" class="common-anchor-header">Qu'est-ce qu'un index vectoriel FVI ?<button data-href="#What-is-an-IVF-Vector-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>Le<strong>FVI (fichier inversé)</strong> est l'un des algorithmes les plus largement utilisés pour le RNA. Il emprunte son idée principale à l'"index inversé" utilisé dans les systèmes de recherche de texte - sauf que cette fois, au lieu de mots et de documents, nous avons affaire à des vecteurs dans un espace à haute dimension.</p>
<p>Imaginez l'organisation d'une immense bibliothèque. Si vous déposez tous les livres (vecteurs) dans une pile géante, il vous faudra une éternité pour trouver ce dont vous avez besoin. La FIV résout ce problème en commençant par <strong>regrouper</strong> tous les vecteurs en groupes, ou <em>godets</em>. Chaque groupe représente une "catégorie" de vecteurs similaires, définie par un <strong>centroïde - une</strong>sorte de résumé ou d'"étiquette" pour tout ce qui se trouve à l'intérieur de ce groupe.</p>
<p>Lorsqu'une requête arrive, la recherche s'effectue en deux étapes :</p>
<p><strong>1. Trouver les grappes les plus proches.</strong> Le système recherche les quelques groupes dont les centroïdes sont les plus proches du vecteur de la requête, comme s'il se dirigeait directement vers les deux ou trois sections de la bibliothèque les plus susceptibles de contenir votre livre.</p>
<p><strong>2. Effectuez une recherche au sein de ces groupes.</strong> Une fois que vous êtes dans les bonnes sections, vous n'avez plus qu'à parcourir un petit ensemble de livres au lieu de l'ensemble de la bibliothèque.</p>
<p>Cette approche permet de réduire la quantité de calculs de plusieurs ordres de grandeur. Vous obtenez toujours des résultats très précis, mais beaucoup plus rapidement.</p>
<h2 id="How-to-Build-an-IVF-Vector-Index" class="common-anchor-header">Comment construire un index vectoriel FVI<button data-href="#How-to-Build-an-IVF-Vector-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>Le processus de construction d'un index vectoriel FVI comprend trois étapes principales : Le regroupement K-means, l'affectation des vecteurs et le codage de la compression (facultatif). Le processus complet se présente comme suit :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ivf_building_process_90c2966975.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-1-K-means-Clustering" class="common-anchor-header">Étape 1 : Regroupement par K-moyennes</h3><p>Tout d'abord, exécutez le regroupement K-Means sur l'ensemble de données X pour diviser l'espace vectoriel à haute dimension en n listes de grappes. Chaque groupe est représenté par un centroïde, qui est stocké dans la table des centroïdes C. Le nombre de centroïdes, nlist, est un hyperparamètre clé qui détermine la finesse du regroupement.</p>
<p>Voici comment fonctionne la méthode k-means :</p>
<ul>
<li><p><strong>Initialisation :</strong> Sélection aléatoire des vecteurs <em>nlist</em> comme centroïdes initiaux.</p></li>
<li><p><strong>Affectation :</strong> Pour chaque vecteur, calculez sa distance par rapport à tous les centroïdes et affectez-le au plus proche.</p></li>
<li><p><strong>Mise à jour :</strong> Pour chaque groupe, calculez la moyenne de ses vecteurs et définissez-la comme nouveau centroïde.</p></li>
<li><p><strong>Itération et convergence :</strong> Répéter l'affectation et la mise à jour jusqu'à ce que les centroïdes cessent de changer de manière significative ou qu'un nombre maximal d'itérations soit atteint.</p></li>
</ul>
<p>Une fois que k-means converge, les centroïdes de la liste résultante forment le "répertoire d'index" de la FVI. Ils définissent la manière dont l'ensemble de données est grossièrement partitionné, ce qui permet aux requêtes de réduire rapidement l'espace de recherche par la suite.</p>
<p>Revenons à l'analogie de la bibliothèque : former des centroïdes revient à décider comment regrouper les livres par thème :</p>
<ul>
<li><p>Une liste n plus grande signifie plus de sections, chacune avec moins de livres plus spécifiques.</p></li>
<li><p>Une liste plus petite signifie moins de sections, chacune couvrant un éventail de sujets plus large et plus varié.</p></li>
</ul>
<h3 id="Step-2-Vector-Assignment" class="common-anchor-header">Étape 2 : Affectation des vecteurs</h3><p>Ensuite, chaque vecteur est affecté à la grappe dont le centroïde est le plus proche, formant ainsi des listes inversées (List_i). Chaque liste inversée stocke les identifiants et les informations de stockage de tous les vecteurs appartenant à cette grappe.</p>
<p>Cette étape peut être comparée au classement des livres dans leurs sections respectives. Lorsque vous rechercherez un titre plus tard, vous n'aurez qu'à consulter les quelques sections qui sont les plus susceptibles de le contenir, au lieu de parcourir toute la bibliothèque.</p>
<h3 id="Step-3-Compression-Encoding-Optional" class="common-anchor-header">Étape 3 : Codage de compression (facultatif)</h3><p>Pour économiser de la mémoire et accélérer les calculs, les vecteurs de chaque groupe peuvent être soumis à un codage de compression. Il existe deux approches courantes :</p>
<ul>
<li><p><strong>SQ8 (quantification scalaire) :</strong> Cette méthode quantifie chaque dimension d'un vecteur en 8 bits. Pour un vecteur standard <code translate="no">float32</code>, chaque dimension occupe généralement 4 octets. Avec SQ8, elle est réduite à 1 octet seulement, ce qui permet d'obtenir un taux de compression de 4:1 tout en conservant la géométrie du vecteur largement intacte.</p></li>
<li><p><strong>PQ (quantification du produit) :</strong> Elle divise un vecteur de haute dimension en plusieurs sous-espaces. Par exemple, un vecteur de 128 dimensions peut être divisé en 8 sous-vecteurs de 16 dimensions chacun. Dans chaque sous-espace, un petit livre de codes (généralement avec 256 entrées) est entraîné au préalable, et chaque sous-vecteur est représenté par un index de 8 bits pointant vers l'entrée du livre de codes la plus proche. Cela signifie que le vecteur original 128-D <code translate="no">float32</code> (qui nécessite 512 octets) peut être représenté en utilisant seulement 8 octets (8 sous-espaces × 1 octet chacun), ce qui permet d'obtenir un taux de compression de 64:1.</p></li>
</ul>
<h2 id="How-to-Use-the-IVF-Vector-Index-for-Search" class="common-anchor-header">Comment utiliser l'index vectoriel FVI pour la recherche ?<button data-href="#How-to-Use-the-IVF-Vector-Index-for-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Une fois que la table des centroïdes, les listes inversées, le codeur de compression et les livres de codes (optionnels) sont construits, l'index IVF peut être utilisé pour accélérer la recherche de similarités. Le processus comporte généralement trois étapes principales, comme indiqué ci-dessous :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ivf_search_process_025d3f444f.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-1-Calculate-distances-from-the-query-vector-to-all-centroids" class="common-anchor-header">Étape 1 : Calcul des distances entre le vecteur d'interrogation et tous les centroïdes</h3><p>Lorsqu'un vecteur de requête q arrive, le système détermine d'abord les groupes auxquels il est le plus susceptible d'appartenir. Il calcule ensuite la distance entre q et chaque centroïde de la table des centroïdes C, en utilisant généralement la distance euclidienne ou le produit intérieur comme métrique de similarité. Les centroïdes sont ensuite triés en fonction de leur distance par rapport au vecteur de la requête, ce qui produit une liste ordonnée du plus proche au plus éloigné.</p>
<p>Par exemple, comme le montre l'illustration, l'ordre est le suivant : C4 &lt; C2 &lt; C1 &lt; C3 &lt; C5.</p>
<h3 id="Step-2-Select-the-nearest-nprobe-clusters" class="common-anchor-header">Étape 2 : Sélection des grappes nprobe les plus proches</h3><p>Pour éviter de parcourir l'ensemble des données, IVF ne recherche que les <em>n</em> premiers clusters les plus proches du vecteur d'interrogation.</p>
<p>Le paramètre nprobe définit l'étendue de la recherche et affecte directement l'équilibre entre la vitesse et le rappel :</p>
<ul>
<li><p>Un nprobe plus petit conduit à des requêtes plus rapides mais peut réduire le rappel.</p></li>
<li><p>Un nprobe plus grand améliore le rappel mais augmente la latence.</p></li>
</ul>
<p>Dans les systèmes réels, nprobe peut être réglé dynamiquement en fonction du budget de latence ou des exigences de précision. Dans l'exemple ci-dessus, si nprobe = 2, le système ne recherchera que dans les clusters 2 et 4, les deux clusters les plus proches.</p>
<h3 id="Step-3-Search-the-nearest-neighbor-in-the-selected-clusters" class="common-anchor-header">Étape 3 : recherche du voisin le plus proche dans les grappes sélectionnées</h3><p>Une fois les grappes candidates sélectionnées, le système compare le vecteur de requête q avec les vecteurs stockés dans ces grappes. Il existe deux modes principaux de comparaison :</p>
<ul>
<li><p><strong>Comparaison exacte (IVF_FLAT)</strong>: Le système récupère les vecteurs originaux des grappes sélectionnées et calcule directement leurs distances par rapport à q, ce qui donne les résultats les plus précis.</p></li>
<li><p><strong>Comparaison approximative (IVF_PQ / IVF_SQ8)</strong>: Lorsque la compression PQ ou SQ8 est utilisée, le système emploie une <strong>méthode de table de recherche</strong> pour accélérer le calcul de la distance. Avant le début de la recherche, il calcule au préalable les distances entre le vecteur de la requête et chaque entrée du livre de codes. Ensuite, pour chaque vecteur, il peut simplement "rechercher et additionner" ces distances précalculées pour estimer la similarité.</p></li>
</ul>
<p>Enfin, les résultats candidats de toutes les grappes recherchées sont fusionnés et reclassés, ce qui permet d'obtenir le Top-k des vecteurs les plus similaires comme résultat final.</p>
<h2 id="IVF-In-Practice" class="common-anchor-header">La FIV en pratique<button data-href="#IVF-In-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p>Une fois que vous avez compris comment les index vectoriels IVF sont <strong>construits</strong> et <strong>recherchés</strong>, l'étape suivante consiste à les appliquer à des charges de travail réelles. Dans la pratique, vous devrez souvent trouver un équilibre entre les <strong>performances</strong>, la <strong>précision</strong> et l'<strong>utilisation de la mémoire</strong>. Voici quelques conseils pratiques tirés de l'expérience des ingénieurs.</p>
<h3 id="How-to-Choose-the-Right-nlist" class="common-anchor-header">Comment choisir la bonne nlist</h3><p>Comme nous l'avons déjà mentionné, le paramètre nlist détermine le nombre de clusters dans lesquels l'ensemble de données est divisé lors de la construction d'un index FVI.</p>
<ul>
<li><p><strong>Un nlist plus grand</strong>: Crée des grappes plus fines, ce qui signifie que chaque grappe contient moins de vecteurs. Cela réduit le nombre de vecteurs analysés lors de la recherche et permet généralement d'obtenir des requêtes plus rapides. Mais la construction de l'index prend plus de temps et la table des centroïdes consomme plus de mémoire.</p></li>
<li><p><strong>Liste n plus petite</strong>: Accélère la construction de l'index et réduit l'utilisation de la mémoire, mais chaque cluster devient plus "encombré". Chaque requête doit analyser plus de vecteurs au sein d'une grappe, ce qui peut entraîner des goulets d'étranglement au niveau des performances.</p></li>
</ul>
<p>Sur la base de ces compromis, voici une règle pratique :</p>
<p>Pour les ensembles de données à l <strong>'échelle du million</strong>, un bon point de départ est <strong>nlist ≈ √n</strong> (n est le nombre de vecteurs dans le nuage de données indexé).</p>
<p>Par exemple, si vous avez 1 million de vecteurs, essayez nlist = 1 000. Pour les ensembles de données plus importants - des dizaines ou des centaines de millions - la plupart des bases de données vectorielles divisent les données de sorte que chaque groupe contienne environ un million de vecteurs, ce qui rend cette règle pratique.</p>
<p>Comme nlist est fixé lors de la création de l'index, sa modification ultérieure implique la reconstruction de l'index entier. Il est donc préférable d'expérimenter dès le début. Testez plusieurs valeurs - idéalement en puissances de deux (par exemple, 1024, 2048) - pour trouver le bon équilibre entre la vitesse, la précision et la mémoire pour votre charge de travail.</p>
<h3 id="How-to-Tune-nprobe" class="common-anchor-header">Comment régler nprobe</h3><p>Le paramètre nprobe contrôle le nombre de clusters recherchés pendant la durée de la requête. Il affecte directement le compromis entre le rappel et la latence.</p>
<ul>
<li><p><strong>Un nprobe plus grand</strong>: couvre plus de grappes, ce qui entraîne un rappel plus élevé, mais aussi un temps de latence plus important. Le délai augmente généralement de façon linéaire avec le nombre de grappes recherchées.</p></li>
<li><p><strong>Nprobe plus petit</strong>: La recherche porte sur moins de grappes, ce qui se traduit par un temps de latence plus faible et des requêtes plus rapides. Cependant, il peut manquer certains vrais plus proches voisins, ce qui réduit légèrement le rappel et la précision des résultats.</p></li>
</ul>
<p>Si votre application n'est pas extrêmement sensible à la latence, c'est une bonne idée d'expérimenter nprobe de manière dynamique, par exemple en testant des valeurs de 1 à 16 pour observer l'évolution du rappel et de la latence. L'objectif est de trouver le point idéal où le rappel est acceptable et où la latence reste dans la fourchette que vous vous êtes fixée.</p>
<p>Étant donné que nprobe est un paramètre de recherche en cours d'exécution, il peut être ajusté à la volée sans qu'il soit nécessaire de reconstruire l'index. Cela permet un réglage rapide, peu coûteux et très flexible pour différentes charges de travail ou scénarios de requête.</p>
<h3 id="Common-Variants-of-the-IVF-Index" class="common-anchor-header">Variantes courantes de l'index IVF</h3><p>Lors de la construction d'un index IVF, vous devrez décider si vous souhaitez utiliser un encodage de compression pour les vecteurs de chaque cluster et, le cas échéant, quelle méthode utiliser.</p>
<p>Il en résulte trois variantes courantes d'index FVI :</p>
<table>
<thead>
<tr><th><strong>Variante FVI</strong></th><th><strong>Caractéristiques principales</strong></th><th><strong>Cas d'utilisation</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>IVF_FLAT</strong></td><td>Stocke les vecteurs bruts dans chaque grappe sans compression. Offre la plus grande précision, mais consomme également le plus de mémoire.</td><td>Idéal pour les ensembles de données de taille moyenne (jusqu'à des centaines de millions de vecteurs) pour lesquels un rappel élevé (95 %+) est nécessaire.</td></tr>
<tr><td><strong>IVF_PQ</strong></td><td>Applique la quantification par produit (PQ) pour compresser les vecteurs au sein des clusters. En ajustant le taux de compression, l'utilisation de la mémoire peut être considérablement réduite.</td><td>Convient à la recherche de vecteurs à grande échelle (des centaines de millions ou plus) où une certaine perte de précision est acceptable. Avec un taux de compression de 64:1, le rappel est généralement d'environ 70 %, mais peut atteindre 90 % ou plus en réduisant le taux de compression.</td></tr>
<tr><td><strong>IVF_SQ8</strong></td><td>Utilise la quantification scalaire (SQ8) pour quantifier les vecteurs. L'utilisation de la mémoire se situe entre IVF_FLAT et IVF_PQ.</td><td>Idéal pour la recherche vectorielle à grande échelle où vous devez maintenir un rappel relativement élevé (90%+) tout en améliorant l'efficacité.</td></tr>
</tbody>
</table>
<h2 id="IVF-vs-HNSW-Pick-What-Fits" class="common-anchor-header">IVF vs HNSW : choisissez ce qui vous convient<button data-href="#IVF-vs-HNSW-Pick-What-Fits" class="anchor-icon" translate="no">
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
    </button></h2><p>Outre l'IVF, le <strong>HNSW (Hierarchical Navigable Small World)</strong> est un autre index vectoriel en mémoire largement utilisé. Le tableau ci-dessous met en évidence les principales différences entre les deux.</p>
<table>
<thead>
<tr><th></th><th><strong>FIV</strong></th><th><strong>HNSW</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Algorithme Concept</strong></td><td>Clustering et bucketing</td><td>Navigation dans un graphe multicouche</td></tr>
<tr><td><strong>Utilisation de la mémoire</strong></td><td>Relativement faible</td><td>Relativement élevée</td></tr>
<tr><td><strong>Vitesse de construction de l'index</strong></td><td>Rapide (ne nécessite qu'une mise en grappe)</td><td>Lente (nécessite la construction d'un graphe multicouche)</td></tr>
<tr><td><strong>Vitesse d'interrogation (sans filtrage)</strong></td><td>Rapide, dépend de <em>nprobe</em></td><td>Extrêmement rapide, mais avec une complexité logarithmique</td></tr>
<tr><td><strong>Vitesse d'interrogation (avec filtrage)</strong></td><td>Stable - effectue un filtrage grossier au niveau du centroïde pour réduire le nombre de candidats.</td><td>Instable - en particulier lorsque le taux de filtrage est élevé (90%+), le graphe devient fragmenté et peut se dégrader jusqu'à une traversée presque complète du graphe, encore plus lente qu'une recherche par force brute.</td></tr>
<tr><td><strong>Taux de rappel</strong></td><td>Dépend de l'utilisation ou non de la compression ; sans quantification, le taux de rappel peut atteindre <strong>95 %+</strong>.</td><td>Généralement plus élevé, autour de <strong>98 %+</strong>.</td></tr>
<tr><td><strong>Paramètres clés</strong></td><td><em>nlist</em>, <em>nprobe</em></td><td><em>m</em>, <em>ef_construction</em>, <em>ef_search</em></td></tr>
<tr><td><strong>Cas d'utilisation</strong></td><td>Lorsque la mémoire est limitée, mais que des performances de requête et de rappel élevées sont requises ; bien adapté aux recherches avec conditions de filtrage</td><td>Lorsque la mémoire est suffisante et que l'objectif est d'obtenir un rappel et des performances d'interrogation extrêmement élevés, mais que le filtrage n'est pas nécessaire ou que le taux de filtrage est faible.</td></tr>
</tbody>
</table>
<p>Dans les applications réelles, il est très courant d'inclure des conditions de filtrage - par exemple, "ne rechercher que les vecteurs d'un utilisateur spécifique" ou "limiter les résultats à une certaine période de temps". En raison des différences entre leurs algorithmes sous-jacents, le FVI traite généralement les recherches filtrées de manière plus efficace que le HNSW.</p>
<p>La force de l'IVF réside dans son processus de filtrage à deux niveaux. Il peut d'abord effectuer un filtrage grossier au niveau du centroïde (grappe) pour réduire rapidement l'ensemble des candidats, puis effectuer des calculs de distance plus fins au sein des grappes sélectionnées. Cela permet de maintenir des performances stables et prévisibles, même lorsqu'une grande partie des données est filtrée.</p>
<p>En revanche, HNSW est basé sur la traversée de graphes. En raison de sa structure, il ne peut pas exploiter directement les conditions de filtrage pendant la traversée. Lorsque le taux de filtrage est faible, cela ne pose pas de problème majeur. Cependant, lorsque le taux de filtrage est élevé (par exemple, plus de 90 % des données sont filtrées), le graphe restant est souvent fragmenté, formant de nombreux "nœuds isolés". Dans ce cas, la recherche peut se dégrader en une traversée presque complète du graphe, parfois même pire qu'une recherche par force brute.</p>
<p>Dans la pratique, les index FVI permettent déjà de réaliser de nombreux cas d'utilisation à fort impact dans différents domaines :</p>
<ul>
<li><p><strong>Recherche dans le domaine du commerce électronique :</strong> Un utilisateur peut télécharger une image de produit et trouver instantanément des articles visuellement similaires parmi des millions de listes.</p></li>
<li><p><strong>Recherche de brevets :</strong> À partir d'une courte description, le système peut localiser les brevets les plus sémantiquement liés à partir d'une base de données massive, ce qui est beaucoup plus efficace que la recherche traditionnelle par mots-clés.</p></li>
<li><p><strong>Bases de connaissances RAG :</strong> L'IVF permet d'extraire le contexte le plus pertinent de millions de documents de locataires, ce qui garantit que les modèles d'IA génèrent des réponses plus précises et mieux fondées.</p></li>
</ul>
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
    </button></h2><p>Pour choisir le bon index, tout dépend de votre cas d'utilisation spécifique. Si vous travaillez avec des ensembles de données à grande échelle ou si vous avez besoin de prendre en charge des recherches filtrées, l'IVF peut être la solution la mieux adaptée. Comparé aux index basés sur des graphes comme HNSW, IVF permet de construire des index plus rapidement, d'utiliser moins de mémoire et d'obtenir un bon équilibre entre vitesse et précision.</p>
<p><a href="https://milvus.io/">Milvus</a>, la base de données vectorielles open-source la plus populaire, prend en charge l'ensemble de la famille IVF, y compris IVF_FLAT, IVF_PQ et IVF_SQ8. Vous pouvez facilement expérimenter ces types d'index et trouver la configuration qui correspond le mieux à vos besoins en termes de performances et de mémoire. Pour obtenir une liste complète des index pris en charge par Milvus, consultez la <a href="https://milvus.io/docs/index-explained.md">page de la documentation sur les index Milvus</a>.</p>
<p>Si vous construisez des systèmes de recherche d'images, de recommandation ou des bases de connaissances RAG, essayez l'indexation IVF dans Milvus et découvrez l'efficacité de la recherche vectorielle à grande échelle en action.</p>
