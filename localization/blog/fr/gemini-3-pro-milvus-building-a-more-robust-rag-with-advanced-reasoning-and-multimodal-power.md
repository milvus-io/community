---
id: >-
  gemini-3-pro-milvus-building-a-more-robust-rag-with-advanced-reasoning-and-multimodal-power.md
title: >-
  Gemini 3 Pro + Milvus : construire un RAG plus robuste avec un raisonnement
  avancé et une puissance multimodale
author: Lumina Wang
date: 2025-11-20T00:00:00.000Z
cover: assets.zilliz.com/gemini3pro_cover_2f88fb0fe6.png
tag: Tutorial
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Gemini 3 Pro, vibe coding, Milvus, RAG'
meta_title: |
  Gemini 3 Pro + Milvus: Robust RAG With Advanced Reasoning and Multimodal Power
desc: >-
  Découvrez les principales mises à jour de Gemini 3 Pro, voyez comment il
  fonctionne sur les principaux points de référence et suivez un guide pour
  construire un pipeline RAG haute performance avec Milvus.
origin: >-
  https://milvus.io/blog/gemini-3-pro-milvus-building-a-more-robust-rag-with-advanced-reasoning-and-multimodal-power.md
---
<p>Gemini 3 Pro de Google a débarqué avec le rare type de version qui modifie réellement les attentes des développeurs - pas seulement un battage médiatique, mais des capacités qui étendent matériellement ce que les interfaces en langage naturel peuvent faire. Il transforme "décrire l'application que vous voulez" en un flux de travail exécutable : acheminement dynamique des outils, planification en plusieurs étapes, orchestration des API et génération d'une interface utilisateur interactive, le tout assemblé de manière transparente. C'est le modèle le plus proche du codage vibratoire de la production.</p>
<p>Et les chiffres le confirment. Gemini 3 Pro affiche des résultats remarquables dans presque tous les principaux points de référence :</p>
<ul>
<li><p><strong>Dernier examen de l'humanité :</strong> 37,5 % sans outils, 45,8 % avec outils - le concurrent le plus proche se situe à 26,5 %.</p></li>
<li><p><strong>MathArena Apex :</strong> 23,4 %, alors que la plupart des modèles ne dépassent pas les 2 %.</p></li>
<li><p><strong>ScreenSpot-Pro :</strong> 72,7 % de précision, soit près du double du modèle suivant (36,2 %).</p></li>
<li><p><strong>Vending-Bench 2 :</strong> Valeur nette moyenne de <strong> 5 478,16 $</strong>, soit environ <strong>1,4 fois plus</strong> que la deuxième place.</p></li>
</ul>
<p>Le tableau ci-dessous présente d'autres résultats de référence.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gemini_3_table_final_HLE_Tools_on_1s_X_Rb4o_f50f42dd67.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Cette combinaison de raisonnement profond, d'utilisation intensive d'outils et de fluidité multimodale fait de Gemini 3 Pro un outil naturel pour la génération augmentée par récupération (RAG). Associez-le à <a href="https://milvus.io/"><strong>Milvus</strong></a>, la base de données vectorielle open-source haute performance conçue pour la recherche sémantique à l'échelle du milliard, et vous obtiendrez une couche de recherche qui permet d'ancrer les réponses, de s'adapter proprement et de rester fiable en production même en cas de charges de travail importantes.</p>
<p>Dans cet article, nous allons présenter les nouveautés de Gemini 3 Pro, les raisons pour lesquelles elles améliorent les flux de travail RAG et la manière de construire un pipeline RAG propre et efficace en utilisant Milvus comme colonne vertébrale de recherche.</p>
<h2 id="Major-Upgrades-in-Gemini-3-Pro" class="common-anchor-header">Principales mises à jour de Gemini 3 Pro<button data-href="#Major-Upgrades-in-Gemini-3-Pro" class="anchor-icon" translate="no">
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
    </button></h2><p>Gemini 3 Pro introduit un ensemble d'améliorations substantielles qui remodèlent la façon dont le modèle raisonne, crée, exécute des tâches et interagit avec les utilisateurs. Ces améliorations se répartissent en quatre grands domaines de compétences :</p>
<h3 id="Multimodal-Understanding-and-Reasoning" class="common-anchor-header">Compréhension et raisonnement multimodaux</h3><p>Gemini 3 Pro établit de nouveaux records dans d'importants benchmarks multimodaux, notamment ARC-AGI-2 pour le raisonnement visuel, MMMU-Pro pour la compréhension multimodale et Video-MMMU pour la compréhension vidéo et l'acquisition de connaissances. Le modèle introduit également Deep Think, un mode de raisonnement étendu qui permet un traitement logique structuré en plusieurs étapes. Il en résulte une précision nettement supérieure pour les problèmes complexes pour lesquels les modèles traditionnels de raisonnement en chaîne ont tendance à échouer.</p>
<h3 id="Code-Generation" class="common-anchor-header">Génération de code</h3><p>Le modèle porte le codage génératif à un niveau supérieur. Gemini 3 Pro peut produire des SVG interactifs, des applications web complètes, des scènes 3D et même des jeux fonctionnels - y compris des environnements de type Minecraft et des billards sur navigateur - le tout à partir d'une seule invite en langage naturel. Le développement frontal en bénéficie particulièrement : le modèle peut recréer des conceptions d'interface utilisateur existantes avec une grande fidélité ou traduire une capture d'écran directement en code prêt à la production, ce qui accélère considérablement le travail itératif sur l'interface utilisateur.</p>
<h3 id="AI-Agents-and-Tool-Use" class="common-anchor-header">Agents d'IA et utilisation d'outils</h3><p>Avec l'autorisation de l'utilisateur, Gemini 3 Pro peut accéder aux données de l'appareil Google de l'utilisateur pour effectuer des tâches à long terme et en plusieurs étapes, telles que la planification de voyages ou la réservation de voitures de location. Cette capacité agentique se reflète dans ses excellentes performances sur <strong>Vending-Bench 2</strong>, un benchmark spécialement conçu pour tester l'utilisation d'outils à long terme. Le modèle prend également en charge des flux de travail d'agent de niveau professionnel, y compris l'exécution de commandes de terminal et l'interaction avec des outils externes par le biais d'API bien définies.</p>
<h3 id="Generative-UI" class="common-anchor-header">Interface utilisateur générative</h3><p>Gemini 3 Pro dépasse le modèle conventionnel "une question - une réponse" et introduit une <strong>interface utilisateur générative</strong>, dans laquelle le modèle peut construire des expériences interactives entières de manière dynamique. Au lieu de renvoyer un texte statique, il peut générer des interfaces entièrement personnalisées - par exemple, un planificateur de voyage riche et ajustable - directement en réponse aux instructions de l'utilisateur. Les LLM passent ainsi du statut de répondeurs passifs à celui de générateurs actifs d'interfaces.</p>
<h2 id="Putting-Gemini-3-Pro-to-the-Test" class="common-anchor-header">Mise à l'épreuve de Gemini 3 Pro<button data-href="#Putting-Gemini-3-Pro-to-the-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>Au-delà des résultats des tests de référence, nous avons effectué une série de tests pratiques pour comprendre comment Gemini 3 Pro se comporte dans les flux de travail réels. Les résultats soulignent comment son raisonnement multimodal, ses capacités génératives et sa planification à long terme se traduisent par une valeur pratique pour les développeurs.</p>
<h3 id="Multimodal-understanding" class="common-anchor-header">Compréhension multimodale</h3><p>Gemini 3 Pro fait preuve d'une polyvalence impressionnante en matière de texte, d'images, de vidéo et de code. Lors de notre test, nous avons téléchargé une vidéo de Zilliz directement depuis YouTube. Le modèle a traité l'intégralité du clip - y compris la narration, les transitions et le texte à l'écran - en <strong>40 secondes</strong> environ, ce qui est exceptionnellement rapide pour un contenu multimodal de longue durée.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ytb1_39f31b728a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ytb2_bb4688e829.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Les évaluations internes de Google montrent un comportement similaire : Gemini 3 Pro a traité des recettes manuscrites en plusieurs langues, les a transcrites et traduites, puis les a compilées dans un livre de recettes familiales partageable.</p>
<h3 id="Zero-Shot-Tasks" class="common-anchor-header">Tâches en un clin d'œil</h3><p>Gemini 3 Pro peut générer des interfaces web entièrement interactives sans aucun exemple ou échafaudage préalable. Lorsqu'on lui a demandé de créer un <strong>jeu Web</strong> rétro-futuriste <strong>en 3D avec des vaisseaux spatiaux</strong>, le modèle a produit une scène interactive complète : une grille violet néon, des vaisseaux de style cyberpunk, des effets de particules lumineuses et des contrôles de caméra fluides, le tout en une seule réponse à zéro coup.</p>
<h3 id="Complex-Task-Planning" class="common-anchor-header">Planification de tâches complexes</h3><p>Le modèle fait également preuve d'une meilleure planification des tâches à long terme que la plupart de ses homologues. Lors de notre test d'organisation de la boîte de réception, Gemini 3 Pro s'est comporté comme un assistant administratif IA : il a classé les courriels désordonnés dans des catégories de projets, a rédigé des suggestions exploitables (réponse, suivi, archivage) et a présenté un résumé propre et structuré. Une fois le plan du modèle établi, la totalité de la boîte de réception pouvait être vidée d'un simple clic de confirmation.</p>
<h2 id="How-to-Build-a-RAG-System-with-Gemini-3-Pro-and-Milvus" class="common-anchor-header">Comment construire un système RAG avec Gemini 3 Pro et Milvus<button data-href="#How-to-Build-a-RAG-System-with-Gemini-3-Pro-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Le raisonnement amélioré, la compréhension multimodale et les fortes capacités d'utilisation des outils de Gemini 3 Pro en font une excellente base pour des systèmes RAG performants.</p>
<p>Associé à <a href="https://milvus.io/"><strong>Milvus</strong></a>, la base de données vectorielles open-source haute performance conçue pour la recherche sémantique à grande échelle, vous bénéficiez d'une répartition claire des responsabilités : Gemini 3 Pro se charge de l'<strong>interprétation, du raisonnement et de la génération</strong>, tandis que Milvus fournit une <strong>couche d'extraction rapide et évolutive</strong> qui maintient les réponses ancrées dans les données de votre entreprise. Cette association est bien adaptée aux applications de production telles que les bases de connaissances internes, les assistants documentaires, les copilotes d'assistance à la clientèle et les systèmes experts spécifiques à un domaine.</p>
<h3 id="Prerequisites" class="common-anchor-header">Conditions préalables</h3><p>Avant de construire votre pipeline RAG, assurez-vous que les bibliothèques Python suivantes sont installées ou mises à jour dans leurs dernières versions :</p>
<ul>
<li><p><strong>pymilvus</strong> - le SDK officiel Milvus Python</p></li>
<li><p><strong>google-generativeai</strong> - la bibliothèque client Gemini 3 Pro</p></li>
<li><p><strong>requests</strong> - pour gérer les appels HTTP si nécessaire</p></li>
<li><p><strong>tqdm</strong> - pour les barres de progression lors de l'ingestion de jeux de données</p></li>
</ul>
<pre><code translate="no">! pip install --upgrade pymilvus google-generativeai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p>Ensuite, connectez-vous à <a href="https://aistudio.google.com/api-keys"><strong>Google AI Studio</strong></a> pour obtenir votre clé API.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;GEMINI_API_KEY&quot;</span>] = <span class="hljs-string">&quot;**********&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-the-Dataset" class="common-anchor-header">Préparation du jeu de données</h3><p>Pour ce tutoriel, nous utiliserons la section FAQ de la documentation Milvus 2.4.x comme base de connaissances privée pour notre système RAG.</p>
<p>Téléchargez l'archive de la documentation et extrayez-la dans un dossier nommé <code translate="no">milvus_docs</code>.</p>
<pre><code translate="no">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>Chargez tous les fichiers Markdown à partir du chemin <code translate="no">milvus_docs/en/faq</code>. Pour chaque document, nous appliquons une division simple basée sur les titres <code translate="no">#</code> pour séparer grossièrement les sections principales dans chaque fichier Markdown.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="LLM-and-Embedding-Model-Setup" class="common-anchor-header">Configuration du LLM et du modèle d'intégration</h3><p>Pour ce tutoriel, nous utiliserons <code translate="no">gemini-3-pro-preview</code> comme LLM et <code translate="no">text-embedding-004</code> comme modèle d'intégration.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> google.generativeai <span class="hljs-keyword">as</span> genai
genai.configure(api_key=os.environ[<span class="hljs-string">&quot;GEMINI_API_KEY&quot;</span>])
gemini_model = genai.GenerativeModel(<span class="hljs-string">&quot;gemini-3-pro-preview&quot;</span>)
response = gemini_model.generate_content(<span class="hljs-string">&quot;who are you&quot;</span>)
<span class="hljs-built_in">print</span>(response.text)
<button class="copy-code-btn"></button></code></pre>
<p>Réponse du modèle : Je suis Gemini, un grand modèle de langage construit par Google.</p>
<p>Vous pouvez effectuer une vérification rapide en générant un test d'intégration et en imprimant sa dimensionnalité ainsi que les premières valeurs :</p>
<pre><code translate="no">test_embeddings = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=[<span class="hljs-string">&quot;This is a test1&quot;</span>, <span class="hljs-string">&quot;This is a test2&quot;</span>]
)[<span class="hljs-string">&quot;embedding&quot;</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embeddings[<span class="hljs-number">0</span>])
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embeddings[<span class="hljs-number">0</span>][:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>Sortie du vecteur de test :</p>
<p>768</p>
<p>[0.013588584, -0.004361838, -0.08481652, -0.039724775, 0.04723794, -0.0051557426, 0.026071774, 0.045514572, -0.016867816, 0.039378334]</p>
<h3 id="Loading-Data-into-Milvus" class="common-anchor-header">Chargement des données dans Milvus</h3><p><strong>Créer une collection</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>
milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Lors de la création d'une collection <code translate="no">MilvusClient</code>, vous avez le choix entre trois options de configuration, en fonction de votre échelle et de votre environnement :</p>
<ul>
<li><p><strong>Mode local (Milvus Lite) :</strong> Définissez l'URI sur un chemin de fichier local (par exemple, <code translate="no">./milvus.db</code>). Il s'agit de la manière la plus simple de démarrer - <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> stockera automatiquement toutes les données dans ce fichier.</p></li>
<li><p><strong>Milvus auto-hébergé (Docker ou Kubernetes) :</strong> Pour les ensembles de données plus importants ou les charges de travail de production, exécutez Milvus sur Docker ou Kubernetes. Définissez l'URI sur le point d'extrémité de votre serveur Milvus, tel que <code translate="no">http://localhost:19530</code>.</p></li>
<li><p><strong>Zilliz Cloud (le service Milvus entièrement géré) :</strong> Si vous préférez une solution gérée, utilisez Zilliz Cloud. Définissez l'URI sur votre point de terminaison public et fournissez votre clé API comme jeton d'authentification.</p></li>
</ul>
<p>Avant de créer une nouvelle collection, vérifiez d'abord si elle existe déjà. Si c'est le cas, supprimez-la et recréez-la pour garantir une configuration propre.</p>
<pre><code translate="no">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>Créez une nouvelle collection avec les paramètres spécifiés.</p>
<p>Si aucun schéma n'est fourni, Milvus génère automatiquement un champ ID par défaut comme clé primaire et un champ vectoriel pour le stockage des embeddings. Il fournit également un champ dynamique JSON réservé, qui capture tous les champs supplémentaires qui ne sont pas définis dans le schéma.</p>
<pre><code translate="no">milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Insérer des données</strong></p>
<p>Parcourez chaque entrée de texte, générez son vecteur d'intégration et insérez les données dans Milvus. Dans cet exemple, nous incluons un champ supplémentaire appelé <code translate="no">text</code>. Comme il n'est pas prédéfini dans le schéma, Milvus le stocke automatiquement à l'aide du champ JSON dynamique sous le capot - aucune configuration supplémentaire n'est nécessaire.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm
data = []
doc_embeddings = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=text_lines
)[<span class="hljs-string">&quot;embedding&quot;</span>]
<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})
milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>Exemple de sortie :</p>
<pre><code translate="no">Creating embeddings: 100%|█████████████████████████| 72/72 [00:00&lt;00:00, 431414.13it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-the-RAG-Workflow" class="common-anchor-header">Construction du flux de travail RAG</h3><p><strong>Récupérer les données pertinentes</strong></p>
<p>Pour tester la récupération, nous posons une question courante sur Milvus.</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Recherchez la requête dans la collection et renvoyez les 3 résultats les plus pertinents.</p>
<pre><code translate="no">question_embedding = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=question
)[<span class="hljs-string">&quot;embedding&quot;</span>]
search_res = milvus_client.search(
    collection_name=collection_name,
    data=[question_embedding],
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<span class="hljs-keyword">import</span> json
retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<p>Les résultats sont renvoyés par ordre de similarité, du plus proche au moins similaire.</p>
<pre><code translate="no">[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](
https://min.io/
), [AWS S3](
https://aws.amazon.com/s3/?nc1=h_ls
), [Google Cloud Storage](
https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes
) (GCS), [Azure Blob Storage](
https://azure.microsoft.com/en-us/products/storage/blobs
), [Alibaba Cloud OSS](
https://www.alibabacloud.com/product/object-storage-service
), and [Tencent Cloud Object Storage](
https://www.tencentcloud.com/products/cos
) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        0.8048489093780518
    ],
    [
        <span class="hljs-string">&quot;Does the query perform in memory? What are incremental data and historical data?\n\nYes. When a query request comes, Milvus searches both incremental data and historical data by loading them into memory. Incremental data are in the growing segments, which are buffered in memory before they reach the threshold to be persisted in storage engine, while historical data are from the sealed segments that are stored in the object storage. Incremental data and historical data together constitute the whole dataset to search.\n\n###&quot;</span>,
        0.757495105266571
    ],
    [
        <span class="hljs-string">&quot;What is the maximum dataset size Milvus can handle?\n\n  \nTheoretically, the maximum dataset size Milvus can handle is determined by the hardware it is run on, specifically system memory and storage:\n\n- Milvus loads all specified collections and partitions into memory before running queries. Therefore, memory size determines the maximum amount of data Milvus can query.\n- When new entities and and collection-related schema (currently only MinIO is supported for data persistence) are added to Milvus, system storage determines the maximum allowable size of inserted data.\n\n###&quot;</span>,
        0.7453694343566895
    ]
]
<button class="copy-code-btn"></button></code></pre>
<p><strong>Générer une réponse RAG avec le LLM</strong></p>
<p>Après avoir récupéré les documents, convertissez-les dans un format de chaîne de caractères</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Fournir au LLM une invite système et une invite utilisateur, toutes deux construites à partir des documents récupérés de Milvus.</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
&quot;&quot;&quot;</span>
USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.
&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;
&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Utilisez le modèle <code translate="no">gemini-3-pro-preview</code> avec ces invites pour générer la réponse finale.</p>
<pre><code translate="no">gemini_model = genai.GenerativeModel(
    <span class="hljs-string">&quot;gemini-3-pro-preview&quot;</span>, system_instruction=SYSTEM_PROMPT
)
response = gemini_model.generate_content(USER_PROMPT)
<span class="hljs-built_in">print</span>(response.text)
<button class="copy-code-btn"></button></code></pre>
<p>Le résultat montre que Gemini 3 Pro produit une réponse claire et bien structurée basée sur les informations extraites.</p>
<pre><code translate="no">Based <span class="hljs-keyword">on</span> the provided documents, Milvus stores data <span class="hljs-keyword">in</span> the following ways:
*   **Inserted Data:** Vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> an incremental log. Milvus supports multiple <span class="hljs-built_in">object</span> storage backends <span class="hljs-keyword">for</span> <span class="hljs-keyword">this</span> purpose, including:
    *   MinIO
    *   AWS S3
    *   <span class="hljs-function">Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>)
    *   Azure Blob Storage
    *   Alibaba Cloud OSS
    *   Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>)
*   **Metadata:** Metadata generated within Milvus modules <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> **etcd**.
*   **Memory Buffering:** Incremental <span class="hljs-title">data</span> (<span class="hljs-params">growing segments</span>) are buffered <span class="hljs-keyword">in</span> memory before being persisted, <span class="hljs-keyword">while</span> historical <span class="hljs-title">data</span> (<span class="hljs-params"><span class="hljs-keyword">sealed</span> segments</span>) resides <span class="hljs-keyword">in</span> <span class="hljs-built_in">object</span> storage but <span class="hljs-keyword">is</span> loaded <span class="hljs-keyword">into</span> memory <span class="hljs-keyword">for</span> querying.
</span><button class="copy-code-btn"></button></code></pre>
<p><strong>Remarque</strong>: Gemini 3 Pro n'est pas encore disponible pour les utilisateurs free-tier. Cliquez <a href="https://ai.google.dev/gemini-api/docs/rate-limits#tier-1">ici</a> pour plus de détails.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Gemini_3_Pro1_095925d461.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Gemini_3_Pro2_71ae286cf9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Vous pouvez y accéder via <a href="https://openrouter.ai/google/gemini-3-pro-preview/api">OpenRouter</a>:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
client = OpenAI(
  base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
  api_key=<span class="hljs-string">&quot;&lt;OPENROUTER_API_KEY&gt;&quot;</span>,
)
response2 = client.chat.completions.create(
  model=<span class="hljs-string">&quot;google/gemini-3-pro-preview&quot;</span>,
  messages=[
        {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>,
            <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT
        },
        {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, 
            <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT
        }
    ],
  extra_body={<span class="hljs-string">&quot;reasoning&quot;</span>: {<span class="hljs-string">&quot;enabled&quot;</span>: <span class="hljs-literal">True</span>}}
)
response_message = response2.choices[<span class="hljs-number">0</span>].message
<span class="hljs-built_in">print</span>(response_message.content)
<button class="copy-code-btn"></button></code></pre>
<h2 id="One-More-Thing-Vibe-Coding-with-Google-Antigravity" class="common-anchor-header">Encore une chose : Vibe Coding avec Google Antigravity<button data-href="#One-More-Thing-Vibe-Coding-with-Google-Antigravity" class="anchor-icon" translate="no">
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
    </button></h2><p>Parallèlement à Gemini 3 Pro, Google a présenté <a href="https://antigravity.google/"><strong>Google Antigravity</strong></a>, une plateforme de codage vidéo qui interagit de manière autonome avec votre éditeur, votre terminal et votre navigateur. Contrairement aux outils antérieurs assistés par l'IA qui géraient des instructions ponctuelles, Antigravity fonctionne à un niveau orienté vers les tâches - permettant aux développeurs de spécifier <em>ce qu'</em> ils veulent construire tandis que le système gère le <em>comment</em>, orchestrant le flux de travail complet de bout en bout.</p>
<p>Les flux de codage d'IA traditionnels généraient généralement des bribes isolées que les développeurs devaient encore examiner, intégrer, déboguer et exécuter manuellement. Antigravity change cette dynamique. Vous pouvez simplement décrire une tâche - par exemple, <em>"Créer un jeu simple d'interaction avec les animaux de compagnie</em> " - et le système décomposera la demande, générera le code, exécutera les commandes terminales, ouvrira un navigateur pour tester le résultat, et itérera jusqu'à ce que cela fonctionne. L'IA n'est plus un moteur d'autocomplétion passif, mais un partenaire d'ingénierie actif, qui apprend vos préférences et s'adapte à votre style de développement personnel au fil du temps.</p>
<p>À l'avenir, l'idée d'un agent coordonnant directement avec une base de données n'est pas farfelue. Grâce à l'appel d'outils via MCP, une IA pourrait éventuellement lire une base de données Milvus, assembler une base de connaissances et même maintenir son propre pipeline de recherche de manière autonome. À bien des égards, ce changement est encore plus important que la mise à niveau du modèle lui-même : une fois qu'une IA peut prendre une description au niveau du produit et la convertir en une séquence de tâches exécutables, l'effort humain se déplace naturellement vers la définition des objectifs, des contraintes et de ce à quoi ressemble la "justesse" - la réflexion de haut niveau qui stimule véritablement le développement de produits.</p>
<h2 id="Ready-to-Build" class="common-anchor-header">Prêt à construire ?<button data-href="#Ready-to-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>Si vous êtes prêt à l'essayer, suivez notre tutoriel étape par étape et construisez un système RAG avec <strong>Gemini 3 Pro + Milvus</strong> dès aujourd'hui.</p>
<p>Vous avez des questions ou souhaitez approfondir une fonctionnalité ? Rejoignez notre<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou déposez des questions sur<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Vous pouvez également réserver une session individuelle de 20 minutes pour obtenir des informations, des conseils et des réponses à vos questions dans le cadre des<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Heures de bureau Milvus</a>.</p>
