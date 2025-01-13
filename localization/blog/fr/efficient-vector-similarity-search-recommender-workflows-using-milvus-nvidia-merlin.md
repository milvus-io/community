---
id: >-
  efficient-vector-similarity-search-recommender-workflows-using-milvus-nvidia-merlin.md
title: >-
  Recherche efficace de similarité vectorielle dans les flux de travail de
  recommandation à l'aide de Milvus et de NVIDIA Merlin
author: Burcin Bozkaya
date: 2023-12-15T00:00:00.000Z
desc: >-
  Une introduction à l'intégration de NVIDIA Merlin et Milvus dans la
  construction de systèmes de recommandation et l'évaluation de ses performances
  dans divers scénarios.
cover: assets.zilliz.com/nvidia_4921837ca6.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, NVIDIA, Merlin
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/efficient-vector-similarity-search-recommender-workflows-using-milvus-nvidia-merlin
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/nvidia_4921837ca6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Cet article a été publié pour la première fois sur le <a href="https://medium.com/nvidia-merlin/efficient-vector-similarity-search-in-recommender-workflows-using-milvus-with-nvidia-merlin-84d568290ee4">canal Medium de NVIDIA Merlin</a> et a été édité et reposté ici avec l'autorisation de l'auteur. Il a été rédigé conjointement par <a href="https://medium.com/u/743df9db1666?source=post_page-----84d568290ee4--------------------------------">Burcin Bozkaya</a> et <a href="https://medium.com/u/279d4c25a145?source=post_page-----84d568290ee4--------------------------------">William Hicks</a> de NVIDIA et <a href="https://medium.com/u/3e8a3c67a8a5?source=post_page-----84d568290ee4--------------------------------">Filip Haltmayer</a> et <a href="https://github.com/liliu-z">Li Liu</a> de Zilliz.</em></p>
<h2 id="Introduction" class="common-anchor-header">Introduction<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Les systèmes de recommandation modernes (Recsys) consistent en des pipelines de formation/inférence impliquant plusieurs étapes d'ingestion de données, de prétraitement de données, de formation de modèles et de réglage d'hyperparamètres pour la recherche, le filtrage, le classement et la notation d'éléments pertinents. Un élément essentiel d'un système de recommandation est l'extraction ou la découverte des éléments les plus pertinents pour un utilisateur, en particulier en présence de vastes catalogues d'articles. Cette étape implique généralement une recherche <a href="https://zilliz.com/glossary/anns">approximative du plus proche voisin (ANN)</a> sur une base de données indexée de représentations vectorielles à faible dimension (c'est-à-dire des embeddings) d'attributs de produits et d'utilisateurs créés à partir de modèles d'apprentissage profond qui s'entraînent sur les interactions entre les utilisateurs et les produits/services.</p>
<p><a href="https://github.com/NVIDIA-Merlin">NVIDIA Merlin</a>, un cadre open-source développé pour former des modèles de bout en bout afin de faire des recommandations à n'importe quelle échelle, s'intègre à un index de <a href="https://zilliz.com/learn/what-is-vector-database">base de données vectorielles</a> efficace et à un cadre de recherche. <a href="https://zilliz.com/what-is-milvus">Milvus</a>, une base de données vectorielles open-source créée par <a href="https://zilliz.com/">Zilliz</a>, est l'un de ces cadres qui a récemment fait l'objet d'une grande attention. Elle offre des capacités d'indexation et d'interrogation rapides. Milvus a récemment ajouté la <a href="https://zilliz.com/blog/getting-started-with-gpu-powered-milvus-unlocking-10x-higher-performance">prise en charge de l'accélération GPU</a> qui utilise les GPU NVIDIA pour soutenir les flux de travail de l'IA. La prise en charge de l'accélération GPU est une excellente nouvelle car une bibliothèque de recherche vectorielle accélérée permet des requêtes simultanées rapides, ce qui a un impact positif sur les exigences en matière de latence dans les systèmes de recommandation d'aujourd'hui, où les développeurs s'attendent à de nombreuses requêtes simultanées. Milvus compte plus de 5 millions de téléchargements (docker pulls), ~23k étoiles sur GitHub (en septembre 2023), plus de 5 000 entreprises clientes et constitue un composant essentiel de nombreuses applications (voir les <a href="https://medium.com/vector-database/tagged/use-cases-of-milvus">cas d'</a>utilisation).</p>
<p>Ce blog montre comment Milvus fonctionne avec le cadre Merlin Recsys au moment de la formation et de l'inférence. Nous montrons comment Milvus complète Merlin dans l'étape de récupération des éléments avec une recherche top-k vector embedding très efficace et comment il peut être utilisé avec NVIDIA Triton Inference Server (TIS) au moment de l'inférence (voir Figure 1). <strong>Nos résultats de référence montrent une accélération impressionnante de 37x à 91x avec Milvus accéléré par le GPU qui utilise NVIDIA RAFT avec les encastrements vectoriels générés par les modèles Merlin.</strong> Le code que nous utilisons pour montrer l'intégration Merlin-Milvus et les résultats détaillés de l'analyse comparative, ainsi que la <a href="https://github.com/zilliztech/VectorDBBench">bibliothèque</a> qui a facilité notre étude comparative, sont disponibles ici.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Multistage_recommender_system_with_Milvus_ee891c4ad5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 1. Système de recommandation à plusieurs étapes avec le cadre Milvus contribuant à l'étape de recherche. Source de la figure originale à plusieurs étapes : ce <a href="https://medium.com/nvidia-merlin/recommender-systems-not-just-recommender-models-485c161c755e">billet de blog</a>.</em></p>
<h2 id="The-challenges-facing-recommenders" class="common-anchor-header">Les défis auxquels sont confrontés les recommandeurs<button data-href="#The-challenges-facing-recommenders" class="anchor-icon" translate="no">
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
    </button></h2><p>Compte tenu de la nature multi-étapes des recommandeurs et de la disponibilité de divers composants et bibliothèques qu'ils intègrent, un défi important consiste à intégrer tous les composants de manière transparente dans un pipeline de bout en bout. Nous visons à montrer que l'intégration peut être faite avec moins d'effort dans nos exemples de carnets.</p>
<p>Un autre défi des flux de recommandation est l'accélération de certaines parties du pipeline. Bien qu'ils soient connus pour jouer un rôle important dans l'entraînement de grands réseaux neuronaux, les GPU n'ont été ajoutés que récemment aux bases de données vectorielles et à la recherche d'ANN. Avec l'augmentation de la taille des inventaires de produits de commerce électronique ou des bases de données de médias en continu et le nombre d'utilisateurs qui utilisent ces services, les CPU doivent fournir les performances requises pour servir des millions d'utilisateurs dans des flux de travail Recsys performants. L'accélération GPU dans d'autres parties du pipeline est devenue nécessaire pour relever ce défi. La solution présentée dans ce blog relève ce défi en montrant que la recherche ANN est efficace lorsqu'elle est effectuée à l'aide de GPU.</p>
<h2 id="Tech-stacks-for-the-solution" class="common-anchor-header">Piles technologiques pour la solution<button data-href="#Tech-stacks-for-the-solution" class="anchor-icon" translate="no">
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
    </button></h2><p>Commençons par passer en revue certains des éléments fondamentaux nécessaires à la réalisation de notre travail.</p>
<ul>
<li><p>NVIDIA <a href="https://github.com/NVIDIA-Merlin/Merlin">Merlin</a>: une bibliothèque open-source avec des API de haut niveau accélérant les recommandeurs sur les GPU NVIDIA.</p></li>
<li><p><a href="https://github.com/NVIDIA-Merlin/NVTabular">NVTabular</a>: pour le prétraitement des données tabulaires d'entrée et l'ingénierie des caractéristiques.</p></li>
<li><p><a href="https://github.com/NVIDIA-Merlin/models">Merlin Models</a>: pour la formation de modèles d'apprentissage profond et pour apprendre, dans ce cas, les vecteurs d'intégration de l'utilisateur et de l'élément à partir des données d'interaction de l'utilisateur.</p></li>
<li><p><a href="https://github.com/NVIDIA-Merlin/systems">Systèmes Merlin</a>: pour combiner un modèle de recommandation basé sur TensorFlow avec d'autres éléments (par exemple, magasin de fonctionnalités, recherche ANN avec Milvus) à servir avec TIS.</p></li>
<li><p><a href="https://github.com/triton-inference-server/server">Triton Inference Server</a>: pour l'étape d'inférence où un vecteur de caractéristiques de l'utilisateur est transmis et où des recommandations de produits sont générées.</p></li>
<li><p>Conteneurisation : tout ce qui précède est disponible via les conteneurs que NVIDIA fournit dans le <a href="https://catalog.ngc.nvidia.com/">catalogue NGC</a>. Nous avons utilisé le conteneur Merlin TensorFlow 23.06 disponible <a href="https://catalog.ngc.nvidia.com/orgs/nvidia/teams/merlin/containers/merlin-tensorflow">ici</a>.</p></li>
<li><p><a href="https://github.com/milvus-io/milvus/releases/tag/v2.3.0">Milvus 2.3</a>: pour l'indexation et l'interrogation de vecteurs accélérées par le GPU.</p></li>
<li><p><a href="https://github.com/milvus-io/milvus/releases">Milvus 2.2.11</a>: la même chose que ci-dessus, mais pour le faire sur le CPU.</p></li>
<li><p><a href="https://zilliz.com/product/integrations/python">Pymilvus SDK</a>: pour se connecter au serveur Milvus, créer des index de base de données vectorielles et exécuter des requêtes via une interface Python.</p></li>
<li><p><a href="https://github.com/feast-dev/feast">Feast</a>: pour enregistrer et récupérer les attributs des utilisateurs et des éléments dans un magasin de caractéristiques (open source) dans le cadre de notre pipeline RecSys de bout en bout.</p></li>
</ul>
<p>Plusieurs bibliothèques et cadres sous-jacents sont également utilisés sous le capot. Par exemple, Merlin s'appuie sur d'autres bibliothèques NVIDIA, telles que cuDF et Dask, toutes deux disponibles sous <a href="https://github.com/rapidsai/cudf">RAPIDS cuDF</a>. De même, Milvus s'appuie sur <a href="https://github.com/rapidsai/raft">NVIDIA RAFT</a> pour les primitives d'accélération GPU et sur des bibliothèques modifiées telles que <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a> et <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a> pour la recherche.</p>
<h2 id="Understanding-vector-databases-and-Milvus" class="common-anchor-header">Comprendre les bases de données vectorielles et Milvus<button data-href="#Understanding-vector-databases-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>L'<a href="https://zilliz.com/glossary/anns">approximation du plus proche voisin (ANN)</a> est une fonctionnalité que les bases de données relationnelles ne peuvent pas gérer. Les bases de données relationnelles sont conçues pour traiter des données tabulaires avec des structures prédéfinies et des valeurs directement comparables. Les index des bases de données relationnelles s'appuient sur ces éléments pour comparer les données et créer des structures qui permettent de savoir si chaque valeur est inférieure ou supérieure à l'autre. Les vecteurs d'intégration ne peuvent pas être comparés directement les uns aux autres de cette manière, car nous devons savoir ce que chaque valeur du vecteur représente. Ils ne peuvent pas dire si un vecteur est nécessairement inférieur à l'autre. La seule chose que nous pouvons faire est de calculer la distance entre les deux vecteurs. Si la distance entre deux vecteurs est faible, nous pouvons supposer que les caractéristiques qu'ils représentent sont similaires, et si elle est grande, nous pouvons supposer que les données qu'ils représentent sont plus différentes. Toutefois, ces index efficaces ont un coût : le calcul de la distance entre deux vecteurs est coûteux et les index vectoriels ne sont pas facilement adaptables, voire non modifiables. En raison de ces deux limitations, l'intégration de ces index est plus complexe dans les bases de données relationnelles, d'où la nécessité de <a href="https://zilliz.com/blog/what-is-a-real-vector-database">bases de données vectorielles spécifiques</a>.</p>
<p><a href="https://zilliz.com/what-is-milvus">Milvus</a> a été créé pour résoudre les problèmes que les bases de données relationnelles rencontrent avec les vecteurs et a été conçu dès le départ pour gérer ces vecteurs d'intégration et leurs index à grande échelle. Pour répondre à l'insigne "cloud-native", Milvus sépare le calcul et le stockage et les différentes tâches informatiques - interrogation, traitement des données et indexation. Les utilisateurs peuvent faire évoluer chaque partie de la base de données pour traiter d'autres cas d'utilisation, qu'il s'agisse d'insertion de données ou de recherche. En cas d'afflux important de demandes d'insertion, l'utilisateur peut temporairement faire évoluer les nœuds d'indexation horizontalement et verticalement pour gérer l'ingestion. De même, si aucune donnée n'est ingérée, mais qu'il y a beaucoup de recherches, l'utilisateur peut réduire les nœuds d'index et augmenter les nœuds de requête pour accroître le débit. Cette conception du système (voir la figure 2) nous a obligés à penser en termes d'informatique parallèle, ce qui a donné un système optimisé pour l'informatique avec de nombreuses possibilités d'optimisations ultérieures.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_system_design_bb3a44c9cc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 2. Conception du système Milvus</em></p>
<p>Milvus utilise également de nombreuses bibliothèques d'indexation de pointe pour permettre aux utilisateurs de personnaliser autant que possible leur système. Il les améliore en ajoutant la possibilité de gérer les opérations CRUD, les données en flux et le filtrage. Nous verrons plus loin en quoi ces index diffèrent et quels sont les avantages et les inconvénients de chacun d'entre eux.</p>
<h2 id="Example-solution-integration-of-Milvus-and-Merlin" class="common-anchor-header">Exemple de solution : intégration de Milvus et Merlin<button data-href="#Example-solution-integration-of-Milvus-and-Merlin" class="anchor-icon" translate="no">
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
    </button></h2><p>L'exemple de solution que nous présentons ici démontre l'intégration de Milvus avec Merlin à l'étape de récupération des éléments (lorsque les k éléments les plus pertinents sont récupérés par le biais d'une recherche ANN). Nous utilisons un ensemble de données réelles provenant d'un <a href="https://www.kaggle.com/datasets/chadgostopp/recsys-challenge-2015">défi RecSys</a>, décrit ci-dessous. Nous entraînons un modèle d'apprentissage profond à deux tours qui apprend les encastrements vectoriels pour les utilisateurs et les éléments. Cette section fournit également le plan de notre travail d'analyse comparative, y compris les mesures que nous recueillons et la gamme de paramètres que nous utilisons.</p>
<p>Notre approche comprend</p>
<ul>
<li><p>l'ingestion et le prétraitement des données</p></li>
<li><p>Formation de modèles d'apprentissage profond à deux tours</p></li>
<li><p>Construction de l'index Milvus</p></li>
<li><p>Recherche de similarité Milvus</p></li>
</ul>
<p>Nous décrivons brièvement chaque étape et renvoyons le lecteur à nos <a href="https://github.com/bbozkaya/merlin-milvus/tree/main/notebooks">carnets de notes</a> pour plus de détails.</p>
<h3 id="Dataset" class="common-anchor-header">Jeu de données</h3><p>YOOCHOOSE GmbH fournit le jeu de données que nous utilisons dans cette étude d'intégration et de référence pour le <a href="https://www.kaggle.com/datasets/chadgostopp/recsys-challenge-2015">défi RecSys 2015</a> et est disponible sur Kaggle. Il contient des événements de clics/achats d'utilisateurs d'un détaillant en ligne européen avec des attributs tels que l'ID de la session, l'horodatage, l'ID de l'article associé au clic/achat et la catégorie de l'article, disponibles dans le fichier yoochoose-clicks.dat. Les sessions sont indépendantes et il n'y a aucune indication d'utilisateurs qui reviennent, de sorte que nous traitons chaque session comme appartenant à un utilisateur distinct. L'ensemble de données comprend 9 249 729 sessions uniques (utilisateurs) et 52 739 éléments uniques.</p>
<h3 id="Data-ingestion-and-preprocessing" class="common-anchor-header">Ingestion et prétraitement des données</h3><p>L'outil que nous utilisons pour le prétraitement des données est <a href="https://github.com/NVIDIA-Merlin/NVTabular">NVTabular</a>, un composant de Merlin accéléré par le GPU, hautement évolutif, pour l'ingénierie des caractéristiques et le prétraitement. Nous utilisons NVTabular pour lire les données dans la mémoire du GPU, réorganiser les caractéristiques si nécessaire, exporter vers des fichiers parquet et créer une division formation-validation pour l'entraînement. Nous obtenons ainsi 7 305 761 utilisateurs uniques et 49 008 éléments uniques pour la formation. Nous classons également chaque colonne et ses valeurs en valeurs entières. L'ensemble de données est maintenant prêt pour l'entraînement avec le modèle Two-Tower.</p>
<h3 id="Model-training" class="common-anchor-header">Entraînement du modèle</h3><p>Nous utilisons le modèle d'apprentissage profond <a href="https://github.com/NVIDIA-Merlin/models/blob/main/examples/05-Retrieval-Model.ipynb">Two-Tower</a> pour entraîner et générer des encastrements d'utilisateurs et d'articles, utilisés ultérieurement dans l'indexation vectorielle et la recherche. Après avoir entraîné le modèle, nous pouvons extraire les encastrements d'utilisateurs et d'éléments appris.</p>
<p>Les deux étapes suivantes sont facultatives : un modèle <a href="https://arxiv.org/abs/1906.00091">DLRM</a> entraîné pour classer les éléments récupérés en vue d'une recommandation et un magasin de caractéristiques utilisé (dans ce cas, <a href="https://github.com/feast-dev/feast">Feast</a>) pour stocker et récupérer les caractéristiques de l'utilisateur et de l'élément. Nous les incluons pour compléter le flux de travail en plusieurs étapes.</p>
<p>Enfin, nous exportons les enchâssements d'utilisateurs et d'éléments vers des fichiers parquet, qui peuvent être rechargés ultérieurement pour créer un index vectoriel Milvus.</p>
<h3 id="Building-and-querying-the-Milvus-index" class="common-anchor-header">Construction et interrogation de l'index Milvus</h3><p>Milvus facilite l'indexation vectorielle et la recherche de similarités via un "serveur" lancé sur la machine d'inférence. Dans notre notebook #2, nous configurons ceci en installant le serveur Milvus et Pymilvus, puis en démarrant le serveur avec son port d'écoute par défaut. Ensuite, nous démontrons la construction d'un index simple (IVF_FLAT) et l'interrogation de celui-ci en utilisant les fonctions <code translate="no">setup_milvus</code> et <code translate="no">query_milvus</code>, respectivement.</p>
<h2 id="Benchmarking" class="common-anchor-header">Analyse comparative<button data-href="#Benchmarking" class="anchor-icon" translate="no">
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
    </button></h2><p>Nous avons conçu deux tests de référence pour démontrer l'intérêt d'utiliser une bibliothèque d'indexation/de recherche vectorielle rapide et efficace telle que Milvus.</p>
<ol>
<li><p>En utilisant Milvus pour construire des index vectoriels avec les deux ensembles d'embeddings que nous avons générés : 1) des embeddings d'utilisateurs pour 7,3 millions d'utilisateurs uniques, répartis en 85 % d'ensemble de formation (pour l'indexation) et 15 % d'ensemble de test (pour l'interrogation), et 2) des embeddings d'articles pour 49 000 produits (avec une répartition 50-50 entre l'ensemble de formation et l'ensemble de test). Ce benchmark est réalisé indépendamment pour chaque ensemble de données vectorielles, et les résultats sont rapportés séparément.</p></li>
<li><p>Utilisation de Milvus pour construire un index vectoriel pour l'ensemble de données 49K item embeddings et interrogation des 7,3 millions d'utilisateurs uniques par rapport à cet index pour la recherche de similarité.</p></li>
</ol>
<p>Dans ces benchmarks, nous avons utilisé les algorithmes d'indexation IVFPQ et HNSW exécutés sur GPU et CPU, ainsi que diverses combinaisons de paramètres. Les détails sont disponibles <a href="https://github.com/bbozkaya/merlin-milvus/tree/main/results">ici</a>.</p>
<p>Le compromis qualité de la recherche/débit est une considération importante en termes de performances, en particulier dans un environnement de production. Milvus permet un contrôle total des paramètres d'indexation afin d'explorer ce compromis pour un cas d'utilisation donné et d'obtenir de meilleurs résultats de recherche avec la vérité de terrain. Cela peut se traduire par une augmentation des coûts de calcul sous la forme d'une réduction du débit ou du nombre de requêtes par seconde (QPS). Nous mesurons la qualité de la recherche ANN à l'aide d'une métrique de rappel et fournissons des courbes QPS-recall qui démontrent le compromis. Il est alors possible de décider d'un niveau acceptable de qualité de recherche en fonction des ressources de calcul ou des exigences de latence/débit de l'entreprise.</p>
<p>Il convient également de noter la taille du lot de requêtes (nq) utilisée dans nos benchmarks. Cette taille est utile dans les flux de travail où plusieurs requêtes simultanées sont envoyées à l'inférence (par exemple, des recommandations hors ligne demandées et envoyées à une liste de destinataires d'e-mails ou des recommandations en ligne créées en regroupant les requêtes concurrentes qui arrivent et en les traitant toutes en même temps). En fonction du cas d'utilisation, TIS peut également aider à traiter ces demandes par lots.</p>
<h3 id="Results" class="common-anchor-header">Résultats</h3><p>Nous présentons maintenant les résultats pour les trois ensembles de benchmarks sur CPU et GPU, en utilisant les types d'index HNSW (CPU uniquement) et IVF_PQ (CPU et GPU) mis en œuvre par Milvus.</p>
<h4 id="Items-vs-Items-vector-similarity-search" class="common-anchor-header">Recherche de similarité vectorielle Items vs Items</h4><p>Avec ce plus petit ensemble de données, chaque exécution pour une combinaison de paramètres donnée prend 50 % des vecteurs d'éléments comme vecteurs de requête et interroge les 100 vecteurs les plus similaires du reste. HNSW et IVF_PQ produisent un rappel élevé avec les paramètres testés, dans l'intervalle 0,958-1,0 et 0,665-0,997, respectivement. Ce résultat suggère que HNSW est plus performant en termes de rappel, mais que IVF_PQ produit un rappel tout à fait comparable avec des paramètres nlist faibles. Il convient également de noter que les valeurs de rappel peuvent varier considérablement en fonction des paramètres d'indexation et d'interrogation. Les valeurs que nous indiquons ont été obtenues après une expérimentation préliminaire avec des plages de paramètres générales et un zoom plus approfondi sur un sous-ensemble sélectionné.</p>
<p>Le temps total d'exécution de toutes les requêtes sur l'unité centrale avec HNSW pour une combinaison de paramètres donnée se situe entre 5,22 et 5,33 secondes (plus rapide lorsque m est plus grand, relativement inchangé avec ef) et avec IVF_PQ entre 13,67 et 14,67 secondes (plus lent lorsque nlist et nprobe sont plus grands). L'accélération du GPU a un effet notable, comme le montre la figure 3.</p>
<p>La figure 3 montre le compromis rappel-débit sur toutes les exécutions effectuées sur le CPU et le GPU avec ce petit ensemble de données en utilisant IVF_PQ. Nous constatons que le GPU offre une accélération de 4 à 15 fois pour toutes les combinaisons de paramètres testées (l'accélération est d'autant plus importante que nprobe est grand). Ceci est calculé en prenant le ratio des QPS du GPU sur les QPS du CPU pour chaque combinaison de paramètres. Dans l'ensemble, cet ensemble présente peu de difficultés pour le CPU ou le GPU et laisse entrevoir des perspectives d'accélération supplémentaire avec les ensembles de données plus importants, comme nous le verrons plus loin.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GPU_speedup_with_Milvus_IVF_PQ_item_item_d32de8443d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 3. Accélération par le GPU avec l'algorithme Milvus IVF_PQ exécuté sur le GPU NVIDIA A100 (recherche de similarité élément-élément)</em></p>
<h4 id="Users-vs-Users-vector-similarity-search" class="common-anchor-header">Recherche de similarité vectorielle entre utilisateurs et utilisateurs</h4><p>Avec le deuxième ensemble de données beaucoup plus important (7,3 millions d'utilisateurs), nous avons mis de côté 85 % (~6,2 millions) des vecteurs comme "formation" (l'ensemble des vecteurs à indexer), et les 15 % restants (~1,1 million) comme "test" ou ensemble de vecteurs d'interrogation. HNSW et IVF_PQ sont exceptionnellement performants dans ce cas, avec des valeurs de rappel de 0,884-1,0 et 0,922-0,999, respectivement. Ils sont cependant beaucoup plus exigeants en termes de calcul, en particulier IVF_PQ sur l'unité centrale. Le temps total d'exécution de toutes les requêtes sur l'unité centrale avec HNSW varie de 279,89 à 295,56 s et avec IVF_PQ de 3082,67 à 10932,33 s. Notez que ces temps de requête sont cumulés pour 1,1 million de vecteurs interrogés, de sorte que l'on peut dire qu'une seule requête sur l'index est encore très rapide.</p>
<p>Cependant, l'interrogation basée sur le CPU peut ne pas être viable si le serveur d'inférence s'attend à plusieurs milliers de requêtes simultanées pour exécuter des requêtes sur un inventaire de millions d'éléments.</p>
<p>Le GPU A100 permet d'obtenir une accélération fulgurante de 37x à 91x (avec une moyenne de 76,1x) pour toutes les combinaisons de paramètres avec IVF_PQ en termes de débit (QPS), comme le montre la figure 4. Cela correspond à ce que nous avons observé avec le petit ensemble de données, ce qui suggère que les performances du GPU s'adaptent raisonnablement bien à l'utilisation de Milvus avec des millions de vecteurs d'intégration.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GPU_speedup_with_Milvus_IVF_PQ_algorithm_user_user_c91f4e4164.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 4. Accélération du GPU avec l'algorithme Milvus IVF_PQ exécuté sur le GPU NVIDIA A100 (recherche de similarité utilisateur-utilisateur)</em></p>
<p>La figure 5 détaillée ci-dessous montre le compromis rappel-QPS pour toutes les combinaisons de paramètres testées sur le CPU et le GPU avec IVF_PQ. Chaque ensemble de points (en haut pour le GPU, en bas pour le CPU) sur ce graphique représente le compromis auquel on est confronté lorsqu'on modifie les paramètres d'indexation/requête vectorielle pour obtenir un meilleur rappel au détriment d'un débit plus faible. Notez la perte considérable de QPS dans le cas du GPU lorsque l'on tente d'atteindre des niveaux de rappel plus élevés.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Recall_Throughput_tradeoff_519b2289e5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 5. Compromis rappel-débit pour toutes les combinaisons de paramètres testées sur CPU et GPU avec IVF_PQ (utilisateurs vs. utilisateurs)</em></p>
<h4 id="Users-vs-Items-vector-similarity-search" class="common-anchor-header">Utilisateurs contre éléments Recherche de similarité vectorielle</h4><p>Enfin, nous considérons un autre cas d'utilisation réaliste dans lequel les vecteurs d'utilisateurs sont interrogés par rapport aux vecteurs d'éléments (comme démontré dans le bloc-notes 01 ci-dessus). Dans ce cas, 49 000 vecteurs d'éléments sont indexés et 7,3 millions de vecteurs d'utilisateurs sont interrogés sur les 100 éléments les plus similaires.</p>
<p>C'est là que les choses deviennent intéressantes, car l'interrogation de 7,3M par lots de 1000 sur un index de 49K éléments semble prendre beaucoup de temps sur le CPU pour HNSW et IVF_PQ. Le GPU semble mieux gérer ce cas (voir la figure 6). Les niveaux de précision les plus élevés obtenus par IVF_PQ sur le CPU lorsque nlist = 100 sont calculés en 86 minutes en moyenne, mais varient considérablement lorsque la valeur de nprobe augmente (51 min. lorsque nprobe = 5 contre 128 min. lorsque nprobe = 20). Le GPU NVIDIA A100 accélère considérablement les performances d'un facteur de 4x à 17x (les accélérations sont d'autant plus importantes que nprobe est grand). Rappelons que l'algorithme IVF_PQ, grâce à sa technique de quantification, réduit également l'empreinte mémoire et fournit une solution de recherche ANN viable d'un point de vue informatique, combinée à l'accélération du GPU.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GPU_speedup_with_Milvus_IVF_PQ_algorithm_user_item_504462fcc0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 6. Accélération GPU avec l'algorithme Milvus IVF_PQ exécuté sur le GPU NVIDIA A100 (recherche de similarité utilisateur-élément)</em></p>
<p>Comme dans la figure 5, le compromis rappel-débit est illustré dans la figure 7 pour toutes les combinaisons de paramètres testées avec l'algorithme IVF_PQ. Ici, on peut encore constater qu'il est nécessaire de renoncer légèrement à la précision de la recherche ANN au profit d'une augmentation du débit, bien que les différences soient beaucoup moins marquées, en particulier dans le cas des exécutions sur GPU. Cela suggère que l'on peut s'attendre à des niveaux de performance de calcul relativement élevés avec le GPU tout en obtenant un rappel élevé.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Recall_Throughput_tradeoff_user_items_0abce91c5e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 7. Compromis rappel-débit pour toutes les combinaisons de paramètres testées sur CPU et GPU avec IVF_PQ (utilisateurs vs. éléments)</em></p>
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
    </button></h2><p>Si vous êtes arrivés jusqu'ici, nous serions heureux de partager avec vous quelques remarques de conclusion. Nous souhaitons vous rappeler que la complexité de Recsys moderne et sa nature multi-étapes nécessitent des performances et de l'efficacité à chaque étape. Nous espérons que ce blog vous a donné des raisons convaincantes d'envisager l'utilisation de deux fonctions essentielles dans vos pipelines RecSys :</p>
<ul>
<li><p>La bibliothèque Merlin Systems de NVIDIA Merlin vous permet d'intégrer facilement <a href="https://github.com/milvus-io/milvus/tree/2.3.0">Milvus</a>, un moteur de recherche vectorielle efficace accéléré par le GPU.</p></li>
<li><p>Utilisez le GPU pour accélérer les calculs pour l'indexation des bases de données vectorielles et la recherche ANN avec des technologies telles que <a href="https://github.com/rapidsai/raft">RAPIDS RAFT</a>.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/summary_benchmark_results_ae33fbe514.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ces résultats suggèrent que l'intégration Merlin-Milvus présentée est très performante et beaucoup moins complexe que d'autres options pour l'entraînement et l'inférence. En outre, les deux cadres sont activement développés et de nombreuses nouvelles fonctionnalités (par exemple, les nouveaux index de base de données vectorielles accélérés par le GPU de Milvus) sont ajoutées à chaque version. Le fait que la recherche de similarité vectorielle soit un composant crucial dans divers flux de travail, tels que la vision par ordinateur, la modélisation des grands langages et les systèmes de recommandation, rend cet effort d'autant plus utile.</p>
<p>Pour conclure, nous voudrions remercier tous ceux qui, chez Zilliz/Milvus et Merlin et dans les équipes RAFT, ont contribué à l'effort de production de ce travail et de ce billet de blog. Nous attendons avec impatience vos commentaires si vous avez l'occasion de mettre en œuvre Merlin et Milvus dans vos recsys ou d'autres flux de travail.</p>
