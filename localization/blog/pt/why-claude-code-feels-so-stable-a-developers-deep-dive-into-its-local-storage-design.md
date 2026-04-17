---
id: >-
  why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md
title: >-
  Por que o código do Claude parece tão estável: Um mergulho profundo de um
  desenvolvedor em seu design de armazenamento local
author: Bill Chen
date: 2026-01-30T00:00:00.000Z
cover: assets.zilliz.com/cover_Claudecode_storage_81155960ef.jpeg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Claude, Claude Code, Vector Database, Retreival Augmented Generation, Milvus'
meta_keywords: 'Claude Code, AI agent, AI coding assistant, Agent memory'
meta_title: |
  How Claude Code Manages Local Storage for AI Agents
desc: >-
  Mergulhe fundo no armazenamento do Claude Code: Logs de sessão JSONL,
  isolamento de projeto, configuração em camadas e instantâneos de arquivo que
  tornam a codificação assistida por IA estável e recuperável.
origin: >-
  https://milvus.io/blog/why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md
---
<p>O código Claude tem estado em todo o lado ultimamente. Os programadores estão a utilizá-lo para lançar funcionalidades mais rapidamente, automatizar fluxos de trabalho e criar protótipos de agentes que funcionam em projectos reais. O que é ainda mais surpreendente é a quantidade de não-codificadores que também se juntaram a eles - construindo ferramentas, ligando tarefas e obtendo resultados úteis quase sem configuração. É raro ver uma ferramenta de codificação de IA espalhar-se tão rapidamente por tantos níveis de competências diferentes.</p>
<p>O que realmente se destaca, no entanto, é a sensação de <em>estabilidade</em>. O Claude Code lembra-se do que aconteceu em todas as sessões, sobrevive a crashes sem perder o progresso e comporta-se mais como uma ferramenta de desenvolvimento local do que como uma interface de chat. Essa fiabilidade resulta da forma como lida com o armazenamento local.</p>
<p>Em vez de tratar a sua sessão de codificação como um chat temporário, o Claude Code lê e escreve ficheiros reais, armazena o estado do projeto no disco e regista cada passo do trabalho do agente. As sessões podem ser retomadas, inspecionadas ou revertidas sem suposições, e cada projeto permanece isolado de forma limpa, evitando os problemas de contaminação cruzada que muitas ferramentas de agente enfrentam.</p>
<p>Neste post, vamos dar uma olhada mais de perto na arquitetura de armazenamento por trás dessa estabilidade e por que ela desempenha um papel tão importante em fazer o Claude Code parecer prático para o desenvolvimento diário.</p>
<h2 id="Challenges-Every-Local-AI-Coding-Assistant-Faces" class="common-anchor-header">Desafios que todo assistente local de codificação de IA enfrenta<button data-href="#Challenges-Every-Local-AI-Coding-Assistant-Faces" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de explicar como o Claude Code aborda o armazenamento, vamos dar uma olhada nos problemas comuns que as ferramentas locais de codificação de IA tendem a enfrentar. Estes surgem naturalmente quando um assistente trabalha diretamente no seu sistema de ficheiros e mantém o estado ao longo do tempo.</p>
<p><strong>1. Os dados do projeto são misturados entre os espaços de trabalho.</strong></p>
<p>A maioria dos programadores alterna entre vários repositórios ao longo do dia. Se um assistente transporta o estado de um projeto para outro, torna-se mais difícil compreender o seu comportamento e mais fácil para ele fazer suposições incorrectas. Cada projeto precisa do seu próprio espaço limpo e isolado para o estado e o histórico.</p>
<p><strong>2. Os crashes podem causar perda de dados.</strong></p>
<p>Durante uma sessão de programação, um assistente produz um fluxo constante de dados úteis - edições de ficheiros, chamadas de ferramentas, passos intermédios. Se estes dados não forem guardados de imediato, uma falha ou reinício forçado pode eliminá-los. Um sistema fiável grava o estado importante no disco assim que é criado para que o trabalho não se perca inesperadamente.</p>
<p><strong>3. Nem sempre é claro o que o agente realmente fez.</strong></p>
<p>Uma sessão típica envolve muitas acções pequenas. Sem um registo claro e ordenado dessas acções, é difícil reconstituir a forma como o assistente chegou a um determinado resultado ou localizar o passo em que algo correu mal. Um histórico completo torna a depuração e a revisão muito mais fáceis de gerir.</p>
<p><strong>4. Desfazer os erros exige demasiado esforço.</strong></p>
<p>Por vezes, o assistente efectua alterações que não funcionam corretamente. Se não tiver uma forma integrada de reverter essas alterações, acaba por ter de procurar manualmente as edições no repositório. O sistema deve rastrear automaticamente o que foi alterado para que possa desfazê-lo de forma limpa sem trabalho extra.</p>
<p><strong>5. Projectos diferentes precisam de configurações diferentes.</strong></p>
<p>Os ambientes locais variam. Alguns projectos requerem permissões, ferramentas ou regras de diretório específicas; outros têm scripts ou fluxos de trabalho personalizados. Um assistente precisa respeitar essas diferenças e permitir configurações por projeto, mantendo seu comportamento central consistente.</p>
<h2 id="The-Storage-Design-Principles-Behind-Claude-Code" class="common-anchor-header">Os princípios de design de armazenamento por trás do Claude Code<button data-href="#The-Storage-Design-Principles-Behind-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>O design de armazenamento do Claude Code é construído em torno de quatro ideias diretas. Elas podem parecer simples, mas juntas abordam os problemas práticos que surgem quando um assistente de IA trabalha diretamente na sua máquina e em vários projetos.</p>
<h3 id="1-Each-project-gets-its-own-storage" class="common-anchor-header">1. Cada projeto tem o seu próprio armazenamento.</h3><p>O Claude Code vincula todos os dados da sessão ao diretório do projeto a que pertencem. Isto significa que as conversas, edições e registos permanecem no projeto de onde vieram e não se infiltram noutros. Manter o armazenamento separado torna o comportamento do assistente mais fácil de compreender e simplifica a inspeção ou eliminação de dados para um repositório específico.</p>
<h3 id="2-Data-is-saved-to-disk-right-away" class="common-anchor-header">2. Os dados são salvos no disco imediatamente.</h3><p>Em vez de manter os dados de interação na memória, o Claude Code grava-os no disco assim que são criados. Cada evento - mensagem, chamada de ferramenta ou atualização de estado - é anexado como uma nova entrada. Se o programa travar ou for fechado inesperadamente, quase tudo ainda estará lá. Esta abordagem mantém as sessões duráveis sem adicionar muita complexidade.</p>
<h3 id="3-Every-action-has-a-clear-place-in-history" class="common-anchor-header">3. Cada ação tem um lugar claro na história.</h3><p>O Claude Code liga cada mensagem e ação da ferramenta à anterior, formando uma sequência completa. Este histórico ordenado permite rever o desenrolar de uma sessão e seguir os passos que levaram a um resultado específico. Para os desenvolvedores, ter esse tipo de rastreamento facilita muito a depuração e a compreensão do comportamento do agente.</p>
<h3 id="4-Code-edits-are-easy-to-roll-back" class="common-anchor-header">4. As edições de código são fáceis de reverter.</h3><p>Antes de o assistente atualizar um ficheiro, o Claude Code guarda um instantâneo do seu estado anterior. Se a alteração se revelar incorrecta, pode restaurar a versão anterior sem ter de procurar no repositório ou adivinhar o que mudou. Esta simples rede de segurança torna as edições feitas por IA muito menos arriscadas.</p>
<h2 id="Claude-Code-Local-Storage-Layout" class="common-anchor-header">Layout do armazenamento local do Claude Code<button data-href="#Claude-Code-Local-Storage-Layout" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code armazena todos os seus dados locais em um único lugar: seu diretório pessoal. Isto mantém o sistema previsível e facilita a inspeção, depuração ou limpeza quando necessário. O layout de armazenamento é construído em torno de dois componentes principais: um pequeno arquivo de configuração global e um diretório de dados maior, onde fica todo o estado do projeto.</p>
<p><strong>Dois componentes principais:</strong></p>
<ul>
<li><p><code translate="no">~/.claude.json</code>Armazena a configuração global e os atalhos, incluindo mapeamentos de projeto, configurações do servidor MCP e prompts usados recentemente.</p></li>
<li><p><code translate="no">~/.claude/</code>O diretório de dados principal, onde o Claude Code armazena conversas, sessões de projeto, permissões, plug-ins, habilidades, histórico e dados de tempo de execução relacionados.</p></li>
</ul>
<p>De seguida, vamos analisar mais detalhadamente estes dois componentes principais.</p>
<p><strong>(1) Configuração global</strong>: <code translate="no">~/.claude.json</code></p>
<p>Este ficheiro funciona como um índice e não como um armazenamento de dados. Regista os projectos em que trabalhou, as ferramentas que estão associadas a cada projeto e os prompts que utilizou recentemente. Os dados de conversação em si não são armazenados aqui.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;projects&quot;</span>: {
    <span class="hljs-string">&quot;/Users/xxx/my-project&quot;</span>: {
      <span class="hljs-string">&quot;mcpServers&quot;</span>: {
        <span class="hljs-string">&quot;jarvis-tasks&quot;</span>: {
          <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stdio&quot;</span>,
          <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;python&quot;</span>,
          <span class="hljs-string">&quot;args&quot;</span>: [<span class="hljs-string">&quot;/path/to/run_mcp.py&quot;</span>]
        }
      }
    }
  },
  <span class="hljs-string">&quot;recentPrompts&quot;</span>: [
    <span class="hljs-string">&quot;Fix the bug in auth module&quot;</span>,
    <span class="hljs-string">&quot;Add unit tests&quot;</span>
  ]
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Diretório de dados principal</strong>: <code translate="no">~/.claude/</code></p>
<p>O diretório <code translate="no">~/.claude/</code> é onde reside a maior parte do estado local do Claude Code. A sua estrutura reflecte algumas ideias centrais de design: isolamento de projectos, persistência imediata e recuperação segura de erros.</p>
<pre><code translate="no">~/.claude/
├── settings.json                    <span class="hljs-comment"># Global settings (permissions, plugins, cleanup intervals)</span>
├── settings.local.json              <span class="hljs-comment"># Local settings (machine-specific, not committed to Git)</span>
├── history.jsonl                    <span class="hljs-comment"># Command history</span>
│
├── projects/                        <span class="hljs-comment"># 📁 Session data (organized by project, core directory)</span>
│   └── -Users-xxx-project/          <span class="hljs-comment"># Path-encoded project directory</span>
│       ├── {session-<span class="hljs-built_in">id</span>}.jsonl       <span class="hljs-comment"># Primary session data (JSONL format)</span>
│       └── agent-{agentId}.jsonl    <span class="hljs-comment"># Sub-agent session data</span>
│
├── session-env/                     <span class="hljs-comment"># Session environment variables</span>
│   └── {session-<span class="hljs-built_in">id</span>}/                <span class="hljs-comment"># Isolated by session ID</span>
│
├── skills/                          <span class="hljs-comment"># 📁 User-level skills (globally available)</span>
│   └── mac-mail/
│       └── SKILL.md
│
├── plugins/                         <span class="hljs-comment"># 📁 Plugin management</span>
│   ├── config.json                  <span class="hljs-comment"># Global plugin configuration</span>
│   ├── installed_plugins.json       <span class="hljs-comment"># List of installed plugins</span>
│   ├── known_marketplaces.json      <span class="hljs-comment"># Marketplace source configuration</span>
│   ├── cache/                       <span class="hljs-comment"># Plugin cache</span>
│   └── marketplaces/
│       └── anthropic-agent-skills/
│           ├── .claude-plugin/
│           │   └── marketplace.json
│           └── skills/
│               ├── pdf/
│               ├── docx/
│               └── frontend-design/
│
├── todos/                           <span class="hljs-comment"># Task list storage</span>
│   └── {session-<span class="hljs-built_in">id</span>}-*.json          <span class="hljs-comment"># Session-linked task files</span>
│
├── file-history/                    <span class="hljs-comment"># File edit history (stored by content hash)</span>
│   └── {content-<span class="hljs-built_in">hash</span>}/              <span class="hljs-comment"># Hash-named backup directory</span>
│
├── shell-snapshots/                 <span class="hljs-comment"># Shell state snapshots</span>
├── plans/                           <span class="hljs-comment"># Plan Mode storage</span>
├── local/                           <span class="hljs-comment"># Local tools / node_modules</span>
│   └── claude                       <span class="hljs-comment"># Claude CLI executable</span>
│   └── node_modules/                <span class="hljs-comment"># Local dependencies</span>
│
├── statsig/                         <span class="hljs-comment"># Feature flag cache</span>
├── telemetry/                       <span class="hljs-comment"># Telemetry data</span>
└── debug/                           <span class="hljs-comment"># Debug logs</span>
<button class="copy-code-btn"></button></code></pre>
<p>Este layout é intencionalmente simples: tudo o que o Claude Code gera vive em um diretório, organizado por projeto e sessão. Não há nenhum estado oculto espalhado pelo seu sistema, e é fácil inspecionar ou limpar quando necessário.</p>
<h2 id="How-Claude-Code-Manages-Configuration" class="common-anchor-header">Como o Claude Code gerencia a configuração<button data-href="#How-Claude-Code-Manages-Configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>O sistema de configuração do Claude Code é projetado em torno de uma idéia simples: manter o comportamento padrão consistente entre as máquinas, mas ainda permitir que ambientes e projetos individuais personalizem o que precisam. Para que isso funcione, o Claude Code usa um modelo de configuração de três camadas. Quando a mesma configuração aparece em mais de um lugar, a camada mais específica sempre vence.</p>
<h3 id="The-three-configuration-levels" class="common-anchor-header">Os três níveis de configuração</h3><p>O Claude Code carrega a configuração na seguinte ordem, da prioridade mais baixa para a mais alta:</p>
<pre><code translate="no">┌─────────────────────────────────────────┐
│    <span class="hljs-title class_">Project</span>-level configuration          │  <span class="hljs-title class_">Highest</span> priority
│    project/.<span class="hljs-property">claude</span>/settings.<span class="hljs-property">json</span>        │  <span class="hljs-title class_">Project</span>-specific, overrides other configs
├─────────────────────────────────────────┤
│    <span class="hljs-title class_">Local</span> configuration                  │  <span class="hljs-title class_">Machine</span>-specific, not version-controlled
│    ~<span class="hljs-regexp">/.claude/</span>settings.<span class="hljs-property">local</span>.<span class="hljs-property">json</span>        │  <span class="hljs-title class_">Overrides</span> <span class="hljs-variable language_">global</span> configuration
├─────────────────────────────────────────┤
│    <span class="hljs-title class_">Global</span> configuration                 │  <span class="hljs-title class_">Lowest</span> priority
│    ~<span class="hljs-regexp">/.claude/</span>settings.<span class="hljs-property">json</span>              │  <span class="hljs-title class_">Base</span> <span class="hljs-keyword">default</span> configuration
└─────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>Pode pensar nisto como começar com predefinições globais, depois aplicar ajustes específicos da máquina e, finalmente, aplicar regras específicas do projeto.</p>
<p>A seguir, examinaremos cada nível de configuração em detalhes.</p>
<p><strong>(1) Configuração global</strong>: <code translate="no">~/.claude/settings.json</code></p>
<p>A configuração global define o comportamento padrão do Claude Code em todos os projetos. É aqui que você define as permissões de linha de base, habilita plug-ins e configura o comportamento de limpeza.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;<span class="hljs-variable">$schema</span>&quot;</span>: <span class="hljs-string">&quot;https://json.schemastore.org/claude-code-settings.json&quot;</span>,
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Read(**)&quot;</span>, <span class="hljs-string">&quot;Bash(npm:*)&quot;</span>],
    <span class="hljs-string">&quot;deny&quot;</span>: [<span class="hljs-string">&quot;Bash(rm -rf:*)&quot;</span>],
    <span class="hljs-string">&quot;ask&quot;</span>: [<span class="hljs-string">&quot;Edit&quot;</span>, <span class="hljs-string">&quot;Write&quot;</span>]
  },
  <span class="hljs-string">&quot;enabledPlugins&quot;</span>: {
    <span class="hljs-string">&quot;document-skills@anthropic-agent-skills&quot;</span>: <span class="hljs-literal">true</span>
  },
  <span class="hljs-string">&quot;cleanupPeriodDays&quot;</span>: 30
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Configuração local</strong>: <code translate="no">~/.claude/settings.local.json</code></p>
<p>A configuração local é específica para uma única máquina. Não se destina a ser partilhada ou verificada no controlo de versões. Isto torna-a um bom local para chaves de API, ferramentas locais ou permissões específicas do ambiente.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Bash(git:*)&quot;</span>, <span class="hljs-string">&quot;Bash(docker:*)&quot;</span>]
  },
  <span class="hljs-string">&quot;env&quot;</span>: {
    <span class="hljs-string">&quot;ANTHROPIC_API_KEY&quot;</span>: <span class="hljs-string">&quot;sk-ant-xxx&quot;</span>
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(3) Configuração ao nível do projeto</strong>: <code translate="no">project/.claude/settings.json</code></p>
<p>A configuração ao nível do projeto aplica-se apenas a um único projeto e tem a prioridade mais elevada. É aqui que se definem as regras que devem ser sempre aplicadas quando se trabalha nesse repositório.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Bash(pytest:*)&quot;</span>]
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>Com as camadas de configuração definidas, a próxima pergunta é <strong>como o Claude Code realmente resolve a configuração e as permissões em tempo de execução.</strong></p>
<p><strong>O Claude Code</strong> aplica a configuração em três camadas: começa com padrões globais, depois aplica substituições específicas da máquina e, por fim, aplica regras específicas do projeto. Quando a mesma configuração aparece em vários lugares, a configuração mais específica tem prioridade.</p>
<p>As permissões seguem uma ordem de avaliação fixa:</p>
<ol>
<li><p><strong>negar</strong> - bloqueia sempre</p></li>
<li><p><strong>pedir</strong> - requer confirmação</p></li>
<li><p><strong>permitir</strong> - é executado automaticamente</p></li>
<li><p><strong>predefinição</strong> - aplica-se apenas quando nenhuma regra corresponde</p></li>
</ol>
<p>Isto mantém o sistema seguro por defeito, ao mesmo tempo que dá aos projectos e às máquinas individuais a flexibilidade de que necessitam.</p>
<h2 id="Session-Storage-How-Claude-Code-Persists-Core-Interaction-Data" class="common-anchor-header">Armazenamento de sessão: Como o Claude Code persiste os principais dados de interação<button data-href="#Session-Storage-How-Claude-Code-Persists-Core-Interaction-Data" class="anchor-icon" translate="no">
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
    </button></h2><p>No <strong>Claude Code</strong>, as sessões são a unidade central de dados. Uma sessão captura toda a interação entre o usuário e a IA, incluindo a própria conversa, chamadas de ferramentas, alterações de arquivos e contexto relacionado. O modo como as sessões são armazenadas tem um impacto direto na confiabilidade, na capacidade de depuração e na segurança geral do sistema.</p>
<h3 id="Keep-session-data-separate-for-each-project" class="common-anchor-header">Manter os dados da sessão separados para cada projeto</h3><p>Depois que as sessões são definidas, a próxima pergunta é como <strong>o Claude Code</strong> as armazena de forma a manter os dados organizados e isolados.</p>
<p><strong>O Claude Code</strong> isola os dados da sessão por projeto. As sessões de cada projeto são armazenadas em um diretório derivado do caminho do arquivo do projeto.</p>
<p>O caminho de armazenamento segue este padrão:</p>
<p><code translate="no">~/.claude/projects/ + path-encoded project directory</code></p>
<p>Para criar um nome de diretório válido, caracteres especiais como <code translate="no">/</code>, espaços e <code translate="no">~</code> são substituídos por <code translate="no">-</code>.</p>
<p>Por exemplo:</p>
<p><code translate="no">/Users/bill/My Project → -Users-bill-My-Project</code></p>
<p>Esta abordagem garante que os dados de sessão de diferentes projectos nunca se misturam e podem ser geridos ou removidos por projeto.</p>
<h3 id="Why-sessions-are-stored-in-JSONL-format" class="common-anchor-header">Por que as sessões são armazenadas no formato JSONL</h3><p><strong>O Claude Code</strong> armazena dados de sessão usando JSONL (JSON Lines) em vez de JSON padrão.</p>
<p>Em um arquivo JSON tradicional, todas as mensagens são agrupadas em uma estrutura grande, o que significa que o arquivo inteiro precisa ser lido e reescrito sempre que for alterado. Em contraste, o JSONL armazena cada mensagem como a sua própria linha no ficheiro. Uma linha equivale a uma mensagem, sem qualquer invólucro exterior.</p>
<table>
<thead>
<tr><th>Aspeto</th><th>JSON padrão</th><th>JSONL (Linhas JSON)</th></tr>
</thead>
<tbody>
<tr><td>Como os dados são armazenados</td><td>Uma estrutura grande</td><td>Uma mensagem por linha</td></tr>
<tr><td>Quando os dados são guardados</td><td>Normalmente no final</td><td>Imediatamente, por mensagem</td></tr>
<tr><td>Impacto do crash</td><td>Todo o ficheiro pode quebrar</td><td>Apenas a última linha é afetada</td></tr>
<tr><td>Escrever novos dados</td><td>Reescrever todo o ficheiro</td><td>Acrescentar uma linha</td></tr>
<tr><td>Utilização da memória</td><td>Carregar tudo</td><td>Ler linha a linha</td></tr>
</tbody>
</table>
<p>O JSONL funciona melhor em vários aspectos importantes:</p>
<ul>
<li><p><strong>Gravação imediata:</strong> Cada mensagem é escrita no disco assim que é gerada, em vez de esperar que a sessão termine.</p></li>
<li><p><strong>Resistente a falhas:</strong> Se o programa falhar, apenas a última mensagem inacabada pode ser perdida. Tudo o que foi escrito antes disso permanece intacto.</p></li>
<li><p><strong>Anexos rápidos:</strong> As novas mensagens são adicionadas ao final do ficheiro sem ler ou reescrever os dados existentes.</p></li>
<li><p><strong>Baixa utilização de memória:</strong> Os ficheiros de sessão podem ser lidos uma linha de cada vez, pelo que o ficheiro inteiro não precisa de ser carregado na memória.</p></li>
</ul>
<p>Um ficheiro de sessão JSONL simplificado tem o seguinte aspeto:</p>
<pre><code translate="no">{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:<span class="hljs-string">&quot;Hello&quot;</span>},<span class="hljs-string">&quot;timestamp&quot;</span>:<span class="hljs-string">&quot;2026-01-05T10:00:00Z&quot;</span>}
{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;assistant&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;assistant&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:[{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;text&quot;</span>,<span class="hljs-string">&quot;text&quot;</span>:<span class="hljs-string">&quot;Hi!&quot;</span>}]}}
{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:<span class="hljs-string">&quot;Help me fix this bug&quot;</span>}}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Session-message-types" class="common-anchor-header">Tipos de mensagens de sessão</h3><p>Um ficheiro de sessão regista tudo o que acontece durante uma interação com o Claude Code. Para fazer isso claramente, ele usa diferentes tipos de mensagens para diferentes tipos de eventos.</p>
<ul>
<li><p><strong>As mensagens do utilizador</strong> representam novas entradas no sistema. Isto inclui não só o que o utilizador escreve, mas também os resultados devolvidos pelas ferramentas, como a saída de um comando shell. Do ponto de vista da IA, ambas são entradas às quais ela precisa responder.</p></li>
<li><p><strong>As mensagens do assistente</strong> captam o que o Claude faz em resposta. Estas mensagens incluem o raciocínio da IA, o texto que gera e quaisquer ferramentas que decida utilizar. Também registam detalhes de utilização, como contagens de tokens, para fornecer uma imagem completa da interação.</p></li>
<li><p><strong>Os instantâneos do histórico de ficheiros</strong> são pontos de controlo de segurança criados antes de o Claude modificar quaisquer ficheiros. Ao salvar o estado original do arquivo primeiro, o código do Claude torna possível desfazer as alterações se algo der errado.</p></li>
<li><p><strong>Os resumos</strong> fornecem uma visão geral concisa da sessão e estão ligados ao resultado final. Eles facilitam a compreensão do que foi uma sessão sem repetir cada passo.</p></li>
</ul>
<p>Em conjunto, estes tipos de mensagens registam não só a conversa, mas também a sequência completa de acções e efeitos que ocorrem durante uma sessão.</p>
<p>Para tornar isto mais concreto, vejamos exemplos específicos de mensagens do utilizador e de mensagens do assistente.</p>
<p><strong>(1) Exemplo de mensagens do utilizador:</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
  <span class="hljs-string">&quot;uuid&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;parentUuid&quot;</span>: <span class="hljs-literal">null</span>,
  <span class="hljs-string">&quot;sessionId&quot;</span>: <span class="hljs-string">&quot;e5d52290-e2c1-41d6-8e97-371401502fdf&quot;</span>,
  <span class="hljs-string">&quot;timestamp&quot;</span>: <span class="hljs-string">&quot;2026-01-05T10:00:00.000Z&quot;</span>,
  <span class="hljs-string">&quot;message&quot;</span>: {
    <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
    <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Analyze the architecture of this project&quot;</span>
  },
  <span class="hljs-string">&quot;cwd&quot;</span>: <span class="hljs-string">&quot;/Users/xxx/project&quot;</span>,
  <span class="hljs-string">&quot;gitBranch&quot;</span>: <span class="hljs-string">&quot;main&quot;</span>,
  <span class="hljs-string">&quot;version&quot;</span>: <span class="hljs-string">&quot;2.0.76&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Exemplo de mensagens do assistente:</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;assistant&quot;</span>,
  <span class="hljs-string">&quot;uuid&quot;</span>: <span class="hljs-string">&quot;e684816e-f476-424d-92e3-1fe404f13212&quot;</span>,
  <span class="hljs-string">&quot;parentUuid&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;message&quot;</span>: {
    <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;assistant&quot;</span>,
    <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-string">&quot;claude-opus-4-5-20251101&quot;</span>,
    <span class="hljs-string">&quot;content&quot;</span>: [
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;thinking&quot;</span>,
        <span class="hljs-string">&quot;thinking&quot;</span>: <span class="hljs-string">&quot;The user wants to understand the project architecture, so I need to check the directory structure first...&quot;</span>
      },
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>,
        <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Let me take a look at the project structure first.&quot;</span>
      },
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;tool_use&quot;</span>,
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-string">&quot;toolu_01ABC&quot;</span>,
        <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;Bash&quot;</span>,
        <span class="hljs-string">&quot;input&quot;</span>: {<span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;ls -la&quot;</span>}
      }
    ],
    <span class="hljs-string">&quot;usage&quot;</span>: {
      <span class="hljs-string">&quot;input_tokens&quot;</span>: <span class="hljs-number">1500</span>,
      <span class="hljs-string">&quot;output_tokens&quot;</span>: <span class="hljs-number">200</span>,
      <span class="hljs-string">&quot;cache_read_input_tokens&quot;</span>: <span class="hljs-number">50000</span>
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Session-Messages-Are-Linked" class="common-anchor-header">Como as mensagens de sessão são ligadas</h3><p>O Claude Code não armazena mensagens de sessão como entradas isoladas. Em vez disso, associa-as para formar uma cadeia clara de eventos. Cada mensagem inclui um identificador único (<code translate="no">uuid</code>) e uma referência à mensagem que veio antes dela (<code translate="no">parentUuid</code>). Isto torna possível ver não só o que aconteceu, mas porque é que aconteceu.</p>
<p>Uma sessão começa com uma mensagem do utilizador, que inicia a cadeia. Cada resposta do Claude aponta para a mensagem que a originou. As chamadas de ferramentas e os seus resultados são adicionados da mesma forma, com cada passo ligado ao anterior. Quando a sessão termina, um resumo é anexado à mensagem final.</p>
<p>Como cada passo está ligado, o Claude Code pode reproduzir a sequência completa de acções e compreender como foi produzido um resultado, facilitando muito a depuração e a análise.</p>
<h2 id="Making-Code-Changes-Easy-to-Undo-with-File-Snapshots" class="common-anchor-header">Tornar as alterações de código fáceis de desfazer com instantâneos de ficheiros<button data-href="#Making-Code-Changes-Easy-to-Undo-with-File-Snapshots" class="anchor-icon" translate="no">
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
    </button></h2><p>As edições geradas por IA nem sempre são corretas e, às vezes, vão na direção completamente errada. Para tornar estas alterações seguras para experimentar, o Claude Code utiliza um sistema simples de instantâneos que lhe permite desfazer edições sem ter de procurar em diffs ou limpar manualmente os ficheiros.</p>
<p>A ideia é simples: <strong>antes de o Claude Code modificar um ficheiro, guarda uma cópia do conteúdo original.</strong> Se a edição se revelar um erro, o sistema pode restaurar a versão anterior instantaneamente.</p>
<h3 id="What-is-a-file-history-snapshot" class="common-anchor-header">O que é um <em>instantâneo</em> do <em>histórico de ficheiros</em>?</h3><p>Um instantâneo do <em>histórico de ficheiros</em> é um ponto de controlo criado antes de os ficheiros serem modificados. Regista o conteúdo original de cada ficheiro que <strong>o Claude</strong> está prestes a editar. Esses instantâneos servem como fonte de dados para operações de desfazer e reverter.</p>
<p>Quando um utilizador envia uma mensagem que pode alterar ficheiros, <strong>o Claude Code</strong> cria um instantâneo vazio para essa mensagem. Antes de editar, o sistema faz uma cópia de segurança do conteúdo original de cada ficheiro de destino para o instantâneo e, em seguida, aplica as edições diretamente no disco. Se o utilizador <em>desativar</em> a ação, <strong>o Claude Code</strong> restaura o conteúdo guardado e substitui os ficheiros modificados.</p>
<p>Na prática, o ciclo de vida de uma edição que pode ser desfeita é o seguinte:</p>
<ol>
<li><p><strong>O utilizador envia uma mensagemO Claude</strong>Code cria um registo novo e vazio em <code translate="no">file-history-snapshot</code>.</p></li>
<li><p><strong>O</strong>sistema identifica quais os ficheiros que vão ser editados e faz uma cópia de segurança do seu conteúdo original em <code translate="no">trackedFileBackups</code>.</p></li>
<li><p><strong>O Claude executa a ediçãoAs</strong>operações de<strong>edição</strong>e escrita são efectuadas e o conteúdo modificado é escrito no disco.</p></li>
<li><p>O utilizador desencadeia<strong>a anulaçãoO</strong>utilizador carrega em <strong>Esc + Esc</strong>, indicando que as alterações devem ser revertidas.</p></li>
<li><p>O<strong>conteúdo original é restauradoO</strong>código do<strong>Cláudio</strong>lê o conteúdo guardado em <code translate="no">trackedFileBackups</code> e substitui os ficheiros actuais, concluindo a anulação.</p></li>
</ol>
<h3 id="Why-Undo-Works-Snapshots-Save-the-Old-Version" class="common-anchor-header">Por que o desfazer funciona: Os instantâneos salvam a versão antiga</h3><p>O desfazer no Claude Code funciona porque o sistema salva o conteúdo <em>original</em> do arquivo antes que qualquer edição aconteça.</p>
<p>Em vez de tentar reverter as alterações após o fato, o Claude Code adota uma abordagem mais simples: ele copia o arquivo como ele existia <em>antes da</em> modificação e armazena essa cópia em <code translate="no">trackedFileBackups</code>. Quando o utilizador desencadeia a anulação, o sistema restaura esta versão guardada e substitui o ficheiro editado.</p>
<p>O diagrama abaixo mostra este fluxo passo a passo:</p>
<pre><code translate="no">┌─────────────────────────┐
│    before edit,  app.py │
│    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;old&quot;</span>)         │───────→  Backed up into snapshot trackedFileBackups
└─────────────────────────┘

↓

┌──────────────────────────┐
│   After Claude edits     │
│    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;new&quot;</span>)          │───────→  Written to disk (overwrites the original file)
└──────────────────────────┘

↓

┌──────────────────────────┐
│    User triggers undo    │
│    Press   Esc + Esc     │───────→ Restore <span class="hljs-string">&quot;old&quot;</span> content to disk <span class="hljs-keyword">from</span> snapshot
└──────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<h3 id="What-a-file-History-snapshot-Looks-Like-Internally" class="common-anchor-header">Qual o aspeto interno de um <em>instantâneo do histórico do ficheiro</em> </h3><p>O instantâneo em si é armazenado como um registo estruturado. Captura metadados sobre a mensagem do utilizador, a hora do instantâneo e, o mais importante, um mapa de ficheiros para o seu conteúdo original.</p>
<p>O exemplo abaixo mostra um único registo <code translate="no">file-history-snapshot</code> criado antes de o Claude editar quaisquer ficheiros. Cada entrada em <code translate="no">trackedFileBackups</code> armazena o conteúdo <em>pré-edição</em> de um ficheiro, que é posteriormente utilizado para restaurar o ficheiro durante uma anulação.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;file-history-snapshot&quot;</span>,
  <span class="hljs-string">&quot;messageId&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;snapshot&quot;</span>: {
    <span class="hljs-string">&quot;messageId&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
    <span class="hljs-string">&quot;trackedFileBackups&quot;</span>: {
      <span class="hljs-string">&quot;/path/to/file1.py&quot;</span>: <span class="hljs-string">&quot;Original file content\ndef hello():\n    print(&#x27;old&#x27;)&quot;</span>,
      <span class="hljs-string">&quot;/path/to/file2.js&quot;</span>: <span class="hljs-string">&quot;// Original content...&quot;</span>
    },
    <span class="hljs-string">&quot;timestamp&quot;</span>: <span class="hljs-string">&quot;2026-01-05T10:00:00.000Z&quot;</span>
  },
  <span class="hljs-string">&quot;isSnapshotUpdate&quot;</span>: <span class="hljs-literal">false</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Where-Snapshots-Are-Stored-and-How-Long-They-Are-Kept" class="common-anchor-header">Onde os instantâneos são armazenados e por quanto tempo são mantidos</h3><ul>
<li><p><strong>Onde os metadados do instantâneo são armazenados</strong>: Os registos de instantâneos estão associados a uma sessão específica e são guardados como ficheiros JSONL em<code translate="no">~/.claude/projects/-path-to-project/{session-id}.jsonl</code>.</p></li>
<li><p><strong>Onde é feito o backup do conteúdo original do ficheiro</strong>: O conteúdo pré-edição de cada ficheiro é armazenado separadamente por hash de conteúdo em<code translate="no">~/.claude/file-history/{content-hash}/</code>.</p></li>
<li><p><strong>Durante quanto tempo os instantâneos são mantidos por predefinição</strong>: Os dados dos instantâneos são mantidos durante 30 dias, de acordo com a definição global <code translate="no">cleanupPeriodDays</code>.</p></li>
<li><p><strong>Como alterar o período de retenção</strong>: O número de dias de retenção pode ser ajustado através do campo <code translate="no">cleanupPeriodDays</code> em <code translate="no">~/.claude/settings.json</code>.</p></li>
</ul>
<h3 id="Related-Commands" class="common-anchor-header">Comandos relacionados</h3><table>
<thead>
<tr><th>Comando / Ação</th><th>Descrição</th></tr>
</thead>
<tbody>
<tr><td>Esc + Esc</td><td>Desfazer a ronda mais recente de edições de ficheiros (mais frequentemente utilizado)</td></tr>
<tr><td>/rewind</td><td>Reverter para um ponto de controlo previamente especificado (snapshot)</td></tr>
<tr><td>/diff</td><td>Ver as diferenças entre o ficheiro atual e a cópia de segurança do instantâneo</td></tr>
</tbody>
</table>
<h2 id="Other-Important-Directories" class="common-anchor-header">Outros diretórios importantes<button data-href="#Other-Important-Directories" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>(1) plugins/ - Gerenciamento de plugins</strong></p>
<p>O diretório <code translate="no">plugins/</code> armazena add-ons que dão ao Claude Code capacidades extra.</p>
<p>Este diretório guarda os <em>plugins</em> que estão instalados, de onde vieram, e as capacidades extra que esses plugins fornecem. Também guarda cópias locais dos plugins descarregados para que não precisem de ser obtidos novamente.</p>
<pre><code translate="no">~/.claude/plugins/
├── config.json
│   Global plugin configuration (e.g., <span class="hljs-built_in">enable</span>/disable rules)
├── installed_plugins.json
│   List of installed plugins (including version and status)
├── known_marketplaces.json
│   Plugin marketplace <span class="hljs-built_in">source</span> configuration (e.g., Anthropic official marketplace)
├── cache/
│   Plugin download cache (avoids repeated downloads)
└── marketplaces/
    Marketplace <span class="hljs-built_in">source</span> storage
    └── anthropic-agent-skills/
        Official plugin marketplace
        ├── .claude-plugin/
        │   └── marketplace.json
        │       Marketplace metadata
        └── skills/
            Skills provided by the marketplace
            ├── pdf/
            │   PDF-related skills
            ├── docx/
            │   Word document processing skills
            └── frontend-design/
                Frontend design skills
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) skills/ - Onde as habilidades são armazenadas e aplicadas</strong></p>
<p>No Claude Code, uma habilidade é uma capacidade pequena e reutilizável que ajuda o Claude a executar uma tarefa específica, como trabalhar com PDFs, editar documentos ou seguir um fluxo de trabalho de codificação.</p>
<p>Nem todas as habilidades estão disponíveis em todos os lugares. Algumas se aplicam globalmente, enquanto outras são limitadas a um único projeto ou fornecidas por um plug-in. O Claude Code armazena as competências em diferentes locais para controlar onde cada competência pode ser utilizada.</p>
<p>A hierarquia abaixo mostra como as habilidades são colocadas em camadas por escopo, desde as habilidades disponíveis globalmente até as específicas do projeto e as fornecidas por plugins.</p>
<table>
<thead>
<tr><th>Nível</th><th>Local de armazenamento</th><th>Descrição</th></tr>
</thead>
<tbody>
<tr><td>Utilizador</td><td>~/.claude/skills/</td><td>Disponível globalmente, acessível a todos os projectos</td></tr>
<tr><td>Projeto</td><td>projeto/.claude/skills/</td><td>Disponível apenas para o projeto atual, personalização específica do projeto</td></tr>
<tr><td>Plugin</td><td>~/.claude/plugins/marketplaces/*/skills/</td><td>Instalado com plugins, dependente do estado de ativação do plugin</td></tr>
</tbody>
</table>
<p><strong>(3) todos/ - Armazenamento de listas de tarefas</strong></p>
<p>O diretório <code translate="no">todos/</code> armazena listas de tarefas que o Claude cria para acompanhar o trabalho durante uma conversa, como etapas a serem concluídas, itens em andamento e tarefas concluídas.</p>
<p>As listas de tarefas são guardadas como ficheiros JSON em<code translate="no">~/.claude/todos/{session-id}-*.json</code>. Cada nome de ficheiro inclui o ID da sessão, que liga a lista de tarefas a uma conversa específica.</p>
<p>O conteúdo destes ficheiros provém da ferramenta <code translate="no">TodoWrite</code> e inclui informações básicas sobre a tarefa, tais como a descrição da tarefa, o estado atual, a prioridade e os metadados relacionados.</p>
<p><strong>(4) local/ - Tempo de execução local e ferramentas</strong></p>
<p>O diretório <code translate="no">local/</code> contém os principais arquivos que o Claude Code precisa para ser executado em sua máquina.</p>
<p>Isso inclui o executável de linha de comando <code translate="no">claude</code> e o diretório <code translate="no">node_modules/</code> que contém suas dependências de tempo de execução. Ao manter estes componentes locais, o Claude Code pode ser executado de forma independente, sem depender de serviços externos ou instalações em todo o sistema.</p>
<p><strong>（5）Diretórios adicionais de suporte</strong></p>
<ul>
<li><p><strong>shell-snapshots/:</strong> Armazena instantâneos do estado da sessão do shell (como o diretório atual e as variáveis de ambiente), permitindo a reversão da operação do shell.</p></li>
<li><p><strong>plans/:</strong> Armazena planos de execução gerados pelo Modo Plano (e.g., decomposições passo-a-passo de tarefas de programação de múltiplos passos).</p></li>
<li><p><strong>statsig/:</strong> Armazena configurações de sinalizadores de recursos (como se novos recursos estão habilitados) para reduzir solicitações repetidas.</p></li>
<li><p><strong>telemetry/:</strong> Armazena dados de telemetria anónimos (como a frequência de utilização de funcionalidades) para otimização do produto.</p></li>
<li><p><strong>debug/:</strong> Armazena logs de depuração (incluindo pilhas de erros e traços de execução) para ajudar na solução de problemas.</p></li>
</ul>
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
    </button></h2><p>Depois de analisar como o Claude Code armazena e gerencia tudo localmente, a imagem fica bem clara: a ferramenta parece estável porque a base é sólida. Nada extravagante - apenas engenharia bem pensada. Cada projeto tem o seu próprio espaço, cada ação é anotada e as edições de ficheiros são guardadas antes de qualquer alteração. É o tipo de design que faz o seu trabalho calmamente e permite-lhe concentrar-se no seu.</p>
<p>O que mais gosto é que não há nada de místico a acontecer aqui. O Claude Code funciona bem porque o básico está bem feito. Se alguma vez tentou construir um agente que toca em ficheiros reais, sabe como é fácil as coisas correrem mal - o estado mistura-se, as falhas apagam o progresso e o desfazer torna-se um trabalho de adivinhação. O Claude Code evita tudo isso com um modelo de armazenamento que é simples, consistente e difícil de quebrar.</p>
<p>Para as equipas que criam agentes de IA locais ou no local, especialmente em ambientes seguros, esta abordagem mostra como o armazenamento e a persistência fortes tornam as ferramentas de IA fiáveis e práticas para o desenvolvimento diário.</p>
<p>Se estiver a conceber agentes de IA locais ou on-prem e quiser discutir a arquitetura de armazenamento, <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">a</a> conceção de sessões ou a reversão segura em mais pormenor, sinta-se à vontade para se juntar ao nosso <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canal Slack</a>.</p>
