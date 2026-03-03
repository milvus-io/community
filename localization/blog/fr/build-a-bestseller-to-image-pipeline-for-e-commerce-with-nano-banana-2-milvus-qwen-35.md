---
id: >-
  build-a-bestseller-to-image-pipeline-for-e-commerce-with-nano-banana-2-milvus-qwen-35.md
title: >-
  Construire un pipeline Bestseller-to-Image pour le commerce électronique avec
  Nano Banana 2 + Milvus + Qwen 3.5
author: Lumina Wang
date: 2026-3-3
cover: assets.zilliz.com/blog-images/20260303-100432.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: >-
  Nano Banana 2, Milvus, e-commerce AI image generation, AI product photography,
  vector search
meta_keywords: >-
  Nano Banana 2, Milvus, e-commerce AI image generation, AI product photography,
  vector search
meta_title: |
  Nano Banana 2 + Milvus: E-Commerce AI Image Generation Tutorial
desc: >-
  Tutoriel étape par étape : utilisez Nano Banana 2, la recherche hybride Milvus
  et Qwen 3.5 pour générer des photos de produits de commerce électronique à
  partir de flat-lays à un tiers du coût.
origin: >-
  https://milvus.io/blog/build-a-bestseller-to-image-pipeline-for-e-commerce-with-nano-banana-2-milvus-qwen-35.md
---
<p>Si vous créez des outils d'IA pour les vendeurs du commerce électronique, vous avez probablement entendu cette demande un millier de fois : "J'ai un nouveau produit. Donnez-moi une image promotionnelle qui ait l'air de figurer dans une liste de best-sellers. Pas de photographe, pas de studio, et que ce soit bon marché".</p>
<p>Voilà le problème en quelques mots. Les vendeurs disposent de photos à plat et d'un catalogue de best-sellers qui convertissent déjà. Ils veulent faire le lien entre les deux grâce à l'IA, à la fois rapidement et à grande échelle.</p>
<p>Lorsque Google a lancé Nano Banana 2 (Gemini 3.1 Flash Image) le 26 février 2026, nous l'avons testé le jour même et l'avons intégré à notre pipeline de recherche existant basé sur Milvus. Résultat : le coût total de la génération d'images est tombé à environ un tiers de ce qu'il était auparavant, et le débit a doublé. La réduction du prix par image (environ 50% moins cher que Nano Banana Pro) explique en partie cela, mais les économies les plus importantes proviennent de l'élimination totale des cycles de retouche.</p>
<p>Cet article aborde les points positifs de Nano Banana 2 pour le commerce électronique, les points faibles, et propose un tutoriel pratique pour le pipeline complet : <strong>Milvus</strong> hybrid search pour trouver des best-sellers visuellement similaires, <strong>Qwen</strong> 3.5 pour l'analyse de style, et <strong>Nano Banana 2</strong> pour la génération finale.</p>
<h2 id="What’s-New-with-Nano-Banana-2" class="common-anchor-header">Quelles sont les nouveautés de Nano Banana 2 ?<button data-href="#What’s-New-with-Nano-Banana-2" class="anchor-icon" translate="no">
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
    </button></h2><p>Nano Banana 2 (Gemini 3.1 Flash Image) a été lancé le 26 février 2026. Il apporte la plupart des capacités de Nano Banana Pro à l'architecture Flash, ce qui signifie une génération plus rapide à un prix plus bas. Voici les principales améliorations :</p>
<ul>
<li><strong>Une qualité de niveau professionnel à la vitesse de Flash.</strong> Nano Banana 2 offre une connaissance, un raisonnement et une fidélité visuelle de classe mondiale, auparavant exclusifs à Pro, mais avec la latence et le débit de Flash.</li>
<li><strong>Sortie de 512 px à 4K.</strong> Quatre niveaux de résolution (512 px, 1K, 2K, 4K) avec prise en charge native. Le niveau 512 px est nouveau et unique à Nano Banana 2.</li>
<li><strong>14 rapports d'aspect.</strong> Ajoute 4:1, 1:4, 8:1 et 1:8 à l'ensemble existant (1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9).</li>
<li><strong>Jusqu'à 14 images de référence.</strong> Maintient la ressemblance des personnages pour un maximum de 5 personnages et la fidélité des objets pour un maximum de 14 objets dans un seul flux de travail.</li>
<li><strong>Rendu de texte amélioré.</strong> Génère un texte lisible et précis dans l'image dans plusieurs langues, avec prise en charge de la traduction et de la localisation au sein d'une même génération.</li>
<li><strong>Recherche d'images.</strong> Utilise des données web en temps réel et des images issues de Google Search pour générer des représentations plus précises de sujets réels.</li>
<li><strong>~Environ 50 % moins cher par image.</strong> Résolution de 1K : <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0,</mn></mrow></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">067versusPro′s0</span></span></span><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">,067 contre</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7519em;"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,</span><span class="mord"><span class="mord mathnormal">067versusPro</span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">′s0</span></span></span></span>,134.</li>
</ul>
<p><strong>Un cas d'utilisation amusant de Nano Banano 2 : Générer un panorama tenant compte de la localisation à partir d'une simple capture d'écran de Google Maps</strong></p>
<p>À partir d'une capture d'écran de Google Maps et d'une invite de style, le modèle reconnaît le contexte géographique et génère un panorama qui préserve les relations spatiales correctes. Utile pour produire des créations publicitaires ciblées par région (une toile de fond de café parisien, un paysage de rue à Tokyo) sans avoir recours à des photographies de stock.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pour connaître l'ensemble des fonctionnalités, consultez <a href="https://blog.google/innovation-and-ai/technology/ai/nano-banana-2/">le blog d'annonce de Google</a> et la <a href="https://ai.google.dev/gemini-api/docs/image-generation">documentation destinée aux développeurs</a>.</p>
<h2 id="What-Does-This-Nano-Banana-Update-Mean-For-E-Commerce" class="common-anchor-header">Que signifie cette mise à jour de Nano Banana pour le commerce électronique ?<button data-href="#What-Does-This-Nano-Banana-Update-Mean-For-E-Commerce" class="anchor-icon" translate="no">
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
    </button></h2><p>Le commerce électronique est l'un des secteurs les plus gourmands en images. Listes de produits, annonces sur les places de marché, créations sociales, campagnes de bannières, vitrines localisées : chaque canal exige un flux constant d'actifs visuels, chacun avec ses propres spécifications.</p>
<p>Les principales exigences en matière de génération d'images par IA dans le commerce électronique se résument à ce qui suit :</p>
<ul>
<li><strong>Maintenir des coûts bas</strong> - le coût par image doit être adapté à l'échelle d'un catalogue.</li>
<li>S<strong>'aligner sur l'aspect des best-sellers éprouvés</strong> - les nouvelles images doivent s'aligner sur le style visuel des listes qui convertissent déjà.</li>
<li>Éviter<strong>la contrefaçon</strong> - il ne faut pas copier les créations des concurrents ni réutiliser des actifs protégés.</li>
</ul>
<p>En outre, les vendeurs transfrontaliers ont besoin des éléments suivants</p>
<ul>
<li><strong>Prise en charge de formats multiplateformes</strong> - différents rapports d'aspect et spécifications pour les places de marché, les annonces et les vitrines.</li>
<li><strong>Rendu de texte multilingue</strong> - un texte propre et précis dans l'image dans plusieurs langues.</li>
</ul>
<p>Nano Banana 2 est proche de remplir toutes les conditions. Les sections ci-dessous décrivent ce que chaque amélioration signifie en pratique : là où elle résout directement un problème de commerce électronique, là où elle n'est pas à la hauteur, et quel est l'impact réel sur les coûts.</p>
<h3 id="Cut-Output-Generation-Costs-by-Up-to-60" class="common-anchor-header">Réduction des coûts de production jusqu'à 60</h3><p>À une résolution de 1K, Nano Banana 2 coûte <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>0</mi><mn>,067</mn></mrow><annotation encoding="application/x-tex">par image contre</annotation></semantics></math></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,</span><span class="mord"><span class="mord mathnormal">067</span></span><span class="mord">par image</span></span></span><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">pour Pro</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.9463em;vertical-align:-0.1944em;"></span><span class="mord"><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.7519em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"> </span></span></span></span></span></span></span></span></span><span class="mord mathnormal">′s0</span></span></span></span>,134, ce qui représente une réduction de 50 %. Mais le prix par image n'est que la moitié de l'histoire. Ce qui tuait les budgets des utilisateurs, c'était le travail de reprise. Chaque place de marché applique ses propres spécifications d'image (1:1 pour Amazon, 3:4 pour les vitrines Shopify, ultra-large pour les bannières publicitaires), et la production de chaque variante signifiait une passe de génération séparée avec ses propres modes d'échec.</p>
<p>Nano Banana 2 regroupe ces étapes supplémentaires en une seule.</p>
<ul>
<li><p><strong>Quatre niveaux de résolution native.</strong></p></li>
<li><p>512 px (0,045 $)</p></li>
<li><p>1K ($0.067)</p></li>
<li><p>2K ($0.101)</p></li>
<li><p>4K ($0.151).</p></li>
</ul>
<p>Le niveau 512px est nouveau et unique à Nano Banana 2. Les utilisateurs peuvent maintenant générer des ébauches de 512 px à faible coût pour l'itération et sortir l'actif final en 2K ou 4K sans étape d'upscaling séparée.</p>
<ul>
<li><p><strong>14 rapports d'aspect supportés</strong> au total. Voici quelques exemples :</p></li>
<li><p>4:1</p></li>
<li><p>1:4</p></li>
<li><p>8:1</p></li>
<li><p>1:8</p></li>
</ul>
<p>Ces nouveaux rapports ultra-larges et ultra-grands s'ajoutent à l'ensemble existant. Une session de génération peut produire différents formats tels que : L'<strong>image principale d'Amazon</strong> (1:1), le <strong>héros de la vitrine</strong> (3:4) et la <strong>bannière publicitaire</strong> (ultra-large ou autres ratios).</p>
<p>Aucun recadrage, aucun remplissage, aucun re-promptage n'est nécessaire pour ces 4 rapports. Les 10 autres ratios sont inclus dans le jeu complet, ce qui rend le processus plus flexible sur les différentes plateformes.</p>
<p>L'économie d'environ 50 % par image permettrait à elle seule de réduire la facture de moitié. C'est l'élimination des travaux de retouche pour toutes les résolutions et tous les rapports d'aspect qui a permis de ramener le coût total à environ un tiers de ce qu'il était auparavant.</p>
<h3 id="Support-Up-to-14-Reference-Images-with-Bestseller-Style" class="common-anchor-header">Prise en charge de 14 images de référence avec le style Bestseller</h3><p>De toutes les mises à jour de Nano Banana 2, c'est le mélange multiréférences qui a le plus d'impact sur notre pipeline Milvus. Nano Banana 2 accepte jusqu'à 14 images de référence dans une seule requête, en conservant :</p>
<ul>
<li>la ressemblance des caractères pour un maximum de <strong>5 personnages</strong></li>
<li>La fidélité des objets pour un maximum de <strong>14 objets</strong></li>
</ul>
<p>En pratique, nous avons récupéré plusieurs images de best-sellers dans Milvus, nous les avons passées en référence et l'image générée a hérité de la composition de la scène, de l'éclairage, de la pose et du placement des accessoires. Il n'a pas été nécessaire de procéder à une ingénierie rapide pour reconstruire ces modèles à la main.</p>
<p>Les modèles précédents ne prenaient en charge qu'une ou deux références, ce qui obligeait les utilisateurs à choisir un seul best-seller à imiter. Avec 14 emplacements de référence, nous pouvions mélanger les caractéristiques de plusieurs best-sellers et laisser le modèle synthétiser un style composite. C'est cette capacité qui rend possible le pipeline basé sur la recherche dans le tutoriel ci-dessous.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image15.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Produce-Premium-Commercial-Ready-Visuals-Without-Traditional-Production-Cost-or-Logistics" class="common-anchor-header">Produire des images de qualité supérieure, prêtes à être commercialisées, sans les coûts de production ou la logistique traditionnels</h3><p>Pour une génération d'images cohérente et fiable, évitez de déverser toutes vos exigences dans une seule invite. Une approche plus fiable consiste à travailler par étapes : générez d'abord l'arrière-plan, puis le modèle séparément, et enfin composez-les ensemble.</p>
<p>Nous avons testé la génération d'arrière-plan sur les trois modèles de Nano Banana avec la même invite : une image ultra-large 4:1 de l'horizon de Shanghai en temps de pluie, vue à travers une fenêtre, avec la tour de la Perle de l'Orient visible. Cette invite permet de tester la composition, les détails architecturaux et le photoréalisme en un seul passage.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="Original-Nano-Banana-vs-Nano-Banana-Pro-vs-Nano-Banana-2" class="common-anchor-header">Nano Banana original vs. Nano Banana Pro vs. Nano Banana 2</h4><ul>
<li><strong>Original Nano Banana.</strong> Texture de pluie naturelle avec une distribution de gouttelettes crédible, mais détails des bâtiments trop lissés. L'Oriental Pearl Tower était à peine reconnaissable et la résolution ne répondait pas aux exigences de la production.</li>
<li><strong>Nano Banana Pro.</strong> Atmosphère cinématographique : l'éclairage intérieur chaud s'oppose de manière convaincante à la pluie froide. Cependant, le cadre de la fenêtre a été complètement omis, ce qui a atténué la sensation de profondeur de l'image. Utilisable en tant qu'image de soutien, pas en tant que héros.</li>
<li><strong>Nano Banana 2.</strong> Rendu de la scène complète. Le cadre de la fenêtre au premier plan crée de la profondeur. La tour de la Perle de l'Orient est clairement détaillée. Les bateaux apparaissent sur la rivière Huangpu. L'éclairage en couches distingue la chaleur intérieure du couvert extérieur. Les textures de la pluie et des taches d'eau étaient quasi photographiques, et le rapport ultra-large 4:1 maintenait la perspective correcte avec seulement une distorsion mineure sur le bord gauche de la fenêtre.</li>
</ul>
<p>Pour la plupart des tâches de génération d'arrière-plan dans la photographie de produits, nous avons trouvé que la sortie du Nano Banana 2 était utilisable sans post-traitement.</p>
<h3 id="Render-In-Image-Text-Cleanly-Across-Languages" class="common-anchor-header">Rendu propre du texte à l'image dans toutes les langues</h3><p>Les étiquettes de prix, les bannières promotionnelles et les textes multilingues sont inévitables dans les images de commerce électronique, et ils ont toujours été un point de rupture pour la génération d'IA. Nano Banana 2 les gère beaucoup mieux, en prenant en charge le rendu du texte dans l'image dans plusieurs langues, avec traduction et localisation en une seule génération.</p>
<p><strong>Rendu de texte standard.</strong> Lors de nos tests, le rendu de texte était sans erreur dans tous les formats de commerce électronique que nous avons essayés : étiquettes de prix, courtes phrases de marketing, et descriptions de produits bilingues.</p>
<p><strong>Continuité de l'écriture manuscrite.</strong> Le commerce électronique nécessitant souvent des éléments manuscrits tels que des étiquettes de prix et des cartes personnalisées, nous avons testé si les modèles pouvaient correspondre à un style manuscrit existant et l'étendre - plus précisément, correspondre à une liste de tâches manuscrite et ajouter 5 nouveaux éléments dans le même style. Résultats pour les trois modèles :</p>
<ul>
<li><strong>Original Nano Banana.</strong> Numéros de séquence répétés, structure mal comprise.</li>
<li><strong>Nano Banana Pro.</strong> Mise en page correcte, mais mauvaise reproduction du style de police.</li>
<li><strong>Nano Banana 2.</strong> Aucune erreur. Le poids des traits et le style de la forme des lettres correspondent suffisamment pour qu'il soit impossible de les distinguer de la source.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image12.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Toutefois, la</strong> documentation de Google indique que Nano Banana 2 "peut encore éprouver des difficultés avec l'orthographe et les détails fins des images". Nos résultats étaient corrects dans tous les formats que nous avons testés, mais tout flux de production devrait inclure une étape de vérification du texte avant la publication.</p>
<h2 id="Step-by-Step-Tutorial-Build-a-Bestseller-to-Image-Pipeline-with-Milvus-Qwen-35-and-Nano-Banana-2" class="common-anchor-header">Tutoriel étape par étape : Construire un pipeline Bestseller-image avec Milvus, Qwen 3.5 et Nano Banana 2<button data-href="#Step-by-Step-Tutorial-Build-a-Bestseller-to-Image-Pipeline-with-Milvus-Qwen-35-and-Nano-Banana-2" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Before-we-begin-Architecture-and-Model-Setup" class="common-anchor-header">Avant de commencer : Architecture et configuration du modèle</h3><p>Pour éviter le caractère aléatoire de la génération d'un seul message, nous avons divisé le processus en trois étapes contrôlables : récupérer ce qui fonctionne déjà avec la recherche hybride <strong>Milvus</strong>, analyser pourquoi cela fonctionne avec <strong>Qwen 3.5</strong>, puis générer l'image finale avec ces contraintes intégrées avec <strong>Nano Banana 2</strong>.</p>
<p>Voici un bref aperçu de chaque outil si vous n'avez jamais travaillé avec eux :</p>
<ul>
<li><strong><a href="https://milvus.io/">Milvus</a></strong><a href="https://milvus.io/">:</a> la base de données vectorielles open-source la plus largement adoptée. Elle stocke votre catalogue de produits sous forme de vecteurs et effectue une recherche hybride (filtres denses + épars + scalaires) pour trouver les images de best-sellers les plus similaires à un nouveau produit.</li>
<li><strong>Qwen 3.5</strong>: un LLM multimodal populaire. Il prend les images de best-sellers récupérées et extrait les modèles visuels qui les sous-tendent (disposition de la scène, éclairage, pose, humeur) dans un message structuré sur le style.</li>
<li><strong>Nano Banana 2</strong>: modèle de génération d'images de Google (Gemini 3.1 Flash Image). Prend trois entrées : le nouveau produit flat-lay, une référence de best-seller et l'invite de style de Qwen 3.5. Produit la photo promotionnelle finale.</li>
</ul>
<p>La logique qui sous-tend cette architecture part d'un constat : l'atout visuel le plus précieux de tout catalogue de commerce électronique est la bibliothèque d'images de best-sellers qui ont déjà été converties. Les poses, les compositions et l'éclairage de ces photos ont été affinés grâce à des dépenses publicitaires réelles. L'extraction directe de ces modèles est un ordre de grandeur plus rapide que la rétro-ingénierie par l'écriture d'un message, et cette étape d'extraction est exactement ce qu'une base de données vectorielles gère.</p>
<p>Voici le flux complet. Nous appelons chaque modèle par l'intermédiaire de l'API OpenRouter, de sorte qu'il n'y a pas besoin de GPU local et qu'il n'y a pas de poids de modèle à télécharger.</p>
<pre><code translate="no">New product flat-lay
│
│── Embed → Llama Nemotron Embed VL 1B v2
│
│── Search → Milvus hybrid search
│   ├── Dense <span class="hljs-title function_">vectors</span> <span class="hljs-params">(visual similarity)</span>
│   ├── Sparse <span class="hljs-title function_">vectors</span> <span class="hljs-params">(keyword matching)</span>
│   └── Scalar <span class="hljs-title function_">filters</span> <span class="hljs-params">(category + sales volume)</span>
│
│── Analyze → Qwen <span class="hljs-number">3.5</span> extracts style from retrieved bestsellers
│   └── scene, lighting, pose, mood → style prompt
│
└── Generate → Nano Banana <span class="hljs-number">2</span>
    ├── Inputs: <span class="hljs-keyword">new</span> <span class="hljs-title class_">product</span> + bestseller reference + style prompt
    └── Output: promotional photo
<button class="copy-code-btn"></button></code></pre>
<p>Nous nous appuyons sur trois capacités de Milvus pour faire fonctionner l'étape de recherche :</p>
<ol>
<li><strong>Recherche hybride dense + clairsemée.</strong> Nous exécutons les intégrations d'images et les vecteurs TF-IDF de texte en tant que requêtes parallèles, puis nous fusionnons les deux ensembles de résultats avec le reranking RRF (Reciprocal Rank Fusion).</li>
<li><strong>Filtrage par champs scalaires.</strong> Nous filtrons les champs de métadonnées tels que la catégorie et le nombre de ventes avant la comparaison des vecteurs, de sorte que les résultats ne comprennent que les produits pertinents et performants.</li>
<li><strong>Schéma multi-champs.</strong> Nous stockons les vecteurs denses, les vecteurs épars et les métadonnées scalaires dans une seule collection Milvus, ce qui permet de conserver l'ensemble de la logique de recherche dans une seule requête au lieu de la disperser dans plusieurs systèmes.</li>
</ol>
<h3 id="Data-Preparation" class="common-anchor-header">Préparation des données</h3><p><strong>Catalogue de produits historique</strong></p>
<p>Nous commençons avec deux ressources : un dossier images/ de photos de produits existants et un fichier products.csv contenant leurs métadonnées.</p>
<pre><code translate="no">images/
├── SKU001.jpg
├── SKU002.jpg
├── ...
└── SKU040.jpg

products.csv fields:
product_id, image_path, category, color, style, season, sales_count, description, price
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Données sur les nouveaux produits</strong></p>
<p>Pour les produits pour lesquels nous voulons générer des images promotionnelles, nous préparons une structure parallèle : un dossier new_products/ et new_products.csv.</p>
<pre><code translate="no">new_products/
├── NEW001.jpg    <span class="hljs-comment"># Blue knit cardigan + grey tulle skirt set</span>
├── NEW002.jpg    <span class="hljs-comment"># Light green floral ruffle maxi dress</span>
├── NEW003.jpg    <span class="hljs-comment"># Camel turtleneck knit dress</span>
└── NEW004.jpg    <span class="hljs-comment"># Dark grey ethnic-style cowl neck top dress</span>

new_products.csv fields:
new_id, image_path, category, style, season, prompt_hint
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image11.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">Étape 1 : Installer les dépendances</h3><pre><code translate="no">!pip install pymilvus openai requests pillow scikit-learn tqdm
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Import-Modules-and-Configurations" class="common-anchor-header">Étape 2 : Importer les modules et les configurations</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os, io, base64, csv, time
<span class="hljs-keyword">import</span> requests <span class="hljs-keyword">as</span> req
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> <span class="hljs-variable constant_">PIL</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">Image</span>
<span class="hljs-keyword">from</span> tqdm.<span class="hljs-property">notebook</span> <span class="hljs-keyword">import</span> tqdm
<span class="hljs-keyword">from</span> sklearn.<span class="hljs-property">feature_extraction</span>.<span class="hljs-property">text</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">TfidfVectorizer</span>
<span class="hljs-keyword">from</span> <span class="hljs-title class_">IPython</span>.<span class="hljs-property">display</span> <span class="hljs-keyword">import</span> display

<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>, <span class="hljs-title class_">DataType</span>, <span class="hljs-title class_">AnnSearchRequest</span>, <span class="hljs-title class_">RRFRanker</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Configurez tous les modèles et chemins d'accès :</strong></p>
<pre><code translate="no"><span class="hljs-comment"># -- Config --</span>
OPENROUTER_API_KEY = os.environ.get(
    <span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>,
    <span class="hljs-string">&quot;&lt;YOUR_OPENROUTER_API_KEY&gt;&quot;</span>,
)

<span class="hljs-comment"># Models (all via OpenRouter, no local download needed)</span>
EMBED_MODEL = <span class="hljs-string">&quot;nvidia/llama-nemotron-embed-vl-1b-v2&quot;</span>  <span class="hljs-comment"># free, image+text → 2048d</span>
EMBED_DIM = <span class="hljs-number">2048</span>
LLM_MODEL = <span class="hljs-string">&quot;qwen/qwen3.5-397b-a17b&quot;</span>                 <span class="hljs-comment"># style analysis</span>
IMAGE_GEN_MODEL = <span class="hljs-string">&quot;google/gemini-3.1-flash-image-preview&quot;</span>  <span class="hljs-comment"># Nano Banana 2</span>

<span class="hljs-comment"># Milvus</span>
MILVUS_URI = <span class="hljs-string">&quot;./milvus_fashion.db&quot;</span>
COLLECTION = <span class="hljs-string">&quot;fashion_products&quot;</span>
TOP_K = <span class="hljs-number">3</span>

<span class="hljs-comment"># Paths</span>
IMAGE_DIR = <span class="hljs-string">&quot;./images&quot;</span>
NEW_PRODUCT_DIR = <span class="hljs-string">&quot;./new_products&quot;</span>
PRODUCT_CSV = <span class="hljs-string">&quot;./products.csv&quot;</span>
NEW_PRODUCT_CSV = <span class="hljs-string">&quot;./new_products.csv&quot;</span>

<span class="hljs-comment"># OpenRouter client (shared for LLM + image gen)</span>
llm = OpenAI(api_key=OPENROUTER_API_KEY, base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Config loaded. All models via OpenRouter API.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Fonctions utilitaires</strong></p>
<p>Ces fonctions d'aide gèrent l'encodage des images, les appels à l'API et l'analyse des réponses :</p>
<ul>
<li>image_to_uri() : Convertit une image PIL en un URI de données base64 pour le transport de l'API.</li>
<li>get_image_embeddings() : Encode par lots des images en vecteurs à 2048 dimensions via l'API d'encodage OpenRouter.</li>
<li>get_text_embedding() : Encode le texte dans le même espace vectoriel à 2048 dimensions.</li>
<li>sparse_to_dict() : Convertit une ligne de matrice sparse scipy dans le format {index : value} attendu par Milvus pour les vecteurs sparse.</li>
<li>extract_images() : Extrait les images générées à partir de la réponse de l'API Nano Banana 2.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># -- Utility functions --</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">image_to_uri</span>(<span class="hljs-params">img, max_size=<span class="hljs-number">1024</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert PIL Image to base64 data URI.&quot;&quot;&quot;</span>
    img = img.copy()
    w, h = img.size
    <span class="hljs-keyword">if</span> <span class="hljs-built_in">max</span>(w, h) &gt; max_size:
        r = max_size / <span class="hljs-built_in">max</span>(w, h)
        img = img.resize((<span class="hljs-built_in">int</span>(w * r), <span class="hljs-built_in">int</span>(h * r)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, <span class="hljs-built_in">format</span>=<span class="hljs-string">&quot;JPEG&quot;</span>, quality=<span class="hljs-number">85</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;data:image/jpeg;base64,<span class="hljs-subst">{base64.b64encode(buf.getvalue()).decode()}</span>&quot;</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_image_embeddings</span>(<span class="hljs-params">images, batch_size=<span class="hljs-number">5</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode images via OpenRouter embedding API.&quot;&quot;&quot;</span>
    all_embs = []
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> tqdm(<span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(images), batch_size), desc=<span class="hljs-string">&quot;Encoding images&quot;</span>):
        batch = images[i : i + batch_size]
        inputs = [
            {<span class="hljs-string">&quot;content&quot;</span>: [{<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(img, max_size=<span class="hljs-number">512</span>)}}]}
            <span class="hljs-keyword">for</span> img <span class="hljs-keyword">in</span> batch
        ]
        resp = req.post(
            <span class="hljs-string">&quot;https://openrouter.ai/api/v1/embeddings&quot;</span>,
            headers={<span class="hljs-string">&quot;Authorization&quot;</span>: <span class="hljs-string">f&quot;Bearer <span class="hljs-subst">{OPENROUTER_API_KEY}</span>&quot;</span>},
            json={<span class="hljs-string">&quot;model&quot;</span>: EMBED_MODEL, <span class="hljs-string">&quot;input&quot;</span>: inputs},
            timeout=<span class="hljs-number">120</span>,
        )
        data = resp.json()
        <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;data&quot;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> data:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;API error: <span class="hljs-subst">{data}</span>&quot;</span>)
            <span class="hljs-keyword">continue</span>
        <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> <span class="hljs-built_in">sorted</span>(data[<span class="hljs-string">&quot;data&quot;</span>], key=<span class="hljs-keyword">lambda</span> x: x[<span class="hljs-string">&quot;index&quot;</span>]):
            all_embs.append(item[<span class="hljs-string">&quot;embedding&quot;</span>])
        time.sleep(<span class="hljs-number">0.5</span>)  <span class="hljs-comment"># rate limit friendly</span>
    <span class="hljs-keyword">return</span> np.array(all_embs, dtype=np.float32)

<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_text_embedding</span>(<span class="hljs-params">text</span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode text via OpenRouter embedding API.&quot;&quot;&quot;</span>
    resp = req.post(
        <span class="hljs-string">&quot;https://openrouter.ai/api/v1/embeddings&quot;</span>,
        headers={<span class="hljs-string">&quot;Authorization&quot;</span>: <span class="hljs-string">f&quot;Bearer <span class="hljs-subst">{OPENROUTER_API_KEY}</span>&quot;</span>},
        json={<span class="hljs-string">&quot;model&quot;</span>: EMBED_MODEL, <span class="hljs-string">&quot;input&quot;</span>: text},
        timeout=<span class="hljs-number">60</span>,
    )
    <span class="hljs-keyword">return</span> np.array(resp.json()[<span class="hljs-string">&quot;data&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;embedding&quot;</span>], dtype=np.float32)

<span class="hljs-keyword">def</span> <span class="hljs-title function_">sparse_to_dict</span>(<span class="hljs-params">sparse_row</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert scipy sparse row to Milvus sparse vector format {index: value}.&quot;&quot;&quot;</span>
    coo = sparse_row.tocoo()
    <span class="hljs-keyword">return</span> {<span class="hljs-built_in">int</span>(i): <span class="hljs-built_in">float</span>(v) <span class="hljs-keyword">for</span> i, v <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(coo.col, coo.data)}

<span class="hljs-keyword">def</span> <span class="hljs-title function_">extract_images</span>(<span class="hljs-params">response</span>):
    <span class="hljs-string">&quot;&quot;&quot;Extract generated images from OpenRouter response.&quot;&quot;&quot;</span>
    images = []
    raw = response.model_dump()
    msg = raw[<span class="hljs-string">&quot;choices&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;message&quot;</span>]
    <span class="hljs-comment"># Method 1: images field (OpenRouter extension)</span>
    <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;images&quot;</span> <span class="hljs-keyword">in</span> msg <span class="hljs-keyword">and</span> msg[<span class="hljs-string">&quot;images&quot;</span>]:
        <span class="hljs-keyword">for</span> img_data <span class="hljs-keyword">in</span> msg[<span class="hljs-string">&quot;images&quot;</span>]:
            url = img_data[<span class="hljs-string">&quot;image_url&quot;</span>][<span class="hljs-string">&quot;url&quot;</span>]
            b64 = url.split(<span class="hljs-string">&quot;,&quot;</span>, <span class="hljs-number">1</span>)[<span class="hljs-number">1</span>]
            images.append(Image.<span class="hljs-built_in">open</span>(io.BytesIO(base64.b64decode(b64))))
    <span class="hljs-comment"># Method 2: inline base64 in content parts</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> images <span class="hljs-keyword">and</span> <span class="hljs-built_in">isinstance</span>(msg.get(<span class="hljs-string">&quot;content&quot;</span>), <span class="hljs-built_in">list</span>):
        <span class="hljs-keyword">for</span> part <span class="hljs-keyword">in</span> msg[<span class="hljs-string">&quot;content&quot;</span>]:
            <span class="hljs-keyword">if</span> <span class="hljs-built_in">isinstance</span>(part, <span class="hljs-built_in">dict</span>) <span class="hljs-keyword">and</span> part.get(<span class="hljs-string">&quot;type&quot;</span>) == <span class="hljs-string">&quot;image_url&quot;</span>:
                url = part[<span class="hljs-string">&quot;image_url&quot;</span>][<span class="hljs-string">&quot;url&quot;</span>]
                <span class="hljs-keyword">if</span> url.startswith(<span class="hljs-string">&quot;data:image&quot;</span>):
                    b64 = url.split(<span class="hljs-string">&quot;,&quot;</span>, <span class="hljs-number">1</span>)[<span class="hljs-number">1</span>]
                    images.append(Image.<span class="hljs-built_in">open</span>(io.BytesIO(base64.b64decode(b64))))
    <span class="hljs-keyword">return</span> images

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Utility functions ready.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Load-the-Product-Catalog" class="common-anchor-header">Étape 3 : Chargement du catalogue de produits</h3><p>Lire products.csv et charger les images de produits correspondantes :</p>
<pre><code translate="no"><span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(PRODUCT_CSV, newline=<span class="hljs-string">&quot;&quot;</span>, encoding=<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">as</span> f:
    products = <span class="hljs-built_in">list</span>(csv.DictReader(f))

product_images = []
<span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> products:
    img = Image.<span class="hljs-built_in">open</span>(os.path.join(IMAGE_DIR, p[<span class="hljs-string">&quot;image_path&quot;</span>])).convert(<span class="hljs-string">&quot;RGB&quot;</span>)
    product_images.append(img)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Loaded <span class="hljs-subst">{<span class="hljs-built_in">len</span>(products)}</span> products.&quot;</span>)
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">3</span>):
    p = products[i]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{p[<span class="hljs-string">&#x27;product_id&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;color&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> | sales: <span class="hljs-subst">{p[<span class="hljs-string">&#x27;sales_count&#x27;</span>]}</span>&quot;</span>)
    display(product_images[i].resize((<span class="hljs-number">180</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">180</span> * product_images[i].height / product_images[i].width))))
<button class="copy-code-btn"></button></code></pre>
<p>Exemple de sortie :<br>

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image13.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Generate-Embeddings" class="common-anchor-header">Étape 4 : Générer des liens (Embeddings)</h3><p>La recherche hybride nécessite deux types de vecteurs pour chaque produit.</p>
<p><strong>4.1 Vecteurs denses : encastrements d'images</strong></p>
<p>Le modèle nvidia/llama-nemotron-embed-vl-1b-v2 encode chaque image de produit dans un vecteur dense à 2048 dimensions. Comme ce modèle prend en charge les entrées image et texte dans un espace vectoriel partagé, les mêmes encastrements fonctionnent pour la recherche d'image à image et de texte à image.</p>
<pre><code translate="no"><span class="hljs-comment"># Dense embeddings: image → 2048-dim vector via OpenRouter API</span>
dense_vectors = get_image_embeddings(product_images, batch_size=<span class="hljs-number">5</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dense vectors: <span class="hljs-subst">{dense_vectors.shape}</span>  (products x <span class="hljs-subst">{EMBED_DIM}</span>d)&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Résultats :</p>
<pre><code translate="no">Dense vectors: (40, 2048)  (products x 2048d)
<button class="copy-code-btn"></button></code></pre>
<p><strong>4,2 vecteurs denses : Encastrements de texte TF-IDF</strong></p>
<p>Les descriptions textuelles des produits sont encodées dans des vecteurs denses à l'aide du vecteur TF-IDF de scikit-learn. Ces vecteurs capturent la correspondance au niveau des mots-clés que les vecteurs denses peuvent manquer.</p>
<pre><code translate="no"><span class="hljs-comment"># Sparse embeddings: TF-IDF on product descriptions</span>
descriptions = [p[<span class="hljs-string">&quot;description&quot;</span>] <span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> products]
tfidf = TfidfVectorizer(stop_words=<span class="hljs-string">&quot;english&quot;</span>, max_features=<span class="hljs-number">500</span>)
tfidf_matrix = tfidf.fit_transform(descriptions)

sparse_vectors = [sparse_to_dict(tfidf_matrix[i]) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(products))]
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sparse vectors: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(sparse_vectors)}</span> products, vocab size: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(tfidf.vocabulary_)}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sample sparse vector (SKU001): <span class="hljs-subst">{<span class="hljs-built_in">len</span>(sparse_vectors[<span class="hljs-number">0</span>])}</span> non-zero terms&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Sortie :</p>
<pre><code translate="no">Sparse vectors: <span class="hljs-number">40</span> products, vocab size: <span class="hljs-number">179</span>
Sample sparse <span class="hljs-title function_">vector</span> <span class="hljs-params">(SKU001)</span>: <span class="hljs-number">11</span> non-zero terms
<button class="copy-code-btn"></button></code></pre>
<p><strong>Pourquoi les deux types de vecteurs ?</strong> Les vecteurs denses et peu denses se complètent. Les vecteurs denses capturent la similarité visuelle : palette de couleurs, silhouette du vêtement, style général. Les vecteurs peu denses capturent la sémantique des mots-clés : des termes tels que "floral", "midi" ou "mousseline" qui signalent les attributs du produit. La combinaison de ces deux approches permet d'obtenir une qualité d'extraction nettement supérieure à celle de l'une ou l'autre approche prise isolément.</p>
<h3 id="Step-5-Create-a-Milvus-Collection-with-Hybrid-Schema" class="common-anchor-header">Étape 5 : Création d'une collection Milvus avec un schéma hybride</h3><p>Cette étape permet de créer une collection Milvus unique qui stocke ensemble les vecteurs denses, les vecteurs épars et les champs de métadonnées scalaires. Ce schéma unifié permet d'effectuer une recherche hybride en une seule requête.</p>
<table>
<thead>
<tr><th><strong>Champ</strong></th><th><strong>Type de champ</strong></th><th><strong>Objectif</strong></th></tr>
</thead>
<tbody>
<tr><td>vecteur_dense</td><td>FLOAT_VECTOR (2048d)</td><td>Incrustation d'image, similarité COSINE</td></tr>
<tr><td>vecteur_dense</td><td>VECTEUR_FLOAT_SPARE</td><td>Vecteur clair TF-IDF, produit intérieur</td></tr>
<tr><td>catégorie</td><td>VARCHAR</td><td>Étiquette de la catégorie pour le filtrage</td></tr>
<tr><td>sales_count</td><td>INT64</td><td>Volume historique des ventes pour le filtrage</td></tr>
<tr><td>couleur, style, saison</td><td>VARCHAR</td><td>Étiquettes de métadonnées supplémentaires</td></tr>
<tr><td>prix</td><td>FLOAT</td><td>Prix du produit</td></tr>
</tbody>
</table>
<pre><code translate="no">milvus_client = MilvusClient(uri=MILVUS_URI)

<span class="hljs-keyword">if</span> milvus_client.has_collection(COLLECTION):
    milvus_client.drop_collection(COLLECTION)

schema = milvus_client.create_schema(auto_id=<span class="hljs-literal">True</span>, enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;product_id&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">20</span>)
schema.add_field(<span class="hljs-string">&quot;category&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;color&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;style&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;season&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;sales_count&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;description&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">500</span>)
schema.add_field(<span class="hljs-string">&quot;price&quot;</span>, DataType.FLOAT)
schema.add_field(<span class="hljs-string">&quot;dense_vector&quot;</span>, DataType.FLOAT_VECTOR, dim=EMBED_DIM)
schema.add_field(<span class="hljs-string">&quot;sparse_vector&quot;</span>, DataType.SPARSE_FLOAT_VECTOR)

index_params = milvus_client.prepare_index_params()
index_params.add_index(field_name=<span class="hljs-string">&quot;dense_vector&quot;</span>, index_type=<span class="hljs-string">&quot;FLAT&quot;</span>, metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>)
index_params.add_index(field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>, index_type=<span class="hljs-string">&quot;SPARSE_INVERTED_INDEX&quot;</span>, metric_type=<span class="hljs-string">&quot;IP&quot;</span>)

milvus_client.create_collection(COLLECTION, schema=schema, index_params=index_params)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Milvus collection &#x27;<span class="hljs-subst">{COLLECTION}</span>&#x27; created with hybrid schema.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Insérer les données relatives au produit :</p>
<pre><code translate="no"><span class="hljs-comment"># Insert all products</span>
rows = []
<span class="hljs-keyword">for</span> i, p <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(products):
    rows.append({
        <span class="hljs-string">&quot;product_id&quot;</span>: p[<span class="hljs-string">&quot;product_id&quot;</span>],
        <span class="hljs-string">&quot;category&quot;</span>: p[<span class="hljs-string">&quot;category&quot;</span>],
        <span class="hljs-string">&quot;color&quot;</span>: p[<span class="hljs-string">&quot;color&quot;</span>],
        <span class="hljs-string">&quot;style&quot;</span>: p[<span class="hljs-string">&quot;style&quot;</span>],
        <span class="hljs-string">&quot;season&quot;</span>: p[<span class="hljs-string">&quot;season&quot;</span>],
        <span class="hljs-string">&quot;sales_count&quot;</span>: <span class="hljs-built_in">int</span>(p[<span class="hljs-string">&quot;sales_count&quot;</span>]),
        <span class="hljs-string">&quot;description&quot;</span>: p[<span class="hljs-string">&quot;description&quot;</span>],
        <span class="hljs-string">&quot;price&quot;</span>: <span class="hljs-built_in">float</span>(p[<span class="hljs-string">&quot;price&quot;</span>]),
        <span class="hljs-string">&quot;dense_vector&quot;</span>: dense_vectors[i].tolist(),
        <span class="hljs-string">&quot;sparse_vector&quot;</span>: sparse_vectors[i],
    })

milvus_client.insert(COLLECTION, rows)
stats = milvus_client.get_collection_stats(COLLECTION)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted <span class="hljs-subst">{stats[<span class="hljs-string">&#x27;row_count&#x27;</span>]}</span> products into Milvus.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Sortie :</p>
<pre><code translate="no">Inserted <span class="hljs-number">40</span> products <span class="hljs-keyword">into</span> Milvus.
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Hybrid-Search-to-Find-Similar-Bestsellers" class="common-anchor-header">Étape 6 : Recherche hybride pour trouver des best-sellers similaires</h3><p>Il s'agit de l'étape principale de recherche. Pour chaque nouveau produit, le pipeline exécute trois opérations simultanément :</p>
<ol>
<li><strong>Recherche dense</strong>: recherche de produits dont les images sont visuellement similaires.</li>
<li><strong>Recherche éparse</strong>: recherche des produits dont les mots-clés correspondent au texte via TF-IDF.</li>
<li><strong>Filtrage scalaire</strong>: restreint les résultats à la même catégorie et aux produits dont le nombre de ventes est supérieur à 1500.</li>
<li><strong>RRF reranking</strong>: fusionne les listes de résultats denses et éparses à l'aide de la fusion réciproque des rangs (Reciprocal Rank Fusion).</li>
</ol>
<p>Chargez le nouveau produit :</p>
<pre><code translate="no"><span class="hljs-comment"># Load new products</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(NEW_PRODUCT_CSV, newline=<span class="hljs-string">&quot;&quot;</span>, encoding=<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">as</span> f:
    new_products = <span class="hljs-built_in">list</span>(csv.DictReader(f))

<span class="hljs-comment"># Pick the first new product for demo</span>
new_prod = new_products[<span class="hljs-number">0</span>]
new_img = Image.<span class="hljs-built_in">open</span>(os.path.join(NEW_PRODUCT_DIR, new_prod[<span class="hljs-string">&quot;image_path&quot;</span>])).convert(<span class="hljs-string">&quot;RGB&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;New product: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Category: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | Style: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> | Season: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;season&#x27;</span>]}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Prompt hint: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>&quot;</span>)
display(new_img.resize((<span class="hljs-number">300</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">300</span> * new_img.height / new_img.width))))
<button class="copy-code-btn"></button></code></pre>
<p>Sortie : <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Encodage du nouveau produit :</p>
<pre><code translate="no"><span class="hljs-comment"># Encode new product</span>
<span class="hljs-comment"># Dense: image embedding via API</span>
query_dense = get_image_embeddings([new_img], batch_size=<span class="hljs-number">1</span>)[<span class="hljs-number">0</span>]

<span class="hljs-comment"># Sparse: TF-IDF from text query</span>
query_text = <span class="hljs-string">f&quot;<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;season&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>&quot;</span>
query_sparse = sparse_to_dict(tfidf.transform([query_text])[<span class="hljs-number">0</span>])

<span class="hljs-comment"># Scalar filter</span>
filter_expr = <span class="hljs-string">f&#x27;category == &quot;<span class="hljs-subst">{new_prod[<span class="hljs-string">&quot;category&quot;</span>]}</span>&quot; and sales_count &gt; 1500&#x27;</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dense query: <span class="hljs-subst">{query_dense.shape}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sparse query: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(query_sparse)}</span> non-zero terms&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Filter: <span class="hljs-subst">{filter_expr}</span>&quot;</span>)

<button class="copy-code-btn"></button></code></pre>
<p>Sortie : Encoder le nouveau produit : Sortie : Encoder le nouveau produit : Sortie :</p>
<pre><code translate="no"><span class="hljs-title class_">Dense</span> <span class="hljs-attr">query</span>: (<span class="hljs-number">2048</span>,)
<span class="hljs-title class_">Sparse</span> <span class="hljs-attr">query</span>: <span class="hljs-number">6</span> non-zero terms
<span class="hljs-title class_">Filter</span>: category == <span class="hljs-string">&quot;midi_dress&quot;</span> and sales_count &gt; <span class="hljs-number">1500</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Exécuter la recherche hybride</strong></p>
<p>Voici les principaux appels API :</p>
<ul>
<li>AnnSearchRequest crée des requêtes de recherche distinctes pour les champs vectoriels denses et épars.</li>
<li>expr=filter_expr applique un filtrage scalaire dans chaque requête de recherche.</li>
<li>RRFRanker(k=60) fusionne les deux listes de résultats classés à l'aide de l'algorithme Reciprocal Rank Fusion.</li>
<li>hybrid_search exécute les deux requêtes et renvoie les résultats fusionnés et reclassés.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Hybrid search: dense + sparse + scalar filter + RRF reranking</span>
dense_req = AnnSearchRequest(
    data=[query_dense.tolist()],
    anns_field=<span class="hljs-string">&quot;dense_vector&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    limit=<span class="hljs-number">20</span>,
    expr=filter_expr,
)
sparse_req = AnnSearchRequest(
    data=[query_sparse],
    anns_field=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>},
    limit=<span class="hljs-number">20</span>,
    expr=filter_expr,
)

results = milvus_client.hybrid_search(
    collection_name=COLLECTION,
    reqs=[dense_req, sparse_req],
    ranker=RRFRanker(k=<span class="hljs-number">60</span>),
    limit=TOP_K,
    output_fields=[<span class="hljs-string">&quot;product_id&quot;</span>, <span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;color&quot;</span>, <span class="hljs-string">&quot;style&quot;</span>, <span class="hljs-string">&quot;season&quot;</span>,
                   <span class="hljs-string">&quot;sales_count&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
)

<span class="hljs-comment"># Display retrieved bestsellers</span>
retrieved_products = []
retrieved_images = []
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Top-<span class="hljs-subst">{TOP_K}</span> similar bestsellers:\n&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    pid = entity[<span class="hljs-string">&quot;product_id&quot;</span>]
    img = Image.<span class="hljs-built_in">open</span>(os.path.join(IMAGE_DIR, <span class="hljs-string">f&quot;<span class="hljs-subst">{pid}</span>.jpg&quot;</span>)).convert(<span class="hljs-string">&quot;RGB&quot;</span>)
    retrieved_products.append(entity)
    retrieved_images.append(img)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{pid}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;color&#x27;</span>]}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> &quot;</span>
          <span class="hljs-string">f&quot;| sales: <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;sales_count&#x27;</span>]}</span> | $<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;price&#x27;</span>]:<span class="hljs-number">.1</span>f}</span> | score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;description&#x27;</span>]}</span>&quot;</span>)
    display(img.resize((<span class="hljs-number">250</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">250</span> * img.height / img.width))))
    <span class="hljs-built_in">print</span>()
<button class="copy-code-btn"></button></code></pre>
<p>Résultat : les 3 best-sellers les plus similaires, classés par score fusionné.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-7-Analyze-Bestseller-Style-with-Qwen-35" class="common-anchor-header">Étape 7 : Analyse du style des best-sellers avec Qwen 3.5</h3><p>Nous introduisons les images de best-sellers récupérées dans Qwen 3.5 et lui demandons d'extraire leur ADN visuel commun : la composition de la scène, la configuration de l'éclairage, la pose du modèle et l'ambiance générale. De cette analyse, nous obtenons une génération unique prête à être transmise à Nano Banana 2.</p>
<pre><code translate="no">content = [
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(img)}}
    <span class="hljs-keyword">for</span> img in retrieved_images
]
content.<span class="hljs-built_in">append</span>({
    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>,
    <span class="hljs-string">&quot;text&quot;</span>: (
        <span class="hljs-string">&quot;These are our top-selling fashion product photos.\n\n&quot;</span>
        <span class="hljs-string">&quot;Analyze their common visual style in these dimensions:\n&quot;</span>
        <span class="hljs-string">&quot;1. Scene / background setting\n&quot;</span>
        <span class="hljs-string">&quot;2. Lighting and color tone\n&quot;</span>
        <span class="hljs-string">&quot;3. Model pose and framing\n&quot;</span>
        <span class="hljs-string">&quot;4. Overall mood and aesthetic\n\n&quot;</span>
        <span class="hljs-string">&quot;Then, based on this analysis, write ONE concise image generation prompt &quot;</span>
        <span class="hljs-string">&quot;(under 100 words) that captures this style. The prompt should describe &quot;</span>
        <span class="hljs-string">&quot;a scene for a model wearing a new clothing item. &quot;</span>
        <span class="hljs-string">&quot;Output ONLY the prompt, nothing else.&quot;</span>
    ),
})

response = llm.chat.completions.create(
    model=LLM_MODEL,
    messages=[{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: content}],
    max_tokens=<span class="hljs-number">512</span>,
    temperature=<span class="hljs-number">0.7</span>,
)
style_prompt = response.choices[<span class="hljs-number">0</span>].message.content.strip()
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Style prompt from Qwen3.5:\n&quot;</span>)
<span class="hljs-built_in">print</span>(style_prompt)
<button class="copy-code-btn"></button></code></pre>
<p>Exemple de résultat :</p>
<pre><code translate="no">Style prompt from Qwen3.5:

Professional full-body fashion photograph of a model wearing a stylish new dress.
Bright, soft high-key lighting that illuminates the subject evenly. Clean,
uncluttered background, either stark white or a softly blurred bright outdoor
setting. The model stands in a relaxed, natural pose to showcase the garment&#x27;s
silhouette and drape. Sharp focus, vibrant colors, fresh and elegant commercial aesthetic.
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-8-Generate-the-Promotional-Image-with-Nano-Banana-2" class="common-anchor-header">Étape 8 : Générer l'image promotionnelle avec Nano Banana 2</h3><p>Nous transmettons trois entrées à Nano Banana 2 : la photo du nouveau produit, l'image du best-seller le mieux classé et l'invite de style que nous avons extraite à l'étape précédente. Le modèle les compose en une photo promotionnelle qui associe le nouveau vêtement à un style visuel éprouvé.</p>
<pre><code translate="no">gen_prompt = (
    <span class="hljs-string">f&quot;I have a new clothing product (Image 1: flat-lay photo) and a reference &quot;</span>
    <span class="hljs-string">f&quot;promotional photo from our bestselling catalog (Image 2).\n\n&quot;</span>
    <span class="hljs-string">f&quot;Generate a professional e-commerce promotional photograph of a female model &quot;</span>
    <span class="hljs-string">f&quot;wearing the clothing from Image 1.\n\n&quot;</span>
    <span class="hljs-string">f&quot;Style guidance: <span class="hljs-subst">{style_prompt}</span>\n\n&quot;</span>
    <span class="hljs-string">f&quot;Scene hint: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>\n\n&quot;</span>
    <span class="hljs-string">f&quot;Requirements:\n&quot;</span>
    <span class="hljs-string">f&quot;- Full body shot, photorealistic, high quality\n&quot;</span>
    <span class="hljs-string">f&quot;- The clothing should match Image 1 exactly\n&quot;</span>
    <span class="hljs-string">f&quot;- The photo style and mood should match Image 2&quot;</span>
)

gen_content = [
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(new_img)}},
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(retrieved_images[<span class="hljs-number">0</span>])}},
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: gen_prompt},
]

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Generating promotional photo with Nano Banana 2...&quot;</span>)
gen_response = llm.chat.completions.create(
    model=IMAGE_GEN_MODEL,
    messages=[{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: gen_content}],
    extra_body={
        <span class="hljs-string">&quot;modalities&quot;</span>: [<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;image&quot;</span>],
        <span class="hljs-string">&quot;image_config&quot;</span>: {<span class="hljs-string">&quot;aspect_ratio&quot;</span>: <span class="hljs-string">&quot;3:4&quot;</span>, <span class="hljs-string">&quot;image_size&quot;</span>: <span class="hljs-string">&quot;2K&quot;</span>},
    },
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Done!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Paramètres clés de l'appel API Nano Banana 2 :</p>
<ul>
<li>modalités : [&quot;text&quot;, &quot;image&quot;] : déclare que la réponse doit inclure une image.</li>
<li>image_config.aspect_ratio : contrôle le rapport d'aspect de la sortie (3:4 fonctionne bien pour les portraits et les photos de mode).</li>
<li>image_config.image_size : définit la résolution. Nano Banana 2 prend en charge les images de 512 px à 4K.</li>
</ul>
<p>Extraire l'image générée :</p>
<pre><code translate="no">generated_images = extract_images(gen_response)

text_content = gen_response.choices[<span class="hljs-number">0</span>].message.content
<span class="hljs-keyword">if</span> text_content:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Model response: <span class="hljs-subst">{text_content[:<span class="hljs-number">300</span>]}</span>\n&quot;</span>)

<span class="hljs-keyword">if</span> generated_images:
    <span class="hljs-keyword">for</span> i, img <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(generated_images):
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;--- Generated promo photo <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span> ---&quot;</span>)
        display(img)
        img.save(<span class="hljs-string">f&quot;promo_<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>_<span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>.png&quot;</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Saved: promo_<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>_<span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>.png&quot;</span>)
<span class="hljs-keyword">else</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;No image generated. Raw response:&quot;</span>)
    <span class="hljs-built_in">print</span>(gen_response.model_dump())
<button class="copy-code-btn"></button></code></pre>
<p>Sortie : <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-9-Side-by-Side-Comparison" class="common-anchor-header">Étape 9 : Comparaison côte à côte</h3><p>L'image générée respecte les grandes lignes : l'éclairage est doux et uniforme, la pose du modèle semble naturelle et l'ambiance correspond à la référence du best-seller.</p>
<p>Là où le résultat n'est pas à la hauteur, c'est au niveau du mélange des vêtements. Le cardigan semble collé sur le modèle plutôt que porté, et l'étiquette blanche de l'encolure transparaît. La génération en un seul passage a du mal à intégrer finement les vêtements au corps, c'est pourquoi nous proposons des solutions de contournement dans le résumé.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image10.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-10-Batch-Generation-for-All-New-Products" class="common-anchor-header">Étape 10 : Génération de lots pour tous les nouveaux produits</h3><p>Nous regroupons l'ensemble du pipeline dans une seule fonction et l'exécutons pour les nouveaux produits restants. Le code des lots est omis ici par souci de concision ; contactez-nous si vous avez besoin de l'implémentation complète.</p>
<p>Deux choses ressortent des résultats des lots. Les invites de style que nous obtenons de <strong>Qwen 3.5</strong> s'adaptent de manière significative à chaque produit : une robe d'été et un tricot d'hiver reçoivent des descriptions de scène véritablement différentes, adaptées à la saison, au cas d'utilisation et aux accessoires. Les images obtenues par <strong>Nano Banana 2</strong>, quant à elles, sont comparables à de véritables photographies de studio en termes d'éclairage, de texture et de composition.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>Dans cet article, nous avons présenté ce que Nano Banana 2 apporte à la génération d'images pour le commerce électronique, nous l'avons comparé à la version originale de Nano Banana et à la version Pro dans le cadre de tâches de production réelles, et nous avons expliqué comment construire un pipeline bestseller-image avec Milvus, Qwen 3.5 et Nano Banana 2.</p>
<p>Ce pipeline présente quatre avantages pratiques :</p>
<ul>
<li><strong>Coût contrôlé, budgets prévisibles.</strong> Le modèle d'intégration (Llama Nemotron Embed VL 1B v2) est gratuit sur OpenRouter. Nano Banana 2 fonctionne à peu près à la moitié du coût par image de Pro, et la sortie multiformat native élimine les cycles de retouche qui doublaient ou triplaient la facture effective. Pour les équipes de commerce électronique qui gèrent des milliers de références par saison, cette prévisibilité signifie que la production d'images s'adapte au catalogue au lieu de dépasser le budget.</li>
<li><strong>Automatisation de bout en bout, temps de référencement plus rapide.</strong> Le flux qui va de la photo de produit à plat à l'image promotionnelle finie se déroule sans intervention manuelle. Un nouveau produit peut passer de la photo d'entrepôt à l'image de référencement prête pour le marché en quelques minutes plutôt qu'en quelques jours, ce qui est particulièrement important pendant les saisons de pointe, lorsque le taux de rotation du catalogue est le plus élevé.</li>
<li><strong>Aucun GPU local n'est nécessaire, ce qui réduit la barrière à l'entrée.</strong> Chaque modèle est exécuté via l'API OpenRouter. Une équipe ne disposant pas d'infrastructure ML ni de personnel d'ingénierie dédié peut exécuter ce pipeline à partir d'un ordinateur portable. Il n'y a rien à provisionner, rien à maintenir et aucun investissement matériel initial.</li>
<li><strong>Une plus grande précision d'extraction, une plus grande cohérence de la marque.</strong> Milvus combine le filtrage dense, clairsemé et scalaire en une seule requête, ce qui lui permet de surpasser systématiquement les approches à vecteur unique pour la correspondance des produits. En pratique, cela signifie que les images générées héritent de manière plus fiable du langage visuel établi de votre marque : l'éclairage, la composition et le style que vos best-sellers existants ont déjà prouvé convertir. Les images générées ont l'air d'avoir leur place dans votre magasin, et non pas d'être des images génériques d'IA.</li>
</ul>
<p>Il existe également des limites qu'il convient de connaître :</p>
<ul>
<li><strong>Le mélange entre le vêtement et le corps.</strong> La génération d'un seul passage peut donner l'impression que les vêtements sont composés plutôt que portés. Les détails fins tels que les petits accessoires sont parfois flous. Solution : générer par étapes (d'abord l'arrière-plan, puis la pose du modèle, puis le composite). Cette approche multi-passages donne à chaque étape un champ d'application plus étroit et améliore considérablement la qualité du mélange.</li>
<li><strong>Fidélité des détails dans les cas extrêmes.</strong> Les accessoires, les motifs et les mises en page comportant beaucoup de texte peuvent perdre de leur netteté. Solution : ajouter des contraintes explicites à l'invite de génération ("les vêtements s'adaptent naturellement au corps, pas d'étiquettes apparentes, pas d'éléments supplémentaires, les détails du produit sont nets"). Si la qualité n'est toujours pas au rendez-vous pour un produit spécifique, passez à Nano Banana Pro pour la version finale.</li>
</ul>
<p><a href="https://milvus.io/">Milvus</a> est la base de données vectorielles open-source qui alimente l'étape de recherche hybride, et si vous souhaitez y jeter un coup d'œil ou essayer d'y insérer vos propres photos de produits, le<a href="https://milvus.io/docs">quickstart</a> <a href="https://milvus.io/docs"></a><a href="https://milvus.io/docs"></a> prend environ dix minutes. Nous avons une communauté assez active sur <a href="https://discord.gg/milvus"></a><a href="https://discord.gg/milvus">Discord</a> et Slack, et nous serions ravis de voir ce que les gens construisent avec cela. Et si vous finissez par faire fonctionner Nano Banana 2 avec un produit vertical différent ou un catalogue plus important, n'hésitez pas à nous faire part des résultats ! Nous serions ravis de les connaître.</p>
<h2 id="Keep-Reading" class="common-anchor-header">Lire la suite<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/nano-banana-milvus-turning-hype-into-enterprise-ready-multimodal-rag.md">Nano Banana + Milvus : Transformer le battage médiatique en un RAG multimodal prêt pour l'entreprise</a></li>
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">Qu'est-ce qu'OpenClaw ? Guide complet de l'agent d'intelligence artificielle open-source</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Tutoriel OpenClaw : Connexion à Slack pour un assistant IA local</a></li>
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">Nous avons extrait le système de mémoire d'OpenClaw et l'avons mis en open-source (memsearch)</a></li>
<li><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">Mémoire persistante pour le code Claude : memsearch ccplugin</a></li>
</ul>
