---
id: multimodal-rag-made-simple-rag-anything-milvus-instead-of-20-separate-tools.md
title: >-
  RAG multimodal simplifié : RAG-Anything + Milvus au lieu de 20 outils
  distincts
author: Min Yin
date: 2025-11-25T00:00:00.000Z
cover: assets.zilliz.com/rag_anything_cover_6b4e9bc6c0.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, RAG-Anything, Multimodal RAG, Vector Database'
meta_title: RAG-Anything and Milvus for Multimodal RAG Systems
desc: >-
  Découvrez comment RAG-Anything et Milvus permettent une RAG multimodale à
  travers le texte, les images et les données structurées, ainsi que les
  prochaines étapes de l'IA augmentée par la recherche.
origin: >-
  https://milvus.io/blog/multimodal-rag-made-simple-rag-anything-milvus-instead-of-20-separate-tools.md
---
<p>Construire un système RAG multimodal signifiait auparavant assembler une douzaine d'outils spécialisés - un pour l'OCR, un pour les tableaux, un pour les formules mathématiques, un pour les embeddings, un pour la recherche, et ainsi de suite. Les pipelines RAG traditionnels étaient conçus pour le texte, et dès que les documents commençaient à inclure des images, des tableaux, des équations, des graphiques et d'autres contenus structurés, la chaîne d'outils devenait rapidement désordonnée et ingérable.</p>
<p><a href="https://github.com/HKUDS/RAG-Anything"><strong>RAG-Anything</strong></a>, développé par HKU, change cela. Basé sur LightRAG, il fournit une plateforme tout-en-un capable d'analyser divers types de contenu en parallèle et de les cartographier dans un graphe de connaissances unifié. Mais l'unification du pipeline n'est que la moitié de l'histoire. Pour extraire des preuves à travers ces différentes modalités, vous avez toujours besoin d'une recherche vectorielle rapide et évolutive qui peut traiter de nombreux types d'intégration à la fois. C'est là que <a href="https://milvus.io/"><strong>Milvus</strong></a> entre en jeu. En tant que base de données vectorielles haute performance à code source ouvert, Milvus élimine la nécessité de recourir à de multiples solutions de stockage et de recherche. Il prend en charge la recherche ANN à grande échelle, la recherche hybride vecteur-mot-clé, le filtrage des métadonnées et la gestion flexible des incorporations, le tout en un seul endroit.</p>
<p>Dans cet article, nous expliquerons comment RAG-Anything et Milvus fonctionnent ensemble pour remplacer une chaîne d'outils multimodale fragmentée par une pile propre et unifiée, et nous montrerons comment vous pouvez construire un système RAG Q&amp;A multimodal pratique en quelques étapes seulement.</p>
<h2 id="What-Is-RAG-Anything-and-How-It-Works" class="common-anchor-header">Qu'est-ce que RAG-Anything et comment fonctionne-t-il ?<button data-href="#What-Is-RAG-Anything-and-How-It-Works" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/HKUDS/RAG-Anything">RAG-Anything</a> est un cadre RAG conçu pour briser la barrière du texte seul des systèmes traditionnels. Au lieu de s'appuyer sur plusieurs outils spécialisés, il offre un environnement unique et unifié capable d'analyser, de traiter et d'extraire des informations à partir de différents types de contenu.</p>
<p>Le cadre prend en charge les documents contenant du texte, des diagrammes, des tableaux et des expressions mathématiques, ce qui permet aux utilisateurs d'effectuer des recherches dans toutes les modalités au moyen d'une interface unique et cohérente. Cela le rend particulièrement utile dans des domaines tels que la recherche universitaire, les rapports financiers et la gestion des connaissances d'entreprise, où les documents multimodaux sont courants.</p>
<p>RAG-Anything repose sur un pipeline multimodal à plusieurs étapes : analyse de documents→ analyse de contenu→ graphe de connaissances→ recherche intelligente. Cette architecture permet une orchestration intelligente et une compréhension multimodale, ce qui permet au système de traiter en toute transparence diverses modalités de contenu dans le cadre d'un flux de travail intégré unique.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag_anything_framework_d3513593a3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-1-+-3-+-N-Architecture" class="common-anchor-header">L'architecture "1 + 3 + N</h3><p>Au niveau de l'ingénierie, les capacités de RAG-Anything sont réalisées grâce à son architecture "1 + 3 + N" :</p>
<p><strong>Le moteur central</strong></p>
<p>Au centre de RAG-Anything se trouve un moteur de graphe de connaissances inspiré de <a href="https://github.com/HKUDS/LightRAG">LightRAG</a>. Cette unité centrale est responsable de l'extraction multimodale des entités, de la mise en correspondance des relations multimodales et du stockage sémantique vectorisé. Contrairement aux systèmes RAG traditionnels basés sur le texte uniquement, le moteur comprend les entités du texte, les objets visuels dans les images et les structures relationnelles intégrées dans les tableaux.</p>
<p><strong>3 Processeurs modaux</strong></p>
<p>RAG-Anything intègre trois processeurs de modalité spécialisés, conçus pour une compréhension approfondie et spécifique à chaque modalité. Ensemble, ils forment la couche d'analyse multimodale du système.</p>
<ul>
<li><p><strong>ImageModalProcessor</strong> interprète le contenu visuel et sa signification contextuelle.</p></li>
<li><p><strong>TableModalProcessor</strong> analyse les structures des tableaux et décode les relations logiques et numériques au sein des données.</p></li>
<li><p><strong>EquationModalProcessor</strong> comprend la sémantique des symboles et des formules mathématiques.</p></li>
</ul>
<p><strong>N Analyseurs</strong></p>
<p>Pour prendre en charge la structure diversifiée des documents du monde réel, RAG-Anything fournit une couche d'analyse syntaxique extensible construite sur plusieurs moteurs d'extraction. Actuellement, il intègre à la fois MinerU et Docling, sélectionnant automatiquement l'analyseur optimal en fonction du type de document et de sa complexité structurelle.</p>
<p>S'appuyant sur l'architecture "1 + 3 + N", RAG-Anything améliore le pipeline RAG traditionnel en modifiant la manière dont les différents types de contenu sont traités. Au lieu de traiter le texte, les images et les tableaux un par un, le système les traite tous en même temps.</p>
<pre><code translate="no"><span class="hljs-comment"># The core configuration demonstrates the parallel processing design</span>
config = RAGAnythingConfig(
    working_dir=<span class="hljs-string">&quot;./rag_storage&quot;</span>,
    parser=<span class="hljs-string">&quot;mineru&quot;</span>,
    parse_method=<span class="hljs-string">&quot;auto&quot;</span>,  <span class="hljs-comment"># Automatically selects the optimal parsing strategy</span>
    enable_image_processing=<span class="hljs-literal">True</span>,
    enable_table_processing=<span class="hljs-literal">True</span>, 
    enable_equation_processing=<span class="hljs-literal">True</span>,
    max_workers=<span class="hljs-number">8</span>  <span class="hljs-comment"># Supports multi-threaded parallel processing</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Cette conception accélère considérablement le traitement des documents techniques volumineux. Les tests d'étalonnage montrent que lorsque le système utilise davantage de cœurs d'unité centrale, il devient nettement plus rapide, ce qui réduit considérablement le temps nécessaire au traitement de chaque document.</p>
<h3 id="Layered-Storage-and-Retrieval-Optimization" class="common-anchor-header">Optimisation du stockage et de la recherche en couches</h3><p>En plus de sa conception multimodale, RAG-Anything utilise également une approche de stockage et de récupération en couches pour rendre les résultats plus précis et plus efficaces.</p>
<ul>
<li><p>Le<strong>texte</strong> est stocké dans une base de données vectorielle traditionnelle.</p></li>
<li><p>Les<strong>images</strong> sont gérées dans une base de données visuelle distincte.</p></li>
<li><p>Les<strong>tableaux</strong> sont conservés dans une base de données structurée.</p></li>
<li><p>Les<strong>formules mathématiques</strong> sont transformées en vecteurs sémantiques.</p></li>
</ul>
<p>En stockant chaque type de contenu dans son propre format, le système peut choisir la meilleure méthode de recherche pour chaque modalité au lieu de s'appuyer sur une recherche de similarité unique et générique. Cela permet d'obtenir des résultats plus rapides et plus fiables pour différents types de contenu.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/layered_storage_c9441feff1.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-Milvus-Fits-into-RAG-Anything" class="common-anchor-header">Comment Milvus s'intègre dans RAG-Anything<button data-href="#How-Milvus-Fits-into-RAG-Anything" class="anchor-icon" translate="no">
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
    </button></h2><p>RAG-Anything permet une récupération multimodale efficace, mais pour bien faire, il faut une recherche vectorielle rapide et évolutive pour tous les types d'enchâssements. <a href="https://milvus.io/">Milvus</a> remplit parfaitement ce rôle.</p>
<p>Grâce à son architecture cloud-native et à la séparation calcul-stockage, Milvus offre à la fois une grande évolutivité et un bon rapport coût-efficacité. Il prend en charge la séparation lecture-écriture et l'unification par lots de flux, ce qui permet au système de gérer des charges de travail à forte concomitance tout en maintenant des performances de requête en temps réel - les nouvelles données deviennent consultables immédiatement après leur insertion.</p>
<p>Milvus garantit également une fiabilité de niveau professionnel grâce à sa conception distribuée et tolérante aux pannes, qui maintient le système stable même si des nœuds individuels tombent en panne. Il est donc parfaitement adapté aux déploiements de RAG multimodaux au niveau de la production.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_ab54d5e798.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-to-Build-a-Multimodal-QA-System-with-RAG-Anything-and-Milvus" class="common-anchor-header">Comment construire un système multimodal de questions-réponses avec RAG-Anything et Milvus<button data-href="#How-to-Build-a-Multimodal-QA-System-with-RAG-Anything-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Cette démo montre comment construire un système de questions-réponses multimodal en utilisant le cadre RAG-Anything, la base de données vectorielle Milvus et le modèle d'intégration TongYi. (Cet exemple se concentre sur le code d'implémentation de base et n'est pas une installation de production complète).</p>
<h3 id="Hands-on-Demo" class="common-anchor-header">Démonstration pratique</h3><p><strong>Prérequis：</strong></p>
<ul>
<li><p><strong>Python :</strong> 3.10 ou supérieur</p></li>
<li><p><strong>Base de données vectorielle :</strong> Service Milvus (Milvus Lite)</p></li>
<li><p><strong>Service Cloud :</strong> Clé API Alibaba Cloud (pour les services LLM et d'intégration)</p></li>
<li><p><strong>Modèle LLM :</strong> <code translate="no">qwen-vl-max</code> (modèle basé sur la vision)</p></li>
</ul>
<p><strong>Modèle d'intégration</strong>: <code translate="no">tongyi-embedding-vision-plus</code></p>
<pre><code translate="no">- python -m venv .venv &amp;&amp; <span class="hljs-built_in">source</span> .venv/bin/activate  <span class="hljs-comment"># For Windows users:  .venvScriptsactivate</span>
- pip install -r requirements-min.txt
- <span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span> <span class="hljs-comment">#add DASHSCOPE_API_KEY</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Exécuter l'exemple de travail minimal :</strong></p>
<pre><code translate="no">python minimal_[main.py](&lt;http:<span class="hljs-comment">//main.py&gt;)</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Résultat attendu :</strong></p>
<p>Une fois le script exécuté avec succès, le terminal devrait afficher :</p>
<ul>
<li><p>le résultat de la question-réponse textuelle générée par le LLM.</p></li>
<li><p>La description de l'image récupérée correspondant à la requête.</p></li>
</ul>
<h3 id="Project-Structure" class="common-anchor-header">Structure du projet</h3><pre><code translate="no">.
├─ requirements-min.txt
├─ .env.example
├─ [config.py](&lt;http:<span class="hljs-comment">//config.py&gt;)</span>
├─ milvus_[store.py](&lt;http:<span class="hljs-comment">//store.py&gt;)</span>
├─ [adapters.py](&lt;http:<span class="hljs-comment">//adapters.py&gt;)</span>
├─ minimal_[main.py](&lt;http:<span class="hljs-comment">//main.py&gt;)</span>
└─ sample
   ├─ docs
   │  └─ faq_milvus.txt
   └─ images
      └─ milvus_arch.png
<button class="copy-code-btn"></button></code></pre>
<p><strong>Dépendances du projet</strong></p>
<pre><code translate="no">raganything
lightrag
pymilvus[lite]&gt;=2.3.0
aiohttp&gt;=3.8.0
orjson&gt;=3.8.0
python-dotenv&gt;=1.0.0
Pillow&gt;=9.0.0
numpy&gt;=1.21.0,&lt;2.0.0
rich&gt;=12.0.0
<button class="copy-code-btn"></button></code></pre>
<p><strong>Variables d'environnement</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Alibaba Cloud DashScope</span>
DASHSCOPE_API_KEY=your_api_key_here
<span class="hljs-comment"># If the endpoint changes in future releases, please update it accordingly.</span>
ALIYUN_LLM_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions
ALIYUN_VLM_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions
ALIYUN_EMBED_URL=https://dashscope.aliyuncs.com/api/v1/services/embeddings/text-embedding
<span class="hljs-comment"># Model names (configure all models here for consistency)</span>
LLM_TEXT_MODEL=qwen-max
LLM_VLM_MODEL=qwen-vl-max
EMBED_MODEL=tongyi-embedding-vision-plus
<span class="hljs-comment"># Milvus Lite</span>
MILVUS_URI=milvus_lite.db
MILVUS_COLLECTION=rag_multimodal_collection
EMBED_DIM=1152
<button class="copy-code-btn"></button></code></pre>
<p><strong>Configuration du projet</strong></p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">from</span> dotenv <span class="hljs-keyword">import</span> load_dotenv
load_dotenv()
DASHSCOPE_API_KEY = os.getenv(<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
LLM_TEXT_MODEL = os.getenv(<span class="hljs-string">&quot;LLM_TEXT_MODEL&quot;</span>, <span class="hljs-string">&quot;qwen-max&quot;</span>)
LLM_VLM_MODEL = os.getenv(<span class="hljs-string">&quot;LLM_VLM_MODEL&quot;</span>, <span class="hljs-string">&quot;qwen-vl-max&quot;</span>)
EMBED_MODEL = os.getenv(<span class="hljs-string">&quot;EMBED_MODEL&quot;</span>, <span class="hljs-string">&quot;tongyi-embedding-vision-plus&quot;</span>)
ALIYUN_LLM_URL = os.getenv(<span class="hljs-string">&quot;ALIYUN_LLM_URL&quot;</span>)
ALIYUN_VLM_URL = os.getenv(<span class="hljs-string">&quot;ALIYUN_VLM_URL&quot;</span>)
ALIYUN_EMBED_URL = os.getenv(<span class="hljs-string">&quot;ALIYUN_EMBED_URL&quot;</span>)
MILVUS_URI = os.getenv(<span class="hljs-string">&quot;MILVUS_URI&quot;</span>, <span class="hljs-string">&quot;milvus_lite.db&quot;</span>)
MILVUS_COLLECTION = os.getenv(<span class="hljs-string">&quot;MILVUS_COLLECTION&quot;</span>, <span class="hljs-string">&quot;rag_multimodal_collection&quot;</span>)
EMBED_DIM = <span class="hljs-built_in">int</span>(os.getenv(<span class="hljs-string">&quot;EMBED_DIM&quot;</span>, <span class="hljs-string">&quot;1152&quot;</span>))
<span class="hljs-comment"># Basic runtime parameters</span>
TIMEOUT = <span class="hljs-number">60</span>
MAX_RETRIES = <span class="hljs-number">2</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Invocation du modèle</strong></p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> base64
<span class="hljs-keyword">import</span> aiohttp
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>, <span class="hljs-type">Any</span>, <span class="hljs-type">Optional</span>
<span class="hljs-keyword">from</span> config <span class="hljs-keyword">import</span> (
    DASHSCOPE_API_KEY, LLM_TEXT_MODEL, LLM_VLM_MODEL, EMBED_MODEL,
    ALIYUN_LLM_URL, ALIYUN_VLM_URL, ALIYUN_EMBED_URL, EMBED_DIM, TIMEOUT
)
HEADERS = {
    <span class="hljs-string">&quot;Authorization&quot;</span>: <span class="hljs-string">f&quot;Bearer <span class="hljs-subst">{DASHSCOPE_API_KEY}</span>&quot;</span>,
    <span class="hljs-string">&quot;Content-Type&quot;</span>: <span class="hljs-string">&quot;application/json&quot;</span>,
}
<span class="hljs-keyword">class</span> <span class="hljs-title class_">AliyunLLMAdapter</span>:
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        <span class="hljs-variable language_">self</span>.text_url = ALIYUN_LLM_URL
        <span class="hljs-variable language_">self</span>.vlm_url = ALIYUN_VLM_URL
        <span class="hljs-variable language_">self</span>.text_model = LLM_TEXT_MODEL
        <span class="hljs-variable language_">self</span>.vlm_model = LLM_VLM_MODEL
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">chat</span>(<span class="hljs-params">self, prompt: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        payload = {
            <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-variable language_">self</span>.text_model,
            <span class="hljs-string">&quot;input&quot;</span>: {<span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: prompt}]},
            <span class="hljs-string">&quot;parameters&quot;</span>: {<span class="hljs-string">&quot;max_tokens&quot;</span>: <span class="hljs-number">1024</span>, <span class="hljs-string">&quot;temperature&quot;</span>: <span class="hljs-number">0.5</span>},
        }
        <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=TIMEOUT)) <span class="hljs-keyword">as</span> s:
            <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> [s.post](&lt;http://s.post&gt;)(<span class="hljs-variable language_">self</span>.text_url, json=payload, headers=HEADERS) <span class="hljs-keyword">as</span> r:
                r.raise_for_status()
                data = <span class="hljs-keyword">await</span> r.json()
                <span class="hljs-keyword">return</span> data[<span class="hljs-string">&quot;output&quot;</span>][<span class="hljs-string">&quot;choices&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;message&quot;</span>][<span class="hljs-string">&quot;content&quot;</span>]
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">chat_vlm_with_image</span>(<span class="hljs-params">self, prompt: <span class="hljs-built_in">str</span>, image_path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(image_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> f:
            image_b64 = base64.b64encode([f.read](&lt;http://f.read&gt;)()).decode(<span class="hljs-string">&quot;utf-8&quot;</span>)
        payload = {
            <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-variable language_">self</span>.vlm_model,
            <span class="hljs-string">&quot;input&quot;</span>: {<span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: [
                {<span class="hljs-string">&quot;text&quot;</span>: prompt},
                {<span class="hljs-string">&quot;image&quot;</span>: <span class="hljs-string">f&quot;data:image/png;base64,<span class="hljs-subst">{image_b64}</span>&quot;</span>}
            ]}]},
            <span class="hljs-string">&quot;parameters&quot;</span>: {<span class="hljs-string">&quot;max_tokens&quot;</span>: <span class="hljs-number">1024</span>, <span class="hljs-string">&quot;temperature&quot;</span>: <span class="hljs-number">0.2</span>},
        }
        <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=TIMEOUT)) <span class="hljs-keyword">as</span> s:
            <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> [s.post](&lt;http://s.post&gt;)(<span class="hljs-variable language_">self</span>.vlm_url, json=payload, headers=HEADERS) <span class="hljs-keyword">as</span> r:
                r.raise_for_status()
                data = <span class="hljs-keyword">await</span> r.json()
                <span class="hljs-keyword">return</span> data[<span class="hljs-string">&quot;output&quot;</span>][<span class="hljs-string">&quot;choices&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;message&quot;</span>][<span class="hljs-string">&quot;content&quot;</span>]
<span class="hljs-keyword">class</span> <span class="hljs-title class_">AliyunEmbeddingAdapter</span>:
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        <span class="hljs-variable language_">self</span>.url = ALIYUN_EMBED_URL
        <span class="hljs-variable language_">self</span>.model = EMBED_MODEL
        <span class="hljs-variable language_">self</span>.dim = EMBED_DIM
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_text</span>(<span class="hljs-params">self, text: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-type">List</span>[<span class="hljs-built_in">float</span>]:
        payload = {
            <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-variable language_">self</span>.model,
            <span class="hljs-string">&quot;input&quot;</span>: {<span class="hljs-string">&quot;texts&quot;</span>: [text]},
            <span class="hljs-string">&quot;parameters&quot;</span>: {<span class="hljs-string">&quot;text_type&quot;</span>: <span class="hljs-string">&quot;query&quot;</span>, <span class="hljs-string">&quot;dimensions&quot;</span>: <span class="hljs-variable language_">self</span>.dim},
        }
        <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=TIMEOUT)) <span class="hljs-keyword">as</span> s:
            <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> [s.post](&lt;http://s.post&gt;)(<span class="hljs-variable language_">self</span>.url, json=payload, headers=HEADERS) <span class="hljs-keyword">as</span> r:
                r.raise_for_status()
                data = <span class="hljs-keyword">await</span> r.json()
                <span class="hljs-keyword">return</span> data[<span class="hljs-string">&quot;output&quot;</span>][<span class="hljs-string">&quot;embeddings&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;embedding&quot;</span>]
<button class="copy-code-btn"></button></code></pre>
<p><strong>Intégration de Milvus Lite</strong></p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> time
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>, <span class="hljs-type">Any</span>, <span class="hljs-type">Optional</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, CollectionSchema, FieldSchema, DataType, utility
<span class="hljs-keyword">from</span> config <span class="hljs-keyword">import</span> MILVUS_URI, MILVUS_COLLECTION, EMBED_DIM
<span class="hljs-keyword">class</span> <span class="hljs-title class_">MilvusVectorStore</span>:
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, uri: <span class="hljs-built_in">str</span> = MILVUS_URI, collection_name: <span class="hljs-built_in">str</span> = MILVUS_COLLECTION, dim: <span class="hljs-built_in">int</span> = EMBED_DIM</span>):
        <span class="hljs-variable language_">self</span>.uri = uri
        <span class="hljs-variable language_">self</span>.collection_name = collection_name
        <span class="hljs-variable language_">self</span>.dim = dim
        <span class="hljs-variable language_">self</span>.collection: <span class="hljs-type">Optional</span>[Collection] = <span class="hljs-literal">None</span>
        <span class="hljs-variable language_">self</span>._connect_and_prepare()
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_connect_and_prepare</span>(<span class="hljs-params">self</span>):
        connections.connect(<span class="hljs-string">&quot;default&quot;</span>, uri=<span class="hljs-variable language_">self</span>.uri)
        <span class="hljs-keyword">if</span> utility.has_collection(<span class="hljs-variable language_">self</span>.collection_name):
            <span class="hljs-variable language_">self</span>.collection = Collection(<span class="hljs-variable language_">self</span>.collection_name)
        <span class="hljs-keyword">else</span>:
            fields = [
                FieldSchema(name=<span class="hljs-string">&quot;id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">512</span>, is_primary=<span class="hljs-literal">True</span>),
                FieldSchema(name=<span class="hljs-string">&quot;vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-variable language_">self</span>.dim),
                FieldSchema(name=<span class="hljs-string">&quot;content&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>),
                FieldSchema(name=<span class="hljs-string">&quot;content_type&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">32</span>),
                FieldSchema(name=<span class="hljs-string">&quot;source&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">1024</span>),
                FieldSchema(name=<span class="hljs-string">&quot;ts&quot;</span>, dtype=[DataType.INT](&lt;http://DataType.INT&gt;)<span class="hljs-number">64</span>),
            ]
            schema = CollectionSchema(fields, <span class="hljs-string">&quot;Minimal multimodal collection&quot;</span>)
            <span class="hljs-variable language_">self</span>.collection = Collection(<span class="hljs-variable language_">self</span>.collection_name, schema)
            <span class="hljs-variable language_">self</span>.collection.create_index(<span class="hljs-string">&quot;vector&quot;</span>, {
                <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
                <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_FLAT&quot;</span>,
                <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">1024</span>}
            })
        <span class="hljs-variable language_">self</span>.collection.load()
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">upsert</span>(<span class="hljs-params">self, ids: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>], vectors: <span class="hljs-type">List</span>[<span class="hljs-type">List</span>[<span class="hljs-built_in">float</span>]], contents: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
               content_types: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>], sources: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]</span>) -&gt; <span class="hljs-literal">None</span>:
        data = [
            ids,
            vectors,
            contents,
            content_types,
            sources,
            [<span class="hljs-built_in">int</span>(time.time() * <span class="hljs-number">1000</span>)] * <span class="hljs-built_in">len</span>(ids)
        ]
        <span class="hljs-variable language_">self</span>.collection.upsert(data)
        <span class="hljs-variable language_">self</span>.collection.flush()
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">search</span>(<span class="hljs-params">self, query_vectors: <span class="hljs-type">List</span>[<span class="hljs-type">List</span>[<span class="hljs-built_in">float</span>]], top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span>, content_type: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span></span>):
        expr = <span class="hljs-string">f&#x27;content_type == &quot;<span class="hljs-subst">{content_type}</span>&quot;&#x27;</span> <span class="hljs-keyword">if</span> content_type <span class="hljs-keyword">else</span> <span class="hljs-literal">None</span>
        params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">16</span>}}
        results = [<span class="hljs-variable language_">self</span>.collection.search](&lt;http://<span class="hljs-variable language_">self</span>.collection.search&gt;)(
            data=query_vectors,
            anns_field=<span class="hljs-string">&quot;vector&quot;</span>,
            param=params,
            limit=top_k,
            expr=expr,
            output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;content_type&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;ts&quot;</span>]
        )
        out = []
        <span class="hljs-keyword">for</span> hits <span class="hljs-keyword">in</span> results:
            out.append([{
                <span class="hljs-string">&quot;id&quot;</span>: h.entity.get(<span class="hljs-string">&quot;id&quot;</span>),
                <span class="hljs-string">&quot;content&quot;</span>: h.entity.get(<span class="hljs-string">&quot;content&quot;</span>),
                <span class="hljs-string">&quot;content_type&quot;</span>: h.entity.get(<span class="hljs-string">&quot;content_type&quot;</span>),
                <span class="hljs-string">&quot;source&quot;</span>: h.entity.get(<span class="hljs-string">&quot;source&quot;</span>),
                <span class="hljs-string">&quot;score&quot;</span>: h.score
            } <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> hits])
        <span class="hljs-keyword">return</span> out
<button class="copy-code-btn"></button></code></pre>
<p><strong>Point d'entrée principal</strong></p>
<pre><code translate="no"><span class="hljs-string">&quot;&quot;&quot;
Minimal Working Example:
- Insert a short text FAQ into LightRAG (text retrieval context)
- Insert an image description vector into Milvus (image retrieval context)
- Execute two example queries: one text QA and one image-based QA
&quot;&quot;&quot;</span>
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">import</span> uuid
<span class="hljs-keyword">from</span> pathlib <span class="hljs-keyword">import</span> Path
<span class="hljs-keyword">from</span> rich <span class="hljs-keyword">import</span> <span class="hljs-built_in">print</span>
<span class="hljs-keyword">from</span> lightrag <span class="hljs-keyword">import</span> LightRAG, QueryParam
<span class="hljs-keyword">from</span> lightrag.utils <span class="hljs-keyword">import</span> EmbeddingFunc
<span class="hljs-keyword">from</span> adapters <span class="hljs-keyword">import</span> AliyunLLMAdapter, AliyunEmbeddingAdapter
<span class="hljs-keyword">from</span> milvus_store <span class="hljs-keyword">import</span> MilvusVectorStore
<span class="hljs-keyword">from</span> config <span class="hljs-keyword">import</span> EMBED_DIM
SAMPLE_DOC = Path(<span class="hljs-string">&quot;sample/docs/faq_milvus.txt&quot;</span>)
SAMPLE_IMG = Path(<span class="hljs-string">&quot;sample/images/milvus_arch.png&quot;</span>)
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():
    <span class="hljs-comment"># 1) Initialize core components</span>
    llm = AliyunLLMAdapter()
    emb = AliyunEmbeddingAdapter()
    store = MilvusVectorStore()
    <span class="hljs-comment"># 2) Initialize LightRAG (for text-only retrieval)</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">llm_complete</span>(<span class="hljs-params">prompt: <span class="hljs-built_in">str</span>, max_tokens: <span class="hljs-built_in">int</span> = <span class="hljs-number">1024</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-keyword">await</span> [llm.chat](&lt;http://llm.chat&gt;)(prompt)
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_func</span>(<span class="hljs-params">text: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-keyword">await</span> emb.embed_text(text)
    rag = LightRAG(
        working_dir=<span class="hljs-string">&quot;rag_workdir_min&quot;</span>,
        llm_model_func=llm_complete,
        embedding_func=EmbeddingFunc(
            embedding_dim=EMBED_DIM,
            max_token_size=<span class="hljs-number">8192</span>,
            func=embed_func
        ),
    )
    <span class="hljs-comment"># 3) Insert text data</span>
    <span class="hljs-keyword">if</span> SAMPLE_DOC.exists():
        text = SAMPLE_[DOC.read](&lt;http://DOC.read&gt;)_text(encoding=<span class="hljs-string">&quot;utf-8&quot;</span>)
        <span class="hljs-keyword">await</span> rag.ainsert(text)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[green]Inserted FAQ text into LightRAG[/green]&quot;</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[yellow] sample/docs/faq_milvus.txt not found[/yellow]&quot;</span>)
    <span class="hljs-comment"># 4) Insert image data (store description in Milvus)</span>
    <span class="hljs-keyword">if</span> SAMPLE_IMG.exists():
        <span class="hljs-comment"># Use the VLM to generate a description as its semantic content</span>
        desc = <span class="hljs-keyword">await</span> [llm.chat](&lt;http://llm.chat&gt;)_vlm_with_image(<span class="hljs-string">&quot;Please briefly describe the key components of the Milvus architecture shown in the image.&quot;</span>, <span class="hljs-built_in">str</span>(SAMPLE_IMG))
        vec = <span class="hljs-keyword">await</span> emb.embed_text(desc)  <span class="hljs-comment"># Use text embeddings to maintain a consistent vector dimension, simplifying reuse</span>
        store.upsert(
            ids=[<span class="hljs-built_in">str</span>(uuid.uuid4())],
            vectors=[vec],
            contents=[desc],
            content_types=[<span class="hljs-string">&quot;image&quot;</span>],
            sources=[<span class="hljs-built_in">str</span>(SAMPLE_IMG)]
        )
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[green]Inserted image description into Milvus（content_type=image）[/green]&quot;</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[yellow] sample/images/milvus_arch.png not found[/yellow]&quot;</span>)
    <span class="hljs-comment"># 5) Query: Text-based QA (from LightRAG)</span>
    q1 = <span class="hljs-string">&quot;Does Milvus support simultaneous insertion and search? Give a short answer.&quot;</span>
    ans1 = <span class="hljs-keyword">await</span> rag.aquery(q1, param=QueryParam(mode=<span class="hljs-string">&quot;hybrid&quot;</span>))
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n[bold]Text QA[/bold]&quot;</span>)
    <span class="hljs-built_in">print</span>(ans1)
    <span class="hljs-comment"># 6) Query: Image-related QA (from Milvus)</span>
    q2 = <span class="hljs-string">&quot;What are the key components of the Milvus architecture?&quot;</span>
    q2_vec = <span class="hljs-keyword">await</span> emb.embed_text(q2)
    img_hits = [store.search](&lt;http://store.search&gt;)([q2_vec], top_k=<span class="hljs-number">3</span>, content_type=<span class="hljs-string">&quot;image&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n[bold]Image Retrieval (returns semantic image descriptions)[/bold]&quot;</span>)
    <span class="hljs-built_in">print</span>(img_hits[<span class="hljs-number">0</span>] <span class="hljs-keyword">if</span> img_hits <span class="hljs-keyword">else</span> [])
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    [asyncio.run](&lt;http://asyncio.run&gt;)(main())
<button class="copy-code-btn"></button></code></pre>
<p>Vous pouvez maintenant tester votre système RAG multimodal avec votre propre ensemble de données.</p>
<h2 id="The-Future-for-Multimodal-RAG" class="common-anchor-header">L'avenir de la RAG multimodale<button data-href="#The-Future-for-Multimodal-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>À mesure que les données du monde réel dépassent le simple texte, les systèmes RAG (Retrieval-Augmented Generation) commencent à évoluer vers une véritable multimodalité. Des solutions comme <strong>RAG-Anything</strong> démontrent déjà comment le texte, les images, les tableaux, les formules et d'autres contenus structurés peuvent être traités de manière unifiée. À l'avenir, je pense que trois grandes tendances façonneront la prochaine phase de la RAG multimodale :</p>
<h3 id="Expanding-to-More-Modalities" class="common-anchor-header">Extension à d'autres modalités</h3><p>Les cadres actuels, tels que RAG-Anything, peuvent déjà traiter du texte, des images, des tableaux et des expressions mathématiques. La prochaine étape consistera à prendre en charge des types de contenu encore plus riches, notamment la <strong>vidéo, l'audio, les données de capteurs et les modèles 3D</strong>, ce qui permettra aux systèmes RAG de comprendre et d'extraire des informations de l'ensemble du spectre des données modernes.</p>
<h3 id="Real-Time-Data-Updates" class="common-anchor-header">Mises à jour des données en temps réel</h3><p>La plupart des pipelines RAG actuels s'appuient sur des sources de données relativement statiques. L'information évoluant plus rapidement, les futurs systèmes nécessiteront des <strong>mises à jour de documents en temps réel, une ingestion en continu et une indexation incrémentale</strong>. Cette évolution rendra le RAG plus réactif, plus opportun et plus fiable dans les environnements dynamiques.</p>
<h3 id="Moving-RAG-to-Edge-Devices" class="common-anchor-header">Transférer le RAG vers les appareils périphériques</h3><p>Avec des outils vectoriels légers tels que <a href="https://github.com/milvus-io/milvus-lite">Milvus Lite</a>, la GCR multimodale n'est plus confinée au nuage. Le déploiement de la RAG sur des <strong>dispositifs de périphérie et des systèmes IoT</strong> permet une récupération intelligente plus proche de l'endroit où les données sont générées, ce qui améliore la latence, la confidentialité et l'efficacité globale.</p>
<p>👉 Prêt à explorer la RAG multimodale ?</p>
<p>Essayez de coupler votre pipeline multimodal avec <a href="https://milvus.io">Milvus</a> et faites l'expérience d'une recherche rapide et évolutive sur du texte, des images et bien plus encore.</p>
<p>Vous avez des questions ou souhaitez approfondir une fonctionnalité ? Rejoignez notre<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou déposez des questions sur<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Vous pouvez également réserver une session individuelle de 20 minutes pour obtenir des informations, des conseils et des réponses à vos questions dans le cadre des<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
