---
id: optimizing-billion-scale-image-search-milvus-part-1.md
title: Vue d'ensemble
author: Rife Wang
date: 2020-08-04T20:39:09.882Z
desc: >-
  Une étude de cas avec UPYUN. Découvrez comment Milvus se distingue des
  solutions de base de données traditionnelles et aide à construire un système
  de recherche par similarité d'images.
cover: assets.zilliz.com/header_23bbd76c8b.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-1'
---
<custom-h1>Le voyage vers l'optimisation de la recherche d'images à l'échelle du milliard (1/2)</custom-h1><p>Yupoo Picture Manager sert des dizaines de millions d'utilisateurs et gère des dizaines de milliards d'images. Comme sa galerie d'utilisateurs s'agrandit, Yupoo a un besoin urgent d'une solution capable de localiser rapidement l'image. En d'autres termes, lorsqu'un utilisateur saisit une image, le système doit trouver l'image originale et les images similaires dans la galerie. Le développement du service de recherche par image fournit une approche efficace de ce problème.</p>
<p>Le service de recherche par image a connu deux évolutions :</p>
<ol>
<li>Début de la première enquête technique au début de 2019 et lancement du système de première génération en mars et avril 2019 ;</li>
<li>Début de l'étude du plan de mise à niveau au début de 2020 et lancement de la mise à niveau globale vers le système de deuxième génération en avril 2020.</li>
</ol>
<p>Cet article décrit la sélection de la technologie et les principes de base des deux générations de système de recherche par image en se basant sur ma propre expérience de ce projet.</p>
<h2 id="Overview" class="common-anchor-header">Vue d'ensemble<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="What-is-an-image" class="common-anchor-header">Qu'est-ce qu'une image ?</h3><p>Nous devons savoir ce qu'est une image avant de traiter des images.</p>
<p>La réponse est qu'une image est un ensemble de pixels.</p>
<p>Par exemple, la partie dans la boîte rouge sur cette image est virtuellement une série de pixels.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_what_is_an_image_021e0280cc.png" alt="1-what-is-an-image.png" class="doc-image" id="1-what-is-an-image.png" />
   </span> <span class="img-wrapper"> <span>1-qu'est-ce-qu'une-image.png</span> </span></p>
<p>Supposons que la partie dans l'encadré rouge soit une image, alors chaque petit carré indépendant dans l'image est un pixel, l'unité d'information de base. La taille de l'image est donc de 11 x 11 px.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_what_is_an_image_602a91b4a0.png" alt="2-what-is-an-image.png" class="doc-image" id="2-what-is-an-image.png" />
   </span> <span class="img-wrapper"> <span>2-qu'est-ce-qu'une-image.png</span> </span></p>
<h3 id="Mathematical-representation-of-images" class="common-anchor-header">Représentation mathématique des images</h3><p>Chaque image peut être représentée par une matrice. Chaque pixel de l'image correspond à un élément de la matrice.</p>
<h3 id="Binary-images" class="common-anchor-header">Images binaires</h3><p>Les pixels d'une image binaire sont soit noirs, soit blancs, de sorte que chaque pixel peut être représenté par 0 ou 1. Par exemple, la représentation matricielle d'une image binaire 4 * 4 est la suivante :</p>
<pre><code translate="no">0 1 0 1
1 0 0 0
1 1 1 0
0 0 1 0
</code></pre>
<h3 id="RGB-images" class="common-anchor-header">Images RVB</h3><p>Les trois couleurs primaires (rouge, vert et bleu) peuvent être mélangées pour produire n'importe quelle couleur. Pour les images RVB, chaque pixel possède les informations de base de trois canaux RVB. De même, si chaque canal utilise un nombre de 8 bits (en 256 niveaux) pour représenter son échelle de gris, la représentation mathématique d'un pixel est la suivante :</p>
<pre><code translate="no">([0 .. 255], [0 .. 255], [0 .. 255])
</code></pre>
<p>Prenons l'exemple d'une image RVB 4 * 4 :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_4_x_4_rgb_image_136cec77ce.png" alt="3-4-x-4-rgb-image.png" class="doc-image" id="3-4-x-4-rgb-image.png" />
   </span> <span class="img-wrapper"> <span>3-4-x-4-rgb-image.png</span> </span></p>
<p>L'essence du traitement d'images consiste à traiter ces matrices de pixels.</p>
<h2 id="The-technical-problem-of-search-by-image" class="common-anchor-header">Le problème technique de la recherche par image<button data-href="#The-technical-problem-of-search-by-image" class="anchor-icon" translate="no">
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
    </button></h2><p>Si vous recherchez l'image originale, c'est-à-dire une image comportant exactement les mêmes pixels, vous pouvez comparer directement leurs valeurs MD5. Toutefois, les images téléchargées sur l'internet sont souvent compressées ou marquées d'un filigrane. Même un petit changement dans une image peut créer un résultat MD5 différent. Tant qu'il y a des incohérences entre les pixels, il est impossible de retrouver l'image originale.</p>
<p>Pour un système de recherche par image, nous voulons rechercher des images dont le contenu est similaire. Nous devons donc résoudre deux problèmes fondamentaux :</p>
<ul>
<li>Représenter ou abstraire une image dans un format de données qui peut être traité par un ordinateur.</li>
<li>Les données doivent être comparables pour le calcul.</li>
</ul>
<p>Plus précisément, nous avons besoin des caractéristiques suivantes :</p>
<ul>
<li>Extraction des caractéristiques de l'image.</li>
<li>Calcul des caractéristiques (calcul de similarité).</li>
</ul>
<h2 id="The-first-generation-search-by-image-system" class="common-anchor-header">Le système de recherche par image de première génération<button data-href="#The-first-generation-search-by-image-system" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Feature-extraction--image-abstraction" class="common-anchor-header">Extraction des caractéristiques - abstraction de l'image</h3><p>Le système de recherche par image de première génération utilise l'algorithme de hachage perceptuel ou pHash pour l'extraction des caractéristiques. Quels sont les principes de base de cet algorithme ?</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_first_generation_image_search_ffd7088158.png" alt="4-first-generation-image-search.png" class="doc-image" id="4-first-generation-image-search.png" />
   </span> <span class="img-wrapper"> <span>4-recherche-d'images-de-première-generation.png</span> </span></p>
<p>Comme le montre la figure ci-dessus, l'algorithme pHash effectue une série de transformations sur l'image pour obtenir la valeur de hachage. Au cours du processus de transformation, l'algorithme fait continuellement abstraction des images, ce qui rapproche les résultats des images similaires.</p>
<h3 id="Feature-calculation--similarity-calculation" class="common-anchor-header">Calcul des caractéristiques - calcul de la similarité</h3><p>Comment calculer la similarité entre les valeurs de pHash de deux images ? La réponse est l'utilisation de la distance de Hamming. Plus la distance de Hamming est petite, plus le contenu des images est similaire.</p>
<p>Qu'est-ce que la distance de Hamming ? C'est le nombre de bits différents.</p>
<p>Par exemple, il y a deux bits différents dans l'image ci-dessus,</p>
<pre><code translate="no">Value 1： 0 1 0 1 0
Value 2： 0 0 0 1 1
</code></pre>
<p>Il y a deux bits différents dans les deux valeurs ci-dessus, la distance de Hamming entre elles est donc de 2.</p>
<p>Nous connaissons maintenant le principe du calcul de la similarité. La question suivante est de savoir comment calculer les distances de Hamming entre des données à 100 millions d'échelles et des images à 100 millions d'échelles. En bref, comment rechercher des images similaires ?</p>
<p>Au début du projet, je n'ai pas trouvé d'outil satisfaisant (ou de moteur de calcul) capable de calculer rapidement la distance de Hamming. J'ai donc modifié mon plan.</p>
<p>Mon idée est que si la distance de Hamming entre deux valeurs de pHash est faible, alors je peux couper les valeurs de pHash et les petites parties correspondantes seront probablement égales.</p>
<p>Par exemple :</p>
<pre><code translate="no">Value 1： 8 a 0 3 0 3 f 6
Value 2： 8 a 0 3 0 3 d 8
</code></pre>
<p>Nous divisons les deux valeurs ci-dessus en huit segments et les valeurs de six segments sont exactement les mêmes. On peut en déduire que leur distance de Hamming est proche et que ces deux images sont donc similaires.</p>
<p>Après la transformation, vous pouvez constater que le problème du calcul de la distance de Hamming est devenu un problème d'équivalence de correspondance. Si je divise chaque valeur de pHash en huit segments, tant qu'il y a plus de cinq segments qui ont exactement les mêmes valeurs, alors les deux valeurs de pHash sont similaires.</p>
<p>Il est donc très simple de résoudre la question de l'équivalence. Nous pouvons utiliser le filtrage classique d'un système de base de données traditionnel.</p>
<p>Bien sûr, j'utilise la correspondance multiterme et je spécifie le degré de correspondance en utilisant minimum_should_match dans ElasticSearch (cet article ne présente pas le principe d'ES, vous pouvez l'apprendre par vous-même).</p>
<p>Pourquoi choisir ElasticSearch ? Tout d'abord, il fournit la fonction de recherche mentionnée ci-dessus. Deuxièmement, le projet de gestionnaire d'images utilise lui-même ES pour fournir une fonction de recherche plein texte et il est très économique d'utiliser les ressources existantes.</p>
<h2 id="Summary-of-the-first-generation-system" class="common-anchor-header">Résumé du système de première génération<button data-href="#Summary-of-the-first-generation-system" class="anchor-icon" translate="no">
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
    </button></h2><p>Le système de recherche par image de première génération choisit la solution pHash + ElasticSearch, qui présente les caractéristiques suivantes :</p>
<ul>
<li>L'algorithme pHash est simple à utiliser et peut résister à un certain degré de compression, de filigrane et de bruit.</li>
<li>ElasticSearch utilise les ressources existantes du projet sans ajouter de coûts supplémentaires à la recherche.</li>
<li>Mais la limite de ce système est évidente : l'algorithme pHash est une représentation abstraite de l'image entière. Dès que nous détruisons l'intégrité de l'image, par exemple en ajoutant une bordure noire à l'image originale, il est presque impossible de juger de la similitude entre l'original et les autres.</li>
</ul>
<p>C'est pour dépasser ces limites qu'est apparu le système de recherche d'images de deuxième génération, qui repose sur une technologie sous-jacente totalement différente.</p>
<p>Cet article a été rédigé par rifewang, utilisateur de Milvus et ingénieur logiciel d'UPYUN. Si vous aimez cet article, n'hésitez pas à venir lui dire bonjour ! https://github.com/rifewang</p>
