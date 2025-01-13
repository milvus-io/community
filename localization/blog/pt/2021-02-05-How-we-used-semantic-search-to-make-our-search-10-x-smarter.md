---
id: How-we-used-semantic-search-to-make-our-search-10-x-smarter.md
title: Pesquisa baseada em palavras-chave
author: Rahul Yadav
date: 2021-02-05T06:27:15.076Z
desc: >-
  A Tokopedia utilizou a Milvus para criar um sistema de pesquisa 10 vezes mais
  inteligente que melhorou drasticamente a experiência do utilizador.
cover: >-
  assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_1_a7bac91379.jpeg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/How-we-used-semantic-search-to-make-our-search-10-x-smarter
---
<custom-h1>Como utilizámos a pesquisa semântica para tornar a nossa pesquisa 10 vezes mais inteligente</custom-h1><p>Na Tokopedia, compreendemos que o valor do nosso corpus de produtos só é desbloqueado quando os nossos compradores conseguem encontrar produtos que lhes são relevantes, pelo que nos esforçamos por melhorar a relevância dos resultados da pesquisa.</p>
<p>Para promover esse esforço, estamos a introduzir <strong>a pesquisa por semelhança</strong> na Tokopedia. Se aceder à página de resultados de pesquisa em dispositivos móveis, encontrará um botão "..." que expõe um menu que lhe dá a opção de procurar produtos semelhantes ao produto.</p>
<h2 id="Keyword-based-search" class="common-anchor-header">Pesquisa baseada em palavras-chave<button data-href="#Keyword-based-search" class="anchor-icon" translate="no">
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
    </button></h2><p>A Tokopedia Search utiliza <strong>o Elasticsearch</strong> para a pesquisa e classificação de produtos. Para cada pedido de pesquisa, consultamos primeiro o Elasticsearch, que classifica os produtos de acordo com a consulta de pesquisa. O ElasticSearch armazena cada palavra como uma sequência de números que representam códigos <a href="https://en.wikipedia.org/wiki/ASCII">ASCII</a> (ou UTF) para cada letra. Constrói um <a href="https://en.wikipedia.org/wiki/Inverted_index">índice invertido</a> para descobrir rapidamente quais os documentos que contêm palavras da consulta do utilizador e, em seguida, encontra a melhor correspondência entre eles utilizando vários algoritmos de pontuação. Estes algoritmos de pontuação prestam pouca atenção ao significado das palavras, mas sim à frequência com que ocorrem no documento, à proximidade entre elas, etc. A representação ASCII contém obviamente informação suficiente para transmitir a semântica (afinal, nós, humanos, conseguimos compreendê-la). Infelizmente, não existe um bom algoritmo para o computador comparar palavras codificadas em ASCII pelo seu significado.</p>
<h2 id="Vector-representation" class="common-anchor-header">Representação vetorial<button data-href="#Vector-representation" class="anchor-icon" translate="no">
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
    </button></h2><p>Uma solução para este problema seria criar uma representação alternativa, que nos informasse não só sobre as letras contidas na palavra, mas também sobre o seu significado. Por exemplo, poderíamos codificar <em>as outras palavras com as quais a nossa palavra é frequentemente utilizada</em> (representadas pelo contexto provável). Assumiríamos então que contextos semelhantes representam coisas semelhantes e tentaríamos compará-los usando métodos matemáticos. Poderíamos até encontrar uma forma de codificar frases inteiras pelo seu significado.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_2_776af567a8.png" alt="Blog_How we used semantic search to make our search 10x smarter_2.png" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_2.png" />
   </span> <span class="img-wrapper"> <span>Blogue_Como utilizámos a pesquisa semântica para tornar a nossa pesquisa 10x mais inteligente_2.png</span> </span></p>
<h2 id="Select-an-embedding-similarity-search-engine" class="common-anchor-header">Selecionar um motor de pesquisa de similaridade de incorporação<button data-href="#Select-an-embedding-similarity-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Agora que temos vectores de caraterísticas, a questão que resta é como recuperar do grande volume de vectores aqueles que são semelhantes ao vetor alvo. No que diz respeito ao motor de pesquisa de embeddings, experimentámos o POC em vários motores disponíveis no Github, alguns deles são o FAISS, o Vearch e o Milvus.</p>
<p>Preferimos o Milvus a outros motores com base nos resultados dos testes de carga. Por um lado, já utilizámos o FAISS noutras equipas e, por isso, gostaríamos de experimentar algo novo. Em comparação com o Milvus, o FAISS é mais uma biblioteca subjacente, pelo que não é muito conveniente de utilizar. À medida que fomos aprendendo mais sobre o Milvus, acabámos por decidir adotar o Milvus pelas suas duas caraterísticas principais:</p>
<ul>
<li><p>O Milvus é muito fácil de utilizar. Tudo o que precisa de fazer é puxar a sua imagem Docker e atualizar os parâmetros com base no seu próprio cenário.</p></li>
<li><p>Suporta mais índices e tem documentação de apoio detalhada.</p></li>
</ul>
<p>Em suma, Milvus é muito amigável para os utilizadores e a documentação é bastante detalhada. Se se deparar com algum problema, pode normalmente encontrar soluções na documentação; caso contrário, pode sempre obter apoio da comunidade Milvus.</p>
<h2 id="Milvus-cluster-service" class="common-anchor-header">Serviço de cluster Milvus<button data-href="#Milvus-cluster-service" class="anchor-icon" translate="no">
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
    </button></h2><p>Depois de decidirmos utilizar o Milvus como motor de pesquisa de vectores de caraterísticas, decidimos utilizar o Milvus para um dos nossos casos de utilização do serviço Ads, em que queríamos fazer corresponder palavras-chave <a href="https://www.tradegecko.com/blog/wholesale-management/what-is-fill-rate-and-why-does-it-matter-for-wholesalers">de baixa taxa de preenchimento</a> com palavras-chave de alta taxa de preenchimento. Configurámos um nó autónomo num ambiente de desenvolvimento (DEV) e começámos a servir, estava a funcionar bem há alguns dias e a dar-nos melhores métricas de CTR/CVR. Se um nó autônomo falhasse na produção, todo o serviço ficaria indisponível. Assim, precisamos de implementar um serviço de pesquisa altamente disponível.</p>
<p>O Milvus fornece o Mishards, um middleware de fragmentação de clusters, e o Milvus-Helm para configuração. Na Tokopedia, usamos playbooks Ansible para a configuração da infraestrutura, então criamos um playbook para a orquestração da infraestrutura. O diagrama abaixo, retirado da documentação do Milvus, mostra como o Mishards funciona:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_3_4fa0c8a1a1.png" alt="Blog_How we used semantic search to make our search 10x smarter_3.png" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_3.png" />
   </span> <span class="img-wrapper"> <span>Blog_Como usámos a pesquisa semântica para tornar a nossa pesquisa 10x mais inteligente_3.png</span> </span></p>
<p>O Mishards faz um pedido em cascata do upstream para os seus sub-módulos, dividindo o pedido do upstream, e depois recolhe e devolve os resultados dos sub-serviços ao upstream. A arquitetura geral da solução de cluster baseada em Mishards é mostrada abaixo: <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_4_724618be4e.jpeg" alt="Blog_How we used semantic search to make our search 10x smarter_4.jpeg" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_4.jpeg" /><span>Blog_How we used semantic search to make our search 10x smarter_4.jpeg</span> </span></p>
<p>A documentação oficial fornece uma introdução clara do Mishards. Se estiver interessado, pode consultar a <a href="https://milvus.io/cn/docs/v0.10.2/mishards.md">Mishards</a>.</p>
<p>Em nosso serviço de palavra-chave para palavra-chave, implantamos um nó gravável, dois nós somente leitura e uma instância de middleware Mishards no GCP, usando o ansible Milvus. Até agora tem-se mantido estável. Um grande componente do que torna possível consultar com eficiência os conjuntos de dados de milhões, bilhões ou até trilhões de vetores dos quais os mecanismos de pesquisa de similaridade dependem é a <a href="https://milvus.io/docs/v0.10.5/index.md">indexação</a>, um processo de organização de dados que acelera drasticamente a pesquisa de big data.</p>
<h2 id="How-does-vector-indexing-accelerate-similarity-search" class="common-anchor-header">Como é que a indexação de vectores acelera a pesquisa por semelhança?<button data-href="#How-does-vector-indexing-accelerate-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Os mecanismos de pesquisa de similaridade funcionam comparando a entrada com um banco de dados para encontrar objetos que sejam mais semelhantes à entrada. A indexação é o processo de organização eficiente dos dados e desempenha um papel importante na utilidade da pesquisa por similaridade, acelerando drasticamente as consultas demoradas em grandes conjuntos de dados. Depois de um enorme conjunto de dados vectoriais ser indexado, as consultas podem ser encaminhadas para clusters, ou subconjuntos de dados, que têm maior probabilidade de conter vectores semelhantes a uma consulta de entrada. Na prática, isto significa que um certo grau de precisão é sacrificado para acelerar as consultas em dados vectoriais realmente grandes.</p>
<p>Pode ser feita uma analogia com um dicionário, onde as palavras são ordenadas alfabeticamente. Ao procurar uma palavra, é possível navegar rapidamente para uma secção que apenas contém palavras com a mesma inicial - acelerando drasticamente a procura da definição da palavra introduzida.</p>
<h2 id="What-next-you-ask" class="common-anchor-header">O que é que se segue, pergunta?<button data-href="#What-next-you-ask" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_5_035480c8af.jpeg" alt="Blog_How we used semantic search to make our search 10x smarter_5.jpeg" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_5.jpeg" />
   </span> <span class="img-wrapper"> <span>Blogue_Como utilizámos a pesquisa semântica para tornar a nossa pesquisa 10x mais inteligente_5.jpeg</span> </span></p>
<p>Como demonstrado acima, não existe uma solução que sirva para todos, queremos sempre melhorar o desempenho do modelo utilizado para obter os embeddings.</p>
<p>Além disso, de um ponto de vista técnico, queremos executar vários modelos de aprendizagem ao mesmo tempo e comparar os resultados das várias experiências. Esteja atento a este espaço para obter mais informações sobre as nossas experiências, como a pesquisa de imagens e a pesquisa de vídeos.</p>
<p><br/></p>
<h2 id="References" class="common-anchor-header">Referências:<button data-href="#References" class="anchor-icon" translate="no">
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
<li>Mishards Docs：https://milvus.io/docs/v0.10.2/mishards.md</li>
<li>Mishards: https://github.com/milvus-io/milvus/tree/master/shards</li>
<li>Milvus-Helm: https://github.com/milvus-io/milvus-helm/tree/master/charts/milvus</li>
</ul>
<p><br/></p>
<p><em>Este artigo do blogue foi republicado de: https://medium.com/tokopedia-engineering/how-we-used-semantic-search-to-make-our-search-10x-smarter-bd9c7f601821</em></p>
<p>Leia outras <a href="https://zilliz.com/user-stories">histórias de utilizadores</a> para saber mais sobre como fazer coisas com Milvus.</p>
