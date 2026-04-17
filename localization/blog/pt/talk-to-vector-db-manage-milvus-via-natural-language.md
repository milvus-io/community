---
id: talk-to-your-vector-database-managing-milvus-via-natural-language.md
title: >-
  Fale com a sua base de dados de vectores: Gerir o Milvus através de linguagem
  natural
author: Lawrence Luo
date: 2025-08-01T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Aug_2_2025_01_17_45_PM_9c50d607bb.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'vector database, mcp, LLM, claude, gemini'
meta_keywords: 'Cursor, Claude Code, Gemini CLI, Code search, MCP'
meta_title: |
  Talk to Your Vector Database: Managing Milvus via Natural Language
desc: >-
  O Milvus MCP Server liga o Milvus diretamente aos assistentes de codificação
  de IA, como o Claude Code e o Cursor, através do MCP. Pode gerir o Milvus
  através de linguagem natural.
origin: >-
  https://milvus.io/blog/talk-to-your-vector-database-managing-milvus-via-natural-language.md
---
<p>Alguma vez desejou poder dizer ao seu assistente de IA: <em>"Mostre-me todas as colecções da minha base de dados vetorial"</em> ou <em>"Encontre documentos semelhantes a este texto"</em> e que isso funcionasse realmente?</p>
<p>O <a href="http://github.com/zilliztech/mcp-server-milvus"><strong>servidor Milvus MCP</strong></a> torna isso possível, ligando a sua base de dados vetorial Milvus diretamente aos assistentes de codificação de IA, como o Claude Desktop e o Cursor IDE, através do Protocolo de Contexto de Modelo (MCP). Em vez de escrever código <code translate="no">pymilvus</code>, pode gerir todo o seu Milvus através de conversas em linguagem natural.</p>
<ul>
<li><p>Sem o servidor Milvus MCP: Escrever scripts Python com o pymilvus SDK para pesquisar vectores</p></li>
<li><p>Com o Milvus MCP Server: "Encontrar documentos semelhantes a este texto na minha coleção."</p></li>
</ul>
<p>👉 <strong>Repositório GitHub:</strong><a href="https://github.com/zilliztech/mcp-server-milvus"> github.com/zilliztech/mcp-server-milvus</a></p>
<p>E se estiver a utilizar <a href="https://zilliz.com/cloud">o Zilliz Cloud</a> (Milvus gerido), também o temos coberto. No final deste blogue, apresentaremos também o <strong>Zilliz MCP Server</strong>, uma opção gerida que funciona perfeitamente com o Zilliz Cloud. Vamos lá.</p>
<h2 id="What-Youll-Get-with-Milvus-MCP-Server" class="common-anchor-header">O que obterá com o Servidor MCP Milvus<button data-href="#What-Youll-Get-with-Milvus-MCP-Server" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus MCP Server fornece ao seu assistente de IA as seguintes capacidades:</p>
<ul>
<li><p><strong>Listar e explorar</strong> colecções de vectores</p></li>
<li><p><strong>Pesquisar vectores</strong> utilizando a similaridade semântica</p></li>
<li><p><strong>Criar novas colecções</strong> com esquemas personalizados</p></li>
<li><p><strong>Inserir e gerir</strong> dados vectoriais</p></li>
<li><p><strong>Executar consultas complexas</strong> sem escrever código</p></li>
<li><p>E muito mais</p></li>
</ul>
<p>Tudo através de uma conversa natural, como se estivesse a falar com um especialista em bases de dados. Consulte <a href="https://github.com/zilliztech/mcp-server-milvus?tab=readme-ov-file#available-tools">este repositório</a> para obter a lista completa de capacidades.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/demo_adedb25430.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Quick-Start-Guide" class="common-anchor-header">Guia de início rápido<button data-href="#Quick-Start-Guide" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">Pré-requisitos</h3><p><strong>Necessário:</strong></p>
<ul>
<li><p>Python 3.10 ou superior</p></li>
<li><p>Uma instância Milvus em execução (local ou remota)</p></li>
<li><p><a href="https://github.com/astral-sh/uv">Gerenciador de pacotes uv</a> (recomendado)</p></li>
</ul>
<p><strong>Aplicações de IA suportadas:</strong></p>
<ul>
<li><p>Claude Desktop</p></li>
<li><p>Cursor IDE</p></li>
<li><p>Qualquer aplicativo compatível com MCP</p></li>
</ul>
<h3 id="Tech-Stack-We’ll-Use" class="common-anchor-header">Pilha de tecnologia que usaremos</h3><p>Neste tutorial, usaremos a seguinte pilha de tecnologia:</p>
<ul>
<li><p><strong>Linguagem Runtime:</strong> <a href="https://www.python.org/">Python 3.11</a></p></li>
<li><p><strong>Gerenciador de pacotes:</strong> UV</p></li>
<li><p><strong>IDE:</strong> Cursor</p></li>
<li><p><strong>Servidor MCP:</strong> mcp-server-milvus</p></li>
<li><p><strong>LLM:</strong> Claude 3.7</p></li>
<li><p><strong>Base de dados vetorial:</strong> Milvus</p></li>
</ul>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">Passo 1: Instalar as dependências</h3><p>Primeiro, instale o gerenciador de pacotes uv:</p>
<pre><code translate="no">curl -<span class="hljs-title class_">LsSf</span> <span class="hljs-attr">https</span>:<span class="hljs-comment">//astral.sh/uv/install.sh | sh</span>
<button class="copy-code-btn"></button></code></pre>
<p>Ou:</p>
<pre><code translate="no">pip3 install uv -i <span class="hljs-attr">https</span>:<span class="hljs-comment">//mirrors.aliyun.com/pypi/simple</span>
<button class="copy-code-btn"></button></code></pre>
<p>Verificar a instalação:</p>
<pre><code translate="no">uv --version
uvx --version
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_1_Install_Dependencies_3e452c55e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Set-Up-Milvus" class="common-anchor-header">Etapa 2: Configurar o Milvus</h3><p><a href="https://milvus.io/">Milvus</a> é um banco de dados vetorial de código aberto nativo para cargas de trabalho de IA, criado por <a href="https://zilliz.com/">Zilliz</a>. Projetado para lidar com milhões a bilhões de registros vetoriais, ele ganhou mais de 36.000 estrelas no GitHub. Com base nessa base, a Zilliz também oferece <a href="https://zilliz.com/cloud">o Zilliz Cloud - um</a>serviço totalmente gerenciado do Milvus projetado para usabilidade, economia e segurança com uma arquitetura nativa da nuvem.</p>
<p>Para conhecer os requisitos de implementação do Milvus, consulte <a href="https://milvus.io/docs/prerequisite-docker.md">este guia no site do documento</a>.</p>
<p><strong>Requisitos mínimos:</strong></p>
<ul>
<li><p><strong>Software:</strong> Docker, Docker Compose</p></li>
<li><p><strong>RAM:</strong> 16GB+</p></li>
<li><p><strong>Disco:</strong> 100GB+</p></li>
</ul>
<p>Descarregar o ficheiro YAML de implementação:</p>
<pre><code translate="no">[root@Milvus ~]# wget https://github.com/milvus-io/milvus/releases/download/v2.5.4/milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>Iniciar o Milvus:</p>
<pre><code translate="no">[<span class="hljs-meta">root@Milvus ~</span>]<span class="hljs-meta"># docker-compose up -d</span>
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">[<span class="hljs-meta">root@Milvus ~</span>]<span class="hljs-meta"># docker ps -a</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_2_Set_Up_Milvus_4826468767.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sua instância do Milvus estará disponível em <code translate="no">http://localhost:19530</code>.</p>
<h3 id="Step-3-Install-the-MCP-Server" class="common-anchor-header">Etapa 3: Instalar o servidor MCP</h3><p>Clone e teste o servidor MCP:</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/zilliztech/mcp-server-milvus.git
<span class="hljs-built_in">cd</span> mcp-server-milvus

<span class="hljs-comment"># Test the server locally</span>
uv run src/mcp_server_milvus/server.py --milvus-uri http://localhost:19530
<button class="copy-code-btn"></button></code></pre>
<p>Recomendamos a instalação de dependências e a verificação local antes de registar o servidor no Cursor:</p>
<pre><code translate="no">uv run src/mcp_server_milvus/server.<span class="hljs-property">py</span> --milvus-uri <span class="hljs-attr">http</span>:<span class="hljs-comment">//192.168.4.48:19530</span>
<button class="copy-code-btn"></button></code></pre>
<p>Se vir o servidor a iniciar com êxito, está pronto para configurar a sua ferramenta de IA.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_3_Install_the_MCP_Server_9ce01351e6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configure-Your-AI-Assistant" class="common-anchor-header">Etapa 4: Configurar o assistente de IA</h3><p><strong>Opção A: Área de trabalho do Claude</strong></p>
<ol>
<li><h4 id="Install-Claude-Desktop-from-claudeaidownloadhttpclaudeaidownload" class="common-anchor-header">Instale o Claude Desktop a partir de <code translate="no">[claude.ai/download](http://claude.ai/download)</code>.</h4></li>
<li><p>Abra o arquivo de configuração:</p></li>
</ol>
<ul>
<li>macOS: <code translate="no">~/Library/Application Support/Claude/claude_desktop_config.json</code></li>
<li>Windows: <code translate="no">%APPDATA%\Claude\claude_desktop_config.json</code></li>
</ul>
<p>Adicione esta configuração:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;milvus&quot;</span>: {
      <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;/path/to/uv&quot;</span>,
      <span class="hljs-string">&quot;args&quot;</span>: [
        <span class="hljs-string">&quot;--directory&quot;</span>,
        <span class="hljs-string">&quot;/path/to/mcp-server-milvus&quot;</span>,
        <span class="hljs-string">&quot;run&quot;</span>,
        <span class="hljs-string">&quot;src/mcp_server_milvus/server.py&quot;</span>,
        <span class="hljs-string">&quot;--milvus-uri&quot;</span>,
        <span class="hljs-string">&quot;http://localhost:19530&quot;</span>
      ]
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>Reiniciar o Claude Desktop</li>
</ol>
<p><strong>Opção B: Cursor IDE</strong></p>
<ol>
<li><p>Abrir Definições do Cursor → Funcionalidades → MCP</p></li>
<li><p>Adicionar um novo servidor MCP global (isto cria <code translate="no">.cursor/mcp.json</code>)</p></li>
<li><p>Adicione esta configuração:</p></li>
</ol>
<p>Nota: Ajustar os caminhos à sua estrutura de ficheiros atual.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;milvus&quot;</span>: {
      <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;/PATH/TO/uv&quot;</span>,
      <span class="hljs-string">&quot;args&quot;</span>: [
        <span class="hljs-string">&quot;--directory&quot;</span>,
        <span class="hljs-string">&quot;/path/to/mcp-server-milvus/src/mcp_server_milvus&quot;</span>,
        <span class="hljs-string">&quot;run&quot;</span>,
        <span class="hljs-string">&quot;server.py&quot;</span>,
        <span class="hljs-string">&quot;--milvus-uri&quot;</span>,
        <span class="hljs-string">&quot;http://127.0.0.1:19530&quot;</span>
      ]
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Option_B_Cursor_IDE_cd1321ea25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Parâmetros:</strong></p>
<ul>
<li><code translate="no">/PATH/TO/uv</code> é o caminho para o executável uv</li>
<li><code translate="no">--directory</code> é o caminho para o projeto clonado</li>
<li><code translate="no">--milvus-uri</code> é o ponto final do seu servidor Milvus</li>
</ul>
<ol start="4">
<li>Reiniciar o Cursor ou recarregar a janela</li>
</ol>
<p><strong>Dica profissional:</strong> Encontre o seu caminho <code translate="no">uv</code> com <code translate="no">which uv</code> no macOS/Linux ou <code translate="no">where uv</code> no Windows.</p>
<h3 id="Step-5-See-It-in-Action" class="common-anchor-header">Passo 5: Ver em ação</h3><p>Uma vez configurado, experimente estes comandos de linguagem natural:</p>
<ul>
<li><p><strong>Explore a sua base de dados:</strong> "Que colecções tenho na minha base de dados Milvus?"</p></li>
<li><p><strong>Criar uma nova coleção:</strong> "Crie uma coleção chamada 'articles' com campos para o título (cadeia de caracteres), conteúdo (cadeia de caracteres) e um campo vetorial de 768 dimensões para embeddings."</p></li>
<li><p><strong>Procurar conteúdos semelhantes:</strong> "Encontrar os cinco artigos mais semelhantes a 'aplicações de aprendizagem automática' na minha coleção de artigos."</p></li>
<li><p><strong>Inserir dados:</strong> "Adicionar um novo artigo com o título 'AI Trends 2024' e o conteúdo 'Artificial intelligence continues to evolve...' à coleção de artigos"</p></li>
</ul>
<p><strong>O que antes exigia mais de 30 minutos de codificação, agora leva segundos de conversação.</strong></p>
<p>Obtém controlo em tempo real e acesso em linguagem natural ao Milvus - sem ter de escrever um modelo ou aprender a API.</p>
<h2 id="Troubleshooting" class="common-anchor-header">Solução de problemas<button data-href="#Troubleshooting" class="anchor-icon" translate="no">
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
    </button></h2><p>Se as ferramentas MCP não aparecerem, reinicie completamente a sua aplicação de IA, verifique o caminho UV com <code translate="no">which uv</code> e teste o servidor manualmente com <code translate="no">uv run src/mcp_server_milvus/server.py --milvus-uri http://localhost:19530</code>.</p>
<p>Para erros de ligação, verifique se o Milvus está a ser executado com <code translate="no">docker ps | grep milvus</code>, tente utilizar <code translate="no">127.0.0.1</code> em vez de <code translate="no">localhost</code>, e verifique se a porta 19530 está acessível.</p>
<p>Se encontrar problemas de autenticação, defina a variável de ambiente <code translate="no">MILVUS_TOKEN</code> se o seu Milvus exigir autenticação e verifique as suas permissões para as operações que está a tentar efetuar.</p>
<h2 id="Managed-Alternative-Zilliz-MCP-Server" class="common-anchor-header">Alternativa gerenciada: Servidor MCP Zilliz<button data-href="#Managed-Alternative-Zilliz-MCP-Server" class="anchor-icon" translate="no">
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
    </button></h2><p>O <strong>servidor MCP Milvus</strong> de código aberto é uma óptima solução para implementações locais ou auto-hospedadas do Milvus. Mas se estiver a utilizar <a href="https://zilliz.com/cloud">o Zilliz Cloud - o</a>serviço totalmente gerido e de nível empresarial criado pelos criadores do Milvus - existe uma alternativa específica: o <a href="https://zilliz.com/blog/introducing-zilliz-mcp-server"><strong>Zilliz MCP Server</strong></a>.</p>
<p><a href="https://zilliz.com/cloud">O Zilliz Cloud</a> elimina as despesas gerais de gestão da sua própria instância do Milvus, oferecendo uma base de dados vetorial nativa da nuvem escalável, com desempenho e segura. O <strong>Zilliz MCP Server</strong> integra-se diretamente com o Zilliz Cloud e expõe as suas capacidades como ferramentas compatíveis com o MCP. Isso significa que seu assistente de IA - seja no Claude, no Cursor ou em outro ambiente compatível com MCP - agora pode consultar, gerenciar e orquestrar seu espaço de trabalho do Zilliz Cloud usando linguagem natural.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zilliz_mcp_abe1ca1271.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sem código padrão. Sem alternar entre guias. Nada de escrever manualmente chamadas REST ou SDK. Basta dizer o seu pedido e deixar o seu assistente tratar do resto.</p>
<h3 id="🚀-Getting-Started-with-Zilliz-MCP-Server" class="common-anchor-header">Introdução ao Zilliz MCP Server</h3><p>Se está pronto para uma infraestrutura vetorial pronta para produção com a facilidade da linguagem natural, começar leva apenas alguns passos:</p>
<ol>
<li><p><a href="https://cloud.zilliz.com/signup"><strong>Inscreva-se no Zilliz Cloud</strong></a> - nível gratuito disponível.</p></li>
<li><p><a href="http://github.com/zilliztech/zilliz-mcp-server"><strong>Instalar o Zilliz MCP Server a</strong> partir do </a>repositório GitHub.</p></li>
<li><p><strong>Configure o seu assistente compatível com MCP</strong> (Claude, Cursor, etc.) para se ligar à sua instância Zilliz Cloud.</p></li>
</ol>
<p>Isto dá-lhe o melhor de dois mundos: pesquisa vetorial poderosa com infraestrutura de nível de produção, agora acessível através de inglês simples.</p>
<h2 id="Wrapping-Up" class="common-anchor-header">Conclusão<button data-href="#Wrapping-Up" class="anchor-icon" translate="no">
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
    </button></h2><p>E é tudo - acabou de aprender como transformar o Milvus numa base de dados vetorial em linguagem natural <em>com a qual</em> pode literalmente <em>falar</em>. Não é mais necessário vasculhar os documentos do SDK ou escrever um código de barras apenas para criar uma coleção ou executar uma pesquisa.</p>
<p>Quer esteja a executar o Milvus localmente ou a utilizar o Zilliz Cloud, o MCP Server fornece ao seu assistente de IA uma caixa de ferramentas para gerir os seus dados vectoriais como um profissional. Basta escrever o que pretende fazer e deixar que o Claude ou o Cursor tratem do resto.</p>
<p>Por isso, vá em frente - accione a sua ferramenta de desenvolvimento de IA, pergunte "que colecções tenho?" e veja-a em ação. Nunca mais vai querer voltar a escrever consultas vectoriais à mão.</p>
<ul>
<li><p>Configuração local? Utilize o<a href="https://github.com/zilliztech/mcp-server-milvus"> servidor Milvus MCP</a> de código aberto</p></li>
<li><p>Prefere um serviço gerido? Inscreva-se no Zilliz Cloud e utilize o<a href="https://github.com/zilliztech/zilliz-mcp-server"> servidor Zilliz MCP</a></p></li>
</ul>
<p>Já tem as ferramentas. Agora, deixe a sua IA digitar.</p>
