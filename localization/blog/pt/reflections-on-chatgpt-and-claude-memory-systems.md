---
id: reflections-on-chatgpt-and-claude-memory-systems.md
title: >-
  Reflexões sobre o ChatGPT e os sistemas de memória do Claude: O que é preciso
  para permitir a recuperação de conversas a pedido
author: Min Yin
date: 2026-01-09T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_VS_Claude_cover_555fdac36d.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'ChatGPT, Claude, memory systems, on-demand retrieval, conversational retrieval'
meta_title: |
  Milvus 2.6 Makes Claude-Style On-Demand Retrieval Practical
desc: >-
  Explore como o ChatGPT e o Claude concebem a memória de forma diferente,
  porque é que a recuperação conversacional a pedido é difícil e como o Milvus
  2.6 a permite à escala de produção.
origin: 'https://milvus.io/blog/reflections-on-chatgpt-and-claude-memory-systems.md'
---
<p>Nos sistemas de agentes de IA de alta qualidade, a conceção da memória é muito mais complexa do que parece à primeira vista. No fundo, tem de responder a três questões fundamentais: Como é que o histórico de conversação deve ser armazenado? Quando é que o contexto passado deve ser recuperado? E o que, exatamente, deve ser recuperado?</p>
<p>Estas escolhas moldam diretamente a latência de resposta de um agente, a utilização de recursos e - em última análise - o seu limite de capacidade.</p>
<p>Modelos como o ChatGPT e o Claude sentem-se cada vez mais "conscientes da memória" quanto mais os usamos. Lembram-se das preferências, adaptam-se a objectivos a longo prazo e mantêm a continuidade entre sessões. Nesse sentido, já funcionam como mini agentes de IA. No entanto, por baixo da superfície, os seus sistemas de memória são construídos com base em pressupostos arquitectónicos muito diferentes.</p>
<p>Análises recentes de engenharia reversa dos <a href="https://manthanguptaa.in/posts/claude_memory/">mecanismos de memória</a> do <a href="https://manthanguptaa.in/posts/chatgpt_memory/">ChatGPT</a>e <a href="https://manthanguptaa.in/posts/claude_memory/">do Claude</a> revelam um claro contraste. <strong>O ChatGPT</strong> baseia-se na injeção de contexto pré-computado e no armazenamento em cache em camadas para proporcionar uma continuidade leve e previsível. <strong>O Claude,</strong> por outro lado, adopta o estilo RAG, recuperação a pedido com actualizações dinâmicas da memória para equilibrar a profundidade e a eficiência da memória.</p>
<p>Essas duas abordagens não são apenas preferências de design - elas são moldadas pela capacidade da infraestrutura. <a href="https://milvus.io/docs/release_notes.md#v268"><strong>O Milvus 2.6</strong></a> introduz a combinação de recuperação híbrida densa e esparsa, filtragem escalar eficiente e armazenamento em camadas que a memória conversacional a pedido requer, tornando a recuperação selectiva suficientemente rápida e económica para ser implementada em sistemas do mundo real.</p>
<p>Neste post, vamos ver como funcionam os sistemas de memória do ChatGPT e do Claude, porque é que eles divergiram em termos de arquitetura e como os recentes avanços em sistemas como o Milvus tornam a recuperação conversacional a pedido prática em escala.</p>
<h2 id="ChatGPT’s-Memory-System" class="common-anchor-header">O sistema de memória do ChatGPT<button data-href="#ChatGPT’s-Memory-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Em vez de consultar uma base de dados de vectores ou recuperar dinamicamente conversas passadas no momento da inferência, o ChatGPT constrói a sua "memória" reunindo um conjunto fixo de componentes de contexto e injectando-os diretamente em cada prompt. Cada componente é preparado com antecedência e ocupa uma posição conhecida no prompt.</p>
<p>Este design mantém a personalização e a continuidade da conversação intactas, ao mesmo tempo que torna a latência, a utilização de tokens e o comportamento do sistema mais previsíveis. Por outras palavras, a memória não é algo que o modelo procura em tempo real - é algo que o sistema empacota e entrega ao modelo sempre que gera uma resposta.</p>
<p>Em um nível alto, um prompt ChatGPT completo consiste nas seguintes camadas, ordenadas da mais global para a mais imediata:</p>
<p>[0] Instruções do sistema</p>
<p>[1] Instruções do programador</p>
<p>[2] Metadados da sessão (efémeros)</p>
<p>[3] Memória do utilizador (factos a longo prazo)</p>
<p>[4] Resumo das conversas recentes (conversas anteriores, títulos + fragmentos)</p>
<p>[5] Mensagens da sessão atual (este chat)</p>
<p>[6] A sua última mensagem</p>
<p>Entre estes, os componentes [2] a [5] formam a memória efectiva do sistema, cada um com uma função distinta.</p>
<h3 id="Session-Metadata" class="common-anchor-header">Metadados da sessão</h3><p>Os metadados da sessão representam informação de curta duração, não persistente, que é injectada uma vez no início de uma conversa e descartada quando a sessão termina. A sua função é ajudar o modelo a adaptar-se ao contexto de utilização atual e não personalizar o comportamento a longo prazo.</p>
<p>Esta camada capta sinais sobre o ambiente imediato do utilizador e os padrões de utilização recentes. Os sinais típicos incluem:</p>
<ul>
<li><p><strong>Informações sobre o dispositivo</strong> - por exemplo, se o utilizador está no telemóvel ou no computador</p></li>
<li><p><strong>Atributos da conta</strong> - como o nível de subscrição (por exemplo, ChatGPT Go), a idade da conta e a frequência geral de utilização</p></li>
<li><p><strong>Métricas comportamentais</strong> - incluindo dias activos nos últimos 1, 7 e 30 dias, duração média da conversa e distribuição da utilização do modelo (por exemplo, 49% dos pedidos tratados pelo GPT-5)</p></li>
</ul>
<h3 id="User-Memory" class="common-anchor-header">Memória do utilizador</h3><p>A memória do utilizador é a camada de memória persistente e editável que permite a personalização entre conversas. Armazena informações relativamente estáveis - como o nome do utilizador, função ou objectivos de carreira, projectos em curso, resultados anteriores e preferências de aprendizagem - e é injectada em cada nova conversa para preservar a continuidade ao longo do tempo.</p>
<p>Esta memória pode ser actualizada de duas formas:</p>
<ul>
<li><p><strong>As actualizações explícitas</strong> ocorrem quando os utilizadores gerem diretamente a memória com instruções como "lembrar isto" ou "remover isto da memória".</p></li>
<li><p><strong>As actualizações implícitas</strong> ocorrem quando o sistema identifica informações que satisfazem os critérios de armazenamento da OpenAI - como um nome confirmado ou um cargo - e guarda-as automaticamente, sujeitas ao consentimento predefinido do utilizador e às definições de memória.</p></li>
</ul>
<h3 id="Recent-Conversation-Summary" class="common-anchor-header">Resumo de conversas recentes</h3><p>O resumo da conversa recente é uma camada de contexto leve e entre sessões que preserva a continuidade sem reproduzir ou recuperar históricos de conversação completos. Em vez de depender da recuperação dinâmica, como nas abordagens tradicionais baseadas em RAG, este resumo é pré-computado e injetado diretamente em cada nova conversa.</p>
<p>Esta camada resume apenas as mensagens do utilizador, excluindo as respostas do assistente. É intencionalmente limitada em tamanho - normalmente cerca de 15 entradas - e retém apenas sinais de alto nível sobre interesses recentes, em vez de conteúdo detalhado. Como não depende de embeddings ou pesquisa de similaridade, mantém a latência e o consumo de tokens baixos.</p>
<h3 id="Current-Session-Messages" class="common-anchor-header">Mensagens da sessão atual</h3><p>As mensagens da sessão atual contêm todo o histórico de mensagens da conversa em curso e fornecem o contexto de curto prazo necessário para respostas coerentes e passo a passo. Esta camada inclui os inputs do utilizador e as respostas do assistente, mas apenas enquanto a sessão estiver ativa.</p>
<p>Como o modelo funciona dentro de um limite fixo de tokens, este histórico não pode crescer indefinidamente. Quando o limite é atingido, o sistema elimina as mensagens mais antigas para dar lugar às mais recentes. Este truncamento afecta apenas a sessão atual: a memória de longo prazo do utilizador e o resumo da conversa recente permanecem intactos.</p>
<h2 id="Claude’s-Memory-System" class="common-anchor-header">O sistema de memória do Claude<button data-href="#Claude’s-Memory-System" class="anchor-icon" translate="no">
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
    </button></h2><p>O Claude adota uma abordagem diferente para o gerenciamento de memória. Em vez de injetar um pacote grande e fixo de componentes de memória em cada prompt - como faz o ChatGPT - o Claude combina a memória persistente do usuário com ferramentas sob demanda e recuperação seletiva. O contexto histórico é obtido apenas quando o modelo o considera relevante, permitindo que o sistema negoceie entre a profundidade do contexto e o custo computacional.</p>
<p>O contexto do prompt do Claude é estruturado da seguinte forma:</p>
<p>[0] Prompt do sistema (instruções estáticas)</p>
<p>[1] Memórias do utilizador</p>
<p>[2] Histórico da conversa</p>
<p>[3] Mensagem atual</p>
<p>As principais diferenças entre o Claude e o ChatGPT residem na <strong>forma como o histórico de conversação é recuperado</strong> e <strong>como a memória do utilizador é actualizada e mantida</strong>.</p>
<h3 id="User-Memories" class="common-anchor-header">Memórias do utilizador</h3><p>No Claude, as memórias do utilizador formam uma camada de contexto a longo prazo com um objetivo semelhante ao da memória do utilizador do ChatGPT, mas com uma maior ênfase nas actualizações automáticas e em segundo plano. Estas memórias são armazenadas num formato estruturado (embrulhadas em etiquetas de estilo XML) e são concebidas para evoluir gradualmente ao longo do tempo com uma intervenção mínima do utilizador.</p>
<p>O Claude suporta duas vias de atualização:</p>
<ul>
<li><p><strong>Actualizações implícitas</strong> - O sistema analisa periodicamente o conteúdo da conversa e actualiza a memória em segundo plano. Estas actualizações não são aplicadas em tempo real e as memórias associadas a conversas eliminadas são gradualmente eliminadas como parte da otimização contínua.</p></li>
<li><p><strong>Actualizações explícitas</strong> - Os utilizadores podem gerir diretamente a memória através de comandos como "lembrar isto" ou "apagar isto", que são executados através de uma ferramenta dedicada <code translate="no">memory_user_edits</code>.</p></li>
</ul>
<p>Em comparação com o ChatGPT, o Claude coloca uma maior responsabilidade no próprio sistema para refinar, atualizar e podar a memória de longo prazo. Isto reduz a necessidade de os utilizadores seleccionarem ativamente o que é armazenado.</p>
<h3 id="Conversation-History" class="common-anchor-header">Histórico de conversas</h3><p>Para o histórico da conversa, o Claude não se baseia num resumo fixo que é injetado em cada mensagem. Em vez disso, ele recupera o contexto passado apenas quando o modelo decide que é necessário, usando três mecanismos distintos. Isto evita o transporte de histórico irrelevante e mantém a utilização de tokens sob controlo.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Componente</strong></th><th style="text-align:center"><strong>Objetivo</strong></th><th style="text-align:center"><strong>Como é utilizado</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>Janela de rolamento (conversa atual)</strong></td><td style="text-align:center">Armazena o histórico completo de mensagens da conversa atual (não um resumo), semelhante ao contexto de sessão do ChatGPT</td><td style="text-align:center">Injetado automaticamente. O limite de tokens é de ~190K; mensagens mais antigas são descartadas quando o limite é atingido</td></tr>
<tr><td style="text-align:center"><code translate="no">conversation_search</code> <strong>ferramenta</strong></td><td style="text-align:center">Pesquisa conversas anteriores por tópico ou palavra-chave, devolvendo links de conversas, títulos e excertos de mensagens do utilizador/assistente</td><td style="text-align:center">Acionada quando o modelo determina que são necessários detalhes históricos. Os parâmetros incluem <code translate="no">query</code> (termos de pesquisa) e <code translate="no">max_results</code> (1-10)</td></tr>
<tr><td style="text-align:center"><code translate="no">recent_chats</code> <strong>ferramenta</strong></td><td style="text-align:center">Recupera conversas recentes dentro de um intervalo de tempo especificado (por exemplo, "últimos 3 dias"), com resultados formatados da mesma forma que <code translate="no">conversation_search</code></td><td style="text-align:center">Acionado quando o contexto recente e limitado no tempo é relevante. Os parâmetros incluem <code translate="no">n</code> (número de resultados), <code translate="no">sort_order</code>, e intervalo de tempo</td></tr>
</tbody>
</table>
<p>Entre estes componentes, <code translate="no">conversation_search</code> é especialmente notável. Pode apresentar resultados relevantes mesmo para consultas com frases vagas ou multilingues, indicando que funciona a um nível semântico em vez de se basear numa simples correspondência de palavras-chave. Isto envolve provavelmente uma recuperação baseada na incorporação ou uma abordagem híbrida que primeiro traduz ou normaliza a consulta para uma forma canónica e depois aplica a recuperação por palavra-chave ou híbrida.</p>
<p>Em geral, a abordagem de recuperação a pedido do Claude tem vários pontos fortes notáveis:</p>
<ul>
<li><p><strong>A recuperação não é automática</strong>: As chamadas de ferramentas são acionadas pelo próprio julgamento do modelo. Por exemplo, quando um utilizador refere <em>"o projeto que discutimos da última vez",</em> o Claude pode decidir invocar <code translate="no">conversation_search</code> para obter o contexto relevante.</p></li>
<li><p><strong>Contexto mais rico quando necessário</strong>: Os resultados obtidos podem incluir <strong>excertos de respostas do assistente</strong>, enquanto os resumos do ChatGPT apenas captam as mensagens do utilizador. Isto torna o Claude mais adequado para casos de utilização que requerem um contexto de conversação mais profundo ou mais preciso.</p></li>
<li><p><strong>Melhor eficiência por padrão</strong>: Como o contexto histórico não é injetado a menos que seja necessário, o sistema evita transportar grandes quantidades de histórico irrelevante, reduzindo o consumo desnecessário de tokens.</p></li>
</ul>
<p>As vantagens e desvantagens são igualmente claras. A introdução da recuperação a pedido aumenta a complexidade do sistema: os índices têm de ser construídos e mantidos, as consultas executadas, os resultados classificados e, por vezes, novamente classificados. A latência de ponta a ponta também se torna menos previsível do que com o contexto pré-computado e sempre injetado. Além disso, o modelo tem de aprender a decidir quando é que a recuperação é necessária. Se esse julgamento falhar, o contexto relevante pode nunca ser recuperado.</p>
<h2 id="The-Constraints-Behind-Claude-Style-On-Demand-Retrieval" class="common-anchor-header">As restrições por detrás da recuperação a pedido ao estilo de Claude<button data-href="#The-Constraints-Behind-Claude-Style-On-Demand-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>A adoção de um modelo de recuperação a pedido torna a base de dados vetorial uma parte crítica da arquitetura. A recuperação de conversações coloca exigências invulgarmente elevadas tanto no armazenamento como na execução de consultas, e o sistema tem de cumprir quatro restrições ao mesmo tempo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/constraints_b6ed74e454.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="1-Low-Latency-Tolerance" class="common-anchor-header">1. Tolerância à baixa latência</h3><p>Nos sistemas de conversação, a latência do P99 tem de ser inferior a cerca de 20 ms. Os atrasos superiores a este valor são imediatamente perceptíveis para os utilizadores. Isto deixa pouco espaço para a ineficiência: a pesquisa vetorial, a filtragem de metadados e a classificação de resultados devem ser cuidadosamente optimizadas. Um estrangulamento em qualquer ponto pode degradar toda a experiência de conversação.</p>
<h3 id="2-Hybrid-Search-Requirement" class="common-anchor-header">2. Requisito de pesquisa híbrida</h3><p>As consultas dos utilizadores abrangem frequentemente várias dimensões. Um pedido como <em>"discussões sobre RAG da semana passada"</em> combina relevância semântica com filtragem baseada no tempo. Se uma base de dados apenas suportar a pesquisa vetorial, pode devolver 1.000 resultados semanticamente semelhantes, apenas para que a filtragem da camada de aplicação os reduza a um punhado - desperdiçando a maior parte da computação. Para ser prática, a base de dados deve suportar nativamente consultas vectoriais e escalares combinadas.</p>
<h3 id="3-Storage–Compute-Separation" class="common-anchor-header">3. Separação entre armazenamento e computação</h3><p>O histórico das conversas apresenta um padrão claro de acesso quente-frio. As conversas recentes são consultadas com frequência, enquanto as mais antigas raramente são tocadas. Se todos os vectores tivessem de ficar na memória, o armazenamento de dezenas de milhões de conversas consumiria centenas de gigabytes de RAM - um custo impraticável à escala. Para ser viável, o sistema deve suportar a separação entre armazenamento e computação, mantendo os dados quentes na memória e os dados frios no armazenamento de objectos, com vectores carregados a pedido.</p>
<h3 id="4-Diverse-Query-Patterns" class="common-anchor-header">4. Diversos padrões de consulta</h3><p>A recuperação de conversas não segue um único padrão de acesso. Algumas consultas são puramente semânticas (por exemplo, <em>"a otimização de desempenho que discutimos")</em>, outras são puramente temporais (<em>"todas as conversas da semana passada")</em>, e muitas combinam várias restrições (<em>"discussões relacionadas com Python que mencionam FastAPI nos últimos três meses")</em>. O planeador de consultas de bases de dados deve adaptar as estratégias de execução a diferentes tipos de consultas, em vez de se basear numa pesquisa de tamanho único e de força bruta.</p>
<p>Juntos, estes quatro desafios definem as principais restrições da recuperação conversacional. Qualquer sistema que pretenda implementar a recuperação a pedido, ao estilo de Claude, deve abordar todos eles de forma coordenada.</p>
<h2 id="Why-Milvus-26-Works-Well-for-Conversational-Retrieval" class="common-anchor-header">Por que o Milvus 2.6 funciona bem para a recuperação conversacional<button data-href="#Why-Milvus-26-Works-Well-for-Conversational-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>As escolhas de design do <a href="https://milvus.io/docs/release_notes.md#v268">Milvus 2.6</a> estão alinhadas com os principais requisitos da recuperação conversacional a pedido. Abaixo está um resumo das principais capacidades e como elas se relacionam com as necessidades reais de recuperação de conversação.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_2_6_ce379ff42d.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Hybrid-Retrieval-with-Dense-and-Sparse-Vectors" class="common-anchor-header">Recuperação híbrida com vetores densos e esparsos</h3><p>O Milvus 2.6 suporta nativamente o armazenamento de vectores densos e esparsos na mesma coleção e a fusão automática dos seus resultados no momento da consulta. Os vectores densos (por exemplo, os embeddings de 768 dimensões gerados por modelos como o BGE-M3) captam a semelhança semântica, enquanto os vectores esparsos (normalmente produzidos pelo BM25) preservam os sinais exactos das palavras-chave.</p>
<p>Para uma consulta como <em>"discussões sobre o RAG da semana passada",</em> o Milvus executa a recuperação semântica e a recuperação de palavras-chave em paralelo e, em seguida, funde os resultados através de uma nova classificação. Em comparação com a utilização de uma das abordagens isoladamente, esta estratégia híbrida proporciona uma recuperação significativamente mais elevada em cenários de conversação reais.</p>
<h3 id="Storage–Compute-Separation-and-Query-Optimization" class="common-anchor-header">Separação entre armazenamento e computação e otimização de consultas</h3><p>O Milvus 2.6 suporta armazenamento em camadas de duas maneiras:</p>
<ul>
<li><p>Dados quentes na memória, dados frios no armazenamento de objectos</p></li>
<li><p>Índices na memória, dados vectoriais em bruto no armazenamento de objectos</p></li>
</ul>
<p>Com este design, o armazenamento de um milhão de entradas de conversação pode ser conseguido com cerca de 2 GB de memória e 8 GB de armazenamento de objectos. Com o ajuste adequado, a latência do P99 pode permanecer abaixo de 20 ms, mesmo com a separação entre armazenamento e computação ativada.</p>
<h3 id="JSON-Shredding-and-Fast-Scalar-Filtering" class="common-anchor-header">Destruição de JSON e filtragem escalar rápida</h3><p>O Milvus 2.6 habilita o JSON Shredding por padrão, achatando campos JSON aninhados em armazenamento colunar. Isso melhora o desempenho da filtragem escalar em 3-5× de acordo com os benchmarks oficiais (os ganhos reais variam de acordo com o padrão de consulta).</p>
<p>A recuperação de conversação requer frequentemente a filtragem por metadados, tais como ID de utilizador, ID de sessão ou intervalo de tempo. Com o JSON Shredding, consultas como <em>"todas as conversas do usuário A na última semana"</em> podem ser executadas diretamente em índices colunares, sem analisar repetidamente blobs JSON completos.</p>
<h3 id="Open-Source-Control-and-Operational-Flexibility" class="common-anchor-header">Controlo de código aberto e flexibilidade operacional</h3><p>Sendo um sistema de código aberto, o Milvus oferece um nível de controlo arquitetónico e operacional que as soluções fechadas e de caixa negra não oferecem. As equipas podem ajustar os parâmetros do índice, aplicar estratégias de classificação de dados e personalizar implementações distribuídas para corresponder às suas cargas de trabalho.</p>
<p>Esta flexibilidade reduz a barreira à entrada: as equipas de pequena e média dimensão podem criar sistemas de recuperação de conversação à escala de milhões a dezenas de milhões sem dependerem de orçamentos de infraestrutura excessivos.</p>
<h2 id="Why-ChatGPT-and-Claude-Took-Different-Paths" class="common-anchor-header">Porque é que o ChatGPT e a Claude seguiram caminhos diferentes<button data-href="#Why-ChatGPT-and-Claude-Took-Different-Paths" class="anchor-icon" translate="no">
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
    </button></h2><p>A diferença entre os sistemas de memória do ChatGPT e do Claude está na forma como cada um lida com o esquecimento. O ChatGPT favorece o esquecimento proativo: uma vez que a memória excede limites fixos, o contexto mais antigo é descartado. Isso troca completude por simplicidade e comportamento previsível do sistema. O Claude favorece o esquecimento retardado. Em teoria, o histórico da conversa pode crescer sem limites, com a recuperação delegada a um sistema de recuperação a pedido.</p>
<p>Então, porque é que os dois sistemas escolheram caminhos diferentes? Com os constrangimentos técnicos acima descritos, a resposta torna-se clara: <strong>cada arquitetura só é viável se a infraestrutura subjacente a suportar</strong>.</p>
<p>Se a abordagem de Claude tivesse sido tentada em 2020, teria sido provavelmente impraticável. Nessa altura, as bases de dados vectoriais incorriam frequentemente em centenas de milissegundos de latência, as consultas híbridas eram mal suportadas e a utilização de recursos aumentava de forma proibitiva à medida que os dados cresciam. Nessas condições, a recuperação a pedido teria sido considerada um excesso de engenharia.</p>
<p>Em 2025, o cenário mudou. Os avanços na infraestrutura - impulsionados por sistemas como o <strong>Milvus 2.6 -</strong>tornaram a separação entre armazenamento e computação, a otimização de consultas, a recuperação híbrida densa e esparsa e a fragmentação de JSON viáveis na produção. Estes avanços reduzem a latência, controlam os custos e tornam a recuperação selectiva prática em escala. Como resultado, as ferramentas a pedido e a memória baseada na recuperação tornaram-se não só viáveis, mas também cada vez mais atractivas, especialmente como base para sistemas do tipo agente.</p>
<p>Em última análise, as escolhas de arquitetura seguem o que a infraestrutura torna possível.</p>
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
    </button></h2><p>Nos sistemas do mundo real, a conceção da memória não é uma escolha binária entre contexto pré-computado e recuperação a pedido. As arquitecturas mais eficazes são normalmente híbridas, combinando ambas as abordagens.</p>
<p>Um padrão comum consiste em injetar as voltas recentes da conversa através de uma janela de contexto deslizante, armazenar as preferências estáveis do utilizador como memória fixa e recuperar o histórico mais antigo a pedido através de pesquisa vetorial. À medida que um produto amadurece, este equilíbrio pode mudar gradualmente - de um contexto primariamente pré-computado para um contexto cada vez mais orientado para a recuperação - sem ser necessário um reinício arquitetónico perturbador.</p>
<p>Mesmo quando se começa com uma abordagem pré-computada, é importante projetar tendo em mente a migração. A memória deve ser armazenada com identificadores claros, registos de data e hora, categorias e referências de origem. Quando a recuperação se torna viável, os embeddings podem ser gerados para a memória existente e adicionados a uma base de dados de vectores juntamente com os mesmos metadados, permitindo que a lógica de recuperação seja introduzida de forma incremental e com o mínimo de perturbações.</p>
<p>Tem dúvidas ou pretende aprofundar qualquer funcionalidade do Milvus mais recente? Junte-se ao nosso <a href="https://discord.com/invite/8uyFbECzPX">canal Discord</a> ou registe problemas no <a href="https://github.com/milvus-io/milvus">GitHub</a>. Também pode reservar uma sessão individual de 20 minutos para obter informações, orientações e respostas às suas perguntas através do <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>.</p>
