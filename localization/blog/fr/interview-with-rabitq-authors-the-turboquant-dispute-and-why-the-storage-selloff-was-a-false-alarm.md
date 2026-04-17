---
id: >-
  interview-with-rabitq-authors-the-turboquant-dispute-and-why-the-storage-selloff-was-a-false-alarm.md
title: >-
  Entretien avec les auteurs de RaBitQ : Le litige TurboQuant et les raisons
  pour lesquelles la chute du stockage était une fausse alerte
author: 'Cheng Long, Jianyang Gao, Li Liu'
date: 2026-4-17
cover: assets.zilliz.com/0415_updated_rabitq_interviewdocx_md_1_d5709718fc.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'RaBitQ, TurboQuant, vector quantization, Milvus, IVF_RABITQ'
meta_title: |
  RaBitQ Authors on the TurboQuant Vector Quantization Dispute
desc: >-
  Les auteurs de RaBitQ répondent à l'article TurboQuant de Google : le
  déséquilibre du benchmark, la théorie mal attribuée, et pourquoi la chute du
  stockage était une fausse alerte.
origin: >-
  https://milvus.io/blog/interview-with-rabitq-authors-the-turboquant-dispute-and-why-the-storage-selloff-was-a-false-alarm.md
---
<p>Le document <a href="https://research.google/blog/turboquant-redefining-ai-efficiency-with-extreme-compression/">TurboQuant</a> de Google revendique une <strong>compression de 6 fois, une accélération de 8 fois et une perte de précision proche de zéro</strong> pour les représentations vectorielles. Après sa publication, les stocks de mémoire et de stockage ont fortement chuté, et les principaux médias technologiques en ont rapidement fait leurs gros titres.</p>
<p>La réaction du marché n'était qu'un début. Les chercheurs ont rapidement commencé à se demander si les affirmations de l'article étaient exagérées et s'il traitait équitablement les travaux antérieurs, en particulier <a href="https://dl.acm.org/doi/10.1145/3654970">RaBitQ</a>. Le différend a remis la <strong>quantification vectorielle</strong> sous les feux de la rampe, en partie parce que les mêmes idées sous-jacentes sont aujourd'hui utilisées dans deux domaines essentiels de l'intelligence artificielle : les <a href="https://zilliz.com/learn/vector-similarity-search">systèmes de recherche vectorielle</a> et la compression KV-cache pour les modèles de grande taille.</p>
<p>Pour comprendre à la fois le débat technique et ce qu'il signifie pour les systèmes de production, nous nous sommes entretenus avec <strong>Cheng Long</strong>, professeur associé à la NTU de Singapour et responsable de VectorDB@NTU, <strong>Jianyang Gao</strong>, premier auteur de RaBitQ, et <strong>Li Liu</strong>, directeur de l'ingénierie chez Zilliz. La conversation a porté sur la quantification vectorielle elle-même, sur les questions soulevées par TurboQuant et sur l'importance de cette quantification pour des systèmes tels que <a href="https://milvus.io/">Milvus</a>, les <a href="https://zilliz.com/learn/what-is-vector-database">bases de données vectorielles</a> open-source les plus populaires, et pour la recherche vectorielle à grande échelle.</p>
<p><strong><em>À lire aussi :</em></strong> <em>Si vous préférez l'aspect technique à l'interview, consultez notre article complémentaire sur l</em> <a href="https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md"><em>'impact de la quantification vectorielle sur les coûts de l'infrastructure de l'IA</em></a><em>.</em></p>
<h2 id="Why-did-vector-quantization-suddenly-become-such-a-big-topic" class="common-anchor-header">Pourquoi la quantification vectorielle est-elle soudainement devenue un sujet aussi important ?<button data-href="#Why-did-vector-quantization-suddenly-become-such-a-big-topic" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz : Avant d'entrer dans la controverse, pourriez-vous commencer par expliquer ce qu'est la quantification vectorielle et pourquoi elle est devenue si importante dans l'IA ?</strong></p>
<p><strong>Cheng Long :</strong> La quantification vectorielle est une technique de <strong>compression de données</strong> et de <strong>représentation approximative</strong>. Elle provient à l'origine du traitement des signaux, où elle était utilisée pour la compression des images et du son. Dans les systèmes d'IA modernes, son rôle a changé car les vecteurs sont devenus l'une des unités de base du calcul.</p>
<p>Aujourd'hui, son importance apparaît clairement dans deux domaines.</p>
<p>Le premier est la <strong>recherche en temps réel dans des collections contenant des milliards, voire des dizaines de milliards de vecteurs</strong>. Dans les systèmes de recherche sémantique, la tâche principale est la recherche de similarités sur des vecteurs à haute dimension. Mais les vecteurs bruts sont volumineux et les calculs en virgule flottante sont coûteux. À grande échelle, il est donc difficile d'obtenir une latence de l'ordre de la milliseconde. La quantification vectorielle permet de compresser les vecteurs en représentations à faible nombre de bits et d'accélérer le calcul de la distance. C'est pourquoi elle est importante pour les charges de travail pratiques telles que la <a href="https://milvus.io/docs/single-vector-search.md">recherche sur un seul vecteur</a>, la <a href="https://milvus.io/docs/multi-vector-search.md">recherche sur plusieurs vecteurs</a> et la conception d'index dans l'<a href="https://milvus.io/docs/index-explained.md">architecture de recherche Milvus</a>.</p>
<p>La seconde est la <strong>compression du cache KV</strong> pour les grands modèles. Le cache KV réduit les calculs redondants pendant la génération, mais le coût de la mémoire augmente rapidement à mesure que le contexte s'allonge. Le problème est donc de savoir comment compresser ces vecteurs sans trop nuire à la qualité du résultat. Au fond, il s'agit également d'un problème de quantification vectorielle.</p>
<p><strong>Zilliz : Si l'utilisation de la quantification vectorielle se généralise - et si les résultats de TurboQuant se confirment - cela signifie-t-il que la demande de stockage diminue fortement ?</strong></p>
<p><strong>Jianyang Gao :</strong> Avec le même modèle et la même charge de travail, la compression peut réduire la demande de stockage. Mais cela ne justifie pas la conclusion générale à laquelle les gens ont abouti.</p>
<p>Lorsque TurboQuant parle d'une <strong>compression 6x</strong> et d'une <strong>accélération 8x</strong>, il se réfère à une <strong>base de référence 16 bits/32 bits</strong>. Ce n'est pas la même chose que la comparaison avec d'autres méthodes de la même catégorie. L'effet réel doit donc encore être évalué avec plus de soin.</p>
<p><strong>Zilliz : De ce point de vue, si la réaction du marché concernait réellement la technologie elle-même, aurait-elle dû se produire beaucoup plus tôt, lorsque des idées similaires étaient déjà apparues ?</strong></p>
<p><strong>Cheng Long :</strong> D'un point de vue technique, on peut dire qu'un territoire théorique similaire a déjà été atteint auparavant. Mais les marchés n'évoluent pas au même rythme que la recherche. Il y a généralement un décalage entre les résultats universitaires, l'adoption par les ingénieurs et l'interprétation financière.</p>
<p>Et à plus long terme, l'effet peut même ne pas être linéaire. La compression peut permettre de faire fonctionner de grands modèles sur des appareils plus petits, ce qui peut créer une nouvelle demande plutôt que de simplement la réduire. La relation entre la technologie et les marchés est plus complexe qu'une extrapolation linéaire.</p>
<h2 id="How-did-RaBitQ-emerge-and-what-did-it-contribute" class="common-anchor-header">Comment le RaBitQ a-t-il vu le jour et quelle a été sa contribution ?<button data-href="#How-did-RaBitQ-emerge-and-what-did-it-contribute" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz : Comment avez-vous eu l'idée de RaBitQ ?</strong></p>
<p><strong>Jianyang Gao :</strong> Nous sommes partis d'une lacune que nous avions constatée dans les bases de données vectorielles. Les méthodes traditionnelles, telles que la <a href="https://milvus.io/docs/ivf-pq.md">quantification par produit,</a> fonctionnaient bien d'un point de vue empirique, mais elles offraient très peu de garanties théoriques.</p>
<p>À l'époque, j'étudiais les probabilités en haute dimension à la NTU de Singapour, ce qui m'a amené à me demander si nous pouvions élaborer une méthode qui soit non seulement pratique, mais aussi assortie d'une garantie théorique claire. Ce fut le point de départ de RaBitQ.</p>
<p><strong>Zilliz : Quelle est, selon vous, la principale originalité de RaBitQ ?</strong></p>
<p><strong>Jianyang Gao :</strong> Son idée maîtresse est d'utiliser une rotation aléatoire, c'est-à-dire la transformation de Johnson-Lindenstrauss, pour rendre la distribution des coordonnées vectorielles plus uniforme et plus prévisible.</p>
<p>Une fois que vous avez obtenu cela, vous pouvez dériver un estimateur de quantification optimal. Nous avons ensuite donné une preuve stricte qu'il atteint la limite inférieure théorique.</p>
<p>Des travaux antérieurs avaient également tenté d'introduire une rotation aléatoire. Mais de notre point de vue, ces méthodes n'ont pas eu l'effet escompté en raison de problèmes pratiques liés à la conception des algorithmes.</p>
<p><strong>Zilliz : D'un point de vue technique, qu'est-ce qui vous a le plus frappé dans RaBitQ ?</strong></p>
<p><strong>Li Liu :</strong> Nous avons travaillé avec de nombreux algorithmes de quantification, depuis les <a href="https://milvus.io/docs/ivf-sq8.md">méthodes de quantification scalaire</a> jusqu'à PQ et d'autres variantes. Ce qui a marqué RaBitQ, c'est qu'il a changé la façon d'aborder le problème.</p>
<p>Avant cela, une grande partie du domaine était encore assez empirique. On pouvait dire qu'une méthode semblait fonctionner, mais il était plus difficile d'expliquer clairement pourquoi. RaBitQ a abordé le problème d'une manière beaucoup plus mathématique. La méthode semblait élégante et, en un sens, simple. Cette façon de penser a influencé de nombreux travaux ultérieurs.</p>
<p><strong>Zilliz : En termes simples, quel est le gain de mémoire et le coût de l'application ?</strong></p>
<p><strong>Li Liu :</strong> Au même niveau de rappel, le passage d'une compression de 4 bits à une compression de 2 bits réduit de moitié l'utilisation de la mémoire.</p>
<p>Et ce n'est pas qu'une question de compression. Ses performances se comparent favorablement à celles des approches précédentes, ce qui est important dans les environnements de production où les équipes se soucient à la fois de l'efficacité de la mémoire et de la qualité de l'extraction. C'est pourquoi il est important pour les systèmes qui doivent trouver un équilibre entre le <a href="https://milvus.io/docs/dense-vector.md">stockage vectoriel dense</a>, le débit et le rappel.</p>
<p><strong>Zilliz : Au-delà de Milvus, où pensez-vous que RaBitQ soit utilisé aujourd'hui ?</strong></p>
<p><strong>Cheng Long :</strong> Tout d'abord, je tiens à remercier l'équipe de Milvus, car elle a été parmi les premières à adopter RaBitQ. Nous avons également eu beaucoup de discussions et de recherches collaboratives en cours de route.</p>
<p>RaBitQ a également été adopté dans d'autres systèmes, notamment FAISS de Meta, VSAG, VectorChord, Volcengine OpenSearch, CockroachDB, ElasticSearch, Lucene et turbopuffer. Ce qui est remarquable du côté de Milvus, c'est que l'équipe a livré <a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQ</a> en tant qu'option d'indexation réelle dans <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a>, parallèlement à un travail plus large sur la <a href="https://milvus.io/docs/manage-collections.md">gestion des collections</a>, l'<a href="https://milvus.io/docs/ivf-flat.md">indexation basée sur IVF</a> et l'<a href="https://milvus.io/docs/hnsw.md">indexation basée sur HNSW</a>.</p>
<h2 id="How-should-we-evaluate-TurboQuant" class="common-anchor-header">Comment devrions-nous évaluer TurboQuant ?<button data-href="#How-should-we-evaluate-TurboQuant" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz : Dans votre réponse publique, vous avez dit que TurboQuant avait de sérieux problèmes. Quels sont, selon vous, les principaux ?</strong></p>
<p><strong>Jianyang Gao :</strong> Nous voyons trois problèmes principaux.</p>
<p>Le premier est la manière dont le document décrit les travaux antérieurs et discute des chevauchements. Le document TurboQuant présente mal la méthodologie de RaBitQ, en ignorant les éléments les plus similaires, comme la transformation de Johnson-Lindenstrauss. Un autre problème est la façon dont l'article caractérise le résultat théorique. Il décrit RaBitQ comme sous-optimal sans fournir d'explication ou de preuve, alors que RaBitQ est en fait optimal. Le troisième est l'équité de la comparaison expérimentale. Ils utilisent un processeur à cœur unique pour évaluer RaBitQ, tandis qu'ils utilisent un GPU A100 pour évaluer TurboQuant.</p>
<p><strong>Zilliz : Prenons d'abord la question du benchmark. Pourquoi pensez-vous que la comparaison n'était pas équitable ?</strong></p>
<p><strong>Jianyang Gao :</strong> Les tests de performance n'ont de sens que si la configuration est comparable. Si un système est testé dans un environnement matériel ou logiciel très différent, le résultat peut refléter la configuration plus que l'algorithme lui-même.</p>
<p>Selon nous, les différences dans le choix du processeur, le langage de mise en œuvre et le niveau d'optimisation peuvent faire une grande différence. C'est pourquoi la méthodologie des tests de référence doit être interprétée avec beaucoup de prudence, en particulier par les équipes chargées de mettre au point des systèmes de recherche de production.</p>
<p><strong>Cheng Long :</strong> L'article contient également d'autres affirmations qui ne tiennent pas la route.</p>
<p>Par exemple, il affirme que <strong>RaBitQ ne peut pas être vectorisé</strong>. Mais RaBitQ avait déjà mis à disposition un code ouvert avec un calcul vectoriel basé sur SIMD lorsque l'article 2024 a été publié. De notre point de vue, cette affirmation était donc factuellement incorrecte.</p>
<p>Il convient également de mentionner que nous avons commencé à travailler avec NVIDIA l'année dernière et que nous avons terminé l'implémentation de RaBitQ sur le GPU. Le code correspondant est en cours d'examen en vue de son inclusion dans la bibliothèque cuVS de NVIDIA.</p>
<p><strong>Zilliz : Milvus a évalué TurboQuant au cours du second semestre 2025, mais ne l'a pas adopté. Qu'a constaté votre équipe lors des tests ?</strong></p>
<p><strong>Li Liu :</strong> Il contient une idée utile. À notre avis, elle optimise légèrement la manière dont la grille de quantification est allouée. Mais l'étape la plus importante de la méthode - l'utilisation de la rotation aléatoire pour la quantification - a été introduite pour la première fois par RaBitQ.</p>
<p>En ce qui concerne l'estimation sans biais, l'approche de RaBitQ est plus propre et sa dérivation théorique est plus solide.</p>
<p>Cela dit, comme il s'agit d'un résultat de Google, nous l'avons testé en 2025. Dans notre laboratoire, dans un environnement CPU standardisé, TurboQuant n'a pas été plus performant que notre version interne RaBitQ dans la plupart des cas que nous avons évalués. C'est pourquoi nous avons été réellement surpris de la réaction très vive du marché.</p>
<p><strong>Zilliz : Pour les lecteurs qui n'ont pas étudié de près les deux documents, pourriez-vous expliquer en termes simples les points de recoupement entre RaBitQ et TurboQuant ?</strong></p>
<p><strong>Li Liu :</strong> À un niveau élevé, les deux méthodes commencent par une <strong>rotation aléatoire</strong>. Mathématiquement, cela signifie multiplier le vecteur par une matrice orthogonale aléatoire. C'est comme si vous changiez votre angle de vue dans un espace à haute dimension. Cela ne modifie pas la position relative des points de données, mais cela permet de répartir les informations de manière plus homogène entre les différentes dimensions.</p>
<p>Vient ensuite la <strong>quantification</strong>. Vous divisez l'espace continu à valeurs réelles en <strong>2^k cellules de grille</strong>, où <strong>k</strong> est le nombre de bits de quantification, puis vous mappez chaque élément vectoriel à un point de grille proche. TurboQuant procède à un petit ajustement en allouant la grille en fonction de la distribution des données au lieu de la distribuer uniformément.</p>
<p>La dernière étape est l'<strong>estimation de l'erreur</strong>, et c'est là que réside la principale contribution de RaBitQ. Les méthodes traditionnelles calculent directement à partir des valeurs quantifiées, ce qui rend l'erreur plus difficile à contrôler. RaBitQ estime plus précisément l'erreur de quantification, d'où son optimalité mathématique. La solution de TurboQuant est plus compliquée et, dans notre contexte, le compromis n'a pas semblé aussi intéressant.</p>
<h2 id="Why-is-attribution-so-hard-to-resolve-in-practice" class="common-anchor-header">Pourquoi l'attribution est-elle si difficile à résoudre dans la pratique ?<button data-href="#Why-is-attribution-so-hard-to-resolve-in-practice" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz :</strong> Après la publication de votre déclaration publique, comment Google et l'ICLR ont-ils réagi ?</p>
<p><strong>Cheng Long :</strong> L'ICLR n'a pas pris de mesures. Nous leur avons envoyé un courrier électronique pendant la période d'examen en septembre de l'année dernière, mais nous n'avons pas reçu de réponse. Nous avons écrit à nouveau en mars de cette année et on nous a dit de poster des commentaires sur OpenReview, mais il n'y a pas eu d'autre action.</p>
<p>Quant à Google, l'un des coauteurs a répondu il y a quelques jours. Il a indiqué qu'il réviserait la version arXiv pour corriger sa description inexacte de l'optimalité de RaBitQ.</p>
<p><strong>Zilliz :</strong> Tout à l'heure, la discussion portait sur la faute académique. Aujourd'hui, il s'agit également d'une question de déséquilibre et de savoir qui a le droit de façonner l'histoire. Pourquoi est-il si difficile de défendre son travail ?</p>
<p><strong>Cheng Long :</strong> L'un des problèmes est l'échelle. Les conférences sur l'IA sont aujourd'hui si importantes qu'un seul cycle peut rassembler des dizaines de milliers d'articles. Les organisateurs n'ont tout simplement pas la capacité de gérer tous les litiges de ce type.</p>
<p>L'autre problème est le déséquilibre. Les grandes entreprises ont une voix publique beaucoup plus forte. Les chercheurs indépendants ou les petites équipes n'ont pas le même pouvoir de communication.</p>
<p><strong>Jianyang Gao :</strong> Pour les individus, le coût est extrêmement élevé. Le professeur Long et moi-même avons à peine pu travailler normalement ces dernières semaines.</p>
<p>La procédure elle-même a également été frustrante. Nous avons essuyé un refus catégorique lorsque nous avons contacté les auteurs, et nous n'avons reçu aucune réponse de la part des organisateurs de la conférence. Dans la pratique, de nombreux chercheurs envisagent des situations de ce type et décident de les laisser tomber. Mais c'est aussi de cette manière que de nombreuses contributions originales disparaissent de la scène publique.</p>
<p><strong>Zilliz :</strong> Il semble que ce ne soit pas la première fois que votre équipe est confrontée à ce genre de problème.</p>
<p><strong>Cheng Long :</strong> Non, ce n'est pas le cas.</p>
<p>Nous avons déjà vu des cas où des entreprises prenaient RaBitQ, y apportaient quelques modifications techniques, lui donnaient un nouveau nom, puis le décrivaient uniquement comme quelque chose d'inspiré par RaBitQ.</p>
<p>C'est pourquoi j'apprécie la façon dont certaines équipes industrielles gèrent ce problème, y compris Milvus. Lorsqu'elles utilisent RaBitQ, elles le décrivent objectivement. Et lorsqu'ils ajoutent des optimisations par rapport à la version originale, ils expliquent clairement qu'il s'agit de leur propre contribution technique. Cela permet de reconnaître le travail original tout en montrant la force technique de l'entreprise.</p>
<p><strong>Zilliz :</strong> Lorsque de grandes entreprises s'appuient sur des travaux universitaires, prévoient-elles généralement un partage financier ou une répartition des bénéfices ?</p>
<p><strong>Jianyang Gao :</strong> Dans la plupart des cas, non.</p>
<p>Cela dit, les grandes entreprises sont toujours fortement incitées à présenter une avancée technique comme quelque chose qu'elles ont créé elles-mêmes plutôt que comme quelque chose qu'elles ont adopté d'autres. Tout le monde veut que les clients et les investisseurs considèrent les travaux les plus avancés comme le résultat de l'innovation de leur propre équipe.</p>
<h2 id="What-comes-next-for-vector-quantization" class="common-anchor-header">Quelle est la prochaine étape pour la quantification vectorielle ?<button data-href="#What-comes-next-for-vector-quantization" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz :</strong> Quels sont les axes de recherche sur lesquels vous travaillez actuellement ?</p>
<p><strong>Cheng Long :</strong> Une grande partie de notre travail restera axée sur la recherche de vecteurs.</p>
<p>L'une d'entre elles consiste à combiner RaBitQ avec différents index de recherche vectorielle, tels que IVF et HNSW, afin que le système puisse prendre en charge des données à plus grande échelle avec une latence plus faible, une simultanéité plus élevée et un coût plus bas. Je m'intéresse également à la compression du cache KV.</p>
<p><strong>Jianyang Gao :</strong> Le cache KV dans les grands modèles et la recherche vectorielle partagent de nombreuses propriétés, tant sur le plan mathématique qu'au niveau des systèmes, parce qu'ils traitent tous deux de vecteurs à haute dimension.</p>
<p>À l'avenir, je souhaite réfléchir davantage à la manière d'appliquer les outils mathématiques, y compris les idées issues des probabilités en haute dimension, pour accélérer l'inférence et la formation.</p>
<p><strong>Zilliz :</strong> Où se situe le plafond de la quantification vectorielle en tant que domaine ? Quelle est la marge de progression ?</p>
<p><strong>Cheng Long :</strong> D'un point de vue théorique, le plafond est largement en vue. RaBitQ est déjà asymptotiquement optimal.</p>
<p>Mais il y a encore beaucoup de place du côté de l'ingénierie. Il faut encore tenir compte des caractéristiques du matériel, de la distribution des données, des contraintes de latence et de nombreux autres facteurs pratiques. C'est précisément la raison pour laquelle les systèmes de production nécessitent encore un travail minutieux dans des domaines tels que l'<a href="https://milvus.io/docs/architecture_overview.md">architecture des bases de données vectorielles distribuées</a>, la <a href="https://milvus.io/docs/sparse_vector.md">prise en charge des vecteurs épars</a>, les <a href="https://milvus.io/docs/reranking.md">pipelines de reclassement</a> et la sélection des métriques dans les <a href="https://milvus.io/docs/metric.md">métriques de distance de Milvus</a>.</p>
<h2 id="Keep-Reading" class="common-anchor-header">Poursuivre la lecture<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
    </button></h2><p>Si vous souhaitez approfondir l'aspect technique de RaBitQ et la façon dont il s'intègre dans Milvus, voici les ressources les plus pertinentes :</p>
<ul>
<li><a href="https://milvus.io/docs/ivf-rabitq.md">Documentation IVF_RABITQ</a> - détails de configuration et conseils de réglage.</li>
<li><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md">Intégration de RaBitQ</a> - comment Milvus a transformé RaBitQ en un index de production.</li>
<li><a href="https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md">Comment la quantification vectorielle affecte les coûts de l'infrastructure d'IA</a> - notre analyse plus large de la discussion TurboQuant-RaBitQ.</li>
<li><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6 release post</a> - où IVF_RABITQ a été livré en tant qu'option d'index Milvus réelle.</li>
<li><a href="https://milvus.io/docs/index-explained.md">L'index Milvus expliqué</a> - comment IVF_RABITQ s'intègre aux autres choix d'index.</li>
<li>L<a href="https://milvus.io/docs/ivf-flat.md">'indexation IVF_FLAT</a> et l'<a href="https://milvus.io/docs/hnsw.md">indexation HNSW</a> - des références utiles si vous comparez les choix d'index.</li>
<li><a href="https://milvus.io/docs/schema.md">Conception de schémas dans Milvus</a> et <a href="https://milvus.io/docs/filtered-search.md">recherche filtrée</a> - utile si vous évaluez RaBitQ dans une application réelle plutôt qu'isolée.</li>
<li><a href="https://milvus.io/docs/quickstart.md">Démarrage rapide de Milvus</a> et <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">conception du système RAG</a> - utile si vous voulez l'essayer dans un pipeline de recherche.</li>
</ul>
<p>Rejoignez la <a href="https://slack.milvus.io/">communauté Milvus Slack</a> ou <a href="https://milvus.io/office-hours">réservez les Milvus Office Hours</a> si vous souhaitez discuter de votre charge de travail.</p>
<p>Si vous préférez sauter l'étape de l'installation de l'infrastructure, vous pouvez vous <a href="https://cloud.zilliz.com/signup">inscrire à Zilliz Cloud</a> (Milvus entièrement géré).</p>
