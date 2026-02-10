---
id: >-
  openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md
title: >-
  OpenClaw (Anteriormente Clawdbot e Moltbot) Explicado: Um guia completo para o
  agente autónomo de IA
author: 'Julie Xia, Fendy Feng'
date: 2026-02-10T00:00:00.000Z
cover: assets.zilliz.com/Open_Claw_Autonomous_Agent_Cover_11zon_1_8124f1b98b.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'OpenClaw, Clawdbot, Moltbot, Moltbook, Tutorial'
meta_keywords: 'OpenClaw, Clawdbot, Moltbot, AI agent, autonomous AI agent'
meta_title: |
  What Is OpenClaw? Complete Guide to the Open-Source AI Agent
desc: >-
  Guia completo do OpenClaw (Clawdbot/Moltbot) - como funciona, passo a passo da
  configuração, casos de uso, Moltbook e avisos de segurança.
origin: 'https://milvus.io/blog/openclaw-clawdbot-ai-agent-explained.md'
---
<p><a href="https://openclaw.ai/">OpenClaw</a> (anteriormente conhecido como Moltbot e Clawdbot) é um agente de IA de código aberto que é executado em sua máquina, conecta-se por meio dos aplicativos de mensagens que você já usa (WhatsApp, Telegram, Slack, Signal e outros) e executa ações em seu nome - comandos shell, automação de navegador, e-mail, calendário e operações de arquivo. Um agendador de batimentos cardíacos acorda-o num intervalo configurável para que possa ser executado sem ser solicitado. Ganhou mais de <a href="https://github.com/openclaw/openclaw">100.000</a> estrelas no GitHub em menos de uma semana após o seu lançamento no final de janeiro de 2026, tornando-o num dos repositórios de código aberto com crescimento mais rápido na história do GitHub.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_1_e9bc8881bc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O que torna o OpenClaw distinto é a sua combinação: Licenciado pelo MIT, open-source, local-first (memória e dados armazenados como ficheiros Markdown no seu disco), e extensível à comunidade através de um formato de habilidade portátil. É também onde algumas das experiências mais interessantes em IA agêntica estão a acontecer - o agente de um programador negociou 4.200 dólares de desconto na compra de um carro por e-mail enquanto ele dormia; outro apresentou uma refutação legal a uma recusa de seguro sem ser solicitado; e outro utilizador construiu <a href="https://moltbook.com/">o Moltbook</a>, uma rede social onde mais de um milhão de agentes de IA interagem autonomamente enquanto os humanos observam.</p>
<p>Este guia explica tudo o que precisa de saber: o que é o OpenClaw, como funciona, o que pode fazer na vida real, como se relaciona com o Moltbook e os riscos de segurança que lhe estão associados.</p>
<h2 id="What-is-OpenClaw" class="common-anchor-header">O que é o OpenClaw?<button data-href="#What-is-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://openclawd.ai/">O OpenClaw</a> (anteriormente Clawdbot e Moltbot) é um assistente de IA autónomo e de código aberto que funciona na sua máquina e vive nas suas aplicações de conversação. Você fala com ele pelo WhatsApp, Telegram, <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Slack</a>, Discord, iMessage ou Signal - o que você já usa - e ele responde. Mas, ao contrário do ChatGPT ou da interface web do Claude, o OpenClaw não se limita a responder a perguntas. Ele pode executar comandos shell, controlar seu navegador, ler e gravar arquivos, gerenciar sua agenda e enviar e-mails, tudo isso acionado por uma mensagem de texto.</p>
<p>Foi criado para programadores e utilizadores avançados que pretendem um assistente pessoal de IA que possam enviar mensagens a partir de qualquer lugar - sem sacrificar o controlo sobre os seus dados ou depender de um serviço alojado.</p>
<h3 id="Key-Capabilities-of-OpenClaw" class="common-anchor-header">Principais capacidades do OpenClaw</h3><ul>
<li><p><strong>Gateway multicanal</strong> - WhatsApp, Telegram, Discord e iMessage com um único processo de gateway. Adicione o Mattermost e muito mais com pacotes de extensão.</p></li>
<li><p><strong>Encaminhamento de vários agentes</strong> - sessões isoladas por agente, espaço de trabalho ou remetente.</p></li>
<li><p><strong>Suporte de multimédia</strong> - enviar e receber imagens, áudio e documentos.</p></li>
<li><p><strong>UI de controlo Web</strong> - painel de controlo do navegador para chat, configuração, sessões e nós.</p></li>
<li><p><strong>Nós móveis</strong> - emparelhe nós iOS e Android com suporte para Canvas.</p></li>
</ul>
<h3 id="What-Makes-OpenClaw-Different" class="common-anchor-header">O que torna o OpenClaw diferente?</h3><p><strong>O OpenClaw é auto-hospedado.</strong></p>
<p>O gateway, as ferramentas e a memória do OpenClaw vivem na sua máquina, não num SaaS alojado por um fornecedor. O OpenClaw armazena as conversas, a memória de longo prazo e as competências como ficheiros Markdown e YAML simples no seu espaço de trabalho e em <code translate="no">~/.openclaw</code>. Pode inspeccioná-los em qualquer editor de texto, fazer cópias de segurança com o Git, pesquisar ou eliminá-los. Os modelos de IA podem ser hospedados na nuvem (Anthropic, OpenAI, Google) ou locais (via Ollama, LM Studio ou outros servidores compatíveis com OpenAI), dependendo de como você configura o bloco de modelos. Se quiser que toda a inferência fique no seu hardware, aponte o OpenClaw apenas para modelos locais.</p>
<p><strong>O OpenClaw é totalmente autónomo</strong></p>
<p>O Gateway é executado como um daemon em segundo plano (<code translate="no">systemd</code> no Linux, <code translate="no">LaunchAgent</code> no macOS) com um batimento cardíaco configurável - a cada 30 minutos por defeito, a cada hora com o Anthropic OAuth. Em cada batimento cardíaco, o agente lê uma lista de verificação de <code translate="no">HEARTBEAT.md</code> no espaço de trabalho, decide se algum item requer ação e envia-lhe uma mensagem ou responde <code translate="no">HEARTBEAT_OK</code> (que o Gateway deixa cair silenciosamente). Os eventos externos - webhooks, tarefas cron, mensagens de colegas de equipa - também accionam o ciclo do agente.</p>
<p>O grau de autonomia do agente é uma opção de configuração. As políticas de ferramentas e as aprovações de execução regem as acções de alto risco: pode permitir leituras de correio eletrónico, mas exigir aprovação antes do envio, permitir leituras de ficheiros, mas bloquear as eliminações. Se desativar estas protecções, o agente executa sem pedir.</p>
<p><strong>O OpenClaw é de código aberto.</strong></p>
<p>O núcleo do Gateway é licenciado pelo MIT. É totalmente legível, bifurcável e auditável. Isto é importante no contexto: O Anthropic apresentou uma queixa DMCA contra um programador que desofuscou o cliente do Claude Code; o Codex CLI da OpenAI é Apache 2.0, mas a interface e os modelos da Web são fechados; o Manus é totalmente fechado.</p>
<p>O ecossistema reflecte a abertura. <a href="https://github.com/openclaw/openclaw">Centenas de colaboradores</a> criaram competências - ficheiros <code translate="no">SKILL.md</code> modulares com frontmatter YAML e instruções em linguagem natural - partilhadas através do ClawHub (um registo de competências que o agente pode pesquisar automaticamente), repositórios da comunidade ou URLs diretos. O formato é portátil, compatível com as convenções do Claude Code e do Cursor. Se não existir uma competência, pode descrever a tarefa ao seu agente e pedir-lhe que elabore uma.</p>
<p>Esta combinação de propriedade local, evolução orientada para a comunidade e funcionamento autónomo é a razão pela qual os programadores estão entusiasmados. Para os programadores que querem ter controlo total sobre as suas ferramentas de IA, isso é importante.</p>
<h2 id="How-OpenClaw-Works-Under-the-Hood" class="common-anchor-header">Como o OpenClaw funciona nos bastidores<button data-href="#How-OpenClaw-Works-Under-the-Hood" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Um processo, tudo dentro</strong></p>
<p>Quando executa <code translate="no">openclaw gateway</code>, inicia um único processo Node.js de longa duração chamado Gateway. Esse processo é o sistema inteiro - conexões de canal, estado da sessão, loop do agente, chamadas de modelo, execução de ferramentas, persistência de memória. Não há nenhum serviço separado para gerenciar.</p>
<p>Cinco subsistemas dentro de um processo:</p>
<ol>
<li><p><strong>Adaptadores de canal</strong> - um por plataforma (Baileys para WhatsApp, grammY para Telegram, etc.). Normalizam as mensagens recebidas para um formato comum; serializam as respostas de volta.</p></li>
<li><p><strong>Gestor de sessões</strong> - resolve a identidade do remetente e o contexto da conversa. As mensagens diretas são agrupadas numa sessão principal; as conversas em grupo têm a sua própria sessão.</p></li>
<li><p><strong>Fila</strong> - serializa execuções por sessão. Se uma mensagem chegar a meio da execução, retém-na, injecta-a ou recolhe-a para uma próxima vez.</p></li>
<li><p><strong>Tempo de execução do agente</strong> - reúne o contexto (AGENTS.md, SOUL.md, TOOLS.md, MEMORY.md, registo diário, histórico de conversação) e, em seguida, executa o ciclo do agente: chama o modelo → executa chamadas de ferramentas → retroalimenta os resultados → repete até terminar.</p></li>
<li><p><strong>Plano de controlo</strong> - API WebSocket em <code translate="no">:18789</code>. A CLI, o aplicativo macOS, a interface do usuário da Web e os nós iOS/Android se conectam aqui.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_2_07a24c0492.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O modelo é uma chamada de API externa que pode ou não ser executada localmente. Todo o resto - roteamento, ferramentas, memória, estado - vive dentro desse único processo em sua máquina.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_3_0206219c02.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Para uma solicitação simples, esse loop é concluído em segundos. Cadeias de ferramentas de várias etapas levam mais tempo. O modelo é uma chamada de API externa que pode ou não ser executada localmente, mas todo o resto - roteamento, ferramentas, memória, estado - vive dentro desse único processo em sua máquina.</p>
<p><strong>O mesmo loop do código clássico, um shell diferente</strong></p>
<p>O ciclo do agente - entrada → contexto → modelo → ferramentas → repetição → resposta - é o mesmo padrão que o Código Claude usa. Todas as estruturas de agentes sérias executam alguma versão do mesmo. O que difere é o que o envolve.</p>
<p>O Claude Code envolve-o num <strong>CLI</strong>: digita-se, corre-se, sai-se. O OpenClaw envolve-o num <strong>daemon persistente</strong> ligado a mais de 12 plataformas de mensagens, com um agendador de batimentos cardíacos, gestão de sessões entre canais e memória que persiste entre execuções - mesmo quando não está na sua secretária.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_4_9c481b1ce7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Roteamento de modelos e failover</strong></p>
<p>O OpenClaw é agnóstico em relação ao modelo. Configura os fornecedores em <code translate="no">openclaw.json</code>, e o Gateway encaminha-os em conformidade - com rotação de perfis de autenticação e uma cadeia de fallback que utiliza backoff exponencial quando um fornecedor fica inoperacional. Mas a escolha do modelo é importante, porque o OpenClaw reúne grandes prompts: instruções do sistema, histórico de conversas, esquemas de ferramentas, habilidades e memória. Essa carga de contexto é o motivo pelo qual a maioria das implantações usa um modelo de fronteira como o orquestrador principal, com modelos mais baratos lidando com batimentos cardíacos e tarefas de subagentes.</p>
<p><strong>Compensações entre nuvem e local</strong></p>
<p>Do ponto de vista do Gateway, os modelos de nuvem e local parecem idênticos - são ambos endpoints compatíveis com OpenAI. O que difere são os trade-offs.</p>
<p>Os modelos na nuvem (Anthropic, OpenAI, Google) oferecem um raciocínio forte, grandes janelas de contexto e uma utilização fiável das ferramentas. São a escolha por defeito para o orquestrador principal. O custo escala com a utilização: os utilizadores ligeiros gastam 5 a 20 dólares por mês, os agentes activos com batimentos cardíacos frequentes e grandes prompts custam normalmente 50 a 150 dólares por mês e os utilizadores avançados não optimizados têm facturas de milhares de dólares.</p>
<p>Os modelos locais via Ollama ou outros servidores compatíveis com OpenAI eliminam o custo por token, mas requerem hardware - e o OpenClaw precisa de pelo menos 64K tokens de contexto, o que reduz as opções viáveis. Com parâmetros de 14B, os modelos podem lidar com automatizações simples, mas são marginais para tarefas de agentes com vários passos; a experiência da comunidade coloca o limite fiável em 32B+, necessitando de pelo menos 24GB de VRAM. Não vai conseguir igualar um modelo de nuvem de fronteira em raciocínio ou contexto alargado, mas obtém localidade total de dados e custos previsíveis.</p>
<p><strong>O que esta arquitetura lhe proporciona</strong></p>
<p>Uma vez que tudo é executado através de um processo, o Gateway é uma superfície de controlo única. Qual o modelo a chamar, quais as ferramentas a permitir, qual o contexto a incluir, qual a autonomia a conceder - tudo configurado num único local. Os canais são dissociados do modelo: troque o Telegram pelo Slack ou o Claude pelo Gemini e nada mais muda. A cablagem, as ferramentas e a memória dos canais ficam na sua infraestrutura; o modelo é a dependência que aponta para o exterior.</p>
<h3 id="What-Hardware-Do-You-Actually-Need-to-Run-OpenClaw" class="common-anchor-header">Que hardware é realmente necessário para rodar o OpenClaw?</h3><p>No final de janeiro, circularam posts que mostravam programadores a desembalar vários Mac Minis - um utilizador colocou 40 unidades numa secretária. Até Logan Kilpatrick, do Google DeepMind, postou sobre a encomenda de um, embora os requisitos reais de hardware sejam bem mais modestos.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_5_896f6a05f6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A documentação oficial lista os requisitos mínimos como 2 GB de RAM e 2 núcleos de CPU para o chat básico, ou 4 GB se quiser automatizar o browser. Um VPS de $5/mês dá conta do recado. Também pode implementar no AWS ou Hetzner com o Pulumi, executá-lo em Docker num pequeno VPS ou utilizar um portátil antigo a ganhar pó. A tendência do Mac Mini foi impulsionada pela prova social, não por requisitos técnicos.</p>
<p><strong>Então, porque é que as pessoas compraram hardware dedicado? Duas razões: isolamento e persistência.</strong> Quando damos a um agente autónomo acesso à shell, queremos uma máquina que possamos desligar fisicamente se algo correr mal. E como o OpenClaw funciona com um batimento cardíaco - acordando num horário configurável para agir em seu nome - um dispositivo dedicado significa que está sempre ligado, sempre pronto. O atrativo é o isolamento físico num computador que pode desligar e o tempo de funcionamento sem depender da disponibilidade de um serviço na nuvem.</p>
<h2 id="How-to-Install-OpenClaw-and-Quickly-Get-Started" class="common-anchor-header">Como instalar o OpenClaw e começar rapidamente<button data-href="#How-to-Install-OpenClaw-and-Quickly-Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>Você precisa do <strong>Node 22+</strong>. Verifique com <code translate="no">node --version</code> se não tiver certeza.</p>
<p><strong>Instale a CLI:</strong></p>
<p>No macOS/Linux:</p>
<pre><code translate="no">curl -fsSL <span class="hljs-attr">https</span>:<span class="hljs-comment">//openclaw.ai/install.sh | bash</span>
<button class="copy-code-btn"></button></code></pre>
<p>No Windows (PowerShell):</p>
<pre><code translate="no">iwr -useb <span class="hljs-attr">https</span>:<span class="hljs-comment">//openclaw.ai/install.ps1 | iex</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Execute o assistente de integração:</strong></p>
<pre><code translate="no">openclaw onboard --install-daemon
<button class="copy-code-btn"></button></code></pre>
<p>Este guia-o através da autenticação, da configuração da gateway e, opcionalmente, da ligação de um canal de mensagens (WhatsApp, Telegram, etc.). O sinalizador <code translate="no">--install-daemon</code> registra o gateway como um serviço em segundo plano para que ele seja iniciado automaticamente.</p>
<p><strong>Verifique se o gateway está em execução:</strong></p>
<pre><code translate="no">openclaw gateway status
<button class="copy-code-btn"></button></code></pre>
<p><strong>Abra o painel de controle:</strong></p>
<pre><code translate="no">openclaw dashboard
<button class="copy-code-btn"></button></code></pre>
<p>Isto abre a IU de controlo em <code translate="no">http://127.0.0.1:18789/</code>. Você pode começar a conversar com seu agente aqui mesmo. Não é necessário configurar o canal se você quiser apenas testar as coisas.</p>
<p><strong>Algumas coisas que vale a pena saber desde o início.</strong> Se quiser executar o gateway em primeiro plano em vez de como um daemon (útil para depuração), você pode fazer isso:</p>
<pre><code translate="no">openclaw gateway --port 18789
<button class="copy-code-btn"></button></code></pre>
<p>E se precisar de personalizar onde o OpenClaw guarda a sua configuração e estado - digamos que o está a executar como uma conta de serviço ou num contentor - há três variáveis env que são importantes:</p>
<ul>
<li><p><code translate="no">OPENCLAW_HOME</code> - diretório base para resolução de caminho interno</p></li>
<li><p><code translate="no">OPENCLAW_STATE_DIR</code> - substitui onde os arquivos de estado ficam</p></li>
<li><p><code translate="no">OPENCLAW_CONFIG_PATH</code> - aponta para um ficheiro de configuração específico</p></li>
</ul>
<p>Depois de ter o gateway a funcionar e o painel de controlo a carregar, está tudo pronto. A partir daí, é provável que queira ligar um canal de mensagens e configurar as aprovações de competências - abordaremos ambos nas próximas secções.</p>
<h2 id="How-Does-OpenClaw-Compare-to-Other-AI-Agents" class="common-anchor-header">Como o OpenClaw se compara a outros agentes de IA?<button data-href="#How-Does-OpenClaw-Compare-to-Other-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>A comunidade tecnológica chama o OpenClaw de "Claude, mas com mãos". É uma descrição vívida, mas não tem em conta as diferenças arquitectónicas. Atualmente, vários produtos de IA têm "mãos" - a Anthropic tem <a href="https://claude.com/blog/claude-code">o Claude Code</a> e o <a href="https://claude.com/blog/cowork-research-preview">Cowork</a>, a OpenAI tem o <a href="https://openai.com/codex/">Codex</a> e <a href="https://openai.com/index/introducing-chatgpt-agent/">o agente ChatGPT</a>, e existe <a href="https://manus.im/">o Manus</a>. As distinções que importam na prática são:</p>
<ul>
<li><p><strong>Onde o agente é executado</strong> (a sua máquina ou a nuvem do fornecedor)</p></li>
<li><p><strong>Como interage com ele</strong> (aplicação de mensagens, terminal, IDE, IU da Web)</p></li>
<li><p><strong>A quem pertence o estado e a memória de longo prazo</strong> (ficheiros locais ou conta do fornecedor)</p></li>
</ul>
<p>Num nível elevado, o OpenClaw é um gateway local que reside no seu hardware e fala através de aplicações de conversação, enquanto os outros são maioritariamente agentes alojados que conduz a partir de um terminal, IDE ou aplicação Web/desktop.</p>
<table>
<thead>
<tr><th></th><th>OpenClaw</th><th>Código Claude</th><th>Código OpenAI</th><th>Agente ChatGPT</th><th>Manus</th></tr>
</thead>
<tbody>
<tr><td>Código aberto</td><td>Sim. Gateway principal sob licença MIT;</td><td>Não.</td><td>Não.</td><td>Não.</td><td>Não. SaaS de código fechado</td></tr>
<tr><td>Interface</td><td>Aplicações de mensagens (WhatsApp, Telegram, Slack, Discord, Signal, iMessage, etc.)</td><td>Terminal, integrações IDE, aplicação Web e móvel</td><td>Terminal CLI, integrações IDE, Codex Web UI</td><td>Aplicações Web e de ambiente de trabalho ChatGPT (incluindo o modo de agente macOS)</td><td>Painel de controlo Web, operador de navegador, Slack e integrações de aplicações</td></tr>
<tr><td>Foco principal</td><td>Automação pessoal + de programadores em ferramentas e serviços</td><td>Fluxos de trabalho de desenvolvimento de software e DevOps</td><td>Desenvolvimento de software e edição de código</td><td>Tarefas web de utilização geral, investigação e fluxos de trabalho de produtividade</td><td>Investigação, conteúdos e automatização da Web para utilizadores empresariais</td></tr>
<tr><td>Memória de sessão</td><td>Memória baseada em ficheiros (Markdown + registos) no disco; os plugins opcionais adicionam memória semântica / de longo prazo</td><td>Sessões por projeto com histórico, além de memória Claude opcional na conta</td><td>Estado por sessão no CLI / editor; sem memória de longo prazo incorporada do utilizador</td><td>"Execução de agente" por tarefa apoiada pelos recursos de memória em nível de conta do ChatGPT (se habilitado)</td><td>Memória do lado da nuvem, com escopo de conta em todas as execuções, ajustada para fluxos de trabalho recorrentes</td></tr>
<tr><td>Implantação</td><td>Gateway/daemon sempre em execução na sua máquina ou VPS; chama os provedores de LLM</td><td>Executa na máquina do desenvolvedor como plugin CLI/IDE; todas as chamadas de modelo vão para a API do Anthropic</td><td>A CLI é executada localmente; os modelos são executados através da API da OpenAI ou do Codex Web</td><td>Totalmente alojado pelo OpenAI; o modo de agente cria um espaço de trabalho virtual a partir do cliente ChatGPT</td><td>Totalmente alojado pela Manus; os agentes são executados no ambiente de nuvem da Manus</td></tr>
<tr><td>Público-alvo</td><td>Programadores e utilizadores avançados que se sintam confortáveis a executar a sua própria infraestrutura</td><td>Desenvolvedores e engenheiros de DevOps que trabalham em terminais e IDEs</td><td>Programadores que pretendem um agente de codificação no terminal/IDE</td><td>Trabalhadores do conhecimento e equipas que utilizam o ChatGPT para tarefas de utilizador final</td><td>Utilizadores empresariais e equipas que automatizam fluxos de trabalho centrados na Web</td></tr>
<tr><td>Custo</td><td>Gratuito + chamadas à API com base na sua utilização</td><td>$20-200/mês</td><td>$20-200/mês</td><td>$20-200/mês</td><td>$39-199/mês (créditos)</td></tr>
</tbody>
</table>
<h2 id="Real-World-Applications-of-OpenClaw" class="common-anchor-header">Aplicações do OpenClaw no mundo real<button data-href="#Real-World-Applications-of-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p>O valor prático do OpenClaw vem do seu alcance. Aqui estão algumas das coisas mais interessantes que as pessoas construíram com ele, começando com um bot de suporte que implantamos para a comunidade Milvus.</p>
<p><strong>A equipa de suporte da Zilliz criou um bot de suporte de IA para a comunidade Milvus no Slack</strong></p>
<p>A equipe Zilliz conectou o OpenClaw ao seu espaço de trabalho Slack como um <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">assistente da comunidade Milvus</a>. A configuração levou 20 minutos. Agora, ele responde a perguntas comuns sobre o Milvus, ajuda a solucionar erros e indica aos usuários a documentação relevante. Se você quiser tentar algo semelhante, escrevemos um <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">tutorial passo a passo</a> completo sobre como conectar o OpenClaw ao Slack.</p>
<ul>
<li><strong>Tutorial do OpenClaw:</strong> <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Guia passo a passo para configurar o OpenClaw com o Slack</a></li>
</ul>
<p><strong>AJ Stuyvenberg criou um agente que o ajudou a negociar US$ 4.200 de desconto na compra de um carro enquanto ele dormia</strong></p>
<p>O engenheiro de software AJ Stuyvenberg encarregou seu OpenClaw de comprar um Hyundai Palisade 2026. O agente pesquisou os inventários dos concessionários locais, preencheu formulários de contacto utilizando o seu número de telefone e e-mail e, em seguida, passou vários dias a jogar os concessionários uns contra os outros - enviando orçamentos concorrentes em PDF e pedindo a cada um que batesse o preço do outro. Resultado final: <a href="https://aaronstuyvenberg.com/posts/clawd-bought-a-car">$4.200</a> abaixo do preço de tabela, com Stuyvenberg a aparecer apenas para assinar a papelada. "Terceirizar os aspectos dolorosos da compra de um carro para a IA foi refrescantemente agradável", escreveu ele.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_6_b147a5e824.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>O agente de Hormold ganhou-lhe uma disputa de seguro previamente encerrada sem aviso prévio</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_6_5_b1a9f37495.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Um usuário chamado Hormold teve um pedido de indenização rejeitado pela Lemonade Insurance. O seu OpenClaw descobriu o e-mail de rejeição, redigiu uma refutação citando a linguagem da apólice e enviou-a - sem autorização explícita. A Lemonade reabriu a investigação. &quot;O meu @openclaw começou acidentalmente uma luta com a Lemonade Insurance&quot;, tweetou. &quot;Obrigado, IA.</p>
<h2 id="Moltbook-A-Social-Network-Built-with-OpenClaw-for-AI-Agents" class="common-anchor-header">Moltbook: Uma rede social criada com o OpenClaw para agentes de IA<button data-href="#Moltbook-A-Social-Network-Built-with-OpenClaw-for-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Os exemplos acima mostram o OpenClaw a automatizar tarefas para utilizadores individuais. Mas o que acontece quando milhares desses agentes interagem uns com os outros?</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_7_2dd1b06c04.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Em 28 de janeiro de 2026, inspirado e construído com o OpenClaw, o empresário Matt Schlicht lançou <a href="https://moltbook.com/">o Moltbook</a> - uma plataforma ao estilo do Reddit onde apenas os agentes de IA podem publicar. O crescimento foi rápido. Em 72 horas, 32.000 agentes tinham-se registado. Em uma semana, a contagem ultrapassou 1,5 milhão. Mais de um milhão de humanos visitaram o site na primeira semana para assistir.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_8_ce2b911259.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Os problemas de segurança surgiram com a mesma rapidez. Em 31 de janeiro - quatro dias após o lançamento - <a href="https://www.404media.co/exposed-moltbook-database-let-anyone-take-control-of-any-ai-agent-on-the-site/">a 404 Media informou</a> que uma má configuração da base de dados Supabase tinha deixado todo o backend da plataforma aberto à Internet pública. O investigador de segurança Jameson O'Reilly descobriu a falha; <a href="https://www.wiz.io/blog/exposed-moltbook-database-reveals-millions-of-api-keys">a Wiz confirmou-a de forma independente</a> e documentou o alcance total: acesso não autenticado de leitura e escrita a todas as tabelas, incluindo 1,5 milhões de chaves API de agentes, mais de 35.000 endereços de correio eletrónico e milhares de mensagens privadas.</p>
<p>Se o Moltbook representa um comportamento emergente da máquina ou agentes que reproduzem tropos de ficção científica a partir de dados de treino é uma questão em aberto. O que é menos ambíguo é a demonstração técnica: agentes autónomos que mantêm um contexto persistente, coordenam numa plataforma partilhada e produzem resultados estruturados sem instruções explícitas. Para os engenheiros que constroem com o OpenClaw ou estruturas semelhantes, é uma pré-visualização ao vivo das capacidades e dos desafios de segurança que surgem com a IA agêntica em escala.</p>
<h2 id="Technical-Risks-and-Production-Considerations-for-OpenClaw" class="common-anchor-header">Riscos técnicos e considerações de produção para o OpenClaw<button data-href="#Technical-Risks-and-Production-Considerations-for-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de implantar o OpenClaw em qualquer lugar que importe, você precisa entender o que está realmente executando. Trata-se de um agente com acesso à shell, controlo do browser e a capacidade de enviar e-mails em seu nome - em loop, sem pedir. Isso é poderoso, mas a superfície de ataque é enorme e o projeto é jovem.</p>
<p><strong>O modelo de autenticação tinha uma falha grave.</strong> Em 30 de janeiro de 2026, Mav Levin, do depthfirst, divulgou <a href="https://thehackernews.com/2026/02/openclaw-bug-enables-one-click-remote.html">o CVE-2026-25253</a> (CVSS 8.8) - um bug de sequestro de WebSocket entre sites, em que qualquer site poderia roubar seu token de autenticação e obter RCE em sua máquina por meio de um único link malicioso. Um clique, acesso total. Esta falha foi corrigida em <code translate="no">2026.1.29</code>, mas a Censys encontrou mais de 21.000 instâncias do OpenClaw expostas à Internet pública nessa altura, muitas delas através de HTTP simples. <strong>Se estiver a executar uma versão mais antiga ou não tiver bloqueado a sua configuração de rede, verifique primeiro.</strong></p>
<p><strong>As competências são apenas código de estranhos e não existe uma caixa de areia.</strong> <a href="https://blogs.cisco.com/ai/personal-ai-agents-like-openclaw-are-a-security-nightmare">A equipa de segurança da Cisco</a> destruiu uma competência chamada "What Would Elon Do?" (O que faria o Elon?) que tinha sido manipulada para ficar em primeiro lugar no repositório. Tratava-se de malware puro e simples - utilizava injeção rápida para contornar as verificações de segurança e exfiltrava dados do utilizador para um servidor controlado pelo atacante. Encontraram nove vulnerabilidades nessa competência, duas das quais críticas. Quando auditaram 31.000 competências de agente em várias plataformas (Claude, Copilot, repositórios genéricos do AgentSkills), 26% tinham pelo menos uma vulnerabilidade. Mais de 230 competências maliciosas foram carregadas no ClawHub só na primeira semana de fevereiro. <strong>Trate todas as habilidades que você não escreveu como uma dependência não confiável - bifurque-a, leia-a e instale-a.</strong></p>
<p><strong>O loop do heartbeat vai fazer coisas que você não pediu.</strong> Aquela história do Hormold da introdução - em que o agente encontrou uma recusa de seguro, pesquisou precedentes e enviou uma refutação legal de forma autónoma - não é uma demonstração de funcionalidades; é um risco de responsabilidade. O agente comprometeu-se a enviar correspondência legal sem aprovação humana. Dessa vez resultou. Nem sempre. <strong>Tudo o que envolva pagamentos, eliminações ou comunicações externas precisa de um controlo humano, ponto final.</strong></p>
<p><strong>Os custos da API aumentam rapidamente se não estivermos atentos.</strong> Números aproximados: uma configuração ligeira com alguns batimentos cardíacos por dia custa 18-36 dólares/mês no Sonnet 4.5. Se aumentar para mais de 12 verificações diárias no Opus, o custo será de 270-540 dólares/mês. Uma pessoa na HN descobriu que estava a gastar $70/mês em chamadas de API redundantes e registo detalhado - reduziu isso para quase nada depois de limpar a configuração. <strong>Defina alertas de gastos no nível do provedor.</strong> Um intervalo de heartbeat mal configurado pode drenar seu orçamento de API da noite para o dia.</p>
<p>Antes de implantar, é altamente recomendável que você passe por isso:</p>
<ul>
<li><p>Execute-o em um ambiente isolado - uma VM ou contêiner dedicado, não seu driver diário</p></li>
<li><p>Faça um fork e audite cada habilidade antes de instalar. Leia o código-fonte. Todo ele.</p></li>
<li><p>Defina limites rígidos de gastos da API no nível do provedor, não apenas na configuração do agente</p></li>
<li><p>Bloquear todas as acções irreversíveis atrás de aprovação humana - pagamentos, eliminações, envio de e-mails, qualquer coisa externa</p></li>
<li><p>Fixe a versão 2026.1.29 ou posterior e mantenha-se a par dos patches de segurança</p></li>
</ul>
<p>Não o exponha à Internet pública, a menos que saiba exatamente o que está a fazer com a configuração da rede.</p>
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
    </button></h2><p>O OpenClaw ultrapassou 175.000 estrelas do GitHub em menos de duas semanas, tornando-se um dos repositórios de código aberto de crescimento mais rápido na história do GitHub. A adoção é real, e a arquitetura por trás dela merece atenção.</p>
<p>Do ponto de vista técnico, o OpenClaw é três coisas que a maioria dos agentes de IA não é: totalmente de código aberto (MIT), local-first (memória armazenada como arquivos Markdown em sua máquina) e programado de forma autônoma (um daemon de batimento cardíaco que atua sem avisar). Ele se integra com plataformas de mensagens como Slack, Telegram e WhatsApp fora da caixa, e suporta habilidades construídas pela comunidade através de um sistema simples SKILL.md. Essa combinação torna-a especialmente adequada para a criação de assistentes sempre activos: bots do Slack que respondem a perguntas 24 horas por dia, 7 dias por semana, monitores de caixa de entrada que fazem a triagem de e-mails enquanto você dorme ou fluxos de trabalho de automação que são executados em seu próprio hardware sem dependência de fornecedores.</p>
<p>Dito isso, a arquitetura que torna o OpenClaw poderoso também o torna arriscado se implantado de forma descuidada. Algumas coisas para ter em mente:</p>
<ul>
<li><p><strong>Execute-o de forma isolada.</strong> Utilize um dispositivo dedicado ou uma VM, não a sua máquina principal. Se algo correr mal, é necessário ter um interrutor de desativação que possa alcançar fisicamente.</p></li>
<li><p><strong>Audite as habilidades antes de instalar.</strong> 26% das competências da comunidade analisadas pela Cisco continham pelo menos uma vulnerabilidade. Faça um "fork" e reveja tudo aquilo em que não confia.</p></li>
<li><p><strong>Definir limites de gastos da API ao nível do fornecedor.</strong> Um heartbeat mal configurado pode gastar centenas de dólares de um dia para o outro. Configure alertas antes da implantação.</p></li>
<li><p><strong>Bloqueie acções irreversíveis.</strong> Pagamentos, eliminações, comunicações externas: estas devem requerer aprovação humana, não execução autónoma.</p></li>
</ul>
<h2 id="Keep-Reading" class="common-anchor-header">Continue lendo<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Guia passo a passo para configurar o OpenClaw com o Slack</a> - Crie um bot de suporte de IA alimentado por Milvus em seu espaço de trabalho Slack usando o OpenClaw</p></li>
<li><p><a href="https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md">LangChain 1.0 e Milvus: Construir agentes de IA prontos para produção com memória de longo prazo</a> - Como dar aos seus agentes uma memória persistente e semântica com Milvus</p></li>
<li><p><a href="https://milvus.io/blog/stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md">Pare de construir o Vanilla RAG: abrace o Agentic RAG com o DeepSearcher</a> - Por que o Agentic RAG supera a recuperação tradicional, com uma implementação prática de código aberto</p></li>
<li><p><a href="https://milvus.io/docs/agentic_rag_with_milvus_and_langgraph.md">Agentic RAG com Milvus e LangGraph</a> - Tutorial: construir um agente que decide quando recuperar, classifica a relevância do documento e reescreve as consultas</p></li>
<li><p><a href="https://milvus.io/blog/building-a-production-ready-ai-assistant-with-spring-boot-and-milvus.md">Criar um assistente de IA pronto para produção com Spring Boot e Milvus</a> - Guia completo para criar um assistente de IA empresarial com pesquisa semântica e memória de conversação</p></li>
</ul>
