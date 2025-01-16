---
id: why-and-when-you-need-a-purpose-built-vector-database.md
title: >-
  Pourquoi et quand avez-vous besoin d'une base de données vectorielle
  spécifique ?
author: James Luan
date: 2023-08-29T00:00:00.000Z
cover: >-
  assets.zilliz.com/Why_you_need_a_real_vector_database2_20230830_075505_1_4b32582c87.png
tag: Engineering
tags: >-
  Vector Database, AI, Artificial Intelligence, Machine Learning, Milvus, LLM,
  Large Language Models, Embeddings, Vector search, Vector similarity search
desc: >-
  Ce billet donne un aperçu de la recherche vectorielle et de son
  fonctionnement, compare les différentes technologies de recherche vectorielle
  et explique pourquoi il est essentiel d'opter pour une base de données
  vectorielles spécialement conçue à cet effet.
recommend: true
canonicalUrl: >-
  https://www.aiacceleratorinstitute.com/why-and-when-do-you-need-a-purpose-built-vector-database/
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Why_you_need_a_real_vector_database2_20230830_075505_1_4b32582c87.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Cet article a été publié à l'origine sur le site de <a href="https://www.aiacceleratorinstitute.com/why-and-when-do-you-need-a-purpose-built-vector-database/">l'AIAI</a> et est reproduit ici avec l'autorisation de l'auteur.</em></p>
<p>La popularité croissante de <a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a> et d'autres grands modèles de langage (LLM) a stimulé l'essor des technologies de recherche vectorielle, y compris les bases de données vectorielles spécifiques telles que <a href="https://milvus.io/docs/overview.md">Milvus</a> et <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, les bibliothèques de recherche vectorielle telles que <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a> et les plugins de recherche vectorielle intégrés aux bases de données traditionnelles. Cependant, le choix de la solution la mieux adaptée à vos besoins peut s'avérer difficile. Tout comme le choix entre un restaurant haut de gamme et une chaîne de restauration rapide, la sélection de la bonne technologie de recherche vectorielle dépend de vos besoins et de vos attentes.</p>
<p>Dans cet article, je vais donner un aperçu de la recherche vectorielle et de son fonctionnement, comparer différentes technologies de recherche vectorielle et expliquer pourquoi il est crucial d'opter pour une base de données vectorielle spécialement conçue à cet effet.</p>
<h2 id="What-is-vector-search-and-how-does-it-work" class="common-anchor-header">Qu'est-ce que la recherche vectorielle et comment fonctionne-t-elle ?<button data-href="#What-is-vector-search-and-how-does-it-work" class="anchor-icon" translate="no">
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
    </button></h2><p>La<a href="https://zilliz.com/blog/vector-similarity-search">recherche vectorielle</a>, également connue sous le nom de recherche de similarité vectorielle, est une technique permettant d'extraire les k premiers résultats les plus similaires ou sémantiquement liés à un vecteur d'interrogation donné parmi une vaste collection de données vectorielles denses.</p>
<p>Avant d'effectuer des recherches de similarité, nous utilisons des réseaux neuronaux pour transformer des <a href="https://zilliz.com/blog/introduction-to-unstructured-data">données non structurées</a>, telles que du texte, des images, des vidéos et des sons, en vecteurs numériques à haute dimension appelés vecteurs d'intégration. Par exemple, nous pouvons utiliser le réseau neuronal convolutionnel ResNet-50 pré-entraîné pour transformer une image d'oiseau en une collection de vecteurs d'intégration à 2 048 dimensions. Nous énumérons ici les trois premiers et les trois derniers éléments du vecteur : <code translate="no">[0.1392, 0.3572, 0.1988, ..., 0.2888, 0.6611, 0.2909]</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/bird_image_4a1be18f99.png" alt="A bird image by Patrice Bouchard" class="doc-image" id="a-bird-image-by-patrice-bouchard" />
   </span> <span class="img-wrapper"> <span>Image d'un oiseau par Patrice Bouchard</span> </span></p>
<p>Après avoir généré des vecteurs d'intégration, les moteurs de recherche vectorielle comparent la distance spatiale entre le vecteur d'entrée de la requête et les vecteurs dans les magasins de vecteurs. Plus ils sont proches dans l'espace, plus ils sont similaires.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_3732_20230510_073643_25f985523e.png" alt="Embedding arithmetic" class="doc-image" id="embedding-arithmetic" />
   </span> <span class="img-wrapper"> <span>Arithmétique d'intégration</span> </span></p>
<h2 id="Popular-vector-search-technologies" class="common-anchor-header">Technologies de recherche vectorielle populaires<button data-href="#Popular-vector-search-technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>De nombreuses technologies de recherche vectorielle sont disponibles sur le marché, notamment des bibliothèques d'apprentissage automatique comme NumPy de Python, des bibliothèques de recherche vectorielle comme FAISS, des plugins de recherche vectorielle construits sur des bases de données traditionnelles et des bases de données vectorielles spécialisées comme Milvus et Zilliz Cloud.</p>
<h3 id="Machine-learning-libraries" class="common-anchor-header">Bibliothèques d'apprentissage automatique</h3><p>L'utilisation de bibliothèques d'apprentissage automatique est le moyen le plus simple de mettre en œuvre des recherches vectorielles. Par exemple, nous pouvons utiliser NumPy de Python pour mettre en œuvre un algorithme du plus proche voisin en moins de 20 lignes de code.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np

<span class="hljs-comment"># Function to calculate euclidean distance</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">euclidean_distance</span>(<span class="hljs-params">a, b</span>):
<span class="hljs-keyword">return</span> np.linalg.norm(a - b)

<span class="hljs-comment"># Function to perform knn</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">knn</span>(<span class="hljs-params">data, target, k</span>):
<span class="hljs-comment"># Calculate distances between target and all points in the data</span>
distances = [euclidean_distance(d, target) <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> data]
<span class="hljs-comment"># Combine distances with data indices</span>
distances = np.array(<span class="hljs-built_in">list</span>(<span class="hljs-built_in">zip</span>(distances, np.arange(<span class="hljs-built_in">len</span>(data)))))

<span class="hljs-comment"># Sort by distance</span>
sorted_distances = distances[distances[:, <span class="hljs-number">0</span>].argsort()]

<span class="hljs-comment"># Get the top k closest indices</span>
closest_k_indices = sorted_distances[:k, <span class="hljs-number">1</span>].astype(<span class="hljs-built_in">int</span>)

<span class="hljs-comment"># Return the top k closest vectors</span>
<span class="hljs-keyword">return</span> data[closest_k_indices]
<button class="copy-code-btn"></button></code></pre>
<p>Nous pouvons générer 100 vecteurs bidimensionnels et trouver le plus proche voisin du vecteur [0,5, 0,5].</p>
<pre><code translate="no"><span class="hljs-comment"># Define some 2D vectors</span>
data = np.random.rand(<span class="hljs-number">100</span>, <span class="hljs-number">2</span>)

<span class="hljs-comment"># Define a target vector</span>
target = np.array([<span class="hljs-number">0.5</span>, <span class="hljs-number">0.5</span>])

<span class="hljs-comment"># Define k</span>
k = <span class="hljs-number">3</span>

<span class="hljs-comment"># Perform knn</span>
closest_vectors = knn(data, target, k)

<span class="hljs-comment"># Print the result</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;The closest vectors are:&quot;</span>)
<span class="hljs-built_in">print</span>(closest_vectors)
<button class="copy-code-btn"></button></code></pre>
<p>Les bibliothèques d'apprentissage automatique, telles que NumPy de Python, offrent une grande flexibilité à un faible coût. Cependant, elles présentent certaines limites. Par exemple, elles ne peuvent traiter qu'une petite quantité de données et ne garantissent pas la persistance des données.</p>
<p>Je recommande d'utiliser NumPy ou d'autres bibliothèques d'apprentissage automatique pour la recherche vectorielle uniquement dans les cas suivants :</p>
<ul>
<li>Vous avez besoin d'un prototypage rapide.</li>
<li>Vous ne vous souciez pas de la persistance des données.</li>
<li>La taille de vos données est inférieure à un million, et vous n'avez pas besoin de filtrage scalaire.</li>
<li>Vous n'avez pas besoin de performances élevées.</li>
</ul>
<h3 id="Vector-search-libraries" class="common-anchor-header">Bibliothèques de recherche vectorielle</h3><p>Les bibliothèques de recherche vectorielle peuvent vous aider à construire rapidement un prototype de système de recherche vectorielle très performant. FAISS en est un exemple typique. Il s'agit d'un logiciel libre développé par Meta pour la recherche efficace de similarités et le regroupement de vecteurs denses. FAISS peut traiter des collections de vecteurs de toute taille, même celles qui ne peuvent pas être entièrement chargées en mémoire. En outre, FAISS offre des outils d'évaluation et de réglage des paramètres. Bien qu'écrit en C++, FAISS fournit une interface Python/NumPy.</p>
<p>Vous trouverez ci-dessous le code d'un exemple de recherche vectorielle basé sur FAISS :</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> faiss

<span class="hljs-comment"># Generate some example data</span>
dimension = <span class="hljs-number">64</span> <span class="hljs-comment"># dimension of the vector space</span>
database_size = <span class="hljs-number">10000</span> <span class="hljs-comment"># size of the database</span>
query_size = <span class="hljs-number">100</span> <span class="hljs-comment"># number of queries to perform</span>
np.random.seed(<span class="hljs-number">123</span>) <span class="hljs-comment"># make the random numbers predictable</span>

<span class="hljs-comment"># Generating vectors to index in the database (db_vectors)</span>
db_vectors = np.random.random((database_size, dimension)).astype(<span class="hljs-string">&#x27;float32&#x27;</span>)

<span class="hljs-comment"># Generating vectors for query (query_vectors)</span>
query_vectors = np.random.random((query_size, dimension)).astype(<span class="hljs-string">&#x27;float32&#x27;</span>)

<span class="hljs-comment"># Building the index</span>
index = faiss.IndexFlatL2(dimension) <span class="hljs-comment"># using the L2 distance metric</span>
<span class="hljs-built_in">print</span>(index.is_trained) <span class="hljs-comment"># should return True</span>

<span class="hljs-comment"># Adding vectors to the index</span>
index.add(db_vectors)
<span class="hljs-built_in">print</span>(index.ntotal) <span class="hljs-comment"># should return database_size (10000)</span>

<span class="hljs-comment"># Perform a search</span>
k = <span class="hljs-number">4</span> <span class="hljs-comment"># we want to see 4 nearest neighbors</span>
distances, indices = index.search(query_vectors, k)

<span class="hljs-comment"># Print the results</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Indices of nearest neighbors: \n&quot;</span>, indices)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nL2 distances to the nearest neighbors: \n&quot;</span>, distances)
<button class="copy-code-btn"></button></code></pre>
<p>Les bibliothèques de recherche vectorielle telles que FAISS sont faciles à utiliser et suffisamment rapides pour gérer des environnements de production à petite échelle avec des millions de vecteurs. Vous pouvez améliorer les performances de leurs requêtes en utilisant la quantification et les GPU et en réduisant les dimensions des données.</p>
<p>Toutefois, ces bibliothèques présentent certaines limites lorsqu'elles sont utilisées en production. Par exemple, FAISS ne prend pas en charge l'ajout et la suppression de données en temps réel, les appels à distance, les langues multiples, le filtrage scalaire, l'évolutivité ou la reprise après sinistre.</p>
<h3 id="Different-types-of-vector-databases" class="common-anchor-header">Différents types de bases de données vectorielles</h3><p>Les bases de données vectorielles sont apparues pour pallier les limites des bibliothèques susmentionnées et fournir une solution plus complète et plus pratique pour les applications de production.</p>
<p>Quatre types de bases de données vectorielles sont disponibles sur le champ de bataille :</p>
<ul>
<li>Les bases de données relationnelles ou en colonnes existantes qui intègrent un plugin de recherche vectorielle. PG Vector en est un exemple.</li>
<li>Les moteurs de recherche traditionnels à index inversé avec prise en charge de l'indexation vectorielle dense. <a href="https://zilliz.com/comparison/elastic-vs-milvus">ElasticSearch</a> en est un exemple.</li>
<li>Bases de données vectorielles légères construites sur des bibliothèques de recherche vectorielle. Chroma en est un exemple.</li>
<li><strong>Les bases de données vectorielles conçues à cet effet</strong>. Ce type de base de données est spécifiquement conçu et optimisé pour la recherche vectorielle de bas en haut. Les bases de données vectorielles conçues à cet effet offrent généralement des fonctionnalités plus avancées, notamment l'informatique distribuée, la reprise après sinistre et la persistance des données. <a href="https://zilliz.com/what-is-milvus">Milvus</a> en est un bon exemple.</li>
</ul>
<p>Toutes les bases de données vectorielles ne se valent pas. Chaque pile présente des avantages et des limites uniques, ce qui la rend plus ou moins adaptée à différentes applications.</p>
<p>Je préfère les bases de données vectorielles spécialisées aux autres solutions car elles constituent l'option la plus efficace et la plus pratique, offrant de nombreux avantages uniques. Dans les sections suivantes, j'utiliserai Milvus comme exemple pour expliquer les raisons de ma préférence.</p>
<h2 id="Key-benefits-of-purpose-built-vector-databases" class="common-anchor-header">Principaux avantages des bases de données vectorielles spécifiques<button data-href="#Key-benefits-of-purpose-built-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a> est une base de données vectorielles à code source ouvert, distribuée et conçue à cet effet, qui peut stocker, indexer, gérer et récupérer des milliards de vecteurs d'intégration. C'est également l'une des bases de données vectorielles les plus populaires pour la <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">génération augmentée de recherche LLM</a>. En tant qu'exemple de bases de données vectorielles construites à cet effet, Milvus partage de nombreux avantages uniques avec ses homologues.</p>
<h3 id="Data-Persistence-and-Cost-Effective-Storage" class="common-anchor-header">Persistance des données et stockage rentable</h3><p>Bien que la prévention de la perte de données soit l'exigence minimale pour une base de données, de nombreuses bases de données vectorielles légères et à machine unique n'accordent pas la priorité à la fiabilité des données. En revanche, les bases de données vectorielles distribuées spécialement conçues, comme <a href="https://zilliz.com/what-is-milvus">Milvus</a>, donnent la priorité à la résilience du système, à l'évolutivité et à la persistance des données en séparant le stockage et le calcul.</p>
<p>En outre, la plupart des bases de données vectorielles qui utilisent des index approximatifs du plus proche voisin (ANN) ont besoin de beaucoup de mémoire pour effectuer des recherches vectorielles, car elles chargent les index ANN uniquement dans la mémoire. Cependant, Milvus prend en charge les index sur disque, ce qui rend le stockage dix fois plus rentable que les index en mémoire.</p>
<h3 id="Optimal-Query-Performance" class="common-anchor-header">Performances optimales des requêtes</h3><p>Une base de données vectorielle spécialisée offre des performances de requête optimales par rapport aux autres options de recherche vectorielle. Par exemple, Milvus traite les requêtes dix fois plus rapidement que les plugins de recherche vectorielle. Milvus utilise l'algorithme <a href="https://zilliz.com/glossary/anns">ANN</a> au lieu de l'algorithme de recherche brutale KNN pour une recherche vectorielle plus rapide. En outre, il divise ses index, ce qui réduit le temps nécessaire à la construction d'un index lorsque le volume de données augmente. Cette approche permet à Milvus de gérer facilement des milliards de vecteurs avec des ajouts et des suppressions de données en temps réel. En revanche, les autres modules complémentaires de recherche vectorielle ne conviennent qu'aux scénarios comportant moins de dizaines de millions de données et des ajouts et suppressions peu fréquents.</p>
<p>Milvus prend également en charge l'accélération GPU. Des tests internes montrent que l'indexation vectorielle accélérée par le GPU peut atteindre plus de 10 000 QPS lors de la recherche de dizaines de millions de données, ce qui est au moins dix fois plus rapide que l'indexation CPU traditionnelle pour les performances des requêtes sur une seule machine.</p>
<h3 id="System-Reliability" class="common-anchor-header">Fiabilité du système</h3><p>De nombreuses applications utilisent des bases de données vectorielles pour des requêtes en ligne qui nécessitent une faible latence et un débit élevé. Ces applications exigent un basculement sur une seule machine au niveau de la minute, et certaines requièrent même une reprise après sinistre interrégionale pour les scénarios critiques. Les stratégies de réplication traditionnelles basées sur Raft/Paxos souffrent d'un gaspillage important de ressources et ont besoin d'aide pour pré-partager les données, ce qui conduit à une fiabilité médiocre. En revanche, Milvus possède une architecture distribuée qui exploite les files d'attente de messages K8s pour une haute disponibilité, ce qui réduit le temps de reprise et économise les ressources.</p>
<h3 id="Operability-and-Observability" class="common-anchor-header">Exploitabilité et observabilité</h3><p>Pour mieux servir les utilisateurs professionnels, les bases de données vectorielles doivent offrir une gamme de fonctionnalités de niveau professionnel pour une meilleure opérabilité et observabilité. Milvus prend en charge plusieurs méthodes de déploiement, notamment K8s Operator et Helm chart, docker-compose et pip install, ce qui le rend accessible aux utilisateurs ayant des besoins différents. Milvus fournit également un système de surveillance et d'alarme basé sur Grafana, Prometheus et Loki, améliorant ainsi son observabilité. Avec une architecture cloud-native distribuée, Milvus est la première base de données vectorielle du secteur à prendre en charge l'isolation multi-tenant, le RBAC, la limitation des quotas et les mises à niveau glissantes. Toutes ces approches simplifient considérablement la gestion et la surveillance de Milvus.</p>
<h2 id="Getting-started-with-Milvus-in-3-simple-steps-within-10-minutes" class="common-anchor-header">Démarrer avec Milvus en 3 étapes simples en 10 minutes<button data-href="#Getting-started-with-Milvus-in-3-simple-steps-within-10-minutes" class="anchor-icon" translate="no">
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
    </button></h2><p>Construire une base de données vectorielle est une tâche complexe, mais en utiliser une est aussi simple que d'utiliser Numpy et FAISS. Même les étudiants peu familiarisés avec l'IA peuvent mettre en œuvre la recherche vectorielle basée sur Milvus en seulement dix minutes. Pour bénéficier de services de recherche vectorielle hautement évolutifs et performants, suivez les trois étapes suivantes :</p>
<ul>
<li>Déployez Milvus sur votre serveur à l'aide du <a href="https://milvus.io/docs/install_standalone-docker.md">document de déploiement Milvus</a>.</li>
<li>Mettez en œuvre la recherche vectorielle avec seulement 50 lignes de code en vous référant au <a href="https://milvus.io/docs/example_code.md">document Hello Milvus</a>.</li>
<li>Explorez les <a href="https://github.com/towhee-io/examples/">documents d'exemple de Towhee</a> pour vous faire une idée des <a href="https://zilliz.com/use-cases">cas d'utilisation</a> les plus courants <a href="https://zilliz.com/use-cases">des bases de données vectorielles</a>.</li>
</ul>
