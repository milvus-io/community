---
id: clawdbot-long-running-ai-agents-langgraph-milvus.md
title: >-
  Por que o Clawdbot se tornou viral - e como criar agentes de longa duração
  prontos para produção com LangGraph e Milvus
author: Min Yin
date: 2026-02-03T00:00:00.000Z
cover: >-
  assets.zilliz.com/Clawdbot_Long_Running_Agents_with_Lang_Graph_and_Milvus_62dab00205.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'AI Agent, Langgraph, Milvus, vector database, Clawdbot'
meta_keywords: 'Clawdbot, LangGraph, Milvus, AI Agents, Openclaw'
meta_title: |
  Build Clawdbot-Style AI Agents with LangGraph & Milvus
desc: >-
  O Clawdbot provou que as pessoas querem uma IA que actue. Saiba como criar
  agentes de longa duração prontos para produção com a arquitetura de dois
  agentes, Milvus e LangGraph.
origin: 'https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md'
---
<h2 id="Clawdbot-now-OpenClaw-went-viral" class="common-anchor-header">O Clawdbot (agora OpenClaw) tornou-se viral<button data-href="#Clawdbot-now-OpenClaw-went-viral" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openclaw_screenshot_two_agents_p1_9bf856b499.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://openclaw.ai/">O Clawdbot</a>, agora renomeado para OpenClaw, tomou a Internet de assalto na semana passada. O assistente de IA de código aberto criado por Peter Steinberger atingiu <a href="https://github.com/openclaw/openclaw">mais de 110.000 estrelas no GitHub</a> em apenas alguns dias. Os utilizadores publicaram vídeos em que o assistente fazia o check-in dos seus voos de forma autónoma, geria e-mails e controlava dispositivos domésticos inteligentes. Andrej Karpathy, o engenheiro fundador da OpenAI, elogiou-o. David Sacks, um fundador e investidor da Tech, tweetou sobre ele. As pessoas chamaram-lhe "Jarvis, mas real".</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/David_Stacks_replace_NYC_with_Mac_and_clawdbot_two_agent_p2_2f62f6ad49.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Depois vieram os avisos de segurança.</p>
<p>Os investigadores encontraram centenas de painéis de administração expostos. O bot funciona com acesso root por defeito. Não existe uma caixa de proteção. As vulnerabilidades de injeção de prompts podem permitir que os atacantes sequestrem o agente. Um pesadelo de segurança.</p>
<h2 id="Clawdbot-went-viral-for-a-reason" class="common-anchor-header">O Clawdbot tornou-se viral por uma razão<button data-href="#Clawdbot-went-viral-for-a-reason" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>O Clawdbot tornou-se viral por uma razão.</strong> É executado localmente ou no seu próprio servidor. Liga-se a aplicações de mensagens que as pessoas já utilizam - WhatsApp, Slack, Telegram, iMessage. Lembra-se do contexto ao longo do tempo em vez de se esquecer de tudo após cada resposta. Gere calendários, resume e-mails e automatiza tarefas entre aplicações.</p>
<p>Os utilizadores têm a sensação de uma IA pessoal, sem intervenção e sempre ativa, e não apenas de uma ferramenta de resposta rápida. O seu modelo de código aberto e auto-hospedado atrai os programadores que pretendem controlo e personalização. E a facilidade de integração com fluxos de trabalho existentes facilita a partilha e a recomendação.</p>
<h2 id="Two-challenges-for-building-long-running-agents" class="common-anchor-header">Dois desafios para a criação de agentes de longa duração<button data-href="#Two-challenges-for-building-long-running-agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>A popularidade do Clawdbot prova que as pessoas querem uma IA que</strong> <em>actue</em><strong>, não apenas que responda.</strong> Mas qualquer agente que funcione durante longos períodos e conclua tarefas reais - quer seja o Clawdbot ou algo construído por si - tem de resolver dois desafios técnicos: <strong>memória</strong> e <strong>verificação</strong>.</p>
<p><strong>O problema da memória</strong> aparece de várias maneiras:</p>
<ul>
<li><p>Os agentes esgotam a sua janela de contexto a meio da tarefa e deixam para trás trabalho meio acabado</p></li>
<li><p>Perdem de vista a lista completa de tarefas e declaram "feito" demasiado cedo</p></li>
<li><p>Não podem transferir o contexto entre sessões, pelo que cada nova sessão começa do zero</p></li>
</ul>
<p>Todos estes problemas têm a mesma origem: os agentes não têm memória persistente. As janelas de contexto são finitas, a recuperação entre sessões é limitada e o progresso não é registado de uma forma a que os agentes possam aceder.</p>
<p><strong>O problema da verificação</strong> é diferente. Mesmo quando a memória funciona, os agentes ainda marcam as tarefas como concluídas após um rápido teste unitário - sem verificar se o recurso realmente funciona de ponta a ponta.</p>
<p>O Clawdbot resolve ambos. Ele armazena memória localmente em todas as sessões e usa "habilidades" modulares para automatizar navegadores, arquivos e serviços externos. A abordagem funciona. Mas não está pronta para produção. Para uso corporativo, é preciso estrutura, auditabilidade e segurança que o Clawdbot não fornece imediatamente.</p>
<p>Este artigo aborda os mesmos problemas com soluções prontas para produção.</p>
<p>Para a memória, usamos uma <strong>arquitetura de dois agentes</strong> baseada na <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">pesquisa da Anthropic</a>: um agente inicializador que divide os projetos em recursos verificáveis e um agente codificador que trabalha com eles um de cada vez com transferências limpas. Para a recuperação semântica entre sessões, utilizamos <a href="https://milvus.io/">o Milvus</a>, uma base de dados vetorial que permite aos agentes pesquisar por significado e não por palavras-chave.</p>
<p>Para a verificação, usamos <strong>a automação do navegador</strong>. Em vez de confiar nos testes unitários, o agente testa as funcionalidades da forma como um utilizador real o faria.</p>
<p>Iremos apresentar os conceitos e, em seguida, mostraremos uma implementação funcional usando <a href="https://github.com/langchain-ai/langgraph">LangGraph</a> e Milvus.</p>
<h2 id="How-the-Two-Agent-Architecture-Prevents-Context-Exhaustion" class="common-anchor-header">Como a arquitetura de dois agentes evita a exaustão de contexto<button data-href="#How-the-Two-Agent-Architecture-Prevents-Context-Exhaustion" class="anchor-icon" translate="no">
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
    </button></h2><p>Cada LLM tem uma janela de contexto: um limite para a quantidade de texto que pode processar de uma só vez. Quando um agente trabalha numa tarefa complexa, esta janela enche-se de código, mensagens de erro, histórico de conversação e documentação. Quando a janela fica cheia, o agente pára ou começa a esquecer o contexto anterior. Para tarefas de longa duração, isto é inevitável.</p>
<p>Considere um agente que recebe uma solicitação simples: "Construir um clone de claude.ai." O projeto requer autenticação, interfaces de conversação, histórico de conversação, respostas em fluxo contínuo e dezenas de outras funcionalidades. Um único agente tentará lidar com tudo de uma vez. A meio da implementação da interface de conversação, a janela de contexto enche-se. A sessão termina com código meio escrito, sem documentação do que foi tentado e sem indicação do que funciona e do que não funciona. A próxima sessão herda uma confusão. Mesmo com a compactação de contexto, o novo agente tem que adivinhar o que a sessão anterior estava fazendo, depurar o código que não foi escrito e descobrir onde retomar. Horas são desperdiçadas antes que qualquer novo progresso seja feito.</p>
<h3 id="The-Two-Fold-Agent-Solution" class="common-anchor-header">A solução do agente duplo</h3><p>A solução da Anthropic, descrita em seu post de engenharia <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">"Effective harnesses for long-running agents",</a> é usar dois modos diferentes de prompt: <strong>um prompt inicializador</strong> para a primeira sessão e <strong>um prompt de codificação</strong> para as sessões seguintes.</p>
<p>Tecnicamente, ambos os modos usam o mesmo agente subjacente, prompt do sistema, ferramentas e chicote. A única diferença é a pergunta inicial do utilizador. Mas como eles têm funções distintas, pensar neles como dois agentes separados é um modelo mental útil. Chamamos a isto a arquitetura de dois agentes.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/two_agent_p3_f9dd23fed9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>O inicializador configura o ambiente para o progresso incremental.</strong> Ele recebe um pedido vago e faz três coisas:</p>
<ul>
<li><p><strong>Divide o projeto em caraterísticas específicas e verificáveis.</strong> Não são requisitos vagos como "criar uma interface de chat", mas passos concretos e testáveis: "o utilizador clica no botão Novo Chat → aparece uma nova conversa na barra lateral → a área de chat mostra o estado de boas-vindas". O exemplo do clone claude.ai da Anthropic tinha mais de 200 caraterísticas desse tipo.</p></li>
<li><p><strong>Cria um ficheiro de acompanhamento do progresso.</strong> Este ficheiro regista o estado de conclusão de cada funcionalidade, para que qualquer sessão possa ver o que está feito e o que falta fazer.</p></li>
<li><p><strong>Escreve scripts de configuração e faz um git commit inicial.</strong> Scripts como <code translate="no">init.sh</code> permitem que sessões futuras iniciem o ambiente de desenvolvimento rapidamente. O git commit estabelece uma linha de base limpa.</p></li>
</ul>
<p>O inicializador não planeia apenas. Ele cria uma infraestrutura que permite que as sessões futuras comecem a trabalhar imediatamente.</p>
<p><strong>O agente de codificação</strong> lida com cada sessão subsequente. Ele:</p>
<ul>
<li><p>Lê o arquivo de progresso e os logs do git para entender o estado atual</p></li>
<li><p>Executa um teste básico de ponta a ponta para confirmar que o aplicativo ainda funciona</p></li>
<li><p>Escolhe um recurso para trabalhar</p></li>
<li><p>Implementa a funcionalidade, testa-a minuciosamente, faz o commit no git com uma mensagem descritiva e actualiza o ficheiro de progresso</p></li>
</ul>
<p>Quando a sessão termina, a base de código está num estado que pode ser fundido: sem grandes bugs, código ordenado, documentação clara. Não há nenhum trabalho meio-terminado e nenhum mistério sobre o que foi feito. A próxima sessão começa exatamente onde esta parou.</p>
<h3 id="Use-JSON-for-Feature-Tracking-Not-Markdown" class="common-anchor-header">Use JSON para rastreamento de funcionalidades, não Markdown</h3><p><strong>Um detalhe de implementação que vale a pena notar: a lista de recursos deve ser JSON, não Markdown.</strong></p>
<p>Ao editar JSON, os modelos de IA tendem a modificar cirurgicamente campos específicos. Ao editar Markdown, eles geralmente reescrevem seções inteiras. Com uma lista de mais de 200 recursos, as edições de Markdown podem acidentalmente corromper seu acompanhamento de progresso.</p>
<p>Uma entrada JSON tem este aspeto:</p>
<pre><code translate="no">json
{
  <span class="hljs-string">&quot;category&quot;</span>: <span class="hljs-string">&quot;functional&quot;</span>,
  <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;New chat button creates a fresh conversation&quot;</span>,
  <span class="hljs-string">&quot;steps&quot;</span>: [
    <span class="hljs-string">&quot;Navigate to main interface&quot;</span>,
    <span class="hljs-string">&quot;Click the &#x27;New Chat&#x27; button&quot;</span>,
    <span class="hljs-string">&quot;Verify a new conversation is created&quot;</span>,
    <span class="hljs-string">&quot;Check that chat area shows welcome state&quot;</span>,
    <span class="hljs-string">&quot;Verify conversation appears in sidebar&quot;</span>
  ],
  <span class="hljs-string">&quot;passes&quot;</span>: <span class="hljs-literal">false</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>Cada recurso tem etapas de verificação claras. O campo <code translate="no">passes</code> regista a conclusão. Instruções com palavras fortes como "É inaceitável remover ou editar testes porque isso pode levar a funcionalidades ausentes ou com erros" também são recomendadas para evitar que o agente manipule o sistema excluindo recursos difíceis.</p>
<h2 id="How-Milvus-Gives-Agents-Semantic-Memory-Across-Sessions" class="common-anchor-header">Como é que o Milvus dá aos agentes memória semântica ao longo das sessões<button data-href="#How-Milvus-Gives-Agents-Semantic-Memory-Across-Sessions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>A arquitetura de dois agentes resolve o esgotamento do contexto, mas não resolve o esquecimento.</strong> Mesmo com transferências limpas entre sessões, o agente perde a noção do que aprendeu. Ele não consegue lembrar que "tokens de atualização JWT" está relacionado à "autenticação de usuário", a menos que essas palavras exatas apareçam no arquivo de progresso. À medida que o projeto cresce, a pesquisa em centenas de commits do git torna-se lenta. A correspondência de palavras-chave perde ligações que seriam óbvias para um humano.</p>
<p><strong>É aqui que entram as bases de dados vectoriais.</strong> Em vez de armazenar texto e procurar palavras-chave, uma base de dados vetorial converte texto em representações numéricas de significado. Quando pesquisa "autenticação de utilizador", encontra entradas sobre "tokens de atualização JWT" e "tratamento de sessões de início de sessão". Não porque as palavras coincidem, mas porque os conceitos são semanticamente próximos. O agente pode perguntar "já vi algo parecido com isto antes?" e obter uma resposta útil.</p>
<p><strong>Na prática, isto funciona através da incorporação de registos de progresso e commits git na base de dados como vectores.</strong> Quando uma sessão de programação começa, o agente consulta a base de dados com a sua tarefa atual. A base de dados devolve o histórico relevante em milissegundos: o que foi tentado antes, o que funcionou, o que falhou. O agente não começa do zero. Começa com o contexto.</p>
<p><a href="https://milvus.io/"><strong>O Milvus</strong></a> <strong>é uma boa opção para este caso de utilização.</strong> É de código aberto e foi concebido para pesquisa de vectores em escala de produção, lidando com milhares de milhões de vectores sem esforço. Para projectos mais pequenos ou desenvolvimento local, <a href="https://milvus.io/docs/milvus_lite.md">o Milvus Lite</a> pode ser incorporado diretamente numa aplicação como o SQLite. Não é necessária a configuração de um cluster. Quando o projeto crescer, pode migrar para o Milvus distribuído sem alterar o seu código. Para gerar embeddings, pode utilizar modelos externos como o <a href="https://www.sbert.net/">SentenceTransformer</a> para um controlo mais preciso, ou fazer referência a estas <a href="https://milvus.io/docs/embeddings.md">funções de embedding incorporadas</a> para configurações mais simples. O Milvus também suporta <a href="https://milvus.io/docs/hybridsearch.md">a pesquisa híbrida</a>, combinando a semelhança vetorial com a filtragem tradicional, para que possa consultar "encontrar problemas de autenticação semelhantes da última semana" numa única chamada.</p>
<p><strong>Isto também resolve o problema da transferência.</strong> A base de dados vetorial persiste fora de uma única sessão, pelo que o conhecimento se acumula ao longo do tempo. A sessão 50 tem acesso a tudo o que foi aprendido nas sessões 1 a 49. O projeto desenvolve a memória institucional.</p>
<h2 id="Verifying-Completion-with-Automated-Testing" class="common-anchor-header">Verificar a conclusão com testes automatizados<button data-href="#Verifying-Completion-with-Automated-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Mesmo com a arquitetura de dois agentes e a memória de longo prazo, os agentes podem declarar vitória demasiado cedo. Este é o problema da verificação.</strong></p>
<p>Aqui está um modo de falha comum: Uma sessão de codificação termina uma funcionalidade, executa um teste unitário rápido, vê que passou e vira <code translate="no">&quot;passes&quot;: false</code> para <code translate="no">&quot;passes&quot;: true</code>. Mas um teste unitário aprovado não significa que a funcionalidade realmente funciona. A API pode retornar dados corretos enquanto a interface do usuário não exibe nada por causa de um bug de CSS. O ficheiro de progresso diz "completo" enquanto os utilizadores não vêem nada.</p>
<p><strong>A solução é fazer com que o agente teste como um utilizador real.</strong> Cada funcionalidade da lista de funcionalidades tem etapas de verificação concretas: "o utilizador clica no botão Novo chat → aparece uma nova conversa na barra lateral → a área de chat mostra o estado de boas-vindas". O agente deve verificar estes passos literalmente. Em vez de executar apenas testes de nível de código, ele usa ferramentas de automação do navegador, como o Puppeteer, para simular o uso real. Abre a página, clica em botões, preenche formulários e verifica se os elementos certos aparecem no ecrã. Só quando o fluxo completo passa é que o agente marca a funcionalidade como concluída.</p>
<p><strong>Isto detecta problemas que os testes unitários não detectam</strong>. Uma funcionalidade de chat pode ter uma lógica de backend perfeita e respostas de API corretas. Mas se o frontend não renderizar a resposta, os utilizadores não vêem nada. A automação do navegador pode fazer uma captura de ecrã do resultado e verificar se o que aparece no ecrã corresponde ao que deveria aparecer. O campo <code translate="no">passes</code> só se torna <code translate="no">true</code> quando o recurso realmente funciona de ponta a ponta.</p>
<p><strong>No entanto, existem limitações.</strong> Alguns recursos nativos do navegador não podem ser automatizados por ferramentas como o Puppeteer. Seletores de arquivos e diálogos de confirmação do sistema são exemplos comuns. <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">O Anthropic observou</a> que os recursos que dependem de modais de alerta nativos do navegador tendem a ser mais problemáticos porque o agente não pode vê-los através do Puppeteer. A solução prática é projetar em torno dessas limitações. Use componentes de IU personalizados em vez de caixas de diálogo nativas sempre que possível, para que o agente possa testar cada etapa de verificação na lista de recursos.</p>
<h2 id="Putting-It-Together-LangGraph-for-Session-State-Milvus-for-Long-Term-Memory" class="common-anchor-header">Juntando tudo: LangGraph para estado de sessão, Milvus para memória de longo prazo<button data-href="#Putting-It-Together-LangGraph-for-Session-State-Milvus-for-Long-Term-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Os conceitos acima são reunidos num sistema funcional usando duas ferramentas: LangGraph para o estado da sessão e Milvus para a memória de longo prazo.</strong> O LangGraph gere o que está a acontecer numa única sessão: que funcionalidade está a ser trabalhada, o que foi concluído, o que se segue. O Milvus armazena o histórico pesquisável das sessões: o que foi feito antes, quais problemas foram encontrados e quais soluções funcionaram. Juntos, eles dão aos agentes memória de curto e longo prazo.</p>
<p><strong>Uma nota sobre esta implementação:</strong> O código abaixo é uma demonstração simplificada. Ele mostra os padrões principais em um único script, mas não replica totalmente a separação de sessões descrita anteriormente. Em uma configuração de produção, cada sessão de codificação seria uma invocação separada, potencialmente em máquinas diferentes ou em momentos diferentes. Os sites <code translate="no">MemorySaver</code> e <code translate="no">thread_id</code> no LangGraph permitem isso, persistindo o estado entre as invocações. Para ver claramente o comportamento de retomada, execute o script uma vez, pare-o e, em seguida, execute-o novamente com o mesmo <code translate="no">thread_id</code>. A segunda execução continuará de onde a primeira parou.</p>
<p>Python</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> MemorySaver
<span class="hljs-keyword">from</span> langgraph.graph <span class="hljs-keyword">import</span> StateGraph, START, END
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> TypedDict, Annotated
<span class="hljs-keyword">import</span> operator
<span class="hljs-keyword">import</span> subprocess
<span class="hljs-keyword">import</span> json

<span class="hljs-comment"># ==================== Initialization ====================</span>
embedding_model = SentenceTransformer(<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>)
milvus_client = MilvusClient(<span class="hljs-string">&quot;./milvus_agent_memory.db&quot;</span>)

<span class="hljs-comment"># Create collection</span>
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> milvus_client.has_collection(<span class="hljs-string">&quot;agent_history&quot;</span>):
    milvus_client.create_collection(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        dimension=<span class="hljs-number">384</span>,
        auto_id=<span class="hljs-literal">True</span>
    )

<span class="hljs-comment"># ==================== Milvus Operations ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">retrieve_context</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">3</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Retrieve relevant history from Milvus (core element: semantic retrieval)&quot;&quot;&quot;</span>
    query_vec = embedding_model.encode(query).tolist()
    results = milvus_client.search(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        data=[query_vec],
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;content&quot;</span>]
    )
    <span class="hljs-keyword">if</span> results <span class="hljs-keyword">and</span> results[<span class="hljs-number">0</span>]:
        <span class="hljs-keyword">return</span> [hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;content&quot;</span>] <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]
    <span class="hljs-keyword">return</span> []

<span class="hljs-keyword">def</span> <span class="hljs-title function_">save_progress</span>(<span class="hljs-params">content: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Save progress to Milvus (long-term memory)&quot;&quot;&quot;</span>
    embedding = embedding_model.encode(content).tolist()
    milvus_client.insert(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        data=[{<span class="hljs-string">&quot;vector&quot;</span>: embedding, <span class="hljs-string">&quot;content&quot;</span>: content}]
    )

<span class="hljs-comment"># ==================== Core Element 1: Git Commit ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">git_commit</span>(<span class="hljs-params">message: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Git commit (core element from the article)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># In a real project, actual Git commands would be executed</span>
        <span class="hljs-comment"># subprocess.run([&quot;git&quot;, &quot;add&quot;, &quot;.&quot;], check=True)</span>
        <span class="hljs-comment"># subprocess.run([&quot;git&quot;, &quot;commit&quot;, &quot;-m&quot;, message], check=True)</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Git Commit] <span class="hljs-subst">{message}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">True</span>
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Git Commit Failed] <span class="hljs-subst">{e}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>

<span class="hljs-comment"># ==================== Core Element 2: Test Verification ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">run_tests</span>(<span class="hljs-params">feature: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Run tests (end-to-end testing emphasized in the article)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># In a real project, testing tools like Puppeteer would be called</span>
        <span class="hljs-comment"># Simplified to simulated testing here</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Verification] Testing feature: <span class="hljs-subst">{feature}</span>&quot;</span>)
        <span class="hljs-comment"># Simulated test result</span>
        test_passed = <span class="hljs-literal">True</span>  <span class="hljs-comment"># In practice, this would return actual test results</span>
        <span class="hljs-keyword">if</span> test_passed:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Passed] <span class="hljs-subst">{feature}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> test_passed
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Failed] <span class="hljs-subst">{e}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>

<span class="hljs-comment"># ==================== State Definition ====================</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">AgentState</span>(<span class="hljs-title class_ inherited__">TypedDict</span>):
    messages: Annotated[<span class="hljs-built_in">list</span>, operator.add]
    features: <span class="hljs-built_in">list</span>  <span class="hljs-comment"># All features list</span>
    completed_features: <span class="hljs-built_in">list</span>  <span class="hljs-comment"># Completed features</span>
    current_feature: <span class="hljs-built_in">str</span>  <span class="hljs-comment"># Currently processing feature</span>
    session_count: <span class="hljs-built_in">int</span>  <span class="hljs-comment"># Session counter</span>

<span class="hljs-comment"># ==================== Two-Agent Nodes ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">initialize_node</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Initializer Agent: Generate feature list and set up work environment&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n========== Initializer Agent Started ==========&quot;</span>)
    
    <span class="hljs-comment"># Generate feature list (in practice, a detailed feature list would be generated based on requirements)</span>
    features = [
        <span class="hljs-string">&quot;Implement user registration&quot;</span>,
        <span class="hljs-string">&quot;Implement user login&quot;</span>,
        <span class="hljs-string">&quot;Implement password reset&quot;</span>,
        <span class="hljs-string">&quot;Implement user profile editing&quot;</span>,
        <span class="hljs-string">&quot;Implement session management&quot;</span>
    ]
    
    <span class="hljs-comment"># Save initialization info to Milvus</span>
    init_summary = <span class="hljs-string">f&quot;Project initialized with <span class="hljs-subst">{<span class="hljs-built_in">len</span>(features)}</span> features&quot;</span>
    save_progress(init_summary)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Initialization Complete] Feature list: <span class="hljs-subst">{features}</span>&quot;</span>)
    
    <span class="hljs-keyword">return</span> {
        **state,
        <span class="hljs-string">&quot;features&quot;</span>: features,
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: features[<span class="hljs-number">0</span>] <span class="hljs-keyword">if</span> features <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;messages&quot;</span>: [init_summary]
    }

<span class="hljs-keyword">def</span> <span class="hljs-title function_">code_node</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Coding Agent: Implement, test, commit (core loop node)&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n========== Coding Agent Session #<span class="hljs-subst">{state[<span class="hljs-string">&#x27;session_count&#x27;</span>] + <span class="hljs-number">1</span>}</span> ==========&quot;</span>)
    
    current_feature = state[<span class="hljs-string">&quot;current_feature&quot;</span>]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Current Task] <span class="hljs-subst">{current_feature}</span>&quot;</span>)
    
    <span class="hljs-comment"># ===== Core Element 3: Retrieve history from Milvus (cross-session memory) =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Retrieving History] Querying experiences related to &#x27;<span class="hljs-subst">{current_feature}</span>&#x27;...&quot;</span>)
    context = retrieve_context(current_feature)
    <span class="hljs-keyword">if</span> context:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Retrieval Results] Found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(context)}</span> relevant records:&quot;</span>)
        <span class="hljs-keyword">for</span> i, ctx <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(context, <span class="hljs-number">1</span>):
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  <span class="hljs-subst">{i}</span>. <span class="hljs-subst">{ctx[:<span class="hljs-number">60</span>]}</span>...&quot;</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[Retrieval Results] No relevant history (first time implementing this type of feature)&quot;</span>)
    
    <span class="hljs-comment"># ===== Step 1: Implement feature =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Starting Implementation] <span class="hljs-subst">{current_feature}</span>&quot;</span>)
    <span class="hljs-comment"># In practice, an LLM would be called to generate code</span>
    implementation_result = <span class="hljs-string">f&quot;Implemented feature: <span class="hljs-subst">{current_feature}</span>&quot;</span>
    
    <span class="hljs-comment"># ===== Step 2: Test verification (core element) =====</span>
    test_passed = run_tests(current_feature)
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> test_passed:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Session End] Tests did not pass, fixes needed&quot;</span>)
        <span class="hljs-keyword">return</span> state  <span class="hljs-comment"># Don&#x27;t proceed if tests fail</span>
    
    <span class="hljs-comment"># ===== Step 3: Git commit (core element) =====</span>
    commit_message = <span class="hljs-string">f&quot;feat: <span class="hljs-subst">{current_feature}</span>&quot;</span>
    git_commit(commit_message)
    
    <span class="hljs-comment"># ===== Step 4: Update progress file =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Updating Progress] Marking feature as complete&quot;</span>)
    
    <span class="hljs-comment"># ===== Step 5: Save to Milvus long-term memory =====</span>
    progress_record = <span class="hljs-string">f&quot;Completed feature: <span class="hljs-subst">{current_feature}</span> | Commit message: <span class="hljs-subst">{commit_message}</span> | Test status: passed&quot;</span>
    save_progress(progress_record)
    
    <span class="hljs-comment"># ===== Step 6: Update state and prepare for next feature =====</span>
    new_completed = state[<span class="hljs-string">&quot;completed_features&quot;</span>] + [current_feature]
    remaining_features = [f <span class="hljs-keyword">for</span> f <span class="hljs-keyword">in</span> state[<span class="hljs-string">&quot;features&quot;</span>] <span class="hljs-keyword">if</span> f <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> new_completed]
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Progress] Completed: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(new_completed)}</span>/<span class="hljs-subst">{<span class="hljs-built_in">len</span>(state[<span class="hljs-string">&#x27;features&#x27;</span>])}</span>&quot;</span>)
    <span class="hljs-comment"># ===== Core Element 4: Session end (clear session boundary) =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Session End] Codebase is in clean state, safe to interrupt\n&quot;</span>)
    
    <span class="hljs-keyword">return</span> {
        **state,
        <span class="hljs-string">&quot;completed_features&quot;</span>: new_completed,
        <span class="hljs-string">&quot;current_feature&quot;</span>: remaining_features[<span class="hljs-number">0</span>] <span class="hljs-keyword">if</span> remaining_features <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: state[<span class="hljs-string">&quot;session_count&quot;</span>] + <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;messages&quot;</span>: [implementation_result]
    }

<span class="hljs-comment"># ==================== Core Element 3: Loop Control ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">should_continue</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Determine whether to continue to next feature (incremental loop development)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> state[<span class="hljs-string">&quot;current_feature&quot;</span>] <span class="hljs-keyword">and</span> state[<span class="hljs-string">&quot;current_feature&quot;</span>] != <span class="hljs-string">&quot;&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;code&quot;</span>  <span class="hljs-comment"># Continue to next feature</span>
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n========== All Features Complete ==========&quot;</span>)
        <span class="hljs-keyword">return</span> END

<span class="hljs-comment"># ==================== Build Workflow ====================</span>
workflow = StateGraph(AgentState)

<span class="hljs-comment"># Add nodes</span>
workflow.add_node(<span class="hljs-string">&quot;initialize&quot;</span>, initialize_node)
workflow.add_node(<span class="hljs-string">&quot;code&quot;</span>, code_node)

<span class="hljs-comment"># Add edges</span>
workflow.add_edge(START, <span class="hljs-string">&quot;initialize&quot;</span>)
workflow.add_edge(<span class="hljs-string">&quot;initialize&quot;</span>, <span class="hljs-string">&quot;code&quot;</span>)

<span class="hljs-comment"># Add conditional edges (implement loop)</span>
workflow.add_conditional_edges(
    <span class="hljs-string">&quot;code&quot;</span>,
    should_continue,
    {
        <span class="hljs-string">&quot;code&quot;</span>: <span class="hljs-string">&quot;code&quot;</span>,  <span class="hljs-comment"># Continue loop</span>
        END: END  <span class="hljs-comment"># End</span>
    }
)

<span class="hljs-comment"># Compile workflow (using MemorySaver as checkpointer)</span>
app = workflow.<span class="hljs-built_in">compile</span>(checkpointer=MemorySaver())

<span class="hljs-comment"># ==================== Usage Example: Demonstrating Cross-Session Recovery ====================</span>
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Demo Scenario: Multi-Session Development for Long-Running Agents&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    
    <span class="hljs-comment"># ===== Session 1: Initialize + complete first 2 features =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n[Scenario 1] First launch: Complete first 2 features&quot;</span>)
    config = {<span class="hljs-string">&quot;configurable&quot;</span>: {<span class="hljs-string">&quot;thread_id&quot;</span>: <span class="hljs-string">&quot;project_001&quot;</span>}}
    
    result = app.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [],
        <span class="hljs-string">&quot;features&quot;</span>: [],
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>
    }, config)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[Simulated Scenario] Developer manually interrupts (Ctrl+C) or context window exhausted&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    
    <span class="hljs-comment"># ===== Session 2: Restore state from checkpoint =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n[Scenario 2] New session starts: Continue from last interruption&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Using the same thread_id, LangGraph automatically restores from checkpoint...&quot;</span>)
    
    <span class="hljs-comment"># Using the same thread_id, LangGraph will automatically restore state from checkpoint</span>
    result = app.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [],
        <span class="hljs-string">&quot;features&quot;</span>: [],
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>
    }, config)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Demo Complete!&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nKey Takeaways:&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;1. ✅ Two-Agent Architecture (initialize + code)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;2. ✅ Incremental Loop Development (conditional edges control loop)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;3. ✅ Git Commits (commit after each feature)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;4. ✅ Test Verification (end-to-end testing)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;5. ✅ Session Management (clear session boundaries)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;6. ✅ Cross-Session Recovery (thread_id + checkpoint)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;7. ✅ Semantic Retrieval (Milvus long-term memory)&quot;</span>)
  

**The key insight <span class="hljs-keyword">is</span> <span class="hljs-keyword">in</span> the last part.** By using the same `thread_id`, LangGraph automatically restores the checkpoint <span class="hljs-keyword">from</span> the previous session. Session <span class="hljs-number">2</span> picks up exactly where session <span class="hljs-number">1</span> stopped — no manual state transfer, no lost progress.

<button class="copy-code-btn"></button></code></pre>
<h3 id="Conclusion" class="common-anchor-header">Conclusão</h3><p>Os agentes de IA falham em tarefas de longa duração porque lhes falta memória persistente e verificação adequada. O Clawdbot tornou-se viral ao resolver estes problemas, mas a sua abordagem não está pronta para a produção.</p>
<p>Este artigo cobriu três soluções que estão:</p>
<ul>
<li><p><strong>Arquitetura de dois agentes:</strong> Um inicializador divide os projetos em recursos verificáveis; um agente de codificação trabalha com eles um de cada vez com transferências limpas. Isso evita a exaustão do contexto e torna o progresso rastreável.</p></li>
<li><p><strong>Base de dados vetorial para memória semântica:</strong> <a href="https://milvus.io/">O Milvus</a> armazena registos de progresso e commits do git como embeddings, para que os agentes possam pesquisar por significado e não por palavras-chave. A sessão 50 lembra-se do que a sessão 1 aprendeu.</p></li>
<li><p><strong>Automação do navegador para verificação real:</strong> Testes unitários verificam se o código é executado. O Puppeteer verifica se as funcionalidades funcionam realmente, testando o que os utilizadores vêem no ecrã.</p></li>
</ul>
<p>Estes padrões não se limitam ao desenvolvimento de software. A investigação científica, a modelação financeira, a revisão de documentos jurídicos - qualquer tarefa que abranja várias sessões e exija transferências fiáveis pode beneficiar.</p>
<p>Os princípios fundamentais:</p>
<ul>
<li><p>Utilizar um inicializador para dividir o trabalho em partes verificáveis</p></li>
<li><p>Acompanhar o progresso num formato estruturado e legível por máquina</p></li>
<li><p>Armazenar a experiência numa base de dados vetorial para recuperação semântica</p></li>
<li><p>Verificar a conclusão com testes reais, não apenas com testes unitários</p></li>
<li><p>Conceber limites de sessão limpos para que o trabalho possa ser interrompido e retomado em segurança</p></li>
</ul>
<p>As ferramentas existem. Os padrões estão comprovados. O que resta é aplicá-los.</p>
<p><strong>Pronto para começar?</strong></p>
<ul>
<li><p>Explore <a href="https://milvus.io/">o Milvus</a> e <a href="https://milvus.io/docs/milvus_lite.md">o Milvus Lite</a> para adicionar memória semântica aos seus agentes</p></li>
<li><p>Confira o LangGraph para gerenciar o estado da sessão</p></li>
<li><p>Leia <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">a pesquisa completa da Anthropic</a> sobre arreios de agentes de longa duração</p></li>
</ul>
<p><strong>Tem dúvidas ou quer partilhar o que está a construir?</strong></p>
<ul>
<li><p>Junte-se à <a href="https://milvus.io/slack">comunidade Milvus Slack</a> para se conectar com outros desenvolvedores</p></li>
<li><p>Participe no <a href="https://milvus.io/office-hours">Milvus Office Hours</a> para obter perguntas e respostas ao vivo com a equipa</p></li>
</ul>
