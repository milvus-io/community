---
id: introduce-deepsearcher-a-local-open-source-deep-research.md
title: 'Apresentando o DeepSearcher: Uma pesquisa profunda local de código aberto'
author: Stefan Webb
date: 2025-02-21T00:00:00.000Z
desc: >-
  Em contraste com o Deep Research da OpenAI, este exemplo foi executado
  localmente, utilizando apenas modelos e ferramentas de código aberto como o
  Milvus e o LangChain.
cover: >-
  assets.zilliz.com/Introducing_Deep_Searcher_A_Local_Open_Source_Deep_Research_4d00da5b85.png
tag: Announcements
tags: DeepSearcher
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/introduce-deepsearcher-a-local-open-source-deep-research
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deep_researcher_a0170dadd0.gif" alt="deep researcher.gif" class="doc-image" id="deep-researcher.gif" />
   </span> <span class="img-wrapper"> <span>deep researcher.gif</span> </span></p>
<p>No post anterior, <a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md"><em>"I Built a Deep Research with Open Source-and So Can You!",</em></a> explicámos alguns dos princípios subjacentes aos agentes de investigação e construímos um protótipo simples que gera relatórios detalhados sobre um determinado tópico ou questão. O artigo e o notebook correspondente demonstraram os conceitos fundamentais de <em>utilização de ferramentas</em>, <em>decomposição de consultas</em>, <em>raciocínio</em> e <em>reflexão</em>. O exemplo no nosso post anterior, em contraste com o Deep Research da OpenAI, foi executado localmente, utilizando apenas modelos e ferramentas de código aberto como o <a href="https://milvus.io/docs">Milvus</a> e o LangChain. (Aconselho-o a ler o <a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md">artigo acima</a> antes de continuar).</p>
<p>Nas semanas seguintes, houve uma explosão de interesse em compreender e reproduzir a Investigação Profunda da OpenAI. Veja, por exemplo, <a href="https://www.perplexity.ai/hub/blog/introducing-perplexity-deep-research">a Perplexity Deep Research</a> e <a href="https://huggingface.co/blog/open-deep-research">a Hugging Face's Open DeepResearch</a>. Estas ferramentas diferem em termos de arquitetura e metodologia, embora partilhem um objetivo: pesquisar iterativamente um tópico ou questão navegando na Web ou em documentos internos e produzir um relatório detalhado, informado e bem estruturado. O importante é que o agente subjacente automatiza o raciocínio sobre a ação a tomar em cada passo intermédio.</p>
<p>Neste post, baseamo-nos no nosso post anterior e apresentamos o projeto de código aberto <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a> da Zilliz. O nosso agente demonstra conceitos adicionais: <em>encaminhamento de consultas, fluxo de execução condicional</em> e <em>rastreio da Web como uma ferramenta</em>. É apresentado como uma biblioteca Python e uma ferramenta de linha de comandos em vez de um bloco de notas Jupyter e tem mais funcionalidades do que o nosso post anterior. Por exemplo, pode introduzir vários documentos de origem e pode definir o modelo de incorporação e a base de dados vetorial utilizados através de um ficheiro de configuração. Embora ainda relativamente simples, o DeepSearcher é uma excelente demonstração do RAG agêntico e é mais um passo em direção a aplicações de IA de última geração.</p>
<p>Além disso, exploramos a necessidade de serviços de inferência mais rápidos e eficientes. Os modelos de raciocínio recorrem ao "escalonamento da inferência", ou seja, à computação adicional, para melhorar os seus resultados, o que, combinado com o facto de um único relatório poder exigir centenas ou milhares de chamadas LLM, faz com que a largura de banda da inferência seja o principal obstáculo. Usamos o <a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency">modelo de raciocínio DeepSeek-R1 no hardware personalizado do SambaNova</a>, que é duas vezes mais rápido em tokens de saída por segundo do que o concorrente mais próximo (veja a figura abaixo).</p>
<p>O SambaNova Cloud também fornece inferência como serviço para outros modelos de código aberto, incluindo Llama 3.x, Qwen2.5 e QwQ. O serviço de inferência é executado no chip personalizado da SambaNova chamado unidade de fluxo de dados reconfigurável (RDU), que é especialmente projetado para inferência eficiente em modelos de IA generativa, reduzindo o custo e aumentando a velocidade de inferência. <a href="https://sambanova.ai/technology/sn40l-rdu-ai-chip">Para mais informações, consulte o sítio Web.</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Output_speed_deepseek_r1_d820329f0a.png" alt="Output speed- deepseek r1.png" class="doc-image" id="output-speed--deepseek-r1.png" />
   </span> <span class="img-wrapper"> <span>Velocidade de saída - deepseek r1.png</span> </span></p>
<h2 id="DeepSearcher-Architecture" class="common-anchor-header">Arquitetura do DeepSearcher<button data-href="#DeepSearcher-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>A arquitetura do <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a> segue o nosso post anterior, dividindo o problema em quatro passos - <em>definir/refinar a questão</em>, <em>pesquisar</em>, <em>analisar</em>, <em>sintetizar</em> - embora desta vez com alguma sobreposição. Passamos por cada etapa, destacando as melhorias do <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deepsearcher_architecture_088c7066d1.png" alt="deepsearcher architecture.png" class="doc-image" id="deepsearcher-architecture.png" />
   </span> <span class="img-wrapper"> <span>arquitetura do deepsearcher.png</span> </span></p>
<h3 id="Define-and-Refine-the-Question" class="common-anchor-header">Definir e refinar a pergunta</h3><pre><code translate="no" class="language-txt">Break down the original query <span class="hljs-keyword">into</span> <span class="hljs-keyword">new</span> sub queries: [
  <span class="hljs-string">&#x27;How has the cultural impact and societal relevance of The Simpsons evolved from its debut to the present?&#x27;</span>,
  <span class="hljs-string">&#x27;What changes in character development, humor, and storytelling styles have occurred across different seasons of The Simpsons?&#x27;</span>, 
  <span class="hljs-string">&#x27;How has the animation style and production technology of The Simpsons changed over time?&#x27;</span>,
  <span class="hljs-string">&#x27;How have audience demographics, reception, and ratings of The Simpsons shifted throughout its run?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Na conceção do DeepSearcher, as fronteiras entre a pesquisa e o refinamento da pergunta são pouco nítidas. A consulta inicial do utilizador é decomposta em subconsultas, tal como no post anterior. Veja acima as subconsultas iniciais produzidas a partir da consulta "Como Os Simpsons mudaram ao longo do tempo?". No entanto, a etapa de pesquisa a seguir continuará a refinar a pergunta conforme necessário.</p>
<h3 id="Research-and-Analyze" class="common-anchor-header">Pesquisa e análise</h3><p>Depois de dividir a consulta em subconsultas, começa a parte de pesquisa do agente. Ela tem, grosso modo, quatro etapas: <em>roteamento</em>, <em>pesquisa</em>, <em>reflexão e repetição condicional</em>.</p>
<h4 id="Routing" class="common-anchor-header">Encaminhamento</h4><p>A nossa base de dados contém várias tabelas ou colecções de diferentes fontes. Seria mais eficiente se pudéssemos restringir a nossa pesquisa semântica apenas às fontes que são relevantes para a consulta em causa. Um encaminhador de consultas pede a um LLM para decidir a partir de que colecções a informação deve ser recuperada.</p>
<p>Eis o método para formar o pedido de encaminhamento de consultas:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_vector_db_search_prompt</span>(<span class="hljs-params">
    question: <span class="hljs-built_in">str</span>,
    collection_names: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
    collection_descriptions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
    context: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span>,
</span>):
    sections = []
    <span class="hljs-comment"># common prompt</span>
    common_prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an advanced AI problem analyst. Use your reasoning ability and historical conversation information, based on all the existing data sets, to get absolutely accurate answers to the following questions, and generate a suitable question for each data set according to the data set description that may be related to the question.

Question: <span class="hljs-subst">{question}</span>
&quot;&quot;&quot;</span>
    sections.append(common_prompt)
    
    <span class="hljs-comment"># data set prompt</span>
    data_set = []
    <span class="hljs-keyword">for</span> i, collection_name <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(collection_names):
        data_set.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{collection_name}</span>: <span class="hljs-subst">{collection_descriptions[i]}</span>&quot;</span>)
    data_set_prompt = <span class="hljs-string">f&quot;&quot;&quot;The following is all the data set information. The format of data set information is data set name: data set description.

Data Sets And Descriptions:
&quot;&quot;&quot;</span>
    sections.append(data_set_prompt + <span class="hljs-string">&quot;\n&quot;</span>.join(data_set))
    
    <span class="hljs-comment"># context prompt</span>
    <span class="hljs-keyword">if</span> context:
        context_prompt = <span class="hljs-string">f&quot;&quot;&quot;The following is a condensed version of the historical conversation. This information needs to be combined in this analysis to generate questions that are closer to the answer. You must not generate the same or similar questions for the same data set, nor can you regenerate questions for data sets that have been determined to be unrelated.

Historical Conversation:
&quot;&quot;&quot;</span>
        sections.append(context_prompt + <span class="hljs-string">&quot;\n&quot;</span>.join(context))
    
    <span class="hljs-comment"># response prompt</span>
    response_prompt = <span class="hljs-string">f&quot;&quot;&quot;Based on the above, you can only select a few datasets from the following dataset list to generate appropriate related questions for the selected datasets in order to solve the above problems. The output format is json, where the key is the name of the dataset and the value is the corresponding generated question.

Data Sets:
&quot;&quot;&quot;</span>
    sections.append(response_prompt + <span class="hljs-string">&quot;\n&quot;</span>.join(collection_names))
    
    footer = <span class="hljs-string">&quot;&quot;&quot;Respond exclusively in valid JSON format matching exact JSON schema.

Critical Requirements:
- Include ONLY ONE action type
- Never add unsupported keys
- Exclude all non-JSON text, markdown, or explanations
- Maintain strict JSON syntax&quot;&quot;&quot;</span>
    sections.append(footer)
    <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(sections)
<button class="copy-code-btn"></button></code></pre>
<p>Fazemos com que o LLM retorne uma saída estruturada como JSON, a fim de converter facilmente sua saída em uma decisão sobre o que fazer em seguida.</p>
<h4 id="Search" class="common-anchor-header">Pesquisa</h4><p>Tendo selecionado várias colecções de bases de dados através da etapa anterior, a etapa de pesquisa efectua uma pesquisa de semelhanças com o <a href="https://milvus.io/docs">Milvus</a>. Tal como no post anterior, os dados de origem foram especificados antecipadamente, divididos em pedaços, incorporados e armazenados na base de dados vetorial. Para o DeepSearcher, as fontes de dados, tanto locais como online, devem ser especificadas manualmente. Deixamos a pesquisa online para trabalhos futuros.</p>
<h4 id="Reflection" class="common-anchor-header">Reflexão</h4><p>Ao contrário do post anterior, o DeepSearcher ilustra uma verdadeira forma de reflexão agêntica, introduzindo os resultados anteriores como contexto num prompt que "reflecte" sobre se as perguntas feitas até agora e os pedaços recuperados relevantes contêm quaisquer lacunas informativas. Isto pode ser visto como um passo de análise.</p>
<p>Eis o método para criar a pergunta:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_reflect_prompt</span>(<span class="hljs-params">
   question: <span class="hljs-built_in">str</span>,
   mini_questions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
   mini_chuncks: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
</span>):
    mini_chunk_str = <span class="hljs-string">&quot;&quot;</span>
    <span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(mini_chuncks):
        mini_chunk_str += <span class="hljs-string">f&quot;&quot;&quot;&lt;chunk_<span class="hljs-subst">{i}</span>&gt;\n<span class="hljs-subst">{chunk}</span>\n&lt;/chunk_<span class="hljs-subst">{i}</span>&gt;\n&quot;&quot;&quot;</span>
    reflect_prompt = <span class="hljs-string">f&quot;&quot;&quot;Determine whether additional search queries are needed based on the original query, previous sub queries, and all retrieved document chunks. If further research is required, provide a Python list of up to 3 search queries. If no further research is required, return an empty list.

If the original query is to write a report, then you prefer to generate some further queries, instead return an empty list.

    Original Query: <span class="hljs-subst">{question}</span>
    Previous Sub Queries: <span class="hljs-subst">{mini_questions}</span>
    Related Chunks: 
    <span class="hljs-subst">{mini_chunk_str}</span>
    &quot;&quot;&quot;</span>
   
    
    footer = <span class="hljs-string">&quot;&quot;&quot;Respond exclusively in valid List of str format without any other text.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> reflect_prompt + footer
<button class="copy-code-btn"></button></code></pre>
<p>Mais uma vez, fazemos com que o LLM devolva resultados estruturados, desta vez como dados interpretáveis em Python.</p>
<p>Aqui está um exemplo de novas subconsultas "descobertas" por reflexão depois de responder às subconsultas iniciais acima:</p>
<pre><code translate="no">New search queries <span class="hljs-keyword">for</span> <span class="hljs-built_in">next</span> iteration: [
  <span class="hljs-string">&quot;How have changes in The Simpsons&#x27; voice cast and production team influenced the show&#x27;s evolution over different seasons?&quot;</span>,
  <span class="hljs-string">&quot;What role has The Simpsons&#x27; satire and social commentary played in its adaptation to contemporary issues across decades?&quot;</span>,
  <span class="hljs-string">&#x27;How has The Simpsons addressed and incorporated shifts in media consumption, such as streaming services, into its distribution and content strategies?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conditional-Repeat" class="common-anchor-header">Repetição condicional</h4><p>Ao contrário do nosso post anterior, o DeepSearcher ilustra o fluxo de execução condicional. Depois de refletir sobre se as perguntas e respostas até agora estão completas, se houver perguntas adicionais a fazer, o agente repete os passos acima. É importante notar que o fluxo de execução (um ciclo "while") é uma função da saída LLM em vez de ser codificado. Neste caso, existe apenas uma escolha binária: <em>repetir a pesquisa</em> ou <em>gerar um relatório</em>. Em agentes mais complexos, pode haver várias opções, tais como: <em>seguir uma hiperligação</em>, <em>recuperar partes, armazenar na memória, refletir,</em> etc. Desta forma, a pergunta continua a ser refinada como o agente achar melhor até decidir sair do ciclo e gerar o relatório. No nosso exemplo dos Simpsons, o DeepSearcher efectua mais duas rondas de preenchimento das lacunas com subconsultas extra.</p>
<h3 id="Synthesize" class="common-anchor-header">Sintetizar</h3><p>Finalmente, a pergunta totalmente decomposta e os pedaços recuperados são sintetizados em um relatório com um único prompt. Aqui está o código para criar o prompt:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_final_answer_prompt</span>(<span class="hljs-params">
   question: <span class="hljs-built_in">str</span>, 
   mini_questions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
   mini_chuncks: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
</span>):
    mini_chunk_str = <span class="hljs-string">&quot;&quot;</span>
    <span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(mini_chuncks):
        mini_chunk_str += <span class="hljs-string">f&quot;&quot;&quot;&lt;chunk_<span class="hljs-subst">{i}</span>&gt;\n<span class="hljs-subst">{chunk}</span>\n&lt;/chunk_<span class="hljs-subst">{i}</span>&gt;\n&quot;&quot;&quot;</span>
    summary_prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an AI content analysis expert, good at summarizing content. Please summarize a specific and detailed answer or report based on the previous queries and the retrieved document chunks.

    Original Query: <span class="hljs-subst">{question}</span>
    Previous Sub Queries: <span class="hljs-subst">{mini_questions}</span>
    Related Chunks: 
    <span class="hljs-subst">{mini_chunk_str}</span>
    &quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> summary_prompt
<button class="copy-code-btn"></button></code></pre>
<p>Esta abordagem tem a vantagem, em relação ao nosso protótipo, que analisou cada pergunta separadamente e simplesmente concatenou o resultado, de produzir um relatório em que todas as secções são consistentes entre si, ou seja, não contém informações repetidas ou contraditórias. Um sistema mais complexo poderia combinar aspectos de ambos, utilizando um fluxo de execução condicional para estruturar o relatório, resumir, reescrever, refletir e dinamizar, etc., o que deixamos para trabalho futuro.</p>
<h2 id="Results" class="common-anchor-header">Resultados<button data-href="#Results" class="anchor-icon" translate="no">
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
    </button></h2><p>Aqui está uma amostra do relatório gerado pela consulta "Como Os Simpsons mudaram ao longo do tempo?" com o DeepSeek-R1 passando a página da Wikipédia sobre Os Simpsons como material de origem:</p>
<pre><code translate="no" class="language-txt"><span class="hljs-title class_">Report</span>: <span class="hljs-title class_">The</span> <span class="hljs-title class_">Evolution</span> <span class="hljs-keyword">of</span> <span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> (<span class="hljs-number">1989</span>–<span class="hljs-title class_">Present</span>)
<span class="hljs-number">1.</span> <span class="hljs-title class_">Cultural</span> <span class="hljs-title class_">Impact</span> and <span class="hljs-title class_">Societal</span> <span class="hljs-title class_">Relevance</span>
<span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> debuted <span class="hljs-keyword">as</span> a subversive critique <span class="hljs-keyword">of</span> <span class="hljs-title class_">American</span> middle-<span class="hljs-keyword">class</span> <span class="hljs-title class_">life</span>, gaining notoriety <span class="hljs-keyword">for</span> its bold satire <span class="hljs-keyword">in</span> the 1990s. <span class="hljs-title class_">Initially</span> a countercultural phenomenon, it challenged norms <span class="hljs-keyword">with</span> episodes tackling religion, politics, and consumerism. <span class="hljs-title class_">Over</span> time, its cultural dominance waned <span class="hljs-keyword">as</span> competitors like <span class="hljs-title class_">South</span> <span class="hljs-title class_">Park</span> and <span class="hljs-title class_">Family</span> <span class="hljs-title class_">Guy</span> pushed boundaries further. <span class="hljs-title class_">By</span> the 2010s, the show transitioned <span class="hljs-keyword">from</span> trendsetter to nostalgic institution, balancing legacy appeal <span class="hljs-keyword">with</span> attempts to address modern issues like climate change and <span class="hljs-variable constant_">LGBTQ</span>+ rights, albeit <span class="hljs-keyword">with</span> less societal resonance.
…
<span class="hljs-title class_">Conclusion</span>
<span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> evolved <span class="hljs-keyword">from</span> a radical satire to a television institution, navigating shifts <span class="hljs-keyword">in</span> technology, politics, and audience expectations. <span class="hljs-title class_">While</span> its golden-age brilliance remains unmatched, its adaptability—through streaming, updated humor, and <span class="hljs-variable language_">global</span> outreach—secures its place <span class="hljs-keyword">as</span> a cultural touchstone. <span class="hljs-title class_">The</span> show’s longevity reflects both nostalgia and a pragmatic embrace <span class="hljs-keyword">of</span> change, even <span class="hljs-keyword">as</span> it grapples <span class="hljs-keyword">with</span> the challenges <span class="hljs-keyword">of</span> relevance <span class="hljs-keyword">in</span> a fragmented media landscape.
<button class="copy-code-btn"></button></code></pre>
<p>Encontre <a href="https://drive.google.com/file/d/1GE3rvxFFTKqro67ctTkknryUf-ojhduN/view?usp=sharing">o relatório completo aqui</a>, e <a href="https://drive.google.com/file/d/1EGd16sJDNFnssk9yTd5o9jzbizrY_NS_/view?usp=sharing">um relatório produzido pelo DeepSearcher com o GPT-4o mini</a> para comparação.</p>
<h2 id="Discussion" class="common-anchor-header">Discussão<button data-href="#Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>Apresentámos <a href="https://github.com/zilliztech/deep-searcher">o DeepSearcher</a>, um agente para fazer investigação e escrever relatórios. O nosso sistema foi construído com base na ideia do nosso artigo anterior, acrescentando funcionalidades como o fluxo de execução condicional, o encaminhamento de consultas e uma interface melhorada. Passámos da inferência local com um pequeno modelo de raciocínio quantizado de 4 bits para um serviço de inferência online para o modelo massivo DeepSeek-R1, melhorando qualitativamente o nosso relatório de saída. O DeepSearcher funciona com a maioria dos serviços de inferência, como OpenAI, Gemini, DeepSeek e Grok 3 (em breve!).</p>
<p>Os modelos de raciocínio, especialmente os usados em agentes de pesquisa, são pesados em termos de inferência, e tivemos a sorte de poder usar a oferta mais rápida do DeepSeek-R1 da SambaNova em execução em seu hardware personalizado. Para nossa consulta de demonstração, fizemos sessenta e cinco chamadas para o serviço de inferência DeepSeek-R1 da SambaNova, inserindo cerca de 25 mil tokens, produzindo 22 mil tokens e custando US$ 0,30. Ficámos impressionados com a velocidade da inferência, dado que o modelo contém 671 mil milhões de parâmetros e tem 3/4 de um terabyte de tamanho. <a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency">Saiba mais pormenores aqui!</a></p>
<p>Continuaremos a repetir este trabalho em posts futuros, examinando conceitos agênticos adicionais e o espaço de design dos agentes de investigação. Entretanto, convidamos toda a gente a experimentar o <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>, <a href="https://github.com/zilliztech/deep-searcher">a marcar-nos com uma estrela no GitHub</a> e a partilhar o seu feedback!</p>
<h2 id="Resources" class="common-anchor-header">Recursos<button data-href="#Resources" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p><a href="https://github.com/zilliztech/deep-searcher"><strong>O DeepSearcher de Zilliz</strong></a></p></li>
<li><p>Leitura de fundo: <a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md"><strong><em>"I Built a Deep Research with Open Source-and So Can You!" (Eu construí uma pesquisa profunda com código aberto - e você também pode!)</em></strong></a></p></li>
<li><p><em>"</em><a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency"><strong>SambaNova lança o mais rápido DeepSeek-R1 671B com a mais alta eficiência</strong></a><em>"</em></p></li>
<li><p>DeepSearcher: <a href="https://drive.google.com/file/d/1GE3rvxFFTKqro67ctTkknryUf-ojhduN/view?usp=sharing">Relatório do DeepSeek-R1 sobre Os Simpsons</a></p></li>
<li><p>DeepSearcher: <a href="https://drive.google.com/file/d/1EGd16sJDNFnssk9yTd5o9jzbizrY_NS_/view?usp=sharing">Mini relatório GPT-4o sobre Os Simpsons</a></p></li>
<li><p><a href="https://milvus.io/docs">Base de dados vetorial de código aberto Milvus</a></p></li>
</ul>
