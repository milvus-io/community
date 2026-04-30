---
id: how-robobrain-builds-longterm-robot-memory-with-milvus.md
title: Como é que o RoboBrain constrói a memória a longo prazo do robô com o Milvus
author: Song Zhi
date: 2026-4-30
cover: assets.zilliz.com/robobrain_cover_a96f93fbce.jpg
tag: Use Cases
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'robot agent, robot memory, task execution, vector database, Milvus'
meta_title: |
  How RoboBrain Builds Long-Term Robot Memory with Milvus
desc: >-
  Os módulos dos robots podem trabalhar sozinhos mas falham quando estão
  encadeados. O Diretor Executivo da Senqi AI explica como o RoboBrain utiliza o
  estado da tarefa, o feedback e a memória Milvus.
origin: >-
  https://milvus.io/blog/how-robobrain-builds-longterm-robot-memory-with-milvus.md
---
<p><em>Este artigo é da autoria de Song Zhi, Diretor Executivo da Senqi AI, uma empresa de IA incorporada que desenvolve infra-estruturas de execução de tarefas para robôs. O RoboBrain é um dos principais produtos da Senqi AI.</em></p>
<p>A maioria das capacidades dos robôs funciona bem por si só. Um modelo de navegação pode planear um percurso. Um modelo de perceção pode identificar objectos. Um módulo de fala pode aceitar instruções. A falha na produção surge quando essas capacidades têm de ser executadas como uma tarefa contínua.</p>
<p>Para um robô, uma simples instrução como "vá verificar aquela área, fotografe qualquer coisa invulgar e avise-me" requer planeamento antes de a tarefa começar, adaptação enquanto decorre e produção de um resultado útil quando termina. Cada transferência pode falhar: a navegação pára atrás de um obstáculo, uma fotografia desfocada é aceite como definitiva ou o sistema esquece-se da exceção que tratou há cinco minutos.</p>
<p>Este é o principal desafio para os <a href="https://zilliz.com/glossary/ai-agents">agentes de IA</a> que operam no mundo físico. Ao contrário dos agentes digitais, os robôs executam contra <a href="https://zilliz.com/learn/introduction-to-unstructured-data">dados</a> contínuos <a href="https://zilliz.com/learn/introduction-to-unstructured-data">não estruturados</a>: caminhos bloqueados, mudanças de luz, limites da bateria, ruído dos sensores e regras do operador.</p>
<p>O RoboBrain é o sistema operativo de inteligência incorporada da Senqi AI para a execução de tarefas por robôs. Situa-se na camada da tarefa, ligando a perceção, o planeamento, o controlo da execução e o feedback dos dados, para que as instruções em linguagem natural se transformem em fluxos de trabalho de robôs estruturados e recuperáveis.</p>
<table>
<thead>
<tr><th>Ponto de interrupção</th><th>O que falha na produção</th><th>Como é que o RoboBrain o resolve</th></tr>
</thead>
<tbody>
<tr><td>Planeamento de tarefas</td><td>Instruções vagas deixam os módulos a jusante sem campos de execução concretos.</td><td>A objetivação da tarefa transforma a intenção em estado partilhado.</td></tr>
<tr><td>Encaminhamento de contexto</td><td>A informação correta existe, mas chega à fase de decisão errada.</td><td>A memória escalonada encaminha separadamente o contexto em tempo real, a curto prazo e a longo prazo.</td></tr>
<tr><td>Feedback de dados</td><td>Uma única passagem é concluída ou falha sem melhorar a próxima execução.</td><td>Os writebacks de feedback actualizam o estado da tarefa e a memória de longo prazo.</td></tr>
</tbody>
</table>
<h2 id="Three-Breakpoints-in-Robot-Task-Execution" class="common-anchor-header">Três pontos de paragem na execução de tarefas de robôs<button data-href="#Three-Breakpoints-in-Robot-Task-Execution" class="anchor-icon" translate="no">
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
    </button></h2><p>As tarefas de software podem frequentemente ser delimitadas como entrada, processo e resultado. As tarefas do robô correm contra um estado físico em movimento: caminhos bloqueados, mudanças de luz, limites da bateria, ruído dos sensores e regras do operador.</p>
<p>É por isso que o ciclo de tarefas precisa de mais do que modelos isolados. Precisa de uma forma de preservar o contexto através do planeamento, execução e feedback.</p>
<h3 id="1-Task-Planning-Vague-Instructions-Produce-Vague-Execution" class="common-anchor-header">1. Planeamento de tarefas: Instruções vagas produzem uma execução vaga</h3><p>Uma frase como "vai dar uma olhadela" esconde uma série de decisões. Que área? O que é que o robô deve fotografar? O que é que conta como invulgar? O que deve fazer se a fotografia falhar? Que resultado deve ser devolvido ao operador?</p>
<p>Se a camada de tarefa não conseguir resolver estes detalhes em campos concretos - área alvo, objeto de inspeção, condição de conclusão, política de falha e formato de retorno - a tarefa corre sem direção desde o início e nunca recupera o contexto a jusante.</p>
<h3 id="2-Context-Routing-The-Right-Data-Reaches-the-Wrong-Stage" class="common-anchor-header">2. Encaminhamento do contexto: Os dados corretos chegam à fase errada</h3><p>A pilha do robot pode já conter a informação correta, mas a execução da tarefa depende da sua recuperação na fase correta.</p>
<p>A fase de arranque precisa de mapas, definições de áreas e regras de funcionamento. A meio da execução precisa do estado do sensor em tempo real. O tratamento de excepções necessita de casos semelhantes de implementações anteriores. Quando essas fontes estão misturadas, o sistema toma o tipo certo de decisão com o contexto errado.</p>
<p>Quando o encaminhamento falha, o arranque puxa a experiência obsoleta em vez das regras da área, o tratamento de excepções não consegue chegar aos casos de que necessita e a meio da execução obtém o mapa de ontem em vez de leituras em tempo real. Dar a alguém um dicionário não o ajuda a escrever um ensaio. Os dados têm de chegar ao ponto de decisão correto, na fase correta e na forma correta.</p>
<h3 id="3-Data-Feedback-Single-Pass-Execution-Does-Not-Improve" class="common-anchor-header">3. Feedback dos dados: A execução de uma só passagem não melhora</h3><p>Sem writeback, um robot pode terminar uma execução sem melhorar a próxima. Uma ação concluída ainda precisa de uma verificação de qualidade: a imagem é suficientemente nítida ou o robô deve voltar a fotografar? O caminho ainda está livre ou deve ser desviado? A bateria está acima do limite, ou a tarefa deve ser terminada?</p>
<p>Um sistema de passagem única não tem qualquer mecanismo para estas chamadas. Ele executa, pára e repete a mesma falha na próxima vez.</p>
<h2 id="How-RoboBrain-Closes-the-Robot-Task-Loop" class="common-anchor-header">Como o RoboBrain fecha o ciclo de tarefas do robô<button data-href="#How-RoboBrain-Closes-the-Robot-Task-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p>O RoboBrain liga a compreensão do ambiente, o planeamento da tarefa, o controlo da execução e o feedback dos dados num ciclo operacional.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_robobrain_builds_longterm_robot_memory_with_milvus_2_660d1c90e3.png" alt="RoboBrain core middleware architecture showing how user intent flows through task objects, stage-aware memory powered by Milvus, and a policy engine before reaching embodied capabilities" class="doc-image" id="robobrain-core-middleware-architecture-showing-how-user-intent-flows-through-task-objects,-stage-aware-memory-powered-by-milvus,-and-a-policy-engine-before-reaching-embodied-capabilities" />
   </span> <span class="img-wrapper"> <span>A arquitetura central do middleware RoboBrain mostra como a intenção do utilizador flui através dos objectos de tarefa, da memória com reconhecimento de fases alimentada por Milvus e de um motor de políticas antes de atingir as capacidades incorporadas</span> </span></p>
<p>Na arquitetura descrita neste artigo, esse ciclo é implementado através de três mecanismos:</p>
<ol>
<li><strong>A objetivação</strong> de<strong>tarefas</strong> estrutura o ponto de entrada.</li>
<li><strong>A memória escalonada</strong> encaminha a informação correta para a fase correta.</li>
<li><strong>Um ciclo de feedback</strong> escreve os resultados de volta e decide o próximo passo.</li>
</ol>
<p>Estes mecanismos só funcionam em conjunto. Se corrigirmos um sem os outros, a cadeia continua a quebrar-se no ponto seguinte.</p>
<h3 id="1-Task-Objectification-Turning-Intent-into-Shared-State" class="common-anchor-header">1. Objetivação de tarefas: Transformar a intenção em estado partilhado</h3><p>Antes do início da execução, o RoboBrain transforma cada instrução num objeto de tarefa: tipo de tarefa, área alvo, objeto de inspeção, restrições, resultado esperado, fase atual e política de falhas.</p>
<p>O objetivo não é apenas analisar a linguagem. O objetivo é dar a cada módulo a jusante a mesma visão de estado da tarefa. Sem essa conversão, a tarefa não tem direção.</p>
<p>No exemplo da patrulha, o objeto de tarefa preenche o tipo de inspeção, a zona designada, os itens anómalos como o objeto de verificação, a bateria &gt;= 20% como a restrição, uma fotografia clara da anomalia mais o alerta do operador como o resultado esperado e o regresso à base como a política de falha.</p>
<p>O campo da etapa é atualizado à medida que a execução muda. Um obstáculo faz com que a tarefa passe de navegar para desviar ou pedir ajuda. Uma imagem desfocada faz com que a tarefa passe de inspecionar para voltar a fotografar. Uma bateria fraca leva-a a terminar e a regressar à base.</p>
<p>Os módulos a jusante já não recebem comandos isolados. Recebem a fase atual da tarefa, as suas restrições e a razão pela qual a fase mudou.</p>
<h3 id="2-Tiered-Memory-Routing-Context-to-the-Right-Stage" class="common-anchor-header">2. Memória em camadas: Encaminhando o contexto para o estágio correto</h3><p>O RoboBrain divide a informação relevante para a tarefa em três níveis para que os dados certos cheguem à fase certa.</p>
<p><strong>O estado em tempo real</strong> contém a pose, a bateria, as leituras dos sensores e as observações ambientais. Apoia as decisões em cada passo de controlo.</p>
<p><strong>O contexto de curto prazo</strong> regista eventos no âmbito da tarefa atual: o obstáculo que o robô evitou há dois minutos, a fotografia que voltou a tirar ou a porta que não conseguiu abrir à primeira tentativa. Evita que o sistema perca a noção do que acabou de acontecer.</p>
<p><strong>A memória semântica de longo prazo</strong> armazena o conhecimento do cenário, a experiência histórica, os casos de exceção e as notas pós-tarefa. Uma determinada área de estacionamento pode exigir ajustes do ângulo da câmara à noite devido às superfícies reflectoras. Um determinado tipo de anomalia pode ter um historial de falsos positivos e deve desencadear uma análise humana em vez de um alerta automático.</p>
<p>Este nível de longo prazo baseia-se na <a href="https://zilliz.com/learn/vector-similarity-search">pesquisa de semelhança de vectores</a> através da <a href="https://milvus.io/">base de dados de vectores Milvus</a>, porque recuperar a memória certa significa fazer a correspondência por significado e não por ID ou palavra-chave. As descrições de cenas e os registos de manuseamento são armazenados como <a href="https://zilliz.com/glossary/vector-embeddings">vectores</a> incorporados e recuperados com a <a href="https://zilliz.com/glossary/anns">pesquisa aproximada do vizinho mais próximo</a> para encontrar as correspondências semânticas mais próximas.</p>
<p>O arranque extrai regras de área e resumos de patrulhas anteriores da memória de longo prazo. A meio da execução baseia-se no estado em tempo real e no contexto a curto prazo. O tratamento de excepções utiliza <a href="https://zilliz.com/glossary/semantic-search">a pesquisa semântica</a> para encontrar casos semelhantes na memória de longo prazo.</p>
<h3 id="3-Feedback-Loop-Writing-Results-Back-into-the-System" class="common-anchor-header">3. Ciclo de feedback: Escrever os resultados de volta no sistema</h3><p>O RoboBrain escreve os resultados da navegação, perceção e ação no objeto da tarefa após cada passo, actualizando o campo da etapa. O sistema lê essas observações e decide o próximo passo: desviar se o caminho for inacessível, voltar a fotografar se a imagem estiver desfocada, tentar de novo se a porta não abrir, ou terminar se a bateria estiver fraca.</p>
<p>A execução torna-se um ciclo: executar, observar, ajustar, executar novamente. A cadeia continua a adaptar-se às alterações ambientais, em vez de se interromper à primeira vez que surge algo inesperado.</p>
<h2 id="How-Milvus-Powers-RoboBrains-Long-Term-Robot-Memory" class="common-anchor-header">Como o Milvus alimenta a memória de longo prazo do RoboBrain<button data-href="#How-Milvus-Powers-RoboBrains-Long-Term-Robot-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>Algumas memórias de robôs podem ser consultadas por ID de tarefa, carimbo de data/hora ou metadados de sessão. A experiência operacional de longo prazo geralmente não pode.</p>
<p>O registo útil é frequentemente o caso que é semanticamente semelhante à cena atual, mesmo que a identificação da tarefa, o nome do local ou a redação sejam diferentes. Isto torna-o um problema <a href="https://zilliz.com/learn/what-is-vector-database">de base de dados vetorial</a>, e o Milvus é adequado para o nível de memória de longo prazo.</p>
<p>Este nível armazena informações como:</p>
<ul>
<li>Descrições de regras de área e semântica de localização de pontos</li>
<li>Definições de tipos de anomalias e resumos de exemplos</li>
<li>Registos históricos de tratamento e conclusões da revisão pós-tarefa</li>
<li>Resumos de patrulha escritos no final da tarefa</li>
<li>Registos de experiência após a tomada de controlo humana</li>
<li>Causas de falhas e estratégias de correção de cenários semelhantes</li>
</ul>
<p>Nada disto é naturalmente codificado por um campo estruturado. Tudo isso precisa de ser recordado por significado.</p>
<p>Um exemplo concreto: o robot patrulha a entrada de um parque de estacionamento à noite. O brilho das luzes de cima torna a deteção de anomalias instável. Os reflexos continuam a ser assinalados como anomalias.</p>
<p>O sistema precisa de recordar as estratégias de reposicionamento que funcionaram sob o forte brilho noturno, as correcções do ângulo da câmara em áreas semelhantes e as conclusões da revisão humana que marcaram as detecções anteriores como falsos positivos. Uma consulta de correspondência exacta pode encontrar uma identificação de tarefa conhecida ou uma janela de tempo. Não pode encontrar de forma fiável "o caso de encandeamento anterior que se comportou como este", a menos que essa relação já tenha sido identificada.</p>
<p>A semelhança semântica é o padrão de recuperação que funciona. <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">As métricas de semelhança</a> classificam as memórias armazenadas por relevância, enquanto <a href="https://milvus.io/docs/filtered-search.md">a filtragem de metadados</a> pode restringir o espaço de pesquisa por área, tipo de tarefa ou janela de tempo. Na prática, isto torna-se frequentemente uma <a href="https://zilliz.com/learn/hybrid-search-combining-text-and-image">pesquisa híbrida</a>: correspondência semântica para o significado, filtros estruturados para restrições operacionais.</p>
<p>Para a implementação, a camada de filtros é frequentemente o local onde a memória semântica se torna operacional. <a href="https://milvus.io/docs/boolean.md">As expressões de filtro Milvus</a> definem restrições escalares, enquanto <a href="https://milvus.io/docs/get-and-scalar-query.md?file=query.md">as consultas escalares Milvus</a> suportam pesquisas exactas quando o sistema precisa de registos por metadados e não por semelhança.</p>
<p>Este padrão de pesquisa assemelha-se a uma <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">geração aumentada de pesquisa</a> adaptada à tomada de decisões no mundo físico, em vez de uma geração de texto. O robô não está a recuperar documentos para responder a uma pergunta; está a recuperar experiências anteriores para escolher a próxima ação segura.</p>
<p>Nem tudo entra no Milvus. Os IDs das tarefas, os carimbos de data/hora e os metadados da sessão são guardados numa base de dados relacional. Os registos brutos de tempo de execução são armazenados num sistema de registo. Cada sistema de armazenamento lida com o padrão de consulta para o qual foi criado.</p>
<table>
<thead>
<tr><th>Tipo de dados</th><th>Onde residem</th><th>Como são consultados</th></tr>
</thead>
<tbody>
<tr><td>IDs de tarefas, carimbos de data/hora, metadados de sessão</td><td>Base de dados relacional</td><td>Pesquisas exactas, junções</td></tr>
<tr><td>Registos brutos de tempo de execução e fluxos de eventos</td><td>Sistema de registo</td><td>Pesquisa de texto completo, filtros de intervalo de tempo</td></tr>
<tr><td>Regras de cena, tratamento de casos, retrospectivas de experiência</td><td>Milvus</td><td>Pesquisa de semelhanças vectoriais por significado</td></tr>
</tbody>
</table>
<p>À medida que as tarefas são executadas e as cenas se acumulam, a camada de memória de longo prazo alimenta os processos a jusante: curadoria de amostras para afinação de modelos, análise de dados mais alargada e transferência de conhecimentos entre implementações. A memória transforma-se num ativo de dados que dá a cada implementação futura um ponto de partida mais elevado.</p>
<h2 id="What-This-Architecture-Changes-in-Deployment" class="common-anchor-header">O que esta arquitetura muda na implementação<button data-href="#What-This-Architecture-Changes-in-Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>A objetivação da tarefa, a memória em camadas e o ciclo de feedback transformam o ciclo de tarefas do RoboBrain num padrão de implementação: cada tarefa preserva o estado, cada exceção pode recuperar a experiência anterior e cada execução pode melhorar a seguinte.</p>
<p>Um robô que patrulha um novo edifício não deve começar do zero se já tiver lidado com iluminação, obstáculos, tipos de anomalias ou regras do operador semelhantes noutro local. É isto que torna a execução das tarefas do robô mais repetível em todos os cenários e que torna os custos de implementação a longo prazo mais fáceis de controlar.</p>
<p>Para as equipas de robótica, a lição mais profunda é que a memória não é apenas uma camada de armazenamento. Faz parte do controlo da execução. O sistema precisa de saber o que está a fazer, o que acabou de mudar, que casos semelhantes aconteceram antes e o que deve ser gravado para a próxima execução.</p>
<h2 id="Further-Reading" class="common-anchor-header">Leitura adicional<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
    </button></h2><p>Se estiver a trabalhar em problemas semelhantes com a memória dos robôs, a execução de tarefas ou a recuperação semântica para a IA incorporada, estes recursos são úteis para os próximos passos:</p>
<ul>
<li>Leia a <a href="https://milvus.io/docs">documentação do Milvus</a> ou experimente o <a href="https://milvus.io/docs/quickstart.md">Milvus quickstart</a> para ver como funciona a pesquisa vetorial na prática.</li>
<li>Reveja a <a href="https://milvus.io/docs/architecture_overview.md">visão geral da arquitetura do Milvus</a> se estiver a planear uma camada de memória de produção.</li>
<li>Procure <a href="https://zilliz.com/vector-database-use-cases">casos de utilização de bases de dados vectoriais</a> para obter mais exemplos de pesquisa semântica em sistemas de produção.</li>
<li>Junte-se à <a href="https://milvus.io/community">comunidade Milvus</a> para fazer perguntas e partilhar o que está a construir.</li>
<li>Se pretender gerir o Milvus em vez de executar a sua própria infraestrutura, saiba mais sobre o <a href="https://zilliz.com/cloud">Zilliz Cloud</a>.</li>
</ul>
