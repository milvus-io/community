---
id: milvus-3-0-structarray.md
title: >-
  Uma Entidade, Muitos Vetores: Busca em Nível de Entidade e Elemento com o
  StructArray do Milvus 3.0
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
  Uma entidade pode conter múltiplos vetores alinhados e campos de metadados, e
  o Milvus pode pesquisar tanto a entidade inteira quanto um elemento individual
  sem achatar os dados em linhas separadas.
origin: 'https://milvus.io/blog/milvus-3-0-structarray.md'
---
<p>A maioria dos esquemas de bancos de dados vetoriais parte de uma premissa simples: uma entidade, um embedding. Um produto recebe um vetor, assim como um documento. Uma consulta de usuário é convertida em um embedding e comparada com esses vetores por meio da busca por vizinhos mais próximos aproximados (ANN). Esse modelo funciona para a primeira geração de casos de uso da busca vetorial, incluindo RAG, busca semântica e sistemas de recomendação.</p>
<p><strong>No entanto, dados reais de IA raramente se encaixam nessa premissa.</strong> Um vídeo contém clipes, cenas ou keyframes, cada um com seu próprio embedding, intervalo de tempo, legenda, rótulo de cena e pontuação de confiança. Um produto pode ter várias imagens e ângulos de visualização. Um documento longo contém passagens ou seções cujo significado local importa mais do que uma representação única do documento inteiro. Modelos populares de interação tardia expõem a mesma limitação em uma granularidade ainda mais fina: o ColBERT gera um vetor por token, enquanto o ColPali gera um vetor por patch visual.</p>
<p>Em cada caso, a entidade pai permanece como a unidade que a aplicação armazena, exibe, protege e retorna. No entanto, relevância, filtragem e explicação de resultados muitas vezes dependem de elementos dentro dessa entidade.</p>
<p><strong>O novo recurso StructArray oferece ao Milvus um modelo de dados nativo para esse formato: uma entidade contém um array ordenado de elementos Struct definidos por esquema, e cada elemento pode carregar metadados escalares, embeddings vetoriais, ou ambos.</strong> O Milvus pode filtrar campos que pertencem ao mesmo elemento, comparar duas listas de embeddings no nível da entidade ou pesquisar elementos individuais e retornar o offset correspondente.</p>
<p>Este artigo usa um exemplo de busca de vídeos para explicar o modelo de dados e, em seguida, percorre o design do esquema, a filtragem, as granularidades da busca vetorial, as estratégias de índice EmbeddingList, a consolidação de resultados híbridos e a disposição física que torna o recurso executável.</p>
<h2 id="Why-one-vector-and-one-flat-row-model-are-no-longer-enough" class="common-anchor-header">Por que o modelo de um vetor e uma linha plana não é mais suficiente<button data-href="#Why-one-vector-and-one-flat-row-model-are-no-longer-enough" class="anchor-icon" translate="no">
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
    </button></h2><p>Considere um usuário pesquisando em um catálogo de vídeos por “uma pessoa cortando vegetais em uma cozinha”. O sinal relevante pode estar em um clipe de oito segundos, não em um embedding do vídeo inteiro. <strong>Comprimir cada clipe, objeto e ação em um único vetor pode preservar o tópico geral, mas pode apagar detalhes locais.</strong></p>
<p>A mesma incompatibilidade aparece em outras cargas de trabalho:</p>
<ul>
<li>A relevância de um produto pode vir de uma de várias imagens ou ângulos.</li>
<li>Um documento pode ser considerado relevante por causa de uma passagem, e não pelo seu assunto geral.</li>
<li>Uma memória de agente pode conter várias observações, e apenas uma delas importa para a tarefa atual.</li>
<li>Um registro ColBERT ou ColPali contém uma lista de comprimento variável de vetores de tokens ou patches, em vez de um único vetor denso.</li>
</ul>
<p>Uma alternativa é dividir cada clipe, imagem ou passagem em uma linha separada do banco de dados. Isso permite a busca local, mas também separa cada fragmento de sua entidade pai. Os metadados da entidade pai podem ser repetidos entre linhas, e a recuperação no nível da entidade passa a exigir agrupamento, deduplicação e reordenação após a busca por fragmentos.</p>
<p>Somente o armazenamento aninhado não resolve o problema de consulta. O JSON pode armazenar objetos, mas não oferece ao Milvus um esquema predefinido de subcampos para indexação vetorial e escalar. Arrays paralelos podem armazenar legendas, rótulos de cena e valores de confiança, mas a aplicação precisa manter o alinhamento por offset. O banco de dados não pode inferir com segurança que <code translate="no">scene_type[3]</code> e <code translate="no">label_confidence[3]</code> descrevem o mesmo clipe, a menos que essa relação faça parte do modelo de dados.</p>
<p>O StructArray codifica essa relação diretamente. Ele mantém os elementos locais dentro da entidade pai enquanto expõe seus subcampos alinhados à validação de esquema, indexação, filtragem e busca vetorial.</p>
<h2 id="What-is-StructArray-and-its-data-model" class="common-anchor-header">O que é StructArray e seu modelo de dados?<button data-href="#What-is-StructArray-and-its-data-model" class="anchor-icon" translate="no">
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
    </button></h2><p>Um StructArray, também conhecido como array de structs, armazena um conjunto ordenado de elementos Struct em cada entidade. Um campo StructArray é um <code translate="no">Array</code> cujos elementos seguem todos um mesmo esquema <code translate="no">Struct</code> predefinido. Para uma coleção de vídeos, a forma lógica poderia ser assim:</p>
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
<p>Aqui:</p>
<ul>
<li><code translate="no">clips</code> é o campo StructArray pai.</li>
<li><code translate="no">clip_embedding_list</code>, <code translate="no">clip_embedding</code>, <code translate="no">start_sec</code> e os demais atributos são subcampos.</li>
<li><code translate="no">clips[0]</code> é o primeiro clipe.</li>
<li>Todos os subcampos no offset <code translate="no">0</code> pertencem a esse mesmo clipe.</li>
<li>Todos os subcampos no offset <code translate="no">3</code> pertencem a outro clipe.</li>
</ul>
<p>Os dois subcampos vetoriais atendem a modos de busca diferentes. <code translate="no">clips[clip_embedding_list]</code> é indexado com uma métrica <code translate="no">MAX_SIM*</code> para busca EmbeddingList no nível da entidade, enquanto <code translate="no">clips[clip_embedding]</code> é indexado com uma métrica vetorial regular para busca no nível do elemento. Como um campo ou subcampo vetorial aceita apenas um índice, uma coleção que precisa dos dois modos deve definir e indexar os dois subcampos separadamente.</p>
<p>Esse modelo suporta três semânticas de consulta distintas.</p>
<h3 id="1-EmbeddingList-search-returns-parent-entities" class="common-anchor-header">1. A busca EmbeddingList retorna entidades pai</h3><p>Os vetores em <code translate="no">clips[clip_embedding_list]</code> formam uma lista de embeddings para o vídeo. A consulta também é um <code translate="no">EmbeddingList</code>. O Milvus compara a lista de consulta com cada lista armazenada usando uma métrica <code translate="no">MAX_SIM*</code> e retorna um resultado no nível da entidade.</p>
<pre><code translate="no">Plaintext
clips[clip_embedding_list] = [
    embedding_0,
    embedding_1,
    embedding_2,
    ...
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-The-MATCH-family-filters-parent-entities" class="common-anchor-header">2. A família <code translate="no">MATCH_*</code> filtra entidades pai</h3><p><code translate="no">MATCH_ANY</code>, <code translate="no">MATCH_ALL</code>, <code translate="no">MATCH_LEAST</code>, <code translate="no">MATCH_MOST</code> e <code translate="no">MATCH_EXACT</code> avaliam um predicado contra os elementos Struct, contam quantos elementos o satisfazem e decidem se a entidade pai passa no filtro.</p>
<p>Por exemplo:</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">MATCH_ANY</span><span class="hljs-params">(clips, $[scene_type] == <span class="hljs-string">&quot;kitchen&quot;</span> &amp;&amp; $[label_confidence] &gt; <span class="hljs-number">0.8</span>)</span>
<button class="copy-code-btn"></button></code></pre>
<p>Ambas as condições escalares precisam ser verdadeiras no mesmo offset do clipe. O Milvus não combina um rótulo de cozinha de um clipe com um valor de alta confiança de outro.</p>
<h3 id="3-Element-level-search-returns-the-matching-element-offset" class="common-anchor-header">3. A busca no nível do elemento retorna o offset do elemento correspondente</h3><p>Um vetor de consulta regular pode pesquisar independentemente cada vetor em <code translate="no">clips[clip_embedding]</code>. Cada resultado identifica a entidade pai e o offset baseado em zero do elemento Struct correspondente. Um <code translate="no">element_filter</code> pode restringir quais elementos participam dessa busca vetorial.</p>
<p>Essas operações compartilham uma premissa: o Milvus sabe quais valores vetoriais e escalares pertencem ao mesmo elemento e quais elementos pertencem à mesma entidade.</p>
<p>O StructArray não é um sistema genérico de aninhamento arbitrário. Seu modelo atual é um <code translate="no">Array</code> de elementos <code translate="no">Struct</code> com subcampos escalares e vetoriais suportados. Esse limite torna a indexação de subcampos e a execução ciente de elementos viáveis.</p>
<h2 id="Build-the-schema-indexes-and-insert-path" class="common-anchor-header">Construa o esquema, os índices e o caminho de inserção<button data-href="#Build-the-schema-indexes-and-insert-path" class="anchor-icon" translate="no">
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
    </button></h2><p>O exemplo simplificado de PyMilvus a seguir cria uma coleção de vídeos com um vetor de nível superior e um StructArray para clipes. Ele usa subcampos vetoriais de clipe separados para que a mesma coleção possa demonstrar ambos os modos de busca.</p>
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
<p>Subcampos vetoriais precisam ser indexados antes da busca. Como a família de métricas determina o modo de busca, cada subcampo vetorial recebe seu próprio índice:</p>
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
<p>Índices escalares são opcionais, mas subcampos que aparecem com frequência em filtros de grande escala devem usar um índice escalar compatível. Por exemplo, <code translate="no">clips[scene_type]</code> pode usar um índice invertido, enquanto um subcampo numérico como <code translate="no">clips[label_confidence]</code> pode usar um índice adequado à filtragem numérica.</p>
<p>Insira os dados em sua forma natural de entidade: uma linha de vídeo com um array de objetos de clipe. Para manter o exemplo compacto, ele grava o mesmo vetor de clipe nos dois subcampos vetoriais.</p>
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
<p>Na fronteira da API, <code translate="no">clips</code> permanece como um array de objetos estruturados. Dentro do Milvus, cada subcampo segue o caminho tipado necessário para seu próprio índice, filtro e comportamento de saída. Essa distinção é transparente no momento da inserção, mas fundamental para tudo o que vem a seguir.</p>
<h2 id="Same-element-filtering-is-the-difference-between-structure-and-parallel-arrays" class="common-anchor-header">A filtragem no mesmo elemento é a diferença entre estrutura e arrays paralelos<button data-href="#Same-element-filtering-is-the-difference-between-structure-and-parallel-arrays" class="anchor-icon" translate="no">
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
    </button></h2><p>O principal benefício da filtragem não é uma sintaxe mais curta para campos aninhados. É a correlação correta entre subcampos escalares.</p>
<p>Suponha que a aplicação precise de vídeos contendo um clipe de cozinha com confiança de rótulo acima de <code translate="no">0.8</code>. Não basta que um vídeo contenha algum clipe de cozinha e algum clipe de alta confiança; o mesmo clipe precisa satisfazer as duas condições.</p>
<p>A família <code translate="no">MATCH_*</code> do StructArray expressa isso diretamente:</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">MATCH_ANY</span><span class="hljs-params">(clips, $[scene_type] == <span class="hljs-string">&quot;kitchen&quot;</span> &amp;&amp; $[label_confidence] &gt; <span class="hljs-number">0.8</span>)</span>
MATCH_ALL(clips, $[label_confidence] &gt; <span class="hljs-number">0.5</span>)
MATCH_LEAST(clips, $[scene_type] == <span class="hljs-string">&quot;sports&quot;</span>, threshold=<span class="hljs-number">3</span>)
MATCH_MOST(clips, $[label_confidence] &lt; <span class="hljs-number">0.2</span>, threshold=<span class="hljs-number">1</span>)
MATCH_EXACT(clips, $[scene_type] == <span class="hljs-string">&quot;intro&quot;</span>, threshold=<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<p>O Milvus avalia o predicado em cada offset de elemento e, em seguida, aplica o quantificador do operador para decidir se a entidade pai passa:</p>
<ul>
<li><code translate="no">MATCH_ANY</code>: pelo menos um elemento corresponde.</li>
<li><code translate="no">MATCH_ALL</code>: todos os elementos correspondem.</li>
<li><code translate="no">MATCH_LEAST</code>: pelo menos <code translate="no">threshold</code> elementos correspondem.</li>
<li><code translate="no">MATCH_MOST</code>: no máximo <code translate="no">threshold</code> elementos correspondem.</li>
<li><code translate="no">MATCH_EXACT</code>: exatamente <code translate="no">threshold</code> elementos correspondem.</li>
</ul>
<p>Se os mesmos dados fossem armazenados como dois arrays independentes, a expressão a seguir não preservaria essa correlação:</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">array_contains</span><span class="hljs-params">(clips[scene_type], <span class="hljs-string">&quot;kitchen&quot;</span>)</span>
AND
<span class="hljs-title function_">array_contains</span><span class="hljs-params">(clips[label_confidence], <span class="hljs-number">0.9</span>)</span>
<button class="copy-code-btn"></button></code></pre>
<p>Os dois valores poderiam ocorrer em offsets diferentes. Isso pode ser válido para atributos não relacionados, mas é incorreto quando ambas as condições descrevem o mesmo clipe, imagem de produto ou passagem de documento.</p>
<p>O StructArray torna a identidade do elemento parte do predicado do banco de dados, em vez de uma convenção que a aplicação precisa impor.</p>
<h2 id="Two-vector-search-granularities-two-result-identities" class="common-anchor-header">Duas granularidades de busca vetorial, duas identidades de resultado<button data-href="#Two-vector-search-granularities-two-result-identities" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando uma entidade armazena múltiplos vetores, a recuperação precisa resolver uma questão de modelagem antes que a busca ANN comece:</p>
<p><strong>Os vetores devem ser pontuados em conjunto como uma representação da entidade pai, ou cada vetor de elemento deve competir de forma independente?</strong></p>
<p>O StructArray suporta ambos os modelos, mas eles usam diferentes formatos de consulta, famílias de métricas, subcampos vetoriais e identidades de resultado.</p>
<h3 id="EmbeddingList-search-a-list-of-query-vectors-finds-an-entity" class="common-anchor-header">Busca EmbeddingList: uma lista de vetores de consulta encontra uma entidade</h3><p>Uma consulta <code translate="no">EmbeddingList</code> contém múltiplos vetores. Um vídeo de consulta pode ser dividido em vários clipes; uma consulta de produto pode conter várias imagens de referência; uma consulta ColBERT contém um vetor por token da consulta.</p>
<p>Para cada entidade, o Milvus compara a lista de consulta com a lista de embeddings armazenada da entidade. Na pontuação estilo MaxSim, cada vetor de consulta seleciona sua melhor correspondência na lista da entidade, e o Milvus agrega essas pontuações de melhor correspondência em uma pontuação da entidade. O resultado final representa a entidade pai, não um elemento Struct específico.</p>
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
<p>Essa busca responde: <strong>Quais vídeos são a melhor correspondência geral para este conjunto de clipes de consulta?</strong></p>
<p>Ela se adequa à recuperação vídeo a vídeo, à busca de produtos com múltiplas imagens, à recuperação no estilo ColBERT e ColPali e a outros casos em que tanto a consulta quanto a entidade armazenada são representadas por múltiplos vetores.</p>
<h3 id="Element-level-search-one-query-vector-finds-a-clip-inside-an-entity" class="common-anchor-header">Busca no nível do elemento: um vetor de consulta encontra um clipe dentro de uma entidade</h3><p>A busca no nível do elemento usa um vetor de consulta regular. Todos os vetores em <code translate="no">clips[clip_embedding]</code> participam da busca ANN como candidatos independentes. Cada resultado identifica a entidade pai e o offset do elemento correspondente.</p>
<pre><code translate="no" class="language-python">client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    <span class="hljs-built_in">limit</span>=10,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;clips&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Para pesquisar apenas clipes selecionados, anexe um <code translate="no">element_filter</code> cujas condições escalares se apliquem ao mesmo clipe:</p>
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
<p>O filtro não seleciona primeiro um clipe de cozinha e depois pesquisa um clipe diferente de alta confiança. Tanto os predicados quanto o candidato vetorial referem-se ao mesmo elemento Struct.</p>
<p>Uma resposta não agrupada pode ter a seguinte aparência:</p>
<pre><code translate="no">Plaintext
<span class="hljs-built_in">id</span> = <span class="hljs-number">1</span>, offset = <span class="hljs-number">1</span>, distance = <span class="hljs-number">0.91</span>
<span class="hljs-built_in">id</span> = <span class="hljs-number">8</span>, offset = <span class="hljs-number">4</span>, distance = <span class="hljs-number">0.88</span>
<span class="hljs-built_in">id</span> = <span class="hljs-number">1</span>, offset = <span class="hljs-number">3</span>, distance = <span class="hljs-number">0.84</span>
<button class="copy-code-btn"></button></code></pre>
<p>A mesma entidade pode aparecer mais de uma vez porque vários clipes podem corresponder. Isso é útil quando a aplicação precisa mostrar não apenas qual vídeo ou documento é relevante, mas também qual clipe ou passagem gerou a correspondência.</p>
<table>
<thead>
<tr><th>Aspecto</th><th>Busca EmbeddingList</th><th>Busca no nível do elemento</th></tr>
</thead>
<tbody>
<tr><td>Entrada da consulta</td><td>Um ou mais vetores de consulta em um <code translate="no">EmbeddingList</code></td><td>Um vetor de consulta regular</td></tr>
<tr><td>Exemplo de alvo</td><td><code translate="no">clips[clip_embedding_list]</code></td><td><code translate="no">clips[clip_embedding]</code></td></tr>
<tr><td>Família de métricas</td><td><code translate="no">MAX_SIM*</code></td><td>Métricas regulares como <code translate="no">COSINE</code>, <code translate="no">IP</code> ou <code translate="no">L2</code></td></tr>
<tr><td>Unidade candidata no ANN</td><td>A lista de embeddings da entidade pai</td><td>O vetor de cada elemento Struct</td></tr>
<tr><td>Identidade do resultado</td><td>Entidade pai</td><td>Entidade pai mais o offset do elemento</td></tr>
<tr><td>Caso de uso típico</td><td>Corresponder uma consulta multivetorial a uma entidade multivetorial</td><td>Encontrar o clipe, imagem, passagem, patch ou fato mais relevante</td></tr>
</tbody>
</table>
<p>Para suportar ambos os modos em uma única coleção, defina e indexe subcampos vetoriais separados. O formato da consulta, a família de métricas e o índice de destino precisam estar alinhados.</p>
<h2 id="EmbeddingList-indexing-is-a-quality-cost-decision" class="common-anchor-header">A indexação EmbeddingList é uma decisão de qualidade-custo<button data-href="#EmbeddingList-indexing-is-a-quality-cost-decision" class="anchor-icon" translate="no">
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
    </button></h2><p>Com um embedding por entidade, um índice ANN encontra entidades próximas a um vetor de consulta. A busca EmbeddingList é mais cara porque a relevância depende de interações par a par entre duas listas de vetores.</p>
<p>Calcular o MaxSim exato contra cada vetor em cada entidade produz a classificação de referência mais limpa, mas uma varredura completa costuma ser cara demais para recuperação online. Por isso, o Milvus usa um modelo em dois estágios:</p>
<ol>
<li>Uma estratégia aproximada recupera entidades pai candidatas.</li>
<li>Quando <code translate="no">emb_list_rerank</code> está habilitado, o Milvus recalcula o MaxSim sobre esses candidatos para produzir a classificação final.</li>
</ol>
<p>Recuperar mais candidatos no primeiro estágio geralmente aumenta a chance de que os verdadeiros melhores resultados cheguem ao reranker, mas também aumenta a latência e o custo computacional. As três estratégias diferem principalmente em como produzem esse conjunto de candidatos.</p>
<table>
<thead>
<tr><th>Estratégia</th><th>Representação do candidato no primeiro estágio</th><th>Bom ponto de partida quando</th><th>Principal trade-off</th></tr>
</thead>
<tbody>
<tr><td>TokenANN</td><td>Indexa cada vetor em cada lista de embeddings. Os vetores de consulta executam ANN independentemente; as correspondências são agregadas de volta às entidades pai antes do reranking MaxSim.</td><td>A qualidade é a prioridade, as listas são curtas ou médias e os vetores individuais são discriminativos.</td><td>O tamanho do índice e o trabalho de busca no primeiro estágio crescem com o comprimento da lista e o número de vetores de consulta.</td></tr>
<tr><td>MUVERA</td><td>Codifica cada lista de embeddings em um vetor de dimensão fixa por meio de projeções aleatórias e, em seguida, executa ANN comum.</td><td>O TokenANN é pesado demais e a compressão sem pipeline de treinamento é preferível.</td><td>A codificação perde informação; configurações de projeção mais fortes aumentam a dimensionalidade codificada e o custo do ANN.</td></tr>
<tr><td>LEMUR</td><td>Treina um modelo que mapeia uma lista de embeddings para um vetor de entidade pai de dimensão fixa.</td><td>Os embeddings são menos discriminativos, as listas são grandes ou a carga de trabalho é visual ou multimodal.</td><td>Requer treinamento e pode ser sensível à distribuição do corpus e ao viés de comprimento de documentos.</td></tr>
</tbody>
</table>
<p>Nenhuma estratégia única é a melhor para toda carga de trabalho. Comece pelos dados-alvo e pela distribuição de consultas:</p>
<ul>
<li>Use o TokenANN como linha de base centrada em qualidade quando o tamanho do conjunto de dados permitir.</li>
<li>Experimente o MUVERA quando o índice do TokenANN ou a recuperação de candidatos se tornar cara demais à medida que o comprimento da lista cresce, e você quiser evitar um pipeline de treinamento.</li>
<li>Avalie o LEMUR quando o espaço de embeddings for ruidoso ou pouco discriminativo, ou quando a carga de trabalho for visual ou multimodal.</li>
<li>Meça recall ou nDCG juntamente com latência e tamanho do índice. Uma estratégia que funciona para textos curtos pode se comportar de forma diferente com comprimentos de documento de cauda longa ou milhares de patches visuais.</li>
</ul>
<p>O StructArray resolve um problema: como representar elementos alinhados, filtráveis e com vetores dentro de uma única entidade. A estratégia EmbeddingList aborda outro: como aproximar o MaxSim a um custo aceitável para um modelo e corpus específicos.</p>
<h2 id="Hybrid-search-makes-result-identity-explicit" class="common-anchor-header">A busca híbrida torna explícita a identidade do resultado<button data-href="#Hybrid-search-makes-result-identity-explicit" class="anchor-icon" translate="no">
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
    </button></h2><p>A recuperação em produção raramente segue um único caminho vetorial. Uma solicitação de vídeo pode combinar um embedding de vídeo de nível superior, um ou mais embeddings de clipe, um sinal de legenda ou transcrição e um reranker.</p>
<p>Quando candidatos no nível do elemento entram nesse pipeline, o mecanismo precisa decidir o que identifica um candidato final.</p>
<table>
<thead>
<tr><th>Composição da solicitação híbrida</th><th>Escopo do candidato final</th><th>Identidade do resultado</th></tr>
</thead>
<tbody>
<tr><td>Todas as sub-buscas são no nível do elemento e visam subcampos vetoriais sob o mesmo StructArray</td><td>Nível do elemento</td><td>Chave primária mais campo StructArray mais offset do elemento</td></tr>
<tr><td>Um campo vetorial de nível superior é incluído</td><td>Nível da entidade</td><td>Chave primária</td></tr>
<tr><td>Uma solicitação EmbeddingList é incluída</td><td>Nível da entidade</td><td>Chave primária</td></tr>
<tr><td>Solicitações no nível do elemento visam diferentes campos StructArray</td><td>Nível da entidade</td><td>Chave primária</td></tr>
</tbody>
</table>
<p>A primeira configuração preserva a identidade do elemento porque o offset <code translate="no">3</code> refere-se ao mesmo elemento Struct para cada sub-busca sob um determinado StructArray pai. Isso se adequa a uma aplicação que deseja retornar o clipe ou a passagem mais relevante após fundir vários sinais no nível do elemento.</p>
<p>As demais configurações misturam granularidades de candidatos ou namespaces de elementos. Um resultado de elemento precisa, portanto, ser consolidado em uma pontuação no nível da entidade antes do reranking final. O Milvus suporta várias estratégias de consolidação:</p>
<table>
<thead>
<tr><th>Estratégia de consolidação</th><th>Pontuação da entidade a partir dos resultados de elementos retornados</th><th>Condição importante</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">max</code></td><td>Melhor pontuação de elemento</td><td>Funciona com métricas vetoriais regulares suportadas</td></tr>
<tr><td><code translate="no">sum</code></td><td>Soma de todas as pontuações de elementos retornadas</td><td>Use com métricas de correlação positiva, como <code translate="no">IP</code> ou <code translate="no">COSINE</code></td></tr>
<tr><td><code translate="no">avg</code></td><td>Média das pontuações de elementos retornadas</td><td>Funciona com métricas vetoriais regulares suportadas</td></tr>
<tr><td><code translate="no">topk_sum</code></td><td>Soma das melhores <code translate="no">K</code> pontuações de elementos retornadas</td><td>Requer um <code translate="no">topk</code> positivo; use com <code translate="no">IP</code> ou <code translate="no">COSINE</code></td></tr>
<tr><td><code translate="no">topk_avg</code></td><td>Média das melhores <code translate="no">K</code> pontuações de elementos retornadas</td><td>Requer um <code translate="no">topk</code> positivo</td></tr>
</tbody>
</table>
<p>A consolidação opera apenas sobre os resultados de elementos retornados por essa sub-busca ANN; ela não varre todos os elementos da entidade após a recuperação. O <code translate="no">limit</code> da solicitação, portanto, controla quais resultados de elementos ficam disponíveis para a função de consolidação.</p>
<p>Essa escolha molda a semântica da recuperação, não apenas a formatação da saída. Se a aplicação apresenta um clipe ou passagem, preservar o offset durante a fusão é natural. Se ela apresenta um vídeo, produto ou documento, a consolidação no nível da entidade é natural. Quando os sinais operam em granularidades diferentes, o sistema precisa de uma regra explícita de pontuação de elemento para entidade.</p>
<p>O StructArray move esse problema de identidade-e-consolidação do pós-processamento ad hoc para o modelo de execução da busca.</p>
<h2 id="How-Milvus-executes-StructArray-without-treating-it-as-a-blob" class="common-anchor-header">Como o Milvus executa o StructArray sem tratá-lo como um blob<button data-href="#How-Milvus-executes-StructArray-without-treating-it-as-a-blob" class="anchor-icon" translate="no">
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
    </button></h2><p>O modelo voltado ao usuário é <code translate="no">ARRAY&lt;STRUCT&gt;</code>. No entanto, armazenar o valor inteiro como um único blob opaco tornaria ineficientes os índices de subcampos, os filtros e a saída seletiva.</p>
<p>O Milvus usa um design de pai lógico com colunas filhas físicas.</p>
<p>Na camada de esquema, <code translate="no">clips</code> é o campo pai lógico. Ele define propriedades como o esquema Struct, a capacidade máxima e a anulabilidade. Seus subcampos são normalizados em caminhos como <code translate="no">clips[clip_embedding_list]</code>, <code translate="no">clips[clip_embedding]</code>, <code translate="no">clips[scene_type]</code> e <code translate="no">clips[label_confidence]</code>.</p>
<p>Subcampos escalares seguem caminhos de armazenamento de arrays escalares por entidade, enquanto subcampos vetoriais seguem caminhos de arrays vetoriais. Cada subcampo pode então usar o caminho de dados adequado ao seu tipo: filtragem escalar e índices escalares para metadados, e índices vetoriais e busca ANN para embeddings.</p>
<p>Na ingestão, o Proxy expande a lista aninhada de Struct em colunas filhas tipadas. Durante a execução, o Milvus mantém a relação entre cada elemento físico e sua entidade pai. Conceitualmente, essa relação tem esta aparência:</p>
<pre><code translate="no">Plaintext
entity 0 -&gt; elements [0, 1, 2]
entity 1 -&gt; elements [3]
entity 2 -&gt; elements []
entity 3 -&gt; elements [4, 5, 6, 7]
<button class="copy-code-btn"></button></code></pre>
<p>Quando a busca no nível do elemento retorna um ID de elemento físico, o Milvus o mapeia de volta para a entidade pai e o offset do elemento. Quando <code translate="no">element_filter</code> produz um bitmap no nível do elemento, o mecanismo o alinha com a visibilidade da entidade pai, exclusões e outros filtros.</p>
<p>Ao retornar resultados, o Milvus usa o esquema lógico e os offsets compartilhados para reconstruir a forma StructArray que a aplicação inseriu. O sistema pode executar sobre colunas filhas tipadas enquanto o usuário continua lendo e escrevendo objetos aninhados naturais. Essa disposição física faz do StructArray mais do que um JSON tipado: a relação aninhada participa do modelo de índice e execução.</p>
<h2 id="Where-StructArray-fits-and-where-it-does-not" class="common-anchor-header">Onde o StructArray se encaixa e onde não se encaixa<button data-href="#Where-StructArray-fits-and-where-it-does-not" class="anchor-icon" translate="no">
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
    </button></h2><p>O StructArray é uma ótima escolha quando todas as condições a seguir são verdadeiras:</p>
<ul>
<li>A aplicação tem uma entidade pai significativa, como vídeo, produto, documento, página visual ou registro de memória.</li>
<li>Cada entidade pai contém um conjunto ordenado e de comprimento variável de elementos locais.</li>
<li>Esses elementos precisam de seus próprios metadados escalares, vetores, ou ambos.</li>
<li>A busca ou a filtragem deve preservar a relação entre subcampos no mesmo offset de elemento.</li>
<li>A aplicação precisa de recuperação multivetorial no nível da entidade, resultados no nível do elemento, ou ambos.</li>
</ul>
<p>O StructArray não é automaticamente melhor para toda coleção. Um documento curto ou uma consulta simples pode ser bem atendido por um único embedding denso. A indexação multivetorial adiciona custos de armazenamento e busca; portanto, a representação adicional deve conquistar seu lugar por meio de melhor qualidade de recuperação ou granularidade mais útil dos resultados.</p>
<p>Os limites atuais de esquema e execução também importam:</p>
<ul>
<li><code translate="no">Struct</code> é suportado como tipo de elemento de um <code translate="no">Array</code>, não como campo de coleção de nível superior.</li>
<li>Todos os elementos em um StructArray compartilham um único esquema predefinido.</li>
<li><code translate="no">max_capacity</code> é obrigatório e limita o número de elementos por entidade.</li>
<li>Subcampos aninhados <code translate="no">Struct</code>, <code translate="no">Array</code>, <code translate="no">ArrayOfStruct</code> e <code translate="no">JSON</code> não são suportados dentro de um StructArray.</li>
<li>Um subcampo vetorial aceita um único índice. Use subcampos vetoriais separados para busca EmbeddingList e busca no nível do elemento quando ambos forem necessários.</li>
<li>Subcampos vetoriais precisam ser indexados antes da busca. Subcampos escalares muito usados em filtros devem ser indexados adequadamente.</li>
<li>O esquema de subcampos é fixado após a criação do campo StructArray; portanto, planeje os atributos dos elementos antes do lançamento em produção.</li>
</ul>
<p>Essas restrições tornam o modelo mais estreito do que o aninhamento arbitrário de um banco de documentos, mas também dão ao Milvus estrutura suficiente para raciocinar sobre a identidade do elemento, indexar cada subcampo e executar em duas granularidades de busca.</p>
<h2 id="StructArray-keeps-local-evidence-first-class-without-losing-the-entity" class="common-anchor-header">O StructArray mantém a evidência local como elemento de primeira classe sem perder a entidade<button data-href="#StructArray-keeps-local-evidence-first-class-without-losing-the-entity" class="anchor-icon" translate="no">
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
    </button></h2><p>O StructArray oferece ao Milvus um objeto de recuperação que esquemas planos têm dificuldade de representar: uma entidade pai com um conjunto ordenado de elementos estruturados. As relações entre esses elementos participam da filtragem, da indexação e da busca, em vez de existirem apenas no armazenamento.</p>
<p>Cada elemento mantém seus próprios metadados e embeddings. Os elementos podem satisfazer predicados escalares do mesmo elemento, participar juntos da busca EmbeddingList no nível da entidade ou competir independentemente na busca no nível do elemento. Ao mesmo tempo, eles permanecem vinculados à entidade pai cujos metadados, permissões e identidade na aplicação lhes dão contexto.</p>
<p>Para clipes de vídeo, imagens de produto, passagens de documento, patches visuais e fragmentos de memória, a evidência local pode ser pesquisada e filtrada sem perder a entidade à qual pertence. As demais escolhas de design são explícitas: selecione a granularidade da busca, atribua a cada subcampo vetorial a métrica e o índice correspondentes e decida se os resultados híbridos devem preservar os offsets dos elementos ou consolidar de volta para entidades.</p>
<h2 id="Try-StructArray-in-Milvus-30" class="common-anchor-header">Experimente o StructArray no Milvus 3.0<button data-href="#Try-StructArray-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>O StructArray está disponível no Milvus 3.0. Comece pela <a href="https://milvus.io/docs/array-of-structs.md">visão geral do StructArray</a>. Se você está avaliando recuperação multivetorial no nível da entidade, leia o <a href="https://milvus.io/docs/choose-an-embeddinglist-search-strategy.md">guia de estratégia EmbeddingList</a>. Para granularidade de resultados e comportamento de consolidação, consulte <a href="https://milvus.io/docs/hybrid-search-with-structarray.md">Hybrid Search com StructArray</a>.</p>
<p>Para o contexto mais amplo do lançamento, consulte o <a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">blog de lançamento do Milvus 3.0</a>, as <a href="https://milvus.io/docs/release_notes.md">notas de versão</a> e o <a href="https://github.com/milvus-io/milvus">repositório milvus-io/milvus</a>.</p>
<p>O <a href="https://zilliz.com/">Zilliz Cloud</a> também suporta o StructArray e a busca EmbeddingList para implantações gerenciadas. Revise o <a href="https://docs.zilliz.com/docs/use-array-of-structs">guia de StructArray do Zilliz Cloud</a> para limites específicos do serviço. No Zilliz Cloud, operadores escalares em StructArray estão documentados atualmente para clusters On-Demand.</p>
<p>Para discutir um esquema ou um design de recuperação com a equipe, participe da <a href="https://discord.com/invite/8uyFbECzPX">comunidade Milvus no Discord</a> ou agende uma sessão de <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting">Milvus Office Hours</a>.</p>
