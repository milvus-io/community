---
id: milvus-3-0-structarray.md
title: >-
  Une entité, plusieurs vecteurs : recherche au niveau entité et élément avec
  StructArray de Milvus 3.0
author: Chenjie Tang
date: 2026-8-19
cover: assets.zilliz.com/milvus_3_0_entity_and_element_level_search_28bba6d843.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus 3.0, StructArray, multi-vector search, EmbeddingList search,
  element-level search
meta_title: |
  Milvus 3.0 StructArray: Multi-Vector Search Within One Entity
desc: >-
  Une entité peut contenir plusieurs vecteurs alignés et des champs de
  métadonnées, et Milvus peut rechercher soit l'entité entière, soit un élément
  individuel sans aplatir les données en lignes séparées.
origin: 'https://milvus.io/blog/milvus-3-0-structarray.md'
---
<p>La plupart des schémas de bases de données vectorielles partent d'une hypothèse simple : une entité, un embedding. Un produit reçoit un vecteur, tout comme un document. Une requête utilisateur est vectorisée puis comparée à ces vecteurs via une recherche de plus proches voisins approximatifs (ANN). Ce modèle fonctionne pour la première génération de cas d'usage de recherche vectorielle, notamment le RAG, la recherche sémantique et les systèmes de recommandation.</p>
<p><strong>Les données d'IA du monde réel, cependant, correspondent rarement à cette hypothèse.</strong> Une vidéo contient des clips, des plans ou des images clés, chacun avec son propre embedding, sa plage temporelle, sa légende, son étiquette de scène et son score de confiance. Un produit peut avoir plusieurs images et angles de vue. Un document long contient des passages ou des sections dont la signification locale importe plus qu'un embedding unique de l'ensemble du document. Les modèles à interaction tardive populaires exposent la même limite à une granularité encore plus fine : ColBERT produit un vecteur par jeton, tandis que ColPali produit un vecteur par patch visuel.</p>
<p>Dans chaque cas, l'entité parente reste l'unité que l'application stocke, affiche, sécurise et retourne. Pourtant, la pertinence, le filtrage et l'explication des résultats dépendent souvent d'éléments situés à l'intérieur de cette entité.</p>
<p><strong>La nouvelle fonctionnalité StructArray donne à Milvus un modèle de données natif pour cette forme : une entité contient un tableau ordonné d'éléments Struct définis par le schéma, et chaque élément peut porter des métadonnées scalaires, des embeddings vectoriels, ou les deux.</strong> Milvus peut filtrer les champs appartenant au même élément, comparer deux listes d'embeddings au niveau de l'entité, ou rechercher des éléments individuels et retourner le décalage correspondant.</p>
<p>Cet article utilise un exemple de recherche vidéo pour expliquer le modèle de données, puis le suit à travers la conception du schéma, le filtrage, les granularités de recherche vectorielle, les stratégies d'indexation EmbeddingList, la fusion des résultats hybrides et la structure physique qui rend la fonctionnalité exécutable.</p>
<h2 id="Why-one-vector-and-one-flat-row-model-are-no-longer-enough" class="common-anchor-header">Pourquoi le modèle à un vecteur et une ligne plate ne suffit plus<button data-href="#Why-one-vector-and-one-flat-row-model-are-no-longer-enough" class="anchor-icon" translate="no">
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
    </button></h2><p>Prenons l'exemple d'un utilisateur qui recherche dans un catalogue vidéo « une personne coupant des légumes dans une cuisine ». Le signal pertinent peut se trouver dans un clip de huit secondes, et non dans un embedding de la vidéo entière. <strong>Compresser chaque clip, objet et action dans un vecteur unique peut préserver le sujet général, mais cela peut estomper les détails locaux.</strong></p>
<p>La même inadéquation apparaît dans d'autres charges de travail :</p>
<ul>
<li>La pertinence d'un produit peut provenir de l'une de ses plusieurs images ou angles.</li>
<li>Un document peut correspondre grâce à un passage plutôt qu'à son sujet général.</li>
<li>Une mémoire d'agent peut contenir plusieurs observations, dont une seule importe pour la tâche en cours.</li>
<li>Un enregistrement ColBERT ou ColPali contient une liste de longueur variable de vecteurs de jetons ou de patches plutôt qu'un seul vecteur dense.</li>
</ul>
<p>Une alternative consiste à diviser chaque clip, image ou passage en une ligne de base de données distincte. Cela permet la recherche locale, mais sépare également chaque fragment de son entité parente. Les métadonnées parentes peuvent être répétées sur plusieurs lignes, et la récupération au niveau de l'entité nécessite alors un regroupement, une déduplication et un reclassement après la recherche de fragments.</p>
<p>Le stockage imbriqué seul ne résout pas le problème des requêtes. JSON peut stocker des objets, mais il ne donne pas à Milvus un schéma de sous-champs prédéfini pour l'indexation vectorielle et scalaire. Les tableaux parallèles peuvent stocker les légendes, les étiquettes de scène et les valeurs de confiance, mais l'application doit maintenir l'alignement des décalages. La base de données ne peut pas déduire de manière fiable que <code translate="no">scene_type[3]</code> et <code translate="no">label_confidence[3]</code> décrivent le même clip, à moins que cette relation ne fasse partie du modèle de données.</p>
<p>StructArray encode cette relation directement. Il conserve les éléments locaux à l'intérieur de l'entité parente tout en exposant leurs sous-champs alignés à la validation du schéma, à l'indexation, au filtrage et à la recherche vectorielle.</p>
<h2 id="What-is-StructArray-and-its-data-model" class="common-anchor-header">Qu'est-ce que StructArray et son modèle de données ?<button data-href="#What-is-StructArray-and-its-data-model" class="anchor-icon" translate="no">
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
    </button></h2><p>Un StructArray, également appelé tableau de structures, stocke un ensemble ordonné d'éléments Struct dans chaque entité. Un champ StructArray est un <code translate="no">Array</code> dont tous les éléments suivent un schéma <code translate="no">Struct</code> prédéfini. Pour une collection vidéo, la forme logique pourrait ressembler à ceci :</p>
<pre><code translate="no">Plaintext
clips: ARRAY&lt;STRUCT&lt;
    clip_embedding_list: FLOAT_VECTOR,
    clip_embedding: FLOAT_VECTOR,
    start_sec: DOUBLE,
    end_sec: DOUBLE,
    caption: VARCHAR,
    scene_type: VARCHAR,
    label_confidence: FLOAT
&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Ici :</p>
<ul>
<li><code translate="no">clips</code> est le champ StructArray parent.</li>
<li><code translate="no">clip_embedding_list</code>, <code translate="no">clip_embedding</code>, <code translate="no">start_sec</code> et les autres attributs sont des sous-champs.</li>
<li><code translate="no">clips[0]</code> est le premier clip.</li>
<li>Chaque sous-champ au décalage <code translate="no">0</code> appartient à ce même clip.</li>
<li>Chaque sous-champ au décalage <code translate="no">3</code> appartient à un autre clip.</li>
</ul>
<p>Les deux sous-champs vectoriels servent différents modes de recherche. <code translate="no">clips[clip_embedding_list]</code> est indexé avec une métrique <code translate="no">MAX_SIM*</code> pour la recherche EmbeddingList au niveau de l'entité, tandis que <code translate="no">clips[clip_embedding]</code> est indexé avec une métrique vectorielle régulière pour la recherche au niveau de l'élément. Comme un champ vectoriel ou un sous-champ vectoriel n'accepte qu'un seul index, une collection qui nécessite les deux modes doit définir et indexer les deux sous-champs séparément.</p>
<p>Ce modèle prend en charge trois sémantiques de requête distinctes.</p>
<h3 id="1-EmbeddingList-search-returns-parent-entities" class="common-anchor-header">1. La recherche EmbeddingList retourne les entités parentes</h3><p>Les vecteurs dans <code translate="no">clips[clip_embedding_list]</code> forment une liste d'embeddings pour la vidéo. La requête est également un <code translate="no">EmbeddingList</code>. Milvus compare la liste de requête avec chaque liste stockée en utilisant une métrique <code translate="no">MAX_SIM*</code> et retourne un résultat au niveau de l'entité.</p>
<pre><code translate="no">Plaintext
clips[clip_embedding_list] = [
    embedding_0,
    embedding_1,
    embedding_2,
    ...
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-The-MATCH-family-filters-parent-entities" class="common-anchor-header">2. La famille <code translate="no">MATCH_*</code> filtre les entités parentes</h3><p><code translate="no">MATCH_ANY</code>, <code translate="no">MATCH_ALL</code>, <code translate="no">MATCH_LEAST</code>, <code translate="no">MATCH_MOST</code> et <code translate="no">MATCH_EXACT</code> évaluent un prédicat sur les éléments Struct, comptent combien d'éléments le satisfont et décident si l'entité parente passe le filtre.</p>
<p>Par exemple :</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">MATCH_ANY</span><span class="hljs-params">(clips, $[scene_type] == <span class="hljs-string">&quot;kitchen&quot;</span> &amp;&amp; $[label_confidence] &gt; <span class="hljs-number">0.8</span>)</span>
<button class="copy-code-btn"></button></code></pre>
<p>Les deux conditions scalaires doivent être vraies au même décalage de clip. Milvus ne combine pas une étiquette de cuisine d'un clip avec une valeur de confiance élevée d'un autre.</p>
<h3 id="3-Element-level-search-returns-the-matching-element-offset" class="common-anchor-header">3. La recherche au niveau de l'élément retourne le décalage de l'élément correspondant</h3><p>Un vecteur de requête régulier peut rechercher chaque vecteur dans <code translate="no">clips[clip_embedding]</code> indépendamment. Chaque correspondance identifie l'entité parente et le décalage basé sur zéro de l'élément Struct correspondant. Un <code translate="no">element_filter</code> peut restreindre quels éléments participent à cette recherche vectorielle.</p>
<p>Ces opérations partagent une prémisse : Milvus sait quelles valeurs vectorielles et scalaires appartiennent au même élément, et quels éléments appartiennent à la même entité.</p>
<p>StructArray n'est pas un système d'imbrication arbitraire à usage général. Son modèle actuel est un <code translate="no">Array</code> d'éléments <code translate="no">Struct</code> avec des sous-champs scalaires et vectoriels pris en charge. Cette limite rend l'indexation des sous-champs et l'exécution consciente des éléments réalisables.</p>
<h2 id="Build-the-schema-indexes-and-insert-path" class="common-anchor-header">Construire le schéma, les index et le chemin d'insertion<button data-href="#Build-the-schema-indexes-and-insert-path" class="anchor-icon" translate="no">
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
    </button></h2><p>L'exemple PyMilvus simplifié suivant crée une collection vidéo avec un vecteur de niveau supérieur et un StructArray pour les clips. Il utilise des sous-champs vectoriels de clip séparés afin que la même collection puisse démontrer les deux modes de recherche.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> DataType, MilvusClient

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

schema = client.create_schema(auto_id=<span class="hljs-literal">False</span>, enable_dynamic_field=<span class="hljs-literal">False</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;title&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;video_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)

<span class="hljs-comment"># Define the Struct schema explicitly.</span>
clip_schema = client.create_struct_field_schema()
clip_schema.add_field(<span class="hljs-string">&quot;clip_embedding_list&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)
clip_schema.add_field(<span class="hljs-string">&quot;clip_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)
clip_schema.add_field(<span class="hljs-string">&quot;start_sec&quot;</span>, DataType.DOUBLE)
clip_schema.add_field(<span class="hljs-string">&quot;end_sec&quot;</span>, DataType.DOUBLE)
clip_schema.add_field(<span class="hljs-string">&quot;caption&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">2048</span>)
clip_schema.add_field(<span class="hljs-string">&quot;scene_type&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">128</span>)
clip_schema.add_field(<span class="hljs-string">&quot;label_confidence&quot;</span>, DataType.FLOAT)

schema.add_field(
    <span class="hljs-string">&quot;clips&quot;</span>,
    datatype=DataType.ARRAY,
    element_type=DataType.STRUCT,
    struct_schema=clip_schema,
    max_capacity=<span class="hljs-number">1024</span>,
)

client.create_collection(<span class="hljs-string">&quot;videos&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p>Les sous-champs vectoriels doivent être indexés avant la recherche. Comme la famille de métriques détermine le mode de recherche, chaque sous-champ vectoriel reçoit son propre index :</p>
<pre><code translate="no" class="language-python">index_params = client.prepare_index_params()

<span class="hljs-meta"># EmbeddingList search.</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;clips[clip_embedding_list]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
    index_name=<span class="hljs-string">&quot;clips_clip_embedding_list_maxsim_idx&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>},
)

<span class="hljs-meta"># Element-level search.</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    index_name=<span class="hljs-string">&quot;clips_clip_embedding_cosine_idx&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>},
)

client.create_index(<span class="hljs-string">&quot;videos&quot;</span>, index_params=index_params)
<button class="copy-code-btn"></button></code></pre>
<p>Les index scalaires sont optionnels, mais les sous-champs qui apparaissent fréquemment dans les filtres à grande échelle devraient utiliser un index scalaire compatible. Par exemple, <code translate="no">clips[scene_type]</code> peut utiliser un index inversé, tandis qu'un sous-champ numérique tel que <code translate="no">clips[label_confidence]</code> peut utiliser un index adapté au filtrage numérique.</p>
<p>Insérez les données dans leur forme d'entité naturelle : une ligne vidéo avec un tableau d'objets clip. Pour garder l'exemple compact, il écrit le même vecteur de clip dans les deux sous-champs vectoriels.</p>
<pre><code translate="no" class="language-python">rows = [
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;cooking tutorial&quot;</span>,
        <span class="hljs-string">&quot;video_embedding&quot;</span>: video_vec,
        <span class="hljs-string">&quot;clips&quot;</span>: [
            {
                <span class="hljs-string">&quot;clip_embedding_list&quot;</span>: clip_vec_1,
                <span class="hljs-string">&quot;clip_embedding&quot;</span>: clip_vec_1,
                <span class="hljs-string">&quot;start_sec&quot;</span>: <span class="hljs-number">0.0</span>,
                <span class="hljs-string">&quot;end_sec&quot;</span>: <span class="hljs-number">8.0</span>,
                <span class="hljs-string">&quot;caption&quot;</span>: <span class="hljs-string">&quot;A person washes vegetables.&quot;</span>,
                <span class="hljs-string">&quot;scene_type&quot;</span>: <span class="hljs-string">&quot;kitchen&quot;</span>,
                <span class="hljs-string">&quot;label_confidence&quot;</span>: <span class="hljs-number">0.92</span>,
            },
            {
                <span class="hljs-string">&quot;clip_embedding_list&quot;</span>: clip_vec_2,
                <span class="hljs-string">&quot;clip_embedding&quot;</span>: clip_vec_2,
                <span class="hljs-string">&quot;start_sec&quot;</span>: <span class="hljs-number">8.0</span>,
                <span class="hljs-string">&quot;end_sec&quot;</span>: <span class="hljs-number">16.0</span>,
                <span class="hljs-string">&quot;caption&quot;</span>: <span class="hljs-string">&quot;A person cuts carrots on a board.&quot;</span>,
                <span class="hljs-string">&quot;scene_type&quot;</span>: <span class="hljs-string">&quot;kitchen&quot;</span>,
                <span class="hljs-string">&quot;label_confidence&quot;</span>: <span class="hljs-number">0.96</span>,
            },
        ],
    }
]

client.<span class="hljs-title function_">insert</span>(<span class="hljs-string">&quot;videos&quot;</span>, rows)
client.<span class="hljs-title function_">flush</span>(<span class="hljs-string">&quot;videos&quot;</span>)
client.<span class="hljs-title function_">load_collection</span>(<span class="hljs-string">&quot;videos&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>À la frontière de l'API, <code translate="no">clips</code> reste un tableau d'objets structurés. À l'intérieur de Milvus, chaque sous-champ suit le chemin typé requis pour son propre index, filtre et comportement de sortie. Cette distinction est transparente au moment de l'insertion mais fondamentale pour tout ce qui suit.</p>
<h2 id="Same-element-filtering-is-the-difference-between-structure-and-parallel-arrays" class="common-anchor-header">Le filtrage au sein du même élément est la différence entre structure et tableaux parallèles<button data-href="#Same-element-filtering-is-the-difference-between-structure-and-parallel-arrays" class="anchor-icon" translate="no">
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
    </button></h2><p>Le principal avantage du filtrage n'est pas une syntaxe plus courte pour les champs imbriqués. C'est une corrélation correcte entre les sous-champs scalaires.</p>
<p>Supposons que l'application ait besoin de vidéos contenant un clip de cuisine avec un score de confiance d'étiquette supérieur à <code translate="no">0.8</code>. Il ne suffit pas qu'une vidéo contienne un clip de cuisine et un clip à haute confiance ; le même clip doit satisfaire les deux conditions.</p>
<p>La famille <code translate="no">MATCH_*</code> de StructArray exprime cela directement :</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">MATCH_ANY</span><span class="hljs-params">(clips, $[scene_type] == <span class="hljs-string">&quot;kitchen&quot;</span> &amp;&amp; $[label_confidence] &gt; <span class="hljs-number">0.8</span>)</span>
MATCH_ALL(clips, $[label_confidence] &gt; <span class="hljs-number">0.5</span>)
MATCH_LEAST(clips, $[scene_type] == <span class="hljs-string">&quot;sports&quot;</span>, threshold=<span class="hljs-number">3</span>)
MATCH_MOST(clips, $[label_confidence] &lt; <span class="hljs-number">0.2</span>, threshold=<span class="hljs-number">1</span>)
MATCH_EXACT(clips, $[scene_type] == <span class="hljs-string">&quot;intro&quot;</span>, threshold=<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus évalue le prédicat à chaque décalage d'élément, puis applique le quantificateur de l'opérateur pour décider si l'entité parente passe :</p>
<ul>
<li><code translate="no">MATCH_ANY</code> : Au moins un élément correspond.</li>
<li><code translate="no">MATCH_ALL</code> : Chaque élément correspond.</li>
<li><code translate="no">MATCH_LEAST</code> : Au moins <code translate="no">threshold</code> éléments correspondent.</li>
<li><code translate="no">MATCH_MOST</code> : Au plus <code translate="no">threshold</code> éléments correspondent.</li>
<li><code translate="no">MATCH_EXACT</code> : Exactement <code translate="no">threshold</code> éléments correspondent.</li>
</ul>
<p>Si les mêmes données étaient stockées sous forme de deux tableaux indépendants, l'expression suivante ne préserverait pas cette corrélation :</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">array_contains</span><span class="hljs-params">(clips[scene_type], <span class="hljs-string">&quot;kitchen&quot;</span>)</span>
AND
<span class="hljs-title function_">array_contains</span><span class="hljs-params">(clips[label_confidence], <span class="hljs-number">0.9</span>)</span>
<button class="copy-code-btn"></button></code></pre>
<p>Les deux valeurs pourraient se produire à des décalages différents. Cela peut être valable pour des attributs sans rapport, mais c'est incorrect lorsque les deux conditions décrivent le même clip, la même image de produit ou le même passage de document.</p>
<p>StructArray fait de l'identité d'élément une partie du prédicat de la base de données plutôt qu'une convention que l'application doit appliquer.</p>
<h2 id="Two-vector-search-granularities-two-result-identities" class="common-anchor-header">Deux granularités de recherche vectorielle, deux identités de résultat<button data-href="#Two-vector-search-granularities-two-result-identities" class="anchor-icon" translate="no">
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
    </button></h2><p>Une fois qu'une entité stocke plusieurs vecteurs, la récupération doit régler une question de modélisation avant que la recherche ANN ne commence :</p>
<p><strong>Les vecteurs doivent-ils être scorés ensemble comme une représentation unique de l'entité parente, ou chaque vecteur d'élément doit-il concourir indépendamment ?</strong></p>
<p>StructArray prend en charge les deux modèles, mais ils utilisent des formes de requête, des familles de métriques, des sous-champs vectoriels et des identités de résultat différents.</p>
<h3 id="EmbeddingList-search-a-list-of-query-vectors-finds-an-entity" class="common-anchor-header">Recherche EmbeddingList : une liste de vecteurs de requête trouve une entité</h3><p>Une requête <code translate="no">EmbeddingList</code> contient plusieurs vecteurs. Une vidéo de requête peut être divisée en plusieurs clips ; une requête produit peut contenir plusieurs images de référence ; une requête ColBERT contient un vecteur par jeton de requête.</p>
<p>Pour chaque entité, Milvus compare la liste de requête avec la liste d'embeddings stockée de l'entité. Avec le scoring de type MaxSim, chaque vecteur de requête sélectionne sa meilleure correspondance dans la liste de l'entité, et Milvus agrège ces scores de meilleure correspondance en un score d'entité. La correspondance finale représente l'entité parente, et non un élément Struct particulier.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus.client.embedding_list import EmbeddingList

query = EmbeddingList()
query.<span class="hljs-keyword">add</span>(query_clip_vec_1)
query.<span class="hljs-keyword">add</span>(query_clip_vec_2)

client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding_list]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>},
    limit=<span class="hljs-number">10</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Cette recherche répond à la question : <strong>Quelles vidéos sont la meilleure correspondance globale pour cet ensemble de clips de requête ?</strong></p>
<p>Elle convient à la récupération vidéo-à-vidéo, à la recherche produit multi-images, à la récupération de type ColBERT et ColPali, et à d'autres cas où la requête et l'entité stockée sont toutes deux représentées par plusieurs vecteurs.</p>
<h3 id="Element-level-search-one-query-vector-finds-a-clip-inside-an-entity" class="common-anchor-header">Recherche au niveau de l'élément : un vecteur de requête trouve un clip dans une entité</h3><p>La recherche au niveau de l'élément utilise un vecteur de requête régulier. Chaque vecteur dans <code translate="no">clips[clip_embedding]</code> participe à la recherche ANN comme candidat indépendant. Chaque correspondance identifie l'entité parente et le décalage de l'élément correspondant.</p>
<pre><code translate="no" class="language-python">client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    <span class="hljs-built_in">limit</span>=10,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;clips&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Pour ne rechercher que certains clips, attachez un <code translate="no">element_filter</code> dont les conditions scalaires s'appliquent au même clip :</p>
<pre><code translate="no" class="language-python">client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;element_filter(clips, $[scene_type] == &quot;kitchen&quot; &amp;&amp; $[label_confidence] &gt; 0.8)&#x27;</span>,
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;clips&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Le filtre ne sélectionne pas d'abord un clip de cuisine puis ne recherche pas un clip à haute confiance différent. Les deux prédicats et le candidat vectoriel se réfèrent au même élément Struct.</p>
<p>Une réponse non groupée peut ressembler à ceci :</p>
<pre><code translate="no">Plaintext
<span class="hljs-built_in">id</span> = <span class="hljs-number">1</span>, offset = <span class="hljs-number">1</span>, distance = <span class="hljs-number">0.91</span>
<span class="hljs-built_in">id</span> = <span class="hljs-number">8</span>, offset = <span class="hljs-number">4</span>, distance = <span class="hljs-number">0.88</span>
<span class="hljs-built_in">id</span> = <span class="hljs-number">1</span>, offset = <span class="hljs-number">3</span>, distance = <span class="hljs-number">0.84</span>
<button class="copy-code-btn"></button></code></pre>
<p>La même entité peut apparaître plusieurs fois car plusieurs clips peuvent correspondre. Cela est utile lorsque l'application doit montrer non seulement quelle vidéo ou quel document est pertinent, mais aussi quel clip ou quel passage a produit la correspondance.</p>
<table>
<thead>
<tr><th>Aspect</th><th>Recherche EmbeddingList</th><th>Recherche au niveau de l'élément</th></tr>
</thead>
<tbody>
<tr><td>Entrée de requête</td><td>Un ou plusieurs vecteurs de requête dans un <code translate="no">EmbeddingList</code></td><td>Un vecteur de requête régulier</td></tr>
<tr><td>Exemple de cible</td><td><code translate="no">clips[clip_embedding_list]</code></td><td><code translate="no">clips[clip_embedding]</code></td></tr>
<tr><td>Famille de métriques</td><td><code translate="no">MAX_SIM*</code></td><td>Métriques régulières telles que <code translate="no">COSINE</code>, <code translate="no">IP</code> ou <code translate="no">L2</code></td></tr>
<tr><td>Unité candidate ANN</td><td>La liste d'embeddings de l'entité parente</td><td>Chaque vecteur d'élément Struct</td></tr>
<tr><td>Identité du résultat</td><td>Entité parente</td><td>Entité parente plus décalage d'élément</td></tr>
<tr><td>Cas d'usage typique</td><td>Correspondre une requête multi-vecteurs à une entité multi-vecteurs</td><td>Trouver le clip, l'image, le passage, le patch ou le fait le plus pertinent</td></tr>
</tbody>
</table>
<p>Pour prendre en charge les deux modes dans une seule collection, définissez et indexez des sous-champs vectoriels séparés. La forme de la requête, la famille de métriques et l'index cible doivent être cohérents.</p>
<h2 id="EmbeddingList-indexing-is-a-quality-cost-decision" class="common-anchor-header">L'indexation EmbeddingList est une décision qualité-coût<button data-href="#EmbeddingList-indexing-is-a-quality-cost-decision" class="anchor-icon" translate="no">
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
    </button></h2><p>Avec un embedding par entité, un index ANN trouve les entités proches d'un vecteur de requête. La recherche EmbeddingList est plus coûteuse car la pertinence dépend d'interactions par paires entre deux listes de vecteurs.</p>
<p>Calculer le MaxSim exact contre chaque vecteur de chaque entité produit le classement de référence le plus propre, mais une analyse complète est généralement trop coûteuse pour la récupération en ligne. Milvus utilise donc un modèle en deux étapes :</p>
<ol>
<li>Une stratégie approximative récupère les entités parentes candidates.</li>
<li>Lorsque <code translate="no">emb_list_rerank</code> est activé, Milvus recalcule le MaxSim sur ces candidats pour produire le classement final.</li>
</ol>
<p>Récupérer plus de candidats de première étape améliore généralement les chances que les vrais meilleurs résultats atteignent le reclassement, mais cela augmente également la latence et le calcul. Les trois stratégies diffèrent principalement dans la manière dont elles produisent cet ensemble de candidats.</p>
<table>
<thead>
<tr><th>Stratégie</th><th>Représentation des candidats de première étape</th><th>Bon point de départ lorsque</th><th>Compromis principal</th></tr>
</thead>
<tbody>
<tr><td>TokenANN</td><td>Indexe chaque vecteur de chaque liste d'embeddings. Les vecteurs de requête exécutent des ANN indépendants ; les correspondances sont agrégées vers les entités parentes avant le reclassement MaxSim.</td><td>La qualité est la priorité, les listes sont courtes ou moyennes, et les vecteurs individuels sont discriminants.</td><td>La taille de l'index et le travail de recherche de première étape croissent avec la longueur des listes et le nombre de vecteurs de requête.</td></tr>
<tr><td>MUVERA</td><td>Encode chaque liste d'embeddings en un vecteur de dimension fixe via des projections aléatoires, puis exécute un ANN ordinaire.</td><td>TokenANN est trop lourd et une compression sans pipeline d'entraînement est préférée.</td><td>L'encodage perd des informations ; des réglages de projection plus forts augmentent la dimensionnalité encodée et le coût ANN.</td></tr>
<tr><td>LEMUR</td><td>Entraîne un modèle qui mappe une liste d'embeddings vers un vecteur d'entité parente de dimension fixe.</td><td>Les embeddings sont moins discriminants, les listes sont grandes, ou la charge de travail est visuelle ou multimodale.</td><td>Cela nécessite un entraînement et peut être sensible à la distribution du corpus et au biais de longueur de document.</td></tr>
</tbody>
</table>
<p>Aucune stratégie unique n'est la meilleure pour chaque charge de travail. Commencez par les données cibles et la distribution des requêtes :</p>
<ul>
<li>Utilisez TokenANN comme référence qualité d'abord lorsque la taille du jeu de données le permet.</li>
<li>Essayez MUVERA lorsque l'index ou la récupération de candidats de TokenANN devient trop coûteuse à mesure que la longueur des listes augmente, et que vous souhaitez éviter un pipeline d'entraînement.</li>
<li>Évaluez LEMUR lorsque l'espace d'embeddings est bruité ou faiblement discriminant, ou lorsque la charge de travail est visuelle ou multimodale.</li>
<li>Mesurez le rappel ou le nDCG en parallèle de la latence et de la taille de l'index. Une stratégie qui fonctionne pour des textes courts peut se comporter différemment avec des longueurs de document à longue traîne ou des milliers de patches visuels.</li>
</ul>
<p>StructArray résout un problème : comment représenter des éléments alignés, filtrables et porteurs de vecteurs à l'intérieur d'une seule entité. La stratégie EmbeddingList en résout un autre : comment approximer le MaxSim à un coût acceptable pour un modèle et un corpus particuliers.</p>
<h2 id="Hybrid-search-makes-result-identity-explicit" class="common-anchor-header">La recherche hybride rend l'identité du résultat explicite<button data-href="#Hybrid-search-makes-result-identity-explicit" class="anchor-icon" translate="no">
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
    </button></h2><p>La récupération en production suit rarement un seul chemin vectoriel. Une requête vidéo peut combiner un embedding vidéo de niveau supérieur, un ou plusieurs embeddings au niveau du clip, un signal de légende ou de transcription, et un reclassement.</p>
<p>Une fois que les candidats au niveau de l'élément entrent dans ce pipeline, le moteur doit décider ce qui identifie un candidat final.</p>
<table>
<thead>
<tr><th>Composition de la requête hybride</th><th>Portée du candidat final</th><th>Identité du résultat</th></tr>
</thead>
<tbody>
<tr><td>Toutes les sous-recherches sont au niveau de l'élément et ciblent des sous-champs vectoriels sous le même StructArray</td><td>Niveau de l'élément</td><td>Clé primaire plus champ StructArray plus décalage d'élément</td></tr>
<tr><td>Un champ vectoriel de niveau supérieur est inclus</td><td>Niveau de l'entité</td><td>Clé primaire</td></tr>
<tr><td>Une requête EmbeddingList est incluse</td><td>Niveau de l'entité</td><td>Clé primaire</td></tr>
<tr><td>Les requêtes au niveau de l'élément ciblent différents champs StructArray</td><td>Niveau de l'entité</td><td>Clé primaire</td></tr>
</tbody>
</table>
<p>La première configuration préserve l'identité de l'élément car le décalage <code translate="no">3</code> se réfère au même élément Struct pour chaque sous-recherche sous un StructArray parent donné. Cela convient à une application qui souhaite retourner le clip ou le passage le plus pertinent après avoir fusionné plusieurs signaux au niveau de l'élément.</p>
<p>Les autres configurations mélangent les granularités des candidats ou les espaces de noms des éléments. Une correspondance d'élément doit donc être réduite en un score au niveau de l'entité avant le reclassement final. Milvus prend en charge plusieurs stratégies de réduction :</p>
<table>
<thead>
<tr><th>Stratégie de réduction</th><th>Score d'entité à partir des correspondances d'éléments retournées</th><th>Condition importante</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">max</code></td><td>Meilleur score d'élément</td><td>Fonctionne avec les métriques vectorielles régulières prises en charge</td></tr>
<tr><td><code translate="no">sum</code></td><td>Somme de tous les scores d'éléments retournés</td><td>À utiliser avec des métriques à corrélation positive telles que <code translate="no">IP</code> ou <code translate="no">COSINE</code></td></tr>
<tr><td><code translate="no">avg</code></td><td>Moyenne des scores d'éléments retournés</td><td>Fonctionne avec les métriques vectorielles régulières prises en charge</td></tr>
<tr><td><code translate="no">topk_sum</code></td><td>Somme des meilleurs <code translate="no">K</code> scores d'éléments retournés</td><td>Nécessite un <code translate="no">topk</code> positif ; à utiliser avec <code translate="no">IP</code> ou <code translate="no">COSINE</code></td></tr>
<tr><td><code translate="no">topk_avg</code></td><td>Moyenne des meilleurs <code translate="no">K</code> scores d'éléments retournés</td><td>Nécessite un <code translate="no">topk</code> positif</td></tr>
</tbody>
</table>
<p>La réduction opère uniquement sur les correspondances d'éléments retournées par cette sous-recherche ANN ; elle ne scanne pas chaque élément de l'entité après la récupération. La <code translate="no">limit</code> de la requête contrôle donc quelles correspondances d'éléments sont disponibles pour la fonction de réduction.</p>
<p>Ce choix façonne la sémantique de la récupération, et non pas seulement le formatage de la sortie. Si l'application présente un clip ou un passage, préserver le décalage à travers la fusion est naturel. Si elle présente une vidéo, un produit ou un document, la réduction au niveau de l'entité est naturelle. Lorsque les signaux opèrent à différentes granularités, le système a besoin d'une règle explicite de scoring élément-vers-entité.</p>
<p>StructArray déplace ce problème d'identité-et-réduction du post-traitement ad hoc vers le modèle d'exécution de la recherche.</p>
<h2 id="How-Milvus-executes-StructArray-without-treating-it-as-a-blob" class="common-anchor-header">Comment Milvus exécute StructArray sans le traiter comme un blob<button data-href="#How-Milvus-executes-StructArray-without-treating-it-as-a-blob" class="anchor-icon" translate="no">
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
    </button></h2><p>Le modèle côté utilisateur est <code translate="no">ARRAY&lt;STRUCT&gt;</code>. Stocker la valeur entière comme un blob opaque, cependant, rendrait les index de sous-champs, les filtres et la sortie sélective inefficaces.</p>
<p>Milvus utilise une conception parent-logique, colonnes-enfant-physiques.</p>
<p>Au niveau du schéma, <code translate="no">clips</code> est le champ parent logique. Il définit des propriétés telles que le schéma Struct, la capacité maximale et la possibilité de valeur nulle. Ses sous-champs sont normalisés en chemins tels que <code translate="no">clips[clip_embedding_list]</code>, <code translate="no">clips[clip_embedding]</code>, <code translate="no">clips[scene_type]</code> et <code translate="no">clips[label_confidence]</code>.</p>
<p>Les sous-champs scalaires suivent des chemins de stockage de tableaux scalaires par entité, tandis que les sous-champs vectoriels suivent des chemins de tableaux vectoriels. Chaque sous-champ peut alors utiliser le chemin de données approprié à son type : filtrage scalaire et index scalaires pour les métadonnées, et index vectoriels et recherche ANN pour les embeddings.</p>
<p>À l'ingestion, le Proxy déplie la liste Struct imbriquée en colonnes enfant typées. Pendant l'exécution, Milvus maintient la relation entre chaque élément physique et son entité parente. Conceptuellement, cette relation ressemble à ceci :</p>
<pre><code translate="no">Plaintext
entity 0 -&gt; elements [0, 1, 2]
entity 1 -&gt; elements [3]
entity 2 -&gt; elements []
entity 3 -&gt; elements [4, 5, 6, 7]
<button class="copy-code-btn"></button></code></pre>
<p>Lorsque la recherche au niveau de l'élément retourne un ID d'élément physique, Milvus le fait correspondre à l'entité parente et au décalage d'élément. Lorsque <code translate="no">element_filter</code> produit un bitmap au niveau de l'élément, le moteur l'aligne avec la visibilité de l'entité parente, les suppressions et les autres filtres.</p>
<p>Lors du retour des résultats, Milvus utilise le schéma logique et les décalages partagés pour reconstruire la forme StructArray que l'application a insérée. Le système peut exécuter sur des colonnes enfant typées pendant que l'utilisateur continue de lire et d'écrire des objets imbriqués naturels. Cette structure physique rend StructArray plus qu'un JSON typé : la relation imbriquée participe au modèle d'index et d'exécution.</p>
<h2 id="Where-StructArray-fits-and-where-it-does-not" class="common-anchor-header">Où StructArray convient, et où il ne convient pas<button data-href="#Where-StructArray-fits-and-where-it-does-not" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArray est un excellent choix lorsque toutes les conditions suivantes sont réunies :</p>
<ul>
<li>L'application a une entité parente significative, telle qu'une vidéo, un produit, un document, une page visuelle ou un enregistrement de mémoire.</li>
<li>Chaque parent contient un ensemble ordonné de longueur variable d'éléments locaux.</li>
<li>Ces éléments nécessitent leurs propres métadonnées scalaires, vecteurs, ou les deux.</li>
<li>La recherche ou le filtrage doit préserver la relation entre les sous-champs au même décalage d'élément.</li>
<li>L'application a besoin d'une récupération multi-vecteurs au niveau de l'entité, de correspondances au niveau de l'élément, ou des deux.</li>
</ul>
<p>StructArray n'est pas automatiquement meilleur pour chaque collection. Un document court ou une requête simple peut être bien servi par un embedding dense unique. L'indexation multi-vecteurs ajoute des coûts de stockage et de recherche, donc la représentation supplémentaire doit gagner sa place par une meilleure qualité de récupération ou une granularité de résultats plus utile.</p>
<p>Les limites actuelles du schéma et de l'exécution comptent également :</p>
<ul>
<li><code translate="no">Struct</code> est pris en charge comme type d'élément d'un <code translate="no">Array</code>, et non comme champ de collection de niveau supérieur.</li>
<li>Tous les éléments d'un même StructArray partagent un schéma prédéfini unique.</li>
<li><code translate="no">max_capacity</code> est obligatoire et limite le nombre d'éléments par entité.</li>
<li>Les sous-champs <code translate="no">Struct</code>, <code translate="no">Array</code>, <code translate="no">ArrayOfStruct</code> et <code translate="no">JSON</code> imbriqués ne sont pas pris en charge à l'intérieur d'un StructArray.</li>
<li>Un sous-champ vectoriel accepte un seul index. Utilisez des sous-champs vectoriels séparés pour la recherche EmbeddingList et la recherche au niveau de l'élément lorsque les deux sont nécessaires.</li>
<li>Les sous-champs vectoriels doivent être indexés avant la recherche. Les sous-champs scalaires fortement utilisés dans les filtres doivent être indexés de manière appropriée.</li>
<li>Le schéma des sous-champs est fixé après la création du champ StructArray, donc planifiez les attributs des éléments avant le déploiement en production.</li>
</ul>
<p>Ces contraintes rendent le modèle plus étroit que l'imbrication arbitraire d'une base de données documentaire, mais elles donnent aussi à Milvus suffisamment de structure pour raisonner sur l'identité des éléments, indexer chaque sous-champ et exécuter à deux granularités de recherche.</p>
<h2 id="StructArray-keeps-local-evidence-first-class-without-losing-the-entity" class="common-anchor-header">StructArray maintient la preuve locale de première classe sans perdre l'entité<button data-href="#StructArray-keeps-local-evidence-first-class-without-losing-the-entity" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArray donne à Milvus un objet de récupération que les schémas plats ont du mal à représenter : une entité parente avec un ensemble ordonné d'éléments structurés. Les relations entre ces éléments participent au filtrage, à l'indexation et à la recherche plutôt que d'exister uniquement dans le stockage.</p>
<p>Chaque élément conserve ses propres métadonnées et embeddings. Les éléments peuvent satisfaire des prédicats scalaires au sein du même élément, participer ensemble à la recherche EmbeddingList au niveau de l'entité, ou concourir indépendamment dans la recherche au niveau de l'élément. En même temps, ils restent attachés à l'entité parente dont les métadonnées, les permissions et l'identité applicative leur donnent du contexte.</p>
<p>Pour les clips vidéo, les images de produit, les passages de documents, les patches visuels et les fragments de mémoire, la preuve locale peut être recherchée et filtrée sans perdre l'entité à laquelle elle appartient. Les choix de conception restants sont explicites : sélectionnez la granularité de recherche, donnez à chaque sous-champ vectoriel la métrique et l'index correspondants, et décidez si les résultats hybrides doivent préserver les décalages d'éléments ou se réduire aux entités.</p>
<h2 id="Try-StructArray-in-Milvus-30" class="common-anchor-header">Essayez StructArray dans Milvus 3.0<button data-href="#Try-StructArray-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArray est disponible dans Milvus 3.0. Commencez par la <a href="https://milvus.io/docs/array-of-structs.md">vue d'ensemble de StructArray</a>. Si vous évaluez la récupération multi-vecteurs au niveau de l'entité, lisez le <a href="https://milvus.io/docs/choose-an-embeddinglist-search-strategy.md">guide des stratégies EmbeddingList</a>. Pour la granularité des résultats et le comportement de réduction, consultez <a href="https://milvus.io/docs/hybrid-search-with-structarray.md">Hybrid Search with StructArray</a>.</p>
<p>Pour le contexte plus large de la version, voir le <a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">blog de lancement de Milvus 3.0</a>, les <a href="https://milvus.io/docs/release_notes.md">notes de version</a> et le <a href="https://github.com/milvus-io/milvus">dépôt milvus-io/milvus</a>.</p>
<p><a href="https://zilliz.com/">Zilliz Cloud</a> prend également en charge StructArray et la recherche EmbeddingList pour les déploiements gérés. Consultez le <a href="https://docs.zilliz.com/docs/use-array-of-structs">guide Zilliz Cloud StructArray</a> pour les limites spécifiques au service. Dans Zilliz Cloud, les opérateurs scalaires sur StructArray sont actuellement documentés pour les clusters On-Demand.</p>
<p>Pour discuter d'un schéma ou d'une conception de récupération avec l'équipe, rejoignez la <a href="https://discord.com/invite/8uyFbECzPX">communauté Discord Milvus</a> ou réservez une session <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting">Milvus Office Hours</a>.</p>
