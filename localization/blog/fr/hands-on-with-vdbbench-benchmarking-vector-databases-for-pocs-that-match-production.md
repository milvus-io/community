---
id: >-
  hands-on-with-vdbbench-benchmarking-vector-databases-for-pocs-that-match-production.md
title: >-
  Pratique avec VDBBench : Benchmarking des bases de données vectorielles pour
  des POCs qui correspondent à la production
author: Yifan Cai
date: 2025-08-15T00:00:00.000Z
desc: >-
  Apprenez à tester les bases de données vectorielles avec des données de
  production réelles à l'aide de VDBBench. Guide étape par étape pour des POCs
  de jeux de données personnalisés qui prédisent les performances réelles.
cover: assets.zilliz.com/vdbbench_cover_min_2f86466839.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: >-
  VectorDBBench, POC, vector database, VDBBench, benchmarking vector database,
  how to choose a vector database
meta_title: |
  Tutorial | How to Evaluate VectorDBs that Match Production via VDBBench
origin: >-
  https://milvus.io/blog/hands-on-with-vdbbench-benchmarking-vector-databases-for-pocs-that-match-production.md
---
<p>Les bases de données vectorielles sont désormais au cœur de l'infrastructure de l'IA, alimentant diverses applications alimentées par LLM pour le service client, la génération de contenu, la recherche, les recommandations, etc.</p>
<p>Avec autant d'options sur le marché, des bases de données vectorielles spécifiques comme Milvus et Zilliz Cloud aux bases de données traditionnelles avec la recherche vectorielle en complément, <strong>choisir la bonne n'est pas aussi simple que de lire des tableaux de référence.</strong></p>
<p>La plupart des équipes effectuent une démonstration de faisabilité (POC) avant de s'engager, ce qui est judicieux en théorie - mais en pratique, de nombreuses références de fournisseurs qui semblent impressionnantes sur le papier s'effondrent dans des conditions réelles.</p>
<p>L'une des principales raisons est que la plupart des performances annoncées sont basées sur des ensembles de données obsolètes datant de 2006-2012 (SIFT, GloVe, LAION) qui se comportent très différemment des encastrements modernes. Par exemple, SIFT utilise des vecteurs à 128 dimensions, alors que les modèles d'IA d'aujourd'hui produisent des dimensions bien plus élevées - 3 072 pour le dernier modèle d'OpenAI, 1 024 pour celui de Cohere - un changement important qui a un impact sur les performances, les coûts et l'évolutivité.</p>
<h2 id="The-Fix-Test-with-Your-Data-Not-Canned-Benchmarks" class="common-anchor-header">La solution : tester avec vos données, pas avec des benchmarks prédéfinis<button data-href="#The-Fix-Test-with-Your-Data-Not-Canned-Benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>La solution la plus simple et la plus efficace : effectuez votre évaluation POC avec les vecteurs que votre application génère réellement. Cela signifie que vous devez utiliser vos modèles d'intégration, vos requêtes réelles et votre distribution de données réelle.</p>
<p>C'est exactement ce pour quoi <a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md"><strong>VDBBench</strong></a> - un outil open-source de benchmarking de bases de données vectorielles - a été conçu. Il prend en charge l'évaluation et la comparaison de n'importe quelle base de données vectorielle, y compris Milvus, Elasticsearch, pgvector, et plus encore, et simule des charges de travail de production réelles.</p>
<p><a href="https://github.com/zilliztech/VectorDBBench">Télécharger VDBBench 1.0 →</a> |<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch&amp;__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1755165753372.1755169827021.775&amp;__hssc=175614333.3.1755169827021&amp;__hsfp=1940526538"> Voir le classement →</a> | <a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md">Qu'est-ce que VDBBench ?</a></p>
<p>VDBbench vous permet de</p>
<ul>
<li><p><strong>Tester avec vos propres données</strong> à partir de vos modèles d'intégration</p></li>
<li><p>de simuler des <strong>insertions, des requêtes et l'ingestion de flux simultanés</strong></p></li>
<li><p>Mesurer la <strong>latence P95/P99, le débit soutenu et la précision de rappel</strong></p></li>
<li><p>Effectuer des analyses comparatives sur plusieurs bases de données dans des conditions identiques</p></li>
<li><p>Permet de <strong>tester des ensembles de données personnalisés</strong> afin que les résultats correspondent réellement à la production.</p></li>
</ul>
<p>Ensuite, nous allons vous expliquer comment exécuter un POC de niveau production avec VDBBench et vos données réelles, afin que vous puissiez faire un choix sûr et à l'épreuve du temps.</p>
<h2 id="How-to-Evaluate-VectorDBs-with-Your-Custom-Datasets-with-VDBBench" class="common-anchor-header">Comment évaluer VectorDBs avec vos ensembles de données personnalisés avec VDBBench<button data-href="#How-to-Evaluate-VectorDBs-with-Your-Custom-Datasets-with-VDBBench" class="anchor-icon" translate="no">
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
    </button></h2><p>Avant de commencer, assurez-vous d'avoir installé Python 3.11 ou une version plus récente. Vous aurez besoin de données vectorielles au format CSV ou NPY, d'environ 2 à 3 heures pour l'installation complète et les tests, et de connaissances intermédiaires en Python pour le dépannage si nécessaire.</p>
<h3 id="Installation-and-Configuration" class="common-anchor-header">Installation et configuration</h3><p>Si vous évaluez une seule base de données, exécutez cette commande :</p>
<pre><code translate="no">pip install vectordb-bench
<button class="copy-code-btn"></button></code></pre>
<p>Si vous souhaitez comparer toutes les bases de données prises en charge, exécutez la commande suivante :</p>
<pre><code translate="no">pip install vectordb-bench[<span class="hljs-built_in">all</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Pour les clients de bases de données spécifiques (par exemple : Elasticsearch) :</p>
<pre><code translate="no">pip install vectordb-bench[elastic]
<button class="copy-code-btn"></button></code></pre>
<p>Consultez cette <a href="https://github.com/zilliztech/VectorDBBench">page GitHub</a> pour toutes les bases de données supportées et leurs commandes d'installation.</p>
<h3 id="Launching-VDBBench" class="common-anchor-header">Lancement de VDBBench</h3><p>Lancez <strong>VDBBench</strong> avec :</p>
<pre><code translate="no">init_bench
<button class="copy-code-btn"></button></code></pre>
<p>Sortie console attendue : 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_expected_console_output_66e1a218b7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>L'interface web sera disponible localement :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_2e4dd7ea69.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Data-Preparation-and-Format-Conversion" class="common-anchor-header">Préparation des données et conversion du format</h3><p>VDBBench nécessite des fichiers Parquet structurés avec des schémas spécifiques pour assurer des tests cohérents à travers différentes bases de données et ensembles de données.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Nom du fichier</strong></th><th style="text-align:center"><strong>Objectif</strong></th><th style="text-align:center"><strong>Contenu</strong></th><th style="text-align:center"><strong>Contenu Exemple</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">train.parquet</td><td style="text-align:center">Collection de vecteurs pour l'insertion dans la base de données</td><td style="text-align:center">✅</td><td style="text-align:center">ID du vecteur + données du vecteur (liste[float])</td></tr>
<tr><td style="text-align:center">test.parquet</td><td style="text-align:center">Collection de vecteurs pour les requêtes</td><td style="text-align:center">✅</td><td style="text-align:center">Vecteur ID + données vectorielles (liste[float])</td></tr>
<tr><td style="text-align:center">neighbors.parquet</td><td style="text-align:center">Vérité de base pour les vecteurs de requête (liste des ID des plus proches voisins)</td><td style="text-align:center">✅</td><td style="text-align:center">query_id -&gt; [top_k liste d'ID similaires]</td></tr>
<tr><td style="text-align:center">scalar_labels.parquet</td><td style="text-align:center">Étiquettes (métadonnées décrivant des entités autres que des vecteurs)</td><td style="text-align:center">❌</td><td style="text-align:center">id -&gt; label</td></tr>
</tbody>
</table>
<p>Spécifications des fichiers requis :</p>
<ul>
<li><p>Le<strong>fichier vectoriel d'apprentissage (train.parquet)</strong> doit contenir une colonne ID avec des entiers incrémentaux et une colonne vectorielle contenant des tableaux float32. Les noms des colonnes sont configurables, mais la colonne ID doit utiliser des types entiers pour une indexation correcte.</p></li>
<li><p>Le<strong>fichier vectoriel de test (test.parquet)</strong> suit la même structure que les données d'entraînement. Le nom de la colonne ID doit être "id", tandis que les noms des colonnes du vecteur peuvent être personnalisés pour correspondre à votre schéma de données.</p></li>
<li><p>Le<strong>fichier de vérité terrain (neighbors.parquet)</strong> contient les plus proches voisins de référence pour chaque requête de test. Il nécessite une colonne ID correspondant aux ID des vecteurs de test et une colonne neighbors array contenant les ID des plus proches voisins de l'ensemble d'apprentissage.</p></li>
<li><p>Le<strong>fichier des étiquettes scalaires (scalar_labels.parquet)</strong> est facultatif et contient les étiquettes de métadonnées associées aux vecteurs d'entraînement, utiles pour les tests de recherche filtrée.</p></li>
</ul>
<h3 id="Data-Format-Challenges" class="common-anchor-header">Défis liés au format des données</h3><p>La plupart des données vectorielles de production existent dans des formats qui ne correspondent pas directement aux exigences de VDBBench. Les fichiers CSV stockent généralement les embeddings sous forme de représentations de chaînes de caractères de tableaux, les fichiers NPY contiennent des matrices numériques brutes sans métadonnées, et les exportations de bases de données utilisent souvent des formats JSON ou d'autres formats structurés.</p>
<p>La conversion manuelle de ces formats implique plusieurs étapes complexes : analyser les représentations de chaînes en tableaux numériques, calculer les plus proches voisins exacts à l'aide de bibliothèques comme FAISS, diviser correctement les ensembles de données tout en maintenant la cohérence des identifiants, et s'assurer que tous les types de données correspondent aux spécifications Parquet.</p>
<h3 id="Automated-Format-Conversion" class="common-anchor-header">Conversion automatisée des formats</h3><p>Pour rationaliser le processus de conversion, nous avons développé un script Python qui gère automatiquement la conversion de format, le calcul de la vérité terrain et la structuration correcte des données.</p>
<p><strong>Format d'entrée CSV :</strong></p>
<pre><code translate="no"><span class="hljs-built_in">id</span>,emb,label
<span class="hljs-number">1</span>,<span class="hljs-string">&quot;[0.12,0.56,0.89,...]&quot;</span>,A
<span class="hljs-number">2</span>,<span class="hljs-string">&quot;[0.33,0.48,0.90,...]&quot;</span>,B
<button class="copy-code-btn"></button></code></pre>
<p><strong>Format d'entrée NPY :</strong></p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
vectors = np.<span class="hljs-property">random</span>.<span class="hljs-title function_">rand</span>(<span class="hljs-number">10000</span>, <span class="hljs-number">768</span>).<span class="hljs-title function_">astype</span>(<span class="hljs-string">&#x27;float32&#x27;</span>)
np.<span class="hljs-title function_">save</span>(<span class="hljs-string">&quot;vectors.npy&quot;</span>, vectors)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Conversion-Script-Implementation" class="common-anchor-header">Conversion Script Implementation</h3><p><strong>Installer les dépendances nécessaires :</strong></p>
<pre><code translate="no">pip install numpy pandas faiss-cpu
<button class="copy-code-btn"></button></code></pre>
<p><strong>Exécuter la conversion :</strong></p>
<pre><code translate="no">python convert_to_vdb_format.py \
  --train data/train.csv \
  --<span class="hljs-built_in">test</span> data/test.csv \
  --out datasets/custom \
  --topk 10
<button class="copy-code-btn"></button></code></pre>
<p><strong>Référence du paramètre :</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Nom du paramètre</strong></th><th style="text-align:center"><strong>Nécessaire</strong></th><th style="text-align:center"><strong>Type de paramètre</strong></th><th style="text-align:center"><strong>Description du paramètre</strong></th><th style="text-align:center"><strong>Valeur par défaut</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><code translate="no">--train</code></td><td style="text-align:center">Oui</td><td style="text-align:center">Chaîne</td><td style="text-align:center">Chemin d'accès aux données d'entraînement, au format CSV ou NPY. CSV doit contenir la colonne emb, sinon la colonne id sera générée automatiquement.</td><td style="text-align:center">Aucune</td></tr>
<tr><td style="text-align:center"><code translate="no">--test</code></td><td style="text-align:center">Oui</td><td style="text-align:center">Chaîne</td><td style="text-align:center">Chemin d'accès aux données d'interrogation, compatible avec les formats CSV ou NPY. Format identique à celui des données d'entraînement</td><td style="text-align:center">Aucun</td></tr>
<tr><td style="text-align:center"><code translate="no">--out</code></td><td style="text-align:center">Oui</td><td style="text-align:center">Chaîne</td><td style="text-align:center">Chemin du répertoire de sortie, enregistre les fichiers parquet convertis et les fichiers d'index des voisins</td><td style="text-align:center">Aucun</td></tr>
<tr><td style="text-align:center"><code translate="no">--labels</code></td><td style="text-align:center">Non</td><td style="text-align:center">Chaîne</td><td style="text-align:center">Chemin CSV des étiquettes, doit contenir la colonne des étiquettes (formatée comme un tableau de chaînes), utilisée pour enregistrer les étiquettes</td><td style="text-align:center">Aucun</td></tr>
<tr><td style="text-align:center"><code translate="no">--topk</code></td><td style="text-align:center">Non</td><td style="text-align:center">Entier</td><td style="text-align:center">Nombre de voisins les plus proches à renvoyer lors du calcul</td><td style="text-align:center">10</td></tr>
</tbody>
</table>
<p><strong>Structure du répertoire de sortie :</strong></p>
<pre><code translate="no">datasets/custom/
├── train.parquet        <span class="hljs-comment"># Training vectors</span>
├── test.parquet         <span class="hljs-comment"># Query vectors  </span>
├── neighbors.parquet    <span class="hljs-comment"># Ground Truth</span>
└── scalar_labels.parquet <span class="hljs-comment"># Optional scalar labels</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Complete-Conversion-Script" class="common-anchor-header">Script de conversion complet</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> argparse
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> pandas <span class="hljs-keyword">as</span> pd
<span class="hljs-keyword">import</span> faiss
<span class="hljs-keyword">from</span> ast <span class="hljs-keyword">import</span> literal_eval
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">Optional</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_csv</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>):
    df = pd.read_csv(path)
    <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;emb&#x27;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> df.columns:
        <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">f&quot;CSV file missing &#x27;emb&#x27; column: <span class="hljs-subst">{path}</span>&quot;</span>)
   df[<span class="hljs-string">&#x27;emb&#x27;</span>] = df[<span class="hljs-string">&#x27;emb&#x27;</span>].apply(literal_eval)
    <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;id&#x27;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> df.columns:
        df.insert(<span class="hljs-number">0</span>, <span class="hljs-string">&#x27;id&#x27;</span>, <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(df)))
    <span class="hljs-keyword">return</span> df
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_npy</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>):
    arr = np.load(path)
    df = pd.DataFrame({
        <span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-built_in">range</span>(arr.shape[<span class="hljs-number">0</span>]),
        <span class="hljs-string">&#x27;emb&#x27;</span>: arr.tolist()
    })
    <span class="hljs-keyword">return</span> df
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_vectors</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>) -&gt; pd.DataFrame:
    <span class="hljs-keyword">if</span> path.endswith(<span class="hljs-string">&#x27;.csv&#x27;</span>):
        <span class="hljs-keyword">return</span> load_csv(path)
    <span class="hljs-keyword">elif</span> path.endswith(<span class="hljs-string">&#x27;.npy&#x27;</span>):
        <span class="hljs-keyword">return</span> load_npy(path)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">f&quot;Unsupported file format: <span class="hljs-subst">{path}</span>&quot;</span>)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">compute_ground_truth</span>(<span class="hljs-params">train_vectors: np.ndarray, test_vectors: np.ndarray, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">10</span></span>):
    dim = train_vectors.shape[<span class="hljs-number">1</span>]
    index = faiss.IndexFlatL2(dim)
    index.add(train_vectors)
    _, indices = index.search(test_vectors, top_k)
    <span class="hljs-keyword">return</span> indices
<span class="hljs-keyword">def</span> <span class="hljs-title function_">save_ground_truth</span>(<span class="hljs-params">df_path: <span class="hljs-built_in">str</span>, indices: np.ndarray</span>):
    df = pd.DataFrame({
        <span class="hljs-string">&quot;id&quot;</span>: np.arange(indices.shape[<span class="hljs-number">0</span>]),
        <span class="hljs-string">&quot;neighbors_id&quot;</span>: indices.tolist()
    })
    df.to_parquet(df_path, index=<span class="hljs-literal">False</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✅ Ground truth saved successfully: <span class="hljs-subst">{df_path}</span>&quot;</span>)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>(<span class="hljs-params">train_path: <span class="hljs-built_in">str</span>, test_path: <span class="hljs-built_in">str</span>, output_dir: <span class="hljs-built_in">str</span>,
         label_path: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">10</span></span>):
    os.makedirs(output_dir, exist_ok=<span class="hljs-literal">True</span>)
    <span class="hljs-comment"># Load training and query data</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📥 Loading training data...&quot;</span>)
    train_df = load_vectors(train_path)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📥 Loading query data...&quot;</span>)
    test_df = load_vectors(test_path)
    <span class="hljs-comment"># Extract vectors and convert to numpy</span>
    train_vectors = np.array(train_df[<span class="hljs-string">&#x27;emb&#x27;</span>].to_list(), dtype=<span class="hljs-string">&#x27;float32&#x27;</span>)
    test_vectors = np.array(test_df[<span class="hljs-string">&#x27;emb&#x27;</span>].to_list(), dtype=<span class="hljs-string">&#x27;float32&#x27;</span>)
    <span class="hljs-comment"># Save parquet files retaining all fields</span>
    train_df.to_parquet(os.path.join(output_dir, <span class="hljs-string">&#x27;train.parquet&#x27;</span>), index=<span class="hljs-literal">False</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✅ train.parquet saved successfully, <span class="hljs-subst">{<span class="hljs-built_in">len</span>(train_df)}</span> records total&quot;</span>)
    test_df.to_parquet(os.path.join(output_dir, <span class="hljs-string">&#x27;test.parquet&#x27;</span>), index=<span class="hljs-literal">False</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✅ test.parquet saved successfully, <span class="hljs-subst">{<span class="hljs-built_in">len</span>(test_df)}</span> records total&quot;</span>)
    <span class="hljs-comment"># Compute ground truth</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;🔍 Computing Ground Truth (nearest neighbors)...&quot;</span>)
    gt_indices = compute_ground_truth(train_vectors, test_vectors, top_k=top_k)
    save_ground_truth(os.path.join(output_dir, <span class="hljs-string">&#x27;neighbors.parquet&#x27;</span>), gt_indices)
    <span class="hljs-comment"># Load and save label file (if provided)</span>
    <span class="hljs-keyword">if</span> label_path:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📥 Loading label file...&quot;</span>)
        label_df = pd.read_csv(label_path)
        <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;labels&#x27;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> label_df.columns:
            <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">&quot;Label file must contain &#x27;labels&#x27; column&quot;</span>)
        label_df[<span class="hljs-string">&#x27;labels&#x27;</span>] = label_df[<span class="hljs-string">&#x27;labels&#x27;</span>].apply(literal_eval)
        label_df.to_parquet(os.path.join(output_dir, <span class="hljs-string">&#x27;scalar_labels.parquet&#x27;</span>), index=<span class="hljs-literal">False</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;✅ Label file saved as scalar_labels.parquet&quot;</span>)

<span class="hljs-keyword">if</span> 
name
 == <span class="hljs-string">&quot;__main__&quot;</span>:
    parser = argparse.ArgumentParser(description=<span class="hljs-string">&quot;Convert CSV/NPY vectors to VectorDBBench data format (retaining all columns)&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--train&quot;</span>, required=<span class="hljs-literal">True</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Training data path (CSV or NPY)&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--test&quot;</span>, required=<span class="hljs-literal">True</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Query data path (CSV or NPY)&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--out&quot;</span>, required=<span class="hljs-literal">True</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Output directory&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--labels&quot;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Label CSV path (optional)&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--topk&quot;</span>, <span class="hljs-built_in">type</span>=<span class="hljs-built_in">int</span>, default=<span class="hljs-number">10</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Ground truth&quot;</span>)
    args = parser.parse_args()
    main(args.train, args.test, args.out, args.labels, args.topk)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Sortie du processus de conversion :</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_conversion_process_output_0827ba75c9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Fichiers générés Vérification :</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_f02cd2964e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Custom-Dataset-Configuration" class="common-anchor-header">Configuration de l'ensemble de données personnalisé</h3><p>Accédez à la section de configuration des ensembles de données personnalisés dans l'interface web :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_aa14b75b5d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>L'interface de configuration fournit des champs pour les métadonnées de l'ensemble de données et la spécification du chemin d'accès au fichier :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_1b64832990.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Paramètres de configuration :</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Paramètres de configuration : Nom du paramètre</strong></th><th style="text-align:center"><strong>Paramètres de configuration : Nom du paramètre Signification</strong></th><th style="text-align:center"><strong>Suggestions de configuration</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Nom</td><td style="text-align:center">Nom de l'ensemble de données (identifiant unique)</td><td style="text-align:center">N'importe quel nom, par exemple, <code translate="no">my_custom_dataset</code></td></tr>
<tr><td style="text-align:center">Chemin du dossier</td><td style="text-align:center">Chemin d'accès au répertoire du fichier de l'ensemble de données</td><td style="text-align:center">par exemple, <code translate="no">/data/datasets/custom</code></td></tr>
<tr><td style="text-align:center">dim</td><td style="text-align:center">Dimensions du vecteur</td><td style="text-align:center">Doit correspondre aux fichiers de données, par exemple 768</td></tr>
<tr><td style="text-align:center">size</td><td style="text-align:center">Nombre de vecteurs (facultatif)</td><td style="text-align:center">Peut être laissé vide, le système procédera à une auto-détection</td></tr>
<tr><td style="text-align:center">Type de métrique</td><td style="text-align:center">Méthode de mesure de la similarité</td><td style="text-align:center">On utilise généralement L2 (distance euclidienne) ou IP (produit intérieur).</td></tr>
<tr><td style="text-align:center">nom du fichier d'entraînement</td><td style="text-align:center">Nom du fichier de l'ensemble d'entraînement (sans l'extension .parquet)</td><td style="text-align:center">Si <code translate="no">train.parquet</code>, remplir <code translate="no">train</code>. Les fichiers multiples sont séparés par des virgules, par exemple, <code translate="no">train1,train2</code></td></tr>
<tr><td style="text-align:center">nom du fichier test</td><td style="text-align:center">Nom du fichier de l'ensemble de requêtes (sans l'extension .parquet)</td><td style="text-align:center">Si <code translate="no">test.parquet</code>, remplir <code translate="no">test</code></td></tr>
<tr><td style="text-align:center">nom du fichier de vérité terrain</td><td style="text-align:center">Nom du fichier de vérité terrain (sans extension .parquet)</td><td style="text-align:center">Si <code translate="no">neighbors.parquet</code>, remplir <code translate="no">neighbors</code></td></tr>
<tr><td style="text-align:center">nom de l'identifiant de l'entraînement</td><td style="text-align:center">Nom de la colonne d'identification des données d'entraînement</td><td style="text-align:center">Généralement <code translate="no">id</code></td></tr>
<tr><td style="text-align:center">nom du vecteur du train</td><td style="text-align:center">Nom de la colonne du vecteur des données d'apprentissage</td><td style="text-align:center">Si le nom de colonne généré par le script est <code translate="no">emb</code>, remplir <code translate="no">emb</code></td></tr>
<tr><td style="text-align:center">nom de la colonne test</td><td style="text-align:center">Nom de la colonne du vecteur des données d'essai</td><td style="text-align:center">Généralement identique au nom de la colonne du vecteur de données d'entraînement, par exemple, <code translate="no">emb</code></td></tr>
<tr><td style="text-align:center">nom du vecteur de vérité au sol</td><td style="text-align:center">Nom de la colonne du plus proche voisin dans Ground Truth</td><td style="text-align:center">Si le nom de la colonne est <code translate="no">neighbors_id</code>, remplir <code translate="no">neighbors_id</code></td></tr>
<tr><td style="text-align:center">scalaire nom du fichier d'étiquettes</td><td style="text-align:center">(Facultatif) Nom du fichier d'étiquettes (sans l'extension .parquet)</td><td style="text-align:center">Si <code translate="no">scalar_labels.parquet</code> a été généré, remplir <code translate="no">scalar_labels</code>, sinon laisser vide</td></tr>
<tr><td style="text-align:center">label percentages</td><td style="text-align:center">(Facultatif) Rapport de filtrage des étiquettes</td><td style="text-align:center">par exemple, <code translate="no">0.001</code>,<code translate="no">0.02</code>,<code translate="no">0.5</code>, laisser vide si aucun filtrage des étiquettes n'est nécessaire</td></tr>
<tr><td style="text-align:center">description</td><td style="text-align:center">Description de l'ensemble de données</td><td style="text-align:center">Ne peut pas indiquer le contexte commercial ou la méthode de génération</td></tr>
</tbody>
</table>
<p>Sauvegardez la configuration pour procéder à la mise en place du test.</p>
<h3 id="Test-Execution-and-Database-Configuration" class="common-anchor-header">Exécution du test et configuration de la base de données</h3><p>Accédez à l'interface de configuration du test :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_3ecdcb1034.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Sélection et configuration de la base de données (exemple : Milvus) :</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_356a2d8c39.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Affectation des ensembles de données :</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/9_dataset_assignment_85ba7b24ca.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Métadonnées de test et étiquetage :</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/10_test_metadata_and_labeling_293f6f2b99.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Exécution des tests :</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_test_execution_76acb42c98.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Results-Analysis-and-Performance-Evaluation" class="common-anchor-header">Analyse des résultats et évaluation des performances<button data-href="#Results-Analysis-and-Performance-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>L'interface des résultats fournit une analyse complète des performances :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/12_993c536c20.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Test-Configuration-Summary" class="common-anchor-header">Résumé de la configuration du test</h3><p>L'évaluation a testé des niveaux de concurrence de 1, 5 et 10 opérations simultanées (limitées par les ressources matérielles disponibles), des dimensions de vecteur de 768, une taille d'ensemble de données de 3 000 vecteurs d'entraînement et 3 000 requêtes de test, avec un filtrage d'étiquettes scalaires désactivé pour cette exécution de test.</p>
<h3 id="Critical-Implementation-Considerations" class="common-anchor-header">Considérations critiques sur la mise en œuvre</h3><ul>
<li><p><strong>Cohérence dimensionnelle :</strong> La non-concordance des dimensions des vecteurs entre les ensembles de données d'entraînement et de test entraînera l'échec immédiat du test. Vérifiez l'alignement dimensionnel lors de la préparation des données afin d'éviter les erreurs d'exécution.</p></li>
<li><p><strong>Précision de la vérité</strong> terrain<strong>:</strong> des calculs incorrects de la vérité terrain invalident les mesures du taux de rappel. Le script de conversion fourni utilise FAISS avec la distance L2 pour le calcul exact du plus proche voisin, ce qui garantit des résultats de référence précis.</p></li>
<li><p><strong>Exigences relatives à l'échelle des ensembles de données :</strong> Les petits ensembles de données (moins de 10 000 vecteurs) peuvent produire des mesures QPS incohérentes en raison d'une génération de charge insuffisante. Envisagez d'augmenter la taille du jeu de données pour obtenir des tests de débit plus fiables.</p></li>
<li><p><strong>Allocation des ressources :</strong> Les contraintes de mémoire et de CPU des conteneurs Docker peuvent limiter artificiellement les performances de la base de données pendant les tests. Surveillez l'utilisation des ressources et ajustez les limites des conteneurs si nécessaire pour une mesure précise des performances.</p></li>
<li><p><strong>Surveillance des erreurs :</strong> <strong>VDBBench</strong> peut enregistrer des erreurs sur la console qui n'apparaissent pas dans l'interface web. Surveillez les journaux du terminal pendant l'exécution du test pour obtenir des informations de diagnostic complètes.</p></li>
</ul>
<h2 id="Supplemental-Tools-Test-Data-Generation" class="common-anchor-header">Outils supplémentaires : Génération de données de test<button data-href="#Supplemental-Tools-Test-Data-Generation" class="anchor-icon" translate="no">
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
    </button></h2><p>Pour les scénarios de développement et de tests standardisés, vous pouvez générer des ensembles de données synthétiques avec des caractéristiques contrôlées :</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> pandas <span class="hljs-keyword">as</span> pd
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">def</span> <span class="hljs-title function_">generate_csv</span>(<span class="hljs-params">num_records: <span class="hljs-built_in">int</span>, dim: <span class="hljs-built_in">int</span>, filename: <span class="hljs-built_in">str</span></span>):
    ids = <span class="hljs-built_in">range</span>(num_records)
    vectors = np.random.rand(num_records, dim).<span class="hljs-built_in">round</span>(<span class="hljs-number">6</span>) 
    emb_str = [<span class="hljs-built_in">str</span>(<span class="hljs-built_in">list</span>(vec)) <span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> vectors]
    df = pd.DataFrame({
        <span class="hljs-string">&#x27;id&#x27;</span>: ids,
        <span class="hljs-string">&#x27;emb&#x27;</span>: emb_str
    })
    df.to_csv(filename, index=<span class="hljs-literal">False</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Generated file <span class="hljs-subst">{filename}</span>, <span class="hljs-subst">{num_records}</span> records total, vector dimension <span class="hljs-subst">{dim}</span>&quot;</span>)
<span class="hljs-keyword">if</span>
name
 == <span class="hljs-string">&quot;__main__&quot;</span>:
    num_records = <span class="hljs-number">3000</span>  <span class="hljs-comment"># Number of records to generate</span>
    dim = <span class="hljs-number">768</span>  <span class="hljs-comment"># Vector dimension</span>

    generate_csv(num_records, dim, <span class="hljs-string">&quot;train.csv&quot;</span>)
    generate_csv(num_records, dim, <span class="hljs-string">&quot;test.csv&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Cet utilitaire génère des ensembles de données avec des dimensions et des nombres d'enregistrements spécifiés pour les scénarios de prototypage et de test de base.</p>
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
    </button></h2><p>Vous venez d'apprendre comment vous libérer de la "théorie du benchmark" qui a induit en erreur d'innombrables décisions en matière de bases de données vectorielles. Avec VDBBench et votre propre jeu de données, vous pouvez générer des mesures de QPS, de latence et de rappel de niveau production - plus besoin de deviner à partir de données académiques vieilles de plusieurs décennies.</p>
<p>Ne vous fiez plus aux benchmarks en boîte qui n'ont rien à voir avec vos charges de travail réelles. En quelques heures, et non en quelques semaines, vous verrez précisément comment une base de données se comporte avec <em>vos</em> vecteurs, <em>vos</em> requêtes et <em>vos</em> contraintes. Cela signifie que vous pouvez prendre la décision en toute confiance, éviter des réécritures douloureuses plus tard, et livrer des systèmes qui fonctionnent réellement en production.</p>
<ul>
<li><p>Essayez VDBBench avec vos charges de travail <a href="https://github.com/zilliztech/VectorDBBench">: https://github.com/zilliztech/VectorDBBench</a></p></li>
<li><p>Consultez les résultats des tests des principales bases de données vectorielles : <a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch&amp;__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1755165753372.1755169827021.775&amp;__hssc=175614333.3.1755169827021&amp;__hsfp=1940526538">VDBBench Leaderboard</a></p></li>
</ul>
<p>Vous avez des questions ou souhaitez partager vos résultats ? Rejoignez la conversation sur<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a> ou connectez-vous avec notre communauté sur <a href="https://discord.com/invite/FG6hMJStWu">Discord</a>.</p>
<hr>
<p><em>Il s'agit du premier article de notre série VectorDB POC Guide - des méthodes pratiques et testées par les développeurs pour construire une infrastructure d'IA qui fonctionne sous la pression du monde réel. Restez à l'écoute pour en savoir plus !</em></p>
