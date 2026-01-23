---
id: create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md
title: >-
  Como as competências antrópicas alteram as ferramentas do agente - e como
  criar uma competência personalizada para que o Milvus possa rapidamente criar
  o RAG
author: Min Yin
date: 2026-01-23T00:00:00.000Z
cover: assets.zilliz.com/skills_cover_new_8caa774cc5.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude Code, Anthropic Skills, MCP, RAG, Milvus'
meta_title: |
  Create a Custom Anthropic Skill for Milvus to Quickly Spin Up RAG
desc: >-
  Saiba o que são competências e como criar uma competência personalizada no
  Claude Code que cria sistemas RAG apoiados pelo Milvus a partir de instruções
  em linguagem natural utilizando um fluxo de trabalho reutilizável.
origin: >-
  https://milvus.io/blog/create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md
---
<p>A utilização de ferramentas é uma parte importante do trabalho de um agente. O agente precisa de escolher a ferramenta certa, decidir quando a chamar e formatar as entradas corretamente. No papel, isso parece simples, mas quando se começa a construir sistemas reais, encontram-se muitos casos extremos e modos de falha.</p>
<p>Muitas equipas usam definições de ferramentas ao estilo MCP para organizar isto, mas o MCP tem algumas arestas. O modelo tem que raciocinar sobre todas as ferramentas ao mesmo tempo, e não há muita estrutura para orientar suas decisões. Para além disso, cada definição de ferramenta tem de estar na janela de contexto. Algumas delas são grandes - o MCP do GitHub tem cerca de 26k tokens - o que consome o contexto antes mesmo de o agente começar a trabalhar de verdade.</p>
<p>O Anthropic introduziu <a href="https://github.com/anthropics/skills?tab=readme-ov-file"><strong>as Skills</strong></a> para melhorar esta situação. As habilidades são menores, mais focadas e mais fáceis de carregar sob demanda. Em vez de despejar tudo no contexto, empacota-se a lógica de domínio, os fluxos de trabalho ou os scripts em unidades compactas que o agente pode utilizar apenas quando necessário.</p>
<p>Neste post, explicarei como as habilidades antrópicas funcionam e, em seguida, mostrarei como criar uma habilidade simples no Claude Code que transforma a linguagem natural em uma base de conhecimento <a href="https://milvus.io/">apoiada pelo Milvus</a>- uma configuração rápida para o RAG sem necessidade de fiação extra.</p>
<h2 id="What-Are-Anthropic-Skills" class="common-anchor-header">O que são habilidades antrópicas?<button data-href="#What-Are-Anthropic-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/blog/is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md">As habilidades antrópicas</a> (ou habilidades de agente) são apenas pastas que agrupam as instruções, scripts e arquivos de referência que um agente precisa para lidar com uma tarefa específica. Pense nelas como pequenos pacotes de recursos independentes. Uma habilidade pode definir como gerar um relatório, executar uma análise ou seguir um determinado fluxo de trabalho ou conjunto de regras.</p>
<p>A ideia principal é que as competências são modulares e podem ser carregadas a pedido. Em vez de colocar enormes definições de ferramentas na janela de contexto, o agente puxa apenas a competência de que necessita. Isso mantém o uso do contexto baixo, ao mesmo tempo em que dá ao modelo uma orientação clara sobre quais ferramentas existem, quando chamá-las e como executar cada etapa.</p>
<p>O formato é intencionalmente simples e, por isso, já é suportado ou facilmente adaptado em várias ferramentas de desenvolvedor - Claude Code, Cursor, extensões do VS Code, integrações do GitHub, configurações no estilo Codex e assim por diante.</p>
<p>Uma Skill segue uma estrutura de pastas consistente:</p>
<pre><code translate="no">skill-name/

├── SKILL.md       <span class="hljs-comment"># Required: Skill instructions and metadata</span>

├── scripts/         <span class="hljs-comment"># Optional: helper scripts</span>

├── templates/       <span class="hljs-comment"># Optional: document templates</span>

└── resources/       <span class="hljs-comment"># Optional: reference materials</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>1.</strong> <code translate="no">SKILL.md</code> <strong>(Arquivo principal)</strong></p>
<p>Este é o guia de execução do agente - o documento que informa ao agente exatamente como a tarefa deve ser executada. Ele define os metadados da Habilidade (como nome, descrição e palavras-chave do acionador), o fluxo de execução e as configurações padrão. Neste ficheiro, deve descrever claramente:</p>
<ul>
<li><p><strong>Quando a Skill deve ser executada:</strong> Por exemplo, acionar a Competência quando a entrada do utilizador incluir uma frase como "processar ficheiros CSV com Python".</p></li>
<li><p><strong>Como a tarefa deve ser executada:</strong> Organize os passos de execução por ordem, tais como: interpretar o pedido do utilizador → chamar scripts de pré-processamento do diretório <code translate="no">scripts/</code> → gerar o código necessário → formatar a saída utilizando modelos de <code translate="no">templates/</code>.</p></li>
<li><p><strong>Regras e restrições:</strong> Especificar detalhes como convenções de codificação, formatos de saída e como os erros devem ser tratados.</p></li>
</ul>
<p><strong>2.</strong> <code translate="no">scripts/</code> <strong>(Scripts de execução)</strong></p>
<p>Este diretório contém scripts pré-escritos em linguagens como Python, Shell ou Node.js. O agente pode chamar estes scripts diretamente, em vez de gerar o mesmo código repetidamente em tempo de execução. Exemplos típicos incluem <code translate="no">create_collection.py</code> e <code translate="no">check_env.py</code>.</p>
<p><strong>3.</strong> <code translate="no">templates/</code> <strong>(Modelos de documentos)</strong></p>
<p>Ficheiros de modelos reutilizáveis que o agente pode utilizar para gerar conteúdo personalizado. Exemplos comuns incluem modelos de relatório ou modelos de configuração.</p>
<p><strong>4.</strong> <code translate="no">resources/</code> <strong>(Materiais de referência)</strong></p>
<p>Documentos de referência que o agente pode consultar durante a execução, como documentação da API, especificações técnicas ou guias de práticas recomendadas.</p>
<p>No geral, esta estrutura reflecte a forma como o trabalho é entregue a um novo colega de equipa: <code translate="no">SKILL.md</code> explica o trabalho, <code translate="no">scripts/</code> fornece ferramentas prontas a utilizar, <code translate="no">templates/</code> define formatos padrão e <code translate="no">resources/</code> fornece informações de base. Com tudo isso no lugar, o agente pode executar a tarefa de forma confiável e com o mínimo de adivinhação.</p>
<h2 id="Hands-on-Tutorial-Creating-a-Custom-Skill-for-a-Milvus-Powered-RAG-System" class="common-anchor-header">Tutorial prático: Criação de uma habilidade personalizada para um sistema RAG alimentado por Milvus<button data-href="#Hands-on-Tutorial-Creating-a-Custom-Skill-for-a-Milvus-Powered-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Nesta seção, vamos criar uma habilidade personalizada que pode configurar uma coleção do Milvus e montar um pipeline RAG completo a partir de instruções simples em linguagem natural. O objetivo é saltar todo o trabalho de configuração habitual - sem desenho manual de esquemas, sem configuração de índices, sem código padrão. O utilizador diz ao agente o que pretende e o Skill trata das peças do Milvus por si.</p>
<h3 id="Design-Overview" class="common-anchor-header">Visão geral do design</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/design_overview_d4c886291b.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Prerequisites" class="common-anchor-header">Pré-requisitos</h3><table>
<thead>
<tr><th>Componente</th><th>Requisito</th></tr>
</thead>
<tbody>
<tr><td>CLI</td><td><code translate="no">claude-code</code></td></tr>
<tr><td>Modelos</td><td>GLM 4.7, OpenAI</td></tr>
<tr><td>Contentor</td><td>Docker</td></tr>
<tr><td>Milvus</td><td>2.6.8</td></tr>
<tr><td>Plataforma de configuração de modelos</td><td>CC-Switch</td></tr>
<tr><td>Gerenciador de pacotes</td><td>npm</td></tr>
<tr><td>Linguagem de desenvolvimento</td><td>Python</td></tr>
</tbody>
</table>
<h3 id="Step-1-Environment-Setup" class="common-anchor-header">Passo 1: Configuração do ambiente</h3><p><strong>Instalar</strong> <code translate="no">claude-code</code></p>
<pre><code translate="no">npm install -g <span class="hljs-meta">@anthropic</span>-ai/claude-code
<button class="copy-code-btn"></button></code></pre>
<p><strong>Instalar o CC-Switch</strong></p>
<p><strong>Nota:</strong> CC-Switch é uma ferramenta de troca de modelos que facilita a troca entre diferentes APIs de modelos ao executar modelos de IA localmente.</p>
<p>Repositório do projeto: <a href="https://github.com/farion1231/cc-switch">https://github.com/farion1231/cc-switch</a></p>
<p><strong>Selecione Claude e adicione uma chave de API</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_0cdfab2e54.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_615ee13649.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Verificar o estado atual</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_f1c13da1fe.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Implantar e iniciar o Milvus-Standalone</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Download docker-compose.yml</span>

wget https://github.com/milvus-io/milvus/releases/download/v2<span class="hljs-number">.6</span><span class="hljs-number">.8</span>/milvus-standalone-docker-compose.yml -O docker-compose.yml

  

<span class="hljs-comment"># Start Milvus (check port mapping: 19530:19530)</span>

docker-compose up -d

  

<span class="hljs-comment"># Verify that the services are running</span>

docker ps | grep milvus

<span class="hljs-comment"># You should see three containers: milvus-standalone, milvus-etcd, milvus-minio</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code1_9c6a1a7f93.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Configurar a chave da API OpenAI</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Add this to ~/.bashrc or ~/.zshrc</span>

OPENAI_API_KEY=your_openai_api_key_here
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-the-Custom-Skill-for-Milvus" class="common-anchor-header">Etapa 2: criar a habilidade personalizada para o Milvus</h3><p><strong>Criar a estrutura de diretório</strong></p>
<pre><code translate="no"><span class="hljs-built_in">cd</span> ~/.claude/skills/

<span class="hljs-built_in">mkdir</span> -p milvus-skills/example milvus-skills/scripts
<button class="copy-code-btn"></button></code></pre>
<p><strong>Inicializar</strong> <code translate="no">SKILL.md</code></p>
<p><strong>Nota:</strong> SKILL.md serve como guia de execução do agente. Ele define o que a habilidade faz e como ela deve ser acionada.</p>
<pre><code translate="no"><span class="hljs-attr">name</span>: milvus-collection-builder

<span class="hljs-attr">description</span>: <span class="hljs-title class_">Create</span> <span class="hljs-title class_">Milvus</span> collections <span class="hljs-keyword">using</span> natural language, supporting both <span class="hljs-variable constant_">RAG</span> and text search scenarios
<button class="copy-code-btn"></button></code></pre>
<p><strong>Escrever os scripts principais</strong></p>
<table>
<thead>
<tr><th>Tipo de script</th><th>Nome do ficheiro</th><th>Finalidade</th></tr>
</thead>
<tbody>
<tr><td>Verificação do ambiente</td><td><code translate="no">check_env.py</code></td><td>Verifica a versão do Python, as dependências necessárias e a ligação ao Milvus</td></tr>
<tr><td>Análise de intenções</td><td><code translate="no">intent_parser.py</code></td><td>Converte pedidos como "construir uma base de dados RAG" numa intenção estruturada, como <code translate="no">scene=rag</code></td></tr>
<tr><td>Criação de colecções</td><td><code translate="no">milvus_builder.py</code></td><td>O construtor principal que gera o esquema da coleção e a configuração do índice</td></tr>
<tr><td>Ingestão de dados</td><td><code translate="no">insert_milvus_data.py</code></td><td>Carrega documentos, agrupa-os, gera embeddings e escreve dados no Milvus</td></tr>
<tr><td>Exemplo 1</td><td><code translate="no">basic_text_search.py</code></td><td>Demonstra como criar um sistema de pesquisa de documentos</td></tr>
<tr><td>Exemplo 2</td><td><code translate="no">rag_knowledge_base.py</code></td><td>Demonstra como construir uma base de conhecimentos RAG completa</td></tr>
</tbody>
</table>
<p>Estes scripts mostram como transformar uma competência centrada no Milvus em algo prático: um sistema de pesquisa de documentos funcional e uma configuração inteligente de perguntas e respostas (RAG).</p>
<h3 id="Step-3-Enable-the-Skill-and-Run-a-Test" class="common-anchor-header">Etapa 3: Ativar a habilidade e executar um teste</h3><p><strong>Descrever o pedido em linguagem natural</strong></p>
<pre><code translate="no"><span class="hljs-string">&quot;I want to build an RAG system.&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test1_64fd549573.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Sistema RAG criado</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test2_80656d59b1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Inserir dados de amostra</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test3_392753eb73.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Executar uma consulta</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test4_75e23c6a3a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>Neste tutorial, nós caminhamos pela construção de um sistema RAG alimentado pelo Milvus usando uma Skill personalizada. O objetivo não era apenas mostrar outra maneira de chamar o Milvus - era mostrar como as habilidades podem transformar o que normalmente é uma configuração pesada e de várias etapas em algo que pode ser reutilizado e iterado. Em vez de definir manualmente esquemas, ajustar índices ou juntar código de fluxo de trabalho, a Skill lida com a maior parte do trabalho burocrático para que se possa concentrar nas partes do RAG que realmente importam.</p>
<p>Isto é apenas o começo. Um pipeline RAG completo tem muitas peças móveis: pré-processamento, fragmentação, configurações de pesquisa híbrida, reranking, avaliação e muito mais. Tudo isso pode ser empacotado como habilidades separadas e composto dependendo do seu caso de uso. Se a sua equipa tiver normas internas para dimensões de vectores, parâmetros de índices, modelos de pedidos ou lógica de recuperação, as competências são uma forma simples de codificar esse conhecimento e torná-lo repetível.</p>
<p>Para novos desenvolvedores, isso diminui a barreira de entrada - não há necessidade de aprender cada detalhe do Milvus antes de colocar algo em funcionamento. Para equipas experientes, reduz a repetição de configurações e ajuda a manter os projectos consistentes entre ambientes. As habilidades não substituem o design cuidadoso do sistema, mas eliminam muitos atritos desnecessários.</p>
<p>A implementação completa está disponível no <a href="https://github.com/yinmin2020/open-milvus-skills">repositório de código aberto</a>, e você pode explorar mais exemplos criados pela comunidade no <a href="https://skillsmp.com/">mercado de habilidades</a>.</p>
<h2 id="Stay-tuned" class="common-anchor-header">Fique atento!<button data-href="#Stay-tuned" class="anchor-icon" translate="no">
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
    </button></h2><p>Também estamos a trabalhar na introdução de competências oficiais do Milvus e do Zilliz Cloud que abrangem padrões RAG comuns e práticas recomendadas de produção. Se tiver ideias ou fluxos de trabalho específicos para os quais pretende obter suporte, junte-se ao nosso <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canal do Slack</a> e converse com os nossos engenheiros. E se quiser orientação para a sua própria configuração, pode sempre reservar uma sessão <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>.</p>
