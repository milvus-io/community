---
id: is-mcp-dead-cli-and-skills-for-ai-agents.md
title: >-
  O MCP está morto? O que aprendemos Construindo com MCP, CLI e habilidades de
  agente
author: Cheney Zhang
date: 2026-4-1
cover: assets.zilliz.com/mcp_dead_a23ff23c27.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  MCP protocol, AI agent tooling, agent skills, model context protocol, CLI
  tools
meta_title: |
  Is MCP Dead? MCP vs CLI vs Agent Skills Compared
desc: >-
  O MCP consome o contexto, falha na produção e não pode reutilizar o LLM do seu
  agente. Nós construímos com todos os três - aqui está quando cada um se
  encaixa.
origin: 'https://milvus.io/blog/is-mcp-dead-cli-and-skills-for-ai-agents.md'
---
<p>Quando o CTO da Perplexity, Denis Yarats, disse na ASK 2026 que a empresa estava a desprivilegiar o MCP internamente, isso desencadeou o ciclo habitual. O CEO da YC, Garry Tan, foi contra - o MCP consome muita janela de contexto, o auth está quebrado, ele construiu um substituto para o CLI em 30 minutos. O Hacker News publicou um artigo fortemente anti-MCP.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_1_4e49d13991.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_2_7dc46108c1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Há um ano atrás, este nível de ceticismo público teria sido invulgar. O Protocolo de Contexto de Modelo (MCP) foi posicionado como o padrão definitivo para a integração de ferramentas de <a href="https://zilliz.com/glossary/ai-agents">agentes de IA</a>. O número de servidores duplicava semanalmente. Desde então, o padrão tem seguido um arco familiar: rápido entusiasmo, ampla adoção, depois desilusão na produção.</p>
<p>A indústria está a responder rapidamente. A Lark/Feishu da Bytedance abriu o código aberto da sua CLI oficial - mais de 200 comandos em 11 domínios de negócio com 19 competências de agente incorporadas. A Google lançou o gws para o Google Workspace. O padrão CLI + Skills está rapidamente a tornar-se o padrão para ferramentas de agentes empresariais, não uma alternativa de nicho.</p>
<p>Na Zilliz, lançámos <a href="https://docs.zilliz.com/reference/cli/overview">o Zilliz CLI</a>, que lhe permite operar e gerir <a href="https://milvus.io/intro">o Milvus</a> e <a href="https://zilliz.com/cloud">o Zilliz Cloud</a> (Milvus totalmente gerido) diretamente a partir do seu terminal sem sair do seu ambiente de programação. Além disso, criámos <a href="https://milvus.io/docs/milvus_for_agents.md">o Milvus Skills</a> e <a href="https://docs.zilliz.com/docs/agents/zilliz-skill">o Zilliz Skills</a>para que os agentes de codificação de IA, como o Claude Code e o Codex, possam gerir a sua <a href="https://zilliz.com/learn/what-is-vector-database">base de dados de vectores</a> através de linguagem natural.</p>
<p>Também criámos um servidor MCP para o Milvus e o Zilliz Cloud há um ano. Essa experiência ensinou-nos exatamente onde é que o MCP falha - e onde é que ainda se encaixa. Três limitações arquitectónicas empurraram-nos para o CLI e Skills: inchaço da janela de contexto, design passivo da ferramenta e a incapacidade de reutilizar o LLM do próprio agente.</p>
<p>Nesta postagem, analisaremos cada problema, mostraremos o que estamos construindo e apresentaremos uma estrutura prática para escolher entre MCP, CLI e Habilidades do agente.</p>
<h2 id="MCP-Eats-72-of-Your-Context-Window-at-Startup" class="common-anchor-header">O MCP consome 72% da sua janela de contexto na inicialização<button data-href="#MCP-Eats-72-of-Your-Context-Window-at-Startup" class="anchor-icon" translate="no">
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
    </button></h2><p>Uma configuração padrão do MCP pode consumir cerca de 72% da sua janela de contexto disponível antes que o agente execute uma única ação. Conecte três servidores - GitHub, Playwright e uma integração de IDE - em um modelo de 200 mil tokens, e as definições de ferramentas ocupam cerca de 143 mil tokens. O agente ainda não fez nada. Já está três quartos cheio.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_3_767d46c583.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O custo não é apenas de tokens. Quanto mais conteúdo não relacionado for colocado no contexto, mais fraco será o foco do modelo no que realmente importa. Uma centena de esquemas de ferramentas no contexto significa que o agente passa por todos eles em cada decisão. Os investigadores documentaram o que designam por <em>podridão do contexto</em> - a degradação da qualidade do raciocínio devido à sobrecarga de contexto. Nos testes realizados, a precisão da seleção de ferramentas desceu de 43% para menos de 14% à medida que o número de ferramentas aumentava. Mais ferramentas, paradoxalmente, significam uma pior utilização das ferramentas.</p>
<p>A causa principal é arquitetónica. O MCP carrega todas as descrições de ferramentas na íntegra no início da sessão, independentemente de a conversa atual vir a usá-las. Trata-se de uma escolha de conceção ao nível do protocolo, não de um erro - mas o custo aumenta com cada ferramenta que se acrescenta.</p>
<p>As competências dos agentes adoptam uma abordagem diferente: <strong>divulgação progressiva</strong>. No início da sessão, um agente lê apenas os metadados de cada habilidade - nome, descrição de uma linha, condição de acionamento. Um total de algumas dezenas de tokens. O conteúdo completo da habilidade é carregado somente quando o agente determina que é relevante. Pense nisso desta forma: O MCP alinha todas as ferramentas à porta e obriga-o a escolher; o Skills dá-lhe primeiro um índice e o conteúdo completo a pedido.</p>
<p>As ferramentas CLI oferecem uma vantagem semelhante. Um agente executa git --help ou docker --help para descobrir recursos sob demanda, sem pré-carregar cada definição de parâmetro. O custo do contexto é pago à medida que se vai utilizando, e não à cabeça.</p>
<p>Em pequena escala, a diferença é insignificante. Em escala de produção, é a diferença entre um agente que funciona e um que se afoga em suas próprias definições de ferramentas.</p>
<h2 id="MCPs-Passive-Architecture-Limits-Agent-Workflows" class="common-anchor-header">A arquitetura passiva do MCP limita os fluxos de trabalho do agente<button data-href="#MCPs-Passive-Architecture-Limits-Agent-Workflows" class="anchor-icon" translate="no">
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
    </button></h2><p>O MCP é um protocolo de chamada de ferramenta: como descobrir ferramentas, chamá-las e receber resultados. Design limpo para casos de uso simples. Mas essa limpeza é também uma restrição.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_4_f80de07814.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Flat-Tool-Space-with-No-Hierarchy" class="common-anchor-header">Espaço de ferramentas plano sem hierarquia</h3><p>Uma ferramenta MCP é uma assinatura de função plana. Sem subcomandos, sem conhecimento do ciclo de vida da sessão, sem noção de onde o agente está num fluxo de trabalho de várias etapas. Fica à espera de ser chamado. É só isso que ele faz.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_5_e7f3630e1f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Um CLI funciona de forma diferente. git commit, git push e git log são caminhos de execução completamente diferentes que partilham uma única interface. Um agente executa --help, explora a superfície disponível de forma incremental e expande apenas o que precisa - sem carregar toda a documentação de parâmetros no contexto.</p>
<h3 id="Skills-Encode-Workflow-Logic--MCP-Cant" class="common-anchor-header">As habilidades codificam a lógica do fluxo de trabalho - o MCP não pode</h3><p>Uma competência de agente é um ficheiro Markdown que contém um procedimento operacional padrão: o que fazer primeiro, o que fazer a seguir, como lidar com falhas e quando apresentar algo ao utilizador. O agente recebe não apenas uma ferramenta, mas todo um fluxo de trabalho. As competências moldam ativamente a forma como um agente se comporta durante uma conversa - o que as desencadeia, o que preparam antecipadamente e como recuperam de erros. As ferramentas MCP só podem esperar.</p>
<h3 id="MCP-Cant-Access-the-Agents-LLM" class="common-anchor-header">A MCP não consegue aceder ao LLM do agente</h3><p>Esta é a limitação que realmente nos impediu.</p>
<p>Quando construímos <a href="https://github.com/zilliztech/claude-context">o claude-context</a> - um plugin MCP que adiciona <a href="https://zilliz.com/glossary/semantic-search">pesquisa semântica</a> ao Claude Code e outros agentes de codificação de IA, dando-lhes um contexto profundo de toda uma base de código - queríamos recuperar trechos de conversas históricas relevantes do Milvus e apresentá-los como contexto. A recuperação da <a href="https://zilliz.com/learn/vector-similarity-search">pesquisa vetorial</a> funcionou. O problema era o que fazer com os resultados.</p>
<p>Recuperar os 10 melhores resultados, e talvez 3 sejam úteis. Os outros 7 são ruído. Entregue todos os 10 ao agente externo, e o ruído interfere na resposta. Nos testes, vimos que as respostas se distraíam com registos históricos irrelevantes. Precisávamos de filtrar antes de passar os resultados.</p>
<p>Tentámos várias abordagens. Adicionar uma etapa de reavaliação dentro do servidor MCP utilizando um modelo pequeno: não era suficientemente exato e o limiar de relevância precisava de ser ajustado por caso de utilização. Usar um modelo grande para reavaliação: tecnicamente correto, mas um servidor MCP é executado como um processo separado, sem acesso ao LLM do agente externo. Teríamos que configurar um cliente LLM separado, gerenciar uma chave de API separada e lidar com um caminho de chamada separado.</p>
<p>O que queríamos era simples: deixar o LLM do agente externo participar diretamente da decisão de filtragem. Recuperar os 10 melhores, deixar o próprio agente julgar o que vale a pena manter e retornar apenas os resultados relevantes. Sem um segundo modelo. Sem chaves API adicionais.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_6_aca200f359.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O MCP não pode fazer isso. O limite do processo entre o servidor e o agente é também um limite de inteligência. O servidor não pode usar o LLM do agente; o agente não pode controlar o que acontece dentro do servidor. É ótimo para ferramentas CRUD simples. No momento em que uma ferramenta precisa de fazer um julgamento, esse isolamento torna-se um verdadeiro constrangimento.</p>
<p>Uma Habilidade de Agente resolve isto diretamente. Uma competência de recuperação pode chamar a pesquisa vetorial para os 10 melhores, fazer com que o LLM do próprio agente avalie a relevância e devolver apenas o que for aprovado. Nenhum modelo adicional. O agente faz a filtragem sozinho.</p>
<h2 id="What-We-Built-Instead-with-CLI-and-Skills" class="common-anchor-header">O que criámos em vez disso com CLI e Skills<button data-href="#What-We-Built-Instead-with-CLI-and-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p>Vemos a CLI + Skills como a direção para a interação agente-ferramenta - não apenas para a recuperação de memória, mas em toda a pilha. Esta convicção orienta tudo o que estamos a construir.</p>
<h3 id="memsearch-A-Skills-Based-Memory-Layer-for-AI-Agents" class="common-anchor-header">memsearch: Uma camada de memória baseada em habilidades para agentes de IA</h3><p>Criámos <a href="https://github.com/zilliztech/memsearch">o memsearch</a>, uma camada de memória de código aberto para o Claude Code e outros agentes de IA. A habilidade é executada dentro de um subagente com três estágios: O Milvus trata da pesquisa vetorial inicial para uma descoberta alargada, o LLM do próprio agente avalia a relevância e expande o contexto para resultados promissores, e uma pesquisa final acede às conversas originais apenas quando necessário. O ruído é eliminado em cada fase - o lixo da recuperação intermédia nunca chega à janela de contexto primário.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_7_7c85103513.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A principal conclusão: a inteligência do agente faz parte da execução da ferramenta. O LLM que já está no ciclo faz a filtragem - sem segundo modelo, sem chave API extra, sem ajuste de limiar frágil. Este é um caso de utilização específico - recuperação de contexto de conversação para agentes de codificação - mas a arquitetura é generalizável a qualquer cenário em que uma ferramenta necessite de julgamento e não apenas de execução.</p>
<h3 id="Zilliz-CLI-Skills-and-Plugin-for-Vector-Database-Operations" class="common-anchor-header">Zilliz CLI, Skills e Plugin para Operações de Bases de Dados Vectoriais</h3><p>Milvus é a base de dados vetorial open-source mais adoptada do mundo, com <a href="https://github.com/milvus-io/milvus">mais de 43 mil estrelas no GitHub</a>. <a href="https://zilliz.com/cloud">O Zilliz Cloud</a> é o serviço totalmente gerido do Milvus com funcionalidades empresariais avançadas e é muito mais rápido do que o Milvus.</p>
<p>A mesma arquitetura em camadas mencionada acima impulsiona as nossas ferramentas de desenvolvimento:</p>
<ul>
<li><a href="https://docs.zilliz.com/reference/cli/overview">O Zilliz CLI</a> é a camada de infraestrutura. Gestão de clusters, <a href="https://milvus.io/docs/manage-collections.md">operações de recolha</a>, pesquisa de vectores, <a href="https://milvus.io/docs/rbac.md">RBAC</a>, cópias de segurança, faturação - tudo o que faria na consola do Zilliz Cloud, disponível a partir do terminal. Os humanos e os agentes utilizam os mesmos comandos. O Zilliz CLI também serve de base para o Milvus Skills e o Zilliz Skills.</li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md">O Milvus Skill</a> é a camada de conhecimento para o Milvus de código aberto. Ele ensina os agentes de codificação de IA (Claude Code, Cursor, Codex, GitHub Copilot) a operar qualquer implantação do Milvus - <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>, Standalone ou Distributed - por meio do código Python <a href="https://milvus.io/docs/install-pymilvus.md">do pymilvus</a>: conexões, <a href="https://milvus.io/docs/schema-hands-on.md">design de esquema</a>, CRUD, <a href="https://zilliz.com/learn/hybrid-search-with-milvus">pesquisa híbrida</a>, <a href="https://milvus.io/docs/full-text-search.md">pesquisa de texto completo</a>, <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">pipelines RAG</a>.</li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-skill">O Zilliz Skill</a> faz o mesmo para o Zilliz Cloud, ensinando os agentes a gerir a infraestrutura da nuvem através do Zilliz CLI.</li>
<li><a href="https://github.com/zilliztech/zilliz-plugin">O Zilliz Plugin</a> é a camada de experiência do programador para o Claude Code - envolve o CLI + Skill numa experiência guiada com comandos de barra como /zilliz:quickstart e /zilliz:status.</li>
</ul>
<p>A CLI lida com a execução, as Skills codificam o conhecimento e a lógica do fluxo de trabalho, o Plugin fornece o UX. Nenhum servidor MCP no circuito.</p>
<p>Para obter mais detalhes, confira estes recursos:</p>
<ul>
<li><a href="https://zilliz.com/blog/introducing-zilliz-cli-and-agent-skills-for-zilliz-cloud">Apresentando o Zilliz CLI e o Agent Skills para o Zilliz Cloud</a></li>
<li><a href="https://zilliz.com/blog/zilliz-cloud-just-landed-in-claude-code">O Zilliz Cloud acaba de aterrar no Claude Code</a></li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-ai-prompts">Prompts de IA - Centro de desenvolvimento do Zilliz Cloud</a></li>
<li><a href="https://docs.zilliz.com/reference/cli/overview">Referência da CLI do Zilliz - Centro de desenvolvimento do Zilliz Cloud</a></li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-skill">Habilidade do Zilliz - Centro de desenvolvimento do Zilliz Cloud</a></li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md">Milvus para agentes de IA - Documentação do Milvus</a></li>
</ul>
<h2 id="Is-MCP-Actually-Dying" class="common-anchor-header">O MCP está realmente morrendo?<button data-href="#Is-MCP-Actually-Dying" class="anchor-icon" translate="no">
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
    </button></h2><p>Muitos desenvolvedores e empresas, incluindo nós aqui na Zilliz, estão se voltando para CLI e Skills. Mas será que o MCP está mesmo a morrer?</p>
<p>A resposta curta: não - mas o seu âmbito está a diminuir para onde realmente se encaixa.</p>
<p>O MCP foi doado à Linux Foundation. Os servidores activos são mais de 10.000. Os downloads mensais do SDK são de 97 milhões. Um ecossistema desse tamanho não desaparece por causa de um comentário numa conferência.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_8_b2246e6825.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Um tópico do Hacker News - <em>"Quando é que o MCP faz sentido vs CLI?"</em> - obteve respostas que favoreceram maioritariamente o CLI: "As ferramentas CLI são como instrumentos de precisão", "Os CLIs também são mais rápidos do que os MCPs". Alguns desenvolvedores têm uma visão mais equilibrada: Habilidades são uma receita detalhada que ajuda a resolver um problema melhor; MCP é a ferramenta que ajuda a resolver o problema. Ambas têm o seu lugar.</p>
<p>Isso é justo - mas levanta uma questão prática. Se a receita em si pode orientar o agente sobre quais as ferramentas a utilizar e como, será ainda necessário um protocolo de distribuição de ferramentas separado?</p>
<p>Depende do caso de uso.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_9_e2cb28812b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>O MCP sobre stdio</strong> - a versão que a maioria dos programadores executa localmente - é onde os problemas se acumulam: comunicação instável entre processos, isolamento de ambiente confuso, elevado custo de token. Nesse contexto, existem alternativas melhores para quase todos os casos de utilização.</p>
<p><strong>A MCP sobre HTTP</strong> é uma história diferente. As plataformas de ferramentas internas da empresa precisam de gerenciamento centralizado de permissões, OAuth unificado, telemetria e registro padronizados. As ferramentas fragmentadas de CLI realmente lutam para fornecer isso. A arquitetura centralizada do MCP tem um valor real nesse contexto.</p>
<p>O que a Perplexity realmente abandonou foi principalmente o caso de uso stdio. Denis Yarats especificou "internamente" e não apelou à adoção dessa opção por toda a indústria. Essa nuance perdeu-se na transmissão - "Perplexity abandona MCP" espalha-se consideravelmente mais depressa do que "Perplexity desprioriza MCP em vez de stdio para integração interna de ferramentas".</p>
<p>O CIM surgiu porque resolveu um problema real: antes dele, cada aplicação de IA escrevia a sua própria lógica de chamada de ferramentas, sem um padrão partilhado. O MCP forneceu uma interface unificada no momento certo, e o ecossistema desenvolveu-se rapidamente. A experiência de produção revelou então as limitações. Esse é um arco normal para ferramentas de infraestrutura - não uma sentença de morte.</p>
<h2 id="When-to-Use-MCP-CLI-or-Skills" class="common-anchor-header">Quando usar MCP, CLI ou Skills<button data-href="#When-to-Use-MCP-CLI-or-Skills" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th></th><th>MCP sobre stdio (Local)</th><th>MCP sobre HTTP (Empresa)</th></tr>
</thead>
<tbody>
<tr><td><strong>Autenticação</strong></td><td>Nenhuma</td><td>OAuth, centralizado</td></tr>
<tr><td><strong>Estabilidade da conexão</strong></td><td>Problemas de isolamento de processos</td><td>HTTPS estável</td></tr>
<tr><td><strong>Registo de dados</strong></td><td>Nenhum mecanismo padrão</td><td>Telemetria centralizada</td></tr>
<tr><td><strong>Controlo de acesso</strong></td><td>Nenhum</td><td>Permissões baseadas em funções</td></tr>
<tr><td><strong>A nossa opinião</strong></td><td>Substituir por CLI + Skills</td><td>Manter para ferramentas empresariais</td></tr>
</tbody>
</table>
<p>Para as equipas que escolhem a sua pilha de ferramentas de <a href="https://zilliz.com/glossary/ai-agents">IA agêntica</a>, eis como as camadas se encaixam:</p>
<table>
<thead>
<tr><th>Camada</th><th>O que ela faz</th><th>Melhor para</th><th>Exemplos</th></tr>
</thead>
<tbody>
<tr><td><strong>CLI</strong></td><td>Tarefas operacionais, gestão de infra-estruturas</td><td>Comandos executados por agentes e humanos</td><td>git, docker, zilliz-cli</td></tr>
<tr><td><strong>Competências</strong></td><td>Lógica do fluxo de trabalho do agente, conhecimento codificado</td><td>Tarefas que necessitam de julgamento LLM, SOPs de várias etapas</td><td>milvus-skill, zilliz-skill, memsearch</td></tr>
<tr><td><strong>APIs REST</strong></td><td>Integrações externas</td><td>Ligação a serviços de terceiros</td><td>API do GitHub, API do Slack</td></tr>
<tr><td><strong>MCP HTTP</strong></td><td>Plataformas de ferramentas empresariais</td><td>Autenticação centralizada, registo de auditoria</td><td>Gateways de ferramentas internas</td></tr>
</tbody>
</table>
<h2 id="Get-Started" class="common-anchor-header">Comece a usar<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>Tudo o que discutimos neste artigo está disponível hoje:</p>
<ul>
<li><a href="https://github.com/zilliztech/memsearch"><strong>memsearch</strong></a> - a camada de memória baseada em habilidades para agentes de IA. Coloque-a no Claude Code ou em qualquer agente que suporte Skills.</li>
<li><a href="https://docs.zilliz.com/reference/cli/overview"><strong>Zilliz CLI</strong></a> - gere o Milvus e o Zilliz Cloud a partir do seu terminal. Instale-o e explore os subcomandos que os seus agentes podem utilizar.</li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md"><strong>Milvus Skill</strong></a> e <a href="https://docs.zilliz.com/docs/agents/zilliz-skill"><strong>Zilliz Sk</strong></a> ill - dê ao seu agente de codificação de IA conhecimentos nativos do Milvus e do Zilliz Cloud.</li>
</ul>
<p>Tem dúvidas sobre pesquisa vetorial, arquitetura de agente ou criação com CLI e Skills? Junte-se à <a href="https://discord.com/invite/8uyFbECzPX">comunidade Milvus Disc</a> ord ou <a href="https://milvus.io/office-hours">reserve uma sessão gratuita do Office Hours</a> para falar sobre o seu caso de utilização.</p>
<p>Pronto para construir? Registe-se <a href="https://cloud.zilliz.com/signup">no Zilliz Cloud</a> - as novas contas com um e-mail de trabalho recebem $100 em créditos gratuitos. Já tem uma conta? <a href="https://cloud.zilliz.com/login">Inicie sessão aqui</a>.</p>
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
    </button></h2><h3 id="What-is-wrong-with-MCP-for-AI-agents" class="common-anchor-header">Qual é o problema do MCP para agentes de IA?</h3><p>O MCP tem três limitações arquitectónicas principais na produção. Primeiro, ele carrega todos os esquemas de ferramentas na janela de contexto no início da sessão - conectar apenas três servidores MCP em um modelo de 200 mil tokens pode consumir mais de 70% do contexto disponível antes que o agente faça qualquer coisa. Em segundo lugar, as ferramentas CIM são passivas: esperam ser chamadas e não podem codificar fluxos de trabalho de várias etapas, lógica de tratamento de erros ou procedimentos operacionais padrão. Em terceiro lugar, os servidores MCP são executados como processos separados sem acesso ao LLM do agente, pelo que qualquer ferramenta que necessite de julgamento (como a filtragem de resultados de pesquisa por relevância) requer a configuração de um modelo separado com a sua própria chave API. Estes problemas são mais graves com o MCP sobre stdio; o MCP sobre HTTP atenua alguns deles.</p>
<h3 id="What-is-the-difference-between-MCP-and-Agent-Skills" class="common-anchor-header">Qual é a diferença entre o CIM e as Competências de Agente?</h3><p>O MCP é um protocolo de chamada de ferramenta que define como um agente descobre e invoca ferramentas externas. Uma Habilidade de Agente é um arquivo Markdown que contém um procedimento operacional padrão completo - gatilhos, instruções passo a passo, tratamento de erros e regras de escalonamento. A principal diferença arquitetónica: As habilidades são executadas dentro do processo do agente, para que possam aproveitar o LLM do próprio agente para chamadas de julgamento, como filtragem de relevância ou reanálise de resultados. As ferramentas MCP são executadas num processo separado e não podem aceder à inteligência do agente. As habilidades também usam a divulgação progressiva - apenas metadados leves são carregados na inicialização, com o conteúdo completo sendo carregado sob demanda - mantendo o uso da janela de contexto mínimo em comparação com o carregamento de esquema inicial do MCP.</p>
<h3 id="When-should-I-still-use-MCP-instead-of-CLI-or-Skills" class="common-anchor-header">Quando é que devo continuar a utilizar a MCP em vez da CLI ou do Skills?</h3><p>O MCP sobre HTTP ainda faz sentido para plataformas de ferramentas empresariais onde é necessário OAuth centralizado, controlo de acesso baseado em funções, telemetria padronizada e registo de auditoria em muitas ferramentas internas. Ferramentas CLI fragmentadas lutam para fornecer esses requisitos corporativos de forma consistente. Para fluxos de trabalho de desenvolvimento local - em que os agentes interagem com ferramentas em sua máquina - a CLI + Skills normalmente oferece melhor desempenho, menor sobrecarga de contexto e lógica de fluxo de trabalho mais flexível do que o MCP sobre stdio.</p>
<h3 id="How-do-CLI-tools-and-Agent-Skills-work-together" class="common-anchor-header">Como as ferramentas da CLI e as habilidades do agente trabalham juntas?</h3><p>A CLI fornece a camada de execução (os comandos reais), enquanto as Skills fornecem a camada de conhecimento (quando executar quais comandos, em que ordem e como lidar com falhas). Por exemplo, o Zilliz CLI trata de operações de infraestrutura como a gestão de clusters, CRUD de colecções e pesquisa de vectores. O Milvus Skill ensina ao agente os padrões pymilvus corretos para a conceção de esquemas, pesquisa híbrida e pipelines RAG. A CLI faz o trabalho; a Skill conhece o fluxo de trabalho. Este padrão em camadas - CLI para execução, Skills para conhecimento, um plugin para UX - é a forma como estruturámos todas as nossas ferramentas de desenvolvimento na Zilliz.</p>
<h3 id="MCP-vs-Skills-vs-CLI-when-should-I-use-each" class="common-anchor-header">MCP vs Skills vs CLI: quando devo usar cada um?</h3><p>Ferramentas CLI como git, docker, ou zilliz-cli são melhores para tarefas operacionais - elas expõem subcomandos hierárquicos e carregam a pedido. Habilidades como milvus-skill são melhores para a lógica de fluxo de trabalho do agente - elas carregam procedimentos operacionais, recuperação de erros e podem acessar o LLM do agente. O MCP sobre HTTP ainda se encaixa em plataformas de ferramentas empresariais que precisam de OAuth centralizado, permissões e registo de auditoria. O MCP sobre stdio - a versão local - está a ser substituído por CLI + Skills na maioria das configurações de produção.</p>
