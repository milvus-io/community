---
id: >-
  unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md
title: >-
  Déverrouiller la recherche au niveau de l'entité : Nouvelles capacités de
  tableaux de structures et de MAX_SIM dans Milvus
author: 'Jeremy Zhu, Min Tian'
date: 2025-12-05T00:00:00.000Z
cover: assets.zilliz.com/Array_of_Structs_new_cover_1_d742c413ab.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Array of Structs, MAX_SIM, vector database, multi-vector retrieval'
meta_title: |
  Array of Structs in Milvus: Entity-Level Multi-Vector Retrieval
desc: >-
  Découvrez comment Array of Structs et MAX_SIM dans Milvus permettent une
  véritable recherche au niveau de l'entité pour les données multi-vectorielles,
  en éliminant le dédoublonnage et en améliorant la précision de la recherche.
origin: >-
  https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md
---
<p>Si vous avez développé des applications d'intelligence artificielle à partir de bases de données vectorielles, vous avez probablement rencontré le même problème : la base de données récupère les encastrements de morceaux individuels, alors que votre application se préoccupe des <strong><em>entités</em>.</strong> Ce décalage rend l'ensemble du flux de travail de récupération complexe.</p>
<p>Vous avez probablement vu cette situation se répéter à maintes reprises :</p>
<ul>
<li><p><strong>Bases de connaissances RAG :</strong> Les articles sont découpés en fragments de paragraphes, de sorte que le moteur de recherche renvoie des fragments épars au lieu du document complet.</p></li>
<li><p><strong>Recommandation pour le commerce électronique :</strong> Un produit a plusieurs images intégrées, et votre système renvoie cinq angles du même article au lieu de cinq produits uniques.</p></li>
<li><p><strong>Plateformes vidéo :</strong> Les vidéos sont divisées en clips intégrés, mais les résultats de recherche font apparaître des tranches de la même vidéo plutôt qu'une seule entrée consolidée.</p></li>
<li><p><strong>Recherche de type ColBERT / ColPali :</strong> Les documents s'étendent sur des centaines de jetons ou de patchs, et vos résultats apparaissent sous forme de minuscules morceaux qui doivent encore être fusionnés.</p></li>
</ul>
<p>Tous ces problèmes découlent de la <em>même lacune architecturale</em>: la plupart des bases de données vectorielles traitent chaque intégration comme une ligne isolée, alors que les applications réelles opèrent sur des entités de plus haut niveau - documents, produits, vidéos, articles, scènes. Par conséquent, les équipes d'ingénieurs sont obligées de reconstruire les entités manuellement en utilisant la logique de déduplication, de regroupement, de mise en bacs et de reclassement. Cela fonctionne, mais c'est fragile, lent et gonfle votre couche d'application avec une logique qui n'aurait jamais dû s'y trouver.</p>
<p><a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6.4</a> comble cette lacune avec une nouvelle fonctionnalité : <a href="https://milvus.io/docs/array-of-structs.md"><strong>Les tableaux de structures</strong></a> avec le type métrique <strong>MAX_SIM</strong>. Ensemble, ils permettent à tous les embeddings d'une même entité d'être stockés dans un seul enregistrement et permettent à Milvus de noter et de renvoyer l'entité de manière holistique. Finis les ensembles de résultats remplis en double. Plus de post-traitement complexe comme le reranking et la fusion.</p>
<p>Dans cet article, nous verrons comment fonctionnent les tableaux de structures et MAX_SIM, et nous les démontrerons à l'aide de deux exemples réels : La recherche de documents dans Wikipédia et la recherche de documents basée sur des images dans ColPali.</p>
<h2 id="What-is-an-Array-of-Structs" class="common-anchor-header">Qu'est-ce qu'un tableau de structures ?<button data-href="#What-is-an-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans Milvus, un champ <strong>Tableau de structures</strong> permet à un enregistrement unique de contenir une <em>liste ordonnée</em> d'éléments Struct, chacun suivant le même schéma prédéfini. Une structure peut contenir plusieurs vecteurs ainsi que des champs scalaires, des chaînes de caractères ou tout autre type pris en charge. En d'autres termes, elle vous permet de regrouper tous les éléments appartenant à une entité - enchâssements de paragraphes, vues d'images, vecteurs de jetons, métadonnées - directement à l'intérieur d'une ligne.</p>
<p>Voici un exemple d'entité issue d'une collection qui contient un champ Array of Structs.</p>
<pre><code translate="no">{
    <span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">0</span>,
    <span class="hljs-string">&#x27;title&#x27;</span>: <span class="hljs-string">&#x27;Walden&#x27;</span>,
    <span class="hljs-string">&#x27;title_vector&#x27;</span>: [<span class="hljs-number">0.1</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.3</span>, <span class="hljs-number">0.4</span>, <span class="hljs-number">0.5</span>],
    <span class="hljs-string">&#x27;author&#x27;</span>: <span class="hljs-string">&#x27;Henry David Thoreau&#x27;</span>,
    <span class="hljs-string">&#x27;year_of_publication&#x27;</span>: <span class="hljs-number">1845</span>,
    <span class="hljs-comment">// highlight-start</span>
    <span class="hljs-string">&#x27;chunks&#x27;</span>: [
        {
            <span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;When I wrote the following pages, or rather the bulk of them...&#x27;</span>,
            <span class="hljs-string">&#x27;text_vector&#x27;</span>: [<span class="hljs-number">0.3</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.3</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.5</span>],
            <span class="hljs-string">&#x27;chapter&#x27;</span>: <span class="hljs-string">&#x27;Economy&#x27;</span>,
        },
        {
            <span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;I would fain say something, not so much concerning the Chinese and...&#x27;</span>,
            <span class="hljs-string">&#x27;text_vector&#x27;</span>: [<span class="hljs-number">0.7</span>, <span class="hljs-number">0.4</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.7</span>, <span class="hljs-number">0.8</span>],
            <span class="hljs-string">&#x27;chapter&#x27;</span>: <span class="hljs-string">&#x27;Economy&#x27;</span>
        }
    ]
    <span class="hljs-comment">// hightlight-end</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>Dans l'exemple ci-dessus, le champ <code translate="no">chunks</code> est un champ de type tableau de structures, et chaque élément de structure contient ses propres champs, à savoir <code translate="no">text</code>, <code translate="no">text_vector</code> et <code translate="no">chapter</code>.</p>
<p>Cette approche résout un problème de modélisation de longue date dans les bases de données vectorielles. Traditionnellement, chaque intégration ou attribut doit devenir sa propre ligne, ce qui oblige les <strong>entités multi-vectorielles (documents, produits, vidéos)</strong> à être divisées en dizaines, centaines, voire milliers d'enregistrements. Avec les tableaux de structures, Milvus vous permet de stocker l'ensemble de l'entité multivectorielle dans un seul champ, ce qui en fait une solution naturelle pour les listes de paragraphes, les incorporations de jetons, les séquences de clips, les images multivues ou tout autre scénario dans lequel un élément logique est composé de plusieurs vecteurs.</p>
<h2 id="How-Does-an-Array-of-Structs-Work-with-MAXSIM" class="common-anchor-header">Comment fonctionne un tableau de structures avec MAX_SIM ?<button data-href="#How-Does-an-Array-of-Structs-Work-with-MAXSIM" class="anchor-icon" translate="no">
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
    </button></h2><p>Au-dessus de cette nouvelle structure de tableaux de structures se trouve <strong>MAX_SIM</strong>, une nouvelle stratégie de notation qui rend la recherche sémantique consciente des entités. Lorsqu'une requête arrive, Milvus la compare à <em>chaque</em> vecteur à l'intérieur de chaque tableau de structures et prend la <strong>similarité maximale</strong> comme score final de l'entité. L'entité est ensuite classée et renvoyée en fonction de ce score unique. Cela permet d'éviter le problème classique des bases de données vectorielles qui consiste à récupérer des fragments dispersés et à transférer la charge du regroupement, de la déduplication et du reclassement dans la couche applicative. Avec MAX_SIM, la recherche au niveau de l'entité devient intégrée, cohérente et efficace.</p>
<p>Pour comprendre comment MAX_SIM fonctionne en pratique, examinons un exemple concret.</p>
<p><strong>Note :</strong> Tous les vecteurs de cet exemple sont générés par le même modèle d'intégration, et la similarité est mesurée par la similarité cosinus dans l'intervalle [0,1].</p>
<p>Supposons qu'un utilisateur recherche un <strong>"cours d'apprentissage automatique pour débutants".</strong></p>
<p>La requête est transformée en trois <strong>jetons</strong>:</p>
<ul>
<li><p><em>Apprentissage automatique</em></p></li>
<li><p><em>débutant</em></p></li>
<li><p><em>cours</em></p></li>
</ul>
<p>Chacun de ces tokens est ensuite <strong>converti en un vecteur d'intégration</strong> par le même modèle d'intégration que celui utilisé pour les documents.</p>
<p>Imaginons maintenant que la base de données vectorielle contienne deux documents :</p>
<ul>
<li><p><strong>doc_1 :</strong> <em>Guide d'introduction aux réseaux neuronaux profonds avec Python</em></p></li>
<li><p><strong>doc_2 :</strong> <em>Guide avancé de lecture d'articles de LLM</em></p></li>
</ul>
<p>Les deux documents ont été intégrés dans des vecteurs et stockés dans un tableau de structures.</p>
<h3 id="Step-1-Compute-MAXSIM-for-doc1" class="common-anchor-header"><strong>Étape 1 : Calcul de MAX_SIM pour doc_1</strong></h3><p>Pour chaque vecteur de requête, Milvus calcule sa similarité en cosinus par rapport à chaque vecteur dans doc_1 :</p>
<table>
<thead>
<tr><th></th><th>Introduction</th><th>guide</th><th>réseaux neuronaux profonds</th><th>python</th></tr>
</thead>
<tbody>
<tr><td>apprentissage automatique</td><td>0.0</td><td>0.0</td><td><strong>0.9</strong></td><td>0.3</td></tr>
<tr><td>débutant</td><td><strong>0.8</strong></td><td>0.1</td><td>0.0</td><td>0.3</td></tr>
<tr><td>cours</td><td>0.3</td><td><strong>0.7</strong></td><td>0.1</td><td>0.1</td></tr>
</tbody>
</table>
<p>Pour chaque vecteur de requête, MAX_SIM sélectionne la similarité <strong>la plus élevée</strong> dans sa ligne :</p>
<ul>
<li><p>apprentissage automatique → réseaux neuronaux profonds (0.9)</p></li>
<li><p>débutant → introduction (0.8)</p></li>
<li><p>cours → guide (0.7)</p></li>
</ul>
<p>La somme des meilleures correspondances donne à doc_1 un <strong>score MAX_SIM de 2,4.</strong></p>
<h3 id="Step-2-Compute-MAXSIM-for-doc2" class="common-anchor-header">Étape 2 : Calculer le score MAX_SIM pour doc_2</h3><p>Nous répétons maintenant le processus pour le document_2 :</p>
<table>
<thead>
<tr><th></th><th>avancé</th><th>guide</th><th>LLM</th><th>papier</th><th>lecture</th></tr>
</thead>
<tbody>
<tr><td>apprentissage automatique</td><td>0.1</td><td>0.2</td><td><strong>0.9</strong></td><td>0.3</td><td>0.1</td></tr>
<tr><td>débutant</td><td>0.4</td><td><strong>0.6</strong></td><td>0.0</td><td>0.2</td><td>0.5</td></tr>
<tr><td>cours</td><td>0.5</td><td><strong>0.8</strong></td><td>0.1</td><td>0.4</td><td>0.7</td></tr>
</tbody>
</table>
<p>Les meilleures correspondances pour doc_2 sont :</p>
<ul>
<li><p>"machine learning" → "LLM" (0.9)</p></li>
<li><p>"débutant" → "guide" (0.6)</p></li>
<li><p>"cours" → "guide" (0.8)</p></li>
</ul>
<p>La somme de ces scores donne à doc_2 un <strong>score MAX_SIM de 2,3.</strong></p>
<h3 id="Step-3-Compare-the-Scores" class="common-anchor-header">Étape 3 : Comparer les scores</h3><p>Parce que <strong>2,4 &gt; 2,3</strong>, <strong>doc_1 est mieux classé que doc_2</strong>, ce qui est intuitivement logique, puisque doc_1 est plus proche d'un guide d'introduction à l'apprentissage automatique.</p>
<p>Cet exemple nous permet de mettre en évidence trois caractéristiques essentielles de MAX_SIM :</p>
<ul>
<li><p><strong>Sémantique d'abord, et non basée sur des mots-clés :</strong> MAX_SIM compare des embeddings, et non des textes littéraux. Même si <em>"machine learning"</em> et <em>"deep neural networks"</em> ne partagent aucun mot qui se chevauche, leur similarité sémantique est de 0,9. MAX_SIM est donc résistant aux synonymes, aux paraphrases, aux chevauchements conceptuels et aux charges de travail modernes riches en embeddings.</p></li>
<li><p><strong>Insensible à la longueur et à l'ordre :</strong> MAX_SIM n'exige pas que la requête et le document aient le même nombre de vecteurs (par exemple, doc_1 a 4 vecteurs tandis que doc_2 en a 5, et les deux fonctionnent bien). Il ne tient pas compte non plus de l'ordre des vecteurs : le fait que "débutant" apparaisse plus tôt dans la requête et que "introduction" apparaisse plus tard dans le document n'a aucun impact sur le score.</p></li>
<li><p><strong>Chaque vecteur de la requête est important :</strong> MAX_SIM prend la meilleure correspondance pour chaque vecteur de requête et additionne les meilleurs scores. Cela permet d'éviter que des vecteurs non appariés ne faussent le résultat et de s'assurer que chaque élément important de la requête contribue au score final. Par exemple, la correspondance de moindre qualité pour "débutant" dans doc_2 réduit directement son score global.</p></li>
</ul>
<h2 id="Why-MAXSIM-+-Array-of-Structs-Matter-in-Vector-Database" class="common-anchor-header">Pourquoi MAX_SIM + tableau de structures sont-ils importants dans une base de données vectorielle ?<button data-href="#Why-MAXSIM-+-Array-of-Structs-Matter-in-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a> est une base de données vectorielle open-source très performante qui prend désormais entièrement en charge MAX_SIM et Array of Structs, ce qui permet une recherche multi-vectorielle native au niveau de l'entité :</p>
<ul>
<li><p><strong>Stockez des entités multi-vectorielles de manière native :</strong> Array of Structs vous permet de stocker des groupes de vecteurs apparentés dans un seul champ sans les répartir dans des lignes distinctes ou des tables auxiliaires.</p></li>
<li><p><strong>Calcul efficace de la meilleure correspondance :</strong> Combiné avec des index vectoriels tels que IVF et HNSW, MAX_SIM peut calculer les meilleures correspondances sans analyser chaque vecteur, ce qui permet de maintenir des performances élevées même avec des documents volumineux.</p></li>
<li><p><strong>Conçu pour les charges de travail à forte composante sémantique :</strong> Cette approche excelle dans la recherche de textes longs, l'appariement sémantique multi-facettes, l'alignement document-résumé, les requêtes multi-mots clés et d'autres scénarios d'IA qui nécessitent un raisonnement sémantique flexible et fin.</p></li>
</ul>
<h2 id="When-to-Use-an-Array-of-Structs" class="common-anchor-header">Quand utiliser un tableau de structures ?<button data-href="#When-to-Use-an-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><p>La valeur d'un <strong>tableau de structures</strong> apparaît clairement lorsque l'on examine ce qu'il permet de faire. À la base, cette fonctionnalité offre trois capacités fondamentales :</p>
<ul>
<li><p><strong>Elle regroupe des données hétérogènes - vecteurs</strong>, scalaires, chaînes, métadonnées - en un seul objet structuré.</p></li>
<li><p><strong>Elle aligne le stockage sur les entités du monde réel</strong>, de sorte que chaque ligne de la base de données correspond clairement à un élément réel tel qu'un article, un produit ou une vidéo.</p></li>
<li><p><strong>Associé à des fonctions d'agrégation telles que MAX_SIM</strong>, il permet une véritable extraction multi-vectorielle au niveau de l'entité, directement à partir de la base de données, ce qui élimine la déduplication, le regroupement ou le reclassement au niveau de la couche applicative.</p></li>
</ul>
<p>En raison de ces propriétés, le tableau de structures est une solution naturelle lorsqu'une <em>seule entité logique est représentée par plusieurs vecteurs</em>. Parmi les exemples courants, citons les articles divisés en paragraphes, les documents décomposés en jetons ou les produits représentés par plusieurs images. Si vos résultats de recherche souffrent de doublons, de fragments dispersés ou d'une même entité apparaissant plusieurs fois dans les premiers résultats, les tableaux de structures résolvent ces problèmes au niveau de la couche de stockage et d'extraction, et non par le biais de correctifs apportés après coup dans le code de l'application.</p>
<p>Ce modèle est particulièrement puissant pour les systèmes d'intelligence artificielle modernes qui s'appuient sur la <strong>recherche multi-vectorielle</strong>. Par exemple :</p>
<ul>
<li><p><a href="https://zilliz.com/learn/explore-colbert-token-level-embedding-and-ranking-model-for-similarity-search"><strong>ColBERT</strong></a> représente un document unique sous la forme de 100 à 500 encastrements de jetons pour une correspondance sémantique fine dans des domaines tels que les textes juridiques et la recherche universitaire.</p></li>
<li><p><a href="https://zilliz.com/blog/colpali-enhanced-doc-retrieval-with-vision-language-models-and-colbert-strategy"><strong>ColPali</strong> convertit </a>chaque page PDF en 256-1024 patchs d'images pour la recherche multimodale dans les états financiers, les contrats, les factures et d'autres documents numérisés.</p></li>
</ul>
<p>Un tableau de Structs permet à Milvus de stocker tous ces vecteurs sous une seule entité et de calculer la similarité agrégée (par exemple, MAX_SIM) de manière efficace et native. Pour que cela soit plus clair, voici deux exemples concrets.</p>
<h3 id="Example-1-E-commerce-Product-Search" class="common-anchor-header">Exemple 1 : Recherche de produits dans le commerce électronique</h3><p>Auparavant, les produits comportant plusieurs images étaient stockés dans un schéma plat - une image par ligne. Un produit avec des photos de face, de côté et de biais produisait trois lignes. Les résultats de recherche renvoyaient souvent plusieurs images du même produit, ce qui nécessitait un dédoublonnage et un reclassement manuels.</p>
<p>Avec un tableau de structures, chaque produit devient <strong>une ligne</strong>. Toutes les incrustations d'images et les métadonnées (angle, is_primary, etc.) se trouvent dans un champ <code translate="no">images</code> sous la forme d'un tableau de structures. Milvus comprend qu'ils appartiennent au même produit et renvoie le produit dans son ensemble, et non ses images individuelles.</p>
<h3 id="Example-2-Knowledge-Base-or-Wikipedia-Search" class="common-anchor-header">Exemple 2 : Base de connaissances ou recherche dans Wikipédia</h3><p>Auparavant, un article unique de Wikipedia était divisé en <em>N</em> lignes de paragraphes. Les résultats de la recherche renvoyaient des paragraphes dispersés, obligeant le système à les regrouper et à deviner à quel article ils appartenaient.</p>
<p>Avec un tableau de structures, l'article entier devient <strong>une seule ligne</strong>. Tous les paragraphes et leurs liens sont regroupés dans un champ paragraphes, et la base de données renvoie l'article complet, et non des morceaux fragmentés.</p>
<h2 id="Hands-on-Tutorials-Document-Level-Retrieval-with-the-Array-of-Structs" class="common-anchor-header">Didacticiels pratiques : Recherche au niveau du document avec le tableau de structures<button data-href="#Hands-on-Tutorials-Document-Level-Retrieval-with-the-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Wikipedia-Document-Retrieval" class="common-anchor-header">1. Recherche de documents dans Wikipédia</h3><p>Dans ce tutoriel, nous verrons comment utiliser un <strong>tableau de structures</strong> pour convertir des données de niveau paragraphe en enregistrements de documents complets, ce qui permet à Milvus d'effectuer une <strong>véritable recherche au niveau du document</strong> plutôt que de renvoyer des fragments isolés.</p>
<p>De nombreux pipelines de bases de connaissances stockent les articles de Wikipédia sous forme de morceaux de paragraphes. Cela fonctionne bien pour l'intégration et l'indexation, mais cela nuit à la recherche : une requête utilisateur renvoie généralement des paragraphes dispersés, ce qui vous oblige à regrouper et à reconstruire manuellement l'article. Avec un tableau de structures et MAX_SIM, nous pouvons redéfinir le schéma de stockage de sorte que <strong>chaque article devienne une ligne</strong> et que Milvus puisse classer et renvoyer l'ensemble du document de manière native.</p>
<p>Dans les étapes suivantes, nous allons montrer comment :</p>
<ol>
<li><p>Charger et prétraiter les données des paragraphes de Wikipédia</p></li>
<li><p>Regrouper tous les paragraphes appartenant au même article dans un tableau de structures</p></li>
<li><p>Insérer ces documents structurés dans Milvus</p></li>
<li><p>Exécuter des requêtes MAX_SIM pour récupérer des articles complets, proprement, sans déduplication ni reclassement.</p></li>
</ol>
<p>À la fin de ce tutoriel, vous disposerez d'un pipeline fonctionnel dans lequel Milvus gère directement l'extraction au niveau de l'entité, exactement comme l'attendent les utilisateurs.</p>
<p><strong>Modèle de données :</strong></p>
<pre><code translate="no">{
    <span class="hljs-string">&quot;wiki_id&quot;</span>: <span class="hljs-built_in">int</span>,                  <span class="hljs-comment"># WIKI ID(primary key） </span>
    <span class="hljs-string">&quot;paragraphs&quot;</span>: ARRAY&lt;STRUCT&lt;      <span class="hljs-comment"># Array of paragraph structs</span>
        text:VARCHAR                 <span class="hljs-comment"># Paragraph text</span>
        emb: FLOAT_VECTOR(<span class="hljs-number">768</span>)       <span class="hljs-comment"># Embedding for each paragraph</span>
    &gt;&gt;
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Étape 1 : Grouper et transformer les données</strong></p>
<p>Pour cette démo, nous utilisons l'ensemble de données <a href="https://huggingface.co/datasets/Cohere/wikipedia-22-12-simple-embeddings">Simple Wikipedia Embeddings</a>.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> pandas <span class="hljs-keyword">as</span> pd
<span class="hljs-keyword">import</span> pyarrow <span class="hljs-keyword">as</span> pa

<span class="hljs-comment"># Load the dataset and group by wiki_id</span>
df = pd.read_parquet(<span class="hljs-string">&quot;train-*.parquet&quot;</span>)
grouped = df.groupby(<span class="hljs-string">&#x27;wiki_id&#x27;</span>)

<span class="hljs-comment"># Build the paragraph array for each article</span>
wiki_data = []
<span class="hljs-keyword">for</span> wiki_id, group <span class="hljs-keyword">in</span> grouped:
    wiki_data.append({
        <span class="hljs-string">&#x27;wiki_id&#x27;</span>: wiki_id,
        <span class="hljs-string">&#x27;paragraphs&#x27;</span>: [{<span class="hljs-string">&#x27;text&#x27;</span>: row[<span class="hljs-string">&#x27;text&#x27;</span>], <span class="hljs-string">&#x27;emb&#x27;</span>: row[<span class="hljs-string">&#x27;emb&#x27;</span>]}
                       <span class="hljs-keyword">for</span> _, row <span class="hljs-keyword">in</span> group.iterrows()]
    })
<button class="copy-code-btn"></button></code></pre>
<p><strong>Étape 2 : Création de la collection Milvus</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
schema = client.create_schema()
schema.add_field(<span class="hljs-string">&quot;wiki_id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)

<span class="hljs-comment"># Define the Struct schema</span>
struct_schema = client.create_struct_field_schema()
struct_schema.add_field(<span class="hljs-string">&quot;text&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>)
struct_schema.add_field(<span class="hljs-string">&quot;emb&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)

schema.add_field(<span class="hljs-string">&quot;paragraphs&quot;</span>, DataType.ARRAY,
                 element_type=DataType.STRUCT,
                 struct_schema=struct_schema, max_capacity=<span class="hljs-number">200</span>)

client.create_collection(<span class="hljs-string">&quot;wiki_docs&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Étape 3 : Insérer les données et créer un index</strong></p>
<pre><code translate="no"><span class="hljs-meta"># Batch insert documents</span>
client.insert(<span class="hljs-string">&quot;wiki_docs&quot;</span>, wiki_data)

<span class="hljs-meta"># Create an HNSW index</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;paragraphs[emb]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
)
client.create_index(<span class="hljs-string">&quot;wiki_docs&quot;</span>, index_params)
client.load_collection(<span class="hljs-string">&quot;wiki_docs&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Étape 4 : Recherche de documents</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Search query</span>
<span class="hljs-keyword">import</span> cohere
<span class="hljs-keyword">from</span> pymilvus.client.embedding_list <span class="hljs-keyword">import</span> EmbeddingList

<span class="hljs-comment"># The dataset uses Cohere&#x27;s multilingual-22-12 embedding model, so we must embed the query using the same model.</span>
co = cohere.Client(<span class="hljs-string">f&quot;&lt;&lt;COHERE_API_KEY&gt;&gt;&quot;</span>)
query = <span class="hljs-string">&#x27;Who founded Youtube&#x27;</span>
response = co.embed(texts=[query], model=<span class="hljs-string">&#x27;multilingual-22-12&#x27;</span>)
query_embedding = response.embeddings
query_emb_list = EmbeddingList()

<span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> query_embedding[<span class="hljs-number">0</span>]:
    query_emb_list.add(vec)

results = client.search(
    collection_name=<span class="hljs-string">&quot;wiki_docs&quot;</span>,
    data=[query_emb_list],
    anns_field=<span class="hljs-string">&quot;paragraphs[emb]&quot;</span>,
    search_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
        <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">200</span>, <span class="hljs-string">&quot;retrieval_ann_ratio&quot;</span>: <span class="hljs-number">3</span>}
    },
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;wiki_id&quot;</span>]
)

<span class="hljs-comment"># Results: directly return 10 full articles!</span>
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Article <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;wiki_id&#x27;</span>]}</span>: Score <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Comparaison des résultats : Recherche traditionnelle et tableau de structures</strong></p>
<p>L'impact du tableau de structures apparaît clairement lorsque nous examinons ce que la base de données renvoie réellement :</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Dimension</strong></th><th style="text-align:center"><strong>Approche traditionnelle</strong></th><th style="text-align:center"><strong>Tableau de structures</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>Résultats de la base de données</strong></td><td style="text-align:center">Renvoie les <strong>100 premiers paragraphes</strong> (redondance élevée)</td><td style="text-align:center">Renvoie les <em>10 premiers documents complets</em> - propres et précis</td></tr>
<tr><td style="text-align:center"><strong>Logique d'application</strong></td><td style="text-align:center">Nécessite le <strong>regroupement, la déduplication et le reclassement</strong> (complexe)</td><td style="text-align:center">Aucun post-traitement n'est nécessaire - les résultats au niveau de l'entité proviennent directement de Milvus.</td></tr>
</tbody>
</table>
<p>Dans l'exemple de Wikipedia, nous n'avons démontré que le cas le plus simple : combiner les vecteurs de paragraphes dans une représentation unifiée du document. Mais la véritable force de Array of Structs est qu'il se généralise à <strong>n'importe quel</strong> modèle de données multivectorielles, qu'il s'agisse de pipelines de recherche classiques ou d'architectures d'IA modernes.</p>
<p><strong>Scénarios traditionnels de recherche multivectorielle</strong></p>
<p>De nombreux systèmes de recherche et de recommandation bien établis fonctionnent naturellement sur des entités ayant plusieurs vecteurs associés. Les tableaux de structures s'adaptent parfaitement à ces cas d'utilisation :</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Scénario</strong></th><th style="text-align:center"><strong>Modèle de données</strong></th><th style="text-align:center"><strong>Vecteurs par entité</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">🛍️ <strong>Produits de commerce électronique</strong></td><td style="text-align:center">Un produit → plusieurs images</td><td style="text-align:center">5-20</td></tr>
<tr><td style="text-align:center">🎬 <strong>Recherche vidéo</strong></td><td style="text-align:center">Une vidéo → plusieurs clips</td><td style="text-align:center">20-100</td></tr>
<tr><td style="text-align:center">📖 <strong>Recherche de documents</strong></td><td style="text-align:center">Un document → plusieurs sections</td><td style="text-align:center">5-15</td></tr>
</tbody>
</table>
<p><strong>Charges de travail des modèles d'IA (principaux cas d'utilisation multisectoriels)</strong></p>
<p>Les tableaux de structures deviennent encore plus critiques dans les modèles d'IA modernes qui produisent intentionnellement de grands ensembles de vecteurs par entité pour un raisonnement sémantique fin.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Modèle</strong></th><th style="text-align:center"><strong>Modèle de données</strong></th><th style="text-align:center"><strong>Vecteurs par entité</strong></th><th style="text-align:center"><strong>Application</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>ColBERT</strong></td><td style="text-align:center">Un document → plusieurs encastrements de jetons</td><td style="text-align:center">100-500</td><td style="text-align:center">Textes juridiques, articles académiques, recherche de documents à grain fin</td></tr>
<tr><td style="text-align:center"><strong>ColPali</strong></td><td style="text-align:center">Une page PDF → plusieurs encastrements de patchs</td><td style="text-align:center">256-1024</td><td style="text-align:center">Rapports financiers, contrats, factures, recherche multimodale de documents</td></tr>
</tbody>
</table>
<p>Ces modèles <em>nécessitent</em> un modèle de stockage multi-vecteur. Avant Array of Structs, les développeurs devaient diviser les vecteurs en plusieurs lignes et recoudre manuellement les résultats. Avec Milvus, ces entités peuvent désormais être stockées et récupérées de manière native, MAX_SIM gérant automatiquement la notation au niveau du document.</p>
<h3 id="2-ColPali-Image-Based-Document-Search" class="common-anchor-header">2. ColPali - Recherche de documents à partir d'images</h3><p><a href="https://zilliz.com/blog/colpali-enhanced-doc-retrieval-with-vision-language-models-and-colbert-strategy"><strong>ColPali</strong></a> est un modèle puissant pour la recherche multimodale de documents PDF. Au lieu de s'appuyer sur le texte, il traite chaque page PDF comme une image et la découpe en un maximum de 1024 patchs visuels, en générant un embedding par patch. Dans un schéma de base de données traditionnel, une page unique devrait être stockée sous la forme de centaines ou de milliers de lignes distinctes, ce qui empêcherait la base de données de comprendre que ces lignes appartiennent à la même page. Par conséquent, la recherche au niveau de l'entité devient fragmentée et peu pratique.</p>
<p>Array of Structs résout ce problème en stockant tous les patchs <em>dans un seul champ</em>, ce qui permet à Milvus de traiter la page comme une entité multi-vectorielle cohérente.</p>
<p>La recherche traditionnelle dans les PDF dépend souvent de l'<strong>OCR</strong>, qui convertit les images des pages en texte. Cette méthode fonctionne pour le texte brut, mais perd les graphiques, les tableaux, la mise en page et d'autres indices visuels. ColPali évite cette limitation en travaillant directement sur les images des pages, en préservant toutes les informations visuelles et textuelles. La contrepartie est l'échelle : chaque page contient désormais des centaines de vecteurs, ce qui nécessite une base de données capable d'agréger de nombreux embeddings en une seule entité - exactement ce que fournit Array of Structs + MAX_SIM.</p>
<p>Le cas d'utilisation le plus courant est <strong>Vision RAG</strong>, où chaque page PDF devient une entité multi-vecteur. Les scénarios typiques sont les suivants</p>
<ul>
<li><p><strong>Rapports financiers :</strong> recherche dans des milliers de PDF de pages contenant des graphiques ou des tableaux spécifiques.</p></li>
<li><p><strong>Contrats :</strong> recherche de clauses dans des documents juridiques scannés ou photographiés.</p></li>
<li><p><strong>Factures :</strong> recherche de factures par fournisseur, montant ou présentation.</p></li>
<li><p><strong>Présentations :</strong> recherche de diapositives contenant une figure ou un diagramme particulier.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Col_Pali_1daaab3c1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Modèle de données :</strong></p>
<pre><code translate="no">{
    <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-built_in">int</span>,                     <span class="hljs-comment"># Page ID (primary key) </span>
    <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-built_in">int</span>,                 <span class="hljs-comment"># Page number within the document </span>
    <span class="hljs-string">&quot;doc_name&quot;</span>: VARCHAR,                <span class="hljs-comment"># Document name</span>
    <span class="hljs-string">&quot;patches&quot;</span>: ARRAY&lt;STRUCT&lt;            <span class="hljs-comment"># Array of patch objects</span>
        patch_embedding: FLOAT_VECTOR(<span class="hljs-number">128</span>)  <span class="hljs-comment"># Embedding for each patch</span>
    &gt;&gt;
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Etape 1 : Préparer les données</strong>Vous pouvez vous référer à la documentation pour plus de détails sur la façon dont ColPali convertit les images ou le texte en représentations multi-vectorielles.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> torch
<span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image

<span class="hljs-keyword">from</span> colpali_engine.models <span class="hljs-keyword">import</span> ColPali, ColPaliProcessor

model_name = <span class="hljs-string">&quot;vidore/colpali-v1.3&quot;</span>

model = ColPali.from_pretrained(
    model_name,
    torch_dtype=torch.bfloat16,
    device_map=<span class="hljs-string">&quot;cuda:0&quot;</span>,  <span class="hljs-comment"># or &quot;mps&quot; if on Apple Silicon</span>
).<span class="hljs-built_in">eval</span>()

processor = ColPaliProcessor.from_pretrained(model_name)
<span class="hljs-comment"># Example: 2 documents, 5 pages each, total 10 images</span>
images = [
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image1.png&quot;</span>), 
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image2.png&quot;</span>), 
    ....
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image10.png&quot;</span>)
]
<span class="hljs-comment"># Convert each image into multiple patch embeddings</span>
batch_images = processor.process_images(images).to(model.device)
<span class="hljs-keyword">with</span> torch.no_grad():
    image_embeddings = model(**batch_images)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Étape 2 : Créer la collection Milvus</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
schema = client.create_schema()
schema.add_field(<span class="hljs-string">&quot;page_id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;page_number&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;doc_name&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">500</span>)

<span class="hljs-comment"># Struct Array for patches</span>
struct_schema = client.create_struct_field_schema()
struct_schema.add_field(<span class="hljs-string">&quot;patch_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">128</span>)

schema.add_field(<span class="hljs-string">&quot;patches&quot;</span>, DataType.ARRAY,
                 element_type=DataType.STRUCT,
                 struct_schema=struct_schema, max_capacity=<span class="hljs-number">2048</span>)

client.create_collection(<span class="hljs-string">&quot;doc_pages&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Étape 3 : Insérer les données et créer un index</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Prepare data for insertion</span>
page_data=[
    {
        <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;doc_name&quot;</span>: <span class="hljs-string">&quot;Q1_Financial_Report.pdf&quot;</span>,
        <span class="hljs-string">&quot;patches&quot;</span>: [
            {<span class="hljs-string">&quot;patch_embedding&quot;</span>: emb} <span class="hljs-keyword">for</span> emb <span class="hljs-keyword">in</span> image_embeddings[<span class="hljs-number">0</span>]
        ],
    },
    ...,
    {
        <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-number">9</span>,
        <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-number">4</span>,
        <span class="hljs-string">&quot;doc_name&quot;</span>: <span class="hljs-string">&quot;Product_Manual.pdf&quot;</span>,
        <span class="hljs-string">&quot;patches&quot;</span>: [
            {<span class="hljs-string">&quot;patch_embedding&quot;</span>: emb} <span class="hljs-keyword">for</span> emb <span class="hljs-keyword">in</span> image_embeddings[<span class="hljs-number">9</span>]
        ],
    },
]

client.insert(<span class="hljs-string">&quot;doc_pages&quot;</span>, page_data)

<span class="hljs-comment"># Create index</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;patches[patch_embedding]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_IP&quot;</span>,
    params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">32</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
)
client.create_index(<span class="hljs-string">&quot;doc_pages&quot;</span>, index_params)
client.load_collection(<span class="hljs-string">&quot;doc_pages&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Étape 4 : Recherche multimodale : Requête textuelle → Résultats d'images</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Run the search</span>
<span class="hljs-keyword">from</span> pymilvus.client.embedding_list <span class="hljs-keyword">import</span> EmbeddingList

queries = [
    <span class="hljs-string">&quot;quarterly revenue growth chart&quot;</span>    
]
<span class="hljs-comment"># Convert the text query into a multi-vector representation</span>
batch_queries = processor.process_queries(queries).to(model.device)
<span class="hljs-keyword">with</span> torch.no_grad():
    query_embeddings = model(**batch_queries)

query_emb_list = EmbeddingList()
<span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> query_embeddings[<span class="hljs-number">0</span>]:
    query_emb_list.add(vec)
results = client.search(
    collection_name=<span class="hljs-string">&quot;doc_pages&quot;</span>,
    data=[query_emb_list],
    anns_field=<span class="hljs-string">&quot;patches[patch_embedding]&quot;</span>,
    search_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_IP&quot;</span>,
        <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">100</span>, <span class="hljs-string">&quot;retrieval_ann_ratio&quot;</span>: <span class="hljs-number">3</span>}
    },
    limit=<span class="hljs-number">3</span>,
    output_fields=[<span class="hljs-string">&quot;page_id&quot;</span>, <span class="hljs-string">&quot;doc_name&quot;</span>, <span class="hljs-string">&quot;page_number&quot;</span>]
)


<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Query: &#x27;<span class="hljs-subst">{queries[<span class="hljs-number">0</span>]}</span>&#x27;&quot;</span>)
<span class="hljs-keyword">for</span> i, hit <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results, <span class="hljs-number">1</span>):
    entity = hit[<span class="hljs-string">&#x27;entity&#x27;</span>]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;doc_name&#x27;</span>]}</span> - Page <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;page_number&#x27;</span>]}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   Score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>\n&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Exemple de résultat :</strong></p>
<pre><code translate="no"><span class="hljs-title class_">Query</span>: <span class="hljs-string">&#x27;quarterly revenue growth chart&#x27;</span>
<span class="hljs-number">1.</span> Q1_Financial_Report.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">2</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.9123</span>

<span class="hljs-number">2.</span> Q1_Financial_Report.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">1</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.7654</span>

<span class="hljs-number">3.</span> <span class="hljs-title class_">Product</span>_Manual.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">1</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.5231</span>
<button class="copy-code-btn"></button></code></pre>
<p>Ici, les résultats renvoient directement des pages PDF complètes. Nous n'avons pas à nous préoccuper de l'intégration des 1024 patchs sous-jacents, car Milvus se charge automatiquement de l'agrégation.</p>
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
    </button></h2><p>La plupart des bases de données vectorielles stockent chaque fragment comme un enregistrement indépendant, ce qui signifie que les applications doivent réassembler ces fragments lorsqu'elles ont besoin d'un document, d'un produit ou d'une page complète. Un tableau de Structs change la donne. En combinant des scalaires, des vecteurs, du texte et d'autres champs en un seul objet structuré, il permet à une ligne de base de données de représenter une entité complète de bout en bout.</p>
<p>Le résultat est simple mais puissant : le travail qui nécessitait auparavant des opérations complexes de regroupement, de déduplication et de reclassement dans la couche applicative devient une capacité native de la base de données. Et c'est exactement vers cela que se dirige l'avenir des bases de données vectorielles : des structures plus riches, une récupération plus intelligente et des pipelines plus simples.</p>
<p>Pour plus d'informations sur les tableaux de structures et MAX_SIM, consultez la documentation ci-dessous :</p>
<ul>
<li><a href="https://milvus.io/docs/array-of-structs.md">Array of Structs | Milvus Documentation</a></li>
</ul>
<p>Vous avez des questions ou souhaitez approfondir une fonctionnalité de la dernière version de Milvus ? Rejoignez notre<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou déposez des questions sur<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Vous pouvez également réserver une session individuelle de 20 minutes pour obtenir des informations, des conseils et des réponses à vos questions dans le cadre des<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
