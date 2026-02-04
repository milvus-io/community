---
id: >-
  stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md
title: >-
  Guia passo a passo para configurar o OpenClaw (anteriormente Clawdbot/Moltbot)
  com o Slack
author: 'Min Yin, Lumina Wang'
date: 2026-02-04T00:00:00.000Z
cover: assets.zilliz.com/Open_Claw_Slack_Setup_Guide_Cover_1_11zon_3a995858a8.png
tag: Tutorial
recommend: true
publishToMedium: true
tags: 'OpenClaw, Clawdbot, Moltbot, Slack, Tutorial'
meta_keywords: 'OpenClaw, Clawdbot, Moltbot, Milvus, AI Agent'
meta_title: |
  OpenClaw Tutorial: Connect to Slack for Local AI Assistant
desc: >-
  Guia passo a passo para configurar o OpenClaw com o Slack. Execute um
  assistente de IA auto-hospedado no seu computador Mac ou Linux, sem
  necessidade de nuvem.
origin: 'https://milvus.io/blog/openclaw-slack-setup-guide.md'
---
<p>Se esteve no Twitter sobre tecnologia, no Hacker News ou no Discord esta semana, já o viu. Um emoji de lagosta 🦞, capturas de ecrã de tarefas a serem concluídas e uma afirmação ousada: uma IA que não se limita a <em>falar -</em> <em>fala</em> mesmo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_1_567975a33f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A coisa ficou mais estranha no fim de semana. O empresário Matt Schlicht lançou <a href="https://moltbook.com">o Moltbook - uma</a>rede social ao estilo do Reddit onde só os agentes de IA podem publicar e os humanos só podem observar. Em poucos dias, mais de 1,5 milhões de agentes registaram-se. Formaram comunidades, debateram filosofia, queixaram-se dos seus operadores humanos e até fundaram a sua própria religião chamada "Crustafarianismo". Sim, a sério.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_2_b570b3e59b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bem-vindo à loucura do OpenClaw.</p>
<p>O entusiasmo é tão real que as acções da Cloudflare subiram 14% simplesmente porque os programadores utilizam a sua infraestrutura para executar aplicações. As vendas do Mac Mini dispararam porque as pessoas compram hardware dedicado para o seu novo funcionário de IA. E o repositório do GitHub? Mais de <a href="https://github.com/openclaw/openclaw">150.000 estrelas</a> em apenas algumas semanas.</p>
<p>Então, naturalmente, tivemos que mostrar a você como configurar sua própria instância do OpenClaw - e conectá-la ao Slack para que você possa comandar seu assistente de IA em seu aplicativo de mensagens favorito.</p>
<h2 id="What-Is-OpenClaw" class="common-anchor-header">O que é o OpenClaw?<button data-href="#What-Is-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://openclaw.ai/">O OpenClaw</a> (anteriormente conhecido como Clawdbot/Moltbot) é um agente de IA autónomo e de código aberto que é executado localmente nas máquinas dos utilizadores e executa tarefas do mundo real através de apps de mensagens como o WhatsApp, Telegram e Discord. Automatiza os fluxos de trabalho digitais - como gerir e-mails, navegar na Web ou agendar reuniões - ligando-se a LLMs como o Claude ou o ChatGPT.</p>
<p>Em suma, é como ter um assistente digital 24 horas por dia, 7 dias por semana, que pode pensar, responder e realmente fazer as coisas.</p>
<h2 id="Setting-Up-OpenClaw-as-a-Slack-Based-AI-Assistant" class="common-anchor-header">Configurar o OpenClaw como um assistente de IA baseado no Slack<button data-href="#Setting-Up-OpenClaw-as-a-Slack-Based-AI-Assistant" class="anchor-icon" translate="no">
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
    </button></h2><p>Imagine ter um bot no seu espaço de trabalho do Slack que pode responder instantaneamente a perguntas sobre o seu produto, ajudar a depurar problemas do usuário ou indicar aos colegas de equipe a documentação correta, sem que ninguém precise parar o que está fazendo. Para nós, isso pode significar um suporte mais rápido para a comunidade Milvus: um bot que responde a perguntas comuns ("Como faço para criar uma coleção?"), ajuda a solucionar erros ou resume notas de versão sob demanda. Para a sua equipa, pode ser a integração de novos engenheiros, o tratamento de perguntas frequentes internas ou a automatização de tarefas DevOps repetitivas. Os casos de uso são amplos.</p>
<p>Neste tutorial, vamos abordar o básico: instalar o OpenClaw na sua máquina e conectá-lo ao Slack. Uma vez feito isso, você terá um assistente de IA pronto para ser personalizado para o que você precisar.</p>
<h3 id="Prerequisites" class="common-anchor-header">Pré-requisitos</h3><ul>
<li><p>Uma máquina Mac ou Linux</p></li>
<li><p>Uma <a href="https://console.anthropic.com/">chave de API do Anthropic</a> (ou acesso CLI do Claude Code)</p></li>
<li><p>Um espaço de trabalho do Slack onde pode instalar aplicações</p></li>
</ul>
<p>É isso aí. Vamos começar.</p>
<h3 id="Step-1-Install-OpenClaw" class="common-anchor-header">Passo 1: Instalar o OpenClaw</h3><p>Execute o instalador:</p>
<p>curl -fsSL https://molt.bot/install.sh | bash  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_3_fc80684811.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Quando solicitado, selecione <strong>Sim</strong> para continuar.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_4_8004e87516.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Em seguida, escolha o modo <strong>QuickStart</strong>.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_5_b5803c1d89.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Choose-Your-LLM" class="common-anchor-header">Passo 2: Escolha o seu LLM</h3><p>O instalador pedirá que você escolha um provedor de modelo. Estamos a utilizar o Anthropic com o Claude Code CLI para autenticação.</p>
<ol>
<li>Selecione <strong>Anthropic</strong> como o provedor  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_6_a593124f6c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="2">
<li>Complete a verificação no seu navegador quando solicitado.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_7_410c1a39d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="3">
<li>Selecione <strong>anthropic/claude-opus-4-5-20251101</strong> como modelo predefinido  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_8_0c22bf5a16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<h3 id="Step-3-Set-Up-Slack" class="common-anchor-header">Etapa 3: Configurar o Slack</h3><p>Quando lhe for pedido para selecionar um canal, escolha <strong>Slack.</strong><span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_9_cd4dfa5053.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Prossiga para nomear seu bot. Chamámos ao nosso "Clawdbot_Milvus".  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_10_89c79ccd0d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Agora você precisa criar um aplicativo do Slack e pegar dois tokens. Veja como:  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_11_50df3aec5d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.1 Criar um aplicativo do Slack</strong></p>
<p>Vá para o <a href="https://api.slack.com/apps?new_app=1">site da API do Slack</a> e crie um novo aplicativo do zero.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_12_21987505d5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dê-lhe um nome e selecione o espaço de trabalho que pretende utilizar.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_13_7fce24b5c7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.2 Definir permissões do bot</strong></p>
<p>Na barra lateral, clique em <strong>OAuth e permissões</strong>. Role para baixo até <strong>Bot Token Scopes</strong> e adicione as permissões que seu bot precisa.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_14_b08d66b55a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.3 Ativar o modo Socket</strong></p>
<p>Clique em <strong>Socket Mode</strong> na barra lateral e ative-o.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_15_11545f95f8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Isto irá gerar um <strong>App-Level Token</strong> (começa com <code translate="no">xapp-</code>). Copie-o para um local seguro.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_16_c446eefd7d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.4 Ativar assinaturas de eventos</strong></p>
<p>Vá para <strong>Assinaturas de eventos</strong> e ative-a.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_17_98387d6226.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Depois escolhe os eventos que o teu bot deve subscrever.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_18_b2a16d7786.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.5 Instalar a aplicação</strong></p>
<p>Clique em <strong>Install App (Instalar aplicativo</strong> ) na barra lateral e, em seguida, em <strong>Request to Install (Solicitar instalação</strong> ) (ou instale diretamente se você for um administrador de workspace).  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_19_a5e76d0d33.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Depois de aprovado, você verá o <strong>token OAuth do usuário do bot</strong> (começa com <code translate="no">xoxb-</code>). Copie-o também.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_20_a4a6878dbf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configure-OpenClaw" class="common-anchor-header">Etapa 4: configurar o OpenClaw</h3><p>De volta à CLI do OpenClaw:</p>
<ol>
<li><p>Introduza o seu <strong>Bot User OAuth Token</strong> (<code translate="no">xoxb-...</code>)</p></li>
<li><p>Digite seu <strong>Token de nível de aplicativo</strong> (<code translate="no">xapp-...</code>) <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_21_bd1629fb6a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p></li>
</ol>
<ol start="3">
<li>Selecione quais canais do Slack o bot pode acessar  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_22_a1b682fa84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="4">
<li>Ignore a configuração de habilidades por enquanto - você sempre pode adicioná-las mais tarde  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_23_cc4855ecfd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="5">
<li>Selecione <strong>Reiniciar</strong> para aplicar suas alterações</li>
</ol>
<h3 id="Step-5-Try-It-Out" class="common-anchor-header">Etapa 5: Experimente</h3><p>Vá para o Slack e envie uma mensagem ao seu bot. Se tudo estiver configurado corretamente, o OpenClaw responderá e estará pronto para executar tarefas na sua máquina.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_24_2864a88ce9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Tips" class="common-anchor-header">Dicas</h3><ol>
<li>Execute <code translate="no">clawdbot dashboard</code> para gerir as definições através de uma interface web  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_25_67b337b1d9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="2">
<li>Se algo correr mal, verifique os registos para obter detalhes do erro  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_26_a62b5669ee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<h2 id="A-Word-of-Caution" class="common-anchor-header">Uma palavra de cautela<button data-href="#A-Word-of-Caution" class="anchor-icon" translate="no">
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
    </button></h2><p>O OpenClaw é poderoso - e é exatamente por isso que deve ter cuidado. "Realmente faz coisas" significa que pode executar comandos reais na sua máquina. É esse o objetivo, mas tem riscos.</p>
<p><strong>As boas notícias:</strong></p>
<ul>
<li><p>É de código aberto, pelo que o código é auditável</p></li>
<li><p>É executado localmente, pelo que os seus dados não estão no servidor de outra pessoa</p></li>
<li><p>O utilizador controla as permissões que tem</p></li>
</ul>
<p><strong>As notícias não tão boas:</strong></p>
<ul>
<li><p>A injeção de prompts é um risco real - uma mensagem maliciosa pode levar o bot a executar comandos não intencionais</p></li>
<li><p>Os golpistas já criaram repositórios e tokens OpenClaw falsos, portanto, tenha cuidado com o que você baixa</p></li>
</ul>
<p><strong>Nosso conselho:</strong></p>
<ul>
<li><p>Não execute isto na sua máquina principal. Use uma VM, um laptop reserva ou um servidor dedicado.</p></li>
<li><p>Não conceda mais permissões do que as necessárias.</p></li>
<li><p>Não use isso em produção ainda. É novo. Trate-o como a experiência que é.</p></li>
<li><p>Use as fontes oficiais: <a href="https://x.com/openclaw">@openclaw</a> no X e <a href="https://github.com/openclaw">OpenClaw</a>.</p></li>
</ul>
<p>Uma vez que você dá a um LLM a habilidade de executar comandos, não existe algo 100% seguro. Isso não é um problema do OpenClaw - é a natureza da IA agêntica. Basta ser inteligente.</p>
<h2 id="Whats-Next" class="common-anchor-header">O que é que se segue?<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Parabéns! Agora você tem um assistente de IA local em execução na sua própria infraestrutura, acessível pelo Slack. Os seus dados continuam a ser seus e tem um ajudante incansável pronto para automatizar as tarefas repetitivas.</p>
<p>A partir daqui, você pode:</p>
<ul>
<li><p>Instalar mais <a href="https://docs.molt.bot/skills">habilidades</a> para expandir o que o OpenClaw pode fazer</p></li>
<li><p>Configurar tarefas agendadas para que funcione de forma proactiva</p></li>
<li><p>Ligar outras plataformas de mensagens como o Telegram ou o Discord</p></li>
<li><p>Explorar o ecossistema <a href="https://milvus.io/">Milvus</a> para capacidades de pesquisa de IA</p></li>
</ul>
<p><strong>Tem dúvidas ou quer partilhar o que está a construir?</strong></p>
<ul>
<li><p>Junte-se à <a href="https://milvus.io/slack">comunidade Milvus Slack</a> para se conectar com outros desenvolvedores</p></li>
<li><p>Reserve o nosso <a href="https://milvus.io/office-hours">Milvus Office Hours</a> para perguntas e respostas ao vivo com a equipa</p></li>
</ul>
<p>Feliz hacking! 🦞</p>
