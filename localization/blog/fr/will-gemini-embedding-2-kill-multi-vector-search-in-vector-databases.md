---
id: will-gemini-embedding-2-kill-multi-vector-search-in-vector-databases.md
title: >-
  Le Gemini Embedding 2 va-t-il tuer la recherche multisectorielle dans les
  bases de données vectorielles ?
author: Jack Li
date: 2026-3-13
cover: assets.zilliz.com/blog_Gemini_Embedding2_4_62bc980b71.png
tag: Engineering
recommend: false
publishToMedium: true
tags: >-
  multi-vector search, gemini embedding 2, multimodal embeddings,  milvus,
  vector database
meta_keywords: >-
  multi-vector search, gemini embedding 2, multimodal embeddings,  milvus,
  vector database
meta_title: |
  Will Gemini Embedding 2 kill Multi-Vector Search in Vector Databases?
desc: >-
  Gemini Embedding 2 de Google permet d'intégrer du texte, des images, de la
  vidéo et de l'audio dans un seul vecteur. Cela rendra-t-il la recherche
  multi-vectorielle obsolète ? Non, et voici pourquoi.
origin: >-
  https://milvus.io/blog/will-gemini-embedding-2-kill-multi-vector-search-in-vector-databases.md
---
<p>Google a publié <a href="https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-embedding-2/">Gemini Embedding 2</a>, le premier modèle d'intégration multimodale qui met en correspondance du texte, des images, des vidéos, de l'audio et des documents dans un espace vectoriel unique.</p>
<p>Vous pouvez intégrer un clip vidéo, une photo de produit et un paragraphe de texte en un seul appel à l'API, et ils atterriront tous dans le même voisinage sémantique.</p>
<p>Avant d'utiliser des modèles de ce type, il fallait faire passer chaque modalité par son propre modèle spécialisé, puis stocker chaque résultat dans une colonne vectorielle distincte. Les colonnes multi-vectorielles des bases de données vectorielles telles que <a href="https://milvus.io/docs/multi-vector-search.md">Milvus</a> ont été conçues précisément pour de tels scénarios.</p>
<p>Avec Gemini Embedding 2 qui cartographie plusieurs modalités en même temps, une question se pose : dans quelle mesure Gemini Embedding 2 peut-il remplacer les colonnes multi-vectorielles, et où est-il insuffisant ? Cet article présente la place de chaque approche et la manière dont elles fonctionnent ensemble.</p>
<h2 id="What’s-Different-About-Gemini-Embedding-2-When-Compared-to-CLIPCLAP" class="common-anchor-header">Quelle est la différence entre Gemini Embedding 2 et CLIP/CLAP ?<button data-href="#What’s-Different-About-Gemini-Embedding-2-When-Compared-to-CLIPCLAP" class="anchor-icon" translate="no">
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
    </button></h2><p>Les modèles d'intégration convertissent les données non structurées en vecteurs denses afin que les éléments sémantiquement similaires soient regroupés dans l'espace vectoriel. Ce qui distingue Gemini Embedding 2, c'est qu'il le fait nativement à travers les modalités, sans modèles séparés et sans pipelines d'assemblage.</p>
<p>Jusqu'à présent, l'intégration multimodale nécessitait des modèles à double encodeur entraînés par apprentissage contrastif : <a href="https://openai.com/index/clip/">CLIP</a> pour l'image-texte, <a href="https://arxiv.org/abs/2211.06687">CLAP</a> pour l'audio-texte, chacun gérant exactement deux modalités. Si vous aviez besoin des trois, vous utilisiez plusieurs modèles et coordonniez vous-même leurs espaces d'intégration.</p>
<p>Par exemple, pour indexer un podcast avec sa couverture, il fallait utiliser CLIP pour l'image, CLAP pour l'audio et un encodeur de texte pour la transcription - trois modèles, trois espaces vectoriels et une logique de fusion personnalisée pour rendre leurs résultats comparables au moment de la requête.</p>
<p>En revanche, selon l'<a href="https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-embedding-2/">annonce officielle de Google</a>, voici ce que Gemini Embedding 2 prend en charge :</p>
<ul>
<li><strong>Texte</strong> jusqu'à 8 192 tokens par requête</li>
<li><strong>Images</strong> jusqu'à 6 par requête (PNG, JPEG)</li>
<li><strong>Vidéo</strong> jusqu'à 120 secondes (MP4, MOV)</li>
<li><strong>Audio</strong> jusqu'à 80 secondes, intégré nativement sans transcription ASR</li>
<li><strong>Documents</strong> PDF, jusqu'à 6 pages</li>
</ul>
<p>Image + texte<strong>mixés</strong> dans un seul appel d'incorporation</p>
<h3 id="Gemini-Embedding-2-vs-CLIPCLAP-One-Model-vs-Many-for-Multimodal-Embeddings" class="common-anchor-header">Gemini Embedding 2 vs. CLIP/CLAP Un modèle vs. plusieurs pour les embeddings multimodaux</h3><table>
<thead>
<tr><th></th><th><strong>Double encodeur (CLIP, CLAP)</strong></th><th><strong>Gemini Embedding 2</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Modalités par modèle</strong></td><td>2 (par exemple, image + texte)</td><td>5 (texte, image, vidéo, audio, PDF)</td></tr>
<tr><td><strong>Ajout d'une nouvelle modalité</strong></td><td>Vous apportez un autre modèle et alignez les espaces manuellement</td><td>Déjà inclus - un appel API</td></tr>
<tr><td><strong>Entrée multimodale</strong></td><td>Encodeurs distincts, appels distincts</td><td>Saisie entrelacée (par exemple, image + texte dans une seule demande)</td></tr>
<tr><td><strong>Architecture</strong></td><td>Codeurs de vision et de texte distincts alignés par perte contrastive</td><td>Modèle unique héritant de la compréhension multimodale de Gemini</td></tr>
</tbody>
</table>
<h2 id="Gemini-Embedding-2’s-Advantage-Pipeline-Simplification" class="common-anchor-header">Avantage de Gemini Embedding 2 : Simplification du pipeline<button data-href="#Gemini-Embedding-2’s-Advantage-Pipeline-Simplification" class="anchor-icon" translate="no">
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
    </button></h2><p>Prenons un scénario courant : la construction d'un moteur de recherche sémantique sur une courte vidéothèque. Chaque clip comporte des images visuelles, un son parlé et un texte de sous-titre, tous décrivant le même contenu.</p>
<p><strong>Avant Gemini Embedding 2</strong>, vous auriez eu besoin de trois modèles d'intégration distincts (image, audio, texte), de trois colonnes de vecteurs et d'un pipeline de recherche qui effectue un rappel multivoie, une fusion des résultats et une déduplication. Cela fait beaucoup de pièces mobiles à construire et à entretenir.</p>
<p><strong>Désormais,</strong> vous pouvez intégrer les images, le son et les sous-titres de la vidéo dans un seul appel API et obtenir un vecteur unifié qui capture l'ensemble de l'image sémantique.</p>
<p>Naturellement, il est tentant de conclure que les colonnes multi-vectorielles sont mortes. Mais cette conclusion confond "représentation multimodale unifiée" et "recherche vectorielle multidimensionnelle". Elles résolvent des problèmes différents, et il est important de comprendre cette différence pour choisir la bonne approche.</p>
<h2 id="What-is-Multi-Vector-Search-in-Milvus" class="common-anchor-header">Qu'est-ce que la recherche multivectorielle dans Milvus ?<button data-href="#What-is-Multi-Vector-Search-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans <a href="http://milvus.io">Milvus</a>, la recherche multi-vectorielle consiste à rechercher le même élément dans plusieurs champs vectoriels à la fois, puis à combiner ces résultats avec le reranking.</p>
<p>L'idée de base est qu'un même objet est souvent porteur de plusieurs types de significations. Un produit a un titre <em>et une</em> description. Une publication sur les médias sociaux comporte une légende <em>et une</em> image. Chaque angle vous dit quelque chose de différent, et chacun a donc son propre champ de vecteurs.</p>
<p>Milvus recherche chaque champ vectoriel indépendamment, puis fusionne les ensembles de candidats à l'aide d'un reranker. Dans l'API, chaque demande correspond à un champ et à une configuration de recherche différents, et hybrid_search() renvoie le résultat combiné.</p>
<p>Deux modèles courants dépendent de cette méthode :</p>
<ul>
<li><strong>La recherche vectorielle dense et éparse.</strong> Vous disposez d'un catalogue de produits dans lequel les utilisateurs saisissent des requêtes telles que "Nike Air Max rouge taille 10". Les vecteurs denses saisissent l'intention sémantique ("chaussures de course, rouge, Nike"), mais ne précisent pas la taille exacte. Les vecteurs peu denses via <a href="https://milvus.io/docs/full-text-search.md">BM25</a> ou des modèles tels que <a href="https://milvus.io/docs/full_text_search_with_milvus.md">BGE-M3</a> permettent de faire correspondre les mots-clés. Les deux doivent être exécutés en parallèle, puis reclassés, car aucun des deux ne donne à lui seul de bons résultats pour les requêtes qui mélangent le langage naturel et des identifiants spécifiques tels que les références, les noms de fichiers ou les codes d'erreur.</li>
<li><strong>Recherche vectorielle multimodale.</strong> Un utilisateur télécharge la photo d'une robe et tape "quelque chose comme ça mais en bleu". Vous recherchez simultanément la similarité visuelle dans la colonne d'intégration d'image et la contrainte de couleur dans la colonne d'intégration de texte. Chaque colonne possède son propre index et son propre modèle - <a href="https://openai.com/index/clip/">CLIP</a> pour l'image, un encodeur de texte pour la description - et les résultats sont fusionnés.</li>
</ul>
<p><a href="https://milvus.io/">Milvus</a> exécute les deux modèles en tant que <a href="https://milvus.io/docs/multi-vector-search.md">recherches ANN</a> parallèles avec un reclassement natif via RRFRanker. La définition du schéma, la configuration multi-index et la BM25 intégrée sont toutes gérées dans un seul système.</p>
<p>Prenons l'exemple d'un catalogue de produits dans lequel chaque article comprend une description textuelle et une image. Vous pouvez effectuer trois recherches en parallèle sur ces données :</p>
<ul>
<li><strong>Recherche de texte sémantique.</strong> Interroger la description textuelle avec des vecteurs denses générés par des modèles tels que <a href="https://zilliz.com/learn/explore-colbert-token-level-embedding-and-ranking-model-for-similarity-search?_gl=1*d243m9*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#A-Quick-Recap-of-BERT">BERT</a>, <a href="https://zilliz.com/learn/NLP-essentials-understanding-transformers-in-AI?_gl=1*d243m9*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.">Transformers</a> ou l'API d'intégration <a href="https://zilliz.com/learn/guide-to-using-openai-text-embedding-models">OpenAI</a>.</li>
<li><strong>Recherche en texte intégral.</strong> Interrogation de la description du texte avec des vecteurs peu denses à l'aide de <a href="https://zilliz.com/learn/mastering-bm25-a-deep-dive-into-the-algorithm-and-application-in-milvus">BM25</a> ou de modèles d'intégration peu denses tels que <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings?_gl=1*1cde1oq*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#BGE-M3">BGE-M3</a> ou <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings?_gl=1*ov2die*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#SPLADE">SPLADE</a>.</li>
<li><strong>Recherche d'images multimodales.</strong> Recherche sur des images de produits à l'aide d'une requête textuelle, avec des vecteurs denses provenant d'un modèle tel que <a href="https://zilliz.com/learn/exploring-openai-clip-the-future-of-multimodal-ai-learning">CLIP</a>.</li>
</ul>
<h2 id="With-Gemini-Embedding-2-Will-Multi-Vector-Search-Still-Matter" class="common-anchor-header">Avec Gemini Embedding 2, la recherche multi vectorielle est-elle encore pertinente ?<button data-href="#With-Gemini-Embedding-2-Will-Multi-Vector-Search-Still-Matter" class="anchor-icon" translate="no">
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
    </button></h2><p>Gemini Embedding 2 traite plus de modalités en un seul appel, ce qui simplifie considérablement les pipelines. Mais l'intégration multimodale unifiée n'est pas la même chose que la recherche multi-vectorielle. En d'autres termes, oui, la recherche multi-vectorielle reste importante.</p>
<p>Gemini Embedding 2 met en correspondance le texte, les images, la vidéo, l'audio et les documents dans un espace vectoriel partagé. Google <a href="https://developers.googleblog.com/en/gemini-embedding-model-now-available/">le positionne</a> pour la recherche sémantique multimodale, la recherche de documents et la recommandation - des scénarios où toutes les modalités décrivent le même contenu et où le chevauchement intermodal élevé rend un seul vecteur viable.</p>
<p>La recherche multi-vectorielle<a href="https://milvus.io/docs/multi-vector-search.md">Milvus</a> résout un problème différent. Il s'agit d'un moyen de rechercher le même objet par le biais de <strong>plusieurs champs vectoriels -</strong>par exemple, un titre et une description, ou un texte et une image - puis de combiner ces signaux lors de la recherche. En d'autres termes, il s'agit de préserver et d'interroger <strong>plusieurs vues sémantiques</strong> d'un même élément, et non pas de tout comprimer en une seule représentation.</p>
<p>Mais les données du monde réel s'intègrent rarement dans une seule représentation. Les systèmes biométriques, la recherche d'outils agentiques et le commerce électronique à intention mixte dépendent tous de vecteurs qui vivent dans des espaces sémantiques complètement différents. C'est précisément là qu'une intégration unifiée cesse de fonctionner.</p>
<h3 id="Why-One-Embedding-Isnt-Enough-Multi-Vector-Retrieval-in-Practice" class="common-anchor-header">Pourquoi une intégration n'est pas suffisante : La recherche multisectorielle en pratique</h3><p>Gemini Embedding 2 gère le cas où toutes vos modalités décrivent la même chose. La recherche multivectorielle s'occupe de tout le reste - et "tout le reste" couvre la plupart des systèmes de recherche de production.</p>
<p><strong>Biométrie.</strong> Un même utilisateur possède des vecteurs de visage, d'empreinte vocale, d'empreinte digitale et d'iris. Ces vecteurs décrivent des caractéristiques biologiques totalement indépendantes, sans aucun chevauchement sémantique. Il n'est pas possible de les regrouper en un seul vecteur - chacun a besoin de sa propre colonne, de son propre index et de sa propre métrique de similarité.</p>
<p><strong>Outils agentiques.</strong> Un assistant de codage comme OpenClaw stocke des vecteurs sémantiques denses pour l'historique des conversations ("ce problème de déploiement de la semaine dernière") ainsi que des vecteurs BM25 épars pour la correspondance exacte des noms de fichiers, des commandes CLI et des paramètres de configuration. Différents objectifs de recherche, différents types de vecteurs, chemins de recherche indépendants, puis reclassement.</p>
<p><strong>Commerce électronique avec intention mixte.</strong> La vidéo promotionnelle et les images détaillées d'un produit fonctionnent bien en tant qu'intégration Gemini unifiée. Mais lorsqu'un utilisateur veut des "robes qui ressemblent à ceci" <em>et</em> "même tissu, taille M", il faut une colonne de similarité visuelle et une colonne d'attributs structurés avec des index distincts et une couche de recherche hybride.</p>
<h2 id="When-to-Use-Gemini-Embedding-2-vs-Multi-vector-Columns" class="common-anchor-header">Quand utiliser Gemini Embedding 2 ou les colonnes multi-vectorielles ?<button data-href="#When-to-Use-Gemini-Embedding-2-vs-Multi-vector-Columns" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th><strong>Scénario</strong></th><th><strong>Que faut-il utiliser ?</strong></th><th><strong>Pourquoi ?</strong></th></tr>
</thead>
<tbody>
<tr><td>Toutes les modalités décrivent le même contenu (images vidéo + audio + sous-titres).</td><td>Gemini Embedding 2 vecteur unifié</td><td>Le chevauchement sémantique élevé signifie qu'un seul vecteur capture l'image complète - aucune fusion n'est nécessaire.</td></tr>
<tr><td>Vous avez besoin de la précision des mots-clés et du rappel sémantique (BM25 + dense)</td><td>Colonnes multi-vecteurs avec hybrid_search()</td><td>Les vecteurs épars et denses répondent à des objectifs de recherche différents qui ne peuvent pas être regroupés en un seul vecteur.</td></tr>
<tr><td>La recherche multimodale est le principal cas d'utilisation (requête textuelle → résultats d'images).</td><td>Intégration Gemini 2 vecteur unifié</td><td>Un seul espace partagé rend la similarité multimodale native</td></tr>
<tr><td>Les vecteurs vivent dans des espaces sémantiques fondamentalement différents (biométrie, attributs structurés).</td><td>Colonnes multi-vectorielles avec index par champ</td><td>Métriques de similarité et types d'index indépendants par champ vectoriel</td></tr>
<tr><td>Vous voulez la simplicité du pipeline <em>et une</em> recherche fine</td><td>Les deux - vecteur Gemini unifié + colonnes supplémentaires de données éparses ou d'attributs dans la même collection</td><td>Gemini gère la colonne multimodale ; Milvus gère la couche de recherche hybride qui l'entoure.</td></tr>
</tbody>
</table>
<p>Ces deux approches ne s'excluent pas mutuellement. Vous pouvez utiliser Gemini Embedding 2 pour la colonne multimodale unifiée et continuer à stocker des vecteurs sparse ou spécifiques à un attribut dans des colonnes distinctes au sein de la même collection <a href="https://milvus.io/">Milvus</a>.</p>
<h2 id="Quick-Start-Set-Up-Gemini-Embedding-2-+-Milvus" class="common-anchor-header">Démarrage rapide : Configuration de Gemini Embedding 2 + Milvus<button data-href="#Quick-Start-Set-Up-Gemini-Embedding-2-+-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Voici une démonstration fonctionnelle. Vous avez besoin d'une <a href="https://milvus.io/docs/install-overview.md">instance Milvus ou Zilliz Cloud</a> en cours d'exécution et d'une clé GOOGLE_API_KEY.</p>
<h3 id="Setup" class="common-anchor-header">Configuration</h3><pre><code translate="no">pip install google-genai pymilvus
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">GOOGLE_API_KEY</span>=<span class="hljs-string">&quot;your-api-key&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Full-Example" class="common-anchor-header">Exemple complet</h3><pre><code translate="no"><span class="hljs-string">&quot;&quot;&quot;
Prerequisites:
    pip install google-genai pymilvus

Set environment variable:
    export GOOGLE_API_KEY=&quot;your-api-key&quot;
&quot;&quot;&quot;</span>

<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> struct
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> google <span class="hljs-keyword">import</span> genai
<span class="hljs-keyword">from</span> google.genai <span class="hljs-keyword">import</span> types
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

<span class="hljs-comment"># ── Config ───────────────────────────────────────────────────────────────</span>
COLLECTION_NAME = <span class="hljs-string">&quot;gemini_multimodal_demo&quot;</span>
MILVUS_URI = <span class="hljs-string">&quot;http://localhost:19530&quot;</span>  <span class="hljs-comment"># Change to your Milvus address</span>
DIM = <span class="hljs-number">3072</span>  <span class="hljs-comment"># gemini-embedding-2-preview output dimension</span>
GEMINI_MODEL = <span class="hljs-string">&quot;gemini-embedding-2-preview&quot;</span>

<span class="hljs-comment"># ── Initialize clients ──────────────────────────────────────────────────</span>
gemini_client = genai.Client()  <span class="hljs-comment"># Uses GOOGLE_API_KEY env var</span>
milvus_client = MilvusClient(MILVUS_URI)

<span class="hljs-comment"># ── Helper: generate embedding ──────────────────────────────────────────</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_texts</span>(<span class="hljs-params">texts: <span class="hljs-built_in">list</span>[<span class="hljs-built_in">str</span>], task_type: <span class="hljs-built_in">str</span> = <span class="hljs-string">&quot;SEMANTIC_SIMILARITY&quot;</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]]:
    <span class="hljs-string">&quot;&quot;&quot;Embed a list of text strings.&quot;&quot;&quot;</span>
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=texts,
        config=types.EmbedContentConfig(task_type=task_type),
    )
    <span class="hljs-keyword">return</span> [e.values <span class="hljs-keyword">for</span> e <span class="hljs-keyword">in</span> result.embeddings]

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_image</span>(<span class="hljs-params">image_path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Embed an image file.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(image_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> f:
        image_bytes = f.read()
    mime = <span class="hljs-string">&quot;image/png&quot;</span> <span class="hljs-keyword">if</span> image_path.endswith(<span class="hljs-string">&quot;.png&quot;</span>) <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;image/jpeg&quot;</span>
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=types.Part.from_bytes(data=image_bytes, mime_type=mime),
    )
    <span class="hljs-keyword">return</span> result.embeddings[<span class="hljs-number">0</span>].values

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_audio</span>(<span class="hljs-params">audio_path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Embed an audio file.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(audio_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> f:
        audio_bytes = f.read()
    mime_map = {<span class="hljs-string">&quot;.mp3&quot;</span>: <span class="hljs-string">&quot;audio/mpeg&quot;</span>, <span class="hljs-string">&quot;.wav&quot;</span>: <span class="hljs-string">&quot;audio/wav&quot;</span>, <span class="hljs-string">&quot;.flac&quot;</span>: <span class="hljs-string">&quot;audio/flac&quot;</span>}
    ext = os.path.splitext(audio_path)[<span class="hljs-number">1</span>].lower()
    mime = mime_map.get(ext, <span class="hljs-string">&quot;audio/mpeg&quot;</span>)
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=types.Part.from_bytes(data=audio_bytes, mime_type=mime),
    )
    <span class="hljs-keyword">return</span> result.embeddings[<span class="hljs-number">0</span>].values

<span class="hljs-comment"># ── 1. Create Milvus collection ─────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=== Creating collection ===&quot;</span>)
<span class="hljs-keyword">if</span> milvus_client.has_collection(COLLECTION_NAME):
    milvus_client.drop_collection(COLLECTION_NAME)

schema = milvus_client.create_schema()
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;content&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>)   <span class="hljs-comment"># description of the content</span>
schema.add_field(<span class="hljs-string">&quot;modality&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">20</span>)    <span class="hljs-comment"># &quot;text&quot;, &quot;image&quot;, &quot;audio&quot;</span>
schema.add_field(<span class="hljs-string">&quot;vector&quot;</span>, DataType.FLOAT_VECTOR, dim=DIM)

index_params = milvus_client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
)

milvus_client.create_collection(
    COLLECTION_NAME,
    schema=schema,
    index_params=index_params,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created (dim=<span class="hljs-subst">{DIM}</span>, metric=COSINE)&quot;</span>)

<span class="hljs-comment"># ── 2. Insert text embeddings ───────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Inserting text embeddings ===&quot;</span>)
documents = [
    <span class="hljs-string">&quot;Artificial intelligence was founded as an academic discipline in 1956.&quot;</span>,
    <span class="hljs-string">&quot;The Mona Lisa is a half-length portrait painting by Leonardo da Vinci.&quot;</span>,
    <span class="hljs-string">&quot;Beethoven&#x27;s Symphony No. 9 premiered in Vienna on May 7, 1824.&quot;</span>,
    <span class="hljs-string">&quot;The Great Wall of China stretches over 13,000 miles across northern China.&quot;</span>,
    <span class="hljs-string">&quot;Jazz music originated in the African-American communities of New Orleans.&quot;</span>,
    <span class="hljs-string">&quot;The Hubble Space Telescope was launched into orbit on April 24, 1990.&quot;</span>,
    <span class="hljs-string">&quot;Vincent van Gogh painted The Starry Night while in an asylum in Saint-Rémy.&quot;</span>,
    <span class="hljs-string">&quot;Machine learning is a subset of AI focused on learning from data.&quot;</span>,
]

text_vectors = embed_texts(documents)
text_rows = [
    {<span class="hljs-string">&quot;content&quot;</span>: doc, <span class="hljs-string">&quot;modality&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>: vec}
    <span class="hljs-keyword">for</span> doc, vec <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(documents, text_vectors)
]
milvus_client.insert(COLLECTION_NAME, text_rows)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted <span class="hljs-subst">{<span class="hljs-built_in">len</span>(text_rows)}</span> text documents&quot;</span>)

<span class="hljs-comment"># ── 3. (Optional) Insert image embeddings ───────────────────────────────</span>
<span class="hljs-comment"># Uncomment and provide real image paths to test multimodal search</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># image_files = [</span>
<span class="hljs-comment">#     (&quot;photo of the Mona Lisa painting&quot;, &quot;mona_lisa.jpg&quot;),</span>
<span class="hljs-comment">#     (&quot;satellite photo of the Great Wall of China&quot;, &quot;great_wall.png&quot;),</span>
<span class="hljs-comment"># ]</span>
<span class="hljs-comment"># for desc, path in image_files:</span>
<span class="hljs-comment">#     if os.path.exists(path):</span>
<span class="hljs-comment">#         vec = embed_image(path)</span>
<span class="hljs-comment">#         milvus_client.insert(COLLECTION_NAME, [</span>
<span class="hljs-comment">#             {&quot;content&quot;: desc, &quot;modality&quot;: &quot;image&quot;, &quot;vector&quot;: vec}</span>
<span class="hljs-comment">#         ])</span>
<span class="hljs-comment">#         print(f&quot;Inserted image: {desc}&quot;)</span>

<span class="hljs-comment"># ── 4. (Optional) Insert audio embeddings ───────────────────────────────</span>
<span class="hljs-comment"># Uncomment and provide real audio paths to test multimodal search</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># audio_files = [</span>
<span class="hljs-comment">#     (&quot;Beethoven Symphony No.9 excerpt&quot;, &quot;beethoven_9.mp3&quot;),</span>
<span class="hljs-comment">#     (&quot;jazz piano improvisation&quot;, &quot;jazz_piano.mp3&quot;),</span>
<span class="hljs-comment"># ]</span>
<span class="hljs-comment"># for desc, path in audio_files:</span>
<span class="hljs-comment">#     if os.path.exists(path):</span>
<span class="hljs-comment">#         vec = embed_audio(path)</span>
<span class="hljs-comment">#         milvus_client.insert(COLLECTION_NAME, [</span>
<span class="hljs-comment">#             {&quot;content&quot;: desc, &quot;modality&quot;: &quot;audio&quot;, &quot;vector&quot;: vec}</span>
<span class="hljs-comment">#         ])</span>
<span class="hljs-comment">#         print(f&quot;Inserted audio: {desc}&quot;)</span>

<span class="hljs-comment"># ── 5. Search ────────────────────────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Searching ===&quot;</span>)

queries = [
    <span class="hljs-string">&quot;history of artificial intelligence&quot;</span>,
    <span class="hljs-string">&quot;famous Renaissance paintings&quot;</span>,
    <span class="hljs-string">&quot;classical music concerts&quot;</span>,
]

query_vectors = embed_texts(queries, task_type=<span class="hljs-string">&quot;SEMANTIC_SIMILARITY&quot;</span>)

<span class="hljs-keyword">for</span> query_text, query_vec <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(queries, query_vectors):
    results = milvus_client.search(
        COLLECTION_NAME,
        data=[query_vec],
        limit=<span class="hljs-number">3</span>,
        output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;modality&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    )
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nQuery: &#x27;<span class="hljs-subst">{query_text}</span>&#x27;&quot;</span>)
    <span class="hljs-keyword">for</span> hits <span class="hljs-keyword">in</span> results:
        <span class="hljs-keyword">for</span> rank, hit <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(hits, <span class="hljs-number">1</span>):
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  [<span class="hljs-subst">{rank}</span>] (score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, modality=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;modality&#x27;</span>]}</span>) &quot;</span>
                  <span class="hljs-string">f&quot;<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">80</span>]}</span>&quot;</span>)

<span class="hljs-comment"># ── 6. Cross-modal search example (image query -&gt; text results) ─────────</span>
<span class="hljs-comment"># Uncomment to search text collection using an image as query</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># print(&quot;\n=== Cross-modal search: image -&gt; text ===&quot;)</span>
<span class="hljs-comment"># query_image_vec = embed_image(&quot;query_image.jpg&quot;)</span>
<span class="hljs-comment"># results = milvus_client.search(</span>
<span class="hljs-comment">#     COLLECTION_NAME,</span>
<span class="hljs-comment">#     data=[query_image_vec],</span>
<span class="hljs-comment">#     limit=3,</span>
<span class="hljs-comment">#     output_fields=[&quot;content&quot;, &quot;modality&quot;],</span>
<span class="hljs-comment">#     search_params={&quot;metric_type&quot;: &quot;COSINE&quot;},</span>
<span class="hljs-comment"># )</span>
<span class="hljs-comment"># for hits in results:</span>
<span class="hljs-comment">#     for rank, hit in enumerate(hits, 1):</span>
<span class="hljs-comment">#         print(f&quot;  [{rank}] (score={hit[&#x27;distance&#x27;]:.4f}) {hit[&#x27;entity&#x27;][&#x27;content&#x27;][:80]}&quot;)</span>

<span class="hljs-comment"># ── Cleanup ──────────────────────────────────────────────────────────────</span>
<span class="hljs-comment"># milvus_client.drop_collection(COLLECTION_NAME)</span>
<span class="hljs-comment"># print(f&quot;\nCollection &#x27;{COLLECTION_NAME}&#x27; dropped&quot;)</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nDone!&quot;</span>)

<button class="copy-code-btn"></button></code></pre>
<p>Pour les embeddings d'images et d'audio, utilisez embed_image() et embed_audio() de la même manière - les vecteurs atterrissent dans la même collection et le même espace vectoriel, ce qui permet une véritable recherche cross-modale.</p>
<h2 id="Gemini-Embedding-2-Will-be-Available-in-MilvusZilliz-Cloud-Soon" class="common-anchor-header">Gemini Embedding 2 sera bientôt disponible dans Milvus/Zilliz Cloud<button data-href="#Gemini-Embedding-2-Will-be-Available-in-MilvusZilliz-Cloud-Soon" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a> propose une intégration approfondie avec Gemini Embedding 2 par le biais de sa fonction d'<a href="https://milvus.io/docs/embeddings.md">intégration</a>. Une fois en ligne, vous n'aurez plus besoin d'appeler manuellement les API d'intégration. Milvus invoquera automatiquement le modèle (prenant en charge OpenAI, AWS Bedrock, Google Vertex AI, etc.) pour vectoriser les données brutes sur l'insertion et les requêtes sur la recherche.</p>
<p>Cela signifie que vous bénéficiez de l'intégration multimodale unifiée de Gemini là où elle est adaptée, et de la boîte à outils multi-vecteurs complète de Milvus - recherche hybride dense-sparse, schémas multi-index, reranking - là où vous avez besoin d'un contrôle plus fin.</p>
<p>Vous souhaitez l'essayer ? Commencez par le <a href="https://milvus.io/docs/quickstart.md">quickstart Milvus</a> et exécutez la démo ci-dessus, ou consultez le <a href="https://milvus.io/docs/hybrid_search_with_milvus.md">guide de recherche hybride</a> pour une configuration multi-vecteur complète avec BGE-M3. Posez vos questions sur <a href="https://milvus.io/discord">Discord</a> ou lors <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour">des Milvus Office Hours</a>.</p>
<h2 id="Keep-Reading" class="common-anchor-header">Continuer à lire<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Présentation de la fonction d'intégration : Comment Milvus 2.6 rationalise la vectorisation et la recherche sémantique - Milvus Blog</a></li>
<li><a href="https://milvus.io/docs/multi-vector-search.md">Recherche hybride multisectorielle</a></li>
<li><a href="https://milvus.io/docs/embeddings.md">Docs de la fonction d'intégration de Milvus</a></li>
</ul>
