---
id: >-
  is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md
title: >-
  O RAG está a tornar-se obsoleto agora que estão a surgir agentes de longa data
  como o Claude Cowork?
author: Min Yin
date: 2026-1-27
desc: >-
  Uma análise aprofundada da memória a longo prazo de Claude Cowork, da memória
  gravável do agente, das soluções de compromisso RAG e da razão pela qual as
  bases de dados vectoriais ainda são importantes.
cover: assets.zilliz.com/RAG_vs_Long_Running_Agents_fc67810cf8.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, claude, RAG'
meta_keywords: >-
  Claude Cowork long-term memory, RAG vs Claude Cowork, vector databases for AI
  agents
meta_title: |
  RAG vs Long-Running Agents: Is RAG Obsolete? 
origin: >-
  https://milvus.io/blog/is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md
---
<p><a href="https://support.claude.com/en/articles/13345190-getting-started-with-cowork">O Claude Cowork</a> é um novo recurso de agente no aplicativo Claude Desktop. Do ponto de vista de um desenvolvedor, ele é basicamente um executor de tarefas automatizado em torno do modelo: ele pode ler, modificar e gerar arquivos locais, e pode planejar tarefas de várias etapas sem que você tenha que solicitar manualmente cada etapa. Pense nisso como o mesmo loop por trás do Claude Code, mas exposto ao desktop em vez de ao terminal.</p>
<p>A principal capacidade do Cowork é a sua capacidade de funcionar durante longos períodos sem perder o estado. Ele não atinge o habitual tempo limite de conversação ou redefinição de contexto. Pode continuar a trabalhar, acompanhar resultados intermédios e reutilizar informações anteriores em várias sessões. Isso dá a impressão de "memória de longo prazo", embora a mecânica subjacente seja mais como estado de tarefa persistente + transferência de contexto. De qualquer forma, a experiência é diferente do modelo de chat tradicional, em que tudo é reiniciado, a menos que se construa uma camada de memória própria.</p>
<p>Isto levanta duas questões práticas para os programadores:</p>
<ol>
<li><p><strong>Se o modelo já se consegue lembrar de informações passadas, onde é que o RAG ou o RAG agêntico se encaixam? As RAG vão ser substituídas?</strong></p></li>
<li><p><strong>Se quisermos um agente local, ao estilo Cowork, como é que nós próprios implementamos a memória de longo prazo?</strong></p></li>
</ol>
<p>O resto deste artigo aborda estas questões em pormenor e explica como as bases de dados vectoriais se enquadram neste novo cenário de "memória modelo".</p>
<h2 id="Claude-Cowork-vs-RAG-What’s-the-Difference" class="common-anchor-header">Claude Cowork vs. RAG: Qual é a diferença?<button data-href="#Claude-Cowork-vs-RAG-What’s-the-Difference" class="anchor-icon" translate="no">
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
    </button></h2><p>Como mencionei anteriormente, o Claude Cowork é um modo de agente dentro do Claude Desktop que pode ler e gravar arquivos locais, dividir tarefas em etapas menores e continuar trabalhando sem perder o estado. Ele mantém seu próprio contexto de trabalho, de modo que tarefas de várias horas não são reiniciadas como uma sessão de bate-papo normal.</p>
<p><strong>O RAG</strong> (Retrieval-Augmented Generation) resolve um problema diferente: dar a um modelo acesso a conhecimentos externos. Indexamos os dados numa base de dados vetorial, recuperamos partes relevantes para cada consulta e introduzimo-las no modelo. É amplamente utilizado porque fornece às aplicações LLM uma forma de "memória de longo prazo" para documentos, registos, dados de produtos e muito mais.</p>
<p>Se ambos os sistemas ajudam um modelo a "lembrar", qual é a diferença real?</p>
<h3 id="How-Cowork-Handles-Memory" class="common-anchor-header">Como o Cowork lida com a memória</h3><p>A memória do Cowork é de leitura e gravação. O agente decide que informação da tarefa ou conversa atual é relevante, armazena-a como entradas de memória e recupera-a mais tarde à medida que a tarefa avança. Isso permite que o Cowork mantenha a continuidade em fluxos de trabalho de longa duração - especialmente aqueles que produzem um novo estado intermediário à medida que progridem.</p>
<h3 id="How-RAG-and-Agentic-RAG-Handle-Memory" class="common-anchor-header">Como o RAG e o RAG Agêntico lidam com a memória</h3><p>O RAG padrão é uma recuperação orientada para a consulta: o utilizador pergunta algo, o sistema vai buscar documentos relevantes e o modelo utiliza-os para responder. O corpus de recuperação permanece estável e com versões, e os programadores controlam exatamente o que entra nele.</p>
<p>O RAG agêntico moderno alarga este padrão. O modelo pode decidir quando obter informações, o que obter e como utilizá-las durante o planeamento ou a execução de um fluxo de trabalho. Estes sistemas podem executar tarefas longas e chamar ferramentas, à semelhança do Cowork. Mas mesmo com o RAG agêntico, a camada de recuperação continua a ser orientada para o conhecimento e não para o estado. O agente recupera factos autorizados; não escreve o estado da sua tarefa em evolução no corpus.</p>
<p>Outra forma de o ver:</p>
<ul>
<li><p><strong>A memória do Cowork é orientada para a tarefa:</strong> o agente escreve e lê o seu próprio estado evolutivo.</p></li>
<li><p><strong>O RAG é orientado para o conhecimento:</strong> o sistema recupera informação estabelecida na qual o modelo se deve basear.</p></li>
</ul>
<h2 id="Reverse-Engineering-Claude-Cowork-How-It-Builds-Long-Running-Agent-Memory" class="common-anchor-header">Reverse-Engineering Claude Cowork: Como é que constrói uma memória de agente de longa duração<button data-href="#Reverse-Engineering-Claude-Cowork-How-It-Builds-Long-Running-Agent-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>O Cowork é muito falado porque lida com tarefas de vários passos sem se esquecer constantemente do que estava a fazer. Do ponto de vista de um desenvolvedor, eu me pergunto <strong>como ele mantém o estado em sessões tão longas?</strong> O Anthropic não publicou os detalhes internos, mas com base em experiências anteriores de desenvolvimento com o módulo de memória do Claude, podemos montar um modelo mental decente.</p>
<p>Claude parece confiar em uma configuração híbrida: <strong>uma camada de memória de longo prazo persistente e ferramentas de recuperação sob demanda.</strong> Em vez de colocar a conversa completa em cada pedido, o Claude puxa seletivamente o contexto passado apenas quando decide que é relevante. Isto permite que o modelo mantenha a precisão elevada sem gastar tokens de cada vez.</p>
<p>Se decompormos a estrutura da solicitação, ela fica mais ou menos assim:</p>
<pre><code translate="no">[<span class="hljs-meta">0</span>] Static system instructions
[<span class="hljs-meta">1</span>] <span class="hljs-function">User <span class="hljs-title">memory</span> (<span class="hljs-params"><span class="hljs-built_in">long</span>-term</span>)
[2] Retrieved / pruned conversation history
[3] Current user message
</span><button class="copy-code-btn"></button></code></pre>
<p>O comportamento interessante não é a estrutura em si - é como o modelo decide o que atualizar e quando executar a recuperação.</p>
<h3 id="User-Memory-The-Persistent-Layer" class="common-anchor-header">Memória do utilizador: A camada persistente</h3><p>O Claude mantém um armazenamento de memória de longo prazo que é atualizado ao longo do tempo. E, ao contrário do sistema de memória mais previsível do ChatGPT, o do Claude parece um pouco mais "vivo". Ele armazena memórias em blocos do tipo XML e as atualiza de duas maneiras:</p>
<ul>
<li><p><strong>Actualizações implícitas:</strong> Por vezes, o modelo decide que algo é uma preferência ou um facto estável e escreve-o discretamente na memória. Estas actualizações não são instantâneas; aparecem após alguns turnos, e as memórias mais antigas podem desaparecer se a conversa relacionada desaparecer.</p></li>
<li><p><strong>Actualizações explícitas:</strong> Os utilizadores podem modificar diretamente a memória com a ferramenta <code translate="no">memory_user_edits</code> ("lembrar X", "esquecer Y"). Estas escritas são imediatas e comportam-se mais como uma operação CRUD.</p></li>
</ul>
<p>O Claude está a executar heurísticas de fundo para decidir o que vale a pena persistir, e não está à espera de instruções explícitas.</p>
<h3 id="Conversation-Retrieval-The-On-Demand-Part" class="common-anchor-header">Recuperação de conversas: A parte sob demanda</h3><p>O Claude <em>não</em> mantém um resumo contínuo como muitos sistemas LLM. Em vez disso, tem uma caixa de ferramentas de funções de recuperação que pode chamar sempre que achar que está a faltar contexto. Estas chamadas de recuperação não acontecem a cada turno - o modelo acciona-as com base no seu próprio julgamento interno.</p>
<p>O destaque é <code translate="no">conversation_search</code>. Quando o utilizador diz algo vago, como "aquele projeto do mês passado", o Claude dispara frequentemente esta ferramenta para procurar turnos relevantes. O que é notável é que continua a funcionar quando a frase é ambígua ou numa língua diferente. Isto implica muito claramente:</p>
<ul>
<li><p>Algum tipo de correspondência semântica (embeddings)</p></li>
<li><p>Provavelmente combinado com normalização ou tradução ligeira</p></li>
<li><p>Pesquisa de palavras-chave para maior precisão</p></li>
</ul>
<p>Basicamente, isto parece-se muito com um sistema RAG em miniatura incluído no conjunto de ferramentas do modelo.</p>
<h3 id="How-Claude’s-Retrieval-Behavior-Differs-From-Basic-History-Buffers" class="common-anchor-header">Como o comportamento de recuperação do Claude difere dos buffers de histórico básicos</h3><p>Dos testes e logs, alguns padrões se destacam:</p>
<ul>
<li><p><strong>A recuperação não é automática.</strong> O modelo escolhe quando chamá-la. Se achar que já tem contexto suficiente, nem sequer se dá ao trabalho.</p></li>
<li><p><strong>As partes recuperadas incluem</strong> <strong>mensagens do utilizador e do assistente.</strong> Isto é útil - mantém mais nuances do que os resumos apenas do utilizador.</p></li>
<li><p><strong>A utilização de tokens mantém-se normal.</strong> Uma vez que o histórico não é injetado a cada passo, as sessões longas não se tornam imprevisíveis.</p></li>
</ul>
<p>No geral, parece um LLM aumentado por recuperação, exceto que a recuperação acontece como parte do próprio ciclo de raciocínio do modelo.</p>
<p>Esta arquitetura é inteligente, mas não é gratuita:</p>
<ul>
<li><p>A recuperação acrescenta latência e mais "partes móveis" (indexação, classificação, reclassificação).</p></li>
<li><p>Ocasionalmente, o modelo julga mal se precisa de contexto, o que significa que se assiste ao clássico "esquecimento do LLM", apesar de os dados <em>estarem</em> disponíveis.</p></li>
<li><p>A depuração torna-se mais complicada porque o comportamento do modelo depende de accionamentos invisíveis da ferramenta, e não apenas da entrada de dados.</p></li>
</ul>
<h3 id="Claude-Cowork-vs-Claude-Codex-in-handling-long-term-memory" class="common-anchor-header">Claude Cowork vs Claude Codex no tratamento da memória de longo prazo</h3><p>Em contraste com a configuração de Claude, que é muito pesada em termos de recuperação, o ChatGPT lida com a memória de uma forma muito mais estruturada e previsível. Em vez de fazer pesquisas semânticas ou tratar conversas antigas como um mini vetor de armazenamento, o ChatGPT injeta memória diretamente em cada sessão através dos seguintes componentes em camadas:</p>
<ul>
<li><p>Memória do utilizador</p></li>
<li><p>Metadados da sessão</p></li>
<li><p>Mensagens da sessão atual</p></li>
</ul>
<p><strong>Memória do utilizador</strong></p>
<p>A memória do utilizador é a principal camada de armazenamento a longo prazo - a parte que persiste através das sessões e pode ser editada pelo utilizador. Armazena coisas bastante normais: nome, antecedentes, projectos em curso, preferências de aprendizagem, esse tipo de coisas. Cada nova conversa tem este bloco injetado no início, por isso o modelo começa sempre com uma visão consistente do utilizador.</p>
<p>O ChatGPT actualiza esta camada de duas formas:</p>
<ul>
<li><p><strong>Actualizações explícitas:</strong> Os utilizadores podem dizer ao modelo para "lembrar isto" ou "esquecer aquilo", e a memória muda imediatamente. Isto é basicamente uma API CRUD que o modelo expõe através de linguagem natural.</p></li>
<li><p><strong>Actualizações implícitas:</strong> Se o modelo detetar informações que se enquadrem nas regras da OpenAI para a memória a longo prazo - como um cargo ou uma preferência - e o utilizador não tiver desativado a memória, esta será discretamente adicionada por si própria.</p></li>
</ul>
<p>Do ponto de vista do programador, esta camada é simples, determinística e fácil de compreender. Não há pesquisas embutidas, nem heurísticas sobre o que buscar.</p>
<p><strong>Metadados da sessão</strong></p>
<p>Os metadados de sessão situam-se no extremo oposto do espetro. Tem vida curta, não é persistente e só é injetado uma vez no início de uma sessão. Pense neles como variáveis de ambiente para a conversa. Isto inclui coisas como:</p>
<ul>
<li><p>o dispositivo em que se encontra</p></li>
<li><p>estado da conta/assinatura</p></li>
<li><p>padrões de utilização aproximados (dias activos, distribuição do modelo, duração média da conversa)</p></li>
</ul>
<p>Estes metadados ajudam o modelo a moldar as respostas para o ambiente atual - por exemplo, escrever respostas mais curtas no telemóvel - sem poluir a memória de longo prazo.</p>
<p><strong>Mensagens da sessão atual</strong></p>
<p>Este é o histórico padrão de janela deslizante: todas as mensagens na conversa atual até que o limite de token seja atingido. Quando a janela se torna demasiado grande, os turnos mais antigos desaparecem automaticamente.</p>
<p>Crucialmente, este despejo <strong>não afecta</strong> a Memória do Utilizador ou os resumos entre sessões. Apenas o histórico da conversa local diminui.</p>
<p>A maior divergência do Claude aparece em como o ChatGPT lida com conversas "recentes mas não atuais". O Claude chamará uma ferramenta de busca para recuperar o contexto passado se achar que é relevante. O ChatGPT não faz isso.</p>
<p>Em vez disso, o ChatGPT mantém um <strong>resumo</strong> muito leve <strong>entre sessões</strong> que é injetado em cada conversa. Alguns detalhes importantes sobre essa camada:</p>
<ul>
<li><p>Ele resume <strong>apenas as mensagens do usuário</strong>, não as mensagens do assistente.</p></li>
<li><p>Armazena um conjunto muito pequeno de itens - cerca de 15 - apenas o suficiente para capturar temas ou interesses estáveis.</p></li>
<li><p>Não efectua <strong>nenhum cálculo de incorporação, nenhuma classificação de semelhança e nenhuma chamada de recuperação</strong>. É basicamente um contexto pré-mastigado, não uma pesquisa dinâmica.</p></li>
</ul>
<p>Do ponto de vista da engenharia, esta abordagem troca a flexibilidade pela previsibilidade. Não há chance de uma falha estranha na recuperação, e a latência da inferência permanece estável porque nada está sendo buscado na hora. A desvantagem é que o ChatGPT não vai puxar uma mensagem aleatória de seis meses atrás, a menos que ela tenha entrado na camada de resumo.</p>
<h2 id="Challenges-to-Making-Agent-Memory-Writable" class="common-anchor-header">Desafios para tornar a memória do agente gravável<button data-href="#Challenges-to-Making-Agent-Memory-Writable" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando um agente passa da <strong>memória somente leitura</strong> (típica RAG) para a <strong>memória gravável - onde</strong>pode registrar as ações, decisões e preferências do usuário - a complexidade aumenta rapidamente. Já não se trata apenas de recuperar documentos; é necessário manter um estado crescente do qual o modelo depende.</p>
<p>Um sistema de memória gravável tem de resolver três problemas reais:</p>
<ol>
<li><p><strong>O que lembrar:</strong> O agente precisa de regras para decidir quais os eventos, preferências ou observações que vale a pena guardar. Sem isso, a memória ou explode em tamanho ou enche-se de ruído.</p></li>
<li><p><strong>Como armazenar e distribuir a memória:</strong> Nem toda a memória é igual. Itens recentes, factos de longo prazo e notas efémeras precisam de diferentes camadas de armazenamento, políticas de retenção e estratégias de indexação.</p></li>
<li><p><strong>Como escrever rapidamente sem quebrar a recuperação:</strong> A memória deve ser escrita continuamente, mas as actualizações frequentes podem degradar a qualidade do índice ou tornar as consultas lentas se o sistema não for concebido para inserções de elevado débito.</p></li>
</ol>
<h3 id="Challenge-1-What-Is-Worth-Remembering" class="common-anchor-header">Desafio 1: O que vale a pena lembrar?</h3><p>Nem tudo o que um utilizador faz deve acabar na memória de longo prazo. Se alguém cria um ficheiro temporário e o apaga cinco minutos mais tarde, gravar isso para sempre não ajuda ninguém. Esta é a dificuldade central: <strong>como é que o sistema decide o que é realmente importante?</strong></p>
<p><strong>(1) Formas comuns de avaliar a importância</strong></p>
<p>As equipas normalmente recorrem a uma mistura de heurísticas:</p>
<ul>
<li><p><strong>Baseada no tempo</strong>: as acções recentes têm mais importância do que as antigas</p></li>
<li><p><strong>Baseada na frequência</strong>: os ficheiros ou acções acedidos repetidamente são mais importantes</p></li>
<li><p><strong>Baseada no tipo</strong>: alguns objectos são inerentemente mais importantes (por exemplo, ficheiros de configuração do projeto vs. ficheiros de cache)</p></li>
</ul>
<p><strong>(2) Quando as regras entram em conflito</strong></p>
<p>Estes sinais entram frequentemente em conflito. Um ficheiro criado na semana passada mas muito editado hoje - deve ganhar a idade ou a atividade? Não existe uma única resposta "correta", e é por isso que a pontuação de importância tende a tornar-se confusa rapidamente.</p>
<p><strong>(3) Como as bases de dados vectoriais ajudam</strong></p>
<p>As bases de dados vectoriais fornecem-lhe mecanismos para aplicar regras de importância sem limpeza manual:</p>
<ul>
<li><p><strong>TTL:</strong> o Milvus pode remover automaticamente os dados após um determinado período de tempo</p></li>
<li><p><strong>Decadência:</strong> os vectores mais antigos podem ser reduzidos para que desapareçam naturalmente da recuperação</p></li>
</ul>
<h3 id="Challenge-2-Memory-Tiering-in-Practice" class="common-anchor-header">Desafio 2: Classificação de memória na prática</h3><p>À medida que os agentes trabalham por mais tempo, a memória acumula-se. Manter tudo em armazenamento rápido não é sustentável, por isso o sistema precisa de uma forma de dividir a memória em camadas <strong>quentes</strong> (frequentemente acedidas) e <strong>frias</strong> (raramente acedidas).</p>
<p><strong>(1) Decidindo quando a memória se torna fria</strong></p>
<p>Neste modelo, <em>a memória quente</em> refere-se a dados mantidos na RAM para acesso de baixa latência, enquanto <em>a memória fria</em> refere-se a dados movidos para o disco ou armazenamento de objectos para reduzir o custo.</p>
<p>A decisão de quando a memória se torna fria pode ser tratada de diferentes maneiras. Alguns sistemas utilizam modelos leves para estimar a importância semântica de uma ação ou ficheiro com base no seu significado e utilização recente. Outros baseiam-se numa lógica simples, baseada em regras, como mover a memória que não tenha sido acedida durante 30 dias ou que não tenha aparecido nos resultados da recuperação durante uma semana. Os utilizadores também podem marcar explicitamente determinados ficheiros ou acções como importantes, garantindo que permanecem sempre quentes.</p>
<p><strong>(2) Onde são armazenadas as memórias quentes e frias</strong></p>
<p>Uma vez classificadas, as memórias quentes e frias são armazenadas de forma diferente. A memória quente permanece na RAM e é utilizada para conteúdos frequentemente acedidos, como o contexto de tarefas activas ou acções recentes do utilizador. A memória fria é movida para o disco ou para sistemas de armazenamento de objectos como o S3, onde o acesso é mais lento mas os custos de armazenamento são muito mais baixos. Esta solução de compromisso funciona bem porque a memória fria raramente é necessária e, normalmente, é acedida apenas para referência a longo prazo.</p>
<p><strong>(3) Como as bases de dados vectoriais ajudam</strong></p>
<p><strong>O Milvus e o Zilliz Cloud</strong> suportam este padrão ao permitirem o armazenamento em camadas quente-frio, mantendo uma única interface de consulta, de modo a que os vectores acedidos frequentemente permaneçam na memória e os dados mais antigos sejam movidos automaticamente para um armazenamento de menor custo.</p>
<h3 id="Challenge-3-How-Fast-Should-Memory-Be-Written" class="common-anchor-header">Desafio 3: Com que velocidade a memória deve ser gravada?</h3><p>Os sistemas RAG tradicionais normalmente escrevem dados em lotes. Os índices são reconstruídos offline - muitas vezes durante a noite - e só se tornam pesquisáveis mais tarde. Esta abordagem funciona para bases de conhecimento estáticas, mas não se adequa à memória do agente.</p>
<p><strong>(1) Por que a memória do agente precisa de gravações em tempo real</strong></p>
<p>A memória do agente deve capturar as acções do utilizador à medida que estas acontecem. Se uma ação não for registada imediatamente, o próximo turno de conversação pode carecer de contexto crítico. Por esta razão, os sistemas de memória gravável requerem gravações em tempo real em vez de actualizações atrasadas e offline.</p>
<p><strong>(2) A tensão entre a velocidade de escrita e a qualidade da recuperação</strong></p>
<p>A memória em tempo real exige uma latência de escrita muito baixa. Ao mesmo tempo, a recuperação de alta qualidade depende de índices bem construídos, e a construção de índices leva tempo. Reconstruir um índice para cada gravação é muito caro, mas atrasar a indexação significa que os dados recém-escritos permanecem temporariamente invisíveis para recuperação. Este compromisso está no centro do design da memória gravável.</p>
<p><strong>(3) Como os bancos de dados vetoriais ajudam</strong></p>
<p>Os bancos de dados vetoriais resolvem esse problema desacoplando a gravação da indexação. Uma solução comum é transmitir escritas e executar construções incrementais de índices. Usando <strong>o Milvus</strong> como exemplo, os novos dados são primeiro gravados em um buffer na memória, permitindo que o sistema lide com gravações de alta frequência de forma eficiente. Mesmo antes de um índice completo ser criado, os dados armazenados em buffer podem ser consultados em segundos por meio de mesclagem dinâmica ou pesquisa aproximada.</p>
<p>Quando o buffer atinge um limite predefinido, o sistema constrói índices em lotes e os persiste. Isto melhora o desempenho da recuperação a longo prazo sem bloquear as escritas em tempo real. Ao separar a ingestão rápida da construção mais lenta de índices, o Milvus alcança um equilíbrio prático entre velocidade de gravação e qualidade de pesquisa que funciona bem para a memória do agente.</p>
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
    </button></h2><p>O Cowork dá-nos um vislumbre de uma nova classe de agentes - persistentes, com estado e capazes de transportar contexto através de longas linhas de tempo. Mas também deixa claro outra coisa: a memória de longo prazo é apenas metade do quadro. Para construir agentes prontos para a produção que sejam autónomos e fiáveis, continuamos a precisar de uma recuperação estruturada de grandes bases de conhecimento em evolução.</p>
<p>As RAG tratam dos factos do mundo; a memória gravável trata do estado interno do agente. E as bases de dados vectoriais encontram-se na intersecção, fornecendo indexação, pesquisa híbrida e armazenamento escalável que permitem que ambas as camadas trabalhem em conjunto.</p>
<p>À medida que os agentes de longa duração continuam a amadurecer, as suas arquitecturas irão provavelmente convergir para este design híbrido. O Cowork é um forte sinal do rumo que as coisas estão a tomar - não para um mundo sem RAG, mas para agentes com pilhas de memória mais ricas, alimentadas por bases de dados vectoriais subjacentes.</p>
<p>Se quiser explorar estas ideias ou obter ajuda com a sua própria configuração, <strong>junte-se ao nosso</strong> <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Canal Slack</a> para conversar com os engenheiros da Milvus. E para uma orientação mais prática, pode sempre <strong>reservar uma</strong> <strong>sessão</strong> <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>Milvus Office Hours</strong></a> <strong>.</strong></p>
