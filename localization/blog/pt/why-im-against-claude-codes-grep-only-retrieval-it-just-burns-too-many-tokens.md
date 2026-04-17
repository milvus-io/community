---
id: >-
  why-im-against-claude-codes-grep-only-retrieval-it-just-burns-too-many-tokens.md
title: >-
  Por que eu sou contra a recuperação somente por Grep do Claude Code? Ele
  simplesmente queima muitos tokens
author: Cheney Zhang
date: 2025-08-25T00:00:00.000Z
desc: >-
  Saiba como a recuperação de código baseada em vectores reduz o consumo de
  tokens do Claude Code em 40%. Solução de código aberto com fácil integração
  com o MCP. Experimente o claude-context hoje mesmo.
cover: >-
  assets.zilliz.com/why_im_against_claude_codes_grep_only_retrieval_it_just_burns_too_many_tokens_milvus_cover_2928b4b72d.png
tag: Engineering
recommend: false
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Claude Code, vector search, AI IDE, code retrieval, token optimization'
meta_title: >
  Why I’m Against Claude Code’s Grep-Only Retrieval? It Just Burns Too Many
  Tokens
origin: >
  https://milvus.io/blog/why-im-against-claude-codes-grep-only-retrieval-it-just-burns-too-many-tokens.md
---
<p>Os assistentes de codificação com IA estão a explodir. Só nos últimos dois anos, ferramentas como o Cursor, Claude Code, Gemini CLI e Qwen Code passaram de curiosidades a companheiros quotidianos de milhões de programadores. Mas por detrás desta rápida ascensão está uma luta crescente sobre algo enganadoramente simples: <strong>como é que um assistente de codificação com IA deve realmente procurar contexto na sua base de código?</strong></p>
<p>Atualmente, existem duas abordagens:</p>
<ul>
<li><p><strong>RAG</strong> (recuperação semântica)<strong>alimentada por pesquisa vetorial</strong>.</p></li>
<li><p><strong>Pesquisa de palavras-chave com grep</strong> (correspondência literal de cadeias de caracteres).</p></li>
</ul>
<p>O Claude Code e o Gemini optaram por esta última. De facto, um engenheiro do Claude admitiu abertamente no Hacker News que o Claude Code não usa RAG de todo. Em vez disso, ele apenas faz o greps do seu repositório linha por linha (o que eles chamam de "agentic search") - sem semântica, sem estrutura, apenas correspondência de strings brutas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_2b03e89759.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Essa revelação dividiu a comunidade:</p>
<ul>
<li><p><strong>Os apoiantes</strong> defendem a simplicidade do grep. É rápido, exato e - o mais importante - previsível. Com a programação, argumentam eles, a precisão é tudo, e os embeddings actuais ainda são demasiado difusos para se poder confiar.</p></li>
<li><p><strong>Os críticos</strong> vêem o grep como um beco sem saída. Afoga-o em correspondências irrelevantes, queima tokens e bloqueia o seu fluxo de trabalho. Sem compreensão semântica, é como pedir à sua IA para depurar com os olhos vendados.</p></li>
</ul>
<p>Ambos os lados têm razão. E depois de criar e testar a minha própria solução, posso dizer o seguinte: a abordagem RAG baseada em pesquisa vetorial muda o jogo. <strong>Não só torna a pesquisa dramaticamente mais rápida e precisa, como também reduz a utilização de tokens em 40% ou mais. (Salte para a parte do Contexto Claude para ver a minha abordagem)</strong></p>
<p>Então, porque é que o grep é tão limitativo? E como é que a pesquisa vetorial pode realmente fornecer melhores resultados na prática? Vamos explicar.</p>
<h2 id="What’s-Wrong-with-Claude-Code’s-Grep-Only-Code-Search" class="common-anchor-header">O que há de errado com a busca de código somente com grep do Claude Code?<button data-href="#What’s-Wrong-with-Claude-Code’s-Grep-Only-Code-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Eu me deparei com esse problema enquanto depurava uma questão espinhosa. O Claude Code disparou consultas grep em todo o meu repositório, despejando grandes quantidades de texto irrelevante para mim. Um minuto depois, eu ainda não tinha encontrado o arquivo relevante. Cinco minutos depois, eu finalmente tinha as 10 linhas certas - mas elas estavam enterradas em 500 linhas de ruído.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_299eeeaea5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Isso não é um caso isolado. Uma olhada nos problemas do Claude Code no GitHub mostra muitos desenvolvedores frustrados que se deparam com o mesmo problema:</p>
<ul>
<li><p>issue1:<a href="https://github.com/anthropics/claude-code/issues/1315"> https://github.com/anthropics/claude-code/issues/1315</a></p></li>
<li><p>issue2:<a href="https://github.com/anthropics/claude-code/issues/4556"> https://github.com/anthropics/claude-code/issues/4556</a></p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_938c7244da.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A frustração da comunidade se resume a três pontos de dor:</p>
<ol>
<li><p><strong>Inchaço de tokens.</strong> Todo grep dump coloca quantidades enormes de código irrelevante no LLM, aumentando os custos que escalam horrivelmente com o tamanho do repo.</p></li>
<li><p><strong>Imposto sobre o tempo.</strong> Você fica preso à espera enquanto a IA joga vinte perguntas com sua base de código, matando o foco e o fluxo.</p></li>
<li><p><strong>Contexto zero.</strong> O Grep corresponde a strings literais. Não tem qualquer sentido de significado ou relações, por isso está efetivamente a pesquisar às cegas.</p></li>
</ol>
<p>É por isso que o debate é importante: grep não é apenas "old school", ele está ativamente atrasando a programação assistida por IA.</p>
<h2 id="Claude-Code-vs-Cursor-Why-the-Latter-Has-Better-Code-Context" class="common-anchor-header">Código Claude vs Cursor: Por que o último tem melhor contexto de código<button data-href="#Claude-Code-vs-Cursor-Why-the-Latter-Has-Better-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando se trata de contexto de código, o Cursor tem feito um trabalho melhor. Desde o primeiro dia, o Cursor se inclinou para a <strong>indexação da base de código</strong>: divida seu repositório em pedaços significativos, incorpore esses pedaços em vetores e recupere-os semanticamente sempre que a IA precisar de contexto. Este é o livro de texto Retrieval-Augmented Generation (RAG) aplicado ao código, e os resultados falam por si: contexto mais apertado, menos tokens desperdiçados e recuperação mais rápida.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_a9f5beb01d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O Claude Code, pelo contrário, apostou na simplicidade. Sem índices, sem embeddings - apenas grep. Isso significa que cada pesquisa é uma correspondência literal de strings, sem entendimento de estrutura ou semântica. É rápido em teoria, mas na prática, os programadores acabam muitas vezes por peneirar palheiros de correspondências irrelevantes antes de encontrarem a agulha de que realmente precisam.</p>
<table>
<thead>
<tr><th></th><th><strong>Código Claude</strong></th><th><strong>Cursor</strong></th></tr>
</thead>
<tbody>
<tr><td>Precisão da pesquisa</td><td>Só apresenta correspondências exatas - não encontra nada com nome diferente.</td><td>Encontra código semanticamente relevante mesmo quando as palavras-chave não correspondem exatamente.</td></tr>
<tr><td>Eficiência</td><td>O Grep despeja grandes quantidades de código no modelo, aumentando os custos de token.</td><td>Pedaços menores e de maior sinal reduzem a carga de tokens em 30-40%.</td></tr>
<tr><td>Escalabilidade</td><td>Faz o grep novamente no repositório todas as vezes, o que diminui a velocidade à medida que os projetos crescem.</td><td>Indexa uma vez e depois recupera em escala com o mínimo de atraso.</td></tr>
<tr><td>Filosofia</td><td>Manter o mínimo - sem infraestrutura extra.</td><td>Indexar tudo, recuperar de forma inteligente.</td></tr>
</tbody>
</table>
<p>Então porque é que o Claude (ou o Gemini, ou o Cline) não seguiu o exemplo do Cursor? As razões são em parte técnicas e em parte culturais. <strong>A recuperação de vectores não é trivial - é necessário resolver a fragmentação, as actualizações incrementais e a indexação em grande escala.</strong> Mas o mais importante é que o Claude Code foi construído em torno do minimalismo: sem servidores, sem índices, apenas uma CLI limpa. Embeddings e BDs vetoriais não se encaixam nessa filosofia de design.</p>
<p>Essa simplicidade é atraente - mas também limita o teto do que o Claude Code pode oferecer. A vontade do Cursor de investir em infraestrutura de indexação real é o motivo pelo qual ele parece mais poderoso hoje.</p>
<h2 id="Claude-Context-an-Open-Source-Project-for-Adding-Semantic-Code-Search-to-Claude-Code" class="common-anchor-header">Claude Context: um projeto de código aberto para adicionar pesquisa semântica de código ao Claude Code<button data-href="#Claude-Context-an-Open-Source-Project-for-Adding-Semantic-Code-Search-to-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>O Claude Code é uma ferramenta forte - mas tem um contexto de código pobre. O Cursor resolveu este problema com a indexação da base de código, mas o Cursor é de código fechado, está bloqueado por subscrições e é caro para indivíduos ou pequenas equipas.</p>
<p>Essa lacuna é o motivo pelo qual começamos a construir nossa própria solução de código aberto: <a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a>.</p>
<p><a href="https://github.com/zilliztech/claude-context"><strong>O Claude Context</strong></a> é um plug-in MCP de código aberto que traz <strong>a pesquisa de código semântico</strong> para o Claude Code (e qualquer outro agente de codificação de IA que fale MCP). Em vez de forçar o seu repositório com grep, ele integra bancos de dados vetoriais com modelos de incorporação para dar aos LLMs <em>um contexto profundo e direcionado</em> de toda a sua base de código. O resultado: recuperação mais precisa, menos desperdício de tokens e uma experiência muito melhor para o desenvolvedor.</p>
<p>Aqui está como o construímos:</p>
<h3 id="Technologies-We-Use" class="common-anchor-header">Tecnologias que usamos</h3><p><strong>Camada de interface: MCP como conetor universal</strong></p>
<p>Queríamos que isto funcionasse em todo o lado - não apenas no Claude. O MCP (Model Context Protocol) funciona como o padrão USB para LLMs, permitindo que ferramentas externas se conectem sem problemas. Ao empacotar o Claude Context como um servidor MCP, ele funciona não apenas com o Claude Code, mas também com o Gemini CLI, Qwen Code, Cline e até mesmo o Cursor.</p>
<p><strong>🗄️ Base de dados vetorial: Nuvem Zilliz</strong></p>
<p>Para a espinha dorsal, escolhemos <a href="https://zilliz.com/cloud">o Zilliz Cloud</a> (um serviço totalmente gerido baseado em <a href="https://milvus.io/">Milvus</a>). Ele é de alto desempenho, nativo da nuvem, elástico e projetado para cargas de trabalho de IA, como indexação de base de código. Isso significa recuperação de baixa latência, escala quase infinita e confiabilidade sólida.</p>
<p><strong>Modelos de incorporação: Flexível por designDiferentes</strong>equipas têm necessidades diferentes, por isso o Claude Context suporta vários fornecedores de incorporação prontos a usar:</p>
<ul>
<li><p><strong>Embeddings OpenAI</strong> para estabilidade e ampla adoção.</p></li>
<li><p><strong>Embeddings Voyage</strong> para desempenho especializado em código.</p></li>
<li><p><strong>Ollama</strong> para implantações locais que priorizam a privacidade.</p></li>
</ul>
<p>Podem ser introduzidos modelos adicionais à medida que os requisitos evoluem.</p>
<p><strong>Escolha da linguagem: TypeScript</strong></p>
<p>Nós debatemos Python vs. TypeScript. O TypeScript venceu - não apenas pela compatibilidade no nível do aplicativo (plug-ins do VSCode, ferramentas da Web), mas também porque o Claude Code e o Gemini CLI são baseados em TypeScript. Isso torna a integração perfeita e mantém o ecossistema coerente.</p>
<h3 id="System-Architecture" class="common-anchor-header">Arquitetura do sistema</h3><p>O Claude Context segue um design limpo e em camadas:</p>
<ul>
<li><p><strong>Os módulos principais</strong> lidam com o trabalho pesado: análise de código, fragmentação, indexação, recuperação e sincronização.</p></li>
<li><p><strong>A interface do utilizador</strong> lida com as integrações - servidores MCP, plugins VSCode ou outros adaptadores.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_0c70864d6f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Essa separação mantém o mecanismo principal reutilizável em diferentes ambientes, permitindo que as integrações evoluam rapidamente à medida que surgem novos assistentes de codificação de IA.</p>
<h3 id="Core-Module-Implementation" class="common-anchor-header">Implementação do módulo principal</h3><p>Os módulos principais formam a base de todo o sistema. Eles abstraem bases de dados vectoriais, modelos de incorporação e outros componentes em módulos compostáveis que criam um objeto Context, permitindo diferentes bases de dados vectoriais e modelos de incorporação para diferentes cenários.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Context</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/claude-context-core&#x27;</span>;
<span class="hljs-comment">// Initialize embedding provider</span>
<span class="hljs-keyword">const</span> embedding = <span class="hljs-keyword">new</span> <span class="hljs-title class_">OpenAIEmbedding</span>(...);
<span class="hljs-comment">// Initialize vector database</span>
<span class="hljs-keyword">const</span> vectorDatabase = <span class="hljs-keyword">new</span> <span class="hljs-title class_">MilvusVectorDatabase</span>(...);
<span class="hljs-comment">// Create context instance</span>
<span class="hljs-keyword">const</span> context = <span class="hljs-keyword">new</span> <span class="hljs-title class_">Context</span>({embedding, vectorDatabase});
<span class="hljs-comment">// Index your codebase with progress tracking</span>
<span class="hljs-keyword">const</span> stats = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">indexCodebase</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>);
<span class="hljs-comment">// Perform semantic search</span>
<span class="hljs-keyword">const</span> results = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">semanticSearch</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>, <span class="hljs-string">&#x27;vector database operations&#x27;</span>);
<button class="copy-code-btn"></button></code></pre>
<h2 id="Solving-Key-Technical-Challenges" class="common-anchor-header">Resolver os principais desafios técnicos<button data-href="#Solving-Key-Technical-Challenges" class="anchor-icon" translate="no">
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
    </button></h2><p>Construir o Claude Context não se limitou a ligar as incorporações e uma base de dados vetorial. O verdadeiro trabalho foi resolver os problemas difíceis que fazem ou quebram a indexação de código em escala. Veja como abordamos os três maiores desafios:</p>
<h3 id="Challenge-1-Intelligent-Code-Chunking" class="common-anchor-header">Desafio 1: fragmentação inteligente de código</h3><p>O código não pode ser dividido apenas por linhas ou caracteres. Isso cria fragmentos confusos e incompletos e elimina a lógica que torna o código compreensível.</p>
<p>Resolvemos isso com <strong>duas estratégias complementares</strong>:</p>
<h4 id="AST-Based-Chunking-Primary-Strategy" class="common-anchor-header">Divisão baseada em AST (estratégia primária)</h4><p>Esta é a abordagem padrão, usando analisadores de árvore para entender a estrutura da sintaxe do código e dividir ao longo dos limites semânticos: funções, classes, métodos. Isso proporciona:</p>
<ul>
<li><p><strong>Completude da sintaxe</strong> - sem funções cortadas ou declarações quebradas.</p></li>
<li><p><strong>Coerência lógica</strong> - a lógica relacionada permanece junta para uma melhor recuperação semântica.</p></li>
<li><p><strong>Suporte a várias linguagens</strong> - funciona em JS, Python, Java, Go e muito mais por meio de gramáticas de árvore.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_e976593d7e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="LangChain-Text-Splitting-Fallback-Strategy" class="common-anchor-header">Divisão de texto LangChain (estratégia de recurso)</h4><p>Para idiomas que o AST não consegue analisar ou quando a análise falha, o <code translate="no">RecursiveCharacterTextSplitter</code> do LangChain fornece um backup confiável.</p>
<pre><code translate="no"><span class="hljs-comment">// Use recursive character splitting to maintain code structure</span>
<span class="hljs-keyword">const</span> splitter = <span class="hljs-title class_">RecursiveCharacterTextSplitter</span>.<span class="hljs-title function_">fromLanguage</span>(language, { 
  <span class="hljs-attr">chunkSize</span>: <span class="hljs-number">1000</span>, 
  <span class="hljs-attr">chunkOverlap</span>: <span class="hljs-number">200</span>,
});
<button class="copy-code-btn"></button></code></pre>
<p>É menos "inteligente" do que a AST, mas altamente fiável - assegurando que os programadores nunca ficam desamparados. Juntas, estas duas estratégias equilibram a riqueza semântica com a aplicabilidade universal.</p>
<h3 id="Challenge-2-Handling-Code-Changes-Efficiently" class="common-anchor-header">Desafio 2: Lidar com alterações de código de forma eficiente</h3><p>A gestão de alterações de código representa um dos maiores desafios nos sistemas de indexação de código. Re-indexar projectos inteiros para pequenas modificações de ficheiros seria completamente impraticável.</p>
<p>Para resolver este problema, criámos o mecanismo de sincronização baseado em árvores de Merkle.</p>
<h4 id="Merkle-Trees-The-Foundation-of-Change-Detection" class="common-anchor-header">Árvores de Merkle: A base da deteção de mudanças</h4><p>As Árvores de Merkle criam um sistema hierárquico de "impressões digitais" onde cada ficheiro tem a sua própria impressão digital hash, as pastas têm impressões digitais baseadas no seu conteúdo e tudo culmina numa impressão digital única do nó raiz para toda a base de código.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_79adb21c84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Quando o conteúdo de um ficheiro é alterado, as impressões digitais de hash são transmitidas em cascata através de cada camada até ao nó raiz. Isto permite a deteção rápida de alterações, comparando as impressões digitais de hash camada a camada, da raiz para baixo, identificando e localizando rapidamente as modificações de ficheiros sem a reindexação completa do projeto.</p>
<p>O sistema executa verificações de sincronização de handshake a cada 5 minutos usando um processo simplificado de três fases:</p>
<p><strong>Fase 1: A deteção extremamente rápida</strong> calcula o hash de raiz Merkle de toda a base de código e compara-o com o instantâneo anterior. Hashs de raiz idênticos significam que não ocorreram alterações - o sistema salta todo o processamento em milissegundos.</p>
<p><strong>Fase 2: A comparação precisa</strong> é activada quando os hashes de raiz diferem, efectuando uma análise detalhada ao nível dos ficheiros para identificar exatamente quais os ficheiros que foram adicionados, eliminados ou modificados.</p>
<p><strong>Fase 3: Atualizações incrementais</strong> recalcula os vetores apenas para arquivos alterados e atualiza o banco de dados de vetores de acordo, maximizando a eficiência.</p>
<h4 id="Local-Snapshot-Management" class="common-anchor-header">Gestão local de instantâneos</h4><p>Todo o estado de sincronização persiste localmente no diretório <code translate="no">~/.context/merkle/</code> do utilizador. Cada base de código mantém seu próprio arquivo de instantâneo independente contendo tabelas de hash de arquivos e dados serializados da árvore Merkle, garantindo a recuperação precisa do estado mesmo após a reinicialização do programa.</p>
<p>Este design oferece benefícios óbvios: a maioria das verificações é concluída em milissegundos quando não existem alterações, apenas os ficheiros genuinamente modificados desencadeiam o reprocessamento (evitando o desperdício computacional maciço) e a recuperação do estado funciona sem falhas nas sessões do programa.</p>
<p>Do ponto de vista da experiência do utilizador, a modificação de uma única função desencadeia a reindexação apenas para esse ficheiro, e não para todo o projeto, melhorando drasticamente a eficiência do desenvolvimento.</p>
<h3 id="Challenge-3-Designing-the-MCP-Interface" class="common-anchor-header">Desafio 3: Projetando a interface MCP</h3><p>Até mesmo o mecanismo de indexação mais inteligente é inútil sem uma interface limpa voltada para o desenvolvedor. O MCP foi a escolha óbvia, mas introduziu desafios únicos:</p>
<h4 id="🔹-Tool-Design-Keep-It-Simple" class="common-anchor-header"><strong>🔹 Design da ferramenta: Manter a simplicidade</strong></h4><p>O módulo MCP serve como a interface voltada para o utilizador, tornando a experiência do utilizador a principal prioridade.</p>
<p>O design da ferramenta começa com a abstração das operações padrão de indexação e pesquisa de bases de código em duas ferramentas principais: <code translate="no">index_codebase</code> para indexar bases de código e <code translate="no">search_code</code> para pesquisar código.</p>
<p>Isto levanta uma questão importante: que ferramentas adicionais são necessárias?</p>
<p>O número de ferramentas requer um equilíbrio cuidadoso - demasiadas ferramentas criam uma sobrecarga cognitiva e confundem a seleção de ferramentas LLM, enquanto que muito poucas podem perder funcionalidades essenciais.</p>
<p>Trabalhar com base em casos reais de uso ajuda a responder a esta pergunta.</p>
<h4 id="Addressing-Background-Processing-Challenges" class="common-anchor-header">Abordando os desafios do processamento em segundo plano</h4><p>Grandes bases de código podem levar um tempo considerável para serem indexadas. A abordagem ingénua de esperar sincronizadamente pela conclusão obriga os utilizadores a esperar vários minutos, o que é simplesmente inaceitável. O processamento assíncrono em segundo plano torna-se essencial, mas o MCP não suporta nativamente esse padrão.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_e1f0aa290f.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>O nosso servidor MCP executa um processo em segundo plano dentro do servidor MCP para tratar da indexação enquanto devolve imediatamente as mensagens de arranque aos utilizadores, permitindo-lhes continuar a trabalhar.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_1cb37d15f3.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>Isto cria um novo desafio: como é que os utilizadores acompanham o progresso da indexação?</p>
<p>Uma ferramenta dedicada para consultar o progresso ou o estado da indexação resolve este problema de forma elegante. O processo de indexação em segundo plano guarda de forma assíncrona as informações de progresso, permitindo aos utilizadores verificar as percentagens de conclusão, o estado de sucesso ou as condições de falha em qualquer altura. Além disso, uma ferramenta de limpeza manual de índices lida com situações em que os utilizadores precisam de repor índices incorrectos ou reiniciar o processo de indexação.</p>
<p><strong>Desenho final da ferramenta:</strong></p>
<p><code translate="no">index_codebase</code> - Base de código do índice<code translate="no">search_code</code> - Código de pesquisa<code translate="no">get_indexing_status</code> - Estado da indexação da consulta<code translate="no">clear_index</code> - Limpar índice</p>
<p>Quatro ferramentas que atingem o equilíbrio perfeito entre simplicidade e funcionalidade.</p>
<h4 id="🔹-Environment-Variable-Management" class="common-anchor-header">Gestão de variáveis de ambiente</h4><p>A gestão de variáveis de ambiente é frequentemente negligenciada, apesar de ter um impacto significativo na experiência do utilizador. Exigir uma configuração de chave de API separada para cada cliente MCP obrigaria os utilizadores a configurar as credenciais várias vezes ao alternar entre o Claude Code e o Gemini CLI.</p>
<p>Uma abordagem de configuração global elimina esse atrito criando um arquivo <code translate="no">~/.context/.env</code> no diretório inicial do usuário:</p>
<pre><code translate="no"><span class="hljs-comment"># ~/.context/.env</span>
OPENAI_API_KEY=your-api-key-here
MILVUS_TOKEN=your-milvus-token
<button class="copy-code-btn"></button></code></pre>
<p><strong>Essa abordagem oferece benefícios claros:</strong> os usuários configuram uma vez e usam em todos os lugares em todos os clientes MCP, todas as configurações são centralizadas em um único local para facilitar a manutenção e as chaves sensíveis da API não se espalham por vários arquivos de configuração.</p>
<p>Também implementamos uma hierarquia de prioridades em três níveis: as variáveis de ambiente do processo têm prioridade máxima, os arquivos de configuração global têm prioridade média e os valores padrão servem como fallbacks.</p>
<p>Esse design oferece uma enorme flexibilidade: os desenvolvedores podem usar variáveis de ambiente para substituições temporárias de teste, os ambientes de produção podem injetar configurações confidenciais por meio de variáveis de ambiente do sistema para aumentar a segurança e os usuários configuram uma vez para trabalhar perfeitamente no Claude Code, Gemini CLI e outras ferramentas.</p>
<p>Neste ponto, a arquitetura central do servidor MCP está completa, abrangendo a análise de código e o armazenamento de vectores através da recuperação inteligente e da gestão de configurações. Cada componente foi cuidadosamente projetado e otimizado para criar um sistema poderoso e fácil de usar.</p>
<h2 id="Hands-on-Testing" class="common-anchor-header">Testes práticos<button data-href="#Hands-on-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p>Como é que o Claude Context funciona na prática? Testei-o exatamente no mesmo cenário de caça aos erros que me deixou inicialmente frustrado.</p>
<p>A instalação foi apenas um comando antes de lançar o Claude Code:</p>
<pre><code translate="no">claude mcp add claude-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>Assim que a minha base de código foi indexada, dei ao Claude Code a mesma descrição de bug que anteriormente o tinha enviado numa <strong>perseguição de cinco minutos com grep</strong>. Desta vez, através de <code translate="no">claude-context</code> chamadas MCP, ele <strong>imediatamente identificou o arquivo exato e o número da linha</strong>, completo com uma explicação do problema.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_gif_e04d07cd00.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A diferença não era subtil - era noite e dia.</p>
<p>E não se tratava apenas de caça aos bugs. Com o Claude Context integrado, o Claude Code produziu consistentemente resultados de maior qualidade:</p>
<ul>
<li><p><strong>Resolução de problemas</strong></p></li>
<li><p><strong>Refatoração de código</strong></p></li>
<li><p><strong>Deteção de código duplicado</strong></p></li>
<li><p><strong>Testes abrangentes</strong></p></li>
</ul>
<p>O aumento do desempenho também se reflecte nos números. Em testes lado a lado:</p>
<ul>
<li><p>A utilização de tokens diminuiu mais de 40%, sem qualquer perda de memória.</p></li>
<li><p>Isto traduz-se diretamente em custos de API mais baixos e respostas mais rápidas.</p></li>
<li><p>Alternativamente, com o mesmo orçamento, o Claude Context forneceu recuperações muito mais precisas.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_2659dd3429.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Abrimos o código aberto do Claude Context no GitHub, e ele já ganhou mais de 2,6 mil estrelas. Obrigado a todos pelo vosso apoio e gostos.</p>
<p>Pode experimentá-lo você mesmo:</p>
<ul>
<li><p>GitHub:<a href="https://github.com/zilliztech/claude-context"> github.com/zilliztech/claude-context</a></p></li>
<li><p>npm:<a href="https://www.npmjs.com/package/@zilliz/claude-context-mcp"> @zilliz/claude-context-mcp</a></p></li>
</ul>
<p>Os benchmarks detalhados e a metodologia de teste estão disponíveis no repositório - gostaríamos de receber o seu feedback.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/12_88bf595b15.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Looking-Forward" class="common-anchor-header">Olhando para frente<button data-href="#Looking-Forward" class="anchor-icon" translate="no">
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
    </button></h2><p>O que começou como uma frustração com o grep no Claude Code cresceu e se tornou uma solução sólida: <a href="https://github.com/zilliztech/claude-context"><strong>Claude Context - um</strong></a>plugin MCP de código aberto que traz a pesquisa semântica e vetorial para o Claude Code e outros assistentes de codificação. A mensagem é simples: os programadores não têm de se contentar com ferramentas de IA ineficientes. Com o RAG e a recuperação de vectores, pode depurar mais rapidamente, reduzir os custos de token em 40% e, finalmente, obter assistência de IA que compreende verdadeiramente a sua base de código.</p>
<p>E isso não se limita ao Claude Code. Como o Claude Context foi desenvolvido com base em padrões abertos, a mesma abordagem funciona perfeitamente com Gemini CLI, Qwen Code, Cursor, Cline e outros. Chega de ficar preso a trocas de fornecedores que priorizam a simplicidade em detrimento do desempenho.</p>
<p>Gostaríamos muito que você fizesse parte desse futuro:</p>
<ul>
<li><p><strong>Experimente</strong> <a href="https://github.com/zilliztech/claude-context"><strong>o Claude Context</strong></a><strong>:</strong> ele é de código aberto e totalmente gratuito</p></li>
<li><p><strong>Contribua para o seu desenvolvimento</strong></p></li>
<li><p><strong>Ou crie a sua própria solução</strong> utilizando o Claude Context</p></li>
</ul>
<p>Partilhe os seus comentários, faça perguntas ou obtenha ajuda juntando-se à nossa <a href="https://discord.com/invite/8uyFbECzPX"><strong>comunidade Discord</strong></a>.</p>
