---
id: harness-engineering-ai-agents.md
title: >-
  Engenharia de aproveitamento: A camada de execução de que os agentes de IA
  realmente precisam
author: Min Yin
date: 2026-4-9
cover: assets.zilliz.com/05842e3a_b21b_41c9_9d29_13b8d7afa211_428ab449a7.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  harness engineering, AI agent infrastructure, hybrid search, Milvus 2.6,
  Sparse-BM25
meta_title: |
  What Is Harness Engineering for AI Agents? | Milvus
desc: >-
  A Harness Engineering cria o ambiente de execução em torno de agentes de IA
  autónomos. Saiba o que é, como é que a OpenAI o utilizou e porque é que requer
  uma pesquisa híbrida.
origin: 'https://milvus.io/blog/harness-engineering-ai-agents.md'
---
<p>Mitchell Hashimoto construiu a HashiCorp e co-criou a Terraform. Em fevereiro de 2026, publicou uma <a href="https://mitchellh.com/writing/my-ai-adoption-journey">publicação no seu blogue</a> em que descrevia um hábito que tinha desenvolvido enquanto trabalhava com agentes de IA: sempre que um agente cometia um erro, criava uma correção permanente no ambiente do agente. Chamou-lhe "engenharia do arnês". Em poucas semanas, <a href="https://openai.com/index/harness-engineering/">a OpenAI</a> e <a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">a Anthropic</a> publicaram artigos de engenharia que expandiam a ideia. O termo " <em>engenharia do arnês</em> " tinha chegado.</p>
<p>A expressão teve eco porque dá nome a um problema que todos os engenheiros que constroem <a href="https://zilliz.com/glossary/ai-agents">agentes de IA</a> já enfrentaram. <a href="https://zilliz.com/glossary/prompt-as-code-(prompt-engineering)">A engenharia imediata</a> permite obter melhores resultados numa única volta. A engenharia de contexto gere o que o modelo vê. Mas nenhuma delas aborda o que acontece quando um agente funciona de forma autónoma durante horas, tomando centenas de decisões sem supervisão. É essa a lacuna que a engenharia de aproveitamento preenche - e quase sempre depende da pesquisa híbrida (pesquisa híbrida de texto integral e semântica) para funcionar.</p>
<h2 id="What-Is-Harness-Engineering" class="common-anchor-header">O que é a engenharia de arreios?<button data-href="#What-Is-Harness-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>A engenharia de equipamentos é a disciplina que consiste em conceber o ambiente de execução em torno de um agente de IA autónomo. Define as ferramentas que o agente pode chamar, onde obtém informações, como valida as suas próprias decisões e quando deve parar.</p>
<p>Para compreender a sua importância, considere três camadas de desenvolvimento de agentes de IA:</p>
<table>
<thead>
<tr><th>Camada</th><th>O que optimiza</th><th>Âmbito</th><th>Exemplo</th></tr>
</thead>
<tbody>
<tr><td><strong>Engenharia de pedidos</strong></td><td>O que se diz ao modelo</td><td>Troca única</td><td>Poucos exemplos, instruções de cadeia de pensamento</td></tr>
<tr><td><strong>Engenharia de contexto</strong></td><td>O que o modelo pode ver</td><td><a href="https://zilliz.com/glossary/context-window">Janela de contexto</a></td><td>Recuperação de documentos, compressão de histórico</td></tr>
<tr><td><strong>Engenharia de utilização</strong></td><td>O mundo em que o agente actua</td><td>Execução autónoma de várias horas</td><td>Ferramentas, lógica de validação, restrições arquitecturais</td></tr>
</tbody>
</table>
<p><strong>A Prompt Engineering</strong> optimiza a qualidade de uma única troca - fraseologia, estrutura, exemplos. Uma conversa, um resultado.</p>
<p><strong>A Engenharia de Contexto</strong> gere a quantidade de informação que o modelo pode ver de uma só vez - que documentos recuperar, como comprimir o historial, o que cabe na janela de contexto e o que é descartado.</p>
<p><strong>A Engenharia de Aproveitamento</strong> constrói o mundo em que o agente opera. Ferramentas, fontes de conhecimento, lógica de validação, restrições de arquitetura - tudo o que determina se um agente pode funcionar de forma fiável em centenas de decisões sem supervisão humana.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_4_2f4bc35890.png" alt="Three layers of AI agent development: Prompt Engineering optimizes what you say, Context Engineering manages what the model sees, and Harness Engineering designs the execution environment" class="doc-image" id="three-layers-of-ai-agent-development:-prompt-engineering-optimizes-what-you-say,-context-engineering-manages-what-the-model-sees,-and-harness-engineering-designs-the-execution-environment" />
   <span>Três camadas de desenvolvimento de agentes de IA: A engenharia de prontidão optimiza o que o utilizador diz, a engenharia de contexto gere o que o modelo vê e a engenharia de aproveitamento concebe o ambiente de execução</span> </span></p>
<p>As duas primeiras camadas determinam a qualidade de uma única jogada. A terceira determina se um agente pode funcionar durante horas sem que o utilizador o observe.</p>
<p>Estas não são abordagens concorrentes. São uma progressão. À medida que a capacidade do agente aumenta, a mesma equipa passa por todas as três - muitas vezes dentro de um único projeto.</p>
<h2 id="How-OpenAI-Used-Harness-Engineering-to-Build-a-Million-Line-Codebase-and-Lessons-They-Learnt" class="common-anchor-header">Como a OpenAI usou o Harness Engineering para construir uma base de código de milhões de linhas e as lições que aprendeu<button data-href="#How-OpenAI-Used-Harness-Engineering-to-Build-a-Million-Line-Codebase-and-Lessons-They-Learnt" class="anchor-icon" translate="no">
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
    </button></h2><p>A OpenAI realizou uma experiência interna que coloca a Harness Engineering em termos concretos. Eles o descreveram em seu blog de engenharia, <a href="https://openai.com/index/harness-engineering/">"Harness Engineering: Leveraging Codex in an Agent-First World".</a> Uma equipa de três pessoas começou com um repositório vazio no final de agosto de 2025. Durante cinco meses, não escreveram qualquer código - cada linha foi gerada pelo Codex, o agente de codificação alimentado por IA da OpenAI. O resultado: um milhão de linhas de código de produção e 1500 pedidos pull fundidos.</p>
<p>A parte interessante não é o resultado. São os quatro problemas que eles enfrentaram e as soluções de camada de arnês que eles construíram.</p>
<h3 id="Problem-1-No-Shared-Understanding-of-the-Codebase" class="common-anchor-header">Problema 1: Nenhum entendimento compartilhado da base de código</h3><p>Que camada de abstração o agente deve usar? Quais são as convenções de nomenclatura? Onde foi parar a discussão de arquitetura da semana passada? Sem respostas, o agente adivinhava - e adivinhava mal - repetidamente.</p>
<p>O primeiro instinto foi um único ficheiro <code translate="no">AGENTS.md</code> contendo todas as convenções, regras e decisões históricas. Falhou por quatro razões. O contexto é escasso, e um ficheiro de instruções inchado afastava a tarefa real. Quando tudo é marcado como importante, nada o é. A documentação apodrece - as regras da segunda semana tornam-se erradas na oitava semana. E um documento plano não pode ser verificado mecanicamente.</p>
<p>A solução: reduzir <code translate="no">AGENTS.md</code> para 100 linhas. Não são regras - é um mapa. Ele aponta para um diretório estruturado <code translate="no">docs/</code> contendo decisões de projeto, planos de execução, especificações do produto e documentos de referência. Linters e CI verificam se as ligações cruzadas permanecem intactas. O agente navega exatamente para o que precisa.</p>
<p>O princípio subjacente: se algo não está no contexto em tempo de execução, não existe para o agente.</p>
<h3 id="Problem-2-Human-QA-Couldnt-Keep-Pace-with-Agent-Output" class="common-anchor-header">Problema 2: O controlo de qualidade humano não conseguia acompanhar o ritmo da produção do agente</h3><p>A equipa ligou o protocolo Chrome DevTools ao Codex. O agente podia fazer capturas de ecrã de caminhos da IU, observar eventos de tempo de execução e consultar registos com LogQL e métricas com PromQL. Definiram um limite concreto: um serviço tinha de ser iniciado em menos de 800 milissegundos para que uma tarefa fosse considerada concluída. As tarefas do Codex eram executadas por mais de seis horas seguidas, geralmente enquanto os engenheiros dormiam.</p>
<h3 id="Problem-3-Architectural-Drift-Without-Constraints" class="common-anchor-header">Problema 3: Deriva arquitetónica sem restrições</h3><p>Sem barreiras, o agente reproduzia os padrões que encontrava no repositório - incluindo os maus.</p>
<p>A solução: arquitetura estrita em camadas com uma única direção de dependência imposta - Types → Config → Repo → Service → Runtime → UI. Os linters personalizados aplicavam estas regras mecanicamente, com mensagens de erro que incluíam a instrução de correção em linha.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_3_f0fc3c9e92.png" alt="Strict layered architecture with one-way dependency validation: Types at the base, UI at the top, custom linters enforce rules with inline fix suggestions" class="doc-image" id="strict-layered-architecture-with-one-way-dependency-validation:-types-at-the-base,-ui-at-the-top,-custom-linters-enforce-rules-with-inline-fix-suggestions" />
   <span>Arquitetura rigorosa em camadas com validação de dependência unidirecional: Tipos na base, IU no topo, linters personalizados aplicam regras com sugestões de correção em linha</span> </span></p>
<p>Numa equipa humana, este constrangimento surge normalmente quando uma empresa aumenta a escala para centenas de engenheiros. Para um agente de codificação, é um pré-requisito desde o primeiro dia. Quanto mais rápido um agente se move sem restrições, pior é o desvio da arquitetura.</p>
<h3 id="Problem-4-Silent-Technical-Debt" class="common-anchor-header">Problema 4: Dívida técnica silenciosa</h3><p>A solução: codificar os princípios fundamentais do projeto no repositório e, em seguida, executar tarefas do Codex em segundo plano, de acordo com um calendário, para procurar desvios e submeter PRs de refacção. A maioria foi fundida automaticamente num minuto - pequenos pagamentos contínuos em vez de cálculos periódicos.</p>
<h2 id="Why-AI-Agents-Cant-Grade-Their-Own-Work" class="common-anchor-header">Porque é que os agentes de IA não conseguem avaliar o seu próprio trabalho<button data-href="#Why-AI-Agents-Cant-Grade-Their-Own-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>A experiência da OpenAI provou que a Harness Engineering funciona. Mas uma investigação separada expôs um modo de falha no seu interior: os agentes são sistematicamente maus a avaliar os seus próprios resultados.</p>
<p>O problema aparece de duas formas.</p>
<p><strong>Ansiedade de contexto.</strong> À medida que a janela de contexto se enche, os agentes começam a terminar as tarefas prematuramente - não porque o trabalho esteja feito, mas porque sentem que o limite da janela está a aproximar-se. A Cognition, a equipa por detrás do agente de codificação de IA Devin, <a href="https://cognition.ai/blog/devin-sonnet-4-5-lessons-and-challenges">documentou este comportamento</a> enquanto reconstruía o Devin para o Claude Sonnet 4.5: o modelo apercebeu-se da sua própria janela de contexto e começou a tomar atalhos muito antes de ficar realmente sem espaço.</p>
<p>A correção deles foi pura engenharia de hardware. Eles habilitaram o contexto beta de 1 milhão de tokens, mas limitaram o uso real a 200 mil tokens - enganando o modelo para que ele acreditasse que tinha uma ampla margem de manobra. A ansiedade desapareceu. Não foi necessário alterar o modelo; apenas um ambiente mais inteligente.</p>
<p>A atenuação geral mais comum é a compactação: resumir o histórico e permitir que o mesmo agente continue com o contexto compactado. Isso preserva a continuidade, mas não elimina o comportamento subjacente. Uma alternativa é a redefinição do contexto: limpar a janela, iniciar uma nova instância e transferir o estado através de um artefacto estruturado. Isto elimina completamente o gatilho da ansiedade, mas exige um documento de transferência completo - lacunas no artefacto significam lacunas na compreensão do novo agente.</p>
<p><strong>Viés de autoavaliação.</strong> Quando os agentes avaliam os seus próprios resultados, atribuem-lhes uma pontuação elevada. Mesmo em tarefas com critérios objectivos de aprovação/reprovação, o agente detecta um problema, convence-se a si próprio de que não é grave e aprova trabalho que deveria falhar.</p>
<p>A correção baseia-se nas GANs (Generative Adversarial Networks): separar completamente o gerador do avaliador. Numa GAN, duas redes neurais competem - uma gera, outra avalia - e essa tensão adversária força a qualidade a subir. A mesma dinâmica aplica-se aos <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">sistemas multi-agentes</a>.</p>
<p>A Anthropic testou isto com um conjunto de três agentes - Planificador, Gerador, Avaliador - contra um agente individual com a tarefa de construir um motor de jogo retro 2D. Descrevem a experiência completa em <a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">"Harness Design for Long-Running Application Development"</a> (Anthropic, 2026). O Planificador expande um pequeno pedido para uma especificação completa do produto, deixando deliberadamente por especificar os pormenores de implementação - o excesso de especificação precoce leva a erros a jusante. O Gerador implementa funcionalidades em sprints, mas antes de escrever código, assina um contrato de sprint com o Avaliador: uma definição partilhada de "feito". O Avaliador usa o Playwright (a estrutura de automação de navegador de código aberto da Microsoft) para clicar na aplicação como um utilizador real, testando a IU, a API e o comportamento da base de dados. Se alguma coisa falhar, o sprint falha.</p>
<p>O agente solo produziu um jogo que tecnicamente foi lançado, mas as conexões entidade-para-tempo de execução foram quebradas no nível do código - descobertas apenas pela leitura do código-fonte. O arnês de três agentes produziu um jogo jogável com geração de níveis assistida por IA, animação de sprite e efeitos sonoros.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_1_38a13120a7.png" alt="Comparison of solo agent versus three-agent harness: solo agent ran 20 minutes at nine dollars with broken core functionality, while the full harness ran 6 hours at two hundred dollars producing a fully functional game with AI-assisted features" class="doc-image" id="comparison-of-solo-agent-versus-three-agent-harness:-solo-agent-ran-20-minutes-at-nine-dollars-with-broken-core-functionality,-while-the-full-harness-ran-6-hours-at-two-hundred-dollars-producing-a-fully-functional-game-with-ai-assisted-features" />
   </span> <span class="img-wrapper"> <span>Comparação entre o agente solo e o arnês de três agentes: o agente solo funcionou durante 20 minutos a nove dólares com uma funcionalidade central quebrada, enquanto o arnês completo funcionou durante 6 horas a duzentos dólares, produzindo um jogo totalmente funcional com funcionalidades assistidas por IA</span> </span></p>
<p>A arquitetura de três agentes custou cerca de 20 vezes mais. O resultado passou de inutilizável para utilizável. Esta é a principal troca que a Harness Engineering faz: despesas estruturais em troca de fiabilidade.</p>
<h2 id="The-Retrieval-Problem-Inside-Every-Agent-Harness" class="common-anchor-header">O problema de recuperação dentro de cada chicote de agentes<button data-href="#The-Retrieval-Problem-Inside-Every-Agent-Harness" class="anchor-icon" translate="no">
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
    </button></h2><p>Ambos os padrões - o sistema estruturado <code translate="no">docs/</code> e o ciclo de sprint Gerador/Avaliador - partilham uma dependência silenciosa: o agente tem de encontrar a informação certa a partir de uma base de conhecimento viva e em evolução quando precisa dela.</p>
<p>Isto é mais difícil do que parece. Vejamos um exemplo concreto: o Gerador está a executar o Sprint 3, implementando a autenticação do utilizador. Antes de escrever o código, ele precisa de dois tipos de informação.</p>
<p>Primeiro, uma consulta <a href="https://zilliz.com/glossary/semantic-search">de pesquisa semântica</a>: <em>quais são os princípios de conceção deste produto em relação às sessões de utilizador?</em> O documento relevante pode utilizar "gestão de sessões" ou "controlo de acesso" - não "autenticação de utilizador". Sem uma compreensão semântica, a recuperação não o faz.</p>
<p>Em segundo lugar, uma consulta de correspondência exacta: <em>que documentos fazem referência à função <code translate="no">validateToken</code>?</em> Um nome de função é uma cadeia arbitrária sem significado semântico. <a href="https://zilliz.com/glossary/vector-embeddings">A recuperação baseada na incorporação</a> não a consegue encontrar de forma fiável. Apenas a correspondência de palavras-chave funciona.</p>
<p>Estas duas consultas ocorrem em simultâneo. Não podem ser separadas em passos sequenciais.</p>
<p><a href="https://zilliz.com/learn/vector-similarity-search">A pesquisa vetorial</a> pura falha na correspondência exacta. A <a href="https://milvus.io/docs/embed-with-bm25.md">BM25</a> tradicional falha nas consultas semânticas e não consegue prever o vocabulário que um documento irá utilizar. Antes do Milvus 2.5, a única opção eram dois sistemas de recuperação paralelos - um índice vetorial e um <a href="https://milvus.io/docs/full-text-search.md">índice de texto integral</a> - a funcionar em simultâneo no momento da consulta com uma lógica de fusão de resultados personalizada. Para um repositório <code translate="no">docs/</code> com actualizações contínuas, ambos os índices tinham de se manter sincronizados: cada alteração de documento desencadeava a reindexação em dois locais, com o risco constante de inconsistência.</p>
<h2 id="How-Milvus-26-Solves-Agent-Retrieval-with-a-Single-Hybrid-Pipeline" class="common-anchor-header">Como o Milvus 2.6 resolve a recuperação de agentes com um único pipeline híbrido<button data-href="#How-Milvus-26-Solves-Agent-Retrieval-with-a-Single-Hybrid-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus é um <a href="https://zilliz.com/learn/what-is-vector-database">banco de dados vetorial</a> de código aberto projetado para cargas de trabalho de IA. O Sparse-BM25 do Milvus 2.6 colapsa o problema de recuperação de pipeline duplo em um único sistema.</p>
<p>Na ingestão, o Milvus gera duas representações simultaneamente: uma <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">incorporação densa</a> para recuperação semântica e um <a href="https://milvus.io/docs/sparse_vector.md">vetor esparso codificado por TF</a> para pontuação BM25. <a href="https://zilliz.com/learn/tf-idf-understanding-term-frequency-inverse-document-frequency-in-nlp">As estatísticas</a> globais <a href="https://zilliz.com/learn/tf-idf-understanding-term-frequency-inverse-document-frequency-in-nlp">do IDF</a> são actualizadas automaticamente à medida que os documentos são adicionados ou removidos - não há necessidade de reindexação manual. No momento da consulta, uma entrada em linguagem natural gera internamente ambos os tipos de vectores de consulta. O <a href="https://milvus.io/docs/rrf-ranker.md">Reciprocal Rank Fusion (RRF)</a> funde os resultados classificados e o autor da chamada recebe um único conjunto de resultados unificado.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_2_8504a6ee08.png" alt="Before and after: two separate systems with manual sync, fragmented results, and custom fusion logic versus Milvus 2.6 single pipeline with dense embedding, Sparse BM25, RRF fusion, and automatic IDF maintenance producing unified results" class="doc-image" id="before-and-after:-two-separate-systems-with-manual-sync,-fragmented-results,-and-custom-fusion-logic-versus-milvus-2.6-single-pipeline-with-dense-embedding,-sparse-bm25,-rrf-fusion,-and-automatic-idf-maintenance-producing-unified-results" />
   </span> <span class="img-wrapper"> <span>Antes e depois: dois sistemas separados com sincronização manual, resultados fragmentados e lógica de fusão personalizada versus pipeline único do Milvus 2.6 com dense embedding, Sparse BM25, fusão RRF e manutenção automática de IDF produzindo resultados unificados</span> </span></p>
<p>Uma interface. Um índice para manter.</p>
<p>No <a href="https://zilliz.com/glossary/beir">benchmark BEIR</a> - um conjunto de avaliação padrão que abrange 18 conjuntos de dados de recuperação heterogéneos - o Milvus alcança uma taxa de transferência 3-4x superior à do Elasticsearch com uma recuperação equivalente, com uma melhoria de até 7x QPS em cargas de trabalho específicas. Para o cenário de sprint, uma única consulta encontra o princípio de conceção da sessão (caminho semântico) e todos os documentos que mencionam <code translate="no">validateToken</code> (caminho exato). O repositório <code translate="no">docs/</code> é atualizado continuamente; a manutenção do IDF BM25 significa que um documento recentemente escrito participa na pontuação da consulta seguinte sem qualquer reconstrução em lote.</p>
<p>Esta é a camada de recuperação construída exatamente para esta classe de problemas. Quando um agente precisa de pesquisar uma base de conhecimento viva - documentação de código, decisões de design, histórico de sprint - a pesquisa híbrida de pipeline único não é uma coisa boa de se ter. Ela é o que faz o resto do chicote funcionar.</p>
<h2 id="The-Best-Harness-Components-Are-Designed-to-Be-Deleted" class="common-anchor-header">Os melhores componentes do arnês são projectados para serem eliminados<button data-href="#The-Best-Harness-Components-Are-Designed-to-Be-Deleted" class="anchor-icon" translate="no">
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
    </button></h2><p>Cada componente de um arnês codifica uma suposição sobre as limitações do modelo. A decomposição do sprint era necessária quando os modelos perdiam a coerência em tarefas longas. A reposição do contexto era necessária quando os modelos sentiam ansiedade perto do limite da janela. Os agentes de avaliação tornaram-se necessários quando a tendência para a autoavaliação era incontrolável.</p>
<p>Estes pressupostos expiram. O truque da janela de contexto da cognição pode tornar-se desnecessário à medida que os modelos desenvolvem uma verdadeira resistência a longos contextos. À medida que os modelos continuarem a melhorar, outros componentes tornar-se-ão uma sobrecarga desnecessária que torna os agentes mais lentos sem acrescentar fiabilidade.</p>
<p>A Harness Engineering não é uma arquitetura fixa. É um sistema recalibrado a cada novo lançamento de modelo. A primeira pergunta após qualquer grande atualização não é "o que posso acrescentar?". É "o que é que posso remover?"</p>
<p>A mesma lógica aplica-se à recuperação. À medida que os modelos lidam com contextos mais longos de forma mais fiável, as estratégias de fragmentação e o tempo de recuperação mudarão. A informação que hoje necessita de uma fragmentação cuidadosa pode ser ingerida como páginas completas amanhã. A infraestrutura de recuperação adapta-se juntamente com o modelo.</p>
<p>Todos os componentes de um sistema bem construído estão à espera de serem tornados redundantes por um modelo mais inteligente. Isso não é um problema. É o objetivo.</p>
<h2 id="Get-Started-with-Milvus" class="common-anchor-header">Comece a usar o Milvus<button data-href="#Get-Started-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Se está a construir uma infraestrutura de agentes que necessita de uma recuperação híbrida - pesquisa semântica e por palavra-chave num único pipeline - eis por onde começar:</p>
<ul>
<li>Leia as <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>notas de lançamento do Milvus 2.6</strong></a> para obter todos os detalhes sobre o Sparse-BM25, a manutenção automática do IDF e os benchmarks de desempenho.</li>
<li>Junte-se à <a href="https://milvus.io/community"><strong>comunidade Milvus</strong></a> para fazer perguntas e partilhar o que está a construir.</li>
<li><a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>Reserve uma sessão gratuita do Milvus Office Hours</strong></a> para analisar o seu caso de utilização com um especialista em bases de dados vectoriais.</li>
<li>Se preferir ignorar a configuração da infraestrutura, <a href="https://cloud.zilliz.com/signup"><strong>o Zilliz Cloud</strong></a> (Milvus totalmente gerido) oferece um nível gratuito para começar com créditos gratuitos de $100 após o registo com o e-mail de trabalho.</li>
<li>Inscreva-nos no GitHub: <a href="https://github.com/milvus-io/milvus"><strong>milvus-io/milvus</strong></a> - 43k+ estrelas e a crescer.</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Perguntas frequentes<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="What-is-harness-engineering-and-how-is-it-different-from-prompt-engineering" class="common-anchor-header">O que é a harness engineering e qual é a sua diferença em relação à prompt engineering?</h3><p>A engenharia de prontidão optimiza o que diz a um modelo numa única troca - fraseado, estrutura, exemplos. A Harness Engineering constrói o ambiente de execução em torno de um agente de IA autónomo: as ferramentas que pode chamar, o conhecimento a que pode aceder, a lógica de validação que verifica o seu trabalho e as restrições que impedem a deriva arquitetónica. A engenharia de prontidão molda um turno de conversação. A engenharia de aproveitamento determina se um agente pode funcionar de forma fiável durante horas em centenas de decisões sem supervisão humana.</p>
<h3 id="Why-do-AI-agents-need-both-vector-search-and-BM25-at-the-same-time" class="common-anchor-header">Porque é que os agentes de IA precisam de pesquisa vetorial e de BM25 ao mesmo tempo?</h3><p>Os agentes têm de responder simultaneamente a duas consultas de recuperação fundamentalmente diferentes. Consultas semânticas - <em>quais são os nossos princípios de conceção das sessões de utilizador?</em> - requerem densas incorporações vectoriais para corresponder a conteúdos concetualmente relacionados, independentemente do vocabulário. Consultas de correspondência exacta - <em>que documentos referem a função <code translate="no">validateToken</code>?</em> - requerem uma pontuação de palavras-chave BM25, porque os nomes das funções são cadeias arbitrárias sem significado semântico. Um sistema de recuperação que lida apenas com um modo perderá sistematicamente as consultas do outro tipo.</p>
<h3 id="How-does-Milvus-Sparse-BM25-work-for-agent-knowledge-retrieval" class="common-anchor-header">Como é que o Milvus Sparse-BM25 funciona para a recuperação de conhecimento de agentes?</h3><p>Aquando da ingestão, o Milvus gera simultaneamente uma incorporação densa e um vetor esparso codificado por TF para cada documento. As estatísticas globais do IDF são actualizadas em tempo real à medida que a base de conhecimentos muda - não é necessária uma reindexação manual. No momento da consulta, ambos os tipos de vectores são gerados internamente, o Reciprocal Rank Fusion funde os resultados classificados e o agente recebe um único conjunto de resultados unificado. Todo o pipeline é executado através de uma interface e de um índice - essencial para bases de conhecimento continuamente actualizadas, como um repositório de documentação de código.</p>
<h3 id="When-should-I-add-an-evaluator-agent-to-my-agent-harness" class="common-anchor-header">Quando devo adicionar um agente avaliador ao meu conjunto de agentes?</h3><p>Adicione um Avaliador separado quando a qualidade de saída do seu Gerador não puder ser verificada apenas por testes automatizados ou quando a tendência de autoavaliação tiver causado defeitos perdidos. O princípio fundamental: o Avaliador deve estar arquitetonicamente separado do Gerador - o contexto partilhado reintroduz a mesma tendência que está a tentar eliminar. O Avaliador deve ter acesso a ferramentas de tempo de execução (automação do navegador, chamadas de API, consultas a banco de dados) para testar o comportamento, não apenas revisar o código. <a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">A pesquisa</a> da Anthropic descobriu que essa separação inspirada no GAN mudou a qualidade do resultado de "tecnicamente lançado, mas quebrado" para "totalmente funcional com recursos que o agente solo nunca tentou".</p>
