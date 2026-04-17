---
id: >-
  from-pdfs-to-answers-building-a-rag-knowledge-base-with-paddleocr-milvus-and-ernie.md
title: >-
  Des PDF aux réponses : Construire une base de connaissances RAG avec
  PaddleOCR, Milvus et ERNIE
author: LiaoYF and Jing Zhang
date: 2026-3-17
cover: assets.zilliz.com/cover_747a1385ed.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'RAG, Milvus, vector database, hybrid search, knowledge base Q&A'
meta_title: |
  Build a RAG Knowledge Base with PaddleOCR, Milvus, and ERNIE
desc: >-
  Apprenez à construire une base de connaissances RAG de haute précision en
  utilisant Milvus, la recherche hybride, le reranking et le Q&amp;A multimodal
  pour l'intelligence documentaire.
origin: >-
  https://milvus.io/blog/from-pdfs-to-answers-building-a-rag-knowledge-base-with-paddleocr-milvus-and-ernie.md
---
<p>Les grands modèles de langage sont bien plus performants qu'en 2023, mais ils ont encore des hallucinations de confiance et s'appuient souvent sur des informations obsolètes. RAG (Retrieval-Augmented Generation) résout ces deux problèmes en extrayant le contexte pertinent d'une base de données vectorielle telle que <a href="https://milvus.io/">Milvus</a> avant que le modèle ne génère une réponse. Ce contexte supplémentaire permet d'ancrer la réponse dans des sources réelles et de la rendre plus actuelle.</p>
<p>L'un des cas d'utilisation les plus courants de la RAG est la base de connaissances d'une entreprise. Un utilisateur télécharge des PDF, des fichiers Word ou d'autres documents internes, pose une question en langage naturel et reçoit une réponse basée sur ces documents plutôt que sur le seul entraînement préalable du modèle.</p>
<p>Mais l'utilisation du même LLM et de la même base de données vectorielle ne garantit pas le même résultat. Deux équipes peuvent construire sur les mêmes bases et aboutir à des systèmes de qualité très différente. La différence provient généralement de tout ce qui se trouve en amont : <strong>la façon dont les documents sont analysés, découpés et intégrés ; la façon dont les données sont indexées ; la façon dont les résultats de la recherche sont classés ; et la façon dont la réponse finale est assemblée.</strong></p>
<p>Dans cet article, nous utiliserons <a href="https://github.com/LiaoYFBH/Paddle-ERNIE-RAG/blob/main/README_EN.md">Paddle-ERNIE-RAG</a> comme exemple et expliquerons comment construire une base de connaissances basée sur RAG avec <a href="https://github.com/PADDLEPADDLE/PADDLEOCR">PaddleOCR</a>, <a href="https://milvus.io/">Milvus</a> et ERNIE-4.5-Turbo.</p>
<h2 id="Paddle-ERNIE-RAG-System-Architecture" class="common-anchor-header">Architecture du système Paddle-ERNIE-RAG<button data-href="#Paddle-ERNIE-RAG-System-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>L'architecture Paddle-ERNIE-RAG se compose de quatre couches principales :</p>
<ul>
<li><strong>Couche d'extraction des données.</strong> <a href="https://github.com/PaddlePaddle/PaddleOCR">PP-StructureV3</a>, le pipeline d'analyse de documents de PaddleOCR, lit les PDF et les images avec une OCR tenant compte de la mise en page. Il préserve la structure du document - titres, tableaux, ordre de lecture - et produit un code Markdown propre, divisé en morceaux qui se chevauchent.</li>
<li><strong>Couche de stockage vectoriel.</strong> Chaque bloc est intégré dans un vecteur à 384 dimensions et stocké dans <a href="https://milvus.io"></a><a href="https://milvus.io">Milvus</a> avec les métadonnées (nom du fichier, numéro de page, identifiant du bloc). Un index parallèle inversé prend en charge la recherche par mot-clé.</li>
<li><strong>Couche de récupération et de réponse.</strong> Chaque requête est exécutée à la fois dans l'index vectoriel et dans l'index des mots-clés. Les résultats sont fusionnés par RRF (Reciprocal Rank Fusion), reclassés et transmis au modèle <a href="https://github.com/LiaoYFBH/Paddle-ERNIE-RAG">ERNIE</a> pour la génération de réponses.</li>
<li><strong>Couche d'application.</strong> Une interface<a href="https://www.gradio.app/">Gradio</a> <a href="https://www.gradio.app/"></a><a href="https://www.gradio.app/"></a> vous permet de télécharger des documents, de poser des questions et d'afficher les réponses avec les citations des sources et les scores de confiance.  <span class="img-wrapper">
    <img translate="no" src="blob:https://septemberfd.github.io/9043a059-de46-49b1-9399-f915aed555dc" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ul>
<p>Les sections ci-dessous décrivent chaque étape dans l'ordre, en commençant par la transformation des documents bruts en texte consultable.</p>
<h2 id="How-to-Build-RAG-Pipeline-Step-by-Step" class="common-anchor-header">Comment construire un pipeline RAG étape par étape<button data-href="#How-to-Build-RAG-Pipeline-Step-by-Step" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Step-1-Parse-Documents-with-PP-StructureV3" class="common-anchor-header">Étape 1 : Analyse des documents avec PP-StructureV3</h3><p>Les documents bruts sont le point de départ de la plupart des problèmes de précision. Les documents de recherche et les rapports techniques mélangent des mises en page à deux colonnes, des formules, des tableaux et des images. L'extraction du texte à l'aide d'une bibliothèque de base telle que PyPDF2 entraîne généralement une altération du résultat : les paragraphes apparaissent dans le désordre, les tableaux s'effondrent et les formules disparaissent.</p>
<p>Pour éviter ces problèmes, le projet crée une classe OnlinePDFParser dans backend.py. Cette classe appelle l'API en ligne PP-StructureV3 pour effectuer l'analyse de la mise en page. Au lieu d'extraire du texte brut, elle identifie la structure du document, puis le convertit au format Markdown.</p>
<p>Cette méthode présente trois avantages évidents :</p>
<ul>
<li><strong>Une sortie Markdown propre</strong></li>
</ul>
<p>La sortie est formatée au format Markdown avec des titres et des paragraphes appropriés. Le contenu est ainsi plus facile à comprendre pour le modèle.</p>
<ul>
<li><strong>Extraction séparée des images</strong></li>
</ul>
<p>Le système extrait et enregistre les images pendant l'analyse. Cela permet d'éviter la perte d'informations visuelles importantes.</p>
<ul>
<li><strong>Meilleure gestion du contexte</strong></li>
</ul>
<p>Le texte est découpé à l'aide d'une fenêtre coulissante avec chevauchement. Cela évite de couper des phrases ou des formules au milieu, ce qui permet de conserver un sens clair et d'améliorer la précision de la recherche.</p>
<p><strong>Flux d'analyse de base</strong></p>
<p>Dans backend.py, l'analyse syntaxique suit trois étapes simples :</p>
<ol>
<li>Envoyer le fichier PDF à l'API PP-StructureV3.</li>
<li>Lire les résultats de layoutParsingResults renvoyés.</li>
<li>Extraire le texte Markdown nettoyé et les images.</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># backend.py (Core logic summary of the OnlinePDFParser class)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">predict</span>(<span class="hljs-params">self, file_path</span>):
    <span class="hljs-comment"># 1. Convert file to Base64</span>
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_data = base64.b64encode(file.read()).decode(<span class="hljs-string">&quot;ascii&quot;</span>)
    <span class="hljs-comment"># 2. Build request payload</span>
    payload = {
        <span class="hljs-string">&quot;file&quot;</span>: file_data,
        <span class="hljs-string">&quot;fileType&quot;</span>: <span class="hljs-number">1</span>, <span class="hljs-comment"># PDF type</span>
        <span class="hljs-string">&quot;useChartRecognition&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-comment"># Configure based on requirements</span>
        <span class="hljs-string">&quot;useDocOrientationClassify&quot;</span>: <span class="hljs-literal">False</span>
    }
    <span class="hljs-comment"># 3. Send request to get Layout Parsing results</span>
    response = requests.post(<span class="hljs-variable language_">self</span>.api_url, json=payload, headers=headers)
    res_json = response.json()
    <span class="hljs-comment"># 4. Extract Markdown text and images</span>
    parsing_results = res_json.get(<span class="hljs-string">&quot;result&quot;</span>, {}).get(<span class="hljs-string">&quot;layoutParsingResults&quot;</span>, [])
    mock_outputs = []
    <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> parsing_results:
        md_text = item.get(<span class="hljs-string">&quot;markdown&quot;</span>, {}).get(<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
        images = item.get(<span class="hljs-string">&quot;markdown&quot;</span>, {}).get(<span class="hljs-string">&quot;images&quot;</span>, {})
        <span class="hljs-comment"># ... (subsequent image downloading and text cleaning logic)</span>
        mock_outputs.append(MockResult(md_text, images))
    <span class="hljs-keyword">return</span> mock_outputs, <span class="hljs-string">&quot;Success&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Chunk-Text-with-Sliding-Window-Overlap" class="common-anchor-header">Étape 2 : Découpage du texte avec chevauchement des fenêtres coulissantes</h3><p>Après l'analyse, le texte Markdown doit être divisé en morceaux plus petits (chunks) pour la recherche. Si le texte est coupé à des longueurs fixes, les phrases ou les formules peuvent être coupées en deux.</p>
<p>Pour éviter cela, le système utilise un découpage par fenêtre coulissante avec chevauchement. Chaque morceau partage une partie de la queue avec le suivant, de sorte que le contenu limitrophe apparaît dans les deux fenêtres. Cela permet de conserver le sens intact sur les bords des morceaux et d'améliorer le rappel de l'extraction.</p>
<pre><code translate="no"><span class="hljs-comment"># backend.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">split_text_into_chunks</span>(<span class="hljs-params">text: <span class="hljs-built_in">str</span>, chunk_size: <span class="hljs-built_in">int</span> = <span class="hljs-number">300</span>, overlap: <span class="hljs-built_in">int</span> = <span class="hljs-number">120</span></span>) -&gt; <span class="hljs-built_in">list</span>:
    <span class="hljs-string">&quot;&quot;&quot;Sliding window-based text chunking that preserves overlap-length contextual overlap&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> text: <span class="hljs-keyword">return</span> []
    lines = [line.strip() <span class="hljs-keyword">for</span> line <span class="hljs-keyword">in</span> text.split(<span class="hljs-string">&quot;\n&quot;</span>) <span class="hljs-keyword">if</span> line.strip()]
    chunks = []
    current_chunk = []
    current_length = <span class="hljs-number">0</span>
    <span class="hljs-keyword">for</span> line <span class="hljs-keyword">in</span> lines:
        <span class="hljs-keyword">while</span> <span class="hljs-built_in">len</span>(line) &gt; chunk_size:
            <span class="hljs-comment"># Handle overly long single line</span>
            part = line[:chunk_size]
            line = line[chunk_size:]
            current_chunk.append(part)
            <span class="hljs-comment"># ... (chunking logic) ...</span>
        current_chunk.append(line)
        current_length += <span class="hljs-built_in">len</span>(line)
        <span class="hljs-comment"># When accumulated length exceeds the threshold, generate a chunk</span>
        <span class="hljs-keyword">if</span> current_length &gt; chunk_size:
            chunks.append(<span class="hljs-string">&quot;\n&quot;</span>.join(current_chunk))
            <span class="hljs-comment"># Roll back: keep the last overlap-length text as the start of the next chunk</span>
            overlap_text = current_chunk[-<span class="hljs-number">1</span>][-overlap:] <span class="hljs-keyword">if</span> current_chunk <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>
            current_chunk = [overlap_text] <span class="hljs-keyword">if</span> overlap_text <span class="hljs-keyword">else</span> []
            current_length = <span class="hljs-built_in">len</span>(overlap_text)
    <span class="hljs-keyword">if</span> current_chunk:
        chunks.append(<span class="hljs-string">&quot;\n&quot;</span>.join(current_chunk).strip())
    <span class="hljs-keyword">return</span> chunks
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Store-Vectors-and-Metadata-in-Milvus" class="common-anchor-header">Étape 3 : Stockage des vecteurs et des métadonnées dans Milvus</h3><p>Les morceaux propres étant prêts, l'étape suivante consiste à les stocker d'une manière qui permette une récupération rapide et précise.</p>
<p><strong>Stockage des vecteurs et métadonnées</strong></p>
<p>Milvus applique des règles strictes pour les noms de collection - uniquement des lettres ASCII, des chiffres et des traits de soulignement. Si le nom d'une base de connaissances contient des caractères non ASCII, le backend l'encode en hexadécimal avec un préfixe kb_ avant de créer la collection et de la décoder pour l'affichage. Il s'agit d'un petit détail, mais qui permet d'éviter les erreurs cryptiques.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> binascii
<span class="hljs-keyword">import</span> re

<span class="hljs-keyword">def</span> <span class="hljs-title function_">encode_name</span>(<span class="hljs-params">ui_name</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert a foreign name into a Milvus-valid hexadecimal string&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> ui_name: <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;&quot;</span>
    <span class="hljs-comment"># If it only contains English letters, numbers, or underscores, return it directly</span>
    <span class="hljs-keyword">if</span> re.<span class="hljs-keyword">match</span>(<span class="hljs-string">r&#x27;^[a-zA-Z_][a-zA-Z0-9_]*$&#x27;</span>, ui_name):
        <span class="hljs-keyword">return</span> ui_name
    <span class="hljs-comment"># Encode to Hex and add the kb_ prefix</span>
    hex_str = binascii.hexlify(ui_name.encode(<span class="hljs-string">&#x27;utf-8&#x27;</span>)).decode(<span class="hljs-string">&#x27;utf-8&#x27;</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;kb_<span class="hljs-subst">{hex_str}</span>&quot;</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">decode_name</span>(<span class="hljs-params">real_name</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert a hexadecimal string back to original language&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> real_name.startswith(<span class="hljs-string">&quot;kb_&quot;</span>):
        <span class="hljs-keyword">try</span>:
            hex_str = real_name[<span class="hljs-number">3</span>:]
            <span class="hljs-keyword">return</span> binascii.unhexlify(hex_str).decode(<span class="hljs-string">&#x27;utf-8&#x27;</span>)
        <span class="hljs-keyword">except</span>:
            <span class="hljs-keyword">return</span> real_name
    <span class="hljs-keyword">return</span> real_name
<button class="copy-code-btn"></button></code></pre>
<p>Outre le nommage, chaque élément passe par deux étapes avant d'être inséré : la génération d'une intégration et l'ajout de métadonnées.</p>
<ul>
<li><strong>Ce qui est stocké :</strong></li>
</ul>
<p>Chaque morceau est converti en un vecteur dense à 384 dimensions. Parallèlement, le schéma Milvus stocke des champs supplémentaires tels que le nom du fichier, le numéro de page et l'identifiant du bloc.</p>
<ul>
<li><strong>Pourquoi c'est important :</strong></li>
</ul>
<p>Cela permet de retracer une réponse jusqu'à la page exacte d'où elle provient. Il prépare également le système à de futurs cas d'utilisation multimodaux de questions-réponses.</p>
<ul>
<li><strong>Optimisation des performances :</strong></li>
</ul>
<p>Dans vector_store.py, la méthode insert_documents utilise l'intégration par lots. Cela réduit le nombre de requêtes réseau et rend le processus plus efficace.</p>
<pre><code translate="no"><span class="hljs-comment"># vector_store.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">insert_documents</span>(<span class="hljs-params">self, documents</span>):
    <span class="hljs-string">&quot;&quot;&quot;Batch vectorization and insertion into Milvus&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> documents: <span class="hljs-keyword">return</span>
    <span class="hljs-comment"># 1. Extract plain text list and request the embedding model in batch</span>
    texts = [doc[<span class="hljs-string">&#x27;content&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> documents]
    embeddings = <span class="hljs-variable language_">self</span>.get_embeddings(texts)
    <span class="hljs-comment"># 2. Data cleaning: filter out invalid data where embedding failed</span>
    valid_docs, valid_vectors = [], []
    <span class="hljs-keyword">for</span> i, emb <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(embeddings):
        <span class="hljs-keyword">if</span> emb <span class="hljs-keyword">and</span> <span class="hljs-built_in">len</span>(emb) == <span class="hljs-number">384</span>: <span class="hljs-comment"># Ensure the vector dimension is correct</span>
            valid_docs.append(documents[i])
            valid_vectors.append(emb)
    <span class="hljs-comment"># 3. Assemble columnar data (Columnar Format)</span>
    <span class="hljs-comment"># Milvus insert API requires each field to be passed in list format</span>
    data = [
        [doc[<span class="hljs-string">&#x27;filename&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],  <span class="hljs-comment"># Scalar: file name</span>
        [doc[<span class="hljs-string">&#x27;page&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],      <span class="hljs-comment"># Scalar: page number (for traceability)</span>
        [doc[<span class="hljs-string">&#x27;chunk_id&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],  <span class="hljs-comment"># Scalar: chunk ID</span>
        [doc[<span class="hljs-string">&#x27;content&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],   <span class="hljs-comment"># Scalar: original content (for keyword search)</span>
        valid_vectors                             <span class="hljs-comment"># Vector: semantic vector</span>
    ]
    <span class="hljs-comment"># 4. Execute insertion and persistence</span>
    <span class="hljs-variable language_">self</span>.collection.insert(data)
    <span class="hljs-variable language_">self</span>.collection.flush()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Retrieve-with-Hybrid-Search-and-RRF-Fusion" class="common-anchor-header">Étape 4 : Récupérer avec la recherche hybride et la fusion RRF</h3><p>Une seule méthode de recherche est rarement suffisante. La recherche vectorielle permet de trouver des contenus sémantiquement similaires, mais peut ne pas trouver les termes exacts ; la recherche par mot-clé permet de trouver des termes spécifiques, mais ne permet pas de trouver des paraphrases. L'exécution des deux méthodes en parallèle et la fusion des résultats permettent d'obtenir de meilleurs résultats que si l'une d'entre elles était utilisée seule.</p>
<p>Lorsque la langue de la requête diffère de celle du document, le système traduit d'abord la requête à l'aide d'un LLM afin que les deux voies de recherche puissent fonctionner dans la langue du document. Les deux recherches sont ensuite exécutées en parallèle :</p>
<ul>
<li><strong>Recherche vectorielle (dense) :</strong> Elle permet de trouver des contenus dont la signification est similaire, même d'une langue à l'autre, mais peut faire apparaître des passages connexes qui ne répondent pas directement à la question.</li>
<li><strong>La recherche par mot-clé (peu dense) :</strong> Elle permet de trouver des correspondances exactes pour des termes techniques, des nombres ou des variables de formules - le type d'éléments que l'intégration vectorielle ne prend souvent pas en compte.</li>
</ul>
<p>Le système fusionne les deux listes de résultats à l'aide de la méthode RRF (Reciprocal Rank Fusion). Chaque candidat reçoit un score basé sur son rang dans chaque liste, de sorte qu'un élément qui apparaît en haut des <em>deux</em> listes obtient le score le plus élevé. La recherche vectorielle contribue à la couverture sémantique ; la recherche par mot-clé contribue à la précision des termes.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_From_PD_Fsto_Answers_Buildinga_RAG_Knowledge_Bas_1_d241e95fc2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no"><span class="hljs-comment"># Summary of retrieval logic in vector_store.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">search</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">10</span>, **kwargs</span>):
    <span class="hljs-string">&#x27;&#x27;&#x27;Vector search (Dense + Keyword) + RRF fusion&#x27;&#x27;&#x27;</span>
    <span class="hljs-comment"># 1. Vector search (Dense)</span>
    dense_results = []
    query_vector = <span class="hljs-variable language_">self</span>.embedding_client.get_embedding(query)  <span class="hljs-comment"># ... (Milvus search code) ...</span>
    <span class="hljs-comment"># 2. Keyword search</span>
    <span class="hljs-comment"># Perform jieba tokenization and build like &quot;%keyword%&quot; queries</span>
    keyword_results = <span class="hljs-variable language_">self</span>._keyword_search(query, top_k=top_k * <span class="hljs-number">5</span>, expr=expr)
    <span class="hljs-comment"># 3. RRF fusion</span>
    rank_dict = {}
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">apply_rrf</span>(<span class="hljs-params">results_list, k=<span class="hljs-number">60</span>, weight=<span class="hljs-number">1.0</span></span>):
        <span class="hljs-keyword">for</span> rank, item <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results_list):
            doc_id = item.get(<span class="hljs-string">&#x27;id&#x27;</span>) <span class="hljs-keyword">or</span> item.get(<span class="hljs-string">&#x27;chunk_id&#x27;</span>)
            <span class="hljs-keyword">if</span> doc_id <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> rank_dict:
                rank_dict[doc_id] = {<span class="hljs-string">&quot;data&quot;</span>: item, <span class="hljs-string">&quot;score&quot;</span>: <span class="hljs-number">0.0</span>}
            <span class="hljs-comment"># Core RRF formula</span>
            rank_dict[doc_id][<span class="hljs-string">&quot;score&quot;</span>] += weight * (<span class="hljs-number">1.0</span> / (k + rank))
    apply_rrf(dense_results, weight=<span class="hljs-number">4.0</span>)
    apply_rrf(keyword_results, weight=<span class="hljs-number">1.0</span>)
    <span class="hljs-comment"># 4. Sort and return results</span>
    sorted_docs = <span class="hljs-built_in">sorted</span>(rank_dict.values(), key=<span class="hljs-keyword">lambda</span> x: x[<span class="hljs-string">&#x27;score&#x27;</span>], reverse=<span class="hljs-literal">True</span>)
    <span class="hljs-keyword">return</span> [item[<span class="hljs-string">&#x27;data&#x27;</span>] <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> sorted_docs[:top_k * <span class="hljs-number">2</span>]]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Rerank-Results-Before-Answer-Generation" class="common-anchor-header">Étape 5 : Reclassement des résultats avant la génération des réponses</h3><p>Les éléments renvoyés par l'étape de recherche ne sont pas tous aussi pertinents les uns que les autres. C'est pourquoi, avant de générer la réponse finale, une étape de reclassement permet de les classer à nouveau.</p>
<p>Dans reranker_v2.py, une méthode de notation combinée évalue chaque élément, qui est noté selon cinq aspects :</p>
<ul>
<li><strong>Correspondance floue</strong></li>
</ul>
<p>À l'aide de fuzzywuzzy, nous vérifions dans quelle mesure le libellé de l'élément est similaire à celui de la requête. Cela permet de mesurer le chevauchement direct du texte.</p>
<ul>
<li><strong>Couverture des mots-clés</strong></li>
</ul>
<p>Nous vérifions combien de mots importants de la requête apparaissent dans le bloc. Plus il y a de correspondances entre les mots-clés, plus le score est élevé.</p>
<ul>
<li><strong>Similitude sémantique</strong></li>
</ul>
<p>Nous réutilisons le score de similarité vectorielle renvoyé par Milvus. Ce score reflète la proximité des significations.</p>
<ul>
<li><strong>Longueur et rang d'origine</strong></li>
</ul>
<p>Les morceaux très courts sont pénalisés parce qu'ils manquent souvent de contexte. Les morceaux qui étaient mieux classés dans les résultats originaux de Milvus bénéficient d'un petit bonus.</p>
<ul>
<li><strong>Détection des entités nommées</strong></li>
</ul>
<p>Le système détecte les termes en majuscules tels que "Milvus" ou "RAG" comme des noms propres probables, et identifie les termes techniques à plusieurs mots comme des expressions clés possibles.</p>
<p>Chaque facteur a un poids dans le score final (voir la figure ci-dessous).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_From_PD_Fsto_Answers_Buildinga_RAG_Knowledge_Bas_2_2bce5d382a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Il ne nécessite pas de données d'entraînement et la contribution de chaque facteur est visible. Si un élément se classe de manière inattendue à un niveau élevé ou bas, les scores expliquent pourquoi. Un reranker à boîte noire n'offre pas cette possibilité.</p>
<pre><code translate="no"><span class="hljs-comment"># reranker_v2.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">_calculate_composite_score</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, chunk: <span class="hljs-type">Dict</span>[<span class="hljs-built_in">str</span>, <span class="hljs-type">Any</span>]</span>) -&gt; <span class="hljs-built_in">float</span>:
    content = chunk.get(<span class="hljs-string">&#x27;content&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
    <span class="hljs-comment"># 1. Surface text similarity (FuzzyWuzzy)</span>
    fuzzy_score = fuzz.partial_ratio(query, content)
    <span class="hljs-comment"># 2. Keyword coverage</span>
    query_keywords = <span class="hljs-variable language_">self</span>._extract_keywords(query)
    content_keywords = <span class="hljs-variable language_">self</span>._extract_keywords(content)
    keyword_coverage = (<span class="hljs-built_in">len</span>(query_keywords &amp; content_keywords) / <span class="hljs-built_in">len</span>(query_keywords)) * <span class="hljs-number">100</span> <span class="hljs-keyword">if</span> query_keywords <span class="hljs-keyword">else</span> <span class="hljs-number">0</span>
    <span class="hljs-comment"># 3. Vector semantic score (normalized)</span>
    milvus_distance = chunk.get(<span class="hljs-string">&#x27;semantic_score&#x27;</span>, <span class="hljs-number">0</span>)
    milvus_similarity = <span class="hljs-number">100</span> / (<span class="hljs-number">1</span> + milvus_distance * <span class="hljs-number">0.1</span>)
    <span class="hljs-comment"># 4. Length penalty (prefer paragraphs between 200–600 characters)</span>
    content_len = <span class="hljs-built_in">len</span>(content)
    <span class="hljs-keyword">if</span> <span class="hljs-number">200</span> &lt;= content_len &lt;= <span class="hljs-number">600</span>:
        length_score = <span class="hljs-number">100</span>
    <span class="hljs-keyword">else</span>:
        <span class="hljs-comment"># ... (penalty logic)</span>
        length_score = <span class="hljs-number">100</span> - <span class="hljs-built_in">min</span>(<span class="hljs-number">50</span>, <span class="hljs-built_in">abs</span>(content_len - <span class="hljs-number">400</span>) / <span class="hljs-number">20</span>)
    <span class="hljs-comment"># Weighted sum</span>
    base_score = (
        fuzzy_score * <span class="hljs-number">0.25</span> +
        keyword_coverage * <span class="hljs-number">0.25</span> +
        milvus_similarity * <span class="hljs-number">0.35</span> +
        length_score * <span class="hljs-number">0.15</span>
    )
    <span class="hljs-comment"># Position weight</span>
    position_bonus = <span class="hljs-number">0</span>
    <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;milvus_rank&#x27;</span> <span class="hljs-keyword">in</span> chunk:
        rank = chunk[<span class="hljs-string">&#x27;milvus_rank&#x27;</span>]
        position_bonus = <span class="hljs-built_in">max</span>(<span class="hljs-number">0</span>, <span class="hljs-number">20</span> - rank)
    <span class="hljs-comment"># Extra bonus for proper noun detection</span>
    proper_noun_bonus = <span class="hljs-number">30</span> <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>._check_proper_nouns(query, content) <span class="hljs-keyword">else</span> <span class="hljs-number">0</span>
    <span class="hljs-keyword">return</span> base_score + proper_noun_bonus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Add-Multimodal-QA-for-Charts-and-Diagrams" class="common-anchor-header">Étape 6 : ajouter des questions-réponses multimodales pour les graphiques et les diagrammes</h3><p>Les documents de recherche contiennent souvent des graphiques et des diagrammes importants qui apportent des informations que le texte n'apporte pas. Un pipeline RAG ne contenant que du texte passerait complètement à côté de ces signaux.  Pour y remédier, nous avons ajouté une fonction simple de questions-réponses basée sur l'image et comprenant trois parties :</p>
<p><strong>1. Ajouter plus de contexte à l'invite</strong></p>
<p>Lorsqu'il envoie une image au modèle, le système obtient également le texte OCR de la même page.<br>
L'invite comprend : l'image, le texte de la page et la question de l'utilisateur.<br>
Cela permet au modèle de comprendre le contexte complet et de réduire les erreurs lors de la lecture de l'image.</p>
<pre><code translate="no"><span class="hljs-comment"># backend.py - Core logic for multimodal Q&amp;A</span>
<span class="hljs-comment"># 1. Retrieve OCR text from the current page as background context</span>
<span class="hljs-comment"># The system pulls the full page text where the image appears from Milvus,</span>
<span class="hljs-comment"># based on the document name and page number.</span>
<span class="hljs-comment"># page_num is parsed from the image file name sent by the frontend (e.g., &quot;p3_figure.jpg&quot; -&gt; Page 3)</span>
page_text_context = milvus_store.get_page_content(doc_name, page_num)[:<span class="hljs-number">800</span>]
<span class="hljs-comment"># 2. Dynamically build a context-enhanced prompt</span>
<span class="hljs-comment"># Key idea: explicitly align visual information with textual background</span>
<span class="hljs-comment"># to prevent hallucinations caused by answering from the image alone</span>
final_prompt = <span class="hljs-string">f&quot;&quot;&quot;
[Task] Answer the question using both the image and the background information.
[Image Metadata] Source: <span class="hljs-subst">{doc_name}</span> (P<span class="hljs-subst">{page_num}</span>)
[Background Text] <span class="hljs-subst">{page_text_context}</span> ... (long text omitted here)
[User Question] <span class="hljs-subst">{user_question}</span>
&quot;&quot;&quot;</span>
<span class="hljs-comment"># 3. Send multimodal request (Vision API)</span>
<span class="hljs-comment"># The underlying layer converts the image to Base64 and sends it</span>
<span class="hljs-comment"># together with final_prompt to the ERNIE-VL model</span>
answer = ernie_client.chat_with_image(query=final_prompt, image_path=img_path)
<button class="copy-code-btn"></button></code></pre>
<p><strong>2. Prise en charge de l'API Vision</strong></p>
<p>Le client (ernie_client.py) prend en charge le format de vision OpenAI. Les images sont converties en Base64 et envoyées dans le format image_url, ce qui permet au modèle de traiter à la fois l'image et le texte.</p>
<pre><code translate="no"><span class="hljs-comment"># ernie_client.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">chat_with_image</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, image_path: <span class="hljs-built_in">str</span></span>):
   base64_image = <span class="hljs-variable language_">self</span>._encode_image(image_path)
   <span class="hljs-comment"># Build Vision message format</span>
   messages = [
      {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
            <span class="hljs-string">&quot;content&quot;</span>: [
               {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: query},
               {
                  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>,
                  <span class="hljs-string">&quot;image_url&quot;</span>: {
                        <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">f&quot;data:image/jpeg;base64,<span class="hljs-subst">{base64_image}</span>&quot;</span>
                  }
               }
            ]
      }
   ]
   <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.chat(messages)
<button class="copy-code-btn"></button></code></pre>
<p><strong>3. Plan de repli</strong></p>
<p>Si l'API image échoue (par exemple, en raison de problèmes de réseau ou de limites du modèle), le système revient à un RAG normal basé sur le texte.<br>
Il utilise le texte ROC pour répondre à la question, de sorte que le système continue à fonctionner sans interruption.</p>
<pre><code translate="no"><span class="hljs-comment"># Fallback logic in backend.py</span>
<span class="hljs-keyword">try</span>:
   answer = ernie.chat_with_image(final_prompt, img_path)
   <span class="hljs-comment"># ...</span>
<span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;⚠️ Model does not support images. Switching to text mode.&quot;</span>)
   <span class="hljs-comment"># Fallback: use the extracted text as context to continue answering</span>
   answer, metric = ask_question_logic(final_prompt, collection_name)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Key-UI-Features-and-Implementation-for-Pipeline" class="common-anchor-header">Fonctionnalités clés de l'interface utilisateur et mise en œuvre pour le pipeline<button data-href="#Key-UI-Features-and-Implementation-for-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="How-to-Handle-API-Rate-Limiting-and-Protection" class="common-anchor-header">Comment gérer la limitation et la protection du débit de l'API ?</h3><p>Lors de l'appel de LLM ou de l'intégration d'API, le système peut parfois recevoir une erreur <strong>429 Too Many Requests</strong>. Cela se produit généralement lorsque trop de demandes sont envoyées dans un court laps de temps.</p>
<p>Pour gérer ce problème, le projet ajoute un mécanisme de ralentissement adaptatif dans ernie_client.py. Si une erreur de limite de taux se produit, le système réduit automatiquement la vitesse de la requête et réessaie au lieu de s'arrêter.</p>
<pre><code translate="no"><span class="hljs-comment"># Logic for handling rate limiting</span>
<span class="hljs-keyword">if</span> is_rate_limit:
    <span class="hljs-variable language_">self</span>._adaptive_slow_down()  <span class="hljs-comment"># Permanently increase the request interval</span>
    wait_time = (<span class="hljs-number">2</span> ** attempt) + random.uniform(<span class="hljs-number">1.0</span>, <span class="hljs-number">3.0</span>)  <span class="hljs-comment"># Exponential backoff</span>
    time.sleep(wait_time)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">_adaptive_slow_down</span>(<span class="hljs-params">self</span>):
    <span class="hljs-string">&quot;&quot;&quot;Trigger adaptive downgrade: when rate limiting occurs, permanently increase the global request interval&quot;&quot;&quot;</span>
    <span class="hljs-variable language_">self</span>.current_delay = <span class="hljs-built_in">min</span>(<span class="hljs-variable language_">self</span>.current_delay * <span class="hljs-number">2.0</span>, <span class="hljs-number">15.0</span>)
    logger.warning(<span class="hljs-string">f&quot;📉 Rate limit triggered (429), system automatically slowing down: new interval <span class="hljs-subst">{self.current_delay:<span class="hljs-number">.2</span>f}</span>s&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Cela permet de maintenir la stabilité du système, en particulier lors du traitement et de l'intégration d'un grand nombre de documents.</p>
<h3 id="Custom-Styling" class="common-anchor-header">Style personnalisé</h3><p>L'interface utilise Gradio (main.py). Nous avons ajouté un CSS personnalisé (modern_css) pour rendre l'interface plus propre et plus facile à utiliser.</p>
<ul>
<li><strong>Boîte de saisie</strong></li>
</ul>
<p>Le style gris par défaut a été remplacé par un design blanc et arrondi. Il est plus simple et plus moderne.</p>
<ul>
<li><strong>Bouton d'envoi</strong></li>
</ul>
<p>Ajout d'un dégradé de couleurs et d'un effet de survol pour qu'il soit plus visible.</p>
<pre><code translate="no"><span class="hljs-comment">/* main.py - modern_css snippet */</span>
<span class="hljs-comment">/* Force the input box to use a white background with rounded corners, simulating a modern chat app */</span>
.custom-textbox textarea {
    background-color: 
<span class="hljs-meta">#ffffff</span>
 !important;
    border: <span class="hljs-number">1</span>px solid 
<span class="hljs-meta">#e5e7eb</span>
 !important;
    border-radius: <span class="hljs-number">12</span>px !important;
    box-shadow: <span class="hljs-number">0</span> <span class="hljs-number">4</span>px <span class="hljs-number">12</span><span class="hljs-function">px <span class="hljs-title">rgba</span>(<span class="hljs-params"><span class="hljs-number">0</span>,<span class="hljs-number">0</span>,<span class="hljs-number">0</span>,<span class="hljs-number">0.05</span></span>) !important</span>;
    padding: <span class="hljs-number">14</span>px !important;
}
<span class="hljs-comment">/* Gradient send button */</span>
.send-btn {
    background: linear-gradient(<span class="hljs-number">135</span>deg, 
<span class="hljs-meta">#6366f1</span>
 <span class="hljs-number">0</span>%, 
<span class="hljs-meta">#4f46e5</span>
 <span class="hljs-number">100</span>%) !important;
    color: white !important;
    box-shadow: <span class="hljs-number">0</span> <span class="hljs-number">4</span>px <span class="hljs-number">10</span><span class="hljs-function">px <span class="hljs-title">rgba</span>(<span class="hljs-params"><span class="hljs-number">99</span>, <span class="hljs-number">102</span>, <span class="hljs-number">241</span>, <span class="hljs-number">0.3</span></span>) !important</span>;
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="LaTeX-Formula-Rendering" class="common-anchor-header">Rendu des formules LaTeX</h3><p>De nombreux documents de recherche contiennent des formules mathématiques, d'où l'importance d'un rendu correct. Nous avons ajouté une prise en charge complète de LaTeX pour les formules en ligne et en bloc.</p>
<ul>
<li><strong>Domaine d'application</strong>La configuration fonctionne à la fois dans la fenêtre de discussion (Chatbot) et dans la zone de résumé (Markdown).</li>
<li><strong>Résultat pratique</strong>Que les formules apparaissent dans la réponse du modèle ou dans les résumés des documents, elles sont rendues correctement sur la page.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Configure LaTeX rules in main.py</span>
latex_config = [
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;$$&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;$$&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">True</span>},    <span class="hljs-comment"># Recognize block equations</span>
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;$&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;$&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">False</span>},     <span class="hljs-comment"># Recognize inline equations</span>
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;\(&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;\)&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">False</span>}, <span class="hljs-comment"># Standard LaTeX inline</span>
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;\[&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;\]&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">True</span>}   <span class="hljs-comment"># Standard LaTeX block</span>
]
<span class="hljs-comment"># Then inject this configuration when initializing components:</span>
<span class="hljs-comment"># Enable LaTeX in Chatbot</span>
chatbot = gr.Chatbot(
    label=<span class="hljs-string">&quot;Conversation&quot;</span>,
    <span class="hljs-comment"># ... other parameters ...</span>
    latex_delimiters=latex_config  <span class="hljs-comment"># Key configuration: enable formula rendering</span>
)
<span class="hljs-comment"># Enable LaTeX in the document summary area</span>
doc_summary = gr.Markdown(
    value=<span class="hljs-string">&quot;*No summary available*&quot;</span>,
    latex_delimiters=latex_config
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Explainability-Relevance-Scores-and-Confidence" class="common-anchor-header">Explicabilité : Scores de pertinence et confiance</h3><p>Pour éviter une expérience "boîte noire", le système affiche deux indicateurs simples :</p>
<ul>
<li><p><strong>Pertinence</strong></p></li>
<li><p>Apparaît sous chaque réponse dans la section "Références".</p></li>
<li><p>Affiche le score du reranker pour chaque élément cité.</p></li>
<li><p>Aide les utilisateurs à comprendre pourquoi une page ou un passage spécifique a été utilisé.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># backend.py - Build reference source list</span>
sources = <span class="hljs-string">&quot;\n\n📚 **References:**\n&quot;</span>
<span class="hljs-keyword">for</span> c <span class="hljs-keyword">in</span> final:
    <span class="hljs-comment"># ... (deduplication logic) ...</span>
    <span class="hljs-comment"># Directly pass through the per-chunk score calculated by the Reranker</span>
    sources += <span class="hljs-string">f&quot;- <span class="hljs-subst">{key}</span> [Relevance:<span class="hljs-subst">{c.get(<span class="hljs-string">&#x27;composite_score&#x27;</span>,<span class="hljs-number">0</span>):<span class="hljs-number">.0</span>f}</span>%]\n&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><p><strong>Confiance</strong></p></li>
<li><p>Affiché dans le panneau "Détails de l'analyse".</p></li>
<li><p>Basé sur le score de l'élément le plus important (échelle de 100 %).</p></li>
<li><p>Indique le degré de confiance du système dans la réponse.</p></li>
<li><p>Si elle est inférieure à 60 %, la réponse peut être moins fiable.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># backend.py - Calculate overall confidence</span>
<span class="hljs-comment"># 1. Get the top-ranked chunk after reranking</span>
final = processed[:<span class="hljs-number">22</span>]
top_score = final[<span class="hljs-number">0</span>].get(<span class="hljs-string">&#x27;composite_score&#x27;</span>, <span class="hljs-number">0</span>) <span class="hljs-keyword">if</span> final <span class="hljs-keyword">else</span> <span class="hljs-number">0</span>
<span class="hljs-comment"># 2. Normalize the score (capped at 100%) as the overall &quot;confidence&quot; for this Q&amp;A</span>
metric = <span class="hljs-string">f&quot;<span class="hljs-subst">{<span class="hljs-built_in">min</span>(<span class="hljs-number">100</span>, top_score):<span class="hljs-number">.1</span>f}</span>%&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>L'interface utilisateur est illustrée ci-dessous. Dans l'interface, chaque réponse indique le numéro de page de la source et son score de pertinence.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_ec01986414.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_98d526ce64.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_99e9d19162.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_a82aaa6ddd.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>La précision du RAG dépend de l'ingénierie entre un LLM et une base de données vectorielle. Cet article présente une construction <a href="https://github.com/LiaoYFBH/Paddle-ERNIE-RAG/blob/main/README_EN.md">Paddle-ERNIE-RAG</a> avec <a href="https://milvus.io"></a><a href="https://milvus.io">Milvus</a> qui couvre chaque étape de cette ingénierie :</p>
<ul>
<li><strong>Analyse du document.</strong> PP-StructureV3 (via <a href="https://github.com/PaddlePaddle/PaddleOCR"></a><a href="https://github.com/PaddlePaddle/PaddleOCR">PaddleOCR</a>) convertit les PDF en Markdown propre avec un OCR prenant en compte la mise en page, préservant les titres, les tableaux et les images que les extracteurs de base perdent.</li>
<li><strong>Chunking.</strong> Les scissions par fenêtre coulissante avec chevauchement conservent le contexte intact aux limites des morceaux, évitant ainsi les fragments brisés qui nuisent au rappel de la recherche.</li>
<li><strong>Stockage des vecteurs dans Milvus.</strong> Stocker les vecteurs de manière à permettre une extraction rapide et précise.</li>
<li><strong>Recherche hybride.</strong> L'exécution en parallèle de la recherche vectorielle et de la recherche par mot-clé, puis la fusion des résultats avec la méthode RRF (Reciprocal Rank Fusion), permet d'obtenir à la fois des correspondances sémantiques et des occurrences de termes exacts que l'une ou l'autre de ces méthodes ne permettrait pas d'obtenir à elle seule.</li>
<li><strong>Reranking.</strong> Un reranker transparent, basé sur des règles, évalue chaque morceau en fonction de la correspondance floue, de la couverture des mots-clés, de la similarité sémantique, de la longueur et de la détection des noms propres - aucune donnée d'entraînement n'est nécessaire et chaque score peut être débogué.</li>
<li><strong>Questions et réponses multimodales.</strong> L'association d'images et de texte de page OCR dans l'invite donne au modèle de vision suffisamment de contexte pour répondre aux questions sur les graphiques et les diagrammes, avec une solution de repli en texte seul si l'API de l'image échoue.</li>
</ul>
<p>Si vous construisez un système RAG pour les questions-réponses sur les documents et que vous souhaitez améliorer la précision, nous serions ravis de savoir comment vous abordez la question.</p>
<p>Vous avez des questions sur <a href="https://milvus.io/">Milvus</a>, la recherche hybride ou la conception de bases de connaissances ? Rejoignez notre <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canal Slack</a> ou réservez une session <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours de</a> 20 minutes pour discuter de votre cas d'utilisation.</p>
