---
id: >-
  building-ai-agents-in-10-minutes-using-natural-language-with-langsmith-agent-builder-milvus.md
title: >-
  Criar agentes de IA em 10 minutos utilizando a linguagem natural com o
  LangSmith Agent Builder + Milvus
author: Min Yin
date: 2026-01-22T00:00:00.000Z
desc: >-
  Saiba como criar agentes de IA com memória em minutos usando o LangSmith Agent
  Builder e o Milvus - sem código, linguagem natural, pronto para produção.
cover: assets.zilliz.com/cover_LS_MVS_ab8af19bfa.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: >-
  LangSmith Agent Builder, Milvus vector database, AI agent memory, no-code AI
  agents, building AI assistants
meta_title: |
  Build AI Agents in 10 Minutes with LangSmith Agent Builder & Milvus
origin: >-
  https://milvus.io/blog/building-ai-agents-in-10-minutes-using-natural-language-with-langsmith-agent-builder-milvus.md
---
<p>À medida que o desenvolvimento da IA acelera, mais equipas estão a descobrir que a criação de um assistente de IA não requer necessariamente uma formação em engenharia de software. As pessoas que mais precisam de assistentes - equipas de produtos, operações, apoio, investigadores - sabem muitas vezes exatamente o que o agente deve fazer, mas não como o implementar em código. As ferramentas tradicionais "sem código" tentaram colmatar essa lacuna com telas de arrastar e largar, mas colapsam no momento em que é necessário um comportamento real do agente: raciocínio em várias etapas, utilização de ferramentas ou memória persistente.</p>
<p>O recém-lançado <a href="https://www.langchain.com/langsmith/agent-builder"><strong>LangSmith Agent Builder</strong></a> tem uma abordagem diferente. Em vez de desenhar fluxos de trabalho, o utilizador descreve os objectivos do agente e as ferramentas disponíveis em linguagem simples, e o tempo de execução trata da tomada de decisões. Sem fluxogramas, sem scripts - apenas uma intenção clara.</p>
<p>Mas a intenção por si só não produz um assistente inteligente. <strong>A memória</strong> é que produz. É aqui que <a href="https://milvus.io/"><strong>o Milvus</strong></a>, a base de dados vetorial de código aberto amplamente adoptada, fornece a base. Ao armazenar documentos e o histórico de conversações como embeddings, o Milvus permite que o seu agente recorde o contexto, recupere informações relevantes e responda com precisão e em grande escala.</p>
<p>Este guia explica como criar um assistente de IA pronto para produção e habilitado para memória usando o <strong>LangSmith Agent Builder + Milvus</strong>, tudo sem escrever uma única linha de código.</p>
<h2 id="What-is-LangSmith-Agent-Builder-and-How-It-Works" class="common-anchor-header">O que é o LangSmith Agent Builder e como ele funciona?<button data-href="#What-is-LangSmith-Agent-Builder-and-How-It-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Tal como o seu nome revela, <a href="https://www.google.com/search?q=LangSmith+Agent+Builder&amp;oq=what+is+LangSmith+Agent+Builder&amp;gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQABiABDIHCAIQABiABDIHCAMQABiABDIHCAQQABiABDIHCAUQABiABDIHCAYQABiABDIHCAcQABiABDIGCAgQABgDMggICRAAGBYYHtIBCTI1OTJqMGoxNagCCLACAfEF2Mylr_IuXLk&amp;sourceid=chrome&amp;ie=UTF-8&amp;ved=2ahUKEwjV1LfvxZ6SAxVFsFYBHYzTJAsQgK4QegQIARAB">o LangSmith Agent Builder</a> é uma ferramenta sem código da LangChain que lhe permite construir, implementar e gerir agentes de IA usando linguagem simples. Em vez de escrever lógica ou desenhar fluxos visuais, o utilizador explica o que o agente deve fazer, que ferramentas pode utilizar e como se deve comportar. O sistema trata então das partes mais difíceis - gerar avisos, selecionar ferramentas, ligar componentes e ativar a memória.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_57c5cee35b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ao contrário das ferramentas tradicionais sem código ou de fluxo de trabalho, o Agent Builder não tem tela de arrastar e soltar nem biblioteca de nós. Interage-se com ele da mesma forma que se interage com o ChatGPT. Descreva o que deseja criar, responda a algumas perguntas de esclarecimento e o Construtor produz um agente totalmente funcional com base na sua intenção.</p>
<p>Nos bastidores, esse agente é construído a partir de quatro blocos de construção principais.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_05b90b1f3d.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ul>
<li><strong>Prompt:</strong> O prompt é o cérebro do agente, definindo seus objetivos, restrições e lógica de decisão. O LangSmith Agent Builder usa meta-prompting para construir isso automaticamente: você descreve o que quer, ele faz perguntas de esclarecimento e suas respostas são sintetizadas em um prompt de sistema detalhado e pronto para produção. Em vez de escrever a lógica à mão, o usuário simplesmente expressa sua intenção.</li>
<li><strong>Ferramentas:</strong> As ferramentas permitem que o agente tome medidas - enviando emails, postando no Slack, criando eventos de calendário, pesquisando dados ou chamando APIs. O Agent Builder integra estas ferramentas através do Protocolo de contexto de modelo (MCP), que fornece uma forma segura e extensível de expor capacidades. Os utilizadores podem confiar nas integrações incorporadas ou adicionar servidores MCP personalizados, incluindo <a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">servidores</a>Milvus <a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">MCP</a>para pesquisa vetorial e memória de longo prazo.</li>
<li><strong>Accionadores:</strong> Os accionadores definem quando um agente é executado. Além da execução manual, é possível anexar agentes a agendas ou eventos externos para que eles respondam automaticamente a mensagens, emails ou atividades de webhook. Quando um gatilho é acionado, o Agent Builder inicia uma nova thread de execução e executa a lógica do agente, permitindo um comportamento contínuo e orientado por eventos.</li>
<li><strong>Subagentes:</strong> Os subagentes dividem tarefas complexas em unidades menores e especializadas. Um agente principal pode delegar trabalho a subagentes - cada um com seu próprio prompt e conjunto de ferramentas - para que tarefas como recuperação de dados, resumo ou formatação sejam tratadas por ajudantes dedicados. Isto evita um único prompt sobrecarregado e cria uma arquitetura de agente mais modular e escalável.</li>
</ul>
<h2 id="How-Does-an-Agent-Remember-Your-Preferences" class="common-anchor-header">Como é que um agente se lembra das suas preferências?<button data-href="#How-Does-an-Agent-Remember-Your-Preferences" class="anchor-icon" translate="no">
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
    </button></h2><p>O que torna o Agent Builder único é a forma como ele trata <em>a memória</em>. Em vez de colocar as preferências no histórico do chat, o agente pode atualizar as suas próprias regras de comportamento durante a execução. Se disser: "A partir de agora, termine todas as mensagens do Slack com um poema", o agente não trata isso como um pedido único - ele armazena-o como uma preferência persistente que se aplica em execuções futuras.</p>
<p>Por baixo do capô, o agente mantém um ficheiro de memória interna - essencialmente o seu prompt de sistema em evolução. Cada vez que é iniciado, ele lê esse arquivo para decidir como se comportar. Quando o utilizador dá correcções ou restrições, o agente edita o ficheiro adicionando regras estruturadas como "Encerrar sempre o briefing com um pequeno poema edificante". Esta abordagem é muito mais estável do que confiar no histórico da conversa, porque o agente reescreve ativamente as suas instruções de funcionamento em vez de enterrar as suas preferências numa transcrição.</p>
<p>Este design vem do FilesystemMiddleware do DeepAgents, mas é totalmente abstraído no Agent Builder. O utilizador nunca toca diretamente nos ficheiros: expressa as actualizações em linguagem natural e o sistema trata das edições nos bastidores. Se precisar de mais controle, é possível conectar um servidor MCP personalizado ou ir para a camada DeepAgents para personalização avançada da memória.</p>
<h2 id="Hands-on-Demo-Building-a-Milvus-Assistant-in-10-Minutes-using-Agent-Builder" class="common-anchor-header">Demonstração prática: Criando um Milvus Assistant em 10 minutos usando o Agent Builder<button data-href="#Hands-on-Demo-Building-a-Milvus-Assistant-in-10-Minutes-using-Agent-Builder" class="anchor-icon" translate="no">
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
    </button></h2><p>Agora que já cobrimos a filosofia de design por trás do Agent Builder, vamos percorrer todo o processo de construção com um exemplo prático. O nosso objetivo é criar um assistente inteligente que possa responder a questões técnicas relacionadas com o Milvus, pesquisar a documentação oficial e recordar as preferências do utilizador ao longo do tempo.</p>
<h3 id="Step-1-Sign-In-to-the-LangChain-Website" class="common-anchor-header">Passo 1. Entrar no site da LangChain</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_1_b3c461d39b.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Set-Up-Your-Anthropic-API-Key" class="common-anchor-header">Passo 2. Configure sua chave de API Anthropic</h3><p><strong>Nota:</strong> O Anthropic é suportado por padrão. Também é possível usar um modelo personalizado, desde que seu tipo esteja incluído na lista oficialmente suportada pela LangChain.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_2_c04400695e.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>1. Adicionar uma chave de API</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_3_11db4b3824.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>2. Introduzir e guardar a chave de API</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_4_abfc27d796.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Create-a-New-Agent" class="common-anchor-header">Passo 3. Criar um novo agente</h3><p><strong>Nota:</strong> Clique em <strong>Saiba mais</strong> para ver a documentação de utilização.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_5_e90bf254f2.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_6_7c839d96f3.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol>
<li><strong>Configurar um modelo personalizado (opcional)</strong></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_7_0dfd5ff561.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(1) Introduzir parâmetros e guardar</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_8_85f9e3008f.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_9_0d5d0c062c.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Describe-Your-Requirements-to-Create-the-Agent" class="common-anchor-header">Passo 4. Descrever os requisitos para criar o agente</h3><p><strong>Nota:</strong> Crie o agente usando uma descrição em linguagem natural.</p>
<pre><code translate="no">
I need a Milvus technical consultant to <span class="hljs-built_in">help</span> me answer technical questions about vector databases. 

Search the official documentation <span class="hljs-keyword">and</span> remember my preference <span class="hljs-keyword">for</span> the index <span class="hljs-built_in">type</span> I use. 

<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_10_0e033a5200.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol>
<li><strong>O sistema faz perguntas de acompanhamento para refinar os requisitos</strong></li>
</ol>
<p>Pergunta 1: Selecione os tipos de índices Milvus que pretende que o agente memorize</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_11_050ac891f0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pergunta 2: Escolha como o agente deve lidar com questões técnicas  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_12_d1d6d4f2ed.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pergunta 3: Especificar se o agente deve concentrar-se na orientação para uma versão específica do Milvus  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_13_5d60df75e9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-5-Review-and-Confirm-the-Generated-Agent" class="common-anchor-header">Passo 5. Revisar e confirmar o agente gerado</h3><p><strong>Nota:</strong> O sistema gera automaticamente a configuração do agente.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_14_8a596ae853.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Antes de criar o agente, é possível revisar seus metadados, ferramentas e avisos. Quando tudo estiver correto, clique em <strong>Criar</strong> para continuar.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_15_5c0b27aca7.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_16_998921b071.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-6-Explore-the-Interface-and-Feature-Areas" class="common-anchor-header">Etapa 6. Explorar a interface e as áreas de recursos</h3><p>Depois que o agente for criado, você verá três áreas funcionais no canto inferior esquerdo da interface:</p>
<p><strong>(1) Gatilhos</strong></p>
<p>Os gatilhos definem quando o agente deve ser executado, seja em resposta a eventos externos ou em uma programação:</p>
<ul>
<li><strong>Slack:</strong> Ativar o agente quando chega uma mensagem num canal específico</li>
<li><strong>Gmail:</strong> Aciona o agente quando um novo email é recebido</li>
<li><strong>Cron:</strong> Executar o agente num intervalo agendado</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_17_b77c603413.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(2) Caixa de ferramentas</strong></p>
<p>Este é o conjunto de ferramentas que o agente pode chamar. No exemplo apresentado, as três ferramentas são geradas automaticamente durante a criação e é possível adicionar mais ferramentas clicando em <strong>Adicionar ferramenta</strong>.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_18_94637d4548.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Se o seu agente necessitar de capacidades de pesquisa vetorial - como a pesquisa semântica em grandes volumes de documentação técnica - pode implementar o Servidor MCP do Milvus</strong> e adicioná-lo aqui utilizando o botão <strong>MCP</strong>. Certifique-se de que o servidor MCP está a ser executado <strong>num ponto de extremidade de rede acessível</strong>; caso contrário, o Agent Builder não será capaz de o invocar.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_19_94fe99a3b8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_20_f887a8fbda.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(3) Sub-agentes</strong></p>
<p>Crie módulos de agentes independentes dedicados a subtarefas específicas, permitindo uma conceção modular do sistema.</p>
<h3 id="Step-7-Test-the-Agent" class="common-anchor-header">Passo 7. Testar o agente</h3><p>Clique em <strong>Testar</strong> no canto superior direito para entrar no modo de teste. Abaixo está uma amostra dos resultados do teste.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_22_527619519b.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_23_639d40c40d.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_24_42a71d2592.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_25_8ab35e15f8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Agent-Builder-vs-DeepAgents-Which-One-Should-You-Choose" class="common-anchor-header">Agent Builder vs. DeepAgents: Qual deles você deve escolher?<button data-href="#Agent-Builder-vs-DeepAgents-Which-One-Should-You-Choose" class="anchor-icon" translate="no">
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
    </button></h2><p>A LangChain oferece vários frameworks de agentes, e a escolha certa depende de quanto controle você precisa. <a href="https://www.google.com/search?q=DeepAgents&amp;newwindow=1&amp;sca_esv=0e7ec9ce2aa7d5b4&amp;sxsrf=ANbL-n5pe1KqjmJVjQCqmc3jneYhmGGOUg%3A1769066335766&amp;ei=X89xab21Lp3a1e8Ppam06Ag&amp;ved=2ahUKEwio15nYzZ6SAxU_mq8BHcf3BqUQgK4QegQIARAB&amp;uact=5&amp;oq=what+is+DeepAgents&amp;gs_lp=Egxnd3Mtd2l6LXNlcnAiEndoYXQgaXMgRGVlcEFnZW50czIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzINEAAYgAQYsAMYQxiKBTINEAAYgAQYsAMYQxiKBUi8BlAYWL8FcAF4AZABAJgBqgKgAbAKqgEFMC4yLjS4AQPIAQD4AQGYAgGgAgyYAwCIBgGQBgqSBwExoAehHrIHALgHAMIHAzMtMcgHCYAIAA&amp;sclient=gws-wiz-serp">DeepAgents</a> é uma ferramenta de construção de agentes. É usada para construir agentes de IA autónomos e de longa duração que lidam com tarefas complexas e de várias etapas. Construído em LangGraph, ele suporta planejamento avançado, gerenciamento de contexto baseado em arquivo e orquestração de subagentes, tornando-o ideal para projetos de longo prazo ou de nível de produção.</p>
<p>Então, como isso se compara ao <strong>Agent Builder</strong> e quando você deve usar cada um deles?</p>
<p><strong>O Agent Builder</strong> se concentra na simplicidade e na velocidade. Ele abstrai a maioria dos detalhes de implementação, permitindo que você descreva seu agente em linguagem natural, configure ferramentas e execute-o imediatamente. A memória, o uso de ferramentas e os fluxos de trabalho humanos no circuito são tratados por si. Isso torna o Agent Builder perfeito para prototipagem rápida, ferramentas internas e validação em estágio inicial, onde a facilidade de uso é mais importante do que o controle granular.</p>
<p><strong>O DeepAgents</strong>, por outro lado, foi projetado para cenários em que é necessário controle total sobre a memória, a execução e a infraestrutura. É possível personalizar o middleware, integrar qualquer ferramenta Python, modificar o backend de armazenamento (incluindo a persistência de memória no <a href="https://milvus.io/blog">Milvus</a>) e gerenciar explicitamente o gráfico de estado do agente. A compensação é o esforço de engenharia - você mesmo escreve código, gerencia dependências e lida com modos de falha - mas obtém uma pilha de agentes totalmente personalizável.</p>
<p>É importante ressaltar que <strong>o Agent Builder e o DeepAgents não são ecossistemas separados - eles formam um único continuum</strong>. O Agent Builder é construído sobre o DeepAgents. Isso significa que você pode começar com um protótipo rápido no Agent Builder e, em seguida, usar o DeepAgents quando precisar de mais flexibilidade, sem reescrever tudo do zero. O inverso também funciona: padrões criados no DeepAgents podem ser empacotados como modelos do Agent Builder para que usuários não técnicos possam reutilizá-los.</p>
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
    </button></h2><p>Graças ao desenvolvimento da IA, a construção de agentes de IA já não requer fluxos de trabalho complexos ou engenharia pesada. Com o LangSmith Agent Builder, pode criar assistentes com estado e de longa duração utilizando apenas linguagem natural. O utilizador concentra-se na descrição do que o agente deve fazer, enquanto o sistema trata do planeamento, da execução da ferramenta e das actualizações contínuas da memória.</p>
<p>Em conjunto com o <a href="https://milvus.io/blog">Milvus</a>, estes agentes ganham uma memória fiável e persistente para pesquisa semântica, rastreio de preferências e contexto a longo prazo em todas as sessões. Seja para validar uma idéia ou implantar um sistema escalável, o LangSmith Agent Builder e o Milvus fornecem uma base simples e flexível para agentes que não apenas respondem - eles se lembram e melhoram com o tempo.</p>
<p>Tem dúvidas ou quer um passo a passo mais profundo? Junte-se ao nosso <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canal Slack</a> ou reserve uma sessão de 20 minutos <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">do Milvus Office Hours</a> para obter orientação personalizada.</p>
