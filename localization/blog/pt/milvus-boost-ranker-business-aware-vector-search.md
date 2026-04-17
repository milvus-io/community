---
id: milvus-boost-ranker-business-aware-vector-search.md
title: >-
  Como utilizar o Milvus Boost Ranker para uma pesquisa de vectores orientada
  para as empresas
author: Wei Zang
date: 2026-3-24
cover: >-
  assets.zilliz.com/How_to_Use_Milvus_Boost_Ranker_to_Improve_Vector_Search_Ranking_4f47a2a8c6_c3ed6feec6.jpg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus Boost Ranker, vector search ranking, metadata reranking, Milvus 2.6'
meta_title: |
  Milvus Boost Ranker: Add Business Rules to Vector Search
desc: >-
  Saiba como o Milvus Boost Ranker lhe permite colocar regras de negócio em
  camadas sobre a similaridade vetorial - impulsionar documentos oficiais,
  despromover conteúdos obsoletos, adicionar diversidade.
origin: 'https://milvus.io/blog/milvus-boost-ranker-business-aware-vector-search.md'
---
<p>A pesquisa vetorial classifica os resultados por semelhança de incorporação - quanto mais próximos os vectores, maior o resultado. Alguns sistemas adicionam um reranker baseado em modelos (BGE, Voyage, Cohere) para melhorar a ordenação. Mas nenhuma destas abordagens dá resposta a um requisito fundamental na produção: <strong>o contexto comercial é tão importante como a relevância semântica, por vezes mais.</strong></p>
<p>Um sítio de comércio eletrónico precisa de mostrar primeiro os produtos em stock das lojas oficiais. Uma plataforma de conteúdos quer fixar anúncios recentes. Uma base de conhecimento empresarial precisa de documentos de autoridade no topo. Quando a classificação se baseia apenas na distância vetorial, estas regras são ignoradas. Os resultados podem ser relevantes, mas não são apropriados.</p>
<p><strong><a href="https://milvus.io/docs/reranking.md">O Boost Ranker</a></strong>, introduzido no <a href="https://milvus.io/intro">Milvus</a> 2.6, resolve este problema. Permite-lhe ajustar as classificações dos resultados de pesquisa utilizando regras de metadados - sem reconstrução do índice, sem alteração do modelo. Este artigo aborda como ele funciona, quando usá-lo e como implementá-lo com código.</p>
<h2 id="What-Is-Boost-Ranker" class="common-anchor-header">O que é o Boost Ranker?<button data-href="#What-Is-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>O Boost Ranker é um recurso de reranking leve e baseado em regras do Milvus 2.6.2</strong> que ajusta os resultados <a href="https://zilliz.com/learn/vector-similarity-search">de pesquisa vetoriais</a> usando campos de metadados escalares. Ao contrário dos rerankers baseados em modelos que chamam LLMs externos ou serviços de incorporação, o Boost Ranker opera inteiramente dentro do Milvus usando regras simples de filtro e peso. Sem dependências externas, sobrecarga mínima de latência - adequado para uso em tempo real.</p>
<p>A configuração é feita através da <a href="https://milvus.io/docs/manage-functions.md">API Function</a>. Depois que a pesquisa vetorial retorna um conjunto de candidatos, o Boost Ranker aplica três operações:</p>
<ol>
<li><strong>Filtro:</strong> identifica os resultados que correspondem a condições específicas (por exemplo, <code translate="no">is_official == true</code>)</li>
<li><strong>Boost:</strong> multiplica suas pontuações por um peso configurado</li>
<li><strong>Shuffle:</strong> opcionalmente, adiciona um pequeno fator aleatório (0-1) para introduzir diversidade</li>
</ol>
<h3 id="How-It-Works-Under-the-Hood" class="common-anchor-header">Como funciona por baixo do capô</h3><p>O Boost Ranker é executado dentro do Milvus como uma etapa de pós-processamento:</p>
<ol>
<li><strong>Pesquisa de vetores</strong> - cada segmento retorna candidatos com IDs, pontuações de similaridade e metadados.</li>
<li><strong>Aplicar regras</strong> - o sistema filtra os registos correspondentes e ajusta as suas pontuações utilizando o peso configurado e a opção <code translate="no">random_score</code>.</li>
<li><strong>Mesclar e classificar</strong> - todos os candidatos são combinados e reordenados por pontuações atualizadas para produzir os resultados finais do Top-K.</li>
</ol>
<p>Como o Boost Ranker opera apenas nos candidatos já recuperados - e não no conjunto de dados completo - o custo computacional adicional é insignificante.</p>
<h2 id="When-Should-You-Use-Boost-Ranker" class="common-anchor-header">Quando se deve usar o Boost Ranker?<button data-href="#When-Should-You-Use-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Boosting-Important-Results" class="common-anchor-header">Impulsionando resultados importantes</h3><p>O caso de uso mais comum: colocar regras comerciais simples no topo da pesquisa semântica.</p>
<ul>
<li><strong>Comércio eletrónico:</strong> impulsionar produtos de lojas de referência, vendedores oficiais ou promoções pagas. Impulsione itens com altas vendas recentes ou taxas de cliques mais altas.</li>
<li><strong>Plataformas de conteúdos:</strong> dê prioridade a conteúdos publicados recentemente através de um campo <code translate="no">publish_time</code>, ou impulsione publicações de contas verificadas.</li>
<li><strong>Pesquisa empresarial:</strong> dê maior prioridade aos documentos em que <code translate="no">doctype == &quot;policy&quot;</code> ou <code translate="no">is_canonical == true</code>.</li>
</ul>
<p>Tudo configurável com um filtro + peso. Sem alterações no modelo de incorporação, sem reconstruções de índice.</p>
<h3 id="Demoting-Without-Removing" class="common-anchor-header">Rebaixar sem remover</h3><p>O Boost Ranker também pode baixar a classificação de determinados resultados - uma alternativa mais suave à filtragem rígida.</p>
<ul>
<li><strong>Produtos com pouco stock:</strong> se <code translate="no">stock &lt; 10</code>, reduza ligeiramente o seu peso. Ainda podem ser encontrados, mas não dominarão as posições de topo.</li>
<li><strong>Conteúdo sensível:</strong> reduza o peso do conteúdo sinalizado em vez de o remover totalmente. Limita a exposição sem censura rígida.</li>
<li><strong>Documentos obsoletos:</strong> os documentos em que <code translate="no">year &lt; 2020</code> é classificado mais baixo para que o conteúdo mais recente apareça primeiro.</li>
</ul>
<p>Os utilizadores ainda podem encontrar resultados despromovidos percorrendo o ecrã ou pesquisando com mais precisão, mas não irão excluir o conteúdo mais relevante.</p>
<h3 id="Adding-Diversity-with-Controlled-Randomness" class="common-anchor-header">Adicionar diversidade com aleatoriedade controlada</h3><p>Quando muitos resultados têm pontuações semelhantes, o Top-K pode parecer idêntico em todas as consultas. O parâmetro <code translate="no">random_score</code> do Boost Ranker introduz uma pequena variação:</p>
<pre><code translate="no" class="language-json"><span class="hljs-string">&quot;random_score&quot;</span>: {
  <span class="hljs-string">&quot;seed&quot;</span>: <span class="hljs-number">126</span>,
  <span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;id&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">seed</code>: controla a aleatoriedade geral para reprodutibilidade</li>
<li><code translate="no">field</code>: normalmente a chave primária <code translate="no">id</code>, assegura que o mesmo registo recebe sempre o mesmo valor aleatório</li>
</ul>
<p>Isto é útil para <strong>diversificar as recomendações</strong> (evitando que os mesmos itens apareçam sempre em primeiro lugar) e para <strong>a exploração</strong> (combinando pesos comerciais fixos com pequenas perturbações aleatórias).</p>
<h3 id="Combining-Boost-Ranker-with-Other-Rankers" class="common-anchor-header">Combinando o Boost Ranker com outros classificadores</h3><p>O Boost Ranker é definido através da API Function com <code translate="no">params.reranker = &quot;boost&quot;</code>. Duas coisas a saber sobre a sua combinação:</p>
<ul>
<li><strong>Limitação:</strong> na pesquisa híbrida (multi-vetor), o Boost Ranker não pode ser o classificador de nível superior. Mas ele pode ser usado dentro de cada <code translate="no">AnnSearchRequest</code> individual para ajustar os resultados antes que eles sejam mesclados.</li>
<li><strong>Combinações comuns:</strong><ul>
<li><strong>RRF + Boost:</strong> utilize o RRF para fundir resultados multimodais e, em seguida, aplique o Boost para um ajuste fino baseado em metadados.</li>
<li><strong>Classificador de modelo + Boost:</strong> use um classificador baseado em modelo para qualidade semântica e, em seguida, o Boost para regras comerciais.</li>
</ul></li>
</ul>
<h2 id="How-to-Configure-Boost-Ranker" class="common-anchor-header">Como configurar o Boost Ranker<button data-href="#How-to-Configure-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><p>O Boost Ranker é configurado através da API Function. Para uma lógica mais complexa, combine-o com <code translate="no">FunctionScore</code> para aplicar várias regras em conjunto.</p>
<h3 id="Required-Fields" class="common-anchor-header">Campos obrigatórios</h3><p>Ao criar um objeto <code translate="no">Function</code>:</p>
<ul>
<li><code translate="no">name</code>: qualquer nome personalizado</li>
<li><code translate="no">input_field_names</code>: deve ser uma lista vazia <code translate="no">[]</code></li>
<li><code translate="no">function_type</code>: definido como <code translate="no">FunctionType.RERANK</code></li>
<li><code translate="no">params.reranker</code>: deve ser <code translate="no">&quot;boost&quot;</code></li>
</ul>
<h3 id="Key-Parameters" class="common-anchor-header">Parâmetros de chave</h3><p><strong><code translate="no">params.weight</code> (obrigatório)</strong></p>
<p>O multiplicador aplicado às pontuações dos registos correspondentes. A forma de o definir depende do critério de avaliação:</p>
<table>
<thead>
<tr><th>Tipo de métrica</th><th>Para aumentar os resultados</th><th>Para rebaixar resultados</th></tr>
</thead>
<tbody>
<tr><td>Mais alto é melhor (COSINE, IP)</td><td><code translate="no">weight &gt; 1</code></td><td><code translate="no">weight &lt; 1</code></td></tr>
<tr><td>Mais baixo é melhor (L2/Euclidiano)</td><td><code translate="no">weight &lt; 1</code></td><td><code translate="no">weight &gt; 1</code></td></tr>
</tbody>
</table>
<p><strong><code translate="no">params.filter</code> (opcional)</strong></p>
<p>Uma condição que seleciona quais os registos que têm as suas pontuações ajustadas:</p>
<ul>
<li><code translate="no">&quot;doctype == 'abstract'&quot;</code></li>
<li><code translate="no">&quot;is_premium == true&quot;</code></li>
<li><code translate="no">&quot;views &gt; 1000 and category == 'tech'&quot;</code></li>
</ul>
<p>Apenas os registos correspondentes são afectados. Tudo o resto mantém a sua pontuação original.</p>
<p><strong><code translate="no">params.random_score</code> (opcional)</strong></p>
<p>Adiciona um valor aleatório entre 0 e 1 para diversidade. Veja a secção de aleatoriedade acima para detalhes.</p>
<h3 id="Single-vs-Multiple-Rules" class="common-anchor-header">Regras únicas vs. múltiplas</h3><p><strong>Regra única</strong> - quando você tem uma restrição de negócios (por exemplo, aumentar os documentos oficiais), passe o classificador diretamente para <code translate="no">search(..., ranker=ranker)</code>.</p>
<p>Várias<strong>regras</strong> - quando você precisa de várias restrições (priorizar itens em estoque + rebaixar produtos com classificação baixa + adicionar aleatoriedade), crie vários objetos <code translate="no">Function</code> e combine-os com <code translate="no">FunctionScore</code>. Você configura:</p>
<ul>
<li><code translate="no">boost_mode</code>: como cada regra se combina com a pontuação original (<code translate="no">multiply</code> ou <code translate="no">add</code>)</li>
<li><code translate="no">function_mode</code>: como várias regras se combinam umas com as outras (<code translate="no">multiply</code> ou <code translate="no">add</code>)</li>
</ul>
<h2 id="Hands-On-Prioritizing-Official-Documents" class="common-anchor-header">Prática: Prioridade aos documentos oficiais<button data-href="#Hands-On-Prioritizing-Official-Documents" class="anchor-icon" translate="no">
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
    </button></h2><p>Vamos analisar um exemplo concreto: fazer com que os documentos oficiais tenham uma classificação mais elevada num sistema de pesquisa de documentos.</p>
<h3 id="Schema" class="common-anchor-header">Esquema</h3><p>Uma coleção chamada <code translate="no">milvus_collection</code> com estes campos:</p>
<table>
<thead>
<tr><th>Campo</th><th>Tipo de campo</th><th>Objetivo</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">id</code></td><td>INT64</td><td>Chave primária</td></tr>
<tr><td><code translate="no">content</code></td><td>VARCHAR</td><td>Texto do documento</td></tr>
<tr><td><code translate="no">embedding</code></td><td>FLOAT_VECTOR (3072)</td><td>Vetor semântico</td></tr>
<tr><td><code translate="no">source</code></td><td>VARCHAR</td><td>Origem: &quot;oficial&quot;, &quot;comunidade&quot; ou &quot;bilhete&quot;</td></tr>
<tr><td><code translate="no">is_official</code></td><td>BOOL</td><td><code translate="no">True</code> se <code translate="no">source == &quot;official&quot;</code></td></tr>
</tbody>
</table>
<p>Os campos <code translate="no">source</code> e <code translate="no">is_official</code> são os metadados que o Boost Ranker utilizará para ajustar as classificações.</p>
<h3 id="Setup-Code" class="common-anchor-header">Código de configuração</h3><pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> (
    MilvusClient,
    DataType,
    Function,
    FunctionType,
)

<span class="hljs-comment"># 1. Connect to Milvus</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
collection_name = <span class="hljs-string">&quot;milvus_collection&quot;</span>

<span class="hljs-comment"># If it already exists, drop it first for repeated testing</span>
<span class="hljs-keyword">if</span> collection_name <span class="hljs-keyword">in</span> client.list_collections():
    client.drop_collection(collection_name)

<span class="hljs-comment"># 2. Define schema</span>
schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)

schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=DataType.INT64,
    is_primary=<span class="hljs-literal">True</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;content&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">512</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;source&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">32</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;is_official&quot;</span>,
    datatype=DataType.BOOL,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    datatype=DataType.FLOAT_VECTOR,
    dim=<span class="hljs-number">3072</span>,
)

text_embedding_function = Function(
    name=<span class="hljs-string">&quot;openai_embedding&quot;</span>,
    function_type=FunctionType.TEXTEMBEDDING,
    input_field_names=[<span class="hljs-string">&quot;content&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;embedding&quot;</span>],
    params={
        <span class="hljs-string">&quot;provider&quot;</span>: <span class="hljs-string">&quot;openai&quot;</span>,
        <span class="hljs-string">&quot;model_name&quot;</span>: <span class="hljs-string">&quot;text-embedding-3-large&quot;</span>
    }
)

schema.add_function(text_embedding_function)

<span class="hljs-comment"># 3. Create Collection</span>
client.create_collection(
    collection_name=collection_name,
    schema=schema,
)

<span class="hljs-comment"># 4. Create index</span>
index_params = client.prepare_index_params()

index_params.add_index(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;IVF_FLAT&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    params={<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">16</span>},
)

client.create_index(
    collection_name=collection_name,
    index_params=index_params,
)

<span class="hljs-comment"># 5. Load Collection into memory</span>
client.load_collection(collection_name=collection_name)

docs = [
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;How to deploy Milvus on Kubernetes (Official Guide)&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;official&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">True</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">2</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Quick deployment of Milvus with Docker Compose (Official Tutorial)&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;official&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">True</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">3</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Community experience: Lessons learned from deploying Milvus&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;community&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">False</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">4</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Ticket record: Milvus deployment issue&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;ticket&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">False</span>
    },
]

client.insert(
    collection_name=collection_name,
    data=docs,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Comparing-Results-With-and-Without-Boost-Ranker" class="common-anchor-header">Comparação de resultados: Com e sem o Boost Ranker</h3><p>Primeiro, execute uma pesquisa de linha de base sem o Boost Ranker. Em seguida, adicione o Boost Ranker com <code translate="no">filter: is_official == true</code> e <code translate="no">weight: 1.2</code> e compare.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># 6. Baseline search (without Boost Ranker)</span>
query_vector = <span class="hljs-string">&quot;how to deploy milvus&quot;</span>

search_params = {
    <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
    <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">2</span>},
}

results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_params=search_params,
    limit=<span class="hljs-number">4</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;is_official&quot;</span>],
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=== Baseline search (no Boost Ranker) ===&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;id=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, &quot;</span>
        <span class="hljs-string">f&quot;source=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;source&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;is_official=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;is_official&#x27;</span>]}</span>&quot;</span>
    )

<span class="hljs-comment"># 7. Define Boost Ranker: apply weight to documents where is_official == true</span>
boost_official_ranker = Function(
    name=<span class="hljs-string">&quot;boost_official&quot;</span>,
    input_field_names=[],               <span class="hljs-comment"># Boost Ranker requires this to be an empty list</span>
    function_type=FunctionType.RERANK,
    params={
        <span class="hljs-string">&quot;reranker&quot;</span>: <span class="hljs-string">&quot;boost&quot;</span>,            <span class="hljs-comment"># Specify Boost Ranker</span>
        <span class="hljs-string">&quot;filter&quot;</span>: <span class="hljs-string">&quot;is_official==true&quot;</span>,
        <span class="hljs-comment"># For COSINE / IP (higher score is better), use weight &gt; 1 to boost</span>
        <span class="hljs-string">&quot;weight&quot;</span>: <span class="hljs-number">1.2</span>
    },
)

boosted_results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_params=search_params,
    limit=<span class="hljs-number">4</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;is_official&quot;</span>],
    ranker=boost_official_ranker,
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Search with Boost Ranker (official boosted) ===&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> boosted_results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;id=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, &quot;</span>
        <span class="hljs-string">f&quot;source=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;source&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;is_official=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;is_official&#x27;</span>]}</span>&quot;</span>
    )
<button class="copy-code-btn"></button></code></pre>
<h3 id="Results" class="common-anchor-header">Resultados</h3><pre><code translate="no">=== Baseline search (no Boost Ranker) ===
<span class="hljs-built_in">id</span>=<span class="hljs-number">1</span>, score=<span class="hljs-number">0.7351</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">4</span>, score=<span class="hljs-number">0.7017</span>, source=ticket, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">3</span>, score=<span class="hljs-number">0.6706</span>, source=community, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">2</span>, score=<span class="hljs-number">0.6435</span>, source=official, is_official=<span class="hljs-literal">True</span>

=== Search <span class="hljs-keyword">with</span> Boost Ranker (official boosted) ===
<span class="hljs-built_in">id</span>=<span class="hljs-number">1</span>, score=<span class="hljs-number">0.8821</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">2</span>, score=<span class="hljs-number">0.7722</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">4</span>, score=<span class="hljs-number">0.7017</span>, source=ticket, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">3</span>, score=<span class="hljs-number">0.6706</span>, source=community, is_official=<span class="hljs-literal">False</span>
<button class="copy-code-btn"></button></code></pre>
<p>A principal mudança: o documento <code translate="no">id=2</code> (oficial) saltou do 4º para o 2º lugar porque sua pontuação foi multiplicada por 1,2. As mensagens da comunidade e os registos de bilhetes não são removidos - apenas têm uma classificação mais baixa. Esse é o objetivo do Boost Ranker: manter a pesquisa semântica como base e, em seguida, colocar regras de negócios no topo.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusão<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/reranking.md">O Boost Ranker</a> oferece uma maneira de injetar lógica de negócios nos resultados da pesquisa vetorial sem tocar nas suas incorporações ou reconstruir índices. Impulsionar o conteúdo oficial, despromover resultados obsoletos, adicionar diversidade controlada - tudo através de uma simples configuração de filtro + peso na <a href="https://milvus.io/docs/manage-functions.md">API de funções Milvus</a>.</p>
<p>Quer esteja a construir pipelines RAG, sistemas de recomendação ou pesquisa empresarial, o Boost Ranker ajuda a colmatar a lacuna entre o que é semanticamente semelhante e o que é realmente útil para os seus utilizadores.</p>
<p>Se estiver a trabalhar na classificação de pesquisa e quiser discutir o seu caso de utilização:</p>
<ul>
<li>Junte-se à <a href="https://slack.milvus.io/">comunidade Milvus Slack</a> para se ligar a outros programadores que estão a criar sistemas de pesquisa e recuperação.</li>
<li><a href="https://milvus.io/office-hours">Reserve uma sessão gratuita de 20 minutos do Milvus Office Hours</a> para analisar a sua lógica de classificação com a equipa.</li>
<li>Se preferir ignorar a configuração da infraestrutura, <a href="https://cloud.zilliz.com/signup">o Zilliz Cloud</a> (Milvus gerido) tem um nível gratuito para começar.</li>
</ul>
<hr>
<p>Algumas perguntas que surgem quando as equipas começam a utilizar o Boost Ranker:</p>
<p><strong>O Boost Ranker pode substituir um reranker baseado em modelos como o Cohere ou o BGE?</strong>Eles resolvem problemas diferentes. Os rerankers baseados em modelos reavaliam os resultados pela qualidade semântica - eles são bons em decidir "qual documento realmente responde à pergunta". O Boost Ranker ajusta as pontuações por regras comerciais - decide "qual o documento relevante que deve aparecer em primeiro lugar". Na prática, é frequente querer as duas coisas: um classificador de modelos para a relevância semântica e, em seguida, o Boost Ranker para a lógica empresarial.</p>
<p><strong>O Boost Ranker acrescenta uma latência significativa?</strong>Não. Funciona no conjunto de candidatos já recuperados (normalmente o Top-K da pesquisa vetorial) e não no conjunto de dados completo. As operações são simples filtro e multiplicação, portanto, a sobrecarga é insignificante em comparação com a própria pesquisa vetorial.</p>
<p><strong>Como é que defino o valor do peso?</strong>Comece com pequenos ajustes. Para a semelhança COSINE (quanto maior, melhor), um peso de 1,1-1,3 é normalmente suficiente para alterar visivelmente as classificações sem anular totalmente a relevância semântica. Teste com os seus dados reais - se os resultados impulsionados com baixa semelhança começarem a dominar, reduza a ponderação.</p>
<p><strong>Posso combinar várias regras do Boost Ranker?</strong>Sim. Crie vários objectos <code translate="no">Function</code> e combine-os utilizando <code translate="no">FunctionScore</code>. Pode controlar a forma como as regras interagem através de <code translate="no">boost_mode</code> (como cada regra se combina com a pontuação original) e <code translate="no">function_mode</code> (como as regras se combinam entre si) - ambos suportam <code translate="no">multiply</code> e <code translate="no">add</code>.</p>
