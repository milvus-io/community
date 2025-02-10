---
id: i-built-a-deep-research-with-open-source-so-can-you.md
title: Criei uma investigação profunda com código aberto - e você também pode!
author: Stefan Webb
date: 2025-02-6
desc: >-
  Saiba como criar um agente no estilo Deep Research usando ferramentas de
  código aberto como Milvus, DeepSeek R1 e LangChain.
cover: >-
  assets.zilliz.com/I_Built_a_Deep_Research_with_Open_Source_and_So_Can_You_7eb2a38078.png
tag: Tutorials
tags: 'Deep Research, open source AI, Milvus, LangChain, DeepSeek R1'
recommend: true
canonicalUrl: 'https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deep_research_blog_image_95225226eb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bem, na verdade, um agente com um escopo mínimo que pode raciocinar, planear, usar ferramentas, etc. para realizar pesquisas usando a Wikipédia. Ainda assim, nada mau para umas horas de trabalho...</p>
<p>A menos que resida debaixo de uma rocha, numa caverna ou num remoto mosteiro de montanha, terá ouvido falar do lançamento do <em>Deep Research</em> pela OpenAI a 2 de fevereiro de 2025. Este novo produto promete revolucionar a forma como respondemos a questões que requerem a síntese de grandes quantidades de informação diversa.</p>
<p>O utilizador escreve a sua consulta, seleciona a opção Deep Research e a plataforma pesquisa autonomamente na Web, raciocina sobre o que descobre e sintetiza várias fontes num relatório coerente e totalmente citado. Demora várias ordens de grandeza mais tempo a produzir o seu resultado em relação a um chatbot normal, mas o resultado é mais pormenorizado, mais informado e com mais nuances.</p>
<h2 id="How-does-it-work" class="common-anchor-header">Como é que funciona?<button data-href="#How-does-it-work" class="anchor-icon" translate="no">
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
    </button></h2><p>Mas como é que esta tecnologia funciona, e porque é que a Pesquisa Profunda é uma melhoria notável em relação a tentativas anteriores (como a <em>Pesquisa Profunda</em> da Google - alerta de disputa de marca registada)? Deixaremos esta última questão para uma publicação futura. Quanto à primeira, há sem dúvida muito "molho secreto" subjacente à Pesquisa Profunda. Podemos obter alguns detalhes do post de lançamento da OpenAI, que eu resumo.</p>
<p><strong>A Pesquisa Profunda explora avanços recentes em modelos de fundação especializados para tarefas de raciocínio:</strong></p>
<ul>
<li><p>"...ajustado no próximo modelo de raciocínio OpenAI o3..."</p></li>
<li><p>"...aproveita o raciocínio para pesquisar, interpretar e analisar grandes quantidades de texto..."</p></li>
</ul>
<p><strong>A Deep Research utiliza um fluxo de trabalho agêntico sofisticado com planeamento, reflexão e memória:</strong></p>
<ul>
<li><p>"...aprendeu a planear e executar uma trajetória de vários passos..."</p></li>
<li><p>"...recuando e reagindo a informações em tempo real..."</p></li>
<li><p>"...girando conforme necessário em reação à informação que encontra..."</p></li>
</ul>
<p><strong>A Deep Research é treinada em dados proprietários, usando vários tipos de ajuste fino, o que é provavelmente um componente chave no seu desempenho:</strong></p>
<ul>
<li><p>"...treinado usando aprendizado por reforço de ponta a ponta em tarefas difíceis de navegação e raciocínio em uma variedade de domínios..."</p></li>
<li><p>"...optimizado para navegação na Web e análise de dados..."</p></li>
</ul>
<p>A conceção exacta do fluxo de trabalho agêntico é um segredo, no entanto, podemos construir algo nós próprios com base em ideias bem estabelecidas sobre como estruturar agentes.</p>
<p><strong>Uma nota antes de começarmos</strong>: É fácil deixarmo-nos levar pela febre da IA generativa, especialmente quando é lançado um novo produto que parece ser um passo em frente. No entanto, a Investigação Profunda, como reconhece a OpenAI, tem limitações comuns à tecnologia de IA generativa. Devemos lembrar-nos de pensar criticamente sobre o resultado, uma vez que pode conter factos falsos ("alucinações"), formatação e citações incorrectas, e variar significativamente em qualidade com base na semente aleatória.</p>
<h2 id="Can-I-build-my-own" class="common-anchor-header">Posso construir a minha própria IA?<button data-href="#Can-I-build-my-own" class="anchor-icon" translate="no">
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
    </button></h2><p>Claro que sim! Vamos construir a nossa própria "Investigação Profunda", executada localmente e com ferramentas de código aberto. Estaremos armados apenas com um conhecimento básico de IA generativa, senso comum, algumas horas livres, uma GPU e os programas de código aberto <a href="https://milvus.io/docs">Milvus</a>, <a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">DeepSeek R1</a> e <a href="https://python.langchain.com/docs/introduction/">LangChain</a>.</p>
<p>Não podemos esperar replicar o desempenho da OpenAI, claro, mas o nosso protótipo demonstrará minimamente algumas das ideias-chave provavelmente subjacentes à sua tecnologia, combinando avanços nos modelos de raciocínio com avanços nos fluxos de trabalho agênticos. É importante salientar que, ao contrário da OpenAI, utilizaremos apenas ferramentas de código aberto e poderemos implementar o nosso sistema localmente - o código aberto proporciona-nos certamente uma grande flexibilidade!</p>
<p>Vamos fazer algumas suposições simplificadoras para reduzir o âmbito do nosso projeto:</p>
<ul>
<li><p>Utilizaremos um modo de raciocínio de código aberto destilado e depois <a href="https://zilliz.com/learn/unlock-power-of-vector-quantization-techniques-for-efficient-data-compression-and-retrieval">quantizado</a> para 4 bits que pode ser executado localmente.</p></li>
<li><p>Não faremos nós próprios afinações adicionais no nosso modelo de raciocínio.</p></li>
<li><p>A única ferramenta de que o nosso agente dispõe é a capacidade de descarregar e ler uma página da Wikipédia e efetuar consultas RAG separadas (não teremos acesso a toda a Web).</p></li>
<li><p>O nosso agente só processará dados de texto, não imagens, PDFs, etc.</p></li>
<li><p>O nosso agente não retrocederá nem considerará pivots.</p></li>
<li><p>O nosso agente irá (ainda) não controlar o seu fluxo de execução com base no seu resultado.</p></li>
<li><p>A Wikipédia contém a verdade, toda a verdade e nada mais do que a verdade.</p></li>
</ul>
<p>Utilizaremos <a href="https://milvus.io/docs">o Milvus</a> para a nossa base de dados vetorial, o <a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">DeepSeek R1</a> como modelo de raciocínio e <a href="https://python.langchain.com/docs/introduction/">o LangChain</a> para implementar o RAG. Vamos lá começar!</p>
<custom-h1>Um agente mínimo para pesquisa online</custom-h1><p>Vamos utilizar o nosso modelo mental de como os humanos conduzem a investigação para conceber o fluxo de trabalho do agente:</p>
<h3 id="DefineRefine-Question" class="common-anchor-header">Definir/Refinar pergunta</h3><p>A pesquisa começa com a definição de uma pergunta. Consideramos que a pergunta é a consulta do utilizador, no entanto, utilizamos o nosso modelo de raciocínio para garantir que a pergunta é expressa de uma forma específica, clara e focada. Ou seja, o nosso primeiro passo é reescrever a pergunta e extrair quaisquer subconsultas ou subquestões. Utilizamos eficazmente a especialização dos nossos modelos de base para o raciocínio e um método simples para a saída estruturada JSON.</p>
<p>Aqui está um exemplo de rastreamento de raciocínio quando o DeepSeek refina a pergunta "Como o elenco mudou ao longo do tempo?":</p>
<pre><code translate="no" class="language-text">&lt;think&gt;

Alright, so I need to <span class="hljs-built_in">break</span> down the question <span class="hljs-string">&quot;How has the cast changed over time?&quot;</span> related to the evolution of The Simpsons. Let me think about what aspects are involved here.

First, I know that the cast has changed a lot, but I need to figure out the intermediate questions to approach this. The main question is about changes <span class="hljs-keyword">in</span> the cast over <span class="hljs-keyword">time</span>, so I should consider different areas that contribute to this change.

I guess the first sub-question would be about the original cast members. Who were the main voices and how did they evolve? Then, there might be new cast additions over the years, so another sub-question about that.

Also, some original voice actors have left, so I should include a sub-question about departures. Then, new voice actors joining would be another point.

The show has been popular <span class="hljs-keyword">for</span> a long <span class="hljs-keyword">time</span>, so recurring roles changing might be another aspect. Additionally, the role of the show <span class="hljs-keyword">in</span> society might have influenced casting choices, so a sub-question about that.

Lastly, the overall impact on the cast<span class="hljs-string">&#x27;s careers could be another angle. So, I should list these as sub-questions to cover all aspects.

&lt;/think&gt;
</span><button class="copy-code-btn"></button></code></pre>
<h3 id="Search" class="common-anchor-header">Pesquisa</h3><p>Em seguida, realizamos uma "revisão da literatura" dos artigos da Wikipédia. Por enquanto, lemos um único artigo e deixamos os links de navegação para uma iteração futura. Descobrimos durante a criação de protótipos que a exploração de ligações pode tornar-se muito dispendiosa se cada ligação exigir uma chamada ao modelo de raciocínio. Analisamos o artigo e armazenamos os seus dados na nossa base de dados vetorial, Milvus, como se estivéssemos a tomar notas.</p>
<p>Aqui está um excerto de código que mostra como armazenamos a nossa página da Wikipédia no Milvus utilizando a sua integração LangChain:</p>
<pre><code translate="no" class="language-python">wiki_wiki = wikipediaapi.Wikipedia(user_agent=<span class="hljs-string">&#x27;MilvusDeepResearchBot (&lt;insert your email&gt;)&#x27;</span>, language=<span class="hljs-string">&#x27;en&#x27;</span>)
page_py = wiki_wiki.page(page_title)

text_splitter = RecursiveCharacterTextSplitter(chunk_size=<span class="hljs-number">2000</span>, chunk_overlap=<span class="hljs-number">200</span>)
docs = text_splitter.create_documents([page_py.text])

vectorstore = Milvus.from_documents(  <span class="hljs-comment"># or Zilliz.from_documents</span>
    documents=docs,
    embedding=embeddings,
    connection_args={
        <span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;./milvus_demo.db&quot;</span>,
    },
    drop_old=<span class="hljs-literal">True</span>, 
    index_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
        <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;FLAT&quot;</span>,  
        <span class="hljs-string">&quot;params&quot;</span>: {},
    },
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Analyze" class="common-anchor-header">Analisar</h3><p>O agente regressa às suas perguntas e responde-lhes com base nas informações relevantes do documento. Deixaremos um fluxo de trabalho de análise/reflexão em várias etapas para trabalho futuro, bem como qualquer pensamento crítico sobre a credibilidade e a parcialidade das nossas fontes.</p>
<p>Eis um excerto de código que ilustra a construção de um RAG com LangChain e a resposta às nossas subquestões separadamente.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Define the RAG chain for response generation</span>
rag_chain = (
    {<span class="hljs-string">&quot;context&quot;</span>: retriever | format_docs, <span class="hljs-string">&quot;question&quot;</span>: RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

<span class="hljs-comment"># Prompt the RAG for each question</span>
answers = {}
total = <span class="hljs-built_in">len</span>(leaves(breakdown))

pbar = tqdm(total=total)
<span class="hljs-keyword">for</span> k, v <span class="hljs-keyword">in</span> breakdown.items():
    <span class="hljs-keyword">if</span> v == []:
        <span class="hljs-built_in">print</span>(k)
        answers[k] = rag_chain.invoke(k).split(<span class="hljs-string">&#x27;&lt;/think&gt;&#x27;</span>)[-<span class="hljs-number">1</span>].strip()
        pbar.update(<span class="hljs-number">1</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-keyword">for</span> q <span class="hljs-keyword">in</span> v:
            <span class="hljs-built_in">print</span>(q)
            answers[q] = rag_chain.invoke(q).split(<span class="hljs-string">&#x27;&lt;/think&gt;&#x27;</span>)[-<span class="hljs-number">1</span>].strip()
            pbar.update(<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Synthesize" class="common-anchor-header">Sintetizar</h3><p>Depois de o agente ter efectuado a sua pesquisa, cria um esboço estruturado, ou melhor, um esqueleto, das suas descobertas para resumir num relatório. Em seguida, completa cada secção, preenchendo-a com um título de secção e o conteúdo correspondente. Deixamos um fluxo de trabalho mais sofisticado com reflexão, reordenação e reescrita para uma futura iteração. Esta parte do agente envolve planeamento, utilização de ferramentas e memória.</p>
<p>Ver o bloco <a href="https://drive.google.com/file/d/1waKX_NTgiY-47bYE0cI6qD8Cjn3zjrL6/view?usp=sharing">de notas anexo</a> para o código completo e o <a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=drive_link">ficheiro de relatório guardado</a> para exemplos de resultados.</p>
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
    </button></h2><p>A nossa consulta para teste é <em>"Como é que Os Simpsons mudaram ao longo do tempo?"</em> e a fonte de dados é o artigo da Wikipedia sobre "Os Simpsons". Aqui está uma secção do <a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=sharing">relatório gerado</a>:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/result_query_424beba224.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Summary-What-we-built-and-what’s-next" class="common-anchor-header">Resumo: O que criámos e o que se segue<button data-href="#Summary-What-we-built-and-what’s-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Em apenas algumas horas, criámos um fluxo de trabalho agêntico básico que pode raciocinar, planear e obter informações da Wikipédia para gerar um relatório de investigação estruturado. Embora este protótipo esteja longe da Investigação Profunda da OpenAI, demonstra o poder de ferramentas de código aberto como Milvus, DeepSeek e LangChain na construção de agentes de investigação autónomos.</p>
<p>É claro que há muito espaço para melhorias. Futuras iterações poderiam:</p>
<ul>
<li><p>Expandir para além da Wikipédia para pesquisar dinamicamente várias fontes</p></li>
<li><p>Introduzir retrocesso e reflexão para refinar as respostas</p></li>
<li><p>Otimizar o fluxo de execução com base no raciocínio do próprio agente</p></li>
</ul>
<p>O código aberto dá-nos flexibilidade e controlo que o código fechado não dá. Quer se trate de investigação académica, síntese de conteúdos ou assistência baseada em IA, a criação dos nossos próprios agentes de investigação abre possibilidades interessantes. Fique atento ao próximo post, onde exploraremos a adição de recuperação da Web em tempo real, raciocínio em várias etapas e fluxo de execução condicional!</p>
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
<li><p>Notebook: <em>"</em><a href="https://colab.research.google.com/drive/1W5tW8SqWXve7ZwbSb9pVdbt5R2wq105O?usp=sharing"><em>Linha de base para uma investigação profunda de código aberto</em></a><em>"</em></p></li>
<li><p>Relatório: <em>"</em><a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=drive_link"><em>A evolução de Os Simpsons como um programa ao longo do tempo, abrangendo mudanças no conteúdo, humor, desenvolvimento de personagens, animação e seu papel na sociedade.</em></a><em>"</em></p></li>
<li><p><a href="https://milvus.io/docs">Documentação da base de dados vetorial Milvus</a></p></li>
<li><p><a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">Página do modelo DeepSeek R1 destilado e quantizado</a></p></li>
<li><p><a href="https://python.langchain.com/docs/introduction/">️🔗 LangChain</a></p></li>
<li><p><a href="https://help.openai.com/en/articles/10500283-deep-research-faq">Perguntas frequentes sobre pesquisa profunda | Centro de ajuda OpenAI</a></p></li>
</ul>
