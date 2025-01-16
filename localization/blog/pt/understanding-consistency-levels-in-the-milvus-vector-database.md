---
id: understanding-consistency-levels-in-the-milvus-vector-database.md
title: Compreender o nível de coerência na base de dados de vectores Milvus
author: Chenglong Li
date: 2022-08-29T00:00:00.000Z
desc: >-
  Saiba mais sobre os quatro níveis de consistência - forte, estanqueidade
  limitada, sessão e eventual - suportados na base de dados vetorial Milvus.
cover: assets.zilliz.com/1280_X1280_0e0d4bc107.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_0e0d4bc107.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>Imagem da capa</span> </span></p>
<blockquote>
<p>Este artigo foi escrito por <a href="https://github.com/JackLCL">Chenglong Li</a> e transcrito por <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Já alguma vez se interrogou porque é que, por vezes, os dados que eliminou da base de dados vetorial Mlivus continuam a aparecer nos resultados da pesquisa?</p>
<p>Uma razão muito provável é não ter definido o nível de consistência adequado para a sua aplicação. O nível de consistência numa base de dados vetorial distribuída é fundamental, pois determina em que ponto uma determinada escrita de dados pode ser lida pelo sistema.</p>
<p>Por conseguinte, este artigo visa desmistificar o conceito de consistência e aprofundar os níveis de consistência suportados pela base de dados vetorial Milvus.</p>
<p><strong>Saltar para:</strong></p>
<ul>
<li><a href="#What-is-consistency">O que é consistência</a></li>
<li><a href="#Four-levels-of-consistency-in-the-Milvus-vector-database">Quatro níveis de consistência na base de dados vetorial Milvus</a><ul>
<li><a href="#Strong">Forte</a></li>
<li><a href="#Bounded-staleness">Estanquidade limitada</a></li>
<li><a href="#Session">Sessão</a></li>
<li><a href="#Eventual">Eventual</a></li>
</ul></li>
</ul>
<h2 id="What-is-consistency" class="common-anchor-header">O que é a consistência<button data-href="#What-is-consistency" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de começarmos, precisamos de clarificar a conotação de consistência neste artigo, uma vez que a palavra "consistência" é um termo sobrecarregado na indústria informática. A consistência numa base de dados distribuída refere-se especificamente à propriedade que garante que cada nó ou réplica tem a mesma visão dos dados quando escreve ou lê dados num determinado momento. Por conseguinte, estamos a falar de consistência como no <a href="https://en.wikipedia.org/wiki/CAP_theorem">teorema CAP</a>.</p>
<p>Para servir grandes empresas em linha no mundo moderno, é comum adotar várias réplicas. Por exemplo, o gigante do comércio eletrónico em linha Amazon replica as suas encomendas ou dados SKU em vários centros de dados, zonas ou mesmo países para garantir uma elevada disponibilidade do sistema em caso de falha ou avaria do mesmo. Isto coloca um desafio ao sistema - a consistência dos dados em várias réplicas. Sem consistência, é muito provável que o item eliminado do seu carrinho de compras da Amazon reapareça, causando uma experiência muito má para o utilizador.</p>
<p>Por isso, precisamos de diferentes níveis de consistência de dados para diferentes aplicações. Felizmente, Milvus, uma base de dados para IA, oferece flexibilidade no nível de consistência e pode definir o nível de consistência que melhor se adequa à sua aplicação.</p>
<h3 id="Consistency-in-the-Milvus-vector-database" class="common-anchor-header">Consistência na base de dados vetorial Milvus</h3><p>O conceito de nível de consistência foi introduzido pela primeira vez com o lançamento do Milvus 2.0. A versão 1.0 do Milvus não era uma base de dados vetorial distribuída, pelo que não envolvia níveis de consistência ajustáveis. O Milvus 1.0 descarrega os dados a cada segundo, o que significa que os novos dados são quase imediatamente visíveis após a sua inserção e que o Milvus lê a vista de dados mais actualizada no momento exato em que chega um pedido de pesquisa ou consulta de semelhanças vectoriais.</p>
<p>No entanto, o Milvus foi refacturado na sua versão 2.0 e <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">o Milvus 2.0 é uma base de dados vetorial distribuída</a> baseada num mecanismo pub-sub. O teorema <a href="https://en.wikipedia.org/wiki/PACELC_theorem">PACELC</a> indica que um sistema distribuído tem de fazer um compromisso entre consistência, disponibilidade e latência. Além disso, diferentes níveis de consistência servem para diferentes cenários. Por isso, o conceito de consistência foi introduzido no <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">Milvus 2.0</a> e suporta o ajuste de níveis de consistência.</p>
<h2 id="Four-levels-of-consistency-in-the-Milvus-vector-database" class="common-anchor-header">Quatro níveis de consistência na base de dados vetorial Milvus<button data-href="#Four-levels-of-consistency-in-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus suporta quatro níveis de consistência: forte, estanqueidade limitada, sessão e eventual. E um utilizador do Milvus pode especificar o nível de consistência ao <a href="https://milvus.io/docs/v2.1.x/create_collection.md">criar uma coleção</a> ou ao efetuar uma <a href="https://milvus.io/docs/v2.1.x/search.md">pesquisa</a> ou <a href="https://milvus.io/docs/v2.1.x/query.md">consulta</a> <a href="https://milvus.io/docs/v2.1.x/search.md">de semelhança de vectores</a>. Esta secção continuará a explicar as diferenças entre estes quatro níveis de consistência e para que cenários são mais adequados.</p>
<h3 id="Strong" class="common-anchor-header">Forte</h3><p>Forte é o nível de consistência mais elevado e mais rigoroso. Garante que os utilizadores podem ler a versão mais recente dos dados.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Strong_5d791eb8b2.png" alt="Strong" class="doc-image" id="strong" />
   </span> <span class="img-wrapper"> <span>Forte</span> </span></p>
<p>De acordo com o teorema PACELC, se o nível de consistência for definido como forte, a latência aumentará. Por conseguinte, recomendamos que escolha uma consistência forte durante os testes funcionais para garantir a exatidão dos resultados dos testes. Além disso, a consistência forte também é mais adequada para aplicações que exigem rigorosamente a consistência dos dados à custa da velocidade de pesquisa. Um exemplo pode ser um sistema financeiro em linha que lida com pagamentos de encomendas e faturação.</p>
<h3 id="Bounded-staleness" class="common-anchor-header">Estabilidade limitada</h3><p>A obsolescência limitada, como o próprio nome sugere, permite a inconsistência dos dados durante um determinado período de tempo. No entanto, geralmente, os dados são sempre globalmente consistentes fora desse período de tempo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Bounded_c034bc6e51.png" alt="Bounded_staleness" class="doc-image" id="bounded_staleness" />
   </span> <span class="img-wrapper"> <span>Staleness_limitado</span> </span></p>
<p>A estanquicidade limitada é adequada para cenários que necessitam de controlar a latência da pesquisa e podem aceitar a invisibilidade esporádica dos dados. Por exemplo, nos sistemas de recomendação, como os motores de recomendação de vídeo, a invisibilidade dos dados tem, de vez em quando, um impacto muito pequeno na taxa de recuperação global, mas pode aumentar significativamente o desempenho do sistema de recomendação. Um exemplo pode ser uma aplicação para acompanhar o estado das suas encomendas em linha.</p>
<h3 id="Session" class="common-anchor-header">Sessão</h3><p>A sessão garante que todas as escritas de dados podem ser imediatamente percepcionadas em leituras durante a mesma sessão. Por outras palavras, quando escreve dados através de um cliente, os dados recentemente inseridos tornam-se instantaneamente pesquisáveis.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Session_6dc4782212.png" alt="Session" class="doc-image" id="session" />
   </span> <span class="img-wrapper"> <span>Sessão</span> </span></p>
<p>Recomendamos a escolha da sessão como nível de consistência para os cenários em que a exigência de consistência dos dados na mesma sessão é elevada. Um exemplo pode ser a eliminação dos dados de uma entrada de livro do sistema da biblioteca e, após confirmação da eliminação e atualização da página (uma sessão diferente), o livro já não deve estar visível nos resultados da pesquisa.</p>
<h3 id="Eventual" class="common-anchor-header">Eventual</h3><p>Não existe uma ordem garantida de leituras e escritas, e as réplicas acabam por convergir para o mesmo estado, uma vez que não são efectuadas mais operações de escrita. Sob consistência eventual, as réplicas começam a trabalhar nos pedidos de leitura com os valores actualizados mais recentes. A consistência eventual é o nível mais fraco entre os quatro.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Eventual_7c66dd5b6f.png" alt="Eventual" class="doc-image" id="eventual" />
   </span> <span class="img-wrapper"> <span>Eventual</span> </span></p>
<p>No entanto, de acordo com o teorema PACELC, a latência da pesquisa pode ser tremendamente reduzida com o sacrifício da consistência. Portanto, a consistência eventual é mais adequada para cenários que não exigem muito da consistência dos dados, mas requerem um desempenho de pesquisa extremamente rápido. Um exemplo pode ser a recuperação de críticas e classificações de produtos da Amazon com consistência eventual.</p>
<h2 id="Endnote" class="common-anchor-header">Nota final<button data-href="#Endnote" class="anchor-icon" translate="no">
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
    </button></h2><p>Assim, voltando à questão levantada no início deste artigo, os dados eliminados ainda são devolvidos como resultados de pesquisa porque o utilizador não escolheu o nível de consistência adequado. O valor predefinido para o nível de consistência é bounded staleness (<code translate="no">Bounded</code>) na base de dados vetorial Milvus. Por conseguinte, a leitura dos dados pode atrasar-se e o Milvus pode ler a vista de dados antes de o utilizador efetuar operações de eliminação durante uma pesquisa ou consulta por semelhança. No entanto, este problema é simples de resolver. Basta <a href="https://milvus.io/docs/v2.1.x/tune_consistency.md">ajustar o nível de consistência</a> ao criar uma coleção ou ao efetuar uma pesquisa ou consulta de semelhanças vectoriais. Simples!</p>
<p>Na próxima publicação, vamos revelar o mecanismo subjacente e explicar como a base de dados vetorial Milvus atinge diferentes níveis de consistência. Fique atento!</p>
<h2 id="Whats-next" class="common-anchor-header">O que vem a seguir<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Com o lançamento oficial do Milvus 2.1, preparámos uma série de blogues que apresentam as novas funcionalidades. Leia mais nesta série de blogues:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Como utilizar dados de cadeias de caracteres para potenciar as suas aplicações de pesquisa por semelhança</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Usando o Embedded Milvus para instalar e executar instantaneamente o Milvus com Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Aumente a taxa de transferência de leitura do seu banco de dados vetorial com réplicas na memória</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Entendendo o nível de consistência no banco de dados vetorial do Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Entendendo o nível de consistência no banco de dados vetorial do Milvus (Parte II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Como o banco de dados vetorial Milvus garante a segurança dos dados?</a></li>
</ul>
