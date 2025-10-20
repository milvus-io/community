---
id: >-
  vllm-semantic-router-milvus-how-semantic-routing-and-caching-scale-ai-systems-the-smart-way.md
title: >-
  Routeur sémantique vLLM + Milvus : Comment le routage sémantique et la mise en
  cache permettent de construire des systèmes d'IA évolutifs de manière
  intelligente
author: Min Yin
date: 2025-10-17T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Oct_19_2025_04_30_18_PM_af7fda1170.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, semantic routing, cache layer, vector database, vllm semantic router'
meta_title: Scale Your AI Apps the Smart Way with vLLM Semantic Router and Milvus
desc: >-
  Découvrez comment vLLM, Milvus et le routage sémantique optimisent l'inférence
  de grands modèles, réduisent les coûts de calcul et augmentent les
  performances de l'IA dans des déploiements évolutifs.
origin: >-
  https://milvus.io/blog/vllm-semantic-router-milvus-how-semantic-routing-and-caching-scale-ai-systems-the-smart-way.md
---
<p>La plupart des applications d'IA s'appuient sur un modèle unique pour chaque demande. Mais cette approche se heurte rapidement à des limites. Les grands modèles sont puissants mais coûteux, même lorsqu'ils sont utilisés pour des requêtes simples. Les modèles plus petits sont moins chers et plus rapides, mais ne peuvent pas gérer les raisonnements complexes. Lorsque le trafic augmente, par exemple lorsque votre application d'IA devient soudainement virale avec dix millions d'utilisateurs du jour au lendemain, l'inefficacité de cette configuration "un modèle pour tous" devient douloureusement évidente. La latence monte en flèche, les factures de GPU explosent et le modèle qui fonctionnait bien hier commence à manquer d'air.</p>
<p>Et mon ami, <em>vous</em>, l'ingénieur à l'origine de cette application, devez y remédier - rapidement.</p>
<p>Imaginez que vous puissiez déployer plusieurs modèles de tailles différentes et que votre système sélectionne automatiquement le meilleur pour chaque requête. Les demandes simples sont dirigées vers des modèles plus petits ; les demandes complexes sont dirigées vers des modèles plus grands. C'est l'idée qui sous-tend le <a href="https://github.com/vllm-project/semantic-router"><strong>routeur sémantique de vLLM, un</strong></a>mécanisme de routage qui dirige les requêtes en fonction de leur signification, et non de leurs points d'extrémité. Il analyse le contenu sémantique, la complexité et l'intention de chaque entrée pour sélectionner le modèle linguistique le plus approprié, garantissant ainsi que chaque requête est traitée par le modèle le mieux adapté.</p>
<p>Pour rendre ce processus encore plus efficace, le routeur sémantique est associé à <a href="https://milvus.io/"><strong>Milvus</strong></a>, une base de données vectorielles open-source qui sert de <strong>couche de cache sémantique</strong>. Avant de recalculer une réponse, il vérifie si une requête sémantiquement similaire a déjà été traitée et, le cas échéant, récupère instantanément le résultat mis en cache. Résultat : des réponses plus rapides, des coûts réduits et un système de recherche qui évolue intelligemment plutôt qu'en pure perte.</p>
<p>Dans ce billet, nous allons approfondir le fonctionnement du <strong>routeur sémantique vLLM</strong>, la façon dont <strong>Milvus</strong> alimente sa couche de mise en cache et la manière dont cette architecture peut être appliquée dans des applications d'IA du monde réel.</p>
<h2 id="What-is-a-Semantic-Router" class="common-anchor-header">Qu'est-ce qu'un routeur sémantique ?<button data-href="#What-is-a-Semantic-Router" class="anchor-icon" translate="no">
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
    </button></h2><p>À la base, un <strong>routeur sémantique</strong> est un système qui décide <em>quel modèle</em> doit traiter une demande donnée en fonction de sa signification, de sa complexité et de son intention. Au lieu de tout acheminer vers un seul modèle, il répartit intelligemment les demandes entre plusieurs modèles afin d'équilibrer la précision, la latence et le coût.</p>
<p>L'architecture repose sur trois couches clés : Le <strong>routage sémantique</strong>, le <strong>mélange de modèles (MoM)</strong> et une <strong>couche de cache</strong>.</p>
<h3 id="Semantic-Routing-Layer" class="common-anchor-header">Couche de routage sémantique</h3><p>La <strong>couche de routage sémantique</strong> est le cerveau du système. Elle analyse chaque entrée - ce qu'elle demande, sa complexité et le type de raisonnement qu'elle requiert - afin de sélectionner le modèle le mieux adapté à la tâche. Par exemple, une simple recherche de faits peut être dirigée vers un modèle léger, tandis qu'une requête de raisonnement en plusieurs étapes est acheminée vers un modèle plus important. Ce routage dynamique permet au système de rester réactif même si le trafic et la diversité des requêtes augmentent.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/modern_approach_714403b61c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Mixture-of-Models-MoM-Layer" class="common-anchor-header">La couche de mélange de modèles (MoM)</h3><p>La deuxième couche, le <strong>mélange de modèles (MoM)</strong>, intègre plusieurs modèles de tailles et de capacités différentes dans un système unifié. Elle s'inspire de l'architecture <a href="https://zilliz.com/learn/what-is-mixture-of-experts"><strong>Mixture of Experts</strong></a> <strong>(MoE</strong> ), mais au lieu de sélectionner des "experts" au sein d'un seul grand modèle, elle opère sur plusieurs modèles indépendants. Cette conception permet de réduire les temps de latence et les coûts, et d'éviter d'être enfermé dans un fournisseur de modèle unique.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/MOM_0a3eb61985.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Cache-Layer-Where-Milvus-Makes-the-Difference" class="common-anchor-header">La couche de mise en cache : Là où Milvus fait la différence</h3><p>Enfin, la <strong>couche de cache, alimentée</strong>par <a href="https://milvus.io/">Milvus Vector Database, agit</a>comme la mémoire du système. Avant d'exécuter une nouvelle requête, elle vérifie si une requête sémantiquement similaire a déjà été traitée. Si c'est le cas, elle récupère instantanément le résultat mis en cache, ce qui permet d'économiser du temps de calcul et d'améliorer le débit.</p>
<p>Les systèmes de mise en cache traditionnels s'appuient sur des magasins clé-valeur en mémoire, en faisant correspondre les requêtes à des chaînes de caractères exactes ou à des modèles. Cela fonctionne bien lorsque les requêtes sont répétitives et prévisibles. Mais les utilisateurs réels tapent rarement deux fois la même chose. Dès que la formulation change, même légèrement, le cache ne reconnaît pas la même intention. Au fil du temps, le taux de réussite du cache diminue et les gains de performance disparaissent au fur et à mesure que le langage dérive naturellement.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/semantic_caching_for_vllm_routing_df889058c9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pour remédier à ce problème, nous avons besoin d'une mémoire cache qui comprenne le <em>sens</em>, et pas seulement la correspondance des mots. C'est là qu'intervient la <strong>récupération sémantique</strong>. Au lieu de comparer des chaînes de caractères, elle compare des représentations vectorielles à haute dimension qui capturent la similarité sémantique. La difficulté réside toutefois dans l'échelle. L'exécution d'une recherche brute sur des millions ou des milliards de vecteurs sur une seule machine (avec une complexité temporelle O(N-d)) est prohibitive sur le plan du calcul. Les coûts de mémoire explosent, l'évolutivité horizontale s'effondre et le système a du mal à gérer les pics de trafic soudains ou les requêtes à longue traîne.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_routing_system_5837b93074.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>En tant que base de données vectorielle distribuée conçue pour la recherche sémantique à grande échelle, <strong>Milvus</strong> apporte l'évolutivité horizontale et la tolérance aux pannes dont cette couche de cache a besoin. Elle stocke efficacement les embeddings entre les nœuds et effectue des recherches par <a href="https://zilliz.com/blog/ANN-machine-learning">voisinage approximatif</a>(ANN) avec une latence minimale, même à grande échelle. Avec les seuils de similarité et les stratégies de repli appropriés, Milvus garantit des performances stables et prévisibles, transformant la couche de cache en une mémoire sémantique résiliente pour l'ensemble de votre système de routage.</p>
<h2 id="How-Developers-Are-Using-Semantic-Router-+-Milvus-in-Production" class="common-anchor-header">Comment les développeurs utilisent Semantic Router + Milvus en production<button data-href="#How-Developers-Are-Using-Semantic-Router-+-Milvus-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>La combinaison de <strong>vLLM Semantic Router</strong> et de <strong>Milvus</strong> brille dans les environnements de production réels où la vitesse, le coût et la réutilisation sont importants.</p>
<p>Trois scénarios courants se distinguent :</p>
<h3 id="1-Customer-Service-QA" class="common-anchor-header">1. Service client Q&amp;R</h3><p>Les robots en contact avec la clientèle traitent chaque jour d'énormes volumes de requêtes répétitives : réinitialisation de mots de passe, mises à jour de comptes, état des livraisons. Ce domaine est à la fois sensible au coût et à la latence, ce qui le rend idéal pour le routage sémantique. Le routeur envoie les questions courantes à des modèles plus petits et plus rapides et transmet les questions complexes ou ambiguës à des modèles plus grands pour un raisonnement plus approfondi. Entre-temps, Milvus met en cache les paires de questions-réponses précédentes, de sorte que lorsque des requêtes similaires apparaissent, le système peut instantanément réutiliser les réponses antérieures au lieu de les régénérer.</p>
<h3 id="2-Code-Assistance" class="common-anchor-header">2. Assistance au code</h3><p>Dans les outils de développement ou les assistants IDE, de nombreuses requêtes se chevauchent : aide à la syntaxe, recherche d'API, petits conseils de débogage. En analysant la structure sémantique de chaque requête, le routeur sélectionne dynamiquement un modèle de taille appropriée : léger pour les tâches simples, plus performant pour les raisonnements à plusieurs étapes. Milvus améliore encore la réactivité en mettant en cache les problèmes de codage similaires et leurs solutions, transformant ainsi les interactions antérieures de l'utilisateur en une base de connaissances réutilisable.</p>
<h3 id="3-Enterprise-Knowledge-Base" class="common-anchor-header">3. Base de connaissances d'entreprise</h3><p>Les requêtes d'entreprise ont tendance à se répéter au fil du temps - consultations de politiques, références de conformité, FAQ sur les produits. Avec Milvus comme couche de cache sémantique, les questions fréquemment posées et leurs réponses peuvent être stockées et récupérées efficacement. Cela permet de minimiser les calculs redondants tout en assurant la cohérence des réponses entre les départements et les régions.</p>
<p>Sous le capot, le pipeline <strong>Semantic Router + Milvus</strong> est implémenté en <strong>Go</strong> et <strong>Rust</strong> pour de hautes performances et une faible latence. Intégré à la couche passerelle, il surveille en permanence les mesures clés, telles que les taux de réussite, la latence du routage et les performances du modèle, afin d'affiner les stratégies de routage en temps réel.</p>
<h2 id="How-to-Quickly-Test-the-Semantic-Caching-in-the-Semantic-Router" class="common-anchor-header">Comment tester rapidement la mise en cache sémantique dans le routeur sémantique ?<button data-href="#How-to-Quickly-Test-the-Semantic-Caching-in-the-Semantic-Router" class="anchor-icon" translate="no">
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
    </button></h2><p>Avant de déployer la mise en cache sémantique à grande échelle, il est utile de valider son comportement dans une configuration contrôlée. Dans cette section, nous allons effectuer un test local rapide qui montre comment le routeur sémantique utilise <strong>Milvus</strong> comme cache sémantique. Vous verrez que les requêtes similaires sont instantanément prises en compte dans le cache, tandis que les requêtes nouvelles ou distinctes déclenchent la génération d'un modèle, ce qui prouve que la logique de mise en cache est en action.</p>
<h3 id="Prerequisites" class="common-anchor-header">Conditions préalables</h3><ul>
<li>Environnement de conteneurs : Docker + Docker Compose</li>
<li>Base de données vectorielle : Milvus Service</li>
<li>LLM + Embedding : Projet téléchargé localement</li>
</ul>
<h3 id="1Deploy-the-Milvus-Vector-Database" class="common-anchor-header">1. déployer la base de données vectorielle Milvus</h3><p>Télécharger les fichiers de déploiement</p>
<pre><code translate="no">wget https://github.com/Milvus-io/Milvus/releases/download/v2.5.12/Milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>Démarrer le service Milvus.</p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Start_the_Milvus_service_211f8b11f1.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Clone-the-project" class="common-anchor-header">2. Cloner le projet</h3><pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/vllm-project/semantic-router.git
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Download-local-models" class="common-anchor-header">3. Télécharger les modèles locaux</h3><pre><code translate="no"><span class="hljs-built_in">cd</span> semantic-router
make download-models
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Download_local_models_6243011fa5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="4-Configuration-Modifications" class="common-anchor-header">4. Modifications de la configuration</h3><p>Note : Modifier le type semantic_cache en milvus</p>
<pre><code translate="no">vim config.yaml
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">semantic_cache:
  enabled: true
  backend_type: <span class="hljs-string">&quot;milvus&quot;</span>  <span class="hljs-comment"># Options: &quot;memory&quot; or &quot;milvus&quot;</span>
  backend_config_path: <span class="hljs-string">&quot;config/cache/milvus.yaml&quot;</span>
  similarity_threshold: <span class="hljs-number">0.8</span>
  max_entries: <span class="hljs-number">1000</span>  <span class="hljs-comment"># Only applies to memory backend</span>
  ttl_seconds: <span class="hljs-number">3600</span>
  eviction_policy: <span class="hljs-string">&quot;fifo&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Modifier la configuration de Milvus Note : Remplir le service Milvusmilvus qui vient d'être déployé</p>
<pre><code translate="no">vim milvus.yaml
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Milvus connection settings</span>
connection:
  <span class="hljs-comment"># Milvus server host (change for production deployment)</span>
  host: <span class="hljs-string">&quot;192.168.7.xxx&quot;</span>  <span class="hljs-comment"># For production: use your Milvus cluster endpoint</span>
  <span class="hljs-comment"># Milvus server port</span>
  port: <span class="hljs-number">19530</span>  <span class="hljs-comment"># Standard Milvus port</span>
  <span class="hljs-comment"># Database name (optional, defaults to &quot;default&quot;)</span>
  database: <span class="hljs-string">&quot;default&quot;</span>
  <span class="hljs-comment"># Connection timeout in seconds</span>
  timeout: <span class="hljs-number">30</span>
  <span class="hljs-comment"># Authentication (enable for production)</span>
  auth:
    enabled: false  <span class="hljs-comment"># Set to true for production</span>
    username: <span class="hljs-string">&quot;&quot;</span>    <span class="hljs-comment"># Your Milvus username</span>
    password: <span class="hljs-string">&quot;&quot;</span>    <span class="hljs-comment"># Your Milvus password</span>
  <span class="hljs-comment"># TLS/SSL configuration (recommended for production)</span>
  tls:
    enabled: false      <span class="hljs-comment"># Set to true for secure connections</span>
    cert_file: <span class="hljs-string">&quot;&quot;</span>       <span class="hljs-comment"># Path to client certificate</span>
    key_file: <span class="hljs-string">&quot;&quot;</span>        <span class="hljs-comment"># Path to client private key</span>
    ca_file: <span class="hljs-string">&quot;&quot;</span>         <span class="hljs-comment"># Path to CA certificate</span>
<span class="hljs-comment"># Collection settings</span>
collection:
  <span class="hljs-comment"># Name of the collection to store cache entries</span>
  name: <span class="hljs-string">&quot;semantic_cache&quot;</span>
  <span class="hljs-comment"># Description of the collection</span>
  description: <span class="hljs-string">&quot;Semantic cache for LLM request-response pairs&quot;</span>
  <span class="hljs-comment"># Vector field configuration</span>
  vector_field:
    <span class="hljs-comment"># Name of the vector field</span>
    name: <span class="hljs-string">&quot;embedding&quot;</span>
    <span class="hljs-comment"># Dimension of the embeddings (auto-detected from model at runtime)</span>
    dimension: <span class="hljs-number">384</span>  <span class="hljs-comment"># This value is ignored - dimension is auto-detected from the embedding model</span>
    <span class="hljs-comment"># Metric type for similarity calculation</span>
    metric_type: <span class="hljs-string">&quot;IP&quot;</span>  <span class="hljs-comment"># Inner Product (cosine similarity for normalized vectors)</span>
  <span class="hljs-comment"># Index configuration for the vector field</span>
  index:
    <span class="hljs-comment"># Index type (HNSW is recommended for most use cases)</span>
    <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;HNSW&quot;</span>
    <span class="hljs-comment"># Index parameters</span>
    params:
      M: <span class="hljs-number">16</span>              <span class="hljs-comment"># Number of bi-directional links for each node</span>
      efConstruction: <span class="hljs-number">64</span>  <span class="hljs-comment"># Search scope during index construction</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Start-the-project" class="common-anchor-header">5. Démarrer le projet</h3><p>Note : Il est recommandé de modifier certaines dépendances de Dockerfile pour les sources domestiques.</p>
<pre><code translate="no">docker compose --profile testing up --build
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Start_the_project_4e7c2a8332.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="6-Test-Requests" class="common-anchor-header">6. Tester les requêtes</h3><p>Note : Deux requêtes au total (pas de cache et cache hit) Première requête :</p>
<pre><code translate="no"><span class="hljs-built_in">echo</span> <span class="hljs-string">&quot;=== 第一次请求（无缓存状态） ===&quot;</span> &amp;&amp; \
<span class="hljs-keyword">time</span> curl -X POST http://localhost:8801/v1/chat/completions \
  -H <span class="hljs-string">&quot;Content-Type: application/json&quot;</span> \
  -H <span class="hljs-string">&quot;Authorization: Bearer test-token&quot;</span> \
  -d <span class="hljs-string">&#x27;{
    &quot;model&quot;: &quot;auto&quot;,
    &quot;messages&quot;: [
      {&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;You are a helpful assistant.&quot;},
      {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;What are the main renewable energy sources?&quot;}
    ],
    &quot;temperature&quot;: 0.7
  }&#x27;</span> | jq .
<button class="copy-code-btn"></button></code></pre>
<p>Sortie :</p>
<pre><code translate="no"><span class="hljs-built_in">real</span>    <span class="hljs-number">0</span>m16<span class="hljs-number">.546</span>s
user    <span class="hljs-number">0</span>m0<span class="hljs-number">.116</span>s
sys     <span class="hljs-number">0</span>m0<span class="hljs-number">.033</span>s
<button class="copy-code-btn"></button></code></pre>
<p>Deuxième requête :</p>
<pre><code translate="no"><span class="hljs-built_in">echo</span> <span class="hljs-string">&quot;=== 第二次请求（缓存状态） ===&quot;</span> &amp;&amp; \
<span class="hljs-keyword">time</span> curl -X POST http://localhost:8801/v1/chat/completions \
  -H <span class="hljs-string">&quot;Content-Type: application/json&quot;</span> \
  -H <span class="hljs-string">&quot;Authorization: Bearer test-token&quot;</span> \
  -d <span class="hljs-string">&#x27;{
    &quot;model&quot;: &quot;auto&quot;,
    &quot;messages&quot;: [
      {&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;You are a helpful assistant.&quot;},
      {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;What are the main renewable energy sources?&quot;}
    ],
    &quot;temperature&quot;: 0.7
  }&#x27;</span> | jq .
<button class="copy-code-btn"></button></code></pre>
<p>Sortie :</p>
<pre><code translate="no"><span class="hljs-built_in">real</span>    <span class="hljs-number">0</span>m2<span class="hljs-number">.393</span>s
user    <span class="hljs-number">0</span>m0<span class="hljs-number">.116</span>s
sys     <span class="hljs-number">0</span>m0<span class="hljs-number">.021</span>s
<button class="copy-code-btn"></button></code></pre>
<p>Ce test démontre la mise en cache sémantique de Semantic Router en action. En exploitant Milvus comme base de données vectorielle, il fait correspondre efficacement les requêtes sémantiquement similaires, améliorant ainsi les temps de réponse lorsque les utilisateurs posent des questions identiques ou similaires.</p>
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
    </button></h2><p>Alors que les charges de travail d'IA augmentent et que l'optimisation des coûts devient essentielle, la combinaison de vLLM Semantic Router et de <a href="https://milvus.io/">Milvus</a> offre un moyen pratique d'évoluer intelligemment. En acheminant chaque requête vers le bon modèle et en mettant en cache les résultats sémantiquement similaires à l'aide d'une base de données vectorielle distribuée, cette configuration réduit les frais généraux de calcul tout en garantissant des réponses rapides et cohérentes dans tous les cas d'utilisation.</p>
<p>En bref, vous bénéficiez d'une mise à l'échelle plus intelligente - moins de force brute, plus d'intelligence.</p>
<p>Si vous souhaitez approfondir cette question, participez à la conversation sur notre <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord</a> ou ouvrez un problème sur<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Vous pouvez également réserver une<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> session Milvus Office Hours de</a> 20 minutes pour obtenir des conseils individuels, des idées et des approfondissements techniques de la part de l'équipe qui est à l'origine de Milvus.</p>
