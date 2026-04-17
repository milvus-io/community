---
id: >-
  hands-on-tutorial-build-your-own-coding-copilot-with-qwen3-coder-qwen-code-and-code-context.md
title: >-
  Tutorial prático: Construa seu próprio copiloto de codificação com
  Qwen3-Coder, Qwen Code e Code Context
author: Lumina Wang
date: 2025-07-29T00:00:00.000Z
desc: >-
  Aprenda a criar seu próprio copiloto de codificação de IA usando o
  Qwen3-Coder, o Qwen Code CLI e o plug-in Code Context para uma compreensão
  semântica profunda do código.
cover: assets.zilliz.com/_9dfadf5877.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Qwen3 Code, Qwen3, Cursor, Code Context, Code Search'
meta_title: |
  Build a Coding Copilot with Qwen3-Coder & Code Context
origin: >-
  https://milvus.io/blog/hands-on-tutorial-build-your-own-coding-copilot-with-qwen3-coder-qwen-code-and-code-context.md
---
<p>O campo de batalha dos assistentes de codificação com IA está a aquecer rapidamente. Vimos <a href="https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md#Claude-Code-or-Gemini-CLI-Choose-Your-Co-Pilot-Wisely">o Claude Code</a> da Anthropic a fazer ondas, o <a href="https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md#Claude-Code-or-Gemini-CLI-Choose-Your-Co-Pilot-Wisely">Gemini CLI</a> da Google a agitar os fluxos de trabalho dos terminais, o Codex da OpenAI a alimentar o GitHub Copilot, o Cursor a conquistar os utilizadores do VS Code e <strong>agora o Alibaba Cloud entra com o Qwen Code.</strong></p>
<p>Honestamente, estas são óptimas notícias para os programadores. Mais jogadores significam melhores ferramentas, recursos inovadores e, o mais importante, <strong>alternativas de código aberto</strong> para soluções proprietárias caras. Vamos aprender o que este último jogador traz para a mesa.</p>
<h2 id="Meet-Qwen3-Coder-and-Qwen-Code" class="common-anchor-header">Conheça o Qwen3-Coder e o Qwen Code<button data-href="#Meet-Qwen3-Coder-and-Qwen-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>A Alibaba Cloud lançou recentemente<a href="https://github.com/QwenLM/Qwen3-Coder"> <strong>o Qwen3-Coder</strong></a>, um modelo de codificação agêntica de código aberto que alcança resultados de última geração em vários benchmarks. Também lançaram<a href="https://github.com/QwenLM/qwen-code"> <strong>o Qwen Code</strong></a>, uma ferramenta CLI de codificação de IA de código aberto criada no Gemini CLI, mas aprimorada com analisadores especializados para o Qwen3-Coder.</p>
<p>O modelo principal, <strong>Qwen3-Coder-480B-A35B-Instruct</strong>, oferece recursos impressionantes: suporte nativo para 358 linguagens de programação, janela de contexto de 256K tokens (expansível para 1M tokens via YaRN) e integração perfeita com Claude Code, Cline e outros assistentes de codificação.</p>
<h2 id="The-Universal-Blind-Spot-in-Modern-AI-Coding-Copilots" class="common-anchor-header">O ponto cego universal nos copilotos modernos de codificação de IA<button data-href="#The-Universal-Blind-Spot-in-Modern-AI-Coding-Copilots" class="anchor-icon" translate="no">
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
    </button></h2><p>Embora o Qwen3-Coder seja poderoso, estou mais interessado no seu assistente de codificação: <strong>Código Qwen</strong>. Eis o que achei interessante. Apesar de toda a inovação, o Qwen Code partilha exatamente a mesma limitação que o Claude Code e o Gemini CLI: <strong><em>são óptimos a gerar código novo, mas têm dificuldade em compreender as bases de código existentes.</em></strong></p>
<p>Veja este exemplo: pede-se ao Gemini CLI ou ao Qwen Code para "encontrar onde este projeto lida com a autenticação do utilizador". A ferramenta começa a procurar por palavras-chave óbvias como "login" ou "password", mas perde completamente essa função crítica <code translate="no">verifyCredentials()</code>. A menos que você esteja disposto a queimar tokens alimentando toda a sua base de código como contexto - o que é caro e demorado - essas ferramentas atingem uma barreira muito rapidamente.</p>
<p><strong><em>Esta é a verdadeira lacuna nas ferramentas de IA atuais: compreensão inteligente do contexto do código.</em></strong></p>
<h2 id="Supercharge-Any-Coding-Copilot-with-Semantic-Code-Search" class="common-anchor-header">Supercarregar qualquer copiloto de codificação com pesquisa de código semântico<button data-href="#Supercharge-Any-Coding-Copilot-with-Semantic-Code-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>E se você pudesse dar a qualquer copiloto de codificação de IA - seja o Claude Code, Gemini CLI ou Qwen Code - a capacidade de realmente entender sua base de código semanticamente? E se pudesse construir algo tão poderoso como o Cursor para os seus próprios projectos sem ter de pagar as elevadas taxas de subscrição, mantendo o controlo total sobre o seu código e dados?</p>
<p>Bem, entre no<a href="https://github.com/zilliztech/code-context"> <strong>Code Context - um</strong></a>plug-in de código aberto e compatível com MCP que transforma qualquer agente de codificação de IA em uma potência com reconhecimento de contexto. É como dar ao seu assistente de IA a memória institucional de um programador sénior que trabalhou na sua base de código durante anos. Quer esteja a utilizar o Qwen Code, o Claude Code, o Gemini CLI, a trabalhar em VSCode ou mesmo a codificar no Chrome, <strong>o Code Context</strong> traz a pesquisa de código semântico para o seu fluxo de trabalho.</p>
<p>Pronto para ver como isso funciona? Vamos construir um copiloto de codificação de IA de nível empresarial usando <strong>Qwen3-Coder + Qwen Code + Code Context</strong>.</p>
<h2 id="Hands-On-Tutorial-Building-Your-Own-AI-Coding-Copilot" class="common-anchor-header">Tutorial prático: Criando seu próprio copiloto de codificação de IA<button data-href="#Hands-On-Tutorial-Building-Your-Own-AI-Coding-Copilot" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">Pré-requisitos</h3><p>Antes de começarmos, certifique-se de ter:</p>
<ul>
<li><p><strong>Node.js 20+</strong> instalado</p></li>
<li><p><strong>Chave da API do OpenAI</strong><a href="https://openai.com/index/openai-api/">(obtenha uma aqui</a>)</p></li>
<li><p><strong>Conta do Alibaba Cloud</strong> para acesso ao Qwen3-Coder<a href="https://www.alibabacloud.com/en">(obtenha uma aqui</a>)</p></li>
<li><p><strong>Conta Zilliz Cloud</strong> para base de dados vetorial<a href="https://cloud.zilliz.com/login">(Registe-se aqui</a> gratuitamente se ainda não tiver uma)</p></li>
</ul>
<p><strong>Notas: 1)</strong> Neste tutorial, vamos utilizar o Qwen3-Coder-Plus, a versão comercial do Qwen3-Coder, devido às suas fortes capacidades de codificação e facilidade de utilização. Se preferir uma opção de código aberto, pode usar o qwen3-coder-480b-a35b-instruct. 2) Embora o Qwen3-Coder-Plus ofereça excelente desempenho e usabilidade, ele vem com alto consumo de tokens. Certifique-se de levar isso em consideração nos planos de orçamento da sua empresa.</p>
<h3 id="Step-1-Environment-Setup" class="common-anchor-header">Etapa 1: Configuração do ambiente</h3><p>Verifique sua instalação do Node.js:</p>
<pre><code translate="no">curl -qL <span class="hljs-attr">https</span>:<span class="hljs-comment">//www.npmjs.com/install.sh | sh</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Install-Qwen-Code" class="common-anchor-header">Etapa 2: Instalar o código Qwen</h3><pre><code translate="no">npm install -g <span class="hljs-meta">@qwen</span>-code/qwen-code
qwen --version
<button class="copy-code-btn"></button></code></pre>
<p>Se você vir o número da versão como abaixo, isso significa que a instalação foi bem-sucedida.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_0d5ebc152e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Configure-Qwen-Code" class="common-anchor-header">Passo 3: Configurar o código Qwen</h3><p>Navegue até o diretório do seu projeto e inicialize o Qwen Code.</p>
<pre><code translate="no">Qwen
<button class="copy-code-btn"></button></code></pre>
<p>Em seguida, verá uma página como a abaixo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_e6598ea982.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Requisitos de configuração da API:</strong></p>
<ul>
<li><p>Chave de API: Obter do<a href="https://modelstudio.console.alibabacloud.com/"> Alibaba Cloud Model Studio</a></p></li>
<li><p>URL base: <code translate="no">https://dashscope.aliyuncs.com/compatible-mode/v1</code></p></li>
<li><p>Seleção de modelo:</p>
<ul>
<li><p><code translate="no">qwen3-coder-plus</code> (versão comercial, mais capaz)</p></li>
<li><p><code translate="no">qwen3-coder-480b-a35b-instruct</code> (versão de código aberto)</p></li>
</ul></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_5ed0c54084.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Após a configuração, prima <strong>Enter</strong> para continuar.</p>
<h3 id="Step-4-Test-Basic-Functionality" class="common-anchor-header">Passo 4: Testar a funcionalidade básica</h3><p>Vamos verificar a sua configuração com dois testes práticos:</p>
<p><strong>Teste 1: Compreensão do código</strong></p>
<p>Solicitar: "Resuma a arquitetura e os principais componentes deste projeto em uma frase".</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_41e601fc82.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3-Coder-Plus acertou em cheio no resumo - descrevendo o projeto como um tutorial técnico construído em Milvus, com foco em sistemas RAG, estratégias de recuperação e muito mais.</p>
<p><strong>Teste 2: Geração de código</strong></p>
<p>Pedido: "Por favor, crie um pequeno jogo de Tetris"</p>
<p>Em menos de um minuto, o Qwen3-coder-plus:</p>
<ul>
<li><p>Instala autonomamente as bibliotecas necessárias</p></li>
<li><p>Estrutura a lógica do jogo</p></li>
<li><p>Cria uma implementação completa e jogável</p></li>
<li><p>Lida com toda a complexidade que normalmente passaria horas a pesquisar</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_c67e1725eb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_fd91d5a290.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Isto demonstra o verdadeiro desenvolvimento autónomo - não apenas a conclusão do código, mas a tomada de decisões arquitectónicas e a entrega de soluções completas.</p>
<h3 id="Step-5-Set-Up-Your-Vector-Database" class="common-anchor-header">Passo 5: Configurar a sua base de dados de vectores</h3><p>Neste tutorial, utilizaremos <a href="https://zilliz.com/cloud">o Zilliz Cloud</a> como base de dados vetorial.</p>
<p><strong>Criar um Zilliz Cluster:</strong></p>
<ol>
<li><p>Iniciar sessão na<a href="https://cloud.zilliz.com/"> consola do Zilliz Cloud</a></p></li>
<li><p>Criar um novo cluster</p></li>
<li><p>Copie o <strong>ponto de extremidade público</strong> e o <strong>token</strong></p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_5e692e6e80.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/9_753f281055.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-6-Configure-Code-Context-Integration" class="common-anchor-header">Etapa 6: configurar a integração do contexto de código</h3><p>Criar <code translate="no">~/.qwen/settings.json</code>:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;code-context&quot;</span>: {
      <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;npx&quot;</span>,
      <span class="hljs-string">&quot;args&quot;</span>: [<span class="hljs-string">&quot;@zilliz/code-context-mcp@latest&quot;</span>],
      <span class="hljs-string">&quot;env&quot;</span>: {
        <span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>: <span class="hljs-string">&quot;sk-xxxxxxxxxx&quot;</span>,
        <span class="hljs-string">&quot;MILVUS_ADDRESS&quot;</span>: <span class="hljs-string">&quot;https://in03-xxxx.cloud.zilliz.com&quot;</span>,
        <span class="hljs-string">&quot;MILVUS_TOKEN&quot;</span>: <span class="hljs-string">&quot;4f699xxxxx&quot;</span>
      },
      <span class="hljs-string">&quot;cwd&quot;</span>: <span class="hljs-string">&quot;./server-directory&quot;</span>,
      <span class="hljs-string">&quot;timeout&quot;</span>: <span class="hljs-number">30000</span>,
      <span class="hljs-string">&quot;trust&quot;</span>: <span class="hljs-literal">false</span>
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-7-Activate-Enhanced-Capabilities" class="common-anchor-header">Etapa 7: Ativar recursos aprimorados</h3><p>Reinicie o Qwen Code:</p>
<pre><code translate="no">Qwen
<button class="copy-code-btn"></button></code></pre>
<p>Pressione <strong>Ctrl + T</strong> para ver três novas ferramentas em nosso servidor MCP:</p>
<ul>
<li><p><code translate="no">index-codebase</code>: Cria índices semânticos para compreensão do repositório</p></li>
<li><p><code translate="no">search-code</code>: Pesquisa de código em linguagem natural na sua base de código</p></li>
<li><p><code translate="no">clear-index</code>: Redefine os índices quando necessário.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/10_bebbb44460.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-8-Test-the-Complete-Integration" class="common-anchor-header">Etapa 8: testar a integração completa</h3><p>Aqui está um exemplo real: Num grande projeto, revimos os nomes de código e descobrimos que "janela mais larga" soava pouco profissional, pelo que decidimos alterá-lo.</p>
<p>Solicite: "Encontre todas as funções relacionadas com 'janela mais ampla' que precisam de uma renomeação profissional."</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_c54398c4f2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Como se mostra na figura abaixo, o qwen3-coder-plus chamou primeiro a ferramenta <code translate="no">index_codebase</code> para criar um índice para todo o projeto.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/12_25a7f3a039.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Depois, a ferramenta <code translate="no">index_codebase</code> criou índices para 539 ficheiros neste projeto, dividindo-os em 9.991 partes. Imediatamente após a criação do índice, ela chamou a ferramenta <code translate="no">search_code</code>para realizar a consulta.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/13_6766663346.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Em seguida, informou-nos que encontrou os ficheiros correspondentes que precisavam de ser modificados.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/14_7b3c7e9cc0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Finalmente, descobriu 4 problemas utilizando o Contexto de Código, incluindo funções, importações e alguns nomes na documentação, ajudando-nos a concluir esta pequena tarefa.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/15_a529905b28.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Com a adição do Code Context, o <code translate="no">qwen3-coder-plus</code> oferece agora uma pesquisa de código mais inteligente e uma melhor compreensão dos ambientes de codificação.</p>
<h3 id="What-Youve-Built" class="common-anchor-header">O que você construiu</h3><p>Agora você tem um copiloto de codificação de IA completo que combina:</p>
<ul>
<li><p><strong>Qwen3-Coder</strong>: geração inteligente de código e desenvolvimento autónomo</p></li>
<li><p><strong>Contexto de código</strong>: Compreensão semântica de bases de código existentes</p></li>
<li><p><strong>Compatibilidade universal</strong>: Funciona com Claude Code, Gemini CLI, VSCode e muito mais</p></li>
</ul>
<p>Isto não é apenas um desenvolvimento mais rápido - permite abordagens totalmente novas à modernização de legados, colaboração entre equipas e evolução da arquitetura.</p>
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
    </button></h2><p>Como desenvolvedor, já experimentei muitas ferramentas de codificação de IA - do Claude Code ao Cursor e Gemini CLI, e ao Qwen Code - e, embora sejam ótimas para gerar novos códigos, elas geralmente não funcionam quando se trata de entender as bases de código existentes. Essa é a verdadeira dor de cabeça: não escrever funções do zero, mas navegar em código legado complexo e confuso e descobrir <em>por que</em> as coisas foram feitas de uma certa maneira.</p>
<p>É isso que torna esta configuração com <strong>Qwen3-Coder + Qwen Code + Code Context</strong> tão atraente. Você obtém o melhor dos dois mundos: um modelo de codificação poderoso que pode gerar implementações completas <em>e</em> uma camada de pesquisa semântica que realmente entende o histórico, a estrutura e as convenções de nomenclatura do seu projeto.</p>
<p>Com a pesquisa vetorial e o ecossistema de plug-ins do MCP, você não precisa mais colar arquivos aleatórios na janela de prompt ou percorrer seu repositório tentando encontrar o contexto certo. Basta perguntar em linguagem simples, e ele encontra os arquivos, funções ou decisões relevantes para você - como ter um desenvolvedor sênior que se lembra de tudo.</p>
<p>Para ser claro, esta abordagem não é apenas mais rápida - ela realmente muda a forma como você trabalha. É um passo em direção a um novo tipo de fluxo de trabalho de desenvolvimento, em que a IA não é apenas um ajudante de codificação, mas um assistente de arquitetura, um colega de equipa que conhece todo o contexto do projeto.</p>
<p><em>Dito isto... aviso justo: O Qwen3-Coder-Plus é espantoso, mas muito exigente em termos de fichas. Só a construção deste protótipo consumiu 20 milhões de tokens. Portanto, sim, agora estou oficialmente sem créditos 😅</em></p>
<p>__</p>
