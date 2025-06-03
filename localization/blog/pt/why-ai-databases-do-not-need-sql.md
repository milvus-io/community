---
id: why-ai-databases-do-not-need-sql.md
title: Porque é que as bases de dados de IA não precisam de SQL
author: James Luan
date: 2025-05-30T00:00:00.000Z
cover: assets.zilliz.com/why_ai_databases_don_t_need_SQL_2d12f615df.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, SQL, AI Agents, LLM'
meta_keywords: 'SQL, AI Databases, vector databases, AI Agents'
meta_title: |
  Why AI Databases Don't Need SQL
desc: >-
  Quer se goste ou não, a verdade é que a SQL está destinada ao declínio na era
  da IA.
origin: 'https://milvus.io/blog/why-ai-databases-do-not-need-sql.md'
---
<p>Durante décadas, <code translate="no">SELECT * FROM WHERE</code> tem sido a regra de ouro das consultas de bases de dados. Quer se trate de sistemas de relatórios, de análises financeiras ou de consultas sobre o comportamento dos utilizadores, habituámo-nos a utilizar uma linguagem estruturada para manipular dados com precisão. Até o NoSQL, que chegou a proclamar uma "revolução anti-SQL", acabou por ceder e introduzir o suporte para SQL, reconhecendo a sua posição aparentemente insubstituível.</p>
<p><em>Mas já se perguntou: passámos mais de 50 anos a ensinar os computadores a falar linguagem humana, então porque é que ainda estamos a forçar os humanos a falar &quot;computador&quot;?</em></p>
<p><strong>Quer queira quer não, a verdade é esta: a SQL está destinada ao declínio na era da IA.</strong> Pode ainda ser utilizado em sistemas antigos, mas está a tornar-se cada vez mais irrelevante para as aplicações modernas de IA. A revolução da IA não está apenas a mudar a forma como criamos software - está a tornar o SQL obsoleto, e a maioria dos programadores está demasiado ocupada a otimizar os seus JOINs para reparar nisso.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_ai_databases_don_t_need_SQL_2d12f615df.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Natural-Language-The-New-Interface-for-AI-Databases" class="common-anchor-header">Linguagem natural: A nova interface para bases de dados de IA<button data-href="#Natural-Language-The-New-Interface-for-AI-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>O futuro da interação com bases de dados não passa por aprender melhor SQL - passa por <strong>abandonar completamente a sintaxe</strong>.</p>
<p>Em vez de lutar com consultas SQL complexas, imagine simplesmente dizer:</p>
<p><em>"Ajude-me a encontrar utilizadores cujo comportamento de compra recente seja mais semelhante ao dos nossos principais clientes do último trimestre".</em></p>
<p>O sistema compreende a sua intenção e decide automaticamente:</p>
<ul>
<li><p>Deve consultar tabelas estruturadas ou efetuar uma pesquisa de semelhança de vectores entre as incorporações de utilizadores?</p></li>
<li><p>Deve chamar APIs externas para enriquecer os dados?</p></li>
<li><p>Como deve classificar e filtrar os resultados?</p></li>
</ul>
<p>Tudo isto é feito automaticamente. Sem sintaxe. Sem depuração. Sem pesquisas no Stack Overflow sobre "como fazer uma função de janela com vários CTEs". Já não é um &quot;programador&quot; de bases de dados - está a ter uma conversa com um sistema de dados inteligente.</p>
<p>Isto não é ficção científica. De acordo com as previsões da Gartner, até 2026, a maioria das empresas dará prioridade à linguagem natural como a sua principal interface de consulta, com o SQL a passar de uma competência "obrigatória" para uma competência "opcional".</p>
<p>A transformação já está a acontecer:</p>
<p><strong>✅ Barreiras de sintaxe zero:</strong> Os nomes dos campos, as relações entre tabelas e a otimização das consultas passam a ser um problema do sistema, não seu</p>
<p><strong>Dados não estruturados amigáveis:</strong> imagens, áudio e texto tornam-se objectos de consulta de primeira classe</p>
<p><strong>Acesso democratizado:</strong> As equipas de operações, os gestores de produtos e os analistas podem consultar diretamente os dados tão facilmente como o seu engenheiro sénior</p>
<h2 id="Natural-Language-Is-Just-the-Surface-AI-Agents-Are-the-Real-Brain" class="common-anchor-header">A linguagem natural é apenas a superfície; os agentes de IA são o verdadeiro cérebro<button data-href="#Natural-Language-Is-Just-the-Surface-AI-Agents-Are-the-Real-Brain" class="anchor-icon" translate="no">
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
    </button></h2><p>As consultas em linguagem natural são apenas a ponta do iceberg. O verdadeiro avanço são os <a href="https://zilliz.com/blog/what-exactly-are-ai-agents-why-openai-and-langchain-are-fighting-over-their-definition">agentes de IA</a> que podem raciocinar sobre os dados como os humanos.</p>
<p>Compreender o discurso humano é o primeiro passo. Compreender o que se pretende e executá-lo eficazmente - é aí que a magia acontece.</p>
<p>Os agentes de IA funcionam como o "cérebro" da base de dados, gerindo:</p>
<ul>
<li><p><strong>🤔 Compreensão da intenção:</strong> Determinar que campos, bases de dados e índices são realmente necessários</p></li>
<li><p><strong>⚙️ Seleção de estratégias:</strong> Escolher entre filtragem estruturada, similaridade vetorial ou abordagens híbridas</p></li>
<li><p><strong>Orquestração de capacidades:</strong> Execução de APIs, acionamento de serviços, coordenação de consultas entre sistemas</p></li>
<li><p><strong>Formatação inteligente:</strong> Devolver resultados que pode compreender e utilizar de imediato</p></li>
</ul>
<p>Eis o que isto parece na prática. Na <a href="https://milvus.io/">base de dados de vectores Milvus,</a> uma pesquisa de semelhanças complexa torna-se trivial:</p>
<pre><code translate="no">results = collection.search(query_vector, top_k=<span class="hljs-number">10</span>, <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;is_active == true&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Uma linha. Sem JOINs. Sem subconsultas. Sem ajuste de desempenho.</strong> A <a href="https://zilliz.com/learn/what-is-vector-database">base de dados vetorial</a> trata da semelhança semântica enquanto os filtros tradicionais tratam das correspondências exactas. É mais rápido, mais simples e realmente entende o que você quer.</p>
<p>Esta abordagem "API-first" integra-se naturalmente com as capacidades <a href="https://zilliz.com/blog/function-calling-vs-mcp-vs-a2a-developers-guide-to-ai-agent-protocols">de Function Calling</a> dos grandes modelos de linguagem - execução mais rápida, menos erros, integração mais fácil.</p>
<h2 id="Why-SQL-Falls-Apart-in-the-AI-Era" class="common-anchor-header">Porque é que o SQL se desmorona na era da IA<button data-href="#Why-SQL-Falls-Apart-in-the-AI-Era" class="anchor-icon" translate="no">
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
    </button></h2><p>O SQL foi concebido para um mundo estruturado. No entanto, o futuro impulsionado pela IA será dominado por dados não estruturados, compreensão semântica e recuperação inteligente - tudo o que o SQL nunca foi criado para lidar.</p>
<p>As aplicações modernas são inundadas com dados não estruturados, incluindo texto incorporado de modelos de linguagem, vectores de imagem de sistemas de visão por computador, impressões digitais de áudio de reconhecimento de voz e representações multimodais que combinam texto, imagens e metadados.</p>
<p>Estes dados não se enquadram perfeitamente em linhas e colunas - existem como vectores incorporados num espaço semântico de elevada dimensão e a SQL não faz a mínima ideia do que fazer com eles.</p>
<h3 id="SQL-+-Vector-A-Beautiful-Idea-That-Executes-Poorly" class="common-anchor-header">SQL + Vetor: Uma ideia bonita que é mal executada</h3><p>Desesperadas por se manterem relevantes, as bases de dados tradicionais estão a acrescentar capacidades vectoriais à SQL. O PostgreSQL adicionou o operador <code translate="no">&lt;-&gt;</code> para pesquisa de similaridade vetorial:</p>
<pre><code translate="no">SELECT *
  FROM items
 ORDER BY embedding &lt;-&gt; query_vector
 LIMIT 10;
<button class="copy-code-btn"></button></code></pre>
<p>Isso parece inteligente, mas é fundamentalmente falho. Está a forçar operações vectoriais através de analisadores SQL, optimizadores de consultas e sistemas de transação concebidos para um modelo de dados completamente diferente.</p>
<p>A penalidade de desempenho é brutal:</p>
<p><strong>Dados reais de benchmark</strong>: Em condições idênticas, o Milvus criado propositadamente proporciona uma latência de consulta 60% inferior e uma taxa de transferência 4,5x superior em comparação com o PostgreSQL com pgvector.</p>
<p>Porquê um desempenho tão fraco? As bases de dados tradicionais criam caminhos de execução desnecessariamente complexos:</p>
<ul>
<li><p><strong>Sobrecarga do analisador</strong>: As consultas vectoriais são forçadas a passar pela validação da sintaxe SQL</p></li>
<li><p><strong>Confusão do optimizador</strong>: Os planeadores de consultas optimizados para junções relacionais têm dificuldades com as pesquisas por semelhança</p></li>
<li><p><strong>Ineficiência de armazenamento</strong>: Os vectores armazenados como BLOBs requerem codificação/decodificação constante</p></li>
<li><p><strong>Incompatibilidade de índices</strong>: As estruturas B-trees e LSM são completamente erradas para a pesquisa de similaridade de alta dimensão</p></li>
</ul>
<h3 id="Relational-vs-AIVector-Databases-Fundamentally-Different-Philosophies" class="common-anchor-header">Bases de dados relacionais vs AI/Vectoriais: Filosofias fundamentalmente diferentes</h3><p>A incompatibilidade é mais profunda do que o desempenho. Trata-se de abordagens totalmente diferentes aos dados:</p>
<table>
<thead>
<tr><th><strong>Aspeto</strong></th><th><strong>Bases de dados SQL/relacionais</strong></th><th><strong>Bases de dados vectoriais/IA</strong></th></tr>
</thead>
<tbody>
<tr><td>Modelo de dados</td><td>Campos estruturados (números, cadeias de caracteres) em linhas e colunas</td><td>Representações vectoriais de alta dimensão de dados não estruturados (texto, imagens, áudio)</td></tr>
<tr><td>Lógica de consulta</td><td>Correspondência exacta + operações booleanas</td><td>Correspondência por semelhança + pesquisa semântica</td></tr>
<tr><td>Interface</td><td>SQL</td><td>Linguagem natural + APIs Python</td></tr>
<tr><td>Filosofia</td><td>Conformidade ACID, consistência perfeita</td><td>Recuperação optimizada, relevância semântica, desempenho em tempo real</td></tr>
<tr><td>Estratégia de índices</td><td>Árvores B+, índices hash, etc.</td><td>HNSW, IVF, quantização de produtos, etc.</td></tr>
<tr><td>Casos de utilização principais</td><td>Transacções, relatórios, análises</td><td>Pesquisa semântica, pesquisa multimodal, recomendações, sistemas RAG, agentes de IA</td></tr>
</tbody>
</table>
<p>Tentar fazer com que a SQL funcione para operações vectoriais é como utilizar uma chave de fendas como martelo - não é tecnicamente impossível, mas está a utilizar a ferramenta errada para o trabalho.</p>
<h2 id="Vector-Databases-Purpose-Built-for-AI" class="common-anchor-header">Bases de dados vectoriais: Criadas para fins de IA<button data-href="#Vector-Databases-Purpose-Built-for-AI" class="anchor-icon" translate="no">
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
    </button></h2><p>As bases de dados vectoriais como <a href="https://milvus.io/">a Milvus</a> e <a href="https://zilliz.com/">a Zilliz Cloud</a> não são &quot;bases de dados SQL com funcionalidades vectoriais&quot; - são sistemas de dados inteligentes concebidos de raiz para aplicações nativas de IA.</p>
<h3 id="1-Native-Multimodal-Support" class="common-anchor-header">1. Suporte multimodal nativo</h3><p>As verdadeiras aplicações de IA não armazenam apenas texto - trabalham com imagens, áudio, vídeo e documentos complexos aninhados. As bases de dados vectoriais lidam com diversos tipos de dados e estruturas multi-vectoriais como <a href="https://zilliz.com/learn/explore-colbert-token-level-embedding-and-ranking-model-for-similarity-search">ColBERT</a> e <a href="https://zilliz.com/blog/colpali-milvus-redefine-document-retrieval-with-vision-language-models">ColPALI</a>, adaptando-se a representações semânticas ricas de diferentes modelos de IA.</p>
<h3 id="2-Agent-Friendly-Architecture" class="common-anchor-header">2. Arquitetura favorável ao agente</h3><p>Os modelos de linguagem de grande dimensão destacam-se na chamada de funções e não na geração de SQL. As bases de dados vectoriais oferecem APIs Python-first que se integram perfeitamente com os agentes de IA, permitindo a realização de operações complexas, como a recuperação de vectores, a filtragem, a reavaliação e o realce semântico, tudo numa única chamada de função, sem necessidade de uma camada de tradução da linguagem de consulta.</p>
<h3 id="3-Semantic-Intelligence-Built-In" class="common-anchor-header">3. Inteligência semântica incorporada</h3><p>As bases de dados vectoriais não se limitam a executar comandos - compreendem<strong>a intenção.</strong> Trabalhando com agentes de IA e outras aplicações de IA, libertam-se da correspondência literal de palavras-chave para obter uma verdadeira recuperação semântica. Sabem não só "como consultar", mas também "o que realmente se pretende encontrar".</p>
<h3 id="4-Optimized-for-Relevance-Not-Just-Speed" class="common-anchor-header">4. Optimizadas para a relevância, não apenas para a velocidade</h3><p>Tal como os modelos de linguagem de grande dimensão, as bases de dados vectoriais atingem um equilíbrio entre o desempenho e a recuperação. Através da filtragem de metadados, da <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">pesquisa híbrida de vectores e de texto integral</a> e de algoritmos de reclassificação, melhoram continuamente a qualidade e a relevância dos resultados, encontrando conteúdos que são realmente valiosos e não apenas rápidos de recuperar.</p>
<h2 id="The-Future-of-Databases-is-Conversational" class="common-anchor-header">O futuro das bases de dados é conversacional<button data-href="#The-Future-of-Databases-is-Conversational" class="anchor-icon" translate="no">
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
    </button></h2><p>As bases de dados vectoriais representam uma mudança fundamental na forma como pensamos a interação de dados. Eles não estão substituindo os bancos de dados relacionais - eles são criados especificamente para cargas de trabalho de IA e abordam problemas totalmente diferentes em um mundo que prioriza a IA.</p>
<p>Tal como os grandes modelos de linguagem não actualizaram os motores de regras tradicionais, mas redefiniram totalmente a interação homem-máquina, as bases de dados vectoriais estão a redefinir a forma como encontramos e trabalhamos com a informação.</p>
<p>Estamos a fazer a transição de "linguagens escritas para serem lidas por máquinas" para "sistemas que compreendem a intenção humana". As bases de dados estão a evoluir de executores de consultas rígidas para agentes de dados inteligentes que compreendem o contexto e revelam proactivamente informações.</p>
<p>Atualmente, os programadores que criam aplicações de IA não querem escrever SQL - querem descrever o que precisam e deixar que os sistemas inteligentes descubram como o obter.</p>
<p>Por isso, da próxima vez que precisar de encontrar algo nos seus dados, tente uma abordagem diferente. Não escreva uma consulta - diga apenas o que está à procura. A sua base de dados pode surpreendê-lo ao compreender o que quer dizer.</p>
<p><em>E se não entender? Talvez seja altura de atualizar a sua base de dados, não as suas competências em SQL.</em></p>
