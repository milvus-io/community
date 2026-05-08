---
id: claude-code-context-management-tools.md
title: >-
  7 melhores ferramentas de código aberto para a gestão do contexto do código
  Claude
author: Cheney Zhang
date: 2026-5-7
cover: assets.zilliz.com/cccm_11zon_848f7f1c6b.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Claude Code context, Claude Code tools, token management, MCP code search, AI
  agent memory
meta_title: |
  7 Best Open-Source Tools for Claude Code Context Management
desc: >-
  Sessões longas de Claude Code perdem sinal rapidamente. Aprenda 7 ferramentas
  para reduzir o ruído do terminal, a recuperação de código, a saída de
  ferramentas, a memória e a utilização de tokens.
origin: 'https://milvus.io/blog/claude-code-context-management-tools.md'
---
<p>É possível dar ao Claude Code uma janela de contexto de 1 milhão de tokens e ainda assim obter respostas piores ao longo do tempo. O problema não é apenas o tamanho do contexto. É a qualidade do contexto.</p>
<p>As sessões do Claude Code se degradam quando os logs de terminal, a saída bruta da ferramenta, as leituras repetidas de arquivos, as respostas detalhadas e o histórico esquecido do projeto competem por atenção. Em fluxos de trabalho de agentes de longa duração, esse ruído transforma-se num ciclo: o modelo perde o fio à meada, são acrescentadas mais voltas para corrigir a resposta, e essas voltas extra acrescentam ainda mais ruído.</p>
<p>Isto é a <strong>desfocagem do contexto</strong>: o modelo tem espaço suficiente para guardar informação, mas a informação importante está enterrada num contexto de baixo sinal. Janelas maiores podem tornar isto mais fácil de ignorar porque os programadores deixam de pensar cuidadosamente sobre o que entra no prompt.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_13_3e7a004cd6.png" alt="Prompt caching diagram showing how reused prefixes can still add billed context across turns" class="doc-image" id="prompt-caching-diagram-showing-how-reused-prefixes-can-still-add-billed-context-across-turns" />
   </span> <span class="img-wrapper"> <span>Diagrama de cache de prompts mostrando como prefixos reutilizados ainda podem adicionar contexto faturado entre turnos</span> </span></p>
<p>O caching de prompts pode reduzir o custo de prefixos repetidos, mas não transforma a janela de contexto numa gaveta de lixo. Continua a pagar por novos tokens e continua a precisar do modelo para raciocinar sobre a informação correta.</p>
<p>Este artigo analisa sete ferramentas de código aberto que atacam a desfocagem do contexto a partir de diferentes camadas: saída do terminal, saída da ferramenta, navegação na base de código, leitura de ficheiros, verbosidade do modelo, recuperação semântica de código e memória entre sessões. Também explica como estas ideias se aplicam à conceção de <a href="https://zilliz.com/learn/what-is-vector-database">bases de dados vectoriais</a>, à <a href="https://zilliz.com/learn/vector-similarity-search">pesquisa de semelhanças vectoriais</a> e a sistemas de recuperação como o Milvus.</p>
<h2 id="What-causes-Claude-Code-context-defocus" class="common-anchor-header">O que causa a desfocagem do contexto do código Claude?<button data-href="#What-causes-Claude-Code-context-defocus" class="anchor-icon" translate="no">
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
    </button></h2><p>A desfocagem do contexto do Claude Code geralmente vem de cinco modos de falha: muito texto de instrução bruto, saída de ferramenta ruidosa, exploração repetida da base de código, respostas de modelo longas e lacunas de memória entre sessões ou agentes.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_15_56a2da172a.png" alt="Five causes of Claude Code context loss: redundant instructions, messy tool output, repeated codebase retrieval, long responses, and memory gaps" class="doc-image" id="five-causes-of-claude-code-context-loss:-redundant-instructions,-messy-tool-output,-repeated-codebase-retrieval,-long-responses,-and-memory-gaps" />
   </span> <span class="img-wrapper"> <span>Cinco causas da perda de contexto do código Claude: instruções redundantes, saída de ferramenta confusa, recuperação repetida da base de código, respostas longas e falhas de memória</span> </span></p>
<table>
<thead>
<tr><th>Modo de falha de contexto</th><th>O que parece no Código Claude</th><th>Categoria de ferramenta que ajuda</th></tr>
</thead>
<tbody>
<tr><td>Os registos do terminal são ruidosos</td><td><code translate="no">git</code>, <code translate="no">pytest</code>, <code translate="no">gh</code>, e CLIs em nuvem despejam mais texto do que o modelo precisa.</td><td>Compressão de saída da CLI</td></tr>
<tr><td>As saídas de ferramentas inundam a janela</td><td>Os registos de teste, os despejos DOM e as saídas MCP entram no chat como blocos brutos gigantes.</td><td>Caixa de areia de saída de ferramenta</td></tr>
<tr><td>A navegação na base de código repete-se</td><td>O Claude lista diretórios, pesquisa, lê ficheiros e repete a mesma exploração em todas as sessões.</td><td>Gráfico de código ou recuperação semântica</td></tr>
<tr><td>As leituras de ficheiros são demasiado amplas</td><td>O modelo lê um ficheiro inteiro quando só precisa de um símbolo ou resumo.</td><td>Leitura progressiva de código</td></tr>
<tr><td>O Claude fala demasiado</td><td>A resposta em si acrescenta um contexto desnecessário para as próximas rondas.</td><td>Compressão de respostas</td></tr>
<tr><td>A memória não persiste</td><td>Explicar novamente as decisões do projeto sempre que se inicia uma nova sessão.</td><td>Memória Markdown-first</td></tr>
</tbody>
</table>
<p>Uma boa pilha de gestão de contexto deve fazer três coisas: manter o lixo fora, recuperar o conhecimento correto do projeto a pedido e preservar decisões duradouras ao longo das sessões.</p>
<h2 id="Which-Claude-Code-context-tool-should-you-use-first" class="common-anchor-header">Qual ferramenta de contexto do Claude Code você deve usar primeiro?<button data-href="#Which-Claude-Code-context-tool-should-you-use-first" class="anchor-icon" translate="no">
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
    </button></h2><p>Comece com a camada que cria mais ruído no seu fluxo de trabalho. Se o problema for a saída do terminal, comece com o RTK. Se o Claude fica vagando por um grande repositório, comece com claude-context ou code-review-graph. Se o seu verdadeiro problema é voltar a explicar as mesmas decisões todos os dias, comece com memsearch.</p>
<table>
<thead>
<tr><th>Ferramenta</th><th>Principal problema que resolve</th><th>Melhor ajuste</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/rtk-ai/rtk">RTK</a></td><td>Saída de terminal ruidosa de comandos comuns do desenvolvedor.</td><td>Desenvolvedores que executam muitos comandos CLI dentro do código Claude.</td></tr>
<tr><td><a href="https://github.com/mksglu/context-mode">Modo de contexto</a></td><td>Saídas massivas de ferramentas brutas que entram na conversa principal.</td><td>Utilizadores intensivos do Playwright, GitHub, log ou MCP-tool.</td></tr>
<tr><td><a href="https://github.com/tirth8205/code-review-graph">gráfico de revisão de código</a></td><td>Exploração cega da base de código em grandes repositórios.</td><td>Revisões, análise de dependência e perguntas de raio de explosão.</td></tr>
<tr><td><a href="https://github.com/Mibayy/token-savior">Salvador de símbolos</a></td><td>Leituras completas de ficheiros quando um resumo de símbolos seria suficiente.</td><td>Ficheiros grandes, pesquisas repetidas de símbolos e leitura incremental de código.</td></tr>
<tr><td><a href="https://github.com/JuliusBrussee/caveman">Homem das cavernas</a></td><td>Os hábitos de resposta verbosa do próprio Claude.</td><td>Utilizadores que querem uma saída concisa e um contexto futuro mais pequeno.</td></tr>
<tr><td><a href="https://github.com/zilliztech/claude-context">claude-contexto</a></td><td>Explorar novamente a base de código a cada sessão.</td><td>Pesquisa semântica de código através do MCP.</td></tr>
<tr><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>Perder a memória do projeto através de sessões, agentes e trocas de modelos.</td><td>Projetos de longa duração com decisões e lições duradouras.</td></tr>
</tbody>
</table>
<p>As primeiras cinco ferramentas reduzem o que entra ou permanece no contexto. As duas últimas tornam o contexto útil mais fácil de lembrar.</p>
<h2 id="RTK-compresses-raw-command-output-before-Claude-sees-it" class="common-anchor-header">RTK comprime a saída de comando bruta antes que o Claude a veja<button data-href="#RTK-compresses-raw-command-output-before-Claude-sees-it" class="anchor-icon" translate="no">
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
<p>RTK é um proxy CLI para reduzir o uso de tokens de comandos comuns do desenvolvedor. Sua descrição no GitHub diz que ele reduz o consumo de tokens LLM em 60-90% em comandos comuns de desenvolvimento, e é enviado como um único binário Rust.</p>
<p>No uso diário do Claude Code, comandos como <code translate="no">git status</code>, <code translate="no">pytest</code>, e listagens de diretórios frequentemente despejam informações completas de ambiente e descrições de status na janela de contexto. O modelo geralmente precisa apenas de uma resposta menor: quais arquivos mudaram, qual teste falhou, onde o PR está preso, ou quais arquivos chave existem no diretório.</p>
<p>O RTK fica entre o shell e o Claude. Ele pode reescrever comandos através de hooks do código do Claude e passar de volta a saída comprimida.</p>
<p>Saída bruta <code translate="no">git status</code>:</p>
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
<p>A mesma história com <code translate="no">pytest</code>. A saída bruta está cheia de casos de passagem e ruído ambiental:</p>
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
<p>Comprimido, o sinal é imediato:</p>
<pre><code translate="no" class="language-apache">128 tests collected, 1 failed
FAIL tests/test_webhook.py::test_retry_to_dlq
AssertionError: expected status code 202, got 500
<button class="copy-code-btn"></button></code></pre>
<p>RTK é o ponto de partida mais fácil quando o inchaço do contexto vem de comandos da shell em vez de recuperação de código.</p>
<h2 id="Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="common-anchor-header">O Modo de Contexto coloca as saídas de ferramentas gigantes fora do chat principal<button data-href="#Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="anchor-icon" translate="no">
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
    </button></h2><p>O Context Mode é construído para os blocos brutos que as ferramentas retornam: logs de teste, snapshots DOM do navegador, payloads do GitHub, saída da ferramenta MCP e páginas raspadas. Sua descrição no GitHub destaca a otimização da janela de contexto para agentes de codificação de IA e relata uma redução de 98% na saída de ferramentas.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_5_f00e17ea6f.png" alt="Context Mode GitHub repository card showing sandboxed tool output and context optimization positioning" class="doc-image" id="context-mode-github-repository-card-showing-sandboxed-tool-output-and-context-optimization-positioning" />
   </span> <span class="img-wrapper"> <span>Cartão do repositório GitHub do Modo de Contexto mostrando a saída da ferramenta em sandbox e o posicionamento da otimização do contexto</span> </span></p>
<p>A sua abordagem consiste em isolar as grandes saídas de ferramentas numa caixa de areia local e num índice, passando depois apenas resumos e identificadores de recuperação para a conversa Claude.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_12_32e50fec44.png" alt="Context Mode flow showing large tool output moving through sandbox execution, SQLite or FTS indexes, summaries, and retrieval results" class="doc-image" id="context-mode-flow-showing-large-tool-output-moving-through-sandbox-execution,-sqlite-or-fts-indexes,-summaries,-and-retrieval-results" />
   </span> <span class="img-wrapper"> <span>Fluxo do Modo de Contexto mostrando a saída de ferramentas grandes passando pela execução da sandbox, índices SQLite ou FTS, resumos e resultados de recuperação</span> </span></p>
<p>O fluxo é útil porque um agente de codificação geralmente precisa do nó com falha, do seletor quebrado ou do rastreamento de pilha relevante, não de todo o DOM ou de todas as linhas de teste aprovadas. O Modo de contexto mantém a saída completa disponível localmente, evitando que ela domine a conversa principal.</p>
<p>Isso é semelhante a como os sistemas <a href="https://zilliz.com/blog/hybrid-search-with-milvus">de pesquisa híbridos</a> de produção separam o armazenamento da recuperação. Mantém os dados em bruto num local durável e depois recupera apenas a parte que interessa.</p>
<h2 id="code-review-graph-maps-code-structure-before-Claude-navigates-it" class="common-anchor-header">code-review-graph mapeia a estrutura do código antes que Claude navegue por ele<button data-href="#code-review-graph-maps-code-structure-before-Claude-navigates-it" class="anchor-icon" translate="no">
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
    </button></h2><p>O code-review-graph aborda um problema diferente: o Claude nem sempre precisa de mais texto; precisa de um mapa melhor.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_8_6d4632f3c9.png" alt="code-review-graph logo image used in the original article" class="doc-image" id="code-review-graph-logo-image-used-in-the-original-article" />
   </span> <span class="img-wrapper"> <span>Imagem do logótipo do code-review-graph usada no artigo original</span> </span></p>
<p>Num repositório grande, uma simples pergunta pode desencadear uma exploração dispendiosa:</p>
<blockquote>
<p>Depois de alterar esta lógica de início de sessão, que ficheiros e testes são afectados?</p>
</blockquote>
<p>Sem um gráfico de código, o movimento típico do Claude é:</p>
<pre><code translate="no" class="language-perl"><span class="hljs-built_in">read</span> auth.ts
grep login
<span class="hljs-built_in">read</span> middleware
<span class="hljs-built_in">read</span> tests
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>code-review-graph pré-constrói um mapa estrutural da base de código. Ele usa o Tree-sitter para analisar funções, classes, importações, relacionamentos de chamada, herança e dependências de teste, e então escreve o gráfico no SQLite.</p>
<p>Isso torna-o útil para revisão de código e análise de raio de explosão. Em vez de pedir ao Claude para redescobrir o gráfico de dependências por meio de leituras repetidas, você permite que ele consulte a estrutura primeiro.</p>
<p>Isso é adjacente à <a href="https://zilliz.com/blog/semantic-search-vs-lexical-search-vs-full-text-search">pesquisa semântica</a>, mas não é idêntico. Um gráfico estrutural responde "o que depende do quê?". A recuperação semântica responde a "que código está concetualmente relacionado com esta questão?" Em fluxos de trabalho reais de assistente de código, é frequente querer ambos.</p>
<h2 id="Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="common-anchor-header">O Token Savior dá ao Claude resumos de símbolos antes de ficheiros completos<button data-href="#Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="anchor-icon" translate="no">
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
    </button></h2><p>A ideia central do Token Savior é simples: não enviar o ficheiro completo por defeito. Envie primeiro um índice ou um resumo do símbolo e, em seguida, expanda apenas quando a tarefa precisar de mais detalhes.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_10_5f63ad36d1.png" alt="Token Savior GitHub repository card showing its MCP server description and project statistics" class="doc-image" id="token-savior-github-repository-card-showing-its-mcp-server-description-and-project-statistics" />
   </span> <span class="img-wrapper"> <span>Cartão do repositório GitHub do Token Savior mostrando a descrição do servidor MCP e as estatísticas do projeto</span> </span></p>
<p>Se você perguntar onde um webhook de pagamento é tratado, o modelo geralmente não precisa de todas as linhas de cada arquivo relacionado. Primeiro, precisa de saber se um ficheiro ou símbolo é relevante.</p>
<p>O Token Savior serve o código em camadas:</p>
<table>
<thead>
<tr><th>Camada</th><th>O que o Claude recebe</th><th>Quando se expande</th></tr>
</thead>
<tbody>
<tr><td>Resumo</td><td>Índice, nomes de símbolos e descrições curtas.</td><td>Primeira resposta por defeito.</td></tr>
<tr><td>Snippet</td><td>Uma secção de código mais pequena à volta do símbolo relevante.</td><td>Quando o resumo é provavelmente relevante.</td></tr>
<tr><td>Ficheiro completo</td><td>O conteúdo completo do ficheiro.</td><td>Apenas quando a edição ou o raciocínio profundo o exigem.</td></tr>
</tbody>
</table>
<p>Isto reflecte a forma como os programadores lêem realmente o código. Analisa-se, confirma-se a relevância e, em seguida, abre-se o ficheiro completo apenas quando necessário. Também se assemelha ao padrão de recuperação progressiva utilizado nas <a href="https://zilliz.com/blog/metadata-filtering-hybrid-search-or-agent-in-rag-applications">aplicações RAG</a>: recupera o suficiente para se orientar, depois limita o contexto antes da geração.</p>
<h2 id="Caveman-reduces-Claudes-own-response-bloat" class="common-anchor-header">O Caveman reduz o inchaço das respostas do próprio Claude<button data-href="#Caveman-reduces-Claudes-own-response-bloat" class="anchor-icon" translate="no">
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
    </button></h2><p>A maioria das ferramentas de contexto concentra-se no que entra no modelo. O Caveman tem como alvo o que o Claude gera.</p>
<p>O Caveman é uma habilidade/plugin do código do Claude que elimina o preenchimento, as gentilezas, as frases de apoio, a explicação excessiva e as estruturas repetitivas. O objetivo não é remover o conhecimento; é tornar a resposta mais densa.</p>
<p>Sem o Caveman:</p>
<blockquote>
<p>A razão pela qual seu componente React está sendo renderizado novamente é provavelmente porque...</p>
</blockquote>
<p>Com Caveman:</p>
<blockquote>
<p>Novo objeto ref a cada renderização. Objeto inline prop = new ref = re-render. Envolvimento em useMemo.</p>
</blockquote>
<p>Isso é importante porque as próprias respostas do Claude se tornam um contexto futuro. Se cada resposta incluir uma longa explicação, a próxima jogada começa com mais texto do que precisa. Respostas mais curtas podem melhorar a próxima jogada tanto quanto melhoram a atual.</p>
<p>Para as equipas que pensam em <a href="https://zilliz.com/blog/context-engineering-for-ai-agents">engenharia de contexto para agentes de IA</a>, o Caveman é um lembrete de que a política de saída faz parte da política de contexto.</p>
<h2 id="claude-context-adds-semantic-code-search-through-MCP" class="common-anchor-header">claude-context adiciona pesquisa de código semântico através de MCP<button data-href="#claude-context-adds-semantic-code-search-through-MCP" class="anchor-icon" translate="no">
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
    </button></h2><p>O claude-context resolve o problema da exploração repetida de bases de código com a recuperação semântica. Ele indexa um repositório, armazena pedaços de código em um banco de dados vetorial e expõe a pesquisa por meio do <a href="https://zilliz.com/glossary/model-context-protocol-%28mcp%29">Protocolo de Contexto de Modelo</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_2_a0cc547fe3.png" alt="Claude Context repository shown on GitHub Trending in the original article" class="doc-image" id="claude-context-repository-shown-on-github-trending-in-the-original-article" />
   </span> <span class="img-wrapper"> <span>Repositório Claude Context mostrado no GitHub Tendência no artigo original</span> </span></p>
<p>Em uma grande base de código, você constantemente faz perguntas ao Claude como:</p>
<blockquote>
<p>Ajude-me a descobrir quais partes do código podem estar relacionadas a esse bug.</p>
</blockquote>
<p>Sem uma camada de recuperação, a abordagem padrão do Claude é frequentemente:</p>
<pre><code translate="no" class="language-perl">list the directory
grep around
<span class="hljs-built_in">read</span> a bunch of files
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>claude-context move esse trabalho para uma camada de recuperação. Ele divide o repositório em pedaços, gera embeddings, armazena-os em um <a href="https://milvus.io/blog/claude-context-reduce-claude-code-token-usage.md">índice de código apoiado pelo Milvus</a> e recupera pedaços de código relevantes antes que o modelo comece a ler arquivos cegamente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_11_f9d952830d.png" alt="claude-context flow showing codebase chunking, embeddings, vector database and hybrid search, relevant code retrieval, and Claude context injection" class="doc-image" id="claude-context-flow-showing-codebase-chunking,-embeddings,-vector-database-and-hybrid-search,-relevant-code-retrieval,-and-claude-context-injection" />
   </span> <span class="img-wrapper"> <span>fluxo claude-contexto que mostra a fragmentação da base de código, os embeddings, a base de dados vetorial e a pesquisa híbrida, a recuperação de código relevante e a injeção de contexto Claude</span> </span></p>
<p>É aqui que as ferramentas de codificação de IA começam a parecer-se com sistemas de pesquisa. São necessários chunking, embeddings, metadados, correspondência lexical, classificação e frescura. Estes são os mesmos blocos de construção por detrás da <a href="https://zilliz.com/blog/top-10-context-engineering-techniques-you-should-know-for-production-rag">recuperação RAG de produção</a>, do <a href="https://milvus.io/blog/build-smarter-rag-routing-hybrid-retrieval.md">encaminhamento de recuperação híbrida</a> e da <a href="https://milvus.io/blog/choose-embedding-model-rag-2026.md">seleção de modelos de incorporação</a>.</p>
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
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_7_d39c2f200e.png" alt="memsearch logo image from the original article" class="doc-image" id="memsearch-logo-image-from-the-original-article" />
   </span> <span class="img-wrapper"> <span>Imagem do logótipo do memsearch retirada do artigo original</span> </span></p>
<p>Imagine que você diz ao Claude na segunda-feira:</p>
<blockquote>
<p>O nosso webhook não pode tentar novamente em caso de falha - os eventos falhados têm de ir para uma fila de letra morta.</p>
</blockquote>
<p>Na quarta-feira, abre uma nova sessão e pergunta:</p>
<blockquote>
<p>O que mais podemos otimizar na camada do webhook?</p>
</blockquote>
<p>Sem memória durável, Claude trata a decisão de segunda-feira como se ela nunca tivesse acontecido. Você explica novamente.</p>
<p>O memsearch armazena a memória como ficheiros Markdown locais e legíveis por humanos e utiliza o Milvus como um índice de recuperação reconstruível. Esse design mantém a memória editável por humanos enquanto ainda a torna pesquisável por agentes.</p>
<p>No momento da recuperação, o memsearch utiliza a recuperação progressiva: pesquisa primeiro, expande se necessário e, em seguida, pesquisa a transcrição original apenas quando necessário.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20260507_210137_73d4b0b8ea.png" alt="memsearch progressive retrieval flow showing search, expand, transcript, and summarized return to the main conversation" class="doc-image" id="memsearch-progressive-retrieval-flow-showing-search,-expand,-transcript,-and-summarized-return-to-the-main-conversation" />
   </span> <span class="img-wrapper"> <span>Fluxo de recuperação progressiva do memsearch mostrando pesquisa, expansão, transcrição e retorno resumido à conversa principal</span> </span></p>
<p>Este padrão Markdown-first é útil para equipas que trabalham em sessões, modelos e agentes. Também se conjuga naturalmente com a <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">memória de longo prazo dos agentes de IA</a>, com a <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">memória partilhada de vários agentes</a> e com o problema mais vasto de evitar a <a href="https://zilliz.com/ai-faq/can-context-engineering-help-reduce-context-rot">podridão do contexto nos sistemas de agentes</a>.</p>
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
<tr><th>Camada</th><th>Utilizar estas ferramentas</th><th>Porquê</th></tr>
</thead>
<tbody>
<tr><td>Remover o ruído de comando</td><td>RTK</td><td>Comprimir a saída de terminais de grande volume antes que ela chegue ao Claude.</td></tr>
<tr><td>Saída de ferramenta bruta de sandbox</td><td>Modo de contexto</td><td>Mantém grandes logs, DOMs e payloads de ferramentas fora da conversa principal.</td></tr>
<tr><td>Mapear a estrutura do código</td><td>gráfico de revisão de código</td><td>Responder a questões de dependência e de raio de explosão sem leituras cegas de ficheiros.</td></tr>
<tr><td>Ler código progressivamente</td><td>Salvador de símbolos</td><td>Comece com resumos de símbolos e depois expanda apenas quando necessário.</td></tr>
<tr><td>Comprimir as respostas do Claude</td><td>Homem das cavernas</td><td>Evitar que a própria saída do modelo se torne um inchaço de contexto futuro.</td></tr>
<tr><td>Recuperar código relevante</td><td>claude-contexto</td><td>Usar pesquisa de código semântica e híbrida em vez de loops grep repetidos.</td></tr>
<tr><td>Reutilizar decisões duradouras</td><td>memsearch</td><td>Recuperar o histórico do projeto através de sessões, agentes e mudanças de modelo.</td></tr>
</tbody>
</table>
<p>Uma ordem prática de implementação é:</p>
<ol>
<li><strong>Eliminar primeiro o ruído óbvio.</strong> Adicionar RTK ou Modo Contexto se a saída do shell e as cargas úteis da ferramenta dominarem seu contexto.</li>
<li><strong>Corrigir a navegação do repositório.</strong> Adicionar code-review-graph para estrutura ou claude-context para recuperação semântica de código.</li>
<li><strong>Controle o que resta.</strong> Use Token Savior e Caveman para manter as leituras de arquivos e respostas de modelos compactas.</li>
<li><strong>Preservar o conhecimento duradouro.</strong> Use memsearch quando explicações repetidas se tornarem o gargalo.</li>
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
<li>Junte-se à <a href="https://discord.com/invite/8uyFbECzPX">comunidade Milvus Discord</a> para fazer perguntas e comparar padrões de gestão de contexto com outros programadores.</li>
<li><a href="https://milvus.io/office-hours">Reserve uma sessão gratuita do Milvus Office Hours</a> se quiser ajuda para conceber uma camada de recuperação para código, memória ou cargas de trabalho RAG.</li>
<li>Se preferir ignorar a configuração da infraestrutura, <a href="https://cloud.zilliz.com/signup">o Zilliz Cloud</a> (Milvus gerido) oferece um nível gratuito para começar.</li>
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
    </button></h2><p><strong>Como posso reduzir o uso do token do Claude Code sem perder o contexto útil?</strong></p>
<p>Comece compactando as entradas mais ruidosas: saída de terminal, cargas úteis de ferramentas brutas e leituras de código repetidas. Em seguida, adicione ferramentas de recuperação, como claude-context ou code-review-graph, para que o Claude possa extrair o código relevante em vez de explorar o repositório do zero.</p>
<p><strong>Devo usar claude-context ou code-review-graph para um repositório grande?</strong></p>
<p>Use claude-context quando precisar de pesquisa semântica de código, especialmente quando não souber o nome exato do arquivo ou símbolo. Utilize o gráfico de revisão de código quando precisar de respostas estruturais, como relações de chamada, importações, dependências de teste e raio de explosão de revisão.</p>
<p><strong>A memória é diferente da recuperação de código no Claude Code?</strong></p>
<p>Sim. A recuperação de código encontra ficheiros de projeto ou símbolos relevantes. A recuperação de memória relembra decisões duradouras, preferências do utilizador, histórico de depuração e lições entre sessões. memsearch centra-se na memória; claude-context centra-se na recuperação de código.</p>
<p><strong>Essas ferramentas substituem o cache de prompt ou uma janela de contexto maior?</strong></p>
<p>Não. O armazenamento em cache de avisos e as janelas de contexto grandes ajudam na capacidade e no custo, mas não decidem quais informações merecem atenção. As ferramentas de gestão de contexto melhoram a qualidade e a densidade do que entra no modelo em primeiro lugar. <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/cccm_11zon_848f7f1c6b.png" alt="cccm 11zon" class="doc-image" id="cccm-11zon" /><span>cccm 11zon</span> </span></p>
