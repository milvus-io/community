---
id: multimodal-semantic-search-with-images-and-text.md
title: Pesquisa semântica multimodal com imagens e texto
author: Stefan Webb
date: 2025-02-3
desc: >-
  Saiba como criar uma aplicação de pesquisa semântica utilizando IA multimodal
  que compreende as relações texto-imagem, para além da correspondência básica
  de palavras-chave.
cover: >-
  assets.zilliz.com/Multimodal_Semantic_Search_with_Images_and_Text_1_3da9b83015.png
tag: Engineering
tags: 'Milvus, Vector Database, Open Source, Semantic Search, Multimodal AI'
recommend: true
canonicalUrl: 'https://milvus.io/blog/multimodal-semantic-search-with-images-and-text.md'
---
<iframe width="100%" height="315" src="https://www.youtube.com/embed/bxE0_QYX_sU?si=PkOHFcZto-rda1Fv" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>Como seres humanos, interpretamos o mundo através dos nossos sentidos. Ouvimos sons, vemos imagens, vídeos e textos, muitas vezes sobrepostos uns aos outros. Compreendemos o mundo através destas múltiplas modalidades e da relação entre elas. Para que a inteligência artificial possa realmente igualar ou exceder as capacidades humanas, tem de desenvolver esta mesma capacidade de compreender o mundo através de múltiplas lentes em simultâneo.</p>
<p>Nesta publicação, no vídeo que a acompanha (acima) e no <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/multimodal_retrieval_amazon_reviews.ipynb">bloco de notas</a>, apresentaremos os recentes avanços em modelos que podem processar texto e imagens em conjunto. Vamos demonstrar isto construindo uma aplicação de pesquisa semântica que vai além da simples correspondência de palavras-chave - compreende a relação entre o que os utilizadores estão a pedir e o conteúdo visual que estão a pesquisar.</p>
<p>O que torna este projeto particularmente empolgante é o facto de ser construído inteiramente com ferramentas de código aberto: a base de dados de vectores Milvus, as bibliotecas de aprendizagem automática da HuggingFace e um conjunto de dados de críticas de clientes da Amazon. É extraordinário pensar que, há apenas uma década, construir algo deste género teria exigido recursos proprietários significativos. Atualmente, estes poderosos componentes estão disponíveis gratuitamente e podem ser combinados de formas inovadoras por qualquer pessoa com curiosidade para experimentar.</p>
<custom-h1>Visão geral</custom-h1><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/overview_97a124bc9a.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A nossa aplicação de pesquisa multimodal é do tipo <em>retrieve-and-rerank.</em> Se estiver familiarizado com o <em>retrieval-augmented-generation</em> (RAG), é muito semelhante, só que o resultado final é uma lista de imagens que foram classificadas por um modelo de visão de linguagem de grande dimensão (LLVM). A consulta de pesquisa do utilizador contém texto e imagem, e o alvo é um conjunto de imagens indexadas numa base de dados vetorial. A arquitetura tem três passos - <em>indexação</em>, <em>recuperação</em> e <em>classificação</em> (semelhante a "geração") - que resumimos de seguida.</p>
<h2 id="Indexing" class="common-anchor-header">Indexação<button data-href="#Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>A nossa aplicação de pesquisa tem de ter algo para pesquisar. No nosso caso, usamos um pequeno subconjunto do conjunto de dados "Amazon Reviews 2023", que contém texto e imagens de avaliações de clientes da Amazon em todos os tipos de produtos. É possível imaginar uma pesquisa semântica como a que estamos a construir como um complemento útil para um sítio Web de comércio eletrónico. Utilizamos 900 imagens e descartamos o texto, embora observemos que este bloco de notas pode ser escalado para o tamanho de produção com a base de dados correta e implementações de inferência.</p>
<p>A primeira peça de "magia" no nosso pipeline é a escolha do modelo de incorporação. Usamos um modelo multimodal recentemente desenvolvido, chamado <a href="https://huggingface.co/BAAI/bge-visualized">Visualized BGE</a>, que é capaz de incorporar texto e imagens em conjunto, ou separadamente, no mesmo espaço com um único modelo em que os pontos próximos são semanticamente semelhantes. Recentemente, foram desenvolvidos outros modelos deste tipo, por exemplo, <a href="https://github.com/google-deepmind/magiclens">o MagicLens</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/indexing_1937241be5.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A figura acima ilustra: a incorporação para [uma imagem de um leão de lado] mais o texto "vista frontal disto" está próxima de uma incorporação para [uma imagem de um leão de frente] sem texto. O mesmo modelo é utilizado para entradas de texto e imagem e entradas só de imagem (bem como entradas só de texto). <em>Desta forma, o modelo é capaz de compreender a intenção do utilizador na forma como o texto de consulta se relaciona com a imagem de consulta.</em></p>
<p>Incorporamos as nossas 900 imagens de produtos sem o texto correspondente e armazenamos as incorporações numa base de dados vetorial utilizando <a href="https://milvus.io/docs">o Milvus</a>.</p>
<h2 id="Retrieval" class="common-anchor-header">Recuperação<button data-href="#Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>Agora que a nossa base de dados está construída, podemos servir uma consulta do utilizador. Imaginemos que um utilizador vem com a consulta: "uma capa de telemóvel com isto" mais [uma imagem de um Leopardo]. Ou seja, está à procura de capas de telemóvel com estampas de pele de leopardo.</p>
<p>Note-se que o texto da consulta do utilizador dizia "isto" em vez de "a pele de um Leopardo". O nosso modelo de incorporação deve ser capaz de ligar "isto" àquilo a que se refere, o que é um feito impressionante, dado que a iteração anterior de modelos não era capaz de lidar com instruções tão abertas. O <a href="https://arxiv.org/abs/2403.19651">documento MagicLens</a> dá outros exemplos.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Retrieval_ad64f48e49.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Inserimos o texto e a imagem da consulta em conjunto e efectuamos uma pesquisa de semelhanças na nossa base de dados de vectores, devolvendo os nove melhores resultados. Os resultados são apresentados na figura acima, juntamente com a imagem de consulta do leopardo. Verifica-se que o primeiro resultado não é o mais relevante para a consulta. O sétimo resultado parece ser o mais relevante - é uma capa de telemóvel com uma impressão de pele de leopardo.</p>
<h2 id="Generation" class="common-anchor-header">Geração<button data-href="#Generation" class="anchor-icon" translate="no">
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
    </button></h2><p>Parece que a nossa pesquisa falhou no facto de o resultado principal não ser o mais relevante. No entanto, podemos corrigir isso com uma etapa de reordenamento. Talvez esteja familiarizado com a reavaliação de itens recuperados como sendo um passo importante em muitos pipelines RAG. Utilizamos o <a href="https://huggingface.co/microsoft/Phi-3-vision-128k-instruct">Phi-3 Vision</a> como modelo de reclassificação.</p>
<p>Em primeiro lugar, pedimos a um LLVM para gerar uma legenda para a imagem consultada. O LLVM gera:</p>
<p><em>"A imagem mostra um grande plano do rosto de um leopardo, com destaque para o pelo manchado e os olhos verdes."</em></p>
<p>Em seguida, alimentamos esta legenda, uma única imagem com os nove resultados e a imagem de consulta, e construímos uma mensagem de texto pedindo ao modelo para reordenar os resultados, dando a resposta como uma lista e fornecendo uma razão para a escolha da melhor correspondência.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Generation_b016a6c26a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O resultado é visualizado na figura acima - o item mais relevante é agora o melhor resultado - e a razão dada é:</p>
<p><em>"O item mais adequado é o que tem o tema leopardo, que corresponde à instrução de consulta do utilizador para uma capa de telemóvel com um tema semelhante."</em></p>
<p>O nosso re-classificador LLVM foi capaz de efetuar a compreensão de imagens e texto e melhorar a relevância dos resultados da pesquisa. <em>Um artefacto interessante é que o re-classificador só deu oito resultados e deixou cair um, o que realça a necessidade de guardrails e de resultados estruturados.</em></p>
<h2 id="Summary" class="common-anchor-header">Resumo<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Neste post e no <a href="https://www.youtube.com/watch?v=bxE0_QYX_sU">vídeo</a> e <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/multimodal_retrieval_amazon_reviews.ipynb">bloco de</a> notas que o acompanham, construímos uma aplicação para pesquisa semântica multimodal em texto e imagens. O modelo de incorporação foi capaz de incorporar texto e imagens conjunta ou separadamente no mesmo espaço, e o modelo de fundação foi capaz de introduzir texto e imagem enquanto gerava texto em resposta. <em>Mais importante ainda, o modelo de incorporação foi capaz de relacionar a intenção do utilizador de uma instrução aberta com a imagem de consulta e, dessa forma, especificar como o utilizador queria que os resultados se relacionassem com a imagem introduzida.</em></p>
<p>Isto é apenas uma amostra do que está para vir num futuro próximo. Veremos muitas aplicações de pesquisa multimodal, compreensão e raciocínio multimodais, etc., em diversas modalidades: imagem, vídeo, áudio, moléculas, redes sociais, dados tabulares, séries temporais, o potencial é ilimitado.</p>
<p>E no centro destes sistemas está uma base de dados vetorial que contém a "memória" externa do sistema. O Milvus é uma excelente escolha para este fim. É de código aberto, tem todas as funcionalidades (ver <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">este artigo sobre a pesquisa de texto integral no Milvus 2.5</a>) e é escalável de forma eficiente para milhares de milhões de vectores com tráfego à escala da Web e latência inferior a 100 ms. Saiba mais na <a href="https://milvus.io/docs">documentação do Milvus</a>, junte-se à nossa comunidade <a href="https://milvus.io/discord">Discord</a> e esperamos vê-lo no nosso próximo <a href="https://lu.ma/unstructured-data-meetup">encontro de dados não estruturados</a>. Até lá!</p>
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
<li><p>Caderno de notas: <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/multimodal_retrieval_amazon_reviews.ipynb">"Pesquisa multimodal com comentários da Amazon e LLVM Reranking</a>"</p></li>
<li><p><a href="https://www.youtube.com/watch?v=bxE0_QYX_sU">Vídeo do Youtube AWS Developers</a></p></li>
<li><p><a href="https://milvus.io/docs">Documentação do Milvus</a></p></li>
<li><p><a href="https://lu.ma/unstructured-data-meetup">Encontro de dados não estruturados</a></p></li>
<li><p>Modelo de incorporação: <a href="https://huggingface.co/BAAI/bge-visualized">Cartão de modelo BGE visualizado</a></p></li>
<li><p>Modelo de incorporação alternativo: <a href="https://github.com/google-deepmind/magiclens">Repositório de modelos MagicLens</a></p></li>
<li><p>LLVM: <a href="https://huggingface.co/microsoft/Phi-3-vision-128k-instruct">Cartão de modelo Phi-3 Vision</a></p></li>
<li><p>Artigo: "<a href="https://arxiv.org/abs/2403.19651">MagicLens: Recuperação auto-supervisionada de imagens com instruções abertas</a>"</p></li>
<li><p>Conjunto de dados: <a href="https://amazon-reviews-2023.github.io/">Comentários da Amazon 2023</a></p></li>
</ul>
