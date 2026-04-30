---
id: claude-context-reduce-claude-code-token-usage.md
title: >-
  Contexto do Claude: Reduzir o uso de tokens de código Claude com a recuperação
  de código com Milvus
author: Cheney Zhang
date: 2026-4-30
cover: assets.zilliz.com/image_3b2d2999ac.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude Context, Claude Code token usage, code retrieval, MCP server, Milvus'
meta_title: |
  Claude Context: Cut Claude Code Token Usage with Milvus
desc: >-
  O Claude Code está a queimar tokens no grep? Veja como o Claude Context usa a
  recuperação híbrida apoiada em Milvus para reduzir o uso de tokens em 39,4%.
origin: 'https://milvus.io/blog/claude-context-reduce-claude-code-token-usage.md'
---
<p>As grandes janelas de contexto fazem com que os agentes de codificação de IA se sintam ilimitados, até começarem a ler metade do seu repositório para responder a uma pergunta. Para muitos utilizadores do Claude Code, a parte dispendiosa não é apenas o raciocínio do modelo. É o ciclo de recuperação: pesquisar uma palavra-chave, ler um ficheiro, pesquisar novamente, ler mais ficheiros e continuar a pagar por contexto irrelevante.</p>
<p>O Claude Context é um servidor MCP de recuperação de código de código aberto que dá ao Claude Code e a outros agentes de codificação de IA uma melhor forma de encontrar código relevante. Ele indexa seu repositório, armazena pedaços de código pesquisáveis em um <a href="https://zilliz.com/learn/what-is-vector-database">banco de dados vetorial</a> e usa <a href="https://zilliz.com/blog/hybrid-search-with-milvus">recuperação híbrida</a> para que o agente possa puxar o código de que realmente precisa, em vez de inundar o prompt com resultados do grep.</p>
<p>Em nossos benchmarks, o Claude Context reduziu o consumo de tokens em 39,4% em média e reduziu as chamadas de ferramentas em 36,1%, preservando a qualidade da recuperação. Esta postagem explica por que a recuperação no estilo grep desperdiça contexto, como o Claude Context funciona nos bastidores e como ele se compara a um fluxo de trabalho de linha de base em tarefas reais de depuração.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_6_68b1f70723.png" alt="Claude Context GitHub repository trending and passing 10,000 stars" class="doc-image" id="claude-context-github-repository-trending-and-passing-10,000-stars" />
   </span> <span class="img-wrapper"> <span>O repositório do Claude Context no GitHub está em alta e ultrapassou 10.000 estrelas</span> </span></p>
<h2 id="Why-grep-style-code-retrieval-burns-tokens-in-AI-coding-agents" class="common-anchor-header">Por que a recuperação de código no estilo grep queima tokens em agentes de codificação de IA<button data-href="#Why-grep-style-code-retrieval-burns-tokens-in-AI-coding-agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Um agente de codificação de IA só pode escrever código útil se entender a base de código em torno da tarefa: caminhos de chamada de função, convenções de nomenclatura, testes relacionados, modelos de dados e padrões de implementação históricos. Uma grande janela de contexto ajuda, mas não resolve o problema da recuperação. Se os ficheiros errados entrarem no contexto, o modelo continua a desperdiçar tokens e pode raciocinar a partir de código irrelevante.</p>
<p>A recuperação de código geralmente se divide em dois padrões gerais:</p>
<table>
<thead>
<tr><th>Padrão de recuperação</th><th>Como funciona</th><th>Onde falha</th></tr>
</thead>
<tbody>
<tr><td>Recuperação no estilo Grep</td><td>Pesquisa strings literais e, em seguida, lê arquivos ou intervalos de linhas correspondentes.</td><td>Perde código semanticamente relacionado, devolve correspondências ruidosas e frequentemente requer ciclos repetidos de pesquisa/leitura.</td></tr>
<tr><td>Recuperação ao estilo RAG</td><td>Indexar o código antecipadamente e, em seguida, recuperar partes relevantes com pesquisa semântica, lexical ou híbrida.</td><td>Requer chunking, embeddings, indexação e lógica de atualização que a maioria das ferramentas de codificação não quer possuir diretamente.</td></tr>
</tbody>
</table>
<p>Esta é a mesma distinção que os programadores vêem na conceção de <a href="https://zilliz.com/blog/metadata-filtering-hybrid-search-or-agent-in-rag-applications">aplicações RAG</a>: a correspondência literal é útil, mas raramente é suficiente quando o significado é importante. Uma função chamada <code translate="no">compute_final_cost()</code> pode ser relevante para uma consulta sobre <code translate="no">calculate_total_price()</code> mesmo que as palavras exactas não correspondam. É aqui que <a href="https://zilliz.com/blog/semantic-search-vs-lexical-search-vs-full-text-search">a pesquisa semântica</a> ajuda.</p>
<p>Numa execução de depuração, o Claude Code procurou e leu repetidamente ficheiros antes de localizar a área correta. Após vários minutos, apenas uma pequena fração do código que tinha consumido era relevante.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_4_69b8455aeb.png" alt="Claude Code grep-style search spending time on irrelevant file reads" class="doc-image" id="claude-code-grep-style-search-spending-time-on-irrelevant-file-reads" />
   </span> <span class="img-wrapper"> <span>A pesquisa no estilo grep do Claude Code gastando tempo em leituras de arquivos irrelevantes</span> </span></p>
<p>Esse padrão é comum o suficiente para que os desenvolvedores reclamem dele publicamente: o agente pode ser inteligente, mas o loop de recuperação de contexto ainda parece caro e impreciso.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_8_b857ab4777.png" alt="Developer comment about Claude Code context and token usage" class="doc-image" id="developer-comment-about-claude-code-context-and-token-usage" />
   </span> <span class="img-wrapper"> <span>Comentário do desenvolvedor sobre o contexto do Código Claude e o uso de token</span> </span></p>
<p>A recuperação no estilo Grep falha de três maneiras previsíveis:</p>
<ul>
<li><strong>Sobrecarga de informação:</strong> grandes repositórios produzem muitas correspondências literais, e a maioria não é útil para a tarefa atual.</li>
<li><strong>Cegueira semântica:</strong> grep corresponde a strings, não a intenção, comportamento ou padrões de implementação equivalentes.</li>
<li><strong>Perda de contexto:</strong> correspondências em nível de linha não incluem automaticamente a classe circundante, dependências, testes ou gráfico de chamadas.</li>
</ul>
<p>Uma melhor camada de recuperação de código precisa combinar precisão de palavras-chave com entendimento semântico, e então retornar pedaços completos o suficiente para o modelo raciocinar sobre o código.</p>
<h2 id="What-is-Claude-Context" class="common-anchor-header">O que é o Claude Context?<button data-href="#What-is-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>O Claude Context é um servidor de código aberto <a href="https://zilliz.com/glossary/model-context-protocol-(mcp)">do protocolo Model Context</a> para recuperação de código. Liga ferramentas de codificação de IA a um índice de código apoiado por Milvus, para que um agente possa pesquisar um repositório por significado em vez de se basear apenas na pesquisa de texto literal.</p>
<p>O objetivo é simples: quando o agente pede contexto, devolve o mais pequeno conjunto útil de pedaços de código. O Claude Context faz isso analisando a base de código, gerando embeddings, armazenando pedaços na <a href="https://zilliz.com/what-is-milvus">base de dados vetorial Milvus</a> e expondo a recuperação através de ferramentas compatíveis com MCP.</p>
<table>
<thead>
<tr><th>Problema do Grep</th><th>Abordagem do Claude Context</th></tr>
</thead>
<tbody>
<tr><td>Demasiadas correspondências irrelevantes</td><td>Classificar os blocos de código por semelhança de vectores e relevância de palavras-chave.</td></tr>
<tr><td>Sem compreensão semântica</td><td>Utilizar um <a href="https://zilliz.com/blog/voyage-ai-embeddings-and-rerankers-for-search-and-rag">modelo de incorporação</a> para que as implementações relacionadas possam corresponder mesmo quando os nomes são diferentes.</td></tr>
<tr><td>Falta de contexto envolvente</td><td>Devolver pedaços de código completos com estrutura suficiente para o modelo raciocinar sobre o comportamento.</td></tr>
<tr><td>Leituras repetidas de ficheiros</td><td>Pesquise o índice primeiro e, em seguida, leia ou edite apenas os arquivos que interessam.</td></tr>
</tbody>
</table>
<p>Como o Claude Context é exposto através do MCP, ele pode trabalhar com o Claude Code, Gemini CLI, hosts MCP no estilo Cursor e outros ambientes compatíveis com o MCP. A mesma camada de recuperação central pode suportar várias interfaces de agente.</p>
<h2 id="How-Claude-Context-works-under-the-hood" class="common-anchor-header">Como o Claude Context funciona nos bastidores<button data-href="#How-Claude-Context-works-under-the-hood" class="anchor-icon" translate="no">
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
    </button></h2><p>O Claude Context tem duas camadas principais: um módulo central reutilizável e módulos de integração. O núcleo trata da análise, da fragmentação, da indexação, da pesquisa e da sincronização incremental. A camada superior expõe essas capacidades através de integrações com o MCP e o editor.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_5_cf9f17013f.png" alt="Claude Context architecture showing MCP integrations, core module, embedding provider, and vector database" class="doc-image" id="claude-context-architecture-showing-mcp-integrations,-core-module,-embedding-provider,-and-vector-database" />
   </span> <span class="img-wrapper"> <span>A arquitetura do Claude Context mostra as integrações MCP, o módulo central, o fornecedor de incorporação e a base de dados vetorial</span> </span></p>
<h3 id="How-does-MCP-connect-Claude-Context-to-coding-agents" class="common-anchor-header">Como é que a MCP liga o Claude Context aos agentes de codificação?</h3><p>O MCP fornece a interface entre o anfitrião do LLM e as ferramentas externas. Ao expor o Claude Context como um servidor MCP, a camada de recuperação permanece independente de qualquer IDE ou assistente de codificação. O agente chama uma ferramenta de pesquisa; o Claude Context trata do índice de código e devolve as partes relevantes.</p>
<p>Se quiser compreender o padrão mais amplo, o <a href="https://milvus.io/docs/milvus_and_mcp.md">guia MCP + Milvus</a> mostra como o MCP pode ligar ferramentas de IA a operações de bases de dados vectoriais.</p>
<h3 id="Why-use-Milvus-for-code-retrieval" class="common-anchor-header">Porquê utilizar o Milvus para a recuperação de código?</h3><p>A recuperação de código necessita de pesquisa vetorial rápida, filtragem de metadados e escala suficiente para lidar com grandes repositórios. O Milvus foi concebido para pesquisa de vectores de elevado desempenho e pode suportar vectores densos, vectores esparsos e fluxos de trabalho de reranking. Para as equipas que constroem sistemas de agentes de recuperação pesada, os documentos de <a href="https://milvus.io/docs/multi-vector-search.md">pesquisa híbrida multi-vetorial</a> e <a href="https://milvus.io/api-reference/pymilvus/v2.6.x/MilvusClient/Vector/hybrid_search.md">a API PyMilvus hybrid_search</a> mostram o mesmo padrão de recuperação subjacente utilizado nos sistemas de produção.</p>
<p>O Claude Context pode usar o Zilliz Cloud como backend gerido do Milvus, o que evita correr e escalar a base de dados vetorial. A mesma arquitetura pode também ser adaptada a implementações Milvus autogeridas.</p>
<h3 id="Which-embedding-providers-does-Claude-Context-support" class="common-anchor-header">Que fornecedores de incorporação são suportados pelo Claude Context?</h3><p>O Claude Context suporta várias opções de incorporação:</p>
<table>
<thead>
<tr><th>Fornecedor</th><th>Melhor ajuste</th></tr>
</thead>
<tbody>
<tr><td>Incorporações OpenAI</td><td>Incorporações hospedadas de uso geral com amplo suporte do ecossistema.</td></tr>
<tr><td>Embeddings da Voyage AI</td><td>Recuperação orientada para o código, especialmente quando a qualidade da pesquisa é importante.</td></tr>
<tr><td>Ollama</td><td>Fluxos de trabalho de incorporação local para ambientes sensíveis à privacidade.</td></tr>
</tbody>
</table>
<p>Para fluxos de trabalho Milvus relacionados, consulte a <a href="https://milvus.io/docs/embeddings.md">visão geral de incorporação Milvus</a>, <a href="https://milvus.io/docs/embed-with-openai.md">integração de incorporação OpenAI</a>, <a href="https://milvus.io/docs/embed-with-voyage.md">integração de incorporação Voyage</a> e exemplos de execução <a href="https://zilliz.com/blog/simplifying-legal-research-with-rag-milvus-ollama">do Ollama com Milvus</a>.</p>
<h3 id="Why-is-the-core-library-written-in-TypeScript" class="common-anchor-header">Porque é que a biblioteca principal é escrita em TypeScript?</h3><p>O Claude Context é escrito em TypeScript porque muitas integrações de agentes de codificação, plugins de editores e hosts MCP já são muito pesados em TypeScript. Manter o núcleo de recuperação em TypeScript facilita a integração com as ferramentas da camada de aplicação, enquanto ainda expõe uma API limpa.</p>
<p>O módulo principal abstrai o banco de dados de vetores e o provedor de incorporação em um objeto <code translate="no">Context</code>:</p>
<pre><code translate="no" class="language-javascript"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Context</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/claude-context-core&#x27;</span>;
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
<h2 id="How-Claude-Context-chunks-code-and-keeps-indexes-fresh" class="common-anchor-header">Como o Claude Context divide o código em pedaços e mantém os índices atualizados<button data-href="#How-Claude-Context-chunks-code-and-keeps-indexes-fresh" class="anchor-icon" translate="no">
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
    </button></h2><p>A fragmentação e as actualizações incrementais determinam se um sistema de recuperação de código é utilizável na prática. Se os pedaços forem demasiado pequenos, o modelo perde o contexto. Se os blocos forem demasiado grandes, o sistema de recuperação devolve ruído. Se a indexação for demasiado lenta, os programadores deixam de a utilizar.</p>
<p>O Claude Context lida com esta situação com a fragmentação baseada em AST, um separador de texto de recurso e a deteção de alterações baseada na árvore Merkle.</p>
<h3 id="How-does-AST-based-code-chunking-preserve-context" class="common-anchor-header">Como é que a fragmentação de código baseada em AST preserva o contexto?</h3><p>A fragmentação AST é a estratégia principal. Em vez de dividir os arquivos por contagem de linhas ou de caracteres, o Claude Context analisa a estrutura do código e os pedaços em torno de unidades semânticas, como funções, classes e métodos.</p>
<p>Isso dá a cada bloco três propriedades úteis:</p>
<table>
<thead>
<tr><th>Propriedade</th><th>Por que é importante</th></tr>
</thead>
<tbody>
<tr><td>Completude sintática</td><td>Funções e classes não são divididas no meio.</td></tr>
<tr><td>Coerência lógica</td><td>A lógica relacionada mantém-se unida, pelo que as partes recuperadas são mais fáceis de utilizar pelo modelo.</td></tr>
<tr><td>Suporte multi-linguagem</td><td>Diferentes analisadores de árvore podem lidar com JavaScript, Python, Java, Go e outras linguagens.</td></tr>
</tbody>
</table>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_9_153144cc04.png" alt="AST-based code chunking preserving complete syntactic units and chunking results" class="doc-image" id="ast-based-code-chunking-preserving-complete-syntactic-units-and-chunking-results" />
   </span> <span class="img-wrapper"> <span>A fragmentação de código baseada em AST preserva unidades sintácticas completas e resultados de fragmentação</span> </span></p>
<h3 id="What-happens-when-AST-parsing-fails" class="common-anchor-header">O que acontece quando a análise AST falha?</h3><p>Para linguagens ou ficheiros que a análise AST não consegue tratar, o Claude Context recorre a LangChain's <code translate="no">RecursiveCharacterTextSplitter</code>. É menos preciso do que a fragmentação AST, mas evita que a indexação falhe em entradas não suportadas.</p>
<pre><code translate="no" class="language-php"><span class="hljs-comment">// Use recursive character splitting to preserve code structure</span>
<span class="hljs-keyword">const</span> splitter = <span class="hljs-title class_">RecursiveCharacterTextSplitter</span>.<span class="hljs-title function_">fromLanguage</span>(language, {
    <span class="hljs-attr">chunkSize</span>: <span class="hljs-number">1000</span>,
    <span class="hljs-attr">chunkOverlap</span>: <span class="hljs-number">200</span>,
});
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-does-Claude-Context-avoid-re-indexing-the-whole-repository" class="common-anchor-header">Como é que o Claude Context evita a re-indexação de todo o repositório?</h3><p>Re-indexar um repositório inteiro após cada alteração é demasiado dispendioso. O Claude Context utiliza uma árvore de Merkle para detetar exatamente o que foi alterado.</p>
<p>Uma árvore de Merkle atribui um hash a cada ficheiro, deriva o hash de cada diretório a partir dos seus filhos e enrola todo o repositório num hash raiz. Se o hash raiz não for alterado, o Claude Context pode ignorar a indexação. Se a raiz for alterada, ele percorre a árvore para encontrar os arquivos alterados e incorpora novamente apenas esses arquivos.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_10_73daa3ca83.png" alt="Merkle tree change detection comparing unchanged and changed file hashes" class="doc-image" id="merkle-tree-change-detection-comparing-unchanged-and-changed-file-hashes" />
   </span> <span class="img-wrapper"> <span>Deteção de alterações na árvore Merkle comparando hashes de ficheiros inalterados e alterados</span> </span></p>
<p>A sincronização é executada em três etapas:</p>
<table>
<thead>
<tr><th>Etapa</th><th>O que acontece</th><th>Porque é que é eficiente</th></tr>
</thead>
<tbody>
<tr><td>Verificação rápida</td><td>Compara a raiz de Merkle atual com a última imagem instantânea.</td><td>Se nada mudou, a verificação termina rapidamente.</td></tr>
<tr><td>Comparação precisa</td><td>Percorre a árvore para identificar ficheiros adicionados, eliminados e modificados.</td><td>Apenas os caminhos alterados avançam.</td></tr>
<tr><td>Atualização incremental</td><td>Recompute os embeddings para os ficheiros alterados e actualize o Milvus.</td><td>O índice vetorial mantém-se atualizado sem uma reconstrução completa.</td></tr>
</tbody>
</table>
<p>O estado de sincronização local é armazenado em <code translate="no">~/.context/merkle/</code>, de modo que o Claude Context pode restaurar a tabela de hash de arquivos e a árvore Merkle serializada após uma reinicialização.</p>
<h2 id="What-happens-when-Claude-Code-uses-Claude-Context" class="common-anchor-header">O que acontece quando o Claude Code usa o Claude Context?<button data-href="#What-happens-when-Claude-Code-uses-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>A configuração é um único comando antes de iniciar o Claude Code:</p>
<pre><code translate="no" class="language-nginx">claude mcp add claude-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>Depois de indexar o repositório, o Claude Code pode chamar o Claude Context quando precisar do contexto da base de código. No mesmo cenário de procura de erros que anteriormente gastava tempo com grep e leituras de ficheiros, o Claude Context encontrou o ficheiro exato e o número da linha com uma explicação completa.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/article_12_9ad25bd75b.gif" alt="Claude Context demo showing Claude Code finding the relevant bug location" class="doc-image" id="claude-context-demo-showing-claude-code-finding-the-relevant-bug-location" />
   </span> <span class="img-wrapper"> <span>Demonstração do Claude Context mostrando o Claude Code a encontrar a localização do bug relevante</span> </span></p>
<p>A ferramenta não se limita à procura de erros. Também ajuda na refacção, deteção de código duplicado, resolução de problemas, geração de testes e qualquer tarefa em que o agente precise de um contexto de repositório preciso.</p>
<p>Com um recall equivalente, o Claude Context reduziu o consumo de tokens em 39,4% e reduziu as chamadas de ferramentas em 36,1% em nosso benchmark. Isso é importante porque as chamadas de ferramentas e as leituras de arquivos irrelevantes geralmente dominam o custo dos fluxos de trabalho do agente de codificação.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_3_e20064021b.png" alt="Benchmark chart showing Claude Context reducing token usage and tool calls versus baseline" class="doc-image" id="benchmark-chart-showing-claude-context-reducing-token-usage-and-tool-calls-versus-baseline" />
   </span> <span class="img-wrapper"> <span>Gráfico de benchmark mostrando o Claude Context reduzindo o uso de tokens e as chamadas de ferramentas em relação à linha de base</span> </span></p>
<p>O projeto agora tem mais de 10.000 estrelas no GitHub, e o repositório inclui os detalhes completos do benchmark e links de pacotes.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_7_210af604bd.png" alt="Claude Context GitHub star history showing rapid growth" class="doc-image" id="claude-context-github-star-history-showing-rapid-growth" />
   </span> <span class="img-wrapper"> <span>Histórico de estrelas do Claude Context no GitHub mostrando rápido crescimento</span> </span></p>
<h2 id="How-does-Claude-Context-compare-with-grep-on-real-bugs" class="common-anchor-header">Como o Claude Context se compara ao grep em bugs reais?<button data-href="#How-does-Claude-Context-compare-with-grep-on-real-bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>O benchmark compara a pesquisa de texto puro com a recuperação de código apoiada pelo Milvus em tarefas reais de depuração. A diferença não é apenas o menor número de tokens. O Claude Context altera o caminho de pesquisa do agente: começa mais perto da implementação que precisa de ser alterada.</p>
<table>
<thead>
<tr><th>Caso</th><th>Comportamento de base</th><th>Comportamento do Contexto de Claude</th><th>Redução de tokens</th></tr>
</thead>
<tbody>
<tr><td>Django <code translate="no">YearLookup</code> bug</td><td>Procurou pelo símbolo relacionado errado e editou a lógica de registo.</td><td>Encontrou a lógica de otimização <code translate="no">YearLookup</code> diretamente.</td><td>93% menos tokens</td></tr>
<tr><td>Xarray <code translate="no">swap_dims()</code> bug</td><td>Lido arquivos espalhados em torno de menções de <code translate="no">swap_dims</code>.</td><td>Encontrou a implementação e os testes relacionados mais diretamente.</td><td>62% menos tokens</td></tr>
</tbody>
</table>
<h3 id="Case-1-Django-YearLookup-bug" class="common-anchor-header">Caso 1: Bug Django YearLookup</h3><p><strong>Descrição do problema:</strong> No framework Django, a otimização da consulta <code translate="no">YearLookup</code> quebra a filtragem <code translate="no">__iso_year</code>. Quando usando o filtro <code translate="no">__iso_year</code>, a classe <code translate="no">YearLookup</code> aplica incorretamente a otimização padrão BETWEEN - válida para anos civis, mas não para anos com numeração de semana ISO.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># This should use EXTRACT(&#x27;isoyear&#x27; FROM ...) but incorrectly uses BETWEEN</span>
DTModel.objects.<span class="hljs-built_in">filter</span>(start_date__iso_year=<span class="hljs-number">2020</span>)

<span class="hljs-comment"># Generated: WHERE &quot;start_date&quot; BETWEEN 2020-01-01 AND 2020-12-31</span>
<span class="hljs-comment"># Should be: WHERE EXTRACT(&#x27;isoyear&#x27; FROM &quot;start_date&quot;) = 2020</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Linha de base (grep):</strong></p>
<pre><code translate="no" class="language-swift">🔧 <span class="hljs-title function_">directory_tree</span>()
⚙️ <span class="hljs-title class_">Result</span>: <span class="hljs-title class_">Retrieved</span> <span class="hljs-number">3000</span>+ lines <span class="hljs-keyword">of</span> directory <span class="hljs-title function_">structure</span> (~50k tokens)
   <span class="hljs-title class_">Problem</span>: <span class="hljs-title class_">Massive</span> information overload, no direct relevance
🔧 <span class="hljs-title function_">search_text</span>(<span class="hljs-string">&#x27;ExtractIsoYear&#x27;</span>)
⚙️ <span class="hljs-title class_">Result</span>: <span class="hljs-title class_">Found</span> <span class="hljs-number">21</span> matches across multiple <span class="hljs-attr">files</span>:
   - django/db/models/functions/__init__.<span class="hljs-property">py</span>:<span class="hljs-number">5</span> (<span class="hljs-keyword">import</span> statement)
   - django/db/models/functions/__init__.<span class="hljs-property">py</span>:<span class="hljs-number">31</span> (<span class="hljs-keyword">export</span> list)  
   - django/db/models/functions/datetime.<span class="hljs-property">py</span>:<span class="hljs-number">93</span> (<span class="hljs-title class_">ExtractIsoYear</span> <span class="hljs-keyword">class</span>)
   <span class="hljs-title class_">Problem</span>: <span class="hljs-title class_">Most</span> are unrelated imports and registrations
🔧 <span class="hljs-title function_">edit_file</span>(<span class="hljs-string">&#x27;django/db/models/functions/datetime.py&#x27;</span>)
⚙️ <span class="hljs-title class_">Modified</span> multiple registration statements, but <span class="hljs-variable language_">this</span> is the wrong direction <span class="hljs-keyword">for</span> a fix
<button class="copy-code-btn"></button></code></pre>
<p>A pesquisa de texto centrou-se no registo <code translate="no">ExtractIsoYear</code> em vez da lógica de otimização em <code translate="no">YearLookup</code>.</p>
<p><strong>Contexto de Claude:</strong></p>
<pre><code translate="no" class="language-bash">🔧 search_code(<span class="hljs-string">&#x27;YearLookup&#x27;</span>)
⚙️ Found <span class="hljs-number">10</span> results <span class="hljs-keyword">for</span> query: <span class="hljs-string">&quot;YearLookup&quot;</span> across the codebase
   <span class="hljs-number">1.</span> Code <span class="hljs-title function_">snippet</span> <span class="hljs-params">(python)</span> [repo__django__django]
      Location: django/db/models/lookups.py:<span class="hljs-number">568</span>-<span class="hljs-number">577</span>
      Context: YearExact <span class="hljs-keyword">class</span> <span class="hljs-title class_">and</span> get_bound_params method
   <span class="hljs-number">2.</span> Code <span class="hljs-title function_">snippet</span> <span class="hljs-params">(python)</span> [repo__django__django]  
      Location: django/db/models/lookups.py:<span class="hljs-number">538</span>-<span class="hljs-number">569</span>
      Context: YearLookup base <span class="hljs-keyword">class</span> <span class="hljs-title class_">and</span> year_lookup_bounds method
🔧 edit_file(django/db/models/lookups.py)
⚙️ Successfully modified the core optimization logic, adding ISO year handling
<button class="copy-code-btn"></button></code></pre>
<p>A busca semântica entendeu <code translate="no">YearLookup</code> como o conceito central e foi direto para a classe certa.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_2_159ccffec9.png" alt="Django YearLookup benchmark table showing 93 percent fewer tokens with Claude Context" class="doc-image" id="django-yearlookup-benchmark-table-showing-93-percent-fewer-tokens-with-claude-context" />
   </span> <span class="img-wrapper"> <span>Tabela de benchmark do Django YearLookup mostrando 93% menos tokens com Claude Context</span> </span></p>
<p><strong>Resultado:</strong> 93% menos tokens.</p>
<h3 id="Case-2-Xarray-swapdims-bug" class="common-anchor-header">Caso 2: Bug Xarray swap_dims</h3><p><strong>Descrição do problema:</strong> O método <code translate="no">.swap_dims()</code> da biblioteca Xarray altera inesperadamente o objeto original, violando a expetativa de imutabilidade.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> xarray <span class="hljs-keyword">as</span> xr
nz = <span class="hljs-number">11</span>
ds = xr.Dataset({
    <span class="hljs-string">&quot;y&quot;</span>: (<span class="hljs-string">&quot;z&quot;</span>, np.random.rand(nz)),
    <span class="hljs-string">&quot;lev&quot;</span>: (<span class="hljs-string">&quot;z&quot;</span>, np.arange(nz) * <span class="hljs-number">10</span>),
})

<span class="hljs-comment"># This shouldn&#x27;t modify ds, but it does</span>
ds2 = ds.swap_dims(z=<span class="hljs-string">&quot;lev&quot;</span>).rename_dims(lev=<span class="hljs-string">&quot;z&quot;</span>).reset_index(<span class="hljs-string">&quot;lev&quot;</span>).reset_coords()
ds2.swap_dims(z=<span class="hljs-string">&#x27;lev&#x27;</span>)  <span class="hljs-comment"># this unexpectedly modifies ds2[&#x27;lev&#x27;]</span>
<span class="hljs-comment"># ds2[&#x27;lev&#x27;] now has dimension &#x27;lev&#x27; instead of &#x27;z&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Linha de base (grep):</strong></p>
<pre><code translate="no" class="language-bash">🔧 list_directory(<span class="hljs-string">&#x27;repo__pydata__xarray&#x27;</span>)
⚙️ Result: Retrieved directory structure across multiple subdirectories
   Problem: Basic directory navigation, no targeted search
🔧 search_text(<span class="hljs-string">&#x27;swap_dims&#x27;</span>)
⚙️ Result: Found 21 matches across core files:
   - xarray/core/common.py:600 (Dataset.swap_dims reference)
   - xarray/core/dataarray.py:753 (<span class="hljs-string">&quot;.rename() or .swap_dims() instead.&quot;</span>)
   - xarray/core/dataarray.py:2026 (DataArray.swap_dims reference)
   - xarray/core/dataarray.py:2044 (def swap_dims method)
   Problem: Many matches scattered across different contexts
🔧 read_file(<span class="hljs-string">&#x27;xarray/core/dataarray.py&#x27;</span>, offset=2000, <span class="hljs-built_in">limit</span>=40)
⚙️ Result: Read lines 2001-2040 showing rename method documentation

🔧 read_file(<span class="hljs-string">&#x27;xarray/core/dataset.py&#x27;</span>, offset=3600, <span class="hljs-built_in">limit</span>=40) 
⚙️ Result: Read lines 3601-3640 showing rename_dims method
<button class="copy-code-btn"></button></code></pre>
<p>A linha de base gastou tempo navegando em diretórios e lendo códigos próximos antes de localizar o caminho real da implementação.</p>
<p><strong>Claude Context:</strong></p>
<pre><code translate="no" class="language-bash">🔧 search_code(<span class="hljs-string">&#x27;.swap_dims()&#x27;</span>)
⚙️ Found <span class="hljs-number">10</span> results <span class="hljs-keyword">for</span> query: <span class="hljs-string">&quot;.swap_dims()&quot;</span> across the codebase
   <span class="hljs-number">1.</span> <span class="hljs-function">Code <span class="hljs-title">snippet</span> (<span class="hljs-params">python</span>) [repo__pydata__xarray]
      Location: xarray/tests/test_formatting_html.py:67-76
   2. Code <span class="hljs-title">snippet</span> (<span class="hljs-params">python</span>) [repo__pydata__xarray]
      Location: xarray/tests/test_dataset.py:2926-2979
🔧 <span class="hljs-title">edit_file</span>(<span class="hljs-params"><span class="hljs-string">&#x27;xarray/core/dataset.py&#x27;</span></span>)
⚙️ Successfully modified the <span class="hljs-keyword">file</span>, added dimension handling logic
🔧 <span class="hljs-title">edit_file</span>(<span class="hljs-params"><span class="hljs-string">&#x27;xarray/core/dataarray.py&#x27;</span></span>)
⚙️ Successfully modified the <span class="hljs-keyword">file</span>, ensuring the original DataArray <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> mutated
</span><button class="copy-code-btn"></button></code></pre>
<p>A pesquisa semântica localizou a implementação relevante do <code translate="no">swap_dims()</code> e o contexto relacionado mais rapidamente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_1_d75e931f20.png" alt="Xarray swap_dims benchmark table showing 62 percent fewer tokens with Claude Context" class="doc-image" id="xarray-swap_dims-benchmark-table-showing-62-percent-fewer-tokens-with-claude-context" />
   </span> <span class="img-wrapper"> <span>Tabela de benchmark Xarray swap_dims mostrando 62% menos tokens com o Claude Context</span> </span></p>
<p><strong>Resultado:</strong> 62% menos tokens.</p>
<h2 id="Get-started-with-Claude-Context" class="common-anchor-header">Começar a utilizar o Claude Context<button data-href="#Get-started-with-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Se você quiser experimentar a ferramenta exata deste post, comece com o <a href="https://github.com/zilliztech/claude-context">repositório Claude Context no GitHub</a> e o <a href="https://www.npmjs.com/package/%40zilliz/claude-context-mcp">pacote Claude Context MCP</a>. O repositório inclui instruções de configuração, benchmarks e os principais pacotes TypeScript.</p>
<p>Se você quiser entender ou personalizar a camada de recuperação, esses recursos são as próximas etapas úteis:</p>
<ul>
<li>Aprenda os conceitos básicos da base de dados de vectores com o <a href="https://milvus.io/docs/quickstart.md">Milvus Quickstart</a>.</li>
<li>Explore <a href="https://milvus.io/docs/full-text-search.md">a pesquisa de texto completo do Milvus</a> e o <a href="https://milvus.io/docs/full_text_search_with_milvus.md">tutorial de pesquisa de texto completo do LangChain</a> se quiser combinar a pesquisa no estilo BM25 com vetores densos.</li>
<li>Analise <a href="https://zilliz.com/blog/top-5-open-source-vector-search-engines">os motores de pesquisa vetorial de código aberto</a> se estiver a comparar opções de infraestrutura.</li>
<li>Experimente o <a href="https://zilliz.com/blog/zilliz-cloud-just-landed-in-claude-code">Zilliz Cloud Plugin for Claude Code</a> se quiser operações de base de dados vectoriais diretamente no fluxo de trabalho do Claude Code.</li>
</ul>
<p>Para obter ajuda com o Milvus ou a arquitetura de recuperação de código, junte-se à <a href="https://milvus.io/community/">comunidade Milvus</a> ou reserve <a href="https://milvus.io/office-hours">o Milvus Office Hours</a> para obter orientação individual. Se preferir ignorar a configuração da infraestrutura, inscreva-se <a href="https://cloud.zilliz.com/signup">no Zilliz Cloud</a> ou <a href="https://cloud.zilliz.com/login">inicie sessão no Zilliz Cloud</a> e utilize o Milvus gerido como backend.</p>
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
    </button></h2><h3 id="Why-does-Claude-Code-use-so-many-tokens-on-some-coding-tasks" class="common-anchor-header">Porque é que o Claude Code utiliza tantos tokens em algumas tarefas de codificação?</h3><p>O Claude Code pode utilizar muitos tokens quando uma tarefa requer repetidos loops de pesquisa e leitura de ficheiros num grande repositório. Se o agente pesquisar por palavra-chave, ler ficheiros irrelevantes e, em seguida, pesquisar novamente, cada ficheiro lido adiciona tokens, mesmo quando o código não é útil para a tarefa.</p>
<h3 id="How-does-Claude-Context-reduce-Claude-Code-token-usage" class="common-anchor-header">Como é que o Claude Context reduz a utilização de tokens do Claude Code?</h3><p>O Claude Context reduz a utilização de tokens pesquisando um índice de código suportado pelo Milvus antes de o agente ler os ficheiros. Ele recupera pedaços de código relevantes com a pesquisa híbrida, de modo que o Claude Code pode inspecionar menos arquivos e gastar mais de sua janela de contexto no código que realmente importa.</p>
<h3 id="Is-Claude-Context-only-for-Claude-Code" class="common-anchor-header">O Contexto do Claude é apenas para o Código Claude?</h3><p>Não. O Claude Context é exposto como um servidor MCP, portanto, pode funcionar com qualquer ferramenta de codificação que suporte MCP. O Claude Code é o principal exemplo neste post, mas a mesma camada de recuperação pode suportar outros IDEs compatíveis com MCP e fluxos de trabalho de agentes.</p>
<h3 id="Do-I-need-Zilliz-Cloud-to-use-Claude-Context" class="common-anchor-header">Preciso do Zilliz Cloud para utilizar o Claude Context?</h3><p>O Claude Context pode utilizar o Zilliz Cloud como um backend Milvus gerido, que é o caminho mais fácil se não quiser operar uma infraestrutura de base de dados vetorial. A mesma arquitetura de recuperação baseia-se nos conceitos Milvus, pelo que as equipas podem também adaptá-la a implementações Milvus autogeridas.</p>
