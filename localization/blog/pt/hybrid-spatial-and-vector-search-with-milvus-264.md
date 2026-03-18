---
id: hybrid-spatial-and-vector-search-with-milvus-264.md
title: Como utilizar a pesquisa espacial e vetorial híbrida com o Milvus
author: Alden
date: 2026-3-18
cover: assets.zilliz.com/cover_8b550decfe.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus 2.6.4, hybrid spatial vector search, Milvus Geometry, R-Tree index,
  vector database geospatial search
meta_title: |
  Hybrid Spatial and Vector Search with Milvus 2.6.4 (Geometry & R-Tree)
desc: >-
  Saiba como o Milvus 2.6.4 permite a pesquisa espacial e vetorial híbrida
  utilizando Geometry e R-Tree, com informações sobre o desempenho e exemplos
  práticos.
origin: 'https://milvus.io/blog/hybrid-spatial-and-vector-search-with-milvus-264.md'
---
<p>Uma consulta como "encontrar restaurantes românticos num raio de 3 km" parece simples. Mas não é, porque combina filtragem de localização e pesquisa semântica. A maioria dos sistemas precisa de dividir esta consulta em duas bases de dados, o que significa sincronizar dados, fundir resultados no código e latência extra.</p>
<p><a href="https://milvus.io">O Milvus</a> 2.6.4 elimina essa divisão. Com um tipo de dados <strong>GEOMETRY</strong> nativo e um índice <strong>R-Tree</strong>, o Milvus pode aplicar restrições de localização e semânticas numa única consulta. Isto torna a pesquisa híbrida espacial e semântica muito mais fácil e eficiente.</p>
<p>Este artigo explica porque é que esta alteração foi necessária, como é que o GEOMETRY e o R-Tree funcionam no Milvus, que ganhos de desempenho se podem esperar e como configurá-lo com o SDK Python.</p>
<h2 id="The-Limitations-of-Traditional-Geo-and-Semantic-Search" class="common-anchor-header">As Limitações da Pesquisa Geo e Semântica Tradicional<button data-href="#The-Limitations-of-Traditional-Geo-and-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Consultas como "restaurantes românticos num raio de 3 km" são difíceis de tratar por duas razões:</p>
<ul>
<li><strong>"Romântico" precisa de pesquisa semântica.</strong> O sistema tem de vetorizar as críticas e as etiquetas dos restaurantes e depois encontrar correspondências por semelhança no espaço de incorporação. Isto só funciona numa base de dados vetorial.</li>
<li><strong>"Num raio de 3 km" necessita de filtragem espacial.</strong> Os resultados têm de ser limitados a "num raio de 3 km do utilizador" ou, por vezes, "dentro de um polígono de entrega específico ou de um limite administrativo".</li>
</ul>
<p>Numa arquitetura tradicional, satisfazer ambas as necessidades significava normalmente executar dois sistemas lado a lado:</p>
<ul>
<li><strong>PostGIS / Elasticsearch</strong> para geofencing, cálculos de distância e filtragem espacial.</li>
<li>Uma <strong>base de dados de vectores</strong> para a pesquisa aproximada do vizinho mais próximo (ANN) sobre embeddings.</li>
</ul>
<p>Este design de "duas bases de dados" cria três problemas práticos:</p>
<ul>
<li><strong>Sincronização de dados penosa.</strong> Se um restaurante muda de endereço, é necessário atualizar tanto o sistema geográfico como a base de dados vetorial. A falta de uma atualização produz resultados inconsistentes.</li>
<li><strong>Maior latência.</strong> A aplicação tem de chamar dois sistemas e fundir os seus resultados, o que aumenta as viagens de ida e volta à rede e o tempo de processamento.</li>
<li><strong>Filtragem ineficaz.</strong> Se o sistema executasse a pesquisa vetorial em primeiro lugar, frequentemente apresentava muitos resultados que estavam longe do utilizador e tinham de ser eliminados mais tarde. Se aplicasse primeiro a filtragem por localização, o conjunto restante continuava a ser grande, pelo que o passo de pesquisa vetorial continuava a ser dispendioso.</li>
</ul>
<p>O Milvus 2.6.4 resolve este problema adicionando suporte de geometria espacial diretamente à base de dados vetorial. A pesquisa semântica e a filtragem de localização são agora executadas na mesma consulta. Com tudo num único sistema, a pesquisa híbrida é mais rápida e mais fácil de gerir.</p>
<h2 id="What-GEOMETRY-Adds-to-Milvus" class="common-anchor-header">O que a GEOMETRY acrescenta ao Milvus<button data-href="#What-GEOMETRY-Adds-to-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus 2.6 introduz um tipo de campo escalar chamado DataType.GEOMETRY. Em vez de armazenar localizações como números separados de longitude e latitude, o Milvus armazena agora objectos geométricos: pontos, linhas e polígonos. Consultas como "este ponto está dentro de uma região?" ou "está dentro de X metros?" tornam-se operações nativas. Não há necessidade de criar soluções alternativas para coordenadas brutas.</p>
<p>A implementação segue a<strong>norma</strong> <a href="https://www.ogc.org/standard/sfa/"></a><strong>OpenGIS Simple Features Access</strong>, pelo que funciona com a maioria das ferramentas geoespaciais existentes. Os dados geométricos são armazenados e consultados utilizando <strong>WKT (Well-Known Text)</strong>, um formato de texto padrão que é legível por humanos e analisável por programas.</p>
<p>Tipos de geometria suportados:</p>
<ul>
<li><strong>POINT</strong>: uma localização única, como o endereço de uma loja ou a posição de um veículo em tempo real</li>
<li><strong>LINESTRING</strong>: uma linha, como uma linha central de uma estrada ou um caminho de deslocação</li>
<li><strong>POLYGON</strong>: uma área, como um limite administrativo ou uma geofence</li>
<li><strong>Tipos de recolha</strong>: MULTIPOINT, MULTILINESTRING, MULTIPOLYGON e GEOMETRYCOLLECTION</li>
</ul>
<p>Também suporta operadores espaciais padrão, incluindo</p>
<ul>
<li><strong>Relações espaciais</strong>: contenção (ST_CONTAINS, ST_WITHIN), intersecção (ST_INTERSECTS, ST_CROSSES) e contacto (ST_TOUCHES)</li>
<li><strong>Operações de distância</strong>: cálculo de distâncias entre geometrias (ST_DISTANCE) e filtragem de objectos dentro de uma determinada distância (ST_DWITHIN)</li>
</ul>
<h2 id="How-R-Tree-Indexing-Works-Inside-Milvus" class="common-anchor-header">Como funciona a indexação R-Tree no Milvus<button data-href="#How-R-Tree-Indexing-Works-Inside-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>O suporte de GEOMETRIA está integrado no motor de pesquisa Milvus e não apenas exposto como uma funcionalidade API. Os dados espaciais são indexados e processados diretamente no motor utilizando o índice R-Tree (Rectangle Tree).</p>
<p>Uma <strong>R-Tree</strong> agrupa objectos próximos utilizando <strong>rectângulos mínimos de delimitação (MBRs)</strong>. Durante uma consulta, o motor ignora grandes regiões que não se sobrepõem à geometria da consulta e apenas executa verificações detalhadas num pequeno conjunto de candidatos. Isto é muito mais rápido do que analisar todos os objectos.</p>
<h3 id="How-Milvus-Builds-the-R-Tree" class="common-anchor-header">Como o Milvus constrói a R-Tree</h3><p>A construção da R-Tree acontece em camadas:</p>
<table>
<thead>
<tr><th><strong>Nível</strong></th><th><strong>O que Milvus faz</strong></th><th><strong>Analogia Intuitiva</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Nível da folha</strong></td><td>Para cada objeto geométrico (ponto, linha ou polígono), o Milvus calcula o seu retângulo mínimo de delimitação (MBR) e armazena-o como um nó folha.</td><td>Embrulhar cada item numa caixa transparente que se ajusta exatamente a ele.</td></tr>
<tr><td><strong>Níveis intermédios</strong></td><td>Os nós folha próximos são agrupados (tipicamente 50-100 de cada vez), e um MBR pai maior é criado para cobrir todos eles.</td><td>Colocar pacotes da mesma vizinhança numa única caixa de entrega.</td></tr>
<tr><td><strong>Nível da raiz</strong></td><td>Este agrupamento continua até que todos os dados sejam cobertos por um único MBR raiz.</td><td>Carregamento de todas as caixas num camião de longo curso.</td></tr>
</tbody>
</table>
<p>Com esta estrutura implementada, a complexidade da consulta espacial cai de uma varredura completa <strong>O(n)</strong> para <strong>O(log n)</strong>. Na prática, as consultas sobre milhões de registos podem passar de centenas de milissegundos para apenas alguns milissegundos, sem perder precisão.</p>
<h3 id="How-Queries-are-Executed-Two-Phase-Filtering" class="common-anchor-header">Como as consultas são executadas: Filtragem em duas fases</h3><p>Para equilibrar velocidade e correção, o Milvus utiliza uma estratégia <strong>de filtragem em duas fases</strong>:</p>
<ul>
<li><strong>Filtro grosseiro:</strong> o índice R-Tree verifica primeiro se o retângulo delimitador da consulta se sobrepõe a outros rectângulos delimitadores no índice. Isto remove rapidamente a maioria dos dados não relacionados e mantém apenas um pequeno conjunto de candidatos. Como estes rectângulos são formas simples, a verificação é muito rápida, mas pode incluir alguns resultados que não correspondem realmente.</li>
<li><strong>Filtro fino</strong>: os restantes candidatos são depois verificados utilizando <strong>o GEOS</strong>, a mesma biblioteca de geometria utilizada por sistemas como o PostGIS. A GEOS efectua cálculos geométricos exactos, tais como a intersecção de formas ou o facto de uma conter outra, para produzir resultados finais corretos.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Hybrid_Spatialand_Vector_Searchwith_Milvus2_6_1_978d62cb30.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O Milvus aceita dados geométricos no formato <strong>WKT (Well-Known Text)</strong> mas armazena-os internamente como <strong>WKB (Well-Known Binary).</strong> O WKB é mais compacto, o que reduz o armazenamento e melhora o I/O. Os campos GEOMETRY também suportam armazenamento mapeado na memória (mmap), pelo que os grandes conjuntos de dados espaciais não precisam de caber inteiramente na RAM.</p>
<h2 id="Performance-Improvements-with-R-Tree" class="common-anchor-header">Melhorias de desempenho com a R-Tree<button data-href="#Performance-Improvements-with-R-Tree" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Query-Latency-Stays-Flat-as-Data-Grows" class="common-anchor-header">A latência da consulta mantém-se estável à medida que os dados crescem.</h3><p>Sem um índice R-Tree, o tempo de consulta aumenta linearmente com o tamanho dos dados - 10 vezes mais dados significam consultas 10 vezes mais lentas.</p>
<p>Com o R-Tree, o tempo de consulta cresce logaritmicamente. Em conjuntos de dados com milhões de registos, a filtragem espacial pode ser dezenas a centenas de vezes mais rápida do que uma pesquisa completa.</p>
<h3 id="Accuracy-is-Not-Sacrificed-For-Speed" class="common-anchor-header">A precisão não é sacrificada pela velocidade</h3><p>A R-Tree limita os candidatos por caixa delimitadora e, em seguida, o GEOS verifica cada um deles com matemática geométrica exacta. Qualquer coisa que pareça uma correspondência, mas que na verdade esteja fora da área de consulta, é removida na segunda passagem.</p>
<h3 id="Hybrid-Search-Throughput-Improves" class="common-anchor-header">O rendimento da pesquisa híbrida melhora</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Hybrid_Spatialand_Vector_Searchwith_Milvus2_6_2_b458b24bf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A R-Tree remove primeiro os registos fora da área de destino. Depois, o Milvus executa a similaridade vetorial (L2, IP ou cosseno) apenas nos restantes candidatos. Menos candidatos significa menor custo de pesquisa e maior número de consultas por segundo (QPS).</p>
<h2 id="Getting-Started-GEOMETRY-with-the-Python-SDK" class="common-anchor-header">Introdução: GEOMETRIA com o Python SDK<button data-href="#Getting-Started-GEOMETRY-with-the-Python-SDK" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Define-the-Collection-and-Create-Indexes" class="common-anchor-header">Definir a coleção e criar índices</h3><p>Primeiro, defina um campo DataType.GEOMETRY no esquema da coleção. Isto permite ao Milvus armazenar e consultar dados geométricos.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType  
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np  
<span class="hljs-comment"># Connect to Milvus  </span>
milvus_client = MilvusClient(<span class="hljs-string">&quot;[http://localhost:19530](http://localhost:19530)&quot;</span>)  
collection_name = <span class="hljs-string">&quot;lb_service_demo&quot;</span>  
dim = <span class="hljs-number">128</span>  
<span class="hljs-comment"># 1. Define schema  </span>
schema = milvus_client.create_schema(enable_dynamic_field=<span class="hljs-literal">True</span>)  
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)  
schema.add_field(<span class="hljs-string">&quot;vector&quot;</span>, DataType.FLOAT_VECTOR, dim=dim)  
schema.add_field(<span class="hljs-string">&quot;location&quot;</span>, DataType.GEOMETRY)  <span class="hljs-comment"># Define geometry field  </span>
schema.add_field(<span class="hljs-string">&quot;poi_name&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">128</span>)  
<span class="hljs-comment"># 2. Create index parameters  </span>
index_params = milvus_client.prepare_index_params()  
<span class="hljs-comment"># Create an index for the vector field (e.g., IVF_FLAT)  </span>
index_params.add_index(  
   field_name=<span class="hljs-string">&quot;vector&quot;</span>,  
   index_type=<span class="hljs-string">&quot;IVF_FLAT&quot;</span>,  
   metric_type=<span class="hljs-string">&quot;L2&quot;</span>,  
   params={<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">128</span>}  
)  
<span class="hljs-comment"># Create an R-Tree index for the geometry field (key step)  </span>
index_params.add_index(  
   field_name=<span class="hljs-string">&quot;location&quot;</span>,  
   index_type=<span class="hljs-string">&quot;RTREE&quot;</span>  <span class="hljs-comment"># Specify the index type as RTREE  </span>
)  
<span class="hljs-comment"># 3. Create collection  </span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):  
   milvus_client.drop_collection(collection_name)  
milvus_client.create_collection(  
   collection_name=collection_name,  
   schema=schema,  
   index_params=index_params,  <span class="hljs-comment"># Create the collection with indexes attached  </span>
   consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>  
)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection <span class="hljs-subst">{collection_name}</span> created with R-Tree index.&quot;</span>)  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Insert-Data" class="common-anchor-header">Inserir dados</h3><p>Ao inserir dados, os valores geométricos devem estar no formato WKT (Well-Known Text). Cada registo inclui a geometria, o vetor e outros campos.</p>
<pre><code translate="no"><span class="hljs-comment"># Mock data: random POIs in a region of Beijing  </span>
data = []  
<span class="hljs-comment"># Example WKT: POINT(longitude latitude)  </span>
geo_points = [  
   <span class="hljs-string">&quot;POINT(116.4074 39.9042)&quot;</span>,  <span class="hljs-comment"># Near the Forbidden City  </span>
   <span class="hljs-string">&quot;POINT(116.4600 39.9140)&quot;</span>,  <span class="hljs-comment"># Near Guomao  </span>
   <span class="hljs-string">&quot;POINT(116.3200 39.9900)&quot;</span>,  <span class="hljs-comment"># Near Tsinghua University  </span>
]  
<span class="hljs-keyword">for</span> i, wkt <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(geo_points):  
   vec = np.random.random(dim).tolist()  
   data.append({  
       <span class="hljs-string">&quot;id&quot;</span>: i,  
       <span class="hljs-string">&quot;vector&quot;</span>: vec,  
       <span class="hljs-string">&quot;location&quot;</span>: wkt,  
       <span class="hljs-string">&quot;poi_name&quot;</span>: <span class="hljs-string">f&quot;POI_<span class="hljs-subst">{i}</span>&quot;</span>  
   })  
res = milvus_client.insert(collection_name=collection_name, data=data)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted <span class="hljs-subst">{res[<span class="hljs-string">&#x27;insert_count&#x27;</span>]}</span> entities.&quot;</span>)  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Run-a-Hybrid-Spatial-Vector-Query-Example" class="common-anchor-header">Executar uma consulta espacial-vetorial híbrida (exemplo)</h3><p><strong>Cenário:</strong> encontrar os 3 principais PIs mais semelhantes no espaço vetorial e localizados num raio de 2 quilómetros de um determinado ponto, como a localização do utilizador.</p>
<p>Utilize o operador ST_DWITHIN para aplicar o filtro de distância. O valor da distância é especificado em <strong>metros.</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Load the collection into memory  </span>
milvus_client.load_collection(collection_name)  
<span class="hljs-comment"># User location (WKT)  </span>
user_loc_wkt = <span class="hljs-string">&quot;POINT(116.4070 39.9040)&quot;</span>  
search_vec = np.random.random(dim).tolist()  
<span class="hljs-comment"># Build the filter expression: use ST_DWITHIN for a 2000-meter radius filter  </span>
filter_expr = <span class="hljs-string">f&quot;ST_DWITHIN(location, &#x27;<span class="hljs-subst">{user_loc_wkt}</span>&#x27;, 2000)&quot;</span>  
<span class="hljs-comment"># Execute the search  </span>
search_res = milvus_client.search(  
   collection_name=collection_name,  
   data=[search_vec],  
   <span class="hljs-built_in">filter</span>=filter_expr,  <span class="hljs-comment"># Inject geometry filter  </span>
   limit=<span class="hljs-number">3</span>,  
   output_fields=[<span class="hljs-string">&quot;poi_name&quot;</span>, <span class="hljs-string">&quot;location&quot;</span>]  
)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Search Results:&quot;</span>)  
<span class="hljs-keyword">for</span> hits <span class="hljs-keyword">in</span> search_res:  
   <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> hits:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;ID: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, Score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, Name: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;poi_name&#x27;</span>]}</span>&quot;</span>)  
<button class="copy-code-btn"></button></code></pre>
<h2 id="Tips-for-Production-Use" class="common-anchor-header">Sugestões para utilização na produção<button data-href="#Tips-for-Production-Use" class="anchor-icon" translate="no">
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
<li><strong>Crie sempre um índice R-Tree nos campos GEOMETRY.</strong> Para conjuntos de dados com mais de 10.000 entidades, os filtros espaciais sem um índice RTREE recuam para uma pesquisa completa e o desempenho diminui drasticamente.</li>
<li><strong>Utilize um sistema de coordenadas consistente.</strong> Todos os dados de localização devem utilizar o mesmo sistema (por exemplo, <a href="https://en.wikipedia.org/wiki/World_Geodetic_System"></a> WGS<a href="https://en.wikipedia.org/wiki/World_Geodetic_System">84</a>). A mistura de sistemas de coordenadas interrompe os cálculos de distância e contenção.</li>
<li><strong>Escolha o operador espacial correto para a consulta.</strong> ST_DWITHIN para pesquisas "dentro de X metros". ST_CONTAINS ou ST_WITHIN para verificações de geofencing e contenção.</li>
<li><strong>Os valores de geometria NULL são tratados automaticamente.</strong> Se o campo GEOMETRY for anulável (nullable=True), o Milvus ignora os valores NULL durante as pesquisas espaciais. Não é necessária qualquer lógica de filtragem adicional.</li>
</ul>
<h2 id="Deployment-Requirements" class="common-anchor-header">Requisitos de implementação<button data-href="#Deployment-Requirements" class="anchor-icon" translate="no">
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
    </button></h2><p>Para utilizar estas funcionalidades na produção, certifique-se de que o seu ambiente cumpre os seguintes requisitos.</p>
<p><strong>1. Versão do Milvus</strong></p>
<p>É necessário executar <strong>o Milvus 2.6.4 ou posterior</strong>. As versões anteriores não suportam DataType.GEOMETRY ou o tipo de índice <strong>RTREE</strong>.</p>
<p><strong>2. Versões do SDK</strong></p>
<ul>
<li><strong>PyMilvus</strong>: atualizar para a versão mais recente (recomenda-se a série <strong>2.6.x</strong> ). Isto é necessário para a serialização correta do WKT e para a passagem de parâmetros de índice RTREE.</li>
<li><strong>Java / Go / Node SDKs</strong>: verifique as notas de lançamento de cada SDK e confirme se estão alinhadas com as definições do proto <strong>2.6.4</strong>.</li>
</ul>
<p><strong>3. Bibliotecas de geometria incorporadas</strong></p>
<p>O servidor Milvus já inclui Boost.Geometry e GEOS, pelo que não é necessário instalar estas bibliotecas.</p>
<p><strong>4. Utilização de memória e planeamento de capacidade</strong></p>
<p>Os índices R-Tree utilizam memória extra. Ao planear a capacidade, lembre-se de orçamentar os índices de geometria, bem como os índices vectoriais como HNSW ou IVF. O campo GEOMETRY suporta armazenamento mapeado por memória (mmap), que pode reduzir a utilização de memória ao manter parte dos dados no disco.</p>
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
    </button></h2><p>A pesquisa semântica com base na localização exige mais do que a aplicação de um filtro geográfico a uma consulta vetorial. Requer tipos de dados espaciais incorporados, índices adequados e um motor de pesquisa que possa lidar com a localização e os vectores em conjunto.</p>
<p><strong>O Milvus 2.6.4</strong> resolve este problema com campos <strong>GEOMETRY</strong> nativos e índices <strong>R-Tree</strong>. A filtragem espacial e a pesquisa vetorial são executadas numa única consulta, num único armazenamento de dados. A R-Tree trata da poda espacial rápida, enquanto o GEOS garante resultados exactos.</p>
<p>Para aplicações que necessitam de recuperação com reconhecimento de localização, isto elimina a complexidade de executar e sincronizar dois sistemas separados.</p>
<p>Se estiver a trabalhar em pesquisa espacial e vetorial com reconhecimento de localização ou híbrida, gostaríamos de conhecer a sua experiência.</p>
<p><strong>Tem perguntas sobre o Milvus?</strong> Junte-se ao nosso <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canal Slack</a> ou marque uma sessão de 20 minutos <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">do Milvus Office Hours</a>.</p>
