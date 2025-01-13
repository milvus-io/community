---
id: deep-dive-2-milvus-sdk-and-api.md
title: Uma introdução ao Milvus Python SDK e à API
author: Xuan Yang
date: 2022-03-21T00:00:00.000Z
desc: >-
  Saiba como os SDKs interagem com o Milvus e porque é que a API do tipo ORM o
  ajuda a gerir melhor o Milvus.
cover: assets.zilliz.com/20220322_175856_e8e7bea7dc.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220322_175856_e8e7bea7dc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Imagem da capa</span> </span></p>
<p>Por <a href="https://github.com/XuanYang-cn">Xuan Yang</a></p>
<h2 id="Background" class="common-anchor-header">Antecedentes<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>A ilustração seguinte mostra a interação entre os SDKs e o Milvus através do gRPC. Imagine que o Milvus é uma caixa preta. Os buffers de protocolo são utilizados para definir as interfaces do servidor e a estrutura da informação que transportam. Por conseguinte, todas as operações na caixa negra Milvus são definidas pela API de protocolo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/SDK_10c9673111.png" alt="Interaction" class="doc-image" id="interaction" />
   </span> <span class="img-wrapper"> <span>Interação</span> </span></p>
<h2 id="Milvus-Protocol-API" class="common-anchor-header">API do protocolo Milvus<button data-href="#Milvus-Protocol-API" class="anchor-icon" translate="no">
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
    </button></h2><p>A API do protocolo Milvus é constituída pelos ficheiros <code translate="no">milvus.proto</code>, <code translate="no">common.proto</code> e <code translate="no">schema.proto</code>, que são ficheiros Protocol Buffers com o sufixo <code translate="no">.proto</code>. Para garantir um funcionamento correto, os SDK devem interagir com o Milvus através destes ficheiros Protocol Buffers.</p>
<h3 id="milvusproto" class="common-anchor-header">milvus.proto</h3><p><code translate="no">milvus.proto</code> é o componente vital da API do protocolo Milvus porque define o <code translate="no">MilvusService</code>, que define ainda todas as interfaces RPC do Milvus.</p>
<p>O exemplo de código seguinte mostra a interface <code translate="no">CreatePartitionRequest</code>. Tem dois parâmetros principais do tipo string <code translate="no">collection_name</code> e <code translate="no">partition_name</code>, com base nos quais se pode iniciar um pedido de criação de partição.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/code_d5f034d58d.png" alt="CreatePartitionRequest" class="doc-image" id="createpartitionrequest" />
   </span> <span class="img-wrapper"> <span>CreatePartitionRequest</span> </span></p>
<p>Veja um exemplo de protocolo no <a href="https://github.com/milvus-io/milvus-proto/blob/44f59db22b27cc55e4168c8e53b6e781c010a713/proto/milvus.proto">Repositório PyMilvus GitHub</a> na linha 19.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/create_partition_938691f07f.png" alt="Example" class="doc-image" id="example" />
   </span> <span class="img-wrapper"> <span>Exemplo</span> </span></p>
<p>Você pode encontrar a definição de <code translate="no">CreatePartitionRequest</code> aqui.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112254_4ec4f35bd3.png" alt="Definition" class="doc-image" id="definition" />
   </span> <span class="img-wrapper"> <span>Definição</span> </span></p>
<p>Os colaboradores que pretendam desenvolver uma funcionalidade do Milvus ou um SDK numa linguagem de programação diferente são bem-vindos para encontrar todas as interfaces que o Milvus oferece através de RPC.</p>
<h3 id="commonproto" class="common-anchor-header">common.proto</h3><p><code translate="no">common.proto</code> define os tipos de informação comuns, incluindo <code translate="no">ErrorCode</code>, e <code translate="no">Status</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112303_eaafc432a8.png" alt="common.proto" class="doc-image" id="common.proto" />
   </span> <span class="img-wrapper"> <span>common.proto</span> </span></p>
<h3 id="schemaproto" class="common-anchor-header">schema.proto</h3><p><code translate="no">schema.proto</code> define o esquema nos parâmetros. A seguinte amostra de código é um exemplo de <code translate="no">CollectionSchema</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112313_df4ebe36e7.png" alt="schema.proto" class="doc-image" id="schema.proto" />
   </span> <span class="img-wrapper"> <span>schema.proto</span> </span></p>
<p><code translate="no">milvus.proto</code>As interfaces common.proto, <code translate="no">common.proto</code> e <code translate="no">schema.proto</code> constituem a API do Milvus, representando todas as operações que podem ser chamadas através de RPC.</p>
<p>Se analisar o código fonte e observar com atenção, verificará que quando interfaces como <code translate="no">create_index</code> são chamadas, na realidade chamam várias interfaces RPC, como <code translate="no">describe_collection</code> e <code translate="no">describe_index</code>. Muitas das interfaces externas do Milvus são uma combinação de múltiplas interfaces RPC.</p>
<p>Tendo compreendido os comportamentos dos RPC, pode então desenvolver novas funcionalidades para o Milvus através de combinações. É mais do que bem-vindo a usar a sua imaginação e criatividade e contribuir para a comunidade Milvus.</p>
<h2 id="PyMilvus-20" class="common-anchor-header">PyMilvus 2.0<button data-href="#PyMilvus-20" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Object-relational-mapping-ORM" class="common-anchor-header">Mapeamento objeto-relacional (ORM)</h3><p>Em poucas palavras, o mapeamento objeto-relacional (ORM) refere-se ao fato de que quando você opera em um objeto local, tais operações afetarão o objeto correspondente no servidor. A API estilo ORM do PyMilvus apresenta as seguintes caraterísticas:</p>
<ol>
<li>Opera diretamente sobre objetos.</li>
<li>Isola a lógica do serviço e os detalhes de acesso aos dados.</li>
<li>Esconde a complexidade da implementação, e é possível executar os mesmos scripts em diferentes instâncias do Milvus, independentemente das suas abordagens de implantação ou implementação.</li>
</ol>
<h3 id="ORM-style-API" class="common-anchor-header">API estilo ORM</h3><p>Uma das essências da API estilo ORM reside no controlo da ligação Milvus. Por exemplo, pode especificar aliases para múltiplos servidores Milvus, e ligar-se ou desligar-se deles apenas com os seus aliases. Pode até eliminar o endereço do servidor local e controlar certos objectos através de uma ligação específica.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112320_d5ff08a582.png" alt="Control Connection" class="doc-image" id="control-connection" />
   </span> <span class="img-wrapper"> <span>Controlo de ligação</span> </span></p>
<p>Outra caraterística da API estilo ORM é que, após a abstração, todas as operações podem ser executadas diretamente nos objectos, incluindo coleção, partição, e índice.</p>
<p>É possível abstrair um objeto de coleção obtendo um já existente ou criando um novo. Também pode atribuir uma ligação Milvus a objectos específicos utilizando o alias de ligação, para que possa operar nesses objectos localmente.</p>
<p>Para criar um objeto de partição, pode criá-lo com o seu objeto de coleção pai, ou pode fazê-lo tal como quando cria um objeto de coleção. Estes métodos também podem ser utilizados num objeto de índice.</p>
<p>No caso de estes objectos de partição ou de índice existirem, pode obtê-los através do seu objeto de coleção principal.</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">Sobre a série Deep Dive<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Com o <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">anúncio oficial da disponibilidade geral</a> do Milvus 2.0, orquestrámos esta série de blogues Milvus Deep Dive para fornecer uma interpretação aprofundada da arquitetura e do código-fonte do Milvus. Os tópicos abordados nesta série de blogues incluem:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Visão geral da arquitetura do Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">APIs e SDKs Python</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Processamento de dados</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Gestão de dados</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Consulta em tempo real</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Motor de execução escalar</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">Sistema QA</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Motor de execução vetorial</a></li>
</ul>
