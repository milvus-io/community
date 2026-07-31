---
id: >-
  announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md
title: >-
  Anunciando o Milvus 3.0: Busca Vetorial Nativa de Lake e um Mecanismo de
  Recuperação Mais Poderoso
author: Fendy Feng and Li Liu
date: 2026-7-27
cover: assets.zilliz.com/cover_of_milvus_3_0_6fab4ba929.jpg
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus 3.0, lake-native vector search, vector database, External Collections,
  AI retrieval engine
meta_title: |
  Milvus 3.0: Lake-Native Vector Search & Retrieval Engine
desc: >-
  Conheça a busca vetorial lake-native do Milvus 3.0, coleções externas
  zero-copy, recuperação esparsa mais rápida, snapshots, integração com Spark e
  recursos avançados de ranqueamento.
origin: >-
  https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md
---
<p>Hoje, estamos lançando o Milvus 3.0, um grande marco arquitetural para o projeto. Ele muda tanto onde o Milvus pode criar e servir índices quanto a quantidade de trabalho de recuperação que pode ser feita diretamente dentro do mecanismo.</p>
<ul>
<li>O Milvus 3.0 introduz <strong>um caminho nativo de lake</strong> para indexar dados vetoriais que residem em armazenamento de objetos e formatos de tabela abertos, incluindo Parquet, Lance, Iceberg e Vortex. As equipes podem tornar dados residentes no lake pesquisáveis sem manter outra cópia em um banco de dados vetorial.</li>
<li><strong>Esta versão também expande o Milvus para além da recuperação inicial de candidatos.</strong> Ordenação no lado do servidor, agregação, busca facetada, StructArray para estrutura aninhada de documento/chunk e vetores ColBERT, além de um índice esparso redesenhado, movem mais tarefas de ranqueamento, agrupamento e processamento de resultados para fora do código da aplicação e para dentro do mecanismo de recuperação.</li>
</ul>
<p>Juntos, esses avanços tornam o Milvus a base open source para recuperação de IA em produção e para arquiteturas <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Vector Lakebase</a> que combinam armazenamento nativo de lake com recuperação vetorial de alto desempenho.</p>
<iframe width="560" height="315" src="https://www.youtube.com/embed/SAm4YfrO1ok?si=xzgw5RjRTwaHWYxO" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="A-quick-glance-at-the-Milvus-30-feature-set" class="common-anchor-header">Uma visão rápida do conjunto de recursos do Milvus 3.0<button data-href="#A-quick-glance-at-the-Milvus-30-feature-set" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th><strong>Área</strong></th><th><strong>Recursos</strong></th><th><strong>Por que isso importa</strong></th></tr>
</thead>
<tbody>
<tr><td>Recuperação nativa de lake</td><td>External Collections sobre Parquet, Lance, Iceberg e Vortex</td><td>Pesquise dados residentes no lake sem manter uma segunda cópia para servir consultas</td></tr>
<tr><td>Armazenamento baseado em S3</td><td>Loon (Storage v3)</td><td>Reduza a amplificação de leituras pontuais para acesso no estilo de serving e ofereça suporte à evolução de esquema</td></tr>
<tr><td>Fluxos de trabalho offline/em lote e recuperação</td><td>Snapshots, Spark DataSource V2 e evolução de esquema online</td><td>Leve visões estáveis de coleções para avaliação, desduplicação, clustering e pipelines de features</td></tr>
<tr><td>Mecanismo de recuperação</td><td>ORDER BY, agregação, facets, StructArray e recuperação esparsa aprimorada</td><td>Mova mais processamento de resultados e pontuação multivetorial para o Milvus</td></tr>
<tr><td>Modelo de dados e operações</td><td>Vetores anuláveis, TEXT LOB, TTL, MinHash, Woodpecker e ForceMerge</td><td>Ofereça suporte a modelos de dados mais ricos e padrões operacionais de produção</td></tr>
</tbody>
</table>
<h2 id="The-lake-native-infrastructure-index-and-serve-data-where-it-already-lives" class="common-anchor-header">A infraestrutura nativa de lake: indexe e sirva dados onde eles já residem<button data-href="#The-lake-native-infrastructure-index-and-serve-data-where-it-already-lives" class="anchor-icon" translate="no">
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
    </button></h2><p>A maior mudança arquitetural no Milvus 3.0 é onde o sistema pode criar e servir índices. Dados vetoriais podem permanecer em formatos abertos no armazenamento de objetos enquanto o Milvus fornece indexação, recuperação e APIs em nível de produção.</p>
<h3 id="1-External-Collections-indexing-directly-on-lake-resident-data" class="common-anchor-header">1. External Collections: indexação diretamente em dados residentes no lake</h3><p>Muitas equipes já armazenam embeddings em um data lake — tabelas Lance, tabelas Iceberg, arquivos Parquet ou outros conjuntos de dados em formato aberto no S3, GCS ou Azure Blob Storage. Antes do Milvus 3.0, geralmente havia duas opções para pesquisar esses dados.</p>
<ul>
<li>Copiar os embeddings para um banco de dados vetorial. Isso oferece busca de baixa latência, mas cria uma segunda cópia e um pipeline de ETL que deve permanecer sincronizado.</li>
<li>Consultar o lake diretamente. Isso evita duplicação, mas, sem índices ANN, a busca vetorial se torna uma varredura por força bruta que não consegue atender à latência de produção.</li>
</ul>
<p><strong>External Collections introduzem um terceiro caminho.</strong> Você define uma coleção Milvus sobre dados que permanecem no armazenamento de objetos, mapeia campos externos para um esquema Milvus e usa as mesmas APIs de busca e consulta de uma coleção nativa. Os arquivos de origem não se movem; o Milvus cria e serve índices vetoriais, invertidos BM25, JSON e escalares sobre os dados externos.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_1_c1fb7ab16e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>External Collections são somente leitura e zero-copy</strong>, o que as torna úteis quando governança, limites de propriedade ou custo operacional exigem que o conjunto de dados de origem permaneça no lake.</p>
<p>Quando o conjunto de dados externo muda, o Milvus lê seu manifesto de armazenamento e indexa os fragmentos recém-adicionados em vez de reconstruir toda a coleção.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> time

<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> DataType, MilvusClient

client = MilvusClient(uri=<span class="hljs-string">&quot;&quot;</span>)

<span class="hljs-comment"># Register an Iceberg table as a zero-copy collection.</span>
schema = client.create_schema(
    external_source=<span class="hljs-string">&quot;s3://lake/docs/metadata/v1.metadata.json&quot;</span>,
    external_spec=json.dumps(
        {
            <span class="hljs-string">&quot;format&quot;</span>: <span class="hljs-string">&quot;iceberg-table&quot;</span>,
            <span class="hljs-string">&quot;snapshot_id&quot;</span>: <span class="hljs-number">123456789</span>,
            <span class="hljs-string">&quot;extfs&quot;</span>: {
                <span class="hljs-string">&quot;cloud_provider&quot;</span>: <span class="hljs-string">&quot;aws&quot;</span>,
                <span class="hljs-string">&quot;region&quot;</span>: <span class="hljs-string">&quot;us-east-1&quot;</span>,
                <span class="hljs-string">&quot;access_key_id&quot;</span>: os.environ[<span class="hljs-string">&quot;AWS_ACCESS_KEY_ID&quot;</span>],
                <span class="hljs-string">&quot;access_key_value&quot;</span>: os.environ[<span class="hljs-string">&quot;AWS_SECRET_ACCESS_KEY&quot;</span>],
            },
        }
    ),
)

schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, external_field=<span class="hljs-string">&quot;doc_id&quot;</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;emb&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1024</span>, external_field=<span class="hljs-string">&quot;embedding&quot;</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;title&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">1024</span>, external_field=<span class="hljs-string">&quot;title&quot;</span>)

client.create_collection(collection_name=<span class="hljs-string">&quot;docs&quot;</span>, schema=schema)

<span class="hljs-comment"># Import the external table snapshot.</span>
job_id = client.refresh_external_collection(collection_name=<span class="hljs-string">&quot;docs&quot;</span>)
<span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
    progress = client.get_refresh_external_collection_progress(job_id=job_id)
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshCompleted&quot;</span>:
        <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshFailed&quot;</span>:
        <span class="hljs-keyword">raise</span> RuntimeError(progress.reason)
    time.sleep(<span class="hljs-number">1</span>)

index_params = client.prepare_index_params()
index_params.add_index(field_name=<span class="hljs-string">&quot;emb&quot;</span>, index_type=<span class="hljs-string">&quot;HNSW&quot;</span>, metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>)
client.create_index(collection_name=<span class="hljs-string">&quot;docs&quot;</span>, index_params=index_params)

client.load_collection(collection_name=<span class="hljs-string">&quot;docs&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Em ambientes governados, a recuperação pode ser executada onde os dados têm permissão para residir. Para grandes sistemas de IA, um conjunto de dados residente no lake pode oferecer suporte a várias implantações de recuperação sem um job de migração entre elas.</p>
<p>External Collections são um recurso adicional. Coleções nativas do Milvus continuam sendo o caminho principal para serving com muitas gravações e baixa latência, enquanto External Collections são projetadas para conjuntos de dados cujo sistema de registro permanece fora do Milvus.</p>
<p>Para mais detalhes, consulte <a href="https://milvus.io/docs/create-an-external-collection.md">Criar uma External Collection</a>.</p>
<h3 id="2-Loon-Storage-v3-Efficient-Point-Reads-for-Lake-Native-Retrieval" class="common-anchor-header">2. Loon (Storage v3): leituras pontuais eficientes para recuperação nativa de lake</h3><p>External Collections levantam uma pergunta óbvia: o armazenamento de objetos é projetado para escala e durabilidade, mas consegue dar suporte às leituras pontuais estreitas que seguem uma busca ANN?</p>
<p><strong>O desafio é a amplificação de leitura.</strong> A busca vetorial costuma ser executada em duas etapas: um índice ANN retorna IDs candidatos, e o sistema busca campos selecionados para esses candidatos. Formatos otimizados para varreduras analíticas podem transformar uma consulta lógica estreita em uma leitura física muito maior.</p>
<p><strong>O Milvus 3.0 resolve esse problema com o Loon, também conhecido como Storage v3, um mecanismo de armazenamento colunar baseado em manifestos para armazenamento de objetos compatível com S3.</strong> O Loon organiza campos em <code translate="no">ColumnGroups</code> com IDs de linha alinhados, permitindo que campos escalares favoreçam filtragem e varreduras, enquanto vetores e campos intensivos em leituras pontuais usam layouts projetados para consultas mais estreitas.</p>
<p>O Loon mantém índices vetoriais e invertidos separados do formato de arquivo em vez de incorporá-los nele. Cada versão do conjunto de dados é descrita por um manifesto imutável que registra seus <code translate="no">ColumnGroups</code>, permitindo que o mesmo mecanismo de indexação funcione em Lance, Parquet, Iceberg e Vortex.</p>
<p>O design baseado em manifesto também torna a evolução de esquema menos disruptiva. Adicionar ou remover um campo pode atualizar metadados sem reescrever colunas existentes. Preencher um novo campo grava um novo <code translate="no">ColumnGroup</code> enquanto mantém os <code translate="no">ColumnGroups</code> existentes inalterados.</p>
<p><a href="https://github.com/vortex-data/vortex"><strong>Vortex</strong></a> é o formato padrão para esse caminho. É um formato colunar aberto, compatível com Arrow, com layouts flexíveis e codificações aninhadas que correspondem melhor a dados de IA intensivos em consultas pontuais. Em um benchmark interno usando 3 milhões de linhas, vetores de 128 dimensões, S3 e 256 leitores concorrentes, a E/S medida por leitura pontual caiu de cerca de 9,4 MB para a linha de base Parquet para 0,07 MB para Vortex com Loon, aproximadamente 135 vezes menos.</p>
<p>O Milvus 3.0 não faz o armazenamento de objetos se comportar como memória local. Ele reduz a amplificação de leitura que, de outra forma, torna o armazenamento de objetos impraticável para consultas pontuais no estilo de serving. Predicate pushdown para dentro do formato e uma variante local do Vortex são os próximos itens no roadmap.</p>
<p><em>Para mais detalhes, consulte nosso blog:</em> <a href="https://milvus.io/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md"><em>Por que criamos o Loon</em></a> <em>e o</em> <a href="https://github.com/vortex-data/vortex"><em>projeto Vortex</em></a><em>.</em></p>
<h3 id="3-Snapshots-point-in-time-view-without-data-copy" class="common-anchor-header">3. Snapshots: visão em um ponto no tempo sem cópia de dados</h3><p>Jobs offline precisam de uma visão consistente dos dados mesmo enquanto coleções de produção continuam recebendo gravações. Um snapshot do Milvus é uma visão somente leitura em um ponto no tempo que registra referências a arquivos de dados, índices e metadados existentes em vez de copiar todo o conjunto de dados.</p>
<p>Isso torna os snapshots baratos o suficiente para serem criados antes de operações arriscadas, como troca de modelo, job de re-embedding ou migração de esquema. Restaurar um snapshot pode reutilizar arquivos de dados e índices existentes por meio de cópia no lado do servidor no armazenamento de objetos, em vez de reimportar cada linha e reconstruir cada índice. Esse recurso é particularmente útil para cargas de trabalho de rápida evolução, como agentes de IA, nas quais os dados mudam constantemente e você deseja pontos de recuperação frequentes e baratos em vez de backups pesados ocasionais.</p>
<p>A mesma visão congelada pode dar suporte a avaliação, desduplicação, validação de backfill e testes isolados enquanto a coleção ativa continua aceitando gravações. O snapshot estabiliza a entrada lógica, embora as cargas de trabalho ainda possam compartilhar infraestrutura, como armazenamento de objetos e largura de banda de rede.</p>
<p>Snapshots não substituem backups. Um snapshot referencia arquivos pertencentes à coleção ativa e é mais adequado para recuperação lógica, clonagem e visões estáveis de curta duração. Um backup cria uma cópia independente para retenção de longo prazo e recuperação de desastres.</p>
<p>Para mais informações, consulte <a href="https://milvus.io/docs/snapshots.md">Snapshots</a>, <a href="https://milvus.io/docs/manage-snapshots.md">Gerenciar snapshots</a> e <a href="https://milvus.io/docs/snapshot-use-cases.md">Casos de uso de snapshots</a>.</p>
<h3 id="4-Spark-connector-connect-Milvus-to-batch-workflows" class="common-anchor-header">4. Conector Spark: conecte o Milvus a fluxos de trabalho em lote</h3><p>Um snapshot estável só é útil se mecanismos de processamento em lote puderem lê-lo. O Milvus 3.0 expõe o Milvus como uma Spark DataSource V2, permitindo que jobs Spark, Databricks e EMR leiam e gravem no Milvus como parte de pipelines em lote padrão.</p>
<p>Esse recurso é importante porque fluxos de trabalho de dados de IA são iterativos: a desduplicação alimenta o re-embedding, o clustering alimenta a avaliação, e a avaliação produz conjuntos curados para treinamento ou serving. Um snapshot estável fornece a esses jobs uma entrada consistente, enquanto a coleção ativa continua servindo. Com o conector Spark, o destino de um job se torna a origem do próximo, sem exportar uma coleção completa para fora do Milvus a cada vez.</p>
<p>O Milvus 3.0 também introduz operadores em lote nativos de vetores para tarefas como desduplicação, detecção de anomalias e clustering, mantendo o trabalho computacionalmente pesado fora do caminho de consulta online enquanto opera diretamente sobre dados vetoriais.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_3_cd37cad0c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="5-Online-schema-changes-and-backfill" class="common-anchor-header">5. Alterações de esquema online e backfill</h3><p>Um esquema raramente permanece estático em produção — as equipes adicionam novos modelos de embedding, vetores esparsos, rótulos, campos de metadados e políticas de retenção ao longo do tempo. O Milvus 3.0 permite adicionar, preencher e remover colunas enquanto o serving continua, em vez das reconstruções disruptivas que isso costumava exigir.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_4_51c9b4e2c1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Adicionar ou remover uma coluna não exige reescrever os dados existentes. <code translate="no">client.add_collection_field(...)</code> cria uma nova coluna anulável sem tirar a coleção do ar, e <code translate="no">client.drop_collection_field(...)</code> remove um campo obsoleto ou experimental em tempo de execução. Nenhuma dessas operações reescreve os dados existentes — cada uma é uma alteração no manifesto da coleção, e não nos arquivos de dados, motivo pelo qual não há reconstrução.</p>
<p>O Milvus 3.0 oferece suporte a dois caminhos de backfill:</p>
<ul>
<li><strong>Backfill interno</strong> (na 3.0) é para valores derivados de campos existentes. O Milvus pode gerar um vetor esparso BM25 a partir de uma coluna de texto dentro do kernel, eliminando a necessidade de um encoder no lado do cliente ao criar recuperação híbrida densa-mais-esparsa.</li>
<li><strong>Backfill externo</strong>(no roadmap) será para valores computados fora do Milvus: criar um snapshot, executar Spark sobre a visão consistente, computar uma nova coluna, gravar os valores de volta e deixar o Milvus atualizar o índice incrementalmente. Esse é o caminho previsto para grandes jobs de re-embedding — por exemplo, adicionar uma nova coluna de embedding em centenas de milhões de linhas enquanto as gravações continuam.</li>
</ul>
<p>Juntas, alterações de esquema online e backfill facilitam a evolução de pipelines de recuperação sem reconstruir uma coleção inteira toda vez que o modelo de dados muda.</p>
<h2 id="A-More-Powerful-Engine-for-End-to-End-Retrieval" class="common-anchor-header">Um mecanismo mais poderoso para recuperação de ponta a ponta<button data-href="#A-More-Powerful-Engine-for-End-to-End-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus há muito oferece suporte a mais do que busca ANN densa, incluindo recuperação esparsa baseada em BM25 e busca híbrida. O Milvus 3.0 estende o mecanismo ao longo de um eixo diferente: ele traz mais do pipeline de recuperação em múltiplas etapas para dentro do próprio Milvus, reduzindo over-fetching, lógica de aplicação duplicada e dependência de serviços separados de pós-processamento.</p>
<h3 id="1-Server-side-ORDER-BY-sort-inside-the-engine-per-segment" class="common-anchor-header">1. ORDER BY no lado do servidor: ordenação dentro do mecanismo, por segmento</h3><p>Anteriormente, ordenar exigia que as aplicações buscassem candidatos em excesso, os movessem para o cliente e os ordenassem ali. Isso consumia largura de banda e fazia o resultado final depender de onde ocorria o truncamento no lado do cliente.</p>
<p><strong>O Milvus 3.0 adiciona ORDER BY no lado do servidor</strong>, permitindo que cargas de trabalho de consulta ordenem linhas filtradas por campos escalares como avaliação, preço, atualização, estoque ou timestamp.</p>
<ul>
<li>No caminho de consulta, cada segmento ordena seu conjunto de resultados filtrado, os nós de consulta mesclam esses fluxos, e o proxy retorna o recorte solicitado.</li>
<li>No caminho de busca, ORDER BY ordena o conjunto de candidatos ANN dentro do Milvus, reduzindo over-fetching e pós-processamento duplicado no lado do cliente. Ele não altera o limite de recall estabelecido pelos candidatos ANN.</li>
</ul>
<pre><code translate="no" class="language-sql">client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;category == &#x27;shoes&#x27;&quot;</span>,
    output_fields=[<span class="hljs-string">&quot;price&quot;</span>, <span class="hljs-string">&quot;rating&quot;</span>],
    limit=<span class="hljs-number">10</span>,
    order_by=[<span class="hljs-string">&quot;rating:desc&quot;</span>, <span class="hljs-string">&quot;price:asc&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Isso é especialmente útil para buscas que combinam relevância com restrições comerciais ou voltadas ao usuário, como avaliação, preço, atualização, estoque ou timestamp.</p>
<p>Para mais informações, consulte <a href="https://milvus.io/docs/single-vector-search.md#Sort-Search-Results-by-Scalar-Fields--Milvus-30x">Ordenar resultados de busca por campos escalares</a> e <a href="https://milvus.io/docs/get-and-scalar-query.md#Sort-Query-Results--Milvus-30x">Ordenar resultados de consulta</a>.</p>
<h3 id="2-Aggregation-and-faceted-search" class="common-anchor-header">2. Agregação e busca facetada</h3><p>O Milvus 3.0 adiciona agregação no lado da consulta com operações como contagem, soma, média, mínimo e máximo, agrupadas por um ou mais campos escalares. Isso remove um padrão comum em que equipes puxam linhas filtradas para o código do cliente apenas para contar, agrupar ou calcular estatísticas simples.</p>
<pre><code translate="no" class="language-sql">client.query(
    collection_name=<span class="hljs-string">&quot;orders&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;in_stock == true&quot;</span>,
    group_by_fields=[<span class="hljs-string">&quot;category&quot;</span>],
    output_fields=[<span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;count(*)&quot;</span>, <span class="hljs-string">&quot;avg(price)&quot;</span>, <span class="hljs-string">&quot;max(rating)&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>O Milvus 3.0 também adiciona <strong>agregação de busca</strong> para busca facetada. Após uma busca ANN, o Milvus agrupa os hits recuperados por um campo e retorna contagens de buckets, estatísticas agregadas e hits de amostra top-N por bucket — o padrão por trás do agrupamento por marca, faixa de preço, cor, tenant ou tipo de documento. Uma ressalva: a agregação de busca opera sobre o conjunto de resultados recuperado por ANN, não sobre a coleção inteira, portanto as contagens de facets são aproximadas. Quando precisar de contagens exatas, use agregação no lado da consulta.</p>
<p>Para mais informações, consulte <a href="https://milvus.io/docs/get-and-scalar-query.md#Aggregate-Query-Results--Milvus-30x">Agregar resultados de consulta</a>.</p>
<h3 id="3-StructArray-for-Nested-Vectors-and-Late-Interaction-Model" class="common-anchor-header">3. StructArray para vetores aninhados e modelo de late interaction</h3><p>Muitas entidades são naturalmente representadas por múltiplos vetores. Um documento longo é uma série de chunks; um vídeo é uma sequência de frames que você preferiria manter juntos em uma única linha em vez de espalhar por muitas; um produto tem várias imagens ou ângulos. Modelos de late interaction levam isso ainda mais longe — ColBERT emite um vetor por token, ColPali um por patch visual. Em todos os casos, a unidade que você realmente quer armazenar e pesquisar é a entidade inteira, não cada fragmento isoladamente.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_5_e15816e38b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>StructArray</strong> permite que uma linha do Milvus contenha um array de comprimento variável de elementos estruturados, incluindo múltiplos vetores, preservando um único ID de entidade e um único conjunto de metadados. Isso evita dividir um documento em várias linhas e duplicar rótulos, permissões ou outros campos entre fragmentos.</p>
<p>O Milvus oferece suporte a duas granularidades de busca.</p>
<ul>
<li><strong>Busca em nível de elemento</strong> compara um vetor de consulta a cada elemento da lista e retorna o elemento correspondente específico com seu deslocamento. Isso é útil quando você quer saber qual chunk, token, patch ou imagem correspondeu. Uma linha pode aparecer mais de uma vez se múltiplos elementos corresponderem.</li>
<li><strong>Busca em nível de entidade</strong> compara a lista completa de vetores de uma consulta com a lista de vetores da linha usando <code translate="no">MAX_SIM</code>, com a métrica <code translate="no">MAX_SIM_COSINE</code>. Cada token da consulta pega sua melhor correspondência no documento, e essas melhores pontuações são somadas. Isso dá ao Milvus suporte nativo a padrões de recuperação de late interaction, como ColBERT e ColPali, mantendo uma linha por documento.</li>
</ul>
<p>Indexar cada vetor de token pode ser caro; por isso, o Milvus 3.0 adiciona vários caminhos de aceleração, incluindo TokenANN, Muvera e Lemur, que equilibram tamanho de índice, custo de treinamento e recall.</p>
<table>
<thead>
<tr><th>Estratégia</th><th>Representação da primeira etapa</th><th>Perfil de custo</th><th>Melhor para</th></tr>
</thead>
<tbody>
<tr><td>TokenANN</td><td>Cada vetor de token é indexado.</td><td>Mais alto, exato</td><td>Modelos de alta discriminação e documentos curtos</td></tr>
<tr><td>Muvera</td><td>Um vetor por documento usando FDE de projeção aleatória.</td><td>Médio, sem treinamento</td><td>Documentos longos</td></tr>
<tr><td>Lemur</td><td>Um vetor por documento usando compressão MLP aprendida</td><td>Mais baixo, requer treinamento</td><td>Modelos de baixa discriminação e vetores visuais ou de patches</td></tr>
</tbody>
</table>
<p>Em nossos benchmarks, o Lemur iguala ou supera o recall do TokenANN na maioria dos conjuntos de dados, ao mesmo tempo que reduz cada documento a um único vetor; a exceção são corpora com alta variação de comprimento, nos quais TokenANN ou outra estratégia é mais segura.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_7_8ff1ab957e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Para corpora maiores que a memória, o Milvus também oferece suporte a um índice <code translate="no">DISKANN</code> que mantém listas de embeddings em disco para reduzir a pressão sobre a RAM.</p>
<p>A busca em nível de elemento já chegou no Milvus 2.6. A filtragem para Muvera, Lemur e StructList é nova na 3.0.</p>
<h3 id="4-BM25-Index-Compression-and-SINDI" class="common-anchor-header">4. Compressão de índice BM25 e SINDI</h3><p>O Milvus já oferecia suporte à busca vetorial esparsa em versões anteriores. O Milvus 3.0 reduz o footprint do índice esparso por meio de postings compactados em blocos (algoritmos relacionados a VByte mais decodificação SIMD) e quantização (fp16 para produtos internos, u16 para BM25).</p>
<p>Em um conjunto de benchmarks internos de BM25, a nova implementação foi aproximadamente 3 vezes menor que o índice esparso do Milvus 2.6 com recall comparável. Um índice menor reduz a pressão sobre memória e largura de banda e pode melhorar a velocidade em cargas de trabalho limitadas por movimentação de dados.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_8_2e62fc9573.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O Milvus 3.0 também introduz <a href="https://arxiv.org/abs/2509.08395">SINDI</a>, um novo algoritmo de recuperação esparsa otimizado para embeddings esparsos aprendidos, como SPLADE. Como esses embeddings produzem listas de postings mais densas que BM25, algoritmos de busca intensivos em pruning podem gastar tempo substancial de CPU decidindo o que pular. Em vez disso, o SINDI organiza postings em janelas compactas e usa acumulação de pontuação amigável a SIMD para processá-los de forma eficiente, preservando a precisão da recuperação por meio de pruning sem perdas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_9_c7de29a223.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Também estendemos o SINDI além de seu design original para incluir suporte nativo a BM25, permitindo que o Milvus use o mesmo caminho otimizado de recuperação esparsa tanto para embeddings esparsos aprendidos quanto para busca full-text tradicional.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_10_e94a903bcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Em nossos benchmarks com 4 conjuntos de dados de vetores esparsos SPLADE, o SINDI atinge até cerca de 10x o QPS do MaxScore em vetores esparsos aprendidos, com um pior caso em torno de 5x.</p>
<p>SINDI é o padrão para busca esparsa por produto interno no Milvus 3.0.</p>
<h2 id="Other-Enhancements" class="common-anchor-header">Outras melhorias<button data-href="#Other-Enhancements" class="anchor-icon" translate="no">
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
<li><strong>TEXT LOB:</strong> Armazena texto-fonte longo junto aos vetores. Textos abaixo de 64 KB permanecem inline; valores maiores usam uma referência Vortex LOB.</li>
<li><strong>Suporte expandido a índices densos:</strong> Adiciona mais opções de índice dentro da família Faiss, incluindo SVS, Panorama, PQ, IVFPQ e ScaNN, para diferentes requisitos de escala, memória e recall.</li>
<li><strong>MinHash e busca de quase duplicatas:</strong> Gera assinaturas MinHash no lado do servidor e recupera candidatos quase duplicados usando MINHASH_LSH.</li>
<li><strong>Vetores anuláveis e novos tipos:</strong> Permite que campos vetoriais sejam NULL e adiciona TIMESTAMPTZ para filtragem sensível ao tempo e políticas de retenção.</li>
<li><strong>Dicionários full-text personalizados:</strong> Registra dicionários, sinônimos e recursos de stop words no cluster para tokenização multilíngue e específica de domínio.</li>
<li><strong>Woodpecker independente:</strong> Executa o log write-ahead do Milvus como um serviço independentemente escalável e observável.</li>
<li><strong>TTL de entidade</strong> <strong>****:</strong> Expira registros individuais por meio de um campo TIMESTAMPTZ, com filtragem MVCC seguida de coleta de lixo durante a compactação.</li>
<li><strong>ForceMerge:</strong> Compacta pequenos segmentos até um tamanho alvo e reconstrói índices para reduzir a amplificação de leitura antes de um serviço sustentado com muitas leituras.</li>
<li>E mais</li>
</ul>
<h2 id="Get-started-with-Milvus-30" class="common-anchor-header">Comece a usar o Milvus 3.0<button data-href="#Get-started-with-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus 3.0 está disponível hoje sob a licença Apache 2.0 e continua sendo um projeto LF AI &amp; Data. Para começar:</p>
<ul>
<li>Leia as <a href="https://milvus.io/docs/release_notes.md">notas da versão</a> e o <a href="https://milvus.io/docs/quickstart.md">guia de início rápido</a>, e obtenha o código-fonte em <a href="https://github.com/milvus-io/milvus">github.com/milvus-io/milvus</a>.</li>
<li>Entre na <a href="https://discord.com/invite/8uyFbECzPX">comunidade Milvus no Discord</a> ou agende uma sessão de <a href="https://milvus.io/office-hours">Milvus Office Hours</a> para conversar sobre seu caso de uso com os mantenedores.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_11_78476298b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-30-and-Zilliz-Vector-Lakebase" class="common-anchor-header">Milvus 3.0 e Zilliz Vector Lakebase<button data-href="#Milvus-30-and-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus 3.0 estabelece a base open source para recuperação de IA em produção e para a arquitetura emergente <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Vector Lakebase</a>, que combina armazenamento nativo de lake com recuperação vetorial de alto desempenho sobre uma única fonte da verdade, cada uma com o custo adequado.</p>
<p><a href="https://zilliz.com/">Zilliz Cloud</a> é um Vector Lakebase totalmente gerenciado criado pela equipe por trás do Milvus. Ele compartilha a mesma arquitetura distribuída e nativa de lake do Milvus e é totalmente compatível com a API do Milvus. Impulsionado por seu mecanismo de indexação proprietário Cardinal, o Zilliz Cloud entrega até 10× melhor custo-benefício do que abordagens padrão de indexação open source, ao mesmo tempo que elimina a complexidade operacional de gerenciar infraestrutura. Recursos empresariais incluem computação scale-to-zero, recuperação de desastres entre regiões, implantação BYOC, segurança e conformidade de nível empresarial (SOC 2, HIPAA, ISO 27001 e GDPR) e SLA de até 99,99%.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_12_08d1c21d25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Desenvolvedores podem implantar o Milvus como um banco de dados vetorial open source ou usar o <a href="https://zilliz.com/">Zilliz Cloud</a> para uma plataforma gerenciada em várias cargas de trabalho ao longo do ciclo de vida dos dados de IA.</p>
<h2 id="What-comes-next" class="common-anchor-header">O que vem a seguir<button data-href="#What-comes-next" class="anchor-icon" translate="no">
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
    </button></h2><p>O roadmap do Milvus se baseia na arquitetura 3.0 com predicate pushdown para External Collections, backfill externo, operadores Spark adicionais e suporte a mais formatos de tabela, incluindo Delta Lake e Apache Paimon.</p>
<p>A direção mais ampla é clara: sistemas de dados de IA precisam de um ciclo mais estreito entre recuperação online e melhoria de dados offline. Dados vetoriais não deveriam precisar ser copiados para sistemas separados toda vez que as equipes quiserem pesquisá-los, analisá-los, melhorá-los ou servi-los.</p>
