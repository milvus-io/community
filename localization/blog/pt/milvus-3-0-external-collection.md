---
id: milvus-3-0-external-collection.md
title: 'Coleção Externa do Milvus: Indexe e Recupere Dados do Data Lake Sem Movê-los'
author: Leo Liu
date: 2026-8-24
cover: assets.zilliz.com/blog_cover_external_collection_3e4d7334de.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  External Collection, Milvus 3.0, vector search on data lake, Iceberg vector
  search, Vector Lakebase
meta_title: >
  Milvus External Collection: Index and Retrieve Lake-Resident Data Without
  Moving It
desc: >-
  Milvus 3.0 introduziu o External Collection, permitindo que o Milvus construa
  índices e sirva a recuperação sobre dados que permanecem no data lake.
origin: 'https://milvus.io/blog/milvus-3-0-external-collection.md'
---
<p>Em muitos pipelines de IA, embeddings e metadados já são produzidos e armazenados em um data lake. Um pipeline de produtos pode gravar atributos de produtos e embeddings multimodais em arquivos Parquet no S3. Um corpus de recuperação ou treinamento pode viver em uma tabela Iceberg ou Lance. O lake já é onde esses conjuntos de dados são gerados, atualizados, versionados e usados pelo restante da stack de dados.</p>
<p>Bancos de dados vetoriais, no entanto, tradicionalmente foram construídos em torno de uma cópia de serviço de propriedade do banco de dados. Se as equipes quisessem busca vetorial de baixa latência sobre dados já presentes em um lake, geralmente tinham duas opções:</p>
<ul>
<li><strong>Copiar os dados para um banco de dados vetorial.</strong> Isso fornece índices ANN e um caminho de serviço de produção, mas cria uma segunda cópia do conjunto de dados e um pipeline de ETL que precisa permanecer sincronizado com a origem.</li>
<li><strong>Consultar o lake diretamente.</strong> Isso evita duplicação, mas sem uma camada de indexação e serviço ANN, a busca vetorial recorre a varreduras que não são projetadas para latência de produção.</li>
</ul>
<p><strong>O External Collection do Milvus 3.0</strong> <a href="https://milvus.io/docs/create-an-external-collection.md"><strong>introduz um terceiro caminho.</strong></a> Os dados de origem permanecem em Parquet, Iceberg, Lance, Vortex ou outro formato externo suportado, enquanto o Milvus constrói e serve índices sobre eles. Você mapeia os campos externos para um schema do Milvus, define os índices necessários, atualiza (refresh) a coleção e usa as APIs normais de busca e consulta do Milvus—sem primeiro copiar as linhas de origem para uma coleção gerenciada pelo Milvus.</p>
<p>A mudança arquitetural é direta: os dados podem permanecer no lake, enquanto o Milvus adiciona a camada de indexação e recuperação.</p>
<p>Isso também torna o External Collection um passo importante em direção ao <a href="https://zilliz.com/blog/what-is-a-vector-lakebase"><strong>Vector Lakebase</strong></a><strong>,</strong> uma arquitetura de dados unificada e nativa de lake para IA que combina serviço no nível de banco de dados vetorial com armazenamento aberto em lake, índices reutilizáveis no nível do lake e uma camada semântica compartilhada. A recuperação online não precisa mais partir de uma cópia de serviço separada enquanto Spark, pipelines de treinamento, jobs de avaliação e ferramentas de governança operam em outra versão dos dados. Esses sistemas podem trabalhar a partir da mesma fundação de dados residente no lake.</p>
<h2 id="What-an-External-Collection-is-and-what-it-changes" class="common-anchor-header">O que é um External Collection, e o que ele muda<button data-href="#What-an-External-Collection-is-and-what-it-changes" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Um External Collection</strong> é um tipo de coleção do Milvus cujos dados de origem vivem fora do armazenamento gerenciado pelo Milvus.</p>
<p>Sem um External Collection, colocar esse catálogo atrás de uma busca vetorial de produção normalmente significa criar outra cópia no Milvus:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_2_333b278a04.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Toda vez que o catálogo muda, o modelo de embedding muda ou um campo é preenchido retroativamente (backfill), outro pipeline precisa mover os dados atualizados através dessa fronteira.</p>
<p>Com o External Collection, a arquitetura se torna:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_3_71172afb44.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O Milvus <strong>não</strong> transforma os arquivos externos em uma cópia própria dos dados de origem. Em vez disso, o External Collection contém as informações que o Milvus precisa para interpretá-los e pesquisá-los:</p>
<ol>
<li>Um <code translate="no">external_source</code> que identifica os arquivos ou tabela externos.</li>
<li>Um <code translate="no">external_spec</code> que descreve o formato da origem e o acesso ao armazenamento.</li>
<li>Mapeamentos <code translate="no">external_field</code> que conectam campos no schema do Milvus a colunas no conjunto de dados externo.</li>
<li>Os índices, manifests e o estado de serviço que o Milvus cria para recuperação.</li>
</ol>
<p><strong>Dados de origem com zero-cópia não significam zero estado dentro do Milvus.</strong> O Milvus ainda constrói índices. Ainda usa computação. Ainda armazena dados em cache. A mudança é que as linhas autoritativas não precisam mais ser copiadas para o Milvus simplesmente porque você precisa que o Milvus as pesquise.</p>
<h3 id="Normal-Milvus-Collection-vs-External-Collection" class="common-anchor-header">Coleção Milvus normal vs. External Collection</h3><table>
<thead>
<tr><th><strong>Aspecto</strong></th><th><strong>Coleção gerenciada pelo Milvus</strong></th><th><strong>External Collection</strong></th></tr>
</thead>
<tbody>
<tr><td>Registros de origem</td><td>Armazenados e gerenciados pelo Milvus</td><td>Permanecem nos arquivos ou tabela externos</td></tr>
<tr><td>Como os dados entram no Milvus</td><td>Insert, upsert, import ou escrita em streaming</td><td>Mapeamento da origem externa + Refresh</td></tr>
<tr><td>Mutações online</td><td>Suportadas</td><td>Somente leitura pelo Milvus</td></tr>
<tr><td>Atualidade</td><td>Segue o caminho de escrita e o modelo de consistência do Milvus</td><td>Segue o último Refresh publicado com sucesso</td></tr>
<tr><td>Estado gerenciado pelo Milvus</td><td>Dados de origem, metadados, índices, caches</td><td>Mapeamentos, manifests, índices, caches</td></tr>
<tr><td>Caminho de consulta</td><td>APIs de busca e consulta do Milvus</td><td>APIs de busca e consulta do Milvus</td></tr>
<tr><td>Mais adequado para</td><td>Dados online em mudança contínua</td><td>Dados de lake grandes, produzidos em lote e com muitas leituras</td></tr>
</tbody>
</table>
<p>O External Collection, portanto, complementa as coleções normais do Milvus em vez de substituí-las.</p>
<p>Um sistema pode manter estado online em rápida mudança em coleções normais do Milvus enquanto usa External Collections para corpora grandes, catálogos, conjuntos de dados históricos, features de modelos ou outros dados já produzidos e governados no lake.</p>
<h2 id="Why-removing-the-second-copy-matters" class="common-anchor-header">Por que remover a segunda cópia é importante<button data-href="#Why-removing-the-second-copy-matters" class="anchor-icon" translate="no">
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
    </button></h2><p>É tentador descrever External Collections como uma otimização de armazenamento: não copie vários terabytes de dados para outro banco de dados e você economiza armazenamento. Isso é útil, mas não é o principal problema arquitetural.</p>
<p><strong>O custo maior vem de manter dois sistemas de dados alinhados.</strong></p>
<p>Considere novamente o catálogo de produtos. A plataforma de dados produz o conjunto de dados Parquet autoritativo. A busca o importa para um banco de dados vetorial. Uma equipe de recomendação pode ler os mesmos dados do lake por meio do Spark para análise offline. Um novo modelo de embedding então gera uma coluna vetorial substituta. Inventário e metadados continuam mudando simultaneamente.</p>
<p>Uma vez que a cópia de serviço online se torna independente do lake, toda mudança precisa cruzar essa fronteira:</p>
<ul>
<li>os dados precisam ser copiados;</li>
<li>a transferência precisa ser agendada e monitorada;</li>
<li>jobs com falha precisam de novas tentativas;</li>
<li>schemas e permissões podem precisar ser representados em vários sistemas;</li>
<li>a atualidade depende da rapidez com que o pipeline de sincronização acompanha as mudanças;</li>
<li>as equipes precisam saber qual cópia representa a versão que realmente desejam.</li>
</ul>
<p>O armazenamento é apenas um item de linha.</p>
<table>
<thead>
<tr><th><strong>Custo</strong></th><th><strong>Lake separado + cópia de serviço</strong></th><th><strong>External Collection</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Cópias dos dados de origem</strong></td><td>Cópia no lake mais uma cópia de serviço separada</td><td>As linhas de origem permanecem no lake</td></tr>
<tr><td><strong>Movimentação de dados</strong></td><td>Pipeline persistente de ETL/importação</td><td>Refresh sobre a origem externa</td></tr>
<tr><td><strong>Atualidade</strong></td><td>Depende da cadência de exportação/importação</td><td>Controlada pelo momento em que um novo Refresh é publicado</td></tr>
<tr><td><strong>Governança</strong></td><td>As cópias de origem e de serviço devem permanecer alinhadas</td><td>A propriedade da origem, a linhagem e o versionamento permanecem com a plataforma de lake</td></tr>
<tr><td><strong>Reuso offline</strong></td><td>Outros consumidores podem preparar suas próprias cópias</td><td>As ferramentas de lake existentes podem continuar lendo a mesma origem</td></tr>
<tr><td><strong>Recursos de serviço</strong></td><td>Dimensionados em torno da cópia do banco de dados e da carga de consultas</td><td>Indexação, computação de consultas e caches podem ser gerenciados separadamente da propriedade das linhas de origem</td></tr>
</tbody>
</table>
<p>A diferença se torna especialmente importante à medida que os dados de IA mudam com mais frequência.</p>
<p>As equipes deduplicam corpora. Elas agrupam dados em clusters para análise. Elas geram novos embeddings quando um modelo muda. Elas adicionam rótulos, resumos, entidades extraídas, pontuações de qualidade ou sinais de feedback. Elas executam jobs de avaliação e pipelines de limpeza de dados sobre o mesmo corpus do qual os aplicativos de produção recuperam informações.</p>
<p>Se cada sistema possui sua própria cópia, cada melhoria se torna outro job de sincronização.</p>
<p>O External Collection muda essa fronteira: <strong>sistemas offline podem continuar trabalhando no conjunto de dados do lake, enquanto o Milvus atende à recuperação sobre a mesma fundação.</strong></p>
<h2 id="What-data-sources-External-Collection-supports" class="common-anchor-header">Quais fontes de dados o External Collection suporta<button data-href="#What-data-sources-External-Collection-supports" class="anchor-icon" translate="no">
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
    </button></h2><p>O External Collection é projetado em torno de dados abertos e gerenciados externamente, em vez de um layout de origem específico do Milvus. Ele suporta vários formatos de origem externa por meio do <a href="https://milvus.io/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md">Storage V3</a>:</p>
<table>
<thead>
<tr><th><strong>Formato externo</strong></th><th><strong>Valor do formato</strong></th><th><strong>O que o Milvus lê</strong></th></tr>
</thead>
<tbody>
<tr><td>Apache Parquet</td><td>parquet</td><td>Um diretório ou prefixo de object storage contendo arquivos Parquet e row groups</td></tr>
<tr><td>Vortex</td><td>vortex</td><td>Arquivos Vortex e seus metadados de layout</td></tr>
<tr><td>Lance</td><td>lance-table</td><td>Um dataset Lance e seus metadados de fragmento</td></tr>
<tr><td>Apache Iceberg</td><td>iceberg-table</td><td>Metadados do Iceberg mais um snapshot selecionado</td></tr>
<tr><td>Milvus snapshot</td><td>milvus-table</td><td>Um snapshot do Milvus suportado exposto como origem externa</td></tr>
</tbody>
</table>
<p>O mapeamento entre a origem e o Milvus é explícito.</p>
<p>Uma coluna de origem chamada <code translate="no">product_id</code> pode se tornar o campo <code translate="no">id</code> do Milvus; <code translate="no">image_vec</code> pode se tornar <code translate="no">embedding</code>; e uma tabela de origem larga não precisa expor todas as colunas à coleção. Isso significa que a plataforma de dados não precisa renomear ou reescrever sua origem apenas para satisfazer o banco de dados de serviço.</p>
<p>Formatos versionados adicionam outra propriedade útil. Com uma origem como o Iceberg, a coleção pode apontar para um snapshot específico em vez do que estiver atual no momento em que a consulta é executada. Uma versão fixa da origem é útil para avaliação reproduzível, testes de regressão, análise histórica e cargas de trabalho de auditoria.</p>
<p>Os arquivos subjacentes também permanecem utilizáveis pelo restante da stack de dados. Spark, frameworks de treinamento, sistemas de governança e outras ferramentas compatíveis com lake podem continuar lendo os mesmos dados abertos.</p>
<p>O External Collection adiciona outro consumidor desses dados; ele não transforma o Milvus em seu único proprietário.</p>
<h3 id="Accessing-external-storage-securely" class="common-anchor-header">Acessando o armazenamento externo com segurança</h3><p>O Milvus também precisa de permissão para ler o armazenamento externo.</p>
<p>Dependendo do provedor de armazenamento, as implantações podem usar mecanismos como workload ou instance identity, assunção de role do AWS STS, impersonação de service account, acesso baseado em SAS ou sistemas de role específicos do provedor, em vez de embutir credenciais de longa duração na configuração do aplicativo.</p>
<p>Essa identidade de armazenamento controla como o Milvus acessa a origem. A autorização dentro do Milvus permanece como uma fronteira de segurança separada.</p>
<h2 id="How-to-create-index-refresh-and-query-an-external-collection" class="common-anchor-header">Como criar, indexar, atualizar (refresh) e consultar um External Collection<button data-href="#How-to-create-index-refresh-and-query-an-external-collection" class="anchor-icon" translate="no">
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
    </button></h2><p>O ciclo de vida do External Collection tem quatro etapas principais:</p>
<ol>
<li>Defina a origem externa e mapeie suas colunas para um schema do Milvus.</li>
<li>Defina os índices que a carga de trabalho precisa.</li>
<li>Execute o Refresh para que o Milvus descubra os dados de origem e prepare uma versão consultável.</li>
<li>Carregue a coleção e use as APIs normais de busca e consulta do Milvus.</li>
</ol>
<p>Aqui está o mesmo catálogo de produtos representado como um External Collection:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> time

<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">DataType</span>, <span class="hljs-title class_">MilvusClient</span>

client = <span class="hljs-title class_">MilvusClient</span>(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>,
)

schema = client.<span class="hljs-title function_">create_schema</span>(
    external_source=<span class="hljs-string">&quot;s3://my-lake/datasets/products/&quot;</span>,
    external_spec=json.<span class="hljs-title function_">dumps</span>(
        {
            <span class="hljs-string">&quot;format&quot;</span>: <span class="hljs-string">&quot;parquet&quot;</span>,
            <span class="hljs-string">&quot;extfs&quot;</span>: {
                <span class="hljs-string">&quot;cloud_provider&quot;</span>: <span class="hljs-string">&quot;aws&quot;</span>,
                <span class="hljs-string">&quot;region&quot;</span>: <span class="hljs-string">&quot;us-east-1&quot;</span>,
                <span class="hljs-string">&quot;use_iam&quot;</span>: <span class="hljs-string">&quot;true&quot;</span>,
                <span class="hljs-string">&quot;iam_endpoint&quot;</span>: <span class="hljs-string">&quot;https://sts.us-east-1.amazonaws.com&quot;</span>,
            },
        }
    ),
)

schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">INT64</span>,
    external_field=<span class="hljs-string">&quot;product_id&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">FLOAT_VECTOR</span>,
    dim=<span class="hljs-number">768</span>,
    external_field=<span class="hljs-string">&quot;image_vec&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;title&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">VARCHAR</span>,
    max_length=<span class="hljs-number">256</span>,
    external_field=<span class="hljs-string">&quot;product_name&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;stock&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">INT64</span>,
    external_field=<span class="hljs-string">&quot;stock&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;rating&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">FLOAT</span>,
    external_field=<span class="hljs-string">&quot;rating&quot;</span>,
)

client.<span class="hljs-title function_">create_collection</span>(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    schema=schema,
)
<button class="copy-code-btn"></button></code></pre>
<p>Os índices usam a interface normal do Milvus:</p>
<pre><code translate="no" class="language-python">index_params = client.<span class="hljs-title function_">prepare_index_params</span>()
index_params.<span class="hljs-title function_">add_index</span>(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
)
index_params.<span class="hljs-title function_">add_index</span>(field_name=<span class="hljs-string">&quot;stock&quot;</span>, index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>)
index_params.<span class="hljs-title function_">add_index</span>(field_name=<span class="hljs-string">&quot;rating&quot;</span>, index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>)

client.<span class="hljs-title function_">create_index</span>(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    index_params=index_params,
)
<button class="copy-code-btn"></button></code></pre>
<p>Em seguida, faça o refresh da origem externa:</p>
<pre><code translate="no" class="language-python">job_id = client.refresh_external_collection(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
)

<span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
    progress = client.get_refresh_external_collection_progress(job_id=job_id)
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshCompleted&quot;</span>:
        <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshFailed&quot;</span>:
        <span class="hljs-keyword">raise</span> RuntimeError(progress.reason)
    time.sleep(<span class="hljs-number">2</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Quando a versão atualizada estiver pronta, carregue e pesquise como uma coleção normal do Milvus:</p>
<pre><code translate="no" class="language-python">client.load_collection(<span class="hljs-string">&quot;products_ext&quot;</span>)

results = client.<span class="hljs-title function_">search</span>(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;stock &gt; 0 and rating &gt;= 4.0&quot;</span>,
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;stock&quot;</span>, <span class="hljs-string">&quot;rating&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>A diferença importante não é a chamada de busca. É onde o ciclo de vida começa. Uma coleção gerenciada pelo Milvus começa com dados sendo gravados ou importados para o Milvus. Um External Collection começa com uma referência a dados que já existem em outro lugar.</p>
<h2 id="How-Refresh-picks-up-changes-in-external-data" class="common-anchor-header">Como o Refresh capta mudanças nos dados externos<button data-href="#How-Refresh-picks-up-changes-in-external-data" class="anchor-icon" translate="no">
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
    </button></h2><p>O External Collection é somente leitura do lado do Milvus, mas o conjunto de dados subjacente do lake não precisa permanecer congelado para sempre.</p>
<p>Suponha que o pipeline de produtos adicione outro lote, atualize metadados ou grave embeddings de um novo modelo. O Milvus não acompanha continuamente todos os objetos que aparecem no caminho da origem. Essas mudanças se tornam visíveis por meio do <strong>Refresh</strong>.</p>
<p>O Refresh lê os metadados externos, resolve os fragmentos da origem, atualiza os manifests que os conectam à coleção do Milvus e prepara o estado de índice correspondente.</p>
<p>O ponto-chave é que esse trabalho pode ser incremental.</p>
<p>O Milvus identifica fragmentos de origem que não mudaram e pode reutilizar o trabalho existente de segmento e índice. Fragmentos novos ou alterados são as partes que exigem novo processamento.</p>
<p>Uma pequena mudança em um conjunto de dados de vários terabytes, portanto, não precisa acionar outra importação completa e reconstrução total de índice.</p>
<p>O Refresh também dá ao sistema de serviço uma fronteira de versão clara. Enquanto uma nova versão está sendo preparada, as consultas continuam usando o estado publicado anteriormente. Quando o Refresh é concluído, o novo estado fica disponível como uma versão completa, em vez de expor uma mistura de dados antigos e parcialmente preparados.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_4_46aaa22589.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Esse modelo se encaixa naturalmente com builds horários de catálogo, atualizações noturnas de base de conhecimento, atualizações periódicas de embeddings, pipelines de features gerados por modelos e cargas de trabalho semelhantes orientadas a lote.</p>
<p>Ele <strong>não</strong> substitui um caminho de escrita em streaming. Se todo insert ou delete precisar se tornar pesquisável pelo Milvus imediatamente, uma coleção gerenciada continua sendo o melhor modelo.</p>
<h2 id="How-Lazy-Loading-reduces-memory-use-for-wide-datasets" class="common-anchor-header">Como o Lazy Loading reduz o uso de memória para conjuntos de dados largos<button data-href="#How-Lazy-Loading-reduces-memory-use-for-wide-datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>Manter as linhas de origem no object storage só ajuda se a camada de serviço não precisar carregar todos os bytes localmente antes de responder às consultas. Com o Milvus Tiered Storage habilitado, ela não precisa.</p>
<p>No momento do carregamento da coleção, os QueryNodes podem manter inicialmente apenas metadados leves, como informações de schema, definições de índice, mapas de chunks e referências a objetos remotos. Os dados dos campos são buscados no nível de chunk quando uma consulta precisa deles; os índices podem permanecer remotos até o primeiro uso e depois ser armazenados em cache localmente. Dados usados com frequência permanecem quentes, enquanto dados acessados com menos frequência podem ser removidos.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_5_145b2aa0c7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Isso é especialmente útil para conjuntos de dados de IA largos.</p>
<p>Uma linha de produto pode conter vários embeddings, uma descrição longa, JSON bruto, metadados de imagem, resumos gerados, inventário, preços, avaliações e muitos outros atributos. Uma busca por similaridade típica pode tocar apenas um vetor, além de inventário, preço e avaliação. Não há razão para que todos os outros campos ocupem permanentemente a memória de serviço apenas porque pertencem ao mesmo registro.</p>
<p>O External Collection pode reduzir a pegada de serviço em dois níveis:</p>
<ul>
<li><strong>Primeiro, projeção no nível de schema.</strong> Por meio de <code translate="no">external_field</code>, o External Collection pode expor apenas as colunas de origem que o aplicativo precisa. As outras colunas permanecem no conjunto de dados do lake e não são incluídas nesse schema de serviço.</li>
<li><strong>Segundo, projeção em tempo de execução.</strong> Sob o modelo de serviço em camadas, os QueryNodes buscam e armazenam em cache os campos e índices realmente necessários para a carga de trabalho, em vez de carregar todo o conjunto de dados mapeado antecipadamente.</li>
</ul>
<p>Em outras palavras, <strong>o conjunto de dados pode permanecer largo no lake sem forçar a pegada de serviço a ser igualmente larga.</strong></p>
<p>Há um tradeoff óbvio. Uma consulta que atinge um campo ou índice frio pode pagar um custo de leitura remota no primeiro acesso. Políticas de aquecimento podem pré-carregar campos ou índices críticos para a latência, enquanto políticas de cache e remoção impedem que estados acessados com menos frequência ocupem recursos locais indefinidamente.</p>
<p>O ponto não é que o object storage se comporte como RAM. É que a memória e o disco local podem acompanhar o working set da carga de trabalho de recuperação, em vez do tamanho total e da largura do conjunto de dados de origem.</p>
<p>O formato da origem também importa aqui. Formatos projetados para varreduras analíticas amplas e formatos otimizados para leituras mais estreitas ou aleatórias podem produzir comportamentos de I/O diferentes sob acesso sob demanda. O External Collection não apaga essas trocas no nível de armazenamento; ele permite que o Milvus construa uma camada de recuperação sobre elas.</p>
<h2 id="What-search-and-indexing-capabilities-External-Collection-supports" class="common-anchor-header">Quais recursos de busca e indexação o External Collection suporta<button data-href="#What-search-and-indexing-capabilities-External-Collection-supports" class="anchor-icon" translate="no">
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
    </button></h2><p>O External Collection <strong>não</strong> apenas aponta o Milvus para um diretório de embeddings e varre os arquivos. O Milvus constrói estruturas de recuperação sobre dados externos e executa consultas por meio de seu mecanismo de recuperação padrão.</p>
<h3 id="Milvus-indexes-built-over-external-data" class="common-anchor-header">Índices do Milvus construídos sobre dados externos</h3><p>Dependendo dos campos e da carga de trabalho, o Milvus pode construir:</p>
<ul>
<li>índices vetoriais para busca ANN;</li>
<li>índices escalares para filtragem de metadados;</li>
<li>índices JSON para atributos semiestruturados;</li>
<li>índices BM25 e full-text para recuperação lexical;</li>
<li>Campos gerados por funções suportados pelo modelo de dados do Milvus.</li>
</ul>
<p>A busca ANN usa esses índices para reduzir o conjunto de candidatos em vez de ler cada vetor de origem.</p>
<p>Essa distinção importa porque armazenar um embedding em um lake não é o mesmo que operar um banco de dados vetorial sobre ele. A persistência fornece bytes. A recuperação em produção também precisa de índices, planejamento de consultas, filtragem, ranqueamento, cache e um caminho de serviço de baixa latência.</p>
<h3 id="Beyond-vector-top-K" class="common-anchor-header">Além do top-K vetorial</h3><p>Outro erro comum é interpretar "External Collection" como "busca vetorial sobre Parquet". Isso subestima o que a recuperação em produção realmente exige.</p>
<p>Um resultado de busca em produção raramente depende apenas da similaridade vetorial. Ele também pode depender de termos exatos, política de acesso, inventário, timestamp, categoria, preço, qualidade da origem ou sinais de ranqueamento de negócio.</p>
<p>Considere uma consulta como:</p>
<table>
<thead>
<tr><th>vestido floral vermelho para o verão, em estoque, melhor avaliado primeiro</th></tr>
</thead>
<tbody>
</tbody>
</table>
<p>Um caminho de recuperação em produção pode precisar de vários sinais:</p>
<ul>
<li><strong>Similaridade vetorial</strong> para o significado semântico de "vestido floral de verão".</li>
<li><strong>Busca lexical ou full-text</strong> para um termo exato como "vermelho".</li>
<li><strong>Filtros escalares</strong> para remover produtos fora de estoque ou abaixo de um limite de avaliação.</li>
<li><strong>Recuperação híbrida e ranqueamento</strong> para combinar múltiplos sinais de recuperação.</li>
</ul>
<p>O Milvus 3.0 também expande o mecanismo de consulta além da recuperação inicial de vizinhos mais próximos, com recursos como <strong>ordenação no lado do servidor, agregação e facetagem.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_6_d805a24b72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O ponto mais amplo é que o External Collection dá aos dados residentes no lake um caminho de recuperação de banco de dados—não apenas uma maneira de ler vetores de arquivos.</p>
<h2 id="How-the-same-lake-data-supports-online-serving-and-offline-processing" class="common-anchor-header">Como os mesmos dados do lake suportam serviço online e processamento offline<button data-href="#How-the-same-lake-data-supports-online-serving-and-offline-processing" class="anchor-icon" translate="no">
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
    </button></h2><p>A razão arquitetural mais forte para manter a origem em um formato de lake aberto não é simplesmente que uma segunda cópia custa dinheiro. É que o mesmo conjunto de dados pode permanecer disponível para os sistemas que o melhoram continuamente.</p>
<p>Volte ao catálogo de produtos.</p>
<p>Durante o dia, o Milvus pode servir um External Collection para busca de produtos, recomendações ou recuperação para agentes.</p>
<p>Ao mesmo tempo, outros sistemas podem trabalhar diretamente no conjunto de dados do lake:</p>
<ul>
<li>O Spark pode identificar produtos duplicados.</li>
<li>Um pipeline de treinamento pode gerar embeddings a partir de um novo modelo.</li>
<li>Um job de qualidade de dados pode detectar registros malformados ou anômalos.</li>
<li>Um pipeline de avaliação pode comparar a qualidade da recuperação entre versões de modelo.</li>
<li>Um processo em lote pode gerar resumos, rótulos ou metadados adicionais.</li>
</ul>
<p>O External Collection <strong>não</strong> executa esses jobs por conta própria. Spark continua sendo Spark; treinamento continua sendo treinamento. Seu papel é remover a fronteira extra entre serviço e dados entre eles.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_7_df2791e199.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O trabalho offline pode gravar dados melhorados ou novos campos de volta no lake. Um Refresh subsequente disponibiliza a origem atualizada para o caminho de recuperação do Milvus.</p>
<p>Não há um ciclo separado de exportação e importação cujo único propósito seja reconstruir outra cópia autoritativa para o serviço.</p>
<p>A governança também permanece claramente dividida. Versões da origem, linhagem e propriedade da origem permanecem com a plataforma de lake. O Milvus mantém sua própria autorização no nível de coleção e as credenciais necessárias para ler a origem. Compartilhar uma única fundação de dados não significa colapsar todos os domínios de segurança em um único sistema.</p>
<p>Essa é a conexão com o <a href="https://zilliz.com/blog/what-is-a-vector-lakebase"><strong>Vector Lakebase</strong></a>: o lake permanece como a fundação de dados compartilhada, enquanto o Milvus fornece uma camada de recuperação de baixa latência sobre ele. O External Collection é uma parte dessa arquitetura, ao lado de Storage V3, Snapshots, integração com Spark, evolução de schema e backfill.</p>
<h2 id="Where-External-Collection-fitsand-where-it-does-not" class="common-anchor-header">Onde o External Collection se encaixa—e onde não se encaixa<button data-href="#Where-External-Collection-fitsand-where-it-does-not" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>O External Collection é uma ótima opção quando:</strong></p>
<ul>
<li>Seus dados autoritativos já vivem em Parquet, Vortex, Lance, Iceberg ou outra origem externa suportada.</li>
<li>O conjunto de dados é produzido principalmente em lotes, em vez de por meio de gravações transacionais de alta frequência.</li>
<li>Manter uma segunda cópia de serviço cria sobrecarga significativa de ETL, atualidade ou governança.</li>
<li>Vários sistemas precisam trabalhar com o mesmo conjunto de dados aberto.</li>
<li>Uma fronteira explícita de Refresh é aceitável para a atualidade do serviço.</li>
<li>Você quer recuperação em produção com o Milvus sem tornar o Milvus o proprietário das linhas de origem.</li>
</ul>
<p><strong>Uma coleção normal do Milvus ainda é a melhor escolha quando:</strong></p>
<ul>
<li>o aplicativo insere ou faz upsert de registros continuamente;</li>
<li>exclusões precisam se tornar visíveis pelo caminho de escrita online;</li>
<li>a carga de trabalho depende de recursos de coleção indisponíveis para schemas externos;</li>
<li>o design de serviço mantém intencionalmente todos os dados necessários em memória, evitando cache misses remotos.</li>
</ul>
<p><strong>Vale a pena ter em mente algumas fronteiras.</strong></p>
<ul>
<li><strong>External Collections são somente leitura.</strong> Mudanças na origem acontecem fora do Milvus.</li>
<li><strong>Zero-cópia se aplica às linhas de origem.</strong> Índices, manifests, caches e computação ainda custam recursos.</li>
<li><strong>O Refresh é explícito.</strong> Não é um mecanismo de sincronização em streaming.</li>
<li><strong>A origem deve permanecer acessível.</strong> O comportamento de busca, indexação e refresh ainda depende do acesso ao armazenamento e das credenciais.</li>
<li><strong>O Storage V3 é obrigatório.</strong> No Milvus 3.0 de código aberto, ele deve ser habilitado antes de usar o External Collection.</li>
<li><strong>O External Collection não substitui o processamento a montante (upstream).</strong> Geração de embeddings, clustering, deduplicação e limpeza de dados continuam acontecendo nos sistemas upstream apropriados.</li>
</ul>
<p>A escolha, portanto, é complementar em vez de binária. Um sistema pode usar coleções normais do Milvus para estado online em rápida mudança e External Collections para conjuntos de dados grandes, produzidos em lote, cujo lar natural é o lake.</p>
<h2 id="Try-External-Collection-in-Milvus-30" class="common-anchor-header">Experimente o External Collection no Milvus 3.0<button data-href="#Try-External-Collection-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>O External Collection está disponível no Milvus 3.0. Comece com um conjunto de dados de lake representativo e avalie os aspectos que importam para sua carga de trabalho: refresh inicial e incremental, custo de construção de índices, comportamento de consultas quentes e frias e o intervalo de atualidade que seu aplicativo exige.</p>
<p>Para detalhes de implementação, consulte:</p>
<ul>
<li><a href="https://milvus.io/docs/create-an-external-collection.md">Criar um External Collection</a></li>
<li><a href="https://milvus.io/docs/release_notes.md">Notas de versão do Milvus 3.0</a></li>
<li><a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">Blog de lançamento do Milvus 3.0</a></li>
</ul>
<p>Se você preferir um caminho gerenciado, o External Collection também está disponível como parte do <strong>Zilliz Vector Lakebase</strong> no Zilliz Cloud. Consulte:</p>
<ul>
<li><a href="https://docs.zilliz.com/docs/external-collection">External Collection no Zilliz Cloud</a></li>
<li><a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Do Vector Database ao Vector Lakebase</a></li>
<li><a href="https://zilliz.com/blog/why-we-built-vector-lakebase">Por que construímos o Vector Lakebase: Repensando a arquitetura de dados não estruturados para IA</a></li>
</ul>
<p>Você também pode levar dúvidas de implementação ou feedback para o <a href="https://github.com/milvus-io/milvus">repositório do Milvus no GitHub</a> ou para a <a href="https://discord.com/invite/8uyFbECzPX">comunidade do Milvus no Discord</a>.</p>
