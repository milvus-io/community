---
id: choose-embedding-model-rag-2026.md
title: >-
  Comment choisir le meilleur modèle d'intégration pour le RAG en 2026 : 10
  modèles comparés
author: Cheney Zhang
date: 2026-3-26
cover: assets.zilliz.com/embedding_model_cover_ab72ccd651.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, Gemini Embedding 2, Embedding Model, RAG'
meta_keywords: >-
  best embedding model for RAG, embedding model comparison, multimodal embedding
  benchmark, MRL dimension compression, Gemini Embedding 2
meta_title: |
  Best Embedding Model for RAG 2026: 10 Models Compared
desc: >-
  Nous avons évalué 10 modèles d'intégration sur des tâches de compression
  multimodale, multilingue, de documents longs et de dimension. Voyez lequel
  convient à votre pipeline RAG.
origin: 'https://milvus.io/blog/choose-embedding-model-rag-2026.md'
---
<p><strong>TL;DR :</strong> Nous avons testé 10 <a href="https://zilliz.com/ai-models">modèles d'intégration</a> dans quatre scénarios de production qui ne sont pas pris en compte dans les benchmarks publics : recherche multimodale, recherche multilingue, recherche d'informations clés et compression dimensionnelle. Aucun modèle ne remporte tous les suffrages. Gemini Embedding 2 est le meilleur modèle polyvalent. Le modèle open-source Qwen3-VL-2B surpasse les API fermées dans les tâches multimodales. Si vous devez compresser des dimensions pour économiser de l'espace, optez pour Voyage Multimodal 3.5 ou Jina Embeddings v4.</p>
<h2 id="Why-MTEB-Isnt-Enough-for-Choosing-an-Embedding-Model" class="common-anchor-header">Pourquoi la MTEB ne suffit pas pour choisir un modèle d'intégration<button data-href="#Why-MTEB-Isnt-Enough-for-Choosing-an-Embedding-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>La plupart des prototypes <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> commencent avec le modèle d'intégration de texte 3-small d'OpenAI. Il est bon marché, facile à intégrer et fonctionne assez bien pour la recherche de texte en anglais. Mais le RAG de production le dépasse rapidement. Votre pipeline intègre des images, des PDF, des documents multilingues - et un <a href="https://zilliz.com/ai-models">modèle d'intégration de</a> texte uniquement ne suffit plus.</p>
<p>Le <a href="https://huggingface.co/spaces/mteb/leaderboard">classement de la MTEB</a> vous indique qu'il existe de meilleures options. Le problème ? Le MTEB ne teste que la recherche de texte dans une seule langue. Il ne couvre pas la recherche multimodale (requêtes textuelles contre des collections d'images), la recherche multilingue (une requête en chinois trouve un document en anglais), la précision des documents longs, ou la perte de qualité lorsque vous tronquez les <a href="https://zilliz.com/glossary/dimension">dimensions de l'incorporation</a> pour économiser de l'espace dans votre <a href="https://zilliz.com/learn/what-is-a-vector-database">base de données vectorielle</a>.</p>
<p>Quel modèle d'intégration devriez-vous donc utiliser ? Cela dépend de vos types de données, de vos langues, de la longueur de vos documents et de la nécessité d'une compression des dimensions. Nous avons créé un benchmark appelé <strong>CCKM</strong> et testé 10 modèles publiés entre 2025 et 2026 en fonction de ces dimensions.</p>
<h2 id="What-Is-the-CCKM-Benchmark" class="common-anchor-header">Qu'est-ce que l'indice de référence CCKM ?<button data-href="#What-Is-the-CCKM-Benchmark" class="anchor-icon" translate="no">
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
    </button></h2><p>Le<strong>CCKM</strong> (Cross-modal, Cross-lingual, Key information, MRL) teste quatre capacités que les tests de référence standard ne prennent pas en compte :</p>
<table>
<thead>
<tr><th>Dimension</th><th>Ce qu'il teste</th><th>Pourquoi c'est important</th></tr>
</thead>
<tbody>
<tr><td><strong>Recherche multimodale</strong></td><td>Faire correspondre des descriptions textuelles à l'image correcte en présence de distracteurs quasi-identiques.</td><td>Les pipelines<a href="https://zilliz.com/learn/multimodal-rag">RAG multimodaux</a> ont besoin d'intégrer le texte et l'image dans le même espace vectoriel.</td></tr>
<tr><td><strong>Recherche translinguistique</strong></td><td>Trouver le bon document en anglais à partir d'une requête en chinois, et vice versa.</td><td>Les bases de connaissances de production sont souvent multilingues</td></tr>
<tr><td><strong>Recherche d'informations clés</strong></td><td>Localiser un fait spécifique enfoui dans un document de 4K-32K caractères (aiguille dans une botte de foin)</td><td>Les systèmes RAG traitent fréquemment de longs documents tels que des contrats et des documents de recherche.</td></tr>
<tr><td><strong>Compression des dimensions MRL</strong></td><td>Mesure de la perte de qualité du modèle lorsque les enchâssements sont tronqués à 256 dimensions.</td><td>Moins de dimensions = coût de stockage plus faible dans votre base de données vectorielle, mais à quel prix en termes de qualité ?</td></tr>
</tbody>
</table>
<p>La MTEB ne couvre aucun de ces aspects. La MMEB ajoute la multimodalité, mais ne tient pas compte des négations dures, de sorte que les modèles obtiennent un score élevé sans prouver qu'ils gèrent les distinctions subtiles. CCKM est conçu pour couvrir ce qu'ils ne couvrent pas.</p>
<h2 id="Which-Embedding-Models-Did-We-Test-Gemini-Embedding-2-Jina-Embeddings-v4-and-More" class="common-anchor-header">Quels modèles d'intégration avons-nous testés ? Gemini Embedding 2, Jina Embeddings v4, etc.<button data-href="#Which-Embedding-Models-Did-We-Test-Gemini-Embedding-2-Jina-Embeddings-v4-and-More" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous avons testé 10 modèles couvrant à la fois les services API et les options open-source, ainsi que CLIP ViT-L-14 comme base de référence pour 2021.</p>
<table>
<thead>
<tr><th>Modèle</th><th>Source d'information</th><th>Paramètres</th><th>Dimensions</th><th>Modalité</th><th>Trait clé</th></tr>
</thead>
<tbody>
<tr><td>Gemini Embedding 2</td><td>Google</td><td>Non divulgué</td><td>3072</td><td>Texte / image / vidéo / audio / PDF</td><td>Toutes les modalités, la couverture la plus large</td></tr>
<tr><td>Jina Embeddings v4</td><td>Jina AI</td><td>3.8B</td><td>2048</td><td>Texte / image / PDF</td><td>Adaptateurs MRL + LoRA</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>Voyage AI (MongoDB)</td><td>Non communiqué</td><td>1024</td><td>Texte / image / vidéo</td><td>Équilibré entre les tâches</td></tr>
<tr><td>Qwen3-VL-Embedding-2B</td><td>Alibaba Qwen</td><td>2B</td><td>2048</td><td>Texte / image / vidéo</td><td>Open-source, multimodal léger</td></tr>
<tr><td>Jina CLIP v2</td><td>Jina AI</td><td>~1B</td><td>1024</td><td>Texte / image</td><td>Architecture CLIP modernisée</td></tr>
<tr><td>Cohere Embed v4</td><td>Cohere</td><td>Non divulgué</td><td>Fixe</td><td>Texte</td><td>Recherche d'entreprise</td></tr>
<tr><td>OpenAI text-embedding-3-large</td><td>OpenAI</td><td>Non divulgué</td><td>3072</td><td>Texte</td><td>Le plus utilisé</td></tr>
<tr><td><a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">BGE-M3</a></td><td>BAAI</td><td>568M</td><td>1024</td><td>Texte</td><td>Open-source, 100+ langues</td></tr>
<tr><td>mxbai-embed-large</td><td>Pain mixte AI</td><td>335M</td><td>1024</td><td>Texte</td><td>Léger, axé sur l'anglais</td></tr>
<tr><td>nomic-embed-text</td><td>Nomic AI</td><td>137M</td><td>768</td><td>Texte</td><td>Ultra-léger</td></tr>
<tr><td>CLIP ViT-L-14</td><td>OpenAI (2021)</td><td>428M</td><td>768</td><td>Texte / image</td><td>Base de référence</td></tr>
</tbody>
</table>
<h2 id="Cross-Modal-Retrieval-Which-Models-Handle-Text-to-Image-Search" class="common-anchor-header">Recherche multimodale : Quels modèles gèrent la recherche texte-image ?<button data-href="#Cross-Modal-Retrieval-Which-Models-Handle-Text-to-Image-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Si votre pipeline RAG traite des images en même temps que du texte, le modèle d'intégration doit placer les deux modalités dans le même <a href="https://zilliz.com/glossary/vector-embeddings">espace vectoriel</a>. Pensez à la recherche d'images dans le commerce électronique, aux bases de connaissances mixtes image-texte ou à tout système dans lequel une requête textuelle doit trouver la bonne image.</p>
<h3 id="Method" class="common-anchor-header">La méthode</h3><p>Nous avons pris 200 paires image-texte de COCO val2017. Pour chaque image, GPT-4o-mini a généré une description détaillée. Ensuite, nous avons écrit 3 hard negatives par image - des descriptions qui diffèrent de la bonne par seulement un ou deux détails. Le modèle doit trouver la bonne correspondance dans un ensemble de 200 images et 600 distracteurs.</p>
<p>Un exemple tiré de l'ensemble de données :</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_9_3965746e33.png" alt="Vintage brown leather suitcases with travel stickers including California and Cuba, placed on a metal luggage rack against a blue sky — used as a test image in the cross-modal retrieval benchmark" class="doc-image" id="vintage-brown-leather-suitcases-with-travel-stickers-including-california-and-cuba,-placed-on-a-metal-luggage-rack-against-a-blue-sky-—-used-as-a-test-image-in-the-cross-modal-retrieval-benchmark" />
   </span> <span class="img-wrapper"> <span>Des valises vintage en cuir marron avec des autocollants de voyage incluant la Californie et Cuba, placées sur un porte-bagages en métal sur fond de ciel bleu - utilisé comme image test dans le benchmark de recherche cross-modale.</span> </span></p>
<blockquote>
<p><strong>Description correcte :</strong> "L'image montre des valises vintage en cuir marron avec divers autocollants de voyage, notamment "Californie", "Cuba" et "New York", placées sur un porte-bagages en métal dans un ciel bleu clair".</p>
<p><strong>Négatif dur :</strong> Même phrase, mais "Californie" devient "Floride" et "ciel bleu" devient "ciel couvert". Le modèle doit comprendre les détails de l'image pour les différencier.</p>
</blockquote>
<p><strong>Notation :</strong></p>
<ul>
<li>Générer des <a href="https://zilliz.com/glossary/vector-embeddings">embeddings</a> pour toutes les images et tous les textes (200 descriptions correctes + 600 négatifs).</li>
<li><strong>Texte-image (t2i) :</strong> Chaque description recherche la correspondance la plus proche dans 200 images. Un point est attribué si le premier résultat est correct.</li>
<li><strong>Image-texte (i2t) :</strong> Chaque image recherche la correspondance la plus proche dans les 800 textes. Un point n'est attribué que si le premier résultat est la bonne description, et non un résultat négatif.</li>
<li><strong>Score final :</strong> hard_avg_R@1 = (précision t2i + précision i2t) / 2</li>
</ul>
<h3 id="Results" class="common-anchor-header">Résultats</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_1_6f1fddae56.png" alt="Horizontal bar chart showing Cross-Modal Retrieval Ranking: Qwen3-VL-2B leads at 0.945, followed by Gemini Embed 2 at 0.928, Voyage MM-3.5 at 0.900, Jina CLIP v2 at 0.873, and CLIP ViT-L-14 at 0.768" class="doc-image" id="horizontal-bar-chart-showing-cross-modal-retrieval-ranking:-qwen3-vl-2b-leads-at-0.945,-followed-by-gemini-embed-2-at-0.928,-voyage-mm-3.5-at-0.900,-jina-clip-v2-at-0.873,-and-clip-vit-l-14-at-0.768" />
   <span>Diagramme à barres horizontales montrant le classement de la recherche multimodale : Qwen3-VL-2B est en tête avec 0,945, suivi de Gemini Embed 2 avec 0,928, Voyage MM-3.5 avec 0,900, Jina CLIP v2 avec 0,873 et CLIP ViT-L-14 avec 0,768.</span> </span></p>
<p>Qwen3-VL-2B, un modèle de paramètres 2B à source ouverte de l'équipe Qwen d'Alibaba, est arrivé en tête - devant toutes les API à source fermée.</p>
<p>L'<strong>écart de modalité</strong> explique la majeure partie de la différence. Les modèles d'intégration cartographient le texte et les images dans le même espace vectoriel, mais dans la pratique, les deux modalités ont tendance à se regrouper dans des régions différentes. L'écart entre les modalités mesure la distance L2 entre ces deux groupes. Plus l'écart est faible, plus la recherche multimodale est aisée.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_8_c5067a3434.png" alt="Visualization comparing large modality gap (0.73, text and image embedding clusters far apart) versus small modality gap (0.25, clusters overlapping) — smaller gap makes cross-modal matching easier" class="doc-image" id="visualization-comparing-large-modality-gap-(0.73,-text-and-image-embedding-clusters-far-apart)-versus-small-modality-gap-(0.25,-clusters-overlapping)-—-smaller-gap-makes-cross-modal-matching-easier" />
   </span> <span class="img-wrapper"> <span>Visualisation comparant un grand écart de modalité (0,73, grappes de texte et d'images éloignées les unes des autres) à un petit écart de modalité (0,25, grappes se chevauchant) - un écart plus petit facilite la correspondance intermodale.</span> </span></p>
<table>
<thead>
<tr><th>Modèle</th><th>Score (R@1)</th><th>Écart de modalité</th><th>Params</th></tr>
</thead>
<tbody>
<tr><td>Qwen3-VL-2B</td><td>0.945</td><td>0.25</td><td>2B (source ouverte)</td></tr>
<tr><td>Gemini Embedding 2</td><td>0.928</td><td>0.73</td><td>Inconnu (fermé)</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>0.900</td><td>0.59</td><td>Inconnu (fermé)</td></tr>
<tr><td>Jina CLIP v2</td><td>0.873</td><td>0.87</td><td>~1B</td></tr>
<tr><td>CLIP ViT-L-14</td><td>0.768</td><td>0.83</td><td>428M</td></tr>
</tbody>
</table>
<p>L'écart de modalité de Qwen est de 0,25, soit environ un tiers de celui de Gemini (0,73). Dans une <a href="https://zilliz.com/learn/what-is-a-vector-database">base de données vectorielle</a> comme <a href="https://milvus.io/">Milvus</a>, un faible écart de modalité signifie que vous pouvez stocker des enregistrements de texte et d'image dans la même <a href="https://milvus.io/docs/manage-collections.md">collection</a> et <a href="https://milvus.io/docs/single-vector-search.md">effectuer des recherches</a> directement dans les deux. Un écart important peut rendre la <a href="https://zilliz.com/glossary/similarity-search">recherche de similarité</a> intermodale moins fiable, et il peut être nécessaire de procéder à un reclassement pour compenser.</p>
<h2 id="Cross-Lingual-Retrieval-Which-Models-Align-Meaning-Across-Languages" class="common-anchor-header">Recherche interlinguistique : Quels modèles permettent d'aligner le sens entre les langues ?<button data-href="#Cross-Lingual-Retrieval-Which-Models-Align-Meaning-Across-Languages" class="anchor-icon" translate="no">
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
    </button></h2><p>Les bases de connaissances multilingues sont courantes en production. Un utilisateur pose une question en chinois, mais la réponse se trouve dans un document en anglais - ou l'inverse. Le modèle d'intégration doit aligner le sens entre les langues, et pas seulement à l'intérieur d'une même langue.</p>
<h3 id="Method" class="common-anchor-header">La méthode</h3><p>Nous avons construit 166 paires de phrases parallèles en chinois et en anglais sur trois niveaux de difficulté :</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_6_75caab66a7.png" alt="Cross-lingual difficulty tiers: Easy tier maps literal translations like 我爱你 to I love you; Medium tier maps paraphrased sentences like 这道菜太咸了 to This dish is too salty with hard negatives; Hard tier maps Chinese idioms like 画蛇添足 to gilding the lily with semantically different hard negatives" class="doc-image" id="cross-lingual-difficulty-tiers:-easy-tier-maps-literal-translations-like-我爱你-to-i-love-you;-medium-tier-maps-paraphrased-sentences-like-这道菜太咸了-to-this-dish-is-too-salty-with-hard-negatives;-hard-tier-maps-chinese-idioms-like-画蛇添足-to-gilding-the-lily-with-semantically-different-hard-negatives" />
   <span>Niveaux de difficulté interlinguistique : Le niveau facile associe des traductions littérales comme 我爱你 à I love you ; le niveau moyen associe des phrases paraphrasées comme 这道菜太咸了 à This dish is too salty (Ce plat est trop salé) avec des négations dures ; le niveau difficile associe des expressions idiomatiques chinoises comme 画蛇添足 à gilding the lily (Dorer le lys) avec des négations dures sémantiquement différentes.</span> </span></p>
<p>Chaque langue dispose également de 152 distracteurs négatifs durs.</p>
<p><strong>Notation :</strong></p>
<ul>
<li>Générer des embeddings pour tout le texte chinois (166 corrects + 152 distracteurs) et tout le texte anglais (166 corrects + 152 distracteurs).</li>
<li><strong>Chinois → anglais :</strong> Chaque phrase chinoise recherche sa traduction correcte dans 318 textes anglais.</li>
<li><strong>Anglais → chinois :</strong> Idem en sens inverse.</li>
<li><strong>Score final :</strong> hard_avg_R@1 = (zh→en accuracy + en→zh accuracy) / 2</li>
</ul>
<h3 id="Results" class="common-anchor-header">Résultats</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_2_d1c3500423.png" alt="Horizontal bar chart showing Cross-Lingual Retrieval Ranking: Gemini Embed 2 leads at 0.997, followed by Qwen3-VL-2B at 0.988, Jina v4 at 0.985, Voyage MM-3.5 at 0.982, down to mxbai at 0.120" class="doc-image" id="horizontal-bar-chart-showing-cross-lingual-retrieval-ranking:-gemini-embed-2-leads-at-0.997,-followed-by-qwen3-vl-2b-at-0.988,-jina-v4-at-0.985,-voyage-mm-3.5-at-0.982,-down-to-mxbai-at-0.120" />
   <span>Diagramme à barres horizontales montrant le classement de la recherche multilingue : Gemini Embed 2 est en tête avec 0,997, suivi de Qwen3-VL-2B avec 0,988, Jina v4 avec 0,985, Voyage MM-3.5 avec 0,982, jusqu'à mxbai avec 0,120.</span> </span></p>
<p>Gemini Embedding 2 a obtenu un score de 0,997 - le plus élevé de tous les modèles testés. C'est le seul modèle à avoir obtenu un score parfait de 1,000 sur le niveau difficile, où des paires telles que "画蛇添足" → "gilding the lily" nécessitent une véritable compréhension <a href="https://zilliz.com/glossary/semantic-search">sémantique</a> à travers les langues, et non pas une correspondance de motifs.</p>
<table>
<thead>
<tr><th>Modèle</th><th>Score (R@1)</th><th>Facile</th><th>Moyen</th><th>Difficile (idiomes)</th></tr>
</thead>
<tbody>
<tr><td>Intégration de Gemini 2</td><td>0.997</td><td>1.000</td><td>1.000</td><td>1.000</td></tr>
<tr><td>Qwen3-VL-2B</td><td>0.988</td><td>1.000</td><td>1.000</td><td>0.969</td></tr>
<tr><td>Jina Embeddings v4</td><td>0.985</td><td>1.000</td><td>1.000</td><td>0.969</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>0.982</td><td>1.000</td><td>1.000</td><td>0.938</td></tr>
<tr><td>OpenAI 3-large</td><td>0.967</td><td>1.000</td><td>1.000</td><td>0.906</td></tr>
<tr><td>Cohere Embed v4</td><td>0.955</td><td>1.000</td><td>0.980</td><td>0.875</td></tr>
<tr><td>BGE-M3 (568M)</td><td>0.940</td><td>1.000</td><td>0.960</td><td>0.844</td></tr>
<tr><td>nomic-embed-text (137M)</td><td>0.154</td><td>0.300</td><td>0.120</td><td>0.031</td></tr>
<tr><td>mxbai-embed-large (335M)</td><td>0.120</td><td>0.220</td><td>0.080</td><td>0.031</td></tr>
</tbody>
</table>
<p>Les 7 meilleurs modèles obtiennent tous un score global de 0,93 - la véritable différenciation se produit sur le niveau difficile (idiomes chinois). nomic-embed-text et mxbai-embed-large, deux modèles légers axés sur l'anglais, obtiennent un score proche de zéro dans les tâches interlinguistiques.</p>
<h2 id="Key-Information-Retrieval-Can-Models-Find-a-Needle-in-a-32K-Token-Document" class="common-anchor-header">Recherche d'informations clés : Les modèles peuvent-ils trouver une aiguille dans un document de 32 000 mots ?<button data-href="#Key-Information-Retrieval-Can-Models-Find-a-Needle-in-a-32K-Token-Document" class="anchor-icon" translate="no">
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
    </button></h2><p>Les systèmes RAG traitent souvent de longs documents - contrats juridiques, documents de recherche, rapports internes contenant des <a href="https://zilliz.com/learn/introduction-to-unstructured-data">données non structurées</a>. La question est de savoir si un modèle d'intégration peut encore trouver un fait spécifique enfoui dans des milliers de caractères de texte environnant.</p>
<h3 id="Method" class="common-anchor-header">Méthode</h3><p>Nous avons pris des articles de Wikipédia de différentes longueurs (4K à 32K caractères) comme la botte de foin et nous avons inséré un seul fait fabriqué - l'aiguille - à différentes positions : début, 25%, 50%, 75% et fin. Le modèle doit déterminer, sur la base d'une requête intégrée, quelle version du document contient l'aiguille.</p>
<p><strong>Exemple :</strong></p>
<ul>
<li><strong>Aiguille :</strong> "La société Meridian a déclaré un chiffre d'affaires trimestriel de 847,3 millions de dollars au troisième trimestre 2025."</li>
<li><strong>Requête :</strong> "Quel a été le chiffre d'affaires trimestriel de Meridian Corporation ?"</li>
<li><strong>Botte de foin :</strong> Un article de 32 000 caractères de Wikipedia sur la photosynthèse, avec l'aiguille cachée quelque part à l'intérieur.</li>
</ul>
<p><strong>Évaluation :</strong></p>
<ul>
<li>Générer des embeddings pour la requête, le document avec l'aiguille et le document sans l'aiguille.</li>
<li>Si la requête est plus similaire au document contenant l'aiguille, elle est considérée comme un succès.</li>
<li>Précision moyenne pour toutes les longueurs de document et toutes les positions de l'aiguille.</li>
<li><strong>Mesures finales :</strong> précision globale et taux de dégradation (baisse de la précision du document le plus court au document le plus long).</li>
</ul>
<h3 id="Results" class="common-anchor-header">Résultats</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_5_2bdc89516a.png" alt="Heatmap showing Needle-in-a-Haystack accuracy by document length: Gemini Embed 2 scores 1.000 across all lengths up to 32K; top 7 models score perfectly within their context windows; mxbai and nomic degrade sharply at 4K+" class="doc-image" id="heatmap-showing-needle-in-a-haystack-accuracy-by-document-length:-gemini-embed-2-scores-1.000-across-all-lengths-up-to-32k;-top-7-models-score-perfectly-within-their-context-windows;-mxbai-and-nomic-degrade-sharply-at-4k+" />
   <span>Carte thermique montrant la précision de l'aiguille dans une botte de foin en fonction de la longueur du document : Gemini Embed 2 obtient un score de 1,000 pour toutes les longueurs jusqu'à 32K ; les 7 premiers modèles obtiennent des scores parfaits dans leurs fenêtres contextuelles ; mxbai et nomic se dégradent fortement à partir de 4K+.</span> </span></p>
<p>Gemini Embedding 2 est le seul modèle testé sur l'ensemble de la plage 4K-32K, et il a obtenu un score parfait pour toutes les longueurs. Aucun autre modèle de ce test n'a une fenêtre contextuelle qui atteint 32K.</p>
<table>
<thead>
<tr><th>Modèle</th><th>1K</th><th>4K</th><th>8K</th><th>16K</th><th>32K</th><th>Total</th><th>Dégradation</th></tr>
</thead>
<tbody>
<tr><td>Gemini Embedding 2</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>0%</td></tr>
<tr><td>OpenAI 3-large</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Jina Embeddings v4</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Cohere Embed v4</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Qwen3-VL-2B</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Voyage Multimodal 3,5</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Jina CLIP v2</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>BGE-M3 (568M)</td><td>1.000</td><td>1.000</td><td>0.920</td><td>-</td><td>-</td><td>0.973</td><td>8%</td></tr>
<tr><td>mxbai-embed-large (335M)</td><td>0.980</td><td>0.600</td><td>0.400</td><td>-</td><td>-</td><td>0.660</td><td>58%</td></tr>
<tr><td>nomic-embed-text (137M)</td><td>1.000</td><td>0.460</td><td>0.440</td><td>-</td><td>-</td><td>0.633</td><td>56%</td></tr>
</tbody>
</table>
<p>"-" signifie que la longueur du document dépasse la fenêtre contextuelle du modèle.</p>
<p>Les 7 meilleurs modèles obtiennent des résultats parfaits dans leur fenêtre contextuelle. BGE-M3 commence à glisser à 8K (0.920). Les modèles légers (mxbai et nomic) tombent à 0,4-0,6 à seulement 4K caractères, soit environ 1 000 tokens. Pour mxbai, cette baisse reflète en partie sa fenêtre contextuelle de 512 tokens qui tronque la majeure partie du document.</p>
<h2 id="MRL-Dimension-Compression-How-Much-Quality-Do-You-Lose-at-256-Dimensions" class="common-anchor-header">Compression dimensionnelle MRL : Quelle est la qualité perdue à 256 dimensions ?<button data-href="#MRL-Dimension-Compression-How-Much-Quality-Do-You-Lose-at-256-Dimensions" class="anchor-icon" translate="no">
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
    </button></h2><p>L'<strong>apprentissage par représentation de Matryoshka (MRL)</strong> est une technique d'apprentissage qui rend les N premières dimensions d'un vecteur significatives en elles-mêmes. Prenez un vecteur à 3072 dimensions, tronquez-le à 256, et il conservera l'essentiel de sa qualité sémantique. Moins de dimensions signifie moins de coûts de stockage et de mémoire dans votre <a href="https://zilliz.com/learn/what-is-a-vector-database">base de données vectorielle</a> - passer de 3072 à 256 dimensions représente une réduction de stockage de 12 fois.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_10_aef8755877.png" alt="Illustration showing MRL dimension truncation: 3072 dimensions at full quality, 1024 at 95%, 512 at 90%, 256 at 85% — with 12x storage savings at 256 dimensions" class="doc-image" id="illustration-showing-mrl-dimension-truncation:-3072-dimensions-at-full-quality,-1024-at-95%,-512-at-90%,-256-at-85%-—-with-12x-storage-savings-at-256-dimensions" />
   <span>Illustration montrant la troncature des dimensions du MRL : 3072 dimensions pour une qualité totale, 1024 pour 95%, 512 pour 90%, 256 pour 85% - avec des économies de stockage de 12x à 256 dimensions.</span> </span></p>
<h3 id="Method" class="common-anchor-header">La méthode</h3><p>Nous avons utilisé 150 paires de phrases issues du benchmark STS-B, chacune avec un score de similarité annoté par l'homme (0-5). Pour chaque modèle, nous avons généré des embeddings à pleine dimension, puis nous les avons tronqués à 1024, 512 et 256.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_4_44266e5456.png" alt="STS-B data examples showing sentence pairs with human similarity scores: A girl is styling her hair vs A girl is brushing her hair scores 2.5; A group of men play soccer on the beach vs A group of boys are playing soccer on the beach scores 3.6" class="doc-image" id="sts-b-data-examples-showing-sentence-pairs-with-human-similarity-scores:-a-girl-is-styling-her-hair-vs-a-girl-is-brushing-her-hair-scores-2.5;-a-group-of-men-play-soccer-on-the-beach-vs-a-group-of-boys-are-playing-soccer-on-the-beach-scores-3.6" />
   <span>Exemples de données STS-B montrant des paires de phrases avec des scores de similarité humains : Une fille se coiffe vs Une fille se brosse les cheveux obtient un score de 2,5 ; Un groupe d'hommes joue au football sur la plage vs Un groupe de garçons joue au football sur la plage obtient un score de 3,6.</span> </span></p>
<p><strong>Notation :</strong></p>
<ul>
<li>À chaque niveau de dimension, calculez la <a href="https://zilliz.com/glossary/cosine-similarity">similarité en cosinus</a> entre les encastrements de chaque paire de phrases.</li>
<li>Comparez le classement de similarité du modèle au classement humain en utilisant le <strong>ρ de Spearman</strong> (corrélation de rang).</li>
</ul>
<blockquote>
<p><strong>Qu'est-ce que le ρ de Spearman ?</strong> Il mesure le degré de concordance entre deux classements. Si les humains classent la paire A comme la plus similaire, B comme la deuxième, C comme la moins similaire - et que les similitudes cosinus du modèle produisent le même ordre A &gt; B &gt; C - alors ρ s'approche de 1,0. Un ρ de 1,0 signifie un accord parfait. Un ρ de 0 signifie qu'il n'y a pas de corrélation.</p>
</blockquote>
<p><strong>Mesures finales :</strong> spearman_rho (plus c'est élevé, mieux c'est) et min_viable_dim (la plus petite dimension où la qualité reste dans les 5 % de la performance de la dimension complète).</p>
<h3 id="Results" class="common-anchor-header">Résultats</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_3_7192725ed6.png" alt="Dot plot showing MRL Full Dimension vs 256 Dimension Quality: Voyage MM-3.5 leads with +0.6% change, Jina v4 +0.5%, while Gemini Embed 2 shows -0.6% at the bottom" class="doc-image" id="dot-plot-showing-mrl-full-dimension-vs-256-dimension-quality:-voyage-mm-3.5-leads-with-+0.6%-change,-jina-v4-+0.5%,-while-gemini-embed-2-shows--0.6%-at-the-bottom" />
   <span>Diagramme en pointillés montrant la qualité de MRL Full Dimension vs 256 Dimension Quality : Voyage MM-3.5 est en tête avec un changement de +0,6 %, Jina v4 +0,5 %, tandis que Gemini Embed 2 affiche -0,6 % au bas de l'échelle.</span> </span></p>
<p>Si vous envisagez de réduire les coûts de stockage dans <a href="https://milvus.io/">Milvus</a> ou dans une autre base de données vectorielle en tronquant les dimensions, ce résultat est important.</p>
<table>
<thead>
<tr><th>Modèle</th><th>ρ (full dim)</th><th>ρ (256 dim)</th><th>Décroissance</th></tr>
</thead>
<tbody>
<tr><td>Voyage Multimodal 3.5</td><td>0.880</td><td>0.874</td><td>0.7%</td></tr>
<tr><td>Jina Embeddings v4</td><td>0.833</td><td>0.828</td><td>0.6%</td></tr>
<tr><td>mxbai-embed-large (335M)</td><td>0.815</td><td>0.795</td><td>2.5%</td></tr>
<tr><td>nomic-embed-text (137M)</td><td>0.781</td><td>0.774</td><td>0.8%</td></tr>
<tr><td>OpenAI 3-large</td><td>0.767</td><td>0.762</td><td>0.6%</td></tr>
<tr><td>Gemini Embedding 2</td><td>0.683</td><td>0.689</td><td>-0.8%</td></tr>
</tbody>
</table>
<p>Voyage et Jina v4 sont en tête parce qu'ils ont tous deux été explicitement entraînés avec le MRL comme objectif. La compression dimensionnelle n'a pas grand-chose à voir avec la taille du modèle - ce qui compte, c'est que le modèle ait été entraîné pour cela.</p>
<p>Une remarque sur le score de Gemini : le classement MRL reflète la manière dont un modèle préserve la qualité après la troncature, et non la qualité de son extraction en dimension complète. La recherche en dimension complète de Gemini est forte - les résultats en matière d'informations clés et multilingues l'ont déjà prouvé. C'est juste qu'il n'a pas été optimisé pour la réduction. Si vous n'avez pas besoin de compression dimensionnelle, cette mesure ne s'applique pas à vous.</p>
<h2 id="Which-Embedding-Model-Should-You-Use" class="common-anchor-header">Quel modèle d'intégration devriez-vous utiliser ?<button data-href="#Which-Embedding-Model-Should-You-Use" class="anchor-icon" translate="no">
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
    </button></h2><p>Aucun modèle ne remporte tous les suffrages. Voici le tableau de bord complet :</p>
<table>
<thead>
<tr><th>Modèle</th><th>Paramètres</th><th>Cross-Modal</th><th>Translinguistique</th><th>Informations clés</th><th>MRL ρ</th></tr>
</thead>
<tbody>
<tr><td>Gemini Embedding 2</td><td>Non divulgué</td><td>0.928</td><td>0.997</td><td>1.000</td><td>0.668</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>Non communiqué</td><td>0.900</td><td>0.982</td><td>1.000</td><td>0.880</td></tr>
<tr><td>Jina Embeddings v4</td><td>3.8B</td><td>-</td><td>0.985</td><td>1.000</td><td>0.833</td></tr>
<tr><td>Qwen3-VL-2B</td><td>2B</td><td>0.945</td><td>0.988</td><td>1.000</td><td>0.774</td></tr>
<tr><td>OpenAI 3-large</td><td>Non communiqué</td><td>-</td><td>0.967</td><td>1.000</td><td>0.760</td></tr>
<tr><td>Cohere Embed v4</td><td>Non divulgué</td><td>-</td><td>0.955</td><td>1.000</td><td>-</td></tr>
<tr><td>Jina CLIP v2</td><td>~1B</td><td>0.873</td><td>0.934</td><td>1.000</td><td>-</td></tr>
<tr><td>BGE-M3</td><td>568M</td><td>-</td><td>0.940</td><td>0.973</td><td>0.744</td></tr>
<tr><td>mxbai-embed-large</td><td>335M</td><td>-</td><td>0.120</td><td>0.660</td><td>0.815</td></tr>
<tr><td>nomic-embed-text</td><td>137M</td><td>-</td><td>0.154</td><td>0.633</td><td>0.780</td></tr>
<tr><td>CLIP ViT-L-14</td><td>428M</td><td>0.768</td><td>0.030</td><td>-</td><td>-</td></tr>
</tbody>
</table>
<p>"-" signifie que le modèle ne prend pas en charge cette modalité ou capacité. CLIP est une base de référence pour 2021.</p>
<p>Voici ce qui ressort :</p>
<ul>
<li><strong>Modalité croisée :</strong> Qwen3-VL-2B (0,945) premier, Gemini (0,928) deuxième, Voyage (0,900) troisième. Un modèle 2B à source ouverte a battu toutes les API à source fermée. Le facteur décisif a été l'écart entre les modalités, et non le nombre de paramètres.</li>
<li><strong>Cross-lingual :</strong> Gemini (0.997) est en tête - le seul modèle à obtenir un score parfait pour l'alignement au niveau de l'idiome. Les 8 premiers modèles obtiennent tous un score de 0,93. Les modèles légers uniquement en anglais obtiennent un score proche de zéro.</li>
<li><strong>Informations clés :</strong> Les modèles API et les grands modèles open-source obtiennent un score parfait jusqu'à 8K. Les modèles inférieurs à 335M commencent à se dégrader à 4K. Gemini est le seul modèle qui gère 32K avec un score parfait.</li>
<li><strong>Compression des dimensions MRL :</strong> Voyage (0.880) et Jina v4 (0.833) sont en tête, perdant moins de 1% à 256 dimensions. Gemini (0.668) arrive en dernière position - fort en pleine dimension, pas optimisé pour la troncature.</li>
</ul>
<h3 id="How-to-Pick-A-Decision-Flowchart" class="common-anchor-header">Comment choisir : un organigramme de décision</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_7_b2bd48bdcc.png" alt="Embedding model selection flowchart: Start → Need images or video? → Yes: Need to self-host? → Yes: Qwen3-VL-2B, No: Gemini Embedding 2. No images → Need to save storage? → Yes: Jina v4 or Voyage, No: Need multilingual? → Yes: Gemini Embedding 2, No: OpenAI 3-large" class="doc-image" id="embedding-model-selection-flowchart:-start-→-need-images-or-video?-→-yes:-need-to-self-host?-→-yes:-qwen3-vl-2b,-no:-gemini-embedding-2.-no-images-→-need-to-save-storage?-→-yes:-jina-v4-or-voyage,-no:-need-multilingual?-→-yes:-gemini-embedding-2,-no:-openai-3-large" />
   <span>Organigramme de sélection du modèle d'intégration : Démarrer → Besoin d'images ou de vidéos ? → Oui : Besoin d'auto-hébergement ? → Oui : Qwen3-VL-2B, Non : Gemini Embedding 2. Pas d'images → Besoin d'économiser de l'espace de stockage ? → Oui : Jina v4 ou Voyage, Non : Besoin de multilinguisme ?</span> </span>→ <span class="img-wrapper"> <span>Oui : Gemini Embedding 2, Non : OpenAI 3-large</span> </span></p>
<h3 id="The-Best-All-Rounder-Gemini-Embedding-2" class="common-anchor-header">La meilleure solution polyvalente : Gemini Embedding 2</h3><p>Dans l'ensemble, Gemini Embedding 2 est le modèle le plus performant de cette étude comparative.</p>
<p><strong>Points forts :</strong> Premier dans les domaines du multilinguisme (0,997) et de la recherche d'informations clés (1,000 pour toutes les longueurs jusqu'à 32K). Deuxième pour l'inter-modalité (0.928). Couverture modale la plus large - cinq modalités (texte, image, vidéo, audio, PDF) alors que la plupart des modèles se limitent à trois modalités.</p>
<p><strong>Points faibles :</strong> Dernier pour la compression MRL (ρ = 0,668). Il est battu en cross-modal par le modèle open-source Qwen3-VL-2B.</p>
<p>Si vous n'avez pas besoin de compression dimensionnelle, Gemini n'a pas de véritable concurrent pour la combinaison multilingue + recherche de documents longs. Mais pour la précision cross-modale ou l'optimisation du stockage, des modèles spécialisés sont plus performants.</p>
<h2 id="Limitations" class="common-anchor-header">Limites<button data-href="#Limitations" class="anchor-icon" translate="no">
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
<li>Nous n'avons pas inclus tous les modèles dignes d'intérêt - NV-Embed-v2 de NVIDIA et v5-text de Jina figuraient sur la liste mais n'ont pas été retenus.</li>
<li>Nous nous sommes concentrés sur les modalités du texte et de l'image ; la vidéo, l'audio et l'intégration de PDF (bien que certains modèles prétendent les prendre en charge) n'ont pas été couverts.</li>
<li>La recherche de code et d'autres scénarios spécifiques à un domaine n'ont pas été pris en compte.</li>
<li>La taille des échantillons était relativement faible, de sorte que les différences de classement entre les modèles peuvent relever du bruit statistique.</li>
</ul>
<p>Les résultats de cet article seront dépassés d'ici un an. De nouveaux modèles sont constamment livrés, et le classement est modifié à chaque version. L'investissement le plus durable consiste à construire votre propre pipeline d'évaluation - définissez vos types de données, vos modèles de requêtes, vos longueurs de documents, et soumettez les nouveaux modèles à vos propres tests lorsqu'ils sortent. Les benchmarks publics comme MTEB, MMTEB et MMEB valent la peine d'être surveillés, mais la décision finale doit toujours être prise à partir de vos propres données.</p>
<p><a href="https://github.com/zc277584121/mm-embedding-bench">Notre code de référence est en libre accès sur GitHub</a> - faites-en la demande et adaptez-le à votre cas d'utilisation.</p>
<hr>
<p>Une fois que vous avez choisi votre modèle d'intégration, vous avez besoin d'un endroit pour stocker et rechercher ces vecteurs à grande échelle. <a href="https://milvus.io/">Milvus</a> est la base de données vectorielles open-source la plus largement adoptée au monde, avec <a href="https://github.com/milvus-io/milvus">plus de 43 000 étoiles GitHub</a>, conçue exactement pour cela - elle prend en charge les dimensions tronquées MRL, les collections multimodales mixtes, la recherche hybride combinant des vecteurs denses et épars, et <a href="https://milvus.io/docs/architecture_overview.md">s'étend d'un ordinateur portable à des milliards de vecteurs</a>.</p>
<ul>
<li>Démarrez avec le <a href="https://milvus.io/docs/quickstart.md">guide de démarrage rapide Milvus</a>, ou installez avec <code translate="no">pip install pymilvus</code>.</li>
<li>Rejoignez Milvus <a href="https://milvusio.slack.com/">Slack</a> ou <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord</a> pour poser des questions sur l'intégration de modèles, les stratégies d'indexation vectorielle ou la mise à l'échelle de la production.</li>
<li><a href="https://milvus.io/office-hours">Réservez une session gratuite Milvus Office Hours</a> pour examiner votre architecture RAG - nous pouvons vous aider dans la sélection des modèles, la conception des schémas de collecte et l'optimisation des performances.</li>
<li>Si vous préférez ignorer le travail d'infrastructure, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (géré par Milvus) propose un niveau gratuit pour commencer.</li>
</ul>
<hr>
<p>Quelques questions qui se posent lorsque les ingénieurs choisissent un modèle d'intégration pour la production de RAG :</p>
<p><strong>Q : Dois-je utiliser un modèle d'intégration multimodale même si je n'ai que des données textuelles pour l'instant ?</strong></p>
<p>Cela dépend de votre feuille de route. Si votre pipeline est susceptible d'ajouter des images, des PDF ou d'autres modalités dans les 6 à 12 prochains mois, commencer par un modèle multimodal comme Gemini Embedding 2 ou Voyage Multimodal 3.5 vous évite une migration pénible plus tard - vous n'aurez pas besoin de réenregistrer l'ensemble de vos données. Si vous êtes sûr de ne conserver que du texte dans un avenir proche, un modèle axé sur le texte comme OpenAI 3-large ou Cohere Embed v4 vous offrira un meilleur rapport qualité/prix.</p>
<p><strong>Q : Quelle quantité d'espace de stockage la compression des dimensions MRL permet-elle d'économiser dans une base de données vectorielle ?</strong></p>
<p>Passer de 3072 dimensions à 256 dimensions représente une réduction de 12x de l'espace de stockage par vecteur. Pour une collection <a href="https://milvus.io/">Milvus</a> de 100 millions de vecteurs à float32, cela représente environ 1,14 TB → 95 GB. La clé est que tous les modèles ne gèrent pas bien la troncature - Voyage Multimodal 3.5 et Jina Embeddings v4 perdent moins de 1 % de qualité à 256 dimensions, tandis que d'autres se dégradent de manière significative.</p>
<p><strong>Q : Qwen3-VL-2B est-il vraiment meilleur que Gemini Embedding 2 pour la recherche multimodale ?</strong></p>
<p>Sur notre benchmark, oui - Qwen3-VL-2B a obtenu un score de 0,945 contre 0,928 pour Gemini dans le cadre d'une recherche multimodale difficile avec des distracteurs quasi-identiques. La raison principale est l'écart de modalité beaucoup plus faible de Qwen (0,25 contre 0,73), ce qui signifie que les <a href="https://zilliz.com/glossary/vector-embeddings">incorporations de</a> texte et d'image sont plus proches les unes des autres dans l'espace vectoriel. Cela dit, Gemini couvre cinq modalités alors que Qwen n'en couvre que trois, donc si vous avez besoin d'une intégration audio ou PDF, Gemini est la seule option.</p>
<p><strong>Q : Puis-je utiliser ces modèles d'intégration avec Milvus directement ?</strong></p>
<p>Oui. Tous ces modèles produisent des vecteurs flottants standard, que vous pouvez <a href="https://milvus.io/docs/insert-update-delete.md">insérer dans Milvus</a> et rechercher avec la <a href="https://zilliz.com/glossary/cosine-similarity">similarité cosinus</a>, la distance L2 ou le produit intérieur. <a href="https://milvus.io/docs/install-pymilvus.md">PyMilvus</a> fonctionne avec n'importe quel modèle d'intégration - générez vos vecteurs avec le SDK du modèle, puis stockez-les et recherchez-les dans Milvus. Pour les vecteurs tronqués par le MRL, il suffit de définir la dimension de la collection sur votre cible (par exemple, 256) lors de la <a href="https://milvus.io/docs/manage-collections.md">création de la collection</a>.</p>
