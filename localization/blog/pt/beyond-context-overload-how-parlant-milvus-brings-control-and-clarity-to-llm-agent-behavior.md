---
id: >-
  beyond-context-overload-how-parlant-milvus-brings-control-and-clarity-to-llm-agent-behavior.md
title: >-
  Para além da sobrecarga de contexto: Como o Parlant × Milvus traz controlo e
  clareza ao comportamento do agente LLM
author: Min Yin
date: 2025-11-05T00:00:00.000Z
cover: assets.zilliz.com/parlant_cover1_466dc0fe21.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Parlant, Milvus, AI agents, vector database, LLM'
meta_title: How Parlant × Milvus Brings Control to LLM Agent Behavior
desc: >-
  Descubra como a Parlant × Milvus usa a modelagem de alinhamento e a
  inteligência vetorial para tornar o comportamento do agente LLM controlável,
  explicável e pronto para a produção.
origin: >-
  https://milvus.io/blog/beyond-context-overload-how-parlant-milvus-brings-control-and-clarity-to-llm-agent-behavior.md
---
<p>Imagine que lhe é pedido para completar uma tarefa que envolve 200 regras comerciais, 50 ferramentas e 30 demonstrações, e que só tem uma hora para o fazer. Isso é simplesmente impossível. No entanto, muitas vezes esperamos que grandes modelos de linguagem façam exatamente isso quando os transformamos em "agentes" e os sobrecarregamos com instruções.</p>
<p>Na prática, esta abordagem rapidamente se torna ineficaz. As estruturas de agentes tradicionais, como a LangChain ou a LlamaIndex, injectam todas as regras e ferramentas no contexto do modelo de uma só vez, o que leva a conflitos de regras, sobrecarga de contexto e comportamento imprevisível na produção.</p>
<p>Para resolver esse problema, uma estrutura de agente de código aberto chamada<a href="https://github.com/emcie-co/parlant?utm_source=chatgpt.com"> <strong>Parlant</strong></a> vem ganhando força no GitHub. Ele introduz uma nova abordagem chamada Modelagem de Alinhamento, juntamente com um mecanismo de supervisão e transições condicionais que tornam o comportamento do agente muito mais controlável e explicável.</p>
<p>Quando emparelhado com o <a href="https://milvus.io/"><strong>Milvus</strong></a>, uma base de dados vetorial de código aberto, o Parlant torna-se ainda mais capaz. O Milvus acrescenta inteligência semântica, permitindo que os agentes recuperem dinamicamente as regras e o contexto mais relevantes em tempo real - mantendo-os precisos, eficientes e prontos para a produção.</p>
<p>Nesta postagem, exploraremos como o Parlant funciona secretamente e como a integração com o Milvus permite a produção.</p>
<h2 id="Why-Traditional-Agent-Frameworks-Fall-Apart" class="common-anchor-header">Por que as estruturas tradicionais de agentes se desfazem<button data-href="#Why-Traditional-Agent-Frameworks-Fall-Apart" class="anchor-icon" translate="no">
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
    </button></h2><p>As estruturas de agentes tradicionais adoram ser grandes: centenas de regras, dezenas de ferramentas e um punhado de demonstrações - tudo amontoado em um único prompt superlotado. Pode parecer ótimo em uma demonstração ou em um pequeno teste de sandbox, mas quando você o coloca em produção, as rachaduras começam a aparecer rapidamente.</p>
<ul>
<li><p><strong>Regras conflitantes trazem o caos:</strong> Quando duas ou mais regras se aplicam ao mesmo tempo, esses frameworks não têm uma maneira integrada de decidir qual delas vence. Às vezes, ele escolhe uma. Às vezes, mistura as duas. Por vezes, faz algo totalmente imprevisível.</p></li>
<li><p><strong>Casos extremos expõem as lacunas:</strong> Não é possível prever tudo o que um utilizador pode dizer. E quando o seu modelo se depara com algo fora dos dados de treino, o padrão são respostas genéricas e sem compromisso.</p></li>
<li><p><strong>A depuração é dolorosa e cara:</strong> Quando um agente se comporta mal, é quase impossível identificar qual regra causou o problema. Como tudo fica dentro de um prompt de sistema gigante, a única maneira de corrigir o problema é reescrever o prompt e testar tudo novamente do zero.</p></li>
</ul>
<h2 id="What-is-Parlant-and-How-It-Works" class="common-anchor-header">O que é o Parlant e como ele funciona<button data-href="#What-is-Parlant-and-How-It-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Parlant é um motor de alinhamento de código aberto para agentes LLM. É possível controlar com precisão como um agente se comporta em diferentes cenários, modelando o seu processo de tomada de decisão de uma forma estruturada e baseada em regras.</p>
<p>Para resolver os problemas encontrados nas estruturas tradicionais de agentes, a Parlant introduz uma nova e poderosa abordagem: <strong>A Modelagem de Alinhamento</strong>. Sua idéia central é separar a definição e a execução de regras, garantindo que apenas as regras mais relevantes sejam injetadas no contexto do LLM a qualquer momento.</p>
<h3 id="Granular-Guidelines-The-Core-of-Alignment-Modeling" class="common-anchor-header">Diretrizes Granulares: O núcleo da modelagem de alinhamento</h3><p>No coração do modelo de alinhamento do Parlant está o conceito de <strong>Diretrizes Granulares</strong>. Em vez de escrever um prompt de sistema gigante cheio de regras, você define diretrizes pequenas e modulares - cada uma descrevendo como o agente deve lidar com um tipo específico de situação.</p>
<p>Cada diretriz é composta por três partes:</p>
<ul>
<li><p><strong>Condição</strong> - Uma descrição em linguagem natural de quando a regra deve ser aplicada. O Parlant converte essa condição em um vetor semântico e a compara com a entrada do usuário para descobrir se ela é relevante.</p></li>
<li><p><strong>Ação</strong> - Uma instrução clara que define como o agente deve responder quando a condição for atendida. Esta ação é injectada no contexto do LLM apenas quando é activada.</p></li>
<li><p><strong>Ferramentas</strong> - Quaisquer funções externas ou APIs ligadas a essa regra específica. Estas são expostas ao agente apenas quando a diretriz está ativa, mantendo a utilização da ferramenta controlada e consciente do contexto.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">await</span> agent.<span class="hljs-title function_">create_guideline</span>(
    condition=<span class="hljs-string">&quot;The user asks about a refund and the order amount exceeds 500 RMB&quot;</span>,
    action=<span class="hljs-string">&quot;First call the order status check tool to confirm whether the refund conditions are met, then provide a detailed explanation of the refund process&quot;</span>,
    tools=[check_order_status, calculate_refund_amount]
)
<button class="copy-code-btn"></button></code></pre>
<p>Sempre que um usuário interage com o agente, o Parlant executa uma etapa de correspondência leve para encontrar as três a cinco diretrizes mais relevantes. Somente essas regras são injetadas no contexto do modelo, mantendo os avisos concisos e focados e garantindo que o agente siga consistentemente as regras corretas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/guideline_system_652fb287ce.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Supervising-Mechanism-for-Accuracy-and-Consistency" class="common-anchor-header">Mecanismo de supervisão para precisão e consistência</h3><p>Para manter a precisão e a consistência, o Parlant introduz um <strong>mecanismo de supervisão</strong> que atua como uma segunda camada de controlo de qualidade. O processo se desenvolve em três etapas:</p>
<p><strong>1. Gerar uma resposta candidata</strong> - O agente cria uma resposta inicial com base nas diretrizes correspondentes e no contexto atual da conversa.</p>
<p><strong>2. Verificar a conformidade</strong> - A resposta é comparada com as diretrizes activas para verificar se todas as instruções foram seguidas corretamente.</p>
<p><strong>3. Rever ou confirmar</strong> - Se forem detectados problemas, o sistema corrige o resultado; se tudo estiver correto, a resposta é aprovada e enviada ao utilizador.</p>
<p>Este mecanismo de supervisão garante que o agente não só compreende as regras, como também as cumpre antes de responder - melhorando a fiabilidade e o controlo.</p>
<h3 id="Conditional-Transitions-for-Control-and-Safety" class="common-anchor-header">Transições condicionais para controlo e segurança</h3><p>Nas estruturas tradicionais de agentes, todas as ferramentas disponíveis são expostas ao LLM em todos os momentos. Essa abordagem de "tudo na mesa" geralmente leva a prompts sobrecarregados e chamadas de ferramentas não intencionais. O Parlant resolve isso por meio de <strong>transições condicionais</strong>. Semelhante ao funcionamento das máquinas de estado, uma ação ou ferramenta é acionada apenas quando uma condição específica é atendida. Cada ferramenta está fortemente ligada à sua diretriz correspondente e só fica disponível quando a condição dessa diretriz é activada.</p>
<pre><code translate="no"><span class="hljs-comment"># The balance inquiry tool is exposed only when the condition &quot;the user wants to make a transfer&quot; is met</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
    condition=<span class="hljs-string">&quot;The user wants to make a transfer&quot;</span>,
    action=<span class="hljs-string">&quot;First check the account balance. If the balance is below 500 RMB, remind the user that an overdraft fee may apply.&quot;</span>,
    tools=[get_user_account_balance]
)
<button class="copy-code-btn"></button></code></pre>
<p>Este mecanismo transforma a invocação de uma ferramenta numa transição condicional - as ferramentas passam de "inactivas" a "activas" apenas quando as suas condições de ativação são satisfeitas. Ao estruturar a execução desta forma, o Parlant garante que cada ação aconteça de forma deliberada e contextualizada, prevenindo o uso indevido e melhorando tanto a eficiência quanto a segurança do sistema.</p>
<h2 id="How-Milvus-Powers-Parlant" class="common-anchor-header">Como Milvus alimenta a Parlant<button data-href="#How-Milvus-Powers-Parlant" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando olhamos por baixo do capô do processo de correspondência de diretrizes da Parlant, um desafio técnico central torna-se claro: como o sistema pode encontrar as três ou cinco regras mais relevantes dentre centenas - ou até mesmo milhares - de opções em apenas alguns milissegundos? É exatamente aí que entra uma base de dados vetorial. A recuperação semântica é o que torna isso possível.</p>
<h3 id="How-Milvus-Supports-Parlant’s-Guideline-Matching-Process" class="common-anchor-header">Como a Milvus apoia o processo de correspondência de diretrizes do Parlant</h3><p>A correspondência de diretrizes funciona através da similaridade semântica. O campo Condição de cada diretriz é convertido em uma incorporação vetorial, capturando o seu significado e não apenas o seu texto literal. Quando um usuário envia uma mensagem, o Parlant compara a semântica dessa mensagem com todas as incorporações de diretrizes armazenadas para encontrar as mais relevantes.</p>
<p>Veja a seguir como o processo funciona passo a passo:</p>
<p><strong>1. Codificar a consulta</strong> - A mensagem do utilizador e o histórico de conversas recentes são transformados num vetor de consulta.</p>
<p><strong>2. Procura de semelhanças</strong> - O sistema efectua uma pesquisa de semelhanças no vetor de diretrizes para encontrar as correspondências mais próximas.</p>
<p><strong>3. Obter resultados Top-K</strong> - São apresentadas as três a cinco diretrizes semanticamente mais relevantes.</p>
<p><strong>4. Injetar no contexto</strong> - Estas diretrizes correspondentes são então inseridas dinamicamente no contexto do LLM para que o modelo possa agir de acordo com as regras corretas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/guideline_matching_process_ffd874c77e.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Para tornar este fluxo de trabalho possível, a base de dados de vectores tem de fornecer três capacidades críticas: pesquisa de alto desempenho no vizinho mais próximo (ANN), filtragem flexível de metadados e actualizações de vectores em tempo real. <a href="https://milvus.io/"><strong>O Milvus</strong></a>, o banco de dados vetorial nativo da nuvem e de código aberto, oferece desempenho de nível de produção em todas as três áreas.</p>
<p>Para entender como o Milvus funciona em cenários reais, vamos analisar um agente de serviços financeiros como exemplo.</p>
<p>Suponhamos que o sistema define 800 diretrizes comerciais que abrangem tarefas como pedidos de informação sobre contas, transferências de fundos e consultas sobre produtos de gestão de património. Nesta configuração, o Milvus actua como camada de armazenamento e recuperação de todos os dados das diretrizes.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType
<span class="hljs-keyword">import</span> parlant.sdk <span class="hljs-keyword">as</span> p

<span class="hljs-comment"># Connect to Milvus</span>
connections.connect(host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)

<span class="hljs-comment"># Define the schema for the guideline collection</span>
fields = [
    FieldSchema(name=<span class="hljs-string">&quot;guideline_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>, is_primary=<span class="hljs-literal">True</span>),
    FieldSchema(name=<span class="hljs-string">&quot;condition_vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>),
    FieldSchema(name=<span class="hljs-string">&quot;condition_text&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">1000</span>),
    FieldSchema(name=<span class="hljs-string">&quot;action_text&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>),
    FieldSchema(name=<span class="hljs-string">&quot;priority&quot;</span>, dtype=DataType.INT64),
    FieldSchema(name=<span class="hljs-string">&quot;business_domain&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
]
schema = CollectionSchema(fields=fields, description=<span class="hljs-string">&quot;Agent Guidelines&quot;</span>)
guideline_collection = Collection(name=<span class="hljs-string">&quot;agent_guidelines&quot;</span>, schema=schema)

<span class="hljs-comment"># Create an HNSW index for high-performance retrieval</span>
index_params = {
    <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;HNSW&quot;</span>,
    <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
    <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
}
guideline_collection.create_index(field_name=<span class="hljs-string">&quot;condition_vector&quot;</span>, index_params=index_params)
<button class="copy-code-btn"></button></code></pre>
<p>Agora, quando um utilizador diz "Quero transferir 100.000 RMB para a conta da minha mãe", o fluxo em tempo de execução é</p>
<p><strong>1. Rectorizar a consulta</strong> - Converter a entrada do utilizador num vetor de 768 dimensões.</p>
<p><strong>2. Recuperação híbrida</strong> - Executar uma pesquisa de semelhança vetorial em Milvus com filtragem de metadados (por exemplo, <code translate="no">business_domain=&quot;transfer&quot;</code>).</p>
<p><strong>3. Classificação dos resultados</strong> - Classificar as diretrizes candidatas com base nas pontuações de semelhança combinadas com os seus valores <strong>de prioridade</strong>.</p>
<p><strong>4. Injeção de contexto</strong> - Injete as três melhores diretrizes correspondentes <code translate="no">action_text</code> no contexto do agente Parlant.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/bank_transfer_use_case_481d09a407.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nesta configuração, o Milvus fornece latência P99 abaixo de 15 ms, mesmo quando a biblioteca de diretrizes é dimensionada para 100.000 entradas. Em comparação, o uso de um banco de dados relacional tradicional com correspondência de palavras-chave normalmente resulta em latência acima de 200 ms e precisão de correspondência significativamente menor.</p>
<h3 id="How-Milvus-Enables-Long-Term-Memory-and-Personalization" class="common-anchor-header">Como o Milvus permite a memória a longo prazo e a personalização</h3><p>O Milvus faz mais do que a correspondência de diretrizes. Em cenários em que os agentes necessitam de memória de longo prazo e de respostas personalizadas, o Milvus pode servir como camada de memória que armazena e recupera as interações passadas dos utilizadores como embeddings vectoriais, ajudando o agente a lembrar-se do que foi discutido anteriormente.</p>
<pre><code translate="no"><span class="hljs-comment"># store user’s past interactions</span>
user_memory_fields = [
    FieldSchema(name=<span class="hljs-string">&quot;interaction_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>, is_primary=<span class="hljs-literal">True</span>),
    FieldSchema(name=<span class="hljs-string">&quot;user_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">50</span>),
    FieldSchema(name=<span class="hljs-string">&quot;interaction_vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>),
    FieldSchema(name=<span class="hljs-string">&quot;interaction_summary&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">500</span>),
    FieldSchema(name=<span class="hljs-string">&quot;timestamp&quot;</span>, dtype=DataType.INT64)
]
memory_collection = Collection(name=<span class="hljs-string">&quot;user_memory&quot;</span>, schema=CollectionSchema(user_memory_fields))
<button class="copy-code-btn"></button></code></pre>
<p>Quando o mesmo utilizador regressa, o agente pode recuperar as interações históricas mais relevantes do Milvus e utilizá-las para gerar uma experiência mais conectada e semelhante à humana. Por exemplo, se um utilizador fez uma pergunta sobre um fundo de investimento na semana passada, o agente pode recordar esse contexto e responder de forma proactiva: "Bem-vindo de volta! Ainda tem dúvidas sobre o fundo que falámos da última vez?"</p>
<h3 id="How-to-Optimize-Performance-for-Milvus-Powered-Agent-Systems" class="common-anchor-header">Como otimizar o desempenho dos sistemas de agentes com tecnologia Milvus</h3><p>Quando se implementa um sistema de agentes alimentado por Milvus num ambiente de produção, a afinação do desempenho torna-se crítica. Para alcançar baixa latência e alta taxa de transferência, vários parâmetros-chave precisam de atenção:</p>
<p><strong>1. Escolher o tipo de índice correto</strong></p>
<p>É importante selecionar a estrutura de índice adequada. Por exemplo, o HNSW (Hierarchical Navigable Small World) é ideal para cenários de alta recuperação, como finanças ou saúde, em que a precisão é fundamental. O IVF_FLAT funciona melhor para aplicações de grande escala, como recomendações de comércio eletrónico, em que é aceitável uma recuperação ligeiramente inferior em troca de um desempenho mais rápido e de uma menor utilização de memória.</p>
<p><strong>2. Estratégia de fragmentação</strong></p>
<p>Quando o número de diretrizes armazenadas excede um milhão de entradas, é recomendável usar <strong>Partição</strong> para dividir os dados por domínio de negócios ou caso de uso. O particionamento reduz o espaço de pesquisa por consulta, melhorando a velocidade de recuperação e mantendo a latência estável mesmo com o crescimento do conjunto de dados.</p>
<p><strong>3. Configuração da cache</strong></p>
<p>Para diretrizes frequentemente acedidas, tais como consultas padrão de clientes ou fluxos de trabalho de elevado tráfego, pode utilizar a cache de resultados de consultas Milvus. Isto permite que o sistema reutilize resultados anteriores, reduzindo a latência para menos de 5 milissegundos em pesquisas repetidas.</p>
<h2 id="Hands-on-Demo-How-to-Build-a-Smart-QA-System-with-Parlant-and-Milvus-Lite" class="common-anchor-header">Demonstração prática: Como construir um sistema inteligente de perguntas e respostas com Parlant e Milvus Lite<button data-href="#Hands-on-Demo-How-to-Build-a-Smart-QA-System-with-Parlant-and-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/install-overview.md">O Milvus Lite</a> é uma versão leve do Milvus - uma biblioteca Python que pode ser facilmente incorporada nas suas aplicações. É ideal para prototipagem rápida em ambientes como Jupyter Notebooks ou para execução em dispositivos inteligentes e de ponta com recursos computacionais limitados. Apesar de sua pequena pegada, o Milvus Lite suporta as mesmas APIs que outras implantações do Milvus. Isto significa que o código do lado do cliente que escrever para o Milvus Lite pode ligar-se sem problemas a uma instância completa do Milvus ou do Zilliz Cloud mais tarde - sem necessidade de refactoring.</p>
<p>Nesta demonstração, usaremos o Milvus Lite em conjunto com o Parlant para demonstrar como criar um sistema inteligente de perguntas e respostas que fornece respostas rápidas e contextualizadas com configuração mínima.</p>
<h3 id="Prerequisites" class="common-anchor-header">Pré-requisitos：</h3><p>1. GitHub do Parlant: https://github.com/emcie-co/parlant</p>
<p>2. documentação do Parlant: https://parlant.io/docs</p>
<p>3. python3.10+</p>
<p>4.OpenAI_key</p>
<p>5.MlivusLite</p>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">Passo 1: Instalar as dependências</h3><pre><code translate="no"><span class="hljs-comment"># Install required Python packages</span>
pip install pymilvus parlant openai
<span class="hljs-comment"># Or, if you’re using a Conda environment:</span>
conda activate your_env_name
pip install pymilvus parlant openai
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Configure-Environment-Variables" class="common-anchor-header">Passo 2: Configurar as variáveis de ambiente</h3><pre><code translate="no"><span class="hljs-comment"># Set your OpenAI API key</span>
<span class="hljs-built_in">export</span> OPENAI_API_KEY=<span class="hljs-string">&quot;your_openai_api_key_here&quot;</span>
<span class="hljs-comment"># Verify that the variable is set correctly</span>
<span class="hljs-built_in">echo</span> <span class="hljs-variable">$OPENAI_API_KEY</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Implement-the-Core-Code" class="common-anchor-header">Passo 3: Implementar o código principal</h3><ul>
<li>Criar um OpenAI Embedder personalizado</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">class</span> <span class="hljs-title class_">OpenAIEmbedder</span>(p.Embedder):
    <span class="hljs-comment"># Converts text into vector embeddings with built-in timeout and retry</span>
    <span class="hljs-comment"># Dimension: 1536 (text-embedding-3-small)</span>
    <span class="hljs-comment"># Timeout: 60 seconds; Retries: up to 2 times</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Inicializar a base de conhecimento</li>
</ul>
<p>1. criar uma coleção Milvus chamada kb_articles.</p>
<p>2. inserir dados de amostra (por exemplo, política de reembolso, política de troca, tempo de envio).</p>
<p>3. construir um índice HNSW para acelerar a recuperação.</p>
<ul>
<li>Construir a ferramenta de pesquisa vetorial</li>
</ul>
<pre><code translate="no"><span class="hljs-meta">@p.tool</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">vector_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span>, min_score: <span class="hljs-built_in">float</span> = <span class="hljs-number">0.35</span></span>):
    <span class="hljs-comment"># 1. Convert user query into a vector</span>
    <span class="hljs-comment"># 2. Perform similarity search in Milvus</span>
    <span class="hljs-comment"># 3. Return results with relevance above threshold</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Configurar o agente Parlant</li>
</ul>
<p><strong>Diretriz 1:</strong> Para perguntas factuais ou relacionadas com políticas, o agente deve primeiro efetuar uma pesquisa vetorial.</p>
<p><strong>Diretriz 2:</strong> Quando são encontradas provas, o agente deve responder utilizando um modelo estruturado (resumo + pontos-chave + fontes).</p>
<pre><code translate="no"><span class="hljs-comment"># Guideline 1: Run vector search for factual or policy-related questions</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;User asks a factual question about policy, refund, exchange, or shipping&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Call vector_search with the user&#x27;s query. &quot;</span>
                <span class="hljs-string">&quot;If evidence is found, synthesize an answer by quoting key sentences and cite doc_id/title. &quot;</span>
                <span class="hljs-string">&quot;If evidence is insufficient, ask a clarifying question before answering.&quot;</span>
            ),
            tools=[vector_search],

<span class="hljs-comment"># Guideline 2: Use a standardized, structured response when evidence is available</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;Evidence is available&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Answer with the following template:\\n&quot;</span>
                <span class="hljs-string">&quot;Summary: provide a concise conclusion.\\n&quot;</span>
                <span class="hljs-string">&quot;Key points: 2-3 bullets distilled from evidence.\\n&quot;</span>
                <span class="hljs-string">&quot;Sources: list doc_id and title.\\n&quot;</span>
                <span class="hljs-string">&quot;Note: if confidence is low, state limitations and ask for clarification.&quot;</span>
            ),
            tools=[],
        )

    tools=[],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Escreva o código completo</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>, <span class="hljs-type">Any</span>
<span class="hljs-keyword">import</span> parlant.sdk <span class="hljs-keyword">as</span> p
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType
<span class="hljs-comment"># 1) Environment variables: using OpenAI (as both the default generation model and embedding service)</span>
<span class="hljs-comment"># Make sure the OPENAI_API_KEY is set</span>
OPENAI_API_KEY = os.environ.get(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> OPENAI_API_KEY:
    <span class="hljs-keyword">raise</span> RuntimeError(<span class="hljs-string">&quot;Please set OPENAI_API_KEY environment variable&quot;</span>)
<span class="hljs-comment"># 2) Initialize Milvus Lite (runs locally, no standalone service required)</span>
<span class="hljs-comment"># MilvusClient runs in Lite mode using a local file path (requires pymilvus &gt;= 2.x)</span>
client = MilvusClient(<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)  <span class="hljs-comment"># Lite mode uses a local file path</span>
COLLECTION = <span class="hljs-string">&quot;kb_articles&quot;</span>
<span class="hljs-comment"># 3) Example data: three policy or FAQ entries (in practice, you can load and chunk data from files)</span>
DOCS = [
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;POLICY-001&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Refund Policy&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Refunds are available within 30 days of purchase if the product is unused.&quot;</span>},
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;POLICY-002&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Exchange Policy&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Exchanges are permitted within 15 days; original packaging required.&quot;</span>},
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;FAQ-101&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Shipping Time&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Standard shipping usually takes 3–5 business days within the country.&quot;</span>},
]
<span class="hljs-comment"># 4) Generate embeddings using OpenAI (you can replace this with another embedding service)</span>
<span class="hljs-comment"># Here we use Parlant’s built-in OpenAI embedder for simplicity, but you could also call the OpenAI SDK directly.</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">OpenAIEmbedder</span>(p.Embedder):
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">self, texts: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>], hints: <span class="hljs-type">Dict</span>[<span class="hljs-built_in">str</span>, <span class="hljs-type">Any</span>] = {}</span>) -&gt; p.EmbeddingResult:
        <span class="hljs-comment"># Generate text embeddings using the OpenAI API, with timeout and retry handling</span>
        <span class="hljs-keyword">import</span> openai
        <span class="hljs-keyword">try</span>:
            client = openai.AsyncOpenAI(
                api_key=OPENAI_API_KEY,
                timeout=<span class="hljs-number">60.0</span>,  <span class="hljs-comment"># 60-second timeout</span>
                max_retries=<span class="hljs-number">2</span>  <span class="hljs-comment"># Retry up to 2 times</span>
            )
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Generating embeddings for <span class="hljs-subst">{<span class="hljs-built_in">len</span>(texts)}</span> texts...&quot;</span>)
            response = <span class="hljs-keyword">await</span> client.embeddings.create(
                model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>,
                <span class="hljs-built_in">input</span>=texts
            )
            vectors = [data.embedding <span class="hljs-keyword">for</span> data <span class="hljs-keyword">in</span> response.data]
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully generated <span class="hljs-subst">{<span class="hljs-built_in">len</span>(vectors)}</span> embeddings.&quot;</span>)
            <span class="hljs-keyword">return</span> p.EmbeddingResult(vectors=vectors)
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;OpenAI API call failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-comment"># Return mock vectors for testing Milvus connectivity</span>
            <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Using mock vectors for testing...&quot;</span>)
            <span class="hljs-keyword">import</span> random
            vectors = [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">1536</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> texts]
            <span class="hljs-keyword">return</span> p.EmbeddingResult(vectors=vectors)
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">id</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">max_tokens</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">int</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-number">8192</span>
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">tokenizer</span>(<span class="hljs-params">self</span>) -&gt; p.EstimatingTokenizer:
        <span class="hljs-keyword">from</span> parlant.core.nlp.tokenization <span class="hljs-keyword">import</span> ZeroEstimatingTokenizer
        <span class="hljs-keyword">return</span> ZeroEstimatingTokenizer()
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">dimensions</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">int</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-number">1536</span>
embedder = OpenAIEmbedder()
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">ensure_collection_and_load</span>():
    <span class="hljs-comment"># Create the collection (schema: primary key, vector field, additional fields)</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> client.has_collection(COLLECTION):
        client.create_collection(
            collection_name=COLLECTION,
            dimension=<span class="hljs-built_in">len</span>((<span class="hljs-keyword">await</span> embedder.embed([<span class="hljs-string">&quot;dimension_probe&quot;</span>])).vectors[<span class="hljs-number">0</span>]),
            <span class="hljs-comment"># Default metric: COSINE (can be changed with metric_type=&quot;COSINE&quot;)</span>
            auto_id=<span class="hljs-literal">True</span>,
        )
        <span class="hljs-comment"># Create an index to speed up retrieval (HNSW used here as an example)</span>
        client.create_index(
            collection_name=COLLECTION,
            field_name=<span class="hljs-string">&quot;vector&quot;</span>,
            index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
            metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
            params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">32</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
        )
    <span class="hljs-comment"># Insert data (skip if already exists; simple idempotent logic for the demo)</span>
    <span class="hljs-comment"># Generate embeddings</span>
    chunks = [d[<span class="hljs-string">&quot;chunk&quot;</span>] <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> DOCS]
    embedding_result = <span class="hljs-keyword">await</span> embedder.embed(chunks)
    vectors = embedding_result.vectors
    <span class="hljs-comment"># Check if the same doc_id already exists; this is for demo purposes only — real applications should use stricter deduplication</span>
    <span class="hljs-comment"># Here we insert directly. In production, use an upsert operation or an explicit primary key</span>
    client.insert(
        COLLECTION,
        data=[
            {<span class="hljs-string">&quot;vector&quot;</span>: vectors[i], <span class="hljs-string">&quot;doc_id&quot;</span>: DOCS[i][<span class="hljs-string">&quot;doc_id&quot;</span>], <span class="hljs-string">&quot;title&quot;</span>: DOCS[i][<span class="hljs-string">&quot;title&quot;</span>], <span class="hljs-string">&quot;chunk&quot;</span>: DOCS[i][<span class="hljs-string">&quot;chunk&quot;</span>]}
            <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(DOCS))
        ],
    )
    <span class="hljs-comment"># Load into memory</span>
    client.load_collection(COLLECTION)
<span class="hljs-comment"># 5) Define the vector search tool (Parlant Tool)</span>
<span class="hljs-meta">@p.tool</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">vector_search</span>(<span class="hljs-params">context: p.ToolContext, query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span>, min_score: <span class="hljs-built_in">float</span> = <span class="hljs-number">0.35</span></span>) -&gt; p.ToolResult:
    <span class="hljs-comment"># 5.1 Generate the query vector</span>
    embed_res = <span class="hljs-keyword">await</span> embedder.embed([query])
    qvec = embed_res.vectors[<span class="hljs-number">0</span>]
    <span class="hljs-comment"># 5.2 Search Milvus</span>
    results = client.search(
        collection_name=COLLECTION,
        data=[qvec],
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;doc_id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">128</span>}},
    )
    <span class="hljs-comment"># 5.3 Assemble structured evidence and filter by score threshold</span>
    hits = []
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
        score = hit[<span class="hljs-string">&quot;distance&quot;</span>] <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;distance&quot;</span> <span class="hljs-keyword">in</span> hit <span class="hljs-keyword">else</span> hit.get(<span class="hljs-string">&quot;score&quot;</span>, <span class="hljs-number">0.0</span>)
        <span class="hljs-keyword">if</span> score &gt;= min_score:
            hits.append({
                <span class="hljs-string">&quot;doc_id&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;doc_id&quot;</span>],
                <span class="hljs-string">&quot;title&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;title&quot;</span>],
                <span class="hljs-string">&quot;chunk&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;chunk&quot;</span>],
                <span class="hljs-string">&quot;score&quot;</span>: <span class="hljs-built_in">float</span>(score),
            })
    <span class="hljs-keyword">return</span> p.ToolResult({<span class="hljs-string">&quot;evidence&quot;</span>: hits})
<span class="hljs-comment"># 6) Run Parlant Server and create the Agent + Guidelines</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():
    <span class="hljs-keyword">await</span> ensure_collection_and_load()
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> p.Server() <span class="hljs-keyword">as</span> server:
        agent = <span class="hljs-keyword">await</span> server.create_agent(
            name=<span class="hljs-string">&quot;Policy Assistant&quot;</span>,
            description=<span class="hljs-string">&quot;Rule-controlled RAG assistant with Milvus Lite&quot;</span>,
        )
        <span class="hljs-comment"># Example variable: current time (can be used in templates or logs)</span>
<span class="hljs-meta">        @p.tool</span>
        <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">get_datetime</span>(<span class="hljs-params">context: p.ToolContext</span>) -&gt; p.ToolResult:
            <span class="hljs-keyword">from</span> datetime <span class="hljs-keyword">import</span> datetime
            <span class="hljs-keyword">return</span> p.ToolResult({<span class="hljs-string">&quot;now&quot;</span>: datetime.now().isoformat()})
        <span class="hljs-keyword">await</span> agent.create_variable(name=<span class="hljs-string">&quot;current-datetime&quot;</span>, tool=get_datetime)
        <span class="hljs-comment"># Core Guideline 1: Run vector search for factual or policy-related questions</span>
        <span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;User asks a factual question about policy, refund, exchange, or shipping&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Call vector_search with the user&#x27;s query. &quot;</span>
                <span class="hljs-string">&quot;If evidence is found, synthesize an answer by quoting key sentences and cite doc_id/title. &quot;</span>
                <span class="hljs-string">&quot;If evidence is insufficient, ask a clarifying question before answering.&quot;</span>
            ),
            tools=[vector_search],
        )
        <span class="hljs-comment"># Core Guideline 2: Use a standardized, structured response when evidence is available</span>
        <span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;Evidence is available&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Answer with the following template:\\n&quot;</span>
                <span class="hljs-string">&quot;Summary: provide a concise conclusion.\\n&quot;</span>
                <span class="hljs-string">&quot;Key points: 2-3 bullets distilled from evidence.\\n&quot;</span>
                <span class="hljs-string">&quot;Sources: list doc_id and title.\\n&quot;</span>
                <span class="hljs-string">&quot;Note: if confidence is low, state limitations and ask for clarification.&quot;</span>
            ),
            tools=[],
        )
        <span class="hljs-comment"># Hint: Local Playground URL</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Playground: &lt;http://localhost:8800&gt;&quot;</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    asyncio.run(main())
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Run-the-Code" class="common-anchor-header">Etapa 4: Executar o código</h3><pre><code translate="no"><span class="hljs-comment"># Run the main program</span>
python main.py
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/python_main_eb7d7c6d73.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ul>
<li>Visite o Playground:</li>
</ul>
<pre><code translate="no">&lt;<span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:8800&gt;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Agora já construiu com sucesso um sistema inteligente de perguntas e respostas usando Parlant e Milvus.</p>
<h2 id="Parlant-vs-LangChainLlamaIndex-How-They-Differ-and-How-They-Work-Together" class="common-anchor-header">Parlant vs. LangChain/LlamaIndex: Como eles se diferenciam e como trabalham juntos<button data-href="#Parlant-vs-LangChainLlamaIndex-How-They-Differ-and-How-They-Work-Together" class="anchor-icon" translate="no">
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
    </button></h2><p>Em comparação com as estruturas de agentes existentes, como <strong>LangChain</strong> ou <strong>LlamaIndex</strong>, como a Parlant se diferencia?</p>
<p>LangChain e LlamaIndex são frameworks de uso geral. Eles fornecem uma ampla gama de componentes e integrações, tornando-os ideais para prototipagem rápida e experiências de pesquisa. No entanto, quando se trata de implantação em produção, os desenvolvedores geralmente precisam construir camadas extras eles mesmos - como gerenciamento de regras, verificações de conformidade e mecanismos de confiabilidade - para manter os agentes consistentes e confiáveis.</p>
<p>Parlant oferece Gerenciamento de Diretrizes integrado, mecanismos de auto-crítica e ferramentas de explicabilidade que ajudam os desenvolvedores a gerenciar como um agente se comporta, responde e raciocina. Isso torna a Parlant especialmente adequada para casos de uso de alto risco e voltados para o cliente, nos quais a precisão e a responsabilidade são importantes, como finanças, saúde e serviços jurídicos.</p>
<p>Na verdade, esses frameworks podem trabalhar juntos:</p>
<ul>
<li><p>Use o LangChain para criar pipelines complexos de processamento de dados ou fluxos de trabalho de recuperação.</p></li>
<li><p>Utilize o Parlant para gerir a camada de interação final, garantindo que os resultados seguem as regras comerciais e permanecem interpretáveis.</p></li>
<li><p>Utilizar o Milvus como base de dados vetorial para fornecer pesquisa semântica em tempo real, memória e recuperação de conhecimentos em todo o sistema.</p></li>
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
    </button></h2><p>À medida que os agentes de LLM passam da experimentação para a produção, a questão-chave não é mais o que eles podem fazer, mas com que confiabilidade e segurança eles podem fazer isso. O Parlant fornece a estrutura e o controlo para essa fiabilidade, enquanto o Milvus fornece a infraestrutura vetorial escalável que mantém tudo rápido e consciente do contexto.</p>
<p>Juntos, eles permitem que os desenvolvedores criem agentes de IA que não são apenas capazes, mas confiáveis, explicáveis e prontos para a produção.</p>
<p>Confira<a href="https://github.com/emcie-co/parlant?utm_source=chatgpt.com"> o Parlant no GitHub</a> e integre-o ao<a href="https://milvus.io"> Milvus</a> para criar seu próprio sistema de agente inteligente e orientado por regras.</p>
<p>Tem perguntas ou quer um mergulho profundo em qualquer recurso? Junte-se ao nosso<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou registre problemas no<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Também pode reservar uma sessão individual de 20 minutos para obter informações, orientação e respostas às suas perguntas através do<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
