---
id: milvus-2-4-nvidia-cagra-gpu-index-multivector-search-sparse-vector-support.md
title: >-
  Dévoilement de Milvus 2.4 : recherche multivectorielle, vecteur épars, index
  CAGRA, et plus encore !
author: Fendy Feng
date: 2024-3-20
desc: >-
  Nous sommes heureux d'annoncer le lancement de Milvus 2.4, une avancée majeure
  dans l'amélioration des capacités de recherche pour les ensembles de données à
  grande échelle.
metaTitle: 'Milvus 2.4 Supports Multi-vector Search, Sparse Vector, CAGRA, and More!'
cover: assets.zilliz.com/What_is_new_in_Milvus_2_4_1_c580220be3.png
tag: Engineering
tags: >-
  Data science, Database, Tech, Artificial Intelligence, Vector Management,
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-4-nvidia-cagra-gpu-index-multivector-search-sparse-vector-support.md
---
<p>Nous sommes heureux d'annoncer le lancement de Milvus 2.4, une avancée majeure dans l'amélioration des capacités de recherche pour les ensembles de données à grande échelle. Cette dernière version ajoute de nouvelles fonctionnalités, telles que la prise en charge de l'index CAGRA basé sur le GPU, la prise en charge bêta des <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">encastrements épars</a>, la recherche de groupe et diverses autres améliorations des capacités de recherche. Ces développements renforcent notre engagement envers la communauté en offrant aux développeurs comme vous un outil puissant et efficace pour manipuler et interroger les données vectorielles. Voyons ensemble les principaux avantages de Milvus 2.4.</p>
<h2 id="Enabled-Multi-vector-Search-for-Simplified-Multimodal-Searches" class="common-anchor-header">Recherche multi-vectorielle activée pour des recherches multimodales simplifiées<button data-href="#Enabled-Multi-vector-Search-for-Simplified-Multimodal-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.4 offre une capacité de recherche multivectorielle, permettant la recherche et le reclassement simultanés de différents types de vecteurs dans le même système Milvus. Cette fonctionnalité rationalise les recherches multimodales, améliorant considérablement les taux de rappel et permettant aux développeurs de gérer sans effort des applications d'IA complexes avec des types de données variés. En outre, cette fonctionnalité simplifie l'intégration et la mise au point de modèles de reclassement personnalisés, contribuant à la création de fonctions de recherche avancées telles que des <a href="https://zilliz.com/vector-database-use-cases/recommender-system">systèmes de recommandation</a> précis qui utilisent des informations provenant de données multidimensionnelles.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_the_multi_vector_search_feature_works_6c85961349.png" alt="How the Milti-Vector Search Feature Works" class="doc-image" id="how-the-milti-vector-search-feature-works" />
   </span> <span class="img-wrapper"> <span>Fonctionnement de la fonction de recherche multivectorielle</span> </span></p>
<p>La prise en charge multivectorielle dans Milvus comporte deux éléments :</p>
<ol>
<li><p>la possibilité de stocker et d'interroger plusieurs vecteurs pour une seule entité au sein d'une collection, ce qui est une manière plus naturelle d'organiser les données</p></li>
<li><p>La possibilité de construire/optimiser un algorithme de reclassement en tirant parti des algorithmes de reclassement préconstruits dans Milvus.</p></li>
</ol>
<p>Outre le fait qu'il s'agit d'une fonctionnalité très <a href="https://github.com/milvus-io/milvus/issues/25639">demandée</a>, nous l'avons développée parce que l'industrie évolue vers des modèles multimodaux avec la publication de GPT-4 et Claude 3. Le reclassement est une technique couramment utilisée pour améliorer les performances des requêtes dans le domaine de la recherche. Notre objectif est de permettre aux développeurs de créer et d'optimiser facilement leurs rerankers au sein de l'écosystème Milvus.</p>
<h2 id="Grouping-Search-Support-for-Enhanced-Compute-Efficiency" class="common-anchor-header">Prise en charge de la recherche groupée pour une meilleure efficacité de calcul<button data-href="#Grouping-Search-Support-for-Enhanced-Compute-Efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>La recherche groupée est une autre <a href="https://github.com/milvus-io/milvus/issues/25343">fonctionnalité</a> souvent <a href="https://github.com/milvus-io/milvus/issues/25343">demandée que</a> nous avons ajoutée à Milvus 2.4. Elle intègre une opération de groupage conçue pour les champs de type BOOL, INT ou VARCHAR, comblant ainsi un manque d'efficacité crucial dans l'exécution de requêtes de groupage à grande échelle.</p>
<p>Traditionnellement, les développeurs s'appuyaient sur des recherches Top-K approfondies suivies d'un post-traitement manuel pour distiller des résultats spécifiques à un groupe, une méthode gourmande en ressources informatiques et en code. La recherche par regroupement affine ce processus en reliant efficacement les résultats des requêtes à des identifiants de groupe agrégés, tels que les noms de documents ou de vidéos, ce qui rationalise le traitement des entités segmentées au sein d'ensembles de données plus importants.</p>
<p>Milvus distingue son Grouping Search par une mise en œuvre basée sur des itérateurs, offrant une nette amélioration de l'efficacité de calcul par rapport à des technologies similaires. Ce choix garantit une évolutivité supérieure des performances, en particulier dans les environnements de production où l'optimisation des ressources informatiques est primordiale. En réduisant la traversée des données et les frais généraux de calcul, Milvus permet un traitement plus efficace des requêtes, ce qui réduit considérablement les temps de réponse et les coûts d'exploitation par rapport à d'autres bases de données vectorielles.</p>
<p>La recherche groupée renforce la capacité de Milvus à gérer des requêtes complexes et volumineuses et s'aligne sur les pratiques de calcul haute performance pour les solutions de gestion de données robustes.</p>
<h2 id="Beta-Support-for-Sparse-Vector-Embeddings" class="common-anchor-header">Prise en charge bêta des encastrements de vecteurs épars<button data-href="#Beta-Support-for-Sparse-Vector-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>Les<a href="https://zilliz.com/learn/sparse-and-dense-embeddings">encastrements de</a> vecteurs<a href="https://zilliz.com/learn/sparse-and-dense-embeddings">épars</a> représentent un changement de paradigme par rapport aux approches vectorielles denses traditionnelles, car ils prennent en compte les nuances de la similarité sémantique plutôt que la simple fréquence des mots clés. Cette distinction permet une capacité de recherche plus nuancée, s'alignant étroitement sur le contenu sémantique de la requête et des documents. Les modèles vectoriels épars, particulièrement utiles dans la recherche d'informations et le traitement du langage naturel, offrent de puissantes capacités de recherche hors domaine et une grande facilité d'interprétation par rapport à leurs homologues denses.</p>
<p>Dans Milvus 2.4, nous avons étendu la recherche hybride pour inclure les encastrements épars générés par des modèles neuronaux avancés tels que SPLADEv2 ou des modèles statistiques tels que BM25. Dans Milvus, les vecteurs épars sont traités sur un pied d'égalité avec les vecteurs denses, ce qui permet de créer des collections avec des champs de vecteurs épars, d'insérer des données, de construire des index et d'effectuer des recherches de similarité. Notamment, les encastrements épars dans Milvus prennent en charge la métrique de distance du <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search#Inner-Product">produit intérieur</a> (IP), ce qui est avantageux compte tenu de leur nature hautement dimensionnelle, qui rend les autres métriques moins efficaces. Cette fonctionnalité prend également en charge les types de données dont la dimension est un entier non signé de 32 bits et un flottant de 32 bits pour la valeur, ce qui facilite un large éventail d'applications, depuis les recherches textuelles nuancées jusqu'aux systèmes élaborés de <a href="https://zilliz.com/learn/information-retrieval-metrics">recherche d'informations</a>.</p>
<p>Grâce à cette nouvelle fonctionnalité, Milvus permet des méthodologies de recherche hybrides qui combinent des techniques basées sur les mots-clés et l'intégration, offrant une transition transparente aux utilisateurs qui abandonnent les cadres de recherche centrés sur les mots-clés et qui recherchent une solution complète et nécessitant peu de maintenance.</p>
<p>Nous qualifions cette fonctionnalité de "Beta" afin de poursuivre nos tests de performance et de recueillir les commentaires de la communauté. La disponibilité générale (GA) de la prise en charge des vecteurs épars est prévue avec la sortie de Milvus 3.0.</p>
<h2 id="CAGRA-Index-Support-for-Advanced-GPU-Accelerated-Graph-Indexing" class="common-anchor-header">Prise en charge de l'index CAGRA pour l'indexation graphique accélérée par le GPU<button data-href="#CAGRA-Index-Support-for-Advanced-GPU-Accelerated-Graph-Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>Développé par NVIDIA, <a href="https://arxiv.org/abs/2308.15136">CAGRA</a> (Cuda Anns GRAph-based) est une technologie d'indexation graphique basée sur le GPU qui surpasse de manière significative les méthodes traditionnelles basées sur le CPU telles que l'index HNSW en termes d'efficacité et de performance, en particulier dans les environnements à haut débit.</p>
<p>Avec l'introduction de l'index CAGRA, Milvus 2.4 offre une capacité améliorée d'indexation de graphes accélérée par le GPU. Cette amélioration est idéale pour la création d'applications de recherche de similarités nécessitant une latence minimale. En outre, Milvus 2.4 intègre une recherche par force brute avec l'index CAGRA pour atteindre des taux de rappel maximum dans les applications. Pour obtenir des informations détaillées, consultez le <a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">blog d'introduction sur CAGRA</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_raft_cagra_vs_milvus_hnsw_ffe0415ff5.png" alt="Milvus Raft CAGRA vs. Milvus HNSW" class="doc-image" id="milvus-raft-cagra-vs.-milvus-hnsw" />
   </span> <span class="img-wrapper"> <span>Milvus Raft CAGRA vs. Milvus HNSW</span> </span></p>
<h2 id="Additional-Enhancements-and-Features" class="common-anchor-header">Améliorations et fonctionnalités supplémentaires<button data-href="#Additional-Enhancements-and-Features" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.4 comprend également d'autres améliorations clés, telles que la prise en charge des expressions régulières pour une meilleure correspondance des sous-chaînes dans le <a href="https://zilliz.com/blog/metadata-filtering-with-zilliz-cloud-pipelines">filtrage des métadonnées</a>, un nouvel index scalaire inversé pour un filtrage efficace des types de données scalaires et un outil de capture des données de modification pour surveiller et répliquer les modifications dans les collections Milvus. Ces mises à jour améliorent collectivement les performances et la polyvalence de Milvus, ce qui en fait une solution complète pour les opérations de données complexes.</p>
<p>Pour plus de détails, voir la <a href="https://milvus.io/docs/release_notes.md">documentation Milvus 2.4</a>.</p>
<h2 id="Stay-Connected" class="common-anchor-header">Restez connecté !<button data-href="#Stay-Connected" class="anchor-icon" translate="no">
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
    </button></h2><p>Vous souhaitez en savoir plus sur Milvus 2.4 ? <a href="https://zilliz.com/event/unlocking-advanced-search-capabilities-milvus">Rejoignez notre prochain webinaire</a> avec James Luan, vice-président de l'ingénierie de Zilliz, pour une discussion approfondie sur les capacités de cette dernière version. Si vous avez des questions ou des commentaires, rejoignez notre <a href="https://discord.com/invite/8uyFbECzPX">canal Discord</a> pour échanger avec nos ingénieurs et les membres de la communauté. N'oubliez pas de nous suivre sur <a href="https://twitter.com/milvusio">Twitter</a> ou <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> pour connaître les dernières nouvelles et mises à jour concernant Milvus.</p>
