---
id: why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md
title: >-
  Porque é que a sua codificação Vibe gera códigos desactualizados e como
  corrigi-los com o Milvus MCP
author: Cheney Zhang
date: 2025-06-13T00:00:00.000Z
cover: assets.zilliz.com/milvus_mcp_b1dab2a00c.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, mcp, AI Agents, LLM'
meta_keywords: 'Vibe coding, mcp, Milvus, model context protocol'
meta_title: |
  Why Your Vibe Coding Generates Outdated Code and How to Fix It with Milvus MCP
desc: >-
  O problema da alucinação no Vibe Coding é um assassino da produtividade. O
  Milvus MCP mostra como os servidores MCP especializados podem resolver este
  problema, fornecendo acesso em tempo real à documentação atual.
origin: >-
  https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md
---
<h2 id="The-One-Thing-Breaking-Your-Vibe-Coding-Flow" class="common-anchor-header">A única coisa que está a quebrar o seu fluxo de Vibe Coding<button data-href="#The-One-Thing-Breaking-Your-Vibe-Coding-Flow" class="anchor-icon" translate="no">
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
    </button></h2><p>O Vibe Coding está a ter o seu momento. Ferramentas como o Cursor e o Windsurf estão a redefinir a forma como escrevemos software, fazendo com que o desenvolvimento seja fácil e intuitivo. Peça uma função e obtenha um snippet. Precisa de uma chamada rápida à API? Ela é gerada antes de terminar de digitar.</p>
<p><strong>No entanto, aqui está o senão que está a arruinar a vibração: os assistentes de IA geram frequentemente código desatualizado que quebra na produção.</strong> Isso ocorre porque os LLMs que alimentam essas ferramentas geralmente dependem de dados de treinamento desatualizados. Mesmo o copiloto de IA mais inteligente pode sugerir código que está um ano ou três anos atrasado. Você pode acabar com uma sintaxe que não funciona mais, chamadas de API obsoletas ou práticas que os frameworks atuais desencorajam ativamente.</p>
<p>Considere este exemplo: Eu pedi ao Cursor para gerar código de conexão Milvus, e ele produziu isto:</p>
<pre><code translate="no">connections.<span class="hljs-title function_">connect</span>(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Isso costumava funcionar perfeitamente, mas o atual pymilvus SDK recomenda o uso de <code translate="no">MilvusClient</code> para todas as conexões e operações. O método antigo já não é considerado uma boa prática, mas os assistentes de IA continuam a sugeri-lo porque os seus dados de formação estão muitas vezes desactualizados há meses ou anos.</p>
<p>Pior ainda, quando solicitei o código da API da OpenAI, o Cursor gerou um snippet usando <code translate="no">gpt-3.5-turbo</code>- um modelo agora marcado como <em>Legacy</em> pela OpenAI, custando o triplo do preço de seu sucessor e fornecendo resultados inferiores. O código também se baseava em <code translate="no">openai.ChatCompletion</code>, uma API obsoleta a partir de março de 2024.</p>
<p><span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt_pricing_6bfa92d83b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Não se trata apenas de código quebrado - trata-se de <strong>fluxo quebrado</strong>. Toda a promessa do Vibe Coding é que o desenvolvimento deve ser suave e intuitivo. Mas quando seu assistente de IA gera APIs obsoletas e padrões desatualizados, a vibração morre. Você volta para o Stack Overflow, volta para a busca de documentação, volta para a maneira antiga de fazer as coisas.</p>
<p>Apesar de todo o progresso nas ferramentas Vibe Coding, os desenvolvedores ainda gastam muito tempo fazendo a ponte entre o código gerado e as soluções prontas para produção. A vibração está lá, mas a precisão não está.</p>
<p><strong>Até agora.</strong></p>
<h2 id="Meet-Milvus-MCP-Vibe-Coding-with-Always-Up-to-Date-Docs" class="common-anchor-header">Conheça o Milvus MCP: codificação vibrante com documentos sempre actualizados<button data-href="#Meet-Milvus-MCP-Vibe-Coding-with-Always-Up-to-Date-Docs" class="anchor-icon" translate="no">
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
    </button></h2><p>Então, existe uma maneira de combinar o poderoso codegen de ferramentas como o Cursor <em>com</em> documentação atualizada, para que possamos gerar código preciso diretamente no IDE?</p>
<p>Com certeza. Ao combinar o Protocolo de contexto de modelo (MCP) com a Geração aumentada por recuperação (RAG), criámos uma solução melhorada denominada <strong>Milvus MCP</strong>. Esta solução ajuda os programadores que utilizam o Milvus SDK a aceder automaticamente aos documentos mais recentes, permitindo que o seu IDE produza o código correto. Este serviço estará disponível em breve - aqui está uma espreitadela à arquitetura por detrás dele.</p>
<h3 id="How-It-Works" class="common-anchor-header">Como funciona</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/The_Architecture_Behind_MCP_c9093162b6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O diagrama acima mostra um sistema híbrido que combina as arquitecturas MCP (Model Context Protocol) e RAG (Retrieval-Augmented Generation) para ajudar os programadores a gerar código preciso.</p>
<p>No lado esquerdo, os programadores que trabalham em IDEs alimentados por IA, como o Cursor ou o Windsurf, interagem através de uma interface de conversação, que desencadeia chamadas de ferramentas MCP. Estes pedidos são enviados para o servidor MCP no lado direito, que aloja ferramentas especializadas para tarefas de codificação quotidianas, como a geração de código e a refacção.</p>
<p>A componente RAG funciona no lado do servidor do CIM, onde a documentação Milvus foi pré-processada e armazenada como vectores numa base de dados Milvus. Quando uma ferramenta recebe uma consulta, efectua uma pesquisa semântica para obter os trechos de documentação e exemplos de código mais relevantes. Esta informação contextual é então enviada de volta para o cliente, onde um LLM a utiliza para gerar sugestões de código precisas e actualizadas.</p>
<h3 id="MCP-transport-mechanism" class="common-anchor-header">Mecanismo de transporte MCP</h3><p>O MCP suporta dois mecanismos de transporte: <code translate="no">stdio</code> e <code translate="no">SSE</code>:</p>
<ul>
<li><p>Entrada/Saída padrão (stdio): O transporte <code translate="no">stdio</code> permite a comunicação através de fluxos de entrada/saída padrão. É particularmente útil para ferramentas locais ou integrações de linha de comando.</p></li>
<li><p>Eventos enviados pelo servidor (SSE): O SSE suporta streaming de servidor para cliente usando solicitações HTTP POST para comunicação entre cliente e servidor.</p></li>
</ul>
<p>Como o <code translate="no">stdio</code> depende da infraestrutura local, os utilizadores têm de gerir eles próprios a ingestão de documentos. No nosso caso, <strong>o SSE é mais adequado -</strong>o servidor trata automaticamente de todo o processamento e atualização de documentos. Por exemplo, os documentos podem ser re-indexados diariamente. Os usuários só precisam adicionar essa configuração JSON à configuração do MCP:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;milvus-code-generate-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;http://&lt;SERVER_ADDRESS&gt;:23333/milvus-code-helper/sse&quot;</span>
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>Uma vez que isso esteja em vigor, seu IDE (como Cursor ou Windsurf) pode começar a se comunicar com as ferramentas do lado do servidor - recuperando automaticamente a documentação mais recente do Milvus para uma geração de código mais inteligente e atualizada.</p>
<h2 id="Milvus-MCP-in-Action" class="common-anchor-header">Milvus MCP em ação<button data-href="#Milvus-MCP-in-Action" class="anchor-icon" translate="no">
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
    </button></h2><p>Para mostrar como esse sistema funciona na prática, criamos três ferramentas prontas para uso no servidor Milvus MCP que podem ser acessadas diretamente do seu IDE. Cada ferramenta resolve um problema comum que os programadores enfrentam quando trabalham com o Milvus:</p>
<ul>
<li><p><strong>pymilvus-code-generator</strong>: Escreve código Python para você quando você precisa executar operações comuns do Milvus, como criar coleções, inserir dados ou executar pesquisas usando o pymilvus SDK.</p></li>
<li><p><strong>orm-client-code-convertor</strong>: Moderniza o seu código Python existente, substituindo padrões ORM (Object Relational Mapping) desactualizados pela sintaxe mais simples e recente do MilvusClient.</p></li>
<li><p><strong>tradutor de linguagem</strong>: Converte o seu código Milvus SDK entre linguagens de programação. Por exemplo, se tiver o código do SDK Python a funcionar, mas precisar dele no SDK TypeScript, esta ferramenta traduz-o para si.</p></li>
</ul>
<p>Agora, vamos ver como funcionam.</p>
<h3 id="pymilvus-code-generator" class="common-anchor-header">pymilvus-code-generator</h3><div style="padding:66.98% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1093504910?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="pymilvus-code-generator"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>
<p>Nesta demonstração, pedi ao Cursor para gerar código de pesquisa de texto completo usando <code translate="no">pymilvus</code>. O Cursor invoca com sucesso a ferramenta MCP correta e gera um código compatível com as especificações. A maior parte dos casos de utilização do <code translate="no">pymilvus</code> funcionam perfeitamente com esta ferramenta.</p>
<p>Aqui está uma comparação lado a lado com e sem esta ferramenta.</p>
<p><strong>Com MCP MCP:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/With_Milvus_MCP_f72ad4cfb6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>→ Cursor com Milvus MCP utiliza a mais recente interface <code translate="no">MilvusClient</code> para criar uma coleção.</p>
<p><strong>Sem MCP:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Without_Milvus_MCP_3336d956a4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>→ O Cursor sem o servidor Milvus MCP utiliza uma sintaxe ORM desactualizada - já não é aconselhável.</p>
<h3 id="orm-client-code-convertor" class="common-anchor-header">orm-client-code-convertor</h3><div style="padding:66.98% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1093504859?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="orm-client-code-convertor"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>
<p>Neste exemplo, o utilizador destaca algum código de estilo ORM e solicita uma conversão. A ferramenta reescreve corretamente a conexão e a lógica do esquema usando uma instância <code translate="no">MilvusClient</code>. O utilizador pode aceitar todas as alterações com um clique.</p>
<h3 id="language-translator" class="common-anchor-header"><strong>tradutor de idiomas</strong></h3><div style="padding:66.98% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1093504885?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="tool3 ts-1"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>
<p>Aqui, o utilizador seleciona um ficheiro <code translate="no">.py</code> e solicita uma tradução TypeScript. A ferramenta chama o ponto de extremidade MCP correto, recupera os documentos mais recentes do SDK do TypeScript e gera um arquivo <code translate="no">.ts</code> equivalente com a mesma lógica de negócios. Isso é ideal para migrações entre idiomas.</p>
<h2 id="Comparing-Milvus-MCP-with-Context7-DeepWiki-and-Other-Tools" class="common-anchor-header">Comparando o Milvus MCP com o Context7, DeepWiki e outras ferramentas<button data-href="#Comparing-Milvus-MCP-with-Context7-DeepWiki-and-Other-Tools" class="anchor-icon" translate="no">
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
    </button></h2><p>Discutimos o problema da alucinação da "última milha" no Vibe Coding. Para além do nosso Milvus MCP, muitas outras ferramentas também têm como objetivo resolver este problema, como o Context7 e o DeepWiki. Estas ferramentas, muitas vezes alimentadas por MCP ou RAG, ajudam a injetar documentos actualizados e amostras de código na janela de contexto do modelo.</p>
<h3 id="Context7" class="common-anchor-header">Contexto7</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Context7_fc32b53a0e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura: A página Milvus do Context7 permite que os usuários pesquisem e personalizem trechos de documentos<a href="https://context7.com/milvus-io/milvus">(https://context7.com/milvus-io/milvus)</a></p>
<p>O Context7 fornece documentação actualizada e específica da versão e exemplos de código para LLMs e editores de código de IA. O principal problema que aborda é que os LLMs dependem de informações desactualizadas ou genéricas sobre as bibliotecas que utiliza, dando-lhe exemplos de código desactualizados e baseados em dados de treino com um ano.</p>
<p>O Context7 MCP extrai documentação e exemplos de código actualizados e específicos da versão diretamente da fonte e coloca-os diretamente no seu prompt. Ele suporta importações de repositório do GitHub e arquivos <code translate="no">llms.txt</code>, incluindo formatos como <code translate="no">.md</code>, <code translate="no">.mdx</code>, <code translate="no">.txt</code>, <code translate="no">.rst</code> e <code translate="no">.ipynb</code> (não arquivos <code translate="no">.py</code> ).</p>
<p>Os utilizadores podem copiar manualmente o conteúdo do site ou utilizar a integração MCP do Context7 para recuperação automática.</p>
<h3 id="DeepWiki" class="common-anchor-header"><strong>DeepWiki</strong></h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Deep_Wiki_bebe01aa6f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura: A DeepWiki fornece resumos gerados automaticamente do Milvus, incluindo a lógica e a arquitetura<a href="https://deepwiki.com/milvus-io/milvus">(https://deepwiki.com/milvus-io/milvus)</a></p>
<p>O DeepWiki analisa automaticamente projectos GitHub de código aberto para criar documentos técnicos, diagramas e fluxogramas legíveis. Inclui uma interface de chat para perguntas e respostas em linguagem natural. No entanto, ele prioriza arquivos de código em vez de documentação, portanto, pode ignorar insights de documentos importantes. Atualmente, não tem integração com o MCP.</p>
<h3 id="Cursor-Agent-Mode" class="common-anchor-header">Modo de agente do Cursor</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Cursor_Agent_Mode_fba8ef66af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O modo de agente no Cursor permite a pesquisa na Web, chamadas de MCP e alternância de plug-ins. Embora poderoso, é por vezes inconsistente. Pode utilizar <code translate="no">@</code> para inserir documentos manualmente, mas para isso é necessário encontrar e anexar o conteúdo primeiro.</p>
<h3 id="llmstxt" class="common-anchor-header">llms.txt</h3><p><code translate="no">llms.txt</code> não é uma ferramenta - é uma proposta de norma para fornecer aos LLMs o conteúdo estruturado de um sítio web. Normalmente, em Markdown, ele vai para o diretório raiz de um site e organiza títulos, árvores de documentos, tutoriais, links de API e muito mais.</p>
<p>Não é uma ferramenta por si só, mas combina bem com aquelas que a suportam.</p>
<h3 id="Side-by-Side-Feature-Comparison-Milvus-MCP-vs-Context7-vs-DeepWiki-vs-Cursor-Agent-Mode-vs-llmstxt" class="common-anchor-header">Comparação de recursos lado a lado: Milvus MCP vs. Context7 vs. DeepWiki vs Cursor Agent Mode vs llms.txt</h3><table>
<thead>
<tr><th style="text-align:center"></th><th style="text-align:center"></th><th style="text-align:center"></th><th style="text-align:center"></th><th style="text-align:center"></th><th style="text-align:center"></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>Funcionalidade</strong></td><td style="text-align:center"><strong>Contexto7</strong></td><td style="text-align:center"><strong>DeepWiki</strong></td><td style="text-align:center"><strong>Modo de agente de cursor</strong></td><td style="text-align:center"><strong>llms.txt</strong></td><td style="text-align:center"><strong>Milvus MCP</strong></td></tr>
<tr><td style="text-align:center"><strong>Manuseamento de documentos</strong></td><td style="text-align:center">Apenas documentos, sem código</td><td style="text-align:center">Focado no código, pode falhar os documentos</td><td style="text-align:center">Selecionados pelo utilizador</td><td style="text-align:center">Markdown estruturado</td><td style="text-align:center">Apenas documentos oficiais do Milvus</td></tr>
<tr><td style="text-align:center"><strong>Recuperação de contexto</strong></td><td style="text-align:center">Auto-injeção</td><td style="text-align:center">Copiar/colar manualmente</td><td style="text-align:center">Misto, menos exato</td><td style="text-align:center">Pré-rotulagem estruturada</td><td style="text-align:center">Recuperação automática a partir do armazenamento de vectores</td></tr>
<tr><td style="text-align:center"><strong>Importação personalizada</strong></td><td style="text-align:center">GitHub, llms.txt</td><td style="text-align:center">GitHub (incl. privado)</td><td style="text-align:center">Apenas seleção manual</td><td style="text-align:center">Autorização manual</td><td style="text-align:center">Mantido pelo servidor</td></tr>
<tr><td style="text-align:center"><strong>Esforço manual</strong></td><td style="text-align:center">Parcial (MCP vs. manual)</td><td style="text-align:center">Cópia manual</td><td style="text-align:center">Semi-manual</td><td style="text-align:center">Apenas administrador</td><td style="text-align:center">Não é necessária qualquer ação do utilizador</td></tr>
<tr><td style="text-align:center"><strong>Integração da CIM</strong></td><td style="text-align:center">✅ Sim</td><td style="text-align:center">Não</td><td style="text-align:center">Sim (com configuração)</td><td style="text-align:center">Não é uma ferramenta</td><td style="text-align:center">Necessária</td></tr>
<tr><td style="text-align:center"><strong>Vantagens</strong></td><td style="text-align:center">Actualizações em tempo real, preparado para IDE</td><td style="text-align:center">Diagramas visuais, suporte de QA</td><td style="text-align:center">Fluxos de trabalho personalizados</td><td style="text-align:center">Dados estruturados para IA</td><td style="text-align:center">Mantido por Milvus/Zilliz</td></tr>
<tr><td style="text-align:center"><strong>Limitações</strong></td><td style="text-align:center">Sem suporte para ficheiros de código</td><td style="text-align:center">Salta os documentos</td><td style="text-align:center">Depende da precisão da web</td><td style="text-align:center">Requer outras ferramentas</td><td style="text-align:center">Focado apenas no Milvus</td></tr>
</tbody>
</table>
<p>O Milvus MCP foi criado especificamente para o desenvolvimento de bases de dados Milvus. Obtém automaticamente a documentação oficial mais recente e funciona sem problemas com o seu ambiente de codificação. Se estiver a trabalhar com o Milvus, esta é a sua melhor opção.</p>
<p>Outras ferramentas como Context7, DeepWiki e Cursor Agent Mode funcionam com muitas tecnologias diferentes, mas não são tão especializadas ou precisas para o trabalho específico do Milvus.</p>
<p>Escolha com base no que você precisa. A boa notícia é que estas ferramentas funcionam bem em conjunto - pode usar várias ao mesmo tempo para obter os melhores resultados para diferentes partes do seu projeto.</p>
<h2 id="Milvus-MCP-is-Coming-Soon" class="common-anchor-header">O Milvus MCP está a chegar em breve!<button data-href="#Milvus-MCP-is-Coming-Soon" class="anchor-icon" translate="no">
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
    </button></h2><p>O problema de alucinação no Vibe Coding não é apenas um pequeno inconveniente - é um assassino de produtividade que força os programadores a voltarem aos fluxos de trabalho de verificação manual. O Milvus MCP demonstra como os servidores MCP especializados podem resolver isso, fornecendo acesso em tempo real à documentação atual.</p>
<p>Para os desenvolvedores do Milvus, isso significa que não há mais depuração de chamadas <code translate="no">connections.connect()</code> obsoletas ou dificuldades com padrões ORM desatualizados. As três ferramentas - pymilvus-code-generator, orm-client-code-convertor e language-translator - tratam automaticamente dos problemas mais comuns.</p>
<p>Pronto para experimentar? O serviço estará disponível em breve para testes de acesso antecipado. Fique atento.</p>
