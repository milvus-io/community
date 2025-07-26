---
id: build-open-source-alternative-to-cursor-with-code-context.md
title: Criar uma alternativa de código aberto ao Cursor com Contexto de Código
author: Cheney Zhang
date: 2025-06-24T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Jul_26_2025_08_26_35_PM_b728fb730c.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'vector database, mcp, LLM, claude, gemini'
meta_keywords: 'Cursor, Claude Code, Gemini CLI, Code search, semantic code search'
meta_title: |
  Building an Open-Source Alternative to Cursor with Code Context
desc: >-
  Code Context - um plug-in de código aberto e compatível com MCP que traz uma
  poderosa pesquisa de código semântico para qualquer agente de codificação de
  IA, Claude Code e Gemini CLI, IDEs como VSCode e até mesmo ambientes como o
  Chrome.
origin: >-
  https://milvus.io/blog/build-open-source-alternative-to-cursor-with-code-context.md
---
<h2 id="The-AI-Coding-BoomAnd-Its-Blind-Spot" class="common-anchor-header">O boom da codificação da IA - e o seu ponto cego<button data-href="#The-AI-Coding-BoomAnd-Its-Blind-Spot" class="anchor-icon" translate="no">
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
    </button></h2><p>As ferramentas de codificação de IA estão por todo o lado - e estão a tornar-se virais por uma boa razão. Do <a href="https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md">Claude Code, Gemini CLI</a> às alternativas de código aberto do Cursor, esses agentes podem escrever funções, explicar a dependência do código e refatorar arquivos inteiros com um único prompt. Os programadores estão a correr para os integrar nos seus fluxos de trabalho e, em muitos aspectos, estão a cumprir o prometido.</p>
<p><strong>Mas quando se trata de <em>compreender a sua base de código</em>, a maioria das ferramentas de IA bate numa parede.</strong></p>
<p>Peça ao Claude Code para encontrar "onde este projeto lida com a autenticação do utilizador", e ele recai em <code translate="no">grep -r &quot;auth&quot;</code>- lançando 87 correspondências vagamente relacionadas através de comentários, nomes de variáveis e nomes de ficheiros, provavelmente faltando muitas funções com lógica de autenticação mas não chamadas "auth". Experimente o Gemini CLI, e ele procurará palavras-chave como "login" ou "password", deixando de fora funções como <code translate="no">verifyCredentials()</code>. Essas ferramentas são ótimas para gerar código, mas quando chega a hora de navegar, depurar ou explorar sistemas desconhecidos, elas se desfazem. A menos que enviem toda a base de código para o LLM para contextualização - queimando tokens e tempo - elas lutam para fornecer respostas significativas.</p>
<p><em>Essa é a verdadeira lacuna nas ferramentas de IA atuais:</em> <strong><em>contexto de código.</em></strong></p>
<h2 id="Cursor-Nailed-ItBut-Not-for-Everyone" class="common-anchor-header">O Cursor acertou em cheio - mas não para todos<button data-href="#Cursor-Nailed-ItBut-Not-for-Everyone" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>O Cursor</strong> aborda isso de frente. Em vez de pesquisa por palavras-chave, ele constrói um mapa semântico da sua base de código usando árvores de sintaxe, embeddings vetoriais e pesquisa com reconhecimento de código. Pergunte-lhe "onde está a lógica de validação de correio eletrónico?" e ele devolve <code translate="no">isValidEmailFormat()</code> - não porque o nome corresponde, mas porque compreende o que esse código <em>faz</em>.</p>
<p>Embora o Cursor seja poderoso, pode não ser adequado para todos. <strong><em>O Cursor é de código fechado, hospedado na nuvem e baseado em assinatura.</em></strong> Isso coloca-o fora do alcance de equipas que trabalham com código sensível, organizações preocupadas com a segurança, programadores independentes, estudantes e qualquer pessoa que prefira sistemas abertos.</p>
<h2 id="What-if-You-Could-Build-Your-Own-Cursor" class="common-anchor-header">E se pudesse construir o seu próprio cursor?<button data-href="#What-if-You-Could-Build-Your-Own-Cursor" class="anchor-icon" translate="no">
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
    </button></h2><p>A questão é a seguinte: a tecnologia central por trás do Cursor não é proprietária. É construída sobre bases de dados de código aberto comprovadas - bases de dados vectoriais como o <a href="https://milvus.io/">Milvus</a>, <a href="https://zilliz.com/ai-models">modelos de incorporação</a>, analisadores de sintaxe com o Tree-sitter - tudo disponível para qualquer pessoa disposta a ligar os pontos.</p>
<p><em>Então, perguntámos:</em> <strong><em>E se qualquer pessoa pudesse construir o seu próprio Cursor?</em></strong> Funciona na sua infraestrutura. Sem taxas de assinatura. Totalmente personalizável. Controlo total sobre o seu código e dados.</p>
<p>É por isso que criámos <a href="https://github.com/zilliztech/code-context"><strong>o Code Context - um</strong></a>plug-in de código aberto e compatível com MCP que traz uma poderosa pesquisa de código semântico para qualquer agente de codificação de IA, como o Claude Code e o Gemini CLI, IDEs como o VSCode e até ambientes como o Google Chrome. Também lhe dá o poder de construir o seu próprio agente de codificação como o Cursor a partir do zero, desbloqueando a navegação inteligente e em tempo real da sua base de código.</p>
<p><strong><em>Sem subscrições. Sem caixas pretas. Apenas inteligência de código - nos seus termos.</em></strong></p>
<p>No restante deste post, veremos como o Contexto de código funciona e como você pode começar a usá-lo hoje mesmo.</p>
<h2 id="Code-Context-Open-Source-Alternative-to-Cursors-Intelligence" class="common-anchor-header">Contexto de código: Alternativa de código aberto para a inteligência do Cursor<button data-href="#Code-Context-Open-Source-Alternative-to-Cursors-Intelligence" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/code-context"><strong>O Code Context</strong></a> é um mecanismo de pesquisa de código semântico compatível com MCP e de código aberto. Quer esteja a criar um assistente de codificação de IA personalizado de raiz ou a adicionar consciência semântica a agentes de codificação de IA como o Claude Code e o Gemini CLI, o Code Context é o motor que o torna possível.</p>
<p>É executado localmente, integra-se com as suas ferramentas e ambientes favoritos, como o VS Code e os navegadores Chrome, e proporciona uma compreensão robusta do código sem depender de plataformas de código fechado e apenas na nuvem.</p>
<p><strong>Os principais recursos incluem:</strong></p>
<ul>
<li><p><strong>Pesquisa semântica de código via linguagem natural:</strong> Encontre código usando linguagem natural. Pesquise conceitos como "verificação de login do usuário" ou "lógica de processamento de pagamento" e o Code Context localiza as funções relevantes, mesmo que elas não correspondam exatamente às palavras-chave.</p></li>
<li><p><strong>Suporte a vários idiomas:</strong> Pesquise sem problemas em mais de 15 linguagens de programação, incluindo JavaScript, Python, Java e Go, com uma compreensão semântica consistente em todas elas.</p></li>
<li><p><strong>Chunking de código baseado em AST:</strong> O código é automaticamente dividido em unidades lógicas, como funções e classes, usando a análise AST, garantindo que os resultados da pesquisa sejam completos, significativos e nunca interrompidos no meio da função.</p></li>
<li><p><strong>Indexação em tempo real e incremental:</strong> As alterações de código são indexadas em tempo real. À medida que edita os ficheiros, o índice de pesquisa mantém-se atualizado, sem necessidade de actualizações manuais ou reindexação.</p></li>
<li><p><strong>Implantação totalmente local e segura:</strong> Execute tudo em sua própria infraestrutura. O Code Context suporta modelos locais via Ollama e indexação via <a href="https://milvus.io/">Milvus</a>, para que o seu código nunca saia do seu ambiente.</p></li>
<li><p><strong>Integração com IDE de primeira classe:</strong> A extensão VSCode permite pesquisar e saltar para os resultados instantaneamente - diretamente do seu editor, sem troca de contexto.</p></li>
<li><p><strong>Suporte ao protocolo MCP:</strong> O Code Context fala MCP, facilitando a integração com assistentes de codificação de IA e trazendo a pesquisa semântica diretamente para seus fluxos de trabalho.</p></li>
<li><p><strong>Suporte a plug-ins de navegador:</strong> Pesquise repositórios diretamente do GitHub no seu browser - sem separadores, sem copiar-colar, apenas contexto instantâneo onde quer que esteja a trabalhar.</p></li>
</ul>
<h3 id="How-Code-Context-Works" class="common-anchor-header">Como funciona o Code Context</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_Code_Context_Works_3faaa2fff3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O Code Context usa uma arquitetura modular com um orquestrador central e componentes especializados para incorporação, análise, armazenamento e recuperação.</p>
<h3 id="The-Core-Module-Code-Context-Core" class="common-anchor-header">O módulo principal: Núcleo do Code Context</h3><p>No coração do Code Context está o <strong>Code Context Core</strong>, que coordena a análise, a incorporação, o armazenamento e a recuperação semântica do código:</p>
<ul>
<li><p><strong>O módulo de processamento de texto</strong> divide e analisa o código utilizando o Tree-sitter para uma análise AST sensível à linguagem.</p></li>
<li><p><strong>A interface de incorporação</strong> suporta backends conectáveis - atualmente OpenAI e VoyageAI - convertendo pedaços de código em incorporação de vectores que captam o seu significado semântico e relações contextuais.</p></li>
<li><p><strong>A Vetor Database Interface</strong> armazena estes embeddings numa instância auto-hospedada <a href="https://milvus.io/">do Milvus</a> (por defeito) ou no <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, a versão gerida do Milvus.</p></li>
</ul>
<p>Tudo isto é sincronizado com o seu sistema de ficheiros numa base programada, garantindo que o índice se mantém atualizado sem necessidade de intervenção manual.</p>
<h3 id="Extension-Modules-on-top-of-Code-Context-Core" class="common-anchor-header">Módulos de extensão no topo do Code Context Core</h3><ul>
<li><p><strong>Extensão VSCode</strong>: Integração perfeita com o IDE para pesquisa semântica rápida no editor e salto para definição.</p></li>
<li><p><strong>Extensão para Chrome</strong>: Pesquisa de código semântico em linha enquanto navega nos repositórios do GitHub - sem necessidade de mudar de separador.</p></li>
<li><p><strong>Servidor MCP</strong>: Expõe o Code Context a qualquer assistente de codificação de IA por meio do protocolo MCP, permitindo assistência em tempo real e com reconhecimento de contexto.</p></li>
</ul>
<h2 id="Getting-Started-with-Code-Context" class="common-anchor-header">Introdução ao Contexto de Código<button data-href="#Getting-Started-with-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>O Contexto de Código pode ser conectado a ferramentas de codificação que você já usa ou para criar um assistente de codificação de IA personalizado a partir do zero. Nesta secção, vamos analisar os dois cenários:</p>
<ul>
<li><p>Como integrar o Contexto de código às ferramentas existentes</p></li>
<li><p>Como configurar o Core Module para pesquisa de código semântico independente ao criar seu próprio assistente de codificação de IA</p></li>
</ul>
<h3 id="MCP-Integration" class="common-anchor-header">Integração do MCP</h3><p>O Contexto de código oferece suporte ao <strong>Protocolo de contexto de modelo (MCP)</strong>, permitindo que agentes de codificação de IA, como o Claude Code, o usem como um back-end semântico.</p>
<p>Para integrar com o Claude Code:</p>
<pre><code translate="no">claude mcp add code-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_ADDRESS=your-zilliz-cloud-<span class="hljs-keyword">public</span>-endpoint -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/code-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_code_context_processed_3908097481.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Uma vez configurado, o Claude Code chamará automaticamente o Code Context para pesquisa de código semântico quando necessário.</p>
<p>Para integrar com outras ferramentas ou ambientes, confira nosso<a href="https://github.com/zilliztech/code-context"> repositório do GitHub</a> para obter mais exemplos e adaptadores.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/MCP_Integration_2_683c7ef73d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Building-Your-Own-AI-Coding-Assistant-with-Code-Context" class="common-anchor-header">Criando seu próprio assistente de codificação de IA com o Contexto de código</h3><p>Para criar um assistente de IA personalizado usando o Code Context, você configurará o módulo principal para pesquisa de código semântico em apenas três etapas:</p>
<ol>
<li><p>Configurar seu modelo de incorporação</p></li>
<li><p>Conectar-se ao seu banco de dados vetorial</p></li>
<li><p>Indexar o seu projeto e começar a pesquisar</p></li>
</ol>
<p>Aqui está um exemplo usando o <strong>OpenAI Embeddings</strong> e o <strong>banco de dados de vetores</strong> <a href="https://zilliz.com/cloud"><strong>do Zilliz Cloud</strong></a> como back-end de vetor:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">CodeContext</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/code-context-core&#x27;</span>;

<span class="hljs-comment">// Initialize embedding model</span>
<span class="hljs-keyword">const</span> embedding = <span class="hljs-keyword">new</span> <span class="hljs-title class_">OpenAIEmbedding</span>({
    <span class="hljs-attr">apiKey</span>: <span class="hljs-string">&#x27;your-openai-api-key&#x27;</span>,
    <span class="hljs-attr">model</span>: <span class="hljs-string">&#x27;text-embedding-3-small&#x27;</span>
});

<span class="hljs-comment">// Initialize Zilliz Cloud vector database</span>
<span class="hljs-comment">// Sign up for free at https://zilliz.com/cloud</span>
<span class="hljs-keyword">const</span> vectorDatabase = <span class="hljs-keyword">new</span> <span class="hljs-title class_">MilvusVectorDatabase</span>({
    <span class="hljs-attr">address</span>: <span class="hljs-string">&#x27;https://xxx-xxxxxxxxxxxx.serverless.gcp-us-west1.cloud.zilliz.com&#x27;</span>,
    <span class="hljs-attr">token</span>: <span class="hljs-string">&#x27;xxxxxxx&#x27;</span>
});

<span class="hljs-comment">// Create the Code Context indexer</span>
<span class="hljs-keyword">const</span> context = <span class="hljs-keyword">new</span> <span class="hljs-title class_">CodeContext</span>({ embedding, vectorDatabase });

<span class="hljs-comment">// Index the codebase</span>
<span class="hljs-keyword">await</span> context.<span class="hljs-title function_">indexCodebase</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>);

<span class="hljs-comment">// Perform semantic code search</span>
<span class="hljs-keyword">const</span> results = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">semanticSearch</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>, <span class="hljs-string">&#x27;vector database operations&#x27;</span>, <span class="hljs-number">5</span>);
results.<span class="hljs-title function_">forEach</span>(<span class="hljs-function"><span class="hljs-params">result</span> =&gt;</span> {
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">`<span class="hljs-subst">${result.relativePath}</span>:<span class="hljs-subst">${result.startLine}</span>-<span class="hljs-subst">${result.endLine}</span>`</span>);
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">`score: <span class="hljs-subst">${(result.score * <span class="hljs-number">100</span>).toFixed(<span class="hljs-number">2</span>)}</span>%`</span>);
});
<button class="copy-code-btn"></button></code></pre>
<h3 id="VSCode-Extension" class="common-anchor-header">Extensão VSCode</h3><p>O Contexto de código está disponível como uma extensão VSCode denominada <strong>"Pesquisa de código semântica",</strong> que traz a pesquisa de código inteligente e orientada por linguagem natural diretamente para o seu editor.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/VS_Code_Extension_e358f36464.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Uma vez instalada:</p>
<ul>
<li><p>Configure sua chave de API</p></li>
<li><p>Indexar o seu projeto</p></li>
<li><p>Utilizar consultas em inglês simples (não é necessária uma correspondência exacta)</p></li>
<li><p>Saltar para os resultados instantaneamente com o clique para navegar</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_code_context_processed_3908097481.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Isso torna a exploração semântica uma parte nativa do seu fluxo de trabalho de codificação - sem necessidade de terminal ou navegador.</p>
<h3 id="Chrome-Extension-Coming-Soon" class="common-anchor-header">Extensão para Chrome (em breve)</h3><p>A nossa futura <strong>extensão para o Chrome</strong> traz o Contexto de Código para as páginas Web do GitHub, permitindo-lhe executar a pesquisa de código semântico diretamente em qualquer repositório público - sem necessidade de alternar entre contextos ou separadores.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/chrome_4e67b683d7.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Poderá explorar bases de código desconhecidas com as mesmas capacidades de pesquisa profunda que tem localmente. Fique atento - a extensão está em desenvolvimento e será lançada em breve.</p>
<h2 id="Why-Use-Code-Context" class="common-anchor-header">Porquê utilizar o Contexto do código?<button data-href="#Why-Use-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>A configuração básica permite-lhe trabalhar rapidamente, mas <strong>o Code Context</strong> brilha verdadeiramente em ambientes de desenvolvimento profissionais e de elevado desempenho. Seus recursos avançados são projetados para suportar fluxos de trabalho sérios, desde implantações em escala empresarial até ferramentas de IA personalizadas.</p>
<h3 id="Private-Deployment-for-Enterprise-Grade-Security" class="common-anchor-header">Implantação privada para segurança de nível empresarial</h3><p>O Code Context suporta a implantação totalmente offline usando o modelo de incorporação local <strong>Ollama</strong> e <strong>o Milvus</strong> como um banco de dados vetorial auto-hospedado. Isso permite um pipeline de pesquisa de código totalmente privado: nenhuma chamada de API, nenhuma transmissão pela Internet e nenhum dado sai do seu ambiente local.</p>
<p>Esta arquitetura é ideal para indústrias com requisitos de conformidade rigorosos - tais como finanças, governo e defesa - onde a confidencialidade do código não é negociável.</p>
<h3 id="Real-Time-Indexing-with-Intelligent-File-Sync" class="common-anchor-header">Indexação em tempo real com sincronização inteligente de arquivos</h3><p>Manter o seu índice de código atualizado não deve ser lento ou manual. O Code Context inclui um <strong>sistema de monitorização de ficheiros baseado na árvore Merkle</strong> que detecta alterações instantaneamente e efectua actualizações incrementais em tempo real.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Real_Time_Indexing_with_Intelligent_File_Sync_49c303a38f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ao re-indexar apenas os ficheiros modificados, reduz o tempo de atualização de grandes repositórios de minutos para segundos. Isto garante que o código que acabou de escrever já pode ser pesquisado, sem necessidade de clicar em "atualizar".</p>
<p>Em ambientes de desenvolvimento de ritmo acelerado, esse tipo de imediatismo é fundamental.</p>
<h3 id="AST-Parsing-That-Understands-Code-Like-You-Do" class="common-anchor-header">Análise AST que entende o código como você</h3><p>As ferramentas tradicionais de pesquisa de código dividem o texto por linha ou contagem de caracteres, muitas vezes quebrando unidades lógicas e retornando resultados confusos.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AST_Parsing_That_Understands_Code_Like_You_Do_3236afc075.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O Code Context faz melhor. Ele utiliza a análise AST do Tree-sitter para compreender a estrutura real do código. Ele identifica funções, classes, interfaces e módulos completos, fornecendo resultados limpos e semanticamente completos.</p>
<p>Suporta as principais linguagens de programação, incluindo JavaScript/TypeScript, Python, Java, C/C++, Go e Rust, com estratégias específicas da linguagem para uma fragmentação precisa. No caso de linguagens não suportadas, recorre à análise baseada em regras, garantindo um tratamento gracioso sem falhas ou resultados vazios.</p>
<p>Essas unidades de código estruturado também alimentam os metadados para uma pesquisa semântica mais precisa.</p>
<h3 id="Open-Source-and-Extensible-by-Design" class="common-anchor-header">Código aberto e extensível por projeto</h3><p>O Code Context é totalmente de código aberto sob a licença MIT. Todos os módulos principais estão disponíveis publicamente no GitHub.</p>
<p>Acreditamos que a infraestrutura aberta é a chave para a criação de ferramentas de desenvolvimento poderosas e fiáveis - e convidamos os programadores a estendê-la para novos modelos, linguagens ou casos de utilização.</p>
<h3 id="Solving-the-Context-Window-Problem-for-AI-Assistants" class="common-anchor-header">Resolver o problema da janela de contexto para assistentes de IA</h3><p>Os modelos de linguagem de grande dimensão (LLMs) têm um limite rígido: a sua janela de contexto. Isto impede-os de ver toda a base de código, o que reduz a precisão das conclusões, correcções e sugestões.</p>
<p>O Code Context ajuda a preencher essa lacuna. A sua pesquisa de código semântico recupera as partes <em>certas</em> do código, dando ao seu assistente de IA um contexto focado e relevante para raciocinar. Melhora a qualidade dos resultados gerados pela IA, permitindo que o modelo "aproxime-se" do que realmente importa.</p>
<p>As ferramentas populares de codificação de IA, como o Claude Code e o Gemini CLI, não possuem pesquisa de código semântico nativo - elas dependem de heurísticas superficiais baseadas em palavras-chave. O Contexto de código, quando integrado via <strong>MCP</strong>, dá a elas uma atualização cerebral.</p>
<h3 id="Built-for-Developers-by-Developers" class="common-anchor-header">Criado para desenvolvedores, por desenvolvedores</h3><p>O Code Context é empacotado para reutilização modular: cada componente está disponível como um pacote <strong>npm</strong> independente. Você pode misturar, combinar e estender conforme necessário para o seu projeto.</p>
<ul>
<li><p>Precisa apenas de uma pesquisa semântica de código? Use<code translate="no">@zilliz/code-context-core</code></p></li>
<li><p>Quer ligar-se a um agente de IA? Adicione <code translate="no">@zilliz/code-context-mcp</code></p></li>
<li><p>Está criando sua própria ferramenta IDE/navegador? Veja os nossos exemplos de extensão VSCode e Chrome</p></li>
</ul>
<p>Alguns exemplos de aplicações de contexto de código:</p>
<ul>
<li><p><strong>Plug-ins de preenchimento automático com reconhecimento de contexto</strong> que extraem trechos relevantes para melhores conclusões de LLM</p></li>
<li><p><strong>Detectores inteligentes de erros</strong> que reúnem o código circundante para melhorar as sugestões de correção</p></li>
<li><p><strong>Ferramentas seguras de refacção de código</strong> que encontram automaticamente locais semanticamente relacionados</p></li>
<li><p><strong>Visualizadores de arquitetura</strong> que constroem diagramas a partir de relações semânticas de código</p></li>
<li><p><strong>Assistentes de revisão de código mais inteligentes</strong> que apresentam implementações históricas durante as revisões de PR</p></li>
</ul>
<h2 id="Welcome-to-Join-Our-Community" class="common-anchor-header">Bem-vindo a juntar-se à nossa comunidade<button data-href="#Welcome-to-Join-Our-Community" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/code-context"><strong>O Code Context</strong></a> é mais do que apenas uma ferramenta - é uma plataforma para explorar como <strong>a IA e as bases de dados vectoriais</strong> podem trabalhar em conjunto para compreender verdadeiramente o código. À medida que o desenvolvimento assistido por IA se torna a norma, acreditamos que a pesquisa semântica de código será uma capacidade fundamental.</p>
<p>Aceitamos contribuições de todos os tipos:</p>
<ul>
<li><p>Suporte para novas linguagens</p></li>
<li><p>Novos backends de modelos de incorporação</p></li>
<li><p>Fluxos de trabalho inovadores assistidos por IA</p></li>
<li><p>Feedback, relatórios de erros e ideias de design</p></li>
</ul>
<p>Encontre-nos aqui:</p>
<ul>
<li><p><a href="https://github.com/zilliztech/code-context">Contexto de código no GitHub</a> | <a href="https://www.npmjs.com/package/@zilliz/code-context-mcp"><strong>Pacote MCP npm</strong></a> | <a href="https://marketplace.visualstudio.com/items?itemName=zilliz.semanticcodesearch"><strong>VSCode marketplace</strong></a></p></li>
<li><p><a href="https://discuss.milvus.io/">Discord</a> | <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a> | <a href="https://x.com/zilliz_universe">X</a> | <a href="https://www.youtube.com/@MilvusVectorDatabase/featured">YouTube</a></p></li>
</ul>
<p>Juntos, podemos construir a infraestrutura para a próxima geração de ferramentas de desenvolvimento de IA - transparentes, poderosas e que colocam o desenvolvedor em primeiro lugar.</p>
<p><a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/office_hour_83d4623510.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
