---
id: power-high-performance-rag-for-genai-with-hpe-alletra-storag-mp-milvus.md
title: >-
  Alimentez le RAG haute performance pour GenAI avec HPE Alletra Storage MP +
  Milvus
author: Denise Ochoa-Mendoza
date: 2025-11-10T00:00:00.000Z
cover: assets.zilliz.com/hpe_cover_45b4796ef3.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, HPE, Alletra Storage MP X10000, vector database, RAG'
meta_title: Optimized RAG with HPE Alletra Storage MP X10000 + Milvus
desc: >-
  Boostez GenAI avec HPE Alletra Storage MP X10000 et Milvus. Bénéficiez d'une
  recherche vectorielle évolutive à faible latence et d'un stockage de qualité
  professionnelle pour un RAG rapide et sécurisé.
origin: >-
  https://community.hpe.com/t5/around-the-storage-block/power-high-performance-rag-for-genai-with-hpe-alletra-storage-mp/ba-p/7257369
---
<p><em>Cet article a été publié à l'origine sur <a href="https://community.hpe.com/t5/around-the-storage-block/power-high-performance-rag-for-genai-with-hpe-alletra-storage-mp/ba-p/7257369">HPE Community</a> et est repris ici avec autorisation.</em></p>
<p>HPE Alletra Storage MP X10000 et Milvus alimentent un RAG évolutif et à faible latence, permettant aux LLM de fournir des réponses précises et riches en contexte avec une recherche vectorielle haute performance pour les charges de travail GenAI.</p>
<h2 id="In-generative-AI-RAG-needs-more-than-just-an-LLM" class="common-anchor-header">Dans l'IA générative, RAG a besoin de plus qu'un LLM<button data-href="#In-generative-AI-RAG-needs-more-than-just-an-LLM" class="anchor-icon" translate="no">
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
    </button></h2><p>Le contexte libère la véritable puissance de l'IA générative (GenAI) et des grands modèles de langage (LLM). Lorsqu'un LLM dispose des bons signaux pour orienter ses réponses, il peut fournir des réponses précises, pertinentes et fiables.</p>
<p>Imaginez que vous soyez lâché dans une jungle dense avec un appareil GPS mais sans signal satellite. L'écran affiche une carte, mais sans votre position actuelle, il est inutile pour la navigation. En revanche, un GPS doté d'un signal satellite puissant ne se contente pas d'afficher une carte : il vous guide pas à pas.</p>
<p>C'est ce que fait la génération augmentée par récupération (RAG) pour les LLM. Le modèle dispose déjà de la carte (ses connaissances pré-entraînées), mais pas de la direction (vos données spécifiques au domaine). Les LLM sans RAG sont comme des dispositifs GPS qui sont pleins de connaissances mais qui n'ont pas d'orientation en temps réel. Les RAG fournissent le signal qui indique au modèle où il se trouve et où il doit aller.</p>
<p>RAG fonde les réponses du modèle sur des connaissances fiables et actualisées tirées de votre propre contenu spécifique au domaine : politiques, documents sur les produits, tickets, PDF, code, transcriptions audio, images, et bien d'autres choses encore. Faire fonctionner RAG à grande échelle est un défi. Le processus de recherche doit être suffisamment rapide pour que l'expérience de l'utilisateur reste transparente, suffisamment précis pour renvoyer les informations les plus pertinentes et prévisible, même lorsque le système est fortement sollicité. Cela signifie qu'il faut gérer des volumes de requêtes élevés, l'ingestion continue de données et des tâches en arrière-plan telles que la construction d'index sans dégradation des performances. La mise en place d'un pipeline RAG avec quelques PDF est relativement simple. Cependant, lorsqu'il s'agit de passer à des centaines de PDF, la tâche devient nettement plus ardue. Vous ne pouvez pas tout garder en mémoire, et une stratégie de stockage robuste et efficace devient donc essentielle pour gérer les embeddings, les index et les performances d'extraction. RAG nécessite une base de données vectorielle et une couche de stockage capable de suivre le rythme de l'augmentation de la concurrence et des volumes de données.</p>
<h2 id="Vector-databases-power-RAG" class="common-anchor-header">Les bases de données vectorielles alimentent RAG<button data-href="#Vector-databases-power-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Au cœur de RAG se trouve la recherche sémantique, qui consiste à trouver des informations en fonction de leur signification plutôt que de mots-clés exacts. C'est là que les bases de données vectorielles entrent en jeu. Celles-ci stockent des enchâssements à haute dimension de textes, d'images et d'autres données non structurées, permettant une recherche par similarité qui récupère le contexte le plus pertinent pour vos requêtes. Milvus est un exemple de premier plan : une base de données vectorielles open-source native dans le nuage, conçue pour la recherche de similarités à l'échelle du milliard. Elle prend en charge la recherche hybride, combinant la similarité vectorielle avec des mots-clés et des filtres scalaires pour la précision, et offre une mise à l'échelle indépendante du calcul et du stockage avec des options d'optimisation GPU-aware pour l'accélération. Milvus gère également les données par le biais d'un cycle de vie de segment intelligent, passant de segments croissants à des segments scellés avec compactage et plusieurs options d'indexation ANN (approximate nearest neighbor) telles que HNSW et DiskANN, garantissant les performances et l'évolutivité pour les charges de travail d'IA en temps réel telles que RAG.</p>
<h2 id="The-hidden-challenge-Storage-throughput--latency" class="common-anchor-header">Le défi caché : débit et latence du stockage<button data-href="#The-hidden-challenge-Storage-throughput--latency" class="anchor-icon" translate="no">
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
    </button></h2><p>Les charges de travail de recherche vectorielle exercent une pression sur toutes les parties du système. Elles exigent une ingestion à haute fréquence tout en maintenant une faible latence pour les requêtes interactives. Dans le même temps, les opérations d'arrière-plan telles que la construction d'index, le compactage et le rechargement des données doivent être exécutées sans perturber les performances en temps réel. De nombreux goulets d'étranglement dans les architectures traditionnelles sont liés au stockage. Qu'il s'agisse de limitations d'entrées/sorties (E/S), de délais de consultation des métadonnées ou de contraintes de concurrence. Pour offrir des performances prévisibles et en temps réel à grande échelle, la couche de stockage doit répondre aux exigences des bases de données vectorielles.</p>
<h2 id="The-storage-foundation-for-high-performance-vector-search" class="common-anchor-header">La base de stockage pour la recherche vectorielle haute performance<button data-href="#The-storage-foundation-for-high-performance-vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://www.hpe.com/in/en/alletra-storage-mp-x10000.html">HPE Alletra Storage MP X10000</a> est une plateforme de stockage objet optimisée pour les flashs, entièrement NVMe, compatible S3, conçue pour des performances en temps réel à l'échelle. Contrairement aux magasins d'objets traditionnels axés sur la capacité, HPE Alletra Storage MP X10000 est conçu pour des charges de travail à faible latence et à haut débit comme la recherche vectorielle. Son moteur clé-valeur structuré en logs et ses métadonnées basées sur l'étendue permettent des lectures et des écritures hautement parallèles, tandis que GPUDirect RDMA fournit des chemins de données sans copie qui réduisent les frais généraux du CPU et accélèrent le mouvement des données vers les GPU. L'architecture prend en charge la mise à l'échelle désagrégée, permettant à la capacité et à la performance de croître indépendamment, et inclut des fonctionnalités de niveau entreprise telles que le chiffrement, le contrôle d'accès basé sur les rôles (RBAC), l'immuabilité et la durabilité des données. Associé à sa conception cloud-native, HPE Alletra Storage MP X10000 s'intègre parfaitement aux environnements Kubernetes, ce qui en fait une base de stockage idéale pour les déploiements Milvus.</p>
<h2 id="HPE-Alletra-Storage-MP-X10000-and-Milvus-A-scalable-foundation-for-RAG" class="common-anchor-header">HPE Alletra Storage MP X10000 et Milvus : une base évolutive pour RAG<button data-href="#HPE-Alletra-Storage-MP-X10000-and-Milvus-A-scalable-foundation-for-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>HPE Alletra Storage MP X10000 et Milvus se complètent pour offrir un RAG rapide, prévisible et facile à mettre à l'échelle. La figure 1 illustre l'architecture des cas d'utilisation AI évolutifs et des pipelines RAG, montrant comment les composants Milvus déployés dans un environnement conteneurisé interagissent avec le stockage objet hautes performances de HPE Alletra Storage MP X10000.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_1_Architecture_of_scalable_AI_use_cases_and_RAG_pipeline_using_HPE_Alletra_Storage_MP_X10000_and_Milvus_ed3a87a5ee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus sépare clairement le calcul du stockage, tandis que HPE Alletra Storage MP X10000 fournit un accès aux objets à haut débit et à faible latence qui suit le rythme des charges de travail vectorielles. Ensemble, ils permettent des performances prévisibles de type scale-out : Milvus distribue les requêtes à travers les unités de stockage et la mise à l'échelle fractionnelle et multidimensionnelle de HPE Alletra Storage MP X10000 maintient la latence constante à mesure que les données et les QPS augmentent. En termes simples, vous ajoutez exactement la capacité ou la performance dont vous avez besoin, quand vous en avez besoin. La simplicité opérationnelle est un autre avantage : HPE Alletra Storage MP X10000 maintient des performances maximales à partir d'un seul bac, éliminant ainsi la hiérarchisation complexe, tandis que les fonctions d'entreprise (cryptage, RBAC, immutabilité, durabilité robuste) prennent en charge les déploiements sur site ou hybrides avec une forte souveraineté des données et des objectifs de niveau de service (SLO) cohérents.</p>
<p>Lorsque la recherche vectorielle prend de l'ampleur, le stockage est souvent accusé d'être lent à l'ingestion, au compactage ou à la récupération. Avec Milvus sur HPE Alletra Storage MP X10000, ce discours change. L'architecture entièrement NVMe, structurée en logs, et l'option RDMA GPUDirect de la plate-forme offrent un accès cohérent et à très faible latence aux objets, même en cas de forte concurrence et pendant les opérations du cycle de vie telles que la création et le rechargement d'index. En pratique, vos pipelines RAG restent liés au calcul et non au stockage. Au fur et à mesure que les collections augmentent et que les volumes de requêtes augmentent, Milvus reste réactif tandis que HPE Alletra Storage MP X10000 préserve la marge d'E/S, ce qui permet une évolutivité prévisible et linéaire sans réarchitecture du stockage. Cela devient particulièrement important lorsque les déploiements RAG dépassent les étapes initiales de validation du concept et passent à la production complète.</p>
<h2 id="Enterprise-ready-RAG-Scalable-predictable-and-built-for-GenAI" class="common-anchor-header">RAG prêt pour l'entreprise : évolutif, prévisible et conçu pour la GenAI<button data-href="#Enterprise-ready-RAG-Scalable-predictable-and-built-for-GenAI" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour les charges de travail RAG et GenAI en temps réel, la combinaison de HPE Alletra Storage MP X10000 et Milvus offre une base prête pour l'avenir qui évolue en toute confiance. Cette solution intégrée permet aux entreprises de construire des systèmes intelligents qui sont rapides, élastiques et sécurisés, sans compromis sur les performances ou la facilité de gestion. Milvus fournit une recherche vectorielle distribuée et accélérée par le GPU avec une mise à l'échelle modulaire, tandis que HPE Alletra Storage MP X10000 assure un accès aux objets ultra-rapide et à faible latence avec une durabilité et une gestion du cycle de vie de niveau professionnel. Ensemble, ils découplent le calcul du stockage, permettant des performances prévisibles même lorsque les volumes de données et la complexité des requêtes augmentent. Qu'il s'agisse de recommandations en temps réel, de recherche sémantique ou de mise à l'échelle de milliards de vecteurs, cette architecture assure la réactivité, la rentabilité et l'optimisation du cloud de vos pipelines RAG. Avec une intégration transparente dans Kubernetes et le cloud HPE GreenLake, vous bénéficiez d'une gestion unifiée, d'une tarification basée sur la consommation et de la flexibilité nécessaire pour déployer dans des environnements de cloud hybride ou privé. HPE Alletra Storage MP X10000 et Milvus : une solution RAG évolutive et performante conçue pour répondre aux exigences de la GenAI moderne.</p>
