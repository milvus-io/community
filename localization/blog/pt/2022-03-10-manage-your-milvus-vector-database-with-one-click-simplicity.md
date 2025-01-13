---
id: 2022-03-10-manage-your-milvus-vector-database-with-one-click-simplicity.md
title: Gerir a sua base de dados Milvus Vetor com a simplicidade de um clique
author: Zhen Chen
date: 2022-03-10T00:00:00.000Z
desc: Attu - uma ferramenta GUI para Milvus 2.0.
cover: assets.zilliz.com/Attu_3ff9a76156.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://zilliz.com/blog/manage-your-milvus-vector-database-with-one-click-simplicity
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Attu_3ff9a76156.png" alt="Binlog Cover Image" class="doc-image" id="binlog-cover-image" />
   </span> <span class="img-wrapper"> <span>Imagem da capa do Binlog</span> </span></p>
<p>Redação de <a href="https://github.com/czhen-zilliz">Zhen Chen</a> e transcrição de <a href="https://github.com/LocoRichard">Lichen Wang</a>.</p>
<p style="font-size: 12px;color: #4c5a67">Clique <a href="https://zilliz.com/blog/manage-your-milvus-vector-database-with-one-click-simplicity">aqui</a> para ver o post original.</p> 
<p>Face ao rápido crescimento da procura de processamento de dados não estruturados, o Milvus 2.0 destaca-se. Trata-se de um sistema de base de dados vetorial orientado para a IA, concebido para cenários de produção em massa. Para além de todos estes SDKs do Milvus e do Milvus CLI, uma interface de linha de comandos para o Milvus, existe alguma ferramenta que permita aos utilizadores utilizar o Milvus de forma mais intuitiva? A resposta é SIM. A Zilliz anunciou uma interface gráfica de utilizador - Attu - especificamente para o Milvus. Neste artigo, gostaríamos de lhe mostrar passo a passo como efetuar uma pesquisa de semelhança vetorial com o Attu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/map_aa1cda30d4.png" alt="Attu island" class="doc-image" id="attu-island" />
   </span> <span class="img-wrapper"> <span>A ilha Attu</span> </span></p>
<p>Em comparação com o Milvus CLI, que oferece a máxima simplicidade de utilização, o Attu tem mais caraterísticas:</p>
<ul>
<li>Instaladores para Windows OS, macOS e Linux OS;</li>
<li>GUI intuitivo para facilitar a utilização do Milvus;</li>
<li>Cobertura das principais funcionalidades do Milvus;</li>
<li>Plugins para expansão de funcionalidades personalizadas;</li>
<li>Informações completas sobre a topologia do sistema para facilitar a compreensão e a administração da instância do Milvus.</li>
</ul>
<h2 id="Installation" class="common-anchor-header">Instalação<button data-href="#Installation" class="anchor-icon" translate="no">
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
    </button></h2><p>Pode encontrar a versão mais recente do Attu no <a href="https://github.com/zilliztech/attu/releases">GitHub</a>. O Attu oferece instaladores executáveis para diferentes sistemas operativos. É um projeto de código aberto e aceita contribuições de todos.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/installation_bbe62873af.png" alt="Installation" class="doc-image" id="installation" />
   </span> <span class="img-wrapper"> <span>Instalação</span> </span></p>
<p>Você também pode instalar o Attu via Docker.</p>
<pre><code translate="no" class="language-shell">docker run -p <span class="hljs-number">8000</span>:<span class="hljs-number">3000</span> -e <span class="hljs-variable constant_">HOST_URL</span>=<span class="hljs-attr">http</span>:<span class="hljs-comment">//{ attu IP }:8000 -e MILVUS_URL={milvus server IP}:19530 zilliz/attu:latest</span>
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">attu IP</code> é o endereço IP do ambiente onde o Attu é executado, e <code translate="no">milvus server IP</code> é o endereço IP do ambiente onde o Milvus é executado.</p>
<p>Depois de instalar o Attu com sucesso, pode introduzir o IP e a porta do Milvus na interface para iniciar o Attu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/connect_1fde46d9d5.png" alt="Connect Milvus with Attu" class="doc-image" id="connect-milvus-with-attu" />
   </span> <span class="img-wrapper"> <span>Ligar o Milvus à Attu</span> </span></p>
<h2 id="Feature-overview" class="common-anchor-header">Visão geral das funcionalidades<button data-href="#Feature-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/overview_591e230514.png" alt="Overview page" class="doc-image" id="overview-page" />
   </span> <span class="img-wrapper"> <span>Página de visão geral</span> </span></p>
<p>A interface do Attu é composta pela página <strong>Overview</strong>, página <strong>Collection</strong>, página <strong>Vetor Search</strong> e página <strong>System View</strong>, correspondendo aos quatro ícones no painel de navegação do lado esquerdo, respetivamente.</p>
<p>A página <strong>Visão geral</strong> mostra as colecções carregadas. Enquanto a página <strong>Coleção</strong> lista todas as colecções e indica se estão carregadas ou libertadas.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/collection_42656fe308.png" alt="Collection page" class="doc-image" id="collection-page" />
   </span> <span class="img-wrapper"> <span>Página Coleção</span> </span></p>
<p>As páginas <strong>Vetor Search</strong> e <strong>System View</strong> são plugins do Attu. Os conceitos e a utilização dos plug-ins serão apresentados na parte final do blogue.</p>
<p>Pode efetuar uma pesquisa de semelhança de vectores na página <strong>Pesquisa de vectores</strong>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vector_search_be7365687c.png" alt="Vector Search page" class="doc-image" id="vector-search-page" />
   </span> <span class="img-wrapper"> <span>Página Pesquisa vetorial</span> </span></p>
<p>Na página <strong>System View</strong>, pode verificar a estrutura topológica do Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/system_view_e1df15023d.png" alt="System View page" class="doc-image" id="system-view-page" />
   </span> <span class="img-wrapper"> <span>Página Vista do sistema</span> </span></p>
<p>Também pode consultar as informações detalhadas de cada nó clicando no nó.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/node_view_5bbc25f9b2.png" alt="Node view" class="doc-image" id="node-view" />
   </span> <span class="img-wrapper"> <span>Vista de nós</span> </span></p>
<h2 id="Demonstration" class="common-anchor-header">Demonstração<button data-href="#Demonstration" class="anchor-icon" translate="no">
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
    </button></h2><p>Vamos explorar o Attu com um conjunto de dados de teste.</p>
<p>Verifique nosso <a href="https://github.com/zilliztech/attu/tree/main/examples">repositório GitHub</a> para obter o conjunto de dados usado no teste a seguir.</p>
<p>Primeiro, crie uma coleção chamada teste com os quatro campos a seguir:</p>
<ul>
<li>Nome do campo: id, campo de chave primária</li>
<li>Nome do campo: vetor, campo vetorial, vetor float, Dimensão: 128</li>
<li>Nome do campo: brand, campo escalar, Int64</li>
<li>Nome do campo: cor, campo escalar, Int64</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/create_collection_95dfa15354.png" alt="Create a collection" class="doc-image" id="create-a-collection" />
   </span> <span class="img-wrapper"> <span>Criar uma coleção</span> </span></p>
<p>Carrega a coleção para pesquisa depois de ter sido criada com sucesso.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/load_collection_fec39171df.png" alt="Load the collection" class="doc-image" id="load-the-collection" />
   </span> <span class="img-wrapper"> <span>Carregar a coleção</span> </span></p>
<p>Pode agora verificar a coleção recém-criada na página <strong>Síntese</strong>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/check_collection_163b05477e.png" alt="Check the collection" class="doc-image" id="check-the-collection" />
   </span> <span class="img-wrapper"> <span>Verificar a coleção</span> </span></p>
<p>Importar o conjunto de dados de teste para o Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_1_f73d71be85.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>Importar dados</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_2_4b3c3c3c25.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>Importar dados</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_3_0def4e8550.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>Importar dados</span> </span></p>
<p>Clique no nome da coleção na página Visão geral ou Coleção para aceder à interface de consulta e verificar os dados importados.</p>
<p>Adicione o filtro, especifique a expressão <code translate="no">id != 0</code>, clique em <strong>Apply Filter (Aplicar filtro</strong>) e clique em <strong>Query</strong>(Consultar).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_data_24d9f71ccc.png" alt="Query data" class="doc-image" id="query-data" />
   </span> <span class="img-wrapper"> <span>Consultar dados</span> </span></p>
<p>Verificará que todas as cinquenta entradas de entidades foram importadas com êxito.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_result_bcbbd17084.png" alt="Query result" class="doc-image" id="query-result" />
   </span> <span class="img-wrapper"> <span>Resultado da consulta</span> </span></p>
<p>Vamos experimentar a pesquisa de semelhança de vectores.</p>
<p>Copie um vetor de <code translate="no">search_vectors.csv</code> e cole-o no campo <strong>Valor do vetor</strong>. Selecione a coleção e o campo. Clique em <strong>Procurar</strong>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/search_data_5af3a1db53.png" alt="Search data" class="doc-image" id="search-data" />
   </span> <span class="img-wrapper"> <span>Pesquisar dados</span> </span></p>
<p>Pode então verificar o resultado da pesquisa. Sem compilar quaisquer scripts, pode pesquisar facilmente com o Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/search_result_961886efab.png" alt="Search result" class="doc-image" id="search-result" />
   </span> <span class="img-wrapper"> <span>Resultado da pesquisa</span> </span></p>
<p>Finalmente, vamos verificar a página <strong>System View</strong>.</p>
<p>Com a Metrics API encapsulada no Milvus Node.js SDK, pode verificar o estado do sistema, as relações dos nós e o estado dos nós.</p>
<p>Como uma caraterística exclusiva do Attu, a página Visão Geral do Sistema inclui um gráfico topológico completo do sistema. Ao clicar em cada nó, pode verificar o seu estado (atualização a cada 10 segundos).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/topological_graph_d0c5c17586.png" alt="Milvus node topological graph" class="doc-image" id="milvus-node-topological-graph" />
   </span> <span class="img-wrapper"> <span>Gráfico topológico do nó Milvus</span> </span></p>
<p>Clique em cada nó para aceder à <strong>vista de lista de nós</strong>. Pode verificar todos os nós filhos de um nó de coordenação. Ao ordenar, pode identificar rapidamente os nós com elevada utilização de CPU ou memória e localizar o problema no sistema.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/node_list_64fc610a8d.png" alt="Milvus node list" class="doc-image" id="milvus-node-list" />
   </span> <span class="img-wrapper"> <span>Lista de nós do Milvus</span> </span></p>
<h2 id="Whats-more" class="common-anchor-header">O que é mais<button data-href="#Whats-more" class="anchor-icon" translate="no">
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
    </button></h2><p>Como mencionado anteriormente, as páginas <strong>Vetor Search</strong> e <strong>System View</strong> são plugins do Attu. Encorajamos os utilizadores a desenvolverem os seus próprios plugins no Attu para se adequarem aos cenários das suas aplicações. No código fonte, existe uma pasta criada especificamente para códigos de plugins.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/plugins_a2d98e4e5b.png" alt="Plugins" class="doc-image" id="plugins" />
   </span> <span class="img-wrapper"> <span>Plugins</span> </span></p>
<p>Pode consultar qualquer um dos plugins para aprender a construir um plugin. Ao definir o seguinte ficheiro de configuração, pode adicionar o plugin ao Attu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/add_plugins_e3ef53cc0d.png" alt="Add plugins to Attu" class="doc-image" id="add-plugins-to-attu" />
   </span> <span class="img-wrapper"> <span>Adicionar plugins ao Attu</span> </span></p>
<p>Pode consultar o <a href="https://github.com/zilliztech/attu/tree/main/doc">Attu GitHub Repo</a> e <a href="https://milvus.io/docs/v2.0.x/attu.md">o Milvus Technical Document</a> para obter instruções detalhadas.</p>
<p>O Attu é um projeto de código aberto. Todas as contribuições são bem-vindas. Também pode <a href="https://github.com/zilliztech/attu/issues">registar um</a> problema se tiver algum problema com o Attu.</p>
<p>Esperamos sinceramente que o Attu possa trazer-lhe uma melhor experiência de utilização com o Milvus. E se gostar do Attu, ou tiver algum feedback sobre a sua utilização, pode preencher este <a href="https://wenjuan.feishu.cn/m/cfm?t=suw4QnODU1ui-ok7r">Inquérito ao Utilizador do At</a> tu para nos ajudar a otimizar o Attu para uma melhor experiência do utilizador.</p>
