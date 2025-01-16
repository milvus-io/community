---
id: introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md
title: >-
  Apresentamos o Milvus 2.5: Pesquisa de texto integral, filtragem de metadados
  mais potente e melhorias na usabilidade!
author: 'Ken Zhang, Stefan Webb, Jiang Chen'
date: 2024-12-17T00:00:00.000Z
cover: assets.zilliz.com/Introducing_Milvus_2_5_e4968e1cdb.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md
---
<h2 id="Overview" class="common-anchor-header">Visão geral<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Temos o prazer de apresentar a última versão do Milvus, 2.5, que introduz uma nova e poderosa capacidade: <a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">a pesquisa de texto integral</a>, também conhecida como pesquisa lexical ou por palavras-chave. Se ainda não conhece a pesquisa, a pesquisa de texto integral permite-lhe encontrar documentos através da pesquisa de palavras ou frases específicas nos mesmos, à semelhança do que acontece no Google. Isto complementa as nossas capacidades de pesquisa semântica existentes, que compreendem o significado subjacente à sua pesquisa em vez de corresponderem apenas a palavras exactas.</p>
<p>Utilizamos a métrica BM25 padrão da indústria para a semelhança de documentos, e a nossa implementação baseia-se em vectores esparsos, permitindo um armazenamento e recuperação mais eficientes. Para quem não está familiarizado com o termo, os vectores esparsos são uma forma de representar texto em que a maioria dos valores são zero, tornando-os muito eficientes para armazenar e processar - imagine uma folha de cálculo enorme em que apenas algumas células contêm números e as restantes estão vazias. Esta abordagem enquadra-se bem na filosofia do produto Milvus, em que o vetor é a principal entidade de pesquisa.</p>
<p>Um aspeto adicional digno de nota da nossa implementação é a capacidade de inserir e consultar texto <em>diretamente</em>, em vez de os utilizadores terem de converter manualmente o texto em vectores esparsos. Isto faz com que o Milvus dê mais um passo em direção ao processamento completo de dados não estruturados.</p>
<p>Mas isto é apenas o começo. Com o lançamento da versão 2.5, actualizámos o <a href="https://milvus.io/docs/roadmap.md">roadmap do produto Milvus</a>. Nas futuras iterações do produto Milvus, o nosso foco será a evolução das capacidades do Milvus em quatro direcções principais:</p>
<ul>
<li>Processamento simplificado de dados não estruturados;</li>
<li>Melhor qualidade e eficiência da pesquisa;</li>
<li>Gestão de dados mais fácil;</li>
<li>Redução dos custos através de avanços algorítmicos e de conceção</li>
</ul>
<p>O nosso objetivo é criar uma infraestrutura de dados que possa armazenar e recuperar informações de forma eficiente na era da IA.</p>
<h2 id="Full-text-Search-via-Sparse-BM25" class="common-anchor-header">Pesquisa de texto integral através de Sparse-BM25<button data-href="#Full-text-Search-via-Sparse-BM25" class="anchor-icon" translate="no">
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
    </button></h2><p>Embora a pesquisa semântica tenha normalmente uma melhor consciência contextual e uma melhor compreensão da intenção, quando um utilizador precisa de pesquisar nomes próprios específicos, números de série ou uma frase completamente correspondente, a recuperação de texto integral com correspondência de palavras-chave produz frequentemente resultados mais precisos.</p>
<p>Para ilustrar isto com um exemplo:</p>
<ul>
<li>A pesquisa semântica é excelente quando se pede: "Encontrar documentos sobre soluções de energias renováveis"</li>
<li>A pesquisa de texto integral é melhor quando é necessário: &quot;Encontrar documentos que mencionem <em>o Tesla Model 3 2024</em>&quot;</li>
</ul>
<p>Na nossa versão anterior (Milvus 2.4), os utilizadores tinham de pré-processar o seu texto utilizando uma ferramenta separada (o módulo BM25EmbeddingFunction do PyMilvus) nas suas próprias máquinas antes de o poderem pesquisar Esta abordagem tinha várias limitações: não conseguia lidar bem com conjuntos de dados em crescimento, exigia passos de configuração adicionais e tornava todo o processo mais complicado do que o necessário. Para os mais técnicos, as principais limitações eram que só podia funcionar numa única máquina; o vocabulário e outras estatísticas do corpus utilizadas para a pontuação BM25 não podiam ser actualizadas à medida que o corpus mudava; e a conversão de texto em vectores no lado do cliente é menos intuitiva quando se trabalha diretamente com o texto.</p>
<p>O Milvus 2.5 simplifica tudo. Agora pode trabalhar diretamente com o seu texto:</p>
<ul>
<li>Armazenar os seus documentos de texto originais tal como estão</li>
<li>Pesquisar com consultas em linguagem natural</li>
<li>Obter resultados em formato legível</li>
</ul>
<p>Nos bastidores, o Milvus trata automaticamente de todas as conversões vectoriais complexas, facilitando o trabalho com dados de texto. É a isto que chamamos a nossa abordagem "Doc in, Doc out" - o utilizador trabalha com texto legível e nós tratamos do resto.</p>
<h3 id="Techical-Implementation" class="common-anchor-header">Implementação técnica</h3><p>Para os interessados nos detalhes técnicos, o Milvus 2.5 adiciona a capacidade de pesquisa de texto completo através da sua implementação Sparse-BM25 incorporada, incluindo:</p>
<ul>
<li><strong>Um Tokenizer construído em tantivy</strong>: Milvus agora integra-se com o próspero ecossistema tantivy</li>
<li><strong>Capacidade de ingerir e recuperar documentos em bruto</strong>: Suporte para ingestão direta e consulta de dados de texto</li>
<li><strong>Pontuação de relevância BM25</strong>: Internalização da pontuação BM25, implementada com base num vetor esparso</li>
</ul>
<p>Optámos por trabalhar com o ecossistema bem desenvolvido do tantivy e construir o tokenizador de texto Milvus no tantivy. No futuro, o Milvus irá suportar mais tokenizadores e expor o processo de tokenização para ajudar os utilizadores a compreender melhor a qualidade da recuperação. Também exploraremos tokenizadores baseados em aprendizado profundo e estratégias de stemmer para otimizar ainda mais o desempenho da pesquisa de texto completo. Abaixo está o código de exemplo para usar e configurar o tokenizador:</p>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Tokenizer configuration</span>
schema.add_field(
    field_name=<span class="hljs-string">&#x27;text&#x27;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">65535</span>,
    enable_analyzer=<span class="hljs-literal">True</span>, <span class="hljs-comment"># Enable tokenizer on this column</span>
    analyzer_params={<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>},  <span class="hljs-comment"># Configure tokenizer parameters, here we choose the english template, fine-grained configuration is also supported</span>
    enable_match=<span class="hljs-literal">True</span>, <span class="hljs-comment"># Build an inverted index for Text_Match</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Depois de configurar o tokenizador no esquema de coleção, os utilizadores podem registar o texto na função bm25 através do método add_function. Esta função será executada internamente no servidor Milvus. Todos os fluxos de dados subsequentes, tais como adições, eliminações, modificações e consultas, podem ser completados operando sobre a cadeia de texto em bruto, por oposição à representação vetorial. Ver abaixo o exemplo de código para saber como ingerir texto e efetuar pesquisas de texto integral com a nova API:</p>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Define the mapping relationship between raw text data and vectors on the schema</span>
bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25_emb&quot;</span>,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>], <span class="hljs-comment"># Input text field</span>
    output_field_names=[<span class="hljs-string">&quot;sparse&quot;</span>], <span class="hljs-comment"># Internal mapping sparse vector field</span>
    function_type=FunctionType.BM25, <span class="hljs-comment"># Model for processing mapping relationship</span>
)

schema.add_function(bm25_function)
...
<span class="hljs-comment"># Support for raw text in/out</span>
MilvusClient.insert(<span class="hljs-string">&#x27;demo&#x27;</span>, [
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Artificial intelligence was founded as an academic discipline in 1956.&#x27;</span>},
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;</span>},
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Born in Maida Vale, London, Turing was raised in southern England.&#x27;</span>},
])

MilvusClient.search(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>,
    data=[<span class="hljs-string">&#x27;Who started AI research?&#x27;</span>],
    anns_field=<span class="hljs-string">&#x27;sparse&#x27;</span>,
    limit=<span class="hljs-number">3</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Adoptámos uma implementação da pontuação de relevância BM25 que representa as consultas e os documentos como vectores esparsos, designada <strong>Sparse-BM25</strong>. Isto desbloqueia muitas optimizações baseadas em vectores esparsos, tais como:</p>
<p>O Milvus consegue capacidades de pesquisa híbridas através da sua <strong>implementação de</strong> ponta <strong>Sparse-BM25</strong>, que integra a pesquisa de texto completo na arquitetura da base de dados vetorial. Ao representar as frequências dos termos como vectores esparsos em vez dos tradicionais índices invertidos, o Sparse-BM25 permite optimizações avançadas, como a <strong>indexação gráfica</strong>, <strong>a quantização de produtos (PQ)</strong> e <strong>a quantização escalar (SQ)</strong>. Estas optimizações minimizam a utilização de memória e aceleram o desempenho da pesquisa. Semelhante à abordagem de índice invertido, o Milvus suporta a utilização de texto em bruto como entrada e gera internamente vectores esparsos. Isto torna-o capaz de trabalhar com qualquer tokenizador e compreender qualquer palavra apresentada no corpus que muda dinamicamente.</p>
<p>Além disso, a poda baseada na heurística elimina os vectores esparsos de baixo valor, aumentando ainda mais a eficiência sem comprometer a precisão. Ao contrário da abordagem anterior que utiliza vectores esparsos, pode adaptar-se a um corpus em crescimento, e não à precisão da pontuação BM25.</p>
<ol>
<li>Construir índices gráficos no vetor esparso, que tem melhor desempenho do que o índice invertido em consultas com texto longo, uma vez que o índice invertido necessita de mais passos para terminar a correspondência dos tokens na consulta;</li>
<li>Utilização de técnicas de aproximação para acelerar a pesquisa com um impacto mínimo na qualidade da recuperação, como a quantização do vetor e a poda baseada em heurísticas;</li>
<li>Unificar a interface e o modelo de dados para efetuar a pesquisa semântica e a pesquisa de texto integral, melhorando assim a experiência do utilizador.</li>
</ol>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Creating an index on the sparse column</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,  <span class="hljs-comment"># Default WAND index</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span> <span class="hljs-comment"># Configure relevance scoring through metric_type</span>
)

<span class="hljs-comment"># Configurable parameters at search time to speed up search</span>
search_params = {
    <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;drop_ratio_search&#x27;</span>: <span class="hljs-number">0.6</span>}, <span class="hljs-comment"># WAND search parameter configuration can speed up search</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>Em resumo, o Milvus 2.5 expandiu a sua capacidade de pesquisa para além da pesquisa semântica, introduzindo a recuperação de texto integral, facilitando aos utilizadores a criação de aplicações de IA de elevada qualidade. Estes são apenas passos iniciais no espaço da pesquisa Sparse-BM25 e prevemos que haverá mais medidas de otimização a experimentar no futuro.</p>
<h2 id="Text-Matching-Search-Filters" class="common-anchor-header">Filtros de pesquisa de correspondência de texto<button data-href="#Text-Matching-Search-Filters" class="anchor-icon" translate="no">
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
    </button></h2><p>Uma segunda funcionalidade de pesquisa de texto lançada com o Milvus 2.5 é a <strong>Correspondência de Texto</strong>, que permite ao utilizador filtrar a pesquisa para entradas que contenham uma cadeia de texto específica. Esta funcionalidade também é construída com base na tokenização e é activada com <code translate="no">enable_match=True</code>.</p>
<p>Vale a pena notar que, com a Correspondência de texto, o processamento do texto da consulta é baseado na lógica de OU após a tokenização. Por exemplo, no exemplo abaixo, o resultado devolverá todos os documentos (utilizando o campo "texto") que contenham "vetor" ou "base de dados".</p>
<pre><code translate="no" class="language-Python"><span class="hljs-built_in">filter</span> = <span class="hljs-string">&quot;TEXT_MATCH(text, &#x27;vector database&#x27;)&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Se o seu cenário exigir a correspondência de "vetor" e "base de dados", terá de escrever duas correspondências de texto separadas e sobrepô-las com AND para atingir o seu objetivo.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-built_in">filter</span> = <span class="hljs-string">&quot;TEXT_MATCH(text, &#x27;vector&#x27;) and TEXT_MATCH(text, &#x27;database&#x27;)&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Significant-Enhancement-in-Scalar-Filtering-Performance" class="common-anchor-header">Melhoria significativa no desempenho da filtragem escalar<button data-href="#Significant-Enhancement-in-Scalar-Filtering-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>A nossa ênfase no desempenho da filtragem escalar tem origem na nossa descoberta de que a combinação da recuperação vetorial e da filtragem de metadados pode melhorar significativamente o desempenho e a precisão das consultas em vários cenários. Estes cenários vão desde aplicações de pesquisa de imagens, tais como a identificação de casos de canto na condução autónoma, até cenários RAG complexos em bases de dados de conhecimentos empresariais. Assim, é altamente adequado para os utilizadores empresariais implementarem em cenários de aplicação de dados em grande escala.</p>
<p>Na prática, muitos factores, como a quantidade de dados a filtrar, a forma como os dados estão organizados e a forma como a pesquisa é efectuada, podem afetar o desempenho. Para resolver isso, o Milvus 2.5 apresenta três novos tipos de índices - Índice BitMap, Índice Invertido de Matriz e Índice Invertido após a tokenização do campo de texto Varchar. Esses novos índices podem melhorar significativamente o desempenho em casos reais de uso.</p>
<p>Especificamente:</p>
<ol>
<li><strong>O índice BitMap</strong> pode ser usado para acelerar a filtragem de tags (operadores comuns incluem in, array_contains, etc.) e é adequado para cenários com menos dados de categoria de campo (cardinalidade de dados). O princípio é determinar se uma linha de dados tem um determinado valor numa coluna, com 1 para sim e 0 para não, e depois manter uma lista BitMap. O gráfico seguinte mostra a comparação do teste de desempenho que efectuámos com base no cenário comercial de um cliente. Neste cenário, o volume de dados é de 500 milhões, a categoria de dados é 20, diferentes valores têm diferentes proporções de distribuição (1%, 5%, 10%, 50%) e o desempenho sob diferentes quantidades de filtragem também varia. Com 50% de filtragem, podemos obter um ganho de desempenho de 6,8 vezes através do BitMap Index. É de salientar que, à medida que a cardinalidade aumenta, em comparação com o BitMap Index, o Inverted Index apresenta um desempenho mais equilibrado.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/QPS_comparison_f3f580d697.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li><strong>O Text Match</strong> é baseado no Inverted Index depois que o campo de texto é tokenizado. O seu desempenho excede em muito a função Wildcard Match (ou seja, like + %) que fornecemos em 2.4. De acordo com os resultados dos nossos testes internos, as vantagens do Text Match são muito claras, especialmente em cenários de consulta simultânea, onde pode atingir um aumento de até 400 vezes no QPS.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_size_and_concurrency_e19dc44c59.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Em termos de processamento de dados JSON, planeamos introduzir em versões subsequentes da 2.5.x a construção de índices invertidos para chaves especificadas pelo utilizador e o registo de informações de localização predefinidas para todas as chaves para acelerar a análise. Esperamos que estas duas áreas melhorem significativamente o desempenho da consulta de JSON e Dynamic Field. Planeamos apresentar mais informações em futuras notas de versão e blogues técnicos, por isso, fique atento!</p>
<h2 id="New-Management-Interface" class="common-anchor-header">Nova interface de gestão<button data-href="#New-Management-Interface" class="anchor-icon" translate="no">
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
    </button></h2><p>Gerir uma base de dados não deveria exigir um diploma de informática, mas sabemos que os administradores de bases de dados precisam de ferramentas poderosas. É por isso que introduzimos a <strong>WebUI de gestão de clusters</strong>, uma nova interface baseada na Web acessível no endereço do seu cluster na porta 9091/webui. Esta ferramenta de observabilidade fornece:</p>
<ul>
<li>Painéis de monitorização em tempo real que mostram as métricas de todo o cluster</li>
<li>Análise detalhada de memória e desempenho por nó</li>
<li>Informações de segmento e rastreamento de consultas lentas</li>
<li>Indicadores de integridade do sistema e status do nó</li>
<li>Ferramentas de resolução de problemas fáceis de utilizar para problemas complexos do sistema</li>
</ul>
<p>Embora esta interface ainda esteja em fase beta, estamos a desenvolvê-la ativamente com base no feedback dos utilizadores dos administradores de bases de dados. As futuras actualizações incluirão diagnósticos assistidos por IA, funcionalidades de gestão mais interactivas e capacidades melhoradas de observabilidade do cluster.</p>
<h2 id="Documentation-and-Developer-Experience" class="common-anchor-header">Documentação e experiência do desenvolvedor<button data-href="#Documentation-and-Developer-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p>Renovámos completamente a nossa <strong>documentação</strong> e experiência <strong>SDK/API</strong> para tornar o Milvus mais acessível, mantendo a profundidade para utilizadores experientes. As melhorias incluem:</p>
<ul>
<li>Um sistema de documentação reestruturado com uma progressão mais clara dos conceitos básicos aos avançados</li>
<li>Tutoriais interactivos e exemplos do mundo real que mostram implementações práticas</li>
<li>Referências API abrangentes com exemplos práticos de código</li>
<li>Um design de SDK mais fácil de utilizar que simplifica as operações comuns</li>
<li>Guias ilustrados que facilitam a compreensão de conceitos complexos</li>
<li>Um assistente de documentação alimentado por IA (ASK AI) para respostas rápidas</li>
</ul>
<p>O SDK/API atualizado centra-se na melhoria da experiência do programador através de interfaces mais intuitivas e de uma melhor integração com a documentação. Acreditamos que irá notar estas melhorias quando trabalhar com a série 2.5.x.</p>
<p>No entanto, sabemos que o desenvolvimento da documentação e do SDK é um processo contínuo. Continuaremos a otimizar a estrutura do conteúdo e o design do SDK com base no feedback da comunidade. Junte-se ao nosso canal Discord para partilhar as suas sugestões e ajudar-nos a melhorar ainda mais.</p>
<h2 id="Summary" class="common-anchor-header"><strong>Resumo</strong><button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus 2.5 contém 13 novas funcionalidades e várias optimizações ao nível do sistema, contribuídas não só pela Zilliz mas também pela comunidade open-source. Apenas abordámos algumas delas neste post e encorajamo-lo a visitar a nossa <a href="https://milvus.io/docs/release_notes.md">nota de lançamento</a> e <a href="https://milvus.io/docs">os documentos oficiais</a> para mais informações!</p>
