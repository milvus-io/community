---
id: >-
  adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md
title: Adicionando memória persistente ao código Claude com o plugin leve memsearch
author: Cheney Zhang
date: 2026-02-13T00:00:00.000Z
cover: assets.zilliz.com/blog_cover_memsearch_ccplugin_43b5ecfd6f.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'OpenClaw, vector search, Milvus, Claude Code'
meta_keywords: >-
  Claude Code memory, Claude Code plugin, persistent memory, ccplugin, long-term
  memory AI
meta_title: |
  Persistent Memory for Claude Code: memsearch ccplugin
desc: >-
  Dê ao código Claude uma memória de longo prazo com o memsearch ccplugin.
  Armazenamento Markdown leve e transparente, recuperação semântica automática,
  zero sobrecarga de token.
origin: >-
  https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md
---
<p>Recentemente construímos e abrimos o <a href="https://github.com/zilliztech/memsearch">memsearch</a>, uma biblioteca de memória de longo prazo autónoma e plug-and-play que dá a qualquer agente uma memória persistente, transparente e editável por humanos. Ela usa a mesma arquitetura de memória subjacente do OpenClaw - mas sem o resto da pilha do OpenClaw. Isso significa que é possível colocá-la em qualquer estrutura de agente (Claude, GPT, Llama, agentes personalizados, mecanismos de fluxo de trabalho) e adicionar instantaneamente memória durável e consultável. <em>(Se quiser se aprofundar em como o memsearch funciona, escrevemos um</em> <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md"><em>post separado aqui</em></a><em>).</em></p>
<p>Na maioria dos fluxos de trabalho de agentes, o memsearch funciona exatamente como pretendido. Mas <strong>a codificação agêntica</strong> é uma história diferente. As sessões de codificação são longas, as mudanças de contexto são constantes e a informação que vale a pena guardar acumula-se ao longo de dias ou semanas. Esse volume e volatilidade expõem as fraquezas dos sistemas de memória típicos dos agentes - incluindo o memsearch. Nos cenários de codificação, os padrões de recuperação diferem o suficiente para não podermos simplesmente reutilizar a ferramenta existente tal como está.</p>
<p>Para resolver isso, criamos um <strong>plug-in de memória persistente projetado especificamente para o Claude Code</strong>. Ele fica em cima do CLI do memsearch, e nós o chamamos de <strong>memsearch ccplugin</strong>.</p>
<ul>
<li>GitHub Repo: <a href="https://github.com/zilliztech/memsearch"></a><a href="https://zilliztech.github.io/memsearch/claude-plugin/">https://zilliztech.github.io/memsearch/claude-plugin/</a> <em>(código aberto, licença MIT)</em></li>
</ul>
<p>Com o leve <strong>memsearch ccplugin</strong> gerenciando a memória nos bastidores, o Claude Code ganha a capacidade de lembrar cada conversa, cada decisão, cada preferência de estilo e cada thread de vários dias - indexado automaticamente, totalmente pesquisável e persistente entre as sessões.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_plugin_diagram_41563f84dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Para maior clareza neste post: "ccplugin" refere-se à camada superior ou ao próprio plug-in do Claude Code. "memsearch" refere-se à camada inferior, a ferramenta CLI autónoma que lhe está subjacente.</em></p>
<p>Então, porque é que a codificação precisa do seu próprio plugin e porque é que construímos algo tão leve? Resume-se a dois problemas que quase de certeza já encontrou: A falta de memória persistente do Claude Code e a complexidade das soluções existentes, como o claude-mem.</p>
<p>Então, por que construir um plugin dedicado? Porque os agentes de codificação esbarram em dois pontos de dor que você quase certamente já experimentou:</p>
<ul>
<li><p>Claude O código não tem memória persistente.</p></li>
<li><p>Muitas soluções existentes na comunidade - como <em>o claude-mem - são</em>poderosas, mas pesadas, desajeitadas ou excessivamente complexas para o trabalho diário de codificação.</p></li>
</ul>
<p>O ccplugin tem como objetivo resolver ambos os problemas com uma camada mínima, transparente e amigável ao desenvolvedor sobre o memsearch.</p>
<h2 id="Claude-Codes-Memory-Problem-It-Forgets-Everything-When-a-Session-Ends" class="common-anchor-header">O problema de memória do código do Claude: ele esquece tudo quando uma sessão termina<button data-href="#Claude-Codes-Memory-Problem-It-Forgets-Everything-When-a-Session-Ends" class="anchor-icon" translate="no">
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
    </button></h2><p>Vamos começar com um cenário que os usuários do Claude Code com certeza já encontraram.</p>
<p>Você abre o Claude Code pela manhã. "Continue o refactor de autenticação de ontem", você digita. O Claude responde: "Não tenho certeza no que você estava trabalhando ontem". Então, passas os dez minutos seguintes a copiar e colar os registos de ontem. Não é um grande problema, mas torna-se irritante rapidamente porque aparece com muita frequência.</p>
<p>Mesmo que o Claude Code tenha seus próprios mecanismos de memória, eles estão longe de serem satisfatórios. O ficheiro <code translate="no">CLAUDE.md</code> pode armazenar diretivas de projeto e preferências, mas funciona melhor para regras estáticas e comandos curtos, não para acumular conhecimento a longo prazo.</p>
<p>O Claude Code oferece os comandos <code translate="no">resume</code> e <code translate="no">fork</code>, mas eles estão longe de serem fáceis de usar. Para os comandos fork, é necessário lembrar-se dos IDs de sessão, digitar comandos manualmente e gerir uma árvore de históricos de conversação ramificados. Quando você executa <code translate="no">/resume</code>, você obtém uma parede de títulos de sessão. Se você só se lembra de alguns detalhes sobre o que você fez e foi há mais de alguns dias, boa sorte para encontrar a sessão certa.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_snippet_82ec01cc5e.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Para a acumulação de conhecimentos a longo prazo, entre projectos, toda esta abordagem é impossível.</p>
<p>Para cumprir essa idéia, claude-mem usa um sistema de memória de três camadas. A primeira camada pesquisa resumos de alto nível. O segundo nível procura numa linha de tempo para obter mais detalhes. O terceiro nível extrai observações completas para conversas em bruto. Além disso, existem etiquetas de privacidade, controlo de custos e uma interface de visualização na Web.</p>
<p>Eis como funciona por baixo do capô:</p>
<ul>
<li><p><strong>Camada de tempo de execução.</strong> Um serviço Node.js Worker é executado na porta 37777. Os metadados da sessão residem numa base de dados SQLite leve. Uma base de dados vetorial trata da recuperação semântica precisa do conteúdo da memória.</p></li>
<li><p><strong>Camada de interação.</strong> Uma IU Web baseada em React permite-lhe ver as memórias capturadas em tempo real: resumos, linhas de tempo e registos em bruto.</p></li>
<li><p><strong>Camada de interface.</strong> Um servidor MCP (Model Context Protocol) expõe interfaces de ferramentas padronizadas. O Claude pode chamar <code translate="no">search</code> (consultar resumos de alto nível), <code translate="no">timeline</code> (ver linhas de tempo detalhadas) e <code translate="no">get_observations</code> (recuperar registos de interação em bruto) para recuperar e utilizar memórias diretamente.</p></li>
</ul>
<p>Para ser justo, este é um produto sólido que resolve o problema de memória do Claude Code. Mas é desajeitado e complexo em aspectos que importam no dia a dia.</p>
<table>
<thead>
<tr><th>Camada</th><th>Tecnologia</th></tr>
</thead>
<tbody>
<tr><td>Linguagem</td><td>TypeScript (ES2022, módulos ESNext)</td></tr>
<tr><td>Tempo de execução</td><td>Node.js 18+</td></tr>
<tr><td>Base de dados</td><td>SQLite 3 com driver bun:sqlite</td></tr>
<tr><td>Armazenamento vetorial</td><td>ChromaDB (opcional, para pesquisa semântica)</td></tr>
<tr><td>Servidor HTTP</td><td>Express.js 4.18</td></tr>
<tr><td>Em tempo real</td><td>Eventos enviados pelo servidor (SSE)</td></tr>
<tr><td>Estrutura de IU</td><td>React + TypeScript</td></tr>
<tr><td>SDK DE IA</td><td>@anthropic-ai/claude-agent-sdk</td></tr>
<tr><td>Ferramenta de construção</td><td>esbuild (inclui TypeScript)</td></tr>
<tr><td>Gerenciador de processos</td><td>Bun</td></tr>
<tr><td>Testes</td><td>Executor de testes embutido no Node.js</td></tr>
</tbody>
</table>
<p><strong>Para começar, a configuração é pesada.</strong> Fazer o claude-mem rodar significa instalar o Node.js, Bun e o runtime do MCP, e então montar um serviço Worker, servidor Express, React UI, SQLite e um vetor store em cima disso. São muitas partes móveis para implantar, manter e depurar quando algo quebra.</p>
<p><strong>Todos esses componentes também queimam tokens que você não pediu para gastar.</strong> As definições de ferramentas do MCP são carregadas permanentemente na janela de contexto do Claude, e cada chamada de ferramenta consome tokens na solicitação e na resposta. Em sessões longas, essa sobrecarga aumenta rapidamente e pode levar os custos de tokens para fora de controle.</p>
<p><strong>A recuperação de memória não é confiável porque depende inteiramente da escolha do Claude em pesquisar.</strong> O Claude tem de decidir por si próprio chamar ferramentas como <code translate="no">search</code> para despoletar a recuperação. Se ele não percebe que precisa de uma memória, o conteúdo relevante nunca aparece. E cada um dos três níveis de memória requer a sua própria invocação explícita de ferramentas, por isso não há recurso se o Claude não se lembrar de procurar.</p>
<p><strong>Finalmente, o armazenamento de dados é opaco, o que torna a depuração e a migração desagradáveis.</strong> As memórias são divididas entre o SQLite para metadados de sessão e o Chroma para dados vetoriais binários, sem nenhum formato aberto que as una. Migrar significa escrever scripts de exportação. Para ver o que a IA realmente lembra, é necessário passar pela IU da Web ou por uma interface de consulta dedicada. Não há forma de ver apenas os dados em bruto.</p>
<h2 id="Why-the-memsearch-Plugin-for-Claude-Code-is-Better" class="common-anchor-header">Por que o plug-in memsearch para o Claude Code é melhor?<button data-href="#Why-the-memsearch-Plugin-for-Claude-Code-is-Better" class="anchor-icon" translate="no">
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
    </button></h2><p>Queríamos uma camada de memória que fosse realmente leve - sem serviços extras, sem arquitetura emaranhada, sem sobrecarga operacional. Foi isso que nos motivou a construir o <strong>memsearch ccplugin</strong>. No fundo, tratava-se de uma experiência: <em>poderia um sistema de memória focado na codificação ser radicalmente mais simples?</em></p>
<p>Sim, e nós provámos isso.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_icon_d68365006a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O ccplugin inteiro é composto por quatro hooks de shell mais um processo de vigilância em segundo plano. Sem Node.js, sem servidor MCP, sem interface Web. São apenas scripts de shell que chamam a CLI do memsearch, o que reduz drasticamente a barra de configuração e manutenção.</p>
<p>O ccplugin pode ser tão fino por causa dos limites estritos de responsabilidade. Ele não lida com armazenamento de memória, recuperação de vetor ou incorporação de texto. Tudo isso é delegado à CLI do memsearch que está por baixo. O ccplugin tem uma função: fazer a ponte entre os eventos do ciclo de vida do Claude Code (início da sessão, envio de prompt, parada de resposta, fim da sessão) e as funções correspondentes da CLI do memsearch.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_2_6b2dbeaaf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Este design desacoplado torna o sistema flexível para além do Código Claude. A CLI do memsearch funciona de forma independente com outros IDEs, outras estruturas de agentes ou até mesmo invocação manual simples. Ela não está presa a um único caso de uso.</p>
<p>Na prática, esse design oferece três vantagens principais.</p>
<h3 id="1-All-Memories-Live-in-Plain-Markdown-Files" class="common-anchor-header">1. Todas as memórias vivem em ficheiros Markdown simples</h3><p>Cada memória que o ccplugin cria vive em <code translate="no">.memsearch/memory/</code> como um ficheiro Markdown.</p>
<pre><code translate="no">.memsearch/memory/
├── 2026-02-09.md
├── 2026-02-10.md
└── 2026-02-11.md
<button class="copy-code-btn"></button></code></pre>
<p>É um ficheiro por dia. Cada ficheiro contém os resumos das sessões desse dia em texto simples, totalmente legível por humanos. Aqui está uma captura de ecrã dos ficheiros de memória diários do próprio projeto memsearch:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/markdown_file_d0ab53e13b.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pode ver o formato imediatamente: carimbo de data/hora, ID da sessão, ID do turno e um resumo da sessão. Nada está escondido.</p>
<p>Quer saber do que a IA se lembra? Abra o ficheiro Markdown. Quer editar uma memória? Utilize o seu editor de texto. Quer migrar os seus dados? Copie a pasta <code translate="no">.memsearch/memory/</code>.</p>
<p>O índice vetorial <a href="https://milvus.io/">Milvus</a> é uma cache para acelerar a pesquisa semântica. É reconstruído a partir do Markdown em qualquer altura. Não há bases de dados opacas, nem caixas negras binárias. Todos os dados são rastreáveis e totalmente reconstruíveis.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_index_workflow_e8de4628da.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Automatic-Context-Injection-Costs-Zero-Extra-Tokens" class="common-anchor-header">2. A injeção automática de contexto não custa nenhum token adicional</h3><p>O armazenamento transparente é a base deste sistema. A verdadeira recompensa vem da forma como estas memórias são utilizadas e, no ccplugin, a recuperação de memórias é totalmente automática.</p>
<p>Sempre que uma solicitação é enviada, o gancho <code translate="no">UserPromptSubmit</code> dispara uma pesquisa semântica e injeta as três principais memórias relevantes no contexto. O Claude não decide se deve pesquisar. Ele apenas obtém o contexto.</p>
<p>Durante este processo, o Claude nunca vê as definições da ferramenta MCP, por isso nada mais ocupa a janela de contexto. O gancho é executado na camada CLI e injeta resultados de pesquisa de texto simples. Sem sobrecarga de IPC, sem custos de token de chamada de ferramenta. O inchaço da janela de contexto que vem com as definições de ferramentas MCP desapareceu completamente.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/diagram_3_b9e8391c2a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Para os casos em que o top-3 automático não é suficiente, também construímos três níveis de recuperação progressiva. Todos os três são comandos CLI, não ferramentas MCP.</p>
<ul>
<li><p><strong>L1 (automático):</strong> Cada prompt retorna os três principais resultados de pesquisa semântica com uma visualização de <code translate="no">chunk_hash</code> e 200 caracteres. Isso cobre a maior parte do uso diário.</p></li>
<li><p><strong>L2 (a pedido):</strong> Quando é necessário um contexto completo, <code translate="no">memsearch expand &lt;chunk_hash&gt;</code> devolve a secção Markdown completa e os metadados.</p></li>
<li><p><strong>L3 (profundo):</strong> Quando é necessária a conversa original, <code translate="no">memsearch transcript &lt;jsonl_path&gt; --turn &lt;uuid&gt;</code> extrai o registo JSONL em bruto do Claude Code.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_4_ccc495d5ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_5_0333650103.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Session-Summaries-Are-Generated-in-the-Background-at-Near-Zero-Cost" class="common-anchor-header">3. Os resumos das sessões são gerados em segundo plano a um custo quase nulo</h3><p>A recuperação abrange a forma como as memórias são utilizadas. Mas as memórias têm que ser escritas primeiro. Como é que todos esses ficheiros Markdown são criados?</p>
<p>O ccplugin os gera por meio de um pipeline em segundo plano que é executado de forma assíncrona e não custa quase nada. Sempre que você interrompe uma resposta do Claude, o gancho <code translate="no">Stop</code> é acionado: ele analisa a transcrição da conversa, chama o Claude Haiku (<code translate="no">claude -p --model haiku</code>) para gerar um resumo e o anexa ao arquivo Markdown do dia atual. As chamadas à API do Haiku são extremamente baratas, quase insignificantes por invocação.</p>
<p>A partir daí, o processo de observação detecta a alteração do ficheiro e indexa automaticamente o novo conteúdo no Milvus para que esteja disponível para recuperação imediata. Todo o processo decorre em segundo plano, sem interromper o seu trabalho, e os custos mantêm-se controlados.</p>
<h2 id="Quickstart-memsearch-plugin-with-Claude-Code" class="common-anchor-header">Início rápido do plugin memsearch com o Claude Code<button data-href="#Quickstart-memsearch-plugin-with-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="First-install-from-the-Claude-Code-plugin-marketplace" class="common-anchor-header">Primeiro, instale a partir do mercado de plug-ins do Claude Code:</h3><pre><code translate="no">
bash
<span class="hljs-comment"># Run in Claude Code terminal</span>
/plugin marketplace add zilliztech/memsearch
/plugin install memsearch
<button class="copy-code-btn"></button></code></pre>
<h3 id="Second-restart-Claude-Code" class="common-anchor-header">Em segundo lugar, reinicie o Claude Code.</h3><p>O plugin inicializa a sua configuração automaticamente.</p>
<h3 id="Third-after-a-conversation-check-the-days-memory-file" class="common-anchor-header">Terceiro, depois de uma conversa, verifique o ficheiro de memória do dia:</h3><pre><code translate="no">bash
<span class="hljs-built_in">cat</span> .memsearch/memory/$(<span class="hljs-built_in">date</span> +%Y-%m-%d).md
<button class="copy-code-btn"></button></code></pre>
<h3 id="Fourth-enjoy" class="common-anchor-header">Quarto, aproveite.</h3><p>Da próxima vez que o Claude Code for iniciado, o sistema recupera e injecta automaticamente as memórias relevantes. Não são necessários passos adicionais.</p>
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
    </button></h2><p>Voltemos à questão original: como é que se dá memória persistente à IA? claude-mem e memsearch ccplugin adoptam abordagens diferentes, cada uma com diferentes pontos fortes. Resumimos um guia rápido para escolher entre eles:</p>
<table>
<thead>
<tr><th>Categoria</th><th>pesquisa de memória</th><th>claude-mem</th></tr>
</thead>
<tbody>
<tr><td>Arquitetura</td><td>4 ganchos de shell + 1 processo de observação</td><td>Node.js Worker + Express + React UI</td></tr>
<tr><td>Método de integração</td><td>Ganchos nativos + CLI</td><td>Servidor MCP (stdio)</td></tr>
<tr><td>Recuperação</td><td>Automática (injeção de ganchos)</td><td>Orientada para o agente (requer invocação de ferramenta)</td></tr>
<tr><td>Consumo de contexto</td><td>Zero (injetar apenas o texto do resultado)</td><td>As definições da ferramenta MCP persistem</td></tr>
<tr><td>Resumo da sessão</td><td>Uma chamada CLI assíncrona do Haiku</td><td>Várias chamadas API + compressão de observação</td></tr>
<tr><td>Formato de armazenamento</td><td>Ficheiros Markdown simples</td><td>SQLite + incorporação de Chroma</td></tr>
<tr><td>Migração de dados</td><td>Ficheiros Markdown simples</td><td>SQLite + incorporação Chroma</td></tr>
<tr><td>Método de migração</td><td>Copiar ficheiros .md</td><td>Exportar da base de dados</td></tr>
<tr><td>Tempo de execução</td><td>Python + CLI do Claude</td><td>Node.js + Bun + tempo de execução MCP</td></tr>
</tbody>
</table>
<p>O claude-mem oferece recursos mais ricos, uma interface de usuário refinada e um controle mais refinado. Para equipas que precisam de colaboração, visualização na Web ou gestão detalhada da memória, é uma escolha forte.</p>
<p>O memsearch ccplugin oferece um design mínimo, zero sobrecarga de janela de contexto e armazenamento totalmente transparente. Para engenheiros que desejam uma camada de memória leve sem complexidade adicional, é a melhor opção. Qual é o melhor depende do que você precisa.</p>
<p>Quer se aprofundar ou obter ajuda para criar com memsearch ou Milvus?</p>
<ul>
<li><p>Junte-se à <a href="https://milvus.io/slack">comunidade Milvus Slack</a> para se conectar com outros desenvolvedores e compartilhar o que você está construindo.</p></li>
<li><p>Reserve o nosso <a href="https://milvus.io/office-hours">Milvus Office Hourspara</a>perguntas e respostas ao vivo e apoio direto da equipa.</p></li>
</ul>
<h2 id="Resources" class="common-anchor-header">Recursos<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><strong>Documentação do memsearch ccplugin:</strong> <a href="https://zilliztech.github.io/memsearch/claude-plugin/">https://zilliztech.github.io/memsearch/claude-plugin/</a></p></li>
<li><p><strong>GitHub:</strong> <a href="https://github.com/zilliztech/memsearch/tree/main/ccplugin">https://github.com/zilliztech/memsearch/tree/main/ccplugin</a></p></li>
<li><p><strong>Projeto memsearch:</strong> <a href="https://github.com/zilliztech/memsearch">https://github.com/zilliztech/memsearch</a></p></li>
<li><p>Blogue: <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">Extraímos o sistema de memória do OpenClaw e abrimos o seu código fonte (memsearch)</a></p></li>
<li><p>Blog: <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">O que é o OpenClaw? Guia completo para o agente de IA de código aberto -</a></p></li>
<li><p>Blogue: <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Tutorial do OpenClaw: Conectar ao Slack para o Assistente de IA local</a></p></li>
</ul>
