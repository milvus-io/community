---
id: how-to-migrate-data-to-milvus-seamlessly.md
title: 'Como migrar os seus dados para Milvus sem problemas: Um guia completo'
author: Wenhui Zhang
date: 2023-12-01T00:00:00.000Z
desc: >-
  Um guia completo sobre a migração dos seus dados do Elasticsearch, FAISS e
  versões mais antigas do Milvus 1.x para o Milvus 2.x.
cover: assets.zilliz.com/How_to_Migrate_Your_Data_to_Milvus_with_Ease_485dcb8b22.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Data Migration, Milvus Migration
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/how-to-migrate-data-to-milvus-seamlessly-comprehensive-guide
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_to_Migrate_Your_Data_to_Milvus_with_Ease_485dcb8b22.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://milvus.io/">O Milvus</a> é uma base de dados vetorial robusta de código aberto para <a href="https://zilliz.com/learn/vector-similarity-search">pesquisa de semelhanças</a> que pode armazenar, processar e recuperar milhares de milhões e até triliões de dados vectoriais com uma latência mínima. É também altamente escalável, fiável, nativo da nuvem e rico em funcionalidades. <a href="https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md">A versão mais recente do Milvus</a> apresenta recursos e melhorias ainda mais interessantes, incluindo <a href="https://zilliz.com/blog/getting-started-with-gpu-powered-milvus-unlocking-10x-higher-performance">suporte a GPU</a> para desempenho 10x mais rápido e MMap para maior capacidade de armazenamento em uma única máquina.</p>
<p>Em setembro de 2023, Milvus ganhou quase 23.000 estrelas no GitHub e tem dezenas de milhares de usuários de diversos setores com necessidades variadas. Está a tornar-se ainda mais popular à medida que a tecnologia de IA generativa como o <a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a> se torna mais prevalecente. É um componente essencial de várias pilhas de IA, especialmente a estrutura de <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">geração aumentada</a> de recuperação, que aborda o problema de alucinação de grandes modelos de linguagem.</p>
<p>Para responder à procura crescente de novos utilizadores que pretendem migrar para o Milvus e de utilizadores existentes que pretendem atualizar para as versões mais recentes do Milvus, desenvolvemos <a href="https://github.com/zilliztech/milvus-migration">o Milvus Migration</a>. Neste blogue, vamos explorar as funcionalidades do Milvus Migration e guiá-lo na transição rápida dos seus dados para o Milvus a partir do Milvus 1.x, do <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a> e do <a href="https://zilliz.com/comparison/elastic-vs-milvus">Elasticsearch 7.0</a> e posteriores.</p>
<h2 id="Milvus-Migration-a-powerful-data-migration-tool" class="common-anchor-header">Milvus Migration, uma poderosa ferramenta de migração de dados<button data-href="#Milvus-Migration-a-powerful-data-migration-tool" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/milvus-migration">O Milvus Migration</a> é uma ferramenta de migração de dados escrita em Go. Permite aos utilizadores moverem os seus dados sem problemas de versões mais antigas do Milvus (1.x), FAISS e Elasticsearch 7.0 e posteriores para versões do Milvus 2.x.</p>
<p>O diagrama abaixo demonstra como criámos o Milvus Migration e como funciona.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_migration_architecture_144e22f499.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="How-Milvus-Migration-migrates-data" class="common-anchor-header">Como o Milvus Migration migra os dados</h3><h4 id="From-Milvus-1x-and-FAISS-to-Milvus-2x" class="common-anchor-header">Do Milvus 1.x e FAISS para o Milvus 2.x</h4><p>A migração de dados do Milvus 1.x e do FAISS envolve a análise do conteúdo dos ficheiros de dados originais, a sua transformação para o formato de armazenamento de dados do Milvus 2.x e a escrita dos dados utilizando o SDK do Milvus <code translate="no">bulkInsert</code>. Todo este processo é baseado em fluxo, teoricamente limitado apenas pelo espaço em disco, e armazena ficheiros de dados no seu disco local, S3, OSS, GCP ou Minio.</p>
<h4 id="From-Elasticsearch-to-Milvus-2x" class="common-anchor-header">Do Elasticsearch para o Milvus 2.x</h4><p>Na migração de dados do Elasticsearch, a recuperação de dados é diferente. Os dados não são obtidos a partir de ficheiros, mas sim sequencialmente, utilizando a API de deslocamento do Elasticsearch. Os dados são depois analisados e transformados no formato de armazenamento Milvus 2.x, seguindo-se a sua escrita utilizando <code translate="no">bulkInsert</code>. Para além da migração de vectores do tipo <code translate="no">dense_vector</code> armazenados no Elasticsearch, o Milvus Migration também suporta a migração de outros tipos de campo, incluindo long, integer, short, boolean, keyword, text e double.</p>
<h3 id="Milvus-Migration-feature-set" class="common-anchor-header">Conjunto de funcionalidades do Milvus Migration</h3><p>O Milvus Migration simplifica o processo de migração através do seu conjunto robusto de funcionalidades:</p>
<ul>
<li><p><strong>Fontes de dados suportadas:</strong></p>
<ul>
<li><p>Milvus 1.x para Milvus 2.x</p></li>
<li><p>Elasticsearch 7.0 e posteriores para Milvus 2.x</p></li>
<li><p>FAISS para Milvus 2.x</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>Múltiplos modos de interação:</strong></p>
<ul>
<li><p>Interface de linha de comando (CLI) utilizando a estrutura Cobra</p></li>
<li><p>API restful com uma IU Swagger incorporada</p></li>
<li><p>Integração como um módulo Go noutras ferramentas</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>Suporte versátil a formatos de ficheiros:</strong></p>
<ul>
<li><p>Ficheiros locais</p></li>
<li><p>Amazon S3</p></li>
<li><p>Serviço de armazenamento de objectos (OSS)</p></li>
<li><p>Plataforma de nuvem do Google (GCP)</p></li>
</ul></li>
</ul>
<ul>
<li><p><strong>Integração flexível com o Elasticsearch:</strong></p>
<ul>
<li><p>Migração de <code translate="no">dense_vector</code> vectores de tipo do Elasticsearch</p></li>
<li><p>Suporte para migração de outros tipos de campo, como longo, inteiro, curto, booleano, palavra-chave, texto e duplo</p></li>
</ul></li>
</ul>
<h3 id="Interface-definitions" class="common-anchor-header">Definições de interface</h3><p>O Milvus Migration fornece as seguintes interfaces principais:</p>
<ul>
<li><p><code translate="no">/start</code>: Inicia um trabalho de migração (equivalente a uma combinação de despejo e carregamento, atualmente só suporta migração ES).</p></li>
<li><p><code translate="no">/dump</code>: Inicia um trabalho de dump (grava dados de origem no meio de armazenamento de destino).</p></li>
<li><p><code translate="no">/load</code>: Inicia um trabalho de carregamento (escreve dados do meio de armazenamento de destino no Milvus 2.x).</p></li>
<li><p><code translate="no">/get_job</code>: Permite que os utilizadores vejam os resultados da execução da tarefa. (Para mais detalhes, consulte o <a href="https://github.com/zilliztech/milvus-migration/blob/main/server/server.go">server.go do projeto</a>)</p></li>
</ul>
<p>Em seguida, vamos utilizar alguns dados de exemplo para explorar a forma de utilizar a Migração Milvus nesta secção. Você pode encontrar esses exemplos <a href="https://github.com/zilliztech/milvus-migration#migration-examples-migrationyaml-details">aqui</a> no GitHub.</p>
<h2 id="Migration-from-Elasticsearch-to-Milvus-2x" class="common-anchor-header">Migração do Elasticsearch para o Milvus 2.x<button data-href="#Migration-from-Elasticsearch-to-Milvus-2x" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>Preparar dados do Elasticsearch</li>
</ol>
<p>Para <a href="https://zilliz.com/blog/elasticsearch-cloud-vs-zilliz">migrar</a> os dados <a href="https://zilliz.com/blog/elasticsearch-cloud-vs-zilliz">do Elasticsearch</a>, já deve ter configurado o seu próprio servidor Elasticsearch. Deve armazenar os dados vectoriais no campo <code translate="no">dense_vector</code> e indexá-los com outros campos. Os mapeamentos de índice são os mostrados abaixo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/migrate_elasticsearch_data_milvus_index_mappings_59370f9596.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li>Compilar e construir</li>
</ol>
<p>Primeiro, baixe <a href="https://github.com/zilliztech/milvus-migration">o código-fonte</a> da Migração Milvus <a href="https://github.com/zilliztech/milvus-migration">do GitHub</a>. Em seguida, execute os seguintes comandos para compilá-lo.</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>Esta etapa gerará um arquivo executável chamado <code translate="no">milvus-migration</code>.</p>
<ol start="3">
<li>Configurar <code translate="no">migration.yaml</code></li>
</ol>
<p>Antes de iniciar a migração, você deve preparar um arquivo de configuração chamado <code translate="no">migration.yaml</code> que inclui informações sobre a fonte de dados, o destino e outras configurações relevantes. Aqui está um exemplo de configuração:</p>
<pre><code translate="no"><span class="hljs-comment"># Configuration for Elasticsearch to Milvus 2.x migration</span>


dumper:
  worker:
    workMode: Elasticsearch
    reader:
      bufferSize: 2500
meta:
  mode: config
  index: test_index
  fields:
    - name: <span class="hljs-built_in">id</span>
      pk: <span class="hljs-literal">true</span>
      <span class="hljs-built_in">type</span>: long
    - name: other_field
      maxLen: 60
      <span class="hljs-built_in">type</span>: keyword
    - name: data
      <span class="hljs-built_in">type</span>: dense_vector
      dims: 512
  milvus:
      collection: <span class="hljs-string">&quot;rename_index_test&quot;</span>
      closeDynamicField: <span class="hljs-literal">false</span>
      consistencyLevel: Eventually
      shardNum: 1


<span class="hljs-built_in">source</span>:
  es:
    urls:
      - http://localhost:9200
    username: xxx
    password: xxx


target:
  mode: remote
  remote:
    outputDir: outputPath/migration/test1
    cloud: aws
    region: us-west-2
    bucket: xxx
    useIAM: <span class="hljs-literal">true</span>
    checkBucket: <span class="hljs-literal">false</span>
  milvus2x:
    endpoint: {yourMilvusAddress}:{port}
    username: ******
    password: ******
<button class="copy-code-btn"></button></code></pre>
<p>Para obter uma explicação mais detalhada do arquivo de configuração, consulte <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_ES.md#elasticsearch-to-milvus-2x-migrationyaml-example">esta página</a> no GitHub.</p>
<ol start="4">
<li>Executar o trabalho de migração</li>
</ol>
<p>Agora que você configurou seu arquivo <code translate="no">migration.yaml</code>, você pode iniciar a tarefa de migração executando o seguinte comando:</p>
<pre><code translate="no">./milvus-migration start --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Observe a saída do log. Quando você vir logs semelhantes aos seguintes, isso significa que a migração foi bem-sucedida.</p>
<pre><code translate="no">[task/load_base_task.go:94] [<span class="hljs-string">&quot;[LoadTasker] Dec Task Processing--------------&gt;&quot;</span>] [Count=0] [fileName=testfiles/output/zwh/migration/test_mul_field4/data_1_1.json] [taskId=442665677354739304][task/load_base_task.go:76] [<span class="hljs-string">&quot;[LoadTasker] Progress Task ---------------&gt;&quot;</span>] [fileName=testfiles/output/zwh/migration/test_mul_field4/data_1_1.json] [taskId=442665677354739304][dbclient/cus_field_milvus2x.go:86] [<span class="hljs-string">&quot;[Milvus2x] begin to ShowCollectionRows&quot;</span>][loader/cus_milvus2x_loader.go:66] [<span class="hljs-string">&quot;[Loader] Static: &quot;</span>] [collection=test_mul_field4_rename1] [beforeCount=50000] [afterCount=100000] [increase=50000][loader/cus_milvus2x_loader.go:66] [<span class="hljs-string">&quot;[Loader] Static Total&quot;</span>] [<span class="hljs-string">&quot;Total Collections&quot;</span>=1] [beforeTotalCount=50000] [afterTotalCount=100000] [totalIncrease=50000][migration/es_starter.go:25] [<span class="hljs-string">&quot;[Starter] migration ES to Milvus finish!!!&quot;</span>] [Cost=80.009174459][starter/starter.go:106] [<span class="hljs-string">&quot;[Starter] Migration Success!&quot;</span>] [Cost=80.00928425][cleaner/remote_cleaner.go:27] [<span class="hljs-string">&quot;[Remote Cleaner] Begin to clean files&quot;</span>] [bucket=a-bucket] [rootPath=testfiles/output/zwh/migration][cmd/start.go:32] [<span class="hljs-string">&quot;[Cleaner] clean file success!&quot;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Para além da abordagem de linha de comandos, o Milvus Migration também suporta a migração através da API Restful.</p>
<p>Para utilizar a API Restful, inicie o servidor da API utilizando o seguinte comando:</p>
<pre><code translate="no">./milvus-migration server run -p 8080
<button class="copy-code-btn"></button></code></pre>
<p>Assim que o serviço for executado, pode iniciar a migração chamando a API.</p>
<pre><code translate="no">curl -XPOST http://localhost:8080/api/v1/start
<button class="copy-code-btn"></button></code></pre>
<p>Quando a migração estiver concluída, pode utilizar <a href="https://zilliz.com/attu">o Attu</a>, uma ferramenta de administração de bases de dados vectoriais tudo-em-um, para ver o número total de linhas migradas com êxito e efetuar outras operações relacionadas com a coleção.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/attu_interface_vector_database_admin_4893a31f6d.png" alt="The Attu interface" class="doc-image" id="the-attu-interface" />
   </span> <span class="img-wrapper"> <span>A interface do Attu</span> </span></p>
<h2 id="Migration-from-Milvus-1x-to-Milvus-2x" class="common-anchor-header">Migração do Milvus 1.x para o Milvus 2.x<button data-href="#Migration-from-Milvus-1x-to-Milvus-2x" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>Preparar os dados do Milvus 1.x</li>
</ol>
<p>Para o ajudar a experimentar rapidamente o processo de migração, colocámos 10.000 registos <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_1X.md">de dados de teste</a> do Milvus 1.x no código fonte do Milvus Migration. No entanto, em casos reais, deve exportar o seu próprio ficheiro <code translate="no">meta.json</code> da sua instância Milvus 1.x antes de iniciar o processo de migração.</p>
<ul>
<li>Pode exportar os dados com o seguinte comando.</li>
</ul>
<pre><code translate="no">./milvus-migration <span class="hljs-built_in">export</span> -m <span class="hljs-string">&quot;user:password@tcp(adderss)/milvus?charset=utf8mb4&amp;parseTime=True&amp;loc=Local&quot;</span> -o outputDir
<button class="copy-code-btn"></button></code></pre>
<p>Certifique-se de que:</p>
<ul>
<li><p>Substituir os marcadores de posição pelas suas credenciais MySQL reais.</p></li>
<li><p>Parar o servidor Milvus 1.x ou interromper a escrita de dados antes de efetuar esta exportação.</p></li>
<li><p>Copie a pasta Milvus <code translate="no">tables</code> e o ficheiro <code translate="no">meta.json</code> para o mesmo diretório.</p></li>
</ul>
<p><strong>Nota:</strong> Se utilizar o Milvus 2.x no <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (o serviço totalmente gerido do Milvus), pode iniciar a migração utilizando a Cloud Console.</p>
<ol start="2">
<li>Compilar e construir</li>
</ol>
<p>Primeiro, descarregue o <a href="https://github.com/zilliztech/milvus-migration">código fonte</a> do Milvus Migration a <a href="https://github.com/zilliztech/milvus-migration">partir do GitHub</a>. Depois, execute os seguintes comandos para o compilar.</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>Esta etapa gerará um arquivo executável chamado <code translate="no">milvus-migration</code>.</p>
<ol start="3">
<li>Configurar <code translate="no">migration.yaml</code></li>
</ol>
<p>Prepare um ficheiro de configuração <code translate="no">migration.yaml</code>, especificando detalhes sobre a origem, o destino e outras definições relevantes. Aqui está um exemplo de configuração:</p>
<pre><code translate="no"><span class="hljs-comment"># Configuration for Milvus 1.x to Milvus 2.x migration</span>


dumper:
  worker:
    <span class="hljs-built_in">limit</span>: 2
    workMode: milvus1x
    reader:
      bufferSize: 1024
    writer:
      bufferSize: 1024
loader:
  worker:
    <span class="hljs-built_in">limit</span>: 16
meta:
  mode: <span class="hljs-built_in">local</span>
  localFile: /outputDir/test/meta.json


<span class="hljs-built_in">source</span>:
  mode: <span class="hljs-built_in">local</span>
  <span class="hljs-built_in">local</span>:
    tablesDir: /db/tables/


target:
  mode: remote
  remote:
    outputDir: <span class="hljs-string">&quot;migration/test/xx&quot;</span>
    ak: xxxx
    sk: xxxx
    cloud: aws
    endpoint: 0.0.0.0:9000
    region: ap-southeast-1
    bucket: a-bucket
    useIAM: <span class="hljs-literal">false</span>
    useSSL: <span class="hljs-literal">false</span>
    checkBucket: <span class="hljs-literal">true</span>
  milvus2x:
    endpoint: localhost:19530
    username: xxxxx
    password: xxxxx
<button class="copy-code-btn"></button></code></pre>
<p>Para uma explicação mais detalhada do arquivo de configuração, consulte <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_1X.md">esta página</a> no GitHub.</p>
<ol start="4">
<li>Executar tarefa de migração</li>
</ol>
<p>Você deve executar os comandos <code translate="no">dump</code> e <code translate="no">load</code> separadamente para concluir a migração. Estes comandos convertem os dados e importam-nos para o Milvus 2.x.</p>
<p><strong>Nota:</strong> Em breve, simplificaremos este passo e permitiremos que os utilizadores concluam a migração utilizando apenas um comando. Fique atento.</p>
<p><strong>Comando Dump:</strong></p>
<pre><code translate="no">./milvus-migration dump --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p><strong>Comando Load:</strong></p>
<pre><code translate="no">./milvus-migration load --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Após a migração, a coleção gerada no Milvus 2.x conterá dois campos: <code translate="no">id</code> e <code translate="no">data</code>. Pode ver mais detalhes utilizando o <a href="https://zilliz.com/attu">Attu</a>, uma ferramenta de administração de bases de dados vectoriais tudo-em-um.</p>
<h2 id="Migration-from-FAISS-to-Milvus-2x" class="common-anchor-header">Migração do FAISS para o Milvus 2.x<button data-href="#Migration-from-FAISS-to-Milvus-2x" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>Preparar os dados FAISS</li>
</ol>
<p>Para migrar os dados do Elasticsearch, deve ter os seus próprios dados FAISS prontos. Para o ajudar a experimentar rapidamente o processo de migração, colocámos alguns <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_FAISS.md">dados de teste FAISS</a> no código-fonte do Milvus Migration.</p>
<ol start="2">
<li>Compilar e construir</li>
</ol>
<p>Primeiro, descarregue o <a href="https://github.com/zilliztech/milvus-migration">código-fonte</a> do Milvus Migration a <a href="https://github.com/zilliztech/milvus-migration">partir do GitHub</a>. Depois, execute os seguintes comandos para o compilar.</p>
<pre><code translate="no"><span class="hljs-keyword">go</span> get
<span class="hljs-keyword">go</span> build
<button class="copy-code-btn"></button></code></pre>
<p>Este passo irá gerar um ficheiro executável com o nome <code translate="no">milvus-migration</code>.</p>
<ol start="3">
<li>Configurar <code translate="no">migration.yaml</code></li>
</ol>
<p>Prepare um ficheiro de configuração <code translate="no">migration.yaml</code> para a migração FAISS, especificando detalhes sobre a origem, o destino e outras definições relevantes. Aqui está um exemplo de configuração:</p>
<pre><code translate="no"><span class="hljs-comment"># Configuration for FAISS to Milvus 2.x migration</span>


dumper:
  worker:
    <span class="hljs-built_in">limit</span>: 2
    workMode: FAISS
    reader:
      bufferSize: 1024
    writer:
      bufferSize: 1024
loader:
  worker:
    <span class="hljs-built_in">limit</span>: 2
<span class="hljs-built_in">source</span>:
  mode: <span class="hljs-built_in">local</span>
  <span class="hljs-built_in">local</span>:
    FAISSFile: ./testfiles/FAISS/FAISS_ivf_flat.index


target:
  create:
    collection:
      name: test1w
      shardsNums: 2
      dim: 256
      metricType: L2
  mode: remote
  remote:
    outputDir: testfiles/output/
    cloud: aws
    endpoint: 0.0.0.0:9000
    region: ap-southeast-1
    bucket: a-bucket
    ak: minioadmin
    sk: minioadmin
    useIAM: <span class="hljs-literal">false</span>
    useSSL: <span class="hljs-literal">false</span>
    checkBucket: <span class="hljs-literal">true</span>
  milvus2x:
    endpoint: localhost:19530
    username: xxxxx
    password: xxxxx
<button class="copy-code-btn"></button></code></pre>
<p>Para uma explicação mais detalhada do ficheiro de configuração, consulte <a href="https://github.com/zilliztech/milvus-migration/blob/main/README_FAISS.md">esta página</a> no GitHub.</p>
<ol start="4">
<li>Executar tarefa de migração</li>
</ol>
<p>Tal como a migração do Milvus 1.x para o Milvus 2.x, a migração FAISS requer a execução dos comandos <code translate="no">dump</code> e <code translate="no">load</code>. Estes comandos convertem os dados e importam-nos para o Milvus 2.x.</p>
<p><strong>Nota:</strong> Em breve, simplificaremos este passo e permitiremos que os utilizadores concluam a migração utilizando apenas um comando. Fique atento.</p>
<p><strong>Comando Dump:</strong></p>
<pre><code translate="no">./milvus-migration dump --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p><strong>Comando Load:</strong></p>
<pre><code translate="no">./milvus-migration load --config=/{YourConfigFilePath}/migration.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Pode ver mais detalhes utilizando <a href="https://zilliz.com/attu">o Attu</a>, uma ferramenta de administração de bases de dados vectoriais tudo-em-um.</p>
<h2 id="Stay-tuned-for-future-migration-plans" class="common-anchor-header">Fique atento aos futuros planos de migração<button data-href="#Stay-tuned-for-future-migration-plans" class="anchor-icon" translate="no">
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
    </button></h2><p>No futuro, daremos suporte à migração de mais fontes de dados e adicionaremos mais recursos de migração, incluindo:</p>
<ul>
<li><p>Suporte à migração de Redis para Milvus.</p></li>
<li><p>Suporte à migração do MongoDB para o Milvus.</p></li>
<li><p>Suporte à migração reescalonável.</p></li>
<li><p>Simplificar os comandos de migração, fundindo os processos de despejo e carregamento num só.</p></li>
<li><p>Suporte à migração de outras fontes de dados convencionais para o Milvus.</p></li>
</ul>
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
    </button></h2><p>Milvus 2.3, a última versão do Milvus, traz novos recursos e melhorias de desempenho que atendem às crescentes necessidades de gerenciamento de dados. A migração dos seus dados para o Milvus 2.x pode trazer estes benefícios, e o projeto Milvus Migration torna o processo de migração simplificado e fácil. Experimente-o e não ficará desiludido.</p>
<p><em><strong>Nota:</strong> As informações neste blogue baseiam-se no estado dos projectos Milvus e <a href="https://github.com/zilliztech/milvus-migration">Milvus Migration</a> em setembro de 2023. Consulte a <a href="https://milvus.io/docs">documentação</a> oficial <a href="https://milvus.io/docs">do Milvus</a> para obter as informações e instruções mais atualizadas.</em></p>
