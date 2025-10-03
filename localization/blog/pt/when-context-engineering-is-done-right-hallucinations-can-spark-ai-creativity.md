---
id: >-
  when-context-engineering-is-done-right-hallucinations-can-spark-ai-creativity.md
title: >-
  Quando a engenharia de contexto é bem feita, as alucinações podem ser a faísca
  da criatividade da IA
author: James Luan
date: 2025-09-30T00:00:00.000Z
desc: >-
  Descubra porque é que as alucinações da IA não são apenas erros, mas sim
  faíscas de criatividade - e como a engenharia de contexto as transforma em
  resultados fiáveis e reais.
cover: assets.zilliz.com/Chat_GPT_Image_Oct_1_2025_10_42_15_AM_101639b3bf.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, AI Agents, Context Engineering'
meta_keywords: 'Milvus, vector database, AI Agents, Context Engineering'
meta_title: |
  If Context Engineering Done Right, Hallucinations Can Spark AI Creativity
origin: >-
  https://milvus.io/blog/when-context-engineering-is-done-right-hallucinations-can-spark-ai-creativity.md
---
<p>Durante muito tempo, muitos de nós - incluindo eu próprio - tratámos as alucinações dos MLT como meros defeitos. Foi construída toda uma cadeia de ferramentas para as eliminar: sistemas de recuperação, protecções, afinação e muito mais. Estas protecções continuam a ser valiosas. Mas quanto mais estudo a forma como os modelos geram efetivamente as respostas - e como sistemas como o <a href="https://milvus.io/"><strong>Milvus</strong></a> se enquadram em condutas de IA mais amplas - menos acredito que as alucinações sejam simplesmente falhas. De facto, também podem ser a centelha da criatividade da IA.</p>
<p>Se olharmos para a criatividade humana, encontramos o mesmo padrão. Todas as descobertas assentam em saltos imaginativos. Mas esses saltos nunca surgem do nada. Os poetas dominam primeiro o ritmo e a métrica antes de quebrarem as regras. Os cientistas baseiam-se em teorias estabelecidas antes de se aventurarem em território não testado. O progresso depende destes saltos, desde que se baseiem em conhecimentos e compreensão sólidos.</p>
<p>Os LLMs funcionam da mesma forma. As suas chamadas "alucinações" ou "saltos" - analogias, associações e extrapolações - emergem do mesmo processo generativo que permite aos modelos estabelecerem ligações, alargarem o conhecimento e apresentarem ideias para além daquilo em que foram explicitamente treinados. Nem todos os saltos são bem sucedidos, mas quando o são, os resultados podem ser convincentes.</p>
<p>É por isso que eu vejo a <strong>Engenharia de Contexto</strong> como o próximo passo fundamental. Em vez de tentarmos eliminar todas as alucinações, devemos concentrar-nos em <em>orientá-las</em>. Ao conceber o contexto correto, podemos encontrar um equilíbrio - mantendo os modelos suficientemente imaginativos para explorar novos terrenos, ao mesmo tempo que garantimos que permanecem suficientemente ancorados para serem de confiança.</p>
<h2 id="What-is-Context-Engineering" class="common-anchor-header">O que é a engenharia do contexto?<button data-href="#What-is-Context-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>Então, o que queremos dizer exatamente com <em>engenharia de contexto</em>? O termo pode ser novo, mas a prática tem vindo a evoluir há anos. Técnicas como RAG, prompting, chamada de função e MCP são todas tentativas iniciais de resolver o mesmo problema: fornecer aos modelos o ambiente certo para produzir resultados úteis. A engenharia de contexto consiste em unificar estas abordagens numa estrutura coerente.</p>
<h2 id="The-Three-Pillars-of-Context-Engineering" class="common-anchor-header">Os três pilares da engenharia de contexto<button data-href="#The-Three-Pillars-of-Context-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>A engenharia de contexto eficaz assenta em três camadas interligadas:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/context_engineering_1_8f2b39c5e7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="1-The-Instructions-Layer--Defining-Direction" class="common-anchor-header">1. A camada de instruções - Definição da direção</h3><p>Esta camada inclui avisos, exemplos de curta duração e demonstrações. É o sistema de navegação do modelo: não apenas um vago "vá para norte", mas uma rota clara com pontos de passagem. Instruções bem estruturadas estabelecem limites, definem objectivos e reduzem a ambiguidade no comportamento do modelo.</p>
<h3 id="2-The-Knowledge-Layer--Supplying-Ground-Truth" class="common-anchor-header">2. A camada de conhecimento - Fornecimento da verdade fundamental</h3><p>Aqui colocamos os factos, o código, os documentos e o estado de que o modelo necessita para raciocinar eficazmente. Sem esta camada, o sistema improvisa a partir de uma memória incompleta. Com ela, o modelo pode basear os seus resultados em dados específicos do domínio. Quanto mais preciso e relevante for o conhecimento, mais fiável será o raciocínio.</p>
<h3 id="3-The-Tools-Layer--Enabling-Action-and-Feedback" class="common-anchor-header">3. A camada das ferramentas - permitir a ação e o feedback</h3><p>Esta camada abrange APIs, chamadas de função e integrações externas. É o que permite que o sistema passe do raciocínio à execução - recuperando dados, efectuando cálculos ou desencadeando fluxos de trabalho. Igualmente importante é o facto de estas ferramentas fornecerem feedback em tempo real que pode ser integrado no raciocínio do modelo. É esse feedback que permite a correção, a adaptação e a melhoria contínua. Na prática, é isto que transforma os LLM de respondentes passivos em participantes activos num sistema.</p>
<p>Estas camadas não são silos - elas reforçam-se mutuamente. As instruções definem o destino, o conhecimento fornece a informação com que trabalhar e as ferramentas transformam as decisões em acções e devolvem os resultados ao ciclo. Bem organizadas, criam um ambiente onde os modelos podem ser criativos e fiáveis.</p>
<h2 id="The-Long-Context-Challenges-When-More-Becomes-Less" class="common-anchor-header">Os desafios do contexto longo: Quando mais se torna menos<button data-href="#The-Long-Context-Challenges-When-More-Becomes-Less" class="anchor-icon" translate="no">
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
    </button></h2><p>Muitos modelos de IA agora anunciam janelas de milhões de tokens - o suficiente para ~75.000 linhas de código ou um documento de 750.000 palavras. Mas mais contexto não produz automaticamente melhores resultados. Na prática, contextos muito longos introduzem modos de falha distintos que podem degradar o raciocínio e a fiabilidade.</p>
<h3 id="Context-Poisoning--When-Bad-Information-Spreads" class="common-anchor-header">Envenenamento do contexto - Quando a má informação se espalha</h3><p>Quando uma informação falsa entra no contexto de trabalho - seja em objectivos, resumos ou estados intermédios - pode fazer descarrilar todo o processo de raciocínio. <a href="https://arxiv.org/pdf/2507.06261">O relatório Gemini 2.5 da DeepMind</a> fornece um exemplo claro. Um agente LLM a jogar Pokémon leu mal o estado do jogo e decidiu que a sua missão era "apanhar o lendário inatingível". Esse objetivo incorreto foi registado como um facto, levando o agente a gerar estratégias elaboradas mas impossíveis.</p>
<p>Como mostra o excerto abaixo, o contexto envenenado prendeu o modelo num ciclo - repetindo erros, ignorando o senso comum e reforçando o mesmo erro até que todo o processo de raciocínio entrou em colapso.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_1_Excerpt_from_Gemini_2_5_Tech_Paper_e89adf9eed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura 1: Excerto do <a href="https://arxiv.org/pdf/2507.06261">documento técnico do Gemini 2.5</a></p>
<h3 id="Context-Distraction--Lost-in-the-Details" class="common-anchor-header">Distração do Contexto - Perdido nos Detalhes</h3><p>À medida que as janelas de contexto se expandem, os modelos podem começar a pesar demais a transcrição e a subutilizar o que aprenderam durante o treinamento. O Gemini 2.5 Pro da DeepMind, por exemplo, suporta uma janela de um milhão de <a href="https://arxiv.org/pdf/2507.06261">tokens</a>, mas <a href="https://arxiv.org/pdf/2507.06261">começa a se desviar em torno de ~100.000 tokens - reciclando</a>ações passadas em vez de gerar novas estratégias. <a href="https://www.databricks.com/blog/long-context-rag-performance-llms">A pesquisa da Databricks</a> mostra que modelos menores, como o Llama 3.1-405B, atingem esse limite muito antes, com cerca de ~32.000 tokens. É um efeito humano familiar: demasiada leitura de fundo e perde-se o fio à meada.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_2_Excerpt_from_Gemini_2_5_Tech_Paper_56d775c59d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura 2: Excerto do <a href="https://arxiv.org/pdf/2507.06261">documento técnico do Gemini 2.5</a></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_3_Long_context_performance_of_GPT_Claude_Llama_Mistral_and_DBRX_models_on_4_curated_RAG_datasets_Databricks_Docs_QA_Finance_Bench_Hot_Pot_QA_and_Natural_Questions_Source_Databricks_99086246b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 3: Desempenho em contexto longo dos modelos GPT, Claude, Llama, Mistral e DBRX em 4 conjuntos de dados RAG selecionados (Databricks DocsQA, FinanceBench, HotPotQA e Natural Questions) [Fonte:</em> <a href="https://www.databricks.com/blog/long-context-rag-performance-llms"><em>Databricks</em></a><em>]</em></p>
<h3 id="Context-Confusion--Too-Many-Tools-in-the-Kitchen" class="common-anchor-header">Confusão de contexto - demasiadas ferramentas na cozinha</h3><p>Adicionar mais ferramentas nem sempre ajuda. O <a href="https://gorilla.cs.berkeley.edu/leaderboard.html">Berkeley Function-Calling Leaderboard</a> mostra que quando o contexto apresenta menus de ferramentas extensos - muitas vezes com muitas opções irrelevantes - a fiabilidade do modelo diminui e as ferramentas são invocadas mesmo quando não são necessárias. Um exemplo claro: uma Llama 3.1-8B quantizada falhou com 46 ferramentas disponíveis, mas teve sucesso quando o conjunto foi reduzido para 19. É o paradoxo da escolha para os sistemas de IA - demasiadas opções, piores decisões.</p>
<h3 id="Context-Clash--When-Information-Conflicts" class="common-anchor-header">Conflito de contextos - Quando a informação entra em conflito</h3><p>As interações de várias voltas acrescentam um modo de falha distinto: os primeiros mal-entendidos agravam-se à medida que o diálogo se ramifica. Nas <a href="https://arxiv.org/pdf/2505.06120v1">experiências da Microsoft e da Salesforce</a>, os LLMs de peso aberto e fechado tiveram um desempenho nitidamente pior em configurações de várias voltas em comparação com as de uma só volta - uma queda média de 39% em seis tarefas de geração. Quando uma suposição errada entra no estado de conversação, os turnos subsequentes herdam-na e amplificam o erro.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_4_LL_Ms_get_lost_in_multi_turn_conversations_in_experiments_21f194b02d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 4: Os LLMs perdem-se em conversas de várias voltas em experiências</em></p>
<p>O efeito aparece mesmo em modelos de fronteira. Quando as tarefas de referência foram distribuídas por turnos, a pontuação de desempenho do modelo o3 da OpenAI caiu de <strong>98,1</strong> para <strong>64,1</strong>. Uma leitura incorrecta inicial "define" efetivamente o modelo do mundo; cada resposta é construída sobre ele, transformando uma pequena contradição num ponto cego, a menos que seja explicitamente corrigida.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_4_The_performance_scores_in_LLM_multi_turn_conversation_experiments_414d3a0b3f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 4: As pontuações de desempenho nas experiências de conversação multi-voltas do LLM</em></p>
<h2 id="Six-Strategies-to-Tame-Long-Context" class="common-anchor-header">Seis estratégias para domar o contexto longo<button data-href="#Six-Strategies-to-Tame-Long-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>A resposta aos desafios dos contextos longos não é abandonar a capacidade - é criá-la com disciplina. Aqui estão seis estratégias que vimos funcionar na prática:</p>
<h3 id="Context-Isolation" class="common-anchor-header">Isolamento do contexto</h3><p>Divida fluxos de trabalho complexos em agentes especializados com contextos isolados. Cada agente concentra-se no seu próprio domínio sem interferência, reduzindo o risco de propagação de erros. Isto não só melhora a precisão como também permite a execução paralela, tal como uma equipa de engenharia bem estruturada.</p>
<h3 id="Context-Pruning" class="common-anchor-header">Poda de contexto</h3><p>Audite e apare regularmente o contexto. Remova detalhes redundantes, informações obsoletas e traços irrelevantes. Pense nisto como uma refacção: elimine o código morto e as dependências, deixando apenas o essencial. A poda eficaz requer critérios explícitos para o que pertence e o que não pertence.</p>
<h3 id="Context-Summarization" class="common-anchor-header">Sumarização de contexto</h3><p>As histórias longas não precisam de ser transportadas na íntegra. Em vez disso, condense-os em resumos concisos que capturem apenas o que é essencial para o próximo passo. Um bom resumo retém os factos críticos, as decisões e as restrições, ao mesmo tempo que elimina a repetição e os detalhes desnecessários. É como substituir uma especificação de 200 páginas por um resumo de design de uma página que ainda lhe dá tudo o que precisa para avançar.</p>
<h3 id="Context-Offloading" class="common-anchor-header">Descarga de contexto</h3><p>Nem todos os detalhes precisam de fazer parte do contexto em direto. Mantenha os dados não críticos em sistemas externos - bases de conhecimento, armazenamentos de documentos ou bases de dados vectoriais como o Milvus - e vá buscá-los apenas quando necessário. Isto alivia a carga cognitiva do modelo, mantendo a informação de base acessível.</p>
<h3 id="Strategic-RAG" class="common-anchor-header">RAG estratégico</h3><p>A recuperação de informação só é poderosa se for selectiva. Introduzir conhecimentos externos através de uma filtragem rigorosa e de controlos de qualidade, garantindo que o modelo consome dados relevantes e exactos. Como em qualquer pipeline de dados: entra lixo, sai lixo - mas com uma recuperação de alta qualidade, o contexto torna-se um ativo e não um passivo.</p>
<h3 id="Optimized-Tool-Loading" class="common-anchor-header">Carregamento optimizado de ferramentas</h3><p>Mais ferramentas não são sinónimo de melhor desempenho. Estudos mostram que a fiabilidade cai drasticamente para além de cerca de 30 ferramentas disponíveis. Carregue apenas as funções necessárias para uma determinada tarefa e bloqueie o acesso ao resto. Uma caixa de ferramentas simples promove a precisão e reduz o ruído que pode sobrecarregar a tomada de decisões.</p>
<h2 id="The-Infrastructure-Challenge-of-Context-Engineering" class="common-anchor-header">O desafio da infraestrutura da engenharia de contexto<button data-href="#The-Infrastructure-Challenge-of-Context-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>A engenharia de contexto só é tão eficaz quanto a infraestrutura em que é executada. E as empresas de hoje estão a enfrentar uma tempestade perfeita de desafios de dados:</p>
<h3 id="Scale-Explosion--From-Terabytes-to-Petabytes" class="common-anchor-header">Explosão de escala - de Terabytes a Petabytes</h3><p>Atualmente, o crescimento dos dados redefiniu a linha de base. Cargas de trabalho que antes cabiam confortavelmente em um único banco de dados agora abrangem petabytes, exigindo armazenamento e computação distribuídos. Uma mudança de esquema que costumava ser uma atualização SQL de uma linha pode se transformar em um esforço de orquestração completo em clusters, pipelines e serviços. O escalonamento não se trata apenas de adicionar hardware - trata-se de engenharia para coordenação, resiliência e elasticidade em uma escala em que cada suposição é testada.</p>
<h3 id="Consumption-Revolution--Systems-That-Speak-AI" class="common-anchor-header">Revolução do consumo - Sistemas que falam IA</h3><p>Os agentes de IA não se limitam a consultar dados; geram, transformam e consomem-nos continuamente à velocidade da máquina. A infraestrutura concebida apenas para aplicações dirigidas ao ser humano não consegue acompanhar este ritmo. Para dar suporte aos agentes, os sistemas devem fornecer recuperação de baixa latência, atualizações de streaming e cargas de trabalho pesadas de gravação sem quebras. Por outras palavras, a pilha de infra-estruturas deve ser criada para "falar de IA" como a sua carga de trabalho nativa e não como uma reflexão posterior.</p>
<h3 id="Multimodal-Complexity--Many-Data-Types-One-System" class="common-anchor-header">Complexidade multimodal - muitos tipos de dados, um sistema</h3><p>As cargas de trabalho de IA misturam texto, imagens, áudio, vídeo e embeddings de alta dimensão, cada um com metadados ricos anexados. Gerir esta heterogeneidade é o ponto crucial da engenharia de contexto prática. O desafio não é apenas armazenar diversos objectos; é indexá-los, recuperá-los eficientemente e manter a consistência semântica entre modalidades. Uma infraestrutura verdadeiramente preparada para a IA tem de tratar a multimodalidade como um princípio de conceção de primeira classe, e não como uma funcionalidade adicional.</p>
<h2 id="Milvus-+-Loon-Purpose-Built-Data-Infrastructure-for-AI" class="common-anchor-header">Milvus + Loon: Infraestrutura de dados criada para fins específicos para IA<button data-href="#Milvus-+-Loon-Purpose-Built-Data-Infrastructure-for-AI" class="anchor-icon" translate="no">
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
    </button></h2><p>Os desafios de escala, consumo e multimodalidade não podem ser resolvidos apenas com teoria - eles exigem uma infraestrutura criada especificamente para IA. É por isso que nós da <a href="https://zilliz.com/">Zilliz</a> projetamos <strong>o Milvus</strong> e <strong>o Loon</strong> para trabalharem juntos, abordando os dois lados do problema: recuperação de alto desempenho em tempo de execução e processamento de dados em grande escala a montante.</p>
<ul>
<li><p><a href="https://milvus.io/"><strong>Milvus</strong></a>: o banco de dados vetorial de código aberto mais amplamente adotado, otimizado para recuperação e armazenamento de vetores de alto desempenho.</p></li>
<li><p><strong>Loon</strong>: nosso próximo serviço de data lake multimodal nativo da nuvem, projetado para processar e organizar dados multimodais em grande escala antes que eles cheguem ao banco de dados. Fique atento.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/loon_milvus_min_76aaa39b4e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Lightning-Fast-Vector-Search" class="common-anchor-header">Pesquisa Vetorial Rápida como um Relâmpago</h3><p><strong>O Milvus</strong> foi criado desde o início para cargas de trabalho vetoriais. Como camada de serviço, ele oferece recuperação abaixo de 10 ms em centenas de milhões - ou até bilhões - de vetores, sejam eles derivados de texto, imagens, áudio ou vídeo. Para aplicações de IA, a velocidade de recuperação não é algo "bom de se ter". É o que determina se um agente se sente reativo ou lento, se um resultado de pesquisa parece relevante ou desfasado. O desempenho aqui é diretamente visível na experiência do utilizador final.</p>
<h3 id="Multimodal-Data-Lake-Service-at-Scale" class="common-anchor-header">Serviço de lago de dados multimodal em escala</h3><p><strong>O Loon</strong> é o nosso próximo serviço de data lake multimodal, concebido para processamento e análise offline em grande escala de dados não estruturados. Ele complementa o Milvus no lado do pipeline, preparando os dados antes que eles cheguem ao banco de dados. Os conjuntos de dados multimodais do mundo real - abrangendo texto, imagens, áudio e vídeo - são muitas vezes confusos, com duplicação, ruído e formatos inconsistentes. O Loon faz esse trabalho pesado usando estruturas distribuídas como Ray e Daft, compactando, deduplicando e agrupando os dados antes de transmiti-los diretamente para o Milvus. O resultado é simples: sem gargalos de preparação, sem conversões de formato dolorosas - apenas dados limpos e estruturados que os modelos podem usar imediatamente.</p>
<h3 id="Cloud-Native-Elasticity" class="common-anchor-header">Elasticidade nativa da nuvem</h3><p>Ambos os sistemas são criados de forma nativa na nuvem, com escalonamento independente de armazenamento e computação. Isso significa que, à medida que as cargas de trabalho aumentam de gigabytes para petabytes, é possível equilibrar os recursos entre o serviço em tempo real e o treinamento offline, em vez de provisionar demais para um ou prejudicar o outro.</p>
<h3 id="Future-Proof-Architecture" class="common-anchor-header">Arquitetura preparada para o futuro</h3><p>Mais importante ainda, esta arquitetura foi concebida para crescer consigo. A engenharia de contexto ainda está a evoluir. Neste momento, a maioria das equipas está concentrada na pesquisa semântica e nos pipelines RAG. Mas a próxima vaga vai exigir mais - integrar vários tipos de dados, raciocinar entre eles e alimentar fluxos de trabalho orientados por agentes.</p>
<p>Com o Milvus e o Loon, essa transição não exige que se destrua a base. A mesma pilha que suporta os casos de uso de hoje pode se estender naturalmente para os de amanhã. Você adiciona novos recursos sem começar de novo, o que significa menos risco, menor custo e um caminho mais suave à medida que as cargas de trabalho de IA se tornam mais complexas.</p>
<h2 id="Your-Next-Move" class="common-anchor-header">O seu próximo passo<button data-href="#Your-Next-Move" class="anchor-icon" translate="no">
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
    </button></h2><p>A engenharia de contexto não é apenas mais uma disciplina técnica - é a forma como desbloqueamos o potencial criativo da IA, mantendo-a fundamentada e fiável. Se está pronto para pôr estas ideias em prática, comece por onde é mais importante.</p>
<ul>
<li><p>Experimente<a href="https://milvus.io/docs/overview.md"><strong>o Milvus</strong></a> para ver como as bases de dados vectoriais podem ancorar a recuperação em implementações do mundo real.</p></li>
<li><p><a href="https://www.linkedin.com/company/the-milvus-project/"><strong>Siga o Milvus</strong></a> para obter actualizações sobre o lançamento do Loon e informações sobre a gestão de dados multimodais em grande escala.</p></li>
<li><p><a href="https://discord.com/invite/8uyFbECzPX"><strong>Junte-se à comunidade Zilliz no Discord</strong></a> para partilhar estratégias, comparar arquitecturas e ajudar a definir as melhores práticas.</p></li>
</ul>
<p>As empresas que dominam a engenharia de contexto hoje irão moldar o cenário da IA amanhã. Não deixe que a infraestrutura seja a restrição - construa a base que sua criatividade de IA merece.</p>
