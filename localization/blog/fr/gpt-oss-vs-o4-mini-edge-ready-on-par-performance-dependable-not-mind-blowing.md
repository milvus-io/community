---
id: >-
  gpt-oss-vs-o4-mini-edge-ready-on-par-performance-dependable-not-mind-blowing.md
title: >-
  GPT-oss vs o4-mini : Prêt à l'emploi, performances comparables - fiable, mais
  pas époustouflant
author: Lumina Wang
date: 2025-08-07T00:00:00.000Z
desc: >-
  OpenAI vole la vedette en ouvrant deux modèles de raisonnement : gpt-oss-120b
  et gpt-oss-20b, sous licence permissive Apache 2.0.
cover: >-
  assets.zilliz.com/gpt_oss_vs_o4_mini_edge_ready_on_par_performance_dependable_not_mind_blowing_2bd27838c1.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'gpt-oss, OpenAI open source models, o4-mini, vector databases, deepseek'
meta_title: |
  GPT-oss vs o4-mini: Edge-Ready, Solid, But Not Disruptive
origin: >-
  https://milvus.io/blog/gpt-oss-vs-o4-mini-edge-ready-on-par-performance-dependable-not-mind-blowing.md
---
<p>Le monde de l'IA est en pleine effervescence. En quelques semaines, Anthropic a lancé Claude 4.1 Opus, DeepMind a étonné tout le monde avec le simulateur de monde Genie 3 et maintenant, OpenAI vole la vedette en ouvrant deux modèles de raisonnement : <a href="https://huggingface.co/openai/gpt-oss-120b">gpt-oss-120b</a> et <a href="https://huggingface.co/openai/gpt-oss-20b">gpt-oss-20b</a>, sous licence permissive Apache 2.0.</p>
<p>Après leur lancement, ces modèles se sont instantanément hissés à la première place des tendances sur Hugging Face - et pour cause. C'est la première fois depuis 2019 qu'OpenAI publie des modèles à poids ouvert qui sont réellement prêts pour la production. Le mouvement n'est pas accidentel - après des années de promotion de l'accès à l'API uniquement, OpenAI répond clairement à la pression des leaders open-source tels que DeepSeek, Meta's LLaMA et Qwen, qui ont dominé à la fois les benchmarks et les flux de travail des développeurs.</p>
<p>Dans cet article, nous allons explorer ce qui rend GPT-oss différent, comment il se compare aux principaux modèles ouverts comme DeepSeek R1 et Qwen 3, et pourquoi les développeurs devraient s'en préoccuper. Nous allons également construire un système RAG capable de raisonner en utilisant GPT-oss et Milvus, la base de données vectorielle open-source la plus populaire.</p>
<h2 id="What-Makes-GPT-oss-Special-and-Why-You-Should-Care" class="common-anchor-header">Qu'est-ce qui rend GPT-oss spécial et pourquoi devriez-vous vous en préoccuper ?<button data-href="#What-Makes-GPT-oss-Special-and-Why-You-Should-Care" class="anchor-icon" translate="no">
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
    </button></h2><p>GPT-oss n'est pas une simple baisse de poids. Il est performant dans cinq domaines clés qui comptent pour les développeurs :</p>
<h3 id="1-Built-for-Edge-Deployment" class="common-anchor-header">1 : Conçu pour un déploiement en périphérie</h3><p>GPT-oss se décline en deux variantes de taille stratégique :</p>
<ul>
<li><p>gpt-oss-120b : 117B total, 5.1B actif par token</p></li>
<li><p>gpt-oss-20b : 21B total, 3.6B actif par token</p></li>
</ul>
<p>Grâce à l'architecture de mélange d'experts (MoE), seul un sous-ensemble de paramètres est actif lors de l'inférence. Cela rend les deux modèles légers à exécuter par rapport à leur taille :</p>
<ul>
<li><p>gpt-oss-120b fonctionne sur un seul GPU de 80 Go (H100)</p></li>
<li><p>gpt-oss-20b tient dans seulement 16 Go de VRAM, ce qui signifie qu'il fonctionne sur des ordinateurs portables haut de gamme ou des appareils de pointe.</p></li>
</ul>
<p>Selon les tests d'OpenAI, gpt-oss-20b est le modèle OpenAI le plus rapide pour l'inférence, idéal pour les déploiements à faible latence ou les agents de raisonnement hors ligne.</p>
<h3 id="2-Strong-Benchmark-Performance" class="common-anchor-header">2 : Forte performance de référence</h3><p>Selon les évaluations d'OpenAI :</p>
<ul>
<li><p><strong>gpt-oss-120b</strong> a des performances proches de celles de o4-mini en matière de raisonnement, d'utilisation d'outils et de codage de compétition (Codeforces, MMLU, TauBench).</p></li>
<li><p><strong>gpt-oss-20b</strong> rivalise avec o3-mini, et le surpasse même en mathématiques et en raisonnement médical.</p></li>
</ul>
<h3 id="3-Cost-Efficient-Training" class="common-anchor-header">3 : Formation rentable</h3><p>OpenAI revendique des performances équivalentes à celles de o3-mini et o4-mini, mais avec des coûts de formation nettement inférieurs :</p>
<ul>
<li><p><strong>gpt-oss-120b</strong>: 2,1 millions d'heures H100 → ~10 millions de dollars</p></li>
<li><p><strong>gpt-oss-20b</strong>: 210K H100-heures → ~$1M</p></li>
</ul>
<p>Comparez ces chiffres aux budgets de plusieurs centaines de millions de dollars de modèles tels que le GPT-4. Le GPT-oss prouve qu'une mise à l'échelle et des choix d'architecture efficaces peuvent permettre d'obtenir des performances compétitives sans empreinte carbone massive.</p>
<h3 id="4-True-Open-Source-Freedom" class="common-anchor-header">4 : Une véritable liberté en matière de logiciels libres</h3><p>GPT-oss utilise la licence Apache 2.0, ce qui signifie :</p>
<ul>
<li><p>Utilisation commerciale autorisée</p></li>
<li><p>Droits de modification et de redistribution complets</p></li>
<li><p>Aucune restriction d'utilisation ou clause de copyleft</p></li>
</ul>
<p>Il s'agit d'un véritable logiciel libre, et non d'une version réservée à la recherche. Vous pouvez l'affiner pour une utilisation spécifique à un domaine, le déployer en production avec un contrôle total et construire des produits commerciaux autour de lui. Les principales caractéristiques sont la profondeur de raisonnement configurable (faible/moyenne/élevée), la visibilité complète de la chaîne de pensée et l'appel d'outils natifs avec prise en charge des sorties structurées.</p>
<h3 id="5-Potential-GPT-5-Preview" class="common-anchor-header">5 : Avant-première potentielle du GPT-5</h3><p>OpenAI n'a pas tout révélé, mais les détails de l'architecture suggèrent qu'il pourrait s'agir d'un aperçu de l'orientation de <strong>GPT-5</strong>:</p>
<ul>
<li><p>Utilise le MoE avec 4 experts par entrée</p></li>
<li><p>suit une alternance d'attention dense et d'attention locale éparse (modèle GPT-3)</p></li>
<li><p>Présente plus de têtes d'attention</p></li>
<li><p>Il est intéressant de noter que les unités de biais du GPT-2 ont fait leur retour.</p></li>
</ul>
<p>Si vous êtes à l'affût de signaux sur la suite des événements, GPT-oss pourrait bien être l'indice public le plus clair à ce jour.</p>
<h3 id="Core-Specifications" class="common-anchor-header">Spécifications des noyaux</h3><table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Modèle</strong></td><td><strong>Params totaux</strong></td><td><strong>Params actifs</strong></td><td><strong>Experts</strong></td><td><strong>Longueur du contexte</strong></td><td><strong>Demande de VRAM</strong></td></tr>
<tr><td>gpt-oss-120b</td><td>117B</td><td>5.1B</td><td>128</td><td>128k</td><td>80GB</td></tr>
<tr><td>gpt-oss-20b</td><td>21B</td><td>3.6B</td><td>32</td><td>128k</td><td>16 GO</td></tr>
</tbody>
</table>
<p>Les deux modèles utilisent le tokenizer o200k_harmony et prennent en charge un contexte de 128 000 mots (environ 96 000 à 100 000 mots).</p>
<h2 id="GPT-oss-vs-Other-Reasoning-Models" class="common-anchor-header">GPT-oss comparé à d'autres modèles de raisonnement<button data-href="#GPT-oss-vs-Other-Reasoning-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>Voici comment GPT-oss se positionne par rapport aux modèles internes d'OpenAI et aux principaux concurrents open-source :</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Modèle</strong></td><td><strong>Paramètres (actifs)</strong></td><td><strong>Mémoire</strong></td><td><strong>Points forts</strong></td></tr>
<tr><td><strong>gpt-oss-120b</strong></td><td>117B (5.1B actif)</td><td>80 GO</td><td>Mono-GPU, raisonnement ouvert</td></tr>
<tr><td><strong>gpt-oss-20b</strong></td><td>21B (3.6B actif)</td><td>16 GO</td><td>Déploiement en périphérie, inférence rapide</td></tr>
<tr><td><strong>DeepSeek R1</strong></td><td>671B (~37B actif)</td><td>Distribué</td><td>Leader du benchmark, performance prouvée</td></tr>
<tr><td><strong>o4-mini (API)</strong></td><td>Propriétaire</td><td>API uniquement</td><td>Raisonnement solide (fermé)</td></tr>
<tr><td><strong>o3-mini (API)</strong></td><td>Propriétaire</td><td>API uniquement</td><td>Raisonnement léger (fermé)</td></tr>
</tbody>
</table>
<p>Sur la base de différents modèles de benchmarking, voici ce que nous avons trouvé :</p>
<ul>
<li><p><strong>GPT-oss vs. OpenAI's Own Models :</strong> gpt-oss-120b correspond à o4-mini sur les mathématiques de compétition (AIME), le codage (Codeforces), et l'utilisation d'outils (TauBench). Le modèle 20b a des performances similaires à o3-mini bien qu'il soit beaucoup plus petit.</p></li>
<li><p><strong>GPT-oss vs. DeepSeek R1 :</strong> DeepSeek R1 domine en termes de performances pures, mais nécessite une infrastructure distribuée. GPT-oss offre un déploiement plus simple - aucune configuration distribuée n'est nécessaire pour le modèle 120b.</p></li>
</ul>
<p>En résumé, GPT-oss offre la meilleure combinaison de performances, d'accès ouvert et de facilité de déploiement. DeepSeek R1 l'emporte en termes de performances pures, mais GPT-oss offre un équilibre optimal pour la plupart des développeurs.</p>
<h2 id="Hands-on-Building-with-GPT-oss-+-Milvus" class="common-anchor-header">Pratique : Construire avec GPT-oss + Milvus<button data-href="#Hands-on-Building-with-GPT-oss-+-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Maintenant que nous avons vu ce que GPT-oss apporte, il est temps de l'utiliser.</p>
<p>Dans les sections suivantes, nous allons suivre un tutoriel pratique pour construire un système RAG capable de raisonner en utilisant gpt-oss-20b et Milvus, le tout fonctionnant localement, sans clé API requise.</p>
<h3 id="Environment-Setup" class="common-anchor-header">Configuration de l'environnement</h3><pre><code translate="no">! pip install --upgrade <span class="hljs-string">&quot;pymilvus[model]&quot;</span> openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<h3 id="Dataset-Preparation" class="common-anchor-header">Préparation du jeu de données</h3><p>Nous utiliserons la documentation de Milvus comme base de connaissances :</p>
<pre><code translate="no"><span class="hljs-comment"># Download and prepare Milvus docs</span>
! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs

<span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Model-Setup" class="common-anchor-header">Configuration du modèle</h3><p>Accédez à GPT-oss via <a href="https://openrouter.ai/openai/gpt-oss-20b:free">OpenRouter</a> (ou exécutez-le localement). <a href="https://openrouter.ai/openai/gpt-oss-20b:free"><strong>OpenRouter</strong></a> est une plateforme qui permet aux développeurs d'accéder à plusieurs modèles d'IA (comme GPT-4, Claude, Mistral) et de passer de l'un à l'autre par le biais d'une API unique et unifiée. C'est utile pour comparer les modèles ou créer des applications qui fonctionnent avec différents fournisseurs d'IA. La série GPT-oss est maintenant disponible sur OpenRouter.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_46b575811f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

<span class="hljs-comment"># Using OpenRouter for cloud access</span>
openai_client = OpenAI(
    api_key=<span class="hljs-string">&quot;&lt;OPENROUTER_API_KEY&gt;&quot;</span>,
    base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
)

<span class="hljs-comment"># Set up embedding model</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model
embedding_model = milvus_model.DefaultEmbeddingFunction()

<span class="hljs-comment"># Test embedding dimensions</span>
test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embedding[:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">768
[-0.04836066  0.07163023 -0.01130064 -0.03789345 -0.03320649 -0.01318448
 -0.03041712 -0.02269499 -0.02317863 -0.00426028]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Set-up-Milvus-vector-database" class="common-anchor-header">Configurer la base de données vectorielle Milvus</h3><pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Initialize Milvus client</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>, token=<span class="hljs-string">&quot;root:Milvus&quot;</span>)
collection_name = <span class="hljs-string">&quot;gpt_oss_rag_collection&quot;</span>

<span class="hljs-comment"># Clean up existing collection</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)

<span class="hljs-comment"># Create new collection</span>
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>,  <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>A propos des paramètres de MilvusClient :</p>
<ul>
<li><p>Définir l'URI d'un fichier local (par exemple, <code translate="no">./milvus.db</code>) est la méthode la plus pratique car elle utilise automatiquement Milvus Lite pour stocker toutes les données dans ce fichier.</p></li>
<li><p>Pour les données à grande échelle, vous pouvez configurer un serveur Milvus plus puissant sur Docker ou Kubernetes. Dans ce cas, utilisez l'URI du serveur (par exemple, <code translate="no">http://localhost:19530</code>) comme URI.</p></li>
<li><p>Si vous souhaitez utiliser <a href="https://zilliz.com/cloud">Zilliz Cloud </a>(le service géré de Milvus), ajustez l'URI et le jeton, qui correspondent au point de terminaison public et à la clé API dans Zilliz Cloud.</p></li>
</ul>
<h3 id="Adding-Documents-to-the-Collection" class="common-anchor-header">Ajout de documents à la collection</h3><p>Nous allons maintenant créer des embeddings pour nos morceaux de texte et les ajouter à Milvus :</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

data = []
doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>Output :</p>
<pre><code translate="no">Creating embeddings: 100%|█████████████████████████████████████████████████████████████████████████████████████████████████████████████████| 72/72 [00:00&lt;00:00, 1222631.13it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="RAG-Query-Pipeline" class="common-anchor-header">RAG Query Pipeline</h3><p>Passons maintenant à la partie la plus excitante : configurons notre système RAG pour qu'il réponde aux questions.</p>
<p>Spécifions une question courante sur Milvus :</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Rechercher cette question dans la collection et extraire les 3 premiers résultats sémantiquement correspondants :</p>
<pre><code translate="no">search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries(
        [question]
    ),  <span class="hljs-comment"># Convert the question to an embedding vector</span>
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Examinons les résultats de la recherche pour cette question :</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.6572664976119995</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus&#x27; data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###&quot;</span>,
        <span class="hljs-number">0.6312144994735718</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6115782856941223</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Using-the-GPT-oss-to-Build-a-RAG-Response" class="common-anchor-header">Utilisation du GPT-oss pour construire une réponse RAG</h3><p>Convertir les documents récupérés au format chaîne de caractères :</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Fournir une invite système et une invite utilisateur pour le grand modèle linguistique :</p>
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
<p>Utiliser le dernier modèle gpt-oss pour générer une réponse basée sur l'invite :</p>
<pre><code translate="no">response = openai_client.chat.completions.create(
    model=<span class="hljs-string">&quot;openai/gpt-oss-120b&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
<span class="hljs-built_in">print</span>(response.choices[<span class="hljs-number">0</span>].message.content)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">Milvus stores its data <span class="hljs-keyword">in</span> two distinct layers:

| Type of data | Where it <span class="hljs-keyword">is</span> stored | How it <span class="hljs-keyword">is</span> stored |
|-------------|-------------------|-----------------|
| **Inserted data** (vector data, scalar fields, collection‑specific schema) | In the **persistent <span class="hljs-built_in">object</span> storage** configured <span class="hljs-keyword">for</span> the cluster. The data are written <span class="hljs-keyword">as</span> **incremental logs** (append‑only logs) that are persisted <span class="hljs-keyword">by</span> the DataNode. | The DataNode reads <span class="hljs-keyword">from</span> the message‑<span class="hljs-function">queue <span class="hljs-keyword">and</span> writes the incoming data <span class="hljs-keyword">into</span> the storage <span class="hljs-title">backend</span> (<span class="hljs-params">MinIO, AWS S3, GCS, Azure Blob, Alibaba OSS, Tencent COS, etc.</span>). When a `<span class="hljs-title">flush</span>()` call <span class="hljs-keyword">is</span> issued, the DataNode forces all queued data to be written to the persistent storage immediately. |
| **Metadata** (<span class="hljs-params">information about collections, partitions, indexes, etc.</span>) | In **etcd**. Each Milvus <span class="hljs-title">module</span> (<span class="hljs-params">catalog, index, etc.</span>) keeps its own metadata. | The metadata <span class="hljs-keyword">is</span> generated <span class="hljs-keyword">and</span> managed <span class="hljs-keyword">by</span> Milvus <span class="hljs-keyword">and</span> persisted <span class="hljs-keyword">in</span> the distributed key‑<span class="hljs-keyword">value</span> store **etcd**. |

**Summary:**  
- **Inserted data**</span> = incremental logs stored <span class="hljs-keyword">in</span> the chosen <span class="hljs-built_in">object</span>‑storage backend.  
- **Metadata** = stored <span class="hljs-keyword">in</span> the distributed configuration store **etcd**.  


Together, <span class="hljs-function">these two storage <span class="hljs-title">mechanisms</span> (<span class="hljs-params"><span class="hljs-built_in">object</span> storage <span class="hljs-keyword">for</span> the actual data <span class="hljs-keyword">and</span> etcd <span class="hljs-keyword">for</span> metadata</span>) make up Milvus’s data‑storage architecture.
</span><button class="copy-code-btn"></button></code></pre>
<h2 id="Final-Thoughts-on-GPT-oss" class="common-anchor-header">Réflexions finales sur GPT-oss<button data-href="#Final-Thoughts-on-GPT-oss" class="anchor-icon" translate="no">
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
    </button></h2><p>GPT-oss est l'aveu discret d'OpenAI que l'open-source ne peut plus être ignoré. Il ne fait pas exploser DeepSeek R1 ou Qwen 3 ou beaucoup d'autres modèles, mais il apporte quelque chose qu'ils n'ont pas : Le pipeline de formation d'OpenAI, appliqué à un modèle que vous pouvez inspecter et exécuter localement.</p>
<p><strong>Les performances ? Solides. Pas époustouflantes, mais fiables.</strong> Le modèle 20B fonctionnant sur du matériel grand public - ou même mobile avec LM Studio- est le genre d'avantage pratique qui compte vraiment pour les développeurs. Il s'agit plus d'un "ça marche" que d'un "ça change tout". Et honnêtement, c'est très bien.</p>
<p><strong>C'est la prise en charge multilingue qui laisse à désirer.</strong> Si vous travaillez dans une langue autre que l'anglais, vous serez confronté à des formulations bizarres, à des problèmes d'orthographe et à une confusion générale. Le modèle a manifestement été formé en fonction de l'anglais. Si la couverture mondiale est importante, vous devrez probablement l'affiner à l'aide d'un ensemble de données multilingues.</p>
<p>Ce qui est le plus intéressant, cependant, c'est le moment choisi. Le teaser d'OpenAI sur X - avec un "5" inséré dans le mot "LIVESTREAM" - ressemble à un coup monté. GPT-oss n'est peut-être pas l'acte principal, mais il pourrait être un avant-goût de ce qui se passera dans GPT-5. Mêmes ingrédients, échelle différente. Attendons.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_0fed950b8e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Le véritable avantage est d'avoir plus de choix de haute qualité.</strong> La concurrence stimule l'innovation, et le retour d'OpenAI dans le développement de logiciels libres profite à tout le monde. Testez GPT-oss en fonction de vos besoins spécifiques, mais choisissez en fonction de ce qui fonctionne réellement pour votre cas d'utilisation, et non en fonction de la reconnaissance de la marque.</p>
