---
id: multimodal-semantic-search-with-images-and-text.md
title: Recherche sémantique multimodale avec des images et du texte
author: Stefan Webb
date: 2025-02-3
desc: >-
  Apprenez à construire une application de recherche sémantique utilisant l'IA
  multimodale qui comprend les relations texte-image, au-delà de la simple
  correspondance de mots-clés.
cover: >-
  assets.zilliz.com/Multimodal_Semantic_Search_with_Images_and_Text_1_3da9b83015.png
tag: Engineering
tags: 'Milvus, Vector Database, Open Source, Semantic Search, Multimodal AI'
recommend: true
canonicalUrl: 'https://milvus.io/blog/multimodal-semantic-search-with-images-and-text.md'
---
<iframe width="100%" height="315" src="https://www.youtube.com/embed/bxE0_QYX_sU?si=PkOHFcZto-rda1Fv" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>En tant qu'êtres humains, nous interprétons le monde à travers nos sens. Nous entendons des sons, nous voyons des images, des vidéos et des textes, souvent superposés. Nous comprenons le monde grâce à ces multiples modalités et à la relation qui existe entre elles. Pour que l'intelligence artificielle puisse réellement égaler ou dépasser les capacités humaines, elle doit développer cette même capacité à comprendre le monde à travers plusieurs lentilles simultanément.</p>
<p>Dans ce billet, dans la vidéo (ci-dessus) et dans le <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/multimodal_retrieval_amazon_reviews.ipynb">carnet de notes</a> qui l'accompagnent, nous présenterons les percées récentes dans les modèles capables de traiter à la fois le texte et les images. Nous le démontrerons en construisant une application de recherche sémantique qui va au-delà de la simple correspondance de mots clés - elle comprend la relation entre ce que les utilisateurs demandent et le contenu visuel qu'ils recherchent.</p>
<p>Ce qui rend ce projet particulièrement intéressant, c'est qu'il est entièrement construit avec des outils open-source : la base de données vectorielles Milvus, les bibliothèques d'apprentissage automatique de HuggingFace et un ensemble de données d'avis de clients d'Amazon. Il est remarquable de penser qu'il y a à peine dix ans, la construction d'un tel projet aurait nécessité d'importantes ressources propriétaires. Aujourd'hui, ces puissants composants sont disponibles gratuitement et peuvent être combinés de manière innovante par toute personne ayant la curiosité d'expérimenter.</p>
<custom-h1>Vue d'ensemble</custom-h1><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/overview_97a124bc9a.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Notre application de recherche multimodale est du type <em>"récupération et classement".</em> Si vous êtes familier avec la méthode RAG ( <em>retrieval-augmented-generation</em> ), elle est très similaire, à ceci près que le résultat final est une liste d'images qui ont été reclassées par un grand modèle de vision linguistique (LLVM). La requête de l'utilisateur contient à la fois du texte et une image, et la cible est un ensemble d'images indexées dans une base de données vectorielle. L'architecture comporte trois étapes - l'<em>indexation</em>, la <em>récupération</em> et le <em>reclassement</em> (proche de la "génération") - que nous résumons à tour de rôle.</p>
<h2 id="Indexing" class="common-anchor-header">Indexation<button data-href="#Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>Notre application de recherche doit avoir quelque chose à rechercher. Dans notre cas, nous utilisons un petit sous-ensemble de l'ensemble de données "Amazon Reviews 2023", qui contient à la fois du texte et des images provenant d'avis de clients d'Amazon sur tous les types de produits. Vous pouvez imaginer qu'une recherche sémantique comme celle que nous sommes en train de construire puisse être un complément utile à un site web de commerce électronique. Nous utilisons 900 images et écartons le texte, tout en observant que ce bloc-notes peut atteindre la taille de production avec la bonne base de données et les déploiements d'inférence.</p>
<p>Le premier élément "magique" de notre pipeline est le choix du modèle d'intégration. Nous utilisons un modèle multimodal récemment développé appelé <a href="https://huggingface.co/BAAI/bge-visualized">Visualized BGE</a> qui est capable d'intégrer du texte et des images conjointement, ou séparément, dans le même espace avec un modèle unique où les points qui sont proches sont sémantiquement similaires. D'autres modèles de ce type ont été développés récemment, par exemple <a href="https://github.com/google-deepmind/magiclens">MagicLens</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/indexing_1937241be5.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La figure ci-dessus illustre le fait que l'intégration de [l'image d'un lion de profil] avec le texte "vue de face" est proche de l'intégration de [l'image d'un lion de face] sans texte. Le même modèle est utilisé à la fois pour les entrées texte et image et pour les entrées image seule (ainsi que pour les entrées texte seul). <em>De cette manière, le modèle est en mesure de comprendre l'intention de l'utilisateur en ce qui concerne la relation entre le texte de la requête et l'image de la requête.</em></p>
<p>Nous intégrons nos 900 images de produits sans le texte correspondant et nous stockons les intégrations dans une base de données vectorielle à l'aide de <a href="https://milvus.io/docs">Milvus</a>.</p>
<h2 id="Retrieval" class="common-anchor-header">Récupération<button data-href="#Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>Maintenant que notre base de données est construite, nous pouvons répondre à la requête d'un utilisateur. Imaginons qu'un utilisateur vienne avec la requête suivante : "un étui de téléphone avec ceci" et "un étui de téléphone avec cela" : "un étui de téléphone avec ceci" plus [une image d'un léopard]. En d'autres termes, il recherche des étuis de téléphone avec des motifs de léopard.</p>
<p>Notez que le texte de la requête de l'utilisateur dit "ceci" plutôt que "une peau de léopard". Notre modèle d'intégration doit être capable de relier "ceci" à ce à quoi il fait référence, ce qui est un exploit impressionnant étant donné que les itérations précédentes de modèles n'étaient pas en mesure de traiter des instructions aussi ouvertes. L'<a href="https://arxiv.org/abs/2403.19651">article sur MagicLens</a> donne d'autres exemples.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Retrieval_ad64f48e49.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nous intégrons conjointement le texte et l'image de la requête et effectuons une recherche de similarité dans notre base de données vectorielle, en renvoyant les neuf premiers résultats. Les résultats sont présentés dans la figure ci-dessus, avec l'image du léopard. Il apparaît que le premier résultat n'est pas le plus pertinent par rapport à la requête. Le septième résultat semble être le plus pertinent - il s'agit d'une housse de téléphone avec une impression de peau de léopard.</p>
<h2 id="Generation" class="common-anchor-header">Génération<button data-href="#Generation" class="anchor-icon" translate="no">
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
    </button></h2><p>Il semble que notre recherche ait échoué car le premier résultat n'est pas le plus pertinent. Nous pouvons toutefois y remédier en procédant à un reclassement. Vous savez peut-être que le reranking des éléments récupérés est une étape importante dans de nombreux pipelines RAG. Nous utilisons <a href="https://huggingface.co/microsoft/Phi-3-vision-128k-instruct">Phi-3 Vision</a> comme modèle de reclassement.</p>
<p>Nous demandons d'abord à un LLVM de générer une légende pour l'image de la requête. Le LLVM produit un résultat :</p>
<p><em>"L'image montre un gros plan du visage d'un léopard avec un accent sur sa fourrure tachetée et ses yeux verts".</em></p>
<p>Nous introduisons ensuite cette légende, une image unique avec les neuf résultats et l'image de la requête, et nous construisons une invite textuelle demandant au modèle de reclasser les résultats, en donnant la réponse sous forme de liste et en fournissant une raison pour le choix de la meilleure correspondance.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Generation_b016a6c26a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Le résultat est illustré dans la figure ci-dessus - l'élément le plus pertinent est maintenant le premier résultat - et la raison donnée est la suivante :</p>
<p><em>"L'élément le plus approprié est celui qui a pour thème le léopard, ce qui correspond à l'instruction de l'utilisateur qui demande un étui de téléphone avec un thème similaire."</em></p>
<p>Notre reclasseur LLVM a été en mesure de comprendre les images et le texte et d'améliorer la pertinence des résultats de la recherche. <em>Un artefact intéressant est que le reclassement n'a donné que huit résultats et en a abandonné un, ce qui souligne le besoin de garde-fous et de résultats structurés.</em></p>
<h2 id="Summary" class="common-anchor-header">Résumé<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans ce billet, ainsi que dans la <a href="https://www.youtube.com/watch?v=bxE0_QYX_sU">vidéo</a> et le <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/multimodal_retrieval_amazon_reviews.ipynb">carnet de notes</a> qui l'accompagnent, nous avons construit une application pour la recherche sémantique multimodale dans le texte et les images. Le modèle d'intégration a été capable d'intégrer du texte et des images conjointement ou séparément dans le même espace, et le modèle de base a été capable de saisir du texte et des images tout en générant du texte en réponse. <em>Il est important de noter que le modèle d'intégration a été capable de relier l'intention de l'utilisateur d'une instruction ouverte à l'image de la requête et de spécifier ainsi comment l'utilisateur voulait que les résultats soient liés à l'image d'entrée.</em></p>
<p>Ce n'est qu'un avant-goût de ce qui nous attend dans un avenir proche. Nous verrons de nombreuses applications de recherche multimodale, de compréhension et de raisonnement multimodaux, etc. dans diverses modalités : image, vidéo, audio, molécules, réseaux sociaux, données tabulaires, séries temporelles, le potentiel est illimité.</p>
<p>Au cœur de ces systèmes se trouve une base de données vectorielle qui constitue la "mémoire" externe du système. Milvus est un excellent choix à cette fin. Il s'agit d'un logiciel libre, doté de nombreuses fonctionnalités (voir <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">cet article sur la recherche plein texte dans Milvus 2.5</a>) et qui s'adapte efficacement à des milliards de vecteurs avec un trafic à l'échelle du web et une latence inférieure à 100 ms. Pour en savoir plus, consultez la <a href="https://milvus.io/docs">documentation de Milvus</a>, rejoignez notre communauté <a href="https://milvus.io/discord">Discord</a>, et j'espère vous voir à notre prochain <a href="https://lu.ma/unstructured-data-meetup">meetingup sur les données non structurées</a>. D'ici là !</p>
<h2 id="Resources" class="common-anchor-header">Ressources<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p>Carnet de notes : " <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/multimodal_retrieval_amazon_reviews.ipynb">Recherche multimodale avec Amazon Reviews et LLVM Reranking</a>"</p></li>
<li><p><a href="https://www.youtube.com/watch?v=bxE0_QYX_sU">Vidéo Youtube AWS Developers</a></p></li>
<li><p><a href="https://milvus.io/docs">Documentation Milvus</a></p></li>
<li><p><a href="https://lu.ma/unstructured-data-meetup">Réunion sur les données non structurées</a></p></li>
<li><p>Modèle d'intégration : <a href="https://huggingface.co/BAAI/bge-visualized">Carte modèle BGE visualisée</a></p></li>
<li><p>Modèle d'intégration alt : <a href="https://github.com/google-deepmind/magiclens">Repo du modèle MagicLens</a></p></li>
<li><p>LLVM : <a href="https://huggingface.co/microsoft/Phi-3-vision-128k-instruct">Carte modèle Phi-3 Vision</a></p></li>
<li><p>Article : "<a href="https://arxiv.org/abs/2403.19651">MagicLens : Self-Supervised Image Retrieval with Open-Ended Instructions (Récupération d'images auto-supervisée avec des instructions ouvertes</a>)</p></li>
<li><p>Jeu de données : <a href="https://amazon-reviews-2023.github.io/">Amazon Reviews 2023</a></p></li>
</ul>
