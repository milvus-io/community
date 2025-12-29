---
id: >-
  keeping-ai-agents-grounded-context-engineering-strategies-that-prevent-context-rot-using-milvus.md
title: >-
  Mantendo os agentes de IA ligados à terra: Estratégias de Engenharia de
  Contexto que Impedem a Rotação de Contexto Usando Milvus
author: Min Yin
date: 2025-12-23T00:00:00.000Z
cover: assets.zilliz.com/context_rot_cover_804387e7c9.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'context engineering, context rot, vector database, Milvus, vector search'
meta_title: |
  Context Engineering Strategies to Prevent LLM Context Rot with Milvus
desc: >-
  Saiba por que razão a rotação do contexto acontece em fluxos de trabalho LLM
  de longa duração e como a engenharia de contexto, as estratégias de
  recuperação e a pesquisa vetorial Milvus ajudam a manter os agentes de IA
  precisos, concentrados e fiáveis em tarefas complexas de várias etapas.
origin: >-
  https://milvus.io/blog/keeping-ai-agents-grounded-context-engineering-strategies-that-prevent-context-rot-using-milvus.md
---
<p>Se já trabalhou em longas conversas de LLM, provavelmente já teve este momento frustrante: a meio de uma longa discussão, o modelo começa a desviar-se. As respostas tornam-se vagas, o raciocínio enfraquece e os pormenores-chave desaparecem misteriosamente. Mas se colocar exatamente a mesma questão numa nova conversa, de repente o modelo comporta-se de forma concentrada, precisa e fundamentada.</p>
<p>Isto não é o modelo a "ficar cansado" - é a <strong>podridão do contexto</strong>. À medida que uma conversa cresce, o modelo tem de fazer malabarismos com mais informações e a sua capacidade de estabelecer prioridades diminui lentamente. <a href="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents">Estudos antrópicos</a> mostram que, à medida que as janelas de contexto aumentam de cerca de 8K tokens para 128K, a precisão da recuperação pode cair 15-30%. O modelo ainda tem espaço, mas perde a noção do que é importante. Janelas de contexto maiores ajudam a atrasar o problema, mas não o eliminam.</p>
<p>É aqui que entra a <strong>engenharia de contexto</strong>. Em vez de dar ao modelo tudo de uma só vez, moldamos o que ele vê: recuperando apenas as partes que interessam, comprimindo o que já não precisa de ser detalhado e mantendo os avisos e as ferramentas suficientemente limpos para que o modelo possa raciocinar. O objetivo é simples: disponibilizar a informação importante no momento certo e ignorar o resto.</p>
<p>A recuperação desempenha um papel central aqui, especialmente para agentes de longa duração. As bases de dados vectoriais, como o <a href="https://milvus.io/"><strong>Milvus</strong></a>, fornecem a base para a recuperação eficiente do conhecimento relevante para o contexto, permitindo que o sistema se mantenha no terreno, mesmo quando as tarefas aumentam em profundidade e complexidade.</p>
<p>Neste blogue, vamos ver como acontece a rotação do contexto, as estratégias que as equipas utilizam para a gerir e os padrões de arquitetura - desde a recuperação até ao design de avisos - que mantêm os agentes de IA atentos a fluxos de trabalho longos e com várias etapas.</p>
<h2 id="Why-Context-Rot-Happens" class="common-anchor-header">Porque é que a podridão do contexto acontece<button data-href="#Why-Context-Rot-Happens" class="anchor-icon" translate="no">
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
    </button></h2><p>As pessoas assumem frequentemente que dar mais contexto a um modelo de IA conduz naturalmente a melhores respostas. Mas isso não é realmente verdade. Os seres humanos também têm dificuldade em lidar com entradas longas: a ciência cognitiva sugere que a nossa memória de trabalho contém cerca de <strong>7±2 pedaços</strong> de informação. Se formos para além disso, começamos a esquecer, a desfocar ou a interpretar mal os pormenores.</p>
<p>Os LLM apresentam um comportamento semelhante - apenas numa escala muito maior e com modos de falha mais dramáticos.</p>
<p>A raiz do problema vem da própria <a href="https://zilliz.com/learn/decoding-transformer-models-a-study-of-their-architecture-and-underlying-principles">arquitetura do Transformer</a>. Cada token tem de se comparar com todos os outros tokens, formando uma atenção par a par em toda a sequência. Isso significa que a computação cresce <strong>O(n²)</strong> com o comprimento do contexto. Expandir o seu prompt de 1K tokens para 100K não faz com que o modelo "trabalhe mais" - multiplica o número de interações de tokens por <strong>10.000×</strong>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/contextual_dilution_622033db72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Depois, há o problema com os dados de treino.</strong> Os modelos vêem muito mais sequências curtas do que longas. Por isso, quando se pede a um LLM que opere em contextos extremamente grandes, está-se a empurrá-lo para um regime para o qual não foi devidamente treinado. Na prática, o raciocínio de contextos muito longos está muitas vezes <strong>fora da distribuição</strong> da maioria dos modelos.</p>
<p>Apesar destes limites, os contextos longos são atualmente inevitáveis. As primeiras aplicações de LLM eram maioritariamente tarefas de uma só vez - classificação, resumo ou geração simples. Hoje em dia, mais de 70% dos sistemas de IA empresariais dependem de agentes que se mantêm activos durante muitas rondas de interação, muitas vezes durante horas, gerindo fluxos de trabalho ramificados e com vários passos. As sessões de longa duração passaram de exceção a padrão.</p>
<p>A questão seguinte é: <strong>como manter a atenção do modelo sem o sobrecarregar?</strong></p>
<h2 id="Context-Retrieval-Approaches-to-Solving-Context-Rot" class="common-anchor-header">Abordagens de recuperação de contexto para resolver o problema da rotação de contexto<button data-href="#Context-Retrieval-Approaches-to-Solving-Context-Rot" class="anchor-icon" translate="no">
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
    </button></h2><p>A recuperação é uma das alavancas mais eficazes que temos para combater a podridão de contexto e, na prática, tende a aparecer em padrões complementares que abordam a podridão de contexto de diferentes ângulos.</p>
<h3 id="1-Just-in-Time-Retrieval-Reducing-Unnecessary-Context" class="common-anchor-header">1. Recuperação Just-in-Time: Reduzindo o contexto desnecessário</h3><p>Uma das principais causas da podridão de contexto é <em>sobrecarregar</em> o modelo com informações que ele ainda não precisa. O Claude Code - o assistente de codificação do Anthropic - resolve esse problema com a <strong>recuperação Just-in-Time (JIT)</strong>, uma estratégia em que o modelo busca informações apenas quando elas se tornam relevantes.</p>
<p>Em vez de colocar bases de código ou conjuntos de dados inteiros no seu contexto (o que aumenta muito a hipótese de desvio e esquecimento), o Claude Code mantém um pequeno índice: caminhos de ficheiros, comandos e ligações de documentação. Quando o modelo precisa de uma informação, recupera esse item específico e insere-o no contexto <strong>no momento em que é importante - não</strong>antes.</p>
<p>Por exemplo, se pedir ao Claude Code para analisar uma base de dados de 10 GB, ele nunca tenta carregar tudo. Ele funciona mais como um engenheiro:</p>
<ol>
<li><p>Executa uma consulta SQL para obter resumos de alto nível do conjunto de dados.</p></li>
<li><p>Usa comandos como <code translate="no">head</code> e <code translate="no">tail</code> para visualizar dados de amostra e entender sua estrutura.</p></li>
<li><p>Retém apenas as informações mais importantes - como estatísticas importantes ou linhas de amostra - dentro do contexto.</p></li>
</ol>
<p>Ao minimizar o que é mantido no contexto, a recuperação JIT evita o acúmulo de tokens irrelevantes que causam apodrecimento. O modelo mantém-se concentrado porque só vê a informação necessária para o passo de raciocínio atual.</p>
<h3 id="2-Pre-retrieval-Vector-Search-Preventing-Context-Drift-Before-It-Starts" class="common-anchor-header">2. Pré-recuperação (Pesquisa Vetorial): Prevenir o desvio de contexto antes que ele comece</h3><p>Por vezes, o modelo não pode "pedir" informação de forma dinâmica - o apoio ao cliente, os sistemas de P&amp;R e os fluxos de trabalho dos agentes necessitam frequentemente do conhecimento correto disponível <em>antes do</em> início da geração. É aqui que <strong>a pré-recuperação</strong> se torna crítica.</p>
<p>A podridão do contexto acontece muitas vezes porque o modelo recebe uma grande pilha de texto em bruto e espera-se que descubra o que é importante. A pré-coleta inverte essa situação: uma base de dados vetorial (como <a href="https://milvus.io/">a Milvus</a> e <a href="https://zilliz.com/cloud">a Zilliz Cloud</a>) identifica as partes mais relevantes <em>antes da</em> inferência, garantindo que apenas o contexto de elevado valor chega ao modelo.</p>
<p>Numa configuração típica de RAG:</p>
<ul>
<li><p>Os documentos são incorporados e armazenados numa base de dados vetorial, como o Milvus.</p></li>
<li><p>No momento da consulta, o sistema recupera um pequeno conjunto de fragmentos altamente relevantes através de pesquisas de semelhança.</p></li>
<li><p>Apenas esses fragmentos entram no contexto do modelo.</p></li>
</ul>
<p>Isto evita a podridão de duas formas:</p>
<ul>
<li><p><strong>Redução do ruído:</strong> o texto irrelevante ou pouco relacionado nunca entra no contexto.</p></li>
<li><p><strong>Eficiência:</strong> os modelos processam muito menos tokens, reduzindo a possibilidade de perder o rasto de detalhes essenciais.</p></li>
</ul>
<p>O Milvus pode pesquisar milhões de documentos em milissegundos, o que torna esta abordagem ideal para sistemas activos em que a latência é importante.</p>
<h3 id="3-Hybrid-JIT-and-Vector-Retrieval" class="common-anchor-header">3. Recuperação híbrida JIT e Vetorial</h3><p>A pré-recuperação baseada na pesquisa vetorial aborda uma parte significativa da podridão do contexto, garantindo que o modelo começa com informações de alto sinal em vez de texto em bruto e de grandes dimensões. Mas o Anthropic destaca dois desafios reais que as equipas frequentemente ignoram:</p>
<ul>
<li><p><strong>Pontualidade:</strong> Se a base de conhecimentos for actualizada mais rapidamente do que o índice de vectores é reconstruído, o modelo pode basear-se em informações obsoletas.</p></li>
<li><p><strong>Precisão:</strong> antes do início de uma tarefa, é difícil prever com exatidão o que o modelo irá necessitar - especialmente para fluxos de trabalho exploratórios ou de várias etapas.</p></li>
</ul>
<p>Assim, em cargas de trabalho do mundo real, uma abordagem híbrida é a solução ideal.</p>
<ul>
<li><p>Pesquisa vetorial para conhecimento estável e de elevada confiança</p></li>
<li><p>Exploração JIT orientada por agentes para informações que evoluem ou só se tornam relevantes a meio da tarefa</p></li>
</ul>
<p>Ao combinar estas duas abordagens, obtém-se a velocidade e a eficiência da recuperação vetorial para informações conhecidas e a flexibilidade do modelo para descobrir e carregar novos dados sempre que estes se tornem relevantes.</p>
<p>Vejamos como isto funciona num sistema real. Tomemos como exemplo um assistente de documentação de produção. A maioria das equipas acaba por optar por um pipeline de duas fases: Pesquisa vetorial baseada em Milvus + recuperação JIT baseada em agentes.</p>
<p><strong>1. Pesquisa vetorial com Milvus (Pré-recuperação)</strong></p>
<ul>
<li><p>Converta sua documentação, referências de API, changelogs e problemas conhecidos em embeddings.</p></li>
<li><p>Guarde-os na base de dados Milvus Vetor com metadados como a área do produto, a versão e o tempo de atualização.</p></li>
<li><p>Quando um utilizador faz uma pergunta, execute uma pesquisa semântica para obter os K segmentos mais relevantes.</p></li>
</ul>
<p>Isto resolve cerca de 80% das consultas de rotina em menos de 500 ms, dando ao modelo um ponto de partida forte e resistente ao contexto.</p>
<p><strong>2. Exploração baseada em agentes</strong></p>
<p>Quando a recuperação inicial não é suficiente - por exemplo, quando o utilizador pede algo muito específico ou sensível ao tempo - o agente pode chamar ferramentas para obter novas informações:</p>
<ul>
<li><p>Usar <code translate="no">search_code</code> para localizar funções ou arquivos específicos na base de código</p></li>
<li><p>Usar <code translate="no">run_query</code> para obter dados em tempo real do banco de dados</p></li>
<li><p>Usar <code translate="no">fetch_api</code> para obter o estado mais recente do sistema</p></li>
</ul>
<p>Estas chamadas demoram normalmente <strong>3 a 5 segundos</strong>, mas garantem que o modelo funciona sempre com dados actualizados, precisos e relevantes - mesmo para questões que o sistema não conseguiu antecipar.</p>
<p>Esta estrutura híbrida garante que o contexto se mantém atempado, correto e específico da tarefa, reduzindo drasticamente o risco de rotação do contexto em fluxos de trabalho de agentes de longa duração.</p>
<p>O Milvus é especialmente eficaz nestes cenários híbridos porque suporta:</p>
<ul>
<li><p><strong>Pesquisa vetorial + filtragem escalar</strong>, combinando relevância semântica com restrições estruturadas</p></li>
<li><p><strong>Actualizações incrementais</strong>, permitindo que os embeddings sejam actualizados sem tempo de inatividade</p></li>
</ul>
<p>Isto faz do Milvus a espinha dorsal ideal para sistemas que necessitam de compreensão semântica e controlo preciso sobre o que é recuperado.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_in_hybrid_architecture_7d4e391aa4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Por exemplo, você pode executar uma consulta como:</p>
<pre><code translate="no"><span class="hljs-comment"># You can combine queries like this in Milvus</span>
collection.search(
    data=[query_embedding],  <span class="hljs-comment"># Semantic similarity</span>
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    expr=<span class="hljs-string">&quot;doc_type == &#x27;API&#x27; and update_time &gt; &#x27;2025-01-01&#x27;&quot;</span>,  <span class="hljs-comment"># Structured filtering</span>
    limit=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Choose-the-Right-Approach-for-Dealing-With-Context-Rot" class="common-anchor-header">Como escolher a abordagem correta para lidar com a rotação de contexto<button data-href="#How-to-Choose-the-Right-Approach-for-Dealing-With-Context-Rot" class="anchor-icon" translate="no">
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
    </button></h2><p>Com a pré-recuperação de pesquisa vetorial, a recuperação Just-in-Time e a recuperação híbrida disponíveis, a questão natural é: <strong>qual delas deve ser utilizada?</strong></p>
<p>Eis uma forma simples mas prática de escolher - com base na <em>estabilidade</em> do seu conhecimento e na <em>previsibilidade</em> das necessidades de informação do modelo.</p>
<h3 id="1-Vector-Search-→-Best-for-Stable-Domains" class="common-anchor-header">1. Pesquisa vetorial → Melhor para domínios estáveis</h3><p>Se o domínio muda lentamente, mas exige precisão - finanças, trabalho jurídico, conformidade, documentação médica - então uma base de conhecimentos alimentada por Milvus com <strong>pré-resgate</strong> é normalmente a opção correta.</p>
<p>A informação está bem definida, as actualizações são pouco frequentes e a maioria das perguntas pode ser respondida recuperando antecipadamente documentos semanticamente relevantes.</p>
<p><strong>Tarefas previsíveis + conhecimento estável → Pré-recuperação.</strong></p>
<h3 id="2-Just-in-Time-Retrieval-→-Best-for-Dynamic-Exploratory-Workflows" class="common-anchor-header">2. Recuperação atempada → Melhor para fluxos de trabalho dinâmicos e exploratórios</h3><p>Áreas como engenharia de software, depuração, análise e ciência de dados envolvem ambientes que mudam rapidamente: novos arquivos, novos dados, novos estados de implantação. O modelo não pode prever o que será necessário antes do início da tarefa.</p>
<p><strong>Tarefas imprevisíveis + conhecimento em rápida mudança → recuperação Just-in-Time.</strong></p>
<h3 id="3-Hybrid-Approach-→-When-Both-Conditions-Are-True" class="common-anchor-header">3. Abordagem híbrida → Quando ambas as condições são verdadeiras</h3><p>Muitos sistemas reais não são puramente estáveis ou puramente dinâmicos. Por exemplo, a documentação do desenvolvedor muda lentamente, enquanto o estado de um ambiente de produção muda minuto a minuto. Uma abordagem híbrida permite-lhe:</p>
<ul>
<li><p>Carregar conhecimento conhecido e estável usando pesquisa vetorial (rápida e de baixa latência)</p></li>
<li><p>Obter informações dinâmicas com ferramentas de agente a pedido (precisas e actualizadas)</p></li>
</ul>
<p><strong>Conhecimento misto + estrutura de tarefas mista → abordagem de recuperação híbrida.</strong></p>
<h2 id="What-if-the-Context-Window-Still-Isn’t-Enough" class="common-anchor-header">E se a janela de contexto ainda não for suficiente?<button data-href="#What-if-the-Context-Window-Still-Isn’t-Enough" class="anchor-icon" translate="no">
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
    </button></h2><p>A engenharia de contexto ajuda a reduzir a sobrecarga, mas por vezes o problema é mais fundamental: <strong>a tarefa simplesmente não cabe</strong>, mesmo com um corte cuidadoso.</p>
<p>Certos fluxos de trabalho - como a migração de uma grande base de código, a revisão de arquiteturas de vários repositórios ou a geração de relatórios de pesquisa profunda - podem exceder mais de 200 mil janelas de contexto antes que o modelo chegue ao fim da tarefa. Mesmo com a pesquisa vetorial a fazer o trabalho pesado, algumas tarefas requerem uma memória mais persistente e estruturada.</p>
<p>Recentemente, o Anthropic ofereceu três estratégias práticas.</p>
<h3 id="1-Compression-Preserve-Signal-Drop-Noise" class="common-anchor-header">1. Compressão: Preservar o sinal, eliminar o ruído</h3><p>Quando a janela de contexto se aproxima do seu limite, o modelo pode <strong>comprimir interações anteriores</strong> em resumos concisos. Uma boa compressão mantém</p>
<ul>
<li><p>Decisões-chave</p></li>
<li><p>Restrições e requisitos</p></li>
<li><p>Questões pendentes</p></li>
<li><p>Amostras ou exemplos relevantes</p></li>
</ul>
<p>E remove:</p>
<ul>
<li><p>Saídas de ferramentas prolixas</p></li>
<li><p>Registos irrelevantes</p></li>
<li><p>Passos redundantes</p></li>
</ul>
<p>O desafio é o equilíbrio. Se a compressão for demasiado agressiva, o modelo perde informação crítica; se for demasiado ligeira, ganha-se pouco espaço. A compressão eficaz mantém o "porquê" e o "o quê" enquanto descarta o "como chegámos aqui".</p>
<h3 id="2-Structured-Note-Taking-Move-Stable-Information-Outside-Context" class="common-anchor-header">2. Tomada de notas estruturada: Mova as informações estáveis para fora do contexto</h3><p>Em vez de manter tudo dentro da janela do modelo, o sistema pode armazenar factos importantes na <strong>memória externa - uma</strong>base de dados separada ou um armazenamento estruturado que o agente pode consultar conforme necessário.</p>
<p>Por exemplo, o protótipo de agente Pokémon do Claude armazena factos duradouros como:</p>
<ul>
<li><p><code translate="no">Pikachu leveled up to 8</code></p></li>
<li><p><code translate="no">Trained 1234 steps on Route 1</code></p></li>
<li><p><code translate="no">Goal: reach level 10</code></p></li>
</ul>
<p>Entretanto, os detalhes transitórios - registos de batalhas, saídas de ferramentas longas - permanecem fora do contexto ativo. Isto reflecte a forma como os humanos utilizam os blocos de notas: não guardamos todos os detalhes na nossa memória de trabalho; armazenamos pontos de referência externamente e consultamo-los quando necessário.</p>
<p>A tomada de notas estruturada evita a podridão do contexto causada por detalhes repetidos e desnecessários, dando ao modelo uma fonte fiável de verdade.</p>
<h3 id="3-Sub-Agent-Architecture-Divide-and-Conquer-Large-Tasks" class="common-anchor-header">3. Arquitetura Sub-Agente: Dividir e conquistar grandes tarefas</h3><p>Para tarefas complexas, pode ser concebida uma arquitetura multi-agente em que um agente principal supervisiona o trabalho global, enquanto vários sub-agentes especializados tratam de aspectos específicos da tarefa. Estes sub-agentes mergulham profundamente em grandes quantidades de dados relacionados com as suas sub-tarefas, mas apenas devolvem os resultados concisos e essenciais. Esta abordagem é normalmente utilizada em cenários como relatórios de investigação ou análise de dados.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/longduration_task_cbbc07b9ca.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Na prática, o melhor é começar por utilizar um único agente combinado com a compressão para realizar a tarefa. O armazenamento externo só deve ser introduzido quando for necessário reter a memória ao longo das sessões. A arquitetura multi-agente deve ser reservada para tarefas que exijam genuinamente o processamento paralelo de sub-tarefas complexas e especializadas.</p>
<p>Cada abordagem estende a "memória de trabalho" efectiva do sistema sem rebentar a janela de contexto - e sem desencadear a rotação do contexto.</p>
<h2 id="Best-Practices-for-Designing-Context-That-Actually-Works" class="common-anchor-header">Melhores práticas para projetar um contexto que realmente funcione<button data-href="#Best-Practices-for-Designing-Context-That-Actually-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Depois de lidar com o excesso de contexto, há outra parte igualmente importante: como o contexto é construído em primeiro lugar. Mesmo com compressão, notas externas e sub-agentes, o sistema terá dificuldades se o prompt e as ferramentas em si não forem projetados para suportar raciocínios longos e complexos.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/System_Prompts_cf655dcd0d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O Anthropic oferece uma forma útil de pensar sobre isto - menos como um exercício de escrita de um único prompt, e mais como a construção do contexto em três camadas.</p>
<h3 id="System-Prompts-Find-the-Goldilocks-Zone" class="common-anchor-header"><strong>Sistema de sugestões: Encontrar a Zona Cachinhos Dourados</strong></h3><p>A maioria dos prompts de sistema falham nos extremos. Demasiados detalhes - listas de regras, condições aninhadas, excepções codificadas - tornam o prompt frágil e difícil de manter. Demasiada pouca estrutura deixa o modelo a adivinhar o que fazer.</p>
<p>Os melhores prompts ficam no meio: estruturados o suficiente para guiar o comportamento, mas flexíveis o suficiente para o modelo raciocinar. Na prática, isso significa dar ao modelo uma função clara, um fluxo de trabalho geral e uma leve orientação da ferramenta - nada mais, nada menos.</p>
<p>Por exemplo:</p>
<pre><code translate="no">You are a technical documentation assistant serving developers.
<span class="hljs-number">1.</span> Start <span class="hljs-keyword">by</span> retrieving relevant documents <span class="hljs-keyword">from</span> the Milvus knowledge <span class="hljs-keyword">base</span>.  
<span class="hljs-number">2.</span> If the retrieval results are insufficient, use the `search_code` tool to perform a deeper search <span class="hljs-keyword">in</span> the codebase.  
<span class="hljs-number">3.</span> When answering, cite specific documentation sections <span class="hljs-keyword">or</span> code line numbers.

<span class="hljs-meta">## Tool guidance</span>
- search_docs: Used <span class="hljs-keyword">for</span> semantic retrieval, best <span class="hljs-keyword">for</span> conceptual questions.  
- search_code: Used <span class="hljs-keyword">for</span> precise lookup <span class="hljs-keyword">in</span> the codebase, best <span class="hljs-keyword">for</span> implementation-detail questions.  
…
<button class="copy-code-btn"></button></code></pre>
<p>Este aviso define a direção sem sobrecarregar o modelo ou forçá-lo a fazer malabarismos com informações dinâmicas que não pertencem aqui.</p>
<h3 id="Tool-Design-Less-Is-More" class="common-anchor-header">Desenho de ferramentas: Menos é mais</h3><p>Uma vez que o prompt do sistema define o comportamento de alto nível, as ferramentas carregam a lógica operacional real. Um modo de falha surpreendentemente comum em sistemas aumentados por ferramentas é simplesmente ter demasiadas ferramentas - ou ter ferramentas cujos objectivos se sobrepõem.</p>
<p>Uma boa regra de ouro:</p>
<ul>
<li><p><strong>Uma ferramenta, um objetivo</strong></p></li>
<li><p><strong>Parâmetros explícitos e não ambíguos</strong></p></li>
<li><p><strong>Sem sobreposição de responsabilidades</strong></p></li>
</ul>
<p>Se um engenheiro humano hesitasse sobre qual a ferramenta a utilizar, o modelo também hesitaria. Uma conceção clara da ferramenta reduz a ambiguidade, diminui a carga cognitiva e evita que o contexto seja sobrecarregado com tentativas desnecessárias.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/tooling_complexity_7d2bb60c54.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Dynamic-Information-Should-Be-Retrieved-Not-Hardcoded" class="common-anchor-header">A informação dinâmica deve ser recuperada, não codificada</h3><p>A última camada é a mais fácil de ignorar. As informações dinâmicas ou sensíveis ao tempo - como valores de estado, actualizações recentes ou estado específico do utilizador - não devem aparecer de todo na linha de comandos do sistema. A sua inclusão na linha de comandos garante que se tornará obsoleta, inchada ou contraditória em tarefas longas.</p>
<p>Em vez disso, estas informações devem ser obtidas apenas quando necessário, quer através de recuperação quer através de ferramentas de agente. Manter o conteúdo dinâmico fora do prompt do sistema evita o apodrecimento do contexto e mantém o espaço de raciocínio do modelo limpo.</p>
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
    </button></h2><p>À medida que os agentes de IA entram em ambientes de produção em diferentes sectores, estão a assumir fluxos de trabalho mais longos e tarefas mais complexas do que nunca. Nessas configurações, o gerenciamento do contexto se torna uma necessidade prática.</p>
<p><strong>No entanto, uma janela de contexto maior não produz automaticamente melhores resultados</strong>; em muitos casos, faz o oposto. Quando um modelo é sobrecarregado, alimentado com informações obsoletas ou forçado a responder a solicitações maciças, a precisão desvia-se silenciosamente. Esse declínio lento e subtil é o que chamamos agora de <strong>podridão do contexto</strong>.</p>
<p>Técnicas como a recuperação JIT, a pré-recuperação, os pipelines híbridos e a pesquisa semântica com base em dados vectoriais visam o mesmo objetivo: <strong>garantir que o modelo vê a informação certa no momento certo - nem mais, nem menos - para que possa manter-se no terreno e produzir respostas fiáveis.</strong></p>
<p>Sendo uma base de dados vetorial de código aberto e de elevado desempenho, <a href="https://milvus.io/"><strong>o Milvus</strong></a> está no centro deste fluxo de trabalho. Fornece a infraestrutura para armazenar conhecimentos de forma eficiente e recuperar as partes mais relevantes com baixa latência. Em conjunto com a recuperação JIT e outras estratégias complementares, o Milvus ajuda os agentes de IA a manterem-se exactos à medida que as suas tarefas se tornam mais profundas e dinâmicas.</p>
<p>Mas a recuperação é apenas uma peça do puzzle. Um bom design de prompt, um conjunto de ferramentas limpo e mínimo e estratégias de transbordamento sensatas - seja compressão, notas estruturadas ou sub-agentes - trabalham em conjunto para manter o modelo concentrado em sessões de longa duração. É assim que se parece a verdadeira engenharia de contexto: não se trata de hacks inteligentes, mas de uma arquitetura bem pensada.</p>
<p>Se você deseja que os agentes de IA permaneçam precisos por horas, dias ou fluxos de trabalho inteiros, o contexto merece a mesma atenção que você daria a qualquer outra parte central da sua pilha.</p>
<p>Tem dúvidas ou quer um mergulho profundo em qualquer recurso? Participe do nosso<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou registre problemas no<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Também pode reservar uma sessão individual de 20 minutos para obter informações, orientação e respostas às suas perguntas através do<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
