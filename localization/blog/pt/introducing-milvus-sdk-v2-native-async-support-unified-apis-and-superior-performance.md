---
id: >-
  introducing-milvus-sdk-v2-native-async-support-unified-apis-and-superior-performance.md
title: >-
  Apresentamos o Milvus SDK v2: Suporte Assíncrono Nativo, APIs Unificadas e
  Desempenho Superior
author: Ken Zhang
date: 2025-04-16T00:00:00.000Z
desc: >-
  Experimente o Milvus SDK v2, reimaginado para os programadores! Desfrute de
  uma API unificada, suporte assíncrono nativo e desempenho melhorado para os
  seus projectos de pesquisa vetorial.
cover: assets.zilliz.com/Introducing_Milvus_SDK_v2_05c9e5e8b2.png
tag: Engineering
tags: 'Milvus SDK v2, Async Support, Milvus vector database'
canonicalUrl: >-
  https://milvus.io/blog/introducing-milvus-sdk-v2-native-async-support-unified-apis-and-superior-performance.md
---
<h2 id="TLDR" class="common-anchor-header">TL;DR<button data-href="#TLDR" class="anchor-icon" translate="no">
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
    </button></h2><p>Vocês falaram e nós ouvimos! O Milvus SDK v2 é uma reimaginação completa da nossa experiência de desenvolvedor, construída diretamente a partir do seu feedback. Com uma API unificada em Python, Java, Go e Node.js, o suporte nativo a assíncrono que você tem pedido, um Schema Cache que aumenta o desempenho e uma interface MilvusClient simplificada, o Milvus SDK v2 torna o desenvolvimento de <a href="https://zilliz.com/learn/vector-similarity-search">pesquisa vetorial</a> mais rápido e intuitivo do que nunca. Quer esteja a construir aplicações <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>, sistemas de recomendação ou soluções <a href="https://zilliz.com/learn/what-is-computer-vision">de visão computacional</a>, esta atualização orientada para a comunidade irá transformar a forma como trabalha com o Milvus.</p>
<h2 id="Why-We-Built-It-Addressing-Community-Pain-Points" class="common-anchor-header">Por que a criamos: Abordando os pontos de dor da comunidade<button data-href="#Why-We-Built-It-Addressing-Community-Pain-Points" class="anchor-icon" translate="no">
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
    </button></h2><p>Ao longo dos anos, o Milvus tornou-se a <a href="https://milvus.io/blog/what-is-a-vector-database.md">base de dados vetorial</a> de eleição para milhares de aplicações de IA. No entanto, à medida que a nossa comunidade crescia, ouvimos falar consistentemente de várias limitações do nosso SDK v1:</p>
<p><strong>"Lidar com alta simultaneidade é muito complexo".</strong> A falta de suporte assíncrono nativo em alguns SDKs de linguagem forçou os desenvolvedores a confiar em threads ou retornos de chamada, tornando o código mais difícil de gerenciar e depurar, especialmente em cenários como carregamento de dados em lote e consultas paralelas.</p>
<p><strong>"O desempenho degrada-se com a escala."</strong> Sem um Schema Cache, o v1 validava repetidamente os esquemas durante as operações, criando gargalos para cargas de trabalho de alto volume. Em casos de utilização que requerem um processamento vetorial massivo, este problema resultou num aumento da latência e numa redução do rendimento.</p>
<p><strong>"Interfaces inconsistentes entre linguagens criam uma curva de aprendizagem acentuada."</strong> Os SDKs de diferentes linguagens implementaram interfaces à sua maneira, complicando o desenvolvimento entre linguagens.</p>
<p><strong>"A API RESTful não possui recursos essenciais."</strong> Funcionalidades críticas como gerenciamento de partições e construção de índices não estavam disponíveis, forçando os desenvolvedores a alternar entre diferentes SDKs.</p>
<p>Estes não eram apenas pedidos de funcionalidades - eram obstáculos reais no seu fluxo de trabalho de desenvolvimento. O SDK v2 é a nossa promessa de remover essas barreiras e permitir que você se concentre no que importa: criar aplicativos de IA incríveis.</p>
<h2 id="The-Solution-Milvus-SDK-v2" class="common-anchor-header">A solução: Milvus SDK v2<button data-href="#The-Solution-Milvus-SDK-v2" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus SDK v2 é o resultado de uma reformulação completa focada na experiência do desenvolvedor, disponível em várias linguagens:</p>
<ul>
<li><p><a href="https://milvus.io/api-reference/pymilvus/v2.5.x/About.md">Python SDK v2 (pymilvus.MilvusClient)</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-sdk-java">Java v2</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus/tree/client/v2.5.1/client">Go v2</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-sdk-node">NodeJS</a></p></li>
<li><p><a href="https://milvus.io/api-reference/restful/v2.5.x/About.md">RESTful v2</a></p></li>
</ul>
<h3 id="1-Native-Asynchronous-Support-From-Complex-to-Concurrent" class="common-anchor-header">1. Suporte assíncrono nativo: Do complexo ao concorrente</h3><p>A maneira antiga de lidar com a simultaneidade envolvia objetos Future complicados e padrões de retorno de chamada. O SDK v2 introduz a verdadeira funcionalidade assíncrona/await, particularmente em Python com <code translate="no">AsyncMilvusClient</code> (desde a versão 2.5.3). Com os mesmos parâmetros que o MilvusClient síncrono, pode facilmente executar operações como inserção, consulta e pesquisa em paralelo.</p>
<p>Esta abordagem simplificada substitui os antigos e incómodos padrões Future e callback, conduzindo a um código mais limpo e eficiente. Lógica concorrente complexa, como inserções vetoriais em lote ou multi-consultas paralelas, pode agora ser implementada sem esforço usando ferramentas como <code translate="no">asyncio.gather</code>.</p>
<h3 id="2-Schema-Cache-Boosting-Performance-Where-It-Counts" class="common-anchor-header">2. Cache de esquema: Aumentando o desempenho onde é importante</h3><p>O SDK v2 introduz um Schema Cache que armazena esquemas de coleção localmente após a pesquisa inicial, eliminando pedidos de rede repetidos e sobrecarga de CPU durante as operações.</p>
<p>Para cenários de inserção e consulta de alta frequência, esta atualização traduz-se em:</p>
<ul>
<li><p>Redução do tráfego de rede entre o cliente e o servidor</p></li>
<li><p>Menor latência para operações</p></li>
<li><p>Diminuição do uso da CPU no lado do servidor</p></li>
<li><p>Melhor escalonamento sob alta simultaneidade</p></li>
</ul>
<p>Isto é particularmente valioso para aplicações como sistemas de recomendação em tempo real ou funcionalidades de pesquisa em tempo real em que os milissegundos são importantes.</p>
<h3 id="3-A-Unified-and-Streamlined-API-Experience" class="common-anchor-header">3. Uma experiência de API unificada e simplificada</h3><p>O Milvus SDK v2 introduz uma experiência de API unificada e mais completa em todas as linguagens de programação suportadas. Em particular, a API RESTful foi significativamente melhorada para oferecer quase paridade de recursos com a interface gRPC.</p>
<p>Nas versões anteriores, a API RESTful ficava atrás da gRPC, limitando o que os desenvolvedores podiam fazer sem trocar de interface. Isso não é mais o caso. Agora, os desenvolvedores podem usar a API RESTful para realizar praticamente todas as operações principais - como criar coleções, gerenciar partições, criar índices e executar consultas - sem precisar recorrer ao gRPC ou a outros métodos.</p>
<p>Essa abordagem unificada garante uma experiência consistente para o desenvolvedor em diferentes ambientes e casos de uso. Ela reduz a curva de aprendizado, simplifica a integração e melhora a usabilidade geral.</p>
<p>Nota: Para a maioria dos utilizadores, a API RESTful oferece uma forma mais rápida e fácil de começar a utilizar o Milvus. No entanto, se a sua aplicação exigir um elevado desempenho ou funcionalidades avançadas como iteradores, o cliente gRPC continua a ser a opção ideal para obter a máxima flexibilidade e controlo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RES_Tful_8520a80a8e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="4-Aligned-SDK-Design-Across-All-Languages" class="common-anchor-header">4. Design alinhado do SDK em todos os idiomas</h3><p>Com o Milvus SDK v2, padronizamos o design de nossos SDKs em todas as linguagens de programação suportadas para oferecer uma experiência de desenvolvedor mais consistente.</p>
<p>Quer esteja a construir com Python, Java, Go ou Node.js, cada SDK segue agora uma estrutura unificada centrada na classe MilvusClient. Este redesenho traz nomes de métodos consistentes, formatação de parâmetros e padrões gerais de uso para todas as linguagens que suportamos. (Ver: <a href="https://github.com/milvus-io/milvus/discussions/33979">Atualização do exemplo de código do SDK MilvusClient - Discussão GitHub #33979</a>)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_Client_9a4a6da9e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Agora, uma vez familiarizado com o Milvus numa linguagem, pode facilmente mudar para outra sem ter de reaprender como funciona o SDK. Este alinhamento não só simplifica a integração, mas também torna o desenvolvimento em várias línguas muito mais fácil e intuitivo.</p>
<h3 id="5-A-Simpler-Smarter-PyMilvus-Python-SDK-with-MilvusClient" class="common-anchor-header">5. Um PyMilvus (Python SDK) mais simples e inteligente com <code translate="no">MilvusClient</code></h3><p>Na versão anterior, a PyMilvus baseava-se numa conceção do tipo ORM que introduzia uma mistura de abordagens orientadas para os objectos e processuais. Os desenvolvedores tinham que definir objetos <code translate="no">FieldSchema</code>, construir um <code translate="no">CollectionSchema</code>, e então instanciar uma classe <code translate="no">Collection</code> -tudo isso apenas para criar uma coleção. Este processo não era apenas verboso, mas também introduzia uma curva de aprendizagem mais acentuada para novos utilizadores.</p>
<p>Com a nova interface <code translate="no">MilvusClient</code>, as coisas são muito mais simples. Agora é possível criar uma coleção num único passo, utilizando o método <code translate="no">create_collection()</code>. Permite-lhe definir rapidamente o esquema, passando parâmetros como <code translate="no">dimension</code> e <code translate="no">metric_type</code>, ou pode ainda utilizar um objeto de esquema personalizado, se necessário.</p>
<p>Melhor ainda, <code translate="no">create_collection()</code> suporta a criação de índices como parte da mesma chamada. Se forem fornecidos parâmetros de índice, o Milvus construirá automaticamente o índice e carregará os dados na memória - sem necessidade de chamadas separadas para <code translate="no">create_index()</code> ou <code translate="no">load()</code>. Um método faz tudo: <em>criar coleção → construir índice → carregar coleção.</em></p>
<p>Esta abordagem simplificada reduz a complexidade da configuração e torna muito mais fácil começar a utilizar o Milvus, especialmente para os programadores que pretendem um caminho rápido e eficiente para a criação de protótipos ou para a produção.</p>
<p>O novo módulo <code translate="no">MilvusClient</code> oferece vantagens claras em termos de usabilidade, consistência e desempenho. Embora a interface ORM antiga continue disponível por enquanto, planeamos eliminá-la gradualmente no futuro (ver <a href="https://docs.zilliz.com/reference/python/ORM#:~:text=About%20to%20Deprecate">referência</a>). Recomendamos vivamente a atualização para o novo SDK para tirar o máximo partido das melhorias.</p>
<h3 id="6-Clearer-and-More-Comprehensive-Documentation" class="common-anchor-header">6. Documentação mais clara e abrangente</h3><p>Reestruturámos a documentação do produto para fornecer uma <a href="https://milvus.io/docs">referência da API</a> mais completa e clara. Os nossos Guias do Utilizador incluem agora exemplos de código em várias línguas, permitindo-lhe começar rapidamente e compreender as funcionalidades do Milvus com facilidade. Além disso, o assistente Ask AI disponível no nosso site de documentação pode introduzir novas funcionalidades, explicar mecanismos internos e até ajudar a gerar ou modificar código de amostra, tornando a sua viagem através da documentação mais suave e agradável.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ask_AI_Assistant_b044d4621a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="7-Milvus-MCP-Server-Designed-for-the-Future-of-AI-Integration" class="common-anchor-header">7. Servidor Milvus MCP: Concebido para o futuro da integração de IA</h3><p>O <a href="https://github.com/zilliztech/mcp-server-milvus">servidor MCP</a>, construído sobre o Milvus SDK, é a nossa resposta a uma necessidade crescente no ecossistema de IA: integração perfeita entre grandes modelos de linguagem<a href="https://zilliz.com/glossary/large-language-models-(llms)">(LLMs</a>), <a href="https://milvus.io/blog/what-is-a-vector-database.md">bases de dados vectoriais</a> e ferramentas ou fontes de dados externas. Implementa o Protocolo de Contexto de Modelo (MCP), fornecendo uma interface unificada e inteligente para orquestrar as operações do Milvus e muito mais.</p>
<p>À medida que <a href="https://zilliz.com/blog/top-10-ai-agents-to-watch-in-2025">os agentes de IA</a> se tornam mais capazes - não só de gerar código, mas também de gerir autonomamente serviços de backend - a procura de uma infraestrutura mais inteligente e orientada para a API está a aumentar. O servidor MCP foi projetado com esse futuro em mente. Ele permite interações inteligentes e automatizadas com clusters Milvus, simplificando tarefas como implantação, manutenção e gerenciamento de dados.</p>
<p>Mais importante ainda, ele estabelece as bases para um novo tipo de colaboração máquina a máquina. Com o MCP Server, os agentes de IA podem chamar APIs para criar coleções dinamicamente, executar consultas, criar índices e muito mais - tudo sem intervenção humana.</p>
<p>Em suma, o MCP Server transforma o Milvus não apenas numa base de dados, mas num backend totalmente programável e preparado para IA - abrindo caminho para aplicações inteligentes, autónomas e escaláveis.</p>
<h2 id="Getting-Started-with-Milvus-SDK-v2-Sample-Code" class="common-anchor-header">Primeiros passos com o Milvus SDK v2: Código de exemplo<button data-href="#Getting-Started-with-Milvus-SDK-v2-Sample-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Os exemplos abaixo mostram como usar a nova interface PyMilvus (Python SDK v2) para criar uma coleção e executar operações assíncronas. Comparado com a abordagem de estilo ORM na versão anterior, este código é mais limpo, mais consistente e mais fácil de trabalhar.</p>
<h3 id="1-Creating-a-Collection-Defining-Schemas-Building-Indexes-and-Loading-Data-with-MilvusClient" class="common-anchor-header">1. Criando uma coleção, definindo esquemas, criando índices e carregando dados com <code translate="no">MilvusClient</code></h3><p>O trecho de código Python abaixo demonstra como criar uma coleção, definir seu esquema, criar índices e carregar dados - tudo em uma única chamada:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

<span class="hljs-comment"># 1. Connect to Milvus (initialize the client)</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># 2. Define the collection schema</span>
schema = MilvusClient.create_schema(auto_id=<span class="hljs-literal">False</span>, description=<span class="hljs-string">&quot;schema for example collection&quot;</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)  <span class="hljs-comment"># Primary key field</span>
schema.add_field(<span class="hljs-string">&quot;embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">128</span>)  <span class="hljs-comment"># Vector field</span>

<span class="hljs-comment"># 3. Prepare index parameters (optional if indexing at creation time)</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;L2&quot;</span>
)

<span class="hljs-comment"># 4. Create the collection with indexes and load it into memory automatically</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;example_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Collection created and loaded with index!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>O parâmetro <code translate="no">index_params</code> do método <code translate="no">create_collection</code> elimina a necessidade de chamadas separadas para <code translate="no">create_index</code> e <code translate="no">load_collection</code>- tudo acontece automaticamente.</p>
<p>Além disso, <code translate="no">MilvusClient</code> suporta um modo de criação rápida de tabela. Por exemplo, uma coleção pode ser criada em uma única linha de código, especificando apenas os parâmetros necessários:</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_collection</span>(
    collection_name=<span class="hljs-string">&quot;test_collection&quot;</span>,
    dimension=<span class="hljs-number">128</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><em>(Nota de comparação: Na antiga abordagem ORM, era necessário criar um <code translate="no">Collection(schema)</code> e depois chamar separadamente <code translate="no">collection.create_index()</code> e <code translate="no">collection.load()</code>; atualmente, o MilvusClient simplifica todo o processo).</em></p>
<h3 id="2-Performing-High-Concurrency-Asynchronous-Inserts-with-AsyncMilvusClient" class="common-anchor-header">2. Realizando Inserções Assíncronas de Alta Concorrência com <code translate="no">AsyncMilvusClient</code></h3><p>O exemplo a seguir mostra como usar o <code translate="no">AsyncMilvusClient</code> para realizar operações de inserção simultâneas usando <code translate="no">async/await</code>:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> AsyncMilvusClient

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">insert_vectors_concurrently</span>():
    client = AsyncMilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
    
    vectors_to_insert = [[...], [...], ...]  <span class="hljs-comment"># Assume 100,000 vectors</span>
    batch_size = <span class="hljs-number">1000</span>  <span class="hljs-comment"># Recommended batch size</span>
    tasks = []

    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(vectors_to_insert), batch_size):
        batch_vectors = vectors_to_insert[i:i+batch_size]

        <span class="hljs-comment"># Construct batch data</span>
        data = [
            <span class="hljs-built_in">list</span>(<span class="hljs-built_in">range</span>(i, i + <span class="hljs-built_in">len</span>(batch_vectors))),  <span class="hljs-comment"># Batch IDs</span>
            batch_vectors  <span class="hljs-comment"># Batch vectors</span>
        ]

        <span class="hljs-comment"># Add an asynchronous task for inserting each batch</span>
        tasks.append(client.insert(<span class="hljs-string">&quot;example_collection&quot;</span>, data=data))

    <span class="hljs-comment"># Concurrently execute batch inserts</span>
    insert_results = <span class="hljs-keyword">await</span> asyncio.gather(*tasks)
    <span class="hljs-keyword">await</span> client.close()

<span class="hljs-comment"># Execute asynchronous tasks</span>
asyncio.run(insert_vectors_concurrently())
<button class="copy-code-btn"></button></code></pre>
<p>Neste exemplo, <code translate="no">AsyncMilvusClient</code> é utilizado para inserir dados em simultâneo, agendando várias tarefas de inserção com <code translate="no">asyncio.gather</code>. Esta abordagem tira o máximo partido das capacidades de processamento concorrente do backend do Milvus. Ao contrário das inserções síncronas, linha por linha na v1, este suporte assíncrono nativo aumenta drasticamente o rendimento.</p>
<p>Da mesma forma, é possível modificar o código para realizar consultas ou pesquisas simultâneas - por exemplo, substituindo a chamada de inserção por <code translate="no">client.search(&quot;example_collection&quot;, data=[query_vec], limit=5)</code>. A interface assíncrona do Milvus SDK v2 garante que cada pedido seja executado de forma não bloqueante, aproveitando totalmente os recursos do cliente e do servidor.</p>
<h2 id="Migration-Made-Easy" class="common-anchor-header">Migração facilitada<button data-href="#Migration-Made-Easy" class="anchor-icon" translate="no">
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
    </button></h2><p>Sabemos que investiu tempo no SDK v1, por isso concebemos o SDK v2 a pensar nas suas aplicações existentes. O SDK v2 inclui compatibilidade com versões anteriores, pelo que as interfaces existentes do tipo v1/ORM continuarão a funcionar durante algum tempo. Mas recomendamos vivamente a atualização para o SDK v2 o mais rapidamente possível - o suporte para a v1 terminará com o lançamento do Milvus 3.0 (final de 2025).</p>
<p>A mudança para o SDK v2 desbloqueia uma experiência de desenvolvimento mais consistente e moderna com sintaxe simplificada, melhor suporte assíncrono e melhor desempenho. É também onde todos os novos recursos e o suporte da comunidade se concentrarão no futuro. Atualizar agora garante que está pronto para o que vem a seguir e dá-lhe acesso ao melhor que o Milvus tem para oferecer.</p>
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
    </button></h2><p>O Milvus SDK v2 traz melhorias significativas em relação à v1: desempenho aprimorado, uma interface unificada e consistente em várias linguagens de programação e suporte assíncrono nativo que simplifica as operações de alta concorrência. Com uma documentação mais clara e exemplos de código mais intuitivos, o Milvus SDK v2 foi concebido para simplificar o seu processo de desenvolvimento, tornando mais fácil e rápido criar e implementar aplicações de IA.</p>
<p>Para obter informações mais detalhadas, consulte a nossa mais recente <a href="https://milvus.io/docs/install-pymilvus.md#Install-Milvus-Python-SDK">referência</a> oficial <a href="https://milvus.io/docs/install-pymilvus.md#Install-Milvus-Python-SDK">da API e os guias do utilizador</a>. Se você tiver dúvidas ou sugestões sobre o novo SDK, sinta-se à vontade para fornecer feedback no <a href="https://github.com/milvus-io/milvus/discussions">GitHub</a> e no <a href="https://discord.com/invite/8uyFbECzPX">Discord</a>. Aguardamos ansiosamente a sua contribuição à medida que continuamos a melhorar o Milvus.</p>
