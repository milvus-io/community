---
id: how-to-build-multimodal-rag-with-colqwen2-milvus-and-qwen35.md
title: 'Comment construire un RAG multimodal avec ColQwen2, Milvus et Qwen3.5'
author: Lumina Wang
date: 2026-3-6
cover: assets.zilliz.com/download_11zon_1862455eb4.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'multimodal RAG, RAG, Milvus, Qwen3.5, vector database'
meta_keywords: 'multimodal RAG, RAG, Milvus, Qwen3.5, vector database'
meta_title: |
  How to Build Multimodal RAG with ColQwen2, Milvus, Qwen3.5
desc: >-
  Construire un pipeline RAG multimodal qui récupère les images des pages PDF au
  lieu du texte extrait, en utilisant ColQwen2, Milvus, et Qwen3.5. Tutoriel
  étape par étape.
origin: >-
  https://milvus.io/blog/how-to-build-multimodal-rag-with-colqwen2-milvus-and-qwen35.md
---
<p>De nos jours, vous pouvez télécharger un PDF vers n'importe quel LLM moderne et poser des questions à son sujet. Pour une poignée de documents, cela fonctionne très bien. Mais la plupart des LLM plafonnent à quelques centaines de pages de contexte, de sorte qu'un corpus important n'est tout simplement pas adapté. Même lorsqu'il est adapté, vous payez pour traiter chaque page à chaque requête. Si vous posez une centaine de questions sur le même ensemble de documents de 500 pages, vous payez pour 500 pages une centaine de fois. Cela devient vite coûteux.</p>
<p>La génération augmentée par récupération (RAG) résout ce problème en séparant l'indexation de la réponse. Vous encodez vos documents une fois, vous stockez les représentations dans une base de données vectorielle et, au moment de la requête, vous ne récupérez que les pages les plus pertinentes à envoyer au LLM. Le modèle lit trois pages par requête, et non l'ensemble de votre corpus. Il est donc pratique de construire des questions-réponses sur des collections qui ne cessent de croître.</p>
<p>Ce tutoriel vous guide dans la construction d'un pipeline RAG multimodal avec trois composants sous licence libre :</p>
<ul>
<li><strong><a href="https://huggingface.co/vidore/colqwen2-v1.0-merged">ColQwen2</a></strong> <a href="https://huggingface.co/vidore/colqwen2-v1.0-merged"></a>encode chaque page PDF en tant qu'image dans des encastrements multi-vectoriels, remplaçant l'étape traditionnelle d'OCR et de découpage du texte.</li>
<li><strong><a href="http://milvus.io">Milvus</a></strong> stocke ces vecteurs et gère la recherche de similarité au moment de la requête, en ne récupérant que les pages les plus pertinentes.</li>
<li><strong><a href="https://qwen.ai/blog?id=qwen3.5">Qwen3.5-397B-A17B</a></strong> lit les images des pages récupérées et génère une réponse en fonction de ce qu'il voit.</li>
</ul>
<p>À la fin, vous aurez un système fonctionnel qui prend un PDF et une question, trouve les pages les plus pertinentes et renvoie une réponse basée sur ce que le modèle voit.</p>
<h2 id="What-is-Multimodal-RAG" class="common-anchor-header">Qu'est-ce que la RAG multimodale ?<button data-href="#What-is-Multimodal-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Dans l'introduction, nous avons expliqué pourquoi la RAG est importante à grande échelle. La question suivante est de savoir de quel type de RAG vous avez besoin, car l'approche traditionnelle a un angle mort.</p>
<p>La RAG traditionnelle extrait le texte des documents, l'incorpore sous forme de vecteurs, récupère les correspondances les plus proches au moment de la requête et transmet ces morceaux de texte à un LLM. Cela fonctionne bien pour les contenus à forte teneur en texte avec un formatage propre. Elle ne fonctionne pas lorsque vos documents contiennent</p>
<ul>
<li>des tableaux, dont le sens dépend de la relation entre les lignes, les colonnes et les en-têtes.</li>
<li>des graphiques et des diagrammes, où l'information est entièrement visuelle et n'a pas d'équivalent textuel</li>
<li>des documents scannés ou des notes manuscrites, pour lesquels les résultats de l'OCR ne sont pas fiables ou sont incomplets.</li>
</ul>
<p>Le RAG multimodal remplace l'extraction de texte par l'encodage d'images. Vous rendez chaque page sous forme d'image, vous l'encodez avec un modèle de langage visuel et vous récupérez les images des pages au moment de la requête. Le LLM voit la page originale - tableaux, figures, formatage et tout le reste - et répond en fonction de ce qu'il voit.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_5_2f55d33896.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Structure-of-Multimodal-RAG-Pipeline-ColQwen2-for-Encoding-Milvus-for-Search-Qwen35-for-Generation" class="common-anchor-header">Structure du pipeline RAG multimodal : ColQwen2 pour l'encodage, Milvus pour la recherche, Qwen3.5 pour la génération<button data-href="#Structure-of-Multimodal-RAG-Pipeline-ColQwen2-for-Encoding-Milvus-for-Search-Qwen35-for-Generation" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="How-the-Pipeline-Works-httpsassetszillizcomblogColQwen2MilvusQwen35397BA17B284c822b9efpng" class="common-anchor-header">Fonctionnement du pipeline  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_2_84c822b9ef.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</h3><h3 id="Tech-Stack" class="common-anchor-header">Pile technologique</h3><table>
<thead>
<tr><th><strong>Composants</strong></th><th><strong>Choix</strong></th><th><strong>Rôle</strong></th></tr>
</thead>
<tbody>
<tr><td>Traitement des PDF</td><td>pdf2image + poppler</td><td>Rend les pages PDF sous forme d'images haute résolution</td></tr>
<tr><td>Modèle d'intégration</td><td><a href="https://huggingface.co/vidore/colqwen2-v1.0-merged">colqwen2-v1.0</a></td><td>Modèle de langage de vision ; encode chaque page en ~755 vecteurs de patchs de 128 dim.</td></tr>
<tr><td>Base de données vectorielle</td><td><a href="https://milvus.io/">Milvus Lite</a></td><td>Stocke les vecteurs de patchs et gère la recherche de similarités ; fonctionne localement sans installation de serveur.</td></tr>
<tr><td>Modèle de génération</td><td><a href="https://qwen.ai/blog?id=qwen3.5">Qwen3.5-397B-A17B</a></td><td>LLM multimodal appelé via l'API OpenRouter ; lit les images de pages récupérées pour générer des réponses.</td></tr>
</tbody>
</table>
<h2 id="Step-by-Step-Implementation-for-Multi-Modal-RAG-with-ColQwen2+-Milvus+-Qwen35-397B-A17B" class="common-anchor-header">Mise en œuvre étape par étape pour RAG multimodal avec ColQwen2+ Milvus+ Qwen3.5-397B-A17B<button data-href="#Step-by-Step-Implementation-for-Multi-Modal-RAG-with-ColQwen2+-Milvus+-Qwen35-397B-A17B" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Environment-Setup" class="common-anchor-header">Configuration de l'environnement</h3><ol>
<li>Installer les dépendances de Python</li>
</ol>
<pre><code translate="no">pip install colpali-engine pymilvus openai pdf2image torch pillow tqdm
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Installer Poppler, le moteur de rendu PDF</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># macOS</span>
brew install poppler

<span class="hljs-comment"># Ubuntu/Debian</span>
sudo apt-get install poppler-utils

<span class="hljs-comment"># Windows: download from https://github.com/oschwartz10612/poppler-windows</span>

<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>Télécharger le modèle d'intégration, ColQwen2</li>
</ol>
<p>Télécharger vidore/colqwen2-v1.0-merged depuis HuggingFace (~4.4 GB) et le sauvegarder localement :</p>
<pre><code translate="no"><span class="hljs-built_in">mkdir</span> -p ~/models/colqwen2-v1.0-merged
<span class="hljs-comment"># Download all model files to this directory</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>Obtenir une clé API OpenRouter</li>
</ol>
<p>Inscrivez-vous et générez une clé sur <a href="https://openrouter.ai/settings/keys"></a><a href="https://openrouter.ai/settings/keys">https://openrouter.ai/settings/keys.</a></p>
<h3 id="Step-1-Import-Dependencies-and-Configure" class="common-anchor-header">Étape 1 : Importer les dépendances et configurer</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os, io, base64
<span class="hljs-keyword">import</span> torch
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image
<span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm
<span class="hljs-keyword">from</span> pdf2image <span class="hljs-keyword">import</span> convert_from_path

<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType
<span class="hljs-keyword">from</span> colpali_engine.models <span class="hljs-keyword">import</span> ColQwen2, ColQwen2Processor

<span class="hljs-comment"># --- Configuration ---</span>
EMBED_MODEL = os.path.expanduser(<span class="hljs-string">&quot;~/models/colqwen2-v1.0-merged&quot;</span>)
EMBED_DIM = <span class="hljs-number">128</span>              <span class="hljs-comment"># ColQwen2 output vector dimension</span>
MILVUS_URI = <span class="hljs-string">&quot;./milvus_demo.db&quot;</span>  <span class="hljs-comment"># Milvus Lite local file</span>
COLLECTION = <span class="hljs-string">&quot;doc_patches&quot;</span>
TOP_K = <span class="hljs-number">3</span>                    <span class="hljs-comment"># Number of pages to retrieve</span>
CANDIDATE_PATCHES = <span class="hljs-number">300</span>      <span class="hljs-comment"># Candidate patches per query token</span>

<span class="hljs-comment"># OpenRouter LLM config</span>
OPENROUTER_API_KEY = os.environ.get(
    <span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>,
    <span class="hljs-string">&quot;&lt;your-api-key-here&gt;&quot;</span>,
)
GENERATION_MODEL = <span class="hljs-string">&quot;qwen/qwen3.5-397b-a17b&quot;</span>

<span class="hljs-comment"># Device selection</span>
DEVICE = <span class="hljs-string">&quot;cuda&quot;</span> <span class="hljs-keyword">if</span> torch.cuda.is_available() <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;cpu&quot;</span>
DTYPE = torch.bfloat16 <span class="hljs-keyword">if</span> DEVICE == <span class="hljs-string">&quot;cuda&quot;</span> <span class="hljs-keyword">else</span> torch.float32
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Device: <span class="hljs-subst">{DEVICE}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Sortie : Device : cpu</p>
<h3 id="Step-2-Load-the-Embedding-Model" class="common-anchor-header">Étape 2 : Charger le modèle d'intégration</h3><p><strong>ColQwen2</strong> est un modèle de langage de vision qui encode les images de documents en représentations multi-vectorielles de type ColBERT. Chaque page produit plusieurs centaines de vecteurs de patch à 128 dimensions.</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Loading embedding model: <span class="hljs-subst">{EMBED_MODEL}</span>&quot;</span>)
emb_model = ColQwen2.from_pretrained(
    EMBED_MODEL,
    torch_dtype=DTYPE,
    attn_implementation=<span class="hljs-string">&quot;flash_attention_2&quot;</span> <span class="hljs-keyword">if</span> DEVICE == <span class="hljs-string">&quot;cuda&quot;</span> <span class="hljs-keyword">else</span> <span class="hljs-literal">None</span>,
    device_map=DEVICE,
).<span class="hljs-built_in">eval</span>()
emb_processor = ColQwen2Processor.from_pretrained(EMBED_MODEL)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Embedding model ready on <span class="hljs-subst">{DEVICE}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Sortie :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_1_1fbbeba04e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Initialize-Milvus" class="common-anchor-header">Étape 3 : Initialisation de Milvus</h3><p>Ce tutoriel utilise Milvus Lite, qui s'exécute en tant que fichier local sans aucune configuration - aucun processus de serveur séparé n'est nécessaire.</p>
<p><strong>Schéma de la base de données :</strong></p>
<p><strong>id :</strong> INT64, clé primaire auto-incrémentée</p>
<p><strong>doc_id</strong>: INT64, numéro de page (quelle page du PDF)</p>
<p><strong>patch_idx</strong>: INT64, index du patch dans cette page</p>
<p><strong>vector</strong>: FLOAT_VECTOR(128), l'intégration en 128 dimensions du patch</p>
<pre><code translate="no">milvus_client = MilvusClient(uri=MILVUS_URI)

<span class="hljs-keyword">if</span> milvus_client.has_collection(COLLECTION):
    milvus_client.drop_collection(COLLECTION)

schema = milvus_client.create_schema(auto_id=<span class="hljs-literal">True</span>, enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;doc_id&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;patch_idx&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;vector&quot;</span>, DataType.FLOAT_VECTOR, dim=EMBED_DIM)

index = milvus_client.prepare_index_params()
index.add_index(field_name=<span class="hljs-string">&quot;vector&quot;</span>, index_type=<span class="hljs-string">&quot;FLAT&quot;</span>, metric_type=<span class="hljs-string">&quot;IP&quot;</span>)
milvus_client.create_collection(COLLECTION, schema=schema, index_params=index)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Milvus collection created.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Résultat : Collection Milvus créée.</p>
<h3 id="Step-4-Convert-PDF-Pages-to-Images" class="common-anchor-header">Étape 4 : Conversion des pages PDF en images</h3><p>Vous rendez chaque page à 150 DPI. Aucune extraction de texte n'a lieu ici - le pipeline traite chaque page comme une simple image.</p>
<pre><code translate="no">PDF_PATH = <span class="hljs-string">&quot;Milvus vs Zilliz.pdf&quot;</span>  <span class="hljs-comment"># Replace with your own PDF</span>
images = [p.convert(<span class="hljs-string">&quot;RGB&quot;</span>) <span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> convert_from_path(PDF_PATH, dpi=<span class="hljs-number">150</span>)]
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{<span class="hljs-built_in">len</span>(images)}</span> pages loaded.&quot;</span>)

<span class="hljs-comment"># Preview the first page</span>
images[<span class="hljs-number">0</span>].resize((<span class="hljs-number">400</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">400</span> * images[<span class="hljs-number">0</span>].height / images[<span class="hljs-number">0</span>].width)))
<button class="copy-code-btn"></button></code></pre>
<p>Résultat :</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_4_8720da8494.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-5-Encode-Images-and-Insert-into-Milvus" class="common-anchor-header">Étape 5 : Encodage des images et insertion dans Milvus</h3><p>ColQwen2 encode chaque page en encastrements de patchs multi-vectoriels. Vous insérez ensuite chaque patch en tant que ligne distincte dans Milvus.</p>
<pre><code translate="no"><span class="hljs-comment"># Encode all pages</span>
all_page_embs = []
<span class="hljs-keyword">with</span> torch.no_grad():
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> tqdm(<span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(images), <span class="hljs-number">2</span>), desc=<span class="hljs-string">&quot;Encoding pages&quot;</span>):
        batch = images[i : i + <span class="hljs-number">2</span>]
        inputs = emb_processor.process_images(batch).to(emb_model.device)
        embs = emb_model(**inputs)
        <span class="hljs-keyword">for</span> e <span class="hljs-keyword">in</span> embs:
            all_page_embs.append(e.cpu().<span class="hljs-built_in">float</span>().numpy())

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Encoded <span class="hljs-subst">{<span class="hljs-built_in">len</span>(all_page_embs)}</span> pages, ~<span class="hljs-subst">{all_page_embs[<span class="hljs-number">0</span>].shape[<span class="hljs-number">0</span>]}</span> patches per page, dim=<span class="hljs-subst">{all_page_embs[<span class="hljs-number">0</span>].shape[<span class="hljs-number">1</span>]}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Résultat : Encodage de 17 pages, ~755 patchs par page, dim=128</p>
<pre><code translate="no"><span class="hljs-comment"># Insert into Milvus</span>
<span class="hljs-keyword">for</span> doc_id, patch_vecs <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(all_page_embs):
    rows = [
        {<span class="hljs-string">&quot;doc_id&quot;</span>: doc_id, <span class="hljs-string">&quot;patch_idx&quot;</span>: j, <span class="hljs-string">&quot;vector&quot;</span>: v.tolist()}
        <span class="hljs-keyword">for</span> j, v <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(patch_vecs)
    ]
    milvus_client.insert(COLLECTION, rows)

total = milvus_client.get_collection_stats(COLLECTION)[<span class="hljs-string">&quot;row_count&quot;</span>]
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Indexed <span class="hljs-subst">{<span class="hljs-built_in">len</span>(all_page_embs)}</span> pages, <span class="hljs-subst">{total}</span> patches total.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Résultat : 17 pages indexées, 12835 patchs au total.</p>
<p>Un PDF de 17 pages produit 12 835 enregistrements de vecteurs de patchs, soit environ 755 patchs par page.</p>
<h3 id="Step-6-Retrieve--Query-Encoding-+-MaxSim-Reranking" class="common-anchor-header">Étape 6 : Récupération - Encodage de la requête + reclassement MaxSim</h3><p>Il s'agit de la logique de recherche principale. Elle fonctionne en trois étapes :</p>
<p><strong>Encodage de la requête</strong> en plusieurs vecteurs de jetons.</p>
<p><strong>Recherche dans Milvus</strong> des correctifs les plus proches de chaque vecteur de mots clés.</p>
<p><strong>Agrégation par page</strong> à l'aide de MaxSim : pour chaque jeton de la requête, prendre le patch ayant le score le plus élevé dans chaque page, puis faire la somme de ces scores pour tous les jetons. La page présentant le score total le plus élevé est celle qui correspond le mieux.</p>
<p><strong>Comment fonctionne MaxSim ?</strong> Pour chaque vecteur de jeton de requête, vous trouvez le patch du document avec le produit intérieur le plus élevé (le "max" dans MaxSim). Vous additionnez ensuite ces scores maximaux pour tous les mots-clés de la requête afin d'obtenir un score de pertinence total par page. Plus le score est élevé, plus la correspondance sémantique entre la requête et le contenu visuel de la page est forte.</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;What is the difference between Milvus and Zilliz Cloud?&quot;</span>

<span class="hljs-comment"># 1. Encode the query</span>
<span class="hljs-keyword">with</span> torch.no_grad():
    query_inputs = emb_processor.process_queries([question]).to(emb_model.device)
    query_vecs = emb_model(**query_inputs)[<span class="hljs-number">0</span>].cpu().<span class="hljs-built_in">float</span>().numpy()
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Query encoded: <span class="hljs-subst">{query_vecs.shape[<span class="hljs-number">0</span>]}</span> token vectors&quot;</span>)

<span class="hljs-comment"># 2. Search Milvus for each query token vector</span>
doc_patch_scores = {}
<span class="hljs-keyword">for</span> qv <span class="hljs-keyword">in</span> query_vecs:
    hits = milvus_client.search(
        COLLECTION, data=[qv.tolist()], limit=CANDIDATE_PATCHES,
        output_fields=[<span class="hljs-string">&quot;doc_id&quot;</span>, <span class="hljs-string">&quot;patch_idx&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>},
    )[<span class="hljs-number">0</span>]
    <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> hits:
        did = h[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;doc_id&quot;</span>]
        pid = h[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;patch_idx&quot;</span>]
        score = h[<span class="hljs-string">&quot;distance&quot;</span>]
        doc_patch_scores.setdefault(did, {})[pid] = <span class="hljs-built_in">max</span>(
            doc_patch_scores.get(did, {}).get(pid, <span class="hljs-number">0</span>), score
        )

<span class="hljs-comment"># 3. MaxSim aggregation: total score per page = sum of all matched patch scores</span>
doc_scores = {d: <span class="hljs-built_in">sum</span>(ps.values()) <span class="hljs-keyword">for</span> d, ps <span class="hljs-keyword">in</span> doc_patch_scores.items()}
ranked = <span class="hljs-built_in">sorted</span>(doc_scores.items(), key=<span class="hljs-keyword">lambda</span> x: x[<span class="hljs-number">1</span>], reverse=<span class="hljs-literal">True</span>)[:TOP_K]
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Top-<span class="hljs-subst">{TOP_K}</span> retrieved pages: <span class="hljs-subst">{[(d, <span class="hljs-built_in">round</span>(s, <span class="hljs-number">2</span>)) <span class="hljs-keyword">for</span> d, s <span class="hljs-keyword">in</span> ranked]}</span>&quot;</span>)

<button class="copy-code-btn"></button></code></pre>
<p>Résultat :</p>
<pre><code translate="no">Query encoded: 24 token vectors
Top-3 retrieved pages: [(16, 161.16), (12, 135.73), (7, 122.58)]
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Display the retrieved pages</span>
context_images = [images[d] <span class="hljs-keyword">for</span> d, _ <span class="hljs-keyword">in</span> ranked <span class="hljs-keyword">if</span> d &lt; <span class="hljs-built_in">len</span>(images)]
<span class="hljs-keyword">for</span> i, img <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(context_images):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;--- Retrieved page <span class="hljs-subst">{ranked[i][<span class="hljs-number">0</span>]}</span> (score: <span class="hljs-subst">{ranked[i][<span class="hljs-number">1</span>]:<span class="hljs-number">.2</span>f}</span>) ---&quot;</span>)
    display(img.resize((<span class="hljs-number">500</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">500</span> * img.height / img.width))))
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_6_2842a54af8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-7-Generate-an-Answer-with-the-Multimodal-LLM" class="common-anchor-header">Étape 7 : Générer une réponse avec le LLM multimodal</h3><p>Vous envoyez les images de la page récupérée - et non le texte extrait - ainsi que la question de l'utilisateur à Qwen3.5. Le LLM lit directement les images pour produire une réponse.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">image_to_uri</span>(<span class="hljs-params">img</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert an image to a base64 data URI for sending to the LLM.&quot;&quot;&quot;</span>
    img = img.copy()
    w, h = img.size
    <span class="hljs-keyword">if</span> <span class="hljs-built_in">max</span>(w, h) &gt; <span class="hljs-number">1600</span>:
        r = <span class="hljs-number">1600</span> / <span class="hljs-built_in">max</span>(w, h)
        img = img.resize((<span class="hljs-built_in">int</span>(w * r), <span class="hljs-built_in">int</span>(h * r)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, <span class="hljs-built_in">format</span>=<span class="hljs-string">&quot;PNG&quot;</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;data:image/png;base64,<span class="hljs-subst">{base64.b64encode(buf.getvalue()).decode()}</span>&quot;</span>

<span class="hljs-comment"># Build the multimodal prompt</span>
context_images = [images[d] <span class="hljs-keyword">for</span> d, _ <span class="hljs-keyword">in</span> ranked <span class="hljs-keyword">if</span> d &lt; <span class="hljs-built_in">len</span>(images)]
content = [
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(img)}}
    <span class="hljs-keyword">for</span> img <span class="hljs-keyword">in</span> context_images
]
content.append({
    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>,
    <span class="hljs-string">&quot;text&quot;</span>: (
        <span class="hljs-string">f&quot;Above are <span class="hljs-subst">{<span class="hljs-built_in">len</span>(context_images)}</span> retrieved document pages.\n&quot;</span>
        <span class="hljs-string">f&quot;Read them carefully and answer the following question:\n\n&quot;</span>
        <span class="hljs-string">f&quot;Question: <span class="hljs-subst">{question}</span>\n\n&quot;</span>
        <span class="hljs-string">f&quot;Be concise and accurate. If the documents don&#x27;t contain &quot;</span>
        <span class="hljs-string">f&quot;relevant information, say so.&quot;</span>
    ),
})

<span class="hljs-comment"># Call the LLM</span>
llm = OpenAI(api_key=OPENROUTER_API_KEY, base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>)
response = llm.chat.completions.create(
    model=GENERATION_MODEL,
    messages=[{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: content}],
    max_tokens=<span class="hljs-number">1024</span>,
    temperature=<span class="hljs-number">0.7</span>,
)
answer = response.choices[<span class="hljs-number">0</span>].message.content.strip()
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Question: <span class="hljs-subst">{question}</span>\n&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Answer: <span class="hljs-subst">{answer}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Résultats :<br>

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_3_33fa5d551d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>Dans ce tutoriel, nous avons construit un pipeline RAG multimodal qui prend un PDF, convertit chaque page en image, encode ces images dans des patchs d'intégration multi-vecteurs avec ColQwen2, les stocke dans Milvus, et récupère les pages les plus pertinentes au moment de la requête en utilisant la notation MaxSim. Au lieu d'extraire le texte et d'espérer que l'OCR préserve la mise en page, le pipeline envoie les images des pages originales à Qwen3.5, qui les lit visuellement et génère une réponse.</p>
<p>Ce tutoriel est un point de départ et non un déploiement en production. Quelques points à garder à l'esprit pour la suite.</p>
<p>Sur les compromis :</p>
<ul>
<li><strong>Le stockage augmente avec le nombre de pages.</strong> Chaque page produit ~755 vecteurs, de sorte qu'un corpus de 1 000 pages signifie environ 755 000 lignes dans Milvus. L'index FLAT utilisé ici fonctionne pour les démonstrations, mais il faudrait utiliser IVF ou HNSW pour les collections plus importantes.</li>
<li><strong>L'encodage est plus lent que l'incorporation de texte.</strong> ColQwen2 est un modèle de vision de 4,4 Go. L'encodage d'images prend plus de temps par page que l'incorporation de morceaux de texte. Pour un travail d'indexation par lots qui s'exécute une seule fois, c'est généralement suffisant. Pour l'ingestion en temps réel, cela vaut la peine d'effectuer une analyse comparative.</li>
<li><strong>Cette approche fonctionne mieux pour les documents visuellement riches.</strong> Si vos PDF sont principalement constitués de textes clairs, en une seule colonne, sans tableaux ni figures, le RAG traditionnel basé sur le texte peut permettre une récupération plus précise et coûter moins cher à exécuter.</li>
</ul>
<p>Que faire ensuite ?</p>
<ul>
<li><strong>Remplacer le RAG par un autre LLM multimodal.</strong> Ce tutoriel utilise Qwen3.5 via OpenRouter, mais le pipeline d'extraction est indépendant du modèle. Vous pourriez diriger l'étape de génération vers GPT-4o, Gemini, ou tout autre modèle multimodal qui accepte des entrées d'images.</li>
<li><strong>Développer <a href="http://milvus.io">Milvus</a>.</strong> Milvus Lite s'exécute en tant que fichier local, ce qui est idéal pour le prototypage. Pour les charges de travail de production, Milvus sur Docker/Kubernetes ou Zilliz Cloud (Milvus entièrement géré) gère des corpus plus importants sans que vous ayez à gérer l'infrastructure.</li>
<li><strong>Expérimentez avec différents types de documents.</strong> Le pipeline utilise ici un PDF de comparaison, mais il fonctionne de la même manière avec des contrats numérisés, des dessins d'ingénierie, des états financiers ou des articles de recherche avec des chiffres denses.</li>
</ul>
<p>Pour commencer, installez <a href="https://github.com/milvus-io/milvus-lite">Milvus Lite</a> avec pip install pymilvus et récupérez les poids ColQwen2 sur HuggingFace.</p>
<p>Vous avez des questions ou vous voulez montrer ce que vous avez construit ? Le <a href="https://milvus.io/slack">Milvus Slack</a> est le moyen le plus rapide d'obtenir de l'aide de la part de la communauté et de l'équipe. Si vous préférez une conversation en tête-à-tête, vous pouvez réserver du temps pendant nos <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?uuid=4cb203e5-482a-47e0-90a6-7acc511d61f4">heures de bureau</a>.</p>
<h2 id="Keep-Reading" class="common-anchor-header">Continuer à lire<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/debugging-rag-in-3d-with-projectgolem-and-milvus.md">Et si vous pouviez voir pourquoi RAG échoue ? Débogage de RAG en 3D avec Project_Golem et Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md">RAG est-il en train de devenir obsolète avec l'émergence d'agents de longue durée comme Claude Cowork ?</a></p></li>
<li><p><a href="https://milvus.io/blog/semantic-highlighting-model-for-rag-context-pruning-and-token-saving.md">Comment nous avons construit un modèle de mise en évidence sémantique pour l'élagage du contexte et la sauvegarde des jetons de RAG</a></p></li>
<li><p><a href="https://milvus.io/blog/ai-code-review-gets-better-when-models-debate-claude-vs-gemini-vs-codex-vs-qwen-vs-minimax.md">L'examen du code par l'IA s'améliore lorsque les modèles débattent : Claude vs Gemini vs Codex vs Qwen vs MiniMax</a></p></li>
</ul>
