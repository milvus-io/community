---
id: claude-code-context-management-tools.md
title: >
  As 7 melhores ferramentas de código aberto para a gestão do contexto do código
  do Claude
author: Cheney Zhang
date: 2026-5-7
cover: assets.zilliz.com/Chat_GPT_Image_Jun_22_2026_07_49_53_PM_11zon_d1a8de60bd.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Claude Code context, Claude Code tools, token management, MCP code search, AI
  agent memory
meta_title: |
  7 Best Open-Source Tools for Claude Code Context Management
desc: >
  As sessões prolongadas do Claude Code perdem o sinal rapidamente. Aprenda a
  utilizar 7 ferramentas para reduzir o ruído do terminal, recuperar código,
  otimizar a saída das ferramentas, a memória e a utilização de tokens.
origin: 'https://milvus.io/blog/claude-code-context-management-tools.md'
---
<p>Pode fornecer ao Claude Code uma janela de contexto de 1M tokens e, mesmo assim, obter respostas cada vez piores com o passar do tempo. A questão não é apenas o tamanho do contexto. É a qualidade do contexto.</p>
<p>As sessões do Claude Code deterioram-se quando os registos do terminal, a saída bruta das ferramentas, as leituras repetidas de ficheiros, as respostas prolixas e o histórico do projeto esquecido competem pela atenção. Em fluxos de trabalho de agentes de longa duração, esse ruído transforma-se num ciclo vicioso: o modelo perde o fio à meada, adiciona-se mais turnos para corrigir a resposta e esses turnos adicionais acrescentam ainda mais ruído.</p>
<p>Isto é o que se denomina <strong>«desfocagem do contexto</strong>»: o modelo tem espaço suficiente para armazenar informação, mas a informação importante fica enterrada sob contexto de baixo sinal. Janelas maiores podem tornar isto mais fácil de ignorar, porque os programadores deixam de pensar cuidadosamente sobre o que introduzem no prompt.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_13_3e7a004cd6.png" alt="Prompt caching diagram showing how reused prefixes can still add billed context across turns" class="doc-image" id="prompt-caching-diagram-showing-how-reused-prefixes-can-still-add-billed-context-across-turns" /> 
   <span>Diagrama de armazenamento em cache de prompts que mostra como os prefixos reutilizados podem ainda assim adicionar contexto faturado ao longo das iterações</span>
  
 </span></p>
<p>O armazenamento em cache de prompts pode reduzir o custo dos prefixos repetidos, mas não transforma a janela de contexto numa gaveta de tralha. Continua a pagar pelos novos tokens e continua a precisar que o modelo raciocine com base na informação correta.</p>
<p>Este artigo analisa sete ferramentas de código aberto que abordam a perda de foco no contexto a partir de diferentes camadas: saída do terminal, saída de ferramentas, navegação na base de código, leitura de ficheiros, verbosidade do modelo, recuperação semântica de código e memória entre sessões. Explica também como estas ideias se relacionam com o design <a href="https://zilliz.com/learn/what-is-vector-database">de bases de dados vetoriais</a>, <a href="https://zilliz.com/learn/vector-similarity-search">a pesquisa de similaridade vetorial</a> e sistemas de recuperação como o Milvus.</p>
<h2 id="What-causes-Claude-Code-context-defocus" class="common-anchor-header">O que causa a perda de foco no contexto do Claude Code?<button data-href="#What-causes-Claude-Code-context-defocus" class="anchor-icon" translate="no">
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
    </button></h2><p>A perda de contexto no Claude Code decorre geralmente de cinco modos de falha: excesso de texto bruto de instruções, saída ruidosa das ferramentas, exploração repetida da base de código, respostas longas do modelo e lacunas de memória entre sessões ou agentes.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_15_56a2da172a.png" alt="Five causes of Claude Code context loss: redundant instructions, messy tool output, repeated codebase retrieval, long responses, and memory gaps" class="doc-image" id="five-causes-of-claude-code-context-loss:-redundant-instructions,-messy-tool-output,-repeated-codebase-retrieval,-long-responses,-and-memory-gaps" /> 
   <span>Cinco causas da perda de contexto do Claude Code: instruções redundantes, saída desorganizada da ferramenta, recuperação repetida da base de código, respostas longas e lacunas de memória</span>
  
 </span></p>
<table>
<thead>
<tr><th>Modo de falha de contexto</th><th>Como se manifesta no Claude Code</th><th>Categoria de ferramentas que ajuda</th></tr>
</thead>
<tbody>
<tr><td>Os registos do terminal são ruidosos</td><td><code translate="no">git</code>, <code translate="no">pytest</code>, <code translate="no">gh</code>, e as CLIs na nuvem apresentam mais texto do que o modelo necessita.</td><td>Compressão da saída da CLI</td></tr>
<tr><td>As saídas das ferramentas inundam a janela</td><td>Os registos de teste, os dumps do DOM e as saídas do MCP aparecem no chat como enormes blocos de dados brutos.</td><td>Isolamento das saídas das ferramentas</td></tr>
<tr><td>A navegação na base de código repete-se</td><td>O Claude lista diretórios, executa comandos grep, lê ficheiros e repete a mesma exploração em todas as sessões.</td><td>Gráfico de código ou recuperação semântica</td></tr>
<tr><td>A leitura de ficheiros é demasiado abrangente</td><td>O modelo lê um ficheiro inteiro quando apenas precisava de um símbolo ou de um resumo.</td><td>Leitura progressiva do código</td></tr>
<tr><td>O Claude fala demais</td><td>A própria resposta acrescenta contexto desnecessário para as próximas trocas de mensagens.</td><td>Compressão da resposta</td></tr>
<tr><td>A memória não é mantida</td><td>Tem de voltar a explicar as decisões do projeto sempre que inicia uma nova sessão.</td><td>Memória «Markdown-first»</td></tr>
</tbody>
</table>
<p>Uma boa pilha de gestão de contexto deve fazer três coisas: manter o lixo fora, recuperar o conhecimento certo do projeto quando necessário e preservar decisões duradouras entre sessões.</p>
<h2 id="Which-Claude-Code-context-tool-should-you-use-first" class="common-anchor-header">Qual ferramenta de contexto do Claude Code deve utilizar primeiro?<button data-href="#Which-Claude-Code-context-tool-should-you-use-first" class="anchor-icon" translate="no">
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
    </button></h2><p>Começa pela camada que cria mais ruído no teu fluxo de trabalho. Se o problema for a saída do teu terminal, começa pelo RTK. Se o Claude estiver sempre a vaguear por um repositório grande, começa pelo claude-context ou pelo code-review-graph. Se o teu verdadeiro problema for ter de explicar as mesmas decisões todos os dias, começa pelo memsearch.</p>
<table>
<thead>
<tr><th>Ferramenta</th><th>Principal problema que resolve</th><th>Melhor adequação</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/rtk-ai/rtk">RTK</a></td><td>Saída ruidosa do terminal proveniente de comandos comuns de programadores.</td><td>Desenvolvedores que executam muitos comandos da CLI no Claude Code.</td></tr>
<tr><td><a href="https://github.com/mksglu/context-mode">Modo de Contexto</a></td><td>Grandes quantidades de saídas brutas de ferramentas a entrar na conversa principal.</td><td>Utilizadores intensivos do Playwright, GitHub, registos ou ferramentas MCP.</td></tr>
<tr><td><a href="https://github.com/tirth8205/code-review-graph">code-review-graph</a></td><td>Exploração às cegas da base de código em repositórios de grande dimensão.</td><td>Revisões, análise de dependências e questões sobre o «blast-radius».</td></tr>
<tr><td><a href="https://github.com/Mibayy/token-savior">Token Savior</a></td><td>Leitura completa de ficheiros quando bastaria um resumo de símbolos.</td><td>Ficheiros grandes, pesquisas repetidas de símbolos e leitura incremental de código.</td></tr>
<tr><td><a href="https://github.com/JuliusBrussee/caveman">Caveman</a></td><td>Os próprios hábitos de respostas prolixas do Claude.</td><td>Utilizadores que pretendem resultados concisos e um contexto futuro mais reduzido.</td></tr>
<tr><td><a href="https://github.com/zilliztech/claude-context">claude-context</a></td><td>Reexplorar a base de código em cada sessão.</td><td>Pesquisa semântica de código através do MCP.</td></tr>
<tr><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>Perda da memória do projeto entre sessões, agentes e mudanças de modelo.</td><td>Projetos de longa duração com decisões e lições duradouras.</td></tr>
</tbody>
</table>
<p>As primeiras cinco ferramentas reduzem o que entra ou permanece no contexto. As duas últimas facilitam a recuperação de contexto útil.</p>
<h2 id="RTK-compresses-raw-command-output-before-Claude-sees-it" class="common-anchor-header">O RTK comprime a saída bruta dos comandos antes de o Claude a ver<button data-href="#RTK-compresses-raw-command-output-before-Claude-sees-it" class="anchor-icon" translate="no">
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
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rtk_de6e8e7fb3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O RTK é um proxy de CLI destinado a reduzir o uso de tokens em comandos comuns de desenvolvimento. A sua descrição no GitHub indica que reduz o consumo de tokens do LLM em 60-90% em comandos comuns de desenvolvimento e é fornecido como um único binário em Rust.</p>
<p>Na utilização quotidiana do Claude Code, comandos como <code translate="no">git status</code>, <code translate="no">pytest</code> e listagens de diretórios costumam descarregar informações completas do ambiente e descrições de estado na janela de contexto. O modelo normalmente precisa apenas de uma resposta mais sucinta: quais os ficheiros que foram alterados, qual o teste que falhou, onde o PR está bloqueado ou quais os ficheiros-chave que existem no diretório.</p>
<p>O RTK situa-se entre o shell e o Claude. Consegue reescrever comandos através de hooks do Claude Code e devolver resultados comprimidos.</p>
<p>Saída bruta do ` <code translate="no">git status</code> `:</p>
<pre><code translate="no" class="language-bash">On branch feat/payment-retry
Your branch is up to <span class="hljs-built_in">date</span> with <span class="hljs-string">&#x27;origin/feat/payment-retry&#x27;</span>.

Changes not staged <span class="hljs-keyword">for</span> commit:
  modified:   src/webhook/handler.ts
  modified:   src/queue/dlq.ts
  modified:   tests/webhook.test.ts

Untracked files:
  docs/notes.md

no changes added to commit
<button class="copy-code-btn"></button></code></pre>
<p>O que realmente importa:</p>
<pre><code translate="no" class="language-bash">3 modified, 1 untracked
- src/webhook/handler.ts
- src/queue/dlq.ts
- tests/webhook.test.ts
<button class="copy-code-btn"></button></code></pre>
<p>O mesmo se passa com o ` <code translate="no">pytest</code>`. A saída em bruto está repleta de casos bem-sucedidos e ruído do ambiente:</p>
<pre><code translate="no" class="language-markdown">============================= <span class="hljs-built_in">test</span> session starts =============================
platform darwin -- Python 3.12.4, pytest-8.4.1
collected 128 items

tests/test_auth.py ....................................
tests/test_webhook.py ....F....
tests/test_queue.py ...................................

================================== FAILURES ==================================
________________ test_retry_to_dlq __________________
E   AssertionError: expected status code 202, got 500
<button class="copy-code-btn"></button></code></pre>
<p>Quando comprimida, a mensagem é imediata:</p>
<pre><code translate="no" class="language-apache">128 tests collected, 1 failed
FAIL tests/test_webhook.py::test_retry_to_dlq
AssertionError: expected status code 202, got 500
<button class="copy-code-btn"></button></code></pre>
<p>O RTK é o ponto de partida mais fácil quando o excesso de contexto provém de comandos do shell, em vez da recuperação de código.</p>
<h2 id="Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="common-anchor-header">O Modo de Contexto isola saídas gigantescas de ferramentas fora do chat principal<button data-href="#Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="anchor-icon" translate="no">
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
    </button></h2><p>O Modo de Contexto foi concebido para os blocos em bruto que as ferramentas devolvem: registos de teste, instantâneos do DOM do navegador, cargas úteis do GitHub, resultados de ferramentas MCP e páginas extraídas. A sua descrição no GitHub destaca a otimização da janela de contexto para agentes de codificação com IA e relata uma redução de 98% na saída das ferramentas.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_5_f00e17ea6f.png" alt="Context Mode GitHub repository card showing sandboxed tool output and context optimization positioning" class="doc-image" id="context-mode-github-repository-card-showing-sandboxed-tool-output-and-context-optimization-positioning" /> 
   <span>Cartão do repositório do Modo de Contexto no GitHub a mostrar a saída das ferramentas isolada numa sandbox e o posicionamento da otimização do contexto</span>
  
 </span></p>
<p>A sua abordagem consiste em isolar grandes saídas de ferramentas numa sandbox local e num índice, passando depois apenas resumos e identificadores de recuperação para a conversa no Claude.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_12_32e50fec44.png" alt="Context Mode flow showing large tool output moving through sandbox execution, SQLite or FTS indexes, summaries, and retrieval results" class="doc-image" id="context-mode-flow-showing-large-tool-output-moving-through-sandbox-execution,-sqlite-or-fts-indexes,-summaries,-and-retrieval-results" /> 
   <span>Fluxo do Context Mode a mostrar a saída volumosa das ferramentas a passar pela execução na sandbox, pelos índices SQLite ou FTS, pelos resumos e pelos resultados de recuperação</span>
  
 </span></p>
<p>Este fluxo é útil porque um agente de codificação necessita frequentemente do nó com falha, do seletor avariado ou do rastreio de pilha relevante, e não de todo o DOM ou de cada linha de teste bem-sucedida. O «Context Mode» mantém a saída completa disponível localmente, evitando ao mesmo tempo que esta domine a conversa principal.</p>
<p>Isto é semelhante à forma como os sistemas <a href="https://zilliz.com/blog/hybrid-search-with-milvus">de pesquisa híbridos</a> de produção separam o armazenamento da recuperação. Mantém-se os dados brutos num local durável e, em seguida, recupera-se apenas a parte que importa.</p>
<h2 id="code-review-graph-maps-code-structure-before-Claude-navigates-it" class="common-anchor-header">O `code-review-graph` mapeia a estrutura do código antes de o Claude a percorrer<button data-href="#code-review-graph-maps-code-structure-before-Claude-navigates-it" class="anchor-icon" translate="no">
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
    </button></h2><p>O `code-review-graph` aborda um problema diferente: o Claude nem sempre precisa de mais texto; precisa de um mapa melhor.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_8_6d4632f3c9.png" alt="code-review-graph logo image used in the original article" class="doc-image" id="code-review-graph-logo-image-used-in-the-original-article" /> 
   <span>Imagem do logótipo do code-review-graph utilizada no artigo original</span>
  
 </span></p>
<p>Num repositório de grandes dimensões, uma pergunta simples pode desencadear uma exploração dispendiosa:</p>
<blockquote>
<p>Depois de alterar esta lógica de início de sessão, que ficheiros e testes são afetados?</p>
</blockquote>
<p>Sem um gráfico de código, o procedimento típico do Claude é:</p>
<pre><code translate="no" class="language-perl"><span class="hljs-built_in">read</span> auth.ts
grep login
<span class="hljs-built_in">read</span> middleware
<span class="hljs-built_in">read</span> tests
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>O code-review-graph cria previamente um mapa estrutural da base de código. Utiliza o Tree-sitter para analisar funções, classes, importações, relações de chamada, herança e dependências de testes, e depois grava o gráfico no SQLite.</p>
<p>Isso torna-o útil para a revisão de código e a análise do «raio de impacto». Em vez de pedir ao Claude para redescobrir o gráfico de dependências através de leituras repetidas, permite-se que ele consulte a estrutura primeiro.</p>
<p>Isto é semelhante à <a href="https://zilliz.com/blog/semantic-search-vs-lexical-search-vs-full-text-search">pesquisa semântica</a>, mas não é idêntico. Um gráfico estrutural responde à pergunta «o que depende de quê?». A recuperação semântica responde à pergunta «que código está conceptualmente relacionado com esta questão?». Em fluxos de trabalho reais com assistentes de código, muitas vezes são necessários ambos.</p>
<h2 id="Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="common-anchor-header">O Token Savior fornece resumos de símbolos ao Claude antes dos ficheiros completos<button data-href="#Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="anchor-icon" translate="no">
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
    </button></h2><p>A ideia central do Token Savior é simples: não enviar o ficheiro completo por predefinição. Enviar primeiro um índice ou um resumo de símbolos e, só depois, expandir quando a tarefa necessitar de mais detalhes.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_10_5f63ad36d1.png" alt="Token Savior GitHub repository card showing its MCP server description and project statistics" class="doc-image" id="token-savior-github-repository-card-showing-its-mcp-server-description-and-project-statistics" /> 
   <span>Cartão do repositório GitHub do Token Savior a mostrar a descrição do servidor MCP e as estatísticas do projeto</span>
  
 </span></p>
<p>Se perguntar onde é tratado um webhook de pagamento, o modelo muitas vezes não precisa de todas as linhas de todos os ficheiros relacionados. Primeiro, precisa de saber se um ficheiro ou símbolo é relevante.</p>
<p>O Token Savior fornece código em camadas:</p>
<table>
<thead>
<tr><th>Camada</th><th>O que o Claude recebe</th><th>Quando se expande</th></tr>
</thead>
<tbody>
<tr><td>Resumo</td><td>Índice, nomes de símbolos e breves descrições.</td><td>Primeira resposta por predefinição.</td></tr>
<tr><td>Fragmento</td><td>Uma secção de código mais curta em torno do símbolo relevante.</td><td>Quando o resumo for provavelmente relevante.</td></tr>
<tr><td>Ficheiro completo</td><td>O conteúdo completo do ficheiro.</td><td>Apenas quando a edição ou o raciocínio aprofundado assim o exigirem.</td></tr>
</tbody>
</table>
<p>Isto reflete a forma como os programadores realmente lêem o código. Faz-se uma análise rápida, confirma-se a relevância e, só então, abre-se o ficheiro completo quando necessário. Também se assemelha ao padrão de recuperação progressiva utilizado em <a href="https://zilliz.com/blog/metadata-filtering-hybrid-search-or-agent-in-rag-applications">aplicações RAG</a>: recuperar informação de forma suficientemente abrangente para se orientar e, em seguida, restringir o contexto antes da geração.</p>
<h2 id="Caveman-reduces-Claudes-own-response-bloat" class="common-anchor-header">O Caveman reduz o excesso de respostas do próprio Claude<button data-href="#Caveman-reduces-Claudes-own-response-bloat" class="anchor-icon" translate="no">
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
    </button></h2><p>A maioria das ferramentas de contexto concentra-se no que entra no modelo. O Caveman centra-se no que o Claude produz.</p>
<p>O Caveman é uma funcionalidade/plug-in do Claude Code que elimina preenchimentos, formalidades, frases de enfeite, explicações excessivas e estruturas repetitivas. O objetivo não é remover conhecimento; é tornar a resposta mais concisa.</p>
<p>Sem o Caveman:</p>
<blockquote>
<p>A razão pela qual o teu componente React está a ser renderizado novamente é provavelmente porque…</p>
</blockquote>
<p>Com o Caveman:</p>
<blockquote>
<p>Nova referência de objeto a cada renderização. Prop de objeto inline = nova referência = nova renderização. Envolver em useMemo.</p>
</blockquote>
<p>Isto é importante porque as próprias respostas do Claude tornam-se contexto futuro. Se cada resposta incluir uma explicação longa, a próxima ronda começa com mais texto do que o necessário. Respostas mais curtas podem melhorar a próxima ronda tanto quanto melhoram a atual.</p>
<p>Para equipas que estão a pensar em <a href="https://zilliz.com/blog/context-engineering-for-ai-agents">engenharia de contexto para agentes de IA</a>, o Caveman serve como lembrete de que a política de saída faz parte da política de contexto.</p>
<h2 id="claude-context-adds-semantic-code-search-through-MCP" class="common-anchor-header">O claude-context adiciona pesquisa semântica de código através do MCP<button data-href="#claude-context-adds-semantic-code-search-through-MCP" class="anchor-icon" translate="no">
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
    </button></h2><p>O claude-context resolve o problema da exploração repetida da base de código com a recuperação semântica. Indexa um repositório, armazena fragmentos de código numa base de dados vetorial e disponibiliza a pesquisa através do <a href="https://zilliz.com/glossary/model-context-protocol-%28mcp%29">Model Context Protocol</a>.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_2_a0cc547fe3.png" alt="Claude Context repository shown on GitHub Trending in the original article" class="doc-image" id="claude-context-repository-shown-on-github-trending-in-the-original-article" /> 
   <span>Repositório do Claude Context apresentado no GitHub Trending no artigo original</span>
  
 </span></p>
<p>Numa base de código grande, faz-se constantemente perguntas ao Claude como:</p>
<blockquote>
<p>Ajuda-me a descobrir quais as partes do código que podem estar relacionadas com este bug.</p>
</blockquote>
<p>Sem uma camada de recuperação, a abordagem padrão do Claude é frequentemente:</p>
<pre><code translate="no" class="language-perl">list the directory
grep around
<span class="hljs-built_in">read</span> a bunch of files
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>O claude-context transfere esse trabalho para uma camada de recuperação. Divide o repositório em fragmentos, gera embeddings, armazena-os num <a href="https://milvus.io/blog/claude-context-reduce-claude-code-token-usage.md">índice de código suportado pelo Milvus</a> e recupera fragmentos de código relevantes antes de o modelo começar a ler ficheiros aleatoriamente.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_11_f9d952830d.png" alt="claude-context flow showing codebase chunking, embeddings, vector database and hybrid search, relevant code retrieval, and Claude context injection" class="doc-image" id="claude-context-flow-showing-codebase-chunking,-embeddings,-vector-database-and-hybrid-search,-relevant-code-retrieval,-and-claude-context-injection" /> 
   <span>Fluxo do claude-context a mostrar a divisão da base de código em partes, representações, base de dados vetorial e pesquisa híbrida, recuperação de código relevante e injeção de contexto no Claude</span>
  
 </span></p>
<p>É aqui que as ferramentas de codificação com IA começam a assemelhar-se a sistemas de pesquisa. São necessários segmentação, embeddings, metadados, correspondência lexical, classificação e atualidade. Estes são os mesmos blocos de construção subjacentes <a href="https://zilliz.com/blog/top-10-context-engineering-techniques-you-should-know-for-production-rag">à recuperação RAG em produção</a>, <a href="https://milvus.io/blog/build-smarter-rag-routing-hybrid-retrieval.md">ao encaminhamento de recuperação híbrida</a> e <a href="https://milvus.io/blog/choose-embedding-model-rag-2026.md">à seleção de modelos de embedding</a>.</p>
<h2 id="memsearch-keeps-useful-memory-across-sessions-and-agents" class="common-anchor-header">O memsearch mantém a memória útil entre sessões e agentes<button data-href="#memsearch-keeps-useful-memory-across-sessions-and-agents" class="anchor-icon" translate="no">
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
    </button></h2><p>O memsearch aborda o lado oposto do problema: não o que esquecer, mas como recordar o que é importante.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_7_d39c2f200e.png" alt="memsearch logo image from the original article" class="doc-image" id="memsearch-logo-image-from-the-original-article" /> 
   <span>Imagem do logótipo do memsearch retirada do artigo original</span>
  
 </span></p>
<p>Imagine que diz ao Claude na segunda-feira:</p>
<blockquote>
<p>O nosso webhook não pode tentar novamente em caso de falha — os eventos com falha têm de ir para uma fila de mensagens perdidas.</p>
</blockquote>
<p>Na quarta-feira, abres uma nova sessão e perguntas:</p>
<blockquote>
<p>O que mais podemos otimizar na camada do webhook?</p>
</blockquote>
<p>Sem memória duradoura, o Claude trata a decisão de segunda-feira como se nunca tivesse acontecido. Explicas-lhe tudo de novo.</p>
<p>O memsearch armazena a memória como ficheiros Markdown locais e legíveis por humanos e utiliza o Milvus como um índice de recuperação reconstruível. Esse design mantém a memória editável por humanos, ao mesmo tempo que a torna pesquisável por agentes.</p>
<p>No momento da recuperação, o memsearch utiliza a recuperação progressiva: primeiro pesquisa, depois expande se necessário e, só então, aprofunda até à transcrição original quando for realmente necessário.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/20260507_210137_73d4b0b8ea.png" alt="memsearch progressive retrieval flow showing search, expand, transcript, and summarized return to the main conversation" class="doc-image" id="memsearch-progressive-retrieval-flow-showing-search,-expand,-transcript,-and-summarized-return-to-the-main-conversation" /> 
   <span>Fluxo de recuperação progressiva do memsearch, mostrando pesquisa, expansão, transcrição e retorno resumido à conversa principal</span>
  
 </span></p>
<p>Este padrão «Markdown-first» é útil para equipas que trabalham em várias sessões, modelos e agentes. Também se integra naturalmente com <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">a memória de longo prazo dos agentes de IA</a>, <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">a memória partilhada entre múltiplos agentes</a> e o problema mais amplo de prevenir <a href="https://zilliz.com/ai-faq/can-context-engineering-help-reduce-context-rot">a deterioração do contexto em sistemas de agentes</a>.</p>
<h2 id="How-do-these-tools-work-together" class="common-anchor-header">Como é que estas ferramentas funcionam em conjunto?<button data-href="#How-do-these-tools-work-together" class="anchor-icon" translate="no">
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
    </button></h2><p>As sete ferramentas são complementares, não intercambiáveis. Utilize-as como camadas.</p>
<table>
<thead>
<tr><th>Camada</th><th>Utilize estas ferramentas</th><th>Porquê</th></tr>
</thead>
<tbody>
<tr><td>Remover ruído de comando</td><td>RTK</td><td>Comprimir a saída de grande volume do terminal antes de chegar ao Claude.</td></tr>
<tr><td>Teste a saída bruta da ferramenta</td><td>Modo de contexto</td><td>Manter registos de grande dimensão, DOMs e cargas úteis das ferramentas fora da conversa principal.</td></tr>
<tr><td>Mapeamento da estrutura do código</td><td>gráfico-de-revisão-de-código</td><td>Responda a questões sobre dependências e alcance de impacto sem ter de ler ficheiros às cegas.</td></tr>
<tr><td>Leia o código progressivamente</td><td>Token Savior</td><td>Comece com resumos de símbolos e, em seguida, expanda apenas conforme necessário.</td></tr>
<tr><td>Comprimir as respostas do Claude</td><td>Caveman</td><td>Evite que a própria saída do modelo se torne um excesso de contexto futuro.</td></tr>
<tr><td>Recuperar código relevante</td><td>claude-context</td><td>Utilizar a pesquisa semântica e híbrida de código em vez de loops repetidos de grep.</td></tr>
<tr><td>Reutilize decisões duradouras</td><td>memsearch</td><td>Recuperar o histórico do projeto entre sessões, agentes e mudanças de modelo.</td></tr>
</tbody>
</table>
<p>Uma ordem prática de implementação é:</p>
<ol>
<li><strong>Elimine primeiro o ruído óbvio.</strong> Adicione o RTK ou o Modo de Contexto se a saída do shell e as cargas úteis das ferramentas dominarem o seu contexto.</li>
<li><strong>Corrija a navegação no repositório.</strong> Adicione o code-review-graph para a estrutura ou o claude-context para a recuperação semântica de código.</li>
<li><strong>Controle o que resta.</strong> Utilize o Token Savior e o Caveman para manter compactas as leituras de ficheiros e as respostas do modelo.</li>
<li><strong>Preserve o conhecimento duradouro.</strong> Utilize o memsearch quando as explicações repetidas se tornarem o gargalo.</li>
</ol>
<h2 id="Keep-in-touch" class="common-anchor-header">Mantenha-se em contacto<button data-href="#Keep-in-touch" class="anchor-icon" translate="no">
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
<li>Junte-se à <a href="https://discord.com/invite/8uyFbECzPX">comunidade Milvus no Discord</a> para fazer perguntas e comparar padrões de gestão de contexto com outros programadores.</li>
<li><a href="https://milvus.io/office-hours">Marque uma sessão gratuita do Milvus Office Hours</a> se precisar de ajuda a conceber uma camada de recuperação para cargas de trabalho de código, memória ou RAG.</li>
<li>Se preferir evitar a configuração da infraestrutura, <a href="https://cloud.zilliz.com/signup">o Zilliz Cloud</a> (Milvus gerido) oferece um plano gratuito para começar.</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Perguntas frequentes<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Como posso reduzir o uso de tokens do Claude Code sem perder contexto útil?</strong></p>
<p>Comece por comprimir as entradas mais ruidosas: saída do terminal, cargas úteis brutas das ferramentas e leituras repetidas de código. Em seguida, adicione ferramentas de recuperação, como o claude-context ou o code-review-graph, para que o Claude possa extrair código relevante em vez de explorar o repositório a partir do zero.</p>
<p><strong>Devo usar o claude-context ou o code-review-graph para um repositório grande?</strong></p>
<p>Utilize o claude-context quando precisar de uma pesquisa semântica de código, especialmente quando não souber o nome exato do ficheiro ou do símbolo. Utilize o code-review-graph quando precisar de respostas estruturais, tais como relações de chamadas, importações, dependências de teste e o âmbito da revisão.</p>
<p><strong>A recuperação de memória é diferente da recuperação de código no Claude Code?</strong></p>
<p>Sim. A recuperação de código encontra ficheiros ou símbolos relevantes do projeto. A recuperação de memória recorda decisões duradouras, preferências do utilizador, histórico de depuração e lições entre sessões. O memsearch centra-se na memória; o claude-context centra-se na recuperação de código.</p>
<p><strong>Estas ferramentas substituem o armazenamento em cache de prompts ou uma janela de contexto mais ampla?</strong></p>
<p>Não. O armazenamento em cache de prompts e as janelas de contexto amplas ajudam em termos de capacidade e custo, mas não determinam quais as informações que merecem atenção. As ferramentas de gestão de contexto melhoram, em primeiro lugar, a qualidade e a densidade do que entra no modelo. <span class="img-wrapper">

  
   <img translate="no" src="https://assets.zilliz.com/Chat_GPT_Image_Jun_22_2026_07_49_53_PM_11zon_d1a8de60bd.png" alt="cccm 11zon" class="doc-image" id="cccm-11zon" /> 
 <span>   cccm 11zon</span>
  
 </span></p>
