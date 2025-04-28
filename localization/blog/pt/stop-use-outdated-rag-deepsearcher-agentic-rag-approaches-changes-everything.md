---
id: >-
  stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md
title: 'Deixar de criar um RAG simples: abraçar o RAG agêntico com o DeepSearcher'
author: Cheney Zhang
date: 2025-03-23T00:00:00.000Z
cover: >-
  assets.zilliz.com/Stop_Using_Outdated_RAG_Deep_Searcher_s_Agentic_RAG_Approach_Changes_Everything_b2eaa644cf.png
tag: Engineering
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md
---
<h2 id="The-Shift-to-AI-Powered-Search-with-LLMs-and-Deep-Research" class="common-anchor-header">A mudança para a pesquisa baseada em IA com LLMs e pesquisa profunda<button data-href="#The-Shift-to-AI-Powered-Search-with-LLMs-and-Deep-Research" class="anchor-icon" translate="no">
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
    </button></h2><p>A evolução da tecnologia de pesquisa progrediu drasticamente ao longo das décadas - desde a recuperação baseada em palavras-chave nos anos anteriores a 2000 até às experiências de pesquisa personalizadas nos anos 2010. Estamos a testemunhar o surgimento de soluções alimentadas por IA capazes de lidar com consultas complexas que exigem uma análise profissional e aprofundada.</p>
<p>O Deep Research da OpenAI exemplifica essa mudança, usando recursos de raciocínio para sintetizar grandes quantidades de informações e gerar relatórios de pesquisa em várias etapas. Por exemplo, quando perguntado sobre "Qual é a capitalização de mercado razoável da Tesla?" a Deep Research pode analisar de forma abrangente as finanças corporativas, as trajetórias de crescimento dos negócios e as estimativas de valor de mercado.</p>
<p>O Deep Research implementa uma forma avançada da estrutura RAG (Retrieval-Augmented Generation) em seu núcleo. O RAG tradicional aprimora os resultados do modelo de linguagem recuperando e incorporando informações externas relevantes. A abordagem da OpenAI vai mais longe, implementando ciclos iterativos de recuperação e raciocínio. Em vez de uma única etapa de recuperação, o Deep Research gera dinamicamente várias consultas, avalia os resultados intermediários e refina sua estratégia de pesquisa - demonstrando como as técnicas RAG avançadas ou agênticas podem fornecer conteúdo de alta qualidade e de nível empresarial que se parece mais com pesquisa profissional do que com uma simples resposta a perguntas.</p>
<h2 id="DeepSearcher-A-Local-Deep-Research-Bringing-Agentic-RAG-to-Everyone" class="common-anchor-header">DeepSearcher: Uma pesquisa profunda local trazendo RAG agêntico para todos<button data-href="#DeepSearcher-A-Local-Deep-Research-Bringing-Agentic-RAG-to-Everyone" class="anchor-icon" translate="no">
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
    </button></h2><p>Inspirados por esses avanços, desenvolvedores de todo o mundo têm criado suas próprias implementações. Os engenheiros da Zilliz criaram e abriram o projeto <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>, que pode ser considerado uma pesquisa profunda local e de código aberto. Este projeto obteve mais de 4.900 estrelas no GitHub em menos de um mês.</p>
<p>O DeepSearcher redefine a pesquisa empresarial baseada em IA, combinando o poder de modelos de raciocínio avançados, recursos de pesquisa sofisticados e um assistente de pesquisa integrado. Integrando dados locais via <a href="https://milvus.io/docs/overview.md">Milvus</a> (um banco de dados vetorial de alto desempenho e de código aberto), o DeepSearcher oferece resultados mais rápidos e relevantes, permitindo que os usuários troquem facilmente os modelos principais para uma experiência personalizada.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_1_Deep_Searcher_s_star_history_9c1a064ed8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 1:</em> <em>Histórico de estrelas do DeepSearcher (</em><a href="https://www.star-history.com/#zilliztech/deep-searcher&amp;Date"><em>Fonte</em></a><em>)</em></p>
<p>Neste artigo, vamos explorar a evolução do RAG tradicional para o RAG Agêntico, explorando o que especificamente torna essas abordagens diferentes em um nível técnico. Em seguida, discutiremos a implementação do DeepSearcher, mostrando como ele aproveita os recursos de agente inteligente para permitir o raciocínio dinâmico e de várias voltas - e por que isso é importante para os desenvolvedores que criam soluções de pesquisa de nível empresarial.</p>
<h2 id="From-Traditional-RAG-to-Agentic-RAG-The-Power-of-Iterative-Reasoning" class="common-anchor-header">Do RAG tradicional ao RAG agêntico: o poder do raciocínio iterativo<button data-href="#From-Traditional-RAG-to-Agentic-RAG-The-Power-of-Iterative-Reasoning" class="anchor-icon" translate="no">
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
    </button></h2><p>O Agentic RAG aprimora a estrutura tradicional do RAG incorporando recursos de agente inteligente. O DeepSearcher é um excelente exemplo de uma estrutura RAG agêntica. Através do planeamento dinâmico, do raciocínio em várias etapas e da tomada de decisões autónoma, estabelece um processo de ciclo fechado que recupera, processa, valida e optimiza dados para resolver problemas complexos.</p>
<p>A crescente popularidade das RAG agénticas é impulsionada por avanços significativos nas capacidades de raciocínio dos modelos de linguagem de grande dimensão (LLM), em particular a sua capacidade melhorada de decompor problemas complexos e manter cadeias de pensamento coerentes em várias etapas.</p>
<table>
<thead>
<tr><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Dimensão de comparação</strong></td><td><strong>RAG tradicional</strong></td><td><strong>RAG Autêntico</strong></td></tr>
<tr><td>Abordagem principal</td><td>Passiva e reactiva</td><td>Proactiva e orientada para os agentes</td></tr>
<tr><td>Fluxo do processo</td><td>Recuperação e geração numa única etapa (processo único)</td><td>Recuperação e geração dinâmicas e em várias etapas (refinamento iterativo)</td></tr>
<tr><td>Estratégia de recuperação</td><td>Pesquisa por palavra-chave fixa, dependente da consulta inicial</td><td>Recuperação adaptativa (por exemplo, refinamento de palavras-chave, mudança de fonte de dados)</td></tr>
<tr><td>Tratamento de consultas complexas</td><td>Geração direta; propensa a erros com dados contraditórios</td><td>Decomposição de tarefas → recuperação orientada → síntese de respostas</td></tr>
<tr><td>Capacidade de interação</td><td>Depende inteiramente da entrada do utilizador; sem autonomia</td><td>Envolvimento proactivo (por exemplo, esclarecimento de ambiguidades, pedido de detalhes)</td></tr>
<tr><td>Correção de erros e feedback</td><td>Sem auto-correção; limitada pelos resultados iniciais</td><td>Validação iterativa → recuperação auto-desencadeada para obter precisão</td></tr>
<tr><td>Casos de utilização ideais</td><td>Perguntas e respostas simples, pesquisa de factos</td><td>Raciocínio complexo, resolução de problemas em várias fases, tarefas abertas</td></tr>
<tr><td>Exemplo</td><td>O utilizador pergunta: "O que é a computação quântica?" → O sistema devolve uma definição de livro didático</td><td>O utilizador pergunta: "Como pode a computação quântica otimizar a logística?" → O sistema recupera os princípios quânticos e os algoritmos logísticos e, em seguida, sintetiza as ideias acionáveis</td></tr>
</tbody>
</table>
<p>Ao contrário do RAG tradicional, que se baseia numa única recuperação baseada numa consulta, o RAG agêntico divide uma consulta em várias subperguntas e refina iterativamente a sua pesquisa até obter uma resposta satisfatória. Esta evolução oferece três benefícios principais:</p>
<ul>
<li><p><strong>Resolução proactiva de problemas:</strong> O sistema passa de uma reação passiva para uma resolução ativa de problemas.</p></li>
<li><p><strong>Recuperação dinâmica e multi-turnos:</strong> Em vez de efetuar uma pesquisa única, o sistema ajusta continuamente as suas consultas e autocorrige-se com base no feedback contínuo.</p></li>
<li><p><strong>Aplicabilidade mais alargada:</strong> O sistema vai além da verificação básica de factos para lidar com tarefas de raciocínio complexas e gerar relatórios abrangentes.</p></li>
</ul>
<p>Ao tirar partido destas capacidades, as aplicações Agentic RAG, como o DeepSearcher, funcionam de forma muito semelhante a um perito humano - fornecendo não só a resposta final, mas também uma análise completa e transparente do seu processo de raciocínio e detalhes de execução.</p>
<p>A longo prazo, o Agentic RAG deverá ultrapassar os sistemas RAG de base. As abordagens convencionais têm muitas vezes dificuldade em lidar com a lógica subjacente às consultas dos utilizadores, que requerem raciocínio iterativo, reflexão e otimização contínua.</p>
<h2 id="What-Does-an-Agentic-RAG-Architecture-Look-Like-DeepSearcher-as-an-Example" class="common-anchor-header">Como é uma arquitetura RAG agêntica? O DeepSearcher como exemplo<button data-href="#What-Does-an-Agentic-RAG-Architecture-Look-Like-DeepSearcher-as-an-Example" class="anchor-icon" translate="no">
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
    </button></h2><p>Agora que entendemos o poder dos sistemas RAG agênticos, como é a arquitetura deles? Vamos usar o DeepSearcher como exemplo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_2_Two_Modules_Within_Deep_Searcher_baf5ca5952.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 2: Dois módulos do DeepSearcher</em></p>
<p>A arquitetura do DeepSearcher consiste em dois módulos principais:</p>
<h3 id="1-Data-Ingestion-Module" class="common-anchor-header">1. Módulo de ingestão de dados</h3><p>Este módulo conecta várias fontes de dados proprietárias de terceiros através de um banco de dados vetorial Milvus. Ele é especialmente valioso para ambientes corporativos que dependem de conjuntos de dados proprietários. O módulo lida com:</p>
<ul>
<li><p>Análise e fragmentação de documentos</p></li>
<li><p>Geração de embedding</p></li>
<li><p>Armazenamento e indexação de vectores</p></li>
<li><p>Gestão de metadados para uma recuperação eficiente</p></li>
</ul>
<h3 id="2-Online-Reasoning-and-Query-Module" class="common-anchor-header">2. Módulo de raciocínio e consulta em linha</h3><p>Este componente implementa diversas estratégias de agente no âmbito da estrutura RAG para fornecer respostas precisas e perspicazes. Funciona num ciclo dinâmico e iterativo - após cada recuperação de dados, o sistema reflecte sobre se a informação acumulada responde suficientemente à consulta original. Em caso negativo, é acionada outra iteração; em caso afirmativo, é gerado o relatório final.</p>
<p>Este ciclo contínuo de "acompanhamento" e "reflexão" representa uma melhoria fundamental em relação a outras abordagens básicas de RAG. Enquanto o RAG tradicional executa um processo de recuperação e geração de uma única vez, a abordagem iterativa do DeepSearcher espelha como os pesquisadores humanos trabalham - fazendo perguntas iniciais, avaliando as informações recebidas, identificando lacunas e buscando novas linhas de investigação.</p>
<h2 id="How-Effective-is-DeepSearcher-and-What-Use-Cases-is-It-Best-Suited-For" class="common-anchor-header">Quão eficaz é o DeepSearcher e para quais casos de uso ele é mais adequado?<button data-href="#How-Effective-is-DeepSearcher-and-What-Use-Cases-is-It-Best-Suited-For" class="anchor-icon" translate="no">
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
    </button></h2><p>Uma vez instalado e configurado, o DeepSearcher indexa seus arquivos locais através do banco de dados de vetores Milvus. Quando você envia uma consulta, ele realiza uma pesquisa abrangente e aprofundada desse conteúdo indexado. Uma vantagem importante para os desenvolvedores é que o sistema registra cada etapa de seu processo de pesquisa e raciocínio, fornecendo transparência sobre como ele chegou às suas conclusões - um recurso crítico para depuração e otimização de sistemas RAG.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_3_Accelerated_Playback_of_Deep_Searcher_Iteration_0c36baea2f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 3: Reprodução acelerada da iteração do DeepSearcher</em></p>
<p>Essa abordagem consome mais recursos computacionais do que o RAG tradicional, mas fornece melhores resultados para consultas complexas. Vamos discutir dois casos de uso específicos para os quais o DeepSearcher é mais adequado.</p>
<h3 id="1-Overview-Type-Queries" class="common-anchor-header">1. Consultas do tipo visão geral</h3><p>As consultas do tipo visão geral - como gerar relatórios, redigir documentos ou resumir tendências - fornecem um tópico breve, mas exigem um resultado exaustivo e detalhado.</p>
<p>Por exemplo, ao consultar &quot;Como Os Simpsons mudaram ao longo do tempo?&quot;, o DeepSearcher primeiro gera um conjunto inicial de subconsultas:</p>
<pre><code translate="no">_Break down the original query <span class="hljs-keyword">into</span> <span class="hljs-keyword">new</span> sub queries: [_

_<span class="hljs-string">&#x27;How has the cultural impact and societal relevance of The Simpsons evolved from its debut to the present?&#x27;</span>,_

_<span class="hljs-string">&#x27;What changes in character development, humor, and storytelling styles have occurred across different seasons of The Simpsons?&#x27;</span>,_

_<span class="hljs-string">&#x27;How has the animation style and production technology of The Simpsons changed over time?&#x27;</span>,_

_<span class="hljs-string">&#x27;How have audience demographics, reception, and ratings of The Simpsons shifted throughout its run?&#x27;</span>]_
<button class="copy-code-btn"></button></code></pre>
<p>Ele recupera informações relevantes e, em seguida, itera com feedback para refinar sua pesquisa, gerando as próximas subconsultas:</p>
<pre><code translate="no">_New search queries <span class="hljs-keyword">for</span> <span class="hljs-built_in">next</span> iteration: [_

_<span class="hljs-string">&quot;How have changes in The Simpsons&#x27; voice cast and production team influenced the show&#x27;s evolution over different seasons?&quot;</span>,_

_<span class="hljs-string">&quot;What role has The Simpsons&#x27; satire and social commentary played in its adaptation to contemporary issues across decades?&quot;</span>,_

_<span class="hljs-string">&#x27;How has The Simpsons addressed and incorporated shifts in media consumption, such as streaming services, into its distribution and content strategies?&#x27;</span>]_
<button class="copy-code-btn"></button></code></pre>
<p>Cada iteração baseia-se na anterior, culminando num relatório abrangente que cobre várias facetas do assunto, estruturado com secções como:</p>
<pre><code translate="no">**<span class="hljs-title class_">Report</span>: <span class="hljs-title class_">The</span> <span class="hljs-title class_">Evolution</span> <span class="hljs-keyword">of</span> _The <span class="hljs-title class_">Simpsons</span>_ (<span class="hljs-number">1989</span>–<span class="hljs-title class_">Present</span>)**
**<span class="hljs-number">1.</span> <span class="hljs-title class_">Cultural</span> <span class="hljs-title class_">Impact</span> and <span class="hljs-title class_">Societal</span> <span class="hljs-title class_">Relevance</span>** 
_The <span class="hljs-title class_">Simpsons</span>_ debuted <span class="hljs-keyword">as</span> a subversive critique <span class="hljs-keyword">of</span> <span class="hljs-title class_">American</span> middle-<span class="hljs-keyword">class</span> <span class="hljs-title class_">life</span>, gaining notoriety <span class="hljs-keyword">for</span> its bold satire <span class="hljs-keyword">in</span> the 1990s. <span class="hljs-title class_">Initially</span> a countercultural phenomenon, it challenged norms <span class="hljs-keyword">with</span> episodes tackling religion, politics, and consumerism. <span class="hljs-title class_">Over</span> time, its cultural dominance waned <span class="hljs-keyword">as</span> competitors like _South <span class="hljs-title class_">Park</span>_ and _Family <span class="hljs-title class_">Guy</span>_ pushed boundaries further. <span class="hljs-title class_">By</span> the 2010s, the show transitioned <span class="hljs-keyword">from</span> trendsetter to nostalgic institution, balancing legacy appeal <span class="hljs-keyword">with</span> attempts to address modern issues like climate change and <span class="hljs-variable constant_">LGBTQ</span>+ rights, albeit <span class="hljs-keyword">with</span> less societal resonance.
**<span class="hljs-number">2.</span> <span class="hljs-title class_">Character</span> <span class="hljs-title class_">Development</span> and <span class="hljs-title class_">Storytelling</span> <span class="hljs-title class_">Shifts</span>** 
<span class="hljs-title class_">Early</span> seasons featured nuanced character <span class="hljs-title function_">arcs</span> (e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Lisa</span>’s activism, <span class="hljs-title class_">Marge</span>’s resilience), but later seasons saw <span class="hljs-string">&quot;Flanderization&quot;</span> (exaggerating traits, e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Homer</span>’s stupidity, <span class="hljs-title class_">Ned</span> <span class="hljs-title class_">Flanders</span>’ piety). <span class="hljs-title class_">Humor</span> evolved <span class="hljs-keyword">from</span> witty, character-driven satire to reliance on pop culture references and meta-humor. <span class="hljs-title class_">Serialized</span> storytelling <span class="hljs-keyword">in</span> early episodes gave way to episodic, gag-focused plots, often sacrificing emotional depth <span class="hljs-keyword">for</span> absurdity.
[...]
**<span class="hljs-number">12.</span> <span class="hljs-title class_">Merchandising</span> and <span class="hljs-title class_">Global</span> <span class="hljs-title class_">Reach</span>** 
<span class="hljs-title class_">The</span> 1990s merchandise <span class="hljs-title function_">boom</span> (action figures, _Simpsons_-themed cereals) faded, but the franchise persists via <span class="hljs-title function_">collaborations</span> (e.<span class="hljs-property">g</span>., _Fortnite_ skins, <span class="hljs-title class_">Lego</span> sets). <span class="hljs-title class_">International</span> adaptations include localized dubbing and culturally tailored <span class="hljs-title function_">episodes</span> (e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Japanese</span> _Itchy &amp; <span class="hljs-title class_">Scratchy</span>_ variants).
**<span class="hljs-title class_">Conclusion</span>** 
_The <span class="hljs-title class_">Simpsons</span>_ evolved <span class="hljs-keyword">from</span> a radical satire to a television institution, navigating shifts <span class="hljs-keyword">in</span> technology, politics, and audience expectations. <span class="hljs-title class_">While</span> its golden-age brilliance remains unmatched, its adaptability—through streaming, updated humor, and <span class="hljs-variable language_">global</span> outreach—secures its place <span class="hljs-keyword">as</span> a cultural touchstone. <span class="hljs-title class_">The</span> show’s longevity reflects both nostalgia and a pragmatic embrace <span class="hljs-keyword">of</span> change, even <span class="hljs-keyword">as</span> it grapples <span class="hljs-keyword">with</span> the challenges <span class="hljs-keyword">of</span> relevance <span class="hljs-keyword">in</span> a fragmented media landscape.
<button class="copy-code-btn"></button></code></pre>
<p><em>(Por uma questão de brevidade, apenas são apresentados excertos do processo e do relatório final)</em></p>
<p>O relatório final apresenta uma análise exaustiva com citações corretas e uma organização estruturada.</p>
<h3 id="2-Complex-Reasoning-Queries" class="common-anchor-header">2. Consultas de raciocínio complexas</h3><p>As consultas complexas envolvem várias camadas de lógica e entidades interligadas.</p>
<p>Considere a pergunta: "Que filme tem um realizador mais velho, God's Gift To Women ou Aldri annet enn bråk?"</p>
<p>Embora isto possa parecer simples para um humano, os sistemas RAG simples têm dificuldades porque a resposta não está armazenada diretamente na base de conhecimentos. O DeepSearcher resolve este desafio decompondo a consulta em sub-perguntas mais pequenas:</p>
<pre><code translate="no">[<span class="hljs-string">&quot;Who is the director of God&#x27;S Gift To Women?&quot;</span>, <span class="hljs-string">&#x27;Who is the director of Aldri annet enn bråk?&#x27;</span>, <span class="hljs-string">&#x27;What are the ages of the respective directors?&#x27;</span>, <span class="hljs-string">&#x27;Which director is older?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Primeiro, recupera informações sobre os realizadores de ambos os filmes,</p>
<pre><code translate="no">The director of <span class="hljs-string">&quot;God&#x27;s Gift To Women&quot;</span> <span class="hljs-keyword">is</span> Michael Curtiz, the director of <span class="hljs-string">&quot;Aldri annet enn bråk&quot;</span> <span class="hljs-keyword">is</span> Edith Carlmar
<button class="copy-code-btn"></button></code></pre>
<p>depois gera subconsultas:</p>
<pre><code translate="no">[<span class="hljs-string">&quot;Find the birthdate of Michael Curtiz, the director of God&#x27;s Gift To Women&quot;</span>, <span class="hljs-string">&#x27;Find the birthdate of Edith Carlmar, the director of Aldri annet enn bråk&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>e depois extrai as suas datas de nascimento e, por fim, compara-as para determinar a resposta correta:</p>
<pre><code translate="no">The director of <span class="hljs-string">&quot;God&#x27;s Gift To Women&quot;</span> <span class="hljs-keyword">is</span> Michael Curtiz, who was born <span class="hljs-keyword">on</span> December <span class="hljs-number">24</span>, <span class="hljs-number">1886</span> <span class="hljs-keyword">and</span> passed away <span class="hljs-keyword">on</span> April <span class="hljs-number">11</span>, <span class="hljs-number">1962.</span> He was a Hungarian-born American film director known <span class="hljs-keyword">for</span> his prolific career <span class="hljs-keyword">in</span> Hollywood.
On the other hand, the director of <span class="hljs-string">&quot;Aldri annet enn bråk&quot;</span> <span class="hljs-keyword">is</span> Edith Carlmar, who was born <span class="hljs-keyword">on</span> November <span class="hljs-number">15</span>, <span class="hljs-number">1911</span> <span class="hljs-keyword">and</span> passed away <span class="hljs-keyword">on</span> May <span class="hljs-number">17</span>, <span class="hljs-number">2003.</span>
Therefore, Michael Curtiz <span class="hljs-keyword">is</span> older than Edith Carlmar.
<button class="copy-code-btn"></button></code></pre>
<p>Em contraste, um sistema RAG convencional pode perder detalhes importantes devido à recuperação limitada numa única passagem, resultando potencialmente em respostas <a href="https://zilliz.com/blog/decoding-llm-hallucinations-deep-dive-into-llm-errors">alucinadas</a> ou imprecisas:</p>
<pre><code translate="no"><span class="hljs-number">1.</span> **Aldri annet enn bråk** (<span class="hljs-number">1954</span>) <span class="hljs-keyword">is</span> directed <span class="hljs-keyword">by</span> **Edith Carlmar**, who was born <span class="hljs-keyword">on</span> November <span class="hljs-number">15</span>, <span class="hljs-number">1911.</span>
<span class="hljs-number">2.</span> The related chunks did <span class="hljs-keyword">not</span> provide specific details about the director of <span class="hljs-string">&quot;God&#x27;s Gift to Women.&quot;</span> However, <span class="hljs-keyword">if</span> we look at external sources <span class="hljs-keyword">for</span> <span class="hljs-string">&quot;God&#x27;s Gift to Women,&quot;</span> the film was directed <span class="hljs-keyword">by</span> **L. M. (Lyman) Steinberg**, who was born <span class="hljs-keyword">on</span> December <span class="hljs-number">19</span>, <span class="hljs-number">1905.</span>
By comparing their birth dates:
- Edith Carlmar: November <span class="hljs-number">15</span>, <span class="hljs-number">1911</span>
- L. M. Steinberg: December <span class="hljs-number">19</span>, <span class="hljs-number">1905</span>
**Conclusion**: L. M. Steinberg, the director of <span class="hljs-string">&quot;God&#x27;s Gift to Women,&quot;</span> <span class="hljs-keyword">is</span> older than Edith Carlmar, the director of <span class="hljs-string">&quot;Aldri annet enn bråk.&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>O DeepSearcher destaca-se pela realização de pesquisas profundas e iterativas em dados locais importados. Regista cada passo do seu processo de raciocínio e, por fim, fornece um relatório abrangente e unificado. Isso o torna particularmente eficaz para consultas do tipo visão geral - como gerar relatórios detalhados ou resumir tendências - e para consultas de raciocínio complexas que exigem a divisão de uma pergunta em subperguntas menores e a agregação de dados por meio de vários loops de feedback.</p>
<p>Na próxima seção, compararemos o DeepSearcher com outros sistemas RAG, explorando como sua abordagem iterativa e a integração flexível de modelos se comparam aos métodos tradicionais.</p>
<h2 id="Quantitative-Comparison-DeepSearcher-vs-Traditional-RAG" class="common-anchor-header">Comparação quantitativa: DeepSearcher vs. RAG tradicional<button data-href="#Quantitative-Comparison-DeepSearcher-vs-Traditional-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>No repositório do DeepSearcher no GitHub, disponibilizamos o código para testes quantitativos. Para esta análise, usamos o popular conjunto de dados 2WikiMultiHopQA. (Observação: avaliamos apenas as primeiras 50 entradas para gerenciar o consumo de token da API, mas as tendências gerais permanecem claras).</p>
<h3 id="Recall-Rate-Comparison" class="common-anchor-header">Comparação da taxa de recuperação</h3><p>Conforme mostrado na Figura 4, a taxa de recuperação melhora significativamente à medida que o número de iterações máximas aumenta:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_4_Max_Iterations_vs_Recall_18a8d6e9bf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 4: Iterações máximas vs. Recuperação</em></p>
<p>Depois de um certo ponto, as melhorias marginais diminuem - portanto, normalmente definimos o padrão para 3 iterações, embora isso possa ser ajustado com base em necessidades específicas.</p>
<h3 id="Token-Consumption-Analysis" class="common-anchor-header">Análise do consumo de tokens</h3><p>Também medimos o uso total de tokens para 50 consultas em diferentes contagens de iteração:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_5_Max_Iterations_vs_Token_Usage_6d1d44b114.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 5: Iterações máximas vs. uso de token</em></p>
<p>Os resultados mostram que o consumo de tokens aumenta linearmente com mais iterações. Por exemplo, com 4 iterações, o DeepSearcher consome cerca de 0,3 milhão de tokens. Usando uma estimativa aproximada com base no preço gpt-4o-mini da OpenAI de <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0,</mn><mi>60/1Moutputtokens</mi><mo separator="true">,</mo><mi>o que equivale a um custo</mi></mrow><annotation encoding="application/x-tex">médio</annotation><mrow><mi>de cerca de</mi><mi>0</mi></mrow><annotation encoding="application/x-tex">,60/1M de tokens de saída, isso equivale a um custo médio de cerca de</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,</span><span class="mord mathnormal">60/1Moutputtokens</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">o que equivale a um custo médio</span><span class="mord mathnormal">de</span><span class="mord mathnormal">cerca de 0</span></span></span></span>,0036 por consulta (ou cerca de US$ 0,18 para 50 consultas).</p>
<p>Para modelos de inferência com recursos mais intensivos, os custos seriam várias vezes superiores devido ao preço mais elevado por token e a saídas de token maiores.</p>
<h3 id="Model-Performance-Comparison" class="common-anchor-header">Comparação de desempenho do modelo</h3><p>Uma vantagem significativa do DeepSearcher é sua flexibilidade em alternar entre diferentes modelos. Testamos vários modelos de inferência e modelos de não-inferência (como gpt-4o-mini). No geral, os modelos de inferência - especialmente o Claude 3.7 Sonnet - tenderam a ter o melhor desempenho, embora as diferenças não tenham sido dramáticas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_6_Average_Recall_by_Model_153c93f616.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 6: Recuperação média por modelo</em></p>
<p>Notavelmente, alguns modelos menores de não-inferência às vezes não conseguiam concluir o processo completo de consulta do agente devido à sua capacidade limitada de seguir instruções - um desafio comum para muitos desenvolvedores que trabalham com sistemas semelhantes.</p>
<h2 id="DeepSearcher-Agentic-RAG-vs-Graph-RAG" class="common-anchor-header">DeepSearcher (Agentic RAG) vs. Graph RAG<button data-href="#DeepSearcher-Agentic-RAG-vs-Graph-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/blog/graphrag-explained-enhance-rag-with-knowledge-graphs">O Graph RAG</a> também é capaz de lidar com consultas complexas, particularmente consultas multi-hop. Então, qual é a diferença entre o DeepSearcher (Agentic RAG) e o Graph RAG?</p>
<p>O Graph RAG foi concebido para consultar documentos com base em ligações relacionais explícitas, o que o torna particularmente forte em consultas multi-hop. Por exemplo, ao processar um romance longo, o Graph RAG pode extrair com precisão as relações intrincadas entre os personagens. No entanto, esse método requer o uso substancial de tokens durante a importação de dados para mapear esses relacionamentos, e seu modo de consulta tende a ser rígido - normalmente eficaz apenas para consultas de relacionamento único.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_7_Graph_RAG_vs_Deep_Searcher_a5c7130374.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 7: Graph RAG vs. DeepSearcher</em></p>
<p>Em contraste, o Agentic RAG - como exemplificado pelo DeepSearcher - adota uma abordagem fundamentalmente diferente. Ele minimiza o consumo de tokens durante a importação de dados e, em vez disso, investe recursos computacionais durante o processamento da consulta. Esta escolha de design cria importantes compensações técnicas:</p>
<ol>
<li><p>Custos iniciais mais baixos: O DeepSearcher requer menos pré-processamento de documentos, tornando a configuração inicial mais rápida e menos cara</p></li>
<li><p>Tratamento dinâmico de consultas: O sistema pode ajustar a sua estratégia de recuperação em tempo real com base em descobertas intermédias</p></li>
<li><p>Custos mais altos por consulta: Cada consulta requer mais computação do que o Graph RAG, mas fornece resultados mais flexíveis</p></li>
</ol>
<p>Para os programadores, esta distinção é crucial na conceção de sistemas com diferentes padrões de utilização. O Graph RAG pode ser mais eficiente para aplicativos com padrões de consulta previsíveis e alto volume de consultas, enquanto a abordagem do DeepSearcher se sobressai em cenários que exigem flexibilidade e lidam com consultas complexas e imprevisíveis.</p>
<p>Olhando para o futuro, à medida que o custo dos LLMs diminui e o desempenho da inferência continua a melhorar, é provável que os sistemas Agentic RAG, como o DeepSearcher, se tornem mais predominantes. A desvantagem do custo computacional diminuirá, enquanto a vantagem da flexibilidade permanecerá.</p>
<h2 id="DeepSearcher-vs-Deep-Research" class="common-anchor-header">DeepSearcher vs. Deep Research<button data-href="#DeepSearcher-vs-Deep-Research" class="anchor-icon" translate="no">
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
    </button></h2><p>Ao contrário do Deep Research da OpenAI, o DeepSearcher é especificamente adaptado para a recuperação e análise profunda de dados privados. Ao aproveitar um banco de dados vetorial, o DeepSearcher pode ingerir diversas fontes de dados, integrar vários tipos de dados e armazená-los uniformemente em um repositório de conhecimento baseado em vetor. As suas capacidades robustas de pesquisa semântica permitem-lhe pesquisar eficientemente através de grandes quantidades de dados offline.</p>
<p>Além disso, o DeepSearcher é totalmente de código aberto. Embora o Deep Research continue a ser um líder em qualidade de geração de conteúdo, tem uma taxa mensal e funciona como um produto de código fechado, o que significa que os seus processos internos estão escondidos dos utilizadores. Em contraste, o DeepSearcher oferece total transparência - os usuários podem examinar o código, personalizá-lo para atender às suas necessidades ou até mesmo implantá-lo em seus próprios ambientes de produção.</p>
<h2 id="Technical-Insights" class="common-anchor-header">Insights técnicos<button data-href="#Technical-Insights" class="anchor-icon" translate="no">
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
    </button></h2><p>Ao longo do desenvolvimento e das iterações subsequentes do DeepSearcher, reunimos vários insights técnicos importantes:</p>
<h3 id="Inference-Models-Effective-but-Not-Infallible" class="common-anchor-header">Modelos de inferência: Eficazes, mas não infalíveis</h3><p>Nossos experimentos revelam que, embora os modelos de inferência tenham um bom desempenho como agentes, eles às vezes analisam demais instruções simples, levando a um consumo excessivo de tokens e a tempos de resposta mais lentos. Esta observação alinha-se com a abordagem dos principais fornecedores de IA, como a OpenAI, que já não distinguem entre modelos de inferência e não-inferência. Em vez disso, os serviços de modelo devem determinar automaticamente a necessidade de inferência com base em requisitos específicos para conservar tokens.</p>
<h3 id="The-Imminent-Rise-of-Agentic-RAG" class="common-anchor-header">A ascensão iminente do RAG autêntico</h3><p>Do ponto de vista da procura, a geração de conteúdos profundos é essencial; tecnicamente, o aumento da eficácia do RAG também é crucial. A longo prazo, o custo é o principal obstáculo à adoção generalizada das RAG autênticas. No entanto, com o aparecimento de LLMs económicos e de alta qualidade como o DeepSeek-R1 e as reduções de custos impulsionadas pela Lei de Moore, espera-se que as despesas associadas aos serviços de inferência diminuam.</p>
<h3 id="The-Hidden-Scaling-Limit-of-Agentic-RAG" class="common-anchor-header">O limite de escala oculto do RAG autêntico</h3><p>Uma descoberta crítica da nossa pesquisa diz respeito à relação entre desempenho e recursos computacionais. Inicialmente, supusemos que o simples aumento do número de iterações e da alocação de tokens melhoraria proporcionalmente os resultados de consultas complexas.</p>
<p>As nossas experiências revelaram uma realidade mais matizada: embora o desempenho melhore com iterações adicionais, observámos uma clara diminuição dos resultados. Especificamente:</p>
<ul>
<li><p>O desempenho aumentou acentuadamente de 1 a 3 iterações</p></li>
<li><p>As melhorias de 3 a 5 iterações foram modestas</p></li>
<li><p>Para além das 5 iterações, os ganhos foram insignificantes, apesar dos aumentos significativos no consumo de tokens</p></li>
</ul>
<p>Esta constatação tem implicações importantes para os programadores: a simples atribuição de mais recursos computacionais aos sistemas RAG não é a abordagem mais eficiente. A qualidade da estratégia de recuperação, a lógica de decomposição e o processo de síntese são muitas vezes mais importantes do que a contagem de iterações em bruto. Isto sugere que os programadores devem concentrar-se na otimização destes componentes, em vez de se limitarem a aumentar os orçamentos dos tokens.</p>
<h3 id="The-Evolution-Beyond-Traditional-RAG" class="common-anchor-header">A evolução para além do RAG tradicional</h3><p>O RAG tradicional oferece uma eficiência valiosa com a sua abordagem de baixo custo e de recuperação única, tornando-o adequado para cenários simples de resposta a perguntas. No entanto, as suas limitações tornam-se evidentes quando se trata de consultas com uma lógica implícita complexa.</p>
<p>Considere-se uma consulta do utilizador do tipo "Como ganhar 100 milhões num ano". Um sistema RAG tradicional poderia obter conteúdos sobre carreiras com salários elevados ou estratégias de investimento, mas teria dificuldade em</p>
<ol>
<li><p>Identificar expectativas irrealistas na consulta</p></li>
<li><p>Dividir o problema em sub-objectivos viáveis</p></li>
<li><p>Sintetizar informações de vários domínios (negócios, finanças, empreendedorismo)</p></li>
<li><p>Apresentar uma abordagem estruturada e multi-caminhos com prazos realistas</p></li>
</ol>
<p>É aqui que os sistemas Agentic RAG, como o DeepSearcher, mostram a sua força. Ao decomporem consultas complexas e ao aplicarem o raciocínio em várias etapas, podem fornecer respostas matizadas e abrangentes que respondem melhor às necessidades de informação subjacentes do utilizador. À medida que estes sistemas se tornam mais eficientes, esperamos ver a sua adoção acelerada nas aplicações empresariais.</p>
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
    </button></h2><p>O DeepSearcher representa uma evolução significativa na conceção de sistemas RAG, oferecendo aos programadores uma estrutura poderosa para a criação de capacidades de pesquisa e investigação mais sofisticadas. As suas principais vantagens técnicas incluem:</p>
<ol>
<li><p>Raciocínio iterativo: A capacidade de dividir consultas complexas em subetapas lógicas e construir progressivamente respostas abrangentes</p></li>
<li><p>Arquitetura flexível: Suporte para troca de modelos subjacentes e personalização do processo de raciocínio para atender às necessidades específicas da aplicação</p></li>
<li><p>Integração da base de dados Vetor: Ligação perfeita a Milvus para um armazenamento e recuperação eficientes de incorporação de vectores a partir de fontes de dados privadas</p></li>
<li><p>Execução transparente: Registro detalhado de cada etapa de raciocínio, permitindo que os desenvolvedores depurem e otimizem o comportamento do sistema</p></li>
</ol>
<p>Nossos testes de desempenho confirmam que o DeepSearcher fornece resultados superiores para consultas complexas em comparação com as abordagens RAG tradicionais, embora com compensações claras na eficiência computacional. A configuração ideal (normalmente em torno de 3 iterações) equilibra precisão e consumo de recursos.</p>
<p>À medida que os custos de LLM continuam a diminuir e as capacidades de raciocínio melhoram, a abordagem Agentic RAG implementada no DeepSearcher tornar-se-á cada vez mais prática para aplicações de produção. Para os programadores que trabalham em pesquisa empresarial, assistentes de pesquisa ou sistemas de gestão do conhecimento, o DeepSearcher oferece uma poderosa base de código aberto que pode ser personalizada para requisitos de domínio específicos.</p>
<p>Agradecemos as contribuições da comunidade de programadores e convidamo-lo a explorar este novo paradigma na implementação de RAG, consultando o nosso <a href="https://github.com/zilliztech/deep-searcher">repositório GitHub</a>.</p>
