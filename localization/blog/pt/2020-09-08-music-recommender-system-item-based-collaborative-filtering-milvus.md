---
id: music-recommender-system-item-based-collaborative-filtering-milvus.md
title: Selecionar um motor de pesquisa de similaridade de incorporação
author: milvus
date: 2020-09-08T00:01:59.064Z
desc: Um estudo de caso com a aplicação WANYIN
cover: assets.zilliz.com/header_f8cea596d2.png
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/music-recommender-system-item-based-collaborative-filtering-milvus
---
<custom-h1>Filtragem colaborativa baseada em itens para um sistema de recomendação de música</custom-h1><p>A aplicação Wanyin é uma comunidade de partilha de música baseada em IA com a intenção de incentivar a partilha de música e facilitar a composição de música para os entusiastas da música.</p>
<p>A biblioteca do Wanyin contém uma enorme quantidade de música carregada pelos utilizadores. A principal tarefa é selecionar a música de interesse com base no comportamento anterior dos utilizadores. Avaliámos dois modelos clássicos: a filtragem colaborativa baseada no utilizador (FC baseada no utilizador) e a filtragem colaborativa baseada no item (FC baseada no item), como potenciais modelos de sistemas de recomendação.</p>
<ul>
<li>A FC baseada no utilizador utiliza estatísticas de semelhança para obter utilizadores vizinhos com preferências ou interesses semelhantes. Com o conjunto recuperado de vizinhos mais próximos, o sistema pode prever o interesse do utilizador-alvo e gerar recomendações.</li>
<li>Introduzido pela Amazon, o CF baseado em itens, ou CF item-a-item (I2I), é um modelo de filtragem colaborativa bem conhecido para sistemas de recomendação. Calcula as semelhanças entre itens em vez de utilizadores, com base no pressuposto de que os itens de interesse devem ser semelhantes aos itens com pontuações elevadas.</li>
</ul>
<p>A FC baseada no utilizador pode levar a um tempo de cálculo proibitivamente longo quando o número de utilizadores ultrapassa um determinado ponto. Tendo em conta as caraterísticas do nosso produto, decidimos optar pelo I2I CF para implementar o sistema de recomendação de música. Dado que não possuímos muitos metadados sobre as músicas, temos de lidar com as músicas em si, extraindo-lhes vectores de caraterísticas (embeddings). Nossa abordagem é converter essas músicas em mel-frequency cepstrum (MFC), projetar uma rede neural convolucional (CNN) para extrair os embeddings de recursos das músicas e, em seguida, fazer recomendações de música por meio da pesquisa de similaridade de embedding.</p>
<h2 id="🔎-Select-an-embedding-similarity-search-engine" class="common-anchor-header">Selecionar um motor de pesquisa de similaridade de incorporação<button data-href="#🔎-Select-an-embedding-similarity-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Agora que temos vectores de caraterísticas, a questão remanescente é como recuperar do grande volume de vectores aqueles que são semelhantes ao vetor alvo. No que diz respeito ao motor de pesquisa de embeddings, estávamos a ponderar entre o Faiss e o Milvus. Eu notei Milvus quando estava passando pelos repositórios de tendências do GitHub em novembro de 2019. Eu dei uma olhada no projeto e ele me atraiu com suas APIs abstratas. (Na altura estava na v0.5.x e agora na v0.10.2).</p>
<p>Preferimos o Milvus ao Faiss. Por um lado, já usámos o Faiss antes e, por isso, gostaríamos de experimentar algo novo. Por outro lado, comparado com Milvus, Faiss é mais uma biblioteca subjacente, portanto não é muito conveniente de usar. À medida que fomos aprendendo mais sobre Milvus, decidimos finalmente adotar Milvus pelas suas duas caraterísticas principais:</p>
<ul>
<li>Milvus é muito fácil de usar. Tudo o que precisa de fazer é puxar a sua imagem Docker e atualizar os parâmetros com base no seu próprio cenário.</li>
<li>Suporta mais índices e tem documentação de apoio detalhada.</li>
</ul>
<p>Em suma, Milvus é muito amigável para os utilizadores e a documentação é bastante detalhada. Se se deparar com algum problema, pode normalmente encontrar soluções na documentação; caso contrário, pode sempre obter apoio da comunidade Milvus.</p>
<h2 id="Milvus-cluster-service-☸️-⏩" class="common-anchor-header">Serviço de cluster Milvus ☸️ ⏩<button data-href="#Milvus-cluster-service-☸️-⏩" class="anchor-icon" translate="no">
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
    </button></h2><p>Depois de decidirmos utilizar o Milvus como motor de pesquisa de vectores de caraterísticas, configurámos um nó autónomo num ambiente de desenvolvimento (DEV). Estava a funcionar bem há alguns dias, pelo que planeámos executar testes num ambiente de teste de aceitação de fábrica (FAT). Se um nó autónomo falhasse em produção, todo o serviço ficaria indisponível. Assim, precisamos de implementar um serviço de pesquisa altamente disponível.</p>
<p>O Milvus fornece o Mishards, um middleware de fragmentação de clusters, e o Milvus-Helm para configuração. O processo de implementação de um serviço de cluster Milvus é simples. Só precisamos atualizar alguns parâmetros e empacotá-los para implantação no Kubernetes. O diagrama abaixo, retirado da documentação do Milvus, mostra como o Mishards funciona:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_how_mishards_works_in_milvus_documentation_43a73076bf.png" alt="1-how-mishards-works-in-milvus-documentation.png" class="doc-image" id="1-how-mishards-works-in-milvus-documentation.png" />
   </span> <span class="img-wrapper"> <span>1-how-mishards-works-in-milvus-documentation.png</span> </span></p>
<p>O Mishards faz uma solicitação em cascata do upstream para seus sub-módulos que dividem a solicitação do upstream e, em seguida, coleta e retorna os resultados dos sub-serviços para o upstream. A arquitetura geral da solução de cluster baseada em Mishards é mostrada abaixo:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_mishards_based_cluster_solution_architecture_3ad89cf269.jpg" alt="2-mishards-based-cluster-solution-architecture.jpg" class="doc-image" id="2-mishards-based-cluster-solution-architecture.jpg" />
   </span> <span class="img-wrapper"> <span>2-mishards-based-cluster-solution-architecture.jpg</span> </span></p>
<p>A documentação oficial fornece uma introdução clara do Mishards. Pode consultar o <a href="https://milvus.io/cn/docs/v0.10.2/mishards.md">Mishards</a> se estiver interessado.</p>
<p>No nosso sistema de recomendação de música, implantamos um nó gravável, dois nós somente leitura e uma instância de middleware Mishards no Kubernetes, usando Milvus-Helm. Depois que o serviço estava funcionando de forma estável em um ambiente FAT por um tempo, nós o implantamos em produção. Até à data, tem-se mantido estável.</p>
<h2 id="🎧-I2I-music-recommendation-🎶" class="common-anchor-header">Recomendação de música I2I 🎶<button data-href="#🎧-I2I-music-recommendation-🎶" class="anchor-icon" translate="no">
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
    </button></h2><p>Como já foi referido, criámos o sistema de recomendação de música I2I da Wanyin utilizando os embeddings extraídos das canções existentes. Em primeiro lugar, separámos o vocal e o BGM (separação de faixas) de uma nova canção carregada pelo utilizador e extraímos os embeddings do BGM como representação da caraterística da canção. Isto também ajuda a selecionar versões cover de canções originais. Em seguida, armazenámos estes embeddings no Milvus, procurámos canções semelhantes com base nas canções que o utilizador ouviu e, depois, ordenámos e reorganizámos as canções recuperadas para gerar recomendações de música. O processo de implementação é mostrado abaixo:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_music_recommender_system_implementation_c52a333eb8.png" alt="3-music-recommender-system-implementation.png" class="doc-image" id="3-music-recommender-system-implementation.png" />
   </span> <span class="img-wrapper"> <span>3-music-recommender-system-implementation.png</span> </span></p>
<h2 id="🚫-Duplicate-song-filter" class="common-anchor-header">Filtro de músicas duplicadas<button data-href="#🚫-Duplicate-song-filter" class="anchor-icon" translate="no">
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
    </button></h2><p>Outro cenário em que utilizamos o Milvus é a filtragem de músicas duplicadas. Alguns utilizadores carregam a mesma música ou clip várias vezes, e estas músicas duplicadas podem aparecer na sua lista de recomendações. Isto significa que a geração de recomendações sem pré-processamento afectaria a experiência do utilizador. Por isso, temos de descobrir as músicas duplicadas e garantir que não aparecem na mesma lista através do pré-processamento.</p>
<p>Outro cenário em que utilizamos o Milvus é a filtragem de músicas duplicadas. Alguns utilizadores carregam a mesma música ou clip várias vezes, e estas músicas duplicadas podem aparecer na sua lista de recomendações. Isto significa que a geração de recomendações sem pré-processamento afectaria a experiência do utilizador. Por isso, temos de descobrir as músicas duplicadas e garantir que não aparecem na mesma lista através do pré-processamento.</p>
<p>Tal como no cenário anterior, implementámos a filtragem de canções duplicadas através da procura de vectores de caraterísticas semelhantes. Primeiro, separámos a voz e a música de fundo e obtivemos um conjunto de canções semelhantes utilizando o Milvus. Para filtrar com precisão as canções duplicadas, extraímos as impressões digitais de áudio da canção alvo e das canções semelhantes (com tecnologias como Echoprint, Chromaprint, etc.), calculámos a semelhança entre a impressão digital de áudio da canção alvo e cada uma das impressões digitais das canções semelhantes. Se a semelhança ultrapassar o limiar, definimos uma canção como um duplicado da canção alvo. O processo de correspondência de impressões digitais de áudio torna a filtragem de canções duplicadas mais precisa, mas também é moroso. Por isso, quando se trata de filtrar canções numa biblioteca de música maciça, utilizamos o Milvus para filtrar as nossas canções candidatas a duplicado como passo preliminar.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_using_milvus_filter_songs_music_recommender_duplicates_0ff68d3e67.png" alt="4-using-milvus-filter-songs-music-recommender-duplicates.png" class="doc-image" id="4-using-milvus-filter-songs-music-recommender-duplicates.png" />
   </span> <span class="img-wrapper"> <span>4-usar-milvus-filtrar-músicas-recomendador-duplicadas.png</span> </span></p>
<p>Para implementar o sistema de recomendação I2I para a enorme biblioteca de música do Wanyin, a nossa abordagem consiste em extrair os "embeddings" das canções como sua caraterística, recuperar "embeddings" semelhantes ao "embedding" da canção alvo e, em seguida, ordenar e reorganizar os resultados para gerar listas de recomendação para o utilizador. Para obter recomendações em tempo real, escolhemos o Milvus em vez do Faiss como motor de pesquisa de semelhanças de vectores de caraterísticas, uma vez que o Milvus se revela mais fácil de utilizar e sofisticado. Da mesma forma, também aplicámos o Milvus ao nosso filtro de músicas duplicadas, o que melhora a experiência e a eficiência do utilizador.</p>
<p>Pode descarregar a <a href="https://enjoymusic.ai/wanyin">aplicação Wanyin</a> 🎶 e experimentá-la. (Nota: pode não estar disponível em todas as lojas de aplicações).</p>
<h3 id="📝-Authors" class="common-anchor-header">📝 Autores:</h3><p>Jason, Engenheiro de Algoritmos da Stepbeats Shiyu Chen, Engenheiro de Dados da Zilliz</p>
<h3 id="📚-References" class="common-anchor-header">Referências:</h3><p>Mishards Docs: https://milvus.io/docs/v0.10.2/mishards.md Mishards: https://github.com/milvus-io/milvus/tree/master/shards Milvus-Helm: https://github.com/milvus-io/milvus-helm/tree/master/charts/milvus</p>
<p><strong>Não seja um estranho, siga-nos no <a href="https://twitter.com/milvusio/">Twitter</a> ou junte-se a nós no <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/">Slack</a>! 👇🏻</strong></p>
