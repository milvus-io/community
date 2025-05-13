---
id: how-to-filter-efficiently-without-killing-recall.md
title: >-
  Pesquisa vetorial no mundo real: como filtrar eficazmente sem prejudicar a
  recordação
author: Chris Gao and Patrick Xu
date: 2025-05-12T00:00:00.000Z
desc: >-
  Este blogue explora técnicas de filtragem populares na pesquisa vetorial,
  juntamente com as optimizações inovadoras que incorporámos no Milvus e no
  Zilliz Cloud.
cover: assets.zilliz.com/Filter_Efficiently_Without_Killing_Recall_1c355c229c.png
tag: Engineering
tags: 'Vector search, filtering vector search, vector search with filtering'
recommend: true
canonicalUrl: 'https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md'
---
<p>Muitas pessoas pensam que a pesquisa vetorial consiste simplesmente em implementar um algoritmo ANN (Approximate Nearest Neighbor) e ficar por aí. Mas se executar a pesquisa vetorial em produção, sabe a verdade: torna-se complicado rapidamente.</p>
<p>Imagine que está a criar um motor de pesquisa de produtos. Um utilizador pode pedir: "<em>Mostre-me sapatos semelhantes a esta fotografia, mas apenas em vermelho e abaixo de 100 dólares</em>". Para responder a esta consulta é necessário aplicar um filtro de metadados aos resultados da pesquisa de semelhança semântica. Parece tão simples como aplicar um filtro após os resultados da pesquisa de vectores? Bem, não é bem assim.</p>
<p>O que acontece quando a condição de filtragem é altamente seletiva? Pode não devolver resultados suficientes. E o simples aumento do parâmetro <strong>topK</strong> da pesquisa vetorial pode degradar rapidamente o desempenho e consumir significativamente mais recursos para tratar o mesmo volume de pesquisa.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Show_me_shoes_similar_to_this_photo_but_only_in_red_and_under_100_0862a41a60.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nos bastidores, a filtragem eficiente de metadados é bastante desafiadora. Seu banco de dados vetorial precisa examinar o índice gráfico, aplicar filtros de metadados e ainda responder dentro de um orçamento de latência apertado, digamos, 20 milissegundos. Atender a milhares de consultas desse tipo por segundo sem ir à falência requer uma engenharia cuidadosa e uma otimização cuidadosa.</p>
<p>Este blogue explora técnicas de filtragem populares na pesquisa vetorial, juntamente com as optimizações inovadoras que incorporámos na base de dados vetorial <a href="https://milvus.io/docs/overview.md">Milvus</a> e no seu serviço de nuvem totalmente gerido<a href="https://zilliz.com/cloud">(Zilliz Cloud</a>). Também partilharemos um teste de referência que demonstra quanto mais desempenho o Milvus totalmente gerido pode alcançar com um orçamento de 1000 dólares na nuvem em relação a outras bases de dados vectoriais.</p>
<h2 id="Graph-Index-Optimization" class="common-anchor-header">Otimização de índice de gráfico<button data-href="#Graph-Index-Optimization" class="anchor-icon" translate="no">
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
    </button></h2><p>Os bancos de dados vetoriais precisam de métodos de indexação eficientes para lidar com grandes conjuntos de dados. Sem índices, uma base de dados tem de comparar a sua consulta com todos os vectores do conjunto de dados (varrimento de força bruta), o que se torna extremamente lento à medida que os dados crescem.</p>
<p><strong>O Milvus</strong> suporta vários tipos de índices para resolver este desafio de desempenho. Os mais populares são os tipos de índices baseados em grafos: HNSW (é executado inteiramente na memória) e DiskANN (usa eficientemente a memória e o SSD). Estes índices organizam os vectores numa estrutura de rede em que as vizinhanças dos vectores estão ligadas num mapa, permitindo que as pesquisas naveguem rapidamente para resultados relevantes, verificando apenas uma pequena fração de todos os vectores. <strong>O Zilliz Cloud</strong>, o serviço Milvus totalmente gerido, dá um passo em frente ao introduzir o Cardinal, um avançado motor de pesquisa de vectores proprietário, que melhora ainda mais estes índices para um desempenho ainda melhor.</p>
<p>No entanto, quando adicionamos requisitos de filtragem (como "mostrar apenas produtos inferiores a 100 dólares"), surge um novo problema. A abordagem padrão é criar um <em>conjunto de bits</em> - uma lista que marca os vectores que satisfazem os critérios de filtragem. Durante a pesquisa, o sistema apenas considera os vectores marcados como válidos neste conjunto de bits. Esta abordagem parece lógica, mas cria um problema grave: <strong>a quebra de conetividade</strong>. Quando muitos vectores são filtrados, os caminhos cuidadosamente construídos no nosso índice gráfico são interrompidos.</p>
<p>Eis um exemplo simples do problema: no diagrama abaixo, o ponto A liga-se a B, C e D, mas B, C e D não se ligam diretamente uns aos outros. Se o nosso filtro remover o ponto A (talvez seja demasiado caro), mesmo que B, C e D sejam relevantes para a nossa pesquisa, o caminho entre eles é interrompido. Isto cria "ilhas" de vectores desconectados que se tornam inacessíveis durante a pesquisa, prejudicando a qualidade dos resultados (recordação).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/simple_example_of_the_problem_0f09b36639.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Existem duas abordagens comuns à filtragem durante a travessia do grafo: excluir antecipadamente todos os pontos filtrados ou incluir tudo e aplicar o filtro posteriormente. Como ilustrado no diagrama abaixo, nenhuma das abordagens é ideal. Saltar completamente os pontos filtrados pode causar o colapso da recordação à medida que o rácio de filtragem se aproxima de 1 (linha azul), enquanto visitar todos os pontos, independentemente dos seus metadados, incha o espaço de pesquisa e diminui significativamente o desempenho (linha vermelha).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Filtering_ratio_911e32783b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Os investigadores propuseram várias abordagens para encontrar um equilíbrio entre a recuperação e o desempenho:</p>
<ol>
<li><strong>Estratégia Alfa:</strong> Introduz uma abordagem probabilística: mesmo que um vetor não corresponda ao filtro, podemos visitá-lo durante a pesquisa com alguma probabilidade. Esta probabilidade (alfa) depende do rácio de filtragem - quão rigoroso é o filtro. Isto ajuda a manter as ligações essenciais no grafo sem visitar demasiados vectores irrelevantes.</li>
</ol>
<ol start="2">
<li><strong>Método ACORN [1]:</strong> No HNSW padrão, a poda de arestas é utilizada durante a construção do índice para criar um grafo esparso e acelerar a pesquisa. O método ACORN salta deliberadamente este passo de poda para reter mais arestas e reforçar a conetividade - crucial quando os filtros podem excluir muitos nós. Nalguns casos, o ACORN também expande a lista de vizinhos de cada nó, reunindo vizinhos mais próximos aproximados adicionais, reforçando ainda mais o grafo. Além disso, o seu algoritmo de travessia olha dois passos à frente (ou seja, examina os vizinhos dos vizinhos), aumentando as hipóteses de encontrar caminhos válidos mesmo com rácios de filtragem elevados.</li>
</ol>
<ol start="3">
<li><strong>Vizinhos selecionados dinamicamente:</strong> Um método que melhora a Estratégia Alfa. Em vez de se basear em saltos probabilísticos, esta abordagem seleciona de forma adaptativa os nós seguintes durante a pesquisa. Oferece mais controlo do que a Estratégia Alfa.</li>
</ol>
<p>No Milvus, implementámos a estratégia Alfa juntamente com outras técnicas de otimização. Por exemplo, ela muda dinamicamente de estratégia quando detecta filtros extremamente selectivos: quando, digamos, cerca de 99% dos dados não correspondem à expressão de filtragem, a estratégia "incluir tudo" faria com que os caminhos de travessia do grafo se alongassem significativamente, resultando numa degradação do desempenho e em "ilhas" isoladas de dados. Nestes casos, o Milvus recorre automaticamente a uma pesquisa de força bruta, contornando totalmente o índice gráfico para uma maior eficiência. No Cardinal, o motor de pesquisa vetorial que alimenta o Milvus totalmente gerido (Zilliz Cloud), levámos isto mais longe, implementando uma combinação dinâmica de métodos de passagem "incluir tudo" e "excluir tudo" que se adapta de forma inteligente com base nas estatísticas dos dados para otimizar o desempenho da consulta.</p>
<p>As nossas experiências no conjunto de dados Cohere 1M (dimensão = 768) utilizando uma instância AWS r7gd.4xlarge demonstram a eficácia desta abordagem. No gráfico abaixo, a linha azul representa a nossa estratégia de combinação dinâmica, enquanto a linha vermelha ilustra a abordagem de base que percorre todos os pontos filtrados no gráfico.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Graph_2_067a13500b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Metadata-Aware-Indexing" class="common-anchor-header">Indexação com reconhecimento de metadados<button data-href="#Metadata-Aware-Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>Outro desafio vem da forma como os metadados e as incorporações vectoriais se relacionam entre si. Na maioria das aplicações, as propriedades de metadados de um item (por exemplo, o preço de um produto) têm uma relação mínima com o que o vetor representa realmente (o significado semântico ou as caraterísticas visuais). Por exemplo, um <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">vestido</annotation><mrow><mi>90dressanda90</mi></mrow><annotation encoding="application/x-tex">e um</annotation></semantics></math></span></span>cinto <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord mathnormal">90dressanda90</span></span></span></span>partilham o mesmo preço, mas apresentam caraterísticas visuais completamente diferentes. Esta desconexão torna a combinação da filtragem com a pesquisa vetorial inerentemente ineficiente.</p>
<p>Para resolver este problema, desenvolvemos <strong>índices vectoriais sensíveis a metadados</strong>. Em vez de ter apenas um gráfico para todos os vectores, constrói "subgráficos" especializados para diferentes valores de metadados. Por exemplo, se os seus dados tiverem campos para "cor" e "forma", ele cria estruturas gráficas separadas para esses campos.</p>
<p>Quando pesquisa com um filtro como "cor = azul", utiliza o subgrafo específico da cor em vez do gráfico principal. Isto é muito mais rápido porque o subgráfico já está organizado em torno dos metadados pelos quais está a filtrar.</p>
<p>Na figura abaixo, o índice do gráfico principal é chamado de <strong>gráfico base</strong>, enquanto os gráficos especializados criados para campos de metadados específicos são chamados de <strong>gráficos de colunas</strong>. Para gerir eficazmente a utilização da memória, limita o número de ligações que cada ponto pode ter (grau de saída). Quando uma pesquisa não inclui nenhum filtro de metadados, ele usa o gráfico base por padrão. Quando os filtros são aplicados, ele muda para o gráfico de colunas apropriado, oferecendo uma vantagem significativa de velocidade.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Metadata_Aware_Indexing_7c3e0707d9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Iterative-Filtering" class="common-anchor-header">Filtragem iterativa<button data-href="#Iterative-Filtering" class="anchor-icon" translate="no">
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
    </button></h2><p>Às vezes, a própria filtragem se torna o gargalo, não a pesquisa vetorial. Isso acontece especialmente com filtros complexos, como condições JSON ou comparações detalhadas de strings. A abordagem tradicional (filtrar primeiro e depois pesquisar) pode ser extremamente lenta porque o sistema tem de avaliar estes filtros dispendiosos em potencialmente milhões de registos antes mesmo de iniciar a pesquisa vetorial.</p>
<p>Poderá pensar: "Porque não fazer primeiro a pesquisa vetorial e depois filtrar os melhores resultados?" Esta abordagem funciona por vezes, mas tem uma grande falha: se o seu filtro for rigoroso e filtrar a maioria dos resultados, pode acabar com muito poucos (ou zero) resultados após a filtragem.</p>
<p>Para resolver este dilema, criámos a <strong>Filtragem iterativa</strong> no Milvus e no Zilliz Cloud, inspirada no<a href="https://www.usenix.org/system/files/osdi23-zhang-qianxi_1.pdf"> VBase</a>. Em vez de uma abordagem do tipo "tudo ou nada", a filtragem iterativa funciona em lotes:</p>
<ol>
<li><p>Obter um lote das correspondências vectoriais mais próximas</p></li>
<li><p>Aplicar filtros a este lote</p></li>
<li><p>Se não tivermos resultados filtrados suficientes, obtemos outro lote</p></li>
<li><p>Repetir até obtermos o número necessário de resultados</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Iterative_Filtering_b65a057559.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Esta abordagem reduz drasticamente o número de operações de filtragem dispendiosas que precisamos de efetuar, garantindo ao mesmo tempo que obtemos resultados de alta qualidade suficientes. Para obter mais informações sobre como ativar a filtragem iterativa, consulte esta <a href="https://docs.zilliz.com/docs/filtered-search#iterative-filtering">página de documentação sobre filtragem iterativa</a>.</p>
<h2 id="External-Filtering" class="common-anchor-header">Filtragem externa<button data-href="#External-Filtering" class="anchor-icon" translate="no">
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
    </button></h2><p>Muitas aplicações do mundo real dividem seus dados em diferentes sistemas - vetores em um banco de dados vetorial e metadados em bancos de dados tradicionais. Por exemplo, muitas organizações armazenam descrições de produtos e avaliações de utilizadores como vectores no Milvus para pesquisa semântica, enquanto mantêm o estado do inventário, os preços e outros dados estruturados em bases de dados tradicionais como o PostgreSQL ou o MongoDB.</p>
<p>Esta separação faz sentido do ponto de vista arquitetónico, mas cria um desafio para as pesquisas filtradas. O fluxo de trabalho típico passa a ser:</p>
<ul>
<li><p>Consultar a sua base de dados relacional para obter registos que correspondam a critérios de filtragem (por exemplo, "itens em stock abaixo de 50 dólares")</p></li>
<li><p>Obter os IDs correspondentes e enviá-los para o Milvus para filtrar a pesquisa vetorial</p></li>
<li><p>Efetuar a pesquisa semântica apenas em vectores que correspondam a estes IDs</p></li>
</ul>
<p>Isto parece simples, mas quando o número de linhas ultrapassa os milhões, torna-se um estrangulamento. A transferência de grandes listas de IDs consome a largura de banda da rede, e a execução de expressões de filtragem maciças no Milvus adiciona sobrecarga.</p>
<p>Para resolver isso, introduzimos o <strong>External Filtering</strong> no Milvus, uma solução leve no nível do SDK que usa a API do iterador de pesquisa e inverte o fluxo de trabalho tradicional.</p>
<ul>
<li><p>Executa primeiro a pesquisa vetorial, recuperando lotes dos candidatos mais relevantes semanticamente</p></li>
<li><p>Aplica a sua função de filtro personalizada a cada lote no lado do cliente</p></li>
<li><p>Obtém automaticamente mais lotes até ter resultados filtrados suficientes</p></li>
</ul>
<p>Esta abordagem iterativa e em lotes reduz significativamente o tráfego de rede e a sobrecarga de processamento, uma vez que só está a trabalhar com os candidatos mais promissores da pesquisa vetorial.</p>
<p>Aqui está um exemplo de como usar a Filtragem externa no pymilvus:</p>
<pre><code translate="no">vector_to_search = rng.random((<span class="hljs-number">1</span>, DIM), np.float32)
expr = <span class="hljs-string">f&quot;10 &lt;= <span class="hljs-subst">{AGE}</span> &lt;= 25&quot;</span>
valid_ids = [<span class="hljs-number">1</span>, <span class="hljs-number">12</span>, <span class="hljs-number">123</span>, <span class="hljs-number">1234</span>]

<span class="hljs-keyword">def</span> <span class="hljs-title function_">external_filter_func</span>(<span class="hljs-params">hits: Hits</span>):
    <span class="hljs-keyword">return</span> <span class="hljs-built_in">list</span>(<span class="hljs-built_in">filter</span>(<span class="hljs-keyword">lambda</span> hit: hit.<span class="hljs-built_in">id</span> <span class="hljs-keyword">in</span> valid_ids, hits))

search_iterator = milvus_client.search_iterator(
    collection_name=collection_name,
    data=vector_to_search,
    batch_size=<span class="hljs-number">100</span>,
    anns_field=PICTURE,
    <span class="hljs-built_in">filter</span>=expr,
    external_filter_func=external_filter_func,
    output_fields=[USER_ID, AGE]
)

<span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
    res = search_iterator.<span class="hljs-built_in">next</span>()
    <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(res) == <span class="hljs-number">0</span>:
        search_iterator.close()
        <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(res)):
        <span class="hljs-built_in">print</span>(res[i])
<button class="copy-code-btn"></button></code></pre>
<p>Ao contrário da Filtragem iterativa, que opera em iteradores de nível de segmento, a Filtragem externa funciona no nível de consulta global. Esse design minimiza a avaliação de metadados e evita a execução de grandes filtros dentro do Milvus, resultando em um desempenho mais enxuto e rápido de ponta a ponta.</p>
<h2 id="AutoIndex" class="common-anchor-header">AutoIndexação<button data-href="#AutoIndex" class="anchor-icon" translate="no">
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
    </button></h2><p>A pesquisa vetorial envolve sempre um compromisso entre precisão e velocidade - quanto mais vectores verificar, melhores serão os seus resultados, mas mais lenta será a sua consulta. Quando se adicionam filtros, este equilíbrio torna-se ainda mais difícil de conseguir.</p>
<p>No Zilliz Cloud, criámos <strong>o AutoIndex</strong> - um optimizador baseado em ML que afina automaticamente este equilíbrio por si. Em vez de configurar manualmente parâmetros complexos, o AutoIndex utiliza a aprendizagem automática para determinar as definições ideais para os seus dados específicos e padrões de consulta.</p>
<p>Para compreender como isto funciona, é útil saber um pouco sobre a arquitetura do Milvus, uma vez que o Zilliz é construído sobre o Milvus: As consultas são distribuídas por várias instâncias QueryNode. Cada nó lida com uma parte dos seus dados (um segmento), efectua a sua pesquisa e, em seguida, os resultados são agrupados.</p>
<p>O AutoIndex analisa as estatísticas desses segmentos e faz ajustes inteligentes. Para um rácio de filtragem baixo, o intervalo de consulta do índice é alargado para aumentar a recuperação. Para um rácio de filtragem elevado, o intervalo de consulta é reduzido para evitar o desperdício de esforços em candidatos improváveis. Estas decisões são orientadas por modelos estatísticos que prevêem a estratégia de pesquisa mais eficaz para cada cenário de filtragem específico.</p>
<p>O AutoIndex vai para além dos parâmetros de indexação. Também ajuda a selecionar a melhor estratégia de avaliação de filtros. Ao analisar expressões de filtro e dados de segmento de amostragem, ele pode estimar o custo de avaliação. Se detetar altos custos de avaliação, ele muda automaticamente para técnicas mais eficientes, como Iterative Filtering. Esse ajuste dinâmico garante que você esteja sempre usando a estratégia mais adequada para cada consulta.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Autoindex_3f37988d5c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Performance-on-a-1000-Budget" class="common-anchor-header">Desempenho com um orçamento de $1.000<button data-href="#Performance-on-a-1000-Budget" class="anchor-icon" translate="no">
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
    </button></h2><p>Embora as melhorias teóricas sejam importantes, o desempenho no mundo real é o que interessa à maioria dos programadores. Queríamos testar como essas otimizações se traduzem no desempenho real do aplicativo sob restrições orçamentárias realistas.</p>
<p>Avaliámos várias soluções de bases de dados vectoriais com um orçamento mensal prático de 1000 dólares - um montante razoável que muitas empresas atribuiriam à infraestrutura de pesquisa vetorial. Para cada solução, selecionámos a configuração de instância com o melhor desempenho possível dentro desta restrição orçamental.</p>
<p>Os nossos testes utilizaram:</p>
<ul>
<li><p>O conjunto de dados Cohere 1M com 1 milhão de vectores de 768 dimensões</p></li>
<li><p>Uma mistura de cargas de trabalho de pesquisa filtradas e não filtradas do mundo real</p></li>
<li><p>A ferramenta de benchmark de código aberto vdb-bench para comparações consistentes</p></li>
</ul>
<p>As soluções concorrentes (anonimizadas como "VDB A", "VDB B" e "VDB C") foram todas configuradas de forma óptima dentro do orçamento. Os resultados mostraram que o Milvus (Zilliz Cloud) totalmente gerenciado alcançou consistentemente a maior taxa de transferência em consultas filtradas e não filtradas. Com o mesmo orçamento de 1000 dólares, as nossas técnicas de otimização proporcionam o melhor desempenho a um preço competitivo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Performance_on_a_1_000_Budget_5ebefaec48.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>A pesquisa vetorial com filtragem pode parecer simples à primeira vista - basta adicionar uma cláusula de filtro à sua consulta e pronto. No entanto, como demonstrámos neste blogue, obter um elevado desempenho e resultados precisos em escala requer soluções de engenharia sofisticadas. O Milvus e o Zilliz Cloud abordam estes desafios através de várias abordagens inovadoras:</p>
<ul>
<li><p><strong>Otimização do índice gráfico</strong>: Preserva os caminhos entre itens semelhantes mesmo quando os filtros removem os nós de ligação, evitando o problema das "ilhas" que reduz a qualidade dos resultados.</p></li>
<li><p><strong>Indexação com reconhecimento de metadados</strong>: Cria caminhos especializados para condições de filtragem comuns, tornando as pesquisas filtradas significativamente mais rápidas sem sacrificar a precisão.</p></li>
<li><p><strong>Filtragem iterativa</strong>: Processa os resultados em lotes, aplicando filtros complexos apenas aos candidatos mais promissores em vez de todo o conjunto de dados.</p></li>
<li><p><strong>AutoIndexação</strong>: Utiliza a aprendizagem automática para ajustar automaticamente os parâmetros de pesquisa com base nos seus dados e consultas, equilibrando a velocidade e a precisão sem configuração manual.</p></li>
<li><p><strong>Filtragem externa</strong>: Faz a ponte entre a pesquisa vetorial e as bases de dados externas de forma eficiente, eliminando os estrangulamentos da rede e mantendo a qualidade dos resultados.</p></li>
</ul>
<p>O Milvus e o Zilliz Cloud continuam a evoluir com novas capacidades que melhoram ainda mais o desempenho da pesquisa filtrada. Funcionalidades como a<a href="https://docs.zilliz.com/docs/use-partition-key"> Chave de Partição</a> permitem uma organização de dados ainda mais eficiente com base em padrões de filtragem, e as técnicas avançadas de encaminhamento de subgrafos estão a alargar ainda mais os limites de desempenho.</p>
<p>O volume e a complexidade dos dados não estruturados continuam a crescer exponencialmente, criando novos desafios para os sistemas de pesquisa em todo o lado. A nossa equipa está constantemente a ultrapassar os limites do que é possível com as bases de dados vectoriais para fornecer uma pesquisa mais rápida e mais escalável com base em IA.</p>
<p>Se os seus aplicativos estão atingindo gargalos de desempenho com a pesquisa vetorial filtrada, convidamos você a participar de nossa comunidade de desenvolvedores ativos em <a href="https://milvus.io/community">milvus.io/community</a> - onde você pode compartilhar desafios, acessar orientações de especialistas e descobrir práticas recomendadas emergentes.</p>
<h2 id="References" class="common-anchor-header">Referências<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li><p><a href="https://arxiv.org/pdf/2403.04871">https://arxiv.org/pdf/2403.04871</a></p></li>
<li><p><a href="https://www.usenix.org/system/files/osdi23-zhang-qianxi_1.pdf">https://www.usenix.org/system/files/osdi23-zhang-qianxi_1.pdf</a></p></li>
</ol>
<hr>
